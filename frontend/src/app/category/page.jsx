"use client";
import SidebarFilter from "./SidebarFilter";
import "./CategoryPage.css";
import ProductCard from "./ProductCard";

export default function CategoryPage() {
  const products = [
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
    {
      title: "Cội Nguồn Của Hạnh Phúc - The Science of Happiness",
      price: "151,200đ",
      oldPrice: "168,000đ",
      discount: "-10%",
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78210/coi-nguon-cua-hanh-phuc.jpg",
    },
  ];

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Trang chủ</span> <span>/</span> 
        <span>Danh mục</span> <span>/</span> 
        <span className="current">Tâm lý - Kỹ năng sống</span>
      </div>

      <div className="category-layout">
        <SidebarFilter />

        {/* Main content */}
        <main className="category-content">
          <div className="category-header">
            <h1 className="category-title">Tâm lý - Kỹ năng sống</h1>
            <select className="sort-dropdown">
              <option>Mới nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
            </select>
          </div>

          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard key={i} {...p} />
            ))}
          </div>

          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">66</button>
            <button className="page-btn next">→</button>
          </div>
        </main>
      </div>
    </div>
  );
}
