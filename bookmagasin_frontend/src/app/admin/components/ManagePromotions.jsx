"use client"

import React, { useState } from "react"
import { Eye, Edit2, Trash2, Plus } from "lucide-react"
import styles from "./manage-promotions.module.css"

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "Giảm giá sách lập trình",
      type: "discount",
      value: "20%",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      status: "active",
    },
    {
      id: 2,
      name: "Voucher mua 5 sách",
      type: "voucher",
      value: "100.000đ",
      startDate: "2025-01-15",
      endDate: "2025-02-28",
      status: "active",
    },
    {
      id: 3,
      name: "Coupon tháng 2",
      type: "coupon",
      value: "15%",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      status: "active",
    },
    {
      id: 4,
      name: "Miễn phí vận chuyển",
      type: "freeShipping",
      value: "Miễn phí",
      startDate: "2025-01-20",
      endDate: "2025-02-20",
      status: "inactive",
    },
  ])

  const [selectedPromo, setSelectedPromo] = useState(null)
  const [mode, setMode] = useState("") // "add" | "edit" | "view"

  const getPromotionTypeLabel = (type) => {
    const types = {
      discount: "Giảm giá",
      voucher: "Voucher",
      coupon: "Coupon",
      freeShipping: "Miễn phí vận chuyển",
    }
    return types[type] || type
  }

  const handleAdd = () => {
    setSelectedPromo({
      id: null,
      name: "",
      type: "discount",
      value: "",
      startDate: "",
      endDate: "",
      status: "active",
    })
    setMode("add")
  }

  const handleView = (promo) => {
    setSelectedPromo(promo)
    setMode("view")
  }

  const handleEdit = (promo) => {
    setSelectedPromo(promo)
    setMode("edit")
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa khuyến mãi này không?")) {
      setPromotions(promotions.filter((p) => p.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (mode === "add") {
      const newPromo = { ...selectedPromo, id: Date.now() }
      setPromotions([...promotions, newPromo])
    } else if (mode === "edit") {
      setPromotions(promotions.map((p) => (p.id === selectedPromo.id ? selectedPromo : p)))
    }

    setMode("")
    setSelectedPromo(null)
  }

  const handleCancel = () => {
    setMode("")
    setSelectedPromo(null)
  }

  const isViewMode = mode === "view"

  return (
    <div className={styles.container}>
      {/* Nút thêm */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button className={styles.btnAdd} onClick={handleAdd}>
          <Plus size={16} style={{ marginRight: 6 }} /> Thêm khuyến mãi
        </button>
      </div>

      {/* Form thêm / chỉnh sửa / xem */}
      {mode && (
        <form
          className={`${styles.form} ${mode === "edit" ? styles.editing : ""}`}
          onSubmit={handleSubmit}
        >
          <h3>
            {mode === "add"
              ? "Thêm khuyến mãi mới"
              : mode === "edit"
              ? "Chỉnh sửa khuyến mãi"
              : "Xem thông tin khuyến mãi"}
          </h3>

          <div className={styles.formGroup}>
            <label>Tên khuyến mãi</label>
            <input
              type="text"
              value={selectedPromo.name}
              onChange={(e) =>
                setSelectedPromo({ ...selectedPromo, name: e.target.value })
              }
              placeholder="Nhập tên khuyến mãi"
              required
              readOnly={isViewMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Loại khuyến mãi</label>
            <select
              value={selectedPromo.type}
              onChange={(e) =>
                setSelectedPromo({ ...selectedPromo, type: e.target.value })
              }
              disabled={isViewMode}
            >
              <option value="discount">Giảm giá</option>
              <option value="voucher">Voucher</option>
              <option value="coupon">Coupon</option>
              <option value="freeShipping">Miễn phí vận chuyển</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Giá trị giảm</label>
            <input
              type="text"
              value={selectedPromo.value}
              onChange={(e) =>
                setSelectedPromo({ ...selectedPromo, value: e.target.value })
              }
              placeholder="VD: 20%, 50.000đ..."
              required
              readOnly={isViewMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              value={selectedPromo.startDate}
              onChange={(e) =>
                setSelectedPromo({ ...selectedPromo, startDate: e.target.value })
              }
              required
              readOnly={isViewMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ngày kết thúc</label>
            <input
              type="date"
              value={selectedPromo.endDate}
              onChange={(e) =>
                setSelectedPromo({ ...selectedPromo, endDate: e.target.value })
              }
              required
              readOnly={isViewMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Trạng thái</label>
            <select
              value={selectedPromo.status}
              onChange={(e) =>
                setSelectedPromo({ ...selectedPromo, status: e.target.value })
              }
              disabled={isViewMode}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={handleCancel}>
              Đóng
            </button>
            {!isViewMode && (
              <button type="submit" className={styles.btnAdd}>
                Lưu
              </button>
            )}
          </div>
        </form>
      )}

      {/* Bảng danh sách khuyến mãi */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên khuyến mãi</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id}>
                <td className={styles.nameCell}>{promo.name}</td>
                <td>
                  <span className={`${styles.typeBadge} ${styles[promo.type]}`}>
                    {getPromotionTypeLabel(promo.type)}
                  </span>
                </td>
                <td>{promo.value}</td>
                <td>{promo.startDate}</td>
                <td>{promo.endDate}</td>
                <td>
                  <span className={`${styles.badge} ${styles[promo.status]}`}>
                    {promo.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.btn} ${styles.btnView}`}
                      onClick={() => handleView(promo)}
                      title="Xem"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => handleEdit(promo)}
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => handleDelete(promo.id)}
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
  )
}
