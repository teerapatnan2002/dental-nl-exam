import React, { useState, useEffect, useCallback } from 'react';
import {
  Database, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Loader2,
  Bookmark, FileText, Layers, Brain, Copy, Check, Image,
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { EXAM_ORIGIN_LABELS } from './adminFormatters';

const SEVERITY_META = {
  pass:     { Icon: CheckCircle2, color: 'var(--ink-emerald)', bg: 'rgba(16,185,129,0.12)', label: 'ปกติ' },
  warning:  { Icon: AlertTriangle, color: 'var(--ink-amber)', bg: 'rgba(245,158,11,0.12)', label: 'ควรตรวจสอบ' },
  critical: { Icon: XCircle, color: 'var(--ink-rose)', bg: 'rgba(244,63,94,0.12)', label: 'ต้องแก้ไข' },
};

export default function AdminContentHealthTab() {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const loadHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/admin/content-health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  const handleCopyIds = async (key, ids) => {
    try {
      await navigator.clipboard.writeText(ids.join(', '));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback ignored if clipboard denied
    }
  };

  if (loading && !data) {
    return (
      <div className="glass-panel admin-empty-state">
        <Loader2 size={22} className="spin" /> กำลังตรวจสอบสุขภาพคลังข้อสอบและฟีเจอร์…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="glass-panel admin-error-box">
        <AlertTriangle size={16} /> <span>โหลดข้อมูลไม่สำเร็จ: {error}</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={loadHealth}>ลองใหม่</button>
      </div>
    );
  }

  const bank = data?.bank_summary || {};
  const tosCoverage = data?.tos_coverage || [];
  const integrityChecks = data?.integrity_checks || [];
  const fa = data?.feature_adoption || {};
  const sm2 = fa.sm2_health || {};
  const cardTypes = fa.user_card_reviews?.by_type || {};

  return (
    <div className="admin-section-stack">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-chip-row tabular-nums">
          <span className="badge badge-primary">
            <Database size={12} /> ข้อสอบทั้งหมด {(bank.total_questions ?? 0).toLocaleString()} ข้อ
          </span>
          <span className="badge">ข้อสอบจริง (real_exam): {(bank.real_exam_count ?? 0).toLocaleString()} ข้อ</span>
          <span className="badge">
            <Image size={12} /> มีรูปภาพ: {(bank.questions_with_images ?? 0).toLocaleString()} ข้อ
            {bank.image_fs_checked ? ' (ตรวจไฟล์บนดิสก์แล้ว)' : ' (CDN syntax check)'}
          </span>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={loadHealth} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> สแกนใหม่
        </button>
      </div>

      {/* 6 Automated Data Integrity Audit Cards */}
      <div className="glass-panel admin-card">
        <div className="admin-card-head">
          <div>
            <h3 className="admin-card-title">การตรวจสอบความสมบูรณ์ข้อมูลอัตโนมัติ (6 Data Integrity Rules)</h3>
            <p className="admin-card-sub">ตรวจเช็กโครงสร้างเฉลย, JSON คำอธิบาย, ตัวเลือก, Must-Know Topic และรูปภาพ</p>
          </div>
        </div>

        <div className="admin-audit-grid">
          {integrityChecks.map((chk) => {
            const meta = SEVERITY_META[chk.severity] || SEVERITY_META.pass;
            const Icon = meta.Icon;
            return (
              <div key={chk.key} className="admin-sub-card">
                <div className="admin-sub-card-head">
                  <span className="badge" style={{ color: meta.color, background: meta.bg }}>
                    <Icon size={13} /> {meta.label}
                  </span>
                  <strong className="tabular-nums" style={{ fontSize: '1.15rem', color: meta.color }}>
                    {chk.count.toLocaleString()} ข้อ
                  </strong>
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, marginTop: '0.45rem' }}>{chk.label}</div>
                {chk.sample_ids && chk.sample_ids.length > 0 && (
                  <div style={{ marginTop: '0.55rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                        ตัวอย่าง Q ID ({chk.sample_ids.length}{chk.count > chk.sample_ids.length ? ` จาก ${chk.count}` : ''}):
                      </span>
                      <button
                        type="button"
                        className="admin-quick-chip"
                        onClick={() => handleCopyIds(chk.key, chk.sample_ids)}
                      >
                        {copiedKey === chk.key ? <Check size={11} /> : <Copy size={11} />}
                        {copiedKey === chk.key ? 'คัดลอกแล้ว' : 'คัดลอก IDs'}
                      </button>
                    </div>
                    <div className="admin-id-chips tabular-nums">
                      {chk.sample_ids.slice(0, 12).map((qid) => (
                        <span key={qid} className="admin-id-chip">Q{qid}</span>
                      ))}
                      {chk.sample_ids.length > 12 && (
                        <span className="admin-id-chip">+{chk.sample_ids.length - 12}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bank Breakdown & TOS Coverage */}
      <div className="admin-two-col">
        {/* 11-Specialty Coverage vs TOS */}
        <div className="glass-panel admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
            <h3 className="admin-card-title">ความครอบคลุม 11 สาขาเทียบเกณฑ์ ศ.ป.ท. (TOS)</h3>
            <p className="admin-card-sub">เปรียบเทียบสัดส่วนข้อสอบจริง (`real_exam`) กับน้ำหนักเป้าหมาย</p>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>สาขาวิชา</th>
                  <th style={{ textAlign: 'right' }}>Real / ทั้งหมด</th>
                  <th style={{ textAlign: 'right' }}>สัดส่วนจริง</th>
                  <th style={{ textAlign: 'right' }}>เป้า TOS</th>
                  <th style={{ textAlign: 'right' }}>ส่วนต่าง</th>
                </tr>
              </thead>
              <tbody>
                {tosCoverage.map((row) => {
                  const deltaColor =
                    Math.abs(row.delta_pct) <= 2
                      ? 'var(--ink-emerald)'
                      : row.delta_pct < -2
                      ? 'var(--ink-amber)'
                      : 'var(--ink-sky)';
                  return (
                    <tr key={row.category}>
                      <td style={{ fontWeight: 500 }}>{row.category}</td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>
                        <strong>{row.real_exam_count}</strong>
                        <span style={{ color: 'var(--text-muted)' }}> / {row.total_count}</span>
                      </td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>{row.actual_pct}%</td>
                      <td className="tabular-nums" style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{row.target_pct}%</td>
                      <td className="tabular-nums" style={{ textAlign: 'right', fontWeight: 700, color: deltaColor }}>
                        {row.delta_pct > 0 ? `+${row.delta_pct}%` : `${row.delta_pct}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Origin / Cognitive + Feature Adoption & SM-2 */}
        <div className="admin-section-stack">
          <div className="glass-panel admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '0.75rem' }}>โครงสร้างแหล่งข้อสอบ & ระดับพุทธิพิสัย (R/A/P)</h3>
            <div className="admin-mini-list">
              <div className="admin-mini-heading">แยกตามแหล่งที่มา (exam_origin)</div>
              {(bank.by_exam_origin || []).map((o) => (
                <div key={o.origin} className="admin-bar-row">
                  <div className="admin-bar-row-head">
                    <span>{EXAM_ORIGIN_LABELS[o.origin] || o.origin}</span>
                    <span className="tabular-nums">{o.count.toLocaleString()} ({o.pct}%)</span>
                  </div>
                  <div className="admin-bar-track">
                    <div className="admin-bar-fill" style={{ width: `${o.pct}%`, background: 'var(--primary-light)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-divider" />
            <div className="admin-mini-heading" style={{ marginBottom: '0.45rem' }}>ระดับพุทธิพิสัย (Cognitive Level)</div>
            <div className="admin-chip-row tabular-nums">
              {(bank.by_cognitive_level || []).map((c) => (
                <span key={c.level} className="badge">
                  <strong>{c.level === 'unset' ? 'ยังไม่ระบุ' : c.level}</strong>: {c.count.toLocaleString()} ({c.pct}%)
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '0.75rem' }}>อัตราการใช้ฟีเจอร์เสริม & สุขภาพ SM-2</h3>
            <div className="admin-feature-grid tabular-nums">
              <div className="admin-feature-tile">
                <div className="admin-kpi-label"><Bookmark size={13} color="var(--ink-amber)" /> Bookmarks</div>
                <strong>{fa.bookmarks?.total ?? 0}</strong>
                <small>{fa.bookmarks?.distinct_users ?? 0} ผู้ใช้</small>
              </div>
              <div className="admin-feature-tile">
                <div className="admin-kpi-label"><FileText size={13} color="var(--ink-sky)" /> Question Notes</div>
                <strong>{fa.user_notes?.total ?? 0}</strong>
                <small>{fa.user_notes?.distinct_users ?? 0} ผู้ใช้</small>
              </div>
              <div className="admin-feature-tile">
                <div className="admin-kpi-label"><Layers size={13} color="var(--ink-emerald)" /> Topic Notes</div>
                <strong>{fa.user_topic_notes?.total ?? 0}</strong>
                <small>{fa.user_topic_notes?.distinct_users ?? 0} ผู้ใช้</small>
              </div>
              <div className="admin-feature-tile">
                <div className="admin-kpi-label"><Brain size={13} color="var(--primary-light)" /> Card Reviews</div>
                <strong>{fa.user_card_reviews?.total ?? 0}</strong>
                <small>F:{cardTypes.flashcard ?? 0} · T:{cardTypes.topic ?? 0} · C:{cardTypes.cloze ?? 0}</small>
              </div>
            </div>

            <div className="admin-divider" />

            <div className="admin-sm2-summary tabular-nums">
              <div>
                <span className="admin-muted-note">Confidence Tagging:</span>{' '}
                <strong>{fa.confidence_tagging?.tagged_answers ?? 0}</strong> / {fa.confidence_tagging?.total_answers ?? 0} ({fa.confidence_tagging?.tagged_pct ?? 0}%)
              </div>
              <div>
                <span className="admin-muted-note">SM-2 Tracked Cards:</span>{' '}
                <strong>{(sm2.total_tracked ?? 0).toLocaleString()}</strong> ({sm2.distinct_users ?? 0} ผู้ใช้)
              </div>
              <div>
                <span className="admin-muted-note">SM-2 Overdue:</span>{' '}
                <strong style={{ color: (sm2.overdue_pct ?? 0) > 70 ? 'var(--ink-amber)' : 'var(--ink-emerald)' }}>
                  {(sm2.overdue_count ?? 0).toLocaleString()} ({sm2.overdue_pct ?? 0}%)
                </strong>
                {' · '}Lapsed: <strong>{sm2.lapsed_count ?? 0}</strong>
                {sm2.avg_ease_factor !== null && sm2.avg_ease_factor !== undefined && (
                  <> · Avg Ease: <strong>{sm2.avg_ease_factor}</strong></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
