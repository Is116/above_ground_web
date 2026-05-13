"use client";

import { useState } from "react";

export default function MailingList() {
  const [email,    setEmail]    = useState("");
  const [msg,      setMsg]      = useState("");
  const [msgColor, setMsgColor] = useState("var(--accent-cyan)");

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      setMsgColor("var(--accent-magenta)");
      setMsg("// invalid email address");
      return;
    }
    setMsgColor("var(--accent-cyan)");
    setMsg("// you're in. welcome to aboveground.");
    setEmail("");
  };

  return (
    <section
      id="mailing"
      className="section-pad"
      style={{
        background: "var(--mid-gray)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--accent-magenta)",
            marginBottom: 20,
          }}
        >
          // Join The Community
        </p>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(36px, 8vw, 64px)",
            letterSpacing: "0.05em",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          Stay in the Loop
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "var(--gray)",
            lineHeight: 1.8,
            marginBottom: 40,
          }}
        >
          Get the first word on shows, drops, and whatever we&apos;re cooking up next.
          <br />No spam. Just signal.
        </p>

        {/* Form — stacks vertically on very small screens */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 440,
            margin: "0 auto",
          }}
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            style={{
              flex: "1 1 200px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRight: "none",
              color: "var(--white)",
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              padding: "14px 18px",
              outline: "none",
              letterSpacing: "0.05em",
              minWidth: 0,
            }}
            onFocus={e  => (e.currentTarget.style.borderColor = "var(--accent-cyan)")}
            onBlur={e   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
          />
          <button
            onClick={handleSubmit}
            style={{
              flex: "0 0 auto",
              background: "var(--accent-cyan)",
              color: "var(--black)",
              border: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "14px 22px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--white)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-cyan)")}
          >
            Subscribe
          </button>
        </div>

        <p
          style={{
            marginTop: 16,
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: msgColor,
            letterSpacing: "0.1em",
            minHeight: 20,
            transition: "color 0.2s",
          }}
        >
          {msg}
        </p>
      </div>
    </section>
  );
}
