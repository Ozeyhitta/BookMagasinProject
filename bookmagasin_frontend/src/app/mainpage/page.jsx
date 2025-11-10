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
    "https://newshop.vn/public/uploads/landing-page/sach-hay-newshop/banner-mobile.png",
    "https://tudongchat.com/wp-content/uploads/2025/01/stt-ban-sach-5.jpg",
    "https://newshop.vn/public/uploads/news/nhung-cuon-sach-van-hoc-hay.jpg",
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
  const books = [
    {
      section: "Tâm Lý - Kỹ Năng Sống",
      items: [
        {
          title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
          price: "151,200đ",
          oldPrice: "168,000đ",
          discount: "-10%",
          image:
            "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
      ],
    },
    {
      section: "Sách Văn Học",
      items: [
        {
          title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
          price: "151,200đ",
          oldPrice: "168,000đ",
          discount: "-10%",
          image:
            "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://i.pinimg.com/736x/b7/ad/a1/b7ada1914f3c4ef6ca1c99368f376e31.jpg",
        },
      ],
    },
  ];

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

          {/* --- PHẦN SÁCH DẠNG GRID (copied from CategoryPage) --- */}
          {books.map((section, index) => (
            <div key={index} className={styles.productSection}>
              <h3 className={styles.sectionTitle}>{section.section}</h3>
              <div className={styles.productGrid}>
                {section.items.map((book, i) => (
                  <ProductCard key={i} {...book} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
