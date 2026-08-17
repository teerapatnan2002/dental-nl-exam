import json
import re

text = """
Academic affairs, Dental Student Association of Thailand 2022
รวมขอ้ สอบประเมนิ ความรูภ้ าควทิ ยาคลินกิ ทันตกรรม ครงั ที 1/2566
NL 2 Part 1 วนั เสารท์ ี 14 มกราคม 2566 13:35 - 15:20 น.
STEM 1
คนไข้ชาย อายุ 19 ปปวดเหงือกฟน กรามล่างซา้ยมา 5 วนั ใหร้ ปู ในชอ่ งปากมารปู เดยี วเปน เหงือกคลมุ distal marginal
ridge 37 surrounding gingiva is slightly red มลีกู ศรสเีหลืองชีoperculum ( cover Distal half of 37O ) ดู
เหลืองๆ เขา้ใจวา่ เปน หนอง มขีอ้ ความในโจทยบ์ อกถ่าย xray มี38 impaction แต่ไมไ่ ดใ้หร้ ปู x-ray มา
1. ถามวา่ เกิดจากอะไร
1. Bacterial infection
2. Viral infection
3. Fungal infection
4. Eruption pressure
5. Autoimmune mechanism
2. Diagnosis
1. Pericoronitis
2. Acute apical abscess
3. Chronic apical abscess
4. Periodontal abscess
5. necrotizing ulcerative gingivitis
3. Tx
1. 38 Surgical removal
2. Antibiotic and analgesic drug
3. Irrigate
4. Gingivectomy
5.
STEM 2
มภี าพในปาก กับ pa 16 RCT มาแล้ว (รากใกล้sinus) 1ปOM Amalgam filling leak at distal wall มีChief
complaint ปวด เคาะ คลําเจบ็
4. Complication ext 16
1. oroantral communication
2. Root fracture
3.
4.
5.
5. ทําไมเคาะเจบ็ คลําเจบ็ 16
1. เกิดการอักเสบภายในคลองราก สง่ ผา่ น post sup alveolar n.
2. เกิดการอักเสบภายนอกคลองราก สง่ ผา่ น post sup alveolar n.
3. เกิดการอักเสบภายในคลองราก สง่ ผา่ น mid sup alveolar n.
4. เกิดการอักเสบภายในคลองราก สง่ ผา่ น facial nerve
5. เกิดการอักเสบภายนอกคลองราก สง่ ผา่ น facial nerve
6. อะไรเปน ปจจยั สาํ คัญทีสดุ ทีต้องทําใหร้ กั ษาใหม่
1. อุดไมแ่ นน่
2. Amalgam filling leak
3. คนไขอ้ ยากทําครอบ
4. คนไขม้ อี าการ
5. อุดสนั
STEM 3
ใหร้ ปู ฟน ปลอมคนไข้CD มรีอยขดี ขว่ น ด้านๆ แบนๆ ทีดา้น labial ของ flange หลังจากใหฟ้ น ปลอมคนไขไ้ป นดั มา 1st
recheck
7. เกิดจากอะไร
1. คนไขไ้มถ่ อดฟน ปลอมแชน่ าํ
2. คนไขเ้อาฟน ปลอมไปแช่ H2O2
3. คนไขเ้อาฟน ปลอมไปขดั กระดาษทราย
4. คนไขก้ ัดของแขง็
5. คนไขแ้ ปรงด้วยแปรงแรงเกินไป
8. คนไขบ้ น่ วา่ แก้มและปากรสู้ กึ อูมมาก เกิดจากอะไร
1. Flange เกิน
2. เวา้ frenum ผดิ
3. OVD เกิน
4. เรยีง canine มา buccal มากเกินไป
5. เรยีงฟน ตกสนั ridge
9. ขดั แก้ใหค้ นไขย้ งัไง
1. กรอหวั silicon impregnated with silicon particle สเีขยี ว สดี าํ ไขววั
2. กรอหวั silicon impregnated with silicon particle สขี าว กรอหวัผา้ กับไขววั
3. กรอด้วย stone เขยี ว ขาว หวัผา้ ไขววั
4. ขดั กระดาษทรายหยาบ กระดาษทรายละเอียด pumice ไขววั
5. กระดาษทรายละเอียด tungsten carbide เขยี ว ไขววั
STEM 4
คนไขม้ าด้วยฟน หลังล่างโยก ฟน ปลอมเก่าหลวม ใหร้ ปู ฟน ดา้น occlusal บนล่าง ฟน บนเหลือแค่ 25,26 ซี 25,26 เปน pfm
crown + ให้OPG ทีฟน ล่างมซี ี 8 ทัง 2 ฝง มีpremolar-premolar ดูbone loss เยอะๆ (เหลือ bone ประมาณ 25%)
10. มรีปู แยกในปากด้านหนา้ บอกวา่ ซี 34 ด้าน buccal จะอุดใหม่ ใหร้ ปู class V ขอบเยนิ ๆ มา ถามวา่ ถ้าใช้universal
adhesives ทําอยา่ งไร
1. ทาสารยดึ ติดหลายชนั
2. ทาสารยดึ ติดชนั แรกแล้วเปา ทาสารยดึ ติดรอบสองแล้วเปา
3. ทา phosphoric acid ที cavosurface 40 วแิล้วล้าง แล้วทาสารยดึ ติด
4. ทา phosphoric acid ที occlusal margin ล้างนาํ เปา แล้วทาสารยดึ ติด
5. ทา acidic primer แล้วเปา ลม แล้วทาสารยดึ ติด
11. ถ้าต้องถอน 25, 26 หลังถอนต้องประเมนิ อะไรก่อนใสฟ่ น ปลอม
1. ประเมนิ soft tissue ก่อน
2. ประเมนิ buccal keratinized ซี 25,26
3. reline ด้วย tissue conditioner
4. ถ่าย Panoramic เพอืดูTMJ
5. หาตําแหนง่ upper canine ใหต้ รงกับ lower canine ทีหมุน
12. ควรทําอะไรเปน อยา่ งแรก เพอื วางแผนในการทําฟน ปลอม
1. Filling 25,26
2. Periodontal consultation
3. ถอน 38,48
4. Transitional denture
5. Occlusal adjustment
STEM 5
จากการสาํ รวจสขุ ภาพชอ่ งปากของประชากรอายุ 35-44 ปพบวา่ มปี ระชากร 18% สบู บุหรี10.4 มวน/วนั และ 9.5% ของ
คนทีสบู บุหรกี ล่มุ นีสบู บุหรมี ากกวา่ 20.1 pack/year
13. ควรตรวจประเมนิ ประชากรกล่มุ นเีรอืงใดจงึจะเหมาะสม
1. ตรวจ bleeding on probing
2. ตรวจเนอื เยอือ่อน ลินและรมิฝปาก
3. ตรวจประเมนิ ฟน ผุ
4. ตรวจประเมนิ พฤติกรรมการบรโิภคนาํ ตาล
5. ถ่ายภาพ bite-wing
14. โครงการทีจะชว่ ยลดปรมิ าณคนทีสบู บุรีตามแนวทาง Oral health through life course
1. เพมิ บทลงโทษใหค้ นทีสบู บุหรใีนทีทํางาน
2. จดั ตัง สายด่วนสาํ หรบั คนอยากเลิกบุหรี
3. ใหค้ วามรด้ ู้ านสขุ ภาพเพอืลดจาํ นวนนกั สบู หนา้ใหมท่ ีเปน นกั เรยีน
4. เปด ใหส้ นทนาเพอื ใหเ้กิดแรงจูงใจในการเลิกบุหรใีนสถานพยาบาล
5. ชว่ ยผทู้ ีอยากเลิกบุหรด้ ี วยยา
15. ถ้าอยากศึกษาความสมั พนั ธร์ ะหวา่ งการสบู บุหรกี ับโรคทางชอ่ งปาก ควรเลือกใช้study แบบใด
1. Descriptive study
2. Qualitative study
3. Experimental study
4. Cohort study
5. Retrospective study
STEM 6
หญงิ 30 ปกิน Prednisolone มาผา่ ฟน คดุ 38 (symptomatic irreversible pulpitis with symptomatic apical
periodontitis) ผา่ แล้วรากหกั ใหร้ ปู X-ray, CBCT (ในฟล ์มเหน็ วา่ หกั เขา้ Lingual pouch)
16. ระวงั ภาวะแทรกซอ้ นอะไรมากทีสดุ
1. Fascial space infection
2. Prolong bleeding
3. Delayed wound healing
4. Emphysema
5. Drug interaction ระหวา่ งยาทีทานกับยาชา
17. รากหลดุ เขา้ไปในไหน (CT เหน็ หลดุ เขา้ lingual pouch)
1. Lingual pouch
2. Bottom of socket
3. Lingual canal
4. Inferior alveolar canal
5. Beneath periosteum
18. ควรทําการรกั ษาอยา่ งไรต่อไป
1. เปด lingual flap เอาออก
2. Observe + antibiotic
3. Extend buccal flap
4. Root tip pick + cryer elevator พยายามเอาออก
5. เยบ็ ปด ปกติ
STEM 7
ผญอายุ 20 กวา่ ๆ มเีสยี งคลิกด้านขวา อ้าได้45 mm เจบ็ หนา้หขู วา คลํากล้ามเนอื ไมเ่ จบ็
19. ผปู้ ว ยอ้าปากเปน อยา่ งไร
1. Straight
2. Rt deviation
3. Lt deviation
4. Rt deflection
5. Lt deflection
20. ถ้าคนไขต้ ้องการแก้เสยี งคลิก ต้องรกั ษาอยา่ งไร
1. Pivot splint
2. Anterior repositioning splint
3. Soft splint
4. Stabilization appliance
5. Anteiror bite plane
21. ใหร้ ปู ฟน คนไข้ถามวา่ เปน malocclusionแบบใด
1. Class l
2. Class ll division 1
3. Class ll division 1 subdivision Rt
4. Class ll division 2
5. Class lll
STEM 8
หญงิ ปวดขากรรไกร มาสามวนั หลังจากเคียวของแขง็ เจบ็ masseter
22. ตรวจอะไรเพมิ
1. Probing depth ฟน หลังขวาบนล่าง
2. Salivary flow rate
3. ระยะอ้าปาก
4. คลําต่อมนาํ เหลืองใต้คาง
5. คลําเหงือกด้านแก้ม
23. สาเหตุ
1. Condylar neck fracture
2. Coronoid process fracture
3. Articular disc displacement
4. Bifid condyle
5.
24. Condyle ถกู ดึงรงั มาด้านหนา้ โดยกล้ามเนอื อะไร
1. Medial pterygoid
2. Lateral pterygoid
3. Mentalis
4. Buccinator
5. Masseter
STEM 9
ผปู้ ว ยหญงิ อายุ 50 ปเปน prehypertension ทานยารกั ษาอาการนอนไมห่ ลับ แปรงฟน ยาสฟี น สมุนไพรไมม่ ฟี ลอู อไรด์
รปู ในปากมอีุด proximal มีX-ray proximal ผเุยอะ ๆ secondary caries เยอะ ๆ
25. แนะนาํ OHI
1. แปรงสฟี น ไฟฟา
2. ขนนมุ่
3. ใช้floss
4. ยาสฟี น ทีมไีตรโคซาน
5. Chlorhexidine mouthwash
26. จะบูรณะ amalgam ต้องเบสด้านไหน (เปน ซี 46 O-AF ล้ม mesially มผี ุmesial เพมิ ลึกใกล้pulp)
1. Axial wall
2. Occlusal wall
3. Buccal wall
4. Lingual wall
5. Distal wall
27. สาเหตทุ ีคนไขค้ นนเีปน high caries
1. มอีุด interproximal มากกวา่ 1 ตําแหนง่
2. กินยา antidepressant
3. ใชย้ าสฟี น ไมม่ ฟี ลอู อไรด์มีproximal restoration มากกวา่ 1 ตําแหนง่
4. ดืมนาํ อัดลมระหวา่ งมอื
5. ฟน หลังบนหาย
STEM 10
คนไขช้ าย 40 ปฟน เทียมหลดุ ทํามาเปน 10 ปแ ล้ว
จากรปู : ติงเนอืปลายลินขนาด 3 มม ผวิกับสเีหมอืนเนอืปกติ+ รปู ฟน เทียม
28. ถ้าต้องทําใหมค่ นไขต้ ้องการแขง็ แรงและสวยงามจะทําอะไร
1. PFM bridge
2. Zirconia bridge
3. Lithium disilicate bridge
4. Partial removable denture
5. Valplast
29. ฟน เทียมหลดุ เพราะอะไร
1. Metal wings อ้า เนอืงจากเปน ปกติของฟน เทียมชนดินี
2. Metal wings หกั
3. Metal wings ไมโ่ อบรอบฟน
4. Fail จาก resin cement
5. ZOE cement ละลาย
30. จดั การกับติงเนอื อยา่ งไร
1. Surgical excision
2. Punch biopsy
3. Incisional biopsy
4. Apply steroid
5. Cytologic smear
STEM 11
คนไข้Pseudo class III ใหภ้ าพ ICP สบ anterior crossbite ในบางซี ซ1ี 2,22 ดูdiscoloration ใหภ้ าพ CR สบ edge
to edge มีcanine ขวา เปน ฟน นาํ นม (ไมบ่ อกวา่ เคย trauma/ hx. of RCT ไมม่ ีx-ray)
31. ถ้าจะทําใหเ้ขยี วขวาสวยเหมอืนอีกขา้งจะทําไง
1. Veneer
2. Porcelain Crown
3. Acrylic crown
4. All ceramic crown
5. Direct composite restoration
32. ถ้าผปู้ ว ยไมพ่ อใจกับสฟี น จะใหก้ ารรกั ษาอยา่ งไร (ไมไ่ ดบ้ อกวา่ ซไี หน)
1. Vital bleaching
2. Non-vital bleaching 12 22
3. Veneer 12 22
4. Veneer 13-23 33-43
5.
33. ถ้าจะถอน canine แล้วปก implant ต้องสง่ ตรวจอะไรก่อน
1. Pano ดตู ําแหนง่ 13
2. CBCT ดปู รมิ าณกระดกู B-Li
3. Periapical เพอืดคู วามยาวรากของ 53
4. ตรวจ keratinized gingiva
5.
STEM 12
ผปู้ ว ยหญงิ อายุ 20 ปปวดกรามล่างขวา 47 ผุOB ใหญ่ pocket depth=7 mm ฟล ์ม 48 คดุ มาชนซี 7 ละ Pano ซอี ืนก็
ดไูม่ bone loss
34. Remove caries แล้ว exposed pulp ทํายงัไง
1. Pulpo
2. Pulpect
3. Direct pulp cap
4. Indirect pulp cap
5. RCT
35. Overall prognosis perio
1. Good
2. Fair
3. Poor
4. Favorable
5.
36. หลังผา่ impact เกิดอาการชา หายใน 3 wk ถามวา่ บาดเจบ็ nerve แบบไหน
1. Neurapraxia
2. Axonotmesis
3. Neurotmesis
4. Transient …
5.
STEM 13
ใหร้ ปู clinic กับ films มา ขอ้ มูลในภาพ X-ray (ทีอ่านเอง)
Missing 51,52
21 Fully erupted ปลายรากดเูปด นดิ นงึ
11 Unerupted root resorption ใกล้ถึงขอบ
crestal bone ประมาณ 1 mm horizontal root
resorption ถึงระดับ coronal ⅓ , lamina dura
maybe intact trace ได้รอบฟน , ฟน หมุน, crown
size ปกติรากปด แล้ว
12 Unerupted root resorption ใกล้ถึงขอบ
crestal bone ประมาณ 1 mm horizontal root
resorption ถึงระดับ middle ⅓ (ปลายรากเปด แต่ฟน
ไมไ่ ด้ยาวเท่า lat incisor) , lamina dura maybe
intact trace ได้รอบฟน , ตําแหนง่ ฟน อยูส่ งู กวา่ 11
เล็กนอ้ ย
13 normal
ขอ้ มูลในภาพ (อ่านเอง)
6 บน 6 ล่างขนึ ครบ
No ant. Crossbite, No post crossbite
Space เพยี งพอ 11,21 ขนึ
เด็กอายุ 9 ปสขุ ภาพแขง็ แรง (11, 12 ไมข่ นึ ) มรีปู คลินกิ กับ periapical film มา 11 หมุน torsiversion รากสนั ประมาณ
1/4 ซี 12 รากสนั ประมาณ ½ แต่ 21 รากยาวปกติ
37. เมอืถ่ายฟล ์มมุมอืนแล้วพบวา่ รากยาวเหมอืนทีเหน็ ในรปู แรก Proper treatment คือ?
1. 11,12 Extraction
2. 11 SR 12 artificial eruption
3. 11,12 Gingivectomy, observe
4. 11,12 Artificial eruption
5. 11,12 Observe
38. การทีฟน ซี 11, 12 ไมข่ นึ เกิดจาก
1. Early loss of deciduous tooth
2. Genetics
3. Thick mucosal barrier
4. Trauma จากฟน นาํ นม
5. Ankylosis
39. จะจดั ฟน ต้องใหอ้ ะไรไปใชท้ ีบา้น
1. 38% SDF
2. 5000 ppm Fluoride toothpaste
3. 0.05% naf mw
4. 1.23% APF gel
5. 5% NaF varnish
STEM 14
ผปู้ ว ยอายุ 60 ปเปน DM มา 10 ปตรวจ FBS 1 เดอืนทีแล้ว 156 mg/dl สบู บุหรี10 มวนต่อวนั
40. ให้film Pa มีซี 46 ผุมีbone loss จะเหน็ วา่ มีfurcation involvement ระดบั 3
(ถ้าจาํ ไมผ่ ดิ จะมีspacing กับ 45) ถามวา่ ถ้าจะบูรณะใหเ้หลือเนอืฟน มากทีสดุ และใชว้ สั ดทุ ี
เหมาะสมทีสดุ ใชอ้ ะไร
1. 46 M amalgam
2. 46 M resin composite
3. 46 M GIC
4. 46 OM resin composite
5. 46 OM GIC
41. เปลียนแผนเปน ถอนซี 46 แล้ว M root ดันแตกตามรอยแตกเดมิ ใน x-ray (ใต้bone นดิ ๆ) ถามวา่ ใชเ้ครอืงมอือะไร
เอาออก
1. เปด flap ด้านแก้มและกรอกระดกู ชว่ ยเพอื เอาออก
2. ใช้root forcep คีบออก
3. ใช้root tip elevator
4. ใช้dental luxator
5. ไมต่ ้องเอาออก
42. ให้Diagnosis Perio (ใหภ้ าพแค่ x-ray, คลินกิ )มบี อกวา่ ซี 35 2nd degree MO และต้องถอนเพมิ มา
(generalized bone loss > 75%)
1. IIIA
2. IIIB
3. IIIC
4. IVB
5. IVC
STEM 15
ผปู้ ว ยชาย จะทําฟน เทียมบน-ล่าง มอี าการแสบปากมา 1 เดอืน ใหป้ ระวตั ิวา่ เพงิ เปลียนยาสฟี น กับนาํ ยาบว้ นปากมาไมน่ าน ใน
รปู ทีเหงือกเหน็ สแีดงๆ ตามเหงือก แล้วมลี ายขาวๆ แซม รปู ประมาณนแี ต่อยูท่ ีฟน หนา้ล่าง
43. รอยโรคทีพบทีเหงือก คือ อะไร
1. Desquamative gingivitis
2. Pseudomembranous candidiasis
3.
4.
5.
44. Floor of mouth วดั ได้ลึก 8 mm จะออกแบบ major connector RPD ล่างแบบใด
1. Lingual bar
2. Lingual plate
3. Labial bar
4. Continuous bar
5. Cingulum plate
45.
STEM 16
คนไขช้ ายอายุ 45 ปไมม่ โีรคประจาํ ตัว ใชส้ ทิ ธบิ ตั รทอง มาหาทันตแพทยอ์ ยากใสฟ่ น เทียม
ใหร้ ปู 34-36 missing มีtorus mandibularis ใหญม่ ากๆ 2 ฝง โดยมสีภาพเหงือกอักเสบและหนิ ปูนทัว ไปดงั ภาพ ภาพ
ฟน หนา้สบแบบ deep bite หนิ ปูน-เหงือกอักเสบนอ้ ย
รปู arch ล่าง ไรฟ้ น บรเิวณ 44-46 มีtorus mandibularis ทัง 2ขา้งซา้ย-ขวา ทางดา้น Li ขนาดใหญ่
46.เตรยีมชอ่ งปากก่อนทําฟน ปลอมยงัไง
1. Torectomy
2. Apical position flap
3. Frenectomy
4. Vestibuloplasty
5.
47.ถ้าทําการผา่ ตัดเพอื เตรยีมชอ่ งปากในการทําฟน ปลอมมา 1 สปั ดาห์OHI ยงัไง
1. แปรงด้วยแปรงขนนมุ่ พเิศษ
2. บว้ น Chlorhexidine mouthrinse
3. Charter technique
4. Circular scrub technique
5. แผน่ ยางนวดเหงือก
48.ถ้าผปู้ ว ยเปลียนมาจะปก implant เพอื ใสฟ่ น ทดแทน จะทําอะไรรว่ มกับการสง่ CT
1. Torectomy, set occlusal plan , diagnostic wax up
2. Alveoloplasty, set occlusal plane , diagnostic wax up
3. วดั PD ซี 33, 37 , set occlusal plane, diagnostic wax up
4. วดั ความหนาเหงือก, occlusal plane, facebow
5. วดั ความหนาเหงือก, occlusal plane, diagnostic wax up
STEM 17
PA film: 46 85 (M scoop-like at DEJ) 84 (OD scoop-like at D3)
Clinic: 84OD cavity 85M ยงัไมม่ ีcavity
49. จะทํา 84,85 ใส่ clamp ไง
1. ใส่ clamp no 2A ที 85
2. ใส่ clamp no 4A ที 46
3. ใส่ clamp no 14 ที 85
4. ใส่ clamp no 8A ที 46
5. ใส่ clamp no 4A ที 85
50. ฟน ซี 85 จะพจิารณาการทําหตั ถการทีเหมาะสมไดอ้ ยา่ งไร
1. ใช้Caries detector dye
2. Diagnodent
3. แยกยาง 2-3 วนั
4. ดตู อนกรอเปด 84
5. เหน็ ใน film
51. ต้องแนะนาํ อะไรเด็กคนนี
1. อยา่ กินจุบจบิ เกิน 2 ครงั
2. ใช้floss หลังแปรงฟน
3. เคียวหมาฝรงั xylitol
4. กินขนม xylitol แทน
5. Chlorhexidine MW
STEM 18
ผปู้ ว ยชาย ปวด 24 เปน canine space infection เปน โรคไต stage 4 เบาหวาน BT 37.3 BP140/90 FBS 350
HbA1C ทานยา metformin, enalapril
52. สามารถติดเชอื space ใดได้อีก
1. Infratemporal space
2. Pterygomandibular space
3. Superficial temporal space
4. Palatal space
5. Buccal space
53. ทําไมต้องแอดมดิ คนไข้
1. Space infection
2. Control systemic disease
3. ต้องใหส้ ารนาํ
4.
5.
54. แอดมดิ แล้วต้องเขยี นคําสงั ไรเพมิ ใน order for continuation
1. จา่ ย Clindamycin 600 IV
2. ถ่าย Panoramic radiograph
3. CBC
4. ตรวจ Electrolyte
5. จา่ ย Morphine IV
STEM 19
ผปู้ ว ยชาย 50 ปรปู คลินกิ 12,22 palatoversion สคี ลํากวา่ ซอี ืน ฟน ล่างซี 31 -ve EPT, 41 +ve EPT แต่ +ve
percussion ทัง คู่CAL 2-4 mm (ซี 12, 22 crossbite สเีปน สเีทา, 31, 41 horizontal bone loss ประมาณ 75%,
gingival margin อยูป่ ระมาณ CEJ)
55. Prognosis ซี 31
1. Good
2. Fair
3. Poor
4. Questionable
5. Hopeless
56. วธิจีดั การเบอื งต้นซี 31
1. Open access, incision and drain
2. LA, incision and drain
3. Open and drain
4. Occlusal adjustment
5. Analgesic and antibiotic
57.
STEM 20
ผปู้ ว ยชาย อายุ 50 ปไมม่ อี าการ มาตรวจสขุ ภาพฟน พบทางคลินกิ และรงัสดี งั ภาพ (ใหภ้ าพมุมกัด buccal, lingual
bridge 35-37 pontic ทรงเหมอืนจะหลิมๆทกุ ด้าน ไมแ่ นใ่ จวา่ ลอยเหนอื เหงือกดว้ ยไหม เหน็ black triangle ใหญโ่ ต
ชดั เจน, รงัสใีหภ้ าพ periapical 37 bone loss with bone support ประมาณ 50% involved furcation นา่ จะ
through and through แต่ทางคลินกิ เหน็ ไมช่ ดั ปลายรากเปน radiopaqueๆ ไปหมด)
58. แนะนาํ ใหค้ นไขใ้ชอ้ ุปกรณอ์ ะไรเพมิ เติม
1. Interproximal brush
2. End-tufted brush
3. Waterpik
4. Toothpick
5. Electric toothbrush
59. ใชอ้ ะไรตรวจ 37 เพมิ
1. EPT
2. Endo ice
3. Naber probe
4. Fibre Optic light
5. Tooth slooth
60. Pontic แบบนมี ขีอ้ ดียงัไง
1. สวย
2. ทําความสะอาดง่าย
3. ซอ่ বহুমแซมง่าย
4. ใชว้ สั ดนุ อ้ ย
5. ราคาถกู
STEM 21
รปู คลินกิ
- ซี 74 ผุOD (~ICDAS 5) บางคนบอกวา่ เลย line angle/บางคนบอกวา่ ยงัไมเ่ ลย
- ซี 75 ผุOM (~ICDAS 5) เคาะเจบ็
รปู Periapical film Q7
- ซี 74 ผุOD D3 nearly exposed pulp
- ซี 75 ผุOM D3 exposed pulp
61. ถาม treatment ซี 74
1. Direct pulp capping
2. CF
3. SSC
4. Pulpotomy
5.
62. ถาม treatment ซี 75
1. 1-visit pulpectomy
2. 2-visit pulpectomy
3. Formocresol Pulpotomy
4. Interim Therapeutic Restoration
5.
63.
STEM 22
ผปู้ ว ยชายจาํ อายุไมไ่ ด้ได้กลินเหมน็ ในชอ่ งปาก 6 เดอืน พบฟน ซี 36 เคยทํา RCT และ PFM 12 ปก ่อน ไมม่ อี าการ ชอบกัด
ขบฟน แนน่ ให้Pa เหน็ J shape
64. ขอ้ ใดสามารถปอ งกันการเกิดพยาธสิภาพดังกล่าวได้
1. Crown with light occlusal contact
2. Occlusal splint
3. Zirconia
4. Prep crown ใหเ้พยี งพอ
5.
65. Diag ซี 36
1. Split tooth
2. Vertical root fx
3. Incomplete root canal treatment
4. Secondary caries
5. Endo-perio lesion
66. ถ้าจะทํา implant ต้องซกั ประวตั ิอะไรเพมิ
1. Medical history/ smoking/ parafunctional habit
2. Choice อืนๆก็สลับๆกันไป มตี รวจ HbA1c, salivary ไรงี
3.
4.
5.
STEM 23
ผปู้ ว ยหญงิ อายุ 20 ป, ANB -4 SN-MP 20 ใหร้ ปู anterior crossbite at ICP, openbite at CR, 13 microdontia
1. รปู แคปชนั ICP anterior cross bite 2. รปู แคปชนั CR: edge to edge 3. รปู intraoral upper arch
ทกุ รปู โชว์13 microdontia ฟน ไมไ่ ด้crowding เรยีงตัวดี
หารปู ทีมีmicrodontia ใหไ้มไ่ ด้ใสร่ ปู ตอน cr ไวใ้ห้
67. วนิ จิฉัย discrepancies ANB =-2 (norm 2-4) , SN-MP=40 (norm: 28-36 จาํ ตัวนไีมค่ ่อยได)้
1. Skeletal I, hyperdivergent
2. Skeletal I, normodivergent
3. Skeletal III, hyperdivergent
4. Skeletal III, normodivergent
5. Skeletal III, hypodivergent
68. ถ้าจะถอน 13 ทํา implant ต้องสง่ ตรวจอะไรเพมิ
1. Cephalogram
2. Lateral cept
3. CBCT
4. OPG
69. ถ้าต้องการบูรณะ ซี 13 ทําอะไร
1. Veneer
2. Porcelain crown
3. Acrylic crown
4. Resin composite filling
5. zirconia crown
STEM 24
เด็กชาย 4 ขวบ ปฏิเสธโรคประจาํ ตัว และการแพย้ าแพอ้ าหาร มาพบทันตแพทยค์ รงั แรก ปวดฟน กรามบนซา้ยมากเวลาเคียว
อาหารและตอนกลางคืน ใหร้ ปู clinic และ x-ray พบรากปกติไมr่ esorp ใหร้ ปู bw มา ผุproximal กรามนาํ นม ใหร้ ปู ฟน ผุ
75OD,85OD ภาพxray พบวา่ 75D Radiolucent area involve pulp chamber
70. จงวนิ จิฉัยฟน ซ7ี 5
1. Irreversible pulpitis with symptomatic apical periodontitis
2. Irreversible pulpitis with asymptomatic apical periodontitis
3. Irreversible pulpitis with chronic apical abscess
4. Pulp necrosis with asymptomatic apical periodontitis
5. Pulp necrosis with symptomatic apical periodontitis
71. ถ้าเด็ก 80% ของสถานเลียงเด็กสภาพชอ่ งปากเหมอืนผปู้ ว ยรายนีควรทําอยา่ งไรเปน อันดบั แรก
1. การเขา้ถึงบรกิ ารทางทันตกรรม
2. การมสี ว่ นรว่ มของผอ.ศูนย์
3. สอนผปู้ กครองแปรงฟน
4. แปรงฟน หลังอาหารกลางวนั
5. ลดดืมนมรสหวาน
72. ซี 75 treatment อยา่ งไร
1. Pulpectomy + SSC
2. Extraction
3. Pulpotomy + SSC
4. Pulpectomy
5. GIC
STEM 25
เด็ก 12 ปใหร้ ปู ในชอ่ งปาก มี54 OD AF เล็กๆ, 74 OD ผุMD width < 1/3 (เล็กๆ), ทีเหลือดูsound, (ไมไ่ ่ดใ้ห้x-ray
มา), upper anterior crowding (mild-moderate) ซีCDE ทัง บนล่าง, ฟน แท้ซี 1,2,6
73. แปรงฟน แบบใด
1. Modified Bass technique
2. Modified Stillman technique
3. Charter technique
4. Fone technique
5. Horizontal scrub technique
74. ให้F- เสรมิแบบใด
1. F- MW daily
2. F- MW daily + F- Gel 2ครงั /ป
3. F- MW daily + F- supplement
4. F- Gel 2ครงั /ป
5. F- Gel 2ครงั /ป+ F- supplement
75. สาเหตทุ ี permanent 1st molar class II end on end เปน class I
1. Leeway space
2. Interdental space
3. Prolong ของ 2nd primary molar
4. Early loss K9
5. Early loss —
"""

lines = text.strip().split('\n')

questions = []
current_q = None
q_num = 1
choices = []

def assign_category(text):
    text = text.lower()
    if any(k in text for k in ["torus", "surgery", "impact", "ext ", "extraction", "ผ่า", "ถอน", "space infection", "forcep", "flap", "cyst", "tumor"]):
        return "ศัลยศาสตร์ช่องปาก", "ขั้นตอนและวิธีการรักษา"
    if any(k in text for k in ["rct", "pulp", "endo", "canal", "pulpotomy", "pulpectomy"]):
        return "วิทยาเอ็นโดดอนต์", "ขั้นตอนและวิธีการรักษา"
    if any(k in text for k in ["perio", "probing", "pocket", "bone loss", "gingiva"]):
        return "ปริทันตวิทยา", "การวินิจฉัยโรค"
    if any(k in text for k in ["ortho", "crossbite", "crowding", "anb", "malocclusion", "sn-mp"]):
        return "ทันตกรรมจัดฟัน", "การวินิจฉัยโรค"
    if any(k in text for k in ["denture", "cd", "rpd", "bridge", "pontic", "implant", "crown", "ฟันเทียม", "ฟันปลอม", "pfm", "zirconia"]):
        return "ทันตกรรมประดิษฐ์", "การจัดการและการรักษาผู้ป่วย"
    if any(k in text for k in ["caries", "filling", "composite", "amalgam", "adhesives", "class v", "margin", "sealant"]):
        return "ทันตกรรมบูรณะ/หัตถการ", "ขั้นตอนและวิธีการรักษา"
    if any(k in text for k in ["pediatric", "เด็ก", "ขวบ", "ฟันน้ำนม", "primary molar"]):
        return "ทันตกรรมสำหรับเด็ก", "การจัดการและการรักษาผู้ป่วย"
    if any(k in text for k in ["community", "ohis", "fluoride", "ohi", "แปรงฟัน", "สูบบุหรี่", "health", "ppm"]):
        return "ทันตกรรมชุมชน", "การสร้างเสริมสุขภาพและการป้องกัน"
    if any(k in text for k in ["คลิก", "splint", "ปวดขากรรไกร", "tmj", "condyle", "occlusal splint"]):
        return "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า", "การวินิจฉัยโรค"
    if any(k in text for k in ["lesion", "แสบปาก", "รอยโรค", "candidiasis", "erythema"]):
        return "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การวินิจฉัยโรค"
    return "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การวินิจฉัยโรค"

def get_label(i):
    return chr(ord('A') + i)

q_text = ""
q_id = None
in_choices = False

for line in lines:
    line = line.strip()
    if not line: continue
    
    # Check if line is a question header e.g. "1. ถามว่าเกิดจากอะไร"
    m = re.match(r'^(\d+)\.\s+(.*)$', line)
    if m and not in_choices and int(m.group(1)) >= q_num:
        # Save previous question if exists
        if current_q:
            cat, task = assign_category(current_q['question_text'])
            current_q['category'] = cat
            current_q['task'] = task
            current_q['choices'] = [
                {"label": get_label(i), "text": c[1]} for i, c in enumerate(choices) if c[1]
            ]
            current_q['source_exam'] = "NL 2 2566 part 1.pdf"
            if current_q['choices'] or current_q['question_text']:
                questions.append(current_q)
        
        q_num = int(m.group(1))
        q_text = m.group(2)
        current_q = {
            "question_text": str(q_num) + ". " + q_text,
            "choices": [],
            "correct_answer": None,
            "category": "",
            "task": "",
            "explanation": None,
            "image_paths": []
        }
        choices = []
        in_choices = True
        continue
    
    if in_choices:
        m2 = re.match(r'^([1-5])\.\s*(.*)$', line)
        if m2:
            choices.append((m2.group(1), m2.group(2)))
            if m2.group(1) == '5':
                in_choices = False
        else:
            if line.startswith("STEM") or re.match(r'^\d+\.\s+.*', line) and not line.startswith("1.") and not line.startswith("2.") and not line.startswith("3.") and not line.startswith("4.") and not line.startswith("5."):
                in_choices = False
            else:
                pass

if current_q:
    cat, task = assign_category(current_q['question_text'])
    current_q['category'] = cat
    current_q['task'] = task
    current_q['choices'] = [
        {"label": get_label(i), "text": c[1]} for i, c in enumerate(choices) if c[1]
    ]
    current_q['source_exam'] = "NL 2 2566 part 1.pdf"
    if current_q['choices']:
        questions.append(current_q)

# Validate categories with schema
valid_cats = [
    "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    "ศัลยศาสตร์ช่องปาก", "ปริทันตวิทยา", "ทันตกรรมบูรณะ/หัตถการ", "วิทยาเอ็นโดดอนต์",
    "ทันตกรรมประดิษฐ์", "ทันตกรรมจัดฟัน", "ทันตกรรมสำหรับเด็ก", "ทันตกรรมชุมชน"
]
valid_tasks = [
    "การสร้างเสริมสุขภาพและการป้องกัน", "การเกิดและการดำเนินโรค", "การวินิจฉัยโรค",
    "การจัดการและการรักษาผู้ป่วย", "ขั้นตอนและวิธีการรักษา"
]

for q in questions:
    if q["category"] not in valid_cats: q["category"] = valid_cats[0]
    if q["task"] not in valid_tasks: q["task"] = valid_tasks[0]

out_obj = {"questions": questions}

# Write raw JSON to standard output to capture and save via write_to_file
import sys
json.dump(out_obj, sys.stdout, ensure_ascii=False, indent=2)
