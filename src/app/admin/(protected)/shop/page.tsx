'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ShopItem } from '@/lib/db';

const EMPTY_FORM = {
  icon: '',
  label: '',
  price: '',
};

const inputStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  padding: '8px 12px',
  fontFamily: "'Space Mono', monospace",
  fontSize: 12,
  width: '100%',
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

export default function AdminShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/shop');
    const data = await res.json();
    setItems(data);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function handleEdit(item: ShopItem) {
    setEditingId(item.id);
    setForm({
      icon: item.icon,
      label: item.label,
      price: item.price,
    });
    setShowForm(true);
  }

  function handleAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId !== null) {
        await fetch(`/api/admin/shop/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/admin/shop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      await fetchItems();
      handleCancel();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this shop item?')) return;
    await fetch(`/api/admin/shop/${id}`, { method: 'DELETE' });
    await fetchItems();
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 36,
              letterSpacing: '0.06em',
              color: '#fff',
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            SHOP
          </h1>
          <p
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {items.length} items
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAdd}
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
              cursor: 'crosshair',
            }}
          >
            + Add Item
          </button>
        )}
      </div>

      {showForm && (
        <div
          style={{
            background: '#111',
            border: '1px solid rgba(0,255,204,0.2)',
            padding: 28,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 20,
              letterSpacing: '0.06em',
              color: '#00ffcc',
              marginBottom: 20,
            }}
          >
            {editingId !== null ? 'EDIT ITEM' : 'ADD ITEM'}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Icon (symbol/emoji)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setField('icon', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setField('label', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Price (e.g. $5)</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#00ffcc',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '8px 24px',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: saving ? 'not-allowed' : 'crosshair',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'SAVING...' : editingId !== null ? 'UPDATE' : 'CREATE'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '8px 24px',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'crosshair',
                }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 120px 120px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          <div>Icon</div>
          <div>Label</div>
          <div>Price</div>
          <div>Actions</div>
        </div>

        {items.length === 0 && (
          <div
            style={{
              padding: '32px 20px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.25)',
              textAlign: 'center',
            }}
          >
            No shop items yet.
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 120px 120px',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.75)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 20,
                color: '#ffe600',
              }}
            >
              {item.icon}
            </div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16,
                color: '#00ffcc',
                letterSpacing: '0.05em',
              }}
            >
              {item.price}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleEdit(item)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(0,255,204,0.3)',
                  color: '#00ffcc',
                  padding: '4px 10px',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'crosshair',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,68,68,0.3)',
                  color: '#ff4444',
                  padding: '4px 10px',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'crosshair',
                }}
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
