import React, { useState, useEffect, useCallback } from 'react';
import {
  Bot, Sparkles, Clock, Coins, AlertTriangle, RefreshCw, Loader2, Users, MessageSquare,
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { formatLatencyMs, formatShortDay, formatThaiDateTime } from './adminFormatters';

const SERIES_OPTS = [
  { key: 'total', label: 'คำขอทั้งหมด', color: 'var(--primary-light)' },
  { key: 'llm', label: 'LLM จริง', color: 'var(--ink-emerald)' },
  { key: 'fallback', label: 'Evidence Fallback', color: 'var(--ink-amber)' },
  { key: 'tokens', label: 'Tokens', color: 'var(--ink-sky)' },
];

const STATUS_META = {
  ok: { label: 'LLM OK', color: 'var(--ink-emerald)', bg: 'rgba(16,185,129,0.12)' },
  fallback_no_key: { label: 'Fallback (No Key)', color: 'var(--ink-amber)', bg: 'rgba(245,158,11,0.12)' },
  fallback_error: { label: 'Fallback (Error)', color: 'var(--ink-rose)', bg: 'rgba(244,63,94,0.12)' },
};

export default function AdminAiTutorTab() {
  const { authFetch } = useAuth();
  const [days, setDays] = useState(30);
  const [seriesMetric, setSeriesMetric] = useState('total');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const loadData = useCallback(async (targetDays = days) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/admin/ai-tutor?days=${targetDays}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, days]);

  useEffect(() => {
    loadData(days);
  }, [days, loadData]);

  if (loading && !data) {
    return (
      <div className="glass-panel admin-empty-state">
        <Loader2 size={22} className="spin" /> กำลังโหลดสถิติ AI Tutor & ต้นทุน…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="glass-panel admin-error-box">
        <AlertTriangle size={16} /> <span>โหลดข้อมูลไม่สำเร็จ: {error}</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => loadData(days)}>ลองใหม่</button>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const series = data?.daily_series || [];
  const byModel = data?.by_model || [];
  const byTag = data?.by_tag || [];
  const topQuestions = data?.top_questions || [];
  const topTopics = data?.top_topics || [];
  const topUsers = data?.top_users || [];
  const recentLogs = data?.recent_logs || [];

  const activeMeta = SERIES_OPTS.find((s) => s.key === seriesMetric) || SERIES_OPTS[0];
  const maxVal = Math.max(1, ...series.map((d) => Number(d[seriesMetric] || 0)));
  const totalSeries = series.reduce((acc, d) => acc + Number(d[seriesMetric] || 0), 0);
  const hoveredDay = hoveredIdx !== null ? series[hoveredIdx] : null;

  return (
    <div className="admin-section-stack">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-pill-group">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              className={`btn btn-sm ${days === d ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDays(d)}
            >
              {d} วันล่าสุด
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => loadData(days)} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> รีเฟรช
        </button>
      </div>

      {/* 6 KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><Bot size={15} color="var(--primary-light)" /> คำขอ AI Tutor ทั้งหมด</div>
          <div className="admin-kpi-value tabular-nums">{(kpis.total_requests ?? 0).toLocaleString()}</div>
          <div className="admin-kpi-sub tabular-nums">ผู้ใช้งานไม่ซ้ำ {kpis.distinct_users ?? 0} คนใน {days} วัน</div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><Sparkles size={15} color="var(--ink-emerald)" /> สัดส่วน LLM vs Fallback</div>
          <div className="admin-kpi-value tabular-nums" style={{ color: 'var(--ink-emerald)' }}>
            {kpis.llm_rate_pct ?? 0}% LLM
          </div>
          <div className="admin-kpi-sub tabular-nums">
            LLM {kpis.llm_count ?? 0} · Fallback {kpis.fallback_count ?? 0} ({kpis.fallback_rate_pct ?? 0}%)
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><Clock size={15} color="var(--ink-sky)" /> Latency (p50 / p95)</div>
          <div className="admin-kpi-value tabular-nums" style={{ fontSize: '1.35rem' }}>
            {formatLatencyMs(kpis.p50_latency_ms)} / {formatLatencyMs(kpis.p95_latency_ms)}
          </div>
          <div className="admin-kpi-sub tabular-nums">
            LLM p50: {formatLatencyMs(kpis.llm_p50_latency_ms)}
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><Coins size={15} color="var(--ink-amber)" /> Token Usage รวม</div>
          <div className="admin-kpi-value tabular-nums">{(kpis.total_tokens ?? 0).toLocaleString()}</div>
          <div className="admin-kpi-sub tabular-nums">
            Prompt {(kpis.prompt_tokens ?? 0).toLocaleString()} · Completion {(kpis.completion_tokens ?? 0).toLocaleString()}
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label"><MessageSquare size={15} color="var(--primary-light)" /> เฉลี่ย Tokens / LLM Call</div>
          <div className="admin-kpi-value tabular-nums">
            {kpis.avg_tokens_per_llm_call !== null && kpis.avg_tokens_per_llm_call !== undefined
              ? kpis.avg_tokens_per_llm_call.toLocaleString()
              : '-'}
          </div>
          <div className="admin-kpi-sub">วัดจากคำขอที่เรียก LLM สำเร็จ</div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label">
            <AlertTriangle size={15} color={(kpis.error_count ?? 0) > 0 ? 'var(--ink-rose)' : 'var(--ink-emerald)'} /> LLM Errors
          </div>
          <div
            className="admin-kpi-value tabular-nums"
            style={{ color: (kpis.error_count ?? 0) > 0 ? 'var(--ink-rose)' : 'var(--ink-emerald)' }}
          >
            {kpis.error_count ?? 0}
          </div>
          <div className="admin-kpi-sub">ครั้งที่ต้องสลับไปใช้ Evidence Fallback เพราะ API ขัดข้อง</div>
        </div>
      </div>

      {/* Daily Trend SVG Chart */}
      <div className="glass-panel admin-card">
        <div className="admin-card-head">
          <div>
            <h3 className="admin-card-title">แนวโน้มการใช้งาน AI Tutor รายวัน ({days} วันล่าสุด)</h3>
            <p className="admin-card-sub tabular-nums">
              {hoveredDay
                ? `${hoveredDay.date} · รวม ${hoveredDay.total} (LLM ${hoveredDay.llm} / Fallback ${hoveredDay.fallback}) · ${hoveredDay.tokens.toLocaleString()} tokens`
                : `รวม ${activeMeta.label}: ${totalSeries.toLocaleString()}`}
            </p>
          </div>
          <div className="admin-pill-group">
            {SERIES_OPTS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`btn btn-sm ${seriesMetric === opt.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSeriesMetric(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-svg-wrap">
          <svg
            viewBox="0 0 720 185"
            className="admin-svg-chart"
            role="img"
            aria-label={`กราฟ AI Tutor รายวัน ${activeMeta.label}`}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
              const y = 16 + (1 - frac) * 135;
              return (
                <g key={idx}>
                  <line x1="42" y1={y} x2="710" y2={y} stroke="var(--border)" strokeDasharray="3 3" />
                  <text x="36" y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">
                    {Math.round(maxVal * frac)}
                  </text>
                </g>
              );
            })}
            {series.map((day, idx) => {
              const chartW = 664;
              const slotW = chartW / Math.max(1, series.length);
              const barW = Math.max(3, Math.min(22, slotW - 3));
              const x = 44 + idx * slotW + (slotW - barW) / 2;
              const v = Number(day[seriesMetric] || 0);
              const barH = v > 0 ? Math.max(4, (v / maxVal) * 135) : 2;
              const y = 151 - barH;
              const isHovered = hoveredIdx === idx;
              const showLabel =
                series.length <= 14 ||
                idx === 0 ||
                idx === series.length - 1 ||
                idx % Math.ceil(series.length / 7) === 0;
              return (
                <g key={day.date} onMouseEnter={() => setHoveredIdx(idx)} style={{ cursor: 'pointer' }}>
                  <rect x={44 + idx * slotW} y={12} width={slotW} height={148} fill="transparent" />
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={Math.min(4, barW / 2)}
                    fill={v > 0 ? activeMeta.color : 'var(--border)'}
                    opacity={hoveredIdx === null || isHovered ? 0.92 : 0.4}
                  />
                  {showLabel && (
                    <text x={x + barW / 2} y={172} textAnchor="middle" fontSize="10" fill={isHovered ? 'var(--text)' : 'var(--text-muted)'}>
                      {formatShortDay(day.date)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2-Column Breakdown */}
      <div className="admin-two-col">
        <div className="glass-panel admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '0.75rem' }}>สัดส่วนโมเดล & ประเด็นที่ผู้สอบถามบ่อย</h3>
          <div className="admin-mini-list">
            <div className="admin-mini-heading">แยกตาม Model</div>
            {byModel.length === 0 ? (
              <div className="admin-muted-note">ยังไม่มีบันทึกการเรียกใช้ AI Tutor ในช่วงเวลานี้</div>
            ) : (
              byModel.map((m) => (
                <div key={m.model} className="admin-bar-row">
                  <div className="admin-bar-row-head">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{m.model}</span>
                    <span className="tabular-nums">{m.count} ({m.pct}%)</span>
                  </div>
                  <div className="admin-bar-track">
                    <div className="admin-bar-fill" style={{ width: `${m.pct}%`, background: 'var(--primary-light)' }} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="admin-divider" />

          <div className="admin-mini-list">
            <div className="admin-mini-heading">ประเภทคำถาม (Inferred Tag)</div>
            {byTag.length === 0 ? (
              <div className="admin-muted-note">ยังไม่มีข้อมูล</div>
            ) : (
              byTag.map((t) => (
                <div key={t.tag} className="admin-bar-row">
                  <div className="admin-bar-row-head">
                    <span>{t.tag}</span>
                    <span className="tabular-nums">{t.count} ({t.pct}%)</span>
                  </div>
                  <div className="admin-bar-track">
                    <div className="admin-bar-fill" style={{ width: `${t.pct}%`, background: 'var(--ink-emerald)' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '0.75rem' }}>ข้อสอบ / หัวข้อที่ถูกถามบ่อย & ผู้ใช้งานหลัก</h3>
          <div className="admin-mini-heading" style={{ marginBottom: '0.45rem' }}>Top Asked Topics</div>
          {topTopics.length === 0 ? (
            <div className="admin-muted-note" style={{ marginBottom: '0.7rem' }}>ยังไม่มีข้อมูลหัวข้อ</div>
          ) : (
            <div className="admin-chip-row tabular-nums" style={{ marginBottom: '0.8rem' }}>
              {topTopics.slice(0, 8).map((t) => (
                <span key={t.topic_id} className="badge">
                  {t.topic_id} <strong>({t.ask_count})</strong>
                </span>
              ))}
            </div>
          )}

          <div className="admin-mini-heading" style={{ marginBottom: '0.45rem' }}>Top Asked Questions</div>
          {topQuestions.length === 0 ? (
            <div className="admin-muted-note" style={{ marginBottom: '0.7rem' }}>ยังไม่มีข้อสอบที่ถูกถาม</div>
          ) : (
            <div className="admin-item-list" style={{ marginBottom: '0.8rem' }}>
              {topQuestions.slice(0, 5).map((q) => (
                <div key={q.question_id} className="admin-sub-card" style={{ padding: '0.6rem 0.75rem' }}>
                  <div className="admin-sub-card-head">
                    <div className="admin-chip-row">
                      <span className="badge badge-primary">Q{q.question_id}</span>
                      {q.category && <span className="badge">{q.category}</span>}
                    </div>
                    <strong className="tabular-nums" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>
                      {q.ask_count} ครั้ง
                    </strong>
                  </div>
                  {q.question_preview && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {q.question_preview}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="admin-mini-heading" style={{ marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={12} /> ผู้ใช้งาน AI Tutor สูงสุด
          </div>
          {topUsers.length === 0 ? (
            <div className="admin-muted-note">ยังไม่มีผู้ใช้งาน</div>
          ) : (
            <div className="admin-chip-row tabular-nums">
              {topUsers.slice(0, 6).map((u) => (
                <span key={u.user_id} className="badge">
                  @{u.username}: {u.requests} ครั้ง ({u.total_tokens.toLocaleString()} tok)
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="glass-panel admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
          <h3 className="admin-card-title">บันทึกล่าสุด (30 รายการ — ไม่เก็บข้อความส่วนตัวของผู้ใช้)</h3>
        </div>
        {recentLogs.length === 0 ? (
          <div className="admin-empty-state">ยังไม่มีประวัติการเรียกใช้ AI Tutor ในช่วง {days} วันล่าสุด</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>เวลา</th>
                  <th>ผู้ใช้</th>
                  <th>ข้อสอบ / หัวข้อ</th>
                  <th>สถานะ & โมเดล</th>
                  <th style={{ textAlign: 'right' }}>Latency</th>
                  <th style={{ textAlign: 'right' }}>Tokens</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((row) => {
                  const sm = STATUS_META[row.status] || { label: row.status, color: 'var(--text-sub)', bg: 'var(--surface-subtle)' };
                  return (
                    <tr key={row.id}>
                      <td className="tabular-nums" style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatThaiDateTime(row.created_at)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{row.username ? `@${row.username}` : '-'}</td>
                      <td>
                        <div className="admin-chip-row">
                          {row.question_id && <span className="badge badge-primary">Q{row.question_id}</span>}
                          {row.topic_id && <span className="badge">{row.topic_id}</span>}
                          {row.suggested_tag && <span className="badge">{row.suggested_tag}</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                          <span className="badge" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {row.model_used || '-'}{row.error_code ? ` · ${row.error_code}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>{formatLatencyMs(row.latency_ms)}</td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>
                        {row.total_tokens !== null && row.total_tokens !== undefined ? row.total_tokens.toLocaleString() : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
