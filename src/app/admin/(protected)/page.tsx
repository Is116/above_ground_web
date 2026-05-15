'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Stats {
  events: number;
  squad: number;
  shop: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const [eventsRes, squadRes, shopRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/squad'),
        fetch('/api/shop'),
      ]);
      const [events, squad, shop] = await Promise.all([
        eventsRes.json(),
        squadRes.json(),
        shopRes.json(),
      ]);
      setStats({
        events: events.length,
        squad: squad.length,
        shop: shop.length,
      });
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Events', count: stats?.events ?? '-', href: '/admin/events', accent: '#00ffcc' },
    { label: 'Squad', count: stats?.squad ?? '-', href: '/admin/squad', accent: '#ffe600' },
    { label: 'Shop', count: stats?.shop ?? '-', href: '/admin/shop', accent: '#ff6b00' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 40,
            letterSpacing: '0.06em',
            color: '#fff',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          DASHBOARD
        </h1>
        <p
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          AboveGround Admin Panel
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {cards.map(({ label, count, href, accent }) => (
          <DashboardCard
            key={label}
            label={label}
            count={String(count)}
            href={href}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}

function DashboardCard({
  label,
  count,
  href,
  accent,
}: {
  label: string;
  count: string;
  href: string;
  accent: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#111',
          border: `1px solid ${hovered ? accent : 'rgba(255,255,255,0.06)'}`,
          padding: '32px 28px',
          transition: 'border-color 0.2s',
          cursor: 'crosshair',
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 56,
            color: accent,
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          {count}
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: accent,
            opacity: 0.7,
          }}
        >
          Manage →
        </div>
      </div>
    </Link>
  );
}
