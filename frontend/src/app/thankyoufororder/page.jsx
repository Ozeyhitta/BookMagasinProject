"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./thankyoufororder.module.css";

export default function ThankYouPage() {
  const router = useRouter();
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

  return (
    <div className={styles.container}>
      <div className={styles.triangleYellow}></div>
      <div className={styles.triangleGreen}></div>

      <div className={styles.content}>
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

        <h1 className={styles.title}>Cảm ơn bạn!</h1>

        <p className={styles.description}>
          Chúng tôi đã gửi xác nhận đơn hàng vào email của bạn để bạn dễ dàng theo
          dõi. Bạn có thể tìm thêm thông tin trên website và các trang mạng xã hội
          của chúng tôi.
        </p>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => router.push("/mainpage")}
          >
            Về trang chủ
          </button>
        </div>

        {(humanStatus || amount || paymentId || vnpTxnRef || message) && (
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
