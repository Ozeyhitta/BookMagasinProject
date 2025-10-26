"use client"

import { Eye, Edit2, Lock, Unlock, Trash2 } from "lucide-react"
import styles from "./manage-staffs.module.css"

export default function ManageStaffs() {
  const staffs = [
    {
      id: 1,
      name: "Nguyễn Văn Hùng",
      email: "hungnguyen@email.com",
      phone: "0912345678",
      position: "Quản lý bán hàng",
      joinDate: "2023-06-15",
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị Hương",
      email: "huongtran@email.com",
      phone: "0987654321",
      position: "Nhân viên kho",
      joinDate: "2023-08-20",
      orders: 3,
      status: "active",
    },
    {
      id: 3,
      name: "Lê Văn Minh",
      email: "minhle@email.com",
      phone: "0901234567",
      position: "Nhân viên bán hàng",
      joinDate: "2024-01-10",
      status: "locked",
    },
    {
      id: 4,
      name: "Phạm Thị Linh",
      email: "linhpham@email.com",
      phone: "0923456789",
      position: "Quản lý kho",
      joinDate: "2023-09-05",
      status: "active",
    },
    {
      id: 5,
      name: "Hoàng Văn Sơn",
      email: "sonhoang@email.com",
      phone: "0934567890",
      position: "Nhân viên bán hàng",
      joinDate: "2024-02-12",
      status: "active",
    },
  ]

  const handleView = (id) => {
    console.log("View staff:", id)
  }

  const handleEdit = (id) => {
    console.log("Edit staff:", id)
  }

  const handleToggleLock = (id, currentStatus) => {
    console.log("Toggle lock:", id, currentStatus)
  }

  const handleDelete = (id) => {
    console.log("Delete staff:", id)
  }

  return (
    <div className={styles.container}>
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
            {staffs.map((staff) => (
              <tr key={staff.id}>
                <td className={styles.nameCell}>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.position}</td>
                <td>{staff.joinDate}</td>
                <td>
                  <span className={`${styles.badge} ${styles[staff.status]}`}>
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
                      className={`${styles.btn} ${staff.status === "active" ? styles.btnLock : styles.btnUnlock}`}
                      onClick={() => handleToggleLock(staff.id, staff.status)}
                      title={staff.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    >
                      {staff.status === "active" ? <Lock size={16} /> : <Unlock size={16} />}
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
  )
}
