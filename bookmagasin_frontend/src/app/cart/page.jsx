"use client";
import styles from "./cart.module.css";

export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      name: "Bên Bếp Lửa Cuộc Đời",
      price: 89100,
      oldPrice: 99000,
      quantity: 1,
      image: "https://www.netabooks.vn/Data/Sites/1/Product/78357/ben-bep-lua-cuoc-doi.jpg",
    },
    {
      id: 2,
      name: "Chu Du Hà Nội",
      price: 242100,
      oldPrice: 269000,
      quantity: 2,
      image: "https://toplist.vn/images/800px/ha-noi-dau-xua-pho-cu-681854.jpg",
    },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.cartPage}>
      <div className={styles.header}>
        <h1>Giỏ hàng của bạn</h1>
        <p>
          Có {cartItems.length} sản phẩm trong giỏ hàng
        </p>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.content}>
        {/* Danh sách sản phẩm */}
        <div className={styles.cartList}>
          <div className={styles.tableHeader}>
            <span className={styles.productTitle}>Tên sản phẩm</span>
            <span>Giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <img src={item.image} alt={item.name} />
                <span className={styles.itemName}>{item.name}</span>
              </div>
              <div className={styles.itemPrice}>
                <span className={styles.newPrice}>
                  {item.price.toLocaleString("vi-VN")}đ
                </span>
                <span className={styles.oldPrice}>
                  {item.oldPrice.toLocaleString()}đ
                </span>
                <span className={styles.discount}>0%</span>
              </div>
              <div className={styles.quantity}>
                <button>-</button>
                <span>{item.quantity}</span>
                <button>+</button>
              </div>
              <div className={styles.totalPrice}>
                {(item.price * item.quantity).toLocaleString()}đ
              </div>
              <span className={styles.remove}>×</span>
            </div>
          ))}
        </div>

        {/* Ghi chú và tổng tiền */}
        <div className={styles.summary}>
          <div className={styles.noteBox}>
            <h3>Ghi chú đơn hàng</h3>
            <textarea placeholder="Ghi chú"></textarea>
          </div>

          <div className={styles.orderInfo}>
            <h3>Thông tin đơn hàng</h3>
            <p>
              Tổng tiền: <span className={styles.total}>{total.toLocaleString()}đ</span>
            </p>
            <p className={styles.shipText}>
              Phí vận chuyển sẽ được tính ở trang thanh toán. <br />
              Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.
            </p>
            <button className={styles.payBtn}>THANH TOÁN</button>
            <a href="#" className={styles.continue}>
              ↩ Tiếp tục mua hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
