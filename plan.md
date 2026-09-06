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
```
> **หมายเหตุ:** `git add/commit/push` ต้องใช้ `BypassSandbox: true` ในเครื่องมือ run_command

---

## 8. สิ่งที่ตรวจแล้ว (Batch 1 — completed 2026-09-05)

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
| 95 | ข | ค | TMD |
| 257 | ข | ค | Prostho (RPD) |

### ข้อที่แก้ explanation (ไม่ได้แก้เฉลย):
- ID=171: explanation ผิด (บอก Headgear แต่ถูกคือ Twin blocks)
- ID=172: explanation ผิด (บอก mp3u แต่ถูกคือ mp3cap)
- ID=202: explanation ผิด (บอก OFD แต่ถูกคือ Gingivectomy)
- ID=211: explanation ผิด (บอก Vitality test สำคัญสุดแต่ฟันมีครอบ)

### Source ที่ตรวจใน Batch 1:
- ส่วนใหญ่เป็น **NL2 2020 part 1, 2, 3** (IDs ต่ำ ≈ 80-270)

---

## 9. สิ่งที่ยังต้องตรวจ (Batch 2 เป็นต้นไป)

### สถานะ Batch 2 (กำลังดำเนินการ — 2026-09-06)
ดึง 25 ข้อแรกจากแต่ละ category จาก sources ปี 2021-2026 ออกมาตรวจ:
- Sources: NL2 2021, 2022, 2566, 2567, 2025, 2026, AI_MOCK_TEST

### จำนวนข้อที่ยังไม่ได้ตรวจ (~1,813 ข้อ):
| หมวด | จำนวน |
|------|-------|
| Oral Med | 306 |
| Pedo | 305 |
| Prostho | 196 |
| Surgery | 192 |
| Endo | 184 |
| Operative | 162 |
| Perio | 158 |
| Community | 149 |
| Ortho | 86 |
| Occlusion/TMD | 66 |
| ไม่มี category | 9 |

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
