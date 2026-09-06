import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, PlayCircle, BookOpen, Layers, Sparkles } from 'lucide-react';

export default function CategoryDetailModal({
  category,
  tasks = [],
  onClose,
  onStart,
  onOpenLawHub
}) {
  const [selectedCount, setSelectedCount] = useState(20);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!category) return null;

  const totalQuestions = category.count || tasks.reduce((sum, t) => sum + t.count, 0);

  // Icon mapping for tasks
  const getTaskIcon = (taskName) => {
    if (taskName.includes('วินิจฉัย')) return '🩺';
    if (taskName.includes('จัดการ') || taskName.includes('รักษาผู้ป่วย')) return '📋';
    if (taskName.includes('ขั้นตอน') || taskName.includes('วิธีการรักษา')) return '🛠️';
    if (taskName.includes('การเกิด') || taskName.includes('ดำเนินโรค')) return '🔬';
    if (taskName.includes('ป้องกัน') || taskName.includes('สร้างเสริม')) return '🛡️';
    if (taskName.includes('พ.ร.บ. วิชาชีพ')) return '📜';
    if (taskName.includes('จรรยาบรรณ')) return '⚖️';
    if (taskName.includes('พ.ร.บ. สถานพยาบาล')) return '🏥';
    if (taskName.includes('กฎหมายอื่นๆ')) return '📑';
    return '📌';
  };

  // Task color palette for distribution bar
  const taskColors = [
    '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899',
    '#3b82f6', '#14b8a6', '#f43f5e', '#a855f7'
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1.5rem 1rem',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: 'min(88vh, 760px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          position: 'relative',
          margin: 'auto',
          borderRadius: '16px',
          border: `1px solid ${category.borderColor || 'var(--border)'}`,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', paddingRight: '2rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: category.bg || 'rgba(124, 58, 237, 0.12)',
              border: `1px solid ${category.borderColor || 'rgba(124, 58, 237, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}
          >
            {category.icon || '📚'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text)', fontWeight: 700 }}>
                {category.name}
              </h2>
              <span
                className="badge"
                style={{
                  background: category.bg || 'rgba(124, 58, 237, 0.15)',
                  color: category.color || 'var(--primary-light)',
                  border: `1px solid ${category.borderColor || 'rgba(124, 58, 237, 0.3)'}`,
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                {totalQuestions.toLocaleString()} ข้อ
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {category.isLaw
                ? 'ข้อสอบกฎหมาย พระราชบัญญัติ และจรรยาบรรณแห่งวิชาชีพทันตกรรม'
                : 'เลือกฝึกซ้อมตามสมรรถนะวิชาชีพ (Tasks) หรือทำข้อสอบรวมทั้งวิชา'}
            </p>
          </div>
        </div>

        {/* Quick Full-Category Banner */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} color={category.color || 'var(--primary-light)'} />
              ข้อสอบรวมทั้งสาขาวิชา
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              สุ่มรวมทุกสมรรถนะ ({totalQuestions} ข้อ)
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onStart(category.name, '', Math.min(totalQuestions, selectedCount), 'exam');
                onClose();
              }}
            >
              <PlayCircle size={14} /> สอบ {Math.min(totalQuestions, selectedCount)} ข้อ
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ background: category.bg, color: category.color, border: `1px solid ${category.borderColor}` }}
              onClick={() => {
                onStart(category.name, '', Math.min(totalQuestions, selectedCount), 'practice');
                onClose();
              }}
            >
              <BookOpen size={14} /> ฝึก {Math.min(totalQuestions, selectedCount)} ข้อ
            </button>
            {category.isLaw && onOpenLawHub && (
              <button
                className="btn btn-sm"
                onClick={() => {
                  onClose();
                  onOpenLawHub();
                }}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  color: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600
                }}
              >
                🎴 Flashcards
              </button>
            )}
          </div>
        </div>

        {/* Task Distribution Bar */}
        {tasks.length > 0 && totalQuestions > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={13} /> สัดส่วนเนื้อหาในสาขาวิชานี้
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {tasks.length} หัวข้อย่อย
              </span>
            </div>
            <div
              style={{
                height: '8px',
                borderRadius: '999px',
                display: 'flex',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.06)'
              }}
            >
              {tasks.map((t, idx) => {
                const pct = Math.round((t.count / totalQuestions) * 100);
                if (pct <= 0) return null;
                const col = taskColors[idx % taskColors.length];
                return (
                  <div
                    key={t.task}
                    title={`${t.task}: ${t.count} ข้อ (${pct}%)`}
                    style={{
                      width: `${pct}%`,
                      background: col,
                      transition: 'width 0.3s ease'
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Header with Question Count Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
            {category.isLaw ? '⚖️ เลือกฝึกซ้อมตามหมวดกฎหมาย:' : '🎯 เลือกฝึกซ้อมตามสมรรถนะ / หัวข้อเล็ก:'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>จำนวนข้อ:</span>
            {[10, 20, 30].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => setSelectedCount(cnt)}
                style={{
                  background: selectedCount === cnt ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCount === cnt ? '#fff' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: '0.25rem' }}>
          {tasks.map((t, idx) => {
            const pct = totalQuestions > 0 ? Math.round((t.count / totalQuestions) * 100) : 0;
            const taskColor = taskColors[idx % taskColors.length];
            const qCount = Math.min(t.count, selectedCount);

            return (
              <div
                key={t.task}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.6rem',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                }}
              >
                {/* Task Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '220px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{getTaskIcon(t.task)}</span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                      {t.task}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ color: taskColor, fontWeight: 600 }}>{t.count} ข้อ</span>
                      <span>•</span>
                      <span>{pct}% ของวิชานี้</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      onStart(category.name, t.task, qCount, 'exam');
                      onClose();
                    }}
                    title={`สอบหัวข้อ ${t.task} (${qCount} ข้อ)`}
                  >
                    <PlayCircle size={13} /> สอบ {qCount} ข้อ
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      background: category.bg,
                      color: category.color,
                      border: `1px solid ${category.borderColor}`
                    }}
                    onClick={() => {
                      onStart(category.name, t.task, qCount, 'practice');
                      onClose();
                    }}
                    title={`ฝึกซ้อมหัวข้อ ${t.task} (${qCount} ข้อ)`}
                  >
                    <BookOpen size={13} /> ฝึก {qCount} ข้อ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
