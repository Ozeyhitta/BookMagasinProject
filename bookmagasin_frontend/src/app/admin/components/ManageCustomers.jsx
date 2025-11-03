"use client";

import { Eye, Edit2, Lock, Unlock, Trash2, Plus, Search } from "lucide-react";
import { useState } from "react";
import styles from "./manage-customers.module.css";

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0912345678",
      joinDate: "2024-01-15",
      orders: 5,
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0987654321",
      joinDate: "2024-02-20",
      orders: 3,
      status: "active",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0901234567",
      joinDate: "2024-03-10",
      orders: 8,
      status: "locked",
    },
  ]);

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
        prev.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      );
      alert("Cập nhật thông tin khách hàng thành công!");
    } else {
      const id = customers.length ? customers[customers.length - 1].id + 1 : 1;
      setCustomers([...customers, { id, ...formData }]);
      alert("Thêm khách hàng mới thành công!");
    }
    setShowForm(false);
    setEditingId(null);
  };

  // Xem chi tiết
  const handleView = (id) => {
    const c = customers.find((x) => x.id === id);
    alert(
      `📋 Thông tin khách hàng:\n\nTên: ${c.name}\nEmail: ${c.email}\nSĐT: ${c.phone}\nNgày tham gia: ${c.joinDate}\nSố đơn hàng: ${c.orders}\nTrạng thái: ${
        c.status === "active" ? "Hoạt động" : "Bị khóa"
      }`
    );
  };

  // Sửa
  const handleEdit = (id) => {
    const c = customers.find((x) => x.id === id);
    setEditingId(id);
    setFormData({ ...c });
    setShowForm(true);
  };

  // Khóa / mở khóa
  const handleToggleLock = (id, currentStatus) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: currentStatus === "active" ? "locked" : "active" }
          : c
      )
    );
    alert(
      currentStatus === "active"
        ? "🔒 Tài khoản đã bị khóa."
        : "🔓 Tài khoản đã được mở khóa."
    );
  };

  // Xóa
  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
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
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
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
                      onClick={() => handleView(customer.id)}
                      title="Xem"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => handleEdit(customer.id)}
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
                        handleToggleLock(customer.id, customer.status)
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
                      onClick={() => handleDelete(customer.id)}
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
