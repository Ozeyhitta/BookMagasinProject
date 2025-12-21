"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  List,
  Type,
  Star,
  RotateCcw,
  MessageCircle,
  LogOut,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

import "./staff.css";

import InformationManagement from "./components/InformationManagement";
import ViewNotifications from "./components/ViewNotifications";
import BookList from "./components/BookList";
import ProcessOrders from "./components/ProcessOrders";
import ViewReviews from "./components/ViewReviews"; // 🔹 mới
import ProcessReturns from "./components/ProcessReturns"; // 🔹 mới
import CustomerSupport from "./components/CustomerSupport"; // 🔹 mới

export default function StaffPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    // Kiểm tra đăng nhập
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    // Kiểm tra role STAFF từ localStorage
    const hasStaffRoleFromStorage =
      role === "STAFF" || (role && role.includes("STAFF"));

    if (!hasStaffRoleFromStorage) {
      alert(
        "Bạn không có quyền truy cập trang này! Chỉ nhân viên mới có thể truy cập."
      );
      router.push("/");
      return;
    }

    // Kiểm tra trạng thái staff từ API (kiểm tra cả role và activated)
    axiosClient
      .get(`/staff-requests/status/${userId}`)
      .then((statusRes) => {
        const statusData = statusRes.data;
        // isApproved = true chỉ khi: status APPROVED, có role STAFF, VÀ account đang activated
        const isApprovedStaff = statusData.isApproved === true;

        if (!isApprovedStaff) {
          // Nếu không còn là staff hoặc đã bị khóa, chuyển về trang chủ
          if (statusData.isActivated === false) {
            alert(
              "Tài khoản nhân viên của bạn đã bị khóa! Vui lòng liên hệ quản trị viên."
            );
          } else {
            alert(
              "Bạn không có quyền truy cập trang này! Chỉ nhân viên mới có thể truy cập."
            );
          }
          router.push("/");
          return;
        }
      })
      .catch((err) => {
        console.error("Error fetching staff status:", err);
        // Nếu không lấy được API, vẫn cho phép truy cập nếu có role từ localStorage
        // (fallback behavior)
      });
  }, [router]);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Information Management" },
    { icon: <Bell size={20} />, label: "View notifications" },
    { icon: <List size={20} />, label: "View book list" },
    { icon: <Type size={20} />, label: "Process Orders" },
    // 🔹 Mục mới: View reviews
    { icon: <Star size={20} />, label: "View reviews" },
    // 🔹 Mục mới: Process Returns
    { icon: <RotateCcw size={20} />, label: "Process Returns" },
    // 🔹 Mục mới: Customer Support
    { icon: <MessageCircle size={20} />, label: "Customer Support" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");

    if (!confirmed) {
      return;
    }

    setIsLoggingOut(true);

    try {
      // Clear all authentication-related localStorage items
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("cartCount");

      // Optional: Clear any other cached auth state
      // sessionStorage.clear(); // Uncomment if you use sessionStorage

      // Show success message
      alert("Đăng xuất thành công!");

      // Redirect to login page
      // Using replace to prevent back button navigation
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="staff-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">CREATIVE TIM</div>

        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="logout-section">
          <button
            className={`logout-button ${isLoggingOut ? "logging-out" : ""}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <span className="icon">
              <LogOut size={20} />
            </span>
            <span className="label">
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="staff-content">
        {activeIndex === 0 && <InformationManagement />}
        {activeIndex === 1 && <ViewNotifications />}
        {activeIndex === 2 && <BookList />}
        {activeIndex === 3 && <ProcessOrders />}
        {activeIndex === 4 && <ViewReviews />}
        {/* 🔹 tab mới */}
        {activeIndex === 5 && <ProcessReturns />}
        {/* 🔹 tab mới */}
        {activeIndex === 6 && <CustomerSupport />}
        {/* 🔹 tab mới */}
      </main>
    </div>
  );
}
