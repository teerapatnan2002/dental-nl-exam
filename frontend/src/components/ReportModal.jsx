import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function ReportModal({ questionId, onClose }) {
  const { token } = useAuth();
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const issueOptions = [
    { value: 'wrong_answer', label: 'เฉลยผิด' },
    { value: 'missing_stem', label: 'โจทย์/เนื้อหาไม่ครบถ้วน' },
    { value: 'missing_image', label: 'รูปภาพไม่แสดงหรือผิดพลาด' },
    { value: 'typo', label: 'พิมพ์ผิด / สะกดคำผิด' },
    { value: 'other', label: 'อื่นๆ' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issueType) {
      setError('กรุณาเลือกประเภทของปัญหา');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question_id: questionId,
          issue_type: issueType,
          description: description
        })
      });

      if (!res.ok) throw new Error('API Error');
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการส่งรายงาน กรุณาลองอีกครั้ง');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '2rem 1rem', overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '500px',
        padding: '2rem', position: 'relative',
        margin: 'auto',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>ขอบคุณที่แจ้งปัญหา!</h2>
            <p style={{ color: 'var(--text-sub)' }}>ระบบได้รับรายงานของคุณเรียบร้อยแล้ว ทีมงานจะรีบดำเนินการตรวจสอบ</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle color="var(--danger)" size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>รายงานข้อผิดพลาด</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>ข้อสอบรหัส #{questionId}</p>
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                  ประเภทของปัญหา <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {issueOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: issueType === opt.value ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                      <input 
                        type="radio" 
                        name="issueType" 
                        value={opt.value} 
                        checked={issueType === opt.value}
                        onChange={(e) => setIssueType(e.target.value)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '0.95rem' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                  รายละเอียดเพิ่มเติม (ถ้ามี)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น คิดว่าข้อ C น่าจะถูกกว่าเพราะ..."
                  style={{
                    width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border)', borderRadius: '8px',
                    color: 'white', minHeight: '100px', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ background: 'var(--danger)' }}>
                  {submitting ? 'กำลังส่ง...' : 'ส่งรายงาน'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
