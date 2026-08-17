import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Loader2, PlayCircle, Trash2, StickyNote } from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

/**
 * Lists the current user's bookmarked questions with their personal notes.
 */
export default function BookmarksPanel({ onStartPractice }) {
  const { authFetch } = useAuth();
  const [items, setItems] = useState(null);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/bookmarks`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data);

      // Load notes for bookmarked questions (best-effort)
      const noteMap = {};
      await Promise.all(
        data.map(async (q) => {
          try {
            const r = await authFetch(`${API_BASE}/api/bookmarks/notes/${q.id}`);
            if (r.ok) noteMap[q.id] = (await r.json()).note_text;
          } catch { /* no note */ }
        })
      );
      setNotes(noteMap);
    } catch (err) {
      setError('โหลดบุ๊กมาร์กไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const removeBookmark = async (q) => {
    setItems(prev => prev.filter(x => x.id !== q.id));
    try {
      await authFetch(`${API_BASE}/api/bookmarks/${q.id}`, { method: 'DELETE' });
    } catch {
      load(); // reload on failure
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Loader2 size={24} className="spin" />
      </div>
    );
  }

  if (error) {
    return <div className="glass-panel" style={{ padding: '2rem', color: '#fb7185' }}>{error}</div>;
  }

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <BookmarkCheck size={19} /> ข้อที่บุ๊กมาร์กไว้ ({items.length})
        </h3>
        {items.length > 0 && (
          <button className="btn btn-primary btn-sm" onClick={() => onStartPractice(items)}>
            <PlayCircle size={15} /> ฝึกทำชุดบุ๊กมาร์ก ({items.length} ข้อ)
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem 1rem', fontSize: '0.92rem' }}>
          🔖 ยังไม่มีข้อที่บุ๊กมาร์ก — กดไอคอนรูปบุ๊กมาร์กระหว่างทำข้อสอบเพื่อเก็บข้อที่ต้องการกลับมาทบทวน
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(q => (
          <div key={q.id} style={{ padding: '1rem 1.15rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">Q{q.id}</span>
                <span className="badge">{q.category}</span>
                {q.source_exam && <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>📝 {q.source_exam}</span>}
              </div>
              <button
                onClick={() => removeBookmark(q)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                title="ลบบุ๊กมาร์ก"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div style={{ lineHeight: 1.65, fontSize: '0.95rem', color: 'var(--text-sub)' }}>
              {q.question_text.length > 260 ? q.question_text.slice(0, 260) + '…' : q.question_text}
            </div>
            {notes[q.id] && (
              <div style={{ marginTop: '0.6rem', padding: '0.6rem 0.8rem', background: 'rgba(245,158,11,0.08)', borderLeft: '3px solid rgba(245,158,11,0.5)', borderRadius: '6px', fontSize: '0.87rem', color: 'var(--text-sub)', display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                <StickyNote size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }} />
                <span style={{ whiteSpace: 'pre-wrap' }}>{notes[q.id]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}