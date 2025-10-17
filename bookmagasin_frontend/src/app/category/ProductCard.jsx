import "./CategoryPage.css";

export default function ProductCard({
  image,
  title,
  price,
  oldPrice,
  discount,
}) {
  return (
    <div className="product-card hover:scale-105 transition-transform duration-200">
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
