import { useState } from "react";
import "./SidebarFilter.css";

export default function SidebarFilter() {
  const [openSection, setOpenSection] = useState("supplier");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const filters = [
    {
      key: "supplier",
      title: "NHÀ CUNG CẤP",
      items: [
        "1980books",
        "Alphabooks",
        "Azbooks",
        "Bách Việt",
        "Giverbooks",
        "Linhlanbooks",
        "Nhà Nam",
        "Nông Nghiệp",
        "NXB Phụ Nữ",
        "Phanbooks",
      ],
    },
    { key: "author", title: "TÁC GIẢ", items: [] },
    { key: "category", title: "LOẠI SÁCH", items: [] },
    { key: "price", title: "GIÁ SẢN PHẨM", items: [] },
  ];

  return (
    <aside className="sidebar-filter">
      {filters.map((f) => (
        <div key={f.key} className="filter-section">
          <div
            className="filter-header"
            onClick={() => toggleSection(f.key)}
          >
            <span>{f.title}</span>
            <span className={`arrow ${openSection === f.key ? "open" : ""}`}>
              ▾
            </span>
          </div>

          {openSection === f.key && f.items.length > 0 && (
            <ul className="filter-list">
              {f.items.map((item, i) => (
                <li key={i}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}
