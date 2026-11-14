import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, ArrowRight, PlayCircle, BookOpen, CheckCircle2, History } from 'lucide-react';
import {
  getOrderedExamSchedules,
  calculateTimeRemaining,
  formatElapsedSinceExam,
} from '../data/examSchedule';

export default function ExamCountdown({ onStartExam, onOpenLawHub, onOpenScheduleModal }) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const orderedSchedules = useMemo(() => getOrderedExamSchedules(nowMs), [nowMs]);

  const [selectedExamId, setSelectedExamId] = useState(() => {
    const initial = getOrderedExamSchedules(Date.now());
    return initial[0]?.id || 'nl-1-2570';
  });

  // Refresh clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentExam = orderedSchedules.find(e => e.id === selectedExamId) || orderedSchedules[0];
  const timeLeft = useMemo(
    () => calculateTimeRemaining(currentExam.targetDate, currentExam.endDate, nowMs),
    [currentExam.targetDate, currentExam.endDate, nowMs]
  );

  const upcomingExams = orderedSchedules.filter(e => !e.timing.isPassed);
  const passedExams = orderedSchedules.filter(e => e.timing.isPassed);

  const pad = (n) => String(n).padStart(2, '0');

  const handleStartExamQuick = (mode = 'exam') => {
    if (!onStartExam || !currentExam) return;

    if (currentExam.quickAction?.source_exam || currentExam.source_exam) {
      onStartExam({
        category: currentExam.quickAction?.category || 'กฎหมายและจรรยาบรรณ',
        count: currentExam.questionsCount || 30,
        mode,
        ordered: true,
        part: 'law',
        year: currentExam.quickAction?.year || '2569',
        source_exam: currentExam.quickAction?.source_exam || currentExam.source_exam,
        targetExamId: currentExam.id,
        targetDate: currentExam.targetDate,
        examTitle: currentExam.title,
        examTimeText: currentExam.examTimeText,
        examDateText: currentExam.examDateText,
      });
      return;
    }

    if (currentExam.id === 'mock-law-2570') {
      onStartExam({
        category: 'กฎหมายและจรรยาบรรณ',
        count: 30,
        mode,
        ordered: true,
        part: 'law',
        year: '2570',
        targetExamId: 'mock-law-2570',
        targetDate: currentExam.targetDate,
        examTitle: currentExam.title,
        examTimeText: currentExam.examTimeText,
        examDateText: currentExam.examDateText,
      });
      return;
    }

    if (currentExam.type === 'law') {
      onStartExam({
        category: 'กฎหมายและจรรยาบรรณ',
        count: 30,
        mode,
        ordered: true,
        part: 'law',
        targetExamId: currentExam.id,
        targetDate: currentExam.targetDate,
        examTitle: currentExam.title,
        examTimeText: currentExam.examTimeText,
        examDateText: currentExam.examDateText,
      });
      return;
    }

    onStartExam({
      category: '',
      count: currentExam.quickAction?.count || 150,
      mode,
      ordered: true,
      part: '',
      targetExamId: currentExam.id,
      targetDate: currentExam.targetDate,
      examTitle: currentExam.title,
      examTimeText: currentExam.examTimeText,
      examDateText: currentExam.examDateText,
    });
  };

  const isUrgent = timeLeft.status === 'upcoming' && timeLeft.days <= 30;
  const elapsedLabel = formatElapsedSinceExam(timeLeft);

  return (
    <section
      className="exam-countdown-card glass-panel animate-fade-in"
      aria-label="ตัวจับเวลาถอยหลังสู่กำหนดการสอบ"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: '18px',
        background: timeLeft.isPassed
          ? 'linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(124, 58, 237, 0.06) 100%)'
          : 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.07) 100%)',
        border: timeLeft.isPassed
          ? '1px solid rgba(148, 163, 184, 0.25)'
          : '1px solid rgba(124, 58, 237, 0.28)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header Strip + Modal Trigger */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.6rem',
        marginBottom: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <Clock size={15} color={timeLeft.isPassed ? 'var(--text-muted)' : 'var(--ink-indigo)'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
            ปฏิทินและนับถอยหลังสู่สนามสอบ
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '999px',
            background: 'var(--surface-subtle)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}>
            เรียงรอบที่ใกล้ที่สุดขึ้นก่อน
          </span>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenScheduleModal}
          style={{
            padding: '0.32rem 0.7rem',
            fontSize: '0.76rem',
            borderRadius: '9px',
          }}
        >
          <Calendar size={13} />
          <span>ดูตารางสอบ ศ.ป.ท.</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Chronological Exam Selector Strip: Upcoming first, Passed wrapped cleanly without clipping */}
      <div
        role="tablist"
        aria-label="เลือกรอบสอบเพื่อดูนับถอยหลัง"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.38rem',
          paddingBottom: '0.6rem',
          marginBottom: '0.85rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {upcomingExams.map(exam => {
          const isSelected = currentExam.id === exam.id;
          return (
            <button
              key={exam.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedExamId(exam.id)}
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.38rem 0.7rem',
                borderRadius: '999px',
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: isSelected ? 'var(--primary)' : 'var(--surface-subtle)',
                color: isSelected ? '#fff' : 'var(--text)',
                fontSize: '0.76rem',
                fontWeight: isSelected ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.16s ease',
              }}
            >
              <span>{exam.icon}</span>
              <span>{exam.shortLabel || exam.series}</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '0.08rem 0.4rem',
                borderRadius: '999px',
                background: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(6, 182, 212, 0.15)',
                color: isSelected ? '#fff' : 'var(--ink-sky)',
                fontWeight: 700,
              }}>
                {exam.timing.isInProgress ? 'กำลังสอบ' : `${exam.timing.days} วัน`}
              </span>
            </button>
          );
        })}

        {upcomingExams.length > 0 && passedExams.length > 0 && (
          <div
            style={{
              flexBasis: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.15rem',
            }}
          >
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}>
              ผ่านกำหนดการสอบแล้ว:
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
        )}

        {passedExams.map(exam => {
          const isSelected = currentExam.id === exam.id;
          return (
            <button
              key={exam.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedExamId(exam.id)}
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.32rem',
                padding: '0.34rem 0.65rem',
                borderRadius: '999px',
                border: isSelected ? '1px solid rgba(148, 163, 184, 0.6)' : '1px solid var(--border)',
                background: isSelected ? 'rgba(100, 116, 139, 0.28)' : 'transparent',
                color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                fontSize: '0.74rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                opacity: isSelected ? 1 : 0.82,
                transition: 'all 0.16s ease',
              }}
            >
              <span>{exam.shortLabel || exam.series}</span>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.05rem 0.35rem',
                borderRadius: '999px',
                background: 'rgba(148, 163, 184, 0.18)',
                color: 'var(--text-muted)',
              }}>
                ผ่านแล้ว
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Split: Info & CTAs Left, Clock / Passed Banner Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
        gap: '1.1rem',
        alignItems: 'center',
      }}>
        {/* Left: Exam Summary & Direct Practice */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            {timeLeft.isPassed ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'rgba(148, 163, 184, 0.16)',
                color: 'var(--text-sub)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
              }}>
                <History size={12} /> ผ่านกำหนดการสอบมาแล้ว • {elapsedLabel}
              </span>
            ) : (
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: isUrgent ? 'rgba(244, 63, 94, 0.16)' : 'rgba(124, 58, 237, 0.16)',
                color: isUrgent ? 'var(--ink-rose)' : 'var(--ink-indigo)',
                border: `1px solid ${isUrgent ? 'rgba(244, 63, 94, 0.35)' : 'rgba(124, 58, 237, 0.3)'}`,
              }}>
                {timeLeft.isInProgress
                  ? '🔴 กำลังอยู่ในช่วงเวลาสอบ'
                  : isUrgent
                    ? `🔥 โค้งสุดท้าย (${timeLeft.days} วัน)`
                    : currentExam.badge}
              </span>
            )}
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              • {currentExam.regStatusText}
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1rem, 2vw, 1.22rem)',
            fontWeight: 700,
            margin: '0 0 0.3rem 0',
            color: 'var(--text)',
            lineHeight: 1.35,
          }}>
            {currentExam.icon} {currentExam.title}{' '}
            <span style={{ color: 'var(--primary-light)' }}>({currentExam.series})</span>
          </h2>

          <div style={{
            fontSize: '0.82rem',
            color: 'var(--text-sub)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}>
            <Calendar size={14} color="var(--ink-sky)" />
            <span>
              <strong>{currentExam.examDateText}</strong> ({currentExam.examTimeText})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleStartExamQuick('exam')}
              style={{ borderRadius: '9px' }}
            >
              <PlayCircle size={14} />
              <span>
                {timeLeft.isPassed
                  ? 'ทำข้อสอบชุดนี้ย้อนหลัง'
                  : (currentExam.quickAction?.label || 'เริ่มจำลองสอบ')}
              </span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleStartExamQuick('practice')}
              style={{ borderRadius: '9px' }}
            >
              <BookOpen size={14} />
              <span>โหมดฝึกซ้อม</span>
            </button>

            {currentExam.type === 'law' && onOpenLawHub && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onOpenLawHub}
                style={{ borderRadius: '9px' }}
              >
                ⚖️ สรุปกฎหมาย
              </button>
            )}
          </div>
        </div>

        {/* Right: Countdown Digits OR Explicit Passed Notice */}
        <div
          className="countdown-clock-wrapper"
          style={{
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {timeLeft.isInProgress ? (
            <div style={{ textAlign: 'center', padding: '0.6rem 0.4rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-emerald)' }}>
                🟢 กำลังดำเนินการสอบอยู่ตอนนี้!
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>
                ขอให้ผู้เข้าสอบทุกท่านทำข้อสอบอย่างมั่นใจและประสบความสำเร็จ
              </p>
            </div>
          ) : timeLeft.isPassed ? (
            <div style={{ textAlign: 'center', padding: '0.45rem 0.4rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--text)',
                marginBottom: '0.25rem',
              }}>
                <CheckCircle2 size={18} color="var(--ink-emerald)" />
                <span>ผ่านกำหนดการสอบมาแล้ว</span>
              </div>
              <div style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--ink-amber)',
                marginBottom: '0.35rem',
              }}>
                {elapsedLabel} ({currentExam.examDateText})
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                ยังสามารถเข้าทำข้อสอบย้อนหลังเพื่อฝึกจับเวลาหรือทบทวนแนวข้อสอบได้ตลอดเวลา
              </p>
            </div>
          ) : (
            <>
              <div
                className="exam-countdown-grid"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  width: '100%',
                }}
              >
                <div className="countdown-digit-box" style={{
                  flex: 1,
                  minWidth: '52px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.35rem',
                  textAlign: 'center',
                }}>
                  <div className="countdown-digit-num" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                    {timeLeft.days}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
                    วัน
                  </div>
                </div>

                <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '1.1rem' }}>:</span>

                <div className="countdown-digit-box" style={{
                  flex: 1,
                  minWidth: '48px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.35rem',
                  textAlign: 'center',
                }}>
                  <div className="countdown-digit-num" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                    {pad(timeLeft.hours)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
                    ชม.
                  </div>
                </div>

                <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '1.1rem' }}>:</span>

                <div className="countdown-digit-box" style={{
                  flex: 1,
                  minWidth: '48px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.35rem',
                  textAlign: 'center',
                }}>
                  <div className="countdown-digit-num" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                    {pad(timeLeft.minutes)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
                    นาที
                  </div>
                </div>

                <span style={{ fontWeight: 700, color: 'var(--ink-rose)', fontSize: '1.1rem' }}>:</span>

                <div className="countdown-digit-box countdown-digit-seconds" style={{
                  flex: 1,
                  minWidth: '48px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.32)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.35rem',
                  textAlign: 'center',
                }}>
                  <div className="countdown-digit-num-sec" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--ink-rose)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                    {pad(timeLeft.seconds)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-rose)', fontWeight: 600, marginTop: '0.15rem' }}>
                    วินาที
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '0.6rem',
                fontSize: '0.73rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
              }}>
                กำหนดสอบ: {currentExam.examDateText} เวลา {currentExam.examTimeText.split(' ')[0]} น.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
