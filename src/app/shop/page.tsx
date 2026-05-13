"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";

const items = [
  { icon: "◎", label: "Stickers",  price: "$5"  },
  { icon: "▣", label: "Shirts",    price: "$35" },
  { icon: "⬡", label: "USB Mixes", price: "$15" },
];

export default function ShopPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div className="section-pad-top" style={{ background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="05" title="Shop" sub="Merch" />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)", letterSpacing: "0.08em", lineHeight: 1.8, maxWidth: 520 }}>
            Stickers, shirts, USB mixes, and more. All merch ships within the USA.
          </p>
        </div>

        <section className="section-pad" style={{ background: "var(--black)", position: "relative", zIndex: 10 }}>
          <div className="grid-3col">
            {items.map(item => (
              <div
                key={item.label}
                style={{ background: "var(--black)", padding: "44px 24px", textAlign: "center", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--mid-gray)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--black)")}
              >
                <div style={{ fontSize: 44, marginBottom: 16, filter: "grayscale(1)" }}>{item.icon}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(18px, 3.5vw, 24px)", letterSpacing: "0.1em", marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--accent-cyan)", letterSpacing: "0.1em", marginBottom: 10 }}>{item.price}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Coming Soon</div>
              </div>
            ))}
          </div>

          {/* Sticker preview — stacks on mobile */}
          <div style={{
            marginTop: 52,
            display: "flex",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            <Image
              src="/logos/sticker.png"
              alt="AboveGround Sticker"
              width={180}
              height={180}
              style={{ opacity: 0.85, width: "clamp(120px, 30vw, 180px)", height: "auto" }}
            />
            <div style={{ maxWidth: 380 }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>// Sticker Preview</p>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(24px, 5vw, 32px)", letterSpacing: "0.06em", marginBottom: 8 }}>AboveGround Sticker Pack</h3>
              <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.8 }}>Die-cut vinyl stickers. Weather resistant. Stick them everywhere. Coming soon.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
