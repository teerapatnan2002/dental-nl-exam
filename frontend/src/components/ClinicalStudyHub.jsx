import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, Search, Sparkles, AlertTriangle, ArrowLeft, 
  CheckCircle2, XCircle, Compass, Award, Bookmark, 
  Layers, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Play, BookMarked, Share2, 
  Lightbulb, X, GraduationCap, Brain, FileText, Eye, Check, Filter,
  RotateCcw, Zap, Stethoscope, Shuffle, Target, GitBranch
} from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';
import ClinicalPathwayDiagram from './ClinicalPathwayDiagram';
import VisualAtlas from './VisualAtlas';
import CalcSimulator from './CalcSimulator';
import ClozePitfallArena from './ClozePitfallArena';
import {
  buildDynamicPathwayFromText,
  buildPathwayFromThaiProtocol,
} from '../utils/pathwayBuilder';
import { 
  SPECIALTY_CATEGORIES, 
  CLINICAL_STUDY_GUIDES 
} from '../data/clinicalStudyGuides';

const SPECIALTY_COLOR_MAP = {
  'วิทยาเอ็นโดดอนต์': '#e11d48',
  'ศัลยศาสตร์ช่องปาก': '#f59e0b',
  'ทันตกรรมประดิษฐ์': '#0284c7',
  'ปริทันตวิทยา': '#10b981',
  'ทันตกรรมบูรณะ/หัตถการ': '#2563eb',
  'ทันตกรรมสำหรับเด็ก': '#0ea5e9',
  'วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก': '#3b82f6',
  'ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า': '#06b6d4',
  'ทันตกรรมจัดฟัน': '#d97706',
  'ทันตกรรมชุมชน': '#059669',
  'กฎหมายและจรรยาบรรณ': '#e11d48',
};

const MASTERY_META = {
  red: {
    dotColor: '#ef4444',
    label: 'ยังสับสน',
    bg: 'rgba(239, 68, 68, 0.14)',
    color: 'var(--ink-rose)',
    border: 'rgba(239, 68, 68, 0.45)',
  },
  yellow: {
    dotColor: '#f59e0b',
    label: 'พอจำได้',
    bg: 'rgba(245, 158, 11, 0.15)',
    color: 'var(--ink-amber)',
    border: 'rgba(245, 158, 11, 0.48)',
  },
  green: {
    dotColor: '#10b981',
    label: 'พร้อมสอบ!',
    bg: 'rgba(16, 185, 129, 0.14)',
    color: 'var(--ink-emerald)',
    border: 'rgba(16, 185, 129, 0.45)',
  },
};

function TopicMasterySelector({
  topicId,
  value,
  onChange,
  feedbackText,
  label = 'ระดับจำหัวข้อนี้:',
  compact = false,
}) {
  if (!topicId) return null;
  return (
    <div
      className={`topic-mastery-bar ${compact ? 'is-compact' : ''}`}
      role="group"
      aria-label={label}
    >
      <span className="topic-mastery-label">
        <Brain size={14} /> {label}
      </span>
      <div className="topic-mastery-pills">
        {Object.entries(MASTERY_META).map(([lvl, meta]) => {
          const active = value === lvl;
          return (
            <button
              key={lvl}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(topicId, lvl)}
              className={`topic-mastery-btn ${active ? 'is-active' : ''}`}
              title={active ? `คลิกซ้ำเพื่อล้างสถานะ "${meta.label}"` : `ตั้งระดับจำ: ${meta.label}`}
              style={
                active
                  ? {
                      background: meta.bg,
                      color: meta.color,
                      borderColor: meta.border,
                    }
                  : undefined
              }
            >
              <span
                className="topic-mastery-dot"
                style={{ backgroundColor: meta.dotColor }}
                aria-hidden="true"
              />
              <span>{meta.label}</span>
              {active && <Check size={13} strokeWidth={2.75} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {feedbackText && (
        <span className="topic-mastery-saved" role="status">
          <Check size={12} strokeWidth={2.5} /> {feedbackText}
        </span>
      )}
    </div>
  );
}

const CLUE_REGEX = /(มาตรา\s*\d+(?:\/\d+)?|\d+(?:\.\d+)?\s*(?:–|-|ถึง)?\s*(?:\d+(?:\.\d+)?)?\s*(?:%|มม\.|mm|ซม\.|cm|วัน|สัปดาห์|เดือน|ปี|ขวบ|ซี่|คู่สบ|นาที|ชั่วโมง|ชม\.|mg|มก\.|mL|มล\.|IU|unit|องศา|°)|spontaneous pain|percussion|palpation|thermal test|cold test|EPT|electric pulp test|mobility|sinus tract|fistula|trismus|paresthesia|avulsion|intrusion|extrusion|luxation|irreversible|reversible|necrosis|vitality|ปวดกลางคืน|ปวดเอง|หนอง|บวม|ไข้|เคาะเจ็บ|คลำเจ็บ|โยก|ทะลุโพรงประสาท|ฟันหลุด|ประวัติแพ้|ตั้งครรภ์|ความดันโลหิต)/gi;

function highlightClinicalClues(text, enabled) {
  if (!text || !enabled) return text;
  const parts = [];
  let lastIndex = 0;
  let match;
  CLUE_REGEX.lastIndex = 0;
  let keyIdx = 0;
  while ((match = CLUE_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <mark
        key={`clue-${keyIdx++}`}
        style={{
          background: 'rgba(245, 158, 11, 0.24)',
          color: 'var(--text)',
          padding: '0 4px',
          borderRadius: '4px',
          borderBottom: '2px solid rgba(245, 158, 11, 0.85)',
          fontWeight: 700,
        }}
      >
        {match[0]}
      </mark>
    );
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) break;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

export default function ClinicalStudyHub({ 
  onBack, 
  onStartExam, 
  onOpenAuthModal = null,
  initialTopicId = null,
  initialClassroomTab = null,
  initialHubMode = null,
  initialQuestion = null,
  initialQuestionId = null,
  isModal = false,
  onClose = null 
}) {
  const auth = useAuth() || {};
  const { token, authFetch } = auth;

  // Primary Mode: 'by_specialty' (11 Specialties Directory), 'exam_topics' (83 DB Topics), 'textbooks' (14 Gold Standard Textbooks), 'masterclass' (Curated Guides), 'mistake_clinic'
  const [hubMode, setHubMode] = useState(
    initialHubMode || (initialTopicId || isModal ? 'exam_topics' : 'by_specialty')
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSidebarSpecs, setCollapsedSidebarSpecs] = useState({});

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
  const [authRequiredModule, setAuthRequiredModule] = useState(false);

  // Lazy-load extended 64 Masterclass guides (completing all 83/83 Must-Know Topics)
  const [extraGuides, setExtraGuides] = useState({});
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import('../data/clinicalStudyGuidesExtra1'),
      import('../data/clinicalStudyGuidesExtra2'),
    ])
      .then(([m1, m2]) => {
        if (!cancelled) {
          setExtraGuides({
            ...(m1.CLINICAL_STUDY_GUIDES_EXTRA_1 || m1.default || {}),
            ...(m2.CLINICAL_STUDY_GUIDES_EXTRA_2 || m2.default || {}),
          });
        }
      })
      .catch((err) => console.error('Failed to lazy-load extended study guides:', err));
    return () => { cancelled = true; };
  }, []);

  const allStudyGuides = useMemo(
    () => ({ ...CLINICAL_STUDY_GUIDES, ...extraGuides }),
    [extraGuides]
  );

  // Classroom Sub-Tabs: 'synthesized' | 'guided_teacher' | 'pathways' | 'flashcards' | 'cheat_sheet' | 'differential' | 'pearls_traps'
  const [classroomTab, setClassroomTab] = useState(initialClassroomTab || 'synthesized');

  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
      if (allStudyGuides[initialTopicId]) {
        setSelectedMasterclassId(initialTopicId);
      }
    }
    if (initialHubMode) {
      setHubMode(initialHubMode);
    }
    if (initialClassroomTab) {
      setClassroomTab(initialClassroomTab);
    }
  }, [initialTopicId, initialClassroomTab, initialHubMode, allStudyGuides]);
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('all');
  const [selectedCogFilter, setSelectedCogFilter] = useState('all');

  // 4-Step Guided Case Teacher State
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [guidedStep, setGuidedStep] = useState(1); // 1: First step, 2: Case/Reveal, 3: Full Evidence Resolution
  const [guidedStyle, setGuidedStyle] = useState('challenge_first'); // 'challenge_first' | 'teach_first'
  const [clueRadarEnabled, setClueRadarEnabled] = useState(true);
  const [showAllGuidedSteps, setShowAllGuidedSteps] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Pathway Visualization State
  const [lessonPathwayIds, setLessonPathwayIds] = useState({});
  const [guidedTheoryAsPathway, setGuidedTheoryAsPathway] = useState(true);
  const [masterclassAsPathway, setMasterclassAsPathway] = useState(true);
  const [selectedPathwayFilter, setSelectedPathwayFilter] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showModalSidebar, setShowModalSidebar] = useState(false);
  const [focusedQuestionPathwayOpen, setFocusedQuestionPathwayOpen] = useState(true);
  const focusedQuestionRef = useRef(null);
  const initialQuestionIdRef = useRef(initialQuestionId || initialQuestion?.id || null);
  initialQuestionIdRef.current = initialQuestionId || initialQuestion?.id || null;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Flashcards Active Recall Deck State (DB-synced SM-2 + localStorage fallback)
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [flashcardOrder, setFlashcardOrder] = useState(null);
  const [onlyUnmasteredCards, setOnlyUnmasteredCards] = useState(false);
  const [onlyDueCards, setOnlyDueCards] = useState(false);
  const [cardSm2Map, setCardSm2Map] = useState({});
  const [cardMastery, setCardMastery] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('nl_flashcard_mastery_v1') || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  });

  // Topic Mastery Tracker State (DB-synced + localStorage fallback)
  const [topicMastery, setTopicMastery] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('nl_topic_mastery_v1') || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  });
  const topicMasteryRef = useRef(topicMastery);
  const [masteryFeedback, setMasteryFeedback] = useState(null);
  const masteryFeedbackTimerRef = useRef(null);

  useEffect(() => {
    topicMasteryRef.current = topicMastery;
  }, [topicMastery]);

  useEffect(() => {
    return () => {
      if (masteryFeedbackTimerRef.current) {
        clearTimeout(masteryFeedbackTimerRef.current);
      }
    };
  }, []);

  // Hydrate and idempotently sync localStorage flashcards/topics to DB on login
  useEffect(() => {
    if (!token || !authFetch) return;
    let cancelled = false;

    const applyServerCards = (cards = []) => {
      if (cancelled || !Array.isArray(cards)) return;
      const nextFlash = {};
      const nextTopics = {};
      const nextSm2 = {};
      cards.forEach((c) => {
        if (c.card_type === 'topic') {
          nextTopics[c.card_key] = c.mastery_status;
        } else {
          nextFlash[c.card_key] = c.mastery_status;
          nextSm2[c.card_key] = c;
        }
      });
      setCardMastery((prev) => ({ ...prev, ...nextFlash }));
      setTopicMastery((prev) => ({ ...prev, ...nextTopics }));
      setCardSm2Map((prev) => ({ ...prev, ...nextSm2 }));
    };

    const syncCards = async () => {
      try {
        const items = [];
        try {
          const localFlash = JSON.parse(localStorage.getItem('nl_flashcard_mastery_v1') || '{}');
          if (localFlash && typeof localFlash === 'object') {
            Object.entries(localFlash).forEach(([k, v]) => {
              if (v) items.push({ card_key: k, card_type: 'flashcard', mastery_status: String(v) });
            });
          }
          const localTopics = JSON.parse(localStorage.getItem('nl_topic_mastery_v1') || '{}');
          if (localTopics && typeof localTopics === 'object') {
            Object.entries(localTopics).forEach(([k, v]) => {
              if (v) items.push({ card_key: k, card_type: 'topic', mastery_status: String(v) });
            });
          }
        } catch {
          // Ignore invalid JSON in localStorage
        }

        const res = items.length > 0
          ? await authFetch(`${API_BASE}/api/tracking/cards/sync`, {
              method: 'POST',
              body: JSON.stringify({ items: items.slice(0, 900) }),
            })
          : await authFetch(`${API_BASE}/api/tracking/cards`);

        if (res.ok) {
          const data = await res.json();
          applyServerCards(data.cards || []);
        }
      } catch (err) {
        console.error('Failed to sync card mastery:', err);
      }
    };

    syncCards();
    return () => { cancelled = true; };
  }, [token, authFetch]);

  const updateTopicMastery = useCallback((topicId, level) => {
    if (!topicId) return;
    const prev = topicMasteryRef.current || {};
    const isRemoving = prev[topicId] === level;
    const next = { ...prev };
    if (isRemoving) {
      delete next[topicId];
    } else {
      next[topicId] = level;
    }

    topicMasteryRef.current = next;
    setTopicMastery(next);

    try {
      localStorage.setItem('nl_topic_mastery_v1', JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }

    setMasteryFeedback({
      topicId,
      text: isRemoving ? 'ล้างระดับจำแล้ว' : 'บันทึกแล้ว',
    });
    if (masteryFeedbackTimerRef.current) {
      clearTimeout(masteryFeedbackTimerRef.current);
    }
    masteryFeedbackTimerRef.current = setTimeout(() => {
      setMasteryFeedback(null);
    }, 1800);

    if (token && authFetch) {
      if (isRemoving) {
        authFetch(
          `${API_BASE}/api/tracking/cards/review?card_key=${encodeURIComponent(topicId)}&card_type=topic`,
          { method: 'DELETE' }
        ).catch(() => {});
      } else {
        authFetch(`${API_BASE}/api/tracking/cards/review`, {
          method: 'POST',
          body: JSON.stringify({
            card_key: topicId,
            card_type: 'topic',
            mastery_status: level,
          }),
        }).catch(() => {});
      }
    }
  }, [token, authFetch]);

  const updateCardMastery = useCallback((cardId, status) => {
    if (!cardId) return;
    setCardMastery(prev => {
      const next = { ...prev, [cardId]: status };
      try {
        localStorage.setItem('nl_flashcard_mastery_v1', JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  }, []);

  const gradeFlashcardSm2 = useCallback(async (cardId, rating) => {
    if (!cardId) return;
    const optimisticStatus = rating >= 3 ? 'mastered' : 'review';
    updateCardMastery(cardId, optimisticStatus);

    if (!token || !authFetch) return;
    try {
      const res = await authFetch(`${API_BASE}/api/tracking/cards/review`, {
        method: 'POST',
        body: JSON.stringify({
          card_key: cardId,
          card_type: 'flashcard',
          rating,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCardSm2Map(prev => ({ ...prev, [cardId]: updated }));
        if (updated.mastery_status) {
          updateCardMastery(cardId, updated.mastery_status);
        }
      }
    } catch (err) {
      console.error('Failed to save SM-2 card rating:', err);
    }
  }, [token, authFetch, updateCardMastery]);

  // Mistake Clinic State (Authenticated endpoint)
  const [mistakeClinicData, setMistakeClinicData] = useState(null);
  const [loadingClinic, setLoadingClinic] = useState(false);
  const [selectedClinicTopicId, setSelectedClinicTopicId] = useState('all');

  const fetchMistakeClinic = useCallback(() => {
    if (!token || !authFetch) {
      setMistakeClinicData(null);
      return;
    }
    setLoadingClinic(true);
    authFetch(`${API_BASE}/api/learning/mistake-clinic`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) setMistakeClinicData(data);
      })
      .catch(err => console.error('Failed to load mistake clinic:', err))
      .finally(() => setLoadingClinic(false));
  }, [token, authFetch]);

  useEffect(() => {
    if (token) {
      fetchMistakeClinic();
    } else {
      setMistakeClinicData(null);
    }
  }, [token, fetchMistakeClinic]);

  // Load overview on mount
  useEffect(() => {
    setLoadingOverview(true);
    fetch(`${API_BASE}/api/learning/overview`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data || typeof data !== 'object') return;
        setOverviewData(data);
        if (initialTopicId) {
          const existsInDb = data?.topics?.some(t => t.id === initialTopicId);
          if (existsInDb) {
            setSelectedTopicId(initialTopicId);
            setHubMode('exam_topics');
          } else if (allStudyGuides[initialTopicId]) {
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
    if (!token || !authFetch) {
      setModuleData(null);
      setAuthRequiredModule(true);
      setLoadingModule(false);
      return;
    }
    setAuthRequiredModule(false);
    setLoadingModule(true);
    const endpoint = mode === 'textbooks' 
      ? `${API_BASE}/api/learning/textbook/${encodeURIComponent(id)}`
      : `${API_BASE}/api/learning/topic/${encodeURIComponent(id)}`;

    authFetch(endpoint)
      .then(res => {
        if (res.status === 401) {
          setAuthRequiredModule(true);
          throw new Error('Authentication required');
        }
        if (!res.ok) throw new Error('Module not found');
        return res.json();
      })
      .then(data => {
        setAuthRequiredModule(false);
        setModuleData(data);
        setSelectedTaskFilter('all');
        setSelectedCogFilter('all');
        const targetQId = initialQuestionIdRef.current;
        const matchedCaseIdx = targetQId && Array.isArray(data?.guided_cases)
          ? data.guided_cases.findIndex(c => Number(c.id) === Number(targetQId))
          : -1;
        setActiveCaseIndex(matchedCaseIdx >= 0 ? matchedCaseIdx : 0);
        setGuidedStep(1);
        setSelectedChoice(null);
        setCardIndex(0);
        setCardFlipped(false);
        setFlashcardOrder(null);
      })
      .catch(err => {
        console.error('Error loading pedagogical module:', err);
        setModuleData(null);
      })
      .finally(() => setLoadingModule(false));
  }, [token, authFetch]);

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
    const allList = Object.entries(allStudyGuides).map(([id, g]) => ({ id, ...g }));
    const list = !selectedSpecialty || selectedSpecialty === 'all'
      ? allList
      : allList.filter(g => g.category === selectedSpecialty || g.specialty === selectedSpecialty);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.overview.toLowerCase().includes(q) ||
      g.core_mechanism.toLowerCase().includes(q) ||
      (g.must_know_topics && g.must_know_topics.some(t => t.toLowerCase().includes(q)))
    );
  }, [allStudyGuides, selectedSpecialty, searchQuery]);

  // All 11 Specialties structured with their topics, textbooks, and masterclass guides
  const specialtySections = useMemo(() => {
    const rawTopics = overviewData?.topics?.length
      ? overviewData.topics
      : Object.entries(allStudyGuides).map(([id, g]) => ({
          id,
          title_th: g.title,
          title_en: (g.must_know_topics || []).join(' • '),
          category: g.category || g.specialty || 'อื่นๆ',
          question_count: 0,
          cognitive_counts: { R: 0, A: 0, P: 0 },
        }));
    const rawTextbooks = overviewData?.textbooks || [];
    const allGuidesList = Object.entries(allStudyGuides).map(([id, g]) => ({ id, ...g }));

    return SPECIALTY_CATEGORIES.filter(cat => cat.id !== 'all').map((cat, idx) => {
      const color = SPECIALTY_COLOR_MAP[cat.id] || cat.color || '#2563eb';
      const topics = rawTopics.filter(t => t.category === cat.id);
      const guides = allGuidesList.filter(g => (g.category || g.specialty) === cat.id);
      const textbooks = rawTextbooks.filter(tb => tb.specialty === cat.id);
      const totalQuestions = topics.reduce((sum, t) => sum + (t.question_count || 0), 0);
      const masteryCounts = {
        green: topics.filter(t => topicMastery[t.id] === 'green').length,
        yellow: topics.filter(t => topicMastery[t.id] === 'yellow').length,
        red: topics.filter(t => topicMastery[t.id] === 'red').length,
      };
      return {
        ...cat,
        index: idx + 1,
        color,
        topics,
        guides,
        textbooks,
        totalQuestions,
        masteryCounts,
      };
    });
  }, [overviewData, allStudyGuides, topicMastery]);

  const visibleSpecialtySections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return specialtySections
      .filter(sec => selectedSpecialty === 'all' || sec.id === selectedSpecialty)
      .map(sec => {
        if (!q) return sec;
        const matchSpec = sec.name.toLowerCase().includes(q) || sec.id.toLowerCase().includes(q);
        if (matchSpec) return sec;
        const matchedTopics = sec.topics.filter(t =>
          t.id.toLowerCase().includes(q) ||
          (t.title_th || '').toLowerCase().includes(q) ||
          (t.title_en || '').toLowerCase().includes(q) ||
          (allStudyGuides[t.id]?.overview || '').toLowerCase().includes(q)
        );
        return { ...sec, topics: matchedTopics };
      })
      .filter(sec => sec.topics.length > 0 || sec.guides.length > 0);
  }, [specialtySections, selectedSpecialty, searchQuery, allStudyGuides]);

  const groupedTopicsBySpecialty = useMemo(() => {
    const groups = [];
    SPECIALTY_CATEGORIES.filter(c => c.id !== 'all').forEach((cat, idx) => {
      const items = filteredTopics.filter(t => t.category === cat.id);
      if (items.length > 0) {
        groups.push({
          ...cat,
          index: idx + 1,
          color: SPECIALTY_COLOR_MAP[cat.id] || cat.color || '#2563eb',
          items,
          totalQuestions: items.reduce((s, t) => s + (t.question_count || 0), 0),
        });
      }
    });
    return groups;
  }, [filteredTopics]);

  const groupedMasterclassBySpecialty = useMemo(() => {
    const groups = [];
    SPECIALTY_CATEGORIES.filter(c => c.id !== 'all').forEach((cat, idx) => {
      const items = filteredMasterclass.filter(g => (g.category || g.specialty) === cat.id);
      if (items.length > 0) {
        groups.push({
          ...cat,
          index: idx + 1,
          color: SPECIALTY_COLOR_MAP[cat.id] || cat.color || '#2563eb',
          items,
        });
      }
    });
    return groups;
  }, [filteredMasterclass]);

  const handleSelectSpecialty = useCallback((specId) => {
    setSelectedSpecialty(specId);
    if (specId && specId !== 'all') {
      const specSec = specialtySections.find(s => s.id === specId);
      if (specSec) {
        if (specSec.topics.length > 0 && !specSec.topics.some(t => t.id === selectedTopicId)) {
          setSelectedTopicId(specSec.topics[0].id);
        }
        if (specSec.textbooks.length > 0 && !specSec.textbooks.some(tb => tb.id === selectedTextbookId)) {
          setSelectedTextbookId(specSec.textbooks[0].id);
        }
        if (specSec.guides.length > 0 && !specSec.guides.some(g => g.id === selectedMasterclassId)) {
          setSelectedMasterclassId(specSec.guides[0].id);
        }
      }
    }
  }, [specialtySections, selectedTopicId, selectedTextbookId, selectedMasterclassId]);

  const currentSpecialtyNav = useMemo(() => {
    if (hubMode === 'exam_topics') {
      const currentTopicObj =
        overviewData?.topics?.find(t => t.id === selectedTopicId) ||
        (allStudyGuides[selectedTopicId]
          ? {
              id: selectedTopicId,
              title_th: allStudyGuides[selectedTopicId].title,
              category: allStudyGuides[selectedTopicId].category || allStudyGuides[selectedTopicId].specialty,
            }
          : null);
      const specId = currentTopicObj?.category || (selectedSpecialty !== 'all' ? selectedSpecialty : null);
      const specSec = specialtySections.find(s => s.id === specId);
      if (!specSec || specSec.topics.length === 0) return null;
      const idx = Math.max(0, specSec.topics.findIndex(t => t.id === selectedTopicId));
      return {
        specSec,
        items: specSec.topics.map(t => ({ id: t.id, title: t.title_th, count: t.question_count })),
        currentIndex: idx,
        prevItem: idx > 0 ? specSec.topics[idx - 1] : null,
        nextItem: idx < specSec.topics.length - 1 ? specSec.topics[idx + 1] : null,
      };
    }
    if (hubMode === 'masterclass') {
      const g = allStudyGuides[selectedMasterclassId];
      const specId = g?.category || g?.specialty || (selectedSpecialty !== 'all' ? selectedSpecialty : null);
      const specSec = specialtySections.find(s => s.id === specId);
      if (!specSec || specSec.guides.length === 0) return null;
      const idx = Math.max(0, specSec.guides.findIndex(item => item.id === selectedMasterclassId));
      return {
        specSec,
        items: specSec.guides.map(item => ({ id: item.id, title: item.title, count: null })),
        currentIndex: idx,
        prevItem: idx > 0 ? specSec.guides[idx - 1] : null,
        nextItem: idx < specSec.guides.length - 1 ? specSec.guides[idx + 1] : null,
      };
    }
    return null;
  }, [hubMode, overviewData, allStudyGuides, selectedTopicId, selectedMasterclassId, selectedSpecialty, specialtySections]);

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
      return allStudyGuides[selectedMasterclassId] || null;
    }
    if (hubMode === 'exam_topics' && selectedTopicId && allStudyGuides[selectedTopicId]) {
      return allStudyGuides[selectedTopicId];
    }
    return null;
  }, [hubMode, selectedMasterclassId, selectedTopicId, allStudyGuides]);

  // Question-specific focused lesson & textbook card (deep-linked from Practice / Review)
  const focusedQuestionLesson = useMemo(() => {
    const targetQId = initialQuestionId || initialQuestion?.id || null;
    if (!targetQId && !initialQuestion) return null;

    let matchedLesson = null;
    if (targetQId && Array.isArray(moduleData?.task_modules)) {
      for (const tm of moduleData.task_modules) {
        const found = tm.lessons?.find(l => Number(l.question_id) === Number(targetQId));
        if (found) {
          matchedLesson = found;
          break;
        }
      }
    }

    const matchedGuidedCase = targetQId && Array.isArray(moduleData?.guided_cases)
      ? moduleData.guided_cases.find(c => Number(c.id) === Number(targetQId))
      : null;

    let parsedExpl = null;
    const rawExpl = initialQuestion?.explanation;
    if (rawExpl) {
      if (typeof rawExpl === 'object') {
        parsedExpl = rawExpl;
      } else if (typeof rawExpl === 'string') {
        try {
          parsedExpl = JSON.parse(rawExpl);
        } catch {
          parsedExpl = { core_principle: rawExpl };
        }
      }
    }

    const keyTakeaway = matchedLesson?.key_takeaway || parsedExpl?.key_takeaway || parsedExpl?.why_correct || '';
    const corePrinciple = matchedLesson?.core_principle || parsedExpl?.core_principle || '';
    const clinicalPearl = matchedLesson?.clinical_pearl || parsedExpl?.clinical_pearl || parsedExpl?.future_prediction || '';
    const commonPitfall = matchedLesson?.common_pitfall || parsedExpl?.common_pitfall || '';
    const reference = matchedLesson?.reference || parsedExpl?.reference || parsedExpl?.legal_citation || '';

    if (!corePrinciple && !keyTakeaway) return null;

    return {
      question_id: targetQId || matchedLesson?.question_id || null,
      category: initialQuestion?.category || moduleData?.module_info?.category || '',
      task: matchedLesson?.task || initialQuestion?.task || '',
      cognitive_level: matchedLesson?.cognitive_level || initialQuestion?.cognitive_level || parsedExpl?.cognitive_level || 'A',
      stem: initialQuestion?.stem || matchedGuidedCase?.raw_question?.stem || '',
      proposition: initialQuestion?.proposition || matchedGuidedCase?.raw_question?.proposition || '',
      question_text: initialQuestion?.question_text || matchedGuidedCase?.raw_question?.question_text || '',
      correct_answer: initialQuestion?.correct_answer || parsedExpl?.correct_answer || matchedGuidedCase?.step3_evidence_resolution?.correct_answer || '',
      choices: initialQuestion?.choices || matchedGuidedCase?.raw_question?.choices || [],
      key_takeaway: keyTakeaway,
      core_principle: corePrinciple,
      clinical_pearl: clinicalPearl,
      common_pitfall: commonPitfall,
      reference,
      choice_explanations: parsedExpl?.choice_explanations || matchedGuidedCase?.step3_evidence_resolution?.choice_explanations || null,
    };
  }, [initialQuestionId, initialQuestion, moduleData]);

  const focusedQuestionPathway = useMemo(() => {
    if (!focusedQuestionLesson?.core_principle && !focusedQuestionLesson?.key_takeaway) return null;
    return buildDynamicPathwayFromText({
      title: `แผนผังกลไกทฤษฎีจาก Textbook (Q#${focusedQuestionLesson.question_id || '-'})`,
      corePrinciple: focusedQuestionLesson.core_principle,
      keyTakeaway: focusedQuestionLesson.key_takeaway,
      clinicalPearl: focusedQuestionLesson.clinical_pearl,
      commonPitfall: focusedQuestionLesson.common_pitfall,
      reference: focusedQuestionLesson.reference,
      category: focusedQuestionLesson.category,
      task: focusedQuestionLesson.task,
      isLegal: String(focusedQuestionLesson.category || '').includes('กฎหมาย'),
    });
  }, [focusedQuestionLesson]);

  // Combined Curated + Dynamic + Thai National Protocol Pathways
  const allModulePathways = useMemo(() => {
    const curatedAndExtracted = moduleData?.pathways || [];
    const thaiProtoPaths = (moduleData?.thai_protocols || [])
      .map(tp => buildPathwayFromThaiProtocol(tp))
      .filter(Boolean);
    return [...curatedAndExtracted, ...thaiProtoPaths];
  }, [moduleData]);

  const filteredModulePathways = useMemo(() => {
    if (selectedPathwayFilter === 'all') return allModulePathways;
    return allModulePathways.filter(p => p.pathway_type === selectedPathwayFilter);
  }, [allModulePathways, selectedPathwayFilter]);

  const masterclassPathway = useMemo(() => {
    if (!matchingMasterclass?.core_mechanism) return null;
    return buildDynamicPathwayFromText({
      title: `แผนผังกลไก & กระบวนการ: ${matchingMasterclass.title}`,
      corePrinciple: matchingMasterclass.core_mechanism,
      clinicalPearl: matchingMasterclass.pearl || '',
      reference: matchingMasterclass.reference || '',
      category: matchingMasterclass.category || '',
      isLegal: String(matchingMasterclass.category || '').includes('กฎหมาย'),
    });
  }, [matchingMasterclass]);

  const currentGuidedTheoryPathway = useMemo(() => {
    if (!currentGuidedCase?.step1_textbook_lesson?.core_principle) return null;
    return buildDynamicPathwayFromText({
      title: `แผนผังกลไกทฤษฎีจาก Textbook (Q#${currentGuidedCase.id})`,
      corePrinciple: currentGuidedCase.step1_textbook_lesson.core_principle,
      keyTakeaway: currentGuidedCase.step3_evidence_resolution?.key_takeaway || '',
      clinicalPearl: currentGuidedCase.step1_textbook_lesson.clinical_pearl || '',
      reference: currentGuidedCase.step1_textbook_lesson.reference || '',
      category: currentGuidedCase.category || '',
      task: currentGuidedCase.task || '',
      isLegal: String(currentGuidedCase.category || '').includes('กฎหมาย'),
    });
  }, [currentGuidedCase]);

  // Active Flashcards Deck for Sub-Tab 3
  const rawFlashcards = moduleData?.flashcards || [];
  const activeFlashcards = useMemo(() => {
    let cards = rawFlashcards;
    if (flashcardOrder && flashcardOrder.length === rawFlashcards.length) {
      cards = flashcardOrder.map(i => rawFlashcards[i]).filter(Boolean);
    }
    if (onlyUnmasteredCards) {
      cards = cards.filter(c => cardMastery[c.id] !== 'mastered');
    }
    if (onlyDueCards) {
      cards = cards.filter(c => {
        const sm2 = cardSm2Map[c.id];
        return !sm2 || sm2.is_due;
      });
    }
    return cards;
  }, [rawFlashcards, flashcardOrder, onlyUnmasteredCards, onlyDueCards, cardMastery, cardSm2Map]);

  const currentFlashcard = activeFlashcards[cardIndex] || activeFlashcards[0] || null;
  const masteredCardsCount = useMemo(() => {
    return rawFlashcards.filter(c => cardMastery[c.id] === 'mastered').length;
  }, [rawFlashcards, cardMastery]);
  const dueCardsCount = useMemo(() => {
    return rawFlashcards.filter(c => !cardSm2Map[c.id] || cardSm2Map[c.id].is_due).length;
  }, [rawFlashcards, cardSm2Map]);

  const handleShuffleFlashcards = () => {
    const idxs = rawFlashcards.map((_, i) => i);
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    setFlashcardOrder(idxs);
    setCardIndex(0);
    setCardFlipped(false);
  };

  // Filtered Mistake Clinic cases
  const filteredClinicCases = useMemo(() => {
    const cases = mistakeClinicData?.wrong_cases || [];
    if (selectedClinicTopicId === 'all') return cases;
    return cases.filter(c => c.topic_id === selectedClinicTopicId);
  }, [mistakeClinicData, selectedClinicTopicId]);

  const handleDrillQuestions = (questionsList) => {
    if (!onStartExam || !questionsList || questionsList.length === 0) return;
    onStartExam({
      mode: 'practice',
      questions: questionsList,
      count: questionsList.length,
    });
    if (isModal && onClose) onClose();
  };

  const handleStartDueReview = async () => {
    if (!onStartExam || !token || !authFetch) return;
    try {
      const res = await authFetch(`${API_BASE}/api/tracking/review-due`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.questions?.length > 0) {
        onStartExam({
          mode: 'practice',
          questions: data.questions,
          count: data.questions.length,
        });
        if (isModal && onClose) onClose();
      }
    } catch (err) {
      console.error('Failed to start SM-2 due review:', err);
    }
  };

  const handleOpenCaseInTeacher = (questionId) => {
    if (!moduleData?.guided_cases) return;
    setSelectedCogFilter('all');
    setSelectedTaskFilter('all');
    const idx = moduleData.guided_cases.findIndex(c => Number(c.id) === Number(questionId));
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

  const modalBodyRef = useRef(null);

  useEffect(() => {
    if (!isModal) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => {
      modalBodyRef.current?.focus({ preventScroll: true });
    }, 0);
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && onCloseRef.current) {
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isModal]);

  useEffect(() => {
    if (isModal && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isModal, selectedTopicId, classroomTab, hubMode]);

  const containerStyle = isModal ? {
    position: 'fixed',
    inset: 0,
    zIndex: 100000,
    background: 'rgba(15, 23, 42, 0.74)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(0.6rem, 2vw, 1.5rem)',
    boxSizing: 'border-box',
    overflow: 'hidden',
    overscrollBehavior: 'contain',
  } : {
    width: '100%',
    paddingBottom: '4rem',
  };

  const innerStyle = isModal ? {
    width: '100%',
    maxWidth: 'min(1180px, calc(100vw - 1.5rem))',
    height: 'min(88dvh, 860px)',
    maxHeight: 'calc(100dvh - 1.5rem)',
    background: 'var(--bg-panel)',
    borderRadius: '18px',
    border: '1px solid var(--border-hover)',
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateZ(0)',
    boxShadow: 'var(--shadow-elevated)',
  } : {};

  const toggleSidebarSpecGroup = useCallback((specId) => {
    setCollapsedSidebarSpecs(prev => ({ ...prev, [specId]: !prev[specId] }));
  }, []);

  const handleSelectNavChapter = useCallback((itemId, specId) => {
    if (specId) {
      setSelectedSpecialty(specId);
    }
    if (hubMode === 'masterclass') {
      setSelectedMasterclassId(itemId);
      if (overviewData?.topics?.some(t => t.id === itemId)) {
        setSelectedTopicId(itemId);
      }
    } else {
      setSelectedTopicId(itemId);
      if (allStudyGuides[itemId]) {
        setSelectedMasterclassId(itemId);
      }
    }
  }, [hubMode, overviewData, allStudyGuides]);

  const renderFocusedQuestionLessonCard = (canOpenTeacher = false) => {
    if (!focusedQuestionLesson) return null;
    const ansUpper = String(focusedQuestionLesson.correct_answer || '').trim().toUpperCase();
    const matchedChoice = Array.isArray(focusedQuestionLesson.choices)
      ? focusedQuestionLesson.choices.find(c => String(c?.label || '').trim().toUpperCase() === ansUpper)
      : null;
    const askText = focusedQuestionLesson.proposition || focusedQuestionLesson.question_text || focusedQuestionLesson.stem || '';
    const hasGuidedMatch = Boolean(
      canOpenTeacher &&
      focusedQuestionLesson.question_id &&
      moduleData?.guided_cases?.some(c => Number(c.id) === Number(focusedQuestionLesson.question_id))
    );

    return (
      <div
        ref={focusedQuestionRef}
        id="focused-question-lesson-card"
        style={{
          marginBottom: '1.35rem',
          padding: 'clamp(1rem, 2vw, 1.35rem)',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.09), rgba(16, 185, 129, 0.05))',
          border: '2px solid rgba(37, 99, 235, 0.38)',
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.1)',
          minWidth: 0,
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.55rem',
          marginBottom: '0.85rem',
          paddingBottom: '0.7rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', minWidth: 0 }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '0.24rem 0.72rem',
              borderRadius: '999px',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <Target size={13} /> บทเรียน & Textbook เฉพาะข้อที่คุณกำลังทำอยู่ {focusedQuestionLesson.question_id ? `(Q#${focusedQuestionLesson.question_id})` : ''}
            </span>
            {focusedQuestionLesson.cognitive_level && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.18rem 0.55rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.14)',
                color: 'var(--ink-emerald)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}>
                ระดับ {focusedQuestionLesson.cognitive_level}
              </span>
            )}
            {focusedQuestionLesson.task && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.18rem 0.55rem',
                borderRadius: '8px',
                background: 'var(--surface-card)',
                color: 'var(--text-sub)',
                border: '1px solid var(--border)',
              }}>
                {focusedQuestionLesson.task}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {focusedQuestionPathway && (
              <button
                type="button"
                onClick={() => setFocusedQuestionPathwayOpen(prev => !prev)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.28rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <GitBranch size={13} />
                {focusedQuestionPathwayOpen ? '📄 ซ่อนแผนผัง Pathway' : '🔀 ดูเป็นแผนผัง Pathway'}
              </button>
            )}
            {hasGuidedMatch && (
              <button
                type="button"
                onClick={() => handleOpenCaseInTeacher(focusedQuestionLesson.question_id)}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.28rem 0.7rem' }}
              >
                🧑‍🏫 ฝึกวิเคราะห์โจทย์ข้อนี้ทีละก้าว
              </button>
            )}
            <button
              type="button"
              onClick={() => document.getElementById('topic-overview-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.28rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <BookOpen size={13} /> ดูเนื้อหารวมทั้งหัวข้อด้านล่าง
            </button>
          </div>
        </div>

        {(askText || matchedChoice || ansUpper) && (
          <div style={{
            padding: '0.75rem 0.95rem',
            borderRadius: '10px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border)',
            marginBottom: '0.85rem',
            fontSize: '0.84rem',
            lineHeight: 1.55,
          }}>
            {askText && (
              <div style={{ color: 'var(--text-sub)', marginBottom: (matchedChoice || ansUpper) ? '0.4rem' : 0, overflowWrap: 'anywhere' }}>
                <strong style={{ color: 'var(--text)' }}>โจทย์ข้อนี้: </strong>
                {askText.length > 220 ? `${askText.slice(0, 220)}...` : askText}
              </div>
            )}
            {(ansUpper || matchedChoice?.text) && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap', color: 'var(--ink-emerald)', fontWeight: 700 }}>
                <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>เฉลย {ansUpper}{matchedChoice?.text ? `: ${matchedChoice.text}` : ''}</span>
              </div>
            )}
          </div>
        )}

        {focusedQuestionLesson.key_takeaway && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1), rgba(37, 99, 235, 0.08))',
            borderLeft: '4px solid var(--accent)',
            borderRadius: '8px',
            padding: '0.8rem 1rem',
            marginBottom: '0.9rem',
            fontSize: '0.92rem',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.6,
            overflowWrap: 'anywhere',
          }}>
            📌 สรุปหลักการสำคัญ (Core Rule): {focusedQuestionLesson.key_takeaway}
          </div>
        )}

        {focusedQuestionLesson.core_principle && (
          <div style={{ marginBottom: '0.9rem', minWidth: 0 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={15} /> ทฤษฎีและกลไกจาก Textbook & Evidence (Core Principle)
            </div>
            {focusedQuestionPathwayOpen && focusedQuestionPathway && (
              <div style={{ marginBottom: '0.75rem', minWidth: 0, maxWidth: '100%' }}>
                <ClinicalPathwayDiagram pathway={focusedQuestionPathway} compact={true} />
              </div>
            )}
            <div style={{
              color: 'var(--text)',
              fontSize: '0.91rem',
              lineHeight: 1.75,
              whiteSpace: 'pre-wrap',
              background: 'var(--surface)',
              padding: '0.95rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              overflowWrap: 'anywhere',
            }}>
              {focusedQuestionLesson.core_principle}
            </div>
          </div>
        )}

        {(focusedQuestionLesson.clinical_pearl || focusedQuestionLesson.common_pitfall) && (
          <div className={focusedQuestionLesson.clinical_pearl && focusedQuestionLesson.common_pitfall ? 'responsive-2col' : ''} style={{ display: 'grid', gridTemplateColumns: focusedQuestionLesson.clinical_pearl && focusedQuestionLesson.common_pitfall ? undefined : '1fr', gap: '0.75rem', marginBottom: focusedQuestionLesson.reference ? '0.85rem' : 0 }}>
            {focusedQuestionLesson.clinical_pearl && (
              <div style={{
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.28)',
                borderRadius: '8px',
                padding: '0.75rem 0.9rem',
                fontSize: '0.84rem',
                color: 'var(--text-sub)',
                lineHeight: 1.6,
                overflowWrap: 'anywhere',
              }}>
                <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '3px' }}>💎 Clinical Pearl:</strong>
                {focusedQuestionLesson.clinical_pearl}
              </div>
            )}
            {focusedQuestionLesson.common_pitfall && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.28)',
                borderRadius: '8px',
                padding: '0.75rem 0.9rem',
                fontSize: '0.84rem',
                color: 'var(--text-sub)',
                lineHeight: 1.6,
                overflowWrap: 'anywhere',
              }}>
                <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '3px' }}>⚠️ กับดักข้อสอบ (Trap):</strong>
                {focusedQuestionLesson.common_pitfall}
              </div>
            )}
          </div>
        )}

        {focusedQuestionLesson.reference && (
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-sub)',
            padding: '0.6rem 0.85rem',
            borderRadius: '8px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border)',
            lineHeight: 1.5,
            overflowWrap: 'anywhere',
          }}>
            📚 <strong style={{ color: 'var(--text)' }}>ตำราและเกณฑ์อ้างอิง:</strong> {focusedQuestionLesson.reference}
          </div>
        )}
      </div>
    );
  };

  const renderSpecialtyChapterBar = () => {
    if (!currentSpecialtyNav) return null;
    const { specSec, items, currentIndex, prevItem, nextItem } = currentSpecialtyNav;
    return (
      <div
        className="specialty-chapter-nav-bar"
        style={{
          marginBottom: '1.15rem',
          padding: '0.85rem 1.1rem',
          borderRadius: '14px',
          background: 'var(--surface-card)',
          border: `1px solid ${specSec.color}40`,
          borderLeft: `5px solid ${specSec.color}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          minWidth: 0,
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.73rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '999px',
              background: `${specSec.color}18`,
              color: specSec.color,
              border: `1px solid ${specSec.color}45`,
            }}>
              สาขาที่ {specSec.index}: {specSec.name}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>
              บทที่ {currentIndex + 1} จาก {items.length} บทเรียนในสาขานี้
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setHubMode('by_specialty')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.28rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Layers size={13} /> สารบัญ 11 สาขา
            </button>
            <button
              type="button"
              disabled={!prevItem}
              onClick={() => prevItem && handleSelectNavChapter(prevItem.id, specSec.id)}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.28rem 0.65rem',
                opacity: prevItem ? 1 : 0.45,
                cursor: prevItem ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
              title={prevItem ? `บทก่อนหน้า: ${prevItem.title_th || prevItem.title}` : 'อยู่บทแรกของสาขานี้แล้ว'}
            >
              <ChevronLeft size={14} /> บทก่อนหน้า
            </button>
            <button
              type="button"
              disabled={!nextItem}
              onClick={() => nextItem && handleSelectNavChapter(nextItem.id, specSec.id)}
              className="btn btn-primary btn-sm"
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.28rem 0.7rem',
                background: specSec.color,
                border: 'none',
                opacity: nextItem ? 1 : 0.45,
                cursor: nextItem ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
              title={nextItem ? `บทถัดไป: ${nextItem.title_th || nextItem.title}` : 'อยู่บทสุดท้ายของสาขานี้แล้ว'}
            >
              บทถัดไปในสาขา <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Horizontal Chapter Pills for this Specialty */}
        <div style={{
          display: 'flex',
          gap: '0.38rem',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'thin',
          minWidth: 0,
          maxWidth: '100%',
        }}>
          {items.map((chap, cIdx) => {
            const isCurr = cIdx === currentIndex;
            const mLvl = topicMastery[chap.id];
            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => handleSelectNavChapter(chap.id, specSec.id)}
                style={{
                  padding: '0.3rem 0.68rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: isCurr ? 800 : 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: isCurr ? specSec.color : 'var(--surface-subtle)',
                  color: isCurr ? '#ffffff' : 'var(--text-sub)',
                  border: isCurr ? `1px solid ${specSec.color}` : '1px solid var(--border)',
                  maxWidth: '240px',
                }}
                title={`บทที่ ${cIdx + 1}: ${chap.title}`}
              >
                <span style={{ opacity: isCurr ? 0.95 : 0.75, fontWeight: 800 }}>บทที่ {cIdx + 1}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chap.title}
                </span>
                {mLvl && MASTERY_META[mLvl] && (
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: isCurr ? '#ffffff' : MASTERY_META[mLvl].dotColor,
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const hubContent = (
    <div
      style={containerStyle}
      onClick={isModal && onClose ? onClose : undefined}
      role={isModal ? 'dialog' : undefined}
      aria-modal={isModal ? 'true' : undefined}
    >
      <div
        style={innerStyle}
        className={isModal ? 'clinical-study-modal-panel' : 'animate-fade-in'}
        onClick={isModal ? (e) => e.stopPropagation() : undefined}
      >
        
        {/* ══════════════════════════════════════════════════════════════════
            1. PINNED TITLE HEADER
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isModal ? '0.8rem 1.25rem' : '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(2, 132, 199, 0.05))',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
              {onBack && !isModal && (
                <button 
                  onClick={onBack}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                >
                  <ArrowLeft size={16} /> กลับหน้าหลัก
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  flexShrink: 0,
                }}>
                  <GraduationCap size={22} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: 'clamp(1rem, 2.2vw, 1.18rem)', fontWeight: 800, margin: 0, color: 'var(--text)', lineHeight: 1.3 }}>
                    ระบบการเรียนรู้จากข้อสอบด้วย Textbook & Evidence (Exam-Driven Academy)
                  </h2>
                  <span className="clinical-header-subtitle" style={{ fontSize: '0.8rem', color: 'var(--text-sub)', display: 'block', marginTop: '0.15rem' }}>
                    สกัดเนื้อหา ทฤษฎี และกลไกจากข้อสอบจริง {overviewData?.summary?.total_questions?.toLocaleString() || '2,249'} ข้อ ครบ {overviewData?.summary?.total_topics || 83} หัวข้อ มาสอนตามตำราอ้างอิงมาตรฐาน
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              {isModal && (
                <button
                  type="button"
                  onClick={() => setShowModalSidebar(prev => !prev)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', fontWeight: 700, padding: '0.35rem 0.7rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Layers size={14} /> {showModalSidebar ? 'ซ่อนสารบัญ' : 'สารบัญ 83 หัวข้อ'}
                </button>
              )}
              {isModal && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="ปิดหน้าต่างบทเรียน"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '36px', height: '36px', padding: 0, borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Unified scrollable body (mode switcher, filters, and lesson content all scroll smoothly) */}
        <div
          ref={modalBodyRef}
          tabIndex={isModal ? -1 : undefined}
          className={isModal ? 'clinical-study-modal-body' : undefined}
          style={isModal ? {
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
            outline: 'none',
          } : undefined}
        >
          {/* Mode Switcher Pills */}
          <div
            className="study-mode-tabs"
            style={{
              padding: '0.75rem 1.35rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-panel)',
            }}
          >
            <button
              onClick={() => setHubMode('by_specialty')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: hubMode === 'by_specialty' ? 'var(--primary)' : 'var(--surface-card)',
                color: hubMode === 'by_specialty' ? '#fff' : 'var(--text-sub)',
                border: hubMode === 'by_specialty' ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              <Layers size={15} /> แยกตามสาขาวิชา (11 สาขา)
            </button>

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
                background: hubMode === 'exam_topics' ? 'var(--primary)' : 'var(--surface-card)',
                color: hubMode === 'exam_topics' ? '#fff' : 'var(--text-sub)',
                border: hubMode === 'exam_topics' ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              เรียนตามหัวข้อข้อสอบ ({overviewData?.summary?.total_topics || 83} Topics)
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
                background: hubMode === 'textbooks' ? '#10b981' : 'var(--surface-card)',
                color: hubMode === 'textbooks' ? '#fff' : 'var(--text-sub)',
                border: hubMode === 'textbooks' ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              ตำราสากล & เกณฑ์สมาคมทันตแพทย์ไทย ({overviewData?.summary?.total_textbooks || 14} ชุด)
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
                background: hubMode === 'masterclass' ? 'var(--primary)' : 'var(--surface-card)',
                color: hubMode === 'masterclass' ? '#fff' : 'var(--text-sub)',
                border: hubMode === 'masterclass' ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              ตารางสรุป Masterclass ({Object.keys(allStudyGuides).length} Guides)
            </button>

            {!isModal && (
              <>
                <button
                  onClick={() => setHubMode('visual_atlas')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: hubMode === 'visual_atlas' ? '#0284c7' : 'rgba(56,189,248,0.1)',
                    color: hubMode === 'visual_atlas' ? '#fff' : 'var(--ink-sky)',
                    border: hubMode === 'visual_atlas' ? '1px solid #0284c7' : '1px solid rgba(56,189,248,0.32)',
                  }}
                >
                  คลังภาพวินิจฉัย (112 ภาพ)
                </button>

                <button
                  onClick={() => setHubMode('calc_lab')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: hubMode === 'calc_lab' ? '#059669' : 'rgba(16,185,129,0.1)',
                    color: hubMode === 'calc_lab' ? '#fff' : 'var(--ink-emerald)',
                    border: hubMode === 'calc_lab' ? '1px solid #059669' : '1px solid rgba(16,185,129,0.32)',
                  }}
                >
                  ห้องฝึกคำนวณคลินิก
                </button>

                <button
                  onClick={() => setHubMode('cloze_arena')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: hubMode === 'cloze_arena' ? 'var(--primary)' : 'var(--surface-card)',
                    color: hubMode === 'cloze_arena' ? '#fff' : 'var(--text-sub)',
                    border: hubMode === 'cloze_arena' ? '1px solid var(--primary)' : '1px solid var(--border)',
                  }}
                >
                  Cloze & กับดักข้อสอบ
                </button>

                <button
                  onClick={() => {
                    setHubMode('mistake_clinic');
                    if (token) fetchMistakeClinic();
                  }}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: hubMode === 'mistake_clinic' ? '#f43f5e' : 'rgba(244,63,94,0.1)',
                    color: hubMode === 'mistake_clinic' ? '#fff' : 'var(--ink-rose)',
                    border: hubMode === 'mistake_clinic' ? '1px solid #f43f5e' : '1px solid rgba(244,63,94,0.32)',
                  }}
                >
                  <Stethoscope size={15} /> คลินิกซ่อมจุดอ่อน
                  {mistakeClinicData?.total_wrong_unique > 0 && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.05rem 0.45rem',
                      borderRadius: '10px',
                      background: hubMode === 'mistake_clinic' ? 'rgba(255,255,255,0.25)' : '#f43f5e',
                      color: '#fff',
                    }}>
                      {mistakeClinicData.total_wrong_unique}
                    </span>
                  )}
                </button>
              </>
            )}

            {copiedNotification && (
              <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                คัดลอกลิงก์แล้ว!
              </span>
            )}
          </div>

        {/* ══════════════════════════════════════════════════════════════════
            2. SEARCH & SPECIALTY PILL FILTERS
        ══════════════════════════════════════════════════════════════════ */}
        {(!isModal || showModalSidebar) && (
        <div
          className={`clinical-filter-bar ${(hubMode === 'exam_topics' || hubMode === 'textbooks' || hubMode === 'masterclass' || hubMode === 'mistake_clinic') && !mobileSidebarOpen ? 'is-collapsed-mobile' : ''}`}
          style={{
          padding: '0.85rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.7rem',
          flexShrink: 0,
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
                background: 'var(--surface-card)',
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
              const specSec = cat.id !== 'all' ? specialtySections.find(s => s.id === cat.id) : null;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectSpecialty(cat.id)}
                  style={{
                    padding: '0.32rem 0.78rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                    background: isActive ? cat.color : 'var(--surface-subtle)',
                    color: isActive ? '#ffffff' : 'var(--text-sub)',
                    border: isActive ? `1px solid ${cat.color}` : '1px solid var(--border)',
                  }}
                >
                  {cat.icon ? <span>{cat.icon}</span> : null}
                  <span>{cat.name}</span>
                  {specSec && specSec.topics.length > 0 && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.05rem 0.42rem',
                      borderRadius: '999px',
                      background: isActive ? 'rgba(255,255,255,0.22)' : 'var(--surface-card)',
                      color: isActive ? '#ffffff' : specSec.color,
                    }}>
                      {specSec.topics.length} บท
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            3. MAIN SPLIT LAYOUT OR INTERACTIVE FULL-WIDTH LABS
        ══════════════════════════════════════════════════════════════════ */}
        {hubMode === 'by_specialty' ? (
          <div style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem)', background: 'var(--bg-surface)' }}>
            <div style={{ maxWidth: '1220px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              {/* Top Directory Intro Banner */}
              <div style={{
                padding: '1.15rem 1.35rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(2, 132, 199, 0.04))',
                border: '1px solid rgba(37, 99, 235, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.85rem',
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>
                    📚 สารบัญเลกเชอร์แยกตามสาขาวิชาทันตแพทยศาสตร์ (11 สาขาวิชา)
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                    แยกบทเรียน ทฤษฎี กลไกพยาธิสรีรวิทยา และตารางเปรียบเทียบออกเป็นแต่ละสาขา เรียงลำดับบทที่ 1 ➔ บทสุดท้ายตามสัดส่วนข้อสอบจริง เพื่อให้อ่านเข้าใจจบเป็นรายวิชา
                  </div>
                </div>
                {selectedSpecialty !== 'all' && (
                  <button
                    type="button"
                    onClick={() => handleSelectSpecialty('all')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontWeight: 700 }}
                  >
                    แสดงครบทั้ง 11 สาขาวิชา
                  </button>
                )}
              </div>

              {/* Quick Specialty Jump Cards Row when viewing all */}
              {selectedSpecialty === 'all' && !searchQuery.trim() && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: '0.65rem',
                }}>
                  {specialtySections.map((sec) => (
                    <button
                      key={`jump-${sec.id}`}
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(`specialty-section-${sec.index}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '12px',
                        background: 'var(--surface-card)',
                        border: '1px solid var(--border)',
                        borderLeft: `4px solid ${sec.color}`,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: sec.color }}>
                          สาขาที่ {sec.index}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {sec.topics.length} บท • {sec.totalQuestions} ข้อ
                        </span>
                      </div>
                      <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sec.id}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 11 Specialty Curriculum Sections */}
              {visibleSpecialtySections.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  ไม่พบหัวข้อบทเรียนที่ตรงกับคำค้นหา "{searchQuery}"
                </div>
              ) : (
                visibleSpecialtySections.map((sec) => (
                  <section
                    key={sec.id}
                    id={`specialty-section-${sec.index}`}
                    style={{
                      borderRadius: '16px',
                      background: 'var(--surface-card)',
                      border: `1px solid ${sec.color}38`,
                      borderTop: `4px solid ${sec.color}`,
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    {/* Specialty Section Header */}
                    <div style={{
                      padding: '1.15rem 1.35rem',
                      background: `linear-gradient(135deg, ${sec.color}14, transparent)`,
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                    }}>
                      <div style={{ minWidth: 0, flex: '1 1 320px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.18rem 0.6rem',
                            borderRadius: '999px',
                            background: sec.color,
                            color: '#ffffff',
                          }}>
                            สาขาที่ {sec.index} / 11
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.18rem 0.6rem',
                            borderRadius: '999px',
                            background: `${sec.color}18`,
                            color: sec.color,
                          }}>
                            {sec.topics.length} บทเรียนหลัก
                          </span>
                          {sec.totalQuestions > 0 && (
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.18rem 0.6rem',
                              borderRadius: '999px',
                              background: 'var(--surface-subtle)',
                              color: 'var(--text-sub)',
                              border: '1px solid var(--border)',
                            }}>
                              ออกสอบจริงรวม {sec.totalQuestions} ข้อ
                            </span>
                          )}
                          {sec.masteryCounts.green > 0 && (
                            <span style={{
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              padding: '0.18rem 0.6rem',
                              borderRadius: '999px',
                              background: MASTERY_META.green.bg,
                              color: MASTERY_META.green.color,
                              border: `1px solid ${MASTERY_META.green.border}`,
                            }}>
                              ✓ พร้อมสอบ {sec.masteryCounts.green}/{sec.topics.length} บท
                            </span>
                          )}
                        </div>

                        <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.22rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.35 }}>
                          {sec.name}
                        </h3>

                        {sec.textbooks.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                              📖 ตำราหลักประจำสาขา:
                            </span>
                            {sec.textbooks.map(tb => (
                              <button
                                key={tb.id}
                                type="button"
                                onClick={() => {
                                  setSelectedSpecialty(sec.id);
                                  setSelectedTextbookId(tb.id);
                                  setHubMode('textbooks');
                                }}
                                style={{
                                  fontSize: '0.73rem',
                                  fontWeight: 600,
                                  padding: '0.15rem 0.55rem',
                                  borderRadius: '6px',
                                  background: 'var(--surface-subtle)',
                                  border: '1px solid var(--border)',
                                  color: 'var(--text-sub)',
                                  cursor: 'pointer',
                                }}
                              >
                                {tb.icon} {tb.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {sec.topics.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSpecialty(sec.id);
                              setSelectedTopicId(sec.topics[0].id);
                              if (allStudyGuides[sec.topics[0].id]) {
                                setSelectedMasterclassId(sec.topics[0].id);
                              }
                              setHubMode('exam_topics');
                              setClassroomTab('synthesized');
                            }}
                            className="btn btn-primary btn-sm"
                            style={{
                              background: sec.color,
                              border: 'none',
                              fontWeight: 800,
                              padding: '0.48rem 0.95rem',
                              borderRadius: '10px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <BookOpen size={15} /> เริ่มอ่านสาขานี้ (บทที่ 1 ➔ {sec.topics.length})
                          </button>
                        )}
                        {sec.guides.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSpecialty(sec.id);
                              setSelectedMasterclassId(sec.guides[0].id);
                              setHubMode('masterclass');
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{
                              fontWeight: 700,
                              padding: '0.45rem 0.85rem',
                              borderRadius: '10px',
                            }}
                          >
                            ตารางสรุป Masterclass ({sec.guides.length})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Numbered Chapters Grid inside this Specialty */}
                    <div style={{
                      padding: '1rem 1.25rem 1.25rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                      gap: '0.75rem',
                    }}>
                      {sec.topics.map((topic, tIdx) => {
                        const guide = allStudyGuides[topic.id];
                        const mLvl = topicMastery[topic.id];
                        return (
                          <div
                            key={topic.id}
                            onClick={() => {
                              setSelectedSpecialty(sec.id);
                              setSelectedTopicId(topic.id);
                              if (guide) setSelectedMasterclassId(topic.id);
                              setHubMode('exam_topics');
                              setClassroomTab('synthesized');
                            }}
                            style={{
                              padding: '0.85rem 1rem',
                              borderRadius: '12px',
                              background: 'var(--surface-subtle)',
                              border: '1px solid var(--border)',
                              borderLeft: `4px solid ${sec.color}`,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '0.35rem' }}>
                                <span style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '0.12rem 0.5rem',
                                  borderRadius: '6px',
                                  background: `${sec.color}18`,
                                  color: sec.color,
                                }}>
                                  บทที่ {tIdx + 1}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  {mLvl && MASTERY_META[mLvl] && (
                                    <span style={{
                                      fontSize: '0.66rem',
                                      fontWeight: 700,
                                      padding: '0.08rem 0.42rem',
                                      borderRadius: '6px',
                                      background: MASTERY_META[mLvl].bg,
                                      color: MASTERY_META[mLvl].color,
                                      border: `1px solid ${MASTERY_META[mLvl].border}`,
                                    }}>
                                      {MASTERY_META[mLvl].label}
                                    </span>
                                  )}
                                  {topic.question_count > 0 && (
                                    <span style={{
                                      fontSize: '0.7rem',
                                      fontWeight: 800,
                                      color: 'var(--text-muted)',
                                      background: 'var(--surface-card)',
                                      padding: '0.1rem 0.45rem',
                                      borderRadius: '8px',
                                      border: '1px solid var(--border)',
                                    }}>
                                      {topic.question_count} ข้อ
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: '0.2rem' }}>
                                {topic.title_th}
                              </div>
                              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: guide?.overview ? '0.35rem' : 0 }}>
                                {topic.title_en || topic.id}
                              </div>

                              {guide?.overview && (
                                <div style={{
                                  fontSize: '0.78rem',
                                  color: 'var(--text-sub)',
                                  lineHeight: 1.45,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}>
                                  {guide.overview}
                                </div>
                              )}
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '6px',
                              paddingTop: '0.4rem',
                              borderTop: '1px dashed var(--border)',
                              marginTop: '0.15rem',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                {topic.cognitive_counts && (topic.cognitive_counts.R + topic.cognitive_counts.A + topic.cognitive_counts.P > 0) && (
                                  <>
                                    <span style={{ fontSize: '0.64rem', padding: '0.04rem 0.32rem', borderRadius: '4px', background: 'rgba(16,185,129,0.12)', color: 'var(--ink-emerald)' }}>
                                      R:{topic.cognitive_counts.R || 0}
                                    </span>
                                    <span style={{ fontSize: '0.64rem', padding: '0.04rem 0.32rem', borderRadius: '4px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
                                      A:{topic.cognitive_counts.A || 0}
                                    </span>
                                    <span style={{ fontSize: '0.64rem', padding: '0.04rem 0.32rem', borderRadius: '4px', background: 'rgba(239,68,68,0.12)', color: 'var(--ink-rose)' }}>
                                      P:{topic.cognitive_counts.P || 0}
                                    </span>
                                  </>
                                )}
                                {guide?.matrix_rows && (
                                  <span style={{ fontSize: '0.65rem', padding: '0.04rem 0.38rem', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary-light)', fontWeight: 700 }}>
                                    มีตารางเปรียบเทียบ
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: sec.color, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                อ่านบทนี้ <ChevronRight size={14} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        ) : hubMode === 'visual_atlas' ? (
          <div>
          <VisualAtlas
            selectedSpecialty={selectedSpecialty}
            searchQuery={searchQuery}
            specialtyColorMap={SPECIALTY_COLOR_MAP}
            onStartExam={onStartExam}
            onOpenAuthModal={onOpenAuthModal}
            isModal={isModal}
            onClose={onClose}
            onOpenTopic={(topicId) => {
              setSelectedSpecialty('all');
              setSelectedTopicId(topicId);
              setHubMode('exam_topics');
              setClassroomTab('synthesized');
            }}
          />
          </div>
        ) : hubMode === 'calc_lab' ? (
          <div style={{ padding: '1.25rem' }}>
            <CalcSimulator
              onOpenTopic={(topicId) => {
                setSelectedSpecialty('all');
                setSelectedTopicId(topicId);
                setHubMode('exam_topics');
                setClassroomTab('synthesized');
              }}
            />
          </div>
        ) : hubMode === 'cloze_arena' ? (
          <div style={{ padding: '1.25rem' }}>
            <ClozePitfallArena
              selectedSpecialty={selectedSpecialty}
              searchQuery={searchQuery}
              onStartExam={onStartExam}
              onOpenAuthModal={onOpenAuthModal}
              isModal={isModal}
              onClose={onClose}
              onOpenTopic={(topicId) => {
                setSelectedSpecialty('all');
                setSelectedTopicId(topicId);
                setHubMode('exam_topics');
                setClassroomTab('synthesized');
              }}
            />
          </div>
        ) : (
        <>
          <div className="clinical-sidebar-mobile-bar">
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                กำลังศึกษาหัวข้อ
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {moduleData?.module_info?.title_th || selectedMasterclassId || 'เลือกบทเรียนจากสารบัญ'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(prev => !prev)}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0, fontWeight: 700 }}
            >
              <Filter size={14} /> {mobileSidebarOpen ? 'ซ่อนรายการ' : 'เปลี่ยนหัวข้อ'}
            </button>
          </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isModal
            ? (showModalSidebar ? 'minmax(240px, 280px) minmax(0, 1fr)' : 'minmax(0, 1fr)')
            : '320px minmax(0, 1fr)',
          alignItems: isModal ? 'start' : undefined,
          minHeight: isModal ? 0 : '780px',
          height: 'auto',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: isModal ? 'visible' : 'hidden'
        }} className="clinical-study-grid">
          
          {/* ── LEFT COLUMN: CURRICULUM NAVIGATOR ───────────────────────── */}
          {(!isModal || showModalSidebar || mobileSidebarOpen) && (
          <div
            className={`clinical-sidebar-panel ${mobileSidebarOpen ? '' : 'is-collapsed-mobile'}`}
            style={{
              borderRight: '1px solid var(--border)',
              background: 'var(--surface-subtle)',
              overflowY: 'auto',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {/* MODE 1 SIDEBAR: 83 EXAM-DRIVEN TOPICS */}
            {hubMode === 'exam_topics' && (
              <>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>หัวข้อที่สกัดจากข้อสอบ ({filteredTopics.length} หัวข้อ)</span>
                  <span>จำนวนข้อ</span>
                </div>
                {Object.keys(topicMastery).length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.4rem 0.65rem',
                    margin: '0 0.15rem 0.3rem 0.15rem',
                    borderRadius: '10px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    color: 'var(--text-sub)'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span className="topic-mastery-dot" style={{ backgroundColor: MASTERY_META.green.dotColor }} />
                      {Object.values(topicMastery).filter(v => v === 'green').length}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span className="topic-mastery-dot" style={{ backgroundColor: MASTERY_META.yellow.dotColor }} />
                      {Object.values(topicMastery).filter(v => v === 'yellow').length}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span className="topic-mastery-dot" style={{ backgroundColor: MASTERY_META.red.dotColor }} />
                      {Object.values(topicMastery).filter(v => v === 'red').length}
                    </span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>ระดับจำทั้งหมด</span>
                  </div>
                )}
                {loadingOverview ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    กำลังสกัดโครงสร้างบทเรียนจากคลังข้อสอบ...
                  </div>
                ) : filteredTopics.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    ไม่พบหัวข้อที่ตรงกับคำค้นหา
                  </div>
                ) : (
                  groupedTopicsBySpecialty.map(group => {
                    const isGroupCollapsed = Boolean(collapsedSidebarSpecs[group.id]);
                    const hasActiveInGroup = group.items.some(t => t.id === selectedTopicId);
                    return (
                      <div
                        key={group.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                          marginBottom: '0.45rem',
                          borderRadius: '10px',
                          background: hasActiveInGroup ? 'rgba(37, 99, 235, 0.04)' : 'transparent'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSidebarSpecGroup(group.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                            padding: '0.5rem 0.65rem',
                            borderRadius: '8px',
                            background: 'var(--surface-card)',
                            border: hasActiveInGroup ? `1px solid ${group.color}65` : '1px solid var(--border)',
                            borderLeft: `4px solid ${group.color}`,
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          <span style={{ fontSize: '0.77rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.35 }}>
                            {group.index ? `สาขาที่ ${group.index}: ` : ''}{group.id}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '0.1rem 0.42rem',
                              borderRadius: '8px',
                              background: `${group.color}20`,
                              color: group.color
                            }}>
                              {group.items.length} บท
                            </span>
                            {isGroupCollapsed ? <ChevronDown size={13} color="var(--text-muted)" /> : <ChevronUp size={13} color="var(--text-muted)" />}
                          </span>
                        </button>

                        {!isGroupCollapsed && group.items.map((topic, chapterIdx) => {
                          const isSelected = topic.id === selectedTopicId;
                          const badgeColor = SPECIALTY_COLOR_MAP[topic.category] || group.color || '#2563eb';
                          const hasMasterclass = Boolean(allStudyGuides[topic.id]);
                          return (
                            <div
                              key={topic.id}
                              onClick={() => { setSelectedTopicId(topic.id); setMobileSidebarOpen(false); }}
                              style={{
                                padding: '0.7rem 0.85rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                background: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'var(--surface-card)',
                                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                                borderLeft: isSelected ? `4px solid ${badgeColor}` : `4px solid ${badgeColor}50`,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '0.3rem' }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '6px',
                                  background: `${badgeColor}20`,
                                  color: badgeColor,
                                }}>
                                  บทที่ {chapterIdx + 1} • {topic.category}
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
                                <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '4px', background: 'rgba(16,185,129,0.12)', color: 'var(--ink-emerald)' }}>
                                  R:{topic.cognitive_counts?.R || 0}
                                </span>
                                <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '4px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
                                  A:{topic.cognitive_counts?.A || 0}
                                </span>
                                <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem', borderRadius: '4px', background: 'rgba(239,68,68,0.12)', color: 'var(--ink-rose)' }}>
                                  P:{topic.cognitive_counts?.P || 0}
                                </span>
                                {hasMasterclass && (
                                  <span style={{ fontSize: '0.65rem', padding: '0.05rem 0.4rem', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.14)', color: 'var(--primary-light)', fontWeight: 700 }}>
                                    ตาราง Masterclass
                                  </span>
                                )}
                                {topicMastery[topic.id] && MASTERY_META[topicMastery[topic.id]] && (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.67rem',
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '6px',
                                    background: MASTERY_META[topicMastery[topic.id]].bg,
                                    color: MASTERY_META[topicMastery[topic.id]].color,
                                    border: `1px solid ${MASTERY_META[topicMastery[topic.id]].border}`,
                                    fontWeight: 700,
                                    marginLeft: 'auto'
                                  }}>
                                    <span
                                      className="topic-mastery-dot"
                                      style={{ backgroundColor: MASTERY_META[topicMastery[topic.id]].dotColor, width: '6px', height: '6px' }}
                                    />
                                    {MASTERY_META[topicMastery[topic.id]].label}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
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
                      onClick={() => { setSelectedTextbookId(tb.id); setMobileSidebarOpen(false); }}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface-card)',
                        border: isSelected ? `1px solid ${tb.color}` : '1px solid var(--border)',
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
                      {tb.thai_association && (
                        <div style={{
                          fontSize: '0.73rem',
                          color: 'var(--ink-emerald)',
                          fontWeight: 600,
                          marginBottom: '0.3rem',
                          lineHeight: 1.35
                        }}>
                          🇹🇭 {tb.thai_association}
                        </div>
                      )}
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                        ครอบคลุม {tb.topic_count} หัวข้อ Must-Know
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* MODE 3 SIDEBAR: 89 CURATED MASTERCLASS GUIDES GROUPED BY SPECIALTY */}
            {hubMode === 'masterclass' && (
              <>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                  คัมภีร์สรุป Masterclass ({filteredMasterclass.length} บทเรียน)
                </div>
                {groupedMasterclassBySpecialty.map(group => {
                  const isGroupCollapsed = Boolean(collapsedSidebarSpecs[`mc_${group.id}`]);
                  const hasActiveInGroup = group.items.some(g => g.id === selectedMasterclassId);
                  return (
                    <div
                      key={group.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        marginBottom: '0.45rem',
                        borderRadius: '10px',
                        background: hasActiveInGroup ? 'rgba(37, 99, 235, 0.04)' : 'transparent'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSidebarSpecGroup(`mc_${group.id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '8px',
                          background: 'var(--surface-card)',
                          border: hasActiveInGroup ? `1px solid ${group.color}65` : '1px solid var(--border)',
                          borderLeft: `4px solid ${group.color}`,
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%'
                        }}
                      >
                        <span style={{ fontSize: '0.77rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.35 }}>
                          {group.index ? `สาขาที่ ${group.index}: ` : ''}{group.id}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '0.1rem 0.42rem',
                            borderRadius: '8px',
                            background: `${group.color}20`,
                            color: group.color
                          }}>
                            {group.items.length} บท
                          </span>
                          {isGroupCollapsed ? <ChevronDown size={13} color="var(--text-muted)" /> : <ChevronUp size={13} color="var(--text-muted)" />}
                        </span>
                      </button>

                      {!isGroupCollapsed && group.items.map((guide, chapterIdx) => {
                        const isSelected = guide.id === selectedMasterclassId;
                        return (
                          <div
                            key={guide.id}
                            onClick={() => { setSelectedMasterclassId(guide.id); setMobileSidebarOpen(false); }}
                            style={{
                              padding: '0.7rem 0.85rem',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              background: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'var(--surface-card)',
                              border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                              borderLeft: `4px solid ${guide.badgeColor || group.color || 'var(--primary)'}`,
                            }}
                          >
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: guide.badgeColor || group.color, marginBottom: '0.25rem' }}>
                              บทที่ {chapterIdx + 1} • {guide.specialty}
                            </div>
                            <div style={{ fontSize: '0.86rem', fontWeight: isSelected ? 700 : 600, color: 'var(--text)', lineHeight: 1.4 }}>
                              {guide.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}

            {/* MODE 4 SIDEBAR: MISTAKE CLINIC FILTER BY WEAKEST TOPIC */}
            {hubMode === 'mistake_clinic' && (
              <>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                  จุดอ่อนจากประวัติการสอบ ({mistakeClinicData?.weak_topics?.length || 0} หัวข้อ)
                </div>
                {!token ? (
                  <div style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                    เข้าสู่ระบบก่อนเพื่อวิเคราะห์ข้อผิดพลาดจากสถิติของคุณโดยเฉพาะ
                  </div>
                ) : loadingClinic ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    กำลังวิเคราะห์จุดอ่อนของคุณ...
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => setSelectedClinicTopicId('all')}
                      style={{
                        padding: '0.7rem 0.85rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: selectedClinicTopicId === 'all' ? 'rgba(244, 63, 94, 0.14)' : 'var(--surface-subtle)',
                        border: selectedClinicTopicId === 'all' ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>📋 รวมทุกข้อที่เคยพลาด</span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--ink-rose)' }}>
                        {mistakeClinicData?.wrong_cases?.length || 0} ข้อ
                      </span>
                    </div>
                    {mistakeClinicData?.weak_topics?.map(wt => {
                      const isSel = selectedClinicTopicId === wt.topic_id;
                      const badgeColor = SPECIALTY_COLOR_MAP[wt.category] || '#f43f5e';
                      return (
                        <div
                          key={wt.topic_id}
                          onClick={() => setSelectedClinicTopicId(wt.topic_id)}
                          style={{
                            padding: '0.7rem 0.85rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            background: isSel ? 'rgba(244, 63, 94, 0.14)' : 'var(--surface-subtle)',
                            border: isSel ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.05)',
                            borderLeft: `4px solid ${badgeColor}`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: badgeColor }}>{wt.category}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ink-rose)' }}>
                              ถูก {wt.accuracy_pct}% ({wt.wrong_count} ผิด)
                            </span>
                          </div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>
                            {wt.title_th}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
          )}

          {/* ── RIGHT COLUMN: INTERACTIVE PEDAGOGICAL CLASSROOM ─────────── */}
          <div
            className="clinical-classroom-panel"
            style={{
              overflowY: isModal ? 'visible' : 'auto',
              overflowX: 'hidden',
              minHeight: 0,
              minWidth: 0,
              maxWidth: '100%',
              width: '100%',
              boxSizing: 'border-box',
              padding: isModal ? '1.15rem 1.35rem 2rem' : '1.75rem 2.25rem',
              background: 'var(--bg-surface)',
            }}
          >
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
                <div style={{ maxWidth: '960px', width: '100%', minWidth: 0, boxSizing: 'border-box', margin: '0 auto' }}>
                  {hubMode === 'exam_topics' && renderFocusedQuestionLessonCard(true)}
                  {hubMode === 'exam_topics' && renderSpecialtyChapterBar()}
                  
                  {/* ── Classroom Topic/Textbook Header Banner ── */}
                  <div id="topic-overview-anchor" style={{
                    marginBottom: '1.5rem',
                    padding: '1.35rem 1.5rem',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.09), rgba(2, 132, 199, 0.05))',
                    border: '1px solid rgba(37, 99, 235, 0.25)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          background: 'rgba(37, 99, 235, 0.14)',
                          color: 'var(--primary-light)',
                          border: '1px solid rgba(37, 99, 235, 0.35)'
                        }}>
                          {moduleData.module_info.category}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: 'var(--ink-emerald)',
                        }}>
                          🎯 สกัดจากข้อสอบจริง {moduleData.module_info.total_questions} ข้อ ({moduleData.module_info.synthesized_lessons_count} บทเรียนย่อย)
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          R: {moduleData.module_info.cognitive_counts?.R || 0} • A: {moduleData.module_info.cognitive_counts?.A || 0} • P: {moduleData.module_info.cognitive_counts?.P || 0}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        {onStartExam && (
                          <button
                            onClick={handleStartTopicPractice}
                            className="btn btn-primary btn-sm"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'var(--primary)',
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
                    </div>

                    <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 0.35rem 0', lineHeight: 1.35 }}>
                      {moduleData.module_info.title_th}
                    </h1>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '0.85rem' }}>
                      {moduleData.module_info.title_en}
                    </div>

                    {hubMode === 'exam_topics' && selectedTopicId && (
                      <div style={{ marginBottom: '0.9rem' }}>
                        <TopicMasterySelector
                          topicId={selectedTopicId}
                          value={topicMastery[selectedTopicId]}
                          onChange={updateTopicMastery}
                          feedbackText={masteryFeedback?.topicId === selectedTopicId ? masteryFeedback.text : null}
                          label="ระดับจำหัวข้อนี้:"
                        />
                      </div>
                    )}

                    {/* Textbook & Evidence Sources Shelf */}
                    {moduleData.textbook_references && moduleData.textbook_references.length > 0 && (
                      <div style={{
                        background: 'var(--surface)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--border)',
                        marginBottom: moduleData.thai_protocols?.length > 0 ? '0.85rem' : 0
                      }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BookMarked size={15} /> ตำรามาตรฐานและหลักฐานทางวิชาการ (Textbooks & Evidence) ที่ใช้ออกข้อสอบหัวข้อนี้:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {moduleData.textbook_references.slice(0, 4).map((refItem, idx) => (
                            <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                              <span style={{ minWidth: 0, flex: '1 1 200px', overflowWrap: 'anywhere' }}>
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

                    {/* 🇹🇭 Thai Dental Council, Specialty Associations & MOPH Protocol Shelf */}
                    {moduleData.thai_protocols && moduleData.thai_protocols.length > 0 && (
                      <div style={{
                        background: 'var(--surface-subtle)',
                        borderRadius: '12px',
                        padding: '1rem 1.15rem',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                      }}>
                        <div style={{
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          color: 'var(--ink-emerald)',
                          marginBottom: '0.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span>🇹🇭 เกณฑ์อ้างอิงประเทศไทย: ทันตแพทยสภา • ราชวิทยาลัยฯ • สมาคมทันตแพทย์เฉพาะทาง • กรมอนามัย</span>
                          <button
                            type="button"
                            onClick={() => setClassroomTab('pathways')}
                            style={{
                              padding: '0.24rem 0.65rem',
                              borderRadius: '8px',
                              fontSize: '0.73rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.45)',
                              color: 'var(--ink-emerald)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <GitBranch size={13} /> ดูเป็นแผนผัง Protocol Pathway
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {moduleData.thai_protocols.map((tp, tpIdx) => (
                            <div key={tp.id || tpIdx} style={{
                              background: 'var(--surface)',
                              borderRadius: '10px',
                              padding: '0.85rem 1rem',
                              border: '1px solid var(--border)'
                            }}>
                              {tp.thai_association && (
                                <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.45rem' }}>
                                  🏛️ องค์กรวิชาชีพอ้างอิงของไทย: <span style={{ color: 'var(--ink-sky)' }}>{tp.thai_association}</span>
                                </div>
                              )}

                              {tp.thai_references && tp.thai_references.length > 0 && (
                                <div style={{ marginBottom: '0.55rem' }}>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    📘 ตำราภาษาไทยและแนวทางเวชปฏิบัติ (Thai CPG & Textbooks):
                                  </div>
                                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.79rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                                    {tp.thai_references.map((r, rIdx) => (
                                      <li key={rIdx}>{r}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {tp.thai_protocol_highlights && tp.thai_protocol_highlights.length > 0 && (
                                <div>
                                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--ink-amber)', marginBottom: '0.3rem' }}>
                                    ⚡ โปรโตคอลและเกณฑ์ตัวเลขเฉพาะประเทศไทยที่ใช้ตัดสินในข้อสอบ ศ.ท.ส.:
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {tp.thai_protocol_highlights.map((hl, hlIdx) => (
                                      <div key={hlIdx} style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text)',
                                        lineHeight: 1.6,
                                        background: 'var(--surface-subtle)',
                                        padding: '0.45rem 0.7rem',
                                        borderRadius: '8px',
                                        borderLeft: '3px solid #10b981'
                                      }}>
                                        {hl}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── 6 Classroom Pedagogical Sub-Tabs ── */}
                  <div style={{
                    display: 'flex',
                    gap: '0.45rem',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    {[
                      { id: 'synthesized', label: `📖 บทเรียนทฤษฎี (${moduleData.module_info.synthesized_lessons_count})`, desc: 'เรียนเนื้อหาที่สกัดจากข้อสอบแยกตามขั้นตอนคลินิก' },
                      { id: 'pathways', label: `แผนผัง Pathway & Protocol (${allModulePathways.length})`, desc: 'แผนผัง Flowchart กลไกการเกิดโรค ขั้นตอนรักษา และโปรโตคอลไทย' },
                      { id: 'guided_teacher', label: `🧑‍🏫 สอนทีละก้าวจากเคส (${moduleData.guided_cases?.length || 0})`, desc: 'ทำโจทย์หรือเรียนทฤษฎี → จับคีย์เวิร์ด → เฉลยรายตัวเลือก' },
                      { id: 'flashcards', label: `Flashcards จำแม่น (${moduleData.flashcards?.length || 0})`, desc: 'ปิดคำสำคัญฝึกดึงความจำ Active Recall' },
                      { id: 'cheat_sheet', label: `สรุปใบเดียวจบ (${(moduleData.high_yield_sheet?.must_know_numbers?.length || 0) + (moduleData.high_yield_sheet?.triggers_map?.length || 0)})`, desc: 'รวมตัวเลข Cut-off, มาตรากฎหมาย และตารางคีย์เวิร์ด ➔ คำตอบ' },
                      { id: 'differential', label: `⚖️ แยกแยะตัวเลือก (${moduleData.differential_comparisons?.length || 0})`, desc: 'ศึกษากลไกการแยกโรคจากตัวเลือก ก-จ' },
                      { id: 'pearls_traps', label: `Pearls & กับดัก (${(moduleData.pearls?.length || 0) + (moduleData.pitfalls?.length || 0)})`, desc: 'สรุปจุดเน้นและหลุมพรางที่ออกสอบบ่อย' },
                    ].map(tab => {
                      const active = classroomTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setClassroomTab(tab.id)}
                          title={tab.desc}
                          style={{
                            padding: '0.5rem 0.9rem',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: active ? 'var(--primary)' : 'var(--surface-card)',
                            color: active ? '#fff' : 'var(--text-sub)',
                            border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                            boxShadow: active ? 'var(--shadow-sm)' : 'none',
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
                          background: 'rgba(37, 99, 235, 0.05)',
                          border: '1px solid rgba(37, 99, 235, 0.25)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                            <Sparkles size={18} /> สรุปโครงสร้างหลักและตารางเปรียบเทียบ Masterclass (Decision Matrix)
                          </div>
                          <div style={{
                            color: 'var(--text-sub)',
                            fontSize: '0.92rem',
                            lineHeight: 1.75,
                            whiteSpace: 'pre-wrap',
                            background: 'var(--surface)',
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
                          {matchingMasterclass.reference && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.9rem', lineHeight: 1.5 }}>
                              📚 <strong style={{ color: 'var(--text)' }}>แหล่งอ้างอิง:</strong> {matchingMasterclass.reference}
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
                            background: selectedTaskFilter === 'all' ? 'var(--accent)' : 'var(--surface-card)',
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
                              background: selectedTaskFilter === tm.task ? 'var(--accent)' : 'var(--surface-card)',
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
                              background: 'rgba(37, 99, 235, 0.08)',
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
                              {tm.lessons.map((lesson, lIdx) => {
                                const isFocusedLesson = Boolean(
                                  focusedQuestionLesson?.question_id &&
                                  Number(lesson.question_id) === Number(focusedQuestionLesson.question_id)
                                );
                                return (
                                <div
                                  key={lesson.question_id}
                                  id={`study-lesson-q-${lesson.question_id}`}
                                  style={{
                                    background: 'var(--surface-subtle)',
                                    border: isFocusedLesson ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    boxShadow: isFocusedLesson ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : undefined,
                                    borderRadius: '12px',
                                    padding: '1.25rem 1.4rem',
                                  }}
                                >
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
                                      {isFocusedLesson && (
                                        <span style={{
                                          fontSize: '0.72rem',
                                          fontWeight: 800,
                                          padding: '0.15rem 0.55rem',
                                          borderRadius: '6px',
                                          background: 'var(--primary)',
                                          color: '#ffffff',
                                        }}>
                                          📍 ข้อที่กำลังเปิดดู
                                        </span>
                                      )}
                                      <span style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        padding: '0.15rem 0.55rem',
                                        borderRadius: '6px',
                                        background: 'rgba(37, 99, 235, 0.14)',
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
                                        color: lesson.cognitive_level === 'P' ? 'var(--ink-rose)' : lesson.cognitive_level === 'A' ? '#60a5fa' : 'var(--ink-emerald)',
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

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                      <button
                                        type="button"
                                        onClick={() => setLessonPathwayIds(prev => ({ ...prev, [lesson.question_id]: !prev[lesson.question_id] }))}
                                        style={{
                                          background: lessonPathwayIds[lesson.question_id] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.14)',
                                          border: lessonPathwayIds[lesson.question_id] ? '1px solid #10b981' : '1px solid rgba(6, 182, 212, 0.35)',
                                          color: lessonPathwayIds[lesson.question_id] ? 'var(--ink-emerald)' : '#22d3ee',
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
                                        <GitBranch size={13} /> {lessonPathwayIds[lesson.question_id] ? '📄 ดูแบบข้อความ' : '🔀 ดูเป็น Pathway'}
                                      </button>

                                      <button
                                        onClick={() => handleOpenCaseInTeacher(lesson.question_id)}
                                        style={{
                                          background: 'rgba(37, 99, 235, 0.12)',
                                          border: '1px solid rgba(37, 99, 235, 0.32)',
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
                                  </div>

                                  {/* Key Takeaway Callout */}
                                  {lesson.key_takeaway && (
                                    <div style={{
                                      background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(37, 99, 235, 0.07))',
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

                                  {/* Core Textbook Principle & Mechanism (Toggle between Prose and Pathway Diagram) */}
                                  {lessonPathwayIds[lesson.question_id] ? (() => {
                                    const lp = buildDynamicPathwayFromText({
                                      title: `แผนผังกระบวนการ & กลไก (Q#${lesson.question_id})`,
                                      corePrinciple: lesson.core_principle,
                                      keyTakeaway: lesson.key_takeaway,
                                      clinicalPearl: lesson.clinical_pearl,
                                      commonPitfall: lesson.common_pitfall,
                                      reference: lesson.reference,
                                      category: moduleData?.module_info?.category || '',
                                      task: lesson.task || '',
                                      isLegal: String(moduleData?.module_info?.category || '').includes('กฎหมาย'),
                                    });
                                    return lp ? (
                                      <ClinicalPathwayDiagram pathway={lp} compact={true} />
                                    ) : (
                                      <div style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                                        {lesson.core_principle}
                                      </div>
                                    );
                                  })() : (
                                    <div style={{
                                      color: 'var(--text-sub)',
                                      fontSize: '0.92rem',
                                      lineHeight: 1.75,
                                      whiteSpace: 'pre-wrap',
                                      marginBottom: (lesson.clinical_pearl || lesson.common_pitfall) ? '0.85rem' : 0
                                    }}>
                                      {lesson.core_principle}
                                    </div>
                                  )}

                                  {/* Pearl & Pitfall Footer */}
                                  {(lesson.clinical_pearl || lesson.common_pitfall) && (
                                    <div className={lesson.clinical_pearl && lesson.common_pitfall ? 'responsive-2col' : ''} style={{ display: 'grid', gridTemplateColumns: lesson.clinical_pearl && lesson.common_pitfall ? undefined : '1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                                      {lesson.clinical_pearl && (
                                        <div style={{
                                          background: 'rgba(37, 99, 235, 0.08)',
                                          border: '1px solid rgba(37, 99, 235, 0.25)',
                                          borderRadius: '8px',
                                          padding: '0.65rem 0.85rem',
                                          fontSize: '0.82rem',
                                          color: 'var(--text-sub)',
                                          lineHeight: 1.55
                                        }}>
                                          <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '2px' }}>Clinical Pearl:</strong>
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
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────
                      SUB-TAB: CLINICAL PATHWAYS, PATHOGENESIS & PROTOCOLS
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'pathways' && (
                    <div>
                      <div style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(37, 99, 235, 0.06))',
                        border: '1px solid rgba(6, 182, 212, 0.28)',
                        marginBottom: '1.15rem',
                        fontSize: '0.88rem',
                        lineHeight: 1.65,
                        color: 'var(--text-sub)'
                      }}>
                        <strong style={{ color: '#22d3ee' }}>🔀 แผนผังกลไก การเกิดโรค และโปรโตคอลการตัดสินใจ (Interactive Pathway Studio): </strong>
                        รวบรวมลำดับขั้นกลไกพยาธิกำเนิด (Pathogenesis), จุดแยกตัดสินใจ (Decision Tree), ขั้นตอนหัตถการ และโปรโตคอลมาตรฐานประเทศไทย (ทันตแพทยสภา • สมาคมวิชาชีพ • กรมอนามัย) พร้อมโหมด <strong>"👣 ไล่ดูทีละขั้น"</strong> และ <strong>"🎮 จำลองตัดสินใจ"</strong> สำหรับทดสอบ Clinical Judgment แบบโต้ตอบ
                      </div>

                      {/* Filter pills by Pathway Type */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        {[
                          { id: 'all', label: `ทั้งหมด (${allModulePathways.length})` },
                          { id: 'decision', label: 'แผนผังตัดสินใจ' },
                          { id: 'protocol', label: 'Clinical & Thai Protocols' },
                          { id: 'pathogenesis', label: 'กลไกการเกิดโรค / กระบวนการ' },
                          { id: 'procedure', label: 'ขั้นตอนหัตถการ' },
                          { id: 'legal', label: 'ขั้นตอนทางกฎหมาย' },
                        ].map(pf => {
                          const cnt = pf.id === 'all' ? allModulePathways.length : allModulePathways.filter(p => p.pathway_type === pf.id).length;
                          if (pf.id !== 'all' && cnt === 0) return null;
                          const active = selectedPathwayFilter === pf.id;
                          return (
                            <button
                              key={pf.id}
                              type="button"
                              onClick={() => setSelectedPathwayFilter(pf.id)}
                              style={{
                                padding: '0.32rem 0.75rem',
                                borderRadius: '16px',
                                fontSize: '0.77rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: active ? 'var(--primary)' : 'var(--surface-card)',
                                color: active ? '#fff' : 'var(--text-sub)',
                                border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                              }}
                            >
                              {pf.label}{pf.id !== 'all' ? ` (${cnt})` : ''}
                            </button>
                          );
                        })}
                      </div>

                      {filteredModulePathways.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {filteredModulePathways.map((pw, pIdx) => (
                            <ClinicalPathwayDiagram
                              key={pw.id || pIdx}
                              pathway={pw}
                              compact={false}
                            />
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          ยังไม่มีแผนผัง Pathway ในตัวกรองนี้
                        </div>
                      )}
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
                        background: 'var(--surface-subtle)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ระดับความซับซ้อน:</span>
                          {[
                            { id: 'all', label: `ทั้งหมด (${moduleData.guided_cases?.length || 0})` },
                            { id: 'R', label: `🟢 R: ปูพื้นฐาน (${moduleData.module_info.cognitive_counts?.R || 0})` },
                            { id: 'A', label: `A: ประยุกต์คลินิก (${moduleData.module_info.cognitive_counts?.A || 0})` },
                            { id: 'P', label: `P: แก้ปัญหาซับซ้อน (${moduleData.module_info.cognitive_counts?.P || 0})` },
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
                                background: selectedCogFilter === cf.id ? 'var(--primary)' : 'var(--surface-card)',
                                color: selectedCogFilter === cf.id ? '#fff' : 'var(--text-sub)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              {cf.label}
                            </button>
                          ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <div style={{
                            display: 'inline-flex',
                            padding: '0.2rem',
                            borderRadius: '10px',
                            background: 'var(--surface-subtle)',
                            border: '1px solid var(--border)',
                            gap: '3px'
                          }}>
                            <button
                              type="button"
                              onClick={() => {
                                setGuidedStyle('challenge_first');
                                setGuidedStep(1);
                              }}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '7px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: 'none',
                                background: guidedStyle === 'challenge_first' ? 'var(--primary)' : 'transparent',
                                color: guidedStyle === 'challenge_first' ? '#fff' : 'var(--text-sub)',
                              }}
                            >
                              🧩 ทำโจทย์ก่อน (Active Recall)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setGuidedStyle('teach_first');
                                setGuidedStep(1);
                              }}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '7px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: 'none',
                                background: guidedStyle === 'teach_first' ? '#10b981' : 'transparent',
                                color: guidedStyle === 'teach_first' ? '#fff' : 'var(--text-sub)',
                              }}
                            >
                              📖 เรียนทฤษฎีก่อน
                            </button>
                          </div>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-sub)', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={clueRadarEnabled}
                              onChange={(e) => setClueRadarEnabled(e.target.checked)}
                            />
                            🔍 เรดาร์คำใบ้ในโจทย์
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-sub)', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={showAllGuidedSteps}
                              onChange={(e) => setShowAllGuidedSteps(e.target.checked)}
                            />
                            แสดงทุกขั้นตอนพร้อมกัน
                          </label>
                        </div>
                      </div>

                      {currentGuidedCase ? (() => {
                        const isCaseResolved = showAllGuidedSteps || guidedStep >= 3 || selectedChoice !== null;
                        const showCaseFirst = guidedStyle === 'challenge_first';
                        const showTheoryCard = !showCaseFirst || isCaseResolved;
                        const showCaseCard = showCaseFirst || showAllGuidedSteps || guidedStep >= 2;

                        const correctLabel = String(currentGuidedCase.step3_evidence_resolution.correct_answer || '').trim().toUpperCase();
                        const pickedUpper = selectedChoice ? String(selectedChoice).trim().toUpperCase() : null;
                        const isUserWrong = Boolean(pickedUpper && correctLabel && pickedUpper !== correctLabel);
                        const isUserRight = Boolean(pickedUpper && correctLabel && pickedUpper === correctLabel);

                        const choiceExpls = currentGuidedCase.step3_evidence_resolution.choice_explanations || {};
                        const wrongReasonText = pickedUpper ? (choiceExpls[pickedUpper] || choiceExpls[selectedChoice] || '') : '';
                        const correctReasonText = choiceExpls[correctLabel] || '';
                        const caseTopicId = currentGuidedCase.raw_question?.must_know_topic || selectedTopicId;

                        const theoryStepNum = showCaseFirst ? 3 : 1;
                        const caseStepNum = showCaseFirst ? 1 : 2;
                        const resolutionStepNum = showCaseFirst ? 2 : 3;

                        const theoryCard = showTheoryCard ? (
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(2, 132, 199, 0.05))',
                            border: '1px solid rgba(37, 99, 235, 0.32)',
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
                                }}>{theoryStepNum}</span>
                                {showCaseFirst
                                  ? `ขั้นที่ ${theoryStepNum}: ทบทวนกลไก & หลักฐานเชิงลึกจาก Textbook`
                                  : `ขั้นที่ ${theoryStepNum}: เรียนทฤษฎีและกลไกจาก Textbook & Evidence (ศึกษาก่อนทำโจทย์)`}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem' }}>
                                {currentGuidedTheoryPathway && (
                                  <button
                                    type="button"
                                    onClick={() => setGuidedTheoryAsPathway(prev => !prev)}
                                    style={{
                                      padding: '0.24rem 0.7rem',
                                      borderRadius: '20px',
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      border: guidedTheoryAsPathway ? '1px solid rgba(2, 132, 199, 0.45)' : '1px solid var(--border)',
                                      background: guidedTheoryAsPathway ? 'rgba(2, 132, 199, 0.12)' : 'var(--surface-card)',
                                      color: guidedTheoryAsPathway ? 'var(--ink-sky)' : 'var(--text-sub)'
                                    }}
                                  >
                                    <GitBranch size={13} />
                                    {guidedTheoryAsPathway ? 'แผนผัง Pathway' : 'ข้อความ'}
                                  </button>
                                )}
                                <span style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.7rem',
                                  borderRadius: '20px',
                                  background: 'var(--surface)',
                                  color: 'var(--accent)',
                                  border: '1px solid rgba(6, 182, 212, 0.3)'
                                }}>
                                  📚 {currentGuidedCase.step1_textbook_lesson.reference}
                                </span>
                              </div>
                            </div>

                            {guidedTheoryAsPathway && currentGuidedTheoryPathway ? (
                              <ClinicalPathwayDiagram pathway={currentGuidedTheoryPathway} compact={true} />
                            ) : (
                              <div style={{
                                color: 'var(--text)',
                                fontSize: '0.95rem',
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap',
                                background: 'var(--surface)',
                                padding: '1.25rem',
                                borderRadius: '10px',
                                border: '1px solid var(--border)'
                              }}>
                                {currentGuidedCase.step1_textbook_lesson.core_principle}
                              </div>
                            )}

                            {currentGuidedCase.step1_textbook_lesson.clinical_pearl && (
                              <div style={{
                                marginTop: '0.9rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                background: 'rgba(37, 99, 235, 0.09)',
                                borderLeft: '4px solid var(--primary)',
                                fontSize: '0.88rem',
                                color: 'var(--text)'
                              }}>
                                <strong style={{ color: 'var(--primary-light)' }}>Clinical Pearl (จุดเน้นจากตำรา): </strong>
                                {currentGuidedCase.step1_textbook_lesson.clinical_pearl}
                              </div>
                            )}

                            {!showCaseFirst && !showAllGuidedSteps && guidedStep === 1 && (
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
                        ) : null;

                        const caseCard = showCaseCard ? (
                          <div style={{
                            background: 'var(--surface-subtle)',
                            border: '1px solid var(--border)',
                            borderRadius: '14px',
                            padding: '1.5rem',
                            marginBottom: '1.25rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 800, fontSize: '1.02rem' }}>
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
                                }}>{caseStepNum}</span>
                                ขั้นที่ {caseStepNum}: ถอดรหัสเคสผู้ป่วยจากข้อสอบจริงและลองเลือกคำตอบ (Active Recall)
                              </div>
                              {clueRadarEnabled && (
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-amber)', background: 'rgba(245, 158, 11, 0.12)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                                  🔍 ไฮไลต์คำใบ้ในโจทย์เปิดอยู่
                                </span>
                              )}
                            </div>

                            {currentGuidedCase.step2_clinical_case.stem &&
                             currentGuidedCase.step2_clinical_case.stem !== currentGuidedCase.step2_clinical_case.question_text && (
                              <div style={{
                                padding: '1rem',
                                background: 'var(--surface-subtle)',
                                borderRadius: '10px',
                                borderLeft: '4px solid var(--primary)',
                                marginBottom: '1rem',
                                fontSize: '0.92rem',
                                lineHeight: 1.7,
                                color: 'var(--text-sub)',
                                whiteSpace: 'pre-wrap'
                              }}>
                                <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>🩺 ข้อมูลเคสผู้ป่วย (Clinical Vignette / Stem):</strong>
                                {highlightClinicalClues(currentGuidedCase.step2_clinical_case.stem, clueRadarEnabled)}
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
                              {highlightClinicalClues(
                                currentGuidedCase.step2_clinical_case.proposition || currentGuidedCase.step2_clinical_case.question_text,
                                clueRadarEnabled
                              )}
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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                              {currentGuidedCase.step2_clinical_case.choices.map(c => {
                                const isPicked = selectedChoice === c.label;
                                const isCorrectAns = String(c.label).trim().toUpperCase() === correctLabel;

                                let bg = 'var(--surface-card)';
                                let border = '1px solid var(--border)';
                                if (isCaseResolved) {
                                  if (isCorrectAns) {
                                    bg = 'rgba(16, 185, 129, 0.12)';
                                    border = '1.5px solid var(--success)';
                                  } else if (isPicked && !isCorrectAns) {
                                    bg = 'rgba(244, 63, 94, 0.12)';
                                    border = '1.5px solid var(--danger)';
                                  }
                                } else if (isPicked) {
                                  bg = 'rgba(37, 99, 235, 0.14)';
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
                                      background: isCaseResolved && isCorrectAns ? 'var(--success)' : 'rgba(255,255,255,0.08)',
                                      color: isCaseResolved && isCorrectAns ? '#fff' : 'var(--text)',
                                      fontWeight: 800,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      {c.label}
                                    </span>
                                    <span style={{ flex: 1, lineHeight: 1.5 }}>{c.text}</span>
                                    {isCaseResolved && isCorrectAns && <CheckCircle2 size={18} color="var(--success)" />}
                                    {isCaseResolved && isPicked && !isCorrectAns && <XCircle size={18} color="var(--danger)" />}
                                  </button>
                                );
                              })}
                            </div>

                            {showCaseFirst && !isCaseResolved && (
                              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  onClick={() => setGuidedStep(3)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.8rem', fontWeight: 700 }}
                                >
                                  💡 ยังไม่มั่นใจ — เปิดดูเฉลยและบทเรียนจาก Textbook
                                </button>
                              </div>
                            )}
                          </div>
                        ) : null;

                        const resolutionCard = isCaseResolved ? (
                          <div style={{
                            background: 'rgba(16, 185, 129, 0.04)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '14px',
                            padding: '1.5rem',
                            marginBottom: '1.25rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-emerald)', fontWeight: 800, fontSize: '1.02rem' }}>
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
                                }}>{resolutionStepNum}</span>
                                ขั้นที่ {resolutionStepNum}: วิเคราะห์เจาะลึกทุกตัวเลือกตามหลักฐานวิชาการ (Differential Choice Analysis)
                              </div>
                              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)' }}>
                                เฉลยที่ถูกต้อง: ตัวเลือก {correctLabel}
                                {currentGuidedCase.step3_evidence_resolution.correct_choice_text
                                  ? ` — ${currentGuidedCase.step3_evidence_resolution.correct_choice_text}`
                                  : ''}
                              </span>
                            </div>

                            {isUserWrong && (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                gap: '0.75rem',
                                marginBottom: '1rem'
                              }}>
                                <div style={{
                                  padding: '0.85rem 1rem',
                                  borderRadius: '10px',
                                  background: 'rgba(244, 63, 94, 0.10)',
                                  border: '1px solid rgba(244, 63, 94, 0.35)',
                                  fontSize: '0.86rem',
                                  lineHeight: 1.55
                                }}>
                                  <strong style={{ color: 'var(--ink-rose)', display: 'block', marginBottom: '0.25rem' }}>
                                    ทำไมตัวเลือก {pickedUpper} ที่คุณเลือกจึงพลาด:
                                  </strong>
                                  <span style={{ color: 'var(--text-sub)' }}>{wrongReasonText || 'ยังไม่ตรงกับเกณฑ์วินิจฉัยหรือข้อบ่งชี้หลักของเคสนี้'}</span>
                                </div>
                                <div style={{
                                  padding: '0.85rem 1rem',
                                  borderRadius: '10px',
                                  background: 'rgba(16, 185, 129, 0.10)',
                                  border: '1px solid rgba(16, 185, 129, 0.35)',
                                  fontSize: '0.86rem',
                                  lineHeight: 1.55
                                }}>
                                  <strong style={{ color: 'var(--ink-emerald)', display: 'block', marginBottom: '0.25rem' }}>
                                    ✓ ทำไมเฉลย {correctLabel} จึงถูกต้องที่สุด:
                                  </strong>
                                  <span style={{ color: 'var(--text-sub)' }}>{correctReasonText || currentGuidedCase.step3_evidence_resolution.key_takeaway}</span>
                                </div>
                              </div>
                            )}

                            {isUserRight && (
                              <div style={{
                                padding: '0.7rem 1rem',
                                borderRadius: '8px',
                                background: 'rgba(16, 185, 129, 0.14)',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                color: 'var(--ink-emerald)',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                marginBottom: '1rem'
                              }}>
                                🎉 เยี่ยมมาก! คุณเลือกตัวเลือก {pickedUpper} ได้ถูกต้อง ลองเช็กเหตุผลตัดตัวลวงข้ออื่นด้านล่างเพื่อให้แม่น 100%
                              </div>
                            )}

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
                                  const isCorr = String(lbl).trim().toUpperCase() === correctLabel;
                                  const isPick = String(lbl).trim().toUpperCase() === pickedUpper;
                                  const choiceObj = currentGuidedCase.step2_clinical_case.choices?.find(ch => String(ch.label).trim().toUpperCase() === String(lbl).trim().toUpperCase());
                                  return (
                                    <div key={lbl} style={{
                                      padding: '0.75rem 0.95rem',
                                      borderRadius: '8px',
                                      background: isCorr ? 'rgba(16, 185, 129, 0.10)' : isPick ? 'rgba(244, 63, 94, 0.08)' : 'var(--surface-subtle)',
                                      border: isCorr ? '1px solid rgba(16, 185, 129, 0.35)' : isPick ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid var(--border)',
                                      borderLeft: isCorr ? '4px solid var(--success)' : isPick ? '4px solid var(--danger)' : '4px solid var(--border-hover)',
                                      fontSize: '0.88rem',
                                      lineHeight: 1.6
                                    }}>
                                      <strong style={{ color: isCorr ? 'var(--ink-emerald)' : isPick ? 'var(--ink-rose)' : 'var(--text)' }}>
                                        ตัวเลือก {lbl}{choiceObj?.text ? ` (${choiceObj.text})` : ''}:{' '}
                                      </strong>
                                      <span style={{ color: 'var(--text-sub)' }}>{text}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Step 4: Quick Self-Mastery Rating & Next Case CTA */}
                            <div style={{
                              marginTop: '1.1rem',
                              paddingTop: '0.9rem',
                              borderTop: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '0.75rem'
                            }}>
                              {caseTopicId && (
                                <TopicMasterySelector
                                  topicId={caseTopicId}
                                  value={topicMastery[caseTopicId]}
                                  onChange={updateTopicMastery}
                                  feedbackText={masteryFeedback?.topicId === caseTopicId ? masteryFeedback.text : null}
                                  label="จบเคสนี้แล้ว ประเมินระดับจำ:"
                                  compact
                                />
                              )}
                              {activeCaseIndex < filteredGuidedCases.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveCaseIndex(i => Math.min(filteredGuidedCases.length - 1, i + 1));
                                    setGuidedStep(1);
                                    setSelectedChoice(null);
                                  }}
                                  className="btn btn-primary btn-sm"
                                  style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                >
                                  ไปเคสถัดไป ({activeCaseIndex + 2}/{filteredGuidedCases.length}) <ChevronRight size={15} />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : null;

                        return (
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

                            {showCaseFirst ? (
                              <>
                                {caseCard}
                                {resolutionCard}
                                {theoryCard}
                              </>
                            ) : (
                              <>
                                {theoryCard}
                                {caseCard}
                                {resolutionCard}
                              </>
                            )}
                          </div>
                        );
                      })() : (
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
                          background: 'var(--surface-subtle)',
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
                    <div className="responsive-2col" style={{ gap: '1.25rem' }}>
                      {/* Column 1: Clinical Pearls */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={18} /> Clinical Board Pearls ({moduleData.pearls?.length || 0})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {moduleData.pearls?.map((p, idx) => (
                            <div key={idx} style={{
                              background: 'rgba(37, 99, 235, 0.07)',
                              border: '1px solid rgba(37, 99, 235, 0.25)',
                              borderLeft: '4px solid var(--primary)',
                              borderRadius: '10px',
                              padding: '0.9rem 1rem',
                              fontSize: '0.86rem',
                              lineHeight: 1.65,
                              color: 'var(--text-sub)'
                            }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '0.25rem' }}>
                                Pearl #{idx + 1} (จาก Q#{p.question_id})
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

                  {/* ──────────────────────────────────────────────────────
                      SUB-TAB 5: INTERACTIVE CLOZE FLASHCARDS (ACTIVE RECALL)
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'flashcards' && (
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginBottom: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: 'var(--surface-subtle)',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text)' }}>
                            🃏 Active Recall Deck: <span style={{ color: 'var(--success)' }}>{masteredCardsCount}</span> / {rawFlashcards.length} จำแม่นแล้ว
                          </span>
                          <div style={{ width: '110px', height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${rawFlashcards.length > 0 ? Math.round((masteredCardsCount / rawFlashcards.length) * 100) : 0}%`,
                              background: 'var(--primary)',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-sub)', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={onlyUnmasteredCards}
                              onChange={(e) => {
                                setOnlyUnmasteredCards(e.target.checked);
                                setCardIndex(0);
                                setCardFlipped(false);
                              }}
                            />
                            เฉพาะการ์ดที่ยังไม่จำ
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--ink-sky)', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={onlyDueCards}
                              onChange={(e) => {
                                setOnlyDueCards(e.target.checked);
                                setCardIndex(0);
                                setCardFlipped(false);
                              }}
                            />
                            ถึงกำหนดทวนวันนี้ ({dueCardsCount})
                          </label>
                          <button
                            type="button"
                            onClick={handleShuffleFlashcards}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem' }}
                          >
                            <Shuffle size={13} /> สุ่มลำดับ
                          </button>
                        </div>
                      </div>

                      {activeFlashcards.length > 0 && currentFlashcard ? (() => {
                        const safeIdx = Math.min(cardIndex, activeFlashcards.length - 1);
                        const card = activeFlashcards[safeIdx] || currentFlashcard;
                        const isMastered = cardMastery[card.id] === 'mastered';
                        const sm2Info = cardSm2Map[card.id];
                        const advanceCard = () => {
                          setCardFlipped(false);
                          setCardIndex(i => (activeFlashcards.length > 0 ? (i + 1) % activeFlashcards.length : 0));
                        };
                        return (
                          <div style={{
                            background: 'var(--surface-elevated)',
                            border: isMastered ? '1.5px solid rgba(16, 185, 129, 0.45)' : '1.5px solid rgba(37, 99, 235, 0.35)',
                            borderRadius: '16px',
                            padding: '1.6rem',
                            maxWidth: '760px',
                            margin: '0 auto',
                            boxShadow: 'var(--shadow-card)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.55rem', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.16)', color: 'var(--primary-light)' }}>
                                  การ์ดที่ {safeIdx + 1} / {activeFlashcards.length}
                                </span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: '10px', background: card.mode === 'cloze' ? 'rgba(245,158,11,0.16)' : 'rgba(6,182,212,0.16)', color: card.mode === 'cloze' ? 'var(--ink-amber)' : '#22d3ee' }}>
                                  {card.mode === 'cloze' ? '🧠 ปิดคำสำคัญ (Cloze Recall)' : '📝 ทบทวนหลักการ'}
                                </span>
                                {card.cognitive_level && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.18rem 0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-sub)' }}>
                                    {card.cognitive_level}
                                  </span>
                                )}
                                {sm2Info ? (
                                  <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '0.18rem 0.55rem',
                                    borderRadius: '10px',
                                    background: sm2Info.is_due ? 'rgba(245,158,11,0.18)' : 'rgba(16,185,129,0.16)',
                                    color: sm2Info.is_due ? 'var(--ink-amber)' : 'var(--ink-emerald)',
                                  }}>
                                    {sm2Info.is_due ? '⏰ ถึงกำหนดทวน' : `📅 ทวนอีก ${sm2Info.days_until_due} วัน`}
                                  </span>
                                ) : isMastered && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ink-emerald)' }}>✅ จำแม่นแล้ว</span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenCaseInTeacher(card.question_id)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.74rem' }}
                              >
                                🧑‍🏫 เปิดเคส Q#{card.question_id}
                              </button>
                            </div>

                            {/* Front side */}
                            <div style={{
                              padding: '1.35rem',
                              borderRadius: '12px',
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              marginBottom: '1rem'
                            }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                                คำถามทบทวนความจำ (นึกคำตอบในใจก่อนพลิกดู)
                              </div>
                              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.75 }}>
                                {card.front}
                              </div>
                            </div>

                            {!cardFlipped ? (
                              <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                <button
                                  type="button"
                                  onClick={() => setCardFlipped(true)}
                                  className="btn btn-primary"
                                  style={{ fontWeight: 800, padding: '0.7rem 1.8rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                >
                                  <Eye size={17} /> พลิกดูคำตอบและคำสำคัญ
                                </button>
                              </div>
                            ) : (
                              <div style={{
                                padding: '1.25rem',
                                borderRadius: '12px',
                                background: 'rgba(16, 185, 129, 0.08)',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                marginBottom: '1rem'
                              }}>
                                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--ink-emerald)', marginBottom: '0.45rem' }}>
                                  💡 คำตอบ & หลักการฉบับเต็ม:
                                </div>
                                <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.7, marginBottom: '0.65rem' }}>
                                  {card.back}
                                </div>
                                {card.hidden_terms?.length > 0 && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.55rem' }}>
                                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>คำสำคัญที่ปิดไว้:</span>
                                    {card.hidden_terms.map((t, idx) => (
                                      <span key={idx} style={{
                                        fontSize: '0.78rem',
                                        fontWeight: 800,
                                        padding: '0.15rem 0.55rem',
                                        borderRadius: '6px',
                                        background: 'rgba(245,158,11,0.18)',
                                        color: 'var(--ink-amber)'
                                      }}>
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {card.correct_choice_text && (
                                  <div style={{ fontSize: '0.82rem', color: '#a7f3d0', marginBottom: '0.4rem' }}>
                                    🎯 คำตอบจากโจทย์: <strong>{card.correct_choice_text}</strong>
                                  </div>
                                )}
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                  📚 {card.reference}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                  {[
                                    { rating: 1, label: 'ลืม (1 วัน)', border: 'rgba(239,68,68,0.45)', bg: 'rgba(239,68,68,0.14)', color: 'var(--ink-rose)' },
                                    { rating: 2, label: 'ยาก', border: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.14)', color: 'var(--ink-amber)' },
                                    { rating: 3, label: 'พอได้', border: 'rgba(56,189,248,0.45)', bg: 'rgba(56,189,248,0.14)', color: 'var(--ink-sky)' },
                                    { rating: 4, label: 'แม่นเป๊ะ', border: 'rgba(16,185,129,0.55)', bg: 'var(--primary)', color: '#fff' },
                                  ].map((opt) => (
                                    <button
                                      key={opt.rating}
                                      type="button"
                                      onClick={() => {
                                        gradeFlashcardSm2(card.id, opt.rating);
                                        advanceCard();
                                      }}
                                      className="btn btn-sm"
                                      style={{
                                        fontWeight: 700,
                                        border: `1px solid ${opt.border}`,
                                        background: opt.bg,
                                        color: opt.color,
                                        padding: '0.45rem 0.85rem',
                                        borderRadius: '10px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setCardFlipped(false);
                                  setCardIndex(i => (i - 1 + activeFlashcards.length) % activeFlashcards.length);
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <ChevronLeft size={15} /> ก่อนหน้า
                              </button>
                              <button
                                type="button"
                                onClick={advanceCard}
                                className="btn btn-secondary btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                ถัดไป <ChevronRight size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })() : (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {onlyUnmasteredCards && rawFlashcards.length > 0
                            ? '🎉 ยินดีด้วย! คุณจำ Flashcards ในหัวข้อนี้ครบทุกใบแล้ว'
                            : 'ยังไม่มีข้อมูล Flashcards สำหรับหัวข้อนี้'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────
                      SUB-TAB 6: 1-PAGE HIGH-YIELD CHEAT SHEET
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'cheat_sheet' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(37, 99, 235, 0.06))',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        fontSize: '0.88rem',
                        lineHeight: 1.65,
                        color: 'var(--text-sub)'
                      }}>
                        <strong style={{ color: 'var(--ink-amber)' }}>⚡ สรุปใบเดียวจบก่อนเข้าห้องสอบ (1-Page Rapid Review Sheet): </strong>
                        สกัดเฉพาะตัวเลข Cut-off, ระยะเวลา, ขนาดยา, มาตรากฎหมาย และคีย์เวิร์ดในโจทย์ที่จับคู่ตรงตัวกับคำตอบจากข้อสอบจริงในหัวข้อนี้
                      </div>

                      {/* Section 1: Must-Know Numbers & Legal Articles */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-amber)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Zap size={18} /> ตัวเลข เกณฑ์อายุ มาตรา และ Cut-off ต้องจำ ({moduleData.high_yield_sheet?.must_know_numbers?.length || 0})
                        </h3>
                        {moduleData.high_yield_sheet?.must_know_numbers?.length > 0 ? (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
                            {moduleData.high_yield_sheet.must_know_numbers.map((item, idx) => (
                              <div
                                key={`${item.question_id}-${idx}`}
                                onClick={() => handleOpenCaseInTeacher(item.question_id)}
                                style={{
                                  background: 'rgba(245, 158, 11, 0.06)',
                                  border: '1px solid rgba(245, 158, 11, 0.25)',
                                  borderRadius: '12px',
                                  padding: '0.95rem 1rem',
                                  cursor: 'pointer',
                                  transition: 'transform 0.15s ease'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', gap: '6px' }}>
                                  <span style={{
                                    fontSize: '0.92rem',
                                    fontWeight: 900,
                                    padding: '0.18rem 0.6rem',
                                    borderRadius: '8px',
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    color: 'var(--ink-amber)'
                                  }}>
                                    {item.highlight_value}
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                                    Q#{item.question_id} ↗
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.55, marginBottom: '0.4rem' }}>
                                  {item.context}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  📚 {item.reference}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--surface-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            หัวข้อนี้เน้นหลักการเชิงวินิจฉัยมากกว่าตัวเลขตายตัว ดูตารางจับคู่คีย์เวิร์ดด้านล่างได้เลย
                          </div>
                        )}
                      </div>

                      {/* Section 2: Exam Trigger -> Answer Quick Map */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-emerald)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Target size={18} /> ตารางจับคู่คีย์เวิร์ดในโจทย์ ➔ คำตอบเป้าหมาย ({moduleData.high_yield_sheet?.triggers_map?.length || 0})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {moduleData.high_yield_sheet?.triggers_map?.map((tm, idx) => (
                            <div
                              key={`${tm.question_id}-${idx}`}
                              className="clinical-trigger-row"
                            >
                              <div>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.2rem' }}>
                                  📌 ถ้าโจทย์ให้ข้อมูล / อาการ:
                                </div>
                                <div style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.5 }}>
                                  {tm.trigger_clue}
                                </div>
                              </div>

                              <div className="clinical-trigger-arrow" style={{ color: 'var(--ink-emerald)', fontWeight: 900, fontSize: '1.1rem', textAlign: 'center' }}>
                                ➔
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '0.2rem' }}>
                                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--ink-emerald)' }}>
                                    🎯 {tm.target_answer}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCaseInTeacher(tm.question_id)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                                  >
                                    เคส Q#{tm.question_id}
                                  </button>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                                  {tm.rule_summary}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (authRequiredModule || !token) ? (
                <div style={{ maxWidth: '960px', width: '100%', minWidth: 0, boxSizing: 'border-box', margin: '0 auto' }}>
                  {hubMode === 'exam_topics' && renderFocusedQuestionLessonCard(false)}
                  {hubMode === 'exam_topics' && renderSpecialtyChapterBar()}

                  {hubMode === 'exam_topics' && matchingMasterclass && (
                    <div id="topic-overview-anchor" style={{
                      marginBottom: '1.5rem',
                      padding: '1.35rem 1.5rem',
                      borderRadius: '14px',
                      background: 'var(--surface-card)',
                      border: `1px solid ${matchingMasterclass.badgeColor || '#2563eb'}35`,
                      borderTop: `4px solid ${matchingMasterclass.badgeColor || '#2563eb'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <span style={{
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          background: `${matchingMasterclass.badgeColor || '#2563eb'}22`,
                          color: matchingMasterclass.badgeColor || '#2563eb',
                        }}>
                          {matchingMasterclass.specialty}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--ink-emerald)', fontWeight: 700 }}>
                          📖 เลกเชอร์สรุปทฤษฎีประจำบทเรียน (อ่านได้ทันทีตามลำดับสาขา)
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 0.75rem 0', lineHeight: 1.35 }}>
                        {matchingMasterclass.title}
                      </h2>

                      <div style={{
                        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(2, 132, 199, 0.04))',
                        borderLeft: `4px solid ${matchingMasterclass.badgeColor || 'var(--primary)'}`,
                        borderRadius: '8px',
                        padding: '0.9rem 1.1rem',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        lineHeight: 1.65,
                        marginBottom: '1.1rem'
                      }}>
                        <strong>Clinical Overview:</strong> {matchingMasterclass.overview}
                      </div>

                      {matchingMasterclass.core_mechanism && (
                        <div style={{ marginBottom: '1.15rem' }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.45rem' }}>
                            1. กลไกพยาธิสรีรวิทยาและหลักการคิดเชิงลึก (Core Mechanism)
                          </div>
                          <div style={{
                            color: 'var(--text-sub)',
                            fontSize: '0.88rem',
                            lineHeight: 1.75,
                            whiteSpace: 'pre-wrap',
                            background: 'var(--surface-subtle)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            padding: '1rem 1.15rem'
                          }}>
                            {matchingMasterclass.core_mechanism}
                          </div>
                        </div>
                      )}

                      {matchingMasterclass.matrix_headers && matchingMasterclass.matrix_rows && (
                        <div style={{ marginBottom: '1.15rem' }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.45rem' }}>
                            2. ตารางเปรียบเทียบการวินิจฉัยและการรักษา (Clinical Decision Matrix)
                          </div>
                          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '10px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                                  {matchingMasterclass.matrix_headers.map((h, i) => (
                                    <th key={i} style={{ padding: '0.65rem 0.85rem', color: 'var(--text)', fontWeight: 700 }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {matchingMasterclass.matrix_rows.map((row, rIdx) => (
                                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--border)' }}>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} style={{ padding: '0.65rem 0.85rem', color: cIdx === 0 ? 'var(--text)' : 'var(--text-sub)', fontWeight: cIdx === 0 ? 700 : 400 }}>
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

                      {(matchingMasterclass.high_yield_pearl || matchingMasterclass.pearl) && (
                        <div style={{
                          padding: '0.85rem 1.1rem',
                          borderRadius: '10px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.28)',
                          fontSize: '0.86rem',
                          color: 'var(--text)',
                          lineHeight: 1.6
                        }}>
                          <strong style={{ color: 'var(--ink-emerald)' }}>💎 High-Yield Exam Pearl:</strong> {matchingMasterclass.high_yield_pearl || matchingMasterclass.pearl}
                        </div>
                      )}
                      {matchingMasterclass.reference && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '0.25rem' }}>
                          📚 <strong style={{ color: 'var(--text)' }}>แหล่งอ้างอิง:</strong> {matchingMasterclass.reference}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{
                    textAlign: 'center',
                    padding: '2.25rem 1.5rem',
                    maxWidth: '620px',
                    margin: '0 auto',
                    borderRadius: '14px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontSize: '1.9rem', marginBottom: '0.5rem' }}>🔐</div>
                    <div style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
                      เข้าสู่ระบบเพื่อปลดล็อกเคสฝึกวิเคราะห์จากข้อสอบจริงและ Flashcards ในบทเรียนนี้
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '1rem' }}>
                      เข้าสู่ระบบเพื่อดูโจทย์จำลองคลินิก เฉลยละเอียดรายตัวเลือก (Choice Discrimination) และตารางสรุปตัวเลขสำคัญของบทเรียนนี้ครบทุกข้อ
                    </div>
                    {onOpenAuthModal && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="btn btn-primary"
                        style={{ fontWeight: 700, padding: '0.6rem 1.35rem', borderRadius: '10px' }}
                      >
                        เข้าสู่ระบบ / สมัครสมาชิก
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                  เลือกหัวข้อหรือตำราอ้างอิงจากแถบด้านซ้ายเพื่อเริ่มเรียนรู้
                </div>
              )
            )}

            {/* ══════════════════════════════════════════════════════════════
                MODE 3: CURATED MASTERCLASS GUIDES & DECISION MATRICES
            ══════════════════════════════════════════════════════════════ */}
            {hubMode === 'masterclass' && matchingMasterclass && (
              <div style={{ maxWidth: '920px', width: '100%', minWidth: 0, boxSizing: 'border-box', margin: '0 auto' }}>
                {renderSpecialtyChapterBar()}
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
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.07), rgba(2, 132, 199, 0.04))',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ color: 'var(--primary-light)', fontSize: '1.1rem', margin: 0 }}>
                      1. กลไกพยาธิสรีรวิทยาและหลักการคิดเชิงลึก (Core Mechanism)
                    </h3>
                    {masterclassPathway && (
                      <button
                        type="button"
                        onClick={() => setMasterclassAsPathway(prev => !prev)}
                        style={{
                          padding: '0.32rem 0.78rem',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          border: masterclassAsPathway ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255,255,255,0.16)',
                          background: masterclassAsPathway ? 'rgba(14, 165, 233, 0.2)' : 'var(--surface-card)',
                          color: masterclassAsPathway ? 'var(--ink-sky)' : 'var(--text-sub)'
                        }}
                      >
                        <GitBranch size={14} />
                        {masterclassAsPathway ? '🔀 ดูเป็นแผนผัง Pathway' : '📄 อ่านแบบข้อความ'}
                      </button>
                    )}
                  </div>
                  {masterclassAsPathway && masterclassPathway ? (
                    <ClinicalPathwayDiagram pathway={masterclassPathway} compact={false} />
                  ) : (
                    <div style={{
                      color: 'var(--text-sub)',
                      fontSize: '0.95rem',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      background: 'var(--surface-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '1.4rem'
                    }}>
                      {matchingMasterclass.core_mechanism}
                    </div>
                  )}
                </div>

                {matchingMasterclass.matrix_headers && matchingMasterclass.matrix_rows && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                      2. ตารางเปรียบเทียบการวินิจฉัยและการรักษา (Clinical Decision Matrix)
                    </h3>
                    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--border)' }}>
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

                {(matchingMasterclass.pearl || matchingMasterclass.high_yield_pearl) && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.09), rgba(2, 132, 199, 0.06))',
                    border: '1px solid rgba(37, 99, 235, 0.28)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: matchingMasterclass.reference ? '1rem' : '1.5rem'
                  }}>
                    <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '0.35rem' }}>
                      ✨ Clinical Board Pearl:
                    </strong>
                    <div style={{ color: 'var(--text)', fontWeight: 600, lineHeight: 1.65 }}>
                      {matchingMasterclass.pearl || matchingMasterclass.high_yield_pearl}
                    </div>
                  </div>
                )}
                {matchingMasterclass.reference && (
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(148, 163, 184, 0.16)',
                    marginBottom: '1.5rem',
                    lineHeight: 1.55
                  }}>
                    📚 <strong style={{ color: 'var(--text)' }}>แหล่งอ้างอิงหลักฐานเชิงประจักษ์:</strong> {matchingMasterclass.reference}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                MODE 4: MISTAKE CLINIC (PERSONALIZED DIAGNOSTIC & DRILLS)
            ══════════════════════════════════════════════════════════════ */}
            {hubMode === 'mistake_clinic' && (
              <div style={{ maxWidth: '940px', margin: '0 auto' }}>
                {!token ? (
                  <div style={{
                    padding: '3rem 2rem',
                    borderRadius: '16px',
                    textAlign: 'center',
                    background: 'rgba(244, 63, 94, 0.06)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                  }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🩺</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
                      คลินิกซ่อมจุดอ่อนส่วนบุคคล (Personal Mistake Clinic)
                    </h3>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 1.25rem auto', lineHeight: 1.7 }}>
                      เข้าสู่ระบบเพื่อดูวิเคราะห์ข้อที่ตอบผิด เทียบตัวเลือกที่เลือกผิดกับเฉลยทีละข้อ จัดอันดับหัวข้อ Must-Know ที่แม่นน้อยที่สุด และดึงโจทย์คู่ขนานหัวข้อเดียวกันมาซ่อมจุดอ่อนทันที
                    </p>
                    <button
                      type="button"
                      onClick={() => setHubMode('exam_topics')}
                      className="btn btn-primary"
                      style={{ fontWeight: 700 }}
                    >
                      🎓 กลับไปเรียนตาม 83 หัวข้อข้อสอบ
                    </button>
                  </div>
                ) : loadingClinic ? (
                  <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-sub)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🩺</div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>กำลังวิเคราะห์ประวัติการทำข้อสอบและจุดอ่อนของคุณ...</div>
                  </div>
                ) : !mistakeClinicData?.has_history || (mistakeClinicData?.wrong_cases?.length === 0 && mistakeClinicData?.due_review_count === 0) ? (
                  <div style={{
                    padding: '3rem 2rem',
                    borderRadius: '16px',
                    textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>✨</div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
                      ยังไม่มีประวัติข้อผิดพลาดค้างในคลินิก
                    </h3>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.25rem auto', lineHeight: 1.7 }}>
                      {mistakeClinicData?.total_answered > 0
                        ? `คุณทำไปแล้ว ${mistakeClinicData.total_answered} ข้อ และยังไม่พบข้อผิดพลาดหรือข้อค้างทบทวน SM-2 เยี่ยมมาก!`
                        : 'ลองทำข้อสอบ Mock Test หรือ Practice Mode จากหน้าหลักก่อน แล้วระบบจะดึงข้อที่พลาดและหัวข้ออ่อนที่สุดมาวางแผนซ่อมจุดอ่อนให้ที่นี่อัตโนมัติ'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setHubMode('exam_topics')}
                      className="btn btn-primary"
                      style={{ fontWeight: 700 }}
                    >
                      🎓 เปิดบทเรียนจาก Textbook & ข้อสอบ
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* KPI Summary & Instant Action Banner */}
                    <div style={{
                      padding: '1.35rem 1.5rem',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.08), rgba(37, 99, 235, 0.06))',
                      border: '1px solid rgba(244, 63, 94, 0.3)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                          <h2 style={{ fontSize: '1.28rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 0.25rem 0' }}>
                            🩺 คลินิกซ่อมจุดอ่อนเฉพาะตัวคุณ (Personal Mistake Clinic)
                          </h2>
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)' }}>
                            วิเคราะห์จากข้อสอบที่เคยทำ {mistakeClinicData.total_answered} ข้อ • พบข้อผิดสะสม {mistakeClinicData.total_wrong_unique} ข้อ • ถึงรอบทบทวน SM-2 วันนี้ {mistakeClinicData.due_review_count} ข้อ
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {mistakeClinicData.parallel_drill_questions?.length > 0 && onStartExam && (
                            <button
                              type="button"
                              onClick={() => handleDrillQuestions(mistakeClinicData.parallel_drill_questions)}
                              className="btn btn-primary btn-sm"
                              style={{
                                fontWeight: 800,
                                background: '#e11d48',
                                border: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <Target size={15} /> ฝึกโจทย์คู่ขนานซ่อมจุดอ่อน ({mistakeClinicData.parallel_drill_questions.length} ข้อ)
                            </button>
                          )}
                          {mistakeClinicData.due_review_count > 0 && onStartExam && (
                            <button
                              type="button"
                              onClick={handleStartDueReview}
                              className="btn btn-secondary btn-sm"
                              style={{ fontWeight: 700, borderColor: 'rgba(245,158,11,0.45)', color: 'var(--ink-amber)' }}
                            >
                              ⏰ ทบทวนถึงรอบ SM-2 ({mistakeClinicData.due_review_count} ข้อ)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Weakest Topics Ranking Grid */}
                      {mistakeClinicData.weak_topics?.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '0.75rem' }}>
                          {mistakeClinicData.weak_topics.slice(0, 6).map(wt => (
                            <div key={wt.topic_id} style={{
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              borderRadius: '10px',
                              padding: '0.8rem 0.9rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '6px' }}>
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: SPECIALTY_COLOR_MAP[wt.category] || 'var(--ink-rose)' }}>
                                  {wt.category}
                                </span>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: wt.accuracy_pct < 50 ? 'var(--ink-rose)' : 'var(--ink-amber)' }}>
                                  ถูก {wt.accuracy_pct}% ({wt.wrong_count}/{wt.total_attempts} พลาด)
                                </span>
                              </div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                                {wt.title_th}
                              </div>
                              <div style={{ width: '100%', height: '5px', background: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.55rem' }}>
                                <div style={{
                                  height: '100%',
                                  width: `${wt.accuracy_pct}%`,
                                  background: wt.accuracy_pct < 50 ? '#f43f5e' : '#f59e0b'
                                }} />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTopicId(wt.topic_id);
                                  setHubMode('exam_topics');
                                  setClassroomTab('cheat_sheet');
                                }}
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: 'var(--primary-light)',
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer'
                                }}
                              >
                                📖 เปิดบทเรียน & Cheat Sheet หัวข้อนี้ ➔
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Head-to-Head Missed Cases Breakdown */}
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem' }}>
                        🔍 วิเคราะห์ข้อที่เคยตอบพลาดทีละข้อ ({filteredClinicCases.length} ข้อ)
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredClinicCases.map(wc => (
                          <div key={wc.question_id} style={{
                            background: 'var(--surface-subtle)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '1.2rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.55rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <span className="badge" style={{ fontSize: '0.72rem', fontWeight: 800 }}>Q#{wc.question_id}</span>
                                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: SPECIALTY_COLOR_MAP[wc.category] || 'var(--primary-light)' }}>
                                  {wc.topic_title_th}
                                </span>
                                {wc.cognitive_level && (
                                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-sub)' }}>
                                    ระดับ {wc.cognitive_level}
                                  </span>
                                )}
                              </div>
                              {wc.topic_id && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTopicId(wc.topic_id);
                                    setHubMode('exam_topics');
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.72rem' }}
                                >
                                  🎓 เรียนหัวข้อนี้
                                </button>
                              )}
                            </div>

                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                              {wc.question_preview}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div style={{
                                padding: '0.75rem 0.9rem',
                                borderRadius: '8px',
                                background: 'rgba(244, 63, 94, 0.09)',
                                border: '1px solid rgba(244, 63, 94, 0.3)',
                                fontSize: '0.83rem',
                                lineHeight: 1.55
                              }}>
                                <strong style={{ color: 'var(--ink-rose)', display: 'block', marginBottom: '0.2rem' }}>
                                  คุณตอบ [{wc.selected_choice}] — เหตุผลที่พลาด:
                                </strong>
                                <span style={{ color: 'var(--text-sub)' }}>{wc.selected_choice_reason || 'ดูเหตุผลเต็มในโหมดทบทวนข้อสอบ'}</span>
                              </div>
                              <div style={{
                                padding: '0.75rem 0.9rem',
                                borderRadius: '8px',
                                background: 'rgba(16, 185, 129, 0.09)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                fontSize: '0.83rem',
                                lineHeight: 1.55
                              }}>
                                <strong style={{ color: 'var(--ink-emerald)', display: 'block', marginBottom: '0.2rem' }}>
                                  เฉลย [{wc.correct_answer}] — เหตุผลที่ถูก:
                                </strong>
                                <span style={{ color: 'var(--text-sub)' }}>{wc.correct_choice_reason || wc.key_takeaway}</span>
                              </div>
                            </div>

                            {wc.common_pitfall && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginBottom: '0.3rem', lineHeight: 1.5 }}>
                                ⚠️ กับดักที่ต้องระวัง: <span style={{ color: 'var(--text-sub)' }}>{wc.common_pitfall}</span>
                              </div>
                            )}
                            {wc.reference && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                📚 {wc.reference}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
        </>
        )}
        </div>

      </div>
    </div>
  );

  return isModal && typeof document !== 'undefined'
    ? createPortal(hubContent, document.body)
    : hubContent;
}
