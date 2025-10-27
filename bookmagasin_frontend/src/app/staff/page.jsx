"use client";
import React, { useState } from "react";
import { LayoutDashboard, Bell, List, Type } from "lucide-react";
import "./staff.css";

export default function StaffPage() {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Information Management" },
    { icon: <Bell size={20} />, label: "View notifications" },
    { icon: <List size={20} />, label: "View book list" },
    { icon: <Type size={20} />, label: "Process Orders" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="staff-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">CREATIVE TIM</div>

        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="upgrade-section">
          <button className="upgrade-btn">UPGRADE TO PRO</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="staff-content">
        {activeIndex === 0 && <InformationManagement />}
        {activeIndex === 1 && <ViewNotifications />}
        {activeIndex === 2 && <BookList />}
        {activeIndex === 3 && <ProcessOrders />}
      </main>
    </div>
  );
}

/* ----- Component 1: Information Management ----- */
function InformationManagement() {
  return (
    <div className="info-card">
      <h1>INFORMATION MANAGEMENT</h1>
      <p className="subtext">
        Trang cho phép bạn xem và cập nhật thông tin cá nhân trong hệ thống.
      </p>

      <form className="info-form">
        <label>Họ và tên</label>
        <input type="text" defaultValue="Nguyễn Văn An" />

        <label>Email</label>
        <input type="email" defaultValue="staff@example.com" />

        <label>Số điện thoại</label>
        <input type="text" defaultValue="0912345678" />

        <label>Mật khẩu</label>
        <input type="password" defaultValue="123456" />

        <div className="button-group">
          <button type="submit" className="save-btn">💾 Lưu</button>
          <button type="button" className="cancel-btn">❌ Hủy</button>
        </div>
      </form>
    </div>
  );
}

/* ----- Component 2: View Notifications ----- */
function ViewNotifications() {
  const notifications = {
    customer: [
      "Khách hàng Nguyễn A đã đặt hàng thành công.",
      "Đơn hàng #1234 đã được giao.",
      "Có chương trình khuyến mãi mới cho tháng 11.",
      "Phản hồi mới từ khách hàng về sản phẩm.",
    ],
    staff: [
      "Có đơn hàng mới cần xử lý.",
      "Yêu cầu hỗ trợ từ khách hàng Trần B.",
      "Có đánh giá sản phẩm mới cần duyệt.",
      "Cập nhật thông tin hệ thống định kỳ.",
    ],
    admin: [
      "Sản phẩm Sách Java cơ bản sắp hết hàng.",
      "Báo cáo tài chính tháng 10 đã sẵn sàng.",
      "Thông báo họp quản lý nhân viên ngày 30/10.",
    ],
  };

  const [readStatus, setReadStatus] = useState({});

  const handleClick = (key) => {
    setReadStatus((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="info-card">
      <h1>STAFF NOTIFICATIONS</h1>
      <p className="subtext">Danh sách các thông báo quan trọng của hệ thống.</p>

      {Object.entries(notifications).map(([section, messages]) => (
        <div key={section} className="notification-section">
          <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
          <ul>
            {messages.map((msg, i) => (
              <li
                key={`${section}-${i}`}
                onClick={() => handleClick(`${section}-${i}`)}
                className={readStatus[`${section}-${i}`] ? "read-item" : "unread-item"}
              >
                <span
                  className={`dot ${readStatus[`${section}-${i}`] ? "read" : "unread"}`}
                ></span>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ----- Component 3: Book List ----- */
function BookList() {
  const categories = ["Lập trình", "Kinh tế", "Văn học", "Tâm lý học"];
  const books = {
    "Lập trình": [
      { title: "Python cơ bản", author: "Nguyễn Văn A", price: 120000 },
      { title: "Lập trình Web với React", author: "Trần Thị B", price: 180000 },
      { title: "Học Java trong 24 giờ", author: "Phạm Văn C", price: 99000 },
    ],
    "Kinh tế": [
      { title: "Tư duy kinh tế học", author: "Nguyễn Duy Khoa", price: 135000 },
      { title: "Cha giàu cha nghèo", author: "Robert Kiyosaki", price: 150000 },
    ],
    "Văn học": [],
    "Tâm lý học": [ 
      { title: "Đắc nhân tâm", author: "Dale Carnegie", price: 89000 },
      { title: "Tâm lý học đám đông", author: "Gustave Le Bon", price: 110000 },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState("Lập trình");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState(null);

  const categoryBooks = books[selectedCategory] || [];
  const sortedBooks = [...categoryBooks].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  return (
    <div className="info-card">
      <h1>BOOK LIST</h1>
      <p className="subtext">
        Danh sách các cuốn sách được phân loại theo từng danh mục.
      </p>

      <div className="filter-bar">
        <div className="select-group">
          <label>Danh mục:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
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

      {sortedBooks.length === 0 ? (
        <div className="empty-message">Danh mục trống</div>
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
              <p className="price">{book.price.toLocaleString()}₫</p>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <div className="book-modal" onClick={() => setSelectedBook(null)}>
          <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBook.title}</h2>
            <p><strong>Tác giả:</strong> {selectedBook.author}</p>
            <p><strong>Giá:</strong> {selectedBook.price.toLocaleString()}₫</p>
            <p>
              Đây là cuốn sách trong danh mục <b>{selectedCategory}</b>.
            </p>
            <button onClick={() => setSelectedBook(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----- Component 4: Process Orders ----- */
function ProcessOrders() {
  return (
    <div className="info-card">
      <h1>PROCESS ORDERS</h1>
      <p className="subtext">Trang xử lý đơn hàng cho nhân viên.</p>
    </div>
  );
}
