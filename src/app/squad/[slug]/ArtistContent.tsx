"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

const members: Record<string, { name: string; initials: string; role: string; bio: string; quote: string }> = {
  "sankta-t":    { name: "Sankta T",    initials: "ST", role: "DJ · Producer", bio: "Sankta T brings a blend of underground house and techno with a Chicago edge. Bio coming soon.", quote: "Sauce: something unique to me"  },
  "louie-lanka": { name: "Louie Lanka", initials: "LL", role: "DJ · Producer", bio: "Louie Lanka's sound defies easy categorization — expect the unexpected. Bio coming soon.",     quote: "Your vibe, your frequency"      },
  "hypelies":    { name: "HypeLies",   initials: "HL", role: "DJ · Producer", bio: "HypeLies cuts through the noise with surgical precision. Bio coming soon.",                       quote: "Truth in the noise"             },
  "dru-boy":     { name: "Dru-Boy",    initials: "DB", role: "DJ · Producer", bio: "Dru-Boy keeps the dance floor moving. Bio coming soon.",                                          quote: "In the mix, always"             },
  "glass-guts":  { name: "Glass Guts", initials: "GG", role: "DJ · Producer", bio: "Glass Guts — raw, transparent, unfiltered. Bio coming soon.",                                   quote: "Transparent frequencies"        },
  "alexi":       { name: "Alexi",      initials: "AX", role: "DJ · Producer", bio: "Alexi stays in the cut, building energy with intention. Bio coming soon.",                       quote: "In the cut, always"             },
};

export default function ArtistContent({ slug }: { slug: string }) {
  const member = members[slug];
  if (!member) return (
    <div style={{ padding: "120px 24px", fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--gray)" }}>Artist not found.</div>
  );

  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>

        {/* Header */}
        <div className="section-pad-top" style={{ background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <Link href="/squad" style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", marginBottom: 28 }}>← Back to Squad</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,255,204,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 26,
            }}>
              {member.initials}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 8vw, 80px)", letterSpacing: "0.05em", lineHeight: 1 }}>{member.name}</h1>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 6 }}>{member.role}</p>
            </div>
          </div>
          <blockquote style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.5)", fontStyle: "italic", borderLeft: "2px solid var(--accent-cyan)", paddingLeft: 14, maxWidth: 480 }}>
            &ldquo;{member.quote}&rdquo;
          </blockquote>
        </div>

        {/* Bio + Traxx */}
        <section className="section-pad" style={{ background: "var(--black)", position: "relative", zIndex: 10 }}>
          <div className="artist-grid">
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14 }}>// Bio</p>
              <p style={{ fontSize: 14, color: "var(--off-white)", lineHeight: 1.8 }}>{member.bio}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14 }}>// Featured Traxx</p>
              <div style={{ background: "var(--mid-gray)", border: "1px solid rgba(255,255,255,0.08)", padding: "32px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Soundcloud / Bandcamp embed goes here</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
