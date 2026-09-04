import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import ExamSession from './components/ExamSession';
import ExamResult from './components/ExamResult';
import AIHub from './components/AIHub';
import LawStudyHub from './components/LawStudyHub';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { XCircle, User as UserIcon, LogOut, Sun, Moon, Scale } from 'lucide-react';
import { API_BASE } from './config';

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

  const [categories, setCategories] = useState({ categories: [], tasks: [] });
  const [stats, setStats] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [years, setYears] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        setYears(yearsData.years_data || []);
      })
      .catch(err => console.error('Failed to load initial data:', err));
  }, []);

  const startExam = async (config) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setExamConfig(config);
    setExamMode(config.examType || config.mode || 'exam');
    setUserAnswers({});
    setAnalysisData(null);
    setStartTime(Date.now());

    try {
      let timeLimit = null;
      const isExam = (config.mode === 'exam' || config.examType === 'exam');

      if (isExam) {
        if (config.part && ['1', '2', '3', '4'].includes(String(config.part))) {
          timeLimit = 105 * 60 * 1000; // 1 hr 45 min = 105 minutes (75 questions)
        } else if (config.part === 'day1' || config.part === 'day2') {
          timeLimit = 210 * 60 * 1000; // 3 hr 30 min = 210 minutes (150 questions)
        } else if (config.part === 'law' || config.category === 'กฎหมายและจรรยาบรรณ') {
          timeLimit = 60 * 60 * 1000; // 1 hr = 60 minutes
        } else if (config.clinical_only) {
          timeLimit = 420 * 60 * 1000; // 7 hr (300 questions full exam)
        } else if (config.count && config.count <= 30) {
          timeLimit = Math.round(config.count * 1.4 * 60 * 1000); // 1.4 min per question
        }
      }

      if (config.questions) {
        setQuestions(config.questions);
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
        const data = await res.json();
        setQuestions(data);
      }
      setExamConfig({ ...config, timeLimit });
      setCurrentView('exam');
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      alert('Failed to start exam. Make sure backend is running.');
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

      {/* ── Main Content ───────────────────────────── */}
      <main className="container">
        {currentView === 'dashboard' && (
          <Dashboard
            categories={categories}
            stats={stats}
            taskStats={taskStats}
            years={years}
            onStart={startExam}
            onOpenLawHub={() => setCurrentView('law_hub')}
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
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Loading questions...</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              If this takes too long, there might not be enough questions matching your criteria.
            </p>
            <button className="btn btn-secondary" onClick={goHome}>Go Back</button>
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
      </AuthProvider>
    </ErrorBoundary>
  );
}
