"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./productDetail.module.css";

export default function ProductDetail({ params }) {
  const id = params?.id; // id lấy từ URL /product/[id]

  const [book, setBook] = useState(null);
  const [bookDetail, setBookDetail] = useState(null); // 💡 thêm state cho chi tiết
  const [isClient, setIsClient] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const router = useRouter();

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập trước khi mua hàng!");
      router.push("/account"); // 👉 chuyển sang trang account
      return;
    }

    // Nếu đã đăng nhập thì vẫn thêm vào giỏ trước rồi chuyển trang
    handleAddToCart();
    router.push("/checkout"); // 👉 hoặc bạn có thể đổi thành /checkout
  };

  // Đánh dấu client để dùng toLocaleString
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch book + bookDetail
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // 1. Lấy sách theo id
        const bookRes = await fetch(`http://localhost:8080/api/books/${id}`);
        if (!bookRes.ok) {
          throw new Error("Không fetch được dữ liệu sách");
        }
        const bookData = await bookRes.json();
        setBook(bookData);

        // 2. Lấy danh sách book-details và tìm cái khớp id
        const detailRes = await fetch(
          "http://localhost:8080/api/books-details"
        );
        if (detailRes.ok) {
          const detailsData = await detailRes.json();
          const matchedDetail = detailsData.find(
            (d) => d.book?.id === bookData.id
          );
          setBookDetail(matchedDetail || null);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sách:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!book) {
    return <p className={styles.loading}>Đang tải thông tin sách...</p>;
  }

  // Format giá
  const priceFormatted = isClient
    ? book.sellingPrice?.toLocaleString("vi-VN")
    : book.sellingPrice;

  const oldPriceFormatted =
    isClient && book.oldPrice
      ? book.oldPrice.toLocaleString("vi-VN")
      : book.oldPrice;

  // Năm xuất bản (từ publicationDate)
  const publicationYear = book.publicationDate
    ? String(book.publicationDate).split("T")[0].split("-")[0]
    : "";

  // Một số field từ bookDetail (nếu có)
  const detail = bookDetail || {};

  const weight = detail.weight ? `${detail.weight} g` : "Đang cập nhật";
  const size =
    detail.height && detail.width
      ? `${detail.height} x ${detail.width} cm`
      : "Đang cập nhật";

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập trước khi thêm vào giỏ!");
      return;
    }

    // 🔹 Lấy thông tin user từ token hoặc từ localStorage (ví dụ)
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }

    const cartItem = {
      userId: parseInt(userId),
      bookId: book.id,
      quantity: quantity,
    };

    try {
      const response = await fetch("http://localhost:8080/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        alert("🛒 Đã thêm vào giỏ hàng!");
        // 🆕 Tăng localStorage cartCount
        const current = parseInt(localStorage.getItem("cartCount") || "0");
        localStorage.setItem("cartCount", current + 1);
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        const text = await response.text();
        alert("Lỗi thêm giỏ hàng: " + text);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.productDetail}>
        {/* Cột 1: Hình ảnh */}
        <div className={styles.productImage}>
          <img
            src={
              book.imageUrl || // nếu backend sau này map imageUrl vào BookResponseDto
              detail.imageUrl || // nếu image nằm trong BookDetail
              "https://via.placeholder.com/300x400?text=No+Image"
            }
            alt={book.title}
          />
        </div>

        {/* Cột 2: Thông tin chung */}
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{book.title}</h1>

          {book.isbn && <p className={styles.isbn}>ISBN: {book.isbn}</p>}

          {detail.publisher && (
            <p className={styles.publisher}>{detail.publisher}</p>
          )}

          <div className={styles.priceBox}>
            <span className={styles.price}>{priceFormatted}đ</span>
            {oldPriceFormatted && (
              <span className={styles.oldPrice}>{oldPriceFormatted}đ</span>
            )}
          </div>

          <div className={styles.quantityContainer}>
            <button className={styles.qtyBtn} onClick={decreaseQty}>
              -
            </button>
            <input type="text" value={quantity} readOnly />
            <button className={styles.qtyBtn} onClick={increaseQty}>
              +
            </button>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.addToCart} onClick={handleAddToCart}>
              THÊM VÀO GIỎ
            </button>
            <button className={styles.buyNow} onClick={handleBuyNow}>
              MUA NGAY
            </button>
          </div>
        </div>

        {/* Cột 3: Box bên phải */}
        <div className={styles.sideBox}>
          <h3>Chỉ có ở Vinabook</h3>
          <ul>
            <li>📗 Sản phẩm 100% chính hãng</li>
            <li>👩‍💼 Tư vấn mua sách trong giờ hành chính</li>
            <li>🚚 Miễn phí vận chuyển cho đơn hàng từ 250.000đ</li>
            <li>📞 Hotline: 1900 6401</li>
          </ul>
        </div>

        {/* ✅ GIỚI THIỆU + THÔNG TIN CHI TIẾT */}
        <div className={styles.bottomInfo}>
          {/* GIỚI THIỆU SÁCH */}
          <div className={styles.bookDescription}>
            <h2>GIỚI THIỆU SÁCH</h2>
            <p>
              {detail.description || "Chưa có phần mô tả cho sản phẩm này."}
            </p>
          </div>

          {/* THÔNG TIN CHI TIẾT */}
          <div className={styles.detailInfo}>
            <h2>Thông tin chi tiết</h2>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <td>Tác giả</td>
                  <td>{book.author || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <td>Người dịch</td>
                  <td>{detail.translator || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <td>Nhà cung cấp</td>
                  <td>{detail.supplier || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <td>Nhà xuất bản</td>
                  <td>{detail.publisher || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <td>Năm XB</td>
                  <td>{publicationYear || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <td>Ngôn ngữ</td>
                  <td>{detail.language || "Tiếng Việt"}</td>
                </tr>
                <tr>
                  <td>Trọng lượng (gr)</td>
                  <td>{weight}</td>
                </tr>
                <tr>
                  <td>Kích Thước Bao Bì</td>
                  <td>{size}</td>
                </tr>
                <tr>
                  <td>Số trang</td>
                  <td>{detail.pages || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <td>Hình thức</td>
                  <td>{detail.cover || "Bìa mềm"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================== SẢN PHẨM LIÊN QUAN (tạm để static) ===================== */}
      <div className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>Sản phẩm liên quan</h2>

        <div className={styles.relatedGrid}>
          <div className={styles.relatedCard}>
            <div className={styles.discountBadge}>-10%</div>
            <img
              src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509.jpg"
              alt="Nâng Cao Tư Duy Phản Biện Trong Văn Nghị Luận Xã Hội"
            />
            <h3>Nâng Cao Tư Duy Phản Biện Trong Văn Nghị Luận Xã Hội</h3>
            <div className={styles.priceBox}>
              <span className={styles.price}>94,500đ</span>
              <span className={styles.oldPrice}>105,000đ</span>
            </div>
          </div>

          <div className={styles.relatedCard}>
            <div className={styles.discountBadge}>-10%</div>
            <img
              src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195477.jpg"
              alt="13 Giờ Sáng - Khung Giờ Vô Thực"
            />
            <h3>13 Giờ Sáng - Khung Giờ Vô Thực</h3>
            <div className={styles.priceBox}>
              <span className={styles.price}>79,200đ</span>
              <span className={styles.oldPrice}>88,000đ</span>
            </div>
          </div>

          <div className={styles.relatedCard}>
            <div className={styles.discountBadge}>-10%</div>
            <img
              src="https://www.netabooks.vn/Data/Sites/1/Product/78503/thumbs/ngon-ngot-thanh-thanh.jpg"
              alt="Ngon Ngọt Thanh Thanh"
            />
            <h3>Ngon Ngọt Thanh Thanh</h3>
            <div className={styles.priceBox}>
              <span className={styles.price}>193,500đ</span>
              <span className={styles.oldPrice}>215,000đ</span>
            </div>
          </div>

          <div className={styles.relatedCard}>
            <div className={styles.discountBadge}>-10%</div>
            <img
              src="https://bizweb.dktcdn.net/thumb/1024x1024/100/417/638/products/vn-11134207-820l4-mgbz5xto9urt50-1761638763711.jpg?v=1761639204750"
              alt="Mở Mắt Ra Đi Em"
            />
            <h3>Mở Mắt Ra Đi Em</h3>
            <div className={styles.priceBox}>
              <span className={styles.price}>116,100đ</span>
              <span className={styles.oldPrice}>129,000đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
