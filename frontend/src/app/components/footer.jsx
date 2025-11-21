import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import "./footer.css";
import PartnerLogo from "./PartnerLogo";

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
                <li>
                  <a href="/about">Giới thiệu công ty</a>
                </li>
                <li>
                  <a href="/recruitment">Tuyển dụng</a>
                </li>
                <li>
                  <a href="/agent">Chương trình đại lý</a>
                </li>
                <li>
                  <a href="/privacy">Chính sách bảo mật</a>
                </li>
                <li>
                  <a href="/refund">Chính sách đổi trả</a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="footer-column">
              <h4 className="footer-title">TRỢ GIÚP</h4>
              <ul className="footer-links">
                <li>
                  <a href="/guide">Quy định sử dụng</a>
                </li>
                <li>
                  <a href="/shopping-guide">Hướng dẫn mua hàng</a>
                </li>
                <li>
                  <a href="/payment">Phương thức thanh toán</a>
                </li>
                <li>
                  <a href="/shipping">Phương thức vận chuyển</a>
                </li>
                <li>
                  <a href="/ebook">Ứng dụng đọc ebook</a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="footer-column">
              <h4 className="footer-title">TIN TỨC SÁCH</h4>
              <ul className="footer-links">
                <li>
                  <a href="/news">Tin tức</a>
                </li>
                <li>
                  <a href="/reviews">Chân dung</a>
                </li>
                <li>
                  <a href="/search">Điểm sách</a>
                </li>
                <li>
                  <a href="/criticism">Phê bình</a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="footer-column">
              <h4 className="footer-title">CHẤP NHẬN THANH TOÁN</h4>
              <div className="payment-logos">
                <PartnerLogo
                  href="#"
                  imgSrc="https://duhoc.thanhgiang.com.vn/sites/default/files/field/image/visa.jpg"
                  name="VISA"
                  className="visa"
                />
                <PartnerLogo
                  href="#"
                  imgSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1280px-MasterCard_Logo.svg.png"
                  name="Mastercard"
                  className="master"
                />
                <PartnerLogo
                  href="#"
                  imgSrc="https://www.paragondepartmentstore.com/wp-content/uploads/2022/06/jcb-logo-png.png"
                  name="JCB"
                  className="jcb"
                />
                <PartnerLogo
                  href="#"
                  imgSrc="https://png.pngtree.com/element_our/png/20181112/atm-machine-icon-png_235938.jpg"
                  name="ATM"
                  className="atm"
                />
                <PartnerLogo
                  href="#"
                  imgSrc="https://png.pngtree.com/png-vector/20191028/ourlarge/pngtree-cash-in-hand-icon-cartoon-style-png-image_1893442.jpg"
                  name="Tiền mặt"
                  className="cash"
                />
                <PartnerLogo
                  href="#"
                  imgSrc="https://cdn.tgdd.vn/2020/06/GameApp/payoo-1-200x200.jpg"
                  name="PayOO"
                  className="payoo"
                />
              </div>

              <h4 className="footer-title mt-20">THANH TOÁN AN TOÀN</h4>
              <div className="secure-logos">
                <PartnerLogo
                  href="#"
                  imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHl2imE7emfBp7Bgt2HcBoLIBVo2kcsOpjPA&s"
                  name="Verified VISA"
                />
                <PartnerLogo
                  href="#"
                  imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5pAeEc8lsN4wQ8O9moD4U-T-HC8JbhXIUig&s"
                  name="Mastercard Secure"
                />
                <PartnerLogo
                  href="#"
                  imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTctfygVoR8nCqR7Zj8EEHAyjGIox4QZQcArw&s"
                  name="VNPay"
                />
              </div>
            </div>

            {/* Column 5 */}
            <div className="footer-column">
              <div className="partner-sections">
                <div className="partner-section">
                  <h4 className="footer-title">ĐỐI TÁC VẬN CHUYỂN</h4>
                  <div className="partner-logos">
                    <PartnerLogo
                      href="#"
                      imgSrc="https://i.pinimg.com/280x280_RS/07/bb/eb/07bbeb771bd5a33c882a4b4a8a69b0eb.jpg"
                      name="vinabook.com"
                      className="vinabook"
                    />
                    <PartnerLogo
                      href="#"
                      imgSrc="https://cdn.tgdd.vn/2020/04/GameApp/unnamed(1)-200x200-29.png"
                      name="VN POST"
                      className="vnpost"
                    />
                    <PartnerLogo
                      href="#"
                      imgSrc="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTM3NjAzMSwicHVyIjoiYmxvYl9pZCJ9fQ==--5e7d3f72d02ad19489ea4fad86a41f437ed3af08/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fZml0IjpbMTcwLG51bGxdfSwicHVyIjoidmFyaWF0aW9uIn19--153c6060efaf53113351c55943967c335f67bf0f/%E1%BA%A2nh%20Linkedin.jpg"
                      name="GHN"
                      className="ghn"
                    />
                    <PartnerLogo
                      href="#"
                      imgSrc="https://logos-world.net/wp-content/uploads/2020/08/DHL-Emblem.png"
                      name="DHL"
                      className="dhl"
                    />
                  </div>
                </div>
                <div className="partner-section">
                  <h4 className="footer-title">ĐỐI TÁC BÁN HÀNG</h4>
                  <div className="partner-logos">
                    <PartnerLogo
                      href="https://www.lazada.vn/"
                      imgSrc="https://i.pinimg.com/736x/5a/aa/b7/5aaab7b308944b025c9bff936a4c50d6.jpg"
                      name="Lazada"
                      className="lazada"
                    />
                    <PartnerLogo
                      href="https://shopee.vn/"
                      imgSrc="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5d12864c12916c05640b36e47ac5c9.png"
                      name="Shopee"
                      className="shopee"
                    />
                    <PartnerLogo
                      href="https://www.tiktok.com/"
                      imgSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/1200px-Tiktok_icon.svg.png"
                      name="TikTok"
                      className="tiktok"
                    />
                  </div>
                </div>
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
            <a href="/search?q=truyện-nguyễn-nhật-ánh">
              truyện mới của nguyễn nhật ánh
            </a>
            <a href="/search?q=sách-cho-con">sách cho con</a>
            <a href="/search?q=sách-hay-về-gia-đình">sách hay về gia đình</a>
            <a href="/search?q=giáo-trình-tiếng-anh">
              giáo trình tiếng anh trẻ em
            </a>
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
                Địa chỉ: 332 Luy Bán Bích, Phường Tân Phú, TP. Hồ Chí Minh -
                MST: 0303615027
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
