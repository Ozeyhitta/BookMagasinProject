"use client";
import { useState, useEffect, useMemo } from "react";
import styles from "./mainpage.module.css";
import ProductCard from "../category/ProductCard"; // ✅ reuse CategoryPage's ProductCard
import { ChevronLeft, ChevronRight, BookText } from "lucide-react";
import { buildApiUrl } from "../../utils/apiConfig";
import { useIsMounted } from "../../utils/hydration-safe";

const FLASH_SALE_VISIBLE_COUNT = 5;
const FLASH_SALE_MAX_ITEMS = 15;
const NEW_SECTION_PAGE_SIZE = 12;
const CATEGORY_SECTION_PAGE_SIZE = 8;
const SUGGESTION_LIMIT = 20;

// Hydration-safe deadline creation - only runs on client
const createFlashSaleDeadline = () => {
  if (typeof window === "undefined") {
    // Return a fixed timestamp during SSR to prevent hydration mismatch
    return Date.now() + 60 * 60 * 1000;
  }
  return Date.now() + 60 * 60 * 1000;
};

// Hydration-safe countdown calculation
const getCountdownFromDeadline = (deadline) => {
  if (typeof window === "undefined") {
    // Return placeholder during SSR
    return {
      hours: "--",
      minutes: "--",
      seconds: "--",
    };
  }
  
  const diff = Math.max(0, deadline - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
};

const FALLBACK_FLASH_SALE_ITEMS = [
  {
    id: null,
    title: '"Chém" Tiếng Anh Không Cần Động Não',
    finalPrice: "101.400 đ",
    oldPrice: "169.000 đ",
    badge: "-40%",
    imageUrl:
      "https://cdn0.fahasa.com/media/catalog/product/9/7/9786043245110.jpg",
    soldQuantity: 3,
    stockQuantity: 12,
  },
  {
    id: null,
    title: "Destination B1 Grammar And Vocabulary",
    finalPrice: "144.000 đ",
    oldPrice: "198.000 đ",
    badge: "-27%",
    imageUrl:
      "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509.jpg",
    soldQuantity: 12,
    stockQuantity: 30,
  },
  {
    id: null,
    title: "Lộ Trình Học Tiếng Anh Cho Người Mất Gốc",
    finalPrice: "134.000 đ",
    oldPrice: "198.000 đ",
    badge: "-32%",
    imageUrl:
      "https://cdn0.fahasa.com/media/catalog/product/b/i/bia_164.jpg",
    soldQuantity: 7,
    stockQuantity: 14,
  },
  {
    id: null,
    title: "Destination B2 Grammar And Vocabulary",
    finalPrice: "144.000 đ",
    oldPrice: "198.000 đ",
    badge: "-27%",
    imageUrl:
      "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195508.jpg",
    soldQuantity: 9,
    stockQuantity: 20,
  },
  {
    id: null,
    title: "Destination B1 Grammar & Vocabulary Key",
    finalPrice: "129.000 đ",
    oldPrice: "178.000 đ",
    badge: "-27%",
    imageUrl:
      "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195507.jpg",
    soldQuantity: 12,
    stockQuantity: 8,
  },
  {
    id: null,
    title: "Combo Tiếng Anh Bino Cho Bé",
    finalPrice: "210.000 đ",
    oldPrice: "300.000 đ",
    badge: "-30%",
    imageUrl:
      "https://cdn0.fahasa.com/media/catalog/product/c/o/combo_bino.jpg",
    soldQuantity: 5,
    stockQuantity: 15,
  },
];

const RANKING_TABS = [
  { id: "literature", label: "Văn học", keywords: ["văn học"] },
  { id: "economy", label: "Kinh tế", keywords: ["kinh tế"] },
  {
    id: "mindset",
    label: "Tâm lý - Kỹ năng sống",
    keywords: ["tâm lý", "kỹ năng", "kĩ năng", "phát triển bản thân"],
  },
  { id: "kids", label: "Thiếu nhi", keywords: ["thiếu nhi"] },
  {
    id: "language",
    label: "Sách học ngoại ngữ",
    keywords: ["ngoại ngữ", "tiếng anh", "tiếng nhật", "tiếng hàn", "tiếng trung"],
  },
  { id: "foreign", label: "Foreign books", keywords: ["foreign", "english"] },
  { id: "others", label: "Thể loại khác", keywords: [] },
];
const RANKING_LIMIT = 10;
const RANKING_MODAL_LIMIT = 10;

const PaginationControls = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const handlePrev = () => onChange(Math.max(1, currentPage - 1));
  const handleNext = () => onChange(Math.min(totalPages, currentPage + 1));
  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Trước
      </button>
      <span className={styles.paginationInfo}>
        Trang {currentPage}/{totalPages}
      </span>
      <button
        className={styles.paginationButton}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Sau
      </button>
    </div>
  );
};

export default function MainPage() {
  const rawCategories = useMemo(
    () => [
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
  ],
    []
  );
  const banners = [
    "https://newshop.vn/public/uploads/landing-page/sach-hay-newshop/banner-mobile.png",
    "https://tudongchat.com/wp-content/uploads/2025/01/stt-ban-sach-5.jpg",
    "https://newshop.vn/public/uploads/news/nhung-cuon-sach-van-hoc-hay.jpg",
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

  // ✅ Dữ liệu sách lấy từ API (DÙNG CHO MỤC "Sách mới cập nhật")
  const [books, setBooks] = useState([]);
  // ✅ Dữ liệu categories lấy từ API
  const [apiCategories, setApiCategories] = useState([]);
  const topCategories = useMemo(
    () =>
      apiCategories
        .filter((cat) => cat.parentId === null || cat.parentId === undefined)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [apiCategories]
  );
  // ✅ Dữ liệu discount cho từng book
  const [discounts, setDiscounts] = useState({});
  const [newSectionPage, setNewSectionPage] = useState(1);
  const [categoryPages, setCategoryPages] = useState({});
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellerError, setBestSellerError] = useState(null);
  const BEST_SELLER_LIMIT = 8;
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId ?? null);
  };
  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiB2aWV3Qm94PSIwIDAgMjAwIDI4MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyODAiIHJ4PSIxNiIgZmlsbD0iI2YzZjZmYiIvPjxwYXRoIGQ9Ik02OCAxOTBMOTAgMTU4TDExMSAxODhMMTMxIDE2NEwxNjAgMjA4SDQwTDY4IDE5MFoiIGZpbGw9IiNkNWRlZWYiLz48Y2lyY2xlIGN4PSI5MCIgY3k9IjEyMCIgcj0iMzAiIGZpbGw9IiNkNWRlZWYiLz48dGV4dCB4PSIxMDAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlhYThjMSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
  const handleImageError = (event) => {
    event.currentTarget.src = placeholderImage;
    event.currentTarget.onerror = null;
  };
  const [activeRankingTab, setActiveRankingTab] = useState(RANKING_TABS[0].id);
  const [selectedRankingBook, setSelectedRankingBook] = useState(null);
  const [flashSaleSlide, setFlashSaleSlide] = useState(0);
  const [flashSaleDeadline, setFlashSaleDeadline] = useState(null);
  const [flashSaleCountdown, setFlashSaleCountdown] = useState({
    hours: "--",
    minutes: "--",
    seconds: "--",
  });
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showFlashSaleModal, setShowFlashSaleModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const filteredBooks = useMemo(() => {
    if (!selectedCategoryId) return books;
    return books.filter((book) =>
      (book.categories || []).some((c) => c.id === selectedCategoryId)
    );
  }, [books, selectedCategoryId]);
  const newSectionTotalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / NEW_SECTION_PAGE_SIZE) || 1
  );
  const displayedBooks = useMemo(() => {
    const startIndex = (newSectionPage - 1) * NEW_SECTION_PAGE_SIZE;
    return filteredBooks.slice(
      startIndex,
      startIndex + NEW_SECTION_PAGE_SIZE
    );
  }, [filteredBooks, newSectionPage]);

  const formatCurrency = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return "";
    return value.toLocaleString("vi-VN") + "đ";
  };

  const getPricingForBook = (book) => {
    const discount = discounts[book.id];
    const basePrice =
      typeof book.sellingPrice === "number"
        ? book.sellingPrice
        : typeof book.price === "number"
        ? book.price
        : 0;
    if (!basePrice) {
      return { finalPrice: "", oldPrice: "", badge: null };
    }

    let finalPrice = basePrice;
    let badge = null;

    if (discount) {
      if (discount.discountPercent && discount.discountPercent > 0) {
        finalPrice = Math.max(
          0,
          basePrice * (1 - discount.discountPercent / 100)
        );
        badge = `-${discount.discountPercent}%`;
      } else if (discount.discountAmount && discount.discountAmount > 0) {
        finalPrice = Math.max(0, basePrice - discount.discountAmount);
        badge = `-${discount.discountAmount.toLocaleString("vi-VN")}đ`;
      }
    }

    return {
      finalPrice: formatCurrency(Math.round(finalPrice)),
      oldPrice: badge ? formatCurrency(Math.round(basePrice)) : "",
      badge,
    };
  };

  const isMounted = useIsMounted();

  useEffect(() => {
    // Only initialize countdown after component has mounted (client-side)
    if (!isMounted) return;

    const initialDeadline = createFlashSaleDeadline();
    setFlashSaleDeadline(initialDeadline);
    setFlashSaleCountdown(getCountdownFromDeadline(initialDeadline));
  }, [isMounted]);

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

          const stockQuantity =
            typeof book.stockQuantity === "number" ? book.stockQuantity : 0;
          const soldQuantity =
            typeof book.soldQuantity === "number" ? book.soldQuantity : 0;
          const detailImage =
            book.bookDetail?.imageUrl || matchedDetail?.imageUrl;

          return {
            id: book.id,
            title: book.title,
            price: book.sellingPrice,
            sellingPrice:
              typeof book.sellingPrice === "number"
                ? book.sellingPrice
                : book.price,
            imageUrl:
              detailImage ||
              "https://via.placeholder.com/200x280?text=No+Image",
            stockQuantity,
            soldQuantity,
            bookDetail: book.bookDetail || matchedDetail || null,
            categories: book.categories || [],
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
    setNewSectionPage(1);
  }, [filteredBooks.length]);

  useEffect(() => {
    if (newSectionPage > newSectionTotalPages) {
      setNewSectionPage(newSectionTotalPages);
    }
  }, [newSectionPage, newSectionTotalPages]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch(
          buildApiUrl(`/api/books/top-selling?limit=${BEST_SELLER_LIMIT}`)
        );
        if (!res.ok) throw new Error("Failed to fetch best sellers");
        const data = await res.json();
        setBestSellers(data);
        setBestSellerError(null);
      } catch (error) {
        console.warn("Lỗi load sách bán chạy:", error);
        setBestSellerError("Không thể tải danh sách bán chạy");
      }
    };

    fetchBestSellers();
  }, []);

  useEffect(() => {
    // Only run countdown timer after component has mounted
    if (!isMounted || !flashSaleDeadline) return undefined;

    const updateCountdown = () => {
      const diff = flashSaleDeadline - Date.now();
      if (diff <= 0) {
        const nextDeadline = createFlashSaleDeadline();
        setFlashSaleDeadline(nextDeadline);
        setFlashSaleCountdown(getCountdownFromDeadline(nextDeadline));
      } else {
        setFlashSaleCountdown(getCountdownFromDeadline(flashSaleDeadline));
      }
    };

    updateCountdown();
    const tick = setInterval(updateCountdown, 1000);

    return () => clearInterval(tick);
  }, [flashSaleDeadline, isMounted]);

  useEffect(() => {
    if (bestSellers.length > 0 || books.length === 0) return;
    const derived = [...books]
      .filter((book) => typeof book.soldQuantity === "number")
      .sort((a, b) => (b.soldQuantity ?? 0) - (a.soldQuantity ?? 0))
      .slice(0, BEST_SELLER_LIMIT);
    if (derived.length) {
      setBestSellers(derived);
      setBestSellerError(null);
    }
  }, [books, bestSellers.length]);

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
  const fallbackBestSellers = [
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
  const flashSaleItems = useMemo(() => {
    const discounted = books
      .map((book) => {
        const discount = discounts[book.id];
        if (!discount) return null;
        const pricing = getPricingForBook(book);
        if (!pricing.badge || !pricing.finalPrice) return null;

        const basePrice =
          typeof book.sellingPrice === "number"
            ? book.sellingPrice
            : typeof book.price === "number"
            ? book.price
            : 0;
        const discountPercent =
          discount.discountPercent ??
          (discount.discountAmount && basePrice
            ? Math.round((discount.discountAmount / basePrice) * 100)
            : 0);

        return {
          id: book.id,
          title: book.title,
          imageUrl: book.imageUrl || placeholderImage,
          finalPrice: pricing.finalPrice,
          oldPrice: pricing.oldPrice,
          badge: pricing.badge,
          soldQuantity: book.soldQuantity ?? 0,
          stockQuantity: book.stockQuantity ?? 0,
          discountPercent: discountPercent || 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));

    if (!discounted.length) {
      return FALLBACK_FLASH_SALE_ITEMS;
    }

    return discounted.slice(0, FLASH_SALE_MAX_ITEMS);
  }, [books, discounts]);

  const filteredFlashSaleItems = useMemo(() => {
    if (!selectedCategoryId) return flashSaleItems;
    return flashSaleItems.filter((item) => {
      const book = books.find((b) => b.id === item.id);
      if (!book) return false;
      return (book.categories || []).some((cat) => cat.id === selectedCategoryId);
    });
  }, [flashSaleItems, books, selectedCategoryId]);

  const activeFlashSaleItems = selectedCategoryId
    ? filteredFlashSaleItems
    : flashSaleItems;

  const flashSaleSlides = useMemo(() => {
    const source = selectedCategoryId ? filteredFlashSaleItems : flashSaleItems;
    if (!source.length) return [[]];
    const slides = [];
    for (let i = 0; i < source.length; i += FLASH_SALE_VISIBLE_COUNT) {
      slides.push(source.slice(i, i + FLASH_SALE_VISIBLE_COUNT));
    }
    return slides;
  }, [flashSaleItems, filteredFlashSaleItems, selectedCategoryId]);

  const totalFlashSaleSlides = flashSaleSlides.length || 1;
  const flashSaleHasMultipleSlides = totalFlashSaleSlides > 1;

  useEffect(() => {
    setFlashSaleSlide(0);
  }, [totalFlashSaleSlides]);

  const FlashSaleSection = ({ title, showSeeAll = true }) => (
    <div className={styles.flashSaleSection}>
      <div className={styles.flashSaleHeader}>
        <div className={styles.flashSaleTitleRow}>
          <span className={styles.flashSaleLabel}>{title}</span>
          <span className={styles.flashSaleCountdownLabel}>Kết thúc trong</span>
          <div className={styles.flashSaleCountdown}>
            <div className={styles.flashSaleTimeBox}>
              <span>{flashSaleCountdown.hours}</span>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.flashSaleTimeBox}>
              <span>{flashSaleCountdown.minutes}</span>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.flashSaleTimeBox}>
              <span>{flashSaleCountdown.seconds}</span>
            </div>
          </div>
        </div>
        <div className={styles.flashSaleActions}>
          {showSeeAll && activeFlashSaleItems.length > 0 && (
            <button
              type="button"
              className={styles.flashSaleSeeAll}
              onClick={() => setShowFlashSaleModal(true)}
            >
              Xem tất cả
            </button>
          )}
        </div>
      </div>
      {activeFlashSaleItems.length === 0 ? (
        <p className={styles.emptyCategory}>Chua co Flash Sale cho danh muc nay.</p>
      ) : (
        <div className={styles.flashSaleCarousel}>
          <button
            className={`${styles.flashSaleControl} ${styles.flashSaleControlPrev}`}
            onClick={handleFlashSalePrev}
            disabled={!flashSaleHasMultipleSlides}
            aria-label="Flash sale previous"
          >
            <ChevronLeft size={18} />
          </button>
          <div className={styles.flashSaleViewport}>
            <div className={styles.flashSaleTrack} style={flashSaleTrackStyle}>
              {flashSaleSlides.map((slide, slideIndex) => (
                <div className={styles.flashSaleSlide} key={`flash-sale-slide-${slideIndex}`}>
                  {slide.map((item, cardIndex) => {
                    const sold = item.soldQuantity ?? 0;
                    const stock = item.stockQuantity ?? 0;
                    const totalUnits = sold + stock;
                    const progress =
                      totalUnits > 0
                        ? Math.min(100, Math.round((sold / totalUnits) * 100))
                        : sold > 0
                        ? 100
                        : 0;
                    const soldText =
                      sold > 0
                        ? `Da ban ${sold}`
                        : stock === 0
                        ? "Sap het"
                        : "Vua mo ban";
                    const card = (
                      <div className={styles.flashSaleCard}>
                        <div className={styles.flashSaleImageWrap}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className={styles.flashSaleImage}
                          />
                          {item.badge && (
                            <span className={styles.flashSaleDiscount}>{item.badge}</span>
                          )}
                        </div>
                        <p className={styles.flashSaleTitle}>{item.title}</p>
                        <div className={styles.flashSalePrices}>
                          <span className={styles.flashSalePrice}>{item.finalPrice}</span>
                          {item.oldPrice && (
                            <span className={styles.flashSaleOldPrice}>{item.oldPrice}</span>
                          )}
                        </div>
                        <div className={styles.flashSaleProgress}>
                          <div className={styles.flashSaleProgressBar}>
                            <span
                              className={styles.flashSaleProgressFill}
                              style={{ width: `${progress}%` }}
                            ></span>
                          </div>
                          <span className={styles.flashSaleSoldText}>{soldText}</span>
                        </div>
                      </div>
                    );
                    const key = item.id ?? `fallback-${slideIndex}-${cardIndex}`;
                    return item.id ? (
                      <a key={key} href={`/product/${item.id}`} className={styles.flashSaleLink}>
                        {card}
                      </a>
                    ) : (
                      <div
                        key={key}
                        className={`${styles.flashSaleLink} ${styles.flashSaleLinkDisabled}`}
                      >
                        {card}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <button
            className={`${styles.flashSaleControl} ${styles.flashSaleControlNext}`}
            onClick={handleFlashSaleNext}
            disabled={!flashSaleHasMultipleSlides}
            aria-label="Flash sale next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const rankingList = useMemo(() => {
    if (!books.length) return [];
    const tab = RANKING_TABS.find((item) => item.id === activeRankingTab);
    let sourceBooks = books;
    if (tab && tab.keywords.length) {
      const keywords = tab.keywords.map((k) => k.toLowerCase());
      const filtered = books.filter((book) =>
        (book.categories || []).some((cat) => {
          if (!cat?.name) return false;
          const name = cat.name.toLowerCase();
          return keywords.some((keyword) => name.includes(keyword));
        })
      );
      if (filtered.length) {
        sourceBooks = filtered;
      }
    }
    return [...sourceBooks]
      .sort(
        (a, b) =>
          (b.soldQuantity ?? 0) - (a.soldQuantity ?? 0) ||
          (b.stockQuantity ?? 0) - (a.stockQuantity ?? 0)
      )
      .slice(0, RANKING_LIMIT);
  }, [books, activeRankingTab]);

  useEffect(() => {
    if (rankingList.length) {
      setSelectedRankingBook(rankingList[0]);
    } else {
      setSelectedRankingBook(null);
    }
  }, [rankingList]);

  const suggestionBooks = useMemo(() => {
    const preferred = books
      .filter((book) =>
        (book.categories || []).some((c) => c.name?.toLowerCase().includes("2025"))
      )
      .sort((a, b) => (b.soldQuantity ?? 0) - (a.soldQuantity ?? 0));
    const combined = [...preferred];
    if (combined.length < SUGGESTION_LIMIT) {
      books.forEach((book) => {
        if (combined.length >= SUGGESTION_LIMIT) return;
        if (!combined.includes(book)) combined.push(book);
      });
    }
    if (combined.length < SUGGESTION_LIMIT) {
      fallbackBestSellers.forEach((fallback, index) => {
        if (combined.length >= SUGGESTION_LIMIT) return;
        const parsePrice = (value) => {
          if (typeof value === "number") return value;
          if (typeof value === "string") {
            const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10);
            return Number.isNaN(numeric) ? 0 : numeric;
          }
          return 0;
        };
        combined.push({
          id: `suggest-fallback-${index}`,
          title: fallback.title,
          price: parsePrice(fallback.price),
          sellingPrice: parsePrice(fallback.price),
          imageUrl: fallback.image,
          stockQuantity: 0,
          soldQuantity: parseInt(
            fallback.soldQuantity?.replace(/[^0-9]/g, "") || "0",
            10
          ),
          bookDetail: { authorName: fallback.author || "Đang cập nhật" },
          categories: [],
        });
      });
    }
    return combined.slice(0, SUGGESTION_LIMIT);
  }, [books]);

  const handleFlashSalePrev = () => {
    setFlashSaleSlide((prev) =>
      prev === 0 ? totalFlashSaleSlides - 1 : prev - 1
    );
  };

  const handleFlashSaleNext = () => {
    setFlashSaleSlide((prev) =>
      prev === totalFlashSaleSlides - 1 ? 0 : prev + 1
    );
  };

  const flashSaleTrackStyle = {
    transform: `translateX(-${flashSaleSlide * 100}%)`,
  };

  const rankingDescription =
    selectedRankingBook?.bookDetail?.description ||
    selectedRankingBook?.bookDetail?.shortDescription ||
    "Nội dung đang được cập nhật.";

  const rankingCover =
    selectedRankingBook?.bookDetail?.imageUrl ||
    selectedRankingBook?.imageUrl ||
    placeholderImage;
  const selectedRankingPricing = selectedRankingBook
    ? getPricingForBook(selectedRankingBook)
    : null;
  const rankingModalList = rankingList.slice(0, RANKING_MODAL_LIMIT);

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
              <li
                className={`${styles.categoryItem} ${
                  selectedCategoryId === null ? styles.activeCategory : ""
                }`}
                onClick={() => handleCategoryClick(null)}
              >
                <span className={styles.categoryIcon}></span>
                <span className={styles.categoryText}>Tất cả sản phẩm</span>
              </li>
              {topCategories.length === 0 && (
                <li className={`${styles.categoryItem} ${styles.disabledItem}`}>
                  <span>Đang tải danh mục...</span>
                </li>
              )}
              {topCategories.map((cat) => (
                <li
                  key={cat.id}
                  className={`${styles.categoryItem} ${
                    selectedCategoryId === cat.id ? styles.activeCategory : ""
                  }`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className={styles.categoryIcon}></span>
                  <span className={styles.categoryText}>{cat.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.bestSellerBox}>
            {/* --- START: GỢI Ý SÁCH (Sách Mới Bán Chạy) --- */}
            {/* Hiển thị fallback khi API không phản hồi */}
            <div className={styles.suggestionSection}>
              <h4 className={styles.suggestionTitle}>Sách Mới Bán Chạy ✨</h4>
              {bestSellerError && (
                <p className={styles.suggestionNote}>{bestSellerError}</p>
              )}
              {bestSellers.length > 0
                ? bestSellers.map((book) => {
                    const { finalPrice, oldPrice, badge } = getPricingForBook(
                      book
                    );
                    const soldText =
                      typeof book.soldQuantity === "number" &&
                      book.soldQuantity > 0
                        ? `Đã bán ${book.soldQuantity}`
                        : null;
                    const cover =
                      book.bookDetail?.imageUrl ||
                      book.imageUrl ||
                      placeholderImage;
                    return (
                      <a
                        href={`/product/${book.id}`}
                        key={book.id}
                        className={styles.suggestedBookItem}
                      >
                        <div className={styles.suggestedImageContainer}>
                          <img
                            src={cover}
                            alt={book.title}
                            className={styles.suggestedImage}
                          />
                          {badge && (
                            <span className={styles.suggestionSaleTag}>
                              {badge}
                            </span>
                          )}
                        </div>
                        <div className={styles.suggestedDetails}>
                          <p className={styles.suggestedTitle}>{book.title}</p>
                          <div>
                            <span className={styles.suggestedPriceCurrent}>
                              {finalPrice || formatCurrency(book.sellingPrice)}
                            </span>
                            {oldPrice && (
                              <span className={styles.suggestedPriceOld}>
                                {oldPrice}
                              </span>
                            )}
                          </div>
                          {soldText && (
                            <div className={styles.suggestedMeta}>
                              <span className={styles.soldChip}>{soldText}</span>
                            </div>
                          )}
                        </div>
                      </a>
                    );
                  })
                : fallbackBestSellers.map((book, index) => (
                    <a
                      href="#"
                      key={index}
                      className={styles.suggestedBookItem}
                    >
                      <div className={styles.suggestedImageContainer}>
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

        {!selectedCategoryId && (
          <FlashSaleSection title="FLASH SALE" />
        )}
            {/* --- MỤC: SÁCH MỚI CẬP NHẬT (Lấy từ API) --- */}
          {!selectedCategoryId && (
          <div className={styles.productSection}>
            <h3 className={styles.sectionTitle}>Sách mới cập nhật (từ API)</h3>
            <div className={styles.productGrid}>
              {displayedBooks.length === 0 && (
                <p className={styles.emptyCategory}>
                  Không tìm thấy sách trong danh mục đã chọn.
                </p>
              )}
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
                    stockQuantity={book.stockQuantity}
                    soldQuantity={book.soldQuantity}
                  />
                );
              })}
            </div>
            <PaginationControls
              currentPage={newSectionPage}
              totalPages={newSectionTotalPages}
              onChange={setNewSectionPage}
            />
          </div>
          )}

          {!selectedCategoryId && (
          <div className={styles.rankingSection}>
            <div className={styles.rankingHeader}>
              <h3 className={styles.rankingTitle}>Bảng xếp hạng bán chạy tuần</h3>
              <div className={styles.rankingTabs}>
                {RANKING_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`${styles.rankingTabButton} ${
                      activeRankingTab === tab.id ? styles.activeRankingTab : ""
                    }`}
                    onClick={() => setActiveRankingTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.rankingContent}>
              <div className={styles.rankingList}>
                {rankingList.length === 0 && (
                  <p className={styles.rankingEmpty}>
                    Chưa có dữ liệu cho tab này.
                  </p>
                )}
                {rankingList.map((book, index) => {
                  const isActive = selectedRankingBook?.id === book.id;
                  const cover =
                    book.bookDetail?.imageUrl || book.imageUrl || placeholderImage;
                  return (
                    <button
                      key={book.id ?? `ranking-${index}`}
                      className={`${styles.rankingListItem} ${
                        isActive ? styles.activeRankingItem : ""
                      }`}
                      onClick={() => setSelectedRankingBook(book)}
                    >
                      <span className={styles.rankingPosition}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className={styles.rankingThumbWrap}>
                        <img
                          src={cover}
                          alt={book.title}
                          className={styles.rankingThumb}
                          onError={handleImageError}
                        />
                      </div>
                      <div className={styles.rankingInfo}>
                        <p className={styles.rankingBookTitle}>{book.title}</p>
                        <span className={styles.rankingMeta}>
                          {(book.bookDetail?.authorName ||
                            book.bookDetail?.author ||
                            "Đang cập nhật") +
                            (book.soldQuantity
                              ? ` • ${book.soldQuantity} lượt bán`
                              : "")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={styles.rankingDetail}>
                {selectedRankingBook ? (
                  <>
                    <div className={styles.rankingDetailImage}>
                      <img
                        src={rankingCover}
                        alt={selectedRankingBook.title}
                        onError={handleImageError}
                      />
                    </div>
                    <div className={styles.rankingDetailInfo}>
                      <h4 className={styles.rankingDetailTitle}>
                        {selectedRankingBook.title}
                      </h4>
                      <p className={styles.rankingDetailMeta}>
                        Tác giả:{" "}
                        <strong>
                          {selectedRankingBook.bookDetail?.authorName ||
                            selectedRankingBook.bookDetail?.author ||
                            "Đang cập nhật"}
                        </strong>
                      </p>
                      <p className={styles.rankingDetailMeta}>
                        Nhà xuất bản:{" "}
                        <strong>
                          {selectedRankingBook.bookDetail?.publisher ||
                            "Đang cập nhật"}
                        </strong>
                      </p>
                      <div className={styles.rankingDetailPriceWrap}>
                        <span className={styles.rankingDetailPrice}>
                          {selectedRankingPricing?.finalPrice ||
                            formatCurrency(selectedRankingBook.sellingPrice)}
                        </span>
                        {selectedRankingPricing?.badge && (
                          <span className={styles.rankingDetailBadge}>
                            {selectedRankingPricing.badge}
                          </span>
                        )}
                        {selectedRankingPricing?.oldPrice && (
                          <span className={styles.rankingDetailOldPrice}>
                            {selectedRankingPricing.oldPrice}
                          </span>
                        )}
                      </div>
                      <p className={styles.rankingDetailDesc}>
                        {rankingDescription}
                      </p>
                      {selectedRankingBook.id && (
                        <a
                          href={`/product/${selectedRankingBook.id}`}
                          className={styles.rankingDetailButton}
                        >
                          Xem chi tiết
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={styles.rankingEmpty}>Chưa có dữ liệu.</div>
                )}
              </div>
            </div>

            <div className={styles.rankingFooter}>
              <button
                type="button"
                className={styles.rankingViewMore}
                onClick={() => setShowRankingModal(true)}
              >
                Xem thêm
              </button>
            </div>
          </div>
          )}

          {/* --- PHẦN SÁCH THEO TỪNG DANH MỤC (từ API /api/categories) --- */}
          {apiCategories.map((cat) => {
            if (selectedCategoryId && cat.id !== selectedCategoryId) {
              return null;
            }
            if (!cat.bookIds || cat.bookIds.length === 0) return null;
            const booksInCategory = books.filter((b) =>
              cat.bookIds.includes(b.id)
            );
            if (booksInCategory.length === 0) return null;
            const totalCategoryPages = Math.max(
              1,
              Math.ceil(booksInCategory.length / CATEGORY_SECTION_PAGE_SIZE)
            );
            const currentCategoryPage = Math.min(
              categoryPages[cat.id] || 1,
              totalCategoryPages
            );
            const startIndex =
              (currentCategoryPage - 1) * CATEGORY_SECTION_PAGE_SIZE;
            const displayedCategoryBooks = booksInCategory.slice(
              startIndex,
              startIndex + CATEGORY_SECTION_PAGE_SIZE
            );
            const handleCategoryPageChange = (page) =>
              setCategoryPages((prev) => ({ ...prev, [cat.id]: page }));
            const isActiveCategory = selectedCategoryId === cat.id;

            return (
              <div key={cat.id} className={styles.productSection}>
                <h3 className={styles.sectionTitle}>{cat.name}</h3>
                {isActiveCategory && (
                  <div className={styles.categoryFlashSaleWrapper}>
                    <FlashSaleSection
                      title={`Flash Sale - ${cat.name}`}
                      showSeeAll={false}
                    />
                  </div>
                )}
                <div className={styles.productGrid}>
                  {displayedCategoryBooks.map((book) => {
                    const discount = discounts[book.id];

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

                    const discountText = discount
                      ? discount.discountPercent != null &&
                        discount.discountPercent > 0
                        ? "-" + discount.discountPercent + "%"
                        : discount.discountAmount != null &&
                          discount.discountAmount > 0
                        ? "-" +
                          discount.discountAmount.toLocaleString("vi-VN") +
                          "d"
                        : null
                      : null;

                    console.log(
                      "Rendering ProductCard for category book " + book.id + ":",
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
                        price={priceAfterDiscount.toLocaleString("vi-VN") + "d"}
                        oldPrice={
                          discount
                            ? book.price.toLocaleString("vi-VN") + "d"
                            : null
                        }
                        discount={discountText}
                        image={book.imageUrl}
                        stockQuantity={book.stockQuantity}
                        soldQuantity={book.soldQuantity}
                      />
                    );
                  })}
                </div>
                <PaginationControls
                  currentPage={currentCategoryPage}
                  totalPages={totalCategoryPages}
                  onChange={handleCategoryPageChange}
                />
              </div>
            );
          })}

          <div className={styles.suggestionHighlight}>
            <div className={styles.suggestionHighlightHeader}>
              <div className={styles.suggestionHighlightTitle}>
                <span className={styles.suggestionTag}>Personalized</span>
                <h3>Gợi ý sách cho bạn</h3>
                <p>Gợi ý dựa trên thói quen và đơn gần đây của bạn.</p>
              </div>
              <button
                type="button"
                className={styles.suggestionHighlightSeeAll}
                onClick={() => setShowSuggestionModal(true)}
              >
                Xem thêm
              </button>
            </div>
            <div className={styles.productGrid}>
              {suggestionBooks.slice(0, 12).map((book) => {
                const price = getPricingForBook(book);
                return (
                  <ProductCard
                    key={`suggestion-${book.id}`}
                    id={book.id}
                    title={book.title}
                    price={price.finalPrice || formatCurrency(book.sellingPrice)}
                    oldPrice={price.oldPrice}
                    discount={price.badge}
                    image={book.imageUrl || placeholderImage}
                    stockQuantity={book.stockQuantity}
                    soldQuantity={book.soldQuantity}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showRankingModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowRankingModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Bảng xếp hạng top {rankingModalList.length}</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowRankingModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalTabs}>
              {RANKING_TABS.map((tab) => (
                <button
                  key={`modal-${tab.id}`}
                  className={`${styles.modalTab} ${
                    activeRankingTab === tab.id ? styles.activeModalTab : ""
                  }`}
                  onClick={() => setActiveRankingTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={styles.modalList}>
              {rankingModalList.length === 0 && (
                <p className={styles.rankingEmpty}>
                  Chưa có dữ liệu cho tab này.
                </p>
              )}
              {rankingModalList.map((book, index) => {
                const cover =
                  book.bookDetail?.imageUrl || book.imageUrl || placeholderImage;
                return (
                  <div key={`modal-item-${book.id ?? index}`} className={styles.modalListItem}>
                    <span className={styles.modalIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <img
                      src={cover}
                      alt={book.title}
                      onError={handleImageError}
                    />
                    <div>
                      <p className={styles.modalBookTitle}>{book.title}</p>
                      <span className={styles.modalBookMeta}>
                        {book.bookDetail?.authorName ||
                          book.bookDetail?.author ||
                          "Đang cập nhật"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowRankingModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showFlashSaleModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowFlashSaleModal(false)}
        >
          <div
            className={styles.flashModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Flash Sale - xem tất cả</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowFlashSaleModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.flashModalList}>
              {flashSaleItems.length === 0 && (
                <p className={styles.rankingEmpty}>
                  Chưa có sản phẩm flash sale nào.
                </p>
              )}
              {flashSaleItems.map((item, index) => {
                const sold = item.soldQuantity ?? 0;
                const stock = item.stockQuantity ?? 0;
                const total = sold + stock;
                const progress =
                  total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;
                return (
                  <div
                    key={`flash-modal-${item.id ?? index}`}
                    className={styles.flashModalItem}
                  >
                    <span className={styles.flashModalIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={handleImageError}
                    />
                    <div className={styles.flashModalInfo}>
                      <div className={styles.flashModalTitleRow}>
                        <p>{item.title}</p>
                        {item.badge && (
                          <span className={styles.flashModalBadge}>{item.badge}</span>
                        )}
                      </div>
                      <div className={styles.flashModalPriceRow}>
                        <span className={styles.flashModalPrice}>
                          {item.finalPrice}
                        </span>
                        {item.oldPrice && (
                          <span className={styles.flashModalOldPrice}>
                            {item.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className={styles.flashModalProgress}>
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <div className={styles.flashModalMeta}>
                        Đã bán {sold} / {total || "∞"}
                      </div>
                    </div>
                    {item.id && (
                      <a
                        className={styles.flashModalButton}
                        href={`/product/${item.id}`}
                      >
                        Xem chi tiết
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowFlashSaleModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuggestionModal && (
        <div
          className={styles.suggestionModalOverlay}
          onClick={() => setShowSuggestionModal(false)}
        >
          <div
            className={styles.suggestionModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.suggestionModalHeader}>
              <div>
                <p className={styles.suggestionModalSubtitle}>
                  Những lựa chọn phù hợp với bạn
                </p>
                <h3>Danh sách gợi ý mở rộng</h3>
              </div>
              <button
                className={styles.suggestionModalClose}
                onClick={() => setShowSuggestionModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.suggestionModalGrid}>
              {suggestionBooks.slice(0, 20).map((book, index) => {
                const price = getPricingForBook(book);
                const sold =
                  typeof book.soldQuantity === "number" ? book.soldQuantity : 0;
                return (
                  <div
                    key={`suggestion-modal-${book.id ?? index}`}
                    className={styles.suggestionModalCard}
                  >
                    <span className={styles.suggestionModalIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <img
                      src={book.imageUrl || placeholderImage}
                      alt={book.title}
                      onError={handleImageError}
                    />
                    <div className={styles.suggestionModalInfo}>
                      <p className={styles.suggestionModalTitle}>{book.title}</p>
                      <span className={styles.suggestionModalAuthor}>
                        {book.bookDetail?.authorName || "Đang cập nhật"}
                      </span>
                      <div className={styles.suggestionModalPriceRow}>
                        <span className={styles.suggestionModalPrice}>
                          {price.finalPrice || formatCurrency(book.sellingPrice)}
                        </span>
                        {price.oldPrice && (
                          <span className={styles.suggestionModalOldPrice}>
                            {price.oldPrice}
                          </span>
                        )}
                      </div>
                      <span className={styles.suggestionModalSold}>
                        Đã bán {sold} lượt
                      </span>
                    </div>
                    <a
                      href={`/product/${book.id}`}
                      className={styles.suggestionModalButton}
                    >
                      Xem chi tiết
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



