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

  const books = [
    {
      section: "Sách Mới Nổi Bật",
      items: [
        {
          title: "Quà Tết Độc Lập - Những Lá Thư Hồi Chiến",
          price: "269.000 đ",
          originalPrice: "299.000 đ",
          discount: "-10%",
          img: "https://i.pinimg.com/1200x/06/8e/d8/068ed8e1d2deec70d3cd66175dcd2a79.jpg",
          badge: "Xứ hướng ~",
          stockCount: 417,
        },
        {
          title: "Tủ Sách Thanh Niên - Mãi Mãi Tuổi Hai Mươi",
          price: "114.500 đ",
          originalPrice: "135.000 đ",
          discount: "-15%",
          img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935280920040.jpg",
          badge: "ĐỌC QUYỀN",
          stockCount: 619,
        },
        {
          title: "Mura Đỏ - Ấn Bản Bìa Cứng - Kèm Hộp & Chữ Ký Scan",
          price: "247.500 đ",
          originalPrice: "275.000 đ",
          discount: "-10%",
          img: "https://cdn0.fahasa.com/media/catalog/product/m/u/muado-combo.jpg",
          badge: "Mới",
          stockCount: 417,
        },
        {
          title: "English Grammar In Use With Answers",
          price: "356.000 đ",
          originalPrice: "375.000 đ",
          discount: "-5%",
          img: "https://cdn0.fahasa.com/media/catalog/product/9/7/9781108457651.jpg",
          stockCount: 148,
          isComingSoon: true,
        },
        {
          title: "Boxset Nguyên Tội Của Takopi - Tập 1 + Tập 2",
          price: "95.000 đ",
          originalPrice: "100.000 đ",
          discount: "-5%",
          img: "https://cdn0.fahasa.com/media/catalog/product/b/o/boxset-nguyen-toi-cua-takopi.jpg",
          isComingSoon: true,
          stockStatus: "low",
        },
      ],
    },
    {
      section: "Sách Văn Học",
      items: [
        {
          title: "Tôi Là Bêtô",
          price: "65.000 đ",
          originalPrice: "75.000 đ",
          discount: "-15%",
          img: "https://cdn0.fahasa.com/media/catalog/product/t/o/toilabeto.jpg",
          badge: "Mới",
          stockCount: 234,
        },
        {
          title: "Mắt Biếc",
          price: "80.000 đ",
          originalPrice: "95.000 đ",
          discount: "-20%",
          img: "https://cdn0.fahasa.com/media/catalog/product/m/a/matbiec.jpg",
          stockCount: 567,
        },
        {
          title: "Người Đua Diều",
          price: "120.000 đ",
          originalPrice: "150.000 đ",
          discount: "-30%",
          img: "https://cdn0.fahasa.com/media/catalog/product/n/g/nguoi-dua-dieu.jpg",
          stockCount: 892,
        },
        {
          title: "Hai Số Phận",
          price: "200.000 đ",
          originalPrice: "250.000 đ",
          discount: "-25%",
          img: "https://cdn0.fahasa.com/media/catalog/product/h/a/haisophan.jpg",
          stockCount: 156,
        },
        {
          title: "Đắc Nhân Tâm",
          price: "95.000 đ",
          originalPrice: "105.000 đ",
          discount: "-10%",
          img: "https://cdn0.fahasa.com/media/catalog/product/d/a/dacnhantam.jpg",
          stockStatus: "low",
        },
      ],
    },
    {
      section: "Sách Tâm Lý – Kỹ Năng Sống",
      items: [
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110.000 đ",
          originalPrice: "140.000 đ",
          discount: "-30%",
          img: "https://cdn0.fahasa.com/media/catalog/product/s/u/suc-manh-cua-thoi-quen.jpg",
          badge: "Hot",
          stockCount: 445,
        },
        {
          title: "Tư Duy Nhanh Và Chậm",
          price: "130.000 đ",
          originalPrice: "165.000 đ",
          discount: "-25%",
          img: "https://cdn0.fahasa.com/media/catalog/product/t/u/tu-duy-nhanh-va-cham.jpg",
          stockCount: 321,
        },
        {
          title: "7 Thói Quen Hiệu Quả",
          price: "145.000 đ",
          originalPrice: "180.000 đ",
          discount: "-20%",
          img: "https://cdn0.fahasa.com/media/catalog/product/7/_/7-thoi-quen-hieu-qua.jpg",
          stockCount: 678,
        },
        {
          title: "Bạn Đắt Giá Bao Nhiêu",
          price: "99.000 đ",
          originalPrice: "110.000 đ",
          discount: "-10%",
          img: "https://cdn0.fahasa.com/media/catalog/product/b/a/ban-dat-gia-bao-nhieu.jpg",
          isComingSoon: true,
          stockStatus: "low",
        },
        {
          title: "Khéo Ăn Nói Sẽ Có Được Thiên Hạ",
          price: "115.000 đ",
          originalPrice: "140.000 đ",
          discount: "-20%",
          img: "https://cdn0.fahasa.com/media/catalog/product/k/h/kheo-an-noi-se-co-duoc-thien-ha.jpg",
          stockCount: 289,
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

        {/* --- BANNER + CÁC PHẦN SÁCH --- */}
        <div className={styles.rightContent}>
          <div className={styles.bannerArea}>
            <button className={styles.navButton} onClick={prevBanner}>
              <ChevronLeft />
            </button>
            <img
              src={banners[current] || "/placeholder.svg"}
              alt="Banner"
              className={styles.bannerImage}
            />
            <button className={styles.navButton} onClick={nextBanner}>
              <ChevronRight />
            </button>
          </div>

          {/* --- CÁC KHU VỰC SẢN PHẨM --- */}
          {books.map((section, index) => (
            <div key={index} className={styles.productSection}>
              <h3 className={styles.sectionTitle}>{section.section}</h3>
              <div className={styles.productGrid}>
                {section.items.map((book, i) => (
                  <div key={i} className={styles.productCard}>
                    {book.isComingSoon && (
                      <div className={styles.comingSoonBadge}>Sắp Có Hàng</div>
                    )}

                    {book.badge && (
                      <div className={styles.topBadge}>{book.badge}</div>
                    )}

                    <div className={styles.discountTag}>{book.discount}</div>
                    <img
                      src={book.img || "/placeholder.svg"}
                      alt={book.title}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <p className={styles.productTitle}>{book.title}</p>
                      <div className={styles.priceContainer}>
                        <p className={styles.productPrice}>{book.price}</p>
                        <p className={styles.originalPrice}>
                          {book.originalPrice}
                        </p>
                      </div>
                    </div>
                    <button
                      className={
                        book.stockStatus === "low"
                          ? styles.stockButtonLow
                          : styles.stockButton
                      }
                    >
                      {book.stockStatus === "low"
                        ? "Sắp hết"
                        : `Đã bán ${book.stockCount}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
