"use client";
import { useRouter } from "next/navigation";
import "./CategoryPage.css";

export default function ProductCard({
  id, // ✅ thêm id
  image,
  title,
  price,
  oldPrice,
  discount,
}) {
  const router = useRouter();

  const handleClick = () => {
    if (id) router.push(`/product/${id}`);
    else console.error("Không có id cho sản phẩm này");
  };

  return (
    <div
      onClick={handleClick}
      className="product-card transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
      style={{ cursor: "pointer" }}
    >
      <div className="discount-badge">{discount}</div>
      <img
        src={image}
        alt={title}
        className="product-image rounded-md shadow-sm"
      />
      <h3 className="product-title text-gray-800 font-medium">{title}</h3>

      <div className="product-prices mt-2">
        <span className="new-price text-lg font-bold text-red-600">
          {price}
        </span>
        <span className="old-price text-sm text-gray-400 line-through">
          {oldPrice}
        </span>
      </div>
    </div>
  );
}
