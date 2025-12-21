"use client";

import { useState, useEffect } from "react";

/**
 * ClientOnly Component
 * 
 * Wraps components that should only render on the client side
 * to prevent hydration mismatches.
 * 
 * Usage:
 * <ClientOnly fallback={<div>Loading...</div>}>
 *   <ComponentThatUsesLocalStorage />
 * </ClientOnly>
 */
export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return <>{children}</>;
}



