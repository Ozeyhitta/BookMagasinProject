"use client"
import { useState } from "react"
import styles from "./admin.module.css"
import {
  LayoutGrid,
  Users,
  UserCheck,
  Tag,
  BarChart3,
  Book,
  Download,
  Plus
} from "lucide-react"

// Import các component quản lý
import ManageCustomers from "./components/ManageCustomers"
import ManageStaffs from "./components/ManageStaffs"
import ManagePromotions from "./components/ManagePromotions"
import ViewSalesReports from "./components/ViewSalesReports"
import ManageBooks from "./components/ManageBooks" // ✅ Thêm mới

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState("dashboards")

  const menuItems = [
    { id: "dashboards", label: "Dashboards", icon: LayoutGrid },
    { id: "account", label: "My Account", icon: UserCheck },
    { id: "customers", label: "Manage Customers", icon: Users },
    { id: "staffs", label: "Manage Staffs", icon: UserCheck },
    { id: "promotions", label: "Manage Promotions", icon: Tag },
    { id: "reports", label: "View Sales Reports", icon: BarChart3 },
    { id: "books", label: "Manage Books", icon: Book }, // ✅ Thêm menu mới
  ]

  const outlineItems = [
    { label: "@keenthemes", icon: "X" },
    { label: "@keenthemes_hub", icon: "🔗" },
    { label: "metronic", icon: "🎨" },
  ]

  const getPageTitle = () => {
    const item = menuItems.find((m) => m.id === activeMenu)
    return item ? item.label : "Dashboards"
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "customers":
        return <ManageCustomers />
      case "staffs":
        return <ManageStaffs />
      case "promotions":
        return <ManagePromotions />
      case "reports":
        return <ViewSalesReports />
      case "books":
        return <ManageBooks /> // ✅ Thêm phần quản lý sách
      case "dashboards":
      default:
        return <p>Dashboard content will be displayed here.</p>
    }
  }

  const handleMenuClick = (id) => setActiveMenu(id)

  return (
    <div className={styles.dashboardWrapper}>
      {/* --- SIDEBAR --- */}
      <div className={styles.sidebar}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>B</div>
          <span>Book Shop</span>
        </div>

        {/* Add New Button */}
        <button className={styles.addNewButton}>
          <Plus size={16} />
          Add New
        </button>

        {/* Search Box */}
        <input type="text" placeholder="Search..." className={styles.searchBox} />

        {/* Pages Section */}
        <div className={styles.sectionLabel}>Pages</div>
        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li
                key={item.id}
                className={`${styles.menuItem} ${activeMenu === item.id ? styles.active : ""}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className={styles.menuIcon}>
                  <IconComponent size={18} />
                </span>
                {item.label}
              </li>
            )
          })}
        </ul>

        {/* Outline Section */}
        <div className={styles.sectionLabel} style={{ marginTop: "30px" }}>
          Outline
        </div>
        <ul className={styles.menuList}>
          {outlineItems.map((item, index) => (
            <li key={index} className={styles.menuItem}>
              <span className={styles.menuIcon}>{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>K</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "500" }}>Keenthemes</div>
            <div style={{ fontSize: "11px", color: "#888" }}>Admin</div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>{getPageTitle()}</h1>
            <p className={styles.headerBreadcrumb}>{getPageTitle()}</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.exportButton}>
              <Download size={16} />
              Export
            </button>
            <input
              type="text"
              className={styles.dateRangeInput}
              value="Jan 20, 2025 - Feb 09, 2025"
              readOnly
            />
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>{renderContent()}</div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>2025 © Keenthemes Inc.</p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Docs</a>
            <a href="#" className={styles.footerLink}>Purchase</a>
            <a href="#" className={styles.footerLink}>FAQ</a>
            <a href="#" className={styles.footerLink}>Support</a>
            <a href="#" className={styles.footerLink}>License</a>
          </div>
        </div>
      </div>
    </div>
  )
}
