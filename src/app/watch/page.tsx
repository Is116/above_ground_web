"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

export default function WatchPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div className="section-pad-top" style={{ background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="04" title="Watch" sub="Live" />
        </div>
        <section className="section-pad" style={{ background: "var(--black)", position: "relative", zIndex: 10 }}>
          <div style={{
            background: "var(--mid-gray)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "clamp(40px, 8vw, 80px) 24px",
            textAlign: "center",
            minHeight: 360,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div className="pulse-dot" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--accent-magenta)", marginBottom: 22 }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 6vw, 40px)", letterSpacing: "0.08em", marginBottom: 10 }}>AboveGround Live</h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>24/7 Twitch Channel — Coming Soon</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", marginTop: 22 }}>
              Swap this block for your Twitch player iframe
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
