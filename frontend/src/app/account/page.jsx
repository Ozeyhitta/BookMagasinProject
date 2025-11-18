"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "../../utils/axiosClient";
import styles from "./account.module.css";

export default function AccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🆕 state cho ĐĂNG KÍ NHÂN VIÊN
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [position, setPosition] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffMessage, setStaffMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    axiosClient
      .get(`/users/${userId}`)
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
      .catch((error) => {
        console.error("Error fetching user data:", error);
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading || !formData) {
    return (
      <div className={styles.accountPage}>
        <p style={{ padding: 40, textAlign: "center" }}>
          Đang tải thông tin...
        </p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const id = formData.userId;

      await axiosClient.put(`/users/${id}`, {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        avatarUrl: formData.avatarUrl,
      });

      alert("✅ Cập nhật thành công!");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      alert("❌ Lỗi khi lưu!");
    }
  };

  // 🆕 gửi yêu cầu đăng kí nhân viên
  const handleStaffRegister = async (e) => {
    e.preventDefault();
    setStaffMessage("");
    setStaffLoading(true);

    try {
      const res = await axiosClient.post("/staff-requests", {
        userId: formData.userId,
        position,
        joinDate, // yyyy-MM-dd
      });

      if (res.status >= 200 && res.status < 300) {
        setStaffMessage("✅ Gửi yêu cầu đăng kí nhân viên thành công!");
      } else {
        setStaffMessage("❌ Gửi yêu cầu thất bại!");
      }
    } catch (err) {
      console.error(err);
      setStaffMessage("❌ Lỗi kết nối server!");
    } finally {
      setStaffLoading(false);
    }
  };

  return (
    <div className={styles.accountPage}>
      {/* Profile */}
      <section className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarContainer}>
                <img
                  src={formData.avatarUrl || "/default-avatar.png"}
                  className={styles.avatar}
                />

                {isEditing && (
                  <>
                    <label
                      htmlFor="avatarUpload"
                      className={styles.avatarOverlay}
                    >
                      <span className={styles.overlayText}>Đổi ảnh</span>
                    </label>
                    <input
                      id="avatarUpload"
                      type="file"
                      accept="image/*"
                      className={styles.avatarInput}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (upload) => {
                            setFormData((prev) => ({
                              ...prev,
                              avatarUrl: upload.target.result,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </>
                )}
              </div>
            </div>

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

          <div className={styles.buttonGroup}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
            >
              Chỉnh sửa
            </button>

            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!isEditing}
            >
              Lưu thay đổi
            </button>

            {/* 🆕 nút đăng kí nhân viên */}
            <button
              className={styles.saveButton}
              style={{ marginTop: 8, backgroundColor: "#f59e0b" }}
              onClick={() => {
                setShowStaffForm((prev) => !prev);
                setStaffMessage("");
              }}
            >
              Đăng kí nhân viên
            </button>
          </div>
        </div>

        {/* 🆕 form đăng kí nhân viên */}
        {showStaffForm && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fafafa",
              maxWidth: 600,
            }}
          >
            <h3 style={{ marginBottom: 12 }}>Đăng kí trở thành nhân viên</h3>

            <form onSubmit={handleStaffRegister}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Chức vụ</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nhân viên bán hàng, Quản lý kho..."
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Ngày thuê</label>
                  <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={staffLoading}
                >
                  {staffLoading ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>

                <button
                  type="button"
                  className={styles.editButton}
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setShowStaffForm(false);
                    setStaffMessage("");
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>

            {staffMessage && (
              <p
                style={{
                  marginTop: 10,
                  color: staffMessage.startsWith("✅") ? "green" : "red",
                }}
              >
                {staffMessage}
              </p>
            )}
          </div>
        )}
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
              name="phoneNumber"
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

        <button className={styles.addEmailButton}>
          + Thêm địa chỉ email
        </button>
      </section>
    </div>
  );
}
