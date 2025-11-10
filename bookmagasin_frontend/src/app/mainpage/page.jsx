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
      } catch (error) {
        console.error("Lỗi load sách:", error);
      }
    };

    fetchData();
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

  // Dữ liệu sách cũ (để hiển thị dạng grid)
  const booksDataGrid = [
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
          title: "Con Đường Chẳng Mấy Ai Đi",
          price: "110.000đ",
          oldPrice: "165.000đ",
          discount: "-30%",
          image:
            "https://cdn1.fahasa.com/media/catalog/product/9/7/9786044009674.jpg",
        },
        {
          title: "30 Tuổi - Mọi Thứ Chỉ Mới Bắt Đầu",
          price: "91.000đ",
          oldPrice: "135.000đ",
          discount: "-32%",
          image:
            "https://cdn1.fahasa.com/media/catalog/product/8/9/8935278605546.jpg",
        },
        {
          title: "Tư Duy Mở",
          price: "69.000đ",
          oldPrice: "138.000đ",
          discount: "-50%",
          image:
            "https://cdn1.fahasa.com/media/flashmagazine/images/page_images/tu_duy_mo/2025_06_02_16_57_01_1-390x510.jpg?_gl=1*1p4563n*_gcl_au*MTczOTM1NDc3Ni4xNzYyNzYzNjI2*_ga*NzQxNTkxNzUwLjE3NjI3NjM2Mjc.*_ga_D3YYPWQ9LN*czE3NjI3NjM2MjYkbzEkZzEkdDE3NjI3NjM4MjQkajckbDAkaDA.*_ga_460L9JMC2G*czE3NjI3NjM2MjYkbzEkZzEkdDE3NjI3NjM4MjUkajYkbDAkaDY3MjMzNTQ1NQ..",
        },
        {
          title: "Khéo Ăn Nói Sẽ Có Được Thiên Hạ (Tái Bản 2022)",
          price: "91.000đ",
          oldPrice: "130.000đ",
          discount: "-50%",
          image:
            "https://cdn1.fahasa.com/media/catalog/product/8/9/8936067605693.jpg",
        },
        {
          title: "Sức Mạnh Tiềm Thức (Tái Bản 2021)",
          price: "108.000đ",
          oldPrice: "128.000đ",
          discount: "-15%",
          image:
            "https://cdn1.fahasa.com/media/catalog/product/i/m/image_237646.jpg",
        },
        {
          title: "Tư Duy Ngược",
          price: "69.500đ",
          oldPrice: "139.000đ",
          discount: "-50%",
          image:
            "https://cdn1.fahasa.com/media/catalog/product/t/u/tu_duy_nguoc_1_2022_10_21_16_49_32.jpg?_gl=1*j7oyc2*_ga*NzQxNTkxNzUwLjE3NjI3NjM2Mjc.*_ga_D3YYPWQ9LN*czE3NjI3NjM2MjYkbzEkZzEkdDE3NjI3NjQwNTUkajU4JGwwJGgw*_gcl_au*MTczOTM1NDc3Ni4xNzYyNzYzNjI2*_ga_460L9JMC2G*czE3NjI3NjM2MjYkbzEkZzEkdDE3NjI3NjQwNTUkajUyJGwwJGg2NzIzMzU0NTU.",
        },
      ],
    },
    {
      section: "Sách Văn Học",
      items: [
        {
          title: "Nếu biết anh sẽ là người cũ",
          price: "81,200đ",
          oldPrice: "90,000đ",
          discount: "-10%",
          image:
            "https://product.hstatic.net/1000230347/product/2bc3bee6-09cb-4929-b2ec-8b55214d3794_1c65bc9b3b93462c822c779f3fbe5481.jpg",
        },
        {
          title: "Tự truyện Ken Langone: Từ số 0 đến tỷ phú",
          price: "153.000đ",
          oldPrice: "170.000đ",
          discount: "-10%",
          image:
            "https://product.hstatic.net/1000230347/product/89955adf-9e44-49c6-8b6e-d7826f5587dd_1__e9f5203647bf4476827c13ccc4274982.png",
        },
        {
          title: "Vương triều Tudor cuối cùng",
          price: "198.000đ",
          oldPrice: "220.000đ",
          discount: "-10%",
          image:
            "https://product.hstatic.net/1000230347/product/58df01c0-62ff-47eb-85e5-5ce115b9df4a_1__260b5ee2abfa4ec492f027c74207301e.jpg",
        },
        {
          title: "Người có sẵn lòng mang vết thương?",
          price: "72.000đ",
          oldPrice: "80.000đ",
          discount: "-10%",
          image:
            "https://product.hstatic.net/1000230347/product/e6bd05c1-17a7-487b-97f5-7100d7b5273a_5ac28dba7abd4aeb842ba42cb9449bca.jpg",
        },
        {
          title: "Sách Công Chúa Nhỏ (Tái Bản 2024)",
          price: "81.000đ",
          oldPrice: "92.000đ",
          discount: "-12%",
          image:
            "https://down-vn.img.susercontent.com/file/sg-11134201-7rcc5-lsjniw0jrh49de.webp",
        },
        {
          title: "Tuổi Thơ Dữ Dội",
          price: "81.000đ",
          oldPrice: "92.000đ",
          discount: "-12%",
          image:
            "https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-tuoi-tho-du-doi.jpg",
        },
        {
          title: "Ngày vui",
          price: "81.000đ",
          oldPrice: "162.000đ",
          discount: "-50%",
          image:
            "https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-ngay-vui.jpg",
        },
        {
          title: "Con hoang",
          price: "81.000đ",
          oldPrice: "92.000đ",
          discount: "-12%",
          image:
            "https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-con-hoang.jpg",
        },
      ],
    },
    {
      section: "Sách Kinh Tế",
      items: [
        {
          title: "Giữ Người Bằng Tâm - Dẫn Dắt Bằng Tầm",
          price: "125.100đ",
          oldPrice: "139.000đ",
          discount: "-10%",
          image:
            "https://cdn.hstatic.net/products/200000845405/_nh-b_a-1_3_0757e87b90fe44949c322d5ff1dedbae_master.jpg",
        },
        {
          title: "Vương Vệ Và Thuận Phong",
          price: "144.000đ",
          oldPrice: "180.000đ",
          discount: "-20%",
          image:
            "https://cdn.hstatic.net/products/200000845405/8938538124016_73ceaed9661b4796887ac370cbfc0b12_9946967cab5f402098004aba18c99b52_medium.jpg",
        },
        {
          title: "Lãnh Đạo Theo Mục Tiêu",
          price: "206.100đ",
          oldPrice: "229.000đ",
          discount: "-10%",
          image:
            "https://cdn.hstatic.net/products/200000845405/lanh-dao-theo-muc-tieu-01_f897a05d9ac34c3da05f6b268cc1ace8_medium.jpg",
        },
        {
          title: "Quản Lý Nhân Sự Trong Thời Đại Công Nghệ",
          price: "161.100đ",
          oldPrice: "179.000đ",
          discount: "-10%",
          image:
            "https://cdn.hstatic.net/products/200000845405/quan-ly-nhan-su-trong-thoi-dai-cong-nghe-01_f2ca3899964841ee85d86ba72a7c2ea9_master.jpg",
        },
      ],
    },
    {
      section: "Sách Thiếu Nhi",
      items: [
        {
          title: "Vẽ Cho Em Một Màu Bình Yên!",
          price: "151,200đ",
          oldPrice: "168,000đ",
          discount: "-10%",
          image:
            "https://cdn.hstatic.net/products/200000845405/8931805024347_73a23c6b661049478cab231eeda8fc52_master.jpg",
        },
        {
          title: "Sổ Tô Màu Chibi - Thủy Thủ Mặt Trăng Và Biệt Đội Ngân Hà",
          price: "110.000đ",
          oldPrice: "140.000đ",
          discount: "-30%",
          image:
            "https://cdn.hstatic.net/products/200000845405/anh-1_64b73f4298f0423b8d8b32ecd58d1af8_master.jpg",
        },
        {
          title:
            "Tớ Tự Tin Khắc Phục Khó Khăn - Rèn Tính Tự Giác - Những Bài Tự Rèn Luyện Không Thể Thiếu Cho Học Sinh Tiểu Học",
          price: "70.000đ",
          oldPrice: "140.000đ",
          discount: "-50%",
          image:
            "https://cdn.hstatic.net/products/200000845405/to-tu-tin-khac-phuc-kho-khan_ren-tinh-tu-giac_bia_eb2e04c179b24202a0e6ffee638e8046_master.jpg",
        },
        {
          title:
            "Những Cách Thông Minh Để Trở Nên Thông Minh Hơn - Bí Quyết Học Tốt Các Môn Học Ở Trường",
          price: "100.000đ",
          oldPrice: "50.000đ",
          discount: "-50%",
          image:
            "https://cdn.hstatic.net/products/200000845405/nh-de-tro-nen-thong-minh-hon_bi-quyet-hoc-tot-cac-mon-o-truong_tb-2025_2a40ef7e185d4fea99fb973352c0e045_master.jpg",
        },
      ],
    },
    {
      section: "Sách Tin Học - Ngoại Ngữ",
      items: [
        {
          title: "NgườI Giàu Có Nhất Thành Babylon (Tái Bản)",
          price: "91,200đ",
          oldPrice: "114,000đ",
          discount: "-20%",
          image:
            "https://product.hstatic.net/200000845405/product/p97362m8935246937525_1_1da106c981c24a4d9571e8fc9eb88e3a_master.jpg",
        },
        {
          title: "Chiêm Tinh Học - Ứng Dụng Trong Sự Nghiệp Và Tình Yêu",
          price: "104.000đ",
          oldPrice: "130.000đ",
          discount: "-20%",
          image:
            "https://product.hstatic.net/200000845405/product/p97251m8935246933459_55ec2629361647d2825ad72ad6c0b028_master.jpg",
        },
        {
          title: "Mạnh Dạn Buông Bỏ Khi Tình Không Tỏ",
          price: "78.000đ",
          oldPrice: "98.000đ",
          discount: "-20%",
          image:
            "https://product.hstatic.net/200000845405/product/p96715m2022_09_16_16_00_22_1_390x510_0d3a71878d74483eb4c8393c79eb4e1b_master.jpg",
        },
        {
          title:
            "Smart - Ngủ Đủ, Bé Thông Minh - Làm Sao Để Tạo Thói Quen Đi Ngủ Đúng Cho Trẻ",
          price: "78.000đ",
          oldPrice: "98.000đ",
          discount: "-20%",
          image:
            "https://product.hstatic.net/200000845405/product/p96714mscreenshot_2022_09_23_091141_cfe4b69088724e279d9617dfb10cc8fe_master.jpg",
        },
      ],
    },
  ];

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.layout}>
        {/* --- CỘT TRÁI: DANH MỤC + SÁCH MỚI BÁN CHẠY --- */}

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
          {/* Banner Tủ sách Trinh Thám - Kinh Dị */}
          <div
            className={styles.suggestionSection}
            style={{ padding: "0", border: "none", marginTop: "20px" }}
          >
            <img
              src="https://i.pinimg.com/originals/a0/0c/84/a00c841a1c97a5b3a86c6c721b5e54d8.jpg"
              alt="Tủ sách Trinh Thám - Kinh Dị"
              style={{ width: "100%", borderRadius: "6px" }}
            />
          </div>

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

          {/* --- PHẦN SÁCH DẠNG GRID (Dữ liệu tĩnh booksDataGrid) --- */}
          {booksDataGrid.map((section, index) => (
            <div key={index} className={styles.productSection}>
              <h3 className={styles.sectionTitle}>{section.section}</h3>
              <div className={styles.productGrid}>
                {section.items.map((book, i) => (
                  <ProductCard key={i} {...book} image={book.image} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
