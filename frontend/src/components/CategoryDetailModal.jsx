import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X, PlayCircle, BookOpen, Layers, Sparkles, Stethoscope, ClipboardList,
  Wrench, Microscope, ShieldCheck, ScrollText, Scale, Building2, FileText,
  Target, CircleDot
} from 'lucide-react';

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
  const fullCategoryCount = selectedCount === 'all' ? totalQuestions : Math.min(totalQuestions, selectedCount);

  // Clean clinical Lucide icon mapping for competency tasks
  const getTaskIcon = (taskName) => {
    const props = { size: 16, color: 'var(--primary-light)' };
    if (taskName.includes('วินิจฉัย')) return <Stethoscope {...props} />;
    if (taskName.includes('จัดการ') || taskName.includes('รักษาผู้ป่วย')) return <ClipboardList {...props} />;
    if (taskName.includes('ขั้นตอน') || taskName.includes('วิธีการรักษา')) return <Wrench {...props} />;
    if (taskName.includes('การเกิด') || taskName.includes('ดำเนินโรค')) return <Microscope {...props} />;
    if (taskName.includes('ป้องกัน') || taskName.includes('สร้างเสริม')) return <ShieldCheck {...props} />;
    if (taskName.includes('พ.ร.บ. วิชาชีพ')) return <ScrollText {...props} />;
    if (taskName.includes('จรรยาบรรณ')) return <Scale {...props} />;
    if (taskName.includes('พ.ร.บ. สถานพยาบาล')) return <Building2 {...props} />;
    if (taskName.includes('กฎหมายอื่นๆ')) return <FileText {...props} />;
    return <CircleDot {...props} />;
  };

  // Clinical Editorial semantic bar palette
  const taskColors = [
    '#0d9488', '#0284c7', '#10b981', '#d97706',
    '#e11d48', '#14b8a6', '#0369a1', '#64748b'
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(9, 9, 11, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1.5rem 1rem',
        boxSizing: 'border-box',
        overflowY: 'auto'
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
          padding: 'clamp(1.25rem, 3.5vw, 2rem)',
          position: 'relative',
          margin: 'auto',
          borderRadius: '18px',
          background: 'var(--bg-panel)',
          border: `1px solid ${category.borderColor || 'var(--border)'}`,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
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
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.background = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'var(--surface-subtle)';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', paddingRight: '2.5rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: category.bg || 'rgba(13, 148, 136, 0.12)',
              border: `1px solid ${category.borderColor || 'rgba(13, 148, 136, 0.28)'}`,
              color: category.color || 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {category.icon || <BookOpen size={20} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.22rem', margin: 0, color: 'var(--text)', fontWeight: 700 }}>
                {category.name}
              </h2>
              <span
                className="badge"
                style={{
                  background: category.bg || 'rgba(13, 148, 136, 0.12)',
                  color: category.color || 'var(--primary-light)',
                  border: `1px solid ${category.borderColor || 'rgba(13, 148, 136, 0.28)'}`,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {totalQuestions.toLocaleString()} ข้อ
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              {category.isLaw
                ? 'ข้อสอบกฎหมาย พระราชบัญญัติ และจรรยาบรรณแห่งวิชาชีพทันตกรรม'
                : 'เลือกฝึกซ้อมตามสมรรถนะวิชาชีพ (Tasks) หรือทำข้อสอบรวมทั้งวิชา'}
            </p>
          </div>
        </div>

        {/* Quick Full-Category Banner */}
        <div
          style={{
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem 1.15rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                onStart(category.name, '', fullCategoryCount, 'exam');
                onClose();
              }}
            >
              <PlayCircle size={14} /> สอบ {fullCategoryCount} ข้อ
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onStart(category.name, '', fullCategoryCount, 'practice');
                onClose();
              }}
            >
              <BookOpen size={14} /> ฝึก {fullCategoryCount} ข้อ
            </button>
            {category.isLaw && onOpenLawHub && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  onOpenLawHub();
                }}
              >
                <Layers size={14} /> Flashcards กฎหมาย
              </button>
            )}
          </div>
        </div>

        {/* Task Distribution Bar */}
        {tasks.length > 0 && totalQuestions > 0 && (
          <div style={{ marginBottom: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={13} /> สัดส่วนเนื้อหาในสาขาวิชานี้
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {tasks.length} หัวข้อย่อย
              </span>
            </div>
            <div
              style={{
                height: '8px',
                borderRadius: '999px',
                display: 'flex',
                overflow: 'hidden',
                background: 'var(--surface-subtle)'
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            {category.isLaw ? (
              <>
                <Scale size={15} color="var(--primary-light)" /> เลือกฝึกซ้อมตามหมวดกฎหมาย
              </>
            ) : (
              <>
                <Target size={15} color="var(--primary-light)" /> เลือกฝึกซ้อมตามสมรรถนะ / หัวข้อเล็ก
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>จำนวนข้อ:</span>
            {[
              { val: 10, label: '10' },
              { val: 20, label: '20' },
              { val: 30, label: '30' },
              { val: 'all', label: 'ทั้งหมด' }
            ].map(opt => (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setSelectedCount(opt.val)}
                style={{
                  background: selectedCount === opt.val ? 'var(--primary)' : 'var(--surface-subtle)',
                  color: selectedCount === opt.val ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${selectedCount === opt.val ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '6px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.76rem',
                  fontWeight: selectedCount === opt.val ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: '0.25rem' }}>
          {tasks.map((t, idx) => {
            const pct = totalQuestions > 0 ? Math.round((t.count / totalQuestions) * 100) : 0;
            const taskColor = taskColors[idx % taskColors.length];
            const qCount = selectedCount === 'all' ? t.count : Math.min(t.count, selectedCount);

            return (
              <div
                key={t.task}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.6rem',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface-card)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Task Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '210px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getTaskIcon(t.task)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                      {t.task}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', alignItems: 'center', fontVariantNumeric: 'tabular-nums' }}>
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
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
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
