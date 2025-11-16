"use client";
import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import Footer from "./components/footer";
import ChatbotButton from "./components/chatbot/ChatbotButton";
export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Các trang không cần Header
  const noHeaderPages = ["/login", "/register", "/admin", "/reset-password", "/staff"];
  const showHeader = !noHeaderPages.includes(pathname);
  const showFooter = !noHeaderPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        {showHeader && <Header />}
        <main>{children}</main>
        <ChatbotButton />
        {showFooter && <Footer />}
      </body>
    </html>
  );
}
