"use client";

import { useEffect, useState } from "react";
import styles from "./manage-books.module.css";
import {
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  Eye,
  BadgePercent,
} from "lucide-react";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [bookPendingDelete, setBookPendingDelete] = useState(null);
  const [discountBook, setDiscountBook] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [discountSubmitting, setDiscountSubmitting] = useState(false);
  const [discountMethod, setDiscountMethod] = useState("percent");

  const createEmptyBook = () => ({
    title: "",
    sellingPrice: "",
    publicationDate: "",
    edition: "",
    author: "",
    bookDetailId: "",
    categoryIds: [],
    imageUrl: "",
    bookDetail: {
      id: "",
      publisher: "",
      supplier: "",
      pages: "",
      description: "",
      imageUrl: "",
      length: "",
      width: "",
      height: "",
      weight: "",
    },
  });

  const [bookForm, setBookForm] = useState(createEmptyBook());
  const initialDiscountForm = {
    discountPercent: "",
    discountAmount: "",
    startDate: "",
    endDate: "",
  };
  const [discountForm, setDiscountForm] = useState(initialDiscountForm);

  // ===================== LOAD BOOKS =====================
  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  useEffect(() => {
    if (
      showModal ||
      showCategoryModal ||
      showDeleteModal ||
      showDiscountModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, showCategoryModal, showDeleteModal, showDiscountModal]);

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
          categoryNames: b.categories?.map((c) => c.name).join(", ") || "",
          categoryIds: b.categories?.map((c) => c.id) || [],
          bookDetail: b.bookDetail || null,
        }));
        setBooks(mapped);
      });
  };

  // ===================== HANDLE INPUT =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({
      ...prev,
      bookDetail: {
        ...prev.bookDetail,
        [name]: value,
      },
    }));
  };

  const toggleCategory = (categoryId) => {
    setBookForm((prev) => {
      const exists = prev.categoryIds?.includes(categoryId);
      const categoryIds = exists
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...(prev.categoryIds || []), categoryId];
      return { ...prev, categoryIds };
    });
  };

  const handleDiscountChange = (e) => {
    const { name, value } = e.target;
    setDiscountForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateTime = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19);
  };

  const loadDiscountsByBook = (bookId) => {
    fetch(`http://localhost:8080/api/book-discounts/book/${bookId}`)
      .then((res) => res.json())
      .then((data) => setDiscounts(data))
      .catch(() => setDiscounts([]));
  };

  const openDiscountModal = (book) => {
    setDiscountBook(book);
    setDiscountForm(initialDiscountForm);
    setDiscountMethod("percent");
    loadDiscountsByBook(book.id);
    setShowDiscountModal(true);
  };

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    if (!discountBook) return;

    const payload = {
      bookId: discountBook.id,
      discountPercent:
        discountMethod === "percent" && discountForm.discountPercent
          ? Number(discountForm.discountPercent)
          : null,
      discountAmount:
        discountMethod === "amount" && discountForm.discountAmount
          ? Number(discountForm.discountAmount)
          : null,
      startDate: formatDateTime(discountForm.startDate),
      endDate: formatDateTime(discountForm.endDate),
    };

    setDiscountSubmitting(true);
    fetch("http://localhost:8080/api/book-discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        loadDiscountsByBook(discountBook.id);
        setDiscountForm(initialDiscountForm);
      })
      .finally(() => setDiscountSubmitting(false));
  };

  const handleDeleteDiscount = (discountId) => {
    if (!discountBook) return;
    fetch(`http://localhost:8080/api/book-discounts/${discountId}`, {
      method: "DELETE",
    }).then(() => loadDiscountsByBook(discountBook.id));
  };

  // ===================== OPEN ADD MODAL =====================
  const openAdd = () => {
    setEditingId(null);
    setIsViewing(false);
    setBookForm(createEmptyBook());
    setShowModal(true);
  };

  // ===================== SUBMIT FORM =====================
  const handleSubmit = (e) => {
    e.preventDefault();

    const detailPayload = bookForm.bookDetail
      ? {
          ...bookForm.bookDetail,
          pages: Number(bookForm.bookDetail.pages) || 0,
          length: Number(bookForm.bookDetail.length) || 0,
          width: Number(bookForm.bookDetail.width) || 0,
          height: Number(bookForm.bookDetail.height) || 0,
          weight: Number(bookForm.bookDetail.weight) || 0,
          id: Number(bookForm.bookDetail.id) || 0,
        }
      : null;

    const body = {
      ...bookForm,
      sellingPrice: Number(bookForm.sellingPrice),
      edition: Number(bookForm.edition),
      bookDetail: detailPayload,
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
    if (!b) return;

    setEditingId(null);
    setIsViewing(true);
    setBookForm({
      title: b.title,
      sellingPrice: b.sellingPrice,
      publicationDate: b.publicationDate,
      edition: b.edition,
      author: b.author,
      bookDetailId: "",
      categoryIds: b.categoryIds || [],
      imageUrl: "",
      bookDetail: {
        id: b.bookDetail?.id || "",
        publisher: b.bookDetail?.publisher || "",
        supplier: b.bookDetail?.supplier || "",
        pages: b.bookDetail?.pages || "",
        description: b.bookDetail?.description || "",
        imageUrl: b.bookDetail?.imageUrl || "",
        length: b.bookDetail?.length || "",
        width: b.bookDetail?.width || "",
        height: b.bookDetail?.height || "",
        weight: b.bookDetail?.weight || "",
      },
    });
    setShowModal(true);
  };

  // ===================== EDIT =====================
  const handleEdit = (id) => {
    const b = books.find((x) => x.id === id);
    setEditingId(id);
    setIsViewing(false);

    setBookForm({
      title: b.title,
      sellingPrice: b.sellingPrice,
      publicationDate: b.publicationDate,
      edition: b.edition,
      author: b.author,
      bookDetailId: "",
      categoryIds: b.categoryIds || [],
      imageUrl: "",
      bookDetail: {
        id: b.bookDetail?.id || "",
        publisher: b.bookDetail?.publisher || "",
        supplier: b.bookDetail?.supplier || "",
        pages: b.bookDetail?.pages || "",
        description: b.bookDetail?.description || "",
        imageUrl: b.bookDetail?.imageUrl || "",
        length: b.bookDetail?.length || "",
        width: b.bookDetail?.width || "",
        height: b.bookDetail?.height || "",
        weight: b.bookDetail?.weight || "",
      },
    });

    setShowModal(true);
  };

  // ===================== DELETE =====================
  const handleDelete = () => {
    if (!bookPendingDelete) return;

    fetch(`http://localhost:8080/api/books/${bookPendingDelete.id}`, {
      method: "DELETE",
    }).then(() => {
      loadBooks();
      setShowDeleteModal(false);
      setBookPendingDelete(null);
    });
  };

  // ===================== CATEGORY MANAGEMENT =====================
  const loadCategories = () => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  };

  const openCategoryManager = () => {
    setShowCategoryModal(true);
    loadCategories();
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setCategoryLoading(true);
    fetch("http://localhost:8080/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName.trim(), bookIds: [] }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create category");
        return res.json();
      })
      .then(() => {
        setCategoryName("");
        loadCategories();
      })
      .finally(() => setCategoryLoading(false));
  };

  const handleDeleteCategory = (id) => {
    if (!confirm("Xóa danh mục này?")) return;

    fetch(`http://localhost:8080/api/categories/${id}`, {
      method: "DELETE",
    }).then(() => loadCategories());
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
        <div className={styles.actionGroup}>
          <button className={styles.addButton} onClick={openAdd}>
            <Plus size={16} /> Thêm sách
          </button>
          <button
            className={styles.secondaryButton}
            onClick={openCategoryManager}
          >
            <Plus size={16} /> Quản lý danh mục
          </button>
        </div>

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
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {isViewing
                  ? "Xem chi tiết sách"
                  : editingId
                  ? "Chỉnh sửa sách"
                  : "Thêm sách mới"}
              </h3>
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
                disabled={isViewing}
              />

              <label>Giá (VND):</label>
              <input
                name="sellingPrice"
                type="number"
                value={bookForm.sellingPrice}
                onChange={handleChange}
                required
                disabled={isViewing}
              />

              <label>Tác giả:</label>
              <input
                name="author"
                value={bookForm.author}
                onChange={handleChange}
                required
                disabled={isViewing}
              />

              <label>Ngày xuất bản:</label>
              <input
                name="publicationDate"
                type="date"
                value={bookForm.publicationDate}
                onChange={handleChange}
                disabled={isViewing}
              />

              <label>Lần xuất bản:</label>
              <input
                name="edition"
                type="number"
                value={bookForm.edition}
                onChange={handleChange}
                disabled={isViewing}
              />

              <div className={styles.categorySection}>
                <label>Danh mục:</label>
                <div className={styles.categoryCheckboxList}>
                  {categories.map((cat) => (
                    <label key={cat.id} className={styles.categoryCheckbox}>
                      <input
                        type="checkbox"
                        checked={bookForm.categoryIds?.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        disabled={isViewing}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                  {categories.length === 0 && (
                    <p className={styles.emptyText}>
                      Chưa có danh mục. Nhấn "Quản lý danh mục" để thêm mới.
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.detailSection}>
                <h4>Thông tin chi tiết sách</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailField}>
                    <label>Nhà xuất bản:</label>
                    <input
                      name="publisher"
                      value={bookForm.bookDetail?.publisher || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div className={styles.detailField}>
                    <label>Nhà cung cấp:</label>
                    <input
                      name="supplier"
                      value={bookForm.bookDetail?.supplier || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div className={styles.detailField}>
                    <label>Số trang:</label>
                    <input
                      name="pages"
                      type="number"
                      value={bookForm.bookDetail?.pages || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div className={styles.detailField}>
                    <label>Trọng lượng (gram):</label>
                    <input
                      name="weight"
                      type="number"
                      value={bookForm.bookDetail?.weight || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div className={styles.detailField}>
                    <label>Chiều dài (cm):</label>
                    <input
                      name="length"
                      type="number"
                      value={bookForm.bookDetail?.length || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div className={styles.detailField}>
                    <label>Chiều rộng (cm):</label>
                    <input
                      name="width"
                      type="number"
                      value={bookForm.bookDetail?.width || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div className={styles.detailField}>
                    <label>Chiều cao (cm):</label>
                    <input
                      name="height"
                      type="number"
                      value={bookForm.bookDetail?.height || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div
                    className={`${styles.detailField} ${styles.fullWidthField}`}
                  >
                    <label>Ảnh bìa (URL):</label>
                    <input
                      name="imageUrl"
                      value={bookForm.bookDetail?.imageUrl || ""}
                      onChange={handleDetailChange}
                      disabled={isViewing}
                    />
                  </div>
                  <div
                    className={`${styles.detailField} ${styles.fullWidthField}`}
                  >
                    <label>Mô tả:</label>
                    <textarea
                      name="description"
                      value={bookForm.bookDetail?.description || ""}
                      onChange={handleDetailChange}
                      rows={3}
                      disabled={isViewing}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  {isViewing ? "Đóng" : "Hủy"}
                </button>
                {!isViewing && (
                  <button type="submit" className={styles.saveBtn}>
                    {editingId ? "Lưu" : "Thêm mới"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className={`${styles.modal} ${styles.categoryModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Quản lý danh mục</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowCategoryModal(false)}
              >
                <X />
              </button>
            </div>

            <form
              className={styles.categoryForm}
              onSubmit={handleCreateCategory}
            >
              <label>Tên danh mục mới:</label>
              <div className={styles.categoryInputRow}>
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="VD: Sách Văn học"
                  required
                />
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={categoryLoading}
                >
                  {categoryLoading ? "Đang thêm..." : "Thêm"}
                </button>
              </div>
            </form>

            <div className={styles.categoryList}>
              {categories.length === 0 && (
                <p className={styles.emptyText}>Chưa có danh mục nào.</p>
              )}

              {categories.map((cat) => (
                <div key={cat.id} className={styles.categoryItemRow}>
                  <span>{cat.name}</span>
                  <button
                    className={styles.categoryDeleteBtn}
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DISCOUNT MODAL */}
      {showDiscountModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowDiscountModal(false);
            setDiscountBook(null);
            setDiscounts([]);
            setDiscountForm(initialDiscountForm);
            setDiscountMethod("percent");
          }}
        >
          <div
            className={`${styles.modal} ${styles.discountModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Giảm giá cho: {discountBook?.title}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setShowDiscountModal(false);
                  setDiscountBook(null);
                  setDiscounts([]);
                  setDiscountForm(initialDiscountForm);
                  setDiscountMethod("percent");
                }}
              >
                <X />
              </button>
            </div>

            <form
              className={styles.discountForm}
              onSubmit={handleDiscountSubmit}
            >
              <div className={styles.discountMethodRow}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="discountMethod"
                    value="percent"
                    checked={discountMethod === "percent"}
                    onChange={() => {
                      setDiscountMethod("percent");
                      setDiscountForm((prev) => ({
                        ...prev,
                        discountAmount: "",
                      }));
                    }}
                  />
                  Giảm theo %
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="discountMethod"
                    value="amount"
                    checked={discountMethod === "amount"}
                    onChange={() => {
                      setDiscountMethod("amount");
                      setDiscountForm((prev) => ({
                        ...prev,
                        discountPercent: "",
                      }));
                    }}
                  />
                  Giảm theo số tiền
                </label>
              </div>
              <div className={styles.discountGrid}>
                <label
                  className={
                    discountMethod === "percent"
                      ? styles.discountField
                      : styles.discountFieldHidden
                  }
                >
                  % Giảm giá:
                  <input
                    type="number"
                    step="0.1"
                    name="discountPercent"
                    value={discountForm.discountPercent}
                    onChange={handleDiscountChange}
                    disabled={discountMethod !== "percent"}
                    required={discountMethod === "percent"}
                  />
                </label>
                <label
                  className={
                    discountMethod === "amount"
                      ? styles.discountField
                      : styles.discountFieldHidden
                  }
                >
                  Số tiền giảm (VND):
                  <input
                    type="number"
                    name="discountAmount"
                    value={discountForm.discountAmount}
                    onChange={handleDiscountChange}
                    disabled={discountMethod !== "amount"}
                    required={discountMethod === "amount"}
                  />
                </label>
                <label>
                  Ngày bắt đầu:
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={discountForm.startDate}
                    onChange={handleDiscountChange}
                    required
                  />
                </label>
                <label>
                  Ngày kết thúc:
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={discountForm.endDate}
                    onChange={handleDiscountChange}
                    required
                  />
                </label>
              </div>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={discountSubmitting}
              >
                {discountSubmitting ? "Đang lưu..." : "Thêm giảm giá"}
              </button>
            </form>

            <div className={styles.discountList}>
              {discounts.length === 0 ? (
                <p className={styles.emptyText}>
                  Chưa có giảm giá nào cho sách này.
                </p>
              ) : (
                discounts.map((discount) => (
                  <div key={discount.id} className={styles.discountItem}>
                    <div>
                      <p className={styles.discountTitle}>
                        {discount.discountPercent
                          ? `-${discount.discountPercent}%`
                          : ""}
                        {discount.discountAmount
                          ? ` ${
                              discount.discountPercent ? " | " : ""
                            }-${discount.discountAmount.toLocaleString(
                              "vi-VN"
                            )}đ`
                          : ""}
                      </p>
                      <p className={styles.discountMeta}>
                        {discount.startDate
                          ? new Date(discount.startDate).toLocaleString("vi-VN")
                          : "N/A"}{" "}
                        →{" "}
                        {discount.endDate
                          ? new Date(discount.endDate).toLocaleString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>
                    <button
                      className={styles.categoryDeleteBtn}
                      onClick={() => handleDeleteDiscount(discount.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowDeleteModal(false);
            setBookPendingDelete(null);
          }}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Xóa sách</h3>
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookPendingDelete(null);
                }}
              >
                <X />
              </button>
            </div>
            <p>
              Bạn có chắc chắn muốn xóa{" "}
              <strong>{bookPendingDelete?.title}</strong>? Hành động này không
              thể hoàn tác.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookPendingDelete(null);
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                className={styles.deleteConfirmBtn}
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
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
              <th>Ngày xuất bản</th>
              <th>Lần Xuất bản</th>
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
                <td>{b.categoryNames}</td>

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
                    className={styles.btnDiscount}
                    onClick={() => openDiscountModal(b)}
                  >
                    <BadgePercent size={16} />
                  </button>

                  <button
                    className={styles.btnDelete}
                    onClick={() => {
                      setBookPendingDelete(b);
                      setShowDeleteModal(true);
                    }}
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
