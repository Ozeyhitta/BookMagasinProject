"use client";
import { useState } from "react";
import "./login.css";
import { Check, X } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // ✅ hiển thị form quên mật khẩu
  const [resetEmail, setResetEmail] = useState(""); // email nhập trong quên mật khẩu
  const [resetMessage, setResetMessage] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

  // 🔑 Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text(); // đọc text trước

      if (!res.ok) {
        setError(text); // hiện đúng lỗi từ backend
        return;
      }

      const data = JSON.parse(text);

      // Lưu token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      window.location.href = "/mainpage";
    } catch (err) {
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Gửi yêu cầu đặt lại mật khẩu
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage(null);

    if (!resetEmail) {
      setResetMessage("Vui lòng nhập email để khôi phục mật khẩu!");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      const text = await res.text();

      if (res.ok) {
        setResetMessage("✅ Mã OTP 6 số đã được gửi đến email của bạn!");
        setShowOtpForm(true); // ✅ Bật form OTP
      } else {
        setResetMessage("❌ " + text);
      }
    } catch (error) {
      setResetMessage("❌ Lỗi kết nối đến server!");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setResetMessage(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp }),
      });

      const text = await res.text();

      if (res.ok) {
        setResetMessage("✅ OTP hợp lệ! Vui lòng nhập mật khẩu mới.");

        // ✅ Lưu email vào localStorage để trang reset-password dùng
        localStorage.setItem("resetEmail", resetEmail);

        window.location.href = `/reset-password`;
      } else {
        setResetMessage("❌ " + text);
      }
    } catch (error) {
      setResetMessage("❌ Lỗi kết nối server!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>

        {!showForgot ? (
          <>
            {/* FORM ĐĂNG NHẬP */}
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {error && (
              <div className="msg error">
                <X size={18} style={{ marginRight: 6 }} /> {error}
              </div>
            )}

            <div className="extra-links">
              <p>
                Chưa có tài khoản? <a href="/register">Đăng ký</a>
              </p>
              <p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgot(true);
                  }}
                >
                  Quên mật khẩu?
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* ==== BƯỚC 1: NHẬP EMAIL ==== */}
            {!showOtpForm && (
              <>
                <h3>Khôi phục mật khẩu</h3>
                <form onSubmit={handleForgotPassword}>
                  <label>Nhập email của bạn</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Gửi mã OTP</button>
                </form>
              </>
            )}

            {/* ==== BƯỚC 2: NHẬP OTP ==== */}

            {showOtpForm && (
              <>
                <h3>Nhập mã OTP</h3>

                <div className="otp-container">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className="otp-input"
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/, "");
                        const newOtp = otp.split("");

                        // nếu người dùng xoá, cập nhật lại chuỗi
                        newOtp[i] = value || "";
                        setOtp(newOtp.join(""));

                        // tự chuyển sang ô kế tiếp nếu nhập số
                        if (value) {
                          const next = document.getElementById(`otp-${i + 1}`);
                          if (next) next.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i]) {
                          const prev = document.getElementById(`otp-${i - 1}`);
                          if (prev) prev.focus();
                        }
                      }}
                      id={`otp-${i}`}
                    />
                  ))}
                </div>

                <button
                  className="otp-submit-btn"
                  onClick={handleVerifyOtp}
                  style={{ marginTop: 15 }}
                >
                  Xác nhận OTP
                </button>
              </>
            )}

            {/* Thông báo */}
            {resetMessage && (
              <div
                className={`msg ${
                  resetMessage.startsWith("✅") ? "success" : "error"
                }`}
              >
                {resetMessage}
              </div>
            )}

            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(false);
                  setShowOtpForm(false);
                  setResetMessage(null);
                }}
              >
                ← Quay lại đăng nhập
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
