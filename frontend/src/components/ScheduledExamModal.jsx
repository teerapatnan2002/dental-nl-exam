import React from 'react';
import { Clock, Calendar, BookOpen, PlayCircle, X, Sparkles } from 'lucide-react';

export default function ScheduledExamModal({ data, onClose, onStartExam }) {
  if (!data) return null;

  const { examTitle, dateText, timeText, timeLeft, pendingConfig } = data;

  const handleStartPractice = () => {
    onClose();
    if (onStartExam && pendingConfig) {
      onStartExam({
        ...pendingConfig,
        category: 'กฎหมายและจรรยาบรรณ',
        year: '2570',
        count: 30,
        mode: 'practice',
        ordered: true,
        part: 'law'
      });
    }
  };

  const handleBypassAndStart = () => {
    onClose();
    if (onStartExam && pendingConfig) {
      onStartExam({
        ...pendingConfig,
        category: 'กฎหมายและจรรยาบรรณ',
        year: '2570',
        count: 30,
        mode: 'exam',
        ordered: true,
        part: 'law',
        bypassSchedule: true
      });
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 18, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.25rem'
    }}>
      <div className="glass-panel animate-scale-up" style={{
        maxWidth: '540px',
        width: '100%',
        borderRadius: '24px',
        border: '1px solid rgba(236, 72, 153, 0.4)',
        background: 'linear-gradient(145deg, rgba(22, 15, 38, 0.98) 0%, rgba(35, 15, 45, 0.95) 100%)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(236, 72, 153, 0.2)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
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

        {/* Header Badge & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.15)',
            border: '2px solid rgba(236, 72, 153, 0.4)',
            color: '#ec4899',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)'
          }}>
            <Clock size={30} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: '#ffffff' }}>
            ยังไม่ถึงเวลาเปิดสอบรอบนี้
          </h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', margin: 0 }}>
            ห้องสอบรอบจำลองเสมือนจริงจะเปิดให้เข้าสอบตามกำหนดการจริง
          </p>
        </div>

        {/* Schedule Info Box */}
        <div style={{
          background: 'rgba(10, 12, 26, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} /> กำหนดการเปิดสอบ:
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            {examTitle || 'ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.88rem', color: 'var(--text-sub)' }}>
            <div>🗓️ <strong>วันสอบ:</strong> {dateText}</div>
            <div>⏰ <strong>เวลาสอบจริง:</strong> <span style={{ color: '#f472b6', fontWeight: 700 }}>{timeText}</span></div>
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
              gap: '0.4rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                นับถอยหลังสู่เวลาเปิดสอบ:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.35rem 0.55rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(timeLeft.days).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>วัน</div>
                </div>
                <span style={{ fontWeight: 700, color: '#ec4899' }}>:</span>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.35rem 0.55rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>ชม.</div>
                </div>
                <span style={{ fontWeight: 700, color: '#ec4899' }}>:</span>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.35rem 0.55rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>นาที</div>
                </div>
                <span style={{ fontWeight: 700, color: '#ec4899' }}>:</span>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.35rem 0.55rem', borderRadius: '8px', textAlign: 'center', minWidth: '44px' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f472b6', fontFamily: 'monospace' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>วินาที</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion notice */}
        <div style={{
          fontSize: '0.84rem',
          color: 'var(--text-sub)',
          lineHeight: 1.5,
          background: 'rgba(124, 58, 237, 0.1)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem'
        }}>
          <Sparkles size={16} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>คำแนะนำ:</strong> แม้ห้องสอบจับเวลาจริงจะเปิดตามกำหนดการ แต่ท่านสามารถเข้า <strong>"โหมดฝึกซ้อม (Practice Mode)"</strong> เพื่อฝึกทำข้อสอบทั้ง 30 ข้อ พร้อมดูเฉลยละเอียดและวิเคราะห์กับดักข้อสอบล่วงหน้าได้ทันที!
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Practice Mode Button */}
          <button
            onClick={handleStartPractice}
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
            <BookOpen size={18} /> เข้าฝึกซ้อมล่วงหน้า (โหมดฝึกซ้อม เฉลยทีละข้อ)
          </button>

          {/* Test / Bypass Exam Mode */}
          <button
            onClick={handleBypassAndStart}
            className="btn btn-secondary"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--text-sub)'
            }}
          >
            <PlayCircle size={15} /> ทดลองสอบล่วงหน้าทันที (ทดสอบระบบจับเวลา 60 นาที)
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              padding: '0.4rem',
              textAlign: 'center'
            }}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
