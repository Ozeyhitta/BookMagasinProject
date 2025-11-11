"use client";
import "./checkout.css";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.book.sellingPrice * item.quantity,
    0
  );

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setUser({ fullName: "", phoneNumber: "", address: "", email: "" });
      return;
    }

    const currentUser = JSON.parse(stored);
    if (!currentUser?.id) {
      setUser({ fullName: "", phoneNumber: "", address: "", email: "" });
      return;
    }

    async function fetchData() {
      try {
        const userRes = await fetch(
          `http://localhost:8080/api/users/${currentUser.id}`
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

        const cartRes = await fetch(
          `http://localhost:8080/api/carts/users/${currentUser.id}`
        );

        const cartData = cartRes.ok ? await cartRes.json() : [];
        setCartItems(Array.isArray(cartData) ? cartData : []);
      } catch (err) {
        console.error("Không fetch được, backend chưa bật:", err);

        // ✅ fallback data
        setUser({ fullName: "", phoneNumber: "", address: "", email: "" });
        setCartItems([]);
      }
    }

    fetchData();
  }, []);

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

          <button className="btn-submit">Hoàn tất đơn hàng</button>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <div className="order-summary">
            {cartItems.length === 0 && (
              <p style={{ textAlign: "center", padding: "20px", opacity: 0.7 }}>
                Không có sản phẩm nào trong giỏ hàng
              </p>
            )}

            {cartItems.length > 0 &&
              cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.book.imageUrl} />
                  <div>
                    <p className="item-title">{item.book.title}</p>
                    <p className="item-author">{item.book.author}</p>
                  </div>
                  <span className="item-price">
                    {(item.book.sellingPrice * item.quantity).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </span>
                </div>
              ))}

            <div className="summary-line">
              <span>Tạm tính</span>
              <span>{total.toLocaleString("vi-VN")}đ</span>
            </div>

            <div className="summary-line">
              <span>Phí vận chuyển</span>
              <span>—</span>
            </div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{total.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
