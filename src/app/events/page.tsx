"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

const events = [
  { id: 1, type: "ag",       month: "JUN", day: "15", year: "2026", title: "AG Pres: Too Many Men Radio",       venue: "TBA", city: "Chicago, IL",  desc: "AboveGround presents Too Many Men Radio — a night of deep house and electronic music." },
  { id: 2, type: "ag",       month: "JUL", day: "18", year: "2026", title: "AboveGround × Vibe Syndicate",      venue: "TBA", city: "Chicago, IL",  desc: "A collaborative event with Vibe Syndicate collective." },
  { id: 3, type: "external", month: "AUG", day: "03", year: "2026", title: "Sankta T @ Underground Resistance", venue: "TBA", city: "Detroit, MI",  desc: "Sankta T plays Underground Resistance event in Detroit." },
  { id: 4, type: "ag",       month: "AUG", day: "22", year: "2026", title: "AboveGround Open Decks",            venue: "TBA", city: "Chicago, IL",  desc: "Open decks night with the full AboveGround crew." },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<"all" | "ag" | "external">("all");
  const filtered = filter === "all" ? events : events.filter(e => e.type === filter);

  const monoTag: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  };

  return (
    <main>
      <Nav />
      <div style={{ paddingTop: 64 }}>

        {/* Header */}
        <div className="section-pad-top" style={{ background: "var(--mid-gray)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
          <SectionHeader num="01" title="Events" sub="All Shows" />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)", letterSpacing: "0.08em", lineHeight: 1.8, maxWidth: 560 }}>
            Upcoming shows, AG events, and non-AG appearances.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
            {[{ key: "all", label: "All Events" }, { key: "ag", label: "↑ AG Events" }, { key: "external", label: "■ Non-AG" }].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as typeof filter)}
                style={{
                  ...monoTag,
                  padding: "7px 14px",
                  border: filter === f.key ? "1px solid rgba(0,255,204,0.4)" : "1px solid rgba(255,255,255,0.12)",
                  background: filter === f.key ? "rgba(0,255,204,0.1)" : "transparent",
                  color: filter === f.key ? "var(--accent-cyan)" : "var(--gray)",
                  transition: "all 0.2s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Event list */}
        <section style={{ background: "var(--black)", position: "relative", zIndex: 10 }}>
          {filtered.map(ev => (
            <div
              key={ev.id}
              className="event-row"
              onMouseEnter={e => (e.currentTarget.style.background = "var(--mid-gray)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div className="event-row-date">
                <div style={{ ...monoTag, color: "var(--gray)", marginBottom: 4 }}>{ev.month}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 7vw, 52px)", letterSpacing: "0.02em", lineHeight: 1 }}>{ev.day}</div>
                <div style={{ ...monoTag, color: "var(--gray)", fontSize: 8 }}>{ev.year}</div>
              </div>
              <div className="event-row-body">
                <span style={{
                  display: "inline-block", ...monoTag,
                  padding: "3px 8px", marginBottom: 10,
                  background: ev.type === "ag" ? "rgba(0,255,204,0.1)" : "rgba(255,230,0,0.07)",
                  color:      ev.type === "ag" ? "var(--accent-cyan)"  : "var(--accent-yellow)",
                  border:    `1px solid ${ev.type === "ag" ? "rgba(0,255,204,0.25)" : "rgba(255,230,0,0.2)"}`,
                }}>
                  {ev.type === "ag" ? "↑ AG Event" : "■ Non-AG"}
                </span>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(20px, 4vw, 28px)", letterSpacing: "0.04em", marginBottom: 5 }}>{ev.title}</h3>
                <p style={{ ...monoTag, color: "var(--gray)", fontSize: 9, marginBottom: 8 }}>{ev.venue} · {ev.city}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{ev.desc}</p>
              </div>
              <div className="event-row-arrow">
                <span style={{ ...monoTag, color: "var(--accent-cyan)", whiteSpace: "nowrap" }}>Details →</span>
              </div>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </main>
  );
}
