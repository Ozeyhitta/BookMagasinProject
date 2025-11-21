"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./orderhistory.module.css";

export default function OrderHistory() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ bookId: null, rating: 0, comment: "", submitting: false });

  const canReviewStatus = (status) => {
    const s = status?.toString().toUpperCase();
    return s === "DELIVERED" || s === "COMPLETED";
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/orders/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const onFocus = () => fetchOrders();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [router]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    const s = order.status?.toString().toUpperCase() || "";
    if (activeTab === "pending") return s === "PENDING";
    if (activeTab === "completed") return s === "DELIVERED" || s === "COMPLETED";
    if (activeTab === "cancelled") return s === "CANCELLED";
    return true;
  });

  const tabs = [
    { id: "all", label: "Tất cả đơn hàng", count: orders.length },
    { id: "pending", label: "Đang chờ", count: orders.filter(o => o.status?.toString().toUpperCase() === "PENDING").length },
    { id: "completed", label: "Hoàn thành", count: orders.filter(o => ["DELIVERED","COMPLETED"].includes(o.status?.toString().toUpperCase())).length },
    { id: "cancelled", label: "Đã hủy", count: orders.filter(o => o.status?.toString().toUpperCase() === "CANCELLED").length },
  ];

  const getStatusColor = (status) => {
    const s = status?.toString().toUpperCase() || "";
    if (s === "PENDING") return "#FF9500";
    if (s === "DELIVERED" || s === "COMPLETED") return "#34C759";
    if (s === "CANCELLED") return "#EF4444";
    if (s === "PROCESSING") return "#007AFF";
    return "#999";
  };

  const getStatusText = (status) => {
    const s = status?.toString().toUpperCase() || "";
    const map = {
      PENDING: "Đang chờ",
      PROCESSING: "Đang xử lý",
      SHIPPED: "Đang giao",
      DELIVERED: "Đã giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
      RETURNED: "Đã trả",
    };
    return map[s] || status;
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
    } catch { return d; }
  };
  const formatDateTime = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  const startReview = (bookId) => {
    setReviewForm({ bookId, rating: 0, comment: "", submitting: false });
  };

  const submitReview = async (bookId) => {
    const { rating, comment } = reviewForm;
    if (!rating) { alert("Vui lòng chọn số sao"); return; }
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) { alert("Vui lòng đăng nhập"); router.push("/login"); return; }
    setReviewForm((f) => ({ ...f, submitting: true }));
    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rate: rating, content: comment, bookId, createById: parseInt(userId, 10) }),
      });
      if (!res.ok) {
        const text = await res.text();
        alert(text || "Gửi đánh giá thất bại");
      } else {
        alert("Đã gửi đánh giá, cảm ơn bạn!");
        setReviewForm({ bookId: null, rating: 0, comment: "", submitting: false });
      }
    } catch (e) {
      console.error(e);
      alert("Không thể gửi đánh giá, thử lại sau");
    } finally {
      setReviewForm((f) => ({ ...f, submitting: false }));
    }
  };

  if (loading) {
    return <div className={styles.container}><p style={{ padding: 40, textAlign: "center" }}>Đang tải đơn hàng...</p></div>;
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
              {tab.label} ({tab.count})
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
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: 40 }}>Không có đơn hàng</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className={styles.itemName}>ID: #{order.id}</div>
                    <div className={styles.itemQty}>Ngày tạo: {formatDate(order.orderDate)}</div>
                    {order.items?.length > 0 && <div className={styles.itemQty}>{order.items.length} sản phẩm</div>}
                  </td>
                  <td><span style={{ color: getStatusColor(order.status) }}>{getStatusText(order.status)}</span></td>
                  <td>{order.totalPrice?.toLocaleString("vi-VN") || "0"}đ</td>
                  <td>
                    <button className={styles.btnDetails} onClick={() => setSelectedOrder(order)}>
                      Chi tiết đơn hàng
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className={styles.modal} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>x</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.orderInfo}>
                <h3>Thông tin đơn hàng</h3>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Mã đơn:</span><span className={styles.infoValue}>#{selectedOrder.id}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Ngày đặt:</span><span className={styles.infoValue}>{formatDate(selectedOrder.orderDate)}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Trạng thái:</span><span className={styles.infoValue} style={{ color: getStatusColor(selectedOrder.status) }}>{getStatusText(selectedOrder.status)}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Tổng:</span><span className={styles.infoValue}>{selectedOrder.totalPrice?.toLocaleString("vi-VN") || "0"}đ</span></div>
                {selectedOrder.shippingAddress && <div className={styles.infoRow}><span className={styles.infoLabel}>Địa chỉ:</span><span className={styles.infoValue}>{selectedOrder.shippingAddress}</span></div>}
                {selectedOrder.phoneNumber && <div className={styles.infoRow}><span className={styles.infoLabel}>SĐT:</span><span className={styles.infoValue}>{selectedOrder.phoneNumber}</span></div>}
                {selectedOrder.note && <div className={styles.infoRow}><span className={styles.infoLabel}>Ghi chú:</span><span className={styles.infoValue}>{selectedOrder.note}</span></div>}
              </div>

              {selectedOrder.items?.length > 0 && (
                <div className={styles.orderItems}>
                  <h3>Sản phẩm ({selectedOrder.items.length})</h3>
                  <div className={styles.itemsList}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemTitle}>{item.bookTitle || `Sản phẩm #${item.bookId || idx + 1}`}</div>
                          <div className={styles.itemMeta}>Số lượng: {item.quantity} × {item.price?.toLocaleString("vi-VN") || "0"}đ</div>
                        </div>
                        <div className={styles.itemTotal}>
                          {(item.quantity * (item.price || 0)).toLocaleString("vi-VN")}đ
                        </div>
                        {canReviewStatus(selectedOrder.status) && (
                          <div className={styles.reviewBox}>
                            {reviewForm.bookId === item.bookId ? (
                              <div className={styles.reviewForm}>
                                <div className={styles.starSelector}>
                                  {[1,2,3,4,5].map((star) => (
                                    <span
                                      key={star}
                                      className={reviewForm.rating >= star ? styles.starFilled : styles.starEmpty}
                                      onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                                    >★</span>
                                  ))}
                                </div>
                                <textarea
                                  className={styles.reviewTextarea}
                                  placeholder="Chia sẻ cảm nhận về sản phẩm"
                                  value={reviewForm.comment}
                                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                                />
                                <div className={styles.reviewActions}>
                                  <button
                                    className={styles.btnCancel}
                                    onClick={() => setReviewForm({ bookId: null, rating: 0, comment: "", submitting: false })}
                                    disabled={reviewForm.submitting}
                                  >Hủy</button>
                                  <button
                                    className={styles.btnSubmit}
                                    onClick={() => submitReview(item.bookId)}
                                    disabled={reviewForm.submitting}
                                  >{reviewForm.submitting ? "Đang gửi..." : "Gửi đánh giá"}</button>
                                </div>
                              </div>
                            ) : (
                              <button className={styles.btnOutline} onClick={() => startReview(item.bookId)}>
                                Đánh giá
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.orderStatusHistories?.length > 0 && (
                <div className={styles.orderStatusHistory}>
                  <h3>Lịch sử trạng thái đơn hàng</h3>
                  <div className={styles.historyList}>
                    {selectedOrder.orderStatusHistories
                      .sort((a,b) => new Date(b.statusChangeDate) - new Date(a.statusChangeDate))
                      .map((history, idx) => (
                        <div key={history.id || idx} className={styles.historyRow}>
                          <div className={styles.historyInfo}>
                            <div className={styles.historyStatus}>{getStatusText(history.eOrderHistory)}</div>
                            <div className={styles.historyDate}>{formatDateTime(history.statusChangeDate)}</div>
                          </div>
                          <div className={styles.historyBadge} style={{ backgroundColor: getStatusColor(history.eOrderHistory) }}>
                            {history.eOrderHistory}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
