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
  const [vnpayLoading, setVnpayLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false);
  const [pendingTxnRef, setPendingTxnRef] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("vnpayTxnRef") : null
  );
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [checkingVnpay, setCheckingVnpay] = useState(false);
  const [vnpayPopup, setVnpayPopup] = useState(null); // Lưu reference của popup window
  const [feedbackModal, setFeedbackModal] = useState(null);

  const showModal = (message, { title = "Thông báo", type = "info" } = {}) => {
    setFeedbackModal({ title, message, type });
  };

  const closeModal = () => setFeedbackModal(null);

  const getModalTheme = (type) => {
    switch (type) {
      case "success":
        return { border: "#16a34a", background: "#ecfdf5", text: "#065f46" };
      case "error":
        return { border: "#dc2626", background: "#fef2f2", text: "#991b1b" };
      default:
        return { border: "#2563eb", background: "#eff6ff", text: "#1e3a8a" };
    }
  };

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

  useEffect(() => {
    function handleMessage(event) {
      if (!event.data || event.data.type !== "vnpayResult") return;

      // ✅ Tối ưu: Không chờ fetch, chỉ xử lý ngay và redirect
      if (event.data.status === "SUCCESS") {
        sessionStorage.removeItem("vnpayTxnRef");
        setPendingTxnRef(null);
        setCheckingVnpay(false);
        setCartItems([]);
        localStorage.setItem("cartCount", "0");
        window.dispatchEvent(new Event("cart-updated"));

        // ✅ Xóa giỏ hàng trên backend (không chờ kết quả)
        const userId = localStorage.getItem("userId");
        if (userId) {
          fetch(`http://localhost:8080/api/carts/users/${userId}`, {
            method: "DELETE",
          }).catch((err) => {
            console.error("❌ Lỗi khi xóa giỏ hàng:", err);
          });
        }

        // Redirect ngay lập tức
        window.location.href = `http://localhost:3000/thankyoufororder?status=${event.data.status}&amount=${event.data.amount}&paymentId=${event.data.paymentId}&vnpTxnRef=${event.data.vnpTxnRef}&message=success`;
      } else if (event.data.status === "FAILED") {
        // Xử lý khi thanh toán thất bại
        setCheckingVnpay(false);
        setPendingTxnRef(null);
        sessionStorage.removeItem("vnpayTxnRef");

        // Hiển thị thông báo lỗi chi tiết từ VNPay
        const errorMsg =
          event.data.errorMessage ||
          "Thanh toán VNPay không thành công. Vui lòng thử lại.";
        showModal(errorMsg, {
          type: "error",
          title: "Thanh toán thất bại",
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!pendingTxnRef) return;

    let cancelled = false;
    setCheckingVnpay(true);

    async function fetchPaymentResult() {
      if (cancelled) return;

      setPaymentStatusLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/payments");
        if (!res.ok) {
          throw new Error("Không tìm thấy thông tin thanh toán");
        }
        const payments = await res.json();
        const payment = payments.find((p) => p.vnpTxnRef === pendingTxnRef);

        if (!payment) {
          // Chưa có payment, tiếp tục chờ
          return;
        }

        if (payment.paymentStatus === "SUCCESS") {
          if (cancelled) return;

          const userId = localStorage.getItem("userId");

          // ✅ Xóa giỏ hàng trên backend (không chờ)
          if (userId) {
            fetch(`http://localhost:8080/api/carts/users/${userId}`, {
              method: "DELETE",
            }).catch((err) => {
              console.error("❌ Lỗi khi xóa giỏ hàng:", err);
            });
          }

          setPaymentResult(payment);
          sessionStorage.removeItem("vnpayTxnRef");
          setPendingTxnRef(null);
          setCartItems([]);
          localStorage.setItem("cartCount", "0");
          window.dispatchEvent(new Event("cart-updated"));
          window.location.href = `http://localhost:3000/thankyoufororder?status=${payment.paymentStatus}&amount=${payment.amount}&paymentId=${payment.id}&vnpTxnRef=${payment.vnpTxnRef}&message=success`;
        } else if (payment.paymentStatus === "FAILED") {
          // Thanh toán thất bại
          if (cancelled) return;
          setCheckingVnpay(false);
          setPendingTxnRef(null);
          sessionStorage.removeItem("vnpayTxnRef");

          // Hiển thị thông báo lỗi chi tiết từ VNPay
          const errorMsg =
            payment.errorMessage ||
            "Thanh toán VNPay không thành công. Vui lòng thử lại.";
          showModal(errorMsg, {
            type: "error",
            title: "Thanh toán thất bại",
          });
        }
      } catch (err) {
        console.error("Không thể lấy thông tin thanh toán:", err);
      } finally {
        if (!cancelled) setPaymentStatusLoading(false);
      }
    }

    fetchPaymentResult();
    const intervalId = setInterval(fetchPaymentResult, 5000);

    // ✅ Kiểm tra popup có bị đóng không (hủy thanh toán)
    let popupClosedTime = null; // Lưu bên ngoài để không bị reset
    const checkPopupClosed = setInterval(() => {
      if (vnpayPopup && vnpayPopup.closed && !cancelled) {
        // Ghi nhận thời điểm popup đóng lần đầu
        if (popupClosedTime === null) {
          popupClosedTime = Date.now();
          console.log("⚠️ VNPay popup đã bị đóng, đang chờ kết quả...");
        }

        // Chờ 3 giây sau khi popup đóng để đảm bảo không có postMessage nào đến
        // Nếu sau 3 giây vẫn chưa có kết quả, coi như hủy thanh toán
        if (Date.now() - popupClosedTime > 3000) {
          console.log(
            "⚠️ VNPay popup đã bị đóng > 3s - người dùng có thể đã hủy thanh toán"
          );
          cancelled = true;
          clearInterval(intervalId);
          clearInterval(checkPopupClosed);
          setCheckingVnpay(false);
          setPendingTxnRef(null);
          sessionStorage.removeItem("vnpayTxnRef");
          // Không hiển thị alert để tránh làm phiền người dùng
        }
      } else if (vnpayPopup && !vnpayPopup.closed) {
        // Popup mở lại, reset thời gian đóng
        popupClosedTime = null;
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      clearInterval(checkPopupClosed);
      setCheckingVnpay(false);
    };
  }, [pendingTxnRef, vnpayPopup]);

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

<<<<<<< HEAD
  // ✅ HÀM ĐẶT HÀNG
  async function handlePlaceOrder(e) {
    e.preventDefault();

=======
  function prepareOrderPayload(paymentIdOverride) {
>>>>>>> 6387b8c0985854838827ce0915ac4a86deac3978
    if (!user?.fullName || !user?.address || !user?.phoneNumber) {
      throw new Error("Vui lòng điền đầy đủ thông tin giao hàng!");
    }
    if (cartItems.length === 0) {
      throw new Error("Giỏ hàng trống!");
    }

<<<<<<< HEAD
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
=======
    const userId = localStorage.getItem("userId");
    return {
      userId: userId ? parseInt(userId) : null,
      serviceId: 1,
      paymentId: paymentIdOverride ?? 1,
>>>>>>> 6387b8c0985854838827ce0915ac4a86deac3978
      note: appliedPromotion
        ? `Giao buổi sáng - ${selectedShipping.name} - Áp dụng mã ${appliedPromotion.code}`
        : `Giao buổi sáng - ${selectedShipping.name}`,
      status: "PENDING",
<<<<<<< HEAD
      // KHÔNG gửi orderDate, backend tự set ngày hiện tại
=======
      orderDate: new Date().toISOString(),
>>>>>>> 6387b8c0985854838827ce0915ac4a86deac3978
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
<<<<<<< HEAD
=======
      promotionCode: appliedPromotion?.code || null,
      promotionDiscountAmount: orderLevelDiscount,
      orderTotal: orderTotalAfterPromo || total,
>>>>>>> 6387b8c0985854838827ce0915ac4a86deac3978
    };
  }

  async function submitVnpayOrder(orderPayload) {
    setVnpayLoading(true);
    try {
      const amount = orderPayload.orderTotal;
      const orderInfo = `Checkout ${new Date().toISOString()}`;
      const response = await fetch(
        `http://localhost:8080/api/payments/vnpay/create?amount=${amount}&orderInfo=${orderInfo}`
      );
      if (!response.ok) {
        throw new Error("Không tạo được URL thanh toán VNPay");
      }
      const data = await response.json();
      if (!data?.paymentUrl || !data?.paymentId) {
        throw new Error("VNPay không trả về thông tin cần thiết");
      }

      const payloadWithPayment = {
        ...orderPayload,
        paymentId: data.paymentId,
      };

      const orderRes = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadWithPayment),
      });

      if (!orderRes.ok) {
        throw new Error("Không thể tạo đơn hàng trước khi chuyển hướng VNPay");
      }

      const orderData = await orderRes.json();

      sessionStorage.setItem("lastOrderId", orderData.id);
      sessionStorage.setItem("vnpayTxnRef", data.vnpTxnRef);
      setPendingTxnRef(data.vnpTxnRef);

      const newWindow = window.open(
        data.paymentUrl,
        "_blank",
        "width=1080,height=800"
      );

      if (!newWindow) {
        console.log("VNPay payment URL:", data.paymentUrl);
        showModal("Popup bị chặn. Vui lòng cho phép popup và thử lại.", {
          type: "error",
        });
        setVnpayLoading(false);
        return;
      }

      // ✅ Lưu reference của popup để có thể kiểm tra khi nó đóng
      setVnpayPopup(newWindow);
    } catch (err) {
      console.error("VNPay error:", err);
      showModal(err.message || "Không thể tạo URL thanh toán VNPay", {
        type: "error",
      });
    } finally {
      setVnpayLoading(false);
    }
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    let orderPayload;
    try {
      orderPayload = prepareOrderPayload(
        paymentMethod === "COD" ? 1 : undefined
      );
    } catch (err) {
      showModal(err.message, { type: "error" });
      return;
    }

    if (paymentMethod === "VNPAY") {
      await submitVnpayOrder(orderPayload);
      return;
    }

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

<<<<<<< HEAD
      alert("Đặt hàng thành công!");
=======
      showModal("Đặt hàng thành công!", {
        type: "success",
        title: "Thành công",
      });
      // Xóa cart count
>>>>>>> 6387b8c0985854838827ce0915ac4a86deac3978
      localStorage.setItem("cartCount", "0");
      window.dispatchEvent(new Event("cart-updated"));

      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = "/orderhistory";
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn hàng:", err);
      showModal("Đặt hàng thất bại, vui lòng thử lại!", { type: "error" });
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
          {paymentStatusLoading && (
            <div
              style={{
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                marginBottom: 16,
                backgroundColor: "#f9fafb",
              }}
            >
              Đang kiểm tra kết quả thanh toán từ VNPay...
            </div>
          )}
          {paymentResult && (
            <div
              style={{
                padding: "16px",
                borderRadius: 8,
                marginBottom: 16,
                border: "1px solid #16a34a",
                backgroundColor: "#dcfce7",
                color: "#14532d",
              }}
            >
              <h3 style={{ margin: "0 0 8px" }}>
                Thanh toán VNPay thành công 🎉
              </h3>
              <p>
                Mã tham chiếu: <strong>{paymentResult.vnpTxnRef}</strong>
              </p>
              <p>Số tiền: {paymentResult.amount?.toLocaleString("vi-VN")}đ</p>
              <p>Trạng thái: {paymentResult.paymentStatus}</p>
            </div>
          )}

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
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Thanh toán khi giao hàng (COD)</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="VNPAY"
                checked={paymentMethod === "VNPAY"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Thanh toán qua VNPay</span>
            </label>
          </div>

          <button
            type="button"
            className="btn-submit"
            onClick={handlePlaceOrder}
            disabled={paymentMethod === "VNPAY" && vnpayLoading}
          >
            {paymentMethod === "VNPAY" && vnpayLoading
              ? "Đang xử lý VNPay..."
              : "Hoàn tất đơn hàng"}
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
      {checkingVnpay && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Đang chờ VNPay xác nhận...</h3>
            <p>Vui lòng hoàn tất thanh toán trong cửa sổ vừa mở.</p>
          </div>
        </div>
      )}
      {feedbackModal && (
        <div className="modal-overlay">
          {(() => {
            const theme = getModalTheme(feedbackModal.type);
            return (
              <div
                className="modal-content"
                style={{
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.background,
                  color: theme.text,
                  maxWidth: 400,
                }}
              >
                <h3 style={{ marginBottom: 8 }}>{feedbackModal.title}</h3>
                <p style={{ marginBottom: 16 }}>{feedbackModal.message}</p>
                <button
                  onClick={closeModal}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: theme.border,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Đóng
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
