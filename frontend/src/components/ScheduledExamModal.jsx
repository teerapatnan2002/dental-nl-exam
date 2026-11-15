import React from 'react';
import { Lock, Calendar, Clock, Hourglass, BookOpen, X, AlertCircle } from 'lucide-react';

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
      background: 'rgba(9, 9, 11, 0.72)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.25rem'
    }}>
      <div className="glass-panel animate-scale-up" style={{
        maxWidth: '520px',
        width: '100%',
        borderRadius: '20px',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        background: 'var(--bg-panel)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.38)',
        padding: 'clamp(1.25rem, 4vw, 2.25rem) clamp(1rem, 3.5vw, 2rem)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
          style={{
            position: 'absolute',
            top: '1.15rem',
            right: '1.15rem',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
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
        <div style={{ textAlign: 'center', marginBottom: '1.35rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: 'var(--ink-rose)',
            marginBottom: '0.9rem'
          }}>
            <Lock size={28} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            ห้องสอบถูกล็อคตามกำหนดการ
          </h3>
          <p style={{ color: 'var(--ink-rose)', fontSize: '0.9rem', fontWeight: 600, margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            ยังไม่เปิดให้เข้าทำข้อสอบ (รอเปิดพร้อมกันตามกำหนดการ)
          </p>
        </div>

        {/* Schedule Info Box */}
        <div style={{
          background: 'var(--surface-subtle)',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          padding: '1.15rem',
          marginBottom: '1.15rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="var(--ink-rose)" /> กำหนดการเปิดห้องสอบ
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.55rem' }}>
            {examTitle || 'ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.87rem', color: 'var(--text-sub)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Calendar size={14} color="var(--text-muted)" />
              <span><strong>วันสอบ:</strong> {dateText || 'วันเสาร์ที่ 26 กันยายน 2569'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Clock size={14} color="var(--text-muted)" />
              <span><strong>เวลาสอบ:</strong> <span style={{ color: 'var(--ink-rose)', fontWeight: 700 }}>{timeText || '13:00 – 14:00 น. (60 นาที)'}</span></span>
            </div>
          </div>

          {/* Countdown Clock */}
          {timeLeft && !timeLeft.isExpired && (
            <div style={{
              marginTop: '0.95rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Hourglass size={13} /> นับถอยหลังสู่เวลาเปิดห้องสอบ
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', justifyContent: 'center', fontVariantNumeric: 'tabular-nums' }}>
                <div style={{ background: 'var(--bg-panel)', padding: '0.38rem 0.5rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{String(timeLeft.days).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>วัน</div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--ink-rose)' }}>:</span>
                <div style={{ background: 'var(--bg-panel)', padding: '0.38rem 0.5rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>ชม.</div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--ink-rose)' }}>:</span>
                <div style={{ background: 'var(--bg-panel)', padding: '0.38rem 0.5rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>นาที</div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--ink-rose)' }}>:</span>
                <div style={{ background: 'var(--bg-panel)', padding: '0.38rem 0.5rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink-rose)', fontFamily: "'JetBrains Mono', monospace" }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
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
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem'
        }}>
          <AlertCircle size={18} color="var(--ink-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            ข้อสอบชุดนี้ถูกตั้งระบบล็อคไว้เพื่อ <strong>เปิดสอบพร้อมกันในวันเสาร์ที่ 26 กันยายน 2569 เวลา 13:00 – 14:00 น.</strong> ทีเดียว โดยไม่มีการเปิดสอบหรือฝึกทำล่วงหน้า เพื่อให้ทุกท่านได้ประเมินความรู้พร้อมกันภายใต้บรรยากาศเสมือนจริง
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            onClick={handleOpenLaw}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.82rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.94rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <BookOpen size={17} /> ทบทวนสรุปมาตรา & Flashcards กฎหมายระหว่างรอ
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{
              width: '100%',
              padding: '0.72rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            รับทราบ / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
