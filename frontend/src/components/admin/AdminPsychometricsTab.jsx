import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, AlertTriangle, RefreshCw, Loader2, Clock, Target, Info, Flame, ShieldAlert,
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { EXAM_ORIGIN_LABELS, accuracyTone, formatSeconds } from './adminFormatters';

export default function AdminPsychometricsTab() {
  const { authFetch } = useAuth();
  const [days, setDays] = useState(90);
  const [minAttempts, setMinAttempts] = useState(3);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');

  const [data, setData] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPsychometrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        days: String(days),
        min_attempts: String(minAttempts),
      });
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (originFilter !== 'all') params.set('exam_origin', originFilter);
      const res = await authFetch(`${API_BASE}/api/admin/psychometrics?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      if (categoryFilter === 'all' && Array.isArray(json.categories) && json.categories.length > 0) {
        setAllCategories(json.categories.map((c) => c.category));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, days, minAttempts, categoryFilter, originFilter]);

  useEffect(() => {
    loadPsychometrics();
  }, [loadPsychometrics]);

  const summary = data?.summary || {};
  const categories = data?.categories || [];
  const hardest = data?.hardest_questions || [];
  const distractors = data?.distractor_alerts || [];

  return (
    <div className="admin-section-stack">
      {/* Filter Toolbar */}
      <div className="glass-panel admin-filter-bar">
        <select className="admin-select" value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="ช่วงเวลา">
          <option value={30}>30 วันล่าสุด</option>
          <option value={90}>90 วันล่าสุด</option>
          <option value={365}>365 วันล่าสุด</option>
          <option value={3650}>ทั้งหมด</option>
        </select>

        <select className="admin-select" value={minAttempts} onChange={(e) => setMinAttempts(Number(e.target.value))} aria-label="เกณฑ์ขั้นต่ำจำนวนครั้งที่ตอบ">
          <option value={3}>ขั้นต่ำ ≥ 3 คำตอบ</option>
          <option value={5}>ขั้นต่ำ ≥ 5 คำตอบ</option>
          <option value={10}>ขั้นต่ำ ≥ 10 คำตอบ</option>
          <option value={20}>ขั้นต่ำ ≥ 20 คำตอบ</option>
        </select>

        <select className="admin-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="กรองสาขา">
          <option value="all">ทุกสาขาวิชา (11 สาขา)</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select className="admin-select" value={originFilter} onChange={(e) => setOriginFilter(e.target.value)} aria-label="กรองแหล่งข้อสอบ">
          <option value="all">ทุกแหล่งข้อสอบ</option>
          <option value="real_exam">{EXAM_ORIGIN_LABELS.real_exam}</option>
          <option value="dsat_mock">{EXAM_ORIGIN_LABELS.dsat_mock}</option>
          <option value="ai_mock">{EXAM_ORIGIN_LABELS.ai_mock}</option>
        </select>

        <div className="admin-toolbar-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadPsychometrics} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> รีเฟรช
          </button>
        </div>
      </div>

      {/* Data Quality Guardrail Callout */}
      <div className="admin-info-callout">
        <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Data Quality Guardrails:</strong> ค่า <strong>True Accuracy</strong> คำนวณเฉพาะแถวที่ผู้สอบเลือกคำตอบจริง (ไม่นับข้อที่ส่งก่อนตอบหรือเว้นว่าง)
          และเวลาต่อข้อใช้ <strong>Median</strong> คู่กับ <strong>Capped Avg (≤ {summary.capped_threshold_sec ?? 300} วิ)</strong> เพื่อตัดค่าเพี้ยนจากการเปิดหน้าจอค้างไว้นานเกิน 10 นาที
        </div>
      </div>

      {error && (
        <div className="glass-panel admin-error-box">
          <AlertTriangle size={16} /> <span>{error}</span>
        </div>
      )}

      {/* Summary KPIs */}
      <div className="admin-kpi-grid admin-kpi-grid--compact">
        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><Target size={14} color="var(--ink-emerald)" /> True Accuracy รวม</div>
          <div className="admin-kpi-value tabular-nums" style={{ color: accuracyTone(summary.true_accuracy_pct) }}>
            {summary.true_accuracy_pct !== null && summary.true_accuracy_pct !== undefined ? `${summary.true_accuracy_pct}%` : '-'}
          </div>
          <div className="admin-kpi-sub tabular-nums">
            ตอบจริง {(summary.answered_count ?? 0).toLocaleString()} ข้อ · เว้นว่าง {(summary.blank_count ?? 0).toLocaleString()} ข้อ
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><BarChart3 size={14} color="var(--primary-light)" /> Answered Rate</div>
          <div className="admin-kpi-value tabular-nums">
            {summary.answered_rate_pct !== null && summary.answered_rate_pct !== undefined ? `${summary.answered_rate_pct}%` : '-'}
          </div>
          <div className="admin-kpi-sub tabular-nums">จากทั้งหมด {(summary.total_rows ?? 0).toLocaleString()} แถวคำตอบ</div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><Clock size={14} color="var(--ink-sky)" /> Median / Capped Avg</div>
          <div className="admin-kpi-value tabular-nums" style={{ fontSize: '1.3rem' }}>
            {formatSeconds(summary.median_time_sec)} / {formatSeconds(summary.capped_avg_time_sec)}
          </div>
          <div className="admin-kpi-sub tabular-nums">
            Outliers &gt;10 นาที: {summary.outlier_count_gt_600s ?? 0} แถว
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><ShieldAlert size={14} color="var(--ink-rose)" /> Distractor Alerts</div>
          <div className="admin-kpi-value tabular-nums" style={{ color: distractors.length > 0 ? 'var(--ink-rose)' : 'var(--ink-emerald)' }}>
            {distractors.length}
          </div>
          <div className="admin-kpi-sub tabular-nums">
            จาก {summary.eligible_questions_count ?? 0} ข้อที่ตอบ ≥ {minAttempts} ครั้ง
          </div>
        </div>
      </div>

      {/* 11-Specialty Psychometrics Table */}
      <div className="glass-panel admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
          <h3 className="admin-card-title">ประสิทธิภาพรายสาขา (Answered Rate vs True Accuracy & Timing)</h3>
        </div>
        {loading && !data ? (
          <div className="admin-empty-state"><Loader2 size={22} className="spin" /> กำลังคำนวณ Psychometrics…</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>สาขาวิชา</th>
                  <th style={{ textAlign: 'right' }}>ตอบจริง / ทั้งหมด</th>
                  <th style={{ minWidth: '130px' }}>Answered Rate</th>
                  <th style={{ minWidth: '130px' }}>True Accuracy</th>
                  <th style={{ textAlign: 'right' }}>Median</th>
                  <th style={{ textAlign: 'right' }}>Capped Avg</th>
                  <th style={{ textAlign: 'right' }}>Outliers &gt;10m</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => {
                  const highBlank = c.total_rows > 0 && (c.answered_rate_pct ?? 0) < 50;
                  return (
                    <tr key={c.category}>
                      <td style={{ fontWeight: 600 }}>
                        {c.category}
                        {highBlank && (
                          <span className="badge" style={{ marginLeft: '0.45rem', color: 'var(--ink-amber)', background: 'rgba(245,158,11,0.12)' }}>
                            ข้ามสูง
                          </span>
                        )}
                      </td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>
                        <strong>{c.answered_count.toLocaleString()}</strong>
                        <span style={{ color: 'var(--text-muted)' }}> / {c.total_rows.toLocaleString()}</span>
                      </td>
                      <td className="tabular-nums">
                        {c.answered_rate_pct !== null ? (
                          <div className="admin-inline-bar">
                            <div className="admin-bar-track" style={{ flex: 1 }}>
                              <div className="admin-bar-fill" style={{ width: `${c.answered_rate_pct}%`, background: 'var(--ink-sky)' }} />
                            </div>
                            <span style={{ width: '44px', textAlign: 'right', fontSize: '0.8rem' }}>{c.answered_rate_pct}%</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td className="tabular-nums">
                        {c.true_accuracy_pct !== null ? (
                          <div className="admin-inline-bar">
                            <div className="admin-bar-track" style={{ flex: 1 }}>
                              <div className="admin-bar-fill" style={{ width: `${c.true_accuracy_pct}%`, background: accuracyTone(c.true_accuracy_pct) }} />
                            </div>
                            <span style={{ width: '44px', textAlign: 'right', fontWeight: 700, color: accuracyTone(c.true_accuracy_pct), fontSize: '0.8rem' }}>
                              {c.true_accuracy_pct}%
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>{formatSeconds(c.median_time_sec)}</td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>{formatSeconds(c.capped_avg_time_sec)}</td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>
                        {c.outlier_count_gt_600s > 0 ? (
                          <span className="badge" style={{ color: 'var(--ink-amber)', background: 'rgba(245,158,11,0.12)' }}>
                            {c.outlier_count_gt_600s}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2-Column Deep Diagnostic Cards */}
      <div className="admin-two-col">
        {/* Top Hardest Questions */}
        <div className="glass-panel admin-card">
          <div className="admin-card-head">
            <div>
              <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Flame size={16} color="var(--ink-amber)" /> ข้อสอบที่ตอบผิดบ่อยที่สุด (Top Hardest)
              </h3>
              <p className="admin-card-sub">กรองเฉพาะข้อที่ถูกตอบจริง ≥ {minAttempts} ครั้ง</p>
            </div>
          </div>

          {hardest.length === 0 ? (
            <div className="admin-muted-note">
              ยังไม่มีข้อสอบที่ถูกตอบจริงครบ {minAttempts} ครั้งในช่วงเวลานี้ (ลองลดเกณฑ์ขั้นต่ำหรือขยายช่วงเวลา)
            </div>
          ) : (
            <div className="admin-item-list">
              {hardest.map((q) => (
                <div key={q.question_id} className="admin-sub-card">
                  <div className="admin-sub-card-head">
                    <div className="admin-chip-row">
                      <span className="badge badge-primary">Q{q.question_id}</span>
                      <span className="badge">{q.category}</span>
                      {q.source_exam && <span className="badge">{q.source_exam}</span>}
                    </div>
                    <span
                      className="badge tabular-nums"
                      style={{
                        color: accuracyTone(q.true_accuracy_pct),
                        background: 'var(--surface-subtle)',
                        fontWeight: 700,
                      }}
                    >
                      ถูก {q.true_accuracy_pct}% ({q.answered_count} คน)
                    </span>
                  </div>
                  <p className="admin-question-snippet">{q.question_preview}{q.question_preview?.length >= 180 ? '…' : ''}</p>
                  <div className="admin-sub-card-foot tabular-nums">
                    <span>เฉลย: <strong>{q.correct_answer || '-'}</strong></span>
                    {q.must_know_topic && <span>· Topic: {q.must_know_topic}</span>}
                    {q.median_time_sec !== null && <span>· Median {formatSeconds(q.median_time_sec)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distractor Alerts */}
        <div className="glass-panel admin-card">
          <div className="admin-card-head">
            <div>
              <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={16} color="var(--ink-rose)" /> สัญญาณเตือนตัวลวง (Distractor Alerts)
              </h3>
              <p className="admin-card-sub">ข้อที่มีช้อยส์ผิดถูกเลือกมากกว่าเฉลย — ควรตรวจซ้ำว่าเฉลยผิดหรือตัวลวงกำกวม</p>
            </div>
          </div>

          {distractors.length === 0 ? (
            <div className="admin-muted-note">
              ไม่พบข้อที่มีตัวลวงถูกเลือกมากกว่าเฉลย (ที่เกณฑ์ ≥ {minAttempts} คำตอบ)
            </div>
          ) : (
            <div className="admin-item-list">
              {distractors.map((d) => (
                <div key={d.question_id} className="admin-sub-card" style={{ borderColor: 'rgba(244,63,94,0.28)' }}>
                  <div className="admin-sub-card-head">
                    <div className="admin-chip-row">
                      <span className="badge badge-primary">Q{d.question_id}</span>
                      <span className="badge">{d.category}</span>
                    </div>
                    <span className="badge tabular-nums" style={{ color: 'var(--ink-rose)', background: 'rgba(244,63,94,0.12)' }}>
                      ลวง {d.top_distractor_label}: {d.top_distractor_pct}% vs เฉลย {d.correct_answer}: {d.correct_choice_pct}%
                    </span>
                  </div>
                  <p className="admin-question-snippet">{d.question_preview}{d.question_preview?.length >= 180 ? '…' : ''}</p>
                  <div className="admin-distractor-bars">
                    {d.choice_distribution.map((ch) => (
                      <div key={ch.label} className="admin-dist-row tabular-nums">
                        <span
                          className="admin-dist-label"
                          style={{
                            color: ch.is_correct
                              ? 'var(--ink-emerald)'
                              : ch.is_top_distractor
                              ? 'var(--ink-rose)'
                              : 'var(--text-sub)',
                            fontWeight: ch.is_correct || ch.is_top_distractor ? 700 : 500,
                          }}
                        >
                          {ch.label}{ch.is_correct ? ' ✓' : ch.is_top_distractor ? ' !' : ''}
                        </span>
                        <div className="admin-bar-track" style={{ flex: 1 }}>
                          <div
                            className="admin-bar-fill"
                            style={{
                              width: `${ch.pct}%`,
                              background: ch.is_correct
                                ? 'var(--ink-emerald)'
                                : ch.is_top_distractor
                                ? 'var(--ink-rose)'
                                : 'var(--text-muted)',
                            }}
                          />
                        </div>
                        <span className="admin-dist-val">{ch.count} ({ch.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
