'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/squad', label: 'Squad' },
  { href: '/admin/shop', label: 'Shop' },
  { href: '/admin/marquee', label: 'Marquee' },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <aside
      style={{
        width: 200,
        minWidth: 200,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#111',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        fontFamily: "'Space Mono', monospace",
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 24px 32px' }}>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26,
            letterSpacing: '0.08em',
            color: '#00ffcc',
            lineHeight: 1,
          }}
        >
          AG ADMIN
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          PANEL
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: 'rgba(255,255,255,0.07)',
          marginBottom: 16,
        }}
      />

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0 16px' }}>
        {NAV_LINKS.map(({ href, label }) => {
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block',
                padding: '10px 12px',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive ? '#00ffcc' : 'rgba(255,255,255,0.55)',
                background: isActive
                  ? 'rgba(0,255,204,0.07)'
                  : 'transparent',
                borderLeft: isActive
                  ? '2px solid #00ffcc'
                  : '2px solid transparent',
                marginBottom: 4,
                transition: 'all 0.15s',
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.07)',
            marginBottom: 16,
          }}
        />
        <button
          onClick={handleLogout}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 12px',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'transparent',
            border: '1px solid rgba(255,68,68,0.4)',
            color: '#ff4444',
            fontFamily: "'Space Mono', monospace",
            cursor: 'crosshair',
            textAlign: 'left',
            transition: 'all 0.15s',
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
