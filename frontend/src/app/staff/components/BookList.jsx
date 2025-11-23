"use client";

import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

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

      {selectedBook && (
        <div className="book-modal" onClick={() => setSelectedBook(null)}>
          <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBook.title}</h2>
            <p>
              <strong>Tac gia:</strong> {selectedBook.author}
            </p>
            <p>
              <strong>Gia:</strong> {selectedBook.sellingPrice.toLocaleString("vi-VN")} VND
            </p>

            {selectedBook.bookDetail && (
              <>
                <p>
                  <strong>Nha xuat ban:</strong> {selectedBook.bookDetail.publisher}
                </p>
                <p>
                  <strong>So trang:</strong> {selectedBook.bookDetail.pages}
                </p>
                <p>
                  <strong>Mo ta:</strong> {selectedBook.bookDetail.description}
                </p>
              </>
            )}

            <button onClick={() => setSelectedBook(null)}>Dong</button>
          </div>
        </div>
      )}
    </div>
  );
}
