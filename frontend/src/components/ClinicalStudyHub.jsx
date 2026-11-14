import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  BookOpen, Search, Sparkles, AlertTriangle, ArrowLeft, 
  CheckCircle2, XCircle, Compass, Award, Bookmark, 
  Layers, ChevronRight, ChevronLeft, Play, BookMarked, Share2, 
  Lightbulb, X, GraduationCap, Brain, FileText, Eye, Check, Filter,
  RotateCcw, Zap, Stethoscope, Shuffle, Target, GitBranch, Bot
} from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';
import ClinicalPathwayDiagram from './ClinicalPathwayDiagram';
import VisualAtlas from './VisualAtlas';
import CalcSimulator from './CalcSimulator';
import ClozePitfallArena from './ClozePitfallArena';
import TutorChat from './TutorChat';
import {
  buildDynamicPathwayFromText,
  buildPathwayFromThaiProtocol,
} from '../utils/pathwayBuilder';
import { 
  SPECIALTY_CATEGORIES, 
  CLINICAL_STUDY_GUIDES 
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

const MASTERY_META = {
  red: { emoji: '🔴', label: 'ยังสับสน', bg: 'rgba(239, 68, 68, 0.16)', color: '#f87171', border: 'rgba(239, 68, 68, 0.4)' },
  yellow: { emoji: '🟡', label: 'พอจำได้', bg: 'rgba(245, 158, 11, 0.16)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
  green: { emoji: '🟢', label: 'พร้อมสอบ!', bg: 'rgba(16, 185, 129, 0.16)', color: '#34d399', border: 'rgba(16, 185, 129, 0.4)' },
};

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
  initialTopicId = null,
  initialClassroomTab = null,
  initialHubMode = null,
  isModal = false,
  onClose = null 
}) {
  const auth = useAuth() || {};
  const { token, authFetch } = auth;

  // Primary Mode: 'exam_topics' (83 DB Topics), 'textbooks' (14 Gold Standard Textbooks), 'masterclass' (25 Curated Guides), 'mistake_clinic'
  const [hubMode, setHubMode] = useState(initialHubMode || 'exam_topics');
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
  const [showTopicTutor, setShowTopicTutor] = useState(false);

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

  // Flashcards Active Recall Deck State (DB-synced SM-2 + localStorage fallback)
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [flashcardOrder, setFlashcardOrder] = useState(null);
  const [onlyUnmasteredCards, setOnlyUnmasteredCards] = useState(false);
  const [onlyDueCards, setOnlyDueCards] = useState(false);
  const [cardSm2Map, setCardSm2Map] = useState({});
  const [cardMastery, setCardMastery] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nl_flashcard_mastery_v1') || '{}');
    } catch {
      return {};
    }
  });

  // Topic Mastery Tracker State (DB-synced + localStorage fallback)
  const [topicMastery, setTopicMastery] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nl_topic_mastery_v1') || '{}');
    } catch {
      return {};
    }
  });

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
          Object.entries(localFlash).forEach(([k, v]) => {
            if (v) items.push({ card_key: k, card_type: 'flashcard', mastery_status: String(v) });
          });
          const localTopics = JSON.parse(localStorage.getItem('nl_topic_mastery_v1') || '{}');
          Object.entries(localTopics).forEach(([k, v]) => {
            if (v) items.push({ card_key: k, card_type: 'topic', mastery_status: String(v) });
          });
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
    setTopicMastery(prev => {
      const next = { ...prev };
      const finalLevel = next[topicId] === level ? 'yellow' : level;
      if (next[topicId] === level) {
        delete next[topicId];
      } else {
        next[topicId] = level;
      }
      try {
        localStorage.setItem('nl_topic_mastery_v1', JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      if (token && authFetch && next[topicId]) {
        authFetch(`${API_BASE}/api/tracking/cards/review`, {
          method: 'POST',
          body: JSON.stringify({
            card_key: topicId,
            card_type: 'topic',
            mastery_status: finalLevel,
          }),
        }).catch(() => {});
      }
      return next;
    });
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
      .then(res => res.json())
      .then(data => {
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
        setCardIndex(0);
        setCardFlipped(false);
        setFlashcardOrder(null);
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
              <span>📚</span> ตำราสากล & เกณฑ์สมาคมทันตแพทย์ไทย ({overviewData?.summary?.total_textbooks || 14} ชุด)
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
              <span>🏆</span> ตารางสรุป Masterclass ({Object.keys(allStudyGuides).length} Guides)
            </button>

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
                background: hubMode === 'visual_atlas' ? '#0284c7' : 'rgba(56,189,248,0.08)',
                color: hubMode === 'visual_atlas' ? '#fff' : '#7dd3fc',
                border: hubMode === 'visual_atlas' ? '1px solid #0284c7' : '1px solid rgba(56,189,248,0.28)',
              }}
            >
              <span>🖼️</span> คลังภาพวินิจฉัย (112 ภาพ)
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
                background: hubMode === 'calc_lab' ? '#059669' : 'rgba(16,185,129,0.08)',
                color: hubMode === 'calc_lab' ? '#fff' : '#6ee7b7',
                border: hubMode === 'calc_lab' ? '1px solid #059669' : '1px solid rgba(16,185,129,0.28)',
              }}
            >
              <span>🧮</span> ห้องฝึกคำนวณคลินิก
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
                background: hubMode === 'cloze_arena' ? '#7c3aed' : 'rgba(139,92,246,0.08)',
                color: hubMode === 'cloze_arena' ? '#fff' : '#c4b5fd',
                border: hubMode === 'cloze_arena' ? '1px solid #7c3aed' : '1px solid rgba(139,92,246,0.28)',
              }}
            >
              <span>⚡</span> Cloze & กับดักข้อสอบ
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
                background: hubMode === 'mistake_clinic' ? '#f43f5e' : 'rgba(244,63,94,0.08)',
                color: hubMode === 'mistake_clinic' ? '#fff' : '#fda4af',
                border: hubMode === 'mistake_clinic' ? '1px solid #f43f5e' : '1px solid rgba(244,63,94,0.28)',
              }}
            >
              <Stethoscope size={15} /> คลินิกซ่อมจุดอ่อน
              {mistakeClinicData?.total_wrong_unique > 0 && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.05rem 0.45rem',
                  borderRadius: '10px',
                  background: hubMode === 'mistake_clinic' ? 'rgba(255,255,255,0.25)' : 'rgba(244,63,94,0.25)',
                  color: '#fff',
                }}>
                  {mistakeClinicData.total_wrong_unique}
                </span>
              )}
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
            3. MAIN SPLIT LAYOUT OR INTERACTIVE FULL-WIDTH LABS
        ══════════════════════════════════════════════════════════════════ */}
        {hubMode === 'visual_atlas' ? (
          <VisualAtlas
            selectedSpecialty={selectedSpecialty}
            searchQuery={searchQuery}
            specialtyColorMap={SPECIALTY_COLOR_MAP}
            onStartExam={onStartExam}
            isModal={isModal}
            onClose={onClose}
            onOpenTopic={(topicId) => {
              setSelectedSpecialty('all');
              setSelectedTopicId(topicId);
              setHubMode('exam_topics');
              setClassroomTab('synthesized');
            }}
          />
        ) : hubMode === 'calc_lab' ? (
          <div style={{ padding: '1.25rem', overflowY: isModal ? 'auto' : 'visible', maxHeight: isModal ? 'calc(94vh - 150px)' : 'none' }}>
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
          <div style={{ padding: '1.25rem', overflowY: isModal ? 'auto' : 'visible', maxHeight: isModal ? 'calc(94vh - 150px)' : 'none' }}>
            <ClozePitfallArena
              selectedSpecialty={selectedSpecialty}
              searchQuery={searchQuery}
              onStartExam={onStartExam}
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
                {Object.keys(topicMastery).length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.35rem 0.55rem',
                    margin: '0 0.15rem 0.25rem 0.15rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.7rem',
                    color: 'var(--text-sub)'
                  }}>
                    <span>🟢 {Object.values(topicMastery).filter(v => v === 'green').length}</span>
                    <span>🟡 {Object.values(topicMastery).filter(v => v === 'yellow').length}</span>
                    <span>🔴 {Object.values(topicMastery).filter(v => v === 'red').length}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>ความคล่องตัว</span>
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
                  filteredTopics.map(topic => {
                    const isSelected = topic.id === selectedTopicId;
                    const badgeColor = SPECIALTY_COLOR_MAP[topic.category] || '#6366f1';
                    const hasMasterclass = Boolean(allStudyGuides[topic.id]);
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
                          {topicMastery[topic.id] && MASTERY_META[topicMastery[topic.id]] && (
                            <span style={{
                              fontSize: '0.65rem',
                              padding: '0.05rem 0.4rem',
                              borderRadius: '4px',
                              background: MASTERY_META[topicMastery[topic.id]].bg,
                              color: MASTERY_META[topicMastery[topic.id]].color,
                              fontWeight: 700,
                              marginLeft: 'auto'
                            }}>
                              {MASTERY_META[topicMastery[topic.id]].emoji} {MASTERY_META[topicMastery[topic.id]].label}
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
                      {tb.thai_association && (
                        <div style={{
                          fontSize: '0.73rem',
                          color: '#34d399',
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
                        background: selectedClinicTopicId === 'all' ? 'rgba(244, 63, 94, 0.14)' : 'rgba(255,255,255,0.02)',
                        border: selectedClinicTopicId === 'all' ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>📋 รวมทุกข้อที่เคยพลาด</span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fda4af' }}>
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
                            background: isSel ? 'rgba(244, 63, 94, 0.14)' : 'rgba(255,255,255,0.02)',
                            border: isSel ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.05)',
                            borderLeft: `4px solid ${badgeColor}`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: badgeColor }}>{wt.category}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fda4af' }}>
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        {hubMode === 'exam_topics' && selectedTopicId && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '0.2rem 0.35rem',
                            borderRadius: '10px',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(255,255,255,0.08)'
                          }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0 4px' }}>ระดับจำ:</span>
                            {Object.entries(MASTERY_META).map(([lvl, meta]) => {
                              const active = topicMastery[selectedTopicId] === lvl;
                              return (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => updateTopicMastery(selectedTopicId, lvl)}
                                  title={meta.label}
                                  style={{
                                    padding: '0.18rem 0.45rem',
                                    borderRadius: '7px',
                                    fontSize: '0.72rem',
                                    fontWeight: active ? 800 : 500,
                                    cursor: 'pointer',
                                    background: active ? meta.bg : 'transparent',
                                    color: active ? meta.color : 'var(--text-sub)',
                                    border: active ? `1px solid ${meta.border}` : '1px solid transparent',
                                  }}
                                >
                                  {meta.emoji} {active ? meta.label : ''}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {hubMode === 'exam_topics' && selectedTopicId && (
                          <button
                            type="button"
                            onClick={() => setShowTopicTutor((v) => !v)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: showTopicTutor ? 'var(--primary)' : 'rgba(124, 58, 237, 0.16)',
                              border: '1px solid rgba(124, 58, 237, 0.45)',
                              color: showTopicTutor ? '#fff' : '#c4b5fd',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.85rem',
                              borderRadius: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <Bot size={14} /> {showTopicTutor ? 'ซ่อน AI Tutor' : '💬 ถามอาจารย์ AI เรื่องนี้'}
                          </button>
                        )}

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
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: moduleData.thai_protocols?.length > 0 ? '0.85rem' : 0
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

                    {/* 🇹🇭 Thai Dental Council, Specialty Associations & MOPH Protocol Shelf */}
                    {moduleData.thai_protocols && moduleData.thai_protocols.length > 0 && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.10), rgba(6, 182, 212, 0.08))',
                        borderRadius: '12px',
                        padding: '1rem 1.15rem',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                      }}>
                        <div style={{
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          color: '#34d399',
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
                              color: '#34d399',
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
                              background: 'rgba(15, 23, 42, 0.55)',
                              borderRadius: '10px',
                              padding: '0.85rem 1rem',
                              border: '1px solid rgba(255,255,255,0.07)'
                            }}>
                              {tp.thai_association && (
                                <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.45rem' }}>
                                  🏛️ องค์กรวิชาชีพอ้างอิงของไทย: <span style={{ color: '#38bdf8' }}>{tp.thai_association}</span>
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
                                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.3rem' }}>
                                    ⚡ โปรโตคอลและเกณฑ์ตัวเลขเฉพาะประเทศไทยที่ใช้ตัดสินในข้อสอบ ศ.ท.ส.:
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {tp.thai_protocol_highlights.map((hl, hlIdx) => (
                                      <div key={hlIdx} style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text)',
                                        lineHeight: 1.6,
                                        background: 'rgba(255,255,255,0.03)',
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

                  {/* Inline Multi-Turn Socratic AI Tutor Drawer for this Must-Know Topic */}
                  {showTopicTutor && hubMode === 'exam_topics' && selectedTopicId && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <TutorChat
                        topicId={selectedTopicId}
                        topicTitle={moduleData.module_info.title_th}
                        pathwayId={allModulePathways[0]?.id || null}
                      />
                    </div>
                  )}

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
                      { id: 'pathways', label: `🔀 แผนผัง Pathway & Protocol (${allModulePathways.length})`, desc: 'แผนผัง Flowchart กลไกการเกิดโรค ขั้นตอนรักษา และโปรโตคอลไทย' },
                      { id: 'guided_teacher', label: `🧑‍🏫 สอนทีละก้าวจากเคส (${moduleData.guided_cases?.length || 0})`, desc: 'ทำโจทย์หรือเรียนทฤษฎี → จับคีย์เวิร์ด → เฉลยรายตัวเลือก' },
                      { id: 'flashcards', label: `🃏 Flashcards จำแม่น (${moduleData.flashcards?.length || 0})`, desc: 'ปิดคำสำคัญฝึกดึงความจำ Active Recall' },
                      { id: 'cheat_sheet', label: `⚡ สรุปใบเดียวจบ (${(moduleData.high_yield_sheet?.must_know_numbers?.length || 0) + (moduleData.high_yield_sheet?.triggers_map?.length || 0)})`, desc: 'รวมตัวเลข Cut-off, มาตรากฎหมาย และตารางคีย์เวิร์ด ➔ คำตอบ' },
                      { id: 'differential', label: `⚖️ แยกแยะตัวเลือก (${moduleData.differential_comparisons?.length || 0})`, desc: 'ศึกษากลไกการแยกโรคจากตัวเลือก ก-จ' },
                      { id: 'pearls_traps', label: `⚠️ Pearls & กับดัก (${(moduleData.pearls?.length || 0) + (moduleData.pitfalls?.length || 0)})`, desc: 'สรุปจุดเน้นและหลุมพรางที่ออกสอบบ่อย' },
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

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                      <button
                                        type="button"
                                        onClick={() => setLessonPathwayIds(prev => ({ ...prev, [lesson.question_id]: !prev[lesson.question_id] }))}
                                        style={{
                                          background: lessonPathwayIds[lesson.question_id] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.14)',
                                          border: lessonPathwayIds[lesson.question_id] ? '1px solid #10b981' : '1px solid rgba(6, 182, 212, 0.35)',
                                          color: lessonPathwayIds[lesson.question_id] ? '#34d399' : '#22d3ee',
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
                      SUB-TAB: CLINICAL PATHWAYS, PATHOGENESIS & PROTOCOLS
                  ────────────────────────────────────────────────────── */}
                  {classroomTab === 'pathways' && (
                    <div>
                      <div style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.09), rgba(168, 85, 247, 0.07))',
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
                          { id: 'all', label: `🌟 ทั้งหมด (${allModulePathways.length})` },
                          { id: 'decision', label: '🔀 แผนผังตัดสินใจ' },
                          { id: 'protocol', label: '📋 Clinical & Thai Protocols' },
                          { id: 'pathogenesis', label: '🧬 กลไกการเกิดโรค / กระบวนการ' },
                          { id: 'procedure', label: '🛠️ ขั้นตอนหัตถการ' },
                          { id: 'legal', label: '⚖️ ขั้นตอนทางกฎหมาย' },
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
                                background: active ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <div style={{
                            display: 'inline-flex',
                            padding: '0.2rem',
                            borderRadius: '10px',
                            background: 'rgba(15, 23, 42, 0.55)',
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
                                      border: guidedTheoryAsPathway ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255,255,255,0.16)',
                                      background: guidedTheoryAsPathway ? 'rgba(14, 165, 233, 0.2)' : 'rgba(15, 23, 42, 0.55)',
                                      color: guidedTheoryAsPathway ? '#38bdf8' : 'var(--text-sub)'
                                    }}
                                  >
                                    <GitBranch size={13} />
                                    {guidedTheoryAsPathway ? '🔀 แผนผัง Pathway' : '📄 ข้อความ'}
                                  </button>
                                )}
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
                            </div>

                            {guidedTheoryAsPathway && currentGuidedTheoryPathway ? (
                              <ClinicalPathwayDiagram pathway={currentGuidedTheoryPathway} compact={true} />
                            ) : (
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
                            )}

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
                            background: 'rgba(255, 255, 255, 0.02)',
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
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                                  🔍 ไฮไลต์คำใบ้ในโจทย์เปิดอยู่
                                </span>
                              )}
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

                                let bg = 'rgba(255,255,255,0.03)';
                                let border = '1px solid var(--border)';
                                if (isCaseResolved) {
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
                                  <strong style={{ color: '#fb7185', display: 'block', marginBottom: '0.25rem' }}>
                                    ✗ ทำไมตัวเลือก {pickedUpper} ที่คุณเลือกจึงพลาด:
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
                                  <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.25rem' }}>
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
                                color: '#34d399',
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
                                      background: isCorr ? 'rgba(16, 185, 129, 0.10)' : isPick ? 'rgba(244, 63, 94, 0.08)' : 'rgba(15, 23, 42, 0.5)',
                                      border: isCorr ? '1px solid rgba(16, 185, 129, 0.35)' : isPick ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid var(--border)',
                                      borderLeft: isCorr ? '4px solid var(--success)' : isPick ? '4px solid var(--danger)' : '4px solid rgba(255,255,255,0.15)',
                                      fontSize: '0.88rem',
                                      lineHeight: 1.6
                                    }}>
                                      <strong style={{ color: isCorr ? 'var(--success)' : isPick ? '#fb7185' : 'var(--text)' }}>
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
                              borderTop: '1px solid rgba(255,255,255,0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '0.75rem'
                            }}>
                              {caseTopicId && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>
                                    จบเคสนี้แล้ว ประเมินความเข้าใจหัวข้อ:
                                  </span>
                                  {Object.entries(MASTERY_META).map(([lvl, meta]) => {
                                    const active = topicMastery[caseTopicId] === lvl;
                                    return (
                                      <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => updateTopicMastery(caseTopicId, lvl)}
                                        style={{
                                          padding: '0.28rem 0.6rem',
                                          borderRadius: '8px',
                                          fontSize: '0.74rem',
                                          fontWeight: active ? 800 : 600,
                                          cursor: 'pointer',
                                          background: active ? meta.bg : 'rgba(255,255,255,0.04)',
                                          color: active ? meta.color : 'var(--text-sub)',
                                          border: active ? `1px solid ${meta.border}` : '1px solid var(--border)',
                                        }}
                                      >
                                        {meta.emoji} {meta.label}
                                      </button>
                                    );
                                  })}
                                </div>
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
                        background: 'rgba(255,255,255,0.03)',
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
                              background: 'linear-gradient(90deg, #10b981, #34d399)',
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
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#38bdf8', cursor: 'pointer' }}>
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
                            background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.09), rgba(15, 23, 42, 0.72))',
                            border: isMastered ? '1.5px solid rgba(16, 185, 129, 0.45)' : '1.5px solid rgba(99, 102, 241, 0.35)',
                            borderRadius: '16px',
                            padding: '1.6rem',
                            maxWidth: '760px',
                            margin: '0 auto',
                            boxShadow: '0 10px 28px rgba(0,0,0,0.18)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.55rem', borderRadius: '10px', background: 'rgba(99,102,241,0.2)', color: 'var(--primary-light)' }}>
                                  การ์ดที่ {safeIdx + 1} / {activeFlashcards.length}
                                </span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: '10px', background: card.mode === 'cloze' ? 'rgba(245,158,11,0.16)' : 'rgba(6,182,212,0.16)', color: card.mode === 'cloze' ? '#fbbf24' : '#22d3ee' }}>
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
                                    color: sm2Info.is_due ? '#fbbf24' : '#34d399',
                                  }}>
                                    {sm2Info.is_due ? '⏰ ถึงกำหนดทวน' : `📅 ทวนอีก ${sm2Info.days_until_due} วัน`}
                                  </span>
                                ) : isMastered && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399' }}>✅ จำแม่นแล้ว</span>
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
                              background: 'rgba(15, 23, 42, 0.55)',
                              border: '1px solid rgba(255,255,255,0.08)',
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
                                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#34d399', marginBottom: '0.45rem' }}>
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
                                        color: '#fbbf24'
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
                                    { rating: 1, label: '😵 ลืม (1 วัน)', border: 'rgba(239,68,68,0.45)', bg: 'rgba(239,68,68,0.14)', color: '#f87171' },
                                    { rating: 2, label: '😓 ยาก', border: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.14)', color: '#fbbf24' },
                                    { rating: 3, label: '🙂 พอได้', border: 'rgba(56,189,248,0.45)', bg: 'rgba(56,189,248,0.14)', color: '#38bdf8' },
                                    { rating: 4, label: '🚀 แม่นเป๊ะ', border: 'rgba(16,185,129,0.55)', bg: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' },
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
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10), rgba(99, 102, 241, 0.08))',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        fontSize: '0.88rem',
                        lineHeight: 1.65,
                        color: 'var(--text-sub)'
                      }}>
                        <strong style={{ color: '#fbbf24' }}>⚡ สรุปใบเดียวจบก่อนเข้าห้องสอบ (1-Page Rapid Review Sheet): </strong>
                        สกัดเฉพาะตัวเลข Cut-off, ระยะเวลา, ขนาดยา, มาตรากฎหมาย และคีย์เวิร์ดในโจทย์ที่จับคู่ตรงตัวกับคำตอบจากข้อสอบจริงในหัวข้อนี้
                      </div>

                      {/* Section 1: Must-Know Numbers & Legal Articles */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                                    color: '#fbbf24'
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
                          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            หัวข้อนี้เน้นหลักการเชิงวินิจฉัยมากกว่าตัวเลขตายตัว ดูตารางจับคู่คีย์เวิร์ดด้านล่างได้เลย
                          </div>
                        )}
                      </div>

                      {/* Section 2: Exam Trigger -> Answer Quick Map */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Target size={18} /> ตารางจับคู่คีย์เวิร์ดในโจทย์ ➔ คำตอบเป้าหมาย ({moduleData.high_yield_sheet?.triggers_map?.length || 0})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {moduleData.high_yield_sheet?.triggers_map?.map((tm, idx) => (
                            <div
                              key={`${tm.question_id}-${idx}`}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(200px, 1.1fr) auto minmax(220px, 1.3fr)',
                                gap: '0.85rem',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.025)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '0.9rem 1rem',
                              }}
                            >
                              <div>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.2rem' }}>
                                  📌 ถ้าโจทย์ให้ข้อมูล / อาการ:
                                </div>
                                <div style={{ fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.5 }}>
                                  {tm.trigger_clue}
                                </div>
                              </div>

                              <div style={{ color: '#34d399', fontWeight: 900, fontSize: '1.1rem', textAlign: 'center' }}>
                                ➔
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '0.2rem' }}>
                                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#34d399' }}>
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
                          background: masterclassAsPathway ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.04)',
                          color: masterclassAsPathway ? '#38bdf8' : 'var(--text-sub)'
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
                      background: 'rgba(255,255,255,0.02)',
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
                      background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.10), rgba(99, 102, 241, 0.08))',
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
                                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
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
                              style={{ fontWeight: 700, borderColor: 'rgba(245,158,11,0.45)', color: '#fbbf24' }}
                            >
                              ⏰ ทบทวนถึงรอบ SM-2 ({mistakeClinicData.due_review_count} ข้อ)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Weakest Topics Ranking Grid */}
                      {mistakeClinicData.weak_topics?.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                          {mistakeClinicData.weak_topics.slice(0, 6).map(wt => (
                            <div key={wt.topic_id} style={{
                              background: 'rgba(15, 23, 42, 0.55)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '10px',
                              padding: '0.8rem 0.9rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '6px' }}>
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: SPECIALTY_COLOR_MAP[wt.category] || '#fda4af' }}>
                                  {wt.category}
                                </span>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: wt.accuracy_pct < 50 ? '#fb7185' : '#fbbf24' }}>
                                  ถูก {wt.accuracy_pct}% ({wt.wrong_count}/{wt.total_attempts} พลาด)
                                </span>
                              </div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                                {wt.title_th}
                              </div>
                              <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.55rem' }}>
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
                            background: 'rgba(255,255,255,0.02)',
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
                                <strong style={{ color: '#fb7185', display: 'block', marginBottom: '0.2rem' }}>
                                  ✗ คุณตอบ [{wc.selected_choice}] — เหตุผลที่พลาด:
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
                                <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.2rem' }}>
                                  ✓ เฉลย [{wc.correct_answer}] — เหตุผลที่ถูก:
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
        )}

      </div>
    </div>
  );
}
