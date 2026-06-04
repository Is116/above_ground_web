"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import SectionHeader from "@/components/SectionHeader";
import MailingList from "@/components/MailingList";
import Footer from "@/components/Footer";
import type { Event, SquadMember } from "@/lib/db";

const ParticleField = dynamic(() => import("@/components/ParticleField"), { ssr: false });
const DJScene      = dynamic(() => import("@/components/DJScene"),       { ssr: false });
const AGSymbol     = dynamic(() => import("@/components/AGSymbol"),      { ssr: false });

const mono: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 9,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
};

export default function Home() {
  const [events, setEvents]               = useState<Event[]>([]);
  const [squad,  setSquad]                = useState<SquadMember[]>([]);
  const [filter, setFilter]               = useState<"all" | "ag" | "community">("all");
  const [sliderIdx, setSliderIdx]         = useState(0);
  const [sliderVisible, setSliderVisible] = useState(true);
  const [selectaIdx, setSelectaIdx]       = useState(0);
  const [selectaVis, setSelectaVis]       = useState(true);
  const [listenTab, setListenTab]         = useState<"soundcloud" | "bandcamp" | "youtube">("soundcloud");

  useEffect(() => {
    fetch("/api/events").then(r => r.json()).then(setEvents);
    fetch("/api/squad").then(r => r.json()).then(setSquad);
  }, []);

  // Event slider auto-advance
  useEffect(() => {
    if (events.length < 2) return;
    const t = setInterval(() => {
      setSliderVisible(false);
      setTimeout(() => { setSliderIdx(i => (i + 1) % events.length); setSliderVisible(true); }, 400);
    }, 4000);
    return () => clearInterval(t);
  }, [events.length]);

  // Selectas carousel auto-advance
  useEffect(() => {
    if (squad.length < 2) return;
    const t = setInterval(() => {
      setSelectaVis(false);
      setTimeout(() => { setSelectaIdx(i => (i + 1) % squad.length); setSelectaVis(true); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, [squad.length]);

  function goTo(idx: number) {
    setSliderVisible(false);
    setTimeout(() => { setSliderIdx(idx); setSliderVisible(true); }, 300);
  }

  function goToSelecta(idx: number) {
    setSelectaVis(false);
    setTimeout(() => { setSelectaIdx(idx); setSelectaVis(true); }, 300);
  }

  const filtered      = filter === "all" ? events : events.filter(e => e.type === filter);
  const curSelecta    = squad[selectaIdx] ?? null;

  return (
    <main>
      <ParticleField />
      <Nav />

      {/* ── FEATURED / WHAT'S THE WORD ── */}
      <section style={{ position: "relative", zIndex: 10, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 20px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}><DJScene /></div>
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, zIndex: 2 }}><Marquee /></div>

        <div style={{ position: "relative", zIndex: 1, width: "min(560px, 88vw)", animation: "fadeUp .8s ease forwards .6s", opacity: 0 }}>
          <p style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.35em", marginBottom: 28 }}>
            What&apos;s the Word?
          </p>

          {events.length === 0 ? (
            <div style={{ height: 160 }} />
          ) : (() => {
            const ev = events[sliderIdx];
            return (
              <div style={{ transition: "opacity 0.4s ease", opacity: sliderVisible ? 1 : 0 }}>
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    ...mono,
                    padding: "4px 12px",
                    background: ev.type === "ag" ? "rgba(0,255,204,0.1)" : "rgba(255,230,0,0.08)",
                    color:      ev.type === "ag" ? "var(--accent-cyan)"  : "var(--accent-yellow)",
                    border:    `1px solid ${ev.type === "ag" ? "rgba(0,255,204,0.3)" : "rgba(255,230,0,0.25)"}`,
                  }}>
                    {ev.type === "ag" ? "↑ AG Event" : "■ Community"}
                  </span>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(64px, 14vw, 110px)", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 12 }}>
                  {ev.month} {ev.day}
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(18px, 4vw, 28px)", letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)", marginBottom: 10 }}>
                  {ev.title}
                </div>
                <div style={{ ...mono, color: "var(--gray)", marginBottom: 32 }}>
                  {ev.venue} · {ev.city}
                </div>
              </div>
            );
          })()}

          {events.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
              {events.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  width: i === sliderIdx ? 20 : 6, height: 6, borderRadius: 3, border: "none",
                  background: i === sliderIdx ? "var(--accent-cyan)" : "rgba(255,255,255,0.2)",
                  cursor: "crosshair", padding: 0, transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          )}

          <Link
            href="/events"
            style={{ ...mono, color: "var(--black)", background: "var(--accent-cyan)", padding: "12px 32px", textDecoration: "none", fontWeight: 700, display: "inline-block", transition: "background 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--white)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-cyan)")}
          >
            View All Events →
          </Link>
        </div>

        <p style={{ position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center", ...mono, color: "var(--gray)", animation: "fadeUp .8s ease forwards 1.2s", opacity: 0, zIndex: 1 }}>
          ↓ Scroll
        </p>
      </section>

      {/* ── LIVE AND DIRECT / WATCH ── */}
      <section id="watch" style={{ position: "relative", zIndex: 10, background: "var(--mid-gray)", borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, display: "none", justifyContent: "center", alignItems: "center" }} className="mobile-arrow-bg">
          <div style={{ height: "280px", width: "280px", opacity: 0.2 }}><AGSymbol /></div>
        </div>
        <div className="twitch-bar" style={{ display: "flex", alignItems: "center", gap: 40, position: "relative", zIndex: 1 }}>
          <div className="twitch-side-label">Live / Watch</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
            <div>
              <div className="pulse-dot" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--accent-magenta)", marginBottom: 20 }} />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(22px, 5vw, 32px)", letterSpacing: "0.08em", marginBottom: 10 }}>
                Live and Direct
              </h3>
              <p style={{ ...mono, color: "var(--gray)", marginBottom: 6 }}>Coming soon...calling all freqs 😉</p>
              <p style={{ ...mono, color: "rgba(255,255,255,0.18)", marginTop: 16 }}>Stream embed drops here</p>
            </div>
          </div>
          <div style={{ width: "280px", height: "280px", flexShrink: 0, overflow: "hidden" }} className="desktop-arrow">
            <AGSymbol />
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" className="section-pad" style={{ background: "var(--black)", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
        <SectionHeader num="01" title="Events" sub="Upcoming" />

        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          {([["all", "All Events"], ["ag", "↑ AG Events"], ["community", "■ Community"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              ...mono, padding: "7px 14px",
              border: filter === key ? "1px solid rgba(0,255,204,0.4)" : "1px solid rgba(255,255,255,0.12)",
              background: filter === key ? "rgba(0,255,204,0.1)" : "transparent",
              color: filter === key ? "var(--accent-cyan)" : "var(--gray)",
              cursor: "crosshair", transition: "all 0.2s",
            }}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid-2col">
          {filtered.map(ev => <EventCard key={ev.id} ev={ev} />)}
        </div>

        <div style={{ marginTop: 28, textAlign: "right" }}>
          <Link href="/events" style={{ ...mono, color: "var(--accent-cyan)", textDecoration: "none" }}>
            View Full Calendar →
          </Link>
        </div>
      </section>

      {/* ── SELECTAS / CHOOSE YOUR SELECTA ── */}
      <section id="squad" className="section-pad" style={{ background: "var(--mid-gray)", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
        <SectionHeader num="02" title="Selectas" sub="Choose Your Selecta" />

        {curSelecta && (
          <div>
            {/* Carousel row: ‹ card › */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", gap: 16 }}>
              <button
                onClick={() => goToSelecta((selectaIdx - 1 + squad.length) % squad.length)}
                style={{ fontSize: 24, color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "crosshair", transition: "color 0.2s", padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >‹</button>

              <Link
                href={`/squad/${curSelecta.slug}`}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18, padding: "44px 32px", background: "var(--dark-gray)", textDecoration: "none", color: "inherit", transition: "opacity 0.4s ease", opacity: selectaVis ? 1 : 0 }}
              >
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  background: "rgba(0,255,204,0.07)", border: "1px solid rgba(0,255,204,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "var(--accent-cyan)",
                }}>
                  {curSelecta.initials}
                </div>

                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(26px, 5vw, 36px)", letterSpacing: "0.05em", lineHeight: 1.1 }}>
                    {curSelecta.name}
                  </div>
                  <div style={{ ...mono, color: "var(--gray)", marginTop: 6 }}>{curSelecta.role}</div>
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", fontStyle: "italic", maxWidth: 440, borderLeft: "2px solid rgba(0,255,204,0.2)", paddingLeft: 14, textAlign: "left" }}>
                  &ldquo;{curSelecta.quote}&rdquo;
                </p>

                <span style={{ ...mono, color: "var(--accent-cyan)" }}>View Profile →</span>
              </Link>

              <button
                onClick={() => goToSelecta((selectaIdx + 1) % squad.length)}
                style={{ fontSize: 24, color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "crosshair", transition: "color 0.2s", padding: 0, textAlign: "right" as const }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >›</button>
            </div>

            {/* Dot nav */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              {squad.map((_, i) => (
                <button key={i} onClick={() => goToSelecta(i)} style={{
                  width: i === selectaIdx ? 20 : 6, height: 6, borderRadius: 3,
                  border: "none", background: i === selectaIdx ? "var(--accent-cyan)" : "rgba(255,255,255,0.2)",
                  cursor: "crosshair", padding: 0, transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, textAlign: "right" }}>
          <Link href="/squad" style={{ ...mono, color: "var(--accent-cyan)", textDecoration: "none" }}>
            Full Squad Pages →
          </Link>
        </div>
      </section>

      {/* ── LISTEN / TRAXX ── */}
      <section id="traxxx" className="section-pad" style={{ background: "var(--black)", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
        <SectionHeader num="03" title="Traxx" sub="Listen" />

        {/* Platform tab selector */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 0 }}>
          {(["soundcloud", "bandcamp", "youtube"] as const).map(tab => (
            <button key={tab} onClick={() => setListenTab(tab)} style={{
              ...mono, padding: "10px 22px", border: "none",
              borderBottom: listenTab === tab ? "2px solid var(--accent-cyan)" : "2px solid transparent",
              background: "none",
              color: listenTab === tab ? "var(--accent-cyan)" : "var(--gray)",
              cursor: "crosshair", transition: "all 0.2s", marginBottom: "-1px",
            }}>
              {tab === "soundcloud" ? "☁ Soundcloud" : tab === "bandcamp" ? "◈ Bandcamp" : "▷ YouTube"}
            </button>
          ))}
        </div>

        <EmbedZone
          icon={listenTab === "soundcloud" ? "☁" : listenTab === "bandcamp" ? "◈" : "▷"}
          label={listenTab === "soundcloud" ? "Soundcloud" : listenTab === "bandcamp" ? "Bandcamp" : "YouTube"}
          sub={`Link your ${listenTab === "soundcloud" ? "SoundCloud" : listenTab === "bandcamp" ? "Bandcamp" : "YouTube"} playlist`}
        />
      </section>

      {/* ── SHOP / WE'VE GOT WHAT YOU NEED ── */}
      <section id="shop" className="section-pad" style={{ background: "var(--mid-gray)", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
        <SectionHeader num="04" title="Shop" sub="We've Got What You Need" />
        <div className="grid-3col">
          {[
            { icon: "◎", label: "Stickers",  price: "$5"  },
            { icon: "▣", label: "Shirts",     price: "$35" },
            { icon: "⬡", label: "USB Mixes",  price: "$15" },
          ].map(item => (
            <div key={item.label}
              style={{ background: "var(--dark-gray)", padding: "44px 24px", textAlign: "center", transition: "background 0.2s", cursor: "crosshair" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#111")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--dark-gray)")}
            >
              <div style={{ fontSize: 40, marginBottom: 14, filter: "grayscale(1)" }}>{item.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.1em", marginBottom: 6 }}>{item.label}</div>
              <div style={{ ...mono, color: "var(--accent-cyan)", marginBottom: 8 }}>{item.price}</div>
              <div style={{ ...mono, color: "rgba(255,255,255,0.2)", fontSize: 8 }}>Coming Soon</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, textAlign: "right" }}>
          <Link href="/shop" style={{ ...mono, color: "var(--accent-cyan)", textDecoration: "none" }}>
            View Shop →
          </Link>
        </div>
      </section>

      <MailingList />
      <Footer />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

/* ── Sub-components ── */

function EventCard({ ev }: { ev: Event }) {
  const inner = (
    <div
      style={{ background: "var(--black)", padding: "24px 20px", position: "relative", overflow: "hidden", transition: "background 0.2s", borderLeft: "3px solid transparent" }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--mid-gray)"; e.currentTarget.style.borderLeftColor = "var(--accent-cyan)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--black)"; e.currentTarget.style.borderLeftColor = "transparent"; }}
    >
      <span style={{
        display: "inline-block",
        fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" as const,
        padding: "3px 8px", marginBottom: 10,
        background: ev.type === "ag" ? "rgba(0,255,204,0.1)" : "rgba(255,230,0,0.07)",
        color:      ev.type === "ag" ? "var(--accent-cyan)"  : "var(--accent-yellow)",
        border:    `1px solid ${ev.type === "ag" ? "rgba(0,255,204,0.25)" : "rgba(255,230,0,0.2)"}`,
      }}>
        {ev.type === "ag" ? "↑ AG Event" : "■ Community"}
      </span>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 5vw, 40px)", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 4 }}>
        {ev.month} {ev.day}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--off-white)", marginBottom: 5 }}>{ev.title}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)", letterSpacing: "0.1em" }}>{ev.venue} · {ev.city}</div>
    </div>
  );
  return ev.slug
    ? <Link href={`/events/${ev.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>{inner}</Link>
    : <>{inner}</>;
}

function EmbedZone({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div style={{ background: "var(--mid-gray)", padding: "52px 32px", textAlign: "center", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 44, marginBottom: 14, filter: "grayscale(1)" }}>{icon}</div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.1em", marginBottom: 8 }}>{label}</h3>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{sub}</p>
    </div>
  );
}
