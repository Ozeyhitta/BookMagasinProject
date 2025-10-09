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
          title: "How To Be Free",
          price: "90,000đ",
          discount: "-30%",
          img: "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/11/nhung-cau-noi-hay-ve-sach-thumbnail.jpg",
        },
        {
          title: "How To Make Money",
          price: "150,000đ",
          discount: "-20%",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_eqSFRsNitxuUT1Jc-6AjD-wGvU2cx04o4g&s",
        },
        {
          title: "How To Have A Life",
          price: "77,000đ",
          discount: "-30%",
          img: "https://tailieutienganh.edu.vn/public/files/upload/default/images/Phuong-phap-hoc/tron-bo-tu-vung-tieng-anh-theo-chu-de-sach-langgo.jpg",
        },
        {
          title: "Lối Nhỏ Đầu Tiên",
          price: "189,000đ",
          discount: "-10%",
          img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195512.jpg",
        },
        {
          title: "Chúng Ta Đã Hiểu Lầm",
          price: "132,000đ",
          discount: "-25%",
          img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195513.jpg",
        },
      ],
    },
    {
      section: "Sách Văn Học",
      items: [
        {
          title: "Tôi Là Bêtô",
          price: "65,000đ",
          discount: "-15%",
          img: "https://cdn0.fahasa.com/media/catalog/product/t/o/toilabeto.jpg",
        },
        {
          title: "Mắt Biếc",
          price: "80,000đ",
          discount: "-20%",
          img: "https://cdn0.fahasa.com/media/catalog/product/m/a/matbiec.jpg",
        },
        {
          title: "Người Đua Diều",
          price: "120,000đ",
          discount: "-30%",
          img: "https://cdn0.fahasa.com/media/catalog/product/n/g/nguoi-dua-dieu.jpg",
        },
        {
          title: "Hai Số Phận",
          price: "200,000đ",
          discount: "-25%",
          img: "https://cdn0.fahasa.com/media/catalog/product/h/a/haisophan.jpg",
        },
        {
          title: "Đắc Nhân Tâm",
          price: "95,000đ",
          discount: "-10%",
          img: "https://cdn0.fahasa.com/media/catalog/product/d/a/dacnhantam.jpg",
        },
      ],
    },
    {
      section: "Sách Tâm Lý – Kỹ Năng Sống",
      items: [
        {
          title: "Sức Mạnh Của Thói Quen",
          price: "110,000đ",
          discount: "-30%",
          img: "https://cdn0.fahasa.com/media/catalog/product/s/u/suc-manh-cua-thoi-quen.jpg",
        },
        {
          title: "Tư Duy Nhanh Và Chậm",
          price: "130,000đ",
          discount: "-25%",
          img: "https://cdn0.fahasa.com/media/catalog/product/t/u/tu-duy-nhanh-va-cham.jpg",
        },
        {
          title: "7 Thói Quen Hiệu Quả",
          price: "145,000đ",
          discount: "-20%",
          img: "https://cdn0.fahasa.com/media/catalog/product/7/_/7-thoi-quen-hieu-qua.jpg",
        },
        {
          title: "Bạn Đắt Giá Bao Nhiêu",
          price: "99,000đ",
          discount: "-10%",
          img: "https://cdn0.fahasa.com/media/catalog/product/b/a/ban-dat-gia-bao-nhieu.jpg",
        },
        {
          title: "Khéo Ăn Nói Sẽ Có Được Thiên Hạ",
          price: "115,000đ",
          discount: "-20%",
          img: "https://cdn0.fahasa.com/media/catalog/product/k/h/kheo-an-noi-se-co-duoc-thien-ha.jpg",
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
              src={banners[current]}
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
                    <div className={styles.discountTag}>{book.discount}</div>
                    <img
                      src={book.img}
                      alt={book.title}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <p className={styles.productTitle}>{book.title}</p>
                      <p className={styles.productPrice}>{book.price}</p>
                    </div>
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
