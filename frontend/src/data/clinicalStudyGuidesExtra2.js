// Extended Masterclass Study Guides Part 2 (32 Topics: TMD 2, Pros 8, Pedia 4, OralMed 5, Ortho 5, Community 4, Law 4)
// Lazy-loaded by ClinicalStudyHub.jsx to complete 83/83 Must-Know Topic coverage.

export const CLINICAL_STUDY_GUIDES_EXTRA_2 = {
  // ── TMD & OCCLUSION (2) ───────────────────────────────────────────────────
  "TMD-Occlusal-Schemes-Splints": {
    title: "รูปแบบการสบฟันตามอุดมคติและเฝือกสบฟัน (Occlusal Schemes & Splints)",
    specialty: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    category: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    badgeColor: "#06b6d4",
    must_know_topics: [
      "Mutually Protected Occlusion (Canine Guidance) vs Group Function vs Bilateral Balanced",
      "Stabilization Splint (Michigan / Hard Acrylic Flat-Plane) vs ARS",
      "Anterior Repositioning Splint (ARS) Posterior Open Bite Risk",
      "DC/TMD: DDwR (Reciprocal Click) vs DDwoR (Closed Lock)"
    ],
    overview: "การเลือกรูปแบบการสบฟันสำหรับฟันธรรมชาติ งานฟันปลอมติดแน่น และฟันปลอมทั้งปาก รวมถึงข้อบ่งชี้และข้อควรระวังในการสั่งใช้ Occlusal Splint ชนิดต่างๆ",
    core_mechanism: "Stabilization Splint (Full-arch hard acrylic) ออกแบบให้ทุกซี่สบสม่ำเสมอเท่ากันใน CR และมี Canine guidance เพื่อแยกฟันหลังเวลาเยื้องคาง ลดการทำงานเกินของกล้ามเนื้อบดเคี้ยว (Muscle relaxation) และปกป้องฟันจากแรงนอนกัด (Bruxism) ส่วน Anterior Repositioning Splint (ARS) ยื่นคางมาหน้าเพื่อรองรับ Disc ใน DDwR ที่มีอาการปวดข้อต่อ แต่ห้ามใส่ถาวร 24 ชม. เพราะทำให้ฟันหลังงอกไม่สบเกิด Posterior Open Bite",
    matrix_headers: ["รูปแบบสบฟัน / ชนิดเฝือก", "ข้อบ่งชี้ทางคลินิกที่เหมาะสม", "ลักษณะการสบและข้อห้ามระวัง"],
    matrix_rows: [
      ["Mutually Protected Occlusion", "ฟันธรรมชาติและงาน Fixed Prosthodontics ทั่วไป (Full mouth rehab)", "ใน MI/CR: ฟันหลังรับแรงแนวแกน ฟันหน้าแตะเบา; เยื้องคาง/ยื่น: Canine & Anterior guidance แยกฟันหลังพ้นทันที (Posterior disclusion)"],
      ["Bilateral Balanced Occlusion", "Complete Denture (ฟันปลอมทั้งปาก) และ RPD ประสานฐานกว้าง", "มีแรงสบทั้งด้าน Working และ Non-working เพื่อป้องกันฐานฟันปลอมกระดกหลุดขณะบดเคี้ยว (ข้อห้ามในฟันธรรมชาติ!)"],
      ["Stabilization Splint (Hard Acrylic)", "การรักษามาตรฐานอันดับ 1 สำหรับ Masticatory Myalgia, Arthralgia และ Sleep Bruxism", "ใส่เต็มซุ้มฟัน ปิดผิวเรียบ สบพร้อมกันทุกซี่ใน CR + Canine rise (ส่วน Awake clenching + ทานของแข็ง เน้นปรับพฤติกรรมและงดอาหารกรอบแข็ง!)"],
      ["Anterior Repositioning Splint (ARS) & Oral Appliance (MAD)", "ARS: DDwR ที่ปวดข้อ/Lock เป็นพักๆ (ใส่เฉพาะกลางคืนระยะสั้น!) | MAD: Mild–Moderate OSA หรือ CPAP-intolerant (AASM/AADSM)", "ARS ห้ามใส่ 24 ชม. นานๆ (เสี่ยง Posterior open bite!); MAD ต้องติดตาม Occlusal/TMJ side effects เป็นระยะ"]
    ],
    pitfalls: [
      "ใส่ Anterior Bite Plane (คลุมเฉพาะฟันหน้า 6 ซี่) ตลอด 24 ชม. นานเกิน 2–4 สัปดาห์ ➔ ฟันหลังคู่สบจะงอกยื่น (Supraeruption) และฟันหน้าถูกกดจม เกิด Anterior open/posterior open bite ถาวร",
      "รีบทำ Irreversible Occlusal Adjustment (กรอปรับสบฟันถาวร) เป็นการรักษาอันดับแรกของ TMD — ผิดแนวทาง! ต้องเริ่มด้วย Conservative & Reversible therapy ก่อนเสมอ; ตรวจ Premature contact ให้ใช้ Shimstock (8–12 µm) และรอยสึก Abfraction เกิดจาก Excessive transverse force"
    ],
    pearl: "CD = Bilateral Balanced | ฟันแท้ = Mutually Protected (Canine guidance) | FMR = บันทึก CR | เช็กสบสูง = Shimstock | Stabilization Splint = Full-arch Hard Acrylic!",
    reference: "Okeson 8th ed.; AAOP Guidelines 7th ed. (2023); DC/TMD 2014; AASM/AADSM Oral Appliance Guideline; GPT-10 (2023)"
  },

  "TMD-Orofacial-Pain-Neuropathic": {
    title: "อาการปวดใบหน้าจากระบบประสาท (Trigeminal Neuralgia) และอาการปวดนอกระบบบดเคี้ยว",
    specialty: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    category: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    badgeColor: "#06b6d4",
    must_know_topics: [
      "Trigeminal Neuralgia (Electric Shock, ≤2 min, Trigger Zone) & Carbamazepine",
      "HLA-B*1502 Pharmacogenomic Screening & CYP3A4 Interactions (Amitriptyline)",
      "Giant Cell (Temporal) Arteritis (Jaw Claudication + ESR/CRP Emergency)",
      "PIFP / PDAP (Atypical Odontalgia), Myofascial Referred Pain & Allodynia vs Hyperalgesia"
    ],
    overview: "การวินิจฉัยแยกอาการปวดฟันแท้จริง (Odontogenic) ออกจากอาการปวดจากประสาทและหลอดเลือด (Non-odontogenic pain) เพื่อป้องกันการรักษารากฟันหรือถอนฟันโดยไม่จำเป็น",
    core_mechanism: "Trigeminal Neuralgia เกิดจากการกดทับรากประสาท CN V ด้วยหลอดเลือด (Demyelination ➔ Ephaptic cross-talk) ให้ปวดแปลบเหมือนไฟช็อตเป็นวินาที–ไม่เกิน 2 นาที (10/10) ตามแขนง V2/V3 เมื่อแตะ Trigger zone หรือขยับปากเคี้ยวอาหาร; ส่วน Giant Cell Arteritis ในหญิง ≥50 ปีเกิดหลอดเลือดขมับอักเสบทำให้ปวดตุ๊บขมับ + เส้นเลือดปูด + ปวดกรามตอนเคี้ยว (Jaw claudication) เสี่ยงตาบอดเฉียบพลันถ้าไม่รีบให้ Steroid",
    matrix_headers: ["กลุ่มอาการปวด", "อาการจำเพาะ (Pain Characteristics)", "การวินิจฉัยและยา/วิธีรักษาหลัก"],
    matrix_rows: [
      ["Trigeminal Neuralgia (Tic Douloureux)", "ปวดแปลบคล้ายไฟช็อต (10/10) เป็นวินาที–ไม่เกิน 2 นาที มักข้างเดียวที่ V2/V3 มี Trigger zone/ขยับปาก และ Refractory period", "First-line: Carbamazepine (หรือ Oxcarbazepine) **คัดกรอง HLA-B*1502 ในคนไทย (กัน SJS/TEN)** และระวัง CYP3A4 ลดระดับ Amitriptyline"],
      ["Giant Cell (Temporal) Arteritis", "อายุ ≥ 50 ปี ปวดตุ้บขมับ ปวดเมื่อเคี้ยว (Jaw claudication) กดเจ็บแนว Temporal artery ปูด + ตามัว/ไข้ต่ำ", "ภาวะฉุกเฉิน! เจาะ ESR/CRP สูงมาก ➔ ส่งต่อให้ High-dose Systemic Corticosteroid ทันทีเพื่อป้องกันตาบอดถาวร"],
      ["PIFP / PDAP (Atypical Odontalgia)", "ปวดตื้อๆ ต่อเนื่อง > 3 เดือนที่ฟัน/เบ้าฟันโดยตรวจฟัน/กล้ามเนื้อ/ข้อต่อปกติ (เดิมเรียก Psychogenic pain)", "ห้ามรักษารากซ้ำหรือถอนฟัน! แยก Cracked tooth/VRF ออกก่อน แล้วให้ TCA (Amitriptyline) หรือ Gabapentin/Pregabalin"],
      ["Allodynia, Hyperalgesia & Referred Pain", "Allodynia = สิ่งเร้าปกติไม่เจ็บกลับเจ็บ (เช่น น้ำเย็น) | Hyperalgesia = เจ็บเว่อร์เกินจริง | Referred Pain = Masseter ร้าวฟัน", "ทดสอบ Masseter palpation 5 วินาที / Diagnostic muscle block เพื่อแยกจากปวดฟันแท้ + ประคบความร้อน/ซักประวัติ Cardiac Angina"]
    ],
    pitfalls: [
      "รีบรักษารากฟันหรือถอนฟันให้ผู้ป่วยปวดฟันเรื้อรังที่ตรวจ Percussion/Cold/Radiograph ปกติ — ภาวะ PDAP หรือ Myofascial referred pain จะไม่หายเมื่อถอนฟัน!",
      "สับสน TN 10/10 นาน ~1 นาทีที่กระตุ้นเวลาขยับขากรรไกรว่าเป็น TMD — ต้องแยกจากระยะเวลาปวดสั้น ≤ 2 นาทีและความรุนแรงแบบไฟช็อต รวมถึงคัดกรอง HLA-B*1502 ก่อนให้ Carbamazepine"
    ],
    pearl: "ไฟช็อต V2/V3 ≤2 นาที + Trigger = Trigeminal Neuralgia ➔ Carbamazepine (เช็ก HLA-B*1502!) | ปวดขมับ+เส้นเลือดปูด+Jaw claudication = Temporal Arteritis | Allodynia = สิ่งเร้าปกติไม่เจ็บกลับเจ็บ!",
    reference: "Okeson's Bell's Oral and Facial Pain 7th ed.; AAOP Guidelines 7th ed. (2023); ICOP 2020 / กรมวิทยาศาสตร์การแพทย์"
  },

  // ── PROSTHODONTICS (8) ────────────────────────────────────────────────────
  "Pros-Jaw-Relations-Occlusion": {
    title: "ความสัมพันธ์ของขากรรไกร มิติแนวดิ่ง และฟันปลอมทั้งปาก (VDO, CR & Support)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "VDR (Rest) − VDO (Occluding) = Freeway Space (2–4 mm) & Ala-Tragus (Camper's) Line",
      "Sibilant Test (/s/ Closest Speaking Space 1–2 mm) & Excessive/Insufficient VDO Signs",
      "Primary vs Secondary Stress-Bearing Areas (Maxilla & Mandible)",
      "Complete Denture Occlusion (Bilateral Balanced, Lingualized & Monoplane)"
    ],
    overview: "หลักการปรับระนาบสบฟัน (Interpupillary & Ala-tragus line) การบันทึกความสูงใบหน้าแนวดิ่ง (Vertical Dimension) และตำแหน่งสัมพันธ์ขากรรไกร (CR ตาม GPT-10) ในผู้ป่วยไร้ฟัน รวมถึงพื้นที่รับแรงกดหลักของสันเหงือกบนและล่าง",
    core_mechanism: "ในผู้ป่วยไร้ฟัน ฟันปลอมทั้งปากอาศัยพื้นที่รับแรงกดหลัก (Primary stress-bearing area) ที่มีกระดูกทึบและเยื่อเมือกแน่นหนา: ขากรรไกรบนคือ ‘Hard palate (Posterolateral/horizontal slope) + Firm residual ridge crest’ ส่วนขากรรไกรล่างคือ ‘Buccal Shelf’ (กระดูก Cortex แนวราบตั้งฉากแรงกัดระหว่าง External oblique ridge กับสันเหงือก) ร่วมกับ Pear-shaped/Retromolar pad (ตาม Zarb Ch. 11) การปรับระนาบสบฟันบนด้านข้างอ้างอิงขนานกับ Ala-tragus line (Camper's line) ด้วย Fox plane และหา VDO ที่พอดีต้องเหลือ Freeway space 2–4 mm เมื่อพัก และมี Closest speaking space 1–2 mm เวลาออกเสียง /s/",
    matrix_headers: ["ตัวแปร / ตำแหน่งกายวิภาค", "ค่ามาตรฐานและบทบาทหลัก", "อาการผิดปกติที่ออกสอบบ่อย"],
    matrix_rows: [
      ["VDO สูงเกินไป (Excessive VDO)", "Freeway space < 2 mm ฟันสบกระแทกกันขณะพูด (/s/ คลิกดัง!)", "กล้ามเนื้อบดเคี้ยวเมื่อยล้า ใบหน้าตึงปิดปากไม่สนิท สันเหงือกละลายเร็ว และเจ็บใต้ฐานฟันปลอมทั้งแนว"],
      ["VDO ต่ำเกินไป (Insufficient VDO)", "Freeway space กว้างมาก (> 4–5 mm)", "หน้าดูแก่ มุมปากตกเกิด Angular Cheilitis (น้ำลายขังติดเชื้อ Candida/Staph) และแรงบดเคี้ยวลดลง"],
      ["ขากรรไกรบน: Support vs Relief", "Primary Support: Hard Palate (Horizontal/Posterolateral) & Firm Ridge Crest | Relief: Incisive papilla & Midpalatine raphe (Torus)", "Peripheral seal ที่สำคัญสุดด้านหลังบนคือ ‘Posterior Palatal Seal (Post-dam)’ บริเวณ Vibrating line (หน้าต่อ/ผ่าน Fovea palatinae 1–2 mm)"],
      ["ขากรรไกรล่าง: Support vs Relief", "Primary Support: ‘Buccal Shelf’ & Pear-shaped Pad (Retromolar pad) | Relief: Mylohyoid ridge, Crest (ถ้าคม/Flabby), Mental foramen, Genial tubercles", "หากสันเหงือกล่างละลายมากหรือต้องการลดแรงด้านข้างแต่คงความงาม: ใช้ Lingualized occlusion (ฟันหลังบน Anatomic สบกับฟันหลังล่าง Zero-degree)"]
    ],
    pitfalls: [
      "จำสลับ Stress-bearing area ของขากรรไกรล่าง: Crest ของสันเหงือกล่างมักแหลมคม/ละลายเร็ว จึงเป็นแค่ Secondary/Relief area! ‘Buccal Shelf’ ต่างหากที่เป็น Primary stress-bearing area",
      "สับสนบทบาทของ Fovea palatinae กับ Ala-tragus line: Fovea palatinae เป็นรูเปิดท่อต่อมน้ำลายย่อยใช้ช่วยหา Vibrating line (Posterior palatal seal) เท่านั้น ไม่ใช่จุดอ้างอิงปรับความสูง/ระนาบ Occlusal rim (ระนาบสบฟันบนด้านข้างต้องอ้างอิง Ala-tragus line!)"
    ],
    pearl: "VDR − VDO = 2–4 mm (Freeway Space) | พูดเสียง /s/ ฟันชนกัน = VDO สูงเกิน! | Primary Support ล่าง = Buccal Shelf | Lingualized = บน Anatomic + ล่าง 0°!",
    reference: "Zarb's Prosthodontic Treatment for Edentulous Patients 14th ed. & GPT-10 (2023)"
  },

  "Pros-RPD-Classification-Surveying": {
    title: "การจำแนก RPD (Kennedy & Applegate) และการสำรวจแนวใส่ (Dental Surveying)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "Kennedy Class I–IV + Applegate's 8 Rules (Always Most Posterior Area Governs!)",
      "Modification Spaces (จำนวนช่องว่างเสริม — Class IV ไม่มี Mod!)",
      "5 Parts of Ney Surveyor (Analyzing Rod, Carbon Marker, Undercut Gauges 0.01/0.02/0.03\", Wax Trimmer)",
      "4 Determinants of Path of Insertion (Guiding Planes, Retentive Areas, Interferences, Esthetics)"
    ],
    overview: "กฎการจัดจำแนกประเภท RPD ของ Kennedy ตามกฎ Applegate ทั้ง 8 ข้อ และการใช้เครื่อง Surveyor เพื่อกำหนดแนวใส่และถอด (Path of Insertion) ที่เหมาะสม",
    core_mechanism: "Applegate's Rule กำหนดว่าช่องว่าง ‘ด้านหลังสุด’ เป็นตัวกำหนด Class หลักเสมอ (ยกเว้นซี่ 8 ถ้าไม่นำมาทดแทนไม่ต้องนับ แต่ถ้านับซี่ 7 หรือฟันที่ถอนไปแล้วหาย ให้นับตามแผนการรักษาหลังถอนแล้ว) ช่องว่างอื่นที่เหลือเรียกว่า ‘Modification space’ โดยนับเฉพาะ ‘จำนวนช่องว่าง’ ไม่ใช่จำนวนซี่ฟัน ส่วนการทำ Surveying ใช้ Analyzing rod หา Guiding planes ความขนาน แล้วใช้ Undercut gauge (0.010\" สำหรับ Cast Cr-Co, 0.020\" สำหรับ Wrought wire/Flex) จุดตำแหน่งวางปลาย Retentive clasp arm",
    matrix_headers: ["หลักการจำแนก / อุปกรณ์ Surveyor", "เกณฑ์มาตรฐานที่ต้องจำแม่นยำ", "ตัวอย่างข้อสอบหลอกที่พบบ่อย"],
    matrix_rows: [
      ["Kennedy Class I / II / III / IV", "I: ท้ายอิสระ 2 ข้าง | II: ท้ายอิสระ 1 ข้าง | III: มีฟันหลักหัว-ท้าย (Tooth-bounded) | IV: ช่องว่าง ‘เดียว’ ข้าม Midline ด้านหน้า", "หากหาย 32–42 ข้าม midline (ช่องว่างหน้า) ‘ร่วมกับ’ ช่องว่างฟันกรามซี่ 36 หรือ 46 ให้เรียก Class III Mod 1 (ไม่ใช่ Class IV!)"],
      ["Applegate Rule สำหรับ Class IV", "Class IV ไม่มี Modification space เลย", "เพราะถ้ามีช่องว่างด้านหลังเพิ่มมาอีก ช่องว่างด้านหลังนั้นจะเป็นตัวกำหนด Class หลัก (กลายเป็น I, II หรือ III แทน)!"],
      ["ความลึก Undercut ของตะขอ (Retentive Arm)", "Cast Co-Cr Clasp: 0.010 inch (0.25 mm) | Cast Gold: 0.015\" | Wrought Wire Clasp: 0.020 inch (0.50 mm)", "การใช้ 0.020\" ใน Cast Co-Cr แข็งเกินไปจะทำให้หลุดยากและเกิดแรงบิดทำลายฟันหลัก (Overstressing abutment)"],
      ["Height of Contour & Tripoding", "Carbon marker วาด Survey line แยก Suprabulge (วาง Reciprocal arm/Rigid portion) กับ Infrabulge (วางเฉพาะปลาย 1/3 ของ Retentive tip!)", "ทำ Tripoding (จุดอ้างอิง 3 จุดนอกแนวฐาน) เพื่อบันทึกระนาบเอียงของ Cast บน Surveyor กลับมาเช็กได้แม่นยำ"]
    ],
    pitfalls: [
      "นับจำนวนซี่ฟันที่หายเป็นจำนวน Modification (เช่น หายซี่ 14, 15, 16 อยู่ติดกัน 1 ช่องว่าง ไม่ใช่ Mod 3 แต่เป็น Mod 1!)",
      "ลืมว่าถ้ามีแผนจะถอนฟันพยากรณ์โรคไม่ดีออก (Rule 2) หรือซี่ 8 ที่ไม่มีคู่สบไม่ต้องนำมาจัด Class (Rule 3 & 4) ให้จัดจำแนก ‘หลังจากวางแผนถอนเสร็จแล้ว’"
    ],
    pearl: "Class IV ห้ามมี Mod! | หลังสุดกำหนด Class | นับจำนวน ‘ช่องว่างเสริม’ ไม่ใช่นับจำนวนซี่ | Cast Co-Cr = 0.010\" | Wrought Wire = 0.020\"!",
    reference: "McCracken's Removable Partial Prosthodontics 13th ed."
  },

  "Pros-Fixed-Tooth-Preparation": {
    title: "ชีวกลศาสตร์การกรอฟันหลักสำหรับครอบฟันและสะพานฟัน (TOC, Retention & Finish Lines)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "Total Occlusal Convergence (TOC: Ideal 6° หรือ 10°–20° ทางคลินิก)",
      "Retention (ต้านหลุดตามแนวใส่) vs Resistance Form (ต้านแรงเฉือนเอียง — Wall Height & Diameter)",
      "Finish Lines: Feather-edge vs Chamfer (Cast/PFM Lingual) vs Heavy Chamfer/Radial Shoulder (All-Ceramic)",
      "Occlusal Reduction: Functional Cusp Bevel (1.5 mm) vs Non-Functional (1.0 mm) & Zirconia/E.max"
    ],
    overview: "หลักวิศวกรรมและชีววิทยาในการกรอเตรียมฟันหลัก เพื่อให้ครอบฟันยึดติดแน่นไม่หลุดง่าย ทนแรงเคี้ยวแนวเฉียง และขอบแนบสนิทโดยไม่ทำอันตรายต่อโพรงประสาทและเหงือก",
    core_mechanism: "Retention และ Resistance ไม่ได้เหมือนกัน: Retention ต้านแรงดึงหลุดตามแนวแกน (Axis of insertion) เพิ่มด้วย TOC ที่แคบ (~6°–16°), พื้นที่ผิวสูง และ Surface roughness ส่วน Resistance Form ต้านแรงกัดเอียงด้านข้าง (Tilting force) อาศัย ‘ความสูงผนังเทียบเส้นผ่านศูนย์กลางฟัน (H:W ≥ 0.4)’ และ Vertical grooves บนผนัง Proximal หากฟันกรามสั้นและฐานกว้าง (Molar กว้าง 10 mm สูง < 3 mm) แม้ TOC แคบก็หลุดได้ ต้องเติม Proximal retention/resistance grooves (ความสูงต้อง ≥ 4 mm ในฟันกราม!)",
    matrix_headers: ["ชนิดครอบฟัน / Finish Line", "ความหนาที่กรอ & Finish Line มาตรฐาน", "เหตุผลชีวกลศาสตร์ & ข้อระวัง"],
    matrix_rows: [
      ["Full Gold / Metal Crown", "Occlusal 1.5 mm (Functional cusp) / 1.0 mm (Non-func), Axial 0.5–0.8 mm | Chamfer Margin", "อนุรักษ์เนื้อฟันมากที่สุด แข็งแรงไม่แตกหัก ใช้ในฟันกรามที่ซ่อนและมีพื้นที่สบจำกัด"],
      ["PFM (Porcelain-Fused-to-Metal)", "ด้านที่เคลือบกระเบื้อง (Buccal/Occlusal): 1.5–2.0 mm (Shoulder / Heavy Chamfer) | ด้านโลหะ (Lingual): 0.8–1.0 mm (Chamfer)", "ต้องเว้นพื้นที่ด้าน Facial ให้ทั้ง Metal coping (0.3–0.5 mm) + Porcelain (1.0 mm+) มิฉะนั้นขอบจะโป่งหรือทึบ"],
      ["All-Ceramic (Lithium Disilicate E.max)", "Occlusal 1.5–2.0 mm, Axial 1.0–1.2 mm | Radial Shoulder หรือ Deep Chamfer (1.0 mm, มุมในโค้งมน 90–120°)", "ห้ามกรอมุมแหลม (Sharp internal line angle) หรือ Feather edge เพราะเซรามิกเปราะจะแตก!"],
      ["Monolithic Zirconia", "Occlusal 1.0–1.5 mm, Axial 0.5–0.8 mm | Light-Moderate Chamfer (0.5 mm)", "รับแรงอัดสูง กรอประหยัดเนื้อฟันได้ใกล้เคียงโลหะ และต้องขัด/เคลือบให้เรียบเนียนมากเพื่อกันการสึกของฟันคู่สบ"]
    ],
    pitfalls: [
      "ลืมกรอ Functional Cusp Bevel (45° ที่ Palatal cusp บน และ Buccal cusp ล่าง) ➔ ทำให้ความหนาครอบฟันตรงด้านรับแรงกัดบางเกินไปและทะลุแตกง่าย",
      "กรอเพิ่ม Proximal box หรือ Groove ด้าน ‘Buccal/Lingual’ ในฟันที่ขอบสั้นจนต้านแรงบิดไม่ได้ — จริงๆ ต้องวาง Groove บนผนัง ‘Mesial/Distal (หรือผนังตั้งฉากแนวแรงเคี้ยว B-L)’ เพื่อเพิ่ม Resistance form!"
    ],
    pearl: "Resistance Form สำคัญสุดใน Molar สั้น = Grooves & H ≥ 4 mm | All-Ceramic = มุมในโค้งมน Radial Shoulder/Deep Chamfer ห้าม Feather edge! | เผื่อ Functional Cusp 1.5 mm เสมอ!",
    reference: "Shillingburg's Fundamentals of Fixed Prosthodontics 4th ed. (Ch. 9)"
  },

  "Pros-Fixed-Provisional-Impression": {
    title: "การแยกเหงือก วัสดุพิมพ์ปากความละเอียดสูง และครอบฟันชั่วคราว (Tissue Mgmt & Elastomers)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "Double-Cord Retraction Technique & Hemostatic Agents (AlCl3 vs Ferric Sulfate)",
      "PVS (Addition Silicone) Latex Glove Sulfur Inhibition Trap",
      "Polyether Hydrophilicity & Rigidity vs Polysulfide vs Condensation Silicone",
      "Pouring Time Windows & Non-Eugenol Temporary Cements"
    ],
    overview: "ขั้นตอนคุมเลือด-น้ำเหลืองและเปิดร่องเหงือกให้เห็น Finish line รอบซี่ การเลือกวัสดุพิมพ์ Elastomeric ที่มีมิติเสถียรและการป้องกันปฏิกิริยารบกวนการเซ็ตตัว",
    core_mechanism: "PVS (Addition Silicone) เป็นวัสดุพิมพ์งาน Fixed ที่เสถียรและแม่นยำสูงสุด (เทปูน Type IV Die stone ซ้ำได้หลายครั้ง) แต่ Platinum catalyst ของ PVS ไวต่อกำมะถัน (Sulfur) ในถุงมือ Latex และน้ำยา Ferric sulfate บางตัวที่ไม่ได้ล้างออก ทำให้ขอบพิมพ์เหนียวไม่แข็งตัว อีกทั้ง PVS บางรุ่นปล่อยก๊าซ H2 หลังถอดจึงต้องรอ 30–60 นาทีก่อนเทปูน ส่วน Polyether ชอบน้ำดีมาก (Hydrophilic) แต่แข็งมาก ต้อง Block out undercut ก่อนพิมพ์",
    matrix_headers: ["วัสดุพิมพ์ Elastomer", "คุณสมบัติเคมี & เวลาเทปูน (Pouring Time)", "ข้อดีและกับดักสำคัญในข้อสอบ"],
    matrix_rows: [
      ["Addition Silicone (PVS)", "Reaction: Addition (ไม่มี Byproduct); รอ H2 ระเหย ~30–60 นาที (คงรูปนานเป็นสัปดาห์)", "ห้ามจับด้วยถุงมือ Latex (Sulfur ยับยั้ง Platinum catalyst ทำให้ไม่เซ็ต!) ➔ ต้องสวม Nitrile/Vinyl"],
      ["Polyether (เช่น Impregum)", "Hydrophilic ที่สุด (พิมพ์ดีแม้ชื้นเล็กน้อย), แข็งมาก (High modulus/rigidity); ห้ามแช่น้ำนาน!", "ดูดน้ำบวมหากเก็บชื้น; แข็งจนเสี่ยงหักฟันปริทันต์โยก/ดึงติดใต้ Pontic ต้อง Block out ด้วย Wax ก่อน"],
      ["Condensation Silicone", "ระเหย Ethyl alcohol เป็น Byproduct ➔ หดตัวเร็ว ต้องเทปูนทันที (< 15–30 นาที)", "เสถียรภาพต่ำกว่า PVS มาก ไม่นิยมเก็บข้ามวัน"],
      ["Irreversible Hydrocolloid (Alginate)", "Sol-gel crosslink Calcium alginate; เสียรูปเร็วจาก Syneresis (คายน้ำหด) และ Imbibition (ดูดน้ำบวม)", "ต้องห่อทิชชู่ชุบน้ำหมาด 100% humidity และเทปูนทันทีภายใน 10–15 นาที"]
    ],
    pitfalls: [
      "ยึดครอบชั่วคราวด้วย ZOE (ที่มี Eugenol) ทั้งที่นัดหน้าจะยึดครอบจริง/Inlay ด้วย Resin Cement ➔ Eugenol ซึมเข้าท่อเนื้อฟันยับยั้ง Free-radical polymerization ของ Resin cement (ต้องใช้ Non-Eugenol temp cement!)",
      "แช่วัสดุพิมพ์ Polyether ในน้ำยาฆ่าเชื้อนานเกิน 10 นาที ➔ บวมเสียมิติ (ให้พ่น Spray แล้วใส่ถุงปิดแทน)"
    ],
    pearl: "ถุงมือ Latex ห้ามแตะ PVS (Sulfur พัง Platinum!) | Polyether แข็ง-ชอบน้ำ-ห้ามแช่น้ำ | Alginate รีบเท <10 นาที | Temp cement ก่อน Resin ใช้ Non-Eugenol!",
    reference: "Shillingburg 4th ed. & Anusavice Phillips' Science of Dental Materials 13th ed."
  },

  "Pros-Dental-Implants": {
    title: "ทันตกรรมรากเทียม การยึดติดกับกระดูก และการออกแบบ (Implants & Peri-implantitis)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "3D Safety Distances (Tooth-Implant 1.5 mm, Implant-Implant 3.0 mm, IAN ≥ 2.0 mm)",
      "Primary vs Secondary Stability (Osseointegration Stability Dip สัปดาห์ที่ 2–4)",
      "Biological Differences: No PDL / No Shock Absorption / Circular Fibers",
      "Screw-Retained vs Cement-Retained & Mucositis vs Peri-implantitis"
    ],
    overview: "ชีววิทยาการยึดติดระหว่างไทเทเนียมกับกระดูกโดยตรง (Osseointegration) ระยะปลอดภัยจากฟันข้างเคียงและเส้นประสาท การออกแบบสบฟันและภาวะแทรกซ้อนรอบรากเทียม",
    core_mechanism: "ฟันธรรมชาติมี PDL (~28 µm การเคลื่อนแนวดิ่ง + Proprioception + Sharpey's fibers ตั้งฉาก) ส่วนรากเทียมยึดตรงกับกระดูก (~3–5 µm จาก Elastic bone deformation เท่านั้น) และเส้นใยคอลลาเจนรอบคอเทียมเรียงตัวขนานรอบวง (Circular/Parallel fibers ไม่มี Sharpey's fibers) จึงรับแรงเฉือนด้านข้างได้แย่และเชื้ออักเสบลงสู่กระดูกได้เร็วกว่าฟันธรรมชาติ",
    matrix_headers: ["ตัวแปรทางคลินิก / ภาวะ", "เกณฑ์ตัวเลขและชีววิทยา (Rules)", "การตัดสินใจและรักษา"],
    matrix_rows: [
      ["ระยะปลอดภัย 3 มิติ (Mesiodistal)", "Implant ถึงฟันข้างเคียง ≥ 1.5–2.0 mm | Implant ถึง Implant ≥ 3.0 mm (รักษากระดูกและ Papilla!)", "หากชิดฟันหรือชิดรากเทียมอื่นเกินไป กระดูกยอดซอกฟันจะละลายและเกิด Black triangle"],
      ["Screw-Retained (Ti-base) vs Cement-Retained (7th ITI 2023)", "Screw/Hybrid Ti-base: ถอดซ่อมได้, Interocclusal space น้อยทำได้ (4–5 mm), ใช้ Monolithic Zirconia ในฟันหลังลด Porcelain chipping", "Cement: สวยงามเมื่อแกนเอียงหน้า แต่เสี่ยง ‘Residual subgingival cement’ ก่อ Peri-implantitis สูง; เขตเหงือกบาง (< 2 mm) ใช้ Zirconia abutment!"],
      ["Peri-implant Mucositis vs Peri-implantitis", "Mucositis: เหงือกบวมแดง BOP+ โดย ‘ไม่มี’ Marginal Bone Loss | Peri-implantitis: BOP+/หนอง + มี Bone Loss", "Mucositis รักษาหายด้วย OHI + Plastic/Titanium curette; Peri-implantitis มักต้องเปิด Flap ทำ Bone decontamination/GBR"],
      ["Implant Protective Occlusion", "ลดขนาด Occlusal table, Cusp inclination ราบลง, Light centric contact ไม่มี Premature/Non-working contact", "ป้องกัน Screw loosening, Ceramic chipping และ Overload crestal bone loss"]
    ],
    pitfalls: [
      "กดแผล Probing รอบรากเทียมแรงเกินไปและใช้ Stainless steel scaler ขูดผิว Titanium Abutment — ต้องใช้ Non-metal (Plastic/Carbon fiber) หรือ Titanium curette เพื่อไม่ให้ผิวไทเทเนียมเป็นรอยกัก Plaque",
      "ใช้ Cement-retained crown ที่มี Margin ลึกใต้เหงือก > 2–3 mm โดยไม่ใส่ Retraction cord หรือ Custom abutment ที่ยก Margin ขึ้นมา ทำให้ขูดซีเมนต์ออกไม่หมดเกิด Peri-implantitis"
    ],
    pearl: "Tooth–Implant ≥ 1.5 mm | Implant–Implant ≥ 3.0 mm | Over-IAN ≥ 2.0 mm | 7th ITI 2023: Screw-retained Monolithic Zirconia บน Ti-base & Zirconia abutment ในเหงือกบาง!",
    reference: "7th ITI Consensus Conference (Lisbon 2023) & Misch's Contemporary Implant Dentistry 4th ed."
  },

  "Pros-RPD-Components-Biomechanics": {
    title: "ชีวกลศาสตร์โครงสร้าง RPD ระบบตะขอ RPI และแถบเชื่อมใหญ่ (RPD Biomechanics)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "Kennedy Class I/II Dual Support & Fulcrum Line Rotation",
      "RPI System (Mesial Rest + Proximal Plate + I-Bar 0.01\" @ Mid-B/MB) vs RPA",
      "Indirect Retainer (ต้านฐานฟันเทียมยกห่างสันเหงือก)",
      "Major Connectors: Lingual Bar (≥ 7–8 mm Space from Marginal Gingiva) vs Lingual Plate (< 7–8 mm, e.g. 6 mm)"
    ],
    overview: "การควบคุมคานงัดในฟันเทียมบางส่วนถอดได้ชนิดฐานท้ายอิสระ การเลือกใช้ระบบตะขอ RPI/RPA และหลักเกณฑ์เลือก Major connector ในขากรรไกรบน-ล่าง",
    core_mechanism: "ฐานฟันเทียมท้ายอิสระยุบตัวบนสันเหงือก (~0.4–2 mm) มากกว่าฟันหลักที่ยุบใน PDL (~0.02–0.1 mm) จึงเกิดการหมุนรอบ Fulcrum line ถ้าวาง Rest ด้าน Distal จะงัดฟันหลักล้มไปด้านหลัง (Distal tipping — Class I lever ทรงอันตราย!) แต่ระบบ RPI ย้าย Rest ไปด้าน Mesial คู่กับ I-bar (0.01\" undercut ที่ Mid-buccal/Mesiobuccal) เมื่อฐานกดลง I-bar จะหมุนเลื่อนลงล่างและไปหน้าพ้น Undercut อัตโนมัติ (Stress-releasing!) ส่วนการกระดกยกขึ้นด้านหลังต้านด้วย Indirect Retainer หน้าแกน Fulcrum line",
    matrix_headers: ["โครงสร้าง RPD", "ข้อบ่งชี้ / เกณฑ์มิลลิเมตรที่ออกสอบ", "กลไกป้องกันอันตรายต่อฟันหลักและเหงือก"],
    matrix_rows: [
      ["RPI System (Mesial Rest, Proximal Plate, I-bar)", "ใช้ใน Kennedy Class I/II ที่ Vestibule ลึก ≥ 5 mm และไม่มี Soft tissue undercut รุนแรง (I-bar เข้า 0.01\" ที่ Mid-B หรือ MB)", "เมื่อแรงบดกดท้ายอิสระ Rest ทำหน้าที่เป็นจุดหมุนด้านหน้า ➔ I-bar คลายตัวพ้นผิวฟัน (ไม่บิดราก!)"],
      ["RPA / Circumferential / Wrought-wire", "ใช้ใน Class I/II เมื่อ Vestibule ตื้น, Frenum เกาะสูง หรือมี Tissue undercut กีดขวางแขน I-bar", "ยังคงต้องวาง ‘Mesial Occlusal Rest’ คู่เสมอเพื่อรักษาหลัก Stress-release!"],
      ["Mandibular Major Connectors", "วัดด้วย Periodontal probe จากขอบเหงือกอิสระ (Marginal gingiva) ถึงพื้นปาก/Frenum: ถ้า ≥ 7–8 mm ใช้ Lingual Bar (ห่างขอบเหงือก 3–4 mm + แถบสูง 4 mm)", "ถ้าความสูงพื้นปาก < 7–8 mm (เช่น วัดได้ 6 mm) / คาดว่าต้องเพิ่มฟันหน้า / มี Lingual tori / ฟันหน้าโยก: เลือก ‘Lingual Plate’"],
      ["Maxillary Major Connectors & Indirect Retainer", "AP Palatal Strap (แข็งแรงและโล่งเพดานที่สุด), Palatal Plate (ฟันเหลือน้อย/Torus ไม่ได้ผ่า); ห่าง FGM ≥ 6 mm", "Indirect Retainer: วาง Cingulum/Occlusal rest ตั้งฉาก ‘หน้าแกน Fulcrum’ ให้ไกลที่สุด เพื่อต้านฐานหลังกระดกหลุด"]
    ],
    pitfalls: [
      "วาง Distal Rest ร่วมกับ Cast Circumferential Akers Clasp ที่มีปลายชี้มา Mesial ในเคส Class I โดยไม่ปรับแก้ ➔ เมื่อเคี้ยว ปลายตะขอจะดีดขึ้นงัดฟันหลักเหมือนคีมถอนฟัน!",
      "วัดพื้นที่ใส่ Lingual bar ผิดตำแหน่ง หรือเห็นโจทย์ให้ Floor of mouth ลึก 6 mm แล้วเผลอตอบ Lingual bar — ต้องวัดจาก ‘Marginal gingiva ถึง Lingual frenum/พื้นปาก’ และถ้าได้ 6 mm (< 7–8 mm) ต้องตอบ ‘Lingual Plate’ เสมอ!"
    ],
    pearl: "Class I/II ใช้ ‘Mesial Rest + 0.01\" Mid-B I-bar (RPI)’ เพื่อปลด Undercut | พื้นปากล่าง < 7–8 mm (เช่น 6 mm) ใช้ Lingual Plate | บนห่างขอบเหงือก 6 mm ล่าง 3–4 mm!",
    reference: "McCracken's Removable Partial Prosthodontics 14th ed."
  },

  "Pros-Pontic-Design": {
    title: "การออกแบบฟันลอยและหลักการรับแรงสะพานฟัน (Pontic Design & Ante's Law)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "Ante's Law (PDL Area of Abutments ≥ Pontics) & Crown-to-Root Ratio",
      "Modified Ridge Lap (Esthetic Standard) vs Ovate (Socket Esthetics) vs Sanitary/Hygienic",
      "Why Full Ridge Lap / Saddle is Contraindicated",
      "Pier Abutment & Non-Rigid Connector Placement"
    ],
    overview: "การเลือกแบบ Pontic ให้สมดุลระหว่างความสวยงาม การออกเสียง และการสอดไหมขัดฟันทำความสะอาด รวมถึงหลักประเมินฟันหลักของสะพานฟัน (Ante's Law & Pier Abutment)",
    core_mechanism: "Ante's Law ระบุว่าผลรวมพื้นที่เยื่อปริทันต์ (PDL surface area) ของฟันหลักต้องมากกว่าหรือเท่ากับฟันที่หายไป (Crown-Root ratio ที่ดีที่สุดคือ 1:2, ยอมรับได้ ≥ 1:1) ด้านสัมผัสเหงือกของ Pontic ห้ามเว้าโค้งทับสันเหงือก (Saddle) เพราะไหมขัดฟันทำความสะอาดร่องเว้าไม่ได้ สำหรับ Modified Ridge Lap ผิวด้าน Buccal แตะเหงือกพอสวยงามและด้าน Lingual/Tissue surface โค้งนูน (Convex) ทั้งสองทิศให้ไหมขัดฟันรูดผ่านได้หมด",
    matrix_headers: ["ชนิด Pontic / ปัจจัยฟันหลัก", "ลักษณะสัมผัสสันเหงือก (Tissue Surface)", "ข้อบ่งชี้ & ข้อห้ามใช้สำคัญ"],
    matrix_rows: [
      ["Modified Ridge Lap Pontic", "ผิวสัมผัสโค้งนูน (Convex) แตะเบาๆ เฉพาะครึ่งด้าน Buccal เพื่อหลอกตา; ด้าน Lingual โค้งเปิดทำความสะอาดง่าย", "Gold Standard สำหรับฟันหน้าและฟันกรามน้อย (รวมฟันกรามบนที่โชว์เวลาพูดยิ้ม)"],
      ["Ovate Pontic", "ฐานกลมมนจมลงไปในเบ้าเหงือก/สันเหงือกที่ตกแต่งไว้ (~1–2 mm) ดูเหมือนฟันงอกออกจากเหงือกจริง", "Esthetic zone ความงามสูงสุดหลังถอนฟันทันที (ต้องมี Tissue หนาพอและคนไข้ขยันใช้ Superfloss สูง!)"],
      ["Sanitary / Hygienic (Conical / Bullet)", "ลอยพ้นสันเหงือก ≥ 2 mm ไม่มีส่วนสัมผัสเนื้อเยื่อเลย ทำความสะอาดง่ายสุด", "ใช้เฉพาะ ‘ฟันกรามล่าง’ ที่ไม่เห็นเวลายิ้ม (Non-esthetic posterior mandible) ที่มีระยะ Interarch สูงพอ"],
      ["Ridge Lap (Saddle) & Pier Abutment", "Saddle: เว้า (Concave) คร่อมทั้ง B และ L — **ห้ามใช้เด็ดขาด** เพราะอักเสบเรื้อรัง | Pier Abutment: มีช่องว่างทั้งหน้าและหลังฟันหลักกลาง", "ใน Pier abutment ถ้าทำสะพานแข็งชิ้นเดียว ฟันหลักกลางทำตัวเป็น Fulcrum งัดฟันหน้าหลุด ➔ ใส่ Stress-breaker (Non-rigid connector) ที่ด้าน Distal ของฟันหลักกลาง!"]
    ],
    pitfalls: [
      "กดฐาน Modified Ridge Lap แน่นลงบนสันเหงือกจนเหงือกซีด (Blanching) — ต้องให้สัมผัสแบบ Zero-pressure (Passive contact) ไม่อย่างนั้นเนื้อเยื่อจะอักเสบเป็นแผลกดทับ",
      "วาง Non-rigid connector (Keyway) ผิดด้านในเคส Pier abutment — Keyway (ตัวเมีย/Mortise) ต้องอยู่บนด้าน ‘Distal ของฟันหลักกลาง (Pier abutment)’ เพื่อให้แรงเคี้ยวฟันหลังกดให้แกน (Tenon) แน่นเข้าเบ้า ไม่หลุดถอน!"
    ],
    pearl: "หน้า/สวย = Modified Ridge Lap (แตะเฉพาะ Buccal) | หลังล่างไม่โชว์ = Sanitary ลอย 2 mm | Saddle เว้า = ห้ามใช้! | Pier Abutment วาง Non-rigid connector ที่ Distal ของตัวกลาง!",
    reference: "Shillingburg's Fundamentals of Fixed Prosthodontics 4th ed."
  },

  "Pros-Fixed-Cements-Post-Core": {
    title: "การบูรณะเดือยฟัน แกนฟัน Ferrule Effect และซีเมนต์ยึด (Post-Core & Cements)",
    specialty: "ทันตกรรมประดิษฐ์",
    category: "ทันตกรรมประดิษฐ์",
    badgeColor: "#38bdf8",
    must_know_topics: [
      "Purpose of Post (Retain Core Only — Does NOT Strengthen Root!)",
      "Ferrule Effect (สูง ≥ 1.5–2.0 mm, หนา ≥ 1.0 mm 360°) & Apical Seal ≥ 4–5 mm GP",
      "Fiber Post vs Custom Cast Post & Core",
      "Cement Pairing: Resin vs RMGIC vs Glass vs Zirconia (HF+Silane vs Al2O3+MDP)"
    ],
    overview: "ข้อบ่งชี้ที่แท้จริงของการใส่เดือยฟัน เงื่อนไข Ferrule Effect ที่ป้องกันรากแตกร้าว และการจับคู่ Luting Cement กับครอบฟันแต่ละชนิดอย่างถูกต้อง",
    core_mechanism: "เดือยฟันไม่ได้เสริมความแข็งแรงให้รากฟัน แต่ยิ่งกรอขยายยิ่งทำให้รากอ่อนแอ! จึงใส่เฉพาะเมื่อเนื้อฟันเหนือเหงือกเหลือไม่พอจับ Core buildup ตัวป้องกันรากแตกที่แท้จริงคือ ‘Ferrule’ (ปลอกครอบฟันโอบล้อมเนื้อฟันธรรมชาติ 360° สูง ≥ 1.5–2.0 mm หนา ≥ 1 mm) และต้องเหลือ Gutta-percha ปลายรากไว้ 4–5 mm เสมอ เพื่อคง Apical seal",
    matrix_headers: ["องค์ประกอบ / วัสดุยึด", "ค่ามาตรฐานและหลักเลือกใช้", "กลไกการยึด & ข้อระวังสำคัญ"],
    matrix_rows: [
      ["กติกา Post Length & Width", "ความยาว ≥ 2/3 ราก หรือ ≥ ความยาวครอบฟัน (โดยต้องเหลือ GP ปลายราก ≥ 4–5 mm เสมอ!); กว้าง ≤ 1/3 เส้นผ่านศูนย์กลางราก", "หากฟันสั้นจนเหลือ GP < 4 mm จะเสีย Apical seal! ต้องยอมสั้นกว่าหรือพึ่ง Ferrule + Adhesiveแทน"],
      ["Fiber Post vs Cast Post & Core", "Fiber: Elastic modulus ใกล้ Dentin (~20 GPa) ถ้าล้มเหลวมักหลุดหรือหักระดับคอฟัน ซ่อมได้ | Cast Alloy: แข็งมาก (~200 GPa) เสี่ยงเกิด Vertical Root Fracture รุนแรง", "Cast Post เลือกใช้เมื่อคลองรากแบนรีไม่กลม หรือต้องเปลี่ยนแนวแกนหลายซี่ แต่ Fiber Post ดีกว่าในฟันหน้าที่มี Ferrule พอ"],
      ["Glass-Ceramic (e.max) vs Zirconia vs Alloy Bonding", "e.max (Silica-based): กัด Hydrofluoric acid (20s) + ทา Silane ➔ Resin Cement | Zirconia & Base Metal: ไม่กัด HF! พ่นทราย 50 µm Al2O3 + ทา 10-MDP Primer | Noble/Gold Alloy: พ่นทราย Al2O3 + Sulfur/Thiol primer (VBATDT, MTU-6)", "ถ้าครอบ Zirconia เหลือ Retentive preparation (TOC ดี สูงพอ) ใช้ RMGIC ได้ แต่ถ้าครอบเตี้ย/Onlay/Maryland bridge ต้องอาศัย Al2O3 + 10-MDP + Resin cement!"],
      ["Zinc Phosphate vs GIC vs RMGIC vs Resin", "Zinc Phosphate: อนุภาคแข็ง ไม่ยืดหยุ่น พึ่ง Mechanical; GIC: ยึดเคมี + ปล่อย F- (ระวังเปียกน้ำแรก); RMGIC: ใช้ง่ายสุดกับ Metal/PFM/Zirconia", "Resin Cement (Dual-cure): แข็งแรง-ซึมรั่วต่ำสุด ใช้คู่ Veneer, All-ceramic และ Fiber post; ห้ามใช้ร่วมกับ Temp cement ที่มี Eugenol!"]
    ],
    pitfalls: [
      "เอาสาร Hydrofluoric Acid ไปกัดด้านในครอบ Zirconia หรือใช้ Silane อย่างเดียวกับ Zirconia — เซอร์โคเนียไม่มี Silica (SiO2) จึงกัดไม่ติด! ต้องใช้ 10-MDP primer หลังพ่นทราย",
      "ลองครอบ Zirconia ในปากแล้วเช็ดไม่สะอาดด้วยน้ำ/แอลกอฮอล์อย่างเดียว — ฟอสเฟตในน้ำลายเกาะ Zirconium oxide แน่นมาก ต้องล้างด้วย Sodium hypochlorite / Ivoclean หรือพ่นทรายเบาๆ"
    ],
    pearl: "Ferrule สูง ≥ 1.5–2 mm สำคัญสุด! | เหลือปลาย GP ≥ 4–5 mm | e.max = HF Acid + Silane | Zirconia/Base metal = Al2O3 + 10-MDP | Noble Gold = Al2O3 + Sulfur/Thiol primer!",
    reference: "Rosenstiel's Contemporary Fixed Prosthodontics 6th ed. (2022) & Shillingburg 4th ed."
  },

  // ── PEDIATRIC DENTISTRY (4) ───────────────────────────────────────────────
  "Pedia-Behavior-Guidance": {
    title: "การประเมินและจัดการพฤติกรรมเด็ก (AAPD 2024), ขนาดยาชา & IE Prophylaxis (AHA 2021)",
    specialty: "ทันตกรรมสำหรับเด็ก",
    category: "ทันตกรรมสำหรับเด็ก",
    badgeColor: "#0284c7",
    must_know_topics: [
      "Frankl (1–4) & Wright's Classification: Lacking Cooperative (<3 yrs) vs Potentially Cooperative",
      "Voice Control Ineffective in Lacking Cooperative Toddlers; Ban on HOME (AAPD 2024)",
      "Pediatric LA MRD: Lidocaine/Mepivacaine 4.4 mg/kg & Articaine 7.0 mg/kg (>4 yrs)",
      "AHA 2021 Pediatric IE Prophylaxis: Amoxicillin 50 mg/kg; Azithromycin 15 mg/kg / Cephalexin 50 mg/kg (No Clindamycin!)"
    ],
    "overview": "การประเมินความร่วมมือของเด็กตาม Frankl และ Wright, ลำดับขั้นพฤติกรรมตาม AAPD 2024 รวมถึงการคำนวณขนาดยาชาเฉพาะที่ตามน้ำหนักตัว และการป้องกันภาวะเยื่อบุหัวใจอักเสบ (AHA 2021)",
    "core_mechanism": "เด็ก `< 3` ปีหรือพัฒนาการช้ารุนแรงจัดเป็น `Lacking cooperative ability` ซึ่งใช้ Voice Control/TSD ไม่ได้ผล (ต้องใช้ **GA** หากต้องรักษาหลายซี่ เช่น S-ECC หรือ I&D Cellulitis; ส่วน Protective stabilization ใช้เฉพาะเหตุฉุกเฉินสั้นๆ พร้อม Informed consent และระวัง **Hypoxic Spell** ในเด็ก Cyanotic CHD เช่น TOF!); **AHA 2021:** Unrepaired Cyanotic CHD (TOF) ให้ **Amoxicillin 50 mg/kg** (แพ้ PCN ให้ Azithromycin 15 mg/kg หรือ Cephalexin 50 mg/kg — **ถอด Clindamycin ออกแล้ว!**) ส่วน **Isolated ASD / Uncomplicated VSD ไม่ต้อง Pre-med!**",
    matrix_headers: ["เทคนิค / เกณฑ์ยาเด็ก", "หลักการ & ข้อบ่งชี้ (AAPD 2024 / AHA 2021)", "ข้อห้าม / ข้อควรระวังสำคัญ"],
    matrix_rows: [
      ["Wright & Frankl (1–4)", "Frankl 1(--) ถึง 4(++); เด็ก <3 ปีที่ร้องไห้ดิ้นไม่นั่งเก้าอี้ = **Lacking Cooperative Ability**", "Voice control ใช้ได้เฉพาะเด็กสื่อสารได้ (≥3 ปี); **ห้ามใช้ใน <3 ปี Lacking Cooperative!**"],
      ["Tell-Show-Do / Modeling / Desensitization", "TSD ลดความกลัวสิ่งไม่รู้; Desensitization เหมาะกับ Autism ที่สื่อสารได้; Modeling ให้ดูเด็กที่ร่วมมือ", "**HOME (Hand-Over-Mouth) ถูกยกเลิกถาวร!** ห้ามหลอกเด็ก"],
      ["Protective Stabilization / N2O / GA", "GA เหมาะกับ S-ECC <3 ปี (Lacking Cooperative), IQ ต่ำ, Cellulitis I&D (ETT); N2O จบด้วย 100% O₂ 3–5 นาที", "Papoose board ต้องขอ Consent และระวัง **Hypoxic Spell ใน TOF!**; ห้าม N2O ในคัดจมูก/COPD"],
      ["LA MRD & AHA 2021 IE Prophylaxis", "2% Lidocaine/Mepivacaine **4.4 mg/kg** (1 หลอด = 36 mg); Amoxicillin **50 mg/kg** 30–60 น. ก่อนทำ (15 kg = 750 mg)", "Isolated ASD/VSD ไม่ซับซ้อนไม่ต้อง Pre-med!; แพ้ PCN ใช้ Azithromycin 15 mg/kg / Cephalexin 50 mg/kg (**งด Clindamycin!**)"]
    ],
    pitfalls: [
      "เลือก Voice Control ให้เด็ก 2 ขวบที่ไม่นั่งเก้าอี้ทำฟัน (`Lacking cooperative`) ➔ ใช้ไม่ได้ผล! หากฟันผุหลายซี่ 53–63 ให้วางแผนทำ **GA** (และใช้ 5% NaF Varnish ชะลอผุ)",
      "จ่าย Clindamycin ใน AHA 2021 ปัจจุบัน (หรือให้ Clindamycin 750 mg ในเด็ก 15 kg ทั้งที่ปฏิเสธแพ้ยา!) — ถอด Clindamycin ออกแล้ว, และเด็ก 15 kg ไม่แพ้ยาต้องใช้ **Amoxicillin 750 mg (50 mg/kg)**"
    ],
    pearl: "ห้าม HOME! | 2 ขวบไม่นั่งเก้าอี้ = Lacking Cooperative ➔ GA (ไม่ใช้ Voice control)! | LA MRD = 4.4 mg/kg | AHA 2021 TOF = Amoxicillin 50 mg/kg (No Clindamycin)!",
    reference: "AAPD Behavior Guidance & Local Anesthesia Guidelines (2024–2025) & AHA 2021 IE Guideline"
  },

  "Pedia-Fluoride-Pharmacology-Toxicity": {
    title: "เภสัชวิทยาของฟลูออไรด์ (TSPD/AAPD), ตารางเม็ดเสริม และพิษวิทยา (PTD 5 mg/kg)",
    specialty: "ทันตกรรมสำหรับเด็ก",
    category: "ทันตกรรมสำหรับเด็ก",
    badgeColor: "#0284c7",
    must_know_topics: [
      "1,000–1,500 ppm Toothpaste (0.22% NaF / 0.76% SMFP = 1000 ppm, NEVER 10% SMFP!)",
      "Thai Supplement Tablets: 0.55 mg NaF (= 0.25 mg F⁻) / 1.1 mg NaF (= 0.50 mg F⁻)",
      "5% NaF Varnish (22,600 ppm) vs 38% SDF vs 1.23% APF vs 0.05% Daily / 0.2% Weekly MW",
      "PTD = 5 mg F/kg & Emergency Calcium Gluconate / Milk Rescue"
    ],
    overview: "กลไก Topical post-eruptive ของฟลูออไรด์ การเลือกใช้ความเข้มข้นและปริมาณยาสีฟันตามช่วงอายุ ตารางฟลูออไรด์เสริมของไทย และการคำนวณ/กู้ชีพพิษฟลูออไรด์เฉียบพลัน",
    core_mechanism: "กลไกป้องกันผุหลักคือ Topical post-eruptive effect (Fluorapatite critical pH 4.5 + ยับยั้ง Enolase) โดยยาสีฟันเด็กใช้ **1,000–1,500 ppm F** (`0.76% SMFP` = 1,000 ppm — ระวังข้อสอบหลอก **10% SMFP** ซึ่งเป็นพิษถึงตาย ~13,160 ppm!); สำหรับเม็ดเสริมของไทย **0.55 mg NaF = 0.25 mg F⁻**, **1.1 mg NaF = 0.50 mg F⁻**, **2.2 mg NaF = 1.0 mg F⁻**; พิษเฉียบพลัน **PTD = 5 mg F/kg** แก้ด้วยการดื่มนม/Ca²⁺ แล้วส่ง ER ให้ IV Calcium gluconate",
    matrix_headers: ["ตัวแปร / ผลิตภัณฑ์", "เกณฑ์ขนาดยาและข้อบ่งชี้ (AAPD/TSPD 2024–2025)", "ข้อห้าม & กับดักคำนวณ"],
    matrix_rows: [
      ["ยาสีฟัน 1,000–1,500 ppm", "< 3 ปี: เมล็ดข้าวสาร (Smear ~0.1g) | 3–6 ปี: เมล็ดถั่วเขียว (~0.25g) | ≥ 6 ปี: เต็มแปรง", "1000 ppm = 1 mg F/g (= 0.22% NaF หรือ 0.76% SMFP); ห้ามเลือก **10% SMFP** เด็ดขาด!"],
      ["เม็ดเสริมไทย (<0.3 / 0.3–0.6 / >0.6 ppm)", "<0.3 ppm: 6ด.–3ปี 0.25 / 3–6ปี 0.50 / 6–16ปี 1.0 mg F⁻ | 0.3–0.6 ppm: 3–6ปี 0.25 mg F⁻ (**0.55 mg NaF**)", "น้ำ > 0.6 ppm หรือ < 6 เดือน ห้ามเสริม! (0.55 mg NaF = 0.25 mg F⁻, 1.1 mg NaF = 0.50 mg F⁻)"],
      ["5% NaF Varnish / SDF / MW", "Varnish 5% (22,600 ppm): ทา High-risk < 6 ปี ทุก 3–6 ด. | ≥ 6 ปี ใช้ MW **0.05% NaF รายวัน** หรือ **0.2% NaF รายสัปดาห์**", "ห้ามใช้ Mouthwash ในเด็ก < 6 ปี (กลืน!); ห้าม APF บน Composite/Porcelain/GIC!"],
      ["PTD = 5 mg F/kg", "2% NaF = 9 mg/ml | 1.23% APF = 12.3 mg/ml | 5% NaF = 22.6 mg/ml", "ได้รับ ≥ 5 mg/kg: ดื่มนม/CaCO₃ จับ F⁻ เป็น CaF₂ + ส่ง ER ฉีด IV Calcium gluconate"]
    ],
    pitfalls: [
      "กับดักความเข้มข้น SMFP: 10% Sodium monofluorophosphate ไม่ใช่ 1,000 ppm! (ที่ถูกคือ **0.76% SMFP** = 1,000 ppm; 10% SMFP = 13,160 ppm อันตรายถึงชีวิต! เด็ก 2 ขวบไม่ร่วมมือต้องเลือก **5% NaF Varnish**)",
      "กับดักหน่วย mg NaF vs mg F ion: เม็ด 0.55 mg NaF มี F⁻ = 0.25 mg, เม็ด 1.1 mg NaF มี F⁻ = 0.50 mg, และยาบ้วนทุกวันสำหรับ ≥6 ปีคือ 0.05% NaF (หรือ 0.02% ในบางสูตร) ส่วนรายสัปดาห์คือ 0.2% NaF"
    ],
    pearl: "0.76% SMFP = 1000 ppm (ห้าม 10% SMFP!) | 0.55 mg NaF = 0.25 mg F⁻ | PTD = 5 mg/kg | เด็กเล็กไม่ร่วมมือป้องกันผุ = 5% NaF Varnish!",
    reference: "AAPD Fluoride Therapy Guideline (2024–2025) & TSPD / กรมอนามัย"
  },

  "Pedia-Restorative-Techniques": {
    title: "การบูรณะฟันน้ำนม Strip Crown, SSC Pliers, Hall Technique & SDF",
    specialty: "ทันตกรรมสำหรับเด็ก",
    category: "ทันตกรรมสำหรับเด็ก",
    badgeColor: "#0284c7",
    must_know_topics: [
      "Anterior S-ECC: Strip Crown / Zirconia (NOT Molar SSC!)",
      "SSC Adaptation Pliers: Howe #110 (M-D Width), Abell #112 (Contact), Johnson #114, Crimping #417",
      "Hall Technique (No LA/No Drilling) & 38% SDF",
      "Minamata COP-5 Amalgam Restriction (< 15 yrs) & Sealant Selection"
    ],
    overview: "หลักการเลือกบูรณะฟันหน้า vs ฟันหลังน้ำนม คีมปรับแต่ง SSC แต่ละชนิด แนวทาง Minimal Intervention (Hall, SDF, Sealant) และข้อจำกัด Amalgam ในเด็ก",
    core_mechanism: "ฟันน้ำนมหน้าผุรอบซี่ (`51, 52, 61, 62`) บูรณะด้วย **Celluloid Strip Crown (Composite)** หรือ Zirconia Crown **ไม่ใช่ SSC ของฟันกราม**! ส่วนฟันกรามน้ำนมผุ ≥ 2 ด้านหรือหลัง Pulpotomy/Pulpectomy ใช้ **SSC** โดยมีคีมดัดเฉพาะจุด: **Howe (#110)** บีบปรับความกว้าง **Mesio-distal** & จับครอบฟัน, **Abell Ball-and-Socket (#112)** ดันสร้างจุดสัมผัส proximal, **Johnson (#114)** ดัดความโค้งกลางครอบ, และ **Crimping (#417)** บีบขอบเหงือก 1 mm ให้แนบ; ตาม **Minamata COP-5** หลีกเลี่ยง Amalgam ในเด็ก `< 15` ปี",
    matrix_headers: ["เทคนิค / เครื่องมือ", "ข้อบ่งชี้เฉพาะที่ (Indications)", "รายละเอียดจำเพาะ & ข้อห้าม"],
    matrix_rows: [
      ["Anterior S-ECC: Strip Crown / Zirconia", "ฟันน้ำนมหน้าบนผุหลายด้าน / รอบคอฟัน (51–62)", "ใช้ Strip crown (Composite) หรือ Zirconia crown (**ห้ามใส่ Molar SSC ในฟันหน้า!**)"],
      ["SSC Pliers (คีมปรับแต่งครอบฟัน)", "ปรับครอบฟันกรามน้ำนมให้พอดี Mesio-distal และแนบคอฟัน", "**Howe #110:** ปรับความกว้าง **Mesio-distal** & จับครอบ | **Abell #112:** ดัน Contact point | **Johnson #114:** ดัดตัวครอบ | **Crimping #417:** บีบขอบเหงือก 1 mm"],
      ["Hall Technique & 38% SDF", "Hall: Dentin caries ไม่มีปวด/Furcation lesion + เห็น Clear dentin band | SDF: เด็กไม่ร่วมมือ/ECC", "Hall: Separator 3–5 วัน + GIC ไม่ฉีดไม่กรอ | SDF: ย้อมดำถาวร ห้ามในฟันทะลุพัลพ์/มีหนอง"],
      ["Sealants & PRR (ICDAS)", "ICDAS 0–2 หลุมร่องลึกฟันกรามแท้", "คุมความชื้นได้ ➔ Resin sealant; ขึ้นบางส่วนชื้น ➔ GI sealant / Varnish; ผุเข้าเนื้อฟันเล็กน้อย ➔ PRR (เลี่ยง Amalgam < 15 ปี)"]
    ],
    pitfalls: [
      "กับดัก Strip Crown vs SSC: หากโจทย์ระบุ `ECC ฟันหน้าผุ 4 ซี่รอบคอฟัน` ต้องตอบ **Strip Crown** ไม่ใช่ SSC!",
      "กับดักคีม SSC: การปรับความกว้างแนว **Mesio-distal** ใช้ **Howe plier (#110)** (หรือ Abell #112 ดัน Contact) ส่วน **Crimping plier (#417)** ใช้บีบเฉพาะขอบเหงือก (Gingival margin) 1 มม. เท่านั้น!"
    ],
    pearl: "หน้าผุ 4 ซี่ = Strip Crown! | ปรับ M-D SSC = Howe #110 (Crimping #417 = ขอบเหงือก 1 mm!) | Hall = ไม่ฉีดไม่กรอต้องมี Clear dentin band!",
    reference: "AAPD Restorative Dentistry Guideline (2024–2025), Minamata COP-5 & McDonald & Avery 11th ed."
  },

  "Pedia-Young-Permanent-Teeth": {
    title: "ฟันแท้เด็ก (Open Apex Cvek), MIH, Ectopic Eruption, Mesiodens & Fluorosis MID",
    specialty: "ทันตกรรมสำหรับเด็ก",
    category: "ทันตกรรมสำหรับเด็ก",
    badgeColor: "#0284c7",
    must_know_topics: [
      "Immature Open Apex: Cvek Partial Pulpotomy (Apexogenesis) vs Apexification / Regenerative Endo",
      "MIH (Demarcated Opacities + PEB) vs Fluorosis MID (Microabrasion / Resin Infiltration / Bleaching)",
      "Mesiodens Surgical Timing (Remove when 11/21 Root 2/3 Formed vs Immediate if Obstructing)",
      "Ectopic Eruption 6 & Reactive Gingival Lesions (PG / PGCG = Chronic Irritation)"
    ],
    overview: "การรักษาฟันแท้ปลายรากเปิดที่เกิดอุบัติเหตุ ภาวะ MIH และการจัดการฟลูออโรซิสแบบบุกรุกน้อยที่สุด รวมถึงจังหวะการผ่าตัดฟันเกิน Mesiodens และ Cleft Lip/Palate ในเด็ก",
    core_mechanism: "ฟันแท้ปลายรากเปิดที่ทะลุพัลพ์เฉียบพลันให้ทำ **Partial (Cvek) Pulpotomy** เพื่อรักษา Vital radicular pulp ให้เกิด **Apexogenesis** (หากตายให้ทำ Apexification / Regenerative Endo); สำหรับ **Mesiodens** หากยังไม่กีดขวางหรือกลัวทำอันตรายต่อหน่อฟันแท้ที่กำลังสร้าง มักรอผ่าตัดเมื่อ **รากซี่ 11/21 สร้างครบ 2/3** (ยกเว้นขวางการงอกหรือเกิดถุงน้ำ); ส่วน **Fluorosis** บนฟันแท้เด็กจัดการแบบ Minimal invasive ด้วย **Enamel Microabrasion, Resin Infiltration (Icon) หรือ Vital Bleaching**",
    matrix_headers: ["ภาวะในฟันแท้เด็ก / ปัญหาพัฒนาการ", "ลักษณะวินิจฉัยสำคัญ", "แนวทางจัดการมาตรฐาน (AAPD/IADT)"],
    matrix_rows: [
      ["Open Apex Pulp Exposure", "รากยังเปิด (Vital vs Non-vital)", "Vital ➔ **Partial (Cvek) Pulpotomy** (MTA/Biodentine) เพื่อ Apexogenesis | Non-vital ➔ Apexification / Revascularization"],
      ["MIH vs Dental Fluorosis MID", "MIH: **ขอบชัด**บน 6 & ฟันตัด | Fluorosis: **ขุ่นฟุ้ง/แถบสมมาตร**ช่วงสร้างฟัน", "MIH: NaF varnish/CPP-ACP, GIC/SSC | Fluorosis MID: Microabrasion / **Resin Infiltration (Icon)** / Vital Bleaching"],
      ["Mesiodens / Ectopic 21 & 6", "11/21 ห่างหรือค้าง; ซี่ 6 ติดใต้ E", "Mesiodens ไม่กีดขวาง ➔ รอ 11 สร้างราก **2/3** ค่อยผ่า; ค้างสูงในกระดูก ➔ Surgical exposure + Orthodontic traction (Artificial eruption)"],
      ["Cleft Lip/Palate & Gingival Epulis", "Cleft: ขาดซี่ **22** & Hearing loss | Pyogenic granuloma/PGCG เหงือกม่วงแดงไม่มี bone loss", "Lip repair Rule of 10s (10 wks, 10 lbs, Hb ≥10); Alveolar bone graft ~9–11 ปี ก่อนซี่ 3 ขึ้น; PG/PGCG เกิดจาก **Chronic irritation**"]
    ],
    pitfalls: [
      "กับดัก Fluorosis vs Tetracycline: แถบเปลี่ยนสีสมมาตรตามลำดับเวลาสร้างเคลือบฟันร่วมประวัติได้ฟลูออไรด์เกิน = Dental Fluorosis จัดการแบบ MID ด้วย **Resin infiltration / Vital bleaching / Microabrasion** ไม่ต้องทำ Crown/Veneer!",
      "กับดักก้อนเนื้อสีม่วงแดงที่เหงือกเด็ก (Pyogenic granuloma / PGCG) ที่ไม่มี Bone loss และไม่มี Lesion ปลายราก ➔ เกิดจาก **Chronic local irritation** (คราบจุลินทรีย์/ขอบฟันผุคม) ไม่ใช่ Infection!"
    ],
    pearl: "Open apex vital = Cvek pulpotomy! | MIH ขอบชัด vs Fluorosis สมมาตร | Mesiodens รอ 11 ราก 2/3 | PG/PGCG เด็ก = Chronic irritation!",
    reference: "IADT Dental Trauma Guidelines (2020) & AAPD Pulp Therapy / Oral Pathology Reference Manual (2024–2025)"
  },

  // ── ORAL DIAGNOSIS, MEDICINE & RADIOLOGY (5) ──────────────────────────────
  "OralMed-Oral-Radiology-Physics": {
    title: "ฟิสิกส์รังสีวิทยาช่องปาก คุณภาพภาพ และการป้องกันรังสี (kVp, mAs, ADA 2024 & SLOB)",
    specialty: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    category: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "kVp (Beam Quality / Penetrability / Contrast) vs mAs (Quantity / Density)",
      "Stochastic (No Threshold: Cancer/Genetic) vs Deterministic (Threshold: Cataract/Mucositis)",
      "ADA Feb 2024 Shielding Update, Rectangular Collimator, ALADAIP & AAPD Pediatric Imaging",
      "Panoramic Errors (Too Far Forward vs Back / Chin Up vs Down), Film Processing Faults & SLOB"
    ],
    overview: "การปรับตั้งค่าเครื่องกำเนิดรังสีให้เหมาะสมกับงานวินิจฉัย กลไกผลทางชีวภาพของรังสี แนวทางความปลอดภัยล่าสุด (ADA/FDA Feb 2024 & ICRP ALADAIP) และการวิเคราะห์ข้อผิดพลาดของภาพถ่ายและกระบวนการล้างฟิล์ม",
    core_mechanism: "เพิ่ม kVp ทำให้รังสีมีพลังงานสูงทะลุทะลวงดีขึ้นและเพิ่มเฉดสีเทา (Long-scale / Low contrast — เหมาะประเมินกระดูกปริทันต์) ขณะที่ลด kVp ได้ Short-scale / High contrast (ขาว-ดำตัดชัด — เหมาะหาฟันผุ) ส่วน mAs ควบคุมความดำ (Density) โดยตรง สำหรับความคมชัดทางเรขาคณิต (Geometry): ให้ Source-to-object ไกล (Long 16-inch PID), Object-to-film ชิดที่สุด (Paralleling technique), และ Object ขนานกับฟิล์ม",
    matrix_headers: ["ตัวแปร / ข้อผิดพลาดภาพรังสี", "ผลกระทบต่อภาพ หรือ สาเหตุที่เกิด", "วิธีแก้ไขและจุดจำข้อสอบ"],
    matrix_rows: [
      ["เพิ่ม kVp vs เพิ่ม mAs", "เพิ่ม kVp: ความดำเพิ่ม + Contrast ต่ำลง (Gray scale กว้าง) ลด Skin dose | เพิ่ม mAs: ความดำเพิ่ม (ไม่เปลี่ยน Contrast)", "ถ้าภาพสว่างจ้าเกินไป (Underexposed) หรือผู้ป่วยตัวใหญ่ ให้ปรับ mAs; ปรับ kVp เพื่อคุม Contrast & การทะลุ"],
      ["Stochastic vs Deterministic & ADA Feb 2024 Shielding", "Stochastic: ไม่มี Threshold โอกาสเกิดเพิ่มตามโดส (มะเร็ง, Mutation) | Deterministic: มี Threshold (Mucositis, Cataract, ORN)", "รังสีทันตกรรมเสี่ยงแบบ ‘Stochastic’ (Rectangular collimator ลดโดส ~60%) ⚠️ ADA Feb 2024: เลิกแนะนำ Lead Apron/Thyroid Collar เป็นประจำในทุกเคสแล้ว (เลี่ยง Artifact ที่บังลำรังสีจนต้องถ่ายซ้ำ!)"],
      ["Panoramic: ยืนล้ำหน้า vs ถอยหลัง Focal Trough", "ล้ำหน้าเกิน (Too far forward): ฟันหน้า ‘แคบเล็กเบลอ’ + กระดูกสันหลังซ้อน | ถอยหลังเกิน (Too far back): ฟันหน้า ‘กว้างยืดบาน’ + Condyle ตกขอบ", "จำ: ‘หน้า-เล็ก, หลัง-บาน’ | ไม่ดุนลิ้นติดเพดานปาก ➔ เกิดเงาดำแถบกว้าง (Palatoglossal air space) บังปลายรากบน | หันหน้าไปขวา ➔ ซีกซ้ายยืดกว้าง!"],
      ["Panoramic: ก้มคาง vs เงยคาง & Film Faults", "ก้มคางเกิน: Exaggerated smile + Hyoid บังฟันหน้าล่าง | เงยคางเกิน: Reverse smile + Hard palate บังรากบน | คราบเหลืองน้ำตาลหลังเก็บ = ล้างน้ำสุดท้ายหลัง Fixer ไม่พอ!", "ปรับ Frankfort horizontal ขนานพื้น | เด็กไม่ร่วมมือ (Frankl -) เลี่ยง CBCT (เสี่ยง Motion artifact) ใช้ Anterior Occlusal/PA ที่เร็วและโดสต่ำกว่า!"]
    ],
    pitfalls: [
      "คิดสลับ kVp สูงกับ High Contrast: kVp สูงได้ภาพเทาหลายเฉด = ‘LOW Contrast’ (Long-scale) ไม่ใช่ High Contrast! kVp ต่ำ (60–65 kVp) ต่างหากที่ได้ High Contrast",
      "ถ่ายภาพฟันด้วย Bisecting-angle technique ในมุมตั้งชันเกินไป (Excessive vertical angulation) ➔ เกิด ‘Foreshortening’ (รากฟันสั้นกุด); มุมน้อยเกิน ➔ ‘Elongation’ (รากฟันยืดยาว)"
    ],
    pearl: "เพิ่ม kVp = Grayscale เยอะ (Low Contrast) | ADA Feb 2024 = เลิกใส่ Lead Apron/Thyroid Collar เป็น Routine! | คราบเหลืองบนฟิล์ม = ล้าง Fixer ไม่พอ | ยืนหน้า-ฟันแคบ, ยืนหลัง-ฟันบาน!",
    reference: "ADA Expert Panel (Benavides E, et al., JADA Feb 2024); White and Pharoah's Oral Radiology 8th ed.; AAPD Prescribing Dental Radiographs (2023)"
  },

  "OralMed-Vesiculobullous-Ulcers": {
    title: "รอยโรคแผลถลอก ตุ่มพอง เชื้อรา และไวรัส (Pemphigus, MMP, OLP, VZV, Candida)",
    specialty: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    category: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "Pemphigus Vulgaris (Intraepithelial/Suprabasal + Fish-net IgG + Desmoglein 3)",
      "Mucous Membrane Pemphigoid (Subepithelial + Linear IgG/C3 + Eye Symblepharon)",
      "Oral Lichen Planus (Wickham Striae + Saw-tooth + Band-like T-cell + Shaggy Fibrinogen)",
      "HSV / Herpes Zoster (VZV Unilateral) vs RAU vs Candida Denture Stomatitis (IDSA)"
    ],
    overview: "การแยกกลุ่มโรคตุ่มพอง แผลภูมิคุ้มกัน แผลติดเชื้อไวรัส (HSV/Herpes Zoster) และเชื้อราใต้ฐานฟันเทียม (IDSA Candidiasis Guideline) จากตำแหน่ง ผลการตรวจ KOH/Biopsy และ Direct Immunofluorescence (DIF)",
    core_mechanism: "แผลไวรัส (HSV/VZV) และ RAU มีจุดแยกเด็ดขาดด้านตำแหน่ง: RAU (Aphthous ulcer) เกิดเฉพาะบน Non-keratinized movable mucosa (แก้ม ริมฝีปาก พื้นปาก ไม่เกิดบน Attached gingiva/เพดานแข็ง!) แต่ HSV เกิดได้ทั้งบน Keratinized และ Non-keratinized ส่วน Herpes Zoster (VZV) เป็นตุ่มน้ำข้างเดียวไม่ข้าม Midline สำหรับ Pemphigus เป็นการทำลาย Desmosome ชั้นตื้นแตกไวอันตรายถึงชีวิต ต่างจาก MMP ที่แยกชั้นลึกใต้ Basement membrane",
    matrix_headers: ["โรคตุ่มน้ำ / แผล / ติดเชื้อ", "ตำแหน่งคลินิก & การตรวจยืนยัน", "DIF & แนวทางรักษามาตรฐาน"],
    matrix_rows: [
      ["Pemphigus Vulgaris (PV)", "ถุงน้ำแตกไว Nikolsky (+), แผลถลอกใหญ่; H&E: ‘Suprabasal Acantholysis’ + Tzanck cells", "DIF: IgG/C3 ตาข่าย ‘Fish-net / Chicken-wire’ ➔ รีบให้ Systemic Steroid + ส่งต่อ (อันตรายถึงชีวิต!)"],
      ["Mucous Membrane Pemphigoid (MMP)", "Desquamative gingivitis เหงือกลอกแดง + พังผืดตา (Symblepharon); H&E: ‘Subepithelial split’", "DIF: ‘Linear band’ ของ IgG และ C3 ที่ Basement membrane ➔ Topical potent steroid + ส่งจักษุแพทย์!"],
      ["Oral Lichen Planus (OLP) / Bell's Palsy", "OLP: ลายร่างแหขาวสมมาตร 2 ข้าง + Band T-cell infiltrate | Bell's Palsy: อัมพาต CN VII หน้าครึ่งซีก (CN V ปกติ!)", "OLP DIF: ‘Shaggy Fibrinogen’ ➔ Topical steroid | Bell's Palsy: Systemic Prednisolone ภายใน 72 ชม. เป็นยาหลัก!"],
      ["HSV / Herpes Zoster (VZV) & Denture Stomatitis", "VZV: ตุ่มน้ำปวดแสบข้างเดียวหยุดที่ Midline | Denture Stomatitis: ปื้นแดงใต้ฟันเทียม ➔ ยืนยันด้วย 10% KOH smear", "HSV/VZV: Oral Acyclovir (⚠️ ห้ามทา Steroid!) | Denture Stomatitis (IDSA): **Nystatin** / Miconazole + ถอดล้างฟันเทียมก่อนนอน (**ห้ามทาสเตียรอยด์** และห้าม Miconazole ถ้ากิน Warfarin!)"]
    ],
    pitfalls: [
      "สั่งจ่าย Triamcinolone หรือ Fluocinolone (Topical Steroid) ทาแผลติดเชื้อไวรัส (HSV/VZV) หรือรอยโรคเชื้อรา Denture stomatitis — กดภูมิคุ้มกันเฉพาะที่ทำให้เชื้อไวรัส/เชื้อราลุกลามหนักขึ้น!",
      "ตัดชิ้นเนื้อ DIF ผิดตำแหน่งโดยตัดตรงกลางแผล (Ulcerated center ไม่มี Epithelium เหลือให้ตรวจ) ➔ ต้องตัด ‘Perilesional mucosa’ ที่มี Epithelium ยึดอยู่และใส่ Michel's transport media (ไม่ใช่ Formalin!)"
    ],
    pearl: "PV = Suprabasal + Fish-net IgG | MMP = Subepithelial + Symblepharon | VZV = ไม่ข้าม Midline ให้ Acyclovir! | Denture Stomatitis = KOH + Nystatin + ถอดนอน (งดสเตียรอยด์!)",
    reference: "Neville's Oral Pathology 5th ed. / Burket's Oral Medicine 13th ed. / IDSA Candidiasis Guideline / AAN Bell's Palsy"
  },

  "OralMed-Medically-Compromised-Endo-Renal": {
    title: "การจัดการผู้ป่วยโรคเบาหวาน ไทรอยด์ ไตวาย มะเร็งวิทยา และ MRONJ (Endocrine, Renal & Oncology)",
    specialty: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    category: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "Diabetes Mellitus (ADA 2025/2026: HbA1c < 7%, Level 1 < 70 / Level 2 < 54 mg/dL, Rule of 15)",
      "Hyperthyroidism / Thyrotoxicosis (Avoid Epinephrine!)",
      "Chronic Kidney Disease (Non-Dialysis Day, Avoid AV Fistula Arm, No NSAIDs)",
      "Pediatric ALL Chemotherapy (Oral Mucositis #1 / ANC < 1,000) & MRONJ (AAOMS 2022)"
    ],
    overview: "การประเมินความเสี่ยงก่อนหัตถการทันตกรรมตามเกณฑ์ ADA 2025/2026, AAPD Pediatric Oncology, AAOMS 2022 MRONJ และ Little & Falace 10th ed. รวมถึงการกู้ชีพภาวะน้ำตาลต่ำและข้อห้ามยาในผู้ป่วยไต",
    core_mechanism: "ผู้ป่วยเบาหวานที่คุมได้ (ADA 2025/2026: HbA1c < 7%) ทำฟันปกติในตอนเช้าหลังกินข้าวและยา แต่ความเครียด/อดข้าวทำให้เกิด Hypoglycemia (Level 1 < 70 mg/dL; Level 2 < 54 mg/dL) ซึ่งอันตรายเฉียบพลันกว่าน้ำตาลสูง ส่วนผู้ป่วยฟอกไตได้ Heparin ระหว่างฟอก จึงต้องนัดทำฟันที่มีเลือดออกใน ‘วันถัดไปหลังฟอกไต’ สำหรับผู้ป่วยโรคกระดูกพรุนหรือมะเร็งที่ได้ยาต้านสลายกระดูก (Alendronate/Zoledronic acid/Denosumab) หากมีกระดูกโผล่ > 8 สัปดาห์โดยไม่เคยฉายรังสี วินิจฉัยเป็น **MRONJ**",
    matrix_headers: ["โรคประจำตัว / ภาวะ", "เกณฑ์ปลอดภัย & ข้อห้ามยา", "แผนปฏิบัติในคลินิกและภาวะฉุกเฉิน"],
    matrix_rows: [
      ["เบาหวาน (DM — ADA 2025/2026)", "HbA1c < 7% (นัดเช้าหลังทานอาหาร-ยาปกติ; เช็ก DTX ก่อนทำ Elective)", "Hypoglycemia (<70 / <54 mg/dL) รู้ตัว: **Rule of 15** (กลูโคส 15 g); หมดสติ: 50% Dextrose IV หรือ Glucagon 1 mg IM/SC"],
      ["Thyrotoxicosis (Hyperthyroid คุมไม่ได้)", "หัวใจเต้นเร็ว สั่น เหงื่อออกง่าย เสี่ยง Thyroid Storm (ไข้สูง ชีพจร >140 เพ้อ)", "**ห้ามใช้ Epinephrine** (ทั้งในยาชาและ Retraction cord!) ใช้ 3% Mepivacaine Plain และส่งแพทย์คุมโรคก่อนทำ Elective"],
      ["CKD / Hemodialysis (ฟอกเลือด)", "ห้ามวัด BP / เจาะแขนข้างที่มี AV Shunt/Fistula!; ห้ามจ่าย NSAIDs, Aspirin, Tetracycline (ยกเว้น Doxy)", "ทำหัตถการ ‘วันถัดไปหลังฟอกไต’; ยาแก้ปวดปลอดภัยสุดคือ ‘Paracetamol’; ปรับ Interval ของ Amoxicillin"],
      ["ALL (มะเร็งเม็ดเลือดขาว) & MRONJ (AAOMS 2022)", "ALL: ANC < 1,000 ต้องได้ ATB Prophylaxis, Platelet ≥ 75,000 ถอนได้ | MRONJ: กระดูกโผล่ >8 สัปดาห์ + Antiresorptive + ไม่ฉายรังสี", "ALL เคมีบำบัด: ภาวะแทรกซ้อนช่องปากพบบ่อยสุดคือ **Oral Mucositis** (ห้ามทำ Pulpectomy ฟันติดเชื้อให้ถอน!) | MRONJ ระยะต้น: 0.12% CHX เลี่ยงถอนฟัน"]
    ],
    pitfalls: [
      "จ่าย Ibuprofen แก้ปวดหลังถอนฟันให้ผู้ป่วยโรคไตเรื้อรัง (CKD ระยะ 3–5) หรือผู้สูงอายุไตเสื่อม — ทำให้หลอดเลือดไตหดตัวเกิด Acute-on-Chronic Kidney Failure!",
      "วัดความดันโลหิตหรือเจาะเลือดที่แขนข้างเดียวกับที่มี Arteriovenous (AV) Fistula — อาจทำลายเส้นฟอกเลือดจนอุดตันเสียหายถาวร! และหัตถการเล็กในผู้ป่วยกิน Steroid เรื้อรังไม่ต้อง Double dose!"
    ],
    pearl: "น้ำตาลตก (<70) รู้ตัว ➔ 15 g Glucose! | คุมไทรอยด์ไม่ได้ = งด Epinephrine! | ฟอกไต = วันถัดไปหลังฟอก + งดแขน AV Fistula + Paracetamol | ALL = Oral Mucositis พบบ่อยสุด!",
    reference: "Little and Falace's Dental Management 10th ed.; ADA Diabetes Standards 2025/2026; AAPD Chemotherapy; AAOMS 2022 MRONJ"
  },

  "OralMed-Salivary-Gland-Pathology": {
    title: "พยาธิวิทยาของต่อมน้ำลาย ถุงน้ำเมือก เนื้องอก และ Salivary Caries Tests",
    specialty: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    category: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "Mucocele (Extravasation — No Epithelial Lining) vs Ranula (Floor of Mouth / Sublingual)",
      "Sialolithiasis (Wharton's Submandibular Duct > 80% — Mandibular Occlusal Film)",
      "Pleomorphic Adenoma vs Mucoepidermoid vs Adenoid Cystic (Perineural) & Sialometaplasia",
      "Hyposalivation Thresholds, Snyder Test (Lactobacillus 24/48/72h) & Buffer Capacity (HCl)"
    ],
    overview: "การแยกโรคต่อมน้ำลายระหว่างกลุ่มอุดตัน-บาดเจ็บ (Reactive) กลุ่มภูมิคุ้มกันปากแห้ง (Sjögren's) เนื้องอกไม่ร้าย/ร้ายของต่อมน้ำลาย และการแปลผลทดสอบน้ำลายประเมินความเสี่ยงฟันผุ",
    core_mechanism: "กฎทองของเนื้องอกต่อมน้ำลายคือ ‘ยิ่งขนาดต่อมน้ำลายเล็กลง อัตราการเป็นเนื้อร้าย (Malignancy) ยิ่งสูงขึ้น’: Parotid (~75–80% benign), Submandibular (~50%), Sublingual/Minor Salivary Gland (>60–80% malignant) สำหรับการตรวจน้ำลาย: ภาวะ Hyposalivation ใช้เกณฑ์ Unstimulated < 0.1 mL/min หรือ Stimulated < 0.7 mL/min; **Snyder test** ใช้วุ้นสีเขียว (Bromocresol green) วัดกรดจาก *Lactobacillus* ที่ 24, 48, 72 ชม.; **Buffer capacity (Ericsson / Dentobuff)** ใช้กรดเจือจาง **0.005 N Hydrochloric acid (HCl)**!",
    matrix_headers: ["พยาธิสภาพ / การตรวจน้ำลาย", "ลักษณะคลินิก & ตำแหน่งเด่น", "การวินิจฉัยและวิธีรักษาเฉพาะ"],
    matrix_rows: [
      ["Mucocele & Ranula", "Mucocele: ตุ่มใสสีฟ้าที่ริมฝีปากล่าง (ไม่มี Epithelial lining — Mucus extravasation) | Ranula: บวมใต้ลิ้นเหมือนท้องกบ", "Mucocele: ตัดออกพร้อม Minor salivary glands ใต้ก้อน | Ranula: Marsupialization หรือตัด Sublingual gland"],
      ["Sialolithiasis (นิ่วท่อน้ำลาย)", "ปวดบวมใต้คาง ‘ทุกครั้งก่อน/ขณะกินอาหาร’ (Mealtime syndrome); 80–90% เกิดที่ Wharton's duct (Submandibular)", "ตรวจคลำ Bimanual palpation + ถ่ายภาพ ‘Mandibular Cross-sectional Occlusal film’ ➔ รีดออก/Sialolithotomy"],
      ["Pleomorphic Adenoma vs Mucoepidermoid / ACC", "Pleomorphic: โตช้าไม่เจ็บ (พบบ่อยสุด) | Mucoepidermoid (มะเร็งพบบ่อยสุด) | Adenoid Cystic: ปวดลามเส้นประสาท (Perineural) + ลาย Swiss-cheese", "Pleomorphic ต้องผ่าตัดออกพร้อมขอบเขตปกติ (ห้ามแค่ลอกหลุด/Enucleate ง่ายๆ เพราะมี Pseudopodia ทำให้กลับเป็นซ้ำ!)"],
      ["Sjögren's, Sialometaplasia & Salivary Caries Tests", "Sjögren's: Anti-SSA/SSB + เสี่ยง Lymphoma 40x | Sialometaplasia: แผลขาดเลือดเพดานหายเองใน 4–10 สัปดาห์ (อย่าผ่าตัดผิดเป็น SCC!)", "Snyder test (หลอดเขียว 24/48/72 ชม.) = **Activity Lactobacillus** | Buffer capacity = หยด **Hydrochloric acid (HCl)**"]
    ],
    pitfalls: [
      "เห็นผลตรวจชิ้นเนื้อ Necrotizing Sialometaplasia ที่มี Squamous metaplasia ที่เพดานปากแล้วผ่าตัด Maxillectomy คิดว่าเป็น Squamous Cell Carcinoma — จริงๆ เป็นภาวะขาดเลือดที่หายได้เอง!",
      "จำสลับสารทดสอบ Buffer capacity (HCl ของ Ericsson/Dentobuff, ไม่ใช่ Phosphoric acid!) และสับสนหลอดสีเขียว Snyder test (วัด *Lactobacillus* activity ที่ 24/48/72 ชม., ไม่ใช่ Salivary flow rate!)"
    ],
    pearl: "นิ่ว 80–90% = Wharton's duct | เนื้องอกพบบ่อยสุด = Pleomorphic Adenoma | มะเร็งพบบ่อยสุด = Mucoepidermoid | ปวดประสาท = Adenoid Cystic | Snyder = Lactobacillus, Buffer = HCl!",
    reference: "Neville's Oral Pathology 5th ed. (Ch. 11); Fejerskov Dental Caries 3rd ed.; Ericsson 1959"
  },

  "OralMed-Medically-Compromised-Bleeding": {
    title: "ความผิดปกติของการแข็งตัวของเลือด ยาต้านเกล็ดเลือด/ละลายลิ่มเลือด (Hemostasis)",
    specialty: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    category: "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "Coagulation Tests: PT/INR (Extrinsic/Warfarin), aPTT (Intrinsic/Heparin/Hemophilia), Platelet/PFA-100",
      "Safe Warfarin Dental Window: INR ≤ 3.5 (ไม่หยุดยา! ใช้ Local Hemostatic Measures)",
      "Antiplatelets (Aspirin/Clopidogrel Dual Therapy — DO NOT Stop!) & DOACs",
      "Local Hemostasis (Gelfoam, Surgicel, Tranexamic Acid Mouthwash), DDAVP & CYP2C9 Interactions"
    ],
    overview: "การประเมินผลการตรวจการแข็งตัวของเลือดก่อนทำฟัน และมาตรฐานปัจจุบันที่ไม่ให้หยุดยาละลายลิ่มเลือด (Warfarin) หรือยาต้านเกล็ดเลือด (Antiplatelets) โดยพลการเพื่อลดเสี่ยงอัมพาต/หัวใจวาย",
    core_mechanism: "Primary hemostasis (Platelet plug) ประเมินจาก Platelet count (ปกติ 150,000–400,000; ปลอดภัยทำถอนฟัน ≥ 50,000/µL) และ Bleeding time / PFA-100 ส่วน Secondary hemostasis (Fibrin clot) ใช้ PT/INR ดูสาย Extrinsic (Factor VII, ยา Warfarin) และ aPTT ดูสาย Intrinsic (Factors VIII, IX, XI, XII, ยา Heparin) แนวทางสากลยืนยันว่าความเสี่ยงตายจากลิ่มเลือดอุดตัน (Stroke/Stent thrombosis) หากหยุดยาสูงกว่าเลือดออกในช่องปากที่คุมได้ด้วย Gelfoam + เย็บแผล + Tranexamic acid จึง ‘ห้ามหยุดยา’ หาก INR ≤ 3.5!",
    matrix_headers: ["ยา / โรคเลือด", "ผลตรวจทางห้องปฏิบัติการ", "เกณฑ์ทำหัตถการทันตกรรม & การห้ามเลือด"],
    matrix_rows: [
      ["Warfarin (Vitamin K Antagonist)", "วัดผลด้วย PT / INR (ค่าเป้าหมายโรคหัวใจปกติ 2.0–3.0; Mechanical valve 2.5–3.5)", "INR ≤ 3.5 (เช็กภายใน 24–72 ชม.ก่อนทำ): **ห้ามหยุดยา!** ถอนแบบ Atraumatic + ใส่ Gelfoam/Surgicel + เย็บแผล + บ้วน 4.8–5% Tranexamic acid! (INR > 3.5–4.0 ส่งปรึกษาแพทย์)"],
      ["Aspirin / Clopidogrel (SAPT/DAPT)", "Platelet count ปกติ แต่การทำงานเกล็ดเลือดลดลง (ถอนฟันได้เลยถ้า Single/Dual antiplatelet ใน Drug-eluting stent!)", "**ห้ามหยุดยาต้านเกล็ดเลือดเด็ดขาด!** เสี่ยง Stent thrombosis เสียชีวิต (ยกเว้นแพทย์เจ้าของไข้ปรับเอง) — คุมเลือดเฉพาะที่ให้ดี"],
      ["DOACs (Dabigatran, Rivaroxaban, Apixaban)", "ออกฤทธิ์สั้น (ครึ่งชีวิต ~12 ชม.) ไม่ต้องเช็ก INR", "งานถอน 1–3 ซี่ มักไม่ต้องหยุด (ทำในช่วง Trough ระดับยาต่ำสุดก่อนกินมื้อถัดไป หรือข้ามแค่ 1 มื้อเฉพาะถ้าแพทย์สั่งในเคสผ่าตัดใหญ่)"],
      ["Hemophilia A (Factor VIII) & vWD", "Hemophilia A: aPTT ยาวขึ้น (PT/Platelet ปกติ!) | vWD: aPTT ยาว + Bleeding time ยาว", "ต้องประสานโลหิตแพทย์เติม Factor VIII/IX หรือให้ DDAVP (Desmopressin) + Tranexamic acid ก่อนถอนฟัน/ฉีด IANB block (IANB เสี่ยง Dissecting hematoma อุดทางเดินหายใจ!)"]
    ],
    pitfalls: [
      "สั่งให้ผู้ป่วยโรคหัวใจที่กิน Aspirin + Clopidogrel หลังใส่ขดลวด (DES) หรือ Warfarin (INR 2.5) หยุดยาก่อนถอนฟัน 7 วัน — เป็นอันตรายถึงชีวิต (Fatal thromboembolism) และไม่สอดคล้องกับแนวทาง AHA/ADA!",
      "จ่าย NSAIDs, Metronidazole หรือ **Miconazole oral gel** (ทาเชื้อรา/Denture stomatitis) ร่วมในผู้ป่วยที่กิน Warfarin ➔ ยับยั้งเอนไซม์ CYP2C9 ทำให้ INR พุ่งสูงและเลือดออกรุนแรง (ให้ Paracetamol และ Nystatin oral suspension แทน!)"
    ],
    pearl: "Warfarin INR ≤ 3.5 = ไม่หยุดยา! | Antiplatelet = ไม่หยุดยา! | ห้าม Miconazole/NSAIDs ในผู้ป่วย Warfarin! | Hemophilia เสี่ยง Hematoma หลัง IANB ต้องปรึกษาโลหิตแพทย์ก่อน!",
    reference: "Little & Falace 10th ed. / SDCEP Management of Dental Patients Taking Anticoagulants or Antiplatelet Drugs"
  },

  // ── ORTHODONTICS (5) ───────────────────────────────────────────────────────
  "Ortho-Cephalometric-Analysis": {
    title: "การวิเคราะห์ภาพรังสีกะโหลกด้านข้าง (Cephalometric Analysis: SNA, SNB, ANB)",
    specialty: "ทันตกรรมจัดฟัน",
    category: "ทันตกรรมจัดฟัน",
    badgeColor: "#059669",
    must_know_topics: [
      "Cranial & Skeletal Landmarks (S, N, Po, Or, A, B, Go, Me, Gn)",
      "SNA (~82°), SNB (~80°), ANB (~2° ± 2°) & Wits Appraisal",
      "Vertical Dimension: SN-MP (~32°) & FMA (~25°) — Hyper vs Hypodivergent",
      "Dental Inclination: U1-SN (~104°), U1-NA (22°/4mm), L1-NB (25°/4mm), IMPA (~90°)"
    ],
    overview: "การแปลผลค่ามุมและระยะทางมาตรฐานบนภาพ Lateral Cephalogram เพื่อแยกความผิดปกติระดับกระดูก (Skeletal AP & Vertical) ออกจากการเอนชดเชยของฟัน (Dental Compensation)",
    core_mechanism: "มุม ANB (SNA − SNB) บอกความสัมพันธ์ขากรรไกรบนเทียบล่างในแนวหน้า-หลัง (ค่าปกติ 2° ± 2°) หาก ANB > 4° คือ Skeletal Class II, หาก ANB < 0° คือ Skeletal Class III อย่างไรก็ตามความเอียงหรือความยาวของฐานกะโหลก (SN plane) อาจลวงค่า SNA/SNB ได้ จึงควรตรวจคู่กับ Wits appraisal (ลากเส้นตั้งฉากจากจุด A, B ลงบนระนาบสบฟัน) และแยก Dental compensation เช่น Skeletal Class III มักพบฟันบนยื่น (U1-NA เพิ่ม) และฟันล่างเอียงเข้าใน (IMPA ต่ำกว่า 90°)",
    matrix_headers: ["ค่าตรวจวัด / ความผิดปกติ", "ค่ามาตรฐาน (Steiner / Tweed Norm)", "การแปลผลทางคลินิก"],
    matrix_rows: [
      ["SNA / SNB / ANB", "SNA = 82° ± 2° | SNB = 80° ± 2° | ANB = 2° ± 2°", "ANB > 4° = Skeletal Class II (ดู SNA>84° บนยื่น หรือ SNB<78° ล่างถอย) | ANB < 0° = Skeletal Class III"],
      ["Wits Appraisal", "เทียบจุด A กับจุด B บน Functional Occlusal Plane (ปกติ BO หน้า AO 0–1 mm ในหญิง, 0–0 mm ในชาย)", "ช่วยยืนยันกรณีที่ฐานกะโหลก (Nasion) ยาว/เอียงจนทำมุม SNA, SNB หลอก"],
      ["SN-MP & FMA (แนวดิ่ง)", "SN-MP = 32° ± 4° | FMA (FH–GoMe) = 25° ± 3°", "> 36° (SN-MP) / > 30° (FMA) = Hyperdivergent (หน้ายาว/Vertical grower ➔ เสี่ยง Open bite คุม Molar extrusion เคร่ง!)"],
      ["U1-NA & IMPA (L1-MP)", "U1-NA = 22° / 4 mm | L1-NB = 25° / 4 mm | IMPA = 90° (คนไทย ~93–95°)", "บอก Dental Proclination vs Retroclination และช่วยให้ดูว่ายังมีพื้นที่เหลือให้จัดฟัน Camouflage หรือไม่"]
    ],
    pitfalls: [
      "ดูแค่ค่า ANB = 5° แล้วฟันธงว่าขากรรไกรบนยื่น (Maxillary protrusion) ทันที — ต้องดู SNA และ SNB แยกก่อน: ในประชากรส่วนใหญ่ Skeletal Class II เกิดจาก ‘Mandibular retrusion (SNB < 78°)’ มากกว่า Maxilla ยื่น!",
      "วัดจุด Porion ผิดไปใช้อุปกรณ์ Ear rod ของเครื่องแทน Anatomic Porion (ขอบบนของรูหูจริง)"
    ],
    pearl: "SNA 82°, SNB 80°, ANB 2° | ANB > 4° = Class II, < 0° = Class III | SN-MP > 36° = หน้ายาว High-angle (ระวัง Extrude ฟันกราม!) | Class III มักมีฟันหน้าล่างงุ้มชดเชย (IMPA ต่ำ)!",
    reference: "Proffit's Contemporary Orthodontics 6th ed. & Jacobson Radiographic Cephalometry"
  },

  "Ortho-Craniofacial-Growth": {
    title: "การเจริญเติบโตของกะโหลก-ใบหน้า และจังหวะปรับกระดูก (Scammon & Growth Timing)",
    specialty: "ทันตกรรมจัดฟัน",
    category: "ทันตกรรมจัดฟัน",
    badgeColor: "#059669",
    must_know_topics: [
      "Scammon's Growth Curves (Neural, General/Somatic, Lymphoid, Genital)",
      "Intramembranous (Vault/Maxilla/Mandible Surface) vs Endochondral (Cranial Base Synchondroses & Condylar Cartilage)",
      "Spheno-occipital Synchondrosis (ปิดช้าสุด ~15–20 ปี) & Displacement vs Remodeling",
      "Growth Completion Order: Transverse ➔ AP ➔ Vertical & Optimal Intervention Windows"
    ],
    overview: "กราฟการเติบโต 4 รูปแบบของ Scammon ชนิดการสร้างกระดูกในกะโหลกและขากรรไกร การประเมินระยะกระดูก (CVMI) และช่วงเวลาที่เหมาะสมในการทำ Growth Modification",
    core_mechanism: "เนื้อเยื่อประสาท (Neural: สมอง/ลูกตา/Cranial vault) โตเร็วมากถึง ~90% ตั้งแต่อายุ 6 ปี ส่วนเนื้อเยื่อน้ำเหลือง (Lymphoid: Tonsils/Adenoids) โตพุ่งสูงถึง ~200% ในวัยก่อนรุ่น (~10–12 ปี) แล้วค่อยหดตัวลง! ด้านขากรรไกรบนเติบโตแบบ Intramembranous (ที่ Sutures + Surface remodeling) โดยเคลื่อนลง-หน้า (Downward & Forward) ทำให้ปรับโครงสร้างด้วย RME + Facemask ได้ดีที่สุดช่วงอายุน้อย (7–9 ปี) ก่อน Circummaxillary sutures เชื่อมติด",
    matrix_headers: ["โครงสร้าง / กราฟเติบโต", "กลไก & จังหวะเวลาเติบโต (Scammon/CVMI)", "การประยุกต์กำหนดจังหวะรักษาจัดฟัน"],
    matrix_rows: [
      ["Scammon's 4 Curves", "Neural (เร็วสุด, อายุ 6 = 90%) | Lymphoid (สูง ~200% ช่วง 10–12 ปีแล้วฝ่อ!) | General (รูป S-curve ตรงกับคาง/ตัวโต) | Genital", "ต่อม Adenoid/Tonsil โตตอนเด็กอาจอุดทางเดินหายใจ (Mouth breathing ➔ Adenoid facies) แต่มักยุบลงเมื่อโตพ้นวัยรุ่น"],
      ["Cranial Base Synchondroses", "Endochondral ossification: Intersphenoid ปิดแรกเกิด, Spheno-ethmoidal ~6–7 ปี, Spheno-occipital ปิดช้าสุด (~15–20 ปี)", "Spheno-occipital synchondrosis เป็นศูนย์กลางยืดขยายความยาวฐานกะโหลกถึงวัยรุ่น"],
      ["Maxilla vs Mandible Growth & Direction", "Maxilla เคลื่อน ‘Downward & Forward’ (สร้างกระดูกด้านหลัง Tuberosity) | Mandible ยาวไปหลัง-ขึ้นบนที่ Condyle (Ramus ละลายหน้า-พอกหลัง!) ทำให้ตัวฟันถูกพาลง-หน้า", "ลำดับการหยุดโตของ 3 ระนาบ: Transverse (กว้างหยุดก่อนวัยรุ่น!) ➔ AP ➔ Vertical (สูงหยุดช้าสุด ~20+)"],
      ["Timing: Skeletal Class III vs Class II", "Class III (Maxillary deficiency): RME + Facemask อายุ ‘7–9 ปี’! | Class II (Mandibular retrusion): Twin-block / Activator / Headgear ช่วง ‘Peak Growth Spurt (CS3–CS4 / MP3cap)’", "Hand-wrist: ‘S’ = Onset, ‘MP3cap’ = Peak growth, ‘MP3u’ = พ้น Peak; หน้าเบี้ยวโตต่อเนื่องหลังโตเต็มที่ตรวจ ‘Bone scan Tc-99m SPECT’!"]
    ],
    pitfalls: [
      "เข้าใจว่าขากรรไกรล่างโตไปข้างหน้าด้วยการพอกกระดูกที่ปลายคาง (Chin point) — ผิด! กระดูกขากรรไกรล่างโตขึ้นด้านหลังและด้านบนที่ ‘Condyle & Posterior Ramus’ โดยที่ Anterior border of Ramus เกิด ‘Resorption’ เพื่อเปิดที่ให้ฟันกรามขึ้น แล้วดันทั้งขากรรไกรเลื่อนมาข้างหน้า (Displacement)",
      "ทำ RME (Rapid Maxillary Expansion) ในผู้ใหญ่ > 20 ปีโดยไม่ช่วยผ่าตัด (MARPE/SARPE) — Midpalatal suture ประสานแน่นแล้ว จะทำให้ฟันเอียงบานออกนอกกระดูกแทนที่กระดูกจะแยก! และอย่าส่งเพียง CBCT/PA skull เพื่อเช็ก Active condylar hyperplasia เพราะต้องใช้ Tc-99m SPECT Bone scan"
    ],
    pearl: "AAO คัดกรองไม่เกินอายุ 7 ปี | Hand-wrist Peak = MP3cap | Class III Facemask ทำไว (7–9 ปี) vs Class II Functional ทำ Peak (CS3–4) | Active Asymmetry = Tc-99m SPECT!",
    reference: "Proffit's Contemporary Orthodontics 6th ed. (Ch. 2–4); AAO Guidelines"
  },

  "Ortho-Space-Analysis-Appliances": {
    title: "การวิเคราะห์ช่องว่างชุดฟันผสม (Tanaka-Johnston / Ericson & Kurol) & เครื่องมือจัดฟันระยะแรก",
    specialty: "ทันตกรรมจัดฟัน",
    category: "ทันตกรรมจัดฟัน",
    badgeColor: "#059669",
    must_know_topics: [
      "Tanaka-Johnston Formula (4 Mandibular Incisors / 2 + 11.0 บน / + 10.5 ล่าง)",
      "Leeway Space of Nance (บน 0.9 / ล่าง 1.7 mm/ข้าง) vs E-space (2.0–2.5 mm) & Incisor Liability",
      "Palatally Displaced Canine (Ericson & Kurol Sector 1–2 = ~91% หลังถอน C อายุ 10–13 ปี)",
      "Catlan's Lower Inclined Plane (1–3 wks), Z-spring, Lingual Holding Arch & Sealant vs PRR"
    ],
    overview: "การทำนายขนาดฟันเขี้ยวและฟันกรามน้อยถาวรในชุดฟันผสมเพื่อวางแผนพื้นที่ (Space Management) แนวทาง Interceptive PDC รวมถึงการเลือกเครื่องมือแก้ไข Crossbite และนิสัยผิดปกติในเด็ก",
    core_mechanism: "ในระยะ Mixed Dentition ช่วงอายุ 8–9 ปี ฟันหน้าบนอาจแยกห่างเล็กน้อยจากหน่อเขี้ยวบนดันรากฟันตัดข้าง (Broadbent's Ugly Duckling Stage) ซึ่งหายเองได้เมื่อซี่ 3 ขึ้น — ห้ามรีบเอาเครื่องมือไปดึงชิดก่อนเช็กฟิล์ม! สำหรับการคำนวณช่องว่างใช้ความกว้างรวมของ 4 ฟันตัดล่าง (∑LI) เข้าสูตร Tanaka-Johnston เพื่อทำนายผลรวมซี่ 3, 4, 5 แต่ละข้าง: ขากรรไกรบน = (∑LI/2) + 11.0 mm, ขากรรไกรล่าง = (∑LI/2) + 10.5 mm (แม่นยำ ~75%) และใช้ Lingual Holding Arch เก็บ Leeway space (บน 0.9, ล่าง 1.7 mm/ข้าง; ต่างจาก E-space เฉพาะ e−5 ~2.0–2.5 mm/ข้าง) เพื่อชดเชย Incisor liability (ล่าง ~5–6 mm, บน ~7 mm)",
    matrix_headers: ["การวิเคราะห์ / เครื่องมือเด็ก", "สูตรคำนวณ & เกณฑ์ข้อบ่งชี้", "การแยกภาวะปกติ vs ต้องรีบรักษา"],
    matrix_rows: [
      ["Tanaka-Johnston & Leeway Space", "Maxilla (3+4+5) = (∑4 Lower Incisors ÷ 2) + 11.0 mm | Mandible = (∑4 Lower Incisors ÷ 2) + 10.5 mm | Nance Leeway: บน 0.9 / ล่าง 1.7 mm/ข้าง", "E-space (e−5) ล่างกว้าง ~2.0–2.5 mm/ข้าง แต่ 3>c ~0.8 mm จึงเหลือ Net Leeway 1.7 mm/ข้าง; ใส่ LHA เมื่อ 4 ฟันตัดล่างขึ้นแล้ว"],
      ["Ugly Duckling & Ectopic Canine (PDC)", "Ugly Duckling: อายุ ~8–11 ปี ห่าง ≤ 2 mm ปลายบาน | PDC (Ericson & Kurol): ประเมิน Pano Sector 1–5 + Alpha (α) angle", "Ugly Duckling รอดูจน 3 ขึ้น (เช็ก Mesiodens ด้วย PA); หาก PDC อยู่ Sector 1–2 ไม่มีรากร่น/ที่พอ ถอน C ช่วง 10–13 ปี หายเอง ~91%!"],
      ["Posterior Functional Crossbite", "ฟันบนแคบเล็กน้อย ➔ เวลาหุบกัดฟันล่างไถลเบี่ยงไปด้านหนึ่ง (CR ≠ MI Shift!)", "ต้องรีบรักษาทันทีในชุดฟันน้ำนมปลาย-ฟันผสม (Quad-helix, W-arch, Hyrax RME) เพื่อกันขากรรไกรโตเบี้ยวถาวร!"],
      ["Anterior Crossbite & Sealant vs PRR", "Dental crossbite: Z-spring (Labial crown tipping) หรือ Catlan’s Lower Fixed Inclined Plane (45°, 1–3 สัปดาห์, ไม่เกิน 4 wks!)", "ADA/AAPD Sealant vs PRR: Non-cavitated enamel caries (ICDAS 1–2) ➔ Sealant ไม่ต้องกรอ | Localized enamel breakdown (ICDAS 3) ➔ PRR"]
    ],
    pitfalls: [
      "เผลอดึงปิดช่องว่างฟันหน้าห่าง (Diastema) ในเด็กอายุ 9 ปีที่เป็น Ugly duckling stage ด้วยยาง Elastic loop ตรงๆ — อาจดันรากซี่ 2 ชนกับหน่อฟันเขี้ยวทำให้รากซี่ 2 ละลาย (Root resorption)!",
      "ใส่ Lower Fixed Inclined Plane (Catlan’s) นานเกิน 3–4 สัปดาห์ (เสี่ยงฟันหลังงอกย้อยเกิด Anterior open bite) หรือเลือก Posterior bite plane แก้ Skeletal Class II with deep bite (ต้องใช้ Activator หรือ Anterior bite plane เท่านั้น!)"
    ],
    pearl: "Tanaka-Johnston: บน +11.0, ล่าง +10.5 | Leeway Nance: 0.9/1.7 (E-space 2.0–2.5) | PDC Sector 1–2 ถอน C ได้ผล ~91% | Catlan ≤ 3–4 wks!",
    reference: "Proffit's Contemporary Orthodontics 6th ed. (Ch. 6 & 11–13); Ericson & Kurol 1988; ADA/AAPD Guidelines"
  },

  "Ortho-Retention-Relapse": {
    title: "การคงสภาพฟันหลังจัดฟัน (Retention) และสาเหตุของการคืนกลับ (Relapse)",
    specialty: "ทันตกรรมจัดฟัน",
    category: "ทันตกรรมจัดฟัน",
    badgeColor: "#059669",
    must_know_topics: [
      "PDL Reorganization (3–4 เดือน) vs Supracrestal Gingival Elastic Fibers (> 1 ปี)",
      "Full-Time (3–6 เดือนแรก) ➔ Part-Time Nighttime Retention",
      "Circumferential Supracrestal Fiberotomy (CSF / Edwards Procedure)",
      "Hawley (Allows Settling) vs Vacuum-Formed / Essix vs Bonded Lingual Retainer"
    ],
    overview: "กลไกทางชีววิทยาหลังถอดเครื่องมือจัดฟันที่ทำให้ฟันพยายามเคลื่อนกลับสู่ตำแหน่งเดิม แผนการใส่รีเทนเนอร์ และหัตถการศัลยกรรมตัดเส้นใยเหงือกป้องกันการหมุนกลับ",
    core_mechanism: "หลังถอด Bracket เส้นใยคอลลาเจนของ PDL ใช้เวลาจัดเรียงตัวใหม่ ~3–4 เดือน (ช่วงนี้ฟันจึงโยกเล็กน้อยและคืนกลับไวสุด ต้องใส่ Retainer ตลอด 24 ชม.) ทว่า Supracrestal gingival fibers (กลุ่ม Transseptal & Elastic oxytalan) ยืดค้างนาน > 1 ปี จึงคอยดึงฟันที่เคยหมุน (Rotation) กลับมาบิดเหมือนเดิม การทำ CSF (Circumferential Supracrestal Fiberotomy) ก่อนถอดเครื่องมือจะตัดใยเหล่านี้ลดการหมุนซ้ำได้มาก",
    matrix_headers: ["ตัวแปร / ชนิดรีเทนเนอร์", "ระยะเวลาและกลไกชีววิทยา", "ข้อบ่งชี้เฉพาะกรณี"],
    matrix_rows: [
      ["ตารางการใส่มาตรฐาน (Proffit)", "3–4 เดือนแรก: Full-time (ยกเว้นกิน/แปรงฟัน) ➔ ถึง 12 เดือน: Part-time (ทุกคืน) ➔ หลัง 1 ปี: คืนเว้นคืน/ยาวนาน (Lifelong nighttime)", "เนื่องจากฟันหน้าล่างซ้อนเกตามวัย (Late crowding) เกิดจาก Late mandibular growth และแรงริมฝีปากได้ตลอดชีวิต"],
      ["CSF Surgery (Fiberotomy)", "กรีดคมมีด #11/#12 เข้าไปใน Sulcus รอบคอฟันลึกถึงยอดกระดูก (ตัด Supracrestal fibers โดยไม่เปิด Flap และไม่ตัดกระดูก!)", "ทำในฟันที่เคย ‘หมุนบิด (Severely rotated teeth)’ 1–2 สัปดาห์ก่อนถอดเครื่องมือ (ห้ามทำในจุดที่ Gingiva บางไม่มี Attached gingiva ด้านแก้ม!)"],
      ["Hawley vs Essix (Clear Overlay)", "Hawley: อะคริลิก + Labial bow, ทนทาน, ยอมให้ฟันหลังสบแน่นขึ้น (Settling) | Essix: สวยใส คุมฟันหมุนดี แต่กัน Settling และพังง่ายในคนนอนกัดฟัน", "หากต้องการปิด/คุมฟันหลังสบเพิ่มหลังถอด ➔ ใช้ Hawley (หรือ Begg wrap-around retainer ไม่ข้ามการสบฟัน!)"],
      ["Permanent / Bonded Lingual Retainer", "ลวดถักยึดติดด้านหลังฟันหน้า 6 ซี่ (3–3 หรือ 2–2)", "ข้อบ่งชี้สำคัญ: Midline Diastema กว้าง, ผู้ป่วยปริทันต์ที่กระดูกสูญเสียมาก, หรือเคสยืดขยาย/ดันฟันหน้าล่างออกมามาก"]
    ],
    pitfalls: [
      "ตัดเหงือกทำ Frenectomy เพื่อปิด Midline Diastema **ก่อน** จัดฟันดึงฟันชิด — แผลเป็นจากการผ่าตัด (Scar tissue) จะขวางไม่ให้ฟันขยับชิดกัน! ต้องจัดฟันดึงชิดก่อน (หรือทำท้ายสุดก่อนใส่ Retainer) จึงค่อยตัด Frenum",
      "แนะนำให้คนไข้เลิกใส่ Retainer 100% เมื่อครบ 1 ปี — ฟันจะซ้อนเกกลับมาได้จาก Aging & Equilibrium imbalance"
    ],
    pearl: "PDL คืนรูป 3–4 เดือน | Supracrestal Elastic Fibers > 1 ปี ➔ ใช้ Full-time 3–6 ด. ➔ CSF แก้ฟันบิดหมุน | Diastema: ดึงชิดก่อนค่อยตัด Frenum + ใส่ Fixed Retainer!",
    reference: "Proffit's Contemporary Orthodontics 6th ed. (Ch. 17)"
  },

  "Ortho-Anchorage-TADs": {
    title: "การควบคุมหลักยึดทางจัดฟันและหมุด TADs (Anchorage & Force Levels)",
    specialty: "ทันตกรรมจัดฟัน",
    category: "ทันตกรรมจัดฟัน",
    badgeColor: "#059669",
    must_know_topics: [
      "Optimal Light Continuous Force (Tipping 35–60g, Bodily 70–120g, Intrusion 10–20g)",
      "Anchorage Classification: Group A (Max ≥75% Retraction), B (50:50), C (Protraction)",
      "Center of Resistance (CRe) vs Moment-to-Force Ratio (M/F Ratio)",
      "TADs / Miniscrews Indications, Stability & Safe Interradicular Zones"
    ],
    overview: "ขนาดแรงอุดมคติสำหรับการเคลื่อนฟันแต่ละรูปแบบ การป้องกันภาวะ Hyalinization และรากฟันละลาย รวมถึงการใช้หมุดจัดฟัน TADs เพื่อให้ได้ Absolute Skeletal Anchorage",
    core_mechanism: "กฎข้อที่ 3 ของนิวตันทำให้เมื่อดึงฟันหน้าถอย ฟันหลังจะโดนแรงดึงมาข้างหน้าเท่ากัน (Reciprocal force) จึงต้องควบคุม Anchorage โดยเพิ่มจำนวนรากฟันหลักยึด ใช้แรงเบามาก (เพื่อไม่ให้แรงต่อฟันเดี่ยวไปกระตุ้น Undermining resorption แต่พอให้ฟันเคลื่อนได้ หรือใช้ Differential pressure) หรือปัก TADs ยึดกระดูกโดยตรง (Absolute anchorage: ฟันหลังไม่ขยับเลย 100%) ที่สำคัญ Intrusion ใช้แรงเบาที่สุด (~10–20 g/ซี่) เพราะแรงทั้งหมดกดลงจุดปลายรากจุดเดียว เสี่ยง Root resorption สูงสุด!",
    matrix_headers: ["รูปแบบการเคลื่อนฟัน / TADs", "แรงที่เหมาะสม (Proffit) & M/F Ratio", "กลไก & ข้อควรระวังสำคัญ"],
    matrix_rows: [
      ["Tipping & Extrusion", "35–60 g ต่อซี่ (M/F ~0 ➔ Uncontrolled tipping ที่ CRe; M/F ~5–7 ➔ Controlled tipping)", "Uncontrolled tipping: มงกุฎไปทางหนึ่ง ปลายรากเด้งไปทิศตรงข้าม (Center of rotation อยู่แถว Apex/CRe)"],
      ["Bodily Movement (Translation)", "70–120 g ต่อซี่ (M/F Ratio ประมาณ 8–10:1)", "ต้องใส่ Torque/Couple ใน Bracket เพื่อชดเชยแรงที่ห่างจาก Center of Resistance (CRe อยู่ที่ 1/3–1/2 ของรากในกระดูก)"],
      ["Intrusion (กดฟันเข้าในกระดูก)", "10–20 g ต่อซี่! (เบาที่สุดในทุกการเคลื่อนฟัน!)", "แรงรวมจุดที่ปลายราก ถ้าใช้แรงหนักจะเกิด Capillary occlusion, Hyalinization และ Blunting/Shortening of Root!"],
      ["TADs (Miniscrews / Skeletal Anchorage)", "ยึดด้วย Mechanical retention กับ Cortical bone (ไม่ใช่ Osseointegration แบบ Implant จึงถอดออกง่าย!)", "เหมาะดึงฟันหน้าถอยเต็มที่ (Max anchorage) หรือ Intrude ฟันกรามบนย้อย (Supraerupted molar) ป้องกันต้องทำ Anterior subapical surgery; ระวังปักโดนรากฟันหรือ Sinus"]
    ],
    pitfalls: [
      "เข้าใจว่า Intrusion ต้องใช้แรงเยอะที่สุดเพราะกดต้านกระดูกทึบ — ตรงกันข้าม! Intrusion ต้องใช้แรง ‘เบาที่สุด (10–20 g)’ เพื่อป้องกัน Apical Root Resorption",
      "เข้าใจว่า TADs ยึดติดกับกระดูกด้วย Osseointegration เหมือน Dental Implant — ไม่ใช่! TADs ยึดด้วย Mechanical interlocking ของเกลียวใน Cortical bone เพื่อให้สามารถขันถอดได้ง่ายหลังเสร็จงาน"
    ],
    pearl: "Intrusion ใช้แรงเบาสุด (10–20 g)! | Bodily = 70–120 g (M/F 8–10:1) | CRe อยู่กลางรากในกระดูก | TADs ยึดด้วย Mechanical Interlock (ไม่ Osseointegrate)!",
    reference: "Proffit's Contemporary Orthodontics 6th ed. (Ch. 8–9)"
  },

  // ── COMMUNITY DENTISTRY & BIOSTATISTICS (4) ───────────────────────────────
  "Community-Epidemiological-Indices": {
    title: "วิทยาการระบาดและดัชนีสภาวะสุขภาพช่องปาก (DMFT, CPI, SiC, Dean's)",
    specialty: "ทันตกรรมชุมชน",
    category: "ทันตกรรมชุมชน",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "DMFT (32/28 ซี่, กฎอายุ < 30 vs ≥ 30 ปี ของ WHO 5th ed.) & dmft (20 ซี่)",
      "SiC Index (Significant Caries Index — ค่าเฉลี่ย DMFT ของ 1/3 ที่ผุสูงสุด)",
      "CPI / CPITN Index (Codes 0–4 & 10 Index Teeth / WHO Probe 0.5 mm Ball Tip)",
      "Dean's Fluorosis Index (Worst Two Teeth ➔ Lesser Score Rule) & OHI-S (Greene-Vermillion)"
    ],
    overview: "เกณฑ์การให้คะแนนและจุดหลอกยอดนิยมในดัชนีสำรวจสภาวะช่องปากขององค์การอนามัยโลก (WHO Oral Health Surveys 5th ed.) ที่ใช้ออกสอบ NL เป็นประจำ",
    core_mechanism: "ความแม่นยำของข้อมูลระบาดวิทยาขึ้นอยู่กับ Calibration (วัด Intra/Inter-examiner ด้วย Cohen's Kappa > 0.8) และกติกาจำเพาะของแต่ละดัชนี: เช่น DMFT หาก 1 ซี่มีทั้ง ‘รอยผุ (D)’ และ ‘วัสดุอุด (F)’ ให้นับเป็น ‘D (ผุ)’ อย่างเดียวเพื่อให้แต่ละซี่มีคะแนนสูงสุด = 1 (ค่า DMFT รวมไม่เกิน 28 หรือ 32); แต่ถ้าในเด็กชุดฟันผสมฟันแท้และฟันน้ำนมอยู่ร่วมกันให้แยกบันทึก DMFT และ dmft ไม่เอามาบวกรวมในดัชนีเดียวกัน!",
    matrix_headers: ["ดัชนีทันตสาธารณสุข", "กฎการนับคะแนน & ซี่ตรวจ (Criteria)", "จุดหลอกยอดนิยมในข้อสอบ NL"],
    matrix_rows: [
      ["DMFT / dmft (WHO Criteria)", "ซี่เดียวกันที่มีทั้ง ‘ผุและอุด’ นับเป็น D; ถ้าถอน M: อายุ < 30 ปี นับเฉพาะที่ถอนจากฟันผุ | อายุ ≥ 30 ปี นับที่ถอนทุกสาเหตุ (ยกเว้นไม่นับฟันคุด M8 ใน WHO 5th ed.)", "White spot lesion (ICDAS 1–2 ยังไม่เป็นรูทะลุ) ในเกณฑ์ WHO ยังไม่นับเป็น D (Decayed)! นับเมื่อเป็นโพรง/พื้นนิ่มชัดเจน"],
      ["SiC Index (Significant Caries)", "เรียงค่า DMFT ประชากรจากมากไปน้อย เลือกกลุ่ม ‘1/3 บนสุดที่มีฟันผุมากที่สุด’ แล้วหาค่าเฉลี่ย DMFT", "ใช้แก้ปัญหาค่าเฉลี่ย DMFT ทั้งประเทศที่ต่ำหลอก (Skewed distribution) เพื่อสะท้อนกลุ่มเสี่ยงสูงอายุ 12 ปี (เป้าหมาย ≤ 3.0)"],
      ["CPI / CPITN Index", "WHO Probe (ลูกกลมปลาย 0.5 mm, แถบดำ 3.5–5.5 mm); Index teeth ผู้ใหญ่ 10 ซี่ (17/16, 11, 26/27, 47/46, 31, 36/37)", "0=ปกติ, 1=เลือดออก, 2=หินน้ำลาย, 3=ร่องลึก 4–5 mm, 4=ร่องลึก ≥ 6 mm (เด็ก <15 ปี บันทึกแค่ Code 0,1,2 ป้องกัน False pocket จากฟันกำลังขึ้น!)"],
      ["Dean's Fluorosis & OHI-S", "Dean's: ประเมินจาก ‘ฟัน 2 ซี่ที่ผิดปกติมากสุด’ ถ้า 2 ซี่รุนแรงไม่เท่ากัน ให้ลงคะแนนของซี่ที่ ‘น้อยกว่า (Lesser)’! | OHI-S = DI-S + CI-S (6 พื้นผิว: 16B, 11La, 26B, 36L, 31La, 46L)", "OHI-S ตรวจด้าน ‘Lingual’ สำหรับฟันกรามล่าง (36, 46) และด้าน ‘Buccal/Labial’ สำหรับฟันบน (16, 11, 26) และ 31!"]
    ],
    pitfalls: [
      "ลืมเกณฑ์ Dean's Index ข้อ 2 ซี่: ถ้าซี่ที่รุนแรงสุดได้ระดับ 3 (Mild) และซี่รองลงมาได้ระดับ 2 (Very mild) ➔ คำตอบที่ถูกต้องคือคะแนน **2 (ซี่ที่น้อยกว่า)** ไม่ใช่ 3 หรือค่าเฉลี่ย!",
      "เอา CPI ไปวัดหา Pocket Depth (Code 3–4) ในเด็กอายุ < 15 ปี ➔ ผิดกฎ WHO! เด็ก < 15 ปีฟันเพิ่งขึ้นมักมี Pseudopocket ห้ามให้ Code 3/4"
    ],
    pearl: "ผุ+อุดในซี่เดียว = นับ D | OHI-S กรามล่างตรวจด้าน ‘Lingual’ (บนตรวจ Buccal) | Dean's 2 ซี่ไม่เท่า = เอาซี่ ‘น้อยกว่า’ | <15 ปี CPI ห้ามลง Code 3–4!",
    reference: "WHO Oral Health Surveys: Basic Methods 5th ed. (2013) & กรมอนามัย"
  },

  "Community-Health-Promotion-Ottawa": {
    title: "การสร้างเสริมสุขภาพตามกฎบัตรออตตาวา (Ottawa Charter) และระดับการป้องกันโรค",
    specialty: "ทันตกรรมชุมชน",
    category: "ทันตกรรมชุมชน",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "5 Action Areas of Ottawa Charter (1986)",
      "Leavell & Clark 3 Levels of Prevention (Primary, Secondary, Tertiary)",
      "Geoffrey Rose: Whole-Population Strategy vs High-Risk Strategy",
      "Behavior Change Models (HBM, Transtheoretical Stages of Change, PRECEDE-PROCEED)"
    ],
    overview: "กรอบแนวคิดสากลด้านการสร้างเสริมสุขภาพ (Ottawa Charter) การจำแนกกิจกรรมทันตกรรมลงในระดับการป้องกันทั้ง 3 ขั้น และทฤษฎีปรับเปลี่ยนพฤติกรรมทางสุขภาพ",
    core_mechanism: "กฎบัตรออตตาวาเน้นย้ายจุดศูนย์ถ่วงจากการสอนให้คนไข้แปรงฟันอย่างเดียวไปสู่โครงสร้างสังคม-นโยบาย (เช่น กฎหมายภาษีเครื่องดื่มน้ำตาล, โรงเรียนปลอดขนมหวาน, น้ำประปาผสมฟลูออไรด์) ซึ่งให้ผลลดภาระโรคระดับประชากรสูงกว่า (Population Paradox ของ Geoffrey Rose) สำหรับระดับการป้องกันของ Leavell & Clark ให้ยึด ‘ระยะของการเกิดโรค’: ยังไม่ป่วย = Primary (Fluoride/Sealant ป้องกัน), เริ่มมีโรคแล้ว = Secondary (ตรวจคัดกรอง/อุดฟัน/ขูดหินน้ำลาย/Remin รอยผุ White spot), พิการสูญเสียอวัยวะ = Tertiary (ใส่ฟันเทียม)",
    matrix_headers: ["แนวคิด / ขอบข่ายงาน", "รายละเอียด & ตัวอย่างกิจกรรมทันตกรรมในไทย", "จุดแยกแยะความสับสนในข้อสอบ"],
    matrix_rows: [
      ["Ottawa Charter 5 ด้าน", "1) นโยบายสาธารณะ (ภาษีความหวาน/กฎโรงเรียนปลอดน้ำอัดลม) 2) สิ่งแวดล้อมเอื้อต่อสุขภาพ (น้ำ/เกลือฟลูออไรด์, มุมแปรงฟันใน รร.) 3) ชุมชนเข้มแข็ง (อสม./ชมรมผู้สูงอายุ) 4) ทักษะส่วนบุคคล (สอนแปรง 2-2-2) 5) ปรับระบบบริการ (เน้นป้องกัน)", "การออกข้อบังคับห้ามขายลูกอมในโรงเรียน = ‘Healthy Public Policy’; การจัดแปรงสีฟัน-น้ำดื่มสะอาดในโรงเรียน = ‘Supportive Environment’"],
      ["Primary vs Secondary Prevention", "Primary (ยังไม่เกิดโรค): Oral hygiene education, F- varnish/Sealant ฟันปกติ | Secondary (Early Dx & Prompt Tx): คัดกรองรอยโรค, อุดฟัน, ขูดหินน้ำลาย, รักษาฟันผุระยะต้น", "ข้อสอบชอบถาม ‘Pit & Fissure Sealant’ ในฟันร่องลึกปกติ (Primary) vs การทาวานิชหยุดรอยผุระยะเริ่มต้น/อุดฟันเล็ก (Secondary)"],
      ["Tertiary Prevention", "Disability limitation & Rehabilitation: ฟื้นฟูสภาพบดเคี้ยวและป้องกันทุพพลภาพซ้ำซ้อน", "เช่น การใส่ RPD, Complete Denture, โครงการฟันเทียมพระราชทาน หรือทำฟันเทียมให้ผู้สูงอายุ"],
      ["Transtheoretical Stages of Change", "Precontemplation (ไม่คิดเปลี่ยน) ➔ Contemplation (ลังเล 6 ด.) ➔ Preparation (เตรียมตัวใน 1 ด.) ➔ Action (<6 ด.) ➔ Maintenance (>6 ด.)", "ถ้าคนไข้ยังอยู่ใน Precontemplation ให้ใช้ Motivational Interviewing เพิ่มความตระหนัก (อย่ารีบยัดเยียดทักษะสอนแปรง!)"]
    ],
    pitfalls: [
      "จัด ‘การอุดฟันผุระยะเริ่มต้น (Class I เล็กๆ)’ เป็น Primary Prevention — ผิด! เมื่อเกิดโรคฟันผุขึ้นแล้ว การรักษาตั้งแต่ระยะเริ่มต้นเพื่อหยุดการลุกลามจัดเป็น ‘Secondary Prevention (Early Diagnosis & Prompt Treatment)’",
      "สลับระหว่าง ‘Personal Skills’ (สอน/ฝึกทักษะแปรงฟัน) กับ ‘Strengthen Community Action’ (ให้ผู้ปกครอง/ชุมชน/แกนนำเป็นผู้ริเริ่มขับเคลื่อนแก้ไขปัญหาเอง)"
    ],
    pearl: "Ottawa Policy = ออกกฎ/ภาษี | Supportive Env = สภาพแวดล้อม/มุมแปรง | ยังไม่เป็นโรค (Sealant ป้องกัน) = Primary | มีโรคแล้วรีบอุด/คัดกรอง = Secondary | ใส่ฟันเทียม = Tertiary!",
    reference: "WHO Ottawa Charter (1986) / Burt & Eklund & กองทันตสาธารณสุข กรมอนามัย"
  },

  "Community-Health-Systems-Insurance": {
    title: "ระบบบริการสุขภาพและ 3 กองทุนหลักประกันสุขภาพไทย (UCS, SSS, CSMBS)",
    specialty: "ทันตกรรมชุมชน",
    category: "ทันตกรรมชุมชน",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "3 กองทุนไทย: บัตรทอง (UCS/สปสช.), ประกันสังคม (SSS/สปส.), ข้าราชการ (CSMBS)",
      "การจ่ายเงิน: Capitation (เหมาจ่ายรายหัว) vs DRGs (ผู้ป่วยใน) vs Fee-for-Service",
      "สิทธิทันตกรรมเฉพาะ: ประกันสังคม 900 บ./ปี (ขูด-อุด-ถอน) + แยกวงเงินผ่าฟันคุด 1,500–2,500 บ./ซี่ (มีผล 1 พ.ค. 2569) | บัตรทอง 30 บาทรักษาทุกที่ 3 ครั้ง/ปี",
      "สำรวจครั้งที่ 9 (พ.ศ. 2566): 12 ปี DMFT=1.2 | 60–74 ปี มีฟัน ≥20 ซี่ 60.9% | 80–85 ปี 27.7% | ยาสีฟัน 5,000 ppm เป็นยาอันตราย (2569)"
    ],
    overview: "โครงสร้างระบบหลักประกันสุขภาพถ้วนหน้าของไทย เปรียบเทียบสิทธิประโยชน์ด้านทันตกรรม วิธีจ่ายชดเชยค่าบริการ และนโยบายส่งเสริมสุขภาพช่องปากระดับชาติของกรมอนามัย",
    core_mechanism: "ระบบประกันสุขภาพไทยแบ่งเป็น 3 กองทุนหลักที่มีแหล่งเงินและวิธีจ่ายต่างกัน: บัตรทอง (สปสช.) ใช้เหมาจ่ายรายหัว (Capitation สำหรับผู้ป่วยนอกและส่งเสริมป้องกัน) + Global budget DRGs (ผู้ป่วยใน) ช่วยคุมงบประมาณรวม และมีนโยบาย '30 บาทรักษาทุกที่' รับบริการพื้นฐานที่คลินิกเอกชนร่วมโครงการได้ 3 ครั้ง/ปี; ประกันสังคม (ผู้ประกันตน ม.33/ม.39) จ่ายเหมาจ่ายกรณีเจ็บป่วยทั่วไป และแยก ‘สิทธิทันตกรรม’ (ขูด อุด ถอน) 900 บาท/ปี (ไม่ต้องสำรองจ่ายในคลินิก MOU) โดย**ตั้งแต่ 1 พ.ค. 2569** แยกวงเงิน **ผ่าฟันคุด** ออกจาก 900 บาทเป็นสูงสุด 1,500 บ./ซี่ (ไม่ซับซ้อน) หรือ 2,500 บ./ซี่ (ซับซ้อน); ข้าราชการ (กรมบัญชีกลาง) ใช้ Fee-for-Service ใน รพ.รัฐ",
    matrix_headers: ["กองทุน / โครงการระดับชาติ", "หน่วยงานรับผิดชอบ & กลไกจ่ายเงิน", "สิทธิประโยชน์ทันตกรรมที่ออกสอบ"],
    matrix_rows: [
      ["หลักประกันสุขภาพแห่งชาติ (บัตรทอง / UCS)", "สปสช. (NHSO); Capitation (OP/PP) + DRGs (IP)", "ครอบคลุม ขูด อุด ถอน รักษารากฟัน ฟันเทียมพื้นฐาน SSC เด็กตามข้อบ่งชี้แพทย์ และงาน P&P (ฟลูออไรด์วานิช/Sealant) รวมถึง '30 บาทรักษาทุกที่' คลินิกเอกชน 3 ครั้ง/ปี"],
      ["ประกันสังคม (SSS ม.33, ม.39)", "สำนักงานประกันสังคม; เหมาจ่าย รพ.ตามสิทธิ + สิทธิ์ทันตกรรมแยก", "ขูด อุด ถอน เบิกตามจริงไม่เกิน **900 บาท/ปี** (ไม่สำรองจ่ายในคลินิก MOU) + **ตั้งแต่ 1 พ.ค. 2569 แยกผ่าฟันคุดเป็น 1,500 บ./ซี่ (ไม่ซับซ้อน) และ 2,500 บ./ซี่ (ซับซ้อน)**; ฟันเทียมเบิกเพิ่มในรอบ 5 ปี"],
      ["สวัสดิการข้าราชการ (CSMBS)", "กรมบัญชีกลาง กระทรวงการคลัง; Fee-for-Service (เบิกจ่ายตรง)", "เบิกค่ารักษาทันตกรรมพื้นฐานและซับซ้อนที่สถานพยาบาลของรัฐตามอัตราที่กรมบัญชีกลางกำหนด (บุตรอายุไม่เกิน 20 ปีบริบูรณ์)"],
      ["สำรวจสุขภาพช่องปากไทย ครั้งที่ 9 (2566)", "สำนักทันตสาธารณสุข กรมอนามัย", "กลุ่มอายุดัชนี: 3, 5, 12, 15, 35–44, 60–74, 80–85 ปี | ผลครั้งที่ 9: 12 ปี DMFT=1.2, 60–74 ปี ≥20 ซี่ = 60.9%, 80–85 ปี = 27.7% | ยาสีฟัน ≤1,500 ppm (5,000 ppm = ยาอันตราย พ.ศ. 2569)"]
    ],
    pitfalls: [
      "เข้าใจว่าสิทธิประกันสังคม 900 บาท/ปี ยังรวมผ่าฟันคุดหรือฟันเทียมทั้งหมด — ตั้งแต่วันที่ **1 พ.ค. 2569** แยกผ่าฟันคุดออกจากวงเงิน 900 บาทแล้ว (1,500 / 2,500 บ./ซี่) ส่วนฟันเทียมเบิกแยกในรอบ 5 ปี",
      "คิดว่าสิทธิบัตรทองไม่ครอบคลุม Fluoride varnish หรือ SSC ในเด็ก — ความจริงครอบคลุมทั้ง P&P และ curative ตามข้อบ่งชี้ทางการแพทย์ ณ หน่วยบริการตามสิทธิ!",
      "สลับวิธีจ่ายของข้าราชการ (Fee-for-Service — เสี่ยง Supplier-induced demand) กับบัตรทอง (Capitation — เสี่ยง Under-service หากไม่กำกับคุณภาพ)"
    ],
    pearl: "ประกันสังคม = ขูด-อุด-ถอน 900 บ./ปี + แยกผ่าฟันคุด 1,500/2,500 บ. (1 พ.ค. 2569) | บัตรทอง = Capitation + P&P + 30 บาทรักษาทุกที่ (3 ครั้ง/ปี) | สำรวจครั้งที่ 9 (2566): 12 ปี DMFT=1.2, 60–74 ปี 60.9%, 80–85 ปี 27.7%!",
    reference: "สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.) / สำนักงานประกันสังคม / สำนักทันตสาธารณสุข"
  },

  "Community-Study-Designs-Hypothesis": {
    title: "รูปแบบวิจัยทางคลินิก ระบาดวิทยาวิเคราะห์ (OR/RR) และสถิติทดสอบ",
    specialty: "ทันตกรรมชุมชน",
    category: "ทันตกรรมชุมชน",
    badgeColor: "#14b8a6",
    must_know_topics: [
      "Study Designs: Cross-sectional (Prevalence) vs Case-Control (OR) vs Cohort (RR) vs RCT",
      "Types of Bias (Recall, Selection, Loss to Follow-up, Hawthorne, Confounding)",
      "95% CI Interpretation (คลุม 1 สำหรับ OR/RR vs คลุม 0 สำหรับ Mean Difference)",
      "Choosing Parametric vs Non-Parametric Tests (t-test, ANOVA, Chi-square, Mann-Whitney U, Kruskal-Wallis)"
    ],
    overview: "การเลือกรูปแบบการวิจัยให้เหมาะกับคำถามวิจัย การคำนวณและแปลผล Odds Ratio (OR) กับ Relative Risk (RR) การควบคุมอคติ และการเลือกสถิติวิเคราะห์ข้อมูล",
    core_mechanism: "Case-Control เริ่มจากกลุ่มเป็นโรคและไม่เป็นโรคแล้วย้อนดูอดีต จึงหาได้เฉพาะ ‘Odds Ratio (OR)’ เหมาะกับโรคหายากและมีจุดอ่อนคือ ‘Recall bias’ ส่วน Cohort เริ่มจากกลุ่มสัมผัสปัจจัยเสี่ยงแล้วติดตามไปข้างหน้า จึงคำนวณ ‘Incidence และ Relative Risk (RR)’ ได้ แต่ใช้เวลานานและเสี่ยง ‘Loss to follow-up’ สำหรับ RCT ใช้ ‘Randomization’ เป็นเครื่องมือทรงพลังที่สุดในการกระจายตัวแปรกวน (Confounders) ที่ไม่ทราบค่าให้เท่ากันทั้งสองกลุ่ม",
    matrix_headers: ["เงื่อนไขข้อมูล / งานวิจัย", "รูปแบบวิจัย / สถิติที่เลือกใช้", "ตัวชี้วัด & ข้อควรระวังในการแปลผล"],
    matrix_rows: [
      ["Case-Control vs Cohort", "Case-Control: Retrospective ➔ Odds Ratio = (a×d)/(b×c) | Cohort: Prospective ➔ Relative Risk = [a/(a+b)] / [c/(c+d)]", "OR/RR > 1 = ปัจจัยเสี่ยง; < 1 = ปัจจัยป้องกัน; หาก **95% CI คลุมเลข 1** ➔ ไม่มีนัยสำคัญทางสถิติ (p ≥ 0.05)!"],
      ["เทียบค่าเฉลี่ย 2 กลุ่ม vs ≥ 3 กลุ่ม", "2 กลุ่ม: Independent t-test (Paired t-test ถ้าวัดซ้ำคนเดิม) | ≥ 3 กลุ่ม: One-way ANOVA (+ Post-hoc เช่น Tukey/Bonferroni)", "หากข้อมูล ‘ไม่แจกแจงปกติ / Ordinal’: 2 กลุ่มอิสระ ➔ **Mann-Whitney U** | จับคู่ ➔ Wilcoxon | ≥ 3 กลุ่ม ➔ **Kruskal-Wallis**"],
      ["เทียบสัดส่วน / กลุ่ม (Categorical)", "กลุ่มอิสระ: **Chi-square test** (ถ้า Expected count < 5 เกิน 20% ใช้ **Fisher's Exact Test**!)", "ข้อมูลจับคู่แบบ Categorical ก่อน-หลัง ➔ **McNemar test**"],
      ["Errors, Power & NNT", "Type I (α = 0.05): ปฏิเสธ H0 ทั้งที่จริง (False +) | Type II (β): ยอมรับ H0 ทั้งที่ผิด (Power = 1−β ≥ 80%)", "NNT (Number Needed to Treat) = 1 ÷ ARR (Absolute Risk Reduction: อัตราป่วยกลุ่มคุม ลบ กลุ่มทดลอง) ยิ่ง NNT น้อย ยิ่งมีประสิทธิภาพ!"]
    ],
    pitfalls: [
      "ใช้ Relative Risk (RR) กับงานวิจัย Case-Control หรือ Cross-sectional — ทำไม่ได้! เพราะ Case-Control กำหนดจำนวนผู้ป่วยไว้ล่วงหน้าไม่ทราบ Incidence จริง จึงคำนวณได้เฉพาะ Odds Ratio (OR)",
      "เจอ 95% CI ของ Mean difference ที่ค่า [−0.5 ถึง +3.2] แล้วสรุปว่าต่างกัน — Mean difference ถ้าช่วง CI **คลุมเลข 0** = ไม่ต่าง! (ต่างจาก OR/RR ที่เช็กการ **คลุมเลข 1**)"
    ],
    pearl: "Case-Control = OR (เสี่ยง Recall Bias) | Cohort = RR (วัด Incidence ได้) | RCT = Randomization แก้ Confounder | OR/RR CI คลุม 1 ไม่ Significant | ข้อมูลเบ้ 2 กลุ่ม = Mann-Whitney U!",
    reference: "Gordis Epidemiology 6th ed. & Altman Practical Statistics for Medical Research"
  },

  // ── DENTAL LAW, ETHICS & FORENSIC ODONTOLOGY (4) ──────────────────────────
  "Law-Dental-Profession-Act": {
    title: "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 และอำนาจหน้าที่ของทันตแพทยสภา",
    specialty: "กฎหมายและจรรยาบรรณ",
    category: "กฎหมายและจรรยาบรรณ",
    badgeColor: "#f43f5e",
    must_know_topics: [
      "องค์ประกอบ & อำนาจหน้าที่คณะกรรมการทันตแพทยสภา (สมาชิก vs กรรมการแต่งตั้ง/เลือกตั้ง)",
      "มาตรา 28 & 50: ความผิดฐานประกอบวิชาชีพโดยไม่ได้ขึ้นทะเบียนและรับใบอนุญาต",
      "ข้อยกเว้นมาตรา 29 (นักศึกษาในความควบคุม, ปฐมพยาบาลฉุกเฉิน, บุคลากร มอบหมาย ม.29)",
      "การต่ออายุใบอนุญาตทุก 5 ปี (CME/CE Credits ตาม พ.ร.บ. ฉบับที่ 2 พ.ศ. 2559)"
    ],
    overview: "โครงสร้างกฎหมายหลักที่ควบคุมการประกอบวิชาชีพทันตกรรมในประเทศไทย คุณสมบัติผู้ขอรับใบอนุญาต โทษอาญาของหมอเถื่อน และบทบาทของทันตแพทยสภาในการกำกับมาตรฐาน",
    core_mechanism: "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 (และฉบับแก้ไขเพิ่มเติม พ.ศ. 2559) กำหนดให้ทันตแพทยสภามีหน้าที่รับรองปริญญา สอบเพื่อออกใบอนุญาต ควบคุมจรรยาบรรณ และกำหนดให้ใบอนุญาตประกอบวิชาชีพมีอายุคราวละ 5 ปี ต้องเก็บหน่วยกิตการศึกษาต่อเนื่อง (CE) เพื่อต่ออายุ ตามมาตรา 28 ห้ามผู้ใดแสดงตนหรือประกอบวิชาชีพโดยไม่มีใบอนุญาต เว้นแต่เข้าข้อยกเว้นมาตรา 29 เช่น นักศึกษาทำหัตถการในความดูแลของอาจารย์ หรือช่วยชีวิตฉุกเฉินโดยไม่หวังประโยชน์",
    matrix_headers: ["บทบัญญัติ / มาตราสำคัญ", "สาระสำคัญที่ออกสอบบ่อย", "บทลงโทษ / ผลทางกฎหมาย"],
    matrix_rows: [
      ["มาตรา 28 & มาตรา 50 (หมอเถื่อน)", "ห้ามผู้ใดประกอบวิชาชีพทันตกรรมหรือแสดงด้วยวิธีใดๆ ให้ผู้อื่นเข้าใจว่าตนมีสิทธิ โดยมิได้ขึ้นทะเบียนและรับใบอนุญาต", "โทษอาญา: จำคุกไม่เกิน **3 ปี** หรือปรับไม่เกิน **30,000 บาท** หรือทั้งจำทั้งปรับ! (รวมถึงผู้ที่ถูก ‘พักใช้/เพิกถอนใบอนุญาต’ แล้วแอบรักษา)"],
      ["มาตรา 29 (ข้อยกเว้นที่ทำได้โดยไม่ผิด ม.28)", "1) ช่วยเหลือฉุกเฉิน/ปฐมพยาบาลโดยไม่รับประโยชน์ 2) นทพ.ฝึกปฏิบัติในความควบคุมอาจารย์ 3) บุคคลที่ ก.สาธารณสุขมอบหมายเป็นหนังสือ (เช่น ทันตาภิบาล)", "ผู้ช่วยทันตแพทย์ ‘ไม่มีสิทธิ’ ยกเว้นตาม ม.29 หากจับเครื่องมือขูด อุด ถอนในปากคนไข้ถือว่าผิด ม.28!"],
      ["พ.ร.บ. ฉบับที่ 2 (พ.ศ. 2559) อายุใบอนุญาต", "ใบอนุญาตประกอบวิชาชีพทันตกรรมมีอายุคราวละ **5 ปี** และต้องมีคะแนนการศึกษาต่อเนื่อง (CDEC) เพื่อต่ออายุ (ผู้ได้รับใบอนุญาตก่อน พ.ร.บ. 2559 ยังใช้สิทธิเดิมตามบทเฉพาะกาล)", "ทันตแพทย์ใหม่ที่จบหลังกฎหมายมีผลต้องสะสมหน่วยกิต CE และต่ออายุทุก 5 ปี"],
      ["มาตรา 39 (คำวินิจฉัยชี้ขาดจรรยาบรรณ)", "เมื่ออนุกรรมการจรรยาบรรณสอบสวนและคณะกรรมการทันตแพทยสภาพิจารณาชี้ขาด (ความเห็นชอบของสภานายกพิเศษฯ ตามขั้นตอน)", "ลงโทษได้ 4 สถาน: **ว่ากล่าวตักเตือน / ภาคทัณฑ์ / พักใช้ใบอนุญาต (ไม่เกิน 2 ปี) / เพิกถอนใบอนุญาต** (ขอขึ้นใหม่ได้หลังพ้น 2 ปีกรณีเพิกถอนตามเกณฑ์)"]
    ],
    pitfalls: [
      "สับสนโทษอาญามาตรา 28/50 กับบทลงโทษจรรยาบรรณมาตรา 39: ‘หมอเถื่อน’ หรือคนไม่มีใบอนุญาต โดนโทษอาญา (จำคุกไม่เกิน 3 ปี / ปรับ 30,000 บาท) ขึ้นศาลยุติธรรม; ทันตแพทยสภาลงโทษได้เฉพาะสมาชิกทันตแพทย์ (4 สถานเท่านั้น ไม่สามารถสั่งจำคุกใครได้!)",
      "ลืมระยะเวลาพักใช้ใบอนุญาตสูงสุด: ทันตแพทยสภาสั่ง ‘พักใช้ใบอนุญาต’ ได้มีกำหนดเวลาตามที่เห็นสมควร แต่ ‘ไม่เกิน 2 ปี’ (ไม่ใช่ 5 ปี)"
    ],
    pearl: "ไม่มีใบอนุญาต (ม.28/50) = จำคุก ≤ 3 ปี ปรับ ≤ 30,000 บ. | ทันตแพทยสภาลงโทษ 4 สถาน (พักใช้ ≤ 2 ปี) | ใบอนุญาตใหม่ต่ออายุทุก 5 ปี (CDEC)!",
    reference: "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 และ (ฉบับที่ 2) พ.ศ. 2559"
  },

  "Law-Forensic-Odontology-DVI": {
    title: "นิติทันตวิทยา การพิสูจน์เอกลักษณ์ INTERPOL DVI และประเมินอายุ",
    specialty: "กฎหมายและจรรยาบรรณ",
    category: "กฎหมายและจรรยาบรรณ",
    badgeColor: "#f43f5e",
    must_know_topics: [
      "INTERPOL DVI 3 Primary Identifiers (Dental, Fingerprints, DNA)",
      "Antemortem (AM: สีเหลือง) vs Postmortem (PM: สีชมพู) & Non-Explainable Discrepancy",
      "Child/Adolescent Age Estimation (Schour & Massler, Demirjian 8-Stage < 18 ปี)",
      "Adult Age Estimation (Gustafson 6 Criteria / Root Translucency ดีที่สุด & Kvaal's Radiograph)"
    ],
    overview: "บทบาทของทันตแพทย์ในการพิสูจน์เอกลักษณ์บุคคลจากภัยพิบัติหมู่ตามมาตรฐาน INTERPOL และเทคนิคการประมาณอายุจากฟันทั้งวิธีไม่ทำลายชิ้นเนื้อและวิธีตัดเนื้อฟัน",
    core_mechanism: "เคลือบฟันเป็นเนื้อเยื่อที่แข็งที่สุดในร่างกาย ทนทานต่อความร้อน (>1000°C) และความเน่าเปื่อย Dental records จึงเป็น 1 ใน 3 Primary Identifiers ของ INTERPOL DVI ที่ยืนยันตัวตนได้โดยลำพัง การเทียบข้อมูลให้ดูหลักการ ‘Exclusion’: เพียงพบ ‘1 จุดขัดแย้งที่อธิบายไม่ได้’ (เช่น AM มีฟันซี่ 16 อุดทอง แต่ PM มีซี่ 16 ปกติไม่เคยอุด หรือ AM ถอนไปแล้วแต่ PM ยังอยู่) สามารถคัดออกทันที (Exclude) ส่วนการประเมินอายุในเด็กแม่นยำกว่าผู้ใหญ่มากเพราะอาศัยพัฒนาการสร้างรากฟัน (Demirjian)",
    matrix_headers: ["งานนิติทันตวิทยา", "เกณฑ์ / วิธีมาตรฐาน (Methods)", "ข้อสรุปและจุดเน้นในข้อสอบ"],
    matrix_rows: [
      ["INTERPOL DVI Forms & Identifiers", "Primary (3 อย่าง): 1) DNA 2) Fingerprints 3) Dental comparison | Secondary: เสื้อผ้า, แผลเป็น, พยานบอกเล่า", "แบบฟอร์ม: **Antemortem (AM) สีเหลือง** vs **Postmortem (PM) สีชมพู** (รวมผลยืนยันลงแบบฟอร์มขาว Comparison)"],
      ["ข้อสรุปผลเทียบฟัน (ABFO / DVI)", "Positive Identification (ตรงกันละเอียดไร้ข้อขัดแย้ง) | Possible | Insufficient | **Exclusion** (พบความขัดแย้งที่อธิบายไม่ได้)", "อธิบายได้ (Explainable discrepancy): เช่น AM ถ่าย 3 ปีก่อนไม่มีอุดซี่ 36 ต่อมา PM พบซี่ 36 อุดแล้ว (เป็นไปได้!) แต่มุมกลับ PM ฟันดีทั้งที่ AM เคยถอนไปแล้ว ➔ Exclude ทันที!"],
      ["ประเมินอายุเด็ก/วัยรุ่น (< 20 ปี)", "Schour & Massler Atlas (ภาพรวม), Moorrees หรือ **Demirjian's 8 Stages (A–H)** บนฟัน 7 ซี่ล่างซ้ายจาก OPG", "แม่นยำที่สุด! หลังจากฟัน 7 ซี่ปิดรากหมดแล้ว ช่วงอายุ ~14–22 ปี ใช้ดูการพัฒนาของ ‘ฟันคุด (Third Molar)’"],
      ["ประเมินอายุผู้ใหญ่ (> 21 ปี)", "**Gustafson's 6 Criteria** (A,P,S,C,R,T ต้องตัดฟัน) vs **Kvaal's Radiographic Method** (วัดขนาด Pulp ที่หดแคบ ไม่ทำลายฟัน)", "ใน 6 เกณฑ์ของ Gustafson (Attrition, Periodontosis, Secondary dentin, Cementum, Root resorption, Root translucency): **Root Translucency (Sclerotic apex)** แม่นยำสูงสุด!"]
    ],
    pitfalls: [
      "จำสลับสีแบบฟอร์ม INTERPOL: ‘AM (ก่อนตาย) = เหลือง (Yel-low)’ | ‘PM (หลังตาย) = ชมพู (Pink = P-M!)’ จำง่าย: P = Pink = Postmortem!",
      "ใช้ Kvaal หรือ Gustafson ไปประเมินอายุเด็ก 10 ขวบ — ไม่เหมาะ! เด็ก 10 ขวบต้องใช้พัฒนาการสร้างหน่อ-รากฟัน (Demirjian / Moorrees) ซึ่งแม่นยำกว่าหลายเท่า"
    ],
    pearl: "Primary ID = DNA / Fingerprint / Dental | Pink = PM, Yellow = AM | AM ไม่มีซี่ 16 แต่ PM มี = Exclude! | ผู้ใหญ่ Gustafson: Root Translucency แม่นสุด!",
    reference: "INTERPOL DVI Guide (2018/2023) & ตำรานิติทันตวิทยา ราชวิทยาลัยทันตแพทย์ฯ"
  },

  "Law-Ethics-Code-Advertising": {
    title: "ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณ การโฆษณา และสิทธิผู้ป่วย",
    specialty: "กฎหมายและจรรยาบรรณ",
    category: "กฎหมายและจรรยาบรรณ",
    badgeColor: "#f43f5e",
    must_know_topics: [
      "หลักปฏิบัติต่อผู้ป่วย (มาตรฐานวิชาชีพ, ไม่ปฏิเสธผู้ป่วยฉุกเฉิน, ไม่เรียกสินจ้างเกินควร)",
      "จรรยาบรรณต่อเพื่อนร่วมวิชาชีพ (ไม่วิจารณ์ทับถม, ไม่แย่งผู้ป่วย)",
      "ข้อห้ามการโฆษณา: โอ้อวดเกินจริง, Before-After/รีวิวชักจูง, ลดแลกแจกแถม, คำขวัญชวนเชื่อ",
      "ขั้นตอนขออนุญาตโฆษณาสถานพยาบาล (พ.ร.บ. สถานพยาบาล — สบส.)"
    ],
    overview: "กรอบศีลธรรมและข้อบังคับทางกฎหมายที่ทันตแพทย์ไทยต้องยึดถือในการดูแลผู้ป่วย การให้ข้อมูลสื่อสารสาธารณะ การวิจารณ์งานเพื่อนร่วมวิชาชีพ และการโฆษณาคลินิก",
    core_mechanism: "ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณฯ แยก ‘การให้ความรู้ทางวิชาการต่อสาธารณะ’ (ทำได้ ไม่แอบแฝงชักจูงมาคลินิกตน) ออกจาก ‘การโฆษณาโอ้อวดหรือชักจูง’ (ห้ามทำ) การแจ้งเปิดคลินิกอนุญาตให้แจ้งเฉพาะข้อมูลจริง ได้แก่ ชื่อ-สกุล คุณวุฒิที่ทันตแพทยสภารับรอง เวลาทำการ ที่อยู่ และอัตราค่าบริการ (ต้องระบุช่วงราคาจริง) ห้ามใช้คำว่า ‘ดีที่สุด ไร้เจ็บ ปราศจากความเสี่ยง 100%’ หรือจัดโปรโมชันลดราคาแจกแถมชิงโชค และต้องไม่ทับถมงานรักษาก่อนหน้าของทันตแพทย์ท่านอื่น",
    matrix_headers: ["ประเด็นจรรยาบรรณ / โฆษณา", "สิ่งที่ ‘ทำได้’ โดยชอบธรรม", "สิ่งที่ ‘ผิดข้อบังคับจรรยาบรรณ’ ทันที"],
    matrix_rows: [
      ["การประชาสัมพันธ์คลินิก & ค่าบริการ", "แจ้งชื่อ คุณวุฒิ (วุฒิบัตร/อนุมัติบัตรเฉพาะทางที่สภารับรอง), เวลาทำการ, ช่วงอัตราค่าบริการที่เป็นจริง (เช่น ขูดหินน้ำลาย 800–1,200 บ.)", "ลดแลกแจกแถม จับฉลากชิงรางวัล จัดโปรโมชัน ‘ฟรี 1 แถม 1’ หรือใช้คำโอ้อวด ‘สวยเป๊ะ 100% / ไม่เจ็บแน่นอน / ดีที่สุดในย่านนี้’"],
      ["ภาพ Before-After / รีวิวคนไข้ / TikTok", "ให้ความรู้วิชาการแก่ประชาชนโดยไม่ขายของแอบแฝง และขออนุญาตโฆษณาจาก สบส. ตาม พ.ร.บ. สถานพยาบาล", "ลงรูป Before-After เพื่อโฆษณาชวนเชื่อ/รับประกันผล หรือจ้าง Influencer รีวิวอ้างสรรพคุณเกินจริง!"],
      ["ความเห็นต่อผลงานทันตแพทย์คนก่อน", "แจ้งสภาพฟันปัจจุบันและความจำเป็นในการแก้ไขแก่ผู้ป่วยตามหลักวิชาการอย่างสุภาพเป็นกลาง", "พูดใส่ร้าย/ตำหนิให้ผู้ป่วยฟังว่าหมอคนเก่า ‘ทำชุ่ย วางยา ผิดพลาดไร้มาตรฐาน’ (ทำลายเกียรติเพื่อนร่วมวิชาชีพ)"],
      ["การส่งต่อและปฏิเสธผู้ป่วย", "ปฏิเสธกรณีไม่มีความพร้อมเครื่องมือ/ไม่เชี่ยวชาญเฉพาะทาง โดยแนะนำ/ส่งต่ออย่างเหมาะสม และดูแลเบื้องต้นถ้าฉุกเฉิน", "ปฏิเสธไม่ช่วยบรรเทาอาการฉุกเฉินเฉียบพลัน หรือทอดทิ้งผู้ป่วยกลางคันโดยไม่มีเหตุสมควร"]
    ],
    pitfalls: [
      "ใส่คำว่า ‘ผู้เชี่ยวชาญ / Specialist’ ต่อท้ายชื่อทั้งที่ไม่ได้รับวุฒิบัตรหรืออนุมัติบัตรจากทันตแพทยสภา (จบแค่คอร์สอบรมระยะสั้นในต่างประเทศ/เอกชน) — ผิดจรรยาบรรณฐานแสดงวุฒิ/ความเชี่ยวชาญเกินจริง!",
      "เขียนป้าย ‘จัดฟันผ่อนเดือนละ 999 บ. ฟรี X-ray + รีเทนเนอร์’ — ผิดทั้งจรรยาบรรณชักจูง/ลดแลกแจกแถม และผิด พ.ร.บ. สถานพยาบาลหากไม่ได้รับอนุมัติข้อความโฆษณา!"
    ],
    pearl: "ห้ามลดแลกแจกแถม / ห้ามคำโอ้อวด / ห้ามทับถมเพื่อนร่วมวิชาชีพ / ห้ามแอบอ้างคำว่า ‘ผู้เชี่ยวชาญ’ หากไม่ได้รับวุฒิบัตรหรืออนุมัติบัตรสภารับรอง!",
    reference: "ข้อบังคับทันตแพทยสภา ว่าด้วยการรักษาจรรยาบรรณแห่งวิชาชีพทันตกรรม พ.ศ. 2553 & สบส."
  },

  "Law-Health-Acts-PDPA-Consent": {
    title: "พ.ร.บ. สุขภาพแห่งชาติ Living Will (ม.12), ความลับ (ม.323) และ PDPA",
    specialty: "กฎหมายและจรรยาบรรณ",
    category: "กฎหมายและจรรยาบรรณ",
    badgeColor: "#f43f5e",
    must_know_topics: [
      "พ.ร.บ. สุขภาพแห่งชาติ มาตรา 7 (ความลับ/สิทธิขอข้อมูล), มาตรา 8 (Informed Consent), มาตรา 12 (Living Will)",
      "ประมวลกฎหมายอาญา มาตรา 323 (ความผิดฐานเปิดเผยความลับวิชาชีพ)",
      "PDPA มาตรา 26 (Sensitive Data — ข้อมูลสุขภาพ/รูปใบหน้า/ฟิล์มต้องขอ Explicit Consent)",
      "อายุการเก็บรักษาเวชระเบียน (พ.ร.บ. สถานพยาบาล ≥ 5 ปี) & ผู้แทนผู้เยาว์ (< 20 ปี)"
    ],
    overview: "สิทธิขั้นพื้นฐานของผู้ป่วยและหน้าที่คุ้มครองความลับทางคลินิกภายใต้กฎหมาย 4 ฉบับสำคัญที่ออกสอบร่วมกันบ่อย ได้แก่ พ.ร.บ. สุขภาพแห่งชาติ ประมวลกฎหมายอาญา PDPA และ พ.ร.บ. สถานพยาบาล",
    core_mechanism: "ข้อมูลการรักษา ภาพถ่ายในปาก-ใบหน้า และผลตรวจเลือดจัดเป็น ‘ข้อมูลสุขภาพส่วนบุคคลที่มีความอ่อนไหว (Sensitive Data — มาตรา 26 PDPA)’ ผู้ป่วยเป็นเจ้าของข้อมูลตามมาตรา 7 พ.ร.บ. สุขภาพแห่งชาติ (ขอสำเนาเวชระเบียน/ภาพ X-ray ของตนเองได้เสมอ คลินิกห้ามปฏิเสธ!) ในขณะที่ทันตแพทย์ถูกผูกมัดด้วย ป.อาญา มาตรา 323 ห้ามเปิดเผยความลับแก่บุคคลอื่นเว้นแต่ผู้ป่วยยินยอมหรือกฎหมายบังคับ (เช่น คำสั่งศาล, แจ้งโรคติดต่ออันตราย) ส่วนมาตรา 12 คุ้มครองการปฏิบัติตาม ‘หนังสือแสดงเจตนาไม่ประสงค์รับบริการสาธารณสุขในวาระสุดท้ายของชีวิต (Living Will)’ โดยยังคงต้องดูแลบรรเทาทุกข์ตามปกติ",
    matrix_headers: ["กฎหมาย / มาตรา", "หลักเกณฑ์เฉพาะที่ออกสอบบ่อย", "ข้อยกเว้น & ความรับผิดทางกฎหมาย"],
    matrix_rows: [
      ["พ.ร.บ. สุขภาพฯ ม.12 (Living Will)", "ผู้ป่วยทำหนังสือแสดงเจตนาไม่รับบริการเพื่อยืดการตายในวาระสุดท้าย (เช่น ไม่ใส่ท่อช่วยหายใจ/ไม่ปั๊มหัวใจ)", "บุคลากรการแพทย์ที่ทำตามเจตนาโดยสุจริต **ไม่มีความผิด** แต่ยังคงต้องให้การดูแลประคับประคอง (Palliative Care)"],
      ["พ.ร.บ. สุขภาพฯ ม.7 & ม.8 (ข้อมูล & Consent)", "ม.8: ต้องอธิบายให้เข้าใจก่อนรับบริการ (ความยินยอมโดยได้รับข้อมูล) | ม.7: ข้อมูลสุขภาพเป็นความลับ + ผู้ป่วยมีสิทธิขอสำเนาประวัติตนเอง", "ภาวะฉุกเฉินอันตรายถึงชีวิต/ไม่มีผู้แทนทำแทนได้ ทันตแพทย์ช่วยชีวิตก่อนได้; ผู้เยาว์ < 20 ปี (ไม่สมรส) ต้องให้พ่อแม่/ผู้ปกครองลงนามในหัตถการเสี่ยง"],
      ["ป.อาญา มาตรา 323 (เปิดเผยความลับ)", "ผู้ประกอบวิชาชีพแพทย์/ทันตแพทย์เปิดเผยความลับของผู้ป่วยที่รู้มาจากการงานในลักษณะน่าจะเกิดความเสียหาย", "โทษอาญา: จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท (ความผิดอันยอมความได้); ยกเว้นเมื่อเปิดเผยตามหน้าที่กฎหมาย/หมายศาล/ได้รับอนุญาต"],
      ["PDPA มาตรา 26 & การเก็บเวชระเบียน", "โพสต์รูปใบหน้าคนไข้/ผลวินิจฉัยลงเพจคลินิกหรือสอนโดยระบุตัวตนได้ ➔ ต้องขอ **Explicit Consent** แยกชัดเจน", "กฎกระทรวงฯ พ.ร.บ. สถานพยาบาล: ต้องเก็บเวชระเบียนและหลักฐานบริการไว้ไม่น้อยกว่า **5 ปี** นับแต่วันสุดท้ายที่มารับบริการ"]
    ],
    pitfalls: [
      "ปฏิเสธไม่ให้สำเนาภาพถ่ายรังสีหรือประวัติการรักษาเมื่อผู้ป่วยร้องขอ โดยอ้างว่าเป็นทรัพย์สินของคลินิก — คลินิกเก็บตัวจริงไว้ได้ตาม พ.ร.บ. สถานพยาบาล 5 ปี แต่ต้องทำ ‘สำเนา’ ส่งมอบให้ผู้ป่วยตาม พ.ร.บ. สุขภาพฯ ม.7 & PDPA!",
      "นำเคสคนไข้ HIV หรือรูปก่อน-หลังที่เห็นใบหน้าไปโพสต์ให้ความรู้บน Facebook ส่วนตัวโดยไม่เบลอ/ไม่ขอความยินยอมเฉพาะเจาะจง ➔ ผิดทั้ง ป.อาญา ม.323, PDPA ม.26 และข้อบังคับจรรยาบรรณ!"
    ],
    pearl: "Living Will = พ.ร.บ. สุขภาพฯ ม.12 | Informed Consent = ม.8 | เปิดเผยความลับ = ป.อาญา ม.323 | รูป/ข้อมูลสุขภาพ = PDPA ม.26 (Explicit Consent) | เก็บเวชระเบียน ≥ 5 ปี!",
    reference: "พ.ร.บ. สุขภาพแห่งชาติ พ.ศ. 2550 (ม.7, 8, 12) / ป.อาญา ม.323 / PDPA พ.ศ. 2562 / กฎกระทรวงฯ สถานพยาบาล"
  }
};

export default CLINICAL_STUDY_GUIDES_EXTRA_2;
