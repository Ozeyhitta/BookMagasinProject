"use client";
import { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";
import "./chatbot.css";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Nút Chatbot */}
      <div className="chatbotButton" onClick={() => setOpen(true)}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
          alt="chatbot"
        />
      </div>

      {/* Popup Chat */}
      {open && <ChatbotWindow onClose={() => setOpen(false)} />}
    </>
  );
}
