"use client";

import { useState, useEffect } from "react";

import { Edit2, Trash2, Plus, Search, X } from "lucide-react";
import styles from "./manage-promotions.module.css";

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyPromo = {
    name: "",
    code: "",
    discountPercent: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
  };

  const [promoForm, setPromoForm] = useState(emptyPromo);

  // LOAD PROMOTIONS
  useEffect(() => {
    loadPromotions();
  }, []);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  const loadPromotions = () => {
    fetch("http://localhost:8080/api/promotions")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code || "",
          discountPercent: p.discountPercent,
          maxDiscount: p.maxDiscount ?? "",
          startDate: p.startDate?.split("T")[0] || "",
          endDate: p.endDate?.split("T")[0] || "",
        }));
        setPromotions(mapped);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromoForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setPromoForm(emptyPromo);
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dto = {
      name: promoForm.name,
      code: promoForm.code,
      discountPercent: parseFloat(promoForm.discountPercent),
      maxDiscount:
        promoForm.maxDiscount === "" ? null : parseFloat(promoForm.maxDiscount),
      startDate: promoForm.startDate,
      endDate: promoForm.endDate,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/api/promotions/${editingId}`
      : "http://localhost:8080/api/promotions";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }).then(() => {
      loadPromotions();
      setShowForm(false);
    });
  };

  const handleEdit = (id) => {
    const p = promotions.find((x) => x.id === id);
    if (!p) return;

    setPromoForm({
      name: p.name,
      code: p.code || "",
      discountPercent: p.discountPercent,
      maxDiscount: p.maxDiscount ?? "",
      startDate: p.startDate,
      endDate: p.endDate,
    });

    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc muốn xóa khuyến mãi?")) return;

    fetch(`http://localhost:8080/api/promotions/${id}`, {
      method: "DELETE",
    }).then(() => loadPromotions());
  };

  /** TÍNH TRẠNG THÁI */
  const getStatus = (start, end) => {
    const today = new Date().toISOString().split("T")[0];

    if (today < start) return "inactive";
    if (today > end) return "expired";
    return "active";
  };

  const filtered = promotions.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <button onClick={openAdd} className={styles.btnAdd}>
          <Plus size={16} /> Thêm khuyến mãi
        </button>

        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            placeholder="Tìm kiếm khuyến mãi…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={cancelForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {editingId ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={cancelForm}
              >
                <X size={18} />
              </button>
            </div>

            <form
              className={`${styles.modalForm} ${
                editingId ? styles.editing : ""
              }`}
              onSubmit={handleSubmit}
            >
              <div className={styles.formGroup}>
                <label>Tên khuyến mãi</label>
                <input
                  name="name"
                  value={promoForm.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mã khuyến mãi</label>
                <input
                  name="code"
                  value={promoForm.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Giảm (%)</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={promoForm.discountPercent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Giảm tối đa (VND)</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={promoForm.maxDiscount}
                  onChange={handleChange}
                  placeholder="Nhập số tiền tối đa (bỏ trống nếu không giới hạn)"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={promoForm.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={promoForm.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={cancelForm}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.btnAdd}>
                  {editingId ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BẢNG */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên khuyến mãi</th>
              <th>Mã</th>
              <th>Giảm (%)</th>
              <th>Giảm tối đa</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className={styles.nameCell}>{p.name}</td>
                <td>{p.code || "-"}</td>
                <td>{p.discountPercent}%</td>
                <td>
                  {p.maxDiscount
                    ? `${Number(p.maxDiscount).toLocaleString("vi-VN")}đ`
                    : "Không giới hạn"}
                </td>
                <td>{p.startDate}</td>
                <td>{p.endDate}</td>

                <td>
                  <span
                    className={`${styles.badge} ${
                      styles[getStatus(p.startDate, p.endDate)]
                    }`}
                  >
                    {getStatus(p.startDate, p.endDate) === "active"
                      ? "Hoạt động"
                      : getStatus(p.startDate, p.endDate) === "inactive"
                      ? "Chưa hoạt động"
                      : "Hết hạn"}
                  </span>
                </td>

                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => handleEdit(p.id)}
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => handleDelete(p.id)}
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
