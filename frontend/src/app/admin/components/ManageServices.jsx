"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Search, X } from "lucide-react";
import styles from "./manage-services.module.css";

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    nameService: "",
    price: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [editingId, setEditingId] = useState(null);

  // Load dữ liệu
  const loadServices = async () => {
    const res = await fetch("http://localhost:8080/api/services");
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ nameService: "", price: "", status: true });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!form.nameService.trim())
      newErrors.nameService = "Tên dịch vụ là bắt buộc";
    if (form.price < 0) newErrors.price = "Giá phải lớn hơn hoặc bằng 0";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    const url = editingId
      ? `http://localhost:8080/api/services/${editingId}`
      : "http://localhost:8080/api/services";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });

      if (!res.ok) throw new Error("Server error");

      setToast({
        show: true,
        message: editingId ? "Cập nhật thành công!" : "Tạo mới thành công!",
        type: "success",
      });

      setShowForm(false);
      setEditingId(null);
      loadServices();
    } catch (err) {
      setToast({
        show: true,
        message: "Thao tác thất bại!",
        type: "error",
      });
    }

    setLoading(false);
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      nameService: service.nameService,
      price: service.price,
      status: service.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;

    await fetch(`http://localhost:8080/api/services/${id}`, {
      method: "DELETE",
    });

    loadServices();
  };

  const filtered = services.filter((s) =>
    s.nameService.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Quản lý dịch vụ</h2>

        <button
          className={styles.btnAdd}
          onClick={openAddForm}
          style={{ gap: 6 }}
        >
          <Plus size={16} /> Thêm dịch vụ
        </button>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBox} style={{ marginBottom: 16 }}>
        <Search size={16} />
        <input
          placeholder="Tìm kiếm dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MODAL POPUP */}
      {showForm && (
        <div
          className={styles.modalOverlay}
          onClick={() => !loading && setShowForm(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // không đóng khi click bên trong
          >
            <div className={styles.modalHeader}>
              <h3>{editingId ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}</h3>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => !loading && setShowForm(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* NAME */}
              <div className={styles.formGroup}>
                <label>Tên dịch vụ</label>
                <input
                  type="text"
                  value={form.nameService}
                  onChange={(e) =>
                    setForm({ ...form, nameService: e.target.value })
                  }
                />
                {errors.nameService && (
                  <p className={styles.errorText}>{errors.nameService}</p>
                )}
              </div>

              {/* PRICE */}
              <div className={styles.formGroup}>
                <label>Giá</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                {errors.price && (
                  <p className={styles.errorText}>{errors.price}</p>
                )}
              </div>

              {/* STATUS */}
              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value === "true" })
                  }
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  disabled={loading}
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>

                <button
                  className={styles.btnAdd}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm"}
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
              <th style={{ width: 60 }}>ID</th>
              <th>Tên</th>
              <th style={{ width: 140 }}>Giá</th>
              <th style={{ width: 140 }}>Trạng thái</th>
              <th style={{ width: 140 }}>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td className={styles.nameCell}>{s.nameService}</td>
                <td>{s.price}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      s.status ? styles.active : styles.inactive
                    }`}
                  >
                    {s.status ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>

                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      type="button"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      type="button"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: "center" }}>
                  Không tìm thấy dịch vụ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
