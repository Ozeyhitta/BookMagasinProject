"use client";

import { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import styles from "./account.module.css";

export default function AccountPage() {
  const [formData, setFormData] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const id =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!id) return;

    axiosClient
      .get(`/users/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          fullName: data.fullName || "",
          dateOfBirth: data.dateOfBirth?.substring(0, 10) || "",
          gender: data.gender || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          userId: data.id,
          avatarUrl: data.avatarUrl || "",
          email: data.email || "",
        });

        if (data.email) {
          setEmails([
            {
              id: 1,
              email: data.email,
              verified: true,
              addedDate: "Không rõ",
            },
          ]);
        }
      })
      .catch((err) => console.log("Lỗi API:", err));
  }, []);

  // tránh lỗi khi formData chưa load xong
  if (!formData) return <p>Đang tải dữ liệu...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    try {
      const id = formData.userId;

      await axiosClient.put(`/users/${id}`, {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth, // yyyy-MM-dd
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        avatarUrl: formData.avatarUrl,
      });

      alert("✅ Cập nhật thành công!");
      setIsEditing(false); // khóa lại form sau khi lưu
    } catch (error) {
      console.log(error);
      alert("❌ Lỗi khi lưu!");
    }
  };

  return (
    <div className={styles.accountPage}>
      {/* Profile */}
      <section className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <img
              src={formData.avatarUrl}
              alt="Ảnh đại diện"
              className={styles.avatar}
            />

            <div className={styles.profileDetails}>
              <h2>{formData.fullName}</h2>
              <p>{emails[0]?.email || "Chưa có email"}</p>

              <div className={styles.extraInfo}>
                <span>
                  🎯 Điểm tích lũy: <strong>1200</strong>
                </span>
                <span>
                  📅 Ngày tạo: <strong>01/01/2023</strong>
                </span>
              </div>
            </div>
          </div>
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </button>
          {isEditing && (
            <button className={styles.saveButton} onClick={handleSave}>
              Lưu thay đổi
            </button>
          )}
        </div>
      </section>

      {/* Personal info */}
      <section className={styles.formSection}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber" // đổi
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mã ID</label>
            <input type="text" name="userId" value={formData.userId} readOnly />
          </div>
        </div>
      </section>

      {/* Emails */}
      <section className={styles.emailSection}>
        <h3>Địa chỉ email của tôi</h3>

        {emails.map((email) => (
          <div key={email.id} className={styles.emailItem}>
            <div className={styles.emailItemContent}>
              <input type="checkbox" defaultChecked={email.verified} />
              <div className={styles.emailItemText}>
                <strong>{email.email}</strong>
                <small>{email.addedDate}</small>
              </div>
            </div>
          </div>
        ))}

        <button className={styles.addEmailButton}>+ Thêm địa chỉ email</button>
      </section>
    </div>
  );
}
