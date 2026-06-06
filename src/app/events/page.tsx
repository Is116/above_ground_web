"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Event } from "@/lib/db";

// ── Timeline helpers ──────────────────────────────────────────────────────────

// Bounds are computed from event data — these are fallbacks only
const FALLBACK_YEAR = new Date().getFullYear();

const MONTH_IDX: Record<string, number> = {
  JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11,
};

function eventMs(e: Event): number {
  return new Date(parseInt(e.year), MONTH_IDX[e.month] ?? 0, parseInt(e.day)).getTime();
}

function timelinePct(ms: number, start: number, span: number): number {
  return Math.max(0, Math.min(100, (ms - start) / span * 100));
}

function isPastMs(e: Event, now: number): boolean {
  return now > 0 && eventMs(e) < now;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const mono: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [events, setEvents]       = useState<Event[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [filter, setFilter]       = useState<"all" | "ag" | "community">("all");
  const [now, setNow]             = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const timelineRef               = useRef<HTMLDivElement>(null);
  const tlScrollRef               = useRef<HTMLDivElement>(null);
  const isDragging                = useRef(false);
  const dragStartX                = useRef(0);
  const dragScrollLeft            = useRef(0);
  const hasDragged                = useRef(false);

  // Derive timeline bounds from actual event data
  const eventDates = events.map(eventMs);
  const minYear = eventDates.length ? new Date(Math.min(...eventDates)).getFullYear() : FALLBACK_YEAR;
  const maxYear = eventDates.length ? new Date(Math.max(...eventDates)).getFullYear() : FALLBACK_YEAR;
  const tlStart = new Date(`${minYear - 1}-01-01`).getTime();
  const tlEnd   = new Date(`${maxYear + 1}-12-31`).getTime();
  const tlSpan  = Math.max(tlEnd - tlStart, 1);
  const tlYears = Array.from({ length: maxYear - minYear + 3 }, (_, i) => minYear - 1 + i);

  // All months within the range for tick marks + labels
  const MONTH_ABBR3 = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const tlMonths: { ms: number; label: string; isJan: boolean }[] = [];
  for (let y = minYear - 1; y <= maxYear + 1; y++) {
    for (let m = 0; m < 12; m++) {
      const ms = new Date(y, m, 1).getTime();
      if (ms >= tlStart && ms <= tlEnd) {
        tlMonths.push({ ms, label: MONTH_ABBR3[m], isJan: m === 0 });
      }
    }
  }

  useEffect(() => { setNow(Date.now()); }, []);

  useEffect(() => {
    const clientNow = Date.now();
    setNow(clientNow);
    fetch("/api/events").then(r => r.json()).then((data: Event[]) => {
      setEvents(data);
      let closestIdx = 0, minDiff = Infinity;
      data.forEach((e, i) => {
        const diff = Math.abs(eventMs(e) - clientNow);
        if (diff < minDiff) { minDiff = diff; closestIdx = i; }
      });
      setSelectedIdx(closestIdx);
    });
  }, []);

  const selected = events[selectedIdx] ?? null;
  const gallery  = selected?.gallery ? (JSON.parse(selected.gallery) as string[]) : [];
  const thumb    = gallery[0] ?? null;
  const past     = selected ? isPastMs(selected, now) : false;

  // Scroll today into centre on first paint
  useEffect(() => {
    const el = tlScrollRef.current;
    if (!el || now === 0) return;
    const pct = timelinePct(now, tlStart, tlSpan) / 100;
    el.scrollLeft = Math.max(0, pct * el.scrollWidth - el.clientWidth / 2);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  // Centre on selected event when navigating
  useEffect(() => {
    const el = tlScrollRef.current;
    if (!el || !events.length) return;
    const pct = timelinePct(eventMs(events[selectedIdx]), tlStart, tlSpan) / 100;
    el.scrollTo({ left: Math.max(0, pct * el.scrollWidth - el.clientWidth / 2), behavior: "smooth" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx, events.length]);

  // Click on timeline bar to jump to nearest event
  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (hasDragged.current || !events.length) return;
    const rect   = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const pct    = (e.clientX - rect.left) / rect.width;
    const clickMs = tlStart + pct * tlSpan;
    let nearest = 0, minDiff = Infinity;
    events.forEach((ev, i) => {
      const diff = Math.abs(eventMs(ev) - clickMs);
      if (diff < minDiff) { minDiff = diff; nearest = i; }
    });
    setSelectedIdx(nearest);
  }, [events, tlStart, tlSpan]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  setSelectedIdx(i => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setSelectedIdx(i => Math.min(events.length - 1, i + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [events.length]);

  const filtered = filter === "all" ? events : events.filter(e => e.type === filter);

  return (
    <main style={{ background: "var(--black)", minHeight: "100vh", color: "#fff" }}>
      <Nav />
      <div style={{ paddingTop: 64 }}>

        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div className="events-header">
          <p style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>01 / Events</p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 8vw, 72px)", letterSpacing: "0.05em", lineHeight: 1, marginBottom: 10 }}>
            Events
          </h1>
          <p style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            Really Underground, Really Outside. &nbsp;est. 2021.
          </p>
        </div>

        {/* ── Timeline nav bar ──────────────────────────────────────────────── */}
        <div
          className="events-tl-bar"
          ref={tlScrollRef}
          onMouseDown={e => { isDragging.current = true; hasDragged.current = false; dragStartX.current = e.clientX; dragScrollLeft.current = tlScrollRef.current?.scrollLeft ?? 0; }}
          onMouseMove={e => { if (!isDragging.current) return; const dx = e.clientX - dragStartX.current; if (Math.abs(dx) > 3) hasDragged.current = true; if (tlScrollRef.current) tlScrollRef.current.scrollLeft = dragScrollLeft.current - dx; }}
          onMouseUp={() => { isDragging.current = false; }}
          onMouseLeave={() => { isDragging.current = false; }}
        >
          <div style={{ width: `${(maxYear - minYear + 3) * 100}%` }}>

          {/* Label row: years + months */}
          <div style={{ position: "relative", height: 32 }}>
            {/* Year labels */}
            {tlYears.map(y => (
              <button
                key={`y-${y}`}
                onClick={() => {
                  if (!events.length) return;
                  const yMs = new Date(`${y}-01-01`).getTime();
                  let nearest = 0, minDiff = Infinity;
                  events.forEach((ev, i) => {
                    const diff = Math.abs(eventMs(ev) - yMs);
                    if (diff < minDiff) { minDiff = diff; nearest = i; }
                  });
                  setSelectedIdx(nearest);
                }}
                style={{
                  position: "absolute",
                  left: `${timelinePct(new Date(`${y}-01-01`).getTime(), tlStart, tlSpan)}%`,
                  transform: "translateX(-50%)",
                  top: 4,
                  ...mono, fontSize: 9,
                  color: "rgba(255,255,255,0.5)",
                  background: "none", border: "none",
                  cursor: "crosshair", padding: "0 4px",
                }}
              >
                {y}
              </button>
            ))}

            {/* Today label */}
            {now > 0 && (
              <span style={{
                position: "absolute",
                left: `${timelinePct(now, tlStart, tlSpan)}%`,
                top: "50%",
                transform: "translateX(-50%) translateY(-50%)",
                ...mono, fontSize: 7,
                color: "#00ffcc",
                background: "#0a0a0a",
                padding: "1px 5px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                zIndex: 2,
              }}>
                TODAY
              </span>
            )}

            {/* Month labels — skip JAN when it overlaps the year label */}
            {tlMonths.map(({ ms, label, isJan }) => (
              !isJan && (
                <span
                  key={ms}
                  className="events-tl-month-label"
                  style={{
                    position: "absolute",
                    left: `${timelinePct(ms, tlStart, tlSpan)}%`,
                    transform: "translateX(-50%)",
                    bottom: 4,
                    ...mono, fontSize: 7,
                    color: "rgba(255,255,255,0.22)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              )
            ))}
          </div>

          {/* Track */}
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            style={{ position: "relative", height: 44, cursor: "crosshair" }}
          >
            {/* Base line */}
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.1)", transform: "translateY(-50%)" }} />

            {/* Month tick marks */}
            {tlMonths.map(({ ms, isJan }) => (
              <div
                key={ms}
                style={{
                  position: "absolute",
                  left: `${timelinePct(ms, tlStart, tlSpan)}%`,
                  top: isJan ? "20%" : "35%",
                  bottom: isJan ? "20%" : "35%",
                  width: "1px",
                  background: isJan ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                }}
              />
            ))}

            {/* Today marker */}
            {now > 0 && (
              <div style={{ position: "absolute", left: `${timelinePct(now, tlStart, tlSpan).toFixed(4)}%`, top: 0, bottom: 0, width: "1px", background: "#00ffcc", opacity: 0.55, zIndex: 1 }} />
            )}

            {/* Event dots + tooltips */}
            {events.map((ev, i) => {
              const pct    = timelinePct(eventMs(ev), tlStart, tlSpan);
              const active = i === selectedIdx;
              const hovered = i === hoveredIdx;
              return (
                <div
                  key={ev.id}
                  style={{ position: "absolute", left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)", zIndex: 3 }}
                >
                  {/* Tooltip */}
                  {hovered && (
                    <div style={{
                      position: "absolute",
                      bottom: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: "5px 9px",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 10,
                    }}>
                      <div style={{ ...mono, fontSize: 9, color: "#fff", marginBottom: 2 }}>{ev.title}</div>
                      <div style={{ ...mono, fontSize: 7, color: "rgba(255,255,255,0.4)" }}>{ev.month} {ev.day}, {ev.year}</div>
                    </div>
                  )}
                  {/* Dot */}
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedIdx(i); }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="tl-dot-btn"
                    style={{ cursor: "crosshair" }}
                  >
                    <span style={{
                      display: "block",
                      width: active ? 12 : 8,
                      height: active ? 12 : 8,
                      borderRadius: "50%",
                      background: active ? "#00ffcc" : (ev.type === "ag" ? "rgba(0,255,204,0.5)" : "rgba(255,230,0,0.5)"),
                      border: active ? "2px solid #00ffcc" : "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.15s",
                      boxShadow: active ? "0 0 8px rgba(0,255,204,0.6)" : "none",
                    }} />
                  </button>
                </div>
              );
            })}
          </div>
          </div>
        </div>

        {/* ── Focused event pane ────────────────────────────────────────────── */}
        {selected && (
          <div className="events-focused">

            {/* Prev arrow */}
            <button
              onClick={() => setSelectedIdx(i => Math.max(0, i - 1))}
              disabled={selectedIdx === 0}
              aria-label="Previous event"
              className="events-focused-prev"
              style={{ cursor: selectedIdx === 0 ? "default" : "crosshair", color: selectedIdx === 0 ? "transparent" : "rgba(255,255,255,0.5)" }}
              onMouseEnter={e => { if (selectedIdx > 0) (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = selectedIdx === 0 ? "transparent" : "rgba(255,255,255,0.5)"}
            >
              ‹
            </button>

            {/* Next arrow */}
            <button
              onClick={() => setSelectedIdx(i => Math.min(events.length - 1, i + 1))}
              disabled={selectedIdx === events.length - 1}
              aria-label="Next event"
              className="events-focused-next"
              style={{ cursor: selectedIdx === events.length - 1 ? "default" : "crosshair", color: selectedIdx === events.length - 1 ? "transparent" : "rgba(255,255,255,0.5)" }}
              onMouseEnter={e => { if (selectedIdx < events.length - 1) (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = selectedIdx === events.length - 1 ? "transparent" : "rgba(255,255,255,0.5)"}
            >
              ›
            </button>

            {/* Thumbnail */}
            <div className="events-focused-thumb">
              {thumb ? (
                thumb.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
                  <video src={thumb} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" width={1080} height={1080} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
                  <span style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.1)" }}>No Gallery Yet</span>
                </div>
              )}
              {/* Gradient */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 70%, rgba(0,0,0,0.6))" }} />
            </div>

            {/* Info */}
            <div className="events-focused-info">
              {/* Badge + date */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  ...mono, fontSize: 9, padding: "2px 8px",
                  color: selected.type === "ag" ? "#00ffcc" : "#ffe600",
                  background: selected.type === "ag" ? "rgba(0,255,204,0.08)" : "rgba(255,230,0,0.08)",
                }}>
                  {selected.type === "ag" ? "↑ AG" : "■ Community"}
                </span>
                <span style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                  {selected.month} {selected.day}, {selected.year}
                </span>
              </div>

              {/* Title */}
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "0.04em", lineHeight: 1.05, margin: 0 }}>
                {selected.title}
              </h2>

              {/* Venue */}
              <p style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                {selected.venue} · {selected.city}
              </p>

              {/* Artists */}
              {selected.artists && (
                <p style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.8 }}>
                  {selected.artists.split("\n").join("  ·  ")}
                </p>
              )}

              {/* Dynamic subtext */}
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.05em", color: past ? "rgba(255,255,255,0.3)" : "#00ffcc", margin: 0 }}>
                {past ? "Absolute Scenes." : "Who's Pullin Up?"}
              </p>

              {/* CTA button */}
              <div>
                {past ? (
                  selected.slug ? (
                    <a
                      href={`/events/${selected.slug}`}
                      style={{ display: "inline-block", ...mono, fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "10px 22px", textDecoration: "none" }}
                    >
                      View Event →
                    </a>
                  ) : null
                ) : (
                  selected.ticketUrl ? (
                    <a
                      href={selected.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-block", ...mono, fontSize: 10, fontWeight: 700, background: "#00ffcc", color: "#0a0a0a", border: "none", padding: "10px 22px", textDecoration: "none" }}
                    >
                      Get Tickets →
                    </a>
                  ) : (
                    <span style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.2)" }}>Tickets TBA</span>
                  )
                )}
              </div>

              {/* Counter */}
              <span style={{ ...mono, fontSize: 8, color: "rgba(255,255,255,0.18)" }}>
                {selectedIdx + 1} / {events.length}
              </span>
            </div>
          </div>
        )}

        {/* ── Filter + Event list ───────────────────────────────────────────── */}
        <div className="events-filter">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {([["all", "All Events"], ["ag", "↑ AG Events"], ["community", "■ Community"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  ...mono, fontSize: 9,
                  padding: "7px 14px",
                  border: filter === key ? "1px solid rgba(0,255,204,0.4)" : "1px solid rgba(255,255,255,0.12)",
                  background: filter === key ? "rgba(0,255,204,0.1)" : "transparent",
                  color: filter === key ? "#00ffcc" : "rgba(255,255,255,0.45)",
                  cursor: "crosshair",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <section style={{ background: "var(--black)", position: "relative", zIndex: 10 }}>
          {filtered.map(ev => {
            const Tag = ev.slug ? "a" : "div";
            return (
              <Tag
                key={ev.id}
                {...(ev.slug ? { href: `/events/${ev.slug}` } : {})}
                className="event-row"
                style={{ textDecoration: "none", color: "inherit" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--mid-gray)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {/* Date */}
                <div className="event-row-date">
                  <div style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                    {ev.month} {ev.day.padStart(2, "0")}
                  </div>
                  <div style={{ ...mono, fontSize: 8, color: "rgba(255,255,255,0.25)" }}>{ev.year}</div>
                </div>

                {/* Type badge */}
                <span className="event-row-badge" style={{
                  ...mono, fontSize: 8,
                  padding: "3px 8px",
                  background: ev.type === "ag" ? "rgba(0,255,204,0.1)" : "rgba(255,230,0,0.07)",
                  color: ev.type === "ag" ? "var(--accent-cyan)" : "var(--accent-yellow)",
                  border: `1px solid ${ev.type === "ag" ? "rgba(0,255,204,0.25)" : "rgba(255,230,0,0.2)"}`,
                  whiteSpace: "nowrap",
                }}>
                  {ev.type === "ag" ? "↑ AG" : "■ Comm"}
                </span>

                {/* Title + venue inline */}
                <div className="event-row-body">
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.04em", lineHeight: 1.1, flexShrink: 0 }}>
                    {ev.title}
                  </span>
                  <span style={{ ...mono, fontSize: 8, color: "var(--gray)", whiteSpace: "nowrap" }}>
                    {ev.venue} · {ev.city}
                  </span>
                </div>

                {/* Arrow */}
                <div className="event-row-arrow">
                  <span style={{ ...mono, fontSize: 9, color: ev.slug ? "var(--accent-cyan)" : "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>
                    {ev.slug ? (isPastMs(ev, now) ? "View →" : "Details →") : "—"}
                  </span>
                </div>
              </Tag>
            );
          })}
        </section>

      </div>
      <Footer />
    </main>
  );
}
