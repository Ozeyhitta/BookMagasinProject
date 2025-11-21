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
  const [hasStaffRole, setHasStaffRole] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    // Lấy role từ localStorage trước
    const roleFromStorage = localStorage.getItem("role");
    const isStaff =
      roleFromStorage === "STAFF" ||
      (roleFromStorage && roleFromStorage.includes("STAFF"));
    setHasStaffRole(isStaff);

    // Lấy thông tin user
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

        // Kiểm tra trạng thái staff từ API (kiểm tra cả record trong bảng staff và role)
        if (data.id) {
          axiosClient
            .get(`/staff-requests/status/${data.id}`)
            .then((statusRes) => {
              const statusData = statusRes.data;
              // Chỉ hiển thị "Truy cập trang staff" nếu có record APPROVED VÀ có role STAFF
              const isApprovedStaff = statusData.isApproved === true;
              setHasStaffRole(isApprovedStaff);

              // Cập nhật localStorage
              if (isApprovedStaff) {
                localStorage.setItem("role", "STAFF");
              } else {
                // Xóa role STAFF khỏi localStorage nếu không còn là staff
                if (roleFromStorage === "STAFF") {
                  localStorage.setItem("role", "CUSTOMER");
                }
              }
            })
            .catch((err) => {
              console.error("Error fetching staff status:", err);
              // Fallback: kiểm tra role từ account nếu API không hoạt động
              if (data.email) {
                axiosClient
                  .get(`/accounts/email/${data.email}`)
                  .then((accountRes) => {
                    const accountData = accountRes.data;
                    const roles = accountData.roles || [];
                    const roleString = accountData.role || "";
                    const hasStaff =
                      Array.isArray(roles) && roles.length > 0
                        ? roles.some(
                            (r) =>
                              r === "STAFF" ||
                              (typeof r === "string" && r.includes("STAFF"))
                          )
                        : roleString === "STAFF" ||
                          (typeof roleString === "string" &&
                            roleString.includes("STAFF"));
                    setHasStaffRole(hasStaff);
                  })
                  .catch(() => {
                    // Nếu không lấy được, dùng role từ localStorage
                  });
              }
            });
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
        const message = res.data || "✅ Đăng ký làm nhân viên thành công!";
        setStaffMessage(message);
        // Reset form sau khi thành công
        setPosition("");
        setJoinDate("");
        // Đóng modal sau 2 giây nếu thành công
        setTimeout(() => {
          setShowStaffForm(false);
          setStaffMessage("");
        }, 2000);
      } else {
        setStaffMessage("❌ Đăng ký thất bại!");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data || "❌ Lỗi kết nối server!";

      // Kiểm tra nếu message là "Bạn đã là nhân viên rồi!" thì tự động set hasStaffRole = true
      if (errorMessage && errorMessage.includes("Bạn đã là nhân viên rồi")) {
        setHasStaffRole(true);
        localStorage.setItem("role", "STAFF");
        setShowStaffForm(false);
        setStaffMessage("");
        setPosition("");
        setJoinDate("");
      } else {
        setStaffMessage(errorMessage);
      }
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
              type="button"
            >
              Chỉnh sửa
            </button>

            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!isEditing}
              type="button"
            >
              Lưu thay đổi
            </button>

            {/* 🆕 nút đăng kí nhân viên hoặc truy cập trang staff */}
            {hasStaffRole ? (
              <button
                className={styles.saveButton}
                style={{ marginTop: 8, backgroundColor: "#10b981" }}
                onClick={() => {
                  router.push("/staff");
                }}
              >
                Truy cập trang staff
              </button>
            ) : (
              <button
                className={`${styles.saveButton} ${styles.staffButton}`}
                onClick={() => {
                  setShowStaffForm(true);
                  setStaffMessage("");
                  setPosition("");
                  setJoinDate("");
                }}
                type="button"
              >
                Đăng kí nhân viên
              </button>
            )}
          </div>
        </div>

        {/* 🆕 Modal đăng kí nhân viên */}
        {showStaffForm && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowStaffForm(false);
              setStaffMessage("");
            }}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Đăng ký trở thành nhân viên</h2>
                <button
                  className={styles.modalCloseButton}
                  onClick={() => {
                    setShowStaffForm(false);
                    setStaffMessage("");
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleStaffRegister} className={styles.modalForm}>
                <div className={styles.modalFormGrid}>
                  <div className={styles.formGroup}>
                    <label>Chức vụ *</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nhân viên bán hàng, Quản lý kho..."
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ngày bắt đầu làm việc mong muốn *</label>
                    <input
                      type="date"
                      value={joinDate}
                      onChange={(e) => setJoinDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {staffMessage && (
                  <div
                    className={`${styles.modalMessage} ${
                      staffMessage.startsWith("✅")
                        ? styles.modalMessageSuccess
                        : styles.modalMessageError
                    }`}
                  >
                    {staffMessage}
                  </div>
                )}

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.modalCancelButton}
                    onClick={() => {
                      setShowStaffForm(false);
                      setStaffMessage("");
                    }}
                    disabled={staffLoading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={styles.modalSubmitButton}
                    disabled={staffLoading}
                  >
                    {staffLoading ? "Đang gửi..." : "Gửi yêu cầu"}
                  </button>
                </div>
              </form>
            </div>
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

        <button className={styles.addEmailButton}>+ Thêm địa chỉ email</button>
      </section>
    </div>
  );
}
