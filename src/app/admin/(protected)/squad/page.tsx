'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SquadMember } from '@/lib/db';

const EMPTY_FORM = {
  name: '',
  initials: '',
  slug: '',
  role: '',
  bio: '',
  quote: '',
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

export default function AdminSquadPage() {
  const [members, setMembers] = useState<SquadMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    const res = await fetch('/api/squad');
    const data = await res.json();
    setMembers(data);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  function handleEdit(member: SquadMember) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      initials: member.initials,
      slug: member.slug,
      role: member.role,
      bio: member.bio,
      quote: member.quote,
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
    setForm((f) => {
      const updated = { ...f, [field]: value };
      // Auto-derive slug from name if slug hasn't been manually changed
      if (field === 'name' && (f.slug === '' || f.slug === f.name.toLowerCase().replace(/\s+/g, '-'))) {
        updated.slug = value.toLowerCase().replace(/\s+/g, '-');
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId !== null) {
        await fetch(`/api/admin/squad/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/admin/squad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
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
            SQUAD
          </h1>
          <p
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {members.length} members
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
            + Add Member
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
            {editingId !== null ? 'EDIT MEMBER' : 'ADD MEMBER'}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Initials</label>
                <input
                  type="text"
                  value={form.initials}
                  onChange={(e) => setField('initials', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Slug (auto-derived from name)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setField('slug', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setField('role', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setField('bio', e.target.value)}
                required
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Quote</label>
              <textarea
                value={form.quote}
                onChange={(e) => setField('quote', e.target.value)}
                required
                rows={2}
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
            gridTemplateColumns: '60px 1fr 160px 1fr 100px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          <div>Init.</div>
          <div>Name</div>
          <div>Slug</div>
          <div>Role</div>
          <div>Actions</div>
        </div>

        {members.length === 0 && (
          <div
            style={{
              padding: '32px 20px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.25)',
              textAlign: 'center',
            }}
          >
            No squad members yet.
          </div>
        )}

        {members.map((member) => (
          <div
            key={member.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 160px 1fr 100px',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.75)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 18,
                color: '#00ffcc',
                letterSpacing: '0.05em',
              }}
            >
              {member.initials}
            </div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
              {member.name}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {member.slug}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {member.role}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleEdit(member)}
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
                onClick={() => handleDelete(member.id)}
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
