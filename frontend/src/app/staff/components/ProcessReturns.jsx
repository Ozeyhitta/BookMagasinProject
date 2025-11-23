"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import axiosClient from "../../../utils/axiosClient";

const statusOptions = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function ProcessReturns() {
  const [returnRequests, setReturnRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const statusBadge = (status) => {
    const map = {
      PENDING: "pill pending",
      APPROVED: "pill completed",
      REJECTED: "pill cancelled",
    };
    return <span className={map[status] || "pill"}>{status}</span>;
  };

  const fetchReturnRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }
      const res = await axiosClient.get("/return-requests", { params });
      if (Array.isArray(res.data)) {
        setReturnRequests(res.data);
      } else {
        setReturnRequests([]);
      }
    } catch (err) {
      console.error("Fetch return requests failed", err);
      setError("Không tải được dữ liệu yêu cầu trả hàng.");
      setReturnRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchReturnRequests();
  }, [fetchReturnRequests]);

  const metrics = useMemo(() => {
    const total = returnRequests.length;
    const pending = returnRequests.filter((r) => r.status === "PENDING").length;
    const approved = returnRequests.filter(
      (r) => r.status === "APPROVED"
    ).length;
    const rejected = returnRequests.filter(
      (r) => r.status === "REJECTED"
    ).length;
    return { total, pending, approved, rejected };
  }, [returnRequests]);

  const filteredRequests = useMemo(() => {
    return returnRequests
      .filter((request) => {
        if (statusFilter === "ALL") return true;
        return request.status === statusFilter;
      })
      .filter((request) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          request.orderDisplayId?.toLowerCase().includes(q) ||
          request.bookTitle?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.requestDate) - new Date(a.requestDate);
        }
        return 0;
      });
  }, [returnRequests, statusFilter, search, sortBy]);

  const handleApprove = async (requestId) => {
    if (!requestId) {
      alert("Không tìm thấy ID yêu cầu trả hàng");
      return;
    }

    const staffId = parseInt(localStorage.getItem("userId") || "0");
    if (!staffId) {
      alert("Không tìm thấy thông tin staff");
      return;
    }

    setActionLoading(true);
    try {
      await axiosClient.put(`/return-requests/${requestId}/approve`, {
        staffId,
      });
      alert("Đã duyệt yêu cầu trả hàng");
      await fetchReturnRequests();
    } catch (err) {
      console.error("Approve failed", err);
      alert(
        err.response?.data?.message || err.response?.data || "Duyệt thất bại"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    const staffId = parseInt(localStorage.getItem("userId") || "0");
    if (!staffId) {
      alert("Không tìm thấy thông tin staff");
      return;
    }

    const requestId = selectedRequest.returnRequestId || selectedRequest.id;
    if (!requestId) {
      alert("Không tìm thấy ID yêu cầu trả hàng");
      return;
    }

    setActionLoading(true);
    try {
      await axiosClient.put(`/return-requests/${requestId}/reject`, {
        staffId,
        rejectionReason: rejectionReason.trim(),
      });
      alert("Đã từ chối yêu cầu trả hàng");
      setRejectModal(false);
      await fetchReturnRequests();
    } catch (err) {
      console.error("Reject failed", err);
      alert(
        err.response?.data?.message || err.response?.data || "Từ chối thất bại"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="process-shell">
      {error && <div className="error-banner">{error}</div>}
      {loading && (
        <div className="loading-banner">Đang tải yêu cầu trả hàng...</div>
      )}

      <div className="process-header">
        <div>
          <h1>Process Returns</h1>
          <p>
            Xử lý các yêu cầu trả hàng từ khách hàng. Xác nhận và cập nhật trạng
            thái đơn hàng.
          </p>
        </div>
        <div className="tagline">Return management • Staff workspace</div>
      </div>

      <div className="process-metrics">
        <div className="metric-card">
          <div className="metric-label">Tổng yêu cầu</div>
          <div className="metric-value">{metrics.total}</div>
          <div className="metric-sub">Tất cả trạng thái</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Chờ xử lý</div>
          <div className="metric-value accent-yellow">{metrics.pending}</div>
          <div className="metric-sub">Yêu cầu trả hàng</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Đã duyệt</div>
          <div className="metric-value accent-green">{metrics.approved}</div>
          <div className="metric-sub">Đã chấp nhận</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Đã từ chối</div>
          <div className="metric-value accent-red">{metrics.rejected}</div>
          <div className="metric-sub">Đã từ chối</div>
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
                {s === "ALL"
                  ? "Tất cả"
                  : s === "PENDING"
                  ? "Chờ xử lý"
                  : s === "APPROVED"
                  ? "Đã duyệt"
                  : s === "REJECTED"
                  ? "Đã từ chối"
                  : s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group grow">
          <label>Tìm yêu cầu</label>
          <input
            placeholder="Tìm theo mã đơn hoặc tên sách..."
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
          <span>Tên sách</span>
          <span>Số lượng</span>
          <span>Lý do</span>
          <span>Trạng thái</span>
          <span>Ngày yêu cầu</span>
          <span className="align-right">Thao tác</span>
        </div>
        {filteredRequests.map((request) => {
          const requestId = request.returnRequestId || request.id;
          return (
            <div className="table-row" key={requestId}>
              <span className="code">{request.orderDisplayId}</span>
              <span className="customer">{request.bookTitle}</span>
              <span className="muted">{request.quantity} quyển</span>
              <span
                className="muted"
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {request.reason || "-"}
              </span>
              <span>{statusBadge(request.status)}</span>
              <span className="muted">
                {request.requestDate
                  ? new Date(request.requestDate).toLocaleString("vi-VN")
                  : "-"}
              </span>
              <span className="align-right action-group">
                {request.status === "PENDING" && (
                  <>
                    <button
                      className="ghost"
                      onClick={() => handleApprove(requestId)}
                      disabled={actionLoading}
                    >
                      Duyệt
                    </button>
                    <button
                      className="primary"
                      onClick={() => openRejectModal(request)}
                      disabled={actionLoading}
                    >
                      Từ chối
                    </button>
                  </>
                )}
                {request.status !== "PENDING" && (
                  <span className="muted" style={{ fontSize: "12px" }}>
                    {request.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
                  </span>
                )}
              </span>
            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="empty-state">
            Không tìm thấy yêu cầu trả hàng phù hợp.
          </div>
        )}
      </div>

      {rejectModal && selectedRequest && (
        <div className="modal-backdrop">
          <div className="modal-card status-modal">
            <div className="status-modal__header">
              <div>
                <p className="status-eyebrow">Từ chối yêu cầu trả hàng</p>
                <h3>{selectedRequest.orderDisplayId}</h3>
                <p className="status-subtext">
                  Sách: {selectedRequest.bookTitle} - Số lượng:{" "}
                  {selectedRequest.quantity} quyển
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => setRejectModal(false)}
                disabled={actionLoading}
                aria-label="Đóng"
              >
                &times;
              </button>
            </div>

            <div className="status-summary">
              <div className="status-summary__item">
                <span className="label">Lý do khách hàng</span>
                <div style={{ maxHeight: "100px", overflow: "auto" }}>
                  {selectedRequest.reason || "-"}
                </div>
              </div>
            </div>

            <div className="field-group">
              <p className="field-label">Lý do từ chối *</p>
              <div className="select-shell">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối yêu cầu trả hàng..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "14px",
                    minHeight: "100px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  required
                />
              </div>
              <p className="helper-text">
                Lý do từ chối là bắt buộc và sẽ được gửi cho khách hàng.
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="ghost"
                onClick={() => setRejectModal(false)}
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button
                className="primary"
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
