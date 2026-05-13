"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Squad", href: "/squad" },
  { label: "Events", href: "/events" },
  { label: "Traxx", href: "/traxxx" },
  { label: "Watch", href: "/watch" },
  { label: "Shop", href: "/shop" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 64,
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Link href="/">
        <Image
          src="/logos/logo-circle.png"
          alt="AboveGround"
          width={38}
          height={38}
          style={{ filter: "invert(1)", opacity: 0.9, transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.9")}
        />
      </Link>

      <ul style={{ display: "flex", gap: 32, listStyle: "none" }}>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--gray)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          const el = document.getElementById("mailing");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--black)",
          background: "var(--accent-cyan)",
          border: "none",
          padding: "8px 18px",
          transition: "background 0.2s, transform 0.1s",
          fontWeight: 700,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--white)"; e.currentTarget.style.transform = "scale(1.02)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-cyan)"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        Join the List
      </button>
    </nav>
  );
}
