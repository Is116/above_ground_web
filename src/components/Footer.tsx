"use client";

import Image from "next/image";
import Link from "next/link";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Soundcloud", href: "#" },
  { label: "Bandcamp", href: "#" },
  { label: "Twitch", href: "#" },
  { label: "Contact", href: "mailto:info@aboveground.club" },
];

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        padding: "40px",
        background: "var(--black)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <Image
        src="/logos/logo-circle.png"
        alt="AboveGround"
        width={32}
        height={32}
        style={{ filter: "invert(1)", opacity: 0.25 }}
      />

      <ul style={{ display: "flex", gap: 24, listStyle: "none", flexWrap: "wrap" }}>
        {socials.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--gray)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>

      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.15)",
          textTransform: "uppercase",
        }}
      >
        AboveGround © 2021–2026
      </span>
    </footer>
  );
}
