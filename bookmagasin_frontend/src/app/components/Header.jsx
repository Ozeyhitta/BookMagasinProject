"use client";
import React from "react";
import "../components/header.css";

export default function Header() {
  return (
    <header className="header">
      {/* Thanh trên cùng */}
      <div className="header-top">
        <div className="contact-info">
          <span>📞 028.73008182</span>
          <span>✉️ hotro@vinabook.com</span>
          <span>📍 332 Lũy Bán Bích, Phường Tân Phú, TP. Hồ Chí Minh</span>
        </div>

        <div className="account">
          <a href="#">TÀI KHOẢN</a>
          <a href="#">ĐĂNG XUẤT</a>
        </div>
      </div>

      {/* Phần chính */}
      <div className="header-main">
        <div className="logo">
          <span className="green">vina</span>
          <span className="red">book</span>
          <span className="green">.com</span>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button>Tìm kiếm</button>
        </div>

        <div className="cart">
          <span>🛒</span>
          <div>
            <p>Tư vấn bán hàng</p>
            <strong>028.73008182</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
