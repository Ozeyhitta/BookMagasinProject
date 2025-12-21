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
  const [isAccountActivated, setIsAccountActivated] = useState(true); // Trạng thái kích hoạt tài khoản

  // State cho modal thông báo
  const [notificationModal, setNotificationModal] = useState({
    show: false,
    message: "",
    type: "success", // success hoặc error
  });

  // State cho avatar URL input
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [avatarUrlError, setAvatarUrlError] = useState("");
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);

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

          // 🆕 Lấy thông tin account để kiểm tra trạng thái activated
          axiosClient
            .get(`/accounts/email/${data.email}`)
            .then((accountRes) => {
              const accountData = accountRes.data;
              const activated = accountData.activated !== false; // Mặc định true nếu không có
              setIsAccountActivated(activated);
            })
            .catch((err) => {
              console.error("Error fetching account status:", err);
              // Mặc định là activated nếu không lấy được
              setIsAccountActivated(true);
            });
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

  // Validate URL format
  const validateAvatarUrl = (url) => {
    if (!url || url.trim() === "") {
      setAvatarUrlError("");
      return false;
    }

    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) {
      setAvatarUrlError("URL phải bắt đầu bằng http:// hoặc https://");
      return false;
    }

    setAvatarUrlError("");
    return true;
  };

  // Handle avatar URL input change
  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatarUrlInput(url);
    
    if (url.trim() === "") {
      setAvatarUrlError("");
      return;
    }

    // Validate URL format
    const isValid = validateAvatarUrl(url);
    
    if (isValid) {
      // Update preview immediately
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      setIsValidatingUrl(true);
      
      // Test if image loads successfully
      const img = new Image();
      img.onload = () => {
        setIsValidatingUrl(false);
        setAvatarUrlError("");
      };
      img.onerror = () => {
        setIsValidatingUrl(false);
        setAvatarUrlError("Không thể tải hình ảnh từ URL này");
      };
      img.src = url;
    }
  };

  // Handle avatar URL submit
  const handleAvatarUrlSubmit = async () => {
    if (!avatarUrlInput.trim()) {
      setAvatarUrlError("Vui lòng nhập URL hình ảnh");
      return;
    }

    if (!validateAvatarUrl(avatarUrlInput)) {
      return;
    }

    setIsValidatingUrl(true);
    try {
      const id = formData.userId;
      await axiosClient.put(`/users/${id}`, {
        ...formData,
        avatarUrl: avatarUrlInput,
      });

      // Update formData with new avatar URL
      setFormData((prev) => ({ ...prev, avatarUrl: avatarUrlInput }));
      setAvatarUrlInput("");
      setAvatarUrlError("");
      setIsValidatingUrl(false);

      setNotificationModal({
        show: true,
        message: "✅ Cập nhật avatar thành công!",
        type: "success",
      });
      setTimeout(() => {
        setNotificationModal({ show: false, message: "", type: "success" });
      }, 2000);
    } catch (error) {
      console.error("Error updating avatar:", error);
      setIsValidatingUrl(false);
      setNotificationModal({
        show: true,
        message: "❌ Lỗi khi cập nhật avatar!",
        type: "error",
      });
      setTimeout(() => {
        setNotificationModal({ show: false, message: "", type: "success" });
      }, 3000);
    }
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

      setIsEditing(false);
      // Reset avatar URL input after successful save
      setAvatarUrlInput("");
      setAvatarUrlError("");
      setIsValidatingUrl(false);
      setNotificationModal({
        show: true,
        message: "✅ Cập nhật thành công!",
        type: "success",
      });
      // Tự động đóng modal sau 2 giây
      setTimeout(() => {
        setNotificationModal({ show: false, message: "", type: "success" });
      }, 2000);
    } catch (error) {
      console.log(error);
      setNotificationModal({
        show: true,
        message: "❌ Lỗi khi lưu!",
        type: "error",
      });
      // Tự động đóng modal sau 3 giây nếu lỗi
      setTimeout(() => {
        setNotificationModal({ show: false, message: "", type: "success" });
      }, 3000);
    }
  };

  // 🆕 gửi yêu cầu đăng kí nhân viên
  const handleStaffRegister = async (e) => {
    e.preventDefault();

    // Kiểm tra trạng thái tài khoản trước khi gửi
    if (!isAccountActivated) {
      setStaffMessage(
        "⚠️ Tài khoản của bạn đã bị khóa. Không thể đăng ký làm nhân viên."
      );
      return;
    }

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
              onClick={() => {
                setIsEditing(true);
                // Initialize avatar URL input with current avatar URL
                setAvatarUrlInput(formData.avatarUrl || "");
                setAvatarUrlError("");
              }}
              disabled={isEditing}
              type="button"
            >
              Chỉnh sửa
            </button>

            {/* 🆕 nút đăng kí nhân viên hoặc truy cập trang staff */}
            {hasStaffRole ? (
              <button
                className={styles.saveButton}
                style={{
                  marginTop: 8,
                  backgroundColor: isAccountActivated ? "#10b981" : "#9ca3af",
                  cursor: isAccountActivated ? "pointer" : "not-allowed",
                  opacity: isAccountActivated ? 1 : 0.6,
                }}
                onClick={() => {
                  if (isAccountActivated) {
                    router.push("/staff");
                  } else {
                    alert(
                      "⚠️ Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ."
                    );
                  }
                }}
                disabled={!isAccountActivated}
                title={
                  !isAccountActivated ? "Tài khoản của bạn đã bị khóa" : ""
                }
              >
                Truy cập trang staff
              </button>
            ) : (
              <button
                className={`${styles.saveButton} ${styles.staffButton}`}
                style={{
                  backgroundColor: isAccountActivated ? undefined : "#9ca3af",
                  cursor: isAccountActivated ? "pointer" : "not-allowed",
                  opacity: isAccountActivated ? 1 : 0.6,
                }}
                onClick={() => {
                  if (isAccountActivated) {
                    setShowStaffForm(true);
                    setStaffMessage("");
                    setPosition("");
                    setJoinDate("");
                  } else {
                    alert(
                      "⚠️ Tài khoản của bạn đã bị khóa. Không thể đăng ký làm nhân viên. Vui lòng liên hệ quản trị viên để được hỗ trợ."
                    );
                  }
                }}
                disabled={!isAccountActivated}
                type="button"
                title={
                  !isAccountActivated ? "Tài khoản của bạn đã bị khóa" : ""
                }
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

      {/* Personal info - Hiển thị khi không chỉnh sửa */}
      {!isEditing && (
        <section className={styles.formSection}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                readOnly
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                readOnly
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label>Giới tính</label>
              <select name="gender" value={formData.gender} disabled>
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
                readOnly
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                readOnly
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label>Mã ID</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                readOnly
              />
            </div>
          </div>
        </section>
      )}

      {/* Modal chỉnh sửa thông tin */}
      {isEditing && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setIsEditing(false);
          }}
        >
          <div
            className={`${styles.modalContent} ${styles.editFormModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>✏️ Chỉnh sửa thông tin cá nhân</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                ×
              </button>
            </div>

            <div className={styles.modalForm}>
              {/* Avatar URL Input Section */}
              <div className={styles.avatarUrlSection}>
                <label className={styles.avatarUrlLabel}>
                  Hoặc nhập URL hình ảnh
                </label>
                <div className={styles.avatarUrlInputWrapper}>
                  <input
                    type="text"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrlInput}
                    onChange={handleAvatarUrlChange}
                    className={`${styles.avatarUrlInput} ${
                      avatarUrlError ? styles.avatarUrlInputError : ""
                    } ${isValidatingUrl ? styles.avatarUrlInputValidating : ""}`}
                    disabled={isValidatingUrl}
                  />
                  <button
                    type="button"
                    className={styles.avatarUrlSubmitButton}
                    onClick={handleAvatarUrlSubmit}
                    disabled={
                      !avatarUrlInput.trim() ||
                      !!avatarUrlError ||
                      isValidatingUrl
                    }
                  >
                    {isValidatingUrl ? "Đang kiểm tra..." : "Cập nhật"}
                  </button>
                </div>
                {avatarUrlError && (
                  <div className={styles.avatarUrlError}>{avatarUrlError}</div>
                )}
                {!avatarUrlError && avatarUrlInput && !isValidatingUrl && (
                  <div className={styles.avatarUrlSuccess}>
                    ✓ URL hợp lệ - Hình ảnh sẽ được cập nhật khi bạn lưu
                  </div>
                )}
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
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
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Mã ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.modalCancelButton}
                  onClick={() => {
                    setIsEditing(false);
                    // Reset avatar URL input
                    setAvatarUrlInput("");
                    setAvatarUrlError("");
                    setIsValidatingUrl(false);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={styles.modalSubmitButton}
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Modal thông báo sau khi lưu */}
      {notificationModal.show && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setNotificationModal({ show: false, message: "", type: "success" });
          }}
        >
          <div
            className={`${styles.modalContent} ${styles.notificationModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${styles.notificationIcon} ${
                notificationModal.type === "success"
                  ? styles.notificationIconSuccess
                  : styles.notificationIconError
              }`}
            >
              {notificationModal.type === "success" ? (
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="currentColor"
                    opacity="0.1"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="currentColor"
                    opacity="0.1"
                  />
                  <path
                    d="M15 9l-6 6M9 9l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className={styles.notificationContent}>
              <h3
                className={`${styles.notificationTitle} ${
                  notificationModal.type === "success"
                    ? styles.notificationTitleSuccess
                    : styles.notificationTitleError
                }`}
              >
                {notificationModal.type === "success"
                  ? "Thành công"
                  : "Có lỗi xảy ra"}
              </h3>
              <p className={styles.notificationMessage}>
                {notificationModal.message.replace(/✅|❌/g, "").trim()}
              </p>
            </div>
            <div className={styles.notificationFooter}>
              <button
                className={`${styles.notificationButton} ${
                  notificationModal.type === "success"
                    ? styles.notificationButtonSuccess
                    : styles.notificationButtonError
                }`}
                onClick={() => {
                  setNotificationModal({
                    show: false,
                    message: "",
                    type: "success",
                  });
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
