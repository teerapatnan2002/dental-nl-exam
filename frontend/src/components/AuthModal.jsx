import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotHelp, setShowForgotHelp] = useState(false);
  
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
    }
  }, [isOpen]);

  useEffect(() => {
    setPasswordStrength(metCount);
  }, [formData.password, metCount]);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.username || formData.username.trim().length < 3) {
        setError('ชื่อผู้ใช้งานต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
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
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.username, formData.password);
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

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '460px', maxHeight: 'min(92vh, 660px)', padding: 0,
        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.65)',
        borderRadius: '16px', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)'
      }}>
        
        {/* Header Area */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(18,18,30,0.95) 100%)',
          padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', flexShrink: 0
        }}>
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(255,255,255,0.08)', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <X size={17} />
          </button>

          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
            {isLogin ? 'เข้าสู่ระบบ (Sign In)' : 'สมัครสมาชิกใหม่ (Register)'}
          </h2>
          <p style={{ margin: 0, color: 'var(--text-sub)', fontSize: '0.85rem' }}>
            {isLogin ? 'เข้าสู่ระบบเพื่อทำข้อสอบและดูสถิติของคุณ' : 'กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบคลังข้อสอบ NL Dental'}
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
              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
              color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px',
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
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.28)',
              borderRadius: '8px',
              padding: '0.75rem 0.9rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.85rem',
              color: 'var(--text)'
            }}>
              <PhoneCall size={17} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ color: 'var(--text-sub)' }}>กรณีลืมรหัสผ่าน กรุณาติดต่อผู้ดูแล: </span>
                <a href="tel:0622594952" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'underline' }}>
                  062-259-4952
                </a>
              </div>
            </div>
          )}

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
                    style={{
                      width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                      background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: 'white', fontSize: '0.92rem',
                      transition: 'border-color 0.2s', outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '0.35rem', fontWeight: 500 }}>
                อีเมล (Email)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: 'white', fontSize: '0.92rem',
                    transition: 'border-color 0.2s', outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
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
                  style={{
                    width: '100%', padding: '0.75rem 2.6rem 0.75rem 2.5rem',
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: 'white', fontSize: '0.92rem',
                    transition: 'border-color 0.2s', outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
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
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
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
                            background: metCount >= step ? getStrengthColor() : 'rgba(255,255,255,0.08)',
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
                          color: c.met ? 'var(--success)' : 'var(--text-muted)', 
                          transition: 'color 0.2s',
                          fontWeight: c.met ? 600 : 400
                        }}
                      >
                        {c.met ? (
                          <CheckCircle2 size={13} color="var(--success)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
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
                    style={{
                      width: '100%', padding: '0.75rem 2.6rem 0.75rem 2.5rem',
                      background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: 'white', fontSize: '0.92rem',
                      transition: 'border-color 0.2s', outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
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

          {/* Support hotline footer */}
          <div style={{ 
            marginTop: '1rem', 
            paddingTop: '0.75rem', 
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center', 
            fontSize: '0.78rem', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>ติดปัญหาการใช้งาน / ลืมรหัสผ่าน:</span>
            <a href="tel:0622594952" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              📞 062-259-4952
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
