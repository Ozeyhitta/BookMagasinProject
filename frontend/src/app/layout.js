"use client";
import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import Footer from "./components/footer";
import ChatbotButton from "./components/chatbot/ChatbotButton";
import { ensureHttpClients } from "../utils/httpClientSetup";
import { useIsMounted } from "../utils/hydration-safe";

ensureHttpClients();
export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isMounted = useIsMounted();

  // Các trang không cần Header
  const noHeaderPages = [
    "/login",
    "/register",
    "/admin",
    "/reset-password",
    "/staff",
  ];
  const showHeader = !noHeaderPages.includes(pathname);
  const showFooter = !noHeaderPages.includes(pathname);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {isMounted && showHeader && <Header />}
        <main>{children}</main>
        {isMounted && <ChatbotButton />}
        {isMounted && showFooter && <Footer />}
      </body>
    </html>
  );
}
