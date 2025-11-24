"use client";

import { useEffect, useState } from "react";
import { Bell, Send, Users } from "lucide-react";
import styles from "../admin.module.css";

export default function CreateNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetMode, setTargetMode] = useState("all");
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
      alert("Chọn ít nhất 1 nhân viên hoặc chọn gửi toàn bộ.");
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
      setSelectedStaff([]);
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.broadcastShell}>
      <div className={styles.broadcastHeader}>
        <div>
          <p className={styles.broadcastEyebrow}>Thông báo Staff</p>
          <h2 className={styles.broadcastTitle}>Create Notifications</h2>
          <p className={styles.broadcastLead}>
            Soạn và gửi thông báo nhanh tới đội ngũ Staff. Bạn có thể gửi cho toàn bộ nhân viên hoặc chọn từng người.
          </p>
        </div>
        <div className={styles.broadcastIcon}>
          <Bell size={32} />
        </div>
      </div>

      <div className={styles.broadcastGrid}>
        <form className={styles.broadcastForm} onSubmit={handleSubmit}>
          <div className={styles.modeSwitcher}>
            <button
              type="button"
              className={`${styles.modeButton} ${
                targetMode === "all" ? styles.modeActive : ""
              }`}
              onClick={() => setTargetMode("all")}
            >
              <Users size={18} />
              Gửi toàn bộ nhân viên
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${
                targetMode === "selected" ? styles.modeActive : ""
              }`}
              onClick={() => setTargetMode("selected")}
            >
              <Users size={18} />
              Chọn nhân viên cụ thể
            </button>
          </div>

          <label className={styles.field}>
            <span>Tiêu đề</span>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Đơn hàng mới cần xử lý"
            />
          </label>

          <label className={styles.field}>
            <span>Nội dung</span>
            <textarea
              className={styles.textarea}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung chi tiết cho thông báo..."
            />
            <small className={styles.helperText}>
              {targetMode === "all"
                ? "Thông báo sẽ được gửi tới tất cả tài khoản Staff."
                : "Chỉ gửi tới các nhân viên bạn đã chọn bên dưới."}
            </small>
          </label>

          {targetMode === "selected" && (
            <div className={styles.staffPicker}>
              <p>Chọn nhân viên</p>
              <div className={styles.staffGrid}>
                {staffs.length === 0 && (
                  <div className={styles.helperText}>Không có dữ liệu nhân viên.</div>
                )}
                {staffs.map((s) => (
                  <label key={s.id} className={styles.staffChip}>
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

          <button className={styles.broadcastSubmit} type="submit" disabled={loading}>
            <Send size={16} />
            {loading ? "Đang gửi..." : "Gửi thông báo"}
          </button>
        </form>

        <div className={styles.previewCard}>
          <p className={styles.previewLabel}>Preview</p>
          <div className={styles.previewBubble}>
            <p className={styles.previewTitle}>{title || "Tiêu đề thông báo"}</p>
            <p className={styles.previewMessage}>
              {message || "Nội dung thông báo sẽ hiển thị đầy đủ tại đây."}
            </p>
            <span className={styles.previewTag}>
              Gửi tới: {targetMode === "all" ? "Tất cả Staff" : `${selectedStaff.length} Staff`}
            </span>
          </div>

          <ul className={styles.previewTips}>
            <li>Nội dung ngắn gọn giúp staff đọc nhanh.</li>
            <li>Có thể kèm mã đơn hoặc hành động cụ thể.</li>
            <li>Thông báo xuất hiện ngay trong trung tâm Staff.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
