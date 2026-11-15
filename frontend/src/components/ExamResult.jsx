import React, { useState } from 'react';
import {
  Home, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  Award, BarChart2, AlertCircle, AlertTriangle, FileText,
  ListChecks, Loader2, MinusCircle
} from 'lucide-react';
import { API_BASE } from '../config';
import ReportModal from './ReportModal';
import ExplanationBox from './ExplanationBox';

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
  const r = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  const color = passed ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="score-ring-wrapper">
      <svg viewBox="0 0 148 148" width="148" height="148">
        <circle className="score-ring-track" cx="74" cy="74" r={r} fill="none" strokeWidth="9" />
        <circle
          cx="74" cy="74" r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="score-ring-text">
        <div className="score-ring-number tabular-nums" style={{ color }}>{percentage}%</div>
        <div className="score-ring-label">{passed ? 'ผ่านเกณฑ์' : 'ยังไม่ผ่าน'}</div>
      </div>
    </div>
  );
}

// Category performance bar
function CategoryBar({ category, cat, correct, total, has_answer, hasAnswer, percentage }) {
  const label = category || cat || 'ไม่ระบุสาขา';
  const validTotal = has_answer ?? hasAnswer ?? total ?? 0;
  const pct = percentage ?? 0;
  const barColor = pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{label}</span>
        <span className="tabular-nums" style={{ fontSize: '0.82rem', color: percentage == null ? 'var(--text-muted)' : barColor, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {percentage == null ? `${correct}/${total} (ไม่มีเฉลย)` : `${correct}/${validTotal} (${percentage}%)`}
        </span>
      </div>
      <div className="progress-bar" style={{ height: '7px' }}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: barColor,
          }}
        />
      </div>
    </div>
  );
}

export default function ExamResult({ questions, userAnswers, startTime, analysisData, onHome, onPracticeTopic = null }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [reportingQuestionId, setReportingQuestionId] = useState(null);
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'analysis'
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'wrong' | 'unanswered' | 'correct'

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
  const hasAnswerCount = summary?.has_cached ?? hasAnswerQ;
  const isGradingPending = !analysisData && hasAnswerQ === 0 && questions.length > 0;

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
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>

      {/* ── Score Card ─────────────────────────────── */}
      <div className="glass-panel" style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem) clamp(1rem, 3vw, 2rem)', textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', marginBottom: '1.15rem' }}>
          <Award size={18} color="var(--primary-light)" />
          <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            EXAM RESULT SUMMARY
          </span>
        </div>

        {isGradingPending ? (
          <div style={{ padding: '1.5rem 0 1.25rem' }}>
            <Loader2 size={28} className="spin" color="var(--primary-light)" style={{ margin: '0 auto 0.65rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', margin: 0 }}>กำลังตรวจคำตอบและคำนวณคะแนน...</p>
          </div>
        ) : (
          <>
            <ScoreRing percentage={scorePercentage} passed={passed} />

            <div>
              <span className={`result-status-pill ${passed ? 'result-status-pill--pass' : 'result-status-pill--fail'}`}>
                {passed ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {passed ? 'ผ่านเกณฑ์ประเมิน (≥ 60%)' : 'ยังไม่ถึงเกณฑ์ (60%)'}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem', marginBottom: '1.25rem' }}>
              ตอบถูก <strong className="tabular-nums" style={{ color: 'var(--text)' }}>{correctCount}</strong> จาก{' '}
              <strong className="tabular-nums" style={{ color: 'var(--text)' }}>{hasAnswerCount > 0 ? hasAnswerCount : questions.length}</strong> ข้อ
              {elapsed !== null && (
                <span className="tabular-nums" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.65rem' }}>
                  · <Clock size={14} /> {formatTime(elapsed)}
                </span>
              )}
            </p>
          </>
        )}

        {/* Stats row */}
        <div className="stat-cards-row">
          <div className="stat-mini-card">
            <div className="stat-mini-number" style={{ color: 'var(--ink-emerald)' }}>{correctCount}</div>
            <div className="stat-mini-label">ตอบถูก</div>
          </div>
          <div className="stat-mini-card">
            <div className="stat-mini-number" style={{ color: 'var(--ink-rose)' }}>{incorrectCount}</div>
            <div className="stat-mini-label">ตอบผิด</div>
          </div>
          <div className="stat-mini-card">
            <div className="stat-mini-number" style={{ color: 'var(--ink-amber)' }}>{unanswered}</div>
            <div className="stat-mini-label">ไม่ได้ตอบ</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.35rem' }}>
          <button type="button" className="btn btn-primary" onClick={onHome}>
            <Home size={17} /> กลับหน้าหลัก
          </button>
        </div>
      </div>

      {/* ── Tab navigation ──────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div className="tab-bar">
          <button
            type="button"
            className={`tab-item ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            <ListChecks size={16} /> ตรวจคำตอบรายข้อ
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <BarChart2 size={16} />
            วิเคราะห์สาขา
            {!analysisReady && <Loader2 size={13} className="spin" style={{ marginLeft: '2px' }} />}
          </button>
        </div>
      </div>

      {/* ── ANALYSIS TAB ────────────────────────────── */}
      {activeTab === 'analysis' && (
        <div className="animate-fade-in">
          {!analysisReady ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Loader2 size={28} className="spin" color="var(--primary-light)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>กำลังวิเคราะห์ผลแยกตามสาขา...</p>
            </div>
          ) : (
            <>
              {/* Cache coverage note */}
              {summary?.has_cached < summary?.total && (
                <div className="expl-callout expl-callout--warning" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <AlertCircle size={18} color="var(--ink-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>
                    <strong style={{ color: 'var(--ink-amber)' }}>มีเฉลย {summary.has_cached}/{summary.total} ข้อ</strong>
                    {' '}— คะแนนวิเคราะห์คำนวณจากข้อที่มีเฉลยในคลังเท่านั้น ระบบกำลังเตรียมเฉลยเพิ่มเติมเบื้องหลัง
                  </div>
                </div>
              )}

              {/* Category breakdown */}
              <div className="glass-panel" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <BarChart2 size={18} color="var(--primary-light)" />
                  <span>ผลแยกตามสาขา</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>(เรียงจากอ่อนไปแข็ง)</span>
                </h3>
                {categoryBreakdown.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ไม่มีข้อมูลสาขาในชุดข้อสอบนี้</p>
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
                  borderColor: 'rgba(239, 68, 68, 0.25)',
                }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.9rem', color: 'var(--ink-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={17} /> สาขาที่ควรทบทวนเพิ่มเติม (&lt; 60%)
                  </h3>
                  {categoryBreakdown
                    .filter(c => c.percentage != null && c.percentage < 60)
                    .map(c => (
                      <div key={c.category} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.65rem 0', borderBottom: '1px solid var(--border)',
                        fontSize: '0.9rem', gap: '0.75rem',
                      }}>
                        <span style={{ color: 'var(--text)' }}>{c.category}</span>
                        <span className="tabular-nums" style={{ color: 'var(--ink-rose)', fontWeight: 700 }}>{c.percentage}%</span>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── REVIEW TAB ──────────────────────────────── */}
      {activeTab === 'review' && (() => {
        const matchesFilter = (q) => {
          const ua = userAnswers[q.id];
          const aq = analysisMap[q.id];
          const ca = aq?.correct_answer || q.correct_answer;
          const ok = ua && ca && ua === ca;
          if (reviewFilter === 'wrong') return !ua || (ca && ua !== ca);
          if (reviewFilter === 'unanswered') return !ua;
          if (reviewFilter === 'correct') return !!ok;
          return true;
        };
        const wrongOrBlankCount = questions.filter(q => {
          const ua = userAnswers[q.id];
          const ca = (analysisMap[q.id]?.correct_answer) || q.correct_answer;
          return !ua || (ca && ua !== ca);
        }).length;

        const filteredGroups = pages
          .map((g, idx) => ({ ...g, origIdx: idx, visibleQuestions: g.questions.filter(matchesFilter) }))
          .filter(g => g.visibleQuestions.length > 0);

        return (
        <div>
          <div className="result-filter-bar">
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1.05rem' }}>
              <ListChecks size={18} color="var(--primary-light)" />
              <span>รายละเอียดคำตอบ</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.84rem' }}>(คลิกหัวข้อเพื่อดูเฉลย)</span>
            </h3>

            <div className="result-filter-pills" role="tablist" aria-label="กรองรายการคำตอบ">
              <button type="button" className={`result-filter-pill ${reviewFilter === 'all' ? 'active' : ''}`} onClick={() => setReviewFilter('all')}>
                ทั้งหมด <span className="result-filter-count">{questions.length}</span>
              </button>
              <button type="button" className={`result-filter-pill ${reviewFilter === 'wrong' ? 'active' : ''}`} onClick={() => setReviewFilter('wrong')}>
                ผิด / ไม่ตอบ <span className="result-filter-count">{wrongOrBlankCount}</span>
              </button>
              <button type="button" className={`result-filter-pill ${reviewFilter === 'unanswered' ? 'active' : ''}`} onClick={() => setReviewFilter('unanswered')}>
                ไม่ได้ตอบ <span className="result-filter-count">{localUnanswered}</span>
              </button>
              <button type="button" className={`result-filter-pill ${reviewFilter === 'correct' ? 'active' : ''}`} onClick={() => setReviewFilter('correct')}>
                ตอบถูก <span className="result-filter-count">{correctCount}</span>
              </button>
            </div>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              ไม่พบข้อสอบในตัวกรองที่เลือก
            </div>
          ) : filteredGroups.map((group) => (
            <div key={group.origIdx} style={{ marginBottom: group.stem ? '2rem' : '0.85rem' }}>
              
              {group.stem && (
                <div className="exam-stem-card" style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0.26rem 0.65rem', gap: '5px' }}>
                        <FileText size={13} strokeWidth={1.8} /> {getStemLabel(group.stem, group.origIdx)}
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '0.84rem', color: 'var(--text-sub)', fontWeight: 600 }}>
                        ข้อย่อย {group.questions[0].globalIndex + 1}{group.questions.length > 1 && `–${group.questions[group.questions.length - 1].globalIndex + 1}`}
                      </span>
                    </div>
                    <span className="tabular-nums" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      เคสที่ {group.origIdx + 1} / {pages.length}
                    </span>
                  </div>
                  
                  {(() => {
                    const imgQ = group.questions.find(q => q.image_path);
                    if (imgQ) {
                      return (
                        <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
                          <img
                            src={`${API_BASE}/images/${imgQ.image_path}`}
                            alt="Stem Figure"
                            style={{ maxWidth: '100%', maxHeight: '360px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="question-stem" style={{ border: 'none', background: 'transparent', padding: 0, marginBottom: 0 }}>
                    {cleanStemText(group.stem).split('\n').map((line, i) => (
                      <p key={i} style={{ margin: 0, lineHeight: 1.7, fontSize: '1rem', color: 'var(--text)' }}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {group.visibleQuestions.map((q) => {
                const index = q.globalIndex;
                const userAnswer = userAnswers[q.id];
                const analysisQ = analysisMap[q.id];
                const correctAnswer = analysisQ?.correct_answer || q.correct_answer;
                const explanation   = analysisQ?.explanation    || q.explanation;
                const isCorrect = userAnswer && correctAnswer && userAnswer === correctAnswer;
                const hasKnownAnswer = !!correctAnswer;
                const expanded = !!expandedItems[q.id];

                let statusColor = 'var(--ink-amber)';
                let borderColor = 'var(--warning)';
                if (hasKnownAnswer && isCorrect) { statusColor = 'var(--ink-emerald)'; borderColor = 'var(--success)'; }
                else if (hasKnownAnswer && !isCorrect) { statusColor = 'var(--ink-rose)'; borderColor = 'var(--danger)'; }

                return (
                  <div
                    key={q.id}
                    className="glass-panel result-item animate-fade-in"
                    style={{
                      borderLeftColor: borderColor,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {/* Clickable Header */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={expanded}
                      onClick={() => toggleExpand(q.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleExpand(q.id);
                        }
                      }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{
                        flexShrink: 0,
                        width: '32px', height: '32px',
                        borderRadius: '8px',
                        background: hasKnownAnswer
                          ? isCorrect ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.12)'
                          : 'rgba(245, 158, 11, 0.12)',
                        border: `1.5px solid ${borderColor}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: statusColor,
                      }}>
                        {hasKnownAnswer ? (isCorrect ? <CheckCircle2 size={17} /> : <XCircle size={17} />) : <MinusCircle size={17} />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem', alignItems: 'center' }}>
                          <span className="badge badge-primary tabular-nums" style={{ fontSize: '0.72rem' }}>Q{index + 1}</span>
                          {q.category && <span className="badge" style={{ fontSize: '0.72rem' }}>{q.category}</span>}
                          {q.source_exam && (
                            <span className="badge" style={{ fontSize: '0.71rem', gap: '4px' }}>
                              <FileText size={11} /> {q.source_exam}
                            </span>
                          )}
                          {!hasKnownAnswer && (
                            <span className="badge" style={{ fontSize: '0.7rem', color: 'var(--ink-amber)', borderColor: 'rgba(245, 158, 11, 0.35)' }}>
                              รอเฉลย
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.96rem', lineHeight: 1.55, color: 'var(--text)', fontWeight: 600 }}>
                          <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--primary-light)', marginRight: '6px' }}>
                            {q.globalIndex + 1}.
                          </span>
                          {cleanQuestionText(group.stem ? (q.proposition || q.question_text) : q.question_text)}
                        </div>

                        {/* Compact answer summary */}
                        {!expanded && (
                          <div style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {userAnswer
                              ? <>คุณตอบ: <strong style={{ color: isCorrect ? 'var(--ink-emerald)' : 'var(--ink-rose)' }}>{userAnswer}</strong></>
                              : <span style={{ color: 'var(--ink-amber)' }}>ไม่ได้ตอบ</span>
                            }
                            {hasKnownAnswer && !isCorrect && (
                              <span> · เฉลย: <strong style={{ color: 'var(--ink-emerald)' }}>{correctAnswer}</strong></span>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ flexShrink: 0, color: 'var(--text-muted)', paddingTop: '0.2rem' }}>
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Expanded detail (Non-collapsing container) */}
                    {expanded && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        {!group.stem && q.image_path && (
                          <div style={{ margin: '0.5rem 0 0.85rem' }}>
                            <img
                              src={`${API_BASE}/images/${q.image_path}`}
                              alt="Question Figure"
                              style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                          </div>
                        )}

                        {/* Choices */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.85rem' }}>
                          {q.choices.map(choice => {
                            const isUserSelected = userAnswer === choice.label;
                            const isActualCorrect = correctAnswer === choice.label;

                            let bg = 'var(--surface-subtle)';
                            let border = 'var(--border)';
                            if (isActualCorrect) { bg = 'rgba(16, 185, 129, 0.1)'; border = 'var(--success)'; }
                            else if (isUserSelected && !isCorrect && hasKnownAnswer) { bg = 'rgba(239, 68, 68, 0.09)'; border = 'var(--danger)'; }
                            else if (isUserSelected && !hasKnownAnswer) { bg = 'rgba(37, 99, 235, 0.1)'; border = 'var(--primary)'; }

                            return (
                              <div key={choice.label} style={{
                                padding: '0.68rem 0.95rem',
                                background: bg,
                                borderRadius: 'var(--radius-inner)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                border: `1.5px solid ${border}`,
                                fontSize: '0.92rem',
                              }}>
                                <span style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  minWidth: '22px',
                                  color: isActualCorrect ? 'var(--ink-emerald)' : (isUserSelected && !isCorrect && hasKnownAnswer) ? 'var(--ink-rose)' : 'var(--text-sub)',
                                }}>
                                  {choice.label}
                                </span>
                                <span style={{ flex: 1, color: isActualCorrect ? 'var(--text)' : 'var(--text-sub)' }}>{choice.text}</span>
                                {isActualCorrect && <CheckCircle2 size={17} color="var(--ink-emerald)" />}
                                {isUserSelected && !isCorrect && hasKnownAnswer && <XCircle size={17} color="var(--ink-rose)" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {explanation && (
                          <ExplanationBox 
                            explanation={explanation} 
                            correctAnswer={correctAnswer} 
                            userAnswer={userAnswer}
                            isCached={true} 
                            question={{ ...q, ...(analysisQ || {}) }}
                            onPracticeTopic={onPracticeTopic}
                          />
                        )}

                        {!hasKnownAnswer && (
                          <div className="expl-callout expl-callout--warning" style={{ fontSize: '0.86rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', marginBottom: 0 }}>
                            <Clock size={15} color="var(--ink-amber)" /> ข้อนี้ยังไม่มีเฉลยในคลัง — ระบบกำลังเตรียมเฉลยเพิ่มเติมเบื้องหลัง
                          </div>
                        )}

                        {/* Action Buttons (Only for real questions with an ID) */}
                        {q.id && (
                          <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button 
                              type="button"
                              className="btn btn-secondary btn-sm" 
                              onClick={() => setReportingQuestionId(q.id)}
                              style={{ color: 'var(--text-muted)' }}
                            >
                              <AlertTriangle size={14} /> แจ้งปัญหา
                            </button>
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
          <div style={{ textAlign: 'center', padding: '1.5rem 0 1rem' }}>
            <button type="button" className="btn btn-primary btn-lg" onClick={onHome}>
              <Home size={18} /> กลับหน้าหลัก
            </button>
          </div>
        </div>
        );
      })()}

      {reportingQuestionId && (
        <ReportModal 
          questionId={reportingQuestionId} 
          onClose={() => setReportingQuestionId(null)} 
        />
      )}
    </div>
  );
}
