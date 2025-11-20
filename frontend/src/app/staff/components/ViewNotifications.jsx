"use client";

import React, { useState, useEffect } from "react";
import styles from "./ViewNotifications.module.css";

export default function ViewNotifications() {
  const [notifications, setNotifications] = useState({
    customer: [],
    staff: [],
    admin: [],
  });
  const [readStatus, setReadStatus] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/notifications/staff-view")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải thông báo:", err);
        setLoading(false);
      });
  }, []);

  const openDetail = (section, msg, idx) => {
    setReadStatus((prev) => ({ ...prev, [`${section}-${idx}`]: true }));
    setSelected({ title: section.toUpperCase(), message: msg });
  };

  const closeDetail = () => setSelected(null);

  if (loading) {
    return <div className={styles.card}>Đang tải thông báo...</div>;
  }

  const sections = [
    { key: "staff", label: "Thông báo Staff", tone: "staff" },
    { key: "customer", label: "Thông báo Customer", tone: "customer" },
    { key: "admin", label: "Thông báo Admin", tone: "admin" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <div className={styles.pill}>Thông báo</div>
            <h2 className={styles.title}>Trung tâm thông báo</h2>
            <p className={styles.desc}>Nhấn vào từng thông báo để xem chi tiết và đánh dấu đã đọc.</p>
          </div>
        </div>

        <div className={styles.listGrid}>
          {sections.map(({ key, label, tone }) => (
            <div key={key} className={styles.sectionCard}>
              <div className={`${styles.sectionHeader} ${styles[`tone-${tone}`]}`}>
                <span>{label}</span>
              </div>
              <div className={styles.list}>
                {(notifications[key] || []).map((msg, idx) => (
                  <div
                    key={`${key}-${idx}`}
                    className={`${styles.item} ${readStatus[`${key}-${idx}`] ? styles.read : ""}`}
                    onClick={() => openDetail(key, msg, idx)}
                  >
                    <span className={`${styles.dot} ${readStatus[`${key}-${idx}`] ? styles.dotRead : ""}`} />
                    <div className={styles.msgBlock}>
                      <div className={styles.msgTitle}>{msg?.split(" - ")[0] || "Thông báo"}</div>
                      <div className={styles.msgText}>{msg}</div>
                    </div>
                    <button className={styles.viewBtn}>Xem</button>
                  </div>
                ))}
                {(notifications[key] || []).length === 0 && (
                  <div className={styles.empty}>Chưa có thông báo.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className={styles.modal} onClick={closeDetail}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalPill}>{selected.title}</div>
              <button className={styles.closeBtn} onClick={closeDetail}>×</button>
            </div>
            <h3 className={styles.modalTitle}>{selected.message?.split(" - ")[0] || "Thông báo"}</h3>
            <p className={styles.modalBody}>{selected.message}</p>
            <div className={styles.modalActions}>
              <button className={styles.primaryBtn} onClick={closeDetail}>Đã hiểu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
