"use client"

import { useState } from "react"
import styles from "./account.module.css"

export default function AccountPage() {
  const [formData, setFormData] = useState({
    fullName: "Alexa Rawles",
    birthDate: "1/1/2004",
    gender: "Nữ",
    phone: "0999999999",
    address: "1/Võ Văn Ngân/Thủ Đức/TP Hồ Chí Minh",
    userId: "12345",
  })

  const [emails, setEmails] = useState([
    {
      id: 1,
      email: "alexarawles@gmail.com",
      verified: true,
      addedDate: "1 tháng trước",
    },
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className={styles.accountPage}>
      {/* Phần hồ sơ */}
      <section className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <img
              src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482752rhD/anh-mo-ta.png"
              alt="Ảnh đại diện"
              className={styles.avatar}
            />
            <div className={styles.profileDetails}>
              <h2>{formData.fullName}</h2>
              <p>{emails[0].email}</p>
              <div className={styles.extraInfo}>
                <span>🎯 Điểm tích lũy: <strong>1200</strong></span>
                <span>📅 Ngày tạo: <strong>01/01/2023</strong></span>
              </div>
            </div>
          </div>
          <button className={styles.editButton}>Chỉnh sửa</button>
        </div>
      </section>

      {/* Phần thông tin cá nhân */}
      <section className={styles.formSection}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="birthDate">Ngày sinh</label>
            <input
              id="birthDate"
              type="text"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              placeholder="Nhập ngày sinh"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender">Giới tính</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
              <option>Chọn giới tính</option>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Địa chỉ</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userId">Mã ID</label>
            <input
              type="text"
              id="userId"
              name="userId"
              placeholder="Nhập mã ID"
              value={formData.userId}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </section>

      {/* Phần email */}
      <section className={styles.emailSection}>
        <h3>Địa chỉ email của tôi</h3>
        {emails.map((email) => (
          <div key={email.id} className={styles.emailItem}>
            <div className={styles.emailItemContent}>
              <input type="checkbox" className={styles.emailCheckbox} defaultChecked={email.verified} />
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
  )
}
