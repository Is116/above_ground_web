'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SquadMember } from '@/lib/db';

type GalleryItem = { url: string; isMain: boolean; visible: boolean };
type TraxxItem = { url: string; type: 'Single' | 'Release' | 'DJ Mix' };
type LinkItem = { label: string; url: string };

type FormState = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  quote: string;
  bpm: string;
  notableShows: string;
  alsoKnownAs: string;
  contact: string;
  links: LinkItem[];
  gallery: GalleryItem[];
  traxx: TraxxItem[];
};

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  role: '',
  bio: '',
  quote: '',
  bpm: '',
  notableShows: '',
  alsoKnownAs: '',
  contact: '',
  links: [],
  gallery: [],
  traxx: [],
};

function autoInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 3);
}

const inputStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  padding: '8px 12px',
  fontFamily: "'Space Mono', monospace",
  fontSize: 12,
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 6,
};

const sectionHeadStyle: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.07)',
  margin: '24px 0',
};

const smallBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'rgba(255,255,255,0.5)',
  padding: '3px 8px',
  fontFamily: "'Space Mono', monospace",
  fontSize: 9,
  letterSpacing: '0.06em',
  cursor: 'crosshair',
  flexShrink: 0,
};

export default function AdminSquadPage() {
  const [members, setMembers] = useState<SquadMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    const res = await fetch('/api/squad');
    setMembers(await res.json());
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  function handleEdit(member: SquadMember) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      slug: member.slug,
      role: member.role,
      bio: member.bio,
      quote: member.quote,
      bpm: member.bpm ?? '',
      notableShows: member.notableShows ?? '',
      alsoKnownAs: member.alsoKnownAs ?? '',
      contact: member.contact ?? '',
      links: member.links ? JSON.parse(member.links) : [],
      gallery: member.gallery ? JSON.parse(member.gallery) : [],
      traxx: member.traxx ? JSON.parse(member.traxx) : [],
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

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === 'name') {
        const name = value as string;
        if (f.slug === '' || f.slug === f.name.toLowerCase().replace(/\s+/g, '-')) {
          updated.slug = name.toLowerCase().replace(/\s+/g, '-');
        }
      }
      return updated;
    });
  }

  // Gallery helpers
  function addGalleryItem() {
    setForm((f) => ({
      ...f,
      gallery: [...f.gallery, { url: '', isMain: f.gallery.length === 0, visible: true }],
    }));
  }
  function updateGalleryItem(i: number, patch: Partial<GalleryItem>) {
    setForm((f) => ({
      ...f,
      gallery: f.gallery.map((item, idx) => {
        if ('isMain' in patch && patch.isMain) return idx === i ? { ...item, ...patch } : { ...item, isMain: false };
        return idx === i ? { ...item, ...patch } : item;
      }),
    }));
  }
  function removeGalleryItem(i: number) {
    setForm((f) => {
      const gallery = f.gallery.filter((_, idx) => idx !== i);
      if (gallery.length > 0 && !gallery.some((g) => g.isMain)) gallery[0].isMain = true;
      return { ...f, gallery };
    });
  }

  // Traxx helpers
  function addTraxxItem() {
    if (form.traxx.length >= 10) return;
    setForm((f) => ({ ...f, traxx: [...f.traxx, { url: '', type: 'Single' }] }));
  }
  function updateTraxxItem(i: number, patch: Partial<TraxxItem>) {
    setForm((f) => ({ ...f, traxx: f.traxx.map((item, idx) => (idx === i ? { ...item, ...patch } : item)) }));
  }
  function removeTraxxItem(i: number) {
    setForm((f) => ({ ...f, traxx: f.traxx.filter((_, idx) => idx !== i) }));
  }
  function moveTraxxItem(i: number, dir: -1 | 1) {
    setForm((f) => {
      const traxx = [...f.traxx];
      const j = i + dir;
      if (j < 0 || j >= traxx.length) return f;
      [traxx[i], traxx[j]] = [traxx[j], traxx[i]];
      return { ...f, traxx };
    });
  }

  // Links helpers
  function addLinkItem() {
    setForm((f) => ({ ...f, links: [...f.links, { label: '', url: '' }] }));
  }
  function updateLinkItem(i: number, patch: Partial<LinkItem>) {
    setForm((f) => ({ ...f, links: f.links.map((item, idx) => (idx === i ? { ...item, ...patch } : item)) }));
  }
  function removeLinkItem(i: number) {
    setForm((f) => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        initials: autoInitials(form.name),
        slug: form.slug,
        role: form.role,
        bio: form.bio,
        quote: form.quote,
        bpm: form.bpm || null,
        notableShows: form.notableShows || null,
        alsoKnownAs: form.alsoKnownAs || null,
        contact: form.contact || null,
        links: form.links.length ? JSON.stringify(form.links) : null,
        gallery: form.gallery.length ? JSON.stringify(form.gallery) : null,
        traxx: form.traxx.length ? JSON.stringify(form.traxx) : null,
      };
      if (editingId !== null) {
        await fetch(`/api/admin/squad/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch('/api/admin/squad', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      await fetchMembers();
      handleCancel();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this squad member?')) return;
    await fetch(`/api/admin/squad/${id}`, { method: 'DELETE' });
    await fetchMembers();
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.06em', color: '#fff', lineHeight: 1, marginBottom: 4 }}>SQUAD</h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{members.length} members</p>
        </div>
        {!showForm && (
          <button onClick={handleAdd} style={{ background: '#00ffcc', color: '#0a0a0a', border: 'none', padding: '8px 20px', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'crosshair' }}>
            + Add Member
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#111', border: '1px solid rgba(0,255,204,0.2)', padding: 28, marginBottom: 32 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.06em', color: '#00ffcc', marginBottom: 24 }}>
            {editingId !== null ? 'EDIT MEMBER' : 'ADD MEMBER'}
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Basic Info ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Artist Name</label>
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setField('slug', e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <input type="text" value={form.role} onChange={(e) => setField('role', e.target.value)} required style={inputStyle} />
              </div>
            </div>

            {/* BPM + Quote */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Fave BPM</label>
                <input type="number" min={60} max={220} value={form.bpm} onChange={(e) => setField('bpm', e.target.value)} placeholder="128" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Quote / Tagline</label>
                <input type="text" value={form.quote} onChange={(e) => setField('quote', e.target.value)} required style={inputStyle} />
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Bio (5–6 sentences)</label>
              <textarea value={form.bio} onChange={(e) => setField('bio', e.target.value)} required rows={5} placeholder="Artist bio..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={dividerStyle} />

            {/* Notable Shows + Also Known As */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Notable Shows — one per line</label>
                <textarea value={form.notableShows} onChange={(e) => setField('notableShows', e.target.value)} rows={4} placeholder={"Fabric, London 2023\nBoiler Room Berlin 2024\n..."} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>A.K.A. — one per line</label>
                <textarea value={form.alsoKnownAs} onChange={(e) => setField('alsoKnownAs', e.target.value)} rows={4} placeholder={"Real Name\nAlias 2\n..."} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            {/* Contact */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Contact / Booking URL</label>
              <input type="text" value={form.contact} onChange={(e) => setField('contact', e.target.value)} placeholder="mailto:booking@... or https://..." style={inputStyle} />
            </div>

            <div style={dividerStyle} />

            {/* Links */}
            <div style={{ marginBottom: 24 }}>
              <div style={sectionHeadStyle}>
                <span>Links</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>— Instagram, Bandcamp, Soundcloud, etc.</span>
              </div>
              {form.links.length === 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>No links added.</div>}
              {form.links.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="text" value={item.label} onChange={(e) => updateLinkItem(i, { label: e.target.value })} placeholder="Label (e.g. Instagram)" style={{ ...inputStyle, width: 160, flexShrink: 0 }} />
                  <input type="text" value={item.url} onChange={(e) => updateLinkItem(i, { url: e.target.value })} placeholder="https://..." style={{ ...inputStyle, flex: 1 }} />
                  <button type="button" onClick={() => removeLinkItem(i)} style={{ ...smallBtnStyle, borderColor: 'rgba(255,68,68,0.3)', color: '#ff4444' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addLinkItem} style={{ ...smallBtnStyle, marginTop: 4 }}>+ Add Link</button>
            </div>

            <div style={dividerStyle} />

            {/* Gallery */}
            <div style={{ marginBottom: 24 }}>
              <div style={sectionHeadStyle}>
                <span>Gallery</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>— set main photo, toggle visibility</span>
              </div>
              {form.gallery.length === 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>No photos/videos added.</div>}
              {form.gallery.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <input type="url" value={item.url} onChange={(e) => updateGalleryItem(i, { url: e.target.value })} placeholder="https://..." style={{ ...inputStyle, flex: 1 }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, letterSpacing: '0.1em', color: item.isMain ? '#00ffcc' : 'rgba(255,255,255,0.35)', cursor: 'crosshair', flexShrink: 0 }}>
                    <input type="radio" name="galleryMain" checked={item.isMain} onChange={() => updateGalleryItem(i, { isMain: true })} style={{ accentColor: '#00ffcc' }} />
                    MAIN
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, letterSpacing: '0.1em', color: item.visible ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', cursor: 'crosshair', flexShrink: 0 }}>
                    <input type="checkbox" checked={item.visible} onChange={(e) => updateGalleryItem(i, { visible: e.target.checked })} style={{ accentColor: '#00ffcc' }} />
                    SHOW
                  </label>
                  <button type="button" onClick={() => removeGalleryItem(i)} style={{ ...smallBtnStyle, borderColor: 'rgba(255,68,68,0.3)', color: '#ff4444' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addGalleryItem} style={{ ...smallBtnStyle, marginTop: 4 }}>+ Add Photo / Video</button>
            </div>

            <div style={dividerStyle} />

            {/* Traxx */}
            <div style={{ marginBottom: 28 }}>
              <div style={sectionHeadStyle}>
                <span>Traxx</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>— max 10, use arrows to reorder</span>
                <span style={{ color: form.traxx.length >= 10 ? '#ff4444' : 'rgba(255,255,255,0.2)' }}>{form.traxx.length}/10</span>
              </div>
              {form.traxx.length === 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>No tracks added.</div>}
              {form.traxx.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <input type="url" value={item.url} onChange={(e) => updateTraxxItem(i, { url: e.target.value })} placeholder="https://soundcloud.com/..." style={{ ...inputStyle, flex: 1 }} />
                  <select value={item.type} onChange={(e) => updateTraxxItem(i, { type: e.target.value as TraxxItem['type'] })} style={{ ...inputStyle, width: 'auto', cursor: 'crosshair' }}>
                    <option value="Single">Single</option>
                    <option value="Release">Release</option>
                    <option value="DJ Mix">DJ Mix</option>
                  </select>
                  <button type="button" onClick={() => moveTraxxItem(i, -1)} disabled={i === 0} style={{ ...smallBtnStyle, opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                  <button type="button" onClick={() => moveTraxxItem(i, 1)} disabled={i === form.traxx.length - 1} style={{ ...smallBtnStyle, opacity: i === form.traxx.length - 1 ? 0.3 : 1 }}>↓</button>
                  <button type="button" onClick={() => removeTraxxItem(i)} style={{ ...smallBtnStyle, borderColor: 'rgba(255,68,68,0.3)', color: '#ff4444' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addTraxxItem} disabled={form.traxx.length >= 10} style={{ ...smallBtnStyle, marginTop: 4, opacity: form.traxx.length >= 10 ? 0.3 : 1 }}>
                + Add Track
              </button>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} style={{ background: '#00ffcc', color: '#0a0a0a', border: 'none', padding: '8px 24px', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'crosshair', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'SAVING...' : editingId !== null ? 'UPDATE' : 'CREATE'}
              </button>
              <button type="button" onClick={handleCancel} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 24px', fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'crosshair' }}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Member list */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 160px 1fr 50px 100px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          <div>Init.</div><div>Name</div><div>Slug</div><div>Role</div><div>BPM</div><div>Actions</div>
        </div>
        {members.length === 0 && (
          <div style={{ padding: '32px 20px', fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>No squad members yet.</div>
        )}
        {members.map((member) => (
          <div key={member.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 160px 1fr 50px 100px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.75)', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#00ffcc', letterSpacing: '0.05em' }}>{member.initials}</div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{member.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.slug}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.role}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{member.bpm ?? '—'}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleEdit(member)} style={{ background: 'transparent', border: '1px solid rgba(0,255,204,0.3)', color: '#00ffcc', padding: '4px 10px', fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'crosshair' }}>Edit</button>
              <button onClick={() => handleDelete(member.id)} style={{ background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', padding: '4px 10px', fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'crosshair' }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
