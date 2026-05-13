"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";

const members = [
  { initials: "ST", name: "Sankta T",    slug: "sankta-t",    role: "DJ · Producer" },
  { initials: "LL", name: "Louie Lanka", slug: "louie-lanka", role: "DJ · Producer" },
  { initials: "HL", name: "HypeLies",   slug: "hypelies",    role: "DJ · Producer" },
  { initials: "DB", name: "Dru-Boy",    slug: "dru-boy",     role: "DJ · Producer" },
  { initials: "GG", name: "Glass Guts", slug: "glass-guts",  role: "DJ · Producer" },
  { initials: "AX", name: "Alexi",      slug: "alexi",       role: "DJ · Producer" },
];

export default function SquadPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div className="section-pad-top" style={{ background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="02" title="The Squad" sub="AboveGround" />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)", letterSpacing: "0.08em", lineHeight: 1.8, maxWidth: 520 }}>
            Six artists. One collective. Chicago underground, est. 2021.
          </p>
        </div>

        <section style={{ position: "relative", zIndex: 10, background: "var(--black)" }}>
          <div className="grid-3col">
            {members.map(m => (
              <Link
                key={m.slug}
                href={`/squad/${m.slug}`}
                style={{
                  display: "block",
                  background: "var(--black)",
                  padding: "36px 28px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 0.2s",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--mid-gray)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--black)")}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
                  marginBottom: 16,
                }}>
                  {m.initials}
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(20px, 4vw, 28px)", letterSpacing: "0.05em", marginBottom: 5 }}>{m.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>{m.role}</div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.15em", textTransform: "uppercase" }}>View Page →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
