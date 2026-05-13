"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

export default function WatchPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: "80px 40px 60px", background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="04" title="Watch" sub="Live" />
        </div>
        <section style={{ padding: "60px 40px", background: "var(--black)", position: "relative", zIndex: 10 }}>
          <div style={{ background: "var(--mid-gray)", border: "1px solid rgba(255,255,255,0.08)", padding: "80px 40px", textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-magenta)", marginBottom: 24, animation: "pulse-glow 1.5s ease-in-out infinite", boxShadow: "0 0 12px var(--accent-magenta)" }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: "0.08em", marginBottom: 12 }}>AboveGround Live</h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>24/7 Twitch Channel — Coming Soon</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginTop: 24 }}>
              {/* Replace with: */}
              {/* &lt;iframe src="https://player.twitch.tv/?channel=YOUR_CHANNEL&parent=yourdomain.com" ... /&gt; */}
              Swap this block for your Twitch player iframe
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
