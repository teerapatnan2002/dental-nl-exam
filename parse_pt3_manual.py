import json

data = {
  "questions": [
    # STEM 1
    {
      "question_text": "คนไข้มีประวัติเป็น trigeminal neuralgia ได้รับยา carbamazepine ซักพักคนไข้กลับมาเพราะมีรอยแผลบริเวณริมฝีปาก (hemorrhagic crust)\nให้ภาพ clinical กับ OPG มา\nClinical; ภาพหน้าตรง มีรอยแผลทั่วมุมปาก, ปาก, ริมฝีปากบนล่าง (รูปคล้าย ๆ ภาพด้านล่าง)\nOPG; มีฟันคุด 38 Horizontal angulation, 48 vertical angulation\n1. จากภาพทาง clinical ให้วินิจฉัยรอยโรคของคนไข้",
      "choices": [
        {"label": "A", "text": "Actinic cheilitis"},
        {"label": "B", "text": "Pemphigus vulgaris"},
        {"label": "C", "text": "Epidermolysis Bullosa"},
        {"label": "D", "text": "Erythema Multiforme"},
        {"label": "E", "text": "Herpes labialis"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "คนไข้มีประวัติเป็น trigeminal neuralgia ได้รับยา carbamazepine ซักพักคนไข้กลับมาเพราะมีรอยแผลบริเวณริมฝีปาก (hemorrhagic crust)\nให้ภาพ clinical กับ OPG มา\nClinical; ภาพหน้าตรง มีรอยแผลทั่วมุมปาก, ปาก, ริมฝีปากบนล่าง (รูปคล้าย ๆ ภาพด้านล่าง)\nOPG; มีฟันคุด 38 Horizontal angulation, 48 vertical angulation",
      "proposition": "1. จากภาพทาง clinical ให้วินิจฉัยรอยโรคของคนไข้",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้มีประวัติเป็น trigeminal neuralgia ได้รับยา carbamazepine ซักพักคนไข้กลับมาเพราะมีรอยแผลบริเวณริมฝีปาก (hemorrhagic crust)\nให้ภาพ clinical กับ OPG มา\nClinical; ภาพหน้าตรง มีรอยแผลทั่วมุมปาก, ปาก, ริมฝีปากบนล่าง (รูปคล้าย ๆ ภาพด้านล่าง)\nOPG; มีฟันคุด 38 Horizontal angulation, 48 vertical angulation\n2. Trigeminal neuralgia ส่วนใหญ่เกิดจากอะไร",
      "choices": [
        {"label": "A", "text": "Brain injury"},
        {"label": "B", "text": "Neurofibroma"},
        {"label": "C", "text": "Neuritis"},
        {"label": "D", "text": "Vascular compression"},
        {"label": "E", "text": "Viral infection"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "คนไข้มีประวัติเป็น trigeminal neuralgia ได้รับยา carbamazepine ซักพักคนไข้กลับมาเพราะมีรอยแผลบริเวณริมฝีปาก (hemorrhagic crust)\nให้ภาพ clinical กับ OPG มา\nClinical; ภาพหน้าตรง มีรอยแผลทั่วมุมปาก, ปาก, ริมฝีปากบนล่าง (รูปคล้าย ๆ ภาพด้านล่าง)\nOPG; มีฟันคุด 38 Horizontal angulation, 48 vertical angulation",
      "proposition": "2. Trigeminal neuralgia ส่วนใหญ่เกิดจากอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้มีประวัติเป็น trigeminal neuralgia ได้รับยา carbamazepine ซักพักคนไข้กลับมาเพราะมีรอยแผลบริเวณริมฝีปาก (hemorrhagic crust)\nให้ภาพ clinical กับ OPG มา\nClinical; ภาพหน้าตรง มีรอยแผลทั่วมุมปาก, ปาก, ริมฝีปากบนล่าง (รูปคล้าย ๆ ภาพด้านล่าง)\nOPG; มีฟันคุด 38 Horizontal angulation, 48 vertical angulation\n3. บอกความสัมพันธ์ของ 38 กับ IAN",
      "choices": [
        {"label": "A", "text": "Deviation of canal"},
        {"label": "B", "text": "Darkening of root"},
        {"label": "C", "text": "Bifid of root"},
        {"label": "D", "text": "Narrowing of canal"},
        {"label": "E", "text": "Interruption of white line"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "คนไข้มีประวัติเป็น trigeminal neuralgia ได้รับยา carbamazepine ซักพักคนไข้กลับมาเพราะมีรอยแผลบริเวณริมฝีปาก (hemorrhagic crust)\nให้ภาพ clinical กับ OPG มา\nClinical; ภาพหน้าตรง มีรอยแผลทั่วมุมปาก, ปาก, ริมฝีปากบนล่าง (รูปคล้าย ๆ ภาพด้านล่าง)\nOPG; มีฟันคุด 38 Horizontal angulation, 48 vertical angulation",
      "proposition": "3. บอกความสัมพันธ์ของ 38 กับ IAN",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 2
    {
      "question_text": "เด็กชายอายุ 8 ปี มาหาหมอฟันเนื่องจากเจ็บแผลบริเวณริมฝีปากซ้าย ผู้ปกครองให้ประวัติว่ามีฟันผุและเพิ่งไปรักษาซี่ 75 มาเมื่อ 2 วันก่อน (ในภาพเห็นแผลบวมที่ริมฝีปาก เห็นฟันในปากนิดหน่อย แต่ดูแลแล้ว oral hygience ดี ไม่มี plaque แต่ฟันขึ้นแบบเก ๆ)\n(ให้รูป : แผลริมฝีปากล่างขวาแบบ aphthous)\n1. รอยโรคดังกล่าวน่าจะเกิดจากสาเหตุใด",
      "choices": [
        {"label": "A", "text": "Self-inflicted trauma"},
        {"label": "B", "text": "Xylocaine trauma"},
        {"label": "C", "text": "Primary herpetic gingivostomatitis"},
        {"label": "D", "text": "Candidiasis"},
        {"label": "E", "text": "Aphthous ulcers"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "เด็กชายอายุ 8 ปี มาหาหมอฟันเนื่องจากเจ็บแผลบริเวณริมฝีปากซ้าย ผู้ปกครองให้ประวัติว่ามีฟันผุและเพิ่งไปรักษาซี่ 75 มาเมื่อ 2 วันก่อน (ในภาพเห็นแผลบวมที่ริมฝีปาก เห็นฟันในปากนิดหน่อย แต่ดูแลแล้ว oral hygience ดี ไม่มี plaque แต่ฟันขึ้นแบบเก ๆ)\n(ให้รูป : แผลริมฝีปากล่างขวาแบบ aphthous)",
      "proposition": "1. รอยโรคดังกล่าวน่าจะเกิดจากสาเหตุใด",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็กชายอายุ 8 ปี มาหาหมอฟันเนื่องจากเจ็บแผลบริเวณริมฝีปากซ้าย ผู้ปกครองให้ประวัติว่ามีฟันผุและเพิ่งไปรักษาซี่ 75 มาเมื่อ 2 วันก่อน (ในภาพเห็นแผลบวมที่ริมฝีปาก เห็นฟันในปากนิดหน่อย แต่ดูแลแล้ว oral hygience ดี ไม่มี plaque แต่ฟันขึ้นแบบเก ๆ)\n(ให้รูป : แผลริมฝีปากล่างขวาแบบ aphthous)\n2. จะ treat รอยโรคนี้อย่างไร",
      "choices": [
        {"label": "A", "text": "Acyclovir cream"},
        {"label": "B", "text": "Nystatin orabase"},
        {"label": "C", "text": "ให้ antibiotic"},
        {"label": "D", "text": "CHX mouthwash"},
        {"label": "E", "text": "จ่าย 0.1% triamcinolone acetonide oral paste"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "เด็กชายอายุ 8 ปี มาหาหมอฟันเนื่องจากเจ็บแผลบริเวณริมฝีปากซ้าย ผู้ปกครองให้ประวัติว่ามีฟันผุและเพิ่งไปรักษาซี่ 75 มาเมื่อ 2 วันก่อน (ในภาพเห็นแผลบวมที่ริมฝีปาก เห็นฟันในปากนิดหน่อย แต่ดูแลแล้ว oral hygience ดี ไม่มี plaque แต่ฟันขึ้นแบบเก ๆ)\n(ให้รูป : แผลริมฝีปากล่างขวาแบบ aphthous)",
      "proposition": "2. จะ treat รอยโรคนี้อย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็กชายอายุ 8 ปี มาหาหมอฟันเนื่องจากเจ็บแผลบริเวณริมฝีปากซ้าย ผู้ปกครองให้ประวัติว่ามีฟันผุและเพิ่งไปรักษาซี่ 75 มาเมื่อ 2 วันก่อน (ในภาพเห็นแผลบวมที่ริมฝีปาก เห็นฟันในปากนิดหน่อย แต่ดูแลแล้ว oral hygience ดี ไม่มี plaque แต่ฟันขึ้นแบบเก ๆ)\n(ให้รูป : แผลริมฝีปากล่างขวาแบบ aphthous)\n3. ในเคสนี้จะแนะนำวิธีการทำความสะอาดช่องปากอย่างไรเพื่อลดความเสี่ยงฟันผุ",
      "choices": [
        {"label": "A", "text": "งดทานแป้งและน้ำตาลไปเลย"},
        {"label": "B", "text": "ทา SDF ตั้งแต่ฟันเริ่มขึ้นในช่องปาก"},
        {"label": "C", "text": "ใช้ยาสีฟันที่มีฟลูออไรด์ 1,500 ppm"},
        {"label": "D", "text": "มาเคลือบ fluoride gel ทุกๆ 3 เดือน"},
        {"label": "E", "text": "…."}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "stem": "เด็กชายอายุ 8 ปี มาหาหมอฟันเนื่องจากเจ็บแผลบริเวณริมฝีปากซ้าย ผู้ปกครองให้ประวัติว่ามีฟันผุและเพิ่งไปรักษาซี่ 75 มาเมื่อ 2 วันก่อน (ในภาพเห็นแผลบวมที่ริมฝีปาก เห็นฟันในปากนิดหน่อย แต่ดูแลแล้ว oral hygience ดี ไม่มี plaque แต่ฟันขึ้นแบบเก ๆ)\n(ให้รูป : แผลริมฝีปากล่างขวาแบบ aphthous)",
      "proposition": "3. ในเคสนี้จะแนะนำวิธีการทำความสะอาดช่องปากอย่างไรเพื่อลดความเสี่ยงฟันผุ",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 3
    {
      "question_text": "ปวดฟันกรามน้อยซ้ายซี่ 45 เวลาเคี้ยวข้าว มีเหงือกบวมเป็นๆหายๆ\nรูปเป็น OPG เห็นซี่ 45 เป็น post,core crown ปลายรากมี lesion เล็กๆ\n1. มีซี่ 38 ให้วินิจฉัยตาม pell & gregory (ใน opg ฟันนอนอยู่)",
      "choices": [
        {"label": "A", "text": "Class II Horizontal angulation"},
        {"label": "B", "text": "Class I Mesio-angulation"},
        {"label": "C", "text": "Class I position A"},
        {"label": "D", "text": "Class II position A"},
        {"label": "E", "text": "Class I position B"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "ปวดฟันกรามน้อยซ้ายซี่ 45 เวลาเคี้ยวข้าว มีเหงือกบวมเป็นๆหายๆ\nรูปเป็น OPG เห็นซี่ 45 เป็น post,core crown ปลายรากมี lesion เล็กๆ",
      "proposition": "1. มีซี่ 38 ให้วินิจฉัยตาม pell & gregory (ใน opg ฟันนอนอยู่)",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ปวดฟันกรามน้อยซ้ายซี่ 45 เวลาเคี้ยวข้าว มีเหงือกบวมเป็นๆหายๆ\nรูปเป็น OPG เห็นซี่ 45 เป็น post,core crown ปลายรากมี lesion เล็กๆ\n2. ถามให้การรักษาซี่ 45 (ใน OPG ซี่ 45 เคย endo ปัก metal post กับน่าจะ metal crown มี radiolucency กลมๆ รอบปลายราก ไม่ใหญ่มาก)",
      "choices": [
        {"label": "A", "text": "ทำ Crown ใหม่"},
        {"label": "B", "text": "Endodontic retreatment"},
        {"label": "C", "text": "Extraction"},
        {"label": "D", "text": "Occlusal grinding"},
        {"label": "E", "text": "ทำ crown+post ใหม่"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "ปวดฟันกรามน้อยซ้ายซี่ 45 เวลาเคี้ยวข้าว มีเหงือกบวมเป็นๆหายๆ\nรูปเป็น OPG เห็นซี่ 45 เป็น post,core crown ปลายรากมี lesion เล็กๆ",
      "proposition": "2. ถามให้การรักษาซี่ 45 (ใน OPG ซี่ 45 เคย endo ปัก metal post กับน่าจะ metal crown มี radiolucency กลมๆ รอบปลายราก ไม่ใหญ่มาก)",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ปวดฟันกรามน้อยซ้ายซี่ 45 เวลาเคี้ยวข้าว มีเหงือกบวมเป็นๆหายๆ\nรูปเป็น OPG เห็นซี่ 45 เป็น post,core crown ปลายรากมี lesion เล็กๆ\n3. ระหว่าง curette 17,18 เกิดรูทะลุ (OAC) ขนาด 8 mm ต้องจัดการอย่างไรถึงจะเหมาะสม",
      "choices": [
        {"label": "A", "text": "พิมพ์ปากทำ obturator"},
        {"label": "B", "text": "แนะนำการดูแล OAC และนัดติดตามอาการ"},
        {"label": "C", "text": "จ่าย metronidazole และนัดติดตามอาการ"},
        {"label": "D", "text": "Buccal advanced flap เย็บปิด"},
        {"label": "E", "text": "ใส่ gel foam เย็บ figure of eight"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "ปวดฟันกรามน้อยซ้ายซี่ 45 เวลาเคี้ยวข้าว มีเหงือกบวมเป็นๆหายๆ\nรูปเป็น OPG เห็นซี่ 45 เป็น post,core crown ปลายรากมี lesion เล็กๆ",
      "proposition": "3. ระหว่าง curette 17,18 เกิดรูทะลุ (OAC) ขนาด 8 mm ต้องจัดการอย่างไรถึงจะเหมาะสม",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 4
    {
      "question_text": "ผู้ป่วยหญิง 30 ปี มีอาการอ้าปากได้น้อยลงหลังจากผ่าฟันคุดล่างซ้ายมาประมาณ 1 เดือน ไม่มีอาการปวด เคยมีเสียงคลิกที่หน้าหูด้านซ้าย ปัจจุบันไม่มี ให้ประวัติเคี้ยวอาหารข้างเดียว เคยผ่าตัดมดลูกกับรังไข่ มีอาการเครียดและนอนหลับยากมาประมาณ 1 ปี\nให้ภาพในช่องปากมา เป็นภาพอ้าปากมี deviate ไปด้านซ้าย (ตามรูปที่แนบ มีลูกศรแบบที่วาดให้ด้วย)\n1. ตรวจอะไรเพิ่มเพื่อประเมินและวางแผนการรักษาโรคปริทันต์",
      "choices": [
        {"label": "A", "text": "BMI กับ Vitamin D"},
        {"label": "B", "text": "INR กับ NSAIDs"},
        {"label": "C", "text": "HbA1c กับ CBC"},
        {"label": "D", "text": "FBS กับ (จำไม่ได้)"},
        {"label": "E", "text": "มวลกระดูก กับ estrogen supplement"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การวินิจฉัยโรค",
      "stem": "ผู้ป่วยหญิง 30 ปี มีอาการอ้าปากได้น้อยลงหลังจากผ่าฟันคุดล่างซ้ายมาประมาณ 1 เดือน ไม่มีอาการปวด เคยมีเสียงคลิกที่หน้าหูด้านซ้าย ปัจจุบันไม่มี ให้ประวัติเคี้ยวอาหารข้างเดียว เคยผ่าตัดมดลูกกับรังไข่ มีอาการเครียดและนอนหลับยากมาประมาณ 1 ปี\nให้ภาพในช่องปากมา เป็นภาพอ้าปากมี deviate ไปด้านซ้าย (ตามรูปที่แนบ มีลูกศรแบบที่วาดให้ด้วย)",
      "proposition": "1. ตรวจอะไรเพิ่มเพื่อประเมินและวางแผนการรักษาโรคปริทันต์",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้ป่วยหญิง 30 ปี มีอาการอ้าปากได้น้อยลงหลังจากผ่าฟันคุดล่างซ้ายมาประมาณ 1 เดือน ไม่มีอาการปวด เคยมีเสียงคลิกที่หน้าหูด้านซ้าย ปัจจุบันไม่มี ให้ประวัติเคี้ยวอาหารข้างเดียว เคยผ่าตัดมดลูกกับรังไข่ มีอาการเครียดและนอนหลับยากมาประมาณ 1 ปี\nให้ภาพในช่องปากมา เป็นภาพอ้าปากมี deviate ไปด้านซ้าย (ตามรูปที่แนบ มีลูกศรแบบที่วาดให้ด้วย)\n2. initiating factor ของอาการอ้าปากได้น้อยลง",
      "choices": [
        {"label": "A", "text": "เคี้ยวอาหารข้างเดียว"},
        {"label": "B", "text": "อาการเครียด"},
        {"label": "C", "text": "นอนหลับยาก"},
        {"label": "D", "text": "เพศหญิง"},
        {"label": "E", "text": "ผ่าฟันคุด"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "ผู้ป่วยหญิง 30 ปี มีอาการอ้าปากได้น้อยลงหลังจากผ่าฟันคุดล่างซ้ายมาประมาณ 1 เดือน ไม่มีอาการปวด เคยมีเสียงคลิกที่หน้าหูด้านซ้าย ปัจจุบันไม่มี ให้ประวัติเคี้ยวอาหารข้างเดียว เคยผ่าตัดมดลูกกับรังไข่ มีอาการเครียดและนอนหลับยากมาประมาณ 1 ปี\nให้ภาพในช่องปากมา เป็นภาพอ้าปากมี deviate ไปด้านซ้าย (ตามรูปที่แนบ มีลูกศรแบบที่วาดให้ด้วย)",
      "proposition": "2. initiating factor ของอาการอ้าปากได้น้อยลง",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้ป่วยหญิง 30 ปี มีอาการอ้าปากได้น้อยลงหลังจากผ่าฟันคุดล่างซ้ายมาประมาณ 1 เดือน ไม่มีอาการปวด เคยมีเสียงคลิกที่หน้าหูด้านซ้าย ปัจจุบันไม่มี ให้ประวัติเคี้ยวอาหารข้างเดียว เคยผ่าตัดมดลูกกับรังไข่ มีอาการเครียดและนอนหลับยากมาประมาณ 1 ปี\nให้ภาพในช่องปากมา เป็นภาพอ้าปากมี deviate ไปด้านซ้าย (ตามรูปที่แนบ มีลูกศรแบบที่วาดให้ด้วย)\n3. จัดการอย่างไรให้เหมาะสม",
      "choices": [
        {"label": "A", "text": "Muscle relaxant"},
        {"label": "B", "text": "Jaw stretching exercises"},
        {"label": "C", "text": "Stabilization splint"},
        {"label": "D", "text": "…กับ ประคบอุ่น"},
        {"label": "E", "text": "…."}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "ผู้ป่วยหญิง 30 ปี มีอาการอ้าปากได้น้อยลงหลังจากผ่าฟันคุดล่างซ้ายมาประมาณ 1 เดือน ไม่มีอาการปวด เคยมีเสียงคลิกที่หน้าหูด้านซ้าย ปัจจุบันไม่มี ให้ประวัติเคี้ยวอาหารข้างเดียว เคยผ่าตัดมดลูกกับรังไข่ มีอาการเครียดและนอนหลับยากมาประมาณ 1 ปี\nให้ภาพในช่องปากมา เป็นภาพอ้าปากมี deviate ไปด้านซ้าย (ตามรูปที่แนบ มีลูกศรแบบที่วาดให้ด้วย)",
      "proposition": "3. จัดการอย่างไรให้เหมาะสม",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 5
    {
      "question_text": "ชุมชนแห่งหนึ่ง มีปัญหาคือเด็กนักเรียนใช้บุหรี่ไฟฟ้าเป็นจำนวนมาก (เด็ก 13-15 ปี สูบบุหรี่เยอะขึ้นจาก 3.3% 2558 เป็น 15% มั้งแต่แบบเยอะขึ้นมาก 2567) และพบว่ากลุ่มเด็กวัยเรียนที่เริ่มใช้บุหรี่ไฟฟ้าครั้งแรกนั้น เป็นกลุ่มอายุที่น้อยลงเรื่อยๆ\nรูปภาพ: เป็นรูปโปสเตอร์ฟีลเตือนภัย รู้ทัน Pod toys\n1. นโยบายหรือการจัดการใดที่ควรรีบทำอย่างเร่งด่วน",
      "choices": [
        {"label": "A", "text": "ให้ความรู้เกี่ยวกับข้อดีข้อเสีย"},
        {"label": "B", "text": "ให้ life coach มาเล่าให้ตระหนัก"},
        {"label": "C", "text": "ออกนโยบายห้ามจำหน่ายและห้ามซื้อขายบุหรี่ไฟฟ้า"},
        {"label": "D", "text": "พูดคุย ซักถาม แนะนำกับเด็ก"},
        {"label": "E", "text": "ให้เด็กจับกลุ่มกันต่อต้าน something"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "stem": "ชุมชนแห่งหนึ่ง มีปัญหาคือเด็กนักเรียนใช้บุหรี่ไฟฟ้าเป็นจำนวนมาก (เด็ก 13-15 ปี สูบบุหรี่เยอะขึ้นจาก 3.3% 2558 เป็น 15% มั้งแต่แบบเยอะขึ้นมาก 2567) และพบว่ากลุ่มเด็กวัยเรียนที่เริ่มใช้บุหรี่ไฟฟ้าครั้งแรกนั้น เป็นกลุ่มอายุที่น้อยลงเรื่อยๆ\nรูปภาพ: เป็นรูปโปสเตอร์ฟีลเตือนภัย รู้ทัน Pod toys",
      "proposition": "1. นโยบายหรือการจัดการใดที่ควรรีบทำอย่างเร่งด่วน",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ชุมชนแห่งหนึ่ง มีปัญหาคือเด็กนักเรียนใช้บุหรี่ไฟฟ้าเป็นจำนวนมาก (เด็ก 13-15 ปี สูบบุหรี่เยอะขึ้นจาก 3.3% 2558 เป็น 15% มั้งแต่แบบเยอะขึ้นมาก 2567) และพบว่ากลุ่มเด็กวัยเรียนที่เริ่มใช้บุหรี่ไฟฟ้าครั้งแรกนั้น เป็นกลุ่มอายุที่น้อยลงเรื่อยๆ\nรูปภาพ: เป็นรูปโปสเตอร์ฟีลเตือนภัย รู้ทัน Pod toys\n2. ถาม Social determinants ที่มีผล",
      "choices": [
        {"label": "A", "text": "การเข้าสู่วัยรุ่น"},
        {"label": "B", "text": "การตลาดของบุหรี่ไฟฟ้า"},
        {"label": "C", "text": "เพื่อน"},
        {"label": "D", "text": "ความรู้"},
        {"label": "E", "text": "ค่านิยม"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "ชุมชนแห่งหนึ่ง มีปัญหาคือเด็กนักเรียนใช้บุหรี่ไฟฟ้าเป็นจำนวนมาก (เด็ก 13-15 ปี สูบบุหรี่เยอะขึ้นจาก 3.3% 2558 เป็น 15% มั้งแต่แบบเยอะขึ้นมาก 2567) และพบว่ากลุ่มเด็กวัยเรียนที่เริ่มใช้บุหรี่ไฟฟ้าครั้งแรกนั้น เป็นกลุ่มอายุที่น้อยลงเรื่อยๆ\nรูปภาพ: เป็นรูปโปสเตอร์ฟีลเตือนภัย รู้ทัน Pod toys",
      "proposition": "2. ถาม Social determinants ที่มีผล",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ชุมชนแห่งหนึ่ง มีปัญหาคือเด็กนักเรียนใช้บุหรี่ไฟฟ้าเป็นจำนวนมาก (เด็ก 13-15 ปี สูบบุหรี่เยอะขึ้นจาก 3.3% 2558 เป็น 15% มั้งแต่แบบเยอะขึ้นมาก 2567) และพบว่ากลุ่มเด็กวัยเรียนที่เริ่มใช้บุหรี่ไฟฟ้าครั้งแรกนั้น เป็นกลุ่มอายุที่น้อยลงเรื่อยๆ\nรูปภาพ: เป็นรูปโปสเตอร์ฟีลเตือนภัย รู้ทัน Pod toys\n3. ตาม Ottawa charter อะไรควรทำอย่างแรก",
      "choices": [
        {"label": "A", "text": "Build healthy public policy"},
        {"label": "B", "text": "Create supportive environment"},
        {"label": "C", "text": "Strengthen community action"},
        {"label": "D", "text": "Develop personal skills"},
        {"label": "E", "text": "Reorient health services"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "stem": "ชุมชนแห่งหนึ่ง มีปัญหาคือเด็กนักเรียนใช้บุหรี่ไฟฟ้าเป็นจำนวนมาก (เด็ก 13-15 ปี สูบบุหรี่เยอะขึ้นจาก 3.3% 2558 เป็น 15% มั้งแต่แบบเยอะขึ้นมาก 2567) และพบว่ากลุ่มเด็กวัยเรียนที่เริ่มใช้บุหรี่ไฟฟ้าครั้งแรกนั้น เป็นกลุ่มอายุที่น้อยลงเรื่อยๆ\nรูปภาพ: เป็นรูปโปสเตอร์ฟีลเตือนภัย รู้ทัน Pod toys",
      "proposition": "3. ตาม Ottawa charter อะไรควรทำอย่างแรก",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 6
    {
      "question_text": "หญิง 60 ปี มีรอยโรคข้างลิ้น ซื้อยามาทาแต่อาการไม่ดีขึ้น เคยมีประวัติ Radiotherapy มา 5 ปีก่อน มีโรคประจำตัว HT เส้นเลือดหัวใจตีบ กินยา amlodipine, clopidogrel, spirin (ให้รูปเป็นรอยโรคข้างลิ้นไม่ค่อยกว้างมาก แต่ค่อนข้างยาวไปตามแนวของลิ้นจาก Ant. ไป Post. ไม่ค่อยแน่ใจว่าตรงไหนเป็นขอบเขตของ lesion)\n(คล้ายรูปที่แนบมาแต่ไม่ใช่รูปนี้นะ)\n1. สาเหตุที่ทำให้เกิด xerostomia ใน pt. รายนี้",
      "choices": [
        {"label": "A", "text": "ผลข้างเคียงจาก amlodipine"},
        {"label": "B", "text": "ผลข้างเคียงจาก aspirin"},
        {"label": "C", "text": "ผลข้างเคียงจาก clopidogrel"},
        {"label": "D", "text": "ผลข้างเคียงจาก อายุมากขึ้น"},
        {"label": "E", "text": "ผลข้างเคียงจากการเคยได้รับฉายรังสี"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "หญิง 60 ปี มีรอยโรคข้างลิ้น ซื้อยามาทาแต่อาการไม่ดีขึ้น เคยมีประวัติ Radiotherapy มา 5 ปีก่อน มีโรคประจำตัว HT เส้นเลือดหัวใจตีบ กินยา amlodipine, clopidogrel, spirin (ให้รูปเป็นรอยโรคข้างลิ้นไม่ค่อยกว้างมาก แต่ค่อนข้างยาวไปตามแนวของลิ้นจาก Ant. ไป Post. ไม่ค่อยแน่ใจว่าตรงไหนเป็นขอบเขตของ lesion)\n(คล้ายรูปที่แนบมาแต่ไม่ใช่รูปนี้นะ)",
      "proposition": "1. สาเหตุที่ทำให้เกิด xerostomia ใน pt. รายนี้",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "หญิง 60 ปี มีรอยโรคข้างลิ้น ซื้อยามาทาแต่อาการไม่ดีขึ้น เคยมีประวัติ Radiotherapy มา 5 ปีก่อน มีโรคประจำตัว HT เส้นเลือดหัวใจตีบ กินยา amlodipine, clopidogrel, spirin (ให้รูปเป็นรอยโรคข้างลิ้นไม่ค่อยกว้างมาก แต่ค่อนข้างยาวไปตามแนวของลิ้นจาก Ant. ไป Post. ไม่ค่อยแน่ใจว่าตรงไหนเป็นขอบเขตของ lesion)\n(คล้ายรูปที่แนบมาแต่ไม่ใช่รูปนี้นะ)\n2. การตัดชิ้นเนื้อที่เหมาะสมในการวินิจฉัย",
      "choices": [
        {"label": "A", "text": "excisional biopsy ห่างจากขอบ lesion 1 cm"},
        {"label": "B", "text": "excisional biopsy ห่างจากขอบ lesion 2 mm"},
        {"label": "C", "text": "Incisional biopsy อยู่กลางรอยโรค"},
        {"label": "D", "text": "Incisional biopsy อยู่ขอบในรอยโรค"},
        {"label": "E", "text": "Incisional biopsy อยู่ขอบนอกรอยโรค"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "หญิง 60 ปี มีรอยโรคข้างลิ้น ซื้อยามาทาแต่อาการไม่ดีขึ้น เคยมีประวัติ Radiotherapy มา 5 ปีก่อน มีโรคประจำตัว HT เส้นเลือดหัวใจตีบ กินยา amlodipine, clopidogrel, spirin (ให้รูปเป็นรอยโรคข้างลิ้นไม่ค่อยกว้างมาก แต่ค่อนข้างยาวไปตามแนวของลิ้นจาก Ant. ไป Post. ไม่ค่อยแน่ใจว่าตรงไหนเป็นขอบเขตของ lesion)\n(คล้ายรูปที่แนบมาแต่ไม่ใช่รูปนี้นะ)",
      "proposition": "2. การตัดชิ้นเนื้อที่เหมาะสมในการวินิจฉัย",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "หญิง 60 ปี มีรอยโรคข้างลิ้น ซื้อยามาทาแต่อาการไม่ดีขึ้น เคยมีประวัติ Radiotherapy มา 5 ปีก่อน มีโรคประจำตัว HT เส้นเลือดหัวใจตีบ กินยา amlodipine, clopidogrel, spirin (ให้รูปเป็นรอยโรคข้างลิ้นไม่ค่อยกว้างมาก แต่ค่อนข้างยาวไปตามแนวของลิ้นจาก Ant. ไป Post. ไม่ค่อยแน่ใจว่าตรงไหนเป็นขอบเขตของ lesion)\n(คล้ายรูปที่แนบมาแต่ไม่ใช่รูปนี้นะ)\n3. ซักประวัติเพิ่มเติมในผู้ป่วยรายนี้",
      "choices": [
        {"label": "A", "text": "ประวัติเจ็บป่วยของคนในครอบครัว"},
        {"label": "B", "text": "ประวัติสูบบุหรี่"},
        {"label": "C", "text": "ปริมาณรังสีที่ได้รับ"},
        {"label": "D", "text": "จำนวนครั้งในการฉายรังสี"},
        {"label": "E", "text": "ตำแหน่งที่ได้รับรังสี"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "หญิง 60 ปี มีรอยโรคข้างลิ้น ซื้อยามาทาแต่อาการไม่ดีขึ้น เคยมีประวัติ Radiotherapy มา 5 ปีก่อน มีโรคประจำตัว HT เส้นเลือดหัวใจตีบ กินยา amlodipine, clopidogrel, spirin (ให้รูปเป็นรอยโรคข้างลิ้นไม่ค่อยกว้างมาก แต่ค่อนข้างยาวไปตามแนวของลิ้นจาก Ant. ไป Post. ไม่ค่อยแน่ใจว่าตรงไหนเป็นขอบเขตของ lesion)\n(คล้ายรูปที่แนบมาแต่ไม่ใช่รูปนี้นะ)",
      "proposition": "3. ซักประวัติเพิ่มเติมในผู้ป่วยรายนี้",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 7
    {
      "question_text": "เด็ก 5 ขวบ น้ำหนัก 20 kg มาพบทันตแพทย์ด้วยอาการปวดฟันกรามล่างขวาขณะเคี้ยวอาหารแล้วเศษอาหารเข้าไปติด มีประวัติปวดฟันตอนกลางคืน ภาพรังสี: 85 เงาดำทะลุ pulp รากฟันยาวปกติ pulp chamber ยังเห็นชัด, 84 เงาดำ expose ใหญ่ๆ แทบไม่เห็น pulp chamber มี root resorption ทั้ง 2 รากขึ้นมาถึง coronal ⅓ แล้ว\n1. ถ้าจะจ่าย Amoxicillin syrup 250 mg/5 ml วันละ 2 ครั้ง เช้าเย็น ต้องจ่ายกี่ ml (โจทย์บอกแค่นี้ ไม่รู้ว่าหมายถึงครั้งละกี่ ml หรือ วันละกี่ ml)",
      "choices": [
        {"label": "A", "text": "2.5 ml"},
        {"label": "B", "text": "5 ml"},
        {"label": "C", "text": "10 ml"},
        {"label": "D", "text": "15 ml"},
        {"label": "E", "text": "20 ml"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "เด็ก 5 ขวบ น้ำหนัก 20 kg มาพบทันตแพทย์ด้วยอาการปวดฟันกรามล่างขวาขณะเคี้ยวอาหารแล้วเศษอาหารเข้าไปติด มีประวัติปวดฟันตอนกลางคืน ภาพรังสี: 85 เงาดำทะลุ pulp รากฟันยาวปกติ pulp chamber ยังเห็นชัด, 84 เงาดำ expose ใหญ่ๆ แทบไม่เห็น pulp chamber มี root resorption ทั้ง 2 รากขึ้นมาถึง coronal ⅓ แล้ว",
      "proposition": "1. ถ้าจะจ่าย Amoxicillin syrup 250 mg/5 ml วันละ 2 ครั้ง เช้าเย็น ต้องจ่ายกี่ ml (โจทย์บอกแค่นี้ ไม่รู้ว่าหมายถึงครั้งละกี่ ml หรือ วันละกี่ ml)",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็ก 5 ขวบ น้ำหนัก 20 kg มาพบทันตแพทย์ด้วยอาการปวดฟันกรามล่างขวาขณะเคี้ยวอาหารแล้วเศษอาหารเข้าไปติด มีประวัติปวดฟันตอนกลางคืน ภาพรังสี: 85 เงาดำทะลุ pulp รากฟันยาวปกติ pulp chamber ยังเห็นชัด, 84 เงาดำ expose ใหญ่ๆ แทบไม่เห็น pulp chamber มี root resorption ทั้ง 2 รากขึ้นมาถึง coronal ⅓ แล้ว\n2. ทันตแพทย์ฉีดยาชา 2% Lidocaine with 1:100,000 epinephrine ไปแล้ว 1.8 mL แล้วยังไม่หายปวด สามารถเติมยาชาได้อีกกี่ mL",
      "choices": [
        {"label": "A", "text": "1.8 ml"},
        {"label": "B", "text": "2.2 ml"},
        {"label": "C", "text": "2.6 ml"},
        {"label": "D", "text": "3.0 ml"},
        {"label": "E", "text": "3.4 ml"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "เด็ก 5 ขวบ น้ำหนัก 20 kg มาพบทันตแพทย์ด้วยอาการปวดฟันกรามล่างขวาขณะเคี้ยวอาหารแล้วเศษอาหารเข้าไปติด มีประวัติปวดฟันตอนกลางคืน ภาพรังสี: 85 เงาดำทะลุ pulp รากฟันยาวปกติ pulp chamber ยังเห็นชัด, 84 เงาดำ expose ใหญ่ๆ แทบไม่เห็น pulp chamber มี root resorption ทั้ง 2 รากขึ้นมาถึง coronal ⅓ แล้ว",
      "proposition": "2. ทันตแพทย์ฉีดยาชา 2% Lidocaine with 1:100,000 epinephrine ไปแล้ว 1.8 mL แล้วยังไม่หายปวด สามารถเติมยาชาได้อีกกี่ mL",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็ก 5 ขวบ น้ำหนัก 20 kg มาพบทันตแพทย์ด้วยอาการปวดฟันกรามล่างขวาขณะเคี้ยวอาหารแล้วเศษอาหารเข้าไปติด มีประวัติปวดฟันตอนกลางคืน ภาพรังสี: 85 เงาดำทะลุ pulp รากฟันยาวปกติ pulp chamber ยังเห็นชัด, 84 เงาดำ expose ใหญ่ๆ แทบไม่เห็น pulp chamber มี root resorption ทั้ง 2 รากขึ้นมาถึง coronal ⅓ แล้ว\n3. ถ้าผู้ป่วยน้ำหนัก 20 kg ต้องการยาแก้ปวด paracetamol จะจ่ายอย่างไร",
      "choices": [
        {"label": "A", "text": "Paracetamol 325 mg sig 1 tsp q 4 h"},
        {"label": "B", "text": "Paracetamol 325 mg sig 2 tsp q 4 h"},
        {"label": "C", "text": "Paracetamol 325 mg sig 3 tsp q 4 h"},
        {"label": "D", "text": "Paracetamol 125 mg sig 1.5 tsp q 4 h"},
        {"label": "E", "text": "Paracetamol 125 mg sig 3 tsp q 4 h"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "เด็ก 5 ขวบ น้ำหนัก 20 kg มาพบทันตแพทย์ด้วยอาการปวดฟันกรามล่างขวาขณะเคี้ยวอาหารแล้วเศษอาหารเข้าไปติด มีประวัติปวดฟันตอนกลางคืน ภาพรังสี: 85 เงาดำทะลุ pulp รากฟันยาวปกติ pulp chamber ยังเห็นชัด, 84 เงาดำ expose ใหญ่ๆ แทบไม่เห็น pulp chamber มี root resorption ทั้ง 2 รากขึ้นมาถึง coronal ⅓ แล้ว",
      "proposition": "3. ถ้าผู้ป่วยน้ำหนัก 20 kg ต้องการยาแก้ปวด paracetamol จะจ่ายอย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 8
    {
      "question_text": "ชายอายุ ... ปี ทำครอบ (หรือbridge) ซี่ 36 ไปแล้วมีอาการเคี้ยวเจ็บ\n(โจทย์ให้ภาพเห็น 32-36 pfm หมดเลย ภาพประมาณนี้)\n1. ถ้า 36 มี fremitus คนไข้บอกมีประวัตินอนกัดฟัน ให้การรักษาอย่างไร",
      "choices": [
        {"label": "A", "text": "full mouth occlusal adjustment and splint"},
        {"label": "B", "text": "selective grinding and follow up"},
        {"label": "C", "text": "selective grinding and lower soft splint"},
        {"label": "D", "text": "periodontal treatment and selective splint"},
        {"label": "E", "text": "Michigan splint, selective grinding"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "ชายอายุ ... ปี ทำครอบ (หรือbridge) ซี่ 36 ไปแล้วมีอาการเคี้ยวเจ็บ\n(โจทย์ให้ภาพเห็น 32-36 pfm หมดเลย ภาพประมาณนี้)",
      "proposition": "1. ถ้า 36 มี fremitus คนไข้บอกมีประวัตินอนกัดฟัน ให้การรักษาอย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ชายอายุ ... ปี ทำครอบ (หรือbridge) ซี่ 36 ไปแล้วมีอาการเคี้ยวเจ็บ\n(โจทย์ให้ภาพเห็น 32-36 pfm หมดเลย ภาพประมาณนี้)\n2. Pathology ของรอยโรคที่ซี่ 36 PD วัดได้ 6 mm มี bone loss",
      "choices": [
        {"label": "A", "text": "Established stage: b lymphocyte"},
        {"label": "B", "text": "Established stage: adhesion migration"},
        {"label": "C", "text": "Established stage: cytokines"},
        {"label": "D", "text": "Advance stage: PMN"},
        {"label": "E", "text": "Advance stage: plasma cell"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "ชายอายุ ... ปี ทำครอบ (หรือbridge) ซี่ 36 ไปแล้วมีอาการเคี้ยวเจ็บ\n(โจทย์ให้ภาพเห็น 32-36 pfm หมดเลย ภาพประมาณนี้)",
      "proposition": "2. Pathology ของรอยโรคที่ซี่ 36 PD วัดได้ 6 mm มี bone loss",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ชายอายุ ... ปี ทำครอบ (หรือbridge) ซี่ 36 ไปแล้วมีอาการเคี้ยวเจ็บ\n(โจทย์ให้ภาพเห็น 32-36 pfm หมดเลย ภาพประมาณนี้)\n3. ผู้ป่วยให้ประวัติเคี้ยวฟันแล้วปวด แต่ไม่ทราบชี้ วิธีตรวจเพื่อหาสาเหตุ",
      "choices": [
        {"label": "A", "text": "Surgery exploratory"},
        {"label": "B", "text": "Percussion"},
        {"label": "C", "text": "Palpation"},
        {"label": "D", "text": "Periapical x-ray"},
        {"label": "E", "text": "Bite test with tooth slooth"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การวินิจฉัยโรค",
      "stem": "ชายอายุ ... ปี ทำครอบ (หรือbridge) ซี่ 36 ไปแล้วมีอาการเคี้ยวเจ็บ\n(โจทย์ให้ภาพเห็น 32-36 pfm หมดเลย ภาพประมาณนี้)",
      "proposition": "3. ผู้ป่วยให้ประวัติเคี้ยวฟันแล้วปวด แต่ไม่ทราบชี้ วิธีตรวจเพื่อหาสาเหตุ",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 9
    {
      "question_text": "27 ครอบทอง ขอบดี แต่มี mesial rest seat กับ undercut 0.01 ที่ ด้าน Mesio-buccal และมีช่องว่างตรง 26 ละก็มีอีกแต่จำไม่ได้ว่าซี่ไหน\n1.จะทำตะขอให้เกาะซี่ 27 จะต้องทำอย่างไร",
      "choices": [
        {"label": "A", "text": "ใช้ reverse aker's clasp แทน"},
        {"label": "B", "text": "ใช้ reciprocal arm ทั้งด้าน buccal, palatal"},
        {"label": "C", "text": "Dimpling"},
        {"label": "D", "text": "Recontour"},
        {"label": "E", "text": "ทำครอบใหม่"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "27 ครอบทอง ขอบดี แต่มี mesial rest seat กับ undercut 0.01 ที่ ด้าน Mesio-buccal และมีช่องว่างตรง 26 ละก็มีอีกแต่จำไม่ได้ว่าซี่ไหน",
      "proposition": "1.จะทำตะขอให้เกาะซี่ 27 จะต้องทำอย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "27 ครอบทอง ขอบดี แต่มี mesial rest seat กับ undercut 0.01 ที่ ด้าน Mesio-buccal และมีช่องว่างตรง 26 ละก็มีอีกแต่จำไม่ได้ว่าซี่ไหน\n2. ถ้าจะทำ rpd (tooth-borne) แล้วซี่ 26 (abutment ซี่ท้ายสุดของarch)เป็น surveyed crown เก่า ที่มี mesial rest seat อยู่ ถ้า survey หา undercut ใหม่ตอนนี้แล้วมี undercut ที่ mesiobuccal เท่านั้น จะทำอย่างไร",
      "choices": [
        {"label": "A", "text": "ทำ dimpling ที่ crown"},
        {"label": "B", "text": "รื้อ crown ทำใหม่ ให้มี undercut ที่ distobuccal"},
        {"label": "C", "text": "ใช้ reverse aker clasp"},
        {"label": "D", "text": "วาง reciprocal arm ทั้งด้าน buccal และ lingual"},
        {"label": "E", "text": "…."}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "27 ครอบทอง ขอบดี แต่มี mesial rest seat กับ undercut 0.01 ที่ ด้าน Mesio-buccal และมีช่องว่างตรง 26 ละก็มีอีกแต่จำไม่ได้ว่าซี่ไหน",
      "proposition": "2. ถ้าจะทำ rpd (tooth-borne) แล้วซี่ 26 (abutment ซี่ท้ายสุดของarch)เป็น surveyed crown เก่า ที่มี mesial rest seat อยู่ ถ้า survey หา undercut ใหม่ตอนนี้แล้วมี undercut ที่ mesiobuccal เท่านั้น จะทำอย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 10
    {
      "question_text": "ผู้ป่วยอายุ 50 ปีได้รับ dx: idiopathic thrombocytopenic purpura 6 เดือนที่แล้ว\nUpper arch: มีฟันแค่ incisors 4 ซี่หน้า (22 ผุ ใหญ่ หายไปครึ่งซี่) กับ 16,17\nLower arch: มี canine to canine\n(ให้รูป intraoral, panoramic)\n1.จะ bite registration เพื่อ mounting articulator ยังไง",
      "choices": [
        {"label": "A", "text": "bite block บนล่างและ bite registration"},
        {"label": "B", "text": "bite block บนและ registration"},
        {"label": "C", "text": "Silicone บน edentulous ridge"},
        {"label": "D", "text": "horseshoe shaped pink wax"},
        {"label": "E", "text": "horseshoe shaped alu-wax"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "ผู้ป่วยอายุ 50 ปีได้รับ dx: idiopathic thrombocytopenic purpura 6 เดือนที่แล้ว\nUpper arch: มีฟันแค่ incisors 4 ซี่หน้า (22 ผุ ใหญ่ หายไปครึ่งซี่) กับ 16,17\nLower arch: มี canine to canine\n(ให้รูป intraoral, panoramic)",
      "proposition": "1.จะ bite registration เพื่อ mounting articulator ยังไง",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้ป่วยอายุ 50 ปีได้รับ dx: idiopathic thrombocytopenic purpura 6 เดือนที่แล้ว\nUpper arch: มีฟันแค่ incisors 4 ซี่หน้า (22 ผุ ใหญ่ หายไปครึ่งซี่) กับ 16,17\nLower arch: มี canine to canine\n(ให้รูป intraoral, panoramic)\n2. ตรวจร่างกายหรือส่งแล็บอะไรที่เหมาะสม",
      "choices": [
        {"label": "A", "text": "CBC and platelet"},
        {"label": "B", "text": "INR and PT"},
        {"label": "C", "text": "PTT"},
        {"label": "D", "text": "Raynaud’s phenomenon"},
        {"label": "E", "text": "Clubbing finger"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "ผู้ป่วยอายุ 50 ปีได้รับ dx: idiopathic thrombocytopenic purpura 6 เดือนที่แล้ว\nUpper arch: มีฟันแค่ incisors 4 ซี่หน้า (22 ผุ ใหญ่ หายไปครึ่งซี่) กับ 16,17\nLower arch: มี canine to canine\n(ให้รูป intraoral, panoramic)",
      "proposition": "2. ตรวจร่างกายหรือส่งแล็บอะไรที่เหมาะสม",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้ป่วยอายุ 50 ปีได้รับ dx: idiopathic thrombocytopenic purpura 6 เดือนที่แล้ว\nUpper arch: มีฟันแค่ incisors 4 ซี่หน้า (22 ผุ ใหญ่ หายไปครึ่งซี่) กับ 16,17\nLower arch: มี canine to canine\n(ให้รูป intraoral, panoramic)\n3. ให้รูป x-ray pa 34-36 hypercementosis (รากหนาๆตุ้มๆ) ถามว่า dx อะไรเหมาะสมที่สุด ฟันซี่ 37 มีลักษณะใด",
      "choices": [
        {"label": "A", "text": "Hypercementosis"},
        {"label": "B", "text": "Condensing osteitis"},
        {"label": "C", "text": "Cementoblastoma"},
        {"label": "D", "text": "Florid cemento-osseous dysplasia"},
        {"label": "E", "text": "Periapical cemento-osseous dysplasia"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "ผู้ป่วยอายุ 50 ปีได้รับ dx: idiopathic thrombocytopenic purpura 6 เดือนที่แล้ว\nUpper arch: มีฟันแค่ incisors 4 ซี่หน้า (22 ผุ ใหญ่ หายไปครึ่งซี่) กับ 16,17\nLower arch: มี canine to canine\n(ให้รูป intraoral, panoramic)",
      "proposition": "3. ให้รูป x-ray pa 34-36 hypercementosis (รากหนาๆตุ้มๆ) ถามว่า dx อะไรเหมาะสมที่สุด ฟันซี่ 37 มีลักษณะใด",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 11
    {
      "question_text": "(รูปประมาณนี้ แต่ขอบไม่แดง)\nเหมือนจะมีฟัน molar อุดใหญ่มีรอยร้าว (โจทย์บอกร้าว แต่ภาพไม่ชัด)\n1. รอยโรคที่ลิ้นมีลักษณะเป็นอย่างไร",
      "choices": [
        {"label": "A", "text": "Pseudomembrane"},
        {"label": "B", "text": "Ulcer"},
        {"label": "C", "text": "Erosion"},
        {"label": "D", "text": "Desquamation"},
        {"label": "E", "text": "..."}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "(รูปประมาณนี้ แต่ขอบไม่แดง)\nเหมือนจะมีฟัน molar อุดใหญ่มีรอยร้าว (โจทย์บอกร้าว แต่ภาพไม่ชัด)",
      "proposition": "1. รอยโรคที่ลิ้นมีลักษณะเป็นอย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "(รูปประมาณนี้ แต่ขอบไม่แดง)\nเหมือนจะมีฟัน molar อุดใหญ่มีรอยร้าว (โจทย์บอกร้าว แต่ภาพไม่ชัด)\n2. รักษารอยโรคใต้ลิ้นยังไง",
      "choices": [
        {"label": "A", "text": "triamcinolone acetonine"},
        {"label": "B", "text": "ยาฆ่าเชื้อรา จำมะได้"},
        {"label": "C", "text": "Acyclovia"},
        {"label": "D", "text": "..."},
        {"label": "E", "text": "..."}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "(รูปประมาณนี้ แต่ขอบไม่แดง)\nเหมือนจะมีฟัน molar อุดใหญ่มีรอยร้าว (โจทย์บอกร้าว แต่ภาพไม่ชัด)",
      "proposition": "2. รักษารอยโรคใต้ลิ้นยังไง",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "(รูปประมาณนี้ แต่ขอบไม่แดง)\nเหมือนจะมีฟัน molar อุดใหญ่มีรอยร้าว (โจทย์บอกร้าว แต่ภาพไม่ชัด)\n3. ถ้าปล่อย crack tooth ไว้จะเกิดเหตุการณ์อะไร",
      "choices": [
        {"label": "A", "text": "Horizontal root fracture"},
        {"label": "B", "text": "Cusp fracture"},
        {"label": "C", "text": "Vertical root fracture"},
        {"label": "D", "text": "..."},
        {"label": "E", "text": "..."}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "(รูปประมาณนี้ แต่ขอบไม่แดง)\nเหมือนจะมีฟัน molar อุดใหญ่มีรอยร้าว (โจทย์บอกร้าว แต่ภาพไม่ชัด)",
      "proposition": "3. ถ้าปล่อย crack tooth ไว้จะเกิดเหตุการณ์อะไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 12
    {
      "question_text": "เด็ก 6 ขวบ สามารถทานยาได้ ไม่แพ้ยา มีโรคประจำตัวเป็น Ventricular septal defect ปวดซี่ 65 มา 2 วัน (ให้รูป clinical กับ xray 65 ที่น่าจะทะลุโพรงประสาท รากยาวมากกว่า 2/3 เนื้อฟันเหลือเยอะ)\n1. ถ้าผู้ป่วยจำเป็นต้องให้ IE prophylaxis จะจ่ายยาอะไร",
      "choices": [
        {"label": "A", "text": "Amoxicillin 50 mg/kg"},
        {"label": "B", "text": "Cephalexin 50 mg/kg"},
        {"label": "C", "text": "Clindamycin 50 mg/kg"},
        {"label": "D", "text": "Amplicilin 50mg/kg"},
        {"label": "E", "text": "Doxycycline 50mg/kg"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "เด็ก 6 ขวบ สามารถทานยาได้ ไม่แพ้ยา มีโรคประจำตัวเป็น Ventricular septal defect ปวดซี่ 65 มา 2 วัน (ให้รูป clinical กับ xray 65 ที่น่าจะทะลุโพรงประสาท รากยาวมากกว่า 2/3 เนื้อฟันเหลือเยอะ)",
      "proposition": "1. ถ้าผู้ป่วยจำเป็นต้องให้ IE prophylaxis จะจ่ายยาอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็ก 6 ขวบ สามารถทานยาได้ ไม่แพ้ยา มีโรคประจำตัวเป็น Ventricular septal defect ปวดซี่ 65 มา 2 วัน (ให้รูป clinical กับ xray 65 ที่น่าจะทะลุโพรงประสาท รากยาวมากกว่า 2/3 เนื้อฟันเหลือเยอะ)\n2. Management 65 ยังไง",
      "choices": [
        {"label": "A", "text": "Extraction"},
        {"label": "B", "text": "Pulpectomy"},
        {"label": "C", "text": "Pulpotomy"},
        {"label": "D", "text": "ITR"},
        {"label": "E", "text": "SSC"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "เด็ก 6 ขวบ สามารถทานยาได้ ไม่แพ้ยา มีโรคประจำตัวเป็น Ventricular septal defect ปวดซี่ 65 มา 2 วัน (ให้รูป clinical กับ xray 65 ที่น่าจะทะลุโพรงประสาท รากยาวมากกว่า 2/3 เนื้อฟันเหลือเยอะ)",
      "proposition": "2. Management 65 ยังไง",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็ก 6 ขวบ สามารถทานยาได้ ไม่แพ้ยา มีโรคประจำตัวเป็น Ventricular septal defect ปวดซี่ 65 มา 2 วัน (ให้รูป clinical กับ xray 65 ที่น่าจะทะลุโพรงประสาท รากยาวมากกว่า 2/3 เนื้อฟันเหลือเยอะ)\n3. vertical angle ที่ใช้ถ่ายฟิล์ม periapical ซี่ 65 คือ",
      "choices": [
        {"label": "A", "text": "-30"},
        {"label": "B", "text": "+30"},
        {"label": "C", "text": "-15"},
        {"label": "D", "text": "+15"},
        {"label": "E", "text": "+8"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "เด็ก 6 ขวบ สามารถทานยาได้ ไม่แพ้ยา มีโรคประจำตัวเป็น Ventricular septal defect ปวดซี่ 65 มา 2 วัน (ให้รูป clinical กับ xray 65 ที่น่าจะทะลุโพรงประสาท รากยาวมากกว่า 2/3 เนื้อฟันเหลือเยอะ)",
      "proposition": "3. vertical angle ที่ใช้ถ่ายฟิล์ม periapical ซี่ 65 คือ",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 13
    {
      "question_text": "คนไข้จะมาทำฟันปลอม ให้รูปช่องปากกับ vertical BW มา ฟันบนมี 18, 16-14, 12-22, 24-26, 28 missing tooth 17, 13, 23, 27 จากรูปคนไข้เป็น periodontitis ซี่ 16 D recession ค่อนข้างเยอะ ซี่ 26 D bone loss กับ recession เยอะมาก ๆ แทบจะเห็นปลายรากในช่องปากอยู่แระ เพดานปากมี torus ที่เล็กมาก ๆ\n1. ในการทำฟันปลอมบน ไม่ควรวางตะขอ retentive ที่ฟันซี่ใดมากที่สุด",
      "choices": [
        {"label": "A", "text": "14"},
        {"label": "B", "text": "16"},
        {"label": "C", "text": "24"},
        {"label": "D", "text": "26"},
        {"label": "E", "text": "28"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "คนไข้จะมาทำฟันปลอม ให้รูปช่องปากกับ vertical BW มา ฟันบนมี 18, 16-14, 12-22, 24-26, 28 missing tooth 17, 13, 23, 27 จากรูปคนไข้เป็น periodontitis ซี่ 16 D recession ค่อนข้างเยอะ ซี่ 26 D bone loss กับ recession เยอะมาก ๆ แทบจะเห็นปลายรากในช่องปากอยู่แระ เพดานปากมี torus ที่เล็กมาก ๆ",
      "proposition": "1. ในการทำฟันปลอมบน ไม่ควรวางตะขอ retentive ที่ฟันซี่ใดมากที่สุด",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้จะมาทำฟันปลอม ให้รูปช่องปากกับ vertical BW มา ฟันบนมี 18, 16-14, 12-22, 24-26, 28 missing tooth 17, 13, 23, 27 จากรูปคนไข้เป็น periodontitis ซี่ 16 D recession ค่อนข้างเยอะ ซี่ 26 D bone loss กับ recession เยอะมาก ๆ แทบจะเห็นปลายรากในช่องปากอยู่แระ เพดานปากมี torus ที่เล็กมาก ๆ\n2. หลังจากถอนฟันซี่ 26 ไปแล้ว จะทำฟันปลอมเป็น MRPD ควร design major connector แบบใดให้เหมาะสมที่สุด",
      "choices": [
        {"label": "A", "text": "Palatal plate"},
        {"label": "B", "text": "Palatal bar"},
        {"label": "C", "text": "Palatal strap"},
        {"label": "D", "text": "Horseshoe"},
        {"label": "E", "text": "Double palatal bar"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "คนไข้จะมาทำฟันปลอม ให้รูปช่องปากกับ vertical BW มา ฟันบนมี 18, 16-14, 12-22, 24-26, 28 missing tooth 17, 13, 23, 27 จากรูปคนไข้เป็น periodontitis ซี่ 16 D recession ค่อนข้างเยอะ ซี่ 26 D bone loss กับ recession เยอะมาก ๆ แทบจะเห็นปลายรากในช่องปากอยู่แระ เพดานปากมี torus ที่เล็กมาก ๆ",
      "proposition": "2. หลังจากถอนฟันซี่ 26 ไปแล้ว จะทำฟันปลอมเป็น MRPD ควร design major connector แบบใดให้เหมาะสมที่สุด",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้จะมาทำฟันปลอม ให้รูปช่องปากกับ vertical BW มา ฟันบนมี 18, 16-14, 12-22, 24-26, 28 missing tooth 17, 13, 23, 27 จากรูปคนไข้เป็น periodontitis ซี่ 16 D recession ค่อนข้างเยอะ ซี่ 26 D bone loss กับ recession เยอะมาก ๆ แทบจะเห็นปลายรากในช่องปากอยู่แระ เพดานปากมี torus ที่เล็กมาก ๆ\n3. ข้อใดควรพิจารณาในการทำฟันปลอมเคสนี้",
      "choices": [
        {"label": "A", "text": "ขนาดของพื้นที่เนื้อเยื่อรองรับของบนกับล่าง"},
        {"label": "B", "text": "..."},
        {"label": "C", "text": "..."},
        {"label": "D", "text": "..."},
        {"label": "E", "text": "..."}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "คนไข้จะมาทำฟันปลอม ให้รูปช่องปากกับ vertical BW มา ฟันบนมี 18, 16-14, 12-22, 24-26, 28 missing tooth 17, 13, 23, 27 จากรูปคนไข้เป็น periodontitis ซี่ 16 D recession ค่อนข้างเยอะ ซี่ 26 D bone loss กับ recession เยอะมาก ๆ แทบจะเห็นปลายรากในช่องปากอยู่แระ เพดานปากมี torus ที่เล็กมาก ๆ",
      "proposition": "3. ข้อใดควรพิจารณาในการทำฟันปลอมเคสนี้",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 14
    {
      "question_text": "คนไข้ผู้ชาย ทำ stent มา 4 ปี มี Hba1c 5.5 สูบบุหรี่วันละ 2 ซอง 20 ปี\nคนไข้ชาย 50 ปี มา scaling ทำ bypass หัวใจ 4 ปีที่แล้ว Hba1C 5.5 สูบบุหรี่ 2ซอง/วัน มา 20 ปี กินยา simvastatin clopidogrel\n1.ปัจจัยใดที่มีผลต่อเชื้อจุลินทรีย์",
      "choices": [
        {"label": "A", "text": "Smoking"},
        {"label": "B", "text": "Simvastatin"},
        {"label": "C", "text": "coronary artery disease"},
        {"label": "D", "text": "anticoagulants"},
        {"label": "E", "text": "เบาหวาน"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "คนไข้ผู้ชาย ทำ stent มา 4 ปี มี Hba1c 5.5 สูบบุหรี่วันละ 2 ซอง 20 ปี\nคนไข้ชาย 50 ปี มา scaling ทำ bypass หัวใจ 4 ปีที่แล้ว Hba1C 5.5 สูบบุหรี่ 2ซอง/วัน มา 20 ปี กินยา simvastatin clopidogrel",
      "proposition": "1.ปัจจัยใดที่มีผลต่อเชื้อจุลินทรีย์",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้ผู้ชาย ทำ stent มา 4 ปี มี Hba1c 5.5 สูบบุหรี่วันละ 2 ซอง 20 ปี\nคนไข้ชาย 50 ปี มา scaling ทำ bypass หัวใจ 4 ปีที่แล้ว Hba1C 5.5 สูบบุหรี่ 2ซอง/วัน มา 20 ปี กินยา simvastatin clopidogrel\n2. ฟันล่าง malocclusion วิธีทำความสะอาดด้านlingual (lingual มี torus ใหญ่ๆ)",
      "choices": [
        {"label": "A", "text": "Gauze"},
        {"label": "B", "text": "แปรงซอกฟัน"},
        {"label": "C", "text": "แปรงขนนุ่ม"},
        {"label": "D", "text": "super floss"},
        {"label": "E", "text": "แปรงพุ่มเดียว"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "stem": "คนไข้ผู้ชาย ทำ stent มา 4 ปี มี Hba1c 5.5 สูบบุหรี่วันละ 2 ซอง 20 ปี\nคนไข้ชาย 50 ปี มา scaling ทำ bypass หัวใจ 4 ปีที่แล้ว Hba1C 5.5 สูบบุหรี่ 2ซอง/วัน มา 20 ปี กินยา simvastatin clopidogrel",
      "proposition": "2. ฟันล่าง malocclusion วิธีทำความสะอาดด้านlingual (lingual มี torus ใหญ่ๆ)",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้ผู้ชาย ทำ stent มา 4 ปี มี Hba1c 5.5 สูบบุหรี่วันละ 2 ซอง 20 ปี\nคนไข้ชาย 50 ปี มา scaling ทำ bypass หัวใจ 4 ปีที่แล้ว Hba1C 5.5 สูบบุหรี่ 2ซอง/วัน มา 20 ปี กินยา simvastatin clopidogrel\n3. ข้อควรพิจารณาในการทำฟันปลอมเคสนี้ ซ้อยย้าวยาวววว",
      "choices": [
        {"label": "A", "text": "ขนาดของพื้นที่เนื้อเยื่อรองรับของบนกับล่าง"},
        {"label": "B", "text": "..."},
        {"label": "C", "text": "...."},
        {"label": "D", "text": "..."},
        {"label": "E", "text": "..."}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "คนไข้ผู้ชาย ทำ stent มา 4 ปี มี Hba1c 5.5 สูบบุหรี่วันละ 2 ซอง 20 ปี\nคนไข้ชาย 50 ปี มา scaling ทำ bypass หัวใจ 4 ปีที่แล้ว Hba1C 5.5 สูบบุหรี่ 2ซอง/วัน มา 20 ปี กินยา simvastatin clopidogrel",
      "proposition": "3. ข้อควรพิจารณาในการทำฟันปลอมเคสนี้ ซ้อยย้าวยาวววว",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 15
    {
      "question_text": "เด็ก 9 ปี มา recall 12 months ให้ประวัติรักษารากซี่ 55 มีความจุลินทรีย์ไม่ชัดเจน แปรงฟันด้วยยาสีฟันที่มีส่วนผสมของฟลูออไรด์ 1000 ppm ตอนเช้าและก่อนนอน รับประทานขนมหวานและชานมไข่มุกระหว่างวัน 3 ครั้ง\n(รูปคลินิกให้ภาพฟันหน้าบนล่างมี spacing, ซี่ 3 บนล่างยังไม่ขึ้น, โดยรวมเหงือกดีไม่อักเสบ, ไม่มี plaque)\n1. recall ครั้งนี้ถ่ายภาพรังสีอะไรบ้าง",
      "choices": [
        {"label": "A", "text": "Horizontal bitewings"},
        {"label": "B", "text": "Periapical tooth 55"},
        {"label": "C", "text": "Horizontal bitewings and panoramic"},
        {"label": "D", "text": "Horizontal bitewings and periapical tooth 55"},
        {"label": "E", "text": "Panoramic, periapical tooth 55 and horizontal bitewings"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การวินิจฉัยโรค",
      "stem": "เด็ก 9 ปี มา recall 12 months ให้ประวัติรักษารากซี่ 55 มีความจุลินทรีย์ไม่ชัดเจน แปรงฟันด้วยยาสีฟันที่มีส่วนผสมของฟลูออไรด์ 1000 ppm ตอนเช้าและก่อนนอน รับประทานขนมหวานและชานมไข่มุกระหว่างวัน 3 ครั้ง\n(รูปคลินิกให้ภาพฟันหน้าบนล่างมี spacing, ซี่ 3 บนล่างยังไม่ขึ้น, โดยรวมเหงือกดีไม่อักเสบ, ไม่มี plaque)",
      "proposition": "1. recall ครั้งนี้ถ่ายภาพรังสีอะไรบ้าง",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็ก 9 ปี มา recall 12 months ให้ประวัติรักษารากซี่ 55 มีความจุลินทรีย์ไม่ชัดเจน แปรงฟันด้วยยาสีฟันที่มีส่วนผสมของฟลูออไรด์ 1000 ppm ตอนเช้าและก่อนนอน รับประทานขนมหวานและชานมไข่มุกระหว่างวัน 3 ครั้ง\n(รูปคลินิกให้ภาพฟันหน้าบนล่างมี spacing, ซี่ 3 บนล่างยังไม่ขึ้น, โดยรวมเหงือกดีไม่อักเสบ, ไม่มี plaque)\n2. ให้คำแนะยังไง",
      "choices": [
        {"label": "A", "text": "เพิ่มความถี่แปรงฟัน"},
        {"label": "B", "text": "เพิ่มความเข้มข้นยาสีฟัน"},
        {"label": "C", "text": "ลดความถี่การกินของหวาน"},
        {"label": "D", "text": "เพิ่มความเข้มข้นยาสีฟันและลดความถี่"},
        {"label": "E", "text": "…ช้อย…"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "stem": "เด็ก 9 ปี มา recall 12 months ให้ประวัติรักษารากซี่ 55 มีความจุลินทรีย์ไม่ชัดเจน แปรงฟันด้วยยาสีฟันที่มีส่วนผสมของฟลูออไรด์ 1000 ppm ตอนเช้าและก่อนนอน รับประทานขนมหวานและชานมไข่มุกระหว่างวัน 3 ครั้ง\n(รูปคลินิกให้ภาพฟันหน้าบนล่างมี spacing, ซี่ 3 บนล่างยังไม่ขึ้น, โดยรวมเหงือกดีไม่อักเสบ, ไม่มี plaque)",
      "proposition": "2. ให้คำแนะยังไง",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เด็ก 9 ปี มา recall 12 months ให้ประวัติรักษารากซี่ 55 มีความจุลินทรีย์ไม่ชัดเจน แปรงฟันด้วยยาสีฟันที่มีส่วนผสมของฟลูออไรด์ 1000 ppm ตอนเช้าและก่อนนอน รับประทานขนมหวานและชานมไข่มุกระหว่างวัน 3 ครั้ง\n(รูปคลินิกให้ภาพฟันหน้าบนล่างมี spacing, ซี่ 3 บนล่างยังไม่ขึ้น, โดยรวมเหงือกดีไม่อักเสบ, ไม่มี plaque)\n3.จัดการ interdental spacing ฟันหน้าล่างและหน้าบนยังไง",
      "choices": [
        {"label": "A", "text": "Observe until eruption of permanent canines"},
        {"label": "B", "text": "veneer"},
        {"label": "C", "text": "ปิดด้วย fixed"},
        {"label": "D", "text": "ปิดด้วย removable"},
        {"label": "E", "text": "composite build-ups"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "เด็ก 9 ปี มา recall 12 months ให้ประวัติรักษารากซี่ 55 มีความจุลินทรีย์ไม่ชัดเจน แปรงฟันด้วยยาสีฟันที่มีส่วนผสมของฟลูออไรด์ 1000 ppm ตอนเช้าและก่อนนอน รับประทานขนมหวานและชานมไข่มุกระหว่างวัน 3 ครั้ง\n(รูปคลินิกให้ภาพฟันหน้าบนล่างมี spacing, ซี่ 3 บนล่างยังไม่ขึ้น, โดยรวมเหงือกดีไม่อักเสบ, ไม่มี plaque)",
      "proposition": "3.จัดการ interdental spacing ฟันหน้าล่างและหน้าบนยังไง",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 16
    {
      "question_text": "ผู้ป่วยมีฟันซี่ 17-16,15-13 มี PFM crown,12-26 attrition และ wear facet\nให้ film x-ray 45 มีรอยโรคปลายราก\n1.สาเหตุการเกิดฟันสึก",
      "choices": [
        {"label": "A", "text": "นอนกัดฟัน"},
        {"label": "B", "text": "เคี้ยวอาหารแข็ง"},
        {"label": "C", "text": "กินอาหารเปรี้ยว"},
        {"label": "D", "text": "ใช้แปรงสีฟันไฟฟ้า"},
        {"label": "E", "text": "โครงสร้างฟันผิดปกติ"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "ผู้ป่วยมีฟันซี่ 17-16,15-13 มี PFM crown,12-26 attrition และ wear facet\nให้ film x-ray 45 มีรอยโรคปลายราก",
      "proposition": "1.สาเหตุการเกิดฟันสึก",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้ป่วยมีฟันซี่ 17-16,15-13 มี PFM crown,12-26 attrition และ wear facet\nให้ film x-ray 45 มีรอยโรคปลายราก\n2. 33,34 ควรอุดด้วยอะไร",
      "choices": [
        {"label": "A", "text": "Siligate"},
        {"label": "B", "text": "GI"},
        {"label": "C", "text": "RMGI"},
        {"label": "D", "text": "Amalgam"},
        {"label": "E", "text": "resin composite"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "ผู้ป่วยมีฟันซี่ 17-16,15-13 มี PFM crown,12-26 attrition และ wear facet\nให้ film x-ray 45 มีรอยโรคปลายราก",
      "proposition": "2. 33,34 ควรอุดด้วยอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้ป่วยมีฟันซี่ 17-16,15-13 มี PFM crown,12-26 attrition และ wear facet\nให้ film x-ray 45 มีรอยโรคปลายราก\n3. ซี่ 45 ไม่มีอาการ -ve to percussion, -ve to palpation +ve toEPT Diagnosis เป็นอะไร",
      "choices": [
        {"label": "A", "text": "Asymptomatic irreversible pulpits with normal apical tissue"},
        {"label": "B", "text": "Asymptomatic irreversible pulpits with symptomatic apical periodontitis"},
        {"label": "C", "text": "Asymptomatic irreversible pulpits with asymptomatic apical periodontitis"},
        {"label": "D", "text": "Symptomatic irreversible pulpits with normal apical tissue"},
        {"label": "E", "text": "Symptomatic irreversible pulpitis with asymptomatic apical periodontitis"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การวินิจฉัยโรค",
      "stem": "ผู้ป่วยมีฟันซี่ 17-16,15-13 มี PFM crown,12-26 attrition และ wear facet\nให้ film x-ray 45 มีรอยโรคปลายราก",
      "proposition": "3. ซี่ 45 ไม่มีอาการ -ve to percussion, -ve to palpation +ve toEPT Diagnosis เป็นอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 17
    {
      "question_text": "ผู้หญิงอายุ 50 ปี ให้รูป OPG มา น่าจะ thalassemia เห็น coarse trabecular pattern ชัด ๆ\n(ภาพ) ให้รูป panoramic มีรากฟันเทียมซี่ 46,47 มีฟันคุดซี่ 38\n1. ลักษณะที่เห็นในภาพรังสี เรียกว่าอะไร",
      "choices": [
        {"label": "A", "text": "Marble like appearance"},
        {"label": "B", "text": "Coarse trabecular pattern"},
        {"label": "C", "text": "soap bubble"},
        {"label": "D", "text": "…"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "ผู้หญิงอายุ 50 ปี ให้รูป OPG มา น่าจะ thalassemia เห็น coarse trabecular pattern ชัด ๆ\n(ภาพ) ให้รูป panoramic มีรากฟันเทียมซี่ 46,47 มีฟันคุดซี่ 38",
      "proposition": "1. ลักษณะที่เห็นในภาพรังสี เรียกว่าอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้หญิงอายุ 50 ปี ให้รูป OPG มา น่าจะ thalassemia เห็น coarse trabecular pattern ชัด ๆ\n(ภาพ) ให้รูป panoramic มีรากฟันเทียมซี่ 46,47 มีฟันคุดซี่ 38\n2. เคยได้รับการ spleenectomy มาเมื่ออายุ 6 ปี ภาวะแทรกซ้อนที่สามารถเกิดขึ้นได้หากผู้ป่วยผ่าฟันคุดซี่ 38",
      "choices": [
        {"label": "A", "text": "เกิดการติดเชื้อ (infection)"},
        {"label": "B", "text": "กระดูกตาย"},
        {"label": "C", "text": "เกิดอาการชาที่ริมฝีปากล่างนานกว่าปกติ"},
        {"label": "D", "text": "เกิดอาการชาที่ลิ้นล่างนานกว่าปกติ"},
        {"label": "E", "text": "เลือดออกง่าย"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "ผู้หญิงอายุ 50 ปี ให้รูป OPG มา น่าจะ thalassemia เห็น coarse trabecular pattern ชัด ๆ\n(ภาพ) ให้รูป panoramic มีรากฟันเทียมซี่ 46,47 มีฟันคุดซี่ 38",
      "proposition": "2. เคยได้รับการ spleenectomy มาเมื่ออายุ 6 ปี ภาวะแทรกซ้อนที่สามารถเกิดขึ้นได้หากผู้ป่วยผ่าฟันคุดซี่ 38",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ผู้หญิงอายุ 50 ปี ให้รูป OPG มา น่าจะ thalassemia เห็น coarse trabecular pattern ชัด ๆ\n(ภาพ) ให้รูป panoramic มีรากฟันเทียมซี่ 46,47 มีฟันคุดซี่ 38\n3. โรคนี้เกิดจากอะไร",
      "choices": [
        {"label": "A", "text": "Beta-globulin gene mutation"},
        {"label": "B", "text": "…"},
        {"label": "C", "text": "…"},
        {"label": "D", "text": "…"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "ผู้หญิงอายุ 50 ปี ให้รูป OPG มา น่าจะ thalassemia เห็น coarse trabecular pattern ชัด ๆ\n(ภาพ) ให้รูป panoramic มีรากฟันเทียมซี่ 46,47 มีฟันคุดซี่ 38",
      "proposition": "3. โรคนี้เกิดจากอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 18
    {
      "question_text": "ภาพรังสีมี 13M vertical bone loss ประมาณ 50% Hygienic phrase แล้วเหลือ pocket 7 mm มีตุ่มเล็กๆที่ Lip ค่อนไปมุมขวา\n1. อ่านภาพรังสีฟันหน้าบน",
      "choices": [
        {"label": "A", "text": "13 periapical lesion"},
        {"label": "B", "text": "13 vertical bone loss 50%"},
        {"label": "C", "text": "12 horizontal bone loss 50%"},
        {"label": "D", "text": "12 widening PDL space"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การวินิจฉัยโรค",
      "stem": "ภาพรังสีมี 13M vertical bone loss ประมาณ 50% Hygienic phrase แล้วเหลือ pocket 7 mm มีตุ่มเล็กๆที่ Lip ค่อนไปมุมขวา",
      "proposition": "1. อ่านภาพรังสีฟันหน้าบน",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ภาพรังสีมี 13M vertical bone loss ประมาณ 50% Hygienic phrase แล้วเหลือ pocket 7 mm มีตุ่มเล็กๆที่ Lip ค่อนไปมุมขวา\n2. ผู้ป่วยมีอาการคัน ๆ แสบ ๆ ก่อนมาพบทันตแพทย์ 1 สัปดาห์ ควรให้การรักษาอย่างไร",
      "choices": [
        {"label": "A", "text": "จ่าย topical antivirus"},
        {"label": "B", "text": "ให้คำแนะนำการดูแลตัวเอง"},
        {"label": "C", "text": "จ่าย NSAIDs"},
        {"label": "D", "text": "จ่าย topical steriod"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "ภาพรังสีมี 13M vertical bone loss ประมาณ 50% Hygienic phrase แล้วเหลือ pocket 7 mm มีตุ่มเล็กๆที่ Lip ค่อนไปมุมขวา",
      "proposition": "2. ผู้ป่วยมีอาการคัน ๆ แสบ ๆ ก่อนมาพบทันตแพทย์ 1 สัปดาห์ ควรให้การรักษาอย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ภาพรังสีมี 13M vertical bone loss ประมาณ 50% Hygienic phrase แล้วเหลือ pocket 7 mm มีตุ่มเล็กๆที่ Lip ค่อนไปมุมขวา\n3. หลัง hygenic phase ซี่ 13 เหลือ pocket depth 7 mm ต้องทำอะไร",
      "choices": [
        {"label": "A", "text": "Osteous surgery"},
        {"label": "B", "text": "GTR with bone graft"},
        {"label": "C", "text": "Apical positioning flap"},
        {"label": "D", "text": "Modified widman flap"},
        {"label": "E", "text": "Re-root planing"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "ภาพรังสีมี 13M vertical bone loss ประมาณ 50% Hygienic phrase แล้วเหลือ pocket 7 mm มีตุ่มเล็กๆที่ Lip ค่อนไปมุมขวา",
      "proposition": "3. หลัง hygenic phase ซี่ 13 เหลือ pocket depth 7 mm ต้องทำอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 19
    {
      "question_text": "เป็นผู้ป่วยหญิง อายุ 60 ปี บวมบริเวณ vestibule บนขวามา 5 เดือน (จำไม่ได้ว่าปีหรือเดือนอ่ะ) ไม่มีโรคประจำตัว ไม่แพ้ยา สุขภาพดี เเต่มีความกังวลเกี่ยวกับการทำฟัน\nภาพ x-ray : ให้รูป arch บน เป็น edentulus arch ไม่มีฟันเลย มีบวมด้าน buccal บริเวณครอบคลุมซี่ 13-15 บวม และให้รูป arch ล่างมาเป็น edentulus เหมือนกันแต่ปกติดี\n(ภาพในช่องปากบวมประมาณนี้ เป็นด้านบนขวาเหมือนกัน)\n1. เมื่อผู้ป่วยมานั่งที่ยูนิตทำฟัน มีอาการเหงื่ออก หน้าซีด ชีพจรเต้นช้าลง เเละหมดสติ ควรช่วยฉุกเฉินอย่างไร",
      "choices": [
        {"label": "A", "text": "โทร 1669 เเละ CPR"},
        {"label": "B", "text": "ปรับท่าเป็น trendelenburg position และให้ oxygen"},
        {"label": "C", "text": "ให้อมน้ำตาลก้อน"},
        {"label": "D", "text": "ฉีด 50% dextrose in IV"},
        {"label": "E", "text": "ให้ epinephrine 0.3 mg in subligual"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "เป็นผู้ป่วยหญิง อายุ 60 ปี บวมบริเวณ vestibule บนขวามา 5 เดือน (จำไม่ได้ว่าปีหรือเดือนอ่ะ) ไม่มีโรคประจำตัว ไม่แพ้ยา สุขภาพดี เเต่มีความกังวลเกี่ยวกับการทำฟัน\nภาพ x-ray : ให้รูป arch บน เป็น edentulus arch ไม่มีฟันเลย มีบวมด้าน buccal บริเวณครอบคลุมซี่ 13-15 บวม และให้รูป arch ล่างมาเป็น edentulus เหมือนกันแต่ปกติดี\n(ภาพในช่องปากบวมประมาณนี้ เป็นด้านบนขวาเหมือนกัน)",
      "proposition": "1. เมื่อผู้ป่วยมานั่งที่ยูนิตทำฟัน มีอาการเหงื่ออก หน้าซีด ชีพจรเต้นช้าลง เเละหมดสติ ควรช่วยฉุกเฉินอย่างไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เป็นผู้ป่วยหญิง อายุ 60 ปี บวมบริเวณ vestibule บนขวามา 5 เดือน (จำไม่ได้ว่าปีหรือเดือนอ่ะ) ไม่มีโรคประจำตัว ไม่แพ้ยา สุขภาพดี เเต่มีความกังวลเกี่ยวกับการทำฟัน\nภาพ x-ray : ให้รูป arch บน เป็น edentulus arch ไม่มีฟันเลย มีบวมด้าน buccal บริเวณครอบคลุมซี่ 13-15 บวม และให้รูป arch ล่างมาเป็น edentulus เหมือนกันแต่ปกติดี\n(ภาพในช่องปากบวมประมาณนี้ เป็นด้านบนขวาเหมือนกัน)\n2. ถ้าคลำแลเวมีลักษณะเป็น fluctuate จะวินิจฉัยว่าเป็นอะไร",
      "choices": [
        {"label": "A", "text": "dentigerous cyst"},
        {"label": "B", "text": "Residual cyst"},
        {"label": "C", "text": "Radicular cyst"},
        {"label": "D", "text": "Ossifying fibroma"},
        {"label": "E", "text": "calcifying epithelial odontogenic tumor"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "เป็นผู้ป่วยหญิง อายุ 60 ปี บวมบริเวณ vestibule บนขวามา 5 เดือน (จำไม่ได้ว่าปีหรือเดือนอ่ะ) ไม่มีโรคประจำตัว ไม่แพ้ยา สุขภาพดี เเต่มีความกังวลเกี่ยวกับการทำฟัน\nภาพ x-ray : ให้รูป arch บน เป็น edentulus arch ไม่มีฟันเลย มีบวมด้าน buccal บริเวณครอบคลุมซี่ 13-15 บวม และให้รูป arch ล่างมาเป็น edentulus เหมือนกันแต่ปกติดี\n(ภาพในช่องปากบวมประมาณนี้ เป็นด้านบนขวาเหมือนกัน)",
      "proposition": "2. ถ้าคลำแลเวมีลักษณะเป็น fluctuate จะวินิจฉัยว่าเป็นอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "เป็นผู้ป่วยหญิง อายุ 60 ปี บวมบริเวณ vestibule บนขวามา 5 เดือน (จำไม่ได้ว่าปีหรือเดือนอ่ะ) ไม่มีโรคประจำตัว ไม่แพ้ยา สุขภาพดี เเต่มีความกังวลเกี่ยวกับการทำฟัน\nภาพ x-ray : ให้รูป arch บน เป็น edentulus arch ไม่มีฟันเลย มีบวมด้าน buccal บริเวณครอบคลุมซี่ 13-15 บวม และให้รูป arch ล่างมาเป็น edentulus เหมือนกันแต่ปกติดี\n(ภาพในช่องปากบวมประมาณนี้ เป็นด้านบนขวาเหมือนกัน)\n3. ถ้าไม่มี CBCT จะส่งถ่ายภาพอะไรเพื่อประเมินขนาดรอยโรค",
      "choices": [
        {"label": "A", "text": "Periapcal + occlusal cross sectional"},
        {"label": "B", "text": "Periapical + lateral oblique radiograph"},
        {"label": "C", "text": "waters view + occlusal topography"},
        {"label": "D", "text": "Waters view + occlusal cross sectional"},
        {"label": "E", "text": "Occlusal topography + lateral oblique radiograph"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "เป็นผู้ป่วยหญิง อายุ 60 ปี บวมบริเวณ vestibule บนขวามา 5 เดือน (จำไม่ได้ว่าปีหรือเดือนอ่ะ) ไม่มีโรคประจำตัว ไม่แพ้ยา สุขภาพดี เเต่มีความกังวลเกี่ยวกับการทำฟัน\nภาพ x-ray : ให้รูป arch บน เป็น edentulus arch ไม่มีฟันเลย มีบวมด้าน buccal บริเวณครอบคลุมซี่ 13-15 บวม และให้รูป arch ล่างมาเป็น edentulus เหมือนกันแต่ปกติดี\n(ภาพในช่องปากบวมประมาณนี้ เป็นด้านบนขวาเหมือนกัน)",
      "proposition": "3. ถ้าไม่มี CBCT จะส่งถ่ายภาพอะไรเพื่อประเมินขนาดรอยโรค",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 20
    {
      "question_text": "ชาย มีภาพคลินิกอุด Amalgam ซี่6ล่างclass I (O) ขอบไม่ดี\n1. สาเหตุที่ทำให้วัสดุอุดขอบ ditching",
      "choices": [
        {"label": "A", "text": "Angle of departure"},
        {"label": "B", "text": "ไม่bevel axial-pulpal line angle"},
        {"label": "C", "text": "Moisture control"},
        {"label": "D", "text": "…"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "ชาย มีภาพคลินิกอุด Amalgam ซี่6ล่างclass I (O) ขอบไม่ดี",
      "proposition": "1. สาเหตุที่ทำให้วัสดุอุดขอบ ditching",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ชาย มีภาพคลินิกอุด Amalgam ซี่6ล่างclass I (O) ขอบไม่ดี\n2. รื้อแล้วอุดเป็นคอมโพสิตต้องใช้ระบบอะไร",
      "choices": [
        {"label": "A", "text": "3 step etch and rinse"},
        {"label": "B", "text": "2 step etch and rinse"},
        {"label": "C", "text": "2 step self etch"},
        {"label": "D", "text": "1 bottle self eth"},
        {"label": "E", "text": "Unversal adhesive"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "ชาย มีภาพคลินิกอุด Amalgam ซี่6ล่างclass I (O) ขอบไม่ดี",
      "proposition": "2. รื้อแล้วอุดเป็นคอมโพสิตต้องใช้ระบบอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 21
    {
      "question_text": "คนไข้ทำ crown lengthening ซี่ 35 ให้เป็นรูปในช่องปากที่ผ่าตัดเสร็จแล้ว มีรอยไหมเย็บ ซี่ 36 missing\nซี่ 35 คือฟันเตี้ยมากๆ เหลือแต่ตอ แต่ทำ crown length แล้ว crown สูงจากเหงือกขึ้นมาอีกประมาณ 2-3 mm (ดูได้ ferrule ที่โอเค)\n1.จะบูรณะ ต้องทำอะไร",
      "choices": [
        {"label": "A", "text": "PCC with 36 implant"},
        {"label": "B", "text": "Pcc with RPD"},
        {"label": "C", "text": "Pcc with apd"},
        {"label": "D", "text": "35 coping with RPD"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "คนไข้ทำ crown lengthening ซี่ 35 ให้เป็นรูปในช่องปากที่ผ่าตัดเสร็จแล้ว มีรอยไหมเย็บ ซี่ 36 missing\nซี่ 35 คือฟันเตี้ยมากๆ เหลือแต่ตอ แต่ทำ crown length แล้ว crown สูงจากเหงือกขึ้นมาอีกประมาณ 2-3 mm (ดูได้ ferrule ที่โอเค)",
      "proposition": "1.จะบูรณะ ต้องทำอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้ทำ crown lengthening ซี่ 35 ให้เป็นรูปในช่องปากที่ผ่าตัดเสร็จแล้ว มีรอยไหมเย็บ ซี่ 36 missing\nซี่ 35 คือฟันเตี้ยมากๆ เหลือแต่ตอ แต่ทำ crown length แล้ว crown สูงจากเหงือกขึ้นมาอีกประมาณ 2-3 mm (ดูได้ ferrule ที่โอเค)\n2. ทำความสะอาดช่องปากอย่างไรในช่วงก่อนไปตัดไหม",
      "choices": [
        {"label": "A", "text": "แปรงขนนุ่มมากแปรงที่แผลเบา ๆ"},
        {"label": "B", "text": "ใช้ก็อซชุบน้ำยา CHX MW แล้วเช็ดที่แผลเบา ๆ"},
        {"label": "C", "text": "ใช้แปรงขนนุ่มแปรงบริเวณอื่น แล้วใช้ CHX MW บ้วน"},
        {"label": "D", "text": "ใช้ tranexamic acid MW"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "คนไข้ทำ crown lengthening ซี่ 35 ให้เป็นรูปในช่องปากที่ผ่าตัดเสร็จแล้ว มีรอยไหมเย็บ ซี่ 36 missing\nซี่ 35 คือฟันเตี้ยมากๆ เหลือแต่ตอ แต่ทำ crown length แล้ว crown สูงจากเหงือกขึ้นมาอีกประมาณ 2-3 mm (ดูได้ ferrule ที่โอเค)",
      "proposition": "2. ทำความสะอาดช่องปากอย่างไรในช่วงก่อนไปตัดไหม",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "คนไข้ทำ crown lengthening ซี่ 35 ให้เป็นรูปในช่องปากที่ผ่าตัดเสร็จแล้ว มีรอยไหมเย็บ ซี่ 36 missing\nซี่ 35 คือฟันเตี้ยมากๆ เหลือแต่ตอ แต่ทำ crown length แล้ว crown สูงจากเหงือกขึ้นมาอีกประมาณ 2-3 mm (ดูได้ ferrule ที่โอเค)\n3. การรักษาเพื่อทดแทนฟันซี่ 36 ที่เหมาะสมที่สุดคืออะไร",
      "choices": [
        {"label": "A", "text": "Bridge 35-37"},
        {"label": "B", "text": "Coping 35, RPD"},
        {"label": "C", "text": "35 P/C/C, 36 implant"},
        {"label": "D", "text": "35 P/C/C, RPD"},
        {"label": "E", "text": "35 P/C/C, Acrylic partial denture"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "คนไข้ทำ crown lengthening ซี่ 35 ให้เป็นรูปในช่องปากที่ผ่าตัดเสร็จแล้ว มีรอยไหมเย็บ ซี่ 36 missing\nซี่ 35 คือฟันเตี้ยมากๆ เหลือแต่ตอ แต่ทำ crown length แล้ว crown สูงจากเหงือกขึ้นมาอีกประมาณ 2-3 mm (ดูได้ ferrule ที่โอเค)",
      "proposition": "3. การรักษาเพื่อทดแทนฟันซี่ 36 ที่เหมาะสมที่สุดคืออะไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 22
    {
      "question_text": "หญิง ปวดขากรรไกรหลังผ่าฟันคุด 2 week อ้าปากน้อยลง ปวดตอนตื่น ตอนเครียด นอนกัดฟัน กินยาแก้เครียดมา1เดือน\n1. สาเหตุที่ทำให้ปวดขากรรไกร",
      "choices": [
        {"label": "A", "text": "นอนกัดฟัน"},
        {"label": "B", "text": "เครียด"},
        {"label": "C", "text": "ผ่าฟันคุด"},
        {"label": "D", "text": "…"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "หญิง ปวดขากรรไกรหลังผ่าฟันคุด 2 week อ้าปากน้อยลง ปวดตอนตื่น ตอนเครียด นอนกัดฟัน กินยาแก้เครียดมา1เดือน",
      "proposition": "1. สาเหตุที่ทำให้ปวดขากรรไกร",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "หญิง ปวดขากรรไกรหลังผ่าฟันคุด 2 week อ้าปากน้อยลง ปวดตอนตื่น ตอนเครียด นอนกัดฟัน กินยาแก้เครียดมา1เดือน\n2. รักษาปัญหาที่คนไข้ต้องการยังไง",
      "choices": [
        {"label": "A", "text": "ยืด"},
        {"label": "B", "text": "ประคบอุ่น"},
        {"label": "C", "text": "Muscle Exercise"},
        {"label": "D", "text": "…"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "หญิง ปวดขากรรไกรหลังผ่าฟันคุด 2 week อ้าปากน้อยลง ปวดตอนตื่น ตอนเครียด นอนกัดฟัน กินยาแก้เครียดมา1เดือน",
      "proposition": "2. รักษาปัญหาที่คนไข้ต้องการยังไง",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 23
    {
      "question_text": "ชาย 60 ปี มีก้อนบวมโตช้า 6 เดือน มีเลือดออกตอนแปรงฟันกับกินอาหาร กินยา เป็น HT amlodipine 5 mg once daily (มีรูปคลินิกก้อนระหว่าง 43,44 คลุม ตั้งแต่ buccal occlusal lingual ดูสีขาวปนแดง)\n(รอยโรคคล้ายๆแบบนี้แต่พาดข้ามฟัน)\n1. วินิจฉัยเบื้องต้น",
      "choices": [
        {"label": "A", "text": "Pyogenic granuloma"},
        {"label": "B", "text": "OSCC"},
        {"label": "C", "text": "Drug induced gingival enlargement"},
        {"label": "D", "text": "Peripheral ossifying fibroma"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "stem": "ชาย 60 ปี มีก้อนบวมโตช้า 6 เดือน มีเลือดออกตอนแปรงฟันกับกินอาหาร กินยา เป็น HT amlodipine 5 mg once daily (มีรูปคลินิกก้อนระหว่าง 43,44 คลุม ตั้งแต่ buccal occlusal lingual ดูสีขาวปนแดง)\n(รอยโรคคล้ายๆแบบนี้แต่พาดข้ามฟัน)",
      "proposition": "1. วินิจฉัยเบื้องต้น",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ชาย 60 ปี มีก้อนบวมโตช้า 6 เดือน มีเลือดออกตอนแปรงฟันกับกินอาหาร กินยา เป็น HT amlodipine 5 mg once daily (มีรูปคลินิกก้อนระหว่าง 43,44 คลุม ตั้งแต่ buccal occlusal lingual ดูสีขาวปนแดง)\n(รอยโรคคล้ายๆแบบนี้แต่พาดข้ามฟัน)\n2. สาเหตุรอยโรค",
      "choices": [
        {"label": "A", "text": "Calcium channel blocker"},
        {"label": "B", "text": "Local irritation"},
        {"label": "C", "text": "HPV"},
        {"label": "D", "text": "Gene mutation"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "stem": "ชาย 60 ปี มีก้อนบวมโตช้า 6 เดือน มีเลือดออกตอนแปรงฟันกับกินอาหาร กินยา เป็น HT amlodipine 5 mg once daily (มีรูปคลินิกก้อนระหว่าง 43,44 คลุม ตั้งแต่ buccal occlusal lingual ดูสีขาวปนแดง)\n(รอยโรคคล้ายๆแบบนี้แต่พาดข้ามฟัน)",
      "proposition": "2. สาเหตุรอยโรค",
      "source_exam": "NL2 2026 PART3"
    },
    {
      "question_text": "ชาย 60 ปี มีก้อนบวมโตช้า 6 เดือน มีเลือดออกตอนแปรงฟันกับกินอาหาร กินยา เป็น HT amlodipine 5 mg once daily (มีรูปคลินิกก้อนระหว่าง 43,44 คลุม ตั้งแต่ buccal occlusal lingual ดูสีขาวปนแดง)\n(รอยโรคคล้ายๆแบบนี้แต่พาดข้ามฟัน)\n3. เทคนิคฉีดยาชาอะไร",
      "choices": [
        {"label": "A", "text": "Intralesional infiltration"},
        {"label": "B", "text": "IANB"},
        {"label": "C", "text": "Mental"},
        {"label": "D", "text": "Intraligament"},
        {"label": "E", "text": "Buccal infiltration"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "stem": "ชาย 60 ปี มีก้อนบวมโตช้า 6 เดือน มีเลือดออกตอนแปรงฟันกับกินอาหาร กินยา เป็น HT amlodipine 5 mg once daily (มีรูปคลินิกก้อนระหว่าง 43,44 คลุม ตั้งแต่ buccal occlusal lingual ดูสีขาวปนแดง)\n(รอยโรคคล้ายๆแบบนี้แต่พาดข้ามฟัน)",
      "proposition": "3. เทคนิคฉีดยาชาอะไร",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 24
    {
      "question_text": "น้องเด็กมาทำฟัน คุณแม่ขอเข้าไปดูด้วย ระหว่างทำคุณแม่ก็ถามหมอตลอดว่ากำลังทำอะไรอยู่ เป็นพฤติกรรมแบบใด\n1. Over anxiety",
      "choices": [
        {"label": "A", "text": "Over anxiety"},
        {"label": "B", "text": "Over affectionate"},
        {"label": "C", "text": "Over authoritative"},
        {"label": "D", "text": "…"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "น้องเด็กมาทำฟัน คุณแม่ขอเข้าไปดูด้วย ระหว่างทำคุณแม่ก็ถามหมอตลอดว่ากำลังทำอะไรอยู่ เป็นพฤติกรรมแบบใด",
      "proposition": "1. Over anxiety",
      "source_exam": "NL2 2026 PART3"
    },
    # STEM 25
    {
      "question_text": "อายุ 8 ปี มาทำฟันครั้งแรกได้ตรวจฟันและเคลือบฟลูออไรด์ น้องให้ความร่วมมือดี วันนี้ต้องมารักษาราก น้องมีความกังวล จะใช้ behavior management อย่างไร (น่าจะอีก stem นึง)\n1. TSD and parent absence",
      "choices": [
        {"label": "A", "text": "TSD and parent absence"},
        {"label": "B", "text": "Ask-tell-ask and positive reinforcement"},
        {"label": "C", "text": "Parent absence and voice control"},
        {"label": "D", "text": "Hand-over-mouth- technique and …"},
        {"label": "E", "text": "…"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "stem": "อายุ 8 ปี มาทำฟันครั้งแรกได้ตรวจฟันและเคลือบฟลูออไรด์ น้องให้ความร่วมมือดี วันนี้ต้องมารักษาราก น้องมีความกังวล จะใช้ behavior management อย่างไร (น่าจะอีก stem นึง)",
      "proposition": "1. TSD and parent absence",
      "source_exam": "NL2 2026 PART3"
    }
  ]
}

with open('/Users/admin/Downloads/NL Test/parsed_exams/NL2_2026_PART3.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("JSON file created successfully!")
