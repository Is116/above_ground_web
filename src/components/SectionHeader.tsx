interface SectionHeaderProps {
  num: string;
  title: string;
  sub?: string;
}

export default function SectionHeader({ num, title, sub }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 48 }}>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--accent-cyan)",
        }}
      >
        / {num}
      </span>
      <h2
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(40px, 6vw, 72px)",
          letterSpacing: "0.05em",
          lineHeight: 1,
          color: "var(--white)",
        }}
      >
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      {sub && (
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--gray)",
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
