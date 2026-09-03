import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2, Check, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
      label: 'ความยาวอย่างน้อย 8 ตัวอักษร',
      met: formData.password.length >= 8,
    },
    {
      id: 'upper',
      label: 'ตัวอักษรพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว',
      met: /[A-Z]/.test(formData.password),
    },
    {
      id: 'lower',
      label: 'ตัวอักษรพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว',
      met: /[a-z]/.test(formData.password),
    },
    {
      id: 'number',
      label: 'ตัวเลข (0-9) อย่างน้อย 1 ตัว',
      met: /[0-9]/.test(formData.password),
    },
    {
      id: 'special',
      label: 'อักขระพิเศษ (!@#$%^&*...) อย่างน้อย 1 ตัว',
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
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '480px', padding: 0,
        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Header Area */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(18,18,30,0.9) 100%)',
          padding: '2rem 2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={18} />
          </button>

          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ margin: 0, color: 'var(--text-sub)', fontSize: '0.95rem' }}>
            {isLogin ? 'เข้าสู่ระบบเพื่อทำข้อสอบและดูสถิติของคุณ' : 'สมัครสมาชิกเพื่อเริ่มต้นใช้งานระบบข้อสอบ NL'}
          </p>
        </div>

        {/* Form Area */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <div className="animate-fade-in" style={{
              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
              color: '#fca5a5', padding: '1rem', borderRadius: '8px',
              marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              fontSize: '0.9rem', lineHeight: 1.4
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} /> 
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {!isLogin && (
              <div className="animate-fade-in">
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '0.5rem', fontWeight: 500 }}>
                  ชื่อผู้ใช้งาน (Username)
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="ตั้งชื่อผู้ใช้งาน"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    style={{
                      width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                      background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: 'white', fontSize: '1rem',
                      transition: 'border-color 0.2s', outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '0.5rem', fontWeight: 500 }}>
                อีเมล (Email)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: 'white', fontSize: '1rem',
                    transition: 'border-color 0.2s', outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '0.5rem', fontWeight: 500 }}>
                รหัสผ่าน (Password)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  style={{
                    width: '100%', padding: '0.85rem 2.75rem',
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: 'white', fontSize: '1rem',
                    transition: 'border-color 0.2s', outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {!isLogin && (
                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.85rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                }} className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={15} color="var(--primary-light)" /> เกณฑ์รหัสผ่านตามมาตรฐานสากล
                    </span>
                    {formData.password.length > 0 && (
                      <span style={{ fontSize: '0.76rem', color: getStrengthColor(), fontWeight: 600 }}>
                        {getStrengthLabel()}
                      </span>
                    )}
                  </div>

                  {formData.password.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '0.75rem' }}>
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {passwordCriteria.map(c => (
                      <div 
                        key={c.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '7px', 
                          fontSize: '0.78rem', 
                          color: c.met ? 'var(--success)' : 'var(--text-muted)', 
                          transition: 'color 0.2s',
                          fontWeight: c.met ? 500 : 400
                        }}
                      >
                        {c.met ? (
                          <CheckCircle2 size={14} color="var(--success)" strokeWidth={2.5} />
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxSizing: 'border-box'
                          }} />
                        )}
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '0.5rem', fontWeight: 500 }}>
                  ยืนยันรหัสผ่าน (Confirm Password)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    style={{
                      width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                      background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: 'white', fontSize: '1rem',
                      transition: 'border-color 0.2s', outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle2 size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }} />
                  )}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', marginTop: '0.75rem', padding: '0.85rem',
                fontSize: '1rem', fontWeight: 600, display: 'flex', justifyContent: 'center'
              }} 
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="spin" /> : (isLogin ? 'เข้าสู่ระบบ (Sign In)' : 'สร้างบัญชี (Create Account)')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? ' : 'มีบัญชีอยู่แล้ว? '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({...formData, password: '', confirmPassword: ''}); }}
              style={{ 
                background: 'transparent', border: 'none', color: 'var(--primary-light)', 
                cursor: 'pointer', padding: 0, fontWeight: 600, fontSize: '0.95rem',
                textDecoration: 'underline', textUnderlineOffset: '4px'
              }}
            >
              {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
