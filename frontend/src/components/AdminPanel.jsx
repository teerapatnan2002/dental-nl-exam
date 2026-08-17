import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

const STATUS_STYLES = {
  pending:   { label: 'รอตรวจสอบ', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  reviewing: { label: 'กำลังตรวจสอบ', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  resolved:  { label: 'แก้ไขแล้ว', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  rejected:  { label: 'ไม่รับเรื่อง', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
};

function formatDate(ts) {
  try {
    return new Date(ts * 1000).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return String(ts);
  }
}

/**
 * Admin panel for reviewing user-reported question issues.
 * Rendered only for users with role === 'admin'.
 */
export default function AdminPanel() {
  const { authFetch } = useAuth();
  const [reports, setReports] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/api/reports?limit=200`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      const res = await authFetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReports(await res.json());
    } catch {
      setError('โหลดรายการแจ้งปัญหาไม่สำเร็จ (คุณอาจไม่มีสิทธิ์ admin)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [statusFilter]);

  const setStatus = async (reportId, status) => {
    setUpdatingId(reportId);
    try {
      const res = await authFetch(`${API_BASE}/api/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Remove from current filtered list if it no longer matches
      setReports(prev => prev.filter(r => r.id !== reportId || r.status === status));
    } catch {
      alert('อัปเดตสถานะไม่สำเร็จ');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <ShieldCheck size={19} /> Admin — รายการแจ้งปัญหาข้อสอบ
        </h3>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['pending', 'reviewing', 'resolved', 'rejected', ''].map(s => (
            <button
              key={s || 'all'}
              className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(s)}
              style={{ borderRadius: '20px' }}
            >
              {s === '' ? 'ทั้งหมด' : STATUS_STYLES[s].label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="spin" />
        </div>
      )}

      {error && <div style={{ color: '#fb7185', padding: '1rem' }}>{error}</div>}

      {reports && !loading && (
        <>
          {reports.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem 1rem' }}>
              ✅ ไม่มีรายการ{statusFilter ? `สถานะ "${STATUS_STYLES[statusFilter].label}"` : ''} — เยี่ยมมาก!
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {reports.map(r => {
              const st = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
              return (
                <div key={r.id} style={{ padding: '1.1rem 1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="badge badge-primary">Report #{r.id}</span>
                      <span className="badge">Q{r.question_id}</span>
                      {r.category && <span className="badge">{r.category}</span>}
                      {r.source_exam && <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>📝 {r.source_exam}</span>}
                      <span className="badge" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40` }}>
                        {st.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      โดย {r.reporter_username || 'ไม่ทราบ'} · {formatDate(r.created_at)}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--danger)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertTriangle size={14} /> <strong>{r.issue_type}</strong>
                  </div>

                  {r.description && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '0.6rem', padding: '0.55rem 0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      {r.description}
                    </div>
                  )}

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.55 }}>
                    <Eye size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                    {r.question_text.length > 200 ? r.question_text.slice(0, 200) + '…' : r.question_text}
                    {r.correct_answer && <span style={{ marginLeft: '0.6rem', color: 'var(--success)' }}>(เฉลยปัจจุบัน: {r.correct_answer})</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {r.status !== 'reviewing' && (
                      <button className="btn btn-secondary btn-sm" disabled={updatingId === r.id} onClick={() => setStatus(r.id, 'reviewing')}>
                        <Eye size={13} /> กำลังตรวจสอบ
                      </button>
                    )}
                    {r.status !== 'resolved' && (
                      <button className="btn btn-success btn-sm" disabled={updatingId === r.id} onClick={() => setStatus(r.id, 'resolved')}>
                        <CheckCircle2 size={13} /> แก้ไขแล้ว
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button className="btn btn-danger btn-sm" disabled={updatingId === r.id} onClick={() => setStatus(r.id, 'rejected')}>
                        <XCircle size={13} /> ไม่รับเรื่อง
                      </button>
                    )}
                    {updatingId === r.id && <Loader2 size={16} className="spin" style={{ alignSelf: 'center' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}