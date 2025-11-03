"use client";
import React, { useEffect, useState, use } from "react";
import styles from "./productDetail.module.css";

export default function ProductDetail({ params }) {
  const { id } = use(params);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const books = [
    {
      id: 1,
      name: "Bên Bếp Lửa Cuộc Đời",
      price: 89100,
      oldPrice: 99000,
      image:
        "https://i.pinimg.com/736x/31/63/fb/3163fb0b4db68ca5e14eed65269e21a9.jpg",
      isbn: "8935280920491",
      publisher: "Thái Hà",
      supplier: "AZ",
      author: "Ngô Hữu Quang",
      translator: "Hoa Hoa",
      language: "Tiếng Việt",
      weight: "210 gr",
      size: "20.5 x 13 x 0.9 cm",
      pages: "192",
      cover: "Bìa mềm",
      year: "2025",
      description: `"Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành.Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành.Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành.Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành.Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành.Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành.Bên bếp lửa cuộc đời" kể về bốn người bạn – Hiếu, Hạnh, Hoàn và Hoa – quây quần bên bếp lửa trong một ngôi làng "bỏ phố về rừng", cùng nhau sẻ chia, nương tựa và bước tiếp trên hành trình trưởng thành."`,
    },
  ];

  const book = books.find((b) => b.id === parseInt(id));
  if (!book) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className={styles.productPage}>
      <div className={styles.productDetail}>
        {/* Cột 1: Hình ảnh */}
        <div className={styles.productImage}>
          <img src={book.image} alt={book.name} />
        </div>

        {/* Cột 2: Thông tin */}
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{book.name}</h1>
          <p className={styles.isbn}>ISBN: {book.isbn}</p>
          <p className={styles.publisher}>{book.publisher}</p>

          <div className={styles.priceBox}>
            <span className={styles.price}>
              {isClient ? book.price.toLocaleString("vi-VN") : book.price}đ
            </span>
            <span className={styles.oldPrice}>
              {isClient ? book.oldPrice.toLocaleString("vi-VN") : book.oldPrice}
              đ
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

        {/* ✅ GIỚI THIỆU + THÔNG TIN CHI TIẾT chiếm 2 cột đầu */}
        <div className={styles.bottomInfo}>
          <div className={styles.bookDescription}>
            <h2>GIỚI THIỆU SÁCH</h2>
            <p>{book.description}</p>
          </div>

          <div className={styles.detailInfo}>
            <h2>Thông tin chi tiết</h2>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <td>Mã hàng</td>
                  <td>893532509264</td>
                </tr>
                <tr>
                  <td>Tên Nhà Cung Cấp</td>
                  <td>AZ</td>
                </tr>
                <tr>
                  <td>Tác giả</td>
                  <td>Tae-Woan Ha</td>
                </tr>
                <tr>
                  <td>Người Dịch</td>
                  <td>Hoa Hoa</td>
                </tr>
                <tr>
                  <td>NXB</td>
                  <td>Lao Động</td>
                </tr>
                <tr>
                  <td>Năm XB</td>
                  <td>2025</td>
                </tr>
                <tr>
                  <td>Ngôn Ngữ</td>
                  <td>Tiếng Việt</td>
                </tr>
                <tr>
                  <td>Trọng lượng (gr)</td>
                  <td>210</td>
                </tr>
                <tr>
                  <td>Kích Thước Bao Bì</td>
                  <td>20.5 x 13 x 0.9 cm</td>
                </tr>
                <tr>
                  <td>Số trang</td>
                  <td>192</td>
                </tr>
                <tr>
                  <td>Hình thức</td>
                  <td>Bìa Mềm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* ===================== SẢN PHẨM LIÊN QUAN ===================== */}
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
              src="https://cdn0.fahasa.com/media/catalog/product/n/g/ngonngot.jpg"
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
              src="https://cdn0.fahasa.com/media/catalog/product/m/o/momat.jpg"
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
