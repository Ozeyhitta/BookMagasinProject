import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import "./footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>ĐĂNG KÝ NHẬN EMAIL</h3>
              <p>Đăng ký nhận thông tin sách mới, sách bán</p>
            </div>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
              />
              <button
                onClick={handleSubmit}
                className="newsletter-button-primary"
              >
                ĐĂNG KÝ NGAY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="main-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1 */}
            <div className="footer-column">
              <h4 className="footer-title">VỀ CÔNG TY</h4>
              <ul className="footer-links">
                <li><a href="/about">Giới thiệu công ty</a></li>
                <li><a href="/recruitment">Tuyển dụng</a></li>
                <li><a href="/agent">Chương trình đại lý</a></li>
                <li><a href="/privacy">Chính sách bảo mật</a></li>
                <li><a href="/refund">Chính sách đổi trả</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="footer-column">
              <h4 className="footer-title">TRỢ GIÚP</h4>
              <ul className="footer-links">
                <li><a href="/guide">Quy định sử dụng</a></li>
                <li><a href="/shopping-guide">Hướng dẫn mua hàng</a></li>
                <li><a href="/payment">Phương thức thanh toán</a></li>
                <li><a href="/shipping">Phương thức vận chuyển</a></li>
                <li><a href="/ebook">Ứng dụng đọc ebook</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="footer-column">
              <h4 className="footer-title">TIN TỨC SÁCH</h4>
              <ul className="footer-links">
                <li><a href="/news">Tin tức</a></li>
                <li><a href="/reviews">Chân dung</a></li>
                <li><a href="/search">Điểm sách</a></li>
                <li><a href="/criticism">Phê bình</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="footer-column">
              <h4 className="footer-title">CHẤP NHẬN THANH TOÁN</h4>
              <div className="payment-methods">
                <div className="payment-row">
                  <div className="payment-badge visa">VISA</div>
                  <div className="payment-badge master">Master</div>
                  <div className="payment-badge jcb">JCB</div>
                </div>
                <div className="payment-row">
                  <div className="payment-badge atm">ATM</div>
                  <div className="payment-badge cash">Tiền mặt</div>
                  <div className="payment-badge payoo">PayOO</div>
                </div>
              </div>
              <h4 className="footer-title mt-20">THANH TOÁN AN TOÀN</h4>
              <div className="payment-secure">
                <div className="secure-badge">Verified VISA</div>
                <div className="secure-badge">Mastercard</div>
                <div className="secure-badge">VNPay</div>
              </div>
            </div>

            {/* Column 5 */}
            <div className="footer-column">
              <h4 className="footer-title">ĐỐI TÁC VẬN CHUYỂN</h4>
              <div className="partner-logos">
                <div className="partner-logo vinabook">vinabook.com</div>
                <div className="partner-logo vnpost">VN POST</div>
                <div className="partner-logo ghn">GHN</div>
                <div className="partner-logo dhl">DHL</div>
              </div>
              <h4 className="footer-title mt-20">ĐỐI TÁC BÁN HÀNG</h4>
              <div className="partner-logos">
                <div className="partner-logo lazada">Lazada</div>
                <div className="partner-logo shopee">Shopee</div>
                <div className="partner-logo tiktok">TikTok</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="popular-searches">
        <div className="container">
          <h4 className="searches-title">THƯỜNG ĐƯỢC TÌM KIẾM</h4>
          <div className="search-tags">
            <a href="/search?q=truyện-đan-brown">truyện đan brown</a>
            <a href="/search?q=sách-warren-buffett">sách warren buffett</a>
            <a href="/search?q=digital-marketing">sách digital marketing</a>
            <a href="/search?q=truyện-nguyễn-nhật-ánh">truyện mới của nguyễn nhật ánh</a>
            <a href="/search?q=sách-cho-con">sách cho con</a>
            <a href="/search?q=sách-hay-về-gia-đình">sách hay về gia đình</a>
            <a href="/search?q=giáo-trình-tiếng-anh">giáo trình tiếng anh trẻ em</a>
            <a href="/search?q=sách-hay-kinh-tế">sách hay về kinh tế</a>
            <a href="/search?q=sách-doanh-nhân">sách doanh nhân</a>
            <a href="/search?q=sách-học-tiếng-trung">sách học tiếng trung</a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bottom-footer">
        <div className="container">
          <div className="company-info">
            <div className="certification-badge">
              <div className="badge-content">BCT</div>
            </div>
            <div className="company-details">
              <h4>CÔNG TY CỔ PHẦN THƯƠNG MẠI DỊCH VỤ MÊ KÔNG COM</h4>
              <p>
                <MapPin size={16} className="inline-icon" />
                Địa chỉ: 332 Luy Bán Bích, Phường Tân Phú, TP. Hồ Chí Minh - MST: 0303615027
              </p>
              <p>
                <Phone size={16} className="inline-icon" />
                Tel: 028.73008182 - Fax: 028.39733234 - Email:{" "}
                <a href="mailto:hotro@vinabook.com">hotro@vinabook.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
