import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X, User, GraduationCap, Target, ShieldCheck, Lock, Mail,
  CheckCircle2, AlertCircle, Calendar, Sparkles, LogOut, Loader2,
  BookOpen, Award, Flame, Check, Smartphone, KeyRound, Copy, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';
import { EXAM_SCHEDULES, calculateTimeRemaining, normalizeExamSessionLabel } from '../data/examSchedule';

const DENTAL_SCHOOLS = [
  'ไม่ระบุ / เลือกสถาบัน',
  'คณะทันตแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย (CU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยมหิดล (MU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่ (CMU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยขอนแก่น (KKU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยสงขลานครินทร์ (PSU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ (SWU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์ (TU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยนเรศวร (NU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยพะเยา (UP)',
  'สำนักวิชาทันตแพทยศาสตร์ มหาวิทยาลัยแม่ฟ้าหลวง (MFU)',
  'วิทยาลัยทันตแพทยศาสตร์นานาชาติ มหาวิทยาลัยวลัยลักษณ์ (WU)',
  'สำนักวิชาทันตแพทยศาสตร์ มหาวิทยาลัยเทคโนโลยีสุรนารี (SUT)',
  'วิทยาลัยทันตแพทยศาสตร์ มหาวิทยาลัยรังสิต (RSU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยเวสเทิร์น (WTU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยกรุงเทพธนบุรี (BTU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยเนชั่น (NTU)',
  'คณะทันตแพทยศาสตร์ มหาวิทยาลัยสยาม (SU)',
  'สถาบันต่างประเทศ / อื่นๆ',
];

const ACADEMIC_YEARS = [
  'ชั้นปีที่ 4',
  'ชั้นปีที่ 5',
  'ชั้นปีที่ 6 (Extern)',
  'ทันตแพทย์จบใหม่',
  'ทันตแพทย์ทั่วไป',
];

const DAILY_GOAL_OPTIONS = [10, 20, 30, 50];
const SCORE_PRESETS = [
  { value: 60, label: '60% เกณฑ์ผ่าน' },
  { value: 70, label: '70% มาตรฐาน' },
  { value: 75, label: '75% แนะนำ' },
  { value: 85, label: '85% คะแนนสูง' },
];

const DEFAULT_PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    tagline: 'เปิดใช้งานฟรีครบทุกฟีเจอร์สำหรับผู้เตรียมสอบทุกคน ไม่มีค่าใช้จ่าย',
    price_thb: 0,
    billing_period: 'ฟรี',
    badge: 'กำลังใช้งานอยู่ · ฟรีทั้งหมด',
    available_now: true,
    features: [
      'เข้าถึงคลังข้อสอบจริงและข้อสอบจำลองครบทุกชุด ไม่จำกัดจำนวนครั้ง',
      'เฉลยละเอียดรายตัวเลือก พร้อมสรุปคลินิกและแผนผัง Clinical Pathway ครบทุกหัวข้อ',
      'ใช้งาน Calc Lab คำนวณคลินิก, Cloze & กับดักข้อสอบ และสรุปกฎหมายทันตแพทยสภา',
      'ระบบทบทวนข้อที่เคยทำผิดอัตโนมัติ (SM-2), บุ๊กมาร์ก และสถิติวิเคราะห์จุดอ่อนรายสาขา',
      'ดูตารางกำหนดการสอบและตัวนับถอยหลัง ศ.ป.ท. พร้อมตั้งเป้าหมายส่วนตัว',
    ],
  },
];

const LOCAL_PREF_KEY = 'nl_profile_prefs_v1';

function loadLocalProfilePrefs() {
  try {
    const raw = localStorage.getItem(LOCAL_PREF_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function AccountModal({
  isOpen,
  onClose,
  initialTab = 'profile',
  onOpenAuthModal,
}) {
  const {
    user,
    logout,
    authFetch,
    updateProfile,
    changePassword,
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
  } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab || 'profile');

  const upcomingExamOptions = useMemo(() => {
    const upcoming = EXAM_SCHEDULES.filter(item => {
      const t = calculateTimeRemaining(item.targetDate, item.endDate);
      return !t.isPassed;
    });
    return (upcoming.length > 0 ? upcoming : EXAM_SCHEDULES.slice(0, 3)).map(item => ({
      id: item.shortLabel || item.series,
      title: item.shortLabel || item.series,
      dateText: item.examDateText,
      daysLeft: calculateTimeRemaining(item.targetDate, item.endDate).days,
    }));
  }, []);

  // Form state for Profile & Study Targets
  const [profileForm, setProfileForm] = useState({
    display_name: '',
    dental_school: '',
    academic_year: 'ชั้นปีที่ 6 (Extern)',
    target_exam_session: 'ครั้งที่ 1 ปี 2570',
    target_score_pct: 75,
    daily_goal_questions: 20,
  });

  // Security form state
  const [accountForm, setAccountForm] = useState({
    username: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Active plan & user study summary
  const [plansCatalog, setPlansCatalog] = useState({
    enforcement_mode: 'free',
    early_access_all_unlocked: true,
    disclaimer:
      'NL Dental Treasury เปิดให้บริการใช้งานคลังข้อสอบและเครื่องมือเตรียมสอบฟรีทั้งหมดภายใต้ Free Plan ไม่มีค่าใช้จ่าย (เว็บไซต์นี้ไม่เกี่ยวข้องกับค่าธรรมเนียมการสมัครสอบของ ศ.ป.ท.)',
    plans: DEFAULT_PLANS,
  });
  const [userStatsSummary, setUserStatsSummary] = useState(null);

  // Status feedback
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [securityMessage, setSecurityMessage] = useState(null);

  // 2FA management state
  const [twoFactorMode, setTwoFactorMode] = useState('idle'); // 'idle' | 'setup' | 'regenerate' | 'disable'
  const [twoFactorSetupData, setTwoFactorSetupData] = useState(null);
  const [twoFactorOtpInput, setTwoFactorOtpInput] = useState('');
  const [backupCodesList, setBackupCodesList] = useState(null);
  const [disable2faForm, setDisable2faForm] = useState({ currentPassword: '', code: '' });
  const [regenOtpCode, setRegenOtpCode] = useState('');
  const [twoFactorBusy, setTwoFactorBusy] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Populate form from authenticated user or localStorage fallback
  useEffect(() => {
    if (!isOpen) {
      setTwoFactorMode('idle');
      setTwoFactorSetupData(null);
      setTwoFactorOtpInput('');
      setBackupCodesList(null);
      setDisable2faForm({ currentPassword: '', code: '' });
      setRegenOtpCode('');
      return;
    }
    setProfileMessage(null);
    setSecurityMessage(null);
    const localPrefs = loadLocalProfilePrefs();

    if (user) {
      setProfileForm({
        display_name: user.display_name ?? localPrefs.display_name ?? '',
        dental_school: user.dental_school ?? localPrefs.dental_school ?? '',
        academic_year: user.academic_year ?? localPrefs.academic_year ?? 'ชั้นปีที่ 6 (Extern)',
        target_exam_session: normalizeExamSessionLabel(user.target_exam_session ?? localPrefs.target_exam_session),
        target_score_pct: user.target_score_pct ?? localPrefs.target_score_pct ?? 75,
        daily_goal_questions: user.daily_goal_questions ?? localPrefs.daily_goal_questions ?? 20,
      });
      setAccountForm({
        username: user.username || '',
        email: user.email || '',
      });
    } else {
      setProfileForm({
        display_name: localPrefs.display_name || '',
        dental_school: localPrefs.dental_school || '',
        academic_year: localPrefs.academic_year || 'ชั้นปีที่ 6 (Extern)',
        target_exam_session: normalizeExamSessionLabel(localPrefs.target_exam_session),
        target_score_pct: localPrefs.target_score_pct ?? 75,
        daily_goal_questions: localPrefs.daily_goal_questions ?? 20,
      });
    }
  }, [isOpen, user]);

  // Fetch subscription catalog & user stats when modal opens
  useEffect(() => {
    if (!isOpen) return;
    fetch(`${API_BASE}/api/auth/subscription-plans`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.plans)) setPlansCatalog(data);
      })
      .catch(() => {});

    if (user && authFetch) {
      authFetch(`${API_BASE}/api/tracking/stats`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data) setUserStatsSummary(data);
        })
        .catch(() => {});
    } else {
      setUserStatsSummary(null);
    }
  }, [isOpen, user, authFetch]);

  if (!isOpen) return null;

  const selectedExamMeta =
    upcomingExamOptions.find(e => e.id === profileForm.target_exam_session) ||
    upcomingExamOptions[0];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      localStorage.setItem(LOCAL_PREF_KEY, JSON.stringify(profileForm));
      if (user && updateProfile) {
        await updateProfile(profileForm);
        setProfileMessage({
          type: 'success',
          text: 'บันทึกข้อมูลโปรไฟล์และเป้าหมายการสอบลงบัญชีเรียบร้อยแล้ว',
        });
      } else {
        setProfileMessage({
          type: 'success',
          text: 'บันทึกเป้าหมายการสอบบนอุปกรณ์นี้แล้ว (เข้าสู่ระบบเพื่อซิงก์ข้อมูลข้ามอุปกรณ์)',
        });
      }
      window.dispatchEvent(new CustomEvent('nl-profile-updated', { detail: profileForm }));
    } catch (err) {
      setProfileMessage({
        type: 'error',
        text: err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAccountIdentity = async (e) => {
    e.preventDefault();
    if (!user || !updateProfile) return;
    setSavingSecurity(true);
    setSecurityMessage(null);
    try {
      await updateProfile({
        username: accountForm.username.trim(),
        email: accountForm.email.trim(),
      });
      setSecurityMessage({
        type: 'success',
        text: 'อัปเดตชื่อผู้ใช้งานและอีเมลเรียบร้อยแล้ว',
      });
    } catch (err) {
      setSecurityMessage({
        type: 'error',
        text: err.message || 'ไม่สามารถอัปเดตข้อมูลบัญชีได้',
      });
    } finally {
      setSavingSecurity(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user || !changePassword) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSecurityMessage({
        type: 'error',
        text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน',
      });
      return;
    }
    setSavingSecurity(true);
    setSecurityMessage(null);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSecurityMessage({
        type: 'success',
        text: 'เปลี่ยนรหัสผ่านใหม่เรียบร้อยแล้ว',
      });
    } catch (err) {
      setSecurityMessage({
        type: 'error',
        text: err.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
      });
    } finally {
      setSavingSecurity(false);
    }
  };

  const copyTextSafely = async (text, onCopied) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        onCopied(true);
        setTimeout(() => onCopied(false), 1800);
      }
    } catch {
      // Clipboard API may be unavailable in restricted contexts
    }
  };

  const runTwoFactorAction = async (action, fallbackError) => {
    setTwoFactorBusy(true);
    setSecurityMessage(null);
    try {
      await action();
    } catch (err) {
      setSecurityMessage({
        type: 'error',
        text: err.message || fallbackError,
      });
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const handleStartTwoFactorSetup = () => {
    if (!setupTwoFactor) return;
    setBackupCodesList(null);
    return runTwoFactorAction(async () => {
      const data = await setupTwoFactor();
      setTwoFactorSetupData(data);
      setTwoFactorOtpInput('');
      setTwoFactorMode('setup');
      setTimeout(() => {
        document.getElementById('account-2fa-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }, 'ไม่สามารถเริ่มต้นตั้งค่า 2FA ได้');
  };

  const handleConfirmEnableTwoFactor = (e) => {
    e.preventDefault();
    if (!enableTwoFactor) return;
    return runTwoFactorAction(async () => {
      const data = await enableTwoFactor(twoFactorOtpInput.trim());
      setBackupCodesList(data.backup_codes || []);
      setTwoFactorSetupData(null);
      setTwoFactorOtpInput('');
      setTwoFactorMode('idle');
      setSecurityMessage({
        type: 'success',
        text: 'เปิดใช้งานการยืนยันตัวตน 2 ชั้น (2FA) สำเร็จแล้ว กรุณาเก็บรหัสสำรองไว้ในที่ปลอดภัย',
      });
    }, 'รหัส OTP 6 หลักไม่ถูกต้อง');
  };

  const handleRegenerateBackupCodes = (e) => {
    e.preventDefault();
    if (!regenerateBackupCodes) return;
    return runTwoFactorAction(async () => {
      const data = await regenerateBackupCodes(regenOtpCode.trim());
      setBackupCodesList(data.backup_codes || []);
      setRegenOtpCode('');
      setTwoFactorMode('idle');
      setSecurityMessage({
        type: 'success',
        text: 'สร้างรหัสสำรอง (Backup Codes) ชุดใหม่ทั้ง 8 รหัสเรียบร้อยแล้ว (รหัสชุดเดิมถูกยกเลิกทันที)',
      });
    }, 'ไม่สามารถสร้างรหัสสำรองชุดใหม่ได้');
  };

  const handleDisableTwoFactor = (e) => {
    e.preventDefault();
    if (!disableTwoFactor) return;
    return runTwoFactorAction(async () => {
      await disableTwoFactor(disable2faForm.currentPassword, disable2faForm.code.trim());
      setBackupCodesList(null);
      setDisable2faForm({ currentPassword: '', code: '' });
      setTwoFactorMode('idle');
      setSecurityMessage({
        type: 'success',
        text: 'ปิดการใช้งานการยืนยันตัวตน 2 ชั้น (2FA) เรียบร้อยแล้ว',
      });
    }, 'ไม่สามารถปิดใช้งาน 2FA ได้');
  };

  const displayTitle =
    profileForm.display_name?.trim() ||
    user?.display_name ||
    user?.username ||
    'ผู้เรียน NL Dental Treasury';

  const avatarInitial = displayTitle.replace(/^(นทพ\.|ทพ\.|ทพญ\.)\s*/i, '').trim().charAt(0).toUpperCase() || 'N';

  const tierLabel = user?.role === 'admin'
    ? 'Admin · ผู้ดูแลระบบ'
    : 'Free Plan · ใช้ฟรีครบทุกฟีเจอร์';

  const freePlansOnly = (plansCatalog.plans || DEFAULT_PLANS).filter(p => p.id === 'free');
  const visiblePlans = freePlansOnly.length > 0 ? freePlansOnly : DEFAULT_PLANS;

  const registeredDateStr = user?.created_at
    ? new Date(Number(user.created_at) * 1000).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return createPortal(
    <div
      className="account-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="โปรไฟล์และการจัดการบัญชี"
    >
      <div
        className="account-modal-panel glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Identity Header ── */}
        <div className="account-modal-header">
          <div className="account-identity-row">
            <div className="account-avatar-badge" aria-hidden="true">
              {avatarInitial}
            </div>
            <div className="account-identity-meta">
              <div className="account-identity-top">
                <h2 className="account-identity-name">{displayTitle}</h2>
                <span className="account-tier-pill">
                  <Sparkles size={12} />
                  {tierLabel}
                </span>
              </div>
              <div className="account-identity-sub">
                {user ? (
                  <>
                    <span>@{user.username}</span>
                    <span>·</span>
                    <span>{user.email}</span>
                    {registeredDateStr && (
                      <>
                        <span>·</span>
                        <span>สมาชิกตั้งแต่ {registeredDateStr}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span>โหมดผู้เยี่ยมชม · ตั้งค่าเป้าหมายการสอบหรือเข้าสู่ระบบเพื่อซิงก์ข้อมูล</span>
                )}
              </div>
              <div className="account-goal-chips">
                {profileForm.academic_year && (
                  <span className="account-goal-chip">
                    <GraduationCap size={12} /> {profileForm.academic_year}
                  </span>
                )}
                {profileForm.dental_school && profileForm.dental_school !== DENTAL_SCHOOLS[0] && (
                  <span className="account-goal-chip">
                    {profileForm.dental_school.replace(/คณะทันตแพทยศาสตร์\s*|สำนักวิชาทันตแพทยศาสตร์\s*|วิทยาลัยทันตแพทยศาสตร์(นานาชาติ)?\s*/g, '')}
                  </span>
                )}
                <span className="account-goal-chip is-accent tabular-nums">
                  <Target size={12} /> เป้าหมาย {profileForm.target_exam_session} · {profileForm.target_score_pct}%
                  {selectedExamMeta && ` (อีก ${selectedExamMeta.daysLeft} วัน)`}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="header-icon-btn account-close-btn"
            onClick={onClose}
            aria-label="ปิดหน้าต่างโปรไฟล์"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Segmented Navigation Tabs ── */}
        <div className="account-tabs-bar" role="tablist" aria-label="หมวดหมู่การตั้งค่าบัญชี">
          {[
            { id: 'profile', label: 'โปรไฟล์ & เป้าหมายสอบ', Icon: User },
            { id: 'subscription', label: 'สิทธิ์การใช้งาน', badge: 'Free', Icon: Sparkles },
            { id: 'security', label: 'บัญชี & ความปลอดภัย', Icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.Icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`account-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.badge && <span className="account-tab-badge">{tab.badge}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Scrollable Body ── */}
        <div className="account-modal-body">
          {/* ══════════ TAB 1: PROFILE & STUDY GOALS ══════════ */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="account-section-stack">
              {!user && (
                <div className="account-guest-banner">
                  <div>
                    <strong>คุณกำลังใช้งานในโหมดผู้เยี่ยมชม</strong>
                    <p>คุณสามารถตั้งค่ารอบสอบและเป้าหมายคะแนนไว้บนเครื่องนี้ได้ทันที หรือเข้าสู่ระบบเพื่อผูกข้อมูลไว้กับบัญชีของคุณ</p>
                  </div>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onClose();
                        onOpenAuthModal();
                      }}
                    >
                      เข้าสู่ระบบ / สมัครสมาชิก
                    </button>
                  )}
                </div>
              )}

              {/* User Quick Study KPI Strip (if logged in & stats loaded) */}
              {user && userStatsSummary && (
                <div className="account-kpi-strip">
                  <div className="account-kpi-item">
                    <span className="account-kpi-label"><BookOpen size={13} /> ข้อที่เคยฝึกแล้ว</span>
                    <strong className="account-kpi-value tabular-nums">
                      {(userStatsSummary.total_answered || 0).toLocaleString()} ข้อ
                    </strong>
                  </div>
                  <div className="account-kpi-item">
                    <span className="account-kpi-label"><Award size={13} /> ความแม่นยำรวม</span>
                    <strong className="account-kpi-value tabular-nums" style={{ color: 'var(--primary-light)' }}>
                      {userStatsSummary.overall_accuracy != null ? `${Math.round(userStatsSummary.overall_accuracy)}%` : '—'}
                    </strong>
                  </div>
                  <div className="account-kpi-item">
                    <span className="account-kpi-label"><Flame size={13} /> จำนวนครั้งที่สอบ</span>
                    <strong className="account-kpi-value tabular-nums">
                      {(userStatsSummary.total_sessions || 0).toLocaleString()} ครั้ง
                    </strong>
                  </div>
                </div>
              )}

              <div className="account-form-grid">
                <div className="account-field">
                  <label htmlFor="acc-display-name">ชื่อที่แสดงบนโปรไฟล์ (Display Name)</label>
                  <input
                    id="acc-display-name"
                    type="text"
                    className="account-input"
                    placeholder="เช่น นทพ. ธีรภัทร หรือ ทพญ. พิมพ์ชนก"
                    maxLength={80}
                    value={profileForm.display_name}
                    onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                  />
                </div>

                <div className="account-field">
                  <label htmlFor="acc-dental-school">คณะทันตแพทยศาสตร์ / สถาบัน</label>
                  <select
                    id="acc-dental-school"
                    className="account-input"
                    value={profileForm.dental_school || DENTAL_SCHOOLS[0]}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        dental_school: e.target.value === DENTAL_SCHOOLS[0] ? '' : e.target.value,
                      })
                    }
                  >
                    {DENTAL_SCHOOLS.map((sch) => (
                      <option key={sch} value={sch}>
                        {sch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="account-field">
                <label>ชั้นปี / สถานะปัจจุบัน</label>
                <div className="account-pill-group">
                  {ACADEMIC_YEARS.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      className={`account-choice-pill ${profileForm.academic_year === yr ? 'active' : ''}`}
                      onClick={() => setProfileForm({ ...profileForm, academic_year: yr })}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="account-field">
                <label>รอบสอบ ศ.ป.ท. เป้าหมายของคุณ</label>
                <div className="account-exam-target-grid">
                  {upcomingExamOptions.map((ex) => {
                    const isSelected = profileForm.target_exam_session === ex.id;
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        className={`account-exam-target-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setProfileForm({ ...profileForm, target_exam_session: ex.id })}
                      >
                        <div className="account-exam-target-top">
                          <strong>{ex.title}</strong>
                          <span className="account-exam-days tabular-nums">อีก {ex.daysLeft} วัน</span>
                        </div>
                        <div className="account-exam-target-date">
                          <Calendar size={12} /> {ex.dateText}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="account-form-grid">
                <div className="account-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="acc-target-score">เป้าหมายคะแนนสอบ (%)</label>
                    <strong className="tabular-nums" style={{ color: 'var(--primary-light)', fontSize: '0.95rem' }}>
                      {profileForm.target_score_pct}%
                    </strong>
                  </div>
                  <input
                    id="acc-target-score"
                    type="range"
                    min="55"
                    max="95"
                    step="5"
                    value={profileForm.target_score_pct}
                    onChange={(e) => setProfileForm({ ...profileForm, target_score_pct: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <div className="account-pill-group" style={{ marginTop: '0.35rem' }}>
                    {SCORE_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        className={`account-choice-pill is-sm ${profileForm.target_score_pct === p.value ? 'active' : ''}`}
                        onClick={() => setProfileForm({ ...profileForm, target_score_pct: p.value })}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="account-field">
                  <label>เป้าหมายจำนวนข้อฝึกซ้อมต่อวัน</label>
                  <div className="account-pill-group">
                    {DAILY_GOAL_OPTIONS.map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        className={`account-choice-pill tabular-nums ${profileForm.daily_goal_questions === cnt ? 'active' : ''}`}
                        onClick={() => setProfileForm({ ...profileForm, daily_goal_questions: cnt })}
                      >
                        {cnt} ข้อ/วัน
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {profileMessage && (
                <div className={`account-alert ${profileMessage.type === 'error' ? 'is-error' : 'is-success'}`}>
                  {profileMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <div className="account-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  ปิดหน้าต่าง
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                  {savingProfile ? (
                    <>
                      <Loader2 size={16} className="spin" /> กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> บันทึกข้อมูลโปรไฟล์
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ══════════ TAB 2: FREE PLAN OVERVIEW ══════════ */}
          {activeTab === 'subscription' && (
            <div className="account-section-stack">
              <div className="account-early-access-banner">
                <div className="account-early-access-icon">
                  <Sparkles size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong>แพ็กเกจปัจจุบัน: Free Plan (ใช้งานฟรีทั้งหมด)</strong>
                    <span className="account-status-active-pill">เปิดครบทุกฟีเจอร์</span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                    ระบบเปิดให้บริการใช้งานคลังข้อสอบจริงและข้อสอบจำลองครบทุกชุด สรุปคลินิก สรุปกฎหมาย และเครื่องมือวิเคราะห์จุดอ่อนฟรี 100% ภายใต้ Free Plan โดยไม่มีค่าใช้จ่าย
                  </p>
                </div>
              </div>

              <div className={`account-plans-grid ${visiblePlans.length === 1 ? 'is-single' : ''}`}>
                {visiblePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="account-plan-card"
                  >
                    <div className="account-plan-top">
                      <span className="account-plan-badge">
                        {plan.badge}
                      </span>
                      <h3 className="account-plan-name">{plan.name}</h3>
                      <p className="account-plan-tagline">{plan.tagline}</p>
                    </div>

                    <div className="account-plan-price-row tabular-nums">
                      <span className="account-plan-price">ฟรี</span>
                      <span className="account-plan-period">(฿0 · ไม่มีค่าใช้จ่าย)</span>
                    </div>

                    <ul className="account-plan-features">
                      {(plan.features || []).map((feat, idx) => (
                        <li key={idx}>
                          <Check size={14} className="account-plan-check" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div style={{ marginTop: 'auto', paddingTop: '0.9rem' }}>
                      <button type="button" className="btn btn-secondary account-plan-cta" disabled>
                        กำลังใช้งาน Free Plan อยู่
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="account-sub-disclaimer">
                <ShieldCheck size={16} style={{ flexShrink: 0, color: 'var(--primary-light)', marginTop: '1px' }} />
                <div>
                  <strong>หมายเหตุเกี่ยวกับสิทธิ์การใช้งาน:</strong>{' '}
                  {plansCatalog.disclaimer}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3: ACCOUNT & SECURITY ══════════ */}
          {activeTab === 'security' && (
            <div className="account-section-stack">
              {!user ? (
                <div className="account-guest-banner" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <strong>ยังไม่ได้เข้าสู่ระบบบัญชีสมาชิก</strong>
                  <p>กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อจัดการอีเมล ชื่อผู้ใช้งาน และการตั้งค่ารหัสผ่าน</p>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        onOpenAuthModal();
                      }}
                    >
                      เข้าสู่ระบบ / สมัครสมาชิกใหม่
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <form onSubmit={handleSaveAccountIdentity} className="account-security-card">
                    <h3 className="account-card-title">
                      <Mail size={16} /> ข้อมูลบัญชีเข้าสู่ระบบ
                    </h3>
                    <div className="account-form-grid">
                      <div className="account-field">
                        <label htmlFor="acc-username">ชื่อผู้ใช้งาน (Username)</label>
                        <input
                          id="acc-username"
                          type="text"
                          className="account-input"
                          minLength={3}
                          maxLength={50}
                          required
                          value={accountForm.username}
                          onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                        />
                      </div>
                      <div className="account-field">
                        <label htmlFor="acc-email">อีเมล (Email)</label>
                        <input
                          id="acc-email"
                          type="email"
                          className="account-input"
                          required
                          value={accountForm.email}
                          onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                      <button type="submit" className="btn btn-secondary btn-sm" disabled={savingSecurity}>
                        อัปเดตชื่อผู้ใช้ / อีเมล
                      </button>
                    </div>
                  </form>

                  <form onSubmit={handlePasswordChange} className="account-security-card">
                    <h3 className="account-card-title">
                      <Lock size={16} /> เปลี่ยนรหัสผ่านใหม่
                    </h3>
                    <div className="account-form-grid">
                      <div className="account-field">
                        <label htmlFor="acc-cur-pw">รหัสผ่านปัจจุบัน</label>
                        <input
                          id="acc-cur-pw"
                          type="password"
                          className="account-input"
                          required
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        />
                      </div>
                      <div className="account-field">
                        <label htmlFor="acc-new-pw">รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร A-Z, a-z, 0-9, อักขระพิเศษ)</label>
                        <input
                          id="acc-new-pw"
                          type="password"
                          className="account-input"
                          required
                          minLength={8}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="account-field" style={{ marginTop: '0.65rem' }}>
                      <label htmlFor="acc-confirm-pw">ยืนยันรหัสผ่านใหม่อีกครั้ง</label>
                      <input
                        id="acc-confirm-pw"
                        type="password"
                        className="account-input"
                        required
                        minLength={8}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={savingSecurity}>
                        บันทึกรหัสผ่านใหม่
                      </button>
                    </div>
                  </form>

                  {/* 2-Factor Authentication Management Card */}
                  <div className="account-security-card account-2fa-card" id="account-2fa-section">
                    <div className="account-2fa-header">
                      <div>
                        <h3 className="account-card-title" style={{ marginBottom: '0.25rem' }}>
                          <Smartphone size={16} /> การยืนยันตัวตน 2 ชั้น (2FA / Authenticator)
                        </h3>
                        <p className="account-2fa-desc">
                          เพิ่มเกราะป้องกันอีกชั้นด้วยรหัส OTP 6 หลักจาก Google Authenticator, Apple Passwords หรือ Authy
                        </p>
                      </div>
                      <span className={`account-2fa-status-pill ${user.two_factor_enabled ? 'is-enabled' : 'is-disabled'}`}>
                        {user.two_factor_enabled ? 'เปิดใช้งานแล้ว' : 'ยังไม่เปิดใช้งาน'}
                      </span>
                    </div>

                    {backupCodesList && backupCodesList.length > 0 && (
                      <div className="account-2fa-backup-box">
                        <div className="account-2fa-backup-head">
                          <strong>รหัสสำรองแบบใช้ครั้งเดียว (Backup Recovery Codes)</strong>
                          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => copyTextSafely(backupCodesList.join('\n'), setCopiedBackup)}
                            >
                              <Copy size={13} /> {copiedBackup ? 'คัดลอกแล้ว' : 'คัดลอกทั้งหมด'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setBackupCodesList(null)}
                            >
                              ซ่อน
                            </button>
                          </div>
                        </div>
                        <p className="account-2fa-backup-note">
                          กรุณาบันทึกหรือคัดลอกเก็บไว้ในที่ปลอดภัย หากทำมือถือหายสามารถใช้ 1 รหัสนี้เข้าสู่ระบบได้ (แสดงให้ดูเพียงครั้งเดียว)
                        </p>
                        <div className="account-2fa-backup-grid">
                          {backupCodesList.map((code) => (
                            <code key={code} className="account-2fa-backup-code">{code}</code>
                          ))}
                        </div>
                      </div>
                    )}

                    {!user.two_factor_enabled ? (
                      twoFactorMode === 'setup' && twoFactorSetupData ? (
                        <form onSubmit={handleConfirmEnableTwoFactor} className="account-2fa-setup-grid">
                          <div className="account-2fa-qr-wrap">
                            <div className="account-2fa-qr-frame">
                              <img
                                src={twoFactorSetupData.qr_data_uri}
                                alt="QR Code สำหรับตั้งค่า 2FA"
                                className="account-2fa-qr-img"
                              />
                            </div>
                            <span className="account-2fa-qr-caption">สแกนผ่านแอป Authenticator</span>
                          </div>
                          <div className="account-2fa-setup-steps">
                            <div>
                              <div className="account-2fa-step-label">1. สแกน QR หรือกรอกรหัสลับด้วยตนเอง (Manual Key)</div>
                              <div className="account-2fa-secret-row">
                                <code className="account-2fa-secret-code">{twoFactorSetupData.secret}</code>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => copyTextSafely(twoFactorSetupData.secret, setCopiedSecret)}
                                >
                                  <Copy size={13} /> {copiedSecret ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              </div>
                            </div>

                            <div className="account-field">
                              <label htmlFor="acc-2fa-setup-otp">2. กรอกรหัส OTP 6 หลักที่แสดงในแอปเพื่อยืนยัน</label>
                              <input
                                id="acc-2fa-setup-otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={10}
                                required
                                placeholder="เช่น 123456"
                                className="account-input account-2fa-code-input"
                                value={twoFactorOtpInput}
                                onChange={(e) => setTwoFactorOtpInput(e.target.value)}
                              />
                            </div>

                            <div className="account-2fa-actions">
                              <button type="submit" className="btn btn-primary btn-sm" disabled={twoFactorBusy}>
                                {twoFactorBusy ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                                ยืนยันและเปิดใช้งาน 2FA
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                disabled={twoFactorBusy}
                                onClick={() => {
                                  setTwoFactorMode('idle');
                                  setTwoFactorSetupData(null);
                                  setTwoFactorOtpInput('');
                                }}
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        </form>
                      ) : (
                        <div className="account-2fa-actions" style={{ marginTop: '0.75rem' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={handleStartTwoFactorSetup}
                            disabled={twoFactorBusy}
                          >
                            {twoFactorBusy ? <Loader2 size={14} className="spin" /> : <KeyRound size={14} />}
                            ตั้งค่าและเปิดใช้งาน 2FA
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="account-2fa-active-body">
                        <div className="account-2fa-active-meta">
                          <span>
                            สถานะ: <strong style={{ color: 'var(--ink-emerald)' }}>ปกป้องบัญชีด้วย TOTP</strong>
                          </span>
                          <span className="account-2fa-sep">•</span>
                          <span>
                            รหัสสำรองคงเหลือ: <strong>{user.two_factor_backup_remaining ?? 0}</strong> รหัส
                          </span>
                        </div>

                        {twoFactorMode === 'idle' && (
                          <div className="account-2fa-actions">
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setTwoFactorMode('regenerate');
                                setRegenOtpCode('');
                                setSecurityMessage(null);
                              }}
                            >
                              <RefreshCw size={14} /> สร้างรหัสสำรองชุดใหม่
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setTwoFactorMode('disable');
                                setDisable2faForm({ currentPassword: '', code: '' });
                                setSecurityMessage(null);
                              }}
                            >
                              ปิดการใช้งาน 2FA
                            </button>
                          </div>
                        )}

                        {twoFactorMode === 'regenerate' && (
                          <form onSubmit={handleRegenerateBackupCodes} className="account-2fa-inline-form">
                            <div className="account-field">
                              <label htmlFor="acc-2fa-regen-otp">กรอกรหัส OTP 6 หลักจากแอป Authenticator เพื่อออกรหัสสำรองชุดใหม่ (ชุดเก่าจะถูกยกเลิก)</label>
                              <input
                                id="acc-2fa-regen-otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={10}
                                required
                                placeholder="รหัส 6 หลักล่าสุด"
                                className="account-input account-2fa-code-input"
                                value={regenOtpCode}
                                onChange={(e) => setRegenOtpCode(e.target.value)}
                              />
                            </div>
                            <div className="account-2fa-actions">
                              <button type="submit" className="btn btn-primary btn-sm" disabled={twoFactorBusy}>
                                {twoFactorBusy ? <Loader2 size={14} className="spin" /> : 'ยืนยันออกรหัสสำรองใหม่'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                disabled={twoFactorBusy}
                                onClick={() => setTwoFactorMode('idle')}
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </form>
                        )}

                        {twoFactorMode === 'disable' && (
                          <form onSubmit={handleDisableTwoFactor} className="account-2fa-inline-form">
                            <div className="account-form-grid">
                              <div className="account-field">
                                <label htmlFor="acc-2fa-disable-pw">รหัสผ่านปัจจุบัน</label>
                                <input
                                  id="acc-2fa-disable-pw"
                                  type="password"
                                  required
                                  className="account-input"
                                  value={disable2faForm.currentPassword}
                                  onChange={(e) => setDisable2faForm({ ...disable2faForm, currentPassword: e.target.value })}
                                />
                              </div>
                              <div className="account-field">
                                <label htmlFor="acc-2fa-disable-code">รหัส OTP 6 หลัก หรือ Backup Code</label>
                                <input
                                  id="acc-2fa-disable-code"
                                  type="text"
                                  required
                                  maxLength={20}
                                  placeholder="123456 หรือ XXXX-XXXX"
                                  className="account-input account-2fa-code-input"
                                  value={disable2faForm.code}
                                  onChange={(e) => setDisable2faForm({ ...disable2faForm, code: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="account-2fa-actions">
                              <button type="submit" className="btn btn-danger btn-sm" disabled={twoFactorBusy}>
                                {twoFactorBusy ? <Loader2 size={14} className="spin" /> : 'ยืนยันปิดใช้งาน 2FA'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                disabled={twoFactorBusy}
                                onClick={() => setTwoFactorMode('idle')}
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>

                  {securityMessage && (
                    <div className={`account-alert ${securityMessage.type === 'error' ? 'is-error' : 'is-success'}`}>
                      {securityMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                      <span>{securityMessage.text}</span>
                    </div>
                  )}

                  <div className="account-security-card is-danger-zone">
                    <div>
                      <strong>ออกจากระบบบัญชีนี้</strong>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        ข้อมูลความคืบหน้าและโน้ตที่บันทึกไว้ในบัญชีจะยังคงปลอดภัยเมื่อเข้าสู่ระบบครั้งถัดไป
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                    >
                      <LogOut size={15} /> ออกจากระบบ
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
