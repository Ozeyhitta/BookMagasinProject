"use client";
import React, { useState } from "react";
import { Search, Phone, ShoppingCart, User, Menu, X } from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <a href="tel:028.73008182" className="contact-item">
                <Phone size={16} />
                <span>028.73008182</span>
              </a>
              <a href="mailto:hotro@vinabook.com" className="contact-item">
                <span>📧</span>
                <span>hotro@vinabook.com</span>
              </a>
              <div className="contact-item">
                <span>📍</span>
                <span>332 Luy Bán Bích, Phường Tân Phú, TP. Hồ Chí Minh</span>
              </div>
            </div>
            <div className="auth-links">
              <a href="/login" className="auth-link">
                ĐĂNG NHẬP
              </a>
              <a href="/register" className="auth-link">
                ĐĂNG KÝ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="main-header-content">
            {/* Logo */}
            <a href="/" className="logo">
              <span className="logo-vina">vina</span>
              <span className="logo-book">book</span>
              <span className="logo-com">.com</span>
            </a>

            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-button">Tìm kiếm</button>
            </div>

            {/* Right Actions */}
            <div className="header-actions">
              <div className="support-info">
                <Phone size={24} className="phone-icon" />
                <div>
                  <div className="support-label">Tư vấn bán hàng</div>
                  <div className="support-phone">028.73008182</div>
                </div>
              </div>
              <button className="cart-button">
                <ShoppingCart size={24} />
                <span className="cart-badge">0</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="mobile-search-input"
            />
            <button className="mobile-search-button">
              <Search size={20} />
            </button>
          </div>
          <div className="mobile-links">
            <a href="/login" className="mobile-link">
              Đăng nhập
            </a>
            <a href="/register" className="mobile-link">
              Đăng ký
            </a>
            <a href="/contact" className="mobile-link">
              Liên hệ
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Top Bar */
        .top-bar {
          background: #5a8600;
          color: white;
          padding: 8px 0;
          font-size: 13px;
        }

        .top-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .contact-info {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .contact-item:hover {
          opacity: 0.8;
        }

        .auth-links {
          display: flex;
          gap: 15px;
        }

        .auth-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .auth-link:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Main Header */
        .main-header {
          background: white;
          padding: 15px 0;
        }

        .main-header-content {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        /* Logo */
        .logo {
          font-size: 32px;
          font-weight: bold;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .logo-vina {
          color: #5a8600;
        }

        .logo-book {
          color: #e31e24;
        }

        .logo-com {
          color: #5a8600;
        }

        /* Search */
        .search-container {
          flex: 1;
          display: flex;
          max-width: 600px;
        }

        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #5a8600;
          border-right: none;
          border-radius: 4px 0 0 4px;
          font-size: 14px;
          outline: none;
        }

        .search-input:focus {
          border-color: #6a9600;
        }

        .search-button {
          padding: 12px 24px;
          background: #5a8600;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .search-button:hover {
          background: #6a9600;
        }

        /* Header Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }

        .support-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .phone-icon {
          color: #5a8600;
        }

        .support-label {
          font-size: 12px;
          color: #666;
        }

        .support-phone {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .cart-button {
          position: relative;
          background: #ff6b00;
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cart-button:hover {
          background: #ff7b10;
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e31e24;
          color: white;
          font-size: 11px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 20px;
        }

        /* Mobile Menu Button */
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #5a8600;
          padding: 8px;
        }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          background: white;
          border-top: 1px solid #e0e0e0;
          padding: 15px 20px;
        }

        .mobile-search {
          display: flex;
          margin-bottom: 15px;
        }

        .mobile-search-input {
          flex: 1;
          padding: 10px;
          border: 2px solid #5a8600;
          border-right: none;
          border-radius: 4px 0 0 4px;
          font-size: 14px;
        }

        .mobile-search-button {
          padding: 10px 15px;
          background: #5a8600;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-link {
          padding: 10px;
          color: #333;
          text-decoration: none;
          border-bottom: 1px solid #f0f0f0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .support-info {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .top-bar-content {
            font-size: 11px;
          }

          .contact-info {
            gap: 10px;
          }

          .contact-item:nth-child(3) {
            display: none;
          }

          .main-header-content {
            gap: 15px;
          }

          .search-container {
            display: none;
          }

          .auth-links {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .mobile-menu {
            display: block;
          }

          .logo {
            font-size: 24px;
          }
        }
      `}</style>
    </header>
  );
}
