"""Curated Clinical Pathways Part 2: Prosthodontics, Pediatric, OralMed, TMD, Ortho, Community, Dental Law (30 topics)."""

from typing import Any, Dict, List
from pathway_schema import node as _node

PATHWAYS_PART2: Dict[str, List[Dict[str, Any]]] = {
    # =========================================================================
    # PROSTHODONTICS (5)
    # =========================================================================
    "Pros-Fixed-Provisional-Impression": [
        {
            "id": "pros-gingival-retraction-impression-pathway",
            "title": "Clinical Workflow: Gingival Retraction, Elastomeric Impression & Provisional Restoration",
            "pathway_type": "procedure",
            "subtitle": "Subgingival Finish Line Management ➔ Double-Cord Technique, PVS Polymerization Trap & Bis-Acryl/PMMA Provisional",
            "reference": "Shillingburg's Fundamentals of Fixed Prosthodontics 4th ed. / Rosenstiel Contemporary Fixed Prosthodontics 6th ed.",
            "steps": [
                _node(1, "เตรียมร่องเหงือก (Tissue Management)", "Double-Cord Retraction Technique + Hemostatic Agent (AlCl3 / Ferric Sulfate)", "เชือกเส้นเล็ก (เช่น #000) วางค้างก้นร่องเหงือกคุมเลือด/น้ำเหลือง เชือกเส้นใหญ่ (#0 หรือ #1) วางทับด้านบนเพื่อถ่างเหงือกทางแนวราบ แล้วถอดออกก่อนฉีด Light-body", "action"),
                _node(2, "เลี่ยงข้อผิดพลาดวัสดุพิมพ์ (Impression Pitfalls)", "ห้ามสัมผัส PVS (Addition Silicone) ด้วยถุงมือ Latex ที่มี Sulfur", "สาร Sulfur ในถุงมือ Latex และ Dithiocarbamate จะยับยั้ง Platinum catalyst ทำให้ PVS ไม่เซ็ตตัวบริเวณ Margin — ต้องใช้ Nitrile หรือ Vinyl gloves", "warning"),
                _node(3, "การเลือกใช้วัสดุและเทการเทปูน", "ประเมินเวลาเทปูน (Pouring Time) & การหดตัวตามประเภท Elastomer", "แยกแยะคุณสมบัติของ Elastomer และ Polyelectrolyte ก่อนส่งแล็บ", "decision", [
                    {"condition": "PVS (Addition Silicone): แม่นยำสูงสุด คงรูปนาน เก็บซ้ำได้หลายวัน", "outcome": "รอปล่อยก๊าซ Hydrogen (30–60 นาที หรือสูตรมี Palladium absorber) ก่อนเทปูน Type IV Die Stone", "color": "#10b981"},
                    {"condition": "Polyether: ชอบน้ำ (Hydrophilic) แข็งมาก (High rigidity)", "outcome": "ห้ามแช่น้ำนาน (ดูดน้ำบวม) และต้อง Block out ใต้ Pontic/Undercut ใหญ่กันฟันหลักหักตอนถอดถาดพิมพ์", "color": "#38bdf8"},
                    {"condition": "Irreversible Hydrocolloid (Alginate) / Condensation Silicone", "outcome": "ต้องเทปูนทันที (< 10–15 นาที) เพราะเกิด Syneresis / Imbibition หรือระเหยแอลกอฮอล์หดตัว", "color": "#f59e0b"},
                ]),
                _node(4, "ทำครอบชั่วคราวและยึดด้วยซีเมนต์", "Custom PMMA / Bis-Acryl Provisional + Non-Eugenol Temporary Cement", "หลีกเลี่ยง Eugenol (ZOE) หากวางแผนยึดครอบจริงด้วย Resin Cement เพราะ Eugenol ยับยั้ง Free-radical polymerization", "outcome"),
            ],
        }
    ],
    "Pros-Dental-Implants": [
        {
            "id": "pros-implant-osseointegration-pathway",
            "title": "Clinical Protocol: Dental Implant Spacing, Osseointegration & Peri-implant Biology",
            "pathway_type": "decision",
            "subtitle": "3-2-1 Safety Distances, Primary Stability vs Secondary Stability & Platform Switching",
            "reference": "Misch's Contemporary Implant Dentistry 4th ed. / ITI Treatment Guide",
            "steps": [
                _node(1, "วางแผนระยะปลอดภัยเชิงกายวิภาค (3D Positioning)", "Implant-Tooth ≥ 1.5 mm | Implant-Implant ≥ 3.0 mm | Apicocoronal ลึกจาก CEJ ข้างเคียง 3–4 mm", "เว้นระยะห่างด้าน Buccal bone thickness อย่างน้อย 1.5–2.0 mm และเหนือ Inferior Alveolar Nerve อย่างน้อย 2.0 mm เพื่อลด Bone loss และความเสี่ยงชา", "action"),
                _node(2, "ประเมินเสถียรภาพและชีววิทยากระดูก (Osseointegration)", "Primary Stability (Mechanical interlocking ตอนฝัง) ➔ Secondary Stability (Biological bone remodeling)", "ช่วงสัปดาห์ที่ 2–4 เกิด Bone resorption ชั่วคราวทำให้ Total stability ต่ำสุด (Stability dip) ก่อนที่ Osteogenesis จะเพิ่มความแข็งแรง", "mechanism"),
                _node(3, "เลือกการใส่ครอบและการรับแรง (Loading & Retention)", "ประเมิน Torque (> 35 Ncm), ISQ และความเสี่ยงแทรกซ้อน", "ตัดสินใจระหว่าง Screw-retained vs Cement-retained และจัดการ Biological complication", "decision", [
                    {"condition": "มีข้อจำกัดระยะ Interarch space น้อย (< 4–5 mm) หรือต้องการถอดซ่อมบ่อย", "outcome": "Screw-retained Crown (ข้อดี: ไม่เสี่ยง Residual cement causing Peri-implantitis)", "color": "#10b981"},
                    {"condition": "แนวรากเอียงออกด้าน Facial (ต้องแก้แกนด้วย Angled Abutment)", "outcome": "Cement-retained Crown + ใช้ Radiopaque ZOE/RMGIC ทาเฉพาะขอบในน้อยๆ + กำจัดส่วนเกินทุกด้าน", "color": "#38bdf8"},
                    {"condition": "อักเสบรอบรากเทียม: เลือดออกตอน Probing (BOP+) แต่ Bone loss ยังไม่เกิด vs มี Bone loss", "outcome": "ไม่มี Bone loss = Peri-implant Mucositis (รักษาหายได้) | มี Marginal bone loss = Peri-implantitis", "color": "#ef4444"},
                ]),
                _node(4, "Implant Protective Occlusion", "ลดขนาด Occlusal table, Cusp slope ราบลง, Axial loading ไม่มี Non-working interference", "รากเทียมไม่มี PDL (ไม่มี Proprioception และไม่ยุบตัวในเบ้ากระดูกเหมือนฟันธรรมชาติ ~28 µm vs 3–5 µm) จึงต้องปรับ Light contact", "outcome"),
            ],
        }
    ],
    "Pros-RPD-Components-Biomechanics": [
        {
            "id": "pros-rpd-class-i-biomechanics",
            "title": "Biomechanics & Design Pathway: Kennedy Class I/II Distal Extension RPD",
            "pathway_type": "decision",
            "subtitle": "Dual Support System (Tooth + Mucosa) ➔ Mesial Rest + RPI/RPA Clasp & Indirect Retainer Fulcrum",
            "reference": "McCracken's Removable Partial Prosthodontics 13th ed. / Phoenix Stewart's Clinical Removable Partial Prosthodontics",
            "steps": [
                _node(1, "ความท้าทายหลัก (Differential Compressibility)", "ฟันธรรมชาติยุบตัวใน PDL (~0.02–0.1 mm) vs สันเหงือกยุบตัวได้มาก (~0.4–2.0 mm)", "เมื่อเคี้ยวด้านท้ายอิสระ (Distal extension base) ฟันเทียมจะกระดกหมุนรอบ Fulcrum line ที่พาดผ่าน Principal occlusal rests", "trigger"),
                _node(2, "เลือก Direct Retainer เพื่อลด Torque บนฟันหลัก", "ย้าย Occlusal Rest มาด้าน Mesial เพื่อเปลี่ยนคานงัดอันตราย", "การวาง Rest ด้าน Distal จะดึงฟันหลักล้มไปด้านหลัง (Distal tipping torque) ในขณะที่ Mesial rest เปลี่ยนจุดหมุนให้แขน Clasp ปลดล็อกออกจาก Undercut", "decision", [
                    {"condition": "Vestibule ลึกเพียงพอ (> 4 mm) และไม่มี Tissue undercut รุนแรง", "outcome": "ใช้ RPI System (Mesial Rest + Distolingual/Distoproximal Guide Plate + I-bar): เมื่อฐานกดลง I-bar จะเคลื่อนลงล่าง-หน้าพ้น Undercut", "color": "#10b981"},
                    {"condition": "Vestibule ตื้น / มี Soft tissue undercut มาก / Frenum สูง", "outcome": "ใช้ RPA System (Mesial Rest + Proximal Plate + Akers/Wrought-wire clasp) หรือใช้ Stress-releasing Cast/Wrought Clasp", "color": "#38bdf8"},
                ]),
                _node(3, "เพิ่มการต้านแรงกระดก (Indirect Retainer)", "วาง Rest เสริมบนฟันหน้า/ฟันกรามน้อย (เช่น Cingulum rest บนเขี้ยว) ด้านตรงข้ามของ Fulcrum line", "วางห่างจากแกน Fulcrum line ตั้งฉากมากที่สุด เพื่อป้องกันฐานฟันเทียมท้ายอิสระยกตัวเมื่อกินอาหารเหนียว", "action"),
                _node(4, "Major Connector & Altered Cast Technique", "ล่าง: Lingual Bar (ต้องมีพื้นที่ ≥ 8 mm จาก FGM ถึง Floor of mouth) หรือ Lingual Plate (< 8 mm) | บน: AP Palatal Strap/Full Palate", "ใช้วิธี Altered Cast Impression กดสันเหงือกในภาวะ Functional form ลดการกระดกของฐานท้ายอิสระ", "outcome"),
            ],
        }
    ],
    "Pros-Pontic-Design": [
        {
            "id": "pros-pontic-selection-pathway",
            "title": "Design Decision Tree: Pontic Selection & Hygienic Tissue Contouring",
            "pathway_type": "decision",
            "subtitle": "Esthetic Zone (Modified Ridge Lap / Ovate) vs Posterior Non-Esthetic (Sanitary / Hygienic) & Ante's Law",
            "reference": "Shillingburg 4th ed. / Rosenstiel Contemporary Fixed Prosthodontics",
            "steps": [
                _node(1, "ประเมินฟันหลัก (Ante's Law & Crown-Root Ratio)", "ผลรวมพื้นที่ PDL ของฟันหลัก ≥ พื้นที่ PDL ของฟันที่หายไป + Crown-Root ratio ดีที่สุด ≤ 1:1.5 (Ideal 1:2)", "ตรวจสอบรูปร่างรากฟัน (รากแผ่แบน/หลายรากดีกว่ารากเรียวกลม) และการเรียงตัวของสันเหงือก", "action"),
                _node(2, "เลือกแบบ Pontic ตามตำแหน่งและความสำคัญด้านความงาม", "ชั่งน้ำหนักระหว่างความสวยงาม กับการทำความสะอาดได้ง่ายด้วยไหมขัดฟัน (Superfloss)", "เลือกแบบสัมผัสสันเหงือกแบบ Zero pressure (Passive pinpoint/convex contact)", "decision", [
                    {"condition": "ฟันหน้าบน/ล่าง ที่ต้องการความสวยงามสูง และสันเหงือกยังสมบูรณ์", "outcome": "Modified Ridge Lap Pontic (แตะเหงือกเฉพาะด้าน Buccal แบบ Convex ไม่กดทับ ด้าน Lingual โค้งมนทำความสะอาดได้)", "color": "#10b981"},
                    {"condition": "ต้องการความสวยงามสูงสุดหลังถอนฟันทันที (Immediate Extraction Site)", "outcome": "Ovate Pontic (ปลายโค้งมนจมในเบ้า/เหงือกที่เตรียมไว้ ดูเหมือนงอกจากเหงือกจริง ต้องดูแลความสะอาดสูง)", "color": "#38bdf8"},
                    {"condition": "ฟันหลังล่างที่ไม่เห็นเวลาพูด/ยิ้ม (Non-esthetic zone)", "outcome": "Sanitary / Hygienic Pontic (ลอยพ้นสันเหงือก ≥ 2 mm รูปโค้งปลาวาฬ/Bullet ทำความสะอาดง่ายสุด)", "color": "#f59e0b"},
                    {"condition": "Ridge Lap / Saddle Pontic แบบเว้าโอบสันเหงือกทั้ง 2 ด้าน", "outcome": "ข้อห้าม (Contraindicated): กักเศษอาหาร ทำความสะอาดไม่ได้ เหงือกอักเสบเรื้อรัง", "color": "#ef4444"},
                ]),
                _node(3, "Connector Design & Stress Concentration", "ออกแบบ Connector สูง-กว้างเหมาะสม (All-ceramic Zirconia/Lithium disilicate ต้องการความหนาสูงกว่า PFM)", "เปิด Embrasure ด้านเหงือกกว้างพอให้แปรงซอกฟันและไหมขัดฟันลอดผ่านได้โดยไม่กด Interdental papilla", "outcome"),
            ],
        }
    ],
    "Pros-Fixed-Cements-Post-Core": [
        {
            "id": "pros-post-core-cementation-pathway",
            "title": "Decision Pathway: Post & Core Restoration (Ferrule Effect) + Luting Cement Selection",
            "pathway_type": "decision",
            "subtitle": "ประเมิน Coronal Structure & Ferrule ≥ 1.5–2.0 mm ➔ Cast vs Fiber Post & Conventional vs Adhesive Cement",
            "reference": "Shillingburg 4th ed. / Gutmann / Rosenstiel Fixed Prosthodontics",
            "steps": [
                _node(1, "เช็กความจำเป็นของการใส่เดือยฟัน (Post Indication)", "เดือยฟันมีไว้เพื่อ ‘ยึดแกนฟัน (Core Retention)’ ไม่ใช่เพื่อ ‘เสริมความแข็งแรงให้รากฟัน’", "ฟันหลังที่รักษารากฟันและยังเหลือผนังฟันเพียงพอใช้ Core buildup + Onlay/Crown โดยไม่ต้องใส่ Post เพื่อป้องกันรากแตก", "trigger"),
                _node(2, "เงื่อนไขสำคัญที่สุด: Ferrule Effect & ความยาวราก", "ต้องเหลือเนื้อฟันธรรมชาติล้อมรอบขอบเหงือกสูง ≥ 1.5–2.0 mm หนา ≥ 1.0 mm + เหลือ Apical GP Seal ≥ 4–5 mm", "ความยาวเดือย: อย่างน้อย ≥ 2/3 ของความยาวราก หรือ ≥ ความยาวครอบฟัน และหนา ≤ 1/3 ของเส้นผ่านศูนย์กลางราก", "action"),
                _node(3, "เลือกชนิดเดือยฟันและวัสดุซีเมนต์ยึดครอบ", "เปรียบเทียบ Elastic Modulus กับเนื้อฟัน และชนิดขอบ/วัสดุครอบ", "จับคู่ Post + Luting Agent ให้ถูกหลักกลศาสตร์และเคมี", "decision", [
                    {"condition": "คลองรากกลม ผนังหนา เหลือ Ferrule ดี ต้องการความงาม + ลดเสี่ยง VRF", "outcome": "Fiber Post (Elastic modulus ใกล้เคียง Dentin ~20 GPa) + Core Composite + ยึดด้วย Resin Cement", "color": "#10b981"},
                    {"condition": "คลองรากรูปวงรี/ใหญ่ หรือฟันเหลือเนื้อฟันน้อยมาก (ต้องการ Anti-rotation)", "outcome": "Custom Cast Post & Core (Alloy) + ยึดด้วย RMGIC / Zinc Phosphate / Self-adhesive Resin Cement", "color": "#38bdf8"},
                    {"condition": "ครอบ Glass-ceramic (เช่น Lithium Disilicate E.max) vs Zirconia / PFM", "outcome": "E.max ใช้ Hydrofluoric Acid Etch + Silane + Resin Cement | Zirconia พ่นทราย Al2O3 + MDP Primer (ไม่กัด HF)", "color": "#ec4899"},
                ]),
                _node(4, "คำเตือนการเตรียมและยึด Zirconia / Glass Ceramic", "ห้ามใช้น้ำยาล้าง PVS/Saliva ที่ปนเปื้อนฟอสเฟตบน Zirconia ก่อนทา MDP", "ทำความสะอาด Zirconia หลัง Try-in ด้วย Ivoclean หรือพ่นทรายเบาๆ เพราะฟอสเฟตในน้ำลายแย่งจับตำแหน่งออกไซด์ของ MDP", "warning"),
            ],
        }
    ],

    # =========================================================================
    # PEDIATRIC DENTISTRY (4)
    # =========================================================================
    "Pedia-Behavior-Guidance": [
        {
            "id": "pedia-behavior-management-pathway",
            "title": "Clinical Escalation Pathway: Pediatric Behavior Guidance (Non-Pharmacologic to GA)",
            "pathway_type": "decision",
            "subtitle": "Frankl Behavior Rating Scale ➔ Basic Techniques (TSD/Distraction/Positive Reinforcement) ➔ Advanced (Protective Stabilization/Sedation/GA)",
            "reference": "AAPD Guideline on Behavior Guidance for the Pediatric Dental Patient / ชมรมทันตกรรมสำหรับเด็กแห่งประเทศไทย",
            "steps": [
                _node(1, "ประเมินพัฒนาการและระดับความร่วมมือ (Frankl Rating 1–4)", "ประเมินอายุ วุฒิภาวะทางอารมณ์ ประสบการณ์เดิม และความเร่งด่วนของการรักษา", "Frankl 1 (Definitely Negative) ➔ Frankl 4 (Definitely Positive)", "trigger"),
                _node(2, "Basic Behavior Guidance (ด่านแรกในเด็กส่วนใหญ่)", "Tell-Show-Do (TSD), Ask-Tell-Ask, Voice Control, Positive Reinforcement, Distraction, Modeling", "TSD ใช้ได้ผลดีที่สุดในเด็กเล็กเพื่อลดความกลัวจากสิ่งที่ไม่คุ้นเคย (Fear of the unknown) โดยไม่ใช้คำขู่หรือคำหลอก", "action"),
                _node(3, "กรณีไม่ร่วมมือรุนแรง หรือต้องทำหัตถการเร่งด่วน", "ประเมินสาเหตุ: ขาดทักษะร่วมมือ (Pre-cooperative < 3 ปี) / กลัวรุนแรง / Special Health Care Needs", "เลือกวิธีการขั้นสูงร่วมกับ Informed Consent เป็นลายลักษณ์อักษรจากผู้ปกครอง", "decision", [
                    {"condition": "กังวลเล็กน้อย-ปานกลาง สื่อสารรู้เรื่อง หายใจทางจมูกปกติ", "outcome": "Nitrous Oxide/Oxygen Inhalation Sedation (ข้อห้าม: คัดจมูก/COPD/พึ่งผ่าตัดหูชั้นกลาง/ตั้งครรภ์ไตรมาสแรก)", "color": "#10b981"},
                    {"condition": "ต้องป้องกันการขยับฉับพลันเพื่อความปลอดภัย (Emergency) + Consent ชัดเจน", "outcome": "Protective Stabilization (Papoose board/ผู้ปกครองช่วยกอด) เฉพาะเท่าที่จำเป็น ไม่ใช้เพื่อลงโทษ", "color": "#f59e0b"},
                    {"condition": "เด็กเล็กมาก (ECC รุนแรงหลายซี่) / สื่อสารไม่ได้ / ต้องรักษาครบจบครั้งเดียว", "outcome": "Pharmacologic Sedation หรือ General Anesthesia (GA)", "color": "#38bdf8"},
                ]),
                _node(4, "จริยธรรมและกฎหมายในการคุมพฤติกรรม (Consent & Safety)", "ต้องอธิบายความเสี่ยงและขอ Informed Consent จากผู้ปกครองก่อนใช้ Voice control / Protective stabilization / Sedation เสมอ", "ห้ามใช้ HOME (Hand-Over-Mouth Exercise) ในปัจจุบันเพราะขัดต่อแนวทาง AAPD ล่าสุดและสิทธิเด็ก", "warning"),
            ],
        }
    ],
    "Pedia-Space-Maintenance": [
        {
            "id": "pedia-space-maintainer-pathway",
            "title": "Decision Algorithm: การเลือก Space Maintainer หลังสูญเสียฟันน้ำนมก่อนกำหนด",
            "pathway_type": "decision",
            "subtitle": "ประเมิน Nolla Stage / ปริมาณกระดูกคลุมหน่อฟันถาวร ➔ Band & Loop / Distal Shoe / Lingual Arch / Nance",
            "reference": "McDonald and Avery's Dentistry for the Child and Adolescent 11th ed. / AAPD Space Maintenance Guideline",
            "steps": [
                _node(1, "เช็กความจำเป็นของการใส่เครื่องมือกันช่องว่าง", "ถ่ายฟิล์ม Periapical ดูหน่อฟันถาวร (Permanent Successor)", "ดูว่ากระดูกที่คลุมด้าน Occlusal ของหน่อฟันถาวรละลายหายไปหมดแล้วหรือยัง และความยาวรากฟันถาวร", "trigger"),
                _node(2, "เงื่อนไขที่ ‘ไม่ต้อง’ ใส่ Space Maintainer", "หน่อฟันถาวรสร้างราก ≥ 2/3 (Nolla stage ≥ 7) และไม่มีกระดูกคลุม หรือฟันถาวรกำลังโผล่พ้นเหงือก (< 6 เดือน)", "ข้อยกเว้น: หากสูญเสียฟันน้ำนมช้ากว่าปกติและหน่อถาวรเอียง/ขาดเนื้อที่มาก ให้ประเมิน Space Regainer แทน", "action"),
                _node(3, "เลือกชนิด Space Maintainer ตามตำแหน่งที่หายและฟันที่ขึ้นมาแล้ว", "แยก Unilateral vs Bilateral และสถานะการขึ้นของ Permanent 1st Molar (ซี่ 6)", "เลือกอุปกรณ์ที่ตรงข้อบ่งชี้เฉพาะจุด", "decision", [
                    {"condition": "หายฟันกรามน้ำนมซี่ที่ 1 (D) ข้างเดียว และมีฟัน E ปกติ", "outcome": "Band and Loop (หรือ Crown and Loop หากฟัน E ผุใหญ่)", "color": "#10b981"},
                    {"condition": "หายฟันกรามน้ำนมซี่ที่ 2 (E) ก่อนที่ Permanent 1st Molar (6) จะขึ้น", "outcome": "Distal Shoe Space Maintainer (ยื่นเข้าใต้เหงือกนำทาง Mesial surface ของซี่ 6 ไม่ให้ล้มมาข้างหน้า)", "color": "#f59e0b"},
                    {"condition": "ฟันล่าง: หาย 2 ข้าง (Bilateral) + ฟันหน้าถาวรล่างขึ้นครบแล้ว", "outcome": "Lower Lingual Holding Arch (LLHA) ใช้เฉพาะเมื่อ Mandibular Permanent Incisors ขึ้นแล้วเท่านั้น!", "color": "#38bdf8"},
                    {"condition": "ฟันบน: หาย 2 ข้าง (Bilateral) ในช่วง Mixed dentition", "outcome": "Nance Holding Arch (ปุ่มอะคริลิกยันเพดานหน้า) หรือ Transpalatal Arch (TPA)", "color": "#ec4899"},
                ]),
                _node(4, "ข้อควรระวังพิเศษของ Distal Shoe & LLHA", "ห้ามใส่ Distal Shoe ในเด็กที่มีภาวะหัวใจพิการเสี่ยง IE / ภูมิคุ้มกันบกพร่อง / เบาหวานคุมไม่ได้", "เนื่องจากใบมีดโลหะทะลุเยื่อบุเหงือกสร้างทางเชื่อมเรื้อรัง และห้ามใส่ LLHA ก่อนฟันตัดล่างขึ้นเพราะจะขวางการขึ้นของ Lingual buds", "warning"),
            ],
        }
    ],
    "Pedia-Restorative-Techniques": [
        {
            "id": "pedia-hall-ssc-pulp-pathway",
            "title": "Pediatric Caries & Crown Pathway: SSC, Strip Crown, SDF & Hall Technique",
            "pathway_type": "decision",
            "subtitle": "เปรียบเทียบ Conventional Stainless Steel Crown vs Hall Technique vs Silver Diamine Fluoride (SDF) vs Strip Crown",
            "reference": "AAPD Restorative Dentistry Guideline / Pediatric Dentistry Thai Guidelines",
            "steps": [
                _node(1, "จำแนกความลึกของรอยผุและสภาพเนื้อเยื่อโพรงประสาท", "ซักประวัติ Spontaneous pain / Night pain + ตรวจคลำหนอง/โยก + ฟิล์มรังสี Furcation radiolucency", "ฟันน้ำนมมีการอักเสบที่พื้น Furcation ได้ง่ายกว่าปลายรากเนื่องจากมี Accessory canals บริเวณ Furcation", "trigger"),
                _node(2, "เลือกรูปแบบการบูรณะและการรักษาคลองประสาท", "ดูจำนวนด้านที่ผุ พฤติกรรมเด็ก และอายุคาดหวังก่อนฟันหลุด", "เลือกการรักษาแบบอนุรักษ์หรือครอบฟันที่คุ้มค่าที่สุด", "decision", [
                    {"condition": "ผุหลายด้าน (≥ 2 ด้าน) / หลังทำ Pulpotomy / เด็กเสี่ยงผุสูง (High Caries Risk)", "outcome": "Stainless Steel Crown (SSC): ถอนฟันผุ กรอ Occlusal 1–1.5 mm + Proximal ผ่านจุดสัมผัส (ไม่กรอ Buccal/Lingual Ledge ยกเว้น Bulge)", "color": "#10b981"},
                    {"condition": "ฟันน้ำนมผุเข้าเนื้อฟัน ไม่มีอาการปวด ไม่มี Furcation lesion + เด็กกลัวการฉีดยา/กรอฟัน", "outcome": "Hall Technique (สวม SSC ปิดทับทันทีหลังใส่ Separator ไม่ต้องฉีดยา/ไม่กรอฟัน เพื่อตัดอาหารแบคทีเรีย) หรือ 38% SDF (หยุดผุ แต่ฟันดำ)", "color": "#38bdf8"},
                    {"condition": "ฟันหน้าบนน้ำนมผุหลายด้านหรือหลุดแตกขนาดใหญ่ ต้องการความสวยงาม", "outcome": "Celluloid Strip Crown (Composite Resin) หรือ Prefabricated Zirconia Crown", "color": "#ec4899"},
                ]),
                _node(3, "สรุปการรักษาโพรงประสาทฟันน้ำนม", "Pulpotomy (อักเสบเฉพาะ Coronal pulp, ห้ามเลือดใน 3–5 นาที ➔ MTA/Biodentine/Ferric Sulfate) vs Pulpectomy (ติดเชื้อลงราก ➔ อุด ZOE/Vitapex ละลายตามราก)", "ข้อห้ามทำ Pulpotomy/Pulpectomy: รากละลาย > 1/3, ฟันโยกจากพยาธิสภาพ, หน่อฟันถาวรถูกทำลาย, หรือมี Internal resorption กว้าง", "outcome"),
            ],
        }
    ],
    "Pedia-Young-Permanent-Teeth": [
        {
            "id": "pedia-mih-avulsion-young-perm",
            "title": "Management Pathway: Young Permanent Tooth Trauma, MIH & Immature Apex Preservation",
            "pathway_type": "decision",
            "subtitle": "Vital Pulp Therapy (Cvek Pulpotomy), Molar-Incisor Hypomineralization (MIH) & IADT Avulsion Protocol",
            "reference": "IADT Dental Trauma Guidelines (2020) / AAPD Pulp Therapy for Immature Permanent Teeth",
            "steps": [
                _node(1, "ฟันแท้ที่รากยังสร้างไม่เสร็จ (Immature Root / Open Apex)", "เป้าหมายสูงสุด: รักษาความมีชีวิตของ Radicular Pulp เพื่อให้เกิด Apexogenesis (รากยาวขึ้น + ผนังหนาขึ้น)", "หลีกเลี่ยงการทำ Root canal เต็มรูปแบบโดยไม่จำเป็นในฟันที่ยัง Vital", "trigger"),
                _node(2, "แนวทางการจัดการฟันแท้เด็กที่พบในข้อสอบบ่อย", "แยกตามสถานการณ์: Pulp Exposure จากอุบัติเหตุ vs หลุดทั้งซี่ (Avulsion) vs MIH", "ดำเนินการตามมาตรฐานสากลภายใน Golden period", "decision", [
                    {"condition": "Complicated Crown Fracture (ทะลุโพรงประสาทเล็ก-กลาง) รากยังเปิด", "outcome": "Partial (Cvek) Pulpotomy (ตัดเฉพาะ 2 mm ที่ผิวออก ล้าง NaOCl ห้ามเลือด ปิดด้วย MTA/Biodentine เพื่อ Apexogenesis)", "color": "#10b981"},
                    {"condition": "ฟันแท้หลุดทั้งซี่ (Avulsion): เก็บในนม/HBSS/น้ำลาย แห้ง < 60 นาที", "outcome": "จับที่ตัวฟัน (ห้ามขูดราก) ล้างน้ำเกลือ Replant ทันที + Flexible Splint 2 สัปดาห์ + Doxycycline/Amoxicillin + ตรวจรักษารากใน 7–10 วันหากรากปิด", "color": "#38bdf8"},
                    {"condition": "MIH (Molar-Incisor Hypomineralization): เคลือบฟันด่างขาว/น้ำตาล เสียวฟัน แตกง่าย (PEB)", "outcome": "ฟัน 6 + ฟันตัดแท้: ทาวานิชฟลูออไรด์/CPP-ACP, ป้องกันซึมด้วย RMGIC/GIC ชั่วคราว หรือ SSC หากแตกมาก; Resin infiltration (Icon) ช่วยด้านความงามฟันหน้า", "color": "#f59e0b"},
                ]),
                _node(3, "กรณีรากเปิดแต่ Pulp ตายแล้ว (Non-vital Open Apex)", "เลือก Apexification (สร้าง Apical barrier ด้วย MTA/Biodentine ทันที) หรือ Regenerative Endodontics (Revascularization: 2.5% NaOCl + Ca(OH)2/TAP + Blood clot + MTA)", "Regenerative Endodontics มีจุดเด่นเหนือ MTA plug ตรงที่ช่วยเพิ่มความหนาและยาวของผนังรากฟันได้จริง", "outcome"),
            ],
        }
    ],

    # =========================================================================
    # ORAL MEDICINE, DIAGNOSIS & RADIOLOGY (5)
    # =========================================================================
    "OralMed-Oral-Radiology-Physics": [
        {
            "id": "oralmed-radiology-slob-physics-pathway",
            "title": "Radiology Physics & Localization Pathway: kVp/mAs, Radiation Safety & SLOB Rule",
            "pathway_type": "decision",
            "subtitle": "ALARA Principle, Image Contrast vs Density, Deterministic vs Stochastic Effects & Clark's Rule",
            "reference": "White and Pharoah's Oral Radiology 8th ed. / ICRP Radiation Protection",
            "steps": [
                _node(1, "พารามิเตอร์กำเนิดรังสี (Exposure Factors)", "kVp (คุมพลังงาน/ทะลุทะลวง/Contrast) vs mAs (คุมปริมาณโฟตอน/Density/ความดำ)", "เพิ่ม kVp = รังสีทะลุดีขึ้น ➔ Gray scale กว้างขึ้น (Low contrast เหมาะดู Perio/กระดูก) | ลด kVp = High contrast (ขาว-ดำชัด เหมาะดู Caries)", "mechanism"),
                _node(2, "แยกผลทางชีวภาพของรังสีและการป้องกัน (ALARA)", "Deterministic Effect (มี Threshold เช่น Mucositis, Cataract, Osteoradionecrosis) vs Stochastic Effect (ไม่มี Threshold เช่น Cancer, Genetic mutation)", "การถ่ายรังสีทันตกรรมทั่วไปมีความเสี่ยงหลักแบบ Stochastic — ใช้ Rectangular collimator, F-speed/Digital sensor, Thyroid collar, Lead apron", "action"),
                _node(3, "การหาตำแหน่งวัตถุ 3 มิติด้วย SLOB Rule & Fault Troubleshooting", "SLOB: Same Lingual, Opposite Buccal (เมื่อขยับกระบอก X-ray ไปทาง Distal เงาเคลื่อนตามทิศกระบอก = อยู่ Lingual)", "วินิจฉัยความผิดพลาดของ Panoramic / Periapical", "decision", [
                    {"condition": "Panoramic: ฟันหน้าเล็กแคบเบลอ + กระดูกสันหลังซ้อนกลางภาพ", "outcome": "คนไข้ยืน ‘ล้ำหน้า Focal trough’ มากเกินไป (Too far forward)", "color": "#f59e0b"},
                    {"condition": "Panoramic: ฟันหน้ากว้างยืดบานออก + Condyle ตกขอบภาพ", "outcome": "คนไข้ยืน ‘ถอยหลังเกิน Focal trough’ (Too far back)", "color": "#38bdf8"},
                    {"condition": "Panoramic: Occlusal plane โค้งยิ้มมากเกิน / เงากระดูก Hyoid บังฟันล่าง", "outcome": "ก้มคางมากเกินไป (Chin tipped too far down) | หากเงยคางไป = Reverse smile + Hard palate บังรากฟันบน", "color": "#10b981"},
                ]),
                _node(4, "Digital Radiography & CBCT Justification", "ใช้ CBCT เฉพาะกรณีที่ 2D ให้ข้อมูลไม่เพียงพอ (Small FOV, High resolution สำหรับ Endo/Implant/Impacted nerve relation)", "ห้ามใช้ CBCT เป็น Routine screening เพื่อลดปริมาณรังสีสะสมของผู้ป่วย", "outcome"),
            ],
        }
    ],
    "OralMed-Vesiculobullous-Ulcers": [
        {
            "id": "oralmed-vesiculobullous-diagnostic-pathway",
            "title": "Diagnostic Decision Tree: Vesiculobullous & Autoimmune Ulcers (Pemphigus vs MMP vs OLP vs EM)",
            "pathway_type": "decision",
            "subtitle": "Nikolsky Sign + Histopathology (Intraepithelial vs Subepithelial Split) + Direct Immunofluorescence (DIF) ➔ Steroid Therapy",
            "reference": "Neville's Oral and Maxillofacial Pathology 5th ed. / Burket's Oral Medicine 13th ed.",
            "steps": [
                _node(1, "ประวัติและการตรวจแผลในช่องปาก (Clinical Red Flags)", "ถุงน้ำแตกง่ายกลายเป็นแผลถลอกเรื้อรัง / Desquamative gingivitis / มีรอยโรคผิวหนังหรือตา (Symblepharon) ร่วม", "ตรวจ Nikolsky's sign (ถูเยื่อเมือกปกติแล้วลอกหลุด — บวกใน PV และ MMP) ร่วมกับซักประวัติยา (Drug triggers)", "trigger"),
                _node(2, "ตัดชิ้นเนื้อส่งตรวจ H&E และ Direct Immunofluorescence (DIF)", "Biopsy ขอบแผลที่มี Epithelium ติดอยู่ (Perilesional tissue) ใส่ Formalin สำหรับ H&E และใส่ Michel's solution สำหรับ DIF", "แยกโรคจากตำแหน่งที่เนื้อเยื่อแยกตัว (Level of split) และรูปแบบของ IgG/C3/Fibrinogen", "decision", [
                    {"condition": "Pemphigus Vulgaris (PV): ตุ่มน้ำแตกไว อันตรายถึงชีวิต (Autoantibody ต่อ Desmoglein 1 & 3)", "outcome": "H&E: Intraepithelial split (Suprabasal acantholysis + Tzanck cells) | DIF: IgG/C3 ตาข่าย (Fish-net / Chicken-wire) รอบเซลล์", "color": "#ef4444"},
                    {"condition": "Mucous Membrane Pemphigoid (MMP): พบบ่อยเป็น Desquamative gingivitis + พังผืดตา (Symblepharon)", "outcome": "H&E: Subepithelial split (แผลตึงหนาไม่แตกง่าย) | DIF: Linear band of IgG & C3 ที่ Basement membrane zone", "color": "#f59e0b"},
                    {"condition": "Oral Lichen Planus (OLP): ลายเส้นขาว Wickham striae 2 ข้างแก้ม สมมาตร", "outcome": "H&E: Saw-tooth rete ridges + Band-like T-lymphocyte infiltrate + Civatte bodies | DIF: Shaggy Fibrinogen ที่ Basement membrane", "color": "#38bdf8"},
                    {"condition": "Erythema Multiforme (EM): เฉียบพลันหลังติดเชื้อ HSV หรือกินยา (Sulfa/NSAIDs)", "outcome": "Hemorrhagic crusting บนริมฝีปาก + Target/Iris lesions ที่ผิวหนัง", "color": "#ec4899"},
                ]),
                _node(3, "แนวทางรักษาหลัก (Corticosteroids)", "OLP/MMP เฉพาะที่: Topical Potent Steroid (Fluocinonide/Clobetasol) + ระวัง Candida แทรกซ้อน | PV/ตาอักเสบ: Systemic Prednisolone ร่วมกับแพทย์/จักษุแพทย์", "ตรวจยืนยันแผล HSV ก่อนให้ Steroid เสมอ และนัด Follow-up OLP เรื่อยๆ เพื่อเฝ้าระวัง Malignant transformation (~1–2% ใน Erosive type)", "outcome"),
            ],
        }
    ],
    "OralMed-Medically-Compromised-Endo-Renal": [
        {
            "id": "oralmed-endo-renal-corticosteroid-pathway",
            "title": "Systemic Management Pathway: Endocrine (DM/Thyroid/Adrenal) & Chronic Kidney Disease",
            "pathway_type": "decision",
            "subtitle": "HbA1c & Hypoglycemia Rescue, Thyrotoxicosis Epinephrine Limit, Rule of Twos vs Normal Care & Dialysis Heparin Window",
            "reference": "Little and Falace's Dental Management of the Medically Compromised Patient 10th ed.",
            "steps": [
                _node(1, "คัดกรองระบบต่อมไร้ท่อและไตก่อนทำฟัน", "ตรวจ FBS/HbA1c, ชีพจร/BP (Thyroid), ประวัติ Steroid, ระดับ eGFR และตารางฟอกไต (Hemodialysis days)", "ผู้ป่วย DM ควรนัดเช้า หลังทานอาหารและยาปกติ ไม่ควรทำฟันตอนท้องว่าง", "trigger"),
                _node(2, "แนวทางจัดการแยกตามโรคประจำตัว", "กำหนดข้อห้ามยา ยาชา และการปรับเวลาทำหัตถการ", "เลือกแนวทางที่ปลอดภัยเฉพาะโรค", "decision", [
                    {"condition": "เบาหวาน (DM): เกิดอาการเหงื่อแตก ใจสั่น มือสั่น สับสนระหว่างทำฟัน", "outcome": "Hypoglycemia Emergency (< 70 mg/dL): หยุดทำทันที! ให้ Rule of 15 (น้ำหวาน/กลูโคส 15 g กินถ้ารู้ตัว) หรือ 50% Dextrose IV / Glucagon IM ถ้าหมดสติ", "color": "#ef4444"},
                    {"condition": "โรคไตเรื้อรังฟอกเลือด (Hemodialysis): ต้องใส่ Heparin ระหว่างฟอก", "outcome": "ทำหัตถการที่มีเลือดออกใน ‘วันถัดไปหลังฟอกไต’ (Non-dialysis day) ห้ามวัด BP/เจาะเลือดแขนข้างที่มี AV Fistula + ปรับขนาด Amoxicillin/หลีกเลี่ยง NSAIDs & Tetracycline", "color": "#38bdf8"},
                    {"condition": "Hyperthyroidism ที่คุมไม่ได้ / Thyroid Storm Risk", "outcome": "ห้ามใช้ยาชาที่มี Epinephrine และ Retraction cord ชุบ Epinephrine ➔ ใช้ 3% Mepivacaine/Prilocaine Plain และส่งคุมไทรอยด์ก่อนทำ Elective", "color": "#f59e0b"},
                    {"condition": "ผู้ป่วยกิน Steroid เรื้อรัง (Secondary Adrenal Insufficiency Risk)", "outcome": "หัตถการทันตกรรมทั่วไป (Simple extraction) ส่วนใหญ่ ‘ไม่ต้อง’ เพิ่ม Double dose ให้คงขนาดยาเดิม + คุมปวดและลดเครียด (ให้เพิ่มเฉพาะ Major surgery/GA ตามแพทย์)", "color": "#10b981"},
                ]),
                _node(3, "RDU ข้อควรระวังในการสั่งยาในผู้ป่วยไต", "ผู้ป่วย CKD ระยะ 3–5 ห้ามจ่าย NSAIDs (Ibuprofen/Naproxen/Celecoxib) เพราะทำให้ Acute Kidney Injury", "เลือก Paracetamol เป็นยาแก้ปวดหลัก และปรับ Interval การให้ยาปฏิชีวนะที่ขับทางไต (เช่น Amoxicillin/Cephalexin) แต่ Clindamycin/Azithromycin ขับทางตับเป็นหลัก", "warning"),
            ],
        }
    ],
    "OralMed-Salivary-Gland-Pathology": [
        {
            "id": "oralmed-salivary-neoplasm-reactive-pathway",
            "title": "Diagnostic Pathway: Salivary Gland Disorders (Reactive, Obstructive & Neoplasms)",
            "pathway_type": "decision",
            "subtitle": "Mucocele vs Ranula, Sialolithiasis (Wharton's Duct) & Benign (Pleomorphic Adenoma) vs Malignant (Mucoepidermoid / Adenoid Cystic)",
            "reference": "Neville's Oral and Maxillofacial Pathology 5th ed.",
            "steps": [
                _node(1, "จำแนกกลุ่มอาการที่ต่อมน้ำลาย", "บวมเป็นๆ หายๆ ตอนกินอาหาร (Obstructive) vs ตุ่มใสสีฟ้าที่ริมฝีปากล่าง (Reactive) vs ก้อนโตช้าแข็ง/เจ็บ/หน้าเบี้ยว (Neoplasm)", "ตำแหน่งเกิดบ่งชี้ความน่าจะเป็นของมะเร็ง: ยิ่งต่อมน้ำลายขนาดเล็ก โอกาสเป็นมะเร็งยิ่งสูง (Minor salivary gland > Sublingual > Submandibular > Parotid)", "trigger"),
                _node(2, "การวินิจฉัยแยกกลุ่มโรคสำคัญ", "ตรวจคลำ (Bimanual palpation), Mandibular Occlusal Film และ Histopathology", "แยก Reactive/Obstructive ออกจาก Salivary Tumor", "decision", [
                    {"condition": "ตุ่มใสที่ริมฝีปากล่างหลังกัดปาก vs ก้อนบวมใต้ลิ้นสีฟ้า (Frog-belly)", "outcome": "Mucocele (ไม่มี Epithelial lining — Mucus extravasation, ตัดต่อมน้ำลายเล็กที่ป้อนทิ้ง) vs Ranula (รักษาด้วย Marsupialization หรือตัด Sublingual gland)", "color": "#38bdf8"},
                    {"condition": "ปวดบวมใต้คางทุกครั้งก่อน/ขณะเคี้ยวอาหารเปรี้ยว (Mealtime syndrome)", "outcome": "Sialolithiasis (80–90% เกิดที่ Submandibular/Wharton's duct เพราะท่อยาวต้านแรงโน้มถ่วงและน้ำลายข้นเป็นเมือก-ด่าง) ➔ ยืนยันด้วย Lower Occlusal Radiograph", "color": "#10b981"},
                    {"condition": "ก้อนโตช้า ไม่เจ็บ ไม่มีหน้าเบี้ยว ที่เพดานปากหลัง (Posterior lateral palate) หรือ Parotid", "outcome": "Pleomorphic Adenoma (Benign tumor พบบ่อยสุด! ต้องผ่าตัดออกพร้อมขอบเขตปกติกว้างพอเพื่อกันกลับมาเป็นซ้ำจาก Pseudopodia)", "color": "#f59e0b"},
                    {"condition": "ก้อนโตเร็ว/ปวด/แผลแตก/Facial nerve palsy หรือฟันชา", "outcome": "Mucoepidermoid Carcinoma (พบบ่อยสุดในมะเร็ง) หรือ Adenoid Cystic Carcinoma (เด่นเรื่อง Perineural invasion ปวดลามเส้นประสาท + Swiss-cheese histology)", "color": "#ef4444"},
                ]),
                _node(3, "Necrotizing Sialometaplasia (ระวังวินิจฉัยผิดเป็น SCC!)", "แผลหลุมลึกที่เพดานปากเกิดขึ้นฉับพลัน ปวดน้อย มักหายเองใน 4–10 สัปดาห์", "เกิดจาก Ischemia (เช่น ฉีดยาชาแรง/บาดเจ็บ) ใน Biopsy เห็น Squamous metaplasia ดูคล้าย SCC แต่ยังคงรูปโครงสร้าง Lobular architecture ของต่อมน้ำลาย", "warning"),
            ],
        }
    ],
    "OralMed-Odontogenic-Cysts-Tumors": [
        {
            "id": "oralmed-odontogenic-cyst-tumor-pathway",
            "title": "Radiographic & Pathologic Pathway: Odontogenic Cysts vs Tumors",
            "pathway_type": "decision",
            "subtitle": "Periapical / Dentigerous / OKC (Anteroposterior growth) vs Ameloblastoma (Soap-bubble) / Odontoma / CEOT",
            "reference": "Neville's Oral and Maxillofacial Pathology 5th ed. / WHO Classification 5th ed.",
            "steps": [
                _node(1, "วิเคราะห์ลักษณะภาพรังสี (Radiographic Analysis)", "ดูตำแหน่งสัมพันธ์กับ CEJ/ฟันคุด, ลักษณะขอบเขต (Corticated vs Unilocular/Multilocular) และการละลายรากฟัน (Root resorption)", "เช็กความสัมพันธ์กับฟันไม่ตาย vs ฟันตาย (เช่น Radicular cyst ฟันต้อง Non-vital เสมอ!)", "trigger"),
                _node(2, "แยกกลุ่ม Odontogenic Cysts & Aggressive Cysts", "แยก Dentigerous Cyst ออกจาก Odontogenic Keratocyst (OKC) จากรูปแบบการขยายตัว", "ตัดสินใจเจาะดูด (Aspiration) และตัดชิ้นเนื้อ (Biopsy)", "decision", [
                    {"condition": "เงาดำรอบ Crown ของฟันคุด (ติดพอดีที่ CEJ) ขยายออกด้านข้าง", "outcome": "Dentigerous (Follicular) Cyst (พบบ่อยอันดับ 2 รองจาก Radicular cyst; Enucleation พร้อมถอนฟันคุดโอกาสหายขาดสูง)", "color": "#10b981"},
                    {"condition": "เงาดำลามตามแนวยาวกระดูกขากรรไกรล่าง (Anteroposterior) โดยแทบไม่พองออกด้าน Buccolingual", "outcome": "Odontogenic Keratocyst (OKC): เจาะดูดได้สารข้นขาว (Keratin), อัตราเป็นซ้ำสูง, สัมพันธ์กับ Gorlin syndrome (NBCCS) หากพบหลายถุง", "color": "#f59e0b"},
                    {"condition": "เงาดำ Multilocular คล้ายฟองสบู่ (Soap-bubble/Honeycomb) + ละลายรากฟัน (Knife-edge root resorption)", "outcome": "Ameloblastoma (80% อยู่ Posterior mandible; Benign แต่รุกรานเฉพาะที่สูง — Histopath: Reverse polarization / Vickers-Gorlin, ต้องผ่าตัด Resection เผื่อขอบ 1–1.5 cm)", "color": "#ef4444"},
                    {"condition": "เงาขาวทึบคล้ายฟันเล็กๆ หลายซี่ (Compound) หรือก้อนทึบไม่เป็นรูป (Complex) ขวางฟันขึ้น", "outcome": "Odontoma (Hamartoma พบบ่อยสุดของ Odontogenic tumors — ตัดออกง่ายไม่ค่อยกลับมาเป็นซ้ำ)", "color": "#38bdf8"},
                ]),
                _node(3, "ข้อสังเกตสำคัญกลุ่มทึบแสงสลับดำ (Mixed RL-RO)", "Calcifying Epithelial Odontogenic Tumor (Pindborg: Driven-snow appearance + Amyloid) vs Adenomatoid Odontogenic Tumor (AOT: ฟันเขี้ยวบนหญิงอายุน้อย + Snowflake calcifications)", "AOT มักคลุมเลย CEJ ลงมาถึงรากฟัน ต่างจาก Dentigerous cyst ที่เกาะเฉพาะที่ CEJ", "outcome"),
            ],
        }
    ],

    # =========================================================================
    # OCCLUSION & TMD (4)
    # =========================================================================
    "TMD-Masticatory-Muscle-Anatomy": [
        {
            "id": "tmd-masticatory-muscles-biomechanics",
            "title": "Functional Anatomy Pathway: Muscles of Mastication & TMJ Disc Biomechanics",
            "pathway_type": "mechanism",
            "subtitle": "Elevator vs Protruder/Depressor Action + Role of Superior vs Inferior Lateral Pterygoid in Disc Mechanics",
            "reference": "Okeson's Management of Temporomandibular Disorders and Occlusion 8th ed.",
            "steps": [
                _node(1, "กลุ่มกล้ามเนื้อยกขากรรไกร (Mandibular Elevators)", "Masseter, Temporalis (Anterior/Middle fibers), Medial Pterygoid (ทำงานเป็น Sling ร่วมกับ Masseter)", "Temporalis Posterior fibers มีหน้าที่ดึงขากรรไกรถอยหลัง (Retrusion) ร่วมกับ Suprazyoid", "mechanism"),
                _node(2, "บทบาทแยกส่วนของ Lateral Pterygoid (ออกสอบสูงสุด!)", "แยกการทำงานของ Superior Head vs Inferior Head ในจังหวะอ้าปากและกัดฟัน", "ทั้งสองมัดไม่ได้ทำงานพร้อมกัน แต่สลับหน้าที่อย่างสมดุล", "decision", [
                    {"condition": "Inferior Lateral Pterygoid (เกาะ Neck of Condyle)", "outcome": "ทำงานขณะ ‘อ้าปากและยื่นคาง’ (Opening & Protrusion); หดตัวข้างเดียว ➔ คางเบี่ยงไป ‘ด้านตรงข้าม’ (Contralateral lateral excursion)", "color": "#10b981"},
                    {"condition": "Superior Lateral Pterygoid (เกาะ Articular Disc & Capsule)", "outcome": "ไม่ทำงานตอนอ้าปาก! แต่ทำงานขณะ ‘กัดเน้นและหุบปากผ่านแรงต้าน’ (Power stroke/Clenching) เพื่อรั้งแผ่นรองข้อต่อให้แนบกับ Condyle ตอนถอยกลับ", "color": "#38bdf8"},
                ]),
                _node(3, "การเชื่อมโยงพยาธิสภาพและการคลำตรวจ (Palpation & Referred Pain)", "อัมพาต CN V3 (Mandibular nerve) ทำให้เวลาอ้าปากคางเฉไป ‘ด้านที่มีพยาธิสภาพ’ (ด้านปกติผลัก)", "กล้ามเนื้อที่มี Myofascial Trigger Point ร้าวปวดฟันได้บ่อย: Masseter (ปวดฟันกรามบน/ล่าง), Temporalis (ปวดฟันหน้า/กรามน้อยบน และขมับ)", "outcome"),
            ],
        }
    ],
    "TMD-Mandibular-Kinetics-Posselt": [
        {
            "id": "tmd-posselt-envelope-pathway",
            "title": "Kinematics Pathway: Posselt's Envelope of Motion & Condylar Movements",
            "pathway_type": "mechanism",
            "subtitle": "Hinge Rotation (CR ➔ ~20–25 mm) vs Translation (25 ➔ Max Opening) & Working vs Non-Working Condyle Shift",
            "reference": "Okeson's Management of TMD & Occlusion 8th ed.",
            "steps": [
                _node(1, "กลไก 2 ระยะของการอ้าปาก (Two-Stage Condylar Motion)", "Lower Joint Compartment (Disc-Condyle): Rotation (1–20/25 mm) ➔ Upper Joint Compartment (Disc-Fossa): Translation (25–50 mm)", "จุดหมุน Terminal Hinge Axis (CR) เกิดในช่องข้อต่อล่างก่อน Condyle เลื่อนลงตาม Articular eminence", "mechanism"),
                _node(2, "วิเคราะห์กราฟ Posselt's Envelope of Motion (Sagittal Plane)", "แยกความสัมพันธ์ตำแหน่งทางคลินิกบนเส้นขอบของการเคลื่อนขากรรไกร", "เข้าใจความแตกต่างระหว่าง CR, CO/MI และ Rest Position", "decision", [
                    {"condition": "Centric Relation (CR): ตำแหน่ง Condyle อยู่หน้าสุด-บนสุด (Anterior-superior) ใน Glenoid Fossa ชิด Articular Disc", "outcome": "อ้างอิงที่ Condyle & Disc ไม่ขึ้นกับฟัน (Tooth-independent, Reproducible) เป็นจุดเริ่ม Terminal hinge path", "color": "#10b981"},
                    {"condition": "Centric Occlusion / Maximum Intercuspation (MI): ฟันสบกันแน่นสุด (~90% มี CR-MI slide เล็กน้อย 1–1.5 mm ไปหน้า)", "outcome": "อ้างอิงที่ฟัน (Tooth-determined) ใช้ปรับการสบฟันในงานบูรณะซี่เดียว/มีเสถียรภาพดี", "color": "#38bdf8"},
                    {"condition": "Postural Rest Position (VDR): กล้ามเนื้อพักตัวสมดุล", "outcome": "เกิด Freeway space / Interocclusal rest distance ~2–4 mm ก่อนขึ้นสู่ MI", "color": "#f59e0b"},
                ]),
                _node(3, "การเคลื่อนที่ด้านข้าง (Horizontal Bennett Movement)", "ขณะเยื้องขากรรไกรไปด้านขวา: Right Condyle = Working (Rotating + Immediate/Progressive Bennett shift) | Left Condyle = Non-working / Orbiting (เคลื่อนลง-หน้า-เข้าใน ➔ Condylar guidance angle & Bennett angle)", "Non-working contact (Balancing interference) เป็นความผิดพลาดที่อันตรายต่อ TMJ และกล้ามเนื้อมากที่สุด", "outcome"),
            ],
        }
    ],
    "TMD-Occlusal-Schemes-Splints": [
        {
            "id": "tmd-splint-and-occlusal-scheme-pathway",
            "title": "Therapeutic Decision Pathway: TMD Classification (DC/TMD) & Occlusal Splint Selection",
            "pathway_type": "decision",
            "subtitle": "Myalgia vs Disc Displacement (With/Without Reduction) ➔ Stabilization Splint vs Anterior Repositioning Splint",
            "reference": "Okeson 8th ed. / DC/TMD Diagnostic Criteria / ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
            "steps": [
                _node(1, "จำแนกสาเหตุ TMD ตาม DC/TMD (Muscular vs Arthrogenous)", "ประเมินเสียงคลิก (Clicking), อาการอ้าปากไม่ขึ้น (Closed Lock < 35 mm + เฉไปด้านป่วย), ปวดกล้ามเนื้อ", "แยก Disc Displacement with Reduction (DDwR: Reciprocal click ทั้งอ้า-หุบ) vs Disc Displacement without Reduction (DDwoR: เคยมีเสียงคลิกแล้วจู่ๆ เงียบและอ้าติด)", "trigger"),
                _node(2, "การเลือกเฝือกสบฟันและแนวทางรักษาแบบอนุรักษ์ (Conservative First!)", "หลักการ: Reversible therapy มาก่อน Irreversible occlusal adjustment/surgery เสมอ", "เลือกชนิด Splint ให้ตรงกับพยาธิสภาพและระยะเวลาที่ใส่", "decision", [
                    {"condition": "Masticatory Myalgia / Bruxism / ปวดข้อต่อทั่วไป (การรักษาหลัก 80–90%)", "outcome": "Stabilization Splint (Michigan/Permissive Flat-plane Full-arch Hard Acrylic): สบพร้อมกันทุกซี่ใน CR + Canine guidance แยกฟันหลังตอนเยื้องคาง", "color": "#10b981"},
                    {"condition": "DDwR ที่มีอาการปวดข้อต่อ/คลิกรบกวนมาก (ระยะสั้นกลางคืนเท่านั้น)", "outcome": "Anterior Repositioning Splint (ARS): ยื่นคางมาหน้าให้ Condyle รองรับใต้ Disc — ห้ามใส่ถาวร 24 ชม. เพราะเสี่ยง Posterior Open Bite!", "color": "#f59e0b"},
                    {"condition": "Acute DDwoR (อ้าปากค้างติดเฉียบพลัน < 1 สัปดาห์)", "outcome": "ประคบอุ่น + NSAIDs + Manual Manipulation ดึงคางลง-หน้าคลายแผ่นรองข้อต่อ + กายภาพบำบัด", "color": "#38bdf8"},
                ]),
                _node(3, "Occlusal Schemes ในงานทันตกรรม", "Mutually Protected / Canine Guidance (ฟันแท้/Fixed: ฟันหลังรับแรงกัด ฟันหน้านำเยื้องแยกฟันหลังพ้นแรงเฉือน) vs Bilateral Balanced Occlusion (Complete Denture เพื่อเสถียรภาพฐานฟันปลอม)", "หลีกเลี่ยงการใช้ Soft splint ในผู้ป่วยนอนกัดฟัน (Bruxism) เพราะกระตุ้นให้เคี้ยว/กัดแรงขึ้น", "outcome"),
            ],
        }
    ],
    "TMD-Orofacial-Pain-Neuropathic": [
        {
            "id": "tmd-neuropathic-pain-differential",
            "title": "Differential Diagnosis Pathway: Odontogenic vs Non-Odontogenic / Neuropathic Orofacial Pain",
            "pathway_type": "decision",
            "subtitle": "Trigeminal Neuralgia vs Glossopharyngeal Neuralgia vs Giant Cell Arteritis vs Atypical Odontalgia",
            "reference": "Okeson's Bell's Oral and Facial Pain 7th ed. / ICOP 2020",
            "steps": [
                _node(1, "กฎทองป้องกันการถอนฟันผิดซี่ (Avoid Unnecessary Endo/Exo!)", "เมื่อตรวจฟันไม่พบฟันผุลึก ไม่พบจุดกด/เคาะชัดเจน และ Local anesthesia block ที่ฟันไม่ได้ช่วยให้หายปวด 100%", "ต้องนึกถึง Non-odontogenic / Neuropathic / Vascular pain ก่อนลงมือกรอหรือรักษารากฟัน", "warning"),
                _node(2, "จำแนกลักษณะอาการปวด (Pain Quality & Trigger)", "ซักระยะเวลา (วินาที vs ชั่วโมง vs ตลอดวัน), ลักษณะ (ไฟช็อต vs ตุ้บๆ vs แสบร้อน), และ Trigger zone", "วินิจฉัยแยกกลุ่ม Neuropathic และ Neurovascular", "decision", [
                    {"condition": "ปวดแปลบเหมือนไฟช็อต รุนแรงมาก เป็นวินาที–ไม่เกิน 2 นาที ตามแขนง V2/V3 + มี Trigger zone แตะเบาๆ/ล้างหน้า", "outcome": "Trigeminal Neuralgia (Tic Douloureux) ➔ Drug of Choice: Carbamazepine (หรือ Oxcarbazepine); เช็ก CBC/Na+ และยีน HLA-B*1502 ในคนไทยก่อนเริ่มยา!", "color": "#ef4444"},
                    {"condition": "ปวดแปลบที่โคนลิ้น/ต่อมทอนซิล ร้าวเข้าหู กระตุ้นเวลากลืนน้ำลาย", "outcome": "Glossopharyngeal Neuralgia (CN IX)", "color": "#38bdf8"},
                    {"condition": "ผู้สูงอายุ (> 50 ปี) ปวดขมับร้าวกรามเวลาเคี้ยว (Jaw claudication) + สายตาพร่า + กดเจ็บหลอดเลือดขมับ", "outcome": "Giant Cell (Temporal) Arteritis ➔ ภาวะฉุกเฉิน! เจาะ ESR/CRP และส่งให้ Systemic Steroid ทันทีเพื่อป้องกันตาบอดถาวร", "color": "#f59e0b"},
                    {"condition": "ปวดตื้อๆ ต่อเนื่อง > 3 เดือน หลังถอน/รักษารากฟันแล้วหาพยาธิสภาพไม่พบ (Persistent Idiopathic Dentoalveolar Pain)", "outcome": "Atypical Odontalgia ➔ ห้ามรักษาราก/ถอนซ้ำ! รักษาด้วยยา Amitriptyline หรือ Gabapentin", "color": "#10b981"},
                ]),
                _node(3, "ข้อควรระวังเภสัชพันธุศาสตร์ในไทย (Carbamazepine Warning)", "ประเทศไทยแนะนำตรวจ HLA-B*1502 ก่อนให้ Carbamazepine เสมอ", "เพื่อป้องกันผื่นแพ้รุนแรง Stevens-Johnson Syndrome (SJS) / Toxic Epidermal Necrolysis (TEN)", "outcome"),
            ],
        }
    ],

    # =========================================================================
    # ORTHODONTICS (5)
    # =========================================================================
    "Ortho-Cephalometric-Analysis": [
        {
            "id": "ortho-ceph-interpretation-pathway",
            "title": "Diagnostic Workflow: Lateral Cephalometric Tracing & Skeletal-Dental Classification",
            "pathway_type": "decision",
            "subtitle": "SNA / SNB / ANB (Skeletal I/II/III) ➔ FMA / SN-MP (Vertical Pattern) ➔ U1-NA & IMPA (Dental Compensation)",
            "reference": "Proffit's Contemporary Orthodontics 6th ed. / Jacobson Radiographic Cephalometry",
            "steps": [
                _node(1, "ระบุจุด Landmarks และระนาบอ้างอิงพื้นฐาน", "Sella (S), Nasion (N), Point A (Subspinale), Point B (Supramentale), Porion-Orbitale (FH Plane), Gonion-Menton (MP)", "ตรวจสอบว่าจุด Po–Or ขนานพื้น (Frankfort Horizontal) เพื่อลดความคลาดเคลื่อน", "action"),
                _node(2, "แปลผลโครงสร้างกระดูกแนวหน้า-หลัง (AP) และแนวดิ่ง (Vertical)", "วิเคราะห์ ANB (ค่าปกติ ~2° ± 2°) ร่วมกับ Wits appraisal และ SN-MP / FMA", "แยกความผิดปกติของขากรรไกรบน (SNA ~82°) เทียบขากรรไกรล่าง (SNB ~80°)", "decision", [
                    {"condition": "ANB > 4° (โดย SNA > 84° หรือ SNB < 78°)", "outcome": "Skeletal Class II (บนยื่น หรือ ล่างถอย) ➔ เช็กมุมฟันตัด: มักพบฟันหน้าล่างยื่นชดเชย (IMPA > 95°)", "color": "#38bdf8"},
                    {"condition": "ANB < 0° (หรือติดลบ)", "outcome": "Skeletal Class III (บนยุบ/Maxillary deficiency หรือ ล่างยื่น/Mandibular prognathism) ➔ ประเมินการเติบโตหรือ Ortho-gnathic", "color": "#ef4444"},
                    {"condition": "SN-MP > 36° หรือ FMA > 30°", "outcome": "Hyperdivergent / High-angle (Vertical grower: หน้ายาว เสี่ยง Open bite หลีกเลี่ยงการ Extrude ฟันหลัง)", "color": "#f59e0b"},
                ]),
                _node(3, "วิเคราะห์ความลาดเอียงฟันตัด (Dental Compensation) & Soft Tissue", "U1-SN (~104°), U1-NA (22° / 4 mm), L1-NB (25° / 4 mm), IMPA (~90–95°), Nasolabial angle & E-line", "ความเข้าใจ Dental compensation ช่วยบอกได้ว่าเคสนั้นสามารถทำ Camouflage ได้หรือจำเป็นต้องผ่าตัดขากรรไกร (Orthognathic Surgery)", "outcome"),
            ],
        }
    ],
    "Ortho-Craniofacial-Growth": [
        {
            "id": "ortho-craniofacial-growth-pathway",
            "title": "Growth & Timing Pathway: Scammon's Growth Curves, Synchondroses & Orthopedic Intervention",
            "pathway_type": "mechanism",
            "subtitle": "Endochondral vs Intramembranous Ossification + Maxillary vs Mandibular Growth Timing & CVMI Staging",
            "reference": "Proffit's Contemporary Orthodontics 6th ed. / Enlow's Essentials of Facial Growth",
            "steps": [
                _node(1, "กลไกการเจริญเติบโตของกะโหลกและขากรรไกร", "Cranial Vault: Intramembranous (Neural curve โตเร็ว ~90% เมื่ออายุ 6 ปี) | Cranial Base: Endochondral (Synchondroses: Spheno-occipital ปิดช้าสุด ~อายุ 15–20 ปี)", "ขากรรไกรบน (Maxilla) เคลื่อนลงล่างและไปข้างหน้า (Downward & Forward) จากการเติบโตของ Sutures ด้านหลัง/บน ร่วมกับ Surface remodeling", "mechanism"),
                _node(2, "ประเมิน Growth Spurt (CVMI / Hand-Wrist) เพื่อกำหนดจังหวะรักษา", "แนวโน้มหยุดเติบโตตามลำดับระนาบ: Transverse (กว้างหยุดก่อน) ➔ Anteroposterior ➔ Vertical (สูงหยุดช้าสุด!)", "เลือกช่วงเวลาทองของการปรับกระดูก (Growth Modification)", "decision", [
                    {"condition": "Skeletal Class III จากขากรรไกรบนด้อยพัฒนา (Maxillary Deficiency) อายุ 7–9 ปี", "outcome": "รีบทำ Rapid Maxillary Expansion (RME) + Facemask (Protraction) ก่อน Circummaxillary sutures ประสานแน่น (~อายุ 10 ปี)", "color": "#10b981"},
                    {"condition": "Skeletal Class II จากขากรรไกรล่างถอย (Mandibular Deficiency)", "outcome": "รอทำ Functional Appliance / Headgear ในช่วง Peak Pubertal Growth Spurt (CS3–CS4) ให้ได้ผลสูงสุด", "color": "#38bdf8"},
                    {"condition": "Skeletal Class III จากขากรรไกรล่างยื่นแท้จริงหลังพ้นวัยโตแล้ว", "outcome": "หลีกเลี่ยง Functional/Chin cup เพราะไม่ได้ผลถาวร ➔ รอครบโตเต็มที่แล้วผ่าตัด (Orthognathic Surgery)", "color": "#ef4444"},
                ]),
                _node(3, "การปรับเปลี่ยนฟันช่วง Late Mixed Dentition", "Leeway Space (Nance's): ขากรรไกรบน ~0.9 mm/side | ขากรรไกรล่าง ~1.7 mm/side (รวม 3.4 mm)", "ความต่างขนาด C, D, E ใหญ่กว่า 3, 4, 5 สามารถใช้รักษาการซ้อนเกระดับน้อย-ปานกลางโดยใส่ Lingual Arch เก็บพื้นที่", "outcome"),
            ],
        }
    ],
    "Ortho-Space-Analysis-Appliances": [
        {
            "id": "ortho-mixed-dentition-appliances",
            "title": "Interceptive Orthodontics Pathway: Mixed Dentition Space Analysis & Early Crossbite Appliances",
            "pathway_type": "decision",
            "subtitle": "Tanaka-Johnston / Moyers Analysis ➔ Posterior Functional Crossbite (Quad-Helix/RME) vs Anterior Crossbite & Habit Breakers",
            "reference": "Proffit's Contemporary Orthodontics 6th ed. / แนวทางราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
            "steps": [
                _node(1, "วิเคราะห์เนื้อที่ในชุดฟันผสม (Mixed Dentition Space Analysis)", "วัดความกว้างรวม 4 ฟันตัดล่างถาวร (SI) ➔ Tanaka-Johnston: บน = (SI/2) + 11.0 mm | ล่าง = (SI/2) + 10.5 mm (ต่อ 1 ข้าง)", "เปรียบเทียบ Space Available กับ Space Required: ขาด > 4–5 mm ต่อข้างมักพิจารณา Extraction หรือ Arch expansion", "action"),
                _node(2, "แก้ไขความผิดปกติระยะฟันผสมที่ ‘ต้องรีบรักษา’ (Early Interception)", "ประเมินว่าเกิด Functional Shift (CR ≠ MI) หรือเสี่ยงทำลายเหงือก/กระดูกหรือไม่", "เลือกเครื่องมือให้ถูกกับชนิดปัญหาและตำแหน่งกระดูก/ฟัน", "decision", [
                    {"condition": "Posterior Crossbite ที่มี Mandibular Functional Shift (เช่น หน้าเบี้ยวตอนกัด)", "outcome": "รีบขยายขากรรไกรบนทันที (Quad-helix, W-arch หรือ Hyrax RME) เพื่อป้องกัน Asymmetric condylar growth", "color": "#10b981"},
                    {"condition": "Anterior Dental Crossbite (1–2 ซี่ มี Overbite ลึกพอสมควร + มี Space พอ)", "outcome": "ใช้ Tongue blade (อายุน้อยเพิ่งงอก), Inclined bite plane, Z-spring + Bite-opening Hawley (ถ้างับลึก)", "color": "#38bdf8"},
                    {"condition": "Anterior Open Bite จากดูดนิ้ว/ดุนลิ้น (Finger sucking / Tongue thrust)", "outcome": "Habit-breaking Appliance (Palatal Crib / Bluegrass) เมื่อเด็กพร้อมร่วมมือ และยังไม่อยู่ในวัย Growth หมด", "color": "#f59e0b"},
                ]),
                _node(3, "ผลข้างเคียงของ Serial Extraction & Timing", "Serial Extraction ทำเฉพาะ Class I ที่ซ้อนเกรุนแรง (> 10 mm) และมี Balanced soft tissue + มีหน่อ Premolar ครบ", "ห้ามทำ Serial Extraction ในผู้ป่วย Skeletal Class II/III รุนแรง หรือ Deep Bite มากเพราะจะยิ่งทำให้ Overbite ลึกขึ้น", "warning"),
            ],
        }
    ],
    "Ortho-Retention-Relapse": [
        {
            "id": "ortho-retention-biology-pathway",
            "title": "Post-Treatment Biology Pathway: Orthodontic Relapse, Supracrestal Fibers & Retention Protocol",
            "pathway_type": "mechanism",
            "subtitle": "PDL Reorganization (3–4 mo) vs Gingival Elastic Fibers (> 1 yr) ➔ Full-Time Retention & CSF Surgery",
            "reference": "Proffit's Contemporary Orthodontics 6th ed.",
            "steps": [
                _node(1, "สาเหตุทางชีววิทยาของการคืนกลับ (3 Major Causes of Relapse)", "1) PDL & Bone remodeling ยังไม่สมบูรณ์ 2) เส้นใยเหงือกยืดหยุ่น (Supracrestal gingival fibers) ดึงฟันหมุนกลับ 3) แรงลิ้น/แก้ม/การเติบโตต่อเนื่อง", "PDL ปรับตัวเสร็จใน ~3–4 เดือน แต่ Elastic supracrestal fibers ใช้เวลา > 1 ปี (บางส่วนไม่สลาย)", "mechanism"),
                _node(2, "กำหนดแผนการใส่ Retainer และหัตถการป้องกัน", "ปรับตามความเสี่ยงการคืนกลับของตำแหน่งฟันตั้งต้น", "เลือกชนิด Retainer และระยะเวลาสวมใส่", "decision", [
                    {"condition": "ผู้ป่วยจัดฟันเสร็จทั่วไปในระยะ 3–4 เดือนแรก", "outcome": "Full-time Retainer (ใส่ตลอด 24 ชม. ยกเว้นกินข้าว/แปรงฟัน) อย่างน้อย 3–6 เดือนแรก ➔ จากนั้นใส่เฉพาะกลางคืน (Part-time) ต่อเนื่องระยะยาว", "color": "#10b981"},
                    {"condition": "ฟันเคยหมุนบิดรุนแรง (Severe Rotation) มาก่อนจัด", "outcome": "ทำ Circumferential Supracrestal Fiberotomy (CSF) ก่อนถอดเครื่องมือเพื่อตัดใยเหงือกที่ยืดตึง + Fixed lingual retainer", "color": "#38bdf8"},
                    {"condition": "ปิดช่องว่างฟันหน้าห่าง (Midline Diastema) หรือคนไข้ปริทันต์สูญเสียกระดูก", "outcome": "แนะนำ Permanent / Bonded Lingual Fixed Retainer (และตัด Frenum หลังปิดช่องว่างเสร็จกรณี High frenum attachment)", "color": "#f59e0b"},
                ]),
                _node(3, "การเลือก Hawley vs Clear Overlay (Essix) Retainer", "Hawley Retainer: ทนทาน ยอมให้ฟันหลังสบ Settling ตัวเองได้ตามธรรมชาติ | Vacuum-formed (Essix): สวย คุมการหมุนฟันหน้าดี แต่ต้องดูแลความสะอาดสูงและไม่ช่วยให้ Settling", "Late lower incisor crowding เกิดได้ตามวัยแม้ในคนไม่เคยจัดฟัน จาก Late mandibular growth และแรงริมฝีปาก", "outcome"),
            ],
        }
    ],
    "Ortho-Anchorage-TADs": [
        {
            "id": "ortho-anchorage-tads-biomechanics",
            "title": "Biomechanics Pathway: Orthodontic Anchorage Types, TADs Placement & Force Levels",
            "pathway_type": "mechanism",
            "subtitle": "Optimal Orthodontic Force (Tipping vs Bodily vs Intrusion) ➔ Differential/Maximum Anchorage & TAD Safety Zones",
            "reference": "Proffit's Contemporary Orthodontics 6th ed.",
            "steps": [
                _node(1, "ระดับแรงทางทันตกรรมจัดฟันที่เหมาะสม (Optimal Force Concept)", "Tipping/Extrusion: 35–60 g | Rotation: 35–60 g | Bodily movement (Translation): 70–120 g | Intrusion: 10–20 g (เบาที่สุดเพื่อกัน Root resorption!)", "ใช้แรงเบาต่อเนื่อง (Light continuous force) เพื่อกระตุ้น Frontal resorption แทน Undermining resorption (Hyalinization) ที่ช้าและเสี่ยงรากละลาย", "mechanism"),
                _node(2, "จำแนกความต้องการ Anchorage & การประยุกต์ TADs", "Group A (Maximum: ฟันหลังห้ามเลื่อนหน้า > 25%) | Group B (Moderate: 50:50) | Group C (Minimum: ดึงฟันหลังมาหน้า > 75%)", "เลือกตัวช่วยควบคุม Anchorage ตามความซับซ้อน", "decision", [
                    {"condition": "ต้องการ Absolute Anchorage (เช่น ดึงฟันหน้าถอยเต็มที่ หรือ Intrude ฟันกรามบนที่ยื่นลงมา)", "outcome": "TADs (Miniscrew / Miniplate): ยึดเข้ากระดูกโดยตรง (Cortical bone anchorage, ปลอดภัยใน Attached gingiva หลังฟันกรามน้อยหรือ Palate)", "color": "#10b981"},
                    {"condition": "ต้องการ Moderate–High Anchorage โดยไม่ปักหมุด", "outcome": "Nance button, Transpalatal Arch (TPA), Headgear หรือใช้ En-masse vs Two-step retraction", "color": "#38bdf8"},
                    {"condition": "แรงดึงจากหมุด TADs ต่อฟันหน้าบนในการปิดช่องว่าง (En-masse)", "outcome": "ปรับ Power arm ความยาวให้แนวแรงผ่านใกล้ Center of Resistance (CRe) เพื่อคุม Torque ไม่ให้ฟันหน้างุ้ม (Tipping)", "color": "#f59e0b"},
                ]),
                _node(3, "Center of Resistance vs Center of Rotation & Side Effects", "CRe ของฟันรากเดียวอยู่ที่ ~1/3 ถึง 1/2 จากยอดกระดูกเบ้าฟันถึงปลายราก (ฟันหลายรากอยู่ที่บริเวณ Furcation)", "การให้แรงเดี่ยวที่ Bracket (ห่างจาก CRe) จะเกิด Moment ทำให้ฟันเอียง (Tipping) — ต้องใส่ Couple moment ใน Bracket เพื่อทำ Bodily movement", "outcome"),
            ],
        }
    ],

    # =========================================================================
    # COMMUNITY DENTISTRY & RESEARCH (3)
    # =========================================================================
    "Community-Epidemiological-Indices": [
        {
            "id": "community-dental-indices-pathway",
            "title": "Epidemiology & Diagnostic Screening: DMFT, CPI, Fluorosis Indices & Sensitivity/Specificity",
            "pathway_type": "decision",
            "subtitle": "WHO Oral Health Surveys 5th ed. Criteria + 2x2 Screening Matrix (PPV / NPV Prevalence Effect)",
            "reference": "WHO Oral Health Surveys: Basic Methods 5th ed. / กองทันตสาธารณสุข กรมอนามัย",
            "steps": [
                _node(1, "เลือกดัชนีทางทันตสาธารณสุขตามกลุ่มเป้าหมาย (WHO Standards)", "DMFT/dmft (ฟันผุ: ถาวรใช้ตัวใหญ่ 32/28 ซี่, น้ำนมใช้ตัวเล็ก 20 ซี่) | SiC Index (ค่าเฉลี่ย DMFT ของ 1/3 ที่ผุสูงสุด) | CPI (ปริทันต์)", "ระวังกฎ WHO 5th ed.: นับ M (Missing) จากโรคฟันผุเท่านั้นในคนอายุ < 30 ปี แต่คนอายุ ≥ 30 ปีให้นับรวมฟันที่หายจากทุกสาเหตุ (ยกเว้นไม่นับฟันคุด M8)", "action"),
                _node(2, "แยกแยะการใช้และเกณฑ์คะแนนดัชนีหลักในข้อสอบ", "ตรวจสอบเงื่อนไขพิเศษของ CPITN/CPI, Dean's Index และ Plaque/Gingival Indices", "ประเมินเกณฑ์คะแนนแต่ละดัชนีให้ถูกต้อง", "decision", [
                    {"condition": "CPI Modified (WHO 5th ed.): ตรวจทุกซี่ในเรื่อง Bleeding (0,1) และ Pocket (0,1=4–5mm, 2=≥6mm) ยกเว้น Index teeth 10 ซี่ในผู้ใหญ่", "outcome": "ไม่ใช้ Probe เดินหา Calculus เพื่อสรุป Code 2 แบบเก่าในบางตาราง แต่มักออก Code 0–4 ดั้งเดิม (0=Healthy, 1=BOP, 2=Calculus, 3=4–5mm, 4=≥6mm)", "color": "#10b981"},
                    {"condition": "Dean's Fluorosis Index (ประเมินฟันตกกระ)", "outcome": "เลือกให้คะแนนตามฟัน 2 ซี่ที่ได้รับผลรุนแรงมากที่สุด (Worst two teeth) และหาก 2 ซี่ไม่เท่ากัน ให้ลงคะแนนของซี่ที่ ‘น้อยกว่า’", "color": "#38bdf8"},
                    {"condition": "Silness & Löe (Plaque Index) vs Löe & Silness (Gingival Index)", "outcome": "ทั้งคู่ให้คะแนน 0–3: PI เน้นความหนาคราบจุลินทรีย์ที่ขอบเหงือก (ไม่ย้อมสี!) | GI Score 2 = มีเลือดออกเมื่อ Probe เบาๆ", "color": "#f59e0b"},
                ]),
                _node(3, "ตาราง 2x2 วัดความแม่นยำการคัดกรอง (Screening Validity)", "Sensitivity = TP/(TP+FN) [ไม่ขึ้นกับ Prevalence] | Specificity = TN/(TN+FP) | PPV = TP/(TP+FP) [สูงขึ้นเมื่อ Prevalence สูง!] | NPV = TN/(TN+FN)", "ข้อสอบชอบหลอก: Sensitivity และ Specificity เป็นคุณสมบัติของเครื่องมือ ‘ไม่เปลี่ยน’ ตามความชุกโรค แต่ PPV/NPV เปลี่ยนตาม Prevalence", "outcome"),
            ],
        }
    ],
    "Community-Health-Promotion-Ottawa": [
        {
            "id": "community-ottawa-charter-levels-prevention",
            "title": "Public Health Framework: Ottawa Charter, 3 Levels of Prevention & Caries Risk Strategies",
            "pathway_type": "decision",
            "subtitle": "5 Action Areas of Ottawa Charter + Primary / Secondary / Tertiary Prevention & Whole-Population vs High-Risk Strategy",
            "reference": "WHO Ottawa Charter (1986) / Burt & Eklund Dentistry, Dental Practice, and the Community",
            "steps": [
                _node(1, "จำแนก 5 แนวทางสร้างเสริมสุขภาพ (Ottawa Charter 1986)", "1) Build Healthy Public Policy (ออกกฎหมาย/ภาษีน้ำตาล/ห้ามขายน้ำอัดลมใน รร.) 2) Create Supportive Environments (น้ำประปาผสมฟลูออไรด์) 3) Strengthen Community Action 4) Develop Personal Skills (สอนแปรงฟัน) 5) Reorient Health Services (คลินิกเน้นป้องกันมากกว่าซ่อม)", "แยกให้ออกระหว่าง Policy (ระดับโครงสร้าง/กฎหมาย) vs Personal Skills (ให้ความรู้รายบุคคล)", "mechanism"),
                _node(2, "จำแนกระดับการป้องกันโรค (Leavell & Clark Levels of Prevention)", "กำหนดจุดยืนของกิจกรรมทันตสาธารณสุขในโรงเรียนและชุมชน", "เชื่อมโยงกิจกรรมเข้ากับระยะของการเกิดโรค", "decision", [
                    {"condition": "ยังไม่เกิดโรค (Pre-pathogenesis): ลดปัจจัยเสี่ยง/เพิ่มภูมิคุ้มกันเฉพาะ", "outcome": "Primary Prevention: การให้ทันตสุขศึกษา, เคลือบหลุมร่องฟัน (Pit & Fissure Sealant ในฟันปกติ), ทาฟลูออไรด์วานิชป้องกัน, ควบคุมอาหารหวาน", "color": "#10b981"},
                    {"condition": "เริ่มมีโรคระยะแรก/คัดกรองพบแล้ว (Early Diagnosis & Prompt Treatment)", "outcome": "Secondary Prevention: ตรวจคัดกรองรอยผุระยะแรก (White spot ➔ Fluoride/Sealant หยุดโรค), อุดฟัน, ขูดหินน้ำลาย, รักษารากฟัน", "color": "#38bdf8"},
                    {"condition": "โรคทำลายอวัยวะแล้ว ต้องหยุดความพิการ/ฟื้นฟูสภาพ (Disability Limitation & Rehabilitation)", "outcome": "Tertiary Prevention: ถอนฟันที่เป็นหนองรุนแรง, ใส่ฟันเทียม (RPD/CD/Implant) เพื่อคืนการบดเคี้ยว", "color": "#f59e0b"},
                ]),
                _node(3, "Geoffrey Rose: Population vs High-Risk Strategy", "Population Strategy (ลดความเสี่ยงทั้งประชากร เช่น ภาษีน้ำตาล/โรงเรียนปลอดน้ำอัดลม) ให้ผลลดโรคโดยรวมยั่งยืนที่สุดกว่า High-Risk (คัดแยกกลุ่มเสี่ยงมาทาเฉพาะราย)", "ทฤษฎีพฤติกรรม: Health Belief Model (HBM), Transtheoretical Model (Precontemplation ➔ Contemplation ➔ Preparation ➔ Action ➔ Maintenance), PRECEDE-PROCEED", "outcome"),
            ],
        }
    ],
    "Community-Study-Designs-Hypothesis": [
        {
            "id": "community-biostatistics-study-design-pathway",
            "title": "Research & Biostatistics Pathway: Study Design Hierarchy, Bias Control & Parametric vs Non-Parametric Tests",
            "pathway_type": "decision",
            "subtitle": "Case-Control (OR) vs Cohort (RR) vs RCT (NNT/Consort) & Choosing t-test / ANOVA / Chi-square / Mann-Whitney U",
            "reference": "Gordis Epidemiology 6th ed. / Altman Practical Statistics for Medical Research",
            "steps": [
                _node(1, "เลือกรูปแบบงานวิจัย (Hierarchy of Evidence)", "Descriptive (Cross-sectional: Prevalence only!) ➔ Analytic Observational (Case-Control: ย้อนหลัง, หา Odds Ratio เหมาะโรคหายาก | Cohort: ตามไปข้างหน้า, หา Relative Risk) ➔ RCT (Gold standard พิสูจน์เหตุ-ผล, Randomization ลด Confounding)", "ระวัง Recall bias เด่นใน Case-Control และ Loss to follow-up bias เด่นใน Cohort", "decision", [
                    {"condition": "ต้องการเปรียบเทียบค่าเฉลี่ย 2 กลุ่มอิสระ (ข้อมูลปกติ, Interval/Ratio)", "outcome": "Independent t-test (ถ้าข้อมูลเบ้/Ordinal ➔ Mann-Whitney U test)", "color": "#10b981"},
                    {"condition": "เปรียบเทียบค่าเฉลี่ย ≥ 3 กลุ่มอิสระ (เช่น เปรียบเทียบสีฟันหลังฟอก 3 ยี่ห้อ)", "outcome": "One-way ANOVA + Post-hoc test (ถ้าเบ้/ไม่ปกติ ➔ Kruskal-Wallis test)", "color": "#38bdf8"},
                    {"condition": "เปรียบเทียบสัดส่วน/ความสัมพันธ์ตัวแปรกลุ่ม (Categorical / Nominal)", "outcome": "Chi-square test (หรือ Fisher's Exact Test เมื่อ Expected count < 5 เกิน 20% ของเซลล์; ข้อมูลจับคู่ก่อน-หลัง ➔ McNemar)", "color": "#f59e0b"},
                    {"condition": "หาความสัมพันธ์เชิงเส้นของตัวแปรต่อเนื่อง 2 ตัว", "outcome": "Pearson Correlation (r, ข้อมูลปกติ) / Spearman Rank Correlation (เบ้/Ordinal) / Linear Regression (ทำนายค่า)", "color": "#ec4899"},
                ]),
                _node(2, "ความผิดพลาดทางสถิติและขนาดตัวอย่าง (Errors & P-value)", "Type I Error (α = 0.05): ปฏิเสธ H0 ทั้งที่จริงเป็นจริง (False positive) | Type II Error (β): ยอมรับ H0 ทั้งที่ผิด (Power = 1 - β ปกติใช้ ≥ 80%)", "Confidence Interval (95% CI): สำหรับ OR หรือ RR ถ้าช่วง 95% CI ‘คลุมเลข 1’ แปลว่าไม่มีนัยสำคัญทางสถิติ (p ≥ 0.05); สำหรับความต่างค่าเฉลี่ย ถ้าคลุม 0 = ไม่ต่าง", "outcome"),
            ],
        }
    ],

    # =========================================================================
    # DENTAL LAW, ETHICS & FORENSIC ODONTOLOGY (4)
    # =========================================================================
    "Law-Forensic-Odontology-DVI": [
        {
            "id": "law-forensic-dvi-age-estimation",
            "title": "Forensic Protocol: INTERPOL DVI Identification & Dental Age Estimation Methods",
            "pathway_type": "decision",
            "subtitle": "Primary Identifiers (DNA, Fingerprint, Dental Comparison AM vs PM) + Demirjian/Schour-Massler (<20 yr) vs Gustafson/Kvaal (Adult)",
            "reference": "INTERPOL Disaster Victim Identification (DVI) Guide / สถาบันนิติเวชวิทยา & ทันตแพทยสภา",
            "steps": [
                _node(1, "รวบรวมข้อมูลระบุตัวตนบุคคล (INTERPOL DVI Standards)", "Primary Identifiers (ใช้ยืนยันตัวบุคคลได้โดยลำพัง): 1) Dental Records (ฟันทนไฟ >1000°C) 2) Fingerprints 3) DNA", "Secondary Identifiers (ใช้สนับสนุนเท่านั้น เช่น รูปพรรณสัณฐาน เสื้อผ้า เอกสารติดตัว) — นำ Antemortem (AM: สีเหลือง) เทียบกับ Postmortem (PM: สีชมพู)", "action"),
                _node(2, "ประเมินอายุจากฟันแยกตามช่วงวัย (Dental Age Estimation)", "ความแม่นยำในเด็ก/วัยรุ่นสูงมาก เพราะอาศัยพัฒนาการสร้างหน่อและรากฟัน (ควบคุมโดยพันธุกรรมมากกว่าสิ่งแวดล้อม)", "เลือกวิธีประเมินให้เหมาะกับอายุผู้เสียชีวิต", "decision", [
                    {"condition": "ทารกในครรภ์ถึงอายุ ~14–20 ปี (ฟันกำลังสร้างหน่อและราก)", "outcome": "Schour & Massler Atlas, Moorrees หรือ Demirjian 8-stage method (แม่นยำสูงสุดบน OPG ของฟัน 7 ซี่ล่างซ้าย; ฟันคุดใช้ประเมินช่วงวัย 14–22 ปี)", "color": "#10b981"},
                    {"condition": "ผู้ใหญ่ (ฟันสร้างรากเสร็จหมดแล้ว > 21 ปี)", "outcome": "Gustafson's 6 Criteria (ต้องตัดฟันย้อมดู: Attrition, Periodontosis, Secondary dentin, Cementum apposition, Root resorption, Root translucency — แม่นยำสุดคือ Root translucency & Secondary dentin) หรือ Kvaal's radiographic method (ไม่ทำลายฟัน)", "color": "#38bdf8"},
                    {"condition": "เหตุการณ์ภัยพิบัติหมู่ (Mass Disaster) ต้องแยกศพไหม้ไฟ", "outcome": "บันทึก PM Odontogram พร้อมถ่ายภาพและ X-ray ฟันทุกซี่ เทียบกับประวัติทันตกรรม (AM)", "color": "#f59e0b"},
                ]),
                _node(3, "หลักเกณฑ์ Bite Mark & Exclusion Rule", "ใช้หลัก ‘Non-explainable discrepancy’ เพียง 1 จุดที่ขัดแย้งกันทางกายภาพ (เช่น AM มีฟันกรามซี่ที่หายถาวรใน PM ไม่ตรงกัน) สามารถ ‘ตัดออก (Exclude)’ ได้ทันที แต่การพบรอยอุดตรงกันต้องพิจารณาเอกลักษณ์เฉพาะ", "การระบุอายุด้วย Amino acid racemization ใน Dentin มีความแม่นยำสูงในห้องแล็บเฉพาะทาง", "outcome"),
            ],
        }
    ],
    "Law-Ethics-Code-Advertising": [
        {
            "id": "law-ethics-advertising-sanctions",
            "title": "Regulatory Pathway: ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณ การโฆษณา และบทลงโทษทางวินัย",
            "pathway_type": "decision",
            "subtitle": "หลักโฆษณาที่ทำได้ vs ต้องห้าม (โอ้อวด/ลดแลกแจกแถม/หมิ่นเพื่อนร่วมวิชาชีพ) + โทษทางจรรยาบรรณ 4 สถาน",
            "reference": "ข้อบังคับทันตแพทยสภา ว่าด้วยการรักษาจรรยาบรรณแห่งวิชาชีพทันตกรรม & พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
            "steps": [
                _node(1, "ขอบเขตการประชาสัมพันธ์สถานพยาบาล/ทันตแพทย์ที่ ‘ทำได้’", "แจ้งชื่อ สกุล วุฒิบัตร/อนุมัติบัตรที่ทันตแพทยสภารับรอง เวลาทำการ ที่ตั้ง เบอร์โทร อัตราค่าบริการขั้นต่ำ-สูงสุดที่ชัดเจน", "ต้องแสดงความจริง ไม่หลอกลวง ไม่สร้างความคาดหวังเกินจริง และผ่านการขออนุญาตโฆษณาตาม พ.ร.บ. สถานพยาบาล (สพส./สบส.)", "action"),
                _node(2, "การกระทำที่ผิดจรรยาบรรณและโฆษณาต้องห้าม", "ตรวจสอบข้อความสื่อออนไลน์ ภาพ Before-After รีวิว หรือโปรโมชันส่งเสริมการขาย", "แยกความผิดทางจรรยาบรรณออกเป็นหมวดชัดเจน", "decision", [
                    {"condition": "อ้างว่าเก่งกว่าคนอื่น / โอ้อวดผลรักษา 100% / แสดงภาพ Before-After เพื่อชักจูงเกินจริง", "outcome": "ผิดข้อบังคับห้ามโฆษณาโอ้อวดเกินจริง และชักจูงให้มารับบริการ", "color": "#ef4444"},
                    {"condition": "ทำโปรโมชัน ‘ลดราคา-แจกแถม-ชิงโชค-ผ่อน 0% ชวนเชื่อ’ เพื่อแย่งผู้ป่วย", "outcome": "ผิดจรรยาบรรณ (ห้ามลดแลกแจกแถมหรือแข่งขันทางธุรกิจทำลายเกียรติวิชาชีพ)", "color": "#f59e0b"},
                    {"condition": "วิจารณ์ทับถมงานรักษาของทันตแพทย์คนก่อนให้ผู้ป่วยฟังเสียหาย", "outcome": "ผิดจรรยาบรรณต่อผู้ประกอบวิชาชีพด้วยกัน — ต้องให้ความเห็นทางวิชาการตามความจริงอย่างสุภาพ", "color": "#38bdf8"},
                ]),
                _node(3, "ลำดับโทษทางจรรยาบรรณ 4 สถาน (มาตรา 39 พ.ร.บ. วิชาชีพทันตกรรม)", "คณะกรรมการทันตแพทยสภามีอำนาจวินิจฉัยชี้ขาด: 1) ว่ากล่าวตักเตือน 2) ภาคทัณฑ์ 3) พักใช้ใบอนุญาต (กำหนดไม่เกิน 2 ปี) 4) เพิกถอนใบอนุญาต", "ระหว่างถูกสั่งพักใช้/เพิกถอน หากยังแอบรักษาคนไข้ ถือเป็น ‘หมอเถื่อน’ มีโทษอาญาจำคุกไม่เกิน 3 ปี และ/หรือปรับตามมาตรา 28 & 50", "outcome"),
            ],
        }
    ],
    "Law-Dental-Nurses-MOPH-Scope": [
        {
            "id": "law-dental-auxiliary-scope-pathway",
            "title": "Legal Scope Pathway: ขอบเขตอำนาจเจ้าพนักงานทันตสาธารณสุข & ผู้ช่วยทันตแพทย์ vs ความผิดฐานประกอบวิชาชีพโดยไม่มีใบอนุญาต",
            "pathway_type": "decision",
            "subtitle": "มาตรา 28–29 พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 & ระเบียบกระทรวงสาธารณสุขว่าด้วยเจ้าพนักงานทันตสาธารณสุข",
            "reference": "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 (มาตรา 28, 29, 50) & ระเบียบกระทรวงสาธารณสุข ว่าด้วยบุคคลซึ่งกระทรวงฯ มอบหมายให้ประกอบวิชาชีพทันตกรรมในความควบคุมของทันตแพทย์",
            "steps": [
                _node(1, "หลักกฎหมายพื้นฐาน (มาตรา 28)", "ห้ามผู้ใดประกอบวิชาชีพทันตกรรมโดยมิได้ขึ้นทะเบียนและรับใบอนุญาตจากทันตแพทยสภา", "ข้อยกเว้นตามมาตรา 29: นักศึกษาทันตแพทย์ในความควบคุมอาจารย์, ผู้ปฐมพยาบาลฉุกเฉินโดยไม่หวังประโยชน์, และบุคคลที่กระทรวงสาธารณสุข/ทบวงการเมืองมอบหมายเป็นหนังสือ", "trigger"),
                _node(2, "จำแนกขอบเขตงานที่เจ้าพนักงานทันตสาธารณสุข (ทันตาภิบาล) ทำได้ ‘ภายใต้ความควบคุมของทันตแพทย์’", "ต้องทำเฉพาะในสถานบริการของรัฐ/ที่ระเบียบกำหนด และต้องมีคำสั่งหรืออยู่ใต้การควบคุม", "แยกงานที่อนุญาต vs งานต้องห้ามเด็ดขาด", "decision", [
                    {"condition": "งานป้องกัน-พื้นฐานที่อนุญาตตามระเบียบ (ภายใต้การกำกับของทันตแพทย์)", "outcome": "ขูดหินน้ำลาย ขัดฟัน ทาฟลูออไรด์ เคลือบหลุมร่องฟัน อุดฟันด้วยวิธีง่ายๆ (เช่น Atraumatic Restorative Treatment / Class I ไม่ซับซ้อน) ถอนฟันน้ำนม/ฟันแท้โยกตามข้อกำหนด", "color": "#10b981"},
                    {"condition": "เปิดคลินิกเอกชนทำเองโดยลำพัง หรือรักษารากฟัน ผ่าฟันคุด พิมพ์ปากทำฟันปลอม ติดเครื่องมือจัดฟัน", "outcome": "ผิดกฎหมายฐานประกอบวิชาชีพทันตกรรมโดยไม่ได้รับอนุญาต (มาตรา 28 โทษจำคุกไม่เกิน 3 ปี ปรับไม่เกิน 30,000 บาท หรือทั้งจำทั้งปรับ)", "color": "#ef4444"},
                    {"condition": "ทันตแพทย์จ้างผู้ช่วยทันตแพทย์ที่ไม่มีสิทธิ มาขูดหินน้ำลาย/อุดฟัน/ถอนฟันในคลินิกเอกชนแทนตน", "outcome": "ทันตแพทย์มีความผิดทางจรรยาบรรณ (ส่งเสริม/ยินยอมให้ผู้ไม่มีใบอนุญาตประกอบวิชาชีพ) + ผู้ช่วยมีความผิดอาญามาตรา 28", "color": "#f59e0b"},
                ]),
                _node(3, "หลักเกณฑ์ผู้ช่วยทันตแพทย์ (Dental Assistant)", "ไม่มีสิทธิทำหัตถการในช่องปากผู้ป่วยที่เป็นการรักษาโรคหรือขูด-อุด-ถอนแต่อย่างใด (มีหน้าที่ช่วยเตรียมเครื่องมือ ดูดน้ำลาย ยื่นอุปกรณ์ และดูแลความสะอาด/Sterile)", "การจัดฟันแฟชั่นโดยผู้ไม่มีใบอนุญาตผิดทั้ง พ.ร.บ. วิชาชีพฯ และประกาศ สคบ. เรื่องห้ามขายสินค้าลวดดัดฟันแฟชั่น", "outcome"),
            ],
        }
    ],
    "Law-Health-Acts-PDPA-Consent": [
        {
            "id": "law-consent-pdpa-medical-records-pathway",
            "title": "Legal Governance Pathway: Living Will (ม.12), Secrecy (ป.อ. ม.323), Informed Consent & PDPA",
            "pathway_type": "decision",
            "subtitle": "พ.ร.บ. สุขภาพแห่งชาติ (ม.7, 8, 12) + ประมวลกฎหมายอาญา มาตรา 323 + พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA ม.26)",
            "reference": "พ.ร.บ. สุขภาพแห่งชาติ พ.ศ. 2550 (ม.7, 8, 12) / ป.อาญา ม.323 / PDPA พ.ศ. 2562 / พ.ร.บ. สถานพยาบาล",
            "steps": [
                _node(1, "หลักความยินยอม & ความลับผู้ป่วย (Informed Consent & Confidentiality)", "มาตรา 8 พ.ร.บ. สุขภาพฯ: ต้องแจ้งข้อมูล วินิจฉัย แผนรักษา ทางเลือก ความเสี่ยง ค่าใช้จ่ายอย่างเพียงพอก่อนรักษา | ป.อาญา ม.323: ห้ามผู้ประกอบวิชาชีพเปิดเผยความลับผู้ป่วยอันน่าจะเกิดความเสียหาย (เว้นแต่โดยชอบด้วยกฎหมาย/ได้รับอนุญาต)", "ข้อยกเว้นฉุกเฉิน: หากผู้ป่วยเสี่ยงอันตรายถึงชีวิตเร่งด่วน แพทย์ช่วยชีวิตได้ทันทีโดยไม่ต้องรอ Consent ล่วงหน้า", "action"),
                _node(2, "วิเคราะห์ประเด็นกฎหมายเฉพาะกรณี (Consent / Living Will / PDPA / เวชระเบียน)", "ประเมินอายุ/ความสามารถ, หนังสือแสดงเจตนาวาระสุดท้าย (ม.12) และข้อมูลสุขภาพอ่อนไหว (Sensitive Data ม.26 PDPA)", "ตัดสินใจปฏิบัติให้ชอบด้วยกฎหมายทุกฉบับ", "decision", [
                    {"condition": "ผู้ป่วยทำหนังสือแสดงเจตนาไม่ประสงค์รับบริการสาธารณสุขเพื่อยืดการตายในวาระสุดท้าย (มาตรา 12 พ.ร.บ. สุขภาพฯ)", "outcome": "Living Will: บุคลากรสาธารณสุขที่ทำตามเจตนาโดยสุจริต ‘ไม่มีความผิด’ ทางแพ่ง-อาญา-จรรยาบรรณ (ยังต้องให้การดูแลบรรเทาทุกข์ Palliative Care)", "color": "#10b981"},
                    {"condition": "ผู้เยาว์ (< 20 ปี) หรือผู้ไร้ความสามารถ + การรักษาไม่เร่งด่วน", "outcome": "ต้องให้ผู้แทนโดยชอบธรรม (บิดา-มารดา/ผู้ปกครอง) ลงนาม Informed Consent (ยกเว้นผู้บรรลุนิติภาวะโดยสมรสอายุ ≥ 17 ปีบริบูรณ์)", "color": "#f59e0b"},
                    {"condition": "ผู้ป่วยขอสำเนาเวชระเบียน/ภาพรังสี (มาตรา 7 พ.ร.บ. สุขภาพฯ & PDPA)", "outcome": "สิทธิของผู้ป่วย: ต้องให้สำเนาข้อมูลสุขภาพของตนเอง (ปฏิเสธไม่ได้!) โดยคิดค่าธรรมเนียมสมเหตุสมผลได้ แต่ห้ามนำภาพ/ประวัติผู้ป่วยไปโพสต์สื่อหรือสอนโดยไม่ขอ Explicit Consent!", "color": "#38bdf8"},
                    {"condition": "ขอเปิดเผยข้อมูลคนไข้ HIV/ความลับทางคลินิกแก่บุคคลอื่นโดยไม่ยินยอม", "outcome": "ผิด ป.อาญา มาตรา 323 (โทษจำคุกไม่เกิน 6 เดือน ปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ) + ผิด PDPA ม.26 + ผิดจรรยาบรรณ", "color": "#ef4444"},
                ]),
                _node(3, "อายุการเก็บรักษาเวชระเบียน", "กฎกระทรวงฯ พ.ร.บ. สถานพยาบาล กำหนดให้เก็บเวชระเบียนไว้ไม่น้อยกว่า 5 ปี นับแต่วันสุดท้ายที่มารับบริการ", "หากมีแนวโน้มข้อพิพาททางแพ่ง/ละเมิด ควรเก็บสำรองไว้ ≥ 10 ปี และจัดการทำลายเอกสารอย่างปลอดภัยตาม PDPA", "outcome"),
            ],
        }
    ],
}
