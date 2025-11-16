"use client";

import { useState, useEffect } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import styles from "./SearchPage.module.css";
import ProductCard from "../category/ProductCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get("keyword") || "").trim();

  const [filters, setFilters] = useState({
    mainCategory: "all",
    category: "all",
    brand: "all",
    ageGroup: "all",
    publisher: "all",
    supplier: "all",
    priceFrom: "",
    priceTo: "",
    sort: "default",
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [discounts, setDiscounts] = useState({});

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    console.log("Lọc với:", filters);
    // TODO: Có thể kết hợp filters với keyword để lọc nâng cao
  };

  const handleReset = () => {
    setFilters({
      mainCategory: "all",
      category: "all",
      brand: "all",
      ageGroup: "all",
      publisher: "all",
      supplier: "all",
      priceFrom: "",
      priceTo: "",
      sort: "default",
    });
  };

  // 🔍 Fetch & lọc sách theo keyword
  useEffect(() => {
    // Nếu không có keyword thì không cần gọi API
    if (!keyword) {
      setBooks([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Lấy toàn bộ sách + chi tiết giống MainPage
        const booksRes = await fetch("http://localhost:8080/api/books");
        const booksData = await booksRes.json();

        const detailsRes = await fetch(
          "http://localhost:8080/api/books-details"
        );
        const detailsData = await detailsRes.json();

        const merged = booksData.map((book) => {
          const matchedDetail = detailsData.find(
            (d) => d.book?.id === book.id
          );

          return {
            id: book.id,
            title: book.title,
            price: book.sellingPrice,
            imageUrl:
              matchedDetail?.imageUrl ||
              "https://via.placeholder.com/200x280?text=No+Image",
          };
        });

        // Lọc theo tiêu đề chứa keyword (không phân biệt hoa thường)
        const lower = keyword.toLowerCase();
        const filtered = merged.filter((b) =>
          b.title.toLowerCase().includes(lower)
        );

        setBooks(filtered);

        // Fetch discounts cho các books đã lọc
        const discountMap = {};
        const now = new Date();

        for (const book of filtered) {
          try {
            const discountRes = await fetch(
              `http://localhost:8080/api/book-discounts/book/${book.id}`
            );
            if (discountRes.ok) {
              const discountData = await discountRes.json();
              
              // Tìm discount active
              const activeDiscount = discountData.find((discount) => {
                const startDate = new Date(discount.startDate);
                const endDate = new Date(discount.endDate);
                return now >= startDate && now <= endDate;
              });

              if (activeDiscount) {
                discountMap[book.id] = activeDiscount;
              }
            }
          } catch (err) {
            console.error(`Error fetching discount for book ${book.id}:`, err);
          }
        }

        setDiscounts(discountMap);
      } catch (err) {
        console.error("Lỗi load sách:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tìm kiếm sản phẩm</h1>

      {/* Bộ lọc (tạm thời chỉ hiển thị, chưa kết hợp với API) */}
      <div className={styles.filterRow}>
        <select
          name="mainCategory"
          value={filters.mainCategory}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Danh mục chính: Tất cả</option>
          <option value="books">Sách</option>
          <option value="toys">Đồ chơi</option>
          <option value="stationery">Văn phòng phẩm</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Danh mục phụ: Tất cả</option>
          <option value="education">Giáo dục</option>
          <option value="comics">Truyện tranh</option>
          <option value="novel">Tiểu thuyết</option>
        </select>

        <select
          name="brand"
          value={filters.brand}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Thương hiệu: Tất cả</option>
          <option value="nxbtre">NXB Trẻ</option>
          <option value="kimdong">Kim Đồng</option>
          <option value="fahasa">FAHASA</option>
        </select>

        <select
          name="ageGroup"
          value={filters.ageGroup}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Lứa tuổi: Tất cả</option>
          <option value="kids">Thiếu nhi</option>
          <option value="teen">Thiếu niên</option>
          <option value="adult">Người lớn</option>
        </select>

        <select
          name="publisher"
          value={filters.publisher}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Nhà phát hành: Tất cả</option>
          <option value="nxbkimdong">NXB Kim Đồng</option>
          <option value="nxbtre">NXB Trẻ</option>
          <option value="alphabooks">Alpha Books</option>
        </select>

        <select
          name="supplier"
          value={filters.supplier}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Nhà cung cấp: Tất cả</option>
          <option value="fahasa">FAHASA</option>
          <option value="tiki">Tiki</option>
          <option value="vinabook">Vinabook</option>
        </select>

        <div className={styles.priceGroup}>
          <label className={styles.label}>Mức giá:</label>
          <input
            type="number"
            name="priceFrom"
            placeholder="Từ"
            value={filters.priceFrom}
            onChange={handleChange}
            className={styles.input}
          />
          <span>-</span>
          <input
            type="number"
            name="priceTo"
            placeholder="Đến"
            value={filters.priceTo}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="default">Sắp xếp: Mặc định</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
          <option value="newest">Mới nhất</option>
        </select>

        <button onClick={handleFilter} className={styles.filterButton}>
          <Sparkles
            size={18}
            strokeWidth={2}
            className={styles.icon}
            aria-hidden="true"
          />
          Lọc
        </button>
      </div>

      <button onClick={handleReset} className={styles.resetButton}>
        <RotateCcw
          size={18}
          strokeWidth={2}
          className={styles.icon}
          aria-hidden="true"
        />
        Khôi phục bộ lọc
      </button>

      {/* Kết quả tìm kiếm */}
      <div className={styles.resultsSection}>
        <h2 className={styles.resultsTitle}>
          Kết quả tìm kiếm cho{" "}
          <span>"{keyword || "Không có từ khóa"}"</span>
        </h2>

        {loading && <p className={styles.resultsCount}>Đang tải...</p>}
        {error && <p className={styles.resultsCount}>{error}</p>}

        {!loading && !error && keyword && (
          <p className={styles.resultsCount}>
            Có <strong>{books.length}</strong> sản phẩm cho tìm kiếm
          </p>
        )}

        {!loading && !error && keyword && books.length === 0 && (
          <p className={styles.resultsCount}>
            Không tìm thấy sản phẩm nào phù hợp với từ khóa.
          </p>
        )}

        <div className={styles.productGrid}>
          {books.map((book) => {
            const discount = discounts[book.id];
            
            // Tính giá sau discount - ưu tiên discountPercent nếu có cả 2
            const priceAfterDiscount = discount
              ? Math.round(
                  discount.discountPercent != null && discount.discountPercent > 0
                    ? book.price * (1 - discount.discountPercent / 100)
                    : discount.discountAmount != null && discount.discountAmount > 0
                    ? Math.max(0, book.price - discount.discountAmount)
                    : book.price
                )
              : book.price;
            
            // Hiển thị text discount - ưu tiên discountPercent
            const discountText = discount
              ? discount.discountPercent != null && discount.discountPercent > 0
                ? `-${discount.discountPercent}%`
                : discount.discountAmount != null && discount.discountAmount > 0
                ? `-${discount.discountAmount.toLocaleString("vi-VN")}đ`
                : null
              : null;

            return (
              <ProductCard
                key={book.id}
                id={book.id}
                title={book.title}
                price={priceAfterDiscount.toLocaleString("vi-VN") + "đ"}
                oldPrice={discount ? book.price.toLocaleString("vi-VN") + "đ" : null}
                discount={discountText}
                image={book.imageUrl}
              />
            );
          })}
        </div>
      </div>

      {/* Phân trang tạm để nguyên, sau này có thể làm server-side / client-side paging */}
      {/* <div className={styles.pagination}>...</div> */}
    </div>
  );
}
