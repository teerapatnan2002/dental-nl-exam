import React, { useState } from 'react';
import { Brain, Wand2, ArrowLeft, Loader2, Play, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function AIHub({ categories, tasks, onStartMockTest, onBack }) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('prediction');

  // Prediction State
  const [predictionReport, setPredictionReport] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Mock Gen State
  const [mockCategory, setMockCategory] = useState(categories[0] || '');
  const [mockTask, setMockTask] = useState(tasks[0] || '');
  const [mockCount, setMockCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const fetchPrediction = async () => {
    setIsPredicting(true);
    try {
      const res = await fetch(`${API_BASE}/api/prediction`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Prediction request failed');
      }
      setPredictionReport(data.report || 'No report generated.');
    } catch (err) {
      console.error(err);
      setPredictionReport(`**Error**: ${err.message}`);
    }
    setIsPredicting(false);
  };

  const handleGenerateMock = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenError('');
    try {
      const res = await fetch(`${API_BASE}/api/mock/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category: mockCategory, task: mockTask, count: parseInt(mockCount) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Generation failed');
      }
      const newQuestions = await res.json();
      onStartMockTest(newQuestions);
    } catch (err) {
      console.error(err);
      setGenError(err.message);
    }
    setIsGenerating(false);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>

      {/* ── Back + Header ──────────────────────────── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }} onClick={onBack}>
          <ArrowLeft size={16} /> กลับหน้าหลัก
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Powered by Gemini AI
            </div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
              <Brain size={30} color="var(--primary-light)" />
              <span className="gradient-text">AI Exam Hub</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>
              วิเคราะห์แนวโน้มข้อสอบและสร้างข้อสอบจำลองด้วย AI
            </p>
          </div>
        </div>
      </div>

      {/* ── Pill Tabs ──────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div className="tab-bar">
          <button
            className={`tab-item ${activeTab === 'prediction' ? 'active' : ''}`}
            onClick={() => setActiveTab('prediction')}
          >
            <TrendingUp size={16} /> วิเคราะห์แนวโน้ม
          </button>
          <button
            className={`tab-item ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <Wand2 size={16} /> สร้างข้อสอบ
          </button>
        </div>
      </div>

      {/* ── Prediction Tab ─────────────────────────── */}
      {activeTab === 'prediction' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>รายงานการวิเคราะห์แนวโน้มข้อสอบ</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', margin: '0.25rem 0 0' }}>
                AI วิเคราะห์สถิติข้อสอบทั้งหมดในระบบ
              </p>
            </div>
            <button className="btn btn-primary" onClick={fetchPrediction} disabled={isPredicting}>
              {isPredicting ? <><Loader2 size={17} className="spin" /> กำลังวิเคราะห์...</> : <><Brain size={17} /> สั่งวิเคราะห์ใหม่</>}
            </button>
          </div>

          <div className="divider" />

          <div style={{ minHeight: '300px' }}>
            {isPredicting ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', gap: '1rem', color: 'var(--text-muted)' }}>
                <Loader2 size={44} className="spin" style={{ color: 'var(--primary)' }} />
                <p style={{ textAlign: 'center', maxWidth: '320px', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  AI กำลังอ่านและวิเคราะห์สถิติข้อสอบทั้งหมดในระบบ
                  <br />
                  <span style={{ fontSize: '0.82rem' }}>(อาจใช้เวลา 30–60 วินาที)</span>
                </p>
              </div>
            ) : predictionReport ? (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{predictionReport}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '4rem' }}>
                <Brain size={52} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.95rem' }}>ยังไม่มีรายงาน</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  กดปุ่ม "สั่งวิเคราะห์ใหม่" เพื่อให้ AI วิเคราะห์ข้อมูล
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Generator Tab ──────────────────────────── */}
      {activeTab === 'generator' && (
        <div className="animate-fade-in" style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.4rem', fontSize: '1.15rem' }}>
                <Wand2 size={20} color="var(--accent)" /> สร้างข้อสอบจำลอง
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                AI ดึงข้อสอบเก่าเป็นตัวอย่าง (Few-Shot) แล้วสร้างข้อสอบใหม่ที่มีความยากและรูปแบบใกล้เคียงของจริง
              </p>
            </div>

            <div className="divider" />

            <form onSubmit={handleGenerateMock}>
              <div className="input-group">
                <label className="input-label">หมวดวิชา</label>
                <select
                  className="input-select"
                  value={mockCategory}
                  onChange={e => setMockCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">บทบาทหน้าที่</label>
                <select
                  className="input-select"
                  value={mockTask}
                  onChange={e => setMockTask(e.target.value)}
                >
                  {tasks.filter(t => !t.includes('พ.ร.บ.') && !t.includes('กฎหมาย') && !t.includes('จรรยาบรรณ')).length > 0 && (
                    <optgroup label="หมวดคลินิก">
                      {tasks.filter(t => !t.includes('พ.ร.บ.') && !t.includes('กฎหมาย') && !t.includes('จรรยาบรรณ')).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </optgroup>
                  )}
                  {tasks.filter(t => t.includes('พ.ร.บ.') || t.includes('กฎหมาย') || t.includes('จรรยาบรรณ')).length > 0 && (
                    <optgroup label="หมวดกฎหมาย">
                      {tasks.filter(t => t.includes('พ.ร.บ.') || t.includes('กฎหมาย') || t.includes('จรรยาบรรณ')).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">จำนวนข้อ (1 – 10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="input-number"
                  value={mockCount}
                  onChange={e => setMockCount(e.target.value)}
                />
              </div>

              {genError && (
                <div style={{
                  padding: '0.9rem 1.1rem',
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.25)',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  color: '#fb7185',
                  fontSize: '0.88rem',
                }}>
                  <strong>เกิดข้อผิดพลาด:</strong> {genError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Loader2 size={18} className="spin" />
                      <span>AI กำลังแต่งข้อสอบ...</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>(อาจใช้เวลา 1-2 นาทีในครั้งแรก เนื่องจากต้องโหลดฐานข้อมูล)</span>
                  </div>
                ) : (
                  <>
                    <Play size={18} />
                    เริ่มทำข้อสอบจำลอง
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
