"use client";

import { useState, useEffect } from "react";
import { Eye, Edit2, Lock, Unlock, Trash2, Plus, Search, X } from "lucide-react";
import styles from "./manage-staffs.module.css";

export default function ManageStaffs() {
  const [staffs, setStaffs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const [newStaff, setNewStaff] = useState(emptyStaff);

  // ======================
  // LOAD STAFF LIST
  // ======================
  useEffect(() => {
    loadStaffs();
  }, []);

  const loadStaffs = () => {
    fetch("http://localhost:8080/api/admin/staffs")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((acc) => {
          const u = acc.user || {};

          return {
            id: acc.id,
            email: acc.email,
            status: acc.activated ? "active" : "locked",

            fullName: u.fullName || "",
            phoneNumber: u.phoneNumber || "",
            position: u.position || "",
            address: u.address || "",
            avatarUrl: u.avatarUrl || "",

            dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
            joinDate: u.joinDate ? u.joinDate.split("T")[0] : "",
          };
        });

        setStaffs(mapped);
      })
      .catch((err) => console.error("Error loading staffs:", err));
  };

  // ======================
  // HANDLE CHANGE INPUT
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingId(null);
    setNewStaff(emptyStaff);
    setShowModal(true);
  };

  // ======================
  // SUBMIT FORM
  // ======================
  const handleSubmit = (e) => {
    e.preventDefault();

    const dto = {
      fullName: newStaff.fullName,
      email: newStaff.email,
      phoneNumber: newStaff.phoneNumber,
      dateOfBirth: newStaff.dateOfBirth,
      address: newStaff.address,
      avatarUrl: newStaff.avatarUrl,
      position: newStaff.position,
      joinDate: newStaff.joinDate,
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
        setShowModal(false);
      })
      .catch((err) => console.error("Error saving staff:", err));
  };

  // ======================
  // VIEW DETAIL
  // ======================
  const handleView = (id) => {
    const s = staffs.find((x) => x.id === id);
    if (!s) return;

    alert(
      `👤 Thông tin nhân viên:\n
Tên: ${s.fullName}
Email: ${s.email}
SĐT: ${s.phoneNumber}
Ngày sinh: ${s.dateOfBirth || "Không có"}
Địa chỉ: ${s.address || "Không có"}
Avatar URL: ${s.avatarUrl || "Không có"}
Chức vụ: ${s.position || "Không có"}
Ngày tham gia: ${s.joinDate || "Không có"}
Trạng thái: ${s.status === "active" ? "Hoạt động" : "Khóa"}`
    );
  };

  // ======================
  // EDIT STAFF
  // ======================
  const handleEdit = (id) => {
    const s = staffs.find((x) => x.id === id);
    if (!s) return;

    setNewStaff({
      fullName: s.fullName,
      email: s.email,
      phoneNumber: s.phoneNumber,
      dateOfBirth: s.dateOfBirth,
      address: s.address,
      avatarUrl: s.avatarUrl,
      position: s.position,
      joinDate: s.joinDate,
      status: s.status,
    });

    setEditingId(id);
    setShowModal(true);
  };

  // ======================
  // LOCK / UNLOCK
  // ======================
  const handleToggleLock = (id) => {
    fetch(`http://localhost:8080/api/admin/staffs/${id}/toggle`, { method: "PUT" })
      .then(() => loadStaffs());
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc xóa nhân viên này?")) return;

    fetch(`http://localhost:8080/api/admin/staffs/${id}`, { method: "DELETE" })
      .then(() => loadStaffs());
  };

  // ======================
  // SEARCH
  // ======================
  const filtered = staffs.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================
  // UI
  // ======================
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <button className={styles.addButton} onClick={openAddModal}>
          <Plus size={16} /> Thêm nhân viên
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

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <label>Họ tên:</label>
              <input name="fullName" value={newStaff.fullName} onChange={handleChange} required />

              <label>Email:</label>
              <input name="email" type="email" value={newStaff.email} onChange={handleChange} required />

              <label>Số điện thoại:</label>
              <input name="phoneNumber" value={newStaff.phoneNumber} onChange={handleChange} />

              <label>Ngày sinh:</label>
              <input name="dateOfBirth" type="date" value={newStaff.dateOfBirth} onChange={handleChange} />

              <label>Địa chỉ:</label>
              <input name="address" value={newStaff.address} onChange={handleChange} />

              <label>Avatar URL:</label>
              <input name="avatarUrl" value={newStaff.avatarUrl} onChange={handleChange} />

              <label>Chức vụ:</label>
              <input name="position" value={newStaff.position} onChange={handleChange} />

              <label>Ngày tham gia:</label>
              <input name="joinDate" type="date" value={newStaff.joinDate} onChange={handleChange} />

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
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

      {/* TABLE */}
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
                  <span className={`${styles.badge} ${styles[staff.status]}`}>
                    {staff.status === "active" ? "Hoạt động" : "Khóa"}
                  </span>
                </td>

                <td className={styles.actions}>
                  <button className={styles.btnView} onClick={() => handleView(staff.id)}>
                    <Eye size={16} />
                  </button>

                  <button className={styles.btnEdit} onClick={() => handleEdit(staff.id)}>
                    <Edit2 size={16} />
                  </button>

                  <button
                    className={staff.status === "active" ? styles.btnLock : styles.btnUnlock}
                    onClick={() => handleToggleLock(staff.id)}
                  >
                    {staff.status === "active" ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>

                  <button className={styles.btnDelete} onClick={() => handleDelete(staff.id)}>
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
