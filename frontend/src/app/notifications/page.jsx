"use client";

import { useEffect, useState } from "react";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy thông báo
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/notifications");
        if (!response.ok) throw new Error("Không thể lấy dữ liệu từ server");

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleRemove = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  if (loading) {
    return <p className={styles.loading}>Đang tải thông báo...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>THÔNG BÁO</h1>

      {notifications.length === 0 ? (
        <p className={styles.empty}>Không có thông báo nào.</p>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map((n) => (
            <div key={n.id} className={styles.notificationItem}>
              <button
                className={styles.closeBtn}
                onClick={() => handleRemove(n.id)}
              >
                ✕
              </button>

              <div className={styles.content}>
                <div className={styles.header}>
                  <span className={styles.time}>
                    {new Date(n.createAt).toLocaleString("vi-VN")}
                  </span>
                </div>

                <h3 className={styles.notifTitle}>
                  {n.title || "Không có tiêu đề"}
                </h3>
                <p className={styles.description}>
                  {n.message || "Không có nội dung"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
