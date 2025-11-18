"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import styles from "./SearchPage.module.css";
import ProductCard from "../category/ProductCard";

// Danh sách các mức giá tối đa cho dropdown
const PRICE_OPTIONS = [
    { value: "all", label: "Mức giá: Tất cả" },
    { value: 100000, label: "Dưới 100.000đ" },
    { value: 200000, label: "Dưới 200.000đ" },
    { value: 300000, label: "Dưới 300.000đ" },
    { value: 400000, label: "Dưới 400.000đ" },
    { value: 500000, label: "Dưới 500.000đ" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get("keyword") || "").trim();

  const [filters, setFilters] = useState({
    category: "all",
    author: "all", 
    publisher: "all",
    supplier: "all",
    priceMax: "all", 
    sort: "default",
  });

  const [books, setBooks] = useState([]); 
  // booksToFilter: Danh sách sách đã merge (có author, publisher, supplier)
  const [booksToFilter, setBooksToFilter] = useState([]); 
  const [allBooksData, setAllBooksData] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);


  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'priceMax' && value !== 'all') {
        value = parseInt(value, 10);
    }
    setFilters({ ...filters, [e.target.name]: value });
  };
  
  // =================================================================
  // LỌC VÀ SẮP XẾP SÁCH THEO FILTERS HIỆN TẠI (MỚI)
  const applyFilterAndSort = useCallback((dataToFilter, currentFilters) => {
    let filteredAndSortedBooks = dataToFilter;

    // 1. LỌC THEO TÁC GIẢ
    if (currentFilters.author !== 'all') {
      filteredAndSortedBooks = filteredAndSortedBooks.filter(book => 
        book.author === currentFilters.author
      );
    }

    // 2. LỌC THEO NHÀ PHÁT HÀNH
    if (currentFilters.publisher !== 'all') {
      filteredAndSortedBooks = filteredAndSortedBooks.filter(book => 
        book.publisher === currentFilters.publisher
      );
    }

    // 3. LỌC THEO NHÀ CUNG CẤP
    if (currentFilters.supplier !== 'all') {
      filteredAndSortedBooks = filteredAndSortedBooks.filter(book => 
        book.supplier === currentFilters.supplier
      );
    }
    
    // 4. LỌC THEO THỂ LOẠI (Chưa có thuộc tính categoryId trong data, tạm bỏ qua hoặc giả định)
    // if (currentFilters.category !== 'all') {
    //   filteredAndSortedBooks = filteredAndSortedBooks.filter(book => 
    //     book.categoryId === currentFilters.category
    //   );
    // }

    // 5. LỌC THEO MỨC GIÁ TỐI ĐA
    if (currentFilters.priceMax !== 'all') {
        filteredAndSortedBooks = filteredAndSortedBooks.filter(book => 
            book.price <= currentFilters.priceMax
        );
    }

    // 6. SẮP XẾP
    if (currentFilters.sort !== 'default') {
      filteredAndSortedBooks = [...filteredAndSortedBooks].sort((a, b) => {
        if (currentFilters.sort === 'priceAsc') {
          return a.price - b.price;
        }
        if (currentFilters.sort === 'priceDesc') {
          return b.price - a.price;
        }
        // Thêm logic sắp xếp theo 'newest' nếu có trường ngày
        return 0;
      });
    }

    setBooks(filteredAndSortedBooks);
  }, []); // dependencies rỗng vì nó chỉ sử dụng data đầu vào và filters


  // 🔑 HÀM GỌI KHI NGƯỜI DÙNG NHẤN NÚT LỌC (ĐÃ SỬA)
  const handleFilter = () => {
    // Áp dụng bộ lọc và sắp xếp lên mảng sách đã được merge
    applyFilterAndSort(booksToFilter, filters);
  };
  // =================================================================


  const handleReset = () => {
    setFilters({
      category: "all",
      author: "all", 
      publisher: "all",
      supplier: "all",
      priceMax: "all", 
      sort: "default",
    });
    // Sau khi reset filters, cần áp dụng lại việc lọc/sắp xếp
    // (sẽ được tự động kích hoạt bởi useEffect 3 nếu logic được điều chỉnh)
    // Hoặc gọi lại hàm lọc:
    // applyFilterAndSort(booksToFilter, { /* giá trị reset */ }); 
  };
  
  // 📚 useEffect 1: Tải danh mục thực tế từ API (Giữ nguyên)
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const categoriesRes = await fetch("http://localhost:8080/api/categories");
            if (!categoriesRes.ok) {
                throw new Error("Failed to fetch categories");
            }
            const categoriesData = await categoriesRes.json();
            setCategories(categoriesData); 
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
        }
    };
    
    fetchCategories();
  }, []); 


  // 📦 useEffect 2: Tải Sách, Chi tiết sách và Trích xuất Tác giả/NXB/NCC (Chạy 1 lần)
  useEffect(() => {
    const fetchAllDataAndExtractFilters = async () => {
        try {
            const [booksRes, detailsRes] = await Promise.all([
                fetch("http://localhost:8080/api/books"),
                fetch("http://localhost:8080/api/books-details")
            ]);

            if (!booksRes.ok || !detailsRes.ok) {
                throw new Error("Failed to fetch primary book data.");
            }
            
            const booksData = await booksRes.json();
            const detailsData = await detailsRes.json();

            // 1. Gộp dữ liệu sách và chi tiết sách
            const merged = booksData.map((book) => {
                const matchedDetail = detailsData.find(
                  (d) => d.book?.id === book.id
                );
      
                return {
                  id: book.id,
                  title: book.title,
                  price: book.sellingPrice,
                  author: book.author, 
                  publisher: matchedDetail?.publisher, 
                  supplier: matchedDetail?.supplier,   
                  imageUrl:
                    matchedDetail?.imageUrl ||
                    "https://via.placeholder.com/200x280?text=No+Image",
                  // categoryId: book.book_category?.id, // Giả định trường này nếu có
                };
            });
            setBooksToFilter(merged); // LƯU DỮ LIỆU ĐÃ MERGE VÀO STATE MỚI

            // 2. TRÍCH XUẤT TÁC GIẢ (Từ booksData)
            const allAuthors = booksData
                .map(book => book.author)
                .filter(author => author && typeof author === 'string' && author.trim() !== '');

            const uniqueAuthors = [...new Set(allAuthors)].map(name => ({
                name: name,
                value: name, 
            }));
            setAuthors(uniqueAuthors);

            // 3. TRÍCH XUẤT NXB & NCC (Từ detailsData)
            const allPublishers = detailsData
                .map(detail => detail.publisher)
                .filter(p => p && p.trim() !== '');
                
            const allSuppliers = detailsData
                .map(detail => detail.supplier)
                .filter(s => s && s.trim() !== '');
            
            const uniquePublishers = [...new Set(allPublishers)].map(name => ({
                name: name,
                value: name, 
            }));
            setPublishers(uniquePublishers);
            
            const uniqueSuppliers = [...new Set(allSuppliers)].map(name => ({
                name: name,
                value: name, 
            }));
            setSuppliers(uniqueSuppliers);
            
        } catch (err) {
            console.error("Lỗi tải dữ liệu cơ bản để trích xuất bộ lọc:", err);
            setError("Lỗi tải dữ liệu cơ bản.");
        }
    };
    
    fetchAllDataAndExtractFilters();
  }, []); 


  // 🔍 useEffect 3: Lọc sách theo keyword VÀ Áp dụng Filter mặc định
  useEffect(() => {
    if (booksToFilter.length === 0) {
      setBooks([]);
      return;
    }

    // 1. Lọc theo Keyword (lọc mặc định/tìm kiếm)
    const lower = keyword.toLowerCase();
    let initialFilteredBooks = booksToFilter;
    if (keyword) {
      initialFilteredBooks = booksToFilter.filter((b) =>
        b.title.toLowerCase().includes(lower)
      );
    }
    
    // 2. Áp dụng các bộ lọc và sắp xếp mặc định (chủ yếu là sort="default")
    // Hoặc chỉ áp dụng sắp xếp mặc định:
    applyFilterAndSort(initialFilteredBooks, filters);

  }, [keyword, booksToFilter, applyFilterAndSort, filters]); // Phụ thuộc vào booksToFilter và keyword


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tìm kiếm sản phẩm</h1>

      {/* Bộ lọc */}
      <div className={styles.filterRow}>
        {/* THỂ LOẠI SÁCH */}
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Thể loại sách: Tất cả</option> 
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* TÁC GIẢ */}
        <select
          name="author"
          value={filters.author}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Tác giả: Tất cả</option>
          {authors.map((auth) => (
            <option key={auth.name} value={auth.value}> 
                {auth.name}
            </option>
          ))}
        </select>

        {/* NHÀ PHÁT HÀNH */}
        <select
          name="publisher"
          value={filters.publisher}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Nhà phát hành: Tất cả</option>
          {publishers.map((pub) => (
            <option key={pub.name} value={pub.value}>
              {pub.name}
            </option>
          ))}
        </select>

        {/* NHÀ CUNG CẤP */}
        <select
          name="supplier"
          value={filters.supplier}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="all">Nhà cung cấp: Tất cả</option>
          {suppliers.map((sup) => (
            <option key={sup.name} value={sup.value}>
              {sup.name}
            </option>
          ))}
        </select>

        {/* MỨC GIÁ */}
        <select
          name="priceMax"
          value={filters.priceMax}
          onChange={handleChange}
          className={styles.select}
        >
          {PRICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="default">Sắp xếp: Mặc định</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
        </select>

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
          Kết quả tìm kiếm cho{" "}
          <span>"{keyword || "Không có từ khóa"}"</span>
        </h2>

        {loading && <p className={styles.resultsCount}>Đang tải...</p>}
        {error && <p className={styles.resultsCount}>{error}</p>}

        {!loading && !error && (
          <p className={styles.resultsCount}>
            Có <strong>{books.length}</strong> sản phẩm được tìm thấy
          </p>
        )}

        {!loading && !error && books.length === 0 && (
          <p className={styles.resultsCount}>
            Không tìm thấy sản phẩm nào phù hợp với các tiêu chí lọc.
          </p>
        )}

        <div className={styles.productGrid}>
          {books.map((book) => (
            <ProductCard
              key={book.id}
              id={book.id}
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
  );
}