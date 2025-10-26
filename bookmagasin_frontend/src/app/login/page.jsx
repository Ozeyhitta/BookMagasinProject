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

      if (!res.ok) {
        throw new Error("Sai email hoặc mật khẩu");
      }

      const data = await res.json();
      console.log("Login success:", data);

      // ✅ Lưu token
      localStorage.setItem("token", data.token);

      // ✅ Chuyển hướng sang trang chính
      window.location.href = "/mainpage";
    } catch (err) {
      setError(err.message);
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
      // ⚙️ Gọi API reset password (giả lập hoặc backend thực)
      const res = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      if (res.ok) {
        setResetMessage("✅ Email đặt lại mật khẩu đã được gửi!");
      } else {
        const text = await res.text();
        setResetMessage("❌ Lỗi: " + text);
      }
    } catch (error) {
      setResetMessage("❌ Không thể kết nối đến server!");
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
            {/* FORM QUÊN MẬT KHẨU */}
            <h3>Khôi phục mật khẩu</h3>
            <form onSubmit={handleForgotPassword}>
              <label>Nhập email của bạn</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit">Gửi yêu cầu</button>
            </form>

            {resetMessage && (
              <div
                className={`msg ${
                  resetMessage.startsWith("✅") ? "success" : "error"
                }`}
              >
                {resetMessage.startsWith("✅") ? (
                  <>
                    <Check size={18} style={{ marginRight: 6 }} /> Email đặt lại
                    mật khẩu đã được gửi!
                  </>
                ) : (
                  <>
                    <X size={18} style={{ marginRight: 6 }} />{" "}
                    {resetMessage.replace("❌ ", "")}
                  </>
                )}
              </div>
            )}

            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(false);
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
