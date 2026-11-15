/**
 * Shared Dynamic Pathway Extractor for Exam Explanations, Textbooks & Thai Protocols.
 * Converts prose mechanisms, pathogenesis chains, and clinical/legal protocols
 * into structured step-by-step Pathway node graphs with semantic roles.
 */

// Lookbehind-free sentence & numbered-step splitter for cross-browser compatibility (incl. Safari < 16.4)
const LINE_OR_NUMBERED_SPLIT = /\n+|(?=(?:\(\d+\)|\b\d+\.\s+[ก-ฮA-Z]))/g;

function splitLinesAndSentences(text) {
  return String(text || '')
    .replace(/([.!?])\s+(?=[A-Zก-ฮ0-9])/g, '$1\n')
    .split(LINE_OR_NUMBERED_SPLIT)
    .map(s => s.trim())
    .filter(Boolean);
}

// Thai causal, sequential, diagnostic & clinical protocol connectors
const THAI_CAUSAL_SPLIT = /(?=(?:เกิดจาก|มีสาเหตุจาก|ไปกระตุ้น|เหนี่ยวนำให้|กระตุ้นให้|ส่งผลให้|ทำให้เกิด|นำไปสู่|ลุกลาม|ต่อมา|จากนั้น|ขั้นตอนที่|ลำดับแรก|ดังนั้น|จึงต้อง|จึงควร|สามารถจัดการโดย|แนวทางการรักษา|แนวทางจัดการ|การรักษาคือ|เลือกใช้|เพื่อให้|เพื่อป้องกัน|เพื่อลด|ผลลัพธ์คือ|ในกรณีที่|หากพบว่า|แต่หาก|ส่วนกรณี|ข้อควรระวัง|ห้ามทำ|ควรหลีกเลี่ยง))/g;

function inferNodeMeta(text, idx, total, isLegal = false) {
  const low = String(text || '').toLowerCase();
  if (/ระวัง|ห้าม|ข้อห้าม|กับดัก|ผิดกฎหมาย|โทษ|อันตราย|พิษ|ภาวะแทรกซ้อน|หลีกเลี่ยง|pitfall|avoid|contra/i.test(low)) {
    return {
      stage: isLegal ? 'ข้อห้าม & บทลงโทษทางกฎหมาย' : 'จุดระวัง / ข้อห้ามสำคัญ',
      node_type: 'warning',
    };
  }
  if (/หาก|กรณีที่|ถ้า|เกณฑ์|ประเมิน|แยก|วินิจฉัย|ระดับ|inr|rdt|pka|stage|grade|vs|ขึ้นอยู่กับ/i.test(low)) {
    return {
      stage: isLegal ? 'เงื่อนไข & องค์ประกอบตามกฎหมาย' : 'จุดประเมิน & เกณฑ์ตัดสินใจ',
      node_type: 'decision',
    };
  }
  if (/จัดการโดย|รักษา|ฉีด|อุด|กรอ|ถอน|ผ่าตัด|จ่ายยา|ปิด|ยึด|ใช้ยา|จึงต้อง|จึงควร|เลือกใช้|protocol|ขั้นตอน|ดำเนินการ|ยื่นคำร้อง|สอบสวน/i.test(low)) {
    return {
      stage: isLegal ? 'ขั้นตอนดำเนินการทางกฎหมาย' : 'ขั้นตอนปฏิบัติ / Clinical Protocol',
      node_type: 'action',
    };
  }
  if (/เพื่อให้|เพื่อลด|ป้องกัน|ผลลัพธ์|สรุปคำตอบ|ส่งผลดี|เป้าหมาย|คำตอบที่ถูก/i.test(low)) {
    return {
      stage: 'ผลลัพธ์ & จุดมุ่งหมาย',
      node_type: 'outcome',
    };
  }
  if (idx === 0) {
    return {
      stage: isLegal ? 'ที่มา & ฐานกฎหมายหลัก' : 'จุดตั้งต้น / สาเหตุ (Trigger & Etiology)',
      node_type: 'trigger',
    };
  }
  if (idx === total - 1) {
    return {
      stage: isLegal ? 'บทสรุปข้อวินิจฉัย' : 'ผลลัพธ์ทางคลินิก (Clinical Outcome)',
      node_type: 'outcome',
    };
  }
  return {
    stage: isLegal ? 'หลักเกณฑ์พิจารณา' : 'กลไก & กระบวนการเกิด (Pathogenesis / Mechanism)',
    node_type: 'mechanism',
  };
}

function makeShortTitle(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= 68) return clean;
  // Try breaking gently on space before char 72
  const cut = clean.slice(0, 72);
  const lastSpace = cut.lastIndexOf(' ');
  const idx = lastSpace > 42 ? lastSpace : 68;
  return clean.slice(0, idx).replace(/[,:;.\-]+$/, '') + '...';
}

function mergeTinySegments(segments) {
  const merged = [];
  let buf = '';
  for (const raw of segments) {
    const s = String(raw || '').replace(/^\s*[-•*]\s*/, '').trim();
    if (!s) continue;
    if (!buf) {
      buf = s;
    } else if (buf.length < 75 || s.length < 45) {
      buf = `${buf} ${s}`.trim();
    } else {
      merged.push(buf);
      buf = s;
    }
  }
  if (buf) merged.push(buf);
  return merged;
}

export function buildDynamicPathwayFromText({
  title = 'แผนผังกลไกและขั้นตอนทางคลินิก (Clinical Pathway)',
  corePrinciple = '',
  keyTakeaway = '',
  clinicalPearl = '',
  commonPitfall = '',
  reference = '',
  category = '',
  task = '',
  isLegal = false,
} = {}) {
  const core = String(corePrinciple || '').trim();
  const takeaway = String(keyTakeaway || '').trim();
  if (!core && !takeaway) return null;

  let segments = splitLinesAndSentences(core);

  // If still 1-2 big blobs, split along Thai causal/protocol transitions
  const refined = [];
  for (const seg of segments) {
    if (seg.length > 130) {
      const sub = seg.split(THAI_CAUSAL_SPLIT).map(x => x.trim()).filter(Boolean);
      if (sub.length >= 2) {
        refined.push(...mergeTinySegments(sub));
        continue;
      }
    }
    refined.push(seg);
  }
  segments = mergeTinySegments(refined);

  // If still 1 long block > 160 chars, split neatly at mid-sentence spaces/commas
  if (segments.length === 1 && segments[0].length > 150) {
    const one = segments[0];
    const approxMid = one.indexOf(' ', Math.floor(one.length * 0.45));
    if (approxMid > 30 && approxMid < one.length - 30) {
      segments = [one.slice(0, approxMid).trim(), one.slice(approxMid + 1).trim()];
    }
  }

  // Cap primary mechanism segments at 5 so adding takeaway + pitfall stays digestible (<= 7 nodes)
  const baseSteps = segments.slice(0, 5);
  if (segments.length > 5) {
    baseSteps[4] = `${baseSteps[4]} ${segments.slice(5).join(' ')}`.trim();
  }

  const allNodesRaw = [...baseSteps];

  // Append Key Takeaway as terminal Decision/Outcome node if not redundant
  if (takeaway) {
    const alreadyCovered = allNodesRaw.some(s => s.includes(takeaway.slice(0, 35)));
    if (!alreadyCovered) {
      allNodesRaw.push(`🎯 สรุปข้อบ่งชี้ & คำตอบหลัก: ${takeaway}`);
    }
  }

  if (allNodesRaw.length < 2 && !clinicalPearl) {
    return null;
  }

  const total = allNodesRaw.length;
  const steps = allNodesRaw.map((txt, idx) => {
    const isFinalTakeaway = idx === total - 1 && txt.startsWith('🎯 สรุปข้อบ่งชี้');
    const meta = isFinalTakeaway
      ? { stage: 'คำตอบเป้าหมาย & กฎจำเข้าห้องสอบ', node_type: 'outcome' }
      : inferNodeMeta(txt, idx, total, isLegal);
    return {
      step_num: idx + 1,
      stage: meta.stage,
      title: makeShortTitle(txt.replace(/^🎯 สรุปข้อบ่งชี้ & คำตอบหลัก:\s*/, '')),
      detail: txt.replace(/^🎯 สรุปข้อบ่งชี้ & คำตอบหลัก:\s*/, ''),
      node_type: meta.node_type,
    };
  });

  if (commonPitfall) {
    steps.push({
      step_num: steps.length + 1,
      stage: 'กับดักข้อสอบที่มักสับสน (Pitfall Guard)',
      title: makeShortTitle(commonPitfall),
      detail: commonPitfall,
      node_type: 'warning',
    });
  }

  const pathwayType = isLegal || category.includes('กฎหมาย')
    ? 'legal'
    : /การเกิด|กลไก/.test(task) || /เกิดจาก|กระตุ้น|หลั่ง|อักเสบ/.test(core)
    ? 'pathogenesis'
    : /ขั้นตอน|จัดการ|รักษา/.test(task)
    ? 'protocol'
    : 'decision';

  return {
    id: `dyn-${title.slice(0, 20)}`,
    title,
    pathway_type: pathwayType,
    subtitle: clinicalPearl
      ? `💡 Clinical Pearl: ${clinicalPearl}`
      : `ลำดับกลไกและการตัดสินใจทางคลินิก${task ? ` • ${task}` : ''}`,
    reference,
    steps,
  };
}

export function buildPathwayFromThaiProtocol(thaiProtocol) {
  if (!thaiProtocol?.thai_protocol_highlights?.length) return null;
  const steps = thaiProtocol.thai_protocol_highlights.map((hl, idx) => {
    const clean = String(hl).replace(/^🇹🇭\s*/, '').trim();
    const meta = inferNodeMeta(clean, idx, thaiProtocol.thai_protocol_highlights.length, thaiProtocol.specialty?.includes('กฎหมาย'));
    return {
      step_num: idx + 1,
      stage: `เกณฑ์มาตรฐานไทย ข้อที่ ${idx + 1}`,
      title: makeShortTitle(clean),
      detail: clean,
      node_type: meta.node_type === 'trigger' ? 'action' : meta.node_type,
    };
  });

  return {
    id: `thai-proto-${thaiProtocol.id || 'default'}`,
    title: `🇹🇭 แนวทางเวชปฏิบัติประเทศไทย: ${thaiProtocol.thai_association || thaiProtocol.specialty}`,
    pathway_type: thaiProtocol.specialty?.includes('กฎหมาย') ? 'legal' : 'protocol',
    subtitle: thaiProtocol.title || 'สรุปข้อกำหนดและขั้นตอนปฏิบัติตามเกณฑ์สมาคมวิชาชีพทันตกรรมไทย',
    reference: (thaiProtocol.thai_references || [])[0] || thaiProtocol.thai_association || '',
    steps,
  };
}
