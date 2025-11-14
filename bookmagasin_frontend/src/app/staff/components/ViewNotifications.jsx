"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ViewNotifications() {
  const [notifications, setNotifications] = useState({
    customer: [],
    staff: [],
    admin: [],
  });

  const [readStatus, setReadStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/notifications/staff-view")
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải thông báo:", err);
        setLoading(false);
      });
  }, []);

  const handleClick = (key) => {
    setReadStatus((prev) => ({ ...prev, [key]: true }));
  };

  if (loading) {
    return <div className="info-card">Đang tải thông báo...</div>;
  }

  return (
    <div className="info-card">
      <h1>STAFF NOTIFICATIONS</h1>
      <p className="subtext">Danh sách các thông báo quan trọng của hệ thống.</p>

      {Object.entries(notifications).map(([section, messages]) => (
        <div key={section} className="notification-section">
          <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
          <ul>
            {messages.map((msg, i) => (
              <li
                key={`${section}-${i}`}
                onClick={() => handleClick(`${section}-${i}`)}
                className={
                  readStatus[`${section}-${i}`] ? "read-item" : "unread-item"
                }
              >
                <span
                  className={`dot ${
                    readStatus[`${section}-${i}`] ? "read" : "unread"
                  }`}
                ></span>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
