"use client";

import { useEffect, useState } from "react";
import "../staff.css";
import axiosClient from "../../../utils/axiosClient";

export default function ViewReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosClient.get("/reviews");
        const payload = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setReviews(payload);
      } catch (err) {
        console.warn("Fetch reviews failed:", err);
        setError("Khong the tai danh sach danh gia. Vui long kiem tra backend.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleString("vi-VN");
  };

  return (
    <div className="staff-card">
      <h1 className="staff-title">BOOK REVIEWS</h1>
      <p className="staff-subtitle">
        Danh sach cac danh gia sach gan day nhat tu khach hang.
      </p>

      {loading && <p className="staff-loading">Dang tai danh sach danh gia...</p>}
      {!loading && error && <p className="staff-error">{error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className="staff-empty">Chua co danh gia nao.</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div>
                  <div className="review-book">{review.book?.title || "Khong ro ten sach"}</div>
                  <div className="review-meta">
                    <span className="review-user">
                      {review.createBy?.fullName || "Khach vang danh"}
                    </span>
                    <span className="review-dot">-</span>
                    <span className="review-date">{formatDate(review.createAt)}</span>
                  </div>
                </div>

                <div className="review-rating">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={idx < review.rate ? "star star-filled" : "star star-empty"}
                    >
                      *
                    </span>
                  ))}
                  <span className="review-rate-number">{review.rate}/5</span>
                </div>
              </div>

              <p className="review-content">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
