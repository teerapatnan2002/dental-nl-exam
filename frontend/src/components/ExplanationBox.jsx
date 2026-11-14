import React, { useState, useMemo } from 'react';
import {
  Lightbulb, AlertTriangle, BookOpen, Sparkles,
  CheckCircle2, XCircle, Eye, EyeOff, Bot, Target, Layers, GitBranch
} from 'lucide-react';
import { API_BASE } from '../config';
import { findGuideForQuestion } from '../data/clinicalStudyGuides';
import { buildDynamicPathwayFromText } from '../utils/pathwayBuilder';
import ClinicalPathwayDiagram from './ClinicalPathwayDiagram';
import ClinicalStudyHub from './ClinicalStudyHub';
import TutorChat from './TutorChat';

const topicPathwayCache = new Map();

const EXTRACT_NUMBER_REGEX = /(?:มาตรา\s*\d+(?:\s*\/\s*\d+)?|พ\.ร\.บ\.[^,.\n]{2,30}พ\.ศ\.\s*\d{4}|[<>≤≥≈]?\s*\d+(?:[.,–-]\d+)?(?:\/\d+)?\s*(?:mg\/kg|mg\/dL|mg\/L|mg|g|mL|mmHg|mm|cm|µm|ppm|%|°|องศา|สัปดาห์|วัน|เดือน|ปี|ขวบ|นาที|ชั่วโมง|ชม\.|บาท|ซี่|คู่สบ|เท่า|INR|RDT|Stage\s*[IV]+|Grade\s*[A-C]|Class\s*[IV]+))/gi;

function extractHighYieldTokens(texts) {
  const seen = new Set();
  const tokens = [];
  for (const txt of texts) {
    if (!txt) continue;
    const matches = txt.match(EXTRACT_NUMBER_REGEX) || [];
    for (const m of matches) {
      const clean = m.trim();
      const key = clean.toLowerCase();
      if (clean.length >= 2 && !seen.has(key)) {
        seen.add(key);
        tokens.push(clean);
      }
      if (tokens.length >= 8) return tokens;
    }
  }
  return tokens;
}

function splitReadableSteps(text) {
  if (!text) return [];
  const trimmed = String(text).trim();
  if (trimmed.length < 220 && !trimmed.includes('\n')) return [trimmed];
  // Split by newlines or numbered steps or Thai/English sentence breaks when long
  const byLine = trimmed.split(/\n+/).map(s => s.trim()).filter(Boolean);
  if (byLine.length >= 2) return byLine;
  // Split long single paragraph every ~2-3 sentences or on numbered list tokens (1) (2)
  const numberedSplit = trimmed.split(/(?=(?:\(\d+\)|\b\d\.\s+[ก-ฮA-Z]))/).map(s => s.trim()).filter(Boolean);
  if (numberedSplit.length >= 2) return numberedSplit;
  const sentences = trimmed.split(/(?<=\.)\s+(?=[A-Zก-ฮ0-9])/).map(s => s.trim()).filter(Boolean);
  if (sentences.length <= 2) return [trimmed];
  const chunks = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' '));
  }
  return chunks;
}

function maskKeyTerms(text) {
  if (!text) return '';
  let out = String(text);
  const nums = out.match(EXTRACT_NUMBER_REGEX) || [];
  for (const n of nums.slice(0, 3)) {
    out = out.replace(n.trim(), '【 ____?____ 】');
  }
  if (out === text) {
    // Mask English technical terms >= 5 chars
    const enTerms = out.match(/\b[A-Z][A-Za-z0-9\-\/]{4,}(?:\s+[A-Za-z0-9\-\/]{3,}){0,2}\b/g) || [];
    for (const t of enTerms.slice(0, 2)) {
      out = out.replace(t, '【 ____?____ 】');
    }
  }
  if (out === text) {
    // Fallback mask trailing conclusion clause
    const half = Math.floor(out.length * 0.55);
    return out.slice(0, half) + ' 【 ... คลิก "เฉลยคำสำคัญ" เพื่อดูส่วนที่เหลือ ... 】';
  }
  return out;
}

function normalizeCogBadge(raw) {
  if (!raw) return null;
  const val = String(raw).trim().toUpperCase();
  if (val === 'P' || val.includes('PROBLEM')) {
    return { code: 'P', label: 'P: วิเคราะห์แก้ปัญหา (Problem Solving)', bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
  }
  if (val === 'A' || val.includes('APP')) {
    return { code: 'A', label: 'A: ประยุกต์คลินิก (Application)', bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
  }
  if (val === 'R' || val.includes('RECALL')) {
    return { code: 'R', label: 'R: ความจำความเข้าใจ (Recall)', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
  }
  return { code: raw, label: `ระดับ ${raw}`, bg: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)', border: 'rgba(99, 102, 241, 0.3)' };
}

const THAI_ASSOCIATION_BY_CATEGORY = {
  'วิทยาเอ็นโดดอนต์': {
    org: 'สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย',
    protocol: 'ใช้เกณฑ์การวินิจฉัย AAE Consensus มาตรฐานโรงเรียนทันตแพทย์ไทย 18 สถาบัน, การทำ VPT ด้วย Calcium Silicate Cement (MTA/Biodentine) และงดจ่ายยาปฏิชีวนะใน Pulpitis ตามเกณฑ์ RDU Thailand'
  },
  'ศัลยศาสตร์ช่องปาก': {
    org: 'สมาคมศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียลแห่งประเทศไทยฯ (TAOMS) & ราชวิทยาลัยทันตแพทย์ฯ',
    protocol: 'มาตรฐานหลอดยาชาในไทยใช้ 1.8 mL/หลอด (2% Lidocaine = 36 mg/หลอด, MRD 4.4 mg/kg); ผู้ป่วยรับประทาน Warfarin ถอนฟันได้โดยไม่หยุดยาเมื่อ INR ≤ 3.0–3.5 ร่วมกับ Gelfoam + เย็บแผล + 5% Tranexamic acid mouthwash'
  },
  'ปริทันตวิทยา': {
    org: 'สมาคมปริทันตวิทยาแห่งประเทศไทย (TAP) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย',
    protocol: 'อ้างอิงเกณฑ์จำแนกโรคปริทันต์ AAP/EFP 2017 (Stage I–IV, Grade A–C; Gingivitis BOP ≥ 10%), นัด Re-evaluation หลัง SRP ที่ 4–6 สัปดาห์ และควบคุม O\'Leary Plaque Index ≤ 10–20% ก่อนผ่าตัดปริทันต์'
  },
  'ทันตกรรมบูรณะ/หัตถการ': {
    org: 'สมาคมทันตกรรมหัตถการแห่งประเทศไทย (TODS) & แนวทางอนุสัญญามินามาตะ กรมอนามัย',
    protocol: 'เน้น Selective Caries Removal ในฟันผุลึกเพื่อรักษาความมีชีวิตของพัลพ์ (ปกป้องพัลพ์เมื่อ RDT < 0.5 mm) และหลีกเลี่ยงการใช้อมัลกัมในเด็ก < 15 ปี หญิงตั้งครรภ์ และหญิงให้นมบุตรตามแนวทางกรมอนามัย'
  },
  'ทันตกรรมประดิษฐ์': {
    org: 'สมาคมทันตกรรมประดิษฐ์ไทย (TPA) & โครงการฟันเทียมพระราชทาน กรมอนามัย-สปสช.',
    protocol: 'มาตรฐานการออกแบบ RPD (RPI Stress-releasing system), กฎ Ferrule Effect สูงอย่างน้อย 1.5–2.0 mm และเกณฑ์ใส่ฟันเทียมผู้สูงอายุไทยเมื่อมีฟันแท้ < 20 ซี่ หรือมีคู่สบฟันหลัง < 4 คู่สบ'
  },
  'ทันตกรรมสำหรับเด็ก': {
    org: 'สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย (TSPD) • ทันตแพทยสภา • กรมอนามัย (ฉบับปรับปรุง 2560/2566)',
    protocol: 'ยาสีฟันฟลูออไรด์ในไทยใช้ 1,000 ppm ตั้งแต่ฟันซี่แรกขึ้น (< 3 ปี = แตะพอเปียก/เมล็ดข้าวสาร, 3–<6 ปี = เมล็ดถั่วเขียว, ≥ 6 ปี = ยาวเต็มแปรง); ฟลูออไรด์เสริมชนิดกินจ่ายเฉพาะเด็กเสี่ยงผุสูงอายุ 6 เดือน–16 ปี เมื่อน้ำดื่มมี F < 0.6 ppm เท่านั้น'
  },
  'วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก': {
    org: 'ชมรมเวชศาสตร์ช่องปากฯ • สมาคมพยาธิวิทยาช่องปากฯ • สมาคมรังสีวิทยาช่องปากฯ • RDU Thailand',
    protocol: 'อ้างอิงคู่มือการใช้ยาอย่างสมเหตุผลในงานทันตกรรม (RDU) & บัญชียาหลักแห่งชาติ (NLEM), เกณฑ์ AHA 2021 (แพ้ Penicillin งดใช้ Clindamycin ให้ใช้ Azithromycin 500 mg แทน) และการคัดกรอง OPMDs จากการเคี้ยวหมากในผู้สูงอายุไทย'
  },
  'ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า': {
    org: 'ชมรมทันตกรรมบดเคี้ยวและความเจ็บปวดช่องปากใบหน้าแห่งประเทศไทย & ราชวิทยาลัยทันตแพทย์ฯ',
    protocol: 'อ้างอิงเกณฑ์วินิจฉัย DC/TMD ฉบับภาษาไทย และการรักษาเริ่มต้นแบบ Conservative & Reversible Therapy (Self-care + กายภาพบำบัด + Hard Acrylic Stabilization Splint) โดยห้ามกรอปรับสบฟันถาวรเป็นอันดับแรก'
  },
  'ทันตกรรมจัดฟัน': {
    org: 'สมาคมทันตแพทย์จัดฟันแห่งประเทศไทย (TAO) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย',
    protocol: 'ระวังค่ามาตรฐาน Cephalometric Norms ของคนไทยมีลักษณะ Bimaxillary Protrusion มากกว่า Caucasian (คนไทย SNA ~84–85°, SNB ~81°, ANB ~3–4°, L1-MP ~96–98° จึงต้องเทียบกับค่า Norm ของไทยที่โจทย์กำหนด)'
  },
  'ทันตกรรมชุมชน': {
    org: 'สำนักทันตสาธารณสุข กรมอนามัย กระทรวงสาธารณสุข & สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)',
    protocol: 'อ้างอิงผลสำรวจสภาวะสุขภาพช่องปากแห่งชาติ กรมอนามัย (กลุ่มอายุ 3, 5, 12, 15, 35–44, 60–74, 80–85 ปี), สิทธิทันตกรรม 3 กองทุน (บัตรทอง UCS / ประกันสังคม 900 บ./ปี / ข้าราชการ), เกณฑ์ F น้ำบริโภคไทย ≤ 0.7 ppm และสูตรแปรงฟัน 2-2-2'
  },
  'กฎหมายและจรรยาบรรณ': {
    org: 'ทันตแพทยสภา (Dental Council of Thailand) & กรมสนับสนุนบริการสุขภาพ (สบส. กระทรวงสาธารณสุข)',
    protocol: 'อ้างอิง พ.ร.บ.วิชาชีพทันตกรรม พ.ศ. 2537 (แก้ไข 2559), พ.ร.บ.สถานพยาบาล พ.ศ. 2541 (แก้ไข 2559), ข้อบังคับจรรยาบรรณวิชาชีพ พ.ศ. 2560, ระเบียบกระทรวงสาธารณสุขว่าด้วยทันตาภิบาล และ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)'
  }
};

export default function ExplanationBox({
  explanation,
  correctAnswer,
  userAnswer = null,
  isCached = false,
  question = null,
  onPracticeTopic = null,
}) {
  const [studyModalGuideId, setStudyModalGuideId] = useState(null);
  const [selfTestMask, setSelfTestMask] = useState(false);
  const [showInlineTutor, setShowInlineTutor] = useState(false);
  const [showAllChoices, setShowAllChoices] = useState(true);
  const [principleViewMode, setPrincipleViewMode] = useState('pathway'); // 'pathway' | 'text'
  const [showTopicPathway, setShowTopicPathway] = useState(false);
  const [topicPathways, setTopicPathways] = useState(null);
  const [loadingTopicPathway, setLoadingTopicPathway] = useState(false);

  let parsed = null;
  if (explanation) {
    if (typeof explanation === 'object') {
      parsed = explanation;
    } else {
      try {
        parsed = JSON.parse(explanation);
      } catch (e) {
        // plain text fallback
      }
    }
  }

  // Find matching clinical masterclass study guide or exact DB must_know_topic
  const matchingGuide = findGuideForQuestion(question || parsed);
  const targetTopicId = question?.must_know_topic || parsed?.must_know_topic || matchingGuide?.id;

  const isJsonExplanation = Boolean(parsed && typeof parsed === 'object' && (parsed.core_principle || parsed.key_takeaway));
  const key_takeaway = parsed?.key_takeaway || parsed?.why_correct || '';
  const legal_citation = parsed?.legal_citation || parsed?.reference || '';
  const core_principle = parsed?.core_principle || (!isJsonExplanation && typeof explanation === 'string' ? explanation : '');
  const choice_explanations = parsed?.choice_explanations;
  const common_pitfall = parsed?.common_pitfall;
  const future_prediction = parsed?.future_prediction || parsed?.clinical_pearl;
  const qCategory = question?.category || parsed?.category || matchingGuide?.category || '';

  // Map choices label -> choice text for clear contextual breakdown
  const choiceTextMap = useMemo(() => {
    const map = {};
    if (question?.choices && Array.isArray(question.choices)) {
      for (const c of question.choices) {
        if (c?.label) {
          map[String(c.label).trim().toUpperCase()] = c.text || '';
        }
      }
    }
    return map;
  }, [question]);

  const highYieldTokens = useMemo(
    () => extractHighYieldTokens([key_takeaway, core_principle, future_prediction]),
    [key_takeaway, core_principle, future_prediction]
  );

  const coreSteps = useMemo(() => splitReadableSteps(core_principle), [core_principle]);

  const questionPathway = useMemo(() => {
    if (!core_principle && !key_takeaway) return null;
    return buildDynamicPathwayFromText({
      title: question?.id ? `แผนผังกลไก & แนวทางคิดข้อสอบ (Q#${question.id})` : 'แผนผังกลไกและขั้นตอนการตัดสินใจ',
      corePrinciple: core_principle,
      keyTakeaway: key_takeaway,
      clinicalPearl: future_prediction,
      commonPitfall: common_pitfall,
      reference: legal_citation,
      category: qCategory,
      task: question?.task || '',
      isLegal: Boolean(parsed?.legal_citation && !parsed?.reference),
    });
  }, [question, core_principle, key_takeaway, future_prediction, common_pitfall, legal_citation, qCategory, parsed]);

  // Sort choices cleanly following question.choices order if available
  const orderedChoiceEntries = useMemo(() => {
    if (!choice_explanations || typeof choice_explanations !== 'object') return [];
    const entries = Object.entries(choice_explanations);
    if (question?.choices && question.choices.length > 0) {
      const orderIdx = {};
      question.choices.forEach((c, idx) => {
        orderIdx[String(c.label).trim().toUpperCase()] = idx;
      });
      entries.sort(([a], [b]) => {
        const ia = orderIdx[String(a).trim().toUpperCase()] ?? 99;
        const ib = orderIdx[String(b).trim().toUpperCase()] ?? 99;
        return ia - ib;
      });
    }
    return entries;
  }, [choice_explanations, question]);

  const handleToggleTopicPathway = async () => {
    const nextOpen = !showTopicPathway;
    setShowTopicPathway(nextOpen);
    if (!nextOpen || !targetTopicId) return;
    if (topicPathwayCache.has(targetTopicId)) {
      setTopicPathways(topicPathwayCache.get(targetTopicId));
      return;
    }
    setLoadingTopicPathway(true);
    try {
      const res = await fetch(`${API_BASE}/api/learning/pathway/${encodeURIComponent(targetTopicId)}`);
      if (res.ok) {
        const data = await res.json();
        const pList = data?.pathways || [];
        topicPathwayCache.set(targetTopicId, pList);
        setTopicPathways(pList);
      }
    } catch (err) {
      console.error('Failed to fetch topic pathway:', err);
    } finally {
      setLoadingTopicPathway(false);
    }
  };

  if (!explanation) return null;

  // Plain text fallback
  if (!isJsonExplanation) {
    return (
      <div className="explanation-box" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} color="var(--primary-light)" />
            <strong style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>เฉลยและคำอธิบาย</strong>
          </div>
          {correctAnswer && (
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>
              คำตอบที่ถูกต้อง: {correctAnswer}
            </span>
          )}
          {targetTopicId && (
            <button
              type="button"
              onClick={() => setStudyModalGuideId(targetTopicId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                color: '#f43f5e',
                borderRadius: '20px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <BookOpen size={13} /> 📖 เรียนหัวข้อนี้จาก Textbook & Evidence
            </button>
          )}
        </div>
        {questionPathway ? (
          <ClinicalPathwayDiagram pathway={questionPathway} compact={true} />
        ) : (
          <div style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {explanation}
          </div>
        )}

        {studyModalGuideId && (
          <ClinicalStudyHub
            isModal={true}
            initialTopicId={studyModalGuideId}
            onStartExam={onPracticeTopic}
            onClose={() => setStudyModalGuideId(null)}
          />
        )}
      </div>
    );
  }

  const rawCog = question?.cognitive_level || parsed.cognitive_level;
  const cogBadge = normalizeCogBadge(rawCog);
  const tos_code = parsed.tos_code || question?.must_know_topic || parsed.must_know_topic;

  const actualCorrect = String(parsed.correct_answer || correctAnswer || '').trim();
  const userAnsClean = userAnswer ? String(userAnswer).trim() : null;
  const isUserCorrect = Boolean(userAnsClean && actualCorrect && userAnsClean.toUpperCase() === actualCorrect.toUpperCase());
  const hasUserWrong = Boolean(userAnsClean && actualCorrect && !isUserCorrect);

  const thaiRefInfo = THAI_ASSOCIATION_BY_CATEGORY[qCategory] || null;

  const userWrongExplanation = hasUserWrong && choice_explanations
    ? (choice_explanations[userAnsClean] || choice_explanations[userAnsClean.toUpperCase()] || choice_explanations[userAnsClean.toLowerCase()] || '')
    : '';
  const correctExplanation = actualCorrect && choice_explanations
    ? (choice_explanations[actualCorrect] || choice_explanations[actualCorrect.toUpperCase()] || choice_explanations[actualCorrect.toLowerCase()] || '')
    : '';

  return (
    <div className="explanation-box" style={{ marginTop: '1.25rem' }}>
      
      {/* ── Header: Personalized Diagnosis + Badges + Deep Study Link ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>เฉลยที่ถูกต้อง:</span>
          <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {actualCorrect}
            {choiceTextMap[actualCorrect.toUpperCase()] && (
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text)', marginLeft: '4px' }}>
                ({choiceTextMap[actualCorrect.toUpperCase()].slice(0, 65)}{choiceTextMap[actualCorrect.toUpperCase()].length > 65 ? '...' : ''})
              </span>
            )}
          </span>
          {userAnsClean && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.18rem 0.6rem',
              borderRadius: '12px',
              background: isUserCorrect ? 'rgba(16, 185, 129, 0.16)' : 'rgba(244, 63, 94, 0.16)',
              color: isUserCorrect ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${isUserCorrect ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isUserCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
              {isUserCorrect ? 'คุณตอบถูกข้อนี้' : `คุณเลือกข้อ ${userAnsClean} (พลาด)`}
            </span>
          )}
          {cogBadge && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.55rem',
              borderRadius: '12px',
              background: cogBadge.bg,
              color: cogBadge.color,
              border: `1px solid ${cogBadge.border}`
            }}>
              🎯 {cogBadge.label}
            </span>
          )}
          {tos_code && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.15rem 0.55rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-sub)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              📋 {tos_code}
            </span>
          )}
          {isCached && <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>คลังข้อสอบ</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* Deep Clinical Study Guide Button */}
          {targetTopicId && (
            <button
              type="button"
              onClick={() => setStudyModalGuideId(targetTopicId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(139, 92, 246, 0.18))',
                border: '1px solid rgba(236, 72, 153, 0.45)',
                color: '#f43f5e',
                borderRadius: '20px',
                padding: '0.3rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(236, 72, 153, 0.2)'
              }}
              title="คลิกเพื่อเปิดห้องเรียน Textbook & Evidence เจาะลึกหัวข้อนี้"
            >
              <BookOpen size={13} /> 📖 เรียนหัวข้อนี้จาก Textbook & Evidence
            </button>
          )}
        </div>
      </div>

      {/* ── 0. Head-to-Head Comparison when User Missed the Question ── */}
      {hasUserWrong && (userWrongExplanation || correctExplanation) && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.9rem 1rem',
          borderRadius: '10px',
          background: 'rgba(244, 63, 94, 0.05)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
        }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--ink-rose)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⚔️ เทียบชัดๆ ทำไมข้อที่คุณเลือกถึงพลาด & ทำไมเฉลยจึงถูก:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(244, 63, 94, 0.09)',
              border: '1px solid rgba(244, 63, 94, 0.28)',
              borderLeft: '4px solid var(--danger)',
              borderRadius: '8px',
              padding: '0.75rem 0.9rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 800, color: 'var(--danger)', marginBottom: '0.25rem' }}>
                ✗ ตัวเลือกที่คุณตอบ ({userAnsClean}){choiceTextMap[userAnsClean.toUpperCase()] ? `: ${choiceTextMap[userAnsClean.toUpperCase()]}` : ''}
              </div>
              <div style={{ color: 'var(--text-sub)', lineHeight: 1.55 }}>
                {userWrongExplanation || 'ไม่ตรงกับเกณฑ์วินิจฉัยหรือแนวทางการรักษาหลักของเคสนี้'}
              </div>
            </div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.09)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              borderLeft: '4px solid var(--success)',
              borderRadius: '8px',
              padding: '0.75rem 0.9rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 800, color: 'var(--success)', marginBottom: '0.25rem' }}>
                ✓ คำตอบที่ถูกต้อง ({actualCorrect}){choiceTextMap[actualCorrect.toUpperCase()] ? `: ${choiceTextMap[actualCorrect.toUpperCase()]}` : ''}
              </div>
              <div style={{ color: 'var(--text)', lineHeight: 1.55 }}>
                {correctExplanation || key_takeaway}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Key Takeaway (with Active Recall Self-Test Masking) ── */}
      {key_takeaway && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(124, 58, 237, 0.1) 100%)',
          borderLeft: '4px solid var(--accent)',
          borderRadius: '8px',
          padding: '0.9rem 1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem' }}>
              <span>📌</span> {parsed.why_correct && !parsed.key_takeaway ? 'เหตุผลที่ตอบข้อนี้ (Why Correct)' : 'Key Takeaway (หัวใจสำคัญจำไปสอบ)'}
            </div>
            <button
              type="button"
              onClick={() => setSelfTestMask(m => !m)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: '14px',
                background: selfTestMask ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                color: selfTestMask ? '#fff' : 'var(--text-sub)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
              title="ปิดคำสำคัญไว้ชั่วคราวเพื่อฝึกสมองทวนความจำแบบ Active Recall"
            >
              {selfTestMask ? <><Eye size={13} /> เฉลยคำสำคัญ</> : <><EyeOff size={13} /> ปิดคำสำคัญทดสอบจำ</>}
            </button>
          </div>
          <div style={{ color: 'var(--text)', fontSize: '0.93rem', fontWeight: 600, lineHeight: 1.65 }}>
            {selfTestMask ? maskKeyTerms(key_takeaway) : key_takeaway}
          </div>
          {highYieldTokens.length > 0 && !selfTestMask && (
            <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-muted)' }}>🔢 ตัวเลข/เกณฑ์ต้องจำในข้อนี้:</span>
              {highYieldTokens.map((tok, i) => (
                <span key={i} style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '0.12rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.14)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: 'var(--accent)'
                }}>
                  {tok}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 2. Common Pitfall & Traps (หลุมพรางข้อสอบ) ── */}
      {common_pitfall && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderLeft: '4px solid var(--warning)',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>
            <AlertTriangle size={15} /> ข้อควรระวัง & กับดักข้อสอบ (Common Trap)
          </div>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {common_pitfall}
          </div>
        </div>
      )}

      {/* ── 3. Core Principle: Visual Pathway Flowchart <-> Text Toggle + Topic Master Protocol ── */}
      {core_principle && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <h4 style={{ color: 'var(--primary-light)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}>
              <Lightbulb size={16} /> {parsed.legal_citation && !parsed.reference ? 'กลไก & กระบวนการทางกฎหมาย (Pathway & Steps)' : 'กลไกการเกิด & แนวทางคลินิก (Pathway & Mechanism)'}
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {questionPathway && (
                <div style={{
                  display: 'inline-flex',
                  padding: '2px',
                  borderRadius: '9px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}>
                  <button
                    type="button"
                    onClick={() => setPrincipleViewMode('pathway')}
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '7px',
                      border: 'none',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: principleViewMode === 'pathway' ? 'var(--primary)' : 'transparent',
                      color: principleViewMode === 'pathway' ? '#fff' : 'var(--text-sub)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <GitBranch size={12} /> แผนผัง Pathway
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrincipleViewMode('text')}
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '7px',
                      border: 'none',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: principleViewMode === 'text' ? 'var(--accent)' : 'transparent',
                      color: principleViewMode === 'text' ? '#0f172a' : 'var(--text-sub)',
                    }}
                  >
                    📄 ข้อความ
                  </button>
                </div>
              )}

              {targetTopicId && (
                <button
                  type="button"
                  onClick={handleToggleTopicPathway}
                  style={{
                    padding: '0.24rem 0.68rem',
                    borderRadius: '9px',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: showTopicPathway ? 'rgba(16, 185, 129, 0.22)' : 'rgba(6, 182, 212, 0.12)',
                    border: showTopicPathway ? '1px solid #10b981' : '1px solid rgba(6, 182, 212, 0.35)',
                    color: showTopicPathway ? '#34d399' : '#22d3ee',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <GitBranch size={12} /> {showTopicPathway ? 'ซ่อน Master Protocol หัวข้อนี้' : '🧭 ดู Master Protocol หัวข้อนี้'}
                </button>
              )}
            </div>
          </div>

          {principleViewMode === 'pathway' && questionPathway ? (
            <ClinicalPathwayDiagram pathway={questionPathway} compact={true} />
          ) : coreSteps.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {coreSteps.map((stepTxt, sIdx) => (
                <div key={sIdx} style={{
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  lineHeight: 1.65,
                  color: 'var(--text-sub)',
                  fontSize: '0.9rem'
                }}>
                  <span style={{
                    minWidth: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'rgba(124, 58, 237, 0.2)',
                    color: 'var(--primary-light)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px'
                  }}>
                    {sIdx + 1}
                  </span>
                  <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{stepTxt}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-sub)', fontSize: '0.92rem' }}>
              {core_principle}
            </div>
          )}

          {showTopicPathway && (
            <div style={{ marginTop: '0.85rem' }}>
              {loadingTopicPathway ? (
                <div style={{ padding: '0.9rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.08)', color: 'var(--text-sub)', fontSize: '0.84rem', textAlign: 'center' }}>
                  ⏳ กำลังโหลดแผนผัง Master Protocol & Pathogenesis ประจำหัวข้อนี้...
                </div>
              ) : topicPathways && topicPathways.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {topicPathways.slice(0, 2).map(tp => (
                    <ClinicalPathwayDiagram key={tp.id} pathway={tp} compact={true} />
                  ))}
                </div>
              ) : (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  ยังไม่พบแผนผัง Master Protocol สำหรับหัวข้อนี้ ลองเปิดในห้องเรียน Textbook & Evidence ด้านล่าง
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 4. Choice-by-Choice Breakdown (แสดงข้อความตัวเลือกจริงคู่กับเหตุผล) ── */}
      {orderedChoiceEntries.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <h4 style={{ color: 'var(--text)', margin: 0, fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.02em' }}>
              🎯 วิเคราะห์ตัวเลือกรายข้อ (เปรียบเทียบทุกตัวเลือก)
            </h4>
            <button
              type="button"
              onClick={() => setShowAllChoices(v => !v)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {showAllChoices ? 'ย่อลง' : `ดูครบทั้ง ${orderedChoiceEntries.length} ตัวเลือก`}
            </button>
          </div>
          {showAllChoices && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {orderedChoiceEntries.map(([label, text]) => {
                const lblUp = String(label).trim().toUpperCase();
                const isCorrect = lblUp === actualCorrect.toUpperCase();
                const isUserPickedWrong = Boolean(userAnsClean && lblUp === userAnsClean.toUpperCase() && !isCorrect);
                const cText = choiceTextMap[lblUp];
                return (
                  <div key={label} style={{
                    background: isCorrect
                      ? 'rgba(16, 185, 129, 0.09)'
                      : isUserPickedWrong
                      ? 'rgba(244, 63, 94, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isCorrect
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : isUserPickedWrong
                      ? '1px solid rgba(244, 63, 94, 0.3)'
                      : '1px solid var(--border)',
                    borderLeft: isCorrect
                      ? '4px solid var(--success)'
                      : isUserPickedWrong
                      ? '4px solid var(--danger)'
                      : '4px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem 0.9rem',
                    fontSize: '0.89rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                      <strong style={{ color: isCorrect ? 'var(--success)' : isUserPickedWrong ? 'var(--danger)' : 'var(--text)' }}>
                        ตัวเลือก {label}{cText ? `: ${cText}` : ''}
                      </strong>
                      {isCorrect && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.05rem 0.45rem', borderRadius: '6px', background: 'rgba(16,185,129,0.2)', color: 'var(--success)' }}>
                          คำตอบที่ถูก
                        </span>
                      )}
                      {isUserPickedWrong && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.05rem 0.45rem', borderRadius: '6px', background: 'rgba(244,63,94,0.2)', color: 'var(--danger)' }}>
                          ข้อที่คุณเลือก
                        </span>
                      )}
                    </div>
                    <div style={{ color: isCorrect ? 'var(--text)' : 'var(--text-sub)', lineHeight: 1.55 }}>
                      {text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 5. Future Prediction / Professor's Wisdom ── */}
      {future_prediction && (
        <div style={{
          marginTop: '1rem',
          padding: '0.9rem 1rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(6, 182, 212, 0.04))',
          border: '1px solid rgba(124, 58, 237, 0.2)',
        }}>
          <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
            <Sparkles size={15} /> {parsed.clinical_pearl && !parsed.future_prediction ? 'Clinical Pearl / จุดเน้นและแนวทางพลิกแพลงข้อสอบ' : "Professor's Wisdom / แนวโน้มข้อสอบ"}
          </h4>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {future_prediction}
          </div>
        </div>
      )}

      {/* ── 6. Textbook Reference + Thai Dental Council / Specialty Society Protocol Reference ── */}
      {legal_citation && (
        <div style={{
          marginTop: '0.85rem',
          padding: '0.65rem 1rem',
          borderRadius: '8px',
          background: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.82rem',
          color: 'var(--primary-light)',
          fontWeight: 600
        }}>
          <BookOpen size={14} style={{ flexShrink: 0 }} />
          <span>แหล่งอ้างอิงหลักฐานทางวิชาการ (Reference): {legal_citation}</span>
        </div>
      )}

      {thaiRefInfo && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.8rem 1rem',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', marginBottom: '0.25rem' }}>
            🇹🇭 อ้างอิงเกณฑ์ประเทศไทย: {thaiRefInfo.org}
          </div>
          <div style={{ fontSize: '0.83rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
            {thaiRefInfo.protocol}
          </div>
        </div>
      )}

      {/* ── 7. Interactive Mentor Action Bar (Parallel Practice + Study Hub + AI Tutor) ── */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        {targetTopicId && (
          <button
            type="button"
            onClick={() => setStudyModalGuideId(targetTopicId)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(236, 72, 153, 0.14)',
              border: '1px solid rgba(236, 72, 153, 0.35)',
              color: '#f472b6',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Layers size={14} /> เปิดบทเรียน & Flashcards หัวข้อนี้
          </button>
        )}

        {onPracticeTopic && question?.must_know_topic && (
          <button
            type="button"
            onClick={() => onPracticeTopic({ mode: 'practice', must_know_topic: question.must_know_topic, count: 5 })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.14)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Target size={14} /> ฝึกโจทย์คู่ขนานหัวข้อเดียวกัน (5 ข้อ)
          </button>
        )}

        {question?.id && (
          <button
            type="button"
            onClick={() => setShowInlineTutor(v => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: showInlineTutor ? 'var(--primary)' : 'rgba(124, 58, 237, 0.14)',
              border: '1px solid rgba(124, 58, 237, 0.38)',
              color: showInlineTutor ? '#fff' : 'var(--primary-light)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Bot size={14} /> {showInlineTutor ? 'ซ่อน AI Tutor' : '💬 ถามอาจารย์ AI ข้อนี้ต่อ'}
          </button>
        )}
      </div>

      {showInlineTutor && question?.id && (
        <TutorChat
          questionId={question.id}
          userAnswer={userAnsClean}
          correctAnswer={actualCorrect}
        />
      )}

      {/* ── 8. Standalone Deep Study Modal ── */}
      {studyModalGuideId && (
        <ClinicalStudyHub
          isModal={true}
          initialTopicId={studyModalGuideId}
          onStartExam={onPracticeTopic}
          onClose={() => setStudyModalGuideId(null)}
        />
      )}

    </div>
  );
}
