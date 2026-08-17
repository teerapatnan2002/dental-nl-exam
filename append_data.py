import json

new_data = [
  {
    "question_text": "26. การจัดการกับช่องว่างในขากรรไกรล่างอย่างไร",
    "choices": [
      { "label": "A", "text": "Nance holding arch space maintainer" },
      { "label": "B", "text": "Lingual holding arch space maintainer" },
      { "label": "C", "text": "Longspan band and loop space maintainer" },
      { "label": "D", "text": "Distal shoe space maintainer" },
      { "label": "E", "text": "Hawley retainer" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมจัดฟัน",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็กอายุ 9 ขวบ เค้าโครงใบหน้าด้านข้างปกติ ให้รูปฟัน 11 Anterior crossbite ภาพ Lower arch 46, 44, 83, 42-32, 73, 36 (45,34,35 ยังไม่ขึ้นและไม่มีฟันน้ำนม)",
    "proposition": None
  },
  {
    "question_text": "27. อะไรช่วยในการวินิจฉัยว่าผู้ป่วยรายนี้เป็น Pseudoclass III malocclusion",
    "choices": [
      { "label": "A", "text": "Transverse arch asymmetry" },
      { "label": "B", "text": "Broad mandible" },
      { "label": "C", "text": "Narrow palate" },
      { "label": "D", "text": "Functional mandibular shift" },
      { "label": "E", "text": "Increase overbite" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมจัดฟัน",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็กอายุ 9 ขวบ เค้าโครงใบหน้าด้านข้างปกติ ให้รูปฟัน 11 Anterior crossbite ภาพ Lower arch 46, 44, 83, 42-32, 73, 36 (45,34,35 ยังไม่ขึ้นและไม่มีฟันน้ำนม)",
    "proposition": None
  },
  {
    "question_text": "28. ถ้าจะรักษารากฟันซี่ 36 Danger zone ที่ต้องระวังในซี่นี้คือบริเวณใด",
    "choices": [
      { "label": "A", "text": "Mesial part of mesial root" },
      { "label": "B", "text": "Distal part of mesial root" },
      { "label": "C", "text": "Buccal part of mesial root" },
      { "label": "D", "text": "Lingual part of mesial root" },
      { "label": "E", "text": "Furcation" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "การเกิดและการดำเนินโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยมาด้วยอาการปวดฟันกรามล่างซ้าย ปวดมา 2 วัน -to palpation and percussion, + to EPT รูปภาพรังสี bitewing ซี่ 36 ผุ OD ใหญ่ nearly exposed/exposed pulp tissue, 2 root, no bone loss X-ray BW ซี่ 25 มีผุเข้า outer 1/3 of dentin",
    "proposition": None
  },
  {
    "question_text": "29. ฟันซี่ 36 ควรทำการรักษาทางวิทยาเอนโดดอนต์อย่างไร",
    "choices": [
      { "label": "A", "text": "Pulpectomy" },
      { "label": "B", "text": "Pulpotomy" },
      { "label": "C", "text": "Root canal treatment" },
      { "label": "D", "text": "Direct pulp capping" },
      { "label": "E", "text": "Indirect pulp capping" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยมาด้วยอาการปวดฟันกรามล่างซ้าย ปวดมา 2 วัน -to palpation and percussion, + to EPT รูปภาพรังสี bitewing ซี่ 36 ผุ OD ใหญ่ nearly exposed/exposed pulp tissue, 2 root, no bone loss X-ray BW ซี่ 25 มีผุเข้า outer 1/3 of dentin",
    "proposition": None
  },
  {
    "question_text": "30. จงให้ ICDAS 25",
    "choices": [
      { "label": "A", "text": "RA1" },
      { "label": "B", "text": "RA2" },
      { "label": "C", "text": "RA3" },
      { "label": "D", "text": "RB4" },
      { "label": "E", "text": "RB5" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยมาด้วยอาการปวดฟันกรามล่างซ้าย ปวดมา 2 วัน -to palpation and percussion, + to EPT รูปภาพรังสี bitewing ซี่ 36 ผุ OD ใหญ่ nearly exposed/exposed pulp tissue, 2 root, no bone loss X-ray BW ซี่ 25 มีผุเข้า outer 1/3 of dentin",
    "proposition": None
  },
  {
    "question_text": "31. จะให้การรักษาอะไรสำหรับซี่ 85",
    "choices": [
      { "label": "A", "text": "Pulpotomy with SSC" },
      { "label": "B", "text": "Pulpectomy with SSC" },
      { "label": "C", "text": "SSC" },
      { "label": "D", "text": "Extraction with space maintainer" },
      { "label": "E", "text": "Extraction" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้เด็ก 8 ขวบ intraoral occlusal view lower arch เห็นซี่ 85 ผุใหญ่มาก เหลือแต่ buccal wall ด้านอื่นเนื้อฟันเสมอขอบเหงือก ซี่ 45 กำลังจะขึ้น อีกรูปเป็น periapical x-ray ซี่ 85 ผุ exposed pulp mesial root resorp ไป 1/3 , distal root resorp ไป เกือบถึง furcation ใต้ furcation เห็น tooth bud ซี่ 45 จ่ออยู่ ซี่ 44 partial erupt 46 ขึ้นแล้ว",
    "proposition": None
  },
  {
    "question_text": "32. ข้อไหนจ่าย fluoride เหมาะสมกับผู้ป่วยรายนี้",
    "choices": [
      { "label": "A", "text": "1500 ppm F dentifrice, 1.23% APF gel" },
      { "label": "B", "text": "1000 ppm F dentifrice, 5% NaF varnish" },
      { "label": "C", "text": "0.05% NaF mouthwash weekly, 1.23% APF gel" },
      { "label": "D", "text": "0.05% NaF mouthwash daily, 1.1% NaF gel" },
      { "label": "E", "text": "0.2% NaF mouthwash weekly, 1.1% NaF gel" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้เด็ก 8 ขวบ intraoral occlusal view lower arch เห็นซี่ 85 ผุใหญ่มาก เหลือแต่ buccal wall ด้านอื่นเนื้อฟันเสมอขอบเหงือก ซี่ 45 กำลังจะขึ้น อีกรูปเป็น periapical x-ray ซี่ 85 ผุ exposed pulp mesial root resorp ไป 1/3 , distal root resorp ไป เกือบถึง furcation ใต้ furcation เห็น tooth bud ซี่ 45 จ่ออยู่ ซี่ 44 partial erupt 46 ขึ้นแล้ว",
    "proposition": None
  },
  {
    "question_text": "33. 85 ส่งผลยังไงกับ 45 ได้มากที่สุด",
    "choices": [
      { "label": "A", "text": "Enamel hypoplasia" },
      { "label": "B", "text": "Dentinogenesis imperfecta" },
      { "label": "C", "text": "Uneruption" },
      { "label": "D", "text": "Malposition" },
      { "label": "E", "text": "Root dilaceration" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "การเกิดและการดำเนินโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้เด็ก 8 ขวบ intraoral occlusal view lower arch เห็นซี่ 85 ผุใหญ่มาก เหลือแต่ buccal wall ด้านอื่นเนื้อฟันเสมอขอบเหงือก ซี่ 45 กำลังจะขึ้น อีกรูปเป็น periapical x-ray ซี่ 85 ผุ exposed pulp mesial root resorp ไป 1/3 , distal root resorp ไป เกือบถึง furcation ใต้ furcation เห็น tooth bud ซี่ 45 จ่ออยู่ ซี่ 44 partial erupt 46 ขึ้นแล้ว",
    "proposition": None
  },
  {
    "question_text": "34. ให้รูป 44 PFM crown chip ออกไปตรง B cusp ถามว่า สาเหตุคืออะไร",
    "choices": [
      { "label": "A", "text": "occlusal load ผู้ป่วยเคี้ยวอาหารแข็ง" },
      { "label": "B", "text": "inadequate tooth preparation" },
      { "label": "C", "text": "over adjustment of occlusion" },
      { "label": "D", "text": "คนไข้ bruxism" },
      { "label": "E", "text": "CTE mismatch" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมประดิษฐ์",
    "task": "การเกิดและการดำเนินโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเพศหญิงมีโรคประจำตัว กินยา ASA, atorvastatin, metformin, atenolol ให้รูปในช่องปากเป็น periodontitis และภาพ xray full mouth มี bone loss ทั่วทั้งปาก ซี่ 44 ทำครอบ PFM มามี porcelain chipping มีลูกศรชี้ที่ metal substructure exposed ที่ด้าน occlusal เป็นจุดวงกลม และรูป periapical 3 รูปบริเวณเดียวกัน (แต่ภาพไม่ชัดว่าปักหรือไม่ปัก post)",
    "proposition": None
  },
  {
    "question_text": "35. x-ray ถามว่าเป็นวัสดุอะไร (คุณภาพห่วยๆ ห่วยจนดูไม่ออกว่ามี post มั้ย) เหมือนไม่มี post นะ",
    "choices": [
      { "label": "A", "text": "PFM crown" },
      { "label": "B", "text": "Zirconia crown" },
      { "label": "C", "text": "Cast post with PFM crown" },
      { "label": "D", "text": "Fiber post with PFM crown" },
      { "label": "E", "text": "Fiber post with zirconia crown" },
      { "label": "F", "text": "Metal post with PFM crown" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมประดิษฐ์",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเพศหญิงมีโรคประจำตัว กินยา ASA, atorvastatin, metformin, atenolol ให้รูปในช่องปากเป็น periodontitis และภาพ xray full mouth มี bone loss ทั่วทั้งปาก ซี่ 44 ทำครอบ PFM มามี porcelain chipping มีลูกศรชี้ที่ metal substructure exposed ที่ด้าน occlusal เป็นจุดวงกลม และรูป periapical 3 รูปบริเวณเดียวกัน (แต่ภาพไม่ชัดว่าปักหรือไม่ปัก post)",
    "proposition": None
  },
  {
    "question_text": "36. ปัจจัยเสี่ยงที่ทำให้เกิดโรคปริทันต์ในผู้ป่วยรายนี้",
    "choices": [
      { "label": "A", "text": "Antihypertensive drug" },
      { "label": "B", "text": "Antiplatelet drug" },
      { "label": "C", "text": "Hematological disorder" },
      { "label": "D", "text": "Hyperlipidemia" },
      { "label": "E", "text": "Diabetes mellitus" }
    ],
    "correct_answer": None,
    "category": "ปริทันตวิทยา",
    "task": "การเกิดและการดำเนินโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเพศหญิงมีโรคประจำตัว กินยา ASA, atorvastatin, metformin, atenolol ให้รูปในช่องปากเป็น periodontitis และภาพ xray full mouth มี bone loss ทั่วทั้งปาก ซี่ 44 ทำครอบ PFM มามี porcelain chipping มีลูกศรชี้ที่ metal substructure exposed ที่ด้าน occlusal เป็นจุดวงกลม และรูป periapical 3 รูปบริเวณเดียวกัน (แต่ภาพไม่ชัดว่าปักหรือไม่ปัก post)",
    "proposition": None
  },
  {
    "question_text": "37. ถามว่า 74 รักษาอย่างไร",
    "choices": [
      { "label": "A", "text": "Pulpectomy + SSC" },
      { "label": "B", "text": "Pulpotomy + SSC" },
      { "label": "C", "text": "Direct pulp capping แล้วอุดด้วย amalgam" },
      { "label": "D", "text": "Dycal and amalgam filling" },
      { "label": "E", "text": "Extraction" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็ก 5 ขวบ มาด้วยอาการปวดฟันซี่ 74 มาเป็นเวลา 2 วัน เวลาเคี้ยวอาหาร (ให้รูป xray มาแบบ 74 OD nearly exposed pulp ดูรูปยากว่า ถึงpulp ไหม) และ 65 เคย Pulpectomy มาแล้วด้วย vitapex (รูปเป็น vitapex ออกไปนอกปลายราก ใกล้ๆ tooth bud) ทานอาหารระหว่างมื้อวันละ 3 ครั้ง แปรงฟันวันละ 2 ครั้ง *65 ในภาพคลินิกไม่ใช่ SSC แต่ในฟิล์มเป็น SSC ละ",
    "proposition": None
  },
  {
    "question_text": "38. ทำอย่างไรกับซี่ 65",
    "choices": [
      { "label": "A", "text": "รื้อ SSC และทำใหม่" },
      { "label": "B", "text": "ถอน 65 แล้ว currette ลงไปเอาวัสดุส่วนเกินออก" },
      { "label": "C", "text": "รื้อ root canal แล้วล้างและอุดใหม่" },
      { "label": "D", "text": "ปล่อยไว้คอย monitor ด้วยการถ่าย x-ray ทุก 6 เดือน" },
      { "label": "E", "text": "ถอนแล้วใส่ space maintainer" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็ก 5 ขวบ มาด้วยอาการปวดฟันซี่ 74 มาเป็นเวลา 2 วัน เวลาเคี้ยวอาหาร (ให้รูป xray มาแบบ 74 OD nearly exposed pulp ดูรูปยากว่า ถึงpulp ไหม) และ 65 เคย Pulpectomy มาแล้วด้วย vitapex (รูปเป็น vitapex ออกไปนอกปลายราก ใกล้ๆ tooth bud) ทานอาหารระหว่างมื้อวันละ 3 ครั้ง แปรงฟันวันละ 2 ครั้ง *65 ในภาพคลินิกไม่ใช่ SSC แต่ในฟิล์มเป็น SSC ละ",
    "proposition": None
  },
  {
    "question_text": "39. จะแนะนำการดูแลช่องปากอย่างไร",
    "choices": [
      { "label": "A", "text": "ปรับการทานอาหารระหว่างมื้อ" },
      { "label": "B", "text": "สอนเด็กแปรงฟันแบบ Modified bass" },
      { "label": "C", "text": "ใช้ยาสีฟัน 1500 ppm เท่าความกว้างแปรง" },
      { "label": "D", "text": "บ้วนปากด้วย CHX วันละครั้ง ก่อนนอนทุกคืน" },
      { "label": "E", "text": "บ้วนปากด้วย NaF วันละครั้ง ก่อนนอนทุกคืน" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "การสร้างเสริมสุขภาพและการป้องกัน",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็ก 5 ขวบ มาด้วยอาการปวดฟันซี่ 74 มาเป็นเวลา 2 วัน เวลาเคี้ยวอาหาร (ให้รูป xray มาแบบ 74 OD nearly exposed pulp ดูรูปยากว่า ถึงpulp ไหม) และ 65 เคย Pulpectomy มาแล้วด้วย vitapex (รูปเป็น vitapex ออกไปนอกปลายราก ใกล้ๆ tooth bud) ทานอาหารระหว่างมื้อวันละ 3 ครั้ง แปรงฟันวันละ 2 ครั้ง *65 ในภาพคลินิกไม่ใช่ SSC แต่ในฟิล์มเป็น SSC ละ",
    "proposition": None
  },
  {
    "question_text": "40. ถาม diagnosis",
    "choices": [
      { "label": "A", "text": "MRONJ" },
      { "label": "B", "text": "Mucormycosis" },
      { "label": "C", "text": "SCC" },
      { "label": "D", "text": "Mucoepidermoid carcinoma" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเพศหญิง อายุ 60 ปี มีโรคประจำตัวเป็นความดัน rheumatoid กระดูกพรุน กินยา Methotrexade, Alendronate, Losartan, naproxen ให้รูปในช่องปากมา มีรูป torus palatinus เห็นกระดูกโผล่",
    "proposition": None
  },
  {
    "question_text": "41. ถ้าจะถอน 27 จ่ายยาอะไร",
    "choices": [
      { "label": "A", "text": "Acetaminophen" },
      { "label": "B", "text": "Ibuprofen" },
      { "label": "C", "text": "Etoricoxib" },
      { "label": "D", "text": "Codeine" },
      { "label": "E", "text": "Mefenamic acid" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "การจัดการและการรักษาผู้ป่วย",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเพศหญิง อายุ 60 ปี มีโรคประจำตัวเป็นความดัน rheumatoid กระดูกพรุน กินยา Methotrexade, Alendronate, Losartan, naproxen ให้รูปในช่องปากมา มีรูป torus palatinus เห็นกระดูกโผล่",
    "proposition": None
  },
  {
    "question_text": "42. (คำถามไม่สมบูรณ์ในต้นฉบับ)",
    "choices": [
    ],
    "correct_answer": None,
    "category": "Uncategorized",
    "task": "Uncategorized",
    "explanation": "ต้นฉบับไม่มีคำถามและตัวเลือก",
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเพศหญิง อายุ 60 ปี มีโรคประจำตัวเป็นความดัน rheumatoid กระดูกพรุน กินยา Methotrexade, Alendronate, Losartan, naproxen ให้รูปในช่องปากมา มีรูป torus palatinus เห็นกระดูกโผล่",
    "proposition": None
  },
  {
    "question_text": "43. สาเหตุความบกพร่องของวัสดุบูรณะซี่ 44",
    "choices": [
      { "label": "A", "text": "Polymerization shrinkage" },
      { "label": "B", "text": "Secondary caries" },
      { "label": "C", "text": "Mismatch thermal expansion coefficiency" },
      { "label": "D", "text": "Improper matrix application" },
      { "label": "E", "text": "Underfilled restoration placement" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "การเกิดและการดำเนินโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 50 ปี ปวดฟันกรามน้อยล่างขวาซี่ 44 เป็น ๆ หาย ๆ และมีอาหารติดฟันบนขวาซี่ 15 ตลอดเวลา (ให้ภาพในช่องปากเห็นซี่ 15 torsiversion อุด class V CoF, 14/15 food impaction และให้ภาพ periapical มี 44D radiolucent under radiopacity of restoration on buccal surface)",
    "proposition": None
  },
  {
    "question_text": "44. การจัดการฟันผุซี่ 15 ที่เหมาะสม",
    "choices": [
      { "label": "A", "text": "Nonselective removal to hard dentin" },
      { "label": "B", "text": "Nonoperative caries treatment & prevention" },
      { "label": "C", "text": "Selective removal to firm dentin" },
      { "label": "D", "text": "Selective removal to soft dentin" },
      { "label": "E", "text": "Complete caries removal" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 50 ปี ปวดฟันกรามน้อยล่างขวาซี่ 44 เป็น ๆ หาย ๆ และมีอาหารติดฟันบนขวาซี่ 15 ตลอดเวลา (ให้ภาพในช่องปากเห็นซี่ 15 torsiversion อุด class V CoF, 14/15 food impaction และให้ภาพ periapical มี 44D radiolucent under radiopacity of restoration on buccal surface)",
    "proposition": None
  },
  {
    "question_text": "45. ซี่ 44 ให้ diagnosis เป็น symptomatic irreversible pulpitis with normal apical tissues การจัดการเบื้องต้นที่ส่งผลต่อความสำเร็จในการรักษารากฟันซี่ 44 คือใด",
    "choices": [
      { "label": "A", "text": "Occlusal reduction" },
      { "label": "B", "text": "Scaling and root planing" },
      { "label": "C", "text": "Effective local anesthesia" },
      { "label": "D", "text": "Proper emergency treatment" },
      { "label": "E", "text": "Removal of old restoration and caries" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 50 ปี ปวดฟันกรามน้อยล่างขวาซี่ 44 เป็น ๆ หาย ๆ และมีอาหารติดฟันบนขวาซี่ 15 ตลอดเวลา (ให้ภาพในช่องปากเห็นซี่ 15 torsiversion อุด class V CoF, 14/15 food impaction และให้ภาพ periapical มี 44D radiolucent under radiopacity of restoration on buccal surface)",
    "proposition": None
  },
  {
    "question_text": "46. Differential Diagnosis ที่เป็นไปได้มากที่สุด",
    "choices": [
      { "label": "A", "text": "Condylar hyperplasia" },
      { "label": "B", "text": "Condylar hypoplasia" },
      { "label": "C", "text": "Coronoid hyperplasia" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยหญิงอายุ 25 ปี มาด้วยสังเกตหน้าข้างซ้ายรู้สึกค่อยๆบวมขึ้นมา 5 ปี เริ่มมีอาการปวดกรามซ้าย อ้าปากได้น้อยลง มีเสียงคลิกหน้าหูขวา ให้ภาพ OPG มา เห็นคางซ้ายใหญ่ midline คางอยู่ด้านซ้าย neck of condyle ยาวกว่าด้านขวา condylar head ใหญ่",
    "proposition": None
  },
  {
    "question_text": "47. ภายหลังรักษาอาการข้อต่อขากรรไกรแล้ว จะแก้ไขการสบฟันยังไง",
    "choices": [
      { "label": "A", "text": "Orthognathic surgery ร่วมกับการจัดฟัน" },
      { "label": "B", "text": "Mandibular segmental resection" },
      { "label": "C", "text": "Orthognathic surgery and occlusal veneer" },
      { "label": "D", "text": "Occlusal adjustment" },
      { "label": "E", "text": "Full mouth rehabilitation" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยหญิงอายุ 25 ปี มาด้วยสังเกตหน้าข้างซ้ายรู้สึกค่อยๆบวมขึ้นมา 5 ปี เริ่มมีอาการปวดกรามซ้าย อ้าปากได้น้อยลง มีเสียงคลิกหน้าหูขวา ให้ภาพ OPG มา เห็นคางซ้ายใหญ่ midline คางอยู่ด้านซ้าย neck of condyle ยาวกว่าด้านขวา condylar head ใหญ่",
    "proposition": None
  },
  {
    "question_text": "48. ลักษณะทางคลินิกที่สอดคล้องกับภาพรังสีมากที่สุดคือ",
    "choices": [
      { "label": "A", "text": "Midline mandible deviate to left" },
      { "label": "B", "text": "Chin deviate to left" },
      { "label": "C", "text": "Deepbite" },
      { "label": "D", "text": "Unilateral left posterior crossbite" },
      { "label": "E", "text": "Left posterior open bite" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมจัดฟัน",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยหญิงอายุ 25 ปี มาด้วยสังเกตหน้าข้างซ้ายรู้สึกค่อยๆบวมขึ้นมา 5 ปี เริ่มมีอาการปวดกรามซ้าย อ้าปากได้น้อยลง มีเสียงคลิกหน้าหูขวา ให้ภาพ OPG มา เห็นคางซ้ายใหญ่ midline คางอยู่ด้านซ้าย neck of condyle ยาวกว่าด้านขวา condylar head ใหญ่",
    "proposition": None
  },
  {
    "question_text": "49. ซี่ 16, 26 deep pit & fissure ขึ้นเต็มซี่ ต้องมีการจัดการอย่างไร",
    "choices": [
      { "label": "A", "text": "GI sealant" },
      { "label": "B", "text": "Resin sealant" },
      { "label": "C", "text": "CCP-ACP" },
      { "label": "D", "text": "PRR" },
      { "label": "E", "text": "Observation" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "การสร้างเสริมสุขภาพและการป้องกัน",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "รูป Crossbite ที่ 11, 21 Space บริเวณ 12 และฟันหลังดูไม่พอ ให้รูป Occlusal Arch บน และ Arch ล่างมา",
    "proposition": None
  },
  {
    "question_text": "50. เลือก dental forceps สำหรับถอนฟันซี่ 55",
    "choices": [
      { "label": "A", "text": "Forceps no. 150 s" },
      { "label": "B", "text": "Forceps no. 151s" },
      { "label": "C", "text": "Forceps no. 23" },
      { "label": "D", "text": "Forceps no. 12" },
      { "label": "E", "text": "Forceps no. 2" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "รูป Crossbite ที่ 11, 21 Space บริเวณ 12 และฟันหลังดูไม่พอ ให้รูป Occlusal Arch บน และ Arch ล่างมา",
    "proposition": None
  },
  {
    "question_text": "51. ค่า space analysis เป็นยังไง",
    "choices": [
      { "label": "A", "text": "Upper arch height น้อย" },
      { "label": "B", "text": "Upper anterior arch width มาก" },
      { "label": "C", "text": "Lower arch height น้อย" },
      { "label": "D", "text": "Upper posterior arch width มาก" },
      { "label": "E", "text": "Upper arch clinical arch width มากกว่า acquired arch width" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมจัดฟัน",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "รูป Crossbite ที่ 11, 21 Space บริเวณ 12 และฟันหลังดูไม่พอ ให้รูป Occlusal Arch บน และ Arch ล่างมา",
    "proposition": None
  },
  {
    "question_text": "52. จะป้องกันฟันผุในเด็กคนนี้ยังไงดี",
    "choices": [
      { "label": "A", "text": "0.8% Stannous fluoride dentrifice" },
      { "label": "B", "text": "1.23% APF gel" },
      { "label": "C", "text": "5% NaF varnish" },
      { "label": "D", "text": "18% SDF" },
      { "label": "E", "text": "10% sodium monofluorophosphate dentifrice" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "การสร้างเสริมสุขภาพและการป้องกัน",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็ก 2 ขวบ ยังกินนมขวดอยู่ ย่าเป็นผู้ดูแลบอกว่าเด็กไม่ยอมให้แปรงฟัน ให้รูปมาเป็นฟันหน้าบตั้งต่ซี่ 53-63 ผุ proximal, labial หมดเลยหลาย ๆ ซี่ เด็กไม่เคยทำฟัน กลัวการทำฟัน ร้องไห้ดิ้น ไม่ยอมนั่งเก้าอี้ทำฟัน",
    "proposition": None
  },
  {
    "question_text": "53. จัดการพฤติกรรมอย่างไร",
    "choices": [
      { "label": "A", "text": "Voice control" },
      { "label": "B", "text": "Parental absence" },
      { "label": "C", "text": "Protective stabilization" },
      { "label": "D", "text": "GA" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "การจัดการและการรักษาผู้ป่วย",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็ก 2 ขวบ ยังกินนมขวดอยู่ ย่าเป็นผู้ดูแลบอกว่าเด็กไม่ยอมให้แปรงฟัน ให้รูปมาเป็นฟันหน้าบตั้งต่ซี่ 53-63 ผุ proximal, labial หมดเลยหลาย ๆ ซี่ เด็กไม่เคยทำฟัน กลัวการทำฟัน ร้องไห้ดิ้น ไม่ยอมนั่งเก้าอี้ทำฟัน",
    "proposition": None
  },
  {
    "question_text": "54. พฤติกรรมเด็กเป็นแบบใด",
    "choices": [
      { "label": "A", "text": "Frankel scale 2" },
      { "label": "B", "text": "Frankel scale 4" },
      { "label": "C", "text": "Lacking cooperative" },
      { "label": "D", "text": "Cooperative" },
      { "label": "E", "text": "Uncooperative" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "เด็ก 2 ขวบ ยังกินนมขวดอยู่ ย่าเป็นผู้ดูแลบอกว่าเด็กไม่ยอมให้แปรงฟัน ให้รูปมาเป็นฟันหน้าบตั้งต่ซี่ 53-63 ผุ proximal, labial หมดเลยหลาย ๆ ซี่ เด็กไม่เคยทำฟัน กลัวการทำฟัน ร้องไห้ดิ้น ไม่ยอมนั่งเก้าอี้ทำฟัน",
    "proposition": None
  },
  {
    "question_text": "55. สีดำบริเวณเหงือกเกิดจากอะไร",
    "choices": [
      { "label": "A", "text": "Premalignant" },
      { "label": "B", "text": "Hyperpigmentation" },
      { "label": "C", "text": "Infection" },
      { "label": "D", "text": "Aging" },
      { "label": "E", "text": "Hormone" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 80 ปี มี edentulous area บนและล่าง จะทำ CD ไม่มีโรคประจำตัว มีประวัติ สูบบุหรี่วันละ 20 มวน มาเป็นเวลา 30 ปี ให้ภาพภายในช่องปาก บริเวณ ridge มีลักษณะสีดำ ๆ กระจายเต็มสัน ridge สัน ridge มีความขรุขระเล็กน้อย และมี frenum เกาะสูง ไม่มีฟันปลอมมาก่อน (ให้รูปมามีเหงือกดำๆ เหมือนรูปนี้แต่มีดำๆมากกว่านี้)",
    "proposition": None
  },
  {
    "question_text": "56. หลังผ่าตัดคนไข้ต้องดูแลช่องปากอย่างไร",
    "choices": [
      { "label": "A", "text": "จ่าย Chlorhexidine ให้บ้วน และงดสูบบุหรี่จนกว่าจะตัดไหม" },
      { "label": "B", "text": "จ่าย Ibuprofen 400mg t.i.d. 5 วัน และงดสูบบุหรี่" },
      { "label": "C", "text": "จ่าย Amoxicillin 5 วัน" },
      { "label": "D", "text": "นำ Gauze ชุบ chlorhexidine เช็ด" },
      { "label": "E", "text": "ขยับลิ้นไปมาตลอด" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "การจัดการและการรักษาผู้ป่วย",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 80 ปี มี edentulous area บนและล่าง จะทำ CD ไม่มีโรคประจำตัว มีประวัติ สูบบุหรี่วันละ 20 มวน มาเป็นเวลา 30 ปี ให้ภาพภายในช่องปาก บริเวณ ridge มีลักษณะสีดำ ๆ กระจายเต็มสัน ridge สัน ridge มีความขรุขระเล็กน้อย และมี frenum เกาะสูง ไม่มีฟันปลอมมาก่อน (ให้รูปมามีเหงือกดำๆ เหมือนรูปนี้แต่มีดำๆมากกว่านี้)",
    "proposition": None
  },
  {
    "question_text": "57. ควรทำอะไรก่อน ทำฟันปลอบ",
    "choices": [
      { "label": "A", "text": "เลิกบุหรี่" },
      { "label": "B", "text": "Alveoloplasty" },
      { "label": "C", "text": "ตัด exostosis" },
      { "label": "D", "text": "Laser treatment for hyperpigmentation" },
      { "label": "E", "text": "ไม่ต้องทำอะไร" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมประดิษฐ์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 80 ปี มี edentulous area บนและล่าง จะทำ CD ไม่มีโรคประจำตัว มีประวัติ สูบบุหรี่วันละ 20 มวน มาเป็นเวลา 30 ปี ให้ภาพภายในช่องปาก บริเวณ ridge มีลักษณะสีดำ ๆ กระจายเต็มสัน ridge สัน ridge มีความขรุขระเล็กน้อย และมี frenum เกาะสูง ไม่มีฟันปลอมมาก่อน (ให้รูปมามีเหงือกดำๆ เหมือนรูปนี้แต่มีดำๆมากกว่านี้)",
    "proposition": None
  },
  {
    "question_text": "58. อาการปวดของคนไข้ส่งผ่านเส้นประสาทอะไร",
    "choices": [
      { "label": "A", "text": "C fiber" },
      { "label": "B", "text": "A delta" },
      { "label": "C", "text": "A beta" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "วิทยาศาสตร์การแพทย์พื้นฐาน",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 70 ปี มาด้วยอาการปวดตื้อ ปวดมา 3 วัน ซี่ 14 เคยทำ pulp capping เมื่อ 3 ปี ก่อน ให้รูปในปากตรง vestibule ดูบวมเล็ก ๆ",
    "proposition": None
  },
  {
    "question_text": "59. ตอนนี้ยังมีอาการปวดอยู่ รักษา emergency อย่างไร",
    "choices": [
      { "label": "A", "text": "Open and drain" },
      { "label": "B", "text": "Incision and drain" },
      { "label": "C", "text": "Antibiotic and analgesia" },
      { "label": "D", "text": "Trephenation" },
      { "label": "E", "text": "RCT" },
      { "label": "F", "text": "Access opening" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 70 ปี มาด้วยอาการปวดตื้อ ปวดมา 3 วัน ซี่ 14 เคยทำ pulp capping เมื่อ 3 ปี ก่อน ให้รูปในปากตรง vestibule ดูบวมเล็ก ๆ",
    "proposition": None
  },
  {
    "question_text": "60. ทำอะไรให้เคสนี้มี prognosis ที่ดี",
    "choices": [
      { "label": "A", "text": "Remove caries and temporary wall" },
      { "label": "B", "text": "OC" },
      { "label": "C", "text": "Scaling" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 70 ปี มาด้วยอาการปวดตื้อ ปวดมา 3 วัน ซี่ 14 เคยทำ pulp capping เมื่อ 3 ปี ก่อน ให้รูปในปากตรง vestibule ดูบวมเล็ก ๆ",
    "proposition": None
  },
  {
    "question_text": "60b. รักษาหมดแล้ว ฟันไม่ผิดปกติ ตรวจกล้ามเนื้อ ขากรรไกรไม่ผิดปกติ แต่ปวดอยู่ถามปวดจากอะไร",
    "choices": [
      { "label": "A", "text": "Referred pain" },
      { "label": "B", "text": "Muscle pain" },
      { "label": "C", "text": "Psychogenic pain" },
      { "label": "D", "text": "Neuropathic pain" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยชายอายุ 70 ปี มาด้วยอาการปวดตื้อ ปวดมา 3 วัน ซี่ 14 เคยทำ pulp capping เมื่อ 3 ปี ก่อน ให้รูปในปากตรง vestibule ดูบวมเล็ก ๆ",
    "proposition": None
  },
  {
    "question_text": "61. จะรักษาซี่ 74 อย่างไร (ผุ d3 เกิน line angle ไม่เห็นรากละลาย ไม่เห็น FI)",
    "choices": [
      { "label": "A", "text": "Pulpectomy และ SSC" },
      { "label": "B", "text": "Pulpotomy และ SSC" },
      { "label": "C", "text": "Dycal และอุด amalgam" },
      { "label": "D", "text": "Partial pulpotomy และอุด GI" },
      { "label": "E", "text": "Direct pulp capping และอุด GI" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเด็กอายุ 5 ขวบ ปวดฟันซี่ 74 มา 2 วัน เวลาเคี้ยวอาหาร ซี่ 64 เคย pulpectomy + SSC ด้วย Vitapex ปัจจุบันไม่มีอาการ ผู้ป่วยทานอาหารว่างเกิน 3 ครั้งต่อวัน และแปรงฟันเองวันละ 2 ครั้ง",
    "proposition": None
  },
  {
    "question_text": "62. ซี่ 64 จะทำอย่างไร",
    "choices": [
      { "label": "A", "text": "Follow up ต่อทุก 6 เดือน" },
      { "label": "B", "text": "ถอนและติดเครื่องมือกันที่" },
      { "label": "C", "text": "ถอนและกำจัดวัสดุอุดเกิน" },
      { "label": "D", "text": "กำจัดวัสดุเกินด้วย curette" },
      { "label": "E", "text": "รื้อและอุดใหม่" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเด็กอายุ 5 ขวบ ปวดฟันซี่ 74 มา 2 วัน เวลาเคี้ยวอาหาร ซี่ 64 เคย pulpectomy + SSC ด้วย Vitapex ปัจจุบันไม่มีอาการ ผู้ป่วยทานอาหารว่างเกิน 3 ครั้งต่อวัน และแปรงฟันเองวันละ 2 ครั้ง",
    "proposition": None
  },
  {
    "question_text": "63. ปรับพฤติกรรมอย่างไร",
    "choices": [
      { "label": "A", "text": "จำกัดอาหารว่าง" },
      { "label": "B", "text": "สอนแปรงฟันด้วย modified bass" },
      { "label": "C", "text": "บ้วนปากด้วย chlorhexidine" },
      { "label": "D", "text": "บ้วนปากด้วย NaF" },
      { "label": "E", "text": "ยาสีฟัน 1000 ppm" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมสำหรับเด็ก",
    "task": "การสร้างเสริมสุขภาพและการป้องกัน",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วยเด็กอายุ 5 ขวบ ปวดฟันซี่ 74 มา 2 วัน เวลาเคี้ยวอาหาร ซี่ 64 เคย pulpectomy + SSC ด้วย Vitapex ปัจจุบันไม่มีอาการ ผู้ป่วยทานอาหารว่างเกิน 3 ครั้งต่อวัน และแปรงฟันเองวันละ 2 ครั้ง",
    "proposition": None
  },
  {
    "question_text": "64. Cavity 25OM เล็ก ๆ ใช้ adhesive อะไรดี",
    "choices": [
      { "label": "A", "text": "Etch & rinse adhesive" },
      { "label": "B", "text": "Two-step self etch adhesive" },
      { "label": "C", "text": "Universal adhesive with selective etching" },
      { "label": "D", "text": "Two-step… with selective etching?" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้ปวดฟันกรามล่าง มาด้วยเศษอาหารติดบริเวณฟันหลังบนขวา มีช่องว่างบริเวณฟันหลัง (ประมาณว่ามีถอนฟันหลัง แต่จุดที่จะบูรณะไม่มีติดช่องว่างนะ แล้วให้รูปเอกเรย์มาด้วย ซี่ 25 ดูเป็นหลุมฟันแตกด้าน mesial เอกเรย์ดูไม่ลึก 35 ดูสึกคอฟันกว้าง สูง แต่สึกอยู่ซี่เดียว 16 ดูผุ OD ลึก แต่ไม่ขึ้นมาทาง O เยอะ แล้วก็ดูลงไปใต้เหงือก ดูลงไปราก)",
    "proposition": None
  },
  {
    "question_text": "65. ถ้าอุด ต้องใช้วัสดุอุดที่มีคุณสมบัติอะไร",
    "choices": [
      { "label": "A", "text": "Shear strength" },
      { "label": "B", "text": "Toughness" },
      { "label": "C", "text": "Wear resistance" },
      { "label": "D", "text": "Materism" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้ปวดฟันกรามล่าง มาด้วยเศษอาหารติดบริเวณฟันหลังบนขวา มีช่องว่างบริเวณฟันหลัง (ประมาณว่ามีถอนฟันหลัง แต่จุดที่จะบูรณะไม่มีติดช่องว่างนะ แล้วให้รูปเอกเรย์มาด้วย ซี่ 25 ดูเป็นหลุมฟันแตกด้าน mesial เอกเรย์ดูไม่ลึก 35 ดูสึกคอฟันกว้าง สูง แต่สึกอยู่ซี่เดียว 16 ดูผุ OD ลึก แต่ไม่ขึ้นมาทาง O เยอะ แล้วก็ดูลงไปใต้เหงือก ดูลงไปราก)",
    "proposition": None
  },
  {
    "question_text": "66. ถ้าอุด 16 จะเตรียม cavity และใช้ adhesive อะไร",
    "choices": [
      { "label": "A", "text": "GI + self etch adhesive" },
      { "label": "B", "text": "Ca(OH)2 + self etch adhesive" },
      { "label": "C", "text": "Ca(OH)2 + etch and rinse adhesive" },
      { "label": "D", "text": "Ca(OH)2 + GI + etch and rinse adhesive" },
      { "label": "E", "text": "Ca(OH)2 + GI + self etch adhesive" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้ปวดฟันกรามล่าง มาด้วยเศษอาหารติดบริเวณฟันหลังบนขวา มีช่องว่างบริเวณฟันหลัง (ประมาณว่ามีถอนฟันหลัง แต่จุดที่จะบูรณะไม่มีติดช่องว่างนะ แล้วให้รูปเอกเรย์มาด้วย ซี่ 25 ดูเป็นหลุมฟันแตกด้าน mesial เอกเรย์ดูไม่ลึก 35 ดูสึกคอฟันกว้าง สูง แต่สึกอยู่ซี่เดียว 16 ดูผุ OD ลึก แต่ไม่ขึ้นมาทาง O เยอะ แล้วก็ดูลงไปใต้เหงือก ดูลงไปราก)",
    "proposition": None
  },
  {
    "question_text": "67. ซี่ 45 ผุถึง inner 1/3 dentin remove caries แบบใด",
    "choices": [
      { "label": "A", "text": "Selective caries removal to soft dentin" },
      { "label": "B", "text": "Selective caries removal to firm dentin" },
      { "label": "C", "text": "Non Selective caries removal to hard dentin" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้ปวดฟันกรามล่าง มาด้วยเศษอาหารติดบริเวณฟันหลังบนขวา มีช่องว่างบริเวณฟันหลัง (ประมาณว่ามีถอนฟันหลัง แต่จุดที่จะบูรณะไม่มีติดช่องว่างนะ แล้วให้รูปเอกเรย์มาด้วย ซี่ 25 ดูเป็นหลุมฟันแตกด้าน mesial เอกเรย์ดูไม่ลึก 35 ดูสึกคอฟันกว้าง สูง แต่สึกอยู่ซี่เดียว 16 ดูผุ OD ลึก แต่ไม่ขึ้นมาทาง O เยอะ แล้วก็ดูลงไปใต้เหงือก ดูลงไปราก)",
    "proposition": None
  },
  {
    "question_text": "68. 34 วัสดุอุดเป็นดังภาพ เกิดจากอะไร (รูป)",
    "choices": [
      { "label": "A", "text": "อุดไม่เต็ม" },
      { "label": "B", "text": "Secondary caries" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้ปวดฟันกรามล่าง มาด้วยเศษอาหารติดบริเวณฟันหลังบนขวา มีช่องว่างบริเวณฟันหลัง (ประมาณว่ามีถอนฟันหลัง แต่จุดที่จะบูรณะไม่มีติดช่องว่างนะ แล้วให้รูปเอกเรย์มาด้วย ซี่ 25 ดูเป็นหลุมฟันแตกด้าน mesial เอกเรย์ดูไม่ลึก 35 ดูสึกคอฟันกว้าง สูง แต่สึกอยู่ซี่เดียว 16 ดูผุ OD ลึก แต่ไม่ขึ้นมาทาง O เยอะ แล้วก็ดูลงไปใต้เหงือก ดูลงไปราก)",
    "proposition": None
  },
  {
    "question_text": "69. จะรักษาราก ซี่ 34 ควรทำอะไรก่อน",
    "choices": [
      { "label": "A", "text": "Remove composite and caries" },
      { "label": "B", "text": "แก้ occlusion" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้ปวดฟันกรามล่าง มาด้วยเศษอาหารติดบริเวณฟันหลังบนขวา มีช่องว่างบริเวณฟันหลัง (ประมาณว่ามีถอนฟันหลัง แต่จุดที่จะบูรณะไม่มีติดช่องว่างนะ แล้วให้รูปเอกเรย์มาด้วย ซี่ 25 ดูเป็นหลุมฟันแตกด้าน mesial เอกเรย์ดูไม่ลึก 35 ดูสึกคอฟันกว้าง สูง แต่สึกอยู่ซี่เดียว 16 ดูผุ OD ลึก แต่ไม่ขึ้นมาทาง O เยอะ แล้วก็ดูลงไปใต้เหงือก ดูลงไปราก)",
    "proposition": None
  },
  {
    "question_text": "70. รักษารอยโรคในปากยังไง",
    "choices": [
      { "label": "A", "text": "Antifungal medication" },
      { "label": "B", "text": "Antibiotic medication" },
      { "label": "C", "text": "Topical steroid" },
      { "label": "D", "text": "Smoking cessation" },
      { "label": "E", "text": "Drug abuse consultation" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คุณป้าอายุ 50 กลางๆ ปลายๆ โรคประจำตัวความดันโลหิตสูง มีอาการแสบร้อนในช่องปากเวลาทานอาหารเผ็ด ให้รูปมาเป็น lesion ในช่องปาก สีขาวปนแดง (whickham’s striae) ที่ buccal mucosa ซ้าย, vestibule ล่างขาวมีรอยแดง, free gingival ด้าน palate ซี่ 5-6 มีแผล erosion แดงแจ๋ ฟันหายซี่ 27, 36,37,46,47 17 เป็น full metal crown สวยๆ +ฟิล์ม full mouth 37,47 มี furcation involvement แต่ซี่ 38,48 bone เหลือประมาณครึ่งรากได้ bone level ทั้งปากไม่น่าเกลียด",
    "proposition": None
  },
  {
    "question_text": "71. ถ้าจะทำฟันปลอมต้องประเมินอะไรในการวางแผน",
    "choices": [
      { "label": "A", "text": "Crown : root ratio of abutment" },
      { "label": "B", "text": "Golden porportion" },
      { "label": "C", "text": "ถอนฟันซี่ 47 เพราะมี furcation involvement" },
      { "label": "D", "text": "Frankfort horizontal plane" },
      { "label": "E", "text": "Combination syndrome" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมประดิษฐ์",
    "task": "การจัดการและการรักษาผู้ป่วย",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คุณป้าอายุ 50 กลางๆ ปลายๆ โรคประจำตัวความดันโลหิตสูง มีอาการแสบร้อนในช่องปากเวลาทานอาหารเผ็ด ให้รูปมาเป็น lesion ในช่องปาก สีขาวปนแดง (whickham’s striae) ที่ buccal mucosa ซ้าย, vestibule ล่างขาวมีรอยแดง, free gingival ด้าน palate ซี่ 5-6 มีแผล erosion แดงแจ๋ ฟันหายซี่ 27, 36,37,46,47 17 เป็น full metal crown สวยๆ +ฟิล์ม full mouth 37,47 มี furcation involvement แต่ซี่ 38,48 bone เหลือประมาณครึ่งรากได้ bone level ทั้งปากไม่น่าเกลียด",
    "proposition": None
  },
  {
    "question_text": "72. ถอน 47 เพราะมี furcation involvement (เห็นในfilm) ซักอะไรเพิ่มเติม ที่จะเกี่ยวกับรอยโรคในปาก",
    "choices": [
      { "label": "A", "text": "ยาที่ใช้รักษาโรคทางระบบ" },
      { "label": "B", "text": "Smoking" },
      { "label": "C", "text": "ยาเสพติด" },
      { "label": "D", "text": "Alcohol consumption" },
      { "label": "E", "text": "ประวัติเพศสัมพันธ์" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คุณป้าอายุ 50 กลางๆ ปลายๆ โรคประจำตัวความดันโลหิตสูง มีอาการแสบร้อนในช่องปากเวลาทานอาหารเผ็ด ให้รูปมาเป็น lesion ในช่องปาก สีขาวปนแดง (whickham’s striae) ที่ buccal mucosa ซ้าย, vestibule ล่างขาวมีรอยแดง, free gingival ด้าน palate ซี่ 5-6 มีแผล erosion แดงแจ๋ ฟันหายซี่ 27, 36,37,46,47 17 เป็น full metal crown สวยๆ +ฟิล์ม full mouth 37,47 มี furcation involvement แต่ซี่ 38,48 bone เหลือประมาณครึ่งรากได้ bone level ทั้งปากไม่น่าเกลียด",
    "proposition": None
  },
  {
    "question_text": "73. ถ่ายภาพรังสีอะไรเพิ่มเติม",
    "choices": [
      { "label": "A", "text": "Occlusal Crossectional" },
      { "label": "B", "text": "Periapical shift tube" },
      { "label": "C", "text": "Lateral oblique view" },
      { "label": "D", "text": "Periapical mandibular" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ชายอายุ 50 ปี บวมที่เหงือกฟันหน้ามา 2 ปี (มั้ง) ไม่ปวด ให้ภาพถ่ายเหงือกบวมแดงใหญ่ที่ vestibule ฟันหน้าล่างประมาณซี่ 32-41 (คล้ายภาพด้านล่าง แต่บวมนูนกว่า) และดู เป็นสีม่วงกลม ๆ แถว 31-32 - ให้ภาพ pano : เงาดำกลม 1 วงที่ปลายราก 33-35 (ภาพ lesion ในปากกับใน pano ตำแหน่งไม่ตรงกัน) ดูเหมือนมี เงาขาวอยู่ในเงาดำอะ แต่ไม่ใช่ขาวแบบก้อนกลม (ไม่แน่ใจอะ อาจจะเป็นที่ film) - ให้ภาพ peri : ภาพระหว่าง 32/33 ซี่ 32 ล้มหา 33 ปลายราก 33 ไม่เป็น radiolucent ดูเป็น radiopaque จางๆ คล้าย bone ทั่วไป crestal bone 32/33 trabecular bone แปลกๆเหมือนรูดำๆฟองๆ",
    "proposition": None
  },
  {
    "question_text": "74. อ่านภาพรังสี",
    "choices": [
      { "label": "A", "text": "Mixed radiolucent-radiopaque" },
      { "label": "B", "text": "Unicystic radiolucent" },
      { "label": "C", "text": "Unicystic radiolucent with scallop border" },
      { "label": "D", "text": "Multilocular radiolucent" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ชายอายุ 50 ปี บวมที่เหงือกฟันหน้ามา 2 ปี (มั้ง) ไม่ปวด ให้ภาพถ่ายเหงือกบวมแดงใหญ่ที่ vestibule ฟันหน้าล่างประมาณซี่ 32-41 (คล้ายภาพด้านล่าง แต่บวมนูนกว่า) และดู เป็นสีม่วงกลม ๆ แถว 31-32 - ให้ภาพ pano : เงาดำกลม 1 วงที่ปลายราก 33-35 (ภาพ lesion ในปากกับใน pano ตำแหน่งไม่ตรงกัน) ดูเหมือนมี เงาขาวอยู่ในเงาดำอะ แต่ไม่ใช่ขาวแบบก้อนกลม (ไม่แน่ใจอะ อาจจะเป็นที่ film) - ให้ภาพ peri : ภาพระหว่าง 32/33 ซี่ 32 ล้มหา 33 ปลายราก 33 ไม่เป็น radiolucent ดูเป็น radiopaque จางๆ คล้าย bone ทั่วไป crestal bone 32/33 trabecular bone แปลกๆเหมือนรูดำๆฟองๆ",
    "proposition": None
  },
  {
    "question_text": "75. ให้การรักษายังไง",
    "choices": [
      { "label": "A", "text": "Enucleation" },
      { "label": "B", "text": "Marsupialization" },
      { "label": "C", "text": "Decompression" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ชายอายุ 50 ปี บวมที่เหงือกฟันหน้ามา 2 ปี (มั้ง) ไม่ปวด ให้ภาพถ่ายเหงือกบวมแดงใหญ่ที่ vestibule ฟันหน้าล่างประมาณซี่ 32-41 (คล้ายภาพด้านล่าง แต่บวมนูนกว่า) และดู เป็นสีม่วงกลม ๆ แถว 31-32 - ให้ภาพ pano : เงาดำกลม 1 วงที่ปลายราก 33-35 (ภาพ lesion ในปากกับใน pano ตำแหน่งไม่ตรงกัน) ดูเหมือนมี เงาขาวอยู่ในเงาดำอะ แต่ไม่ใช่ขาวแบบก้อนกลม (ไม่แน่ใจอะ อาจจะเป็นที่ film) - ให้ภาพ peri : ภาพระหว่าง 32/33 ซี่ 32 ล้มหา 33 ปลายราก 33 ไม่เป็น radiolucent ดูเป็น radiopaque จางๆ คล้าย bone ทั่วไป crestal bone 32/33 trabecular bone แปลกๆเหมือนรูดำๆฟองๆ",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 1 - 1. ควรตรวจอะไรเพิ่มเพื่อจะ diag และรักษา",
    "choices": [
      { "label": "A", "text": "ความมีชีวิตซี่ 37" },
      { "label": "B", "text": "กระดูกซี่ 37" },
      { "label": "C", "text": "ตำแหน่งฟันคู่สบตรงตำแหน่งนั้น(ประมาณนี้)" },
      { "label": "D", "text": "ขนาด" },
      { "label": "E", "text": "ความลึก" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้หญิงกลัวและวิตกกังวลมาก มีประวัติเป็นลมก่อนและหลังผ่าฟันคุด ให้รูปถ่ายในช่องปากเป็นแผลที่ buccal mucosa ตำแหน่ง distal ต่อซี่ 37 (รูปตำแหน่ง lesion ประมาณนี้แต่ขนาดเล็กกว่านี้), ให้ panoramic film มีฟันซี่ 18, 28 fully erupted, 38, 48 unseen in panoramic",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 1 - 2. ผู้ป่วยมีประวัติเป็นลมก่อนและหลังผ่า ต้องทำยังไง",
    "choices": [
      { "label": "A", "text": "LA" },
      { "label": "B", "text": "LA with topical anesthesia" },
      { "label": "C", "text": "GA" },
      { "label": "D", "text": "O2 inhalation" },
      { "label": "E", "text": "conscious sedation" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "การจัดการและการรักษาผู้ป่วย",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้หญิงกลัวและวิตกกังวลมาก มีประวัติเป็นลมก่อนและหลังผ่าฟันคุด ให้รูปถ่ายในช่องปากเป็นแผลที่ buccal mucosa ตำแหน่ง distal ต่อซี่ 37 (รูปตำแหน่ง lesion ประมาณนี้แต่ขนาดเล็กกว่านี้), ให้ panoramic film มีฟันซี่ 18, 28 fully erupted, 38, 48 unseen in panoramic",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 1 - 3. สาเหตุที่ทำให้แผลด้านหลังซี่ 37 ไม่หายคืออะไร",
    "choices": [
      { "label": "A", "text": "ตำแหน่งของฟันซี่ 28" },
      { "label": "B", "text": "ความลึกแผล" },
      { "label": "C", "text": "ความยาวแผล" }
    ],
    "correct_answer": None,
    "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "task": "การเกิดและการดำเนินโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้หญิงกลัวและวิตกกังวลมาก มีประวัติเป็นลมก่อนและหลังผ่าฟันคุด ให้รูปถ่ายในช่องปากเป็นแผลที่ buccal mucosa ตำแหน่ง distal ต่อซี่ 37 (รูปตำแหน่ง lesion ประมาณนี้แต่ขนาดเล็กกว่านี้), ให้ panoramic film มีฟันซี่ 18, 28 fully erupted, 38, 48 unseen in panoramic",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 1 - 4. พึ่งผ่า 38 แล้วชาริมฝีปาก ประเมิณการชายังไง",
    "choices": [
      { "label": "A", "text": "2 point discrimination" },
      { "label": "B", "text": "EPT" },
      { "label": "C", "text": "pressure stimulation test" },
      { "label": "D", "text": "LA" }
    ],
    "correct_answer": None,
    "category": "ศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "คนไข้หญิงกลัวและวิตกกังวลมาก มีประวัติเป็นลมก่อนและหลังผ่าฟันคุด ให้รูปถ่ายในช่องปากเป็นแผลที่ buccal mucosa ตำแหน่ง distal ต่อซี่ 37 (รูปตำแหน่ง lesion ประมาณนี้แต่ขนาดเล็กกว่านี้), ให้ panoramic film มีฟันซี่ 18, 28 fully erupted, 38, 48 unseen in panoramic",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 2 - 1. Ottawa charter ชุมชนอะไรสักอย่าง",
    "choices": [
      { "label": "A", "text": "ความหมายสุขภาพ" },
      { "label": "B", "text": "กาย จิต สังคม จิตวิญญาณ + แบบสัมพันธ์(?)" },
      { "label": "C", "text": "กาย จิต สังคม ปัญญา + เป็นองค์รวม" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมชุมชน",
    "task": "การสร้างเสริมสุขภาพและการป้องกัน",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ชุนชนหนึ่ง ตรวจเลือดพบคน HIV มากกว่า30%",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 2 - 2. ทันตแพทย์จะส่งเสริมตามหลัก Ottawa ให้คนในชุมชนเข้าใจถึงผลจากการติดเชื้อยังไง",
    "choices": [
      { "label": "A", "text": "ให้ความรู้คนในชุมชนเกี่ยวกับ HIV เเละให้ความตระหนัก" },
      { "label": "B", "text": "ปรับสภาพเเวดล้อมผู้ติดเชื้อ" },
      { "label": "C", "text": "ให้ความรู้ผู้ติดเชื้อเเละญาติ" },
      { "label": "D", "text": "เป็นตัวกลางเชื่อมระหว่างองค์กร" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมชุมชน",
    "task": "การสร้างเสริมสุขภาพและการป้องกัน",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ชุนชนหนึ่ง ตรวจเลือดพบคน HIV มากกว่า30%",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 2 - 3. คุณจะใช้เครื่องมือไหนเพื่อทราบเกี่ยวกับภาพรวมของชุมชน วิถีชีวิต การรวมกลุ่มได้รวดเร็วที่สุด",
    "choices": [
      { "label": "A", "text": "แผนที่เดินดิน" },
      { "label": "B", "text": "ปฏิทินชุมชน" },
      { "label": "C", "text": "โครงสร้างองค์กร" },
      { "label": "D", "text": "ประวัติบุคคลสำคัญ" },
      { "label": "E", "text": "แผงผังครอบครัว" }
    ],
    "correct_answer": None,
    "category": "ทันตกรรมชุมชน",
    "task": "การวินิจฉัยโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ชุนชนหนึ่ง ตรวจเลือดพบคน HIV มากกว่า30%",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 3 - 1. สาเหตุที่เป็นปัจจัยส่งเสริมฟันผุบริเวณคอฟันของผู้ป่วยรายนี้",
    "choices": [
      { "label": "A", "text": "Hyposalivation" },
      { "label": "B", "text": "Improper restoration" },
      { "label": "C", "text": "Tobacco use" },
      { "label": "D", "text": "Acid food consumption" },
      { "label": "E", "text": "Medication" }
    ],
    "correct_answer": None,
    "category": "วิทยาหัตถการ",
    "task": "การเกิดและการดำเนินโรค",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วย อายุ 50ปี มาด้วยอาการปวดฟันบนซ้าย คอฟันหน้ามีสีดำ (เป็นเพราะขอบครอบฟันหน้าเป็น metal collar โผล่พ้นขอบเหงือก) ผู้ป่วยเป็นมะเร็งโพรงจมูก เคยสูบบุหรี่วันละ 1-2 มวนแต่ปัจจุบันเลิกสูบแล้ว เคยรับรังสีรักษา - รูปในช่องปาก: 35, 26, 36, 46 missing 22 RR, 23 RR with RCT 12, 11, 21 PFM (metal collar design) - X-ray Pa: 23 RR (previously treated RCT) 24 previously treated RCT with non metal-liked restoration พบ radiolucent lesion ใต้วัสดุอุดไปถึง gutta perchaใน canal ด้านบน แต่ยังไม่เห็น lesion ที่ปลายราก 25OM non metal-liked restoration with secondary caries with periapical lesion (ผุแบบในรูปแต่เป็นที่ฟันหน้าซี่ 12-22)",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 3 - 2. ขั้นตอนแรกในการรักษาฟันซี่ 25",
    "choices": [
      { "label": "A", "text": "Apply orthodontic band" },
      { "label": "B", "text": "Access opening" },
      { "label": "C", "text": "Occlusal adjustment" },
      { "label": "D", "text": "Scaling" },
      { "label": "E", "text": "Remove old restoration and temporary wall" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วย อายุ 50ปี มาด้วยอาการปวดฟันบนซ้าย คอฟันหน้ามีสีดำ (เป็นเพราะขอบครอบฟันหน้าเป็น metal collar โผล่พ้นขอบเหงือก) ผู้ป่วยเป็นมะเร็งโพรงจมูก เคยสูบบุหรี่วันละ 1-2 มวนแต่ปัจจุบันเลิกสูบแล้ว เคยรับรังสีรักษา - รูปในช่องปาก: 35, 26, 36, 46 missing 22 RR, 23 RR with RCT 12, 11, 21 PFM (metal collar design) - X-ray Pa: 23 RR (previously treated RCT) 24 previously treated RCT with non metal-liked restoration พบ radiolucent lesion ใต้วัสดุอุดไปถึง gutta perchaใน canal ด้านบน แต่ยังไม่เห็น lesion ที่ปลายราก 25OM non metal-liked restoration with secondary caries with periapical lesion (ผุแบบในรูปแต่เป็นที่ฟันหน้าซี่ 12-22)",
    "proposition": None
  },
  {
    "question_text": "STEM ปริศนา 3 - 3. จะใช้อะไรในการรื้อฟันซี่ 24 ที่รักษารากมาแล้ว",
    "choices": [
      { "label": "A", "text": "Gates glidden drill + xyrol" },
      { "label": "B", "text": "H-file + xyrol" },
      { "label": "C", "text": "K-file + chloroform" },
      { "label": "D", "text": "K-file + eucalyptol" },
      { "label": "E", "text": "Long shank steel bur + eucalyptol" }
    ],
    "correct_answer": None,
    "category": "วิทยาเอ็นโดดอนต์",
    "task": "ขั้นตอนและวิธีการรักษา",
    "explanation": None,
    "image_paths": [],
    "source_exam": "NL2-2567 Part 4",
    "stem": "ผู้ป่วย อายุ 50ปี มาด้วยอาการปวดฟันบนซ้าย คอฟันหน้ามีสีดำ (เป็นเพราะขอบครอบฟันหน้าเป็น metal collar โผล่พ้นขอบเหงือก) ผู้ป่วยเป็นมะเร็งโพรงจมูก เคยสูบบุหรี่วันละ 1-2 มวนแต่ปัจจุบันเลิกสูบแล้ว เคยรับรังสีรักษา - รูปในช่องปาก: 35, 26, 36, 46 missing 22 RR, 23 RR with RCT 12, 11, 21 PFM (metal collar design) - X-ray Pa: 23 RR (previously treated RCT) 24 previously treated RCT with non metal-liked restoration พบ radiolucent lesion ใต้วัสดุอุดไปถึง gutta perchaใน canal ด้านบน แต่ยังไม่เห็น lesion ที่ปลายราก 25OM non metal-liked restoration with secondary caries with periapical lesion (ผุแบบในรูปแต่เป็นที่ฟันหน้าซี่ 12-22)",
    "proposition": None
  }
]

file_path = '/Users/admin/Downloads/NL Test/parsed_exams/NL2_2567_Part_4.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['questions'].extend(new_data)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Appended {len(new_data)} questions.")
