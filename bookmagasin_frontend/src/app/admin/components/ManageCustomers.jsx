"use client";

import { Eye, Edit2, Lock, Unlock, Trash2, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./manage-customers.module.css";

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    orders: "",
    status: "active",
  });

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("http://localhost:8080/api/accounts");
        const data = await res.json();

        const formatted = data.map((acc) => ({
          accountId: acc.id, // ✅ đúng ID của bảng accounts
          userId: acc.user.id,
          name: acc.user.fullName,
          email: acc.email,
          phone: acc.user.phoneNumber || "Chưa có SĐT",
          joinDate: acc.user.dateOfBirth
            ? acc.user.dateOfBirth.substring(0, 10)
            : "—",
          orders: 0,
          status: acc.activated ? "active" : "locked",
        }));

        setCustomers(formatted);
      } catch (err) {
        console.error("Lỗi fetch khách hàng:", err);
      }
    }

    fetchCustomers();
  }, []);

  // Mở form thêm mới
  const handleAddCustomer = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      joinDate: "",
      orders: "",
      status: "active",
    });
    setShowForm(true);
  };

  // Lưu form (thêm hoặc sửa)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCustomers((prev) =>
        prev.map((c) => (c.accountId === editingId ? { ...c, ...formData } : c))
      );
      alert("Cập nhật thông tin khách hàng thành công!");
    } else {
      const id = customers.length ? customers[customers.length - 1].id + 1 : 1;
      setCustomers([...customers, { accountId: id, ...formData }]);

      alert("Thêm khách hàng mới thành công!");
    }
    setShowForm(false);
    setEditingId(null);
  };

  // Xem chi tiết
  const handleView = (accountId) => {
    const c = customers.find((x) => x.accountId === accountId);
    alert(
      `📋 Thông tin khách hàng:\n\nTên: ${c.name}\nEmail: ${c.email}\nSĐT: ${
        c.phone
      }\nNgày tham gia: ${c.joinDate}\nSố đơn hàng: ${c.orders}\nTrạng thái: ${
        c.status === "active" ? "Hoạt động" : "Bị khóa"
      }`
    );
  };

  // Sửa
  const handleEdit = (accountId) => {
    const c = customers.find((x) => x.accountId === accountId);
    setEditingId(accountId);
    setFormData({ ...c });
    setShowForm(true);
  };

  // Khóa / mở khóa
  const handleToggleLock = async (accountId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/accounts/${accountId}/toggle`,
        {
          method: "PUT",
        }
      );

      const updated = await res.json();

      setCustomers((prev) =>
        prev.map((c) =>
          c.accountId === accountId
            ? {
                ...c,
                status: updated.activated ? "active" : "locked",
              }
            : c
        )
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // Xóa
  const handleDelete = async (accountId) => {
    if (!confirm("Bạn chắc muốn xóa?")) return;

    await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
      method: "DELETE",
    });

    setCustomers((prev) => prev.filter((c) => c.accountId !== accountId));
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý khách hàng</h2>
        <button className={styles.addButton} onClick={handleAddCustomer}>
          <Plus size={18} />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Form thêm / sửa khách hàng */}
      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <input
              type="text"
              placeholder="Tên khách hàng"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formRow}>
            <input
              type="text"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) =>
                setFormData({ ...formData, joinDate: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formRow}>
            <input
              type="number"
              placeholder="Số đơn hàng"
              value={formData.orders}
              onChange={(e) =>
                setFormData({ ...formData, orders: e.target.value })
              }
              required
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              {editingId ? "Cập nhật" : "Lưu"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Bảng dữ liệu */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Ngày tham gia</th>
              <th>Số đơn hàng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có dữ liệu khách hàng
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.accountId}>
                  <td className={styles.nameCell}>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.joinDate}</td>
                  <td className={styles.centerCell}>{customer.orders}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[customer.status]}`}
                    >
                      {customer.status === "active" ? "Hoạt động" : "Khóa"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.btn} ${styles.btnView}`}
                        onClick={() => handleView(customer.accountId)}
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => handleEdit(customer.accountId)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={`${styles.btn} ${
                          customer.status === "active"
                            ? styles.btnLock
                            : styles.btnUnlock
                        }`}
                        onClick={() =>
                          handleToggleLock(customer.accountId, customer.status)
                        }
                        title={
                          customer.status === "active"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                        }
                      >
                        {customer.status === "active" ? (
                          <Lock size={16} />
                        ) : (
                          <Unlock size={16} />
                        )}
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => handleDelete(customer.accountId)}
                        title="Xóa"
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
    </div>
  );
}
