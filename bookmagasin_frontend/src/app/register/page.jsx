"use client";

import { useState } from "react";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/register-customer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error((await res.text()) || "Đăng ký thất bại");
      const data = await res.json();
      setMsg({
        type: "success",
        text: `Đăng ký thành công: ${data?.user?.fullName}`,
      });
      setForm({ fullName: "", email: "", password: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };
  console.log("API base:", process.env.NEXT_PUBLIC_API_BASE);

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
              required
            />
          </label>

          <label className={styles.label}>
            Mật khẩu
            <input
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              minLength={6}
              required
            />
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
      </div>
    </div>
  );
}
