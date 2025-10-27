"use client"

import { useState } from "react"
import styles from "./thankyoufororder.module.css"

export default function ThankYouPage() {
  const [hoveredSocial, setHoveredSocial] = useState(null)

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "#" },
    { name: "LinkedIn", icon: "💼", url: "#" },
    { name: "Pinterest", icon: "📌", url: "#" },
    { name: "Twitter", icon: "𝕏", url: "#" },
  ]

  return (
    <div className={styles.container}>
      {/* Decorative triangles */}
      <div className={styles.triangleYellow}></div>
      <div className={styles.triangleGreen}></div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Checkmark icon */}
        <div className={styles.checkmark}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" fill="#1abc9c" />
            <path d="M20 30L27 37L40 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Title */}
        <h1 className={styles.title}>Cảm ơn bạn!</h1>

        {/* Description */}
        <p className={styles.description}>
          Chúng tôi đã gửi xác nhận đơn hàng của bạn vào email để bạn dễ dàng theo dõi. Bạn có thể tìm thêm thông tin
          trên website và các trang mạng xã hội của chúng tôi.
        </p>

        {/* Two column section */}
        <div className={styles.sectionsContainer}>
          {/* Connect With Us */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Kết nối với chúng tôi</h2>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={styles.socialIcon}
                  title={social.name}
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Visit Our Website */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ghé thăm website của chúng tôi</h2>
            <a href="/" className={styles.visitButton}>
              Truy cập Website
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
