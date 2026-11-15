import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Users, Loader2 } from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function Leaderboard({ onStartMock }) {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/tracking/leaderboard`)
      .then(res => (res.ok ? res.json() : null))
      .then(d => {
        if (d && typeof d === 'object') setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <Loader2 size={32} className="spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{
        marginBottom: '1.5rem',
        textAlign: 'center',
        padding: 'clamp(1.75rem, 4vw, 2.75rem) 1.5rem',
        background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.08) 0%, var(--bg-panel) 100%)',
        border: '1px solid rgba(217, 119, 6, 0.25)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          margin: '0 auto 1rem',
          background: 'rgba(217, 119, 6, 0.12)',
          border: '1px solid rgba(217, 119, 6, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy size={28} color="var(--ink-amber)" />
        </div>
        <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Live Mock Exam Leaderboard</h2>
        <p style={{ color: 'var(--text-sub)', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
          ข้อสอบจำลอง 100 ข้อ เหมือนสนามสอบจริง เข้าร่วมเพื่อวัดระดับเปอร์เซ็นไทล์เทียบกับผู้เข้าสอบทั่วประเทศ
        </p>

        {user ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={onStartMock}
          >
            เริ่มทำ Mock Exam (100 ข้อ)
          </button>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>กรุณาเข้าสู่ระบบเพื่อเข้าร่วม Live Mock Exam</p>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.15rem 1.4rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={19} color="var(--primary-light)" /> ตารางคะแนน
          </h3>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '0.45rem', fontVariantNumeric: 'tabular-nums' }}>
            <Users size={15} /> ผู้เข้าร่วมทั้งหมด {data?.total_participants || 0} คน
          </div>
        </div>

        {(!data || data.leaderboard.length === 0) ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>ยังไม่มีผู้เข้าร่วมสอบ</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontVariantNumeric: 'tabular-nums' }}>
              <thead>
                <tr style={{ background: 'var(--surface-subtle)' }}>
                  <th style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.86rem', width: '80px', textAlign: 'center' }}>อันดับ</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.86rem' }}>ผู้ใช้งาน</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.86rem', textAlign: 'right' }}>คะแนน</th>
                  <th style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.86rem', textAlign: 'right' }}>เปอร์เซ็นไทล์</th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard.map((row) => (
                  <tr key={row.rank} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                      {row.rank === 1 ? <Medal color="var(--ink-amber)" size={22} /> :
                       row.rank === 2 ? <Medal color="var(--text-sub)" size={22} /> :
                       row.rank === 3 ? <Medal color="#b45309" size={22} /> :
                       <span style={{ fontWeight: 600, color: 'var(--text-sub)' }}>{row.rank}</span>}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                      {row.display_name}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary-light)' }}>
                      {row.score} / {row.total_questions}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <span className="badge" style={{
                        background: row.percentile >= 80 ? 'rgba(16,185,129,0.14)' : 'var(--surface-subtle)',
                        color: row.percentile >= 80 ? 'var(--ink-emerald)' : 'var(--text-sub)',
                        border: `1px solid ${row.percentile >= 80 ? 'rgba(16,185,129,0.32)' : 'var(--border)'}`
                      }}>
                        PR {row.percentile}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
