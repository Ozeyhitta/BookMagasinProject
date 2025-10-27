"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import styles from "./ResetPassword.module.css";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (newPassword !== confirmPassword) {
      setMsg("❌ Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        setMsg("success");
        window.history.replaceState(null, "", "/reset-password");
        setTimeout(() => router.replace("/login"), 2000);
      } else {
        setMsg("error");
      }
    } catch {
      setMsg("network");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${loading ? styles.disabled : ""}`}
          >
            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </form>

        {msg && (
          <div
            className={`${styles.msg} ${
              msg === "success" ? styles.success : styles.error
            }`}
          >
            {msg === "success" && (
              <>
                <Check size={18} style={{ marginRight: 6 }} /> Mật khẩu đã được
                thay đổi thành công!
              </>
            )}
            {msg === "error" && (
              <>
                <X size={18} style={{ marginRight: 6 }} /> Có lỗi xảy ra khi đặt
                lại mật khẩu.
              </>
            )}
            {msg === "network" && (
              <>
                <X size={18} style={{ marginRight: 6 }} /> Không thể kết nối đến
                server!
              </>
            )}
            {msg.startsWith("❌") && msg}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
