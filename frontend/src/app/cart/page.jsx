"use client";
import { useEffect, useState } from "react";
import styles from "./cart.module.css";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("USER FROM LOCAL:", user);

    if (!user) return;

    async function fetchCart() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/carts/users/${user.id}`
        );
        const data = await res.json();
        console.log("DATA:", data);
        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    }

    fetchCart();
  }, []);

  const total = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + item.book.sellingPrice * item.quantity,
        0
      )
    : 0;

  function updateQuantity(id, delta) {
    setCartItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          syncQuantity(item, newQty);
          return { ...item, quantity: newQty };
        }
        return item;
      });

      // ✅ Cập nhật lại tổng chính xác dựa trên state mới nhất
      const newTotal = updated.length;
      localStorage.setItem("cartCount", newTotal);
      window.dispatchEvent(new Event("cart-updated"));

      return updated;
    });
  }

  async function syncQuantity(item, newQty) {
    await fetch(`http://localhost:8080/api/carts/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: item.user.id,
        bookId: item.book.id,
        quantity: newQty,
      }),
    });
  }

  async function handleRemove(itemId) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/carts/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // ✅ Cập nhật lại state
        const updated = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updated);

        // ✅ Cập nhật lại localStorage đúng theo tổng số lượng mới
        const newTotal = updated.length;
        localStorage.setItem("cartCount", newTotal);
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        const text = await res.text();
        alert("Xóa thất bại: " + text);
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      alert("Không thể kết nối đến server!");
    }
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.header}>
        <h1>Giỏ hàng của bạn</h1>
        <p>Có {cartItems.length} sản phẩm trong giỏ hàng</p>
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
                <img src={item.book.imageUrl} alt={item.book.title} />
                <span className={styles.itemName}>{item.book.title}</span>
              </div>

              <div className={styles.itemPrice}>
                <span className={styles.newPrice}>
                  {item.book.sellingPrice.toLocaleString("vi-VN")}đ
                </span>

                <span className={styles.discount}>0%</span>
              </div>

              <div className={styles.quantity}>
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>

              <div className={styles.totalPrice}>
                {(item.book.sellingPrice * item.quantity).toLocaleString(
                  "vi-VN"
                )}
                đ
              </div>

              <span
                className={styles.remove}
                onClick={() => handleRemove(item.id)}
                style={{ cursor: "pointer", color: "red", fontWeight: "bold" }}
              >
                ×
              </span>
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
              Tổng tiền:{" "}
              <span className={styles.total}>
                {total.toLocaleString("vi-VN")}đ
              </span>
            </p>
            <p className={styles.shipText}>
              Phí vận chuyển sẽ được tính ở trang thanh toán. <br />
              Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.
            </p>
            <button
              className={styles.payBtn}
              onClick={() => router.push("/checkout")}
            >
              THANH TOÁN
            </button>
            <a href="#" className={styles.continue}>
              ↩ Tiếp tục mua hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
