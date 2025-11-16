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
}) {
  const router = useRouter();

  const handleClick = () => {
    if (id) router.push(`/product/${id}`);
    else console.error("Không có id cho sản phẩm này");
  };

  // Kiểm tra có discount không - đơn giản hóa logic
  const hasDiscount =
    Boolean(discount) && discount !== "0%" && discount !== "0đ";

  // Debug: luôn log để kiểm tra
  console.log("ProductCard render:", {
    id,
    title,
    discount,
    hasDiscount,
    promotionCode,
    typeofDiscount: typeof discount,
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
