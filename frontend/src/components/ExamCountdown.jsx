import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, ArrowRight, PlayCircle, BookOpen, CheckCircle2, History, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getOrderedExamSchedules,
  calculateTimeRemaining,
  formatElapsedSinceExam,
} from '../data/examSchedule';

export default function ExamCountdown({ onStartExam, onOpenLawHub, onOpenScheduleModal, embedded = false }) {
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
  const [showPassedRounds, setShowPassedRounds] = useState(() => upcomingExams.length === 0);

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
      className={embedded ? 'exam-countdown-embedded animate-fade-in' : 'exam-countdown-card glass-panel animate-fade-in'}
      aria-label="ปฏิทินและตัวนับถอยหลังสู่กำหนดการสอบ"
      style={embedded ? { width: '100%' } : {
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius)',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className={embedded ? 'showcase-split-grid' : undefined} style={embedded ? undefined : {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: '1.25rem',
        alignItems: 'center',
      }}>
        {/* Left: Schedule Context, Chronological Round Pills & Primary Actions */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {/* Eyebrow + Round Switcher */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.24rem 0.62rem',
              borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.22)',
              color: 'var(--primary-light)',
              fontSize: '0.73rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              marginBottom: '0.7rem',
            }}>
              <Clock size={13} />
              <span>กำหนดการสอบ ศ.ป.ท.</span>
            </div>

            <div
              role="tablist"
              aria-label="เลือกรอบสอบเพื่อดูนับถอยหลัง"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
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
                        gap: '0.36rem',
                        padding: '0.32rem 0.64rem',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(37, 99, 235, 0.14)' : 'var(--surface-subtle)',
                        color: isSelected ? 'var(--primary-light)' : 'var(--text-sub)',
                        fontSize: '0.76rem',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.14s ease',
                        fontFamily: 'inherit',
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

                {passedExams.length > 0 && upcomingExams.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassedRounds(v => !v)}
                    aria-expanded={showPassedRounds}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.28rem',
                      padding: '0.32rem 0.58rem',
                      borderRadius: '8px',
                      border: `1px solid ${currentExam.timing.isPassed ? 'var(--border-hover)' : 'var(--border)'}`,
                      background: currentExam.timing.isPassed ? 'var(--surface-subtle)' : 'transparent',
                      color: currentExam.timing.isPassed ? 'var(--ink-amber)' : 'var(--text-muted)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.14s ease',
                    }}
                  >
                    <History size={12} />
                    <span>ผ่านกำหนดแล้ว ({passedExams.length})</span>
                    {showPassedRounds ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                )}
              </div>

              {passedExams.length > 0 && (showPassedRounds || upcomingExams.length === 0) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap', paddingTop: '0.1rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginRight: '0.15rem',
                    whiteSpace: 'nowrap',
                  }}>
                    ผ่านกำหนดการสอบมาแล้ว:
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
                          padding: '0.24rem 0.52rem',
                          borderRadius: '7px',
                          border: isSelected ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--surface-subtle)' : 'transparent',
                          color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                          fontSize: '0.71rem',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
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
          </div>

          {/* Exam Title + Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.42rem', flexWrap: 'wrap' }}>
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
                  background: isUrgent ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                  color: isUrgent ? 'var(--ink-amber)' : 'var(--primary-light)',
                  border: `1px solid ${isUrgent ? 'rgba(245, 158, 11, 0.28)' : 'rgba(37, 99, 235, 0.25)'}`,
                }}>
                  {timeLeft.isInProgress
                    ? 'กำลังดำเนินการสอบ'
                    : isUrgent
                      ? `เหลือ ${timeLeft.days} วันสุดท้าย`
                      : currentExam.badge}
                </span>
              )}
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {currentExam.regStatusText}
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)',
              fontWeight: 800,
              margin: '0 0 0.35rem 0',
              color: 'var(--text)',
              lineHeight: 1.28,
              letterSpacing: '-0.025em',
            }}>
              {currentExam.title}{' '}
              <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                ({currentExam.series})
              </span>
            </h2>

            <p style={{
              fontSize: '0.84rem',
              color: 'var(--text-sub)',
              margin: 0,
              lineHeight: 1.55,
            }}>
              {currentExam.description || `เตรียมพร้อมรอบ ${currentExam.shortLabel || currentExam.series} ครบทั้งภาคทฤษฎีคลินิกและกฎหมายวิชาชีพ`}
            </p>
          </div>

          {/* Single-Row Balanced Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleStartExamQuick('exam')}
              style={{ borderRadius: '9px', fontSize: '0.82rem', minHeight: '40px', padding: '0.5rem 1rem' }}
            >
              <PlayCircle size={15} />
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
              style={{ borderRadius: '9px', fontSize: '0.82rem', minHeight: '40px', padding: '0.5rem 0.95rem' }}
            >
              <BookOpen size={15} />
              <span>โหมดฝึกซ้อม</span>
            </button>

            {currentExam.type === 'law' && onOpenLawHub && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onOpenLawHub}
                style={{ borderRadius: '9px', fontSize: '0.82rem', minHeight: '40px' }}
              >
                สรุปกฎหมาย
              </button>
            )}
          </div>
        </div>

        {/* Right: Calendly-Inspired Floating Preview Widget inside Atmospheric Tray */}
        <div className={embedded ? 'showcase-preview-tray' : undefined}>
          <div className={embedded ? 'showcase-preview-widget' : 'countdown-clock-wrapper'} style={embedded ? undefined : {
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.95rem 0.9rem',
          }}>
            {/* Preview Widget Top Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              paddingBottom: '0.7rem',
              marginBottom: '0.8rem',
              borderBottom: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  aria-hidden="true"
                  className={!timeLeft.isPassed ? 'live-status-dot' : undefined}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: timeLeft.isPassed ? 'var(--ink-amber)' : 'var(--primary-light)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>
                  {currentExam.shortLabel || currentExam.series}
                </span>
                <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                  {currentExam.examDateText}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenScheduleModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.15rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--primary-light)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontFamily: 'inherit',
                }}
              >
                <span>ตารางสอบทั้งหมด</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {timeLeft.isInProgress ? (
              <div style={{ textAlign: 'center', padding: '1rem 0.35rem' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--ink-emerald)' }}>
                  กำลังดำเนินการสอบอยู่
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>
                  ขอให้ผู้เข้าสอบทุกท่านทำข้อสอบอย่างเต็มความสามารถ
                </p>
              </div>
            ) : timeLeft.isPassed ? (
              <div style={{ textAlign: 'center', padding: '0.85rem 0.35rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '0.25rem',
                }}>
                  <CheckCircle2 size={16} color="var(--ink-emerald)" />
                  <span>ผ่านกำหนดการสอบมาแล้ว</span>
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--ink-amber)',
                  marginBottom: '0.3rem',
                }}>
                  {elapsedLabel} ({currentExam.examDateText})
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  สามารถเลือกทำข้อสอบย้อนหลังเพื่อฝึกจับเวลาหรือทบทวนแนวข้อสอบได้
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  fontSize: '0.73rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '0.55rem',
                  textAlign: 'center',
                }}>
                  นับถอยหลังถึงวันสอบจริง
                </div>

                <div
                  className="exam-countdown-grid tabular-nums"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.38rem',
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
                        <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.95rem', paddingBottom: '0.85rem' }}>
                          :
                        </span>
                      )}
                      <div
                        className={`countdown-digit-box ${unit.isSec ? 'countdown-digit-seconds' : ''}`}
                        style={{
                          flex: 1,
                          minWidth: '46px',
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'var(--surface-subtle)',
                          border: `1px solid ${unit.isSec ? 'rgba(37, 99, 235, 0.35)' : 'var(--border)'}`,
                          borderRadius: '10px',
                          padding: '0.55rem 0.25rem',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          key={unit.isSec ? timeLeft.seconds : unit.label}
                          className={`countdown-digit-num ${unit.isSec ? 'countdown-tick-num' : ''}`}
                          style={{
                            fontSize: 'clamp(1.3rem, 2.5vw, 1.65rem)',
                            fontWeight: 700,
                            color: unit.isSec ? 'var(--primary-light)' : 'var(--text)',
                            fontFamily: 'var(--font-mono)',
                            lineHeight: 1.1,
                          }}
                        >
                          {unit.val}
                        </div>
                        <div style={{
                          fontSize: '0.66rem',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                          marginTop: '0.22rem',
                        }}>
                          {unit.label}
                        </div>
                        {unit.isSec && (
                          <div
                            aria-hidden="true"
                            className="countdown-sec-progress"
                            style={{
                              width: `${((60 - timeLeft.seconds) / 60) * 100}%`,
                            }}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Mini Schedule Slots Row echoing Calendly Calendar Times */}
                <div style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '0.45rem',
                }}>
                  <div style={{
                    padding: '0.48rem 0.65rem',
                    borderRadius: '8px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    fontSize: '0.73rem',
                  }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.67rem', marginBottom: '0.1rem' }}>เวลาสอบ</div>
                    <div style={{ color: 'var(--text)', fontWeight: 600 }}>{currentExam.examTimeText}</div>
                  </div>
                  <div style={{
                    padding: '0.48rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.22)',
                    fontSize: '0.73rem',
                  }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.67rem', marginBottom: '0.1rem' }}>รูปแบบสอบ</div>
                    <div style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
                      {currentExam.questionsCount ? `${currentExam.questionsCount} ข้อ` : (currentExam.type === 'law' ? '30 ข้อ (60 นาที)' : 'ภาคทฤษฎี ศ.ป.ท.')}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
