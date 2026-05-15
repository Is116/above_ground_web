'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MarqueeItem } from '@/lib/db';

const inputStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  padding: '8px 12px',
  fontFamily: "'Space Mono', monospace",
  fontSize: 12,
  flex: 1,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 6,
};

export default function AdminMarqueePage() {
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/marquee');
    setItems(await res.json());
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    setSaving(true);
    await fetch('/api/admin/marquee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText.trim() }),
    });
    setNewText('');
    await fetchItems();
    setSaving(false);
  }

  function startEdit(item: MarqueeItem) {
    setEditingId(item.id);
    setEditText(item.text);
  }

  async function handleUpdate(id: number) {
    if (!editText.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/marquee/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText.trim() }),
    });
    setEditingId(null);
    await fetchItems();
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Remove this marquee item?')) return;
    await fetch(`/api/admin/marquee/${id}`, { method: 'DELETE' });
    await fetchItems();
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.06em', color: '#fff', lineHeight: 1, marginBottom: 4 }}>
          MARQUEE STRIPE
        </h1>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {items.length} items · scrolls left to right across the top
        </p>
      </div>

      {/* Add form */}
      <div style={{ background: '#111', border: '1px solid rgba(0,255,204,0.2)', padding: 24, marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00ffcc', marginBottom: 14 }}>
          Add Item
        </div>
        <form onSubmit={handleAdd}>
          <label style={labelStyle}>Text</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="e.g. New Artist Name"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={saving || !newText.trim()}
              style={{
                background: '#00ffcc',
                color: '#0a0a0a',
                border: 'none',
                padding: '8px 20px',
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: saving ? 'not-allowed' : 'crosshair',
                opacity: saving ? 0.6 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              + Add
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 120px',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
        }}>
          <div>#</div>
          <div>Text</div>
          <div>Actions</div>
        </div>

        {items.length === 0 && (
          <div style={{ padding: '32px 20px', fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
            No items yet.
          </div>
        )}

        {items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 120px',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace" }}>
              {idx + 1}
            </div>

            <div style={{ paddingRight: 16 }}>
              {editingId === item.id ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    autoFocus
                    style={{ ...inputStyle, flex: 1 }}
                    onKeyDown={e => { if (e.key === 'Escape') setEditingId(null); }}
                  />
                  <button
                    onClick={() => handleUpdate(item.id)}
                    disabled={saving}
                    style={{
                      background: '#00ffcc', color: '#0a0a0a', border: 'none',
                      padding: '6px 14px', fontFamily: "'Space Mono', monospace",
                      fontSize: 10, fontWeight: 700, cursor: 'crosshair',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      background: 'transparent', color: 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '6px 12px', fontFamily: "'Space Mono', monospace",
                      fontSize: 10, cursor: 'crosshair',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)',
                }}>
                  {item.text}
                  <span style={{ color: 'rgba(0,255,204,0.3)', margin: '0 10px' }}>✦</span>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {editingId !== item.id && (
                <>
                  <button
                    onClick={() => startEdit(item)}
                    style={{
                      background: 'transparent', border: '1px solid rgba(0,255,204,0.3)',
                      color: '#00ffcc', padding: '4px 10px',
                      fontFamily: "'Space Mono', monospace", fontSize: 9,
                      letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'crosshair',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      background: 'transparent', border: '1px solid rgba(255,68,68,0.3)',
                      color: '#ff4444', padding: '4px 10px',
                      fontFamily: "'Space Mono', monospace", fontSize: 9,
                      letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'crosshair',
                    }}
                  >
                    Del
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
