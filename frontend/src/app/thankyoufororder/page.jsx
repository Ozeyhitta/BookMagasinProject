"use client";

import { useMemo, useState } from "react";
import styles from "./thankyoufororder.module.css";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");
  const amount = searchParams.get("amount");
  const paymentId = searchParams.get("paymentId");
  const vnpTxnRef = searchParams.get("vnpTxnRef");
  const message = searchParams.get("message");

  const humanStatus = useMemo(() => {
    if (!paymentStatus) return null;
    if (paymentStatus === "SUCCESS") return "Thanh toán thành công";
    if (paymentStatus === "FAILED") return "Thanh toán thất bại";
    return paymentStatus;
  }, [paymentStatus]);

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "#" },
    { name: "LinkedIn", icon: "💼", url: "#" },
    { name: "Pinterest", icon: "📌", url: "#" },
    { name: "Twitter", icon: "𝕏", url: "#" },
  ];

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
            <path
              d="M20 30L27 37L40 24"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className={styles.title}>Cảm ơn bạn!</h1>

        {/* Description */}
        <p className={styles.description}>
          Chúng tôi đã gửi xác nhận đơn hàng của bạn vào email để bạn dễ dàng
          theo dõi. Bạn có thể tìm thêm thông tin trên website và các trang mạng
          xã hội của chúng tôi.
        </p>

        {(humanStatus || amount || paymentId || vnpTxnRef) && (
          <div className={styles.paymentInfo}>
            {humanStatus && (
              <p>
                Trạng thái: <strong>{humanStatus}</strong>
              </p>
            )}
            {amount && (
              <p>
                Số tiền:{" "}
                <strong>
                  {Number(amount).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </strong>
              </p>
            )}
            {paymentId && (
              <p>
                Mã thanh toán: <strong>{paymentId}</strong>
              </p>
            )}
            {vnpTxnRef && (
              <p>
                Mã giao dịch VNPay: <strong>{vnpTxnRef}</strong>
              </p>
            )}
            {message && (
              <p>
                Ghi chú: <strong>{message}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
