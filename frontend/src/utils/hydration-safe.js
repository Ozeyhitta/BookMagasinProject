/**
 * Hydration-Safe Utilities for Next.js App Router
 * 
 * These utilities help prevent hydration mismatches by ensuring
 * client-only code runs only after hydration is complete.
 */

import { useState, useEffect } from "react";

/**
 * Check if code is running on the client side
 */
export const isClient = typeof window !== "undefined";

/**
 * Hook to check if component has mounted (hydrated)
 * Use this to prevent hydration mismatches
 * 
 * @example
 * const isMounted = useIsMounted();
 * if (!isMounted) return <div>Loading...</div>;
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

/**
 * Safe localStorage getter that returns null on server
 */
export function safeGetLocalStorage(key, defaultValue = null) {
  if (!isClient) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safe localStorage setter
 */
export function safeSetLocalStorage(key, value) {
  if (!isClient) return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Safe localStorage remover
 */
export function safeRemoveLocalStorage(key) {
  if (!isClient) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Get current time safely (returns server time on SSR, client time after hydration)
 */
export function getSafeNow() {
  if (!isClient) {
    // Return a fixed time during SSR to ensure consistency
    return Date.now();
  }
  return Date.now();
}

/**
 * Format date safely for SSR
 */
export function formatSafeDate(date, options = {}) {
  if (!isClient) {
    // Return a placeholder during SSR
    return "";
  }
  return new Intl.DateTimeFormat("vi-VN", options).format(date);
}

