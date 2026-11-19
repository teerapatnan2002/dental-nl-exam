import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Activity, Radio, ClipboardList, Target, AlertTriangle,
  RefreshCw, Loader2, Clock, Shield, GraduationCap, ArrowRight,
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { MODE_LABELS, TIER_META, accuracyTone, formatShortDay } from './adminFormatters';

const SERIES_OPTIONS = [
  { key: 'answered', label: 'คำตอบจริง (ข้อ)', color: 'var(--primary-light)' },
  { key: 'sessions', label: 'Exam Sessions', color: 'var(--ink-emerald)' },
  { key: 'signups', label: 'ผู้สมัครใหม่', color: 'var(--ink-amber)' },
];

export default function AdminOverviewTab({ onOverviewLoaded, onJumpToReports }) {
  const { authFetch } = useAuth();
  const [days, setDays] = useState(30);
  const [seriesMetric, setSeriesMetric] = useState('answered');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const loadOverview = useCallback(async (targetDays = days) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/admin/overview?days=${targetDays}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      if (onOverviewLoaded) onOverviewLoaded(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, days, onOverviewLoaded]);

  useEffect(() => {
    loadOverview(days);
  }, [days, loadOverview]);

  if (loading && !data) {
    return (
      <div className="glass-panel admin-empty-state">
        <Loader2 size={24} className="spin" />
        <span>กำลังโหลดภาพรวมระบบ…</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="glass-panel admin-error-box">
        <AlertTriangle size={18} />
        <span>โหลดข้อมูลภาพรวมไม่สำเร็จ: {error}</span>
        <button className="btn btn-secondary btn-sm" onClick={() => loadOverview(days)}>ลองใหม่</button>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const series = data?.daily_series || [];
  const peakHours = data?.peak_hours || [];
  const modeSplit = data?.mode_split || [];
  const cohorts = data?.cohorts || [];
  const tiers = data?.tiers || [];
  const profileHealth = data?.profile_health || {};
  const timingSplit = data?.timing_split || { timed: 0, untimed: 0 };

  const activeSeriesMeta = SERIES_OPTIONS.find((s) => s.key === seriesMetric) || SERIES_OPTIONS[0];
  const maxSeriesVal = Math.max(1, ...series.map((d) => Number(d[seriesMetric] || 0)));
  const totalSeriesVal = series.reduce((acc, d) => acc + Number(d[seriesMetric] || 0), 0);

  const maxHourVal = Math.max(1, ...peakHours.map((h) => h.sessions));
  const topPeakHour = peakHours.reduce((best, cur) => (cur.sessions > best.sessions ? cur : best), { hour: 0, sessions: 0 });
  const hoveredDay = hoveredIdx !== null ? series[hoveredIdx] : null;

  return (
    <div className="admin-section-stack">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-pill-group" role="group" aria-label="เลือกช่วงเวลาภาพรวม">
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
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => loadOverview(days)}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> รีเฟรช
        </button>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label">
            <Users size={15} color="var(--primary-light)" /> ผู้ใช้งานทั้งหมด
          </div>
          <div className="admin-kpi-value tabular-nums">{(kpis.total_users ?? 0).toLocaleString()}</div>
          <div className="admin-kpi-sub tabular-nums">
            +{kpis.new_users_period ?? 0} สมัครใหม่ใน {days} วัน
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label">
            <Activity size={15} color="var(--ink-emerald)" /> Activation Rate
          </div>
          <div className="admin-kpi-value tabular-nums" style={{ color: accuracyTone(kpis.activation_rate_pct) }}>
            {kpis.activation_rate_pct ?? 0}%
          </div>
          <div className="admin-kpi-sub tabular-nums">
            {kpis.active_users_all_time ?? 0}/{kpis.total_users ?? 0} คนเคยทำข้อสอบ · Active {days}d: {kpis.active_users_period ?? 0}
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label">
            <Radio size={15} color="var(--ink-emerald)" /> ออนไลน์ขณะนี้
          </div>
          <div className="admin-kpi-value tabular-nums" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="admin-live-dot" />
            {kpis.online_users_now ?? 0}
          </div>
          <div className="admin-kpi-sub tabular-nums">
            Active ภายใน {kpis.online_window_seconds ?? 90} วินาทีล่าสุด
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label">
            <ClipboardList size={15} color="var(--ink-sky)" /> Exam Sessions
          </div>
          <div className="admin-kpi-value tabular-nums">{(kpis.total_sessions ?? 0).toLocaleString()}</div>
          <div className="admin-kpi-sub tabular-nums">
            +{kpis.sessions_period ?? 0} รอบใน {days} วัน · จบชุด {kpis.completed_sessions ?? 0}
          </div>
        </div>

        <div className="glass-panel admin-kpi-card">
          <div className="admin-kpi-label">
            <Target size={15} color="var(--ink-amber)" /> True Accuracy
          </div>
          <div className="admin-kpi-value tabular-nums" style={{ color: accuracyTone(kpis.true_accuracy_pct) }}>
            {kpis.true_accuracy_pct !== null && kpis.true_accuracy_pct !== undefined
              ? `${kpis.true_accuracy_pct}%`
              : '-'}
          </div>
          <div className="admin-kpi-sub tabular-nums">
            ตอบจริง {(kpis.answered_count ?? 0).toLocaleString()}/{(kpis.total_answer_rows ?? 0).toLocaleString()} ({kpis.answered_rate_pct ?? 0}%)
          </div>
        </div>

        <button
          type="button"
          className="glass-panel admin-kpi-card admin-kpi-card--clickable"
          onClick={() => onJumpToReports && onJumpToReports()}
        >
          <div className="admin-kpi-label">
            <AlertTriangle size={15} color={(kpis.open_reports_count ?? 0) > 0 ? 'var(--ink-rose)' : 'var(--ink-emerald)'} />
            แจ้งปัญหาค้างตรวจ
          </div>
          <div
            className="admin-kpi-value tabular-nums"
            style={{ color: (kpis.open_reports_count ?? 0) > 0 ? 'var(--ink-rose)' : 'var(--ink-emerald)' }}
          >
            {kpis.open_reports_count ?? 0}
          </div>
          <div className="admin-kpi-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            เปิด Report Triage <ArrowRight size={12} />
          </div>
        </button>
      </div>

      {/* Daily Trend SVG Chart */}
      <div className="glass-panel admin-card">
        <div className="admin-card-head">
          <div>
            <h3 className="admin-card-title">แนวโน้มการใช้งานรายวัน ({days} วันล่าสุด · เวลาไทย)</h3>
            <p className="admin-card-sub tabular-nums">
              {hoveredDay
                ? `${hoveredDay.date} · สมัครใหม่ ${hoveredDay.signups} · Sessions ${hoveredDay.sessions} · ตอบจริง ${hoveredDay.answered} ข้อ`
                : `รวม ${activeSeriesMeta.label}: ${totalSeriesVal.toLocaleString()} (ชี้แท่งกราฟเพื่อดูรายละเอียดรายวัน)`}
            </p>
          </div>
          <div className="admin-pill-group">
            {SERIES_OPTIONS.map((opt) => (
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
            viewBox="0 0 720 190"
            className="admin-svg-chart"
            role="img"
            aria-label={`กราฟรายวัน ${activeSeriesMeta.label}`}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
              const y = 16 + (1 - frac) * 140;
              const val = Math.round(maxSeriesVal * frac);
              return (
                <g key={idx}>
                  <line x1="38" y1={y} x2="710" y2={y} stroke="var(--border)" strokeDasharray="3 3" />
                  <text x="32" y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {series.map((day, idx) => {
              const chartW = 668;
              const slotW = chartW / Math.max(1, series.length);
              const barW = Math.max(3, Math.min(22, slotW - 3));
              const x = 40 + idx * slotW + (slotW - barW) / 2;
              const v = Number(day[seriesMetric] || 0);
              const barH = v > 0 ? Math.max(4, (v / maxSeriesVal) * 140) : 2;
              const y = 156 - barH;
              const isHovered = hoveredIdx === idx;
              const showLabel =
                series.length <= 14 ||
                idx === 0 ||
                idx === series.length - 1 ||
                idx % Math.ceil(series.length / 7) === 0;

              return (
                <g
                  key={day.date}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect x={40 + idx * slotW} y={12} width={slotW} height={152} fill="transparent" />
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={Math.min(4, barW / 2)}
                    fill={v > 0 ? activeSeriesMeta.color : 'var(--border)'}
                    opacity={hoveredIdx === null || isHovered ? 0.92 : 0.4}
                  />
                  {showLabel && (
                    <text
                      x={x + barW / 2}
                      y={176}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isHovered ? 'var(--text)' : 'var(--text-muted)'}
                    >
                      {formatShortDay(day.date)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom 2-Column Insights */}
      <div className="admin-two-col">
        {/* Peak Study Hours */}
        <div className="glass-panel admin-card">
          <div className="admin-card-head">
            <div>
              <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="var(--ink-sky)" /> ช่วงเวลาที่นิยมเข้าฝึก (เวลาไทย 00–23 น.)
              </h3>
              <p className="admin-card-sub tabular-nums">
                {topPeakHour.sessions > 0
                  ? `ช่วงพีคสุด: ${String(topPeakHour.hour).padStart(2, '0')}:00–${String((topPeakHour.hour + 1) % 24).padStart(2, '0')}:00 น. (${topPeakHour.sessions} sessions)`
                  : 'ยังไม่มีข้อมูลช่วงเวลา'}
              </p>
            </div>
          </div>

          <div className="admin-hour-grid">
            {peakHours.map((h) => {
              const heightPct = h.sessions > 0 ? Math.max(10, Math.round((h.sessions / maxHourVal) * 100)) : 4;
              const isPeak = h.sessions > 0 && h.sessions === topPeakHour.sessions;
              return (
                <div
                  key={h.hour}
                  className="admin-hour-col"
                  title={`${String(h.hour).padStart(2, '0')}:00 น. — ${h.sessions} sessions`}
                >
                  <div className="admin-hour-bar-slot">
                    <div
                      className="admin-hour-bar"
                      style={{
                        height: `${heightPct}%`,
                        background: isPeak
                          ? 'var(--ink-amber)'
                          : h.sessions > 0
                          ? 'var(--primary-light)'
                          : 'var(--border)',
                        opacity: h.sessions > 0 ? 0.9 : 0.4,
                      }}
                    />
                  </div>
                  <span className="admin-hour-tick tabular-nums">
                    {h.hour % 3 === 0 ? String(h.hour).padStart(2, '0') : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mode Split + Cohorts + Profile Health */}
        <div className="glass-panel admin-card">
          <div className="admin-card-head">
            <div>
              <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GraduationCap size={16} color="var(--ink-emerald)" /> โหมดการฝึก & กลุ่มเป้าหมายผู้สอบ
              </h3>
              <p className="admin-card-sub tabular-nums">
                จับเวลา {timingSplit.timed} รอบ · ไม่จับเวลา {timingSplit.untimed} รอบ
              </p>
            </div>
          </div>

          <div className="admin-mini-list">
            <div className="admin-mini-heading">สัดส่วนโหมดการสอบ (Exam Mode)</div>
            {modeSplit.length === 0 ? (
              <div className="admin-muted-note">ยังไม่มีประวัติการทำข้อสอบ</div>
            ) : (
              modeSplit.map((m) => (
                <div key={m.mode} className="admin-bar-row">
                  <div className="admin-bar-row-head">
                    <span>{MODE_LABELS[m.mode] || m.mode}</span>
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
            <div className="admin-mini-heading">รอบสอบเป้าหมาย (Normalized Target Cohort)</div>
            {cohorts.map((c) => (
              <div key={c.label} className="admin-bar-row">
                <div className="admin-bar-row-head">
                  <span>{c.label}</span>
                  <span className="tabular-nums">{c.count} คน ({c.pct}%)</span>
                </div>
                <div className="admin-bar-track">
                  <div className="admin-bar-fill" style={{ width: `${c.pct}%`, background: 'var(--ink-emerald)' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="admin-divider" />

          <div className="admin-chip-row">
            <span className="badge">
              <Shield size={12} /> 2FA: {profileHealth.two_factor_enabled_count ?? 0}/{kpis.total_users ?? 0} ({profileHealth.two_factor_rate_pct ?? 0}%)
            </span>
            <span className="badge">
              กรอกสถาบัน: {profileHealth.dental_school_filled ?? 0}/{kpis.total_users ?? 0} ({profileHealth.dental_school_rate_pct ?? 0}%)
            </span>
            {tiers.map((t) => {
              const meta = TIER_META[t.tier] || { label: t.tier, color: 'var(--text-sub)', bg: 'var(--surface-subtle)' };
              return (
                <span key={t.tier} className="badge" style={{ color: meta.color, background: meta.bg }}>
                  {meta.label}: {t.count}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
