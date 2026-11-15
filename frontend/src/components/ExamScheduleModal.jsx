import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, Clock, MapPin, CheckCircle, AlertCircle, FileText, ArrowRight, BookOpen, PlayCircle, ShieldCheck, Scale, Stethoscope, History, ChevronDown, ChevronUp } from 'lucide-react';
import { getOrderedExamSchedules, formatElapsedSinceExam } from '../data/examSchedule';

export default function ExamScheduleModal({ isOpen, onClose, onStartExam, onOpenLawHub }) {
  const orderedSchedules = getOrderedExamSchedules();
  const upcomingExams = orderedSchedules.filter(e => !e.timing.isPassed);
  const passedExams = orderedSchedules.filter(e => e.timing.isPassed);
  const [activeExamId, setActiveExamId] = useState(() => getOrderedExamSchedules()[0]?.id || 'nl-1-2570');
  const [showPassedTabs, setShowPassedTabs] = useState(() => upcomingExams.length === 0);

  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentExam = orderedSchedules.find(e => e.id === activeExamId) || orderedSchedules[0];

  return ReactDOM.createPortal(
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 9, 11, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.65rem, 2.5vw, 1.25rem)',
        overflowY: 'auto'
      }}
    >
      <div
        className="glass-panel animate-scale-up"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '14px',
          border: '1px solid var(--border-hover)',
          boxShadow: 'var(--shadow-elevated)',
          background: 'var(--bg-panel)'
        }}
      >
        {/* ── Modal Header ─────────────────────────────────── */}
        <div style={{
          padding: '1rem clamp(1rem, 3vw, 1.5rem)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'var(--bg-panel)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(13, 148, 136, 0.14)',
              border: '1px solid rgba(13, 148, 136, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light)',
              flexShrink: 0,
            }}>
              <Calendar size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(0.98rem, 2.5vw, 1.1rem)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                กำหนดการสอบทันตแพทยสภา (ศ.ป.ท.)
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.12rem 0 0 0' }}>
                ประกาศทางการ ประจำปี พ.ศ. 2569 – 2570 ศูนย์ประเมินและรับรองความรู้ความสามารถฯ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="header-icon-btn"
            style={{
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              minWidth: '38px',
              minHeight: '38px',
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Chronological Wrapping Tabs (Closest First + Past Expandable) ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '0.7rem clamp(1rem, 3vw, 1.5rem)',
          background: 'var(--surface-subtle)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            {upcomingExams.map(exam => {
              const isActive = exam.id === activeExamId;
              const ExamIcon = exam.type === 'law' ? Scale : Stethoscope;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => setActiveExamId(exam.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.42rem 0.72rem',
                    borderRadius: '8px',
                    border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                    background: isActive ? 'var(--primary)' : 'var(--bg-panel)',
                    color: isActive ? '#fff' : 'var(--text)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.79rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ExamIcon size={13} />
                  <span>{exam.shortLabel || exam.series}</span>
                  <span className="tabular-nums" style={{
                    fontSize: '0.68rem',
                    padding: '0.08rem 0.38rem',
                    borderRadius: '5px',
                    background: isActive ? 'rgba(255, 255, 255, 0.22)' : 'var(--primary-surface)',
                    color: isActive ? '#fff' : 'var(--primary-light)',
                    fontWeight: 600
                  }}>
                    {exam.timing.isInProgress ? 'กำลังสอบ' : `อีก ${exam.timing.days} วัน`}
                  </span>
                </button>
              );
            })}

            {passedExams.length > 0 && upcomingExams.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassedTabs(v => !v)}
                aria-expanded={showPassedTabs}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.42rem 0.68rem',
                  borderRadius: '8px',
                  border: `1px solid ${currentExam.timing.isPassed ? 'var(--border-hover)' : 'var(--border)'}`,
                  background: currentExam.timing.isPassed ? 'var(--bg-panel)' : 'transparent',
                  color: currentExam.timing.isPassed ? 'var(--ink-amber)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.76rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <History size={13} />
                <span>ผ่านกำหนดการแล้ว ({passedExams.length})</span>
                {showPassedTabs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>

          {passedExams.length > 0 && (showPassedTabs || upcomingExams.length === 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', paddingTop: '0.15rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.2rem' }}>
                ผ่านกำหนดการสอบมาแล้ว:
              </span>
              {passedExams.map(exam => {
                const isActive = exam.id === activeExamId;
                const ExamIcon = exam.type === 'law' ? Scale : Stethoscope;
                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => setActiveExamId(exam.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.32rem 0.62rem',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                      background: isActive ? 'var(--primary)' : 'var(--bg-panel)',
                      color: isActive ? '#fff' : 'var(--text-sub)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.75rem',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <ExamIcon size={12} />
                    <span>{exam.shortLabel || exam.series}</span>
                    <span style={{
                      fontSize: '0.66rem',
                      padding: '0.04rem 0.34rem',
                      borderRadius: '4px',
                      background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--surface-subtle)',
                      color: isActive ? '#fff' : 'var(--ink-amber)',
                      fontWeight: 600,
                    }}>
                      ผ่านแล้ว
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal Body Content (Scrollable) ────────────────── */}
        <div style={{
          padding: '1.35rem 1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          {/* Main Exam Title Banner */}
          <div style={{
            padding: '1.15rem 1.35rem',
            borderRadius: '12px',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                {currentExam.type === 'law'
                  ? <Scale size={15} color="var(--primary-light)" />
                  : <Stethoscope size={15} color="var(--primary-light)" />}
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                  {currentExam.series}
                </span>
                {currentExam.timing.isPassed ? (
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px',
                    background: 'var(--bg-panel)',
                    color: 'var(--ink-amber)',
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Clock size={12} /> ผ่านกำหนดการสอบมาแล้ว ({formatElapsedSinceExam(currentExam.timing)})
                  </span>
                ) : (
                  <span className="tabular-nums" style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px',
                    background: 'rgba(13, 148, 136, 0.14)',
                    color: 'var(--primary-light)',
                    fontWeight: 600,
                    border: '1px solid rgba(13, 148, 136, 0.28)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    {currentExam.timing.isInProgress ? (
                      <>
                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)' }} />
                        กำลังสอบอยู่ตอนนี้
                      </>
                    ) : (
                      <>
                        <Clock size={12} /> อีก {currentExam.timing.days} วัน {currentExam.timing.hours} ชม.
                      </>
                    )}
                  </span>
                )}
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '12px',
                  background: currentExam.regStatus === 'closed' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: currentExam.regStatus === 'closed' ? 'var(--ink-rose)' : 'var(--ink-emerald)',
                  fontWeight: 600,
                  border: `1px solid ${currentExam.regStatus === 'closed' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}>
                  {currentExam.regStatusText}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.4rem 0' }}>
                {currentExam.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                {currentExam.description}
              </p>
            </div>

            {/* Quick action button inside banner */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {currentExam.type === 'law' && onOpenLawHub && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    onClose();
                    onOpenLawHub();
                  }}
                  style={{ borderRadius: '8px' }}
                >
                  <BookOpen size={14} /> สรุปกฎหมาย
                </button>
              )}
              {currentExam.quickAction && onStartExam && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onClose();
                    if (currentExam.quickAction?.source_exam) {
                      onStartExam({
                        category: 'กฎหมายและจรรยาบรรณ',
                        task: '',
                        count: currentExam.questionsCount || 30,
                        mode: 'exam',
                        ordered: true,
                        part: 'law',
                        year: currentExam.quickAction.year || '2569',
                        source_exam: currentExam.quickAction.source_exam,
                        targetExamId: currentExam.id,
                        examTitle: currentExam.title
                      });
                    } else if (currentExam.type === 'law') {
                      onStartExam({ category: 'กฎหมายและจรรยาบรรณ', task: '', count: 30, mode: 'exam' });
                    } else {
                      onStartExam({ category: '', task: '', count: 150, mode: 'exam', part: 'day1', ordered: true });
                    }
                  }}
                  style={{ borderRadius: '8px' }}
                >
                  <PlayCircle size={14} /> {currentExam.timing.isPassed ? `ทำข้อสอบย้อนหลัง (${currentExam.questionsCount} ข้อ)` : currentExam.quickAction.label}
                </button>
              )}
            </div>
          </div>

          {/* Key Facts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem'
          }}>
            <div className="glass-panel" style={{ padding: '0.9rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-light)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <Calendar size={14} /> <strong>วันสอบจริง</strong>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                {currentExam.examDateText}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '0.9rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <Clock size={14} /> <strong>เวลาทำการสอบ</strong>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                {currentExam.examTimeText}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '0.9rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <FileText size={14} /> <strong>จำนวนข้อสอบ</strong>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                {currentExam.questionsCount} ข้อ
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '0.9rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <ShieldCheck size={14} /> <strong>ค่าธรรมเนียมสอบ</strong>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                {currentExam.fee}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown: Subjects or Parts */}
          {currentExam.parts && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={15} color="var(--primary-light)" /> โครงสร้างวิชาและกำหนดการสอบ
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentExam.parts.map((p, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>{p.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.date}</div>
                    </div>
                    <span className="tabular-nums" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', background: 'rgba(13, 148, 136, 0.12)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                      {p.count} ข้อ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentExam.subjects && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={15} color="var(--primary-light)" /> ขอบเขตเนื้อหากฎหมายที่ออกสอบ (30 ข้อ)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {currentExam.subjects.map((s, idx) => (
                  <div key={idx} style={{
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{idx + 1}. {s.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.items}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Centers Table (For Law 3/2569) */}
          {currentExam.centers && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} color="var(--danger)" /> สนามสอบและจำนวนที่นั่งสอบที่เปิดรับ (13 สถาบัน)
              </h4>
              <div style={{
                maxHeight: '190px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                background: 'var(--surface-subtle)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0.75rem', width: '50px' }}>ลำดับ</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>สนามสอบ</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', width: '90px' }}>จำนวนที่นั่ง</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExam.centers.map((c, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="tabular-nums" style={{ padding: '0.45rem 0.75rem', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text)' }}>{c.name}</td>
                        <td className="tabular-nums" style={{ padding: '0.45rem 0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary-light)' }}>
                          {c.seats} ที่นั่ง
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes & Regulations */}
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            fontSize: '0.78rem',
            color: 'var(--text-sub)',
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-amber)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={14} /> ข้อควรปฏิบัติและเอกสารแสดงตนในวันสอบ
            </div>
            ผู้เข้าสอบสัญชาติไทยต้องนำ <strong>บัตรประจำตัวประชาชนที่ยังไม่หมดอายุ</strong> มาแสดงตนก่อนเข้าห้องสอบ หากไม่มีบัตรประชาชนให้ใช้บัตรประจำตัวผู้เข้าสอบหรือหนังสือเดินทางที่ยังไม่หมดอายุแทน ไม่อนุญาตให้ใช้เอกสารหรือบัตรอื่น
          </div>
        </div>

        {/* ── Modal Footer ─────────────────────────────────── */}
        <div style={{
          padding: '0.9rem 1.5rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-subtle)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            แหล่งข้อมูล: ศูนย์ประเมินและรับรองความรู้ความสามารถฯ (ศ.ป.ท.) ทันตแพทยสภา
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
