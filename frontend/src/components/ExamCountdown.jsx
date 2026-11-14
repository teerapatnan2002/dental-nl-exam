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

  const isUrgent = timeLeft.status === 'upcoming' && timeLeft.days <= 14;
  const elapsedLabel = formatElapsedSinceExam(timeLeft);

  return (
    <section
      className="exam-countdown-card glass-panel animate-fade-in"
      aria-label="ปฏิทินและตัวนับถอยหลังสู่กำหนดการสอบ"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius)',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            กำหนดการสอบ ศ.ป.ท.
          </span>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-xs"
          onClick={onOpenScheduleModal}
          style={{
            padding: '0.32rem 0.65rem',
            fontSize: '0.75rem',
            borderRadius: '7px',
          }}
        >
          <Calendar size={12} />
          <span>ดูตารางสอบทั้งหมด</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Chronological Exam Selector */}
      <div
        role="tablist"
        aria-label="เลือกรอบสอบเพื่อดูนับถอยหลัง"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          paddingBottom: '0.7rem',
          marginBottom: '0.85rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {upcomingExams.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.32rem 0.62rem',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: isSelected ? 'rgba(13, 148, 136, 0.14)' : 'var(--surface-subtle)',
                    color: isSelected ? 'var(--primary-light)' : 'var(--text-sub)',
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.14s ease',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: exam.timing.isInProgress
                        ? 'var(--success)'
                        : (isSelected ? 'var(--primary-light)' : 'var(--text-muted)'),
                    }}
                  />
                  <span>{exam.shortLabel || exam.series}</span>
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {exam.timing.isInProgress ? 'กำลังสอบ' : `${exam.timing.days}d`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {passedExams.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginRight: '0.15rem',
              whiteSpace: 'nowrap',
            }}>
              ผ่านแล้ว:
            </span>
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.22rem 0.5rem',
                    borderRadius: '7px',
                    border: isSelected ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                    background: isSelected ? 'var(--surface-subtle)' : 'transparent',
                    color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                    fontSize: '0.71rem',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.14s ease',
                  }}
                >
                  <span>{exam.shortLabel || exam.series}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: '1rem',
        alignItems: 'center',
      }}>
        {/* Left: Info & Actions */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            {timeLeft.isPassed ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.18rem 0.52rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: 'var(--surface-subtle)',
                color: 'var(--ink-amber)',
                border: '1px solid var(--border)',
              }}>
                <History size={12} /> ผ่านกำหนดการสอบมาแล้ว ({elapsedLabel})
              </span>
            ) : (
              <span style={{
                padding: '0.18rem 0.52rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: isUrgent ? 'rgba(245, 158, 11, 0.14)' : 'rgba(13, 148, 136, 0.12)',
                color: isUrgent ? 'var(--ink-amber)' : 'var(--primary-light)',
                border: `1px solid ${isUrgent ? 'rgba(245, 158, 11, 0.28)' : 'rgba(13, 148, 136, 0.25)'}`,
              }}>
                {timeLeft.isInProgress
                  ? 'กำลังดำเนินการสอบ'
                  : isUrgent
                    ? `เหลือ ${timeLeft.days} วันสุดท้าย`
                    : currentExam.badge}
              </span>
            )}
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {currentExam.regStatusText}
            </span>
          </div>

          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            margin: '0 0 0.28rem 0',
            color: 'var(--text)',
            lineHeight: 1.38,
            letterSpacing: '-0.015em',
          }}>
            {currentExam.title}{' '}
            <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              ({currentExam.series})
            </span>
          </h2>

          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-sub)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '0.85rem',
            flexWrap: 'wrap',
          }}>
            <Calendar size={13} color="var(--text-muted)" />
            <span>
              {currentExam.examDateText} · {currentExam.examTimeText}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleStartExamQuick('exam')}
              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
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
              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
            >
              <BookOpen size={14} />
              <span>โหมดฝึกซ้อม</span>
            </button>

            {currentExam.type === 'law' && onOpenLawHub && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onOpenLawHub}
                style={{ borderRadius: '8px', fontSize: '0.8rem' }}
              >
                สรุปกฎหมาย
              </button>
            )}
          </div>
        </div>

        {/* Right: Minimal Instrument Clock OR Passed Notice */}
        <div
          className="countdown-clock-wrapper"
          style={{
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.9rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {timeLeft.isInProgress ? (
            <div style={{ textAlign: 'center', padding: '0.5rem 0.25rem' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink-emerald)' }}>
                กำลังดำเนินการสอบอยู่
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                ขอให้ผู้เข้าสอบทุกท่านทำข้อสอบอย่างเต็มความสามารถ
              </p>
            </div>
          ) : timeLeft.isPassed ? (
            <div style={{ textAlign: 'center', padding: '0.4rem 0.25rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.98rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.2rem',
              }}>
                <CheckCircle2 size={16} color="var(--ink-emerald)" />
                <span>ผ่านกำหนดการสอบมาแล้ว</span>
              </div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--ink-amber)',
                marginBottom: '0.28rem',
              }}>
                {elapsedLabel} ({currentExam.examDateText})
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                สามารถเลือกทำข้อสอบย้อนหลังเพื่อฝึกจับเวลาหรือทบทวนแนวข้อสอบได้
              </p>
            </div>
          ) : (
            <>
              <div
                className="exam-countdown-grid tabular-nums"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  width: '100%',
                }}
              >
                {[
                  { val: timeLeft.days, label: 'วัน', isSec: false },
                  { val: pad(timeLeft.hours), label: 'ชม.', isSec: false },
                  { val: pad(timeLeft.minutes), label: 'นาที', isSec: false },
                  { val: pad(timeLeft.seconds), label: 'วินาที', isSec: true },
                ].map((unit, idx) => (
                  <React.Fragment key={unit.label}>
                    {idx > 0 && (
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.95rem', paddingBottom: '0.8rem' }}>
                        :
                      </span>
                    )}
                    <div
                      className={`countdown-digit-box ${unit.isSec ? 'countdown-digit-seconds' : ''}`}
                      style={{
                        flex: 1,
                        minWidth: '46px',
                        background: 'var(--bg-panel)',
                        border: `1px solid ${unit.isSec ? 'rgba(13, 148, 136, 0.3)' : 'var(--border)'}`,
                        borderRadius: '8px',
                        padding: '0.45rem 0.25rem',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        className="countdown-digit-num"
                        style={{
                          fontSize: '1.45rem',
                          fontWeight: 700,
                          color: unit.isSec ? 'var(--primary-light)' : 'var(--text)',
                          fontFamily: 'var(--font-mono)',
                          lineHeight: 1.1,
                        }}
                      >
                        {unit.val}
                      </div>
                      <div style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        marginTop: '0.18rem',
                      }}>
                        {unit.label}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div style={{
                marginTop: '0.55rem',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
              }}>
                กำหนดสอบ: {currentExam.examDateText}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
