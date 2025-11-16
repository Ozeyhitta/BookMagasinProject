import React from "react";

export default function PartnerLogo({ href, imgSrc, name, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`partner-logo ${className}`}
    >
      <img src={imgSrc} alt={name} className="partner-logo-img" />
    </a>
  );
}
