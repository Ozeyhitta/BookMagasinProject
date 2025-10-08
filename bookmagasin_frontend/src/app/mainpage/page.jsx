"use client";

import { useState } from "react";
import styles from "./mainpage.module.css";
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
    "https://www.shutterstock.com/shutterstock/photos/1790872166/display_1500/stock-vector-promo-sale-banner-for-library-bookshop-and-bookstore-a-large-number-of-books-stacked-in-piles-1790872166.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/023/107/435/small_2x/promo-banner-with-stack-of-books-globe-inkwell-quill-plant-lantern-ebook-world-book-day-bookstore-bookshop-library-book-lover-bibliophile-education-for-poster-cover-advertising-vector.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/008/424/172/small/bookshelf-with-business-books-shelf-with-books-about-finance-marketing-management-strategy-goals-time-management-team-work-banner-for-library-book-store-illustration-in-flat-style-vector.jpg",
  ];

  const [current, setCurrent] = useState(0);

  const prevBanner = () =>
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const nextBanner = () =>
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));

  return (
    <div className={styles.mainContainer}>
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

      <div className={styles.bannerArea}>
        <button className={styles.navButton} onClick={prevBanner}>
          <ChevronLeft />
        </button>

        <img
          src={banners[current]}
          alt="Banner"
          className={styles.bannerImage}
        />

        <button className={styles.navButton} onClick={nextBanner}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
