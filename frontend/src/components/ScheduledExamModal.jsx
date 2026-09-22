import React from 'react';
import { Lock, Calendar, BookOpen, X, Sparkles, AlertCircle } from 'lucide-react';

export default function ScheduledExamModal({ data, onClose, onOpenLawHub }) {
  if (!data) return null;

  const { examTitle, dateText, timeText, timeLeft } = data;

  const handleOpenLaw = () => {
    onClose();
    if (onOpenLawHub) {
      onOpenLawHub();
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 18, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.25rem'
    }}>
      <div className="glass-panel animate-scale-up" style={{
        maxWidth: '520px',
        width: '100%',
        borderRadius: '24px',
        border: '1px solid rgba(244, 63, 94, 0.45)',
        background: 'linear-gradient(145deg, rgba(25, 12, 28, 0.98) 0%, rgba(38, 12, 25, 0.95) 100%)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 63, 94, 0.25)',
        padding: '2.25rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.35) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-sub)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Lock Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '2px solid rgba(244, 63, 94, 0.5)',
            color: '#fb7185',
            marginBottom: '1rem',
            boxShadow: '0 0 25px rgba(244, 63, 94, 0.35)'
          }}>
            <Lock size={32} />
          </div>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: '#ffffff', letterSpacing: '-0.01em' }}>
            ห้องสอบถูกล็อคตามกำหนดการ
          </h3>
          <p style={{ color: '#fb7185', fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>
            🔒 ยังไม่เปิดให้เข้าทำข้อสอบ (รอเปิดพร้อมกันวันเสาร์นี้)
          </p>
        </div>

        {/* Schedule Info Box */}
        <div style={{
          background: 'rgba(10, 10, 22, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.25rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="#fb7185" /> กำหนดการเปิดห้องสอบจริง:
          </div>
          <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#fff', marginBottom: '0.45rem' }}>
            {examTitle || 'ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.88rem', color: 'var(--text-sub)' }}>
            <div>🗓️ <strong>วันสอบ:</strong> {dateText || 'วันเสาร์ที่ 26 กันยายน 2569'}</div>
            <div>⏰ <strong>เวลาสอบจริง:</strong> <span style={{ color: '#fb7185', fontWeight: 700 }}>{timeText || '13:00 – 14:00 น. (60 นาที)'}</span></div>
          </div>

          {/* Countdown Clock */}
          {timeLeft && !timeLeft.isExpired && (
            <div style={{
              marginTop: '1rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                ⏳ นับถอยหลังสู่เวลาเปิดห้องสอบ:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.65)', padding: '0.4rem 0.6rem', borderRadius: '8px', textAlign: 'center', minWidth: '46px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(timeLeft.days).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>วัน</div>
                </div>
                <span style={{ fontWeight: 700, color: '#fb7185' }}>:</span>
                <div style={{ background: 'rgba(0,0,0,0.65)', padding: '0.4rem 0.6rem', borderRadius: '8px', textAlign: 'center', minWidth: '46px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>ชม.</div>
                </div>
                <span style={{ fontWeight: 700, color: '#fb7185' }}>:</span>
                <div style={{ background: 'rgba(0,0,0,0.65)', padding: '0.4rem 0.6rem', borderRadius: '8px', textAlign: 'center', minWidth: '46px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>นาที</div>
                </div>
                <span style={{ fontWeight: 700, color: '#fb7185' }}>:</span>
                <div style={{ background: 'rgba(0,0,0,0.65)', padding: '0.4rem 0.6rem', borderRadius: '8px', textAlign: 'center', minWidth: '46px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fb7185', fontFamily: 'monospace' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>วินาที</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Strict Lock Statement */}
        <div style={{
          fontSize: '0.84rem',
          color: 'var(--text-sub)',
          lineHeight: 1.55,
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          padding: '0.9rem 1.1rem',
          borderRadius: '14px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem'
        }}>
          <AlertCircle size={18} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            ข้อสอบชุดนี้ถูกตั้งระบบล็อคไว้เพื่อ <strong>เปิดสอบพร้อมกันในวันเสาร์ที่ 26 กันยายน 2569 เวลา 13:00 – 14:00 น.</strong> ทีเดียว โดยไม่มีการเปิดสอบหรือฝึกทำล่วงหน้า เพื่อให้ทุกท่านได้ประเมินความรู้พร้อมกันภายใต้บรรยากาศเสมือนจริง
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Review Flashcards while waiting */}
          <button
            onClick={handleOpenLaw}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
            }}
          >
            <Sparkles size={17} /> ทบทวนสรุปมาตรา & Flashcards กฎหมายระหว่างรอ
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            รับทราบ / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
