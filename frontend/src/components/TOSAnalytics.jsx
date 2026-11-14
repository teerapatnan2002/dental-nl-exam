import React, { useState, useEffect } from 'react';
import {
  BarChart3, CheckCircle2, TrendingUp, Layers, BookOpen,
  Search, Shield, Sparkles, Filter, ChevronRight, HelpCircle,
  Activity, Award, PieChart, PlayCircle, Info, Target, Zap, AlertTriangle
} from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

const READINESS_STATUS_META = {
  ready: { label: 'พร้อมสอบ (>=75%)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.35)' },
  borderline: { label: 'ก้ำกึ่ง (60-74%)', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.35)' },
  critical: { label: 'ต้องเร่งซ่อม (<60%)', color: '#fb7185', bg: 'rgba(244, 63, 94, 0.14)', border: 'rgba(244, 63, 94, 0.35)' },
  unpracticed: { label: 'ยังไม่เคยฝึก', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.25)' },
};

export default function TOSAnalytics({ onStartPractice, onOpenTopic }) {
  const { user, token, authFetch } = useAuth() || {};
  const [data, setData] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loadingReadiness, setLoadingReadiness] = useState(false);
  const [launchingIds, setLaunchingIds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('benchmark'); // 'benchmark' | 'readiness' | 'heatmap' | 'topics'
  const [searchTopic, setSearchTopic] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchTOSData();
  }, []);

  useEffect(() => {
    if (!token || !authFetch) {
      setReadiness(null);
      return;
    }
    let cancelled = false;
    const loadReadiness = async () => {
      try {
        setLoadingReadiness(true);
        const res = await authFetch(`${API_BASE}/api/analytics/my-readiness`);
        if (res.ok && !cancelled) {
          setReadiness(await res.json());
        }
      } catch (err) {
        console.error('Failed to load personal TOS readiness:', err);
      } finally {
        if (!cancelled) setLoadingReadiness(false);
      }
    };
    loadReadiness();
    return () => { cancelled = true; };
  }, [token, authFetch]);

  const handleStartRemediation = async (keyId, questionIds) => {
    if (!onStartPractice || !questionIds || questionIds.length === 0) return;
    try {
      setLaunchingIds(keyId);
      const res = await fetch(`${API_BASE}/api/questions/by-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_ids: questionIds }),
      });
      if (res.ok) {
        const qs = await res.json();
        if (qs.length > 0) onStartPractice(qs);
      }
    } catch (err) {
      console.error('Failed to launch remediation quiz:', err);
    } finally {
      setLaunchingIds(null);
    }
  };

  const fetchTOSData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/analytics/tos`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load TOS analytics:', err);
      setError('ไม่สามารถโหลดข้อมูลสถิติ TOS ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem', width: 40, height: 40, border: '3px solid rgba(124, 58, 237, 0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>กำลังประมวลผลข้อมูล TOS Analytics...</h3>
        <p style={{ color: 'var(--text-sub)' }}>วิเคราะห์พิมพ์เขียวเกณฑ์มาตรฐาน ศ.ป.ท. 2563 เทียบกับคลังข้อสอบ 2,443 ข้อ</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#ef4444' }}>
        <p>{error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'}</p>
        <button className="btn btn-primary" onClick={fetchTOSData} style={{ marginTop: '1rem' }}>
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  const { summary, categories, tasks, cognitive, heatmap_matrix, top_topics, topics_by_category } = data;

  const clinicalCategories = categories.filter(c => c.category !== 'กฎหมายและจรรยาบรรณ');
  const lawCategory = categories.find(c => c.category === 'กฎหมายและจรรยาบรรณ');

  // Heatmap Tasks headers
  const taskHeaders = [
    'การสร้างเสริมสุขภาพและการป้องกัน',
    'การเกิดและการดำเนินโรค',
    'การวินิจฉัยโรค',
    'การจัดการและการรักษาผู้ป่วย',
    'ขั้นตอนและวิธีการรักษา'
  ];

  // Helper for heatmap cell color
  const getCellColor = (count) => {
    if (!count || count === 0) return 'rgba(255, 255, 255, 0.03)';
    if (count < 10) return 'rgba(16, 185, 129, 0.15)';
    if (count < 30) return 'rgba(16, 185, 129, 0.3)';
    if (count < 60) return 'rgba(59, 130, 246, 0.4)';
    if (count < 100) return 'rgba(124, 58, 237, 0.5)';
    return 'rgba(236, 72, 153, 0.6)';
  };

  // Filtered topics for explorer
  const allTopicItems = [];
  Object.entries(topics_by_category || {}).forEach(([cat, tList]) => {
    if (selectedCategoryFilter === 'ALL' || selectedCategoryFilter === cat) {
      tList.forEach(t => allTopicItems.push({ ...t, category: cat }));
    }
  });

  const filteredTopics = allTopicItems.filter(t => 
    t.topic.toLowerCase().includes(searchTopic.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTopic.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ── Header & KPI Banner ─────────────────────── */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124, 58, 237, 0.15)', color: 'var(--accent)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> ศ.ป.ท. Dental Licensing Blueprint 2563
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              📊 TOS Analytics & Exam Bank Matrix
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', maxWidth: '680px', margin: 0, lineHeight: 1.6 }}>
              วิเคราะห์ความสอดคล้องระหว่างเกณฑ์มาตรฐานการประเมินความรู้ทันตแพทย์ (TOS 2563) กับคลังข้อสอบจริง 2,443 ข้อ ทั้ง 10 สาขาวิชาคลินิก, 5 สมรรถนะ และระดับพฤติกรรม R / A / P
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', minWidth: '320px' }}>
            <div className="stat-card" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-inner)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{summary.total_questions.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>ข้อสอบทั้งหมด</div>
            </div>
            <div className="stat-card" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-inner)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{summary.clinical_questions.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>ภาคคลินิก (7.2x)</div>
            </div>
            <div className="stat-card" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-inner)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{summary.law_questions.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>หมวดกฎหมาย (9.5x)</div>
            </div>
            <div className="stat-card" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-inner)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{summary.total_must_know_topics}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Must-Know Topics</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('benchmark')}
            className={`btn ${activeSubTab === 'benchmark' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <BarChart3 size={16} /> เปรียบเทียบมาตรฐาน (TOS Benchmark)
          </button>
          <button
            onClick={() => setActiveSubTab('readiness')}
            className={`btn ${activeSubTab === 'readiness' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Target size={16} /> ความพร้อมของฉัน (My Readiness)
            {readiness?.summary?.unique_answered > 0 && (
              <span style={{
                marginLeft: '0.25rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.1rem 0.45rem',
                borderRadius: '10px',
                background: readiness.summary.weighted_accuracy_pct >= 60 ? 'rgba(16,185,129,0.22)' : 'rgba(244,63,94,0.25)',
                color: readiness.summary.weighted_accuracy_pct >= 60 ? '#34d399' : '#fb7185'
              }}>
                {readiness.summary.weighted_accuracy_pct}%
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('heatmap')}
            className={`btn ${activeSubTab === 'heatmap' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Layers size={16} /> แผนที่ความครอบคลุม (Coverage Heatmap)
          </button>
          <button
            onClick={() => setActiveSubTab('topics')}
            className={`btn ${activeSubTab === 'topics' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <BookOpen size={16} /> เจาะลึกหัวข้อ Must-Know ({summary.total_must_know_topics})
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
         VIEW 1: BENCHMARK COMPARISON
      ════════════════════════════════════════════════ */}
      {activeSubTab === 'benchmark' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Cognitive Levels Comparison Cards */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="var(--accent)" /> ระดับพฤติกรรมการเรียนรู้ (Cognitive Domains) เทียบเกณฑ์ TOS
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              สัดส่วนข้อสอบจริงในระบบจำแนกตาม Bloom's Taxonomy เทียบกับพิมพ์เขียว ศ.ป.ท. (R 17.3% : A 29.7% : P 53.0%)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {cognitive.map(cog => {
                const isNear = Math.abs(cog.diff_pct) <= 5.0;
                return (
                  <div key={cog.level} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: cog.level === 'P' ? '#ec4899' : cog.level === 'A' ? '#38bdf8' : '#10b981' }}>
                          {cog.level}
                        </span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{cog.name}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-pill)', background: isNear ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: isNear ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {cog.diff_pct >= 0 ? `+${cog.diff_pct}%` : `${cog.diff_pct}%`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-sub)', margin: '0.75rem 0 0.35rem' }}>
                      <span>ในคลัง: <b>{cog.actual_count.toLocaleString()} ข้อ ({cog.actual_pct}%)</b></span>
                      <span>เกณฑ์ TOS: <b>{cog.target_pct}%</b></span>
                    </div>

                    {/* Comparison bar */}
                    <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, cog.actual_pct)}%`, background: cog.level === 'P' ? 'linear-gradient(90deg, #ec4899, #f43f5e)' : cog.level === 'A' ? 'linear-gradient(90deg, #38bdf8, #6366f1)' : 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10 Clinical Categories vs TOS Table */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent)" /> ภาควิทยาคลินิก 10 สาขาวิชา: เป้าหมาย TOS vs ข้อสอบจริงในคลัง
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              เปรียบเทียบโควตา 300 ข้อ (1 รอบสอบ) กับจำนวนข้อสอบสะสมในฐานข้อมูล 2,159 ข้อ
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>สาขาวิชา</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>เป้าหมาย TOS (300 ข้อ)</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>ในคลังข้อสอบจริง</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>สัดส่วนจริง</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>ส่วนต่าง</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicalCategories.map(cat => {
                    const isBalanced = cat.status === 'Balanced';
                    const isHigh = cat.status === 'High';
                    return (
                      <tr key={cat.category} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{cat.category}</td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', color: 'var(--text-sub)' }}>
                          {cat.target_count} ข้อ ({cat.target_pct}%)
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>
                          {cat.actual_count} ข้อ
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span>{cat.actual_pct}%</span>
                            <div style={{ width: '50px', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(100, (cat.actual_pct / 20) * 100)}%`, height: '100%', background: 'var(--accent)' }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', fontWeight: 600, color: cat.diff_pct > 0 ? '#10b981' : (cat.diff_pct < -2 ? '#f59e0b' : 'var(--text-sub)') }}>
                          {cat.diff_pct > 0 ? `+${cat.diff_pct}%` : `${cat.diff_pct}%`}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.25rem 0.65rem',
                            borderRadius: 'var(--radius-pill)',
                            background: isBalanced ? 'rgba(16, 185, 129, 0.15)' : (isHigh ? 'rgba(124, 58, 237, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                            color: isBalanced ? '#10b981' : (isHigh ? 'var(--accent)' : '#f59e0b'),
                            display: 'inline-block'
                          }}>
                            {isBalanced ? '🎯 สมดุลตรงเกณฑ์' : (isHigh ? '🟢 คลังหนาแน่น' : '🟡 พอดีเกณฑ์')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Law Row */}
                  {lawCategory && (
                    <tr style={{ background: 'rgba(245, 158, 11, 0.05)', borderTop: '2px solid rgba(245, 158, 11, 0.2)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#f59e0b' }}>⚖️ {lawCategory.category} (สอบแยก)</td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', color: 'var(--text-sub)' }}>
                        30 ข้อ / รอบ
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', fontWeight: 700, color: '#f59e0b' }}>
                        {lawCategory.actual_count} ข้อ
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                        ครอบคลุม 9.5 รอบสอบ
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', color: '#10b981', fontWeight: 700 }}>
                        พร้อม 100%
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                          ⭐ กฎหมายครบวงจร
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5 Tasks vs TOS Table */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--accent)" /> 5 สมรรถนะทางคลินิก (Clinical Tasks)
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              สัดส่วนข้อสอบจริงเทียบกับเกณฑ์สมรรถนะ ศ.ป.ท.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {tasks.map(t => (
                <div key={t.task} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.1rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.4rem', minHeight: '2.5rem' }}>{t.task}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)' }}>{t.actual_count} ข้อ</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>เป้าหมาย {t.target_pct}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>สัดส่วนจริง: <b>{t.actual_pct}%</b></span>
                    <span style={{ color: t.diff_pct >= 0 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                      {t.diff_pct >= 0 ? `+${t.diff_pct}%` : `${t.diff_pct}%`}
                    </span>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (t.actual_pct / 35) * 100)}%`, background: 'var(--accent)', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ════════════════════════════════════════════════
         VIEW 2: COVERAGE HEATMAP (MATRIX)
      ════════════════════════════════════════════════ */}
      {activeSubTab === 'heatmap' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--accent)" /> 2D Coverage Heatmap: 10 สาขาวิชา $\times$ 5 สมรรถนะ
              </h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', margin: 0 }}>
                ความหนาแน่นของข้อสอบจริงในแต่ละช่องพิกัด ยิ่งสีเข้มแสดงว่ามีข้อสอบสะสมมาก
              </p>
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-sub)' }}>
              <span>น้อย</span>
              <span style={{ width: 14, height: 14, background: 'rgba(16, 185, 129, 0.2)', borderRadius: 3, display: 'inline-block' }} />
              <span style={{ width: 14, height: 14, background: 'rgba(16, 185, 129, 0.4)', borderRadius: 3, display: 'inline-block' }} />
              <span style={{ width: 14, height: 14, background: 'rgba(59, 130, 246, 0.5)', borderRadius: 3, display: 'inline-block' }} />
              <span style={{ width: 14, height: 14, background: 'rgba(124, 58, 237, 0.6)', borderRadius: 3, display: 'inline-block' }} />
              <span style={{ width: 14, height: 14, background: 'rgba(236, 72, 153, 0.7)', borderRadius: 3, display: 'inline-block' }} />
              <span>มาก (&gt;100)</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'center' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', minWidth: '180px' }}>สาขาวิชา \ สมรรถนะ</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '13%' }}>Task 1: ป้องกัน</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '13%' }}>Task 2: กลไกโรค</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '13%' }}>Task 3: วินิจฉัย</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '13%' }}>Task 4: วางแผนรักษา</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '13%' }}>Task 5: หัตถการ</th>
                  <th style={{ padding: '0.75rem 0.75rem', width: '12%', fontWeight: 700, color: 'var(--text)' }}>รวมสาขา</th>
                </tr>
              </thead>
              <tbody>
                {clinicalCategories.map(cat => {
                  const catMatrix = heatmap_matrix[cat.category] || {};
                  const rowTotal = taskHeaders.reduce((sum, th) => sum + (catMatrix[th] || 0), 0);
                  return (
                    <tr key={cat.category} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>{cat.category}</td>
                      {taskHeaders.map(th => {
                        const cnt = catMatrix[th] || 0;
                        return (
                          <td key={th} style={{ padding: '0.5rem' }}>
                            <div style={{
                              background: getCellColor(cnt),
                              padding: '0.6rem 0.3rem',
                              borderRadius: '6px',
                              fontWeight: cnt > 0 ? 700 : 400,
                              color: cnt > 0 ? '#fff' : 'var(--text-muted)',
                              border: cnt > 50 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
                            }}>
                              {cnt}
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 800, color: 'var(--accent)' }}>
                        {rowTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
         VIEW 3: MUST-KNOW TOPICS EXPLORER
      ════════════════════════════════════════════════ */}
      {activeSubTab === 'topics' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="var(--accent)" /> คลังหัวข้อย่อย Must-Know ตามคู่มือ ศ.ป.ท. ({filteredTopics.length} หัวข้อ)
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', margin: 0 }}>
              สำรวจข้อสอบที่จัดกลุ่มตามหัวข้อโรค กลไก และหัตถการตามพิมพ์เขียวอย่างเจาะจง
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchTopic}
                onChange={e => setSearchTopic(e.target.value)}
                placeholder="ค้นหาชื่อหัวข้อ (เช่น VPT, MRD, Ludwig, Biologic Width)..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                fontSize: '0.88rem'
              }}
            >
              <option value="ALL">ทุกสาขาวิชา ({categories.length} สาขา)</option>
              {categories.map(c => (
                <option key={c.category} value={c.category}>{c.category}</option>
              ))}
            </select>
          </div>

          {/* Topics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {filteredTopics.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                    {t.topic}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t.category}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(124, 58, 237, 0.15)',
                    color: 'var(--accent)',
                    display: 'inline-block'
                  }}>
                    {t.count} ข้อ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
         VIEW 4: PERSONAL TOS READINESS & HIGH-ROI REMEDIATION
      ════════════════════════════════════════════════ */}
      {activeSubTab === 'readiness' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!user ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Target size={36} color="var(--accent)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>เข้าสู่ระบบเพื่อดูแผนที่ความพร้อมรายบุคคล (My Readiness)</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto' }}>
                ระบบจะนำคะแนนจริงจากการทำข้อสอบทุกครั้งมาซ้อนทับกับพิมพ์เขียว ศ.ป.ท. เพื่อคาดการณ์คะแนนสอบและจัดชุดซ่อมเฉพาะหัวข้อที่คุ้มคะแนนที่สุดให้คุณ
              </p>
            </div>
          ) : loadingReadiness && !readiness ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-sub)' }}>
              กำลังวิเคราะห์ความพร้อมเทียบพิมพ์เขียว ศ.ป.ท. ...
            </div>
          ) : readiness ? (
            <>
              {/* Readiness KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: `4px solid ${readiness.summary.weighted_accuracy_pct >= 60 ? '#10b981' : '#fb7185'}` }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>ความแม่นยำถ่วงน้ำหนัก TOS</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: readiness.summary.weighted_accuracy_pct >= 60 ? '#10b981' : '#fb7185' }}>
                    {readiness.summary.weighted_accuracy_pct}%
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)' }}>
                    เกณฑ์ผ่าน ศ.ป.ท.: 60.0% ({readiness.summary.practiced_categories_count}/11 หมวดที่ฝึกแล้ว)
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #38bdf8' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>ดัชนีความพร้อมรวม (คิดความครอบคลุม)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>
                    {readiness.summary.projected_nl_score}%
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)' }}>
                    ทำแล้ว {readiness.summary.unique_answered.toLocaleString()} / {readiness.summary.total_in_bank.toLocaleString()} ข้อ ({readiness.summary.coverage_pct}%)
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #a855f7' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>ความแม่นยำรวมล่าสุด</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a855f7' }}>
                    {readiness.summary.overall_accuracy}%
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)' }}>
                    ถูก {readiness.summary.unique_correct.toLocaleString()} ข้อ • ทั้งหมด {readiness.summary.total_attempts.toLocaleString()} ครั้ง
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>หมวดที่ต้องเร่งซ่อม</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>
                    {readiness.summary.critical_categories_count} หมวด
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)' }}>
                    ยังไม่เคยฝึก {readiness.summary.unpracticed_categories_count} หมวด
                  </div>
                </div>
              </div>

              {/* Cognitive & Task Readiness Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                <div className="glass-panel" style={{ padding: '1.4rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} color="var(--accent)" /> ความพร้อมตามระดับ R / A / P
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {readiness.cognitive_readiness.map(cog => {
                      const meta = READINESS_STATUS_META[cog.status] || READINESS_STATUS_META.unpracticed;
                      return (
                        <div key={cog.level} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.86rem' }}>
                            <span><strong>{cog.level}</strong> — {cog.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>(TOS {cog.target_pct}%)</span></span>
                            <strong style={{ color: meta.color }}>{cog.accuracy !== null ? `${cog.accuracy}%` : 'ยังไม่ทำ'}</strong>
                          </div>
                          <div style={{ height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${cog.accuracy || 0}%`, height: '100%', background: meta.color, transition: 'width 0.3s ease' }} />
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                            ทำแล้ว {cog.unique_answered}/{cog.total_in_bank} ข้อ (ถูก {cog.correct} ข้อ)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.4rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} color="#38bdf8" /> ความพร้อมตาม 5 สมรรถนะ (Tasks)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    {readiness.task_readiness.map(task => {
                      const meta = READINESS_STATUS_META[task.status] || READINESS_STATUS_META.unpracticed;
                      return (
                        <div key={task.task}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                            <span style={{ color: 'var(--text)' }}>{task.task} <span style={{ color: 'var(--text-muted)' }}>({task.target_pct}%)</span></span>
                            <span style={{ fontWeight: 700, color: meta.color }}>
                              {task.accuracy !== null ? `${task.accuracy}% (${task.unique_answered} ข้อ)` : 'ยังไม่ทำ'}
                            </span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${task.accuracy || 0}%`, height: '100%', background: meta.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top High-ROI Weak Topics Remediation */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={18} color="#f59e0b" /> Top High-ROI จุดอ่อนต้องซ่อมด่วน (คำนวณจากน้ำหนัก TOS × ความแม่นยำ)
                    </h3>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', margin: 0 }}>
                      หัวข้อที่ลงทุนอ่าน/ฝึกทำแล้วดันคะแนนสอบรวมขึ้นได้เร็วที่สุด กดจัดชุดซ่อมเฉพาะจุดได้ใน 1 คลิก
                    </p>
                  </div>
                </div>

                {readiness.top_weak_topics.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
                    🎉 ยอดเยี่ยม! คุณผ่านเกณฑ์ความแม่นยำสูงในทุกหัวข้อที่ฝึกมาแล้ว
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '0.9rem' }}>
                    {readiness.top_weak_topics.map((wt, idx) => (
                      <div key={wt.topic_id} style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '10px', background: 'rgba(245,158,11,0.16)', color: '#fbbf24' }}>
                              #{idx + 1} ROI {wt.roi_score}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{wt.category}</span>
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                            {wt.title_th}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                            {wt.reason_th}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {onStartPractice && wt.question_ids?.length > 0 && (
                            <button
                              type="button"
                              disabled={launchingIds === wt.topic_id}
                              onClick={() => handleStartRemediation(wt.topic_id, wt.question_ids)}
                              className="btn btn-primary btn-sm"
                              style={{ flex: 1, fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            >
                              <Zap size={14} /> {launchingIds === wt.topic_id ? 'กำลังโหลด...' : `ติวชุดซ่อม (${wt.question_ids.length} ข้อ)`}
                            </button>
                          )}
                          {onOpenTopic && (
                            <button
                              type="button"
                              onClick={() => onOpenTopic(wt.topic_id)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <BookOpen size={14} /> เปิดบทเรียน
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 11 Categories Readiness Breakdown */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="#10b981" /> ความพร้อมรายสาขาวิชา (11 หมวดเทียบน้ำหนัก TOS)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
                  {readiness.category_readiness.map(cat => {
                    const meta = READINESS_STATUS_META[cat.status] || READINESS_STATUS_META.unpracticed;
                    return (
                      <div key={cat.category} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${meta.border}`, borderRadius: '10px', padding: '0.95rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.45rem' }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{cat.category}</div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '10px', background: meta.bg, color: meta.color, whiteSpace: 'nowrap' }}>
                            {meta.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-sub)', marginBottom: '0.35rem' }}>
                          <span>น้ำหนักสอบ: {cat.target_pct}% • ทำแล้ว {cat.unique_answered}/{cat.total_in_bank} ({cat.coverage_pct}%)</span>
                          <strong style={{ color: meta.color }}>{cat.accuracy !== null ? `${cat.accuracy}%` : '-'}</strong>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                          <div style={{ width: `${cat.accuracy || 0}%`, height: '100%', background: meta.color }} />
                        </div>
                        {onOpenTopic && cat.recommended_topic_ids?.length > 0 && (
                          <button
                            type="button"
                            onClick={() => onOpenTopic(cat.recommended_topic_ids[0])}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', padding: '0.28rem 0.65rem' }}
                          >
                            📖 ทบทวนหัวข้อหลักของหมวดนี้
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

    </div>
  );
}
