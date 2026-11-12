import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  BookOpen, Search, Sparkles, AlertTriangle, ArrowLeft, 
  CheckCircle2, XCircle, Compass, Award, Bookmark, 
  Layers, ChevronRight, ChevronLeft, Play, BookMarked, Share2, 
  Lightbulb, X, GraduationCap, Brain, FileText, Eye, Check, Filter
} from 'lucide-react';
import { API_BASE } from '../config';
import { 
  SPECIALTY_CATEGORIES, 
  CLINICAL_STUDY_GUIDES, 
  getGuidesBySpecialty 
} from '../data/clinicalStudyGuides';

const SPECIALTY_COLOR_MAP = {
  'วิทยาเอ็นโดดอนต์': '#ec4899',
  'ศัลยศาสตร์ช่องปาก': '#f59e0b',
  'ทันตกรรมประดิษฐ์': '#38bdf8',
  'ปริทันตวิทยา': '#10b981',
  'ทันตกรรมบูรณะ/หัตถการ': '#6366f1',
  'ทันตกรรมสำหรับเด็ก': '#8b5cf6',
  'วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก': '#a855f7',
  'ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า': '#06b6d4',
  'ทันตกรรมจัดฟัน': '#f472b6',
  'ทันตกรรมชุมชน': '#059669',
  'กฎหมายและจรรยาบรรณ': '#f43f5e',
};

export default function ClinicalStudyHub({ 
  onBack, 
  onStartExam, 
  initialTopicId = null,
  isModal = false,
  onClose = null 
}) {
  // Primary Mode: 'exam_topics' (83 DB Topics), 'textbooks' (14 Gold Standard Textbooks), 'masterclass' (25 Curated Guides)
  const [hubMode, setHubMode] = useState('exam_topics');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Overview data from /api/learning/overview
  const [overviewData, setOverviewData] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Selected IDs
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId || 'Endo-Pulp-Periapical-Diagnosis');
  const [selectedTextbookId, setSelectedTextbookId] = useState('cohen-endodontics');
  const [selectedMasterclassId, setSelectedMasterclassId] = useState(
    initialTopicId && CLINICAL_STUDY_GUIDES[initialTopicId] 
      ? initialTopicId 
      : Object.keys(CLINICAL_STUDY_GUIDES)[0]
  );

  // Active Module Data from /api/learning/topic/{id} or /api/learning/textbook/{id}
  const [moduleData, setModuleData] = useState(null);
  const [loadingModule, setLoadingModule] = useState(false);

  // Classroom Sub-Tabs: 'synthesized' | 'guided_teacher' | 'differential' | 'pearls_traps'
  const [classroomTab, setClassroomTab] = useState('synthesized');
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('all');
  const [selectedCogFilter, setSelectedCogFilter] = useState('all');

  // 4-Step Guided Case Teacher State
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [guidedStep, setGuidedStep] = useState(1); // 1: Read Textbook Theory, 2: Solve Case, 3: Full Evidence Resolution
  const [showAllGuidedSteps, setShowAllGuidedSteps] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Load overview on mount
  useEffect(() => {
    setLoadingOverview(true);
    fetch(`${API_BASE}/api/learning/overview`)
      .then(res => res.json())
      .then(data => {
        setOverviewData(data);
        if (initialTopicId) {
          const existsInDb = data?.topics?.some(t => t.id === initialTopicId);
          if (existsInDb) {
            setSelectedTopicId(initialTopicId);
            setHubMode('exam_topics');
          } else if (CLINICAL_STUDY_GUIDES[initialTopicId]) {
            setSelectedMasterclassId(initialTopicId);
            setHubMode('masterclass');
          }
        } else if (data?.topics?.length > 0 && !selectedTopicId) {
          setSelectedTopicId(data.topics[0].id);
        }
      })
      .catch(err => console.error('Failed to load learning overview:', err))
      .finally(() => setLoadingOverview(false));
  }, [initialTopicId]);

  // Fetch topic or textbook pedagogical module when selection changes
  const fetchPedagogicalModule = useCallback((mode, id) => {
    if (!id) return;
    setLoadingModule(true);
    const endpoint = mode === 'textbooks' 
      ? `${API_BASE}/api/learning/textbook/${encodeURIComponent(id)}`
      : `${API_BASE}/api/learning/topic/${encodeURIComponent(id)}`;

    fetch(endpoint)
      .then(res => {
        if (!res.ok) throw new Error('Module not found');
        return res.json();
      })
      .then(data => {
        setModuleData(data);
        setSelectedTaskFilter('all');
        setSelectedCogFilter('all');
        setActiveCaseIndex(0);
        setGuidedStep(1);
        setSelectedChoice(null);
      })
      .catch(err => {
        console.error('Error loading pedagogical module:', err);
        setModuleData(null);
      })
      .finally(() => setLoadingModule(false));
  }, []);

  useEffect(() => {
    if (hubMode === 'exam_topics' && selectedTopicId) {
      fetchPedagogicalModule('exam_topics', selectedTopicId);
    } else if (hubMode === 'textbooks' && selectedTextbookId) {
      fetchPedagogicalModule('textbooks', selectedTextbookId);
    }
  }, [hubMode, selectedTopicId, selectedTextbookId, fetchPedagogicalModule]);

  // Filtered Sidebar Items
  const filteredTopics = useMemo(() => {
    if (!overviewData?.topics) return [];
    let list = overviewData.topics;
    if (selectedSpecialty !== 'all') {
      list = list.filter(t => t.category === selectedSpecialty);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.title_th.toLowerCase().includes(q) ||
        t.title_en.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.sample_references && t.sample_references.some(r => r.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [overviewData, selectedSpecialty, searchQuery]);

  const filteredTextbooks = useMemo(() => {
    if (!overviewData?.textbooks) return [];
    let list = overviewData.textbooks;
    if (selectedSpecialty !== 'all') {
      list = list.filter(tb => tb.specialty === selectedSpecialty);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(tb =>
        tb.title.toLowerCase().includes(q) ||
        tb.description.toLowerCase().includes(q) ||
        tb.specialty.toLowerCase().includes(q) ||
        (tb.topics && tb.topics.some(t => t.title_th.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [overviewData, selectedSpecialty, searchQuery]);

  const filteredMasterclass = useMemo(() => {
    const list = getGuidesBySpecialty(selectedSpecialty);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.overview.toLowerCase().includes(q) ||
      g.core_mechanism.toLowerCase().includes(q) ||
      (g.must_know_topics && g.must_know_topics.some(t => t.toLowerCase().includes(q)))
    );
  }, [selectedSpecialty, searchQuery]);

  // Filtered Guided Cases for Step-by-Step Teacher
  const filteredGuidedCases = useMemo(() => {
    if (!moduleData?.guided_cases) return [];
    return moduleData.guided_cases.filter(c => {
      const matchCog = selectedCogFilter === 'all' || c.cognitive_level === selectedCogFilter;
      const matchTask = selectedTaskFilter === 'all' || c.task === selectedTaskFilter;
      return matchCog && matchTask;
    });
  }, [moduleData, selectedCogFilter, selectedTaskFilter]);

  const currentGuidedCase = filteredGuidedCases[activeCaseIndex] || filteredGuidedCases[0] || null;

  // Matching curated Masterclass guide (for decision matrix integration)
  const matchingMasterclass = useMemo(() => {
    if (hubMode === 'masterclass') {
      return CLINICAL_STUDY_GUIDES[selectedMasterclassId] || null;
    }
    if (hubMode === 'exam_topics' && selectedTopicId && CLINICAL_STUDY_GUIDES[selectedTopicId]) {
      return CLINICAL_STUDY_GUIDES[selectedTopicId];
    }
    return null;
  }, [hubMode, selectedMasterclassId, selectedTopicId]);

  const handleOpenCaseInTeacher = (questionId) => {
    if (!moduleData?.guided_cases) return;
    setSelectedCogFilter('all');
    setSelectedTaskFilter('all');
    const idx = moduleData.guided_cases.findIndex(c => c.id === questionId);
    if (idx !== -1) {
      setActiveCaseIndex(idx);
      setGuidedStep(1);
      setSelectedChoice(null);
      setClassroomTab('guided_teacher');
    }
  };

  const handleStartTopicPractice = () => {
    if (!onStartExam) return;
    if (moduleData?.guided_cases?.length > 0) {
      const rawQuestions = moduleData.guided_cases.map(c => c.raw_question);
      onStartExam({
        mode: 'practice',
        questions: rawQuestions.slice(0, 20),
        count: Math.min(20, rawQuestions.length),
      });
      if (isModal && onClose) onClose();
    } else if (matchingMasterclass) {
      onStartExam({
        category: matchingMasterclass.category,
        count: 10,
        mode: 'practice',
      });
      if (isModal && onClose) onClose();
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const containerStyle = isModal ? {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    background: 'rgba(10, 15, 29, 0.90)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.25rem',
  } : {
    width: '100%',
    paddingBottom: '4rem',
  };

  const innerStyle = isModal ? {
    width: '100%',
    maxWidth: '1280px',
    maxHeight: '94vh',
    background: 'var(--bg-surface, #0f172a)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
  } : {};

  return (
    <div style={containerStyle}>
      <div style={innerStyle} className="animate-fade-in">
        
        {/* ══════════════════════════════════════════════════════════════════
            1. TOP HEADER & 3-MODE PEDAGOGICAL SWITCHER
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.06))',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onBack && !isModal && (
              <button 
                onClick={onBack}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> กลับหน้าหลัก
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
              }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  ระบบการเรียนรู้จากข้อสอบด้วย Textbook & Evidence (Exam-Driven Academy)
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  สกัดเนื้อหา ทฤษฎี และกลไกจากข้อสอบจริง {overviewData?.summary?.total_questions?.toLocaleString() || '2,443'} ข้อ ครบ {overviewData?.summary?.total_topics || 83} หัวข้อ มาสอนตามตำราอ้างอิงมาตรฐาน
                </span>
              </div>
            </div>
          </div>

          {/* 3-Mode Switcher Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setHubMode('exam_topics')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: hubMode === 'exam_topics' ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                color: hubMode === 'exam_topics' ? '#fff' : 'var(--text-sub)',
                border: hubMode === 'exam_topics' ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              <span>🎓</span> เรียนตามหัวข้อข้อสอบ ({overviewData?.summary?.total_topics || 83} Topics)
            </button>

            <button
              onClick={() => setHubMode('textbooks')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: hubMode === 'textbooks' ? '#10b981' : 'rgba(255,255,255,0.04)',
                color: hubMode === 'textbooks' ? '#fff' : 'var(--text-sub)',
                border: hubMode === 'textbooks' ? '1px solid #10b981' : '1px solid var(--border)',
              }}
            >
              <span>📚</span> เรียนตามตำราอ้างอิง ({overviewData?.summary?.total_textbooks || 14} Textbooks)
            </button>

            <button
              onClick={() => setHubMode('masterclass')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: hubMode === 'masterclass' ? '#ec4899' : 'rgba(255,255,255,0.04)',
                color: hubMode === 'masterclass' ? '#fff' : 'var(--text-sub)',
                border: hubMode === 'masterclass' ? '1px solid #ec4899' : '1px solid var(--border)',
              }}
            >
              <span>🏆</span> ตารางสรุป Masterclass (25 Guides)
            </button>

            {copiedNotification && (
              <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                คัดลอกลิงก์แล้ว!
              </span>
            )}
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            2. SEARCH & SPECIALTY PILL FILTERS
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255, 255, 255, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.7rem'
        }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              placeholder="ค้นหาหัวข้อบทเรียน, ตำราอ้างอิง (เช่น Cohen, Carranza, Malamed, IADT, AHA 2021), โรค หรือกลไก..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.4rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
          }}>
            {SPECIALTY_CATEGORIES.map(cat => {
              const isActive = selectedSpecialty === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSpecialty(cat.id)}
                  style={{
                    padding: '0.32rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                    background: isActive ? cat.color : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#ffffff' : 'var(--text-sub)',
                    border: isActive ? `1px solid ${cat.color}` : '1px solid var(--border)',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            3. MAIN SPLIT LAYOUT: LEFT CURRICULUM NAVIGATOR + RIGHT CLASSROOM
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          minHeight: isModal ? 'calc(94vh - 150px)' : '780px',
          maxHeight: isModal ? 'calc(94vh - 150px)' : 'none',
          overflow: 'hidden'
        }} className="clinical-study-grid">
          
          {/* ── LEFT COLUMN: CURRICULUM NAVIGATOR ───────────────────────── */}
          <div style={{
            borderRight: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.01)',
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {/* MODE 1 SIDEBAR: 83 EXAM-DRIVEN TOPICS */}
            {hubMode === 'exam_topics' && (
              <>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>หัวข้อที่สกัดจากข้อสอบ ({filteredTopics.length} หัวข้อ)</span>
                  <span>จำนวนข้อ</span>
                </div>
                {loadingOverview ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    กำลังสกัดโครงสร้างบทเรียนจากคลังข้อสอบ...
                  </div>
                ) : filteredTopics.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    ไม่พบหัวข้อที่ตรงกับคำค้นหา
                  </div>
                ) : (
                  filteredTopics.map(topic => {
                    const isSelected = topic.id === selectedTopicId;
                    const badgeColor = SPECIALTY_COLOR_MAP[topic.category] || '#6366f1';
                    const hasMasterclass = Boolean(CLINICAL_STUDY_GUIDES[topic.id]);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopicId(topic.id)}
                        style={{
                          padding: '0.75rem 0.85rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          background: isSelected ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.04)',
                          borderLeft: isSelected ? `4px solid ${badgeColor}` : `4px solid ${badgeColor}50`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '0.3rem' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '6px',
                            background: `${badgeColor}20`,
                            color: badgeColor,
                          }}>
                            {topic.category}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: isSelected ? 'var(--primary-light)' : 'var(--text-muted)',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '10px'
                          }}>
                            {topic.question_count} ข้อ
                          </span>
                        </div>

                        <div style={{
                          fontSize: '0.86rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? 'var(--text)' : 'var(--text-sub)',
                          lineHeight: 1.4,
                          marginBottom: '0.25rem'
                        }}>
                          {topic.title_th}
                        </div>

                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          {topic.id}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '4px', background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>
                            R:{topic.cognitive_counts?.R || 0}
                          </span>
                          <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '4px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
                            A:{topic.cognitive_counts?.A || 0}
                          </span>
                          <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '4px', background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                            P:{topic.cognitive_counts?.P || 0}
                          </span>
                          {hasMasterclass && (
                            <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.4rem', borderRadius: '4px', background: 'rgba(236,72,153,0.15)', color: '#f472b6', fontWeight: 700 }}>
                              ✨ ตาราง Masterclass
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* MODE 2 SIDEBAR: 14 GOLD-STANDARD TEXTBOOKS */}
            {hubMode === 'textbooks' && (
              <>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                  ตำราอ้างอิงและแนวทางมาตรฐาน ({filteredTextbooks.length} ชุด)
                </div>
                {filteredTextbooks.map(tb => {
                  const isSelected = tb.id === selectedTextbookId;
                  return (
                    <div
                      key={tb.id}
                      onClick={() => setSelectedTextbookId(tb.id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? `1px solid ${tb.color}` : '1px solid rgba(255,255,255,0.05)',
                        borderLeft: `4px solid ${tb.color}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: tb.color }}>
                          {tb.icon} {tb.specialty}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,0.06)',
                          color: 'var(--text)'
                        }}>
                          {tb.question_count} ข้อสอบอ้างอิง
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: '0.3rem' }}>
                        {tb.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                        ครอบคลุม {tb.topic_count} หัวข้อ Must-Know
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* MODE 3 SIDEBAR: 25 CURATED MASTERCLASS GUIDES */}
            {hubMode === 'masterclass' && (
              <>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                  คัมภีร์สรุป Masterclass ({filteredMasterclass.length} บทเรียน)
                </div>
                {filteredMasterclass.map(guide => {
                  const isSelected = guide.id === selectedMasterclassId;
                  return (
                    <div
                      key={guide.id}
                      onClick={() => setSelectedMasterclassId(guide.id)}
                      style={{
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(236, 72, 153, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid #ec4899' : '1px solid transparent',
                        borderLeft: `4px solid ${guide.badgeColor || '#ec4899'}`,
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: guide.badgeColor, marginBottom: '0.25rem' }}>
                        {guide.specialty}
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: isSelected ? 700 : 600, color: 'var(--text)', lineHeight: 1.4 }}>
                        {guide.title}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* ── RIGHT COLUMN: INTERACTIVE PEDAGOGICAL CLASSROOM ─────────── */}
          <div style={{
            overflowY: 'auto',
            padding: '1.75rem 2.25rem',
            background: 'var(--bg-surface, rgba(15, 23, 42, 0.6))',
          }}>
            {/* ══════════════════════════════════════════════════════════════
                MODES 1 & 2: EXAM-DRIVEN & TEXTBOOK-DRIVEN CLASSROOM
            ══════════════════════════════════════════════════════════════ */}
            {(hubMode === 'exam_topics' || hubMode === 'textbooks') && (
              loadingModule ? (
                <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-sub)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                    กำลังดึงเนื้อหาจากข้อสอบและสังเคราะห์บทเรียนจาก Textbook & Evidence...
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    จัดเรียงทฤษฎี กลไกพยาธิสรีรวิทยา ตัวเลือกเปรียบเทียบ และเคสฝึกคิดวิเคราะห์
                  </div>
                </div>
              ) : moduleData ? (
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                  
                  {/* ── Classroom Topic/Textbook Header Banner ── */}
                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.35rem 1.5rem',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.10), rgba(16, 185, 129, 0.06))',
                    border: '1px solid rgba(99, 102, 241, 0.25)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: 'var(--primary-light)',
                          border: '1px solid rgba(99, 102, 241, 0.4)'
                        }}>
                          {moduleData.module_info.category}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                        }}>
                          🎯 สกัดจากข้อสอบจริง {moduleData.module_info.total_questions} ข้อ ({moduleData.module_info.synthesized_lessons_count} บทเรียนย่อย)
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          R: {moduleData.module_info.cognitive_counts?.R || 0} • A: {moduleData.module_info.cognitive_counts?.A || 0} • P: {moduleData.module_info.cognitive_counts?.P || 0}
                        </span>
                      </div>

                      {onStartExam && (
                        <button
                          onClick={handleStartTopicPractice}
                          className="btn btn-primary btn-sm"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            fontWeight: 700,
                            padding: '0.4rem 0.9rem',
                            borderRadius: '10px'
                          }}
                        >
                          <Play size={14} fill="currentColor" /> ฝึกทำข้อสอบหัวข้อนี้ ({Math.min(20, moduleData.module_info.total_questions)} ข้อ)
                        </button>
                      )}
                    </div>

                    <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 0.35rem 0', lineHeight: 1.35 }}>
                      {moduleData.module_info.title_th}
                    </h1>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
                      {moduleData.module_info.title_en}
                    </div>

                    {/* Textbook & Evidence Sources Shelf */}
                    {moduleData.textbook_references && moduleData.textbook_references.length > 0 && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.55)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BookMarked size={15} /> ตำรามาตรฐานและหลักฐานทางวิชาการ (Textbooks & Evidence) ที่ใช้ออกข้อสอบหัวข้อนี้:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {moduleData.textbook_references.slice(0, 4).map((refItem, idx) => (
                            <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                              <span>
                                <strong style={{ color: 'var(--text)' }}>{refItem.icon} [{idx + 1}]</strong> {refItem.citation}
                              </span>
                              <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.7rem',
                                padding: '0.05rem 0.45rem',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'var(--primary-light)',
                                fontWeight: 700
                              }}>
                                อ้างอิง {refItem.count} ข้อ
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── 4 Classroom Pedagogical Sub-Tabs ── */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    {[
                      { id: 'synthesized', label: `📖 บทเรียนทฤษฎีจาก Textbook (${moduleData.module_info.synthesized_lessons_count})`, desc: 'เรียนเนื้อหาที่สกัดจากข้อสอบแยกตามขั้นตอนคลินิก' },
                      { id: 'guided_teacher', label: `🧑‍🏫 อาจารย์สอนทีละก้าวจากโจทย์ (${moduleData.guided_cases?.length || 0} เคส)`, desc: 'เรียนทฤษฎีก่อน → วิเคราะห์เคส → เฉลยรายตัวเลือก' },
                      { id: 'differential', label: `⚖️ เปรียบเทียบแยกแยะตัวเลือก (${moduleData.differential_comparisons?.length || 0})`, desc: 'ศึกษากลไกการแยกโรคจากตัวเลือก ก-จ' },
                      { id: 'pearls_traps', label: `⚠️ รวม Pearls & กับดักข้อสอบ (${(moduleData.pearls?.length || 0) + (moduleData.pitfalls?.length || 0)})`, desc: 'สรุปจุดเน้นและหลุมพรางที่ออกสอบบ่อย' },
                    ].map(tab => {
                      const active = classroomTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setClassroomTab(tab.id)}
                          style={{
                            padding: '0.55rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: active ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                            color: active ? '#fff' : 'var(--text-sub)',
                            border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                            boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* ──────────────────────────────────────────────────────
                      SUB-TAB 1: SYNTHESIZED TEXTBOOK & EVIDENCE CURRICULUM
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'synthesized' && (
                    <div>
                      {/* If matching curated Masterclass Decision Matrix exists, show it at top! */}
                      {matchingMasterclass && (
                        <div style={{
                          marginBottom: '2rem',
                          padding: '1.5rem',
                          borderRadius: '14px',
                          background: 'rgba(236, 72, 153, 0.04)',
                          border: '1px solid rgba(236, 72, 153, 0.25)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                            <Sparkles size={18} /> สรุปโครงสร้างหลักและตารางเปรียบเทียบ Masterclass (Decision Matrix)
                          </div>
                          <div style={{
                            color: 'var(--text-sub)',
                            fontSize: '0.92rem',
                            lineHeight: 1.75,
                            whiteSpace: 'pre-wrap',
                            background: 'rgba(15, 23, 42, 0.5)',
                            padding: '1.25rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            marginBottom: '1.25rem'
                          }}>
                            {matchingMasterclass.core_mechanism}
                          </div>

                          {matchingMasterclass.matrix_headers && matchingMasterclass.matrix_rows && (
                            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '10px' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                                <thead>
                                  <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                                    {matchingMasterclass.matrix_headers.map((h, i) => (
                                      <th key={i} style={{ padding: '0.75rem 0.9rem', color: 'var(--text)', fontWeight: 700 }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {matchingMasterclass.matrix_rows.map((row, rIdx) => (
                                    <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} style={{ padding: '0.75rem 0.9rem', color: cIdx === 0 ? 'var(--text)' : 'var(--text-sub)', fontWeight: cIdx === 0 ? 700 : 400 }}>
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Task Filter Pills */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
                          <Filter size={13} style={{ display: 'inline', marginRight: '4px' }} />
                          กรองตามมิติการเรียนรู้:
                        </span>
                        <button
                          onClick={() => setSelectedTaskFilter('all')}
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: selectedTaskFilter === 'all' ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                            color: selectedTaskFilter === 'all' ? '#0f172a' : 'var(--text-sub)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          ทั้งหมด ({moduleData.module_info.synthesized_lessons_count})
                        </button>
                        {moduleData.task_modules.map(tm => (
                          <button
                            key={tm.task}
                            onClick={() => setSelectedTaskFilter(tm.task)}
                            style={{
                              padding: '0.3rem 0.75rem',
                              borderRadius: '16px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              background: selectedTaskFilter === tm.task ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                              color: selectedTaskFilter === tm.task ? '#0f172a' : 'var(--text-sub)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            {tm.task} ({tm.lesson_count})
                          </button>
                        ))}
                      </div>

                      {/* Render Synthesized Textbook Lessons by Task */}
                      {moduleData.task_modules
                        .filter(tm => selectedTaskFilter === 'all' || tm.task === selectedTaskFilter)
                        .map((tm, tmIdx) => (
                          <div key={tm.task} style={{ marginBottom: '2.25rem' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.65rem 1rem',
                              background: 'rgba(99, 102, 241, 0.10)',
                              borderLeft: '4px solid var(--primary)',
                              borderRadius: '8px',
                              marginBottom: '1rem'
                            }}>
                              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
                                บทที่ {tmIdx + 1}: {tm.task}
                              </h3>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                                {tm.lesson_count} หลักการวิชาการจากข้อสอบ
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {tm.lessons.map((lesson, lIdx) => (
                                <div key={lesson.question_id} style={{
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  border: '1px solid var(--border)',
                                  borderRadius: '12px',
                                  padding: '1.25rem 1.4rem',
                                }}>
                                  {/* Lesson Card Top Meta */}
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem',
                                    paddingBottom: '0.6rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                      <span style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        padding: '0.15rem 0.55rem',
                                        borderRadius: '6px',
                                        background: 'rgba(124, 58, 237, 0.18)',
                                        color: 'var(--primary-light)',
                                      }}>
                                        📖 หลักการที่ {lIdx + 1} (Q#{lesson.question_id})
                                      </span>
                                      <span style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '6px',
                                        background: lesson.cognitive_level === 'P' ? 'rgba(239,68,68,0.15)' : lesson.cognitive_level === 'A' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                                        color: lesson.cognitive_level === 'P' ? '#f87171' : lesson.cognitive_level === 'A' ? '#60a5fa' : '#34d399',
                                      }}>
                                        ระดับ {lesson.cognitive_level}
                                      </span>
                                      {lesson.reference && (
                                        <span style={{
                                          fontSize: '0.75rem',
                                          fontWeight: 600,
                                          color: 'var(--accent)',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}>
                                          <BookOpen size={13} /> {lesson.reference}
                                        </span>
                                      )}
                                    </div>

                                    <button
                                      onClick={() => handleOpenCaseInTeacher(lesson.question_id)}
                                      style={{
                                        background: 'rgba(99, 102, 241, 0.14)',
                                        border: '1px solid rgba(99, 102, 241, 0.35)',
                                        color: 'var(--primary-light)',
                                        borderRadius: '8px',
                                        padding: '0.25rem 0.65rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                      }}
                                    >
                                      🧑‍🏫 ฝึกวิเคราะห์โจทย์ข้อนี้
                                    </button>
                                  </div>

                                  {/* Key Takeaway Callout */}
                                  {lesson.key_takeaway && (
                                    <div style={{
                                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(99, 102, 241, 0.08))',
                                      borderLeft: '4px solid var(--accent)',
                                      borderRadius: '8px',
                                      padding: '0.75rem 1rem',
                                      marginBottom: '0.85rem',
                                      fontSize: '0.92rem',
                                      fontWeight: 700,
                                      color: 'var(--text)',
                                      lineHeight: 1.55
                                    }}>
                                      📌 สรุปหลักการสำคัญ (Core Rule): {lesson.key_takeaway}
                                    </div>
                                  )}

                                  {/* Core Textbook Principle & Mechanism */}
                                  <div style={{
                                    color: 'var(--text-sub)',
                                    fontSize: '0.92rem',
                                    lineHeight: 1.75,
                                    whiteSpace: 'pre-wrap',
                                    marginBottom: (lesson.clinical_pearl || lesson.common_pitfall) ? '0.85rem' : 0
                                  }}>
                                    {lesson.core_principle}
                                  </div>

                                  {/* Pearl & Pitfall Footer */}
                                  {(lesson.clinical_pearl || lesson.common_pitfall) && (
                                    <div style={{ display: 'grid', gridTemplateColumns: lesson.clinical_pearl && lesson.common_pitfall ? '1fr 1fr' : '1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                                      {lesson.clinical_pearl && (
                                        <div style={{
                                          background: 'rgba(168, 85, 247, 0.08)',
                                          border: '1px solid rgba(168, 85, 247, 0.25)',
                                          borderRadius: '8px',
                                          padding: '0.65rem 0.85rem',
                                          fontSize: '0.82rem',
                                          color: 'var(--text-sub)',
                                          lineHeight: 1.55
                                        }}>
                                          <strong style={{ color: '#c084fc', display: 'block', marginBottom: '2px' }}>✨ Clinical Pearl:</strong>
                                          {lesson.clinical_pearl}
                                        </div>
                                      )}
                                      {lesson.common_pitfall && (
                                        <div style={{
                                          background: 'rgba(245, 158, 11, 0.08)',
                                          border: '1px solid rgba(245, 158, 11, 0.25)',
                                          borderRadius: '8px',
                                          padding: '0.65rem 0.85rem',
                                          fontSize: '0.82rem',
                                          color: 'var(--text-sub)',
                                          lineHeight: 1.55
                                        }}>
                                          <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '2px' }}>⚠️ กับดักข้อสอบ (Trap):</strong>
                                          {lesson.common_pitfall}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────
                      SUB-TAB 2: 4-STEP TEACH-FIRST CASE CLASSROOM
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'guided_teacher' && (
                    <div>
                      {/* Controls Bar: Cognitive Level Filter + Show All Steps Toggle */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginBottom: '1.25rem',
                        padding: '0.85rem 1rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ระดับความซับซ้อน:</span>
                          {[
                            { id: 'all', label: `ทั้งหมด (${moduleData.guided_cases?.length || 0})` },
                            { id: 'R', label: `🟢 R: ปูพื้นฐาน (${moduleData.module_info.cognitive_counts?.R || 0})` },
                            { id: 'A', label: `🔵 A: ประยุกต์คลินิก (${moduleData.module_info.cognitive_counts?.A || 0})` },
                            { id: 'P', label: `🔴 P: แก้ปัญหาซับซ้อน (${moduleData.module_info.cognitive_counts?.P || 0})` },
                          ].map(cf => (
                            <button
                              key={cf.id}
                              onClick={() => {
                                setSelectedCogFilter(cf.id);
                                setActiveCaseIndex(0);
                                setGuidedStep(1);
                                setSelectedChoice(null);
                              }}
                              style={{
                                padding: '0.3rem 0.7rem',
                                borderRadius: '14px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: selectedCogFilter === cf.id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                                color: selectedCogFilter === cf.id ? '#fff' : 'var(--text-sub)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              {cf.label}
                            </button>
                          ))}
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-sub)', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={showAllGuidedSteps}
                            onChange={(e) => setShowAllGuidedSteps(e.target.checked)}
                          />
                          แสดงทุกขั้นตอนพร้อมกัน (ไม่ซ่อนโจทย์)
                        </label>
                      </div>

                      {currentGuidedCase ? (
                        <div>
                          {/* Case Navigation Bar */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}>
                            <button
                              disabled={activeCaseIndex <= 0}
                              onClick={() => {
                                setActiveCaseIndex(i => Math.max(0, i - 1));
                                setGuidedStep(1);
                                setSelectedChoice(null);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <ChevronLeft size={16} /> เคสก่อนหน้า
                            </button>

                            <div style={{ textAlign: 'center' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text)' }}>
                                บทเรียนเคสที่ {activeCaseIndex + 1} จาก {filteredGuidedCases.length}
                              </span>
                              <span style={{
                                marginLeft: '8px',
                                fontSize: '0.75rem',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'var(--text-sub)'
                              }}>
                                Q#{currentGuidedCase.id} • ระดับ {currentGuidedCase.cognitive_level} • {currentGuidedCase.task}
                              </span>
                            </div>

                            <button
                              disabled={activeCaseIndex >= filteredGuidedCases.length - 1}
                              onClick={() => {
                                setActiveCaseIndex(i => Math.min(filteredGuidedCases.length - 1, i + 1));
                                setGuidedStep(1);
                                setSelectedChoice(null);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              เคสถัดไป <ChevronRight size={16} />
                            </button>
                          </div>

                          {/* ── STEP 1: TEXTBOOK & EVIDENCE FOUNDATION (TEACH FIRST!) ── */}
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(16, 185, 129, 0.05))',
                            border: '1px solid rgba(99, 102, 241, 0.35)',
                            borderRadius: '14px',
                            padding: '1.5rem',
                            marginBottom: '1.25rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontWeight: 800, fontSize: '1.02rem' }}>
                                <span style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  background: 'var(--primary)',
                                  color: '#fff',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.82rem'
                                }}>1</span>
                                ขั้นที่ 1: เรียนทฤษฎีและกลไกจาก Textbook & Evidence (ศึกษาก่อนทำโจทย์)
                              </div>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.7rem',
                                borderRadius: '20px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                color: 'var(--accent)',
                                border: '1px solid rgba(6, 182, 212, 0.3)'
                              }}>
                                📚 {currentGuidedCase.step1_textbook_lesson.reference}
                              </span>
                            </div>

                            <div style={{
                              color: 'var(--text)',
                              fontSize: '0.95rem',
                              lineHeight: 1.8,
                              whiteSpace: 'pre-wrap',
                              background: 'rgba(15, 23, 42, 0.45)',
                              padding: '1.25rem',
                              borderRadius: '10px',
                              border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                              {currentGuidedCase.step1_textbook_lesson.core_principle}
                            </div>

                            {currentGuidedCase.step1_textbook_lesson.clinical_pearl && (
                              <div style={{
                                marginTop: '0.9rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                background: 'rgba(168, 85, 247, 0.10)',
                                borderLeft: '4px solid #c084fc',
                                fontSize: '0.88rem',
                                color: 'var(--text)'
                              }}>
                                <strong style={{ color: '#c084fc' }}>💡 Clinical Pearl (จุดเน้นจากตำรา): </strong>
                                {currentGuidedCase.step1_textbook_lesson.clinical_pearl}
                              </div>
                            )}

                            {!showAllGuidedSteps && guidedStep === 1 && (
                              <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                                <button
                                  onClick={() => setGuidedStep(2)}
                                  className="btn btn-primary"
                                  style={{ fontWeight: 700, padding: '0.6rem 1.25rem' }}
                                >
                                  เข้าใจทฤษฎีแล้ว → ไปขั้นที่ 2: ฝึกวิเคราะห์โจทย์ข้อสอบจริง
                                </button>
                              </div>
                            )}
                          </div>

                          {/* ── STEP 2 & 3: CLINICAL CASE DECONSTRUCTION & ACTIVE RECALL ── */}
                          {(showAllGuidedSteps || guidedStep >= 2) && (
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid var(--border)',
                              borderRadius: '14px',
                              padding: '1.5rem',
                              marginBottom: '1.25rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 800, fontSize: '1.02rem', marginBottom: '1rem' }}>
                                <span style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  background: 'var(--accent)',
                                  color: '#0f172a',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.82rem'
                                }}>2</span>
                                ขั้นที่ 2: ถอดรหัสเคสผู้ป่วยจากข้อสอบจริงและลองเลือกคำตอบ (Active Recall)
                              </div>

                              {currentGuidedCase.step2_clinical_case.stem && 
                               currentGuidedCase.step2_clinical_case.stem !== currentGuidedCase.step2_clinical_case.question_text && (
                                <div style={{
                                  padding: '1rem',
                                  background: 'rgba(255,255,255,0.03)',
                                  borderRadius: '10px',
                                  borderLeft: '4px solid var(--primary)',
                                  marginBottom: '1rem',
                                  fontSize: '0.92rem',
                                  lineHeight: 1.7,
                                  color: 'var(--text-sub)',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>🩺 ข้อมูลเคสผู้ป่วย (Clinical Vignette / Stem):</strong>
                                  {currentGuidedCase.step2_clinical_case.stem}
                                </div>
                              )}

                              <div style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'var(--text)',
                                lineHeight: 1.65,
                                marginBottom: '1.15rem',
                                whiteSpace: 'pre-wrap'
                              }}>
                                {currentGuidedCase.step2_clinical_case.proposition || currentGuidedCase.step2_clinical_case.question_text}
                              </div>

                              {currentGuidedCase.image_path && (
                                <div style={{ marginBottom: '1rem' }}>
                                  <img
                                    src={`${API_BASE}/images/${currentGuidedCase.image_path}`}
                                    alt="Clinical Case Figure"
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', border: '1px solid var(--border)' }}
                                  />
                                </div>
                              )}

                              {/* Choices */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                {currentGuidedCase.step2_clinical_case.choices.map(c => {
                                  const isPicked = selectedChoice === c.label;
                                  const isCorrectAns = String(c.label).trim().toUpperCase() === String(currentGuidedCase.step3_evidence_resolution.correct_answer).trim().toUpperCase();
                                  const isRevealed = showAllGuidedSteps || guidedStep >= 3 || selectedChoice !== null;

                                  let bg = 'rgba(255,255,255,0.03)';
                                  let border = '1px solid var(--border)';
                                  if (isRevealed) {
                                    if (isCorrectAns) {
                                      bg = 'rgba(16, 185, 129, 0.14)';
                                      border = '1.5px solid var(--success)';
                                    } else if (isPicked && !isCorrectAns) {
                                      bg = 'rgba(244, 63, 94, 0.14)';
                                      border = '1.5px solid var(--danger)';
                                    }
                                  } else if (isPicked) {
                                    bg = 'rgba(99, 102, 241, 0.15)';
                                    border = '1.5px solid var(--primary)';
                                  }

                                  return (
                                    <button
                                      key={c.label}
                                      onClick={() => {
                                        setSelectedChoice(c.label);
                                        setGuidedStep(3);
                                      }}
                                      style={{
                                        padding: '0.8rem 1rem',
                                        borderRadius: '10px',
                                        background: bg,
                                        border,
                                        color: 'var(--text)',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontSize: '0.92rem',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <span style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: isRevealed && isCorrectAns ? 'var(--success)' : 'rgba(255,255,255,0.08)',
                                        color: isRevealed && isCorrectAns ? '#fff' : 'var(--text)',
                                        fontWeight: 800,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                      }}>
                                        {c.label}
                                      </span>
                                      <span style={{ flex: 1, lineHeight: 1.5 }}>{c.text}</span>
                                      {isRevealed && isCorrectAns && <CheckCircle2 size={18} color="var(--success)" />}
                                      {isRevealed && isPicked && !isCorrectAns && <XCircle size={18} color="var(--danger)" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* ── STEP 3: EVIDENCE-BASED CHOICE DECONSTRUCTION ── */}
                          {(showAllGuidedSteps || guidedStep >= 3 || selectedChoice !== null) && (
                            <div style={{
                              background: 'rgba(16, 185, 129, 0.04)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '14px',
                              padding: '1.5rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 800, fontSize: '1.02rem' }}>
                                  <span style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: '#10b981',
                                    color: '#fff',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.82rem'
                                  }}>3</span>
                                  ขั้นที่ 3: วิเคราะห์เจาะลึกทุกตัวเลือกตามหลักฐานวิชาการ (Differential Choice Analysis)
                                </div>
                                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)' }}>
                                  เฉลยที่ถูกต้อง: ตัวเลือก {currentGuidedCase.step3_evidence_resolution.correct_answer}
                                </span>
                              </div>

                              {currentGuidedCase.step3_evidence_resolution.key_takeaway && (
                                <div style={{
                                  padding: '0.85rem 1rem',
                                  borderRadius: '8px',
                                  background: 'rgba(16, 185, 129, 0.10)',
                                  borderLeft: '4px solid var(--success)',
                                  marginBottom: '1rem',
                                  fontWeight: 700,
                                  color: 'var(--text)',
                                  fontSize: '0.92rem',
                                  lineHeight: 1.6
                                }}>
                                  📌 Key Takeaway: {currentGuidedCase.step3_evidence_resolution.key_takeaway}
                                </div>
                              )}

                              {currentGuidedCase.step3_evidence_resolution.common_pitfall && (
                                <div style={{
                                  padding: '0.85rem 1rem',
                                  borderRadius: '8px',
                                  background: 'rgba(245, 158, 11, 0.08)',
                                  borderLeft: '4px solid var(--warning)',
                                  marginBottom: '1rem',
                                  color: 'var(--text-sub)',
                                  fontSize: '0.88rem',
                                  lineHeight: 1.6
                                }}>
                                  <strong style={{ color: 'var(--warning)' }}>⚠️ กับดักข้อสอบที่ต้องระวัง: </strong>
                                  {currentGuidedCase.step3_evidence_resolution.common_pitfall}
                                </div>
                              )}

                              {currentGuidedCase.step3_evidence_resolution.choice_explanations && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {Object.entries(currentGuidedCase.step3_evidence_resolution.choice_explanations).map(([lbl, text]) => {
                                    const isCorr = String(lbl).trim().toUpperCase() === String(currentGuidedCase.step3_evidence_resolution.correct_answer).trim().toUpperCase();
                                    return (
                                      <div key={lbl} style={{
                                        padding: '0.75rem 0.95rem',
                                        borderRadius: '8px',
                                        background: isCorr ? 'rgba(16, 185, 129, 0.10)' : 'rgba(15, 23, 42, 0.5)',
                                        border: isCorr ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border)',
                                        borderLeft: isCorr ? '4px solid var(--success)' : '4px solid rgba(255,255,255,0.15)',
                                        fontSize: '0.88rem',
                                        lineHeight: 1.6
                                      }}>
                                        <strong style={{ color: isCorr ? 'var(--success)' : 'var(--text)' }}>ตัวเลือก {lbl}: </strong>
                                        <span style={{ color: 'var(--text-sub)' }}>{text}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          ไม่พบเคสตามตัวกรองที่เลือก
                        </div>
                      )}
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────
                      SUB-TAB 3: DIFFERENTIAL & DISTRACTOR COMPARISON
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'differential' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        background: 'rgba(6, 182, 212, 0.08)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        color: 'var(--text-sub)',
                        fontSize: '0.88rem',
                        lineHeight: 1.6
                      }}>
                        <strong style={{ color: 'var(--accent)' }}>⚖️ การเรียนรู้แบบแยกแยะตัวเลือก (Differential Learning from Distractors): </strong>
                        ข้อสอบแต่ละข้อไม่ได้วัดเพียงคำตอบที่ถูกข้อเดียว แต่ตัวเลือกลวง (Distractors ก-จ) คือโรคหรือหัตถการใกล้เคียงที่ออกสอบสลับกันในแต่ละปี การเข้าใจเหตุผลของทุกตัวเลือกจะทำให้ทำข้อสอบได้ครอบคลุม 5 เท่า
                      </div>

                      {moduleData.differential_comparisons?.map((item, idx) => (
                        <div key={item.question_id} style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '1.25rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                              เคสเปรียบเทียบที่ {idx + 1} (Q#{item.question_id} • {item.task})
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                              📚 {item.reference}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.85rem', lineHeight: 1.55 }}>
                            โจทย์: {item.question_summary}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            {item.choices_breakdown.map(cb => (
                              <div key={cb.label} style={{
                                padding: '0.65rem 0.9rem',
                                borderRadius: '8px',
                                background: cb.is_correct ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.015)',
                                borderLeft: cb.is_correct ? '4px solid var(--success)' : '4px solid rgba(255,255,255,0.12)',
                                fontSize: '0.85rem',
                                lineHeight: 1.55
                              }}>
                                <strong style={{ color: cb.is_correct ? 'var(--success)' : 'var(--text)' }}>
                                  [{cb.label}] {cb.choice_text ? `${cb.choice_text} — ` : ''}
                                </strong>
                                <span style={{ color: 'var(--text-sub)' }}>{cb.explanation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────
                      SUB-TAB 4: HIGH-YIELD PEARLS & PITFALLS
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'pearls_traps' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      {/* Column 1: Clinical Pearls */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c084fc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={18} /> Clinical Board Pearls ({moduleData.pearls?.length || 0})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {moduleData.pearls?.map((p, idx) => (
                            <div key={idx} style={{
                              background: 'rgba(168, 85, 247, 0.07)',
                              border: '1px solid rgba(168, 85, 247, 0.25)',
                              borderLeft: '4px solid #c084fc',
                              borderRadius: '10px',
                              padding: '0.9rem 1rem',
                              fontSize: '0.86rem',
                              lineHeight: 1.65,
                              color: 'var(--text-sub)'
                            }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.25rem' }}>
                                ✨ Pearl #{idx + 1} (จาก Q#{p.question_id})
                              </div>
                              <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '0.35rem' }}>
                                {p.pearl}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                📚 {p.reference}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Common Pitfalls */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--warning)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertTriangle size={18} /> กับดักข้อสอบที่พบบ่อย ({moduleData.pitfalls?.length || 0})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {moduleData.pitfalls?.map((pit, idx) => (
                            <div key={idx} style={{
                              background: 'rgba(245, 158, 11, 0.07)',
                              border: '1px solid rgba(245, 158, 11, 0.25)',
                              borderLeft: '4px solid var(--warning)',
                              borderRadius: '10px',
                              padding: '0.9rem 1rem',
                              fontSize: '0.86rem',
                              lineHeight: 1.65,
                              color: 'var(--text-sub)'
                            }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.25rem' }}>
                                ⚠️ Trap #{idx + 1} (จาก Q#{pit.question_id})
                              </div>
                              <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '0.35rem' }}>
                                {pit.pitfall}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                📚 {pit.reference}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                  เลือกหัวข้อหรือตำราอ้างอิงจากแถบด้านซ้ายเพื่อเริ่มเรียนรู้
                </div>
              )
            )}

            {/* ══════════════════════════════════════════════════════════════
                MODE 3: 25 CURATED MASTERCLASS GUIDES & DECISION MATRICES
            ══════════════════════════════════════════════════════════════ */}
            {hubMode === 'masterclass' && matchingMasterclass && (
              <div style={{ maxWidth: '920px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '12px',
                      background: `${matchingMasterclass.badgeColor}25`,
                      color: matchingMasterclass.badgeColor,
                    }}>
                      {matchingMasterclass.specialty}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedTopicId(selectedMasterclassId);
                        setHubMode('exam_topics');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ fontWeight: 700 }}
                    >
                      🎓 เปิดบทเรียนสกัดจากข้อสอบจริงในหัวข้อนี้
                    </button>
                  </div>

                  <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem' }}>
                    {matchingMasterclass.title}
                  </h1>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.04))',
                    borderLeft: '4px solid var(--primary)',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    color: 'var(--text)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7
                  }}>
                    <strong>Clinical Overview:</strong> {matchingMasterclass.overview}
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ color: 'var(--primary-light)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                    1. กลไกพยาธิสรีรวิทยาและหลักการคิดเชิงลึก (Core Mechanism)
                  </h3>
                  <div style={{
                    color: 'var(--text-sub)',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1.4rem'
                  }}>
                    {matchingMasterclass.core_mechanism}
                  </div>
                </div>

                {matchingMasterclass.matrix_headers && matchingMasterclass.matrix_rows && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                      2. ตารางเปรียบเทียบการวินิจฉัยและการรักษา (Clinical Decision Matrix)
                    </h3>
                    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border)' }}>
                            {matchingMasterclass.matrix_headers.map((h, i) => (
                              <th key={i} style={{ padding: '0.85rem 1rem', color: 'var(--text)', fontWeight: 700 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {matchingMasterclass.matrix_rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ padding: '0.85rem 1rem', color: cIdx === 0 ? 'var(--text)' : 'var(--text-sub)', fontWeight: cIdx === 0 ? 700 : 400 }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {matchingMasterclass.pitfalls && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--warning)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                      3. หลุมพรางข้อสอบ (Common Traps)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {matchingMasterclass.pitfalls.map((p, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(245, 158, 11, 0.06)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          borderLeft: '4px solid var(--warning)',
                          borderRadius: '10px',
                          padding: '1rem',
                          color: 'var(--text-sub)',
                          fontSize: '0.92rem',
                          lineHeight: 1.65
                        }}>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchingMasterclass.pearl && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(236, 72, 153, 0.08))',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '0.35rem' }}>
                      ✨ Clinical Board Pearl:
                    </strong>
                    <div style={{ color: 'var(--text)', fontWeight: 600, lineHeight: 1.65 }}>
                      {matchingMasterclass.pearl}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
