// Utility functions for handling discounts
import { buildApiUrl } from "./apiConfig";

/**
 * Tính giá sau discount
 */
export function calculatePriceAfterDiscount(originalPrice, discount) {
  if (!discount) return originalPrice;

  let finalPrice = originalPrice;

  if (discount.discountPercent) {
    // Giảm theo phần trăm
    finalPrice = originalPrice * (1 - discount.discountPercent / 100);
  } else if (discount.discountAmount) {
    // Giảm theo số tiền cố định
    finalPrice = Math.max(0, originalPrice - discount.discountAmount);
  }

  return Math.round(finalPrice);
}

/**
 * Tìm discount active cho một book (trong khoảng thời gian)
 */
export function findActiveDiscount(discounts) {
  if (!discounts || discounts.length === 0) return null;

  const now = new Date();

  return discounts.find((discount) => {
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    return now >= startDate && now <= endDate;
  });
}

/**
 * Format discount text để hiển thị
 */
export function formatDiscountText(discount) {
  if (!discount) return null;

  if (discount.discountPercent) {
    return `-${discount.discountPercent}%`;
  } else if (discount.discountAmount) {
    return `-${discount.discountAmount.toLocaleString("vi-VN")}đ`;
  }

  return null;
}

/**
 * Fetch discount cho một book
 */
export async function fetchBookDiscount(bookId) {
  try {
    const res = await fetch(
      buildApiUrl(`/api/book-discounts/book/${bookId}`)
    );
    if (!res.ok) return null;

    const discounts = await res.json();
    return findActiveDiscount(discounts);
  } catch (error) {
    console.error(`Error fetching discount for book ${bookId}:`, error);
    return null;
  }
}

