"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InformationManagement() {
  const USER_ID = 1; // ID mặc định

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    avatarUrl: "",
    position: "",
    joinDate: "",
  });

  const [loading, setLoading] = useState(true);

  // ============================
  // 1) Load dữ liệu từ backend
  // ============================
useEffect(() => {
  axios.get(`http://localhost:8080/api/users/${USER_ID}`)
    .then((res) => {
      const data = res.data;

      setForm({
        fullName: data.fullName || "",
        email: data.email || data.account?.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
        gender: data.gender || "",
        avatarUrl: data.avatarUrl || "",
        position: data.position || "",
        joinDate: data.joinDate ? data.joinDate.substring(0, 10) : "",
      });

      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);



  // ============================
  // 2) Handle input
  // ============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // 3) Cập nhật dữ liệu
  // ============================
  const handleSave = () => {
    axios
      .put(`http://localhost:8080/api/users/${USER_ID}`, form)
      .then(() => {
        alert("✔ Cập nhật thành công!");
      })
      .catch((err) => {
        console.error("Lỗi cập nhật:", err);
        alert("❌ Lỗi khi cập nhật!");
      });
  };

  if (loading) {
    return (
      <div className="info-card" style={{ textAlign: "center" }}>
        Đang tải thông tin...
      </div>
    );
  }

  return (
    <div className="info-card">
      <h1>INFORMATION MANAGEMENT</h1>
      <p className="subtext">
        Trang cho phép bạn xem và cập nhật thông tin cá nhân trong hệ thống.
      </p>

      <form className="info-form">

        {/* FULL NAME */}
        <label>Họ và tên</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} />

        {/* EMAIL */}
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        {/* PHONE */}
        <label>Số điện thoại</label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        {/* ADDRESS */}
        <label>Địa chỉ</label>
        <input name="address" value={form.address} onChange={handleChange} />

        {/* DATE OF BIRTH */}
        <label>Ngày sinh</label>
        <input
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={handleChange}
        />

        {/* GENDER */}
        <label>Giới tính</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">-- Chọn giới tính --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>

        {/* AVATAR */}
        <label>Avatar URL</label>
        <input
          name="avatarUrl"
          value={form.avatarUrl}
          onChange={handleChange}
          placeholder="https://link-to-avatar.com/image.jpg"
        />

        {form.avatarUrl && (
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <img
              src={form.avatarUrl}
              alt="Avatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "3px solid #9d4edd",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* POSITION */}
        <label>Chức vụ</label>
        <input name="position" value={form.position} onChange={handleChange} />

        {/* JOIN DATE */}
        <label>Ngày vào làm</label>
        <input
          name="joinDate"
          type="date"
          value={form.joinDate}
          onChange={handleChange}
        />

        <div className="button-group">
          <button type="button" className="save-btn" onClick={handleSave}>
            💾 Lưu
          </button>
          <button type="button" className="cancel-btn">
            ❌ Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
