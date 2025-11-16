"use client";

import { Eye, Edit2, Lock, Unlock, Trash2, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./manage-customers.module.css";

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // accountId
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    orders: "",
    status: "active",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Hàm map dữ liệu account trả từ backend -> dạng customer dùng cho UI
  const mapAccountToCustomer = (acc) => ({
    accountId: acc.id,
    userId: acc.user ? acc.user.id : null,
    name: acc.user ? acc.user.fullName : "",
    email: acc.email,
    phone: acc.user && acc.user.phoneNumber ? acc.user.phoneNumber : "Chưa có SĐT",
    joinDate:
      acc.user && acc.user.dateOfBirth
        ? String(acc.user.dateOfBirth).substring(0, 10)
        : "—",
    orders: 0, // backend hiện chưa có số đơn hàng -> tạm để 0
    status: acc.activated ? "active" : "locked",
  });

  // Load dữ liệu từ backend khi mở trang
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("http://localhost:8080/api/accounts");
        if (!res.ok) {
          throw new Error("Fetch /api/accounts failed with status " + res.status);
        }
        const data = await res.json();
        const formatted = data.map((acc) => mapAccountToCustomer(acc));
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

  // Lưu form (thêm hoặc sửa) -> gọi backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // --- CẬP NHẬT USER (tên, SĐT, ngày tham gia) ---
        const existing = customers.find((c) => c.accountId === editingId);
        if (!existing || !existing.userId) {
          alert("Không tìm thấy khách hàng để cập nhật");
          return;
        }

        const userDto = {
          id: existing.userId,
          fullName: formData.name,
          dateOfBirth: formData.joinDate || null, // "yyyy-MM-dd"
          gender: "", // nếu sau này bạn có field giới tính thì set lại
          phoneNumber: formData.phone,
          address: "",
          avatarUrl: "",
        };

        const resUser = await fetch(
          `http://localhost:8080/api/users/${existing.userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userDto),
          }
        );

        if (!resUser.ok) {
          throw new Error("Cập nhật user thất bại, status " + resUser.status);
        }

        const updatedUser = await resUser.json();

        const updatedCustomer = {
          ...existing,
          name: updatedUser.fullName,
          phone: updatedUser.phoneNumber || existing.phone,
          joinDate: updatedUser.dateOfBirth
            ? String(updatedUser.dateOfBirth).substring(0, 10)
            : existing.joinDate,
          orders: formData.orders || existing.orders,
        };

        setCustomers((prev) =>
          prev.map((c) =>
            c.accountId === editingId ? updatedCustomer : c
          )
        );

        alert("Cập nhật thông tin khách hàng thành công!");
      } else {
        // --- TẠO MỚI USER ---
        const userDto = {
          fullName: formData.name,
          dateOfBirth: formData.joinDate || null, // "yyyy-MM-dd"
          gender: "",
          phoneNumber: formData.phone,
          address: "",
          avatarUrl: "",
        };

        const resUser = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userDto),
        });

        if (!resUser.ok) {
          throw new Error("Tạo user thất bại, status " + resUser.status);
        }

        const newUser = await resUser.json();

        // --- TẠO MỚI ACCOUNT ---
        const accountDto = {
          email: formData.email,
          password: "123456", // mật khẩu default cho khách, sau này cho đổi
          role: "CUSTOMER",
          activated: formData.status === "active",
          userId: newUser.id,
        };

        const resAcc = await fetch("http://localhost:8080/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(accountDto),
        });

        if (!resAcc.ok) {
          throw new Error("Tạo account thất bại, status " + resAcc.status);
        }

        const newAcc = await resAcc.json();
        const newCustomer = mapAccountToCustomer(newAcc);
        newCustomer.orders = parseInt(formData.orders || "0", 10);

        setCustomers((prev) => [...prev, newCustomer]);
        alert("Thêm khách hàng mới thành công!");
      }

      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi khi lưu khách hàng:", err);
      alert("Có lỗi xảy ra khi lưu khách hàng. Xem console để biết chi tiết.");
    }
  };

  // Xem chi tiết
  const handleView = (accountId) => {
    const customer = customers.find((c) => c.accountId === accountId);
    setSelectedCustomer(customer);
  };

  // Sửa -> chỉ mở form, dữ liệu sẽ được submit bằng handleSubmit
  const handleEdit = (accountId) => {
    const c = customers.find((x) => x.accountId === accountId);
    if (!c) return;

    setEditingId(accountId);
    setFormData({
      name: c.name,
      email: c.email,
      phone: c.phone,
      joinDate: c.joinDate && c.joinDate !== "—" ? c.joinDate : "",
      orders: c.orders,
      status: c.status,
    });
    setShowForm(true);
  };

  // Khóa / mở khóa -> dùng API toggle
  const handleToggleLock = async (accountId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/accounts/${accountId}/toggle`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        throw new Error("Toggle thất bại, status " + res.status);
      }

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
      alert("Không thể thay đổi trạng thái khách hàng.");
    }
  };

  // Xóa account -> gọi backend rồi cập nhật state
  const handleDelete = async (accountId) => {
    if (!confirm("Bạn chắc muốn xóa?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/accounts/${accountId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok && res.status !== 204) {
        throw new Error("Xóa thất bại, status " + res.status);
      }

      setCustomers((prev) => prev.filter((c) => c.accountId !== accountId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Không thể xóa khách hàng.");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomerDetailModal = () => {
    if (!selectedCustomer) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h3>Thông tin khách hàng</h3>

          <p>
            <strong>ID:</strong> {selectedCustomer.accountId}
          </p>
          <p>
            <strong>Họ tên:</strong> {selectedCustomer.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedCustomer.email}
          </p>
          <p>
            <strong>SĐT:</strong> {selectedCustomer.phone}
          </p>
          <p>
            <strong>Ngày tham gia:</strong> {selectedCustomer.joinDate}
          </p>
          <p>
            <strong>Số đơn hàng:</strong> {selectedCustomer.orders}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {selectedCustomer.status === "active" ? "Hoạt động" : "Khóa"}
          </p>

          <button
            className={styles.closeButton}
            onClick={() => setSelectedCustomer(null)}
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

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
              disabled={!!editingId} // tạm không cho đổi email khi sửa
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
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Modal chi tiết */}
      {selectedCustomer && <CustomerDetailModal />}

      {/* Bảng dữ liệu */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
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
                  colSpan={8}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có dữ liệu khách hàng
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.accountId}>
                  <td>{customer.accountId}</td>
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
                          handleToggleLock(customer.accountId)
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
