"""Curated Clinical Pathways Part 1: Endo, OMFS, Perio, Operative, Prosthodontics (27 topics)."""

from typing import Any, Dict, List
from pathway_schema import node as _node

PATHWAYS_PART1: Dict[str, List[Dict[str, Any]]] = {
    "Endo-Instrumentation-Obturation": [
        {
            "id": "endo-wl-obturation-protocol",
            "title": "Clinical Workflow: Working Length Determination & Obturation Control",
            "pathway_type": "procedure",
            "subtitle": "Electronic Apex Locator + Radiographic Confirmation ➔ Master Cone Tug-back & Bioceramic/Gutta-percha Seal",
            "reference": "Cohen's Pathways of the Pulp 12th ed. & สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE)",
            "steps": [
                _node(1, "Coronal Flaring & Glide Path", "เปิดทางตรงสู่คลองรากฟัน + ใช้ K-file #10–15", "ลดการโค้งงอที่ส่วนต้นของคลองราก ลดความเสี่ยงไฟล์หัก และทำให้ Electronic Apex Locator (EAL) อ่านค่าแม่นยำ", "action"),
                _node(2, "กำหนดความยาวรากฟัน (WL)", "EAL 0.5–1 mm สั้นกว่า Apical Constriction + ยืนยันด้วยฟิล์มรังสี", "จุดสิ้นสุดการขยายและอุดคลองรากที่เหมาะสมคือ Minor Apical Diameter (Apical constriction)", "decision", [
                    {"condition": "ฟิล์มอยู่ห่าง Radiographic Apex 0.5–1.5 mm และตรงกับ EAL", "outcome": "ยืนยัน WL ถาวร ➔ ขยายคลองรากแบบ Crown-down ด้วย NiTi + NaOCl ล้างตลอด", "color": "#10b981"},
                    {"condition": "ไฟล์เลยปลายราก (Overextension > 1 mm)", "outcome": "ร่นความยาวกลับ + ขยาย Apical matrix ให้มี Apical stop ชัดเจนป้องกันวัสดุเกิน", "color": "#ef4444"},
                ]),
                _node(3, "ลอง Master Cone & Sealer Selection", "เลือก Master Gutta-percha Cone ให้ได้ Tug-back ที่ WL", "ถ่ายฟิล์ม Master Cone Radiograph ก่อนอุดเสมอ กรณีใช้ Single-cone ร่วมกับ Bioceramic/Calcium Silicate Sealer ให้ความชื้นเล็กน้อยเพื่อการเซ็ตตัว", "action"),
                _node(4, "อุดคลองรากฟัน & Coronal Barrier", "Cold Lateral / Warm Vertical Compaction + ตัด GP ใต้ Orifice 1–2 mm", "ปิด Orifice ด้วย Resin/RMGIC ทันทีหลังอุดเสร็จเพื่อป้องกัน Coronal microleakage", "outcome"),
            ],
        }
    ],
    "Endo-Complications-Fractures": [
        {
            "id": "endo-complications-vrf-ledging",
            "title": "Decision Tree: การแยกวินิจฉัย Vertical Root Fracture (VRF), Perforation & Separated File",
            "pathway_type": "decision",
            "subtitle": "J-shaped Radiolucency & Narrow Deep Pocket ➔ แยกโรครากแตกร้าวออกจาก Endo-Perio Lesion",
            "reference": "AAE Position Statement on Cracked Tooth & VRF / Cohen's 12th ed.",
            "steps": [
                _node(1, "สัญญาณอันตราย (Red Flags)", "ฟันเคยรักษารากมี Sinus tract 2 ตำแหน่ง หรือ Isolated narrow deep pocket > 6 mm", "อาการปวดเวลาเคี้ยวหรือบวมซ้ำซากแม้รักษารากฟันไปนานแล้ว", "trigger"),
                _node(2, "การตรวจแยกภาวะแทรกซ้อน", "Probing รอบซี่ฟัน + Bite test + ฟิล์มรังสี 2 มุม", "แยกระหว่าง VRF, Strip perforation, และ Instrument separation", "decision", [
                    {"condition": "Isolated narrow deep pocket + J-shaped / Halo radiolucency รอบราก", "outcome": "Vertical Root Fracture (VRF) ➔ พยากรณ์โรค Hopeless ถอนฟัน (หรือตัดรากในฟันหลายราก)", "color": "#ef4444"},
                    {"condition": "ทะลุพื้นโพรงประสาท (Furcation perforation)", "outcome": "ห้ามเลือด ฆ่าเชื้อ NaOCl และซ่อมทันทีด้วย MTA / Biodentine (Bioceramic)", "color": "#10b981"},
                    {"condition": "เครื่องมือหัก (Separated instrument)", "outcome": "ประเมินตำแหน่ง: 1/3 ต้น-กลาง (ใช้ Ultrasonic/Bypass) vs 1/3 ปลายหลังล้างสะอาด (อุดทับ + Follow-up)", "color": "#f59e0b"},
                ]),
                _node(3, "การป้องกันสำคัญ (Prevention)", "อนุรักษ์ Pericervical Dentin + ใส่ Ferrule 1.5–2 mm", "หลีกเลี่ยงการขยาย Post space ใหญ่เกิน 1/3 ของความกว้างรากฟัน และการออกแรงอัด Lateral compaction รุนแรงเกินไป", "outcome"),
            ],
        }
    ],
    "Endo-Resorption": [
        {
            "id": "endo-resorption-diff",
            "title": "Differential & Treatment Pathway: Internal vs External Root Resorption",
            "pathway_type": "decision",
            "subtitle": "SLOB Rule (Clark's Rule) + รูปทรงขอบเขตเงาดำในภาพรังสี ➔ ตัดสินใจอุด GP หรือถอน/ซ่อมภายนอก",
            "reference": "Cohen's Pathways of the Pulp & Patel Resorption Classification",
            "steps": [
                _node(1, "กระตุ้นเซลล์สลายเนื้อฟัน (Clastic Activation)", "บาดเจ็บต่อ Predentin (ในโพรงประสาท) หรือ Cementum/PDL (ผิวรากนอก)", "หากชั้นป้องกันถูกทำลาย ร่วมกับการติดเชื้อในโพรงประสาทจะกระตุ้น Odontoclasts", "trigger"),
                _node(2, "แยก Internal vs External (ภาพรังสี 2 มุม)", "ถ่ายฟิล์ม Orthoradial และ Mesial/Distal Shift (SLOB Rule)", "ดูการคงอยู่ของแนวคลองรากฟันและการเลื่อนของเงาเมื่อเปลี่ยนมุม X-ray", "decision", [
                    {"condition": "ขอบเขตสมมาตร คลองรากขยายโป่งกลืนหายไป + เงาไม่เคลื่อนตามมุม X-ray", "outcome": "Internal Inflammatory Resorption ➔ รักษารากด่วน (ตัดเลือดเลี้ยง Clastic cells) + อุด Thermoplasticized GP", "color": "#f59e0b"},
                    {"condition": "เห็นแนวคลองรากพาดผ่านทะลุเงาดำ + ขอบไม่สม่ำเสมอ + เงาเคลื่อนตาม SLOB", "outcome": "External Resorption (Surface / Replacement / Invasive Cervical) ➔ หาสาเหตุ/กำจัดเนื้อเยื่อและอุดด้วย Calcium Silicate", "color": "#38bdf8"},
                    {"condition": "มีจุดสีชมพูที่คอฟัน (Pink Tooth of Mummery)", "outcome": "พบได้ทั้ง Internal หรือ Invasive Cervical Resorption ➔ ใช้ CBCT แยกก่อนเปิดรักษา", "color": "#ec4899"},
                ]),
                _node(3, "ข้อควรระวัง (Warning)", "External Replacement Resorption (Ankylosis)", "เคาะเสียงใสกังวานเหมือนโลหะ (Metallic sound) ไม่โยก พบหลัง Avulsion ทิ้งแห้งนาน ➔ ไม่ตอบสนองต่อการจัดฟัน", "warning"),
            ],
        }
    ],
    "Endo-Canal-Anatomy-Access": [
        {
            "id": "endo-access-mb2-pathway",
            "title": "Anatomical Search Pathway: Access Cavity & กฎหาคลองรากฟันของ Krasner & Rankow",
            "pathway_type": "procedure",
            "subtitle": "Law of Centrality, Concentricity & Color Change ➔ ค้นหา MB2 และลดเสี่ยง Furcation Perforation",
            "reference": "Krasner & Rankow (2004) / Cohen's Pathways of the Pulp 12th ed.",
            "steps": [
                _node(1, "กำจัด Roof ทั้งหมด (Complete Derooting)", "เปิดหลังคาโพรงประสาทให้เห็น Pulp horns ครบทุกมุม", "ช่วยมองเห็นพื้นโพรงประสาท (Pulp chamber floor) สีเข้มตาม Law of Color Change ชัดเจน โดยไม่กรอพื้น", "action"),
                _node(2, "ใช้กฎของ Krasner & Rankow", "สังเกตสีเข้มของ Floor ตัดกับผนัง Dentin สีขาว (Cementoenamel junction landmark)", "ตำแหน่ง Orifice จะอยู่ที่จุดบรรจบของผนังและพื้น รวมถึงปลายเส้น Developmental root fusion lines", "mechanism"),
                _node(3, "ฟันที่มักซ่อนคลองรากเพิ่ม (Extra Canals)", "ตรวจหา MB2 ใน Maxillary 1st Molar และ Lingual/2nd Canal ในฟันหน้าล่าง", "MB2 พบบ่อย >60–80% อยู่ Mesial ต่อเส้นที่ลากเชื่อม MB1 ไปยัง Palatal orifice ประมาณ 1–2 mm", "decision", [
                    {"condition": "ฟันกรามล่างมี 2 รากและมีแนวโน้มรูป C-shaped (ในชาวเอเชียพบสูง)", "outcome": "ระวัง Danger zone ด้าน Furcation ➔ หลีกเลี่ยง Gates Glidden ใหญ่และใช้ NaOCl + Ultrasonic", "color": "#f59e0b"},
                    {"condition": "ไม่พบ Orifice ในตำแหน่งที่ควรมี", "outcome": "เช็ก Alignment กับ CEJ (Law of Centrality) แทนการเดาตามตัวฟันที่บิดเอียงหรือทำครอบฟัน", "color": "#38bdf8"},
                ]),
                _node(4, "Straight-Line Access", "ปรับมุมทางเข้าให้ไฟล์ลงคลองรากโดยไม่ชนผนังคอฟัน", "ลด Cyclic fatigue ของไฟล์ NiTi และช่วยการทำความสะอาดส่วน 1/3 ปลายราก", "outcome"),
            ],
        }
    ],
    "Endo-Microbiology-Infection": [
        {
            "id": "endo-biofilm-retreatment",
            "title": "Microbiology Pathway: Primary vs Persistent Endodontic Infection (Biofilm & E. faecalis)",
            "pathway_type": "pathogenesis",
            "subtitle": "ความต่างของเชื้อในฟันไม่เคยรักษาราก (Polymicrobial Anaerobic) vs ฟันรักษารากซ้ำ (E. faecalis / Candida)",
            "reference": "Siqueira & Rôças / Cohen's Pathways of the Pulp",
            "steps": [
                _node(1, "การติดเชื้อปฐมภูมิ (Primary Infection)", "Polymicrobial Obligate Anaerobes (เช่น Porphyromonas, Prevotella, Fusobacterium)", "เจริญเติบโตเป็น Biofilm ในสภาพออกซิเจนต่ำของโพรงประสาทฟันที่ตายแล้ว ไวต่อการล้างด้วย NaOCl และ Ca(OH)2", "trigger"),
                _node(2, "สาเหตุความล้มเหลว (Persistent / Secondary)", "การรั่วซึมจาก Coronal Seal หรือคลองรากที่ไม่ได้ล้างทำความสะอาด", "แบคทีเรียที่รอดชีวิตต้องทนต่อสภาพเป็นด่างสูง (High pH) และภาวะขาดสารอาหารได้", "mechanism"),
                _node(3, "เชื้อเด่นในเคสรื้อรักษาราก (Retreatment)", "Enterococcus faecalis (Gram+ facultative anaerobe) และ Candida albicans", "E. faecalis มี Proton pump ทำให้ทน Ca(OH)2 (pH 12.5) และแทรกตัวลึกใน Dentinal tubules", "decision", [
                    {"condition": "พบ E. faecalis ในเคส Failure / รื้อราก", "outcome": "ล้างด้วย NaOCl ร่วมกับ 2% Chlorhexidine (CHX) หลังล้างด้วย EDTA/น้ำเกลือเพื่อกันตะกอน", "color": "#ec4899"},
                    {"condition": "Extra-radicular biofilm (Actinomyces) ที่ไม่หายหลังรื้อ", "outcome": "พิจารณา Endodontic Microsurgery (Apicoectomy)", "color": "#f59e0b"},
                ]),
                _node(4, "จุดเน้นข้อสอบ (RDU Alert)", "ห้ามใช้ Antibiotic ชนิดกินทดแทนการล้างคลองราก", "ยาปฏิชีวนะในกระแสเลือดเข้าไม่ถึง Biofilm ในคลองรากที่ไม่มีเลือดเลี้ยง ต้องแก้ด้วยการกำจัดเชื้อเชิงกล-เคมี", "outcome"),
            ],
        }
    ],
    "Endo-Pulp-Biology-Neurophysiology": [
        {
            "id": "endo-dentin-defense-pathway",
            "title": "Pulp-Dentin Complex Defense & Pain Transmission Cascade",
            "pathway_type": "pathogenesis",
            "subtitle": "Tertiary Dentin (Reactionary vs Reparative) & Gate-Control / Neuropeptide Mechanisms",
            "reference": "Hargreaves & Berman: Cohen's Pathways of the Pulp 12th ed.",
            "steps": [
                _node(1, "สิ่งรบกวนระดับอ่อน–ปานกลาง", "รอยผุระยะเริ่มต้น / ฟันสึกช้า", "กระตุ้น Odontoblasts เดิมให้สร้าง Tertiary Dentin แบบ Reactionary Dentin ที่มีท่อเนื้อฟันต่อเนื่อง", "trigger"),
                _node(2, "สิ่งรบกวนรุนแรง (Odontoblast Death)", "รอยผุลึก / ความร้อนจากการกรอฟัน / Exposure", "หาก Original odontoblasts ตาย เต็มเซลล์ DPSCs (Dental Pulp Stem Cells) จะเคลื่อนมาเปลี่ยนเป็น Odontoblast-like cells สร้าง Reparative Dentin", "mechanism"),
                _node(3, "Neuropeptides & Neurogenic Inflammation", "Release Substance P และ CGRP จากปลายประสาท Sensory", "ทำให้หลอดเลือดในพัลพ์ขยายตัว เพิ่มแรงดันภายในโพรงประสาท (Low-compliance environment) ส่งผลให้เสี่ยงเกิด Pulp necrosis ง่าย", "warning"),
                _node(4, "Aging Changes ของโพรงประสาท", "Secondary dentin สะสมต่อเนื่อง + Fibrosis + Calcification", "จำนวนเซลล์และเลือดมาเลี้ยงลดลง ห้องประสาทแคบลง และ Pulp stones เพิ่มขึ้นตามอายุ", "outcome"),
            ],
        }
    ],
    "OMFS-Exodontia-Biomechanics": [
        {
            "id": "omfs-exodontia-principles",
            "title": "Biomechanics & Extraction Sequence: กลศาสตร์ถอนฟันและการหายของแผล",
            "pathway_type": "procedure",
            "subtitle": "หลัก 3 กลไก (Lever, Wedge, Wheel & Axle) ➔ Bone Expansion ➔ Blood Clot & Socket Healing",
            "reference": "Hupp, Ellis & Tucker: Contemporary Oral and Maxillofacial Surgery 7th ed. & สมาคมศัลยศาสตร์ช่องปากฯ",
            "steps": [
                _node(1, "เตรียมเหงือก & เลือกจุดหมุน", "ตัดแทรก Gingival attachment + ใช้ Straight Elevator แบบ Wedge & Lever", "วางแรงที่ Mesial/Distal aspect ของฟัน (ห้ามใช้ฟันซี่ข้างเคียงเป็น Fulcrum โดยเด็ดขาด)", "action"),
                _node(2, "กลศาสตร์คีม (Forceps Movements)", "ดันปลายราก (Apical pressure) ก่อนโยก Buccal-Lingual/Palatal", "การดันลงปลายรากช่วยย้าย Center of rotation ลงลึกและขยายเบ้ากระดูกส่วนคอร์ติคัลด้านที่บางกว่า", "decision", [
                    {"condition": "ฟันบนทุกซี่และฟันกรามน้อยล่าง", "outcome": "กระดูก Buccal บางกว่า ➔ โยกออกด้าน Buccal เป็นหลัก (ฟันเขี้ยว/กรามน้อยหมุนได้เฉพาะรากเดียวตรง)", "color": "#10b981"},
                    {"condition": "ฟันกรามล่าง (Mandibular Molars)", "outcome": "Buccal cortical plate หนา ➔ ใช้ Cowhorn / รู้ทิศทางโยก Buccal-Lingual + Figure-8", "color": "#38bdf8"},
                ]),
                _node(3, "แผลถอนฟันและการหาย (Socket Healing)", "Blood clot (วัน 1) ➔ Granulation tissue (สัปดาห์ 1) ➔ Woven bone (สัปดาห์ 4–6)", "ห้ามบ้วนน้ำแรง/ดูดหลอด 24 ชม. แรก เพื่อป้องกัน Alveolar Osteitis (Dry socket) ที่มักปวดรุนแรงวันที่ 3–5 หลังถอน", "warning"),
                _node(4, "การห้ามเลือดและคำแนะนำ", "กัดผ้าก๊อซแน่น 30–60 นาที + ตรวจ Sharp bony edge", "กรณีผู้ป่วยทานยาละลายลิ่มเลือด (NOACs/Warfarin) ห้ามหยุดยาเอง ➔ ให้ใช้ Local hemostatic (Gelfoam + Suturing)", "outcome"),
            ],
        }
    ],
    "OMFS-Impacted-Teeth": [
        {
            "id": "omfs-impacted-classification-surgery",
            "title": "Impacted 3rd Molar Classification & Surgical Planning Pathway",
            "pathway_type": "decision",
            "subtitle": "Winter's + Pell & Gregory Classification + ความสัมพันธ์กับ Inferior Alveolar Canal (IAN)",
            "reference": "Contemporary Oral and Maxillofacial Surgery 7th ed.",
            "steps": [
                _node(1, "จำแนกความยาก (Classification)", "ประเมินแนวแกน (Winter's) และความลึก/พื้นที่ Ramus (Pell & Gregory Class I–III, Pos A–C)", "ฟันคุด Distoangular (ฟันล่าง) มีความยากทางศัลยศาสตร์สูงที่สุดเพราะติด Ramus ด้านหลัง", "mechanism"),
                _node(2, "ประเมินความเสี่ยงเส้นประสาท IAN", "ตรวจฟิล์ม Panoramic หา Rood's Criteria (Darkening of root, Deflection, Interruption of white line)", "หากพบรากฟันคร่อมหรือเบียดคลองประสาทล่างอย่างมาก ควรส่ง CBCT", "decision", [
                    {"condition": "ฟันคุดเสี่ยงสูงมากต่อการบาดเจ็บ IAN ในผู้ป่วยฟันมีชีวิต", "outcome": "พิจารณา Coronectomy (ตัดเฉพาะตัวฟันเหลือรากไว้ลึก 2–3 mm ใต้สันกระดูก)", "color": "#f59e0b"},
                    {"condition": "ฟันคุด Mesioangular / Horizontal", "outcome": "เปิด Envelope/Triangular flap + กรอ Buccal/Distal bone + Section ตัวฟันแบ่งออกเป็นชิ้น", "color": "#10b981"},
                ]),
                _node(3, "อายุเหมาะสม & ภาวะแทรกซ้อน", "ช่วงอายุที่ดีสุดในการผ่าฟันคุดเชิงป้องกันคือ 17–25 ปี (ราก 2/3, กระดูกยืดหยุ่นดี)", "ระวัง Lingual plate ทะลุทำอันตรายต่อ Lingual nerve ➔ ห้ามเจาะกรอลึกทะลุด้าน Lingual", "outcome"),
            ],
        }
    ],
    "OMFS-Anesthesia-Techniques": [
        {
            "id": "omfs-ianb-complications",
            "title": "Nerve Block Landmarks, Failure Troubleshooting & Complication Pathway",
            "pathway_type": "decision",
            "subtitle": "IANB / Gow-Gates / Vazirani-Akinosi & แนวทางแก้ Trismus / Hematoma / Facial Paralysis",
            "reference": "Malamed: Handbook of Local Anesthesia 7th ed.",
            "steps": [
                _node(1, "กำหนด Landmark ของ IANB", "Coronoid notch + Pterygomandibular raphe ➔ แทงสูงกว่า Occlusal plane 6–10 mm", "วางกระบอกฉีดยาฝั่งตรงข้ามเหนือฟันกรามน้อย (Premolar) แทงลึกจนสัมผัสกระดูก ~20–25 mm", "action"),
                _node(2, "กรณีฉีดยาชาไม่ชา (Anesthetic Failure)", "ตรวจ Accessory innervation (Mylohyoid nerve / Cervical plexus / Bifid canal) หรือ Acute infection (pH ต่ำ)", "เนื้อเยื่ออักเสบมี pH ต่ำ ทำให้รูปแบบ Uncharged base (RN) ลดลง ซึมผ่านเยื่อหุ้มประสาทได้น้อย", "decision", [
                    {"condition": "ติดเชื้อเฉียบพลันหรือปากอ้าได้จำกัด (Trismus)", "outcome": "เปลี่ยนเทคนิคเป็น Vazirani-Akinosi (Closed-mouth) หรือ Gow-Gates (ฉีดสูงห่างจุดอักเสบ)", "color": "#38bdf8"},
                    {"condition": "เข็มลึกเกินไปเข้าสู่ Parotid gland", "outcome": "เกิด Transient Facial Nerve (CN VII) Paralysis ชั่วคราว ➔ ปิดตาป้องกันกระจกตาแห้ง รอ 2–4 ชม. ยาหมดฤทธิ์", "color": "#f59e0b"},
                ]),
                _node(3, "ภาวะแทรกซ้อนหลังฉีด", "PSA Block เสี่ยง Hematoma (ฉีกขาด Pterygoid venous plexus) ➔ ประคบเย็นทันทีห้ามนวด", "หากเกิด Trismus จากฉีกขาดกล้ามเนื้อ Medial pterygoid ให้ประคบอุ่น + ยาคลายกล้ามเนื้อ + กายภาพบำบัดอ้าปาก", "warning"),
            ],
        }
    ],
    "OMFS-Bone-Pathology-Necrosis": [
        {
            "id": "omfs-mronj-orn-pathway",
            "title": "Risk & Management Pathway: MRONJ vs Osteoradionecrosis (ORN)",
            "pathway_type": "decision",
            "subtitle": "เกณฑ์ AAOMS 2022 (Exposed Bone > 8 wks) & Antiresorptive Drugs vs Radiotherapy > 60 Gy",
            "reference": "AAOMS Position Paper on MRONJ 2022 & Contemporary Oral and Maxillofacial Surgery",
            "steps": [
                _node(1, "ซักประวัติคัดกรองความเสี่ยง", "ประวัติได้ยากลุ่ม Antiresorptive / Antiangiogenic (Bisphosphonates IV/Oral, Denosumab) หรือฉายรังสีศีรษะ-คอ", "ความเสี่ยงสูงสุด: IV Zoledronic acid ในผู้ป่วยมะเร็ง และรังสีรักษา > 6,000 cGy (60 Gy) ในขากรรไกรล่าง", "trigger"),
                _node(2, "เกณฑ์วินิจฉัย MRONJ (ครบ 3 ข้อ)", "1) กำลัง/เคยได้ยา 2) กระดูกโผล่หรือคลำผ่าน Fistula นาน > 8 สัปดาห์ 3) ไม่เคยฉายรังสีที่ขากรรไกร", "หากเคยฉายรังสีและกระดูกตายจากภาวะ Hypovascular-Hypocellular-Hypoxic จะจัดเป็น Osteoradionecrosis (ORN)", "decision", [
                    {"condition": "Stage 1–2 MRONJ (กระดูกโผล่ มีหรือไม่มีการติดเชื้อ)", "outcome": "0.12% CHX mouthwash + ยาปฏิชีวนะเมื่อติดเชื้อ + เอาเฉพาะ Sequestrum ที่หลุดลอกออก (Conservative)", "color": "#f59e0b"},
                    {"condition": "Stage 3 MRONJ (Pathologic fracture / Extraoral fistula)", "outcome": "Surgical resection + Antibiotic + พิจารณาส่งต่อศัลยแพทย์ช่องปากและแม็กซิลโลเฟเชียล", "color": "#ef4444"},
                    {"condition": "จำเป็นต้องถอนฟันก่อนเริ่มฉายรังสี/ยา IV", "outcome": "ทำฟันให้เสร็จก่อนเริ่มยา/ฉายรังสี อย่างน้อย 14–21 วัน และให้ RCT แทนการถอนเมื่อเริ่มยาแล้ว", "color": "#10b981"},
                ]),
            ],
        }
    ],
    "OMFS-Maxillofacial-Trauma": [
        {
            "id": "omfs-lefort-mandible-trauma",
            "title": "Emergency & Classification Pathway: Maxillofacial & Mandibular Fractures",
            "pathway_type": "decision",
            "subtitle": "Airway Priority (ATLS) ➔ Le Fort I / II / III & Mandible (Condyle, Angle, Symphysis)",
            "reference": "Peterson's Principles of Oral and Maxillofacial Surgery",
            "steps": [
                _node(1, "Primary Survey (ABCDE)", "ประเมิน Airway เสมอ (ระวัง Bilateral Mandibular / Parasymphysis fracture ที่ลิ้นตกอุดทางเดินหายใจ)", "ในผู้ป่วย Trauma ให้ดึงลิ้น/Jaw thrust โดยระวัง Cervical spine injury เสมอ", "warning"),
                _node(2, "จำแนกแนวกระดูกหัก (Fracture Patterns)", "ตรวจ Occlusion (Anterior open bite ใน Bilateral condyle fracture), Panda eyes, CSF rhinorrhea", "คลำ Step deformity ขอบเบ้าตา/ขากรรไกร และตรวจ Cranial nerves (โดยเฉพาะ Infraorbital V2, IAN V3)", "decision", [
                    {"condition": "Le Fort I (Horizontal Maxillary)", "outcome": "แยกส่วน Alveolus & Hard palate เหนือปลายรากฟัน (Floating palate)", "color": "#38bdf8"},
                    {"condition": "Le Fort II (Pyramidal)", "outcome": "ผ่าน Nasal bridge ➔ Medial orbital floor ➔ Infraorbital rim ➔ Pterygoid plates (Step ขอบเบ้าตาล่าง)", "color": "#f59e0b"},
                    {"condition": "Le Fort III (Craniofacial Disjunction)", "outcome": "แยกใบหน้าออกจากฐานกะโหลก (ผ่าน Frontonasal + Zygomaticofrontal sutures + เสี่ยง CSF rhinorrhea)", "color": "#ef4444"},
                ]),
                _node(3, "การตรึงกระดูก (Fixation Principles)", "Closed Reduction (IMF/Arch bars) vs Open Reduction Internal Fixation (ORIF Plates)", "เป้าหมายสูงสุดของการรักษาคือการคืน Occlusion ที่ถูกต้องให้ผู้ป่วย", "outcome"),
            ],
        }
    ],
    "Perio-Examination-Indices": [
        {
            "id": "perio-cal-furcation-prognosis",
            "title": "Periodontal Assessment Pathway: CAL Calculation, Furcation & Prognosis",
            "pathway_type": "procedure",
            "subtitle": "สูตรคำนวณ Clinical Attachment Level (CAL) ➔ Glickman / Hamp Furcation & McGuire Prognosis",
            "reference": "Carranza's Clinical Periodontology 13th ed. & สมาคมปริทันตวิทยาแห่งประเทศไทย (TASP)",
            "steps": [
                _node(1, "วัดค่า PD และ ตำแหน่ง Gingival Margin เทียบ CEJ", "วัดจากขอบเหงือกถึง CEJ และ Probing Depth 6 ตำแหน่ง/ซี่", "ร่องลึกปริทันต์ (PPD) เพียงอย่างเดียวบอกระดับการสูญเสียอวัยวะยึดฟันได้ไม่ตรง หากเหงือกบวม (False pocket) หรือเหงือกร่น", "action"),
                _node(2, "คำนวณ Clinical Attachment Level (CAL)", "พิจารณาตำแหน่ง Gingival Margin (GM) เทียบกับ CEJ", "ใช้ค่า CAL วัดความรุนแรงของโรคปริทันต์ตามเกณฑ์ AAP/EFP 2017 (Stage I: 1–2 mm, II: 3–4 mm, III/IV: ≥5 mm)", "decision", [
                    {"condition": "เหงือกร่นต่ำกว่า CEJ (GM อยู่ Apical ต่อ CEJ)", "outcome": "CAL = PPD + ระยะเหงือกร่น (Recession)", "color": "#f59e0b"},
                    {"condition": "เหงือกบวมคลุมเลย CEJ (GM อยู่ Coronal ต่อ CEJ)", "outcome": "CAL = PPD − ระยะที่เหงือกคลุมเกิน CEJ", "color": "#38bdf8"},
                ]),
                _node(3, "ตรวจ Furcation (Nabers Probe) & Mobility", "Glickman Grade I–IV (IV = ทะลุจากด้านหนึ่งไปอีกด้านชัดเจน + เหงือกคลุมร่นมองเห็นได้)", "Class I–III (Hamp) แยกความลึกแนวนอน 3 mm สำหรับประกอบแผนรักษา Tunneling / Hemisection / GTR", "outcome"),
            ],
        }
    ],
    "Perio-Non-Surgical-Instrumentation": [
        {
            "id": "perio-gracey-instrumentation",
            "title": "Non-Surgical Periodontal Therapy & Instrument Selection Pathway",
            "pathway_type": "procedure",
            "subtitle": "Universal vs Gracey Curettes (Area-specific, 70° Offset) ➔ Scaling, Root Planing & Re-evaluation",
            "reference": "Carranza's Clinical Periodontology & Nield-Gehrig Periodontal Instrumentation",
            "steps": [
                _node(1, "เลือกใช้เครื่องมือให้ถูกตำแหน่ง (Gracey Code)", "1–4 (ฟันหน้า), 5–6 (หน้า+น้อย), 7–8 (Buccal/Lingual ฟันหลัง), 9–10 (กว้าง/ด้านนอก), 11–12 (Mesial ฟันหลัง), 13–14 (Distal ฟันหลัง)", "Gracey มีคมด้านเดียว (One cutting edge, lower edge) หน้าตัดเอียง 70° ต่อ Terminal shank ทำให้ใส่ใต้เหงือกโดยไม่บาดเนื้อเยื่อ", "action"),
                _node(2, "การวางมุมคมและแรงขูด (Angulation)", "สอดใต้เหงือกมุม 0° ➔ กางใบมีดออกทำมุมทำงาน 45°–90° (อุดมคติ 70°–80°)", "วาง Terminal shank ให้ขนานกับแกนยาวของพื้นผิวฟันที่กำลังขูดเสมอ พร้อม Finger rest มั่นคง", "decision", [
                    {"condition": "มุม > 90° หรือขูดเปิดคมออกนอกผิวฟัน", "outcome": "มีดบาด Soft tissue pocket wall ➔ เหงือกช้ำและขูดหินน้ำลายไม่หมด", "color": "#ef4444"},
                    {"condition": "ใบมีดทื่อ / มี Burnished calculus", "outcome": "ลับด้วยหินลับมีด (Arkansas/India stone) คงมุม 100°–110° ระหว่างใบมีดและหิน", "color": "#10b981"},
                ]),
                _node(3, "นัดประเมินผลหลังรักษา (Re-evaluation)", "รอให้ Epithelial & Connective tissue หายตัว 4–6 สัปดาห์หลัง SRP", "หากยังพบ Pocket ≥ 5 mm ร่วมกับ Bleeding on Probing (BOP+) พิจารณาศัลยกรรมปริทันต์", "outcome"),
            ],
        }
    ],
    "Perio-Drug-Induced-Enlargement": [
        {
            "id": "perio-gingival-enlargement",
            "title": "Pathogenesis & Management: Drug-Induced & Systemic Gingival Enlargement",
            "pathway_type": "pathogenesis",
            "subtitle": "3 กลุ่มยาสำคัญ (Phenytoin, Cyclosporine, CCBs เช่น Nifedipine/Amlodipine) ➔ Fibroblast Dysregulation",
            "reference": "Carranza's Clinical Periodontology 13th ed. / AAP 2017 Classification",
            "steps": [
                _node(1, "ปัจจัยกระตุ้นจากยา 3 กลุ่มหลัก", "1) Anticonvulsants (Phenytoin), 2) Immunosuppressants (Cyclosporine), 3) Calcium Channel Blockers (Nifedipine, Amlodipine)", "เริ่มพบที่ Interdental papillae โดยเฉพาะบริเวณฟันหน้า มักเกิดรุนแรงขึ้นมากหากมี Plaque สะสมร่วมด้วย", "trigger"),
                _node(2, "กลไกชีวภาพระดับเซลล์", "ยายับยั้ง Ca2+ influx เข้าสู่ Gingival fibroblasts ➔ ลดการสร้าง Collagenase (MMP-1) + ลดการย่อยสลายคอลลาเจน", "เกิดการสะสม Extracellular matrix และ Fibrous tissue ที่เหงือก (Phenytoin มักเกิดบ่อยสุด ~50% แน่นแข็งสีชมพู)", "mechanism"),
                _node(3, "แนวทางจัดการทางคลินิก", "1) ควบคุมคราบจุลินทรีย์ + SRP อย่างเคร่งครัด 2) ประสานแพทย์เจ้าของไข้เปลี่ยนยา", "เช่น เปลี่ยน Nifedipine ไปใช้กลุ่มอื่น (ACEi/ARB) หรือเปลี่ยน Cyclosporine เป็น Tacrolimus (ห้ามผู้ป่วยหยุดยาเอง!)", "decision", [
                    {"condition": "เหงือกยังโตขัดขวางการแปรงฟัน/บดเคี้ยวหลังควบคุม Plaque", "outcome": "ทำ Gingivectomy / Flap surgery (หากต้องคงยาเดิมมักมีโอกาสโตซ้ำสูง)", "color": "#f59e0b"},
                    {"condition": "เหงือกโตจาก Acute Myeloid Leukemia (AML M4/M5)", "outcome": "เหงือกนุ่มช้ำเลือดออกง่ายคล้ายฟองน้ำ ➔ ห้ามขูดหรือผ่าตัดลึก ให้ส่งตรวจ CBC ทันที", "color": "#ef4444"},
                ]),
            ],
        }
    ],
    "Perio-Mucogingival-Root-Coverage": [
        {
            "id": "perio-cairo-recession-graft",
            "title": "Classification & Root Coverage Decision: Cairo Recession (RT1–RT3) & Soft Tissue Grafts",
            "pathway_type": "decision",
            "subtitle": "ประเมิน Interproximal CAL (Cairo 2011) ➔ เลือก Coronally Advanced Flap (CAF) + CTG vs Free Gingival Graft",
            "reference": "Cairo et al. / AAP 2017 Mucogingival Deformities & Carranza's 13th ed.",
            "steps": [
                _node(1, "จำแนกระดับเหงือกร่น (Cairo 2011)", "ตรวจความสูญเสีย Interproximal Attachment (CAL) ด้าน Mesial/Distal เทียบ Facial recession", "พยากรณ์ความเป็นไปได้ของการปิดคลุมราก 100% (Complete Root Coverage)", "decision", [
                    {"condition": "RT1: ไม่สูญเสีย Interproximal CAL", "outcome": "Complete Root Coverage 100% เป็นไปได้สูง ➔ CAF + Subepithelial Connective Tissue Graft (CTG = Gold Standard)", "color": "#10b981"},
                    {"condition": "RT2: Interproximal CAL loss ≤ Buccal recession", "outcome": "ปิดคลุมได้บางส่วนถึงใกล้เคียงระดับ Interproximal bone", "color": "#f59e0b"},
                    {"condition": "RT3: Interproximal CAL loss > Buccal recession", "outcome": "ไม่คาดหวัง Complete Root Coverage ➔ เน้นเพิ่ม Attached gingiva หรือปรับพฤติกรรม", "color": "#ef4444"},
                ]),
                _node(2, "วัตถุประสงค์เฉพาะของ FGG vs CTG", "FGG (Free Gingival Graft): เน้นเพิ่ม Keratinized / Attached Gingiva (ไม่สวยงาม สีต่าง)", "CTG (Subepithelial Connective Tissue Graft): Dual blood supply ปิดรากฟันสวยงามที่สุดและแผลเพดานปากหายแบบ Primary closure", "outcome"),
            ],
        }
    ],
    "Perio-Acute-Conditions-Abscess": [
        {
            "id": "perio-nug-abscess-pathway",
            "title": "Differential & Emergency Management: Periodontal Abscess vs Periapical Abscess vs NUG",
            "pathway_type": "decision",
            "subtitle": "ทดสอบ Pulp Vitality ➔ แยกฝีปริทันต์จากฝีปลายราก & จัดการ NUG (Punched-out Papillae)",
            "reference": "AAP 2017 Acute Periodontal Conditions & สมาคมปริทันตวิทยาแห่งประเทศไทย (TASP)",
            "steps": [
                _node(1, "ผู้ป่วยมาด้วยอาการบวม-ปวดเหงือกเฉียบพลัน", "ตรวจ Cold test / EPT + วัด Pocket รอบซี่ฟัน + ประวัติไข้/ภูมิคุ้มกัน", "แยกต้นกำเนิดเชื้อจากคลองรากฟัน vs ร่องลึกปริทันต์", "decision", [
                    {"condition": "ฟันมีชีวิต (Vital) + ร่องลึกปริทันต์กว้างลึกถึงก้อนบวมด้านข้างตัวฟัน", "outcome": "Periodontal Abscess ➔ ระบายหนองผ่าน Pocket (Gentle drainage) + Debridement + (ATB เฉพาะมีอาการระบบไข้/ต่อมน้ำเหลืองโต)", "color": "#f59e0b"},
                    {"condition": "ฟันตาย (Non-vital) + เงาดำปลายราก", "outcome": "Periapical (Endodontic) Abscess ➔ รักษารากฟัน + I&D", "color": "#38bdf8"},
                    {"condition": "Punched-out interdental papillae + Pseudomembrane + Fetid odor + ปวดมาก", "outcome": "Necrotizing Ulcerative Gingivitis (NUG: Fusobacteria & Spirochetes) ➔ Debridement เบาๆ + H2O2 / 0.12% CHX + Metronidazole ถ้ามีไข้ (ตรวจคัดกรอง HIV หากเป็นซ้ำ/รุนแรง)", "color": "#ef4444"},
                ]),
                _node(2, "Endo-Perio Sequence & RDU", "ห้ามจ่ายยาปฏิชีวนะเดี่ยวโดยไม่ระบายหนอง | กรณี Combined Endo-Perio ให้ทำ Endo ก่อน", "เมื่อฟันตายร่วมกับมีร่องลึกปริทันต์ (Primary Endo with Secondary Perio) ให้รักษารากฟันให้เสร็จก่อน แล้วประเมินการหายของร่องลึกใน 2–3 เดือน", "outcome"),
            ],
        }
    ],
    "Perio-Regeneration-GTR": [
        {
            "id": "perio-gtr-defect-decision",
            "title": "Regenerative Surgery Pathway: Infrabony Defects & Guided Tissue Regeneration (GTR)",
            "pathway_type": "decision",
            "subtitle": "จำนวนผนังกระดูก (1, 2, 3-Wall Defects) ➔ หลักการกีดกั้นเซลล์เยื่อบุ (Epithelium/GCT Exclusion)",
            "reference": "Carranza's Clinical Periodontology 13th ed.",
            "steps": [
                _node(1, "ประเมินรูปร่างร่องกระดูก (Osseous Defect Morphology)", "นับจำนวน Bony walls ที่เหลืออยู่รอบความลึกของ Defect (เช่น Vertical 3-wall, 2-wall, 1-wall, Crater)", "3-Wall Intrabony defect มีเลือดเลี้ยงและเซลล์กระดูก/PDL ล้อมรอบมากที่สุด ➔ ตอบสนองต่อ GTR ดีที่สุด", "decision", [
                    {"condition": "3-Wall Intrabony defect ลึก > 3 mm", "outcome": "ทำ GTR ด้วย Barrier Membrane + Bone graft (DFDBA/Xenograft) หรือ Enamel Matrix Derivative (EMD)", "color": "#10b981"},
                    {"condition": "3-Wall หรือ Grade II Mandibular Molar Furcation", "outcome": "พยากรณ์ดีสำหรับการงอกใหม่ แต่ต้องปลอดคราบจุลินทรีย์และผู้ป่วยไม่สูบบุหรี่", "color": "#38bdf8"},
                    {"condition": "1-Wall / Suprabony (Horizontal bone loss) กว้าง", "outcome": "GTR ไม่ได้ผล ➔ พิจารณา Resective / Access flap surgery", "color": "#ef4444"},
                ]),
                _node(2, "หลักชีววิทยา GTR (Melcher's Hypothesis)", "เยื่อกั้นขัดขวาง Epithelium & Gingival Connective Tissue ที่โตเร็ว", "เปิดโอกาสให้ PDL cells และ Osteoblasts เคลื่อนมาสร้าง New attachment (New cementum + PDL + Bone) แทน Long junctional epithelium", "outcome"),
            ],
        }
    ],
    "Perio-Periodontal-Surgery-Flaps": [
        {
            "id": "perio-flap-indication-pathway",
            "title": "Periodontal Flap Selection: Widman vs Apically Positioned Flap & Osseous Surgery",
            "pathway_type": "procedure",
            "subtitle": "Reverse Bevel Incision ➔ เลือก Flap ตามเป้าหมายลด Pocket, รักษาความสวยงาม หรือเพิ่มความยาวตัวฟัน",
            "reference": "Carranza's Clinical Periodontology 13th ed.",
            "steps": [
                _node(1, "เลือกเทคนิคกรีด Flap (Incision Design)", "Internal (Reverse) Bevel ➔ Crevicular ➔ Interdental incision", "กำจัด Pocket epithelium ที่อักเสบและบางแผ่นเหงือกให้แนบกระดูกได้ดี", "action"),
                _node(2, "เลือกตำแหน่งการวางกลับของ Flap หลังผ่า", "ขึ้นกับความลึก Pocket, ปริมาณ Keratinized gingiva, และตำแหน่งความสวยงาม", "วางเป้าหมายแยก 3 แนวทางหลัก", "decision", [
                    {"condition": "ฟันหน้าต้องการคงขอบเหงือกสวยงาม / Access ดูรากฟัน", "outcome": "Modified Widman Flap (MWF) ➔ หายแบบ Long junctional epithelium ลดเหงือกร่น", "color": "#10b981"},
                    {"condition": "ฟันหลัง Pocket ลึก & ต้องการลด Pocket ให้ตื้นที่สุด / Crown lengthening", "outcome": "Apically Positioned Flap (APF) + Ostectomy/Osteoplasty (เพิ่ม Keratinized gingiva ได้ด้วย)", "color": "#38bdf8"},
                    {"condition": "บริเวณ Tuberosity ด้านท้ายฟันกรามบน", "outcome": "Distal Wedge Procedure", "color": "#f59e0b"},
                ]),
                _node(3, "การตัดแต่งกระดูก", "Osteoplasty (แต่งรูปร่างไม่เสียกระดูกพยุงฟัน) vs Ostectomy (ตัดกระดูกที่ติดรากฟันเพื่อสร้าง Positive architecture)", "หลังทำ APF + Ostectomy ให้เหลือระยะห่างจาก Bone crest ถึงขอบครอบฟันอย่างน้อย 3 mm (Biologic width)", "outcome"),
            ],
        }
    ],
    "Operative-Composite-Resins": [
        {
            "id": "op-composite-cfactor-pathway",
            "title": "Polymerization Shrinkage Stress, C-Factor & Incremental Layering Pathway",
            "pathway_type": "mechanism",
            "subtitle": "สูตร C-Factor = Bonded / Unbonded Surfaces ➔ ป้องกัน Post-op Sensitivity และ White Line Margin",
            "reference": "Sturdevant's Art and Science of Operative Dentistry 7th ed.",
            "steps": [
                _node(1, "คำนวณ Configuration Factor (C-Factor)", "C-Factor = จำนวนด้านที่ยึดติด (Bonded) / จำนวนด้านอิสระ (Unbonded)", "โพรงฟัน Class I และ Class V มี 5 ด้านติดกับ 1 ด้านอิสระ ➔ C = 5 (สูงที่สุด, แรงหดตัวดึงรั้งขอบสูงมาก)", "mechanism"),
                _node(2, "ผลกระทบเมื่อฉายแสงก้อนใหญ่ครั้งเดียว (Bulk Shrinkage Stress)", "Composite หดตัว 1.5–3% ขณะเกิด Cross-link (Polymerization)", "หาก C-factor สูงกว่าแรงยึดของสารยึดติด จะเกิด Marginal gap, Enamel microcrack (White line), Microleakage และอาการเสียวฟันขณะเคี้ยว (Hydrodynamic fluid shift)", "warning"),
                _node(3, "แนวทางจัดการลด Stress & ฉายแสง", "วางเรซินแบบ Oblique Incremental Layering (≤ 2 mm/ชั้น)", "เชื่อมทีละ 1–2 ผนังเพื่อให้มี Unbonded surface มากขึ้น + เลือกใช้ Bulk-fill เฉพาะชนิดที่รับรองความลึก 4–5 mm + ฉายแสงเข้มข้น ≥ 1,000 mW/cm²", "action"),
                _node(4, "Degree of Conversion & Oxygen Inhibited Layer", "ชั้นบนสุดสัมผัสอากาศไม่เซ็ตตัว (Oxygen-inhibited layer) ช่วยให้ชั้นต่อไปยึดติดกันทางเคมีได้", "ห้ามปนเปื้อนน้ำลายระหว่างชั้น; หลังฉายชั้นสุดท้ายให้ขัดแต่งด้วย Finishing burs & Polishing discs", "outcome"),
            ],
        }
    ],
    "Operative-Dental-Amalgam": [
        {
            "id": "op-amalgam-cavity-pathway",
            "title": "Mechanical Retention, High-Copper Amalgam & Mercury Safety Pathway",
            "pathway_type": "procedure",
            "subtitle": "90° Cavosurface Margin + Resistance/Retention Form ➔ กําจัด Gamma-2 Phase & การจัดการปรอท",
            "reference": "Sturdevant's Operative Dentistry & มติ Minamata / กระทรวงสาธารณสุขไทย",
            "steps": [
                _node(1, "หลักการเตรียมโพรงฟัน (Black's Principles for Amalgam)", "ความลึกอย่างน้อย 1.5–2 mm + ผนังด้าน Occlusal ลู่เข้าหากัน (Convergent) + 90° Butt-joint Margin", "อมัลกัมทนแรงอัดสูง (Compressive) แต่เปราะเมื่อรับแรงดึง/เฉือน จึงต้องทำ Isthmus กว้าง ~1/4 ของระยะ Intercuspal และ Internal line angles มนกลม", "action"),
                _node(2, "ปฏิกิริยาเซ็ตตัว & คุณสมบัติอัลลอยด์", "Low-copper มี Gamma-2 (Sn7-8Hg) ที่ผุกร่อนง่าย ➔ High-copper Amalgam (>12% Cu) เปลี่ยนเป็น Eta-prime (Cu6Sn5)", "High-copper ช่วยกำจัด Gamma-2 phase ทำให้ลด Creep, ลด Marginal ditching และแข็งแรงสูงขึ้นมาก", "mechanism"),
                _node(3, "ข้อบ่งชี้ทางคลินิก & ความปลอดภัยปรอท", "ห้ามใช้ Zinc-containing amalgam หากปนเปื้อนความชื้น ➔ เกิด Delayed Expansion (H2 gas) หลังอุด 3–5 วัน", "การเก็บเศษ Amalgam ใช้ภาชนะปิดสนิทใต้น้ำยา X-ray fixer หรือน้ำ และตามอนุสัญญามินามาตะในไทย: เลี่ยงการใช้อมัลกัมในเด็กเล็ก/หญิงตั้งครรภ์เมื่อมีทางเลือกอื่น", "warning"),
            ],
        }
    ],
    "Operative-GIC-RMGIC": [
        {
            "id": "op-gic-mechanism-pathway",
            "title": "Acid-Base Reaction, Chemical Bonding & Maturation Protection of GIC/RMGIC",
            "pathway_type": "mechanism",
            "subtitle": "Polyacrylic Acid + Fluoroaluminosilicate Glass ➔ Carboxyl-Ca2+ Ionic Bond & Fluoride Recharge",
            "reference": "Mount / Sturdevant's Art and Science of Operative Dentistry",
            "steps": [
                _node(1, "ปรับสภาพผิวฟัน (Conditioning)", "ใช้ 10–20% Polyacrylic acid 10–15 วินาที แล้วล้าง-เป่าชื้น (ห้ามเป่าแห้งเกิน)", "ขจัด Smear layer โดยยังคง Smear plug และสร้าง Ionic bridge ระหว่าง Carboxyl groups (-COOH) กับ Ca2+ ใน Hydroxyapatite", "action"),
                _node(2, "ปฏิกิริยาสองระยะของ Conventional GIC", "1) Initial set (~4–6 นาที): Calcium polycarboxylate gel (ไวต่อน้ำ!) ➔ 2) Maturation (~24 ชม.): Aluminium polycarboxylate แข็งแรง", "ในช่วง 24 ชม. แรก หากสัมผัสน้ำจะชะล้างไอออน (Dissolution) หรือแห้งเกินจะแตกร้าว (Crazing) ➔ ต้องทาวานิช/เรซินเคลือบผิว (Resin coat) ทันที", "warning"),
                _node(3, "เปรียบเทียบ GIC vs RMGIC", "RMGIC เพิ่ม HEMA + Photoinitiator ➔ Light-cure ทันที ลดความไวต่อน้ำและทนแรงสูงขึ้น", "เหมาะทำ Liner/Base (Sandwich technique) หรืออุดฟันน้ำนม/Cervical caries โดยปล่อยและรับเก็บ Fluoride (Rechargeable reservoir) ได้ตลอดอายุการใช้งาน", "outcome"),
            ],
        }
    ],
    "Operative-NCCL-Hypersensitivity": [
        {
            "id": "op-nccl-dh-pathway",
            "title": "Differential & Management Pathway: NCCLs (Abrasion/Abfraction/Erosion) & Dentin Hypersensitivity",
            "pathway_type": "decision",
            "subtitle": "จำแนกรอยสึกรูปลิ่ม vs จานแบน ➔ บำบัดเสียวฟันตาม Hydrodynamic Theory",
            "reference": "Sturdevant's Operative Dentistry 7th ed.",
            "steps": [
                _node(1, "จำแนกรอยโรคคอฟันไม่เกิดจากผุ (NCCLs)", "ดูรูปร่าง มุม และพฤติกรรม (แปรงฟันแรง / นอนกัดฟัน / กรดจากอาหาร-กรดไหลย้อน)", "แยกชนิดเพื่อแก้ที่สาเหตุจริง ป้องกันวัสดุอุดหลุดซ้ำ", "decision", [
                    {"condition": "รูปลิ่มขอบคมลึก (Wedge-shaped V-notch) มักเกิดกับฟันสบกระแทก", "outcome": "Abfraction (Occlusal flexure stress) ➔ ปรับสบ/ใส่ Occlusal splint + อุดด้วยวัสดุยืดหยุ่น (Flowable/RMGIC)", "color": "#f59e0b"},
                    {"condition": "รอยสึกแบนเงาเรียบแนวขวางระดับ CEJ", "outcome": "Toothbrush Abrasion ➔ เปลี่ยนแปรงขนนุ่ม ปรับเทคนิคแปรงฟัน", "color": "#38bdf8"},
                    {"condition": "หลุมเว้าก้นเรียบมันวาว ขอบอมัลกัมยื่นสูงพ้นฟัน (Cupping / Lingual wear)", "outcome": "Dental Erosion ➔ ลดเครื่องดื่มกรด/ตรวจ GERD (ห้ามแปรงฟันทันทีหลังอาเจียน/ทานเปรี้ยว ให้บ้วนน้ำหรือเบกกิ้งโซดา)", "color": "#ef4444"},
                ]),
                _node(2, "กลไกแก้เสียวฟัน (Dentin Hypersensitivity)", "1) ลดการส่งสัญญาณประสาท: Potassium nitrate (5%) เพิ่ม K+ นอกเซลล์ทำให้ประสาทไม่ Depolarize", "2) อุดท่อเนื้อฟัน (Tubule occlusion): Fluoride varnish, Oxalate, Glutaraldehyde/HEMA, Arginine-CaCO3, หรือ Adhesive bonding", "outcome"),
            ],
        }
    ],
    "Operative-Bleaching-Esthetics": [
        {
            "id": "op-bleaching-pathway",
            "title": "Clinical Decision & Safety Pathway: Vital vs Non-Vital Tooth Bleaching",
            "pathway_type": "decision",
            "subtitle": "Hydrogen/Carbamide Peroxide Free Radicals ➔ ป้องกัน External Cervical Resorption ในฟันรักษาราก",
            "reference": "Sturdevant's Operative Dentistry & AAE Internal Bleaching Guidelines",
            "steps": [
                _node(1, "กลไกการฟอกสี (Oxidation)", "Carbamide peroxide (10% ≈ 3.5% H2O2) แตกตัวเป็น Free radicals ย่อยโมเลกุลสีสายยาว (Chromophores) ให้สั้นและไม่มีสี", "ต้องกำจัดฟันผุและเปลี่ยนวัสดุรั่วก่อนฟอกสีทุกครั้ง; ปิดกั้นเหงือกมิดชิดเมื่อใช้ 25–40% H2O2 ในคลินิก", "mechanism"),
                _node(2, "เลือกเทคนิคตามความมีชีวิตของฟัน", "ตรวจ Vitality, ประวัติรักษารากฟัน และสีที่เปลี่ยน (Tetracycline bands เทาเข้มตอบสนองยากที่สุด)", "แยก Vital vs Walking Bleach", "decision", [
                    {"condition": "ฟันมีชีวิตสีเหลืองตามวัย/คราบอาหาร", "outcome": "Home Bleaching (10–16% Carbamide Peroxide) ปลอดภัยและเสียวฟันน้อยกว่า In-office", "color": "#10b981"},
                    {"condition": "ฟันรักษารากสีคล้ำ (Non-vital)", "outcome": "Walking Bleach (Sodium perborate + น้ำ/H2O2 ต่ำ) ต้องวาง Cervical barrier (RMGIC/IRM หนา 2 mm ระดับ CEJ) เสมอ!", "color": "#f59e0b"},
                ]),
                _node(3, "ข้อห้ามหลังฟอกสีทันที (Post-bleaching Bonding Wait)", "ออกซิเจนตกค้างใน Enamel ยับยั้งการเซ็ตตัวของ Resin composite", "ต้องรออย่างน้อย 7–14 วันหลังหยุดฟอกสีก่อนอุดฟันหรือติดวีเนียร์ (หรือทา Sodium ascorbate ช่วยต้านอนุมูลอิสระ)", "warning"),
            ],
        }
    ],
    "Pros-Jaw-Relations-Occlusion": [
        {
            "id": "pros-vdo-cr-pathway",
            "title": "Complete Denture Jaw Relations & Bilateral Balanced Occlusion Pathway",
            "pathway_type": "procedure",
            "subtitle": "VDR − Freeway Space (2–4 mm) = VDO ➔ Centric Relation (CR) & Bilateral Balanced Articulation",
            "reference": "Zarb's Prosthodontic Treatment for Edentulous Patients 13th ed.",
            "steps": [
                _node(1, "กำหนดมิติแนวดิ่ง (Vertical Dimension)", "วัด VDR (ขณะพักไม่มีฟันสบกัน) แล้วหักออกด้วย Freeway Space (Interocclusal distance) 2–4 mm = VDO", "เช็กด้วย Silvermann's Closest Speaking Space (ออกเสียง 'S' ห้ามแท่นขี้ผึ้งชนกัน เหลือช่อง 1–2 mm) และสัดส่วนใบหน้า", "decision", [
                    {"condition": "VDO สูงเกินไป (Excessive VDO)", "outcome": "ปวดกล้ามเนื้อ, กัดฟันดัง, กระดูกสันเหงือกละลายเร็ว, ไม่มี Freeway space", "color": "#ef4444"},
                    {"condition": "VDO ต่ำเกินไป (Insufficient VDO)", "outcome": "มุมปากตก/Angular cheilitis, หน้าดูแก่, ประสิทธิภาพเคี้ยวลดลง", "color": "#f59e0b"},
                ]),
                _node(2, "บันทึกความสัมพันธ์แนวนอน (Centric Relation)", "CR = ตำแหน่ง Condyle อยู่สูงสุดและหน้าสุดชิด Posterior slope ของ Articular eminence (Repeatable bone-to-bone)", "ใช้เทคนิค Bimanual manipulation หรือให้ผู้ป่วยกลืนน้ำลาย/แตะปลายลิ้นเพดานด้านหลัง เพื่อลดแรงเบี่ยงเบนของกล้ามเนื้อ", "action"),
                _node(3, "ระบบสบฟันเทียม (Complete Denture Occlusion)", "Bilateral Balanced Occlusion: เมื่อเยื้องคางซ้าย-ขวาหรือยื่นคาง ฟันทั้งสองข้างต้องสัมผัสประคองฐานฟันเทียมพร้อมกัน", "ใช้กฎ Hanau's Quint 5 ปัจจัย; หากสันเหงือกล่างแบนราบมาก พิจารณา Lingualized occlusion หรือ Non-anatomic (Monoplane) teeth เพื่อลดแรงเยื้องด้านข้าง", "outcome"),
            ],
        }
    ],
    "Pros-Complete-Denture-Anatomy": [
        {
            "id": "pros-cd-support-border-pathway",
            "title": "Denture Bearing Anatomy & Border Molding Functional Pathway",
            "pathway_type": "mechanism",
            "subtitle": "Primary Stress-Bearing Areas vs Relief Areas ➔ Posterior Palatal Seal & Flanges",
            "reference": "Zarb's Prosthodontic Treatment for Edentulous Patients 13th ed.",
            "steps": [
                _node(1, "แยกพื้นที่รับแรง (Stress-Bearing vs Relief)", "บน: Horizontal plate ของ Hard palate + สันเหงือกเป็นตัวรับแรงหลัก; หลบ Incisive papilla & Midpalatine raphe", "ล่าง: Buccal shelf (รับแรงหลัก — เป็น Cortical bone วางตัวตั้งฉากกับแรงเคี้ยว!) + สันเหงือก; หลบ Mylohyoid ridge & Mental foramen (เมื่อสันร่น)", "mechanism"),
                _node(2, "การแต่งขอบถาด (Border Molding & Distobuccal Notch)", "Distobuccal flange ของฟันเทียมบน: สร้างความหนาตาม Coronoid process เมื่ออ้าปาก-ขยับคางซ้ายขวา", "Distobuccal flange ของฟันเทียมล่าง: Masseter muscle ออกแรงดันขอบเวลาเคี้ยว (Masseteric notch); ด้านหลังสุดคลุม Retromolar pad 2/3 เพื่อ Peripheral seal", "action"),
                _node(3, "Posterior Palatal Seal (Ah-line / Butterfly Area)", "อยู่บริเวณรอยต่อ Hard-Soft Palate (ระหว่าง Fovea palatinae กับ Hamular notches)", "หากทำลึก/ยาวเกินจะกดรัดกล้ามเนื้อและคลื่นไส้; หากสั้น/ตื้นเกินฟันเทียมบนจะหลุดเวลากัดอาหารหรือออกเสียง", "decision", [
                    {"condition": "เพดานอ่อนมุมชันมาก (House Class III)", "outcome": "โซนทำ Seal แคบมาก (~1–2 mm) ต้องตรวจขอบให้แม่นยำเป็นพิเศษ", "color": "#f59e0b"},
                    {"condition": "เกิดแผลกดทับด้านข้างหรือขอบยาวเวลาพูด", "outcome": "ใช้ Pressure Indicating Paste (PIP) ป้ายเช็กจุดกดก่อนกรอแต่ง ไม่กรอสุ่ม", "color": "#10b981"},
                ]),
            ],
        }
    ],
    "Pros-RPD-Classification-Surveying": [
        {
            "id": "pros-kennedy-applegate-survey",
            "title": "Kennedy Classification, Applegate's Rules & Dental Surveying Pathway",
            "pathway_type": "procedure",
            "subtitle": "จำแนก Class I–IV ตามช่องว่างหลังสุด ➔ วิเคราะห์ 4 ปัจจัยบนเครื่อง Surveyor (Path of Insertion)",
            "reference": "McCracken's Removable Partial Prosthodontics 13th ed.",
            "steps": [
                _node(1, "กฎจำแนก Kennedy & Applegate", "1) จำแนกหลังถอนฟันเสร็จแล้ว 2) ช่องว่างที่อยู่หลังสุด (Most posterior edentulous area) เป็นตัวกำหนด Class เสมอ", "Class I (ไม่มีฟันท้าย 2 ข้าง), Class II (ไม่มีฟันท้าย 1 ข้าง), Class III (มีฟันหลักหัว-ท้าย), Class IV (ช่องว่างข้าม Midline อยู่หน้าสุด — ไม่มี Modification!)", "decision", [
                    {"condition": "ซี่ 8 ไม่มีและไม่ใส่ทดแทน", "outcome": "ไม่นับซี่ 8 ในการจำแนก Class; แต่ซี่ 7 ต้องพิจารณาว่าควรใส่แทนหรือไม่ตามการสบ", "color": "#38bdf8"},
                    {"condition": "มีช่องว่างเพิ่มอีก 2 จุดนอกเหนือจากพื้นที่หลัก", "outcome": "นับเป็น Modification 2 (เช่น Kennedy Class II Mod 2)", "color": "#10b981"},
                ]),
                _node(2, "ลำดับการใช้งาน Dental Surveyor", "Tilt Cast เพื่อหาสมดุล 4 อย่าง: 1) Guiding planes 2) Retentive areas 3) Interference 4) Esthetics", "ใช้ Carbon marker วาด Survey line (Height of contour) และ Undercut gauge (0.01\", 0.02\", 0.03\") กำหนดจุดสิ้นสุดของ Retentive clasp arm", "action"),
                _node(3, "สรุปทิศทางปลายตะขอ", "ปลาย Retentive arm (1/3 ปลายที่ยืดหยุ่น) เท่านั้นที่อยู่ใต้ Survey line", "Shoulder และ Reciprocal arm ต้องอยู่บน/เหนือ Survey line เพื่อโอบประคอง (Bracing) ตลอดเวลา", "outcome"),
            ],
        }
    ],
    "Pros-Fixed-Tooth-Preparation": [
        {
            "id": "pros-fixed-prep-principles",
            "title": "Biomechanics of Tooth Preparation Pathway: Taper, Reduction & Margin Design",
            "pathway_type": "procedure",
            "subtitle": "Total Occlusal Convergence (6–10°), Retention vs Resistance Form & Margin Selection",
            "reference": "Shillingburg: Fundamentals of Fixed Prosthodontics 4th ed.",
            "steps": [
                _node(1, "ความลู่เอียงและความสูง (Retention & Resistance Form)", "Taper / Total Occlusal Convergence (TOC) อุดมคติ 6°–10° (ทำจริงในคลินิก 10°–20°)", "ฟันกรอเตี้ยหรืออ้วนกว้างเสี่ยงหลุดเวลาเคี้ยว (Resistance form เสีย) ➔ แก้โดยเติม Proximal grooves/boxes ลดการหมุนหลุด (Arc of displacement)", "mechanism"),
                _node(2, "ความหนาที่ต้องกรอลด (Tooth Reduction by Material)", "เลือกชนิดครอบฟันให้เหมาะกับแรงสบและพื้นที่กรอฟัน", "การกรอไม่พอทำให้วัสดุบางแตกหรือได้ Overcontoured crown ก่อให้เกิดเหงือกอักเสบ", "decision", [
                    {"condition": "Full Metal Crown (Gold)", "outcome": "Occlusal Functional cusp 1.5 mm / Non-functional 1.0 mm + Chamfer 0.3–0.5 mm", "color": "#f59e0b"},
                    {"condition": "PFM (Porcelain-Fused-to-Metal)", "outcome": "Labial 1.5 mm (เพื่อสีพอร์ซเลน+โลหะ), Lingual 0.7–1.0 mm + Shoulder/Heavy Chamfer 1.0–1.2 mm ด้านหน้า", "color": "#38bdf8"},
                    {"condition": "Monolithic Zirconia vs Lithium Disilicate (E.max)", "outcome": "Monolithic Zirconia กรอน้อยได้ ~1.0 mm (Chamfer); Lithium Disilicate ต้องกรอ Occlusal 1.5–2.0 mm + Shoulder/Heavy Chamfer 1.0 mm มนกลม", "color": "#10b981"},
                ]),
                _node(3, "ตำแหน่งขอบครอบฟัน (Finish Line Placement)", "Supra-gingival ดีที่สุดต่อปริทันต์; ถ้าต้องซ่อนขอบเพื่อความสวยงามหรือ Ferrule ให้ลง Subgingival ≤ 0.5–1.0 mm และไม่รุกล้ำ Biologic width (≥ 2 mm)", "outcome"),
            ],
        }
    ],
}
