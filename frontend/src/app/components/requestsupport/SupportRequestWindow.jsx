"use client";

import { useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import "./requestsupport.css";

export default function SupportRequestWindow({ onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    type: "",
    issue: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supportTypes = [
    "Đơn hàng",
    "Sản phẩm",
    "Thanh toán",
    "Giao hàng",
    "Tài khoản",
    "Khác",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.type || !formData.issue || !formData.description) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axiosClient.post("/support/requests", formData);
      setMessage("✓ Yêu cầu hỗ trợ của bạn đã được gửi. Staff sẽ trả lời sớm!");
      setFormData({
        email: "",
        type: "",
        issue: "",
        description: "",
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Lỗi gửi yêu cầu. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supportOverlay">
      <div className="supportWindow">
        <div className="supportHeader">
          <h2>Yêu cầu hỗ trợ</h2>
          <button
            className="supportClose"
            onClick={onClose}
            aria-label="Đóng cửa sổ hỗ trợ"
          >
            ×
          </button>
        </div>

        <form className="supportForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="email">Email của bạn *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="type">Loại hỗ trợ *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn loại hỗ trợ --</option>
              {supportTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="issue">Vấn đề *</label>
            <input
              type="text"
              id="issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              placeholder="Mô tả vấn đề ngắn gọn"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="description">Mô tả chi tiết *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết vấn đề của bạn..."
              rows={5}
              required
            />
          </div>

          {message && (
            <div
              className={`message ${
                message.includes("✓") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="formActions">
            <button
              type="button"
              className="btnCancel"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btnSubmit"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
