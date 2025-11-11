"use client";
import "./checkout.css";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // ✅ Tổng tiền thật từ backend
  const total = cartItems.reduce(
    (sum, item) => sum + item.book.sellingPrice * item.quantity,
    0
  );

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Fetch user
        const userRes = await fetch("http://localhost:8080/api/users/2");
        const userData = await userRes.json();
        setUser(userData);

        // ✅ Fetch cart
        const cartRes = await fetch("http://localhost:8080/api/carts/users/2");
        const cartData = await cartRes.json();
        setCartItems(cartData);
      } catch (err) {
        console.error("Lỗi khi load dữ liệu checkout:", err);
      }
    }

    fetchData();
  }, []);

  if (!user || cartItems.length === 0)
    return <p style={{ padding: 20 }}>Đang tải dữ liệu...</p>;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT COLUMN */}
        <div className="checkout-left">
          <h2 className="section-title">Thông tin giao hàng</h2>

          <div className="user-info">
            <p>
              <strong>{user.fullName}</strong> ({user.email})
            </p>
            <a href="#">Đăng xuất</a>
          </div>

          <form className="checkout-form">
            <input type="text" value={user.fullName} readOnly />
            <input type="text" value={user.phoneNumber} readOnly />
            <input type="text" value={user.address} readOnly />

            <div className="form-row">
              <select>
                <option>Việt Nam</option>
              </select>
              <select>
                <option>Chọn tỉnh / thành</option>
              </select>
            </div>

            <div className="form-row">
              <select>
                <option>Chọn quận / huyện</option>
              </select>
              <select>
                <option>Chọn phường / xã</option>
              </select>
            </div>
          </form>

          <h2 className="section-title">Phương thức vận chuyển</h2>
          <div className="shipping-method">
            <div className="shipping-box">
              <img
                src="https://cdn-icons-png.flaticon.com/512/481/481489.png"
                alt=""
              />
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

        {/* RIGHT COLUMN */}
        <div className="checkout-right">
          <div className="order-summary">
            {/* ✅ Lấy cart từ backend */}
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.book.imageUrl} alt={item.book.title} />

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
