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
      .then(res => res.json())
      .then(d => {
        setData(d);
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
      <div className="glass-panel" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '3rem 1.5rem', background: 'linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(18,18,30,0.8) 100%)', border: '1px solid rgba(234,179,8,0.2)' }}>
        <Trophy size={48} color="#eab308" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#eab308' }}>Live Mock Exam Leaderboard</h2>
        <p style={{ color: 'var(--text-sub)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          ข้อสอบจำลอง 100 ข้อ เหมือนสนามสอบจริง! เข้าร่วมเพื่อวัดระดับเปอร์เซ็นไทล์เทียบกับผู้เข้าสอบทั่วประเทศ
        </p>
        
        {user ? (
          <button 
            className="btn btn-primary btn-lg" 
            onClick={onStartMock}
            style={{ background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', border: 'none', color: '#000', fontWeight: 'bold' }}
          >
            เริ่มทำ Mock Exam (100 ข้อ)
          </button>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>กรุณาเข้าสู่ระบบเพื่อเข้าร่วม Live Mock Exam</p>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--primary-light)" /> ตารางคะแนน
          </h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> ผู้เข้าร่วมทั้งหมด {data?.total_participants || 0} คน
          </div>
        </div>

        {(!data || data.leaderboard.length === 0) ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>ยังไม่มีผู้เข้าร่วมสอบ</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', width: '80px', textAlign: 'center' }}>อันดับ</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>ผู้ใช้งาน</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>คะแนน</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>เปอร์เซ็นไทล์</th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard.map((row) => (
                  <tr key={row.rank} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      {row.rank === 1 ? <Medal color="#eab308" size={24} /> :
                       row.rank === 2 ? <Medal color="#94a3b8" size={24} /> :
                       row.rank === 3 ? <Medal color="#b45309" size={24} /> :
                       <span style={{ fontWeight: 600, color: 'var(--text-sub)' }}>{row.rank}</span>}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                      {row.display_name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary-light)' }}>
                      {row.score} / {row.total_questions}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <span className="badge" style={{ background: row.percentile >= 80 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)', color: row.percentile >= 80 ? 'var(--success)' : 'var(--text-sub)' }}>
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
