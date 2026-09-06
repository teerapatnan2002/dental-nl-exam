import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, Clock, MapPin, CheckCircle, AlertCircle, FileText, ArrowRight, BookOpen, PlayCircle, ShieldCheck } from 'lucide-react';
import { EXAM_SCHEDULES } from '../data/examSchedule';

export default function ExamScheduleModal({ isOpen, onClose, onStartExam, onOpenLawHub }) {
  const [activeExamId, setActiveExamId] = useState('law-3-2569');

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

  const currentExam = EXAM_SCHEDULES.find(e => e.id === activeExamId) || EXAM_SCHEDULES[0];

  return ReactDOM.createPortal(
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 5, 16, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
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
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          background: 'var(--bg-panel)'
        }}
      >
        {/* ── Modal Header ─────────────────────────────────── */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem'
            }}>
              📅
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                กำหนดการสอบทันตแพทยสภา (ศ.ป.ท.)
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                ประกาศทางการ ประจำปี พ.ศ. 2569 – 2570 ศูนย์ประเมินและรับรองความรู้ความสามารถฯ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Tabs for 4 Exam Rounds ────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.75rem',
          background: 'rgba(0, 0, 0, 0.15)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto'
        }}>
          {EXAM_SCHEDULES.map(exam => {
            const isActive = exam.id === activeExamId;
            return (
              <button
                key={exam.id}
                onClick={() => setActiveExamId(exam.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                  background: isActive ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(6, 182, 212, 0.15))' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#fff' : 'var(--text-sub)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{exam.icon}</span>
                <span>{exam.series}</span>
                {exam.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '6px',
                    background: exam.id === 'law-3-2569' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                    color: exam.id === 'law-3-2569' ? '#f43f5e' : 'var(--primary-light)',
                    fontWeight: 600
                  }}>
                    {exam.id === 'law-3-2569' ? 'รอบด่วน' : 'NL'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Modal Body Content (Scrollable) ────────────────── */}
        <div style={{
          padding: '1.5rem 1.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Main Exam Title Banner */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.08))',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{currentExam.icon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  {currentExam.series}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '12px',
                  background: currentExam.regStatus === 'closed' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: currentExam.regStatus === 'closed' ? '#f43f5e' : '#10b981',
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
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                    if (currentExam.type === 'law') {
                      onStartExam({ category: 'กฎหมายและจรรยาบรรณ', task: '', count: 30, mode: 'exam' });
                    } else {
                      onStartExam({ category: '', task: '', count: 150, mode: 'exam', part: 'day1', ordered: true });
                    }
                  }}
                  style={{ borderRadius: '8px' }}
                >
                  <PlayCircle size={14} /> {currentExam.quickAction.label}
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
                    background: 'rgba(255, 255, 255, 0.03)',
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
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', background: 'rgba(6, 182, 212, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
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
                    background: 'rgba(255, 255, 255, 0.02)',
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
                <MapPin size={15} color="#f43f5e" /> สนามสอบและจำนวนที่นั่งสอบที่เปิดรับ (13 สถาบัน)
              </h4>
              <div style={{
                maxHeight: '190px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.1)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0.75rem', width: '50px' }}>ลำดับ</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>สนามสอบ</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', width: '90px' }}>จำนวนที่นั่ง</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExam.centers.map((c, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                        <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text)' }}>{c.name}</td>
                        <td style={{ padding: '0.45rem 0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent)' }}>
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
            <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={14} /> ข้อควรปฏิบัติและเอกสารแสดงตนในวันสอบ
            </div>
            ผู้เข้าสอบสัญชาติไทยต้องนำ <strong>บัตรประจำตัวประชาชนที่ยังไม่หมดอายุ</strong> มาแสดงตนก่อนเข้าห้องสอบ หากไม่มีบัตรประชาชนให้ใช้บัตรประจำตัวผู้เข้าสอบหรือหนังสือเดินทางที่ยังไม่หมดอายุแทน ไม่อนุญาตให้ใช้เอกสารหรือบัตรอื่น
          </div>
        </div>

        {/* ── Modal Footer ─────────────────────────────────── */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.15)'
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
