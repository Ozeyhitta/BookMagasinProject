"use client";
import { useRouter } from "next/navigation";
import "./CategoryPage.css";

export default function ProductCard({
  id,
  image,
  title,
  price,
  oldPrice,
  discount,
  promotionCode, // Mã giảm giá (optional)
  soldQuantity = 0,
  stockQuantity = 0,
}) {
  const router = useRouter();

  const handleClick = () => {
    if (id) router.push(`/product/${id}`);
    else console.error("Không có id cho sản phẩm này");
  };

  // Kiểm tra có discount không - đơn giản hóa logic
  const hasDiscount =
    Boolean(discount) && discount !== "0%" && discount !== "0đ";

  const normalizedSold =
    typeof soldQuantity === "number" && soldQuantity > 0 ? soldQuantity : 0;
  const normalizedStock =
    typeof stockQuantity === "number" && stockQuantity > 0
      ? stockQuantity
      : 0;
  const totalUnits =
    normalizedSold + normalizedStock > 0
      ? normalizedSold + normalizedStock
      : normalizedSold;
  const soldPercent =
    totalUnits > 0
      ? Math.min(100, Math.round((normalizedSold / totalUnits) * 100))
      : normalizedSold > 0
      ? 100
      : 0;
  const soldLabel =
    normalizedSold > 0 ? `Đã bán ${normalizedSold}` : "Chưa có đơn";
  const isSoldOut = normalizedStock === 0 && normalizedSold > 0;

  // Debug: luôn log để kiểm tra
  console.log("ProductCard render:", {
    id,
    title,
    discount,
    hasDiscount,
    promotionCode,
    typeofDiscount: typeof discount,
    stockQuantity,
    soldQuantity,
  });

  return (
    <div
      onClick={handleClick}
      className="product-card transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
      style={{ cursor: "pointer" }}
    >
      {/* Badge mã giảm giá / discount - chỉ hiển thị khi có discount hoặc promotion code */}
      {hasDiscount && (
        <div
          className="discount-badge"
          title={`Mã giảm: ${promotionCode || discount}`}
        >
          {promotionCode ? promotionCode : discount}
        </div>
      )}

      <img
        src={image}
        alt={title}
        className="product-image rounded-md shadow-sm"
      />
      <h3 className="product-title text-gray-800 font-medium">{title}</h3>

      <div className="product-prices mt-2">
        {/* Giá mới (sau discount) */}
        <span className="new-price text-lg font-bold text-red-600">
          {price}
        </span>

        {/* Giá cũ - chỉ hiển thị khi có discount */}
        {hasDiscount && oldPrice && (
          <span className="old-price text-sm text-gray-400 line-through">
            {oldPrice}
          </span>
        )}
      </div>

      <div
        className="sold-bar"
        role="progressbar"
        aria-valuenow={soldPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`sold-bar-track ${isSoldOut ? "sold-out" : ""}`}>
          <div
            className="sold-bar-fill"
            style={{ width: `${soldPercent}%` }}
          />
        </div>
        <div className="sold-bar-meta">
          <span className="sold-count">{soldLabel}</span>
          {isSoldOut && <span className="sold-status">Sắp hết</span>}
        </div>
      </div>

      {/* Hiển thị thông tin mã giảm giá phía dưới (nếu có promotion code) */}
      {promotionCode && hasDiscount && (
        <div
          className="promotion-code-text"
          style={{
            fontSize: "11px",
            color: "#e74c3c",
            fontWeight: "600",
            marginTop: "4px",
            textAlign: "center",
          }}
        >
          Mã: {promotionCode} - Giảm {discount}
        </div>
      )}
    </div>
  );
}
