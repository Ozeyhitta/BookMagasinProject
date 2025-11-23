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
  const [reviewForm, setReviewForm] = useState({
    bookId: null,
    rating: 0,
    comment: "",
    submitting: false,
  });
  const [returnModal, setReturnModal] = useState(false);
  const [returnItem, setReturnItem] = useState(null);
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnReason, setReturnReason] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);
  const [processingReturns, setProcessingReturns] = useState(new Set()); // Track các item đang xử lý trả hàng
  const [returnRequests, setReturnRequests] = useState({}); // Map orderId -> returnRequests
  const [reviewModal, setReviewModal] = useState(false); // Modal riêng cho đánh giá
  const [returnSelectModal, setReturnSelectModal] = useState(false); // Modal riêng để chọn item trả hàng

  const canReviewStatus = (status) => {
    const s = status?.toString().toUpperCase();
    return s === "DELIVERED" || s === "COMPLETED";
  };

  // fetchOrders moved to top-level so other handlers can refresh list
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const res = await fetch(
        `http://localhost:8080/api/orders/users/${userId}`
      );
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

  const fetchReturnRequestsForOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/return-requests/order/${orderId}`
      );
      if (res.ok) {
        const data = await res.json();
        console.log(
          `[fetchReturnRequestsForOrder] Order ${orderId} requests:`,
          data
        );
        return Array.isArray(data) ? data : []; // returnRequests cho orderId
      }
      return [];
    } catch (e) {
      console.error("Error fetching return requests for order", e);
      return [];
    }
  };

  // Fetch return requests for orders
  const fetchReturnRequests = async (orderList = orders) => {
    try {
      const requestsByOrder = {};

      for (const o of orderList) {
        const res = await fetch(
          `http://localhost:8080/api/return-requests/order/${o.id}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log(
            `[fetchReturnRequests] Order ${o.id} return requests:`,
            data
          );
          requestsByOrder[o.id] = Array.isArray(data) ? data : [];
        }
      }

      console.log(
        "[fetchReturnRequests] All return requests by order:",
        requestsByOrder
      );
      setReturnRequests(requestsByOrder);
    } catch (e) {
      console.error("Error fetching return requests", e);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    fetchOrders();

    const onFocus = () => {
      fetchOrders();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [router]);

  // Fetch return requests khi orders thay đổi
  useEffect(() => {
    if (orders.length > 0) {
      fetchReturnRequests(orders);

      // Polling để tự động refresh return requests mỗi 10 giây
      const interval = setInterval(() => {
        fetchReturnRequests(orders);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [orders]);
  useEffect(() => {
    if (selectedOrder) {
      fetchReturnRequestsForOrder(selectedOrder.id).then((reqs) => {
        setReturnRequests((prev) => ({
          ...prev,
          [selectedOrder.id]: reqs,
        }));
      });

      // refresh mỗi 5 giây khi modal đang mở
      const interval = setInterval(() => {
        fetchReturnRequestsForOrder(selectedOrder.id).then((reqs) => {
          setReturnRequests((prev) => ({
            ...prev,
            [selectedOrder.id]: reqs,
          }));
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedOrder]);

  // Cancel order handler
  const cancelOrder = async (order) => {
    if (!order) return;
    const ok = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng?");
    if (!ok) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/${order.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: "CANCELLED" }),
        }
      );
      if (res.ok) {
        alert("Đã hủy đơn hàng");
        // refresh list and update modal if open
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === order.id) {
          setSelectedOrder((s) => ({ ...s, status: "CANCELLED" }));
        }
      } else {
        const text = await res.text();
        alert(text || "Hủy đơn hàng thất bại");
      }
    } catch (e) {
      console.error(e);
      alert("Không thể hủy đơn hàng, thử lại sau");
    }
  };

  // Open return modal for specific item
  const openReturnModal = (order, item) => {
    setSelectedOrder(order);
    setReturnItem(item);
    setReturnQuantity(1);
    setReturnReason("");
    setReturnModal(true);
  };

  // Kiểm tra xem item có đang được xử lý trả hàng không
  const isProcessingReturn = (orderId, itemId) => {
    return processingReturns.has(`${orderId}-${itemId}`);
  };

  // Request return handler - trả sách cụ thể
  const handleReturn = async () => {
    if (!selectedOrder || !returnItem) return;
    if (returnQuantity <= 0 || returnQuantity > returnItem.quantity) {
      alert(`Số lượng không hợp lệ. Tối đa: ${returnItem.quantity}`);
      return;
    }
    if (!returnReason.trim()) {
      alert("Vui lòng nhập lý do trả hàng");
      return;
    }

    const token = localStorage.getItem("token");
    setReturnLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/${selectedOrder.id}/return?orderItemId=${returnItem.id}&quantity=${returnQuantity}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ reason: returnReason.trim() }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        // Đánh dấu item đang được xử lý
        setProcessingReturns((prev) =>
          new Set(prev).add(`${selectedOrder.id}-${returnItem.id}`)
        );
        alert(
          `Đã gửi yêu cầu trả ${returnQuantity} quyển sách "${returnItem.bookTitle}". Nhân viên sẽ xử lý trong thời gian sớm nhất.`
        );
        setReturnModal(false);
        await fetchOrders();
        const updatedReqs = await fetchReturnRequestsForOrder(selectedOrder.id);

        setReturnRequests((prev) => ({
          ...prev,
          [selectedOrder.id]: updatedReqs,
        }));

        // Refresh selected order if modal is open
        if (selectedOrder) {
          const updatedRes = await fetch(
            `http://localhost:8080/api/orders/${selectedOrder.id}/detail`
          );
          if (updatedRes.ok) {
            const updatedData = await updatedRes.json();
            setSelectedOrder(updatedData);
          }
        }
      } else {
        const text = await res.text();
        alert(text || "Trả hàng thất bại");
      }
    } catch (e) {
      console.error(e);
      alert("Không thể trả hàng, thử lại sau");
    } finally {
      setReturnLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    const s = order.status?.toString().toUpperCase() || "";
    if (activeTab === "pending") return s === "PENDING";
    if (activeTab === "completed")
      return s === "DELIVERED" || s === "COMPLETED";
    if (activeTab === "cancelled") return s === "CANCELLED";
    return true;
  });

  const tabs = [
    { id: "all", label: "Tất cả đơn hàng", count: orders.length },
    {
      id: "pending",
      label: "Đang chờ",
      count: orders.filter(
        (o) => o.status?.toString().toUpperCase() === "PENDING"
      ).length,
    },
    {
      id: "completed",
      label: "Hoàn thành",
      count: orders.filter((o) =>
        ["DELIVERED", "COMPLETED"].includes(o.status?.toString().toUpperCase())
      ).length,
    },
    {
      id: "cancelled",
      label: "Đã hủy",
      count: orders.filter(
        (o) => o.status?.toString().toUpperCase() === "CANCELLED"
      ).length,
    },
  ];

  const getStatusColor = (status) => {
    const s = status?.toString().toUpperCase() || "";
    if (s === "PENDING") return "#FF9500";
    if (s === "DELIVERED" || s === "COMPLETED") return "#34C759";
    if (s === "CANCELLED") return "#EF4444";
    if (s === "PROCESSING") return "#007AFF";
    if (s === "RETURNED") return "#f59e0b";
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
      RETURNED: "Yêu cầu trả hàng",
    };
    return map[s] || status;
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return d;
    }
  };
  const formatDateTime = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return d;
    }
  };

  const startReview = (bookId) => {
    setReviewForm({ bookId, rating: 0, comment: "", submitting: false });
  };

  const submitReview = async (bookId) => {
    const { rating, comment } = reviewForm;
    if (!rating) {
      alert("Vui lòng chọn số sao");
      return;
    }
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      alert("Vui lòng đăng nhập");
      router.push("/login");
      return;
    }
    setReviewForm((f) => ({ ...f, submitting: true }));
    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rate: rating,
          content: comment,
          bookId,
          createById: parseInt(userId, 10),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        alert(text || "Gửi đánh giá thất bại");
      } else {
        alert("Đã gửi đánh giá, cảm ơn bạn!");
        setReviewForm({
          bookId: null,
          rating: 0,
          comment: "",
          submitting: false,
        });
      }
    } catch (e) {
      console.error(e);
      alert("Không thể gửi đánh giá, thử lại sau");
    } finally {
      setReviewForm((f) => ({ ...f, submitting: false }));
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ padding: 40, textAlign: "center" }}>Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lịch sử đơn hàng</h1>

      <div className={styles.header}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              }`}
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
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                  Không có đơn hàng
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className={styles.itemName}>ID: #{order.id}</div>
                    <div className={styles.itemQty}>
                      Ngày tạo: {formatDate(order.orderDate)}
                    </div>
                    {order.items?.length > 0 && (
                      <div className={styles.itemQty}>
                        {order.items.length} sản phẩm
                      </div>
                    )}
                  </td>
                  <td>
                    {(() => {
                      // Kiểm tra return requests cho order này
                      const orderReturnRequests =
                        returnRequests[order.id] || [];
                      const hasApprovedReturn = orderReturnRequests.some(
                        (req) => req.status === "APPROVED"
                      );
                      const hasRejectedReturn = orderReturnRequests.some(
                        (req) => req.status === "REJECTED"
                      );
                      const hasPendingReturn = orderReturnRequests.some(
                        (req) => req.status === "PENDING"
                      );

                      // Nếu có return request đã được approve, hiển thị trạng thái đặc biệt
                      if (hasApprovedReturn) {
                        return (
                          <span style={{ color: "#34C759" }}>
                            ✓ Yêu cầu trả hàng đã được chấp nhận
                          </span>
                        );
                      }

                      // Nếu có return request bị reject, hiển thị trạng thái
                      if (hasRejectedReturn && !hasPendingReturn) {
                        return (
                          <span style={{ color: "#EF4444" }}>
                            ✗ Yêu cầu trả hàng bị từ chối
                          </span>
                        );
                      }

                      // Nếu có return request đang pending
                      if (hasPendingReturn) {
                        return (
                          <span style={{ color: "#f59e0b" }}>
                            ⏳ Yêu cầu trả hàng đang chờ duyệt
                          </span>
                        );
                      }

                      // Mặc định hiển thị trạng thái order
                      return (
                        <span style={{ color: getStatusColor(order.status) }}>
                          {getStatusText(order.status)}
                        </span>
                      );
                    })()}
                  </td>
                  <td>{order.totalPrice?.toLocaleString("vi-VN") || "0"}đ</td>
                  <td>
                    <button
                      className={styles.btnDetails}
                      onClick={async () => {
                        setSelectedOrder(order);
                        const reqs = await fetchReturnRequestsForOrder(
                          order.id
                        );

                        setReturnRequests((prev) => ({
                          ...prev,
                          [order.id]: reqs,
                        }));
                      }}
                    >
                      Chi tiết đơn hàng
                    </button>
                  </td>
                  <td>
                    {(() => {
                      const s = order.status?.toString().toUpperCase() || "";
                      // allow cancel only when order is PENDING or PROCESSING
                      const canCancel = ["PENDING", "PROCESSING"].includes(s);
                      // allow return only when order is DELIVERED or COMPLETED
                      const canReturn = ["DELIVERED", "COMPLETED"].includes(s);

                      if (canCancel) {
                        return (
                          <button
                            className={styles.btnCancel}
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelOrder(order);
                            }}
                            title="Hủy đơn"
                          >
                            Hủy
                          </button>
                        );
                      } else if (canReturn) {
                        // Kiểm tra return requests cho order này
                        const orderReturnRequests =
                          returnRequests[order.id] || [];
                        const hasApprovedReturn = orderReturnRequests.some(
                          (req) => req.status === "APPROVED"
                        );
                        const hasRejectedReturn = orderReturnRequests.some(
                          (req) => req.status === "REJECTED"
                        );
                        const hasPendingReturn = orderReturnRequests.some(
                          (req) => req.status === "PENDING"
                        );

                        return (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              className={styles.btnOutline}
                              onClick={async (e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                const reqs = await fetchReturnRequestsForOrder(
                                  order.id
                                );
                                setReturnRequests((prev) => ({
                                  ...prev,
                                  [order.id]: reqs,
                                }));
                                setReviewModal(true);
                              }}
                              title="Đánh giá sản phẩm"
                              style={{ minWidth: "90px" }}
                            >
                              Đánh giá
                            </button>
                            <button
                              className={styles.btnReturn}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (hasPendingReturn || hasApprovedReturn) {
                                  // Nếu đã có return request, mở modal chi tiết để xem
                                  setSelectedOrder(order);
                                  const reqs =
                                    await fetchReturnRequestsForOrder(order.id);
                                  setReturnRequests((prev) => ({
                                    ...prev,
                                    [order.id]: reqs,
                                  }));
                                } else {
                                  // Nếu chưa có return request, mở modal chọn item trả hàng
                                  setSelectedOrder(order);
                                  const reqs =
                                    await fetchReturnRequestsForOrder(order.id);
                                  setReturnRequests((prev) => ({
                                    ...prev,
                                    [order.id]: reqs,
                                  }));
                                  setReturnSelectModal(true);
                                }
                              }}
                              title={
                                hasApprovedReturn
                                  ? "Yêu cầu trả hàng đã được chấp nhận"
                                  : hasRejectedReturn
                                  ? "Yêu cầu trả hàng bị từ chối - Có thể yêu cầu lại"
                                  : hasPendingReturn
                                  ? "Yêu cầu trả hàng đang chờ duyệt"
                                  : "Yêu cầu trả hàng"
                              }
                              disabled={hasPendingReturn || hasApprovedReturn}
                              style={{
                                minWidth: "90px",
                                opacity:
                                  hasPendingReturn || hasApprovedReturn
                                    ? 0.6
                                    : 1,
                                cursor:
                                  hasPendingReturn || hasApprovedReturn
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              {hasPendingReturn
                                ? "Chờ duyệt"
                                : hasApprovedReturn
                                ? "Đã duyệt"
                                : "Trả hàng"}
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <span
                            style={{
                              color: getStatusColor(order.status),
                              fontWeight: 600,
                            }}
                          >
                            {getStatusText(order.status)}
                          </span>
                        );
                      }
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className={styles.modal} onClick={() => setSelectedOrder(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                x
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.orderInfo}>
                <h3>Thông tin đơn hàng</h3>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Mã đơn:</span>
                  <span className={styles.infoValue}>#{selectedOrder.id}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ngày đặt:</span>
                  <span className={styles.infoValue}>
                    {formatDate(selectedOrder.orderDate)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Trạng thái:</span>
                  <span
                    className={styles.infoValue}
                    style={{ color: getStatusColor(selectedOrder.status) }}
                  >
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Tổng:</span>
                  <span className={styles.infoValue}>
                    {selectedOrder.totalPrice?.toLocaleString("vi-VN") || "0"}đ
                  </span>
                </div>
                {selectedOrder.shippingAddress && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Địa chỉ:</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.shippingAddress}
                    </span>
                  </div>
                )}
                {selectedOrder.phoneNumber && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>SĐT:</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.phoneNumber}
                    </span>
                  </div>
                )}
                {selectedOrder.note && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ghi chú:</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.note}
                    </span>
                  </div>
                )}
              </div>

              {selectedOrder.items?.length > 0 && (
                <div className={styles.orderItems}>
                  <h3>Sản phẩm ({selectedOrder.items.length})</h3>
                  <div className={styles.itemsList}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        <div className={styles.itemTop}>
                          <div className={styles.itemTitleLine}>
                            <div className={styles.itemTitle}>
                              {item.bookTitle ||
                                `Sản phẩm #${item.bookId || idx + 1}`}
                            </div>
                            <div className={styles.itemTotal}>
                              {(
                                item.quantity * (item.price || 0)
                              ).toLocaleString("vi-VN")}
                              đ
                            </div>
                          </div>
                          <div className={styles.itemMeta}>
                            Số lượng: {item.quantity} ×{" "}
                            {item.price?.toLocaleString("vi-VN") || "0"}đ
                          </div>
                        </div>

                        {/* Nút trả hàng cho đơn hàng đã hoàn thành */}
                        {canReviewStatus(selectedOrder.status) &&
                          true &&
                          (() => {
                            const orderRequests =
                              returnRequests[selectedOrder.id] || [];
                            const itemRequest = orderRequests.find((req) => {
                              const reqItemId = Number(req.orderItemId);
                              const currentItemId = Number(item.id);
                              const match = reqItemId === currentItemId;
                              if (match) {
                                console.log(
                                  `[Match Found] Item ${item.id} matches return request:`,
                                  req
                                );
                              }
                              return match;
                            });
                            const requestStatus =
                              itemRequest?.status?.toUpperCase();

                            // Debug log
                            console.log(
                              `[Return Status Check] Item ${item.id}:`,
                              {
                                orderId: selectedOrder.id,
                                itemId: item.id,
                                itemIdType: typeof item.id,
                                orderRequestsCount: orderRequests.length,
                                orderRequests: orderRequests.map((r) => ({
                                  id: r.returnRequestId || r.id,
                                  orderItemId: r.orderItemId,
                                  orderItemIdType: typeof r.orderItemId,
                                  status: r.status,
                                  rejectionReason: r.rejectionReason,
                                })),
                                itemRequest: itemRequest,
                                requestStatus: requestStatus,
                                rejectionReason: itemRequest?.rejectionReason,
                              }
                            );

                            // Debug: Log để kiểm tra
                            console.log(
                              `[Return Request Debug] Item ${item.id}:`,
                              {
                                orderId: selectedOrder.id,
                                itemId: item.id,
                                hasItemRequest: !!itemRequest,
                                requestStatus: requestStatus,
                                itemRequest: itemRequest,
                                allOrderRequests: orderRequests,
                                returnRequestsState: returnRequests,
                              }
                            );

                            if (
                              requestStatus === "PENDING" ||
                              requestStatus === "PENDING"
                            ) {
                              return (
                                <div
                                  className={styles.reviewBox}
                                  style={{ marginTop: 8 }}
                                >
                                  <button
                                    className={styles.btnOutline}
                                    disabled
                                    style={{
                                      marginRight: 8,
                                      opacity: 0.6,
                                      cursor: "not-allowed",
                                      backgroundColor: "#fef3c7",
                                      color: "#d97706",
                                      borderColor: "#fde68a",
                                    }}
                                  >
                                    ⏳ Chờ duyệt
                                  </button>
                                  <span
                                    style={{
                                      color: "#d97706",
                                      fontSize: "11px",
                                      marginLeft: 8,
                                      fontStyle: "italic",
                                    }}
                                  >
                                    Yêu cầu trả hàng đang chờ nhân viên xử lý
                                  </span>
                                </div>
                              );
                            }

                            if (isProcessingReturn(selectedOrder.id, item.id)) {
                              return (
                                <div
                                  className={styles.reviewBox}
                                  style={{ marginTop: 8 }}
                                >
                                  <button
                                    className={styles.btnOutline}
                                    disabled
                                    style={{
                                      marginRight: 8,
                                      opacity: 0.6,
                                      cursor: "not-allowed",
                                    }}
                                  >
                                    Đang xử lý
                                  </button>
                                </div>
                              );
                            }

                            if (
                              requestStatus === "APPROVED" ||
                              requestStatus === "REJECTED"
                            ) {
                              console.log(
                                `[Display Status] Showing ${requestStatus} status for item ${item.id}`
                              );
                              return (
                                <div
                                  className={styles.reviewBox}
                                  style={{ marginTop: 8 }}
                                >
                                  <div
                                    style={{
                                      padding: "8px 12px",
                                      borderRadius: "6px",
                                      backgroundColor:
                                        requestStatus === "APPROVED"
                                          ? "#d1fae5"
                                          : "#fee2e2",
                                      border:
                                        requestStatus === "APPROVED"
                                          ? "1px solid #34C759"
                                          : "1px solid #EF4444",
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 4,
                                    }}
                                  >
                                    <span
                                      style={{
                                        color:
                                          requestStatus === "APPROVED"
                                            ? "#34C759"
                                            : "#EF4444",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                      }}
                                    >
                                      {requestStatus === "APPROVED" ? (
                                        <>
                                          <span>✓</span>
                                          <span>
                                            Yêu cầu trả hàng đã được chấp nhận
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span>✗</span>
                                          <span>
                                            Yêu cầu trả hàng bị từ chối
                                          </span>
                                        </>
                                      )}
                                    </span>
                                    {requestStatus === "APPROVED" && (
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "#059669",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        Sản phẩm đã được trả thành công. Số
                                        lượng đã được cập nhật.
                                      </span>
                                    )}
                                    {requestStatus === "REJECTED" &&
                                      itemRequest?.rejectionReason && (
                                        <div
                                          style={{
                                            marginTop: 4,
                                            fontSize: "11px",
                                            color: "#991b1b",
                                            padding: "6px 8px",
                                            backgroundColor: "#fef2f2",
                                            borderRadius: "4px",
                                            border: "1px solid #fecaca",
                                          }}
                                        >
                                          <strong>Lý do từ chối:</strong>{" "}
                                          {itemRequest.rejectionReason}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                className={styles.reviewBox}
                                style={{ marginTop: 8 }}
                              >
                                <button
                                  className={styles.btnOutline}
                                  onClick={() =>
                                    openReturnModal(selectedOrder, item)
                                  }
                                  style={{ marginRight: 8 }}
                                >
                                  Trả hàng
                                </button>
                              </div>
                            );
                          })()}

                        {canReviewStatus(selectedOrder.status) && (
                          <div className={styles.reviewBox}>
                            {reviewForm.bookId === item.bookId ? (
                              <div className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                  <div className={styles.reviewHeader__labels}>
                                    <p className={styles.reviewEyebrow}>
                                      Đánh giá sản phẩm
                                    </p>
                                    <p className={styles.reviewTitle}>
                                      {item.bookTitle}
                                    </p>
                                  </div>
                                  <div className={styles.starSelector}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        className={`${styles.starButton} ${
                                          reviewForm.rating >= star
                                            ? styles.starButtonActive
                                            : ""
                                        }`}
                                        onClick={() =>
                                          setReviewForm((f) => ({
                                            ...f,
                                            rating: star,
                                          }))
                                        }
                                      >
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className={styles.reviewBody}>
                                  <textarea
                                    className={styles.reviewTextarea}
                                    placeholder="Chia sẻ cảm nhận ngắn gọn (chất lượng, gói hàng, thời gian giao)..."
                                    value={reviewForm.comment}
                                    onChange={(e) =>
                                      setReviewForm((f) => ({
                                        ...f,
                                        comment: e.target.value,
                                      }))
                                    }
                                  />
                                  <div className={styles.reviewFooter}>
                                    <span className={styles.reviewHint}>
                                      Lời nhận xét lịch sự giúp shop cải thiện
                                      tốt hơn.
                                    </span>
                                    <div className={styles.reviewActions}>
                                      <button
                                        className={styles.btnGhost}
                                        onClick={() =>
                                          setReviewForm({
                                            bookId: null,
                                            rating: 0,
                                            comment: "",
                                            submitting: false,
                                          })
                                        }
                                        disabled={reviewForm.submitting}
                                      >
                                        Hủy
                                      </button>
                                      <button
                                        className={styles.btnSubmit}
                                        onClick={() =>
                                          submitReview(item.bookId)
                                        }
                                        disabled={reviewForm.submitting}
                                      >
                                        {reviewForm.submitting
                                          ? "Đang gửi..."
                                          : "Gửi đánh giá"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <button
                                className={styles.btnOutline}
                                onClick={() => startReview(item.bookId)}
                              >
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
                      .sort(
                        (a, b) =>
                          new Date(b.statusChangeDate) -
                          new Date(a.statusChangeDate)
                      )
                      .map((history, idx) => (
                        <div
                          key={history.id || idx}
                          className={styles.historyRow}
                        >
                          <div className={styles.historyInfo}>
                            <div className={styles.historyStatus}>
                              {getStatusText(history.eOrderHistory)}
                            </div>
                            <div className={styles.historyDate}>
                              {formatDateTime(history.statusChangeDate)}
                            </div>
                          </div>
                          <div
                            className={styles.historyBadge}
                            style={{
                              backgroundColor: getStatusColor(
                                history.eOrderHistory
                              ),
                            }}
                          >
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

      {/* Modal đánh giá sản phẩm */}
      {reviewModal && selectedOrder && (
        <div className={styles.modal} onClick={() => setReviewModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px" }}
          >
            <div className={styles.modalHeader}>
              <h2>Đánh giá sản phẩm - Đơn hàng #{selectedOrder.id}</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setReviewModal(false)}
              >
                x
              </button>
            </div>

            <div className={styles.modalBody}>
              {selectedOrder.items?.length > 0 ? (
                <div className={styles.orderItems}>
                  <h3>Chọn sản phẩm để đánh giá</h3>
                  <div className={styles.itemsList}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        <div className={styles.itemTop}>
                          <div className={styles.itemTitleLine}>
                            <div className={styles.itemTitle}>
                              {item.bookTitle ||
                                `Sản phẩm #${item.bookId || idx + 1}`}
                            </div>
                            <div className={styles.itemTotal}>
                              {(
                                item.quantity * (item.price || 0)
                              ).toLocaleString("vi-VN")}
                              đ
                            </div>
                          </div>
                          <div className={styles.itemMeta}>
                            Số lượng: {item.quantity} ×{" "}
                            {item.price?.toLocaleString("vi-VN") || "0"}đ
                          </div>
                        </div>

                        {canReviewStatus(selectedOrder.status) && (
                          <div className={styles.reviewBox}>
                            {reviewForm.bookId === item.bookId ? (
                              <div className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                  <div className={styles.reviewHeader__labels}>
                                    <p className={styles.reviewEyebrow}>
                                      Đánh giá sản phẩm
                                    </p>
                                    <p className={styles.reviewTitle}>
                                      {item.bookTitle}
                                    </p>
                                  </div>
                                  <div className={styles.starSelector}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        className={`${styles.starButton} ${
                                          reviewForm.rating >= star
                                            ? styles.starButtonActive
                                            : ""
                                        }`}
                                        onClick={() =>
                                          setReviewForm((f) => ({
                                            ...f,
                                            rating: star,
                                          }))
                                        }
                                      >
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className={styles.reviewBody}>
                                  <textarea
                                    className={styles.reviewTextarea}
                                    placeholder="Chia sẻ cảm nhận ngắn gọn (chất lượng, gói hàng, thời gian giao)..."
                                    value={reviewForm.comment}
                                    onChange={(e) =>
                                      setReviewForm((f) => ({
                                        ...f,
                                        comment: e.target.value,
                                      }))
                                    }
                                  />
                                  <div className={styles.reviewFooter}>
                                    <span className={styles.reviewHint}>
                                      Lời nhận xét lịch sự giúp shop cải thiện
                                      tốt hơn.
                                    </span>
                                    <div className={styles.reviewActions}>
                                      <button
                                        className={styles.btnGhost}
                                        onClick={() =>
                                          setReviewForm({
                                            bookId: null,
                                            rating: 0,
                                            comment: "",
                                            submitting: false,
                                          })
                                        }
                                        disabled={reviewForm.submitting}
                                      >
                                        Hủy
                                      </button>
                                      <button
                                        className={styles.btnSubmit}
                                        onClick={() => {
                                          submitReview(item.bookId);
                                          setReviewModal(false);
                                        }}
                                        disabled={reviewForm.submitting}
                                      >
                                        {reviewForm.submitting
                                          ? "Đang gửi..."
                                          : "Gửi đánh giá"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <button
                                className={styles.btnOutline}
                                onClick={() => startReview(item.bookId)}
                              >
                                Đánh giá
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ textAlign: "center", padding: 40 }}>
                  Không có sản phẩm để đánh giá
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal chọn item trả hàng */}
      {returnSelectModal && selectedOrder && (
        <div
          className={styles.modal}
          onClick={() => setReturnSelectModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px" }}
          >
            <div className={styles.modalHeader}>
              <h2>Chọn sản phẩm cần trả - Đơn hàng #{selectedOrder.id}</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setReturnSelectModal(false)}
              >
                x
              </button>
            </div>

            <div className={styles.modalBody}>
              {selectedOrder.items?.length > 0 ? (
                <div className={styles.orderItems}>
                  <h3>Chọn sản phẩm muốn trả</h3>
                  <div className={styles.itemsList}>
                    {selectedOrder.items.map((item, idx) => {
                      const orderRequests =
                        returnRequests[selectedOrder.id] || [];
                      const itemRequest = orderRequests.find(
                        (req) => Number(req.orderItemId) === Number(item.id)
                      );
                      const hasReturnRequest = !!itemRequest;

                      return (
                        <div key={idx} className={styles.itemRow}>
                          <div className={styles.itemTop}>
                            <div className={styles.itemTitleLine}>
                              <div className={styles.itemTitle}>
                                {item.bookTitle ||
                                  `Sản phẩm #${item.bookId || idx + 1}`}
                              </div>
                              <div className={styles.itemTotal}>
                                {(
                                  item.quantity * (item.price || 0)
                                ).toLocaleString("vi-VN")}
                                đ
                              </div>
                            </div>
                            <div className={styles.itemMeta}>
                              Số lượng: {item.quantity} ×{" "}
                              {item.price?.toLocaleString("vi-VN") || "0"}đ
                            </div>
                          </div>

                          {canReviewStatus(selectedOrder.status) &&
                            item.quantity > 0 && (
                              <div className={styles.reviewBox}>
                                {hasReturnRequest ? (
                                  <div
                                    style={{
                                      padding: "8px 12px",
                                      borderRadius: "6px",
                                      backgroundColor:
                                        itemRequest.status === "APPROVED"
                                          ? "#d1fae5"
                                          : itemRequest.status === "REJECTED"
                                          ? "#fee2e2"
                                          : "#fef3c7",
                                      border:
                                        itemRequest.status === "APPROVED"
                                          ? "1px solid #34C759"
                                          : itemRequest.status === "REJECTED"
                                          ? "1px solid #EF4444"
                                          : "1px solid #f59e0b",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color:
                                          itemRequest.status === "APPROVED"
                                            ? "#34C759"
                                            : itemRequest.status === "REJECTED"
                                            ? "#EF4444"
                                            : "#f59e0b",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {itemRequest.status === "APPROVED"
                                        ? "✓ Đã được duyệt"
                                        : itemRequest.status === "REJECTED"
                                        ? "✗ Đã bị từ chối"
                                        : "⏳ Chờ duyệt"}
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    className={styles.btnReturn}
                                    onClick={() => {
                                      openReturnModal(selectedOrder, item);
                                      setReturnSelectModal(false);
                                    }}
                                    style={{ minWidth: "100px" }}
                                  >
                                    Trả hàng
                                  </button>
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p style={{ textAlign: "center", padding: 40 }}>
                  Không có sản phẩm để trả
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal trả hàng */}
      {returnModal && selectedOrder && returnItem && (
        <div
          className={styles.modal}
          onClick={() => !returnLoading && setReturnModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Trả sách</h2>
              <button
                className={styles.closeBtn}
                onClick={() => !returnLoading && setReturnModal(false)}
              >
                x
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.orderInfo}>
                <h3>Thông tin sản phẩm</h3>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Tên sách:</span>
                  <span className={styles.infoValue}>
                    {returnItem.bookTitle}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Số lượng hiện có:</span>
                  <span className={styles.infoValue}>
                    {returnItem.quantity} quyển
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Giá mỗi quyển:</span>
                  <span className={styles.infoValue}>
                    {returnItem.price?.toLocaleString("vi-VN") || "0"}đ
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Đơn hàng:</span>
                  <span className={styles.infoValue}>#{selectedOrder.id}</span>
                </div>
              </div>

              <div className={styles.orderInfo} style={{ marginTop: 20 }}>
                <h3>Số lượng muốn trả</h3>
                <div style={{ marginTop: 12 }}>
                  <input
                    type="number"
                    min="1"
                    max={returnItem.quantity}
                    value={returnQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setReturnQuantity(
                        Math.min(Math.max(1, val), returnItem.quantity)
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "16px",
                    }}
                  />
                  <p
                    style={{ marginTop: 8, color: "#6b7280", fontSize: "14px" }}
                  >
                    Nhập số lượng sách muốn trả (tối đa: {returnItem.quantity}{" "}
                    quyển)
                  </p>
                </div>
              </div>

              <div className={styles.orderInfo} style={{ marginTop: 20 }}>
                <h3>Lý do trả hàng</h3>
                <div style={{ marginTop: 12 }}>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Vui lòng nhập lý do trả hàng (ví dụ: Sách bị hỏng, không đúng sản phẩm, ...)"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "14px",
                      minHeight: "100px",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    required
                  />
                  <p
                    style={{ marginTop: 8, color: "#6b7280", fontSize: "14px" }}
                  >
                    Lý do trả hàng là bắt buộc
                  </p>
                </div>
              </div>

              <div className={styles.modalActions} style={{ marginTop: 24 }}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setReturnModal(false)}
                  disabled={returnLoading}
                >
                  Hủy
                </button>
                <button
                  className={styles.saveBtn}
                  onClick={handleReturn}
                  disabled={returnLoading}
                >
                  {returnLoading ? "Đang xử lý..." : "Xác nhận trả hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
