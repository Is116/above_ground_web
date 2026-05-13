"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

const events = [
  { id: 1, type: "ag", date: "JUN 15", month: "JUN", day: "15", year: "2026", title: "AG Pres: Too Many Men Radio", venue: "TBA", city: "Chicago, IL", desc: "AboveGround presents Too Many Men Radio — a night of deep house and electronic music." },
  { id: 2, type: "ag", date: "JUL 18", month: "JUL", day: "18", year: "2026", title: "AboveGround × Vibe Syndicate", venue: "TBA", city: "Chicago, IL", desc: "A collaborative event with Vibe Syndicate collective." },
  { id: 3, type: "external", date: "AUG 03", month: "AUG", day: "03", year: "2026", title: "Sankta T @ Underground Resistance", venue: "TBA", city: "Detroit, MI", desc: "Sankta T plays Underground Resistance event in Detroit." },
  { id: 4, type: "ag", date: "AUG 22", month: "AUG", day: "22", year: "2026", title: "AboveGround Open Decks", venue: "TBA", city: "Chicago, IL", desc: "Open decks night with the full AboveGround crew." },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<"all" | "ag" | "external">("all");
  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: "80px 40px 60px", background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="01" title="Events" sub="All Shows" />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)", letterSpacing: "0.1em", lineHeight: 1.8, maxWidth: 560 }}>
            Upcoming shows, AG events, and non-AG appearances. Filter by type.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {[{ key: "all", label: "All Events" }, { key: "ag", label: "↑ AG Events" }, { key: "external", label: "■ Non-AG" }].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key as typeof filter)}
                style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "7px 16px",
                  border: filter === f.key ? "1px solid rgba(0,255,204,0.4)" : "1px solid rgba(255,255,255,0.12)",
                  background: filter === f.key ? "rgba(0,255,204,0.1)" : "transparent",
                  color: filter === f.key ? "var(--accent-cyan)" : "var(--gray)", transition: "all 0.2s",
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <section style={{ padding: "0", background: "var(--black)", position: "relative", zIndex: 10 }}>
          {filtered.map((ev) => (
            <div key={ev.id}
              style={{
                display: "flex", alignItems: "flex-start", gap: 0,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                transition: "background 0.2s", padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--mid-gray)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ padding: "32px 28px", borderRight: "1px solid rgba(255,255,255,0.06)", minWidth: 120, textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{ev.month}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: "0.02em", lineHeight: 1 }}>{ev.day}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.15em" }}>{ev.year}</div>
              </div>
              <div style={{ padding: "32px 36px", flex: 1 }}>
                <span style={{
                  display: "inline-block", fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                  padding: "3px 8px", marginBottom: 12,
                  background: ev.type === "ag" ? "rgba(0,255,204,0.1)" : "rgba(255,230,0,0.07)",
                  color: ev.type === "ag" ? "var(--accent-cyan)" : "var(--accent-yellow)",
                  border: `1px solid ${ev.type === "ag" ? "rgba(0,255,204,0.25)" : "rgba(255,230,0,0.2)"}`,
                }}>
                  {ev.type === "ag" ? "↑ AG Event" : "■ Non-AG"}
                </span>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.05em", marginBottom: 6 }}>{ev.title}</h3>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.1em", marginBottom: 10 }}>{ev.venue} · {ev.city}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{ev.desc}</p>
              </div>
              <div style={{ padding: "32px 28px", display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Details →</span>
              </div>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </main>
  );
}
