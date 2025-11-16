"use client"

import { useState, useEffect } from "react"
import styles from "./orderhistory.module.css"
import { useRouter } from "next/navigation"

export default function OrderHistory() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Fetch orders từ API
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      try {
        console.log("Fetching orders for userId:", userId);
        const res = await fetch(
          `http://localhost:8080/api/orders/users/${userId}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log("Orders fetched:", data);
          console.log("Number of orders:", data?.length || 0);
          setOrders(data || []);
        } else {
          const errorText = await res.text();
          console.error("Failed to fetch orders:", res.status, errorText);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    
    // Refresh orders khi window focus lại (để đảm bảo lấy được order mới khi quay lại từ trang khác)
    const handleFocus = () => {
      fetchOrders();
    };
    
    window.addEventListener("focus", handleFocus);
    
    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  // Filter orders theo tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    const status = order.status?.toString().toUpperCase() || "";
    if (activeTab === "pending") return status === "PENDING";
    if (activeTab === "completed") return status === "DELIVERED";
    if (activeTab === "cancelled") return status === "CANCELLED";
    return true;
  });

  // Đếm số lượng orders theo status
  const tabs = [
    { 
      id: "all", 
      label: "Tất cả đơn hàng", 
      count: orders.length 
    },
    { 
      id: "pending", 
      label: "Đang chờ", 
      count: orders.filter(o => o.status?.toString().toUpperCase() === "PENDING").length 
    },
    { 
      id: "completed", 
      label: "Hoàn thành", 
      count: orders.filter(o => o.status?.toString().toUpperCase() === "DELIVERED").length 
    },
    { 
      id: "cancelled", 
      label: "Đã hủy", 
      count: orders.filter(o => o.status?.toString().toUpperCase() === "CANCELLED").length 
    },
  ]

  const getStatusColor = (status) => {
    const statusStr = status?.toString().toUpperCase() || "";
    if (statusStr === "PENDING") return "#FF9500";
    if (statusStr === "DELIVERED" || statusStr === "COMPLETED") return "#34C759";
    if (statusStr === "CANCELLED") return "#EF4444";
    if (statusStr === "PROCESSING") return "#007AFF";
    return "#999";
  }

  const getStatusText = (status) => {
    const statusStr = status?.toString() || "";
    const statusMap = {
      "PENDING": "Đang chờ",
      "PROCESSING": "Đang xử lý",
      "SHIPPED": "Đang giao",
      "DELIVERED": "Đã giao",
      "COMPLETED": "Hoàn thành",
      "CANCELLED": "Đã hủy",
      "RETURNED": "Đã trả"
    };
    return statusMap[statusStr.toUpperCase()] || statusStr;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        // Refresh orders
        const userId = localStorage.getItem("userId");
        const refreshRes = await fetch(
          `http://localhost:8080/api/orders/users/${userId}`
        );
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setOrders(data || []);
        }
      } else {
        alert("Không thể hủy đơn hàng!");
      }
    } catch (err) {
      console.error("Error canceling order:", err);
      alert("Lỗi khi hủy đơn hàng!");
    }
  }

  const handlePayOrder = async (orderId) => {
    if (!confirm("Bạn có chắc chắn muốn thanh toán đơn hàng này?")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      
      if (res.ok) {
        alert("Thanh toán thành công!");
        // Refresh orders
        const userId = localStorage.getItem("userId");
        const refreshRes = await fetch(
          `http://localhost:8080/api/orders/users/${userId}`
        );
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setOrders(data || []);
        }
      } else {
        const errorText = await res.text();
        console.error("Error paying order:", errorText);
        alert("Không thể thanh toán đơn hàng!");
      }
    } catch (err) {
      console.error("Error paying order:", err);
      alert("Lỗi khi thanh toán đơn hàng!");
    }
  }

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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                  {activeTab === "all" 
                    ? "Chưa có đơn hàng nào" 
                    : `Chưa có đơn hàng ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}`}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className={styles.itemCell}>
                      <div>
                        <div className={styles.itemName}>ID: #{order.id}</div>
                        <div className={styles.itemQty}>
                          Ngày tạo: {formatDate(order.orderDate)}
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className={styles.itemQty}>
                            {order.items.length} sản phẩm
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.status} style={{ color: getStatusColor(order.status) }}>
                      {getStatusText(order.status)}
                    </div>
                  </td>
                  <td>
                    {order.totalPrice?.toLocaleString("vi-VN") || "0"}đ
                  </td>
                  <td>
                    <button 
                      className={styles.btnDetails}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Chi tiết đơn hàng
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {order.status?.toString().toUpperCase() === "PENDING" && (
                        <>
                          <button 
                            className={styles.btnPay} 
                            onClick={() => handlePayOrder(order.id)} 
                            title="Thanh toán đơn hàng"
                          >
                            Thanh toán
                          </button>
                          <button 
                            className={styles.btnCancel} 
                            onClick={() => handleCancelOrder(order.id)} 
                            title="Hủy đơn hàng"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div 
          className={styles.modal} 
          onClick={() => setSelectedOrder(null)}
        >
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
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* THÔNG TIN ĐƠN HÀNG */}
              <div className={styles.orderInfo}>
                <h3>Thông tin đơn hàng</h3>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Mã đơn hàng:</span>
                  <span className={styles.infoValue}>#{selectedOrder.id}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ngày đặt:</span>
                  <span className={styles.infoValue}>{formatDate(selectedOrder.orderDate)}</span>
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
                  <span className={styles.infoLabel}>Tổng tiền:</span>
                  <span className={styles.infoValue}>
                    {selectedOrder.totalPrice?.toLocaleString("vi-VN") || "0"}đ
                  </span>
                </div>
                {selectedOrder.shippingAddress && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Địa chỉ giao hàng:</span>
                    <span className={styles.infoValue}>{selectedOrder.shippingAddress}</span>
                  </div>
                )}
                {selectedOrder.phoneNumber && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Số điện thoại:</span>
                    <span className={styles.infoValue}>{selectedOrder.phoneNumber}</span>
                  </div>
                )}
                {selectedOrder.note && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ghi chú:</span>
                    <span className={styles.infoValue}>{selectedOrder.note}</span>
                  </div>
                )}
              </div>

              {/* DANH SÁCH SẢN PHẨM */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className={styles.orderItems}>
                  <h3>Sản phẩm ({selectedOrder.items.length})</h3>
                  <div className={styles.itemsList}>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className={styles.itemRow}>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemTitle}>
                            {item.bookTitle || `Sản phẩm #${item.bookId || index + 1}`}
                          </div>
                          <div className={styles.itemMeta}>
                            Số lượng: {item.quantity} × {item.price?.toLocaleString("vi-VN") || "0"}đ
                          </div>
                        </div>
                        <div className={styles.itemTotal}>
                          {(item.quantity * (item.price || 0)).toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LỊCH SỬ TRẠNG THÁI ĐƠN HÀNG */}
              {selectedOrder.orderStatusHistories && selectedOrder.orderStatusHistories.length > 0 && (
                <div className={styles.orderStatusHistory}>
                  <h3>Lịch sử trạng thái đơn hàng</h3>
                  <div className={styles.historyList}>
                    {selectedOrder.orderStatusHistories
                      .sort((a, b) => new Date(b.statusChangeDate) - new Date(a.statusChangeDate))
                      .map((history, index) => (
                        <div key={history.id || index} className={styles.historyRow}>
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
                            style={{ backgroundColor: getStatusColor(history.eOrderHistory) }}
                          >
                            {history.eOrderHistory || history.eOrderHistory?.toString() || "N/A"}
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
  )
}
