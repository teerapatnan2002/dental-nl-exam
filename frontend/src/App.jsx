import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import ExamSession from './components/ExamSession';
import ExamResult from './components/ExamResult';
import AIHub from './components/AIHub';
import LawStudyHub from './components/LawStudyHub';
import AuthModal from './components/AuthModal';
import ExamScheduleModal from './components/ExamScheduleModal';
import ScheduledExamModal from './components/ScheduledExamModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { XCircle, User as UserIcon, LogOut, Sun, Moon, Scale, Clock } from 'lucide-react';
import { API_BASE } from './config';
import { EXAM_SCHEDULES, calculateTimeRemaining } from './data/examSchedule';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

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

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('nl_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('nl_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const [categories, setCategories] = useState({ categories: [], tasks: [], clinical_tasks: [], law_tasks: [] });
  const [stats, setStats] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [categoryTasks, setCategoryTasks] = useState({});
  const [years, setYears] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledModalData, setScheduledModalData] = useState(null);
  const [isLoadingExam, setIsLoadingExam] = useState(false);

  // Compute countdown for sticky header badge (Law 3/2569)
  const nextExam = EXAM_SCHEDULES[0];
  const nextExamTimeLeft = calculateTimeRemaining(nextExam.targetDate);

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
    const isMock70 = (config.year === '2570' || config.year === 2570 || config.targetExamId === 'mock-law-2570');

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
        if (config.year)     url += '&year='     + encodeURIComponent(config.year);
        if (config.part)     url += '&part='     + encodeURIComponent(config.part);
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

  const finishExam = async (answers, duration, questionTimes = {}) => {
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

  const startMockTest = (newQuestions) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setExamConfig({ mode: 'practice', count: newQuestions.length });
    setExamMode('practice');
    setUserAnswers({});
    setAnalysisData(null);
    setStartTime(Date.now());
    setQuestions(newQuestions);
    setCurrentView('exam');
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


  return (
    <>
      {/* ── Sticky App Header ──────────────────────── */}
      <header className="app-header">
        <div className="app-brand" onClick={goHome}>
          <div className="app-brand-icon">🦷</div>
          <span>NL Dental</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentView !== 'dashboard' && currentView !== 'aihub' && currentView !== 'law_hub' && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'none' }}></span>
          )}
          {currentView === 'exam' && (
            <button className="btn btn-danger btn-sm" onClick={goHome}>
              <XCircle size={15} /> Abort
            </button>
          )}

          {/* Official Exam Schedule & Countdown Pill */}
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="theme-toggle-btn"
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              color: '#f43f5e',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              cursor: 'pointer'
            }}
            title="คลิกเพื่อดูตารางสอบทางการและประกาศ ศ.ป.ท."
          >
            <Clock size={15} color="#f43f5e" />
            <span className="theme-toggle-label" style={{ fontWeight: 600 }}>
              {nextExamTimeLeft && !nextExamTimeLeft.isExpired ? `สอบกฎหมาย: อีก ${nextExamTimeLeft.days} วัน` : 'ตารางสอบ ศ.ป.ท.'}
            </span>
          </button>

          {/* Law Study Hub Quick Access Button */}
          <button
            onClick={() => setCurrentView('law_hub')}
            className="theme-toggle-btn"
            style={{
              background: currentView === 'law_hub' ? 'var(--primary)' : 'rgba(124, 58, 237, 0.12)',
              color: currentView === 'law_hub' ? '#fff' : 'var(--primary-light)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              cursor: 'pointer'
            }}
            title="สรุปกฎหมายทันตกรรม, ผังมโนทัศน์ & Flashcards"
          >
            <Scale size={15} color={currentView === 'law_hub' ? '#fff' : 'var(--primary-light)'} />
            <span className="theme-toggle-label" style={{ fontWeight: 600 }}>สรุปกฎหมาย</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง (Clinical Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Midnight Dark Mode)'}
            aria-label="Toggle Light and Dark Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} color="#f59e0b" />
                <span className="theme-toggle-label">โหมดสว่าง</span>
              </>
            ) : (
              <>
                <Moon size={15} color="var(--primary)" />
                <span className="theme-toggle-label">โหมดมืด</span>
              </>
            )}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
              </div>
              <button 
                onClick={logout}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                title="ออกจากระบบ"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setIsAuthModalOpen(true)} style={{ marginLeft: '0.5rem' }}>
              <UserIcon size={14} /> เข้าสู่ระบบ
            </button>
          )}
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
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
            onStart={startExam}
            onOpenLawHub={() => setCurrentView('law_hub')}
            onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
            onOpenAIHub={() => {
              if (!user) {
                setIsAuthModalOpen(true);
                return;
              }
              setCurrentView('aihub');
            }}
          />
        )}

        {currentView === 'law_hub' && (
          <LawStudyHub
            onBack={goHome}
            onStartExam={startExam}
          />
        )}

        {currentView === 'aihub' && (
          <AIHub
            categories={categories.categories}
            tasks={categories.tasks}
            onStartMockTest={startMockTest}
            onBack={goHome}
          />
        )}

        {currentView === 'exam' && questions.length > 0 && (
          <ExamSession
            questions={questions}
            mode={examConfig.mode}
            config={examConfig}
            startTime={startTime}
            onFinish={finishExam}
          />
        )}

        {currentView === 'exam' && questions.length === 0 && (
          <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
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
          />
        )}
      </main>
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
