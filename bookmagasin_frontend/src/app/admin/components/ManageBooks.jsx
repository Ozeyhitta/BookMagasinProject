"use client";

import { useEffect, useState } from "react";
import styles from "./manage-books.module.css";
import { Plus, Search, X, Edit2, Trash2, Eye } from "lucide-react";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const emptyBook = {
    title: "",
    sellingPrice: "",
    publicationDate: "",
    edition: "",
    author: "",
    bookDetailId: "",
    categoryIds: [],
    imageUrl: "",
  };

  const [bookForm, setBookForm] = useState(emptyBook);

  // ===================== LOAD BOOKS =====================
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    fetch("http://localhost:8080/api/books")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((b) => ({
          id: b.id,
          title: b.title,
          sellingPrice: b.sellingPrice,
          publicationDate: b.publicationDate?.split("T")[0],
          edition: b.edition,
          author: b.author,
          categories: b.categories?.map((c) => c.name).join(", "),
        }));
        setBooks(mapped);
      });
  };

  // ===================== HANDLE INPUT =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===================== OPEN ADD MODAL =====================
  const openAdd = () => {
    setEditingId(null);
    setBookForm(emptyBook);
    setShowModal(true);
  };

  // ===================== SUBMIT FORM =====================
  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...bookForm,
      sellingPrice: Number(bookForm.sellingPrice),
      edition: Number(bookForm.edition),
    };

    const url = editingId
      ? `http://localhost:8080/api/books/${editingId}`
      : "http://localhost:8080/api/books";

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(() => {
      loadBooks();
      setShowModal(false);
    });
  };

  // ===================== VIEW =====================
  const viewBook = (id) => {
    const b = books.find((x) => x.id === id);
    alert(
      `📘 Thông tin sách:

Tên: ${b.title}
Tác giả: ${b.author}
Giá: ${b.sellingPrice} VND
Ngày xuất bản: ${b.publicationDate}
Lần xuất bản: ${b.edition}
Danh mục: ${b.categories}
`
    );
  };

  // ===================== EDIT =====================
  const handleEdit = (id) => {
    const b = books.find((x) => x.id === id);
    setEditingId(id);

    setBookForm({
      title: b.title,
      sellingPrice: b.sellingPrice,
      publicationDate: b.publicationDate,
      edition: b.edition,
      author: b.author,
      bookDetailId: "",
      categoryIds: [],
      imageUrl: "",
    });

    setShowModal(true);
  };

  // ===================== DELETE =====================
  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc muốn xóa sách này?")) return;

    fetch(`http://localhost:8080/api/books/${id}`, { method: "DELETE" }).then(
      () => loadBooks()
    );
  };

  // ===================== FILTER =====================
  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  // ===================== UI =====================
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <button className={styles.addButton} onClick={openAdd}>
          <Plus size={16} /> Thêm sách
        </button>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            placeholder="Tìm tên sách, tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? "Chỉnh sửa sách" : "Thêm sách mới"}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <label>Tên sách:</label>
              <input
                name="title"
                value={bookForm.title}
                onChange={handleChange}
                required
              />

              <label>Giá (VND):</label>
              <input
                name="sellingPrice"
                type="number"
                value={bookForm.sellingPrice}
                onChange={handleChange}
                required
              />

              <label>Tác giả:</label>
              <input
                name="author"
                value={bookForm.author}
                onChange={handleChange}
                required
              />

              <label>Ngày xuất bản:</label>
              <input
                name="publicationDate"
                type="date"
                value={bookForm.publicationDate}
                onChange={handleChange}
              />

              <label>Lần xuất bản:</label>
              <input
                name="edition"
                type="number"
                value={bookForm.edition}
                onChange={handleChange}
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingId ? "Lưu" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Giá bán</th>
              <th>Ngày XB</th>
              <th>Lần XB</th>
              <th>Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.sellingPrice} VND</td>
                <td>{b.publicationDate}</td>
                <td>{b.edition}</td>
                <td>{b.categories}</td>

                <td className={styles.actions}>
                  <button
                    className={styles.btnView}
                    onClick={() => viewBook(b.id)}
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    className={styles.btnEdit}
                    onClick={() => handleEdit(b.id)}
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    className={styles.btnDelete}
                    onClick={() => handleDelete(b.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
