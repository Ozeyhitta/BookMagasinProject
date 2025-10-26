"use client"
import { useState } from "react"
import styles from "./manage-books.module.css"
import { Plus, Edit, Trash2, Pause, Search } from "lucide-react"

export default function ManageBooks() {
  const [books, setBooks] = useState([
    { id: 1, title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", price: 85000, status: "Đang bán" },
    { id: 2, title: "Tuổi trẻ đáng giá bao nhiêu", author: "Rosie Nguyễn", price: 99000, status: "Đang bán" },
    { id: 3, title: "Harry Potter và Hòn đá phù thủy", author: "J.K. Rowling", price: 120000, status: "Ngừng bán" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [newBook, setNewBook] = useState({ title: "", author: "", price: "", status: "Đang bán" })
  const [editBook, setEditBook] = useState(null)

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.price) {
      alert("Vui lòng nhập đầy đủ thông tin sách!")
      return
    }

    setBooks([...books, { ...newBook, id: Date.now(), price: parseInt(newBook.price) }])
    setNewBook({ title: "", author: "", price: "", status: "Đang bán" })
    alert("Thêm sách thành công!")
  }

  const handleEditBook = (book) => {
    setEditBook(book)
  }

  const handleSaveEdit = () => {
    if (!editBook.title || !editBook.author || !editBook.price) {
      alert("Vui lòng nhập đầy đủ thông tin!")
      return
    }

    setBooks(books.map((b) => (b.id === editBook.id ? editBook : b)))
    setEditBook(null)
    alert("Cập nhật thành công!")
  }

  const handlePauseBook = (id) => {
    setBooks(
      books.map((b) =>
        b.id === id ? { ...b, status: b.status === "Đang bán" ? "Ngừng bán" : "Đang bán" } : b
      )
    )
  }

  const handleDeleteBook = (id) => {
    if (confirm("Bạn có chắc muốn xóa sách này?")) {
      setBooks(books.filter((b) => b.id !== id))
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý sách</h2>

      {/* --- TÌM KIẾM --- */}
      <div className={styles.searchSection}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* --- THÊM SÁCH MỚI --- */}
      <div className={styles.addSection}>
        <input
          type="text"
          placeholder="Tên sách"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tác giả"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Giá bán"
          value={newBook.price}
          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
        />
        <button onClick={handleAddBook} className={styles.addButton}>
          <Plus size={16} /> Thêm sách
        </button>
      </div>

      {/* --- DANH SÁCH SÁCH --- */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Giá bán</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.price.toLocaleString()} VND</td>
              <td>
                <span
                  className={`${styles.status} ${
                    book.status === "Đang bán" ? styles.active : styles.paused
                  }`}
                >
                  {book.status}
                </span>
              </td>
              <td className={styles.actionBtns}>
                <button onClick={() => handleEditBook(book)} className={styles.editBtn}>
                  <Edit size={16} />
                </button>
                <button onClick={() => handlePauseBook(book.id)} className={styles.pauseBtn}>
                  <Pause size={16} />
                </button>
                <button onClick={() => handleDeleteBook(book.id)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- FORM CHỈNH SỬA --- */}
      {editBook && (
        <div className={styles.editModal}>
          <div className={styles.modalContent}>
            <h3>Chỉnh sửa thông tin sách</h3>
            <input
              type="text"
              value={editBook.title}
              onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
            />
            <input
              type="text"
              value={editBook.author}
              onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
            />
            <input
              type="number"
              value={editBook.price}
              onChange={(e) => setEditBook({ ...editBook, price: e.target.value })}
            />
            <div className={styles.modalActions}>
              <button onClick={handleSaveEdit} className={styles.saveBtn}>
                Lưu thay đổi
              </button>
              <button onClick={() => setEditBook(null)} className={styles.cancelBtn}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
