import React, { useMemo, useState } from 'react';
import {
  Calculator, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  BookOpen, ChevronDown, ChevronUp, Sparkles, Flame, Target
} from 'lucide-react';

const DOMAIN_META = {
  all: { label: 'สุ่มรวมทุกหมวด (Mixed)', icon: '🎲', color: '#6366f1', topicId: null },
  anesthesia: { label: 'ยาชา & Max Dose (MRD)', icon: '💉', color: '#38bdf8', topicId: 'OS-Local-Anesthesia' },
  pediatric_pharma: { label: 'ฟลูออไรด์ & เภสัชเด็ก', icon: '🧪', color: '#ec4899', topicId: 'Pedo-Fluoride-Toxicology' },
  biostat: { label: 'ชีวสถิติ & Screening 2×2', icon: '📊', color: '#10b981', topicId: 'Comm-Epidemiology-Biostat' },
  perio_ortho: { label: 'ปริทันต์ CAL / Crown / จัดฟัน', icon: '📐', color: '#f59e0b', topicId: 'Perio-Diagnosis-Classification' },
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const roundTo = (val, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
};

function buildAnesthesiaProblem(variantHint) {
  const variant = variantHint ?? randInt(0, 3);

  if (variant === 0) {
    // Healthy patient: 2% Lidocaine 1:100,000 Epi (Max carpules)
    const weight = pickRandom([18, 22, 28, 35, 48, 54, 62, 70, 78]);
    const mgPerCarpule = 36; // 2% = 20 mg/mL * 1.8 mL
    const rawMrd = weight * 7.0;
    const cappedMrd = Math.min(rawMrd, 500);
    const exactCarpules = cappedMrd / mgPerCarpule;
    const ans = Math.floor(exactCarpules);
    return {
      domain: 'anesthesia',
      title: 'Maximum Safe Carpules: 2% Lidocaine + 1:100,000 Epinephrine',
      badge: 'Oral Surgery / Pediatric LA',
      topicId: 'OS-Local-Anesthesia',
      unit: 'หลอด (Carpules)',
      hint: 'ปัดลงเป็นจำนวนเต็มหลอด เพื่อความปลอดภัยของผู้ป่วย (1 หลอด = 1.8 mL)',
      tolerance: 0,
      answer: ans,
      vignette: `ผู้ป่วยสุขภาพแข็งแรง น้ำหนักตัว ${weight} kg ต้องการทำหัตถการถอนฟันและขูดหินน้ำลาย โดยใช้ยาชา 2% Lidocaine with 1:100,000 Epinephrine (ปริมาตร 1.8 mL/หลอด) จงคำนวณจำนวน "หลอดยาชาสูงสุด" ที่ฉีดได้อย่างปลอดภัยใน 1 ครั้ง`,
      params: [
        { label: 'น้ำหนักผู้ป่วย', value: `${weight} kg` },
        { label: 'ความเข้มข้นยาชา', value: '2% (20 mg/mL)' },
        { label: 'ปริมาตรต่อหลอด', value: '1.8 mL = 36 mg/หลอด' },
        { label: 'MRD (Malamed/AAPD)', value: '7.0 mg/kg (Max 500 mg)' },
      ],
      steps: [
        `คำนวณความเข้มข้นต่อหลอด: 2% Lidocaine = 20 mg/mL × 1.8 mL = 36 mg/หลอด`,
        `คำนวณ Maximum Recommended Dose (MRD): ${weight} kg × 7.0 mg/kg = ${rawMrd} mg ${rawMrd > 500 ? '→ เกินเพดานสูงสุด จึงต้องจำกัดที่ Absolute Max 500 mg' : '(ไม่เกิน Absolute Max 500 mg)'}`,
        `หารด้วยปริมาณยาชาต่อหลอด: ${cappedMrd} ÷ 36 = ${roundTo(exactCarpules, 2)} หลอด`,
        `กฎความปลอดภัยทางคลินิก: ต้องปัดลง (Floor) เสมอ → สูงสุด ${ans} หลอดเต็ม`,
      ],
      pitfall: 'ห้ามปัดเศษขึ้นเด็ดขาด! และอย่าสับสนเพดาน MRD ของ Lidocaine (7.0 mg/kg, max 500 mg ตาม Malamed 7th ed.) กับ 3% Mepivacaine Plain (6.6 mg/kg, max 400 mg)',
      reference: 'Malamed SF. Handbook of Local Anesthesia, 7th Ed. / AAPD Local Anesthesia Guideline',
    };
  }

  if (variant === 1) {
    // Cardiac patient: Epinephrine 0.04 mg Limit Trap!
    const weight = pickRandom([56, 64, 70, 76, 82]);
    const isOneToFifty = pickRandom([true, false]);
    const epiConcLabel = isOneToFifty ? '1:50,000 Epinephrine' : '1:100,000 Epinephrine';
    const epiMgPerMl = isOneToFifty ? 0.02 : 0.01;
    const epiPerCarpule = roundTo(epiMgPerMl * 1.8, 3);
    const exactCarpules = 0.04 / epiPerCarpule;
    const ans = Math.floor(exactCarpules);
    return {
      domain: 'anesthesia',
      title: `Cardiovascular Limit: ${epiConcLabel}`,
      badge: 'Medical Complexity / Epinephrine Cap',
      topicId: 'OS-Medically-Compromised',
      unit: 'หลอด (Carpules)',
      hint: 'ใช้เพดาน Epinephrine ในผู้ป่วยโรคหัวใจ (0.04 mg) แล้วปัดลงเป็นจำนวนเต็มหลอด (1.8 mL/หลอด)',
      tolerance: 0,
      answer: ans,
      vignette: `ผู้ป่วยอายุ 65 ปี น้ำหนัก ${weight} kg มีประวัติ Angina และหลอดเลือดหัวใจตีบ (ASA III อาการคงที่) แพทย์อนุญาตให้ทำฟันได้ โดยใช้ 2% Lidocaine with ${epiConcLabel} (1.8 mL/หลอด) สามารถฉีดได้สูงสุดกี่หลอด?`,
      params: [
        { label: 'ภาวะผู้ป่วย', value: 'Cardiac / CVD Limit (ASA III)' },
        { label: 'Cardiac Max Epi', value: '0.04 mg / visit' },
        { label: 'ความเข้มข้น Epi', value: `${epiConcLabel} (${epiMgPerMl} mg/mL)` },
        { label: 'Epi ต่อหลอด (1.8 mL)', value: `${epiPerCarpule} mg/หลอด` },
      ],
      steps: [
        `แม้ Lidocaine MRD จะให้ได้ถึง ${Math.floor(Math.min(weight * 7, 500) / 36)} หลอด แต่ผู้ป่วยโรคหัวใจ (CVD) ต้องจำกัด Epinephrine ไม่เกิน 0.04 mg/ครั้ง`,
        `ปริมาณ Epinephrine ต่อ 1 หลอด (1.8 mL): ${epiMgPerMl} mg/mL × 1.8 mL = ${epiPerCarpule} mg`,
        `จำนวนหลอดสูงสุดตามเพดาน Epi: 0.04 ÷ ${epiPerCarpule} = ${roundTo(exactCarpules, 2)} หลอด`,
        `ปัดลงเพื่อความปลอดภัย → สูงสุด ${ans} หลอดเต็ม (${roundTo(ans * epiPerCarpule, 3)} mg Epinephrine)`,
      ],
      pitfall: 'ข้อสอบ NL ชอบให้ตัวเลขน้ำหนัก 70 kg มาลวงให้เด็กคำนวณยาชา 13 หลอด แล้วลืมว่าในผู้ป่วย CVD เพดาน Epinephrine คือ 0.04 mg (ไม่ใช่ 0.2 mg แบบคนปกติ!)',
      reference: 'Malamed SF. Medical Emergencies & Local Anesthesia (ASA III Cardiovascular Epinephrine Limit 0.04 mg)',
    };
  }

  if (variant === 2) {
    // 4% Articaine pediatric / adult
    const weight = pickRandom([16, 20, 24, 30, 42, 55, 66]);
    const mgPerCarpule = 72; // 4% = 40 mg/mL * 1.8 mL
    const mrdMg = roundTo(weight * 7.0, 1);
    const exactCarpules = mrdMg / mgPerCarpule;
    const ans = Math.floor(exactCarpules);
    return {
      domain: 'anesthesia',
      title: '4% Articaine + 1:100,000 Epi (Max Carpules)',
      badge: 'High-Concentration LA Calculation',
      topicId: 'OS-Local-Anesthesia',
      unit: 'หลอด (Carpules)',
      hint: '4% = 40 mg/mL; ระบุใช้หลอด 1.8 mL แล้วปัดลงเป็นจำนวนเต็ม',
      tolerance: 0,
      answer: ans,
      vignette: `ผู้ป่วยน้ำหนัก ${weight} kg (อายุ > 4 ปี ไม่มีข้อห้ามยาชา) จะใช้ 4% Articaine with 1:100,000 Epinephrine ขนาดบรรจุ 1.8 mL/หลอด จงคำนวณจำนวนหลอดสูงสุดที่ไม่เกิน MRD (7.0 mg/kg)`,
      params: [
        { label: 'น้ำหนักผู้ป่วย', value: `${weight} kg` },
        { label: '4% Articaine', value: '40 mg/mL → 72 mg / 1.8 mL' },
        { label: 'MRD', value: '7.0 mg/kg (ไม่มี absolute cap ต่ำกว่า 500)' },
      ],
      steps: [
        `คำนวณความแรงต่อหลอด: 4% = 40 mg/mL × 1.8 mL = 72 mg/หลอด (แรงเป็น 2 เท่าของ 2% Lidocaine!)`,
        `คำนวณ MRD รวม: ${weight} kg × 7.0 mg/kg = ${mrdMg} mg`,
        `จำนวนหลอด: ${mrdMg} ÷ 72 = ${roundTo(exactCarpules, 2)} หลอด → ปัดลงได้ ${ans} หลอดเต็ม`,
      ],
      pitfall: '4% Articaine 1 หลอดมีตัวยาสูงถึง 72 mg (ไม่ใช่ 36 mg!) จึงถึงเพดานพิษเร็วกว่า Lidocaine 2 เท่า และห้ามใช้ IANB ถ้าเลี่ยงได้ในบางตำราเนื่องจากเสี่ยง paresthesia สูงกว่า Lidocaine เล็กน้อย (นิยมใช้ Buccal infiltration)',
      reference: 'Malamed SF. Handbook of Local Anesthesia, 7th Ed.',
    };
  }

  // 3% Mepivacaine Plain MRD in mg (total mg cap check)
  const weight = pickRandom([15, 20, 25, 45, 58, 68, 75]);
  const rawMg = roundTo(weight * 6.6, 1);
  const ans = Math.min(rawMg, 400);
  return {
    domain: 'anesthesia',
    title: '3% Mepivacaine Plain: คำนวณ Max Dose (mg)',
    badge: 'Plain LA MRD Cap',
    topicId: 'OS-Local-Anesthesia',
    unit: 'mg',
    hint: 'ตอบปริมาณยาชาสูงสุดเป็น mg (จำ Absolute Max ของ Mepivacaine Plain ให้แม่น!)',
    tolerance: 0.5,
    answer: ans,
    vignette: `ผู้ป่วยน้ำหนัก ${weight} kg จำเป็นต้องใช้ยาชาชนิดไม่มีหลอดเลือดหดตัว (3% Mepivacaine Plain) คำนวณปริมาณตัวยาสูงสุด (Maximum Recommended Dose) ที่ให้ได้ทั้งหมดกี่ mg?`,
    params: [
      { label: 'น้ำหนักผู้ป่วย', value: `${weight} kg` },
      { label: 'MRD (Malamed 7th ed.)', value: '6.6 mg/kg' },
      { label: 'Absolute Max (Mepivacaine)', value: '400 mg' },
    ],
    steps: [
      `คำนวณตามน้ำหนัก: ${weight} kg × 6.6 mg/kg = ${rawMg} mg`,
      rawMg > 400
        ? `เนื่องจาก ${rawMg} mg > Absolute Max 400 mg → ต้องหยุดที่เพดานสูงสุด 400 mg`
        : `เนื่องจาก ${rawMg} mg ≤ Absolute Max 400 mg → คำตอบคือ ${ans} mg`,
    ],
    pitfall: 'เพดาน Absolute Max ของ 3% Mepivacaine คือ 400 mg (ไม่ใช่ 500 mg!) และ 1 หลอด (1.8 mL) มีตัวยา 54 mg จึงฉีดได้สูงสุดไม่เกิน 7 หลอดในผู้ใหญ่',
    reference: 'Malamed SF. Handbook of Local Anesthesia, 7th Ed.',
  };
}

function buildPediatricPharmaProblem(variantHint) {
  const variant = variantHint ?? randInt(0, 3);

  if (variant === 0) {
    // Fluoride PTD volume of 1.23% APF or 5% NaF Varnish
    const weight = pickRandom([12, 14, 16, 18, 20, 22, 25]);
    const useVarnish = pickRandom([true, false]);
    const conc = useVarnish ? 22.6 : 12.3;
    const prodName = useVarnish ? '5% NaF Varnish (22.6 mg F/mL)' : '1.23% APF Gel (12.3 mg F/mL)';
    const ptdMg = weight * 5;
    const ans = roundTo(ptdMg / conc, 1);
    return {
      domain: 'pediatric_pharma',
      title: `Fluoride Toxicity (PTD): ${useVarnish ? '5% NaF Varnish' : '1.23% APF Gel'}`,
      badge: 'Pediatric Toxicology',
      topicId: 'Pedo-Fluoride-Toxicology',
      unit: 'mL',
      hint: 'Probable Toxic Dose (PTD) = 5 mg F/kg; ตอบเป็นปริมาตร (mL) ทศนิยม 1 ตำแหน่ง (±0.2 mL)',
      tolerance: 0.25,
      answer: ans,
      vignette: `เด็กอายุ 4 ปี น้ำหนัก ${weight} kg เผลอกลืน ${prodName} ปริมาตรเริ่มต้นเท่าใดจึงจะถึงระดับ Probable Toxic Dose (PTD) ที่ต้องรีบส่งโรงพยาบาลทันที?`,
      params: [
        { label: 'น้ำหนักเด็ก', value: `${weight} kg` },
        { label: 'เกณฑ์ PTD', value: '5 mg F / kg' },
        { label: 'ความเข้มข้น F⁻', value: prodName },
      ],
      steps: [
        `คำนวณ Probable Toxic Dose รวม: ${weight} kg × 5 mg F/kg = ${ptdMg} mg F`,
        `คำนวณปริมาตรสารละลาย: ${ptdMg} mg F ÷ ${conc} mg F/mL = ${roundTo(ptdMg / conc, 2)} mL`,
        `ตอบทศนิยม 1 ตำแหน่ง ≈ ${ans} mL (ระดับนี้ต้องรีบให้ Calcium + ส่ง ER ทันที)`,
      ],
      pitfall: 'จำตัวเลขความเข้มข้น F⁻ อิสระให้แม่น: 1.23% APF = 12,300 ppm = 12.3 mg F/mL, ส่วน 5% NaF Varnish = 22,600 ppm = 22.6 mg F/mL (ไม่ใช้ 50 mg/mL เพราะ NaF มีส่วนที่เป็น F อยู่ 45.2%!)',
      reference: 'AAPD Policy on Use of Fluoride & Whitford GM (PTD = 5 mg F/kg)',
    };
  }

  if (variant === 1) {
    // Toothpaste F ingestion -> PTD mg check
    const weight = pickRandom([10, 12, 15, 18, 20]);
    const ppm = pickRandom([1000, 1500]);
    const mgFPerGram = ppm / 1000;
    const ptdMg = weight * 5;
    const ans = roundTo(ptdMg / mgFPerGram, 1);
    return {
      domain: 'pediatric_pharma',
      title: `เผลอกินยาสีฟัน ${ppm} ppm (PTD ปริมาณกรัม)`,
      badge: 'Home Fluoride Safety',
      topicId: 'Pedo-Fluoride-Toxicology',
      unit: 'กรัม (g)',
      hint: '1,000 ppm = 1.0 mg F/g; 1,500 ppm = 1.5 mg F/g; คำนวณจำนวนกรัมที่ถึง PTD (5 mg F/kg)',
      tolerance: 0.5,
      answer: ans,
      vignette: `เด็กเล็กน้ำหนัก ${weight} kg ชอบกินยาสีฟันผสมฟลูออไรด์ความเข้มข้น ${ppm} ppm ปริมาณยาสีฟันอย่างน้อยกี่ "กรัม" ที่จะเท่ากับระดับ Probable Toxic Dose (5 mg F/kg)?`,
      params: [
        { label: 'น้ำหนักเด็ก', value: `${weight} kg` },
        { label: 'ความเข้มข้นยาสีฟัน', value: `${ppm} ppm = ${mgFPerGram} mg F/g` },
        { label: 'PTD รวม', value: `${weight} × 5 = ${ptdMg} mg F` },
      ],
      steps: [
        `แปลงหน่วย ppm เป็น mg/g: ${ppm} ppm = ${ppm} mg/kg = ${mgFPerGram} mg F/g`,
        `คำนวณ PTD รวม: ${weight} kg × 5 mg/kg = ${ptdMg} mg F`,
        `ปริมาณยาสีฟัน: ${ptdMg} ÷ ${mgFPerGram} = ${ans} กรัม`,
      ],
      pitfall: 'แนวทางทันตแพทยสมาคมแห่งประเทศไทย & กรมอนามัย: เด็ก < 3 ปีใช้ยาสีฟัน 1,000–1,500 ppm เพียง "แตะพอเปียก (Smear/Rice grain 0.1 g)", อายุ 3–6 ปีใช้ "เท่าเมล็ดถั่วเขียว (Pea-sized 0.25 g)" เพื่อป้องกัน Dental Fluorosis และ PTD',
      reference: 'แนวทางใช้ฟลูออไรด์สำหรับเด็ก ทันตแพทยสมาคมแห่งประเทศไทย / AAPD',
    };
  }

  if (variant === 2) {
    // Pediatric Amoxicillin IE Prophylaxis or Therapeutic dose (mL/dose)
    const weight = pickRandom([14, 16, 18, 20, 22, 24, 28]);
    const isIE = pickRandom([true, false]);
    if (isIE) {
      const doseMg = Math.min(weight * 50, 2000);
      const ans = roundTo(doseMg / 50, 1); // 250 mg / 5 mL = 50 mg/mL
      return {
        domain: 'pediatric_pharma',
        title: 'AHA 2021 IE Prophylaxis: Amoxicillin Suspension (mL)',
        badge: 'Pediatric Pharmacology / IE',
        topicId: 'Pedo-Medically-Compromised',
        unit: 'mL',
        hint: 'Amoxicillin IE dose = 50 mg/kg (Max 2,000 mg) ก่อนทำฟัน 30–60 นาที; ขวด 250 mg/5 mL',
        tolerance: 0.2,
        answer: ans,
        vignette: `เด็กโรคหัวใจพิการแต่กำเนิดชนิดเขียวที่ยังไม่แก้ไข น้ำหนัก ${weight} kg ต้องถอนฟันน้ำนม สั่งจ่าย Amoxicillin suspension ความเข้มข้น 250 mg/5 mL เพื่อป้องกัน Infective Endocarditis ก่อนทำฟัน 30–60 นาที ต้องป้อนยาครั้งเดียวกี่ mL?`,
        params: [
          { label: 'น้ำหนักเด็ก', value: `${weight} kg` },
          { label: 'AHA 2021 IE Dose', value: '50 mg/kg (Max 2,000 mg) single dose' },
          { label: 'ความเข้มข้นน้ำเชื่อม', value: '250 mg / 5 mL (= 50 mg/mL)' },
        ],
        steps: [
          `คำนวณขนาดยา: ${weight} kg × 50 mg/kg = ${weight * 50} mg (ไม่เกินเพดานผู้ใหญ่ 2,000 mg)`,
          `ความเข้มข้นยา: 250 mg / 5 mL = 50 mg/mL`,
          `ปริมาตรที่ต้องป้อน: ${doseMg} ÷ 50 = ${ans} mL (ประมาณ ${roundTo(ans / 5, 1)} ช้อนชา)`,
        ],
        pitfall: 'AHA 2021 Update: ยกเลิก Clindamycin ในการป้องกัน IE แล้ว! หากเด็กแพ้ Penicillin ให้เปลี่ยนเป็น Cephalexin 50 mg/kg (ถ้าไม่แพ้แบบรุนแรง/Anaphylaxis) หรือ Azithromycin/Clarithromycin 15 mg/kg (Max 500 mg)',
        reference: 'AHA 2021 Scientific Statement on Prevention of Viridans Group Streptococcal Infective Endocarditis',
      };
    }
    const mgPerKgDay = 45;
    const doseMg = roundTo((weight * mgPerKgDay) / 3, 1);
    const ans = roundTo(doseMg / 50, 1);
    return {
      domain: 'pediatric_pharma',
      title: 'Amoxicillin รักษาติดเชื้อ (แบ่งวันละ 3 ครั้ง q8h)',
      badge: 'Pediatric Infection Rx',
      topicId: 'Pedo-Odontogenic-Infection',
      unit: 'mL / ครั้ง',
      hint: 'ใช้ 45 mg/kg/day แบ่ง q8h (÷ 3); ยาขวด 250 mg/5 mL ตอบเป็น mL ต่อ 1 ครั้ง (±0.2 mL)',
      tolerance: 0.2,
      answer: ans,
      vignette: `เด็กน้ำหนัก ${weight} kg มีภาวะ Facial cellulitis จากฟันผุ สั่งจ่าย Amoxicillin ขนาด 45 mg/kg/day แบ่งให้วันละ 3 ครั้ง (q8h) โดยเลือกใช้ความเข้มข้น 250 mg/5 mL จะต้องรับประทาน "ครั้งละ" กี่ mL?`,
      params: [
        { label: 'น้ำหนักเด็ก', value: `${weight} kg` },
        { label: 'Total Daily Dose', value: '45 mg/kg/day ÷ 3 doses = 15 mg/kg/dose' },
        { label: 'ความแรงน้ำเชื่อม', value: '250 mg / 5 mL (= 50 mg/mL)' },
      ],
      steps: [
        `ขนาดยาต่อวัน: ${weight} × 45 = ${weight * 45} mg/day`,
        `ขนาดยาต่อครั้ง (q8h): ${weight * 45} ÷ 3 = ${doseMg} mg/dose`,
        `คำนวณปริมาตร: ${doseMg} mg ÷ 50 mg/mL = ${ans} mL/ครั้ง`,
      ],
      pitfall: 'ตรวจเช็คเสมอว่าโจทย์ถาม "mL ต่อครั้ง (per dose)" หรือ "mL ต่อวัน (per day)" — พลาดหาร 3 คือตัวลวงอันดับ 1 ในข้อสอบเภสัชเด็ก!',
      reference: 'AAPD Guideline on Use of Antibiotic Therapy for Pediatric Dental Patients',
    };
  }

  // Paracetamol 120 mg / 5 mL syrup (15 mg/kg/dose)
  const weight = pickRandom([12, 16, 20, 24, 28]);
  const isStronger = pickRandom([true, false]);
  const concPer5 = isStronger ? 250 : 120;
  const concPerMl = concPer5 / 5;
  const doseMg = weight * 15;
  const ans = roundTo(doseMg / concPerMl, 1);
  return {
    domain: 'pediatric_pharma',
    title: `Paracetamol Syrup (${concPer5} mg/5 mL) — 15 mg/kg/dose`,
    badge: 'Pediatric Analgesic',
    topicId: 'Pedo-Behavioral-Pain',
    unit: 'mL / ครั้ง',
    hint: 'สูตรมาตรฐาน 15 mg/kg/dose (q4–6h); ตอบทศนิยม 1 ตำแหน่ง (±0.2 mL)',
    tolerance: 0.2,
    answer: ans,
    vignette: `เด็กน้ำหนัก ${weight} kg ปวดหลังถอนฟันน้ำนม สั่งจ่าย Paracetamol syrup ความเข้มข้น ${concPer5} mg/5 mL ในขนาด 15 mg/kg/dose ทุก 4–6 ชั่วโมง จะให้รับประทานครั้งละกี่ mL?`,
    params: [
      { label: 'น้ำหนักเด็ก', value: `${weight} kg` },
      { label: 'Recommended Dose', value: '15 mg/kg/dose (max 5 doses/day หรือ 75 mg/kg/day)' },
      { label: 'ความเข้มข้น', value: `${concPer5} mg / 5 mL (= ${concPerMl} mg/mL)` },
    ],
    steps: [
      `ขนาดยาต่อครั้ง: ${weight} kg × 15 mg/kg = ${doseMg} mg`,
      `หารด้วยความเข้มข้น (${concPerMl} mg/mL): ${doseMg} ÷ ${concPerMl} = ${ans} mL/ครั้ง`,
    ],
    pitfall: 'ในประเทศไทยยาน้ำพาราเซตามอลเด็กมีหลายความแรง (120 mg/5 mL vs 250 mg/5 mL) ต้องอ่านฉลากทุกครั้งเพื่อป้องกัน Hepatotoxicity (ห้ามเกิน 75 mg/kg/day ในเด็ก)',
    reference: 'Thai Pediatric Analgesic Dosing / Nelson Textbook of Pediatrics',
  };
}

function buildBiostatProblem(variantHint) {
  const variant = variantHint ?? randInt(0, 4);

  if (variant === 0 || variant === 1) {
    // Sensitivity or Specificity from crisp 2x2 table
    const askSens = variant === 0;
    const tp = pickRandom([40, 45, 72, 80, 85, 90]);
    const fn = pickRandom([10, 15, 20, 8, 5]);
    const tn = pickRandom([80, 90, 160, 170, 180]);
    const fp = pickRandom([10, 20, 30, 40]);
    const disPos = tp + fn;
    const disNeg = fp + tn;
    const rawAns = askSens ? (tp / disPos) * 100 : (tn / disNeg) * 100;
    const ans = roundTo(rawAns, 1);

    return {
      domain: 'biostat',
      title: askSens ? 'Diagnostic Screening: Sensitivity (%)' : 'Diagnostic Screening: Specificity (%)',
      badge: 'Biostatistics / 2×2 Matrix',
      topicId: 'Comm-Epidemiology-Biostat',
      unit: '%',
      hint: 'ตอบเป็นเปอร์เซ็นต์ (%) ทศนิยม 1 ตำแหน่ง (เช่น 80.0)',
      tolerance: 0.25,
      answer: ans,
      matrix: {
        tp, fp, fn, tn,
        highlightCells: askSens ? ['tp', 'fn'] : ['fp', 'tn'],
      },
      vignette: `การทดสอบคัดกรองรอยโรคก่อนมะเร็งช่องปากแบบใหม่ในกลุ่มตัวอย่าง ${disPos + disNeg} ราย เปรียบเทียบกับ Gold standard Biopsy ได้ผลดังตาราง 2×2 จงคำนวณค่า "${askSens ? 'Sensitivity (ความไว)' : 'Specificity (ความจำเพาะ)'}" เป็นร้อยละ`,
      params: [
        { label: 'TP (ป่วย + ผลบวก)', value: `${tp}` },
        { label: 'FN (ป่วย + ผลลบ)', value: `${fn}` },
        { label: 'FP (ไม่ป่วย + ผลบวก)', value: `${fp}` },
        { label: 'TN (ไม่ป่วย + ผลลบ)', value: `${tn}` },
      ],
      steps: askSens
        ? [
            `Sensitivity = โอกาสตรวจได้ผลบวก ในกลุ่มผู้ที่เป็นโรคจริง = TP / (TP + FN) × 100`,
            `แทนค่าคอลัมน์ "เป็นโรคจริง (Disease+)": ${tp} / (${tp} + ${fn}) × 100 = ${tp} / ${disPos} × 100`,
            `= ${ans}% (จำ: SnNOut — Sensitivity สูง ผลลบช่วย Rule OUT โรคได้ดี)`,
          ]
        : [
            `Specificity = โอกาสตรวจได้ผลลบ ในกลุ่มผู้ที่ไม่เป็นโรคจริง = TN / (TN + FP) × 100`,
            `แทนค่าคอลัมน์ "ไม่เป็นโรค (Disease-)": ${tn} / (${tn} + ${fp}) × 100 = ${tn} / ${disNeg} × 100`,
            `= ${ans}% (จำ: SpPIn — Specificity สูง ผลบวกช่วย Rule IN โรคได้ดี)`,
          ],
      pitfall: 'Sensitivity & Specificity ดูแนวตั้งตามสถานะโรค (Gold standard) จึงไม่เปลี่ยนตาม Prevalence! ส่วน PPV & NPV ดูแนวนอนตามผลเทสต์ จึงแปรผันตาม Prevalence เสมอ',
      reference: 'Gordis Epidemiology / Community Dentistry Biostatistics NL Review',
    };
  }

  if (variant === 2) {
    // PPV or NPV
    const askPpv = pickRandom([true, false]);
    const tp = pickRandom([45, 60, 75, 80]);
    const fp = pickRandom([15, 20, 25, 40]);
    const fn = pickRandom([10, 15, 20]);
    const tn = pickRandom([90, 110, 140, 180]);
    const testPos = tp + fp;
    const testNeg = fn + tn;
    const rawAns = askPpv ? (tp / testPos) * 100 : (tn / testNeg) * 100;
    const ans = roundTo(rawAns, 1);

    return {
      domain: 'biostat',
      title: `Predictive Value: ${askPpv ? 'PPV (%)' : 'NPV (%)'}`,
      badge: 'Screening Interpretation',
      topicId: 'Comm-Epidemiology-Biostat',
      unit: '%',
      hint: 'ตอบเป็นเปอร์เซ็นต์ (%) ทศนิยม 1 ตำแหน่ง',
      tolerance: 0.25,
      answer: ans,
      matrix: {
        tp, fp, fn, tn,
        highlightCells: askPpv ? ['tp', 'fp'] : ['fn', 'tn'],
      },
      vignette: `จากตารางผลตรวจคัดกรองฟันผุระยะเริ่มต้นด้วย Laser fluorescence เทียบกับ Histopathology จงคำนวณค่า ${askPpv ? 'Positive Predictive Value (PPV)' : 'Negative Predictive Value (NPV)'} เป็นร้อยละ`,
      params: [
        { label: 'ผลเทสต์บวก (Test+)', value: `${testPos} (TP=${tp}, FP=${fp})` },
        { label: 'ผลเทสต์ลบ (Test-)', value: `${testNeg} (FN=${fn}, TN=${tn})` },
      ],
      steps: askPpv
        ? [
            `PPV = สัดส่วนที่ป่วยจริงในกลุ่มที่ผลเทสต์บวก (แถวบน) = TP / (TP + FP) × 100`,
            `แทนค่า: ${tp} / (${tp} + ${fp}) × 100 = ${tp} / ${testPos} × 100 = ${ans}%`,
          ]
        : [
            `NPV = สัดส่วนที่ไม่ป่วยจริงในกลุ่มที่ผลเทสต์ลบ (แถวล่าง) = TN / (TN + FN) × 100`,
            `แทนค่า: ${tn} / (${tn} + ${fn}) × 100 = ${tn} / ${testNeg} × 100 = ${ans}%`,
          ],
      pitfall: 'เมื่อความชุกโรค (Prevalence) ในชุมชนเพิ่มสูงขึ้น → PPV จะเพิ่มขึ้น แต่ NPV จะลดลง! ในชุมชนที่โรคหายาก แม้เทสต์ดีมาก PPV อาจต่ำได้',
      reference: 'Gordis Epidemiology 6th Ed. Ch.5',
    };
  }

  if (variant === 3) {
    // Odds Ratio (Case-Control)
    const a = pickRandom([40, 45, 60, 30]);
    const b = pickRandom([10, 15, 20]);
    const c = pickRandom([20, 25, 30]);
    const d = pickRandom([60, 80, 90]);
    const ans = roundTo((a * d) / (b * c), 2);
    return {
      domain: 'biostat',
      title: 'Case-Control Study: Odds Ratio (OR)',
      badge: 'Analytic Epidemiology',
      topicId: 'Comm-Epidemiology-Biostat',
      unit: 'เท่า (OR)',
      hint: 'OR = (a × d) / (b × c) ตอบทศนิยม 2 ตำแหน่ง (±0.05)',
      tolerance: 0.06,
      answer: ans,
      matrix: {
        tp: a, fp: b, fn: c, tn: d,
        rowLabels: ['เคี้ยวหมาก / สูบยา (Exposed+)', 'ไม่สัมผัสปัจจัย (Exposed-)'],
        colLabels: ['เป็นมะเร็งช่องปาก (Case)', 'ไม่เป็นโรค (Control)'],
        highlightCells: ['tp', 'fp', 'fn', 'tn'],
      },
      vignette: `การศึกษาแบบ Case-Control ศึกษาความสัมพันธ์ระหว่างพฤติกรรมเคี้ยวหมากกับมะเร็งช่องปาก ได้ข้อมูล Exposed+ ในกลุ่ม Case = ${a} และ Control = ${b}; ส่วน Exposed- ในกลุ่ม Case = ${c} และ Control = ${d} จงคำนวณค่า Odds Ratio (OR)`,
      params: [
        { label: 'a (Exposed Case)', value: `${a}` },
        { label: 'b (Exposed Control)', value: `${b}` },
        { label: 'c (Unexposed Case)', value: `${c}` },
        { label: 'd (Unexposed Control)', value: `${d}` },
      ],
      steps: [
        `Case-Control Study ไม่สามารถคำนวณ Incidence/Relative Risk โดยตรงได้ จึงใช้ Odds Ratio (OR)`,
        `สูตร Cross-product: OR = (a × d) ÷ (b × c)`,
        `แทนค่า: (${a} × ${d}) ÷ (${b} × ${c}) = ${a * d} ÷ ${b * c} = ${ans}`,
      ],
      pitfall: 'ห้ามตอบ Relative Risk (RR) กับงานวิจัย Case-Control! Cohort & RCT ใช้ RR ส่วน Case-Control ใช้ OR เสมอ',
      reference: 'Gordis Epidemiology / Community Dentistry NL Study Design',
    };
  }

  // NNT (Number Needed to Treat) from ARR
  const cer = pickRandom([25, 30, 40, 50]); // Control caries incidence %
  const eer = pickRandom([10, 15, 20]); // Fluoride varnish incidence %
  const arr = cer - eer;
  const exactNnt = 100 / arr;
  const ans = Math.ceil(exactNnt);
  return {
    domain: 'biostat',
    title: 'Preventive RCT: Number Needed to Treat (NNT)',
    badge: 'Evidence-Based Dentistry (EBD)',
    topicId: 'Comm-Epidemiology-Biostat',
    unit: 'คน (ปัดขึ้น)',
    hint: 'NNT = 1 / ARR (หรือ 100 / ARR%) มักปัดขึ้นเป็นจำนวนเต็มคน (Ceil)',
    tolerance: 0.5,
    answer: ans,
    vignette: `การทดลอง RCT เปรียบเทียบการทา Fluoride Varnish ทุก 6 เดือน เทียบกับกลุ่มควบคุม พบว่าอัตราการเกิดฟันผุใหม่ในกลุ่มควบคุม (CER) = ${cer}% และในกลุ่มทา Varnish (EER) = ${eer}% ต้องให้การรักษาเด็กกี่คนจึงจะป้องกันฟันผุได้ 1 คน (NNT)?`,
    params: [
      { label: 'Control Event Rate (CER)', value: `${cer}% (${cer / 100})` },
      { label: 'Experimental Event Rate (EER)', value: `${eer}% (${eer / 100})` },
      { label: 'Absolute Risk Reduction (ARR)', value: `${cer}% - ${eer}% = ${arr}%` },
    ],
    steps: [
      `คำนวณ Absolute Risk Reduction (ARR) = CER − EER = ${cer}% − ${eer}% = ${arr}% (หรือ ${(arr / 100).toFixed(2)})`,
      `คำนวณ NNT = 1 ÷ ARR = 100 ÷ ${arr} = ${roundTo(exactNnt, 2)} คน`,
      `ปัดขึ้นเป็นจำนวนเต็มคน → NNT = ${ans} คน (ยิ่ง NNT น้อย ยิ่งคุ้มค่าทางคลินิก!)`,
    ],
    pitfall: 'อย่าสับสน ARR กับ RRR (Relative Risk Reduction = ARR/CER)! สูตร NNT = 1 / ARR เท่านั้น ห้ามเอา 1 / RRR มาใช้เด็ดขาด',
    reference: 'Evidence-Based Dentistry (EBD) & Guyatt Users’ Guides to Medical Literature',
  };
}

function buildPerioOrthoProblem(variantHint) {
  const variant = variantHint ?? randInt(0, 3);

  if (variant === 0) {
    // Periodontal CAL
    const pd = pickRandom([4, 5, 6, 7, 8]);
    const isHyperplasia = pickRandom([true, false]);
    const offset = randInt(1, 3);
    const ans = isHyperplasia ? pd - offset : pd + offset;
    return {
      domain: 'perio_ortho',
      title: 'Periodontal Diagnosis: Clinical Attachment Level (CAL)',
      badge: 'Periodontology Charting',
      topicId: 'Perio-Diagnosis-Classification',
      unit: 'mm',
      hint: 'คำนวณการสูญเสียการยึดเกาะทางคลินิกจาก CEJ ถึงก้นร่องลึกปริทันต์ (mm)',
      tolerance: 0,
      answer: ans,
      vignette: `ตรวจปริทันต์ฟันกรามล่างซี่ #36 ด้าน Buccal พบ Probing Depth (PD) = ${pd} mm และพบตำแหน่งขอบเหงือก (Gingival Margin) ${
        isHyperplasia
          ? `บวมโตคลุมขึ้นมาสูงกว่า (Coronal to) เส้น CEJ อยู่ ${offset} mm`
          : `ร่นลงต่ำกว่า (Apical to) เส้น CEJ ลงไป ${offset} mm (Recession)`
      } ค่า Clinical Attachment Loss (CAL) ตำแหน่งนี้เท่ากับกี่ mm?`,
      params: [
        { label: 'Probing Depth (PD)', value: `${pd} mm` },
        { label: 'ตำแหน่ง Gingival Margin vs CEJ', value: isHyperplasia ? `Coronal ต่อ CEJ ${offset} mm (เหงือกบวม)` : `Apical ต่อ CEJ ${offset} mm (เหงือกร่น)` },
      ],
      steps: isHyperplasia
        ? [
            `เมื่อขอบเหงือกอยู่สูงกว่า CEJ (Gingival overgrowth/Pseudopocket) ระยะที่วัด PD จึงรวมความสูงเหงือกที่เกิน CEJ ไปด้วย`,
            `สูตร: CAL = PD − (ระยะที่ขอบเหงือกอยู่เหนือ CEJ)`,
            `แทนค่า: ${pd} − ${offset} = ${ans} mm`,
          ]
        : [
            `เมื่อขอบเหงือกร่นลงต่ำกว่า CEJ (Gingival recession) การสูญเสียการยึดเกาะจริงต้องบวกระยะร่นเข้าไปด้วย`,
            `สูตร: CAL = PD + Recession`,
            `แทนค่า: ${pd} + ${offset} = ${ans} mm (ตามเกณฑ์ 2017 World Workshop: ถ้า CAL ≥ 5 mm จัดเป็น Stage III/IV)`,
          ],
      pitfall: 'หากตรวจไม่พบ CEJ หรือลืมบวก Recession ในผู้ป่วยเหงือกร่น จะทำให้ประเมิน Staging ของ Periodontitis (2017 Classification) ต่ำกว่าความเป็นจริง!',
      reference: 'Carranza Clinical Periodontology & 2017 AAP/EFP Periodontitis Classification',
    };
  }

  if (variant === 1) {
    // Crown lengthening bone removal
    const currentMarginToCrest = pickRandom([1.0, 1.5, 2.0]);
    const needFerrule = pickRandom([1.5, 2.0]);
    const requiredTotal = roundTo(2.0 + needFerrule, 1); // Biologic width (STA 2.0 mm) + Ferrule (subgingival finish line stated cleanly in vignette)
    const extraRemoval = roundTo(requiredTotal - currentMarginToCrest, 1);
    return {
      domain: 'perio_ortho',
      title: 'Surgical Crown Lengthening: ปริมาณกระดูกที่ต้องกรอออกเพิ่ม',
      badge: 'Perio-Prostho Interface',
      topicId: 'Perio-Crown-Lengthening',
      unit: 'mm',
      hint: 'ใช้ Biologic width (STA) = 2.0 mm + Ferrule ที่โจทย์กำหนด (ไม่นับรวม Sulcus) ตอบทศนิยม 1 ตำแหน่ง',
      tolerance: 0.1,
      answer: extraRemoval,
      vignette: `ฟันกรามน้อยบน #15 แตกหักใต้เหงือกหลังรักษารากฟัน ตรวจทางคลินิกและภาพรังสีพบระยะจากขอบฟันแข็งแรงที่เหลืออยู่จนถึงสันกระดูกเบ้าฟันเดิม (Alveolar crest) = ${currentMarginToCrest.toFixed(1)} mm ทันตแพทย์ต้องการวางขอบครอบฟัน (Crown margin) เหนือสันกระดูกให้มี Biologic width (STA = 2.0 mm) ร่วมกับ Ferrule effect ${needFerrule.toFixed(1)} mm จะต้องกรอลดระดับกระดูกเบ้าฟันลงไปอีกอย่างน้อยกี่ mm?`,
      params: [
        { label: 'ระยะเหลือปัจจุบันถึง Crest', value: `${currentMarginToCrest.toFixed(1)} mm` },
        { label: 'Supracrestal Tissue Attachment (STA)', value: '2.0 mm (JE 1 mm + CT 1 mm)' },
        { label: 'Ferrule Effect ที่ต้องการ', value: `${needFerrule.toFixed(1)} mm` },
      ],
      steps: [
        `คำนวณระยะเหนือสันกระดูกรวมขั้นต่ำที่ต้องการ: Biologic width (2.0 mm) + Ferrule (${needFerrule.toFixed(1)} mm) = ${requiredTotal.toFixed(1)} mm`,
        `หักด้วยระยะที่เหลืออยู่แล้วในปัจจุบัน (${currentMarginToCrest.toFixed(1)} mm)`,
        `กระดูกที่ต้องกรอเพิ่ม (Ostectomy): ${requiredTotal.toFixed(1)} − ${currentMarginToCrest.toFixed(1)} = ${extraRemoval.toFixed(1)} mm`,
      ],
      pitfall: 'หากไม่กรอกระดูกเพื่อรักษา Biologic width (STA 2.0 mm) จะเกิดการอักเสบเรื้อรัง เหงือกบวมเลือดออก หรือกระดูกละลายตัวตามมา (Biologic width violation)',
      reference: 'Rosenstiel Contemporary Fixed Prosthodontics / Gargiulo (2.04 mm STA)',
    };
  }

  if (variant === 2) {
    // Tanaka-Johnston Mixed Dentition Space Analysis
    const sumLi = pickRandom([21.0, 22.0, 22.4, 23.0, 24.0, 24.6, 25.0]);
    const isUpper = pickRandom([true, false]);
    const addConst = isUpper ? 11.0 : 10.5;
    const ans = roundTo(sumLi / 2 + addConst, 2);
    return {
      domain: 'perio_ortho',
      title: `Tanaka-Johnston Analysis (${isUpper ? 'ขากรรไกรบน' : 'ขากรรไกรล่าง'})`,
      badge: 'Orthodontics / Mixed Dentition',
      topicId: 'Ortho-Space-Analysis',
      unit: 'mm / ข้าง',
      hint: 'ใช้สูตร (Σ ความกว้าง 4 ฟันตัดล่าง ÷ 2) + ค่าคงที่ (บน +11.0 / ล่าง +10.5) ตอบเป็น mm/ข้าง',
      tolerance: 0.1,
      answer: ans,
      vignette: `ผู้ป่วยเด็กชุดฟันผสม วัดผลรวมความกว้าง M-D ของฟันตัดแท้ล่าง 4 ซี่ (Σ Mandibular incisors) ได้ ${sumLi.toFixed(1)} mm จงใช้สูตร Tanaka-Johnston ทำนายความกว้างรวมของฟันเขี้ยวและฟันกรามน้อยที่ยังไม่ขึ้น (C + P1 + P2) ต่อ 1 ข้างใน "${isUpper ? 'ขากรรไกรบน' : 'ขากรรไกรล่าง'}"`,
      params: [
        { label: 'ผลรวมฟันตัดแท้ล่าง 4 ซี่', value: `${sumLi.toFixed(1)} mm` },
        { label: 'ขากรรไกรเป้าหมาย', value: isUpper ? 'Maxillary (+11.0 mm)' : 'Mandibular (+10.5 mm)' },
      ],
      steps: [
        `สูตร Tanaka-Johnston ใช้ความกว้างฟันตัดล่าง 4 ซี่เสมอ ไม่ว่าทำนายบนหรือล่าง!`,
        `ค่าครึ่งหนึ่ง: ${sumLi.toFixed(1)} ÷ 2 = ${(sumLi / 2).toFixed(2)} mm`,
        `บวกค่าคงที่สำหรับ${isUpper ? 'ขากรรไกรบน (+11.0)' : 'ขากรรไกรล่าง (+10.5)'}: ${(sumLi / 2).toFixed(2)} + ${addConst.toFixed(1)} = ${ans} mm/ข้าง`,
      ],
      pitfall: 'ตัวลวงสุดคลาสสิก: เมื่อโจทย์ถามทำนายฟันบน มักแถมความกว้างฟันตัด "บน" มาให้หลงเอาไปหาร 2 — สูตร Tanaka-Johnston & Moyers ใช้ฟันตัด "ล่าง" 4 ซี่เป็นตัวตั้งเสมอ! (จำง่าย: บน 11.0 / ล่าง 10.5)',
      reference: 'Proffit WR. Contemporary Orthodontics, 6th Ed. Ch.6',
    };
  }

  // Bolton Anterior Ratio
  const max6 = pickRandom([44.0, 45.0, 46.0, 48.0, 50.0]);
  const mand6 = pickRandom([34.0, 36.0, 38.0, 39.0, 40.0]);
  const ans = roundTo((mand6 / max6) * 100, 1);
  const interp =
    ans > 78.85
      ? 'ค่า > 77.2% (สูงเกินเกณฑ์ ±1.65%) → มี Mandibular Anterior Excess (ฟันหน้าล่างใหญ่เกิน/บนเล็ก)'
      : ans < 75.55
      ? 'ค่า < 77.2% (ต่ำกว่าเกณฑ์ ±1.65%) → มี Maxillary Anterior Excess (ฟันหน้าบนกว้างเกิน)'
      : 'อยู่ในเกณฑ์ปกติ (77.2% ± 1.65%)';
  return {
    domain: 'perio_ortho',
    title: 'Bolton Anterior Ratio (Tooth Size Discrepancy)',
    badge: 'Orthodontics / Diagnostics',
    topicId: 'Ortho-Space-Analysis',
    unit: '%',
    hint: 'สูตร (Mandibular 6 ÷ Maxillary 6) × 100 ตอบเป็น % ทศนิยม 1 ตำแหน่ง (±0.2%)',
    tolerance: 0.25,
    answer: ans,
    vignette: `วัดผลรวมความกว้างฟันหน้า 6 ซี่ (Canine-to-Canine) ในผู้ป่วยจัดฟัน พบฟันหน้าบนรวม (Maxillary 6) = ${max6.toFixed(1)} mm และฟันหน้าล่างรวม (Mandibular 6) = ${mand6.toFixed(1)} mm จงคำนวณค่า Bolton Anterior Ratio เป็นร้อยละ`,
    params: [
      { label: 'Maxillary Anterior 6', value: `${max6.toFixed(1)} mm` },
      { label: 'Mandibular Anterior 6', value: `${mand6.toFixed(1)} mm` },
      { label: 'Normal Mean ± SD', value: '77.2% ± 1.65%' },
    ],
    steps: [
      `Bolton Anterior Ratio = (ผลรวม 6 ซี่ล่าง ÷ ผลรวม 6 ซี่บน) × 100`,
      `แทนค่า: (${mand6.toFixed(1)} ÷ ${max6.toFixed(1)}) × 100 = ${ans}%`,
      `การแปลผล: ${interp}`,
    ],
    pitfall: 'ตัวตั้งเป็น "ล่าง (Mandibular)" หารด้วย "บน (Maxillary)" เสมอ! ค่ามาตรฐาน Anterior = 77.2%, Overall (12 ซี่) = 91.3%',
    reference: 'Proffit WR. Contemporary Orthodontics, 6th Ed. (Bolton Analysis)',
  };
}

function generateProblem(domain) {
  const chosenDomain =
    domain === 'all'
      ? pickRandom(['anesthesia', 'pediatric_pharma', 'biostat', 'perio_ortho'])
      : domain;
  if (chosenDomain === 'anesthesia') return buildAnesthesiaProblem();
  if (chosenDomain === 'pediatric_pharma') return buildPediatricPharmaProblem();
  if (chosenDomain === 'biostat') return buildBiostatProblem();
  return buildPerioOrthoProblem();
}

const FORMULA_CHEAT_SHEET = [
  {
    title: '💉 Local Anesthesia MRD (1 หลอด = 1.8 mL)',
    color: '#38bdf8',
    rows: [
      '2% Lidocaine w/ Epi: 7.0 mg/kg (Max 500 mg) · 36 mg/หลอด',
      '4% Articaine w/ Epi: 7.0 mg/kg · 72 mg/หลอด (ระวังพิษสูง 2×)',
      '3% Mepivacaine Plain: 6.6 mg/kg (Max 400 mg) · 54 mg/หลอด',
      'Cardiac / CVD Patient Epinephrine Cap: ≤ 0.04 mg/visit (~2 หลอดของ 1:100k)',
    ],
  },
  {
    title: '🧪 Fluoride PTD & Pediatric Drugs',
    color: '#ec4899',
    rows: [
      'Probable Toxic Dose (PTD) = 5 mg F⁻/kg → ส่ง ER + ให้ Calcium ทันที',
      '1.23% APF Gel = 12.3 mg F/mL · 5% NaF Varnish = 22.6 mg F/mL',
      'Amoxicillin IE Prophylaxis (AHA 2021): 50 mg/kg (Max 2 g) 30–60 นาทีก่อนทำ',
      'Paracetamol: 15 mg/kg/dose q4–6h (Max 75 mg/kg/day)',
    ],
  },
  {
    title: '📊 Community Biostatistics (2×2)',
    color: '#10b981',
    rows: [
      'Sensitivity = TP/(TP+FN) [SnNOut] · Specificity = TN/(TN+FP) [SpPIn]',
      'PPV = TP/(TP+FP) · NPV = TN/(TN+FN) [เปลี่ยนตาม Prevalence]',
      'Case-Control: OR = (a×d)/(b×c) · RCT Impact: NNT = 1 / (CER − EER)',
    ],
  },
  {
    title: '📐 Perio, Prostho & Orthodontics',
    color: '#f59e0b',
    rows: [
      'CAL = PD + Recession (หรือ PD − Coronal Gingival Overgrowth)',
      'Crown Margin Space: STA/Biologic width (2.0 mm) + Sulcus (1.0 mm) + Ferrule (1.5–2.0 mm)',
      'Tanaka-Johnston (ต่อข้าง): บน = (Σ4LI/2) + 11.0 mm · ล่าง = (Σ4LI/2) + 10.5 mm',
      'Bolton: Anterior = (Mand6/Max6)×100 = 77.2% · Overall = 91.3%',
    ],
  },
];

export default function CalcSimulator({
  onOpenTopic = null,
}) {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [problem, setProblem] = useState(() => generateProblem('all'));
  const [userInput, setUserInput] = useState('');
  const [submittedResult, setSubmittedResult] = useState(null); // { isCorrect, numericVal }
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Session counters
  const [stats, setStats] = useState({ attempted: 0, correct: 0, streak: 0, bestStreak: 0 });

  const accuracyPct = useMemo(
    () => (stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0),
    [stats]
  );

  const handleSelectDomain = (dom) => {
    setSelectedDomain(dom);
    setProblem(generateProblem(dom));
    setUserInput('');
    setSubmittedResult(null);
  };

  const handleNewCase = () => {
    setProblem(generateProblem(selectedDomain));
    setUserInput('');
    setSubmittedResult(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submittedResult) return;
    const cleaned = String(userInput).replace(/,/g, '').trim();
    const numericVal = Number.parseFloat(cleaned);
    if (!Number.isFinite(numericVal)) return;

    const diff = Math.abs(numericVal - problem.answer);
    const isCorrect = diff <= (problem.tolerance ?? 0.01);
    setSubmittedResult({ isCorrect, numericVal });

    setStats((prev) => {
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      return {
        attempted: prev.attempted + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        streak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
      };
    });
  };

  const domMeta = DOMAIN_META[problem.domain] || DOMAIN_META.all;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* Top Header & Stats Strip */}
      <div
        className="card"
        style={{
          padding: '1.1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(56,189,248,0.06))',
          border: '1px solid rgba(56,189,248,0.28)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'rgba(56,189,248,0.16)',
              border: '1px solid rgba(56,189,248,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0,
            }}
          >
            <Calculator size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
              🧮 ห้องฝึกคำนวณคลินิกแบบสุ่มตัวเลข (Interactive NL Calculation Lab)
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-sub)' }}>
              สุ่มน้ำหนัก-ค่าแล็บใหม่ทุกครั้ง ฝึกตั้งสมการ MRD, ฟลูออไรด์ PTD, สถิติ 2×2, CAL และ Tanaka-Johnston จนแม่นมือ
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Target size={14} style={{ color: '#10b981' }} />
            <span style={{ color: 'var(--text-sub)' }}>แม่นยำ:</span>
            <strong style={{ color: '#34d399' }}>
              {stats.correct}/{stats.attempted} ({accuracyPct}%)
            </strong>
          </div>

          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              background: stats.streak >= 3 ? 'rgba(245,158,11,0.14)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${stats.streak >= 3 ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Flame size={14} style={{ color: '#fbbf24' }} />
            <span style={{ color: 'var(--text-sub)' }}>Streak:</span>
            <strong style={{ color: '#fbbf24' }}>{stats.streak}</strong>
          </div>

          <button
            type="button"
            onClick={() => setShowCheatSheet((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: showCheatSheet ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.05)',
              color: showCheatSheet ? '#a5b4fc' : 'var(--text)',
              border: `1px solid ${showCheatSheet ? 'rgba(99,102,241,0.45)' : 'var(--border)'}`,
            }}
          >
            📐 สูตรมาตรฐาน NL
            {showCheatSheet ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Collapsible Formula Cheat Sheet */}
      {showCheatSheet && (
        <div
          className="card"
          style={{
            padding: '1rem 1.15rem',
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.85rem',
          }}
        >
          {FORMULA_CHEAT_SHEET.map((sec) => (
            <div
              key={sec.title}
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                borderLeft: `3px solid ${sec.color}`,
              }}
            >
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: sec.color, marginBottom: '0.45rem' }}>
                {sec.title}
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.77rem', color: 'var(--text-sub)', lineHeight: 1.45 }}>
                {sec.rows.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Domain Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {Object.entries(DOMAIN_META).map(([key, meta]) => {
          const active = selectedDomain === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectDomain(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: active ? 800 : 600,
                cursor: 'pointer',
                background: active ? `${meta.color}22` : 'rgba(255,255,255,0.03)',
                color: active ? meta.color : 'var(--text-sub)',
                border: `1.5px solid ${active ? meta.color : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}
            >
              <span>{meta.icon}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Main Problem Card */}
      <div
        className="card"
        style={{
          padding: '1.35rem',
          border: `1.5px solid ${domMeta.color}44`,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.8rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: `${domMeta.color}22`,
                  color: domMeta.color,
                }}
              >
                {domMeta.icon} {problem.badge}
              </span>
            </div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>
              {problem.title}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {onOpenTopic && problem.topicId && (
              <button
                type="button"
                onClick={() => onOpenTopic(problem.topicId, 'synthesized', 'exam_topics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '9px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: 'rgba(139,92,246,0.12)',
                  color: '#c4b5fd',
                  border: '1px solid rgba(139,92,246,0.3)',
                }}
              >
                <BookOpen size={14} /> เปิดบทเรียนหัวข้อนี้
              </button>
            )}
            <button
              type="button"
              onClick={handleNewCase}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              <RefreshCw size={14} /> สุ่มตัวเลขเคสใหม่
            </button>
          </div>
        </div>

        {/* Vignette Box */}
        <div
          style={{
            padding: '1rem 1.15rem',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            fontSize: '0.96rem',
            lineHeight: 1.7,
            color: 'var(--text)',
          }}
        >
          {problem.vignette}
        </div>

        {/* Given Parameters Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.55rem' }}>
          {problem.params.map((p, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.55rem 0.8rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{p.label}</div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text)', fontWeight: 800, marginTop: '0.12rem' }}>{p.value}</div>
            </div>
          ))}
        </div>

        {/* Interactive 2x2 Matrix for Biostat Cases */}
        {problem.matrix && (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                maxWidth: '560px',
                borderCollapse: 'collapse',
                fontSize: '0.84rem',
                margin: '0.2rem 0',
                background: 'rgba(2,6,23,0.45)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <th style={{ padding: '0.55rem 0.75rem', border: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-sub)' }}>
                    2×2 Screening Matrix
                  </th>
                  <th style={{ padding: '0.55rem 0.75rem', border: '1px solid var(--border)', color: '#38bdf8' }}>
                    {problem.matrix.colLabels ? problem.matrix.colLabels[0] : 'เป็นโรคจริง (Disease+)'}
                  </th>
                  <th style={{ padding: '0.55rem 0.75rem', border: '1px solid var(--border)', color: '#94a3b8' }}>
                    {problem.matrix.colLabels ? problem.matrix.colLabels[1] : 'ไม่เป็นโรค (Disease-)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid var(--border)', fontWeight: 700, color: 'var(--text)' }}>
                    {problem.matrix.rowLabels ? problem.matrix.rowLabels[0] : 'ผลตรวจบวก (Test+)'}
                  </td>
                  <td
                    style={{
                      padding: '0.6rem 0.75rem',
                      border: '1px solid var(--border)',
                      textAlign: 'center',
                      fontWeight: 800,
                      background: problem.matrix.highlightCells.includes('tp') ? 'rgba(16,185,129,0.16)' : 'transparent',
                      color: problem.matrix.highlightCells.includes('tp') ? '#34d399' : 'var(--text)',
                    }}
                  >
                    {problem.matrix.rowLabels ? `a = ${problem.matrix.tp}` : `TP = ${problem.matrix.tp}`}
                  </td>
                  <td
                    style={{
                      padding: '0.6rem 0.75rem',
                      border: '1px solid var(--border)',
                      textAlign: 'center',
                      fontWeight: 800,
                      background: problem.matrix.highlightCells.includes('fp') ? 'rgba(16,185,129,0.16)' : 'transparent',
                      color: problem.matrix.highlightCells.includes('fp') ? '#34d399' : 'var(--text)',
                    }}
                  >
                    {problem.matrix.rowLabels ? `b = ${problem.matrix.fp}` : `FP = ${problem.matrix.fp}`}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid var(--border)', fontWeight: 700, color: 'var(--text)' }}>
                    {problem.matrix.rowLabels ? problem.matrix.rowLabels[1] : 'ผลตรวจลบ (Test-)'}
                  </td>
                  <td
                    style={{
                      padding: '0.6rem 0.75rem',
                      border: '1px solid var(--border)',
                      textAlign: 'center',
                      fontWeight: 800,
                      background: problem.matrix.highlightCells.includes('fn') ? 'rgba(16,185,129,0.16)' : 'transparent',
                      color: problem.matrix.highlightCells.includes('fn') ? '#34d399' : 'var(--text)',
                    }}
                  >
                    {problem.matrix.rowLabels ? `c = ${problem.matrix.fn}` : `FN = ${problem.matrix.fn}`}
                  </td>
                  <td
                    style={{
                      padding: '0.6rem 0.75rem',
                      border: '1px solid var(--border)',
                      textAlign: 'center',
                      fontWeight: 800,
                      background: problem.matrix.highlightCells.includes('tn') ? 'rgba(16,185,129,0.16)' : 'transparent',
                      color: problem.matrix.highlightCells.includes('tn') ? '#34d399' : 'var(--text)',
                    }}
                  >
                    {problem.matrix.rowLabels ? `d = ${problem.matrix.tn}` : `TN = ${problem.matrix.tn}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Answer Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 260px', maxWidth: '400px' }}>
            <input
              type="number"
              step="any"
              value={userInput}
              disabled={Boolean(submittedResult)}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="พิมพ์คำตอบตัวเลข..."
              style={{
                flex: 1,
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
                fontSize: '1rem',
                fontWeight: 800,
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: domMeta.color, whiteSpace: 'nowrap' }}>
              {problem.unit}
            </span>
          </div>

          {!submittedResult ? (
            <button
              type="submit"
              disabled={!userInput.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.72rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: userInput.trim() ? 'pointer' : 'not-allowed',
                border: 'none',
                background: userInput.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.08)',
                color: userInput.trim() ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              <CheckCircle2 size={17} /> ตรวจคำตอบ & ดูวิธีทำ
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNewCase}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.72rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#ffffff',
              }}
            >
              <Sparkles size={16} /> ข้อถัดไป (สุ่มเคสใหม่)
            </button>
          )}
        </form>

        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          💡 คำแนะนำการปัดเศษ: {problem.hint}
        </div>

        {/* Worked Solution & Pitfall Reveal */}
        {submittedResult && (
          <div
            style={{
              marginTop: '0.25rem',
              padding: '1.05rem 1.15rem',
              borderRadius: '12px',
              background: submittedResult.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1.5px solid ${submittedResult.isCorrect ? 'rgba(16,185,129,0.45)' : 'rgba(239,68,68,0.45)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.98rem', color: submittedResult.isCorrect ? '#34d399' : '#f87171' }}>
                {submittedResult.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                {submittedResult.isCorrect
                  ? `ถูกต้องเป๊ะ! คำตอบคือ ${problem.answer} ${problem.unit}`
                  : `คลาดเคลื่อน — คุณตอบ ${submittedResult.numericVal} แต่คำตอบมาตรฐานคือ ${problem.answer} ${problem.unit}`}
              </div>
            </div>

            <div style={{ padding: '0.75rem 0.9rem', borderRadius: '10px', background: 'rgba(2,6,23,0.4)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.45rem' }}>
                📝 วิธีคิดทีละขั้น (Step-by-Step Breakdown)
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.32rem', fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.55 }}>
                {problem.steps.map((st, idx) => (
                  <li key={idx}>{st}</li>
                ))}
              </ol>
            </div>

            <div
              style={{
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.35)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.55rem',
                fontSize: '0.81rem',
                color: '#fde68a',
                lineHeight: 1.5,
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#fbbf24' }} />
              <div>
                <strong>จุดลวงในข้อสอบ NL:</strong> {problem.pitfall}
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              📚 อ้างอิง: {problem.reference}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
