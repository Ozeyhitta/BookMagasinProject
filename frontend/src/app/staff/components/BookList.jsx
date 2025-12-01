"use client";

import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

const BookDetailModal = ({ book, onClose }) => {
  if (!book) return null;

  const detail = book.bookDetail || {};
  const categories = book.categories?.map((c) => c.name).join(", ") || "Chua cap nhat";

  return (
    <div className="book-modal" onClick={onClose}>
      <div className="book-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="book-modal-header">
          <div>
            <p className="book-modal-eyebrow">Chi tiet sach</p>
            <h2>{book.title}</h2>
          </div>
          <button className="book-modal-close" onClick={onClose} aria-label="Dong chi tiet sach">
            &times;
          </button>
        </div>

        <div className="book-meta-grid">
          <div>
            <p className="book-detail-label">Tac gia</p>
            <p className="book-detail-value">{book.author || "Dang cap nhat"}</p>
          </div>
          <div>
            <p className="book-detail-label">Gia ban</p>
            <p className="book-detail-value">
              {book.sellingPrice?.toLocaleString("vi-VN")} VND
            </p>
          </div>
          <div>
            <p className="book-detail-label">Danh muc</p>
            <p className="book-detail-value">{categories}</p>
          </div>
          {detail.publisher && (
            <div>
              <p className="book-detail-label">Nha xuat ban</p>
              <p className="book-detail-value">{detail.publisher}</p>
            </div>
          )}
          {detail.pages && (
            <div>
              <p className="book-detail-label">So trang</p>
              <p className="book-detail-value">{detail.pages}</p>
            </div>
          )}
          {detail.language && (
            <div>
              <p className="book-detail-label">Ngon ngu</p>
              <p className="book-detail-value">{detail.language}</p>
            </div>
          )}
        </div>

        {detail.description && (
          <div className="book-description-block">
            <p className="book-detail-label">Mo ta</p>
            <p className="book-detail-description">{detail.description}</p>
          </div>
        )}

        <div className="book-modal-actions">
          <button className="book-modal-closeBtn" onClick={onClose}>
            Dong
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BookList() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosClient.get("/books");
        const payload = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setBooks(payload);

        const catSet = new Set();
        payload.forEach((book) => book.categories?.forEach((c) => catSet.add(c.name)));
        const finalCategories = [...catSet];
        setCategories(finalCategories);
        if (finalCategories.length > 0) {
          setSelectedCategory(finalCategories[0]);
        }
      } catch (err) {
        console.warn("Load books failed:", err);
        setError("Khong the tai danh sach sach. Vui long kiem tra backend.");
        setBooks([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!selectedCategory) return books;
    return books.filter((book) =>
      book.categories?.some((cat) => cat.name === selectedCategory)
    );
  }, [books, selectedCategory]);

  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) =>
      sortOrder === "asc" ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
    );
  }, [filteredBooks, sortOrder]);

  return (
    <div className="info-card">
      <h1>BOOK LIST</h1>
      <p className="subtext">
        Danh sach cac cuon sach duoc phan loai theo danh muc va sap xep theo gia.
      </p>

      {loading && <p className="staff-loading">Dang tai danh sach sach...</p>}
      {!loading && error && <p className="staff-error">{error}</p>}

      <div className="filter-bar">
        <div className="select-group">
          <label>Danh muc:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={categories.length === 0}
          >
            {categories.length === 0 ? (
              <option>Khong co danh muc</option>
            ) : (
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="select-group">
          <label>Sap xep theo gia:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Tang dan</option>
            <option value="desc">Giam dan</option>
          </select>
        </div>
      </div>

      {sortedBooks.length === 0 && !loading && !error && (
        <div className="empty-message">Khong co sach phu hop.</div>
      )}

      {sortedBooks.length > 0 && (
        <div className="book-grid">
          {sortedBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => setSelectedBook(book)}
            >
              <h3>{book.title}</h3>
              <p className="author">Tac gia: {book.author}</p>
              <p className="price">{book.sellingPrice.toLocaleString("vi-VN")} VND</p>
            </div>
          ))}
        </div>
      )}

      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}
