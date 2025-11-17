"use client";
import "./checkout.css";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState({}); // { bookId: discount }
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoApplying, setPromoApplying] = useState(false);

  // Tính giá sau discount - ưu tiên discountPercent nếu có cả 2
  function calculatePriceAfterDiscount(book, discount) {
    if (!discount) return book.sellingPrice;

    let finalPrice = book.sellingPrice;

    // Ưu tiên discountPercent nếu có cả 2
    if (discount.discountPercent != null && discount.discountPercent > 0) {
      finalPrice = book.sellingPrice * (1 - discount.discountPercent / 100);
    } else if (discount.discountAmount != null && discount.discountAmount > 0) {
      finalPrice = Math.max(0, book.sellingPrice - discount.discountAmount);
    }

    return Math.round(finalPrice);
  }

  // Tính tổng với discount
  const total = cartItems.reduce((sum, item) => {
    const discount = discounts[item.book.id];
    const priceAfterDiscount = calculatePriceAfterDiscount(item.book, discount);
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  const orderLevelDiscount =
    appliedPromotion?.discountAmount != null
      ? appliedPromotion.discountAmount
      : 0;
  const orderTotalAfterPromo = Math.max(
    0,
    appliedPromotion?.finalAmount != null ? appliedPromotion.finalAmount : total
  );

  // Tổng giá gốc (không discount)
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.book.sellingPrice * item.quantity,
    0
  );

  useEffect(() => {
    // Lấy userId từ localStorage (giống như cart page)
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setUser({ fullName: "", phoneNumber: "", address: "", email: "" });
      return;
    }

    async function fetchData() {
      try {
        const userRes = await fetch(
          `http://localhost:8080/api/users/${userId}`
        );

        const userData = userRes.ok
          ? await userRes.json()
          : { fullName: "", phoneNumber: "", address: "", email: "" };

        setUser({
          fullName: userData.fullName || "",
          phoneNumber: userData.phoneNumber || "",
          address: userData.address || "",
          email: userData.email || "",
        });

        // ✅ Kiểm tra "Mua ngay" item từ sessionStorage
        const buyNowItemStr = sessionStorage.getItem("buyNowItem");
        let items = [];

        if (buyNowItemStr) {
          try {
            const buyNowItem = JSON.parse(buyNowItemStr);
            // Kiểm tra xem item có còn hợp lệ không (trong vòng 5 phút)
            const isValid = Date.now() - buyNowItem.timestamp < 5 * 60 * 1000;

            if (isValid) {
              // Nếu có buyNowItem, lấy từ cart và cập nhật số lượng
              const cartRes = await fetch(
                `http://localhost:8080/api/carts/users/${userId}`
              );

              const cartData = cartRes.ok ? await cartRes.json() : [];
              items = Array.isArray(cartData) ? cartData : [];

              // Tìm item trong cart và cập nhật số lượng từ buyNowItem
              const cartItemIndex = items.findIndex(
                (item) => item.book?.id === buyNowItem.bookId
              );

              if (cartItemIndex !== -1) {
                // Cập nhật số lượng từ buyNowItem
                items[cartItemIndex].quantity = buyNowItem.quantity;
              } else if (buyNowItem.book) {
                // Nếu chưa có trong cart, thêm item từ buyNowItem
                items.push({
                  book: buyNowItem.book,
                  quantity: buyNowItem.quantity,
                  price: buyNowItem.book.sellingPrice,
                });
              }
            } else {
              // Item không còn hợp lệ, xóa và lấy từ cart bình thường
              sessionStorage.removeItem("buyNowItem");
              const cartRes = await fetch(
                `http://localhost:8080/api/carts/users/${userId}`
              );
              const cartData = cartRes.ok ? await cartRes.json() : [];
              items = Array.isArray(cartData) ? cartData : [];
            }
          } catch (err) {
            console.error("Error parsing buyNowItem:", err);
            // Nếu có lỗi, lấy từ cart bình thường
            const cartRes = await fetch(
              `http://localhost:8080/api/carts/users/${userId}`
            );
            const cartData = cartRes.ok ? await cartRes.json() : [];
            items = Array.isArray(cartData) ? cartData : [];
          }
        } else {
          // Không có buyNowItem, lấy từ cart bình thường
          const cartRes = await fetch(
            `http://localhost:8080/api/carts/users/${userId}`
          );
          const cartData = cartRes.ok ? await cartRes.json() : [];
          items = Array.isArray(cartData) ? cartData : [];
        }

        setCartItems(items);

        // Fetch discounts cho từng book - giống cart page
        const discountMap = {};
        const now = new Date();

        for (const item of items) {
          try {
            const discountRes = await fetch(
              `http://localhost:8080/api/book-discounts/book/${item.book.id}`
            );
            if (!discountRes.ok) continue;

            const discountData = await discountRes.json();

            // Tìm discount active (trong khoảng thời gian) - giống productDetail
            let activeDiscount = discountData.find((discount) => {
              const startDate = new Date(discount.startDate);
              const endDate = new Date(discount.endDate);
              return now >= startDate && now <= endDate;
            });

            // Nếu không có active, lấy discount đầu tiên (để test) - giống productDetail
            if (!activeDiscount && discountData.length > 0) {
              activeDiscount = discountData[0];
            }

            if (activeDiscount) {
              discountMap[item.book.id] = activeDiscount;
            }
          } catch (err) {
            console.error(
              `Error fetching discount for book ${item.book.id}:`,
              err
            );
          }
        }

        setDiscounts(discountMap);
      } catch (err) {
        console.error("Không fetch được, backend chưa bật:", err);

        // ✅ fallback data
        setUser({ fullName: "", phoneNumber: "", address: "", email: "" });
        setCartItems([]);
      }
    }

    fetchData();

    // ✅ Lắng nghe sự kiện khi back lại và thay đổi số lượng
    const handleStorageChange = (e) => {
      if (e.key === "buyNowItem" || e.key === null) {
        fetchData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Lắng nghe custom event từ product detail page
    const handleBuyNowUpdate = () => {
      fetchData();
    };
    window.addEventListener("buy-now-updated", handleBuyNowUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("buy-now-updated", handleBuyNowUpdate);
    };
  }, []);

  async function handleApplyPromotion(e) {
    e?.preventDefault();
    if (!promoCode.trim()) {
      setPromoError("Vui lòng nhập mã khuyến mãi");
      return;
    }

    setPromoApplying(true);
    setPromoError("");

    try {
      const res = await fetch("http://localhost:8080/api/promotions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode.trim(),
          totalAmount: total,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Không áp dụng được mã giảm giá");
      }

      const data = await res.json();
      setAppliedPromotion(data);
      setPromoError("");
    } catch (err) {
      setAppliedPromotion(null);
      setPromoError(err.message || "Không áp dụng được mã giảm giá");
    } finally {
      setPromoApplying(false);
    }
  }

  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setPromoCode("");
    setPromoError("");
  };

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!user?.fullName || !user?.address || !user?.phoneNumber) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    // Giả định mặc định: serviceId = 1, paymentId = 1
    const userId = localStorage.getItem("userId");
    const orderPayload = {
      userId: userId ? parseInt(userId) : null,
      serviceId: 1,
      paymentId: 1,
      note: appliedPromotion
        ? `Giao buổi sáng - Áp dụng mã ${appliedPromotion.code}`
        : "Giao buổi sáng",
      status: "PENDING",
      orderDate: new Date().toISOString(), // Gửi full ISO string để Jackson parse thành Date
      shippingAddress: user.address,
      phoneNumber: user.phoneNumber,
      cartItems: cartItems.map((item) => {
        const discount = discounts[item.book.id];
        const priceAfterDiscount = calculatePriceAfterDiscount(
          item.book,
          discount
        );
        return {
          bookId: item.book.id,
          quantity: item.quantity,
          price: priceAfterDiscount, // Sử dụng giá sau discount
        };
      }),
      promotionCode: appliedPromotion?.code || null,
      promotionDiscountAmount: orderLevelDiscount,
      orderTotal: orderTotalAfterPromo,
    };

    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Không thể tạo đơn hàng");
      }

      const data = await res.json();
      console.log("✅ Order created:", data);
      console.log("Order ID:", data.id);
      console.log("User ID:", orderPayload.userId);

      // ✅ Sau khi đặt hàng thành công thì xóa giỏ hàng
      try {
        await fetch(
          `http://localhost:8080/api/carts/users/${orderPayload.userId}`,
          {
            method: "DELETE",
          }
        );
      } catch (err) {
        console.error("Error deleting cart:", err);
        // Vẫn tiếp tục dù xóa cart có lỗi
      }

      alert("Đặt hàng thành công!");
      // Xóa cart count
      localStorage.setItem("cartCount", "0");
      window.dispatchEvent(new Event("cart-updated"));

      // Thêm delay nhỏ để đảm bảo order được lưu vào DB
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect đến order history
      window.location.href = "/orderhistory";
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn hàng:", err);
      alert("Đặt hàng thất bại, vui lòng thử lại!");
    }
  }

  // ✅ Chỉ check user, không check giỏ hàng
  if (!user) {
    return (
      <p style={{ padding: 20, textAlign: "center", fontSize: "18px" }}>
        Đang tải dữ liệu...
      </p>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT */}
        <div className="checkout-left">
          <h2 className="section-title">Thông tin giao hàng</h2>

          <div className="user-info">
            <p>
              <strong>{user.fullName}</strong> ({user.email})
            </p>
            <a href="#">Đăng xuất</a>
          </div>

          <form className="checkout-form">
            {/* Họ tên luôn readonly */}
            <input type="text" value={user.fullName || ""} readOnly />

            {/* Số điện thoại */}
            <input
              type="text"
              value={user.phoneNumber || ""}
              placeholder="Nhập số điện thoại"
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setUser({ ...user, phoneNumber: value });
                }
              }}
            />

            {/* Địa chỉ */}
            <input
              type="text"
              value={user.address || ""}
              placeholder="Nhập địa chỉ giao hàng"
              maxLength={50}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </form>

          <h2 className="section-title">Phương thức vận chuyển</h2>
          <div className="shipping-method">
            <div className="shipping-box">
              <img src="https://cdn-icons-png.flaticon.com/512/481/481489.png" />
              <p>
                Vui lòng chọn địa chỉ để xem danh sách phương thức vận chuyển.
              </p>
            </div>
          </div>

          <h2 className="section-title">Phương thức thanh toán</h2>
          <div className="payment-methods">
            <label className="payment-option">
              <input type="radio" name="payment" defaultChecked />
              <span>Thanh toán khi giao hàng (COD)</span>
            </label>
            <label className="payment-option">
              <input type="radio" name="payment" />
              <span>Chuyển khoản ngân hàng</span>
            </label>
          </div>

          <button
            type="button"
            className="btn-submit"
            onClick={handlePlaceOrder}
          >
            Hoàn tất đơn hàng
          </button>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <div className="order-summary">
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Mã khuyến mãi</p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="text"
                  value={promoCode}
                  placeholder="Nhập mã giảm giá"
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={!!appliedPromotion}
                  style={{
                    flex: 1,
                    minWidth: 180,
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                />
                {appliedPromotion ? (
                  <button
                    type="button"
                    onClick={handleRemovePromotion}
                    style={{
                      backgroundColor: "#f87171",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Hủy mã
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyPromotion}
                    disabled={promoApplying}
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: 6,
                      cursor: "pointer",
                      opacity: promoApplying ? 0.7 : 1,
                    }}
                  >
                    {promoApplying ? "Đang áp dụng..." : "Áp dụng"}
                  </button>
                )}
              </div>
              {promoError && (
                <p style={{ color: "#dc2626", marginTop: 8 }}>{promoError}</p>
              )}
              {appliedPromotion && !promoError && (
                <p style={{ color: "#15803d", marginTop: 8 }}>
                  Đã áp dụng mã {appliedPromotion.code} (-{" "}
                  {orderLevelDiscount.toLocaleString("vi-VN")}đ)
                </p>
              )}
            </div>

            {cartItems.length === 0 && (
              <p style={{ textAlign: "center", padding: "20px", opacity: 0.7 }}>
                Không có sản phẩm nào trong giỏ hàng
              </p>
            )}

            {cartItems.length > 0 &&
              cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.book.imageUrl} />
                  <div className="item-info">
                    <p className="item-title">{item.book.title}</p>
                    <p className="item-author">{item.book.author}</p>
                    <p className="item-quantity">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    {(() => {
                      const discount = discounts[item.book.id];
                      const priceAfterDiscount = calculatePriceAfterDiscount(
                        item.book,
                        discount
                      );
                      const hasDiscount =
                        discount &&
                        ((discount.discountPercent != null &&
                          discount.discountPercent > 0) ||
                          (discount.discountAmount != null &&
                            discount.discountAmount > 0));

                      // Format discount text - giống productDetail
                      const discountText = hasDiscount
                        ? discount.discountPercent != null &&
                          discount.discountPercent > 0
                          ? `-${discount.discountPercent}%`
                          : discount.discountAmount != null &&
                            discount.discountAmount > 0
                          ? `-${discount.discountAmount.toLocaleString(
                              "vi-VN"
                            )}đ`
                          : null
                        : null;

                      return (
                        <>
                          {/* Price row - giống productDetail */}
                          <div className="priceRow">
                            <span className="newPrice">
                              {(
                                priceAfterDiscount * item.quantity
                              ).toLocaleString("vi-VN")}
                              đ
                            </span>
                            {/* Badge discount kế bên giá - giống productDetail */}
                            {hasDiscount && discountText && (
                              <span className="discountBadge">
                                {discountText}
                              </span>
                            )}
                          </div>
                          {/* Giá cũ - chỉ hiển thị khi có discount */}
                          {hasDiscount && (
                            <span className="oldPrice">
                              {(
                                item.book.sellingPrice * item.quantity
                              ).toLocaleString("vi-VN")}
                              đ
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}

            <div className="summary-line">
              <span>Tạm tính</span>
              <span>{originalTotal.toLocaleString("vi-VN")}đ</span>
            </div>

            {originalTotal > total && (
              <div className="summary-line" style={{ color: "#e53935" }}>
                <span>Giảm giá</span>
                <span>-{(originalTotal - total).toLocaleString("vi-VN")}đ</span>
              </div>
            )}

            {appliedPromotion && orderLevelDiscount > 0 && (
              <div className="summary-line" style={{ color: "#16a34a" }}>
                <span>Mã {appliedPromotion.code}</span>
                <span>-{orderLevelDiscount.toLocaleString("vi-VN")}đ</span>
              </div>
            )}

            <div className="summary-line">
              <span>Phí vận chuyển</span>
              <span>—</span>
            </div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{orderTotalAfterPromo.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
