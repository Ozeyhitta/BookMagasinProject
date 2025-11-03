"use client";
import { useState, useEffect } from "react";
import styles from "./mainpage.module.css";
import ProductCard from "../category/ProductCard"; // ✅ reuse CategoryPage’s ProductCard
import { ChevronLeft, ChevronRight, BookText } from "lucide-react";

export default function MainPage() {
  const categories = [
    {
      label: "Sách Kinh Tế",
      children: [
        "Ngoại Thương",
        "Marketing - Bán Hàng",
        "Nhân Sự & Việc Làm",
        "Nhân Vật & Bài Học Kinh Doanh",
        "Phân Tích & Môi Trường Kinh Tế",
        "Quản Trị - Lãnh Đạo",
        "Tài Chính & Tiền Tệ",
        "Tài Chính – Kế Toán",
        "Văn Bản Luật",
        "Khởi Nghiệp/Kỹ Năng Làm Việc",
      ],
    },
    { label: "Sách Văn Học Trong Nước" },
    { label: "Sách Văn Học Nước Ngoài" },
    { label: "Sách Thưởng Thức Đời Sống" },
    { label: "Sách Thiếu Nhi" },
    { label: "Sách Phát Triển Bản Thân" },
    { label: "Sách Tin Học Ngoại Ngữ" },
    { label: "Sách Chuyên Ngành" },
    { label: "Sách Giáo Khoa - Giáo Trình" },
    { label: "Sách Phát Hành 2024" },
    { label: "Sách Mới 2025" },
    { label: "Review Sách" },
  ];

  const banners = [
    "https://i.pinimg.com/1200x/a9/06/8b/a9068bb873bfdcae53720294580a227a.jpg",
    "https://i.pinimg.com/736x/60/02/de/6002de1b84892254c9a6136f483d63c6.jpg",
    "https://i.pinimg.com/1200x/bc/8b/f9/bc8bf98691fe3c6feee07ca05d08ca56.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const prevBanner = () =>
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const nextBanner = () =>
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));

  // Tự động chuyển banner sau 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000); // đổi banner mỗi 4 giây

    return () => clearInterval(interval); // dọn dẹp khi component unmount
  }, [banners.length]);

  // ✅ reuse your product data from CategoryPage or other arrays
  const [books, setBooks] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [booksRes, detailsRes] = await Promise.all([
        fetch("http://localhost:8080/api/books"),
        fetch("http://localhost:8080/api/books-details"),
      ]);

      const booksData = await booksRes.json();
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

      setBooks(merged);
    } catch (error) {
      console.error("Lỗi load sách:", error);
    }
  };

  fetchData();
}, []);

const [promotions, setPromotions] = useState([]);

useEffect(() => {
  const fetchPromotions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/promotions");
      const data = await res.json();
      setPromotions(data);
    } catch (error) {
      console.error("Lỗi load khuyến mãi:", error);
    }
  };

  fetchPromotions();
}, []);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.layout}>
        {/* --- DANH MỤC --- */}

        <div className={styles.categoryBox}>
          <h2 className={styles.categoryTitle}>
            <BookText className={styles.categoryIconTitle} />
            Danh mục sản phẩm
          </h2>

          <ul className={styles.categoryList}>
            {categories.map((cat, index) => (
              <li
                key={index}
                className={styles.categoryItem}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span className={styles.categoryIcon}></span>
                <span className={styles.categoryText}>{cat.label}</span>
                <span className={styles.arrow}>›</span>

                {/* ✅ Submenu hiện khi hover */}
                {hoveredIdx === index && cat.children?.length > 0 && (
                  <div
                    className={styles.subMenu}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {cat.children.map((sub, i) => (
                      <div key={i} className={styles.subMenuItem}>
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* --- BANNER + PHẦN SÁCH --- */}
        <div className={styles.rightContent}>
          <div className={styles.bannerArea}>
            <button className={styles.navButton} onClick={prevBanner}>
              <ChevronLeft />
            </button>

            <div className={styles.sliderWrapper}>
              <div
                className={styles.slider}
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {banners.map((banner, index) => (
                  <img
                    key={index}
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className={styles.bannerImage}
                  />
                ))}
              </div>
            </div>

            <button className={styles.navButton} onClick={nextBanner}>
              <ChevronRight />
            </button>
          </div>

         <div className={styles.productSection}>
  <h3 className={styles.sectionTitle}>Sách mới cập nhật</h3>

  <div className={styles.productGrid}>
    {books.map((book) => (
      <ProductCard
        key={book.id}
        title={book.title}
        price={book.price?.toLocaleString("vi-VN") + "đ"}
        oldPrice={null}
        discount={null}
        image={book.imageUrl}
      />
    ))}
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
