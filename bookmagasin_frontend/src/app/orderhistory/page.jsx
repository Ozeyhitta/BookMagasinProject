"use client"

import { useState } from "react"
import styles from "./orderhistory.module.css"

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      orderDate: "2024-10-20",
      name: "Adventure Story Book",
      quantity: 1,
      status: "Pending",
      statusTime: "5d left",
      total: "$452.23",
      image: "/adventure-story-book.jpg",
    },
    {
      id: "ORD002",
      orderDate: "2024-10-18",
      name: "Travelling Backpack",
      quantity: 2,
      status: "Delivered",
      total: "$452.23",
      image: "/travelling-backpack.jpg",
    },
    {
      id: "ORD003",
      orderDate: "2024-10-15",
      name: "Mirrorless Cameras",
      quantity: 1,
      status: "Delivered",
      total: "$452.23",
      image: "/mirrorless-cameras.jpg",
    },
  ])

  const tabs = [
    { id: "all", label: "Tất cả đơn hàng", count: 50 },
    { id: "pending", label: "Đang chờ", count: 10 },
    { id: "completed", label: "Hoàn thành", count: 8 },
    { id: "cancelled", label: "Đã hủy", count: 22 },
  ]

  const getStatusColor = (status) => {
    if (status === "Pending") return "#FF9500"
    if (status === "Delivered") return "#34C759"
    return "#999"
  }

  const handleCancelOrder = (orderId) => {
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      setOrders(orders.filter((order) => order.id !== orderId))
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lịch sử đơn hàng</h1>

      <div className={styles.header}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Đơn hàng</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Chi tiết</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div className={styles.itemCell}>
                    <div>
                      <div className={styles.itemName}>ID: {order.id}</div>
                      <div className={styles.itemQty}>Ngày tạo: {order.orderDate}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.status} style={{ color: getStatusColor(order.status) }}>
                    {order.status}
                    {order.statusTime && <span className={styles.statusTime}> - {order.statusTime}</span>}
                  </div>
                </td>
                <td>{order.total}</td>
                <td>
                  <button className={styles.btnDetails}>Chi tiết đơn hàng</button>
                </td>
                <td>
                  <button className={styles.btnCancel} onClick={() => handleCancelOrder(order.id)} title="Hủy đơn hàng">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
