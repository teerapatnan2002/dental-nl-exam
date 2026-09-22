import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, PlayCircle, ShieldAlert, Brain,
  Stethoscope, ChevronDown, ChevronUp, Sparkles, Settings2,
  Target, GraduationCap, Wrench, Clock, AlertTriangle, User as UserIcon, Activity, Trophy,
  Search, BookmarkCheck, ShieldCheck, MoreHorizontal, ChevronRight, Calendar, Flame
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
import { calculateTimeRemaining } from '../data/examSchedule';

const lawCategoryName = 'กฎหมายและจรรยาบรรณ';

export default function Dashboard({ categories, stats, taskStats, categoryTasks = {}, years, onStart, onOpenAIHub, onOpenLawHub, onOpenScheduleModal }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('fullExam');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedYear, setSelectedYear] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeCategoryModal, setActiveCategoryModal] = useState(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Live countdown to Saturday Mock 70 Exam (26 Sep 2026, 17:35)
  const [mock70TimeLeft, setMock70TimeLeft] = useState(() => calculateTimeRemaining('2026-09-26T17:35:00+07:00'));

  useEffect(() => {
    const timer = setInterval(() => {
      setMock70TimeLeft(calculateTimeRemaining('2026-09-26T17:35:00+07:00'));
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
    }
  }, [token]);

  const handleStart = (category = '', task = '', count = 10, mode = 'exam', ordered = false, clinical_only = false, part = '', year = undefined) => {
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

  const lawStats = stats.find(s => s.category === lawCategoryName);
  const clinicalStats = stats.filter(s => s.category && s.category !== lawCategoryName);
  const totalClinical = clinicalStats.reduce((acc, cur) => acc + cur.count, 0);
  const totalLaw = lawStats ? lawStats.count : 0;
  const totalQuestions = totalClinical + totalLaw;

  const selectedYearData = selectedYear ? years.find(y => y.year === selectedYear) : null;

  const mainTabs = [
    { id: 'fullExam', label: 'สอบจัดเต็ม', emoji: '🎯' },
    { id: 'practice', label: 'ฝึกซ้อมรายวิชา', emoji: '📚' },
    { id: 'custom', label: 'สร้างข้อสอบเอง', emoji: '⚙️' },
    { id: 'law_hub', label: 'สรุปกฎหมาย & บัตรคำ', emoji: '⚖️' },
    { id: 'aihub', label: 'AI Hub', emoji: '🧠' },
  ];

  const toolsGroup = [
    { id: 'law_hub_tool', label: 'สรุปกฎหมาย & Flashcards', desc: 'ผังมโนทัศน์ 5 เสาหลัก & บัตรคำช่วยจำ', emoji: '⚖️' },
    { id: 'search', label: 'ค้นหาข้อสอบ', desc: 'ค้นหาโจทย์ตามคำค้นหา', emoji: '🔍' },
    { id: 'leaderboard', label: 'Leaderboard', desc: 'อันดับคะแนนและผู้ทำโจทย์', emoji: '🏆' },
  ];

  const personalGroup = user ? [
    { id: 'bookmarks', label: 'บุ๊กมาร์กของฉัน', desc: 'ข้อสอบที่บันทึกไว้ทบทวน', emoji: '🔖' },
    { id: 'mystats', label: 'สถิติของฉัน', desc: 'ประวัติและวิเคราะห์จุดอ่อน', emoji: '📊' },
    { id: 'myreports', label: 'ประวัติแจ้งปัญหา', desc: 'ติดตามสถานะการแจ้งข้อสอบ', emoji: '⚠️' },
  ] : [];

  const adminGroup = (user && user.role === 'admin') ? [
    { id: 'admin', label: 'Admin Panel', desc: 'จัดการข้อสอบและรายงานปัญหา', emoji: '🛡️' },
  ] : [];

  const allMoreTabs = [...toolsGroup, ...personalGroup, ...adminGroup];
  const activeMoreTab = allMoreTabs.find(t => t.id === activeTab);
  const isMoreActive = Boolean(activeMoreTab);

  return (
    <div className="animate-fade-in">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="hero-section glass-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="hero-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Thai National License
            </div>
            <h1 className="gradient-text" style={{ marginBottom: '0.5rem' }}>🦷 NL Dental Exam</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.65 }}>
              เตรียมสอบใบประกอบวิชาชีพทันตแพทย์ด้วยระบบ AI วิเคราะห์แนวโน้มและสร้างข้อสอบจำลอง
            </p>
            {reviewData && reviewData.count > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleStartReview}
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none' }}
                >
                  <AlertTriangle size={18} /> ทบทวนข้อที่เคยทำผิด ({reviewData.count} ข้อ)
                </button>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="stat-counter">{totalQuestions.toLocaleString()}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Total Questions
            </div>
          </div>
        </div>
      </div>

      {/* ── Official Exam Countdown Banner ────────────── */}
      <ExamCountdown
        onStartExam={handleStart}
        onOpenLawHub={onOpenLawHub}
        onOpenScheduleModal={onOpenScheduleModal}
      />

      {/* ── Grouped Tab Bar with Dropdown ─────────────── */}
      <div className="dashboard-tab-bar" role="tablist" aria-label="Main Navigation">
        {mainTabs.map(tab => (
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
            <span className="dashboard-tab-emoji" aria-hidden="true">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="dashboard-tab-emoji" aria-hidden="true">
                {activeMoreTab ? activeMoreTab.emoji : '✨'}
              </span>
              <span>{activeMoreTab ? activeMoreTab.label : 'เพิ่มเติม'}</span>
            </div>
            {moreMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {moreMenuOpen && (
            <div className="tab-dropdown-menu" role="menu">
              {/* Group 1: Tools & Community */}
              <div className="tab-dropdown-section-title">เครื่องมือ & สถิติ</div>
              {toolsGroup.map(item => (
                <button
                  key={item.id}
                  role="menuitem"
                  className={`tab-dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    if (item.id === 'law_hub_tool') {
                      if (onOpenLawHub) onOpenLawHub();
                      setMoreMenuOpen(false);
                      return;
                    }
                    setActiveTab(item.id);
                    setMoreMenuOpen(false);
                  }}
                >
                  <span className="tab-dropdown-item-icon" aria-hidden="true">{item.emoji}</span>
                  <div className="tab-dropdown-item-info">
                    <span className="tab-dropdown-item-label">{item.label}</span>
                    <span className="tab-dropdown-item-desc">{item.desc}</span>
                  </div>
                </button>
              ))}

              {/* Group 2: Personal */}
              {personalGroup.length > 0 && (
                <>
                  <div className="tab-dropdown-divider" />
                  <div className="tab-dropdown-section-title">ข้อมูลของฉัน</div>
                  {personalGroup.map(item => (
                    <button
                      key={item.id}
                      role="menuitem"
                      className={`tab-dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMoreMenuOpen(false);
                      }}
                    >
                      <span className="tab-dropdown-item-icon" aria-hidden="true">{item.emoji}</span>
                      <div className="tab-dropdown-item-info">
                        <span className="tab-dropdown-item-label">{item.label}</span>
                        <span className="tab-dropdown-item-desc">{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* Group 3: Admin */}
              {adminGroup.length > 0 && (
                <>
                  <div className="tab-dropdown-divider" />
                  <div className="tab-dropdown-section-title">ผู้ดูแลระบบ</div>
                  {adminGroup.map(item => (
                    <button
                      key={item.id}
                      role="menuitem"
                      className={`tab-dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMoreMenuOpen(false);
                      }}
                    >
                      <span className="tab-dropdown-item-icon" aria-hidden="true">{item.emoji}</span>
                      <div className="tab-dropdown-item-info">
                        <span className="tab-dropdown-item-label">{item.label}</span>
                        <span className="tab-dropdown-item-desc">{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

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
          <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Target size={18} color="var(--primary-light)" />
              <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>เลือกปีข้อสอบ</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${selectedYear === '' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedYear('')}
                style={{ borderRadius: '20px' }}
              >
                ทั้งหมด
              </button>
              {years && years.map(yData => (
                <button
                  key={yData.year}
                  className={`btn btn-sm ${selectedYear === yData.year ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedYear(yData.year)}
                  style={{
                    borderRadius: '20px',
                    ...(yData.year === '2570' ? {
                      border: '1px solid #ec4899',
                      background: selectedYear === '2570' ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(236, 72, 153, 0.15)',
                      color: selectedYear === '2570' ? '#fff' : '#f472b6',
                      fontWeight: 700
                    } : {})
                  }}
                >
                  {yData.year === '2570' ? '🎯 พ.ศ. 2570 (Mock 70)' : `พ.ศ. ${yData.year}`}
                </button>
              ))}
            </div>
          </div>

          {/* Year Insights & Action Buttons */}
          {selectedYearData ? (
            selectedYearData.year === '2570' ? (
              <div className="glass-panel animate-fade-in" style={{
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                background: 'linear-gradient(135deg, rgba(20, 15, 35, 0.95) 0%, rgba(35, 15, 40, 0.9) 100%)',
                boxShadow: '0 12px 36px rgba(236, 72, 153, 0.12)'
              }}>
                {/* ── Mock 70 Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#f472b6', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                      <Flame size={14} /> ข้อสอบเก็งเสมือนจริง พิมพ์เขียว ศ.ป.ท. พ.ศ. 2570
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: '#fff', letterSpacing: '-0.02em' }}>
                      🎯 ศ.ป.ท. Mock Exam 2570: กฎหมายและจรรยาบรรณวิชาชีพ
                    </h2>
                    <div style={{ color: 'var(--text-sub)', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.5 }}>
                      ชุดข้อสอบจำลองเสมือนจริง <strong>30 ข้อ (10 STEM สถานการณ์คลินิก × 3 ข้อย่อย)</strong> คัดสรรครอบคลุมประเด็นข้อสอบจริง พ.ร.บ. วิชาชีพทันตกรรม, พ.ร.บ. สถานพยาบาล, สิทธิผู้ป่วย, PDPA และทันตนิติเวชศาสตร์
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', background: 'linear-gradient(135deg, #ec4899, #be185d)', border: 'none', color: '#fff' }}>
                      30 ข้อ • 45 นาที
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      เกณฑ์ผ่าน: 60% (18/30 ข้อ)
                    </div>
                  </div>
                </div>

                {/* ── Schedule & Live Countdown Banner ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.75rem',
                  background: 'rgba(15, 23, 42, 0.65)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {/* Schedule Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6', fontWeight: 700, fontSize: '0.95rem' }}>
                      <Calendar size={16} /> กำหนดการสอบรอบเสมือนจริง (ตามตารางจริง ศ.ป.ท.)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.88rem', color: 'var(--text)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)', width: '90px' }}>🗓️ วันที่สอบ:</span>
                        <strong>วันเสาร์ที่ 26 กันยายน 2569</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)', width: '90px' }}>⏰ เวลาสอบ:</span>
                        <strong style={{ color: '#ec4899' }}>17:35 – 18:20 น.</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)', width: '90px' }}>⏳ ระยะเวลา:</span>
                        <span><strong>45 นาที</strong> (ข้อละ 1.5 นาที เป๊ะตามเวลาสอบจริง)</span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown Box */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(236, 72, 153, 0.08)',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: '#f472b6', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} /> {mock70TimeLeft.isExpired ? '🔥 ระบบเปิดให้สอบรอบจริงแล้ว' : 'นับถอยหลังสู่เวลาสอบวันเสาร์นี้ (17:35 น.)'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.2rem 0' }}>
                      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.6rem', borderRadius: '8px', minWidth: '46px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(mock70TimeLeft.days).padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>วัน</div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#ec4899' }}>:</span>
                      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.6rem', borderRadius: '8px', minWidth: '46px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(mock70TimeLeft.hours).padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ชม.</div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#ec4899' }}>:</span>
                      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.6rem', borderRadius: '8px', minWidth: '46px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{String(mock70TimeLeft.minutes).padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>นาที</div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#ec4899' }}>:</span>
                      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.6rem', borderRadius: '8px', minWidth: '46px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f472b6', fontFamily: 'monospace' }}>{String(mock70TimeLeft.seconds).padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>วินาที</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', marginTop: '0.4rem' }}>
                      *ระบบเปิดให้ผู้สอบเข้าฝึกซ้อมและทำข้อสอบล่วงหน้าได้ตลอด 24 ชม.*
                    </div>
                  </div>
                </div>

                {/* ── Main Action Buttons Grid ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {/* 1. Real Exam Simulation Mode */}
                  <button
                    onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 30, 'exam', true, false, 'law', '2570')}
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '1.25rem',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      gap: '0.4rem',
                      boxShadow: '0 6px 20px rgba(236, 72, 153, 0.35)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.05rem' }}>
                        <PlayCircle size={20} /> เข้าสอบจำลองเสมือนจริง (Exam Mode)
                      </div>
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>45 นาที</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', opacity: 0.9, lineHeight: 1.4 }}>
                      จับเวลาถอยหลัง 45 นาที ไม่แสดงเฉลยระหว่างทำ ประมวลผลและตัดเกรดเสมือนห้องสอบจริง
                    </div>
                  </button>

                  {/* 2. Practice Mode */}
                  <button
                    onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 30, 'practice', true, false, 'law', '2570')}
                    className="btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '1.25rem',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-light)' }}>
                        <BookOpen size={20} /> ซ้อมทำทีละข้อ (Practice Mode)
                      </div>
                      <span style={{ background: 'rgba(124, 58, 237, 0.2)', color: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>เฉลยทันที</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.4 }}>
                      ทำทีละข้อ ดูเฉลยละเอียดและวิเคราะห์กับดักข้อสอบทันทีที่ตอบ ไม่จำกัดเวลา
                    </div>
                  </button>

                  {/* 3. Law Hub / Flashcards */}
                  <button
                    onClick={() => onOpenLawHub && onOpenLawHub()}
                    className="btn"
                    style={{
                      background: 'rgba(244, 63, 94, 0.08)',
                      color: '#fb7185',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                      padding: '1.25rem',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.05rem' }}>
                        <Sparkles size={20} /> สรุปมาตรา & Flashcards กฎหมาย
                      </div>
                      <span style={{ background: 'rgba(244, 63, 94, 0.2)', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>ติวเข้ม</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.4 }}>
                      สรุปหัวใจสำคัญของ พ.ร.บ. วิชาชีพ, พ.ร.บ. สถานพยาบาล, ทันตนิติเวช และแนววินิจฉัยคดี
                    </div>
                  </button>
                </div>

                {/* ── 10 STEMs Breakdown Grid ── */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="divider" style={{ margin: '1.5rem 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--primary-light)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldAlert size={18} color="#ec4899" /> โครงสร้าง 10 STEM สถานการณ์ใน Mock 70 (30 ข้อเต็ม)
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      10 สถานการณ์ STEM คลินิก × 3 ข้อย่อย = 30 ข้อ
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '0.85rem'
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
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f472b6' }}>
                            STEM {item.stem} ({item.qRange})
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            3 ข้อย่อย
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)' }}>
                          📌 {item.law}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.3rem 0', color: 'var(--primary-light)' }}>
                  📋 ข้อสอบปี พ.ศ. {selectedYearData.year}
                </h2>
                <div style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
                  จำนวนทั้งหมด <strong>{selectedYearData.total}</strong> ข้อ 
                  (ทฤษฎีคลินิก {selectedYearData.clinical_count} ข้อ | กฎหมาย {selectedYearData.law_count} ข้อ)
                </div>
              </div>

              {/* ── 2-Day / 4-Part Exam Simulation System ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>

                {/* Day 1: Part 1 & Part 2 */}
                <div className="day-sim-section day1">
                  <div className="day-sim-header">
                    <div>
                      <div className="day-sim-title">
                        <span>📅 วันที่ 1 (Day 1) — ทฤษฎีคลินิก Part 1 & 2</span>
                        <span className="badge badge-primary">150 ข้อ • รวม 3.5 ชม.</span>
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
                          <div className="part-sim-name">🩺 Part 1</div>
                          <div className="part-sim-meta">
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
                          <div className="part-sim-name">🩺 Part 2</div>
                          <div className="part-sim-meta">
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
                        <span>📅 วันที่ 2 (Day 2) — ทฤษฎีคลินิก Part 3 & 4</span>
                        <span className="badge badge-accent">150 ข้อ • รวม 3.5 ชม.</span>
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
                          <div className="part-sim-name">🩺 Part 3</div>
                          <div className="part-sim-meta">
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
                          <div className="part-sim-name">🩺 Part 4</div>
                          <div className="part-sim-meta">
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  
                  {/* Law Card */}
                  <div className="day-sim-section law" style={{ margin: 0 }}>
                    <div className="part-sim-header">
                      <div>
                        <div className="part-sim-name" style={{ color: 'var(--danger)' }}>⚖️ กฎหมายและจรรยาบรรณ</div>
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
                            style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.4)', flex: 1 }}
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
                              style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.4)', flex: 1 }}
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
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            *(ปี พ.ศ. {selectedYearData.year} ไม่มีข้อสอบกฎหมายแยก ระบบจึงสุ่ม 30 ข้อจากคลังรวมให้ฝึกทำครบหมวด)*
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* All 4 Parts Marathon Card */}
                  <div className="day-sim-section" style={{ margin: 0, borderTop: '3px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="part-sim-header">
                      <div>
                        <div className="part-sim-name" style={{ color: '#10b981' }}>🏆 สอบคลินิกครบ 4 Parts</div>
                        <div className="part-sim-meta">
                          <span>{selectedYearData.clinical_count} ข้อ (100 STEM)</span>
                        </div>
                      </div>
                      <div className="part-sim-time" style={{ color: '#10b981' }}>
                        <Clock size={14} /> รวม 7 ชม.
                      </div>
                    </div>
                    <div className="part-sim-actions" style={{ marginTop: '1rem' }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', width: '100%' }}
                        onClick={() => handleStart('', '', 1000, 'exam', true, true, '')}
                      >
                        <Sparkles size={14} /> เริ่มสอบจำลอง 4 Parts มาราธอน
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Year Insights Grid */}
              <div style={{ marginTop: '2rem' }}>
                <div className="divider" />
                
                <h3 style={{ margin: '1.5rem 0 1rem', color: 'var(--primary-light)', fontSize: '1.1rem' }}>
                  <Stethoscope size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }} />
                  สถิติ: คลินิก (Clinical)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Clinical Categories */}
                  <div className="insight-card">
                    <div className="insight-card-title">
                      หมวดวิชาที่ออกมาก (Top Subjects)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {selectedYearData.categories.filter(c => c.name !== 'กฎหมายและจรรยาบรรณ').slice(0, 6).map((cat, idx) => (
                        <div key={cat.name} className="insight-row">
                          <div className="insight-rank" style={{ background: idx < 3 ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)', color: idx < 3 ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cat.name}
                          </div>
                          <div className="badge badge-primary" style={{ fontSize: '0.78rem' }}>{cat.count} ข้อ</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Tasks */}
                  <div className="insight-card">
                    <div className="insight-card-title">
                      ทักษะวิชาชีพที่เน้น (Top Tasks)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {selectedYearData.tasks.filter(t => !['พ.ร.บ.', 'กฎหมาย', 'จรรยาบรรณ'].some(kw => t.name.includes(kw)) && t.name.trim() !== '').slice(0, 5).map((task, idx) => (
                        <div key={task.name} className="insight-row">
                          <div className="insight-rank" style={{ background: idx < 3 ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)', color: idx < 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.name}
                          </div>
                          <div className="badge badge-accent" style={{ fontSize: '0.78rem' }}>{task.count} ข้อ</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 style={{ margin: '2rem 0 1rem', color: 'var(--danger)', fontSize: '1.1rem' }}>
                  <ShieldAlert size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }} />
                  สถิติ: กฎหมายและจรรยาบรรณ (Law)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Law Tasks */}
                  <div className="insight-card" style={{ borderTop: '2px solid rgba(244,63,94,0.3)' }}>
                    <div className="insight-card-title" style={{ color: 'var(--danger)' }}>
                      ทักษะที่เน้น (Top Law Tasks)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {selectedYearData.tasks.filter(t => ['พ.ร.บ.', 'กฎหมาย', 'จรรยาบรรณ'].some(kw => t.name.includes(kw))).map((task, idx) => (
                        <div key={task.name} className="insight-row">
                          <div className="insight-rank" style={{ background: idx < 3 ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.05)', color: idx < 3 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.name}
                          </div>
                          <div className="badge badge-primary" style={{ background: 'rgba(244,63,94,0.15)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)', fontSize: '0.78rem' }}>{task.count} ข้อ</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
            /* No year selected – show overview */
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>เลือกปีข้อสอบเพื่อเริ่มสอบจำลอง</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                กดเลือกปีด้านบนเพื่อดูข้อมูลสถิติ และเริ่มสอบแบบจับเวลาเสมือนจริง
              </p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)' }}>{totalClinical}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ข้อสอบทฤษฎีคลินิก</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>{totalLaw}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ข้อสอบกฎหมาย</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{years ? years.length : 0}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ปีที่มีข้อสอบ</div>
                </div>
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
            color: '#06b6d4',
            bg: 'rgba(6, 182, 212, 0.12)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            icon: '🦷',
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
            color: '#a78bfa',
            bg: 'rgba(124, 58, 237, 0.12)',
            borderColor: 'rgba(124, 58, 237, 0.3)',
            icon: '🩺',
            categoryNames: [
              'วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก',
              'ศัลยศาสตร์ช่องปาก'
            ]
          },
          {
            id: 'pediatric_ortho_community',
            title: 'กลุ่มทันตกรรมเด็ก จัดฟัน และทันตสาธารณสุข',
            sub: 'Pediatric Dentistry, Orthodontics & Dental Public Health',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.12)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            icon: '👶',
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
            color: '#f43f5e',
            bg: 'rgba(244, 63, 94, 0.12)',
            borderColor: 'rgba(244, 63, 94, 0.3)',
            icon: '⚖️',
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
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Quick Random Buttons */}
            <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.2rem 0', color: 'var(--text)' }}>
                  📚 ฝึกซ้อมแยกตามสาขาวิชาทันตกรรม
                </h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  รวมข้อสอบทั้งหมด {totalQuestions.toLocaleString()} ข้อ (ทฤษฎีคลินิก {totalClinical} ข้อ | กฎหมาย {totalLaw} ข้อ)
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
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
                      <div className="day-sim-title" style={{ fontSize: '1.1rem' }}>
                        <span>{grp.icon} {grp.title}</span>
                        <span className="badge" style={{ background: grp.bg, color: grp.color, border: `1px solid ${grp.borderColor}`, fontSize: '0.8rem' }}>
                          {grp.count} ข้อ
                        </span>
                      </div>
                      <div className="day-sim-subtitle" style={{ fontSize: '0.82rem' }}>{grp.sub}</div>
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
                            <div className="category-count" style={{ color: grp.color }}>{stat.count}</div>
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
                              className="btn btn-sm"
                              onClick={onOpenLawHub}
                              style={{
                                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                                color: '#fff',
                                border: 'none',
                                boxShadow: '0 2px 10px rgba(124, 58, 237, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                fontWeight: 600,
                                padding: '0.4rem 0.6rem',
                                fontSize: '0.78rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                width: '100%'
                              }}
                            >
                              <span>🎴 สรุปกฎหมาย & Flashcards</span>
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
                              <span>
                                🎯 {grp.isLaw ? 'เลือกตามหมวดกฎหมาย' : 'เลือกตามสมรรถนะ'} ({subtasks.length})
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
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Settings2 size={20} color="var(--primary-light)" />
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>สร้างข้อสอบเองตามต้องการ</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">📋 วิชา / สาขา</label>
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
                <label className="input-label">🎯 ทักษะวิชาชีพ (Task)</label>
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
                          <optgroup label="🩺 ทักษะทางคลินิก (Clinical Tasks)">
                            {clinicalTasks.map(t => <option key={t} value={t}>{t}</option>)}
                          </optgroup>
                          <optgroup label="⚖️ หมวดกฎหมาย (Law & Ethics)">
                            {lawTasks.map(t => <option key={t} value={t}>{t}</option>)}
                          </optgroup>
                        </>
                      );
                    }
                  })()}
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">📅 ปีข้อสอบ (พ.ศ.)</label>
                <select
                  className="input-select"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  <option value="">ทุกปี (ทั้งหมด)</option>
                  {years && years.map(yData => (
                    <option key={yData.year} value={yData.year}>พ.ศ. {yData.year}</option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">🔢 จำนวนข้อ</label>
                <input
                  type="number"
                  className="input-number"
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
                onClick={() => handleStart(selectedCategory, selectedTask, questionCount, 'exam')}
              >
                <PlayCircle size={17} /> เริ่มสอบ (Exam Mode)
              </button>
              <button
                className="btn btn-accent"
                onClick={() => handleStart(selectedCategory, selectedTask, questionCount, 'practice')}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{userStats.total_sessions}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>จำนวนครั้งที่ทำข้อสอบ</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{userStats.total_questions_answered}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>จำนวนข้อที่ตอบทั้งหมด</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{userStats.overall_accuracy}%</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>ความแม่นยำรวม</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-light)' }}>สถิติแยกตามรายวิชา</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {userStats.category_stats.map((cat, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '1rem', borderLeft: `3px solid ${cat.accuracy >= 60 ? 'var(--success)' : 'var(--danger)'}` }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>{cat.category}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <span>ตอบถูก {cat.correct}/{cat.total} ข้อ</span>
                        <span style={{ fontWeight: 600, color: cat.accuracy >= 60 ? 'var(--success)' : 'var(--danger)' }}>{cat.accuracy}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
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
