import json
import os

data = {
  "questions": [
    {
      "question_text": "STEM 1\nเด็กอายุ 13 แม่อยากให้จัดฟันแก้ฟันซ้อนเก มีฟิล์มมีรูป 13 embedded ในรูปเหมือนมี ก้อนขาวๆ หน้าตาเหมือนฟัน\n1. ส่งถ่ายอะไรเพื่อระบุตำแหน่งความผิดปกติ",
      "choices": [
        {"label": "1", "text": "Occlusal cross-sectional"},
        {"label": "2", "text": "Occlusal topographic"},
        {"label": "3", "text": "Shift tube periapical"},
        {"label": "4", "text": "Panoramic"},
        {"label": "5", "text": "PA ceph"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 1\nเด็กอายุ 13 แม่อยากให้จัดฟันแก้ฟันซ้อนเก มีฟิล์มมีรูป 13 embedded ในรูปเหมือนมี ก้อนขาวๆ หน้าตาเหมือนฟัน\n2. dx",
      "choices": [
        {"label": "1", "text": "11 Macrodontia"},
        {"label": "2", "text": "12 Dens invaginatis"},
        {"label": "3", "text": "13 Microdontia"},
        {"label": "4", "text": "Dental dysplasia"},
        {"label": "5", "text": "Complex odontoma"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 1\nเด็กอายุ 13 แม่อยากให้จัดฟันแก้ฟันซ้อนเก มีฟิล์มมีรูป 13 embedded ในรูปเหมือนมี ก้อนขาวๆ หน้าตาเหมือนฟัน\n3. Bolton’s analysis ได้ overall ratio = 95 แปลผลได้อย่างไร",
      "choices": [
        {"label": "1", "text": "ฟันหน้าบนใหญ่"},
        {"label": "2", "text": "ฟันหน้าล่างใหญ่"},
        {"label": "3", "text": "ฟันบนใหญ่"},
        {"label": "4", "text": "ฟันล่างใหญ่"},
        {"label": "5", "text": "ฟันบนและล่างมีขนาดเหมาะสม"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมจัดฟัน",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 2\nผู้ป่วยเพศชายอายุ 50 ปี มาด้วยอาการเสียวฟัน 26 เวลาทานน้ำหวาน เศษอาหารติด เป็นโรคความดันและเก๊าท์ ปฏิเสธภาวะแทรกซ้อนของโรคเก๊าท์ เวลาเดินจะมีปวดข้อ เลยเดินได้ไม่เหมือนปกติ ปัจจุบันกินยา amlopidine, allopurinol วันนี้วัดความดันได้ 145/65 และ pulse rate 85 ให้รูปเป็น 26 supraeruption, มี CF ClV, ไม่มีคู่สบ\n4. จัดเป็น ASA class อะไร",
      "choices": [
        {"label": "1", "text": "I"},
        {"label": "2", "text": "II"},
        {"label": "3", "text": "III"},
        {"label": "4", "text": "IV"},
        {"label": "5", "text": "V"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 2\nผู้ป่วยเพศชายอายุ 50 ปี มาด้วยอาการเสียวฟัน 26 เวลาทานน้ำหวาน เศษอาหารติด เป็นโรคความดันและเก๊าท์ ปฏิเสธภาวะแทรกซ้อนของโรคเก๊าท์ เวลาเดินจะมีปวดข้อ เลยเดินได้ไม่เหมือนปกติ ปัจจุบันกินยา amlopidine, allopurinol วันนี้วัดความดันได้ 145/65 และ pulse rate 85 ให้รูปเป็น 26 supraeruption, มี CF ClV, ไม่มีคู่สบ\n5. ควรให้ supplement fluoride อะไร",
      "choices": [
        {"label": "1", "text": "CPP-ACP"},
        {"label": "2", "text": "F varnish"},
        {"label": "3", "text": "Acidulated fluoride gel"},
        {"label": "4", "text": "ยาสีฟัน fluoride ธรรมดา"},
        {"label": "5", "text": "SDF"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 2\nผู้ป่วยเพศชายอายุ 50 ปี มาด้วยอาการเสียวฟัน 26 เวลาทานน้ำหวาน เศษอาหารติด เป็นโรคความดันและเก๊าท์ ปฏิเสธภาวะแทรกซ้อนของโรคเก๊าท์ เวลาเดินจะมีปวดข้อ เลยเดินได้ไม่เหมือนปกติ ปัจจุบันกินยา amlopidine, allopurinol วันนี้วัดความดันได้ 145/65 และ pulse rate 85 ให้รูปเป็น 26 supraeruption, มี CF ClV, ไม่มีคู่สบ\n6. จะใส่ implant 36 ควรทำอะไรกับ 26",
      "choices": [
        {"label": "1", "text": "No tx"},
        {"label": "2", "text": "Refilling CF Cl.V"},
        {"label": "3", "text": "Full crown"},
        {"label": "4", "text": "Three quarter crown"},
        {"label": "5", "text": "Enameloplasty"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 3\nให้รูป intraoral arch ล่างเด็กผุเยินๆมา\n7. เด็กในโรงเรียนกว่า 60% ปากสภาพเป็นแบบเด็กคนนี้ในรูป โรงเรียนจำเป็นต้องจัดกิจกรรมอะไรเร่งด่วน",
      "choices": [
        {"label": "1", "text": "แปรงฟันหลังอาหารกลางวัน"},
        {"label": "2", "text": "คุมการดื่มนมรสหวานในโรงเรียน"},
        {"label": "3", "text": "ทำให้ครูตระหนัก"},
        {"label": "4", "text": "ให้ความรู้พ่อแม่เกี่ยวกับการดูแลสุขภาพช่องปาก"},
        {"label": "5", "text": "เข้าถึงการบริการทางทันตกรรม"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 3\nให้รูป intraoral arch ล่างเด็กผุเยินๆมา\n8. indication เคลือบหลุมร่องฟัน",
      "choices": [
        {"label": "1", "text": "ICDAS 0-2"},
        {"label": "2", "text": "หลุมร่องฟันเขี่ยนิ่ม"},
        {"label": "3", "text": "หลุมร่องฟันต้องไม่ขาวขุ่น"},
        {"label": "4", "text": "ฟันงอกมาเกิน4ปี"},
        {"label": "5", "text": "ฟันงอกเต็มซี่"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 3\nให้รูป intraoral arch ล่างเด็กผุเยินๆมา\n9. Common risk approach คือทำอะไร",
      "choices": [
        {"label": "1", "text": "upstream intervention"},
        {"label": "2", "text": "downstream intervention"},
        {"label": "3", "text": "multi-disciplinary intervention"},
        {"label": "4", "text": "caries risk assessment"},
        {"label": "5", "text": "risk reduction"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 4\nผู้ป่วยหญิง 60 ปี มาตรวจสุขภาพช่องปาก ใส่ฟันเทียมบนถอดได้ชนิดฐานพลาสติกมา 5 ปี ทำความสะอาดด้วยน้ำเปล่า ใส่ตอนนอนเป็นบางครั้ง ตรวจพบในช่องปากตามภาพ มีรอยแดงตรงเพดาน แค่ด้านหน้า\n10. สาเหตุหลักของความผิดปกติในช่องปากคืออะไร",
      "choices": [
        {"label": "1", "text": "Improper denture cleaning method"},
        {"label": "2", "text": "Nocturnal denture wearing"},
        {"label": "3", "text": "Hyper spot of denture base"},
        {"label": "4", "text": "Allergy to acrylic denture"},
        {"label": "5", "text": "Ill-fitting denture"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 4\nผู้ป่วยหญิง 60 ปี มาตรวจสุขภาพช่องปาก ใส่ฟันเทียมบนถอดได้ชนิดฐานพลาสติกมา 5 ปี ทำความสะอาดด้วยน้ำเปล่า ใส่ตอนนอนเป็นบางครั้ง ตรวจพบในช่องปากตามภาพ มีรอยแดงตรงเพดาน แค่ด้านหน้า\n11. differential clinical diagnosis ที่เหมาะสม",
      "choices": [
        {"label": "1", "text": "Denture stomatitis, Erythroplakia"},
        {"label": "2", "text": "Denture stomatitis, Herpes zoster"},
        {"label": "3", "text": "Lupus erythematosus, Herpes zoster"},
        {"label": "4", "text": "Traumatic ulcer, Denture stomatitis"},
        {"label": "5", "text": "erytholeukoplakia, Lupus erythematosus"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 4\nผู้ป่วยหญิง 60 ปี มาตรวจสุขภาพช่องปาก ใส่ฟันเทียมบนถอดได้ชนิดฐานพลาสติกมา 5 ปี ทำความสะอาดด้วยน้ำเปล่า ใส่ตอนนอนเป็นบางครั้ง ตรวจพบในช่องปากตามภาพ มีรอยแดงตรงเพดาน แค่ด้านหน้า\n12. การรักษาด้วยยาที่เหมาะสม",
      "choices": [
        {"label": "1", "text": "0.1% fluocinolone acetonide + clotrimazole"},
        {"label": "2", "text": "0.1% triamcinolone acetonide oral paste"},
        {"label": "3", "text": "Amphotericin B"},
        {"label": "4", "text": "Miconazole gel"},
        {"label": "5", "text": "Nystatin oral suspension"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 5\nเด็ก 8 เดือน (ให้รูป มีแผลเป็น pseudomembrane ขาวๆ ที่ริมฝีปากล่างอยู่ตรงพอดิบพอดี ซี่ 71,81 ขึ้นแล้ว) ผู้ปกครองบอกว่าเป็นมา 1-2 สัปดาห์ มีอาการเจ็บ ทานอาหารได้น้อยลง\n13. วิธีการจัดการ",
      "choices": [
        {"label": "1", "text": "Incisional bx"},
        {"label": "2", "text": "Topical anesthetic agent"},
        {"label": "3", "text": "Topical antifungal agent"},
        {"label": "4", "text": "Topical antiviral agent"},
        {"label": "5", "text": "Topical antibiotic"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 5\nเด็ก 8 เดือน (ให้รูป มีแผลเป็น pseudomembrane ขาวๆ ที่ริมฝีปากล่างอยู่ตรงพอดิบพอดี ซี่ 71,81 ขึ้นแล้ว) ผู้ปกครองบอกว่าเป็นมา 1-2 สัปดาห์ มีอาการเจ็บ ทานอาหารได้น้อยลง\n14. สาเหตุ",
      "choices": [
        {"label": "1", "text": "Mechanical injury"},
        {"label": "2", "text": "Cell-mediated immune response"},
        {"label": "3", "text": "Viral infection"},
        {"label": "4", "text": "Fungal infection"},
        {"label": "5", "text": "Allergy"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 5\nเด็ก 8 เดือน (ให้รูป มีแผลเป็น pseudomembrane ขาวๆ ที่ริมฝีปากล่างอยู่ตรงพอดิบพอดี ซี่ 71,81 ขึ้นแล้ว) ผู้ปกครองบอกว่าเป็นมา 1-2 สัปดาห์ มีอาการเจ็บ ทานอาหารได้น้อยลง\n15. วิธีการตรวจที่เหมาะสม",
      "choices": [
        {"label": "1", "text": "Passive restrain using papoose"},
        {"label": "2", "text": "Passive restrain using papoose with mouth gag"},
        {"label": "3", "text": "Passive restrain using Pediwrap"},
        {"label": "4", "text": "Active restrain by parent"},
        {"label": "5", "text": "Active restrain by dental assistant"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 6\nผู้ประกาศข่าวเพศหญิงอายุ 55 ปี มาด้วยอุบัติเหตุ ฟัน RCT 21,22 หัก มี Crown : Root = 1 : 1.5 MAF 40,35 ตามลำดับ กิน bisphosphonate มา 4 ปี\n16. จะใส่ TP ระหว่างรอการรักษา เพื่อความสวยงามและบดเคี้ยว เรียงฟันอย่างไร 11 torsi แบบหมุน m 45° มาทางด้านลิ้น",
      "choices": [
        {"label": "1", "text": "เรียง 21 ตาม 11, 22 ตาม 12"},
        {"label": "2", "text": "เรียง 21 ตาม 11, 22 ตาม 23"},
        {"label": "3", "text": "เรียง 22 ตาม 23, 21 ตาม 22"},
        {"label": "4", "text": "ลากจาก canine-canine เรียง 21,22 ตามความห่างจากจากเส้นสมมติเท่ากับ 11,12"},
        {"label": "5", "text": "เรียง overjet, overbite 21,22 ตาม 11,12 ที่สบ 31,32"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 6\nผู้ประกาศข่าวเพศหญิงอายุ 55 ปี มาด้วยอุบัติเหตุ ฟัน RCT 21,22 หัก มี Crown : Root = 1 : 1.5 MAF 40,35 ตามลำดับ กิน bisphosphonate มา 4 ปี\n17. remove gutta percha เดิมอย่างไร",
      "choices": [
        {"label": "1", "text": "gate glidden drill"},
        {"label": "2", "text": "peeso drill"},
        {"label": "3", "text": "ultrasonic file"},
        {"label": "4", "text": "H-file + solvent gutta percha"},
        {"label": "5", "text": "K-file + heat carrier"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 6\nผู้ประกาศข่าวเพศหญิงอายุ 55 ปี มาด้วยอุบัติเหตุ ฟัน RCT 21,22 หัก มี Crown : Root = 1 : 1.5 MAF 40,35 ตามลำดับ กิน bisphosphonate มา 4 ปี\n18. รักษา 21,22 อย่างไร",
      "choices": [
        {"label": "1", "text": "retreat RCT + orthodontic extrusion 21,22 + p/c/c 21,22"},
        {"label": "2", "text": "retreat RCT + crown lengthening 21+ p/c/c 21,22"},
        {"label": "3", "text": "retreat RCT + crown lengthening 21,22 + p/c/c 21,22"},
        {"label": "4", "text": "retreat RCT + p/c/c 21,22"},
        {"label": "5", "text": "extraction + implant"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 7\nหญิง 40 ปี ต้องการทำครอบฟันหลังล่าง เนื่องจากวัสดุอุดหลุด ประวัติทำการรักษามา 1 ปี ตรวจ ซี่ 45 exposed gutta percha, -ve to percussion and palpation (x-ray เห็น 45 แตก D ลงมาถึงเกือบขอบ bone 46 rct มาแล้ว อุด amalgam OM)\n19. ลำดับก่อนการรื้อ 45 ที่ถูกต้อง",
      "choices": [
        {"label": "1", "text": "ใส่ rubber dam เลย -> รื้อ gutta percha"},
        {"label": "2", "text": "ทำ composite wall -> ใส่ rubber dam"},
        {"label": "3", "text": "กรอ crown ที่เหลือออก ->ใส่ rubber dam"},
        {"label": "4", "text": "ortho band -> อุด composite"},
        {"label": "5", "text": "ทำ temporary crown"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 7\nหญิง 40 ปี ต้องการทำครอบฟันหลังล่าง เนื่องจากวัสดุอุดหลุด ประวัติทำการรักษามา 1 ปี ตรวจ ซี่ 45 exposed gutta percha, -ve to percussion and palpation (x-ray เห็น 45 แตก D ลงมาถึงเกือบขอบ bone 46 rct มาแล้ว อุด amalgam OM)\n20. ซี่ 46 รักษารากมาแล้ว 1 เดือน ไม่มีอาการ AFสภาพดี MB cusp แตก (x-ray เห็น 46OM AF+AF core, D canal อุดเต็มดี, M canal เห็น Gutta percha สวยดี 3 mm เหนือ apex ข้างล่างมีเส้นขาวบางๆ) จะทำอะไร",
      "choices": [
        {"label": "1", "text": "Permanent crown"},
        {"label": "2", "text": "ทำ metal Onlay"},
        {"label": "3", "text": "ทำTemporary crown"},
        {"label": "4", "text": "รื้อ amalgam เปลี่ยนเป็น composite"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 7\nหญิง 40 ปี ต้องการทำครอบฟันหลังล่าง เนื่องจากวัสดุอุดหลุด ประวัติทำการรักษามา 1 ปี ตรวจ ซี่ 45 exposed gutta percha, -ve to percussion and palpation (x-ray เห็น 45 แตก D ลงมาถึงเกือบขอบ bone 46 rct มาแล้ว อุด amalgam OM)\n21. ใช้วัสดุอะไร bite เมื่อฟันบนมีครบทุกซี่",
      "choices": [
        {"label": "1", "text": "Vinyl polyether silicone"},
        {"label": "2", "text": "Aluwax"},
        {"label": "3", "text": "Bite registration wax"},
        {"label": "4", "text": "Zinc oxide eugenol"},
        {"label": "5", "text": "Stone type III"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 8\nเด็ก 5 ปี เคยปวดฟันหลังล่างซ้ายตอนกลางคืน เมื่อ 6 เดือนที่ผ่านมา ให้ภาพ clinic ; - ซี่ 74,75 ผุใหญ่ 74 ไม่โยก แต่ 75 โยก 2 degree - ซี่ 36 ไม่ขึ้น ให้ PA 74,75 ; - ซี่ 75 mesial root ละลายจนทะลุ pulp มี lesion ที่ furcation - ซี่ 74 ผุ OD เหลือ dentin band ชัดเจน ไม่ expose pulp มี widening pdl ที่ distal root ไม่มี lesion ตรง furcation\n22. จะถอน 75 ฉีดยาชายังไง",
      "choices": [
        {"label": "1", "text": "IANB"},
        {"label": "2", "text": "IANB + buccal infiltrate"},
        {"label": "3", "text": "supraperiosteal"},
        {"label": "4", "text": "buccal&lingual infiltrate"},
        {"label": "5", "text": "mental nerve block"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 8\nเด็ก 5 ปี เคยปวดฟันหลังล่างซ้ายตอนกลางคืน เมื่อ 6 เดือนที่ผ่านมา ให้ภาพ clinic ; - ซี่ 74,75 ผุใหญ่ 74 ไม่โยก แต่ 75 โยก 2 degree - ซี่ 36 ไม่ขึ้น ให้ PA 74,75 ; - ซี่ 75 mesial root ละลายจนทะลุ pulp มี lesion ที่ furcation - ซี่ 74 ผุ OD เหลือ dentin band ชัดเจน ไม่ expose pulp มี widening pdl ที่ distal root ไม่มี lesion ตรง furcation\n23. การรักษาที่เหมาะสมของซี่ 74 (ในฟิล์มที่ให้มาจะมี furcation involvement และ non intact lamina dura ด้วย)",
      "choices": [
        {"label": "1", "text": "pulpotomy"},
        {"label": "2", "text": "Pulpectomy"},
        {"label": "3", "text": "Direct pulp capping"},
        {"label": "4", "text": "Indirect pulp capping"},
        {"label": "5", "text": "protective liner"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 8\nเด็ก 5 ปี เคยปวดฟันหลังล่างซ้ายตอนกลางคืน เมื่อ 6 เดือนที่ผ่านมา ให้ภาพ clinic ; - ซี่ 74,75 ผุใหญ่ 74 ไม่โยก แต่ 75 โยก 2 degree - ซี่ 36 ไม่ขึ้น ให้ PA 74,75 ; - ซี่ 75 mesial root ละลายจนทะลุ pulp มี lesion ที่ furcation - ซี่ 74 ผุ OD เหลือ dentin band ชัดเจน ไม่ expose pulp มี widening pdl ที่ distal root ไม่มี lesion ตรง furcation\n24. เลือก space maintainer หลังถอน 75",
      "choices": [
        {"label": "1", "text": "Distal shoe"},
        {"label": "2", "text": "Band and loop"},
        {"label": "3", "text": "Nance holding arch"},
        {"label": "4", "text": "Reverse band and loop"},
        {"label": "5", "text": "Lingual holding arch"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 9\nผู้ป่วยชาย 30 ปี มาด้วยมีรอยขาวขุ่นขูดออกได้บริเวณคอหอยและลิ้น ไม่มีอาการปวดใดๆ ให้ประวัติไม่มีโรคประจำตัว ไม่แพ้ยา แต่ไม่เคยตรวจสุขภาพ\n25. การส่งแลปเพิ่มเติมเพื่อรักษาผู้ป่วยรายนี้",
      "choices": [
        {"label": "1", "text": "FBS"},
        {"label": "2", "text": "HIV"},
        {"label": "3", "text": "FBS+HIV"},
        {"label": "4", "text": "Bun creatinine"},
        {"label": "5", "text": "CBC"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 9\nผู้ป่วยชาย 30 ปี มาด้วยมีรอยขาวขุ่นขูดออกได้บริเวณคอหอยและลิ้น ไม่มีอาการปวดใดๆ ให้ประวัติไม่มีโรคประจำตัว ไม่แพ้ยา แต่ไม่เคยตรวจสุขภาพ\n26. การวินิจฉัยโรคที่เป็นไปได้",
      "choices": [
        {"label": "1", "text": "Pseudomembranous candidiasis"},
        {"label": "2", "text": "Chronic hyperplastic candidiasis"},
        {"label": "3", "text": "Coated tongue"},
        {"label": "4", "text": "Chemical burn"},
        {"label": "5", "text": "white sponge nevus"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 9\nผู้ป่วยชาย 30 ปี มาด้วยมีรอยขาวขุ่นขูดออกได้บริเวณคอหอยและลิ้น ไม่มีอาการปวดใดๆ ให้ประวัติไม่มีโรคประจำตัว ไม่แพ้ยา แต่ไม่เคยตรวจสุขภาพ\n27. การตรวจเพิ่มเติม",
      "choices": [
        {"label": "1", "text": "Diascopy"},
        {"label": "2", "text": "autofluorescence test"},
        {"label": "3", "text": "Skin patch test"},
        {"label": "4", "text": "toluidine blue stain"},
        {"label": "5", "text": "periodic acid schiff"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 10\nเด็ก 13 ปี ซี่ 75,85 มี 3 mobility กิน phenytoin มา 2 ปี ให้รูป Pano มา ฟันซี่ 75,85 รากละลายเหลือแต่ตัวฟัน มีหน่อฟันแท้ซี่ 35,45 ด้านใต้ ซึ่งไม่มีใครรู้เลยว่ามันจะสื่ออะไรของมัน 555555 แต่เหมือน tooth มัน delayed eruption หน่อยๆ 33 รากรู้สึกยาวจะถึงขอบล่าง mandible เลย ซี่อื่นๆก็ยังขึ้นกันไม่ได้เป็น permanent อ่ะ แบบพวกซี่ 3 ซี่ 5 ไรงี้ แล้วซี่ 7 บนดูเหมือนกำลัง form มั้ง\n28. ผู้ปกครอง ควรระวังอะไรในการดูแล",
      "choices": [
        {"label": "1", "text": "ถั่วปากอ้า"},
        {"label": "2", "text": "การติดเชื้อฉวยโอกาส"},
        {"label": "3", "text": "ภยันตรายต่อฟันและอวัยวะรอบฟัน"},
        {"label": "4", "text": "บวมจากจ้ำเลือด"},
        {"label": "5", "text": "ห้ามเลือดในปาก"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 10\nเด็ก 13 ปี ซี่ 75,85 มี 3 mobility กิน phenytoin มา 2 ปี ให้รูป Pano มา ฟันซี่ 75,85 รากละลายเหลือแต่ตัวฟัน มีหน่อฟันแท้ซี่ 35,45 ด้านใต้ ซึ่งไม่มีใครรู้เลยว่ามันจะสื่ออะไรของมัน 555555 แต่เหมือน tooth มัน delayed eruption หน่อยๆ 33 รากรู้สึกยาวจะถึงขอบล่าง mandible เลย ซี่อื่นๆก็ยังขึ้นกันไม่ได้เป็น permanent อ่ะ แบบพวกซี่ 3 ซี่ 5 ไรงี้ แล้วซี่ 7 บนดูเหมือนกำลัง form มั้ง\n29. การเตรียมผู้ป่วยก่อนการถอนฟัน",
      "choices": [
        {"label": "1", "text": "Abx prophylaxis"},
        {"label": "2", "text": "CBC"},
        {"label": "3", "text": "INR"},
        {"label": "4", "text": "liver function test"},
        {"label": "5", "text": "กิน phenytoin ปกติ"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 10\nเด็ก 13 ปี ซี่ 75,85 มี 3 mobility กิน phenytoin มา 2 ปี ให้รูป Pano มา ฟันซี่ 75,85 รากละลายเหลือแต่ตัวฟัน มีหน่อฟันแท้ซี่ 35,45 ด้านใต้ ซึ่งไม่มีใครรู้เลยว่ามันจะสื่ออะไรของมัน 555555 แต่เหมือน tooth มัน delayed eruption หน่อยๆ 33 รากรู้สึกยาวจะถึงขอบล่าง mandible เลย ซี่อื่นๆก็ยังขึ้นกันไม่ได้เป็น permanent อ่ะ แบบพวกซี่ 3 ซี่ 5 ไรงี้ แล้วซี่ 7 บนดูเหมือนกำลัง form มั้ง\n30. ป้องกัน adverse effect ยา ได้อย่างไร",
      "choices": [
        {"label": "1", "text": "plaque control"},
        {"label": "2", "text": "diet counselling"},
        {"label": "3", "text": "fluoride tablet"},
        {"label": "4", "text": "artificial saliva"},
        {"label": "5", "text": "pit and fissure sealant"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 11\nหญิง 50 แสบร้อนเหงือกกรามบนซ้ายเวลาทานของเผ็ด เป็นมา 3 เดือน ไม่มีโรคประจำตัว แพ้ยา แพ้อาหาร รูปกัดฟัน มีรอยโรคขาวแดงที่เหงือกฟันกรามบน และมี gingival recession ทั่วไป\n31. หลังรักษาแล้วแนะนำวิธีการแปรงฟันอะไร",
      "choices": [
        {"label": "1", "text": "Stillman"},
        {"label": "2", "text": "Fone’s"},
        {"label": "3", "text": "Bass"},
        {"label": "4", "text": "Horizontal scrub"},
        {"label": "5", "text": "Charter"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 11\nหญิง 50 แสบร้อนเหงือกกรามบนซ้ายเวลาทานของเผ็ด เป็นมา 3 เดือน ไม่มีโรคประจำตัว แพ้ยา แพ้อาหาร รูปกัดฟัน มีรอยโรคขาวแดงที่เหงือกฟันกรามบน และมี gingival recession ทั่วไป\n32. ใช้อะไรในการตรวจจินิจฉัย",
      "choices": [
        {"label": "1", "text": "Incisional biopsy"},
        {"label": "2", "text": "Excisional biopsy"},
        {"label": "3", "text": "Swab"},
        {"label": "4", "text": "Brush"},
        {"label": "5", "text": "Diascopy"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 11\nหญิง 50 แสบร้อนเหงือกกรามบนซ้ายเวลาทานของเผ็ด เป็นมา 3 เดือน ไม่มีโรคประจำตัว แพ้ยา แพ้อาหาร รูปกัดฟัน มีรอยโรคขาวแดงที่เหงือกฟันกรามบน และมี gingival recession ทั่วไป\n33. วินิจฉัยโรค",
      "choices": [
        {"label": "1", "text": "SCC"},
        {"label": "2", "text": "Oral lichen planus"},
        {"label": "3", "text": "Traumatic ulcer"},
        {"label": "4", "text": "leukoplakia"},
        {"label": "5", "text": "candidiasis"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 12\nผู้บัญชาการเรือนจำทำหนังสือถึงสาธารณสุขจังหวัด ให้มาช่วยพัฒนาสุขภาพช่องปากนักโทษในเรือนจำ 5000 คน ไม่เคยมีการเข้าถึงทันตกรรมบริการหรือการให้ความรู้ใดๆทั้งนั้น\n34. ข้อใดคือมิติคุณภาพชีวิต",
      "choices": [
        {"label": "1", "text": "ปวดฟันจนเครียด"},
        {"label": "2", "text": "เป็นโรคปริทันต์กันเยอะ"},
        {"label": "3", "text": "ขนแปรงในเรือนจำแข็งมาก"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 12\nผู้บัญชาการเรือนจำทำหนังสือถึงสาธารณสุขจังหวัด ให้มาช่วยพัฒนาสุขภาพช่องปากนักโทษในเรือนจำ 5000 คน ไม่เคยมีการเข้าถึงทันตกรรมบริการหรือการให้ความรู้ใดๆทั้งนั้น\n35. Ottawa charter ข้อใดมีอิทธิพลสุดในการลดพฤติกรรมการบริโภคน้ำตาลในเรือนจำ",
      "choices": [
        {"label": "1", "text": "Build health public policy"},
        {"label": "2", "text": "Create supportive environment"},
        {"label": "3", "text": "Strengthen community action"},
        {"label": "4", "text": "Develop personal skills"},
        {"label": "5", "text": "Reoriented health service"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 12\nผู้บัญชาการเรือนจำทำหนังสือถึงสาธารณสุขจังหวัด ให้มาช่วยพัฒนาสุขภาพช่องปากนักโทษในเรือนจำ 5000 คน ไม่เคยมีการเข้าถึงทันตกรรมบริการหรือการให้ความรู้ใดๆทั้งนั้น\n36. ถ้าจะใช้ขั้นตอน Reorient health service ต้องทำอย่างไรในเรือนจำ",
      "choices": [
        {"label": "1", "text": "ให้นักโทษออกมาทำฟันที่รพข้างนอก"},
        {"label": "2", "text": "สาธิตการทำอาหารลดหวาน"},
        {"label": "3", "text": "ปรับระบบให้เหมาะสมกับข้อจำกัดเรือนจำ"},
        {"label": "4", "text": "แจกแปรงสีฟัน"},
        {"label": "5", "text": "ออกหน่วยทันตกรรมตามคำร้องขอ"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 13\nเด็ก 9 ปี เป็น skeletal class II with deep bite malocclusion จากรูปเห็น arch บน narrow + labial attached gingiva ทั้งปากแดง ดูแห้งๆ\n37. ผลข้างเคียงที่เกิดได้มากสุด",
      "choices": [
        {"label": "1", "text": "tooth injuries"},
        {"label": "2", "text": "food impaction"},
        {"label": "3", "text": "early loss of primary tooth"},
        {"label": "4", "text": "abfraction"},
        {"label": "5", "text": "Bruxism"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมจัดฟัน",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 13\nเด็ก 9 ปี เป็น skeletal class II with deep bite malocclusion จากรูปเห็น arch บน narrow + labial attached gingiva ทั้งปากแดง ดูแห้งๆ\n38. ลักษณะของ labial attached gingiva เป็นผลจากอะไร",
      "choices": [
        {"label": "1", "text": "Lip biting"},
        {"label": "2", "text": "Macrogrossia"},
        {"label": "3", "text": "Digit sucking"},
        {"label": "4", "text": "Mouth breathing"},
        {"label": "5", "text": "Tongue thrusting"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมจัดฟัน",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 13\nเด็ก 9 ปี เป็น skeletal class II with deep bite malocclusion จากรูปเห็น arch บน narrow + labial attached gingiva ทั้งปากแดง ดูแห้งๆ\n39. แก้ไขด้วยเครื่องมืออะไร",
      "choices": [
        {"label": "1", "text": "activator"},
        {"label": "2", "text": "special pacifier"},
        {"label": "3", "text": "protraction facemask"},
        {"label": "4", "text": "chin cup"},
        {"label": "5", "text": "Posterior bite plane"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมจัดฟัน",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 14\nผู้ป่วยชายอายุ 20 ปี เปลือกตาซ้ายปิดไม่สนิท น้ำตาจะไหลไม่หยุดมา 2 สัปดาห์\n40. กล้ามเนื้ออะไรที่น่าจะผิดปกติ",
      "choices": [
        {"label": "1", "text": "orbicularis oculi"},
        {"label": "2", "text": "superior oblique"},
        {"label": "3", "text": "inferior oblique"},
        {"label": "4", "text": "levator labii superioris alaeque nasi"},
        {"label": "5", "text": "lateral rectus"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 14\nผู้ป่วยชายอายุ 20 ปี เปลือกตาซ้ายปิดไม่สนิท น้ำตาจะไหลไม่หยุดมา 2 สัปดาห์\n41. ตรวจอะไรเพิ่มเติม",
      "choices": [
        {"label": "1", "text": "การได้ยิน"},
        {"label": "2", "text": "การยกมุมปาก"},
        {"label": "3", "text": "การรับความรู้สึกใบหน้า"},
        {"label": "4", "text": "การรับรส"},
        {"label": "5", "text": "การอ้าปากหุบปาก"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 14\nผู้ป่วยชายอายุ 20 ปี เปลือกตาซ้ายปิดไม่สนิท น้ำตาจะไหลไม่หยุดมา 2 สัปดาห์\n42. รักษาอย่างไร",
      "choices": [
        {"label": "1", "text": "steroid"},
        {"label": "2", "text": "anticonvulsant"},
        {"label": "3", "text": "antibiotic"},
        {"label": "4", "text": "antiviral"},
        {"label": "5", "text": "NSAIDs"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 15\nหญิง 40 ปี ถูกส่งต่อมาเพื่อรักษารากฟันซี่ 17 ดูในช่องปากพบฟันซี่ 17 มีครอบฟันอะคริลิกสภาพไม่ดี เคาะเจ็บ คลำไม่เจ็บ ให้ภาพรังสี 17Pa (ฟันซี่ 17 หน้าตาเหมือน prep crown มาแล้ว และพบวัสดุอุดใหญ่เข้าไปใน pulp chamber)\n43. ให้ Diag ซี่ 17",
      "choices": [
        {"label": "1", "text": "Previously initiated therapy with symptomatic apical periodontitis"},
        {"label": "2", "text": "Previously initiated therapy with asymptomatic apical periodontitis"},
        {"label": "3", "text": "Previously initiated therapy with acute apical abscess"},
        {"label": "4", "text": "Previously treated with symptomatic apical periodontitis"},
        {"label": "5", "text": "Previously treated with acute apical abscess"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 15\nหญิง 40 ปี ถูกส่งต่อมาเพื่อรักษารากฟันซี่ 17 ดูในช่องปากพบฟันซี่ 17 มีครอบฟันอะคริลิกสภาพไม่ดี เคาะเจ็บ คลำไม่เจ็บ ให้ภาพรังสี 17Pa (ฟันซี่ 17 หน้าตาเหมือน prep crown มาแล้ว และพบวัสดุอุดใหญ่เข้าไปใน pulp chamber)\n44. ระหว่างการรักษารากฟัน ในขั้นตอนการหาความยาวคลองรากฟัน ได้ถ่าย X-ray distal shift tube ถามว่าที่ลูกศรชี้คือคลองรากใด",
      "choices": [
        {"label": "1", "text": "Mesiobuccal canal"},
        {"label": "2", "text": "Distobuccal canal"},
        {"label": "3", "text": "Mesiolingual canal"},
        {"label": "4", "text": "Distolingual canal"},
        {"label": "5", "text": "Palatal canal"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 15\nหญิง 40 ปี ถูกส่งต่อมาเพื่อรักษารากฟันซี่ 17 ดูในช่องปากพบฟันซี่ 17 มีครอบฟันอะคริลิกสภาพไม่ดี เคาะเจ็บ คลำไม่เจ็บ ให้ภาพรังสี 17Pa (ฟันซี่ 17 หน้าตาเหมือน prep crown มาแล้ว และพบวัสดุอุดใหญ่เข้าไปใน pulp chamber)\n45. ฟันซี่ 17 มีเนื้อฟันบริเวณคอฟันหนา 3 mm และมีเนื้อฟันสูง 2/3 ของ clinical crown ถามว่าควรบูรณะอย่างไรหลังจากรักษาคลองรากฟัน",
      "choices": [
        {"label": "1", "text": "cast metal post and crown"},
        {"label": "2", "text": "prefabricated post and crown"},
        {"label": "3", "text": "core build up with resin composite and crown"},
        {"label": "4", "text": "composite onlay"},
        {"label": "5", "text": "metal inlay"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 16\nชาย 40 ปี มาด้วยอาการปวดฟันด้านขวามา 3 วัน เคยผ่าตัดลิ้นหัวใจเทียมเมื่อปีที่แล้ว และแพ้ยา penicillin โดยจะมีผื่นขึ้นทันทีตามแขนขาลำคอ - ให้รูป OP (crop มาแค่ post Q4) มาเป็น 48 mesioangular impaction class I position A ผุใหญ่มาก และดัน 47D ผุ ราก 48 งอไปทาง distal และใกล้ IAC\n46. การเตรียมผู้ป่วยก่อนผ่าฟันคุดซี่ 48",
      "choices": [
        {"label": "1", "text": "no antibiotic prophylaxis"},
        {"label": "2", "text": "จ่าย paracetamol 500mg 1 tab กับ erythromycin 500mg 1 cap pre-op. 30 min"},
        {"label": "3", "text": "จ่าย augmentin 500mg 1 tab pre-op. 30 min"},
        {"label": "4", "text": "จ่าย azithromycin 500 mg 1 cap pre-op. 30 min"},
        {"label": "5", "text": "จ่าย cephalosporin 500 mg 2 caps pre-op. 30 min"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 16\nชาย 40 ปี มาด้วยอาการปวดฟันด้านขวามา 3 วัน เคยผ่าตัดลิ้นหัวใจเทียมเมื่อปีที่แล้ว และแพ้ยา penicillin โดยจะมีผื่นขึ้นทันทีตามแขนขาลำคอ - ให้รูป OP (crop มาแค่ post Q4) มาเป็น 48 mesioangular impaction class I position A ผุใหญ่มาก และดัน 47D ผุ ราก 48 งอไปทาง distal และใกล้ IAC\n47. การแพ้ยาของผู้ป่วยเป็นแบบไหน",
      "choices": [
        {"label": "1", "text": "Type I hypersensitivity"},
        {"label": "2", "text": "Type II hypersensitivity"},
        {"label": "3", "text": "Type III hypersensitivity"},
        {"label": "4", "text": "Type IV hypersensitivity"},
        {"label": "5", "text": "Type V hypersensitivity"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 16\nชาย 40 ปี มาด้วยอาการปวดฟันด้านขวามา 3 วัน เคยผ่าตัดลิ้นหัวใจเทียมเมื่อปีที่แล้ว และแพ้ยา penicillin โดยจะมีผื่นขึ้นทันทีตามแขนขาลำคอ - ให้รูป OP (crop มาแค่ post Q4) มาเป็น 48 mesioangular impaction class I position A ผุใหญ่มาก และดัน 47D ผุ ราก 48 งอไปทาง distal และใกล้ IAC\n48. หลังแผลหายดีแล้ว ผู้ป่วยยังมีอาการเจ็บแปล๊บเหมือนไฟฟ้าช๊อตที่ใบหน้าด้านขวาเมื่อเอามือไปลูบ ควรทำอะไร",
      "choices": [
        {"label": "1", "text": "Cold compression + tramadol"},
        {"label": "2", "text": "Warm compression + Vit B complex"},
        {"label": "3", "text": "NSAIDs"},
        {"label": "4", "text": "Carpamazepine"},
        {"label": "5", "text": "Vit B 1-6-12"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 17\nผญ 60 ปี มีก้อนเนื้อมา 1 เดือน ปวดนิดหน่อย เป็นก้อนเนื้อขาวๆเหลืองๆใหญ่ๆ สองจุด (ด้าน La Q1 และกลาง palate ก้อนมหึมา) คนไข้กินยา warfarin, simvastatin, Atenolol (ไปหารูปมาให้ คล้ายแบบนี้มากนะเออ แต่อันนี้มันใหญ่กว่าอ่ะ แล้วก็ในข้อสอบคือ lesion มันแยกกันของ Labial กับ Palate แต่อันนี้มันดูแบบเชื่อมกันแล้ว แต่ลักษณะสีเอย อะไรเอย ก็คือประมาณนี้เลย ตรง palate ก็ลักษณะแบบนี้คือกัน)\n49. ระหว่างถอนซี่ 27 28 ภายใต้การฉีดยาชาเฉพาะที่ คนไข้มีความกังวลมาก คนไข้ใจสั่น มือซีด เหงื่อออก และหมดสติ คนไข้เป็นไร",
      "choices": [
        {"label": "1", "text": "Vasovagal syncope"},
        {"label": "2", "text": "Hypoglycemia"},
        {"label": "3", "text": "Anxiety-induced hyperventilation"},
        {"label": "4", "text": "Anaphylaxis"},
        {"label": "5", "text": "Hypertensive urgency"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 17\nผญ 60 ปี มีก้อนเนื้อมา 1 เดือน ปวดนิดหน่อย เป็นก้อนเนื้อขาวๆเหลืองๆใหญ่ๆ สองจุด (ด้าน La Q1 และกลาง palate ก้อนมหึมา) คนไข้กินยา warfarin, simvastatin, Atenolol (ไปหารูปมาให้ คล้ายแบบนี้มากนะเออ แต่อันนี้มันใหญ่กว่าอ่ะ แล้วก็ในข้อสอบคือ lesion มันแยกกันของ Labial กับ Palate แต่อันนี้มันดูแบบเชื่อมกันแล้ว แต่ลักษณะสีเอย อะไรเอย ก็คือประมาณนี้เลย ตรง palate ก็ลักษณะแบบนี้คือกัน)\n50. ต้องส่งตรวจอะไร",
      "choices": [
        {"label": "1", "text": "PT, INR"},
        {"label": "2", "text": "pTT"},
        {"label": "3", "text": "TT"},
        {"label": "4", "text": "platelet"},
        {"label": "5", "text": "fibrinogen level"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 17\nผญ 60 ปี มีก้อนเนื้อมา 1 เดือน ปวดนิดหน่อย เป็นก้อนเนื้อขาวๆเหลืองๆใหญ่ๆ สองจุด (ด้าน La Q1 และกลาง palate ก้อนมหึมา) คนไข้กินยา warfarin, simvastatin, Atenolol (ไปหารูปมาให้ คล้ายแบบนี้มากนะเออ แต่อันนี้มันใหญ่กว่าอ่ะ แล้วก็ในข้อสอบคือ lesion มันแยกกันของ Labial กับ Palate แต่อันนี้มันดูแบบเชื่อมกันแล้ว แต่ลักษณะสีเอย อะไรเอย ก็คือประมาณนี้เลย ตรง palate ก็ลักษณะแบบนี้คือกัน)\n51. โรค palate เป็นไร",
      "choices": [
        {"label": "1", "text": "SCC"},
        {"label": "2", "text": "Nicotinic stomatitis"},
        {"label": "3", "text": "Pseudomembranous candidiasis"},
        {"label": "4", "text": "Salivary gland tumor"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 18\nเด็ก 5 ปี Down syndrome มี Tetralogy of Fallot น้ำหนัก 13 kg แพ้ยา penicillin\n52. ถ้าจะถอนฟัน 75 85 ให้ยา prophylaxis",
      "choices": [
        {"label": "1", "text": "Azithromycin 200mg/5ml, 5ml"},
        {"label": "2", "text": "Azithromycin 200mg/5ml, 10ml"},
        {"label": "3", "text": "Augmentin 125 mg/5ml -20 ml"},
        {"label": "4", "text": "Augmentin 250 mg/5ml -13 ml"},
        {"label": "5", "text": "ไม่ต้องให้ยา"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 18\nเด็ก 5 ปี Down syndrome มี Tetralogy of Fallot น้ำหนัก 13 kg แพ้ยา penicillin\n53. จะให้ F ไงถึงเหมาะสม",
      "choices": [
        {"label": "1", "text": "F Toothpaste 1000ppm"},
        {"label": "2", "text": "SDF 28% (เลขนี้จริงๆ)"},
        {"label": "3", "text": "0.05% NaF MW daily"},
        {"label": "4", "text": "1.2% apf mouthwash"},
        {"label": "5", "text": "ฟลูออไรด์เสริม 0.55 mg"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 18\nเด็ก 5 ปี Down syndrome มี Tetralogy of Fallot น้ำหนัก 13 kg แพ้ยา penicillin\n54. ระวังภาวะ",
      "choices": [
        {"label": "1", "text": "dry socket"},
        {"label": "2", "text": "hematoma"},
        {"label": "3", "text": "delay wound healing"},
        {"label": "4", "text": "Infective endocarditis"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 19\nให้รูป histo เป็นรอยโรคปลายรากมามี cholesterol slit รูปทางคลีนิกเป็น ฟันหน้าบนมีรอยขาวขุ่น xray 11,21 rct มาแล้ว อุด cf ปลายราก 21 มีรอยโรคปลากราก โยก1degree +ve percussion +ve palpation vestibule 21-22 บวม กดนิ่ม histo เป็น radicular cyst\n55. วิธีที่ conventional ที่สุดในการรักษา รอยโรคขาวขุนที่ฟันหน้าคือ",
      "choices": [
        {"label": "1", "text": "Microabrasion"},
        {"label": "2", "text": "Resin infiltration"},
        {"label": "3", "text": "Veneer"},
        {"label": "4", "text": "NaF mw"},
        {"label": "5", "text": "Crown"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 19\nให้รูป histo เป็นรอยโรคปลายรากมามี cholesterol slit รูปทางคลีนิกเป็น ฟันหน้าบนมีรอยขาวขุ่น xray 11,21 rct มาแล้ว อุด cf ปลายราก 21 มีรอยโรคปลากราก โยก1degree +ve percussion +ve palpation vestibule 21-22 บวม กดนิ่ม histo เป็น radicular cyst\n56. รอยโรคนี้เจริญมาจากอะไร",
      "choices": [
        {"label": "1", "text": "epithelial rest of malassez"},
        {"label": "2", "text": "hertwig root sheath"},
        {"label": "3", "text": "inner enamel"},
        {"label": "4", "text": "outer enamel"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 19\nให้รูป histo เป็นรอยโรคปลายรากมามี cholesterol slit รูปทางคลีนิกเป็น ฟันหน้าบนมีรอยขาวขุ่น xray 11,21 rct มาแล้ว อุด cf ปลายราก 21 มีรอยโรคปลากราก โยก1degree +ve percussion +ve palpation vestibule 21-22 บวม กดนิ่ม histo เป็น radicular cyst\n57. แผนการรักษาซี่ 21",
      "choices": [
        {"label": "1", "text": "retreat endo"},
        {"label": "2", "text": "apical curettage + apicoectomy + retrograde filling"},
        {"label": "3", "text": "observe"},
        {"label": "4", "text": "Antibiotics"},
        {"label": "5", "text": "Intentional replantation"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 20\nผู้หญิง อายุ 60 ปีใส่ APD บนเหลือฟันในปากซี่ 16 17 26 27 วันนี้มาถอนฟันที่เหลือ แล้วเติมฟันบน APD ให้กลายเป็นฟันเทียมทั้งปากชั่วคราว\n58. คนไข้มาถอนฟันเพื่อทำฟันปลอมใหม่ หลังถอน 1 วัน เลือดไหลไม่หยุดจะทำอะไรเป็นอย่างแรก",
      "choices": [
        {"label": "1", "text": "Warm compression"},
        {"label": "2", "text": "Cold compression"},
        {"label": "3", "text": "Gauze compression"},
        {"label": "4", "text": "Suture"},
        {"label": "5", "text": "tranaxemic acid mouth rinse"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 20\nผู้หญิง อายุ 60 ปีใส่ APD บนเหลือฟันในปากซี่ 16 17 26 27 วันนี้มาถอนฟันที่เหลือ แล้วเติมฟันบน APD ให้กลายเป็นฟันเทียมทั้งปากชั่วคราว\n59. ถอนฟันและเติมฟันในapdเดิมเรียบร้อยให้คนไข้ใส่ ต้องทำยังไงต่อ",
      "choices": [
        {"label": "1", "text": "นัดrecall6เดือน เนื่องจากคนไข้ต้องลองใส่ฟันเทียมให้ชิน"},
        {"label": "2", "text": "ใส่ฟันเทียมตลอดเวลา และกลับมาพบทันตแพทย์ ในอีก 24ชม"},
        {"label": "3", "text": "ใส่ตลอดเวลา 1 สัปดาห์ และกลับมาrelineฐานฟันเทียม"},
        {"label": "4", "text": "รอแผลถอนฟันหาย 1 สัปดาห์ กลับมาทำฟันเทียมชุดใหม่"},
        {"label": "5", "text": "ใส่ฟันเทียมเฉพาะตอนกินอาหาร กลับมาหาทันตแพทย์ในอีก 24ชม"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 20\nผู้หญิง อายุ 60 ปีใส่ APD บนเหลือฟันในปากซี่ 16 17 26 27 วันนี้มาถอนฟันที่เหลือ แล้วเติมฟันบน APD ให้กลายเป็นฟันเทียมทั้งปากชั่วคราว\n60. ผู้ป่วยบอกว่าใส่ฟันเทียมที่เติมฟันแล้วรู้สึกอยากอาเจียน ควรจัดการอย่างไร",
      "choices": [
        {"label": "1", "text": "ให้ผู้ป่วยติดตามอาการ เพราะเป็นฟันเทียมช่วงคราว"},
        {"label": "2", "text": "เติมฐานฟันเทียมให้กระชับด้วยวัสดุเสริมฐาน เพราะเหงือกหดตัวหลังจากถอนฟัน"},
        {"label": "3", "text": "ตรวจและปรับแต่งความหนาและความยาวด้านท้ายของฟันเทียม"},
        {"label": "4", "text": "ตรวจความคมของฟันปลอม และขัดให้เรียบ"},
        {"label": "5", "text": "กรอด้านท้ายฐานฟันปลอมให้สั้น เพื่อให้รู้สึกผู้ป่วยรู้สึกสบาย"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 21\nคนไข้ชายอายุ 50 ปี อาการนำปวดฟันหน้าบน 2-3 สัปดาห์ เคาะเจ็บ ที่เหลือปกติ มีประวัติทำครอบฟันซี่12และ22 มา 10 ปีเเล้ว ครอบสภาพดีขอบไม่สะดุด xray cast metal post&core เหลือ GP apical 1/3 มีรอยโรคปลายราก คนไข้ทานยาNOAC\n61. ถ้าจะผ่าฟันคุด38 จะจัดการคนไข้อย่างไร",
      "choices": [
        {"label": "1", "text": "หยุดยา pre-op 3 วัน"},
        {"label": "2", "text": "skip morning dose"},
        {"label": "3", "text": "delay morning dose"},
        {"label": "4", "text": "if INR>4, delay treatment"},
        {"label": "5", "text": "if INR<4, treat without drug adjustment"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 21\nคนไข้ชายอายุ 50 ปี อาการนำปวดฟันหน้าบน 2-3 สัปดาห์ เคาะเจ็บ ที่เหลือปกติ มีประวัติทำครอบฟันซี่12และ22 มา 10 ปีเเล้ว ครอบสภาพดีขอบไม่สะดุด xray cast metal post&core เหลือ GP apical 1/3 มีรอยโรคปลายราก คนไข้ทานยาNOAC\n62. ถ้าถอนฟันแล้วรากหัก การแคะรากระวังอะไร",
      "choices": [
        {"label": "1", "text": "infection"},
        {"label": "2", "text": "dry socket"},
        {"label": "3", "text": "labial plate หัก"},
        {"label": "4", "text": "OAC"},
        {"label": "5", "text": "paresthesia"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 21\nคนไข้ชายอายุ 50 ปี อาการนำปวดฟันหน้าบน 2-3 สัปดาห์ เคาะเจ็บ ที่เหลือปกติ มีประวัติทำครอบฟันซี่12และ22 มา 10 ปีเเล้ว ครอบสภาพดีขอบไม่สะดุด xray cast metal post&core เหลือ GP apical 1/3 มีรอยโรคปลายราก คนไข้ทานยาNOAC\n63. ผู้ป่วยให้ประวัติปวดซี่ 12 ปวดเเบบ spontaneous mild intermittent pain จัดการอย่างไร",
      "choices": [
        {"label": "1", "text": "intentional replantation"},
        {"label": "2", "text": "root resection"},
        {"label": "3", "text": "apicoectomy and retrograde filling"},
        {"label": "4", "text": "antibiotic and analgesic prescription"},
        {"label": "5", "text": "ติดตามอาการ"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 22\nผู้ป่วยเพศหญิง 50 ปี เป็น dm type 2 FBS 150 มีอาการปวดฟัน ฟันกรามซักซี่โยก 3 degree pd 7-9 mm (รูป x ray amalgam filing ขนาดใหญ่ OM แต่อุดไม่เต็ม และมีเงาดำใต้วัสดุตรง gingival ทับ pulp bone level ดูเหลือน้อยเกินครึ่งรากลงไปละ\n64. ทำอะไรกับซี่นี้ดี",
      "choices": [
        {"label": "1", "text": "RCT"},
        {"label": "2", "text": "Extraction"},
        {"label": "3", "text": "Scaling root plan"},
        {"label": "4", "text": "Scaling root plan + Occ splint"},
        {"label": "5", "text": "Perio splint"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 22\nผู้ป่วยเพศหญิง 50 ปี เป็น dm type 2 FBS 150 มีอาการปวดฟัน ฟันกรามซักซี่โยก 3 degree pd 7-9 mm (รูป x ray amalgam filing ขนาดใหญ่ OM แต่อุดไม่เต็ม และมีเงาดำใต้วัสดุตรง gingival ทับ pulp bone level ดูเหลือน้อยเกินครึ่งรากลงไปละ\n65. Prognosis คือ",
      "choices": [
        {"label": "1", "text": "Hopeless"},
        {"label": "2", "text": "Poor"},
        {"label": "3", "text": "Questionable"},
        {"label": "4", "text": "Good"},
        {"label": "5", "text": "Fair"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 22\nผู้ป่วยเพศหญิง 50 ปี เป็น dm type 2 FBS 150 มีอาการปวดฟัน ฟันกรามซักซี่โยก 3 degree pd 7-9 mm (รูป x ray amalgam filing ขนาดใหญ่ OM แต่อุดไม่เต็ม และมีเงาดำใต้วัสดุตรง gingival ทับ pulp bone level ดูเหลือน้อยเกินครึ่งรากลงไปละ\n66. AF ไม่เต็มในเคสนี้เกิดจากอะไร",
      "choices": [
        {"label": "1", "text": "plug ไม่แน่น"},
        {"label": "2", "text": "ใส่ matrix & wedges ไม่ดี"},
        {"label": "3", "text": "กรอไม่มีresistance form"},
        {"label": "4", "text": "อุด ไม่แนบ gingival margin"},
        {"label": "5", "text": "ไม่ pulp protection ก่อนอุด"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 23\nชาย 50 ปี มีก้อนเนื้อสีชมพูแดงที่สันเหงือกขากรรไกรล่าง (ไม่มีฟันซี่31 41 ก้อนเนื้อมันอยู่ตรงนั้นแหละ) ฟันซี่อื่นๆที่เห็นคือมีหินปูน เป็นมา 6 เดือบแบบค่อยๆโต กดแน่น เคี้ยวอาหารแล้วมีเลือดออกบ้าง เหงือกบริเวณอื่นปกติดี กินยากันชัก ดื่มแอลกอฮอล์สูบบุหรี่มา 10 ปี\n67. เป็นอะไร",
      "choices": [
        {"label": "1", "text": "Pyogenic granuloma"},
        {"label": "2", "text": "SCC"},
        {"label": "3", "text": "Non-Hodgkin"},
        {"label": "4", "text": "Gingival enlargement"},
        {"label": "5", "text": "Squamous papilloma"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 23\nชาย 50 ปี มีก้อนเนื้อสีชมพูแดงที่สันเหงือกขากรรไกรล่าง (ไม่มีฟันซี่31 41 ก้อนเนื้อมันอยู่ตรงนั้นแหละ) ฟันซี่อื่นๆที่เห็นคือมีหินปูน เป็นมา 6 เดือบแบบค่อยๆโต กดแน่น เคี้ยวอาหารแล้วมีเลือดออกบ้าง เหงือกบริเวณอื่นปกติดี กินยากันชัก ดื่มแอลกอฮอล์สูบบุหรี่มา 10 ปี\n68. etiology",
      "choices": [
        {"label": "1", "text": "smoking/alcohol"},
        {"label": "2", "text": "anticonvulsant"},
        {"label": "3", "text": "genetic change"},
        {"label": "4", "text": "chronic irritation"},
        {"label": "5", "text": "viral infection"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 23\nชาย 50 ปี มีก้อนเนื้อสีชมพูแดงที่สันเหงือกขากรรไกรล่าง (ไม่มีฟันซี่31 41 ก้อนเนื้อมันอยู่ตรงนั้นแหละ) ฟันซี่อื่นๆที่เห็นคือมีหินปูน เป็นมา 6 เดือบแบบค่อยๆโต กดแน่น เคี้ยวอาหารแล้วมีเลือดออกบ้าง เหงือกบริเวณอื่นปกติดี กินยากันชัก ดื่มแอลกอฮอล์สูบบุหรี่มา 10 ปี\n69. management: choice จะมี 2-3 ของการจัดการเหล่านี้ เรียงลำดับสลับไปมา (OHI/ ScRP/ surgical excision/ หยุดยากันชัก)",
      "choices": [
        {"label": "1", "text": "OHI -> ScRP"},
        {"label": "2", "text": "Surgical excision -> ScRP -> OHI"},
        {"label": "3", "text": "หยุดยากันชัก -> ...."},
        {"label": "4", "text": "ScRP->OHI->หยุดยากันชัก"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 24\nคนไข้เพศหญิง อายุ 60 ปี มาด้วยปวดฟันซี่ 42 มีบวมด้าน labial เคาะคลำแล้วเจ็บมาก ให้รูปมามี periapical lesion ซี่ 42\n70. เราจะสามารถวินิจฉัยแยกโรคระหว่าง radicular cyst และ periapical cemento-osseous dysplasia ได้อย่างไร",
      "choices": [
        {"label": "1", "text": "Age"},
        {"label": "2", "text": "Size of lesion"},
        {"label": "3", "text": "Tooth vitality"},
        {"label": "4", "text": "Underlying disease"},
        {"label": "5", "text": "Root resorption"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 24\nคนไข้เพศหญิง อายุ 60 ปี มาด้วยปวดฟันซี่ 42 มีบวมด้าน labial เคาะคลำแล้วเจ็บมาก ให้รูปมามี periapical lesion ซี่ 42\n71. ลักษณะการเปิดโพรงฟันเพื่อรักษาซี่ 42 เป็นอย่างไร",
      "choices": [
        {"label": "1", "text": "เป็นรูปสามเหลี่ยมโดยฐานอยู่ด้าน incisal และยอดอยู่ด้าน cervical"},
        {"label": "2", "text": "เป็นรูปสามเหลี่ยมโดยฐานอยู่ด้าน cervical และยอดอยู่ด้าน incisal"},
        {"label": "3", "text": "เป็นรูปวงรีกว้างในแนว inciso-cervical"},
        {"label": "4", "text": "เป็นรูปวงรีกว้างในแนว mesio-distal"},
        {"label": "5", "text": "เป็นรูปวงกลมรัศมีเท่ากันทั้งแนว inciso-cervical และ mesio-distal"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 24\nคนไข้เพศหญิง อายุ 60 ปี มาด้วยปวดฟันซี่ 42 มีบวมด้าน labial เคาะคลำแล้วเจ็บมาก ให้รูปมามี periapical lesion ซี่ 42\n72. Complication ที่มักจะเกิดขึ้นจากการเปิดโพรงฟันซี่ 42",
      "choices": [
        {"label": "1", "text": "ทะลุด้าน labial เนื่องจาก anatomy ของฟันบาง"},
        {"label": "2", "text": "ทะลุด้าน lingual เนื่องจาก canal ตีบ"},
        {"label": "3", "text": "ทะลุด้าน mesial เนื่องจากฟันมักเอียงทาง mesial"},
        {"label": "4", "text": "มี labial shoulder ทำให้ไม่ได้ straight line access ที่ดี"},
        {"label": "5", "text": "มี labial shoulder ทำให้ miss canal"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 25\nชาย อายุ50 เจ็บแปลบๆ เวลาสัมผัสหรือแปรงฟันเบาๆ บริเวณ temporal กับแก้มฝั่ง zygoma หลังถอนฟันซี่ 23 มาเป็นเวลา 3 เดือน เป็นมากตอนเช้า\n73. อะไรช่วยในการ diag",
      "choices": [
        {"label": "1", "text": "Aggrevation of pain"},
        {"label": "2", "text": "Characteristic of pain"},
        {"label": "3", "text": "Relieving of pain"},
        {"label": "4", "text": "Duration of pain"},
        {"label": "5", "text": "Associated symptoms of pain"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 25\nชาย อายุ50 เจ็บแปลบๆ เวลาสัมผัสหรือแปรงฟันเบาๆ บริเวณ temporal กับแก้มฝั่ง zygoma หลังถอนฟันซี่ 23 มาเป็นเวลา 3 เดือน เป็นมากตอนเช้า\n74. Diag",
      "choices": [
        {"label": "1", "text": "Myalgia with referral"},
        {"label": "2", "text": "Myalgia with ..."},
        {"label": "3", "text": "Trigeminal neuralgia"},
        {"label": "4", "text": "Post traumatic neuropathy"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    },
    {
      "question_text": "STEM 25\nชาย อายุ50 เจ็บแปลบๆ เวลาสัมผัสหรือแปรงฟันเบาๆ บริเวณ temporal กับแก้มฝั่ง zygoma หลังถอนฟันซี่ 23 มาเป็นเวลา 3 เดือน เป็นมากตอนเช้า\n75. Nerve อะไรเลี้ยง",
      "choices": [
        {"label": "1", "text": "CNV1"},
        {"label": "2", "text": "CNV2"},
        {"label": "3", "text": "CNV1 and V2"},
        {"label": "4", "text": "CNVII"},
        {"label": "5", "text": "CNV3"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2022 Part 2"
    }
  ]
}

os.makedirs('/Users/admin/Downloads/NL Test/parsed_exams', exist_ok=True)
with open('/Users/admin/Downloads/NL Test/parsed_exams/NL2_2022_part2.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved to /Users/admin/Downloads/NL Test/parsed_exams/NL2_2022_part2.json")
