"use client"

import { Eye, Edit2, Lock, Unlock, Trash2 } from "lucide-react"
import styles from "./manage-customers.module.css"

export default function ManageCustomers() {
  const customers = [
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
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0923456789",
      joinDate: "2024-04-05",
      orders: 2,
      status: "active",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@email.com",
      phone: "0934567890",
      joinDate: "2024-05-12",
      orders: 12,
      status: "active",
    },
  ]

  const handleView = (id) => {
    console.log("View customer:", id)
  }

  const handleEdit = (id) => {
    console.log("Edit customer:", id)
  }

  const handleToggleLock = (id, currentStatus) => {
    console.log("Toggle lock:", id, currentStatus)
  }

  const handleDelete = (id) => {
    console.log("Delete customer:", id)
  }

  return (
    <div className={styles.container}>
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
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className={styles.nameCell}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.joinDate}</td>
                <td className={styles.centerCell}>{customer.orders}</td>
                <td>
                  <span className={`${styles.badge} ${styles[customer.status]}`}>
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
                      className={`${styles.btn} ${customer.status === "active" ? styles.btnLock : styles.btnUnlock}`}
                      onClick={() => handleToggleLock(customer.id, customer.status)}
                      title={customer.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    >
                      {customer.status === "active" ? <Lock size={16} /> : <Unlock size={16} />}
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
  )
}
