import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, ChevronRight, ChevronLeft, Clock,
  Sparkles, Loader2, XCircle, Lightbulb, AlertTriangle,
  Bookmark, BookmarkCheck, StickyNote, HelpCircle
} from 'lucide-react';
import { API_BASE } from '../config';
import ReportModal from './ReportModal';
import { useAuth } from '../contexts/AuthContext';

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  if (h > 0) return `${h}:${m}:${s}`;
  return `${m}:${s}`;
}

function getStem(q) {
  if (q.stem && q.stem.trim() && q.stem.trim() !== (q.question_text || '').trim()) {
    return q.stem.trim();
  }
  return null;
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

function getStemLabel(stemText, pageIndex) {
  if (!stemText) return null;
  const m = stemText.match(/^STEM\s*(\d+|ปริศนา(?:\s*\d+)?)/i);
  if (m) {
    return `STEM ${m[1]}`;
  }
  return `STEM ${pageIndex + 1}`;
}

export default function ExamSession({ questions, mode = 'exam', config = {}, startTime, onFinish }) {
  const { token, authFetch, user } = useAuth();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [elapsed, setElapsed] = useState(0);

  // ── Per-question time tracking (accumulates dwell time per page visit) ──
  const questionTimesRef = useRef({});
  const pageEnterRef = useRef(Date.now());
  const prevPageIndexRef = useRef(0);

  // ── Bookmarks & notes state ──
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [notes, setNotes] = useState({});          // question_id -> note text
  const [noteEditorOpen, setNoteEditorOpen] = useState({}); // question_id -> bool
  const [confidence, setConfidence] = useState({}); // question_id -> 'confident' | 'unsure' | 'hard'
  const [lightboxImg, setLightboxImg] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const toggleConfidence = (questionId, level) => {
    setConfidence(prev => ({
      ...prev,
      [questionId]: prev[questionId] === level ? null : level
    }));
  };

  // Group questions by stem
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

  const currentPage = pages[currentPageIndex];

  // Attribute dwell time to the page being left whenever the page changes
  useEffect(() => {
    const dt = Date.now() - pageEnterRef.current;
    pageEnterRef.current = Date.now();
    const prevPage = pages[prevPageIndexRef.current];
    if (prevPage) {
      prevPage.questions.forEach(q => {
        questionTimesRef.current[q.id] = (questionTimesRef.current[q.id] || 0) + dt;
      });
    }
    prevPageIndexRef.current = currentPageIndex;
  }, [currentPageIndex, pages]);

  // Build final per-question time map (including the page currently viewed)
  const buildQuestionTimes = () => {
    const dt = Date.now() - pageEnterRef.current;
    const times = { ...questionTimesRef.current };
    if (currentPage) {
      currentPage.questions.forEach(q => {
        times[q.id] = (times[q.id] || 0) + dt;
      });
    }
    return times;
  };

  // Load the user's bookmarks once (to render filled icons)
  useEffect(() => {
    if (!user) return;
    authFetch(`${API_BASE}/api/bookmarks`)
      .then(res => (res.ok ? res.json() : []))
      .then(rows => setBookmarkedIds(new Set(rows.map(r => r.id))))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleBookmark = async (q) => {
    if (!user) return;
    const isBookmarked = bookmarkedIds.has(q.id);
    // optimistic update
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(q.id); else next.add(q.id);
      return next;
    });
    try {
      if (isBookmarked) {
        await authFetch(`${API_BASE}/api/bookmarks/${q.id}`, { method: 'DELETE' });
      } else {
        await authFetch(`${API_BASE}/api/bookmarks`, {
          method: 'POST',
          body: JSON.stringify({ question_id: q.id }),
        });
      }
    } catch {
      // rollback on failure
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (isBookmarked) next.add(q.id); else next.delete(q.id);
        return next;
      });
    }
  };

  const toggleNoteEditor = async (q) => {
    const isOpen = noteEditorOpen[q.id];
    if (isOpen) {
      setNoteEditorOpen(prev => ({ ...prev, [q.id]: false }));
      return;
    }
    setNoteEditorOpen(prev => ({ ...prev, [q.id]: true }));
    if (notes[q.id] === undefined) {
      try {
        const res = await authFetch(`${API_BASE}/api/bookmarks/notes/${q.id}`);
        if (res.ok) {
          const data = await res.json();
          setNotes(prev => ({ ...prev, [q.id]: data.note_text }));
        } else {
          setNotes(prev => ({ ...prev, [q.id]: '' }));
        }
      } catch {
        setNotes(prev => ({ ...prev, [q.id]: '' }));
      }
    }
  };

  const saveNote = async (q) => {
    try {
      await authFetch(`${API_BASE}/api/bookmarks/notes`, {
        method: 'PUT',
        body: JSON.stringify({ question_id: q.id, note_text: notes[q.id] || '' }),
      });
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  // Practice-mode state
  const [revealed, setRevealed] = useState({});
  const [explanations, setExplanations] = useState({});
  const [reportingQuestionId, setReportingQuestionId] = useState(null);

  useEffect(() => {
    if (!startTime) return;
    const tick = () => setElapsed(Date.now() - startTime);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const timeLimit = config?.timeLimit;
  const timeLeft = timeLimit ? Math.max(0, timeLimit - elapsed) : null;
  const isTimeRunningOut = timeLimit && timeLeft > 0 && timeLeft <= 5 * 60 * 1000;

  // Auto-submit when time is up
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  useEffect(() => {
    if (timeLimit && timeLeft <= 0 && !hasAutoSubmitted) {
      setHasAutoSubmitted(true);
      alert('หมดเวลาทำข้อสอบแล้ว! ระบบจะทำการส่งข้อสอบให้คุณโดยอัตโนมัติ');
      onFinish(answers, Date.now() - startTime, buildQuestionTimes());
    }
  }, [timeLeft, timeLimit, hasAutoSubmitted, onFinish, answers, startTime]);

  const handleSelectChoice = (questionId, choiceLabel) => {
    setAnswers({ ...answers, [questionId]: choiceLabel });
  };

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    const finish = () => onFinish(answers, Date.now() - startTime, buildQuestionTimes());
    if (mode === 'practice') { finish(); return; }

    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (window.confirm(`คุณยังไม่ได้ตอบคำถาม ${unansweredCount} ข้อ แน่ใจหรือไม่ที่จะส่งข้อสอบ?`)) {
        finish();
      }
    } else {
      if (window.confirm('คุณต้องการส่งข้อสอบใช่หรือไม่?')) {
        finish();
      }
    }
  };

  const requestExplanation = async (q) => {
    setExplanations(prev => ({ ...prev, [q.id]: { ...prev[q.id], loading: true, error: null } }));
    try {
      const res = await authFetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        body: JSON.stringify({
          question_id: q.id,
          question_text: q.question_text,
          choices: q.choices.map(c => ({ label: c.label, text: c.text })),
          category: q.category,
          task: q.task,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setExplanations(prev => ({
        ...prev,
        [q.id]: { correct_answer: data.correct_answer, explanation: data.explanation, cached: data.cached, loading: false, error: null },
      }));
      setRevealed(prev => ({ ...prev, [q.id]: true }));
    } catch (err) {
      setExplanations(prev => ({ ...prev, [q.id]: { ...prev[q.id], loading: false, error: String(err.message || err) } }));
    }
  };

  const toggleReveal = (q) => {
    if (revealed[q.id]) {
      setRevealed(prev => ({ ...prev, [q.id]: false }));
    } else {
      if (explanations[q.id] && !explanations[q.id].loading && explanations[q.id].explanation) {
        setRevealed(prev => ({ ...prev, [q.id]: true }));
      } else {
        requestExplanation(q);
      }
    }
  };

  const progressPercentage = (Object.keys(answers).length / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ paddingBottom: '80px' }}>

      {/* ── Sticky Top Bar ──────────────────────────── */}
      <div className="exam-sticky-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Exam Title / Part Badge */}
          {(config.year || config.part) && (
            <span className="badge badge-primary" style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem', flexShrink: 0 }}>
              {config.year ? `พ.ศ. ${config.year}` : ''} {config.part ? (['1','2','3','4'].includes(String(config.part)) ? `Part ${config.part}` : config.part === 'law' ? 'กฎหมาย' : config.part.toUpperCase()) : ''}
            </span>
          )}

          {/* Progress & Stem text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            {currentPage.stem && (
              <span className="badge badge-accent" style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.55rem', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                {getStemLabel(currentPage.stem, currentPageIndex)}
              </span>
            )}
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', minWidth: '85px' }}>
              ข้อ {currentPage.questions[0].globalIndex + 1} 
              {currentPage.questions.length > 1 && ` - ${currentPage.questions[currentPage.questions.length - 1].globalIndex + 1}`}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> / {questions.length}</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ flex: 1, minWidth: '80px' }}>
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>

          {/* Timer + mode badge */}
          <div style={{ display: 'flex', align: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {mode === 'exam' && (
              <span className={`timer ${isTimeRunningOut ? 'timer-warning' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isTimeRunningOut ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.95rem', fontVariantNumeric: 'tabular-nums', fontWeight: isTimeRunningOut ? 700 : 500 }}>
                <Clock size={15} />
                {timeLimit ? formatTime(timeLeft) : formatTime(elapsed)}
              </span>
            )}
            {mode === 'practice' && (
              <span className="badge badge-accent">Practice</span>
            )}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ✓ {answeredCount}/{questions.length}
            </span>
          </div>

          {/* Nav arrows */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              style={{ padding: '0.4rem 0.65rem' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleNext}
              disabled={currentPageIndex === pages.length - 1}
              style={{ padding: '0.4rem 0.65rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Question Card(s) ───────────────────────────── */}
      <div style={{ padding: '1.25rem 0' }}>
        <div className="glass-panel question-card animate-fade-in" style={{ padding: '2rem' }}>
          
          {/* Stem Area (Rendered once per page if exists) */}
          {currentPage.stem && (
            <div className="glass-panel" style={{ 
              marginBottom: '2rem', 
              padding: '1.5rem', 
              borderLeft: '4px solid var(--primary)',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(18,18,30,0.8) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="badge badge-primary" style={{ background: 'rgba(124, 58, 237, 0.25)', fontSize: '0.9rem', fontWeight: 800, padding: '0.35rem 0.75rem', border: '1px solid rgba(124,58,237,0.4)' }}>
                    📌 {getStemLabel(currentPage.stem, currentPageIndex)}
                  </div>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-sub)', fontWeight: 600 }}>
                    ข้อย่อยที่ {currentPage.questions[0].globalIndex + 1} {currentPage.questions.length > 1 && `- ${currentPage.questions[currentPage.questions.length - 1].globalIndex + 1}`}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Stem ที่ {currentPageIndex + 1} จาก {pages.length}
                </div>
              </div>
              
              {/* Show image for the stem if any question in the group has it */}
              {(() => {
                const imgQ = currentPage.questions.find(q => q.image_path);
                if (imgQ) {
                  return (
                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                      <img
                        src={`${API_BASE}/images/${imgQ.image_path}`}
                        alt="Stem Figure"
                        style={{ maxWidth: '100%', maxHeight: '380px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', cursor: 'pointer' }}
                        onClick={() => { setLightboxImg(`${API_BASE}/images/${imgQ.image_path}`); setZoom(1); setPan({x:0, y:0}); }}
                      />
                    </div>
                  );
                }
                return null;
              })()}

              <div className="question-stem" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                {cleanStemText(currentPage.stem).split('\n').map((line, i) => (
                  <p key={i} style={{ margin: 0, lineHeight: 1.75, fontSize: '1.1rem' }}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Render individual questions for this page */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {currentPage.questions.map((q, localIdx) => {
              const expl = explanations[q.id];
              const isRevealed = revealed[q.id];

              return (
                <div key={q.id} style={{ padding: currentPage.stem ? '1.5rem' : '0', background: currentPage.stem ? 'rgba(255,255,255,0.02)' : 'transparent', borderRadius: '12px', border: currentPage.stem ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  
                  {/* Meta badges for sub-question */}
                  <div className="question-meta" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">
                        Q{q.globalIndex + 1}
                      </span>
                      {q.category && (
                        <span className="badge">{q.category}</span>
                      )}
                      {q.task && (
                        <span className="badge">{q.task}</span>
                      )}
                      {q.source_exam && (
                        <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                          📝 {q.source_exam}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {user && (
                        <>
                          <button
                            onClick={() => toggleBookmark(q)}
                            style={{ background: 'none', border: 'none', color: bookmarkedIds.has(q.id) ? 'var(--accent)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.2rem' }}
                            title={bookmarkedIds.has(q.id) ? 'ลบบุ๊กมาร์ก' : 'บุ๊กมาร์กข้อนี้'}
                          >
                            {bookmarkedIds.has(q.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                          </button>
                          <button
                            onClick={() => toggleNoteEditor(q)}
                            style={{ background: 'none', border: 'none', color: noteEditorOpen[q.id] || notes[q.id] ? 'var(--primary-light)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.2rem' }}
                            title="โน้ตส่วนตัว"
                          >
                            <StickyNote size={17} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setReportingQuestionId(q.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer', padding: '0.2rem' }}
                        title="แจ้งข้อผิดพลาด"
                      >
                        <AlertTriangle size={14} /> แจ้งปัญหา
                      </button>
                    </div>
                  </div>

                  {/* Personal note editor */}
                  {noteEditorOpen[q.id] && user && (
                    <div style={{ marginBottom: '1rem', padding: '0.9rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <StickyNote size={13} /> โน้ตส่วนตัวของคุณ (เห็นเฉพาะคุณ)
                      </div>
                      <textarea
                        value={notes[q.id] || ''}
                        onChange={(e) => setNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="จดบันทึก สูตร หรือจุดที่ต้องจำสำหรับข้อนี้..."
                        rows={3}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text)', padding: '0.6rem', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => saveNote(q)}>บันทึกโน้ต</button>
                      </div>
                    </div>
                  )}

                  {/* Image (if no stem, or if this specific sub-question has its own image which is rare but possible) */}
                  {!currentPage.stem && q.image_path && (
                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                      <img
                        src={`${API_BASE}/images/${q.image_path}`}
                        alt="Question Figure"
                        style={{ maxWidth: '100%', maxHeight: '380px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', cursor: 'pointer' }}
                        onClick={() => { setLightboxImg(`${API_BASE}/images/${q.image_path}`); setZoom(1); setPan({x:0, y:0}); }}
                      />
                    </div>
                  )}

                  {/* Proposition or Question Text */}
                  {currentPage.stem ? (
                    <div className="question-proposition" style={{ marginTop: 0, fontSize: '1.15rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', marginRight: '6px' }}>
                        {q.globalIndex + 1}.
                      </span>
                      {cleanQuestionText(getProposition(q))}
                    </div>
                  ) : (
                    <h2 style={{ fontSize: '1.3rem', lineHeight: 1.65, marginBottom: '0.5rem', color: 'var(--text)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', marginRight: '8px' }}>
                        {q.globalIndex + 1}.
                      </span>
                      {cleanQuestionText(q.question_text)}
                    </h2>
                  )}

                  {/* Choices */}
                  <div className="choice-list">
                    {q.choices.map((choice) => {
                      const selected = answers[q.id] === choice.label;
                      const isCorrect = isRevealed && expl && expl.correct_answer === choice.label;
                      const isWrongSelected = isRevealed && selected && expl && expl.correct_answer !== choice.label;
                      let cls = 'choice-item';
                      if (selected) cls += ' selected';
                      if (isCorrect) cls += ' correct-reveal';
                      if (isWrongSelected) cls += ' wrong-reveal';

                      return (
                        <div key={choice.id} className={cls} onClick={() => handleSelectChoice(q.id, choice.label)}>
                          <div className="choice-label">{choice.label}</div>
                          <div style={{ flexGrow: 1, lineHeight: 1.5 }}>{choice.text}</div>
                          {selected && !isRevealed && <CheckCircle2 size={19} color="var(--primary-light)" />}
                          {isCorrect && <CheckCircle2 size={19} color="var(--success)" />}
                          {isWrongSelected && <XCircle size={19} color="var(--danger)" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Confidence Level Selector */}
                  <div className="confidence-selector">
                    <span className="confidence-label">ระดับความมั่นใจ:</span>
                    <button
                      type="button"
                      className={`confidence-btn green ${confidence[q.id] === 'confident' ? 'active' : ''}`}
                      onClick={() => toggleConfidence(q.id, 'confident')}
                      title="ทำแล้วมั่นใจ"
                    >
                      <CheckCircle2 size={15} /> มั่นใจ
                    </button>
                    <button
                      type="button"
                      className={`confidence-btn yellow ${confidence[q.id] === 'unsure' ? 'active' : ''}`}
                      onClick={() => toggleConfidence(q.id, 'unsure')}
                      title="ทำแล้วไม่มั่นใจ"
                    >
                      <HelpCircle size={15} /> ไม่มั่นใจ
                    </button>
                    <button
                      type="button"
                      className={`confidence-btn red ${confidence[q.id] === 'hard' ? 'active' : ''}`}
                      onClick={() => toggleConfidence(q.id, 'hard')}
                      title="ทำแล้วทำไม่ได้แต่ตอบ / เดา"
                    >
                      <AlertTriangle size={15} /> ทำไม่ได้ / เดา
                    </button>
                  </div>

                  {/* Practice: reveal button + explanation */}
                  {mode === 'practice' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <button
                        className="btn btn-accent"
                        onClick={() => toggleReveal(q)}
                        disabled={expl && expl.loading}
                        style={{ minWidth: '180px' }}
                      >
                        {expl && expl.loading ? (
                          <><Loader2 size={17} className="spin" /> กำลังโหลด...</>
                        ) : isRevealed ? (
                          <>ซ่อนเฉลย</>
                        ) : (
                          <><Sparkles size={17} /> ดูเฉลยข้อ {q.globalIndex + 1} (AI)</>
                        )}
                      </button>

                      {expl && expl.error && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(244,63,94,0.1)', borderRadius: '10px', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', fontSize: '0.9rem' }}>
                          <strong>ไม่สามารถโหลดเฉลยได้:</strong> {expl.error}
                        </div>
                      )}

                      {isRevealed && expl && expl.explanation && (() => {
                        let parsedExpl = null;
                        try { parsedExpl = JSON.parse(expl.explanation); } catch (e) {}

                        if (parsedExpl && parsedExpl.core_principle) {
                          return (
                            <div className="explanation-box" style={{ marginTop: '1.25rem' }}>
                              <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>เฉลยที่ถูกต้อง</span>
                                <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.4rem', marginLeft: '0.6rem' }}>
                                  {expl.correct_answer}
                                </span>
                                {expl.cached && <span className="badge" style={{ marginLeft: 8 }}>จากคลัง</span>}
                              </div>

                              <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
                                <Lightbulb size={17} /> หลักการและเหตุผล
                              </h4>
                              <div style={{ lineHeight: 1.7, marginBottom: '1.25rem', whiteSpace: 'pre-wrap', color: 'var(--text-sub)', fontSize: '0.94rem' }}>
                                {parsedExpl.core_principle}
                              </div>

                              <h4 style={{ color: 'var(--accent)', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 700 }}>วิเคราะห์ตัวเลือก</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {Object.entries(parsedExpl.choice_explanations || {}).map(([label, text]) => {
                                  const ok = label === expl.correct_answer;
                                  return (
                                    <div key={label} style={{
                                      background: ok ? 'rgba(16,185,129,0.09)' : 'rgba(255,255,255,0.03)',
                                      padding: '0.85rem 1rem',
                                      borderRadius: '8px',
                                      borderLeft: ok ? '3px solid var(--success)' : '3px solid transparent',
                                    }}>
                                      <strong style={{ color: ok ? 'var(--success)' : 'var(--text-sub)' }}>ตัวเลือก {label}: </strong>
                                      <span style={{ color: 'var(--text-muted)', lineHeight: 1.55, fontSize: '0.92rem' }}>{text}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="explanation-box" style={{ marginTop: '1.25rem' }}>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>เฉลยที่ถูกต้อง </span>
                                <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.2rem' }}>{expl.correct_answer}</span>
                                {expl.cached && <span className="badge" style={{ marginLeft: 8 }}>จากคลัง</span>}
                              </div>
                              <div style={{ marginTop: '0.5rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-sub)', fontSize: '0.94rem' }}>
                                {expl.explanation}
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* ── Question Dots ─────────────────────────── */}
        <div className="confidence-legend">
          <div className="legend-item"><span className="legend-dot empty"></span> ยังไม่ตอบ</div>
          <div className="legend-item"><span className="legend-dot purple"></span> ตอบแล้ว</div>
          <div className="legend-item"><span className="legend-dot green"></span> มั่นใจ</div>
          <div className="legend-item"><span className="legend-dot yellow"></span> ไม่มั่นใจ</div>
          <div className="legend-item"><span className="legend-dot red"></span> ทำไม่ได้/เดา</div>
        </div>
        <div className="question-dots">
          {questions.map((q, i) => {
            let cls = 'q-dot';
            const conf = confidence[q.id];
            if (conf === 'confident') cls += ' status-green';
            else if (conf === 'unsure') cls += ' status-yellow';
            else if (conf === 'hard') cls += ' status-red';
            else if (answers[q.id]) cls += ' answered';

            const pageIndex = pages.findIndex(p => p.questions.some(pq => pq.globalIndex === i));
            if (pageIndex === currentPageIndex) cls += ' current';
            return (
              <button key={q.id} className={cls} onClick={() => setCurrentPageIndex(pageIndex)} title={`ข้อ ${i + 1}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Fixed Bottom Action Bar ──────────────────── */}
      <div className="exam-action-bar">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
        >
          <ChevronLeft size={18} /> Previous
        </button>

        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
          {answeredCount} / {questions.length} answered
        </div>

        {currentPageIndex < pages.length - 1 ? (
          <button className="btn btn-primary" onClick={handleNext}>
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleSubmit}>
            {mode === 'practice' ? 'Finish Practice' : 'Submit Exam'}
            <CheckCircle2 size={18} />
          </button>
        )}
      </div>

      {/* Report Modal */}
      {reportingQuestionId && (
        <ReportModal 
          questionId={reportingQuestionId} 
          onClose={() => setReportingQuestionId(null)} 
        />
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            overflow: 'auto'
          }}
          onClick={() => setLightboxImg(null)}
        >
          <div 
            style={{ 
              position: 'relative', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', width: '100%' 
            }} 
            onClick={(e) => {
              if (!isDragging) e.stopPropagation();
            }}
            onMouseDown={(e) => {
              if (zoom > 1) {
                e.preventDefault();
                setIsDragging(true);
                dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
              }
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img 
              src={lightboxImg} 
              alt="Enlarged view" 
              draggable={false}
              style={{
                maxWidth: zoom === 1 ? '90vw' : 'none',
                maxHeight: zoom === 1 ? '90vh' : 'none',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-in-out',
                borderRadius: '8px',
                boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                transformOrigin: 'center center',
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-out',
                userSelect: 'none'
              }} 
            />
          </div>
          
          {/* Zoom Controls */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '10px 20px',
            borderRadius: '30px',
            backdropFilter: 'blur(10px)',
            zIndex: 10000
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}
            >
              -
            </button>
            <span style={{ color: 'white', display: 'flex', alignItems: 'center', minWidth: '60px', justifyContent: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(4, z + 0.25))}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}
            >
              +
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', borderRadius: '15px', padding: '0 10px', marginLeft: '10px' }}
            >
              Reset
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s',
              zIndex: 10000
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            <XCircle size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
