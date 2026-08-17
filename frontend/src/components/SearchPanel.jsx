import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, PlayCircle, XCircle } from 'lucide-react';
import { API_BASE } from '../config';

/**
 * Full-text question search panel (uses /api/search with Thai substring support).
 */
export default function SearchPanel({ categories, onStartPractice }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const doSearch = async (q = query, cat = category) => {
    if (!q || q.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/api/search?q=${encodeURIComponent(q.trim())}&limit=30`;
      if (cat) url += `&category=${encodeURIComponent(cat)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('ค้นหาไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.trim().length >= 2) doSearch();
      else setResults(null);
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  const highlight = (text) => {
    if (!text || !query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.trim().toLowerCase());
    if (idx === -1) return text.length > 220 ? text.slice(0, 220) + '…' : text;
    const start = Math.max(0, idx - 60);
    const end = Math.min(text.length, idx + query.trim().length + 160);
    return (
      <>
        {start > 0 && '…'}
        {text.slice(start, idx)}
        <mark style={{ background: 'rgba(245,158,11,0.35)', color: 'inherit', borderRadius: '3px', padding: '0 2px' }}>
          {text.slice(idx, idx + query.trim().length)}
        </mark>
        {text.slice(idx + query.trim().length, end)}
        {end < text.length && '…'}
      </>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Search size={19} /> ค้นหาข้อสอบ
      </h3>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="พิมพ์คำค้น เช่น ปวดฟัน, ถอนฟัน, เบาหวาน..."
            style={{
              width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem',
              background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px', color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults(null); }}
              style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'var(--text)', fontFamily: 'inherit' }}
        >
          <option value="">ทุกหมวดวิชา</option>
          {(categories || []).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <Loader2 size={22} className="spin" />
        </div>
      )}

      {error && <div style={{ color: '#fb7185', padding: '1rem' }}>{error}</div>}

      {results && !loading && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              พบ {results.length} ข้อ
            </span>
            {results.length > 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onStartPractice(results)}
              >
                <PlayCircle size={15} /> ฝึกทำชุดนี้ ({results.length} ข้อ)
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {results.map(q => (
              <div key={q.id} style={{ padding: '1rem 1.15rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">Q{q.id}</span>
                  <span className="badge">{q.category}</span>
                  {q.source_exam && <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>📝 {q.source_exam}</span>}
                </div>
                <div style={{ lineHeight: 1.65, fontSize: '0.95rem', color: 'var(--text-sub)' }}>
                  {highlight(q.question_text)}
                </div>
              </div>
            ))}
            {results.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                ไม่พบข้อสอบที่ตรงกับ "{query}"
              </div>
            )}
          </div>
        </>
      )}

      {!results && !loading && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem 1rem', fontSize: '0.92rem' }}>
          💡 ค้นหาจากเนื้อคำถาม โจทย์ หรือหมวดวิชา — รองรับภาษาไทย (ค้นจากบางส่วนของคำได้)
        </div>
      )}
    </div>
  );
}