"use client";

import { useMemo, useEffect, useState } from "react";
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
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storedSummary, setStoredSummary] = useState(null);

  const humanStatus = useMemo(() => {
    if (!paymentStatus) return null;
    const status = paymentStatus.toUpperCase();
    if (status === "SUCCESS" || status === "PENDING")
      return "Đặt hàng thành công";
    if (status === "FAILED") return "Đặt hàng thất bại";
    if (status === "CANCELLED") return "Đơn hàng đã hủy";
    return paymentStatus;
  }, [paymentStatus]);

  useEffect(() => {
    if (orderId && typeof window !== "undefined") {
      try {
        const summary = sessionStorage.getItem(`orderSummary:${orderId}`);
        if (summary) {
          setStoredSummary(JSON.parse(summary));
        }
      } catch (err) {
        console.warn("Failed to parse stored order summary", err);
      }
    }
  }, [orderId]);

  // Fetch chi tiết đơn hàng nếu có orderId
  useEffect(() => {
    if (orderId) {
      setLoading(true);
      console.log("[ThankYouPage] Fetching detail for order", orderId);
      fetch(`http://localhost:8080/api/orders/${orderId}/detail`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data) {
            console.log("[ThankYouPage] Detail response:", data);
            setOrderDetails(data);
          } else {
            console.warn("[ThankYouPage] Empty detail response");
          }
        })
        .catch((err) => {
          console.error("Error fetching order details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId]);

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
          Chúng tôi đã gửi xác nhận đơn hàng vào email của bạn để bạn dễ dàng
          theo dõi. Bạn có thể tìm thêm thông tin trên website và các trang mạng
          xã hội của chúng tôi.
        </p>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => router.push("/orderhistory")}
          >
            Xem đơn hàng
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => router.push("/mainpage")}
          >
            Về trang chủ
          </button>
        </div>

        {/* Thông tin đơn hàng */}
        <div className={styles.orderInfo}>
          {orderId && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Mã đơn hàng:</span>
              <span className={styles.infoValue}>#{orderId}</span>
            </div>
          )}

          {humanStatus && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Trạng thái:</span>
              <span
                className={styles.infoValue}
                style={{
                  color:
                    humanStatus === "Đặt hàng thành công"
                      ? "#16a34a"
                      : humanStatus === "Đặt hàng thất bại"
                      ? "#dc2626"
                      : "#f59e0b",
                  fontWeight: 600,
                }}
              >
                {humanStatus}
              </span>
            </div>
          )}

          {!orderDetails && amount && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tổng tiền:</span>
              <span className={styles.infoValue}>
                {Number(amount).toLocaleString("vi-VN")}đ
              </span>
            </div>
          )}

          {orderDetails?.orderDate && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ngày đặt:</span>
              <span className={styles.infoValue}>
                {new Date(orderDetails.orderDate).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {orderDetails?.shippingAddress && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Địa chỉ giao hàng:</span>
              <span className={styles.infoValue}>
                {orderDetails.shippingAddress}
              </span>
            </div>
          )}

          {orderDetails?.phoneNumber && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Số điện thoại:</span>
              <span className={styles.infoValue}>
                {orderDetails.phoneNumber}
              </span>
            </div>
          )}

          {orderDetails?.note && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ghi chú:</span>
              <span className={styles.infoValue}>{orderDetails.note}</span>
            </div>
          )}

          {orderDetails?.items && orderDetails.items.length > 0 && (
            <div className={styles.itemsSection}>
              <h3 className={styles.itemsTitle}>
                Sản phẩm ({orderDetails.items.length})
              </h3>
              <div className={styles.itemsList}>
                {orderDetails.items.map((item, idx) => {
                  const originalUnitPrice = item.bookPrice || item.price || 0;
                  const finalUnitPrice = item.price || originalUnitPrice;
                  const hasDiscount = finalUnitPrice < originalUnitPrice;
                  const originalLineTotal = originalUnitPrice * item.quantity;
                  const finalLineTotal = finalUnitPrice * item.quantity;
                  const discountPercent =
                    hasDiscount && originalUnitPrice > 0
                      ? Math.round(
                          ((originalUnitPrice - finalUnitPrice) /
                            originalUnitPrice) *
                            100
                        )
                      : null;
                  const discountLabel =
                    hasDiscount && discountPercent && discountPercent > 0
                      ? `-${discountPercent}%`
                      : hasDiscount
                      ? `-${(originalUnitPrice - finalUnitPrice).toLocaleString(
                          "vi-VN"
                        )}đ`
                      : null;

                  return (
                    <div key={idx} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>
                          {item.bookTitle ||
                            `Sản phẩm #${item.bookId || idx + 1}`}
                        </span>
                        <span className={styles.itemMeta}>
                          Số lượng: {item.quantity} ×{" "}
                          {finalUnitPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className={styles.itemPricing}>
                        <div className={styles.priceRow}>
                          <span className={styles.newPrice}>
                            {finalLineTotal.toLocaleString("vi-VN")}đ
                          </span>

                          {hasDiscount && discountLabel && (
                            <span className={styles.discountBadge}>
                              {discountLabel}
                            </span>
                          )}
                        </div>

                        {hasDiscount && (
                          <span className={styles.oldPrice}>
                            {originalLineTotal.toLocaleString("vi-VN")}đ
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Thông tin thanh toán VNPay */}
          {(paymentId || vnpTxnRef) && (
            <div className={styles.paymentSection}>
              <h3 className={styles.paymentTitle}>Thông tin thanh toán</h3>
              {paymentId && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mã thanh toán:</span>
                  <span className={styles.infoValue}>{paymentId}</span>
                </div>
              )}
              {vnpTxnRef && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mã giao dịch VNPay:</span>
                  <span className={styles.infoValue}>{vnpTxnRef}</span>
                </div>
              )}
            </div>
          )}

          {/* Tóm tắt giá - đặt cuối cùng */}
          {orderDetails?.items && orderDetails.items.length > 0 && (
            <div className={styles.summarySection}>
              <h3 className={styles.summaryTitle}>Tóm tắt đơn hàng</h3>
              {(() => {
                const originalTotal = orderDetails.items.reduce((sum, item) => {
                  const originalPrice = item.bookPrice || item.price || 0;
                  return sum + originalPrice * item.quantity;
                }, 0);

                const totalAfterItemDiscount = orderDetails.items.reduce(
                  (sum, item) => sum + (item.price || 0) * item.quantity,
                  0
                );

                const itemDiscount = originalTotal - totalAfterItemDiscount;

                const promotionDiscount =
                  orderDetails.orderPromotions?.reduce(
                    (sum, promo) => sum + (promo.discountAmount || 0),
                    0
                  ) || 0;
                const effectivePromotionDiscount =
                  promotionDiscount > 0
                    ? promotionDiscount
                    : Math.max(0, storedSummary?.promotionDiscount ?? 0);

                let promotionCode = null;
                if (!orderDetails.orderPromotions && orderDetails.note) {
                  const match = orderDetails.note.match(/Áp dụng mã (\w+)/);
                  if (match) {
                    promotionCode = match[1];
                  }
                } else if (orderDetails.orderPromotions?.[0]?.promotion?.code) {
                  promotionCode =
                    orderDetails.orderPromotions[0].promotion.code;
                }
                const promotionLabel =
                  promotionCode || storedSummary?.promotionCode || null;

                let shippingFee = 0;
                if (orderDetails.service?.price !== undefined) {
                  shippingFee = Number(orderDetails.service.price) || 0;
                } else if (storedSummary?.shippingFee !== undefined) {
                  shippingFee = storedSummary.shippingFee;
                } else {
                  const calculatedTotal =
                    totalAfterItemDiscount - effectivePromotionDiscount;
                  shippingFee =
                    (orderDetails.totalPrice || Number(amount) || 0) -
                    calculatedTotal;
                  shippingFee = Math.max(0, Math.round(shippingFee));
                }

                const orderSubtotalAfterPromo = Math.max(
                  0,
                  totalAfterItemDiscount - effectivePromotionDiscount
                );
                const computedTotal = orderSubtotalAfterPromo + shippingFee;
                const backendTotal =
                  orderDetails.totalPrice || Number(amount) || null;
                const fallbackTotal =
                  storedSummary?.grandTotal ?? computedTotal;
                const finalTotal =
                  backendTotal !== null &&
                  Math.abs(backendTotal - computedTotal) < 100
                    ? backendTotal
                    : fallbackTotal;

                console.log("[ThankYouPage] Pricing breakdown", {
                  originalTotal,
                  totalAfterItemDiscount,
                  itemDiscount,
                  promotionDiscount,
                  effectivePromotionDiscount,
                  promotionLabel,
                  shippingFee,
                  computedTotal,
                  backendTotal,
                  storedSummary,
                  finalTotal,
                });

                return (
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryLine}>
                      <span>Tạm tính</span>
                      <span>{originalTotal.toLocaleString("vi-VN")}đ</span>
                    </div>

                    {itemDiscount > 0 && (
                      <div
                        className={styles.summaryLine}
                        style={{ color: "#e53935" }}
                      >
                        <span>Giảm giá</span>
                        <span>-{itemDiscount.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}

                    {promotionDiscount > 0 && promotionCode && (
                      <div
                        className={styles.summaryLine}
                        style={{ color: "#16a34a" }}
                      >
                        <span>Mã {promotionCode}</span>
                        <span>
                          -{promotionDiscount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    )}

                    {promotionDiscount === 0 &&
                      effectivePromotionDiscount > 0 && (
                        <div
                          className={styles.summaryLine}
                          style={{ color: "#16a34a" }}
                        >
                          <span>Mã {promotionLabel || "khuyến mãi"}</span>
                          <span>
                            -
                            {effectivePromotionDiscount.toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                      )}

                    <div className={styles.summaryLine}>
                      <span>Phí vận chuyển</span>
                      <span>
                        {shippingFee === 0
                          ? "Miễn phí"
                          : `${shippingFee.toLocaleString("vi-VN")}đ`}
                      </span>
                    </div>

                    <div className={styles.summaryTotal}>
                      <span>Tổng cộng</span>
                      <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {loading && (
            <p style={{ textAlign: "center", color: "#666", marginTop: 16 }}>
              Đang tải thông tin đơn hàng...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
