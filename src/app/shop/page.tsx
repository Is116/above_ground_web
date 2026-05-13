"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";

const items = [
  { icon: "◎", label: "Stickers", price: "$5", status: "coming-soon" },
  { icon: "▣", label: "Shirts", price: "$35", status: "coming-soon" },
  { icon: "⬡", label: "USB Mixes", price: "$15", status: "coming-soon" },
];

export default function ShopPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: "80px 40px 60px", background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="05" title="Shop" sub="Merch" />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)", letterSpacing: "0.1em", lineHeight: 1.8, maxWidth: 560 }}>
            Stickers, shirts, USB mixes, and more. All merch ships within the USA.
          </p>
        </div>

        <section style={{ padding: "60px 40px", background: "var(--black)", position: "relative", zIndex: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {items.map((item) => (
              <div key={item.label}
                style={{ background: "var(--black)", padding: "52px 32px", textAlign: "center", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--mid-gray)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--black)")}
              >
                <div style={{ fontSize: 52, marginBottom: 20, filter: "grayscale(1)" }}>{item.icon}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: "0.1em", marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--accent-cyan)", letterSpacing: "0.1em", marginBottom: 12 }}>{item.price}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Coming Soon</div>
              </div>
            ))}
          </div>

          {/* Sticker preview */}
          <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 40 }}>
            <Image src="/logos/sticker.png" alt="AboveGround Sticker" width={200} height={200} style={{ opacity: 0.8 }} />
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>// Sticker Preview</p>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: "0.06em", marginBottom: 8 }}>AboveGround Sticker Pack</h3>
              <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.8, maxWidth: 400 }}>Die-cut vinyl stickers. Weather resistant. Stick them everywhere. Coming soon.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
