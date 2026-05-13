"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Squad",  href: "/squad"  },
  { label: "Events", href: "/events" },
  { label: "Traxx",  href: "/traxxx" },
  { label: "Watch",  href: "/watch"  },
  { label: "Shop",   href: "/shop"   },
];

export default function Nav() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close drawer on route change / resize
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const monoSm: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 64,
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          background: scrolled || menuOpen ? "rgba(0,0,0,0.95)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {/* Logo */}
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logos/logo-circle.png"
            alt="AboveGround"
            width={36}
            height={36}
            style={{ filter: "invert(1)", opacity: 0.9 }}
          />
        </Link>

        {/* Desktop links */}
        <ul className="nav-links-desktop" style={{ display: "flex", gap: 28, listStyle: "none" }}>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{ ...monoSm, color: "var(--gray)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--gray)")}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          className="nav-cta-desktop"
          onClick={() => { document.getElementById("mailing")?.scrollIntoView({ behavior: "smooth" }); }}
          style={{
            ...monoSm,
            color: "var(--black)",
            background: "var(--accent-cyan)",
            border: "none",
            padding: "8px 16px",
            fontWeight: 700,
            transition: "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--white)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-cyan)")}
        >
          Join the List
        </button>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={{ transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              letterSpacing: "0.06em",
              color: "var(--white)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            {l.label}
          </Link>
        ))}
        <button
          onClick={() => {
            setMenuOpen(false);
            setTimeout(() => document.getElementById("mailing")?.scrollIntoView({ behavior: "smooth" }), 100);
          }}
          style={{
            marginTop: 8,
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--black)",
            background: "var(--accent-cyan)",
            border: "none",
            padding: "12px 24px",
            fontWeight: 700,
            alignSelf: "flex-start",
          }}
        >
          Join the List
        </button>
      </div>
    </>
  );
}
