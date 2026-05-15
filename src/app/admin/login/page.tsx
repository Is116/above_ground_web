'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Wrong password.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '40px',
          background: '#111',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 32,
            letterSpacing: '0.08em',
            color: '#00ffcc',
            marginBottom: 8,
          }}
        >
          AG ADMIN
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          RESTRICTED ACCESS
        </div>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 8,
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            style={{
              display: 'block',
              width: '100%',
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '10px 12px',
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              marginBottom: 16,
              outline: 'none',
            }}
          />

          {error && (
            <div
              style={{
                fontSize: 11,
                color: '#ff4444',
                marginBottom: 16,
                letterSpacing: '0.05em',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#00ffcc',
              color: '#0a0a0a',
              border: 'none',
              padding: '10px 0',
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'crosshair',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'CHECKING...' : 'ENTER'}
          </button>
        </form>
      </div>
    </div>
  );
}
