"use client";
import React, { useEffect, useState } from "react";
import styles from "./productDetail.module.css";

export default function ProductDetail({ params }) {
  const { id } = React.use(params);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const books = [
    {
      id: 1,
      name: "Bên Bếp Lửa Cuộc Đời",
      price: 89100,
      oldPrice: 99000,
      image:
        "https://tailieutienganh.edu.vn/public/files/upload/default/images/Phuong-phap-hoc/tron-bo-tu-vung-tieng-anh-theo-chu-de-sach-langgo.jpg",
      isbn: "8935280920491",
      publisher: "Thái Hà",
      author: "Ngô Hữu Quang",
      description: `"Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành.`,
    },
  ];

  const book = books.find((b) => b.id === parseInt(id));
  if (!book) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className={styles.productPage}>
      <div className={styles.productDetail}>
        {/* Hình ảnh */}
        <div className={styles.productImage}>
          <img src={book.image} alt={book.name} />
        </div>

        {/* Thông tin */}
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{book.name}</h1>
          <p className={styles.isbn}>ISBN: {book.isbn}</p>
          <p className={styles.publisher}>{book.publisher}</p>

          <div className={styles.priceBox}>
            <span className={styles.price}>
              {isClient ? book.price.toLocaleString("vi-VN") : book.price}đ
            </span>
            <span className={styles.oldPrice}>
              {isClient ? book.oldPrice.toLocaleString("vi-VN") : book.oldPrice}đ
            </span>
          </div>

          <div className={styles.quantityContainer}>
            <button className={styles.qtyBtn}>-</button>
            <input type="text" value="1" readOnly />
            <button className={styles.qtyBtn}>+</button>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.addToCart}>THÊM VÀO GIỎ</button>
            <button className={styles.buyNow}>MUA NGAY</button>
          </div>

          {/* Giới thiệu sách */}
          <div className={styles.bookDescription}>
            <h2>GIỚI THIỆU SÁCH</h2>
            <p>{book.description}</p>
            <p>
              <strong>Tác giả:</strong> {book.author}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              {isClient
                ? book.oldPrice.toLocaleString("vi-VN")
                : book.oldPrice}
              đ
            </p>
          </div>
        </div>

        {/* Box bên phải */}
        <div className={styles.sideBox}>
          <h3>Chỉ có ở Vinabook</h3>
          <ul>
            <li>📗 Sản phẩm 100% chính hãng</li>
            <li>👩‍💼 Tư vấn mua sách trong giờ hành chính</li>
            <li>🚚 Miễn phí vận chuyển cho đơn hàng từ 250.000đ</li>
            <li>📞 Hotline: 1900 6401</li>
          </ul>
        </div>
      </div>
    </div>
  );
}