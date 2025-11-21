"use client";
import { useState } from "react";
import "./login.css";
import { Check, X, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // ✅ hiển thị form quên mật khẩu
  const [resetEmail, setResetEmail] = useState(""); // email nhập trong quên mật khẩu
  const [resetMessage, setResetMessage] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

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

      // Lưu token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);

      // Xác định redirect URL dựa trên role
      let redirectUrl = "/mainpage";
      if (data.role === "ADMIN") {
        redirectUrl = "/admin";
      } else if (data.role === "STAFF") {
        redirectUrl = "/staff";
      }

      window.location.href = redirectUrl;
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

    setResetLoading(true);
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
        setResetMessage("❌ " + errorMessage);
      }
    } catch (error) {
      setResetMessage("❌ Lỗi kết nối đến server!");
    } finally {
      setResetLoading(false);
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
        setResetMessage("❌ " + errorMessage);
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
                  autoComplete="email"
                  required
                />
              </div>

              <div className="password-field">
                <label>Mật khẩu</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                  <button type="submit" disabled={resetLoading}>
                    {resetLoading ? "Đang gửi..." : "Gửi mã OTP"}
                  </button>
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
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData("text");
                        // Lấy 6 số đầu tiên từ dữ liệu paste
                        const digits = pastedData
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        if (digits.length === 6) {
                          setOtp(digits);
                          // Focus vào ô cuối cùng
                          const lastInput = document.getElementById(`otp-5`);
                          if (lastInput) lastInput.focus();
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
