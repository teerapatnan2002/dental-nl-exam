# 📋 แผนการตรวจสอบและแนวทางการเฉลยข้อสอบทันตแพทยสภา NL2 (Audit & Explanation Master Plan)

> **เอกสารสำคัญสำหรับ AI หรือผู้พัฒนาที่จะมาตรวจงานต่อ:**  
> ไฟล์นี้บันทึกรายละเอียดทั้งหมดเกี่ยวกับโครงสร้างฐานข้อมูล, กระบวนการตรวจสอบ (Audit Workflow), ขอบเขตเนื้อหา 10 หมวดวิชา, แนวทางและโครงสร้างการเฉลย (Explanation Standard), scripts พร้อมใช้งาน และข้อสอบที่ตรวจแล้ว/ยังค้างตรวจ เพื่อให้สามารถสลับตัว AI หรือทำงานต่อได้ทันทีโดยข้อมูลไม่สูญหาย

## 1. บริบทโปรเจกต์

โปรเจกต์นี้คือแอปพลิเคชัน Flashcard/Quiz ข้อสอบใบประกอบวิชาชีพทันตกรรม (NL) ของไทย  
- **Workspace:** `/Users/admin/Downloads/NL Test/`
- **Database:** `/Users/admin/Downloads/NL Test/data/exam_bank.db` (SQLite)
- **Git repo:** อยู่ใน workspace เดียวกัน

---

## 2. โครงสร้างฐานข้อมูล

```sql
-- ตาราง questions
CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    question_text TEXT,
    correct_answer TEXT,   -- ← คือสิ่งที่ต้องตรวจ
    category TEXT,         -- หมวดวิชา
    task TEXT,
    explanation TEXT,      -- JSON string
    source_exam TEXT,      -- ชื่อข้อสอบ เช่น "NL2 2026 PART1.pdf"
    stem TEXT,
    proposition TEXT,
    image_path TEXT
);

-- ตาราง choices
CREATE TABLE choices (
    id INTEGER PRIMARY KEY,
    question_id INTEGER,
    label TEXT,   -- ก/ข/ค/ง/จ  หรือ  1/2/3/4/5  หรือ  A/B/C/D/E
    text TEXT
);
```

### format ของ `explanation` (JSON):
```json
{
  "correct_answer": "ตัวเลือกที่ถูก (optional)",
  "core_principle": "อธิบายหลักการทางวิชาการ",
  "key_takeaway": "สรุปสิ่งสำคัญ",
  "choice_explanations": {
    "1": "✓ ถูก เพราะ...",
    "2": "✗ ผิด เพราะ..."
  }
}
```

### label format ตาม source:
| Source | label |
|--------|-------|
| NL2 2020 part 1/2/3 | ก/ข/ค/ง/จ |
| NL2 2021, 2022, 2566, 2567, 2025, 2026 | 1/2/3/4/5 |
| บางข้อใน 2020 part 2-3 (ID ≥ 179) | A/B/C/D/E |

---

## 3. Sources ข้อสอบในฐานข้อมูล (non-law)

```
NL2 2020 part 1.pdf     35 ข้อ
NL2 2020 part 2.pdf     97 ข้อ
NL2 2020 part 3         72 ข้อ
NL 2 2021 Part 1.pdf    87 ข้อ
NL 2 2021 Part 2        83 ข้อ
NL 2 2021 Part 3        70 ข้อ
NL 2 2021 Part 4        83 ข้อ
NL 2 2022 Part 2        75 ข้อ
NL2_2022_part1.pdf      76 ข้อ
NL2_2022_part3          75 ข้อ
NL2_2022_part4.pdf      75 ข้อ
NL_2_2566_Part_2        75 ข้อ
NL 2 2566 part 1.pdf    68 ข้อ
NL 2 2566 part 3.pdf    65 ข้อ
NL 2 2566 part 4        79 ข้อ
NL2-2567 Part 2.pdf    117 ข้อ
NL2-2567 Part 3.pdf    103 ข้อ
NL2-2567 Part 4.pdf    107 ข้อ
NL2 2026 PART1.pdf      63 ข้อ
NL2 2026 PART 2         83 ข้อ
NL2 2026 PART3          68 ข้อ
NL2 2026 PART4          70 ข้อ
รวม NL 2 2025.pdf      276 ข้อ
AI_MOCK_TEST            15 ข้อ
```

---

## 4. Categories (หมวดวิชา) ที่ต้องตรวจ

| ชื่อ category ใน DB | ชื่อย่อ | จำนวนข้อทั้งหมด |
|---|---|---|
| วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก | Oral Med | ~332 |
| ทันตกรรมสำหรับเด็ก | Pedo | ~326 |
| ทันตกรรมประดิษฐ์ | Prostho | ~228 |
| ศัลยศาสตร์ช่องปาก | Surgery | ~216 |
| วิทยาเอ็นโดดอนต์ | Endo | ~206 |
| ทันตกรรมบูรณะ/หัตถการ | Operative | ~176 |
| ปริทันตวิทยา | Perio | ~178 |
| ทันตกรรมชุมชน | Community | ~176 |
| ทันตกรรมจัดฟัน | Ortho | ~86 |
| ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า | Occlusion/TMD | ~69 |

---

## 5. ขั้นตอนการตรวจสอบทีละข้อ (Step-by-Step)

### Step A: อ่านโจทย์และตัวเลือก

1. อ่าน `question_text` หรือ `stem` + `proposition` (บางข้อแยก stem/prop)
2. อ่านตัวเลือกทั้งหมดจาก `choices` table
3. บันทึก `correct_answer` ปัจจุบัน
4. **ข้ามข้อที่ไม่มีข้อความ choices (text ว่างเปล่าทุกตัวเลือก)** — ตรวจไม่ได้เพราะต้องใช้รูปภาพ

### Step B: วิเคราะห์เฉลยด้วยหลักวิชาการ

ตรวจสอบว่า `correct_answer` ที่บันทึกในฐานข้อมูล **ตรงกับคำตอบที่ถูกต้องตามหลักวิทยาศาสตร์ทันตกรรม** หรือไม่  
โดยใช้กระบวนการดังนี้:

#### 5.1 อ่านโจทย์และระบุ "ประเด็นหลัก"
- โจทย์ถามเรื่องอะไร? (diagnosis, treatment, mechanism, pharmacology ฯลฯ)
- ผู้ป่วยมีสภาวะอะไร? อาการอะไร? อายุ? ประวัติ?

#### 5.2 ระบุคำตอบที่ถูกต้องด้วยตนเองก่อน
- อย่าดูเฉลยก่อน → คิดเองก่อนว่าคำตอบที่ถูกต้องคืออะไร
- อ้างอิงหลักการ: guideline ล่าสุด, evidence-based dentistry, AAE/AAPD/AAP/ADA standard

#### 5.3 เปรียบเทียบกับเฉลยในฐานข้อมูล
- **ถ้าตรงกัน** → ✓ ถูกต้อง, บันทึกเหตุผลสั้นๆ
- **ถ้าไม่ตรงกัน** → ตรวจสอบซ้ำอีกครั้งด้วย reasoning ที่ละเอียดขึ้น

#### 5.4 ประเมินความมั่นใจ
- **มั่นใจ ≥ 90%** → แก้ไขทันที
- **มั่นใจ 70-89%** → บันทึกไว้ว่า "น่าสงสัย" และแจ้งให้ตรวจสอบเพิ่ม
- **มั่นใจ < 70%** → ข้ามไป (ไม่แก้)

---

## 6. หลักการทางวิชาการที่ใช้ตรวจสอบ (แยกตาม category)

### 🦷 Oral Med / วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก
- Oral cancer: erythroplakia มีความเสี่ยงสูงสุด, biopsy incisional สำหรับ suspect malignancy
- Oral manifestations ของ systemic disease (HIV, DM, anemia ฯลฯ)
- Viral infections: Herpetic gingivostomatitis (HSV-1) = primary infection ในเด็ก, ต้องใช้ Acyclovir ใน 72 ชม.
- Candida: pseudomembranous (ลอกออกได้), erythematous, angular cheilitis
- QoL + PRECEDE-PROCEED: QoL คือเป้าหมายสูงสุด
- OHRQoL measures: OHIP-14, OIDP

### 🧒 Pedo / ทันตกรรมสำหรับเด็ก
- Pulp therapy: vital pulp therapy (Direct/Indirect pulp cap, Pulpotomy), Pulpectomy
  - Pulpotomy = เอาเฉพาะ coronal pulp (ฟันน้ำนม), วัสดุ = Formocresol หรือ MTA
  - Pulpectomy = เอา root pulp ทั้งหมด, อุดด้วย ZOE (ฟันน้ำนม) หรือ Ca(OH)2
- Space management: Space maintainer หลังถอนฟันน้ำนมก่อนกำหนด
- Fluoride: 0.25 mg (< 3 ปี), 0.5 mg (3-6 ปี), 1 mg (> 6 ปี) — แนวทาง ADA
- Eruption sequence: ฟันน้ำนมเริ่มขึ้น 6 เดือน, ฟันแท้ชุดแรก = lower central incisor / first molar
- Child abuse markers: multiple injuries at different stages, patterned bruises
- Behavior management: Tell-Show-Do, Positive reinforcement, Distraction
- CAMBRA: caries risk assessment — S. mutans level สำคัญ

### 🦷 Prostho / ทันตกรรมประดิษฐ์
- Complete denture: posterior palatal seal, border molding, centric relation ≠ centric occlusion
- RPD (removable partial denture): RPI clasp = Rest + Proximal plate + I-bar
- Fixed prosthesis: preparation margin, cement space 25-30 microns
- Implant: osseointegration, loading protocol
- Occlusal vertical dimension (OVD): ลดลง → aging, wear
- Retention vs. Stability: retention = ต้านการถอน, stability = ต้านการเคลื่อน horizontal

### 🔪 Surgery / ศัลยศาสตร์ช่องปาก
- Impacted wisdom tooth: classification (Winter, Pell-Gregory), surgical access
- Local anesthesia: IANB block = pterygomandibular space, ยา lidocaine 2% + epi 1:100,000
- Hemostasis: primary/secondary hemorrhage
- Dry socket (alveolar osteitis): วันที่ 2-3 หลังถอน, รักษา = irrigation + Alvogyl dressing
- Cyst: dentigerous (crown ของฟันที่ฝัง), radicular (periapical), odontogenic keratocyst (OKC) recurrence สูง
- TMJ surgery: condylectomy, arthroplasty
- Antibiotic: amoxicillin prophylaxis ใน IE risk
- Ludwig's angina = submandibular space infection bilateral → airway emergency

### 🦷 Endo / วิทยาเอ็นโดดอนต์
- Pulp diagnosis: Normal / Reversible pulpitis / Irreversible pulpitis / Necrotic pulp
  - Reversible = pain on stimulus, disappears quickly
  - Irreversible = spontaneous pain / lingers > 30 sec after stimulus
- Apical diagnosis: Normal / Symptomatic apical periodontitis / Asymptomatic apical periodontitis / Acute apical abscess / Phoenix abscess
- Canal shaping: crown-down technique, file sequence
- Irrigation: NaOCl (main disinfectant), EDTA (smear layer removal)
- Obturation: cold lateral condensation, warm vertical condensation
- Ca(OH)2 = intracanal medicament, ฆ่าเชื้อระหว่าง visit
- Internal bleaching: walking bleach technique (Na perborate หรือ carbamide peroxide)
- Resorption: internal vs external, treatment ต่างกัน

### 🦠 Perio / ปริทันตวิทยา
- Periodontal classification (2017 EFP/AAP):
  - Stage I-IV (severity), Grade A/B/C (rate of progression)
- Probing depth vs. clinical attachment level (CAL)
- Treatment sequence: Phase 1 (cause-related) → Re-eval → Phase 2 (surgical) → Maintenance
- Surgical procedures: Gingivectomy (เฉพาะ suprabony pocket + ไม่มีกระดูกถูกทำลาย), Open flap debridement (OFD), Osseous surgery, GTR (guided tissue regeneration)
  - Gingivectomy = ข้อบ่งชี้: pseudopocket / gingival enlargement เท่านั้น ไม่ใช่ true bone loss
- Furcation: Class I/II/III (Hamp classification)
- Splinting: mobility grade 2 → 4 weeks, grade 3 → longer
- Antibiotics: systemic doxycycline, local (Arestin = minocycline)

### 🦷 Operative / ทันตกรรมบูรณะ
- Caries: ICDAS classification, activity vs. arrested
- Composite resin: total etch (37% H3PO4) → bond → composite
  - Wet bonding (dentin should stay moist for self-etch, air-dry for total etch)
- Amalgam: ADA class I-VI (Black's classification)
- GIC (Glass ionomer cement): chemical bond to tooth structure, fluoride release
- Pulp protection: Ca(OH)2 = direct pulp cap, DPC criteria: small exposure, clean, dry
- Bonding generations: 4th (2-bottle total etch), 5th (1-bottle total etch), 6th (2-step SE), 7th (1-step SE)
- Cavity preparation: convenience form, resistance form, retention form

### 👥 Community / ทันตกรรมชุมชน
- Epidemiology: incidence, prevalence, DMF index, def index (ฟันน้ำนม)
- DMFT: Decayed + Missing + Filled Teeth (ฟันแท้)
- dmft: decayed + missing (due to caries) + filled Teeth (ฟันน้ำนม)
- CPI (Community Periodontal Index): 0-4 scale
- Fluoride: optimal level 0.7 ppm (WHO), community water fluoridation
- PRECEDE-PROCEED model: Green & Kreuter
- Ottawa Charter: 5 action areas (Build healthy public policy, Create supportive env, Strengthen community action, Develop personal skills, Reorient health services)
- Primary/Secondary/Tertiary prevention

### 🦷 Ortho / ทันตกรรมจัดฟัน
- Cephalometric landmarks: ANB angle (skeletal classification), SNA, SNB
  - ANB > 4° = Class II skeletal, ANB < 0° = Class III skeletal
- Malocclusion (Angle): Class I (cusp-to-embrasure), Class II div 1/2, Class III
- Functional appliances: Twin block (Class II), Frankel, Bionator
- Headgear: cervical pull (Class II div 1), high pull (open bite / vertical excess)
- Orthopedic: RME (Rapid Maxillary Expansion) = midpalatal suture ≤ 14-16 ปี
- Retention: Hawley retainer, fixed retainer (bonded lingual wire)
- Extraction decisions: Bolton analysis (tooth size discrepancy)

### 🦷 Occlusion/TMD / ทันตกรรมบดเคี้ยว
- TMD classification: myofascial pain, disc displacement (with/without reduction), arthralgia
- Initial treatment: reversible (splint therapy, physiotherapy, NSAIDs)
- Occlusal splint: stabilization splint = full-arch, even contact, anterior guidance
- Centric relation (CR) = condyle in superior-anterior position
- Parafunctional habits: bruxism, clenching → treatment = splint + behavioral modification
- Disc displacement with reduction: clicking on opening AND closing
- Disc displacement without reduction: limited opening (< 35mm), no click

---

## 7. กระบวนการแก้ไขฐานข้อมูล

### 7.1 แก้ correct_answer เมื่อเฉลยผิด
```python
import sqlite3
conn = sqlite3.connect('/Users/admin/Downloads/NL Test/data/exam_bank.db')
c = conn.cursor()
c.execute("UPDATE questions SET correct_answer=? WHERE id=?", ('ตัวเลือกใหม่', question_id))
conn.commit()
conn.close()
print(f"✓ Updated ID={question_id}: {old_answer} → {new_answer}")
```

### 7.2 แก้ explanation เมื่ออธิบายผิด (แต่เฉลยถูก)
```python
import sqlite3, json
conn = sqlite3.connect('/Users/admin/Downloads/NL Test/data/exam_bank.db')
c = conn.cursor()

new_explanation = {
    "core_principle": "อธิบายหลักการที่ถูกต้อง...",
    "key_takeaway": "สรุปสั้นๆ...",
    "choice_explanations": {
        "1": "✓ ถูก เพราะ...",
        "2": "✗ ผิด เพราะ..."
    }
}
c.execute("UPDATE questions SET explanation=? WHERE id=?", 
          (json.dumps(new_explanation, ensure_ascii=False), question_id))
conn.commit()
conn.close()
```

### 7.3 Commit ไปยัง Git
```bash
cd /Users/admin/Downloads/NL\ Test
git add data/exam_bank.db
git commit -m "fix(audit): correct answers batch N - [หมวด] (X ข้อ)"
git push
### 8. สิ่งที่ตรวจแล้ว (Batch 1 & Batch 2 — completed)

### สรุปการแก้ไขใน Batch 1 (~195 ข้อ, commit: `db71c7b`)

| ID | เดิม | แก้เป็น | หมวด |
|----|------|---------|------|
| 235 | E | B | Oral Med |
| 102 | ข | จ | Pedo |
| 119 | ก | ค | Pedo |
| 126 | ง | จ | Pedo |
| 128 | ก | ง | Pedo |
| 105 | ข | ค | Prostho |
| 165 | ก | ง | Prostho |
| 112 | ก | จ | Surgery |
| 115 | ข | ก | Surgery |
| 117 | ก | ค | Surgery |
| 149 | ข | ก | Surgery |
| 175 | A | B | Surgery |
| 108 | ข | จ | Endo |
| 140 | ง | ข | Endo |
| 198 | A | C | Endo |
| 146 | ค | จ | Perio |
| 88 | ข | จ | Community |
| 192 | B | D | Community |
| 231 | D | B | Community |
| 84 | ก | ข | Operative |
| 226 | B | C | Operative |
| 90 | ค | จ | Ortho |
| 174 | E | A | Ortho |
| 207 | A | D | Ortho |
| 362 | ก | ง | Ortho |
| 95 | ข | ค | TMD |
| 257 | ข | ค | Prostho (RPD) |

### สรุปการแก้ไขใน Batch 2 (250 ข้อ, commit: `e9eec52` — 2026-09-06)

| ID | เดิม | แก้เป็น | หมวด | เหตุผลทางวิชาการ |
|----|------|---------|------|-----------------|
| 247 | ง | ก | Surgery / Patho | PGCG เป็นก้อนเนื้อเยื่ออ่อน ไม่เกิด soap bubble ในกระดูก; Soap bubble diff dx หลักคือ OKC, Ameloblastoma |
| 248 | ค | ก | Surgery | รอยโรค multilocular ใหญ่ ฟันข้างเคียงมีชีวิต ต้อง Incisional biopsy ก่อนเสมอ ห้ามถอนฟันดีแล้ว enucleate |
| 260 | ง | จ | Oral Med | เริม (HSV-1) ห้ามใช้ Topical/Systemic Steroid เด็ดขาด (ไวรัสจะลุกลาม); ต้องให้ Antiviral และรอหายค่อยขูดหินปูน |
| 278 | ข | ก | Occlusion / TMD | Crepitation (Cripitation) เป็น Pathognomonic hallmark sign ของ TMJ OA ตามเกณฑ์ DC/TMD |
| 302 | ค | ข | Endo | Failed RCT / Persistent infection เชื้อเด่นคือ Facultative anaerobes (*E. faecalis*) ต่างจาก Primary ที่เป็น Strict anaerobes |
| 313 | ค | ง | Endo / Perio | $CAL = PD + GR = 3 + 2 = 5\text{ mm}$ (คีย์เดิมคลาดเคลื่อน) |
| 390 | ค | ข | Oral Med | แสบร้อนเหงือกเรื้อรัง 5 เดือนเวลากินเผ็ดคือ Desquamative Gingivitis จาก Erosive LP; NUG เป็นโรคเฉียบพลันไม่เป็น 5 เดือน |
| 399 | จ | ค | Ortho | ช่องว่าง 14 และ 16 แคบลงจากการสูญเสียฟันน้ำนม ทำให้ฟันกรามน้อยแท้ซี่ 15 ขาดพื้นที่และขึ้นผิดตำแหน่ง |
| 403 | ค | ก | Prostho | ตรวจจุดกดเจ็บใต้ pontic บนเนื้อเยื่ออ่อนต้องใช้ PIP (Pressure Indicating Paste); Shim stock ใช้ตรวจ occlusal contacts |
| 448 | ข | ค | Prostho / Perio | ฟันหลัก 37 มี periodontitis ต้อง ScRP ก่อนทำสะพานฟัน; 37OB AF คือด้าน Occlusal-Buccal เดิมสภาพดี ไม่ต้องรื้อ |
| 468 | จ | ข | Prostho / Perio | การละเมิด Biologic width เกิดจาก Overextended margin (< 2 mm จากกระดูก); Overcontour ทำให้เกิด gingivitis |
| 477 | จ | ก | Oral Med / Pros | CD เก่าใส่ 24 ชม. หลายปี เพดานแดงคือ Denture stomatitis (Newton II); Erythroplakia เป็น diagnosis of exclusion |
| 489 | ก | ค | Operative | RMGIC มี chemical ionic bond ไม่ต้องใช้ bonding agent; Compomer ต้องใช้ bonding agent เสมอ |
| 545 | string | ก | Community | ทันตาภิบาลทำทันตกรรมป้องกันได้ภายใต้การมอบหมาย/กำกับดูแลของทันตแพทย์ (แก้ไข string ยาวที่ทำให้ระบบ error) |

### สรุปการแก้ไขใน Batch 3 (250 ข้อ — 2026-09-06)

| ID | เดิม | แก้เป็น | หมวด | เหตุผลทางวิชาการ |
|----|------|---------|------|-----------------|
| 585 | ข | ก | Endo | เคาะและคลำเจ็บ (Tender to percussion & palpation) เป็นนิยามมาตรฐานของ Symptomatic Apical Periodontitis (AAE Consensus) จะตอบ Asymptomatic ไม่ได้เด็ดขาด |
| 667 | 2 | 3 | Endo | ฟันตัดล่างมีโอกาสพบ 2 canals (Buccal/Lingual) สูงถึง 40% รูปร่างการเปิด access cavity ต้องเป็นรูปวงรีกว้างในแนว Inciso-cervical (labiolingual) ยื่นหา cingulum |
| 664 | 2 | 4 | Perio | DIGO จากยากันชักเกิดเฉพาะบริเวณที่มีฟันและเริ่มที่ interdental papilla ไม่เกิดบนสันเหงือกว่าง (edentulous ridge); รอยโรคเดี่ยวบนสันเหงือกว่างเกิดจาก Chronic irritation |
| 665 | 3 | 2 | Perio | ห้ามทันตแพทย์สั่งหยุดยากันชักเองโดยพลการ (เสี่ยงต่อ Status epilepticus ถึงแก่ชีวิต); ก้อนเนื้อ reactive hyperplasia บนสันเหงือกรักษาด้วย Surgical excision + ScRP + OHI |
| 491 | จ | ง | Oral Med | ผู้ป่วย Peptic Ulcer Disease มีข้อห้ามใช้ Non-selective NSAIDs (Ibuprofen) เพราะยับยั้ง COX-1 ทำลายเยื่อบุกระเพาะอาหาร; ยาแก้ปวดต้านการอักเสบที่ปลอดภัยคือ Selective COX-2 inhibitor (Celecoxib) |
| 540 | ง | ก | Prostho | Applegate Rule 8: Kennedy Class IV ห้ามมี modification เด็ดขาด; ช่องว่างหลังสุดเป็นตัวกำหนด Class เสมอ สูญเสียฟันหลังสองข้าง = Class I ช่องว่างฟันหน้า = mod 1 สรุปคือ Class I mod 1 |
| 562 | ข | ค | Surgery | ภาวะขากรรไกรค้างเฉียบพลัน (Open lock / TMJ Dislocation) จัด condyle เข้าที่ด้วย Nelaton maneuver โดย "กดลง + ไปข้างหลัง" (Downward and backward); ห้ามดันไปข้างหน้า |
| 588 | ค | ก | Surgery | คำสั่งการรักษาผู้ป่วยใน Order for one day คือคำสั่งวันแรก เช่น สารน้ำ 5% D/N/2 1000 ml IV drip in 24 hr; ยา oral tid เป็นคำสั่งต่อเนื่องใน Order for continuation |
| 818 | 2 | 1 | Ortho | Canine 13 สบลง embrasure ระหว่าง 43 และ 44 พอดี คือนิยามของ Class I canine relationship ตามระบบ Angle และ canine ไม่มี division 1/2 |
| 1453 | C | B | Occlusion / TMD | ปวดฟันสองข้างคลุมเครือ 3 เดือน + Masseter tenderness สองข้าง คือ Referred pain จากกล้ามเนื้อบดเคี้ยว (Trigger points) ไม่ใช่ Pulpal inflammation |
| 1454 | C | D | Occlusion / TMD | ปวดตื้อเรื้อรังสองข้าง + Masseter tenderness = Myofascial pain with referral ตามเกณฑ์ DC/TMD (ไม่ใช่ Trigeminal neuralgia ที่ต้องปวดช็อตเสี้ยววินาทีข้างเดียว) |
| 605 | 4 | 1 | Community | Common Risk Factor Approach (CRFA โดย Sheiham & Watt / WHO) คือ Upstream intervention จัดการปัจจัยเสี่ยงร่วมเชิงนโยบาย/สิ่งแวดล้อม; Caries risk assessment เป็น downstream ระดับบุคคล |
| 220 | B | B | Prostho | Abutment 36 ติดกับ distal extension space ใช้ Reverse Akers (Mesial rest) เพื่อหลีกเลี่ยง Class I lever force ทำลายฟันหลัก (ปรับปรุงคำอธิบายให้ถูกต้องตรงกับหลักการ) |

### สรุปการแก้ไขใน Batch 4 (245 ข้อ — 2026-09-06)

| ID | เดิม | แก้เป็น | หมวด | เหตุผลทางวิชาการ |
|----|------|---------|------|-----------------|
| 737 | 2 | 1 | Endo / Medical Emergency | Hyperventilation tetany (มือเท้างอ) เกิดจาก Hypocapnia -> Respiratory alkalosis: ห้ามให้ออกซิเจนเด็ดขาด! ให้ Rebreathing ก๊าซ CO2 ด้วย Ambubag ครอบปากและจมูกโดยไม่เปิด O2 หรือถุงกระดาษ |
| 924 | E | A | Endo / Operative | ผุเพิ่มด้าน mesial ลึกใกล้ pulp ในกล่อง mesial box ผนังโพรงฟันที่ขนานกับแกนฟันและปิดทับโพรงประสาทฟันคือ Axial wall การใส่ Base/Liner ป้องกันพัลพ์ต้องวางบน Axial wall ไม่ใช่วางบน Distal wall |
| 847 | 4 | 1 | Perio | การตรวจทางคลินิกที่จำเพาะสำหรับ Occlusal trauma บนฟันบนคือ Fremitus test (แตะนิ้วด้าน labial ขณะสบฟัน/เคี้ยวขากรรไกร) ตามตำรา Carranza; Shimstock foil ตรวจได้เพียง holding contact |
| 597 | text | 1 | Oral Med | Occlusal cross-sectional radiograph ใช้ระบุตำแหน่งพยาธิสภาพในแนว buccolingual (ปรับแก้จาก text string เป็น Choice label 1) |
| 472 | ค | ง | Pedo | ฟันกรามแท้ขึ้นบางส่วน (Partially erupted 36) และเด็กดาวน์ซินโดรมไม่ร่วมมือ ควบคุมความชื้นไม่ได้ เรซินซีลแลนท์จะล้มเหลวทันที AAPD แนะนำให้ใช้ Glass Ionomer Sealant (GI) |
| 518 | ก | ง | Pedo | ฟลูออไรด์วาร์นิชมาตรฐานทางทันตกรรมมีสูตรเดียวคือ 5% Sodium Fluoride (5% NaF varnish = 22,600 ppm F, Duraphat) ไม่มีสูตร 2% varnish ในคลินิกทันตกรรม |
| 604 | 5 | 1 | Pedo | ข้อบ่งชี้ทางคลินิกของการทำ Pit and Fissure Sealant (ADA/AAPD) คือหลุมร่องฟันลึกที่ยังไม่ผุ หรือผุระยะแรกเริ่มที่ไม่เป็นรู (ICDAS 0, 1, 2) ส่วนฟันงอกเต็มซี่เป็นเพียงเงื่อนไขการกันความชื้น |
| 655 | 3 | 2 | Prostho | Immediate Denture: 24 ชม. แรกต้องใส่ตลอดเวลาห้ามถอด (ทำหน้าที่เป็น surgical splint คุมบวมและห้ามเลือด) และต้องนัดตรวจครั้งแรกที่ 24 ชม. เสมอ ห้ามปล่อย 1 สัปดาห์ และห้าม reline ถาวรที่ 1 สัปดาห์ |
| 776 | 1, 2, 3, 4, 5 | 1 | Operative | การซักประวัติที่เป็นหัวใจสำคัญในการประเมินสาเหตุและความเสี่ยงฟันผุคือ Sugar intake (ปรับจากสตริงรวมเป็น Choice 1 เดี่ยวให้ตรงกับ ID 780 และระบบตรวจข้อสอบ) |
| 779 | 4 | 1 | Operative | ไหมแยกเหงือก (Pack cord) ในบริเวณฟันหน้าต้องชุบ AlCl3 เพราะหดเหงือกได้ดีและไม่ทำให้เกิดคราบดำ; ห้ามใช้ FeSO4 เพราะเกิดคราบดำคล้ำ; Glutaraldehyde ไม่ใช้ชุบไหมแยกเหงือก |
| 844 | 5 | 2 | Operative | Class II Posterior Composite Restoration: ต้องใช้ Sectional matrix system (Metal band + Sectional ring + Wedge) เพื่อให้ได้ Contact แน่นและ Proximal contour ที่ถูกต้อง ห้ามใช้ Mylar strip ในฟันหลัง |
| 908 | E | D | Operative | Class V กับ Universal Adhesive: ขอบ occlusal อยู่ในเคลือบฟัน ขอบล่างอยู่ในเนื้อฟัน เทคนิคมาตรฐานที่ดีที่สุดคือ Selective Enamel Etch (ทากรด phosphoric acid เฉพาะที่ occlusal margin แล้วทา universal adhesive) |
| 1315 | 5 | 3 | Ortho | Skeletal Class II with retrognathic mandible ในเด็กวัยเจริญเติบโต (11 ปี): รักษาด้วย Functional appliance เช่น Activator เพื่อกระตุ้น mandible มาข้างหน้า; Protraction headgear ใช้กับ Class III maxilla |
| 1240 | 1 | 3 | Ortho / Pedo | Turner's hypoplasia บนฟันแท้ 11 เกิดจากฟันน้ำนม 51 ได้รับอุบัติเหตุกระแทกพื้นในช่วงอายุ 1-2 ปี ซึ่งเป็นวัยหัดเดินและหน่อฟันแท้ 11 กำลังสร้างเคลือบฟัน; ในครรภ์ฟันน้ำนมยังไม่ขึ้นและฟันแท้ยังไม่เริ่มสร้างแร่ธาตุ |
| 1162 | D | C | Community | หลักสุขภาพองค์รวมและ Patient-Centered Care: ทันตแพทย์ปฏิเสธทำฟันปลอมถอดได้ให้คนขับรถรับจ้างรายได้น้อยและบังคับทำรากเทียม ถือว่าไม่เหมาะสมอย่างยิ่งเพราะไม่วางแผนการรักษาร่วมกับผู้ป่วย |
| 1163 | D | C | Community | ผู้ใหญ่อายุ 45 ปีที่มีฟันผุหลายซี่ (High caries risk): มาตรการป้องกันฟันผุในชีวิตประจำวันคือการแปรงฟันด้วยยาสีฟันผสมฟลูออไรด์ 1,500 ppm; Sealant มีข้อบ่งชี้สำหรับหลุมร่องฟันเด็ก/วัยรุ่น |
| 1126 | E | B | Community | Common Risk Factor Approach (CRFA โดย Sheiham & Watt / WHO): อาหารหวาน/น้ำตาลเป็นปัจจัยเสี่ยงร่วมของทั้งโรคอ้วน (วัดด้วย BMI) และโรคฟันผุ (วัดด้วยสภาวะช่องปาก); ตัวเลือกปัจจัยนำ-เสริม-เอื้อคือ PRECEDE-PROCEED |

---

### สรุปการแก้ไขใน Batch 5 (250 ข้อ — 2026-09-06)

| ID | เดิม | แก้เป็น | หมวด | เหตุผลทางวิชาการ |
|----|------|---------|------|-----------------|
| 2079 | ไม่สามารถระบุได้ชัดเจนจากโจทย์ | D | Ortho | Skeletal Class III with maxillary deficiency ในเด็กวัยเจริญเติบโต (ANB = -1°): เครื่องมือ orthopedic มาตรฐานคือ RPE + Protraction Facemask เพื่อกระตุ้นกระดูกขากรรไกรบนมาข้างหน้า |
| 1780 | 5 | 2 | Ortho / Radiology | ผู้ป่วยอายุ 15 ปี ฟัน 35 ฝังมี cyst ล้อมรอบ ต้องการระบุตำแหน่งในแนว buccolingual และการขยายตัวของ cortical bone: ต้องใช้ Mandibular cross-sectional occlusal radiograph (มี panoramic อยู่แล้ว) |
| 555 | ก | ข | Pedo | ฟันน้ำนมซี่ 84 vital pulp ผุระดับ D3 เมื่อกรอผุแล้วทะลุโพรงประสาทฟันขนาดเล็ก (Carious pulp exposure): หัตถการมาตรฐานตาม AAPD คือ Pulpotomy; ส่วน Pulpectomy เป็นของซี่ 85 ที่มีหนอง |
| 997 | 3 | 4 | Surgery | ผู้ป่วย Congenital Aortic Regurgitation ก่อนผ่าตัดเปลี่ยนลิ้นหัวใจ มาถอนฟัน: ภาวะแทรกซ้อนอันตรายวิกฤตที่เกิดจาก transient bacteremia คือ Infective Endocarditis (IE) ต้องให้ Prophylactic Abx |
| 942 | B | A | Prostho | ความลึกของพื้นปากล่าง (Floor of mouth depth) วัดได้ 8 mm: เป็นระยะขั้นต่ำที่เพียงพอสำหรับ Lingual bar (บาร์ 5 mm + เว้นห่างขอบเหงือก 3 mm) จึงเลือก Lingual bar เป็นตัวเลือกแรกตามตำรา McCracken |
| 932 | C | E | Endo | หญิง 20 ปี (ฟันแท้ตัวเต็มวัย) ฟัน 47 ผุ OB ลึกขนาดใหญ่ มีอาการปวดตัวฟัน กรอแล้ว exposed pulp: เข้าเกณฑ์ Irreversible pulpitis ต้องรักษาด้วย Root Canal Treatment (ห้ามทำ Direct pulp capping) |
| 1023 | 1 | 4 | Operative | Class V NCCL / Abfraction ที่เกิดจาก tooth flexure ภายใต้แรงสบหนัก: วัสดุบูรณะต้องมี Low Elastic Modulus (ยืดหยุ่นสูง) เพื่อให้งอตัวตามเนื้อฟันได้โดยไม่เกิด marginal debonding หลุดร่อน |
| 1148 | E | A | Operative | ฟันกรามน้อย 14 แตกหลังอุดอมัลกัมขนาดใหญ่ OMPa: เกิดจากการแต่งโพรงฟันไม่เหมาะสม ขาด resistance form ผนังบางโดยไม่ทำ cusp capping; การทำ groove ที่ axio-pulpal line angle เป็นข้อห้าม |
| 1099 | D | A | Operative | การสร้างลักษณะกายวิภาคแบบ Perikymata (Microtexture คลื่นแนวนอน) บนผิวหน้าของคอมโพสิตเรซิน: ต้องใช้ Needle-shaped tungsten carbide finishing bur (Finishing strip ใช้เฉพาะซอกฟัน) |
| 1100 | C | A | Operative | ผู้ป่วยอุดฟันหน้า 21M แล้วหลุดซ้ำๆ ร่วมกับขอบ incisal ยื่นกว่าซี่ข้างเคียง: เกิดจาก occlusal interference และ shear stress ก่อนและหลังอุดใหม่ต้องประเมินและปรับ Occlusal scheme มากที่สุด |
| 991 | 3 | 1 | Perio | เกณฑ์ 2017 World Workshop Classification: รอบรากฟันเทียมที่มี Bleeding on Probing (BOP) แต่ไม่มีการละลายของกระดูกเบ้าฟันต่อเนื่อง จัดเป็น Peri-implant mucositis (Peri-implant health ต้องไม่มี BOP) |
| 785 | 2 | 1 | Oral Med | ตุ่มสีชมพูผิวเรียบที่ริมฝีปากล่าง มีประวัติแตกยุบหายไปเองแล้วกลับมาบวมซ้ำ (History of rupture & recurrence) ร่วมกับใส่เครื่องมือจัดฟัน: เป็นลักษณะเฉพาะของ Mucocele; Fibroma จะไม่ยุบหายไปเอง |

---

### สรุปการแก้ไขใน Batch 6 (250 ข้อ — 2026-09-06)

| ID | เดิม | แก้เป็น | หมวด | เหตุผลทางวิชาการ |
|----|------|---------|------|-----------------|
| 828 | 4 | 1 | Oral Med | Denture stomatitis รอยโรคสีแดงใต้ฐานฟันปลอมจากการใส่ตลอดเวลา รักษาด้วยยาต้านเชื้อรา Nystatin oral suspension; สเตียรอยด์ (Triamcinolone) เป็นข้อห้ามเด็ดขาด |
| 985 | 3 | 2 | Pedo | เด็ก 20 kg เป็น TOF แพ้ Penicillin ให้ antibiotic prophylaxis แบบกิน: Cephalexin 1000 mg oral (50 mg/kg); Ceftriaxone มีเฉพาะรูปแบบฉีด IV/IM |
| 1908 | 3 | 1 | Community / Forensic | ศพเน่าในน้ำเน่าขัง ตรวจพิสูจน์อัตลักษณ์บุคคลได้จาก DNA และฟัน ลายนิ้วมือสลายตัวตรวจไม่ได้ |
| 1914 | 2 | 3 | Community / Forensic | ศพเน่าในน้ำ ลักษณะช่องปากที่พบได้คือฟันสีชมพู (Pink tooth) จากการแตกของเม็ดเลือดแดงและการแพร่ของฮีโมโกลบินเข้าสู่ dentinal tubules |
| 1915 | 2 | 1 | Community / Jurisprudence | ผู้ถูกเพิกถอนใบอนุญาตประกอบวิชาชีพทันตกรรม จะขอรับใบอนุญาตอีกได้เมื่อพ้นกำหนด 2 ปีนับแต่วันที่ถูกสั่งเพิกถอน (พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 41) |
| 1918 | 4 | 5 | Community / Jurisprudence | การประกอบวิชาชีพทันตาภิบาล: กระทรวงสาธารณสุขร่วมกับทันตแพทยสภาเป็นผู้ออกใบอนุญาต |
| 1919 | 3 | 1 | Community / Jurisprudence | ทันตแพทย์จ้างทันตาภิบาลทำหัตถการเกินขอบเขตในคลินิกเอกชน ผิดทั้งข้อบังคับจรรยาบรรณแห่งวิชาชีพทันตกรรม และ พ.ร.บ. วิชาชีพทันตกรรม |
| 1921 | 4 | 2 | Community / Jurisprudence | ใบอนุญาตประกอบวิชาชีพทันตกรรมได้รับ 12/4/2566 มีอายุ 5 ปีบริบูรณ์นับแต่วันออก หมดอายุวันที่ 11/4/2571 (31 ธ.ค. เป็นรอบของใบอนุญาตประกอบกิจการสถานพยาบาล) |
| 1927 | 5 | 1 | Community / Jurisprudence | บุคคลภายนอกที่ไม่ได้เป็นทันตแพทย์แอบอ้างตนโฆษณา มีความผิดตามพระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537 เท่านั้น ไม่ผิดจรรยาบรรณวิชาชีพเนื่องจากมิใช่ผู้ประกอบวิชาชีพ |
| 1929 | 4 | 2 | Community / Jurisprudence | สิทธิการกล่าวหา/กล่าวโทษ: บุคคลภายนอกผู้ไม่ใช่ผู้เสียหายมีสิทธิกล่าวโทษทันตแพทย์ภายใน 1 ปีนับแต่วันที่รู้เรื่องและรู้ตัวผู้กระทำความผิด |
| 1289 | 1 | 2 | Operative | ฟัน 47O มี localized enamel breakdown แต่ไม่มี dark shadow ในเนื้อฟัน เข้าเกณฑ์ ICDAS code 3 (ICDAS 2 ต้องไม่มี breakdown) |
| 1566 | B | A | Operative | ซี่ 45 ผุลึกถึง inner 1/3 dentin ใกล้โพรงประสาทฟันตามเกณฑ์ ICCC 2016 Consensus แนะนำให้ทำ Selective caries removal to soft dentin บน pulpal wall เพื่อป้องกัน pulp exposure โดยไม่จำเป็น |
| 1158 | A | E | Perio | Periodontitis เป็น Advanced lesion ตาม Page & Schroeder (1976) โดยมีเซลล์เด่นคือ B lymphocytes และ Plasma cells ร่วมกับการสูญเสีย alveolar bone |
| 1258 | 3 | 1 | Perio / Operative | รอยผุ 31M, 41M บริเวณรากฟัน (Root caries) กว้างและควบคุมความชื้นได้ยาก วัสดุบูรณะที่เหมาะสมที่สุดคือ Resin-modified glass ionomer cement (RMGIC) จากพันธะเคมีและการปล่อยฟลูออไรด์ |
| 1245 | 4 | 1 | Endo | ยางกันน้ำลายซี่ 17 (Maxillary second molar) ที่มีรูปร่างมนหรือสั้น ต้องใช้ Ivory clamp #14 (Clamp สำหรับ molar); Ivory #6 เป็น clamp สำหรับฟันหน้า |
| 1364 | D | A | Endo | Clamp ซี่ 17 (ข้อคู่ขนาน ID 1245): เลือกใช้ Ivory clamp #14 |
| 1246 | 5 | 2 | Endo | การทำ Sinus tract tracing (Gutta-percha tracing) ต้องใช้ Gutta-percha main cone ขนาด No. 30 ที่มีความยืดหยุ่นพอเหมาะและไม่งอพับง่าย; Greater taper แข็งเกินไปทำให้แทงเนื้อเยื่อบาดเจ็บ |
| 1365 | E | B | Endo | การทำ Sinus tract tracing (ข้อคู่ขนาน ID 1246): เลือกใช้ Main cone No. 30 |
| 1074 | B | C | Surgery | การผ่าฟันคุด 38 ชนิด horizontal impaction (Pell & Gregory Class II Position B) ขั้นตอนการแบ่งฟันมาตรฐานคือตัดขวางบริเวณคอฟันแบ่งเป็น 2 ส่วน: Crown segment และ Root segment |
| 1211 | 3 | 1 | Prostho | การจัดระเบียบการสบฟันเพื่อป้องกัน Combination syndrome (Kelly syndrome) ในขากรรไกรบน CD สบกับ RPD ล่าง: ฟันหลังสบหนักใน Centric relation, ฟันหน้าสบเบาหรือหลีกเลี่ยงการสบ และมี bilateral balance contacts ใน eccentric movements |
| 1215 | 2 | 5 | Prostho | ผู้ป่วยใส่ฟันเทียมตลอดเวลา เพดานปากมี diffuse erythema สันนิษฐานว่าติดเชื้อรา Candida albicans (Denture stomatitis) การตรวจทางห้องปฏิบัติการเพื่อยืนยันคือ Potassium hydroxide (KOH) examination |

---

## 9. สิ่งที่ยังต้องตรวจ (Batch 7 เป็นต้นไป)

### สถานะปัจจุบัน:
- **ตรวจแล้วสะสม:** 103 ข้อ (กฎหมาย) + 195 ข้อ (Batch 1) + 250 ข้อ (Batch 2) + 250 ข้อ (Batch 3) + 245 ข้อ (Batch 4) + 250 ข้อ (Batch 5) + 250 ข้อ (Batch 6) = **1,543 ข้อ** (1,457 unique IDs คิดเป็น **63.5%**)
- **แก้ไขใน DB สะสม:** **102 ข้อ**
- **คงเหลือยังไม่ได้ตรวจ:** **836 ข้อ**

### จำนวนข้อที่ยังไม่ได้ตรวจตามหมวด:
| หมวด | ตรวจแล้ว / ทั้งหมด | คงเหลือ | สถานะ |
|------|-------------------|---------|-------|
| วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก (Oral Med) | 122 / 359 (34.0%) | 237 | รอตรวจใน Batch 7+ |
| ทันตกรรมสำหรับเด็ก (Pedo) | 144 / 348 (41.4%) | 204 | รอตรวจใน Batch 7+ |
| ศัลยศาสตร์ช่องปาก (Surgery) | 134 / 236 (56.8%) | 102 | รอตรวจใน Batch 7+ |
| ทันตกรรมประดิษฐ์ (Prostho) | 144 / 240 (60.0%) | 96 | รอตรวจใน Batch 7+ |
| วิทยาเอ็นโดดอนต์ (Endo) | 132 / 217 (60.8%) | 85 | รอตรวจใน Batch 7+ |
| ปริทันตวิทยา (Perio) | 135 / 202 (66.8%) | 67 | รอตรวจใน Batch 7+ |
| ทันตกรรมบูรณะ/หัตถการ (Operative) | 151 / 188 (80.3%) | 37 | รอตรวจใน Batch 7+ |
| ไม่ระบุหมวด (None) | 0 / 9 (0.0%) | 9 | รอตรวจใน Batch 7 |
| ทันตกรรมชุมชน (Community) | 180 / 180 (100.0%) | **0** | **✅ เสร็จสมบูรณ์ 100% (Batch 6)** |
| กฎหมายและจรรยาบรรณ (Law) | 133 / 133 (100.0%) | **0** | **✅ เสร็จสมบูรณ์ 100%** |
| ทันตกรรมจัดฟัน (Ortho) | 107 / 107 (100.0%) | **0** | **✅ เสร็จสมบูรณ์ 100% (Batch 5)** |
| ทันตกรรมบดเคี้ยว/TMD (Occlusion) | 74 / 74 (100.0%) | **0** | **✅ เสร็จสมบูรณ์ 100%** |


---

## 10. วิธีดึงข้อสอบที่ยังไม่ตรวจมาตรวจต่อ

### Script ดึงข้อสอบ:
```python
import sqlite3, json

conn = sqlite3.connect('/Users/admin/Downloads/NL Test/data/exam_bank.db')
c = conn.cursor()

SOURCES_TO_CHECK = [
    'NL 2 2021 Part 1.pdf', 'NL 2 2021 Part 2', 'NL 2 2021 Part 3', 'NL 2 2021 Part 4',
    'NL 2 2022 Part 2', 'NL2_2022_part1.pdf', 'NL2_2022_part3', 'NL2_2022_part4.pdf',
    'NL 2 2566 part 1.pdf', 'NL 2 2566 part 3.pdf', 'NL 2 2566 part 4', 'NL_2_2566_Part_2',
    'NL2-2567 Part 2.pdf', 'NL2-2567 Part 3.pdf', 'NL2-2567 Part 4.pdf',
    'NL2 2026 PART1.pdf', 'NL2 2026 PART 2', 'NL2 2026 PART3', 'NL2 2026 PART4',
    'รวม NL 2 2025.pdf', 'AI_MOCK_TEST'
]

TARGET_CATEGORY = 'วิทยาเอ็นโดดอนต์'  # เปลี่ยนตาม category ที่ต้องการ
ALREADY_CHECKED_IDS = []  # ใส่ IDs ที่ตรวจแล้วเพื่อ skip

placeholders = ','.join(['?' for _ in SOURCES_TO_CHECK])
skip_ph = ','.join(['?' for _ in ALREADY_CHECKED_IDS]) if ALREADY_CHECKED_IDS else '0'

query = f"""
    SELECT q.id, q.question_text, q.correct_answer, q.source_exam, q.stem, q.proposition, q.explanation
    FROM questions q
    WHERE q.category = ?
    AND q.source_exam IN ({placeholders})
    {"AND q.id NOT IN (" + skip_ph + ")" if ALREADY_CHECKED_IDS else ""}
    ORDER BY q.id
    LIMIT 25
"""

params = [TARGET_CATEGORY] + SOURCES_TO_CHECK + ALREADY_CHECKED_IDS
c.execute(query, params)
rows = c.fetchall()

for row in rows:
    qid, qtext, ans, src, stem, prop, expl = row
    c2 = conn.cursor()
    c2.execute("SELECT label, text FROM choices WHERE question_id=? ORDER BY label", (qid,))
    choices = c2.fetchall()
    
    print(f"\n[ID={qid}] Source: {src}")
    print(f"Q: {qtext or stem or ''}")
    if prop: print(f"   Prop: {prop}")
    for lbl, txt in choices:
        print(f"   {lbl}) {txt}")
    print(f"   เฉลย: {ans}")

conn.close()
```

---

## 11. แนวทางสำหรับ AI ที่มาสานต่อ

### ขั้นตอน:
1. อ่านไฟล์นี้ให้ครบก่อน
2. ดูว่า Batch ล่าสุดที่ทำไปคือ Batch กี่ (ดู [audit_report.md](file:///Users/admin/.gemini/antigravity/brain/63d17c32-d492-45fa-b6a8-11ee3f380cfb/audit_report.md))
3. ดึงข้อสอบที่ยังไม่ตรวจออกมาตาม script ในส่วน 10
4. ตรวจตามกระบวนการในส่วน 5-6
5. แก้ไข DB ตามส่วน 7
6. Commit ด้วย `BypassSandbox: true`
7. อัปเดต [audit_report.md](file:///Users/admin/.gemini/antigravity/brain/63d17c32-d492-45fa-b6a8-11ee3f380cfb/audit_report.md)

### ข้อควรระวัง:
- **อย่าแก้ข้อที่มีแต่รูป (choice text ว่างหมด)** — ไม่มีข้อมูลพอ
- **ตรวจ label format ก่อนเสมอ** — ก/ข หรือ 1/2 หรือ A/B
- **มั่นใจ ≥ 90% ก่อนแก้** — ถ้าไม่แน่ใจบันทึกว่า "น่าสงสัย"
- **git push ต้องใช้ BypassSandbox: true**
- ฐานข้อมูลมี FTS trigger → UPDATE `questions` จะ auto-sync `questions_fts`

### ไฟล์ที่เกี่ยวข้อง:
| ไฟล์ | ประเภท |
|------|--------|
| [audit_report.md](file:///Users/admin/.gemini/antigravity/brain/63d17c32-d492-45fa-b6a8-11ee3f380cfb/audit_report.md) | รายงาน audit ล่าสุด |
| `/Users/admin/Downloads/NL Test/data/exam_bank.db` | SQLite database |
| [dental-content-auditor agent](file:///Users/admin/.gemini/antigravity/brain/63d17c32-d492-45fa-b6a8-11ee3f380cfb/.agents/agents/dental-content-auditor/agent.md) | Agent spec สำหรับ subagent |

---

## 12. ตัวอย่าง format รายงานผลการตรวจ

```markdown
=== ผลตรวจ [หมวด] Batch N ===

[ID=1234] ✓ ถูกต้อง: เฉลย=3 | Irreversible pulpitis → Pulpectomy ถูกต้องตามมาตรฐาน AAE
[ID=1235] ✗ ผิด: เฉลยเดิม=2, ควรเป็น=4 | เหตุผล: Dry socket รักษาด้วย Alvogyl ไม่ใช่ systemic antibiotics ตาม guideline
[ID=1236] ⚠️ น่าสงสัย: เฉลย=1 แต่อาจเป็น=3 | ความมั่นใจ 75% — รอตรวจสอบเพิ่ม
[ID=1237] ⊘ Skip: choices ว่างเปล่า (image-based question)

แก้ไขแล้ว: X ข้อ (IDs: xxxx, xxxx)
น่าสงสัย: Y ข้อ (IDs: xxxx)
ข้ามไป: Z ข้อ
```

---

*สร้างโดย Antigravity AI — 2026-09-06*  
*Conversation ID: 63d17c32-d492-45fa-b6a8-11ee3f380cfb*
