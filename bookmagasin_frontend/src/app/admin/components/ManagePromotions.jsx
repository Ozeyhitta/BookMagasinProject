"use client"

import { Eye, Edit2, Trash2 } from "lucide-react"
import styles from "./manage-promotions.module.css"

export default function ManagePromotions() {
  const promotions = [
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
    {
      id: 5,
      name: "Giảm giá sách tiếng Anh",
      type: "discount",
      value: "30%",
      startDate: "2025-02-01",
      endDate: "2025-04-30",
      status: "active",
    },
  ]

  const getPromotionTypeLabel = (type) => {
    const types = {
      discount: "Discount",
      voucher: "Voucher",
      coupon: "Coupon",
      freeShipping: "Free Shipping",
    }
    return types[type] || type
  }

  const handleView = (id) => {
    console.log("View promotion:", id)
  }

  const handleEdit = (id) => {
    console.log("Edit promotion:", id)
  }

  const handleDelete = (id) => {
    console.log("Delete promotion:", id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên khuyến mãi</th>
              <th>Loại khuyến mãi</th>
              <th>Giá trị giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
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
                      onClick={() => handleView(promo.id)}
                      title="Xem"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => handleEdit(promo.id)}
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
