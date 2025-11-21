"use client";

import { useEffect, useState } from "react";
import "../staff.css"; // giữ nguyên đường dẫn css của bạn

export default function ViewReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setError("");
        setLoading(true);

        // 🔹 Đọc TẤT CẢ review (không dùng /latest nữa)
        const res = await fetch("http://localhost:8080/api/reviews");

        if (!res.ok) {
          throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Reviews from API:", data); // 👀 xem trong console
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message || "Không lấy được danh sách đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleString("vi-VN");
  };

  return (
    <div className="staff-card">
      <h1 className="staff-title">BOOK REVIEWS</h1>
      <p className="staff-subtitle">
        Danh sách các đánh giá sách mới nhất từ khách hàng.
      </p>

      {loading && (
        <p className="staff-loading">Đang tải danh sách đánh giá...</p>
      )}

      {!loading && error && (
        <p className="staff-error">Có lỗi khi tải dữ liệu: {error}</p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="staff-empty">Chưa có đánh giá nào.</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <div>
                  <div className="review-book">
                    {r.book?.title || "Không rõ tên sách"}
                  </div>
                  <div className="review-meta">
                    <span className="review-user">
                      {r.createBy?.fullName || "Khách ẩn danh"}
                    </span>
                    <span className="review-dot">•</span>
                    <span className="review-date">{formatDate(r.createAt)}</span>
                  </div>
                </div>

                <div className="review-rating">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx < r.rate ? "star star-filled" : "star star-empty"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="review-rate-number">{r.rate}/5</span>
                </div>
              </div>

              <p className="review-content">{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
