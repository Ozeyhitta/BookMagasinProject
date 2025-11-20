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

  // 🚚 SHIPPING
  const SHIPPING_METHODS = [
    {
      id: 1,
      name: "Giao hàng tiêu chuẩn",
      desc: "2 - 4 ngày làm việc",
      fee: 20000,
    },
    {
      id: 2,
      name: "Giao nhanh",
      desc: "Trong 24 - 48 giờ",
      fee: 40000,
    },
    {
      id: 3,
      name: "Nhận tại cửa hàng",
      desc: "Nhận tại điểm giao dịch, miễn phí vận chuyển",
      fee: 0,
    },
  ];

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  const handleSelectShipping = (method) => {
    setSelectedShipping(method);
    setShippingFee(method.fee || 0);
  };

  // Tính giá sau discount - ưu tiên discountPercent nếu có cả 2
  function calculatePriceAfterDiscount(book, discount) {
    if (!discount) return book.sellingPrice;

    let finalPrice = book.sellingPrice;

    if (discount.discountPercent != null && discount.discountPercent > 0) {
      finalPrice = book.sellingPrice * (1 - discount.discountPercent / 100);
    } else if (discount.discountAmount != null && discount.discountAmount > 0) {
      finalPrice = Math.max(0, book.sellingPrice - discount.discountAmount);
    }

    return Math.round(finalPrice);
  }

  // Tính tổng với discount (chưa gồm phí ship & mã khuyến mãi toàn đơn)
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

  // Tổng cuối cùng = tiền hàng sau mã KM + phí ship (hiển thị cho người dùng)
  const grandTotal = orderTotalAfterPromo + shippingFee;

  // Tổng giá gốc (không discount)
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.book.sellingPrice * item.quantity,
    0
  );

  useEffect(() => {
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
            const isValid = Date.now() - buyNowItem.timestamp < 5 * 60 * 1000;

            if (isValid) {
              const cartRes = await fetch(
                `http://localhost:8080/api/carts/users/${userId}`
              );

              const cartData = cartRes.ok ? await cartRes.json() : [];
              items = Array.isArray(cartData) ? cartData : [];

              const cartItemIndex = items.findIndex(
                (item) => item.book?.id === buyNowItem.bookId
              );

              if (cartItemIndex !== -1) {
                items[cartItemIndex].quantity = buyNowItem.quantity;
              } else if (buyNowItem.book) {
                items.push({
                  book: buyNowItem.book,
                  quantity: buyNowItem.quantity,
                  price: buyNowItem.book.sellingPrice,
                });
              }
            } else {
              sessionStorage.removeItem("buyNowItem");
              const cartRes = await fetch(
                `http://localhost:8080/api/carts/users/${userId}`
              );
              const cartData = cartRes.ok ? await cartRes.json() : [];
              items = Array.isArray(cartData) ? cartData : [];
            }
          } catch (err) {
            console.error("Error parsing buyNowItem:", err);
            const cartRes = await fetch(
              `http://localhost:8080/api/carts/users/${userId}`
            );
            const cartData = cartRes.ok ? await cartRes.json() : [];
            items = Array.isArray(cartData) ? cartData : [];
          }
        } else {
          const cartRes = await fetch(
            `http://localhost:8080/api/carts/users/${userId}`
          );
          const cartData = cartRes.ok ? await cartRes.json() : [];
          items = Array.isArray(cartData) ? cartData : [];
        }

        setCartItems(items);

        // Fetch discounts cho từng book
        const discountMap = {};
        const now = new Date();

        for (const item of items) {
          try {
            const discountRes = await fetch(
              `http://localhost:8080/api/book-discounts/book/${item.book.id}`
            );
            if (!discountRes.ok) continue;

            const discountData = await discountRes.json();

            let activeDiscount = discountData.find((discount) => {
              const startDate = new Date(discount.startDate);
              const endDate = new Date(discount.endDate);
              return now >= startDate && now <= endDate;
            });

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

        setUser({ fullName: "", phoneNumber: "", address: "", email: "" });
        setCartItems([]);
      }
    }

    fetchData();

    const handleStorageChange = (e) => {
      if (e.key === "buyNowItem" || e.key === null) {
        fetchData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

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

  // ✅ HÀM ĐẶT HÀNG
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

    if (!selectedShipping) {
      alert("Vui lòng chọn phương thức vận chuyển!");
      return;
    }

    const userIdStr = localStorage.getItem("userId");
    const userId = userIdStr ? parseInt(userIdStr, 10) : null;

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng, hãy đăng nhập lại!");
      return;
    }

    const serviceId = selectedShipping.id; // mapping sang Service.id ở backend

    // 👉 Chỉ gửi đúng các field có trong OrderDto ở backend
    const orderPayload = {
      userId: userId,
      serviceId: serviceId,
      paymentId: 1, // trong DB phải có payment id = 1
      note: appliedPromotion
        ? `Giao buổi sáng - ${selectedShipping.name} - Áp dụng mã ${appliedPromotion.code}`
        : `Giao buổi sáng - ${selectedShipping.name}`,
      status: "PENDING",
      // KHÔNG gửi orderDate, backend tự set ngày hiện tại
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
          orderId: null, // backend không dùng, có thể để null
          quantity: item.quantity,
          price: priceAfterDiscount,
        };
      }),
    };

    console.log("👉 Payload gửi lên /api/orders:", orderPayload);

    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Lỗi tạo đơn hàng (response):", res.status, text);
        alert(
          "Đặt hàng thất bại, lỗi từ server: " +
            (text || "HTTP " + res.status)
        );
        return;
      }

      const data = await res.json();
      console.log("✅ Order created:", data);

      // Xóa giỏ hàng
      try {
        await fetch(`http://localhost:8080/api/carts/users/${userId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Error deleting cart:", err);
      }

      alert("Đặt hàng thành công!");
      localStorage.setItem("cartCount", "0");
      window.dispatchEvent(new Event("cart-updated"));

      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = "/orderhistory";
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn hàng:", err);
      alert("Đặt hàng thất bại, vui lòng thử lại!");
    }
  }

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
            <input type="text" value={user.fullName || ""} readOnly />

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
            {!user.address?.trim() || cartItems.length === 0 ? (
              <div className="shipping-box">
                <img src="https://cdn-icons-png.flaticon.com/512/481/481489.png" />
                <p>
                  Vui lòng nhập địa chỉ và có ít nhất 1 sản phẩm để xem danh
                  sách phương thức vận chuyển.
                </p>
              </div>
            ) : (
              <div className="shipping-options">
                {SHIPPING_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={
                      "shipping-option" +
                      (selectedShipping?.id === m.id ? " active" : "")
                    }
                    onClick={() => handleSelectShipping(m)}
                  >
                    <div className="shipping-option-header">
                      <div
                        className="shipping-option-name"
                        style={{ color: "#111" }} // 👈 đảm bảo chữ đen
                      >
                        {m.name}
                      </div>
                      <div
                        className="shipping-option-fee"
                        style={{ color: "#111" }} // 👈 đảm bảo chữ đen
                      >
                        {m.fee === 0
                          ? "Miễn phí"
                          : `${m.fee.toLocaleString("vi-VN")}đ`}
                      </div>
                    </div>
                    <div
                      className="shipping-option-desc"
                      style={{ color: "#111" }} // 👈 đảm bảo chữ đen
                    >
                      {m.desc}
                    </div>
                  </button>
                ))}
              </div>
            )}
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
                          <div className="priceRow">
                            <span className="newPrice">
                              {(
                                priceAfterDiscount * item.quantity
                              ).toLocaleString("vi-VN")}
                              đ
                            </span>
                            {hasDiscount && discountText && (
                              <span className="discountBadge">
                                {discountText}
                              </span>
                            )}
                          </div>
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
              <span>
                {selectedShipping
                  ? shippingFee === 0
                    ? "Miễn phí"
                    : `${shippingFee.toLocaleString("vi-VN")}đ`
                  : "Chưa chọn"}
              </span>
            </div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{grandTotal.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
