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
  const [updateDetail, setUpdateDetail] = useState(null);
  const [updateDetailLoading, setUpdateDetailLoading] = useState(false);

  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateDetail(null);
  };

  const extractOrderPayload = (raw) => {
    if (!raw) return null;
    const data = raw.data ?? raw;
    return data?.data || data?.order || data?.result || data;
  };

  const fetchOrderDetailData = useCallback(async (orderId) => {
    const res = await axiosClient.get(`/orders/${orderId}/detail`);
    const payload = extractOrderPayload(res);
    if (!payload) throw new Error("Empty detail payload");
    return payload;
  }, []);

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

  const normalizeOrderItems = (data = {}) => {
    const raw =
      data.items ||
      data.books ||
      data.orderItems ||
      data.orderDetails ||
      data.orderItemResponses ||
      [];

    return raw.map((it, idx) => {
      const quantity = Number(it.quantity || 0);
      const unitPrice = Number(
        it.price ?? it.unitPrice ?? it.sellingPrice ?? it.bookPrice ?? 0
      );
      const imageUrl =
        it.bookImageUrl ||
        it.imageUrl ||
        it.coverUrl ||
        it.book?.imageUrl ||
        it.book?.bookDetail?.imageUrl ||
        null;
      return {
        id: it.id || idx,
        bookId: it.bookId,
        bookCode: it.bookCode,
        bookTitle: it.bookTitle || it.title || "S???n ph??cm",
        quantity,
        price: unitPrice,
        imageUrl,
      };
    });
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
        console.log("📋 Orders from API:", res.data);
        console.log("📋 First order ID:", res.data[0]?.id);
        setOrders(mapOrders(res.data));
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn("Fetch orders failed", err);
      setError("Không tải được dữ liệu đơn hàng. Hiện hiển thị dữ liệu mẫu.");
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

  const openUpdate = async (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status === "PENDING" ? "CONFIRMED" : order.status);
    setUpdateModal(true);
    setUpdateDetail(null);
    setUpdateDetailLoading(true);
    try {
      const payload = await fetchOrderDetailData(order.id);
      setUpdateDetail({
        ...payload,
        id: order.displayId || payload.id,
        displayId: order.displayId || payload.id,
      });
    } catch (err) {
      console.warn("Fetch update detail failed", err);
      setUpdateDetail(null);
    } finally {
      setUpdateDetailLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    console.log("🔍 selectedOrder:", selectedOrder);
    console.log("🔍 selectedOrder.id:", selectedOrder.id);
    console.log("🔍 selectedOrder.displayId:", selectedOrder.displayId);
    setActionLoading(true);
    try {
      console.log(
        `📡 Calling PUT /orders/${selectedOrder.id}/status with status: ${newStatus}`
      );
      await axiosClient.put(`/orders/${selectedOrder.id}/status`, {
        status: newStatus.trim().toUpperCase(),
      });
      await fetchOrders();
      closeUpdateModal();
    } catch (err) {
      console.warn("❌ Update status failed", err);
      console.warn("❌ Error response:", err.response);
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
      const payload = await fetchOrderDetailData(order.id);
      setDetailData({
        ...payload,
        id: order.displayId || payload.id,
        displayId: order.displayId || payload.id,
        items: payload.items || [],
      });
    } catch (err) {
      console.warn("Fetch detail failed", err);
      setDetailData({
        id: order.displayId || order.id,
        displayId: order.displayId || order.id,
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
            Điều phối đơn hàng theo trạng thái, phương thức thanh toán và tốc độ
            giao vận.
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
          <div className="metric-value accent-green">{metrics.completed}</div>
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
              {order.total.toLocaleString("vi-VN")} ₫
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
          <div className="modal-card status-modal">
            <div className="status-modal__header">
              <div>
                <p className="status-eyebrow">Cập nhật trạng thái</p>
                <h3>{selectedOrder.displayId}</h3>
                <p className="status-subtext">
                  Chọn trạng thái tiếp theo cho đơn hàng. Hệ thống sẽ lưu ngay
                  khi bạn xác nhận.
                </p>
              </div>
              <button
                className="icon-button"
                onClick={closeUpdateModal}
                disabled={actionLoading}
                aria-label="Dong"
              >
                &times;
              </button>
            </div>

            <div className="status-summary">
              <div className="status-summary__item">
                <span className="label">Trạng thái hiện tại</span>
                <div>{statusBadge(selectedOrder.status)}</div>
              </div>
              <div className="status-summary__item status-summary__meta">
                <span className="label">Giá trị đơn</span>
                <strong className="amount">
                  {selectedOrder.total.toLocaleString("vi-VN")} đ
                </strong>
              </div>
              <div className="status-summary__item status-summary__item--full">
                <span className="label">Thanh toán</span>
                <strong>{paymentLabel(selectedOrder.payment)}</strong>
              </div>
            </div>

            <div className="field-group">
              <p className="field-label">Trạng thái mới</p>
              <div className="select-shell">
                <select
                  className="status-select"
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
              </div>
              <p className="helper-text">
                Ưu tiên xác nhận ngay khi đã chốt thông tin với khách. Chỉ chọn
                CANCELLED khi có yêu cầu rõ ràng.
              </p>
            </div>

            <div className="status-detail-preview">
              {updateDetailLoading && (
                <p className="helper-text">Đang tải thông tin đơn hàng...</p>
              )}
              {!updateDetailLoading &&
                updateDetail &&
                (() => {
                  const updateItems = normalizeOrderItems(updateDetail || {});
                  return (
                    <>
                      <div className="customer-card">
                        <div>
                          <span className="label">Khách hàng</span>
                          <strong>{updateDetail.userFullName || "-"}</strong>
                        </div>
                        <div>
                          <span className="label">Điện thoại</span>
                          <strong>{updateDetail.phoneNumber || "-"}</strong>
                        </div>
                        <div>
                          <span className="label">Địa chỉ</span>
                          <p className="muted">
                            {updateDetail.shippingAddress || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="label">Ghi chú</span>
                          <p className="muted">{updateDetail.note || "-"}</p>
                        </div>
                      </div>
                      <div className="detail-items">
                        <div className="detail-items__header">
                          <strong>Sản phẩm khách đặt</strong>
                          <div className="item-stats">
                            <span className="badge">
                              {updateItems.length} đầu sách
                            </span>
                            <span className="badge badge--accent">
                              {updateItems.reduce(
                                (sum, it) => sum + (it.quantity || 0),
                                0
                              )}{" "}
                              quyển
                            </span>
                          </div>
                        </div>
                        <div className="detail-card-list compact">
                          {updateItems.length === 0 && (
                            <div className="detail-empty">
                              Chưa có sản phẩm.
                            </div>
                          )}
                          {updateItems.map((it) => {
                            const qty = it.quantity || 0;
                            const unit = it.price || 0;
                            const lineTotal = qty * unit;
                            const shortTitle = (it.bookTitle || "Sách")
                              .slice(0, 2)
                              .toUpperCase();
                            return (
                              <div
                                className="detail-card"
                                key={`${it.id}-update`}
                              >
                                <div className="detail-thumb">
                                  {it.imageUrl ? (
                                    <img src={it.imageUrl} alt={it.bookTitle} />
                                  ) : (
                                    <span>{shortTitle}</span>
                                  )}
                                </div>
                                <div className="detail-card__content">
                                  <div className="detail-card__top">
                                    <div>
                                      <p className="detail-card__title">
                                        {it.bookTitle}
                                      </p>
                                      <p className="detail-card__meta">
                                        Mã: {it.bookCode || it.bookId || "-"}
                                      </p>
                                    </div>
                                    <div className="detail-card__price">
                                      {unit.toLocaleString("vi-VN")} ₫
                                    </div>
                                  </div>
                                  <div className="detail-card__bottom">
                                    <span className="pill muted">
                                      SL: {qty}
                                    </span>
                                    <span className="detail-card__line-total">
                                      {lineTotal.toLocaleString("vi-VN")} ₫
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
            </div>

            <div className="modal-actions">
              <button
                className="ghost"
                onClick={closeUpdateModal}
                disabled={actionLoading}
              >
                Bỏ qua
              </button>
              <button
                className="primary"
                onClick={handleUpdate}
                disabled={actionLoading}
              >
                {actionLoading ? "Đang lưu..." : "Lưu cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailModal && (
        <div className="modal-backdrop">
          <div className="modal-card detail-modal-card">
            {detailLoading && <div>Đang tải...</div>}
            {!detailLoading &&
              detailData &&
              (() => {
                // Normalize items từ detailData
                const items = normalizeOrderItems(detailData);
                console.log("Normalized items:", items);
                if (items.length > 0) {
                  console.log("First normalized item:", items[0]);
                  console.log("First item imageUrl:", items[0].imageUrl);
                  console.log(
                    "First item discountPercent:",
                    items[0].discountPercent,
                    "type:",
                    typeof items[0].discountPercent
                  );
                  console.log(
                    "First item discountAmount:",
                    items[0].discountAmount,
                    "type:",
                    typeof items[0].discountAmount
                  );
                  console.log("First item bookPrice:", items[0].bookPrice);
                  console.log(
                    "First item price (order price):",
                    items[0].price
                  );
                }

                const subtotal = items.reduce(
                  (sum, it) => sum + (it.quantity || 0) * (it.price || 0),
                  0
                );
                const shipping = Math.max(
                  (detailData.totalPrice || 0) - subtotal,
                  0
                );
                const total =
                  detailData.totalPrice != null
                    ? detailData.totalPrice
                    : subtotal + shipping;
                const orderDate = detailData.orderDate
                  ? new Date(detailData.orderDate).toLocaleString("vi-VN")
                  : "-";

                // Kiểm tra nếu order có status RETURNED hoặc có history RETURNED
                const isReturnedOrder =
                  detailData.status === "RETURNED" ||
                  (detailData.orderStatusHistories &&
                    detailData.orderStatusHistories.some(
                      (h) =>
                        h.eOrderHistory === "RETURNED" ||
                        h.eOrderHistory === "RETURN"
                    ));

                return (
                  <>
                    <div className="detail-header">
                      <div>
                        <p className="detail-eyebrow">Chi tiết đơn hàng</p>
                        <h3>{detailData.displayId || detailData.id}</h3>
                        <p className="detail-datetime">{orderDate}</p>
                      </div>
                      <div className="detail-header__pill">
                        {statusBadge(detailData.status)}
                      </div>
                    </div>

                    <div className="detail-meta">
                      <div>
                        <span className="label">Khách</span>
                        <strong>{detailData.userFullName || "-"}</strong>
                      </div>
                      <div>
                        <span className="label">Thanh toán</span>
                        <strong>
                          {paymentLabel(detailData.paymentMethod)}
                        </strong>
                      </div>
                      <div>
                        <span className="label">Điện thoại</span>
                        <strong>{detailData.phoneNumber || "-"}</strong>
                      </div>
                      <div>
                        <span className="label">Vận chuyển</span>
                        <strong>{detailData.serviceName || "-"}</strong>
                      </div>
                      <div className="detail-meta__full">
                        <span className="label">Địa chỉ giao</span>
                        <p className="muted">
                          {detailData.shippingAddress || "-"}
                        </p>
                      </div>
                      <div className="detail-meta__full">
                        <span className="label">Ghi chú</span>
                        <p className="muted">{detailData.note || "-"}</p>
                      </div>
                    </div>

                    {/* Hiển thị thông báo nếu order đã được trả */}
                    {isReturnedOrder && (
                      <div
                        style={{
                          marginTop: 16,
                          marginBottom: 16,
                          padding: 12,
                          backgroundColor: "#fef3c7",
                          borderRadius: "8px",
                          border: "1px solid #fde68a",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>⚠️</span>
                        <span
                          style={{
                            color: "#92400e",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          Đơn hàng này đã có sản phẩm được trả. Các sản phẩm còn
                          lại được hiển thị bên dưới.
                        </span>
                      </div>
                    )}

                    <div className="detail-items">
                      <div className="detail-items__header">
                        <strong>
                          {isReturnedOrder
                            ? "Sản phẩm còn lại (đã có sản phẩm trả)"
                            : "Sản phẩm đã đặt"}
                        </strong>
                        <div className="item-stats">
                          <span className="badge">{items.length} đầu sách</span>
                          <span className="badge badge--accent">
                            {items.reduce(
                              (sum, it) => sum + (it.quantity || 0),
                              0
                            )}{" "}
                            quyển
                          </span>
                        </div>
                      </div>

                      <div className="detail-card-list">
                        {items.length === 0 && (
                          <div className="detail-empty">Chưa có sản phẩm.</div>
                        )}
                        {items.map((it) => {
                          const qty = it.quantity || 0;
                          const unit = it.price || 0;
                          const lineTotal = qty * unit;
                          const shortTitle = (it.bookTitle || "Sách")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div className="detail-card" key={it.id}>
                              <div className="detail-thumb">
                                {it.imageUrl ? (
                                  <img src={it.imageUrl} alt={it.bookTitle} />
                                ) : (
                                  <span>{shortTitle}</span>
                                )}
                              </div>
                              <div className="detail-card__content">
                                <div className="detail-card__top">
                                  <div>
                                    <p className="detail-card__title">
                                      {it.bookTitle}
                                    </p>
                                    <p className="detail-card__meta">
                                      Mã: {it.bookCode || it.bookId || "-"}
                                    </p>
                                  </div>
                                  <div className="detail-card__price">
                                    {unit.toLocaleString("vi-VN")} ₫
                                  </div>
                                </div>
                                <div className="detail-card__bottom">
                                  <span className="pill muted">SL: {qty}</span>
                                  <span className="detail-card__line-total">
                                    {lineTotal.toLocaleString("vi-VN")} ₫
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="detail-summary">
                        <div className="detail-summary__row">
                          <span>Tạm tính</span>
                          <span className="amount">
                            {subtotal.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                        <div className="detail-summary__row">
                          <span>Phí vận chuyển</span>
                          <span className="amount">
                            {shipping.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                        <div className="detail-summary__row detail-summary__row--total">
                          <span>Tổng cộng</span>
                          <span className="amount">
                            {total.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
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
