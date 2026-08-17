import json
import re

text = """STEM 1
เด็ก 3 ขวบ ให้ภาพ 51 extrusion เทียบซี่ข้างๆประมาณ 3-4 มม. ริมฝีปากล่างแตก ร้องไห้ดิ้น ไม่ยอมให้หมอตรวจ
1. รักษายังไง
1. extraction
2. reposition and soft diet
3. reposition and splint 7-14 day
4. reposition and splint 1 month
5. reposition and rigid splint 1 month
2. จัดการเด็กยังไง
1. parent absence
2. passive stabilization
3. voice control
4. tell show do
5. Active stabilization 
3. ถ้าผู้ปกครองแจ้งว่าเกิดจากครูพี่เลี้ยงเป็นคนทำให้เกิดการบาดเจ็บ ทันตแพทย์ต้องเขียนในใบรับรองแพทย์ว่าอย่างไร
1. การบาดเจ็บมีสาเหตุจากการกระทำรุนแรงของครูพี่เลี้ยง
2. การบาดเจ็บมีสาเหตุจากเครื่องเล่นในโรงเรียน
3. การบาดเจ็บมีสาเหตุจากการกระทำรุนแรงของครูพี่เลี้ยงหรือเครื่องเล่นในโรงเรียน
4. ผู้ปกครองเชื่อว่าการกระทำรุนแรงของครูพี่เลี้ยงส่งผลให้เกิดการบาดเจ็บบริเวณฟันหน้าและริมฝีปากบน
5. เกิดการบาดเจ็บบริเวณฟันหน้าและริมฝีปากบน
STEM 2 
ทันตแพทย์และทันตภิบาล 2 คน ดูแลนักเรียนประถม 800 คน ทำกิจกรรม เคลือบ F varnish ทุก 6 เดือน sealant 
ในฟันกรามแท้ทุกซี่ ให้ความรู้เรื่องการแปรงฟันและการรับประทานอาหารที่มีประโยชน์มาเป็นระยะเวลา 3 ปี ทุกระดับชั้น 
ทุกห้อง แต่มีฟันผุรายซี่เกิดใหม่ 30%
4. ขาดการดำเนินการตามหลักสร้างเสริมสุขภาพใด
1. ค่านิยม ทัศนคติ
2. การมีส่วนร่วม
3. สร้างมาตรฐานการตรวจฟัน
4. ระบบบริการสุขภาพ
5. สร้างความตระหนัก
5. ฟันผุรายซี่เกิดใหม่ 30% เป็นการรายงานโดยใช้ค่าระบาดวิทยาอะไร
1. Incidence rate
2. Prevalence rate
3. Prevalence risk
4. odd ratio
5. relative risk
6. ปัจจัยป้องกันฟันผุอะไรที่ยังไม่ได้ทำ
1. พฤติกรรมการบริโภคน้ำตาล
2. การมีส่วนร่วมของผู้บริหาร
3. สร้างความตระหนักในการดูแลสุขภาพช่องปาก
4. การประเมินผลหลังการสอนแปรงฟัน
5. นโยบายจัดหาแก้วน้ำในการแปรงฟัน
STEM 3 
ผู้ป่วยอายุ 30 ปี มาด้วยอาการปวดบวมที่ซี่ 38 อ้าปากได้ 2.5 cm. ตรวจพบ 38 buccoversion ขึ้นได้บางส่วน operculum 
ด้าน buccal & distal บวมแดง จะปวดมากขึ้นเมื่อกัดสบฟัน และ 28 ผุขนาดใหญ่ โจทย์ให้รูป x-ray periapical 38 มา
7. ที่บอกว่าบวมแก้มหลังต่อมุมปาก แปลว่าติดเชื้อเข้าspaceไหน
1. Buccal
2. Parotid
3. submental
4. Lateral pharyngeal
5. Submasseteric
8. การจัดการเบื้องต้น
1. ให้ ibuprofen
2. ถอนฟัน 28 ให้ abx 
3. บ้วน CHX
4. ทำ 38 coronectomy
5. Surgical removal 38
9.เกิดจากเชื้ออะไร
1. bacteroides
2. streptococcus mutans
3. staphylococcus 
4. lactobacilli
5. actinomyces
STEM 4
ผู้ป่วยเพศหญิงอายุ 4 ปี มาตรวจสุขภาพช่องปากประจำปี ไม่มีอาการ ให้รูปในช่องปาก บน -ล่าง (ไม่มีรูปที่ฟันสบกัน และ 
xray bw มารูปดูไม่ค่อยออกแต่ว่า missing 51, 61 เป็น RR แล้วฟันชิดกัน (คิดว่าไม่มี primate space) ฟันล่างดูรวมๆ 
ไม่มีซี่ที่ cavitated ขึ้นครบทุกซี่
Xray 54OD caries expose มีรอยโรคละ, 74M,O,D caries M1/3
10. Management 74
1. Indirect pulp + SSC
2. RMGIC
3. SSC
4. Pulpotomy + SSC
5. Pulpotomy + CF
11. Management 54
1. AF
2. GIC
3. Indirect pulp + SSC
4. SSC
5. Pulpectomy + SSC
12. ดูจากการเรียงฟันของฟันน้ำนม คิดว่าฟันแท้จะเป็นอย่างไร
1. Spacing
2. Crowding 
3. Crossbite
4. Deepbite
5. Openbite
STEM 5
ชายอายุ 50 ปี ฟันล่างโยก และมีอาการบวมที่แก้มด้านขวาหลังมุมปาก อ้าปากได้ 3 cm. มีลักษณะทางภาพรังสี แสดงดังนี้ 
ให้periapical film มา 2 film มี ซี่ 45 กับ 37,38
13. อาการบวมที่เเก้มด้านขวาหลังมุมปาก เกิดจากการติดเชื้อกระจายไป space ใด
1. Mental 
2. Buccal
3. parotic
4. submasseteric
5. lateral pterygomandibular
14. ลักษณะทางจุลชีววิทยา ของคลองรากฟันซี่ 37 คือข้อใด
1. เป็นการติดเชื้อที่มี aerobic bacteria เด่น
2. เป็นการติดเชื้อที่มี E.faecalis เด่น
3. เป็น mix infection ที่มี Streptococcus 
4. เป็น mix infection ที่มี Candida albicans
5. เป็น mix infection ที่อยู่ในรูป biofilm
15. จากภาพถ่ายรังสี 47 การรักษาที่เหมาะสมสำหรับผู้ป่วยรายนี้
1. Root canal treatment + coping
2. Crown lengthening + Root canal treatment + post core with crown
3. Orthodontic extrusion + Root canal treatment + post core with crown
4. Root canal treatment + post core with crown
5. Extraction
STEM 6
รูปประมาณนี้ แต่ของจริง 46,47 เป็นtemporary crown 
แสบร้อนกระพุงแก้มขวา 2 สัปดาห์ หลังจากทำครอบฟัน 46,47 (ให้พบมาพบว่ามีรอยแดงและขาวที่บริเวณbuccal
mucosa ที่เป็นตำแหน่งกัดสบฟันบนและล่าง)
16. ส่งตรวจอะไร
1. IgE / ESR 
2. ANA / CBC
3. Incisional biopsy / Skin patch
4. Biopsy / Fungal culture 
5. DIF / Neutrophil
17. เป็น hypersensitivity แบบไหน
1. autoimmune reaction
2. Delay type
3. antibody mediated hypersensitivity 
4. anaphylaxis hypersensitivity 
5. immune complex reaction
18. treatment plan
1. เปลี่ยนวัสดุครอบชั่วคราว แล้วประเมินอีกที
2. รอจนกว่าแผลจะหายสนิทแล้วค่อยรักษาต่อ
3. แก้overjet overbiteซี่45,46
4. ให้ยาต้านเชื้อราเพิ่ม
5. wide excision+mucosal graft
STEM 7
หญิง 20 ปี ฟัน 23 เปลี่ยนสี ตรวจในช่องปากไม่พบวัสดุอุดไม่พบพยาธิสภาพอะไรเลย ซักประวัติมีการจัดฟันเสร็จ 1 ปีแล้ว
19. หากต้องการฟอกสีฟันแบบ nonvital tooth bleaching(internal bleeching) จะต้องทำอย่างไรบ้าง
1. RCT, GI base
2. RCT, IRM base
3. RCT, zinc phosphate base
4. pulpectomy ,IRM
5. pulpectomy,cavit
20. ข้อมูลอะไรที่ควรทราบเพิ่มเติมเพื่อประกอบการวินิจฉัย 
1. EPT และ ถ่าย periapical view
2. peri X-ray
3. BW x-ray
4. ซักถามอาการ ถ่ายCBCT
5. ซักประวัติการได้รับอุบัติเหตุ และอาการปวด
21. ฟันเปลี่ยนสีเกิดจากอะไร
1. smoking
2. food colorant
3. intrapulpal hemorrhage
4. genetics
5. medication
STEM 8
ชาย 50 ปี เป็นโรคเบาหวาน ตรวจเลือด ได้ค่า HbA1C 6.5 % ไม่เคยมีประวัติการรักษาโรคปริทันต์มาก่อน (ให้ chart perio 
มาโดย BOP และ plaque พบทุกซี่ทุกด้าน มี furcation ซี่ 16,17,26,27 B/Li 37B และ 46Li โดยซี่เหล่านี้มี probing 
depth อยู่ช่วง 5-8 mm ในด้าน MB/ML/DB/DL พบ CEJ-GM -1 mm เฉพาะด้าน distal ซี่7 มี root caries ซี่ 11,21,22)
22. treatment
1. periodontal
2. endodontic
3. perio+endo
4. fluoride tx
5. perio+fluoride
23. Caries control รากฟันหน้าบน
1. resin composite
2. GIC
3. 3.compomer
4. ZOE
5. 5.modified ZOE
24. Diagnosis perio
1. Generalized aggressive periodontitis
2. Generalized chronic periodontitis with gingival recession
3. Generalized severe chronic periodontitis
4. Generalized gingivitis on reduced periodontium
5. gingival disease modified by DM
STEM 9
คนไข้อายุ 70 ปี ต้องการทำฟันปลอม ให้รูปในปากมาเป็น complete edentulous บนล่าง มี torus palatinus, torus 
mandibularis 
25. ประโยชน์ของการตัด torus mandibularis
1. เพิ่ม stabilityให้ denture
2. เพิ่ม supportให้ denture
3. เพิ่ม VD
4. เพิ่ม canine-canine width
5. เพิ่ม primary bearing area
26. วิธีการหาขอบเขตด้านท้ายของ CD บน ที่เหมาะสมที่สุด
1. Valsavar maneuver
2. ใช้ ball burnisher กด
3. ให้คนไข้พูด R เพื่อดูการสั่นของเพดานอ่อน
4. กระดกลิ้นแตะเพดานอ่อน
5. ตำแหน่งหน้าfovea 2mm.
27. การซักประวัติที่สำคัญก่อนทำ preprosthetic surgery
1. ประวัติการรักษาทางทันตกรรม
2. ประวัติโรคทางระบบและยา
3. ประวัติทางพันธุกรรม
4. ประวัติทางสังคมและพฤติกรรม
5. ประวัติการโตของtorusและระยะเวลาการมี torus
STEM 10 
ชาย 25 ปี ผุหลายซี่ เสียวฟันเล็กน้อยตอนดื่มน้ำเย็น/กินหวาน ปฏิเสธโรคประจำตัวการแพ้ยาแพ้อาหาร (ภาพผุหลายซี่ 
ปากดูแห้งหน่อยๆ มั้ง ฟันมีความ attrition หน่อยๆ)
28. ซักประวัติ/ประเมิณอะไรเพื่อช่วยวินิจฉัยโรคฟันผุ
1. sugar intake
2. drug/substrance use
3. smoking
4. parafunction
5. underlying systemic disease
29. ถ้าซี่ 12 mechanical pulp exposure จะ pulp protection ยังไง(ในภาพน่าจะ cl.IIIหรือIV)
1. ปิดด้วย CaOH ไม่เกิน 0.5+รองพื้น RMGI
2. ปิดด้วย CaOH ไม่เกิน 0.5+รองพื้น GIC
3. ปิดด้วย CaOH อย่างน้อย 1-1.5mm
4. ปิดด้วย modified ZOE ไม่เกิน 0.5 mm
5. รองพื้นด้วย ZOE ประมาณ 1 mm
30. ถ้าขอบลึกใต้เหงือกใช้สารห้ามเลือดอะไร
1. NaCl
2. Aluminium Cl
3. ferrous sulfate
4. tranexamic acid
5. glutaraldehyde
STEM 11
ผู้ป่วยอายุ 25 ปี มาด้วยอาการเสียวฟันเมื่อรับประทานอาหารเย็นและหวาน ไม่เคยปวดมาก่อน (ให้รูป frontal view)
31. pack cord ร่วมชุบอะไร
1. AlCl3
2. FeSO4
3. tranexamic acid
4. glutaraldehyde
5. sodium chloride
32. อะไรช่วยวินิจฉัยฟันผุ
1. sugar intake
2. drug use
3. underlying disease
4. parafunction habit
5. smoking
33. ต้องทำยังไงทำการกรอฟันผุซี่ 12 ออกแล้วเกิด mechanical exposed pulp 0.5mm วางแผนทำ pulp protection 
อย่างไร
1. ปิดด้วย calcium hydroxide หนาไม่เกิน 0.5 mm แล้วรองด้วย RMGIC
2. ปิดด้วย calcium hydroxide หนาไม่เกิน 0.5 mm แล้วรองด้วย conventional GI
3. ปิดด้วย calcium hydroxide หนาไม่น้อยกว่า 1-1.5 mm
4. ปิดด้วย zinc oxide eugenol หนา
5. รองด้วย modified zinc oxide eugenol หนา
STEM 12 
คนไข้เป็น 4 โรค มีเบาหวาน ไขมันในเลือดสูง ลมชัก ความดัน ให้ภาพเหงือกบวมทั้งปากและมีหินปูน
34. ยาที่ทำให้เกิดเหงือกบวม
1. cabarmazipine
2. dilantin
3. cepharosporin
4. metformin
5. simvastatin
35. ถ้า ddx จาก leukemia ตรวจอะไรเพิ่ม
1. WBC สูงขึ้น
2. pTT สูงขึ้น
3. CBC สูงขึ้น
4. PT สูงขึ้น
5. Bun/Cr ต่ำลง
36. สิ่งที่จะทำเป็นอันดับแรกใดการรักษาโรคเหงือกในผู้ป่วย 
1. consultแพทย์เกี่ยวกเบประจำตัว
2. ทพ.บอกให้หยุดยา + ScRp, ไม่มีช้อย ScRp อย่างเดียว
3. ให้ Antibiotics
4. surgical gingivectomy
5. periodontal surgery
STEM 13 
คนไข้มีตุ่มสีชมพู ผิวเรียบที่ labial mucosa of lower lip เคยเป็นแบบนี้เมื่อสองเดือนก่อนแล้วหายไปเองละก็บวมใหม่ 
ไม่รู้สึกเจ็บแต่รู้สึกรำคาญ ตอนนี้คนไข้จัดฟันแบบติดแน่นอยู่ คนไข้มีนิสัยชอบแปรงฟันแรง แปรงนาน 
ร่วมกับการใช้น้ำยาบ้วนปาก(ให้รูปฮิตโตนี้มาเป๊ะๆแต่รูปไม่ชัด ให้รูปคลินิกด้วย)
37. รอยโรคนี้คืออะไร
1. Mucocele
2. Irritation fibroma
3. Warts
4. ranula
5. papilloma
38. จะรักษายังไง
1. Total excisional
2. Gentle brush
3. Observe แล้วนัดมาดูอีกที 6 เดือน
4. change behavior
39. ป้องกันการเกิดซ้ำได้ยังไง
1. บอกให้เปลี่ยนนิสัยการแปรงฟัน
2. เปลี่ยนไปใช้น้ำยาบ้วนปากที่ไม่มีแอลกอฮอล์
3. ใช้ soft wax แปะเครื่องมือจัดฟันบริเวณรอยโรค
4. งดกินอาหารเปรี้ยวและรสจัด
5. เปลี่ยนabnormal habits
STEM 14 
หญิง 50 ปี มีรอยโรคลักษณะ desquamative gingivitis ภาพถ่าย intraoral ด้านขวา 
เห็นเป็นลักษณะเส้นสีแดงลายคล้ายเส้นเลือดตามขอบเหงือก ของฟันซี่ 13-16 และบริเวณ vestibule, ฟันล่าง 
พบรอยโรคลักษณะเดียวกันที่คอฟันซี่ 44
40. เกี่ยวข้องกับโรคอะไร
1. HIV
2. Hepatitis C
3. Crohns disease
4. DM
5. leukemia
41. clinical diagnosis 
1. erosive lichen planus 
2. recurrent apthous stomatitis
3. NUG
4. burning mouth syndrome
5. chemical burn
42. หลังฉีดยาชาเพื่อทำ incisional biopsy ไปได้ 3 นาที ผู้ป่วยมีอาการปากบวม ตาบวม หายใจลำบาก wheezing 
ความดันต่ำ ถามการรักษาเบื้องต้นที่เหมาะสมระหว่างรอส่งรพ.
1. sublingual nitroglycerine
2. supine position
3. chest compression
4. monitor BP
5. administration of epinephrine
STEM 15
ผู้ป่วยหญิงมาลองใส่ครอบฟันซี่ 25 ที่ทำมาครั้งแรก ให้ภาพมี loose contact ด้าน mesial, เหงือกมีเลือดออกซึมๆ, gingival 
margin ต่ำกว่าซี่ข้างๆ (ดูฟันมันสั้นจากเหงือกอะ)
43. ปรับสภาพผิวของครอบฟันซี่ 25 ที่มี palladium-based ก่อนทำการยึดครอบอย่างไร
1. Etch HF แล้วตามด้วย silane primer 
2. Etch HF แล้วตามด้วย sulfur-based primer
3. Etch H3PO4 แล้วตามด้วย phosphate-based primer
4. Blast ด้วย Al2O3 แล้วตามด้วย sulfur-based primer
5. Blast ด้วย Al2O3 แล้วตามด้วย phosphate-based primer
44. จากภาพดังกล่าวควรเช็คครอบฟันซี่ 25 อย่างไรก่อนเป็นอันดับแรก
1. Proximal ด้วย articulating paper
2. Contouor ด้วย explorer
3. Margin ด้วย explorer
4. Inner surface ด้วย disclosing silicone
5. Occlusion ด้วย shimstock
45. เตรียมเหงือกบริเวณซี่ 25 อย่างไรให้เกิดรูปแบบ positive architecture ของกระดูก
1. Connective tissue graft ร่วมกับ osteoplasty
2. Gingivectomy ร่วมกับ osteoplasty
3. Gingivotomy ร่วมกับ apically positioned flap
4. Osseous resection ร่วมกับ apically positioned flap
5. Osseous resection ร่วมกับ coronally positioned flap
STEM 16
ข่าวระบุว่า 'พบว่าร้อยละ 5 ของเด็กประถมปีที่ 6 โรงเรียนบ้านโนนไร่ พบฟันตกกระแบบสีขาวขุ่น 
เพราะได้รับนมฟลูออไรด์เป็นประจำมา 3 ปี จากโครงการนมฟลูออไรด์ในระดับประถมศึกษา'
46. จากสถานการณ์ตามข่าว มีความเป็นไปได้ตามหลักวิชาการในข้อใด
1. เป็นไปได้ เพราะได้รับนมฟลูออไรด์นานพอที่จะทำให้เกิดฟันตกกระ
2. เป็นไปได้ เพราะเด็กบางคนอาจได้รับฟลูออไรด์จากน้ำดื่มรวมกับการดื่มนมฟลูออไรด์
3. เป็นไปได้ เพราะเด็กอาจดื่มนมฟลูออไรด์เกินกว่าปริมาณที่แจก
4. เป็นไปไม่ได้ เพราะสำนักทันตสาธารณสุขมีการประเมินฟันตกกระทุกปี
5. เป็นไปไม่ได้ เพราะช่วงอายุที่ดื่มนม มีการสร้างชั้นเคลือบฟันของฟันถาวรเสร็จสิ้นแล้ว
47. สาเหตุที่เกิด
1. ฟันมี capping tip enamel ที่สมมาตรกันทั้งซ้ายและขวา
2. ได้รับฟลูออไรด์วานิชต่อเนื่อง
3. ดื่มน้ำบาดาลที่มีฟลูออไรด์สูงต่อเนื่อง
4. ได้รับยา tretacyclin ขณะที่มารดาตั้งครรภ์
5. มีประวัติ amelogenesis imperfecta ในครอบครัว
48. แนะนำอะไร
1. ใช้ยาสีฟันไม่มีฟลูออไรด์
2. ใช้ยาสีฟันที่มีฟลูออไรด์ 500 ppm
3. ใช้ยาสีฟันที่มีฟลูออไรด์ 1500 ppm
4. หลีกเลี่ยงแปรงฟันแบบไม่บ้วนปาก
5. ระวังการกลืนยาสีฟัน
STEM 17 
ผู้ป่วยชายอายุ 50 ปีมาด้วยครอบ pfm bridge 13 แตก ใส่ U/L RPD ภาพประกอบเป็น PFM bridge 13 
แตกเห็นโลหะที่ด้าน disto-incisal ของครอบ มี crossbite นิดหน่อยที่ซี่ 13 
49. เหงือกอักเสบที่ lower anterior bridge เกิดจากอะไร
1. MD width ไม่เพียงพอ
2. metal ไม่ดี
3. keratinized gingiva น้อย
4. high frenum attachment
5. Contact area กว้าง
50. Surface treatment เพิ่มแรงยึด mechanical ซี่ 13 ทำไงใน visit นั้น
1. Sandblast with Al2O3
2. Etch with Phosphoric
3. Etch with HF
4. Apply MDP
5. Apply Silane
51. สาเหตุที่ครอบแตก
1. cross bite
2. metal ไม่เหมาะสม
3. ความหนา porcelain น้อยไป
4. แรงจากตะขอ RPD
STEM 18 
ให้รูป cavity preparation จะอุด amalgam
52. ทำ retentive groove ตรงไหน
1. Axiobuccal and axiolingual lineangle
2. axio pulpal line angle
3. Axio gingival line angle
4. buccopulpal and linguopulpal
5. occlusomesial and occlusodistal line angle
53. เศษ Amalgam ที่เหลือกำจัดยังไง
1. ใส่ถุงแดงเอาไปเผา
2. ใส่ถุงแดงเอาไปฝังกลบ
3. แช่ใน hot distill water
4. แช่ใน radio fixation solution
5. แช่ NaOCl
54. ทันตแพทย์ไม่ได้ซักประวัติว่าผู้ป่วยแพ้ยาง ภายหลังการรักษา พบผื่นตามผิวที่สัมผัส RD รุนแรงจนนอนรพ. 3 คืน 
ผู้ป่วยสามารถกล่าวโทษทันตแพทย์เรื่องใดได้บ้าง
1. ประมาทละเมิด: พรบ. ความรับผิดทางละเมิดของเจ้าหน้าที่
2. การคุ้มครองผู้บริโภค: พรบ. คุ้มครองผู้บริโภค
3. เจตนาทำร้ายร่างกาย: ประมวลกฎหมายอาญา
4. มาตรฐานการรักษา: ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณฯ
5. คุณภาพวัสดุทันตกรรม: พรบ. สถานพยาบาล
STEM 19
ผู้ป่วย 50 ปี ฟันล่างหายซี่36 ฟันบนหายซี่ 16 17 , ซี่ 46 O Am filling ปวด เคาะเจ็บ คลำเจ็บ ฟิล์มมีรอยโรคปลายราก 
กินยา alendronate
55. ผู้ป่วยไม่ต้องการบูรณะฟัน จะถอนซี่46 ต้องซักประวัติอะไรเพิ่ม
1. ระยะเวลาและรูปแบบ alendronate
2. อุบัติเหตุล้มสะโพกแตก
3. ค่ามวลกระดูก
4. ทาน calcium เสริม
5. ความรุนแรงของโรคกระดูกพรุน
56. ถ้าทำ U/L RPD ต้องบูรณะ 46 ยังไง
1. fiber reinforced post and core with PFM crown
2. Co filling
3. Am filling
4. Cast post with ceremic onlay
5. amalgam filling
57. รักษาฉุกเฉิน 46 ยังไง
1. กรีดระบายหนอง, จ่ายแก้ปวดและ antibiotics
2. Irrigation, med with สำลีชุบ clove oil, temp filling
3. Irrigation, med with Ca(OH)2, temp filling
4. Irrigation, สำลีชุบ clove oil , อุดต่อครั้งถัดไป
5. จ่ายยาแก้ปวดและ antibiotics
STEM 20
ผป ญ 50 มีอาการแสบร้อนในช่องปากขณะรับประทานอาหารเผ็ด เป็นมา 1 เดือน มีโรคประจำตัว dm ht โรคไต 
ปฏิเสธการแพ้ยา ภาพในคลินิกเป็น wickham’s striae ตรงกระพุ้งแก้มทั้ง 2 ฝั่ง
58. รักษายังไง 
1. fluocinolone acetonide
2. famciclovir 
3. amoxicillin
4. metronidazole
5. nystatin
59. diag อะไร
1. oral lichen planus
2. leukoplakia
3. lupus erythematosus
4. frictional keratosis
5. candidiasis
60. ขณะฉีดยาชา ผู้ป่วย มีอาการกระสับกระส่าย เหงื่อออก หมดสติ ต้องทำยังไง
1. IV 50% dextrose
2. อมก้อนน้ำตาล
3. IV diazepam
4. ให้คนไข้หายใจโดยเอาถุงคลุมจมูกและปาก
5. IV epinephrine
STEM 21
ชายอายุ 50 ปี มาด้วยครอบฟันแตก ใส่ lower & upper RPD ให้ภาพทางคลินิกเเละภาพรังสีมา คือ ซี่ 13 PFM crown พบ 
ceramic แตก เห็น metal ข้างใต้ เป็นซี่ที่ติดสันเหงือกว่าง
61. ถ้าคนไข้ต้องการซ่อมด่วน มีธุระวันนี้ จะเพิ่มการยึดติดเชิงกล ควรทำอะไร
1. apply with phosphoric acid
2. apply with hydrofluoric acid
3. 3andblast with aluminium oxide particle
4. MDP primer
5. silane coupling agent
62. อะไรทำให้ bridge ฟันหน้าล่าง เหงือกอักเสบ (ในรูปคือbridge ฟันหน้าล่าง contact 
areaตั้งแต่ปลายincisalถึงขอบเหงือก)
1. m-d width
2. broad contact
3. keratinized tissue น้อย
4. high frenum attachment
63. สาเหตุที่เป็นปัญหาของผู้ป่วยคือข้อใด
1. Improper material selection
2. Improper porcelain space
3. Anterior crossbite
4. Excessive force from retentive arm of RPD
5. Short metal post
STEM 22 
เด็ก 5 ขวบ น้ำหนัก 20 kg ให้ภาพในช่องปากผุเยอะๆ
64. ถอนฟัน RR ฟันหน้าบน 4 ซี่ จ่ายยาอะไร
1. para 120mg/5ml 1 ช้อนชา
2. para 120mg/5ml 2 ช้อนชา
3. ibuprofen 100mg/5ml 2 ช้อนชา
4. ibuprofen 100mg/5ml 3ช้อนชา
5. tramadol 5mg/ml 1 ช้อนชา
65. คำแนะนำที่เหมาะสมในการดูแลช่องปาก
1. ทา fluoride varnish
2. ทา CPP-ACP ก่อนนอนทุกวัน
3. แปรงยาสีฟัน 500 ppm ก่อนนอนทุกวัน
4. ลดการบริโภคมื้ออาหาร
5. อมน้ำยาบ้วนปาก NaF ทุกวัน
66. สาเหตุเกิดจากอะไร
1. improper feeding
2. ได้รับFน้อยไป
3. genetics
4. mulnutrition
5. fluoride varnish
STEM 23 
เด็กอายุ 5 ปี มีภาพในช่องปากและ x-ray มาให้ พบว่าฟันซี่ 84 85 ผุขนาดใหญ่และลึกทางด้าน occlusal
67. X-ray ซี่ 84 ผุ distal nearly exposed pulp วิธีการจัดการที่เหมาะสมสำหรับซี่ 84
1. amalgam
2. SSC
3. indirect pulp with SSC
4. GIC
5. pulpectomy with SSC
68. จงให้การวินิจฉัยซี่ 84,85
(X-ray 84 ผุลึก nearly expose, 85 ผุ expose pulp)
1. 84,85 irreversible pulpitis
2. 84 deep dental caries, 85 irreversible pulpitis
3. 84 irreversible pulpitis, 85 pulp necrosis
4. 84 deep dental caries, 85 pulp necrosis
5. 84 reversible pulpitis, 85 irreversible pulpitis with apical periodontitis
69. หลังทำ 84 SSC 85 pulpect+SSC ไป2ปี กลับมาตรวจ ไม่มีอาการทางคลินิก 
(ให้รูป x ray มา 85 ทำ pulpectomy กับ ssc ไป ไม่มีพยาธิสภาพใดๆ แต่ขอบ SSC ไม่แนบ ซี่ 46 เลยไม่ขึ้น, 
ซี่ 84 ทำ SSC ไป ไม่มีพยาธิสภาพใดๆ แต่ขอบ SSC ไม่แนบ ไม่มีรอยผุหรือรอยโรคปลายราก ไม่เห็น root resorp) 
ถามว่าทำไรต่อ
1. ติดตามผลทุก 6 เดือน
2. รื้อครอบ 84
3. รื้อครอบ 85
4. ทำ pulpec 85 ใหม่
STEM 24 
ผู้ชายมีเหงือกอักเสบเล็กน้อย มีเลือดออกเวลาแปรงฟันบางครั้ง Probing depth 2-3 mm (รูป การสบฟัน canine 13 
สบระหว่าง embrassure 43,44 ลงพอดี เหงือกตรง 13 ร่นเยอะกว่าซี่ข้างเคียง)
70. การสบฟัน canine มี classification อย่างไร
1. cl.I
2. cl.II div 1
3. cl.III
4. cl.IV
5. unclassified
71. แนะนำให้แปรง canine บนอย่างไร
1. ไม่วางแปรงคร่อมฟัน canine
2. แปรงเฉพาะ Charter technique เท่านั้น
3. ใช้เฉพาะก๊อซทำความสะอาดเท่านั้น
4. ใช้แปรงสีฟันสำหรับเด็ก
5. ใช้แปรงที่มีขนแปรงน้อย
72. gingival type เป็นแบบใด
1. thick biotype
2. thin biotype
3. gummy biotype
4. hyperplastic
5. medium thick
STEM 25 
เพศหญิงอายุ 35 ปี เป็นพนักงานขายอยู่ห้างสรรพสินค้า มาด้วยอาการเสียวฟันหน้าบนด้านใน และต้องการทำให้ฟันสวยขึ้น 
มีประวัติทางการแพทย์ คือเป็น bulimia nervosa และชอบกินชานมไข่มุก (ให้รูปมาพบว่ามี erosion ด้าน palatal 
ของฟันหน้าบน และรูปฟันด้าน labial พบว่า gingival zenith ของซี่ 11 กับ 21 ไม่สมมาตรกัน หารูปได้ประมาณนี้)
 73. ถามว่าอาการเสียวฟัน เกิดจากอะไร 
1. 1.แรงที่กัดลงไปที่ long axis ของฟัน
2. เกิด secondary caries ที่ขอบของวัสดุ
3. ชอบกินของหวานเป็นประจำ
4. เกิดจากการสัมผัสของสารเคมีกรดที่ผิวฟัน
5. คนไข้ใช้ยาที่ส่งผลต่อ salivary flow rate
74. จะรักษาอาการเสียวฟันด้วยอะไร 
1. PFM 
2. All ceramic 
3. Direct composite 
4. Indirect composite veneer 
5. Indirect ceramic veneer 
75. กลไกการเสียวฟัน เกิดจากสมองส่วนไหน 
1. Pariatal cortex
2. Extrastriae cortex 
3. Somatosensory cortex
4. prefrontal cortex
5. inferior temporal cortex
"""

cat_map = {
    1: ("ทันตกรรมสำหรับเด็ก", "การจัดการและการรักษาผู้ป่วย"),
    2: ("ทันตกรรมสำหรับเด็ก", "การจัดการและการรักษาผู้ป่วย"),
    3: ("ทันตกรรมสำหรับเด็ก", "การวินิจฉัยโรค"),
    4: ("ทันตกรรมชุมชน", "การสร้างเสริมสุขภาพและการป้องกัน"),
    5: ("ทันตกรรมชุมชน", "การเกิดและการดำเนินโรค"),
    6: ("ทันตกรรมชุมชน", "การสร้างเสริมสุขภาพและการป้องกัน"),
    7: ("ศัลยศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    8: ("ศัลยศาสตร์ช่องปาก", "การจัดการและการรักษาผู้ป่วย"),
    9: ("ศัลยศาสตร์ช่องปาก", "การเกิดและการดำเนินโรค"),
    10: ("ทันตกรรมสำหรับเด็ก", "ขั้นตอนและวิธีการรักษา"),
    11: ("ทันตกรรมสำหรับเด็ก", "ขั้นตอนและวิธีการรักษา"),
    12: ("ทันตกรรมสำหรับเด็ก", "การเกิดและการดำเนินโรค"),
    13: ("ศัลยศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    14: ("วิทยาเอ็นโดดอนต์", "การเกิดและการดำเนินโรค"),
    15: ("ทันตกรรมประดิษฐ์", "การจัดการและการรักษาผู้ป่วย"),
    16: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    17: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การเกิดและการดำเนินโรค"),
    18: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การจัดการและการรักษาผู้ป่วย"),
    19: ("วิทยาเอ็นโดดอนต์", "ขั้นตอนและวิธีการรักษา"),
    20: ("วิทยาเอ็นโดดอนต์", "การวินิจฉัยโรค"),
    21: ("วิทยาเอ็นโดดอนต์", "การเกิดและการดำเนินโรค"),
    22: ("ปริทันตวิทยา", "การจัดการและการรักษาผู้ป่วย"),
    23: ("ทันตกรรมบูรณะ/หัตถการ", "ขั้นตอนและวิธีการรักษา"),
    24: ("ปริทันตวิทยา", "การวินิจฉัยโรค"),
    25: ("ทันตกรรมประดิษฐ์", "การจัดการและการรักษาผู้ป่วย"),
    26: ("ทันตกรรมประดิษฐ์", "ขั้นตอนและวิธีการรักษา"),
    27: ("ทันตกรรมประดิษฐ์", "การวินิจฉัยโรค"),
    28: ("ทันตกรรมบูรณะ/หัตถการ", "การวินิจฉัยโรค"),
    29: ("ทันตกรรมบูรณะ/หัตถการ", "ขั้นตอนและวิธีการรักษา"),
    30: ("ทันตกรรมบูรณะ/หัตถการ", "ขั้นตอนและวิธีการรักษา"),
    31: ("ทันตกรรมบูรณะ/หัตถการ", "ขั้นตอนและวิธีการรักษา"),
    32: ("ทันตกรรมบูรณะ/หัตถการ", "การวินิจฉัยโรค"),
    33: ("ทันตกรรมบูรณะ/หัตถการ", "ขั้นตอนและวิธีการรักษา"),
    34: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การเกิดและการดำเนินโรค"),
    35: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    36: ("ปริทันตวิทยา", "การจัดการและการรักษาผู้ป่วย"),
    37: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    38: ("ศัลยศาสตร์ช่องปาก", "การจัดการและการรักษาผู้ป่วย"),
    39: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การสร้างเสริมสุขภาพและการป้องกัน"),
    40: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การเกิดและการดำเนินโรค"),
    41: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    42: ("ศัลยศาสตร์ช่องปาก", "การจัดการและการรักษาผู้ป่วย"),
    43: ("ทันตกรรมประดิษฐ์", "ขั้นตอนและวิธีการรักษา"),
    44: ("ทันตกรรมประดิษฐ์", "ขั้นตอนและวิธีการรักษา"),
    45: ("ปริทันตวิทยา", "ขั้นตอนและวิธีการรักษา"),
    46: ("ทันตกรรมชุมชน", "การเกิดและการดำเนินโรค"),
    47: ("ทันตกรรมชุมชน", "การเกิดและการดำเนินโรค"),
    48: ("ทันตกรรมชุมชน", "การสร้างเสริมสุขภาพและการป้องกัน"),
    49: ("ปริทันตวิทยา", "การเกิดและการดำเนินโรค"),
    50: ("ทันตกรรมประดิษฐ์", "ขั้นตอนและวิธีการรักษา"),
    51: ("ทันตกรรมประดิษฐ์", "การเกิดและการดำเนินโรค"),
    52: ("ทันตกรรมบูรณะ/หัตถการ", "ขั้นตอนและวิธีการรักษา"),
    53: ("ทันตกรรมชุมชน", "การจัดการและการรักษาผู้ป่วย"),
    54: ("ทันตกรรมชุมชน", "การจัดการและการรักษาผู้ป่วย"),
    55: ("ศัลยศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    56: ("ทันตกรรมประดิษฐ์", "การจัดการและการรักษาผู้ป่วย"),
    57: ("วิทยาเอ็นโดดอนต์", "การจัดการและการรักษาผู้ป่วย"),
    58: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การจัดการและการรักษาผู้ป่วย"),
    59: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การวินิจฉัยโรค"),
    60: ("ศัลยศาสตร์ช่องปาก", "การจัดการและการรักษาผู้ป่วย"),
    61: ("ทันตกรรมประดิษฐ์", "ขั้นตอนและวิธีการรักษา"),
    62: ("ทันตกรรมประดิษฐ์", "การเกิดและการดำเนินโรค"),
    63: ("ทันตกรรมประดิษฐ์", "การเกิดและการดำเนินโรค"),
    64: ("ทันตกรรมสำหรับเด็ก", "การจัดการและการรักษาผู้ป่วย"),
    65: ("ทันตกรรมสำหรับเด็ก", "การสร้างเสริมสุขภาพและการป้องกัน"),
    66: ("ทันตกรรมสำหรับเด็ก", "การเกิดและการดำเนินโรค"),
    67: ("ทันตกรรมสำหรับเด็ก", "การจัดการและการรักษาผู้ป่วย"),
    68: ("ทันตกรรมสำหรับเด็ก", "การวินิจฉัยโรค"),
    69: ("ทันตกรรมสำหรับเด็ก", "การจัดการและการรักษาผู้ป่วย"),
    70: ("ทันตกรรมจัดฟัน", "การวินิจฉัยโรค"),
    71: ("ปริทันตวิทยา", "การสร้างเสริมสุขภาพและการป้องกัน"),
    72: ("ปริทันตวิทยา", "การวินิจฉัยโรค"),
    73: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การเกิดและการดำเนินโรค"),
    74: ("ทันตกรรมบูรณะ/หัตถการ", "การจัดการและการรักษาผู้ป่วย"),
    75: ("วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "การเกิดและการดำเนินโรค")
}

questions = []
lines = text.strip().split('\n')
current_stem = ""
current_q = None
current_choices = []

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    stem_match = re.match(r'^STEM\s+\d+', line)
    if stem_match:
        current_stem = line
        
        # When a new stem starts, save previous question
        if current_q:
            current_q['choices'] = current_choices
            questions.append(current_q)
            current_q = None
            current_choices = []
        continue
        
    # Check if this line is part of a STEM description (not a question and not a choice)
    if not re.match(r'^\d+\.', line) and not re.match(r'^\s*\d+\.', line):
        if current_q is None:
            current_stem += "\n" + line
        else:
            # Multi-line question text or choices
            if current_choices:
                current_choices[-1]['text'] += " " + line
            else:
                current_q['question_text'] += "\n" + line
        continue

    # Match question
    q_match = re.match(r'^(\d+)\.\s+(.*)', line)
    if q_match:
        num = int(q_match.group(1))
        
        is_choice = False
        if current_q is not None:
            # If num is between 1 and 5, and we expect choices
            if 1 <= num <= 5:
                # If we haven't seen this choice number yet for current Q
                if not any(c['label'] == str(num) for c in current_choices):
                    is_choice = True

        if is_choice:
            current_choices.append({
                "label": str(num),
                "text": q_match.group(2).strip()
            })
        else:
            # Save previous question
            if current_q:
                current_q['choices'] = current_choices
                questions.append(current_q)
            
            # Start new question
            cat, task = cat_map.get(num, ("ทันตกรรมบูรณะ/หัตถการ", "การวินิจฉัยโรค"))
            q_text = current_stem + "\n" + line if current_stem else line
            current_q = {
                "question_text": q_text,
                "choices": [],
                "correct_answer": None,
                "category": cat,
                "task": task,
                "source_exam": "NL2_2022_part3"
            }
            current_choices = []
            # We don't clear current_stem, it applies to subsequent questions in this STEM

if current_q:
    current_q['choices'] = current_choices
    questions.append(current_q)

exam_bank = {"questions": questions}

# Write the final JSON file using json.dump
with open("/Users/admin/Downloads/NL Test/parsed_exams/NL2_2022_part3.json", "w", encoding="utf-8") as f:
    json.dump(exam_bank, f, ensure_ascii=False, indent=2)

print("Done. Wrote", len(questions), "questions.")
