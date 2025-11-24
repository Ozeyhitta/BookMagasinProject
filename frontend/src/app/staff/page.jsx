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
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

import "./staff.css";

import InformationManagement from "./components/InformationManagement";
import ViewNotifications from "./components/ViewNotifications";
import BookList from "./components/BookList";
import ProcessOrders from "./components/ProcessOrders";
import ViewReviews from "./components/ViewReviews"; // 🔹 mới
import ProcessReturns from "./components/ProcessReturns"; // 🔹 mới

export default function StaffPage() {
  const router = useRouter();

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
  ];

  const [activeIndex, setActiveIndex] = useState(0);

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
      </main>
    </div>
  );
}
