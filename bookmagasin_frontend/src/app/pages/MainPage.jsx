import React from "react";
import Header from "../components/Header";

export default function MainPage() {
  return (
    <div>
      <Header />
      <main style={{ padding: "2rem" }}>
        <h1>Đây là trang chính (Main Page)</h1>
        <p>Nội dung của bạn nằm ở đây...</p>
      </main>
    </div>
  );
}
