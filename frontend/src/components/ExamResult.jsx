import React, { useState } from 'react';
import { Home, CheckCircle2, XCircle, Clock, Lightbulb, ChevronDown, ChevronUp, Award, BarChart2, AlertCircle, Bot, AlertTriangle } from 'lucide-react';
import { API_BASE } from '../config';
import TutorChat from './TutorChat';
import ReportModal from './ReportModal';

function formatTime(ms) {
  if (!ms) return '—';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getProposition(q) {
  if (q.proposition && q.proposition.trim()) return q.proposition.trim();
  return (q.question_text || '').trim();
}

function cleanStemText(text) {
  if (!text) return '';
  return text.replace(/^STEM\s*(\d+|ปริศนา(?:\s*\d+)?)?\s*[:\-\.]*\s*/i, '').trim();
}

function cleanQuestionText(text) {
  if (!text) return '';
  return text
    .replace(/^STEM\s*(\d+|ปริศนา(?:\s*\d+)?)?\s*[:\-\.]*\s*/i, '')
    .replace(/^(\(?\d+[\.\)]\s*)+/, '')
    .trim();
}

function getStem(q) {
  if (q.stem && q.stem.trim() && q.stem.trim() !== (q.question_text || '').trim()) {
    return q.stem.trim();
  }
  return null;
}

function getStemLabel(stemText, pageIndex) {
  if (!stemText) return null;
  const m = stemText.match(/^STEM\s*(\d+|ปริศนา(?:\s*\d+)?)/i);
  if (m) {
    return `STEM ${m[1]}`;
  }
  return `STEM ${pageIndex + 1}`;
}

// SVG circular score ring
function ScoreRing({ percentage, passed }) {
  const r = 68;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  const color = passed ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="score-ring-wrapper">
      <svg viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="score-ring-text">
        <div className="score-ring-number" style={{ color }}>{percentage}%</div>
        <div className="score-ring-label">{passed ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}</div>
      </div>
    </div>
  );
}

// Category performance bar
function CategoryBar({ cat, correct, total, hasAnswer, percentage }) {
  const pct = percentage ?? 0;
  const barColor = pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.88rem', color: 'var(--text-sub)', fontWeight: 500 }}>{cat}</span>
        <span style={{ fontSize: '0.82rem', color: percentage == null ? 'var(--text-muted)' : barColor, fontWeight: 700 }}>
          {percentage == null ? `${correct}/${total} (ไม่มีเฉลย)` : `${correct}/${hasAnswer} — ${percentage}%`}
        </span>
      </div>
      <div className="progress-bar" style={{ height: '8px' }}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}`,
          }}
        />
      </div>
    </div>
  );
}

export default function ExamResult({ questions, userAnswers, startTime, analysisData, onHome }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [showTutorItems, setShowTutorItems] = useState({});
  const [reportingQuestionId, setReportingQuestionId] = useState(null);
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'analysis'

  const elapsed = startTime ? Date.now() - startTime : null;

  // Use analysisData if available, otherwise fall back to local calculation
  const summary = analysisData?.summary;
  const categoryBreakdown = analysisData?.category_breakdown || [];
  const perQuestion = analysisData?.per_question || [];

  // Local fallback counts
  let localCorrect = 0;
  questions.forEach(q => {
    if (q.correct_answer && userAnswers[q.id] === q.correct_answer) localCorrect++;
  });
  const localIncorrect = questions.filter(q => {
    const ua = userAnswers[q.id];
    return q.correct_answer && ua && ua !== q.correct_answer;
  }).length;
  const localUnanswered = questions.filter(q => !userAnswers[q.id]).length;
  const hasAnswerQ = questions.filter(q => q.correct_answer).length;

  const correctCount   = summary?.correct   ?? localCorrect;
  const incorrectCount = summary?.wrong      ?? localIncorrect;
  const unanswered     = summary?.unanswered ?? localUnanswered;
  const scorePercentage = summary?.score_pct  ?? (hasAnswerQ > 0 ? Math.round(localCorrect / hasAnswerQ * 100) : 0);
  const passed         = summary?.pass        ?? scorePercentage >= 60;

  // Build per-question map from analysis for explanation lookup
  const analysisMap = {};
  perQuestion.forEach(r => { analysisMap[r.question_id] = r; });

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTutor = (id) => {
    setShowTutorItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const pages = React.useMemo(() => {
    const pgs = [];
    let currentStem = null;
    let currentGroup = null;

    questions.forEach((q, i) => {
      const stem = getStem(q);
      if (stem && stem === currentStem) {
        currentGroup.questions.push({ ...q, globalIndex: i });
      } else if (stem) {
        currentStem = stem;
        currentGroup = { stem, questions: [{ ...q, globalIndex: i }] };
        pgs.push(currentGroup);
      } else {
        currentStem = null;
        pgs.push({ stem: null, questions: [{ ...q, globalIndex: i }] });
      }
    });
    return pgs;
  }, [questions]);

  const analysisReady = !!analysisData;

  return (
    <div className="animate-fade-in">

      {/* ── Score Card ─────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Award size={20} color="var(--warning)" />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-sub)', letterSpacing: '0.04em' }}>
            EXAM RESULT
          </span>
        </div>

        <ScoreRing percentage={scorePercentage} passed={passed} />

        <h2 style={{ marginBottom: '0.25rem' }}>
          {passed ? '🎉 สอบผ่าน!' : '📚 ยังไม่ผ่าน'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          ตอบถูก {correctCount} จาก {hasAnswerQ > 0 ? hasAnswerQ : questions.length} ข้อ (มีเฉลย)
          {elapsed !== null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.75rem' }}>
              · <Clock size={14} /> {formatTime(elapsed)}
            </span>
          )}
        </p>

        {/* Stats row */}
        <div className="stat-cards-row">
          <div className="stat-mini-card">
            <div className="stat-mini-number" style={{ color: 'var(--success)' }}>{correctCount}</div>
            <div className="stat-mini-label">✓ ถูก</div>
          </div>
          <div className="stat-mini-card">
            <div className="stat-mini-number" style={{ color: 'var(--danger)' }}>{incorrectCount}</div>
            <div className="stat-mini-label">✗ ผิด</div>
          </div>
          <div className="stat-mini-card">
            <div className="stat-mini-number" style={{ color: 'var(--warning)' }}>{unanswered}</div>
            <div className="stat-mini-label">— ไม่ตอบ</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onHome}>
            <Home size={18} /> กลับหน้าหลัก
          </button>
        </div>
      </div>

      {/* ── Tab navigation ──────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div className="tab-bar">
          <button
            className={`tab-item ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            📋 รายข้อ
          </button>
          <button
            className={`tab-item ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <BarChart2 size={16} />
            วิเคราะห์สาขา
            {!analysisReady && <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: '4px' }}>⏳</span>}
          </button>
        </div>
      </div>

      {/* ── ANALYSIS TAB ────────────────────────────── */}
      {activeTab === 'analysis' && (
        <div className="animate-fade-in">
          {!analysisReady ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ color: 'var(--text-muted)' }}>กำลังวิเคราะห์ผล...</p>
            </div>
          ) : (
            <>
              {/* Cache coverage note */}
              {summary?.has_cached < summary?.total && (
                <div className="glass-panel" style={{
                  marginBottom: '1.25rem', padding: '1rem 1.25rem',
                  borderColor: 'rgba(245,158,11,0.3)',
                  background: 'rgba(245,158,11,0.06)',
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                }}>
                  <AlertCircle size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>
                    <strong style={{ color: 'var(--warning)' }}>มีเฉลย {summary.has_cached}/{summary.total} ข้อ</strong>
                    {' '}— คะแนนวิเคราะห์คำนวณจากข้อที่มีเฉลยในคลังเท่านั้น
                    ระบบกำลัง pre-cache เฉลยเพิ่มเติมอยู่เบื้องหลัง
                  </div>
                </div>
              )}

              {/* Category breakdown */}
              <div className="glass-panel" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart2 size={18} color="var(--primary-light)" /> ผลแยกตามสาขา
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>(เรียงจากอ่อนไปแข็ง)</span>
                </h3>
                {categoryBreakdown.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ไม่มีข้อมูล</p>
                ) : (
                  categoryBreakdown.map(c => (
                    <CategoryBar key={c.category} {...c} />
                  ))
                )}
              </div>

              {/* Weak area recommendations */}
              {categoryBreakdown.filter(c => c.percentage != null && c.percentage < 60).length > 0 && (
                <div className="glass-panel" style={{
                  marginBottom: '1.25rem',
                  borderColor: 'rgba(244,63,94,0.25)',
                  background: 'rgba(244,63,94,0.04)',
                }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⚠️ สาขาที่ต้องทบทวน
                  </h3>
                  {categoryBreakdown
                    .filter(c => c.percentage != null && c.percentage < 60)
                    .map(c => (
                      <div key={c.category} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.6rem 0', borderBottom: '1px solid var(--border)',
                        fontSize: '0.9rem',
                      }}>
                        <span style={{ color: 'var(--text-sub)' }}>📌 {c.category}</span>
                        <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{c.percentage}%</span>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── REVIEW TAB ──────────────────────────────── */}
      {activeTab === 'review' && (
        <div>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <span>📋</span> รายละเอียดคำตอบ
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.88rem' }}>
              (คลิกเพื่อดูรายละเอียด)
            </span>
          </h3>

          {pages.map((group, groupIdx) => (
            <div key={groupIdx} style={{ 
              marginBottom: group.stem ? '2.5rem' : '1rem',
            }}>
              
              {group.stem && (
                <div className="glass-panel" style={{ 
                  marginBottom: '1rem', 
                  padding: '1.5rem', 
                  borderLeft: '4px solid var(--primary)',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(18,18,30,0.8) 100%)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="badge badge-primary" style={{ background: 'rgba(124, 58, 237, 0.25)', fontSize: '0.9rem', fontWeight: 800, padding: '0.35rem 0.75rem', border: '1px solid rgba(124,58,237,0.4)' }}>
                        📌 {getStemLabel(group.stem, groupIdx)}
                      </div>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-sub)', fontWeight: 600 }}>
                        ข้อย่อยที่ {group.questions[0].globalIndex + 1} {group.questions.length > 1 && `- ${group.questions[group.questions.length - 1].globalIndex + 1}`}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Stem ที่ {groupIdx + 1} จาก {pages.length}
                    </div>
                  </div>
                  
                  {/* Stem Image (if any question in the group has it) */}
                  {(() => {
                    const imgQ = group.questions.find(q => q.image_path);
                    if (imgQ) {
                      return (
                        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                          <img
                            src={`${API_BASE}/images/${imgQ.image_path}`}
                            alt="Stem Figure"
                            style={{ maxWidth: '100%', maxHeight: '380px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="question-stem" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                    {cleanStemText(group.stem).split('\n').map((line, i) => (
                      <p key={i} style={{ margin: 0, lineHeight: 1.7, fontSize: '1.05rem', color: 'var(--text)' }}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {group.questions.map((q) => {
                const index = q.globalIndex;
                const userAnswer = userAnswers[q.id];
                // Prefer analysis data for correct_answer (more up-to-date)
                const analysisQ = analysisMap[q.id];
                const correctAnswer = analysisQ?.correct_answer || q.correct_answer;
                const explanation   = analysisQ?.explanation    || q.explanation;
                const isCorrect = userAnswer && correctAnswer && userAnswer === correctAnswer;
                const hasKnownAnswer = !!correctAnswer;
                const expanded = expandedItems[q.id];

            let statusColor = 'var(--warning)';
            let statusIcon = '—';
            let borderColor = 'rgba(255,255,255,0.08)';
            if (hasKnownAnswer && isCorrect)  { statusColor = 'var(--success)'; statusIcon = '✓'; borderColor = 'var(--success)'; }
            else if (hasKnownAnswer && !isCorrect) { statusColor = 'var(--danger)';  statusIcon = '✗'; borderColor = 'var(--danger)';  }

            return (
              <div
                key={q.id}
                className="glass-panel result-item animate-fade-in"
                style={{
                  borderLeftColor: borderColor,
                  marginBottom: '0.85rem',
                  cursor: 'pointer',
                  animationDelay: `${Math.min(index * 30, 300)}ms`,
                  opacity: 0,
                }}
                onClick={() => toggleExpand(q.id)}
              >
                {/* Collapsed header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                  <div style={{
                    flexShrink: 0,
                    width: '34px', height: '34px',
                    borderRadius: '50%',
                    background: hasKnownAnswer
                      ? isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.12)'
                      : 'rgba(245,158,11,0.1)',
                    border: `2px solid ${borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.88rem',
                    color: statusColor,
                  }}>
                    {statusIcon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      <span className="badge" style={{ fontSize: '0.72rem' }}>Q{index + 1}</span>
                      {q.category && <span className="badge" style={{ fontSize: '0.72rem' }}>{q.category}</span>}
                      {!hasKnownAnswer && <span className="badge" style={{ fontSize: '0.7rem', color: 'var(--warning)', borderColor: 'rgba(245,158,11,0.3)' }}>⏳ รอเฉลย</span>}
                    </div>
                    <div style={{ fontSize: '0.93rem', lineHeight: 1.5, color: 'var(--text)', fontWeight: 500 }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', marginRight: '6px' }}>
                        {q.globalIndex + 1}.
                      </span>
                      {cleanQuestionText(group.stem ? (q.proposition || q.question_text) : q.question_text)}
                    </div>

                    {/* Compact answer summary */}
                    {!expanded && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {userAnswer
                          ? <>คุณตอบ: <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>{userAnswer}</strong></>
                          : <span style={{ color: 'var(--warning)' }}>ไม่ได้ตอบ</span>
                        }
                        {hasKnownAnswer && !isCorrect && (
                          <span> · เฉลย: <strong style={{ color: 'var(--success)' }}>{correctAnswer}</strong></span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ flexShrink: 0, color: 'var(--text-muted)', paddingTop: '0.25rem' }}>
                    {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    {q.source_exam && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                          📝 {q.source_exam}
                        </span>
                      </div>
                    )}
                    <p style={{ fontWeight: 600, lineHeight: 1.6, marginBottom: '1rem', color: 'var(--text)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', marginRight: '6px' }}>
                        {q.globalIndex + 1}.
                      </span>
                      {cleanQuestionText(q.proposition || q.question_text)}
                    </p>

                    {!group.stem && q.image_path && (
                      <div style={{ margin: '0.75rem 0' }}>
                        <img
                          src={`${API_BASE}/images/${q.image_path}`}
                          alt="Question Figure"
                          style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '10px' }}
                        />
                      </div>
                    )}

                    {/* Choices */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {q.choices.map(choice => {
                        const isUserSelected = userAnswer === choice.label;
                        const isActualCorrect = correctAnswer === choice.label;

                        let bg = 'rgba(255,255,255,0.03)';
                        let border = 'transparent';
                        if (isActualCorrect) { bg = 'rgba(16,185,129,0.12)'; border = 'var(--success)'; }
                        else if (isUserSelected && !isCorrect && hasKnownAnswer) { bg = 'rgba(244,63,94,0.1)'; border = 'var(--danger)'; }
                        else if (isUserSelected && !hasKnownAnswer) { bg = 'rgba(124,58,237,0.1)'; border = 'var(--primary)'; }

                        return (
                          <div key={choice.label} style={{
                            padding: '0.7rem 1rem',
                            background: bg,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            border: `1.5px solid ${border}`,
                            fontSize: '0.92rem',
                          }}>
                            <span style={{ fontWeight: 700, minWidth: '22px', color: isActualCorrect ? 'var(--success)' : 'var(--text-sub)' }}>
                              {choice.label}
                            </span>
                            <span style={{ flex: 1, color: 'var(--text-sub)' }}>{choice.text}</span>
                            {isActualCorrect && <CheckCircle2 className="icon-success" size={17} />}
                            {isUserSelected && !isCorrect && hasKnownAnswer && <XCircle className="icon-danger" size={17} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {explanation && (() => {
                      let parsedExpl = null;
                      try { parsedExpl = JSON.parse(explanation); } catch (e) {}

                      if (parsedExpl && parsedExpl.core_principle) {
                        return (
                          <div className="explanation-box">
                            <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                              <Lightbulb size={16} /> หลักการและเหตุผล
                            </h4>
                            <div style={{ lineHeight: 1.7, marginBottom: '1rem', whiteSpace: 'pre-wrap', color: 'var(--text-sub)', fontSize: '0.92rem' }}>
                              {parsedExpl.core_principle}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {Object.entries(parsedExpl.choice_explanations || {}).map(([label, text]) => {
                                const ok = label === correctAnswer;
                                return (
                                  <div key={label} style={{
                                    background: ok ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    borderLeft: ok ? '3px solid var(--success)' : '3px solid transparent',
                                    fontSize: '0.89rem',
                                  }}>
                                    <strong style={{ color: ok ? 'var(--success)' : 'var(--text-sub)' }}>ตัวเลือก {label}: </strong>
                                    <span style={{ color: 'var(--text-muted)' }}>{text}</span>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {parsedExpl.future_prediction && (
                              <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.05))',
                                border: '1px solid rgba(124, 58, 237, 0.2)',
                              }}>
                                <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                  <Lightbulb size={16} /> Professor's Wisdom
                                </h4>
                                <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                  {parsedExpl.future_prediction}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div className="explanation-box">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                              <Lightbulb size={15} color="var(--primary-light)" />
                              <strong style={{ fontSize: '0.88rem', color: 'var(--primary-light)' }}>คำอธิบาย</strong>
                            </div>
                            <div style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                              {explanation}
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {!hasKnownAnswer && (
                      <div style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(245,158,11,0.06)',
                        borderRadius: '8px',
                        border: '1px solid rgba(245,158,11,0.2)',
                        fontSize: '0.86rem',
                        color: 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}>
                        <span>⏳</span> ข้อนี้ยังไม่มีเฉลยในคลัง — ระบบกำลัง pre-cache อยู่เบื้องหลัง
                      </div>
                    )}

                    {/* Action Buttons (Only for real questions with an ID) */}
                    {q.id && (
                      <div style={{ marginTop: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={(e) => { e.stopPropagation(); toggleTutor(q.id); }}
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Bot size={15} color="var(--primary-light)" /> 
                          {showTutorItems[q.id] ? 'ซ่อน AI Tutor' : 'ถาม AI เพิ่มเติม'}
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={(e) => { e.stopPropagation(); setReportingQuestionId(q.id); }}
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
                        >
                          <AlertTriangle size={15} /> แจ้งปัญหา
                        </button>
                      </div>
                    )}

                    {q.id && showTutorItems[q.id] && (
                      <div onClick={e => e.stopPropagation()}>
                        <TutorChat questionId={q.id} />
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

          {/* Bottom home button */}
          <div style={{ textAlign: 'center', padding: '2rem 0 1rem' }}>
            <button className="btn btn-primary btn-lg" onClick={onHome}>
              <Home size={18} /> กลับหน้าหลัก
            </button>
          </div>
        </div>
      )}

      {reportingQuestionId && (
        <ReportModal 
          questionId={reportingQuestionId} 
          onClose={() => setReportingQuestionId(null)} 
        />
      )}
    </div>
  );
}
