import React from 'react';
import { Lightbulb, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';

export default function ExplanationBox({ explanation, correctAnswer, isCached = false }) {
  if (!explanation) return null;

  let parsed = null;
  if (typeof explanation === 'object' && explanation !== null) {
    parsed = explanation;
  } else {
    try {
      parsed = JSON.parse(explanation);
    } catch (e) {
      // plain text fallback
    }
  }

  // Plain text fallback
  if (!parsed || typeof parsed !== 'object' || (!parsed.core_principle && !parsed.key_takeaway)) {
    return (
      <div className="explanation-box" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} color="var(--primary-light)" />
            <strong style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>เฉลยและคำอธิบาย</strong>
          </div>
          {correctAnswer && (
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>
              คำตอบที่ถูกต้อง: {correctAnswer}
            </span>
          )}
        </div>
        <div style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {explanation}
        </div>
      </div>
    );
  }

  const {
    key_takeaway,
    legal_citation,
    core_principle,
    choice_explanations,
    common_pitfall,
    future_prediction,
  } = parsed;

  const actualCorrect = parsed.correct_answer || correctAnswer;

  return (
    <div className="explanation-box" style={{ marginTop: '1.25rem' }}>
      
      {/* ── Header: Correct Answer + Citations ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>เฉลยที่ถูกต้อง:</span>
          <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.35rem' }}>
            {actualCorrect}
          </span>
          {isCached && <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>คลังข้อสอบ</span>}
        </div>

        {legal_citation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>
            <BookOpen size={13} /> {legal_citation}
          </div>
        )}
      </div>

      {/* ── 1. Key Takeaway (สรุป 1 บรรทัดจำไปสอบ) ── */}
      {key_takeaway && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(124, 58, 237, 0.1) 100%)',
          borderLeft: '4px solid var(--accent)',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>
            <span>📌</span> Key Takeaway (สรุปหัวใจสำคัญ)
          </div>
          <div style={{ color: 'var(--text)', fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.6 }}>
            {key_takeaway}
          </div>
        </div>
      )}

      {/* ── 2. Common Pitfall & Traps (หลุมพรางข้อสอบ) ── */}
      {common_pitfall && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderLeft: '4px solid var(--warning)',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>
            <AlertTriangle size={15} /> ข้อควรระวัง & กับดักข้อสอบ (Common Trap)
          </div>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {common_pitfall}
          </div>
        </div>
      )}

      {/* ── 3. Core Principle (หลักการและเหตุผล) ── */}
      {core_principle && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}>
            <Lightbulb size={16} /> หลักการและเหตุผลทางกฎหมาย
          </h4>
          <div style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-sub)', fontSize: '0.92rem' }}>
            {core_principle}
          </div>
        </div>
      )}

      {/* ── 4. Choice-by-Choice Breakdown (วิเคราะห์ตัวเลือกรายข้อ) ── */}
      {choice_explanations && Object.keys(choice_explanations).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '0.6rem', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            🎯 วิเคราะห์ตัวเลือกรายข้อ
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(choice_explanations).map(([label, text]) => {
              const isCorrect = String(label).trim().toUpperCase() === String(actualCorrect).trim().toUpperCase();
              return (
                <div key={label} style={{
                  background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isCorrect ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border)',
                  borderLeft: isCorrect ? '4px solid var(--success)' : '4px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.75rem 0.9rem',
                  fontSize: '0.9rem',
                }}>
                  <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--text-sub)', marginRight: '4px' }}>
                    ตัวเลือก {label}:
                  </strong>
                  <span style={{ color: isCorrect ? 'var(--text)' : 'var(--text-muted)', lineHeight: 1.55 }}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. Future Prediction / Professor's Wisdom ── */}
      {future_prediction && (
        <div style={{
          marginTop: '1rem',
          padding: '0.9rem 1rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(6, 182, 212, 0.04))',
          border: '1px solid rgba(124, 58, 237, 0.2)',
        }}>
          <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
            <Sparkles size={15} /> Professor's Wisdom / แนวโน้มข้อสอบ
          </h4>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {future_prediction}
          </div>
        </div>
      )}

    </div>
  );
}
