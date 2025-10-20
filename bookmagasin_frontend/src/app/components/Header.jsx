"use client";
import React, { useEffect, useState } from "react";
import { Bell, ShoppingCart } from "lucide-react";
import "../components/header.css";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔍 Kiểm tra token khi load trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true nếu có token
  }, []);

  const handleNotifications = () => {
    alert("Đi đến trang thông báo!");
    // Ví dụ: window.location.href = "/notifications";
  };

  // 🚪 Hàm đăng xuất
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        alert("Đăng xuất thành công!");
        window.location.href = "/mainpage";
      } else {
        const text = await response.text();
        alert("Lỗi khi đăng xuất: " + text);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  return (
    <header className="header">
      {/* Thanh trên cùng */}
      <div className="header-top">
        <div className="contact-info">
          <span>📞 028.73008182</span>
          <span>✉️ hotro@vinabook.com</span>
          <span>📍 1 Võ Văn Ngân, Phường Thủ Đức, TP Hồ Chí Minh</span>
        </div>

        <div className="account">
          {isLoggedIn ? (
            <>
              <a href="/account">TÀI KHOẢN</a>
              <a href="#" onClick={handleLogout}>
                ĐĂNG XUẤT
              </a>
            </>
          ) : (
            <>
              <a href="/login">ĐĂNG NHẬP</a>
              <a href="/register">ĐĂNG KÝ</a>
            </>
          )}
        </div>
      </div>

      {/* Phần chính */}
      <div className="header-main">
        {/* Logo */}
        <div className="logo">
          <span className="green">vina</span>
          <span className="red">book</span>
          <span className="green">.com</span>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button>Tìm kiếm</button>
        </div>

        {/* --- Cụm bên phải gồm Thông Báo + Giỏ Hàng + Tư vấn --- */}
        <div className="right-section">
          <div className="header-icons">
            <div className="icon-item" onClick={handleNotifications}>
              <Bell className="icon" />
              <p>Thông Báo</p>
            </div>

            <div
              className="icon-item"
              onClick={() => (window.location.href = "/cart")}
            >
              <ShoppingCart className="icon" />
              <p>Giỏ Hàng</p>
            </div>
          </div>

          <div className="cart-info">
            <p>Tư vấn bán hàng</p>
            <strong>028.73008182</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
