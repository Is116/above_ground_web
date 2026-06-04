"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "ag_signed_up";

const mono: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
};

export default function LandingPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [phase,    setPhase]    = useState<"idle" | "confirmed">("idle");
  const [emailErr, setEmailErr] = useState("");
  const [enterErr, setEnterErr] = useState(false);

  // Returning visitor — already signed up
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) setPhase("confirmed");
  }, []);

  function handleSignup() {
    setEmailErr("");
    const val = email.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailErr("// invalid email address");
      return;
    }
    localStorage.setItem(STORAGE_KEY, "1");
    setPhase("confirmed");
    setEmail("");
  }

  function handleEnter() {
    if (phase === "confirmed") {
      router.push("/");
    } else {
      setEnterErr(true);
    }
  }

  const confirmed = phase === "confirmed";

  return (
    <main style={{
      background: "var(--black)", minHeight: "100vh", color: "#fff",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "60px 20px",
    }}>
      <div className="noise-overlay" />
      <div className="scanlines" />

      {/* ── Branding ── */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 12vw, 96px)", letterSpacing: "0.05em", lineHeight: 1 }}>
          AboveGround
        </div>
        <p style={{ ...mono, fontSize: 8, color: "rgba(255,255,255,0.28)", marginTop: 10 }}>
          Really Underground, Really Outside · Est. 2021
        </p>
      </div>

      {/* ── Content card ── */}
      <div style={{ width: "min(520px, 92vw)", textAlign: "center" }}>

        {/* ── Signup block ── */}
        {!confirmed ? (
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(42px, 9vw, 68px)",
              letterSpacing: "0.04em", lineHeight: 1,
              color: "var(--accent-cyan)", marginBottom: 16,
            }}>
              Get Involved!
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.5)", marginBottom: 36 }}>
              Y&apos;all know we&apos;re only gonna hit you with the important stuff — new drops,
              upcoming events, and all the latest from the AG family.
            </p>

            {/* Email row */}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailErr(""); setEnterErr(false); }}
                onKeyDown={e => e.key === "Enter" && handleSignup()}
                placeholder="your@email.com"
                style={{
                  flex: "1 1 180px", minWidth: 0,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRight: "none",
                  color: "#fff", fontFamily: "'Space Mono', monospace",
                  fontSize: 12, padding: "14px 18px", outline: "none", letterSpacing: "0.05em",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,255,204,0.55)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
              <button
                onClick={handleSignup}
                style={{
                  flex: "0 0 auto",
                  background: "var(--accent-cyan)", color: "var(--black)",
                  border: "none", ...mono, fontSize: 9, fontWeight: 700,
                  padding: "14px 20px", whiteSpace: "nowrap", cursor: "crosshair",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-cyan)")}
              >
                Come Rock With Us
              </button>
            </div>

            {emailErr && (
              <p style={{ ...mono, fontSize: 9, color: "var(--accent-magenta)", marginTop: 10, textAlign: "left" }}>
                {emailErr}
              </p>
            )}
          </div>
        ) : (
          /* ── Confirmation ── */
          <div style={{ padding: "8px 0 4px" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🎉</div>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(32px, 7vw, 52px)",
              letterSpacing: "0.04em", color: "var(--accent-cyan)", marginBottom: 12,
            }}>
              You&apos;re In!
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
              Check your email for a little somethin&apos; 😉
            </p>
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "44px 0 36px" }} />

        {/* ── Enter button ── */}
        <button
          onClick={handleEnter}
          style={{
            ...mono, fontSize: 11, fontWeight: 700,
            padding: "15px 56px",
            border: `1px solid ${confirmed ? "var(--accent-cyan)" : "rgba(255,255,255,0.13)"}`,
            background: "transparent",
            color: confirmed ? "var(--accent-cyan)" : "rgba(255,255,255,0.25)",
            cursor: "crosshair", transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            if (confirmed) { e.currentTarget.style.background = "var(--accent-cyan)"; e.currentTarget.style.color = "var(--black)"; }
          }}
          onMouseLeave={e => {
            if (confirmed) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-cyan)"; }
          }}
        >
          Enter ↗
        </button>

        {enterErr && (
          <p style={{ ...mono, fontSize: 9, color: "var(--accent-magenta)", marginTop: 16 }}>
            Oooh, you&apos;re movin&apos; too fast! Sign up above ⬆️
          </p>
        )}
      </div>

      {/* ── Footer micro ── */}
      <p style={{ position: "absolute", bottom: 24, ...mono, fontSize: 7, color: "rgba(255,255,255,0.12)" }}>
        AboveGround © 2021–2026
      </p>
    </main>
  );
}
