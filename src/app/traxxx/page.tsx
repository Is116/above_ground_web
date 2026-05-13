"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

export default function TraxxxPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div className="section-pad-top" style={{ background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="03" title="Traxx" sub="Listen" />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)", letterSpacing: "0.08em", lineHeight: 1.8, maxWidth: 520 }}>
            Mixes, releases, and recordings from the AboveGround crew.
          </p>
        </div>

        <section className="section-pad" style={{ background: "var(--black)", position: "relative", zIndex: 10 }}>
          <div style={{ marginBottom: 52 }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 18 }}>// Soundcloud</p>
            <div style={{ background: "var(--mid-gray)", border: "1px solid rgba(255,255,255,0.08)", padding: "52px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 14, filter: "grayscale(1)" }}>☁</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Soundcloud Playlist Embed</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>Replace this div with your Soundcloud iframe</p>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 18 }}>// Bandcamp</p>
            <div style={{ background: "var(--mid-gray)", border: "1px solid rgba(255,255,255,0.08)", padding: "52px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 14, filter: "grayscale(1)" }}>◈</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Bandcamp Releases</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>Replace this div with your Bandcamp iframe</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
