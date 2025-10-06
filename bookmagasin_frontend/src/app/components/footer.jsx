import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

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
            {/* Column 1: About Company */}
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

            {/* Column 2: Support */}
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

            {/* Column 3: Book Info */}
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

            {/* Column 4: Payment Methods */}
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

            {/* Column 5: Partners */}
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
            <a href="/search?q=truyện-nguyễn-nhật-ánh">
              truyện mời của nguyễn nhật ánh
            </a>
            <a href="/search?q=sách-cho-con">sách cho con</a>
            <a href="/search?q=sách-hay-về-gia-đình">sách hay về gia đình</a>
            <a href="/search?q=giáo-trình-tiếng-anh">
              giáo trình tiếng anh trẻ em
            </a>
            <a href="/search?q=sách-hay-kinh-tế">sách hay về kinh tế</a>
            <a href="/search?q=sách-doanh-nhân">sách doanh nhân</a>
            <a href="/search?q=sách-học-tiếng-trung">sách học tiếng trung</a>
            <a href="/search?q=tiểu-thuyết-tình-yêu">tiểu thuyết tình yêu</a>
            <a href="/search?q=sách-y-học">sách y học</a>
            <a href="/search?q=kỹ-năng-giao-tiếp">sách dạy kỹ năng giao tiếp</a>
            <a href="/search?q=sách-blockchain">sách blockchain</a>
            <a href="/search?q=sách-du-học">sách du học</a>
            <a href="/search?q=sách-kỹ-năng-mềm">sách kỹ năng mềm</a>
            <a href="/search?q=sách-phong-thủy">sách phong thủy cổ</a>
            <a href="/search?q=sách-khởi-nghiệp">sách khởi nghiệp</a>
            <a href="/search?q=sách-bán-hàng">sách bán hàng</a>
            <a href="/search?q=đầu-tư-chứng-khoán">
              sách về đầu tư chứng khoán
            </a>
            <a href="/search?q=sách-làm-giàu">sách làm giàu</a>
            <a href="/search?q=quản-lý-nhân-sự">sách quản lý nhân sự</a>
            <a href="/search?q=quản-trị-kinh-doanh">
              sách về quản trị kinh doanh
            </a>
            <a href="/search?q=sách-tài-chính">sách tài chính</a>
            <a href="/search?q=sách-đầu-tư">sách về đầu tư</a>
            <a href="/search?q=tủ-sách-gia-đình">tủ sách gia đình</a>
            <a href="/search?q=sách-dạy-nấu-ăn">sách dạy nấu ăn</a>
            <a href="/search?q=sách-thiếu-nhi">sách hay cho thiếu nhi</a>
            <a href="/search?q=sách-tâm-lý-tình-yêu">sách tâm lý về tính yêu</a>
            <a href="/search?q=tiếng-anh-giao-tiếp">
              sách tự học tiếng anh giao tiếp
            </a>
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
                MST: 0303615027 do Sở Kế Hoạch Và Đầu Tú Tp.HCM cấp ngày
                10/03/2011
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

      <style jsx>{`
        .footer {
          background: #f5f5f5;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Newsletter Section */
        .newsletter-section {
          background: linear-gradient(135deg, #ff8c00 0%, #ff6600 100%);
          padding: 30px 0;
        }

        .newsletter-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .newsletter-text h3 {
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 5px 0;
        }

        .newsletter-text p {
          color: white;
          margin: 0;
          font-size: 14px;
        }

        .newsletter-form {
          display: flex;
          gap: 10px;
          flex: 1;
          max-width: 500px;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          outline: none;
        }

        .newsletter-button-primary {
          padding: 12px 30px;
          background: white;
          color: #ff6600;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s;
        }

        .newsletter-button-primary:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
        }

        /* Main Footer */
        .main-footer {
          background: white;
          padding: 50px 0 30px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
        }

        .footer-title {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin: 0 0 15px 0;
          text-transform: uppercase;
        }

        .mt-20 {
          margin-top: 20px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-links a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #ff6600;
        }

        /* Payment Methods */
        .payment-methods,
        .payment-secure {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .payment-row {
          display: flex;
          gap: 8px;
        }

        .payment-badge,
        .secure-badge {
          padding: 6px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          min-width: 50px;
        }

        .payment-badge.visa {
          background: #1434cb;
          color: white;
        }

        .payment-badge.master {
          background: #eb001b;
          color: white;
        }

        .payment-badge.jcb {
          background: #00529f;
          color: white;
        }

        .payment-badge.atm {
          background: #e31e24;
          color: white;
        }

        .payment-badge.cash {
          background: #006f3e;
          color: white;
        }

        .payment-badge.payoo {
          background: #ffc220;
          color: #000;
        }

        .secure-badge {
          background: #f5f5f5;
          color: #333;
          font-size: 10px;
        }

        /* Partner Logos */
        .partner-logos {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .partner-logo {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          min-width: 70px;
        }

        .partner-logo.vinabook {
          background: #e31e24;
          color: white;
        }

        .partner-logo.vnpost {
          background: #ff6600;
          color: white;
        }

        .partner-logo.ghn {
          background: #0066b2;
          color: white;
        }

        .partner-logo.dhl {
          background: #ffcc00;
          color: #d40511;
        }

        .partner-logo.lazada {
          background: #1877f2;
          color: white;
        }

        .partner-logo.shopee {
          background: #ee4d2d;
          color: white;
        }

        .partner-logo.tiktok {
          background: #000000;
          color: white;
        }

        /* Popular Searches */
        .popular-searches {
          background: white;
          padding: 30px 0;
          border-top: 1px solid #e0e0e0;
        }

        .searches-title {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin: 0 0 15px 0;
        }

        .search-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .search-tags a {
          padding: 6px 12px;
          background: #f5f5f5;
          color: #666;
          text-decoration: none;
          font-size: 13px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .search-tags a:hover {
          background: #ff6600;
          color: white;
        }

        /* Bottom Footer */
        .bottom-footer {
          background: #f0f0f0;
          padding: 30px 0;
          border-top: 1px solid #e0e0e0;
        }

        .company-info {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .certification-badge {
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          background: #0066b2;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-content {
          color: white;
          font-size: 24px;
          font-weight: bold;
        }

        .company-details h4 {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin: 0 0 10px 0;
        }

        .company-details p {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin: 5px 0;
        }

        .company-details a {
          color: #ff6600;
          text-decoration: none;
        }

        .company-details a:hover {
          text-decoration: underline;
        }

        .inline-icon {
          display: inline;
          vertical-align: middle;
          margin-right: 5px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .newsletter-content {
            flex-direction: column;
            text-align: center;
          }

          .newsletter-form {
            width: 100%;
            max-width: 100%;
          }

          .footer-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 30px;
          }

          .company-info {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .certification-badge {
            width: 80px;
            height: 80px;
          }

          .badge-content {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .newsletter-text h3 {
            font-size: 20px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .search-tags {
            gap: 8px;
          }

          .search-tags a {
            font-size: 12px;
            padding: 5px 10px;
          }
        }
      `}</style>
    </footer>
  );
}
