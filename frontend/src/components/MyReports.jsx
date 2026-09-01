import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, CircleCheck, XCircle, Eye } from 'lucide-react';
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

export default function MyReports() {
  const { authFetch } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch(`${API_BASE}/api/reports/my`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setReports(await res.json());
      } catch (err) {
        setError('โหลดประวัติการแจ้งปัญหาไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authFetch]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 className="spin" size={32} color="var(--primary-light)" /></div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'var(--danger)', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={20} color="var(--primary-light)" /> ประวัติการแจ้งปัญหาของฉัน
      </h2>

      {!reports || reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
          คุณยังไม่เคยแจ้งปัญหาข้อสอบเลย
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.map(r => {
            const st = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
            return (
              <div key={r.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge badge-primary">Q{r.question_id}</span>
                    <span className="badge" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40` }}>
                      {st.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(r.created_at)}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--danger)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={14} /> <strong>{r.issue_type}</strong>
                </div>

                {r.description && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '0.8rem', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    {r.description}
                  </div>
                )}

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  <Eye size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                  {r.question_text.length > 150 ? r.question_text.slice(0, 150) + '…' : r.question_text}
                </div>

                {r.admin_reply && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)', padding: '0.8rem', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                    <strong style={{ color: 'var(--success)' }}>ตอบกลับจาก Admin:</strong> <br/> {r.admin_reply}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
