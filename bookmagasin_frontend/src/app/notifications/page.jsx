"use client"

import { useState } from "react"
import styles from "./notifications.module.css"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Đăng ký mới",
      typeColor: "#4CAF50",
      title: "Đăng ký mới: Finibus Bonorum et Malorum",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
      user: "Allen Deu",
      time: "24 Nov 2018 at 9:30 AM",
    },
    {
      id: 2,
      type: "Tin nhắn",
      typeColor: "#FF9800",
      title: "Darren Smith gửi tin nhắn mới",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
      user: "Darren",
      time: "24 Nov 2018 at 9:30 AM",
    },
    {
      id: 3,
      type: "Bình luận",
      typeColor: "#6C2FCC",
      title: "Arin Gansihram bình luận về bài viết",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
      user: "Arin Gansihram",
      time: "24 Nov 2018 at 9:30 AM",
    },
    {
      id: 4,
      type: "Kết nối",
      typeColor: "#2196F3",
      title: "Juliet Den Kết nối Allen Depk",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
      user: "Juliet Den",
      time: "24 Nov 2018 at 9:30 AM",
    },
    {
      id: 5,
      type: "Kết nối",
      typeColor: "#2196F3",
      title: "Juliet Den Kết nối Allen Depk",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
      user: "Juliet Den",
      time: "24 Nov 2018 at 9:30 AM",
    },
    {
      id: 6,
      type: "Tin nhắn",
      typeColor: "#FF9800",
      title: "Darren Smith gửi tin nhắn mới",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
      user: "Juliet Den",
      time: "24 Nov 2018 at 9:30 AM",
    },
  ])

  const handleRemove = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>THÔNG BÁO</h1>

      <div className={styles.notificationsList}>
        {notifications.map((notification) => (
          <div key={notification.id} className={styles.notificationItem}>
            <button
              className={styles.closeBtn}
              onClick={() => handleRemove(notification.id)}
              aria-label="Xóa thông báo"
            >
              ✕
            </button>

            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.tag} style={{ backgroundColor: notification.typeColor }}>
                  {notification.type}
                </span>
                <span className={styles.time}>{notification.time}</span>
              </div>

              <h3 className={styles.notifTitle}>{notification.title}</h3>
              <p className={styles.description}>{notification.description}</p>
              <p className={styles.userName}>{notification.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
