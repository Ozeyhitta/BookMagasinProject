"use client";

import { useEffect, useState } from "react";
import { Bell, Send } from "lucide-react";
import styles from "../admin.module.css";

export default function CreateNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetMode, setTargetMode] = useState("all"); // all | selected
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/staffs");
        if (res.ok) {
          const data = await res.json();
          setStaffs(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Không tải được danh sách staff", e);
      }
    };
    fetchStaffs();
  }, []);

  const toggleStaff = (id) => {
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    if (targetMode === "selected" && selectedStaff.length === 0) {
      alert("Chọn ít nhất 1 nhân viên hoặc chọn chế độ gửi toàn bộ.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          title,
          message,
          type: "ADMIN",
          userIds: targetMode === "selected" ? selectedStaff : [],
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gửi thông báo thất bại");
      }
      alert("Đã gửi thông báo tới Staff.");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.notifyWrapper}>
      <div className={styles.notifyHeader}>
        <div>
          <div className={styles.pillBadge}>Thông báo Staff</div>
          <h2 className={styles.subTitle}>Create Notifications</h2>
          <p className={styles.subText}>Soạn và gửi thông báo nhanh tới đội ngũ Staff.</p>
        </div>
        <div className={styles.headerIcon}>
          <Bell size={28} />
        </div>
      </div>

      <div className={styles.notifyGrid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.targetRow}>
            <button
              type="button"
              className={`${styles.chip} ${targetMode === "all" ? styles.chipActive : ""}`}
              onClick={() => setTargetMode("all")}
            >
              Gửi toàn bộ nhân viên
            </button>
            <button
              type="button"
              className={`${styles.chip} ${targetMode === "selected" ? styles.chipActive : ""}`}
              onClick={() => setTargetMode("selected")}
            >
              Chọn nhân viên cụ thể
            </button>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Tiêu đề</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Đơn hàng mới cần xử lý"
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Nội dung</label>
            <textarea
              className={styles.textarea}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nội dung chi tiết cho thông báo..."
            />
            <div className={styles.helperText}>
              {targetMode === "all"
                ? "Thông báo sẽ được gửi tới tất cả tài khoản Staff."
                : "Chỉ gửi tới các nhân viên bạn đã chọn."}
            </div>
          </div>

          {targetMode === "selected" && (
            <div className={styles.staffSelect}>
              <div className={styles.staffList}>
                {staffs.length === 0 && <div className={styles.helperText}>Không có dữ liệu nhân viên.</div>}
                {staffs.map((s) => (
                  <label key={s.id} className={styles.staffItem}>
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(s.id)}
                      onChange={() => toggleStaff(s.id)}
                    />
                    <span>{s.name || s.fullName || `Staff #${s.id}`}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button className={styles.primaryButton} type="submit" disabled={loading}>
            <Send size={16} />
            {loading ? "Đang gửi..." : "Gửi thông báo"}
          </button>
        </form>

        <div className={styles.previewCard}>
          <h4>Preview</h4>
          <div className={styles.previewBox}>
            <div className={styles.previewTitle}>{title || "Tiêu đề thông báo"}</div>
            <div className={styles.previewMessage}>{message || "Nội dung thông báo sẽ hiển thị ở đây."}</div>
            <div className={styles.previewTag}>Gửi tới: Staff</div>
          </div>
          <ul className={styles.tipList}>
            <li>Ngắn gọn, rõ ràng để staff đọc nhanh.</li>
            <li>Nên kèm mã đơn hoặc hành động cụ thể.</li>
            <li>Thông báo sẽ xuất hiện ngay cho tất cả staff.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
