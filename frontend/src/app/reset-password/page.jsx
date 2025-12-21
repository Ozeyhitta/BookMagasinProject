"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Eye, EyeOff } from "lucide-react";
import styles from "./ResetPassword.module.css";

function ResetPasswordContent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation rules - individual checks
  const passwordChecks = useMemo(() => {
    return {
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*]/.test(newPassword),
      hasMinLength: newPassword.length >= 8,
    };
  }, [newPassword]);

  // Check if all password rules are satisfied
  const isPasswordValid = useMemo(() => {
    return Object.values(passwordChecks).every((check) => check === true);
  }, [passwordChecks]);

  // Password validation rules list for UI
  const passwordRules = [
    {
      key: "hasUppercase",
      label: "Chứa chữ hoa",
      satisfied: passwordChecks.hasUppercase,
    },
    {
      key: "hasLowercase",
      label: "Chứa chữ thường",
      satisfied: passwordChecks.hasLowercase,
    },
    {
      key: "hasNumber",
      label: "Chứa số",
      satisfied: passwordChecks.hasNumber,
    },
    {
      key: "hasSpecialChar",
      label: "Chứa ký tự đặc biệt (!@#$%^&*)",
      satisfied: passwordChecks.hasSpecialChar,
    },
    {
      key: "hasMinLength",
      label: "Tối thiểu 8 ký tự",
      satisfied: passwordChecks.hasMinLength,
    },
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (!savedEmail) {
      setMsg("❌ Không tìm thấy email để đặt lại mật khẩu!");
    } else {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // Validate password strength
    if (!isPasswordValid) {
      setMsg("❌ Mật khẩu chưa đáp ứng đủ yêu cầu bảo mật!");
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      setMsg("❌ Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const text = await res.text();

      if (res.ok) {
        setMsg("success");
        localStorage.removeItem("resetEmail");
        setTimeout(() => router.replace("/login"), 2000);
      } else {
        // Parse JSON error response nếu có
        let errorMessage = text;
        try {
          const errorJson = JSON.parse(text);
          // Lấy message từ JSON error response
          errorMessage = errorJson.message || errorJson.error || text;
        } catch {
          // Nếu không phải JSON, giữ nguyên text
          errorMessage = text;
        }
        setMsg("❌ " + errorMessage);
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
          <div>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password Requirements Checklist */}
            {newPassword && (
              <div className={styles.checklist}>
                {passwordRules.map((rule) => (
                  <div
                    key={rule.key}
                    className={`${styles.checklistItem} ${
                      rule.satisfied ? styles.satisfied : styles.unsatisfied
                    }`}
                  >
                    {rule.satisfied ? (
                      <Check size={16} className={styles.checkIcon} />
                    ) : (
                      <X size={16} className={styles.crossIcon} />
                    )}
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !isPasswordValid || newPassword !== confirmPassword}
            className={`${styles.button} ${
              loading || !isPasswordValid || newPassword !== confirmPassword
                ? styles.disabled
                : ""
            }`}
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
