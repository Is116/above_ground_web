"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

export default function TraxxxPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: "80px 40px 60px", background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="03" title="Traxx" sub="Listen" />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)", letterSpacing: "0.1em", lineHeight: 1.8, maxWidth: 560 }}>
            Mixes, releases, and recordings from the AboveGround crew.
          </p>
        </div>

        <section style={{ padding: "60px 40px", background: "var(--black)", position: "relative", zIndex: 10 }}>
          <div style={{ marginBottom: 60 }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20 }}>// Soundcloud</p>
            <div style={{ background: "var(--mid-gray)", border: "1px solid rgba(255,255,255,0.08)", padding: "60px 40px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, filter: "grayscale(1)" }}>☁</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Soundcloud Playlist Embed</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                Replace this div with your Soundcloud iframe embed
              </p>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20 }}>// Bandcamp</p>
            <div style={{ background: "var(--mid-gray)", border: "1px solid rgba(255,255,255,0.08)", padding: "60px 40px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, filter: "grayscale(1)" }}>◈</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Bandcamp Releases</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                Replace this div with your Bandcamp iframe embed
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
