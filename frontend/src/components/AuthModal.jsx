import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, PhoneCall, KeyRound, ArrowLeft } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, verifyTwoFactorLogin, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotHelp, setShowForgotHelp] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState({
    active: false,
    challengeToken: '',
    code: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const passwordCriteria = [
    {
      id: 'length',
      label: 'อย่างน้อย 8 ตัวอักษร',
      met: formData.password.length >= 8,
    },
    {
      id: 'upper',
      label: 'ตัวพิมพ์ใหญ่ (A-Z)',
      met: /[A-Z]/.test(formData.password),
    },
    {
      id: 'lower',
      label: 'ตัวพิมพ์เล็ก (a-z)',
      met: /[a-z]/.test(formData.password),
    },
    {
      id: 'number',
      label: 'ตัวเลข (0-9)',
      met: /[0-9]/.test(formData.password),
    },
    {
      id: 'special',
      label: 'อักขระพิเศษ (!@#$...)',
      met: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(formData.password),
    },
  ];

  const metCount = passwordCriteria.filter(c => c.met).length;

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setFormData({ email: '', username: '', password: '', confirmPassword: '' });
      setError('');
      setIsLogin(true);
      setShowPassword(false);
      setShowForgotHelp(false);
      setTwoFactorStep({ active: false, challengeToken: '', code: '' });
    }
  }, [isOpen]);

  useEffect(() => {
    setPasswordStrength(metCount);
  }, [formData.password, metCount]);

  if (!isOpen) return null;

  const validateForm = () => {
    if (twoFactorStep.active) {
      const cleaned = twoFactorStep.code.trim();
      if (cleaned.length < 6) {
        setError('กรุณากรอกรหัส 6 หลักจากแอป Authenticator หรือรหัสสำรอง (XXXX-XXXX)');
        return false;
      }
      return true;
    }
    if (!isLogin) {
      if (!formData.username || formData.username.trim().length < 3) {
        setError('ชื่อผู้ใช้งานต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
        return false;
      }
      if (!formData.email || !formData.email.trim()) {
        setError('กรุณากรอกอีเมล');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
        return false;
      }
      const missing = passwordCriteria.filter(c => !c.met);
      if (missing.length > 0) {
        setError(`รหัสผ่านยังไม่ครบตามมาตรฐาน: ${missing[0].label}`);
        return false;
      }
    } else {
      if (!formData.email || !formData.email.trim()) {
        setError('กรุณากรอกอีเมลหรือชื่อผู้ใช้งาน');
        return false;
      }
      if (!formData.password) {
        setError('กรุณากรอกรหัสผ่าน');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (twoFactorStep.active) {
        await verifyTwoFactorLogin(twoFactorStep.challengeToken, twoFactorStep.code.trim());
        onClose();
        return;
      }
      if (isLogin) {
        const res = await login(formData.email, formData.password);
        if (res?.requires2fa && res.challengeToken) {
          setTwoFactorStep({ active: true, challengeToken: res.challengeToken, code: '' });
          return;
        }
      } else {
        await register(formData.email, formData.username, formData.password);
        window.dispatchEvent(new CustomEvent('nl-presence-refresh'));
      }
      onClose();
    } catch (err) {
      // Parse specific errors for better UI highlighting if needed
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (metCount <= 2) return 'var(--danger)';
    if (metCount <= 4) return 'var(--warning)';
    return 'var(--success)';
  };

  const getStrengthLabel = () => {
    if (formData.password.length === 0) return '';
    if (metCount <= 2) return 'ยังไม่ปลอดภัย (Weak)';
    if (metCount <= 4) return 'ปานกลาง (Medium)';
    return 'ปลอดภัยตามมาตรฐานสากล (Strong)';
  };

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(9, 9, 11, 0.72)', backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100000, padding: '1rem', boxSizing: 'border-box'
    }} onClick={onClose}>
      <div className="glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ 
        width: '100%', maxWidth: '460px', maxHeight: 'min(92vh, 660px)', padding: 0,
        position: 'relative', boxShadow: 'var(--shadow-elevated)',
        background: 'var(--bg-panel)',
        borderRadius: '14px', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', border: '1px solid var(--border-hover)'
      }}>
        
        {/* Header Area */}
        <div style={{ 
          background: 'var(--surface-subtle)',
          padding: '1.2rem 1.5rem 1rem', borderBottom: '1px solid var(--border)',
          position: 'relative', flexShrink: 0
        }}>
          <button 
            type="button"
            onClick={onClose} 
            aria-label="ปิดหน้าต่าง"
            className="header-icon-btn"
            style={{
              position: 'absolute', top: '0.9rem', right: '0.9rem',
              background: 'var(--bg-panel)', border: '1px solid var(--border)',
              color: 'var(--text-sub)', borderRadius: '8px',
            }}
          >
            <X size={17} />
          </button>

          <h2 style={{ margin: '0 0 0.25rem', paddingRight: '2.2rem', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)' }}>
            {twoFactorStep.active
              ? 'ยืนยันตัวตน 2 ชั้น (2FA)'
              : (isLogin ? 'เข้าสู่ระบบ (Sign In)' : 'สมัครสมาชิกใหม่ (Register)')}
          </h2>
          <p style={{ margin: 0, color: 'var(--text-sub)', fontSize: '0.84rem' }}>
            {twoFactorStep.active
              ? 'กรอกรหัส 6 หลักจากแอป Authenticator หรือรหัสสำรองแบบใช้ครั้งเดียว'
              : (isLogin ? 'เข้าสู่ระบบเพื่อทำข้อสอบและดูสถิติของคุณ' : 'กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบคลังข้อสอบ NL Dental Treasury')}
          </p>
        </div>

        {/* Form Body with Smooth Inner Scroll */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {error && (
            <div className="animate-fade-in" style={{
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--ink-rose)', padding: '0.75rem 1rem', borderRadius: '8px',
              marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
              fontSize: '0.85rem', lineHeight: 1.4
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> 
              <span>{error}</span>
            </div>
          )}

          {/* Contact box for forgot password in login mode */}
          {isLogin && showForgotHelp && (
            <div className="animate-fade-in" style={{
              background: 'var(--primary-surface)',
              border: '1px solid var(--primary-border)',
              borderRadius: '8px',
              padding: '0.75rem 0.9rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.85rem',
              color: 'var(--text)'
            }}>
              <PhoneCall size={17} color="var(--primary-light)" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ color: 'var(--text-sub)' }}>กรณีลืมรหัสผ่าน กรุณาติดต่อผู้ดูแล: </span>
                <a href="tel:0622594952" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'underline' }}>
                  062-259-4952
                </a>
              </div>
            </div>
          )}

          {twoFactorStep.active ? (
            <form onSubmit={handleSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '0.8rem 0.95rem',
                borderRadius: '10px',
                background: 'var(--primary-surface)',
                border: '1px solid var(--primary-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                fontSize: '0.82rem',
                color: 'var(--text)'
              }}>
                <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>บัญชีของคุณเปิดใช้งาน 2FA อยู่</div>
                  <div style={{ color: 'var(--text-sub)', fontSize: '0.77rem' }}>
                    ตรวจสอบรหัสผ่านสำเร็จแล้ว กรุณายืนยันรหัส OTP 6 หลักเพื่อเข้าสู่ระบบ
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="auth-2fa-code" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  รหัสยืนยัน 6 หลัก หรือ Backup Code (XXXX-XXXX)
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="auth-2fa-code"
                    type="text"
                    required
                    autoFocus
                    autoComplete="one-time-code"
                    inputMode="text"
                    maxLength={20}
                    placeholder="เช่น 123456 หรือ ABCD-EFGH"
                    value={twoFactorStep.code}
                    onChange={e => setTwoFactorStep({ ...twoFactorStep, code: e.target.value })}
                    className="theme-input auth-2fa-otp-input"
                    style={{ padding: '0.82rem 1rem 0.82rem 2.5rem', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%', padding: '0.78rem',
                  fontSize: '0.98rem', fontWeight: 600, display: 'flex', justifyContent: 'center', gap: '0.45rem'
                }}
                disabled={loading}
              >
                {loading ? <Loader2 size={18} className="spin" /> : 'ยืนยันรหัสและเข้าสู่ระบบ'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTwoFactorStep({ active: false, challengeToken: '', code: '' });
                  setError('');
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-sub)',
                  padding: '0.58rem 0.9rem',
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <ArrowLeft size={14} /> กลับไปหน้ากรอกรหัสผ่าน
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            
            {!isLogin && (
              <div className="animate-fade-in">
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '0.35rem', fontWeight: 500 }}>
                  ชื่อผู้ใช้งาน (Username)
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="ตั้งชื่อผู้ใช้งาน (เช่น DoctorA)"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="theme-input"
                    style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '0.35rem', fontWeight: 500 }}>
                {isLogin ? 'อีเมล หรือ ชื่อผู้ใช้งาน (Email or Username)' : 'อีเมล (Email)'}
              </label>
              <div style={{ position: 'relative' }}>
                {isLogin ? (
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                ) : (
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                )}
                <input
                  type={isLogin ? "text" : "email"}
                  required
                  placeholder={isLogin ? "your@email.com หรือ ชื่อผู้ใช้งาน" : "your@email.com"}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="theme-input"
                  style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontWeight: 500 }}>
                  รหัสผ่าน (Password)
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotHelp(prev => !prev)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--primary-light)',
                      fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline',
                      textUnderlineOffset: '3px', padding: 0
                    }}
                  >
                    ลืมรหัสผ่าน?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="theme-input"
                  style={{ padding: '0.75rem 2.6rem 0.75rem 2.5rem', borderRadius: '8px' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {!isLogin && (
                <div style={{
                  marginTop: '0.55rem',
                  padding: '0.65rem 0.8rem',
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                }} className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-sub)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ShieldCheck size={14} color="var(--primary-light)" /> เกณฑ์รหัสผ่านมาตรฐาน
                    </span>
                    {formData.password.length > 0 && (
                      <span style={{ fontSize: '0.74rem', color: getStrengthColor(), fontWeight: 600 }}>
                        {getStrengthLabel()}
                      </span>
                    )}
                  </div>

                  {formData.password.length > 0 && (
                    <div style={{ display: 'flex', gap: '3px', height: '3.5px', marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map(step => (
                        <div
                          key={step}
                          style={{
                            flex: 1,
                            background: metCount >= step ? getStrengthColor() : 'var(--border)',
                            borderRadius: '2px',
                            transition: 'background 0.3s'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '0.3rem 0.5rem' 
                  }}>
                    {passwordCriteria.map(c => (
                      <div 
                        key={c.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '5px', 
                          fontSize: '0.75rem', 
                          color: c.met ? 'var(--ink-emerald)' : 'var(--text-muted)', 
                          transition: 'color 0.2s',
                          fontWeight: c.met ? 600 : 400
                        }}
                      >
                        {c.met ? (
                          <CheckCircle2 size={13} color="var(--ink-emerald)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: '1px solid var(--border-hover)',
                            boxSizing: 'border-box',
                            flexShrink: 0
                          }} />
                        )}
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '0.35rem', fontWeight: 500 }}>
                  ยืนยันรหัสผ่าน (Confirm Password)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    className="theme-input"
                    style={{ padding: '0.75rem 2.6rem 0.75rem 2.5rem', borderRadius: '8px' }}
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle2 size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }} />
                  )}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', marginTop: '0.4rem', padding: '0.75rem',
                fontSize: '0.98rem', fontWeight: 600, display: 'flex', justifyContent: 'center'
              }} 
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="spin" /> : (isLogin ? 'เข้าสู่ระบบ (Sign In)' : 'สร้างบัญชี (Create Account)')}
            </button>
          </form>
          )}

          {!twoFactorStep.active && (
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? ' : 'มีบัญชีอยู่แล้ว? '}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setShowForgotHelp(false); setFormData({...formData, password: '', confirmPassword: ''}); }}
                style={{ 
                  background: 'transparent', border: 'none', color: 'var(--primary-light)', 
                  cursor: 'pointer', padding: 0, fontWeight: 600, fontSize: '0.88rem',
                  textDecoration: 'underline', textUnderlineOffset: '3px'
                }}
              >
                {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบ'}
              </button>
            </div>
          )}

          {/* Support hotline footer */}
          <div style={{ 
            marginTop: '1rem', 
            paddingTop: '0.75rem', 
            borderTop: '1px solid var(--border)',
            textAlign: 'center', 
            fontSize: '0.78rem', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>ติดปัญหาการใช้งาน / ลืมรหัสผ่าน:</span>
            <a href="tel:0622594952" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <PhoneCall size={13} /> 062-259-4952
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
