import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';
import { findGuideForQuestion } from '../data/clinicalStudyGuides';
import ClinicalStudyHub from './ClinicalStudyHub';

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

export default function ExplanationBox({ explanation, correctAnswer, isCached = false, question = null }) {
  const [studyModalGuideId, setStudyModalGuideId] = useState(null);

  if (!explanation) return null;

  let parsed = null;
  if (typeof explanation === 'object' && explanation !== null) {
    parsed = explanation;
  } else {
    try {
      parsed = JSON.parse(explanation);
    } catch (e) {
      // plain text fallback
    }
  }

  // Find matching clinical masterclass study guide or exact DB must_know_topic
  const matchingGuide = findGuideForQuestion(question || parsed);
  const targetTopicId = question?.must_know_topic || parsed?.must_know_topic || matchingGuide?.id;

  // Plain text fallback
  if (!parsed || typeof parsed !== 'object' || (!parsed.core_principle && !parsed.key_takeaway)) {
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
        <div style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {explanation}
        </div>

        {studyModalGuideId && (
          <ClinicalStudyHub
            isModal={true}
            initialTopicId={studyModalGuideId}
            onClose={() => setStudyModalGuideId(null)}
          />
        )}
      </div>
    );
  }

  const key_takeaway = parsed.key_takeaway || parsed.why_correct;
  const legal_citation = parsed.legal_citation || parsed.reference;
  const core_principle = parsed.core_principle;
  const choice_explanations = parsed.choice_explanations;
  const common_pitfall = parsed.common_pitfall;
  const future_prediction = parsed.future_prediction || parsed.clinical_pearl;

  const cognitive_level = parsed.cognitive_level;
  const tos_code = parsed.tos_code;

  const actualCorrect = parsed.correct_answer || correctAnswer;
  const qCategory = question?.category || parsed?.category || matchingGuide?.category || '';
  const thaiRefInfo = THAI_ASSOCIATION_BY_CATEGORY[qCategory] || null;

  return (
    <div className="explanation-box" style={{ marginTop: '1.25rem' }}>
      
      {/* ── Header: Correct Answer + Citations + Level + TOS + Deep Study Link ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>เฉลยที่ถูกต้อง:</span>
          <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.35rem' }}>
            {actualCorrect}
          </span>
          {isCached && <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>คลังข้อสอบ</span>}
          {cognitive_level && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.55rem',
              borderRadius: '12px',
              background: cognitive_level.toLowerCase().includes('problem')
                ? 'rgba(239, 68, 68, 0.15)'
                : cognitive_level.toLowerCase().includes('application')
                ? 'rgba(59, 130, 246, 0.15)'
                : 'rgba(16, 185, 129, 0.15)',
              color: cognitive_level.toLowerCase().includes('problem')
                ? '#f87171'
                : cognitive_level.toLowerCase().includes('application')
                ? '#60a5fa'
                : '#34d399',
              border: '1px solid ' + (cognitive_level.toLowerCase().includes('problem')
                ? 'rgba(239, 68, 68, 0.3)'
                : cognitive_level.toLowerCase().includes('application')
                ? 'rgba(59, 130, 246, 0.3)'
                : 'rgba(16, 185, 129, 0.3)')
            }}>
              🎯 ระดับ {cognitive_level}
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

          {legal_citation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>
              <BookOpen size={13} /> {legal_citation}
            </div>
          )}
        </div>
      </div>

      {/* ── 1. Key Takeaway (สรุป 1 บรรทัดจำไปสอบ) ── */}
      {key_takeaway && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(124, 58, 237, 0.1) 100%)',
          borderLeft: '4px solid var(--accent)',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>
            <span>📌</span> {parsed.why_correct && !parsed.key_takeaway ? 'เหตุผลที่ตอบข้อนี้ (Why Correct)' : 'Key Takeaway (สรุปหัวใจสำคัญ)'}
          </div>
          <div style={{ color: 'var(--text)', fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.6 }}>
            {key_takeaway}
          </div>
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

      {/* ── 3. Core Principle (หลักการและเหตุผล) ── */}
      {core_principle && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}>
            <Lightbulb size={16} /> {parsed.legal_citation && !parsed.reference ? 'หลักการและเหตุผลทางกฎหมาย' : 'หลักการและกลไกทางคลินิก (Core Mechanism & Principle)'}
          </h4>
          <div style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-sub)', fontSize: '0.92rem' }}>
            {core_principle}
          </div>
        </div>
      )}

      {/* ── 4. Choice-by-Choice Breakdown (วิเคราะห์ตัวเลือกรายข้อ) ── */}
      {choice_explanations && Object.keys(choice_explanations).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '0.6rem', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            🎯 วิเคราะห์ตัวเลือกรายข้อ
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(choice_explanations).map(([label, text]) => {
              const isCorrect = String(label).trim().toUpperCase() === String(actualCorrect).trim().toUpperCase();
              return (
                <div key={label} style={{
                  background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isCorrect ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border)',
                  borderLeft: isCorrect ? '4px solid var(--success)' : '4px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.75rem 0.9rem',
                  fontSize: '0.9rem',
                }}>
                  <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--text-sub)', marginRight: '4px' }}>
                    ตัวเลือก {label}:
                  </strong>
                  <span style={{ color: isCorrect ? 'var(--text)' : 'var(--text-muted)', lineHeight: 1.55 }}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
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
            <Sparkles size={15} /> {parsed.clinical_pearl && !parsed.future_prediction ? 'Clinical Pearl / จุดเน้นข้อสอบ' : "Professor's Wisdom / แนวโน้มข้อสอบ"}
          </h4>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {future_prediction}
          </div>
        </div>
      )}

      {/* ── 6. 🇹🇭 Thai Dental Council / Specialty Society Protocol Reference ── */}
      {thaiRefInfo && (
        <div style={{
          marginTop: '0.85rem',
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

      {/* ── 7. Standalone Deep Study Modal ── */}
      {studyModalGuideId && (
        <ClinicalStudyHub
          isModal={true}
          initialTopicId={studyModalGuideId}
          onClose={() => setStudyModalGuideId(null)}
        />
      )}

    </div>
  );
}
