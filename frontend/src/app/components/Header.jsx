"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bell, ShoppingCart, FileClock } from "lucide-react";
import { useRouter } from "next/navigation";
import "../components/header.css";
import { buildApiUrl } from "../../utils/apiConfig";
import SupportRequestButton from "./requestsupport/SupportRequestButton";
import { useIsMounted } from "../../utils/hydration-safe";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestionPool, setSuggestionPool] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const router = useRouter();
  const searchWrapperRef = useRef(null);
  const isMounted = useIsMounted();

  // Only access localStorage after component has mounted (client-side)
  useEffect(() => {
    if (!isMounted) return;

    const handleCartUpdate = () => {
      const newCount = parseInt(localStorage.getItem("cartCount") || "0");
      setCartCount(newCount);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, [isMounted]);

  // Initialize auth state after mount
  useEffect(() => {
    if (!isMounted) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token);

    if (userId) {
      fetchCartCount(userId);
      fetchUnreadCount(userId);
    }
  }, [isMounted]);

  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(buildApiUrl(`/api/carts/users/${userId}`));
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

  const fetchUnreadCount = async (userId) => {
    try {
      const res = await fetch(
        buildApiUrl(`/api/notifications/user/${userId}/unread-count`)
      );
      if (res.ok) {
        const data = await res.json();
        setNotifCount(Number(data) || 0);
      }
    } catch (err) {
      console.error("Lỗi khi lấy số thông báo chưa đọc:", err);
      setNotifCount(0);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    const savedCount = localStorage.getItem("cartCount");
    if (savedCount) setCartCount(parseInt(savedCount));

    const handleStorageChange = (event) => {
      if (event.key === "cartCount") {
        setCartCount(parseInt(event.newValue || "0"));
      }
      if (event.key === "userId") {
        const uid = event.newValue;
        if (uid) {
          fetchCartCount(uid);
          fetchUnreadCount(uid);
        } else {
          setNotifCount(0);
          setCartCount(0);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isMounted]);

  const goToOrderHistory = () => router.push("/orderhistory");
  const goToNotifications = () => router.push("/notifications");
  const goToMainPage = () => router.push("/mainpage");
  const goToCart = () => router.push("/cart");

  const formatPrice = (amount) => {
    if (typeof amount !== "number") return "";
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightMatch = (text) => {
    const query = searchTerm.trim();
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    return text
      .split(regex)
      .map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={`${part}-${index}`}>{part}</mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      );
  };

  const loadSuggestionCatalog = useCallback(async () => {
    if (isSuggestionLoading || suggestionPool.length) return;
    try {
      setSuggestionError("");
      setIsSuggestionLoading(true);
      const res = await fetch(buildApiUrl("/api/books"));
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      const mapped = data.map((book) => ({
        id: book.id,
        title: book.title || "Sản phẩm mới",
        author: book.author || book.bookDetail?.author || "",
        price: book.sellingPrice,
        image: book.bookDetail?.imageUrl || "",
      }));
      setSuggestionPool(mapped);
    } catch (error) {
      console.error("Failed to load quick search suggestions", error);
      setSuggestionError("Không thể tải gợi ý nhanh. Vui lòng thử lại.");
    } finally {
      setIsSuggestionLoading(false);
    }
  }, [isSuggestionLoading, suggestionPool.length]);

  const handleSuggestionSelect = (keyword) => {
    if (!keyword) return;
    setSearchTerm(keyword);
    setIsSuggestionOpen(false);
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  // Refresh unread count when tab gains focus (simple live update)
  useEffect(() => {
    if (!isMounted) return;

    const onFocus = () => {
      const userId = localStorage.getItem("userId");
      if (userId) fetchUnreadCount(userId);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [isMounted]);

  // Optional polling every 30s to catch new notifications
  useEffect(() => {
    if (!isMounted) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const timer = setInterval(() => fetchUnreadCount(userId), 30000);
    return () => clearInterval(timer);
  }, [isMounted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setIsSuggestionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() && !suggestionPool.length && !isSuggestionLoading) {
      loadSuggestionCatalog();
    }
  }, [
    searchTerm,
    suggestionPool.length,
    isSuggestionLoading,
    loadSuggestionCatalog,
  ]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    if (!suggestionPool.length) return;

    const timeout = setTimeout(() => {
      const query = searchTerm.trim().toLowerCase();
      const matched = suggestionPool
        .filter((item) => {
          const titleMatch = item.title?.toLowerCase().includes(query);
          const authorMatch = item.author
            ? item.author.toLowerCase().includes(query)
            : false;
          return titleMatch || authorMatch;
        })
        .slice(0, 6);
      setSuggestions(matched);
    }, 180);

    return () => clearTimeout(timeout);
  }, [searchTerm, suggestionPool]);

  const trimmedSearch = searchTerm.trim();
  const shouldShowSuggestionPanel =
    isSuggestionOpen && trimmedSearch.length > 0;

  const handleLogout = async () => {
    if (!isMounted) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/api/auth/logout"), {
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
      alert("Không thể kết nối tới server!");
    }
  };

  const handleSearch = () => {
    if (!trimmedSearch) return;
    setIsSuggestionOpen(false);
    setSuggestions([]);
    router.push(`/search?keyword=${encodeURIComponent(trimmedSearch)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchFocus = () => {
    setIsSuggestionOpen(true);
    loadSuggestionCatalog();
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (!isSuggestionOpen) {
      setIsSuggestionOpen(true);
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="contact-info">
          <span>☎ 028.73008182</span>
          <span>✉ hotro@vbook.com</span>
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

      <div className="header-main">
        <div
          className="logo"
          onClick={goToMainPage}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-mark">V</span>
          <span className="logo-type">Book</span>
        </div>

        <div className="search-bar" ref={searchWrapperRef}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              autoComplete="off"
              onFocus={handleSearchFocus}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {isSuggestionLoading && (
              <span className="search-loading-dot" aria-hidden="true" />
            )}
          </div>
          <button onClick={handleSearch}>Tìm kiếm</button>

          {shouldShowSuggestionPanel && (
            <div className="search-suggestions" role="listbox">
              <div className="suggestions-header">
                <p>Gợi ý cho “{trimmedSearch}”</p>
                <span>Nhấn Enter để xem tất cả kết quả</span>
              </div>
              <div className="suggestions-body">
                {isSuggestionLoading && (
                  <div className="suggestion-empty">Đang tải gợi ý...</div>
                )}
                {!isSuggestionLoading && suggestionError && (
                  <div className="suggestion-empty">{suggestionError}</div>
                )}
                {!isSuggestionLoading &&
                  !suggestionError &&
                  suggestions.length === 0 && (
                    <div className="suggestion-empty">
                      Không tìm thấy kết quả phù hợp.
                    </div>
                  )}
                {!isSuggestionLoading &&
                  !suggestionError &&
                  suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="suggestion-item"
                      role="option"
                      tabIndex={0}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionSelect(item.title)}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="suggestion-thumb"
                        />
                      )}
                      <div className="suggestion-content">
                        <p className="suggestion-title">
                          {highlightMatch(item.title)}
                        </p>
                        <span className="suggestion-meta">
                          {item.author || "Tác giả đang cập nhật"}
                          {typeof item.price === "number"
                            ? ` • ${formatPrice(item.price)}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="right-section">
          <div className="header-icons">
            <div className="icon-item" onClick={goToOrderHistory}>
              <FileClock className="icon" />
              <p>Lịch sử đơn hàng</p>
            </div>

            <div
              className="icon-item"
              onClick={goToNotifications}
              style={{ position: "relative" }}
            >
              <Bell className="icon" />
              {notifCount > 0 && (
                <span className="badge-dot">{notifCount}</span>
              )}
              <p>Thông Báo</p>
            </div>

            <div
              className="icon-item"
              onClick={goToCart}
              style={{ position: "relative" }}
            >
              <ShoppingCart className="icon" />
              {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
              <p>Giỏ Hàng</p>
            </div>
          </div>

          <div className="cart-info">
            <p>Tư vấn bán hàng</p>
            <strong>028.73008182</strong>
          </div>
        </div>
      </div>

      {/* Support Request Button */}
      <SupportRequestButton />
    </header>
  );
}
