"use client";

import { useEffect, useMemo, useState } from "react";
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

const MAIN_CATEGORY_NAMES = [
  "Văn học",
  "Khoa học",
  "Lịch sử",
  "Triết học",
  "Nghệ thuật",
  "Giáo dục",
  "Kinh tế",
  "Y học",
  "Công nghệ",
  "Thể thao",
  "Thiếu nhi"
];

const normalize = (str) => str?.trim().toLowerCase();

const createEmptyBook = () => ({
  title: "",
  code: "",
  sellingPrice: "",
  publicationDate: "",
  edition: "",
  author: "",
  stockQuantity: "",
  categoryIds: [],
  imageUrl: "",
  bookDetail: {
    id: 0,
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

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [bookPendingDelete, setBookPendingDelete] = useState(null);
  const [discountBook, setDiscountBook] = useState(null);
  const [isViewing, setIsViewing] = useState(false);

  const [search, setSearch] = useState("");
  const [bookForm, setBookForm] = useState(createEmptyBook());

  const [discounts, setDiscounts] = useState([]);
  const [discountSubmitting, setDiscountSubmitting] = useState(false);
  const [discountMethod, setDiscountMethod] = useState("percent");
  const [discountForm, setDiscountForm] = useState({
    discountPercent: "",
    discountAmount: "",
    startDate: "",
    endDate: "",
  });
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
        const mapped = (data || []).map((b) => ({
          id: b.id,
          title: b.title,
          code: b.code || "",
          sellingPrice: b.sellingPrice,
          publicationDate: b.publicationDate?.split("T")[0] || "",
          edition: b.edition,
          author: b.author,
          stockQuantity: b.stockQuantity ?? "",
          categoryIds: b.categories?.map((c) => c.id) || [],
          categoryNames: b.categories?.map((c) => c.name).join(", ") || "",
          categories: b.categories || [],
          bookDetail: b.bookDetail || null,
          imageUrl: b.imageUrl || "",
        }));
        setBooks(mapped);
      })
      .catch(() => setBooks([]));
  };

  const fetchCategories = () =>
    fetch("http://localhost:8080/api/categories").then((res) => res.json());

  const seedMainCategoriesIfEmpty = async (list) => {
    if (Array.isArray(list) && list.length > 0) {
      return false;
    }

    for (const main of MAIN_CATEGORY_NAMES) {
      await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: main, parentId: null, bookIds: [] }),
      });
    }
    return true;
  };

  const loadCategories = () => {
    setCategoryLoading(true);
    fetchCategories()
      .then(async (data) => {
        const created = await seedMainCategoriesIfEmpty(data || []);
        const finalData = created ? await fetchCategories() : data;
        setCategories(finalData || []);
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoryLoading(false));
  };

  const mainCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  const filteredBooks = useMemo(() => {
    const term = normalize(search);
    if (!term) return books;
    return books.filter(
      (b) =>
        normalize(b.title || "").includes(term) ||
        normalize(b.code || "").includes(term) ||
        normalize(b.author || "").includes(term) ||
        normalize(b.categoryNames || "").includes(term)
    );
  }, [books, search]);

  const mapBookToForm = (book) => ({
    title: book?.title || "",
    code: book?.code || "",
    sellingPrice: book?.sellingPrice ?? "",
    stockQuantity: book?.stockQuantity ?? "",
    publicationDate: book?.publicationDate || "",
    edition: book?.edition ?? "",
    author: book?.author || "",
    categoryIds: book?.categoryIds || [],
    imageUrl: book?.imageUrl || "",
    bookDetail: {
      id: book?.bookDetail?.id || 0,
      publisher: book?.bookDetail?.publisher || "",
      supplier: book?.bookDetail?.supplier || "",
      pages: book?.bookDetail?.pages ?? "",
      description: book?.bookDetail?.description || "",
      imageUrl: book?.bookDetail?.imageUrl || "",
      length: book?.bookDetail?.length ?? "",
      width: book?.bookDetail?.width ?? "",
      height: book?.bookDetail?.height ?? "",
      weight: book?.bookDetail?.weight ?? "",
    },
  });

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({
      ...prev,
      bookDetail: { ...prev.bookDetail, [name]: value },
    }));
  };

  const toggleCategory = (id) => {
    setBookForm((prev) => {
      const exists = prev.categoryIds.includes(id);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((c) => c !== id)
          : [...prev.categoryIds, id],
      };
    });
  };

  const handleSubmit = () => {
    const isEdit = Boolean(editingId);

    const payload = {
      id: isEdit ? editingId : undefined,
      title: bookForm.title,
      code: bookForm.code,
      sellingPrice: Number(bookForm.sellingPrice) || 0,
      stockQuantity:
        bookForm.stockQuantity !== "" ? Number(bookForm.stockQuantity) : null,
      publicationDate: bookForm.publicationDate
        ? `${bookForm.publicationDate}T00:00:00`
        : null,
      edition: Number(bookForm.edition) || 1,
      author: bookForm.author,
      imageUrl: bookForm.imageUrl,
      categoryIds: (bookForm.categoryIds || []).map(Number),
      bookDetailId: Number(bookForm.bookDetail?.id || 0),

      bookDetail: {
        ...(isEdit && bookForm.bookDetail?.id
          ? { id: Number(bookForm.bookDetail.id) }
          : {}),
        publisher: bookForm.bookDetail.publisher || "",
        supplier: bookForm.bookDetail.supplier || "",
        pages: Number(bookForm.bookDetail.pages) || 0,
        description: bookForm.bookDetail.description || "",
        imageUrl: bookForm.bookDetail.imageUrl || "",
        length: Number(bookForm.bookDetail.length) || 0,
        width: Number(bookForm.bookDetail.width) || 0,
        height: Number(bookForm.bookDetail.height) || 0,
        weight: Number(bookForm.bookDetail.weight) || 0,
      },
    };

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:8080/api/books/${editingId}`
      : "http://localhost:8080/api/books";

    // 🔥 DEBUG LOG
    console.log("📌 SUBMIT BOOK - MODE:", isEdit ? "EDIT" : "CREATE");
    console.log("📌 URL:", url);
    console.log("📌 METHOD:", method);
    console.log("📌 PAYLOAD SENT:", payload);

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        console.log("📌 RESPONSE STATUS:", res.status);

        let json;
        try {
          json = await res.json();
          console.log("📌 RESPONSE JSON:", json);
        } catch (e) {
          console.warn("⚠️ Không parse được JSON response:", e);
        }

        if (!res.ok) {
          console.error("❌ API FAILED:", res.status, json);
          alert("Lỗi khi thêm sách! Xem console để biết chi tiết.");
          return;
        }

        // Thành công
        setShowModal(false);
        setEditingId(null);
        setIsViewing(false);
        setBookForm(createEmptyBook());
        loadBooks();
      })
      .catch((err) => {
        console.error("🔥 FETCH ERROR:", err);
        alert("Không thể gọi API. Kiểm tra server.");
      });
  };

  const openAdd = () => {
    setEditingId(null);
    setIsViewing(false);
    setBookForm(createEmptyBook());
    setShowModal(true);
  };

  const openView = (book) => {
    setEditingId(book.id);
    setIsViewing(true);
    setBookForm(mapBookToForm(book));
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditingId(book.id);
    setIsViewing(false);
    setBookForm(mapBookToForm(book));
    setShowModal(true);
  };

  const openDelete = (book) => {
    setBookPendingDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!bookPendingDelete) return;
    fetch(`http://localhost:8080/api/books/${bookPendingDelete.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setShowDeleteModal(false);
        setBookPendingDelete(null);
        loadBooks();
      })
      .catch(() => {});
  };

  const deleteCategory = async (categoryId) => {
    await fetch(`http://localhost:8080/api/categories/${categoryId}`, {
      method: "DELETE",
    });
    loadCategories();
  };

  const addMainCategory = async () => {
    const name = window.prompt("Nhap ten danh muc");
    if (!name || !name.trim()) return;
    await fetch("http://localhost:8080/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), parentId: null, bookIds: [] }),
    });
    loadCategories();
  };

  const openDiscount = (book) => {
    setDiscountBook(book);
    setDiscountForm({
      discountPercent: "",
      discountAmount: "",
      startDate: "",
      endDate: "",
    });
    setDiscountMethod("percent");
    setShowDiscountModal(true);
    loadDiscounts(book.id);
  };

  const loadDiscounts = (bookId) => {
    fetch(`http://localhost:8080/api/book-discounts/book/${bookId}`)
      .then((res) => res.json())
      .then((data) => setDiscounts(data || []))
      .catch(() => setDiscounts([]));
  };

  const handleDiscountSubmit = () => {
    if (!discountBook) return;
    setDiscountSubmitting(true);

    const payload = {
      discountPercent:
        discountMethod === "percent"
          ? Number(discountForm.discountPercent) || 0
          : null,
      discountAmount:
        discountMethod === "amount"
          ? Number(discountForm.discountAmount) || 0
          : null,
      startDate: discountForm.startDate
        ? `${discountForm.startDate}T00:00:00`
        : null,
      endDate: discountForm.endDate ? `${discountForm.endDate}T00:00:00` : null,
      bookId: discountBook.id,
    };
    fetch("http://localhost:8080/api/book-discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        setDiscountSubmitting(false);
        loadDiscounts(discountBook.id);
      })
      .catch(() => setDiscountSubmitting(false));
  };

  const deleteDiscount = (id) => {
    fetch(`http://localhost:8080/api/book-discounts/${id}`, {
      method: "DELETE",
    }).then(() => {
      if (discountBook) loadDiscounts(discountBook.id);
    });
  };

  const renderAddCategoryModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.addCategoryTitle}>Thêm danh mục mới</h3>
          <button
            className={styles.closeBtn}
            onClick={() => setShowAddCategoryModal(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.addCategoryForm}>
          <label>
            Tên danh mục
            <input
              placeholder="Nhập tên danh mục..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.addCategoryFooter}>
          <button
            className={styles.addCategoryCancel}
            onClick={() => setShowAddCategoryModal(false)}
          >
            Hủy
          </button>
          <button
            className={styles.addCategorySave}
            onClick={handleAddCategorySubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );

  const handleAddCategorySubmit = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    await fetch("http://localhost:8080/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId: null, bookIds: [] }),
    });

    setNewCategoryName("");
    setShowAddCategoryModal(false);
    loadCategories();
  };

  const renderCategoryModal = () => (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.categoryModal}`}>
        <div className={styles.modalHeader}>
          <h3>Quan ly danh muc</h3>
          <button
            className={styles.closeBtn}
            onClick={() => setShowCategoryModal(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className={styles.modalToolbar}>
          <p className={styles.helperText}>
            Co san 11 danh muc lon. Ban co the doi ten hoac xoa neu can.
          </p>
          <button
            className={styles.secondaryButtonSmall}
            onClick={() => setShowAddCategoryModal(true)}
          >
            + Thêm danh mục
          </button>
        </div>
        {categoryLoading ? (
          <p className={styles.helperText}>Dang tai danh muc...</p>
        ) : (
          <div className={styles.categoryList}>
            {mainCategories.map((main) => (
              <div key={main.id} className={styles.categoryItemRow}>
                <div className={styles.mainCategoryHeader}>
                  <span className={styles.mainCategoryName}>{main.name}</span>
                  <button
                    className={styles.categoryDeleteBtn}
                    onClick={() => deleteCategory(main.id)}
                  >
                    Xoa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  const renderBookModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>
            {isViewing ? "Xem sách" : editingId ? "Sửa sách" : "Thêm sách"}
          </h3>
          <button
            className={styles.closeBtn}
            onClick={() => setShowModal(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className={styles.modalForm}>
          <label>
            Tiêu đề
            <input
              name="title"
              value={bookForm.title}
              onChange={handleBookChange}
              disabled={isViewing}
              placeholder="Nhap tieu de"
            />
          </label>
          <label>
            Mã sách
            <input
              name="code"
              value={bookForm.code}
              onChange={handleBookChange}
              disabled={isViewing}
              placeholder="VD: BK-001"
            />
          </label>
          <label>
            Giá bán
            <input
              name="sellingPrice"
              value={bookForm.sellingPrice}
              onChange={handleBookChange}
              disabled={isViewing}
              placeholder="VD: 120000"
            />
          </label>
          <label>
            Số lượng tồn
            <input
              name="stockQuantity"
              value={bookForm.stockQuantity}
              onChange={handleBookChange}
              disabled={isViewing}
              placeholder="VD: 20"
            />
          </label>
          <label>
            Ngày xuất bản
            <input
              type="date"
              name="publicationDate"
              value={bookForm.publicationDate}
              onChange={handleBookChange}
              disabled={isViewing}
            />
          </label>
          <label>
            Lần tái bản
            <input
              name="edition"
              value={bookForm.edition}
              onChange={handleBookChange}
              disabled={isViewing}
              placeholder="VD: 1"
            />
          </label>
          <label>
            Tác giả
            <input
              name="author"
              value={bookForm.author}
              onChange={handleBookChange}
              disabled={isViewing}
              placeholder="Nhap ten tac gia"
            />
          </label>

          <div className={styles.categorySection}>
            <label>Danh mục</label>

            <div className={styles.categoryCheckboxList}>
              {categories
                .filter((c) => !c.parentId) // ❗ CHỈ LẤY DANH MỤC LỚN
                .map((c) => (
                  <label key={c.id} className={styles.categoryCheckbox}>
                    <input
                      type="checkbox"
                      checked={bookForm.categoryIds.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                      disabled={isViewing}
                    />
                    {c.name}
                  </label>
                ))}
            </div>
          </div>

          <div className={styles.detailSection}>
            <h4>Thông tin chi tiết</h4>
            <div className={styles.detailGrid}>
              <div className={styles.detailField}>
                <label>Nhà phát hành</label>
                <input
                  name="publisher"
                  value={bookForm.bookDetail.publisher}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={styles.detailField}>
                <label>Nhà cung cấp</label>
                <input
                  name="supplier"
                  value={bookForm.bookDetail.supplier}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={styles.detailField}>
                <label>Số trang</label>
                <input
                  name="pages"
                  value={bookForm.bookDetail.pages}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={styles.detailField}>
                <label>Chiều dài</label>
                <input
                  name="length"
                  value={bookForm.bookDetail.length}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={styles.detailField}>
                <label>Chiều rộng</label>
                <input
                  name="width"
                  value={bookForm.bookDetail.width}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={styles.detailField}>
                <label>Chiều cao</label>
                <input
                  name="height"
                  value={bookForm.bookDetail.height}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={styles.detailField}>
                <label>Trọng lượng</label>
                <input
                  name="weight"
                  value={bookForm.bookDetail.weight}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={`${styles.detailField} ${styles.fullWidthField}`}>
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={bookForm.bookDetail.description}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
              <div className={styles.detailField}>
                <label>Ảnh chi tiết (URL)</label>
                <input
                  name="imageUrl"
                  value={bookForm.bookDetail.imageUrl}
                  onChange={handleDetailChange}
                  disabled={isViewing}
                />
              </div>
            </div>
          </div>

          {!isViewing && (
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button className={styles.saveBtn} onClick={handleSubmit}>
                Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDeleteModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Xóa sách</h3>
          <button
            className={styles.closeBtn}
            onClick={() => setShowDeleteModal(false)}
          >
            <X size={18} />
          </button>
        </div>
        <p className={styles.helperText}>
          Bạn có chắc muốn xóa sách "{bookPendingDelete?.title}" không?
        </p>
        <div className={styles.modalActions}>
          <button
            className={styles.cancelBtn}
            onClick={() => setShowDeleteModal(false)}
          >
            Hủy
          </button>
          <button className={styles.deleteConfirmBtn} onClick={confirmDelete}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );

  const renderDiscountModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Giảm giá: {discountBook?.title}</h3>
          <button
            className={styles.closeBtn}
            onClick={() => setShowDiscountModal(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className={styles.discountForm}>
          <div className={styles.discountMethodRow}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                value="percent"
                checked={discountMethod === "percent"}
                onChange={() => setDiscountMethod("percent")}
              />
              Phần trăm
            </label>
            <label className={styles.radioOption}>
              <input
                type="radio"
                value="amount"
                checked={discountMethod === "amount"}
                onChange={() => setDiscountMethod("amount")}
              />
              Số tiền
            </label>
          </div>
          <div className={styles.discountGrid}>
            <label>
              % giảm
              <input
                className={
                  discountMethod === "percent" ? "" : styles.discountFieldHidden
                }
                disabled={discountMethod !== "percent"}
                value={discountForm.discountPercent}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    discountPercent: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Số tiền giảm
              <input
                className={
                  discountMethod === "amount" ? "" : styles.discountFieldHidden
                }
                disabled={discountMethod !== "amount"}
                value={discountForm.discountAmount}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    discountAmount: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Bắt đầu
              <input
                type="date"
                value={discountForm.startDate}
                onChange={(e) =>
                  setDiscountForm({
                    ...discountForm,
                    startDate: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Kết thúc
              <input
                type="date"
                value={discountForm.endDate}
                onChange={(e) =>
                  setDiscountForm({ ...discountForm, endDate: e.target.value })
                }
              />
            </label>
          </div>
          <div className={styles.modalActions}>
            <button
              className={styles.saveBtn}
              onClick={handleDiscountSubmit}
              disabled={discountSubmitting}
            >
              {discountSubmitting ? "Đang lưu..." : "Lưu giảm giá"}
            </button>
          </div>
        </div>
        <div className={styles.discountList}>
          {discounts.length ? (
            discounts.map((d) => (
              <div key={d.id} className={styles.discountItem}>
                <div>
                  <p className={styles.discountTitle}>
                    {d.discountPercent
                      ? `${d.discountPercent}%`
                      : d.discountAmount
                      ? `${d.discountAmount} VND`
                      : "Giam gia"}
                  </p>
                  <p className={styles.discountMeta}>
                    {d.startDate?.split("T")[0]} - {d.endDate?.split("T")[0]}
                  </p>
                </div>
                <button
                  className={styles.categoryDeleteBtn}
                  onClick={() => deleteDiscount(d.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <span className={styles.emptyText}>Chưa có giảm giá</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div className={styles.titleBox}>
            <h2>Quản lý sách</h2>
            <span>Quản lý sách, danh mục và giảm giá</span>
          </div>
          <div className={styles.actionGroup}>
            <div className={styles.searchBox}>
              <Search size={16} />
              <input
                placeholder="Tìm theo tên, tác giả, danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className={`${styles.pillButton} ${styles.secondary}`}
              onClick={() => setShowCategoryModal(true)}
            >
              <Plus size={16} /> Danh mục
            </button>
            <button className={styles.pillButton} onClick={openAdd}>
              <Plus size={16} /> Thêm sách
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Mã sách</th>
                <th>Tác giả</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
                <th>Ngày XB</th>
                <th>Danh mục</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.code}</td>
                  <td>{b.author}</td>
                  <td>
                    {b.sellingPrice?.toLocaleString?.() || b.sellingPrice}
                  </td>
                  <td>{b.stockQuantity ?? "-"}</td>
                  <td>{b.publicationDate}</td>
                  <td>
                    {b.categories?.map((c) => (
                      <span key={c.id}>
                        {c.name}
                        {c.parentId ? (
                          <span className={styles.subBadge}>Nho</span>
                        ) : null}{" "}
                      </span>
                    ))}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.btnView}
                        onClick={() => openView(b)}
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.btnEdit}
                        onClick={() => openEdit(b)}
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={styles.btnDiscount}
                        onClick={() => openDiscount(b)}
                        title="Giảm giá"
                      >
                        <BadgePercent size={16} />
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => openDelete(b)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredBooks.length && (
                <tr>
                  <td colSpan={6}>Không có sách phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && renderBookModal()}
      {showCategoryModal && renderCategoryModal()}
      {showDeleteModal && renderDeleteModal()}
      {showDiscountModal && renderDiscountModal()}
      {showAddCategoryModal && renderAddCategoryModal()}
    </div>
  );
}
