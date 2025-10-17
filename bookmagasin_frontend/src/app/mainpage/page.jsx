"use client";
import { useState, useEffect } from "react";
import styles from "./mainpage.module.css";
import ProductCard from "../category/ProductCard"; // ✅ reuse CategoryPage’s ProductCard
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MainPage() {
  const categories = [
    "Sách Kinh Tế",
    "Sách Văn Học Trong Nước",
    "Sách Văn Học Nước Ngoài",
    "Sách Thưởng Thức Đời Sống",
    "Sách Thiếu Nhi",
    "Sách Phát Triển Bản Thân",
    "Sách Tin Học Ngoại Ngữ",
    "Sách Chuyên Ngành",
    "Sách Giáo Khoa - Giáo Trình",
    "Sách Phát Hành 2024",
    "Sách Mới 2025",
    "Review Sách",
  ];

  const banners = [
    "https://i.pinimg.com/1200x/a9/06/8b/a9068bb873bfdcae53720294580a227a.jpg",
    "https://i.pinimg.com/736x/60/02/de/6002de1b84892254c9a6136f483d63c6.jpg",
    "https://i.pinimg.com/1200x/bc/8b/f9/bc8bf98691fe3c6feee07ca05d08ca56.jpg",
  ];

  const [current, setCurrent] = useState(0);
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
          <h3 className={styles.categoryTitle}>Danh mục</h3>
          <ul className={styles.categoryList}>
            {categories.map((item, index) => (
              <li key={index} className={styles.categoryItem}>
                {item}
                <span className={styles.arrow}>›</span>
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
