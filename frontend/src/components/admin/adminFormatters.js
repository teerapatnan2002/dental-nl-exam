export const STATUS_STYLES = {
  pending:   { label: 'รอตรวจสอบ', color: 'var(--ink-amber)', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.32)' },
  reviewing: { label: 'กำลังตรวจสอบ', color: 'var(--ink-sky)', bg: 'rgba(2,132,199,0.12)', border: 'rgba(2,132,199,0.32)' },
  resolved:  { label: 'แก้ไขแล้ว', color: 'var(--ink-emerald)', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.32)' },
  rejected:  { label: 'ไม่รับเรื่อง', color: 'var(--ink-rose)', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.32)' },
};

export const ISSUE_LABELS = {
  wrong_answer: 'เฉลยผิด',
  missing_stem: 'โจทย์/เนื้อหาไม่ครบถ้วน',
  missing_image: 'รูปภาพไม่แสดงหรือผิดพลาด',
  typo: 'พิมพ์ผิด / สะกดคำผิด',
  other: 'อื่นๆ',
};

export const TIER_META = {
  early_access: { label: 'Early Access', color: 'var(--ink-sky)', bg: 'rgba(2,132,199,0.12)' },
  pro_annual:   { label: 'Pro Annual', color: 'var(--ink-emerald)', bg: 'rgba(16,185,129,0.12)' },
  pro_monthly:  { label: 'Pro Monthly', color: 'var(--primary-light)', bg: 'rgba(59,130,246,0.12)' },
  free:         { label: 'Free', color: 'var(--text-muted)', bg: 'var(--surface-subtle)' },
};

export const SUB_STATUS_META = {
  active:   { label: 'Active', color: 'var(--ink-emerald)' },
  trialing: { label: 'Trial', color: 'var(--ink-sky)' },
  past_due: { label: 'Past Due', color: 'var(--ink-amber)' },
  canceled: { label: 'Canceled', color: 'var(--ink-rose)' },
  expired:  { label: 'Expired', color: 'var(--text-muted)' },
};

export const EXAM_ORIGIN_LABELS = {
  real_exam: 'ข้อสอบจริง (Real Exam)',
  dsat_mock: 'DSAT Mock',
  ai_mock: 'AI Mock',
  duplicate_archive: 'คลังข้อซ้ำ (Archive)',
};

export const MODE_LABELS = {
  exam: 'โหมดสอบจริง (Exam)',
  practice: 'โหมดฝึกฝน (Practice)',
  mock: 'จำลองสอบ (Mock)',
  category: 'รายสาขา (Category)',
  task: 'ราย Task',
  full: 'ชุดเต็ม (Full)',
  random: 'สุ่มข้อ (Random)',
};

export function toUnixSeconds(ts) {
  if (ts === null || ts === undefined || ts === '') return null;
  const n = Number(ts);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n > 10_000_000_000 ? Math.floor(n / 1000) : Math.floor(n);
}

export function formatThaiDateTime(ts) {
  const sec = toUnixSeconds(ts);
  if (!sec) return '-';
  try {
    return new Date(sec * 1000).toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return String(ts);
  }
}

export function formatThaiDate(ts) {
  const sec = toUnixSeconds(ts);
  if (!sec) return '-';
  try {
    return new Date(sec * 1000).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  } catch {
    return String(ts);
  }
}

export function formatRelativeTime(ts) {
  const sec = toUnixSeconds(ts);
  if (!sec) return 'ยังไม่เคยใช้งาน';
  const diffSec = Math.max(0, Math.floor(Date.now() / 1000) - sec);
  if (diffSec < 60) return 'เมื่อสักครู่';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} นาทีที่แล้ว`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ชม. ที่แล้ว`;
  const days = Math.floor(diffSec / 86400);
  if (days < 30) return `${days} วันที่แล้ว`;
  return formatThaiDate(sec);
}

export function formatSeconds(sec) {
  if (sec === null || sec === undefined) return '-';
  const rounded = Math.round(Number(sec));
  if (rounded < 60) return `${rounded} วิ`;
  const m = Math.floor(rounded / 60);
  const s = rounded % 60;
  return s > 0 ? `${m} น. ${s} วิ` : `${m} นาที`;
}

export function accuracyTone(pct) {
  if (pct === null || pct === undefined) return 'var(--text-muted)';
  if (pct >= 75) return 'var(--ink-emerald)';
  if (pct >= 60) return 'var(--ink-amber)';
  return 'var(--ink-rose)';
}

export function formatShortDay(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${Number(parts[2])}/${Number(parts[1])}`;
}

export function formatLatencyMs(ms) {
  if (ms === null || ms === undefined) return '-';
  const val = Number(ms);
  if (!Number.isFinite(val)) return '-';
  if (val >= 1000) return `${(val / 1000).toFixed(2)} วิ`;
  return `${Math.round(val)} ms`;
}

export const AUTH_EVENT_LABELS = {
  login_success: 'เข้าสู่ระบบสำเร็จ',
  login_fail: 'เข้าสู่ระบบไม่สำเร็จ',
  login_2fa_challenge: 'ส่งคำขอ 2FA',
  login_2fa_success: 'ยืนยัน 2FA สำเร็จ',
  login_2fa_fail: 'ยืนยัน 2FA ไม่ผ่าน',
  register: 'สมัครสมาชิกใหม่',
  password_change: 'เปลี่ยนรหัสผ่าน',
  password_change_fail: 'เปลี่ยนรหัสผ่านไม่ผ่าน',
  '2fa_enable': 'เปิดใช้งาน 2FA',
  '2fa_disable': 'ปิดใช้งาน 2FA',
  '2fa_backup_regen': 'สร้างรหัสสำรอง 2FA ใหม่',
  rate_limited: 'ถูกจำกัดอัตราการเข้าถึง (429)',
};

export const AUDIT_ACTION_LABELS = {
  admin_user_update: 'แก้ไขสิทธิ์ผู้ใช้งาน',
  admin_users_export: 'ส่งออก CSV ผู้ใช้งาน',
  admin_report_update: 'อัปเดตสถานะรายงานปัญหา',
  admin_question_edit: 'แก้ไขข้อสอบ/เฉลย',
  admin_question_sync_export: 'ส่งออก Sync Patch JSON',
  admin_question_sync_marked: 'ยืนยันซิงก์ข้อสอบแล้ว',
};
