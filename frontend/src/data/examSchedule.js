/**
 * ข้อมูลกำหนดการสอบอย่างเป็นทางการจากศูนย์ประเมินและรับรองความรู้ความสามารถ
 * ในการประกอบวิชาชีพทันตกรรม (ศ.ป.ท.) ทันตแพทยสภา (https://cda.or.th)
 * อ้างอิงจากประกาศลงนามฉบับจริง:
 * 1. ประกาศหัวข้อ กรอบเนื้อหา รูปแบบ วันรับสมัคร และกำหนดการสอบ ประจำปี 2570 (ลงวันที่ 29 เม.ย. 2569)
 * 2. ประกาศเลื่อนวันรับสมัครสอบวิชากฎหมาย ครั้งที่ 3/2569 (ลงวันที่ 31 ก.ค. 2569) และประกาศรับสมัครสอบฯ (6 ส.ค. 2569)
 * 3. ประกาศผลการสอบวิชากฎหมาย ครั้งที่ 3/2569 (ลงวันที่ 15 ต.ค. 2569)
 * 4. ประกาศรับสมัครสอบเพื่อประเมินความรู้ฯ ครั้งที่ 1/2570 (ลงวันที่ 29 ต.ค. 2569 · แก้ไขวันรับสมัครเป็น 4–13 พ.ย. 2569)
 */

export const EXAM_SCHEDULES = [
  {
    id: 'mock-law-2570',
    title: 'สนามจำลองสอบเสมือนจริง: NL Law 70 (Mock Exam)',
    series: 'รอบปี พ.ศ. 2570',
    shortLabel: 'Mock Law 70',
    categoryGroup: 'mock',
    type: 'law',
    icon: '🎯',
    badge: 'Mock Exam บนเว็บไซต์',
    targetDate: '2026-09-26T13:00:00+07:00',
    endDate: '2026-09-26T14:00:00+07:00',
    examDateText: 'เปิดรอบจำลอง 26 กันยายน 2569 (ทำย้อนหลังได้)',
    examTimeText: '60 นาที (สอบจริง ศ.ป.ท. 45 นาที)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทุกท่านเข้าสอบได้ฟรี',
    regStatus: 'open',
    regStatusText: 'เปิดให้เข้าสอบย้อนหลังและฝึกทำได้ทันที',
    announcementDateText: 'เฉลยและวิเคราะห์ผลทันทีหลังส่งข้อสอบ',
    fee: 'ฟรีสำหรับสมาชิก',
    description: 'ข้อสอบจำลองบนเว็บไซต์ 30 ข้อ 10 STEMs จับเวลาฝึกทำ 60 นาที (ไม่ใช่กำหนดการสอบจริงของ ศ.ป.ท. · สอบจริงวิชากฎหมาย ศ.ป.ท. ใช้เวลา 45 นาที)',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537', items: 'อำนาจสภา, อายุใบอนุญาตตลอดชีพ, CDEC 100 หน่วย' },
      { name: 'จรรยาบรรณวิชาชีพทันตกรรม', items: 'ม.30 ห้ามทับถมเพื่อน, ห้ามโฆษณา Before-After, ห้ามอ้างผู้เชี่ยวชาญ' },
      { name: 'พ.ร.บ. สถานพยาบาล พ.ศ. 2541', items: 'หน้าที่ร่วมผู้รับอนุญาต/ผู้ดำเนินการ, อายุใบอนุญาต 10 ปี/2 ปี' },
      { name: 'ทันตนิติเวชศาสตร์ & สิทธิผู้ป่วย', items: 'Gustafson root transparency, Dental+DNA ไฟไหม้, Child abuse' },
    ],
    quickAction: {
      label: 'เข้าสอบ Mock Law 70 (30 ข้อ)',
      actionType: 'exam_law_70',
      category: 'กฎหมายและจรรยาบรรณ',
      source_exam: 'NL Law 2570 (Mock Test 70).pdf',
      exam_origin: 'ai_mock',
      count: 30
    }
  },
  {
    id: 'dsat-mock-1',
    title: 'DSAT Mock Exam นิติทันตวิทยาและกฎหมาย ชุดที่ 1 (สนทท. 2569)',
    series: 'DSAT ชุดที่ 1',
    shortLabel: 'DSAT ชุด 1',
    categoryGroup: 'mock',
    type: 'law',
    icon: '📝',
    badge: '✨ สโมสรนิสิตฯ สนทท.',
    targetDate: '2026-10-01T09:00:00+07:00',
    endDate: '2026-10-01T10:00:00+07:00',
    examDateText: 'เปิดชุดฝึก 1 ตุลาคม 2569 (ทำย้อนหลังได้)',
    examTimeText: '60 นาที (ชุดฝึกจำลอง · ทำเวลาใดก็ได้)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบย้อนหลังได้ทันที',
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
      exam_origin: 'dsat_mock',
      count: 30
    }
  },
  {
    id: 'dsat-mock-2',
    title: 'DSAT Mock Exam นิติทันตวิทยาและกฎหมาย ชุดที่ 2 (สนทท. 2569)',
    series: 'DSAT ชุดที่ 2',
    shortLabel: 'DSAT ชุด 2',
    categoryGroup: 'mock',
    type: 'law',
    icon: '📝',
    badge: '✨ สโมสรนิสิตฯ สนทท.',
    targetDate: '2026-10-01T11:00:00+07:00',
    endDate: '2026-10-01T12:00:00+07:00',
    examDateText: 'เปิดชุดฝึก 1 ตุลาคม 2569 (ทำย้อนหลังได้)',
    examTimeText: '60 นาที (ชุดฝึกจำลอง · ทำเวลาใดก็ได้)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบย้อนหลังได้ทันที',
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
      exam_origin: 'dsat_mock',
      count: 30
    }
  },
  {
    id: 'dsat-mock-3',
    title: 'DSAT Mock Exam นิติทันตวิทยาและกฎหมาย ชุดที่ 3 (สนทท. 2569)',
    series: 'DSAT ชุดที่ 3',
    shortLabel: 'DSAT ชุด 3',
    categoryGroup: 'mock',
    type: 'law',
    icon: '📝',
    badge: '✨ สโมสรนิสิตฯ สนทท.',
    targetDate: '2026-10-01T13:00:00+07:00',
    endDate: '2026-10-01T14:00:00+07:00',
    examDateText: 'เปิดชุดฝึก 1 ตุลาคม 2569 (ทำย้อนหลังได้)',
    examTimeText: '60 นาที (ชุดฝึกจำลอง · ทำเวลาใดก็ได้)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบย้อนหลังได้ทันที',
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
      exam_origin: 'dsat_mock',
      count: 30
    }
  },
  {
    id: 'dsat-mock-4',
    title: 'AI / Mock Exam กฎหมายเสริม ชุดที่ 4 (จำลอง 2570)',
    series: 'Mock เสริม ชุดที่ 4',
    shortLabel: 'Mock เสริม ชุด 4',
    categoryGroup: 'mock',
    type: 'law',
    icon: '📝',
    badge: '✨ Mock สร้างเสริม (แยกจากข้อสอบจริง)',
    targetDate: '2026-10-02T13:00:00+07:00',
    endDate: '2026-10-02T14:00:00+07:00',
    examDateText: 'เปิดชุดฝึก 2 ตุลาคม 2569 (ทำย้อนหลังได้)',
    examTimeText: '60 นาที (ชุดฝึกจำลอง · ทำเวลาใดก็ได้)',
    questionsCount: 30,
    regPeriodText: 'เปิดให้ทำข้อสอบฟรี',
    regStatus: 'open',
    regStatusText: 'พร้อมเข้าสอบย้อนหลังได้ทันที',
    announcementDateText: 'เฉลยและวิเคราะห์ Cognitive Level ทันทีหลังส่ง',
    fee: 'ฟรีสำหรับสมาชิก',
    description: 'ข้อสอบจำลองที่จัดทำขึ้นเสริม (30 ข้อ 10 STEMs) แยกจากคลังข้อสอบจริง ศ.ป.ท. และ สนทท. เจาะลึกสถานพยาบาล กฎหมาย CDEC สิทธิผู้ป่วย เวชระเบียน & PDPA ทันตนิติเวช DVI และการประเมินอายุ',
    subjects: [
      { name: 'พ.ร.บ. วิชาชีพทันตกรรม สถานพยาบาล & จรรยาบรรณ (STEM 1–8)', items: '24 ข้อ (ใบอนุญาต 10 ปี/2 ปี, โฆษณา, CDEC 100 หน่วย, สิทธิผู้ป่วย, PDPA)' },
      { name: 'นิติทันตวิทยา Forensic Odontology (STEM 9–10)', items: '6 ข้อ (DVI INTERPOL Primary Identifiers, การประเมินอายุ & ABFO Bite Marks)' },
    ],
    quickAction: {
      label: 'เริ่มสอบ Mock เสริม ชุดที่ 4 (30 ข้อ)',
      actionType: 'exam_dsat_4',
      category: 'กฎหมายและจรรยาบรรณ',
      source_exam: 'DSAT Mock Law ชุดที่ 4 (2570)',
      exam_origin: 'ai_mock',
      count: 30
    }
  },
  {
    id: 'law-3-2569',
    title: 'สอบวิชากฎหมายที่เกี่ยวข้องกับวิชาชีพทันตกรรม',
    series: 'ครั้งที่ 3/2569',
    shortLabel: 'กฎหมาย 3/2569',
    categoryGroup: 'official',
    type: 'law',
    icon: '⚖️',
    badge: 'รอบกฎหมาย 3/2569',
    targetDate: '2026-10-03T13:00:00+07:00',
    endDate: '2026-10-03T13:45:00+07:00',
    examDateText: 'วันเสาร์ที่ 3 ตุลาคม 2569',
    examTimeText: '13.00 – 13.45 น. (45 นาที)',
    questionsCount: 30,
    regPeriodText: '17 – 21 สิงหาคม 2569',
    regStartDate: '2026-08-17T00:00:00+07:00',
    regEndDate: '2026-08-21T23:59:59+07:00',
    regStatus: 'closed', // 'open', 'closed', 'upcoming'
    regStatusText: 'ปิดรับสมัครแล้ว (17–21 ส.ค. 2569)',
    announcementDateText: 'ประกาศผลแล้ว 15 ต.ค. 2569 (ตรวจผล 16–23 ต.ค. 2569)',
    fee: '900 บาท',
    officialUrl: 'https://cda.or.th/ดูบทความ-222049-ประกาศศูนย์ประเมินและรับรองความรู้ความสามารถในการประกอบวิชาช.html',
    description: 'การสอบประเมินความรู้ด้านกฎหมายทันตกรรม จรรยาบรรณ และ พ.ร.บ. วิชาชีพทันตกรรม สำหรับขึ้นทะเบียนใบอนุญาต (เลื่อนวันรับสมัครจากเดิม 3–7 ส.ค. เป็น 17–21 ส.ค. 2569 และประกาศผลแล้ว 15 ต.ค. 2569)',
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
    title: 'สอบประเมินความรู้ฯ เพื่อขึ้นทะเบียนและรับใบอนุญาต',
    series: 'ครั้งที่ 1 ปี 2570',
    shortLabel: 'ครั้งที่ 1 ปี 2570',
    categoryGroup: 'official',
    type: 'nl',
    icon: '🎯',
    badge: 'ประกาศรับสมัคร 29 ต.ค. 2569',
    targetDate: '2027-01-09T08:00:00+07:00',
    endDate: '2027-01-10T17:20:00+07:00',
    examDateText: '9 – 10 มกราคม 2570 (เสาร์ – อาทิตย์)',
    examTimeText: '9 ม.ค. 08.00–18.20 น. · 10 ม.ค. 08.00–17.20 น.',
    questionsCount: 630,
    regPeriodText: '4 – 13 พฤศจิกายน 2569',
    regStartDate: '2026-11-04T00:00:00+07:00',
    regEndDate: '2026-11-13T16:30:00+07:00',
    regStatus: 'closed',
    regStatusText: 'ปิดรับสมัครแล้ว (4–13 พ.ย. 2569 · ชำระเงินภายใน 16.30 น.)',
    announcementDateText: 'ภายในวันที่ 31 มกราคม 2570',
    fee: 'ภาค 1: 5,000 บ. · ภาค 2: 5,000 บ. · กฎหมาย: 900 บ.',
    officialUrl: 'https://cda.or.th/ดูบทความ-228899-ประกาศศูนย์ประเมินและรับรองความรู้ความสามารถในการประกอบวิชาช.html',
    description: 'การสอบประเมินความรู้ภาคที่ 1 (พื้นฐาน 300 ข้อ) และภาคที่ 2 (คลินิก 300 ข้อ) ระหว่าง 9–10 ม.ค. 2570 และวิชากฎหมาย (30 ข้อ) เฉพาะวันที่ 9 ม.ค. 2570 · ประกาศรับสมัครฉบับลงวันที่ 29 ต.ค. 2569 ปรับวันรับสมัครเป็น 4–13 พ.ย. 2569 (เดิม 28 ต.ค.–6 พ.ย. 2569)',
    parts: [
      { date: 'เสาร์ 9 ม.ค. 2570 (08.00–12.20 น.)', title: 'ภาค 1: วิทยาศาสตร์การแพทย์และทันตแพทย์พื้นฐาน', count: 300 },
      { date: 'เสาร์ 9 ม.ค. 2570 (13.00–17.20 น.)', title: 'ภาค 2: วิทยาคลินิกทันตกรรม', count: 300 },
      { date: 'เสาร์ 9 ม.ค. 2570 (17.35–18.20 น.)', title: 'วิชากฎหมายที่เกี่ยวข้องกับวิชาชีพทันตกรรม', count: 30 },
      { date: 'อาทิตย์ 10 ม.ค. 2570 (08.00–12.20 น.)', title: 'ภาค 1: วิทยาศาสตร์การแพทย์และทันตแพทย์พื้นฐาน', count: 300 },
      { date: 'อาทิตย์ 10 ม.ค. 2570 (13.00–17.20 น.)', title: 'ภาค 2: วิทยาคลินิกทันตกรรม', count: 300 },
    ],
    centers: [
      { name: 'จุฬาลงกรณ์มหาวิทยาลัย', seats: 130 },
      { name: 'มหาวิทยาลัยมหิดล (รับเฉพาะนักศึกษา มม.)', seats: 113 },
      { name: 'มหาวิทยาลัยเชียงใหม่', seats: 80 },
      { name: 'มหาวิทยาลัยขอนแก่น', seats: 120 },
      { name: 'มหาวิทยาลัยสงขลานครินทร์ (รับเฉพาะนักศึกษา ม.อ.)', seats: 54 },
      { name: 'มหาวิทยาลัยศรีนครินทรวิโรฒ (รับเฉพาะนิสิต มศว)', seats: 65 },
      { name: 'มหาวิทยาลัยธรรมศาสตร์ (รับเฉพาะนักศึกษา มธ.)', seats: 70 },
      { name: 'มหาวิทยาลัยนเรศวร (รับเฉพาะนิสิต มน.)', seats: 74 },
      { name: 'มหาวิทยาลัยรังสิต (พื้นฐาน รับเฉพาะนักศึกษา มรส.)', seats: 130 },
      { name: 'มหาวิทยาลัยเวสเทิร์น (รับเฉพาะนิสิต มท.)', seats: 75 },
      { name: 'มหาวิทยาลัยแม่ฟ้าหลวง (รับเฉพาะนักศึกษา มฟล.)', seats: 45 },
      { name: 'มหาวิทยาลัยพะเยา (รับเฉพาะนิสิต มพ.)', seats: 60 },
      { name: 'มหาวิทยาลัยเทคโนโลยีสุรนารี (รับเฉพาะนักศึกษา มทส.)', seats: 45 },
      { name: 'มหาวิทยาลัยกรุงเทพธนบุรี', seats: 85 },
      { name: 'มหาวิทยาลัยวลัยลักษณ์ (รับเฉพาะนักศึกษา มวล.)', seats: 40 },
      { name: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (รับเฉพาะนักศึกษา สจล.)', seats: 28 },
    ],
    quickAction: {
      label: 'จำลองสอบ Full Exam Day 1',
      actionType: 'exam_day1',
      count: 150
    }
  },
  {
    id: 'nl-2-2570',
    title: 'สอบประเมินความรู้ฯ เพื่อขึ้นทะเบียนและรับใบอนุญาต',
    series: 'ครั้งที่ 2 ปี 2570',
    shortLabel: 'ครั้งที่ 2 ปี 2570',
    categoryGroup: 'official',
    type: 'nl',
    icon: '🎯',
    badge: 'กำหนดการปี 2570 · รอประกาศรับสมัคร',
    targetDate: '2027-03-13T08:00:00+07:00',
    endDate: '2027-03-14T17:20:00+07:00',
    examDateText: '13 – 14 มีนาคม 2570 (เสาร์ – อาทิตย์)',
    examTimeText: '13 มี.ค. 08.00–18.20 น. · 14 มี.ค. 08.00–17.20 น.',
    questionsCount: 630,
    regPeriodText: '8 – 12 กุมภาพันธ์ 2570',
    regStartDate: '2027-02-08T00:00:00+07:00',
    regEndDate: '2027-02-12T23:59:59+07:00',
    regStatus: 'upcoming',
    regStatusText: 'เปิดรับสมัคร 8 ก.พ. 2570',
    announcementDateText: 'ตามที่ ศ.ป.ท. ประกาศ (รอประกาศรับสมัคร ครั้งที่ 2 ปี 2570)',
    fee: 'ตามระเบียบ ศ.ป.ท. (ครั้งที่ 1 ปี 2570: 5,000 / 5,000 / 900 บ.)',
    officialUrl: 'https://cda.or.th/ดูบทความ-213222-ประกาศศูนย์ประเมินและรับรองความรู้ความสามารถในการประกอบวิชาช.html',
    description: 'การสอบประเมินความรู้ภาคที่ 1 และ ภาคที่ 2 ระหว่าง 13–14 มี.ค. 2570 พร้อมวิชากฎหมายเฉพาะวันที่ 13 มี.ค. 2570 (อ้างอิงประกาศ 29 เม.ย. 2569 · ศ.ป.ท. ขอสงวนสิทธิ์ปรับวันรับสมัคร/วันสอบตามความเหมาะสม)',
    parts: [
      { date: 'เสาร์ 13 มี.ค. 2570 (08.00–12.20 น.)', title: 'ภาค 1: วิทยาศาสตร์การแพทย์และทันตแพทย์พื้นฐาน', count: 300 },
      { date: 'เสาร์ 13 มี.ค. 2570 (13.00–17.20 น.)', title: 'ภาค 2: วิทยาคลินิกทันตกรรม', count: 300 },
      { date: 'เสาร์ 13 มี.ค. 2570 (17.35–18.20 น.)', title: 'วิชากฎหมายที่เกี่ยวข้องกับวิชาชีพทันตกรรม', count: 30 },
      { date: 'อาทิตย์ 14 มี.ค. 2570 (08.00–12.20 น.)', title: 'ภาค 1: วิทยาศาสตร์การแพทย์และทันตแพทย์พื้นฐาน', count: 300 },
      { date: 'อาทิตย์ 14 มี.ค. 2570 (13.00–17.20 น.)', title: 'ภาค 2: วิทยาคลินิกทันตกรรม', count: 300 },
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
    shortLabel: 'กฎหมาย 3/2570',
    categoryGroup: 'official',
    type: 'law',
    icon: '⚖️',
    badge: 'กำหนดการปี 2570 · รอประกาศรับสมัคร',
    targetDate: '2027-10-02T13:00:00+07:00',
    endDate: '2027-10-02T13:45:00+07:00',
    examDateText: 'วันเสาร์ที่ 2 ตุลาคม 2570',
    examTimeText: '13.00 – 13.45 น. (45 นาที)',
    questionsCount: 30,
    regPeriodText: '9 – 13 สิงหาคม 2570',
    regStartDate: '2027-08-09T00:00:00+07:00',
    regEndDate: '2027-08-13T23:59:59+07:00',
    regStatus: 'upcoming',
    regStatusText: 'เปิดรับสมัคร 9 ส.ค. 2570',
    announcementDateText: 'ตามที่ ศ.ป.ท. ประกาศ (รอประกาศรับสมัคร 3/2570)',
    fee: '900 บาท (อัตราตามประกาศ ศ.ป.ท.)',
    officialUrl: 'https://cda.or.th/ดูบทความ-213222-ประกาศศูนย์ประเมินและรับรองความรู้ความสามารถในการประกอบวิชาช.html',
    description: 'การสอบวิชากฎหมายเฉพาะวิชา ครั้งที่ 3 ประจำปี 2570 (อ้างอิงประกาศ 29 เม.ย. 2569 · ศ.ป.ท. ขอสงวนสิทธิ์ปรับวันรับสมัคร/วันสอบตามความเหมาะสม)',
    quickAction: {
      label: 'ฝึกข้อสอบกฎหมาย 30 ข้อ',
      actionType: 'exam_law',
      category: 'กฎหมายและจรรยาบรรณ',
      count: 30
    }
  }
];

/**
 * คำนวณความแตกต่างของเวลาเทียบกับเวลาปัจจุบัน
 * รองรับทั้งสถานะกำลังจะถึง (upcoming), กำลังสอบ (in_progress) และผ่านกำหนดการสอบมาแล้ว (passed)
 */
export function calculateTimeRemaining(targetIsoDate, endIsoDate = null, nowMs = Date.now()) {
  const target = new Date(targetIsoDate).getTime();
  const fallbackEnd = target + 60 * 60 * 1000;
  const end = endIsoDate ? new Date(endIsoDate).getTime() : fallbackEnd;
  const diff = target - nowMs;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      status: 'upcoming',
      isExpired: false,
      isPassed: false,
      isInProgress: false,
      days,
      hours,
      minutes,
      seconds,
      totalDiffMs: diff,
      passedMs: 0,
      elapsedDays: 0,
      elapsedHours: 0,
      elapsedMinutes: 0
    };
  }

  if (nowMs <= end) {
    return {
      status: 'in_progress',
      isExpired: true,
      isPassed: false,
      isInProgress: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDiffMs: 0,
      passedMs: Math.max(0, nowMs - target),
      elapsedDays: 0,
      elapsedHours: 0,
      elapsedMinutes: Math.floor(Math.max(0, nowMs - target) / (1000 * 60))
    };
  }

  const passedMs = Math.max(0, nowMs - end);
  const elapsedDays = Math.floor(passedMs / (1000 * 60 * 60 * 24));
  const elapsedHours = Math.floor((passedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((passedMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    status: 'passed',
    isExpired: true,
    isPassed: true,
    isInProgress: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDiffMs: 0,
    passedMs,
    elapsedDays,
    elapsedHours,
    elapsedMinutes
  };
}

/**
 * แปลงระยะเวลาที่ผ่านกำหนดการสอบมาแล้วเป็นข้อความภาษาไทย
 */
export function formatElapsedSinceExam(timeInfo) {
  if (!timeInfo || !timeInfo.isPassed) return '';
  if (timeInfo.elapsedDays >= 1) {
    return `ผ่านมาแล้ว ${timeInfo.elapsedDays} วัน`;
  }
  if (timeInfo.elapsedHours >= 1) {
    return `ผ่านมาแล้ว ${timeInfo.elapsedHours} ชม.`;
  }
  return `ผ่านมาแล้ว ${Math.max(1, timeInfo.elapsedMinutes)} นาที`;
}

/**
 * ประเมินสถานะการรับสมัครแบบไดนามิกตามเวลาปัจจุบัน
 */
export function getDynamicRegStatus(exam, nowMs = Date.now()) {
  if (!exam) return { regStatus: 'closed', regStatusText: '' };
  if (exam.regStartDate && exam.regEndDate) {
    const start = new Date(exam.regStartDate).getTime();
    const end = new Date(exam.regEndDate).getTime();
    if (nowMs < start) {
      return { regStatus: 'upcoming', regStatusText: exam.regStatusText };
    }
    if (nowMs <= end) {
      return { regStatus: 'open', regStatusText: `กำลังเปิดรับสมัคร (${exam.regPeriodText})` };
    }
    return { regStatus: 'closed', regStatusText: `ปิดรับสมัครแล้ว (${exam.regPeriodText})` };
  }
  return { regStatus: exam.regStatus, regStatusText: exam.regStatusText };
}

/**
 * จัดเรียงตารางสอบทั้งหมด:
 * 1) รอบที่กำลังสอบหรือใกล้จะถึงที่สุดขึ้นก่อนเสมอ (น้อย -> มาก ตามวันสอบ)
 * 2) รอบที่ผ่านกำหนดการสอบไปแล้วต่อท้าย (ล่าสุด -> เก่าสุด) พร้อมสถานะชัดเจน
 */
export function getOrderedExamSchedules(nowMs = Date.now()) {
  const rankOrder = { in_progress: 0, upcoming: 1, passed: 2 };

  return EXAM_SCHEDULES
    .map(exam => {
      const timing = calculateTimeRemaining(exam.targetDate, exam.endDate, nowMs);
      const dynamicReg = getDynamicRegStatus(exam, nowMs);
      return {
        ...exam,
        ...dynamicReg,
        timing,
        targetMs: new Date(exam.targetDate).getTime()
      };
    })
    .sort((a, b) => {
      const rankDiff = rankOrder[a.timing.status] - rankOrder[b.timing.status];
      if (rankDiff !== 0) return rankDiff;
      if (a.timing.status === 'passed') {
        return b.targetMs - a.targetMs;
      }
      return a.targetMs - b.targetMs;
    });
}

/**
 * ดึงรอบสอบแรกที่ใกล้จะถึงที่สุด (หรือกำลังสอบอยู่ / ล่าสุดหากผ่านหมดแล้ว)
 */
export function getPrimaryUpcomingExam(nowMs = Date.now()) {
  const ordered = getOrderedExamSchedules(nowMs);
  return ordered[0] || null;
}

const LEGACY_SESSION_LABEL_MAP = {
  'NL 1/2570': 'ครั้งที่ 1 ปี 2570',
  'ครั้งที่ 1/2570': 'ครั้งที่ 1 ปี 2570',
  'NL 2/2570': 'ครั้งที่ 2 ปี 2570',
  'ครั้งที่ 2/2570': 'ครั้งที่ 2 ปี 2570',
};

/**
 * แปลงชื่อรอบสอบเป้าหมายจากรูปแบบเดิม (เช่น NL 1/2570) ให้เป็นรูปแบบมาตรฐานเพื่อไม่ให้สับสนกับ NL1/NL2
 */
export function normalizeExamSessionLabel(label) {
  const trimmed = label ? String(label).trim() : '';
  if (!trimmed) return 'ครั้งที่ 1 ปี 2570';
  return LEGACY_SESSION_LABEL_MAP[trimmed] || trimmed;
}
