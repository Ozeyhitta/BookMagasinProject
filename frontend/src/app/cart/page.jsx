"use client";
import { useEffect, useState } from "react";
import styles from "./cart.module.css";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState({}); // { bookId: discount }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Fetch cart function - có thể gọi từ nhiều nơi
  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("No userId found");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/carts/users/${userId}`
      );
      if (!res.ok) {
        console.error("Failed to fetch cart:", res.status);
        return;
      }
      const data = await res.json();
      console.log("CART DATA:", data);
      setCartItems(data);

      // Fetch discounts cho từng book
      const discountMap = {};
      const now = new Date();

      for (const item of data) {
        try {
          const discountRes = await fetch(
            `http://localhost:8080/api/book-discounts/book/${item.book.id}`
          );
          if (!discountRes.ok) continue;

          const discountData = await discountRes.json();

          // Tìm discount active (trong khoảng thời gian) - giống productDetail
          let activeDiscount = discountData.find((discount) => {
            const startDate = new Date(discount.startDate);
            const endDate = new Date(discount.endDate);
            return now >= startDate && now <= endDate;
          });

          // Nếu không có active, lấy discount đầu tiên (để test) - giống productDetail
          if (!activeDiscount && discountData.length > 0) {
            activeDiscount = discountData[0];
          }

          if (activeDiscount) {
            discountMap[item.book.id] = activeDiscount;
          }
        } catch (err) {
          console.error(
            `Error fetching discount for book ${item.book.id}:`,
            err
          );
        }
      }

      setDiscounts(discountMap);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    // Lấy userId từ localStorage (giống như login page lưu)
    const userId = localStorage.getItem("userId");
    console.log("USER ID FROM LOCAL:", userId);

    if (!userId) {
      console.log("No userId found");
      setIsAuthenticated(false);
      setCartItems([]);
      return;
    }
    setIsAuthenticated(true);

    // Fetch cart lần đầu
    fetchCart();

    // Listen for cart updates (khi thêm vào giỏ từ product page)
    const handleCartUpdate = () => {
      console.log("Cart updated event received, refreshing cart...");
      fetchCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [router]);

  // Tính giá sau discount - ưu tiên discountPercent nếu có cả 2
  function calculatePriceAfterDiscount(book, discount) {
    if (!discount) return book.sellingPrice;

    let finalPrice = book.sellingPrice;

    // Ưu tiên discountPercent nếu có cả 2
    if (discount.discountPercent != null && discount.discountPercent > 0) {
      // Giảm theo phần trăm
      finalPrice = book.sellingPrice * (1 - discount.discountPercent / 100);
    } else if (discount.discountAmount != null && discount.discountAmount > 0) {
      // Giảm theo số tiền cố định
      finalPrice = Math.max(0, book.sellingPrice - discount.discountAmount);
    }

    return Math.round(finalPrice);
  }

  // Tính tổng tiền gốc (không discount)
  const originalTotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + item.book.sellingPrice * item.quantity,
        0
      )
    : 0;

  // Tính tổng tiền với discount
  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => {
        const discount = discounts[item.book.id];
        const priceAfterDiscount = calculatePriceAfterDiscount(
          item.book,
          discount
        );
        return sum + priceAfterDiscount * item.quantity;
      }, 0)
    : 0;

  // Số tiền tiết kiệm được
  const savings = originalTotal - total;

  async function updateQuantity(id, delta) {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    // Optimistic update - cập nhật UI ngay lập tức
    setCartItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
      return updated;
    });

    // Sync với backend
    try {
      await syncQuantity(item, newQty);
      // Sau khi sync thành công, có thể refresh lại cart để đảm bảo data chính xác
      // Nhưng để tránh flicker, ta chỉ refresh nếu có lỗi (đã handle trong syncQuantity)
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Nếu có lỗi, refresh lại cart từ server
      fetchCart();
    }
  }

  async function syncQuantity(item, newQty) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/carts/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          bookId: item.book.id,
          quantity: newQty,
        }),
      });

      if (!res.ok) {
        console.error("Failed to update cart quantity:", res.status);
        // Nếu update thất bại, refresh lại cart từ server
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Nếu có lỗi, refresh lại cart từ server
      fetchCart();
    }
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

  if (!isAuthenticated) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.header}>
          <h1>Giỏ hàng của bạn</h1>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.content} style={{ minHeight: "300px" }}>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "60px",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
              Vui lòng đăng nhập để xem giỏ hàng.
            </p>
            <button
              className={styles.payBtn}
              onClick={() => router.push("/login")}
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </div>
      </div>
    );
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
                {(() => {
                  const discount = discounts[item.book.id];
                  const priceAfterDiscount = calculatePriceAfterDiscount(
                    item.book,
                    discount
                  );
                  const hasDiscount =
                    discount &&
                    ((discount.discountPercent != null &&
                      discount.discountPercent > 0) ||
                      (discount.discountAmount != null &&
                        discount.discountAmount > 0));

                  // Format discount text - giống productDetail
                  const discountText = hasDiscount
                    ? discount.discountPercent != null &&
                      discount.discountPercent > 0
                      ? `-${discount.discountPercent}%`
                      : discount.discountAmount != null &&
                        discount.discountAmount > 0
                      ? `-${discount.discountAmount.toLocaleString("vi-VN")}đ`
                      : null
                    : null;

                  return (
                    <>
                      {/* Price row - giống productDetail */}
                      <div className={styles.priceRow}>
                        <span className={styles.newPrice}>
                          {priceAfterDiscount.toLocaleString("vi-VN")}đ
                        </span>
                        {/* Badge discount kế bên giá - giống productDetail */}
                        {hasDiscount && discountText && (
                          <span className={styles.discountBadge}>
                            {discountText}
                          </span>
                        )}
                      </div>
                      {/* Giá cũ - chỉ hiển thị khi có discount */}
                      {hasDiscount && (
                        <span className={styles.oldPrice}>
                          {item.book.sellingPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className={styles.quantity}>
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>

              <div className={styles.totalPrice}>
                {(() => {
                  const discount = discounts[item.book.id];
                  const priceAfterDiscount = calculatePriceAfterDiscount(
                    item.book,
                    discount
                  );
                  return (priceAfterDiscount * item.quantity).toLocaleString(
                    "vi-VN"
                  );
                })()}
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
            {savings > 0 && (
              <p
                style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}
              >
                Tổng tiền gốc:{" "}
                <span style={{ textDecoration: "line-through", color: "#999" }}>
                  {originalTotal.toLocaleString("vi-VN")}đ
                </span>
              </p>
            )}
            <p>
              Tổng tiền:{" "}
              <span className={styles.total}>
                {total.toLocaleString("vi-VN")}đ
              </span>
            </p>
            {savings > 0 && (
              <p
                style={{
                  color: "#e74c3c",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginTop: "5px",
                }}
              >
                Tiết kiệm: {savings.toLocaleString("vi-VN")}đ
              </p>
            )}
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
