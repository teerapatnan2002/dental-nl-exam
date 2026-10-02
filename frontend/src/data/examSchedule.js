/**
 * ข้อมูลกำหนดการสอบอย่างเป็นทางการจากศูนย์ประเมินและรับรองความรู้ความสามารถ
 * ในการประกอบวิชาชีพทันตกรรม (ศ.ป.ท.) ทันตแพทยสภา
 * อ้างอิงจากประกาศ:
 * 1. ประกาศรับสมัครสอบวิชากฎหมาย ครั้งที่ 3/2569 (ลงวันที่ 6 ส.ค. 2569)
 * 2. ประกาศหัวข้อ กรอบเนื้อหา รูปแบบ วันรับสมัคร และกำหนดการสอบ ประจำปี 2570 (ลงวันที่ 29 เม.ย. 2569)
 */

export const EXAM_SCHEDULES = [
  {
    id: 'mock-law-2570',
    title: 'สนามจำลองสอบเสมือนจริง: NL Law 70 (Mock Exam)',
    series: 'รอบปี พ.ศ. 2570',
    type: 'law',
    icon: '🎯',
    badge: '🔥 เปิดสอบวันเสาร์นี้ 13:00 น.',
    targetDate: '2026-09-26T13:00:00+07:00',
    examDateText: 'วันเสาร์ที่ 26 กันยายน 2569',
    examTimeText: '13:00 – 14:00 น. (60 นาที)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทุกท่านเข้าสอบได้ฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเปิดระบบเสาร์นี้',
    announcementDateText: 'เฉลยและวิเคราะห์ผลทันทีหลังส่งข้อสอบ',
    fee: 'ฟรีสำหรับสมาชิก',
    description: 'ข้อสอบเก็งแม่นยำ 30 ข้อ 10 STEMs เต็มรูปแบบ จำลองเวลาและเกณฑ์สอบจริงของ ศรวท. 60 นาที (13:00–14:00 น.)',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537', items: 'อำนาจสภา, อายุใบอนุญาตตลอดชีพ, CDEC 100 หน่วย' },
      { name: 'จรรยาบรรณวิชาชีพทันตกรรม', items: 'ม.30 ห้ามทับถมเพื่อน, ห้ามโฆษณา Before-After, ห้ามอ้างผู้เชี่ยวชาญ' },
      { name: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541', items: 'หน้าที่ร่วมผู้รับอนุญาต/ผู้ดำเนินการ, อายุใบอนุญาต 10 ปี/2 ปี' },
      { name: 'ทันตนิติเวชศาสตร์ & สิทธิผู้ป่วย', items: 'Gustafson root transparency, Dental+DNA ไฟไหม้, Child abuse' },
    ],
    quickAction: {
      label: '🔒 เปิดห้องสอบวันเสาร์ 13:00 น.',
      actionType: 'exam_law_70',
      category: 'กฎหมายและจรรยาบรรณ',
      year: '2570',
      count: 30
    }
  },
  {
    id: 'dsat-mock-1',
    title: 'DSAT Mock Exam นิติทันตวิทยาและกฎหมาย ชุดที่ 1 (สนทท. 2569)',
    series: 'DSAT ชุดที่ 1',
    type: 'law',
    icon: '📝',
    badge: '✨ สโมสรนิสิตฯ สนทท.',
    targetDate: '2026-10-01T00:00:00+07:00',
    examDateText: 'เปิดสอบทันที (On-Demand)',
    examTimeText: '13:00 – 14:00 น. (60 นาที)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบได้ทันที',
    announcementDateText: 'เฉลยและวิเคราะห์ Cognitive Level ทันทีหลังส่ง',
    fee: 'ฟรีสำหรับสมาชิก',
    description: 'ข้อสอบมาตรฐาน สนทท. ชุดที่ 1 (30 ข้อ 10 STEMs) กฎหมายวิชาชีพ 24 ข้อ และทันตนิติเวช 6 ข้อ พร้อมเฉลยละเอียดและวิเคราะห์ระดับการเรียนรู้ (TOS)',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม & จรรยาบรรณ (STEM 1–8)', items: '24 ข้อ (อายุใบอนุญาต 5 ปี, CDEC 80 หน่วยที่ 4 ปี, ถอนฟันเข้า Maxillary Sinus)' },
      { name: 'นิติทันตวิทยา Forensic Odontology (STEM 9–10)', items: '6 ข้อ (DVI INTERPOL 4 phases, ประเมินอายุแรงงานต่างด้าว Clavicle)' },
    ],
    quickAction: {
      label: 'เริ่มสอบ DSAT ชุดที่ 1 (30 ข้อ)',
      actionType: 'exam_dsat_1',
      category: 'กฎหมายและจรรยาบรรณ',
      source_exam: 'DSAT Mock Law ชุดที่ 1',
      year: '2569',
      count: 30
    }
  },
  {
    id: 'dsat-mock-2',
    title: 'DSAT Mock Exam นิติทันตวิทยาและกฎหมาย ชุดที่ 2 (สนทท. 2569)',
    series: 'DSAT ชุดที่ 2',
    type: 'law',
    icon: '📝',
    badge: '✨ สโมสรนิสิตฯ สนทท.',
    targetDate: '2026-10-01T00:00:00+07:00',
    examDateText: 'เปิดสอบทันที (On-Demand)',
    examTimeText: '13:00 – 14:00 น. (60 นาที)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบได้ทันที',
    announcementDateText: 'เฉลยและวิเคราะห์ Cognitive Level ทันทีหลังส่ง',
    fee: 'ฟรีสำหรับสมาชิก',
    description: 'ข้อสอบมาตรฐาน สนทท. ชุดที่ 2 (30 ข้อ 10 STEMs) เจาะลึกสถานพยาบาลเอกชน, ถ่ายโอน รพ.สต. ไป อบจ., ทันตนิติเวชศพเน่าสลายในป่า',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม & จรรยาบรรณ (STEM 1–8)', items: '24 ข้อ (นับเวลา 5 ปีบริบูรณ์, ช่างทำฟันปลอมเถื่อน, ป.โทห้ามอ้างผู้เชี่ยวชาญ)' },
      { name: 'นิติทันตวิทยา Forensic Odontology (STEM 9–10)', items: '6 ข้อ (ศพเน่าสลายในป่า, Gustafson Root transparency โครงกระดูก)' },
    ],
    quickAction: {
      label: 'เริ่มสอบ DSAT ชุดที่ 2 (30 ข้อ)',
      actionType: 'exam_dsat_2',
      category: 'กฎหมายและจรรยาบรรณ',
      source_exam: 'DSAT Mock Law ชุดที่ 2',
      year: '2569',
      count: 30
    }
  },
  {
    id: 'dsat-mock-3',
    title: 'DSAT Mock Exam นิติทันตวิทยาและกฎหมาย ชุดที่ 3 (สนทท. 2569)',
    series: 'DSAT ชุดที่ 3',
    type: 'law',
    icon: '📝',
    badge: '✨ สโมสรนิสิตฯ สนทท.',
    targetDate: '2026-10-01T00:00:00+07:00',
    examDateText: 'เปิดสอบทันที (On-Demand)',
    examTimeText: '13:00 – 14:00 น. (60 นาที)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบได้ทันที',
    announcementDateText: 'เฉลยและวิเคราะห์ Cognitive Level ทันทีหลังส่ง',
    fee: 'ฟรีสำหรับสมาชิก',
    description: 'ข้อสอบมาตรฐาน สนทท. ชุดที่ 3 (30 ข้อ 10 STEMs) เจาะลึกผู้ป่วย HIV, การถอนคำร้องจรรยาบรรณ, รอยกัด ABFO No.2, สงสัย Child Abuse และภัยพิบัติเครื่องบินตก',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม & จรรยาบรรณ (STEM 1–8)', items: '24 ข้อ (การถอนคำร้องไม่ระงับคดีสภา, ห้ามปฏิเสธผู้ป่วย HIV, การย้ายคลินิก)' },
      { name: 'นิติทันตวิทยา Forensic Odontology (STEM 9–10)', items: '6 ข้อ (Bite marks ABFO No.2, Child Abuse protocol, เครื่องบินตก DVI Primary)' },
    ],
    quickAction: {
      label: 'เริ่มสอบ DSAT ชุดที่ 3 (30 ข้อ)',
      actionType: 'exam_dsat_3',
      category: 'กฎหมายและจรรยาบรรณ',
      source_exam: 'DSAT Mock Law ชุดที่ 3',
      year: '2569',
      count: 30
    }
  },
  {
    id: 'dsat-mock-4',
    title: 'DSAT Mock Exam นิติทันตวิทยาและกฎหมาย ชุดที่ 4 (2570)',
    series: 'DSAT ชุดที่ 4',
    type: 'law',
    icon: '📝',
    badge: '✨ สโมสรนิสิตฯ สนทท. (2570)',
    targetDate: '2026-10-02T00:00:00+07:00',
    examDateText: 'เปิดสอบทันที (On-Demand)',
    examTimeText: '13:00 – 14:00 น. (60 นาที)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบได้ทันที',
    announcementDateText: 'เฉลยและวิเคราะห์ Cognitive Level ทันทีหลังส่ง',
    fee: 'ฟรีสำหรับสมาชิก',
    description: 'ข้อสอบมาตรฐาน สนทท. ชุดที่ 4 (30 ข้อ 10 STEMs) เจาะลึกสถานพยาบาล กฎหมาย CDEC สิทธิผู้ป่วย เวชระเบียน & PDPA ทันตนิติเวช DVI และการประเมินอายุ',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม สถานพยาบาล & จรรยาบรรณ (STEM 1–8)', items: '24 ข้อ (ใบอนุญาต 10 ปี/2 ปี, โฆษณา, CDEC 100 หน่วย, สิทธิผู้ป่วย, PDPA)' },
      { name: 'นิติทันตวิทยา Forensic Odontology (STEM 9–10)', items: '6 ข้อ (DVI INTERPOL Primary Identifiers, การประเมินอายุ & ABFO Bite Marks)' },
    ],
    quickAction: {
      label: 'เริ่มสอบ DSAT ชุดที่ 4 (30 ข้อ)',
      actionType: 'exam_dsat_4',
      category: 'กฎหมายและจรรยาบรรณ',
      source_exam: 'DSAT Mock Law ชุดที่ 4',
      year: '2570',
      count: 30
    }
  },
  {
    id: 'law-3-2569',
    title: 'สอบวิชากฎหมายที่เกี่ยวข้องกับวิชาชีพทันตกรรม',
    series: 'ครั้งที่ 3/2569',
    type: 'law',
    icon: '⚖️',
    badge: 'ด่วนที่สุด • รอบถัดไป',
    targetDate: '2026-10-03T13:00:00+07:00',
    examDateText: 'วันเสาร์ที่ 3 ตุลาคม 2569',
    examTimeText: '13.00 – 13.45 น. (45 นาที)',
    questionsCount: 30,
    regPeriodText: '17 – 21 สิงหาคม 2569',
    regStatus: 'closed', // 'open', 'closed', 'upcoming'
    regStatusText: 'ปิดรับสมัครแล้ว (ชำระเงินเรียบร้อย)',
    announcementDateText: 'ภายในวันที่ 31 ตุลาคม 2569',
    fee: '900 บาท',
    description: 'การสอบประเมินความรู้ด้านกฎหมายทันตกรรม จรรยาบรรณ และ พ.ร.บ. วิชาชีพทันตกรรม สำหรับขึ้นทะเบียนใบอนุญาต',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537 และที่แก้ไขเพิ่มเติม', items: 'กฎหมายแม่บท & อำนาจคณะกรรมการทันตแพทยสภา' },
      { name: 'ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณแห่งวิชาชีพทันตกรรม พ.ศ. 2538', items: 'จรรยาบรรณ 5 หมวด (โฆษณา, ความสัมพันธ์, สิทธิผู้ป่วย)' },
      { name: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541 และที่แก้ไขเพิ่มเติม', items: 'การขออนุญาต & ผู้ดำเนินการสถานพยาบาล' },
      { name: 'กฎหมายอื่นๆ และทันตนิติเวชศาสตร์', items: 'สิทธิผู้ป่วย, ละเมิดทางแพ่ง, และการตรวจพิสูจน์อัตลักษณ์' },
    ],
    centers: [
      { name: 'คณะทันตแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย', seats: 110 },
      { name: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยมหิดล (เฉพาะนักศึกษา ม.มหิดล)', seats: 117 },
      { name: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่', seats: 60 },
      { name: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยขอนแก่น', seats: 100 },
      { name: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์', seats: 35 },
      { name: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยนเรศวร (เฉพาะนิสิต ม.นเรศวร)', seats: 57 },
      { name: 'วิทยาลัยทันตแพทยศาสตร์ มหาวิทยาลัยรังสิต', seats: 130 },
      { name: 'สำนักวิชาทันตแพทยศาสตร์ มหาวิทยาลัยแม่ฟ้าหลวง', seats: 42 },
      { name: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยพะเยา (เฉพาะนิสิต ม.พะเยา)', seats: 63 },
      { name: 'สำนักวิชาทันตแพทยศาสตร์ มหาวิทยาลัยเทคโนโลยีสุรนารี (เฉพาะ มทส.)', seats: 40 },
      { name: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยกรุงเทพธนบุรี', seats: 75 },
      { name: 'คณะทันตแพทยศาสตร์ สจล. (เฉพาะนักศึกษา สจล.)', seats: 24 },
      { name: 'มหาวิทยาลัยเกษตรศาสตร์ (วิทยาเขตบางเขน)', seats: 90 },
    ],
    quickAction: {
      label: 'ฝึกข้อสอบกฎหมาย 30 ข้อ',
      actionType: 'exam_law',
      category: 'กฎหมายและจรรยาบรรณ',
      count: 30
    }
  },
  {
    id: 'nl-1-2570',
    title: 'สอบประเมินความรู้ฯ เพื่อขึ้นทะเบียนและรับใบอนุญาต (NL)',
    series: 'ครั้งที่ 1/2570',
    type: 'nl',
    icon: '🎯',
    badge: 'สอบใหญ่ประจำปี',
    targetDate: '2027-01-09T08:00:00+07:00',
    examDateText: '9 – 10 มกราคม 2570',
    examTimeText: '08.00 – 18.20 น. (2 วันเต็ม)',
    questionsCount: 630,
    regPeriodText: '28 ตุลาคม – 6 พฤศจิกายน 2569',
    regStatus: 'upcoming',
    regStatusText: 'เตรียมเปิดรับสมัคร 28 ต.ค. 2569',
    announcementDateText: 'ตามที่ ศ.ป.ท. ประกาศ',
    fee: 'ตามระเบียบ ศ.ป.ท.',
    description: 'การสอบประเมินความรู้ภาควิทยาศาสตร์การแพทย์/ทันตแพทย์พื้นฐาน (ภาค 1), ภาควิทยาคลินิกทันตกรรม (ภาค 2) และวิชากฎหมาย',
    parts: [
      { date: '9 ม.ค. 2570 (08.00–12.20 น.)', title: 'ภาค 1: วิทยาศาสตร์การแพทย์และทันตแพทย์พื้นฐาน', count: 300 },
      { date: '9 ม.ค. 2570 (13.00–17.20 น.)', title: 'ภาค 2: วิทยาคลินิกทันตกรรม', count: 300 },
      { date: '9 ม.ค. 2570 (17.35–18.20 น.)', title: 'วิชากฎหมายที่เกี่ยวข้องกับวิชาชีพทันตกรรม', count: 30 },
      { date: '10 ม.ค. 2570 (08.00–17.20 น.)', title: 'ภาค 1 และ ภาค 2 (กลุ่มสอบต่อเนื่อง)', count: 300 },
    ],
    quickAction: {
      label: 'จำลองสอบ Full Exam Day 1',
      actionType: 'exam_day1',
      count: 150
    }
  },
  {
    id: 'nl-2-2570',
    title: 'สอบประเมินความรู้ฯ เพื่อขึ้นทะเบียนและรับใบอนุญาต (NL)',
    series: 'ครั้งที่ 2/2570',
    type: 'nl',
    icon: '🎯',
    badge: 'รอบแก้ตัว / รอบต้นปี',
    targetDate: '2027-03-13T08:00:00+07:00',
    examDateText: '13 – 14 มีนาคม 2570',
    examTimeText: '08.00 – 18.20 น. (2 วันเต็ม)',
    questionsCount: 630,
    regPeriodText: '8 – 12 กุมภาพันธ์ 2570',
    regStatus: 'upcoming',
    regStatusText: 'เปิดรับสมัคร 8 ก.พ. 2570',
    announcementDateText: 'ตามที่ ศ.ป.ท. ประกาศ',
    fee: 'ตามระเบียบ ศ.ป.ท.',
    description: 'การสอบประเมินความรู้ภาคที่ 1 และ ภาคที่ 2 พร้อมวิชากฎหมาย ประจำปี 2570 ครั้งที่ 2',
    parts: [
      { date: '13 มี.ค. 2570 (08.00–12.20 น.)', title: 'ภาค 1: วิทยาศาสตร์การแพทย์และทันตแพทย์พื้นฐาน', count: 300 },
      { date: '13 มี.ค. 2570 (13.00–17.20 น.)', title: 'ภาค 2: วิทยาคลินิกทันตกรรม', count: 300 },
      { date: '13 มี.ค. 2570 (17.35–18.20 น.)', title: 'วิชากฎหมายที่เกี่ยวข้องกับวิชาชีพทันตกรรม', count: 30 },
      { date: '14 มี.ค. 2570 (08.00–17.20 น.)', title: 'ภาค 1 และ ภาค 2 (กลุ่มสอบต่อเนื่อง)', count: 300 },
    ],
    quickAction: {
      label: 'จำลองสอบ Full Exam',
      actionType: 'exam_full',
      count: 300
    }
  },
  {
    id: 'law-3-2570',
    title: 'สอบวิชากฎหมายที่เกี่ยวข้องกับวิชาชีพทันตกรรม',
    series: 'ครั้งที่ 3/2570',
    type: 'law',
    icon: '⚖️',
    badge: 'รอบปลายปี 2570',
    targetDate: '2027-10-02T13:00:00+07:00',
    examDateText: 'วันเสาร์ที่ 2 ตุลาคม 2570',
    examTimeText: '13.00 – 13.45 น. (45 นาที)',
    questionsCount: 30,
    regPeriodText: '9 – 13 สิงหาคม 2570',
    regStatus: 'upcoming',
    regStatusText: 'เปิดรับสมัคร 9 ส.ค. 2570',
    announcementDateText: 'ภายในวันที่ 31 ตุลาคม 2570',
    fee: '900 บาท',
    description: 'การสอบวิชากฎหมายเฉพาะวิชา ครั้งที่ 3 ประจำปี 2570',
    quickAction: {
      label: 'ฝึกข้อสอบกฎหมาย 30 ข้อ',
      actionType: 'exam_law',
      category: 'กฎหมายและจรรยาบรรณ',
      count: 30
    }
  }
];

/**
 * คำนวณความแตกต่างของเวลาที่เหลือ (Days, Hours, Minutes, Seconds)
 */
export function calculateTimeRemaining(targetIsoDate) {
  const target = new Date(targetIsoDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { isExpired: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalDiffMs: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { isExpired: false, days, hours, minutes, seconds, totalDiffMs: diff };
}
