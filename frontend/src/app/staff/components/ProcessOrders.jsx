"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import axiosClient from "../../../utils/axiosClient";

const MOCK_ORDERS = [
  {
    id: 1024,
    displayId: "ORD-1024",
    customer: "Nguyen Yen A",
    total: 380000,
    status: "PENDING",
    payment: "COD",
    service: "Giao hàng tiêu chuẩn",
    createdAt: "2024-11-20 08:30",
  },
];

const statusOptions = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "INPROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const paymentOptions = ["ALL", "COD", "BANK_TRANSFER"];

export default function ProcessOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [updateModal, setUpdateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("CONFIRMED");
  const [actionLoading, setActionLoading] = useState(false);

  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const paymentLabel = (payment) => {
    if (payment === "BANK_TRANSFER") return "Banking";
    if (payment === "COD") return "COD";
    return payment || "-";
  };

  const statusBadge = (status) => {
    const map = {
      PENDING: "pill pending",
      CONFIRMED: "pill confirmed",
      INPROGRESS: "pill progress",
      COMPLETED: "pill completed",
      CANCELLED: "pill cancelled",
    };
    return <span className={map[status] || "pill"}>{status}</span>;
  };

  const mapOrders = (list) =>
    list.map((o) => ({
      id: o.id,
      displayId: `ORD-${String(o.id).padStart(4, "0")}`,
      customer: o.userFullName || "Khách",
      total: o.totalPrice || 0,
      status: o.status || "PENDING",
      payment: o.paymentMethod || "UNKNOWN",
      service: o.serviceName || "",
      createdAt: o.orderDate
        ? new Date(o.orderDate).toLocaleString("vi-VN")
        : "",
    }));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/orders/manage", {
        params: {
          status: statusFilter,
          payment: paymentFilter,
          q: search,
          sort: sortBy,
        },
      });
      if (Array.isArray(res.data) && res.data.length) {
        setOrders(mapOrders(res.data));
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch orders failed", err);
      setError("Không tải được dữ liệu đơn hàng. Hiển thị dữ liệu mẫu.");
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter, search, sortBy]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const inProgress = orders.filter((o) => o.status === "INPROGRESS").length;
    const completed = orders.filter((o) => o.status === "COMPLETED").length;
    return { total, pending, inProgress, completed };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) =>
        statusFilter === "ALL" ? true : order.status === statusFilter
      )
      .filter((order) =>
        paymentFilter === "ALL" ? true : order.payment === paymentFilter
      )
      .filter((order) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          order.displayId.toLowerCase().includes(q) ||
          order.customer.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "amount-desc") {
          return b.total - a.total;
        }
        if (sortBy === "amount-asc") {
          return a.total - b.total;
        }
        return 0;
      });
  }, [orders, statusFilter, paymentFilter, search, sortBy]);

  const openUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status === "PENDING" ? "CONFIRMED" : order.status);
    setUpdateModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    try {
      await axiosClient.put(`/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });
      await fetchOrders();
      setUpdateModal(false);
    } catch (err) {
      console.error("Update status failed", err);
      alert("Cập nhật thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const openDetail = async (order) => {
    setDetailModal(true);
    setDetailData(null);
    setDetailLoading(true);
    try {
      const res = await axiosClient.get(`/orders/${order.id}/detail`);
      if (res.data) {
        setDetailData(res.data);
      } else {
        throw new Error("Empty detail");
      }
    } catch (err) {
      console.error("Fetch detail failed", err);
      setDetailData({
        id: order.displayId || order.id,
        userFullName: order.customer || "",
        status: order.status,
        paymentMethod: order.payment,
        serviceName: order.service,
        totalPrice: order.total,
        orderDate: order.createdAt,
        note: order.note || "",
        items: [],
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="process-shell">
      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-banner">Đang tải đơn hàng...</div>}

      <div className="process-header">
        <div>
          <h1>Process Orders</h1>
          <p>
            Điều phối đơn hàng theo trạng thái, phương thức thanh toán và tốc
            độ giao vận.
          </p>
        </div>
        <div className="tagline">Live operations • Staff workspace</div>
      </div>

      <div className="process-metrics">
        <div className="metric-card">
          <div className="metric-label">Tổng đơn</div>
          <div className="metric-value">{metrics.total}</div>
          <div className="metric-sub">Tất cả trạng thái</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Chờ xử lý</div>
          <div className="metric-value accent-yellow">{metrics.pending}</div>
          <div className="metric-sub">Cần xác nhận</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Đang vận chuyển</div>
          <div className="metric-value accent-blue">{metrics.inProgress}</div>
          <div className="metric-sub">Đang trên đường</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Hoàn tất</div>
          <div className="metric-value accent-green">
            {metrics.completed}
          </div>
          <div className="metric-sub">Giao thành công</div>
        </div>
      </div>

      <div className="process-filters">
        <div className="filter-group">
          <label>Trạng thái</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "Tất cả" : s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Thanh toán</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            {paymentOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "Tất cả" : s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group grow">
          <label>Tìm đơn / khách</label>
          <input
            placeholder="Tìm theo mã đơn hoặc tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sắp xếp</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Mới nhất</option>
            <option value="amount-desc">Giá trị cao dần</option>
            <option value="amount-asc">Giá trị thấp dần</option>
          </select>
        </div>
      </div>

      <div className="process-table">
        <div className="table-head">
          <span>Mã đơn</span>
          <span>Khách hàng</span>
          <span>Thanh toán</span>
          <span>Vận chuyển</span>
          <span>Trạng thái</span>
          <span>Tổng</span>
          <span>Thời gian</span>
          <span className="align-right">Thao tác</span>
        </div>
        {filteredOrders.map((order) => (
          <div className="table-row" key={order.id}>
            <span className="code">{order.displayId}</span>
            <span className="customer">{order.customer}</span>
            <span className="muted">{paymentLabel(order.payment)}</span>
            <span className="muted">{order.service}</span>
            <span>{statusBadge(order.status)}</span>
            <span className="amount">
              {order.total.toLocaleString("vi-VN")}đ
            </span>
            <span className="muted">{order.createdAt}</span>
            <span className="align-right action-group">
              <button className="ghost" onClick={() => openDetail(order)}>
                Chi tiết
              </button>
              <button className="primary" onClick={() => openUpdate(order)}>
                Cập nhật
              </button>
            </span>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="empty-state">Không tìm thấy đơn hàng phù hợp.</div>
        )}
      </div>

      {updateModal && selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Cập nhật trạng thái {selectedOrder.displayId}</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions
                .filter((s) => s !== "ALL")
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
            <div className="modal-actions">
              <button
                className="ghost"
                onClick={() => setUpdateModal(false)}
                disabled={actionLoading}
              >
                Huỷ
              </button>
              <button
                className="primary"
                onClick={handleUpdate}
                disabled={actionLoading}
              >
                {actionLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Chi tiết đơn hàng</h3>
            {detailLoading && <div>Đang tải...</div>}
            {!detailLoading && detailData && (
              <div className="detail-grid">
                <div>
                  <strong>Mã đơn:</strong> {detailData.id}
                </div>
                <div>
                  <strong>Khách:</strong> {detailData.userFullName}
                </div>
                <div>
                  <strong>Trạng thái:</strong> {detailData.status}
                </div>
                <div>
                  <strong>Thanh toán:</strong> {detailData.paymentMethod}
                </div>
                <div>
                  <strong>Vận chuyển:</strong> {detailData.serviceName}
                </div>
                <div>
                  <strong>Tổng:</strong>{" "}
                  {(detailData.totalPrice || 0).toLocaleString("vi-VN")}đ
                </div>
                <div>
                  <strong>Thời gian:</strong>{" "}
                  {detailData.orderDate
                    ? new Date(detailData.orderDate).toLocaleString("vi-VN")
                    : "-"}
                </div>
                <div>
                  <strong>Ghi chú:</strong> {detailData.note || "-"}
                </div>
                {detailData.items && detailData.items.length > 0 && (
                  <div className="detail-items">
                    <strong>Sản phẩm:</strong>
                    <ul>
                      {detailData.items.map((it) => (
                        <li key={it.id}>
                          {it.bookTitle} x {it.quantity} –{" "}
                          {(it.price || 0).toLocaleString("vi-VN")}đ
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="modal-actions">
              <button className="primary" onClick={() => setDetailModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
