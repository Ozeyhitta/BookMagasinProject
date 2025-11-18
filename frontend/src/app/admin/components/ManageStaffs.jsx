"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  Lock,
  Unlock,
  Trash2,
  Search,
  X,
  ClipboardList,
} from "lucide-react";
import styles from "./manage-staffs.module.css";

export default function ManageStaffs() {
  const [staffs, setStaffs] = useState([]);

  const emptyStaff = {
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    avatarUrl: "",
    position: "",
    joinDate: "",
    status: "active",
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newStaff, setNewStaff] = useState(emptyStaff);
  const [searchTerm, setSearchTerm] = useState("");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Modal thông báo và xác nhận
  const [notification, setNotification] = useState({
    show: false,
    type: "success", // success, error
    message: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [viewModal, setViewModal] = useState({
    show: false,
    staff: null,
  });

  useEffect(() => {
    loadStaffs();
  }, []);

  // ======================
  // LẤY DANH SÁCH STAFF ĐÃ ĐƯỢC DUYỆT (APPROVED)
  // ======================
  const loadStaffs = () => {
    fetch("http://localhost:8080/api/admin/staff-requests?status=APPROVED")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((s) => {
          const u = s.user || {};
          // Format ngày: có thể là string hoặc object Date
          let joinDateStr = "";
          if (s.joinDate) {
            if (typeof s.joinDate === "string") {
              joinDateStr = s.joinDate.split("T")[0];
            } else if (s.joinDate instanceof Date) {
              joinDateStr = s.joinDate.toISOString().split("T")[0];
            } else if (Array.isArray(s.joinDate)) {
              joinDateStr = `${s.joinDate[0]}-${String(s.joinDate[1]).padStart(
                2,
                "0"
              )}-${String(s.joinDate[2]).padStart(2, "0")}`;
            }
          }
          return {
            id: s.id,
            email: u.email || "",
            status: s.activated !== false ? "active" : "locked", // Dựa vào activated từ Account
            fullName: u.fullName || "",
            phoneNumber: u.phoneNumber || "",
            position: s.position || "",
            joinDate: joinDateStr,
            staffId: s.id, // ID của record trong bảng staff
            activated: s.activated !== false, // Lưu trạng thái activated
          };
        });

        setStaffs(mapped);
      })
      .catch((err) => console.error("Error loading staffs:", err));
  };

  // ======================
  // LẤY YÊU CẦU ĐĂNG KÍ STAFF
  // ======================
  const loadRequests = () => {
    setLoadingRequests(true);
    fetch("http://localhost:8080/api/admin/staff-requests?status=PENDING")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((req) => {
          const u = req.user || {};
          // Format ngày: có thể là string hoặc object Date
          let joinDateStr = "";
          if (req.joinDate) {
            if (typeof req.joinDate === "string") {
              joinDateStr = req.joinDate.split("T")[0];
            } else if (req.joinDate instanceof Date) {
              joinDateStr = req.joinDate.toISOString().split("T")[0];
            } else if (Array.isArray(req.joinDate)) {
              // Nếu là array [year, month, day] từ Jackson
              joinDateStr = `${req.joinDate[0]}-${String(
                req.joinDate[1]
              ).padStart(2, "0")}-${String(req.joinDate[2]).padStart(2, "0")}`;
            }
          }
          // Format requestDate
          let requestDateStr = "";
          if (req.requestDate) {
            if (typeof req.requestDate === "string") {
              requestDateStr = req.requestDate.split("T")[0];
            } else if (req.requestDate instanceof Date) {
              requestDateStr = req.requestDate.toISOString().split("T")[0];
            }
          }
          return {
            id: req.id,
            status: req.status || "PENDING",
            position: req.position || "",
            joinDate: joinDateStr,
            requestDate: requestDateStr,
            fullName: u.fullName || "",
            email: u.email || "",
            phoneNumber: u.phoneNumber || "",
          };
        });
        setRequests(mapped);
      })
      .catch((err) => console.error("Error loading staff requests:", err))
      .finally(() => setLoadingRequests(false));
  };

  const openRequestModal = () => {
    setShowRequestModal(true);
    loadRequests();
  };

  const handleApproveRequest = (id) => {
    setConfirmModal({
      show: true,
      title: "Xác nhận duyệt yêu cầu",
      message: "Bạn có chắc chắn muốn duyệt yêu cầu đăng ký nhân viên này?",
      onConfirm: () => {
        fetch(`http://localhost:8080/api/admin/staff-requests/${id}/approve`, {
          method: "PUT",
        })
          .then(() => {
            setRequests((prev) => prev.filter((r) => r.id !== id));
            loadStaffs();
            setNotification({
              show: true,
              type: "success",
              message: "Đã duyệt yêu cầu thành công!",
            });
            // Tự động đóng sau 2 giây
            setTimeout(() => {
              setNotification({ show: false, type: "success", message: "" });
            }, 2000);
          })
          .catch(() => {
            setNotification({
              show: true,
              type: "error",
              message: "Lỗi khi duyệt yêu cầu!",
            });
          });
        setConfirmModal({
          show: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const handleRejectRequest = (id) => {
    setConfirmModal({
      show: true,
      title: "Xác nhận từ chối yêu cầu",
      message: "Bạn có chắc chắn muốn từ chối yêu cầu đăng ký nhân viên này?",
      onConfirm: () => {
        fetch(`http://localhost:8080/api/admin/staff-requests/${id}/reject`, {
          method: "PUT",
        })
          .then(() => {
            setRequests((prev) => prev.filter((r) => r.id !== id));
            setNotification({
              show: true,
              type: "success",
              message: "Đã từ chối yêu cầu thành công!",
            });
            // Tự động đóng sau 2 giây
            setTimeout(() => {
              setNotification({ show: false, type: "success", message: "" });
            }, 2000);
          })
          .catch(() => {
            setNotification({
              show: true,
              type: "error",
              message: "Lỗi khi từ chối yêu cầu!",
            });
          });
        setConfirmModal({
          show: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  // ======================
  // FORM THÊM / SỬA STAFF
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dto = {
      fullName: newStaff.fullName,
      email: newStaff.email,
      phoneNumber: newStaff.phoneNumber,
      dateOfBirth: newStaff.dateOfBirth,
      address: newStaff.address,
      avatarUrl: newStaff.avatarUrl,
      // position và joinDate hiện backend StaffController cũ không nhận,
      // nếu bạn muốn gửi thêm thì thêm field vào StaffRequestDTO phía backend
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/api/admin/staffs/${editingId}`
      : "http://localhost:8080/api/admin/staffs";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    })
      .then(() => {
        loadStaffs();
        setShowEditModal(false);
        setNotification({
          show: true,
          type: "success",
          message: editingId
            ? "Cập nhật nhân viên thành công!"
            : "Thêm nhân viên thành công!",
        });
        // Tự động đóng sau 2 giây
        setTimeout(() => {
          setNotification({ show: false, type: "success", message: "" });
        }, 2000);
      })
      .catch(() => {
        setNotification({
          show: true,
          type: "error",
          message: "Lỗi khi lưu nhân viên!",
        });
      });
  };

  const handleEdit = (id) => {
    const s = staffs.find((x) => x.id === id);
    if (!s) return;

    // hiện tại StaffListDTO không có dateOfBirth/address/avatarUrl
    // nên tạm thời khi sửa sẽ không điền sẵn được 3 field này
    setNewStaff({
      ...emptyStaff,
      fullName: s.fullName,
      email: s.email,
      phoneNumber: s.phoneNumber,
      position: s.position,
      joinDate: s.joinDate,
    });

    setEditingId(id);
    setShowEditModal(true);
  };

  const handleView = (id) => {
    const s = staffs.find((x) => x.id === id);
    if (!s) return;
    setViewModal({
      show: true,
      staff: s,
    });
  };

  const handleDelete = (id) => {
    const staff = staffs.find((s) => (s.staffId || s.id) === id);
    setConfirmModal({
      show: true,
      title: "Xác nhận xóa nhân viên",
      message: `Bạn có chắc chắn muốn xóa nhân viên "${
        staff?.fullName || ""
      }"? (Sẽ xóa quyền staff và record trong bảng staff)`,
      onConfirm: () => {
        fetch(`http://localhost:8080/api/admin/staff-requests/${id}`, {
          method: "DELETE",
        })
          .then(() => {
            loadStaffs();
            setNotification({
              show: true,
              type: "success",
              message: "Đã xóa nhân viên thành công!",
            });
            // Tự động đóng sau 2 giây
            setTimeout(() => {
              setNotification({ show: false, type: "success", message: "" });
            }, 2000);
          })
          .catch(() => {
            setNotification({
              show: true,
              type: "error",
              message: "Lỗi khi xóa nhân viên!",
            });
          });
        setConfirmModal({
          show: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  // Khóa / mở khóa -> dùng API toggle (giống ManageCustomers)
  const handleToggleLock = async (id) => {
    try {
      const staff = staffs.find((s) => s.id === id);
      if (!staff) {
        throw new Error("Không tìm thấy nhân viên");
      }

      const staffId = staff.staffId || id;
      console.log("Toggle lock for staffId:", staffId, "staff:", staff);

      const res = await fetch(
        `http://localhost:8080/api/admin/staff-requests/${staffId}/toggle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Đọc response body (chỉ được đọc một lần)
      const contentType = res.headers.get("content-type");
      const textResponse = await res.text();

      console.log("Response status:", res.status);
      console.log("Response content-type:", contentType);
      console.log("Response body:", textResponse);

      if (!res.ok) {
        // Nếu response là error, throw với error message
        throw new Error(
          textResponse || "Toggle thất bại, status " + res.status
        );
      }

      // Parse JSON response
      let updated;
      try {
        updated = JSON.parse(textResponse);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        throw new Error("Response không phải JSON hợp lệ: " + textResponse);
      }

      console.log("Parsed response:", updated);

      // Kiểm tra xem response có chứa activated không
      if (updated && typeof updated.activated === "boolean") {
        // Cập nhật state trực tiếp (giống ManageCustomers)
        setStaffs((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: updated.activated ? "active" : "locked",
                  activated: updated.activated,
                }
              : s
          )
        );
      } else {
        console.error("Response không chứa activated:", updated);
        throw new Error("Response không chứa trạng thái activated");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      const errorMessage =
        err.message || "Không thể thay đổi trạng thái nhân viên.";
      setNotification({
        show: true,
        type: "error",
        message: errorMessage,
      });
    }
  };

  const filtered = staffs.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2>Quản lý nhân viên</h2>
        <button className={styles.addButton} onClick={openRequestModal}>
          <ClipboardList size={18} />
          <span>Xem yêu cầu</span>
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* MODAL YÊU CẦU ĐĂNG KÍ NHÂN VIÊN */}
      {showRequestModal && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modal}
            style={{
              width: "80%",
              maxWidth: "1100px",
              maxHeight: "80vh",
              overflow: "hidden",
            }}
          >
            <div className={styles.modalHeader}>
              <h3>Yêu cầu đăng kí nhân viên</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowRequestModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div
              className={styles.tableWrapper}
              style={{ maxHeight: "60vh", overflowX: "auto" }}
            >
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Chức vụ</th>
                    <th>Ngày yêu cầu</th>
                    <th>Ngày thuê (mong muốn)</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingRequests ? (
                    <tr>
                      <td colSpan={8}>Đang tải...</td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={8}>Không có yêu cầu nào</td>
                    </tr>
                  ) : (
                    requests.map((r) => (
                      <tr key={r.id}>
                        <td>{r.fullName}</td>
                        <td>{r.email}</td>
                        <td>{r.phoneNumber}</td>
                        <td>{r.position}</td>
                        <td>{r.requestDate || "-"}</td>
                        <td>{r.joinDate || "-"}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              r.status === "PENDING"
                                ? styles.pending
                                : r.status === "APPROVED"
                                ? styles.active
                                : styles.locked
                            }`}
                          >
                            {r.status === "PENDING"
                              ? "Chờ duyệt"
                              : r.status === "APPROVED"
                              ? "Đã duyệt"
                              : "Từ chối"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => handleApproveRequest(r.id)}
                              className={`${styles.btn} ${styles.btnEdit}`}
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleRejectRequest(r.id)}
                              className={`${styles.btn} ${styles.btnDelete}`}
                            >
                              Từ chối
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA NHÂN VIÊN */}
      {showEditModal && (
        <div
          className={styles.formModalOverlay}
          onClick={() => {
            setShowEditModal(false);
            setEditingId(null);
          }}
        >
          <div
            className={styles.formModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.formModalHeader}>
              <h3>
                {editingId ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
              </h3>
              <button
                type="button"
                className={styles.formCloseBtn}
                onClick={() => {
                  setShowEditModal(false);
                  setEditingId(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form className={styles.formModalBody} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="Tên nhân viên"
                  name="fullName"
                  value={newStaff.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={newStaff.email}
                  onChange={handleChange}
                  required
                  disabled={!!editingId}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  name="phoneNumber"
                  value={newStaff.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  placeholder="Ngày sinh"
                  name="dateOfBirth"
                  value={newStaff.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  name="address"
                  value={newStaff.address}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Avatar URL"
                  name="avatarUrl"
                  value={newStaff.avatarUrl}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="Chức vụ"
                  name="position"
                  value={newStaff.position}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  placeholder="Ngày tham gia"
                  name="joinDate"
                  value={newStaff.joinDate}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formModalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingId(null);
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingId ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BẢNG NHÂN VIÊN */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên nhân viên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Chức vụ</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có nhân viên nào
                </td>
              </tr>
            ) : (
              filtered.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.fullName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phoneNumber}</td>
                  <td>{staff.position}</td>
                  <td>{staff.joinDate}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[staff.status]}`}>
                      {staff.status === "active" ? "Hoạt động" : "Khoá"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.btn} ${styles.btnView}`}
                        onClick={() => handleView(staff.id)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => handleEdit(staff.id)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={`${styles.btn} ${
                          staff.status === "active"
                            ? styles.btnLock
                            : styles.btnUnlock
                        }`}
                        onClick={() => handleToggleLock(staff.id)}
                        title={
                          staff.status === "active"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                        }
                      >
                        {staff.status === "active" ? (
                          <Lock size={16} />
                        ) : (
                          <Unlock size={16} />
                        )}
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => handleDelete(staff.staffId || staff.id)}
                        title="Xóa nhân viên"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÔNG BÁO */}
      {notification.show && (
        <div className={styles.modalOverlay}>
          <div
            className={`${styles.modal} ${
              notification.type === "success" ? styles.success : styles.error
            }`}
          >
            <div className={styles.modalHeader}>
              <h3>
                {notification.type === "success" ? "✅ Thành công" : "❌ Lỗi"}
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() =>
                  setNotification({ show: false, type: "success", message: "" })
                }
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ margin: "10px 0", fontSize: "15px", color: "#444" }}>
              {notification.message}
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.saveButton}
                onClick={() =>
                  setNotification({ show: false, type: "success", message: "" })
                }
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN */}
      {confirmModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{confirmModal.title}</h3>
              <button
                className={styles.closeBtn}
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    title: "",
                    message: "",
                    onConfirm: null,
                  })
                }
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ margin: "10px 0", fontSize: "15px", color: "#444" }}>
              {confirmModal.message}
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    title: "",
                    message: "",
                    onConfirm: null,
                  })
                }
              >
                Hủy
              </button>
              <button
                className={styles.saveButton}
                onClick={() => {
                  if (confirmModal.onConfirm) {
                    confirmModal.onConfirm();
                  }
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT NHÂN VIÊN */}
      {viewModal.show && viewModal.staff && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Thông tin nhân viên</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setViewModal({ show: false, staff: null })}
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <p>
                <strong>ID:</strong> {viewModal.staff.id}
              </p>
              <p>
                <strong>Họ tên:</strong> {viewModal.staff.fullName}
              </p>
              <p>
                <strong>Email:</strong> {viewModal.staff.email}
              </p>
              <p>
                <strong>SĐT:</strong> {viewModal.staff.phoneNumber || "Chưa có"}
              </p>
              <p>
                <strong>Chức vụ:</strong>{" "}
                {viewModal.staff.position || "Chưa có"}
              </p>
              <p>
                <strong>Ngày tham gia:</strong>{" "}
                {viewModal.staff.joinDate || "Chưa có"}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`${styles.badge} ${
                    styles[viewModal.staff.status]
                  }`}
                >
                  {viewModal.staff.status === "active" ? "Hoạt động" : "Khoá"}
                </span>
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.saveButton}
                onClick={() => setViewModal({ show: false, staff: null })}
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
