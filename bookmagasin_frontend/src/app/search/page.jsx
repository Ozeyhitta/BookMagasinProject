"use client";
import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
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

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    console.log("Lọc với:", filters);
    // TODO: Gọi API lọc sản phẩm
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tìm kiếm sản phẩm</h1>

      <div className={styles.filterRow}>
        {/* Danh mục chính */}
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

        {/* Danh mục phụ */}
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

        {/* Thương hiệu */}
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

        {/* Lứa tuổi */}
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

        {/* Nhà phát hành */}
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

        {/* Nhà cung cấp */}
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

        {/* Mức giá */}
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

        {/* Sắp xếp */}
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

        {/* Nút lọc */}
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

      {/* Nút reset */}
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
          Kết quả tìm kiếm cho <span>"văn học"</span>
        </h2>
        <p className={styles.resultsCount}>Có 894 sản phẩm cho tìm kiếm</p>

        <div className={styles.productGrid}>
          {/* Ví dụ 4 sản phẩm mẫu */}
          {[
            {
              id: 1,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
            {
              id: 2,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
            {
              id: 3,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
            {
              id: 4,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
            {
              id: 5,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
            {
              id: 6,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
            {
              id: 7,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
            {
              id: 8,
              name: "10 Vạn Câu Hỏi Vì Sao? - Khoa Học - Vũ Trụ - Trái Đất",
              price: 41600,
              oldPrice: 52000,
              discount: "-20%",
              image: "https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100096.jpg",
              soldOut: false,
            },
          ].map((item) => (
            <div key={item.id} className={styles.productCard}>
              <div className={styles.imageWrapper}>
                {item.soldOut ? (
                  <div className={styles.soldOutOverlay}>Hết hàng</div>
                ) : (
                  item.discount && (
                    <span className={styles.discountTag}>{item.discount}</span>
                  )
                )}
                <img src={item.image} alt={item.name} className={styles.image} />
              </div>
              <p className={styles.productName}>{item.name}</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>
                  {item.price.toLocaleString("vi-VN")}đ
                </span>
                {item.oldPrice && (
                  <span className={styles.oldPrice}>
                    {item.oldPrice.toLocaleString()}đ
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Phân trang tĩnh */}
      <div className={styles.pagination}>
        <span className={`${styles.pageNumber} ${styles.active}`}>1</span>
        <span className={styles.pageNumber}>2</span>
        <span className={styles.pageNumber}>3</span>
        <span className={styles.dots}>...</span>
        <span className={styles.pageNumber}>38</span>
        <span className={styles.nextArrow}>→</span>
      </div>
    </div>
  );
}
