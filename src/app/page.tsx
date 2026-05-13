"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import SectionHeader from "@/components/SectionHeader";
import MailingList from "@/components/MailingList";
import Footer from "@/components/Footer";

const ParticleField = dynamic(() => import("@/components/ParticleField"), { ssr: false });

const events = [
  { id: 1, type: "ag", date: "JUN 15", title: "AG Pres: Too Many Men Radio", venue: "TBA · Chicago, IL" },
  { id: 2, type: "ag", date: "JUL 18", title: "AboveGround × Vibe Syndicate", venue: "TBA · Chicago, IL" },
  { id: 3, type: "external", date: "AUG 03", title: "Sankta T @ Underground Resistance", venue: "Venue TBA · Detroit, MI" },
  { id: 4, type: "ag", date: "AUG 22", title: "AboveGround Open Decks", venue: "TBA · Chicago, IL" },
];

const squad = [
  { initials: "ST", name: "Sankta T", role: "DJ · Producer", quote: "Sauce: something unique to me" },
  { initials: "LL", name: "Louie Lanka", role: "DJ · Producer", quote: "Your vibe, your frequency" },
  { initials: "HL", name: "HypeLies", role: "DJ · Producer", quote: "Truth in the noise" },
  { initials: "DB", name: "Dru-Boy", role: "DJ · Producer", quote: "In the mix, always" },
  { initials: "GG", name: "Glass Guts", role: "DJ · Producer", quote: "Transparent frequencies" },
  { initials: "AX", name: "Alexi", role: "DJ · Producer", quote: "In the cut, always" },
];

export default function Home() {
  const [filter, setFilter] = useState<"all" | "ag" | "external">("all");

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <main>
      <ParticleField />
      <Nav />
      <div style={{ marginTop: 64 }}>
        <Marquee />
      </div>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 40px 100px",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--accent-cyan)",
            marginBottom: 40,
            animation: "fadeUp 0.8s ease forwards 0.2s",
            opacity: 0,
          }}
        >
          Est. 2021 — Really Underground, Really Outside
        </p>

        <Image
          src="/logos/logo-text.png"
          alt="AboveGround"
          width={680}
          height={160}
          priority
          style={{
            width: "min(640px, 85vw)",
            height: "auto",
            filter: "brightness(0) invert(1)",
            marginBottom: 36,
            animation: "fadeUp 0.8s ease forwards 0.4s",
            opacity: 0,
          }}
        />

        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.25em",
            color: "var(--gray)",
            textTransform: "uppercase",
            marginBottom: 60,
            animation: "fadeUp 0.8s ease forwards 0.6s",
            opacity: 0,
          }}
        >
          Music · Events · Community
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            animation: "fadeUp 0.8s ease forwards 0.8s",
            opacity: 0,
          }}
        >
          <Link
            href="/events"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--black)",
              background: "var(--accent-cyan)",
              padding: "12px 28px",
              textDecoration: "none",
              fontWeight: 700,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--white)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-cyan)")}
          >
            Upcoming Events
          </Link>
          <Link
            href="/squad"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--white)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "12px 28px",
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--white)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          >
            Meet the Squad
          </Link>
        </div>

        <p
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "var(--gray)",
            textTransform: "uppercase",
            animation: "fadeUp 0.8s ease forwards 1.2s",
            opacity: 0,
          }}
        >
          ↓ Scroll
        </p>
      </section>

      {/* WATCH / TWITCH */}
      <section
        id="watch"
        style={{
          position: "relative",
          zIndex: 10,
          background: "var(--mid-gray)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", minHeight: 280 }}>
          <div
            style={{
              writingMode: "vertical-lr",
              transform: "rotate(180deg)",
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent-magenta)",
              padding: "24px 20px",
              background: "rgba(255,0,119,0.05)",
              borderRight: "1px solid rgba(255,0,119,0.15)",
              whiteSpace: "nowrap",
            }}
          >
            Live / Watch
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <div>
              <div
                className="pulse-dot"
                style={{
                  display: "inline-block",
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-magenta)",
                  marginBottom: 20,
                }}
              />
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 32,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                AboveGround Live
              </h3>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "var(--gray)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                24/7 Channel — Coming Soon
              </p>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.1em",
                }}
              >
                {/* Swap this comment for your Twitch iframe: */}
                {/* <iframe src="https://player.twitch.tv/?channel=YOURCHANNEL&parent=yourdomain.com" ... /> */}
                Twitch embed drops here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        style={{
          padding: "80px 40px",
          background: "var(--black)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <SectionHeader num="01" title="Events" sub="Upcoming" />

        {/* Filter buttons */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          {[
            { key: "all", label: "All Events" },
            { key: "ag", label: "↑ AG Events" },
            { key: "external", label: "■ Non-AG" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "7px 16px",
                border: filter === f.key
                  ? "1px solid rgba(0,255,204,0.4)"
                  : "1px solid rgba(255,255,255,0.12)",
                background: filter === f.key ? "rgba(0,255,204,0.1)" : "transparent",
                color: filter === f.key ? "var(--accent-cyan)" : "var(--gray)",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {filtered.map((ev) => (
            <EventCard key={ev.id} {...ev} />
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: "right" }}>
          <Link
            href="/events"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent-cyan)",
              textDecoration: "none",
            }}
          >
            View Full Calendar →
          </Link>
        </div>
      </section>

      {/* SQUAD PREVIEW */}
      <section
        id="squad"
        style={{
          padding: "80px 40px",
          background: "var(--mid-gray)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <SectionHeader num="02" title="Squad" sub="The Crew" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {squad.map((m) => (
            <SquadCard key={m.name} {...m} />
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: "right" }}>
          <Link
            href="/squad"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent-cyan)",
              textDecoration: "none",
            }}
          >
            Full Squad Pages →
          </Link>
        </div>
      </section>

      {/* TRAXX */}
      <section
        id="traxxx"
        style={{
          padding: "80px 40px",
          background: "var(--black)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <SectionHeader num="03" title="Traxx" sub="Listen" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            background: "rgba(255,255,255,0.07)",
          }}
        >
          <EmbedZone icon="☁" label="Soundcloud" sub="Drop your SC playlist link" />
          <EmbedZone icon="◈" label="Bandcamp" sub="Link your Bandcamp releases" />
        </div>
      </section>

      {/* SHOP TEASER */}
      <section
        id="shop"
        style={{
          padding: "80px 40px",
          background: "var(--mid-gray)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <SectionHeader num="04" title="Shop" sub="Merch" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {[
            { icon: "◎", label: "Stickers" },
            { icon: "▣", label: "Shirts" },
            { icon: "⬡", label: "USB Mixes" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--mid-gray)",
                padding: "40px 32px",
                textAlign: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--dark-gray)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--mid-gray)")}
            >
              <div style={{ fontSize: 44, marginBottom: 16, filter: "grayscale(1)" }}>{item.icon}</div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 22,
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  color: "var(--gray)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Coming Soon
              </div>
            </div>
          ))}
        </div>
      </section>

      <MailingList />
      <Footer />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

function EventCard({
  type,
  date,
  title,
  venue,
}: {
  type: string;
  date: string;
  title: string;
  venue: string;
}) {
  return (
    <div
      style={{
        background: "var(--black)",
        padding: "28px 32px",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.2s",
        borderLeft: "3px solid transparent",
        cursor: "crosshair",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--mid-gray)";
        e.currentTarget.style.borderLeftColor = "var(--accent-cyan)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--black)";
        e.currentTarget.style.borderLeftColor = "transparent";
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "3px 8px",
          marginBottom: 12,
          background: type === "ag" ? "rgba(0,255,204,0.1)" : "rgba(255,230,0,0.07)",
          color: type === "ag" ? "var(--accent-cyan)" : "var(--accent-yellow)",
          border: `1px solid ${type === "ag" ? "rgba(0,255,204,0.25)" : "rgba(255,230,0,0.2)"}`,
        }}
      >
        {type === "ag" ? "↑ AG Event" : "■ Non-AG"}
      </span>
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 40,
          letterSpacing: "0.05em",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {date}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--off-white)", marginBottom: 6 }}>{title}</div>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: "var(--gray)",
          letterSpacing: "0.1em",
        }}
      >
        {venue}
      </div>
    </div>
  );
}

function SquadCard({
  initials,
  name,
  role,
  quote,
}: {
  initials: string;
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <Link
      href={`/squad/${name.toLowerCase().replace(/\s+/g, "-")}`}
      style={{
        display: "block",
        background: "var(--mid-gray)",
        padding: "32px 28px",
        textDecoration: "none",
        color: "inherit",
        transition: "background 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--dark-gray)")}
      onMouseLeave={e => (e.currentTarget.style.background = "var(--mid-gray)")}
    >
      <div
        style={{
          width: 52, height: 52,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20,
          letterSpacing: "0.05em",
          marginBottom: 16,
          transition: "border-color 0.2s",
        }}
      >
        {initials}
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.08em", marginBottom: 4 }}>
        {name}
      </div>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--gray)",
          marginBottom: 14,
        }}
      >
        {role}
      </div>
      <div
        style={{
          fontSize: 12,
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.45)",
          fontStyle: "italic",
          borderLeft: "2px solid rgba(0,255,204,0.25)",
          paddingLeft: 12,
        }}
      >
        &ldquo;{quote}&rdquo;
      </div>
    </Link>
  );
}

function EmbedZone({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div
      style={{
        background: "var(--mid-gray)",
        padding: "48px 40px",
        textAlign: "center",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16, filter: "grayscale(1)" }}>{icon}</div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.1em", marginBottom: 8 }}>
        {label}
      </h3>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: "var(--gray)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {sub}
      </p>
    </div>
  );
}
