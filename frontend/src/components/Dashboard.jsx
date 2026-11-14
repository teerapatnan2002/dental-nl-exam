import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, PlayCircle, ShieldAlert, Brain,
  Stethoscope, ChevronDown, ChevronUp, Sparkles, Settings2,
  Target, GraduationCap, Wrench, Clock, AlertTriangle, User as UserIcon, Activity, Trophy,
  Search, BookmarkCheck, ShieldCheck, MoreHorizontal, ChevronRight, Calendar, Flame, Lock,
  Zap, RotateCcw, Scale, BarChart3, Bookmark, Layers, FileText, CheckCircle2, ArrowRight, Calculator
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';
import Leaderboard from './Leaderboard';
import SearchPanel from './SearchPanel';
import BookmarksPanel from './BookmarksPanel';
import AdminPanel from './AdminPanel';
import MyReports from './MyReports';
import CategoryDetailModal from './CategoryDetailModal';
import ExamCountdown from './ExamCountdown';
import TOSAnalytics from './TOSAnalytics';
import ClinicalStudyHub from './ClinicalStudyHub';
import { calculateTimeRemaining, formatElapsedSinceExam } from '../data/examSchedule';

const lawCategoryName = 'กฎหมายและจรรยาบรรณ';

export default function Dashboard({ categories, stats, taskStats, categoryTasks = {}, years, onStart, onOpenAIHub, onOpenLawHub, onOpenScheduleModal }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('fullExam');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedYear, setSelectedYear] = useState('');
  const [customYear, setCustomYear] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [launchingDailyFix, setLaunchingDailyFix] = useState(false);
  const [studyHubLaunch, setStudyHubLaunch] = useState({
    topicId: null,
    classroomTab: 'synthesized',
    hubMode: 'exam_topics',
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeCategoryModal, setActiveCategoryModal] = useState(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [expandedDsatSet, setExpandedDsatSet] = useState(null);
  const dropdownRef = useRef(null);

  // Live countdown to Saturday Mock 70 Exam (26 Sep 2026, 13:00)
  const [mock70TimeLeft, setMock70TimeLeft] = useState(() => calculateTimeRemaining('2026-09-26T13:00:00+07:00', '2026-09-26T14:00:00+07:00'));

  useEffect(() => {
    const timer = setInterval(() => {
      setMock70TimeLeft(calculateTimeRemaining('2026-09-26T13:00:00+07:00', '2026-09-26T14:00:00+07:00'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCategoryExpand = (catName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const isLaw = cat === lawCategoryName;
    const clinicalTasks = categories.clinical_tasks || [
      "การวินิจฉัยโรค",
      "การจัดการและการรักษาผู้ป่วย",
      "ขั้นตอนและวิธีการรักษา",
      "การเกิดและการดำเนินโรค",
      "การสร้างเสริมสุขภาพและการป้องกัน"
    ];
    const lawTasks = categories.law_tasks || [
      "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
      "จรรยาบรรณแห่งวิชาชีพทันตกรรม",
      "พ.ร.บ. สถานพยาบาล พ.ศ. 2541",
      "กฎหมายอื่นๆ ที่เกี่ยวข้อง"
    ];
    if (isLaw && clinicalTasks.includes(selectedTask)) {
      setSelectedTask('');
    } else if (cat && !isLaw && lawTasks.includes(selectedTask)) {
      setSelectedTask('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeTab === 'mystats' && token) {
      fetch(`${API_BASE}/api/tracking/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUserStats(data))
      .catch(err => console.error(err));
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/api/tracking/review-due`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setReviewData(data))
      .catch(err => console.error(err));

      fetch(`${API_BASE}/api/tracking/daily-plan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (data) setDailyPlan(data); })
      .catch(err => console.error(err));
    } else {
      setDailyPlan(null);
    }
  }, [token]);

  const handleStart = (category = '', task = '', count = 10, mode = 'exam', ordered = false, clinical_only = false, part = '', year = undefined) => {
    if (typeof category === 'object' && category !== null) {
      onStart({
        year: selectedYear,
        ...category
      });
      return;
    }
    onStart({ category, task, count, mode, year: year !== undefined ? year : selectedYear, ordered, clinical_only, part });
  };

  const handleStartReview = () => {
    if (reviewData && reviewData.questions && reviewData.questions.length > 0) {
      onStart({
        mode: 'practice',
        questions: reviewData.questions,
        count: reviewData.questions.length
      });
    }
  };

  // Start a practice session from an arbitrary set of questions (search results / bookmarks)
  const handleStartPracticeQuestions = (questionSet) => {
    if (questionSet && questionSet.length > 0) {
      onStart({
        mode: 'practice',
        questions: questionSet,
        count: questionSet.length
      });
    }
  };

  const handleOpenStudyTopic = (topicId, classroomTab = 'synthesized', hubMode = 'exam_topics') => {
    setStudyHubLaunch({
      topicId: topicId || null,
      classroomTab: classroomTab || 'synthesized',
      hubMode: hubMode || 'exam_topics',
    });
    setActiveTab('study_hub');
  };

  const handleStartQuestionIds = async (questionIds) => {
    if (!questionIds || questionIds.length === 0) return;
    try {
      setLaunchingDailyFix(true);
      const res = await fetch(`${API_BASE}/api/questions/by-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_ids: questionIds }),
      });
      if (res.ok) {
        const qs = await res.json();
        handleStartPracticeQuestions(qs);
      }
    } catch (err) {
      console.error('Failed to launch daily weak-topic quiz:', err);
    } finally {
      setLaunchingDailyFix(false);
    }
  };

  const lawStats = stats.find(s => s.category === lawCategoryName);
  const clinicalStats = stats.filter(s => s.category && s.category !== lawCategoryName);
  const totalClinical = clinicalStats.reduce((acc, cur) => acc + cur.count, 0);
  const totalLaw = lawStats ? lawStats.count : 0;
  const totalQuestions = totalClinical + totalLaw;

  const selectedYearData = selectedYear ? years.find(y => y.year === selectedYear) : null;

  const mainTabs = [
    { id: 'fullExam', label: 'สนามสอบจำลอง', Icon: Target },
    { id: 'practice', label: 'ฝึกซ้อมรายวิชา', Icon: BookOpen },
    { id: 'study_hub', label: 'เลกเชอร์คลินิก', Icon: GraduationCap },
    { id: 'law_hub', label: 'สรุปกฎหมาย', Icon: Scale },
    { id: 'custom', label: 'จัดชุดสอบเอง', Icon: Settings2 },
  ];

  // Utility dropdown holds only tools, analytics & account views (no overlap with mainTabs)
  const toolsGroup = [
    { id: 'calc_lab_tool', label: 'Calc Lab คำนวณคลินิก', desc: 'สุ่มฝึก MRD ยาชา, ฟลูออไรด์ PTD, สถิติ 2×2, CAL & จัดฟัน', Icon: Calculator },
    { id: 'cloze_arena_tool', label: 'Cloze & กับดักข้อสอบ', desc: 'ฝึกเติมตัวเลข-กฎหมาย จับไต๋ตัวลวง + จับเวลา 25 วิ & SM-2', Icon: Zap },
    { id: 'aihub', label: 'AI Hub ติวเตอร์', desc: 'ระบบวิเคราะห์จุดอ่อนเชิงลึกและวางแผนทบทวนเฉพาะบุคคล', Icon: Brain },
    { id: 'search', label: 'ค้นหาข้อสอบ', desc: 'ค้นหาโจทย์ตามคำค้นหา ชื่อโรค หรือเลขมาตรา', Icon: Search },
    { id: 'tos_analytics', label: 'TOS Analytics', desc: 'เปรียบเทียบสัดส่วนข้อสอบจริงกับเกณฑ์ ศ.ป.ท. 2563', Icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', desc: 'ดูอันดับคะแนนสะสมและสถิติรวมผู้เข้าฝึกซ้อม', Icon: Trophy },
  ];

  const personalGroup = user ? [
    { id: 'bookmarks', label: 'บุ๊กมาร์กของฉัน', desc: 'ข้อสอบที่บันทึกไว้ทบทวน', Icon: Bookmark },
    { id: 'mystats', label: 'สถิติของฉัน', desc: 'ประวัติและวิเคราะห์จุดอ่อน', Icon: Activity },
    { id: 'myreports', label: 'ประวัติแจ้งปัญหา', desc: 'ติดตามสถานะการแจ้งข้อสอบ', Icon: AlertTriangle },
  ] : [];

  const adminGroup = (user && user.role === 'admin') ? [
    { id: 'admin', label: 'Admin Panel', desc: 'จัดการข้อสอบและรายงานปัญหา', Icon: ShieldCheck },
  ] : [];

  const allMoreTabs = [...toolsGroup, ...personalGroup, ...adminGroup];
  const activeMoreTab = allMoreTabs.find(t => t.id === activeTab);
  const isMoreActive = Boolean(activeMoreTab);

  return (
    <div className="animate-fade-in">

      {/* ── Top Command Overview Grid (Clinical Editorial Header + Countdown) ── */}
      <div className="dashboard-overview-grid">
        <div className="hero-section glass-panel">
          <div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.09em',
              color: 'var(--primary-light)',
              textTransform: 'uppercase',
              marginBottom: '0.45rem'
            }}>
              Thai Dental National License
            </div>
            <h1 style={{
              fontSize: 'clamp(1.45rem, 2.5vw, 1.85rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: '0.45rem',
              lineHeight: 1.2
            }}>
              NL Dental Treasury
            </h1>
            <p style={{
              color: 'var(--text-sub)',
              fontSize: '0.88rem',
              maxWidth: '460px',
              lineHeight: 1.55,
              margin: 0
            }}>
              ระบบเตรียมสอบใบประกอบวิชาชีพทันตกรรม (ศ.ป.ท.) ครอบคลุมข้อสอบจริง ชุดจำลอง และสรุปกฎหมายทันตแพทยสภา
            </p>
            {reviewData && reviewData.count > 0 && (
              <div style={{ marginTop: '0.9rem' }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={handleStartReview}
                  style={{
                    background: 'rgba(245, 158, 11, 0.14)',
                    color: 'var(--ink-amber)',
                    border: '1px solid rgba(245, 158, 11, 0.32)',
                    fontWeight: 600
                  }}
                >
                  <RotateCcw size={14} /> ทบทวนข้อที่เคยทำผิด ({reviewData.count} ข้อ)
                </button>
              </div>
            )}
          </div>

          <div className="hero-kpi-grid">
            <div className="hero-kpi-item">
              <div className="hero-kpi-value">{totalQuestions.toLocaleString()}</div>
              <div className="hero-kpi-label">ข้อสอบทั้งหมด</div>
            </div>
            <div className="hero-kpi-item">
              <div className="hero-kpi-value" style={{ color: 'var(--primary-light)' }}>{totalClinical.toLocaleString()}</div>
              <div className="hero-kpi-label">ทฤษฎีคลินิก</div>
            </div>
            <div className="hero-kpi-item">
              <div className="hero-kpi-value">{totalLaw.toLocaleString()}</div>
              <div className="hero-kpi-label">กฎหมายวิชาชีพ</div>
            </div>
          </div>
        </div>

      {/* ── Official Exam Countdown Banner ────────────── */}
      <ExamCountdown
        onStartExam={handleStart}
        onOpenLawHub={onOpenLawHub}
        onOpenScheduleModal={onOpenScheduleModal}
      />
      </div>

      {/* ── Today's Study Queue (Daily Adaptive Mission) ── */}
      {user && dailyPlan && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
            padding: '1.2rem 1.35rem',
            borderLeft: '3px solid var(--primary)',
            background: 'var(--bg-panel)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.15rem' }}>
                Adaptive Daily Queue
              </div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text)' }}>
                <Target size={16} color="var(--primary-light)" /> ภารกิจทบทวนวันนี้ (Today&apos;s Study Plan)
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="tabular-nums" style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                ทำวันนี้: <strong style={{ color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>{dailyPlan.answered_today}</strong> / {dailyPlan.daily_target_questions} ข้อ
              </div>
              {dailyPlan.readiness_summary?.unique_answered > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('tos_analytics')}
                  className="btn btn-secondary btn-sm tabular-nums"
                  style={{ fontSize: '0.76rem', padding: '0.32rem 0.7rem' }}
                >
                  <BarChart3 size={13} /> Readiness TOS: <strong>{dailyPlan.readiness_summary.weighted_accuracy_pct}%</strong>
                </button>
              )}
            </div>
          </div>

          <div style={{ height: '5px', background: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.9rem' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.round((dailyPlan.answered_today / Math.max(1, dailyPlan.daily_target_questions)) * 100))}%`,
              background: 'var(--primary)',
              transition: 'width 0.35s ease',
            }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 235px), 1fr))', gap: '0.8rem' }}>
            <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.55rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-amber)', fontWeight: 700, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <RotateCcw size={12} /> Spaced Repetition (SM-2)
                </div>
                <div className="tabular-nums" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                  ข้อสอบถึงกำหนด {dailyPlan.due_questions_count} ข้อ
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>คัดเฉพาะข้อที่เคยพลาดหรือตอบแบบไม่มั่นใจ</div>
              </div>
              {dailyPlan.due_questions_count > 0 && reviewData?.questions?.length > 0 ? (
                <button type="button" onClick={handleStartReview} className="btn btn-sm" style={{ background: 'rgba(245, 158, 11, 0.14)', color: 'var(--ink-amber)', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 600 }}>
                  <RotateCcw size={13} /> ทบทวนเลย ({Math.min(20, dailyPlan.due_questions_count)} ข้อ)
                </button>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--ink-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={13} /> เคลียร์ข้อสอบค้างทวนครบแล้ว
                </span>
              )}
            </div>

            <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.55rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-sky)', fontWeight: 700, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={12} /> Active Recall Flashcards
                </div>
                <div className="tabular-nums" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                  การ์ดถึงกำหนด {dailyPlan.due_flashcards_count} ใบ
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ซิงค์วันทบทวนบนบัญชีของคุณอัตโนมัติ</div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenStudyTopic(dailyPlan.recommended_weak_topic?.topic_id || 'Endo-Pulp-Periapical-Diagnosis', 'flashcards', 'exam_topics')}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 600 }}
              >
                <Layers size={13} /> เปิดโหมด Flashcards SM-2
              </button>
            </div>

            {dailyPlan.recommended_weak_topic && (
              <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.55rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 700, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Target size={12} /> จุดอ่อนคุ้มคะแนนสุดวันนี้
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>
                    {dailyPlan.recommended_weak_topic.title_th}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {dailyPlan.recommended_weak_topic.reason_th}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {dailyPlan.recommended_weak_topic.question_ids?.length > 0 && (
                    <button
                      type="button"
                      disabled={launchingDailyFix}
                      onClick={() => handleStartQuestionIds(dailyPlan.recommended_weak_topic.question_ids)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, fontSize: '0.76rem' }}
                    >
                      <Zap size={13} /> {launchingDailyFix ? 'กำลังโหลด...' : 'ติวชุดซ่อม'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenStudyTopic(dailyPlan.recommended_weak_topic.topic_id, 'synthesized', 'exam_topics')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.76rem' }}
                  >
                    <BookOpen size={13} /> เรียนบทนี้
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Grouped Tab Bar with Dropdown ─────────────── */}
      <div className="dashboard-tab-bar" role="tablist" aria-label="Main Navigation">
        {mainTabs.map(tab => {
          const TabIcon = tab.Icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`dashboard-tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                if (tab.id === 'aihub') {
                  onOpenAIHub();
                } else if (tab.id === 'law_hub') {
                  if (onOpenLawHub) onOpenLawHub();
                } else {
                  setActiveTab(tab.id);
                  setMoreMenuOpen(false);
                }
              }}
            >
              <span className="dashboard-tab-emoji" aria-hidden="true">
                <TabIcon size={15} />
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Dropdown Menu for Extra & Personal Features */}
        <div className="tab-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`dashboard-tab-item ${isMoreActive ? 'active' : ''}`}
            style={{ width: '100%', justifyContent: 'space-between' }}
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            aria-expanded={moreMenuOpen}
            aria-haspopup="true"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
              <span className="dashboard-tab-emoji" aria-hidden="true">
                {activeMoreTab ? <activeMoreTab.Icon size={15} /> : <Wrench size={15} />}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeMoreTab ? activeMoreTab.label : 'เครื่องมือ & สถิติ'}
              </span>
            </div>
            {moreMenuOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {moreMenuOpen && (
            <div className="tab-dropdown-menu" role="menu">
              {/* Group 1: Tools & Community */}
              <div className="tab-dropdown-section-title">เครื่องมือ & สถิติ</div>
              {toolsGroup.map(item => {
                const ItemIcon = item.Icon;
                return (
                  <button
                    key={item.id}
                    role="menuitem"
                    className={`tab-dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => {
                      if (item.id === 'aihub') {
                        if (onOpenAIHub) onOpenAIHub();
                        setMoreMenuOpen(false);
                        return;
                      }
                      if (item.id === 'calc_lab_tool') {
                        handleOpenStudyTopic(null, 'synthesized', 'calc_lab');
                        setMoreMenuOpen(false);
                        return;
                      }
                      if (item.id === 'cloze_arena_tool') {
                        handleOpenStudyTopic(null, 'synthesized', 'cloze_arena');
                        setMoreMenuOpen(false);
                        return;
                      }
                      setActiveTab(item.id);
                      setMoreMenuOpen(false);
                    }}
                  >
                    <span className="tab-dropdown-item-icon" aria-hidden="true">
                      <ItemIcon size={16} />
                    </span>
                    <div className="tab-dropdown-item-info">
                      <span className="tab-dropdown-item-label">{item.label}</span>
                      <span className="tab-dropdown-item-desc">{item.desc}</span>
                    </div>
                  </button>
                );
              })}

              {/* Group 2: Personal */}
              {personalGroup.length > 0 && (
                <>
                  <div className="tab-dropdown-divider" />
                  <div className="tab-dropdown-section-title">ข้อมูลของฉัน</div>
                  {personalGroup.map(item => {
                    const ItemIcon = item.Icon;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        className={`tab-dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMoreMenuOpen(false);
                        }}
                      >
                        <span className="tab-dropdown-item-icon" aria-hidden="true">
                          <ItemIcon size={16} />
                        </span>
                        <div className="tab-dropdown-item-info">
                          <span className="tab-dropdown-item-label">{item.label}</span>
                          <span className="tab-dropdown-item-desc">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}

              {/* Group 3: Admin */}
              {adminGroup.length > 0 && (
                <>
                  <div className="tab-dropdown-divider" />
                  <div className="tab-dropdown-section-title">ผู้ดูแลระบบ</div>
                  {adminGroup.map(item => {
                    const ItemIcon = item.Icon;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        className={`tab-dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMoreMenuOpen(false);
                        }}
                      >
                        <span className="tab-dropdown-item-icon" aria-hidden="true">
                          <ItemIcon size={16} />
                        </span>
                        <div className="tab-dropdown-item-info">
                          <span className="tab-dropdown-item-label">{item.label}</span>
                          <span className="tab-dropdown-item-desc">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
         TAB: Clinical Masterclass & Study Hub (คลังบทเรียนเจาะลึก)
      ════════════════════════════════════════════════ */}
      {activeTab === 'study_hub' && (
        <div className="animate-fade-in">
          <ClinicalStudyHub
            onStartExam={handleStart}
            initialTopicId={studyHubLaunch.topicId}
            initialClassroomTab={studyHubLaunch.classroomTab}
            initialHubMode={studyHubLaunch.hubMode}
          />
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB: TOS Analytics & Blueprint Benchmark
      ════════════════════════════════════════════════ */}
      {activeTab === 'tos_analytics' && (
        <div className="animate-fade-in">
          <TOSAnalytics
            onStartPractice={handleStartPracticeQuestions}
            onOpenTopic={(topicId) => handleOpenStudyTopic(topicId, 'synthesized', 'exam_topics')}
          />
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB: ค้นหาข้อสอบ (Full-text Search)
      ════════════════════════════════════════════════ */}
      {activeTab === 'search' && (
        <div className="animate-fade-in">
          <SearchPanel
            categories={categories.categories}
            onStartPractice={handleStartPracticeQuestions}
          />
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB: บุ๊กมาร์กของฉัน
      ════════════════════════════════════════════════ */}
      {activeTab === 'bookmarks' && user && (
        <div className="animate-fade-in">
          <BookmarksPanel onStartPractice={handleStartPracticeQuestions} />
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB: Admin (รายการแจ้งปัญหา)
      ════════════════════════════════════════════════ */}
      {activeTab === 'admin' && user && user.role === 'admin' && (
        <div className="animate-fade-in">
          <AdminPanel />
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB: ประวัติการแจ้งปัญหาของฉัน
      ════════════════════════════════════════════════ */}
      {activeTab === 'myreports' && user && (
        <div className="animate-fade-in">
          <MyReports />
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB 1: สอบจัดเต็ม (Full Exam Mode)
      ════════════════════════════════════════════════ */}
      {activeTab === 'fullExam' && (
        <div className="animate-fade-in">

          {/* Year Filter */}
          <div className="glass-panel" style={{ marginBottom: '1.25rem', padding: '1.15rem 1.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="var(--primary-light)" />
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>เลือกปีหรือชุดข้อสอบจำลอง</span>
              </div>
              {selectedYear !== '' && (
                <button
                  type="button"
                  onClick={() => setSelectedYear('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: '0.2rem 0.4rem'
                  }}
                >
                  ดูภาพรวมทั้งหมด
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`exam-year-pill ${selectedYear === '' ? 'active' : ''}`}
                onClick={() => setSelectedYear('')}
              >
                <Layers size={13} /> ทั้งหมด
              </button>
              {years && years.map(yData => {
                const isActive = selectedYear === yData.year;
                const YearIcon = yData.year === '2570' ? Target : yData.year === '2569' ? Scale : Calendar;
                return (
                  <button
                    key={yData.year}
                    type="button"
                    className={`exam-year-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedYear(yData.year)}
                  >
                    <YearIcon size={13} />
                    <span>
                      {yData.year === '2570' ? 'พ.ศ. 2570 (Mock 70)' : yData.year === '2569' ? 'DSAT Mock Law (4 ชุด)' : `พ.ศ. ${yData.year}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year Insights & Action Buttons */}
          {selectedYearData ? (
            selectedYearData.year === '2570' ? (
              <div className="special-exam-panel animate-fade-in">
                {/* ── Mock 70 Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.28rem 0.65rem',
                      borderRadius: '6px',
                      background: mock70TimeLeft.isPassed
                        ? 'rgba(16, 185, 129, 0.12)'
                        : 'rgba(13, 148, 136, 0.12)',
                      border: '1px solid ' + (mock70TimeLeft.isPassed ? 'rgba(16, 185, 129, 0.28)' : 'rgba(13, 148, 136, 0.28)'),
                      color: mock70TimeLeft.isPassed ? 'var(--ink-emerald)' : 'var(--primary-light)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      marginBottom: '0.55rem'
                    }}>
                      {mock70TimeLeft.isPassed ? <Clock size={13} /> : (mock70TimeLeft.isExpired ? <Flame size={13} /> : <Lock size={13} />)}
                      {mock70TimeLeft.isPassed
                        ? `ผ่านกำหนดการสอบมาแล้ว (${formatElapsedSinceExam(mock70TimeLeft)}) • เปิดทำย้อนหลังได้`
                        : (mock70TimeLeft.isExpired ? 'เปิดห้องสอบแล้ว' : 'ล็อคระบบ • รอเปิดสอบพร้อมกัน')}
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text)', letterSpacing: '-0.02em', wordBreak: 'break-word', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Target size={20} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                      <span>ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ</span>
                    </h2>
                    <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', maxWidth: '680px', lineHeight: 1.55, wordBreak: 'break-word' }}>
                      ชุดข้อสอบจำลองเสมือนจริง <strong>30 ข้อ (10 STEM สถานการณ์คลินิก × 3 ข้อย่อย)</strong> กำหนดสอบเดิมวันเสาร์ที่ 26 ก.ย. 69 เวลา 13:00 – 14:00 น. {mock70TimeLeft.isPassed ? 'ปัจจุบันสามารถเข้าสอบย้อนหลังและฝึกซ้อมได้ทันที' : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                    <span className="tabular-nums" style={{ fontSize: '0.8rem', padding: '0.32rem 0.7rem', borderRadius: '6px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {mock70TimeLeft.isExpired ? '30 ข้อ • 60 นาที' : '30 ข้อ (ล็อค)'}
                    </span>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      เกณฑ์ผ่าน: 60% (18/30 ข้อ)
                    </div>
                  </div>
                </div>

                {/* ── Schedule & Status Banner ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  background: 'var(--surface-subtle)',
                  padding: 'clamp(0.85rem, 2.2vw, 1.15rem)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  {/* Schedule Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', justifyContent: 'center', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary-light)', fontWeight: 700, fontSize: '0.88rem', flexWrap: 'wrap' }}>
                      <Calendar size={15} style={{ flexShrink: 0 }} /> กำหนดการสอบ (ตามตารางจริง ศ.ป.ท.)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem', fontSize: '0.84rem', color: 'var(--text)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-muted)', width: '82px', flexShrink: 0 }}>วันที่สอบ:</span>
                        <strong>วันเสาร์ที่ 26 กันยายน 2569</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-muted)', width: '82px', flexShrink: 0 }}>เวลาสอบ:</span>
                        <strong className="tabular-nums" style={{ color: 'var(--primary-light)' }}>13:00 – 14:00 น.</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-muted)', width: '82px', flexShrink: 0 }}>ระยะเวลา:</span>
                        <span><strong>60 นาที</strong> (1 ชั่วโมงเต็มตามเวลาสอบจริง)</span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown / Elapsed Box */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                    minWidth: 0,
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: mock70TimeLeft.isPassed ? 'var(--ink-amber)' : 'var(--primary-light)', fontWeight: 700, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {mock70TimeLeft.isPassed
                        ? <><Clock size={13} /> ผ่านกำหนดการสอบมาแล้ว</>
                        : mock70TimeLeft.isExpired
                          ? <><Clock size={13} /> กำลังดำเนินการสอบอยู่</>
                          : <><Lock size={13} /> นับถอยหลังสู่เวลาเปิดสอบ</>}
                    </div>
                    {mock70TimeLeft.isPassed ? (
                      <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', width: '100%', boxSizing: 'border-box' }}>
                        <div className="tabular-nums" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                          {formatElapsedSinceExam(mock70TimeLeft)}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          กำหนดสอบเดิม: 26 ก.ย. 2569 (13:00–14:00 น.) • เปิดทำข้อสอบย้อนหลังแล้ว
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="tabular-nums" style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', margin: '0.2rem 0', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {[
                            { val: mock70TimeLeft.days, unit: 'วัน' },
                            { val: mock70TimeLeft.hours, unit: 'ชม.' },
                            { val: mock70TimeLeft.minutes, unit: 'นาที' },
                            { val: mock70TimeLeft.seconds, unit: 'วินาที', accent: true },
                          ].map((seg, i) => (
                            <React.Fragment key={seg.unit}>
                              {i > 0 && <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>:</span>}
                              <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', padding: '0.32rem 0.45rem', borderRadius: '8px', minWidth: '38px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: seg.accent ? 'var(--primary-light)' : 'var(--text)', fontFamily: 'var(--font-mono)' }}>{String(seg.val).padStart(2, '0')}</div>
                                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{seg.unit}</div>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                          เปิดระบบสอบ: วันเสาร์ที่ 26 ก.ย. 2569 เวลา 13:00 น.
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Main Action Buttons Grid (3 Clean Responsive Cards) ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                  gap: '0.85rem',
                  marginBottom: '1.75rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  {/* 1. Real Exam Simulation Mode */}
                  <button
                    type="button"
                    onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 30, 'exam', true, false, 'law', '2570')}
                    className={`mock-action-card ${mock70TimeLeft.isExpired ? 'mock-action-card--primary' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.96rem', minWidth: 0, wordBreak: 'break-word' }}>
                        {mock70TimeLeft.isExpired ? <PlayCircle size={17} style={{ flexShrink: 0 }} /> : <Lock size={17} style={{ flexShrink: 0 }} />}
                        <span>{mock70TimeLeft.isExpired ? 'เข้าสอบจำลองเสมือนจริง (Exam Mode)' : 'เข้าห้องสอบ Mock Test 70'}</span>
                      </div>
                      <span style={{ background: mock70TimeLeft.isExpired ? 'rgba(255,255,255,0.2)' : 'var(--bg-panel)', color: mock70TimeLeft.isExpired ? '#fff' : 'var(--text-muted)', padding: '0.12rem 0.48rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {mock70TimeLeft.isExpired ? '60 นาที' : 'รอเปิดเสาร์นี้'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: mock70TimeLeft.isExpired ? 'rgba(255,255,255,0.9)' : 'var(--text-sub)', lineHeight: 1.45, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {mock70TimeLeft.isExpired ? 'จับเวลาถอยหลัง 60 นาที ไม่แสดงเฉลยระหว่างทำ ประมวลผลและตัดเกรดเสมือนห้องสอบจริง' : 'ระบบจะปลดล็อคให้เข้าสอบพร้อมกันในวันเสาร์ที่ 26 ก.ย. เวลา 13:00 น. (จับเวลา 60 นาที)'}
                    </div>
                  </button>

                  {/* 2. Practice Mode */}
                  <button
                    type="button"
                    onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 30, 'practice', true, false, 'law', '2570')}
                    className="mock-action-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.96rem', color: 'var(--text)', minWidth: 0, wordBreak: 'break-word' }}>
                        <BookOpen size={17} style={{ flexShrink: 0 }} />
                        <span>โหมดฝึกซ้อม (Practice Mode)</span>
                      </div>
                      <span style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.12rem 0.48rem', borderRadius: '6px', fontSize: '0.72rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {mock70TimeLeft.isExpired ? 'เฉลยทันที' : 'รอปลดล็อค'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.45, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {mock70TimeLeft.isExpired
                        ? 'แสดงเฉลยและเหตุผลทางกฎหมายทันทีหลังตอบ เหมาะสำหรับทบทวนข้อสอบ 10 STEMs'
                        : 'ไม่มีการสอบหรือฝึกทำล่วงหน้า ข้อสอบจะเปิดให้ทำพร้อมกันวันเสาร์ที่ 26 ก.ย. เวลา 13:00 น.'}
                    </div>
                  </button>

                  {/* 3. Law Hub / Flashcards */}
                  <button
                    type="button"
                    onClick={() => onOpenLawHub && onOpenLawHub()}
                    className="mock-action-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.96rem', color: 'var(--text)', minWidth: 0, wordBreak: 'break-word' }}>
                        <Scale size={17} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                        <span>ทบทวนสรุปมาตรา & Flashcards</span>
                      </div>
                      <span style={{ background: 'rgba(13, 148, 136, 0.14)', color: 'var(--primary-light)', padding: '0.12rem 0.48rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        อ่านได้ทันที
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.45, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      อ่านสรุปหัวใจสำคัญ พ.ร.บ. วิชาชีพ, พ.ร.บ. สถานพยาบาล, ทันตนิติเวช และ Flashcards
                    </div>
                  </button>
                </div>

                {/* ── 10 STEMs Breakdown Grid ── */}
                <div>
                  <div className="divider" style={{ margin: '1.25rem 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <FileText size={16} color="var(--primary-light)" /> โครงสร้าง 10 STEM สถานการณ์ใน Mock 70 (30 ข้อเต็ม)
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      10 สถานการณ์ STEM คลินิก × 3 ข้อย่อย = 30 ข้อ
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: '0.75rem'
                  }}>
                    {[
                      { stem: 1, qRange: "ข้อ 1 - 3", title: "โฆษณาจัดฟันใส Before-After & แอบอ้างผู้เชี่ยวชาญ", law: "พ.ร.บ.วิชาชีพ ม.28, พ.ร.บ.สถานพยาบาล ม.34, อำนาจทันตแพทยสภา" },
                      { stem: 2, qRange: "ข้อ 4 - 6", title: "การเปิดคลินิกเอกชน & อายุใบอนุญาตสถานพยาบาล", law: "พ.ร.บ.สถานพยาบาล ม.16, ม.26 (สิ้นปีที่ 2), คลินิกเถื่อน ม.16" },
                      { stem: 3, qRange: "ข้อ 7 - 9", title: "ขอบเขตงานทันตาภิบาล รพ.สต. & การควบคุมกำกับ", law: "ประกาศกระทรวงฯ ขอบเขตงาน, ห้ามผ่าฟันคุด/รักษาราก, วินัยข้าราชการ" },
                      { stem: 4, qRange: "ข้อ 10 - 12", title: "สิทธิผู้ป่วยขอเวชระเบียน & ข้อพิพาทการชำระเงิน", law: "พ.ร.บ.สุขภาพแห่งชาติ ม.7, ห้ามยึดเวชระเบียนเพื่อทวงหนี้" },
                      { stem: 5, qRange: "ข้อ 13 - 15", title: "ภาวะแทรกซ้อนผ่าฟันคุด, Informed Consent & คดีละเมิด", law: "ป.พ.พ. ม.420 ละเมิด, ม.448 อายุความ 1 ปี/10 ปี, การส่งต่อผู้ป่วย" },
                      { stem: 6, qRange: "ข้อ 16 - 18", title: "การคุ้มครองข้อมูลส่วนบุคคล (PDPA) & ความลับผู้ป่วย HIV", law: "ป.อาญา ม.323 เปิดเผยความลับ, พ.ร.บ.สุขภาพแห่งชาติ, PDPA" },
                      { stem: 7, qRange: "ข้อ 19 - 21", title: "ทันตนิติเวชศาสตร์ & ตรวจพิสูจน์เอกลักษณ์บุคคลเหตุเพลิงไหม้", law: "Ante-mortem vs Post-mortem records, Root Transparency, ฟันกรามทนความร้อน" },
                      { stem: 8, qRange: "ข้อ 22 - 24", title: "ทันตแพทย์ต้องคดีอาญา & ผลต่อใบประกอบวิชาชีพ", law: "พ.ร.บ.วิชาชีพ ม.24 ลักษณะต้องห้าม, คณะกรรมการฯ วินิจฉัยพักใช้/เพิกถอน" },
                      { stem: 9, qRange: "ข้อ 25 - 27", title: "การออกใบรับรองแพทย์เท็จ & โทษทางอาญาและวิชาชีพ", law: "ป.อาญา ม.269 รับรองเอกสารเท็จ, ม.39 พักใช้/เพิกถอน, ขอใหม่ได้หลัง 2 ปี" },
                      { stem: 10, qRange: "ข้อ 28 - 30", title: "สัญญาจ้างคลินิกเอกชน & ข้อกำหนดห้ามเปิดคลินิกแข่งขัน", law: "พ.ร.บ.ข้อสัญญาไม่เป็นธรรม พ.ศ. 2540, บทบาทสภาในข้อพิพาทธุรกิจ" }
                    ].map((item) => (
                      <div
                        key={item.stem}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          background: 'var(--surface-subtle)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.28rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="tabular-nums" style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                            STEM {item.stem} ({item.qRange})
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            3 ข้อย่อย
                          </span>
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                          มาตราหลัก: {item.law}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {selectedYearData.year === '2569' && (
                  <div className="special-exam-panel animate-fade-in" style={{ marginBottom: '1.5rem' }}>
                {/* ── DSAT Mock Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.26rem 0.65rem', borderRadius: '6px', background: 'rgba(13, 148, 136, 0.12)', border: '1px solid rgba(13, 148, 136, 0.28)', color: 'var(--primary-light)', fontSize: '0.76rem', fontWeight: 600, marginBottom: '0.55rem' }}>
                      <ShieldCheck size={13} /> ข้อสอบจำลองมาตรฐาน สโมสรนิสิตนักศึกษาทันตแพทย์แห่งประเทศไทย (สนทท.)
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text)', letterSpacing: '-0.02em', wordBreak: 'break-word', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Scale size={20} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                      <span>DSAT Mock Exam นิติทันตวิทยาและกฎหมาย (ฉบับจำลอง 4 ชุด)</span>
                    </h2>
                    <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', maxWidth: '720px', lineHeight: 1.55, wordBreak: 'break-word' }}>
                      ชุดข้อสอบจำลองเสมือนจริง <strong>4 ฉบับเต็ม รวม 120 ข้อ (40 STEM สถานการณ์คลินิก)</strong> อิงโครงสร้าง Table of Specifications (TOS) กฎหมายวิชาชีพ 24 ข้อ และนิติทันตวิทยา 6 ข้อต่อชุด พร้อมเฉลยละเอียดทุกตัวเลือกและการวิเคราะห์ Cognitive Domain
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                    <span className="tabular-nums" style={{ fontSize: '0.8rem', padding: '0.32rem 0.7rem', borderRadius: '6px', background: 'var(--primary)', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      4 ฉบับ • 120 ข้อเต็ม
                    </span>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      เกณฑ์ผ่าน ศ.ป.ท.: 60% (18/30 ข้อ)
                    </div>
                  </div>
                </div>

                {/* ── Key Highlights Banner ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.35rem'
                }}>
                  <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.8rem 0.95rem' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FileText size={12} /> โครงสร้างข้อสอบ (TOS)
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink-sky)' }}>10 STEMs / ฉบับ</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>กฎหมาย 24 ข้อ + ทันตนิติเวช 6 ข้อ</div>
                  </div>
                  <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.8rem 0.95rem' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Brain size={12} /> ระดับการเรียนรู้ (Cognitive)
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-light)' }}>Recall 50% • App 40%</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>Problem Solving 10% ครบทุกมิติ</div>
                  </div>
                  <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.8rem 0.95rem' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} /> เวลาทำข้อสอบ
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink-emerald)' }}>60 นาที / ฉบับ</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>หรือ 240 นาทีสำหรับรอบมาราธอน 4 ฉบับ</div>
                  </div>
                  <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.8rem 0.95rem' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Layers size={12} /> โหมดการทำข้อสอบ
                    </div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink-amber)' }}>Exam & Practice</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>จับเวลาจริง หรือ ตรวจคำตอบทันที</div>
                  </div>
                </div>

                {/* ── Marathon & Practice All Bar ── */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  padding: '0.95rem 1.15rem',
                  borderRadius: '10px',
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--primary)',
                  marginBottom: '1.35rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.96rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Zap size={15} color="var(--primary-light)" /> สอบรวม 4 ฉบับรวด (DSAT Grand Marathon 120 ข้อ)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                      ทดสอบความอึดและความแม่นยำทางกฎหมายทันตกรรมต่อเนื่อง 120 ข้อเต็ม (240 นาที) หรือฝึกซ้อม 4 ฉบับรวด
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStart({ category: 'กฎหมายและจรรยาบรรณ', count: 120, mode: 'exam', ordered: true, part: 'law', source_exam: 'DSAT Mock Law' })}
                    >
                      <PlayCircle size={14} /> เริ่มสอบมาราธอน 120 ข้อ
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStart({ category: 'กฎหมายและจรรยาบรรณ', count: 120, mode: 'practice', ordered: true, part: 'law', source_exam: 'DSAT Mock Law' })}
                    >
                      <BookOpen size={14} /> โหมดฝึกซ้อม 120 ข้อ
                    </button>
                  </div>
                </div>

                {/* ── 3 Sets Dedicated Cards Grid ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem'
                }}>
                  {[
                    {
                      setNum: 1,
                      title: "DSAT Mock Law ชุดที่ 1",
                      subtitle: "มาตรฐานสภา & ทันตกรรมทั่วไป",
                      desc: "การนับอายุใบอนุญาต 5 ปี, CDEC 80 หน่วยที่ 4 ปี, ปริญญาบัตรยังไม่มีใบอนุญาต, ผู้ดำเนินการคลินิก, ภาวะแทรกซ้อนถอนฟัน, DVI 4 ขั้นตอน, ประเมินอายุแรงงาน",
                      badgeColor: "#0284c7",
                      qRange: "ข้อ 1 - 30 (IDs 2400-2429)",
                      sourceExam: "DSAT Mock Law ชุดที่ 1",
                      stems: [
                        { stem: 1, q: "1-3", title: "การนับอายุใบอนุญาต 5 ปี และการเตือน CDEC 80 หน่วยที่ 4 ปี" },
                        { stem: 2, q: "4-6", title: "การสะสม CDEC ของทันตแพทย์ รพช. (คลินิก, วิทยากร, วารสาร)" },
                        { stem: 3, q: "7-9", title: "ผู้จบ ท.บ. ยังไม่มีใบอนุญาตกับการทำหน้าที่ผู้ช่วยทันตแพทย์" },
                        { stem: 4, q: "10-12", title: "ผู้รับอนุญาตสถานพยาบาลที่ไม่ใช่ทันตแพทย์ & ความรับผิดชอบร่วม" },
                        { stem: 5, q: "13-15", title: "วุฒิบัตรทันตกรรมประดิษฐ์ & การโฆษณาในสถานพยาบาล" },
                        { stem: 6, q: "16-18", title: "ถอนฟันกรามบนรากหักเข้า Maxillary Sinus & Informed Consent" },
                        { stem: 7, q: "19-21", title: "ขอบเขตงานทันตาภิบาลใน รพช. ตามระเบียบกระทรวงสาธารณสุข" },
                        { stem: 8, q: "22-24", title: "จรรยาบรรณความสัมพันธ์ & การวิจารณ์งานรักษาของเพื่อนร่วมวิชาชีพ" },
                        { stem: 9, q: "25-27", title: "ทันตนิติเวชเหตุเพลิงไหม้รถโดยสาร & กระบวนการ DVI INTERPOL 4 ขั้นตอน" },
                        { stem: 10, q: "28-30", title: "การตรวจประเมินอายุแรงงานต่างด้าว (Panoramic, Demirjian, Clavicle)" },
                      ]
                    },
                    {
                      setNum: 2,
                      title: "DSAT Mock Law ชุดที่ 2",
                      subtitle: "สถานพยาบาลเอกชน & การส่งต่อ",
                      desc: "การนับเวลา 5 ปีบริบูรณ์, ช่างทันตกรรมทำฟันปลอมเถื่อน, ผู้ดำเนินการสถานพยาบาล, วุฒิบัตร vs ป.โทห้ามอ้างผู้เชี่ยวชาญ, ถ่ายโอน รพ.สต. ไป อบจ., ทันตนิติเวชศพเน่าสลาย",
                      badgeColor: "#0d9488",
                      qRange: "ข้อ 1 - 30 (IDs 2430-2459)",
                      sourceExam: "DSAT Mock Law ชุดที่ 2",
                      stems: [
                        { stem: 1, q: "1-3", title: "การนับระยะเวลาใบอนุญาต 5 ปีบริบูรณ์ (สิ้นสุดในวันก่อนหน้าวันตรงกัน)" },
                        { stem: 2, q: "4-6", title: "การสะสมหน่วย CDEC ในคลินิกเอกชน & เกณฑ์ขั้นต่ำในการต่ออายุ" },
                        { stem: 3, q: "7-9", title: "ช่างทันตกรรมทำฟันปลอมเถื่อน & การปราบปรามตาม พ.ร.บ.วิชาชีพ" },
                        { stem: 4, q: "10-12", title: "ผู้รับอนุญาต & ผู้ดำเนินการสถานพยาบาล (หน้าที่ทางกฎหมายและมาตรฐาน)" },
                        { stem: 5, q: "13-15", title: "จบ ป.โท จัดฟันแต่ยังไม่มีวุฒิบัตร/อนุมัติบัตร (ห้ามอ้างผู้เชี่ยวชาญ)" },
                        { stem: 6, q: "16-18", title: "การวางแผนการรักษาผู้ป่วยสูงอายุ & ทางเลือกรากเทียม vs ฟันปลอมถอดได้" },
                        { stem: 7, q: "19-21", title: "การถ่ายโอน รพ.สต. ไปยัง อบจ. & ขอบเขตงานทันตสาธารณสุข" },
                        { stem: 8, q: "22-24", title: "จรรยาบรรณในการให้ความเห็นต่องานรักษาของทันตแพทย์ท่านอื่น" },
                        { stem: 9, q: "25-27", title: "ทันตนิติเวชศพเน่าสลายในป่า (Ante-mortem vs Post-mortem Dental Records)" },
                        { stem: 10, q: "28-30", title: "การประมาณอายุผู้ใหญ่จากโครงกระดูก (Gustafson & Root Transparency)" },
                      ]
                    },
                    {
                      setNum: 3,
                      title: "DSAT Mock Law ชุดที่ 3",
                      subtitle: "จรรยาบรรณ สิทธิผู้ป่วย & นิติทันตวิทยา",
                      desc: "การถอนคำร้องจรรยาบรรณ, ใบอนุญาตสถานพยาบาลสิ้นปีที่สอง, ผู้ป่วย HIV ห้ามปฏิเสธ, นักวิชาการสาธารณสุข, รอยกัด ABFO No.2, สงสัย Child Abuse, DVI เครื่องบินตก",
                      badgeColor: "#0f766e",
                      qRange: "ข้อ 1 - 30 (IDs 2460-2489)",
                      sourceExam: "DSAT Mock Law ชุดที่ 3",
                      stems: [
                        { stem: 1, q: "1-3", title: "การร้องเรียนจรรยาบรรณต่อทันตแพทยสภา & การถอนคำร้องไม่ระงับคดี" },
                        { stem: 2, q: "4-6", title: "ทันตแพทย์ทำงานหลายแห่ง & ข้อกำหนดการเป็นผู้ดำเนินการสถานพยาบาล" },
                        { stem: 3, q: "7-9", title: "นิติบุคคลเป็นผู้รับอนุญาตสถานพยาบาล & การแจ้งเปลี่ยนผู้ดำเนินการ" },
                        { stem: 4, q: "10-12", title: "อายุใบอนุญาตให้ประกอบกิจการสถานพยาบาล (สิ้นปีปฏิทินของปีที่สอง)" },
                        { stem: 5, q: "13-15", title: "วุฒิบัตรศัลยศาสตร์ช่องปาก & ขอบเขตการให้ข้อมูลความรู้ทางสื่อออนไลน์" },
                        { stem: 6, q: "16-18", title: "สิทธิผู้ป่วยติดเชื้อ HIV & การห้ามเลือกปฏิบัติหรือปฏิเสธการรักษา" },
                        { stem: 7, q: "19-21", title: "นักวิชาการสาธารณสุข (ทันตสาธารณสุข) ใน รพ.สต. & งานที่ทำได้" },
                        { stem: 8, q: "22-24", title: "ความสัมพันธ์ระหว่างทันตแพทย์ & การดึงผู้ป่วยข้ามคลินิก" },
                        { stem: 9, q: "25-27", title: "การตรวจชันสูตรรอยกัด (Bite Marks), ABFO No.2 & สงสัย Child Abuse" },
                        { stem: 10, q: "28-30", title: "ภัยพิบัติเครื่องบินตก 180 ราย & DVI Primary Identifiers (ฟัน, นิ้วมือ, DNA)" },
                      ]
                    },
                    {
                      setNum: 4,
                      title: "DSAT Mock Law ชุดที่ 4",
                      subtitle: "สถานพยาบาล CDEC เวชระเบียน & DVI",
                      desc: "ใบอนุญาตสถานพยาบาล 10 ปี/2 ปี, โฆษณากิจการ, CDEC 100 หน่วย, ขอบเขตทันตาภิบาล, ความรับผิดละเมิด & Consent, ทันตแพทยสภา 5 สถาน, สิทธิผู้ป่วย HIV, PDPA, DVI INTERPOL และอายุวัยรุ่น Clavicle",
                      badgeColor: "#b45309",
                      qRange: "ข้อ 1 - 30 (IDs 2490-2519)",
                      sourceExam: "DSAT Mock Law ชุดที่ 4",
                      year: "2570",
                      stems: [
                        { stem: 1, q: "1-3", title: "พ.ร.บ. สถานพยาบาล พ.ศ. 2541 (ใบอนุญาต 10 ปี / 2 ปี, ผู้ดำเนินการแห่งเดียว, การปฏิบัติหน้าที่แทน)" },
                        { stem: 2, q: "4-6", title: "การโฆษณาสถานพยาบาล & จรรยาบรรณ (Before & After, อ้างผู้เชี่ยวชาญ, รับรองผล 100% / ลดราคาจูงใจ)" },
                        { stem: 3, q: "7-9", title: "การศึกษาต่อเนื่อง CDEC & อายุใบอนุญาต (เกณฑ์ 100 หน่วยใน 5 ปี, กฎหมาย/จริยธรรม 10 หน่วย, การรักษาเมื่อใบอนุญาตสิ้นอายุ)" },
                        { stem: 4, q: "10-12", title: "ขอบเขตงานทันตาภิบาล & ผู้ช่วยทันตแพทย์ (ข้อห้ามใน รพ.รัฐ, ห้ามทำหัตถการในคลินิกเอกชน, ความรับผิดร่วม)" },
                        { stem: 5, q: "13-15", title: "ภาวะแทรกซ้อน & Informed Consent (ความสมบูรณ์ของความยินยอม, Standard of Care ม.420, อายุความละเมิด 1 ปี)" },
                        { stem: 6, q: "16-18", title: "กระบวนการจริยธรรมทันตแพทยสภา (อายุความยื่นคำกล่าวหา 1 ปี/3 ปี, การถอนคำร้องไม่ระงับคดี ม.43, อำนาจลงโทษ 5 สถานตาม ม.39)" },
                        { stem: 7, q: "19-21", title: "สิทธิผู้ป่วย & กฎหมายสุขภาพ (ห้ามปฏิเสธผู้ป่วย HIV/ฉุกเฉิน, Living Will ม.12, ข้อยกเว้นฉุกเฉินเพื่อช่วยชีวิต)" },
                        { stem: 8, q: "22-24", title: "เวชระเบียน & PDPA (Sensitive Data ม.26, การขอข้อมูลโดยบุคคลภายนอก/หมายศาล, เกณฑ์เก็บรักษาอย่างน้อย 5 ปี)" },
                        { stem: 9, q: "25-27", title: "ทันตนิติเวช & DVI INTERPOL (Primary Identifiers 3 ด้าน, 4 ขั้นตอน Scene-PM-AM-Reconciliation, คุณสมบัติฟันในศพไฟไหม้)" },
                        { stem: 10, q: "28-30", title: "การประเมินอายุ & รอยกัด Bite Mark (ประเมินอายุวัยรุ่น ซี่ 8 + Clavicle, Gustafson Root transparency, การเก็บหลักฐานรอยกัด ABFO No. 2)" },
                      ]
                    }
                  ].map((set) => {
                    const isExpanded = expandedDsatSet === set.setNum;
                    return (
                      <div
                        key={set.setNum}
                        style={{
                          background: 'var(--surface-subtle)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div>
                          {/* Card Top Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                            <span style={{
                              background: set.badgeColor,
                              color: '#fff',
                              padding: '0.18rem 0.55rem',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}>
                              ฉบับที่ {set.setNum}
                            </span>
                            <span className="tabular-nums" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {set.qRange}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.08rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                            {set.title}
                          </h3>
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.55rem' }}>
                            {set.subtitle}
                          </div>
                          <p style={{ fontSize: '0.79rem', color: 'var(--text-sub)', lineHeight: 1.48, margin: '0 0 0.9rem 0' }}>
                            {set.desc}
                          </p>

                          {/* Quick Badges */}
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <span style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', padding: '0.18rem 0.5rem', borderRadius: '6px', fontSize: '0.71rem', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.28rem' }}>
                              <Target size={11} /> 30 ข้อ (10 STEMs)
                            </span>
                            <span style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', padding: '0.18rem 0.5rem', borderRadius: '6px', fontSize: '0.71rem', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.28rem' }}>
                              <Clock size={11} /> 60 นาที
                            </span>
                            <span style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', padding: '0.18rem 0.5rem', borderRadius: '6px', fontSize: '0.71rem', color: 'var(--primary-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.28rem' }}>
                              <Brain size={11} /> TOS ครบ 3 ระดับ
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '0.55rem' }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStart({
                                category: 'กฎหมายและจรรยาบรรณ',
                                count: 30,
                                mode: 'exam',
                                ordered: true,
                                part: 'law',
                                year: set.year || '2569',
                                source_exam: set.sourceExam
                              })}
                              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                            >
                              <PlayCircle size={14} /> เข้าสอบจริง
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStart({
                                category: 'กฎหมายและจรรยาบรรณ',
                                count: 30,
                                mode: 'practice',
                                ordered: true,
                                part: 'law',
                                year: set.year || '2569',
                                source_exam: set.sourceExam
                              })}
                              style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                            >
                              <BookOpen size={14} /> ฝึกซ้อม
                            </button>
                          </div>

                          {/* Toggle STEMs list */}
                          <button
                            type="button"
                            onClick={() => setExpandedDsatSet(isExpanded ? null : set.setNum)}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: '1px dashed var(--border-hover)',
                              borderRadius: '8px',
                              padding: '0.35rem 0.5rem',
                              color: 'var(--text-muted)',
                              fontSize: '0.74rem',
                              fontFamily: 'inherit',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            {isExpanded ? 'ซ่อนโครงสร้าง 10 STEMs' : 'ดูโครงสร้าง 10 STEMs ในชุดนี้'}
                          </button>

                          {/* Expanded 10 STEMs */}
                          {isExpanded && (
                            <div className="animate-fade-in" style={{
                              marginTop: '0.65rem',
                              padding: '0.6rem',
                              background: 'var(--bg-panel)',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              maxHeight: '250px',
                              overflowY: 'auto',
                              fontSize: '0.74rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.4rem'
                            }}>
                              {set.stems.map(s => (
                                <div key={s.stem} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.35rem' }}>
                                  <div style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
                                    STEM {s.stem} (ข้อ {s.q})
                                  </div>
                                  <div style={{ color: 'var(--text-sub)' }}>
                                    {s.title}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Blueprint & Table of Specifications Details ── */}
                <div style={{
                  padding: '1.1rem',
                  borderRadius: '10px',
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', color: 'var(--text)', fontWeight: 700, fontSize: '0.92rem' }}>
                    <ShieldCheck size={16} color="var(--primary-light)" /> การกระจายข้อสอบตามกรอบมาตรฐาน ศ.ป.ท. (TOS Blueprint)
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.9rem',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink-sky)', marginBottom: '0.2rem' }}>1. กฎหมายวิชาชีพ (40%)</div>
                      <div style={{ color: 'var(--text-sub)', lineHeight: 1.45 }}>พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 และ ฉบับที่ 2 พ.ศ. 2559 (อายุใบอนุญาต, CDEC, การควบคุมการประกอบวิชาชีพ)</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-light)', marginBottom: '0.2rem' }}>2. จรรยาบรรณวิชาชีพ (20%)</div>
                      <div style={{ color: 'var(--text-sub)', lineHeight: 1.45 }}>ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณ พ.ศ. 2538 (โฆษณา, การส่งต่อ, สิทธิผู้ป่วย, ความสัมพันธ์ระหว่างวิชาชีพ)</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink-emerald)', marginBottom: '0.2rem' }}>3. กฎหมายสถานพยาบาล (20%)</div>
                      <div style={{ color: 'var(--text-sub)', lineHeight: 1.45 }}>พ.ร.บ. สถานพยาบาล พ.ศ. 2541 และ ฉบับที่ 4 พ.ศ. 2559 (ผู้รับอนุญาต, ผู้ดำเนินการ, การต่ออายุใบอนุญาต)</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink-amber)', marginBottom: '0.2rem' }}>4. นิติทันตวิทยา & อื่นๆ (20%)</div>
                      <div style={{ color: 'var(--text-sub)', lineHeight: 1.45 }}>การพิสูจน์เอกลักษณ์บุคคล DVI, การประมาณอายุ, รอยกัด (Bite Marks), สิทธิผู้ป่วย และคดีละเมิด</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(1.15rem, 2.5vw, 1.75rem)' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.28rem 0', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="var(--primary-light)" /> ข้อสอบปี พ.ศ. {selectedYearData.year}
                </h2>
                <div className="tabular-nums" style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                  จำนวนทั้งหมด <strong>{selectedYearData.total}</strong> ข้อ
                  (ทฤษฎีคลินิก {selectedYearData.clinical_count} ข้อ | กฎหมาย {selectedYearData.law_count} ข้อ)
                </div>
              </div>

              {/* ── 2-Day / 4-Part Exam Simulation System ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', margin: '1.25rem 0' }}>

                {/* Day 1: Part 1 & Part 2 */}
                <div className="day-sim-section day1">
                  <div className="day-sim-header">
                    <div>
                      <div className="day-sim-title">
                        <Calendar size={16} color="var(--primary-light)" />
                        <span>วันที่ 1 (Day 1) — ทฤษฎีคลินิก Part 1 & 2</span>
                        <span className="badge badge-primary tabular-nums">150 ข้อ • รวม 3.5 ชม.</span>
                      </div>
                      <div className="day-sim-subtitle">
                        ข้อสอบ 50 STEM ใหญ่ (75 ข้อย่อต่อ Part) • สอบ Part ละ 1 ชั่วโมง 45 นาที
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStart('', '', 200, 'exam', true, false, 'day1')}
                      title="สอบรวมทั้งวัน Day 1 (150 ข้อรวดเดียว 3.5 ชั่วโมง)"
                    >
                      <PlayCircle size={14} /> สอบรวม Day 1
                    </button>
                  </div>

                  <div className="part-sim-grid">
                    {/* Part 1 */}
                    <div className="part-sim-item">
                      <div className="part-sim-header">
                        <div>
                          <div className="part-sim-name">Part 1</div>
                          <div className="part-sim-meta tabular-nums">
                            <span>{selectedYearData.parts?.['1']?.count ?? 0} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['1']?.stems ?? 0} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
                        {(selectedYearData.parts?.['1']?.count || 0) > 0 ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStart('', '', 100, 'exam', true, false, '1')}
                            >
                              <PlayCircle size={14} /> เริ่มสอบ Part 1
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStart('', '', 100, 'practice', true, false, '1')}
                            >
                              <BookOpen size={14} /> ฝึกซ้อม
                            </button>
                          </>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', width: '100%', padding: '0.4rem 0' }}>
                            (ไม่มีข้อสอบ Part 1 ในปีนี้)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Part 2 */}
                    <div className="part-sim-item">
                      <div className="part-sim-header">
                        <div>
                          <div className="part-sim-name">Part 2</div>
                          <div className="part-sim-meta tabular-nums">
                            <span>{selectedYearData.parts?.['2']?.count ?? 0} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['2']?.stems ?? 0} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
                        {(selectedYearData.parts?.['2']?.count || 0) > 0 ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStart('', '', 100, 'exam', true, false, '2')}
                            >
                              <PlayCircle size={14} /> เริ่มสอบ Part 2
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStart('', '', 100, 'practice', true, false, '2')}
                            >
                              <BookOpen size={14} /> ฝึกซ้อม
                            </button>
                          </>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', width: '100%', padding: '0.4rem 0' }}>
                            (ไม่มีข้อสอบ Part 2 ในปีนี้)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day 2: Part 3 & Part 4 */}
                <div className="day-sim-section day2">
                  <div className="day-sim-header">
                    <div>
                      <div className="day-sim-title">
                        <Calendar size={16} color="var(--accent)" />
                        <span>วันที่ 2 (Day 2) — ทฤษฎีคลินิก Part 3 & 4</span>
                        <span className="badge badge-accent tabular-nums">150 ข้อ • รวม 3.5 ชม.</span>
                      </div>
                      <div className="day-sim-subtitle">
                        ข้อสอบ 50 STEM ใหญ่ (75 ข้อย่อต่อ Part) • สอบ Part ละ 1 ชั่วโมง 45 นาที
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStart('', '', 200, 'exam', true, false, 'day2')}
                      title="สอบรวมทั้งวัน Day 2 (150 ข้อรวดเดียว 3.5 ชั่วโมง)"
                    >
                      <PlayCircle size={14} /> สอบรวม Day 2
                    </button>
                  </div>

                  <div className="part-sim-grid">
                    {/* Part 3 */}
                    <div className="part-sim-item">
                      <div className="part-sim-header">
                        <div>
                          <div className="part-sim-name">Part 3</div>
                          <div className="part-sim-meta tabular-nums">
                            <span>{selectedYearData.parts?.['3']?.count ?? 0} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['3']?.stems ?? 0} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
                        {(selectedYearData.parts?.['3']?.count || 0) > 0 ? (
                          <>
                            <button
                              className="btn btn-accent btn-sm"
                              onClick={() => handleStart('', '', 100, 'exam', true, false, '3')}
                            >
                              <PlayCircle size={14} /> เริ่มสอบ Part 3
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStart('', '', 100, 'practice', true, false, '3')}
                            >
                              <BookOpen size={14} /> ฝึกซ้อม
                            </button>
                          </>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', width: '100%', padding: '0.4rem 0' }}>
                            (ไม่มีข้อสอบ Part 3 ในปีนี้)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Part 4 */}
                    <div className="part-sim-item">
                      <div className="part-sim-header">
                        <div>
                          <div className="part-sim-name">Part 4</div>
                          <div className="part-sim-meta tabular-nums">
                            <span>{selectedYearData.parts?.['4']?.count ?? 0} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['4']?.stems ?? 0} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
                        {(selectedYearData.parts?.['4']?.count || 0) > 0 ? (
                          <>
                            <button
                              className="btn btn-accent btn-sm"
                              onClick={() => handleStart('', '', 100, 'exam', true, false, '4')}
                            >
                              <PlayCircle size={14} /> เริ่มสอบ Part 4
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStart('', '', 100, 'practice', true, false, '4')}
                            >
                              <BookOpen size={14} /> ฝึกซ้อม
                            </button>
                          </>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', width: '100%', padding: '0.4rem 0' }}>
                            (ไม่มีข้อสอบ Part 4 ในปีนี้)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Law & Ethics & All Parts Options */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.15rem' }}>
                  
                  {/* Law Card */}
                  <div className="day-sim-section law" style={{ margin: 0 }}>
                    <div className="part-sim-header">
                      <div>
                        <div className="part-sim-name" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Scale size={15} /> กฎหมายและจรรยาบรรณ
                        </div>
                        <div className="part-sim-meta">
                          {selectedYearData.law_count > 0 ? (
                            <span>{selectedYearData.law_count} ข้อ • ข้อสอบตรงปี พ.ศ. {selectedYearData.year}</span>
                          ) : (
                            <span>30 ข้อ (สุ่มจากคลังรวม) • พ.ร.บ. & วิชาชีพ</span>
                          )}
                        </div>
                      </div>
                      <div className="part-sim-time" style={{ color: 'var(--danger)' }}>
                        <Clock size={14} /> 1 ชั่วโมง
                      </div>
                    </div>
                    <div className="part-sim-actions" style={{ marginTop: '1rem' }}>
                      {selectedYearData.law_count > 0 ? (
                        <>
                          <button
                            className="btn btn-sm"
                            style={{ background: 'rgba(239, 68, 68, 0.14)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', flex: 1 }}
                            onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 100, 'exam', true, false, 'law')}
                          >
                            <ShieldAlert size={14} /> สอบกฎหมาย ({selectedYearData.law_count} ข้อ)
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 100, 'practice', true, false, 'law')}
                          >
                            <BookOpen size={14} /> ฝึกซ้อม
                          </button>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(239, 68, 68, 0.14)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', flex: 1 }}
                              onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 30, 'exam', false, false, 'law', '')}
                              title="สุ่มข้อสอบกฎหมาย 30 ข้อจากคลังรวม เพื่อให้จำลองสอบครบทุกวิชา"
                            >
                              <ShieldAlert size={14} /> สอบกฎหมาย (สุ่มคลัง 30 ข้อ)
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ flex: 1 }}
                              onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 30, 'practice', false, false, 'law', '')}
                            >
                              <BookOpen size={14} /> ฝึกซ้อม (30 ข้อ)
                            </button>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            *(ปี พ.ศ. {selectedYearData.year} ไม่มีข้อสอบกฎหมายแยก ระบบจึงสุ่ม 30 ข้อจากคลังรวมให้ฝึกทำครบหมวด)*
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* All 4 Parts Marathon Card */}
                  <div className="day-sim-section" style={{ margin: 0, borderTop: '3px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="part-sim-header">
                      <div>
                        <div className="part-sim-name" style={{ color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Trophy size={15} /> สอบคลินิกครบ 4 Parts
                        </div>
                        <div className="part-sim-meta tabular-nums">
                          <span>{selectedYearData.clinical_count} ข้อ (100 STEM)</span>
                        </div>
                      </div>
                      <div className="part-sim-time" style={{ color: 'var(--primary-light)' }}>
                        <Clock size={14} /> รวม 7 ชม.
                      </div>
                    </div>
                    <div className="part-sim-actions" style={{ marginTop: '1rem' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => handleStart('', '', 1000, 'exam', true, true, '')}
                      >
                        <PlayCircle size={14} /> เริ่มสอบจำลอง 4 Parts มาราธอน
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Year Insights Grid */}
              <div style={{ marginTop: '1.75rem' }}>
                <div className="divider" />
                
                <h3 style={{ margin: '1.25rem 0 0.85rem', color: 'var(--primary-light)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Stethoscope size={17} /> สถิติ: คลินิก (Clinical)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.15rem' }}>
                  {/* Clinical Categories */}
                  <div className="insight-card">
                    <div className="insight-card-title">
                      หมวดวิชาที่ออกมาก (Top Subjects)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {selectedYearData.categories.filter(c => c.name !== 'กฎหมายและจรรยาบรรณ').slice(0, 6).map((cat, idx) => (
                        <div key={cat.name} className="insight-row">
                          <div className="insight-rank" style={{ background: idx < 3 ? 'rgba(13, 148, 136, 0.16)' : 'var(--surface-subtle)', color: idx < 3 ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cat.name}
                          </div>
                          <div className="badge badge-primary tabular-nums" style={{ fontSize: '0.76rem' }}>{cat.count} ข้อ</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Tasks */}
                  <div className="insight-card">
                    <div className="insight-card-title">
                      ทักษะวิชาชีพที่เน้น (Top Tasks)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {selectedYearData.tasks.filter(t => !['พ.ร.บ.', 'กฎหมาย', 'จรรยาบรรณ'].some(kw => t.name.includes(kw)) && t.name.trim() !== '').slice(0, 5).map((task, idx) => (
                        <div key={task.name} className="insight-row">
                          <div className="insight-rank" style={{ background: idx < 3 ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-subtle)', color: idx < 3 ? 'var(--ink-sky)' : 'var(--text-muted)' }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.name}
                          </div>
                          <div className="badge badge-accent tabular-nums" style={{ fontSize: '0.76rem' }}>{task.count} ข้อ</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 style={{ margin: '1.75rem 0 0.85rem', color: 'var(--danger)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ShieldAlert size={17} /> สถิติ: กฎหมายและจรรยาบรรณ (Law)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.15rem' }}>
                  {/* Law Tasks */}
                  <div className="insight-card" style={{ borderTop: '2px solid rgba(239, 68, 68, 0.35)' }}>
                    <div className="insight-card-title" style={{ color: 'var(--danger)' }}>
                      ทักษะที่เน้น (Top Law Tasks)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {selectedYearData.tasks.filter(t => ['พ.ร.บ.', 'กฎหมาย', 'จรรยาบรรณ'].some(kw => t.name.includes(kw))).map((task, idx) => (
                        <div key={task.name} className="insight-row">
                          <div className="insight-rank" style={{ background: idx < 3 ? 'rgba(239, 68, 68, 0.14)' : 'var(--surface-subtle)', color: idx < 3 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.name}
                          </div>
                          <div className="badge badge-primary tabular-nums" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.76rem' }}>{task.count} ข้อ</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )
        ) : (
            /* Quick Exam Library Grid (substantive landing overview when "ทั้งหมด" is active) */
            <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(1.15rem, 2.5vw, 1.5rem)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.2rem 0', color: 'var(--text)', fontSize: '1.08rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Layers size={17} color="var(--primary-light)" /> คลังข้อสอบย้อนหลังและชุดจำลอง ศ.ป.ท.
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-sub)', fontSize: '0.83rem' }}>
                    เลือกชุดข้อสอบหรือปีการศึกษาเพื่อดูโครงสร้าง 4 Parts, กฎหมายวิชาชีพ และเริ่มสอบแบบจับเวลา
                  </p>
                </div>
                <div className="tabular-nums" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {years ? years.length : 0} ชุด / ปีการศึกษา
                </div>
              </div>

              <div className="exam-series-grid">
                {years && years.map((yData) => {
                  const isMock70 = yData.year === '2570';
                  const isDsat = yData.year === '2569';
                  const SeriesIcon = isMock70 ? Target : isDsat ? Scale : Calendar;
                  const title = isMock70
                    ? 'ศ.ป.ท. Mock Exam 2570'
                    : isDsat
                      ? 'DSAT Mock Law (4 ชุด)'
                      : `ข้อสอบจริง พ.ศ. ${yData.year}`;
                  const tagLabel = isMock70
                    ? 'Mock 70'
                    : isDsat
                      ? 'กฎหมาย • 4 ฉบับ'
                      : 'ข้อสอบรายปี';

                  return (
                    <button
                      key={yData.year}
                      type="button"
                      className="exam-series-card"
                      onClick={() => setSelectedYear(yData.year)}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.55rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: isMock70 || isDsat ? 'var(--primary-light)' : 'var(--text-muted)',
                            background: isMock70 || isDsat ? 'rgba(13, 148, 136, 0.12)' : 'var(--surface-subtle)',
                            border: '1px solid var(--border)',
                            padding: '0.16rem 0.5rem',
                            borderRadius: '6px'
                          }}>
                            <SeriesIcon size={12} /> {tagLabel}
                          </span>
                          <span className="tabular-nums" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>
                            {yData.total} ข้อ
                          </span>
                        </div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                          {title}
                        </div>
                        <div className="tabular-nums" style={{ fontSize: '0.77rem', color: 'var(--text-muted)', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span>คลินิก {yData.clinical_count}</span>
                          <span>•</span>
                          <span>กฎหมาย {yData.law_count}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.55rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-light)' }}>
                        <span>เปิดชุดข้อสอบ</span>
                        <ArrowRight size={14} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB 2: ฝึกซ้อมรายวิชา (Practice by Subject)
      ════════════════════════════════════════════════ */}
      {activeTab === 'practice' && (() => {
        const domainGroupsDef = [
          {
            id: 'restorative',
            title: 'กลุ่มทันตกรรมบูรณะและการฟื้นฟูสภาพช่องปาก',
            sub: 'Restorative, Endodontics, Prosthodontics, Periodontics & Occlusion',
            color: 'var(--ink-sky)',
            bg: 'rgba(56, 189, 248, 0.1)',
            borderColor: 'rgba(56, 189, 248, 0.25)',
            icon: <Activity size={17} />,
            categoryNames: [
              'ทันตกรรมบูรณะ/หัตถการ',
              'วิทยาเอ็นโดดอนต์',
              'ปริทันตวิทยา',
              'ทันตกรรมประดิษฐ์',
              'ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า'
            ]
          },
          {
            id: 'surgery_diagnosis',
            title: 'กลุ่มศัลยศาสตร์และวิทยาการวินิจฉัยโรคช่องปาก',
            sub: 'Oral & Maxillofacial Surgery, Oral Medicine, Pathology & Radiology',
            color: 'var(--primary-light)',
            bg: 'rgba(13, 148, 136, 0.12)',
            borderColor: 'rgba(13, 148, 136, 0.28)',
            icon: <Stethoscope size={17} />,
            categoryNames: [
              'วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก',
              'ศัลยศาสตร์ช่องปาก'
            ]
          },
          {
            id: 'pediatric_ortho_community',
            title: 'กลุ่มทันตกรรมเด็ก จัดฟัน และทันตสาธารณสุข',
            sub: 'Pediatric Dentistry, Orthodontics & Dental Public Health',
            color: 'var(--ink-emerald)',
            bg: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.25)',
            icon: <GraduationCap size={17} />,
            categoryNames: [
              'ทันตกรรมสำหรับเด็ก',
              'ทันตกรรมจัดฟัน',
              'ทันตกรรมชุมชน'
            ]
          },
          {
            id: 'law_ethics',
            title: 'กลุ่มกฎหมาย จรรยาบรรณ และการบริหารงานทันตกรรม',
            sub: 'Dental Law, Professional Ethics & Healthcare Facilities Act',
            color: 'var(--ink-amber)',
            bg: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.25)',
            icon: <Scale size={17} />,
            isLaw: true,
            categoryNames: [
              'กฎหมายและจรรยาบรรณ'
            ]
          }
        ];

        // Match categories to domain groups
        const grouped = domainGroupsDef.map(grp => {
          const items = grp.categoryNames.map(cName => {
            const found = stats.find(s => s.category === cName);
            return {
              category: cName,
              count: found ? found.count : 0
            };
          }).filter(item => item.count > 0);
          return {
            ...grp,
            items,
            count: items.reduce((acc, c) => acc + c.count, 0)
          };
        });

        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {/* Quick Random Buttons */}
            <div className="glass-panel" style={{ padding: '1.15rem 1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.18rem', margin: '0 0 0.2rem 0', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <BookOpen size={18} color="var(--primary-light)" /> ฝึกซ้อมแยกตามสาขาวิชาทันตกรรม
                </h2>
                <p className="tabular-nums" style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  รวมข้อสอบทั้งหมด {totalQuestions.toLocaleString()} ข้อ (ทฤษฎีคลินิก {totalClinical} ข้อ | กฎหมาย {totalLaw} ข้อ)
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.55rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleStart('', '', 20, 'exam', false, false, '', '')}>
                  <PlayCircle size={14} /> สุ่มสอบคลินิก 20 ข้อ
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => handleStart('', '', 20, 'practice', false, false, '', '')}>
                  <BookOpen size={14} /> สุ่มฝึกคลินิก 20 ข้อ
                </button>
              </div>
            </div>

            {/* Render 4 Domain Groups */}
            {grouped.map(grp => (
              grp.items.length > 0 && (
                <div key={grp.id} className="day-sim-section" style={{ borderTop: `3px solid ${grp.color}`, margin: 0 }}>
                  <div className="day-sim-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem' }}>
                    <div>
                      <div className="day-sim-title" style={{ fontSize: '1.08rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span style={{ color: grp.color, display: 'inline-flex' }}>{grp.icon}</span>
                          {grp.title}
                        </span>
                        <span className="badge tabular-nums" style={{ background: grp.bg, color: grp.color, border: `1px solid ${grp.borderColor}`, fontSize: '0.78rem' }}>
                          {grp.count} ข้อ
                        </span>
                      </div>
                      <div className="day-sim-subtitle" style={{ fontSize: '0.8rem' }}>{grp.sub}</div>
                    </div>
                  </div>

                  <div className="category-grid">
                    {grp.items.map((stat) => {
                      const subtasks = categoryTasks[stat.category] || [];

                      return (
                        <div
                          key={stat.category}
                          className="category-card"
                          style={{ borderLeft: `3px solid ${grp.color}` }}
                        >
                          <div>
                            <div className="category-count tabular-nums" style={{ color: grp.color }}>{stat.count}</div>
                            <div className="category-card-name">{stat.category}</div>
                          </div>

                          {/* Primary actions: Entire category */}
                          <div className="category-actions">
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ flex: 1 }}
                              onClick={() => handleStart(stat.category, '', Math.min(stat.count, 20), 'exam', false, false, '', '')}
                              title={`สุ่มสอบ ${stat.category} 20 ข้อ`}
                            >
                              <PlayCircle size={13} /> สอบ
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ flex: 1, background: grp.bg, color: grp.color, border: `1px solid ${grp.borderColor}` }}
                              onClick={() => handleStart(stat.category, '', Math.min(stat.count, 20), 'practice', false, false, '', '')}
                              title={`ฝึกซ้อม ${stat.category} 20 ข้อ`}
                            >
                              <BookOpen size={13} /> ฝึก
                            </button>
                          </div>

                          {/* Law Flashcard Hub Button if Law Category */}
                          {grp.isLaw && onOpenLawHub && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={onOpenLawHub}
                              style={{ width: '100%', fontSize: '0.78rem' }}
                            >
                              <Scale size={14} /> สรุปกฎหมาย & Flashcards
                            </button>
                          )}

                          {/* Drill-down Subtopics / Tasks Modal Trigger */}
                          {subtasks.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setActiveCategoryModal({
                                name: stat.category,
                                count: stat.count,
                                color: grp.color,
                                bg: grp.bg,
                                borderColor: grp.borderColor,
                                icon: grp.icon,
                                isLaw: grp.isLaw,
                                tasks: subtasks
                              })}
                              className="drilldown-subtopics-btn"
                              title={`ดูรายละเอียดและเลือกทำตามสมรรถนะของ ${stat.category}`}
                            >
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Target size={13} />
                                {grp.isLaw ? 'เลือกตามหมวดกฎหมาย' : 'เลือกตามสมรรถนะ'} ({subtasks.length})
                              </span>
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}

          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════
         TAB 4: Leaderboard
      ════════════════════════════════════════════════ */}
      {activeTab === 'leaderboard' && (
        <Leaderboard onStartMock={() => onStart({ category: '', task: '', count: 100, mode: 'exam', examType: 'mock' })} />
      )}

      {/* ════════════════════════════════════════════════
         TAB 3: สร้างข้อสอบเอง (Custom Builder)
      ════════════════════════════════════════════════ */}
      {activeTab === 'custom' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.35rem' }}>
              <Settings2 size={18} color="var(--primary-light)" />
              <h2 style={{ margin: 0, fontSize: '1.18rem', color: 'var(--text)' }}>สร้างข้อสอบเองตามต้องการ</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">วิชา / สาขา</label>
                <select
                  className="input-select"
                  value={selectedCategory}
                  onChange={e => handleCategorySelect(e.target.value)}
                >
                  <option value="">ทุกวิชา (ทั้งหมด)</option>
                  {categories.categories?.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">ทักษะวิชาชีพ (Task)</label>
                <select
                  className="input-select"
                  value={selectedTask}
                  onChange={e => setSelectedTask(e.target.value)}
                >
                  <option value="">ทุก Task (ทั้งหมด)</option>
                  {(() => {
                    const clinicalTasks = categories.clinical_tasks || [
                      "การวินิจฉัยโรค",
                      "การจัดการและการรักษาผู้ป่วย",
                      "ขั้นตอนและวิธีการรักษา",
                      "การเกิดและการดำเนินโรค",
                      "การสร้างเสริมสุขภาพและการป้องกัน"
                    ];
                    const lawTasks = categories.law_tasks || [
                      "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
                      "จรรยาบรรณแห่งวิชาชีพทันตกรรม",
                      "พ.ร.บ. สถานพยาบาล พ.ศ. 2541",
                      "กฎหมายอื่นๆ ที่เกี่ยวข้อง"
                    ];

                    if (selectedCategory === lawCategoryName) {
                      return lawTasks.map(t => <option key={t} value={t}>{t}</option>);
                    } else if (selectedCategory && selectedCategory !== '') {
                      return clinicalTasks.map(t => <option key={t} value={t}>{t}</option>);
                    } else {
                      return (
                        <>
                          <optgroup label="ทักษะทางคลินิก (Clinical Tasks)">
                            {clinicalTasks.map(t => <option key={t} value={t}>{t}</option>)}
                          </optgroup>
                          <optgroup label="หมวดกฎหมาย (Law & Ethics)">
                            {lawTasks.map(t => <option key={t} value={t}>{t}</option>)}
                          </optgroup>
                        </>
                      );
                    }
                  })()}
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">ปีข้อสอบ (พ.ศ.)</label>
                <select
                  className="input-select"
                  value={customYear}
                  onChange={e => setCustomYear(e.target.value)}
                >
                  <option value="">ทุกปี (ทั้งหมด)</option>
                  {years && years.map(yData => (
                    <option key={yData.year} value={yData.year}>พ.ศ. {yData.year}</option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">จำนวนข้อ</label>
                <input
                  type="number"
                  className="input-number tabular-nums"
                  value={questionCount}
                  min="1"
                  max="500"
                  onChange={e => setQuestionCount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="divider" style={{ margin: '1.5rem 0' }} />

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleStart(selectedCategory, selectedTask, questionCount, 'exam', false, false, '', customYear)}
              >
                <PlayCircle size={17} /> เริ่มสอบ (Exam Mode)
              </button>
              <button
                className="btn btn-accent"
                onClick={() => handleStart(selectedCategory, selectedTask, questionCount, 'practice', false, false, '', customYear)}
              >
                <BookOpen size={17} /> ฝึกซ้อม (Practice Mode)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
         TAB 4: สถิติของฉัน (My Stats)
      ════════════════════════════════════════════════ */}
      {activeTab === 'mystats' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Activity size={20} color="var(--primary-light)" />
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>สถิติส่วนตัวของคุณ {user?.username}</h2>
            </div>
            
            {!userStats ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูล...</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)' }}>{userStats.total_sessions}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>จำนวนครั้งที่ทำข้อสอบ</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{userStats.total_questions_answered}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>จำนวนข้อที่ตอบทั้งหมด</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{userStats.overall_accuracy}%</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>ความแม่นยำรวม</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-light)' }}>สถิติแยกตามรายวิชา</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
                  {userStats.category_stats.map((cat, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '1rem', borderLeft: `3px solid ${cat.accuracy >= 60 ? 'var(--success)' : 'var(--danger)'}` }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>{cat.category}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <span>ตอบถูก {cat.correct}/{cat.total} ข้อ</span>
                        <span className="tabular-nums" style={{ fontWeight: 600, color: cat.accuracy >= 60 ? 'var(--success)' : 'var(--danger)' }}>{cat.accuracy}%</span>
                      </div>
                      <div style={{ height: '5px', background: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${cat.accuracy}%`, background: cat.accuracy >= 60 ? 'var(--success)' : 'var(--danger)' }} />
                      </div>
                    </div>
                  ))}
                  {userStats.category_stats.length === 0 && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', gridColumn: '1 / -1', textAlign: 'center', padding: '1rem' }}>
                      คุณยังไม่มีประวัติการทำข้อสอบ ทำข้อสอบเพื่อดูสถิติแยกรายวิชาได้ที่นี่
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Category Detail Drill-down Modal */}
      {activeCategoryModal && (
        <CategoryDetailModal
          category={activeCategoryModal}
          tasks={activeCategoryModal.tasks}
          onClose={() => setActiveCategoryModal(null)}
          onStart={(cat, task, count, mode) => handleStart(cat, task, count, mode, false, false, '', '')}
          onOpenLawHub={onOpenLawHub}
        />
      )}

    </div>
  );
}
