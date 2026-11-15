import React, { useState, useEffect, useRef } from 'react';
import {
  CircleCheck, ChevronRight, ChevronLeft, Clock,
  Loader2, XCircle, Lightbulb, AlertTriangle,
  Bookmark, BookmarkCheck, StickyNote, HelpCircle,
  Flag, Strikethrough, FileText, ZoomIn, Keyboard, Check, EyeOff
} from 'lucide-react';
import { API_BASE } from '../config';
import ReportModal from './ReportModal';
import ExplanationBox from './ExplanationBox';
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

export default function ExamSession({ questions, mode = 'exam', config = {}, startTime, onFinish, onPracticeTopic = null }) {
  const { token, authFetch, user } = useAuth();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [focusedQuestionIndex, setFocusedQuestionIndex] = useState(0);
  const [targetQuestionId, setTargetQuestionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [elapsed, setElapsed] = useState(0);

  // ── Per-question time tracking (accumulates dwell time per page visit) ──
  const questionTimesRef = useRef({});
  const pageEnterRef = useRef(Date.now());
  const prevPageIndexRef = useRef(0);

  // ── Bookmarks, Flags, Notes, and Elimination state ──
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [flaggedIds, setFlaggedIds] = useState(new Set());
  const [eliminatedChoices, setEliminatedChoices] = useState({}); // question_id -> Set of choice labels
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: standard, 1: medium, 2: large
  const [notes, setNotes] = useState({});          // question_id -> note text
  const [noteTags, setNoteTags] = useState({});    // question_id -> mistake_tag
  const [noteSavedToast, setNoteSavedToast] = useState({}); // question_id -> bool
  const [noteEditorOpen, setNoteEditorOpen] = useState({}); // question_id -> bool
  const [confidence, setConfidence] = useState({}); // question_id -> 'confident' | 'unsure' | 'hard'
  const [showShortcuts, setShowShortcuts] = useState(false);
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

  const toggleFlag = (questionId) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const toggleEliminateChoice = (questionId, choiceLabel, e) => {
    if (e) e.stopPropagation();
    setEliminatedChoices(prev => {
      const current = prev[questionId] ? new Set(prev[questionId]) : new Set();
      if (current.has(choiceLabel)) current.delete(choiceLabel);
      else current.add(choiceLabel);
      return { ...prev, [questionId]: current };
    });
  };

  const fontSizes = [
    { stem: '1rem', prop: '1.05rem', choice: '0.92rem' },
    { stem: '1.12rem', prop: '1.18rem', choice: '0.98rem' },
    { stem: '1.25rem', prop: '1.32rem', choice: '1.1rem' },
  ];
  const fs = fontSizes[fontSizeLevel] || fontSizes[1];

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
          if (data.mistake_tag) {
            setNoteTags(prev => ({ ...prev, [q.id]: data.mistake_tag }));
          }
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
      const res = await authFetch(`${API_BASE}/api/bookmarks/notes`, {
        method: 'PUT',
        body: JSON.stringify({
          question_id: q.id,
          note_text: notes[q.id] || '',
          mistake_tag: noteTags[q.id] || '',
        }),
      });
      if (res.ok) {
        setNoteSavedToast(prev => ({ ...prev, [q.id]: true }));
        setTimeout(() => setNoteSavedToast(prev => ({ ...prev, [q.id]: false })), 2000);
      }
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

  // ── Smart Scrolling Logic ──
  // 1. If targetQuestionId is set (jumping directly to a specific question from dot navigator or shortcut):
  //    Smoothly scroll directly to that question card and highlight it.
  // 2. If targetQuestionId is null (normal Next / Prev page navigation):
  //    Smoothly scroll to the very top of the page so the user can immediately read the STEM.
  useEffect(() => {
    if (targetQuestionId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`question-card-${targetQuestionId}`);
        if (el) {
          const headerOffset = 85; // Account for sticky exam header
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
          el.classList.remove('question-highlight-pulse');
          void el.offsetWidth; // force DOM reflow
          el.classList.add('question-highlight-pulse');
          setTimeout(() => {
            el.classList.remove('question-highlight-pulse');
          }, 2000);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPageIndex, targetQuestionId]);

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setTargetQuestionId(null);
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setTargetQuestionId(null);
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (q, targetPageIndex) => {
    const targetPage = pages[targetPageIndex];
    const isFirstQuestionInPage = targetPage && targetPage.questions[0]?.id === q.id;
    const qIndexInPage = targetPage ? targetPage.questions.findIndex(item => item.id === q.id) : 0;
    setFocusedQuestionIndex(qIndexInPage !== -1 ? qIndexInPage : 0);

    if (isFirstQuestionInPage) {
      // If it is the first question of this STEM page (e.g. Q1, Q4, Q7), always scroll to the very top to read the STEM!
      setTargetQuestionId(null);
      setCurrentPageIndex(targetPageIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If it is a subsequent sub-question inside the STEM (e.g. Q2, Q3 in STEM 1, or Q5, Q6 in STEM 2), scroll directly to that question
      setTargetQuestionId(q.id);
      setCurrentPageIndex(targetPageIndex);
    }
  };

  // Sync focused question on page change
  useEffect(() => {
    const curPage = pages[currentPageIndex];
    if (curPage && curPage.questions) {
      const firstUnanswered = curPage.questions.findIndex(q => !answers[q.id]);
      setFocusedQuestionIndex(firstUnanswered !== -1 ? firstUnanswered : 0);
    }
  }, [currentPageIndex, pages]);

  const handleSubmit = () => {
    const finish = () => onFinish(answers, Date.now() - startTime, buildQuestionTimes(), confidence);
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

  // ── Keyboard Shortcuts Engine (Mac & Windows) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when user is actively typing in inputs / textareas / contenteditable
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (activeEl && activeEl.isContentEditable)) {
        return;
      }

      // Escape key to dismiss modals / lightboxes / shortcut popover
      if (e.key === 'Escape') {
        if (lightboxImg) {
          setLightboxImg(null);
          return;
        }
        if (reportingQuestionId) {
          setReportingQuestionId(null);
          return;
        }
        if (showShortcuts) {
          setShowShortcuts(false);
          return;
        }
      }

      // Disable other shortcuts if modal / lightbox is active
      if (lightboxImg || reportingQuestionId) return;

      const curPage = pages[currentPageIndex];
      if (!curPage || !curPage.questions || curPage.questions.length === 0) return;
      const curQ = curPage.questions[focusedQuestionIndex] || curPage.questions[0];

      // Navigation: Left / Right arrows
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPageIndex > 0) {
          setTargetQuestionId(null);
          setCurrentPageIndex(prev => prev - 1);
        }
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentPageIndex < pages.length - 1) {
          setTargetQuestionId(null);
          setCurrentPageIndex(prev => prev + 1);
        }
        return;
      }

      // Flag current question: F key
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (curQ) toggleFlag(curQ.id);
        return;
      }

      // Reveal explanation in practice mode: Spacebar
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (mode === 'practice' && curQ) {
          e.preventDefault();
          toggleReveal(curQ);
        }
        return;
      }

      // Choice selection: 1-5 or A-E
      const numMatch = ['1', '2', '3', '4', '5'].indexOf(e.key);
      const alphaMatch = ['a', 'b', 'c', 'd', 'e'].indexOf(e.key.toLowerCase());
      const choiceIdx = numMatch !== -1 ? numMatch : alphaMatch;

      if (choiceIdx !== -1 && curQ && curQ.choices) {
        let targetChoice = curQ.choices[choiceIdx];
        if (!targetChoice) {
          targetChoice = curQ.choices.find(c => 
            String(c.label).trim().toLowerCase() === e.key.toLowerCase()
          );
        }

        if (targetChoice) {
          e.preventDefault();
          handleSelectChoice(curQ.id, targetChoice.label);

          // If current STEM page has multiple sub-questions, auto advance focus to next sub-question
          if (curPage.questions.length > 1 && focusedQuestionIndex < curPage.questions.length - 1) {
            setFocusedQuestionIndex(prev => prev + 1);
            const nextQ = curPage.questions[focusedQuestionIndex + 1];
            if (nextQ) {
              const el = document.getElementById(`question-card-${nextQ.id}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, focusedQuestionIndex, pages, lightboxImg, reportingQuestionId, mode, answers]);

  const progressPercentage = (Object.keys(answers).length / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const renderQuestion = (q, localIdx) => {
    const expl = explanations[q.id];
    const isRevealed = revealed[q.id];
    const isFlagged = flaggedIds.has(q.id);
    const isFocused = focusedQuestionIndex === localIdx;

    return (
      <div 
        key={q.id} 
        id={`question-card-${q.id}`}
        className={currentPage.stem ? `exam-subquestion-card ${isFocused ? 'subquestion-card-focused' : ''}` : 'exam-subquestion-card exam-subquestion-card--standalone'}
        onClick={() => setFocusedQuestionIndex(localIdx)}
      >
        {/* Meta badges for sub-question */}
        <div className="question-meta">
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="badge badge-primary tabular-nums">
              Q{q.globalIndex + 1}
            </span>
            {q.category && (
              <span className="badge">{q.category}</span>
            )}
            {q.task && (
              <span className="badge">{q.task}</span>
            )}
            {q.source_exam && (
              <span className="badge" style={{ gap: '4px' }}>
                <FileText size={11} strokeWidth={1.8} /> {q.source_exam}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`exam-tool-icon-btn ${isFlagged ? 'exam-tool-icon-btn--flagged' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleFlag(q.id); }}
              title={isFlagged ? 'ยกเลิกการปักธง' : 'ปักธงข้อนี้เพื่อกลับมาทบทวน'}
            >
              <Flag size={13} fill={isFlagged ? 'currentColor' : 'none'} />
              <span>{isFlagged ? 'ปักธงแล้ว' : 'ปักธง'}</span>
            </button>

            {user && (
              <>
                <button
                  type="button"
                  className={`exam-tool-icon-btn ${bookmarkedIds.has(q.id) ? 'exam-tool-icon-btn--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(q); }}
                  title={bookmarkedIds.has(q.id) ? 'ลบบุ๊กมาร์ก' : 'บุ๊กมาร์กข้อนี้'}
                >
                  {bookmarkedIds.has(q.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                </button>
                <button
                  type="button"
                  className={`exam-tool-icon-btn ${noteEditorOpen[q.id] || notes[q.id] ? 'exam-tool-icon-btn--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleNoteEditor(q); }}
                  title="โน้ตส่วนตัว"
                >
                  <StickyNote size={15} />
                </button>
              </>
            )}
            <button
              type="button"
              className="exam-tool-icon-btn"
              onClick={(e) => { e.stopPropagation(); setReportingQuestionId(q.id); }}
              title="แจ้งข้อผิดพลาด"
            >
              <AlertTriangle size={14} /> <span>แจ้งปัญหา</span>
            </button>
          </div>
        </div>

        {/* Personal note editor */}
        {noteEditorOpen[q.id] && user && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ marginBottom: '1rem', padding: '0.9rem', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <StickyNote size={13} /> โน้ตส่วนตัวของคุณ (ติด Tag สาเหตุเพื่อรวมเข้า Cheat Sheet)
              </span>
              {noteSavedToast[q.id] && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--ink-emerald)', fontWeight: 700, fontSize: '0.76rem' }}>
                  <Check size={13} /> บันทึกแล้ว
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.55rem' }}>
              {['สับสนนิยาม', 'ลืมตัวเลข', 'พลาดแนวทางไทย', 'โดนตัวลวง'].map((tg) => {
                const activeTag = noteTags[q.id] === tg;
                return (
                  <button
                    key={tg}
                    type="button"
                    onClick={() => setNoteTags(prev => ({ ...prev, [q.id]: activeTag ? '' : tg }))}
                    style={{
                      padding: '0.22rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      background: activeTag ? 'rgba(245, 158, 11, 0.14)' : 'var(--surface-card)',
                      color: activeTag ? 'var(--ink-amber)' : 'var(--text-sub)',
                      border: `1px solid ${activeTag ? 'var(--warning)' : 'var(--border)'}`,
                    }}
                  >
                    #{tg}
                  </button>
                );
              })}
            </div>
            <textarea
              value={notes[q.id] || ''}
              onChange={(e) => setNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="จดบันทึก สูตร หรือจุดที่ต้องจำสำหรับข้อนี้..."
              rows={3}
              style={{ width: '100%', background: 'var(--surface-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-inner)', color: 'var(--text)', padding: '0.6rem 0.75rem', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.55rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => saveNote(q)}>บันทึกโน้ต</button>
            </div>
          </div>
        )}

        {/* Image (if no stem, or if this specific sub-question has its own image) */}
        {!currentPage.stem && q.image_path && (
          <div style={{ textAlign: 'center', margin: '0.75rem 0 1rem' }}>
            <img
              src={`${API_BASE}/images/${q.image_path}`}
              alt="Question Figure"
              style={{ maxWidth: '100%', maxHeight: '380px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', cursor: 'pointer' }}
              onClick={() => { setLightboxImg(`${API_BASE}/images/${q.image_path}`); setZoom(1); setPan({x:0, y:0}); }}
            />
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ZoomIn size={13} /> คลิกรูปภาพเพื่อซูมขยายเต็มจอ
            </div>
          </div>
        )}

        {/* Proposition or Question Text */}
        {currentPage.stem ? (
          <div className="question-proposition" style={{ marginTop: 0, fontSize: fs.prop }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)', marginRight: '6px' }}>
              {q.globalIndex + 1}.
            </span>
            {cleanQuestionText(getProposition(q))}
          </div>
        ) : (
          <h2 style={{ fontSize: fs.prop, lineHeight: 1.65, marginBottom: '0.5rem', color: 'var(--text)' }}>
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
            const isEliminated = (eliminatedChoices[q.id] && eliminatedChoices[q.id].has(choice.label));
            const isCorrect = isRevealed && expl && expl.correct_answer === choice.label;
            const isWrongSelected = isRevealed && selected && expl && expl.correct_answer !== choice.label;
            let cls = 'choice-item';
            if (selected) cls += ' selected';
            if (isCorrect) cls += ' correct-reveal';
            if (isWrongSelected) cls += ' wrong-reveal';
            if (isEliminated) cls += ' eliminated';

            return (
              <div 
                key={choice.id} 
                className={cls} 
                onClick={() => {
                  setFocusedQuestionIndex(localIdx);
                  handleSelectChoice(q.id, choice.label);
                }}
              >
                <div className="choice-label">{choice.label}</div>
                <div className="choice-text" style={{ flexGrow: 1, lineHeight: 1.55, fontSize: fs.choice }}>
                  {choice.text}
                </div>
                
                {/* Strike-through / Elimination Button */}
                {!isRevealed && (
                  <button
                    type="button"
                    className="choice-eliminate-btn"
                    onClick={(e) => toggleEliminateChoice(q.id, choice.label, e)}
                    title={isEliminated ? 'ยกเลิกการตัดช้อยส์' : 'ตัดช้อยส์ข้อนี้ทิ้ง'}
                  >
                    <Strikethrough size={13} />
                    {isEliminated ? 'ยกเลิกตัด' : 'ตัดช้อยส์'}
                  </button>
                )}

                {selected && !isRevealed && <CircleCheck size={19} color="var(--primary-light)" />}
                {isCorrect && <CircleCheck size={19} color="var(--success)" />}
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
            <CircleCheck size={15} /> มั่นใจ
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
          <div style={{ marginTop: '1.15rem' }}>
            <button
              type="button"
              className={isRevealed ? 'btn btn-secondary' : 'btn btn-primary'}
              onClick={() => toggleReveal(q)}
              disabled={expl && expl.loading}
              style={{ minWidth: '168px' }}
            >
              {expl && expl.loading ? (
                <><Loader2 size={16} className="spin" /> กำลังโหลดเฉลย...</>
              ) : isRevealed ? (
                <><EyeOff size={16} /> ซ่อนเฉลย</>
              ) : (
                <><Lightbulb size={16} /> ดูเฉลยข้อ {q.globalIndex + 1}</>
              )}
            </button>

            {expl && expl.error && (
              <div style={{ marginTop: '0.85rem', padding: '0.85rem 1rem', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--ink-rose)', fontSize: '0.88rem' }}>
                <strong>ไม่สามารถโหลดเฉลยได้:</strong> {expl.error}
              </div>
            )}

            {isRevealed && expl && expl.explanation && (
              <ExplanationBox 
                explanation={expl.explanation} 
                correctAnswer={expl.correct_answer} 
                userAnswer={answers[q.id]}
                isCached={expl.cached} 
                question={q}
                onPracticeTopic={onPracticeTopic}
              />
            )}
          </div>
        )}

      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 'calc(96px + var(--sab))' }}>

      {/* ── Sticky Top Bar ──────────────────────────── */}
      <div className="exam-sticky-header">
        <div className="exam-sticky-inner">
          {/* Left: Exam context + Range + Mode */}
          <div className="exam-sticky-left">
            {(config.year || config.part) && (
              <span className="badge badge-primary" style={{ fontSize: '0.76rem', padding: '0.2rem 0.55rem' }}>
                {config.year ? `พ.ศ. ${config.year}` : ''} {config.part ? (['1','2','3','4'].includes(String(config.part)) ? `Part ${config.part}` : config.part === 'law' ? 'กฎหมาย' : config.part.toUpperCase()) : ''}
              </span>
            )}
            {currentPage.stem && (
              <span className="badge badge-primary" style={{ fontSize: '0.76rem', fontWeight: 700, padding: '0.2rem 0.55rem', gap: '4px' }}>
                <FileText size={12} strokeWidth={1.8} /> {getStemLabel(currentPage.stem, currentPageIndex)}
              </span>
            )}
            <span className="exam-header-range">
              ข้อ {currentPage.questions[0].globalIndex + 1}
              {currentPage.questions.length > 1 && `–${currentPage.questions[currentPage.questions.length - 1].globalIndex + 1}`}
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}> / {questions.length}</span>
            </span>
            <span className={`exam-mode-chip ${mode === 'practice' ? 'exam-mode-chip--practice' : ''}`}>
              {mode === 'practice' ? 'ฝึกซ้อม' : 'สอบจับเวลา'}
            </span>
          </div>

          {/* Right: Telemetry, Shortcuts, Font size, Stepper */}
          <div className="exam-sticky-right">
            {mode === 'exam' && (
              <span className={`exam-timer-chip ${isTimeRunningOut ? 'exam-timer-chip--danger' : ''}`}>
                <Clock size={14} />
                {timeLimit ? formatTime(timeLeft) : formatTime(elapsed)}
              </span>
            )}
            <span className="exam-mode-chip tabular-nums" title="จำนวนข้อที่ตอบแล้ว">
              <Check size={13} strokeWidth={2.2} style={{ color: 'var(--primary-light)' }} />
              {answeredCount}/{questions.length}
            </span>

            {/* Desktop Keyboard Shortcuts Popover */}
            <div className="exam-kbd-wrap">
              <button
                type="button"
                className="exam-kbd-trigger"
                aria-expanded={showShortcuts}
                onClick={() => setShowShortcuts(s => !s)}
                title="ดูคีย์ลัดสำหรับคอมพิวเตอร์"
              >
                <Keyboard size={14} />
                <span>คีย์ลัด</span>
              </button>
              {showShortcuts && (
                <div className="exam-kbd-popover" role="dialog" aria-label="คีย์ลัดระหว่างทำข้อสอบ">
                  <div className="exam-kbd-row"><span>เลือกคำตอบ</span><span><kbd>1</kbd>–<kbd>5</kbd> หรือ <kbd>A</kbd>–<kbd>E</kbd></span></div>
                  <div className="exam-kbd-row"><span>เปลี่ยนหน้า</span><span><kbd>←</kbd> <kbd>→</kbd></span></div>
                  <div className="exam-kbd-row"><span>ปักธงทบทวน</span><kbd>F</kbd></div>
                  {mode === 'practice' && (
                    <div className="exam-kbd-row"><span>ดู / ซ่อนเฉลย</span><kbd>Space</kbd></div>
                  )}
                </div>
              )}
            </div>

            {/* Text size controls */}
            <div className="exam-font-stepper" role="group" aria-label="ปรับขนาดตัวอักษร">
              <button
                type="button"
                onClick={() => setFontSizeLevel(l => Math.max(0, l - 1))}
                disabled={fontSizeLevel === 0}
                title="ลดขนาดตัวอักษร"
              >
                A-
              </button>
              <span className="exam-font-stepper-divider" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setFontSizeLevel(l => Math.min(2, l + 1))}
                disabled={fontSizeLevel === 2}
                title="เพิ่มขนาดตัวอักษร"
              >
                A+
              </button>
            </div>

            {/* Compact Nav arrows */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handlePrev}
                disabled={currentPageIndex === 0}
                style={{ minWidth: '34px', minHeight: '34px', padding: '0 0.45rem' }}
                aria-label="หน้าก่อนหน้า"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleNext}
                disabled={currentPageIndex === pages.length - 1}
                style={{ minWidth: '34px', minHeight: '34px', padding: '0 0.45rem' }}
                aria-label="หน้าถัดไป"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="exam-header-progress">
          <div className="exam-header-progress-fill" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      {/* ── Question Card(s) ───────────────────────────── */}
      <div style={{ padding: '0.5rem 0 1.25rem' }}>
        <div
          className={`glass-panel question-card animate-fade-in${currentPage.stem ? ' question-card--split' : ''}`}
          style={currentPage.stem ? undefined : { padding: 'clamp(1rem, 2.5vw, 1.75rem)' }}
        >
          
          {currentPage.stem ? (
            <div className="exam-split-grid">
              {/* Left Column: Sticky Clinical Vignette / STEM + Diagnostic Imaging */}
              <div className="exam-stem-sticky-panel">
                <div className="exam-stem-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0.28rem 0.65rem', gap: '5px' }}>
                        <FileText size={13} strokeWidth={1.8} /> {getStemLabel(currentPage.stem, currentPageIndex)}
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '0.84rem', color: 'var(--text-sub)', fontWeight: 600 }}>
                        ข้อย่อย {currentPage.questions[0].globalIndex + 1}{currentPage.questions.length > 1 && `–${currentPage.questions[currentPage.questions.length - 1].globalIndex + 1}`}
                      </span>
                    </div>
                    <span className="tabular-nums" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      เคสที่ {currentPageIndex + 1} / {pages.length}
                    </span>
                  </div>
                  
                  {/* Show image for the stem if any question in the group has it */}
                  {(() => {
                    const imgQ = currentPage.questions.find(q => q.image_path);
                    if (imgQ) {
                      return (
                        <div style={{ textAlign: 'center', margin: '0.75rem 0 1rem' }}>
                          <img
                            src={`${API_BASE}/images/${imgQ.image_path}`}
                            alt="Stem Figure"
                            style={{ maxWidth: '100%', maxHeight: '360px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', cursor: 'pointer' }}
                            onClick={() => { setLightboxImg(`${API_BASE}/images/${imgQ.image_path}`); setZoom(1); setPan({x:0, y:0}); }}
                          />
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <ZoomIn size={13} /> คลิกรูปภาพเพื่อซูมขยายเต็มจอ
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="question-stem" style={{ border: 'none', background: 'transparent', padding: 0, marginBottom: 0 }}>
                    {cleanStemText(currentPage.stem).split('\n').map((line, i) => (
                      <p key={i} style={{ margin: 0, lineHeight: 1.75, fontSize: fs.stem }}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Sub-questions and choices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {currentPage.questions.map((q, localIdx) => renderQuestion(q, localIdx))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {currentPage.questions.map((q, localIdx) => renderQuestion(q, localIdx))}
            </div>
          )}

        </div>

        {/* ── Question Dots ─────────────────────────── */}
        <div className="confidence-legend">
          <div className="legend-item"><span className="legend-dot empty"></span> ยังไม่ตอบ</div>
          <div className="legend-item"><span className="legend-dot purple"></span> ตอบแล้ว</div>
          <div className="legend-item"><span className="legend-dot green"></span> มั่นใจ</div>
          <div className="legend-item"><span className="legend-dot yellow"></span> ไม่มั่นใจ</div>
          <div className="legend-item"><span className="legend-dot red"></span> ทำไม่ได้/เดา</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--warning)', borderRadius: '50%' }}></span> ปักธงทบทวน</div>
        </div>
        <div className="question-dots">
          {questions.map((q, i) => {
            let cls = 'q-dot';
            const conf = confidence[q.id];
            if (conf === 'confident') cls += ' status-green';
            else if (conf === 'unsure') cls += ' status-yellow';
            else if (conf === 'hard') cls += ' status-red';
            else if (answers[q.id]) cls += ' answered';

            if (flaggedIds.has(q.id)) cls += ' flagged';

            const pageIndex = pages.findIndex(p => p.questions.some(pq => pq.globalIndex === i));
            if (pageIndex === currentPageIndex) cls += ' current';
            return (
              <button key={q.id} className={cls} onClick={() => handleJumpToQuestion(q, pageIndex)} title={`ข้อ ${i + 1}${flaggedIds.has(q.id) ? ' (ปักธงไว้)' : ''}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Fixed Bottom Action Bar ──────────────────── */}
      <div className="exam-action-bar">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
        >
          <ChevronLeft size={17} /> <span>ก่อนหน้า</span>
        </button>

        <div className="exam-action-counter">
          {answeredCount} / {questions.length} ข้อ
        </div>

        {currentPageIndex < pages.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            <span>ถัดไป</span> <ChevronRight size={17} />
          </button>
        ) : (
          <button type="button" className="btn btn-success" onClick={handleSubmit}>
            <span>{mode === 'practice' ? 'สรุปผลการฝึก' : 'ส่งข้อสอบ'}</span>
            <CircleCheck size={17} />
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
