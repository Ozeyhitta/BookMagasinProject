"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Register.module.css";
import { Check, X, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password validation regex
  // Explanation:
  // ^(?=.*[a-z])  - Lookahead: must contain at least one lowercase letter
  // (?=.*[A-Z])   - Lookahead: must contain at least one uppercase letter
  // (?=.*[!@#$%^&*]) - Lookahead: must contain at least one special character
  // (?=.*\d)      - Lookahead: must contain at least one digit
  // .{8,}$        - At least 8 characters total
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;

  const validatePassword = (password) => {
    if (!password) {
      return "Mật khẩu không được để trống";
    }
    if (!strongPasswordRegex.test(password)) {
      return "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*)";
    }
    return null;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    // ⚠️ Validate password strength
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setMsg({ type: "error", text: passwordError });
      setLoading(false);
      return;
    }

    // ⚠️ Kiểm tra mật khẩu nhập lại
    if (form.password !== form.confirmPassword) {
      setMsg({ type: "error", text: "Mật khẩu nhập lại không khớp" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/register-customer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Đăng ký thất bại");
      }

      const data = await res.json();
      setMsg({
        type: "success",
        text: `Đăng ký thành công: ${data?.user?.fullName}`,
      });

      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Đăng ký</h1>

        <form className={styles.card} onSubmit={onSubmit}>
          <label className={styles.label}>
            Họ tên
            <input
              className={styles.input}
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              required
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.label}>
            Mật khẩu
            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className={styles.label}>
            Nhập lại mật khẩu
            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeBtn}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {msg && (
            <p
              className={`${styles.msg} ${
                msg.type === "success" ? styles.success : styles.error
              }`}
            >
              {msg.text}
            </p>
          )}
        </form>

        <p className={styles.loginText}>
          Đã có tài khoản?{" "}
          <Link href="/login" className={styles.loginLink}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
