import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle, ArrowRight, BookOpen, PlayCircle, Info, Sparkles, ChevronRight } from 'lucide-react';
import { EXAM_SCHEDULES, calculateTimeRemaining } from '../data/examSchedule';

export default function ExamCountdown({ onStartExam, onOpenLawHub, onOpenScheduleModal }) {
  // Default to the first upcoming exam (Law 3/2569)
  const [selectedExamId, setSelectedExamId] = useState('law-3-2569');
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(EXAM_SCHEDULES[0].targetDate));

  const currentExam = EXAM_SCHEDULES.find(e => e.id === selectedExamId) || EXAM_SCHEDULES[0];

  // Update timer every second
  useEffect(() => {
    setTimeLeft(calculateTimeRemaining(currentExam.targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(currentExam.targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExam.targetDate]);

  // Format 2 digits
  const pad = (n) => String(n).padStart(2, '0');

  const handleStartExamQuick = () => {
    if (!onStartExam) return;
    if (currentExam.type === 'law') {
      onStartExam({
        category: 'กฎหมายและจรรยาบรรณ',
        task: '',
        count: 30,
        mode: 'exam'
      });
    } else {
      onStartExam({
        category: '',
        task: '',
        count: 150,
        mode: 'exam',
        part: 'day1',
        ordered: true
      });
    }
  };

  return (
    <div className="exam-countdown-card glass-panel" style={{
      marginBottom: '1.75rem',
      padding: '1.5rem 1.75rem',
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(124, 58, 237, 0.28)',
      background: 'linear-gradient(135deg, rgba(15, 15, 38, 0.9) 0%, rgba(20, 15, 45, 0.85) 100%)'
    }}>
      {/* Subtle Background Glow Accent */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ── Top Bar: Round Selector Pills & View Schedule Link ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
            เลือกรอบสอบ:
          </span>
          {EXAM_SCHEDULES.map(exam => {
            const isSelected = exam.id === selectedExamId;
            return (
              <button
                key={exam.id}
                type="button"
                onClick={() => setSelectedExamId(exam.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '20px',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#ffffff' : 'var(--text-sub)',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{exam.icon}</span>
                <span>{exam.series}</span>
                {exam.id === 'law-3-2569' && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#f43f5e',
                    boxShadow: '0 0 6px #f43f5e'
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* View Full Schedule Button */}
        <button
          type="button"
          onClick={onOpenScheduleModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--accent)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.25rem 0.4rem',
            borderRadius: '6px'
          }}
        >
          <Calendar size={14} />
          <span>ดูตารางสอบและประกาศทางการ (ศ.ป.ท.)</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Main Section: Exam Info & Countdown Digital Clock ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '1.5rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Column: Exam Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              background: currentExam.id === 'law-3-2569' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(124, 58, 237, 0.15)',
              color: currentExam.id === 'law-3-2569' ? '#f43f5e' : 'var(--primary-light)',
              border: `1px solid ${currentExam.id === 'law-3-2569' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`
            }}>
              {currentExam.id === 'law-3-2569' ? '🔥 โค้งสุดท้ายก่อนวันสอบ' : currentExam.badge}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • {currentExam.regStatusText}
            </span>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.4rem 0', lineHeight: 1.3 }}>
            {currentExam.icon} {currentExam.title} <span style={{ color: 'var(--primary-light)' }}>({currentExam.series})</span>
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
            <Calendar size={15} color="var(--accent)" />
            <span><strong>{currentExam.examDateText}</strong> (เวลา {currentExam.examTimeText})</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, maxWidth: '440px' }}>
            {currentExam.type === 'law' 
              ? `สอบวิชากฎหมายทันตกรรม 30 ข้อ 45 นาที (เฉลี่ย 1.5 นาที/ข้อ) แนะนำให้ฝึกทำข้อสอบจับเวลาจริงและทบทวนบัตรคำช่วยจำ` 
              : `การสอบประเมินความรู้ภาคที่ 1 และ ภาคที่ 2 พร้อมวิชากฎหมาย แนะนำเริ่มเก็บข้อสอบแยกตามสาขาวิชาและจำลองสอบ Day 1`}
          </p>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleStartExamQuick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '8px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem'
              }}
            >
              <PlayCircle size={15} /> {currentExam.quickAction.label}
            </button>

            {currentExam.type === 'law' && onOpenLawHub && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={onOpenLawHub}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem'
                }}
              >
                <BookOpen size={14} /> สรุปกฎหมาย & Flashcards
              </button>
            )}

            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenScheduleModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}
            >
              <Info size={14} /> ข้อมูลสนามสอบ
            </button>
          </div>
        </div>

        {/* Right Column: Digital Flip Clock Countdown */}
        <div className="countdown-clock-wrapper" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          borderRadius: '16px',
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Clock size={14} color="var(--primary-light)" /> เวลานับถอยหลังสู่วันสอบ
          </div>

          {timeLeft.isExpired ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                🎉 ถึงกำหนดวันสอบแล้ว!
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                ขอให้ผู้เข้าสอบทุกท่านประสบความสำเร็จ
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.6rem',
              width: '100%',
              maxWidth: '360px'
            }}>
              {/* Days */}
              <div className="countdown-digit-box" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem 0.4rem',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(30, 25, 60, 0.9) 0%, rgba(15, 12, 35, 0.95) 100%)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
              }}>
                <span className="countdown-digit-num" style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1
                }}>
                  {timeLeft.days}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>
                  วัน
                </span>
              </div>

              {/* Hours */}
              <div className="countdown-digit-box" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem 0.4rem',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(30, 25, 60, 0.9) 0%, rgba(15, 12, 35, 0.95) 100%)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
              }}>
                <span className="countdown-digit-num" style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1
                }}>
                  {pad(timeLeft.hours)}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>
                  ชั่วโมง
                </span>
              </div>

              {/* Minutes */}
              <div className="countdown-digit-box" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem 0.4rem',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(30, 25, 60, 0.9) 0%, rgba(15, 12, 35, 0.95) 100%)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
              }}>
                <span className="countdown-digit-num" style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1
                }}>
                  {pad(timeLeft.minutes)}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>
                  นาที
                </span>
              </div>

              {/* Seconds (Pulsing Accent) */}
              <div className="countdown-digit-box countdown-digit-seconds" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem 0.4rem',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(40, 20, 50, 0.9) 0%, rgba(20, 10, 30, 0.95) 100%)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                boxShadow: '0 8px 20px rgba(244, 63, 94, 0.15)'
              }}>
                <span className="countdown-digit-num-sec" style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#f43f5e',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1
                }}>
                  {pad(timeLeft.seconds)}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'rgba(244, 63, 94, 0.8)', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>
                  วินาที
                </span>
              </div>
            </div>
          )}

          {/* Target timestamp label */}
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
            เป้าหมาย: {currentExam.examDateText} เวลา {currentExam.examTimeText.split(' ')[0]} น.
          </div>
        </div>
      </div>
    </div>
  );
}
