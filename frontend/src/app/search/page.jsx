"use client";

import { useState, useEffect, useCallback } from "react";
// Đảm bảo import đầy đủ các icon cho phân trang
import { Sparkles, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"; 
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

const BOOKS_PER_PAGE = 12;

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

    const [filteredBooks, setFilteredBooks] = useState([]); 
    const [booksToFilter, setBooksToFilter] = useState([]); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1); 
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    const books = filteredBooks.slice(startIndex, endIndex); 
    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);


    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'priceMax' && value !== 'all') {
            value = parseInt(value, 10);
        }
        setFilters({ ...filters, [e.target.name]: value });
        setCurrentPage(1);
    };
    
    // =================================================================
    // LỌC VÀ SẮP XẾP SÁCH THEO FILTERS HIỆN TẠI (Logic lọc category vẫn giữ nguyên)
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
        
        // 4. LỌC THEO THỂ LOẠI (Vẫn giữ logic, nhưng cần dữ liệu categoryIds từ API)
        if (currentFilters.category !== 'all') {
            const targetCategoryId = parseInt(currentFilters.category, 10); 
            
            filteredAndSortedBooks = filteredAndSortedBooks.filter(book => {
                // Nếu book.categoryIds là mảng rỗng (do API thứ 3 bị bỏ qua) thì sẽ không lọc được
                return book.categoryIds && book.categoryIds.includes(targetCategoryId);
            });
        }

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
            return 0;
          });
        }

        setFilteredBooks(filteredAndSortedBooks);
        setCurrentPage(1); 
    }, []); 


    const handleFilter = () => {
        let keywordFilteredBooks = booksToFilter;
        const lower = keyword.toLowerCase();
        
        if (keyword) {
            keywordFilteredBooks = booksToFilter.filter((b) =>
                b.title.toLowerCase().includes(lower)
            );
        }
        
        applyFilterAndSort(keywordFilteredBooks, filters);
    };

    const handleReset = () => {
        setFilters({
            category: "all",
            author: "all", 
            publisher: "all",
            supplier: "all",
            priceMax: "all", 
            sort: "default",
        });
        setCurrentPage(1);
    };
    
    // Hàm thay đổi trang (Giữ nguyên)
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // 📚 useEffect 1: Tải danh mục (Giữ nguyên)
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


    // 📦 useEffect 2: Tải Sách và Chi tiết sách (Đã sửa để chỉ dùng 2 API gốc)
    useEffect(() => {
        const fetchAllDataAndExtractFilters = async () => {
            try {
                setLoading(true);
                // CHỈ GỌI 2 API CỦA CODE GỐC
                const [booksRes, detailsRes] = await Promise.all([
                    fetch("http://localhost:8080/api/books"),
                    fetch("http://localhost:8080/api/books-details")
                ]);

                if (!booksRes.ok || !detailsRes.ok) {
                    // Nếu một trong hai lỗi, báo lỗi
                    throw new Error("Failed to fetch primary book data.");
                }
                
                const booksData = await booksRes.json();
                const detailsData = await detailsRes.json();
                // 🚀 bookCategoryData không cần thiết lúc này

                // 1. Gộp dữ liệu
                const merged = booksData.map((book) => {
                    const matchedDetail = detailsData.find(
                        (d) => d.book?.id === book.id
                    );
                    // Lấy categoryIds từ book.categories nếu có
                    const categoryIds = Array.isArray(book.categories)
                        ? book.categories.map((cat) => cat.id)
                        : [];

                    return {
                        id: book.id,
                        title: book.title,
                        price: book.sellingPrice,
                        author: book.author, 
                        publisher: matchedDetail?.publisher, 
                        supplier: matchedDetail?.supplier,   
                        stockQuantity:
                            typeof book.stockQuantity === "number"
                                ? book.stockQuantity
                                : 0,
                        soldQuantity:
                            typeof book.soldQuantity === "number"
                                ? book.soldQuantity
                                : 0,
                        imageUrl:
                            matchedDetail?.imageUrl ||
                            "https://via.placeholder.com/200x280?text=No+Image",
                        categoryIds: categoryIds, 
                    };
                });
                setBooksToFilter(merged); 

                // 2. TRÍCH XUẤT BỘ LỌC (Giữ nguyên)
                const allAuthors = booksData
                    .map(book => book.author)
                    .filter(author => author && typeof author === 'string' && author.trim() !== '');

                const uniqueAuthors = [...new Set(allAuthors)].map(name => ({ name, value: name }));
                setAuthors(uniqueAuthors);

                const allPublishers = detailsData
                    .map(detail => detail.publisher)
                    .filter(p => p && p.trim() !== '');
                    
                const allSuppliers = detailsData
                    .map(detail => detail.supplier)
                    .filter(s => s && s.trim() !== '');
                
                const uniquePublishers = [...new Set(allPublishers)].map(name => ({ name, value: name }));
                setPublishers(uniquePublishers);
                
                const uniqueSuppliers = [...new Set(allSuppliers)].map(name => ({ name, value: name }));
                setSuppliers(uniqueSuppliers);
                
                setError("");
            } catch (err) {
                console.error("Lỗi tải dữ liệu cơ bản để trích xuất bộ lọc:", err);
                setError("Lỗi tải dữ liệu cơ bản.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllDataAndExtractFilters();
    }, []); 


    // 🔍 useEffect 3: Lọc sách theo keyword VÀ Sắp xếp MẶC ĐỊNH (Giữ nguyên)
    useEffect(() => {
        if (booksToFilter.length === 0) {
            setFilteredBooks([]);
            return;
        }
        // ... (Logic lọc và sắp xếp giữ nguyên)
        const lower = keyword.toLowerCase();
        let initialFilteredBooks = booksToFilter;
        if (keyword) {
            initialFilteredBooks = booksToFilter.filter((b) =>
                b.title.toLowerCase().includes(lower)
            );
        }
        
        let defaultSortedBooks = [...initialFilteredBooks].sort((a, b) => {
            if (filters.sort === 'priceAsc') return a.price - b.price;
            if (filters.sort === 'priceDesc') return b.price - a.price;
            return 0;
        });

        setFilteredBooks(defaultSortedBooks);
        setCurrentPage(1); 

    }, [keyword, booksToFilter, filters.sort]); 


    // 🆕 Component Phân Trang (Giữ nguyên)
    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5; 
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) { pages.push('dots-start'); }
        }
        
        for (let i = startPage; i <= endPage; i++) { pages.push(i); }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) { pages.push('dots-end'); }
            if (!pages.includes(totalPages)) { pages.push(totalPages); }
        }
        
        return (
            <div className={styles.pagination}>
                <span 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`${styles.nextArrow} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Trang trước"
                >
                    <ChevronLeft size={20} />
                </span>

                {pages.map((page, index) => {
                    if (page === 'dots-start' || page === 'dots-end') {
                        return <span key={index} className={styles.dots}>...</span>;
                    }
                    return (
                        <span
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                        >
                            {page}
                        </span>
                    );
                })}

                <span 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`${styles.nextArrow} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Trang sau"
                >
                    <ChevronRight size={20} />
                </span>
            </div>
        );
    };


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

                {/* TÁC GIẢ, NXB, NCC, GIÁ, SẮP XẾP... (Giữ nguyên) */}
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
                    <Sparkles size={18} strokeWidth={2} className={styles.icon} aria-hidden="true" />
                    Lọc
                </button>
            </div>

            <button onClick={handleReset} className={styles.resetButton}>
                <RotateCcw size={18} strokeWidth={2} className={styles.icon} aria-hidden="true" />
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
                        Có <strong>{filteredBooks.length}</strong> sản phẩm được tìm thấy
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
                            stockQuantity={book.stockQuantity}
                            soldQuantity={book.soldQuantity}
                        />
                    ))}
                </div>
                
                <Pagination /> 
            </div>
        </div>
    );
}
