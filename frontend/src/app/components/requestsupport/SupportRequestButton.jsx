"use client";

import { useState } from "react";
import SupportRequestWindow from "./SupportRequestWindow";
import "./requestsupport.css";

export default function SupportRequestButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="supportButton"
        onClick={() => setOpen(true)}
        title="Yêu cầu hỗ trợ qua email"
        aria-label="Yêu cầu hỗ trợ qua email"
      >
        <img
          src="https://img.pikbest.com/png-images/20250602/3d-headset-customer-service-agent-icon_11743443.png!w700wp"
          alt="Customer Support"
        />
      </div>

      {/* Popup form yêu cầu hỗ trợ */}
      {open && <SupportRequestWindow onClose={() => setOpen(false)} />}
    </>
  );
    }
