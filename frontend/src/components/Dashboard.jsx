import React, { useState, useEffect } from 'react';
import {
  BookOpen, PlayCircle, ShieldAlert, Brain,
  Stethoscope, ChevronDown, ChevronUp, Sparkles, Settings2,
  Target, GraduationCap, Wrench, Clock, AlertTriangle, User as UserIcon, Activity, Trophy,
  Search, BookmarkCheck, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';
import Leaderboard from './Leaderboard';
import SearchPanel from './SearchPanel';
import BookmarksPanel from './BookmarksPanel';
import AdminPanel from './AdminPanel';
import MyReports from './MyReports';

const lawCategoryName = 'กฎหมายและจรรยาบรรณ';

export default function Dashboard({ categories, stats, taskStats, years, onStart, onOpenAIHub }) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('fullExam');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedYear, setSelectedYear] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [reviewData, setReviewData] = useState(null);

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

  const handleStart = (category = '', task = '', count = 10, mode = 'exam', ordered = false, clinical_only = false, part = '') => {
    onStart({ category, task, count, mode, year: selectedYear, ordered, clinical_only, part });
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

  const tabs = [
    { id: 'fullExam', label: 'สอบจัดเต็ม', icon: <Target size={16} />, emoji: '🎯' },
    { id: 'practice', label: 'ฝึกซ้อมรายวิชา', icon: <GraduationCap size={16} />, emoji: '📚' },
    { id: 'custom', label: 'สร้างข้อสอบเอง', icon: <Wrench size={16} />, emoji: '⚙️' },
    { id: 'search', label: 'ค้นหา', icon: <Search size={16} />, emoji: '🔍' },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={16} />, emoji: '🏆' },
    { id: 'aihub', label: 'AI Hub', icon: <Brain size={16} />, emoji: '🧠' },
  ];

  if (user) {
    tabs.push({ id: 'bookmarks', label: 'บุ๊กมาร์ก', icon: <BookmarkCheck size={16} />, emoji: '🔖' });
    tabs.push({ id: 'mystats', label: 'สถิติของฉัน', icon: <Activity size={16} />, emoji: '📊' });
    tabs.push({ id: 'myreports', label: 'ประวัติแจ้งปัญหา', icon: <AlertTriangle size={16} />, emoji: '⚠️' });
  }

  if (user && user.role === 'admin') {
    tabs.push({ id: 'admin', label: 'Admin', icon: <ShieldCheck size={16} />, emoji: '🛡️' });
  }

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

      {/* ── Tab Bar ──────────────────────────────────── */}
      <div className="dashboard-tab-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard-tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              if (tab.id === 'aihub') {
                onOpenAIHub();
              } else {
                setActiveTab(tab.id);
              }
            }}
          >
            <span className="dashboard-tab-emoji">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
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
                  style={{ borderRadius: '20px' }}
                >
                  พ.ศ. {yData.year}
                </button>
              ))}
            </div>
          </div>

          {/* Year Insights & Action Buttons */}
          {selectedYearData ? (
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
                            <span>{selectedYearData.parts?.['1']?.count || 75} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['1']?.stems || 25} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
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
                      </div>
                    </div>

                    {/* Part 2 */}
                    <div className="part-sim-item">
                      <div className="part-sim-header">
                        <div>
                          <div className="part-sim-name">🩺 Part 2</div>
                          <div className="part-sim-meta">
                            <span>{selectedYearData.parts?.['2']?.count || 75} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['2']?.stems || 25} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
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
                            <span>{selectedYearData.parts?.['3']?.count || 75} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['3']?.stems || 25} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
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
                      </div>
                    </div>

                    {/* Part 4 */}
                    <div className="part-sim-item">
                      <div className="part-sim-header">
                        <div>
                          <div className="part-sim-name">🩺 Part 4</div>
                          <div className="part-sim-meta">
                            <span>{selectedYearData.parts?.['4']?.count || 75} ข้อย่อ</span>
                            <span>•</span>
                            <span>{selectedYearData.parts?.['4']?.stems || 25} STEM</span>
                          </div>
                        </div>
                        <div className="part-sim-time">
                          <Clock size={14} /> 1 ชม. 45 นาที
                        </div>
                      </div>
                      <div className="part-sim-actions">
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
                          <span>{selectedYearData.law_count || 30} ข้อ</span>
                          <span>•</span>
                          <span>พ.ร.บ. & วิชาชีพ</span>
                        </div>
                      </div>
                      <div className="part-sim-time" style={{ color: 'var(--danger)' }}>
                        <Clock size={14} /> 1 ชั่วโมง
                      </div>
                    </div>
                    <div className="part-sim-actions" style={{ marginTop: '1rem' }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.4)', flex: 1 }}
                        onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 100, 'exam', true, false, 'law')}
                      >
                        <ShieldAlert size={14} /> สอบกฎหมาย
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => handleStart('กฎหมายและจรรยาบรรณ', '', 100, 'practice', true, false, 'law')}
                      >
                        <BookOpen size={14} /> ฝึกซ้อม
                      </button>
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
      {activeTab === 'practice' && (
        <div className="animate-fade-in">

          {/* ── Section: ภาคทฤษฎีคลินิก ───── */}
          <div className="section-header">
            <div className="section-header-left">
              <div className="section-icon clinical"><Stethoscope size={18} /></div>
              <div>
                <h2 className="section-title">ภาคทฤษฎีคลินิก</h2>
                <p className="section-subtitle">{totalClinical} ข้อ — เลือกวิชาที่ต้องการฝึกซ้อม</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => handleStart('', '', 20, 'exam')}>
                <PlayCircle size={14} /> สุ่มสอบ 20 ข้อ
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleStart('', '', 20, 'practice')}>
                <BookOpen size={14} /> สุ่มฝึก 20 ข้อ
              </button>
            </div>
          </div>

          <div className="category-grid">
            {clinicalStats.map((stat, i) => (
              <div
                key={stat.category}
                className={`category-card animate-fade-in delay-${Math.min(i * 100 + 100, 400)}`}
              >
                <div>
                  <div className="category-count">{stat.count}</div>
                  <div className="category-card-name">{stat.category}</div>
                </div>
                <div className="category-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleStart(stat.category, '', Math.min(stat.count, 20), 'exam')}
                  >
                    <PlayCircle size={13} /> สอบ
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleStart(stat.category, '', Math.min(stat.count, 20), 'practice')}
                  >
                    <BookOpen size={13} /> ฝึก
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Section: ภาคกฎหมาย ───── */}
          <div className="section-header" style={{ marginTop: '2.5rem' }}>
            <div className="section-header-left">
              <div className="section-icon law"><ShieldAlert size={18} /></div>
              <div>
                <h2 className="section-title">ภาคกฎหมายและจรรยาบรรณ</h2>
                <p className="section-subtitle">{totalLaw} ข้อ — ข้อสอบกฎหมาย ระเบียบ และจรรยาบรรณ</p>
              </div>
            </div>
          </div>

          <div className="category-grid">
            {taskStats.filter(t => [
              "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
              "จรรยาบรรณแห่งวิชาชีพทันตกรรม",
              "พ.ร.บ. สถานพยาบาล พ.ศ. 2541",
              "กฎหมายอื่นๆ ที่เกี่ยวข้อง"
            ].includes(t.task)).map((stat, i) => (
              <div
                key={stat.task}
                className={`category-card animate-fade-in delay-${Math.min(i * 100 + 100, 400)}`}
                style={{ borderLeft: '3px solid var(--danger)' }}
              >
                <div>
                  <div className="category-count" style={{ color: 'var(--danger)' }}>{stat.count}</div>
                  <div className="category-card-name" style={{ fontSize: '0.85rem' }}>{stat.task}</div>
                </div>
                <div className="category-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleStart(lawCategoryName, stat.task, Math.min(stat.count, 20), 'exam')}
                  >
                    <PlayCircle size={13} /> สอบ
                  </button>
                  <button
                    className="btn btn-accent btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleStart(lawCategoryName, stat.task, Math.min(stat.count, 20), 'practice')}
                  >
                    <BookOpen size={13} /> ฝึก
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  onChange={e => setSelectedCategory(e.target.value)}
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
                  {categories.tasks?.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
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

    </div>
  );
}
