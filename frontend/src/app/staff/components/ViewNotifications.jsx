"use client";

import React, { useState, useEffect } from "react";
import styles from "./ViewNotifications.module.css";
import axiosClient from "../../../utils/axiosClient";

export default function ViewNotifications() {
  const [notifications, setNotifications] = useState({
    customer: [],
    staff: [],
    admin: [],
  });
  const [readStatus, setReadStatus] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosClient.get("/notifications/staff-view");
        const payload = res.data?.data || res.data || {};
        setNotifications({
          customer: payload.customer || [],
          staff: payload.staff || [],
          admin: payload.admin || [],
        });
      } catch (err) {
        console.warn("Fetch notifications failed:", err);
        setError("Khong the tai thong bao. Vui long kiem tra backend.");
        setNotifications({ customer: [], staff: [], admin: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const openDetail = (section, msg, idx) => {
    setReadStatus((prev) => ({ ...prev, [`${section}-${idx}`]: true }));
    setSelected({ title: section.toUpperCase(), message: msg });
  };

  const closeDetail = () => setSelected(null);

  if (loading) {
    return <div className={styles.card}>Dang tai thong bao...</div>;
  }

  if (error) {
    return <div className={styles.card}>{error}</div>;
  }

  const sections = [
    { key: "staff", label: "Thong bao Staff", tone: "staff" },
    { key: "customer", label: "Thong bao Customer", tone: "customer" },
    { key: "admin", label: "Thong bao Admin", tone: "admin" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <div className={styles.pill}>Thong bao</div>
            <h2 className={styles.title}>Trung tam thong bao</h2>
            <p className={styles.desc}>
              Nhan vao tung thong bao de xem chi tiet va danh dau da doc.
            </p>
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
                      <div className={styles.msgTitle}>{msg?.split(" - ")[0] || "Thong bao"}</div>
                      <div className={styles.msgText}>{msg}</div>
                    </div>
                    <button className={styles.viewBtn}>Xem</button>
                  </div>
                ))}
                {(notifications[key] || []).length === 0 && (
                  <div className={styles.empty}>Chua co thong bao.</div>
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
              <button className={styles.closeBtn} onClick={closeDetail}>
                ×
              </button>
            </div>
            <h3 className={styles.modalTitle}>{selected.message?.split(" - ")[0] || "Thong bao"}</h3>
            <p className={styles.modalBody}>{selected.message}</p>
            <div className={styles.modalActions}>
              <button className={styles.primaryBtn} onClick={closeDetail}>
                Da hieu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
