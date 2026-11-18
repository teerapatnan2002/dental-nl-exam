/**
 * Clinical Masterclass & Study Hub Data
 * 25 Comprehensive, Deep-Dive Clinical Lecture Guides across 10 Dental Specialties + Dental Law & Forensics
 * Based on official ศ.ป.ท. manual2020.pdf and Gold Standard Dental Textbooks.
 */

export const SPECIALTY_CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด (All Disciplines)', icon: '', color: '#0d9488' },
  { id: 'วิทยาเอ็นโดดอนต์', name: 'วิทยาเอ็นโดดอนต์ (Endodontics)', icon: '', color: '#e11d48' },
  { id: 'ศัลยศาสตร์ช่องปาก', name: 'ศัลยศาสตร์ช่องปาก (Oral Surgery)', icon: '', color: '#d97706' },
  { id: 'ทันตกรรมประดิษฐ์', name: 'ทันตกรรมประดิษฐ์ (Prosthodontics)', icon: '', color: '#0284c7' },
  { id: 'ปริทันตวิทยา', name: 'ปริทันตวิทยา (Periodontology)', icon: '', color: '#059669' },
  { id: 'ทันตกรรมบูรณะ/หัตถการ', name: 'ทันตกรรมบูรณะ/หัตถการ (Operative)', icon: '', color: '#0d9488' },
  { id: 'ทันตกรรมสำหรับเด็ก', name: 'ทันตกรรมสำหรับเด็ก (Pedodontics)', icon: '', color: '#0ea5e9' },
  { id: 'วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก', name: 'วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก (Oral Med & Diag)', icon: '', color: '#14b8a6' },
  { id: 'ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า', name: 'บดเคี้ยวและอาการปวดใบหน้า (Occlusion & TMD)', icon: '', color: '#0891b2' },
  { id: 'ทันตกรรมจัดฟัน', name: 'ทันตกรรมจัดฟัน (Orthodontics)', icon: '', color: '#d97706' },
  { id: 'ทันตกรรมชุมชน', name: 'ทันตกรรมชุมชน (Community & Biostat)', icon: '', color: '#059669' },
  { id: 'กฎหมายและจรรยาบรรณ', name: 'กฎหมายและจรรยาบรรณวิชาชีพ (Dental Law & Ethics)', icon: '', color: '#e11d48' }
];

export const CLINICAL_STUDY_GUIDES = {
  "Endo-Pulp-Periapical-Diagnosis": {
    "title": "การตรวจวินิจฉัยโรคของโพรงประสาทฟันและเนื้อเยื่อรอบปลายราก (AAE 2009 Consensus & AAE/ESE Draft Update)",
    "specialty": "วิทยาเอ็นโดดอนต์",
    "category": "วิทยาเอ็นโดดอนต์",
    "badgeColor": "#e11d48",
    "must_know_topics": [
      "AAE 2009 Diagnostic Terminology (เกณฑ์เฉลยข้อสอบ NL)",
      "Pulpal & Periapical Diagnosis",
      "Cold Test & EPT (A-delta vs C Fibers)",
      "อัปเดตเปรียบเทียบ: AAE/ESE Proposed Update 2025–2026"
    ],
    "overview": "การวินิจฉัยทางเอ็นโดดอนต์ตามมาตรฐาน **AAE 2009 Consensus** *(ซึ่งยังเป็นเกณฑ์หลักและแนวคำเฉลยของข้อสอบ ศ.ท.ส. / NL ปัจจุบัน)* ต้องแยก 2 แกนเสมอคือ Pulpal Diagnosis และ Periapical Diagnosis พร้อมหมายเหตุเปรียบเทียบ **ร่างแนวทางใหม่ของ AAE/ESE Joint Special Committee (2025–2026 Stakeholder Input)** เพื่อให้เข้าใจวิวัฒนาการสู่ยุค Vital Pulp Therapy และ CBCT โดยไม่สับสนเวลาตอบข้อสอบ NL",
    "core_mechanism": "1. กลไกการส่งผ่านความเจ็บปวด (Pulpal Neurophysiology):\n- **A-delta fibers**: เส้นใยประสาทมีปลอกไมอีลิน นำเร็ว (12–30 m/s) อยู่บริเวณ Coronal pulp ตอบสนองตาม Brännström's Hydrodynamic Theory ทำให้เสียวแปล๊บคมชัดและหายทันทีเมื่อเอาสิ่งกระตุ้นออก (Reversible Pulpitis)\n- **C fibers**: เส้นใยประสาทไร้ไมอีลิน นำช้า (0.5–2 m/s) ทนภาวะขาดเลือด อยู่ลึกใน Core pulp เมื่ออักเสบรุนแรง สารอักเสบ (Bradykinin, PGE2, Histamine) กระตุ้น C fibers เกิดอาการปวดลึก ตุบๆ ปวดตกค้างนาน (>10–15 วินาที) หรือปวดขึ้นเอง (Spontaneous pain) ซึ่งเป็นอาการจำเพาะของ Symptomatic Irreversible Pulpitis (SIP)\n\n2. การทดสอบความมีชีวิต & ปลายราก (AAE 2009 Standard — ใช้ตอบข้อสอบ NL):\n- **Cold Test (-26.2°C)**: แม่นยำที่สุดในการแยกความรุนแรงของการอักเสบระหว่างอาการหายเร็ว vs ปวดตกค้างนาน\n- **Electric Pulp Test (EPT)**: บอกเพียงสถานะประสาทตอบสนองได้ vs ไม่ได้ (Live vs Dead) ไม่ได้วัดเลือดมาเลี้ยง (Vascularity) และแยก Reversible vs Irreversible ไม่ได้\n- **Percussion & Palpation**: ตรวจการลุกลามเข้าสู่ PDL ปลายราก (Proprioception) เพื่อวินิจฉัย Symptomatic Apical Periodontitis / Acute Apical Abscess / Sinus tract (CAA)\n\n3. 📢 หมายเหตุอัปเดตวิชาการ — ร่างแนวทางใหม่ AAE/ESE (2025–2026 Proposed Update vs AAE 2009):\n*(⚠️ **สถานะสำคัญ:** ปัจจุบันยังเป็นร่างเปิดรับฟังความเห็น Stakeholder Input ยังไม่แทนที่ AAE 2009 ในข้อสอบ NL — เวลาสอบยังคงตอบและเฉลยตาม AAE 2009 ในตารางด้านล่างเป็นหลัก)*\n- **Table 1: Pulpal & Pulp Space Diagnoses (ใหม่)**: เปลี่ยนจากกรอบ 2 ขั้ว *Reversible vs Irreversible* มาเน้นระดับความรุนแรง + การรักษาแบบ Vital Pulp Therapy (VPT):\n  * **Clinically Normal Pulp** *(แทน Normal Pulp; รวมกรณีตอบสนองลดลงจากอายุ/Tertiary dentin/Pulp stones/เคยทำ VPT)*\n  * **Hypersensitive Pulp** *(เพิ่มใหม่)*: พัลพ์ยังปกติแต่ไวเกิน `-Secondary to:` ท่อเนื้อฟันเปิด, เหงือกร่น, หลังอุดฟัน (ปวดแรงขึ้นแต่**ไม่ตกค้าง**) → ไม่ต้องรักษาราก\n  * **Mild Pulpitis** *(แทนส่วนใหญ่ของ Reversible Pulpitis + บังคับพ่วง `-Secondary to:` Caries/Leakage/Trauma/Crack/ECR)*: พัลพ์อักเสบระยะต้นยังไม่ติดเชื้อ ปวดไม่ตกค้าง → รักษาแบบ VPT/กำจัดสาเหตุ\n  * **Severe Pulpitis** *(แทนแนวคิด Irreversible Pulpitis)*: **จุดเปลี่ยนสำคัญ!** ตัดคำว่า 'Irreversible' ออก เพื่อสะท้อนว่าแม้ปวดเอง/ปวดตกค้าง ก็ยังอาจทำ **VPT (Partial/Full Pulpotomy)** เก็บความมีชีวิตของรากฟันได้ ไม่ได้บังคับ RCT 100% เสมอไป\n  * **Inconclusive Pulp Status** *(เพิ่มใหม่)*: ผล test ขัดแย้งหรือไม่ตอบสนองหลัง Trauma/Calcification → ให้ **Monitoring** แทนการรีบ RCT\n  * **กลุ่มฟันรักษามาก่อน**: แยกชัดเจนเป็น *Previously Initiated RCT*, *Previously Obturated Root Canal*, และ *Previous Regenerative Endodontic Treatment (REP)*\n- **Table 2: Periapical Diagnoses (ใหม่)**:\n  * **Clinically Normal Apical Tissues**: รวมเกณฑ์ทั้ง **2D radiograph และ CBCT**\n  * **Apical Hypersensitivity** *(เพิ่มใหม่)*: เจ็บเคาะ/กัดแรง **จากสาเหตุที่ไม่ใช่พัลพ์** (Hyper-occlusion, Trauma, Periodontal, TMD/Neuropathic) ไม่มีเงาดำปลายราก → **ห้ามทำ RCT!**\n  * **Localized Symptomatic / Asymptomatic Apical Periodontitis** & **Localized Apical Periodontitis with Sinus Tract**: เติม *Localized* และผนวกเกณฑ์ **low-density area on CBCT**\n  * **Inconclusive Apical Condition** *(เพิ่มใหม่)*: ไม่มีอาการ แต่ภาพ 2D/CBCT ยังสรุปไม่ได้ (เช่น ไม่มีฟิล์มเก่าเทียบหลัง RCT / อยู่ระหว่าง Healing) → **Monitoring**",
    "matrix_headers": [
      "การวินิจฉัย (Diagnosis)",
      "การตอบสนองต่อ Cold Test",
      "อาการเคาะ/คลำ (Percussion/Palpation)",
      "ภาพรังสีปลายราก (Radiograph)",
      "แนวทางการรักษา (Treatment)"
    ],
    "matrix_rows": [
      [
        "Reversible Pulpitis",
        "เสียวแปล๊บ หายทันทีใน 1-2 วินาที",
        "ไม่เจ็บ (-)",
        "ปกติ หรือพบรอยผุชิดพัลพ์",
        "กำจัดสิ่งกระตุ้น, กรอผุ, อุดฟัน (Caries removal & Restoration)"
      ],
      [
        "Symptomatic Irreversible Pulpitis (SIP)",
        "ปวดแปล๊บตกค้างนาน (>10-15 วินาที) / Spontaneous pain",
        "ไม่เจ็บ หรือเจ็บเล็กน้อย",
        "ปกติ หรือ PDL หนาตัวเล็กน้อย",
        "รักษารากฟัน (Root Canal Treatment - RCT)"
      ],
      [
        "Asymptomatic Irreversible Pulpitis (AIP)",
        "ตอบสนองปกติหรือลดลง (ไม่มีอาการปวด)",
        "ไม่เจ็บ (-)",
        "พบรอยผุลึกทะลุโพรงฟัน หรือ Internal resorption",
        "รักษารากฟัน (RCT)"
      ],
      [
        "Pulp Necrosis",
        "ไม่ตอบสนองเลย (No response)",
        "ขึ้นกับสภาวะปลายรากฟัน",
        "ปกติ หรือมีเงาดำโปร่งรังสีปลายราก",
        "รักษารากฟัน (RCT) หรือ ถอนฟัน"
      ],
      [
        "Acute Apical Abscess (AAA)",
        "ไม่ตอบสนอง (Pulp necrotic)",
        "เจ็บรุนแรงมาก (+++), มีอาการบวมเฉียบพลัน",
        "มีหรือไม่มีเงาดำปลายรากก็ได้",
        "กรีดระบายหนอง (I&D) + Pulpectomy + ยาแก้ปวด (ยาฆ่าเชื้อเมื่อมีไข้หรือบวมลาม)"
      ],
      [
        "Chronic Apical Abscess (CAA)",
        "ไม่ตอบสนอง (Pulp necrotic)",
        "ไม่เจ็บ หรือเจ็บเล็กน้อย, มี Sinus tract ระบายหนอง",
        "มีเงาดำโปร่งรังสีปลายรากชัดเจน",
        "ทำ GP Tracing หาซี่ต้นเหตุ + RCT (ไม่ต้องให้ยาปฏิชีวนะ)"
      ]
    ],
    "pitfalls": [
      "กับดักที่ 1: ข้อสอบมักลวงว่า \"พบเงาดำที่ปลายรากฟัน และเคาะเจ็บ จึงวินิจฉัยว่าฟันซี่นั้นเป็น Pulp Necrosis เสมอ\" -> คำตอบที่ถูกต้องคือ ต้องดูผล Vitality test ประกอบเสมอ หากฟันยังตอบสนองต่อ Cold test แสดงว่าเป็น Vital tooth รอยโรคปลายรากอาจเป็น Cementoma (PCOD) ระยะแรก หรือ Trauma ซึ่งห้ามรักษารากฟันเด็ดขาด!",
      "กับดักที่ 2: Chronic Apical Abscess มีตุ่มหนอง (Sinus tract) ระบายความดันออกตลอดเวลา คนไข้จึงมัก \"ไม่มีอาการปวด\" ห้ามจ่ายยาปฏิชีวนะเด็ดขาด ให้รักษารากฟันแล้วตุ่มหนองจะยุบเองภายใน 7-14 วัน",
      "กับดักศัพท์ใหม่ vs ข้อสอบ NL: แม้ร่างใหม่ AAE/ESE (2025–2026) จะเริ่มใช้คำว่า Mild Pulpitis / Severe Pulpitis / Apical Hypersensitivity / Inconclusive แต่**ข้อสอบ ศ.ท.ส. (NL) ปัจจุบันยังคงออกและเฉลยตาม AAE 2009** (Reversible / SIP / AIP / SAP / AAP / AAA / CAA) อย่าสับสนเวลาเลือกช้อยส์!"
    ],
    "pearl": "แกนเฉลย NL (AAE 2009): Cold ตกค้าง + เคาะเจ็บ + มีเงาดำ = SIP with SAP | ส่วนแนวทางใหม่ AAE/ESE (2025–2026 Draft) เปลี่ยนกรอบเป็น Mild/Severe Pulpitis (รองรับ VPT แม้ใน Severe) + เพิ่ม Hypersensitive Pulp, Apical Hypersensitivity (ไม่ใช่พัลพ์ ห้าม RCT!) และ Inconclusive (ให้เฝ้าติดตาม)",
    "reference": "Hargreaves KM, Berman LH. Cohen's Pathways of the Pulp, 12th ed. Elsevier, 2021 (AAE 2009 Consensus Terminology — มาตรฐานเฉลยข้อสอบ NL); ข้อมูลวิชาการเพิ่มเติม: AAE & ESE Joint Special Committee on Diagnostic Terminology — Proposed Update & Stakeholder Input (2025–2026).",
    "decision_matrix": [
      {
        "col_0": "Reversible Pulpitis",
        "col_1": "เสียวแปล๊บ หายทันทีใน 1-2 วินาที",
        "col_2": "ไม่เจ็บ (-)",
        "col_3": "ปกติ หรือพบรอยผุชิดพัลพ์",
        "col_4": "กำจัดสิ่งกระตุ้น, กรอผุ, อุดฟัน (Caries removal & Restoration)"
      },
      {
        "col_0": "Symptomatic Irreversible Pulpitis (SIP)",
        "col_1": "ปวดแปล๊บตกค้างนาน (>10-15 วินาที) / Spontaneous pain",
        "col_2": "ไม่เจ็บ หรือเจ็บเล็กน้อย",
        "col_3": "ปกติ หรือ PDL หนาตัวเล็กน้อย",
        "col_4": "รักษารากฟัน (Root Canal Treatment - RCT)"
      },
      {
        "col_0": "Asymptomatic Irreversible Pulpitis (AIP)",
        "col_1": "ตอบสนองปกติหรือลดลง (ไม่มีอาการปวด)",
        "col_2": "ไม่เจ็บ (-)",
        "col_3": "พบรอยผุลึกทะลุโพรงฟัน หรือ Internal resorption",
        "col_4": "รักษารากฟัน (RCT)"
      },
      {
        "col_0": "Pulp Necrosis",
        "col_1": "ไม่ตอบสนองเลย (No response)",
        "col_2": "ขึ้นกับสภาวะปลายรากฟัน",
        "col_3": "ปกติ หรือมีเงาดำโปร่งรังสีปลายราก",
        "col_4": "รักษารากฟัน (RCT) หรือ ถอนฟัน"
      },
      {
        "col_0": "Acute Apical Abscess (AAA)",
        "col_1": "ไม่ตอบสนอง (Pulp necrotic)",
        "col_2": "เจ็บรุนแรงมาก (+++), มีอาการบวมเฉียบพลัน",
        "col_3": "มีหรือไม่มีเงาดำปลายรากก็ได้",
        "col_4": "กรีดระบายหนอง (I&D) + Pulpectomy + ยาแก้ปวด (ยาฆ่าเชื้อเมื่อมีไข้หรือบวมลาม)"
      },
      {
        "col_0": "Chronic Apical Abscess (CAA)",
        "col_1": "ไม่ตอบสนอง (Pulp necrotic)",
        "col_2": "ไม่เจ็บ หรือเจ็บเล็กน้อย, มี Sinus tract ระบายหนอง",
        "col_3": "มีเงาดำโปร่งรังสีปลายรากชัดเจน",
        "col_4": "ทำ GP Tracing หาซี่ต้นเหตุ + RCT (ไม่ต้องให้ยาปฏิชีวนะ)"
      }
    ]
  },
  "Endo-Vital-Pulp-Therapy": {
    "title": "การบำบัดรักษาโพรงประสาทฟันที่มีชีวิตและการจัดการปลายรากเปิด (VPT & Apexogenesis)",
    "specialty": "วิทยาเอ็นโดดอนต์",
    "category": "วิทยาเอ็นโดดอนต์",
    "badgeColor": "#e11d48",
    "must_know_topics": [
      "VPT",
      "Apexogenesis",
      "Apexification",
      "Cvek Pulpotomy",
      "MTA"
    ],
    "overview": "แนวทางชีวภาพสมัยใหม่ (Biologic & Minimally Invasive Endodontics) มุ่งเน้นการรักษาความมีชีวิตของเนื้อเยื่อใน (Vital Pulp Preservation) โดยเฉพาะในฟันแท้ที่ปลายรากยังเปิดอยู่ (Immature Permanent Teeth) เพื่อให้กระบวนการสร้างรากฟันดำเนินต่อไปได้สมบูรณ์ (Apexogenesis)",
    "core_mechanism": "1. Vital Pulp Therapy (VPT) Modalities:\n- **Indirect Pulp Capping (IPC)**: กรอผุโดยเหลือเนื้อฟันส่วนผุที่ได้รับผลกระทบ (Affected dentin) ไว้บางๆ เหนือพัลพ์ เพื่อป้องกันการทะลุโพรงประสาทในฟันที่ไม่มีอาการของ SIP แล้วรองพื้นด้วย Calcium Silicate (Biodentine/MTA) หรือ RMGIC\n- **Direct Pulp Capping (DPC)**: วางวัสดุชีวภาพลงบนจุดที่ทะลุพัลพ์โดยตรง ข้อบ่งชี้เฉพาะ: จุดทะลุเล็ก (<1 มม.), ทะลุจาก Mechanical exposure หรือ Trauma สด (<24 ชม.), ห้ามทำใน carious exposure ของฟันน้ำนม\n- **Cvek Partial Pulpotomy**: ตัดเนื้อเยื่อโพรงประสาทส่วนบนที่อักเสบออกลึก 1-2 มม. ด้วย Diamond bur ความเร็วสูงพร้อมน้ำหล่อเย็น แล้วห้ามเลือดด้วย 2.5-5% NaOCl เป็นเวลาไม่เกิน 5-10 นาที หากหยุดเลือดได้ถือว่าเนื้อเยื่อส่วนล่างยังแข็งแรงดี จากนั้นวาง MTA/Biodentine เพื่อกระตุ้น Dentin bridge\n\n2. Apexogenesis vs Apexification vs Regenerative Endodontics (REPs):\n- **Apexogenesis**: การบำบัดโพรงประสาทฟันที่มีชีวิต (Vital pulp) ในฟันแท้ปลายรากเปิด เพื่อให้เซลล์ Odontoblast สร้างเนื้อฟันต่อ ทำให้ผนังรากหนาขึ้น (Root thickening) และรากยาวขึ้น (Root lengthening)\n- **Apexification**: ใช้ในฟันปลายรากเปิดที่เนื้อเยื่อใน \"ตายแล้ว (Necrotic pulp)\" โดยใช้ MTA ปิดกั้นปลายรากหนา 3-5 มม. (Apical MTA plug) หรือดองด้วย Ca(OH)2 ระยะยาว ผลลัพธ์: ปลายรากปิดตัน แต่รากจะไม่ยาวขึ้นและผนังรากจะไม่หนาขึ้น ฟันยังคงเสี่ยงต่อการหักง่าย\n- **Regenerative Endodontics (REPs / Revascularization)**: ใช้ในฟันปลายรากเปิดที่เนื้อเยื่อในตายแล้ว โดยล้างคลองรากฟันด้วย 1.5% NaOCl และ 17% EDTA ใส่ยาปฏิชีวนะ Tri-antibiotic paste (DAP/TAP) หรือ Ca(OH)2 นัดต่อไปกระตุ้นให้เกิดเลือดออกจากปลายราก (Evoked bleeding) นำ Stem cells of apical papilla (SCAP) เข้ามาในคลองรากฟัน มีโอกาสทำให้ผนังรากหนาขึ้นและรากยาวขึ้นได้จริง",
    "matrix_headers": [
      "มิติการเปรียบเทียบ",
      "Apexogenesis",
      "Apexification (MTA Plug)",
      "Regenerative Endodontics (REPs)"
    ],
    "matrix_rows": [
      [
        "สภาวะของโพรงประสาท (Pulp Status)",
        "มีชีวิต (Vital pulp: Cvek / Pulpotomy)",
        "ตายแล้ว (Necrotic pulp)",
        "ตายแล้ว (Necrotic pulp)"
      ],
      [
        "เป้าหมายหลักทางชีววิทยา",
        "รักษา Odontoblast ให้สร้างรากต่อตามธรรมชาติ",
        "สร้างสิ่งกีดขวางเทียมที่ปลายราก (Mechanical barrier)",
        "ดึงเซลล์ต้นกำเนิด SCAP เข้ามาสร้างเนื้อเยื่อใหม่"
      ],
      [
        "ผลลัพธ์ต่อความยาวราก (Root Length)",
        "รากยาวขึ้นสมบูรณ์ (Physiological lengthening)",
        "รากไม่ยาวขึ้น (No lengthening)",
        "มีโอกาสรากยาวขึ้นได้"
      ],
      [
        "ผลลัพธ์ต่อความหนาของผนังราก",
        "ผนังรากหนาขึ้นแข็งแรง ป้องกันรากหัก",
        "ผนังรากบางเท่าเดิม เสี่ยงต่อรากหักในอนาคต",
        "ผนังรากหนาตัวขึ้นได้ (Thickening)"
      ],
      [
        "วัสดุที่ใช้",
        "MTA / Biodentine ปิดทับพัลพ์",
        "MTA ปิดปลายรากหนา 3-5 มม. + อุดคลองราก",
        "Ca(OH)2 / TAP + Blood clot + MTA/Biodentine plug"
      ]
    ],
    "pitfalls": [
      "กับดักสำคัญ: ในฟันน้ำนมที่มี Carious pulp exposure \"ห้ามทำ Direct Pulp Capping (DPC) เด็ดขาด\" เพราะอัตราการเกิด Internal root resorption และ Chronic inflammation สูงมาก การรักษามาตรฐานคือ Pulpotomy หรือ Pulpectomy เท่านั้น",
      "สารห้ามเลือดในการทำ Pulpotomy ในฟันแท้ต้องใช้ NaOCl 2.5-5.0% ห้ามใช้ Epinephrine เม็ดกลมหรือ Ferric sulfate เพราะการหยุดเลือดด้วยกลไกทางเคมีดังกล่าวจะบดบังภาวะการอักเสบที่แท้จริงของพัลพ์"
    ],
    "pearl": "การทดสอบความสำเร็จของการทำ Cvek Pulpotomy ในคลินิก: ใช้สำลีชุบ 2.5% NaOCl กดแผลพัลพ์เบาๆ 5 นาที เลือดต้องหยุดสนิทและเห็นเนื้อเยื่อพัลพ์เป็นสีชมพู (สอดคล้องกับแนวคิด Vital Pulp Preservation ในร่าง AAE/ESE 2025–2026 ที่แม้อักเสบมาก [Severe Pulpitis] ยังอาจทำ Pulpotomy ได้; อย่างไรก็ตาม ข้อสอบ NL ยังคงเฉลยคำศัพท์วินิจฉัยตาม AAE 2009)",
    "reference": "American Association of Endodontists (AAE). Clinical Guidance: Treatment of the Open Apex. J Endod, 2021; AAE Position Statement on Vital Pulp Therapy & AAE/ESE Diagnostic Terminology Stakeholder Input (2025–2026 Draft).",
    "decision_matrix": [
      {
        "col_0": "สภาวะของโพรงประสาท (Pulp Status)",
        "col_1": "มีชีวิต (Vital pulp: Cvek / Pulpotomy)",
        "col_2": "ตายแล้ว (Necrotic pulp)",
        "col_3": "ตายแล้ว (Necrotic pulp)"
      },
      {
        "col_0": "เป้าหมายหลักทางชีววิทยา",
        "col_1": "รักษา Odontoblast ให้สร้างรากต่อตามธรรมชาติ",
        "col_2": "สร้างสิ่งกีดขวางเทียมที่ปลายราก (Mechanical barrier)",
        "col_3": "ดึงเซลล์ต้นกำเนิด SCAP เข้ามาสร้างเนื้อเยื่อใหม่"
      },
      {
        "col_0": "ผลลัพธ์ต่อความยาวราก (Root Length)",
        "col_1": "รากยาวขึ้นสมบูรณ์ (Physiological lengthening)",
        "col_2": "รากไม่ยาวขึ้น (No lengthening)",
        "col_3": "มีโอกาสรากยาวขึ้นได้"
      },
      {
        "col_0": "ผลลัพธ์ต่อความหนาของผนังราก",
        "col_1": "ผนังรากหนาขึ้นแข็งแรง ป้องกันรากหัก",
        "col_2": "ผนังรากบางเท่าเดิม เสี่ยงต่อรากหักในอนาคต",
        "col_3": "ผนังรากหนาตัวขึ้นได้ (Thickening)"
      },
      {
        "col_0": "วัสดุที่ใช้",
        "col_1": "MTA / Biodentine ปิดทับพัลพ์",
        "col_2": "MTA ปิดปลายรากหนา 3-5 มม. + อุดคลองราก",
        "col_3": "Ca(OH)2 / TAP + Blood clot + MTA/Biodentine plug"
      }
    ]
  },
  "Endo-Canal-Anatomy-Irrigants": {
    "title": "กายวิภาคคลองรากฟัน สารล้างคลองราก และอุบัติเหตุโซเดียมไฮโปคลอไรต์ (Canal Anatomy & Irrigants)",
    "specialty": "วิทยาเอ็นโดดอนต์",
    "category": "วิทยาเอ็นโดดอนต์",
    "badgeColor": "#e11d48",
    "must_know_topics": [
      "Root Canal Anatomy",
      "MB2 Canal",
      "Radix Entomolaris",
      "NaOCl Accident",
      "Irrigation Protocol"
    ],
    "overview": "ความสำเร็จในการรักษารากฟันขึ้นอยู่กับการหาคลองรากฟันให้ครบทุกคลอง (โดยเฉพาะ MB2 และ Radix) ร่วมกับการล้างทำความสะอาดด้วยสารเคมี (Chemical Debridement) เพื่อละลายเนื้อเยื่ออินทรีย์และกำจัดชั้นสเมียร์ (Smear Layer) โดยต้องระวังปฏิกิริยาระหว่างสารล้างและอุบัติเหตุ NaOCl Extrusion",
    "core_mechanism": "1. กายวิภาคและคลองรากฟันที่พบบ่อยในข้อสอบ:\n- **Maxillary 1st Molar (ฟันกรามบนแท้ซี่แรก)**: ราก Mesiobuccal (MB) มีคลองรากที่ 2 (MB2) สูงถึง 60-90% ตำแหน่ง MB2 อยู่ทางด้าน Palatal ต่อรูเปิด MB1 เล็กน้อยและเอียงไปทาง Mesial ตามแนวรอยต่อ Subpulpal groove\n- **Mandibular 1st Molar (ฟันกรามล่างแท้ซี่แรก)**: ในประชากรเอเชีย (ไทย, จีน) พบครากที่ 3 พิเศษทางด้านลิ้น (Distolingual root) เรียกว่า **Radix Entomolaris** สูงถึง 10-30% ทางเข้าคลองรากจะอยู่ค่อนไปทาง Distolingual ของพื้นโพรงประสาทฟัน\n- **Mandibular Anterior Teeth (ฟันหน้าล่าง)**: พบ 2 คลองราก (Labial & Lingual canal) ได้ถึง 30-40% ต้องกรอเปิดช่องทางเข้าโดยกำจัด Lingual shoulder ออกจึงจะส่องเห็น Lingual canal\n- **Mandibular Premolars (ฟันกรามน้อยล่าง)**: มักพบการแตกแขนงของคลองรากฟันที่ระดับกึ่งกลางราก หากเห็นคลองรากฟันในฟิล์มเอกซเรย์จางหายไปเฉียบพลัน (\"Fast-break\" phenomenon) แสดงว่าคลองรากฟันแตกแขนงออกเป็น 2 คลอง\n\n2. เภสัชเคมีของสารล้างคลองรากฟัน (Irrigant Chemistry & Interactions):\n- **Sodium Hypochlorite (NaOCl 0.5-5.25%)**: เป็นสารล้างชนิดเดียวที่ \"ละลายเนื้อเยื่ออินทรีย์ (Organic pulp tissue) และแบคทีเรียชีวภาพ\" ได้อย่างสมบูรณ์\n- **17% EDTA**: เป็น Chelating agent จับกับแคลเซียมไอออนเพื่อละลายสารอนินทรีย์ (Inorganic debris) และกำจัด **Smear Layer** ออกจากผนังเนื้อฟัน เพื่อเปิดท่อ Dentinal tubules ให้สารอุดแทรกซึม\n- **2% Chlorhexidine (CHX)**: ฆ่าเชื้อแบคทีเรียได้กว้าง มีคุณสมบัติ Substantivity (จับกับผิวฟันและค่อยๆ ปลดปล่อยฤทธิ์ฆ่าเชื้อได้นาน) แต่ \"ไม่ละลายเนื้อเยื่ออินทรีย์\"\n- **ปฏิกิริยาเคมีที่เป็นอันตราย (Chemical Incompatibilities)**:\n  * **NaOCl + CHX**: เกิดตะกอนสีน้ำตาลส้มอันตรายชื่อ **Para-chloroaniline (PCA)** ซึ่งเป็นสารก่อมะเร็งและอุดตันท่อเนื้อฟัน (ต้องล้างคั่นด้วย Saline หรือ Sterile water ก่อนเสมอ)\n  * **NaOCl + EDTA**: EDTA จะลดปริมาณ Chlorine อิสระของ NaOCl ทำให้ความสามารถในการฆ่าเชื้อและละลายเนื้อเยื่อของ NaOCl ลดลงทันที\n\n3. อุบัติเหตุ NaOCl Extrusion (Hypochlorite Accident):\n- เกิดจากการฉีดสาร NaOCl ด้วยแรงดันสูงหรือเข็มติดแน่นกับผนังคลองรากฟัน (Wedging) จนสารเคมีทะลุออกสู่เนื้อเยื่อรอบปลายราก\n- อาการ: ปวดแสบปวดร้อนรุนแรงทันทีทันใดขณะล้าง, มีอาการบวมพองเฉียบพลัน (Rapid massive swelling), เลือดสดทะลักออกทางคลองรากฟัน, มีรอยฟกช้ำห้อเลือดใต้ผิวหนัง (Ecchymosis)\n- การปฐมพยาบาล: 1) หยุดล้างทันที ล้างระบายด้วย Normal Saline 2) ฉีดยาชาเฉพาะที่บล็อกระงับปวด 3) ประคบเย็น (Cold pack) ใน 24 ชั่วโมงแรก จากนั้นประคบอุ่น (Warm compress) หลัง 24 ชั่วโมง 4) ให้ยาแก้ปวด NSAIDs และยาปฏิชีวนะป้องกันการติดเชื้อแทรกซ้อน 5) ให้ความมั่นใจแก่คนไข้ว่าจะหายเป็นปกติใน 1-2 สัปดาห์",
    "matrix_headers": [
      "สารล้างคลองรากฟัน (Irrigant)",
      "คุณสมบัติหลัก",
      "การละลาย Organic Tissue",
      "การกำจัด Smear Layer",
      "ข้อควรระวัง / อันตราย"
    ],
    "matrix_rows": [
      [
        "NaOCl (2.5 - 5.25%)",
        "ฆ่าเชื้อแบคทีเรียยอดเยี่ยม, ละลายเนื้อเยื่อเน่า",
        "ทำได้สมบูรณ์ (Gold standard)",
        "ทำไม่ได้ (ไม่ละลาย Inorganic)",
        "ฉีดทะลุปลายรากทำให้เนื้อเยื่อตายเฉียบพลัน (NaOCl Accident)"
      ],
      [
        "17% EDTA",
        "Chelating agent กำจัดแร่ธาตุแคลเซียม",
        "ทำไม่ได้",
        "ทำได้สมบูรณ์ (เปิด Dentinal tubules)",
        "กัดกร่อนเนื้อฟันหากแช่นานเกิน 1-2 นาที"
      ],
      [
        "2% Chlorhexidine (CHX)",
        "มีฤทธิ์ Substantivity ตกค้างฆ่าเชื้อนาน",
        "ทำไม่ได้",
        "ทำไม่ได้",
        "ห้ามผสม NaOCl เพราะเกิดตะกอนพิษ Para-chloroaniline (PCA)"
      ],
      [
        "Citric Acid (10-50%)",
        "กรดอินทรีย์ละลายแร่ธาตุ กำจัดสเมียร์เลเยอร์",
        "ทำไม่ได้",
        "ทำได้ดี",
        "มีฤทธิ์เป็นกรด อาจระคายเคืองเนื้อเยื่อปลายราก"
      ]
    ],
    "pitfalls": [
      "กับดักข้อสอบลำดับการล้างคลองรากฟัน: ลำดับที่ถูกต้องคือ ใช้ NaOCl ตลอดขั้นตอนการขยายคลองรากฟัน -> ปิดท้ายด้วย 17% EDTA นาน 1 นาที เพื่อกำจัด Smear layer -> ล้างตามด้วย NaOCl อีกครั้งเพื่อฆ่าเชื้อลึกในท่อเนื้อฟัน -> ล้างด้วย Saline ให้สะอาดก่อนซับแห้ง",
      "ข้อสอบชอบถามว่า \"เมื่อเกิด NaOCl accident ควรประคบอุ่นทันทีหรือไม่?\" -> คำตอบคือ \"ผิด\"! ใน 24 ชั่วโมงแรกต้องประคบเย็นเพื่อลดการบวมและลดการกระจายตัวของสารเคมี หลังพ้น 24 ชั่วโมงจึงประคบอุ่นเพื่อเพิ่มการไหลเวียนเลือดช่วยสลายรอยช้ำ!"
    ],
    "pearl": "การป้องกัน NaOCl accident ที่ได้ผล 100%: ใช้เข็มชนิดเปิดข้าง (Side-vented needle) ใส่เข็มหลวมๆ ไม่ให้ติดแน่นกับผนังคลองราก (Loose fit) และวัดความยาวเข็มให้อยู่ห่างจาก Working Length อย่างน้อย 2-3 มม. เสมอ!",
    "reference": "Cohen's Pathways of the Pulp, 12th ed. Elsevier, 2021 (Chapter 6: Cleaning and Shaping of the Root Canal System); AAE Colleagues for Excellence: Endodontic Irrigation.",
    "decision_matrix": [
      {
        "col_0": "NaOCl (2.5 - 5.25%)",
        "col_1": "ฆ่าเชื้อแบคทีเรียยอดเยี่ยม, ละลายเนื้อเยื่อเน่า",
        "col_2": "ทำได้สมบูรณ์ (Gold standard)",
        "col_3": "ทำไม่ได้ (ไม่ละลาย Inorganic)",
        "col_4": "ฉีดทะลุปลายรากทำให้เนื้อเยื่อตายเฉียบพลัน (NaOCl Accident)"
      },
      {
        "col_0": "17% EDTA",
        "col_1": "Chelating agent กำจัดแร่ธาตุแคลเซียม",
        "col_2": "ทำไม่ได้",
        "col_3": "ทำได้สมบูรณ์ (เปิด Dentinal tubules)",
        "col_4": "กัดกร่อนเนื้อฟันหากแช่นานเกิน 1-2 นาที"
      },
      {
        "col_0": "2% Chlorhexidine (CHX)",
        "col_1": "มีฤทธิ์ Substantivity ตกค้างฆ่าเชื้อนาน",
        "col_2": "ทำไม่ได้",
        "col_3": "ทำไม่ได้",
        "col_4": "ห้ามผสม NaOCl เพราะเกิดตะกอนพิษ Para-chloroaniline (PCA)"
      },
      {
        "col_0": "Citric Acid (10-50%)",
        "col_1": "กรดอินทรีย์ละลายแร่ธาตุ กำจัดสเมียร์เลเยอร์",
        "col_2": "ทำไม่ได้",
        "col_3": "ทำได้ดี",
        "col_4": "มีฤทธิ์เป็นกรด อาจระคายเคืองเนื้อเยื่อปลายราก"
      }
    ]
  },
  "OMFS-Local-Anesthesia-Pharmacology": {
    "title": "เภสัชวิทยาของยาชาเฉพาะที่ การคำนวณขนาดยาสูงสุด และภาวะแทรกซ้อน (LA Pharmacology & MRD)",
    "specialty": "ศัลยศาสตร์ช่องปาก",
    "category": "ศัลยศาสตร์ช่องปาก",
    "badgeColor": "#f59e0b",
    "must_know_topics": [
      "Local Anesthesia MRD",
      "Lidocaine",
      "Articaine",
      "LAST Management",
      "Vasoconstrictors"
    ],
    "overview": "ยาชาเฉพาะที่เป็นยาที่ใช้บ่อยที่สุดในงานทันตกรรม ทันตแพทย์ต้องเข้าใจกลไกการปิดกั้นช่องโซเดียม (Voltage-gated Sodium Channel), คุณสมบัติทางเคมีกายภาพ (pKa, Lipid solubility, Protein binding), การคำนวณขนาดยาสูงสุด (MRD), และการป้องกันพิษต่อระบบประสาทและหัวใจ (LAST)",
    "core_mechanism": "1. กลไกการออกฤทธิ์และคุณสมบัติเคมีกายภาพ:\n- **โครงสร้างโมเลกุล**: ประกอบด้วย Lipophilic aromatic ring เชื่อมกับ Intermediate chain (เป็น Ester หรือ Amide) และ Hydrophilic amine group\n- **กลไก**: ยาชาต้องอยู่ในรูป Uncharged base (RN) จึงจะสามารถละลายซึมผ่านเยื่อหุ้มเซลล์ประสาทที่เป็น Phospholipid bilayer ได้ เมื่อเข้าไปใน Axoplasm ภายในเซลล์ ยาชาจะจับกับไฮโดรเจนไอออนกลายเป็น Charged cation (RNH+) แล้วเข้าไปปิดกั้นช่อง Voltage-gated Na+ channels จากด้านใน ขัดขวางการเกิด Depolarization และยับยั้งการนำกระแสประสาท\n- **บทบาทของค่า pKa**: ยาชาที่มีค่า pKa ต่ำและใกล้เคียงกับ pH ของเนื้อเยื่อปกติ (7.4) เช่น Mepivacaine (pKa 7.6) หรือ Lidocaine (pKa 7.7) จะมีสัดส่วนของรูป RN สูง จึงมี Onset of action เร็วที่สุด (2-4 นาที)\n- **ผลของเนื้อเยื่ออักเสบ (Inflamed tissue)**: ในบริเวณที่มีหนองหรือการอักเสบ ค่า pH จะลดลงเหลือ 5.0-6.0 ทำให้ยาชาส่วนใหญ่แตกตัวเป็นรูปมีประจุ (RNH+) ไม่สามารถซึมผ่านเยื่อหุ้มเซลล์ประสาทได้ เป็นสาเหตุที่ยาชา \"ชาไม่สนิท\" ในบริเวณที่อักเสบ\n\n2. การเผาผลาญยา (Metabolism):\n- **Ester-type (Procaine, Tetracaine)**: สลายตัวในพลาสมาโดยเอนไซม์ Pseudocholinesterase ได้สาร PABA ซึ่งเป็นสารก่อภูมิแพ้บ่อย\n- **Amide-type (Lidocaine, Mepivacaine, Bupivacaine)**: ถูกทำลายที่ตับผ่านเอนไซม์ Hepatic Cytochrome P450\n- **Articaine**: เป็น Amide ที่มี Thiophene ring และมี Ester side chain จึงถูกทำลายในพลาสมา 90-95% และที่ตับเพียง 5-10% ทำให้มีค่าครึ่งชีวิตสั้น (20 นาที) และปลอดภัยต่อผู้ป่วยโรคตับ",
    "matrix_headers": [
      "ชนิดของยาชา",
      "ขนาดยาสูงสุด (MRD)",
      "ปริมาณเนื้อยาต่อหลอด (1.8 mL)",
      "ข้อบ่งชี้ทางคลินิกเด่น"
    ],
    "matrix_rows": [
      [
        "2% Lidocaine c 1:100,000 Epinephrine",
        "7.0 mg/kg / max 500 mg (Malamed 7th) | 4.4 mg/kg max 300 mg (Plain & AAPD เด็ก)",
        "36 mg Lidocaine + 18 mcg Epinephrine",
        "ยาชามาตรฐานตัวเลือกแรก (Gold standard) ในผู้ป่วยทั่วไป"
      ],
      [
        "4% Articaine c 1:100,000 Epinephrine",
        "7.0 mg/kg / สูงสุดไม่เกิน 500 mg (เลี่ยง < 4 ปี)",
        "72 mg Articaine + 18 mcg Epinephrine",
        "ซึมผ่านกระดูกทึบได้ดีเยี่ยม (Buccal infiltration ฟันกรามล่างสำเร็จสูง)"
      ],
      [
        "3% Mepivacaine Plain / 2% c 1:100,000 Epi",
        "6.6 mg/kg max 400 mg (Malamed 7th) | 4.4 mg/kg max 300 mg (AAPD/ข้อสอบเด็ก)",
        "54 mg (3% Plain) / 36 mg (2% + Epi)",
        "3% Plain ใช้ในผู้ป่วยที่ห้ามใช้ Vasoconstrictor"
      ],
      [
        "0.5% Bupivacaine c 1:200,000 Epinephrine",
        "2.0 mg/kg / สูงสุดไม่เกิน 90 mg (ไม่แนะนำในเด็กเล็ก)",
        "9 mg Bupivacaine + 9 mcg Epinephrine",
        "ออกฤทธิ์นาน 6-8 ชม. เหมาะกับการผ่าตัดใหญ่และระงับปวดหลังผ่าตัด"
      ]
    ],
    "pitfalls": [
      "กับดักผู้ป่วยโรคหัวใจ (Cardiac Patient Limits): ขนาดยาสูงสุดของ Epinephrine ในคนไข้โรคหัวใจตามเกณฑ์ AHA คือ 0.04 mg (เท่ากับยาชา 1:100,000 ไม่เกิน 2 หลอด หรือ 1:200,000 ไม่เกิน 4 หลอด; คนปกติ max 0.2 mg) แม้ว่าตัวยาชา Lidocaine จะยังไม่เกินขนาดยาสูงสุดก็ตาม!",
      "Prilocaine และ Benzocaine สัมพันธ์กับการเกิดภาวะ Methemoglobinemia (เลือดเปลี่ยนเป็นสีน้ำตาลช็อกโกแลต SpO2 ตก) รักษาด้วยการให้ 1% Methylene blue ขนาด 1-2 mg/kg ทางหลอดเลือดดำช้าๆ"
    ],
    "pearl": "สูตรคิดจำนวนหลอดแบบรวดเร็วในห้องสอบ (1.8 mL/หลอด): 2% = 36 mg/หลอด, 3% = 54 mg/หลอด, 4% = 72 mg/หลอด • ข้อสอบเด็ก (AAPD) มักใช้ 4.4 mg/kg เช่น เด็ก 25 kg ใช้ 2% Mepivacaine = 110 mg → สูงสุด 3 หลอด (108 mg) ขณะที่ Malamed 7th ed. ปรับผู้ใหญ่ Lidocaine w/ Epi เป็น 7.0 mg/kg (max 500 mg) และ Mepivacaine เป็น 6.6 mg/kg (max 400 mg)",
    "reference": "Malamed SF. Handbook of Local Anesthesia, 7th ed. Elsevier, 2020 (Chapters 2, 4 & 17) & AAPD Guideline.",
    "decision_matrix": [
      {
        "col_0": "2% Lidocaine c 1:100,000 Epinephrine",
        "col_1": "7.0 mg/kg / max 500 mg (Malamed 7th) | 4.4 mg/kg max 300 mg (Plain & AAPD เด็ก)",
        "col_2": "36 mg Lidocaine + 18 mcg Epinephrine",
        "col_3": "ยาชามาตรฐานตัวเลือกแรก (Gold standard) ในผู้ป่วยทั่วไป"
      },
      {
        "col_0": "4% Articaine c 1:100,000 Epinephrine",
        "col_1": "7.0 mg/kg / สูงสุดไม่เกิน 500 mg (เลี่ยง < 4 ปี)",
        "col_2": "72 mg Articaine + 18 mcg Epinephrine",
        "col_3": "ซึมผ่านกระดูกทึบได้ดีเยี่ยม (Buccal infiltration ฟันกรามล่างสำเร็จสูง)"
      },
      {
        "col_0": "3% Mepivacaine Plain / 2% c 1:100,000 Epi",
        "col_1": "6.6 mg/kg max 400 mg (Malamed 7th) | 4.4 mg/kg max 300 mg (AAPD/ข้อสอบเด็ก)",
        "col_2": "54 mg (3% Plain) / 36 mg (2% + Epi)",
        "col_3": "3% Plain ใช้ในผู้ป่วยที่ห้ามใช้ Vasoconstrictor"
      },
      {
        "col_0": "0.5% Bupivacaine c 1:200,000 Epinephrine",
        "col_1": "2.0 mg/kg / สูงสุดไม่เกิน 90 mg (ไม่แนะนำในเด็กเล็ก)",
        "col_2": "9 mg Bupivacaine + 9 mcg Epinephrine",
        "col_3": "ออกฤทธิ์นาน 6-8 ชม. เหมาะกับการผ่าตัดใหญ่และระงับปวดหลังผ่าตัด"
      }
    ]
  },
  "OMFS-Fascial-Space-Infections": {
    "title": "การติดเชื้อในช่องว่างใบหน้าและลำคอ และภาวะฉุกเฉิน Ludwig’s Angina (Fascial Spaces & Cellulitis)",
    "specialty": "ศัลยศาสตร์ช่องปาก",
    "category": "ศัลยศาสตร์ช่องปาก",
    "badgeColor": "#f59e0b",
    "must_know_topics": [
      "Fascial Space Infections",
      "Ludwigs Angina",
      "Mylohyoid Line",
      "Cavernous Sinus Thrombosis"
    ],
    "overview": "การติดเชื้อจากฟัน (Odontogenic infection) สามารถลุกลามทะลุกระดูกเบ้าฟันเข้าสู่ Fascial spaces ต่างๆ ตามกายวิภาคของกล้ามเนื้อที่เกาะรอบขากรรไกร หากลุกลามสู่ช่องว่างใต้ลิ้นและใต้คางสองข้างจะกลายเป็น Ludwig’s Angina ซึ่งเป็นภาวะวิกฤตทางเดินหายใจอุดกั้นที่อันตรายถึงชีวิต",
    "core_mechanism": "1. ความสัมพันธ์ระหว่างรากฟันกับแนวกล้ามเนื้อ (Mylohyoid Line & Buccinator):\n- **ขากรรไกรล่าง (Mandible)**: มี Mylohyoid muscle เป็นแผงกั้นสำคัญ\n  * ฟันกรามแท้ซี่ที่หนึ่งล่าง (36, 46): ยอดรากฟันมักอยู่ \"เหนือ\" แนว Mylohyoid line เมื่อเกิดหนองทะลุแผ่นกระดูกด้านลิ้น หนองจะเข้าสู่ **Sublingual space**\n  * ฟันกรามแท้ซี่ที่สองและสามล่าง (37, 38, 47, 48): ยอดรากฟันมักอยู่ \"ใต้\" แนว Mylohyoid line เมื่อหนองทะลุแผ่นกระดูกด้านลิ้น หนองจะไหลลงสู่ **Submandibular space** โดยตรง\n- **ขากรรไกรบน (Maxilla)**: ฟันกรามบนทะลุออกด้านกระพุ้งแก้ม หากอยู่เหนือ Buccinator attachment หนองจะเข้าสู่ **Buccal space** หากอยู่ใต้ Buccinator จะกลายเป็น Intraoral vestibular abscess\n\n2. Ludwig’s Angina:\n- **นิยาม**: การติดเชื้อเนื้อเยื่อแบบลุกลามรวดเร็ว (Rapidly spreading, bilateral, indurated cellulitis) โดยต้องมีการติดเชื้อพร้อมกันทั้ง 3 ช่องว่างแบบ \"ทั้งสองข้าง (Bilateral)\" ได้แก่:\n  1) Submandibular spaces (ทั้งซ้ายและขวา)\n  2) Sublingual spaces (ทั้งซ้ายและขวา)\n  3) Submental space\n- **ลักษณะทางคลินิก**: บวมแข็งเหมือนกระดาน (Woody induration), ใต้คางป่องเป็นคอวัว (Bull neck), ลิ้นถูกดันยกสูงขึ้นไปอุดเพดานปาก (Elevated tongue), น้ำลายไหล พูดไม่ชัด (Hot potato voice), อ้าปากได้น้อย (Trismus), กลืนลำบาก (Dysphagia) และมีเสียงหายใจหวีด (Stridor) ซึ่งบ่งชี้ว่าทางเดินหายใจกำลังจะปิดสนิท!\n- **ลำดับความสำคัญในการรักษา (Treatment Priorities)**:\n  1) **Airway Management**: อันดับแรกสุดและสำคัญที่สุด ประเมิน Tracheostomy หรือ Awake fiberoptic intubation (ห้ามทำ Blind nasotracheal intubation เพราะเสี่ยงถุงหนองแตกสำลัก)\n  2) **Surgical Debridement**: กรีดเปิดระบายหนองใต้คางเพื่อลดความดัน (Decompression & Drainage)\n  3) **IV Antibiotics**: ยาปฏิชีวนะทางหลอดเลือดดำครอบคลุมเชื้อผสมแกรมบวกและแอนแอโรบิก\n  4) **กำจัดต้นตอ**: ถอนฟันซี่ที่ก่อโรคเมื่อสภาวะผู้ป่วยคงที่",
    "matrix_headers": [
      "ช่องว่างทางกายวิภาค (Fascial Space)",
      "ซี่ฟันต้นเหตุที่พบบ่อย",
      "ลักษณะทางคลินิกเด่น",
      "ภาวะแทรกซ้อนอันตราย"
    ],
    "matrix_rows": [
      [
        "Sublingual Space",
        "ฟันหน้าล่าง, เขี้ยว, กรามน้อย, กรามซี่ที่ 1 (เหนือ Mylohyoid line)",
        "พื้นปากบวมยก ลิ้นถูกดันไปข้างตรงข้าม พูดไม่ชัด",
        "ลุกลามข้ามไปอีกข้างกลายเป็น Ludwig’s Angina"
      ],
      [
        "Submandibular Space",
        "ฟันกรามล่างซี่ที่ 2 และ 3 (ใต้ Mylohyoid line)",
        "ใต้ขากรรไกรบวมแน่น คลำไม่พบขอบล่างกระดูก Mandible",
        "ลุกลามลงสู่ Parapharyngeal และ Retropharyngeal space"
      ],
      [
        "Ludwig’s Angina",
        "ฟันกรามล่างซี่ 2 หรือ 3 ลุกลามสองข้าง",
        "คอบวมแข็ง ลิ้นยกอุดเพดาน มีเสียงหายใจหวีด (Stridor)",
        "ทางเดินหายใจอุดกั้นเฉียบพลัน ขาดอากาศหายใจเสียชีวิต"
      ],
      [
        "Canine Space",
        "ฟันเขี้ยวบน (รากยาวเหนือ Levator anguli oris)",
        "ร่องแก้มหาย (Obliteration of nasolabial fold), หนังตาบวมปิด",
        "เชื้อแพร่กระจายผ่าน Angular vein สู่ Cavernous sinus thrombosis"
      ]
    ],
    "pitfalls": [
      "กับดักข้อสอบที่พบบ่อยที่สุด: โจทย์ถาม \"ลำดับแรกสุดในการดูแลผู้ป่วย Ludwig’s Angina คืออะไร?\" ตัวเลือกลวงมักเป็น ถอนฟันทันที หรือ กรีดระบายหนอง หรือ ให้ยาฆ่าเชื้อ -> คำตอบที่ถูกต้องเพียงหนึ่งเดียวคือ \"Airway Assessment & Maintenance (ประเมินและเปิดทางเดินหายใจ)\" เพราะผู้ป่วยเสียชีวิตจากภาวะขาดอากาศหายใจ ไม่ได้เสียชีวิตจากพิษแบคทีเรีย!",
      "อันตรายของ Danger Space: พื้นที่ระหว่าง Alar layer และ Prevertebral layer ทอดตัวยาวจากกะโหลกศีรษะลงสู่ Posterior Mediastinum หากการติดเชื้อลุกลามเข้าช่องนี้ จะเกิดภาวะ Mediastinitis ซึ่งมีอัตราการเสียชีวิตสูงกว่า 50%",
      "ADA 2019 Antibiotic Stewardship: ห้ามจ่ายยาปฏิชีวนะในผู้ป่วยภูมิคุ้มกันปกติที่ปวดหรือบวมเฉพาะที่โดยไม่มีอาการลุกลามเข้า Fascial space หรืออาการระบบทั่วไป (ไข้, Trismus, ต่อมน้ำเหลืองโต) — การระบายหนอง (I&D) และกำจัดฟันต้นเหตุคือหัวใจหลัก; หากติดเชื้อลุกลามใช้ Amoxicillin (หรือ Clindamycin เมื่อแพ้ Penicillin + รักษา, แต่ห้ามใช้ Clindamycin ใน IE Prophylaxis!)"
    ],
    "pearl": "การแพร่กระจายของการติดเชื้อจากฟันเขี้ยวบน (Maxillary Canine) รากที่ยาวมากจะอยู่เหนือแนว Levator anguli oris ทำให้เกิดการติดเชื้อเข้าสู่ Canine Space ส่งผลให้ร่องแก้มหาย (Obliteration of nasolabial fold) และตาบวมปิด ซึ่งเสี่ยงต่อการลุกลามเข้า Angular vein สู่ Cavernous sinus thrombosis! • ฟันคุดล่างอักเสบลุกลามเข้า Masticator space (Submasseteric / Pterygomandibular) ทำให้เกิด Trismus รุนแรง",
    "reference": "Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery, 7th ed. Elsevier, 2019 (Chapter 16: Odontogenic Infections); ADA Antibiotic Guideline 2019.",
    "decision_matrix": [
      {
        "col_0": "Sublingual Space",
        "col_1": "ฟันหน้าล่าง, เขี้ยว, กรามน้อย, กรามซี่ที่ 1 (เหนือ Mylohyoid line)",
        "col_2": "พื้นปากบวมยก ลิ้นถูกดันไปข้างตรงข้าม พูดไม่ชัด",
        "col_3": "ลุกลามข้ามไปอีกข้างกลายเป็น Ludwig’s Angina"
      },
      {
        "col_0": "Submandibular Space",
        "col_1": "ฟันกรามล่างซี่ที่ 2 และ 3 (ใต้ Mylohyoid line)",
        "col_2": "ใต้ขากรรไกรบวมแน่น คลำไม่พบขอบล่างกระดูก Mandible",
        "col_3": "ลุกลามลงสู่ Parapharyngeal และ Retropharyngeal space"
      },
      {
        "col_0": "Ludwig’s Angina",
        "col_1": "ฟันกรามล่างซี่ 2 หรือ 3 ลุกลามสองข้าง",
        "col_2": "คอบวมแข็ง ลิ้นยกอุดเพดาน มีเสียงหายใจหวีด (Stridor)",
        "col_3": "ทางเดินหายใจอุดกั้นเฉียบพลัน ขาดอากาศหายใจเสียชีวิต"
      },
      {
        "col_0": "Canine Space",
        "col_1": "ฟันเขี้ยวบน (รากยาวเหนือ Levator anguli oris)",
        "col_2": "ร่องแก้มหาย (Obliteration of nasolabial fold), หนังตาบวมปิด",
        "col_3": "เชื้อแพร่กระจายผ่าน Angular vein สู่ Cavernous sinus thrombosis"
      }
    ]
  },
  "OMFS-Medical-Emergencies": {
    "title": "การจัดการภาวะฉุกเฉินทางการแพทย์ในคลินิกทันตกรรม (Medical Emergencies in Dental Office)",
    "specialty": "ศัลยศาสตร์ช่องปาก",
    "category": "ศัลยศาสตร์ช่องปาก",
    "badgeColor": "#f59e0b",
    "must_know_topics": [
      "Medical Emergencies",
      "Vasovagal Syncope",
      "Anaphylaxis Protocol",
      "LAST Management",
      "Hypoglycemia"
    ],
    "overview": "ภาวะฉุกเฉินทางการแพทย์สามารถเกิดขึ้นได้ทุกเมื่อในคลินิกทันตกรรม ทันตแพทย์ต้องจดจำขั้นตอนการประเมิน (P-C-A-B-D: Position, Circulation, Airway, Breathing, Definitive care) และการบริหารยาช่วยชีวิตฉุกเฉินได้อย่างแม่นยำ",
    "core_mechanism": "1. ภาวะฉุกเฉินที่พบบ่อยและกลไกการปฐมพยาบาล:\n- **Vasovagal Syncope (เป็นลมหมดสติจากความเครียด/กลัว)**: ภาวะฉุกเฉินที่พบบ่อยที่สุด (~50%) เกิดจาก Sympathetic surge ตามด้วย Parasympathetic/Vagal rebound ทำให้เกิด Bradycardia และ Peripheral vasodilation เลือดไปเลี้ยงสมองลดลง\n  * การรักษา: ปรับเก้าอี้ให้อยู่ในท่า **Trendelenburg position** (ศีรษะต่ำ เท้าสูง 10-15 องศา) เพื่อเพิ่ม Venous return สู่สมอง, คลายเสื้อผ้า, ให้ออกซิเจน 100%\n- **Anaphylaxis (แพ้รุนแรงเฉียบพลัน)**: IgE-mediated mast cell degranulation หลั่ง Histamine และ Leukotrienes ทำให้เกิด Bronchospasm, Laryngeal edema, และ Severe hypotension\n  * ยาตัวเลือกแรกสุด (First-line drug): **Epinephrine 1:1,000 ขนาด 0.3 - 0.5 mg ฉีดเข้ากล้ามเนื้อต้นขาด้านนอก (Anterolateral thigh / Vastus lateralis)** ทันที! (เด็กให้ 0.01 mg/kg หรือ 0.15 mg) สามารถฉีดซ้ำได้ทุก 5-15 นาทีหากอาการไม่ดีขึ้น\n- **Angina Pectoris vs Myocardial Infarction (กล้ามเนื้อหัวใจขาดเลือด)**:\n  * Angina: ให้ผู้ป่วยนั่งพัก, อมยาใต้ลิ้น **Nitroglycerin 0.4 mg sublingually** ทุก 5 นาที สูงสุดไม่เกิน 3 เม็ด\n  * **ข้อห้ามเด็ดขาดของ Nitroglycerin**: ห้ามใช้หากผู้ป่วยได้รับยากลุ่ม PDE-5 inhibitors (Sildenafil/Viagra ใน 24 ชม. หรือ Tadalafil/Cialis ใน 48 ชม.) เพราะจะทำให้ความดันโลหิตตกอย่างรุนแรงจนเสียชีวิตได้!\n  * หากอมครบ 3 เม็ดหรือ 10 นาทีแล้วอาการปวดเค้นหน้าอกไม่ทุเลา ให้สงสัยกล้ามเนื้อหัวใจตายเฉียบพลัน (MI) -> โทรเรียกรถพยาบาล 1669 ทันที, ให้เคี้ยว **Aspirin 160-325 mg**, ให้ออกซิเจน และเตรียม AED\n- **Hypoglycemia (น้ำตาลในเลือดต่ำในผู้ป่วย DM)**:\n  * รู้สึกตัวดี: ให้น้ำหวานหรือกลูโคส 15-20 กรัม รับประทาน (Rule of 15)\n  * **หมดสติ/ไม่สามารถกลืนได้**: **ห้ามป้อนน้ำตาล/ของกินทางปากและห้ามเอาถุงคลุมจมูกปากเด็ดขาด!** ให้ฉีด **50% Dextrose (D50W) 50 mL IV** หรือ **Glucagon 1 mg IM**\n- **Thyroid Crisis (Thyroid Storm) vs Epinephrine Overdose**: ผู้ป่วย *Graves' disease* ที่ไม่ได้คุมอาการ หลังฉีดยาชามีไข้สูง กระสับกระส่าย หัวใจเต้นเร็ว ความดันสูง Pulse pressure (PP) กว้าง = **Thyroid crisis** (ต่างจาก Epinephrine reaction ที่มักไม่มีไข้สูง)\n- **AHA BLS 2020 & 2025 (Cardiac Arrest & Foreign Body Airway Obstruction)**:\n  * หมดสติ + ไม่มีชีพจร → เรียกช่วย/**โทร 1669 & นำ AED** → **Chest Compression ลึก 5–6 cm อัตรา 100–120 ครั้ง/นาที ปล่อยอกคืนตัวสุด (30:2)**\n  * สำลักสิ่งแปลกปลอม (AHA 2025): หากยังไอมีเสียงแรงดี (Partial obstruction) ให้กระตุ้นไอต่อไป ห้ามทำ Heimlich/Positive-pressure; หากอุดกั้นสมบูรณ์แต่ยังมีสติ สลับ **5 Back blows + 5 Abdominal thrusts**; หากหมดสติ → เริ่ม CPR & มองหาสิ่งแปลกปลอมในปากก่อนเป่าลม\n- **Local Anesthetic Systemic Toxicity (LAST)**: เกิดจากการฉีดยาชาเข้าเส้นเลือดโดยตรงหรือเกินขนาดยาสูงสุด เริ่มจากชาลิ้น/ปาก หูอื้อ ตาพร่า พูดลิ้นพันกัน ชักเกร็ง และหัวใจหยุดเต้น\n  * การรักษา: ช่วยหายใจด้วย 100% O2, ควบคุมอาการชักด้วย Midazolam, และให้ **20% Lipid Emulsion (Intralipid)** ทางหลอดเลือดดำ (Bolus 1.5 mL/kg ตามด้วย Infusion 0.25 mL/kg/min)",
    "matrix_headers": [
      "ภาวะฉุกเฉิน",
      "อาการแสดงหลัก",
      "ท่านอนที่ถูกต้อง",
      "ยาและการรักษาตัวเลือกแรก (First-Line)"
    ],
    "matrix_rows": [
      [
        "Vasovagal Syncope",
        "หน้าซีด เหงื่อแตก ชีพจรช้า วูบหมดสติ",
        "Trendelenburg (หัวต่ำ ขาสูง)",
        "ไม่ต้องใช้ยา, ปรับท่าหัวต่ำ + 100% O2"
      ],
      [
        "Anaphylaxis",
        "ผื่นลมพิษ หลอดลมตีบ หายใจหวีด ความดันตก",
        "นอนหงายยกขาสูง (ถ้านั่งจะความดันตก)",
        "Epinephrine 1:1,000 (0.3-0.5 mg) IM ต้นขา"
      ],
      [
        "Angina Pectoris",
        "เจ็บแน่นหน้าอกเหมือนมีอะไรทับ ร้าวไปกราม/แขนซ้าย",
        "นั่งพักท่าครึ่งนั่งครึ่งนอน (Upright/Fowler)",
        "Nitroglycerin 0.4 mg อมใต้ลิ้น (ห้ามใช้ถ้ากิน Viagra)"
      ],
      [
        "Hypoglycemia (หมดสติ)",
        "เหงื่อกาฬแตก ตัวเย็น สับสน หมดสติ",
        "นอนตะแคงป้องกันสำลัก",
        "IV 50% Dextrose (50 mL) หรือ Glucagon 1 mg IM"
      ],
      [
        "LAST (พิษยาชา)",
        "หูอื้อ ลิ้นชา ชักเกร็ง หัวใจเต้นผิดจังหวะ",
        "นอนหงายช่วยหายใจ",
        "100% O2 + Midazolam (คุมชัก) + 20% Intralipid"
      ]
    ],
    "pitfalls": [
      "กับดักฉีด Epinephrine ใน Anaphylaxis: ต้องฉีดเข้ากล้ามเนื้อต้นขาด้านนอก (IM Vastus lateralis) เท่านั้น! ห้ามฉีดเข้าเส้นเลือดดำ (IV) เพราะเสี่ยงต่อการเกิด Malignant cardiac arrhythmia และห้ามฉีดเข้ากล้ามเนื้อสะโพกหรือใต้ผิวหนังเพราะดูดซึมช้าเกินไป",
      "กับดัก Hypoglycemia หมดสติ vs Hyperventilation: ผู้ป่วยเบาหวานที่มีเหงื่อออก กระสับกระส่าย และหมดสติ ต้องฉีด 50% Dextrose IV (ห้ามเอาถุงคลุมจมูก/ปากหรืออมน้ำตาลเด็ดขาด!) | สำลักสิ่งแปลกปลอมแต่ยังไอแรงดี ห้ามทำ Heimlich ให้กระตุ้นไอต่อ (AHA 2025)"
    ],
    "pearl": "Anaphylaxis ใช้ 1:1,000 IM ต้นขา 0.3–0.5 mg | CPR ผู้ใหญ่ (AHA 2020/2025): ลึก 5–6 cm ปล่อยอกคืนตัวสุด 100–120 ครั้ง/นาที | Hypoglycemia หมดสติ = IV 50% Dextrose!",
    "reference": "Malamed SF. Medical Emergencies in the Dental Office, 8th ed. Elsevier, 2023; AHA BLS & ECC Guidelines (2020/2025).",
    "decision_matrix": [
      {
        "col_0": "Vasovagal Syncope",
        "col_1": "หน้าซีด เหงื่อแตก ชีพจรช้า วูบหมดสติ",
        "col_2": "Trendelenburg (หัวต่ำ ขาสูง)",
        "col_3": "ไม่ต้องใช้ยา, ปรับท่าหัวต่ำ + 100% O2"
      },
      {
        "col_0": "Anaphylaxis",
        "col_1": "ผื่นลมพิษ หลอดลมตีบ หายใจหวีด ความดันตก",
        "col_2": "นอนหงายยกขาสูง (ถ้านั่งจะความดันตก)",
        "col_3": "Epinephrine 1:1,000 (0.3-0.5 mg) IM ต้นขา"
      },
      {
        "col_0": "Angina Pectoris",
        "col_1": "เจ็บแน่นหน้าอกเหมือนมีอะไรทับ ร้าวไปกราม/แขนซ้าย",
        "col_2": "นั่งพักท่าครึ่งนั่งครึ่งนอน (Upright/Fowler)",
        "col_3": "Nitroglycerin 0.4 mg อมใต้ลิ้น (ห้ามใช้ถ้ากิน Viagra)"
      },
      {
        "col_0": "Hypoglycemia (หมดสติ)",
        "col_1": "เหงื่อกาฬแตก ตัวเย็น สับสน หมดสติ",
        "col_2": "นอนตะแคงป้องกันสำลัก",
        "col_3": "IV 50% Dextrose (50 mL) หรือ Glucagon 1 mg IM"
      },
      {
        "col_0": "LAST (พิษยาชา)",
        "col_1": "หูอื้อ ลิ้นชา ชักเกร็ง หัวใจเต้นผิดจังหวะ",
        "col_2": "นอนหงายช่วยหายใจ",
        "col_3": "100% O2 + Midazolam (คุมชัก) + 20% Intralipid"
      }
    ]
  },
  "Pros-Complete-Denture-Anatomy": {
    "title": "กายวิภาคศาสตร์ช่องปากสำหรับฟันเทียมทั้งปาก (Complete Denture Anatomy & Stress-Bearing Areas)",
    "specialty": "ทันตกรรมประดิษฐ์",
    "category": "ทันตกรรมประดิษฐ์",
    "badgeColor": "#38bdf8",
    "must_know_topics": [
      "Complete Denture Anatomy",
      "Buccal Shelf Area",
      "Primary Stress Bearing",
      "Relief Areas",
      "Posterior Palatal Seal"
    ],
    "overview": "ความอยู่แน่น (Retention), ความเสถียร (Stability), และการรับแรงบดเคี้ยว (Support) ของฟันเทียมทั้งปากขึ้นอยู่กับการออกแบบขอบและฐานฟันเทียมให้สอดคล้องกับโครงสร้างกระดูกและเนื้อเยื่ออ่อน ทันตแพทย์ต้องจำแนก Primary Stress-Bearing, Secondary Stress-Bearing, และ Relief Areas ได้อย่างแม่นยำ",
    "core_mechanism": "1. โครงสร้างกายวิภาคในขากรรไกรบน (Maxillary Landmarks):\n- **Primary Stress-Bearing Area**:\n  * **Hard Palate**: โดยเฉพาะบริเวณ Palatal shelves (แนวนอนของเพดานแข็งด้านข้าง) มีกระดูก Cortical หนาและเนื้อเยื่อเกี่ยวพันรองรับแน่นหนา\n  * **Posterolateral Slopes of Residual Ridge**: ด้านข้างของสันเหงือกส่วนหลัง\n- **Secondary Stress-Bearing Area**:\n  * **Crest of Residual Ridge (สันเหงือกบน)**: ช่วยรับแรงแต่เสี่ยงต่อการละลายตัวหากกดทับรุนแรง\n  * **Rugae Area**: สันเพดานด้านหน้า ทำมุมเอียง ช่วยป้องกันฟันเทียมเลื่อนไปข้างหน้า (Stability)\n- **Relief Areas (บริเวณที่ต้องหลบ relief เพื่อป้องกันการเจ็บหรือกระดูกละลาย)**:\n  * **Incisive Papilla**: มี Nasopalatine nerve & vessels หากกดทับจะเกิดอาการแสบชาฟันหน้าบน (Burning sensation)\n  * **Mid-Palatine Suture**: แนวรอยต่อกึ่งกลางเพดานแข็ง มีเยื่อเมือกบางคลุมกระดูก หากไม่ relief ฟันเทียมจะกระดก (Rocking) รอบแกนกลาง\n  * **Torus Palatinus**: ปุ่มกระดูกเพดาน ต้อง relief หรือผ่าตัดออกหากมีขนาดใหญ่\n- **Peripheral Seal (บริเวณซีลขอบฟันเทียม)**:\n  * **Vibrating Line**: รอยต่อระหว่างเพดานแข็งที่ไม่ขยับกับเพดานอ่อนที่ขยับได้ เป็นตำแหน่งวาง Posterior Palatal Seal (PPS) เพื่อกักสูญญากาศ\n\n2. โครงสร้างกายวิภาคในขากรรไกรล่าง (Mandibular Landmarks):\n- **Primary Stress-Bearing Area**:\n  * **Buccal Shelf Area**: พื้นที่ระหว่าง External oblique ridge กับ Crest of residual ridge มีลักษณะเป็นกระดูก Cortical แข็งแรง และระนาบวางตัว \"ตั้งฉากกับทิศทางแรงบดเคี้ยว\" จึงเป็นจุดรับแรงบดเคี้ยวหลักที่ดีที่สุดของฟันเทียมล่าง!\n  * **Retromolar Pad**: มีเนื้อเยื่อแน่นหนา ประกอบด้วยเส้นใยของ Temporalis tendon, Buccinator และ Pterygomandibular raphe ซึ่ง \"ไม่ละลายตัวตามกาลเวลา\" (Resorption-resistant) ขอบฟันเทียมล่างต้องคลุม 1/2 ถึง 2/3 ของแผ่นนี้เสมอ\n- **Secondary Stress-Bearing Area**: Slopes of Residual Ridge\n- **Relief Areas**: Crest of Residual Ridge (Knife-edge), Mental Foramen (หากสันเหงือกยุบมากจะกดทับทำให้ริมฝีปากล่างชา), Genial Tubercles & Lingual Tori",
    "matrix_headers": [
      "โครงสร้างกายวิภาค",
      "บทบาทในฟันเทียมบน (Maxilla)",
      "บทบาทในฟันเทียมล่าง (Mandible)",
      "ผลทางคลินิกหากออกแบบผิด"
    ],
    "matrix_rows": [
      [
        "Primary Stress-Bearing",
        "Hard palate (Palatal shelves แนวนอน)",
        "Buccal Shelf Area & Retromolar Pad",
        "หากไม่ใช้จุดนี้ กระดูกสันเหงือกจะละลายตัวรวดเร็ว"
      ],
      [
        "Secondary Stress-Bearing",
        "Palatine Rugae & Slopes of ridge",
        "Slopes of residual ridge",
        "ช่วยเสริมความเสถียร (Stability) ต้านแรงเฉือน"
      ],
      [
        "Relief Areas",
        "Incisive Papilla & Mid-palatine suture",
        "Crest of ridge (คมมีด), Mental foramen",
        "กดทับทำให้เกิดอาการแสบชา หรือฟันเทียมกระดกหัก"
      ],
      [
        "Peripheral Seal",
        "Vibrating line & Hamular notches (PPS)",
        "Retromylohyoid fossa & Alveololingual sulcus",
        "ขอบรั่ว ฟันเทียมจะหลุดร่วง ขาดความอยู่แน่น (Loss of retention)"
      ]
    ],
    "pitfalls": [
      "กับดักข้อสอบยอดฮิต: ถามว่า \"บริเวณใดในขากรรไกรล่างที่ทำหน้าที่เป็น Primary Stress-Bearing Area?\" ชอยส์มักลวงว่า Crest of residual ridge -> คำตอบที่ถูกต้องคือ Buccal Shelf Area!",
      "ข้อสอบมักถามว่า \"หากคนไข้ใส่ฟันเทียมล่างแล้วมีอาการชาที่ริมฝีปากล่าง เกิดจากสาเหตุใด?\" -> เกิดจากขอบฟันเทียมกดทับ Mental Foramen เนื่องจากสันเหงือกละลายตัวมาก ต้องแก้ไขโดยการกรอ relief บริเวณฟันกรามน้อยล่างด้านแก้ม"
    ],
    "pearl": "การตรวจ Vibrating line ให้คนไข้พูดออกเสียง \"อา-อา\" สั้นๆ รอยต่อที่กระเพื่อมขึ้นลงคือ Anterior vibrating line ส่วน Posterior vibrating line จะสิ้นสุดที่รอยบุ๋ม Hamular notch สองข้าง เชื่อมตัดผ่านตุ่ม Fovea palatinae ไปข้างหน้า 1-2 มม.!",
    "reference": "Zarb GA, Hobkirk JA, Eckert SE, Jacob RF. Prosthodontic Treatment for Edentulous Patients, 13th/14th ed. Elsevier; ACP Evidence-Based Complete Denture Guidelines & GPT-10 (2023).",
    "decision_matrix": [
      {
        "col_0": "Primary Stress-Bearing",
        "col_1": "Hard palate (Palatal shelves แนวนอน)",
        "col_2": "Buccal Shelf Area & Retromolar Pad",
        "col_3": "หากไม่ใช้จุดนี้ กระดูกสันเหงือกจะละลายตัวรวดเร็ว"
      },
      {
        "col_0": "Secondary Stress-Bearing",
        "col_1": "Palatine Rugae & Slopes of ridge",
        "col_2": "Slopes of residual ridge",
        "col_3": "ช่วยเสริมความเสถียร (Stability) ต้านแรงเฉือน"
      },
      {
        "col_0": "Relief Areas",
        "col_1": "Incisive Papilla & Mid-palatine suture",
        "col_2": "Crest of ridge (คมมีด), Mental foramen",
        "col_3": "กดทับทำให้เกิดอาการแสบชา หรือฟันเทียมกระดกหัก"
      },
      {
        "col_0": "Peripheral Seal",
        "col_1": "Vibrating line & Hamular notches (PPS)",
        "col_2": "Retromylohyoid fossa & Alveololingual sulcus",
        "col_3": "ขอบรั่ว ฟันเทียมจะหลุดร่วง ขาดความอยู่แน่น (Loss of retention)"
      }
    ]
  },
  "Pros-RPD-Design-Biomechanics": {
    "title": "การจำแนกประเภทและการออกแบบโครงสร้างฟันเทียมบางส่วนถอดได้ (RPD Biomechanics & Design)",
    "specialty": "ทันตกรรมประดิษฐ์",
    "category": "ทันตกรรมประดิษฐ์",
    "badgeColor": "#38bdf8",
    "must_know_topics": [
      "Kennedy Classification",
      "RPI System",
      "Indirect Retainer",
      "Major Connectors",
      "Applegates Rules"
    ],
    "overview": "ฟันเทียมบางส่วนถอดได้ (RPD) โดยเฉพาะชนิดสันเหงือกส่วนปลายว่าง (Distal Extension: Kennedy Class I & II) มีการรองรับร่วมกันระหว่างฟันหลักและสันเหงือก (Tooth-tissue supported) ซึ่งมีค่าความยืดหยุ่นต่างกันถึง 20-30 เท่า การออกแบบจึงต้องควบคุมการหมุนและแรงงัดฟันหลักอย่างเคร่งครัด",
    "core_mechanism": "1. การจำแนกประเภท Kennedy และกฎของ Applegate (8 Rules):\n- **Class I**: สันเหงือกส่วนปลายว่างสองข้าง (Bilateral distal extension)\n- **Class II**: สันเหงือกส่วนปลายว่างข้างเดียว (Unilateral distal extension)\n- **Class III**: ช่องว่างมีฟันหัวท้ายกั้นข้างเดียว (Unilateral tooth-bounded)\n- **Class IV**: ช่องว่างข้ามแนวกึ่งกลางด้านหน้า (Single bilateral anterior bounded space) **ห้ามมี Modification space เด็ดขาด!** (หากมีช่องว่างอื่นด้านหลัง จะถูกเปลี่ยน Class ทันทีตามกฎข้อ 5-7 ของ Applegate)\n\n2. ชีวกลศาสตร์ของแรงงัด (Lever Systems) และระบบ RPI:\n- ใน Class I และ Class II เมื่อมีแรงเคี้ยวลงบนฐานฟันเทียม ฐานจะยุบตัวลงสู่สันเหงือก ทำให้เกิดการหมุนรอบแกนหมุน (Fulcrum line)\n  * หากวาง Rest ไว้ที่ Distal ของฟันหลักปลายสุด: ตะขอจะทำหน้าที่เป็น **Class I Lever (คานงัดประเภทที่ 1)** ปลายตะขอจะงัดรากฟันหลักขึ้นด้านบนและดึงไปทาง Distal ทำให้ฟันหลักโยกและหักพังในที่สุด!\n  * **ระบบ RPI (Rest, Proximal plate, I-bar)**: แปลงเป็นคานงัดที่ปลอดภัย\n    - **R (Mesio-occlusal Rest)**: ย้าย Rest ไปไว้ด้านหน้า (Mesial) ทำให้แกนหมุนเลื่อนไปข้างหน้า\n    - **P (Proximal Plate)**: อยู่ด้าน Distal สัมผัสกับ Guide plane ส่วนล่าง เมื่อมีแรงกด แผ่นจะเลื่อนตัวลงสู่เหงือกโดยไม่งัดฟัน\n    - **I (I-bar)**: วางที่จุดกึ่งกลางหรือค่อนไปทาง Mesial ของฟันในระดับ Undercut 0.01 นิ้ว เมื่อฐานยุบตัว I-bar จะเคลื่อนตัว \"ลงและหลุดออกจากตัวฟัน (Disengage)\" เข้าสู่เหงือก จึงไม่เกิดแรงงัดต่อฟันหลัก!\n\n3. แขนงยึดทางอ้อม (Indirect Retainers):\n- ทำหน้าที่ต้านการหลุดลอยของฐานฟันเทียมส่วนปลายออกจากสันเหงือกเมื่อรับประทานอาหารเหนียว\n- ตำแหน่งที่ทรงประสิทธิภาพที่สุด: **วางทำมุม 90 องศา (ตั้งฉาก) กับ Fulcrum line และอยู่ห่างจาก Fulcrum line ไปทางด้านหน้าให้ไกลที่สุด** (มักเป็น Cingulum rest หรือ Incisal rest บนฟันเขี้ยว/กรามน้อย)\n\n4. แถบเชื่อมใหญ่ (Major Connectors):\n- **ขากรรไกรล่าง (Mandibular)**:\n  * **Lingual Bar**: แถบแท่งมาตรฐาน ต้องมีระยะจาก Floor of mouth ถึง Marginal gingiva **อย่างน้อย 7 - 8 มม.** (ตัวบาร์กว้าง 4-5 มม. + ขอบบนห่างเหงือก 3 มม.)\n  * **Lingual Plate**: ใช้เมื่อระยะพื้นปากตื้น (<7 มม.), มีปุ่มกระดูก Lingual tori, หรือฟันหน้าล่างโยกต้องการการยึดดาม (Splinting)\n- **ขากรรไกรบน (Maxillary)**:\n  * **Palatal Strap**: แถบแบน ต้องกว้างอย่างน้อย 8 มม. เหมาะกับ Class III\n  * **Anteroposterior (A-P) Palatal Strap**: แข็งแรงและเสถียรที่สุด เหมาะกับ Class I, II, IV\n  * **Horseshoe (U-shaped)**: ขาดความแข็งแกร่ง (Flexible ที่สุด) ยอมรับได้เฉพาะกรณีมี **Large Palatal Torus** ขนาดใหญ่ที่ผ่าตัดออกไม่ได้เท่านั้น",
    "matrix_headers": [
      "Kennedy Classification",
      "ลักษณะช่องว่างฟันหาย",
      "การรองรับแรง (Support)",
      "การออกแบบตะขอที่เหมาะสม"
    ],
    "matrix_rows": [
      [
        "Kennedy Class I",
        "ปลายว่างสองข้าง (Bilateral free-end)",
        "Tooth-tissue supported",
        "ระบบ RPI / RPA หรือ Combination Clasp (Wrought-wire)"
      ],
      [
        "Kennedy Class II",
        "ปลายว่างข้างเดียว (Unilateral free-end)",
        "Tooth-tissue supported",
        "ด้านปลายว่างใช้ RPI, ด้าน bounded ใช้ Cast circumferential clasp"
      ],
      [
        "Kennedy Class III",
        "ช่องว่างมีฟันหัวท้ายกั้น (Tooth-bounded)",
        "Tooth supported 100%",
        "Akers / Cast circumferential clasp (Rest วางชิดช่องว่างได้)"
      ],
      [
        "Kennedy Class IV",
        "ช่องว่างด้านหน้าข้ามกึ่งกลาง (ห้ามมี mod)",
        "Tooth supported หรือ Tooth-tissue",
        "Rest วางบนฟันกรามน้อยสองข้าง, Fulcrum line อยู่ด้านหลัง"
      ]
    ],
    "pitfalls": [
      "กับดัก Applegate Rule 8: กฎระบุว่า \"ขนาดของช่องว่าง (Extent) ไม่นำมาคิดเป็น Modification แต่นับเฉพาะจำนวนช่องว่าง (Number of additional spaces)\" เช่น หาย 1 ซี่ หรือหาย 4 ซี่ หากเป็นช่องเดียว ก็นับเป็น Modification 1 เท่ากัน!",
      "การเลือก Lingual bar: ข้อสอบมักให้ความลึกของพื้นปาก (วัดด้วย Periodontal probe จากขอบเหงือกอิสระ Marginal gingiva ถึงพื้นปาก/Lingual frenum) มา เช่น 5–6 มม. แล้วถามว่าจะเลือก Major connector ชนิดใด? ตอบทันทีว่า Lingual Plate เพราะความลึกไม่ถึงเกณฑ์ 7–8 มม.!"
    ],
    "pearl": "ข้อห้ามเด็ดขาดของ Cast Circumferential Clasp (Akers): ห้ามวางบนฟันหลักปลายสุดของ Kennedy Class I และ II โดยมี Rest อยู่ด้าน Distal เพราะแรงเคี้ยวจะทำให้ปลายตะของัดตัวฟันขึ้นจนฟันหลักหลุดโยก (Class I Lever destructive action)!",
    "reference": "Carr AB, Brown DT. McCracken's Removable Partial Prosthodontics, 13th/14th ed. Elsevier, 2021 (Chapters 3, 4, 8 & 12).",
    "decision_matrix": [
      {
        "col_0": "Kennedy Class I",
        "col_1": "ปลายว่างสองข้าง (Bilateral free-end)",
        "col_2": "Tooth-tissue supported",
        "col_3": "ระบบ RPI / RPA หรือ Combination Clasp (Wrought-wire)"
      },
      {
        "col_0": "Kennedy Class II",
        "col_1": "ปลายว่างข้างเดียว (Unilateral free-end)",
        "col_2": "Tooth-tissue supported",
        "col_3": "ด้านปลายว่างใช้ RPI, ด้าน bounded ใช้ Cast circumferential clasp"
      },
      {
        "col_0": "Kennedy Class III",
        "col_1": "ช่องว่างมีฟันหัวท้ายกั้น (Tooth-bounded)",
        "col_2": "Tooth supported 100%",
        "col_3": "Akers / Cast circumferential clasp (Rest วางชิดช่องว่างได้)"
      },
      {
        "col_0": "Kennedy Class IV",
        "col_1": "ช่องว่างด้านหน้าข้ามกึ่งกลาง (ห้ามมี mod)",
        "col_2": "Tooth supported หรือ Tooth-tissue",
        "col_3": "Rest วางบนฟันกรามน้อยสองข้าง, Fulcrum line อยู่ด้านหลัง"
      }
    ]
  },
  "Pros-Fixed-Ferrule-Preparation": {
    "title": "ชีวกลศาสตร์ของการกรอฟันหลัก ปรากฏการณ์ปลอกรัด และการบูรณะเดือยฟัน (Fixed Prostho & Ferrule Effect)",
    "specialty": "ทันตกรรมประดิษฐ์",
    "category": "ทันตกรรมประดิษฐ์",
    "badgeColor": "#38bdf8",
    "must_know_topics": [
      "Ferrule Effect",
      "Supracrestal Tissue Attachment (STA / Biologic Width)",
      "Total Occlusal Convergence",
      "Finish Line Margins",
      "Post and Core"
    ],
    "overview": "ความคงทนระยะยาวของครอบฟันและสะพานฟันขึ้นอยู่กับชีวกลศาสตร์ของการเตรียมฟัน (Tooth Preparation) การรักษาระยะยึดเกาะเนื้อเยื่อเหนือสันกระดูก (Supracrestal Tissue Attachment: STA — เดิมเรียกว่า Biologic Width ≥ 2 mm โดยขอบครอบฟันต้องห่างยอดกระดูกเบ้าฟันอย่างน้อย 3.0 mm) และปรากฏการณ์ปลอกรัด (Ferrule Effect) ในฟันที่รักษารากฟันแล้ว",
    "core_mechanism": "1. เรขาคณิตชีวกลศาสตร์ของการกรอฟัน (Biomechanical Geometry):\n- **Total Occlusal Convergence (TOC)**: มุมสอบเข้าหากันของผนังแกนฟันตรงข้าม ค่าที่เหมาะสมที่สุดในทางคลินิกคือ **6 ถึง 10 องศา** (ข้างละ 3-5 องศา) เพื่อให้ได้ความอยู่แน่น (Retention) และความต้านทานแรงงัด (Resistance form) สูงสุด\n- **ความสูงของผนังแกนฟัน (Axial Wall Height)**:\n  * ฟันกรามน้อย (Premolars) และฟันหน้า: ต้องการความสูงอย่างน้อย **3 มม.**\n  * ฟันกรามแท้ (Molars): เส้นผ่านศูนย์กลางกว้างขึ้น จึงต้องการความสูงอย่างน้อย **4 มม.**\n  * สัดส่วนความสูงต่อความกว้าง (Height-to-base ratio): ต้องไม่ต่ำกว่า **0.4** หากฟันสั้นเกินไป ต้องเสริมความต้านทานด้วยการกรอร่องแนวตั้ง (Auxiliary grooves/boxes) หรือทำ Crown Lengthening Surgery (รักษาระยะ Supracrestal Tissue Attachment / Biologic Width ให้ขอบครอบฟันห่างยอดกระดูก ≥ 3.0 มม.)\n- **การตัดลดด้านบดเคี้ยว (Occlusal Reduction)**:\n  * Functional cusp (Cusp รับแรง: Palatal บน, Buccal ล่าง): ลด 1.5 มม. สำหรับโลหะล้วน, **2.0 มม.** สำหรับ PFM และ All-ceramic\n  * Non-functional cusp: ลด 1.0 มม. สำหรับโลหะ, 1.5 มม. สำหรับเซรามิก\n\n2. เส้นขอบฟัน (Finish Lines / Margins):\n- **Chamfer Margin**: มีลักษณะโค้งเว้า เหมาะกับครอบฟันโลหะล้วน, โลหะด้านลิ้นของ PFM, และครอบฟัน Zirconia\n- **Shoulder Margin (90 องศา)**: กว้าง 1.0 - 1.2 มม. พร้อมลบมุมภายในมน (Rounded internal angle) ออกแบบมาเพื่อรับแรงอัดของ All-ceramic และเซรามิกขอบเหงือก (Porcelain shoulder) ป้องกันการแตกร้าว\n\n3. ปรากฏการณ์ปลอกรัด (Ferrule Effect) ในฟันที่บูรณะเดือยฟัน (Post & Core):\n- นิยาม: ปลอกรัดของเนื้อฟันแท้ธรรมชาติรอบแกนฟันที่โผล่พ้นระดับขอบครอบฟัน\n- **ขนาดมาตรฐานทองคำ (Gold Standard Dimension)**:\n  * **ความสูงของเนื้อฟันธรรมชาติอย่างน้อย 1.5 ถึง 2.0 มม.**\n  * **ความหนาของผนังเนื้อฟันอย่างน้อย 1.0 มม.**\n  * **ต้องมีความต่อเนื่องรอบตัวฟัน 360 องศา (Circumferential ferrule)**\n- ชีวกลศาสตร์: Ferrule จะเปลี่ยนทิศทางแรงดัดงอ (Bending & Wedging force) จากแกนเดือยให้กลายเป็นแรงอัดรอบตัวฟัน ช่วยลดความเสี่ยงต่อการเกิด **รากฟันแตกแนวตั้ง (Vertical Root Fracture - VRF)** ได้อย่างมหาศาล!\n- กฎเกณฑ์ความยาวของเดือยฟัน (Post Length Rules):\n  * เดือยฟันต้องยาวอย่างน้อยเท่ากับความสูงของตัวครอบฟันทางคลินิก หรือ 2/3 ของความยาวรากฟันในกระดูก\n  * **ต้องเหลือสารอุดกัตตาเปอร์ชาปิดปลายรากฟัน (Apical Gutta-Percha Seal) ไว้อย่างน้อย 4 ถึง 5 มม. เสมอ** เพื่อป้องกันการรั่วซึมของเชื้อจุลินทรีย์ออกสู่ปลายราก!",
    "matrix_headers": [
      "พารามิเตอร์การเตรียมฟัน",
      "ค่ามาตรฐานทางคลินิก",
      "เหตุผลทางชีวกลศาสตร์",
      "ผลกระทบหากต่ำกว่าเกณฑ์"
    ],
    "matrix_rows": [
      [
        "มุมสอบผนัง (TOC)",
        "6° - 10° (ข้างละ 3°-5°)",
        "ให้ Retention & Resistance สูงสุดโดยไม่เกิด Undercut",
        "มุมป้านเกินไป (>15°) ครอบฟันจะหลุดง่ายมาก"
      ],
      [
        "Ferrule Height",
        "1.5 - 2.0 มม. (หนา >= 1 มม.)",
        "ปลอกรัดต้านทานแรงงัด ป้องกันรากฟันแตกแนวตั้ง",
        "หากขาด Ferrule ฟันจะแตกหักแนวตั้งจนต้องถอน"
      ],
      [
        "Apical Gutta-Percha",
        "เหลือไว้อย่างน้อย 4 - 5 มม.",
        "คงสภาพผนึกของปลายรากฟัน ป้องกันเชื้อโรคเล็ดลอด",
        "เหลือน้อยกว่า 3 มม. จะเกิด Apical periodontitis ล้มเหลว"
      ],
      [
        "Functional Cusp Bevel",
        "เอียง 45° ลดลง 1.5 - 2.0 มม.",
        "ให้ความหนาของวัสดุในแนวรับแรงบดเคี้ยวหลัก",
        "เซรามิกจะบางจนแตกทะลุ หรือฟันสบสูง"
      ]
    ],
    "pitfalls": [
      "กับดักข้อสอบ Ferrule: หากโจทย์ถามว่า \"ปัจจัยใดสำคัญที่สุดในการป้องกันรากฟันแตกในฟันที่ใส่ Post and Core?\" ชอยส์มักลวงว่า ชนิดของเดือยฟัน (Cast metal vs Fiber post) หรือ ความลึกของเดือย -> คำตอบที่ถูกต้องที่สุดคือ \"การมี Ferrule effect อย่างน้อย 1.5-2.0 มม.\"!",
      "การใส่เดือยฟันไม่ได้ช่วยเพิ่มความแข็งแรงให้เนื้อฟัน (Post does NOT reinforce tooth structure) หน้าที่ของเดือยฟันมีเพียงข้อเดียวคือ \"ช่วยยึดแกนฟันเทียม (Retain the core buildup)\" เท่านั้น!"
    ],
    "pearl": "การวัด Ferrule effect ต้องวัดจากเนื้อฟันแท้ที่แข็งแรง (Sound dentin) เท่านั้น ไม่นับรวมเนื้อฟันผุ สารอุดเดิม หรือเนื้อฟันที่บางกว่า 1 มม.!",
    "reference": "Rosenstiel SF, Land MF, Walter R. Contemporary Fixed Prosthodontics, 6th ed. Elsevier, 2022; Shillingburg HT. Fundamentals of Fixed Prosthodontics, 4th ed.",
    "decision_matrix": [
      {
        "col_0": "มุมสอบผนัง (TOC)",
        "col_1": "6° - 10° (ข้างละ 3°-5°)",
        "col_2": "ให้ Retention & Resistance สูงสุดโดยไม่เกิด Undercut",
        "col_3": "มุมป้านเกินไป (>15°) ครอบฟันจะหลุดง่ายมาก"
      },
      {
        "col_0": "Ferrule Height",
        "col_1": "1.5 - 2.0 มม. (หนา >= 1 มม.)",
        "col_2": "ปลอกรัดต้านทานแรงงัด ป้องกันรากฟันแตกแนวตั้ง",
        "col_3": "หากขาด Ferrule ฟันจะแตกหักแนวตั้งจนต้องถอน"
      },
      {
        "col_0": "Apical Gutta-Percha",
        "col_1": "เหลือไว้อย่างน้อย 4 - 5 มม.",
        "col_2": "คงสภาพผนึกของปลายรากฟัน ป้องกันเชื้อโรคเล็ดลอด",
        "col_3": "เหลือน้อยกว่า 3 มม. จะเกิด Apical periodontitis ล้มเหลว"
      },
      {
        "col_0": "Functional Cusp Bevel",
        "col_1": "เอียง 45° ลดลง 1.5 - 2.0 มม.",
        "col_2": "ให้ความหนาของวัสดุในแนวรับแรงบดเคี้ยวหลัก",
        "col_3": "เซรามิกจะบางจนแตกทะลุ หรือฟันสบสูง"
      }
    ]
  },
  "Perio-Classification-2017": {
    "title": "ระบบจำแนกโรคปริทันต์ (AAP/EFP 2018 / TAP 2023) และพยากรณ์โรคปริทันต์ (TAP 2025)",
    "specialty": "ปริทันตวิทยา",
    "category": "ปริทันตวิทยา",
    "badgeColor": "#10b981",
    "must_know_topics": [
      "AAP/EFP 2018 & TAP E-book 2023 (Case Definition & 5 Exceptions)",
      "Periodontitis Staging (Severity & Complexity) & Grading",
      "CAL Measurement & Normal Bone Level (2 mm below CEJ)",
      "TAP 2025 Tooth-level (4 ระดับ) & Patient-level Prognosis (3 ระดับ + 4 Shifters)",
      "BOP ≥ 10% (Gingivitis on Intact vs Reduced Periodontium)"
    ],
    "overview": "องค์ความรู้บูรณาการระหว่างเอกสารฉันทามติสมาคมปริทันตวิทยาแห่งประเทศไทยทั้ง 2 ฉบับ: (1) TAP Workshop E-book 2023 (เกณฑ์วินิจฉัยและจำแนกโรคปริทันต์ AAP/EFP 2018) และ (2) TAP Guideline 2025 (เกณฑ์พยากรณ์โรคปริทันต์ Tooth-level 4 ระดับ และ Patient-level 3 ระดับ) ซึ่งเชื่อมโยงตั้งแต่การคัดกรอง CAL/5 ข้อยกเว้น, การคำนวณ %Bone loss จากจุด 2 mm ใต้ CEJ, ไปจนถึงการพยากรณ์โรคและ Re-prognosis รายครั้ง",
    "core_mechanism": "1. ขั้นคัดกรอง Health / Gingivitis / Periodontitis Case Definition (AAP/EFP 2018 & TAP E-book 2023):\n- **Periodontal Health**: BOP < 10%, ไม่มี CAL (Intact) หรือมี CAL แต่ **PD ≤ 4 mm และไม่มีจุด PD = 4 mm ที่มี BOP+** (Health on a stable reduced periodontium)\n- **Gingivitis**: **BOP ≥ 10%** (`Localized` 10–30%, `Generalized` > 30%), ไม่มี interdental CAL/RBL ของโรคปริทันต์ (Intact: PD ≤ 3 mm; Reduced stable: PD ≤ 3 mm)\n- **นิยามผู้ป่วยโรคปริทันต์อักเสบ (Periodontitis Case Definition)**:\n  (1) พบ **Interdental CAL ≥ 2 ซี่ที่ไม่ติดกัน (non-adjacent teeth)** หรือ\n  (2) พบ **Buccal/Oral CAL ≥ 3 mm ร่วมกับ PD > 3 mm ≥ 2 ซี่**\n  *โดยต้องแยก 5 ข้อยกเว้นที่ไม่ใช่ Periodontitis*: (1) เหงือกร่นจากแรงบาดเจ็บ (Traumatic recession), (2) ฟันผุบริเวณคอฟัน, (3) **CAL ด้าน Distal ฟันกรามซี่ที่ 2 จากการขึ้นผิดตำแหน่ง/ถอนฟันคุดซี่ที่ 3 (เช่น 37D จาก 38)**, (4) รอยโรคเอนโดดอนติกส์ที่ระบายผ่านร่องเหงือก, (5) รากฟันร้าวแนวดิ่ง (VRF)\n\n2. Periodontitis Staging (Stage I ถึง IV - ตลอดชีวิต ไม่ลดขั้นหลังรักษา):\n- **วัด RBL จากระดับกระดูกปกติ (2 mm ใต้ CEJ)** ถึงปลายราก (`%RBL = A/B × 100` ใช้ร่วมทั้ง TAP 2023 และ TAP 2025)\n- **Stage I (Initial)**: CAL 1–2 mm, RBL < 15% (Coronal 1/3), ไม่มีฟันสูญเสียจากปริทันต์, Max PD ≤ 4 mm\n- **Stage II (Moderate)**: CAL 3–4 mm, RBL 15–33% (Coronal 1/3), ไม่มีฟันสูญเสียจากปริทันต์, Max PD ≤ 5 mm\n- **Stage III (Severe with potential for tooth loss)**: CAL ≥ 5 mm, RBL ลามถึง Middle/Apical 1/3 (> 33%), สูญเสียฟันจากปริทันต์ ≤ 4 ซี่, PD ≥ 6 mm, Vertical bone loss ≥ 3 mm, Furcation Class II/III\n- **Stage IV (Advanced / Need for complex rehabilitation)**: CAL ≥ 5 mm, สูญเสียฟันจากปริทันต์ ≥ 5 ซี่, มีการสูญเสียสมรรถภาพบดเคี้ยว, Secondary occlusal trauma (Mob ≥ 2), Bite collapse / ฟันเคลื่อนยื่นห่าง (Pathologic migration), **เหลือฟัน < 20 ซี่ (< 10 คู่สบ)** *(Complexity-shifter สู่ Patient-level Shifters ของ TAP 2025)*\n\n3. Periodontitis Grading (Grade A, B, C - อัตราการดำเนินโรคและตัวปรับเสี่ยง):\n- **% Bone Loss / Age (หารด้วยอายุ)**: Grade A `< 0.25` • Grade B `0.25 ถึง 1.0` • Grade C `> 1.0`\n- **Risk Factors (ตัวปรับเกรดขึ้น — ใช้ตัวเดียวกับ Modifier ของ TAP 2025)**: สูบ < 10 มวน/วัน = Grade B, **สูบ ≥ 10 มวน/วัน = Grade C** • เบาหวานคุมได้ HbA1c < 7.0% = Grade B, **HbA1c ≥ 7.0% = Grade C**\n- **Extent & Distribution**: `Localized` (< 30% ของซี่ฟัน), `Generalized` (≥ 30%), หรือ `Molar-Incisor Pattern`\n\n4. ระบบพยากรณ์โรคปริทันต์ (TAP Guideline 2025 / พ.ศ. 2568) — แยก 2 ชั้น:\n- **Tooth-level Prognosis (4 ระดับตาม Periodontal Stability — ยกเลิก Fair/Poor ในระดับซี่แล้ว!)**:\n  * **Favorable**: Mob 0–1, RBL < 33%, PD ≤ 5 mm, Hamp Furcation 0–1, Local factor คุมได้แบบ Non-surgical, Restorable, ไม่มี Endo-perio\n  * **Questionable**: Mob 1–2, RBL 33–66% *(หรือ >66% ที่มี Vertical defect ≥ 3 mm ที่ทำ Regeneration ได้)*, PD ≥ 6 mm, Hamp Furcation 2, Local factor คุมด้วย Surgical/Occlusal trauma, Restorable, Endo-perio ไม่มี Root damage — ⚠️ **หากมี DM HbA1c ≥ 7.0% และ/หรือ สูบบุหรี่ ≥ 10 มวน/วัน ปรับ Questionable → Unfavorable ทันที!**\n  * **Unfavorable**: Mob 2–3, RBL > 66%, PD ≥ 6 mm, Hamp Furcation 3, Interdisciplinary local factor, Restorability compromised, **Endo-perio มี Root damage (ตรวจเพิ่ม/ส่งต่อเฉพาะทาง)**\n  * **Hopeless**: Mob 3, RBL ถึงปลายราก (Apex), Unrestorable, หรือ **Endo-perio มี Root damage ที่แนะนำให้ถอนฟัน**\n- **Patient-level Prognosis (3 ระดับเชื่อม Stage) & 4 Shifters**:\n  * **Good**: Health / Gingivitis / Stage I–II • **Fair**: Stage III • **Poor**: Stage IV / Molar-Incisor Pattern\n  * **4 Prognosis Shifters** (Systemic: บุหรี่ ≥10 มวน/HbA1c ≥7%/โรคระบบตาม Jepsen 2018 • Compliance/SPT • Parafunction • Occlusal stability `< 20 ซี่` หรือ `< 10 คู่สบ`): ปรับลดลง 1 ขั้น (Good→Fair, Fair→Poor) ยกเว้น Health/Gingivitis คง ≥ Fair; **รากเทียมไม่ลด Patient-level prognosis** แต่นับรวมเป็นคู่สบได้หากใช้งานได้ และต้องทำ **Re-prognosis ทุกครั้งที่มารักษา**",
    "matrix_headers": [
      "Stage",
      "CAL ที่จุดลึกสุด",
      "การละลายของกระดูก (RBL จาก 2 mm ใต้ CEJ)",
      "จำนวนฟันสูญเสียจากปริทันต์",
      "ความซับซ้อนทางคลินิก (2023) & Patient-level (2025)"
    ],
    "matrix_rows": [
      [
        "Stage I (Initial)",
        "1 - 2 มม.",
        "< 15% (Coronal third)",
        "0 ซี่",
        "PD <= 4 มม., แนวนอนทั้งหมด ไม่มี vertical defect | Patient-level: Good"
      ],
      [
        "Stage II (Moderate)",
        "3 - 4 มม.",
        "15% - 33% (Coronal third)",
        "0 ซี่",
        "PD <= 5 มม., แนวนอนเป็นส่วนใหญ่ | Patient-level: Good"
      ],
      [
        "Stage III (Severe)",
        ">= 5 มม.",
        "ลามถึง Middle หรือ Apical third",
        "<= 4 ซี่",
        "PD >= 6 มม., Vertical defect >= 3 มม., Furcation II-III | Patient-level: Fair"
      ],
      [
        "Stage IV (Advanced)",
        ">= 5 มม.",
        "ลามถึง Middle หรือ Apical third",
        ">= 5 ซี่",
        "สบฟันล้มเหลว (Bite collapse), < 20 ซี่ (< 10 คู่สบ) | Patient-level: Poor"
      ]
    ],
    "pitfalls": [
      "กับดัก Case Definition (ข้อสอบจริง!): เห็นซี่เดียวมี CAL/bone loss เช่น ซี่ 37 ด้าน Distal จากฟันคุดซี่ 38 (PD=5 mm, CAL=2 mm) ไม่ใช่ Periodontitis เพราะต้องมี Interdental CAL ≥ 2 ซี่ที่ไม่ติดกัน และ 37D จากฟันคุดอยู่ใน 5 ข้อยกเว้น ➔ ต้องวินิจฉัย Gingivitis ตามค่า BOP%!",
      "กับดักการคำนวณ CAL และ %RBL: (1) PD ≠ CAL — เหงือกบวมเอา PD ลบระยะเหนือ CEJ, เหงือกร่นเอา PD บวกระยะร่น; (2) ระดับกระดูกปกติ 100% วัดจากจุด 2 mm ใต้ CEJ (ไม่ใช่ขอบ CEJ ตรงๆ) ก่อนเทียบ %RBL ทั้งในการจัด Stage/Grade และ TAP 2025",
      "กับดัก Grade และ Tooth-level Modifier: หากคำนวณ %Bone loss / Age ได้ 0.40 (Grade B, ไม่ใช่ A เพราะ A คือ < 0.25!) แต่สูบบุหรี่ ≥ 10 มวน/วัน หรือ HbA1c ≥ 7.0% ➔ Grading ปรับเป็น Grade C ทันที และ Tooth-level Prognosis จาก Questionable ต้องปรับเป็น Unfavorable ทันที (ส่วนระดับซี่ฟันไม่มีคำว่า Fair/Poor แล้ว!)"
    ],
    "pearl": "Gingivitis ต้องมี BOP ≥ 10% (Intact: PD ≤ 3 mm; Reduced stable: ไม่มี CAL/RBL เพิ่มเติม) | Reduced Periodontium ที่ถือว่า Health (Stable): BOP < 10% และไม่มีจุด PD ≥ 4 mm ที่มี BOP+ | Stage คงที่ตลอดชีวิต แต่ Prognosis ต้องทำ Re-prognosis ทุกครั้งที่รักษา!",
    "reference": "Caton JG, et al. J Periodontol 2018;89(Suppl 1):S1-S8; สมาคมปริทันตวิทยาแห่งประเทศไทย: Workshop: Update on New Classification of Periodontal Diseases and Conditions (E-book 2023 / พ.ศ. 2562) และ TAP Guideline 2025: An Update in Periodontal Prognosis (พ.ศ. 2568).",
    "decision_matrix": [
      {
        "col_0": "Stage I (Initial)",
        "col_1": "1 - 2 มม.",
        "col_2": "< 15% (Coronal third)",
        "col_3": "0 ซี่",
        "col_4": "PD <= 4 มม., แนวนอนทั้งหมด ไม่มี vertical defect | Patient-level: Good"
      },
      {
        "col_0": "Stage II (Moderate)",
        "col_1": "3 - 4 มม.",
        "col_2": "15% - 33% (Coronal third)",
        "col_3": "0 ซี่",
        "col_4": "PD <= 5 มม., แนวนอนเป็นส่วนใหญ่ | Patient-level: Good"
      },
      {
        "col_0": "Stage III (Severe)",
        "col_1": ">= 5 มม.",
        "col_2": "ลามถึง Middle หรือ Apical third",
        "col_3": "<= 4 ซี่",
        "col_4": "PD >= 6 มม., Vertical defect >= 3 มม., Furcation II-III | Patient-level: Fair"
      },
      {
        "col_0": "Stage IV (Advanced)",
        "col_1": ">= 5 มม.",
        "col_2": "ลามถึง Middle หรือ Apical third",
        "col_3": ">= 5 ซี่",
        "col_4": "สบฟันล้มเหลว (Bite collapse), < 20 ซี่ (< 10 คู่สบ) | Patient-level: Poor"
      }
    ]
  },
  "Perio-Surgical-Crown-Lengthening": {
    "title": "ระยะชีวภาพและการผ่าตัดเพิ่มความยาวตัวฟันทางคลินิก (Biologic Width & Crown Lengthening)",
    "specialty": "ปริทันตวิทยา",
    "category": "ปริทันตวิทยา",
    "badgeColor": "#10b981",
    "must_know_topics": [
      "Biologic Width",
      "Supracrestal Tissue Attachment",
      "Crown Lengthening Surgery",
      "Ostectomy",
      "Gingivectomy"
    ],
    "overview": "การบูรณะฟันที่มีขอบลึกลงใต้เหงือก หากล่วงล้ำเข้าสู่ระยะชีวภาพ (Biologic Width / Supracrestal Tissue Attachment) จะเหนี่ยวนำให้เกิดการอักเสบเรื้อรัง ร่องลึกปริทันต์ หรือกระดูกเบ้าฟันละลายตัว การผ่าตัดเพิ่มความยาวตัวฟัน (Crown Lengthening Surgery - CLS) ต้องตัดแต่งทั้งเหงือกและกระดูกอย่างแม่นยำ",
    "core_mechanism": "1. กายวิภาคของระยะชีวภาพ (Biologic Width / Supracrestal Tissue Attachment - STA):\n- ตามงานวิจัยคลาสสิกของ Gargiulo et al. (1961):\n  * **Junctional Epithelium (JE)**: เฉลี่ยประมาณ **0.97 มม.**\n  * **Connective Tissue Attachment (CT)**: เฉลี่ยประมาณ **1.07 มม.** (ส่วนที่คงที่ที่สุดทางชีววิทยา)\n  * **Biologic Width (JE + CT)**: รวมกันเฉลี่ยเท่ากับ **2.04 มม.**\n  * ร่องเหงือกธรรมชาติ (Gingival Sulcus): เฉลี่ยประมาณ **0.69 มม.**\n- **ระยะห่างขั้นต่ำทางคลินิก (Clinical Golden Rule)**:\n  * ขอบงานบูรณะ (Restoration margin) ต้องอยู่ห่างจากยอดกระดูกเบ้าฟัน (Alveolar bone crest) **อย่างน้อย 3.0 มม. เสมอ** (2 มม. สำหรับ STA + 1 มม. สำหรับความลึกร่องเหงือกธรรมชาติ)\n  * หากขอบครอบฟันชิดยอดกระดูกเกินไป ร่างกายจะตอบสนองด้วยการเกิดการอักเสบเรื้อรัง เลือดออกง่าย หรือกระดูกเบ้าฟันจะละลายตัวหนีลงไปเองจนเกิดร่องลึกปริทันต์\n\n2. การผ่าตัดเพิ่มความยาวตัวฟัน (Crown Lengthening Surgery - CLS):\n- **Gingivectomy (การตัดเฉพาะเหงือก)**:\n  * ข้อบ่งชี้: มีร่องเหงือกเทียม (Pseudopocket), เหงือกโต (Gingival hyperplasia), มีเหงือกยึด (Attached gingiva) เหลือกว้างเพียงพอ (>2-3 มม.) และ **ระยะจากขอบรอยผุถึงยอดกระดูกเบ้าฟันต้องมากกว่า 3 มม. อยู่แล้ว**\n  * ข้อห้าม: หากระยะขอบผุถึงยอดกระดูก <3 มม. การตัดเฉพาะเหงือกจะล้มเหลว เพราะเหงือกจะงอกกลับมาปิดทับเหมือนเดิม\n- **Apically Repositioned Flap with Osseous Resection (เปิดแผ่นเหงือกกรอกระดูก)**:\n  * เป็นหัตถการมาตรฐานเมื่อระยะขอบฟันถึงกระดูก <3 มม.\n  * **Ostectomy (กรอกระดูกยึดฟัน)**: กรอเอากระดูกเบ้าฟันส่วนที่ยึดติดกับตัวฟันออก จนได้ระยะห่างจากขอบงานบูรณะในอนาคตถึงยอดกระดูกใหม่อย่างน้อย 3.0 มม.\n  * **Osteoplasty (แต่งรูปร่างกระดูก)**: เกลาความหนาและความลาดเอียงของกระดูกด้านนอกให้เป็นสรีระธรรมชาติโดยไม่แตะต้องกระดูกยึดฟัน\n- **ข้อห้ามในการทำ Crown Lengthening**:\n  * สัดส่วนตัวฟันต่อรากฟันไม่เหมาะสม (Crown-to-Root ratio < 1:1)\n  * ฟันหน้าในโซนความสวยงามที่มีเส้นรอยยิ้มสูง (High smile line) ซึ่งจะทำให้ฟันยาวผิดรูปและเหงือกร่นไม่สมมาตร\n  * ฟันกรามที่รอยโรคจะลุกลามเข้าสู่ส่วนแยกรากฟัน (Furcation involvement)",
    "matrix_headers": [
      "หัตถการ",
      "ข้อบ่งชี้ทางคลินิก",
      "ความกว้าง Attached Gingiva",
      "การแตะต้องกระดูกเบ้าฟัน"
    ],
    "matrix_rows": [
      [
        "Gingivectomy (ตัดเหงือกล้วน)",
        "ขอบผุห่างยอดกระดูก >3 มม. อยู่แล้ว, เหงือกบวมหนา",
        "ต้องมี Attached gingiva เหลือกว้าง (>3 มม.)",
        "ไม่กรอกระดูกเด็ดขาด"
      ],
      [
        "Flap c Osseous Reduction (CLS)",
        "ขอบผุ/ครอบฟันห่างยอดกระดูก <3 มม.",
        "รักษา Attached gingiva เดิมไว้ได้ (ย้ายไปทางปลายราก)",
        "กรอกระดูก (Ostectomy) ให้ห่างขอบผุอย่างน้อย 3 มม."
      ],
      [
        "Orthodontic Extrusion (ดึงฟันทางทันตกรรมจัดฟัน)",
        "ฟันหน้าหักใต้เหงือกที่ต้องการคงระดับขอบเหงือกสวยงาม",
        "ช่วยดึงระดับกระดูกและเหงือกขึ้นมาด้วย",
        "มักทำ Fibrotomy ร่วมด้วยเพื่อไม่ให้เหงือกตามมา"
      ]
    ],
    "pitfalls": [
      "กับดักการตัดเหงือก (Gingivectomy Trap): หากโจทย์บอกว่าฟันหักใต้เหงือกชิดยอดกระดูกเบ้าฟัน แล้วถามว่า \"สามารถรักษาด้วยการทำ Gingivectomy ได้หรือไม่?\" คำตอบคือ \"ไม่ได้เด็ดขาด\" เพราะถ้าไม่กรอกระดูก (Ostectomy) ระยะชีวภาพจะถูกละเมิดและเหงือกจะงอกกลับมาอักเสบใหม่ 100%!",
      "ระยะเวลารอคอยหลังทำ CLS: ในฟันหลังควรรออย่างน้อย 6-8 สัปดาห์ก่อนกรอครอบฟันตัวจริง แต่ในฟันหน้าโซนความสวยงาม (Esthetic Zone) ต้องรอนานอย่างน้อย 3 ถึง 6 เดือนเพื่อให้ระดับขอบเหงือกเข้าที่คงที่สมบูรณ์!"
    ],
    "pearl": "การตรวจ Bone Sounding: ภายใต้ยาชาเฉพาะที่ ใช้ Periodontal probe แทงทะลุก้นร่องเหงือกจนชนยอดกระดูกเบ้าฟัน หากระยะที่วัดได้สั้นกว่า 3 มม. เมื่อเทียบกับขอบรอยผุ ยืนยันได้ทันทีว่า \"ต้องกรอกระดูก (Ostectomy)\"!",
    "reference": "Newman and Carranza's Clinical Periodontology, 13th ed. Elsevier, 2018 (Chapter 59: Periodontal and Restorative Interrelationships); Gargiulo AW et al., J Periodontol 1961.",
    "decision_matrix": [
      {
        "col_0": "Gingivectomy (ตัดเหงือกล้วน)",
        "col_1": "ขอบผุห่างยอดกระดูก >3 มม. อยู่แล้ว, เหงือกบวมหนา",
        "col_2": "ต้องมี Attached gingiva เหลือกว้าง (>3 มม.)",
        "col_3": "ไม่กรอกระดูกเด็ดขาด"
      },
      {
        "col_0": "Flap c Osseous Reduction (CLS)",
        "col_1": "ขอบผุ/ครอบฟันห่างยอดกระดูก <3 มม.",
        "col_2": "รักษา Attached gingiva เดิมไว้ได้ (ย้ายไปทางปลายราก)",
        "col_3": "กรอกระดูก (Ostectomy) ให้ห่างขอบผุอย่างน้อย 3 มม."
      },
      {
        "col_0": "Orthodontic Extrusion (ดึงฟันทางทันตกรรมจัดฟัน)",
        "col_1": "ฟันหน้าหักใต้เหงือกที่ต้องการคงระดับขอบเหงือกสวยงาม",
        "col_2": "ช่วยดึงระดับกระดูกและเหงือกขึ้นมาด้วย",
        "col_3": "มักทำ Fibrotomy ร่วมด้วยเพื่อไม่ให้เหงือกตามมา"
      }
    ]
  },
  "Operative-Composite-Resins": {
    "title": "ชีววัสดุเรซินคอมโพสิต ปัจจัย C-Factor และกลไกการยึดติด (Composites, C-Factor & Adhesives)",
    "specialty": "ทันตกรรมบูรณะ/หัตถการ",
    "category": "ทันตกรรมบูรณะ/หัตถการ",
    "badgeColor": "#0d9488",
    "must_know_topics": [
      "C-Factor",
      "Polymerization Shrinkage",
      "Camphorquinone",
      "Composite Layering",
      "Adhesive Systems"
    ],
    "overview": "การบูรณะฟันด้วยเรซินคอมโพสิตขึ้นอยู่กับความเข้าใจด้านโครงสร้างพอลิเมอร์, กลไกการหดตัวจากการแข็งตัว (Polymerization Shrinkage), ปัจจัยรูปทรงโพรงฟัน (C-Factor), และประสิทธิภาพของระบบสารยึดติด (Adhesive Systems)",
    "core_mechanism": "1. C-Factor (Configuration Factor):\n- **นิยาม**: อัตราส่วนระหว่าง \"พื้นที่ผิวที่ยึดติด (Bonded surfaces)\" หารด้วย \"พื้นที่ผิวอิสระที่ไม่ได้ยึดติด (Unbonded surfaces)\"\n  * Formula: **C-Factor = Bonded Area / Unbonded Area**\n- **กลไกชีวกลศาสตร์**: ขณะที่เรซินเกิดกระบวนการ Polymerization จะมีการหดตัว (Volumetric shrinkage ประมาณ 1.5 - 3.5%) หากโพรงฟันมีพื้นที่ผิวอิสระมาก พอลิเมอร์จะสามารถไหลตัว (Plastic flow) ชดเชยการหดตัวได้ ทำให้แรงดึงรั้ง (Shrinkage stress) ต่ำ\n- **ค่า C-factor ใน Cavity preparations**:\n  * **Class I Cavity**: มีผนังยึดติด 5 ด้าน (Mesial, Distal, Buccal, Lingual, Pulpal) และด้านอิสระเพียง 1 ด้าน (Occlusal) -> **C-Factor = 5/1 = 5 (สูงที่สุด!)** เสี่ยงต่อการเกิด Marginal gap, คอสบฟันเสียว (Post-op sensitivity), และ Microleakage สูงที่สุด\n  * **Class II Cavity**: ผนังยึดติด 4 ด้าน ด้านอิสระ 2 ด้าน -> C-Factor = 4/2 = 2\n  * **Class IV Cavity**: ผนังยึดติด 1 ด้าน ด้านอิสระ 4 ด้าน -> **C-Factor = 1/4 = 0.25 (ต่ำที่สุด ปลอดภัยต่อความเครียดหดตัว)**\n- **วิธีลด C-factor**: ใช้เทคนิคการอุดแบบทีละชั้น (Incremental layering technique ความหนาไม่เกิน 2 มม. ต่อชั้น) โดยอุดเฉียงไม่ให้แตะผนังสองฝั่งตรงข้ามพร้อมกัน\n\n2. Adhesive Systems (ระบบสารยึดติด):\n- **Etch-and-Rinse (Total-Etch)**:\n  * ใช้ 35-37% Phosphoric acid กัดผิวเคลือบฟัน 15-30 วินาที และผิวเนื้อฟันไม่เกิน 15 วินาที เพื่อเปิดท่อเนื้อฟันและชะล้าง Smear layer ออกทั้งหมด\n  * สร้าง Hybrid Layer โดยการแทรกซึมของ Monomer เข้าไปใน De-mineralized collagen network\n  * ข้อควรระวัง: ห้ามเป่าเนื้อฟันจนแห้งสนิท (Over-drying) เพราะ Collagen fibers จะยุบตัวตัวแฟบ (Collagen collapse) ขัดขวางการซึมของสารยึดติด\n- **Self-Etch & Universal Adhesives**:\n  * ผสม Acidic functional monomer เช่น **10-MDP (10-Methacryloyloxydecyl dihydrogen phosphate)**\n  * กลไก: ปลาย Phosphate ของ 10-MDP จะทำปฏิกิริยาทางเคมีเกิดพันธะไอออนิกที่เสถียรมาก (Chemical ionic bonding) กับ Calcium ในผลึก Hydroxyapatite ของเนื้อฟัน เรียกว่ากระบวนการ **Nano-layering** ทำให้มีความทนทานต่อการย่อยสลายด้วยน้ำ (Hydrolysis-resistant) สูงมาก",
    "matrix_headers": [
      "ประเภทโพรงฟัน (Cavity)",
      "จำนวนผนังที่ยึดติด (Bonded)",
      "จำนวนด้านอิสระ (Unbonded)",
      "ค่า C-Factor",
      "ระดับความเค้นดึงรั้ง (Stress)"
    ],
    "matrix_rows": [
      [
        "Class I (Occlusal)",
        "5 ผนัง (B, L, M, D, Pulpal)",
        "1 ด้าน (Occlusal)",
        "5.0 (สูงสุด)",
        "วิกฤตสูงสุด! ต้องอุดแบบ Oblique incremental"
      ],
      [
        "Class II (MO / DO)",
        "4 ผนัง",
        "2 ด้าน (Occlusal + Proximal)",
        "2.0",
        "ปานกลาง สร้าง Proximal wall แปลงเป็น Class I ก่อน"
      ],
      [
        "Class III (Proximal ฟันหน้า)",
        "3 ผนัง",
        "3 ด้าน",
        "1.0",
        "ต่ำ"
      ],
      [
        "Class IV (Inciso-proximal)",
        "1-2 ผนัง",
        "4-5 ด้าน",
        "0.2 - 0.25 (ต่ำสุด)",
        "ปลอดภัยต่อการหดตัวที่สุด ผิวอิสระไหลชดเชยได้ดี"
      ]
    ],
    "pitfalls": [
      "กับดัก Camphorquinone (CQ): เป็นสารก่อปฏิกิริยาแสง (Photoinitiator) ที่ใช้ทั่วไป มีสีเหลือง และมีช่วงการดูดกลืนแสงสูงสุดที่ 468 นาโนเมตร (แสงสีน้ำเงิน) ต้องการ Co-initiator คือ Tertiary amine หากแสงส่องไม่ถึงพลังงาน (Energy density < 16-24 J/cm2) เรซินชั้นลึกจะไม่แข็งตัว ปล่อย Monomer ความเป็นพิษระคายเคืองต่อโพรงประสาทฟัน",
      "การฟอกสีฟัน (Bleaching) ปลดปล่อย Free radical oxygen ตกค้างในเนื้อฟัน ซึ่งยับยั้งกระบวนการ Free-radical polymerization ของสารยึดติดและคอมโพสิตอย่างรุนแรง ทำให้ Bond strength ลดลงมากกว่า 50% \"ต้องรออย่างน้อย 7-14 วันหลังฟอกสีฟันเสร็จสิ้น\" จึงจะทำหัตถการอุดฟันคอมโพสิตได้!"
    ],
    "pearl": "การยึดเกาะของ 10-MDP ไม่เพียงแต่ดีเลิศกับเนื้อฟันและเคลือบฟันเท่านั้น แต่โมเลกุล 10-MDP ยังสามารถจับกับ Zirconia (Zirconium dioxide) ได้อย่างเหนียวแน่น จึงเป็นสารประกอบหลักใน Primer สำหรับยึดครอบฟันเซอร์โคเนีย!",
    "reference": "Ritter AV, Boushell LW, Walter R. Sturdevant's Art and Science of Operative Dentistry, 7th ed. Elsevier, 2018 (Chapters 5 & 7).",
    "decision_matrix": [
      {
        "col_0": "Class I (Occlusal)",
        "col_1": "5 ผนัง (B, L, M, D, Pulpal)",
        "col_2": "1 ด้าน (Occlusal)",
        "col_3": "5.0 (สูงสุด)",
        "col_4": "วิกฤตสูงสุด! ต้องอุดแบบ Oblique incremental"
      },
      {
        "col_0": "Class II (MO / DO)",
        "col_1": "4 ผนัง",
        "col_2": "2 ด้าน (Occlusal + Proximal)",
        "col_3": "2.0",
        "col_4": "ปานกลาง สร้าง Proximal wall แปลงเป็น Class I ก่อน"
      },
      {
        "col_0": "Class III (Proximal ฟันหน้า)",
        "col_1": "3 ผนัง",
        "col_2": "3 ด้าน",
        "col_3": "1.0",
        "col_4": "ต่ำ"
      },
      {
        "col_0": "Class IV (Inciso-proximal)",
        "col_1": "1-2 ผนัง",
        "col_2": "4-5 ด้าน",
        "col_3": "0.2 - 0.25 (ต่ำสุด)",
        "col_4": "ปลอดภัยต่อการหดตัวที่สุด ผิวอิสระไหลชดเชยได้ดี"
      }
    ]
  },
  "Operative-Pulp-Protection-Adhesive": {
    "title": "การปกป้องโพรงประสาทฟัน ความหนาเนื้อฟันที่เหลือ และการกรอผุแบบอนุรักษ์ (Pulp Protection & RDT)",
    "specialty": "ทันตกรรมบูรณะ/หัตถการ",
    "category": "ทันตกรรมบูรณะ/หัตถการ",
    "badgeColor": "#0d9488",
    "must_know_topics": [
      "Remaining Dentin Thickness",
      "Pulp Protection",
      "Selective Caries Removal",
      "10-MDP",
      "Infected vs Affected Dentin"
    ],
    "overview": "การปกป้องโพรงประสาทฟันขึ้นอยู่กับระยะความหนาของเนื้อฟันที่เหลือ (Remaining Dentin Thickness - RDT) เหนือพัลพ์ การกำจัดรอยผุเชิงอนุรักษ์ (Selective Carious Tissue Removal) และการผนึกขอบโพรงฟัน (Peripheral Seal) ตามแนวทาง ADA (2023), ESE (2019), CariesCare International และ ICCMS",
    "core_mechanism": "1. กฎเกณฑ์ความหนาเนื้อฟันที่เหลือ (Remaining Dentin Thickness - RDT):\n- **RDT ≥ 2.0 มม. (ตื้น/ลึกปานกลาง)**:\n  * ความหนาของเนื้อฟันธรรมชาติ ≥ 2.0 มม. เป็นฉนวนกันความร้อนและสารเคมีได้ดีที่สุด\n  * ไม่จำเป็นต้องใส่ Liner หรือ Base ใดๆ ทั้งสิ้น ให้ทาสารยึดติด (Adhesive system) แล้วบูรณะได้ทันที\n- **RDT 0.5 ถึง < 2.0 มม. (หรือ 0.5–1.5 มม. ตามตำราทันตกรรมหัตถการ)**:\n  * ท่อเนื้อฟัน (Dentinal tubules) กว้างขึ้นและใกล้พัลพ์มากขึ้น\n  * สำหรับงาน Amalgam แนะนำรอง Base (**RMGIC / GIC**) เพื่อลดความร้อนและเป็นฉนวน; สำหรับงาน Composite สามารถใช้ Self-etch/Universal adhesive โดยตรง หรือรอง RMGIC เฉพาะจุดลึก (Selective lining)\n- **RDT < 0.5 มม. (โพรงฟันลึกมาก เห็นเงาสีชมพูของพัลพ์รำไร)**:\n  * เสี่ยงต่อ Micro-exposure และการอักเสบของพัลพ์\n  * ตามแนวทางดั้งเดิม/ข้อสอบ NL วาง **Sub-base** เฉพาะจุดที่ลึกที่สุดด้วย Calcium Hydroxide (`Ca(OH)2`) หรือ **Hydraulic Calcium Silicate (MTA / Biodentine)** แล้วทับด้วย **RMGIC Base** (อย่างไรก็ตาม **ADA 2023 / ESE 2019** เน้นว่าการทำ Selective removal ร่วมกับ RMGIC หรือวัสดุ Bioceramic และการผนึกขอบด้วย Adhesive ที่แน่นหนาให้ผลดีกว่าการใช้ `Ca(OH)2` อย่างเดียว)\n\n2. Selective Carious Tissue Removal (การกรอผุเชิงอนุรักษ์ — ADA 2023 & ESE 2019):\n- **แนวทาง 1-Step Selective Removal (แนะนำเป็นอันดับแรกเหนือ Stepwise)**:\n  * **ขอบรอบนอก (Peripheral Seal Zone 1.5–2 มม. / Surrounding walls)**: ต้องกรอกำจัดรอยผุออกทั้งหมดจนถึง **Hard Dentin** และ Sound Enamel เพื่อให้สารยึดติดสร้าง Hermetic seal ตัดวงจรอาหารของเชื้อแบคทีเรีย\n  * **พื้นก้นโพรงด้านใกล้พัลพ์ (Pulpal / Axial Wall)**: ในฟันแท้ที่ยัง **Vital และไม่มีอาการปวดแบบ Irreversible pulpitis** สามารถคง **Affected / Firm Dentin** (หรือ **Soft/Leathery Dentin** ในรอยผุลึกมากใกล้ทะลุพัลพ์) ไว้เหนือโพรงประสาทแล้วปิดผนึกถาวรในครั้งเดียว เพื่อป้องกัน Iatrogenic pulp exposure! *(หมายเหตุ: Infected/Soft dentin ต้องกรอออกทั้งหมดเฉพาะบริเวณขอบรอบนอกและในรอยผุที่ไม่ลึกใกล้พัลพ์)*",
    "matrix_headers": [
      "Remaining Dentin Thickness (RDT)",
      "สภาวะโพรงประสาท",
      "แนวทางการปกป้องพัลพ์ (Pulp Protection)",
      "วัสดุที่เลือกใช้"
    ],
    "matrix_rows": [
      [
        "RDT ≥ 2.0 มม.",
        "ปลอดภัย สมบูรณ์",
        "ไม่ต้องใส่ Base หรือ Liner ใดๆ",
        "Adhesive + Composite / Amalgam (เลี่ยงใน <15 ปี/ตั้งครรภ์ ตาม Minamata; phase-out 2034)"
      ],
      [
        "RDT 0.5 - < 2.0 มม.",
        "ท่อเนื้อฟันกว้างขึ้น",
        "ใส่ Thermal / Chemical Base รองพื้น (จำเป็นใต้ Amalgam; หรือใต้ Composite เฉพาะจุดลึก)",
        "RMGIC (Fuji II LC) หรือ Conventional GIC"
      ],
      [
        "RDT < 0.5 มม. (ลึกมาก)",
        "เสี่ยงทะลุโพรงประสาท",
        "วาง Bioceramic / Sub-base เฉพาะจุดลึก + ทับด้วย RMGIC (1-step Selective Removal)",
        "MTA / Biodentine / Ca(OH)2 (แนวทาง NL เก่า) + RMGIC Base"
      ],
      [
        "จุดทะลุขนาดเล็ก (<1 มม.) สด",
        "Vital Pulp exposure",
        "Direct Pulp Capping (ห้ามเลือด ≤ 5 นาทีด้วย NaOCl/NSS)",
        "MTA หรือ Biodentine (ESE 2019 Gold Standard) + RMGIC Base"
      ]
    ],
    "pitfalls": [
      "กับดัก Ca(OH)2 ทาเต็มโพรงฟัน: ห้ามทา Calcium hydroxide ทั่วก้นโพรงฟันเด็ดขาด! เพราะ Ca(OH)2 มีแรงรับแรงอัดต่ำมาก (Low compressive strength) และละลายน้ำได้ง่าย หากทาหนาจะทำให้สารอุดยุบตัวหลุดร่วง ให้ทาเฉพาะจุดที่ลึกที่สุดไม่เกิน 0.5 มม. และต้องคลุมทับด้วย RMGIC เสมอ",
      "Zinc Oxide Eugenol (ZOE): Eugenol จะยับยั้งกระบวนการ Free-radical polymerization ของคอมโพสิตเรซินอย่างรุนแรง \"ห้ามใช้ ZOE เป็นเบสรองพื้นใต้คอมโพสิตเรซินเด็ดขาด\"!"
    ],
    "pearl": "ทฤษฎี Brännström Hydrodynamic Theory: อาการเสียวฟันหลังอุดคอมโพสิตเกิดจาก Microgap ทำให้น้ำในท่อเนื้อฟันขยับกระตุ้น A-delta fibers การผนึกท่อเนื้อฟันด้วยสารยึดติดที่มี 10-MDP (Self-etch) หรือสารลดเสียวฟันกลุ่ม Glutaraldehyde/HEMA (เช่น Gluma) ช่วยป้องกันปัญหานี้ได้!",
    "reference": "ADA Restorative Carious Lesions Guideline (JADA 2023); ESE Position Statement on Deep Caries (IEJ 2019); Sturdevant's Art and Science of Operative Dentistry, 7th ed.",
    "decision_matrix": [
      {
        "col_0": "RDT ≥ 2.0 มม.",
        "col_1": "ปลอดภัย สมบูรณ์",
        "col_2": "ไม่ต้องใส่ Base หรือ Liner ใดๆ",
        "col_3": "Adhesive + Composite / Amalgam (เลี่ยงใน <15 ปี/ตั้งครรภ์ ตาม Minamata; phase-out 2034)"
      },
      {
        "col_0": "RDT 0.5 - < 2.0 มม.",
        "col_1": "ท่อเนื้อฟันกว้างขึ้น",
        "col_2": "ใส่ Thermal / Chemical Base รองพื้น (จำเป็นใต้ Amalgam; หรือใต้ Composite เฉพาะจุดลึก)",
        "col_3": "RMGIC (Fuji II LC) หรือ Conventional GIC"
      },
      {
        "col_0": "RDT < 0.5 มม. (ลึกมาก)",
        "col_1": "เสี่ยงทะลุโพรงประสาท",
        "col_2": "วาง Bioceramic / Sub-base เฉพาะจุดลึก + ทับด้วย RMGIC (1-step Selective Removal)",
        "col_3": "MTA / Biodentine / Ca(OH)2 (แนวทาง NL เก่า) + RMGIC Base"
      },
      {
        "col_0": "จุดทะลุขนาดเล็ก (<1 มม.) สด",
        "col_1": "Vital Pulp exposure",
        "col_2": "Direct Pulp Capping (ห้ามเลือด ≤ 5 นาทีด้วย NaOCl/NSS)",
        "col_3": "MTA หรือ Biodentine (ESE 2019 Gold Standard) + RMGIC Base"
      }
    ]
  },
  "Pedia-Primary-Pulp-Therapy": {
    "title": "การบำบัดรักษาโพรงประสาทฟันในฟันน้ำนม (AAPD 2024–2025 Pulp Therapy Guidelines)",
    "specialty": "ทันตกรรมสำหรับเด็ก",
    "category": "ทันตกรรมสำหรับเด็ก",
    "badgeColor": "#0284c7",
    "must_know_topics": [
      "Indirect Pulp Treatment (IPT/IPC > 90% Success)",
      "AAPD 2024–2025 Pulpotomy: MTA / Biodentine Preferred over Formocresol",
      "DPC Contraindication in Carious Primary Teeth",
      "Pulpectomy Contraindications: Acute Facial Cellulitis & >1/3 Root Resorption"
    ],
    "overview": "การรักษาโพรงประสาทฟันน้ำนมตามแนวทาง AAPD 2024–2025 และ ศ.ป.ท. ต้องแยกความรุนแรงของพยาธิสภาพพัลพ์ ระดับการละลายของรากฟัน (< 1/3 vs > 1/3) และตรวจคัดกรองการติดเชื้อลุกลามนอกช่องปาก (Facial cellulitis) เพื่อตัดสินใจระหว่าง IPT/IPC, Pulpotomy, Pulpectomy หรือ Extraction",
    "core_mechanism": "1. หัตถการรักษาโพรงประสาทในฟันน้ำนม (AAPD 2024–2025):\n- **Indirect Pulp Treatment (IPT/IPC)**:\n  * ข้อบ่งชี้: ฟันผุลึกมาก แต่ไม่มีประวัติปวดขึ้นมาเอง (No spontaneous/night pain), ไม่มีเงาดำที่บริเวณง่ามรากฟัน (Furcation area)\n  * วิธีการ: กรอผุโดยเหลือ Affected dentin ชั้นในสุดไว้เหนือพัลพ์ ปิดด้วย RMGIC หรือ Calcium Silicate (MTA/Biodentine) และบูรณะด้วย SSC (อัตราความสำเร็จ >90–95%)\n- **Pulpotomy (การตัดพัลพ์ส่วนตัวฟัน)**:\n  * ข้อบ่งชี้: ทะลุโพรงประสาทจากรอยผุ (Carious exposure) แต่พัลพ์ในรากยังแข็งแรง (Vital radicular pulp) — หลังตัด Coronal pulp ต้อง **ห้ามเลือดหยุดสนิทภายใน 3–5 นาที** ด้วยน้ำเกลือหรือ NaOCl (หากเลือดไม่หยุดใน 5 นาที ต้องเปลี่ยนเป็น Pulpectomy!)\n  * วัสดุปิดทับพัลพ์ตาม **AAPD 2024–2025**:\n    - **MTA / Biodentine (Calcium Silicate Cements)**: **เป็นวัสดุแนะนำลำดับแรก (Strong Recommendation)** มีความเข้ากันได้ทางชีวภาพสูงสุดและกระตุ้นการซ่อมแซมโดยลด Internal resorption\n    - **15.5% Ferric Sulfate / NaOCl**: ทางเลือกที่ยอมรับได้เมื่อคุมเลือดได้ดี\n    - **Formocresol (1:5 Buckley)**: เป็นมาตรฐานอ้างอิงเดิมที่มีผลสำเร็จดี แต่บทบาทลดลงเนื่องจากข้อกังวลด้านความเป็นพิษของ Formaldehyde\n- **Direct Pulp Capping (DPC) ในฟันน้ำนม**:\n  * **ข้อห้าม (CONTRAINDICATED ใน Carious exposure!)**: เหนี่ยวนำ Internal Root Resorption สูงมาก! (ทำเฉพาะ Pinpoint mechanical exposure ที่สะอาดมากเท่านั้น)\n- **Pulpectomy & ข้อห้ามเด็ดขาด (ต้องถอน!)**:\n  * ข้อบ่งชี้: Irreversible pulpitis / Necrosis (ปวดกลางคืน, มีหนอง/Furcation lesion แต่ยังมีกระดูกหุ้มหน่อถาวร และ **รากละลาย < 1/3**)\n  * ล้างคลองรากด้วย **1% NaOCl / Normal saline** (เข้มข้นอ่อนโยนต่อฟันน้ำนม) และอุดด้วย **สารละลายพร้อมราก (Resorbable paste)** เท่านั้น ได้แก่ **ZOE** หรือ **Iodoform + Ca(OH)₂ (Vitapex / Metapex)** (**ห้ามใช้ Gutta-percha เด็ดขาด!**)\n  * **ข้อห้ามทำ Pulpectomy (ต้องถอนฟัน!):** 1) **Acute Facial Cellulitis / Extraoral Cheek Swelling (บวมแก้มลามนอกช่องปาก)** ➔ AAPD ห้ามทำ Pulpectomy ต้องถอนกำจัดแหล่งเชื้อ + ให้ Antibiotic! 2) เหลือแต่ตอราก (RR/Non-restorable) 3) รากละลาย `> 1/3` ถึง `2/3` 4) พยาธิสภาพง่ามรากทำลายกระดูกหุ้มหน่อฟันแท้!",
    "matrix_headers": [
      "หัตถการในฟันน้ำนม",
      "สภาวะของโพรงประสาท & อาการ",
      "ระยะเวลาห้ามเลือด / เกณฑ์ราก",
      "วัสดุแนะนำ (AAPD 2024–2025)",
      "การบูรณะขั้นสุดท้าย"
    ],
    "matrix_rows": [
      [
        "Indirect Pulp Treatment (IPT/IPC)",
        "Vital (ผุลึก ไม่ปวดเอง ไม่มี Furcation lesion)",
        "ไม่ทะลุพัลพ์",
        "RMGIC หรือ MTA / Biodentine",
        "Stainless Steel Crown (SSC)"
      ],
      [
        "Pulpotomy",
        "Vital carious exposure (พัลพ์ในรากยังดี)",
        "เลือดหยุดสนิทใน 3–5 นาที",
        "MTA / Biodentine (แนะนำสูงสุด) / Ferric Sulfate",
        "Stainless Steel Crown (SSC)"
      ],
      [
        "Pulpectomy",
        "Irreversible / Necrotic (ไม่มี Cellulitis)",
        "รากละลาย < 1/3, ฟันยังบูรณะได้",
        "1% NaOCl + ZOE หรือ Vitapex/Metapex (ห้าม GP!)",
        "Stainless Steel Crown (SSC)"
      ],
      [
        "Extraction + Space Maintainer",
        "Acute Facial Cellulitis (บวมแก้ม), เหลือตอราก (RR)",
        "รากละลาย > 1/3 หรือทำลายหน่อถาวร",
        "ถอนกำจัดแหล่งเชื้อ (+ Systemic ATB หากมีไข้/Cellulitis)",
        "ใส่ Space Maintainer ตามตำแหน่ง"
      ]
    ],
    "pitfalls": [
      "กับดัก Acute Facial Cellulitis: หากโจทย์ระบุเด็กมี 'บวมแก้มด้านขวา (Extraoral swelling / Cellulitis)' ร่วมกับฟันกรามน้ำนมผุใหญ่ ห้ามเลือกทำ Pulpectomy เพราะ AAPD ห้ามทำในภาวะติดเชื้อลุกลามนอกช่องปาก — ต้องถอนฟัน (Extraction) กำจัดต้นเหตุ!",
      "กับดัก DPC ในฟันน้ำนม & ตอราก RR: ห้ามทำ DPC ในจุดทะลุจากฟันผุ และห้ามทำ Pulpotomy ในฟันที่ปวดเรื้อรังและผุหมดเหลือแต่ตอราก (RR)"
    ],
    "pearl": "AAPD 2024–2025: Pulpotomy เลือก MTA/Biodentine ก่อน Formocresol | Pulpectomy ใช้ ZOE/Vitapex ห้าม GP และห้ามทำหากมี Facial Cellulitis!",
    "reference": "AAPD Reference Manual: Guideline on Pulp Therapy for Primary and Immature Permanent Teeth (2024–2025); McDonald & Avery 11th ed., 2022.",
    "decision_matrix": [
      {
        "col_0": "Indirect Pulp Treatment (IPT/IPC)",
        "col_1": "Vital (ผุลึก ไม่ปวดเอง ไม่มี Furcation lesion)",
        "col_2": "ไม่ทะลุพัลพ์",
        "col_3": "RMGIC หรือ MTA / Biodentine",
        "col_4": "Stainless Steel Crown (SSC)"
      },
      {
        "col_0": "Pulpotomy",
        "col_1": "Vital carious exposure (พัลพ์ในรากยังดี)",
        "col_2": "เลือดหยุดสนิทใน 3–5 นาที",
        "col_3": "MTA / Biodentine (แนะนำสูงสุด) / Ferric Sulfate",
        "col_4": "Stainless Steel Crown (SSC)"
      },
      {
        "col_0": "Pulpectomy",
        "col_1": "Irreversible / Necrotic (ไม่มี Cellulitis)",
        "col_2": "รากละลาย < 1/3, ฟันยังบูรณะได้",
        "col_3": "1% NaOCl + ZOE หรือ Vitapex/Metapex (ห้าม GP!)",
        "col_4": "Stainless Steel Crown (SSC)"
      },
      {
        "col_0": "Extraction + Space Maintainer",
        "col_1": "Acute Facial Cellulitis (บวมแก้ม), เหลือตอราก (RR)",
        "col_2": "รากละลาย > 1/3 หรือทำลายหน่อถาวร",
        "col_3": "ถอนกำจัดแหล่งเชื้อ (+ Systemic ATB หากมีไข้/Cellulitis)",
        "col_4": "ใส่ Space Maintainer ตามตำแหน่ง"
      }
    ]
  },
  "Pedia-Space-Maintenance": {
    "title": "การจัดการช่องว่างในขากรรไกร การสลับฟันล่าง และ Space Maintainers",
    "specialty": "ทันตกรรมสำหรับเด็ก",
    "category": "ทันตกรรมสำหรับเด็ก",
    "badgeColor": "#0284c7",
    "must_know_topics": [
      "Primate Space & Leeway Space of Nance",
      "Band & Loop vs Distal Shoe vs LLHA vs Nance",
      "Distal Shoe Contraindications (Hemophilia, IE Risk, Immunocompromised)",
      "Lingual Eruption of Mandibular Incisors (Observe if Mobile)"
    ],
    "overview": "การสูญเสียฟันกรามน้ำนมก่อนกำหนดส่งผลให้ฟันแท้ข้างเคียงล้มเอียงเข้าหาช่องว่าง รวมถึงการแยกแยะภาวะปกติของการสลับฟันหน้าล่างทางด้านลิ้น (Lingual eruption) เพื่อหลีกเลี่ยงการถอนหรือส่งต่อโดยไม่จำเป็น",
    "core_mechanism": "1. ช่องว่างทางสรีรวิทยาและการสลับฟัน:\n- **Primate Space**: บน = ระหว่าง **B–C (Lateral–Canine)** | ล่าง = ระหว่าง **C–D (Canine–1st Primary Molar)**\n- **Leeway Space of Nance**: บน ~**0.9–1.5 mm/ข้าง** | ล่าง ~**1.7–2.5 mm/ข้าง** ใช้สำหรับ Late mesial shift ของซี่ 6\n- **Lingual Eruption ของฟันตัดแท้ล่าง (31,41 / 32,42)**: เป็นแนวพัฒนาการปกติของหน่อฟันแท้ที่อยู่ด้านลิ้น: หากฟันตัดน้ำนมมี **การโยกตามสรีรวิทยา (1°–2° mobility)** ให้ **Observe รอหลุดเอง** แรงลิ้นจะดันฟันแท้มาด้านหน้าเอง; จะถอนเฉพาะเมื่อฟันน้ำนมยังแน่นสนิท (`0 mobility`) ทั้งที่ฟันแท้ขึ้นเกินครึ่งซี่แล้ว\n\n2. การเลือก Space Maintainer:\n- **หายฟัน D ข้างเดียว (มี E):** `Band & Loop` (หรือ Crown & Loop)\n- **หายฟัน E ก่อนซี่ 6 ขึ้น:** `Distal Shoe` (ใบมีดนำทางซี่ 6; **ห้ามใช้เด็ดขาดใน Hemophilia / IE risk / ภูมิคุ้มกันบกพร่อง / เบาหวานคุมไม่ได้!** — ใน Hemophilia ควรรักษาซี่ E ด้วย Pulpectomy แทน!)\n- **หายฟันหลัง 2 ข้างหลังซี่ 6 ขึ้นแล้ว:** บน ➔ `Nance Holding Arch` / `TPA`; ล่าง ➔ `Lower Lingual Holding Arch (LLHA)` (**ใส่เฉพาะเมื่อฟันตัดแท้ล่าง 31–42 ขึ้นแล้วเท่านั้น!**)",
    "matrix_headers": [
      "สถานการณ์ฟันน้ำนมหลุดหาย",
      "ฟันกรามแท้ซี่แรก (ซี่ 6)",
      "เครื่องมือที่เลือกใช้ (Space Maintainer)",
      "ข้อควรระวังสำคัญ"
    ],
    "matrix_rows": [
      [
        "สูญเสียฟัน D ข้างเดียว",
        "ขึ้นแล้วหรือยังไม่ขึ้น",
        "Band and Loop (สวมที่ซี่ E)",
        "ต้องตรวจดูการขยับและรอยผุใต้ปลอกทุก 6 เดือน"
      ],
      [
        "สูญเสียฟัน E ก่อนซี่ 6 ขึ้น",
        "ยังไม่ขึ้น (Unerupted under bone)",
        "Distal Shoe Space Maintainer",
        "ห้ามใช้ในคนไข้โรคหัวใจเสี่ยง IE, Hemophilia หรือภูมิคุ้มกันต่ำ"
      ],
      [
        "สูญเสียฟัน E หลังซี่ 6 ขึ้นแล้ว (บน)",
        "ขึ้นเต็มที่แล้ว",
        "Nance Holding Arch หรือ TPA",
        "ระวัง Acrylic button กดเพดานปากอักเสบ"
      ],
      [
        "สูญเสียฟัน E หลังซี่ 6 ขึ้นแล้ว (ล่าง)",
        "ขึ้นเต็มที่แล้ว",
        "Lower Lingual Holding Arch (LLHA)",
        "ห้ามติดก่อนฟันตัดแท้ล่างขึ้น เพราะจะขัดขวางทิศทางการขึ้น"
      ]
    ],
    "pitfalls": [
      "กับดัก Lingual eruption ฟันตัดล่าง: เด็กอายุ 6–7 ปี มีฟันน้ำนม 71/81 โยก 1°–2° และฟัน 31/41 ขึ้นด้านลิ้น ไม่ต้องส่งจัดฟันถอน! ให้ Observe รอหลุดเองตามธรรมชาติ",
      "กับดัก LLHA: ห้ามใส่ก่อนฟันตัดแท้ล่าง 31–42 ขึ้น; และห้ามใส่ Distal Shoe ในเด็ก Hemophilia หรือ Cyanotic CHD!"
    ],
    "pearl": "กฎ 3/4 ของการขึ้นฟันแท้: ฟันแท้โผล่พ้นเหงือกเมื่อสร้างราก ≥ 75% (Nolla ≥ 7) | ฟันน้ำนมหน้าล่างโยก 1°–2° กับฟันแท้ขึ้นด้านลิ้น ➔ Observe รอหลุดเอง!",
    "reference": "Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent, 11th ed. Elsevier, 2022.",
    "decision_matrix": [
      {
        "col_0": "สูญเสียฟัน D ข้างเดียว",
        "col_1": "ขึ้นแล้วหรือยังไม่ขึ้น",
        "col_2": "Band and Loop (สวมที่ซี่ E)",
        "col_3": "ต้องตรวจดูการขยับและรอยผุใต้ปลอกทุก 6 เดือน"
      },
      {
        "col_0": "สูญเสียฟัน E ก่อนซี่ 6 ขึ้น",
        "col_1": "ยังไม่ขึ้น (Unerupted under bone)",
        "col_2": "Distal Shoe Space Maintainer",
        "col_3": "ห้ามใช้ในคนไข้โรคหัวใจเสี่ยง IE, Hemophilia หรือภูมิคุ้มกันต่ำ"
      },
      {
        "col_0": "สูญเสียฟัน E หลังซี่ 6 ขึ้นแล้ว (บน)",
        "col_1": "ขึ้นเต็มที่แล้ว",
        "col_2": "Nance Holding Arch หรือ TPA",
        "col_3": "ระวัง Acrylic button กดเพดานปากอักเสบ"
      },
      {
        "col_0": "สูญเสียฟัน E หลังซี่ 6 ขึ้นแล้ว (ล่าง)",
        "col_1": "ขึ้นเต็มที่แล้ว",
        "col_2": "Lower Lingual Holding Arch (LLHA)",
        "col_3": "ห้ามติดก่อนฟันตัดแท้ล่างขึ้น เพราะจะขัดขวางทิศทางการขึ้น"
      }
    ]
  },
  "Pedia-Dental-Traumatology": {
    "title": "การบาดเจ็บต่อฟันน้ำนมและฟันแท้ตามเกณฑ์สากล (IADT 2020 Guidelines)",
    "specialty": "ทันตกรรมสำหรับเด็ก",
    "category": "ทันตกรรมสำหรับเด็ก",
    "badgeColor": "#0284c7",
    "must_know_topics": [
      "Primary Avulsion: Never Replant",
      "Primary Lateral Luxation & Crown Discoloration (Monitor First per IADT 2020)",
      "Primary Intrusion (Labial vs Palatal Apex)",
      "Permanent Avulsion (< 60 Min HBSS/Cold Milk + 2 Weeks Flexible Splint)"
    ],
    "overview": "การจัดการอุบัติเหตุทางทันตกรรมตามเกณฑ์มาตรฐาน IADT 2020 แยกความสำคัญสูงสุดระหว่างฟันน้ำนม (มุ่งปกป้องหน่อฟันแท้ หลีกเลี่ยงหัตถการที่ทำร้ายหน่อฟัน) และฟันแท้ (รักษากำลังของเซลล์ PDL และ Vital pulp)",
    "core_mechanism": "1. การบาดเจ็บในฟันน้ำนม (IADT 2020 Primary Dentition Updates):\n- **Avulsion:** **ห้ามปลูกฟันน้ำนมกลับคืนเด็ดขาด (NEVER replant!)** เสี่ยงทำลายหน่อฟันแท้เกิด Turner's tooth / Ankylosis\n- **Intrusion:** ตรวจทิศปลายราก: เบน Labial (ออกนอก/หนีหน่อแท้) ➔ **Observe รอขึ้นเองใน 2–6 ด.**; เบน Palatal (ทิ่มหน่อแท้) ➔ พิจารณาถอนอย่างระมัดระวัง\n- **Lateral Luxation:** **IADT 2020:** หาก **ไม่ขัดขวางการสบฟัน** ให้ **ไม่ทำหัตถการ/ปล่อยคืนตำแหน่งเอง (Spontaneous repositioning)** ไม่นิยมใส่ Splint ในฟันน้ำนม; หากขวางการสบฟันให้จัดเข้าที่เบาๆ หรือกรอแต่ง\n- **Asymptomatic Crown Discoloration (เหลือง / เทาคล้ำ):** **IADT 2020** แนะนำ **Monitor/Follow-up** หากไม่มีอาการปวด ฝีหนอง (Sinus tract) โยกรุนแรง หรือเงาดำง่าม/ปลายราก *(หมายเหตุ: ข้อสอบ NL เก่ายุคก่อน 2020 อาจเฉลย Pulpectomy หากฟันสีเทาและผนัง Dentin บางจาก Necrosis)*\n\n2. การบาดเจ็บในฟันแท้ (IADT 2020 Permanent Dentition):\n- **Avulsion:** จับเฉพาะ Crown (ห้ามขูดราก!); สื่อเก็บรักษาที่ดีที่สุด: **HBSS > นมสดเย็น (Cold Milk) > NSS > น้ำลาย** (ห้ามแช่น้ำเปล่า!):\n  * **แห้ง < 60 นาที (PDL รอด):** ล้างเบาๆ ด้วย NSS ➔ Replant ➔ **Flexible Splint 2 สัปดาห์** + เริ่ม RCT ใน 7–14 วัน (หากรากปิด; หากรากเปิดติดตามการคืนชีพ/Revascularization) + Doxycycline (>8 ปี)/Amoxicillin + Tetanus check\n  * **แห้ง > 60 นาที:** แช่ **2% NaF 20 นาที** ชะลอ Ankylosis + Splint **4 สัปดาห์**\n- **Complicated Crown Fracture รากยังเปิด:** **Partial (Cvek) Pulpotomy** ปิดด้วย MTA/Biodentine เพื่อ Apexogenesis!",
    "matrix_headers": [
      "ประเภทการบาดเจ็บ (IADT 2020)",
      "ฟันน้ำนม (Primary Teeth)",
      "ฟันแท้ (Permanent Teeth)",
      "ระยะเวลา Splinting (ฟันแท้)"
    ],
    "matrix_rows": [
      [
        "Avulsion (หลุดออกจากเบ้า)",
        "ห้ามใส่กลับคืนเด็ดขาด (Never replant)",
        "จับ Crown ใส่กลับทันที (ห้ามขูดราก!)",
        "2 สัปดาห์ (<60 นาที) / 4 สัปดาห์ (>60 นาที)"
      ],
      [
        "Lateral Luxation / Subluxation",
        "ไม่ขวางสบ = ปล่อยคืนที่เอง (Spontaneous repositioning); ไม่ Splint!",
        "ดันฟันกลับเข้าที่ + Flexible splint",
        "2 สัปดาห์ (Subluxation) / 4 สัปดาห์ (Lateral lux.)"
      ],
      [
        "Intrusion (กระแทกจมเบ้า)",
        "เบนออกแก้ม = รอขึ้นเอง | เบนเข้าเพดาน = พิจารณาถอน",
        "ปลายรากเปิด = รอขึ้นเอง | ปิด = ดึงกลับ + RCT 2 สัปดาห์",
        "ขึ้นกับวิธีดึงกลับ"
      ],
      [
        "ฟันเปลี่ยนสี (Discoloration ไม่มีหนอง)",
        "IADT 2020: Monitor/Follow-up ไม่ทำ Pulpectomy จากสีอย่างเดียว",
        "ทดสอบความมีชีวิตซ้ำ & ติดตามภาพรังสี (ระวัง False negative)",
        "-"
      ]
    ],
    "pitfalls": [
      "กับดัก Lateral Luxation ฟันน้ำนม (IADT 2020): หาก 51 โยก 1 และ 61 เฉียงเข้าเพดานโดยไม่ขวางการสบฟัน ไม่ต้องใส่ Splint ให้จับสังเกตอาการปล่อยคืนตำแหน่งเอง!",
      "กับดักฟันน้ำนมเปลี่ยนสีไม่มีหนอง: ตาม IADT 2020 สีเทาหรือเหลืองที่ไม่มีอาการ/หนอง/เงาปลายราก ให้ Follow-up ยังไม่ทำ Pulpectomy ทันที; ยาปฏิชีวนะใน Avulsion ฟันแท้ใช้ Doxycycline (>8 ปี) หรือ Amoxicillin (<=8 ปี)"
    ],
    "pearl": "Primary Avulsion = ห้าม Replant! | Primary Lateral Luxation ไม่ขวางสบ = ปล่อยคืนที่เอง ไม่ Splint! | Permanent Avulsion = เก็บ HBSS/นมเย็น ห้ามขูดราก Flexible Splint 2 สัปดาห์!",
    "reference": "International Association of Dental Traumatology (IADT). Guidelines for the Management of Traumatic Dental Injuries. Dent Traumatol, 2020;36:314-358.",
    "decision_matrix": [
      {
        "col_0": "Avulsion (หลุดออกจากเบ้า)",
        "col_1": "ห้ามใส่กลับคืนเด็ดขาด (Never replant)",
        "col_2": "จับ Crown ใส่กลับทันที (ห้ามขูดราก!)",
        "col_3": "2 สัปดาห์ (<60 นาที) / 4 สัปดาห์ (>60 นาที)"
      },
      {
        "col_0": "Lateral Luxation / Subluxation",
        "col_1": "ไม่ขวางสบ = ปล่อยคืนที่เอง (Spontaneous repositioning); ไม่ Splint!",
        "col_2": "ดันฟันกลับเข้าที่ + Flexible splint",
        "col_3": "2 สัปดาห์ (Subluxation) / 4 สัปดาห์ (Lateral lux.)"
      },
      {
        "col_0": "Intrusion (กระแทกจมเบ้า)",
        "col_1": "เบนออกแก้ม = รอขึ้นเอง | เบนเข้าเพดาน = พิจารณาถอน",
        "col_2": "ปลายรากเปิด = รอขึ้นเอง | ปิด = ดึงกลับ + RCT 2 สัปดาห์",
        "col_3": "ขึ้นกับวิธีดึงกลับ"
      },
      {
        "col_0": "ฟันเปลี่ยนสี (Discoloration ไม่มีหนอง)",
        "col_1": "IADT 2020: Monitor/Follow-up ไม่ทำ Pulpectomy จากสีอย่างเดียว",
        "col_2": "ทดสอบความมีชีวิตซ้ำ & ติดตามภาพรังสี (ระวัง False negative)",
        "col_3": "-"
      }
    ]
  },
  "OralMed-Premalignant-Malignancy": {
    "title": "รอยโรคก่อนมะเร็งและมะเร็งเยื่อบุช่องปากชนิดสความัส (WHO OPMD 2020/2021 & OSCC)",
    "specialty": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "badgeColor": "#14b8a6",
    "must_know_topics": [
      "WHO 2020/2021 OPMD 11 Conditions",
      "Erythroplakia",
      "Leukoplakia & PVL",
      "Oral Squamous Cell Carcinoma",
      "Incisional Biopsy & 2-Week Rule"
    ],
    "overview": "มะเร็งช่องปากส่วนใหญ่ (>90%) เป็นชนิด Squamous Cell Carcinoma (OSCC) ซึ่งมักมีจุดเริ่มต้นจากรอยโรคก่อนมะเร็ง (Oral Potentially Malignant Disorders - OPMDs ตามฉันทามติ WHO 2020/2021) ทันตแพทย์ต้องสามารถตรวจจับสัญญาณอันตราย (Red Flags) และตัดสินใจส่งตรวจชิ้นเนื้อ (Biopsy) ได้อย่างทันท่วงที",
    "core_mechanism": "1. รอยโรคกลุ่มเสี่ยงก่อนมะเร็ง (WHO OPMD 2020/2021 Consensus — 11 กลุ่มโรค):\n- **อัปเดตเกณฑ์ WHO OPMD ล่าสุด**: เพิ่ม *Oral Lichenoid Lesions (OLL)* และ *Oral lesions of chronic GVHD* เข้ารายการ และตัด *Chronic Hyperplastic Candidiasis* ออกจากการจัดกลุ่ม OPMD อย่างเป็นทางการ\n- **Leukoplakia (แผ่นขาวที่ไม่สามารถเช็ดออกได้)**:\n  * นิยามของ WHO: แผ่นสีขาวที่ไม่สามารถเช็ดลอกออกได้ และไม่สามารถระบุการวินิจฉัยว่าเป็นโรคอื่นใดได้ทางคลินิกหรือพยาธิวิทยา\n  * อัตราการกลายพันธุ์เป็นมะเร็ง (Malignant Transformation Rate): Homogeneous ประมาณ 1 - 5% (แต่ชนิด Non-homogeneous เช่น Speckled และโดยเฉพาะ **Proliferative Verrucous Leukoplakia - PVL** มีอัตราการเป็นมะเร็งสูงมาก ~50 - 70% และเป็นซ้ำสูง)\n- **Erythroplakia (แผ่นแดงกำมะหยี่)**:\n  * **มีอัตราการกลายพันธุ์เป็นมะเร็งสูงที่สุดในบรรดา OPMDs ทั้งหมด (>85 - 90%)**\n  * เมื่อตัดตรวจชิ้นเนื้อ เกือบทั้งหมดจะพบเป็น Severe Dysplasia, Carcinoma in situ (CIS), หรือ Invasive SCC อยู่แล้ว!\n- **Oral Submucous Fibrosis (OSF)**:\n  * เกิดจากการเคี้ยวหมาก (Areca nut / Betel quid) โดยสาร Arecoline จะกระตุ้น Fibroblasts ให้สร้าง Collagen มากผิดปกติ และยับยั้ง Collagenase\n  * อาการ: อ้าปากได้น้อยลงเรื่อยๆ (Progressive trismus), เยื่อบุแก้มซีดแข็งเป็นเส้นใย (Fibrous bands), แสบร้อนเมื่อทานอาหารเผ็ด, สัมพันธ์กับ OSCC สูงมาก\n- **Oral Lichen Planus (OLP) & Oral Lichenoid Lesions (OLL)**:\n  * กลไกภูมิคุ้มกัน: CD8+ Cytotoxic T-lymphocytes ทำลายเซลล์ชั้น Basal keratinocytes ของเยื่อบุผิว\n  * ลักษณะทางคลินิก: รอยเส้นร่างแหสีขาวสมมาตรสองข้าง (Bilateral Wickham’s striae) บนเยื่อบุแก้ม (ส่วน OLL มักเป็นข้างเดียวหรือชิดวัสดุบูรณะ/จากยา ➔ ทดสอบ Skin patch test ร่วมกับ Biopsy)\n  * พยาธิวิทยา: มีแถบเซลล์เม็ดเลือดขาวลิมโฟไซต์เรียงตัวหนาแน่นใต้รอยต่อ (Dense band-like T-cell infiltrate), รอยต่อเยื่อบุผิวหยักแหลมเหมือนฟันเลื่อย (Saw-tooth rete pegs), พบ Apoptotic keratinocytes (Civatte bodies)\n\n2. มะเร็งเยื่อบุช่องปากชนิดสความัส (Oral Squamous Cell Carcinoma - OSCC):\n- **ตำแหน่งที่มีความเสี่ยงสูงที่สุด (High-Risk Anatomical Sites)**:\n  1) **ขอบด้านข้างและใต้โคนลิ้น (Ventrolateral border of the tongue)**: พบบ่อยที่สุด\n  2) **พื้นปาก (Floor of the mouth)**\n  3) เนื้อเยื่อด้านหลังฟันกรามล่างและเพดานอ่อน (Retromolar trigone & Soft palate)\n- **สัญญาณเตือนอันตรายทางคลินิก (Clinical Red Flags)**:\n  * แผลเรื้อรังที่ไม่หายภายใน **2 สัปดาห์**\n  * ขอบแผลยกม้วนหนาและแข็ง (Indurated, rolled borders)\n  * แผลยึดติดแน่นกับเนื้อเยื่อข้างใต้ ขยับไม่ได้ (Fixation to underlying tissues)\n  * คลำพบต่อมน้ำเหลืองที่คอโต แข็งเหมือนหิน ไม่เจ็บ และยึดติดแน่น (Stony hard, painless, fixed cervical lymph node)\n- **หลักการตัดตรวจชิ้นเนื้อ (Biopsy Principles)**:\n  * **Incisional Biopsy**: ตัดชิ้นเนื้อรูปวงรีหรือลิ่ม (Wedge shape) บริเวณขอบรอยโรคที่มีการลุกลาม โดย **ต้องครอบคลุมทั้งส่วนที่เป็นรอยโรคและส่วนเนื้อเยื่อปกติข้างเคียง (Margin of lesion + Normal tissue)** และต้องลึกถึงชั้นเนื้อเยื่อเกี่ยวพัน\n  * **ข้อห้าม**: ห้ามตัดตรงใจกลางแผลที่เป็นเนื้อตาย (Necrotic center) และห้ามใช้มีดไฟฟ้า (Electrosurgery) ในการตัดชิ้นเนื้อตรวจเพราะจะทำให้เซลล์ไหม้บวมผิดรูปแปลผลไม่ได้!",
    "matrix_headers": [
      "รอยโรค",
      "ลักษณะทางคลินิกเด่น",
      "อัตราการกลายพันธุ์เป็นมะเร็ง",
      "แนวทางการจัดการ (Management)"
    ],
    "matrix_rows": [
      [
        "Erythroplakia",
        "แผ่นแดงเรียบหรือกำมะหยี่ ไม่เจ็บ",
        "สูงที่สุด (>85-90% เป็นมะเร็ง)",
        "ตัดตรวจชิ้นเนื้อ (Biopsy) ทันทีโดยไม่รีรอ"
      ],
      [
        "Non-homogeneous Leukoplakia",
        "แผ่นขาวขรุขระ ตุ่มนูน มีจุดแดงปน (Speckled)",
        "สูง (15 - 30%)",
        "Biopsy ทันที และผ่าตัดกำจัดรอยโรคออก"
      ],
      [
        "Homogeneous Leukoplakia",
        "แผ่นขาวเรียบสม่ำเสมอ แบนราบ",
        "ต่ำ (1 - 5%)",
        "งดบุหรี่/สุรา, ติดตาม 2-4 สัปดาห์ ถ้าไม่หายต้อง Biopsy"
      ],
      [
        "Reticular Lichen Planus",
        "เส้นร่างแหขาวสมมาตรสองข้าง (Wickham striae)",
        "ต่ำ (<1-2%)",
        "ไม่ต้องรักษาถ้าไม่มีอาการ ติดตามผลประจำปี"
      ],
      [
        "Erosive Lichen Planus",
        "แผลถลอกแดง แสบเคือง มีเส้นขาวล้อมรอบ",
        "ต่ำถึงปานกลาง (~1-2%)",
        "Topical Corticosteroid (Fluocinonide/Clobetasol) + ติดตาม"
      ]
    ],
    "pitfalls": [
      "กับดักการตัดชิ้นเนื้อ (Biopsy Pitfall): การตัดชิ้นเนื้อสงสัยมะเร็ง ห้ามตัดจากบริเวณกึ่งกลางแผลที่มีแผ่นหนองหรือเนื้อตาย (Necrotic center) เด็ดขาด เพราะพยาธิแพทย์จะเห็นเพียงเนื้อเยื่อตายและเซลล์อักเสบ ทำให้วินิจฉัยพลาดเป็นแผลธรรมดา (False negative)!",
      "ข้อสอบชอบถามว่า \"รอยโรค OPMDs ชนิดใดมีอัตราการกลายพันธุ์เป็นมะเร็งสูงที่สุด?\" คำตอบคือ **Erythroplakia** ไม่ใช่ Leukoplakia!"
    ],
    "pearl": "กฎ 14 วัน (The 2-Week Rule): แผลในช่องปากใดๆ ที่กำจัดสาเหตุระคายเคือง (เช่น กรอฟันคม ถอดฟันเทียม) แล้วยังไม่หายภายใน 14 วัน \"ต้องได้รับการตัดชิ้นเนื้อตรวจ (Incisional Biopsy) ทุกรายโดยไม่มีข้อยกเว้น\"!",
    "reference": "Warnakulasuriya S, et al. Oral potentially malignant disorders: A consensus report (WHO Collaborating Centre, 2020/2021); WHO Classification of Head and Neck Tumours, 5th ed. (2022); Neville BW, et al. Oral and Maxillofacial Pathology, 5th ed. Elsevier, 2024.",
    "decision_matrix": [
      {
        "col_0": "Erythroplakia",
        "col_1": "แผ่นแดงเรียบหรือกำมะหยี่ ไม่เจ็บ",
        "col_2": "สูงที่สุด (>85-90% เป็นมะเร็ง)",
        "col_3": "ตัดตรวจชิ้นเนื้อ (Biopsy) ทันทีโดยไม่รีรอ"
      },
      {
        "col_0": "Non-homogeneous Leukoplakia",
        "col_1": "แผ่นขาวขรุขระ ตุ่มนูน มีจุดแดงปน (Speckled)",
        "col_2": "สูง (15 - 30%)",
        "col_3": "Biopsy ทันที และผ่าตัดกำจัดรอยโรคออก"
      },
      {
        "col_0": "Homogeneous Leukoplakia",
        "col_1": "แผ่นขาวเรียบสม่ำเสมอ แบนราบ",
        "col_2": "ต่ำ (1 - 5%)",
        "col_3": "งดบุหรี่/สุรา, ติดตาม 2-4 สัปดาห์ ถ้าไม่หายต้อง Biopsy"
      },
      {
        "col_0": "Reticular Lichen Planus",
        "col_1": "เส้นร่างแหขาวสมมาตรสองข้าง (Wickham striae)",
        "col_2": "ต่ำ (<1-2%)",
        "col_3": "ไม่ต้องรักษาถ้าไม่มีอาการ ติดตามผลประจำปี"
      },
      {
        "col_0": "Erosive Lichen Planus",
        "col_1": "แผลถลอกแดง แสบเคือง มีเส้นขาวล้อมรอบ",
        "col_2": "ต่ำถึงปานกลาง (~1-2%)",
        "col_3": "Topical Corticosteroid (Fluocinonide/Clobetasol) + ติดตาม"
      }
    ]
  },
  "OralMed-Medically-Compromised-CVD": {
    "title": "การดูแลผู้ป่วยโรคหัวใจ หลอดเลือด และเกณฑ์ป้องกันเยื่อบุหัวใจอักเสบ (AHA 2021 IE Guidelines & CVD)",
    "specialty": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "badgeColor": "#14b8a6",
    "must_know_topics": [
      "AHA 2021 IE Prophylaxis",
      "Clindamycin Removed",
      "Hypertension Limits",
      "Warfarin INR Cutoff",
      "Antiplatelet Bleeding"
    ],
    "overview": "ทันตแพทย์ต้องประเมินและบริหารจัดการผู้ป่วยโรคระบบได้อย่างปลอดภัย โดยเฉพาะแนวทางสมาคมโรคหัวใจอเมริกัน (AHA 2021 Update) สำหรับการป้องกัน Infective Endocarditis ซึ่งมีการตัดยา Clindamycin ออกอย่างเป็นทางการ และการจัดการยาต้านการแข็งตัวของเลือด",
    "core_mechanism": "1. เกณฑ์การให้ยาปฏิชีวนะป้องกันเยื่อบุหัวใจอักเสบ (AHA 2021 IE Prophylaxis Update):\n- **หัตถการทันตกรรมที่ต้องให้ยาป้องกัน**: หัตถการที่มีการแตะต้องเนื้อเยื่อเหงือก (Manipulation of gingival tissue), บริเวณปลายรากฟัน (Periapical region), หรือมีการทะลุผ่านเยื่อบุช่องปาก (Perforation of oral mucosa) เช่น ขูดหินปูนใต้เหงือก, ถอนฟัน, ผ่าฟันคุด, ผ่าตัดปริทันต์, ใส่แถบจัดฟัน\n- **กลุ่มผู้ป่วยโรคหัวใจที่มีข้อบ่งชี้สูงสุด (High-Risk Cardiac Conditions Only)**:\n  1) ผู้ป่วยที่ได้รับการเปลี่ยนลิ้นหัวใจเทียม (Prosthetic cardiac valve หรือใช้วัสดุเทียมซ่อมแซมลิ้น)\n  2) ผู้ป่วยที่มีประวัติเคยเป็นเยื่อบุหัวใจอักเสบมาก่อน (Previous history of Infective Endocarditis)\n  3) ผู้ป่วยโรคหัวใจพิการแต่กำเนิด (Congenital Heart Disease - CHD):\n     - โรคหัวใจพิการแต่กำเนิดชนิดเขียวที่ยังไม่ได้ผ่าตัดแก้ไข (Unrepaired cyanotic CHD)\n     - ได้รับการผ่าตัดซ่อมแซมด้วยวัสดุเทียมมายังไม่เกิน **6 เดือน**\n     - ผ่าตัดซ่อมแซมแล้วแต่ยังมีข้อบกพร่องตกค้าง (Repaired CHD with residual defects)\n  4) ผู้ป่วยที่ได้รับการปลูกถ่ายหัวใจและเกิดลิ้นหัวใจผิดปกติ (Cardiac transplant with valvulopathy)\n- **สูตรยาป้องกัน (Antibiotic Regimen - รับประทานก่อนทำหัตถการ 30 - 60 นาที)**:\n  * ผู้ป่วยทั่วไป: **Amoxicillin 2.0 กรัม รับประทานครั้งเดียว (เด็ก: 50 mg/kg)**\n  * ผู้ป่วยที่แพ้ยากลุ่ม Penicillin:\n    - **Cephalexin 2.0 กรัม** (ใช้ได้เฉพาะกรณีที่ไม่มีประวัติแพ้ Penicillin แบบ Anaphylaxis, ลมพิษ, หรือ Angioedema)\n    - **Azithromycin หรือ Clarithromycin 500 มก.** (เด็ก: 15 mg/kg)\n    - **Doxycycline 100 มก.**\n  * **การเปลี่ยนแปลงครั้งประวัติศาสตร์ของ AHA 2021**: **\"ยกเลิกการใช้ Clindamycin อย่างเป็นทางการ (OFFICIALLY REMOVED!)\"** เนื่องจาก Clindamycin มีความเสี่ยงสูงมากต่อการเกิดโรคลำไส้อักเสบรุนแรงจากเชื้อ *Clostridioides difficile* (Pseudomembranous colitis) ซึ่งเป็นอันตรายถึงชีวิต!\n\n2. ภาวะความดันโลหิตสูง (Hypertension Management):\n- **เกณฑ์วินิจฉัยความดันโลหิตสูง**: สมาคมความดันโลหิตสูงแห่งประเทศไทย / WHO / ESC ใช้ **>= 140/90 mmHg** (เกณฑ์สอบ NL หลัก) ขณะที่ **ACC/AHA 2017 & 2025** ปรับเกณฑ์ Stage 1 เร็วขึ้นเป็น **>= 130/80 mmHg** (Stage 2 >= 140/90 mmHg)\n- BP < 140/90 mmHg: ทำทันตกรรมได้ตามปกติ | BP 140-159 / 90-99 mmHg: ทำได้ ลดเครียด วัดซ้ำ\n- BP 160-179 / 100-109 mmHg: ทำเฉพาะฉุกเฉินไม่ซับซ้อน คุมขนาด Epinephrine\n- **BP >= 180/110 mmHg (Hypertensive Crisis)**: **ห้ามทำทันตกรรม Elective ทุกชนิดเด็ดขาด!** ส่งต่อพบแพทย์ทันที\n- ขนาดยาสูงสุดของ Epinephrine ในผู้ป่วยโรคหัวใจและความดันโลหิตสูง: **0.04 mg (เท่ากับยาชา 1:100,000 ไม่เกิน 2 หลอด)**\n\n3. ยาต้านการแข็งตัวของเลือดและเกล็ดเลือด (Anticoagulants & Antiplatelets):\n- **Warfarin (Coumadin)**:\n  * ต้องตรวจค่า **INR (International Normalized Ratio)** ภายใน 24 ถึง 72 ชั่วโมงก่อนทำหัตถการ\n  * **ค่า INR <= 3.5: สามารถถอนฟันหรือทำศัลยศาสตร์ช่องปากขนาดเล็กได้โดยไม่ต้องหยุดยา Warfarin!** (หลีกเลี่ยง Miconazole oral gel / Metronidazole / NSAIDs ที่เพิ่ม INR!)\n  * ให้ใช้สารช่วยห้ามเลือดเฉพาะที่ (Local hemostatic measures): เย็บปิดแผลแน่นหนา, ใส่ Gelfoam/Surgicel, อมกลั้วน้ำยา **Tranexamic acid 4.8–5%**\n- **Aspirin / Clopidogrel (Plavix) / Dual Antiplatelet Therapy (DAPT)**:\n  * **กฎเหล็ก: \"ห้ามสั่งหยุดยา Aspirin หรือ Clopidogrel เพื่อมาทำฟันเด็ดขาด!\"**\n  * เหตุผล: ความเสี่ยงต่อการเกิดลิ่มเลือดอุดตันในสมอง (Stroke) หรือหลอดเลือดหัวใจ (Stent thrombosis) อันตรายถึงชีวิตมากกว่าความเสี่ยงเลือดออกในช่องปากซึ่งสามารถห้ามได้ด้วยมาตรการเฉพาะที่!",
    "matrix_headers": [
      "สภาวะทางการแพทย์",
      "เกณฑ์การประเมิน",
      "แนวทางปฏิบัติทางทันตกรรม",
      "ข้อควรระวังอันตรายถึงชีวิต"
    ],
    "matrix_rows": [
      [
        "Infective Endocarditis Risk",
        "ลิ้นหัวใจเทียม, เคยเป็น IE, โรคหัวใจเขียว",
        "Amoxicillin 2g (แพ้เพนให้ Azithromycin 500mg)",
        "ห้ามจ่าย Clindamycin (AHA 2021 ตัดออกแล้ว)"
      ],
      [
        "Hypertension Crisis",
        "BP >= 180/110 mmHg",
        "ห้ามทำฟันเด็ดขาด ส่งพบแพทย์ทันที",
        "เสี่ยง Stroke และ Acute MI ฉุกเฉินบนเก้าอี้ทำฟัน"
      ],
      [
        "Warfarin Therapy",
        "ตรวจค่า INR ภายใน 24-72 ชม.",
        "ถ้า INR <= 3.5 ทำฟันได้โดยไม่ต้องหยุดยา",
        "ห้ามหยุดยาเอง เสี่ยงลิ่มเลือดอุดตันในสมอง"
      ],
      [
        "Aspirin / Plavix (Antiplatelets)",
        "ทานยาต้านเกล็ดเลือดประจำ",
        "ทำฟันได้เลย ห้ามสั่งหยุดยา ใช้ Local hemostasis",
        "การหยุดยาทำให้เกิด Stent thrombosis เสียชีวิตได้"
      ]
    ],
    "pitfalls": [
      "กับดัก Clindamycin ในข้อสอบปัจจุบัน: ข้อสอบเก่ามักเฉลย Clindamycin 600 mg สำหรับคนแพ้ Penicillin แต่ข้อสอบตามเกณฑ์มาตรฐานปัจจุบัน AHA 2021 \"Clindamycin ถูกถอดถอนแล้ว\" หากคนไข้แพ้ Amoxicillin ตัวเลือกที่ถูกต้องคือ Azithromycin 500 mg, Cephalexin 2 g หรือ Doxycycline 100 mg!",
      "คนไข้เปลี่ยนข้อสะโพก/ข้อเข่าเทียม (Prosthetic Joint Replacement): ตามแนวทางร่วม ADA/AAOS ปัจจุบัน **ไม่จำเป็นต้องให้ยาปฏิชีวนะป้องกันก่อนทำฟันเป็นกิจวัตรอีกต่อไป** เว้นแต่มีภาวะภูมิคุ้มกันบกพร่องรุนแรงและแพทย์ศัลยกรรมกระดูกสั่งการเฉพาะราย!"
    ],
    "pearl": "ผู้ป่วยหลังทำฟันมีอาการบ้านหมุน ใจสั่น ตาลาย (Orthostatic hypotension / Vasovagal presyncope): ให้รีบปรับเก้าอี้นอนราบ (Supine) และยกขาสูงทันที ตามหลัก Malamed และนัดทำฟันผู้ป่วยเบาหวานในตอนเช้าหลังกินข้าว-ยาปกติ!",
    "reference": "American Heart Association (AHA) 2021 Update (Circulation 2021;143:e963-e978); ACC/AHA 2017 & 2025 High Blood Pressure Guidelines; Little and Falace’s Dental Management of the Medically Compromised Patient, 10th ed. Elsevier, 2023.",
    "decision_matrix": [
      {
        "col_0": "Infective Endocarditis Risk",
        "col_1": "ลิ้นหัวใจเทียม, เคยเป็น IE, โรคหัวใจเขียว",
        "col_2": "Amoxicillin 2g (แพ้เพนให้ Azithromycin 500mg)",
        "col_3": "ห้ามจ่าย Clindamycin (AHA 2021 ตัดออกแล้ว)"
      },
      {
        "col_0": "Hypertension Crisis",
        "col_1": "BP >= 180/110 mmHg",
        "col_2": "ห้ามทำฟันเด็ดขาด ส่งพบแพทย์ทันที",
        "col_3": "เสี่ยง Stroke และ Acute MI ฉุกเฉินบนเก้าอี้ทำฟัน"
      },
      {
        "col_0": "Warfarin Therapy",
        "col_1": "ตรวจค่า INR ภายใน 24-72 ชม.",
        "col_2": "ถ้า INR <= 3.5 ทำฟันได้โดยไม่ต้องหยุดยา",
        "col_3": "ห้ามหยุดยาเอง เสี่ยงลิ่มเลือดอุดตันในสมอง"
      },
      {
        "col_0": "Aspirin / Plavix (Antiplatelets)",
        "col_1": "ทานยาต้านเกล็ดเลือดประจำ",
        "col_2": "ทำฟันได้เลย ห้ามสั่งหยุดยา ใช้ Local hemostasis",
        "col_3": "การหยุดยาทำให้เกิด Stent thrombosis เสียชีวิตได้"
      }
    ]
  },
  "OralMed-Odontogenic-Cysts-Tumors": {
    "title": "ถุงน้ำและเนื้องอกที่มีกำเนิดจากเนื้อเยื่อสร้างฟัน (Odontogenic Cysts & Tumors)",
    "specialty": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "badgeColor": "#14b8a6",
    "must_know_topics": [
      "Odontogenic Keratocyst",
      "OKC PTCH1 Gene",
      "Gorlin Goltz Syndrome",
      "Ameloblastoma",
      "Dentigerous Cyst"
    ],
    "overview": "ถุงน้ำและเนื้องอกในขากรรไกรเป็นหัวข้อสำคัญในข้อสอบ NL ทันตแพทย์ต้องสามารถแยกแยะระหว่าง Dentigerous Cyst, Odontogenic Keratocyst (OKC) และ Ameloblastoma จากลักษณะทางภาพรังสี ชีววิทยาระดับโมเลกุล และการรักษา",
    "core_mechanism": "1. ถุงน้ำ Odontogenic Keratocyst (OKC):\n- **กำเนิดและพันธุศาสตร์ (Pathogenesis & Genetics)**:\n  * เจริญมาจากเศษเนื้อเยื่อ Dental Lamina (Rests of Serres)\n  * เกิดการกลายพันธุ์ของยีน **PTCH1 (Patched-1 Tumor Suppressor Gene)** บนโครโมโซมคู่ที่ 9q22 ซึ่งควบคุม Sonic Hedgehog Signaling Pathway\n  * สัมพันธ์กับ **Gorlin-Goltz Syndrome (Nevoid Basal Cell Carcinoma Syndrome)**:\n    - พบ Multiple OKCs ในขากรรไกรตั้งแต่อายุน้อย\n    - Multiple Basal Cell Carcinomas ที่ผิวหนัง\n    - ซี่โครงแยกสองแฉก (Bifid ribs)\n    - รอยบุ๋มที่ฝ่ามือฝ่าเท้า (Palmar/Plantar pitting)\n    - เยื่อหุ้มสมองกลายเป็นหินปูน (Calcification of falx cerebri)\n- **พยาธิวิทยาเนื้อเยื่อ (Histopathology of OKC)**:\n  * ผนังบุผิวเป็น Parakeratinized stratified squamous epithelium หนาสม่ำเสมอเพียง **6 ถึง 8 ชั้นเซลล์**\n  * ผิวชั้นบนเป็นคลื่นหยัก (Corrugated parakeratin surface)\n  * เซลล์ชั้นฐาน (Basal layer) เรียงตัวเป็นระเบียบชัดเจน คล้ายแนวรั้วบ้านหรือเสาหินปักหน้าหลุมศพ (**Palisaded basal layer / Tombstone pattern**)\n  * ไม่มี Rete pegs (Flat epithelial-connective tissue interface) ทำให้เยื่อบุหลุดลอกออกจากผนังถุงน้ำได้ง่ายมากในขณะผ่าตัด\n  * พบถุงน้ำขนาดเล็กในผนัง (Satellite / Daughter cysts) ซึ่งเป็นสาเหตุสำคัญที่ทำให้ **มีอัตราการเกิดซ้ำสูงมาก (High recurrence rate 10 - 30%)**\n- **การรักษา**: Enucleation ร่วมกับ Carnoy's solution หรือ Cryotherapy หรือทำ Marsupialization/Decompression ก่อน\n\n2. เนื้องอก Ameloblastoma (ชนิด Solid/Multicystic / Conventional):\n- เนื้องอกแท้จริง (Benign neoplasm) ที่มีพฤติกรรมลุกลามแทรกซึมกระดูกเบ้าฟันอย่างรุนแรง (Locally invasive) โดยกว่า ~60-80% ของ Ameloblastoma ในขากรรไกรล่างพบการกลายพันธุ์ของยีน **BRAF V600E** (และ WHO 2022 5th ed. ได้เพิ่ม **Adenoid ameloblastoma** เป็นชนิดใหม่ในกลุ่มเนื้องอก และเพิ่ม **Surgical ciliated cyst** ในกลุ่มถุงน้ำขากรรไกรอย่างเป็นทางการ!)\n- **ลักษณะทางภาพรังสี**: เงาดำโปร่งรังสีหลายห้อง (**Multilocular radiolucency**) คล้ายฟองสบู่ (**Soap-bubble**) หรือรวงผึ้ง (**Honeycomb appearance**), ขอบหยักชัดเจน, ทำให้กระดูกขากรรไกรโป่งพอง (Cortical expansion) และเกิดการละลายของรากฟันข้างเคียงแบบถูกมีดตัดตรง (**Knife-cut root resorption**)\n- **พยาธิวิทยา (Histology)**:\n  * มีลักษณะเข้าเกณฑ์ **Vickers-Gorlin Criteria**: เซลล์ชั้นนอกเป็นรูปทรงกระบอกสูงคล้าย Ameloblasts โดยมีนิวเคลียสถอยห่างจากเยื่อฐาน (**Reverse nuclear polarity**) ร่วมกับ Cytoplasmic vacuolization ส่วนเซลล์ชั้นกลางสานกันหลวมๆ คล้าย **Stellate Reticulum**\n- **การรักษามาตรฐาน**: **การผ่าตัดกระดูกขากรรไกรออกเป็นบริเวณกว้าง (Wide surgical resection with safe margin 1.0 - 1.5 cm)** ห้ามใช้วิธีขูดออก (Curettage) เพียงอย่างเดียวเด็ดขาด เพราะอัตราการกลับมาเป็นซ้ำสูงถึง 50 - 90%!\n\n3. Dentigerous Cyst (Follicular Cyst) & กลุ่มรอยโรคสำคัญอื่น:\n- เกิดจากการสะสมของของเหลวระหว่าง Reduced Enamel Epithelium กับตัวฟัน\n- ภาพรังสี: เงาดำโปร่งรังสีห้องเดียวล้อมรอบตัวฟันที่ยังไม่ขึ้น โดย **ขอบเงาดำต้องเกาะยึดติดอยู่ที่ระดับรอยต่อเคลือบฟัน-เคลือบรากฟัน (Cementoenamel Junction - CEJ)** เสมอ! (ต่างจาก **AOT** ที่มักพบบริเวณฟันเขี้ยวบนหญิงอายุน้อยและคลุม **เลยระดับ CEJ** ลงมาถึงรากฟัน | **COC** เด่นเรื่อง Ghost cells)\n- การรักษา: ผ่าตัดเลาะถุงน้ำออก (Enucleation) พร้อมถอนฟันซี่ที่ฝังตัว หรือทำ Marsupialization ในเด็กเพื่อเก็บฟันแท้",
    "matrix_headers": [
      "รอยโรค",
      "ลักษณะภาพรังสี",
      "พยาธิวิทยาเนื้อเยื่อเด่น",
      "การรักษามาตรฐาน"
    ],
    "matrix_rows": [
      [
        "Dentigerous Cyst",
        "เงาดำเกาะยึดที่ระดับ CEJ รอบฟันคุด",
        "เยื่อบุบาง 2-4 ชั้น Non-keratinized",
        "Enucleation เลาะถุงน้ำพร้อมถอนฟันคุด"
      ],
      [
        "Odontogenic Keratocyst (OKC)",
        "เงาดำห้องเดี่ยว/หลายห้อง ลามตามแนวยาวกระดูก",
        "Parakeratin 6-8 ชั้น, Palisaded basal (Tombstone)",
        "Enucleation + Carnoy’s solution หรือ Decompression"
      ],
      [
        "Ameloblastoma",
        "Multilocular soap-bubble, Knife-cut resorption",
        "Reverse nuclear polarity + Stellate reticulum",
        "Wide surgical resection (Safe margin 1.0-1.5 ซม.)"
      ],
      [
        "Radicular (Periapical) Cyst",
        "เงาดำที่ปลายรากฟันตาย (Non-vital tooth)",
        "Stratified squamous, มี Rushton bodies และ Cholesterol",
        "รักษารากฟัน (RCT) หรือ ผ่าตัดปลายราก (Apicoectomy)"
      ]
    ],
    "pitfalls": [
      "กับดัก OKC ขยายตัว: OKC มักขยายตัวตามความยาวของขากรรไกรในแนวหน้า-หลัง (Anteroposterior expansion) ภายในโพรงกระดูกไขกระดูก (Medullary space) โดยที่ **กระดูกด้านแก้มและลิ้นแทบไม่โป่งพองเลย (Minimal cortical expansion)** ต่างจาก Ameloblastoma ที่จะดันกระดูกโป่งพองชัดเจน!",
      "การวินิจฉัย Radicular cyst vs Dentigerous cyst: ต้องทดสอบความมีชีวิตของฟัน (Vitality test) เสมอ Radicular cyst เกิดจากฟันที่ตายแล้ว (Pulp necrosis) เท่านั้น ส่วน Dentigerous cyst สัมพันธ์กับฟันที่ยังไม่ขึ้น!"
    ],
    "pearl": "จำความสัมพันธ์ของยีน PTCH1 กับ Gorlin-Goltz Syndrome และ BRAF V600E กับ Ameloblastoma (เกณฑ์ Vickers-Gorlin) พร้อมจำ WHO 2022 5th ed. ที่เพิ่ม Adenoid ameloblastoma & Surgical ciliated cyst!",
    "reference": "WHO Classification of Head and Neck Tumours, 5th ed. IARC, 2022; Neville BW, et al. Oral and Maxillofacial Pathology, 5th ed. Elsevier, 2024 (Chapter 15: Odontogenic Cysts and Tumors).",
    "decision_matrix": [
      {
        "col_0": "Dentigerous Cyst",
        "col_1": "เงาดำเกาะยึดที่ระดับ CEJ รอบฟันคุด",
        "col_2": "เยื่อบุบาง 2-4 ชั้น Non-keratinized",
        "col_3": "Enucleation เลาะถุงน้ำพร้อมถอนฟันคุด"
      },
      {
        "col_0": "Odontogenic Keratocyst (OKC)",
        "col_1": "เงาดำห้องเดี่ยว/หลายห้อง ลามตามแนวยาวกระดูก",
        "col_2": "Parakeratin 6-8 ชั้น, Palisaded basal (Tombstone)",
        "col_3": "Enucleation + Carnoy’s solution หรือ Decompression"
      },
      {
        "col_0": "Ameloblastoma",
        "col_1": "Multilocular soap-bubble, Knife-cut resorption",
        "col_2": "Reverse nuclear polarity + Stellate reticulum",
        "col_3": "Wide surgical resection (Safe margin 1.0-1.5 ซม.)"
      },
      {
        "col_0": "Radicular (Periapical) Cyst",
        "col_1": "เงาดำที่ปลายรากฟันตาย (Non-vital tooth)",
        "col_2": "Stratified squamous, มี Rushton bodies และ Cholesterol",
        "col_3": "รักษารากฟัน (RCT) หรือ ผ่าตัดปลายราก (Apicoectomy)"
      }
    ]
  },
  "TMD-DC-TMD-Diagnostic-Criteria": {
    "title": "เกณฑ์การตรวจวินิจฉัยความผิดปกติของข้อต่อขากรรไกรและกล้ามเนื้อบดเคี้ยว (DC/TMD Diagnostic Criteria)",
    "specialty": "ทันตกรรมบดเคี้ยวและอาการปวดใบหน้า",
    "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    "badgeColor": "#06b6d4",
    "must_know_topics": [
      "DC/TMD Criteria",
      "Disc Displacement with Reduction",
      "Closed Lock",
      "Myalgia vs Myofascial",
      "Stabilization Splint"
    ],
    "overview": "เกณฑ์มาตรฐานสากล Diagnostic Criteria for Temporomandibular Disorders (DC/TMD 2014) แบ่งการวินิจฉัย Axis I ออกเป็นกลุ่มโรคกล้ามเนื้อบดเคี้ยว (Muscle Disorders) และกลุ่มโรคข้อต่อขากรรไกร (Joint Disorders) ทันตแพทย์ต้องสามารถแยกแยะเสียงคลิก (Clicking) เสียงกรอบแกรบ (Crepitus) และอาการอ้าปากติดขัดได้อย่างถูกต้อง",
    "core_mechanism": "1. กลุ่มโรคกล้ามเนื้อบดเคี้ยว (Masticatory Muscle Disorders):\n- **Local Myalgia (ปวดกล้ามเนื้อเฉพาะที่)**: มีอาการปวดบริเวณกล้ามเนื้อบดเคี้ยว (Masseter หรือ Temporalis) เมื่อคลำตรวจด้วยแรง 1 กก. เป็นเวลา 2-5 วินาที โดย **ความเจ็บปวดจะจำกัดอยู่เฉพาะในขอบเขตของมัดกล้ามเนื้อที่ถูกกดเท่านั้น ไม่มีการกระจายปวดร้าวออกนอกมัดกล้ามเนื้อ**\n- **Myofascial Pain with Referral (ปวดกล้ามเนื้อร่วมกับปวดร้าว)**: มีจุดกดเจ็บกล้ามเนื้อ (Trigger point) และ **เมื่อกดแล้วเกิดอาการปวดร้าวแผ่ออกไปนอกขอบเขตของกล้ามเนื้อมัดนั้น (Pain referral beyond the muscle boundary)** เช่น กดกล้ามเนื้อ Masseter แล้วปวดร้าวไปยังฟันกรามล่าง หรือกด Temporalis แล้วปวดร้าวไปขมับและฟันบน\n\n2. กลุ่มโรคข้อต่อขากรรไกร (TMJ Arthropathies & Disc Derangements):\n- **Disc Displacement with Reduction (DDwR - หมอนรองกระดูกเคลื่อนกลับเข้าที่ได้)**:\n  * หมอนรองกระดูกเลื่อนไปข้างหน้าในขณะหุบปาก (Anterior displacement)\n  * อาการแสดง: มี **เสียงคลิก (Clicking sound)** ขณะอ้าปาก (เมื่อหัวขากรรไกร Condyle เคลื่อนปีนกลับขึ้นบนหมอนรอง) และมีเสียงคลิกอีกครั้งขณะหุบปาก (Reciprocal click)\n  * ขากรรไกรจะเบนออกไปด้านที่เป็นรอยโรคขณะอ้าปาก แล้วเคลื่อนกลับเข้าสู่แนวกึ่งกลางเมื่อหมอนเข้าที่ (S-shaped deviation)\n  * **ไม่มีการจำกัดระยะการอ้าปาก** (อ้าปากได้กว้างปกติ >40 มม.)\n- **Disc Displacement without Reduction with Limited Opening (DDwoR - Closed Lock เฉียบพลัน)**:\n  * หมอนรองกระดูกติดขัดอยู่ข้างหน้าตลอดเวลา ไม่สามารถปีนกลับเข้าที่ได้\n  * อาการแสดง: **อ้าปากได้แคบลงเฉียบพลันอย่างรุนแรง (Maximum unassisted opening < 40 มม. และ Assisted opening < 40 มม.)**\n  * คางจะเบี่ยงเบนไปทาง \"ข้างที่มีรอยโรค (Deflection towards the affected side)\" ตลอดแนวการอ้าปาก\n  * **เสียงคลิกที่เคยมีจะ \"หายไปสนิท\"** เนื่องจากหัวคอนดายล์ไม่สามารถปีนข้ามหมอนรองกระดูกได้อีกต่อไป\n- **Degenerative Joint Disease (DJD / Osteoarthritis vs. Osteoarthrosis)**:\n  * เกิดจากการสึกหรอและทำลายของกระดูกอ่อนข้อต่อและพื้นผิวกระดูก\n  * อาการแสดงสำคัญ: มี **เสียงกรอบแกรบ หรือ เสียงบดทราย (Coarse Crepitus)** ดังตลอดช่วงการอ้าและหุบปาก\n  * แยกตามเกณฑ์ DC/TMD: **Osteoarthritis** = มี Crepitus + ภาพรังสีข้อเสื่อม + **มีอาการปวด/คลำเจ็บที่ข้อต่อ** | **Osteoarthrosis** = มี Crepitus + ภาพรังสีข้อเสื่อม แต่ **ไม่มีอาการปวด**\n  * ภาพรังสี (**CBCT/CT** ดีที่สุดสำหรับกระดูก): พบกระดูกคอนดายล์แบนลง (Flattening), กระดูกใต้ข้อต่อหนาแน่นทึบรังสี (Subchondral sclerosis), กระดูกงอกเป็นจะงอยปากนก (**Osteophyte formation / Bird-beak appearance**), และการกร่อนแหว่ง (Erosion)\n- **TMJ Subluxation (Hypermobility) & Acute Traumatic Arthralgia/Retrodiscitis**:\n  * **TMJ Subluxation**: อ้าปากกว้างมากผิดปกติ (>55–60 มม.) Condyle เลื่อนข้ามยอด Eminence ไปด้านหน้า (จำกัดระยะอ้า/ประคองคางเวลาหาว)\n  * **Acute Retrodiscitis (กระแทกคางเฉียบพลัน)**: Joint effusion ดัน Condyle ลงล่างทำให้ **สบฟันกรามข้างนั้นไม่ลง (Ipsilateral posterior open bite)** — รักษาด้วยอาหารอ่อน พักข้อต่อ น้ำแข็ง 24–48 ชม. แรก + NSAIDs และ **ห้ามกรอปรับสบฟันเด็ดขาด!**\n\n3. การเลือกใช้เฝือกสบฟัน (Occlusal Splint Therapy):\n- **Stabilization Splint (Michigan Splint / Flat Plane Splint)**:\n  * เฝือกสบฟันระนาบเรียบ ให้การสบฟันแบบ Mutually Protected Occlusion มี Canine Guidance\n  * สวมใส่เวลากลางคืนเพื่อลดแรงกดดันในข้อต่อ ลดการทำงานของกล้ามเนื้อ และป้องกันการสึกของฟันจาก Bruxism เป็น **Gold Standard สำหรับ Myalgia, Arthralgia และ Bruxism**\n- **Anterior Repositioning Splint (เฝือกสบฟันปรับตำแหน่งไปข้างหน้า)**:\n  * ทำหน้าที่ประคองให้ขากรรไกรล่างยื่นมาด้านหน้าเล็กน้อยตลอดเวลาเพื่อคงหมอนรองกระดูกให้อยู่บนหัวคอนดายล์\n  * **ข้อบ่งชี้จำเพาะ**: ใช้เฉพาะในผู้ป่วยที่มีภาวะ **DDwR ชนิดมีอาการปวดรุนแรงหรือมีอาการติดขัดเป็นช่วงๆ (Painful DDwR with intermittent locking)**\n  * **ข้อควรระวังอันตราย**: ห้ามใส่ติดต่อกันเกิน 2 ถึง 3 เดือน เพราะจะทำให้เกิดการสบฟันเปิดด้านหลังอย่างถาวร (Irreversible posterior open bite)!",
    "matrix_headers": [
      "โรคของข้อต่อ/กล้ามเนื้อ",
      "ลักษณะเสียงในข้อต่อ",
      "ระยะการอ้าปาก (Mouth Opening)",
      "ภาพรังสีข้อต่อ (Imaging)"
    ],
    "matrix_rows": [
      [
        "Disc Displacement c Reduction",
        "เสียงคลิก (Clicking) ไป-กลับ",
        "อ้าปากได้กว้างปกติ (>40 มม.), S-shaped deviation",
        "กระดูก Condyle รูปทรงปกติ"
      ],
      [
        "Disc Displacement s Reduction (Lock)",
        "ไม่มีเสียง (เสียงคลิกหายไป)",
        "อ้าปากติดขัดรุนแรง (<40 มม.), Deflection ไปข้างที่เป็น",
        "หมอนรองอยู่หน้า Condyle ตลอดเวลา"
      ],
      [
        "Degenerative Joint Disease (DJD)",
        "เสียงกรอบแกรบ/บดทราย (Crepitus)",
        "อาจอ้าปากได้น้อย มีอาการเจ็บตึง",
        "Condyle แบน, มีจะงอยกระดูกงอก (Osteophyte)"
      ],
      [
        "Local Myalgia",
        "ไม่มีเสียงในข้อต่อ",
        "อ้าปากได้ตามปกติ หรือติดเล็กน้อยจากกล้ามเนื้อเกร็ง",
        "ข้อต่อขากรรไกรปกติ"
      ]
    ],
    "pitfalls": [
      "กับดักเสียงคลิกหายไป: คนไข้มีประวัติขากรรไกรมีเสียงคลิกมานานหลายปี จู่ๆ เช้าวันหนึ่งตื่นมาแล้วอ้าปากไม่ขึ้นและ \"เสียงคลิกหายไปสนิท\" ข้อสอบถามว่าเกิดจากอะไร? -> คำตอบคือ เกิดภาวะ **Closed Lock (Disc Displacement without Reduction)** ไม่ใช่หายดี!",
      "ความแตกต่างระหว่าง Deviation vs Deflection: Deviation คืออ้าปากแล้วคางเบนออกไปข้างหนึ่งแล้วกลับมาตรงกึ่งกลางเมื่ออ้าสุด (พบใน DDwR) ส่วน Deflection คือคางเฉออกไปข้างที่มีรอยโรคแล้วไม่กลับมาตรงกึ่งกลางเลย (พบใน Closed Lock)!"
    ],
    "pearl": "เสียง Crepitus (เสียงกรอบแกรบเหมือนเดินเหยียบก้อนกรวด) เป็นอาการแสดงจำเพาะ (Pathognomonic sign) ของโรคข้อเสื่อม Degenerative Joint Disease (Osteoarthritis) หากได้ยินเสียงนี้ ตอบ DJD ทันที!",
    "reference": "Schiffman E, et al. Diagnostic Criteria for Temporomandibular Disorders (DC/TMD) for Clinical and Research Applications. J Oral Facial Pain Headache, 2014;28(1):6-27; de Leeuw R, Klasser GD. AAOP Guidelines, 7th ed. 2023; Okeson JP. Management of Temporomandibular Disorders and Occlusion, 8th ed. Elsevier, 2020.",
    "decision_matrix": [
      {
        "col_0": "Disc Displacement c Reduction",
        "col_1": "เสียงคลิก (Clicking) ไป-กลับ",
        "col_2": "อ้าปากได้กว้างปกติ (>40 มม.), S-shaped deviation",
        "col_3": "กระดูก Condyle รูปทรงปกติ"
      },
      {
        "col_0": "Disc Displacement s Reduction (Lock)",
        "col_1": "ไม่มีเสียง (เสียงคลิกหายไป)",
        "col_2": "อ้าปากติดขัดรุนแรง (<40 มม.), Deflection ไปข้างที่เป็น",
        "col_3": "หมอนรองอยู่หน้า Condyle ตลอดเวลา"
      },
      {
        "col_0": "Degenerative Joint Disease (DJD)",
        "col_1": "เสียงกรอบแกรบ/บดทราย (Crepitus)",
        "col_2": "อาจอ้าปากได้น้อย มีอาการเจ็บตึง",
        "col_3": "Condyle แบน, มีจะงอยกระดูกงอก (Osteophyte)"
      },
      {
        "col_0": "Local Myalgia",
        "col_1": "ไม่มีเสียงในข้อต่อ",
        "col_2": "อ้าปากได้ตามปกติ หรือติดเล็กน้อยจากกล้ามเนื้อเกร็ง",
        "col_3": "ข้อต่อขากรรไกรปกติ"
      }
    ]
  },
  "Ortho-Biomechanics-Tooth-Movement": {
    "title": "ชีวกลศาสตร์การเคลื่อนฟัน อัตราส่วนโมเมนต์ต่อแรง และการตอบสนองของเนื้อเยื่อ (Ortho Biomechanics & M/F Ratio)",
    "specialty": "ทันตกรรมจัดฟัน",
    "category": "ทันตกรรมจัดฟัน",
    "badgeColor": "#e11d48",
    "must_know_topics": [
      "Center of Resistance",
      "Center of Rotation",
      "Moment to Force Ratio",
      "Frontal vs Undermining Resorption",
      "Scammons Growth Curve"
    ],
    "overview": "การเคลื่อนฟันทางทันตกรรมจัดฟันอาศัยแรงชีวกลศาสตร์ที่กระทำต่อจุดศูนย์กลางความต้านทาน (Center of Resistance) ทำให้เกิดการหมุนและการเคลื่อนที่แบบต่างๆ ร่วมกับปฏิกิริยาการสลายและสร้างกระดูกของเอ็นยึดปริทันต์ (PDL)",
    "core_mechanism": "1. ศูนย์กลางความต้านทาน (Center of Resistance - Cres) และศูนย์กลางการหมุน (Center of Rotation - Crot):\n- **Center of Resistance (Cres)**:\n  * จุดศูนย์ถ่วงทางโครงสร้างของฟัน ซึ่งหากใส่แรงเดี่ยว (Single force) กระทำผ่านจุดนี้ ฟันจะเคลื่อนที่ไปในแนวขนานโดยไม่มีการหมุน (Pure translation)\n  * ในฟันรากเดียวที่มีระดับกระดูกเบ้าฟันปกติ จุด Cres จะอยู่บริเวณ **กึ่งกลางถึง 1/3 ของความยาวรากฟันใต้ขอบกระดูกเบ้าฟัน (ประมาณ 40% จากยอดกระดูกเบ้าฟัน)**\n  * หากกระดูกเบ้าฟันละลายตัว (Periodontal bone loss) จุด Cres จะเลื่อนตัวต่ำลงไปทางยอดรากฟัน (Move apically) ทำให้เกิดแขนงโมเมนต์ยาวขึ้น ฟันจะล้มเอียงได้ง่ายขึ้น\n- **อัตราส่วนโมเมนต์ต่อแรง (Moment-to-Force Ratio: M/F Ratio) ณ ตำแหน่ง Bracket**:\n  * **M/F = 0:1 (Uncontrolled Tipping)**: มีเฉพาะแรงดึงเดี่ยว ไม่มีโมเมนต์คู่ควบต้าน จุดหมุน Crot จะอยู่ต่ำกว่า Cres เล็กน้อย ตัวฟันเอียงไปตามทิศทางแรง แต่ปลายรากฟันจะเอียงเตะไปในทิศทางตรงกันข้าม\n  * **M/F = 5:1 ถึง 7:1 (Controlled Tipping)**: มีโมเมนต์ช่วยควบคุม จุดหมุน Crot จะเลื่อนลงไปอยู่ที่ **ปลายรากฟัน (Apex)** ทำให้ตัวฟันเอียงไปข้างหน้าโดยที่ปลายรากฟันไม่ขยับ\n  * **M/F = 10:1 (Bodily Movement / Translation)**: โมเมนต์คู่ควบชดเชยการหมุนได้อย่างสมบูรณ์ จุดหมุน Crot อยู่ที่ระยะอนันต์ (Infinity) ตัวฟันและรากฟันเคลื่อนที่ไปพร้อมกันในแนวขนาน\n  * **M/F = 12:1 (Root Torque)**: โมเมนต์มีค่าสูงกว่าแรง จุดหมุน Crot จะย้ายมาอยู่ที่ **ขอบปลายฟัน/แบร็กเก็ต (Incisal edge / Bracket)** ตัวฟันอยู่นิ่ง แต่ปลายรากฟันเคลื่อนที่\n\n2. การตอบสนองของเนื้อเยื่อปริทันต์ต่อแรงจัดฟัน:\n- **แรงขนาดเบาและต่อเนื่อง (Light Continuous Force: <20 - 50 กรัม)**:\n  * เส้นเลือดในเยื่อปริทันต์ (PDL) ไม่ถูกกดทับจนตีบตัน เลือดไหลเวียนได้ต่อเนื่อง\n  * เกิดกระบวนการ **Frontal Resorption (การสลายกระดูกจากด้านหน้า)**: เซลล์สร้างกระดูก Osteoclasts ถูกกระตุ้นจากหลอดเลือดใน PDL โดยตรงเข้ามากัดสลาย Lamina dura ด้านรับแรงอย่างราบรื่น ฟันเคลื่อนตัวได้ต่อเนื่องและไม่เจ็บปวด\n- **แรงขนาดหนัก (Heavy Force: >100 กรัม)**:\n  * หลอดเลือดใน PDL ถูกบดทับจนขาดเลือด (Ischemia) เซลล์ในบริเวณนั้นขาดออกซิเจนและตายกลายเป็นเนื้อเยื่อไร้เซลล์ใสเหมือนแก้ว เรียกว่า **Hyalinization**\n  * Osteoclasts ไม่สามารถเดินทางมาจาก PDL ได้ ต้องเกณฑ์เซลล์มาจากโพรงไขกระดูกข้างเคียงมากัดสลายกระดูกจากด้านหลัง เรียกว่า **Undermining Resorption (Rear Resorption)**\n  * ฟันจะไม่ขยับในช่วง 1-2 สัปดาห์แรก จนกว่ากระดูกจะทะลุ คนไข้จะปวดฟันรุนแรง และเสี่ยงต่อการเกิด **การละลายตัวของปลายรากฟันอย่างถาวร (Apical Root Resorption)**!\n\n3. กราฟการเจริญเติบโตของ Scammon (Scammon’s Curves of Growth):\n- **Lymphoid Curve**: ต่อมน้ำเหลืองเจริญรวดเร็วมากจนถึงจุดสูงสุด (~200% ของผู้ใหญ่) เมื่ออายุ 10-12 ปี จากนั้นจะฝ่อลดขนาดลง (Involution) สู่ระดับปกติ\n- **Neural Curve**: สมอง กะโหลกศีรษะ และระบบประสาท เจริญเติบโตเกือบ 95% ตั้งแต่อายุ 6-7 ขวบ (ขากรรไกรบนเจริญตาม Neural curve เป็นส่วนใหญ่)\n- **General Skeletal Curve**: ความสูง น้ำหนัก และกระดูกร่างกาย เป็นรูปตัว S (Sigmoid curve) มีช่วงเจริญเติบโตพุ่งพรวดในวัยรุ่น (Pubertal growth spurt) ซึ่ง **ขากรรไกรล่าง (Mandible) จะเจริญเติบโตตาม General curve นี้**!",
    "matrix_headers": [
      "อัตราส่วน M/F Ratio",
      "ประเภทการเคลื่อนฟัน",
      "ตำแหน่งจุดหมุน (Crot)",
      "การเคลื่อนที่ของตัวฟันและราก"
    ],
    "matrix_rows": [
      [
        "M/F = 0:1",
        "Uncontrolled Tipping",
        "ใต้ Cres เล็กน้อย (กลางราก)",
        "ตัวฟันไปทางแรง ปลายรากเตะไปทิศตรงข้าม"
      ],
      [
        "M/F = 5:1 - 7:1",
        "Controlled Tipping",
        "อยู่ที่ปลายรากฟัน (Apex)",
        "ตัวฟันเอียงไป ปลายรากฟันอยู่นิ่ง"
      ],
      [
        "M/F = 10:1",
        "Bodily Translation",
        "อยู่ที่ระยะอนันต์ (Infinity)",
        "ตัวฟันและรากฟันเคลื่อนที่ขนานไปพร้อมกัน"
      ],
      [
        "M/F = 12:1",
        "Root Torque",
        "อยู่ที่ตัวฟัน / แบร็กเก็ต",
        "ตัวฟันอยู่นิ่ง ปลายรากฟันเคลื่อนที่"
      ]
    ],
    "pitfalls": [
      "กับดัก Scammon Curve ในการดัดกระดูก: ขากรรไกรบน (Maxilla) โตเสร็จเร็วกว่าขากรรไกรล่าง ดังนั้นการใส่เครื่องมือดึงกระดูกขากรรไกรบน (เช่น Facemask) ต้องทำตั้งแต่ช่วงฟันน้ำนมหรือฟันผสมระยะแรก (<8-10 ปี) ขณะที่เครื่องมือปรับตำแหน่งขากรรไกรล่าง (Twin Block) สามารถทำได้ในช่วง Pubertal growth spurt (11-13 ปี)",
      "การใช้แรงหนักไม่ได้ทำให้ฟันเคลื่อนที่เร็วขึ้น! ในทางตรงกันข้าม แรงที่หนักเกินไปจะทำให้เกิด Hyalinization และ Undermining resorption ฟันจะหยุดนิ่งไม่ขยับเป็นเวลาหลายสัปดาห์ และเพิ่มความเสี่ยงรากฟันละลาย!"
    ],
    "pearl": "ฟันที่มีการละลายของกระดูกเบ้าฟัน (Bone loss): จุด Center of Resistance จะเลื่อนลงไปทาง Apical ทำให้ค่า Moment of Force (M = F x d) มีค่าสูงขึ้นมาก ทันตแพทย์จึงต้องลดแรงดึง (Force) ลงให้เบาเป็นพิเศษเพื่อป้องกันการล้มเอียงของตัวฟัน!",
    "reference": "Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics, 6th ed. Elsevier, 2019 (Chapters 4, 8 & 9).",
    "decision_matrix": [
      {
        "col_0": "M/F = 0:1",
        "col_1": "Uncontrolled Tipping",
        "col_2": "ใต้ Cres เล็กน้อย (กลางราก)",
        "col_3": "ตัวฟันไปทางแรง ปลายรากเตะไปทิศตรงข้าม"
      },
      {
        "col_0": "M/F = 5:1 - 7:1",
        "col_1": "Controlled Tipping",
        "col_2": "อยู่ที่ปลายรากฟัน (Apex)",
        "col_3": "ตัวฟันเอียงไป ปลายรากฟันอยู่นิ่ง"
      },
      {
        "col_0": "M/F = 10:1",
        "col_1": "Bodily Translation",
        "col_2": "อยู่ที่ระยะอนันต์ (Infinity)",
        "col_3": "ตัวฟันและรากฟันเคลื่อนที่ขนานไปพร้อมกัน"
      },
      {
        "col_0": "M/F = 12:1",
        "col_1": "Root Torque",
        "col_2": "อยู่ที่ตัวฟัน / แบร็กเก็ต",
        "col_3": "ตัวฟันอยู่นิ่ง ปลายรากฟันเคลื่อนที่"
      }
    ]
  },
  "Community-Biostatistics-Diagnostic-Tests": {
    "title": "ชีวสถิติ การประเมินชุดตรวจวินิจฉัย และการควบคุมการติดเชื้อ (Biostatistics & Infection Control)",
    "specialty": "ทันตกรรมชุมชน",
    "category": "ทันตกรรมชุมชน",
    "badgeColor": "#059669",
    "must_know_topics": [
      "Sensitivity and Specificity",
      "PPV and Prevalence",
      "DMFT Index",
      "CPI Index",
      "Spaulding Classification"
    ],
    "overview": "ความรู้ด้านวิทยาการระบาดและชีวสถิติเป็นหัวใจของทันตสาธารณสุข โดยเฉพาะการคำนวณ Sensitivity, Specificity, ค่าทำนายผลบวก (PPV) ซึ่งแปรผันตามความชุกของโรค, ดัชนีตรวจสภาวะช่องปากของ WHO, และการควบคุมการติดเชื้อตามมาตรฐาน Spaulding",
    "core_mechanism": "1. การประเมินชุดตรวจวินิจฉัย (2x2 Contingency Table for Diagnostic Tests):\n- **Sensitivity (ความไว)**: ความสามารถของชุดตรวจในการตรวจจับคนที่เป็นโรคได้อย่างถูกต้อง\n  * Formula: **Sensitivity = TP / (TP + FN)**\n  * ชุดตรวจที่มีความไวสูงมาก (High Sensitivity) เหมาะกับการใช้เป็น **แบบคัดกรอง (Screening Test)** เพื่อไม่ให้ผู้ป่วยหลุดรอด (Rule Out: SnNOut)\n- **Specificity (ความจำเพาะ)**: ความสามารถของชุดตรวจในการระบุคนที่ไม่ได้เป็นโรคได้อย่างถูกต้อง\n  * Formula: **Specificity = TN / (TN + FP)**\n  * ชุดตรวจที่มีความจำเพาะสูงมาก (High Specificity) เหมาะกับการใช้เป็น **แบบยืนยันการวินิจฉัย (Confirmatory Test)** เพื่อป้องกันผลบวกลวง (Rule In: SpPIn)\n- **Positive Predictive Value (PPV - ค่าทำนายผลบวก)**: เมื่อผลตรวจเป็นบวก โอกาสที่คนนั้นจะเป็นโรคจริงเท่ากับเท่าใด\n  * Formula: **PPV = TP / (TP + FP)**\n  * **กฎทองคำของความชุก (Prevalence Effect)**:\n    - ค่า Sensitivity และ Specificity เป็นคุณสมบัติประจำตัวของเครื่องมือ ไม่เปลี่ยนแปลงตามความชุกของโรค\n    - แต่ **ค่า PPV ขึ้นอยู่กับความชุกของโรค (Prevalence) โดยตรง!**\n    - เมื่อนำชุดตรวจไปใช้ในชุมชนที่มี **ความชุกของโรคต่ำมาก (Low Prevalence)** ค่า **PPV จะลดต่ำลงอย่างมาก** ในขณะที่ค่า Negative Predictive Value (NPV) จะพุ่งสูงขึ้นเกือบ 100%!\n\n2. ดัชนีทางทันตสาธารณสุขที่พบบ่อยในข้อสอบ (WHO 5th ed., 2013):\n- **DMFT Index (Decayed, Missing, Filled Teeth)**:\n  * ประเมินฟันแท้ **32 ซี่ (18–48; ใช้ฐาน 28 ซี่เฉพาะโปรโตคอลเดิมที่ไม่รวมฟันคุด)** โดย `D` นับเฉพาะ **Cavitated dentin caries** เท่านั้น (ไม่นับ white spot / enamel caries)\n  * กฎรหัส `M` ตามอายุ (WHO 5th ed.): อายุ **< 30 ปี** นับเฉพาะ `Code 4` (ถอนจากฟันผุ) ห้ามนำฟันที่ถอนด้วยเหตุผลอื่น (`Code 5` เช่น จัดฟัน อุบัติเหตุ) มานับเป็น M เด็ดขาด; อายุ **≥ 30 ปี** นับ `M = Code 4 + Code 5`\n  * ฟันซี่หนึ่งมีทั้งรอยผุและรอยอุด ให้บันทึกเป็น D (Decayed) เสมอ!\n  * *(หากประเมินรอยผุระยะเริ่มต้นที่ไม่เป็นโพรง หรือผล **remineralization** จากฟลูออไรด์ ต้องใช้ **ICDAS** Codes 0–6 ไม่ใช้ `dmft`/`deft`)*\n- **Community Periodontal Index (Modified CPI vs Classic CPITN)**:\n  * ใช้หัวตรวจปริทันต์ของ WHO (WHO CPI Probe): มีตุ้มกลมที่ปลายขนาดเส้นผ่านศูนย์กลาง **0.5 มม.** และมีแถบสีดำทึบที่ระยะ **3.5 ถึง 5.5 มม.** ใช้แรงตรวจไม่เกิน **20 กรัม**\n  * **WHO Modified CPI (5th ed., 2013):** ตรวจ **ทุกซี่** แยกบันทึก **Bleeding (`0, 1`)** และ **Pocket (`0, 1=4–5 mm, 2=≥6 mm`)** โดย**ตัดรหัส Calculus ออก** และตรวจ LOA ในฟันดัชนีสำหรับอายุ ≥ 15 ปี\n  * **Classic CPITN (อ้างอิงข้อสอบ NL เดิม):** Code 0 (Healthy), Code 1 (BOP), Code 2 (Calculus), Code 3 (Pocket 4–5 มม.), Code 4 (Pocket ≥ 6 มม.)\n\n3. การควบคุมการติดเชื้อและการทำลายเชื้อ (Spaulding Classification):\n- **Critical Items**: เครื่องมือที่แทงทะลุเหงือก เข้าสู่กระดูกเบ้าฟันหรือกระแสเลือด (คีมถอนฟัน, หัวกรอ, มีดผ่าตัด, Curettes) -> **ต้องผ่านการนึ่งฆ่าเชื้อด้วยความร้อนชื้น (Sterilization / Autoclave) เท่านั้น!**\n- **Semicritical Items**: เครื่องมือที่สัมผัสเยื่อบุช่องปากหรือน้ำลายแต่ไม่แทงทะลุเนื้อเยื่อ (กระจกส่องปาก, Amalgam condenser) -> นึ่งฆ่าเชื้อ หรือทำลายเชื้อระดับสูง (High-level disinfection)\n- **ตัวบ่งชี้ทางชีวภาพ (Biological Indicators - Spore Test)**:\n  * หม้อนึ่งความดันไอน้ำ (Steam Autoclave) และ Chemical Vapor: ใช้สปอร์ของ **Geobacillus stearothermophilus**\n  * ตู้อบลมร้อนแห้ง (Dry Heat Oven) และก๊าซเอทิลีนออกไซด์ (Ethylene Oxide): ใช้สปอร์ของ **Bacillus atrophaeus**",
    "matrix_headers": [
      "ตัวชี้วัด / มาตรวัด",
      "สูตรคำนวณ / เกณฑ์มาตรฐาน",
      "ผลกระทบจากความชุก (Prevalence)",
      "ความสำคัญทางระบาดวิทยา"
    ],
    "matrix_rows": [
      [
        "Sensitivity (ความไว)",
        "TP / (TP + FN)",
        "ไม่เปลี่ยนตามความชุก",
        "ใช้คัดกรองเบื้องต้นเพื่อคัดคนป่วยออก (Screening)"
      ],
      [
        "Specificity (ความจำเพาะ)",
        "TN / (TN + FP)",
        "ไม่เปลี่ยนตามความชุก",
        "ใช้ตรวจยืนยันโรค ลดผลบวกลวง (Confirmation)"
      ],
      [
        "PPV (ค่าทำนายผลบวก)",
        "TP / (TP + FP)",
        "แปรผันตามความชุก (ชุกน้อย PPV ตกฮวบ)",
        "บอกความน่าจะเป็นที่คนผลบวกจะเป็นโรคจริง"
      ],
      [
        "NPV (ค่าทำนายผลลบ)",
        "TN / (TN + FN)",
        "แปรผกผันกับความชุก (ชุกน้อย NPV สูง)",
        "บอกความมั่นใจว่าคนผลลบจะปลอดภัยจริง"
      ]
    ],
    "pitfalls": [
      "กับดัก PPV ในประชากรความชุกต่ำ: ข้อสอบมักถามว่า \"หากนำชุดตรวจที่มี Sensitivity 95% และ Specificity 95% ไปตรวจคัดกรองมะเร็งช่องปากในประชากรทั่วไปที่มีความชุกเพียง 0.1% ผล PPV จะเป็นอย่างไร?\" คำตอบคือ **PPV จะมีค่าต่ำมาก (อาจต่ำกว่า 5-10%)** เพราะจะมีคนที่เป็น False Positive จำนวนมหาศาลจากประชากรปกติ!",
      "สปอร์ทดสอบเครื่อง Autoclave: ข้อสอบชอบสลับระหว่าง *Geobacillus stearothermophilus* (ใช้กับไอน้ำ) กับ *Bacillus atrophaeus* (ใช้กับความร้อนแห้ง) จำคู่นี้ให้แม่นยำ!"
    ],
    "pearl": "กฎการนับ DMFT (WHO 5th ed., 2013): ประเมินฟันแท้ 32 ซี่ (28 ซี่เฉพาะโปรโตคอลไม่รวมฟันคุด); D = cavitated dentin caries เท่านั้น; อายุ < 30 ปี M = Code 4 (ถอนจากฟันผุเท่านั้น) และ ≥ 30 ปี M = Code 4 + Code 5!",
    "reference": "Burt BA, Eklund SA. Dentistry, Dental Practice, and the Community, 7th ed. Elsevier, 2020; WHO Oral Health Surveys: Basic Methods, 5th ed.; CDC Guidelines for Infection Control in Dental Health-Care Settings.",
    "decision_matrix": [
      {
        "col_0": "Sensitivity (ความไว)",
        "col_1": "TP / (TP + FN)",
        "col_2": "ไม่เปลี่ยนตามความชุก",
        "col_3": "ใช้คัดกรองเบื้องต้นเพื่อคัดคนป่วยออก (Screening)"
      },
      {
        "col_0": "Specificity (ความจำเพาะ)",
        "col_1": "TN / (TN + FP)",
        "col_2": "ไม่เปลี่ยนตามความชุก",
        "col_3": "ใช้ตรวจยืนยันโรค ลดผลบวกลวง (Confirmation)"
      },
      {
        "col_0": "PPV (ค่าทำนายผลบวก)",
        "col_1": "TP / (TP + FP)",
        "col_2": "แปรผันตามความชุก (ชุกน้อย PPV ตกฮวบ)",
        "col_3": "บอกความน่าจะเป็นที่คนผลบวกจะเป็นโรคจริง"
      },
      {
        "col_0": "NPV (ค่าทำนายผลลบ)",
        "col_1": "TN / (TN + FN)",
        "col_2": "แปรผกผันกับความชุก (ชุกน้อย NPV สูง)",
        "col_3": "บอกความมั่นใจว่าคนผลลบจะปลอดภัยจริง"
      }
    ]
  },
  "Law-Sanatorium-Act": {
    "title": "พระราชบัญญัติสถานพยาบาล บทบาทผู้รับอนุญาต ผู้ดำเนินการ และการโฆษณา (Sanatorium Act B.E. 2541)",
    "specialty": "กฎหมายและจรรยาบรรณ",
    "category": "กฎหมายและจรรยาบรรณ",
    "badgeColor": "#f43f5e",
    "must_know_topics": [
      "Sanatorium Act",
      "Licensee vs Operator",
      "Clinic Advertising Section 38",
      "Unlicensed Clinic Penalty",
      "Medical Records Retention"
    ],
    "overview": "พระราชบัญญัติสถานพยาบาล พ.ศ. 2541 และที่แก้ไขเพิ่มเติม (ฉบับที่ 4) พ.ศ. 2559 กำกับดูแลมาตรฐานการเปิดคลินิกทันตกรรม การแบ่งแยกหน้าที่ระหว่าง \"ผู้รับอนุญาต (เจ้าของ)\" กับ \"ผู้ดำเนินการ (ทันตแพทย์คุมมาตรฐาน)\" และข้อห้ามเรื่องการโฆษณาตามมาตรา 38",
    "core_mechanism": "1. ความแตกต่างระหว่างผู้รับอนุญาต vs ผู้ดำเนินการสถานพยาบาล:\n- **ผู้รับอนุญาตให้ประกอบกิจการสถานพยาบาล (Licensee - เจ้าของกิจการ)**:\n  * เป็นบุคคลธรรมดา หรือนิติบุคคล (บริษัท, ห้างหุ้นส่วน) ก็ได้ ไม่จำเป็นต้องเป็นทันตแพทย์\n  * ใบอนุญาตประกอบกิจการมีอายุ **10 ปี**\n  * มีหน้าที่จัดหาอาคาร สถานที่ เครื่องมือ และผู้ดำเนินการที่ถูกต้องตามมาตรฐาน\n- **ผู้ดำเนินการสถานพยาบาล (Operator / Clinic Manager - ผู้ควบคุมมาตรฐานคลินิก)**:\n  * **ต้องเป็น \"ทันตแพทย์ผู้มีใบอนุญาตประกอบวิชาชีพทันตกรรม\" เท่านั้น!**\n  * ควบคุมดูแลการประกอบวิชาชีพทันตกรรม ความสะอาด ยา เวชระเบียน และการกำกับบุคลากรในคลินิก\n  * กฎเหล็ก: **ทันตแพทย์ 1 คน สามารถเป็นผู้ดำเนินการสถานพยาบาลได้เพียง \"แห่งเดียวเท่านั้น ในเวลาเดียวกัน\"!**\n  * ใบอนุญาตเป็นผู้ดำเนินการมีอายุ **5 ปีตามปีปฏิทิน**\n\n2. กฎหมายการโฆษณาสถานพยาบาล (มาตรา 38):\n- การโฆษณาหรือประกาศเกี่ยวกับสถานพยาบาล **ต้องได้รับอนุมัติข้อความ เสียง หรือภาพจากผู้อนุญาต (กรม สบส. หรือ สสจ.) ก่อนเสมอ**\n- **ข้อห้ามเด็ดขาดในการโฆษณาคลินิกทันตกรรม**:\n  * ห้ามโฆษณาข้อความอันเป็นเท็จ โอ้อวดเกินจริง หลอกลวง หรือทำให้เกิดความเข้าใจผิดในสาระสำคัญ\n  * ห้ามใช้คำว่า \"แห่งแรก\", \"ยอดเยี่ยม\", \"ดีที่สุด\", \"ผู้เชี่ยวชาญอันดับหนึ่ง\", \"ไร้ความเจ็บปวด 100%\"\n  * **ห้ามโฆษณาในลักษณะลด แลก แจก แถม หรือให้สิทธิประโยชน์อื่นใดอันเป็นการจูงใจให้เข้ารับการรักษาพยาบาล!** เช่น \"จัดฟันลดราคา 50%\", \"ถอนฟัน 1 ซี่ แถมฟรีขูดหินปูน\", \"แจกทองเมื่อฟอกสีฟัน\" (มีความผิดตาม พ.ร.บ. สถานพยาบาล ทันที!)\n  * การแสดงภาพก่อนและหลังการรักษา (Before & After): ต้องได้รับความยินยอมเป็นลายลักษณ์อักษรจากผู้ป่วย และต้องแสดงให้เห็นผลการรักษาตามความเป็นจริงตามมาตรฐานทางวิชาการ ห้ามตกแต่งภาพลวงตา และห้ามใช้เป็นเครื่องมือชักจูงทางการค้า\n\n3. บทลงโทษสำคัญใน พ.ร.บ. สถานพยาบาล:\n- **เปิดคลินิกทันตกรรมโดยไม่ได้รับอนุญาต (คลินิกเถื่อน)**:\n  * โทษจำคุกไม่เกิน **5 ปี** หรือปรับไม่เกิน **100,000 บาท** หรือทั้งจำทั้งปรับ (มาตรา 56)\n- **การเก็บรักษาเวชระเบียนผู้ป่วย (Medical Records)**:\n  * คลินิกต้องเก็บรักษาประวัติและเวชระเบียนของผู้ป่วยไว้ไม่น้อยกว่า **5 ปี** นับแต่วันที่ผู้ป่วยมารับการรักษาครั้งสุดท้าย",
    "matrix_headers": [
      "มิติทางกฎหมาย",
      "ผู้รับอนุญาต (Licensee)",
      "ผู้ดำเนินการ (Operator)",
      "บทลงโทษกรณีฝ่าฝืน"
    ],
    "matrix_rows": [
      [
        "คุณสมบัติ",
        "บุคคลธรรมดา หรือนิติบุคคล (ไม่จำเป็นต้องเป็นหมอ)",
        "ต้องเป็นทันตแพทย์ที่มีใบอนุญาตวิชาชีพเท่านั้น",
        "เป็นหมอเถื่อน = คุกไม่เกิน 3 ปี ปรับไม่เกิน 3 หมื่น"
      ],
      [
        "อายุใบอนุญาต",
        "10 ปี",
        "5 ปีตามปีปฏิทิน",
        "ดำเนินกิจการโดยใบอนุญาตหมดอายุ ปรับตามกฎหมาย"
      ],
      [
        "จำนวนแห่งที่คุมได้",
        "กี่แห่งก็ได้ (ตามกำลังทุน)",
        "เป็นได้เพียง \"1 แห่งเท่านั้นในเวลาเดียวกัน\"",
        "ฝ่าฝืนมีความผิดและเพิกถอนใบอนุญาตผู้ดำเนินการ"
      ],
      [
        "การโฆษณาคลินิก",
        "ต้องขออนุมัติข้อความล่วงหน้า",
        "ร่วมรับผิดชอบเนื้อหาโฆษณาที่ผิดกฎหมาย",
        "โฆษณาโอ้อวด/ลดแลกแจกแถม ปรับไม่เกิน 2 หมื่น + วันละหมื่น"
      ]
    ],
    "pitfalls": [
      "กับดักการโฆษณาลดราคา: ทันตแพทย์เจ้าของคลินิกคิดว่าการจัดโปรโมชั่น \"ขูดหินปูนลด 50% ต้อนรับวันแม่\" เป็นการตลาดปกติ แต่ในทางกฎหมายถือว่า **ผิดมาตรา 38 พ.ร.บ. สถานพยาบาล และผิดข้อบังคับจรรยาบรรณวิชาชีพทันตกรรมทันที!** สถานพยาบาลไม่ใช่ห้างสรรพสินค้า ห้ามใช้การลดแลกแจกแถมจูงใจให้คนมารักษา!",
      "ผู้ดำเนินการสถานพยาบาล: ทันตแพทย์ทำงานประจำ รพ.รัฐ สามารถเป็นผู้ดำเนินการคลินิกเอกชนตอนเย็นได้หรือไม่? ได้ แต่ต้องไม่ทับซ้อนเวลาปฏิบัติงานราชการ และสามารถเป็นผู้ดำเนินการได้เพียง 1 คลินิกเท่านั้น!"
    ],
    "pearl": "จำตัวเลขสำคัญของ พ.ร.บ. สถานพยาบาล: ใบอนุญาตประกอบกิจการ = 10 ปี, ใบอนุญาตผู้ดำเนินการ = 5 ปี, เป็นผู้ดำเนินการได้ = 1 แห่ง, เก็บเวชระเบียน = อย่างน้อย 5 ปี, โทษคลินิกเถื่อน = คุกไม่เกิน 5 ปี ปรับไม่เกิน 1 แสนบาท!",
    "reference": "พระราชบัญญัติสถานพยาบาล พ.ศ. 2541 และที่แก้ไขเพิ่มเติม (ฉบับที่ 4) พ.ศ. 2559; ประกาศกระทรวงสาธารณสุขว่าด้วยหลักเกณฑ์ วิธีการ และเงื่อนไขการโฆษณาสถานพยาบาล.",
    "decision_matrix": [
      {
        "col_0": "คุณสมบัติ",
        "col_1": "บุคคลธรรมดา หรือนิติบุคคล (ไม่จำเป็นต้องเป็นหมอ)",
        "col_2": "ต้องเป็นทันตแพทย์ที่มีใบอนุญาตวิชาชีพเท่านั้น",
        "col_3": "เป็นหมอเถื่อน = คุกไม่เกิน 3 ปี ปรับไม่เกิน 3 หมื่น"
      },
      {
        "col_0": "อายุใบอนุญาต",
        "col_1": "10 ปี",
        "col_2": "5 ปีตามปีปฏิทิน",
        "col_3": "ดำเนินกิจการโดยใบอนุญาตหมดอายุ ปรับตามกฎหมาย"
      },
      {
        "col_0": "จำนวนแห่งที่คุมได้",
        "col_1": "กี่แห่งก็ได้ (ตามกำลังทุน)",
        "col_2": "เป็นได้เพียง \"1 แห่งเท่านั้นในเวลาเดียวกัน\"",
        "col_3": "ฝ่าฝืนมีความผิดและเพิกถอนใบอนุญาตผู้ดำเนินการ"
      },
      {
        "col_0": "การโฆษณาคลินิก",
        "col_1": "ต้องขออนุมัติข้อความล่วงหน้า",
        "col_2": "ร่วมรับผิดชอบเนื้อหาโฆษณาที่ผิดกฎหมาย",
        "col_3": "โฆษณาโอ้อวด/ลดแลกแจกแถม ปรับไม่เกิน 2 หมื่น + วันละหมื่น"
      }
    ]
  },
  "Law-Dental-Council-Ethics-DVI": {
    "title": "จรรยาบรรณวิชาชีพ กระบวนการพิจารณาโทษ และนิติวิทยาศาสตร์ทางทันตกรรม (Ethics & Forensic Odontology)",
    "specialty": "กฎหมายและจรรยาบรรณ",
    "category": "กฎหมายและจรรยาบรรณ",
    "badgeColor": "#f43f5e",
    "must_know_topics": [
      "Dental Ethics Section 39",
      "Patient Confidentiality",
      "DVI Interpol Guidelines",
      "Gustafson Criteria",
      "Demirjian Method"
    ],
    "overview": "ทันตแพทย์ต้องเข้าใจขอบเขตอำนาจการลงโทษทางจรรยาบรรณของทันตแพทยสภา ความลับของผู้ป่วยตามกฎหมายอาญาและ PDPA และหลักการนิติวิทยาศาสตร์ทางทันตกรรมในการพิสูจน์เอกลักษณ์บุคคลภัยพิบัติ (DVI) และการประมาณอายุฟัน (Age Estimation)",
    "core_mechanism": "1. กระบวนการพิจารณาคดีจรรยาบรรณและอำนาจทันตแพทยสภา:\n- การร้องเรียน: ใครก็สามารถร้องเรียนทันตแพทย์ได้ (ประชาชน, ทันตแพทย์ด้วยกัน, หรือสภาตั้งเรื่องเอง)\n- อายุความ: ภายใน **1 ปีนับแต่วันที่รู้เรื่องและรู้ตัวผู้กระทำผิด แต่ต้องไม่เกิน 3 ปีนับแต่วันกระทำผิด**\n- หากผู้ร้องเรียนขอถอนเรื่อง การถอนเรื่อง **ไม่เป็นเหตุให้ระงับการพิจารณา** ทันตแพทยสภายังมีอำนาจสอบสวนและลงโทษต่อไปได้\n- **โทษทางจรรยาบรรณมี 5 ระดับเท่านั้น (มาตรา 39)**:\n  1) ยกข้อกล่าวหา\n  2) ว่ากล่าวตักเตือน\n  3) ภาคทัณฑ์\n  4) **พักใช้ใบอนุญาต (ไม่เกิน 2 ปี)**\n  5) **เพิกถอนใบอนุญาต (จะขอรับใบอนุญาตใหม่ได้ต่อเมื่อพ้น 2 ปีไปแล้ว)**\n- **ข้อพึงจำ**: ทันตแพทยสภา **ไม่มีอำนาจสั่งจำคุก ปรับเงิน หรือสั่งให้ทันตแพทย์ชดใช้เงินค่าเสียหายทางแพ่งแก่ผู้ป่วยเด็ดขาด!** โทษจำคุกและปรับเงินเป็นอำนาจของศาลยุติธรรมเท่านั้น\n\n2. ความลับของผู้ป่วยและการเปิดเผยข้อมูล:\n- ประมวลกฎหมายอาญา มาตรา 323: แพทย์หรือทันตแพทย์ที่ล่วงรู้ความลับของผู้ป่วยจากการประกอบวิชาชีพ แล้วนำไปเปิดเผยจนน่าจะเกิดความเสียหาย ต้องระวางโทษจำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ\n- ข้อยกเว้นที่เปิดเผยได้: ผู้ป่วยยินยอมเป็นลายลักษณ์อักษร, เพื่อประโยชน์ในการรักษาฉุกเฉิน, ตามคำสั่งศาล, หรือมีกฎหมายเฉพาะบัญญัติให้ต้องรายงาน (เช่น โรคติดต่ออันตราย)\n\n3. นิติวิทยาศาสตร์ทางทันตกรรมและเกณฑ์ DVI สากล (Forensic Odontology & INTERPOL DVI):\n- **กระบวนการพิสูจน์เอกลักษณ์บุคคลภัยพิบัติหมู่ (Disaster Victim Identification - DVI)**:\n  * Phase 1: การตรวจสถานที่เกิดเหตุ (Scene)\n  * Phase 2: การตรวจศพและชันสูตร (Post-Mortem: แบบฟอร์มสีเหลือง)\n  * Phase 3: การรวบรวมข้อมูลก่อนเสียชีวิตจากญาติและคลินิกเดิม (Ante-Mortem: แบบฟอร์มสีชมพู)\n  * Phase 4: การเปรียบเทียบเทียบเคียงข้อมูล (Reconciliation)\n- **Primary Identifiers (หลักฐานหลักในการระบุตัวตน - เพียงหลักฐานเดียวก็ยืนยันได้สมบูรณ์)**:\n  1) **การวิเคราะห์ทางทันตวิทยา (Odontological Examination)**: ประวัติทำฟัน, การอุดฟัน, วัสดุบูรณะ, ภาพรังสีฟัน\n  2) **ลายนิ้วมือ (Fingerprints)**\n  3) **การตรวจสารพันธุกรรม (DNA Analysis)**\n- **Secondary Identifiers (หลักฐานรอง - ไม่สามารถยืนยันตัวตนเดี่ยวๆ ได้)**: รอยสัก, แผลเป็น, เสื้อผ้า, เครื่องประดับ, ข้อมูลทางการแพทย์ทั่วไป\n- **การประมาณอายุทางทันตวิทยา (Dental Age Estimation)**:\n  * ในเด็กและวัยรุ่น: วิธีของ **Demirjian** ประเมินระยะการสร้างและการสะสมแคลเซียมของฟันล่างซ้าย 7 ซี่ เป็น 8 ระยะ (Stage A ถึง H) มีความแม่นยำสูงสุด\n  * ในผู้ใหญ่: วิธีของ **Gustafson (6 เกณฑ์สรีรวิทยา)**:\n    1) Attrition (การสึกของฟัน)\n    2) Periodontitis (การร่นของเอ็นยึดปริทันต์)\n    3) Secondary Dentin (การสะสมเนื้อฟันตติยภูมิในโพรงฟัน)\n    4) Cementum Apposition (การพอกตัวของเคลือบรากฟัน)\n    5) Root Resorption (การละลายของปลายรากฟัน)\n    6) **Root Dentin Translucency (ความโปร่งใสของเนื้อฟันส่วนราก)**: **มีความสัมพันธ์กับอายุผู้ใหญ่สูงที่สุดในบรรดาเกณฑ์ทั้งหมด (Correlation coefficient r > 0.85)!**",
    "matrix_headers": [
      "หัวข้อนิติวิทยาศาสตร์/กฎหมาย",
      "เกณฑ์มาตรฐาน",
      "ความสำคัญสูงสุด",
      "ข้อสอบมักลวง"
    ],
    "matrix_rows": [
      [
        "DVI Primary Identifiers",
        "1) ฟัน/ภาพรังสี 2) ลายนิ้วมือ 3) DNA",
        "เพียงข้อเดียวสามารถยืนยันเอกลักษณ์บุคคลได้สมบูรณ์",
        "รอยสัก/เสื้อผ้า/บัตรประชาชน เป็น Secondary ไม่พอยืนยัน"
      ],
      [
        "Adult Age Estimation",
        "Gustafson’s 6 Criteria (Bang & Ramm)",
        "Root Translucency (ความโปร่งใสรากฟัน) แม่นยำสูงสุด",
        "การสึกของฟัน (Attrition) แปรผันตามอาหาร จึงแม่นยำน้อยกว่า"
      ],
      [
        "Child Age Estimation",
        "Demirjian’s Method (7 ซี่ล่างซ้าย Stage A-H)",
        "ดูการสะสมแคลเซียมของหน่อฟันแท้ ไม่ดูฟันผุ",
        "ใช้ Schour & Massler ดูการงอกของฟัน"
      ],
      [
        "โทษจรรยาบรรณสภา",
        "ตักเตือน, ภาคทัณฑ์, พักใช้ (<=2ปี), เพิกถอน",
        "สภาไม่มีอำนาจสั่งปรับเงินหรือจำคุก",
        "ลวงว่าสภาสั่งให้หมอจ่ายค่าทำขวัญหรือจำคุก"
      ]
    ],
    "pitfalls": [
      "กับดัก Gustafson Criteria: ข้อสอบชอบถามว่า \"ใน 6 ปัจจัยของ Gustafson ปัจจัยใดมีความสัมพันธ์กับอายุของผู้ใหญ่ (Age correlation) สูงที่สุด?\" ตอบทันทีว่า **Root Translucency (ความโปร่งใสของเนื้อฟันส่วนราก)**!",
      "กับดักอำนาจทันตแพทยสภา: หากโจทย์ถามว่า \"ทันตแพทยสภามีอำนาจลงโทษปรับเงินทันตแพทย์ผู้กระทำผิดจรรยาบรรณเป็นเงิน 50,000 บาท หรือไม่?\" คำตอบคือ \"ไม่มีอำนาจเด็ดขาด\" โทษสภามีเพียง 5 สถานตามมาตรา 39 เท่านั้น!"
    ],
    "pearl": "การเก็บข้อมูล Ante-Mortem (ก่อนตาย) ของฟัน: คลินิกทันตกรรมทุกแห่งมีหน้าที่ตามกฎหมายในการส่งมอบเวชระเบียนและฟิล์มเอกซเรย์เดิมของคนไข้ให้แก่พนักงานสอบสวนหรือทีม DVI เพื่อใช้ในการเปรียบเทียบยืนยันเอกลักษณ์บุคคลตามหลักสิทธิมนุษยชนสากล!",
    "reference": "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537; ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณแห่งวิชาชีพทันตกรรม พ.ศ. 2538; INTERPOL Disaster Victim Identification (DVI) Guide; Senn DR, Weems RA. Manual of Forensic Odontology, 5th ed.",
    "decision_matrix": [
      {
        "col_0": "DVI Primary Identifiers",
        "col_1": "1) ฟัน/ภาพรังสี 2) ลายนิ้วมือ 3) DNA",
        "col_2": "เพียงข้อเดียวสามารถยืนยันเอกลักษณ์บุคคลได้สมบูรณ์",
        "col_3": "รอยสัก/เสื้อผ้า/บัตรประชาชน เป็น Secondary ไม่พอยืนยัน"
      },
      {
        "col_0": "Adult Age Estimation",
        "col_1": "Gustafson’s 6 Criteria (Bang & Ramm)",
        "col_2": "Root Translucency (ความโปร่งใสรากฟัน) แม่นยำสูงสุด",
        "col_3": "การสึกของฟัน (Attrition) แปรผันตามอาหาร จึงแม่นยำน้อยกว่า"
      },
      {
        "col_0": "Child Age Estimation",
        "col_1": "Demirjian’s Method (7 ซี่ล่างซ้าย Stage A-H)",
        "col_2": "ดูการสะสมแคลเซียมของหน่อฟันแท้ ไม่ดูฟันผุ",
        "col_3": "ใช้ Schour & Massler ดูการงอกของฟัน"
      },
      {
        "col_0": "โทษจรรยาบรรณสภา",
        "col_1": "ตักเตือน, ภาคทัณฑ์, พักใช้ (<=2ปี), เพิกถอน",
        "col_2": "สภาไม่มีอำนาจสั่งปรับเงินหรือจำคุก",
        "col_3": "ลวงว่าสภาสั่งให้หมอจ่ายค่าทำขวัญหรือจำคุก"
      }
    ]
  },
  "Law-Dental-Nurses-MOPH-Scope": {
    "title": "ขอบเขตหน้าที่ของทันตาภิบาลและเงื่อนไขการมอบหมายงาน (MOPH Regulations on Dental Nurses)",
    "specialty": "กฎหมายและจรรยาบรรณ",
    "category": "กฎหมายและจรรยาบรรณ",
    "badgeColor": "#f43f5e",
    "must_know_topics": [
      "Dental Nurses MOPH Scope",
      "Clause 4.3.3 Written Assignment",
      "Dental Act Section 28",
      "Private Clinic Prohibition"
    ],
    "overview": "ตาม พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 28 (ข้อยกเว้นการประกอบวิชาชีพ) ให้อำนาจกระทรวงสาธารณสุขออกระเบียบกำหนดขอบเขตให้เจ้าหน้าที่ซึ่งไม่ใช่ทันตแพทย์ (เช่น ทันตาภิบาล / จพ.สาธารณสุขชุมชน) ปฏิบัติงานทางทันตกรรมได้เฉพาะในหน่วยงานของรัฐภายใต้เงื่อนไขที่กฎหมายกำหนด",
    "core_mechanism": "1. ขอบเขตงานตามระเบียบกระทรวงสาธารณสุข (ฉบับที่ 2) พ.ศ. 2559 ข้อ 4.3:\n- ทันตาภิบาลที่จบหลักสูตรสามารถทำได้โดยไม่ต้องมีทันตแพทย์ยืนคุมข้างเตียง (แต่อยู่ภายใต้การควบคุมกำกับดูแลของทันตแพทย์ในหน่วยงาน):\n  1) ตรวจสภาวะช่องปากและวางแผนการดูแลเบื้องต้น\n  2) ขูดหินน้ำลายและขัดฟัน (Scaling & Polishing)\n  3) เคลือบหลุมร่องฟัน (Pit and Fissure Sealant) และทาฟลูออไรด์\n  4) อุดฟันชั่วคราว และอุดฟันถาวรชนิดที่ไม่ซับซ้อน (ทั้งฟันน้ำนมและฟันแท้ที่ไม่ทะลุโพรงประสาท)\n  5) ถอนฟันน้ำนมทุกซี่ที่หมดอายุขัยหรือมีพยาธิสภาพ\n  6) ถอนฟันแท้เฉพาะซี่ที่มีการโยกมาก (Grade 3 mobility) จากโรคปริทันต์\n\n2. กฎเหล็กมาตรา 4.3.3 (การมอบหมายงานนอกเหนือขอบเขต):\n- หากมีเหตุจำเป็นที่ทันตแพทย์ผู้บังคับบัญชาประสงค์จะมอบหมายให้ทันตาภิบาลปฏิบัติงาน \"นอกเหนือจากขอบเขตปกติที่ระบุไว้ในข้อ 4.3\" (เช่น ให้ช่วยกรอฟันเคสพิเศษ, ฉีดยาชาเฉพาะที่เคสเฉพาะ):\n  * **ต้องได้รับมอบหมายเป็น \"ลายลักษณ์อักษร\" จากผู้บังคับบัญชาเท่านั้น!**\n  * คำสั่งด้วยวาจา (Verbal order) ใช้ไม่ได้ในทางกฎหมาย!\n  * ความยินยอมของผู้ป่วย (Patient consent) ไม่สามารถลบล้างข้อห้ามตามกฎหมายได้!\n  * หากเกิดความผิดพลาด ทันตแพทย์ผู้สั่งและทันตาภิบาลจะมีความผิดตาม พ.ร.บ. วิชาชีพทันตกรรมทันที\n\n3. สถานที่ปฏิบัติงานที่ได้รับอนุญาตตามกฎหมาย:\n- กฎหมายอนุญาตให้ทันตาภิบาลปฏิบัติงานได้ **\"เฉพาะในสถานบริการสาธารณสุขของรัฐเท่านั้น\"** (รพช., รพท., รพศ., รพ.สต., ศูนย์บริการสาธารณสุข กทม.)\n- **ห้ามปฏิบัติงานใน \"คลินิกเอกชน หรือ โรงพยาบาลเอกชน\" โดยเด็ดขาด!** หากทันตแพทย์เจ้าของคลินิกเอกชนจ้างทันตาภิบาลมาขูดหินปูนหรืออุดฟันให้คนไข้ในคลินิก ทันตาภิบาลจะมีความผิดฐาน \"ประกอบวิชาชีพทันตกรรมโดยไม่ได้รับอนุญาต (หมอเถื่อน ตามมาตรา 50 โทษจำคุกไม่เกิน 3 ปี)\" และทันตแพทย์ผู้ดำเนินการสถานพยาบาลจะมีความผิดตาม พ.ร.บ. สถานพยาบาล พ.ศ. 2541 และผิดจรรยาบรรณวิชาชีพทันที!",
    "matrix_headers": [
      "หัตถการทันตกรรม",
      "สถานพยาบาลของรัฐ (รพ./รพ.สต.)",
      "คลินิกเอกชน",
      "เงื่อนไขกฎหมายสำคัญ"
    ],
    "matrix_rows": [
      [
        "ขูดหินน้ำลาย / อุดฟันไม่ซับซ้อน",
        "ทำได้ (ตามระเบียบข้อ 4.3)",
        "ห้ามทำเด็ดขาด (ผิด ม.50 หมอเถื่อน)",
        "ต้องอยู่ใต้การกำกับดูแลของทันตแพทย์"
      ],
      [
        "ถอนฟันน้ำนม",
        "ทำได้ทุกซี่",
        "ห้ามทำเด็ดขาด",
        "ตามระเบียบข้อ 4.3"
      ],
      [
        "ถอนฟันแท้",
        "ทำได้เฉพาะฟันแท้ที่ \"โยกมาก\"",
        "ห้ามทำเด็ดขาด",
        "ฟันแท้ที่แน่นปกติ ห้ามถอนเด็ดขาด"
      ],
      [
        "งานนอกเหนือขอบเขตปกติ",
        "ทำได้เฉพาะมี \"คำสั่งลายลักษณ์อักษร\"",
        "ห้ามทำเด็ดขาด",
        "คำสั่งวาจาหรือคำยินยอมคนไข้ใช้ไม่ได้"
      ]
    ],
    "pitfalls": [
      "กับดักยอดนิยมข้อสอบ NL: \"ทันตแพทย์สั่งด้วยวาจาให้ทันตาภิบาลใน รพ.สต. ช่วยถอนฟันแท้ที่แน่นปกติให้คนไข้ เนื่องจากทันตแพทย์ติดเคสผ่าตัดฉุกเฉิน และคนไข้เซ็นยินยอมแล้ว การกระทำนี้ถูกต้องหรือไม่?\" -> คำตอบ: \"ไม่ถูกต้อง\" เพราะ 1) ฟันแท้ไม่โยก และ 2) คำสั่งทางวาจาไม่ชอบด้วยกฎหมาย ต้องเป็นลายลักษณ์อักษรเท่านั้น!",
      "จำสับสนเรื่องคลินิกเอกชน: ข้อสอบมักลวงว่า \"คลินิกเอกชนในพื้นที่ชนบทห่างไกล ขาดแคลนทันตแพทย์ สามารถขออนุมัติให้ทันตาภิบาลมาช่วยขูดหินปูนได้\" -> ผิด 100%! กฎหมายยกเว้นให้เฉพาะหน่วยงานของรัฐเท่านั้น คลินิกเอกชนทำไม่ได้ทุกกรณี"
    ],
    "pearl": "จำ 3 ข้อห้ามเด็ดขาดของทันตาภิบาล: 1) ห้ามทำในเอกชน 2) ห้ามถอนฟันแท้ที่ไม่โยก 3) ห้ามนอกขอบเขตถ้าไม่มีหนังสือสั่งการลายลักษณ์อักษร!",
    "reference": "ระเบียบกระทรวงสาธารณสุขว่าด้วยบุคคลซึ่งกระทรวงฯ มอบหมายให้ประกอบวิชาชีพทันตกรรม (ฉบับที่ 2) พ.ศ. 2559 และ พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 28",
    "decision_matrix": [
      {
        "col_0": "ขูดหินน้ำลาย / อุดฟันไม่ซับซ้อน",
        "col_1": "ทำได้ (ตามระเบียบข้อ 4.3)",
        "col_2": "ห้ามทำเด็ดขาด (ผิด ม.50 หมอเถื่อน)",
        "col_3": "ต้องอยู่ใต้การกำกับดูแลของทันตแพทย์"
      },
      {
        "col_0": "ถอนฟันน้ำนม",
        "col_1": "ทำได้ทุกซี่",
        "col_2": "ห้ามทำเด็ดขาด",
        "col_3": "ตามระเบียบข้อ 4.3"
      },
      {
        "col_0": "ถอนฟันแท้",
        "col_1": "ทำได้เฉพาะฟันแท้ที่ \"โยกมาก\"",
        "col_2": "ห้ามทำเด็ดขาด",
        "col_3": "ฟันแท้ที่แน่นปกติ ห้ามถอนเด็ดขาด"
      },
      {
        "col_0": "งานนอกเหนือขอบเขตปกติ",
        "col_1": "ทำได้เฉพาะมี \"คำสั่งลายลักษณ์อักษร\"",
        "col_2": "ห้ามทำเด็ดขาด",
        "col_3": "คำสั่งวาจาหรือคำยินยอมคนไข้ใช้ไม่ได้"
      }
    ]
  }
};

/**
 * Find matching study guide by must-know topic or category
 */
export function findGuideForQuestion(q) {
  if (!q) return null;
  const topic = q.must_know_topic || '';
  const cat = q.category || '';
  const stem = (q.stem || '') + ' ' + (q.question_text || '');

  // 1. Direct match on must_know_topics array
  for (const [id, guide] of Object.entries(CLINICAL_STUDY_GUIDES)) {
    if (guide.must_know_topics && guide.must_know_topics.some(t => topic.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(topic.toLowerCase()))) {
      return { id, ...guide };
    }
  }

  // 2. Keyword heuristic match in stem / topic
  const stemLower = stem.toLowerCase();
  const topicLower = topic.toLowerCase();

  for (const [id, guide] of Object.entries(CLINICAL_STUDY_GUIDES)) {
    if (guide.category === cat) {
      if (guide.must_know_topics && guide.must_know_topics.some(t => stemLower.includes(t.toLowerCase()) || topicLower.includes(t.toLowerCase()))) {
        return { id, ...guide };
      }
    }
  }

  // 3. Category fallback
  for (const [id, guide] of Object.entries(CLINICAL_STUDY_GUIDES)) {
    if (guide.category === cat) {
      return { id, ...guide };
    }
  }

  return null;
}

/**
 * Get all guides filtered by specialty
 */
export function getGuidesBySpecialty(specialty) {
  if (!specialty || specialty === 'all') {
    return Object.entries(CLINICAL_STUDY_GUIDES).map(([id, g]) => ({ id, ...g }));
  }
  return Object.entries(CLINICAL_STUDY_GUIDES)
    .filter(([_, g]) => g.category === specialty || g.specialty === specialty)
    .map(([id, g]) => ({ id, ...g }));
}
