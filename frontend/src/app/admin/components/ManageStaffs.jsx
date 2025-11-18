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

  useEffect(() => {
    loadStaffs();
  }, []);

  // ======================
  // LẤY DANH SÁCH STAFF
  // ======================
 const loadStaffs = () => {
  fetch("http://localhost:8080/api/admin/staffs")
    .then((res) => res.json())
    .then((data) => {
      const mapped = data.map((s) => ({
        id: s.id,
        email: s.email,
        status: s.activated ? "active" : "locked",
        fullName: s.fullName || "",
        phoneNumber: s.phoneNumber || "",
        position: s.position || "",
        joinDate: s.joinDate || "",
      }));

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
          return {
            id: req.id,
            status: req.status,
            position: req.position || "",
            joinDate: req.joinDate ? req.joinDate.split("T")[0] : "",
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
    if (!confirm("Duyệt yêu cầu này?")) return;
    fetch(`http://localhost:8080/api/admin/staff-requests/${id}/approve`, {
      method: "PUT",
    })
      .then(() => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        loadStaffs();
        alert("Đã duyệt yêu cầu!");
      })
      .catch(() => alert("Lỗi khi duyệt yêu cầu!"));
  };

  const handleRejectRequest = (id) => {
    if (!confirm("Từ chối yêu cầu này?")) return;
    fetch(`http://localhost:8080/api/admin/staff-requests/${id}/reject`, {
      method: "PUT",
    })
      .then(() => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        alert("Đã từ chối yêu cầu!");
      })
      .catch(() => alert("Lỗi khi từ chối yêu cầu!"));
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
      })
      .catch(() => alert("Lỗi khi lưu nhân viên!"));
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
    alert(`👤 Tên: ${s.fullName}\nEmail: ${s.email}`);
  };

  const handleDelete = (id) => {
    if (!confirm("Xoá nhân viên này?")) return;
    fetch(`http://localhost:8080/api/admin/staffs/${id}`, {
      method: "DELETE",
    }).then(loadStaffs);
  };

  const handleToggleLock = (id) => {
    fetch(`http://localhost:8080/api/admin/staffs/${id}/toggle`, {
      method: "PUT",
    }).then(loadStaffs);
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
      <div className={styles.headerRow}>
        <button className={styles.addButton} onClick={openRequestModal}>
          <ClipboardList size={16} /> Xem yêu cầu
        </button>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            placeholder="Tìm tên, email, chức vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
                    <th>Ngày thuê</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingRequests ? (
                    <tr>
                      <td colSpan={7}>Đang tải...</td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={7}>Không có yêu cầu nào</td>
                    </tr>
                  ) : (
                    requests.map((r) => (
                      <tr key={r.id}>
                        <td>{r.fullName}</td>
                        <td>{r.email}</td>
                        <td>{r.phoneNumber}</td>
                        <td>{r.position}</td>
                        <td>{r.joinDate}</td>
                        <td>{r.status}</td>
                        <td className={styles.actions}>
                          <button
                            onClick={() => handleApproveRequest(r.id)}
                            className={styles.btnEdit}
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleRejectRequest(r.id)}
                            className={styles.btnDelete}
                          >
                            Từ chối
                          </button>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>
                {editingId ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <label>Họ tên:</label>
              <input
                name="fullName"
                value={newStaff.fullName}
                onChange={handleChange}
                required
              />

              <label>Email:</label>
              <input
                name="email"
                type="email"
                value={newStaff.email}
                onChange={handleChange}
                required
              />

              <label>Số điện thoại:</label>
              <input
                name="phoneNumber"
                value={newStaff.phoneNumber}
                onChange={handleChange}
              />

              <label>Ngày sinh:</label>
              <input
                name="dateOfBirth"
                type="date"
                value={newStaff.dateOfBirth}
                onChange={handleChange}
              />

              <label>Địa chỉ:</label>
              <input
                name="address"
                value={newStaff.address}
                onChange={handleChange}
              />

              <label>Avatar URL:</label>
              <input
                name="avatarUrl"
                value={newStaff.avatarUrl}
                onChange={handleChange}
              />

              <label>Chức vụ:</label>
              <input
                name="position"
                value={newStaff.position}
                onChange={handleChange}
              />

              <label>Ngày tham gia:</label>
              <input
                name="joinDate"
                type="date"
                value={newStaff.joinDate}
                onChange={handleChange}
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingId ? "Lưu thay đổi" : "Thêm mới"}
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
            {filtered.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.fullName}</td>
                <td>{staff.email}</td>
                <td>{staff.phoneNumber}</td>
                <td>{staff.position}</td>
                <td>{staff.joinDate}</td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[staff.status]}`}
                  >
                    {staff.status === "active" ? "Hoạt động" : "Khoá"}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button onClick={() => handleView(staff.id)}>
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleEdit(staff.id)}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleToggleLock(staff.id)}>
                    {staff.status === "active" ? (
                      <Lock size={16} />
                    ) : (
                      <Unlock size={16} />
                    )}
                  </button>
                  <button onClick={() => handleDelete(staff.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
