// Extended Masterclass Study Guides Part 1 (32 Topics: Endo 8, OMFS 6, Perio 9, Operative 7, TMD 2)
// Lazy-loaded by ClinicalStudyHub.jsx to keep main bundle lean while giving 83/83 topic coverage.

export const CLINICAL_STUDY_GUIDES_EXTRA_1 = {
  // ── ENDODONTICS (8) ───────────────────────────────────────────────────────
  "Endo-Instrumentation-Obturation": {
    title: "การขยายและอุดคลองรากฟันด้วยวัสดุชีวภาพ (WL Control & Obturation)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "Apical Constriction (0.5–1.0 mm จาก Radiographic Apex)",
      "Electronic Apex Locator (EAL) + Radiograph",
      "Master Apical File (MAF) & Tug-back",
      "Bioceramic / Calcium Silicate vs Resin Sealer",
      "Coronal Orifice Barrier (1–2 mm)"
    ],
    overview: "การกำหนดความยาวทำงาน (Working Length) ที่แม่นยำบริเวณ Apical Constriction (Minor diameter) และการอุดปิด 3 มิติด้วย Gutta-percha + Sealer เป็นหัวใจป้องกันการรั่วซึมทั้งจากปลายรากและตัวฟัน (Coronal microleakage)",
    core_mechanism: "การขยายแบบ Crown-down ลดความดันฉุดรั้งที่ส่วน Coronal ก่อน ทำให้ไฟล์ส่วนปลายวัด EAL ได้ตรงและลดโอกาสยัดเยียดเศษเชื้อออกปลายราก (Apical extrusion) เมื่อได้ Tug-back ที่ WL จึงอุดด้วย Lateral compaction, Warm vertical หรือ Single-cone ร่วมกับ Bioceramic sealer ที่อาศัยความชื้นเล็กน้อยในคลองรากสร้าง Hydroxyapatite tag ยึดผนัง",
    matrix_headers: ["เทคนิค / วัสดุ", "หลักการทำงานและข้อบ่งชี้", "ข้อจำกัด / ข้อควรระวังสำคัญ"],
    matrix_rows: [
      ["Electronic Apex Locator (EAL)", "วัดความต้านทานไฟฟ้าของเยื่อปริทันต์ที่ Apical constriction แม่นยำ >90%", "คลาดเคลื่อนได้หากมีโลหะสัมผัสไฟล์, ช่องเปิดรากกว้างเกินไป, หรือคลองรากเปียก NaOCl ท่วมจนล้น"],
      ["Cold Lateral Compaction", "อัด Master cone + Accessory cones ด้วย Spreader ทำนายความยาวง่าย", "ใช้เวลาและอาจเกิดช่องว่างระหว่าง Cones; แรงอัดมากเกินเสี่ยง VRF ในรากบาง"],
      ["Warm Vertical (Schilder)", "ให้ความร้อนทำให้ GP อ่อนตัวไหลเข้า Lateral canals และ Isthmus ดีเยี่ยม", "เสี่ยงวัสดุเกินปลายรากในปลายรากเปิด และต้องรักษา Apical matrix ให้ชัดเจน"],
      ["Bioceramic (Calcium Silicate) Sealer", "Bioactive, pH เป็นด่างสูง ~12, หดตัวน้อย เหมาะกับ Single-cone กึ่งไฮดรอลิก", "ต้องเหลือความชื้นเล็กน้อยในท่อฟัน (ห้ามเช็ดแห้งสนิทด้วยแอลกอฮอล์) และรื้อยากหากแข็งตัวเต็มคลองราก"]
    ],
    pitfalls: [
      "หลงเชื่อตัวเลข 1 mm จากฟิล์ม X-ray 2 มิติเพียงอย่างเดียว โดยลืมว่า Apical foramen มักเยื้องข้างไม่ได้อยู่ตรงปลายสุดของราก (Radiographic apex)",
      "ลืมปิด Orifice barrier หลังตัด GP ส่งผลให้เกิด Coronal leakage ภายในไม่กี่วันหากวัสดุอุดชั่วคราวหลุดร่วง"
    ],
    pearl: "กฎทอง: ตรวจ EAL ก่อนเสมอ ➔ ยืนยันด้วยฟิล์มรังสี (ไม่ให้เลย Radiographic apex) ➔ ลอง Master Cone ให้ได้ Tug-back แล้วจึงอุด!",
    reference: "Cohen's Pathways of the Pulp 12th ed. (Ch. 8–9) & สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE)"
  },

  "Endo-Complications-Fractures": {
    title: "ภาวะแทรกซ้อนทางเอ็นโดดอนต์และรากฟันแตกร้าว (VRF & Perforations)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "Vertical Root Fracture (VRF): J-shaped Radiolucency & Narrow Deep Pocket",
      "Furcation & Strip Perforation Repair (MTA / Biodentine)",
      "Ledge Formation & Zipping",
      "Separated File Management & Danger Zone"
    ],
    overview: "การแยกแยะรอยโรคที่เกิดจากการหักแตกร้าวของรากฟัน (VRF) ออกจากความล้มเหลวของคลองรากฟันหรือโรคปริทันต์ รวมถึงวิธีซ่อมแซมรูทะลุ (Perforation) และเครื่องมือหักอย่างทันท่วงที",
    core_mechanism: "VRF มักเกิดในฟันรักษารากที่มีการใช้เดือยใหญ่เกินไปหรือแรงอัด Lateral compaction สูง รอยร้าวทำให้น้ำลายและเชื้อโรคซึมเข้า PDL เกิดการสลายกระดูกแคบยาวลึกเฉพาะซี่ (Isolated narrow deep pocket) และเงาดำรูปตัว J หรือ Halo รอบราก ส่วนรูทะลุที่พื้นโพรงประสาทต้องอุดซ่อมทันทีด้วย Bioceramics เพื่อป้องกัน Bone breakdown บริเวณ Furcation",
    matrix_headers: ["ภาวะแทรกซ้อน", "อาการ/ภาพรังสีจำเพาะ (Pathognomonic)", "การจัดการและพยากรณ์โรค"],
    matrix_rows: [
      ["Vertical Root Fracture (VRF)", "Narrow deep isolated pocket 1 ตำแหน่ง + Sinus tract คู่ใกล้ขอบเหงือก + J-shaped/Halo radiolucency", "Hopeless (รากเดียว: ถอนฟัน; ฟันหลายราก: พิจารณา Root resection/Hemisection รากที่แตกออก)"],
      ["Furcation / Coronal Perforation", "เลือดซึมจากพื้นโพรงประสาท ไฟล์วัด Apex locator ขึ้นสีแดงทันทีแม้ตื้น", "ล้าง NaOCl ห้ามเลือด ปิดซ่อมทันทีด้วย MTA หรือ Biodentine ยิ่งปิดเร็วโอกาสสำเร็จยิ่งสูง"],
      ["Strip Perforation (Danger Zone)", "เกิดด้านใน (Distal surface ของราก Mesial ฟันกรามล่าง) จากการใช้ Gates Glidden ใหญ่เกินไป", "หลีกเลี่ยงในระยะป้องกันแบบ Anti-curvature filing; หากเกิดแล้วซ่อมด้วย Matrix + MTA/Bioceramic"],
      ["Separated Instrument", "เห็นท่อนไฟล์สว่างทึบในคลองราก", "ขึ้นกับตำแหน่ง & เวลา: ต้น-กลาง ➔ Bypass/Ultrasonic ออก; 1/3 ปลายหลังล้างสะอาด ➔ อุดทับ + นัด Follow-up"]
    ],
    pitfalls: [
      "จับฟันที่มี J-shaped radiolucency และ Isolated deep pocket ไปรื้อรักษารากฟันซ้ำ (Retreatment) โดยไม่สงสัย VRF ทำให้เสียเวลาและกระดูกละลายมากขึ้น",
      "อุด Amalgam ซ่อม Perforation ซึ่งปัจจุบันล้าสมัยและรั่วซึมสูง — ข้อสอบตอบ MTA / Biodentine เท่านั้น"
    ],
    pearl: "Narrow deep pocket + J-shaped lesion + ประวัติใส่ Post/รักษาราก = Vertical Root Fracture จนกว่าจะพิสูจน์เป็นอย่างอื่น (ต้องถอน!)",
    reference: "Cohen's Pathways of the Pulp 12th ed. & AAE Position Statement on Cracked Teeth"
  },

  "Endo-Resorption": {
    title: "การละลายตัวของรากฟันภายในและภายนอก (Internal vs External Resorption)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "SLOB Rule (Clark's Rule) แยก Internal vs External",
      "Internal Inflammatory Resorption & Pink Tooth of Mummery",
      "External Replacement Resorption (Ankylosis — Metallic Percussion Sound)",
      "External Cervical Invasive Resorption"
    ],
    overview: "กลไกการกระตุ้นเซลล์สลายเนื้อฟัน (Odontoclasts) เมื่อชั้นป้องกันภายใน (Predentin) หรือภายนอก (Cementum/PDL) ถูกทำลาย ร่วมกับการวินิจฉัยแยกจากภาพรังสี 2 มุม",
    core_mechanism: "Internal Resorption ต้องมี Vital pulp ด้านล่างเพื่อส่งเลือดเลี้ยง Clastic cells และมีเชื้อกระตุ้นด้านบน ภาพรังสีเห็นคลองราก ‘โป่งขยายกลืนหายไป’ ขอบเรียบสมมาตรและเงาไม่เลื่อนตาม SLOB ส่วน External Resorption คลองรากยังคงเห็นแนวเส้นเดิมพาดผ่านทะลุเงาดำ และเงาเลื่อนตามการขยับมุมถ่ายรังสี",
    matrix_headers: ["ชนิดการละลายตัว", "ลักษณะภาพรังสีและคลินิก", "การรักษาที่ถูกต้อง"],
    matrix_rows: [
      ["Internal Inflammatory Resorption", "คลองรากพองเป็นกระเปาะขอบเรียบ เส้นผนังคลองรากขาดหาย ไม่เลื่อนตาม SLOB", "รักษารากฟันทันที (ตัดเลือดเลี้ยงหยุดโรค) ล้างด้วย NaOCl + อุด Warm Thermoplasticized GP / Bioceramic"],
      ["External Inflammatory Resorption", "พบรอยเว้าผิวราก + เส้นคลองรากพาดผ่านทะลุเงา มักเกิดหลัง Luxation/Avulsion แล้ว Pulp ตาย", "รักษารากฟัน + ใส่ Ca(OH)2 ฆ่าเชื้อลดความเป็นกรดก่อนอุดถาวร (ตรวจพบเมื่อพบร่วมกับ Periapical lesion)"],
      ["External Replacement (Ankylosis)", "หายของ PDL space กระดูกเชื่อมติดเนื้อฟัน เคาะมีเสียงใสกังวาน (Metallic sound) ฟันจมระดับ (Infraocclusion)", "ไม่มีทางรักษาให้หายในตำแหน่งเดิม — ในเด็กที่ยังโตให้พิจารณา Decoronation เพื่อรักษากระดูกเบ้าฟัน"],
      ["Invasive Cervical Resorption", "เงาดำไม่สม่ำเสมอคอฟัน (Pink spot) มักมีประวัติฟอกสีฟันภายในหรือจัดฟัน/อุบัติเหตุ", "เปิด Flap/เข้าถึงรอยโรค ขูด Granulomatous tissue ทา Trichloroacetic acid (TCA) และอุดด้วย GIC/RMGIC/Biodentine"]
    ],
    pitfalls: [
      "เห็น Pink tooth of Mummery แล้วฟันธงทันทีว่าเป็น Internal resorption ทั้งที่ External cervical resorption ก็พบจุดสีชมพูที่คอฟันได้บ่อยกว่า!",
      "พบรอย Replacement resorption แล้วพยายามดึงจัดฟัน — จะทำให้ฟันข้างเคียงล้ม/จมแทนเพราะซี่ Ankylosis ขยับไม่ได้"
    ],
    pearl: "คลองราก ‘กลืนหาย + ไม่เลื่อนตามมุม’ = Internal (ต้องทำ Endo ด่วน) | เห็น ‘ท่อคลองรากพาดผ่าน + เลื่อนตามมุม SLOB’ = External!",
    reference: "Cohen's Pathways of the Pulp 12th ed. & IADT Dental Trauma Guidelines"
  },

  "Endo-Canal-Anatomy-Access": {
    title: "กายวิภาคคลองรากฟันและการกรอเปิดทางเข้า (Krasner & Rankow + MB2)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "Krasner & Rankow Laws (Centrality, Concentricity, Color Change)",
      "MB2 Localization ใน Maxillary First Molar (60–80%)",
      "Vertucci Classification & C-shaped Canal (Asian Mandibular 2nd Molar)",
      "Conservation of Pericervical Dentin (PCD)"
    ],
    overview: "หลักการออกแบบทางเข้าคลองรากฟัน (Access Cavity) แบบอนุรักษ์โครงสร้างคอฟันร่วมกับกฎทางกายวิภาคอ้างอิงที่ CEJ เพื่อค้นหารูเปิดคลองรากครบทุกท่อโดยไม่ทะลุ Furcation",
    core_mechanism: "ที่ระดับ CEJ โพรงประสาทจะอยู่กึ่งกลางตัวฟันเสมอ (Law of Centrality) และมีรูปทรงตามขอบเขตผิวฟันนอก (Law of Concentricity) เมื่อกรอหลังคาโพรงประสาท (Derooting) ออกทั้งหมด พื้นโพรงประสาทจะมีสีเข้มกว่าผนัง (Law of Color Change) และเส้นรอยต่อพัฒนาการสีเข้มจะชี้ตรงไปยัง Orifices (Laws of Orifice Location)",
    matrix_headers: ["ฟัน / กฎสำคัญ", "สถิติ & ตำแหน่งกายวิภาคที่ออกสอบบ่อย", "เทคนิคค้นหาและข้อควรระวัง"],
    matrix_rows: [
      ["Maxillary 1st Molar (4 Canals)", "พบ MB2 สูงมาก (>60–80%) โดยเฉพาะราก Mesiobuccal", "อยู่ Mesial ต่อเส้นเชื่อม MB1–Palatal ประมาณ 1–2 mm ต้องปรับ Outline เป็นรูปสี่เหลี่ยมขนมเปียกปูน (Rhomboid)"],
      ["Mandibular Incisors / 1st Premolar", "ฟันตัดล่างมี 2 คลอง (Labial & Lingual) ~40% | ฟันกรามน้อยล่าง 1 คลองเป็นหลัก (~75%)", "กรอเปิดขยายด้าน Lingual ใต้ Cingulum ในฟันตัดล่าง มิฉะนั้นจะพลาด Lingual canal"],
      ["Mandibular 2nd Molar (C-shaped)", "พบสูงในประชากรเอเชีย (30–45%)", "มีรากหลอมรวมรูปกรวย (Conical root) และร่อง Isthmus โค้งเชื่อม ระวัง Strip perforation ด้าน Lingual/Furcation"],
      ["Law of Color Change & Symmetry", "พื้น (Floor) สีคล้ำตัดกับผนัง Dentin สีขาวเหลือง; Orifice มักสมมาตรซ้าย-ขวา (ยกเว้น Maxillary molars)", "ห้ามกรอพื้นโพรงประสาท! ใช้หัวเบอร์ Endo-Z (Non-cutting tip) เก็บขอบผนังและส่องหาด้วย DG-16"]
    ],
    pitfalls: [
      "อ้างอิงแนวแกนจากครอบฟันหรือตัวฟันที่เอียงบิด ทำให้กรอหลงทิศจน Perforate — ต้องจับนิ้วคลำและอ้างอิงที่ระดับ CEJ เสมอ",
      "ขยาย Access ใหญ่เกินไปจนเสีย Pericervical Dentin ทำให้ฟันต้านแรงแตกหักหลังรักษารากลดลงอย่างมาก"
    ],
    pearl: "CEJ เป็นหมุดหมายทองคำ: Orifice อยู่ที่มุมบรรจบ Floor-Wall ปลายเส้นสีเข้ม และ MB2 อยู่ด้าน Mesial ของเส้น MB1–P!",
    reference: "Krasner & Rankow (J Endod 2004) / Cohen's Pathways of the Pulp 12th ed."
  },

  "Endo-Open-Apex-Management": {
    title: "การจัดการฟันแท้ปลายรากเปิด (Apexogenesis, Apexification & Revascularization)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "Hertwig's Epithelial Root Sheath (HERS)",
      "Apexogenesis (Vital Pulp ➔ VPT / Cvek)",
      "Apexification (Non-Vital ➔ Ca(OH)2 vs MTA Apical Plug)",
      "Regenerative Endodontics / Revascularization"
    ],
    overview: "กลยุทธ์รักษาฟันแท้ในเด็กที่ได้รับบาดเจ็บหรือผุทะลุก่อนรากสร้างเสร็จสมบูรณ์ (Open Apex) เพื่อให้รากพัฒนาต่อหรือสร้างผนึกปลายรากอย่างมั่นคง",
    core_mechanism: "ความมีชีวิตของ Hertwig's Epithelial Root Sheath (HERS) และเนื้อเยื่อโพรงประสาทเป็นตัวขับเคลื่อนการสร้างความยาวและความหนาของรากฟัน (Apexogenesis) หาก Pulp ยังมีชีวิตให้ทำ VPT ทันที แต่ถ้า Pulp ตายแล้วต้องเลือกระหว่างสร้าง Apical barrier ด้วย MTA/Biodentine (Apexification) หรือกระตุ้นสเต็มเซลล์ปลายราก (SCAP) ให้สร้างเนื้อเยื่อและผนังรากต่อ (Regenerative Endodontics)",
    matrix_headers: ["วิธีรักษา", "สภาพ Pulp & ข้อบ่งชี้", "วัสดุ ขั้นตอน & ผลต่อผนังรากฟัน"],
    matrix_rows: [
      ["Apexogenesis (Vital)", "ฟันแท้ปลายรากเปิดที่ Pulp ยังมีชีวิต (เช่น Cvek partial pulpotomy)", "ล้าง NaOCl ห้ามเลือด ปิดด้วย MTA / Biodentine ➔ รากสร้างต่อทั้ง ‘ความยาวและความหนา’"],
      ["Apexification (Ca(OH)2 แบบเดิม)", "ฟันแท้ปลายรากเปิดที่ Pulp ตายแล้ว", "ใส่ Ca(OH)2 เปลี่ยนทุก 3 เดือน (6–18 ด.) เกิด Calcific barrier แต่ผนังรากบางไม่หนาขึ้นและเปราะแตกง่ายหากใส่นาน"],
      ["Apexification (MTA / Bioceramic Plug)", "ฟันแท้ปลายรากเปิดที่ Pulp ตายแล้ว (มาตรฐานปัจจุบันในผู้ใหญ่/วัยรุ่น)", "อัด MTA หนา 3–5 mm ที่ปลายราก ➔ อุดจบไวภายใน 1–2 ครั้ง ลดเสี่ยงรากแตกจากการใส่ Ca(OH)2 นาน แต่รากไม่ยาวขึ้น"],
      ["Regenerative Endodontics (RET)", "ฟันแท้ปลายรากเปิดมาก/ผนังบางที่ Pulp ตาย", "ล้าง NaOCl 1.5–2.5% + EDTA ➔ ใส่ Ca(OH)2/TAP ➔ กระตุ้นเลือดออกเป็น Clot (SCAP) + ปิด MTA ➔ รากหนาและยาวขึ้นได้!"]
    ],
    pitfalls: [
      "ใส่ Ca(OH)2 ค้างนานเกิน 6–12 เดือนในฟันผนังบาง ทำให้พันธะคอลลาเจนเนื้อฟันสลายและเกิด Cervical root fracture สูง",
      "ลืมใช้ 17% EDTA เป็นน้ำยาล้างสุดท้ายก่อนดึงเลือดในเคส Revascularization — EDTA ช่วยปลดปล่อย Growth factors (TGF-beta) จากเนื้อฟัน!"
    ],
    pearl: "รากเปิด + มีชีวิต = Cvek Pulpotomy (Apexogenesis) | รากเปิด + ตายแล้ว = MTA Plug (ไว) หรือ Regenerative Endo (เพิ่มความหนาราก)!",
    reference: "AAE Clinical Considerations for a Regenerative Procedure & IADT Trauma Guidelines"
  },

  "Endo-Microbiology-Infection": {
    title: "จุลชีววิทยาในคลองรากฟันและการติดเชื้อซ้ำ (Biofilms & E. faecalis)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "Primary Infection (Polymicrobial Obligate Anaerobes)",
      "Secondary / Persistent Infection (Enterococcus faecalis & Candida)",
      "Extra-radicular Biofilm (Actinomyces israelii / Propionibacterium)",
      "RDU: ข้อบ่งชี้ Systemic Antibiotic ทางเอ็นโดดอนต์"
    ],
    overview: "ความแตกต่างของชนิดเชื้อจุลชีพในคลองรากฟันที่ไม่เคยรักษามาก่อนกับฟันที่รักษาล้มเหลว เพื่อเลือกน้ำยาล้าง ยาฆ่าเชื้อ และการจ่ายยาปฏิชีวนะอย่างสมเหตุผล",
    core_mechanism: "ในฟันตายที่ไม่เคยรักษา เชื้อเป็น Polymicrobial gram-negative anaerobes (Porphyromonas, Prevotella, Fusobacterium) ไวต่อ NaOCl และ Ca(OH)2 แต่ในฟันที่รักษารากแล้วเกิดติดเชื้อซ้ำ สภาพแวดล้อมขาดอาหารและเป็นด่าง คัดเลือกให้ Enterococcus faecalis (Gram+ facultative anaerobe ที่มี Proton pump ทน pH 12.5 และไชเข้าลึกในท่อฟัน) และ Candida albicans รอดชีวิตเด่น",
    matrix_headers: ["รูปแบบการติดเชื้อ", "เชื้อเด่นที่ออกสอบ (Pathogens)", "เหตุผลความดื้อ & ยา/สารล้างที่จัดการได้"],
    matrix_rows: [
      ["Primary Endodontic Infection", "Obligate anaerobes (Porphyromonas, Prevotella, Fusobacterium, Dialister)", "เจริญในสภาวะ O2 ต่ำ กำจัดได้ผลดีด้วย NaOCl (2.5–5.25%) + การขยายคลองราก"],
      ["Persistent / Retreatment Failure", "Enterococcus faecalis (อันดับ 1!) และ Candida albicans", "E. faecalis มี Proton pump ทนด่าง Ca(OH)2 ➔ ต้องใช้ NaOCl และล้างตามด้วย 2% CHX (คั่นด้วยน้ำเกลือ/EDTA กันตะกอนส้ม PCA)"],
      ["Extra-radicular Infection", "Actinomyces israelii และ Propionibacterium propionicum", "เกาะเป็น Biofilm นอกปลายราก/ในเนื้อเยื่อ รักษารากซ้ำไม่ได้ผล ➔ ต้องทำ Apicoectomy"],
      ["การใช้ Antibiotic ชนิดกิน", "ห้ามจ่ายในเคส Pulpalgia, Necrosis, หรือ Localized Abscess ที่ระบายหนองได้", "ให้เฉพาะเมื่อมี Systemic involvement (ไข้ >38°C, หน้าบวมลาม, ต่อมน้ำเหลืองโต, Immunocompromised) โดยยาแรกคือ Amoxicillin"]
    ],
    pitfalls: [
      "ผสม NaOCl กับ CHX โดยตรงในคลองราก ➔ เกิดตะกอนสีส้มน้ำตาล Parachloroaniline (PCA) ซึ่งอุดตันท่อฟันและเป็นพิษ/สารก่อมะเร็ง",
      "จ่าย Amoxicillin หลังเปิด Drain หนองหรือรักษารากในคนไข้แข็งแรงดีที่ไม่มีไข้ ไม่มีบวมลาม (ผิดหลัก RDU และไม่มีเลือดเข้าไปฆ่าเชื้อในคลองรากที่ตายแล้ว)"
    ],
    pearl: "รักษารากซ้ำล้มเหลว = Enterococcus faecalis (ทน Ca(OH)2 ด้วย Proton pump) ➔ ใช้ NaOCl + น้ำเกลือ/EDTA + 2% CHX!",
    reference: "Siqueira & Rôças / Cohen's 12th ed. & แนวทางการใช้ยาปฏิชีวนะอย่างสมเหตุผล (RDU) ทันตแพทยสภา"
  },

  "Endo-Pulp-Biology-Neurophysiology": {
    title: "ชีววิทยาโพรงประสาทฟันและสรีรวิทยาความเจ็บปวด (A-delta vs C Fibers)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "Brännström's Hydrodynamic Theory",
      "A-delta Fibers vs Unmyelinated C-Fibers",
      "Tertiary Dentin (Reactionary vs Reparative)",
      "Referred Pain & Convergence Theory"
    ],
    overview: "กลไกการรับความรู้สึกปวดเสียวในเนื้อฟันและโพรงประสาทฟัน ความแตกต่างของเส้นประสาท A-delta กับ C-fiber ในการแปลผลอาการทางคลินิก และการตอบสนองซ่อมแซมของ Odontoblasts",
    core_mechanism: "สิ่งเร้าความเย็น ลม หรือน้ำตาลทำให้ของเหลวใน Dentinal tubules เคลื่อนตัวเร็ว (Hydrodynamic theory) ไปกระตุ้นปลายประสาท A-delta ที่มี Myelin อยู่บริเวณขอบโพรงประสาท (เกิดปวดเสียวแหลมคมชัด) ต่อมาเมื่อการอักเสบลุกลามเข้ากลางโพรงประสาท ความดันเพิ่มสูงและขาดออกซิเจน จะกระตุ้น C-fiber ที่ไม่มี Myelin (ปวดตื้อ ปวดตุ้บ ปวดเองตอนกลางคืน)",
    matrix_headers: ["ตัวแปรทางประสาทวิทยา", "A-delta Fibers", "C-Fibers"],
    matrix_rows: [
      ["เยื่อหุ้มไมอีลิน & ตำแหน่ง", "Myelinated (นำสัญญาณเร็ว) อยู่ขอบนอก (Pulp-dentin junction / Raschkow plexus)", "Unmyelinated (นำสัญญาณช้า) อยู่ลึกในแกนกลางของโพรงประสาท"],
      ["ลักษณะอาการปวด", "แหลมแปลบ รู้สึกทันที (Sharp, shooting, rapid) หยุดไวเมื่อเอาสิ่งเร้าออก", "ตื้อ ลึก ปวดตุ้บ ปวดค้างนานหรือปวดเอง (Dull, throbbing, lingering)"],
      ["Threshold & ความทนภาวะขาดเลือด", "Threshold ต่ำ ตอบสนองไวต่อ EPT และ Cold test; เสียสภาพเร็วเมื่อเนื้อเยื่อตาย", "Threshold สูง ตอบสนองต่อความร้อน; ทนทานต่อ Hypoxia นานกว่า (อาจเหลือความเจ็บขณะกรอแม้อ่านผล Necrosis!)"],
      ["การเชื่อมโยงวินิจฉัย", "เด่นใน Dentin hypersensitivity & Reversible pulpitis", "เด่นใน Symptomatic Irreversible Pulpitis & ปวดร้าวไม่ทราบซี่ชัดเจน"]
    ],
    pitfalls: [
      "ฟันแท้ในเด็กที่รากยังเปิด (Immature apex) ยังพัฒนา Plexus of Raschkow ของ A-delta ไม่สมบูรณ์ ทำให้ EPT มักให้ผล False Negative ทั้งที่ฟันยังมีชีวิต — ให้เชื่อ Cold test ร่วมกับประวัติ",
      "แยก Reactionary dentin (สร้างจาก Primary odontoblasts เดิมเมื่อผุปานกลาง) กับ Reparative dentin (สร้างจาก Mesenchymal stem cells ใหม่หลัง Odontoblast ตาย)"
    ],
    pearl: "เสียวแปลบสั้นๆ = A-delta (Reversible / Hydrodynamic) | ปวดตื้อตุ้บค้างนานกลางคืน = C-fiber (Irreversible pulpitis ลึกลงกลาง Pulp)!",
    reference: "Cohen's Pathways of the Pulp 12th ed. (Ch. 12–13) & Hargreaves Dental Pulp"
  },

  "Endo-Irrigants-Intracanal-Medication": {
    title: "สารล้างคลองรากฟันและยาใส่ในคลองราก (NaOCl, EDTA, CHX & Ca(OH)2)",
    specialty: "วิทยาเอ็นโดดอนต์",
    category: "วิทยาเอ็นโดดอนต์",
    badgeColor: "#e11d48",
    must_know_topics: [
      "NaOCl: ละลายเนื้อเยื่ออินทรีย์ & ฆ่าเชื้อ (Saponification)",
      "17% EDTA: กำจัด Smear Layer ส่วนอนินทรีย์",
      "2% CHX: Substantivity (ต้าน E. faecalis, ไม่ละลายเนื้อเยื่อ)",
      "Ca(OH)2 Mechanism & Endotoxin Neutralization"
    ],
    overview: "หน้าที่เฉพาะทางเคมีของสารล้างคลองรากหลัก 3 ชนิดและการวางลำดับการใช้งานร่วมกับยาฆ่าเชื้อระหว่างนัด เพื่อขจัดทั้ง Biofilm อินทรีย์และ Smear layer ก่อนอุดคลองราก",
    core_mechanism: "ไม่มีน้ำยาล้างชนิดเดียวที่กำจัดได้ทั้งอินทรีย์และอนินทรีย์: Sodium Hypochlorite (NaOCl 1–5.25%) เป็นตัวเดียวที่ละลายเนื้อเยื่อตาย (Necrotic tissue dissolution) ส่วน 17% EDTA เป็นสารคีเลต (Chelator) จับ Ca2+ เพื่อเปิด Smear layer ก่อนล้างปิดท้ายด้วย NaOCl (หรือน้ำเกลือตามด้วย 2% CHX หากเน้น E. faecalis โดยมีระยะเวลาสัมผัสเหมาะสมไม่ทำให้เกิด Dentin erosion)",
    matrix_headers: ["สารล้าง / ยาใส่คลองราก", "กลไกออกฤทธิ์และบทบาทหลัก", "ข้อจำกัด / ข้อควรระวังทางคลินิก"],
    matrix_rows: [
      ["NaOCl (0.5–5.25%)", "ฆ่าเชื้อกว้าง + ตัวเดียวที่ ‘ละลายเนื้อเยื่ออินทรีย์’ และกำจัดส่วนอินทรีย์ของ Biofilm", "ไม่กำจัดอนินทรีย์ Smear layer; หากฉีดล้นปลายรากเกิด NaOCl Accident (ปวดรุนแรง บวมเฉียบพลัน Ecchymosis)"],
      ["17% EDTA (1 นาที)", "คีเลตแคลเซียมละลาย Smear layer ส่วนอนินทรีย์ (Inorganic) เปิดท่อ Dentinal tubules", "ห้ามทิ้งนานเกิน 1 นาที หรือใช้สลับ NaOCl บ่อยเกินจน Dentin เปื่อย (Erosion); ทำให้ NaOCl เสียความสามารถถ้าผสมกัน"],
      ["2% Chlorhexidine (CHX)", "ฤทธิ์ต้านแบคทีเรียกว้างและมี Substantivity (เกาะผนังนาน 48 ชม.+), เด่นต่อ E. faecalis & Candida", "‘ไม่สามารถละลายเนื้อเยื่อ’ ห้ามใช้เดี่ยวแทน NaOCl! และห้ามสัมผัส NaOCl โดยตรงเพราะตกตะกอนส้ม PCA"],
      ["Calcium Hydroxide Ca(OH)2", "ปล่อย OH- ทำลายเยื่อหุ้มเซลล์ + ทำลายโครงสร้าง Endotoxin (LPS) ของ Gram-negative ที่ pH ~12.5", "ไม่ค่อยได้ผลกับ E. faecalis / Candida (ต้องเสริมด้วย CHX ในบางเคส); ล้างออกยากหากไม่ใช้ EDTA/Ultrasonic"]
    ],
    pitfalls: [
      "หากเกิด NaOCl Accident (ฉีดทะลุปลายรากจนคนไข้ร้องปวดและแก้มบวมเร็ว): หยุดฉีดทันที ล้างด้วยน้ำเกลือ ปลอบประโลม ประคบเย็น 24 ชม.แรก แล้วประคบอุ่นวันที่ 2 ให้ Analgesic + Corticosteroid/Antibiotic ตามอาการ (ไม่กรอปิดทันทีถ้ายังระบาย)",
      "ลืมใช้ Side-vented needle และวางเข็มให้สั้นกว่า WL อย่างน้อย 2–3 mm แบบหลวมๆ (ไม่ติดผนัง)"
    ],
    pearl: "ละลายเนื้อเยื่อ = NaOCl เท่านั้น | เปิด Smear Layer = 17% EDTA 1 นาที | สลับ NaOCl ➔ น้ำเกลือ/EDTA ➔ 2% CHX กันตะกอน PCA!",
    reference: "Cohen's Pathways of the Pulp 12th ed. & สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE)"
  },

  // ── ORAL & MAXILLOFACIAL SURGERY (6) ──────────────────────────────────────
  "OMFS-Exodontia-Biomechanics": {
    title: "ชีวกลศาสตร์การถอนฟัน เครื่องมือศัลยกรรม และการหายของแผล (Socket Healing)",
    specialty: "ศัลยศาสตร์ช่องปาก",
    category: "ศัลยศาสตร์ช่องปาก",
    badgeColor: "#f59e0b",
    must_know_topics: [
      "Lever, Wedge & Wheel-and-Axle Principles of Elevators",
      "Forceps Selection (#150, #151, #17, #23 Cowhorn, #88R/L)",
      "5 Stages of Extraction Socket Healing & Dry Socket",
      "Atraumatic Grip & Alveolar Bone Expansion"
    ],
    overview: "หลักฟิสิกส์ของคานงัดและลิ่มที่ใช้ในการโยกถอนฟัน การเลือกคีมให้เข้ากับกายวิภาครากฟันแต่ละซี่ และชีววิทยาการหายของเบ้าฟันหลังถอน",
    core_mechanism: "คีมถอนฟันไม่ได้ ‘ดึง’ ฟันตรงๆ แต่กด Beaks ลงไปให้ชิดปลายรากที่สุดเพื่อย้ายจุดหมุน (Fulcrum) ลงล่างแล้วโยกขยาย Alveolar bone ส่วน Elevator (เช่น Cryer ใช้หลัก Wheel-and-axle, Straight elevator ใช้ Lever/Wedge) ต้องไม่ใช้ฟันที่จะเก็บเป็น Fulcrum โดยเด็ดขาด หลังถอนเกิด Clot ➔ Granulation tissue ➔ Osteoid ➔ Woven bone ➔ Lamellar bone",
    matrix_headers: ["เครื่องมือ / กลไก", "หลักการใช้ & ตัวอย่างซี่ฟัน", "ข้อควรระวังป้องกันภาวะแทรกซ้อน"],
    matrix_rows: [
      ["Universal Forceps (#150 บน / #151 ล่าง)", "ถอนฟันหน้า ฟันกรามน้อยบน-ล่าง (#150 บนโค้ง S; #151 ล่างหักงอ)", "โยก Buccal ก่อนเป็นหลักในฟันบน/หน้าล่าง ยกเว้น Mandibular Molars ที่ Cortical bone ด้าน Buccal หนา ให้ระวังแรงบิด"],
      ["Cowhorn Forceps (#23) & #88 R/L", "#23 จับเข้า Furcation ฟันกรามล่าง 2 ราก | #88 R/L (Trifurcation) ใช้กับฟันกรามบน 3 ราก", "ห้ามใช้ #23 ในฟันกรามล่างที่มีรากหลอม (Conical) หรือฟันบน; #88 มี 1 จงอยด้าน Buccal และ 2 จงอยด้าน Palatal"],
      ["Straight / Cryer / Root-tip Pick", "Straight: งัดระดับกระดูก Interradicular (Lever) | Cryer: คานหมุน (Wheel-and-axle) เกี่ยวรากข้างที่หักเหลือ", "ห้ามใช้ฟันซี่ข้างเคียงเป็น Fulcrum เดี๋ยวฟันดีหลุด/โยก! และห้ามใช้ Root tip pick ออกแรงงัดหนักปลายรากใกล้ Sinus/IAN"],
      ["Dry Socket (Alveolar Osteitis)", "ลิ่มเลือดสลายจาก Fibrinolysis (พบวันที่ 2–4 หลังถอนฟันคุดล่าง ปวดร้าวถึงหู มีกลิ่นเหม็น แต่ ‘ไม่มีไข้/หนอง’)", "ไม่ต้องขูดเบ้าฟัน (Don't curette!), ล้างด้วยน้ำเกลืออุ่น ปิดด้วย Alvogyl / ZOE-gauze dressing + Analgesic (ไม่จำเป็นต้องให้ Antibiotic!)"]
    ],
    pitfalls: [
      "ขูดแผลแรงๆ ในเคส Dry socket — เป็นข้อผิดพลาดใหญ่เพราะยิ่งทำให้กระดูกเปลือยเจ็บมากขึ้นและชะลอการหาย (แค่ Irrigate + Medicated dressing)",
      "แยก Dry Socket (วันที่ 2–4 ปวดตุ้บ ไม่มีไข้ ไม่มีหนอง) ออกจาก Osteomyelitis / Post-op Infection (ไข้ บวมแดงมีหนอง)"
    ],
    pearl: "Cryer = Wheel & Axle | Cowhorn #23 = Furcation ฟันกรามล่าง | Dry Socket = วันที่ 2–4 ล้างน้ำเกลือ + ใส่ Dressing ห้ามขูด + ไม่ต้องจ่ายยาฆ่าเชื้อ!",
    reference: "Hupp's Contemporary Oral and Maxillofacial Surgery 7th ed."
  },

  "OMFS-Impacted-Teeth": {
    title: "การจำแนกและการผ่าตัดฟันคุด (Pell & Gregory / Winter's Classification)",
    specialty: "ศัลยศาสตร์ช่องปาก",
    category: "ศัลยศาสตร์ช่องปาก",
    badgeColor: "#f59e0b",
    must_know_topics: [
      "Winter's Angulation (Mesioangular ง่ายสุด vs Distoangular ยากสุด)",
      "Pell & Gregory Class I–III & Position A–C",
      "White Lines of Winter & Nerve Proximity Signs (OPG Red Flags)",
      "Flap Design (Envelope vs Triangular) & Coronectomy"
    ],
    overview: "ระบบประเมินความยากของการผ่าตัดฟันคุดล่างจากภาพรังสี Panoramic สัญญาณเตือนความเสี่ยงต่อเส้นประสาท Inferior Alveolar Nerve (IAN) และหลักการกรอตัดฟัน (Sectioning)",
    core_mechanism: "ฟันคุดล่างชนิด Mesioangular พบบ่อยและผ่าง่ายสุดเพราะแนวทางขึ้นเอียงออกหน้าพ้น Ramus ขณะที่ Distoangular ผ่ายากสุดเพราะแนวถอนพุ่งเข้าชน Anterior border ของ Ramus สำหรับความเสี่ยงบาดเจ็บ IAN ให้ดูจากภาพรังสี 7 สัญญาณของ Rood & Shehab เช่น Darkening of root และ Interruption of white line of canal",
    matrix_headers: ["การจำแนก / ประเมินเสี่ยง", "คำจำกัดความสำคัญที่ออกสอบ", "กลยุทธ์ผ่าตัดที่สอดคล้อง"],
    matrix_rows: [
      ["Winter's Classification", "แนวเอียงแกนฟันซี่ 38 เทียบซี่ 37: Vertical, Mesioangular (ง่ายสุดในล่าง!), Horizontal, Distoangular (ยากสุดในล่าง; แต่บนง่ายสุด!)", "Mesioangular: ตัด Distal crown ออกแล้วงัด Mesial; Horizontal: ตัด Crown ออกเป็นแนวตั้งฉากก่อนดึงรากตามแนว"],
      ["Pell & Gregory Class I/II/III", "เทียบระยะห่างจาก Distal ซี่ 37 กับ Anterior Ramus (I=พอดีขึ้น, II=แคบครึ่ง, III=จมใน Ramus ทั้งซี่)", "Class III Position C ยากสูงสุด เสี่ยงบาดเจ็บ Lingual nerve / IAN และขากรรไกรหัก"],
      ["Pell & Gregory Position A/B/C", "เทียบระดับยอดฟันซี่ 38 กับ Occlusal plane และ CEJ ซี่ 37 (A=ระดับสบฟัน, B=ระหว่างสบฟัน-CEJ, C=ลึกใต้ CEJ)", "Position C ต้องระวังฟันล้นเข้า IAN หรือแตกหักมุม Mandible"],
      ["Rood & Shehab Radiographic Signs", "7 สัญญาณ IAN เสี่ยง: Darkening of root, Deflection/Narrowing of root, Loss of canal lamina dura, Canal diversion", "หากเสี่ยงสูงและยืนยันจาก CBCT ว่า IAN ทะลุ/กอดราก + ฟันไม่ผุ/ไม่ติดเชื้อปลายราก ➔ พิจารณา Coronectomy (ตัดเฉพาะตัวฟันทิ้งรากลึก)"]
    ],
    pitfalls: [
      "สับสนว่า Distoangular ในฟันคุด ‘บน’ ผ่ายากเหมือนฟันคุด ‘ล่าง’: ฟันคุดบน Distoangular ผ่าง่าย (ทิศพุ่งลงออกด้านหลังห่างซี่ 7) แต่ Mesioangular บนซ้อนใต้ปลายรากซี่ 7 และเสี่ยงดันเข้า Maxillary sinus",
      "วางแผลกรีดด้านหลังฟันคุดล่าง (Distal releasing incision) เฉียงเข้าด้าน Lingual ซึ่งจะตัด Lingual nerve ได้ — ต้องกรีดเฉียงออกด้าน ‘Buccal’ เสมอ!"
    ],
    pearl: "คุดล่าง Mesioangular ง่ายสุด vs Distoangular ยากสุด | กรีด Distal release ให้เฉียงไป Buccal เสมอเพื่อเซฟ Lingual nerve!",
    reference: "Hupp's Contemporary Oral & Maxillofacial Surgery 7th ed. & สมาคมศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียลฯ"
  },

  "OMFS-Anesthesia-Techniques": {
    title: "เทคนิคการฉีดยาชาสกัดกั้นประสาทและภาวะแทรกซ้อน (IANB, PSA, Gow-Gates)",
    specialty: "ศัลยศาสตร์ช่องปาก",
    category: "ศัลยศาสตร์ช่องปาก",
    badgeColor: "#f59e0b",
    must_know_topics: [
      "IANB (Pterygomandibular Space) & Long Buccal Nerve",
      "Gow-Gates vs Vazirani-Akinosi Closed-Mouth Block",
      "PSA Block & Pterygoid Venous Plexus Hematoma",
      "Facial Nerve Palsy (Parotid Injection), Trismus & Needle Breakage"
    ],
    overview: "ตำแหน่งทางกายวิภาคสำหรับสกัดกั้นประสาท V2 และ V3 ความล้มเหลวที่พบบ่อยในขากรรไกรล่าง และการแก้ไขภาวะแทรกซ้อนหลังฉีดยาชาอย่างถูกวิธี",
    core_mechanism: "IANB ต้องให้ปลายเข็มสัมผัสกระดูกเหนือ Lingula ของ Mandible ใน Pterygomandibular space (ลึก ~20–25 mm) ถ้าแทงตื้นไปไม่ชนกระดูกแล้วฉีด ยาจะเข้า Parotid gland กด Facial nerve (CN VII) ทำให้หลับตาไม่ลงชั่วคราว (หน้าเบี้ยวชั่วคราว) ถ้าลึกเกินไปอาจแทงทะลุหลอดเลือด ส่วน PSA Block ห้ามแทงลึก/กางเกินไปเพื่อเลี่ยง Pterygoid Venous Plexus Hematoma",
    matrix_headers: ["เทคนิคยาชา / ภาวะแทรกซ้อน", "จุดอ้างอิง & อาณาเขตที่ชา", "วิธีแก้ไข & ข้อควรระวัง"],
    matrix_rows: [
      ["IANB + Long Buccal Block", "Pterygomandibular raphe ข้ามมาจากฝั่ง Premolar ตรงข้าม ชนกระดูก (~20–25 mm); ชาฟันล่างครึ่งซีก + ริมฝีปากล่าง/คาง", "ไม่ชาลิ้นหากพลาด Lingual, ไม่ชาเหงือก Buccal ฟันกรามล่าง ➔ ต้องเติม Long buccal nerve แยกต่างหากเสมอเมื่อถอน/ผ่า"],
      ["Gow-Gates Mandibular Block", "ฉีดที่ Neck of Condyle ขณะอ้าปากกว้างสุด ➔ ชาทีเดียวทั้ง IAN, Lingual, Long buccal, Mylohyoid, Auriculotemporal", "ทางเลือกหลักกรณี IANB ล้มเหลวจาก Bifid canal หรือ Accessory innervation (Mylohyoid nerve)"],
      ["Vazirani-Akinosi Technique", "เทคนิค ‘หุบปาก’ (Closed-mouth) สำหรับคนไข้ Trismus อ้าปากไม่ได้", "เดินเข็มขนานระนาบสบฟันบนระดับ Mucogingival junction ฟันกรามบน"],
      ["PSA Block Hematoma / Parotid Palsy", "PSA: แทงโดน Pterygoid plexus ➔ แก้มบวมช้ำทันที (ประคบเย็นทันที!) | IANB ลึก/ไม่ชนกระดูก ➔ Facial nerve paralysis ชั่วคราว", "กรณี Facial palsy: อธิบายคนไข้ว่าหายเองใน 2–3 ชม., ถอดคอนแทคเลนส์/ปิดตาข้างหลับไม่สนิทด้วยผ้าก๊อซป้องกันกระจกตาแห้ง!"]
    ],
    pitfalls: [
      "ฉีด PSA Block เพื่อทำฟันกรามบนซี่ที่ 1 แล้วพบว่า Mesiobuccal root ยังเสียวอยู่ ➔ เพราะ ~28% ของ MB root ของซี่ 6 เลี้ยงด้วย MSA (Middle Superior Alveolar Nerve) ต้องเติม Infiltration/MSA",
      "ประคบอุ่นทันทีเมื่อเกิด Hematoma หลังฉีด PSA — ผิด! 24 ชม.แรกต้องกดห้ามเลือด + ประคบเย็น เพื่อหยุดเลือดออกใน Tissue space"
    ],
    pearl: "IANB ไม่ชนกระดูกแล้วฉีด = เข้า Parotid ชา CN VII (ปิดตาช่วยคนไข้ + รอหมดฤทธิ์) | คนไข้อ้าปากไม่ได้ (Trismus) = Vazirani-Akinosi!",
    reference: "Malamed's Handbook of Local Anesthesia 7th ed."
  },

  "OMFS-Oroantral-Communication": {
    title: "รูทะลุช่องปาก-โพรงอากาศข้างจมูกและการผ่าตัดปิด (OAC / OAF Management)",
    specialty: "ศัลยศาสตร์ช่องปาก",
    category: "ศัลยศาสตร์ช่องปาก",
    badgeColor: "#f59e0b",
    must_know_topics: [
      "Nose-Blowing Test (ความแม่นและข้อควรระวัง)",
      "ขนาดรูทะลุ (< 2 mm vs 2–6 mm vs > 6 mm)",
      "Rehrmann Buccal Advancement Flap & Buccal Fat Pad",
      "Sinus Precautions & RDU Antibiotics/Decongestants"
    ],
    overview: "การประเมินรูทะลุเข้าสู่ Maxillary Sinus หลังถอนฟันหลังบน (มักเป็น Palatal root ของ Maxillary 1st/2nd Molar) และการเลือกวิธีปิดตามขนาดรูและภาวะติดเชื้อของไซนัส",
    core_mechanism: "เมื่อรากฟันบนยื่นเข้าพื้นไซนัส การถอนหรือแคะรากฟันอาจเปิด Schneiderian membrane เกิด Oroantral Communication (OAC) หากปล่อยทิ้ง > 48–72 ชม. เยื่อบุผิวจะบุท่อเชื่อมกลายเป็น Oroantral Fistula (OAF) และเกิด Chronic maxillary sinusitis ซึ่งต้องรักษาไซนัสอักเสบให้หายก่อนผ่าตัดปิดด้วยแผ่นเหงือก",
    matrix_headers: ["ขนาด OAC / สถานการณ์", "การวินิจฉัย & ข้อปฏิบัติ", "แผนการรักษาและศัลยกรรมปิด"],
    matrix_rows: [
      ["< 2 mm (ไม่มีการติดเชื้อไซนัส)", "สังเกตฟองอากาศ/เลือดปุดเบาๆ ที่เบ้าฟัน (หลีกเลี่ยงสั่งน้ำมูกแรงๆ เพื่อไม่ให้รูฉีกกว้าง)", "หายเองได้! เพียงดูแลก้อนเลือด + เย็บ Figure-of-8 suture และสั่ง ‘Sinus Precautions’ 10–14 วัน"],
      ["2–6 mm (เกิดสดๆ ในคลินิก)", "รูขนาดกลาง มีแนวโน้มเลือดไหลไม่คลุม หรือเป็นรูต่อเนื่อง", "ใส่ Hemostatic sponge (Gelfoam) + เย็บ Figure-of-8 + จ่าย Antibiotic, Nasal decongestant (Pseudoephedrine/Oxymetazoline) & Sinus precautions"],
      ["> 6 mm หรือรูทะลุเรื้อรัง (OAF)", "มี Epithelialized tract หรืออาหาร/น้ำไหลออกทางจมูก", "หากมีไซนัสอักเสบให้รักษาด้วย ยา+ล้างไซนัส จนสะอาดก่อน ➔ ผ่าตัดปิดด้วย Buccal Advancement Flap (Rehrmann), Palatal Rotational Flap หรือ Buccal Fat Pad"],
      ["รากฟันหลุดเข้าใน Maxillary Sinus", "ยืนยันด้วย X-ray 2 มุม", "ถ้าเล็ก <2–3 mm ลองดูดเบาๆ ทางเบ้า (ไม่ขุดทำลายเบ้าใหญ่) หากไม่ออก/ขนาดใหญ่ ➔ ส่งต่อผ่าตัด Caldwell-Luc (หรือ FESS) นำออก"]
    ],
    pitfalls: [
      "ทำ Buccal Advancement Flap โดยไม่คลายชั้น Periosteum ด้านฐาน (Periosteal scoring) ทำให้ดึงขอบแผลตึง แผลแยกและทำให้ความลึกของ Buccal Vestibule ตื้นลง",
      "ให้ผู้ป่วยสั่งน้ำมูกแรงมากเพื่อทดสอบรูทะลุ ทั้งที่บางครั้งเสี่ยงดันเชื้อโรคจากปากเข้าไซนัสและฉีกเยื่อเมือกเพิ่ม"
    ],
    pearl: "< 2 mm: Figure-of-8 หายเอง + Sinus precautions | 2–6 mm: Gelfoam + ยา/ลดบวมจมูก | > 6 mm/เรื้อรัง (OAF): คุมติดเชื้อไซนัสก่อน ➔ Buccal/Palatal Flap!",
    reference: "Hupp's Contemporary Oral & Maxillofacial Surgery 7th ed."
  },

  "OMFS-Bone-Pathology-Necrosis": {
    title: "ภาวะกระดูกขากรรไกรตายจากยาและรังสีรักษา (MRONJ & ORN)",
    specialty: "ศัลยศาสตร์ช่องปาก",
    category: "ศัลยศาสตร์ช่องปาก",
    badgeColor: "#f59e0b",
    must_know_topics: [
      "AAOMS Criteria of MRONJ (Exposed Bone > 8 Weeks)",
      "IV Zoledronate / Denosumab (สูง) vs Oral Alendronate (ต่ำ)",
      "CTX Biomarker Controversy & Drug Holiday Guidelines",
      "Osteoradionecrosis (ORN) & Hyperbaric Oxygen / PENTOCLO"
    ],
    overview: "กลไกการเกิดภาวะกระดูกขากรรไกรตายจากยาต้านการสลายกระดูก (Bisphosphonates, Denosumab, Antiangiogenics) เทียบกับรังสีรักษาบริเวณศีรษะและลำคอ พร้อมแนวทางป้องกันก่อนเริ่มยา",
    core_mechanism: "Bisphosphonates (จับ Hydroxyapatite ค้างในกระดูกนานเป็นปี ยับยั้ง Osteoclasts) และ Denosumab (RANKL inhibitor อายุสั้นกว่า ไม่สะสมในกระดูก) ยับยั้งการผลัดเปลี่ยนกระดูก (Bone remodeling) เมื่อมีบาดแผลในช่องปากหรือถอนฟัน จึงเกิดการติดเชื้อและกระดูกตายโผล่พ้นเหงือก > 8 สัปดาห์ (มักพบในขากรรไกรล่างมากกว่าบน ~2:1) ส่วน ORN (>60 Gy) เกิดจาก Hypovascular-Hypocellular-Hypoxic tissue",
    matrix_headers: ["เกณฑ์ / ปัจจัยเสี่ยง", "MRONJ (ยา)", "ORN (รังสี > 60 Gy)"],
    matrix_rows: [
      ["คำนิยามวินิจฉัย", "กระดูกตายโผล่หรือคลำผ่าน Fistula นาน > 8 สัปดาห์ + มีประวัติได้ยา + ‘ไม่เคยฉายรังสีที่ขากรรไกร’", "กระดูกตายโผล่ > 3 เดือนในบริเวณที่เคยฉายรังสีโดยไม่มีมะเร็งกลับมาเป็นซ้ำ"],
      ["ปัจจัยเสี่ยงสูงสุด", "IV Bisphosphonate (Zoledronic acid ในผู้ป่วยมะเร็ง > Oral osteoporosis ~100 เท่า!), ฉีดยาเกิน 2–4 ปี, ถอนฟัน, Steroid", "ขนาดรังสี > 60 Gy + ถอนฟันในบริเวณฉายรังสี (Mandible posterior เสี่ยงสุด!)"],
      ["การป้องกันก่อนเริ่มรักษา (Gold Standard)", "เคลียร์ช่องปากถอนฟันพยากรณ์โรคไม่ดีให้แผลหายก่อนเริ่มยา; ในกลุ่ม Risk ต่ำ (<4 ปี Oral) ไม่จำเป็นต้องหยุดยาก่อนถอน", "ถอนฟันเสี่ยงล่วงหน้าอย่างน้อย ‘14–21 วัน’ ก่อนเริ่มฉายรังสี!"],
      ["แนวทางรักษาตามระยะ", "Stage 0–1: CHX 0.12% ล้างปาก + คุมปวด | Stage 2: เพิ่ม Oral Antibiotics | Stage 3: Debridement / Resection", "คุมติดเชื้อ CHX + Sequestrectomy แบบอนุรักษ์ + Pentoxifylline-Tocopherol (PENTOCLO) / HBO (บางสถาบัน)"]
    ],
    pitfalls: [
      "วินิจฉัยคนไข้ที่เคยฉายรังสีที่ขากรรไกรว่าเป็น MRONJ — เกณฑ์ AAOMS ข้อที่ 3 ระบุชัดเจนว่าต้อง ‘ไม่มีประวัติฉายรังสีที่ขากรรไกร’ (No history of radiation therapy)",
      "ประมาทการฉีด Denosumab หรือเข้าใจว่าต้องหยุดยาเหมือน Bisphosphonate ทั้งที่ Denosumab ออกฤทธิ์ย้อนกลับได้เร็วกว่าแต่เพิ่มเสี่ยง Bone loss ย้อนหลัง (Rebound vertebral fracture) หากหยุดโดยไม่ปรึกษาแพทย์"
    ],
    pearl: "กฎ 8 สัปดาห์ไม่ฉายแสง = MRONJ (เคลียร์ฟันก่อนเริ่มยาสำคัญที่สุด!) | ฉายแสง > 60 Gy ควรเคลียร์ฟันอย่างน้อย 14–21 วันก่อนฉาย!",
    reference: "AAOMS Position Paper on MRONJ (2022 Update) & Little & Falace 10th ed."
  },

  "OMFS-Maxillofacial-Trauma": {
    title: "การบาดเจ็บและกระดูกใบหน้าขากรรไกรหัก (Mandibular & Le Fort Fractures)",
    specialty: "ศัลยศาสตร์ช่องปาก",
    category: "ศัลยศาสตร์ช่องปาก",
    badgeColor: "#f59e0b",
    must_know_topics: [
      "ATLS Primary Survey (ABCDE & Airway with C-Spine Protection)",
      "Mandibular Fracture Sites (Condyle > Angle > Body > Symphysis) & Muscle Pull",
      "Le Fort I, II, III Landmarks & CSF Rhinorrhea",
      "Zygomaticomaxillary Complex (ZMC) Tripod Fracture & Diplopia"
    ],
    overview: "การคัดกรองภาวะฉุกเฉินคุกคามชีวิตจากอุบัติเหตุใบหน้า ตำแหน่งกระดูกขากรรไกรหักที่พบบ่อย ทิศทางแรงดึงกล้ามเนื้อ (Favorable vs Unfavorable) และระดับการหักของใบหน้าส่วนกลาง",
    core_mechanism: "การหักของ Symphysis ทั้ง 2 ข้าง (Bilateral parasymphysis) ทำให้กล้ามเนื้อ Genioglossus ขาดแรงยึด ลิ้นตกอุดกั้นทางเดินหายใจทันที (ต้องทำ Jaw thrust / ยึดลิ้น ไม่เหยียดคอหากยังไม่ Rule out C-spine) ส่วน Condyle fracture มักหักร่วมกับ Symphysis ด้านตรงข้าม (Contracoup) ทำให้คางเฉไป ‘ด้านที่หัก’ เวลาอ้าปาก และเกิด Premature contact ด้านเดียวกัน + Open bite ด้านตรงข้าม",
    matrix_headers: ["ประเภทกระดูกหัก", "ตำแหน่ง & อาการแสดงจำเพาะ (Classic Signs)", "การประเมินและหลักการรักษา"],
    matrix_rows: [
      ["Le Fort I (Guerin / Floating Palate)", "พาดขวางเหนือปลายรากฟันบน ผ่าน Pyriform aperture ถึง Pterygoid plates", "Upper dental arch โยกทั้งชุด (ไม่โยกที่สันจมูกหรือขอบเบ้าตา)"],
      ["Le Fort II (Pyramidal Fracture)", "ผ่าน Nasal bridge ➔ Medial orbital wall ➔ Infraorbital rim ➔ Pterygoid plates", "จมูก+เพดานปากโยกด้วยกัน + ชาแก้ม (V2) + Step defect ที่ Infraorbital rim + เสี่ยง CSF Rhinorrhea"],
      ["Le Fort III (Craniofacial Dysjunction)", "ผ่าน Nasofrontal suture ➔ Lateral orbital wall (ZF suture) ➔ Zygomatic arch ➔ Pterygoid plates", "ใบหน้าแยกจากกะโหลกทั้งชุด (Dish-face, Panda/Raccoon eyes, CSF leak, เสี่ยง Airway obstruction สูง)"],
      ["Mandibular Condyle (พบบ่อยสุด) & Angle", "Unilateral condyle: คางเฉไป ‘ด้านที่หัก’, ฟันหลังด้านหักสบก่อน ➔ ด้านตรงข้าม Open bite | Bilateral: Anterior open bite!", "Favorable line: แรงกล้ามเนื้อดึงแนวหัก ‘เข้าหากัน’ | Unfavorable: ดึง ‘แยกจากกัน’ ต้องยึด Open Reduction Internal Fixation (ORIF)"]
    ],
    pitfalls: [
      "สับสนทิศทางคางเฉใน Unilateral Condyle Fracture: คางเฉไป ‘ด้านที่หัก’ (ด้านปกติแข็งแรงผลักเข้ามา) และฟันกรามด้านหักจะสบกระแทกก่อนทำให้ด้านตรงข้ามสบเปิด (Open bite)",
      "เห็นคนไข้ใบหน้าหักที่มีจมูกเลือดออก/น้ำใสหยด แล้วใส่ท่อ Nasotracheal intubation หรือ NG tube — ห้ามเด็ดขาดใน Le Fort II/III / Skull base fracture เพราะท่อทะลุเข้าสมองได้ (Crybriform plate)"
    ],
    pearl: "ATLS Airway มาก่อนเสมอ | Contracoup: กระแทกคาง ➔ Condyle หัก! | Le Fort I = ฟันบนโยก, II = พีระมิดใต้ตา, III = กะโหลกแยกทั้งหน้า!",
    reference: "Hupp's Contemporary Oral & Maxillofacial Surgery 7th ed. & Fonseca Oral and Maxillofacial Trauma"
  },

  // ── PERIODONTOLOGY (9) ────────────────────────────────────────────────────
  "Perio-Examination-Indices": {
    title: "การตรวจประเมินสภาวะปริทันต์ ค่า CAL และพยากรณ์โรค (Examination & Indices)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "สูตรคำนวณ Clinical Attachment Loss (CAL) จาก CEJ",
      "Miller Mobility & Glickman vs Hamp Furcation",
      "Fremitus & Periodontal Probing Force (20–25 g)",
      "McGuire & Nunn / Kwok & Caton Prognosis"
    ],
    overview: "การคำนวณความสูญเสียยึดเกาะปริทันต์ที่แท้จริง (CAL) ซึ่งแยกภาวะเหงือกบวม (Pseudopocket) และเหงือกร่น (Gingival recession) ออกจากกันอย่างแม่นยำ ร่วมกับดัชนี Furcation และ Mobility",
    core_mechanism: "Probing Depth (PD) วัดจากขอบเหงือกถึงก้นร่องลึกเหงือกจึงเปลี่ยนตามการบวมหรือร่นของเหงือก แต่ CAL วัดจากจุดอ้างอิงถาวรคือ CEJ ถึงก้นร่องลึกเหงือก: หากขอบเหงือกคลุมเหนือ CEJ (Gingival enlargement) ให้เอา PD ลบระยะคลุม CEJ; หากเหงือกร่นต่ำกว่า CEJ ให้เอา PD บวกระยะร่น (Recession)",
    matrix_headers: ["พารามิเตอร์ / ดัชนี", "เกณฑ์คำนวณและการแบ่งระดับ (Criteria)", "จุดเน้นและข้อระวังในข้อสอบ"],
    matrix_rows: [
      ["CAL (Clinical Attachment Loss)", "ปกติ (FGM อยู่ใต้ CEJ/Recession): CAL = PD + Recession | เหงือกบวมเหนือ CEJ: CAL = PD − (ระยะจากขอบเหงือกถึง CEJ)", "เช่น PD 6 mm, เหงือกร่น 2 mm ➔ CAL = 8 mm; PD 5 mm, เหงือกโตคลุม CEJ 3 mm ➔ CAL = 2 mm"],
      ["Glickman Furcation Grading", "I: สัมผัสหลุมง่ามราก (ไม่เข้า), II: แหย่เข้าบางส่วน (Cul-de-sac ไม่ทะลุ), III: ทะลุอีกด้าน (Through-and-through) มีเหงือกคลุม, IV: ทะลุมองเห็นโล่งไม่มีเหงือก", "ใช้ Nabers Probe! ตรวจฟันกรามบน 3 ตำแหน่ง (B, MP, DP) ฟันกรามล่าง 2 ตำแหน่ง (B, L)"],
      ["Miller Mobility Index", "Grade 1: โยกแนวนอน < 1 mm | Grade 2: โยกแนวนอน ≥ 1 mm | Grade 3: โยกแนวนอน > 1 mm + กดจมลงแนวดิ่ง (Vertical/Depressible)", "ระวังแยก Mobility จริง กับ Fremitus (การสั่นของฟันบนเมื่อกัดสบฟันโดยใช้นิ้วแตะฝั่ง Labial)"],
      ["Periodontal Probe Standard", "UNC-15 (ขีดทีละ 1 mm, แถบดำที่ 5,10,15), William (1,2,3,5,7,8,9,10 ไม่มี 4,6), WHO (ลูกกลม 0.5 mm แถบดำ 3.5–5.5 mm)", "ออกแรง Probe เพียง 20–25 กรัม ในแนวขนานแกนรากฟัน (Col area เอียงตามจุดสัมผัสเล็กน้อย)"]
    ],
    pitfalls: [
      "วินิจฉัยผู้ป่วยเหงือกโตจากยาที่วัด PD ได้ 5 mm ว่าเป็น Periodontitis — ต้องคำนวณ CAL ก่อน! ถ้าขอบเหงือกอยู่เหนือ CEJ 3 mm ➔ CAL = 2 mm แปลว่า Pseudopocket เท่านั้น (Gingivitis/Drug enlargement)",
      "ตรวจ Furcation ด้าน Mesial ของฟันกรามบน (Maxillary 1st molar) ด้วยการแหย่จากฝั่ง Buccal — ไม่ได้! Mesial furcation ของฟันบนอยู่ค่อนมาทาง ‘Palatal’ ต้องแหย่จากด้าน Palatal"
    ],
    pearl: "Recession บวก (+) | เหงือกบวมคลุม CEJ ลบ (-) | Nabers Probe ตรวจ Mesial ฟันกรามบนเข้าทาง Palatal!",
    reference: "Newman & Carranza's Clinical Periodontology 13th ed. & สมาคมปริทันตวิทยาแห่งประเทศไทย"
  },

  "Perio-Etiology-Microbiology": {
    title: "คราบจุลินทรีย์ แบคทีเรียก่อโรคปริทันต์ และภูมิคุ้มกัน (Red Complex & Host Response)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "Socransky Microbial Complexes (Red vs Orange)",
      "Aggregatibacter actinomycetemcomitans (JP2/Grade C)",
      "Page & Schroeder 4 Histologic Stages (Initial–Advanced)",
      "MMPs, RANKL/OPG & Systemic Links (DM / Smoking)"
    ],
    overview: "ลำดับการก่อตัวของ Biofilm บนผิวฟัน กลุ่มเชื้อก่อโรคจำเพาะของ Socransky และกลไกภูมิคุ้มกันเจ้าบ้าน (Host-mediated tissue destruction) ที่ทำให้กระดูกละลาย",
    core_mechanism: "คราบจุลินทรีย์เริ่มจาก Acquired pellicle แล้วเกาะด้วย Early colonizers (Streptococcus/Actinomyces) ก่อนเชื่อมผ่าน Fusobacterium nucleatum (สะพานเชื่อมกลุ่ม Orange) ไปสู่ Late anaerobic colonizers กลุ่ม Red Complex (P. gingivalis, T. forsythia, T. denticola) ทว่าผู้ทำลายคอลลาเจนและกระดูกส่วนใหญ่ไม่ใช่พิษเชื้อโดยตรง แต่เป็น Matrix Metalloproteinases (MMP-8 จาก Neutrophils) และ RANKL จากการอักเสบของเจ้าบ้านเอง",
    matrix_headers: ["กลุ่มเชื้อ / ระยะพยาธิสภาพ", "องค์ประกอบเด่นที่ออกสอบ", "ความสำคัญทางคลินิก"],
    matrix_rows: [
      ["Socransky Red Complex (Late)", "Porphyromonas gingivalis, Tannerella forsythia, Treponema denticola", "สัมพันธ์สูงสุดกับการมีเลือดออก (BOP+) และร่องลึกปริทันต์ลุกลามใน Chronic/Stage III–IV Periodontitis"],
      ["Grade C / Molar-Incisor Pattern", "Aggregatibacter actinomycetemcomitans (Aa) — สร้าง Leukotoxin ทำลาย PMN/Macrophage", "พบบ่อยในคนอายุน้อย (เดิม Aggressive periodontitis) กระดูกทำลายเร็วมากบริเวณซี่ 6 และฟันตัด ใช้ยาเสริม Amoxicillin + Metronidazole"],
      ["NUG / NUP & Pregnancy Gingivitis", "NUG: Fusobacteria + Spirochetes (Treponema), Prevotella intermedia | ตั้งครรภ์: P. intermedia (กินฮอร์โมนแทน Vit K)", "NUG พบเชื้อบุกรุกลึกเข้าเนื้อเยื่อเกี่ยวพัน (4 zones ของ Listgarten) ในขณะที่ Chronic periodontitis เชื้ออยู่เฉพาะใน Pocket"],
      ["Page & Schroeder Stages", "Initial (PMN 2–4 วัน) ➔ Early (T-cell 4–7 วัน เริ่ม Gingivitis) ➔ Established (Plasma cell เด่น) ➔ Advanced (Bone loss + Pocket)", "จุดแบ่ง Establishing gingivitis vs Periodontitis (Advanced lesion) คือการลุกลามเข้าทำลาย Alveolar bone และ Apical migration of JE"]
    ],
    pitfalls: [
      "สับสนระหว่าง Early lesion (T-lymphocytes เด่น) กับ Established lesion (Plasma cells / B-cells เด่น) — จำง่าย: I = PMN, E(arly) = T-cell, Es(tablished) = Plasma cell, A = Bone loss",
      "ลืมกลไกการสูบบุหรี่ต่อปริทันต์: Nicotine ทำให้หลอดเลือดหดตัว (Vasoconstriction) ลดเลือดออกตอนตรวจ (Masking BOP!) แต่เร่ง Bone loss เพิ่ม 2–5 เท่า"
    ],
    pearl: "Red Complex = P. gingivalis + T. forsythia + T. denticola | Aa = Grade C Molar-Incisor | สูบบุหรี่ลดอาการเลือดออก แต่กระดูกละลายหนัก!",
    reference: "Newman & Carranza's Clinical Periodontology 13th ed."
  },

  "Perio-Non-Surgical-Instrumentation": {
    title: "การขูดหินน้ำลาย เกลารากฟัน และเครื่องมือปริทันต์ (Gracey Curettes & SRP)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "Universal vs Area-Specific (Gracey Curettes #1-2 ถึง #17-18)",
      "มุมขูดเครื่องมือ (Angulation: 45°–90° Optimal ~70°)",
      "Modified Pen Grasp & Intraoral Finger Rest",
      "Critical Probing Depth & Limitations of SRP"
    ],
    overview: "หลักการเลือกใช้เครื่องมือปริทันต์ชนิดต่างๆ มุมเอียงของคมใบมีดเทียบกับผิวรากฟัน รวมถึงข้อดี-ข้อจำกัดของการรักษาปริทันต์โดยไม่ผ่าตัด (NSPT / SRP)",
    core_mechanism: "ความแตกต่างสำคัญระหว่าง Universal Curette (คม 2 ด้าน, หน้าใบมีดทำมุม 90° กับ Terminal shank) และ Gracey Curette (คม 1 ด้านคือ Lower cutting edge, หน้าใบมีดเอียง 70° — Self-angulated!) ช่วยให้เลือกเครื่องมือเข้าถึงซอกแคบโดยไม่ฉีกเหงือก การสอดใส่ใต้เหงือกต้องวางมุม 0° ลงไปใต้ขอบหินน้ำลายก่อนกางออก 45°–90° (ดีที่สุด ~70°)",
    matrix_headers: ["ชนิดเครื่องมือ / เลข Gracey", "ตำแหน่งซี่/ด้านที่ใช้ (Area-Specific)", "ลักษณะคมและหลักการใช้"],
    matrix_rows: [
      ["Gracey #1–2, #3–4, #5–6", "ฟันหน้า (Anterior) และ Premolars (#5–6 ใช้ได้กว้าง)", "คมด้านเดียว ปลายโค้งมน (Rounded toe/back) — แยกจาก Sickle scaler ที่ปลายแหลม ใช้เฉพาะเหนือเหงือก"],
      ["Gracey #7–8, #9–10", "ฟันหลัง ด้าน Buccal และ Lingual (Free surfaces)", "ก้านเอียงปานกลาง เหมาะผิวเรียบด้านแก้ม/ลิ้นของฟันกรามน้อยและฟันกราม"],
      ["Gracey #11–12 & #15–16", "ฟันหลัง ด้าน ‘Mesial’ (#15–16 ปรับมุม Shank เข้าหลังง่ายขึ้น)", "ตรวจสังเกต: Terminal shank จะขนานกับแกนฟันด้าน Mesial เมื่อใช้ Lower cutting edge"],
      ["Gracey #13–14 & #17–18", "ฟันหลัง ด้าน ‘Distal’ (#17–18 ก้านยาวกว่า 3 mm เข้าลึกซี่ 7–8)", "หน้าใบมีดเอียง 70° ➔ เมื่อทำ Terminal shank ขนานผิวราก จะได้มุมขูดพอดีโดยอัตโนมัติ (Offset blade)"]
    ],
    pitfalls: [
      "สอดใส่เครื่องมือลงร่องลึกด้วยมุมขูด 70° — ทำให้ขอบคมขูดเนื้อเยื่อ Soft tissue wall แผลฉีก! ต้องสอดลงด้วยมุม 0° (Closed angle) ก่อนแล้วค่อยกาง 70° ตอนดึงขึ้น",
      "ใช้ Sickle Scaler (หน้าตัดสามเหลี่ยม ปลายแหลม คม 2 ด้าน) ลงขูดใต้เหงือกลึก — เสี่ยงทิ่มเหงือกฉีกขาดและเข้าถึงจุดโค้งรากไม่ได้"
    ],
    pearl: "Gracey: คม 1 ด้าน เอียง 70° | 11–12 / 15–16 = Mesial หลัง | 13–14 / 17–18 = Distal หลัง | สอดเข้า 0° กางขูด ~70°!",
    reference: "Nield-Gehrig Fundamentals of Periodontal Instrumentation & Carranza 13th ed."
  },

  "Perio-Drug-Induced-Enlargement": {
    title: "ภาวะเหงือกโตจากยาและโรคทางระบบ (Drug-Induced Gingival Enlargement)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "3 กลุ่มยาหลัก: Anticonvulsant (Phenytoin), CCB (Nifedipine/Amlodipine), Immunosuppressant (Cyclosporine)",
      "ลักษณะคลินิก: Interdental Papilla แข็งชมพู + Pseudopocket",
      "กลไก Fibroblast Inhibition of Collagenase",
      "การจัดการ: OHI/SRP ➔ ปรึกษาแพทย์เปลี่ยนยา ➔ Gingivectomy"
    ],
    overview: "กลไกทางพยาธิวิทยา ลักษณะคลินิกเฉพาะ และลำดับการรักษาภาวะเหงือกโตจากยา 3 กลุ่มหลัก (50% ใน Phenytoin) รวมถึงการวินิจฉัยแยกจากมะเร็งเม็ดเลือดขาว (Leukemia)",
    core_mechanism: "ยาทั้ง 3 กลุ่ม (Phenytoin, Calcium Channel Blockers, Cyclosporine A) รบกวนการนำเข้า Ca2+ เข้าสู่ Gingival fibroblasts ทำให้การสร้าง Macrophage-derived collagenase / MMP ลดลง ส่งผลให้ Extracellular matrix (คอลลาเจน + GAGs) สะสมไม่ถูกสลาย เหงือกจึงโตนูนจาก Interdental papilla ด้าน Labial ฟันหน้า แข็ง ไม่ค่อยมีเลือดออกหากคุมคราบจุลินทรีย์ดี เกิดเป็น Pseudopocket",
    matrix_headers: ["ยา / สาเหตุ", "ความชุก & ลักษณะคลินิกจำเพาะ", "แนวทางจัดการและแยกโรค"],
    matrix_rows: [
      ["Phenytoin (Dilantin — ยากันชัก)", "พบบ่อยที่สุด (~50%), ก้อนแข็งสีชมพูซีดเป็นพู (Beaded/Lobulated) ไม่เจ็บ", "Phase I OHI/SRP ลดส่วนอักเสบ ➔ ปรึกษาแพทย์เปลี่ยนเป็น Valproate/Levetiracetam + External bevel gingivectomy"],
      ["Calcium Channel Blockers (Nifedipine, Amlodipine)", "พบในผู้ป่วยความดันโลหิตสูง (Nifedipine ~15–20%, Amlodipine ต่ำกว่า ~3%)", "ปรึกษาแพทย์เปลี่ยนกลุ่มยา (เช่น ACEi/ARB) มักยุบลงได้บางส่วน ร่วมกับตัดแต่งเหงือกถ้ายังหนา"],
      ["Cyclosporine (ยากดภูมิหลังปลูกถ่ายอวัยวะ)", "พบ ~30%, เหงือกโตนุ่มกว่าและเลือดออกง่ายกว่า Phenytoin เล็กน้อย", "ปรึกษาแพทย์เปลี่ยนเป็น Tacrolimus (พบน้อยกว่ามาก) + คุมคราบจุลินทรีย์เข้มงวด"],
      ["Acute Myeloid Leukemia (AML M4/M5)", "เหงือกโตนุ่ม ยุ่ย สีแดงม่วงคล้ำ เลือดออกเองไม่หยุด (Spontaneous bleeding) + มีไข้/จ้ำเลือด", "ห้ามขูดหินน้ำลาย/ตัดเหงือกเด็ดขาด! ส่งตรวจ CBC + Peripheral blood smear ด่วน (พบ Blast cells)"]
    ],
    pitfalls: [
      "รีบทำ Gingivectomy โดยไม่ได้ปรึกษาแพทย์เปลี่ยนยาและไม่ได้ทำ SRP ก่อน ➔ เหงือกจะงอกโตกลับมาซ้ำอย่างรวดเร็วหลังตัด",
      "แยก Pseudopocket (จากการโตคลุมเหนือ CEJ) ออกจาก True pocket — ถ้าไม่วัด CEJ จะวินิจฉัยผิดพลาด"
    ],
    pearl: "3 ยาเหงือกโต: Phenytoin (สูงสุด) - CCBs (Nifedipine) - Cyclosporine ➔ คุม Plaque + ปรึกษาเปลี่ยนยา + External Bevel Gingivectomy!",
    reference: "Carranza's Clinical Periodontology 13th ed. & สมาคมปริทันตวิทยาแห่งประเทศไทย"
  },

  "Perio-Mucogingival-Root-Coverage": {
    title: "ศัลยกรรมเหงือกและเยื่อเมือก และการปิดรากฟัน (Cairo RT & Connective Tissue Graft)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "Miller Class I–IV vs Cairo 2018 (RT1, RT2, RT3)",
      "FGG (Free Gingival Graft: เพิ่ม Keratinized Tissue) vs SCTG (Root Coverage Gold Standard)",
      "Lateral / Coronally Positioned Flap",
      "Tension Test & Adequate Width of Attached Gingiva"
    ],
    overview: "การประเมินความผิดปกติของเยื่อเมือก-เหงือก (Mucogingival Deformities) การพยากรณ์ความสำเร็จของการปิดรากฟันจากระดับกระดูกและเหงือกซอกฟัน (Interdental attachment)",
    core_mechanism: "ปัจจัยชี้ขาดว่าเหงือกที่ปลูกถ่ายปิดรากฟันจะรอดและได้ Root coverage 100% หรือไม่ ไม่ได้อยู่ที่ความลึกด้านแก้ม แต่อยู่ที่ ‘Interproximal attachment loss (ระดับ Papilla และกระดูกซอกฟัน)’ เป็นตัวส่งเลือดเลี้ยงแผ่นเหงือก หาก Interproximal ไม่สูญเสียเลย (Miller I/II หรือ Cairo RT1) สามารถคาดหวัง Root coverage ได้ 100%",
    matrix_headers: ["การจำแนกเหงือกร่น / ศัลยกรรม", "คำจำกัดความ (Criteria)", "พยากรณ์การปิดราก & วิธีผ่าตัดเลือกใช้"],
    matrix_rows: [
      ["Cairo RT1 (เดิม Miller Class I & II)", "เหงือกร่นด้าน Buccal/Lingual โดย ‘ไม่มี’ Interproximal CAL loss (ขอบ Papilla สมบูรณ์)", "Root coverage คาดหวังได้ ~100% (Gold Standard: SCTG + Coronally Advanced Flap)"],
      ["Cairo RT2 (เดิม Miller Class III)", "มี Interproximal CAL loss น้อยกว่าหรือเท่ากับด้าน Buccal", "ปิดรากได้บางส่วน (Partial root coverage) เฉพาะถึงระดับ Papilla"],
      ["Cairo RT3 (เดิม Miller Class IV)", "มี Interproximal CAL loss มากกว่าด้าน Buccal (รอบซี่รุนแรง)", "ไม่สามารถคาดหวัง Root coverage ได้ (0–unpredictable)"],
      ["Free Gingival Graft (FGG) vs SCTG", "FGG: ตัดทั้ง Epithelium + CT จากเพดาน | SCTG: เอาเฉพาะ Connective tissue ใต้ผิวเพดาน (เหลือแผลปิดด้านบน)", "FGG: เหมาะเพิ่ม Width ของ Keratinized/Attached gingiva (สีซีดต่างจากรอบข้าง) | SCTG: สวยงาม + Dual blood supply เหมาะปิดรากฟันสูงสุด"]
    ],
    pitfalls: [
      "ลืมเกณฑ์ความต่างของ Miller I vs II: ทั้งคู่ไม่มี Interdental bone loss (จึงอยู่ใน Cairo RT1 ทั้งคู่) ต่างกันแค่ Class I ร่นยังไม่ถึง Mucogingival Junction (MGJ) แต่ Class II ร่นถึงหรือเลย MGJ",
      "วางตำแหน่งตัดเหงือกบริจาคเพดาน (Palatal donor) ลึกใกล้ Greater Palatine Artery (อยู่ที่รอยต่อเพดานแนวดิ่งกับแนวนอน — แนวฟันกรามบน)"
    ],
    pearl: "กุญแจปิดรากฟัน = Interproximal Bone/CAL! RT1 (ไม่เสียซอกฟัน) ปิดได้ 100% | เพิ่ม Keratinized = FGG | ปิดรากสวย = SCTG + CAF!",
    reference: "Cairo et al. (2011/2018 World Workshop) & Carranza 13th ed."
  },

  "Perio-Biologic-Width-Crown-Lengthening": {
    title: "ระยะความกว้างทางชีวภาพและการผ่าตัดเพิ่มความยาวตัวฟัน (Supracrestal Tissue & Crown Lengthening)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "Supracrestal Tissue Attachment (STA) = JE (0.97 mm) + CT (1.07 mm) ≈ 2.04 mm",
      "กฎ 3 mm ระหว่าง Crown Margin ถึง Alveolar Crest",
      "การละเมิด STA: Gingival Inflammation vs Bone Resorption",
      "Functional Crown Lengthening (Ostectomy + Apically Positioned Flap) vs Orthodontic Extrusion"
    ],
    overview: "ระยะความกว้างทางชีวภาพของเหงือกรอบซี่ฟัน (ปัจจุบันเรียกว่า Supracrestal Tissue Attachment) ผลกระทบเมื่อกรอขอบครอบฟันลึกเกินไป และหลักคำนวณระดับตัดกระดูกเวลาทำ Crown Lengthening",
    core_mechanism: "Gargiulo (1961) วัดค่าเฉลี่ยกายวิภาคเหนือยอดกระดูกประกอบด้วย Connective Tissue Attachment (~1.07 mm) + Junctional Epithelium (~0.97 mm) รวม ~2.04 mm (บวก Sulcus ~0.69 mm = ~2.73–3.0 mm) หากวาง Margin ของวัสดุอุด/ครอบฟันรุกล้ำพื้นที่ ~2 mm นี้ ร่างกายจะเกิดการอักเสบเรื้อรัง (Biotype หนา ➔ เหงือกบวมแดง bleeding) หรือเกิดการสลายกระดูกหนี (Biotype บาง ➔ เหงือกร่น)",
    matrix_headers: ["แนวคิด / สถานการณ์คลินิก", "ค่ามาตรฐาน / การตอบสนองของเนื้อเยื่อ", "แนวทางจัดการทางคลินิก"],
    matrix_rows: [
      ["Supracrestal Tissue Attachment (STA)", "CT attachment (1.07 mm) + Epithelial attachment / JE (0.97 mm) = ~2.04 mm (Sulcus อยู่นอก STA)", "ขอบบูรณะควรห่างจาก Alveolar bone crest อย่างน้อย ≥ 3.0 mm (2 mm STA + 1 mm Margin/Sulcus)"],
      ["ผลของการละเมิด STA (Violation)", "Thick biotype ➔ เหงือกอักเสบบวมแดงเรื้อรัง; Thin biotype ➔ กระดูกละลายและเหงือกร่นลงเพื่อสร้าง 2 mm ใหม่", "รื้อขอบครอบฟันหรือผ่าตัด Crown lengthening ลดระดับกระดูกให้พ้นระยะ 3 mm จากจุดผุ/Margin"],
      ["Functional Crown Lengthening", "ผุ/แตกต่ำกว่าขอบเหงือก แต่รากฟันยาวพอและไม่กระทบความงามฟันหน้า", "กรอตัดกระดูก (Ostectomy) รอบซี่ให้ขอบฟันที่ดีห่างกระดูก ≥ 3–4 mm (รวม Ferrule 1.5–2 mm!) + รอเหงือกนิ่ง 3–6 เดือนใน Esthetic zone"],
      ["Orthodontic Forced Eruption (Extrusion)", "ฟันหน้าซี่เดียวแตก/ผุลึกมาก (ถ้าตัดกระดูกจะทำลายความสูงเหงือกซี่ข้างเคียง)", "ดึงฟันลงมาทางจัดฟันร่วมกับ Fiberotomy ทุก 1–2 สัปดาห์ (ถ้าไม่ทำ Fiberotomy กระดูกและเหงือกจะตามลงมาด้วย!)"]
    ],
    pitfalls: [
      "เผลอนับ Sulcus depth (0.69 mm) เข้าไปใน Biologic Width (STA) — Biologic Width คือ ‘JE + CT attachment (~2.04 mm)’ เท่านั้น ส่วนระยะ 3 mm คือระยะความปลอดภัยที่ต้องการจากขอบครอบฟันถึงกระดูก",
      "ทำ Gingivectomy อย่างเดียวโดยไม่ตัดกระดูก (Ostectomy) ในเคสผุใกล้ขอบกระดูก (< 3 mm) ➔ เหงือกจะงอกคืนมาและอักเสบเรื้อรังเพราะ STA ไม่พอ"
    ],
    pearl: "STA = JE (0.97) + CT (1.07) ≈ 2.04 mm (ไม่รวม Sulcus) | Crown Lengthening ต้องเหลือจาก Sound tooth margin ถึง Crest ≥ 3 mm + รอความงามนิ่ง 3–6 เดือน!",
    reference: "Gargiulo et al. (1961) / 2017 World Workshop (STA) & Carranza 13th ed."
  },

  "Perio-Acute-Conditions-Abscess": {
    title: "ภาวะเฉียบพลันทางปริทันต์ ฝีปริทันต์ และโรคเหงือกเนื้อตาย (Abscess & NUG/NUP)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "Periodontal Abscess vs Periapical Abscess (Vitality & Bone Loss)",
      "Necrotizing Ulcerative Gingivitis (NUG: Punched-out Papillae, Pseudomembrane)",
      "Endo-Perio Lesion Classification (Primary Endo vs Primary Perio)",
      "Emergency Drainage + Debridement + RDU Antibiotics"
    ],
    overview: "การแยกแยะฝีปริทันต์ออกจากฝีปลายรากฟันอย่างรวดเร็ว การวินิจฉัยโรคเหงือกอักเสบเนื้อตายเฉียบพลัน (NUG/NUP) และลำดับการรักษาภาวะติดเชื้อร่วมระหว่างคลองรากและปริทันต์",
    core_mechanism: "Periodontal Abscess เกิดจากการอุดตันทางระบายของ Deep periodontal pocket หรือสิ่งแปลกปลอมติดเหงือก (เช่น เมล็ดข้าวโพด หินน้ำลายหลุด) ทำให้เกิดหนองในร่องลึกเหงือกโดยที่ฟันมักยัง ‘มีชีวิต (Vital!)’ ขณะที่ Endodontic Abscess เกิดจากฟันตาย (Non-vital!) และมีเงาดำที่ปลายราก ส่วน NUG เกิดในคนเครียด อดนอน สูบบุหรี่ ขาดสารอาหาร เชื้อ Spirochetes ลุกลามเกิดแผลยอดเหงือกแหว่งเป็นปล่อง (Punched-out craters)",
    matrix_headers: ["ภาวะเฉียบพลัน", "อาการสำคัญและการแยกโรค", "การรักษาเร่งด่วน (Acute Phase)"],
    matrix_rows: [
      ["Periodontal Abscess", "ฟันมัก ‘Vital’, บวมค่อนไปทางขอบเหงือก (Lateral root), Deep broad pocket, ปวดเวลาเคาะข้าง/ไม่รุนแรงเท่า Endo", "ระบายหนองผ่าน Pocket ด้วย Curette (SRP เบาๆ) หรือผ่ากรีด + ล้างน้ำเกลือ; จ่ายยาปฏิชีวนะเฉพาะเมื่อมีไข้/ต่อมน้ำเหลืองโต"],
      ["Periapical (Endodontic) Abscess", "ฟัน ‘Non-vital’, เงาดำปลายราก, บวมใกล้มูกขากรรไกร (Mucobuccal fold), ปวดตุ้บเคาะแนวแกนเจ็บจัด", "เปิดโพรงประสาทระบายหนอง / รักษารากฟัน (ห้ามขูดเกลารากฟันเป็นหลักเพราะไม่แก้ต้นเหตุ!)"],
      ["NUG / NUP (Vincent's Infection)", "ยอด Interdental papilla แหว่งเป็นหลุม (Punched-out craters) คลุมด้วยแผ่นฝ้าเทา (Pseudomembrane), ปวดมาก, กลิ่นปากรุนแรง (Fetor ex ore)", "ขูดทำความสะอาดเบามือ/Hydrogen peroxide 3% หรือ CHX; จ่าย ‘Metronidazole’ เฉพาะกรณีมีไข้/ต่อมน้ำเหลืองโต (และคัดกรอง HIV ใน NUP!)"],
      ["Primary Endo with Secondary Perio Lesion", "ฟันตาย ลามออก Furcation/Narrow pocket แล้วมีหินน้ำลายสะสมแทรก", "‘รักษารากฟันก่อน’ เสมอ แล้วติดตามผลการหาย 2–3 เดือน ก่อนทำ Perio surgery (ต่างจาก Primary Perio ที่รักษา Perio พร้อม/ก่อน)"]
    ],
    pitfalls: [
      "เจอแผลปวดเหงือกเป็นฝ้าในเด็ก/คนไข้มีตุ่มพองแล้วคิดว่าเป็น NUG โดยไม่ได้แยกว่า Primary Herpetic Gingivostomatitis จะมีไข้สูงลอยก่อน + ตุ่มน้ำแตกที่ attached gingiva/เพดาน (ไม่จำกัดแค่ยอด Interdental papilla)",
      "ทำ Scaling & Root Planing รุนแรงในวันแรกของ NUG ขณะเจ็บจัดและมีแผลเปิดลึก — ให้ทำ Ultrasonic/Debridement เบาที่สุดในวันแรกเพื่อลด Bacteremia และความเจ็บ"
    ],
    pearl: "ฝีปริทันต์ = ฟันยังมีชีวิต (Vital!) + Pocket กว้าง | NUG = ยอด Papilla แหว่ง (Punched-out) + ปวดมาก + Metronidazole (ถ้ามีไข้) | Endo-Perio = ทำ Endo ก่อนเสมอ!",
    reference: "2017 AAP/EFP Periodontal Classification & Carranza 13th ed."
  },

  "Perio-Regeneration-GTR": {
    title: "การเหนี่ยวนำเนื้อเยื่อปริทันต์ใหม่และการปลูกกระดูก (GTR & Intrabony Defects)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "Intrabony Defects (1-Wall, 2-Wall, 3-Wall — ดีที่สุด!)",
      "Guided Tissue Regeneration (GTR): Epithelial Exclusion Principle",
      "Osteogenesis vs Osteoinduction vs Osteoconduction",
      "Autograft vs Allograft (DFDBA/FDBA) vs Xenograft vs Biologics (EMD)"
    ],
    overview: "กลไกการชะลอ Epithelium และ Connective tissue ของเหงือกไม่ให้ลงมายึดผิวรากก่อนเซลล์ PDL และกระดูก รวมถึงการเลือกลักษณะรอยโรคกระดูกและวัสดุปลูกกระดูกให้ได้ True Regeneration",
    core_mechanism: "ในแผลผ่าตัดปกติ Long Junctional Epithelium (LJE) เติบโตเร็วที่สุดลงมาปิดผิวราก (Repair ไม่ใช่ Regeneration) หลักการ GTR จึงวางแผ่นกั้น (Barrier membrane) กั้นไม่ให้ Epithelium และ Gingival CT ลงมา เปิดทางให้เฉพาะ PDL cells และ Bone cells จากเบ้ากระดูกงอกขึ้นมาสร้าง New cementum, New PDL และ New alveolar bone โดยเฉพาะใน Intrabony defect ชนิด 3-wall ซึ่งมีผนังเลี้ยงเลือดมากสุด",
    matrix_headers: ["ประเภทวัสดุ / ปัจจัยสำเร็จ", "กลไกชีวภาพ (Osteo-properties)", "ข้อบ่งชี้ & พยากรณ์โรค"],
    matrix_rows: [
      ["3-Wall Intrabony Defect", "มีผนังกระดูกล้อม 3 ด้าน (มากสุด) เก็บเลือดและ Graft อยู่ตัวดี", "พยากรณ์ดีที่สุดสำหรับ GTR / Enamel Matrix Derivative (EMD / Emdogain) ในมุมกระดูกแคบลึก (≥ 3 mm, < 25–37°)"],
      ["Autogenous Bone Graft (Autograft)", "ครบ 3 กลไก: Osteogenesis + Osteoinduction + Osteoconduction (Gold Standard)", "ข้อจำกัดคือต้องมีแผลที่ Donor site เพิ่ม และปริมาณกระดูกจำกัด"],
      ["Allograft (DFDBA vs FDBA)", "DFDBA (ดึงแร่ธาตุออกเปิด BMPs ➔ Osteoinduction + Conduction) | FDBA (Osteoconduction + คงรูปนานกว่า)", "นิยมใช้ใน Intrabony defects และ Sinus/Ridge preservation (DFDBA เน้น Induction; FDBA เน้น Space maintenance)"],
      ["Xenograft (เช่น Bio-Oss) & Alloplast", "Osteoconduction เท่านั้น (ทำหน้าที่เป็นโครงนั่งร้านให้เซลล์กระดูกงอกแทรก สลายตัวช้ามาก)", "นิยมใน GBR เพิ่มความกว้างสันกระดูก/รากเทียมเพื่อคงปริมาตรระยะยาว"]
    ],
    pitfalls: [
      "สับสน Repair กับ Regeneration: หลังทำ SRP หรือ Modified Widman Flap มักหายแบบ ‘Long Junctional Epithelium (Repair)’ ไม่ได้สร้าง PDL + Cementum ใหม่อย่าง GTR/EMD",
      "หวังทำ GTR ในผู้ป่วยที่ยังสูบบุหรี่จัด คุมเบาหวานไม่ได้ หรือยังมี Oral Hygiene แย่ (Plaque score สูง) — อัตราเกิด Membrane exposure และติดเชื้อสูงมาก"
    ],
    pearl: "3-Wall Defect ดีสุดสำหรับ GTR | ครบ 3 Osteo = Autograft | มี BMP (Osteoinductive) = DFDBA | หายหลังขูด/MWF = Long Junctional Epithelium!",
    reference: "Carranza's Clinical Periodontology 13th ed. & AAP Regeneration Consensus"
  },

  "Perio-Periodontal-Surgery-Flaps": {
    title: "หลักการผ่าตัดเปิดแผ่นเหงือกและศัลยกรรมกระดูก (Flap Designs & Osseous Surgery)",
    specialty: "ปริทันตวิทยา",
    category: "ปริทันตวิทยา",
    badgeColor: "#10b981",
    must_know_topics: [
      "3 Basic Incisions of Flap (Internal Bevel, Crevicular, Interdental)",
      "Modified Widman Flap (MWF) vs Apically Positioned Flap (APF) vs Undisplaced Flap",
      "Ostectomy (ตัดกระดูกยึดฟัน) vs Osteoplasty (แต่งสันกระดูกไม่ยึดฟัน)",
      "External Bevel Gingivectomy (Indications & Contraindications)"
    ],
    overview: "ข้อบ่งชี้ของเทคนิคการผ่าตัดปริทันต์หลัก ความแตกต่างของการกรีด Internal bevel ใน Modified Widman กับ Apically Positioned Flap และหลักศัลยกรรมกระดูกเพื่อคืน Architecture ปกติ",
    core_mechanism: "Internal Bevel Incision เป็นรอยกรีดแรกที่สำคัญสุดเพื่อตัด Pocket epithelium ที่อักเสบออกและเปิดเข้าสู่ขอบกระดูก Modified Widman Flap (MWF) กรีดเข้าห่างขอบเหงือก 0.5–1 mm เพื่อคงความสวยงามและยึดคืนตำแหน่งเดิม (เน้น Access cleanup ไม่ลด Pocket มาก) ขณะที่ Apically Positioned Flap (APF) เลาะเลย Mucogingival junction แล้วเย็บเลื่อนแผ่นเหงือกลงล่างเพื่อลด Pocket และเพิ่มความกว้าง Attached gingiva",
    matrix_headers: ["เทคนิคผ่าตัด", "รอยกรีดหลักและตำแหน่งหลังเย็บ", "ข้อบ่งชี้ & ข้อห้ามสำคัญ"],
    matrix_rows: [
      ["Modified Widman Flap (MWF)", "3 incisions (Internal bevel ห่างขอบ 0.5–1 mm ➔ Crevicular ➔ Interdental) เย็บคืนที่เดิม (Close adaptation)", "ใช้ใน Esthetic zone / หน้าฟัน ต้องการเข้าถึงผิวรากและลดเหงือกร่นหลังผ่าตัด; ไม่เหมาะสำหรับการเพิ่มความยาวตัวฟัน"],
      ["Apically Positioned Flap (APF)", "Internal bevel ตามความหนาเหงือก เลาะพ้น MGJ แล้วยึดแผ่นเหงือกที่ระดับยอดกระดูก", "Pocket reduction ดีสุด, เพิ่มความกว้าง Attached gingiva, และใช้ทำ Functional Crown Lengthening ร่วมกับ Ostectomy (ห้ามในหน้ายิ้มสูง!)"],
      ["External Bevel Gingivectomy", "กรีดทำมุม 45° เอียงขึ้นบนสู่ยอดเหงือก (ตัดเฉียงจากด้านนอก) ทิ้งแผล Open wound หายแบบ Secondary intention", "ข้อบ่งชี้: Gingival enlargement / Fibrotic pseudopocket ที่มี Attached gingiva กว้างพอ | ข้อห้าม: ไม่พอ Keratinized tissue หรือมี Intrabony defect!"],
      ["Osteoplasty vs Ostectomy", "Osteoplasty: แต่งสันกระดูกหนา/Ledging โดยไม่เอากระดูกยึดเกาะรากออก | Ostectomy: ตัด Supporting alveolar bone ออก", "ใช้ Ostectomy แก้ Reverse architecture (Interdental bone ต่ำกว่า Radicular bone) ให้กลับมาเป็น Positive architecture"]
    ],
    pitfalls: [
      "ทำ Gingivectomy ในเคสที่มี Intrabony defect หรือ Attached gingiva แคบมาก (< 1–2 mm) ➔ ทำให้สูญเสีย Attached gingiva ทั้งหมดและแก้กระดูกร่องลึกไม่ได้",
      "สลับนิยาม Positive vs Negative (Reverse) Osseous Architecture: ในภาวะปกติ Interdental bone อยู่ ‘สูงกว่า (Coronal ต่อ)’ กระดูกด้าน Buccal/Lingual (Positive architecture)"
    ],
    pearl: "Internal Bevel = ตัด Pocket lining ใน Flap | 45° External Bevel = Gingivectomy (ห้ามใช้ถ้า Intrabony หรือขาด Attached gingiva) | Ostectomy = ตัดกระดูกที่จับผิวรากฟัน!",
    reference: "Carranza's Clinical Periodontology 13th ed. (Ch. 56–60)"
  },

  // ── OPERATIVE DENTISTRY (7) ───────────────────────────────────────────────
  "Operative-Cariology-Pathology": {
    title: "วิทยาโรคฟันผุ การสูญเสีย-คืนแร่ธาตุ และความเสี่ยง (Cariology & CAMBRA)",
    specialty: "ทันตกรรมบูรณะ/หัตถการ",
    category: "ทันตกรรมบูรณะ/หัตถการ",
    badgeColor: "#0d9488",
    must_know_topics: [
      "Critical pH: Enamel (5.5) vs Dentin/Cementum (6.2–6.7) vs Fluorapatite (4.5)",
      "Stephan Curve & Ecological Plaque Hypothesis (S. mutans / Lactobacillus)",
      "Histologic Zones of Enamel Caries (4 Zones) & Dentin Caries (5 Zones)",
      "ICDAS II & Active vs Arrested Caries"
    ],
    overview: "สมดุลพลวัตระหว่าง Demineralization และ Remineralization ในช่องปาก ค่า pH วิกฤตของโครงสร้างฟันแต่ละชั้น ลักษณะพยาธิวิทยาของรอยผุในเคลือบฟันและเนื้อฟัน และการแปลผลความเสี่ยง",
    core_mechanism: "เมื่อแบคทีเรียหมักคาร์โบไฮเดรตเกิดกรด pH ต่ำกว่า Critical pH (Enamel 5.5, Dentin 6.2–6.7 เพราะมีแร่ธาตุน้อยและคาร์บอเนตสูงกว่า) แคลเซียม-ฟอสเฟตจึงละลายออก แต่ฟลูออไรด์ช่วยลด Critical pH ลงเป็น ~4.5 ในรูป Fluorapatite และส่งเสริมการคืนแร่ธาตุ ระยะแรกที่ผิวยังไม่เป็นรู (ICDAS 1–2 White spot lesion) เกิดการละลายใต้ผิวใน Body of lesion โดยยังมี Surface zone เหลือคลุม",
    matrix_headers: ["ชั้น / ตัวชี้วัดฟันผุ", "ลักษณะทางจุลพยาธิวิทยา / ค่าสำคัญ", "การจัดการคลินิกตามหลัก Minimally Invasive"],
    matrix_rows: [
      ["Enamel Caries (4 Zones จากลึกไปตื้น)", "Translucent ➔ Dark ➔ Body of lesion (พรุนสุด 25–50%!) ➔ Surface zone (~1–5% ยังคงรูปจากการ Re-min ของน้ำลาย)", "ICDAS 1–2 (White spot ไม่มีรู): ห้ามกรออุด! จัดการด้วย Fluoride varnish, Diet control, Sealant หรือ Resin infiltration (Icon)"],
      ["Dentin Caries (5 Zones จากลึกไปตื้น)", "Normal ➔ Subtransparent ➔ Transparent (Sclerotic) ➔ Turbid (Soft infected มีเชื้อ) ➔ Infected necrosis", "ชั้น Infected (Turbid/Soft): กำจัดออกหมด | ชั้น Affected (Sclerotic/Firm เล็กน้อย): คงไว้เหนือโพรงประสาทเพื่อไม่ให้ Pulp ทะลุ!"],
      ["Active vs Arrested Lesion", "Active: ขาวขุ่นด้านเหมือนชอล์ก ผิวหยาบ (Chalky rough) ในจุดสะสม Plaque | Arrested: น้ำตาลดำเป็นมันเรียบแข็ง", "Arrested caries ไม่ต้องกรอรักษา (ยกเว้นเพื่อความสวยงามในฟันหน้า)"],
      ["เชื้อหลักตามระยะฟันผุ", "Streptococcus mutans (ตัวเริ่มผุใน Enamel, สร้าง Glucan ยึดเกาะ) vs Lactobacillus (เด่นในการลุกลามลึกใน Cavitation)", "Actinomyces (เด่นใน Root surface caries ผู้สูงอายุปากแห้ง)"]
    ],
    pitfalls: [
      "ใช้ Explorer แหลมกดจิกลงไปในหลุมร่องฟันที่มี White spot lesion (ICDAS 2) — การจิ้มแรงทำให้ Surface zone ที่บางพังทลายกลายเป็นโพรงรูถาวร (Cavitated)! ให้ใช้แรงเบา/ดูเมื่อเป่าแห้ง",
      "จำสับสนค่า Critical pH: รากฟัน/Dentin ผุได้ง่ายกว่าตัวฟันมากเพราะ Critical pH สูงถึง ~6.2–6.7 (แค่กรดอ่อนๆ จากผลไม้/น้ำลายแห้งก็ผุแล้ว)"
    ],
    pearl: "Critical pH: Enamel 5.5, Dentin/Root 6.2–6.7, Fluorapatite 4.5 | White Spot มี Surface zone คลุมอยู่ ➔ ห้ามเจาะด้วย Explorer หรือหัวกรอ!",
    reference: "Sturdevant's Art and Science of Operative Dentistry 7th ed. & Summit's Fundamentals of Operative Dentistry"
  },

  "Operative-Dental-Amalgam": {
    title: "วัสดุอมัลกัมทางทันตกรรมและการเตรียมโพรงฟัน (Amalgam & Cavity Prep)",
    specialty: "ทันตกรรมบูรณะ/หัตถการ",
    category: "ทันตกรรมบูรณะ/หัตถการ",
    badgeColor: "#0d9488",
    must_know_topics: [
      "Low-Copper vs High-Copper Amalgam (Elimination of Gamma-2 Phase Sn7-8Hg)",
      "Zinc-Containing Amalgam + Moisture = Delayed Expansion",
      "Resistance Form & Retention Form (90° Cavosurface Margin, Convergence)",
      "Minimum Thickness (1.5–2.0 mm) & Isthmus Width (1/4–1/3 ICD)"
    ],
    overview: "โลหะวิทยาของอะมัลกัมความต่างระหว่างสูตร Copper ต่ำกับสูตร High-copper และข้อกำหนดเชิงกลของการเตรียมโพรงฟันเพื่อให้วัสดุทนแรงบดเคี้ยวได้โดยไม่แตกหัก",
    core_mechanism: "High-copper amalgam (>12–30% Cu) ช่วยขจัด Gamma-2 phase (Sn7-8Hg) ซึ่งเป็นเฟสอ่อนแอที่สุดและผุกร่อน (Corrosion) ง่ายที่สุดในปาก เปลี่ยนไปเป็น Eta-prime phase (Cu6Sn5) ทำให้ลด Creep เพิ่มความแข็งแรงและลด Marginal breakdown นอกจากนี้ต้องเตรียมโพรงฟันให้ผนังด้านแก้ม/ลิ้นลู่เข้า (Occlusal convergence) เพื่อ Macro-mechanical retention และทำมุม Cavosurface ~90° เพื่อกันขอบอะมัลกัมบางแตก",
    matrix_headers: ["เฟสของอะมัลกัม / หลัก Cavity Prep", "กลไกโลหะวิทยาและค่าที่ออกสอบ", "ผลกระทบและความสำคัญคลินิก"],
    matrix_rows: [
      ["Gamma (Ag3Sn) / Gamma-1 (Ag2Hg3)", "Gamma: ผงโลหะที่เหลือ (แข็งสุด) | Gamma-1: Matrix หลักที่เกิดขึ้นระหว่างปฏิกิริยา", "ยิ่งเหลือแรงอัด Condensation ดี ไล่ปรอทส่วนเกินออกมาก อะมัลกัมยิ่งแข็งแรงและ Creep ต่ำ"],
      ["Gamma-2 (Sn7-8Hg) vs Eta-prime (Cu6Sn5)", "Gamma-2 เป็นจุดอ่อนสุด (อ่อน ผุกร่อนง่าย Creep สูง) — High-copper ใช้ Cu แย่ง Sn เกิด Cu6Sn5 แทน", "High-copper amalgam จึงมี Creep ต่ำกว่ามาก (สำคัญสุดในข้อสอบวัสดุศาสตร์!)"],
      ["Zinc (>0.01%) + ความชื้นปนเปื้อน", "Zn ทำปฏิกิริยากับน้ำปล่อยก๊าซ H2 ทำให้วัสดุพองตัวหลังอุดหลายวัน/สัปดาห์ (Delayed Expansion)", "ทำให้ปวดฟันเมื่อเคี้ยว วัสดุยื่นพ้นขอบโพรงฟัน ➔ ต้องคุมความชื้นหรือใช้ Non-zinc alloy ถ้าแยกน้ำลายไม่ได้"],
      ["Resistance & Retention Form", "ลึก ≥ 1.5–2.0 mm, กว้าง Isthmus ~1/4–1/3 intercuspal distance, ผนัง Occlusal convergence (90° CSM), Pulpal floor แบนขนาน", "ข้อสอบชอบถามสาเหตุอะมัลกัมแตกที่ Isthmus: มักเกิดจากกรอลึกไม่พอ (< 1.5 mm) หรือ Axio-pulpal line angle แหลมคม (ต้องลบมน!)"]
    ],
    pitfalls: [
      "กรอ Enamel margin แบบ Bevel สำหรับงาน Amalgam — ห้ามเด็ดขาด! อะมัลกัมเปราะเมื่อบาง (Low edge strength) ต้องทำ 90° Butt-joint margin เท่านั้น (ต่างจาก Composite ที่ทำ Bevel ฟันหน้าได้)",
      "ลืมลบเหลี่ยม Axio-pulpal line angle ให้โค้งมนใน Class II ทำให้เกิด Stress concentration แตกหักที่แนวคอ Ismthus"
    ],
    pearl: "High-Copper ขจัด Gamma-2 (Sn-Hg) ➔ ลด Creep & Corrosion | Zn + น้ำ = Delayed Expansion (H2 gas) | Amalgam Margin = 90° เสมอ!",
    reference: "Anusavice Phillips' Science of Dental Materials 13th ed. & Sturdevant 7th ed."
  },

  "Operative-GIC-RMGIC": {
    title: "วัสดุกลาสไอโอโนเมอร์และการยึดติดทางเคมี (GIC, RMGIC & ART)",
    specialty: "ทันตกรรมบูรณะ/หัตถการ",
    category: "ทันตกรรมบูรณะ/หัตถการ",
    badgeColor: "#0d9488",
    must_know_topics: [
      "Acid-Base Reaction (Polyacrylic Acid + Fluoroaluminosilicate Glass)",
      "Chemical Bond: Carboxyl (COO-) Chelation with Ca2+ in Hydroxyapatite",
      "Water Balance Vulnerability (Syneresis & Imbibition / Varnish Coat)",
      "RMGIC Dual Setting & Fluoride Recharge Mechanism"
    ],
    overview: "เคมีการเซ็ตตัวแบบกรด-ด่างของ Glass Ionomer Cement กลไกการยึดติดทางเคมีโดยตรงกับเนื้อฟันและการดูดซับ-ปล่อยฟลูออไรด์ รวมถึงเหตุผลความไวต่อน้ำในระยะแรก",
    core_mechanism: "GIC แข็งตัวจากปฏิกิริยา Acid-base ระหว่างผงแก้ว (Fluoroaluminosilicate) กับกรดอินทรีย์ (Polyacrylic acid) ปล่อย Ca2+ (เซ็ตตัวขั้นต้นอ่อนแอและไวต่อความชื้นภายใน 5–10 นาทีแรก) และตามด้วย Al3+ เกิด Cross-linked polyalkenoate matrix แข็งแรงภายใน 24 ชม. การยึดเกาะเกิดจากหมู่ Carboxyl (-COO-) คีเลตกับ Ca2+ ของฟันโดยตรง",
    matrix_headers: ["คุณสมบัติ / ชนิดวัสดุ", "กลไกเคมีและจุดเด่น", "ข้อระวัง & การจัดการพื้นผิว"],
    matrix_rows: [
      ["การเตรียมผิวฟัน (Conditioning)", "ใช้ 10–20% Polyacrylic Acid (Dentin conditioner) 10–15 วินาที แล้วล้าง-ซับหมาด (ไม่เป่าแห้งผาก)", "ห้ามใช้ 37% Phosphoric acid นานๆ ก่อนอุด GIC เพราะชะเอา Ca2+ ออกหมด ทำให้พันธะเคมีลดลง!"],
      ["ความไวต่อน้ำ (Early Moisture Control)", "24 ชม.แรก: โดนน้ำลายทำให้แร่ธาตุชะล้าง (Imbibition/Washout); เป่าแห้งเกินไปทำให้แตกร้าว (Syneresis)", "ทา Petroleum jelly / Unfilled resin varnish คลุมผิว GIC ทันทีหลังแต่งรูปเสร็จ (ใน Conventional GIC)"],
      ["RMGIC (Resin-Modified GIC)", "เติม HEMA + Photoinitiator ทำให้แข็งตัวทันทีด้วยแสง (Light cure) ร่วมกับปฏิกิริยา Acid-base ต่อเนื่อง", "ยังคงมี Acid-base reaction ต่อได้ในที่มืด แต่ไม่ควรอุดในคนที่แพ้ HEMA และมีการดูดน้ำบวมตัวมากกว่า GIC ปกติเล็กน้อย"],
      ["ART & Sandwich Technique", "High-viscosity GIC ใน ART (อุดภาคสนาม) และ Open/Closed Sandwich ใต้ Composite ในขอบ Deep Class II ใกล้รากฟัน", "ข้อดีใน Deep proximal box ที่ขอบเป็น Cementum/Dentin: ยึดเคมีดีกว่าและปล่อยฟลูออไรด์กัน Recurrent caries"]
    ],
    pitfalls: [
      "ใช้ GIC ในตำแหน่งรับแรงบดเคี้ยวหนักโดยไม่จำกัดขอบเขต เช่น Class II/IV ขนาดใหญ่ในผู้ใหญ่ — แตกง่ายกว่า Amalgam/Composite ต้องเลือก High-strength GIC เฉพาะเด็กหรือทำ Sandwich",
      "คิดว่า F- ที่ปล่อยจาก GIC ลดลงแล้วจะหมดไปเลย — GIC ทำหน้าที่เป็น Fluoride Reservoir สามารถ ‘Recharge’ รับฟลูออไรด์ซ้ำจากการแปรงฟันยาสีฟันฟลูออไรด์ได้ตลอด"
    ],
    pearl: "GIC ยึดเคมีด้วย -COO- กับ Ca2+ ➔ ใช้ 10% Polyacrylic acid + ซับหมาด (ไม่กัด Phosphoric!) + ทา Varnish กันน้ำ/กันแห้ง!",
    reference: "Phillips' Science of Dental Materials 13th ed. & Mount & Hume Preservation Operative Dentistry"
  },

  "Operative-NCCL-Hypersensitivity": {
    title: "รอยโรคคอฟันสึกไร้รอยผุ (NCCLs) และภาวะเสียวฟันเนื้อฟัน (Dentin Hypersensitivity)",
    specialty: "ทันตกรรมบูรณะ/หัตถการ",
    category: "ทันตกรรมบูรณะ/หัตถการ",
    badgeColor: "#0d9488",
    must_know_topics: [
      "Abrasion (V-shaped/Notched จากแปรงฟัน) vs Erosion (Saucer/Cupped จากกรด) vs Abfraction (Wedge จากแรงเค้น)",
      "Intrinsic Erosion (GERD/Bulimia — Palatal ฟันบน) vs Extrinsic Erosion (น้ำอัดลม — Buccal ฟันหน้า)",
      "Brännström's Hydrodynamic Theory & Desensitizing Agents",
      "KNO3 (Depolarize Nerve) vs Oxalate/Glutaraldehyde/Fluoride (Occlude Tubules)"
    ],
    overview: "การแยกลักษณะสัณฐานวิทยาและสาเหตุของรอยโรคบริเวณคอฟันที่ไม่ได้เกิดจากแบคทีเรีย (NCCLs) รวมถึงหลักเลือกใช้สารลดเสียวฟันตามกลไกสรีรวิทยา",
    core_mechanism: "รอยโรค NCCLs มักเกิดจากหลายปัจจัยร่วมกัน (Multifactorial) โดย Erosion ละลายแร่ธาตุด้วยกรดที่ไม่ใช่แบคทีเรียทำให้ผิวเรียบมันเว้าเป็นช้อน (Saucer-shaped) และพบรอยอุด Amalgam ยื่นนูนพ้นเนื้อฟัน (Amalgam island) ส่วน Abrasion เกิดร่องตัว V มุมเปิดกว้างขอบเรียบขวางแนวฟัน และ Abfraction เกิดรอยบากคมลึกใต้ขอบเหงือกจากแรงดัดโค้ง (Flexural stress) สำหรับอาการเสียวฟันเกิดจากท่อเนื้อฟันเปิดออกสู่ภายนอก (Open dentinal tubules) ตาม Hydrodynamic theory",
    matrix_headers: ["ชนิด NCCLs / ยาลดเสียวฟัน", "ลักษณะจำเพาะ & กลไกการเกิด", "การวินิจฉัยแยกและวิธีจัดการ"],
    matrix_rows: [
      ["Erosion (กรดภายใน vs ภายนอก)", "Saucer/Cupped lesion ผิวเรียบมัน; Intrinsic (กรดไหลย้อน GERD/อาเจียน Bulimia) ➔ ด้าน ‘Palatal ฟันหน้าบน’ & Occlusal ล่าง", "Extrinsic (น้ำอัดลม/เลมอน) ➔ ด้าน Labial ฟันหน้าบน; แนะบ้วนน้ำเปล่า/นมหลังอาเจียน ห้ามแปรงฟันทันทีหลังโดนกรด!"],
      ["Abrasion & Abfraction", "Abrasion: ร่องตัว V ขอบป้านกว้าง มักพบหลายซี่ด้านที่ถนัดแปรงแรง | Abfraction: ลิ่มคมลึก (Wedge) มักพบซี่เดียวที่มีแรงสบหนัก (Traumatic occlusion)", "แก้ที่สาเหตุ: เปลี่ยนขนแปรงนุ่ม/แปรงเบา, ปรับสบฟันถ้าพบ interference; อุด RMGIC หรือ Flowable/Composite (ยืดหยุ่นดีรับแรงบิด)"],
      ["Potassium Nitrate (KNO3 5% ในยาสีฟัน)", "เพิ่มความเข้มข้น K+ นอกเซลล์ประสาท ยับยั้งการ Depolarize (ลดการส่งสัญญาณประสาทโดยตรง ไม่ได้อุดท่อฟัน!)", "ต้องใช้อย่างต่อเนื่อง ~2–4 สัปดาห์ขึ้นไปจึงเห็นผลชัด"],
      ["Oxalate / Gluma / Fluoride Varnish / Arginine", "ตกตะกอน/แข็งตัวปิดปากท่อ Dentinal tubules (Tubular occlusion) ตามกฎ Poiseuille (ลดรัศมีท่อยิ่งลด Flow ยกกำลัง 4!)", "เหมาะใช้ในคลินิก (In-office desensitizing) ร่วมกับ Bonding resin หากมีคอฟันสึกลึก"]
    ],
    pitfalls: [
      "แนะนำผู้ป่วยกรดไหลย้อน/ดื่มน้ำอัดลมให้รีบ ‘แปรงฟันทันที’ หลังอาเจียนหรือดื่มเปรี้ยว — ผิด! เคลือบฟันที่กำลังอ่อนตัวจากกรดจะถูกขนแปรงถูกร่อนเร็วกว่าเดิมมาก ต้องให้บ้วนน้ำเปล่า/เบกกิ้งโซดาและรอ ~30–60 นาทีก่อนแปรง",
      "ใช้ Composite ชนิดแข็งเกร็งเกินไป (High modulus) อุด Abfraction โดยไม่แก้การสบฟัน ➔ เกิดแรงเฉือนทำให้ขอบวัสดุหลุด/รั่วซึมง่าย ควรเลือก Low-modulus flowable composite หรือ RMGIC"
    ],
    pearl: "Erosion ด้าน Palatal ฟันบน = กรดไหลย้อน/Bulimia (ห้ามแปรงฟันทันทีหลังโดนกรด!) | KNO3 = กดประสาท | Oxalate/Gluma/Fluorovarnish = อุดท่อ Dentin!",
    reference: "Sturdevant's Art and Science of Operative Dentistry 7th ed."
  },

  "Operative-Adhesive-Systems": {
    title: "ระบบสารยึดติดทางทันตกรรม ชั้นลูกผสม และ 10-MDP (Dental Adhesives)",
    specialty: "ทันตกรรมบูรณะ/หัตถการ",
    category: "ทันตกรรมบูรณะ/หัตถการ",
    badgeColor: "#0d9488",
    must_know_topics: [
      "Enamel Bonding (Micromechanical Tags) vs Dentin Bonding (Hybrid Layer — Nakabayashi)",
      "Etch-and-Rinse (Total-Etch: 3-Step vs 2-Step)",
      "Self-Etch (1-Step vs 2-Step Mild) & Selective Enamel Etching",
      "10-MDP (Chemical Bond to Ca2+ / Zirconia) & MMPs"
    ],
    overview: "วิวัฒนาการและเคมีของสารยึดติดตั้งแต่ 3-Step Total-Etch จนถึง Universal Adhesive (10-MDP) เหตุใด Dentin จึงอ่อนไหวต่อความชื้นกว่า Enamel และกลยุทธ์ Selective Enamel Etch",
    core_mechanism: "Enamel เป็นอนินทรีย์ ~96% จึงทนการกัดกรด Phosphoric (37% 15–30 วินาที) และเป่าแห้งได้เกิด Microporosity ให้ Resin แทรกแข็งตัว แต่ Dentin มีน้ำและคอลลาเจนมาก (~30% organic + 20% water): ในระบบ Etch-and-Rinse ต้องเป่าให้แค่หมาด (Wet/Moist bonding) เพราะถ้าเป่าแห้งผาก คอลลาเจนจะยุบตัว (Collapse) สารยึดติดแทรกไม่เข้าเกิด Nanoleakage และเสียวฟันหลังอุด ส่วนระบบ Self-Etch / Universal ใช้ Functional monomer (10-MDP) ละลาย Smear layer บางส่วนและสร้างพันธะไอออนิกที่เสถียรกับ Hydroxyapatite (Nano-layering)",
    matrix_headers: ["ระบบสารยึดติด", "ขั้นตอน & กลไกที่ออกสอบ", "ข้อดี ข้อเสีย & เทคนิคยอดนิยม"],
    matrix_rows: [
      ["3-Step Etch-and-Rinse (4th Gen)", "แยกชัดเจน: 1) Acid Etch 2) Hydrophilic Primer 3) Hydrophobic Adhesive resin", "Gold Standard ความทนทานต่อ Dentin/Enamel แต่ซับซ้อนและแพ้ง่ายต่อ Over-drying ใน Dentin!"],
      ["2-Step Self-Etch (6th Gen)", "1) Acidic Primer ละลาย Smear plug กึ่งหนึ่ง (ไม่ต้องล้าง!) 2) Adhesive resin แยกขวด", "เสียวฟันหลังอุดต่ำสุด (เพราะ Smear plug ยังช่วยอุดท่อและไม่เสี่ยงคอลลาเจนแฟบ); จุดอ่อนคือยึด Enamel สู้กรดฟอสฟอริกไม่ได้"],
      ["Universal Adhesives (8th Gen)", "มีสาร 10-MDP + Silane ใช้ได้ทั้ง Total-etch, Self-etch หรือ ‘Selective Enamel Etch’ + ยึดติดโลหะ/Zirconia", "สูตรที่ดีที่สุดทางคลินิก: กัด Phosphoric เฉพาะขอบ ‘Enamel’ 15 วิ ➔ ล้างเป่าแห้ง ➔ ทา Universal ทั่วทั้ง Enamel & Dentin!"],
      ["บทบาท 2% CHX ในการป้องกันการเสื่อมพันธะ", "เมื่อกัดกรดจะปลุกเอนไซม์ MMPs ในเนื้อฟันให้ย่อยคอลลาเจนชั้น Hybrid layer ภายใน 1–2 ปี", "ทา 2% CHX (MMP inhibitor) หลังกัดกรดฟันผุก่อนทาบอนดิ้งในระบบ Total-etch ช่วยยืดอายุ Hybrid layer"]
    ],
    pitfalls: [
      "เป่า Dentin จนแห้งผากเสียงดังฟู่หลังกัดกรด Phosphoric ในระบบ Total-etch ➔ คอลลาเจนยุบตัวเกิด White frosted dentin และเสียวฟันหลังอุดรุนแรง! (ต้องซับหมาดด้วยก้อนสำลี/ฟองน้ำ)",
      "ใช้ All-in-one (1-Step) กับ Dual-cure / Self-cure Core composite โดยไม่ตรวจสอบความเข้ากันได้: กรดที่ตกค้างในขวดเดียวจะทำลาย Tertiary amine ของ Self-cure resin ทำให้ติดไม่อยู่!"
    ],
    pearl: "Total-etch Dentin ต้อง ‘ชื้นหมาด (Moist)’ กันคอลลาเจนแฟบ | Universal + 10-MDP วิธีดีสุดคือ ‘Selective Enamel Etch’ (กัดเฉพาะ Enamel)!",
    reference: "Van Meerbeek / Sturdevant's Operative Dentistry 7th ed. & Summit's Fundamentals"
  },

  "Operative-Pulp-Protection-Deep-Caries": {
    title: "การปกป้องโพรงประสาทฟัน ความหนาเนื้อฟันที่เหลือ (RDT) และการกรอผุเชิงอนุรักษ์",
    specialty: "ทันตกรรมบูรณะ/หัตถการ",
    category: "ทันตกรรมบูรณะ/หัตถการ",
    badgeColor: "#0d9488",
    must_know_topics: [
      "Remaining Dentin Thickness (RDT > 2.0 mm vs 0.5–1.5 mm vs < 0.5 mm)",
      "Selective Caries Removal to Soft/Firm Dentin vs Stepwise Excavation",
      "Liners: Calcium Hydroxide / MTA / Biodentine vs Bases: RMGIC / GIC",
      "ทฤษฎีการป้องกัน Microleakage vs Thermal Insulation"
    ],
    overview: "หลักการเลือกใช้ Liners และ Bases ตามความหนาของเนื้อฟันที่เหลืออยู่ (RDT) และแนวทางสากลยุคใหม่ในการกำจัดฟันผุลึกเพื่อป้องกัน Pulp Exposure",
    core_mechanism: "ปัจจัยสำคัญที่สุดในการปกป้องโพรงประสาทฟันไม่ใช่การทารองพื้นหนาๆ แต่คือการป้องกันแบคทีเรียรั่วซึม (Microleakage) และรักษา RDT: เนื้อฟันธรรมชาติเองเป็นฉนวนความร้อนที่ดีที่สุดอยู่แล้ว หาก RDT ≥ 2.0 mm ไม่ต้องใส่ Liner/Base เลย แต่ถ้า RDT < 0.5 mm ใกล้ทะลุโพรงประสาทในฟันมีชีวิตปกติ ให้กรอขอบรอบนอก (Peripheral) ให้สะอาดแข็งแล้วเหลือ Soft/Leathery dentin บนเพดานโพรงประสาทเล็กน้อย (Selective Caries Removal) ปิดทับด้วย Bioceramic/Ca(OH)2 + RMGIC และอุดปิดสนิทถาวรครั้งเดียว",
    matrix_headers: ["ความหนาเนื้อฟัน (RDT)", "คำจำกัดความ & ลักษณะทางคลินิก", "แนวทางการปกป้องโพรงประสาท & วัสดุ"],
    matrix_rows: [
      ["RDT ≥ 2.0 mm (ตื้น - ปานกลาง)", "ผนังเนื้อฟันหนา โอกาสสารเคมีซึมถึง Pulp ต่ำ", "Composite: Adhesive system เลย | Amalgam: Bonding / Varnish (หรือไม่ต้องรองพื้นเลย!)"],
      ["RDT 0.5–1.5 mm (ลึกปานกลาง)", "เห็นเงาสีเนื้อฟันใกล้โพรงประสาทแต่ยังไม่เห็นสีชมพู", "ใช้ Base/Liner ชนิด RMGIC หรือ GIC ปูพื้น (Amalgam อาจรอง Base เพื่อลดความร้อน/เคมี) ส่วน Composite ใช้ Adhesive ได้หรือ RMGIC เฉพาะจุดลึก"],
      ["RDT < 0.5 mm (ลึกมาก ใกล้/เห็นเงาชมพู)", "มี Leathery dentin บนเพดาน Pulp ในฟันปกติ/Reversible pulpitis", "ทำ Selective Caries Removal (หยุดกรอตรงกลาง ➔ กรอขอบรอบข้างสะอาด!) รองจุดลึกด้วย Ca(OH)2 / MTA / Biodentine แล้วคลุมด้วย RMGIC ก่อนอุดทับ"],
      ["Pulp Exposure เล็ก (< 1 mm ปราศจากหนอง)", "ทะลุจุดเข็ม (Pinpoint mechanical exposure หรือ Caries exposure เล็กที่ห้ามเลือดได้)", "Direct Pulp Capping: ล้าง NaOCl ห้ามเลือด ปิดด้วย MTA / Biodentine (ดีกว่า Ca(OH)2 เพราะปิดสนิทกว่าและลด Tunnel defects!)"]
    ],
    pitfalls: [
      "กรอฟันผุลึกในห้องคลินิกจน Hard dentin สนิทกลางเพดานโพรงประสาทจน Pulp ทะลุ ทั้งที่ไม่มีอาการปวด (Irreversible) — ขัดต่อคำแนะนำ AAE/ESE ล่าสุดที่ให้ทำ Selective Caries Removal!",
      "ใช้ Zinc Oxide Eugenol (ZOE) เป็น Base/Liner ใต้การอุด Composite Resin ➔ Eugenol เป็น Phenolic compound ที่ยับยั้ง Polymerization ของ Resin ทำให้วัสดุไม่แข็งตัว"
    ],
    pearl: "ห้ามใช้ ZOE ใต้ Composite! | RDT < 0.5 mm + ไม่มีอาการ = Selective Removal เหลือ Firm/Leathery ตรงกลาง + ปิดขอบรอบด้านให้สนิท ➔ ปิดด้วย Bioceramic/RMGIC!",
    reference: "ESE Position Statement on Deep Caries & Sturdevant's Operative Dentistry 7th ed."
  },

  "Operative-Bleaching-Esthetics": {
    title: "การฟอกสีฟัน กลไกออกซิเดชัน และทันตกรรมเพื่อความสวยงาม (Bleaching & Veneers)",
    specialty: "ทันตกรรมบูรณะ/หัตถการ",
    category: "ทันตกรรมบูรณะ/หัตถการ",
    badgeColor: "#0d9488",
    must_know_topics: [
      "Hydrogen Peroxide (In-Office 30–38%) vs Carbamide Peroxide (10% = ~3.5% HP) vs Sodium Perborate",
      "Delayed Composite Bonding หลังฟอกสีฟัน (Wait 1–2 Weeks!)",
      "External Cervical Resorption in Non-Vital Walking Bleach (Barrier 2 mm ที่ CEJ)",
      "Porcelain Veneers Depth (0.3–0.5 mm) & Hydrofluoric Acid + Silane"
    ],
    overview: "กลไกทางเคมีของสารฟอกสีฟัน ความเข้มข้นและอัตราการแตกตัว ภาวะแทรกซ้อนที่ต้องป้องกันใน Walking Bleach และข้อควรระวังก่อนบูรณะด้วยเรซินคอมโพสิต",
    core_mechanism: "สารฟอกสีฟันออกฤทธิ์โดย Hydrogen peroxide ซึมผ่านช่องระหว่างแท่งเคลือบฟันแตกตัวเป็น Free radicals (Perhydroxyl & Oxygen radicals) ไปตัดพันธะคู่ (Double bonds) ของโมเลกุลสีขนาดใหญ่ (Chromophores) ให้เป็นสายสั้นที่สะท้อนแสงสว่างขึ้น ทว่าออกซิเจนที่ตกค้างใน Enamel/Dentin จะยับยั้งปฏิกิริยา Polymerization ของเรซิน (ลด Bond strength ~25–50%) จึงต้องรออย่างน้อย 7–14 วันหลังฟอกสีฟันก่อนอุด/ติด Veneer!",
    matrix_headers: ["รูปแบบ / หัตถการ", "สารออกฤทธิ์และความเข้มข้น", "ข้อควรระวัง / ภาวะแทรกซ้อนจำเพาะ"],
    matrix_rows: [
      ["Home Bleaching (Take-home)", "10%–20% Carbamide Peroxide (10% CP แตกตัวได้ ~3.5% H2O2 + Urea)", "เสียวฟันน้อย คุมระดับสีปลอดภัย; ใช้ถาดเฉพาะบุคคลแบบมี Reservoir และตัดขอบห่างเหงือก"],
      ["In-Office Vital Bleaching", "25%–38% Hydrogen Peroxide (ออกฤทธิ์เร็ว)", "ต้องกั้นเหงือกด้วย Resin barrier แน่นหนา (เสี่ยง Chemical burn) และห้ามใช้ความร้อนสูงจนเกิน 5.5°C ต่อ Pulp"],
      ["Walking Bleach (Non-Vital)", "Sodium Perborate ผสมน้ำกลั่น (ปลอดภัยสุด! ดีกว่าผสม 30% H2O2) ปิดใน Chamber 3–7 วัน", "ต้องกรอก GP ลงใต้ระดับ ‘CEJ ~2 mm’ และวาง ‘Barrier (GIC/RMGIC)’ รูป Bobsled/Ski slope ปิดทับก่อนเสมอเพื่อป้องกัน External Cervical Resorption!"],
      ["Post-Bleaching Composite / Veneers", "ต้องรอให้ออกซิเจนระเหยออกจากเนื้อฟัน หรือทา Antioxidant (10% Sodium Ascorbate)", "รออย่างน้อย 1–2 สัปดาห์หลังหยุดฟอกสีฟัน ทั้งก่อนเทียบเฉดสีและก่อน Bonding!"]
    ],
    pitfalls: [
      "อุด Composite ปิดทับโพรงเข้าด้าน Palatal ทันทีในวันที่หยุดฟอกสีฟัน Non-vital — ออกซิเจนตกค้างทำให้พันธะ Composite รั่วซึม (ใช้ Temporary seal ด้วย Water/GIC ชั่วคราวหรือรอ 1–2 สัปดาห์)",
      "ใช้ 30–35% H2O2 ร่วมกับความร้อนใน Walking Bleach โดยไม่วาง Barrier ป้องกันที่ CEJ — ทำให้สารซึมผ่าน Patent dentinal tubules กระตุ้น External Cervical Resorption อย่างรุนแรง"
    ],
    pearl: "10% Carbamide Peroxide = 3.5% H2O2 | รอ 1–2 สัปดาห์หลังฟอกสีฟันก่อนอุดเรซิน! | Walking Bleach ต้องวาง Cervical Barrier (RMGIC/GIC) ใต้ CEJ เสมอ!",
    reference: "Sturdevant's Operative Dentistry 7th ed. & Cohen's Pathways of the Pulp"
  },

  // ── TMD & OCCLUSION (2) ───────────────────────────────────────────────────
  "TMD-Masticatory-Muscle-Anatomy": {
    title: "กายวิภาคศาสตร์กล้ามเนื้อบดเคี้ยวและข้อต่อขากรรไกร (Muscles & TMJ)",
    specialty: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    category: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    badgeColor: "#06b6d4",
    must_know_topics: [
      "Elevators (Masseter, Temporalis, Medial Pterygoid) vs Depressors (Digastric, Geniohyoid, Mylohyoid)",
      "Inferior Lateral Pterygoid (Opening/Protrusion) vs Superior Lateral Pterygoid (Clenching/Power Stroke)",
      "5 Primary Muscles Innervated by CN V3 vs Digastric Posterior (CN VII)",
      "TMJ Histology: Fibrocartilage (Avascular/Non-innervated Center) vs Retrodiscal Tissue"
    ],
    overview: "กลไกการทำงานประสานกันของกล้ามเนื้อบดเคี้ยวและเส้นประสาทที่เลี้ยง รวมถึงความแตกต่างสำคัญของหัวบนกับหัวล่างของกล้ามเนื้อ Lateral Pterygoid และโครงสร้างข้อต่อ TMJ",
    core_mechanism: "การยกขากรรไกรหุบปากเกิดจาก Masseter + Medial Pterygoid (Pterygomasseteric sling) และ Temporalis ส่วน Anterior/Middle ขณะที่ Posterior Temporalis ช่วยดึงถอย (Retrusion) จุดที่ออกสอบบ่อยที่สุดคือ Lateral Pterygoid: หัวล่าง (Inferior) ดึงขากรรไกรยื่นและอ้าปาก (ถ้าหดข้างเดียวคางจะเบี่ยงไปด้านตรงข้าม) ส่วนหัวบน (Superior) ดึงรั้ง Articular disc เฉพาะตอนกัดเน้น (Power stroke) เพื่อประคอง Disc แนบกับ Condyle สำหรับพื้นผิวรับแรงของ TMJ ประกอบด้วย Dense fibrous connective tissue (ไม่ใช่ Hyaline cartilage เหมือนข้อเข่า!) จึงทนแรงเสียดทานและซ่อมแซมตัวเองได้ดี",
    matrix_headers: ["กล้ามเนื้อ / โครงสร้างข้อต่อ", "จุดเกาะ หน้าที่ & เส้นประสาทเลี้ยง", "อาการเบี่ยงเบน / Referred Pain ที่ออกสอบ"],
    matrix_rows: [
      ["Inferior Lateral Pterygoid", "Lateral pterygoid plate ➔ Neck of Condyle (CN V3): หด 2 ข้าง = ยื่นคางและอ้าปาก; หดข้างเดียว = คางเฉไปด้านตรงข้าม", "หาก CN V3 อัมพาต 1 ข้าง: เวลาอ้าปากคางจะเบี่ยงไป ‘ด้านที่มีพยาธิสภาพ’ เพราะข้างปกติผลักมา"],
      ["Superior Lateral Pterygoid", "Infratemporal crest ➔ Articular disc & Capsule (CN V3): ไม่ทำงานตอนอ้า! ทำงานตอนหุบ/กัดเน้นเพื่อรักษาเสถียรภาพ Disc", "มีส่วนทำให้เกิด Anteromedial disc displacement เมื่อทำงานเกร็งเรื้อรังร่วมกับ Ligaments หย่อน"],
      ["Masseter & Temporalis", "CN V3; Masseter (ยก + ยื่นเล็กน้อย), Posterior Temporalis (Retrusion ขากรรไกร)", "Trigger Point ปวดร้าว: Masseter ➔ ฟันกรามบน-ล่าง | Temporalis ➔ ขมับและฟันหน้า/กรามน้อยบน"],
      ["Articular Disc & Retrodiscal (Bilaminar) Zone", "Disc กลางบางไร้เส้นเลือด-ไร้ประสาท (รับแรงกดหลัก) | Posterior Bilaminar zone มีเส้นเลือดและประสาทรับความเจ็บปวดมาก", "เมื่อ Disc เคลื่อนหลุดไปด้านหน้า Condyle จึงกดทับ Bilaminar zone ทำให้ปวดข้อต่ออย่างรุนแรง"]
    ],
    pitfalls: [
      "เข้าใจผิดว่าพื้นผิวข้อต่อ TMJ ปูด้วย Hyaline cartilage เหมือนข้อต่ออื่นในร่างกาย — TMJ ปูด้วย ‘Fibrous Connective Tissue (Fibrocartilage)’",
      "จำสลับ Lateral Pterygoid: คางเฉไปทางไหน? กล้ามเนื้อ ‘ข้างซ้าย’ ดึง Condyle ซ้ายมาข้างหน้า ➔ คางชี้ไป ‘ด้านขวา (Contralateral)’! ส่วน Digastric Posterior เลี้ยงด้วย CN VII ไม่ใช่ CN V3"
    ],
    pearl: "TMJ = Fibrous CT (ไม่ใช่ Hyaline!) | Inferior Lat. Pterygoid = อ้า-ยื่น (หดซ้ายชี้ขวา) | Superior Lat. Pterygoid = ทำงานเฉพาะตอนกัดเน้น/หุบ!",
    reference: "Okeson's Management of Temporomandibular Disorders and Occlusion 8th ed."
  },

  "TMD-Mandibular-Kinetics-Posselt": {
    title: "จลนศาสตร์การเคลื่อนที่ของขากรรไกรและแผนภูมิของ Posselt (Posselt's Envelope)",
    specialty: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    category: "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    badgeColor: "#06b6d4",
    must_know_topics: [
      "Rotation (~20–25 mm in Lower Compartment) vs Translation (Upper Compartment)",
      "Centric Relation (CR) vs Maximum Intercuspation (CO/MI) & Postural Rest Position",
      "Posselt's Envelope of Motion (Sagittal Border Path Points)",
      "Working vs Non-Working Condyle Movements (Bennett Shift & Condylar Guidance)"
    ],
    overview: "กลไก 2 ระยะของการอ้าปากตามช่องข้อต่อ TMJ บน-ล่าง การแปลจุดบนแผนภูมิขอบเขตการเคลื่อนที่ของ Posselt ในระนาบ Sagittal และการเคลื่อนเยื้องด้านข้างของ Condyle",
    core_mechanism: "ในช่องข้อต่อล่าง (ระหว่าง Disc–Condyle) เกิดการหมุนรอบแกน Hinge (Pure rotation) ได้กว้างประมาณ 20–25 mm ตามแนว Terminal Hinge Border จน Condyle–Disc complex เลื่อนไถลลงล่าง-ไปหน้าตามความลาดชันของ Articular eminence ในช่องข้อต่อบน (Translation) ส่วนแผนภูมิของ Posselt แสดงเส้นทางขอบนอกสุดที่จำกัดโดย Ligaments (ขอบหลัง-ล่าง) และฟันสบกัน (ขอบบน-Superior border: CR ➔ CO/MI ➔ Edge-to-edge ➔ Protruded maximum)",
    matrix_headers: ["องค์ประกอบจลนศาสตร์", "ลักษณะทางกายวิภาค & ตัวเลขสำคัญ", "การประยุกต์ใช้ในงานทันตกรรม"],
    matrix_rows: [
      ["Lower vs Upper Joint Compartment", "ล่าง (Disc-Condyle): Rotation (0–25 mm) | บน (Disc-Fossa/Eminence): Translation (25–50 mm)", "การใส่ Facebow transfer จะหาจุด Terminal Hinge Axis เพื่อจำลองการอ้า-หุบช่วงหมุนใน Articulator"],
      ["ขอบบน (Superior Contact Border)", "เริ่มจาก CR (จุดถอยหลังบนสุด) ➔ เลื่อนหน้า ~1–1.5 mm เข้าสู่ CO/MI ➔ ฟันหน้าล่างไถลลงตาม Lingual concavity ฟันบน", "เส้นทางขอบบนถูกกำหนดโดย ‘รูปร่างและการสบของฟัน (Tooth-determined)’ ต่างจากขอบอื่นที่คุมโดยข้อต่อ/เอ็น"],
      ["Postural Rest Position (VDR)", "อยู่ในพื้นที่กลาง Envelope (ไม่ต้องกดสัมผัสฟัน) มี Freeway Space ~2–4 mm ต่ำกว่า VDO (MI)", "ห้ามบันทึก VDO โดยให้ฟันแตะตลอดเวลา ต้องเว้น Interocclusal rest space ~2–4 mm ในงานฟันปลอมทั้งปาก"],
      ["เยื้องข้างขวา (Right Lateral Excursion)", "Right Condyle = Working (หมุน + ขยับออกด้านนอกเล็กน้อยเรียกว่า Bennett movement/shift) | Left Condyle = Non-working (เดินลง-หน้า-ใน)", "มุมเดินลงและเข้าในของ Non-working condyle เรียกว่า ‘Condylar guidance angle’ และ ‘Bennett angle’"]
    ],
    pitfalls: [
      "คิดว่าจุด CR อยู่ที่ขอบหน้าสุดหรือล่างสุดของแผนภูมิ Posselt — จุด CR อยู่ ‘บนสุดและหลังสุด’ ของเส้นขอบ (Posterior-superior border) และจุด CO/MI อยู่ข้างหน้า CR เล็กน้อยในระดับต่ำกว่าไม่มาก",
      "เข้าใจสลับ Non-working (Balancing/Orbiting) กับ Working (Rotating): ขณะเยื้องขากรรไกรไปข้างซ้าย Condyle ‘ขวา’ คือ Non-working ที่เคลื่อนระยะไกลสุดลงล่าง-ไปหน้า-เข้าใน"
    ],
    pearl: "Lower Compartment = หมุน (20–25 mm) | Upper Compartment = เลื่อนไถล | ขอบบนแผนภูมิ Posselt = Tooth-determined (CR ➔ MI ➔ Edge) | Non-working เดินลง-หน้า-ใน!",
    reference: "Okeson's Management of Temporomandibular Disorders and Occlusion 8th ed. (Ch. 4–5)"
  }
};

export default CLINICAL_STUDY_GUIDES_EXTRA_1;
