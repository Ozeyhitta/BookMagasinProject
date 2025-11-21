"use client";
import { useState, useEffect, useRef } from "react";
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
    {
      label: "Sách Văn Học Trong Nước",
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
    {
      label: "Sách Văn Học Nước Ngoài",
      children: [
        "Cổ Tích & Thần Thoại",
        "Phê Bình Văn Học",
        "Phóng Sự, Ký Sự",
        "Thơ Ca",
        "Tiểu Thuyết",
        "Truyện Kiếm Hiệp - Phiêu Lưu",
        "Truyện Lịch Sử",
        "Truyện Ngắn",
        "Truyện Thiếu Nhi",
        "Truyện Trinh Thám, Vụ Án",
        "Truyện Viễn Tưởng - Kinh Dị",
        "Tự Truyện - Hồi Ký",
        "Tiểu Thuyết Ngôn Tình",
        "Tiểu Thuyết Đam Mỹ",
      ],
    },
    {
      label: "Sách Thưởng Thức Đời Sống",
      children: [
        "Bí Quyết Làm Đẹp",
        "Gia Đình, Nuôi Dạy Con",
        "Nhà Ở, Vật Nuôi",
        "Sách Tâm Lý - Giới Tính",
        "Nữ Công Gia Chánh",
      ],
    },
    {
      label: "Sách Thiếu Nhi",
      children: [
        "Khoa Học Tự Nhiên",
        "Khoa Học Xã Hội",
        "Mỹ Thuật, Âm Nhạc",
        "Sách Ngoại Ngữ",
        "Truyện Tranh",
      ],
    },
    {
      label: "Sách Phát Triển Bản Thân",
      children: [
        "Kỹ Năng Giao Tiếp",
        "Kỹ Năng Lãnh Đạo",
        "Kỹ Năng Quản Lý Thời Gian",
        "Kỹ Năng Giải Quyết Vấn Đề",
        "Kỹ Năng Tư Duy Phê Phán",
      ],
    },
    {
      label: "Sách Tin Học Ngoại Ngữ",
      children: [
        "Giáo Trình Tin Học Văn Phòng",
        "Lập Trình Cơ Bản",
        "Công Nghệ Thông Tin",
        "Sách Học Tiếng Anh",
        "Sách Học Tiếng Nhật",
        "Sách Học Tiếng Hàn",
        "Sách Học Tiếng Trung",
        "Từ Điển Ngoại Ngữ",
      ],
    },
    {
      label: "Sách Chuyên Ngành",
      children: [
        "Y Học",
        "Kỹ Thuật - Công Nghệ",
        "Kiến Trúc - Xây Dựng",
        "Luật Học",
        "Khoa Học Tự Nhiên",
        "Nông - Lâm - Ngư Nghiệp",
        "Khoa Học Xã Hội",
        "Môi Trường - Năng Lượng",
      ],
    },
    {
      label: "Sách Giáo Khoa - Giáo Trình",
      children: [
        "Giáo Trình Đại Học - Cao Đẳng",
        "Giáo Trình Trung Học",
        "Giáo Trình Tiểu Học",
        "Sách Luyện Thi",
        "Sách Bài Tập",
      ],
    },
    {
      label: "Sách Phát Hành 2024",
      children: [
        "Sách Bán Chạy 2024",
        "Sách Văn Học 2024",
        "Sách Kinh Tế 2024",
        "Sách Thiếu Nhi 2024",
      ],
    },
    {
      label: "Sách Mới 2025",
      children: [
        "Sách Nổi Bật 2025",
        "Sách Văn Học 2025",
        "Sách Kinh Tế 2025",
        "Sách Phát Triển Bản Thân 2025",
      ],
    },
    {
      label: "Review Sách",
      children: [
        "Sách Đáng Đọc",
        "Tác Giả Nổi Bật",
        "Sách Được Giải Thưởng",
        "Top 10 Sách Hot",
      ],
    },
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

  // ✅ Dữ liệu sách lấy từ API (DÙNG CHO MỤC "Sách mới cập nhật")
  const [books, setBooks] = useState([]);
  // ✅ Dữ liệu categories lấy từ API
  const [apiCategories, setApiCategories] = useState([]);
  // ✅ Dữ liệu discount cho từng book
  const [discounts, setDiscounts] = useState({});
  const PRODUCTS_PER_BATCH = 12;
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_BATCH);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Thay vì Promise.all, bạn có thể gọi API books và details lần lượt
        const booksRes = await fetch("http://localhost:8080/api/books");
        const booksData = await booksRes.json();

        const detailsRes = await fetch(
          "http://localhost:8080/api/books-details"
        );
        const detailsData = await detailsRes.json();

        // Hợp nhất dữ liệu
        const merged = booksData.map((book) => {
          const matchedDetail = detailsData.find((d) => d.book?.id === book.id);

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

        // Fetch discounts cho tất cả books
        const discountMap = {};
        const now = new Date();
        console.log("Current date:", now);
        console.log("Fetching discounts for", merged.length, "books...");

        // Fetch tất cả discounts song song để tăng tốc
        const discountPromises = merged.map(async (book) => {
          try {
            const discountRes = await fetch(
              `http://localhost:8080/api/book-discounts/book/${book.id}`
            );
            if (discountRes.ok) {
              const discountData = await discountRes.json();
              console.log(`Discounts for book ${book.id}:`, discountData);

              // Luôn lấy discount đầu tiên (không check active - để test/hiển thị tất cả discount)
              // TODO: Sau này có thể thêm logic check active nếu cần
              let activeDiscount = null;

              if (discountData && discountData.length > 0) {
                // Ưu tiên tìm discount active trước
                activeDiscount = discountData.find((discount) => {
                  const startDate = new Date(discount.startDate);
                  const endDate = new Date(discount.endDate);
                  const isActive = now >= startDate && now <= endDate;
                  return isActive;
                });

                // Nếu không có active, lấy discount đầu tiên (để test/hiển thị)
                if (!activeDiscount) {
                  activeDiscount = discountData[0];
                  console.log(
                    `Using first discount for book ${book.id} (not active but for display):`,
                    activeDiscount
                  );
                } else {
                  console.log(
                    `Found active discount for book ${book.id}:`,
                    activeDiscount
                  );
                }
              }

              return { bookId: book.id, discount: activeDiscount };
            } else {
              console.log(`No discount response for book ${book.id}`);
              return { bookId: book.id, discount: null };
            }
          } catch (err) {
            console.error(`Error fetching discount for book ${book.id}:`, err);
            return { bookId: book.id, discount: null };
          }
        });

        // Đợi tất cả promises hoàn thành
        const discountResults = await Promise.all(discountPromises);

        // Map kết quả vào discountMap
        discountResults.forEach(({ bookId, discount }) => {
          if (discount) {
            discountMap[bookId] = discount;
          }
        });

        console.log("Final discount map:", discountMap);
        console.log("Total discounts found:", Object.keys(discountMap).length);
        setDiscounts(discountMap);
      } catch (error) {
        console.error("Lỗi load sách:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_BATCH);
  }, [books.length]);

  useEffect(() => {
    if (!books.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PRODUCTS_PER_BATCH, books.length)
          );
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [books.length]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories");
        const data = await res.json();
        setApiCategories(data);
      } catch (error) {
        console.error("Lỗi load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Biến state cho Promotions (chưa sử dụng trong JSX)
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

  // Dữ liệu gợi ý sách MỚI (để hiển thị dưới danh mục)
  const popularBooks = [
    {
      title: "Đẻ Con Chăm Sóc Sức Khỏe Cho Bé",
      price: "131.200đ",
      oldPrice: "164.000đ",
      discount: "-20%",
      image:
        "https://product.hstatic.net/200000845405/product/9786044026091-1_b46da4d7325a474d9a04b770b0c5297d_master.jpg",
    },
    {
      title: "Bộ Sách Để Con Chăm Sóc Sức Khỏe Cho Bé (2 Cuốn)",
      price: "262.400đ",
      oldPrice: "328.000đ",
      discount: "-20%",
      image:
        "https://product.hstatic.net/200000845405/product/87_950467a8c9aa46aaa2bf4264753bd152_master.jpg",
    },
    {
      title: "Tự Muốn Ăn Tự Muốn Chơi",
      price: "110.400đ",
      oldPrice: "114.000đ",
      discount: "-3%",
      image:
        "https://product.hstatic.net/200000845405/product/8935235241985_1cbe626d4ef343279c493ee51e8077c2_master.jpg",
    },
    {
      title: "Bộ Ba Pháp Thuật",
      price: "55.800đ",
      oldPrice: "62.000đ",
      discount: "-10%",
      image:
        "https://product.hstatic.net/200000845405/product/8935235241749_4b1ad133706e4858847dadf3e76d84d4_master.jpg",
    },
    {
      title: "Bóng Đêm Bất Xí",
      price: "207.000đ",
      oldPrice: "230.000đ",
      discount: "-10%",
      image:
        "https://product.hstatic.net/200000845405/product/8935235241947_4f4289a1c4ed4a608563a9067a9ff926_master.jpg",
    },
    {
      title: "Con Thỏ Nguyền Rủa - Rabbit's Destiny",
      price: "124.200đ",
      oldPrice: "138.000đ",
      discount: "-10%",
      image:
        "https://product.hstatic.net/200000845405/product/8935235241954_ef5feaa815f04b7590d59c45166e19c7_master.jpg",
    },
    {
      title: "Những Giấc Mơ Ở Xứ Sở Xa Lạ",
      price: "103.500đ",
      oldPrice: "115.000đ",
      discount: "-10%",
      image:
        "https://product.hstatic.net/200000845405/product/upload_cf64744ac7654215bad45173fa85b1a3_master.jpg",
    },
  ];
  const displayedBooks = books.slice(0, visibleCount);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.layout}>
        {/* --- CỘT TRÁI: TÁCH DANH MỤC & SÁCH BÁN CHẠY --- */}
        <div className={styles.leftColumn}>
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

          <div className={styles.bestSellerBox}>
            {/* --- START: GỢI Ý SÁCH (Sách Mới Bán Chạy) --- */}
            {/* SỬ DỤNG popularBooks */}
            <div className={styles.suggestionSection}>
              <h4 className={styles.suggestionTitle}>Sách Mới Bán Chạy ✨</h4>
              {popularBooks.map((book, index) => (
                <a href="#" key={index} className={styles.suggestedBookItem}>
                  <div className={styles.suggestedImageContainer}>
                    {/* THẺ HÌNH ẢNH ĐÃ ĐƯỢC THÊM VÀO ĐÂY */}
                    <img
                      src={book.image}
                      alt={book.title}
                      className={styles.suggestedImage}
                    />
                    {book.discount && (
                      <span className={styles.suggestionSaleTag}>
                        {book.discount}
                      </span>
                    )}
                  </div>
                  <div className={styles.suggestedDetails}>
                    <p className={styles.suggestedTitle}>{book.title}</p>
                    <div>
                      <span className={styles.suggestedPriceCurrent}>
                        {book.price}
                      </span>
                      <span className={styles.suggestedPriceOld}>
                        {book.oldPrice}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {/* --- END: GỢI Ý SÁCH --- */}
          </div>
        </div>

        {/* --- CỘT PHẢI: BANNER + PHẦN SÁCH GRID --- */}
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

          {/* --- MỤC: SÁCH MỚI CẬP NHẬT (Lấy từ API) --- */}
          <div className={styles.productSection}>
            <h3 className={styles.sectionTitle}>Sách mới cập nhật (từ API)</h3>
            <div className={styles.productGrid}>
              {displayedBooks.map((book) => {
                const discount = discounts[book.id];

                // Tính giá sau discount - ưu tiên discountPercent nếu có cả 2
                const priceAfterDiscount = discount
                  ? Math.round(
                      discount.discountPercent != null &&
                        discount.discountPercent > 0
                        ? book.price * (1 - discount.discountPercent / 100)
                        : discount.discountAmount != null &&
                          discount.discountAmount > 0
                        ? Math.max(0, book.price - discount.discountAmount)
                        : book.price
                    )
                  : book.price;

                // Hiển thị text discount - ưu tiên discountPercent
                const discountText = discount
                  ? discount.discountPercent != null &&
                    discount.discountPercent > 0
                    ? `-${discount.discountPercent}%`
                    : discount.discountAmount != null &&
                      discount.discountAmount > 0
                    ? `-${discount.discountAmount.toLocaleString("vi-VN")}đ`
                    : null
                  : null;

                console.log(`Rendering ProductCard for book ${book.id}:`, {
                  discount,
                  discountText,
                  price: book.price,
                  priceAfterDiscount,
                });

                return (
                  <ProductCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    price={priceAfterDiscount.toLocaleString("vi-VN") + "đ"}
                    oldPrice={
                      discount ? book.price.toLocaleString("vi-VN") + "đ" : null
                    }
                    discount={discountText}
                    image={book.imageUrl}
                  />
                );
              })}
            </div>
            {displayedBooks.length > 0 && (
              <div ref={loadMoreRef} className={styles.lazyLoader}>
                {visibleCount < books.length
                  ? "Đang tải thêm sách..."
                  : "Đã hiển thị tất cả sách"}
              </div>
            )}
          </div>

          {/* --- PHẦN SÁCH THEO TỪNG DANH MỤC (từ API /api/categories) --- */}
          {apiCategories.map((cat) => {
            // Nếu category không có bookIds thì bỏ qua
            if (!cat.bookIds || cat.bookIds.length === 0) return null;

            // Lọc sách thuộc category này (dùng bookIds)
            const booksInCategory = books.filter((b) =>
              cat.bookIds.includes(b.id)
            );

            // Nếu không có sách nào thì cũng không render
            if (booksInCategory.length === 0) return null;

            return (
              <div key={cat.id} className={styles.productSection}>
                <h3 className={styles.sectionTitle}>{cat.name}</h3>
                <div className={styles.productGrid}>
                  {booksInCategory.map((book) => {
                    const discount = discounts[book.id];

                    // Tính giá sau discount - ưu tiên discountPercent nếu có cả 2
                    const priceAfterDiscount = discount
                      ? Math.round(
                          discount.discountPercent != null &&
                            discount.discountPercent > 0
                            ? book.price * (1 - discount.discountPercent / 100)
                            : discount.discountAmount != null &&
                              discount.discountAmount > 0
                            ? Math.max(0, book.price - discount.discountAmount)
                            : book.price
                        )
                      : book.price;

                    // Hiển thị text discount - ưu tiên discountPercent
                    const discountText = discount
                      ? discount.discountPercent != null &&
                        discount.discountPercent > 0
                        ? `-${discount.discountPercent}%`
                        : discount.discountAmount != null &&
                          discount.discountAmount > 0
                        ? `-${discount.discountAmount.toLocaleString("vi-VN")}đ`
                        : null
                      : null;

                    console.log(
                      `Rendering ProductCard for category book ${book.id}:`,
                      {
                        discount,
                        discountText,
                        price: book.price,
                        priceAfterDiscount,
                      }
                    );

                    return (
                      <ProductCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        price={priceAfterDiscount.toLocaleString("vi-VN") + "đ"}
                        oldPrice={
                          discount
                            ? book.price.toLocaleString("vi-VN") + "đ"
                            : null
                        }
                        discount={discountText}
                        image={book.imageUrl}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
