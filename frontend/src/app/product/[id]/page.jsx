"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import styles from "./productDetail.module.css";

const toNumber = (value) => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const pickActiveDiscount = (bookData, externalDiscounts = []) => {
  if (bookData?.bookDiscount) return bookData.bookDiscount;
  const source =
    (Array.isArray(bookData?.bookDiscounts) && bookData.bookDiscounts.length
      ? bookData.bookDiscounts
      : null) ||
    (Array.isArray(externalDiscounts) && externalDiscounts.length
      ? externalDiscounts
      : null);
  if (!source) return null;

  const now = Date.now();
  return (
    source.find((item) => {
      const startOk = item.startDate
        ? new Date(item.startDate).getTime() <= now
        : true;
      const endOk = item.endDate
        ? new Date(item.endDate).getTime() >= now
        : true;
      return startOk && endOk;
    }) || source[0]
  );
};

export default function ProductDetail({ params }) {
  // ✅ Next 15+: params là Promise → phải unwrap bằng React.use()
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const router = useRouter();

  const [book, setBook] = useState(null);
  const [detail, setBookDetail] = useState({});
  const [discount, setDiscount] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [animateQty, setAnimateQty] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [related, setRelated] = useState([]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    try {
      return new Intl.NumberFormat("vi-VN").format(value) + "đ";
    } catch {
      return `${value}đ`;
    }
  };

  const calculateSummary = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) return null;
    const totalReviews = reviewsList.length;
    const averageRate =
      reviewsList.reduce((sum, r) => sum + r.rate, 0) / totalReviews;
    const starCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviewsList.forEach((r) => {
      if (r.rate >= 1 && r.rate <= 5) {
        starCount[r.rate] = (starCount[r.rate] || 0) + 1;
      }
    });
    return {
      totalReviews,
      averageRate,
      star5: starCount[5],
      star4: starCount[4],
      star3: starCount[3],
      star2: starCount[2],
      star1: starCount[1],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, reviewsRes, discountRes] = await Promise.all([
          fetch(`http://localhost:8080/api/books/${id}`),
          fetch(`http://localhost:8080/api/reviews/book/${id}`),
          fetch(`http://localhost:8080/api/book-discounts/book/${id}`),
        ]);

        let discountList = [];
        if (discountRes.ok) {
          discountList = await discountRes.json();
        }

        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBook(bookData);
          setBookDetail(bookData.bookDetail || {});
          setDiscount(pickActiveDiscount(bookData, discountList));

          if (typeof bookData.stockQuantity === "number") {
            setQuantity(bookData.stockQuantity > 0 ? 1 : 0);
          } else {
            setQuantity(1);
          }

          // Sách liên quan
          try {
            const relRes = await fetch("http://localhost:8080/api/books");
            if (relRes.ok) {
              const allBooks = await relRes.json();
              const currentCategories =
                (bookData.categories || []).map((c) => c.id) || [];
              const filtered = allBooks
                .filter((b) => b.id !== bookData.id)
                .filter((b) => {
                  if (!currentCategories.length) return false;
                  const cats = (b.categories || []).map((c) => c.id);
                  return cats.some((idCat) =>
                    currentCategories.includes(idCat)
                  );
                })
                .slice(0, 4);
              const enriched = await Promise.all(
                filtered.map(async (relBook) => {
                  try {
                    const relDiscountRes = await fetch(
                      `http://localhost:8080/api/book-discounts/book/${relBook.id}`
                    );
                    if (relDiscountRes.ok) {
                      const relDiscountList = await relDiscountRes.json();
                      const relDiscount = pickActiveDiscount(
                        relBook,
                        relDiscountList
                      );
                      return { ...relBook, _activeDiscount: relDiscount };
                    }
                  } catch (discountErr) {
                    console.error(
                      `Error fetching discount for related book ${relBook.id}:`,
                      discountErr
                    );
                  }
                  return { ...relBook, _activeDiscount: pickActiveDiscount(relBook) };
                })
              );
              setRelated(enriched);
            }
          } catch (e) {
            console.error("Error fetching related books", e);
          }
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
          setRatingSummary(calculateSummary(reviewsData));
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  const increaseQty = () => {
    if (book?.stockQuantity != null) {
      if (book.stockQuantity <= 0) return;
      if (quantity >= book.stockQuantity) {
        alert(`Chỉ còn ${book.stockQuantity} quyển trong kho.`);
        return;
      }
    }
    setQuantity((prev) => prev + 1);
    setAnimateQty(true);
    setTimeout(() => setAnimateQty(false), 150);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setAnimateQty(true);
      setTimeout(() => setAnimateQty(false), 150);
    }
  };

  const addToCart = async ({ redirectAfterAdd = false } = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập trước khi mua.");
      return false;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return false;
    }

    if (quantity <= 0) {
      alert("Vui lòng chọn số lượng hợp lệ.");
      return false;
    }

    const stockQty =
      typeof book?.stockQuantity === "number" ? book.stockQuantity : null;
    if (stockQty !== null) {
      if (stockQty <= 0) {
        alert("Sản phẩm hiện đã hết hàng.");
        return false;
      }
      if (quantity > stockQty) {
        alert(`Bạn chỉ có thể mua tối đa ${stockQty} quyển.`);
        return false;
      }
    }

    const cartItem = {
      userId: parseInt(userId, 10),
      bookId: book.id,
      quantity,
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
        const current = parseInt(localStorage.getItem("cartCount") || "0", 10);
        localStorage.setItem("cartCount", current + 1);
        window.dispatchEvent(new Event("cart-updated"));

        if (redirectAfterAdd) {
          router.push("/checkout");
        } else {
          alert("Đã thêm vào giỏ hàng!");
        }
        return true;
      } else {
        const text = await response.text();
        alert("Lỗi thêm giỏ hàng: " + text);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server!");
    }
    return false;
  };

  const handleAddToCart = () => addToCart({ redirectAfterAdd: false });
  const handleBuyNow = () => addToCart({ redirectAfterAdd: true });

  if (!book) return <div>Đang tải...</div>;

  const basePrice =
    toNumber(book?.sellingPrice) ??
    toNumber(book?.price) ??
    toNumber(detail?.sellingPrice) ??
    toNumber(detail?.price);

  const discountPercent = toNumber(discount?.discountPercent);
  const discountAmount = toNumber(discount?.discountAmount);

  let finalPrice = basePrice;
  if (basePrice !== null) {
    if (discountPercent && discountPercent > 0) {
      finalPrice = Math.max(0, basePrice * (1 - discountPercent / 100));
    } else if (discountAmount && discountAmount > 0) {
      finalPrice = Math.max(0, basePrice - discountAmount);
    }
  }

  const hasDiscount =
    basePrice !== null && finalPrice !== null && finalPrice < basePrice;
  const priceFormatted =
    finalPrice !== null
      ? formatCurrency(Math.round(finalPrice))
      : "Đang cập nhật";
  const oldPriceFormatted =
    hasDiscount && basePrice !== null
      ? formatCurrency(Math.round(basePrice))
      : "";
  const discountText = hasDiscount
    ? discountPercent && discountPercent > 0
      ? `-${discountPercent}%`
      : discountAmount && discountAmount > 0
      ? `-${formatCurrency(discountAmount)}`
      : ""
    : "";
  const detailDiscountLabel =
    discountPercent && discountPercent > 0
      ? `Giảm ${discountPercent}%`
      : discountAmount && discountAmount > 0
      ? `Giảm ${formatCurrency(discountAmount)}`
      : null;

  const publicationYear = book.publicationYear || detail.publicationYear;
  const weight = detail.weight ? `${detail.weight} g` : "Đang cập nhật";
  const size = detail.size ? detail.size : "100 x 100 cm";
  const soldCount =
    typeof book?.soldQuantity === "number" ? book.soldQuantity : 0;
  const availableCount =
    typeof book?.stockQuantity === "number" ? book.stockQuantity : null;
  const totalUnits =
    availableCount !== null ? availableCount + soldCount : soldCount;
  const soldPercent =
    totalUnits > 0 ? Math.min(100, Math.round((soldCount / totalUnits) * 100)) : 0;
  const soldLabel = soldCount > 0 ? `Đã bán ${soldCount}` : "Chưa có đơn";
  const stockLabel =
    availableCount !== null
      ? availableCount > 0
        ? `Còn ${availableCount} sản phẩm`
        : "Hết hàng"
      : null;

  return (
    <div className={styles.productPage}>
      <div className={styles.productDetail}>
        {/* Cột 1: Hình ảnh */}
        <div className={styles.productImage}>
          <img
            src={
              book.imageUrl ||
              detail.imageUrl ||
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
            <div className={styles.priceRow}>
              <span className={styles.price}>{priceFormatted}</span>
              {hasDiscount && discountText && (
                <span className={styles.discountBadge}>{discountText}</span>
              )}
            </div>
            {oldPriceFormatted && (
              <span className={styles.oldPrice}>{oldPriceFormatted}</span>
            )}
          </div>

          <div className={styles.soldStatus}>
            <div className={styles.soldBarTrack}>
              <div
                className={styles.soldBarFill}
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <div className={styles.soldMeta}>
              <span>{soldLabel}</span>
              {stockLabel && <span>{stockLabel}</span>}
            </div>
          </div>

          <div className={styles.quantityContainer}>
            <button
              className={`${styles.qtyBtn} ${animateQty ? styles.animate : ""}`}
              onClick={decreaseQty}
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              readOnly
              className={animateQty ? styles.animate : ""}
            />
            <button
              className={`${styles.qtyBtn} ${animateQty ? styles.animate : ""}`}
              onClick={increaseQty}
            >
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
            <li>Sản phẩm 100% chính hãng</li>
            <li>Tư vấn mua sách trong giờ hành chính</li>
            <li>Miễn phí vận chuyển cho đơn từ 250.000₫</li>
            <li>Hotline: 1900 6401</li>
          </ul>
        </div>

        {/* Giới thiệu + Thông tin chi tiết */}
        <div className={styles.bottomInfo}>
          <div className={styles.bookDescription}>
            <h2>GIỚI THIỆU SÁCH</h2>
            <p>
              {detail.description || "Chưa có phần mô tả cho sản phẩm này."}
            </p>
          </div>

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
                  <td>Kích thước bao bì</td>
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
                {basePrice !== null && (
                  <tr>
                    <td>Giá gốc</td>
                    <td>{formatCurrency(Math.round(basePrice))}</td>
                  </tr>
                )}
                <tr>
                  <td>Giá khuyến mãi</td>
                  <td>{priceFormatted}</td>
                </tr>
                {hasDiscount && (
                  <tr>
                    <td>Ưu đãi</td>
                    <td>
                      <span className={styles.detailDiscountBadge}>
                        {detailDiscountLabel || discountText || "Đang áp dụng"}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Đánh giá sản phẩm */}
      <div className={styles.ratingSection}>
        <h2>Đánh giá sản phẩm</h2>

        <div className={styles.ratingTop}>
          <div className={styles.ratingScore}>
            <span className={styles.ratingNumber}>
              {ratingSummary ? ratingSummary.averageRate.toFixed(1) : "0"}
            </span>
            <span className={styles.ratingMax}>/5</span>
            <div className={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={styles.starFilled}>
                  ★
                </span>
              ))}
            </div>
            <span className={styles.ratingTotal}>
              {ratingSummary ? ratingSummary.totalReviews : 0} đánh giá
            </span>
          </div>

          <div className={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map((star) => {
              if (!ratingSummary || !ratingSummary.totalReviews) {
                return (
                  <div className={styles.ratingBarRow} key={star}>
                    <span>{star} sao</span>
                    <div className={styles.ratingBarOuter}>
                      <div
                        className={styles.ratingBarInner}
                        style={{ width: "0%" }}
                      />
                    </div>
                    <span>0%</span>
                  </div>
                );
              }

              const counts = {
                5: ratingSummary.star5,
                4: ratingSummary.star4,
                3: ratingSummary.star3,
                2: ratingSummary.star2,
                1: ratingSummary.star1,
              };
              const count = counts[star] || 0;
              const percent = Math.round(
                (count / ratingSummary.totalReviews) * 100
              );

              return (
                <div className={styles.ratingBarRow} key={star}>
                  <span>{star} sao</span>
                  <div className={styles.ratingBarOuter}>
                    <div
                      className={styles.ratingBarInner}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span>{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Danh sách đánh giá */}
        <div className={styles.reviewList}>
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className={styles.reviewItem}>
                <div className={styles.reviewerMeta}>
                  <strong>{rev.createBy?.fullName || "Khách hàng"}</strong>
                  <span className={styles.reviewerId}>
                    Tài khoản: #{rev.createBy?.id ?? "-"}
                  </span>
                </div>
                <div className={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= rev.rate ? styles.starFilled : styles.starEmpty
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className={styles.reviewComment}>{rev.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>Sản phẩm liên quan</h2>
        {related.length === 0 ? (
          <p style={{ marginTop: 12 }}>Chưa có sản phẩm liên quan.</p>
        ) : (
          <div className={styles.relatedGrid}>
            {related.map((item) => {
              const cover =
                item.imageUrl ||
                item.bookDetail?.imageUrl ||
                "https://via.placeholder.com/240x320?text=No+Image";
              const basePrice =
                toNumber(item?.sellingPrice) ??
                toNumber(item?.price) ??
                toNumber(item?.bookDetail?.sellingPrice) ??
                toNumber(item?.bookDetail?.price);
              const relatedDiscount =
                item._activeDiscount ?? pickActiveDiscount(item);
              const relatedDiscountPercent = toNumber(
                relatedDiscount?.discountPercent
              );
              const relatedDiscountAmount = toNumber(
                relatedDiscount?.discountAmount
              );

              let relatedFinalPrice = basePrice;
              if (basePrice !== null) {
                if (relatedDiscountPercent && relatedDiscountPercent > 0) {
                  relatedFinalPrice = Math.max(
                    0,
                    basePrice * (1 - relatedDiscountPercent / 100)
                  );
                } else if (relatedDiscountAmount && relatedDiscountAmount > 0) {
                  relatedFinalPrice = Math.max(
                    0,
                    basePrice - relatedDiscountAmount
                  );
                }
              }

              const hasRelatedDiscount =
                basePrice !== null &&
                relatedFinalPrice !== null &&
                relatedFinalPrice < basePrice;
              const relatedSold =
                typeof item?.soldQuantity === "number" ? item.soldQuantity : 0;
              const relatedStock =
                typeof item?.stockQuantity === "number" ? item.stockQuantity : null;
              const relatedTotal =
                relatedStock !== null ? relatedStock + relatedSold : relatedSold;
              const relatedSoldPercent =
                relatedTotal > 0
                  ? Math.min(
                      100,
                      Math.round((relatedSold / relatedTotal) * 100)
                    )
                  : 0;
              const relatedStockLabel =
                relatedStock !== null
                  ? relatedStock > 0
                    ? `Còn ${relatedStock}`
                    : "Hết hàng"
                  : null;
              const relatedPriceText =
                relatedFinalPrice !== null
                  ? formatCurrency(Math.round(relatedFinalPrice))
                  : "Dang c?p nh?t";
              const relatedOldPriceText =
                hasRelatedDiscount && basePrice !== null
                  ? formatCurrency(Math.round(basePrice))
                  : null;
              const relatedDiscountText = hasRelatedDiscount
                ? relatedDiscountPercent && relatedDiscountPercent > 0
                  ? `-${relatedDiscountPercent}%`
                  : relatedDiscountAmount && relatedDiscountAmount > 0
                  ? `-${formatCurrency(relatedDiscountAmount)}`
                  : ""
                : "";
              return (
                <div
                  key={item.id}
                  className={styles.relatedCard}
                  onClick={() => router.push(`/product/${item.id}`)}
                >
                  {hasRelatedDiscount && relatedDiscountText && (
                    <span className={styles.discountBadge}>
                      {relatedDiscountText}
                    </span>
                  )}
                  <img src={cover} alt={item.title} />
                  <h3>{item.title}</h3>
                  <div className={styles.priceBox}>
                    <span className={styles.price}>{relatedPriceText}</span>
                    {relatedOldPriceText && (
                      <span className={styles.oldPrice}>
                        {relatedOldPriceText}
                      </span>
                    )}
                  </div>
                  <div className={styles.soldStatus}>
                    <div className={styles.soldBarTrack}>
                      <div
                        className={styles.soldBarFill}
                        style={{ width: `${relatedSoldPercent}%` }}
                      />
                    </div>
                    <div className={styles.soldMeta}>
                      <span>Đã bán {relatedSold}</span>
                      {relatedStockLabel && (
                        <span className={styles.stockNote}>
                          {relatedStockLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
