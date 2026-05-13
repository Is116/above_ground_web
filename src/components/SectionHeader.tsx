interface SectionHeaderProps {
  num: string;
  title: string;
  sub?: string;
}

export default function SectionHeader({ num, title, sub }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        marginBottom: 40,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--accent-cyan)",
          flexShrink: 0,
        }}
      >
        / {num}
      </span>
      <h2
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(36px, 7vw, 72px)",
          letterSpacing: "0.05em",
          lineHeight: 1,
          color: "var(--white)",
        }}
      >
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)", minWidth: 20 }} />
      {sub && (
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--gray)",
            flexShrink: 0,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
