"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";
import {
  Users,
  UserCheck,
  Tag,
  BarChart3,
  Book,
  Download,
  Plus,
  LogOut,
} from "lucide-react";

import ManageCustomers from "./components/ManageCustomers";
import ManageStaffs from "./components/ManageStaffs";
import ManagePromotions from "./components/ManagePromotions";
import ViewSalesReports from "./components/ViewSalesReports";
import ManageBooks from "./components/ManageBooks";
import CreateNotifications from "./components/CreateNotifications";
import ManageServices from "./components/ManageServices";
import { buildApiUrl } from "../../utils/apiConfig";

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState("customers");
  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    monthlyRevenueChangePercent: 0,
    pendingOrders: 0,
    pendingApprovals: 0,
  });

  const menuItems = [
    { id: "customers", label: "Manage Customers", icon: Users },
    { id: "staffs", label: "Manage Staffs", icon: UserCheck },
    { id: "promotions", label: "Manage Promotions", icon: Tag },
    { id: "reports", label: "View Sales Reports", icon: BarChart3 },
    { id: "books", label: "Manage Books", icon: Book },
    { id: "notifications", label: "Create Notifications", icon: Plus },
    { id: "services", label: "Manage Services", icon: Tag },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/dashboard/summary"));
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setMetrics({
          monthlyRevenue: data.monthlyRevenue || 0,
          monthlyRevenueChangePercent: data.monthlyRevenueChangePercent || 0,
          pendingOrders: data.pendingOrders || 0,
          pendingApprovals: data.pendingApprovals || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
      }
    };
    fetchMetrics();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatPercent = (value) => {
    if (!value) return "0%";
    const rounded = Number(value).toFixed(1);
    return `${value > 0 ? "+" : ""}${rounded}%`;
  };

  const quickStats = useMemo(
    () => [
      {
        title: "Monthly Revenue",
        value: formatCurrency(metrics.monthlyRevenue),
        trend: `${formatPercent(metrics.monthlyRevenueChangePercent)} vs last month`,
      },
      {
        title: "Pending Orders",
        value: metrics.pendingOrders.toLocaleString("vi-VN"),
        trend: `${metrics.pendingApprovals.toLocaleString("vi-VN")} need approval`,
      },
    ],
    [metrics]
  );

  const getPageTitle = () => {
    const item = menuItems.find((m) => m.id === activeMenu);
    return item ? item.label : "Workspace";
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "customers":
        return <ManageCustomers />;
      case "staffs":
        return <ManageStaffs />;
      case "promotions":
        return <ManagePromotions />;
      case "reports":
        return <ViewSalesReports />;
      case "books":
        return <ManageBooks />;
      case "notifications":
        return <CreateNotifications />;
      case "services":
        return <ManageServices />;
      default:
        return <ManageCustomers />;
    }
  };

  const handleMenuClick = (id) => setActiveMenu(id);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.replace("/login");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>BM</div>
          <div>
            <p className={styles.brandTitle}>BookMagasin</p>
            <p className={styles.brandSub}>Administration Suite</p>
          </div>
        </div>

        <div className={styles.statusBadge}>System status: Operational</div>

        <nav className={styles.navSection}>
          <p className={styles.navLabel}>Workspace</p>
          <ul className={styles.menuList}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li
                  key={item.id}
                  className={`${styles.menuItem} ${
                    activeMenu === item.id ? styles.active : ""
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <span className={styles.menuIcon}>
                    <IconComponent size={18} />
                  </span>
                  {item.label}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div>
            <p className={styles.sidebarFooterTitle}>Admin session</p>
            <p className={styles.sidebarFooterMeta}>Secure mode enabled</p>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topBar}>
          <div>
            <p className={styles.pageSubtitle}>Overview</p>
            <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          </div>
          <div className={styles.topBarActions}>
            <input
              type="search"
              className={styles.search}
              placeholder="Search modules, orders, users..."
            />
            <button className={styles.actionGhost}>
              <Download size={16} />
              Export report
            </button>
            <button className={styles.actionPrimary}>
              <Plus size={16} />
              Quick create
            </button>
          </div>
        </header>

        <section className={styles.statsGrid}>
          {quickStats.map((stat) => (
            <div key={stat.title} className={styles.statCard}>
              <p className={styles.statLabel}>{stat.title}</p>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statTrend}>{stat.trend}</p>
            </div>
          ))}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelLabel}>Workspace</p>
              <h2 className={styles.panelTitle}>{getPageTitle()}</h2>
            </div>
            <span className={styles.panelMeta}>Last refreshed 2 mins ago</span>
          </div>
          <div className={styles.panelBody}>{renderContent()}</div>
        </section>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} BookMagasin Platform</p>
          <div className={styles.footerLinks}>
            <a href="#">Docs</a>
            <a href="#">Support</a>
            <a href="#">Status</a>
            <a href="#">License</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
