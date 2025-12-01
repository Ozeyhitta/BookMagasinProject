"use client";

import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import styles from "./CustomerSupport.module.css";

export default function CustomerSupport() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("OPEN");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/admin/support/requests", {
        params: { status: filter || undefined },
      });
      setRequests(Array.isArray(response.data) ? response.data : []);
      setMessage("");
    } catch (error) {
      console.error("Error fetching requests:", error);
      setMessage("Lỗi tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setReplyText("");
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      setMessage("Vui lòng nhập phản hồi!");
      return;
    }

    if (!selectedRequest) {
      setMessage("Chưa chọn yêu cầu nào!");
      return;
    }

    setSubmitting(true);
    try {
      const staffName = localStorage.getItem("staffName") || "Staff BookMagasin";
      const staffId = parseInt(localStorage.getItem("userId") || "0");

      const response = await axiosClient.put(
        `/admin/support/requests/${selectedRequest.id}/reply`,
        {
          response: replyText,
          staffName,
          staffId: staffId > 0 ? staffId : null,
        }
      );

      setMessage("✓ Phản hồi đã được gửi đến khách hàng qua email!");
      setReplyText("");
      setSelectedRequest(null);
      setTimeout(() => {
        fetchRequests();
      }, 1500);
    } catch (error) {
      console.error("Error sending reply:", error);
      setMessage("Lỗi gửi phản hồi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📧 Quản lý Hỗ trợ Khách hàng</h2>
        <p>Xem và trả lời các yêu cầu hỗ trợ từ khách hàng</p>
      </div>

      <div className={styles.content}>
        {/* Left Panel - List of Requests */}
        <div className={styles.leftPanel}>
          <div className={styles.filterSection}>
            <label>Lọc theo trạng thái:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="OPEN">Chưa xử lý</option>
              <option value="RESOLVED">Đã xử lý</option>
            </select>
          </div>

          {loading ? (
            <div className={styles.loadingState}>Đang tải...</div>
          ) : requests.length === 0 ? (
            <div className={styles.emptyState}>
              Không có yêu cầu nào
            </div>
          ) : (
            <div className={styles.requestsList}>
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`${styles.requestItem} ${
                    selectedRequest?.id === req.id ? styles.active : ""
                  } ${req.status === "RESOLVED" ? styles.resolved : styles.open}`}
                  onClick={() => handleSelectRequest(req)}
                >
                  <div className={styles.requestStatus}>
                    <span className={`${styles.badge} ${styles[req.status.toLowerCase()]}`}>
                      {req.status === "OPEN" ? "Chưa xử lý" : "Đã xử lý"}
                    </span>
                  </div>
                  <div className={styles.requestInfo}>
                    <div className={styles.requestTitle}>{req.issue}</div>
                    <div className={styles.requestEmail}>{req.email}</div>
                    <div className={styles.requestType}>{req.type}</div>
                    <div className={styles.requestDate}>{formatDate(req.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Request Details & Reply Form */}
        <div className={styles.rightPanel}>
          {selectedRequest ? (
            <>
              <div className={styles.detailsHeader}>
                <h3>Chi tiết yêu cầu #{selectedRequest.id}</h3>
                <span className={`${styles.detailsBadge} ${styles[selectedRequest.status.toLowerCase()]}`}>
                  {selectedRequest.status === "OPEN" ? "Chưa xử lý" : "Đã xử lý"}
                </span>
              </div>

              <div className={styles.detailsContent}>
                <div className={styles.detailGroup}>
                  <label>Email khách hàng:</label>
                  <p>{selectedRequest.email}</p>
                </div>

                <div className={styles.detailGroup}>
                  <label>Loại hỗ trợ:</label>
                  <p>{selectedRequest.type}</p>
                </div>

                <div className={styles.detailGroup}>
                  <label>Vấn đề:</label>
                  <p>{selectedRequest.issue}</p>
                </div>

                <div className={styles.detailGroup}>
                  <label>Mô tả chi tiết:</label>
                  <p className={styles.descriptionText}>{selectedRequest.description}</p>
                </div>

                <div className={styles.detailGroup}>
                  <label>Ngày yêu cầu:</label>
                  <p>{formatDate(selectedRequest.createdAt)}</p>
                </div>

                {selectedRequest.staffResponse && (
                  <div className={`${styles.detailGroup} ${styles.staffResponseSection}`}>
                    <label>Phản hồi từ staff:</label>
                    <div className={styles.staffResponseText}>
                      {selectedRequest.staffResponse}
                    </div>
                    <div className={styles.responseBy}>
                      Được xử lý bởi: {selectedRequest.staffName || "Unknown"}
                      {selectedRequest.resolvedAt && (
                        <>
                          <br />
                          Ngày xử lý: {formatDate(selectedRequest.resolvedAt)}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.status === "OPEN" && (
                  <div className={styles.replySection}>
                    <label>Phản hồi của bạn:</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Nhập phản hồi để giải quyết vấn đề của khách hàng..."
                      rows={6}
                    />
                    <button
                      className={styles.btnReply}
                      onClick={handleReply}
                      disabled={submitting}
                    >
                      {submitting ? "Đang gửi..." : "Gửi phản hồi qua email"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.noSelection}>
              <p>👈 Chọn một yêu cầu từ danh sách để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`${styles.notificationMessage} ${message.includes("✓") ? styles.success : styles.error}`}>
          {message}
        </div>
      )}
    </div>
  );
}
