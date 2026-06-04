'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/db';
import { useUploadThing } from '@/lib/uploadthing';

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTH_TO_NUM: Record<string, string> = {
  JAN:'01',FEB:'02',MAR:'03',APR:'04',MAY:'05',JUN:'06',
  JUL:'07',AUG:'08',SEP:'09',OCT:'10',NOV:'11',DEC:'12',
};

function eventToDate(event: Event): string {
  const m = MONTH_TO_NUM[event.month.toUpperCase()] ?? '01';
  const d = event.day.padStart(2, '0');
  return `${event.year}-${m}-${d}`;
}

function dateToFields(dateStr: string): { month: string; day: string; year: string } {
  const [year, m, d] = dateStr.split('-');
  return {
    year,
    month: MONTH_ABBR[parseInt(m) - 1] ?? 'JAN',
    day: String(parseInt(d)),
  };
}

function autoSlug(date: string, title: string): string {
  const yy = date.slice(2, 4);
  const mm = date.slice(5, 7);
  const word = title.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!yy || !mm || !word) return '';
  return `${yy}${mm}-${word}`;
}

const EMPTY_FORM = {
  host: 'ag',
  title: '',
  date: '',
  venue: '',
  location: '',
  desc: '',
  artists: '',
  gallery: [] as string[],
  thankyou: '',
  slug: '',
  soundcloud: '',
  ticketUrl: '',
  slugEdited: false,
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
  const [uploading, setUploading] = useState(false);

  const { startUpload } = useUploadThing('eventGallery', {
    onClientUploadComplete: (res) => {
      const newUrls = res.map((f) => f.ufsUrl);
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...newUrls] }));
      setUploading(false);
    },
    onUploadError: () => setUploading(false),
  });

  const fetchEvents = useCallback(async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  function handleEdit(event: Event) {
    setEditingId(event.id);
    setForm({
      host: event.type,
      title: event.title,
      date: eventToDate(event),
      venue: event.venue,
      location: event.city,
      desc: event.desc,
      artists: event.artists ?? '',
      gallery: event.gallery ? JSON.parse(event.gallery) : [],
      thankyou: event.thankyou ?? '',
      slug: event.slug ?? '',
      soundcloud: event.soundcloud ?? '',
      ticketUrl: event.ticketUrl ?? '',
      slugEdited: !!event.slug,
    });
    setShowForm(true);
  }

  function handleAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, slugEdited: false });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function buildPayload() {
    const { month, day, year } = form.date ? dateToFields(form.date) : { month: '', day: '', year: '' };
    return {
      type: form.host,
      month,
      day,
      year,
      title: form.title,
      venue: form.venue,
      city: form.location,
      desc: form.desc,
      artists: form.artists || null,
      gallery: form.gallery.length ? JSON.stringify(form.gallery) : null,
      thankyou: form.thankyou || null,
      slug: form.slug || null,
      soundcloud: form.soundcloud || null,
      ticketUrl: form.ticketUrl || null,
    };
  }

  function handleDateOrTitleChange(field: 'date' | 'title', value: string) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (!next.slugEdited) {
        next.slug = autoSlug(field === 'date' ? value : f.date, field === 'title' ? value : f.title);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingId !== null) {
        await fetch(`/api/admin/events/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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

  function setField<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function removeGalleryItem(url: string) {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((u) => u !== url) }));
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    await startUpload(Array.from(files));
    e.target.value = '';
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.06em', color: '#fff', lineHeight: 1, marginBottom: 4 }}>
            EVENTS
          </h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {events.length} total
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAdd}
            style={{ background: '#00ffcc', color: '#0a0a0a', border: 'none', padding: '8px 20px', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'crosshair' }}
          >
            + Add Event
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: '#111', border: '1px solid rgba(0,255,204,0.2)', padding: 28, marginBottom: 32 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.06em', color: '#00ffcc', marginBottom: 20 }}>
            {editingId !== null ? 'EDIT EVENT' : 'ADD EVENT'}
          </div>
          <form onSubmit={handleSubmit}>

            {/* Row 1: Host + Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Host</label>
                <select value={form.host} onChange={(e) => setField('host', e.target.value)} style={inputStyle}>
                  <option value="ag">AG</option>
                  <option value="community">Community</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Title</label>
                <input type="text" value={form.title} onChange={(e) => handleDateOrTitleChange('title', e.target.value)} required style={inputStyle} />
              </div>
            </div>

            {/* Row 2: Date + Venue + Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleDateOrTitleChange('date', e.target.value)}
                  required
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Venue</label>
                <input type="text" value={form.venue} onChange={(e) => setField('venue', e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Location (e.g. Boston, MA)</label>
                <input type="text" value={form.location} onChange={(e) => setField('location', e.target.value)} required style={inputStyle} placeholder="Boston, MA" />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.desc} onChange={(e) => setField('desc', e.target.value)} required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Slug + Soundcloud + Ticket URL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Page Slug (YYMM-word, auto-suggested)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value, slugEdited: true }))}
                  style={inputStyle}
                  placeholder="2506-warehouse"
                />
              </div>
              <div>
                <label style={labelStyle}>Soundcloud URL</label>
                <input
                  type="url"
                  value={form.soundcloud}
                  onChange={(e) => setField('soundcloud', e.target.value)}
                  style={inputStyle}
                  placeholder="https://soundcloud.com/user/playlist"
                />
              </div>
              <div>
                <label style={labelStyle}>Ticket URL (future events)</label>
                <input
                  type="url"
                  value={form.ticketUrl}
                  onChange={(e) => setField('ticketUrl', e.target.value)}
                  style={inputStyle}
                  placeholder="https://ra.co/events/..."
                />
              </div>
            </div>

            {/* Artists */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Lineup (one artist per line — AG squad names link automatically)</label>
              <textarea value={form.artists} onChange={(e) => setField('artists', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="DJ Name&#10;Another Artist&#10;..." />
            </div>

            {/* Gallery */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Gallery</label>
              {form.gallery.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {form.gallery.map((url) => (
                    <div key={url} style={{ position: 'relative' }}>
                      {url.match(/\.(mp4|webm|mov)$/i) ? (
                        <video src={url} style={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }} muted />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }} />
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(url)}
                        style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,68,68,0.85)', border: 'none', color: '#fff', width: 18, height: 18, cursor: 'crosshair', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: uploading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)', padding: '7px 14px', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: uploading ? 'not-allowed' : 'crosshair' }}
              >
                <input type="file" multiple accept="image/*,video/*" onChange={handleFileInput} disabled={uploading} style={{ display: 'none' }} />
                {uploading ? 'UPLOADING...' : '+ Upload Photos / Videos'}
              </label>
            </div>

            {/* TY Block */}
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00ffcc', marginBottom: 12 }}>
                From the AG family:
              </div>
              <label style={labelStyle}>Thank You Message (also sent via email)</label>
              <textarea value={form.thankyou} onChange={(e) => setField('thankyou', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Thank you for coming out..." />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={saving || uploading}
                style={{ background: '#00ffcc', color: '#0a0a0a', border: 'none', padding: '8px 24px', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: (saving || uploading) ? 'not-allowed' : 'crosshair', opacity: (saving || uploading) ? 0.6 : 1 }}
              >
                {saving ? 'SAVING...' : editingId !== null ? 'UPDATE' : 'CREATE'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 24px', fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'crosshair' }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Event list table */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 110px 1fr 140px 160px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          <div>Host</div>
          <div>Date</div>
          <div>Title</div>
          <div>Venue</div>
          <div>Location</div>
          <div>Actions</div>
        </div>

        {events.length === 0 && (
          <div style={{ padding: '32px 20px', fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
            No events yet.
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            style={{ display: 'grid', gridTemplateColumns: '80px 110px 1fr 140px 160px 100px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.75)', alignItems: 'center' }}
          >
            <div>
              <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: event.type === 'ag' ? '#00ffcc' : '#ffe600', background: event.type === 'ag' ? 'rgba(0,255,204,0.08)' : 'rgba(255,230,0,0.08)', padding: '2px 6px' }}>
                {event.type === 'ag' ? 'AG' : 'Community'}
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
              <button onClick={() => handleEdit(event)} style={{ background: 'transparent', border: '1px solid rgba(0,255,204,0.3)', color: '#00ffcc', padding: '4px 10px', fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'crosshair' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(event.id)} style={{ background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', padding: '4px 10px', fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'crosshair' }}>
                Del
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
