"use client";
import styles from "./account.module.css";

export default function AccountPage() {
  const user = {
    name: "Nguyễn Lợi",
    email: "dinhloinguyen2010@gmail.com",
    country: "Vietnam",
  };

  return (
    <div className={styles.accountPage}>
      <h1 className={styles.title}>Tài khoản của bạn</h1>
      <div className={styles.divider}></div>

      <div className={styles.content}>
        {/* Cột trái */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>TÀI KHOẢN</h2>
          <ul className={styles.menu}>
            <li>Thông tin tài khoản</li>
            <li>Danh sách địa chỉ</li>
            <li>Đăng xuất</li>
          </ul>
        </aside>

        {/* Cột phải */}
        <section className={styles.infoSection}>
          <h2 className={styles.infoTitle}>THÔNG TIN TÀI KHOẢN</h2>
          <div className={styles.infoBox}>
            <p className={styles.name}>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.country}</p>
            <a href="#" className={styles.link}>
              Xem địa chỉ
            </a>
          </div>

          <div className={styles.orderBox}>
            <p>Bạn chưa đặt mua sản phẩm.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
