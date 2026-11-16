"""Structured Clinical Pathways, Pathogenesis Cascades, Procedural Workflows,
and Thai National Dental Protocols for Exam-Driven Academy & Explanation Studio.
"""

import json
import re
from typing import Any, Dict, List, Optional


def _node(
    step_num: int,
    stage: str,
    title: str,
    detail: str,
    node_type: str = "mechanism",
    branches: Optional[List[Dict[str, str]]] = None,
) -> Dict[str, Any]:
    item: Dict[str, Any] = {
        "step_num": step_num,
        "stage": stage,
        "title": title,
        "detail": detail,
        "node_type": node_type,
    }
    if branches:
        item["branches"] = branches
    return item


# ─────────────────────────────────────────────────────────────────────────────
# CURATED GOLD-STANDARD CLINICAL PATHWAYS & THAI NATIONAL PROTOCOLS
# Keyed by must_know_topic ID. Each topic may contain 1-2 rich diagrams
# (e.g., Pathogenesis mechanism + Clinical Decision Protocol).
# ─────────────────────────────────────────────────────────────────────────────
CURATED_TOPIC_PATHWAYS: Dict[str, List[Dict[str, Any]]] = {
    "Endo-Pulp-Periapical-Diagnosis": [
        {
            "id": "endo-pain-pathogenesis",
            "title": "กลไกการเกิดอาการปวดโพรงประสาทฟัน (Pulpal Neurophysiology & Inflammation Pathway)",
            "pathway_type": "pathogenesis",
            "subtitle": "ทฤษฎีของไหลในท่อเนื้อฟัน (Hydrodynamic Theory) ➔ ความต่างของใยประสาท A-delta vs C Fibers",
            "reference": "Cohen's Pathways of the Pulp 12th ed. (AAE Consensus) & สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE)",
            "steps": [
                _node(1, "สิ่งกระตุ้นตั้งต้น (Stimulus)", "รอยผุ / ลม / น้ำเย็น / แรงดูดออสโมซิส", "กระตุ้นให้ของเหลวภายใน Dentinal tubules เคลื่อนที่อย่างรวดเร็ว (Brännström's Hydrodynamic Theory)", "trigger"),
                _node(2, "การอักเสบระยะต้น (Reversible Stage)", "กระตุ้นใยประสาท A-delta Fibers", "A-delta (มี Myelin, นำเร็ว 12–30 m/s) อยู่ที่ขอบ Coronal pulp ใกล้ Odontoblasts ทำให้เสียวแปล๊บคมชัดและหายทันทีใน 1–2 วินาทีเมื่อนำสิ่งกระตุ้นออก", "mechanism"),
                _node(3, "การลุกลาม & สารสื่ออักเสบ", "Release Bradykinin, PGE2, Histamine + Hypoxia", "หากกำจัดเชื้อ/รอยผุไม่ทัน แรงดันในโพรงประสาทเพิ่มขึ้น เกิดภาวะขาดเลือด ใยประสาท A-delta หยุดทำงาน", "mechanism"),
                _node(4, "การอักเสบถาวร (Irreversible Stage)", "กระตุ้น C Fibers ที่ใจกลาง Pulp", "C fibers (ไร้ Myelin, ทนภาวะ Hypoxia, นำช้า 0.5–2 m/s) สร้างอาการปวดลึก ตุบๆ ปวดตกค้างนาน (Lingering >10–15 วินาที) หรือปวดขึ้นเองตอนกลางคืน (Spontaneous pain)", "warning"),
                _node(5, "ลุกลามออกปลายราก (Periapical Extension)", "เชื้อ/สารพิษผ่าน Apical Foramen สู่ PDL", "กระตุ้นตัวรับแรงกด Proprioception ใน PDL ➔ เคาะเจ็บ (Percussion +) จากนั้นทำลายกระดูกปลายรากเห็นเงาดำโปร่งรังสี หรือทะลุเป็นตุ่มหนอง (Sinus tract)", "outcome"),
            ],
        },
        {
            "id": "aae-diagnostic-decision",
            "title": "แผนผังตัดสินใจวินิจฉัยโรคพัลพ์และปลายราก (AAE 2009 Standard + แจ้งอัปเดต AAE/ESE 2025–2026)",
            "pathway_type": "decision",
            "subtitle": "ตรวจ 2 มิติตาม AAE 2009 (เกณฑ์เฉลยข้อสอบ NL ปัจจุบัน) พร้อมสรุปความต่างจากร่างแนวทางใหม่ AAE/ESE 2025–2026",
            "reference": "AAE 2009/2013 Consensus Terminology (เกณฑ์เฉลยข้อสอบ ศ.ท.ส. ไทย) & AAE/ESE Joint Special Committee Proposed Update (Stakeholder Input 2025–2026)",
            "steps": [
                _node(1, "ขั้นตรวจความมีชีวิต — ยึด AAE 2009 สำหรับตอบข้อสอบ NL", "ทดสอบด้วย Cold Test (-26.2°C) / EPT / ประวัติปวด", "แยกสภาวะโพรงประสาทตามเกณฑ์เฉลย ศ.ท.ส. (AAE 2009) ก่อนตัดสินใจรักษา", "decision", [
                    {"condition": "ตอบสนองปกติ ไม่ตกค้าง", "outcome": "Normal Pulp / Reversible Pulpitis ➔ กรออุดฟัน (VPT หากใกล้พัลพ์)", "color": "#10b981"},
                    {"condition": "ปวดแปล๊บตกค้างนาน / ปวดเอง", "outcome": "Symptomatic Irreversible Pulpitis (SIP) ➔ รักษารากฟัน (RCT)", "color": "#f59e0b"},
                    {"condition": "ไม่ตอบสนอง Cold & EPT", "outcome": "Pulp Necrosis ➔ RCT (เช็กปลายรากต่อ)", "color": "#ef4444"},
                ]),
                _node(2, "ขั้นตรวจปลายราก — ยึด AAE 2009 สำหรับตอบข้อสอบ NL", "เคาะฟัน (Percussion) + คลำ (Palpation) + ดูตุ่มหนอง/ภาพรังสี", "ประเมินการลุกลามเข้าสู่เส้นเอ็น PDL และกระดูกเบ้าฟัน", "decision", [
                    {"condition": "เคาะเจ็บ (+) มีหรือไม่มีเงาดำ", "outcome": "Symptomatic Apical Periodontitis (SAP)", "color": "#f59e0b"},
                    {"condition": "บวมเฉียบพลัน + หนอง + ปวดรุนแรง", "outcome": "Acute Apical Abscess ➔ I&D + Pulpectomy (RDU: ให้ ATB เฉพาะมีไข้/บวมลาม)", "color": "#ef4444"},
                    {"condition": "มีตุ่มหนอง Sinus tract (มักไม่ปวด)", "outcome": "Chronic Apical Abscess ➔ GP Tracing หาซี่ต้นเหตุ + RCT (งด ATB)", "color": "#38bdf8"},
                ]),
                _node(3, "📢 หมายเหตุอัปเดต: ร่างแนวทางใหม่ AAE/ESE (2025–2026 Draft vs AAE 2009)", "ยังเป็นร่างเปิดรับฟังความเห็น (Stakeholder Input) — ข้อสอบ NL ยังเฉลยตาม AAE 2009 เดิม", "ความต่างสำคัญที่ควรรู้: (1) Pulpal เปลี่ยน Reversible/Irreversible → Hypersensitive Pulp, Mild Pulpitis (-Secondary to:), Severe Pulpitis (รองรับ VPT/Pulpotomy แม้ปวดมาก ไม่ได้บังคับ RCT 100%) และเพิ่ม Inconclusive Pulp Status / Previous Regenerative; (2) Periapical เพิ่ม Apical Hypersensitivity (เจ็บจากสบฟัน/TMD/ปริทันต์ ไม่ใช่พัลพ์ ห้ามทำ RCT!), ผนวก CBCT ใน Localized SAP/AAP, เพิ่ม Sinus Tract และ Inconclusive Apical Condition (ให้ Monitoring)", "outcome"),
            ],
        },
    ],
    "Endo-Vital-Pulp-Therapy": [
        {
            "id": "vpt-protocol",
            "title": "Clinical Protocol: Vital Pulp Therapy (IPC, DPC & Cvek Pulpotomy)",
            "pathway_type": "protocol",
            "subtitle": "ขั้นตอนการรักษาโพรงประสาทฟันที่มีชีวิตตามเกณฑ์ TAE & AAE (สอดคล้องแนวคิด Severe Pulpitis ใน AAE/ESE 2025–2026 Draft)",
            "reference": "สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE), ESE/AAE Vital Pulp Therapy Position Statement & AAE/ESE Diagnostic Terminology Draft (2025–2026)",
            "steps": [
                _node(1, "คัดกรองเคส (Case Selection)", "ข้อสอบ NL (AAE 2009): เลือกทำใน Normal / Reversible Pulpitis", "ในการสอบ NL ฟันที่มี SIP (ปวดเองกลางคืน/ตกค้างนาน) มักเฉลยเป็น RCT แต่ในเชิงวิชาการสมัยใหม่ (AAE/ESE Draft 2025–2026: Severe Pulpitis) อาจทำ Partial/Full Pulpotomy ได้หากคุมเลือดใน 5–10 นาที", "trigger"),
                _node(2, "เตรียมปลอดเชื้อ (Isolation)", "ใส่ Rubber Dam + ฆ่าเชื้อตัวฟันก่อนกรอผุลึก", "ป้องกันการปนเปื้อนเชื้อซ้ำจากน้ำลาย หากมีผุลึกให้เริ่มแบบ Selective Caries Removal (เหลือ Soft/Firm dentin เหนือพัลพ์ถ้าไม่ทะลุ = IPC)", "action"),
                _node(3, "จุดตัดสินใจเมื่อทะลุพัลพ์ (Hemostasis Check)", "ประเมินจุดเลือดออก & ควบคุมเลือดด้วย 1.5–5% NaOCl", "ใช้สำลีชุบ NaOCl กดห้ามเลือดเบาๆ 5–10 นาที (ห้ามใช้แรงดัน) เพื่อประเมินสุขภาพของเนื้อเยื่อพัลพ์จริง", "decision", [
                    {"condition": "เลือดหยุดภายใน 5–10 นาที (Pulp exposure เล็ก)", "outcome": "ปิดทับด้วย Calcium Silicate Cement (MTA / Biodentine) ➔ Direct Pulp Capping หรือ Partial Pulpotomy", "color": "#10b981"},
                    {"condition": "เลือดไม่หยุดเกิน 10 นาที / ไม่มีเลือดไหล (Necrotic)", "outcome": "เปลี่ยนแผนเป็น Full Pulpotomy (ถ้าหยุดที่ Orifice) หรือทำ RCT / Pulpectomy เต็มระบบ", "color": "#ef4444"},
                ]),
                _node(4, "บูรณะปิดผนึกถาวร (Coronal Seal & RDU)", "ปิดทับด้วย RMGIC Base + อุด/ครอบฟันทันที", "การป้องกัน Bacterial microleakage สำคัญที่สุด! และงดจ่ายยาปฏิชีวนะใน Pulpitis ตามเกณฑ์ RDU Thailand นัดติดตามผล 6–12 เดือน", "outcome"),
            ],
        }
    ],
    "Endo-Open-Apex-Management": [
        {
            "id": "open-apex-protocol",
            "title": "Treatment Pathway: ฟันแท้ปลายรากเปิด (Immature Permanent Tooth)",
            "pathway_type": "decision",
            "subtitle": "แยกแนวทางการรักษาตามความมีชีวิตของเนื้อเยื่อพัลพ์ (Vital Apexogenesis vs Non-Vital Apexification / RET)",
            "reference": "Cohen's Pathways of the Pulp & AAPD / IADT Guidelines",
            "steps": [
                _node(1, "ประเมินความมีชีวิต (Vitality & Clinical Signs)", "ฟันแท้รากยังเจริญไม่สมบูรณ์ (ปลายรากบาน Blunderbuss)", "ตรวจ Cold test, สีฟัน, อาการบวม/ตุ่มหนอง และ HERS viability", "decision", [
                    {"condition": "Vital Pulp (ยังไม่ตาย)", "outcome": "ทำ Apexogenesis (IPC / DPC / Cvek Pulpotomy ด้วย MTA/Biodentine) เพื่อรักษา HERS ให้สร้างรากต่อจนปลายรากปิดสมบูรณ์", "color": "#10b981"},
                    {"condition": "Pulp Necrosis (พัลพ์ตายแล้ว)", "outcome": "ไปขั้นที่ 2: เลือก Apexification หรือ Regenerative Endodontics (RET)", "color": "#f59e0b"},
                ]),
                _node(2, "การจัดการฟันรากเปิดที่พัลพ์ตาย (Non-Vital Path)", "ล้างฆ่าเชื้อแบบนุ่มนวลด้วย NaOCl 1.5% + ไม่มี Mechanical filing รุนแรง", "เลือกเทคนิคตามความหนาผนังรากฟัน", "decision", [
                    {"condition": "ทำ Apical Barrier เร็ว (1-2 ครั้ง)", "outcome": "MTA Apexification: อุด MTA 4–5 mm ที่ปลายราก ➔ อุด Backfill ด้วย Gutta-percha", "color": "#38bdf8"},
                    {"condition": "รากสั้น/ผนังบางมาก (ต้องการเพิ่มความหนาราก)", "outcome": "Regenerative Endodontics (RET / Revascularization): ใส่ TAP/Ca(OH)2 ➔ ล้าง 17% EDTA ➔ เขี่ยให้เกิด Blood clot Scaffold + ปิดทับ MTA", "color": "#a855f7"},
                ]),
            ],
        }
    ],
    "Endo-Irrigants-Intracanal-Medication": [
        {
            "id": "endo-irrigation-sequence",
            "title": "Stepwise Protocol: ลำดับการใช้สารล้างคลองรากฟัน (Irrigation & Smear Layer Removal)",
            "pathway_type": "protocol",
            "subtitle": "กลไกการทำงานร่วมกันของ NaOCl + EDTA และข้อควรระวังการผสมเคมีที่เกิดตะกอน",
            "reference": "Cohen's Pathways of the Pulp (12th ed.)",
            "steps": [
                _node(1, "ระหว่างขยายคลองรากฟัน", "Sodium Hypochlorite (NaOCl 1%–5.25%)", "ละลายเนื้อเยื่ออินทรีย์ (Organic tissue) และฆ่าเชื้อในคลองรากฟัน (แต่กำจัด Smear layer อนินทรีย์ไม่ได้)", "action"),
                _node(2, "กำจัด Smear Layer หลังขยายเสร็จ", "17% EDTA (นาน 1 นาที)", "คีเลตแคลเซียม (Chelation) เปิดปากท่อเนื้อฟันโดยกำจัดส่วนอนินทรีย์ (Inorganic Smear Layer)", "mechanism"),
                _node(3, "ล้างซ้ำเพื่อเข้าสู่ Dentinal Tubules", "Final Flush ด้วย NaOCl หรือ 2% Chlorhexidine (CHX)", "⚠️ กฎเหล็กข้อสอบ: ห้ามนำ NaOCl ผสมกับ CHX โดยตรง เพราะจะเกิดตะกอนสีน้ำตาลแดง Parachloroaniline (PCA) ซึ่งเป็นพิษและอุดตันท่อเนื้อฟัน! ต้องล้างคั่นด้วย NSS/น้ำกลั่น", "warning"),
                _node(4, "ระหว่างนัด (Intracanal Medicament)", "Calcium Hydroxide Ca(OH)2 (pH ~12.5)", "ปล่อย OH⁻ ทำลายผนังเซลล์แบคทีเรีย, ยับยั้ง Endotoxin (LPS) และกระตุ้น Hard tissue barrier (7 วันขึ้นไป)", "outcome"),
            ],
        }
    ],
    "OMFS-Local-Anesthesia-Pharmacology": [
        {
            "id": "la-mechanism-mrd",
            "title": "กลไกการออกฤทธิ์ยาชาเฉพาะที่ & โปรโตคอลคำนวณ MRD มาตรฐานไทย (1.8 mL/หลอด)",
            "pathway_type": "pathogenesis",
            "subtitle": "เส้นทางจากค่า pKa/pH เนื้อเยื่อ ➔ ปิดกั้น Na+ Channel และสูตรคำนวณหลอดยาชาสูงสุด (ศ.ท.ส.)",
            "reference": "Malamed's Handbook of Local Anesthesia & คณะทันตแพทยศาสตร์ในประเทศไทย",
            "steps": [
                _node(1, "สมดุลในเนื้อเยื่อ (pKa vs pH)", "RN + H⁺ ⇌ RNH⁺ (Henderson-Hasselbalch)", "ยาชามีสภาวะสมดุลระหว่างรูป Base ไม่แตกตัว (RN — ละลายไขมันดี, ทะลุเยื่อหุ้มประสาท) กับรูป Cation (RNH⁺)", "mechanism"),
                _node(2, "ทะลุผ่าน Axoplasm & จับ Receptor", "รูป RN ผ่าน Axon Membrane ➔ แตกตัวเป็น RNH⁺ จับ Voltage-Gated Na⁺ Channel", "RNH⁺ ไปอุดช่อง Na⁺ ด้านใน (Intracellular side) ป้องกัน Na⁺ ไหลเข้าเซลล์ ➔ ไม่เกิด Depolarization", "mechanism"),
                _node(3, "เหตุใดเนื้อเยื่ออักเสบจึงชาได้ยาก?", "pH เนื้อเยื่อลดลง (เป็นกรด pH 5–6)", "สัดส่วนรูป RN ลดลงมาก ยาชาจึงข้ามเยื่อหุ้มประสาทได้น้อยลง ต้องแก้ด้วย Regional Nerve Block (เช่น IANB/Gow-Gates) ห่างจากจุดอักเสบ", "warning"),
                _node(4, "คำนวณขนาดยาชาสูงสุด (Thai MRD Protocol)", "มาตรฐานหลอดในไทย = 1.8 mL/Cartridge", "2% Lidocaine = 36 mg/หลอด (MRD 4.4 mg/kg สูงสุด 300 mg) • 3% Mepivacaine = 54 mg/หลอด (MRD 4.4 mg/kg) • 4% Articaine = 72 mg/หลอด (MRD 7.0 mg/kg)", "outcome"),
            ],
        }
    ],
    "OMFS-Medical-Emergencies": [
        {
            "id": "emergency-anaphylaxis-syncope",
            "title": "Emergency Protocol: แนวทางจัดการภาวะฉุกเฉินเฉียบพลันในคลินิกทันตกรรมไทย",
            "pathway_type": "protocol",
            "subtitle": "ABCDE Assessment ➔ แยก Vasovagal Syncope vs Anaphylaxis vs LAST & สายด่วน 1669",
            "reference": "Malamed's Medical Emergencies & คณะกรรมการช่วยชีวิต สมาคมแพทย์โรคหัวใจแห่งประเทศไทยฯ",
            "steps": [
                _node(1, "หยุดหัตถการทันที & ประเมิน ABCDE", "Clear ช่องปาก, ตรวจชีพจร, ความดัน, ทางเดินหายใจ, อาการผื่น/หลอดลมตีบ", "จัดท่าผู้ป่วยให้เหมาะสมตามสภาวะอาการ", "decision", [
                    {"condition": "หน้ามืด ใจสั่น เหงื่อออก (Vasovagal Syncope)", "outcome": "จัดท่านอนหงายยกขาสูง (Trendelenburg / Feet slightly elevated 10–15°) + คลายเสื้อผ้า + O2 + แอมโมเนีย", "color": "#38bdf8"},
                    {"condition": "ผื่นลมพิษ หอบเสียงวี้ด ความดันตก (Anaphylaxis)", "outcome": "ไปขั้นที่ 2: ฉีด Epinephrine 1:1,000 IM ทันที!", "color": "#ef4444"},
                    {"condition": "ชาลิ้น-ปาก หูอื้อ ชักหลังฉีดยาชา (LAST)", "outcome": "หยุดฉีดยาชา + Airway + Hyperventilate 100% O2 + Benzodiazepine/20% Lipid Emulsion", "color": "#f59e0b"},
                ]),
                _node(2, "ยาหลักช่วยชีวิต Anaphylaxis (First-Line)", "ฉีด Epinephrine 1:1,000 (1 mg/mL) เข้ากล้ามเนื้อ (IM)", "ฉีดที่ Vastus lateralis (หน้าขาด้านนอก): ผู้ใหญ่ 0.3–0.5 mg | เด็ก 0.01 mg/kg (max 0.3 mg) ซ้ำได้ทุก 5–15 นาที + โทร 1669", "action"),
                _node(3, "ยารอง & ส่งต่อโรงพยาบาล (Adjuncts)", "Antihistamine + Corticosteroid + Salbutamol (หากหอบ) + IV Fluid", "ยาแก้แพ้/สเตียรอยด์ช่วยป้องกัน Biphasic reaction แต่ 'ห้ามใช้แทน Epinephrine' เด็ดขาด! เฝ้าดูสัญญาณชีพจนส่งต่อ รพ.", "outcome"),
            ],
        }
    ],
    "OMFS-Fascial-Space-Infections": [
        {
            "id": "fascial-space-ludwig",
            "title": "Pathogenesis & Critical Triage: การลุกลามสู่ Fascial Spaces & Ludwig's Angina",
            "pathway_type": "pathogenesis",
            "subtitle": "เส้นทางการทะลุของหนองตามความหนา Cortical bone & กล้ามเนื้อ Mylohyoid ➔ Airway Emergency",
            "reference": "Hupp's Contemporary OMFS (7th ed.) & แนวทางส่งต่อ TAOMS",
            "steps": [
                _node(1, "จุดกำเนิดการทะลุกระดูก (Path of Least Resistance)", "หนองปลายรากทะลุผนังกระดูกที่บางกว่าและสัมพันธ์กับจุดเกาะกล้ามเนื้อ", "รากฟันกรามล่าง (7, 8) มักทะลุ Lingual plate ใต้ Mylohyoid line เข้าสู่ Submandibular space โดยตรง; รากฟันหน้า/กรามน้อยเหนือ Mylohyoid line เข้า Sublingual space", "mechanism"),
                _node(2, "ภาวะวิกฤตทั้ง 2 ข้าง (Ludwig's Angina)", "ติดเชื้อแบบ Cellulitis แข็งเป็นไม้กระดาน (Board-like swelling) 3 Spaces ทั้ง 2 ข้าง", "เกี่ยวข้องกับ Submental + Bilateral Submandibular + Bilateral Sublingual spaces ➔ ดันลิ้นยกสูงคับช่องคอ (Elevated floor of mouth)", "warning"),
                _node(3, "อันดับแรกสุดในการจัดการ (Airway First!)", "ตรวจ Stridor, Dysphagia, หายใจลำบาก, ยกลิ้นตึง", "⚠️ Airway Patency สำคัญที่สุด! ห้ามนอนราบ รีบ Secure Airway (Awake fiberoptic intubation / Tracheostomy) + ส่งห้องฉุกเฉิน รพ.ศูนย์ทันที", "action"),
                _node(4, "กำจัดเชื้อ & ระบายหนอง", "Empiric IV Antibiotics + Incision & Drainage + ถอนฟันต้นเหตุ", "ให้ IV Penicillin G/Ampicillin-Sulbactam + Metronidazole ร่วมกับการกรีดระบายหนองเมื่อ Airway ปลอดภัย", "outcome"),
            ],
        }
    ],
    "OMFS-Oroantral-Communication": [
        {
            "id": "oac-protocol",
            "title": "Clinical Protocol: การจัดการรูทะลุโพรงอากาศข้างจมูก (OAC) ตามขนาดและภาวะติดเชื้อ",
            "pathway_type": "decision",
            "subtitle": "ตรวจ Valsalva / Nose-Blowing Test ➔ ตัดสินใจตามขนาด <2 mm, 2–6 mm, >6 mm และไซนัสอักเสบ",
            "reference": "Hupp's Contemporary OMFS (7th ed.)",
            "steps": [
                _node(1, "ประเมินรูทะลุ & ไซนัส (Assessment)", "ดูขนาดรูทะลุและตรวจประวัติ Maxillary Sinusitis", "หลีกเลี่ยงการสั่งให้คนไข้เป่าจมูกแรงเกินไปจนแผ่นเยื่อฉีกขาดเพิ่ม", "decision", [
                    {"condition": "ขนาดเล็ก < 2 mm และไม่มีไซนัสอักเสบ", "outcome": "รักษาลิ่มเลือดให้คงตัว (Figure-of-eight suture + กัดผ้าก๊อซ + Sinus precautions) แผลปิดเองได้", "color": "#10b981"},
                    {"condition": "ขนาด 2–6 mm (ไม่มีติดเชื้อ)", "outcome": "Figure-of-eight suture + ใส่ Gelfoam ช่วยยึดลิ่มเลือด + ยาปฏิชีวนะ & ยาลดคัดจมูก", "color": "#38bdf8"},
                    {"condition": "ขนาด > 6 mm / รากฟันทะลุเข้าไซนัส / เป็น OAF เรื้อรัง", "outcome": "ต้องผ่าตัดปิดแบบ Primary Closure ด้วย Buccal Advancement Flap / Buccal Fat Pad + กำจัดไซนัสอักเสบก่อนปิด OAF", "color": "#f59e0b"},
                ]),
                _node(2, "คำแนะนำผู้ป่วยหลังเย็บปิด (Sinus Precautions)", "ห้ามสั่งน้ำมูก, อ้าปากกว้างเวลาจาม, ห้ามดูดหลอด, ห้ามเป่าลม/สูบบุหรี่ 2 สัปดาห์", "จ่าย Amoxicillin/Clavulanate + Oxymetazoline nasal spray ลดความดันในไซนัส", "outcome"),
            ],
        }
    ],
    "Perio-Classification-2017": [
        {
            "id": "perio-2017-pathway",
            "title": "AAP/EFP 2018 (TAP E-book 2023) Diagnostic Pathway & TAP Guideline 2025 Prognosis Linkage",
            "pathway_type": "decision",
            "subtitle": "แนวทางวินิจฉัยโรคปริทันต์ (TAP E-book 2023) รวม 5 ข้อยกเว้น CAL เชื่อมโยงระบบพยากรณ์โรค 2 ชั้นล่าสุด (TAP Guideline 2025)",
            "reference": "AAP/EFP 2018 World Workshop; สมาคมปริทันตวิทยาแห่งประเทศไทย (TAP E-book 2023 & TAP Guideline 2025, พ.ศ. 2568)",
            "steps": [
                _node(1, "คัดกรองเบื้องต้น (Periodontitis Case Definition & 5 ข้อยกเว้น)", "ตรวจ BOP %, PD และ CAL พร้อมแยก 5 สาเหตุที่ CAL ไม่ใช่ Periodontitis", "Periodontitis ต้องพบ (1) Interdental CAL ≥ 2 ซี่ที่ไม่ติดกัน หรือ (2) Buccal/Oral CAL ≥ 3 mm + PD > 3 mm ≥ 2 ซี่ และไม่ใช่จาก 5 ข้อยกเว้น (Traumatic recession, Cervical caries, 37D จากฟันคุดซี่ 38, Endo drainage, VRF)", "decision", [
                    {"condition": "ไม่เข้าเกณฑ์ Periodontitis (ไม่มี CAL หรือเป็น 1 ใน 5 ข้อยกเว้น)", "outcome": "BOP ≥ 10% = Gingivitis (Localized 10–30%, Generalized >30%); BOP < 10% = Health (Intact: PD ≤ 3 mm; Reduced stable: PD ≤ 4 mm และไม่มี PD = 4 mm ที่ BOP+)", "color": "#10b981"},
                    {"condition": "เข้าเกณฑ์ Periodontitis Case Definition", "outcome": "วินิจฉัย Periodontitis ➔ กำหนด Stage (I–IV ตลอดชีวิต) + Grade (A–C) + Extent (<30%, ≥30%, Molar-Incisor)", "color": "#f59e0b"},
                ]),
                _node(2, "กำหนด Stage & Grade (ระดับกระดูกปกติ = 2 mm ใต้ CEJ)", "Severity & Complexity: CAL (1–2 / 3–4 / ≥5 mm) + %RBL + Tooth Loss + Complexity-shifters", "Stage I–II (CAL 1–4 mm, RBL ≤33%, PD ≤5 mm) • Stage III (CAL ≥5 mm, สูญเสีย ≤4 ซี่, PD ≥6 mm, Vertical ≥3 mm, Hamp Furc II/III) • Stage IV (สูญเสีย ≥5 ซี่ / เหลือ <20 ซี่ <10 คู่สบ / Secondary occlusal trauma); Grade ปรับจาก %Bone Loss/Age (<0.25, 0.25–1.0, >1.0) และบุหรี่ ≥10 มวน หรือ HbA1c ≥7.0% → Grade C", "mechanism"),
                _node(3, "เชื่อมสู่ TAP 2025 Prognosis (2 ชั้น) & Re-prognosis รายครั้ง", "Tooth-level 4 ระดับ (Favorable / Questionable / Unfavorable / Hopeless) + Patient-level 3 ระดับ (Good / Fair / Poor)", "Tooth-level ยกเลิกคำว่า Fair/Poor แล้ว (หาก Questionable + บุหรี่ ≥10 มวน หรือ HbA1c ≥7% → Unfavorable); Patient-level เชื่อม Stage (Good: Health/Gingivitis/Stage I–II • Fair: Stage III • Poor: Stage IV/Molar-Incisor) ปรับลด 1 ขั้นเมื่อมี 4 Shifters (Systemic, Compliance/SPT, Parafunction, <20 ซี่/<10 คู่สบ; รากเทียมไม่ลดระดับแต่นับเป็นคู่สบได้) และประเมิน Re-prognosis ทุกครั้งที่รักษา", "outcome"),
            ],
        }
    ],
    "Perio-Biologic-Width-Crown-Lengthening": [
        {
            "id": "perio-tx-crown-lengthening",
            "title": "Periodontal Therapy Sequence & Crown Lengthening Protocol",
            "pathway_type": "protocol",
            "subtitle": "Phase I (SRP ➔ Re-evaluation 4–6 wk) ➔ กฎระยะความกว้างทางชีวภาพ (STA ~2 mm, Grasp ≥3 mm)",
            "reference": "Newman & Carranza's Periodontology & สมาคมปริทันตวิทยาแห่งประเทศไทย (TAP)",
            "steps": [
                _node(1, "Phase I Therapy (Etiotropic)", "OHI + SRP + กำจัดปัจจัยกักเก็บคราบจุลินทรีย์", "ลดการอักเสบและสอนผู้ป่วยคุม Plaque ➔ เป้าหมาย O'Leary Plaque Score ≤ 10–20%", "action"),
                _node(2, "Re-evaluation (หลัง SRP 4–6 สัปดาห์)", "รอให้ Epithelium & Connective tissue หายสนิทก่อนวัดร่องลึกซ้ำ", "ตัดสินใจเข้า Phase II Surgery หรือ Phase IV Maintenance (SPT) ทุก 3 เดือน", "mechanism"),
                _node(3, "กฎ Supracrestal Tissue Attachment (Biologic Width)", "JE (~0.97 mm) + CT Attachment (~1.07 mm) ≈ 2.04 mm (บวก Sulcus 1 mm = 3 mm)", "หากกรอขอบครอบฟันรุกล้ำพื้นที่นี้ จะเกิดเหงือกอักเสบเรื้อรัง/ละลายกระดูก ➔ แก้ด้วยการทำ Surgical Crown Lengthening (กรอกระดูกให้ห่างขอบครอบฟัน ≥ 3.0 mm) หรือ Orthodontic Extrusion", "outcome"),
            ],
        }
    ],
    "Perio-Etiology-Microbiology": [
        {
            "id": "perio-host-pathogenesis",
            "title": "Pathogenesis Cascade: จากคราบจุลินทรีย์ (Biofilm) สู่การละลายกระดูกปริทันต์",
            "pathway_type": "pathogenesis",
            "subtitle": "Socransky's Complexes ➔ Host Immuno-Inflammatory Response (MMPS & RANKL)",
            "reference": "Newman & Carranza's Clinical Periodontology (13th ed.)",
            "steps": [
                _node(1, "Biofilm Maturation", "Acquired Pellicle ➔ Early Colonizers (S. sanguinis/oralis) ➔ Bridging (F. nucleatum)", "ฟิวโซแบคทีเรียมเชื่อมโยงสู่เชื้อไม่ใช้ออกซิเจนชนิดรุนแรง (Red Complex: P. gingivalis, T. forsythia, T. denticola)", "trigger"),
                _node(2, "การกระตุ้นภูมิคุ้มกัน (Host Response)", "LPS / Virulence factors กระตุ้น Macrophages & Neutrophils", "หลั่ง Pro-inflammatory cytokines: IL-1β, TNF-α, IL-6 และ PGE2", "mechanism"),
                _node(3, "การทำลายเนื้อเยื่อ & กระดูก (Tissue Destruction)", "MMPs (Collagenase) + RANKL/OPG Ratio สูงขึ้น", "MMP-8 ทำลายคอลลาเจนใน PDL/เหงือก และ RANKL จับ RANK กระตุ้น Osteoclasts สลายกระดูกเบ้าฟันเกิด Periodontal Pocket & Bone Loss", "outcome"),
            ],
        }
    ],
    "Operative-Cariology-Pathology": [
        {
            "id": "caries-demin-remin",
            "title": "Pathogenesis of Dental Caries: กราฟสเตฟาน (Stephan Curve) & กลไกคืนแร่ธาตุของฟลูออไรด์",
            "pathway_type": "pathogenesis",
            "subtitle": "สมดุลกรด-แร่ธาตุใน Biofilm, Critical pH 5.5 (Enamel) / 6.2–6.7 (Dentin) ➔ White Spot Lesion",
            "reference": "Sturdevant's Operative Dentistry & Fejerskov Dental Caries",
            "steps": [
                _node(1, "Fermentation & pH Drop", "แบคทีเรีย (S. mutans / Lactobacilli) หมักน้ำตาลซูโครสเกิดกรดแลคติก", "ค่า pH ใน Biofilm ลดลงต่ำกว่า Critical pH ของ Enamel (~5.5) ทำให้ Ca²⁺ และ PO₄³⁻ ละลายออกจาก Subsurface", "trigger"),
                _node(2, "รอยโรคเริ่มต้น (White Spot Lesion)", "ผิวนอกเคลือบฟัน (Surface zone) ยังคงสภาพ แต่ใต้ผิวฟันพรุน (Subsurface demineralization)", "เห็นสีขาวขุ่นเมื่อเป่าแห้ง (แห้งขุ่น เปียกใส) — ระยะ Non-cavitated นี้สามารถย้อนกลับ (Reverse) ได้ด้วยฟลูออไรด์!", "mechanism"),
                _node(3, "กลไกป้องกัน & คืนแร่ธาตุ (Remineralization)", "ฟลูออไรด์เร่ง Ca²⁺/PO₄³⁻ ตกผลึกเป็น Fluorapatite (Critical pH ลดลงเหลือ ~4.5)", "แนวทางไทย TODS/MID: ถ้ายังไม่เป็นโพรง (Non-cavitated) เน้นควบคุมน้ำตาล + 5% NaF Varnish; ถ้าผุลึกใน Dentin ใช้ Selective Caries Removal ป้องกันทะลุพัลพ์", "outcome"),
            ],
        }
    ],
    "Operative-Pulp-Protection-Deep-Caries": [
        {
            "id": "operative-rdt-mid-protocol",
            "title": "Clinical Protocol: การปกป้องโพรงประสาทฟันตาม Remaining Dentin Thickness (RDT)",
            "pathway_type": "decision",
            "subtitle": "แนวทาง Minimal Intervention Dentistry (TODS Thailand) สำหรับโพรงฟันลึก",
            "reference": "Sturdevant's Operative Dentistry & สมาคมทันตกรรมหัตถการแห่งประเทศไทย (TODS)",
            "steps": [
                _node(1, "การกรอผุเชิงอนุรักษ์ (Selective Caries Removal)", "กรอผุขอบนอกรอบโพรง (Peripheral Seal 1.5–2 mm) ให้ถึง Hard Dentin สนิท", "แต่ผนังด้านใกล้พัลพ์ (Pulpal/Axial wall) ในฟันที่ไม่มีอาการ ให้กรอแค่ Soft/Firm dentin เพื่อหลีกเลี่ยง Mechanical pulp exposure", "action"),
                _node(2, "เลือก Liner / Base ตามความหนาเนื้อฟันที่เหลือ (RDT)", "ประเมินระยะห่างระหว่างพื้นโพรงฟันกับโพรงประสาท", "decision", [
                    {"condition": "RDT ≥ 2.0 mm (ตื้น–ปานกลาง)", "outcome": "ไม่จำเป็นต้องใส่ Liner/Base ➔ Bonding + Composite ได้เลย", "color": "#10b981"},
                    {"condition": "RDT 0.5–1.5 mm (ลึก)", "outcome": "รองพื้นเฉพาะด้วย RMGIC Base เพื่อลด Shrinkage stress และเป็นฉนวนความร้อน", "color": "#38bdf8"},
                    {"condition": "RDT < 0.5 mm (ชิดพัลพ์/แดงเรื่อ)", "outcome": "แต้มเฉพาะจุดด้วย Ca(OH)2 หรือ MTA/Biodentine ➔ ทับด้วย RMGIC liner ➔ บูรณะปิดผนึก", "color": "#f59e0b"},
                ]),
            ],
        }
    ],
    "Operative-Adhesive-Systems": [
        {
            "id": "adhesive-hybrid-pathway",
            "title": "Bonding Protocol: Etch-and-Rinse vs Self-Etch / Universal 10-MDP (Hybrid Layer)",
            "pathway_type": "procedure",
            "subtitle": "กระบวนการสร้าง Micromechanical + Chemical Bonding (Wet Bonding vs Smear Layer Modification)",
            "reference": "Sturdevant's Operative Dentistry (7th ed.)",
            "steps": [
                _node(1, "เลือกกลยุทธ์ต่อ Smear Layer", "Phosphoric Acid 35–37% vs Mild Acidic Monomer (10-MDP)", "decision", [
                    {"condition": "Etch-and-Rinse (Total-Etch)", "outcome": "กัดกรดละลาย Smear layer ทั้งหมด (Enamel 15–30s, Dentin ไม่เกิน 15s) ➔ ล้างน้ำ + ซับชื้นหมาด (Wet Bonding! ห้ามเป่าจน Collagen แฟบ)", "color": "#6366f1"},
                    {"condition": "Self-Etch / Universal (แนะนำ Selective Enamel Etch)", "outcome": "ใช้ 37% Phosphoric กัดเฉพาะขอบ Enamel 15s ➔ ทา Universal 10-MDP (สร้างเกลือ 10-MDP-Ca ยึดเคมี + ดัดแปลง Smear layer ไม่เสียวฟัน)", "color": "#10b981"},
                ]),
                _node(2, "Resin Infiltration & Hybrid Layer", "Hydrophilic Primer แทรกซึมเข้า Collagen network + เป่าลมไล่ตัวทำละลายเบาๆ", "ต้องเป่าจนไม่เห็นผิวกระเพื่อม (ไล่ Acetone/Ethanol/Water) เพื่อให้เกิด Hybrid Layer แนบแน่น", "mechanism"),
                _node(3, "Photopolymerization & Composite Layering", "ฉายแสงบ่ม Adhesive + อุดเรซินทีละชั้น ≤ 2 mm (ลด C-Factor)", "ใช้เทคนิค Incremental technique หลีกเลี่ยงการเชื่อมผนังตรงข้ามพร้อมกันในครั้งเดียวเพื่อลด Polymerization shrinkage stress", "outcome"),
            ],
        }
    ],
    "Pedia-Primary-Pulp-Therapy": [
        {
            "id": "pedia-pulp-pathway",
            "title": "Pediatric Pulp Therapy Protocol (ฟันน้ำนม): IPC ➔ Pulpotomy ➔ Pulpectomy vs Extract",
            "pathway_type": "decision",
            "subtitle": "เกณฑ์สำคัญ AAPD: ดูอาการปวดกลางคืน, การห้ามเลือดใน 5 นาที และ Root Resorption > 1/3",
            "reference": "McDonald & Avery, AAPD Reference Manual & TSPD Thailand",
            "steps": [
                _node(1, "ประเมินประวัติ & ภาพรังสี (Pre-op Screen)", "ถามอาการ Spontaneous/Night pain + ตรวจ Furcation radiolucency & การละลายราก", "ตัดสินใจระหว่าง Vital vs Non-Vital", "decision", [
                    {"condition": "ไม่มี Spontaneous pain, ไม่ละลายราก", "outcome": "ทำ Vital Pulp Therapy (IPC หากไม่ทะลุ หรือ Pulpotomy ด้วย MTA/Ferric Sulfate/Formocresol หากทะลุ)", "color": "#10b981"},
                    {"condition": "มี Spontaneous pain / หนอง / ฟันตาย แต่รากละลาย < 1/3", "outcome": "ทำ Pulpectomy + อุดคลองรากด้วยวัสดุที่ละลายพร้อมราก (ZnOE / Iodoform-Ca(OH)2 เช่น Metapex)", "color": "#f59e0b"},
                    {"condition": "Internal/External root resorption มาก > 1/3 หรือทำลายหน่อฟันแท้", "outcome": "ถอนฟัน (Extraction) + ใส่ Space Maintainer ตามตำแหน่งฟัน!", "color": "#ef4444"},
                ]),
                _node(2, "บูรณะขั้นสุดท้าย (Final Restoration)", "ครอบฟันโลหะไร้สนิม (Stainless Steel Crown - SSC)", "หลังทำ Pulpotomy หรือ Pulpectomy ในฟันกรามน้ำนม ต้องใส่ SSC เสมอเพื่อป้องกันฟันแตกและ Microleakage", "outcome"),
            ],
        }
    ],
    "Pedia-Fluoride-Pharmacology-Toxicity": [
        {
            "id": "thai-fluoride-toxic-pathway",
            "title": "เกณฑ์ฟลูออไรด์ไทย (TSPD/กรมอนามัย) & Emergency Pathway เมื่อเด็กกินฟลูออไรด์เกินขนาด (PTD)",
            "pathway_type": "protocol",
            "subtitle": "1,000 ppm ปริมาณตามอายุ + ตารางเสริมตาม F น้ำดื่ม (<0.3 / 0.3–0.6 / >0.6 ppm) + แก้พิษ PTD 5 mg/kg",
            "reference": "สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย (TSPD 2560/2566) & ทันตแพทยสภา",
            "steps": [
                _node(1, "ยาสีฟันประจำวัน (TSPD Thailand)", "ใช้ 1,000–1,500 ppm ตั้งแต่ฟันน้ำนมซี่แรกขึ้น!", "<3 ปี: แตะพอเปียก/เมล็ดข้าวสาร (~0.1g) เช็ดฟองออก | 3–<6 ปี: เท่าเมล็ดถั่วเขียว (~0.25g) | ≥6 ปี: เต็มหน้าตัดแปรง", "action"),
                _node(2, "ฟลูออไรด์เม็ดเสริม (เฉพาะ High Caries Risk 6 เดือน – 16 ปี)", "เช็กปริมาณฟลูออไรด์ในน้ำดื่มของพื้นที่นั้นก่อนเสมอ!", "อายุ <6 เดือน หรือ น้ำดื่มมี F > 0.6 ppm ➔ ห้ามจ่ายฟลูออไรด์เสริมทุกกรณี! (<0.3 ppm จ่าย 0.25/0.5/1.0 mg ตามช่วงอายุ)", "decision"),
                _node(3, "ภาวะฉุกเฉินพิษฟลูออไรด์ (PTD ≥ 5 mg F/kg)", "ฟลูออไรด์จับกับกรดในกระเพาะเป็น HF (กัดกร่อน) + จับกับ Ca²⁺ เกิด Hypocalcemia", "decision", [
                    {"condition": "ได้รับ < 5 mg F/kg", "outcome": "ให้ดื่มนมหรือ Calcium gluconate เพื่อตกตะกอน CaF₂ + สังเกตอาการ", "color": "#38bdf8"},
                    {"condition": "ได้รับ ≥ 5 mg F/kg (PTD) หรือ ≥ 15 mg F/kg (Certainly Lethal)", "outcome": "ป้อนนม/สารละลายแคลเซียมทันที (ห้ามทำให้อาเจียนถ้าซึม) + รีบนำส่งโรงพยาบาลให้ IV Calcium gluconate + ล้างท้อง", "color": "#ef4444"},
                ]),
            ],
        }
    ],
    "Pedia-Dental-Traumatology": [
        {
            "id": "iadt-avulsion-pathway",
            "title": "IADT 2020 Emergency Pathway: ฟันหลุดออกจากเบ้า (Primary vs Permanent Avulsion)",
            "pathway_type": "decision",
            "subtitle": "เวลาบนพื้นแห้ง (Extra-oral Dry Time) & ความสมบูรณ์ของปลายรากคือตัวกำหนดชะตาของ PDL Cells",
            "reference": "IADT Guidelines 2020 & สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย (TSPD)",
            "steps": [
                _node(1, "แยกชนิดฟันทันที!", "ฟันน้ำนม vs ฟันแท้", "decision", [
                    {"condition": "ฟันน้ำนม (Primary Tooth Avulsion)", "outcome": "🛑 ห้ามใส่กลับเข้าเบ้าฟัน (Do NOT replant) เด็ดขาด! เพื่อไม่ให้กระทบหน่อฟันแท้ข้างใต้", "color": "#ef4444"},
                    {"condition": "ฟันแท้ (Permanent Tooth Avulsion)", "outcome": "จับเฉพาะตัวฟัน (Crown) อย่าแตะราก ➔ ใส่กลับทันที หรือแช่ใน Cold Milk / HBSS / NSS (ห้ามแช่น้ำเปล่า!)", "color": "#10b981"},
                ]),
                _node(2, "ประเมิน Extra-oral Dry Time (EODT)", "เซลล์ PDL อยู่รอดได้นานแค่ไหนนอกช่องปาก?", "decision", [
                    {"condition": "EODT < 60 นาที (หรือแช่สื่อที่เหมาะสม)", "outcome": "ล้างเบาๆ ด้วย NSS ➔ Replant ➔ Flexible splint 2 สัปดาห์ (กระดูกหัก 4 สัปดาห์)", "color": "#10b981"},
                    {"condition": "EODT > 60 นาที (เซลล์ PDL ตายแล้ว)", "outcome": "ขูดซาก PDL ออก/ทำ RCT นอกปากได้ ➔ แช่ 2% NaF 20 นาที ชะลอ Ankylosis ➔ Replant + Splint 4 สัปดาห์", "color": "#f59e0b"},
                ]),
                _node(3, "การรักษาราก & ยา (Post-Replantation)", "เริ่ม RCT ภายใน 7–10 วันในฟันแท้ปลายรากปิด (ก่อนถอด Splint)", "ใส่ Ca(OH)2 (หรือ Corticosteroid-antibiotic paste) + ให้ Doxycycline/Amoxicillin + ตรวจวัคซีนบาดทะยัก", "outcome"),
            ],
        }
    ],
    "OralMed-Premalignant-Malignancy": [
        {
            "id": "oral-cancer-screening-pathway",
            "title": "Thai Screening & Biopsy Protocol: รอยโรคก่อนมะเร็งช่องปาก (OPMDs) & OSCC",
            "pathway_type": "protocol",
            "subtitle": "คัดกรองความเสี่ยงสูงในไทย (เคี้ยวหมากพลู/ยาเส้น) ➔ กฎ 2 สัปดาห์ ➔ เทคนิคการตัดชิ้นเนื้อที่ถูกต้อง",
            "reference": "Neville's Oral Pathology & สถาบันมะเร็งแห่งชาติ-กรมอนามัย",
            "steps": [
                _node(1, "คัดกรองปัจจัยเสี่ยง & รอยโรค", "ซักประวัติสูบบุหรี่ ดื่มสุรา เคี้ยวหมากพลู (พบมากที่กระพุ้งแก้มในผู้สูงอายุไทย)", "สังเกตรอยโรค Erythroplakia (โอกาสกลายเป็นมะเร็งสูงสุด!), Speckled leukoplakia, OSMF (อ้าปากแคบเป็นแถบพังผืด)", "trigger"),
                _node(2, "กฎ 2 สัปดาห์ (2-Week Observation Rule)", "กำจัดสาเหตุระคายเคือง (เช่น ขอบฟันคม ฟันเทียมหลวม) แล้วนัดดูซ้ำที่ 14 วัน", "decision", [
                    {"condition": "รอยโรคยุบหายดีภายใน 2 สัปดาห์", "outcome": "Traumatic / Reactive lesion ➔ ติดตามต่อเนื่องตามความเหมาะสม", "color": "#10b981"},
                    {"condition": "รอยโรคยังคงอยู่เกิน 2 สัปดาห์ (หรือสงสัยรุนแรงทันที)", "outcome": "ทำ Incisional Biopsy ทันที!", "color": "#ef4444"},
                ]),
                _node(3, "หลักตัดชิ้นเนื้อที่ถูก (Biopsy Technique)", "ใช้ Toluidine blue ช่วยเลือกจุด (หากขนาดใหญ่) ➔ ตัดขอบรอยโรค (Margin + Normal tissue)", "⚠️ ห้ามตัดตรงกลางแผลที่มีเนื้อตาย (Necrotic center) และตัดชิ้นเนื้อลึกพอถึง Submucosa + แช่ 10% Neutral Buffered Formalin", "outcome"),
            ],
        }
    ],
    "OralMed-Medically-Compromised-CVD": [
        {
            "id": "aha-2021-ie-pathway",
            "title": "AHA 2021 Protocol: การป้องกันเยื่อบุหัวใจอักเสบติดเชื้อ (IE Prophylaxis)",
            "pathway_type": "decision",
            "subtitle": "เกณฑ์คู่ 2 เงื่อนไข (ผู้ป่วยเสี่ยงสูง x หัตถการที่มีเลือดออก) + กฎใหม่: ห้ามใช้ Clindamycin!",
            "reference": "AHA 2021 Scientific Statement & คู่มือ RDU Thailand",
            "steps": [
                _node(1, "เงื่อนไขที่ 1: โรคหัวใจกลุ่มเสี่ยงสูง (4 กลุ่มหลักเท่านั้น)", "Prosthetic valve • Previous IE • Unrepaired cyanotic CHD / Post-repair <6 เดือนที่มี Residual defect • Heart transplant valvulopathy", "❌ MVP, Rheumatic heart disease เฉยๆ, ใส่ Stent หลอดเลือดหัวใจ, Pacemaker ไม่ต้องกินยาป้องกัน IE!", "decision"),
                _node(2, "เงื่อนไขที่ 2: หัตถการที่มีเลือดออก/รบกวนเหงือกและปลายรากฟัน", "ถอนฟัน, ขูดหินน้ำลาย, วาง Probe ปริทันต์, RCT ทะลุปลายราก", "❌ การฉีดยาชาผ่านเนื้อเยื่อไม่ติดเชื้อ, ถ่าย X-ray, ปรับลวดจัดฟัน, ฟันน้ำนมหลุดเอง ไม่ต้องให้ยา", "mechanism"),
                _node(3, "เลือกยาปฏิชีวนะกินครั้งเดียวก่อนทำ 30–60 นาที (AHA 2021 Update)", "ผู้ใหญ่ (Standard vs Penicillin Allergy)", "decision", [
                    {"condition": "ไม่แพ้ Penicillin", "outcome": "Amoxicillin 2 g (เด็ก 50 mg/kg) 30–60 นาทีก่อนทำ", "color": "#10b981"},
                    {"condition": "แพ้ Penicillin (ไม่รุนแรง vs Anaphylaxis)", "outcome": "Azithromycin 500 mg / Clarithromycin 500 mg / Doxycycline 100 mg (⚠️ งดจ่าย Clindamycin แล้วตาม AHA 2021!)", "color": "#f59e0b"},
                ]),
            ],
        }
    ],
    "OralMed-Medically-Compromised-Bleeding": [
        {
            "id": "thai-warfarin-pathway",
            "title": "Thai Protocol: การถอนฟันในผู้ป่วยรับประทานยาละลายลิ่มเลือด (Warfarin / Antiplatelet)",
            "pathway_type": "protocol",
            "subtitle": "เจาะตรวจ INR ภายใน 24–72 ชม. ➔ ห้ามหยุดยาเอง ➔ Local Hemostasis & 5% Tranexamic Acid",
            "reference": "แนวทางทันตแพทยสภา & สมาคมศัลยศาสตร์ช่องปากแห่งประเทศไทยฯ (TAOMS)",
            "steps": [
                _node(1, "ตรวจค่า INR ล่าสุด (ภายใน 24–72 ชม.)", "ประเมินความเสี่ยงเลือดออก vs ความเสี่ยงลิ่มเลือดอุดตัน (Thromboembolism)", "decision", [
                    {"condition": "INR ≤ 3.0–3.5 (ระดับรักษาปกติ 2.0–3.0)", "outcome": "ถอนฟันไม่ซับซ้อน (1–3 ซี่) ได้เลยโดย 'ไม่ต้องหยุด Warfarin!'", "color": "#10b981"},
                    {"condition": "INR > 3.5 หรือผ่าตัดซับซ้อน", "outcome": "ปรึกษาแพทย์เจ้าของไข้เพื่อปรับขนาดยา ไม่สั่งผู้ป่วยหยุดยาเอง!", "color": "#ef4444"},
                ]),
                _node(2, "Atraumatic Extraction & Local Hemostasis", "ถอนฟันแบบลดบาดเจ็บ + ใส่ Gelfoam / Oxidized cellulose ในเบ้าฟัน", "เย็บแผล Figure-of-eight เพื่อพยุงขอบเหงือกและกดลิ่มเลือด", "action"),
                _node(3, "Post-op Stabilization (Tranexamic Acid)", "อมบ้วนปากด้วย 5% Tranexamic acid mouthwash 10 mL นาน 2 นาที วันละ 4 ครั้ง นาน 2–5 วัน", "หลีกเลี่ยงยาแก้ปวดกลุ่ม NSAIDs (ให้ Paracetamol แทน) และหลีกเลี่ยง Metronidazole ที่ตีกับ Warfarin!", "outcome"),
            ],
        }
    ],
    "Ortho-Biomechanics-Tooth-Movement": [
        {
            "id": "ortho-bone-remodeling",
            "title": "Biological Pathway: ชีวกลศาสตร์การเคลื่อนฟัน (Frontal vs Undermining Resorption)",
            "pathway_type": "pathogenesis",
            "subtitle": "ขนาดแรงจัดฟัน (Optimal Light vs Heavy Force) ➔ การตอบสนองของ PDL, cAMP/PGE2 และ Osteoclasts",
            "reference": "Proffit's Contemporary Orthodontics (6th ed.) & TAO",
            "steps": [
                _node(1, "การให้แรงจัดฟัน (Force Magnitude)", "เปรียบเทียบแรงเบาต่อเนื่อง (Optimal Force) vs แรงมากเกิน (Heavy Force)", "เกิดโซนกดทับ (Compression side) และโซนดึงรั้ง (Tension side) ในเอ็นยึดปริทันต์ (PDL)", "decision", [
                    {"condition": "แรงเบาต่อเนื่อง (~20–25 g/cm²)", "outcome": "เลือดไหลเวียนใน PDL ได้ ➔ ปล่อย PGE2, cAMP, IL-1 ➔ เกิด Frontal (Direct) Resorption เคลื่อนฟันนุ่มนวล!", "color": "#10b981"},
                    {"condition": "แรงมากเกิน Capillary pressure", "outcome": "หลอดเลือดตีบตัน ➔ PDL ตายปราศจากเซลล์ (Hyalinization / Cell-free zone) ➔ ฟันหยุดนิ่ง รอ Osteoclasts จากไขกระดูกทำ Undermining (Indirect) Resorption ใน 7–14 วัน", "color": "#ef4444"},
                ]),
                _node(2, "สมดุลด้านรับแรงดึง (Tension Side)", "PDL ยืดออก ➔ Osteoblasts สร้างกระดูกใหม่ (Bone Apposition)", "ต้องใช้แรงที่เหมาะสมกับจุดศูนย์กลางความต้านทาน (Cres) เช่น Tipping vs Bodily movement (M/F ~10:1)", "outcome"),
            ],
        }
    ],
    "TMD-DC-TMD-Diagnostic-Criteria": [
        {
            "id": "tmd-care-pathway",
            "title": "Clinical Care Pathway: เกณฑ์วินิจฉัย DC/TMD & Conservative-First Treatment",
            "pathway_type": "decision",
            "subtitle": "แยกอาการปวดกล้ามเนื้อ vs Intra-articular TMJ Disorder (DDwR / DDwoR) ➔ การรักษาแบบ Reversible",
            "reference": "Okeson (8th ed.), DC/TMD ฉบับภาษาไทย & ชมรมทันตกรรมบดเคี้ยวฯ",
            "steps": [
                _node(1, "ตรวจคัดกรอง DC/TMD", "กดกล้ามเนื้อ Masseter/Temporalis นาน 5 วินาที + ฟังเสียงคลิก/วัดระยะอ้าปาก", "แยก Axis I (Physical) เป็น 2 กลุ่มหลัก", "decision", [
                    {"condition": "ปวดเฉพาะจุด หรือ ปวดร้าวออกนอกมัดกล้ามเนื้อ", "outcome": "Myalgia / Myofascial pain with referral (มักจำลองอาการปวดที่คุ้นเคย Familiar pain ได้)", "color": "#38bdf8"},
                    {"condition": "เสียง Clicking อ้าปากและปิดปาก (อ้าสุดได้ปกติ)", "outcome": "Disc Displacement with Reduction (DDwR) — แผ่นรองข้อเคลื่อนมาด้านหน้าแล้วเด้งกลับเมื่ออ้า", "color": "#f59e0b"},
                    {"condition": "เคยคลิกแต่จู่ๆ เสียงหาย + อ้าปากได้ < 35 mm เอียงไปข้างที่เป็น", "outcome": "Disc Displacement without Reduction with Limited Opening (Closed Lock)", "color": "#ef4444"},
                ]),
                _node(2, "การรักษาอันดับแรก (Conservative & Reversible)", "Self-care, อาหารอ่อน, ประคบอุ่น, กายภาพบำบัด, Hard Acrylic Stabilization Splint", "⚠️ กฎเหล็กข้อสอบ: ห้ามกรอปรับสบฟันถาวร (Occlusal equilibration) หรือผ่าตัดเป็นลำดับแรก!", "outcome"),
            ],
        }
    ],
    "Law-Dental-Profession-Act": [
        {
            "id": "dental-council-disciplinary",
            "title": "Legal Procedure Pathway: กระบวนการสอบสวนทางจรรยาบรรณ (พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537)",
            "pathway_type": "legal",
            "subtitle": "ตั้งแต่อายุความ 1 ปี ➔ คณะอนุกรรมการจรรยาบรรณ ➔ คณะกรรมการทันตแพทยสภา ➔ สภานายกพิเศษ",
            "reference": "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 (แก้ไข 2559) ทันตแพทยสภา",
            "steps": [
                _node(1, "สิทธิการกล่าวหา/กล่าวโทษ (อายุความ 1 ปี)", "ผู้เสียหายกล่าวหา หรือ คณะกรรมการ/บุคคลอื่นกล่าวโทษ", "⚠️ อายุความจรรยาบรรณ: ต้องยื่นภายใน 1 ปีนับแต่วันที่รู้เรื่องและรู้ตัวผู้ประพฤติผิด", "trigger"),
                _node(2, "ชั้นไต่สวนหาข้อเท็จจริง", "คณะอนุกรรมการจรรยาบรรณสอบสวน ➔ คณะอนุกรรมการสอบสวน", "ให้โอกาสผู้ถูกกล่าวหาชี้แจงแสดงพยานหลักฐาน ก่อนสรุปสำนวนเสนอคณะกรรมการทันตแพทยสภา", "mechanism"),
                _node(3, "การวินิจฉัยชี้ขาด & สภานายกพิเศษ (รมว.สธ.)", "คณะกรรมการทันตแพทยสภาพิจารณาลงมติ ➔ ส่งรัฐมนตรี (สภานายกพิเศษ) พิจารณาใน 30 วัน", "หากสภานายกพิเศษยับยั้ง (Veto) ภายใน 30 วัน ➔ คณะกรรมการประชุมใหม่ หากยืนยันด้วยคะแนนเสียง ≥ 2 ใน 3 ถือเป็นอันชี้ขาด!", "decision"),
                _node(4, "บทลงโทษทางจรรยาบรรณ (4 ระดับ)", "ว่ากล่าวตักเตือน • ภาคทัณฑ์ • พักใช้ใบอนุญาต (ไม่เกิน 2 ปี) • เพิกถอนใบอนุญาต", "หากถูกสั่งพักใช้ใบอนุญาตแล้วแอบรักษา (ม.43) ➔ โทษจำคุก ≤ 2 ปี หรือปรับ ≤ 20,000 บาท; ไม่มีใบประกอบฯ (ม.28) ➔ จำคุก ≤ 3 ปี หรือปรับ ≤ 30,000 บาท", "outcome"),
            ],
        }
    ],
    "Law-Sanatorium-Act": [
        {
            "id": "sanatorium-licensing-pathway",
            "title": "Legal Protocol: ใบอนุญาตสถานพยาบาล หน้าที่ผู้รับ/ผู้ดำเนินการ & การโฆษณาคลินิก (พ.ร.บ. 2541/2559)",
            "pathway_type": "legal",
            "subtitle": "อายุใบอนุญาตประกอบกิจการ (10 ปี) vs ดำเนินการ (2 ปี) & กฎเหล็กการขออนุมัติโฆษณา",
            "reference": "พ.ร.บ. สถานพยาบาล พ.ศ. 2541 และ (ฉบับที่ 4) พ.ศ. 2559",
            "steps": [
                _node(1, "แยก 2 ใบอนุญาตสำคัญของคลินิก", "ผู้รับอนุญาตประกอบกิจการ (เจ้าของ) vs ผู้ดำเนินการสถานพยาบาล (ทันตแพทย์ประจำที่รับผิดชอบ)", "decision", [
                    {"condition": "ใบอนุญาตประกอบกิจการ (ม.19)", "outcome": "อายุ 10 ปี นับแต่วันที่ออกใบอนุญาต (ต้องยื่นต่อก่อนหมดอายุ)", "color": "#38bdf8"},
                    {"condition": "ใบอนุญาตให้ดำเนินการสถานพยาบาล (ม.24)", "outcome": "อายุ 2 ปี (สิ้นสุดวันที่ 31 ธันวาคมของปีที่สองนับแต่ปีที่ออก)", "color": "#10b981"},
                ]),
                _node(2, "เงื่อนไขการโฆษณา (ม.38 & ประกาศ สบส.)", "ต้องขออนุมัติข้อความ/ภาพ/เสียงต่อผู้อนุญาต (สบส./สสจ.) 'ก่อนเผยแพร่ทุกครั้ง'", "ห้ามโฆษณาเป็นเท็จ โอ้อวดเกินจริง อ้างรับรองจากสถาบัน หรือจัดโปรโมชันลด แลก แจก แถมชักจูงใจผู้ป่วย", "warning"),
                _node(3, "หน้าที่ควบคุมมาตรฐาน (ม.34/35)", "ผู้ดำเนินการต้องควบคุมผู้ประกอบวิชาชีพและเก็บเวชระเบียนอย่างน้อย 5 ปี", "หากผู้ดำเนินการไม่อยู่ต้องมีผู้แทนที่มีคุณสมบัติเท่ากันมาดูแลและแจ้งผู้อนุญาตตามระเบียบ", "outcome"),
            ],
        }
    ],
    "Community-Biostatistics-Diagnostic-Tests": [
        {
            "id": "biostat-screening-pathway",
            "title": "Diagnostic Decision Pathway: Sensitivity, Specificity, PPV & Effect of Prevalence",
            "pathway_type": "decision",
            "subtitle": "เลือกชุดตรวจให้ตรงวัตถุประสงค์ (SNOUT vs SPIN) & ผลกระทบของความชุกโรคต่อค่าทำนาย (PPV/NPV)",
            "reference": "Burt & Eklund / Gordis Epidemiology",
            "steps": [
                _node(1, "แยกจุดประสงค์ของชุดตรวจ", "คัดกรองเบื้องต้น (Screening) vs ยืนยันโรค (Confirmatory)", "decision", [
                    {"condition": "ต้องการคัดกรองไม่ให้คนป่วยหลุดรอด (Rule Out)", "outcome": "เลือก Sensitivity สูง! (SnNOut: Sensitive test Negative rules OUT disease) ➔ False Negative ต่ำ", "color": "#10b981"},
                    {"condition": "ต้องการยืนยันโรค (Rule In) ก่อนรักษาที่เสี่ยง/ราคาแพง", "outcome": "เลือก Specificity สูง! (SpPIn: Specific test Positive rules IN disease) ➔ False Positive ต่ำ", "color": "#38bdf8"},
                ]),
                _node(2, "ความเปลี่ยนแปลงเมื่อความชุก (Prevalence) เปลี่ยน", "Sensitivity & Specificity คงที่ตามคุณภาพชุดตรวจ แต่ PPV/NPV เปลี่ยนตามความชุก!", "เมื่อ Prevalence ในประชากรสูงขึ้น ➔ PPV เพิ่มขึ้น และ NPV ลดลง (คัดกรองในกลุ่มเสี่ยงสูงช่วยลดผลบวกลวง)", "outcome"),
            ],
        }
    ],
    "Community-Health-Systems-Insurance": [
        {
            "id": "thai-3-funds-pathway",
            "title": "Thai Dental Benefits Pathway: ระบบบริการ 3 กองทุนสุขภาพไทย (บัตรทอง / ประกันสังคม / ข้าราชการ)",
            "pathway_type": "protocol",
            "subtitle": "คัดกรองสิทธิ ➔ แนวทางการเบิกจ่าย (Capitation / Fee Schedule / 900 บาทต่อปี) ตามระบบ สปสช. และ สปส.",
            "reference": "สำนักทันตสาธารณสุข กรมอนามัย & สปสช. / สำนักงานประกันสังคม",
            "steps": [
                _node(1, "ตรวจสอบสิทธิผู้ป่วย (Eligibility Check)", "ผู้ป่วยมาด้วยงานทันตกรรมพื้นฐาน/ส่งเสริมป้องกัน/ฟันเทียม", "decision", [
                    {"condition": "บัตรทอง (UCS — สปสช.)", "outcome": "ครอบคลุม ขูด อุด ถอน รักษาคลองรากฟันหน้า-ฟันกรามน้อย ฟันเทียมพื้นฐาน และงานส่งเสริมป้องกัน (PP) ที่หน่วยบริการตามสิทธิ", "color": "#10b981"},
                    {"condition": "ประกันสังคม (SSS ม.33/ม.39)", "outcome": "ขูด อุด ถอน ผ่าฟันคุด เบิกได้ตามจริงไม่เกิน 900 บาท/ปี (ทำที่คลินิกคู่สัญญาไม่ต้องสำรองจ่าย)", "color": "#38bdf8"},
                    {"condition": "สวัสดิการข้าราชการ (CSMBS)", "outcome": "รักษาที่ รพ.รัฐ เบิกจ่ายแบบ Fee-for-service ตามอัตราที่กรมบัญชีกลางกำหนด", "color": "#a855f7"},
                ]),
                _node(2, "โครงการส่งเสริมป้องกันระดับประเทศ", "สูตรแปรงฟัน 2-2-2 & โครงการฟันเทียมพระราชทาน", "กลุ่มอายุดัชนีสำรวจไทย: 3, 5, 12, 15, 35–44, 60–74, 80–85 ปี; เป้าหมายผู้สูงอายุ ≥20 ซี่และคู่สบหลัง ≥4 คู่สบ", "outcome"),
            ],
        }
    ],
}

# Merge extended curated pathways (reaches 83/83 Must-Know Topic coverage)
from pathways_part1 import PATHWAYS_PART1  # noqa: E402
from pathways_part2 import PATHWAYS_PART2  # noqa: E402

CURATED_TOPIC_PATHWAYS.update(PATHWAYS_PART1)
CURATED_TOPIC_PATHWAYS.update(PATHWAYS_PART2)


# ─────────────────────────────────────────────────────────────────────────────
# DYNAMIC CAUSAL / PROCESS / PROTOCOL EXTRACTOR FOR ANY TOPIC OR QUESTION TEXT
# ─────────────────────────────────────────────────────────────────────────────
_CAUSAL_SPLIT_REGEX = re.compile(
    r"(?:\n+|(?=(?:\(\d+\)|\b\d\.\s+[ก-ฮA-Z]))|(?<=[.!?])\s+(?=[A-Zก-ฮ0-9]))"
)

_CLAUSE_SPLIT_REGEX = re.compile(
    r"(?=(?:เกิดจาก|ไปกระตุ้น|เหนี่ยวนำให้|ส่งผลให้|ทำให้เกิด|นำไปสู่|ลุกลาม|ต่อมา|จากนั้น|ขั้นตอนที่|จึงต้อง|ควรจัดการ|แนะนำให้|สามารถจัดการโดย|เพื่อให้|เพื่อลด|ป้องกันไม่ให้|ผลลัพธ์คือ))"
)


def _infer_stage_meta(text: str, idx: int, total: int) -> Dict[str, str]:
    low = text.lower()
    if any(k in low for k in ["ระวัง", "ห้าม", "ข้อห้าม", "complication", "ภาวะแทรกซ้อน", "อันตราย", "พิษ", "ผิดกฎหมาย", "โทษ"]):
        return {"stage": "ข้อควรระวัง / จุดตัดอันตราย", "node_type": "warning"}
    if any(k in low for k in ["หาก", "กรณี", "เมื่อพบ", "แยก", "เกณฑ์", "vs", "ขึ้นอยู่กับ", "ประเมิน"]):
        return {"stage": "จุดตรวจ & เกณฑ์ตัดสินใจ", "node_type": "decision"}
    if any(k in low for k in ["จัดการโดย", "รักษา", "ฉีด", "อุด", "กรอ", "ถอน", "จ่ายยา", "ปิด", "ยึด", "จึงต้อง", "แนะนำ"]):
        return {"stage": "ขั้นตอนปฏิบัติ / Protocol", "node_type": "action"}
    if any(k in low for k in ["เพื่อให้", "เพื่อลด", "ผลลัพธ์", "ป้องกัน", "สรุป", "ลดโอกาส"]):
        return {"stage": "ผลลัพธ์ / เป้าหมายคลินิก", "node_type": "outcome"}
    if idx == 0:
        return {"stage": "สาเหตุ / จุดตั้งต้น", "node_type": "trigger"}
    if idx == total - 1:
        return {"stage": "ข้อสรุป / ผลลัพธ์", "node_type": "outcome"}
    return {"stage": "กลไก / กระบวนการเกิด", "node_type": "mechanism"}


def build_pathway_from_question(q: Any, parsed_exp: Dict[str, Any], tb_title: str) -> Optional[Dict[str, Any]]:
    """Build a crisp stepwise Process/Pathogenesis/Protocol Pathway from an exam question explanation."""
    core = (parsed_exp.get("core_principle") or "").strip()
    takeaway = (parsed_exp.get("key_takeaway") or parsed_exp.get("why_correct") or "").strip()
    ref_str = (parsed_exp.get("reference") or parsed_exp.get("legal_citation") or tb_title).strip()
    if not core and not takeaway:
        return None

    raw_segments = [s.strip() for s in _CAUSAL_SPLIT_REGEX.split(core) if s.strip()]
    # If core is a single dense paragraph, split along Thai causal/procedural connectors
    if len(raw_segments) == 1 and len(raw_segments[0]) > 140:
        clause_splits = [c.strip() for c in _CLAUSE_SPLIT_REGEX.split(raw_segments[0]) if c.strip()]
        merged: List[str] = []
        buf = ""
        for cl in clause_splits:
            if len(buf) + len(cl) < 95:
                buf = (buf + " " + cl).strip()
            else:
                if buf:
                    merged.append(buf)
                buf = cl
        if buf:
            merged.append(buf)
        if len(merged) >= 2:
            raw_segments = merged

    if takeaway and (not raw_segments or takeaway[:40] not in raw_segments[-1]):
        raw_segments.append(f"สรุปคำตอบเป้าหมาย: {takeaway}")

    if len(raw_segments) < 2:
        return None

    raw_segments = raw_segments[:6]
    steps = []
    total = len(raw_segments)
    for idx, seg in enumerate(raw_segments):
        meta = _infer_stage_meta(seg, idx, total)
        short_title = seg[:70].rstrip("., ") + ("..." if len(seg) > 70 else "")
        steps.append(
            _node(
                step_num=idx + 1,
                stage=meta["stage"],
                title=short_title,
                detail=seg,
                node_type=meta["node_type"],
            )
        )

    cat = getattr(q, "category", "") or ""
    q_preview = (getattr(q, "proposition", None) or getattr(q, "question_text", None) or "")[:90]
    p_type = "legal" if "กฎหมาย" in cat else "pathogenesis"
    return {
        "id": f"q-pathway-{getattr(q, 'id', '0')}",
        "title": f"Case Pathway (Q#{getattr(q, 'id', '')}): {q_preview}{'...' if len(q_preview) == 90 else ''}",
        "pathway_type": p_type,
        "subtitle": f"สกัดลำดับสาเหตุ ➔ กลไก ➔ แนวทางตัดสินใจ ({getattr(q, 'task', 'หลักการทางคลินิก')})",
        "reference": ref_str,
        "steps": steps,
    }


def get_topic_pathways(
    module_id: str,
    category: str,
    questions: List[Any],
    title_th: str,
    parse_fn: Optional[Any] = None,
    classify_tb_fn: Optional[Any] = None,
) -> List[Dict[str, Any]]:
    """Return curated Gold-Standard pathways for a topic/textbook plus auto-extracted case process flows."""
    results: List[Dict[str, Any]] = []
    seen_ids = set()

    # 1. Exact topic curated pathways
    if module_id in CURATED_TOPIC_PATHWAYS:
        for p in CURATED_TOPIC_PATHWAYS[module_id]:
            results.append(p)
            seen_ids.add(p["id"])

    # 2. If module is a Textbook or another topic in the same category/topic-cluster, include matching curated pathways
    topic_ids_in_module = {getattr(q, "must_know_topic", None) for q in questions if getattr(q, "must_know_topic", None)}
    for tid in sorted(topic_ids_in_module):
        if tid in CURATED_TOPIC_PATHWAYS:
            for p in CURATED_TOPIC_PATHWAYS[tid]:
                if p["id"] not in seen_ids:
                    results.append(p)
                    seen_ids.add(p["id"])
        if len(results) >= 6:
            break

    # 3. Synthesize up to 4 auto-extracted case process/protocol pathways from richest P/A questions in this module
    added_dynamic = 0
    for q in reversed(questions):  # P/A questions come last when sorted R -> A -> P
        if added_dynamic >= 4:
            break
        raw_exp = getattr(q, "explanation", None)
        if parse_fn:
            exp = parse_fn(raw_exp)
        elif isinstance(raw_exp, str):
            try:
                exp = json.loads(raw_exp)
            except Exception:
                exp = {}
        elif isinstance(raw_exp, dict):
            exp = raw_exp
        else:
            exp = {}

        tb_title = title_th
        if classify_tb_fn:
            tb_title = classify_tb_fn(exp.get("reference") or exp.get("legal_citation") or "", category).get("title", title_th)

        built = build_pathway_from_question(q, exp, tb_title)
        if built and len(built["steps"]) >= 3:
            results.append(built)
            added_dynamic += 1

    return results
