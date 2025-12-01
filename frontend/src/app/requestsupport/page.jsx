"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RequestSupportPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to main page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%"
      }}>
        <h1 style={{
          color: "#333",
          marginBottom: "20px",
          fontSize: "2rem"
        }}>
          Yêu cầu hỗ trợ
        </h1>

        <div style={{
          backgroundColor: "#e3f2fd",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #bbdefb"
        }}>
          <p style={{
            color: "#1976d2",
            margin: "0",
            fontSize: "1.1rem",
            fontWeight: "500"
          }}>
            Tính năng yêu cầu hỗ trợ chỉ khả dụng thông qua biểu tượng hỗ trợ ở góc phải màn hình.
          </p>
        </div>

        <p style={{
          color: "#666",
          marginBottom: "20px",
          lineHeight: "1.6"
        }}>
          Bạn sẽ được chuyển hướng về trang chủ trong 3 giây...
        </p>

        <p style={{
          color: "#666",
          marginBottom: "30px",
          lineHeight: "1.6"
        }}>
          Hoặc click vào link bên dưới để về trang chủ ngay lập tức:
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#1976d2",
            color: "white",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "500",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1565c0"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#1976d2"}
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
