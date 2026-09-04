import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, BookOpen, Brain, Sparkles, CheckCircle2, XCircle, RotateCw, 
  ChevronLeft, ChevronRight, Shuffle, AlertTriangle, ArrowLeft, Play, 
  Search, ShieldAlert, Award, FileText, Check, HelpCircle, Flame, Eye,
  Compass, ChevronDown, ChevronUp, Clock, Bookmark
} from 'lucide-react';

// ============================================================================
// FLASHCARDS DATA (36 High-Yield Exam Cards)
// ============================================================================
const FLASHCARDS = [
  // พ.ร.บ. วิชาชีพทันตกรรม
  {
    id: 1,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'ใบอนุญาตประกอบวิชาชีพทันตกรรม หมดอายุเมื่อใด?',
    answer: 'หากได้รับก่อนวันที่ 25 พฤษภาคม 2559 มีอายุ "ตลอดชีพ" (ตาม ม.6 บทเฉพาะกาล พ.ร.บ.วิชาชีพทันตกรรม ฉบับที่ 2 พ.ศ. 2559)\n\nหากได้รับหลังวันที่ 25 พ.ค. 2559 มีอายุ 5 ปี และต้องต่ออายุโดยมีหน่วยกิจกรรมการศึกษาต่อเนื่อง (CDEC) อย่างน้อย 100 หน่วยกิต',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 และ ฉบับที่ 2 พ.ศ. 2559 (ม.31, ม.6)',
    trap: 'ข้อสอบชอบหลอกว่า "หมดอายุทุก 2 ปี หรือ 5 ปี สำหรับทุกคน" -> ต้องแยกแยะรุ่นก่อน vs หลัง พ.ค. 2559'
  },
  {
    id: 2,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'โทษทางจรรยาบรรณที่ทันตแพทยสภาสามารถสั่งลงโทษได้ มีอะไรบ้าง?',
    answer: 'มี 5 ระดับเท่านั้น ได้แก่:\n1. ยกข้อกล่าวหา\n2. ว่ากล่าวตักเตือน\n3. ภาคทัณฑ์\n4. พักใช้ใบอนุญาต (ไม่เกิน 2 ปี)\n5. เพิกถอนใบอนุญาต',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 39',
    trap: 'ทันตแพทยสภา "ไม่มีอำนาจ" ปรับเงิน, จำคุก หรือสั่งให้ชดใช้ค่าเสียหายทางแพ่งแก่ผู้ป่วยเด็ดขาด! โทษปรับ/จำคุกเป็นอำนาจศาล'
  },
  {
    id: 3,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'ใครมีสิทธิกล่าวหาหรือร้องเรียนทันตแพทย์ต่อทันตแพทยสภา?',
    answer: '"บุคคลใดก็ได้" (ไม่จำเป็นต้องเป็นผู้เสียหายโดยตรง เช่น ประชาชนทั่วไป, ทันตแพทย์ด้วยกัน, หรือสภาตั้งเรื่องเอง)',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 34',
    trap: 'ข้อสอบชอบลวงว่า "ต้องเป็นผู้ป่วยที่ได้รับความเสียหายเท่านั้น" -> ข้อนี้ผิด บุคคลใดก็กล่าวหาได้'
  },
  {
    id: 4,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'อายุความในการร้องเรียนคดีจรรยาบรรณต่อทันตแพทยสภา มีกำหนดเท่าใด?',
    answer: 'ภายใน 1 ปี นับแต่วันที่ผู้เสียหายหรือผู้กล่าวหารู้เรื่องการประพฤติผิดและรู้ตัวผู้กระทำผิด (แต่ทั้งนี้ต้องไม่เกิน 3 ปีนับแต่วันที่มีการกระทำความผิด)',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 35',
    trap: 'จำตัวเลข 1 ปี (นับแต่รู้) กับ 3 ปี (นับแต่วันกระทำ)'
  },
  {
    id: 5,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'หากผู้กล่าวหาหรือผู้เสียหายขอ "ถอนเรื่องร้องเรียน" ต่อทันตแพทยสภา กระบวนการจะเป็นอย่างไร?',
    answer: 'การถอนเรื่อง "ไม่เป็นเหตุให้ระงับการดำเนินการ" คณะกรรมการทันตแพทยสภายังมีอำนาจสืบสวนสอบสวนและวินิจฉัยลงโทษต่อไปได้',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 36',
    trap: 'คดีจรรยาบรรณเพื่อคุ้มครองประชาชน ไม่ใช่คดียอมความส่วนตัว ถอนเรื่องแล้วสภายังฟันต่อได้'
  },
  {
    id: 6,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'ทันตแพทย์ที่ถูก "เพิกถอนใบอนุญาต" จะขอรับใบอนุญาตใหม่ได้เมื่อใด?',
    answer: 'เมื่อพ้นกำหนด "2 ปี" นับแต่วันที่ถูกสั่งเพิกถอนใบอนุญาต และคณะกรรมการทันตแพทยสภาพิจารณาแล้วเห็นสมควรออกให้ใหม่',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 42',
    trap: 'ข้อสอบชอบลวงว่า 1 ปี, 3 ปี หรือตลอดชีวิต -> คำตอบคือ 2 ปี'
  },
  {
    id: 7,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'ทันตแพทย์ที่หยุดประกอบวิชาชีพทันตกรรม ใบอนุญาตยังมีผลบังคับใช้หรือไม่?',
    answer: 'ยังมีผลสมบูรณ์ เพราะใบอนุญาต (รุ่นตลอดชีพ) จะสิ้นสุดลงต่อเมื่อ: ตาย, ขอลาออก, ถูกสั่งพักใช้ หรือถูกสั่งเพิกถอนเท่านั้น การหยุดตรวจหรือไปทำงานอื่นไม่ทำให้ใบอนุญาตหมดอายุ',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537',
    trap: 'การไม่ได้ตรวจคนไข้มาหลายปี ไม่ถือว่าใบอนุญาตขาดอายุ'
  },
  {
    id: 8,
    category: 'วิชาชีพทันตกรรม',
    categoryColor: '#8b5cf6',
    question: 'ผู้ที่ไม่ได้เป็นทันตแพทย์แต่แอบอ้างประกอบวิชาชีพทันตกรรม มีโทษตามกฎหมายอย่างไร?',
    answer: 'จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 30,000 บาท หรือทั้งจำทั้งปรับ (ตาม ม.28, ม.50)',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 28 และ 50',
    trap: 'นี่คือคดีอาญา ต้องดำเนินคดีที่สถานีตำรวจ/ศาล ทันตแพทยสภาไม่มีอำนาจจับขังหรือปรับเอง'
  },

  // พ.ร.บ. สถานพยาบาล
  {
    id: 9,
    category: 'สถานพยาบาล',
    categoryColor: '#06b6d4',
    question: 'ใบอนุญาตให้ประกอบกิจการสถานพยาบาล (ผู้รับใบอนุญาต/เจ้าของ) หมดอายุเมื่อใด?',
    answer: 'มีอายุ 10 ปี นับแต่วันที่ออกใบอนุญาต (และต้องยื่นขอต่ออายุล่วงหน้าก่อนสิ้นอายุ)',
    statute: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541 และแก้ไขเพิ่มเติม ฉบับที่ 4 พ.ศ. 2559 มาตรา 18',
    trap: 'จำสับสนระหว่าง "ใบประกอบกิจการ" (10 ปี) กับ "ใบผู้ดำเนินการ" (สิ้นปีปฏิทินของปีที่สอง)'
  },
  {
    id: 10,
    category: 'สถานพยาบาล',
    categoryColor: '#06b6d4',
    question: 'ใบอนุญาตให้ดำเนินการสถานพยาบาล (ทันตแพทย์ผู้ดำเนินการ/Clinic Director) หมดอายุเมื่อใด?',
    answer: 'สิ้นอายุใน "วันสิ้นปีปฏิทินของปีที่สอง" นับแต่ปีที่ออกใบอนุญาต (หมดอายุวันที่ 31 ธันวาคม ของปีถัดไปเสมอ)\n\nตัวอย่าง: ได้รับ 25 ธ.ค. 2565 -> หมดอายุ 31 ธ.ค. 2566',
    statute: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 26',
    trap: 'ข้อสอบชอบถามคำนวณวันหมดอายุ เช่น ได้รับ ธ.ค. 2565 จะหมด 31 ธ.ค. 2566 (เพราะนับปีที่ออกเป็นปีที่ 1 และปีถัดไปเป็นปีที่ 2)'
  },
  {
    id: 11,
    category: 'สถานพยาบาล',
    categoryColor: '#06b6d4',
    question: 'หน้าที่ในการจัดหาเครื่องมือ อุปกรณ์ ยา และเวชภัณฑ์ที่ได้มาตรฐาน เป็นหน้าที่ของใคร?',
    answer: 'เป็นหน้าที่ร่วมกันของทั้ง "ผู้รับใบอนุญาตประกอบกิจการ" และ "ผู้ดำเนินการสถานพยาบาล"',
    statute: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 34, 35',
    trap: 'ข้อสอบถามว่าหน้าที่ใคร ช้อยส์มักแยกผู้รับใบอนุญาต กับผู้ดำเนินการ -> คำตอบคือ "ร่วมกันทั้งสองฝ่าย"'
  },
  {
    id: 12,
    category: 'สถานพยาบาล',
    categoryColor: '#06b6d4',
    question: 'การโฆษณาสถานพยาบาลข้อใด ถือว่า "ผิดกฎหมายสถานพยาบาล"?',
    answer: 'การโฆษณาแจกส่วนลด (เช่น ลด 10% เมื่อแชร์), ชิงโชค, อวดอ้างสรรพคุณเกินจริง, หรือใช้คำว่า "ยอดเยี่ยมที่สุด/แห่งแรก/ผู้เชี่ยวชาญหนึ่งเดียว"',
    statute: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 38 และประกาศ สธ. เรื่องการโฆษณา',
    trap: 'โฆษณาที่บอกเฉพาะ ชื่อ-สกุล ทันตแพทย์, สาขาความชำนาญเฉพาะทางที่ได้รับวุฒิบัตรจริง, เวลาเปิด-ปิด, และสถานที่ตั้ง สามารถทำได้โดยถูกต้อง'
  },
  {
    id: 13,
    category: 'สถานพยาบาล',
    categoryColor: '#06b6d4',
    question: 'หากผู้ดำเนินการสถานพยาบาลลาออกหรือไม่สามารถปฏิบัติหน้าที่ได้ ต้องแจ้งผู้อนุญาตภายในกี่วัน?',
    answer: 'ผู้รับใบอนุญาตต้องแจ้งเป็นหนังสือต่อผู้อนุญาตภายใน "15 วัน" นับแต่วันที่ผู้ดำเนินการพ้นจากหน้าที่ และต้องจัดหาผู้ดำเนินการคนใหม่แทน',
    statute: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 27',
    trap: 'จำตัวเลข 15 วัน (การแจ้งเปลี่ยน/แจ้งยกเลิกผู้ดำเนินการ)'
  },
  {
    id: 14,
    category: 'สถานพยาบาล',
    categoryColor: '#06b6d4',
    question: 'คลินิกทันตกรรมต้องเก็บรักษาเวชระเบียน (ประวัติผู้ป่วยและฟิล์มเอกซเรย์) ไว้อย่างน้อยกี่ปี?',
    answer: 'อย่างน้อย "5 ปี" นับแต่วันที่ผู้ป่วยมารับการตรวจรักษาครั้งสุดท้าย',
    statute: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 35 (3) และกฎกระทรวง',
    trap: 'อย่าสับสนกับอายุความละเมิด (3 ปี/10 ปี) เวชระเบียนต้องเก็บอย่างน้อย 5 ปี'
  },

  // ทันตาภิบาล & บุคลากรช่วยงาน
  {
    id: 15,
    category: 'ทันตาภิบาล & บุคลากร',
    categoryColor: '#10b981',
    question: 'ทันตาภิบาล (เจ้าพนักงานทันตสาธารณสุข) มีสิทธิประกอบวิชาชีพในสถานที่ใด?',
    answer: 'เฉพาะใน "สถานพยาบาลของรัฐ" (รพ.สต., รพช., รพท., รพศ.) ภายใต้การควบคุมกำกับของกระทรวงสาธารณสุขเท่านั้น "ห้าม" ทำงานคลินิกเอกชนโดยอิสระ',
    statute: 'ระเบียบกระทรวงสาธารณสุขว่าด้วยการรักษาพยาบาลของเจ้าพนักงานทันตสาธารณสุข',
    trap: 'ทันตาภิบาลเปิดคลินิกทำฟันเองไม่ได้ และทำงานคลินิกเอกชนทำหัตถการแทนหมอไม่ได้'
  },
  {
    id: 16,
    category: 'ทันตาภิบาล & บุคลากร',
    categoryColor: '#10b981',
    question: 'หัตถการใดที่ทันตาภิบาล "ห้ามทำเด็ดขาด"?',
    answer: 'ห้ามผ่าฟันคุด, ห้ามรักษารากฟัน (Root Canal Treatment ทั้งฟันแท้และฟันน้ำนมที่ซับซ้อน), ห้ามใส่ฟันปลอมถาวร, ห้ามจัดฟัน',
    statute: 'ข้อกำหนดขอบเขตงานเจ้าพนักงานทันตสาธารณสุข สธ.',
    trap: 'ทันตาภิบาลสามารถ ขูดหินน้ำลาย, อุดฟันผุที่ไม่ลึกถึงโพรงประสาท (Amalgam/GIC), ถอนฟันแท้ที่โยกมาก/ฟันน้ำนม, เคลือบหลุมร่องฟัน (Sealant) ได้'
  },
  {
    id: 17,
    category: 'ทันตาภิบาล & บุคลากร',
    categoryColor: '#10b981',
    question: 'หากพบว่าทันตาภิบาลในโรงพยาบาลชุมชนผ่าฟันคุด ทันตแพทย์ควรดำเนินการอย่างไร?',
    answer: 'แจ้งหรือ "รายงานต่อผู้อำนวยการโรงพยาบาล" ตามสายบังคับบัญชา เพื่อดำเนินการทางวินัยและระเบียบกระทรวงสาธารณสุข',
    statute: 'ระเบียบบริหารราชการแผ่นดิน และ พ.ร.บ. ระเบียบข้าราชการพลเรือน',
    trap: 'อย่าตอบว่า "ร้องเรียนทันตแพทยสภา" เพราะทันตาภิบาลไม่ใช่สมาชิกทันตแพทยสภา สภาไม่มีอำนาจลงโทษจรรยาบรรณ!'
  },
  {
    id: 18,
    category: 'ทันตาภิบาล & บุคลากร',
    categoryColor: '#10b981',
    question: 'ทันตาภิบาลทำผิดหัตถการเกินขอบเขต มีความผิดฐานผิดจรรยาบรรณวิชาชีพทันตกรรมหรือไม่?',
    answer: '"ไม่ผิดจรรยาบรรณทันตแพทยสภา" แต่ผิด "ข้อบังคับและระเบียบกระทรวงสาธารณสุข" (เนื่องจากทันตาภิบาลไม่ได้ถือใบอนุญาตประกอบวิชาชีพทันตกรรมจากทันตแพทยสภา)',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 4, 28',
    trap: 'คำว่า "จรรยาบรรณ" ในข้อสอบ NL ทันตแพทย์ หมายถึง ข้อบังคับจรรยาบรรณของทันตแพทยสภาเท่านั้น'
  },
  {
    id: 19,
    category: 'ทันตาภิบาล & บุคลากร',
    categoryColor: '#10b981',
    question: 'นักศึกษาทันตแพทย์ปี 5 ไปขูดหินน้ำลายให้คนไข้ที่คลินิกเอกชน โดยมีทันตแพทย์คอยคุม มีความผิดหรือไม่?',
    answer: '"ผิดทั้งคู่" นักศึกษาผิดข้อหาประกอบวิชาชีพทันตกรรมโดยไม่มีใบอนุญาต (พ.ร.บ.วิชาชีพ), ส่วนทันตแพทย์และคลินิกผิด พ.ร.บ.สถานพยาบาล ฐานยินยอมให้ผู้ไม่มีใบประกอบฯ มาประกอบวิชาชีพ',
    statute: 'พ.ร.บ. วิชาชีพทันตกรรม ม.28, พ.ร.บ. สถานพยาบาล ม.34',
    trap: 'ข้อยกเว้นให้นักศึกษาทำหัตถการได้ ใช้ได้เฉพาะ "ในการเรียนการสอนภายใต้การกำกับของคณะทันตแพทยศาสตร์ในหลักสูตรที่สภารับรองเท่านั้น" คลินิกเอกชนนอกคณะไม่ได้!'
  },
  {
    id: 20,
    category: 'ทันตาภิบาล & บุคลากร',
    categoryColor: '#10b981',
    question: 'หากต้องการดำเนินคดีกับนักศึกษาทันตแพทย์ที่แอบไปทำฟันนอกคณะ ต้องร้องเรียนที่ไหน?',
    answer: 'แจ้งความดำเนินคดีที่ "สถานีตำรวจ" (คดีอาญา) เพราะนักศึกษายังไม่มีใบอนุญาต ทันตแพทยสภาไม่สามารถลงโทษทางจรรยาบรรณได้',
    statute: 'ประมวลกฎหมายวิธีพิจารณาความอาญา และ พ.ร.บ. วิชาชีพทันตกรรม ม.28',
    trap: 'นศ. ยังไม่ใช่ผู้ประกอบวิชาชีพ ทันตแพทยสภาทำได้เพียงบันทึกประวัติไว้พิจารณาตอนขอใบอนุญาต แต่ลงโทษจรรยาบรรณไม่ได้'
  },

  // นิติเวชทันตวิทยา & DVI Interpol
  {
    id: 21,
    category: 'นิติเวชทันตวิทยา',
    categoryColor: '#f59e0b',
    question: 'ตามหลักสากล Interpol DVI สิ่งใดจัดเป็น Primary Identifiers ในการยืนยันเอกลักษณ์บุคคล?',
    answer: 'มี 3 สิ่งเท่านั้นที่ยืนยันได้เด็ดขาด (Primary Identifiers):\n1. ลายนิ้วมือ (Fingerprints)\n2. ข้อมูลทางทันตกรรม (Forensic Odontology / Dental Data)\n3. ดีเอ็นเอ (DNA Analysis)',
    statute: 'Interpol Disaster Victim Identification (DVI) Guide',
    trap: 'รอยสัก (Tattoo), แผลเป็น, ทรัพย์สินติดตัว, ภาพถ่ายใบหน้า จัดเป็น "Secondary Identifiers" ใช้แค่สนับสนุน แต่ยืนยันเด็ดขาดเดี่ยวๆ ไม่ได้'
  },
  {
    id: 22,
    category: 'นิติเวชทันตวิทยา',
    categoryColor: '#f59e0b',
    question: 'ในศพที่ถูกไฟไหม้เกรียม (Charred body) หรือศพเน่าเปื่อยในน้ำ อะไรคือวิธีพิสูจน์เอกลักษณ์ที่ดีที่สุด?',
    answer: 'ข้อมูลทันตกรรม (Dental identification) ร่วมกับ DNA จากเนื้อเยื่อโพรงประสาทฟัน (Dental pulp) เพราะฟันเป็นอวัยวะที่แข็งที่สุด ทนความร้อนสูงและสารเคมีได้ดี ลายนิ้วมือจะถูกทำลายหมดแล้ว',
    statute: 'หลักนิติเวชทันตวิทยา Interpol DVI',
    trap: 'ในไฟไหม้ลายนิ้วมือหลุดลอกหมด เหลือแต่ฟันและ DNA กระดูก/ฟัน'
  },
  {
    id: 23,
    category: 'นิติเวชทันตวิทยา',
    categoryColor: '#f59e0b',
    question: 'สภาพฟันของผู้เสียชีวิตจากเหตุเพลิงไหม้ มีลักษณะเด่นอย่างไรเมื่อเทียบระหว่างฟันหน้ากับฟันหลัง?',
    answer: '"ฟันหน้าจะเปราะแตกหักง่ายกว่าฟันหลัง" (Anterior teeth are more brittle/fragile) เนื่องจากริมฝีปากถูกไฟไหม้ทำให้ฟันหน้ารับความร้อนโดยตรง ส่วนฟันหลังถูกปกป้องด้วยกล้ามเนื้อแก้ม (Buccinator) และลิ้น',
    statute: 'Forensic Odontology: Thermal effects on dentition',
    trap: 'ข้อสอบถามว่าฟันหน้าหรือฟันหลังทนกว่า -> ฟันหลังทนความร้อนได้ดีกว่าฟันหน้า'
  },
  {
    id: 24,
    category: 'นิติเวชทันตวิทยา',
    categoryColor: '#f59e0b',
    question: 'ปรากฏการณ์ฟันสีชมพู (Pink teeth phenomenon) มักพบในกรณีใด และเกิดจากอะไร?',
    answer: 'มักพบในศพที่ "จมน้ำเปียกชื้น (Drowning / Water submersion)" หรือขาดอากาศหายใจ เกิดจากการแตกของหลอดเลือดในโพรงประสาทฟัน (Hemolysis) เม็ดเลือดแดงปล่อย Hemoglobin ซึมเข้าสู่ Dentinal tubules',
    statute: 'Forensic Odontology: Postmortem changes',
    trap: 'Pink tooth ไม่ได้เกิดจากสารพิษเฉพาะเจาะจง และไม่ได้บอกสาเหตุการตาย 100% แต่เป็น Postmortem imbibition ที่พบบ่อยในศพแช่น้ำ'
  },
  {
    id: 25,
    category: 'นิติเวชทันตวิทยา',
    categoryColor: '#f59e0b',
    question: 'ในผู้ใหญ่ที่ฟันแท้ขึ้นครบทุกซี่และรากปิดหมดแล้ว การประเมินอายุทางทันตกรรมใช้ปัจจัยใดแม่นยำที่สุด?',
    answer: '"Root Dentin Translucency (Transparency)" ตามวิธีของ Gustafson หรือ Bang & Ramm เพราะการใสตัวของเนื้อฟันบริเวณรากจะเพิ่มขึ้นตามอายุอย่างเป็นเส้นตรงและแปรผันตามสิ่งแวดล้อมน้อยที่สุด',
    statute: "Gustafson's method / Age estimation in adults",
    trap: 'ในเด็กดู พัฒนาการฟัน (Demirjian), ในผู้ใหญ่ดู Root Translucency และ Secondary Dentin (Pulp/Tooth volume ratio)'
  },
  {
    id: 26,
    category: 'นิติเวชทันตวิทยา',
    categoryColor: '#f59e0b',
    question: 'หากต้องการประเมินอายุของผู้ต้องสงสัยวัยรุ่นหรือเด็กต่างด้าวที่ไม่มีเอกสาร นอกจากฟันแล้วควรตรวจกระดูกส่วนใด?',
    answer: 'กระดูกไหปลาร้า (Clavicle - Medial clavicular epiphysis) เนื่องจากเป็นกระดูกชิ้นสุดท้ายของร่างกายที่เชื่อมปิดสมบูรณ์ (ประมาณอายุ 21 - 25 ปี)',
    statute: 'Study Group on Forensic Age Diagnostics (AGFAD)',
    trap: 'กระดูกมือและข้อมือ (Hand-wrist) เหมาะสำหรับเด็กก่อน 18 ปี แต่ถ้าอายุ 18-25 ปี ต้องใช้ Clavicle'
  },

  // กฎหมายการแพทย์ & จรรยาบรรณ
  {
    id: 27,
    category: 'จรรยาบรรณ & ละเมิด',
    categoryColor: '#ec4899',
    question: 'Informed Consent แบบใดที่เพียงพอสำหรับหัตถการตรวจฟันหรือขูดหินน้ำลายทั่วไป?',
    answer: 'พฤติกรรมยินยอมโดยปริยาย (Implied consent) เช่น คนไข้นั่งบนเก้าอี้ทำฟันแล้วอ้าปากให้ตรวจ อย่างไรก็ตาม หัตถการที่มีความเสี่ยง ผ่าตัด หรือถอนฟัน ควรได้รับ Expressed written consent เสมอ',
    statute: 'แนวทางเวชปฏิบัติทันตกรรม และ พ.ร.บ. สุขภาพแห่งชาติ ม.8',
    trap: 'ไม่ใช่ทุกหัตถการต้องเซ็นกระดาษ แต่การผ่าตัด/ศัลยกรรม/ดมยา ต้องเป็นลายลักษณ์อักษร'
  },
  {
    id: 28,
    category: 'จรรยาบรรณ & ละเมิด',
    categoryColor: '#ec4899',
    question: 'กรณีใดที่ทันตแพทย์สามารถให้การรักษาได้โดยไม่ต้องขอความยินยอม (Informed Consent)?',
    answer: 'กรณี "ฉุกเฉินและจำเป็นเร่งด่วนเพื่อช่วยชีวิต" ซึ่งหากรอขอความยินยอมจะทำให้ผู้ป่วยเป็นอันตรายถึงชีวิต และผู้ป่วยอยู่ในภาวะไม่สามารถให้ความยินยอมได้',
    statute: 'ประมวลกฎหมายอาญา ม.67 (กระทำด้วยความจำเป็น), พ.ร.บ.สุขภาพแห่งชาติ',
    trap: 'ต้องเป็นเหตุฉุกเฉินระดับชีวิตวิกฤตเท่านั้น ไม่ใช่แค่ปวดฟันแล้วอยากทำให้เร็ว'
  },
  {
    id: 29,
    category: 'จรรยาบรรณ & ละเมิด',
    categoryColor: '#ec4899',
    question: 'หากทันตแพทย์ปฏิบัติตาม Standard of Care ครบถ้วน แต่เกิดภาวะแทรกซ้อนที่หลีกเลี่ยงไม่ได้ ทันตแพทย์มีความผิดหรือไม่?',
    answer: '"ไม่มีความผิด" ทั้งทางอาญา แพ่ง และจรรยาบรรณ เพราะความรับผิดทางการแพทย์พิจารณาจาก "ความประมาทเลินเล่อ (Negligence)" มิได้รับประกันผลสำเร็จของการรักษา (Not a warranty of cure)',
    statute: 'ประมวลกฎหมายแพ่งและพาณิชย์ ม.420, บรรทัดฐานคำพิพากษาศาลฎีกา',
    trap: 'ผลการรักษาไม่ดี ไม่ได้แปลว่าหมอผิดเสมอไป ถ้าทำตามมาตรฐานวิชาชีพ (Standard of Care) แล้วไม่ถือว่าประมาท'
  },
  {
    id: 30,
    category: 'จรรยาบรรณ & ละเมิด',
    categoryColor: '#ec4899',
    question: 'การฟ้องคดีแพ่งเรียกค่าเสียหายจากทันตแพทย์ฐานละเมิด มีอายุความเท่าใด?',
    answer: '"1 ปี" นับแต่วันที่ผู้เสียหายรู้ถึงการละเมิดและรู้ตัวผู้กระทำ หรือไม่เกิน "10 ปี" นับแต่วันที่ทำละเมิด (แต่หากเป็นคดีผู้บริโภคอาจขยายตาม พ.ร.บ.วิธีพิจารณาคดีผู้บริโภค)',
    statute: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 448',
    trap: '1 ปีนับแต่รู้ถึงการละเมิดและรู้ตัวผู้กระทำ / 10 ปีนับแต่วันทำละเมิด'
  },
  {
    id: 31,
    category: 'จรรยาบรรณ & ละเมิด',
    categoryColor: '#ec4899',
    question: 'ทันตแพทย์ออกใบรับรองแพทย์หรือเอกสารเบิกประกันเท็จ มีความผิดอย่างไร?',
    answer: 'ผิด 3 สถานพร้อมกัน:\n1. กฎหมายอาญา (แจ้งข้อความเท็จ/ออกเอกสารเท็จ ม.269 จำคุกไม่เกิน 2 ปี หรือปรับไม่เกิน 40,000 บาท)\n2. พ.ร.บ. วิชาชีพทันตกรรม (ผิดจรรยาบรรณ มีโทษถึงเพิกถอนใบอนุญาต)\n3. ทางแพ่ง (ฐานร่วมกันฉ้อโกง/ละเมิดต่อบริษัทประกัน)',
    statute: 'ประมวลกฎหมายอาญา ม.269, ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณ',
    trap: 'ข้อสอบถามว่าผิดอะไร ช้อยส์มักบอกผิดแค่อย่างใดอย่างหนึ่ง -> ตอบ "ผิดทั้งอาญาและจรรยาบรรณวิชาชีพ"'
  },
  {
    id: 32,
    category: 'จรรยาบรรณ & ละเมิด',
    categoryColor: '#ec4899',
    question: 'ทันตแพทย์เปิดช่อง YouTube / TikTok ให้ความรู้ แต่มีการกล่าวอ้างว่าเป็น "อันดับหนึ่ง" หรือรับรองผล 100% ผิดข้อใด?',
    answer: 'ผิดข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณแห่งวิชาชีพทันตกรรม เรื่อง "การโฆษณาที่โอ้อวดเกินจริง ก่อให้เกิดความเข้าใจผิด หรือรับรองผลการรักษา"',
    statute: 'ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณแห่งวิชาชีพทันตกรรม',
    trap: 'การให้ความรู้ทางวิชาการเพื่อประโยชน์สาธารณะทำได้ แต่ห้ามสอดแทรกการตลาดโอ้อวดหรือรับรองผล'
  },

  // ข้อเก็งใหม่ 2026
  {
    id: 33,
    category: 'เก็งใหม่ 2026',
    categoryColor: '#e11d48',
    question: 'ทันตกรรมทางไกล (Tele-dentistry) สามารถทำหัตถการหรือขั้นตอนใดได้บ้างตามประกาศทันตแพทยสภา?',
    answer: 'ทำได้เฉพาะ:\n1. การคัดกรองเบื้องต้น (Triage)\n2. การให้คำแนะนำสุขศึกษาและส่งเสริมสุขภาพช่องปาก\n3. การติดตามผลหลังการรักษา (Post-treatment follow up)\n\n"ห้าม" วินิจฉัยเพื่อจัดฟันใสออนไลน์โดยไม่ตรวจจริง หรือสั่งยาควบคุมพิเศษโดยไม่เคยตรวจคนไข้',
    statute: 'ประกาศทันตแพทยสภาว่าด้วยมาตรฐานการให้บริการทันตกรรมทางไกล',
    trap: 'Tele-dentistry ไม่สามารถทดแทนการตรวจในคลินิกเพื่อทำหัตถการผ่าตัดหรือจัดฟันได้'
  },
  {
    id: 34,
    category: 'เก็งใหม่ 2026',
    categoryColor: '#e11d48',
    question: 'การนำภาพถ่ายช่องปากและฟิล์ม X-ray ของคนไข้ไปโพสต์สอนหรือทำเคสรีวิวบน Social Media ต้องทำอย่างไรตาม PDPA?',
    answer: 'ต้องได้รับ "ความยินยอม (Consent)" เป็นลายลักษณ์อักษรที่ระบุวัตถุประสงค์เพื่อการศึกษา/สื่อสารสาธารณะอย่างชัดเจน และต้องปิดบังอัตลักษณ์ (Anonymize) เช่น เบลอดวงหน้า ชื่อ-สกุล เลขประจำตัว',
    statute: 'พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และประกาศจรรยาบรรณ',
    trap: 'Informed consent ในการรักษา "ไม่ครอบคลุม" การนำภาพไปลง Social Media ต้องขอแยกต่างหากเสมอ'
  },
  {
    id: 35,
    category: 'เก็งใหม่ 2026',
    categoryColor: '#e11d48',
    question: 'ทันตแพทย์จบใหม่หลัง พ.ค. 2559 จะต้องสะสมคะแนน CDEC เท่าใดในการต่ออายุใบอนุญาต 5 ปี?',
    answer: 'ต้องมีคะแนนการศึกษาต่อเนื่อง (CDEC) ไม่น้อยกว่า "100 หน่วยกิต" ภายในรอบระยะเวลา 5 ปี จึงจะมีสิทธิยื่นขอต่ออายุใบอนุญาตประกอบวิชาชีพ',
    statute: 'ข้อบังคับทันตแพทยสภาว่าด้วยการศึกษาต่อเนื่องทางทันตแพทยศาสตร์',
    trap: 'ตัวเลขจำขึ้นใจ: 100 หน่วยกิต / 5 ปี'
  },
  {
    id: 36,
    category: 'เก็งใหม่ 2026',
    categoryColor: '#e11d48',
    question: 'เข็มฉีดยาชาทิ่มตำมือผู้ช่วยทันตแพทย์ (Needlestick Injury) ขั้นตอนแรกสุดที่ต้องปฏิบัติคืออะไร?',
    answer: 'บีบเลือดออกเบาๆ และล้างแผลด้วยน้ำสะอาดและสบู่ทันที (ห้ามใช้แอลกอฮอล์เข้มข้นหรือบีบเค้นรุนแรงจนเนื้อเยื่อช้ำ) จากนั้นส่งตรวจเลือดทั้งผู้สัมผัสและผู้ป่วยต้นตอ (HIV, HBV, HCV) ภายใน 2 ชั่วโมง',
    statute: 'แนวทางปฏิบัติมาตรฐานเพื่อความปลอดภัยในการทำงานทางทันตกรรม (Dental Infection Control)',
    trap: 'ขั้นตอนแรกสุดคือ "ปฐมพยาบาลล้างน้ำสบู่ทันที" ไม่ใช่ไปกรอกเอกสารรายงานก่อน'
  }
];

// ============================================================================
// CONCEPT MAPPING TREE DATA
// ============================================================================
const CONCEPT_MAPPINGS = [
  {
    id: 'act_dental',
    title: '1. พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 / 2559',
    badge: 'หัวใจข้อสอบ 30%',
    color: '#8b5cf6',
    icon: Scale,
    branches: [
      {
        topic: 'ใบอนุญาตประกอบวิชาชีพ',
        points: [
          'รุ่นก่อน 25 พ.ค. 2559: อายุ "ตลอดชีพ" (เว้นแต่ตาย สละสิทธิ์ ถูกพักใช้ หรือเพิกถอน)',
          'รุ่นหลัง 25 พ.ค. 2559: อายุ "5 ปี" ต้องต่ออายุด้วยคะแนน CDEC >= 100 หน่วยกิต',
          'หยุดตรวจ/ไปทำงานอื่น: ใบอนุญาตยังคงมีผลสมบูรณ์'
        ]
      },
      {
        topic: 'อำนาจและโทษทางจรรยาบรรณ (ม.39)',
        points: [
          '5 โทษ: ยกข้อกล่าวหา / ว่ากล่าวตักเตือน / ภาคทัณฑ์ / พักใช้ใบอนุญาต (ไม่เกิน 2 ปี) / เพิกถอน',
          'ไม่มีอำนาจ: ปรับเงิน, จำคุก, สั่งชดใช้ค่าเสียหายทางแพ่ง (ต้องผ่านศาลเท่านั้น)',
          'ขอใบอนุญาตใหม่หลังถูกเพิกถอน: ต้องพ้น "2 ปี" ขึ้นไป'
        ]
      },
      {
        topic: 'กระบวนการพิจารณาจรรยาบรรณ',
        points: [
          'ผู้มีสิทธิกล่าวหา: "บุคคลใดก็ได้" (ไม่จำกัดเฉพาะผู้เสียหาย)',
          'อายุความ: ภายใน "1 ปี" นับแต่วันที่รู้เรื่องและรู้ตัวผู้กระทำ (และไม่เกิน 3 ปีนับแต่วันเกิดเหตุ)',
          'การถอนคำร้อง: ผู้กล่าวหาถอนเรื่องได้ แต่ "ทันตแพทยสภายังดำเนินกระบวนการต่อได้"'
        ]
      }
    ]
  },
  {
    id: 'act_clinic',
    title: '2. พ.ร.บ. สถานพยาบาล พ.ศ. 2541 / 2559',
    badge: 'ตัวเลขออกทุกปี 25%',
    color: '#06b6d4',
    icon: FileText,
    branches: [
      {
        topic: 'ประเภทใบอนุญาต & อายุ',
        points: [
          'ใบอนุญาตประกอบกิจการ (เจ้าของ/Licensee): อายุ "10 ปี"',
          'ใบอนุญาตดำเนินการ (ทันตแพทย์คุม/Operator): สิ้นอายุ "31 ธ.ค. ของปีที่สอง"',
          'หน้าที่จัดหาอุปกรณ์/ยาได้มาตรฐาน: เป็นหน้าที่ "ร่วมกันทั้งเจ้าของและผู้ดำเนินการ"'
        ]
      },
      {
        topic: 'การบริหารจัดการสถานพยาบาล',
        points: [
          'เปลี่ยน/ยกเลิกผู้ดำเนินการ: ต้องแจ้งผู้อนุญาตภายใน "15 วัน"',
          'การเก็บเวชระเบียน & X-ray: ต้องเก็บรักษาไว้อย่างน้อย "5 ปี"',
          'ป้ายชื่อสถานพยาบาล: ต้องมีรายละเอียดชื่อผู้ดำเนินการ และเลขที่ใบอนุญาตชัดเจน'
        ]
      },
      {
        topic: 'กฎหมายว่าด้วยการโฆษณา',
        points: [
          'ห้าม: โฆษณาลดราคาจูงใจ (เช่น ลด 10-50%), ชิงโชค, แจกของแถม, โอ้อวดดีที่สุด',
          'ทำได้: แจ้งชื่อ-สกุล วุฒิบัตรเฉพาะทางที่ทันตแพทยสภารับรอง เวลาทำการ สถานที่ตั้ง',
          'Before-After: ห้ามตกแต่งภาพ และต้องมีหนังสือยินยอมจากผู้ป่วย'
        ]
      }
    ]
  },
  {
    id: 'auxiliary',
    title: '3. ทันตาภิบาล & บุคลากรช่วยงาน',
    badge: 'กับดักข้อสอบยอดฮิต 20%',
    color: '#10b981',
    icon: ShieldAlert,
    branches: [
      {
        topic: 'ขอบเขตงานทันตาภิบาล (จพ.ทันตสาธารณสุข)',
        points: [
          'สถานที่ปฏิบัติงาน: ทำได้เฉพาะ "สถานพยาบาลของรัฐ" (รพ.สต., รพช.) เท่านั้น',
          'หัตถการที่ทำได้: ขูดหินน้ำลาย, อุดฟันผุตื้น (Amalgam/GIC), ถอนฟันแท้ที่โยก/ฟันน้ำนม, เคลือบหลุมร่องฟัน',
          'หัตถการที่ "ห้ามทำเด็ดขาด": ผ่าฟันคุด, รักษารากฟัน (RCT) ทุกชนิด, ใส่ฟันปลอมถาวร, จัดฟัน'
        ]
      },
      {
        topic: 'สถานะทางกฎหมาย & การลงโทษ',
        points: [
          'ทันตาภิบาล "ไม่มีจรรยาบรรณทันตแพทยสภา" เพราะไม่ได้เป็นสมาชิกทันตแพทยสภา',
          'เมื่อทันตาภิบาลทำผิด: ทันตแพทย์ต้อง "รายงานต่อผู้อำนวยการโรงพยาบาล" ตามระเบียบ สธ.',
          'ความผิด: ผิดระเบียบกระทรวงสาธารณสุขและวินัยข้าราชการ/พนักงานราชการ'
        ]
      },
      {
        topic: 'นักศึกษาทันตแพทย์ (Dental Students)',
        points: [
          'ทำหัตถการได้เฉพาะ: ในการเรียนการสอนของคณะทันตแพทย์ที่มีหลักสูตรรับรองเท่านั้น',
          'แอบทำฟันนอกคณะ: ผิด พ.ร.บ.วิชาชีพ (ไม่มีใบอนุญาต) + คลินิกผิด พ.ร.บ.สถานพยาบาล',
          'การดำเนินคดี นศ.: ร้องทุกข์ที่ "สถานีตำรวจ" (คดีอาญา) ไม่ใช่ทันตแพทยสภา'
        ]
      }
    ]
  },
  {
    id: 'forensics',
    title: '4. นิติเวชทันตวิทยา & DVI Interpol',
    badge: 'จำจุดเด่นฟัน 15%',
    color: '#f59e0b',
    icon: Brain,
    branches: [
      {
        topic: 'Interpol DVI Identification Standard',
        points: [
          'Primary Identifiers (3 อย่างเด็ดขาด): ฟัน (Odontology), ลายนิ้วมือ, DNA',
          'Secondary Identifiers (สนับสนุน): แผลเป็น, รอยสัก, ภาพถ่าย, เสื้อผ้า ทรัพย์สิน',
          'ศพไฟไหม้/เน่าเปื่อย: ลายนิ้วมือเสีย -> ใช้ "ฟัน + DNA จาก Pulp"'
        ]
      },
      {
        topic: 'พยาธิสภาพของฟันในสภาพศพต่างๆ',
        points: [
          'ศพไฟไหม้ (Charred Body): "ฟันหน้าเปราะแตกหักง่ายกว่าฟันหลัง"',
          'ฟันสีชมพู (Pink Teeth): มักเกิดในศพ "จมน้ำ/เปียกชื้น" จาก Hemoglobin ซึมเข้า Dentin',
          'Dentin: เป็นเนื้อเยื่อที่ทนความร้อนและสารเคมีสูงที่สุดในร่างกาย'
        ]
      },
      {
        topic: 'การประเมินอายุทางทันตวิทยา (Age Estimation)',
        points: [
          'เด็ก/วัยรุ่น: ประเมินจากพัฒนาการสร้างฟันและราก (Demirjian) + ฟิล์ม Panoramic',
          'ผู้ใหญ่ (ฟันขึ้นครบ): ดู "Root Dentin Translucency (Gustafson)" และ Secondary Dentin',
          'กระดูกเสริม: วัยเด็กดู Hand-Wrist, วัยรุ่น/ผู้ใหญ่ตอนต้น (21-25 ปี) ดู "Clavicle"'
        ]
      }
    ]
  },
  {
    id: 'ethics_tort',
    title: '5. กฎหมายการแพทย์ทั่วไป, จริยธรรม & ละเมิด',
    badge: 'แนวทางปฏิบัติ 10%',
    color: '#ec4899',
    icon: Award,
    branches: [
      {
        topic: 'ความยินยอมในการรักษา (Informed Consent)',
        points: [
          'Implied Consent: เพียงพอกับการตรวจทั่วไปหรือขูดหินน้ำลาย (อ้าปากให้ตรวจ)',
          'Written Consent: จำเป็นสำหรับหัตถการผ่าตัด, ถอนฟันซับซ้อน, ดมยาสลบ',
          'ยกเว้นไม่ต้องขอ Consent: กรณีฉุกเฉินวิกฤตถึงแก่ชีวิต และผู้ป่วยไม่อยู่ในภาวะยินยอมได้'
        ]
      },
      {
        topic: 'ความรับผิดทางแพ่งฐานละเมิด & มาตรฐานวิชาชีพ',
        points: [
          'Standard of Care: ยึดตามแนวทางของทันตแพทย์ทั่วไปในสถานการณ์และเครื่องมือเดียวกัน',
          'หากปฏิบัติตามมาตรฐานครบ: เกิดภาวะแทรกซ้อน "ไม่มีความผิด"',
          'อายุความคดีละเมิด: "1 ปี" นับแต่รู้ถึงการละเมิดและรู้ตัวผู้กระทำ (และไม่เกิน 10 ปี)'
        ]
      },
      {
        topic: 'เอกสารและใบรับรองแพทย์เท็จ',
        points: [
          'ออกใบรับรองเท็จ/เบิกเกินจริง: ผิด "กฎหมายอาญา (ม.269) + ผิดจรรยาบรรณวิชาชีพ"',
          'เวชระเบียน: ห้ามแก้ไข ลบ หรือตกแต่งย้อนหลังโดยไม่ลงวันที่กำกับ'
        ]
      }
    ]
  }
];

// ============================================================================
// CHEAT SHEET DATA (10-Minute Numbers)
// ============================================================================
const NUMBERS_CHEAT_SHEET = [
  { num: '10 ปี', label: 'ใบอนุญาตประกอบกิจการสถานพยาบาล', law: 'พ.ร.บ. สถานพยาบาล ม.18', note: 'เจ้าของ/ผู้รับใบอนุญาต ต่อทุก 10 ปี' },
  { num: '31 ธ.ค. ปีที่ 2', label: 'ใบอนุญาตดำเนินการสถานพยาบาล', law: 'พ.ร.บ. สถานพยาบาล ม.26', note: 'หมอผู้ดำเนินการ คลินิกไดเร็กเตอร์' },
  { num: 'ตลอดชีพ', label: 'ใบอนุญาตวิชาชีพทันตกรรม (ก่อน 25 พ.ค. 59)', law: 'ม.6 บทเฉพาะกาล ฉบับที่ 2', note: 'ไม่มีวันหมดอายุ เว้นแต่ถูกสั่งเพิกถอน' },
  { num: '5 ปี', label: 'ใบอนุญาตวิชาชีพทันตกรรม (หลัง 25 พ.ค. 59)', law: 'พ.ร.บ. วิชาชีพทันตกรรม ม.31', note: 'ต้องสะสม CDEC >= 100 หน่วยกิตเพื่อต่ออายุ' },
  { num: '1 ปี', label: 'อายุความร้องเรียนคดีจรรยาบรรณ', law: 'พ.ร.บ. วิชาชีพทันตกรรม ม.35', note: 'นับแต่วันที่รู้เรื่องและรู้ตัว (ไม่เกิน 3 ปีจากวันเกิดเหตุ)' },
  { num: '2 ปี', label: 'ขอรับใบอนุญาตใหม่หลังถูกสั่งเพิกถอน', law: 'พ.ร.บ. วิชาชีพทันตกรรม ม.42', note: 'ต้องพ้นกำหนด 2 ปีก่อนสภาจึงจะพิจารณา' },
  { num: '15 วัน', label: 'แจ้งเปลี่ยน/ยกเลิกผู้ดำเนินการสถานพยาบาล', law: 'พ.ร.บ. สถานพยาบาล ม.27', note: 'ผู้รับใบอนุญาตต้องแจ้งผู้อนุญาตเป็นลายลักษณ์อักษร' },
  { num: '5 ปี', label: 'การเก็บรักษาเวชระเบียนและฟิล์ม X-ray', law: 'พ.ร.บ. สถานพยาบาล ม.35', note: 'นับจากวันที่ผู้ป่วยมารับการรักษาครั้งสุดท้าย' },
  { num: '1 ปี / 10 ปี', label: 'อายุความคดีแพ่งฐานละเมิด', law: 'ป.พ.พ. มาตรา 448', note: '1 ปีนับแต่รู้ถึงการละเมิดและรู้ตัว / 10 ปีนับแต่วันทำละเมิด' },
  { num: '21 - 25 ปี', label: 'กระดูกไหปลาร้า (Clavicle) ปิดสมบูรณ์', law: 'นิติเวช AGFAD Guideline', note: 'ใช้ประเมินอายุเพื่อแยกเยาวชน vs ผู้ใหญ่' }
];

export default function LawStudyHub({ onBack, onStartExam }) {
  const [activeTab, setActiveTab] = useState('flashcards'); // flashcards, map, cheat_sheet, exams
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mastery tracking saved in localStorage
  const [masteredCards, setMasteredCards] = useState(() => {
    try {
      const saved = localStorage.getItem('nl_law_flashcards_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter flashcards
  const filteredCards = useMemo(() => {
    return FLASHCARDS.filter(card => {
      const matchCat = selectedCategory === 'all' || card.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.statute.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Ensure currentCardIndex is within bounds when list changes
  useEffect(() => {
    if (currentCardIndex >= filteredCards.length) {
      setCurrentCardIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length]);

  const currentCard = filteredCards[currentCardIndex] || filteredCards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleShuffleCards = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentCardIndex(randomIndex);
  };

  const toggleMastery = (cardId) => {
    let next;
    if (masteredCards.includes(cardId)) {
      next = masteredCards.filter(id => id !== cardId);
    } else {
      next = [...masteredCards, cardId];
    }
    setMasteredCards(next);
    localStorage.setItem('nl_law_flashcards_mastered', JSON.stringify(next));
  };

  const resetMastery = () => {
    if (confirm('คุณต้องการรีเซ็ตสถานะการจำการ์ดทั้งหมดหรือไม่?')) {
      setMasteredCards([]);
      localStorage.removeItem('nl_law_flashcards_mastered');
    }
  };

  const categoriesList = useMemo(() => {
    const set = new Set(FLASHCARDS.map(c => c.category));
    return ['all', ...Array.from(set)];
  }, []);

  const masteredCountInCurrentSet = filteredCards.filter(c => masteredCards.includes(c.id)).length;
  const progressPercent = filteredCards.length > 0 
    ? Math.round((masteredCountInCurrentSet / filteredCards.length) * 100) 
    : 0;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} /> กลับหน้าหลัก
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => onStartExam({ category: 'กฎหมายและจรรยาบรรณ', mode: 'practice', count: 30 })}
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)'
            }}
          >
            <Play size={15} /> ลุยข้อสอบกฎหมาย (30 ข้อ)
          </button>
        </div>
      </div>

      {/* ── Hero Banner ────────────────────────────────────── */}
      <div className="hero-section glass-panel" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge" style={{ background: 'rgba(124,58,237,0.2)', color: 'var(--primary-light)', border: '1px solid rgba(124,58,237,0.4)' }}>
                ⚖️ HIGH-YIELD PASS CRITICAL
              </span>
              <span className="badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
                133 ข้อครอบคลุม 100%
              </span>
            </div>
            <h1 className="gradient-text" style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>
              Dental Law & Ethics Study Hub
            </h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', maxWidth: '650px', lineHeight: 1.6 }}>
              ศูนย์รวมสรุปย่อกฎหมายทันตกรรมและจรรยาบรรณวิชาชีพ: ผังมโนทัศน์เชื่อมโยง 5 เสาหลัก, 
              Flashcards ช่วยจำแบบ 3D, สูตรโกงเลขเด็ด 10 นาทีสุดท้าย และเก็งข้อสอบใหม่ปี 2026
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'var(--bg-panel)', 
              padding: '0.75rem 1.25rem', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>133</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ข้อสอบจริง</div>
            </div>
            <div style={{ 
              background: 'var(--bg-panel)', 
              padding: '0.75rem 1.25rem', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{masteredCards.length} / {FLASHCARDS.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>การ์ดที่จำได้</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-Tab Navigation Bar ─────────────────────────── */}
      <div className="dashboard-tab-bar" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`dashboard-tab-item ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          <span className="dashboard-tab-emoji">🎴</span>
          <span>Flashcards ช่วยจำ ({FLASHCARDS.length})</span>
        </button>

        <button
          className={`dashboard-tab-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <span className="dashboard-tab-emoji">🗺️</span>
          <span>Concept Mapping (5 เสาหลัก)</span>
        </button>

        <button
          className={`dashboard-tab-item ${activeTab === 'cheat_sheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('cheat_sheet')}
        >
          <span className="dashboard-tab-emoji">⏱️</span>
          <span>Take-Notes & ข้อเก็ง 2026</span>
        </button>

        <button
          className={`dashboard-tab-item ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          <span className="dashboard-tab-emoji">🎯</span>
          <span>คลังข้อสอบกฎหมาย (133 ข้อ)</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1: FLASHCARDS
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'flashcards' && (
        <div className="animate-fade-in">
          {/* Controls & Filter Bar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem',
            marginBottom: '1rem' 
          }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: selectedCategory === cat ? 600 : 400,
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border)',
                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-panel)',
                    color: selectedCategory === cat ? '#fff' : 'var(--text-sub)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat === 'all' ? 'ทั้งหมด (All)' : cat}
                </button>
              ))}
            </div>

            {/* Search and Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="ค้นหาคำในบัตร..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '0.35rem 0.8rem 0.35rem 2rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-panel)',
                    color: 'var(--text)',
                    fontSize: '0.82rem',
                    width: '180px'
                  }}
                />
              </div>

              {masteredCards.length > 0 && (
                <button 
                  onClick={resetMastery}
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid var(--border)', 
                    color: 'var(--text-muted)', 
                    borderRadius: '8px',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                  title="รีเซ็ตสถานะการจำ"
                >
                  <RotateCw size={12} style={{ display: 'inline', marginRight: '4px' }} /> รีเซ็ต
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              <span>จำได้แม่นแล้ว {masteredCountInCurrentSet} จาก {filteredCards.length} ใบในหมวดนี้</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--bg-panel)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div 
                style={{ 
                  width: `${progressPercent}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #10b981, #06b6d4)', 
                  transition: 'width 0.3s ease' 
                }} 
              />
            </div>
          </div>

          {/* Flashcard Component */}
          {filteredCards.length > 0 && currentCard ? (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              
              {/* Card Container with 3D Flip */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  perspective: '1200px',
                  minHeight: '360px',
                  cursor: 'pointer',
                  marginBottom: '1.25rem',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: '360px',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                  
                  {/* FRONT FACE */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                    borderTop: `4px solid ${currentCard.categoryColor}`
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{ 
                          fontSize: '0.78rem', 
                          fontWeight: 700, 
                          color: currentCard.categoryColor,
                          background: `${currentCard.categoryColor}15`,
                          padding: '0.3rem 0.75rem',
                          borderRadius: '12px',
                          border: `1px solid ${currentCard.categoryColor}40`
                        }}>
                          {currentCard.category}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {masteredCards.includes(currentCard.id) && (
                            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <CheckCircle2 size={14} /> จำได้แล้ว
                            </span>
                          )}
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            ใบที่ {currentCardIndex + 1} / {filteredCards.length}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5, marginTop: '1rem' }}>
                        {currentCard.question}
                      </div>
                    </div>

                    <div style={{ 
                      textAlign: 'center', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.85rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px dashed var(--border)'
                    }}>
                      <RotateCw size={14} /> แตะที่การ์ดเพื่อดูคำตอบและมาตรากฎหมาย
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                    borderTop: `4px solid #10b981`
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ 
                          fontSize: '0.78rem', 
                          fontWeight: 700, 
                          color: '#10b981',
                          background: 'rgba(16,185,129,0.15)',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '12px'
                        }}>
                          เฉลย & ตัวบทกฎหมาย
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          ใบที่ {currentCardIndex + 1} / {filteredCards.length}
                        </span>
                      </div>

                      <div style={{ 
                        fontSize: '1rem', 
                        color: 'var(--text)', 
                        lineHeight: 1.6, 
                        whiteSpace: 'pre-line',
                        marginBottom: '1.25rem',
                        fontWeight: 500
                      }}>
                        {currentCard.answer}
                      </div>

                      <div style={{ 
                        background: 'rgba(124, 58, 237, 0.08)', 
                        borderLeft: '3px solid var(--primary)', 
                        padding: '0.6rem 0.85rem', 
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.82rem',
                        color: 'var(--primary-light)',
                        marginBottom: '0.75rem'
                      }}>
                        <strong>⚖️ มาตราอ้างอิง:</strong> {currentCard.statute}
                      </div>

                      {currentCard.trap && (
                        <div style={{ 
                          background: 'rgba(245, 158, 11, 0.08)', 
                          borderLeft: '3px solid #f59e0b', 
                          padding: '0.6rem 0.85rem', 
                          borderRadius: '0 8px 8px 0',
                          fontSize: '0.82rem',
                          color: '#f59e0b'
                        }}>
                          <strong>⚠️ หลุมพรางข้อสอบ:</strong> {currentCard.trap}
                        </div>
                      )}
                    </div>

                    <div style={{ 
                      textAlign: 'center', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.82rem',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem',
                      paddingTop: '1rem',
                      borderTop: '1px dashed var(--border)'
                    }}>
                      <RotateCw size={14} /> แตะที่การ์ดเพื่อพลิกกลับไปดูโจทย์
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handlePrevCard}
                    style={{ padding: '0.6rem 1rem' }}
                  >
                    <ChevronLeft size={16} /> ก่อนหน้า
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleShuffleCards}
                    title="สุ่มบัตรถัดไป"
                    style={{ padding: '0.6rem 1rem' }}
                  >
                    <Shuffle size={16} />
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleNextCard}
                    style={{ padding: '0.6rem 1rem' }}
                  >
                    ถัดไป <ChevronRight size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleMastery(currentCard.id)}
                    className="btn"
                    style={{
                      background: masteredCards.includes(currentCard.id) 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : 'var(--bg-panel)',
                      color: masteredCards.includes(currentCard.id) ? '#10b981' : 'var(--text-sub)',
                      border: '1px solid',
                      borderColor: masteredCards.includes(currentCard.id) ? '#10b981' : 'var(--border)',
                      padding: '0.6rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {masteredCards.includes(currentCard.id) ? (
                      <>
                        <CheckCircle2 size={16} color="#10b981" />
                        <span>จำได้แล้ว (Mastered)</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>ทำเครื่องหมายว่าจำได้</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              ไม่พบบัตรคำที่ตรงกับเงื่อนไขการค้นหา
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2: CONCEPT MAPPING (5 เสาหลัก)
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'map' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              🗺️ ผังมโนทัศน์กฎหมายทันตกรรมและจรรยาบรรณ (Dental Jurisprudence Mind Map)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              จัดหมวดหมู่ 5 กลุ่มกฎหมายสำคัญที่ออกสอบ NL สม่ำเสมอ พร้อมประเด็นตัวบท มาตรา และข้อควรระวัง
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {CONCEPT_MAPPINGS.map(cat => {
              const IconComp = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  className="glass-panel" 
                  style={{ 
                    borderRadius: 'var(--radius)', 
                    padding: '1.5rem', 
                    borderTop: `4px solid ${cat.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: `${cat.color}20`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: cat.color
                        }}>
                          <IconComp size={18} />
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                          {cat.title}
                        </h4>
                      </div>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 600, 
                        color: cat.color,
                        background: `${cat.color}15`,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '10px'
                      }}>
                        {cat.badge}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {cat.branches.map((b, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            background: 'var(--bg-panel)', 
                            borderRadius: 'var(--radius-sm)', 
                            padding: '0.85rem',
                            border: '1px solid var(--border)'
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
                            📌 {b.topic}
                          </div>
                          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                            {b.points.map((pt, pIdx) => (
                              <li key={pIdx} style={{ marginBottom: '0.3rem' }}>
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id === 'act_dental' ? 'วิชาชีพทันตกรรม' :
                                           cat.id === 'act_clinic' ? 'สถานพยาบาล' :
                                           cat.id === 'auxiliary' ? 'ทันตาภิบาล & บุคลากร' :
                                           cat.id === 'forensics' ? 'นิติเวชทันตวิทยา' : 'จรรยาบรรณ & ละเมิด');
                        setActiveTab('flashcards');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: cat.color,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      เปิดดู Flashcards หมวดหมู่นี้ <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 3: TAKE-NOTES & ข้อเก็ง 2026
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'cheat_sheet' && (
        <div className="animate-fade-in">
          
          {/* Section 1: 10-Minute Numbers Cheat Sheet */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Clock size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                สูตรโกง 10 นาทีสุดท้าย: รวมตัวเลขสำคัญที่ต้องจำก่อนเข้าห้องสอบ
              </h3>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              จำตัวเลขเหล่านี้ให้แม่นยำก่อนเข้าสอบ มีโอกาสเก็บคะแนนได้ทันที 4 - 6 ข้อ
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '0.85rem' 
            }}>
              {NUMBERS_CHEAT_SHEET.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: 'var(--bg-panel)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '0.9rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'transform 0.2s',
                  }}
                >
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    color: 'var(--primary-light)',
                    minWidth: '95px',
                    textAlign: 'center',
                    background: 'rgba(124, 58, 237, 0.1)',
                    padding: '0.4rem 0.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(124, 58, 237, 0.2)'
                  }}>
                    {item.num}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '0.1rem' }}>
                      {item.law}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      💡 {item.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 5 Common Exam Traps */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <AlertTriangle size={20} color="#ef4444" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f87171' }}>
                5 จุดหลุมพรางที่ข้อสอบชอบหลอกมากที่สุด (Common Traps)
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                  1. ทันตแพทยสภา "ไม่มีอำนาจปรับเงิน / ไม่มีอำนาจจำคุก / ไม่มีอำนาจสั่งจ่ายค่าชดใช้"
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                  ทันตแพทยสภาเป็นองค์กรควบคุมวิชาชีพ มีอำนาจลงโทษทางจรรยาบรรณ 5 อย่างเท่านั้น: ยกข้อกล่าวหา, ว่ากล่าวตักเตือน, ภาคทัณฑ์, พักใช้, เพิกถอน หากข้อสอบมีช้อยส์บอกว่าสภาสั่งปรับ 50,000 หรือสั่งชดใช้เงินคนไข้ → กาตัดทิ้งได้เลย!
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                  2. ทันตาภิบาล "ไม่มีความผิดจรรยาบรรณของทันตแพทยสภา"
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                  ทันตาภิบาลไม่ได้เป็นสมาชิกทันตแพทยสภา หากทันตาภิบาลผ่าฟันคุดหรือรักษารากฟัน จะผิด "ข้อบังคับและระเบียบกระทรวงสาธารณสุข" และทันตแพทย์ต้อง "รายงานผู้อำนวยการโรงพยาบาล" ไม่ใช่ส่งเรื่องฟ้องทันตแพทยสภา
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                  3. นศ.ทันตแพทย์แอบทำฟันนอกคณะ → ร้องเรียนที่ "สถานีตำรวจ"
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                  นักศึกษาทันตแพทย์ยังไม่มีใบอนุญาต หากไปทำฟันนอกหลักสูตร ถือเป็นการประกอบวิชาชีพทันตกรรมโดยไม่ได้รับอนุญาต (คดีอาญา) ต้องแจ้งความที่สถานีตำรวจ ทันตแพทยสภาไม่สามารถสั่งพักใช้หรือเพิกถอน นศ. ได้
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                  4. คนไข้ขอถอนเรื่องร้องเรียน → กระบวนการของสภา "ยังดำเนินต่อได้"
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                  คดีจรรยาบรรณวิชาชีพทำขึ้นเพื่อประโยชน์สาธารณะ ไม่ใช่คดียอมความทางแพ่ง แม้ผู้ป่วยได้รับเงินเยียวยาแล้วยอมถอนเรื่อง คณะกรรมการทันตแพทยสภายังมีอำนาจสอบสวนต่อจนจบได้
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                  5. นิติเวช: ศพไฟไหม้ "ฟันหน้าเปราะแตกหักง่ายกว่าฟันหลัง"
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                  ฟันหน้าจะสัมผัสความร้อนโดยตรงหลังริมฝีปากถูกเผา ส่วนฟันหลังมีกล้ามเนื้อแก้ม กระพุ้งแก้ม และลิ้นคอยหุ้มป้องกัน จึงทนความร้อนได้ดีกว่า
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Predicted Topics for 2026 */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Flame size={20} color="#8b5cf6" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                ข้อเก็งประเด็นใหม่ (Predicted High-Yield Topics 2026)
              </h3>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              หัวข้อกฎหมายใหม่และแนวปฏิบัติตามสถานการณ์ปัจจุบันที่ยังไม่เคยออกในข้อสอบเก่า แต่มีโอกาสออกสูงมาก
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              
              <div style={{ background: 'var(--bg-panel)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '0.4rem' }}>
                  📱 1. ทันตกรรมทางไกล (Tele-dentistry)
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                  ตามประกาศสภา ทำได้เฉพาะการคัดกรองเบื้องต้น (Triage), นัดหมาย, และให้คำแนะนำติดตามอาการ <strong>ห้ามเด็ดขาด</strong> ในการตรวจวินิจฉัยเพื่อจัดฟันใสออนไลน์โดยไม่มีการพิมพ์ปาก/สแกนฟันในคลินิก และห้ามสั่งยาเสพติด/ยาควบคุมพิเศษผ่านระบบทางไกล
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#06b6d4', marginBottom: '0.4rem' }}>
                  🎬 2. การโฆษณาผ่าน Influencer & TikTok
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                  ทันตแพทย์ต้องรับผิดชอบต่อเนื้อหาที่ Influencer หรือคลินิกลงสื่อ การรีวิวอ้างผลการรักษาหรือจัดโปร Flash-Sale ลดราคา มีความผิดตาม พ.ร.บ.สถานพยาบาล และภาพ Before-After ต้องมี Consent ปิดบังตัวตน และห้าม Retouch ตกแต่งภาพ
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#10b981', marginBottom: '0.4rem' }}>
                  🛡️ 3. กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                  ข้อมูลการรักษาและฟิล์ม X-ray จัดเป็นข้อมูลสุขภาพที่มีความละเอียดอ่อน (Sensitive Personal Data) การนำฟิล์มหรือภาพผู้ป่วยไปบรรยาย/โพสต์เคสเพื่อการศึกษา ต้องได้รับความยินยอมแยกต่างหาก และต้อง Anonymize ทุกจุดที่ระบุตัวบุคคลได้
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.4rem' }}>
                  💉 4. Infection Control & Needlestick Safety
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                  ขั้นตอนปฏิบัติเมื่อเกิดอุบัติเหตุเข็มทิ่มตำ: ล้างแผลด้วยน้ำสะอาดและสบู่ทันที (ห้ามบีบเค้นแผลแรง) ส่งตรวจเลือดหา HIV, HBV, HCV ภายใน 2 ชั่วโมง และทันตแพทย์ผู้ดำเนินการมีหน้าที่จัดให้มีระบบกำจัดขยะติดเชื้อตามเกณฑ์ สธ.
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 4: DENTAL LAW EXAM VAULT (133 QUESTIONS)
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'exams' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              🎯 คลังข้อสอบกฎหมายและจรรยาบรรณทันตกรรม (133 ข้อ ผ่านการตรวจทานแล้ว)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ข้อสอบทุกข้อได้รับการตรวจสอบความถูกต้องตาม พ.ร.บ. วิชาชีพทันตกรรม, พ.ร.บ. สถานพยาบาล, กฎกระทรวง และ Interpol DVI อย่างละเอียด
            </p>
          </div>

          {/* Quick Launch Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            
            <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                All-in-One Master Exam
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                ทำข้อสอบกฎหมายทั้งหมด (133 ข้อ)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '1rem', lineHeight: 1.5 }}>
                รวบรวมข้อสอบกฎหมายและจรรยาบรรณครบทุกปี เหมาะสำหรับทดสอบความแม่นยำขั้นสูงสุด
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onStartExam({ category: 'กฎหมายและจรรยาบรรณ', mode: 'practice', count: 133 })}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
              >
                <Play size={15} /> เริ่มทำทั้งหมด (133 ข้อ)
              </button>
            </div>

            <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Fast Sprint Simulation
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                สุ่มซ้อมชุดมาตรฐาน (30 ข้อ)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '1rem', lineHeight: 1.5 }}>
                สุ่มข้อสอบ 30 ข้อตามสัดส่วนข้อสอบจริง กำหนดเวลา 42 นาที พร้อมเฉลยละเอียด
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => onStartExam({ category: 'กฎหมายและจรรยาบรรณ', mode: 'exam', count: 30 })}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
              >
                <Clock size={15} /> เริ่มสอบจับเวลา (30 ข้อ)
              </button>
            </div>

            <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '1.25rem', borderLeft: '4px solid #06b6d4' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Latest Year Focus
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                ข้อสอบปีล่าสุด (NL กฎหมาย 2026 & NL2-2567)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '1rem', lineHeight: 1.5 }}>
                ข้อสอบรุ่นใหม่ล่าสุด 43 ข้อ เน้นประเด็น informed consent, คดีละเมิด, และทันตาภิบาล
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => onStartExam({ category: 'กฎหมายและจรรยาบรรณ', mode: 'practice', count: 43 })}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
              >
                <Play size={15} /> เริ่มชุดข้อสอบล่าสุด (43 ข้อ)
              </button>
            </div>

          </div>

          {/* Exam Source Breakdown Table */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              📑 รายการชุดข้อสอบในคลัง (Verified Exam Sets)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.6rem 0.8rem' }}>ชื่อชุดข้อสอบ</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>จำนวนข้อ</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>จุดเน้นสำคัญ</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>สถานะการตรวจทาน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, color: 'var(--text)' }}>NL กฎหมาย 2026</td>
                    <td style={{ padding: '0.75rem 0.8rem' }}>10 ข้อ</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: 'var(--text-sub)' }}>การทำร้ายร่างกาย, สิทธิผู้ป่วย, ผู้ดำเนินการสถานพยาบาล</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: '#10b981' }}>✓ ผ่านการตรวจทาน 100%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, color: 'var(--text)' }}>NL2-2567 Part กฎหมาย</td>
                    <td style={{ padding: '0.75rem 0.8rem' }}>33 ข้อ</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: 'var(--text-sub)' }}>Informed consent, คดีละเมิด, ขอบเขตทันตาภิบาล, เอกสารเท็จ</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: '#10b981' }}>✓ ตรวจทานและแก้ไขข้อ 2303 & 2305</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, color: 'var(--text)' }}>NL กฎหมาย รอบ 3_2568</td>
                    <td style={{ padding: '0.75rem 0.8rem' }}>30 ข้อ</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: 'var(--text-sub)' }}>นิติเวชทันตวิทยา DVI, ศพไฟไหม้, วันหมดอายุใบอนุญาตคลินิก</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: '#10b981' }}>✓ ผ่านการตรวจทาน 100%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, color: 'var(--text)' }}>NL2 2566 กฎหมาย</td>
                    <td style={{ padding: '0.75rem 0.8rem' }}>30 ข้อ</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: 'var(--text-sub)' }}>การประเมินอายุกระดูก/ฟัน, นศ.ทันตแพทย์, การโฆษณาสถานพยาบาล</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: '#10b981' }}>✓ ผ่านการตรวจทาน 100%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0.8rem', fontWeight: 600, color: 'var(--text)' }}>NL2 2020 กฏหมายรอบแรก</td>
                    <td style={{ padding: '0.75rem 0.8rem' }}>30 ข้อ</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: 'var(--text-sub)' }}>Root transparency, Pink tooth, กระดูกไหปลาร้า (Clavicle)</td>
                    <td style={{ padding: '0.75rem 0.8rem', color: '#10b981' }}>✓ ผ่านการตรวจทาน 100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}