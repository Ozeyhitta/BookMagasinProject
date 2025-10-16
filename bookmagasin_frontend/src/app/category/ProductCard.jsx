import "./CategoryPage.css";

export default function ProductCard({ image, title, price, oldPrice, discount }) {
  return (
    <div className="product-card">
      <div className="discount-badge">{discount}</div>
      <img src={image} alt={title} className="product-image" />
      <h3 className="product-title">{title}</h3>
      <div className="product-prices">
        <span className="new-price">{price}</span>
        <span className="old-price">{oldPrice}</span>
      </div>
    </div>
  );
}
