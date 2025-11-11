"use client";

import { useState } from "react";
import "./chatbot.css";

export default function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Chào bạn! Mình có thể giúp gì nè? 😊" },
  ]);
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    const newMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Fake bot reply (sau này bạn thay API AI vào đây)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Mình đã nhận được tin nhắn của bạn!" },
      ]);
    }, 600);
  }

  return (
    <div className="chatWindow">
      {/* header */}
      <div className="chatHeader">
        <span>Chat hỗ trợ</span>
        <button className="chatClose" onClick={onClose}>
          ×
        </button>
      </div>

      {/* messages */}
      <div className="chatMessages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.from === "user" ? "userMsg" : "botMsg"}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* input */}
      <div className="chatInput">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}
