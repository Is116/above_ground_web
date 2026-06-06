'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  items: string[];
  title: string;
  venue: string;
  city: string;
  artists: string | null;
  squadSlugs: string[];
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

function parseArtists(raw: string | null, slugs: string[]): Array<{ name: string; slug: string | null }> {
  if (!raw) return [];
  return raw.split('\n').map(line => {
    const name = line.trim();
    const slug = slugs.find(s => s.toLowerCase() === name.toLowerCase().replace(/\s+/g, '-')) ?? null;
    return { name, slug };
  }).filter(a => a.name);
}

export default function GallerySlideshow({ items, title, venue, city, artists, squadSlugs }: Props) {
  const [idx, setIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parsed = parseArtists(artists, squadSlugs);

  useEffect(() => {
    if (items.length <= 1) return;
    const current = items[idx];
    if (isVideo(current)) return;
    const t = setTimeout(() => setIdx(i => (i + 1) % items.length), 4000);
    return () => clearTimeout(t);
  }, [idx, items]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [idx]);

  if (!items.length) return null;

  const current = items[idx];
  const vid = isVideo(current);

  return (
    <div style={{ position: 'relative', width: '100%', background: '#000' }}>
      {/* Media */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '820/312', overflow: 'hidden' }}>
        {vid ? (
          <video
            ref={videoRef}
            key={current}
            src={current}
            muted
            loop
            playsInline
            onEnded={() => setIdx(i => (i + 1) % items.length)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current}
            src={current}
            alt=""
            width={1640}
            height={624}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.5s' }}
          />
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

        {/* Dot indicators */}
        {items.length > 1 && (
          <div style={{ position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                style={{ width: 6, height: 6, borderRadius: '50%', border: 'none', background: i === idx ? '#00ffcc' : 'rgba(255,255,255,0.35)', cursor: 'crosshair', padding: 0, transition: 'background 0.2s' }}
              />
            ))}
          </div>
        )}

        {/* Event info overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 40px 20px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00ffcc', marginBottom: 10 }}>
            {venue} · {city}
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 6vw, 64px)', letterSpacing: '0.04em', lineHeight: 1, color: '#fff', marginBottom: parsed.length ? 16 : 0 }}>
            {title}
          </h1>
          {parsed.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
              {parsed.map(({ name, slug }) => (
                slug ? (
                  <a
                    key={name}
                    href={`/squad/${slug}`}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ffcc', textDecoration: 'none' }}
                  >
                    {name} ↗
                  </a>
                ) : (
                  <span key={name} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                    {name}
                  </span>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
