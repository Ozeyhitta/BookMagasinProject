"use client";
import React, { useEffect, useState } from "react";
import { Bell, ShoppingCart, FileClock } from "lucide-react";
import { useRouter } from "next/navigation";
import "../components/header.css";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ STATE CHO SEARCH
  const router = useRouter();

  useEffect(() => {
    const handleCartUpdate = () => {
      const newCount = parseInt(localStorage.getItem("cartCount") || "0");
      setCartCount(newCount);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token);

    if (userId) {
      fetchCartCount(userId);
    }
  }, []);

  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/carts/users/${userId}`
      );
      if (res.ok) {
        const data = await res.json();
        const total = data.length;
        setCartCount(total);
        localStorage.setItem("cartCount", total);
      }
    } catch (err) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", err);
    }
  };

  useEffect(() => {
    const savedCount = localStorage.getItem("cartCount");
    if (savedCount) setCartCount(parseInt(savedCount));

    const handleStorageChange = (event) => {
      if (event.key === "cartCount") {
        setCartCount(parseInt(event.newValue || "0"));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const goToOrderHistory = () => router.push("/orderhistory");
  const goToNotifications = () => router.push("/notifications");
  const goToMainPage = () => router.push("/mainpage");
  const goToCart = () => router.push("/cart");

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
        router.push("/mainpage");
      } else {
        const text = await response.text();
        alert("Lỗi khi đăng xuất: " + text);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  // ✅ HÀM XỬ LÝ SEARCH
  const handleSearch = () => {
    const keyword = searchTerm.trim();
    if (!keyword) return; // không tìm nếu rỗng

    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  // ✅ NHẤN ENTER TRONG Ô INPUT
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="header">
      {/* --- Top Bar --- */}
      <div className="header-top">
        <div className="contact-info">
          <span>📞 028.73008182</span>
          <span>✉️ hotro@vinabook.com</span>
          <span>📍 1 Võ Văn Ngân, Phường Thủ Đức, TP Hồ Chí Minh</span>
        </div>

        <div className="account">
          {isLoggedIn ? (
            <>
              <a onClick={() => router.push("/account")}>TÀI KHOẢN</a>
              <a href="#" onClick={handleLogout}>
                ĐĂNG XUẤT
              </a>
            </>
          ) : (
            <>
              <a onClick={() => router.push("/login")}>ĐĂNG NHẬP</a>
              <a onClick={() => router.push("/register")}>ĐĂNG KÝ</a>
            </>
          )}
        </div>
      </div>

      {/* --- Main Header --- */}
      <div className="header-main">
        {/* Logo */}
        <div
          className="logo"
          onClick={goToMainPage}
          style={{ cursor: "pointer" }}
        >
          <span className="green">vina</span>
          <span className="red">book</span>
          <span className="green">.com</span>
        </div>

        {/* ✅ Search Bar hoạt động */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>Tìm kiếm</button>
        </div>

        {/* Right Group */}
        <div className="right-section">
          <div className="header-icons">
            <div className="icon-item" onClick={goToOrderHistory}>
              <FileClock className="icon" />
              <p>Lịch sử đơn hàng</p>
            </div>

            <div className="icon-item" onClick={goToNotifications}>
              <Bell className="icon" />
              <p>Thông Báo</p>
            </div>

            <div
              className="icon-item"
              onClick={goToCart}
              style={{ position: "relative" }}
            >
              <ShoppingCart className="icon" />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                  }}
                >
                  {cartCount}
                </span>
              )}
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
