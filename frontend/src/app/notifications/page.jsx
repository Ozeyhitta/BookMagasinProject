"use client";

import { useEffect, useState } from "react";
import styles from "./notifications.module.css";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [listRes, countRes] = await Promise.all([
          fetch(`http://localhost:8080/api/notifications/user/${userId}`),
          fetch(`http://localhost:8080/api/notifications/user/${userId}/unread-count`),
        ]);

        if (!listRes.ok) throw new Error("Không thể tải danh sách thông báo");
        const listData = await listRes.json();
        const countData = countRes.ok ? await countRes.json() : 0;

        setNotifications(Array.isArray(listData) ? listData : []);
        setUnreadCount(Number(countData) || 0);
      } catch (err) {
        console.error(err);
        setError(err.message || "Có lỗi khi tải thông báo");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const onFocus = () => loadData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [router]);

  const markAsRead = async (id) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const target = notifications.find((n) => n.id === id);
    if (!target || target.read) return;
    try {
      await fetch(`http://localhost:8080/api/notifications/mark-read/${id}/user/${userId}`, {
        method: "POST",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Không thể đánh dấu đã đọc", err);
      alert("Không thể đánh dấu đã đọc, vui lòng thử lại.");
    }
  };

  const removeCard = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) {
    return <p className={styles.loading}>Đang tải thông báo...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Thông báo</h1>
        <div className={styles.unreadBadge}>Chưa đọc: {unreadCount}</div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {notifications.length === 0 ? (
        <p className={styles.empty}>Không có thông báo nào.</p>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map((n) => {
            const isRead = Boolean(n.read);
            return (
              <div
                key={n.id}
                className={`${styles.notificationItem} ${isRead ? styles.read : styles.unread}`}
                onClick={() => markAsRead(n.id)}
              >
                <button className={styles.closeBtn} onClick={(e) => { e.stopPropagation(); removeCard(n.id); }}>
                  ×
                </button>

                <div className={styles.content}>
                  <div className={styles.header}>
                    <div className={styles.meta}>
                      {!isRead && <span className={styles.unreadDot} />}
                      <span className={styles.time}>
                        {n.createAt ? new Date(n.createAt).toLocaleString("vi-VN") : "Không xác định"}
                      </span>
                    </div>
                    <button
                      className={styles.markBtn}
                      onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                      disabled={isRead}
                    >
                      {isRead ? "Đã đọc" : "Đánh dấu đã đọc"}
                    </button>
                  </div>

                  <h3 className={styles.notifTitle}>{n.title || "Không có tiêu đề"}</h3>
                  <p className={styles.description}>{n.message || "Không có nội dung"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
