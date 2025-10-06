"use client";
import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Các trang không cần Header
  const noHeaderPages = ["/login", "/register"];
  const showHeader = !noHeaderPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        {showHeader && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}
