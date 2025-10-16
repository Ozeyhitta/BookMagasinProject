"use client";
import "./checkout.css";
import { useState } from "react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  const cartItems = [
    {
      title: "Bản Sắc Lưu Giữ Cuộc Đời",
      author: "Trần Hữu 2025 | NXB Lao Động",
      price: 89100,
      image: "https://www.netabooks.vn/Data/Sites/1/Product/28375/hai-so-phan-bia-cung-01.jpg",
    },
    {
      title: "Cho Du Hạ Nhi",
      author: "Trần Lưu 2025 | NXB Lá Bối",
      price: 484200,
      image: "https://www.netabooks.vn/Data/Sites/1/Product/28375/hai-so-phan-bia-cung-01.jpg",
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT COLUMN */}
        <div className="checkout-left">
          <h2 className="section-title">Thông tin giao hàng</h2>
          <div className="user-info">
            <p><strong>Nguyễn Lợi</strong> (loinguyen2010@gmail.com)</p>
            <a href="#">Đăng xuất</a>
          </div>

          <form className="checkout-form">
            <input type="text" placeholder="Họ và tên" />
            <input type="text" placeholder="Số điện thoại" />
            <input type="text" placeholder="Địa chỉ" />

            <div className="form-row">
              <select><option>Việt Nam</option></select>
              <select><option>Chọn tỉnh / thành</option></select>
            </div>

            <div className="form-row">
              <select><option>Chọn quận / huyện</option></select>
              <select><option>Chọn phường / xã</option></select>
            </div>
          </form>

          <h2 className="section-title">Phương thức vận chuyển</h2>
          <div className="shipping-method">
            <div className="shipping-box">
              <img src="https://cdn-icons-png.flaticon.com/512/481/481489.png" alt="" />
              <p>Vui lòng chọn địa chỉ để xem danh sách phương thức vận chuyển.</p>
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
              <span>Chuyển khoản qua ngân hàng</span>
            </label>
            <label className="payment-option">
              <input type="radio" name="payment" />
              <span>Thẻ ATM nội địa hoặc qua cổng OnePay</span>
            </label>
            <label className="payment-option">
              <input type="radio" name="payment" />
              <span>Thẻ Visa/MasterCard/JCB/Amex</span>
            </label>
            <label className="payment-option">
              <input type="radio" name="payment" />
              <span>Ví MoMo</span>
            </label>
          </div>

          <button className="btn-submit">Hoàn tất đơn hàng</button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="checkout-right">
          <div className="order-summary">
            {cartItems.map((item, i) => (
              <div key={i} className="order-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <p className="item-title">{item.title}</p>
                  <p className="item-author">{item.author}</p>
                </div>
                <span className="item-price">
                  {item.price.toLocaleString("vi-VN")}đ
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
