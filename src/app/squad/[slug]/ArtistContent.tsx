"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import type { SquadMember, Event } from "@/lib/db";

type GalleryItem = { url: string; isMain: boolean; visible: boolean };
type TraxxItem = { url: string; type: string };
type LinkItem = { label: string; url: string };

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseMonth(m: string): string {
  const n = parseInt(m, 10);
  return isNaN(n) ? m : (MONTH_ABBR[n - 1] ?? m);
}

function SectionLabel({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <p style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: 9,
      color: accent ? "var(--accent-cyan)" : "var(--gray)",
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      marginBottom: 14,
    }}>
      // {text}
    </p>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <SectionLabel text={label} accent />
      {children}
    </div>
  );
}

export default function ArtistContent({ member, events }: { member: SquadMember; events: Event[] }) {
  const gallery: GalleryItem[] = member.gallery ? JSON.parse(member.gallery) : [];
  const traxx: TraxxItem[] = member.traxx ? JSON.parse(member.traxx) : [];
  const links: LinkItem[] = member.links ? JSON.parse(member.links) : [];
  const visibleGallery = gallery.filter((g) => g.visible);
  const mainPhoto = gallery.find((g) => g.isMain && g.visible) ?? visibleGallery[0];
  const carouselPhotos = visibleGallery.filter((g) => !g.isMain || visibleGallery.length === 1);
  const notableShows = (member.notableShows ?? "").split("\n").filter(Boolean);
  const alsoKnownAs = (member.alsoKnownAs ?? "").split("\n").filter(Boolean);

  const [galleryIdx, setGalleryIdx] = useState(0);
  useEffect(() => {
    if (carouselPhotos.length <= 1) return;
    const id = setInterval(() => setGalleryIdx((i) => (i + 1) % carouselPhotos.length), 4000);
    return () => clearInterval(id);
  }, [carouselPhotos.length]);

  const bodyText: React.CSSProperties = {
    fontSize: 13,
    lineHeight: 1.85,
    color: "var(--off-white)",
    fontFamily: "'Space Mono', monospace",
    fontWeight: 300,
  };

  const bulletList: React.CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const bulletItem: React.CSSProperties = {
    ...bodyText,
    paddingLeft: 16,
    position: "relative",
    marginBottom: 6,
  };

  return (
    <main style={{ background: "var(--black)", minHeight: "100vh" }}>
      <Nav />

      <div style={{ paddingTop: 64 }}>

        {/* ── Page Banner ── */}
        <div style={{
          background: "var(--dark-gray)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <Link href="/squad" style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            ← Squad
          </Link>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Really Underground, Really Outside.&nbsp;&nbsp;est. 2021.
          </p>
        </div>

        {/* ── Title Bar ── */}
        <div style={{
          background: "var(--black)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "48px 40px 40px",
        }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--accent-cyan)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
            {member.role}
          </p>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 10vw, 120px)",
            letterSpacing: "0.04em",
            lineHeight: 0.9,
            color: "var(--white)",
            marginBottom: 20,
          }}>
            {member.name}
          </h1>
          {member.quote && (
            <blockquote style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              fontStyle: "italic",
              borderLeft: "2px solid var(--accent-cyan)",
              paddingLeft: 16,
              maxWidth: 560,
              lineHeight: 1.6,
              margin: 0,
            }}>
              &ldquo;{member.quote}&rdquo;
            </blockquote>
          )}
        </div>

        {/* ── Info Block + Main Photo ── */}
        <section className="artist-profile-grid">

          {/* Info Block — left */}
          <div style={{ padding: "48px 40px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.06em", color: "var(--white)", marginBottom: 32 }}>
              The Low-Down:
            </h2>

            {member.bio && (
              <InfoRow label="Bio">
                <p style={bodyText}>{member.bio}</p>
              </InfoRow>
            )}

            {notableShows.length > 0 && (
              <InfoRow label="Notable Shows">
                <ul style={bulletList}>
                  {notableShows.map((show, i) => (
                    <li key={i} style={bulletItem}>
                      <span style={{ position: "absolute", left: 0, color: "var(--accent-cyan)" }}>—</span>
                      {show}
                    </li>
                  ))}
                </ul>
              </InfoRow>
            )}

            {alsoKnownAs.length > 0 && (
              <InfoRow label="A.K.A.">
                <ul style={bulletList}>
                  {alsoKnownAs.map((aka, i) => (
                    <li key={i} style={bulletItem}>
                      <span style={{ position: "absolute", left: 0, color: "var(--accent-cyan)" }}>—</span>
                      {aka}
                    </li>
                  ))}
                </ul>
              </InfoRow>
            )}

            {member.bpm && (
              <InfoRow label="Fave BPM">
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "var(--accent-cyan)", letterSpacing: "0.06em", lineHeight: 1 }}>
                  {member.bpm} <span style={{ fontSize: 14, color: "var(--gray)", letterSpacing: "0.2em" }}>BPM</span>
                </p>
              </InfoRow>
            )}

            {links.length > 0 && (
              <InfoRow label="Links">
                <ul style={bulletList}>
                  {links.map((l, i) => (
                    <li key={i} style={{ ...bulletItem, marginBottom: 8 }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--accent-cyan)" }}>—</span>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--off-white)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 1, transition: "color 0.2s, border-color 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-cyan)"; e.currentTarget.style.borderColor = "var(--accent-cyan)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--off-white)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                      >
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </InfoRow>
            )}

            {member.contact && (
              <InfoRow label="Contact / Booking">
                <a
                  href={member.contact}
                  target={member.contact.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--black)",
                    background: "var(--accent-cyan)",
                    padding: "8px 18px",
                    textDecoration: "none",
                    fontWeight: 700,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--white)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-cyan)")}
                >
                  Get in Touch ↗
                </a>
              </InfoRow>
            )}
          </div>

          {/* Main Photo — right */}
          <div style={{ position: "relative", background: "var(--dark-gray)", minHeight: 480, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {mainPhoto ? (
              <Image
                src={mainPhoto.url}
                alt={member.name}
                width={800}
                height={640}
                style={{ objectFit: "cover", objectPosition: "center top", width: "100%", height: "100%" }}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 120, height: 120, borderRadius: "50%",
                  background: "rgba(0,255,204,0.06)",
                  border: "1px solid rgba(0,255,204,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "var(--accent-cyan)",
                  margin: "0 auto 16px",
                }}>
                  {member.initials}
                </div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Photo TBD
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── Featured Traxx ── */}
        {traxx.length > 0 && (
          <section style={{ background: "var(--black)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "56px 40px" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.06em", color: "var(--white)", marginBottom: 32 }}>
              Featured Traxxx + Mixes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {traxx.map((t, i) => (
                <a
                  key={i}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr auto",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    background: "var(--dark-gray)",
                    textDecoration: "none",
                    transition: "background 0.2s",
                    borderLeft: "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--mid-gray)"; e.currentTarget.style.borderLeftColor = "var(--accent-cyan)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--dark-gray)"; e.currentTarget.style.borderLeftColor = "transparent"; }}
                >
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--off-white)", letterSpacing: "0.1em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.url.replace(/^https?:\/\//, "")}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-cyan)", whiteSpace: "nowrap" }}>
                    {t.type} ↗
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── Gallery ── */}
        {visibleGallery.length > 0 && (
          <section style={{ background: "var(--dark-gray)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "56px 40px" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.06em", color: "var(--white)", marginBottom: 32 }}>
              Gallery
            </h2>

            {/* Main carousel slot */}
            {carouselPhotos.length > 0 && (
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", background: "var(--black)", overflow: "hidden", marginBottom: carouselPhotos.length > 1 ? 16 : 0 }}>
                {carouselPhotos.map((photo, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute", inset: 0,
                      opacity: i === galleryIdx ? 1 : 0,
                      transition: "opacity 0.8s ease",
                    }}
                  >
                    <Image src={photo.url} alt="" width={1440} height={630} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  </div>
                ))}

                {/* Dot indicators */}
                {carouselPhotos.length > 1 && (
                  <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                    {carouselPhotos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIdx(i)}
                        style={{ width: 6, height: 6, borderRadius: "50%", border: "none", background: i === galleryIdx ? "var(--accent-cyan)" : "rgba(255,255,255,0.3)", padding: 0, cursor: "crosshair", transition: "background 0.3s" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── Calendar ── */}
        {events.length > 0 && (
          <section style={{ background: "var(--black)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "56px 40px" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.06em", color: "var(--white)", marginBottom: 32 }}>
              Catch Me Outside @:
            </h2>
            <div>
              {events.map((ev) => (
                <div key={ev.id} className="event-row" style={{ background: "var(--dark-gray)" }}>
                  {/* Date */}
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.05em", lineHeight: 1, color: "var(--white)" }}>{ev.day}</p>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gray)", marginTop: 2 }}>{parseMonth(ev.month)} {ev.year}</p>
                  </div>
                  {/* Badge */}
                  <div>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: ev.type === "upcoming" ? "var(--accent-cyan)" : "var(--gray)", border: `1px solid ${ev.type === "upcoming" ? "rgba(0,255,204,0.3)" : "rgba(255,255,255,0.15)"}`, padding: "3px 7px" }}>
                      {ev.type}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="event-row-body">
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.04em", color: "var(--white)" }}>{ev.title}</p>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", letterSpacing: "0.1em" }}>{ev.venue} — {ev.city}</p>
                  </div>
                  {/* Arrow */}
                  {ev.slug && (
                    <div className="event-row-arrow">
                      <Link href={`/events/${ev.slug}`} style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--gray)", textDecoration: "none", letterSpacing: "0.1em" }}>
                        Info →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
