'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/db';

const EMPTY_FORM = {
  type: 'ag',
  month: '',
  day: '',
  year: '',
  title: '',
  venue: '',
  city: '',
  desc: '',
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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleEdit(event: Event) {
    setEditingId(event.id);
    setForm({
      type: event.type,
      month: event.month,
      day: event.day,
      year: event.year,
      title: event.title,
      venue: event.venue,
      city: event.city,
      desc: event.desc,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId !== null) {
        await fetch(`/api/admin/events/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      await fetchEvents();
      handleCancel();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this event?')) return;
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    await fetchEvents();
  }

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
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
            EVENTS
          </h1>
          <p
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {events.length} total
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
            + Add Event
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
            {editingId !== null ? 'EDIT EVENT' : 'ADD EVENT'}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setField('type', e.target.value)}
                  style={{ ...inputStyle }}
                >
                  <option value="ag">AG</option>
                  <option value="external">External</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Month (e.g. JUN)</label>
                <input
                  type="text"
                  value={form.month}
                  onChange={(e) => setField('month', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Day (e.g. 15)</label>
                <input
                  type="text"
                  value={form.day}
                  onChange={(e) => setField('day', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Year (e.g. 2026)</label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setField('year', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Venue</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setField('venue', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.desc}
                onChange={(e) => setField('desc', e.target.value)}
                required
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
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
            gridTemplateColumns: '80px 120px 1fr 140px 140px 100px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          <div>Type</div>
          <div>Date</div>
          <div>Title</div>
          <div>Venue</div>
          <div>City</div>
          <div>Actions</div>
        </div>

        {events.length === 0 && (
          <div
            style={{
              padding: '32px 20px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.25)',
              textAlign: 'center',
            }}
          >
            No events yet.
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 120px 1fr 140px 140px 100px',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.75)',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: event.type === 'ag' ? '#00ffcc' : '#ffe600',
                  background:
                    event.type === 'ag'
                      ? 'rgba(0,255,204,0.08)'
                      : 'rgba(255,230,0,0.08)',
                  padding: '2px 6px',
                }}
              >
                {event.type}
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
              {event.month} {event.day}, {event.year}
            </div>
            <div style={{ fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
              {event.title}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.venue}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.city}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleEdit(event)}
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
                onClick={() => handleDelete(event.id)}
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
