"use client";
import React, { useState } from "react";
import { LayoutDashboard, Bell, List, Type } from "lucide-react";

import "./staff.css";

import InformationManagement from "./components/InformationManagement";
import ViewNotifications from "./components/ViewNotifications";
import BookList from "./components/BookList";
import ProcessOrders from "./components/ProcessOrders";

export default function StaffPage() {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Information Management" },
    { icon: <Bell size={20} />, label: "View notifications" },
    { icon: <List size={20} />, label: "View book list" },
    { icon: <Type size={20} />, label: "Process Orders" },
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

        <div className="upgrade-section">
          <button className="upgrade-btn">UPGRADE TO PRO</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="staff-content">
        {activeIndex === 0 && <InformationManagement />}
        {activeIndex === 1 && <ViewNotifications />}
        {activeIndex === 2 && <BookList />}
        {activeIndex === 3 && <ProcessOrders />}
      </main>
    </div>
  );
}
