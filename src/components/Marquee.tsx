"use client";

const items = [
  "Sankta T", "Louie Lanka", "HypeLies", "Dru-Boy", "Glass Guts", "Alexi",
  "Really Underground, Really Outside", "Est. 2021", "Chicago, IL",
  "Music · Events · Community",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,255,204,0.03)",
        padding: "11px 0",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent-cyan)",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            {item}
            <span style={{ color: "rgba(0,255,204,0.3)", marginLeft: 40 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
