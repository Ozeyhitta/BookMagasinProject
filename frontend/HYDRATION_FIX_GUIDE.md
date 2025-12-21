# Next.js Hydration Error Fix Guide

## Overview
This guide explains how we fixed hydration errors in the Next.js App Router project and provides best practices to prevent them in the future.

## What Are Hydration Errors?

Hydration errors occur when the HTML rendered on the server doesn't match what React renders on the client. This happens because:

1. **Server-side rendering (SSR)** generates HTML with initial state
2. **Client-side hydration** expects the same HTML structure
3. **Mismatches** occur when client-only APIs (localStorage, window, Date.now()) produce different values

## Common Causes in This Project

### 1. **localStorage Access During Render**
❌ **BAD:**
```jsx
const [count, setCount] = useState(localStorage.getItem("count") || 0);
```

✅ **GOOD:**
```jsx
const [count, setCount] = useState(0);
const isMounted = useIsMounted();

useEffect(() => {
  if (!isMounted) return;
  setCount(localStorage.getItem("count") || 0);
}, [isMounted]);
```

### 2. **Date.now() in Countdown Timers**
❌ **BAD:**
```jsx
const deadline = Date.now() + 3600000; // Different on server vs client
```

✅ **GOOD:**
```jsx
const isMounted = useIsMounted();

useEffect(() => {
  if (!isMounted) return;
  const deadline = Date.now() + 3600000;
  setDeadline(deadline);
}, [isMounted]);
```

### 3. **Conditional Rendering Based on Client State**
❌ **BAD:**
```jsx
{localStorage.getItem("token") && <UserMenu />}
```

✅ **GOOD:**
```jsx
const isMounted = useIsMounted();
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  if (!isMounted) return;
  setIsLoggedIn(!!localStorage.getItem("token"));
}, [isMounted]);

{isMounted && isLoggedIn && <UserMenu />}
```

### 4. **Window/Document APIs**
❌ **BAD:**
```jsx
const width = window.innerWidth; // Undefined on server
```

✅ **GOOD:**
```jsx
const [width, setWidth] = useState(0);
const isMounted = useIsMounted();

useEffect(() => {
  if (!isMounted) return;
  setWidth(window.innerWidth);
}, [isMounted]);
```

## Solutions Implemented

### 1. **useIsMounted Hook**
Created `frontend/src/utils/hydration-safe.js` with a hook that ensures code only runs after hydration:

```jsx
import { useIsMounted } from "../../utils/hydration-safe";

function MyComponent() {
  const isMounted = useIsMounted();
  
  useEffect(() => {
    if (!isMounted) return; // Skip on server
    // Safe to use localStorage, window, etc.
  }, [isMounted]);
}
```

### 2. **Fixed Header Component**
- All `localStorage` access now wrapped in `useEffect` with `isMounted` check
- Initial state values are safe defaults (false, 0, empty string)
- Client-side state updates happen after mount

### 3. **Fixed Countdown Timer**
- `Date.now()` only called after component mounts
- Placeholder values ("--") shown during SSR
- Timer starts only on client side

### 4. **Fixed Layout**
- Conditional rendering based on `isMounted`
- Header/Footer/Chatbot only render after hydration

## Best Practices

### ✅ DO:

1. **Use `useIsMounted()` hook** before accessing client-only APIs
2. **Initialize state with safe defaults** (null, false, 0, empty string)
3. **Use `useEffect`** to update state from localStorage/window after mount
4. **Show loading/placeholder states** during SSR
5. **Use `suppressHydrationWarning`** only when necessary (like timestamps)

### ❌ DON'T:

1. **Access localStorage/window directly** in component body or initial state
2. **Use Date.now() or Math.random()** during render
3. **Conditionally render** based on client-only values during SSR
4. **Assume browser APIs exist** during server-side rendering

## Debugging Hydration Errors

### Step 1: Identify the Mismatch
Check browser console for:
```
Warning: Text content did not match. Server: "..." Client: "..."
```

### Step 2: Find the Source
1. Look for `localStorage`, `window`, `document`, `Date.now()` in component
2. Check for conditional rendering based on client state
3. Look for dynamic values (random numbers, timestamps)

### Step 3: Apply Fix
1. Wrap client-only code in `useEffect` with `isMounted` check
2. Use safe default values for initial state
3. Show placeholder during SSR, update after mount

### Step 4: Verify
1. Hard refresh the page (Ctrl+Shift+R)
2. Check console for hydration warnings
3. Verify functionality still works correctly

## Example: Complete Fix

**Before (Hydration Error):**
```jsx
export default function CartBadge() {
  const [count, setCount] = useState(
    parseInt(localStorage.getItem("cartCount") || "0")
  );
  
  return <span>{count} items</span>;
}
```

**After (Hydration Safe):**
```jsx
"use client";
import { useIsMounted } from "../../utils/hydration-safe";

export default function CartBadge() {
  const [count, setCount] = useState(0);
  const isMounted = useIsMounted();
  
  useEffect(() => {
    if (!isMounted) return;
    const saved = localStorage.getItem("cartCount");
    if (saved) setCount(parseInt(saved));
  }, [isMounted]);
  
  return <span>{count} items</span>;
}
```

## Files Modified

1. `frontend/src/utils/hydration-safe.js` - New utility file
2. `frontend/src/components/ClientOnly.jsx` - New wrapper component
3. `frontend/src/app/components/Header.jsx` - Fixed localStorage access
4. `frontend/src/app/mainpage/page.jsx` - Fixed Date.now() in countdown
5. `frontend/src/app/layout.js` - Fixed conditional rendering

## Testing

After applying fixes:
1. ✅ No hydration warnings in console
2. ✅ Components render correctly on first load
3. ✅ Client-side functionality works as expected
4. ✅ No layout shifts or content flashing

## Additional Resources

- [Next.js Hydration Error Documentation](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration Guide](https://react.dev/reference/react-dom/client/hydrateRoot)
- [SSR Best Practices](https://nextjs.org/docs/app/building-your-application/rendering/server-components)



