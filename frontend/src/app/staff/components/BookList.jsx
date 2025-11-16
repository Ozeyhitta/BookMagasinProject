"use client";
import React, { useState, useEffect } from "react";

export default function BookList() {
  const [categories, setCategories] = useState([]); // Lấy từ API
  const [books, setBooks] = useState([]); // Lấy từ API
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState(null);

  // 🟣 Fetch dữ liệu từ backend khi load trang
  useEffect(() => {
    fetch("http://localhost:8080/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);

        // Rút ra danh sách categories từ API
        const catList = new Set();
        data.forEach((b) => {
          b.categories?.forEach((c) => catList.add(c.name));
        });

        const finalCategories = [...catList];
        setCategories(finalCategories);

        if (finalCategories.length > 0) {
          setSelectedCategory(finalCategories[0]);
        }
      })
      .catch((err) => console.error("Load books failed:", err));
  }, []);

  // 🟣 Lọc sách theo category được chọn
  const filteredBooks = books.filter((b) =>
    b.categories?.some((c) => c.name === selectedCategory)
  );

  // 🟣 Sắp xếp theo giá
  const sortedBooks = [...filteredBooks].sort((a, b) =>
    sortOrder === "asc" ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
  );

  return (
    <div className="info-card">
      <h1>BOOK LIST</h1>
      <p className="subtext">
        Danh sách các cuốn sách được phân loại theo từng danh mục.
      </p>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="select-group">
          <label>Danh mục:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.length === 0 ? (
              <option>Đang tải...</option>
            ) : (
              categories.map((cat, idx) => (
                <option key={idx}>{cat}</option>
              ))
            )}
          </select>
        </div>

        <div className="select-group">
          <label>Sắp xếp theo giá:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>

      {/* GRID SÁCH */}
      {sortedBooks.length === 0 ? (
        <div className="empty-message">Không có sách trong danh mục này</div>
      ) : (
        <div className="book-grid">
          {sortedBooks.map((book, index) => (
            <div
              key={index}
              className="book-card"
              onClick={() => setSelectedBook(book)}
            >
              <h3>{book.title}</h3>
              <p className="author">Tác giả: {book.author}</p>
              <p className="price">{book.sellingPrice.toLocaleString()}₫</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {selectedBook && (
        <div className="book-modal" onClick={() => setSelectedBook(null)}>
          <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBook.title}</h2>
            <p><strong>Tác giả:</strong> {selectedBook.author}</p>
            <p>
              <strong>Giá:</strong>{" "}
              {selectedBook.sellingPrice.toLocaleString()}₫
            </p>

            {selectedBook.bookDetail && (
              <>
                <p><strong>Nhà xuất bản:</strong> {selectedBook.bookDetail.publisher}</p>
                <p><strong>Số trang:</strong> {selectedBook.bookDetail.pages}</p>
                <p><strong>Mô tả:</strong> {selectedBook.bookDetail.description}</p>
              </>
            )}

            <button onClick={() => setSelectedBook(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
