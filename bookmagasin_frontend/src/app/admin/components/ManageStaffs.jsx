"use client";

import { useState } from "react";
import { Eye, Edit2, Lock, Unlock, Trash2, Plus, Search } from "lucide-react";
import styles from "./manage-staffs.module.css";

export default function ManageStaffs() {
  const [staffs, setStaffs] = useState([
    { id: 1, name: "Nguyễn Văn Hùng", email: "hungnguyen@email.com", phone: "0912345678", position: "Quản lý bán hàng", joinDate: "2023-06-15", status: "active" },
    { id: 2, name: "Trần Thị Hương", email: "huongtran@email.com", phone: "0987654321", position: "Nhân viên kho", joinDate: "2023-08-20", status: "active" },
    { id: 3, name: "Lê Văn Minh", email: "minhle@email.com", phone: "0901234567", position: "Nhân viên bán hàng", joinDate: "2024-01-10", status: "locked" },
    { id: 4, name: "Phạm Thị Linh", email: "linhpham@email.com", phone: "0923456789", position: "Quản lý kho", joinDate: "2023-09-05", status: "active" },
    { id: 5, name: "Hoàng Văn Sơn", email: "sonhoang@email.com", phone: "0934567890", position: "Nhân viên bán hàng", joinDate: "2024-02-12", status: "active" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    joinDate: "",
    status: "active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.position) {
      alert("Vui lòng nhập đầy đủ thông tin nhân viên!");
      return;
    }

    if (editingId) {
      // Cập nhật nhân viên
      setStaffs((prev) =>
        prev.map((st) =>
          st.id === editingId ? { ...newStaff, id: editingId } : st
        )
      );
      alert("✅ Đã cập nhật thông tin nhân viên.");
      setEditingId(null);
    } else {
      // Thêm nhân viên mới
      const id = Date.now();
      setStaffs((prev) => [...prev, { ...newStaff, id }]);
      alert("✅ Đã thêm nhân viên mới.");
    }

    setNewStaff({
      name: "",
      email: "",
      phone: "",
      position: "",
      joinDate: "",
      status: "active"
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      position: "",
      joinDate: "",
      status: "active"
    });
    setEditingId(null);
    setShowForm(false);
  };

  /* Actions */
  const handleView = (id) => {
    const s = staffs.find((x) => x.id === id);
    if (!s) return;
    alert(
      `👤 Thông tin nhân viên:\n\nTên: ${s.name}\nEmail: ${s.email}\nSĐT: ${s.phone}\nChức vụ: ${s.position}\nNgày tham gia: ${s.joinDate}\nTrạng thái: ${s.status === "active" ? "Hoạt động" : "Khóa"}`
    );
  };

  const handleEdit = (id) => {
    const s = staffs.find((x) => x.id === id);
    if (!s) return;
    setNewStaff(s);
    setEditingId(id);
    setShowForm(true);
  };

  const handleToggleLock = (id) => {
    setStaffs((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "locked" : "active" }
          : s
      )
    );
  };

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      setStaffs((prev) => prev.filter((s) => s.id !== id));
      alert("🗑️ Đã xóa nhân viên.");
    }
  };

  const filtered = staffs.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Add button & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button
          className={styles.addButton}
          onClick={() => {
            setShowForm((prev) => !prev);
            setEditingId(null);
            setNewStaff({
              name: "",
              email: "",
              phone: "",
              position: "",
              joinDate: "",
              status: "active"
            });
          }}
        >
          <Plus size={16} />{" "}
          {editingId ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              border: "1px solid #ddd",
              padding: "6px 8px",
              borderRadius: 8,
            }}
          >
            <Search size={16} style={{ color: "#333", marginRight: 6 }} />
            <input
              placeholder="Tìm tên, email, chức vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#000",
              }}
            />
          </div>
        </div>
      </div>

      {/* Form thêm / sửa */}
      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Họ và tên</label>
            <input
              name="name"
              value={newStaff.name}
              onChange={handleChange}
              placeholder="Nhập tên nhân viên"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              name="email"
              value={newStaff.email}
              onChange={handleChange}
              placeholder="Nhập email"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Điện thoại</label>
            <input
              name="phone"
              value={newStaff.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Chức vụ</label>
            <input
              name="position"
              value={newStaff.position}
              onChange={handleChange}
              placeholder="Nhập chức vụ"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Ngày tham gia</label>
            <input
              type="date"
              name="joinDate"
              value={newStaff.joinDate}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Trạng thái</label>
            <select
              name="status"
              value={newStaff.status}
              onChange={handleChange}
            >
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              {editingId ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên nhân viên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Chức vụ</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((staff) => (
              <tr key={staff.id}>
                <td className={styles.nameCell}>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.position}</td>
                <td>{staff.joinDate}</td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[staff.status]}`}
                  >
                    {staff.status === "active" ? "Hoạt động" : "Khóa"}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.btn} ${styles.btnView}`}
                      onClick={() => handleView(staff.id)}
                      title="Xem"
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
                      onClick={() => handleDelete(staff.id)}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
