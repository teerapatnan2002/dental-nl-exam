import React, { useState, useEffect, useRef } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import ExamSession from './components/ExamSession';
import ExamResult from './components/ExamResult';
import LawStudyHub from './components/LawStudyHub';
import ClinicalStudyHub from './components/ClinicalStudyHub';
import AuthModal from './components/AuthModal';
import AccountModal from './components/AccountModal';
import ExamScheduleModal from './components/ExamScheduleModal';
import ScheduledExamModal from './components/ScheduledExamModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { XCircle, User as UserIcon, Users, LogOut, Sun, Moon, Scale, Calendar, BookOpen, AlertCircle, X, ArrowRight } from 'lucide-react';
import { API_BASE } from './config';
import { getPrimaryUpcomingExam, calculateTimeRemaining } from './data/examSchedule';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function getOrCreateClientKey(storageType, storageKey) {
  const makeId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().replace(/-/g, '');
    }
    return `nl_${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;
  };
  try {
    const store = storageType === 'session' ? window.sessionStorage : window.localStorage;
    const existing = store.getItem(storageKey);
    if (existing && /^[A-Za-z0-9_-]{6,64}$/.test(existing)) return existing;
    const created = makeId();
    store.setItem(storageKey, created);
    return created;
  } catch {
    return makeId();
  }
}

function useSessionState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.sessionStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  useEffect(() => {
    try {
      if (value === undefined || value === null) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {}
  }, [key, value]);
  return [value, setValue];
}

function AppContent() {
  const { user, token, logout, authFetch } = useAuth();
  const [currentView, setCurrentView] = useSessionState('dashboard', 'nl_v4_currentView');
  const [examConfig, setExamConfig] = useSessionState(null, 'nl_v4_examConfig');
  const [examMode, setExamMode] = useSessionState('exam', 'nl_v4_examMode');
  const [questions, setQuestions] = useSessionState([], 'nl_v4_questions');
  const [userAnswers, setUserAnswers] = useSessionState({}, 'nl_v4_userAnswers');
  const [startTime, setStartTime] = useSessionState(null, 'nl_v4_startTime');
  const [analysisData, setAnalysisData] = useSessionState(null, 'nl_v4_analysisData');
  const [activeDashboardTab, setActiveDashboardTab] = useState('fullExam');
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('nl_theme_pref');
      return saved === 'dark' || saved === 'light' ? saved : 'light';
    } catch {
      return 'light';
    }
  });
  const scrollBarRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#09090b' : '#f8fafc');
    }
  }, [theme]);

  useEffect(() => {
    if (currentView === 'aihub') {
      setCurrentView('dashboard');
    }
  }, [currentView, setCurrentView]);

  useEffect(() => {
    let rafId = null;
    const updateScroll = () => {
      rafId = null;
      if (!scrollBarRef.current) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 20 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      scrollBarRef.current.style.transform = `scaleX(${pct / 100})`;
    };
    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [currentView, activeDashboardTab]);

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('nl_theme_pref', next);
      } catch {}
      return next;
    });
  };

  const [categories, setCategories] = useState({ categories: [], tasks: [], clinical_tasks: [], law_tasks: [] });
  const [stats, setStats] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [categoryTasks, setCategoryTasks] = useState({});
  const [years, setYears] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [accountModalState, setAccountModalState] = useState({ open: false, tab: 'profile' });
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledModalData, setScheduledModalData] = useState(null);
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [presenceStats, setPresenceStats] = useState({ online_count: null, registered_members: null });
  const presenceTabKeyRef = useRef(null);
  const presenceVisitorKeyRef = useRef(null);
  const lastPresencePingRef = useRef(0);

  if (!presenceTabKeyRef.current) {
    presenceTabKeyRef.current = getOrCreateClientKey('session', 'nl_presence_tab_v1');
  }
  if (!presenceVisitorKeyRef.current) {
    presenceVisitorKeyRef.current = getOrCreateClientKey('local', 'nl_presence_visitor_v1');
  }

  // Live online presence heartbeat + registered member counter
  useEffect(() => {
    let active = true;

    const sendHeartbeat = async (force = false) => {
      if (!force && document.visibilityState === 'hidden') return;
      const now = Date.now();
      if (!force && now - lastPresencePingRef.current < 10000) return;
      lastPresencePingRef.current = now;

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/presence/ping`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            session_key: presenceTabKeyRef.current,
            visitor_key: presenceVisitorKeyRef.current,
          }),
        });
        if (res.ok && active) {
          const data = await res.json();
          setPresenceStats({
            online_count: typeof data.online_count === 'number' ? data.online_count : null,
            registered_members: typeof data.registered_members === 'number' ? data.registered_members : null,
          });
        }
      } catch {}
    };

    sendHeartbeat(true);
    const intervalId = window.setInterval(() => sendHeartbeat(false), 35000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat(false);
      }
    };
    const onRefreshEvent = () => sendHeartbeat(true);
    const onPageHide = () => {
      try {
        if (navigator.sendBeacon) {
          const payload = new Blob(
            [JSON.stringify({ session_key: presenceTabKeyRef.current })],
            { type: 'application/json' }
          );
          navigator.sendBeacon(`${API_BASE}/api/presence/leave`, payload);
        }
      } catch {}
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('nl-presence-refresh', onRefreshEvent);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('nl-presence-refresh', onRefreshEvent);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [token]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // Compute countdown for sticky header badge (always selects nearest upcoming exam)
  const nextExam = getPrimaryUpcomingExam();
  const nextExamTimeLeft = nextExam?.timing || (nextExam ? calculateTimeRemaining(nextExam.targetDate, nextExam.endDate) : null);

  // Fetch categories and stats on load
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/categories`).then(res => res.json()),
      fetch(`${API_BASE}/api/stats`).then(res => res.json()),
      fetch(`${API_BASE}/api/years`).then(res => res.json()),
    ])
      .then(([catData, statsData, yearsData]) => {
        setCategories(catData);
        setStats(statsData.categories || statsData);
        setTaskStats(statsData.tasks || []);
        setCategoryTasks(statsData.category_tasks || {});
        setYears(yearsData.years_data || []);
      })
      .catch(err => console.error('Failed to load initial data:', err));
  }, []);

  const startExam = async (config) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const isExam = (config.mode === 'exam' || config.examType === 'exam');
    const isMock70 = (!config.source_exam && (config.year === '2570' || config.year === 2570)) || config.targetExamId === 'mock-law-2570';

    // Strict lock: Mock 70 does not allow taking exam or practice before Saturday 13:00
    if (isMock70) {
      const mock70TargetDate = '2026-09-26T13:00:00+07:00';
      const timeLeft = calculateTimeRemaining(mock70TargetDate);
      if (!timeLeft.isExpired) {
        setScheduledModalData({
          examTitle: 'ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ',
          dateText: 'วันเสาร์ที่ 26 กันยายน 2569',
          timeText: '13:00 – 14:00 น. (60 นาที)',
          timeLeft,
          pendingConfig: config
        });
        return;
      }
    }

    if (config.targetDate) {
      const timeLeft = calculateTimeRemaining(config.targetDate);
      if (!timeLeft.isExpired) {
        setScheduledModalData({
          examTitle: config.examTitle || 'การสอบประเมินความรู้ฯ (NL)',
          dateText: config.examDateText || 'ตามกำหนดการจริง',
          timeText: config.examTimeText || '',
          timeLeft,
          pendingConfig: config
        });
        return;
      }
    }

    // If attempting to take clinical parts for year 2570 (which only has Mock 70 Law)
    if (isMock70 && config.part && config.part !== 'law') {
      const timeLeft = calculateTimeRemaining('2026-09-26T13:00:00+07:00');
      setScheduledModalData({
        examTitle: 'ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ (Mock 70)',
        dateText: 'วันเสาร์ที่ 26 กันยายน 2569',
        timeText: '13:00 – 14:00 น. (60 นาที)',
        timeLeft,
        pendingConfig: {
          category: 'กฎหมายและจรรยาบรรณ',
          task: '',
          count: 30,
          year: '2570',
          mode: 'practice',
          ordered: true,
          part: 'law'
        }
      });
      return;
    }

    setExamConfig(config);
    setExamMode(config.examType || config.mode || 'exam');
    setUserAnswers({});
    setAnalysisData(null);
    setStartTime(Date.now());

    setIsLoadingExam(true);
    try {
      let timeLimit = null;

      if (isExam) {
        if (config.part && ['1', '2', '3', '4'].includes(String(config.part))) {
          timeLimit = 105 * 60 * 1000; // 1 hr 45 min = 105 minutes (75 questions)
        } else if (config.part === 'day1' || config.part === 'day2') {
          timeLimit = 210 * 60 * 1000; // 3 hr 30 min = 210 minutes (150 questions)
        } else if (config.part === 'law' || config.category === 'กฎหมายและจรรยาบรรณ') {
          // Real exam duration: 60 minutes (1 hour) for 30 questions (13:00 – 14:00 น.)
          timeLimit = 60 * 60 * 1000;
        } else if (config.clinical_only) {
          timeLimit = 420 * 60 * 1000; // 7 hr (300 questions full exam)
        } else if (config.count) {
          timeLimit = Math.round(config.count * 1.4 * 60 * 1000); // 1.4 min per question for any custom or 'all' count
        }
      }

      if (config.questions) {
        setQuestions(config.questions);
        setExamConfig({ ...config, timeLimit });
        setCurrentView('exam');
      } else {
        let url = `${API_BASE}/api/exam/random?n=` + config.count;
        if (config.category) url += '&category=' + encodeURIComponent(config.category);
        if (config.task)     url += '&task='     + encodeURIComponent(config.task);
        if (config.must_know_topic) url += '&must_know_topic=' + encodeURIComponent(config.must_know_topic);
        if (config.year)     url += '&year='     + encodeURIComponent(config.year);
        if (config.part)     url += '&part='     + encodeURIComponent(config.part);
        if (config.source_exam) url += '&source_exam=' + encodeURIComponent(config.source_exam);
        if (config.ordered)  url += '&ordered=true';
        if (config.clinical_only) url += '&clinical_only=true';

        url += (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
        const res  = await fetch(url, { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } });
        if (res.status === 403 || !res.ok) {
          if (config.year === '2570' || config.year === 2570 || config.targetExamId === 'mock-law-2570') {
            setScheduledModalData({
              examTitle: 'ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ',
              dateText: 'วันเสาร์ที่ 26 กันยายน 2569',
              timeText: '13:00 – 14:00 น. (60 นาที)',
              timeLeft: calculateTimeRemaining('2026-09-26T13:00:00+07:00'),
              pendingConfig: null
            });
            return;
          }
          const errData = await res.json().catch(() => ({}));
          alert(errData.detail || 'เกิดข้อผิดพลาดในการโหลดข้อสอบ');
          return;
        }

        const data = await res.json();
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          if (config.year === '2570' || config.year === 2570 || config.targetExamId === 'mock-law-2570') {
            setScheduledModalData({
              examTitle: 'ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ',
              dateText: 'วันเสาร์ที่ 26 กันยายน 2569',
              timeText: '13:00 – 14:00 น. (60 นาที)',
              timeLeft: calculateTimeRemaining('2026-09-26T13:00:00+07:00'),
              pendingConfig: null
            });
            return;
          }
          let msg = 'ไม่พบข้อสอบที่ตรงตามเงื่อนไขที่เลือก';
          if (config.category && config.year) {
            msg += `\n(สำหรับปี พ.ศ. ${config.year} อาจไม่มีข้อสอบในหมวด "${config.category}")`;
          } else if (config.year) {
            msg += `\n(สำหรับปี พ.ศ. ${config.year})`;
          }
          alert(msg);
          return;
        }

        setQuestions(data);
        setExamConfig({ ...config, timeLimit });
        setCurrentView('exam');
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      alert('Failed to start exam. Make sure backend is running.');
    } finally {
      setIsLoadingExam(false);
    }
  };

  const finishExam = async (answers, duration, questionTimes = {}, confidenceMap = {}) => {
    setUserAnswers(answers);
    setCurrentView('result');

    const durationSec = Math.floor(duration / 1000);
    const timeLimitSec = examConfig?.timeLimit ? Math.floor(examConfig.timeLimit / 1000) : null;

    // If logged in, save session to tracking API
    if (user && token) {
      try {
        let correctCount = 0;
        const mappedAnswers = questions.map(q => {
          const is_correct = q.correct_answer && answers[q.id] === q.correct_answer;
          if (is_correct) correctCount++;
          return {
            question_id: q.id,
            selected_choice: answers[q.id] || null,
            is_correct: !!is_correct,
            time_spent_seconds: questionTimes[q.id] != null ? Math.round(questionTimes[q.id] / 1000) : null,
            confidence: confidenceMap[q.id] || null,
          };
        });

        await authFetch(`${API_BASE}/api/tracking/session`, {
          method: 'POST',
          body: JSON.stringify({
            start_time: Math.floor((Date.now() - duration) / 1000),
            end_time: Math.floor(Date.now() / 1000),
            exam_type: examMode,
            score: correctCount,
            total_questions: questions.length,
            time_limit_seconds: timeLimitSec,
            time_spent_seconds: durationSec,
            answers: mappedAnswers
          })
        });
      } catch (err) {
        console.error('Failed to save session history', err);
      }
    }

    // Immediately fetch analysis from cached DB answers — no wait needed
    try {
      const res = await authFetch(`${API_BASE}/api/analysis`, {
        method: 'POST',
        body: JSON.stringify({
          question_ids: questions.map(q => q.id),
          user_answers: answers,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisData(data);
      }
    } catch (err) {
      console.error('Analysis fetch failed:', err);
    }
  };

  const goHome = () => {
    setCurrentView('dashboard');
    setExamConfig(null);
    setExamMode('exam');
    setQuestions([]);
    setUserAnswers({});
    setStartTime(null);
    setAnalysisData(null);
  };


  const handleHeaderNav = (tabId) => {
    if (tabId === 'law_hub') {
      setCurrentView('law_hub');
      return;
    }
    setCurrentView('dashboard');
    setActiveDashboardTab(tabId);
    setTimeout(() => {
      const el = document.getElementById('workspace-tabs');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  return (
    <>
      {/* ── Top Utility Announcement Strip ──────── */}
      {currentView === 'dashboard' && showAnnouncement && (
        <div className="top-announcement-bar" role="region" aria-label="ประกาศกำหนดการสอบล่าสุด">
          <div className="top-announcement-inner">
            <span className="top-announcement-text">
              <Calendar size={13} style={{ flexShrink: 0, color: 'var(--primary-light)' }} />
              {nextExam && nextExamTimeLeft && !nextExamTimeLeft.isPassed ? (
                <span className="tabular-nums">
                  กำหนดการสอบใกล้ที่สุด: <strong>{nextExam.shortLabel || nextExam.series}</strong> · {nextExam.examDateText} (อีก {nextExamTimeLeft.days} วัน)
                </span>
              ) : (
                <span>ประกาศตารางสอบ ศ.ป.ท. พ.ศ. 2569 – 2570</span>
              )}
            </span>
            <button
              type="button"
              className="top-announcement-pill"
              onClick={() => setIsScheduleModalOpen(true)}
            >
              <span>ดูตารางสอบ</span>
              <ArrowRight size={12} />
            </button>
            <button
              type="button"
              className="top-announcement-close"
              onClick={() => setShowAnnouncement(false)}
              aria-label="ปิดแถบประกาศ"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky Editorial App Header ───────────── */}
      <header className="app-header">
        <div className="app-header-inner">
          <button
            type="button"
            className="app-brand"
            onClick={goHome}
            aria-label="กลับหน้าหลัก NL Dental Treasury"
          >
            <div className="app-brand-emblem" aria-hidden="true">
              <svg
                className="app-brand-svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 3.5c-2.4 0-3.8 1.9-3.8 4.8 0 2.4.9 4.3 1.4 6.7.6 2.7 1.3 5.5 2.5 5.5 1.1 0 1.5-1.9 2.3-3.8.5-1.1 1.1-1.9 2.1-1.9s1.6.8 2.1 1.9c.8 1.9 1.2 3.8 2.3 3.8 1.2 0 1.9-2.8 2.5-5.5.5-2.4 1.4-4.3 1.4-6.7 0-2.9-1.4-4.8-3.8-4.8-1.5 0-2.6.7-4.5.7s-3-.7-4.5-.7z" />
                <path className="brand-enamel-arc" d="M6.8 7.6c.2-1.2 1-2 2.1-2" strokeWidth="1.75" opacity="0.72" />
                <path className="brand-sparkle-node" d="M19.5 1.8v3.4M17.8 3.5h3.4" strokeWidth="1.9" />
              </svg>
            </div>
            <span className="app-brand-wordmark">
              <span className="app-brand-text">
                <span className="app-brand-main">NL Dental</span>
                <span className="app-brand-sub">Treasury</span>
              </span>
              <span className="app-brand-tagline" aria-hidden="true">
                <span className="app-brand-tagline-dot" />
                <span>NATIONAL LICENSE · ศ.ป.ท.</span>
              </span>
            </span>
          </button>

          <nav className="app-header-nav" aria-label="เมนูหลักด้านบน">
            {[
              { id: 'fullExam', label: 'สนามสอบจำลอง' },
              { id: 'practice', label: 'ฝึกซ้อมรายวิชา' },
              { id: 'study_hub', label: 'เลกเชอร์คลินิก' },
              { id: 'law_hub', label: 'สรุปกฎหมาย' },
              { id: 'tos_analytics', label: 'TOS Analytics' },
            ].map(link => {
              const isLinkActive =
                (link.id === 'law_hub' && currentView === 'law_hub') ||
                (currentView === 'dashboard' && activeDashboardTab === link.id);
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleHeaderNav(link.id)}
                  className={`app-header-nav-link ${isLinkActive ? 'active' : ''}`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="app-header-actions">
            {currentView === 'exam' && (
              <button className="btn btn-danger btn-sm" onClick={goHome}>
                <XCircle size={15} /> Abort
              </button>
            )}

            {/* Official Exam Schedule & Countdown Pill */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="theme-toggle-btn header-schedule-btn"
              style={{
                background: 'var(--surface-subtle)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
              title="คลิกเพื่อดูตารางสอบทางการและประกาศ ศ.ป.ท."
            >
              <span
                aria-hidden="true"
                className={nextExamTimeLeft && !nextExamTimeLeft.isPassed ? 'live-status-dot' : undefined}
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: nextExamTimeLeft && !nextExamTimeLeft.isPassed
                    ? (nextExamTimeLeft.days <= 14 ? 'var(--warning)' : 'var(--primary-light)')
                    : 'var(--text-muted)',
                  flexShrink: 0,
                }}
              />
              <span className="header-schedule-label tabular-nums" style={{ fontWeight: 600 }}>
                {nextExam && nextExamTimeLeft && !nextExamTimeLeft.isPassed
                  ? (nextExamTimeLeft.isInProgress
                      ? `กำลังสอบ ${nextExam.shortLabel || nextExam.series}`
                      : `${nextExam.shortLabel || nextExam.series} • ${nextExamTimeLeft.days} วัน`)
                  : 'ผ่านกำหนดการสอบแล้ว'}
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`theme-toggle-btn ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
              title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
              aria-label="Toggle Light and Dark Theme"
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="var(--primary)" />}
              </span>
              <span className="theme-toggle-label">
                {theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}
              </span>
            </button>
            
            {user ? (
              <div className="header-user-wrap">
                <button
                  type="button"
                  className="header-profile-trigger"
                  onClick={() => setAccountModalState({ open: true, tab: 'profile' })}
                  title="เปิดโปรไฟล์และตั้งค่าเป้าหมายการสอบ"
                >
                  <div className="header-profile-avatar">
                    {(user.display_name || user.username || 'U').replace(/^(นทพ\.|ทพ\.|ทพญ\.)\s*/i, '').trim().charAt(0).toUpperCase()}
                  </div>
                  <span className="header-user-name">{user.display_name || user.username}</span>
                </button>
                <button
                  onClick={logout}
                  className="header-icon-btn"
                  title="ออกจากระบบ"
                  aria-label="ออกจากระบบ"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="btn btn-editorial-contrast btn-sm header-auth-btn" onClick={() => setIsAuthModalOpen(true)} style={{ marginLeft: '0.15rem' }}>
                <UserIcon size={14} />
                <span className="header-auth-label">เข้าสู่ระบบ</span>
              </button>
            )}
          </div>
        </div>
        <div className="header-scroll-progress" ref={scrollBarRef} aria-hidden="true" />
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AccountModal
        isOpen={accountModalState.open}
        initialTab={accountModalState.tab}
        onClose={() => setAccountModalState(prev => ({ ...prev, open: false }))}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
      <ExamScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onStartExam={startExam}
        onOpenLawHub={() => setCurrentView('law_hub')}
      />
      <ScheduledExamModal
        data={scheduledModalData}
        onClose={() => setScheduledModalData(null)}
        onOpenLawHub={() => setCurrentView('law_hub')}
      />

      {/* ── Main Content ───────────────────────────── */}
      <main className="container">
        {currentView === 'dashboard' && (
          <Dashboard
            categories={categories}
            stats={stats}
            taskStats={taskStats}
            categoryTasks={categoryTasks}
            years={years}
            activeTab={activeDashboardTab}
            onTabChange={setActiveDashboardTab}
            onStart={startExam}
            onOpenLawHub={() => setCurrentView('law_hub')}
            onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
            onOpenAccountModal={(tab = 'profile') => setAccountModalState({ open: true, tab })}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            presenceStats={presenceStats}
          />
        )}

        {currentView === 'study_hub' && (
          <ClinicalStudyHub
            onBack={goHome}
            onStartExam={startExam}
          />
        )}

        {currentView === 'law_hub' && (
          <LawStudyHub
            onBack={goHome}
            onStartExam={startExam}
          />
        )}

        {currentView === 'exam' && questions.length > 0 && (
          <ExamSession
            questions={questions}
            mode={examConfig.mode}
            config={examConfig}
            startTime={startTime}
            onFinish={finishExam}
            onPracticeTopic={startExam}
          />
        )}

        {currentView === 'exam' && questions.length === 0 && (
          <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.14)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '1rem' }}>
              <AlertCircle size={28} color="var(--warning)" />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>ไม่พบข้อสอบตามเงื่อนไขที่เลือก</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ไม่พบข้อสอบที่ตรงกับตัวกรองที่คุณเลือก (หรือปีที่เลือกอาจไม่มีข้อสอบในหมวดนี้ เช่น ปี 2565 มีเฉพาะข้อสอบคลินิก 4 Parts)
            </p>
            <button className="btn btn-primary" onClick={goHome}>กลับสู่หน้าหลัก (Go Back)</button>
          </div>
        )}

        {isLoadingExam && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 29, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              marginBottom: '1.25rem',
              border: '3px solid rgba(255,255,255,0.15)',
              borderTopColor: 'var(--primary-light)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>กำลังจัดเตรียมชุดข้อสอบ...</h3>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ดึงคำถามและตัวหลังจากคลังข้อสอบ กรุณารอสักครู่
            </p>
          </div>
        )}

        {currentView === 'result' && (
          <ExamResult
            questions={questions}
            userAnswers={userAnswers}
            startTime={startTime}
            analysisData={analysisData}
            onHome={goHome}
            onPracticeTopic={startExam}
          />
        )}

        {currentView !== 'exam' && (
          <footer className="app-community-footer tabular-nums" aria-label="สถานะผู้ใช้งานและสมาชิก">
            <span>NL Dental Treasury</span>
            <span aria-hidden="true">·</span>
            <span className="app-footer-live">
              <span className="community-online-dot" aria-hidden="true" />
              ออนไลน์ตอนนี้ <strong>{presenceStats.online_count !== null ? presenceStats.online_count.toLocaleString() : '—'}</strong> คน
            </span>
            <span aria-hidden="true">·</span>
            <span className="app-footer-members">
              <Users size={13} aria-hidden="true" />
              สมาชิกในระบบ <strong>{presenceStats.registered_members !== null ? presenceStats.registered_members.toLocaleString() : '—'}</strong> คน
            </span>
          </footer>
        )}
      </main>

      {/* ── Mobile Sticky Bottom Navigation (<= 768px, hidden during active exam) ── */}
      {currentView !== 'exam' && (
        <nav className="mobile-bottom-nav" aria-label="เมนูนำทางบนมือถือ">
          <button
            type="button"
            onClick={goHome}
            className={`mobile-bottom-nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>หน้าหลัก</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('study_hub')}
            className={`mobile-bottom-nav-btn ${currentView === 'study_hub' ? 'active' : ''}`}
          >
            <BookOpen size={19} aria-hidden="true" />
            <span>เลกเชอร์</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('law_hub')}
            className={`mobile-bottom-nav-btn ${currentView === 'law_hub' ? 'active' : ''}`}
          >
            <Scale size={19} aria-hidden="true" />
            <span>กฎหมาย</span>
          </button>
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className={`mobile-bottom-nav-btn ${isScheduleModalOpen ? 'active' : ''}`}
          >
            <Calendar size={19} aria-hidden="true" />
            <span>กำหนดสอบ</span>
          </button>
        </nav>
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </ErrorBoundary>
  );
}
