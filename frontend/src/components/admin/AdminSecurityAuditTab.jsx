import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert, ShieldCheck, ScrollText, GitCompare, RefreshCw, Loader2,
  Download, CheckCircle2, AlertTriangle, Lock, Check,
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import {
  AUTH_EVENT_LABELS,
  AUDIT_ACTION_LABELS,
  formatShortDay,
  formatThaiDateTime,
} from './adminFormatters';

export default function AdminSecurityAuditTab({ onPendingSyncChange }) {
  const { authFetch } = useAuth();
  const [subView, setSubView] = useState('security'); // 'security' | 'audit' | 'sync'

  // Security state
  const [secDays, setSecDays] = useState(30);
  const [eventFilter, setEventFilter] = useState('all');
  const [successFilter, setSuccessFilter] = useState('all');
  const [secData, setSecData] = useState(null);
  const [secLoading, setSecLoading] = useState(true);

  // Audit state
  const [auditDays, setAuditDays] = useState(90);
  const [actionFilter, setActionFilter] = useState('all');
  const [auditData, setAuditData] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [exportingAudit, setExportingAudit] = useState(false);

  // Sync queue state
  const [syncFilter, setSyncFilter] = useState('all');
  const [syncData, setSyncData] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncBusy, setSyncBusy] = useState(false);

  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const loadSecurity = useCallback(async () => {
    setSecLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ days: String(secDays) });
      if (eventFilter !== 'all') params.set('event_type', eventFilter);
      if (successFilter !== 'all') params.set('success', successFilter);
      const res = await authFetch(`${API_BASE}/api/admin/security?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSecData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setSecLoading(false);
    }
  }, [authFetch, secDays, eventFilter, successFilter]);

  const loadAudit = useCallback(async () => {
    setAuditLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ days: String(auditDays), limit: '150' });
      if (actionFilter !== 'all') params.set('action', actionFilter);
      const res = await authFetch(`${API_BASE}/api/admin/audit-logs?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAuditData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setAuditLoading(false);
    }
  }, [authFetch, auditDays, actionFilter]);

  const loadSyncQueue = useCallback(async () => {
    setSyncLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '150' });
      if (syncFilter !== 'all') params.set('sync_status', syncFilter);
      const res = await authFetch(`${API_BASE}/api/admin/question-edits?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSyncData(json);
      if (onPendingSyncChange && json?.counts?.pending_sync !== undefined) {
        onPendingSyncChange(json.counts.pending_sync);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncLoading(false);
    }
  }, [authFetch, syncFilter, onPendingSyncChange]);

  useEffect(() => {
    if (subView === 'security') loadSecurity();
    else if (subView === 'audit') loadAudit();
    else if (subView === 'sync') loadSyncQueue();
  }, [subView, loadSecurity, loadAudit, loadSyncQueue]);

  const handleExportAuditCsv = async () => {
    setExportingAudit(true);
    try {
      const params = new URLSearchParams({ days: String(auditDays) });
      if (actionFilter !== 'all') params.set('action', actionFilter);
      const res = await authFetch(`${API_BASE}/api/admin/audit-logs/export?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`ส่งออก Audit CSV ไม่สำเร็จ: ${err.message}`);
    } finally {
      setExportingAudit(false);
    }
  };

  const handleExportSyncJson = async () => {
    setSyncBusy(true);
    try {
      const res = await authFetch(`${API_BASE}/api/admin/question-edits/export-sync`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `question_sync_patch_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setToastMsg('ดาวน์โหลด Sync Patch JSON เรียบร้อยแล้ว');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err) {
      setError(`ส่งออก Sync JSON ไม่สำเร็จ: ${err.message}`);
    } finally {
      setSyncBusy(false);
    }
  };

  const handleMarkSynced = async ({ editIds = [], markAll = false }) => {
    setSyncBusy(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/admin/question-edits/mark-synced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edit_ids: editIds, mark_all: markAll }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setToastMsg(`ทำเครื่องหมายซิงก์แล้ว ${json.marked_count} รายการ`);
      setTimeout(() => setToastMsg(null), 3500);
      await loadSyncQueue();
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncBusy(false);
    }
  };

  const secKpis = secData?.kpis || {};
  const secSeries = secData?.daily_series || [];
  const suspiciousIps = secData?.suspicious_ips || [];
  const recentEvents = secData?.recent_events || [];
  const maxSecVal = Math.max(1, ...secSeries.map((d) => (d.login_success || 0) + (d.login_fail || 0)));

  const syncCounts = syncData?.counts || {};

  return (
    <div className="admin-section-stack">
      {/* Sub-view Switcher */}
      <div className="admin-toolbar">
        <div className="admin-pill-group">
          <button
            type="button"
            className={`btn btn-sm ${subView === 'security' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubView('security')}
          >
            <Lock size={14} /> Auth & Security
          </button>
          <button
            type="button"
            className={`btn btn-sm ${subView === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubView('audit')}
          >
            <ScrollText size={14} /> Admin Audit Trail
          </button>
          <button
            type="button"
            className={`btn btn-sm ${subView === 'sync' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubView('sync')}
          >
            <GitCompare size={14} /> Question Edit & Sync Queue
            {(syncCounts.pending_sync ?? 0) > 0 && (
              <span className="admin-tab-badge tabular-nums" style={{ background: 'var(--warning)', color: '#111' }}>
                {syncCounts.pending_sync}
              </span>
            )}
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="admin-toast-ok">
          <Check size={15} /> {toastMsg}
        </div>
      )}

      {error && (
        <div className="glass-panel admin-error-box">
          <AlertTriangle size={16} /> <span>{error}</span>
        </div>
      )}

      {/* ═══ SUB-VIEW 1: AUTH & SECURITY ═══ */}
      {subView === 'security' && (
        <>
          <div className="glass-panel admin-filter-bar">
            <select className="admin-select" value={secDays} onChange={(e) => setSecDays(Number(e.target.value))} aria-label="ช่วงเวลา">
              <option value={7}>7 วันล่าสุด</option>
              <option value={30}>30 วันล่าสุด</option>
              <option value={90}>90 วันล่าสุด</option>
            </select>
            <select className="admin-select" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} aria-label="ประเภทเหตุการณ์">
              <option value="all">ทุกเหตุการณ์</option>
              {Object.entries(AUTH_EVENT_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>{lbl}</option>
              ))}
            </select>
            <select className="admin-select" value={successFilter} onChange={(e) => setSuccessFilter(e.target.value)} aria-label="ผลลัพธ์">
              <option value="all">ทั้งหมด</option>
              <option value="ok">สำเร็จเท่านั้น</option>
              <option value="fail">ผิดพลาด/ถูกบล็อกเท่านั้น</option>
            </select>
            <div className="admin-toolbar-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={loadSecurity} disabled={secLoading}>
                <RefreshCw size={14} className={secLoading ? 'spin' : ''} /> รีเฟรช
              </button>
            </div>
          </div>

          <div className="admin-kpi-grid admin-kpi-grid--compact">
            <div className="glass-panel admin-kpi-card">
              <div className="admin-kpi-label"><ShieldCheck size={14} color="var(--ink-emerald)" /> Login สำเร็จ</div>
              <div className="admin-kpi-value tabular-nums" style={{ color: 'var(--ink-emerald)' }}>
                {(secKpis.login_success ?? 0).toLocaleString()}
              </div>
              <div className="admin-kpi-sub tabular-nums">สมัครใหม่ {secKpis.register_count ?? 0} บัญชี</div>
            </div>

            <div className="glass-panel admin-kpi-card">
              <div className="admin-kpi-label"><ShieldAlert size={14} color="var(--ink-rose)" /> Login ล้มเหลว</div>
              <div className="admin-kpi-value tabular-nums" style={{ color: (secKpis.login_fail ?? 0) > 0 ? 'var(--ink-rose)' : 'var(--text)' }}>
                {(secKpis.login_fail ?? 0).toLocaleString()}
              </div>
              <div className="admin-kpi-sub tabular-nums">Fail rate {secKpis.login_fail_rate_pct ?? 0}%</div>
            </div>

            <div className="glass-panel admin-kpi-card">
              <div className="admin-kpi-label"><Lock size={14} color="var(--ink-sky)" /> 2FA & รหัสผ่าน</div>
              <div className="admin-kpi-value tabular-nums">{(secKpis.two_fa_events ?? 0) + (secKpis.password_changes ?? 0)}</div>
              <div className="admin-kpi-sub tabular-nums">
                2FA: {secKpis.two_fa_events ?? 0} · เปลี่ยนรหัส: {secKpis.password_changes ?? 0}
              </div>
            </div>

            <div className="glass-panel admin-kpi-card">
              <div className="admin-kpi-label"><AlertTriangle size={14} color="var(--ink-amber)" /> Suspicious IPs / 429</div>
              <div
                className="admin-kpi-value tabular-nums"
                style={{ color: (secKpis.suspicious_ips_count ?? 0) > 0 ? 'var(--ink-rose)' : 'var(--ink-emerald)' }}
              >
                {secKpis.suspicious_ips_count ?? 0} / {secKpis.rate_limited_count ?? 0}
              </div>
              <div className="admin-kpi-sub">IP ที่ล้มเหลว ≥ 5 ครั้ง / ถูก Rate-limit</div>
            </div>
          </div>

          <div className="admin-two-col">
            {/* Daily Login Success vs Fail Chart */}
            <div className="glass-panel admin-card">
              <h3 className="admin-card-title">สถิติการเข้าสู่ระบบรายวัน (เขียว = สำเร็จ · แดง = ล้มเหลว)</h3>
              <p className="admin-card-sub" style={{ marginBottom: '0.75rem' }}>ช่วง {secDays} วันล่าสุด (เวลาไทย)</p>
              <div className="admin-svg-wrap">
                <svg viewBox="0 0 640 165" className="admin-svg-chart" style={{ minWidth: '380px' }} role="img" aria-label="กราฟ Login รายวัน">
                  {secSeries.map((day, idx) => {
                    const slotW = 600 / Math.max(1, secSeries.length);
                    const barW = Math.max(3, Math.min(18, slotW - 3));
                    const x = 24 + idx * slotW + (slotW - barW) / 2;
                    const okH = day.login_success > 0 ? Math.max(3, (day.login_success / maxSecVal) * 120) : 0;
                    const failH = day.login_fail > 0 ? Math.max(3, (day.login_fail / maxSecVal) * 120) : 0;
                    const showLbl =
                      secSeries.length <= 14 ||
                      idx === 0 ||
                      idx === secSeries.length - 1 ||
                      idx % Math.ceil(secSeries.length / 6) === 0;
                    return (
                      <g key={day.date}>
                        {okH === 0 && failH === 0 && (
                          <rect x={x} y={134} width={barW} height={2} fill="var(--border)" />
                        )}
                        {okH > 0 && (
                          <rect x={x} y={136 - okH} width={barW} height={okH} rx={2} fill="var(--ink-emerald)" opacity={0.88} />
                        )}
                        {failH > 0 && (
                          <rect x={x} y={136 - okH - failH} width={barW} height={failH} rx={2} fill="var(--ink-rose)" opacity={0.92} />
                        )}
                        {showLbl && (
                          <text x={x + barW / 2} y={154} textAnchor="middle" fontSize="9.5" fill="var(--text-muted)">
                            {formatShortDay(day.date)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Suspicious IP Alerts */}
            <div className="glass-panel admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '0.25rem' }}>แจ้งเตือน IP ที่มีความพยายามล้มเหลวสูง</h3>
              <p className="admin-card-sub" style={{ marginBottom: '0.75rem' }}>แสดง IP ที่ล้มเหลว ≥ 3 ครั้งในช่วง {secDays} วันล่าสุด</p>
              {suspiciousIps.length === 0 ? (
                <div className="admin-muted-note">ไม่พบ IP ที่น่าสงสัยในช่วงเวลานี้ ✓</div>
              ) : (
                <div className="admin-item-list">
                  {suspiciousIps.map((ip) => (
                    <div key={ip.ip_address} className="admin-sub-card">
                      <div className="admin-sub-card-head">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{ip.ip_address}</span>
                        <span
                          className="badge"
                          style={
                            ip.severity === 'high'
                              ? { color: 'var(--ink-rose)', background: 'rgba(244,63,94,0.14)' }
                              : { color: 'var(--ink-amber)', background: 'rgba(245,158,11,0.14)' }
                          }
                        >
                          {ip.severity === 'high' ? 'เสี่ยงสูง' : 'เฝ้าระวัง'} · ผิด {ip.fail_count} ครั้ง
                        </span>
                      </div>
                      <div className="admin-sub-card-foot tabular-nums" style={{ marginTop: '0.35rem' }}>
                        <span>สำเร็จ {ip.success_count} ครั้ง</span>
                        <span>· เป้าหมาย {ip.distinct_targets} บัญชี</span>
                        <span>· ล่าสุด {formatThaiDateTime(ip.last_seen_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Auth Events */}
          <div className="glass-panel admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
              <h3 className="admin-card-title">บันทึกเหตุการณ์ Auth ล่าสุด (Mask ข้อมูลระบุตัวตนตามหลัก PDPA)</h3>
            </div>
            {secLoading && !secData ? (
              <div className="admin-empty-state"><Loader2 size={20} className="spin" /> กำลังโหลด…</div>
            ) : recentEvents.length === 0 ? (
              <div className="admin-empty-state">ยังไม่มีเหตุการณ์ Auth ที่ตรงเงื่อนไข</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>เวลา</th>
                      <th>เหตุการณ์</th>
                      <th>ผลลัพธ์</th>
                      <th>บัญชี (Masked)</th>
                      <th>IP</th>
                      <th>รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td className="tabular-nums" style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {formatThaiDateTime(ev.created_at)}
                        </td>
                        <td style={{ fontWeight: 600 }}>{AUTH_EVENT_LABELS[ev.event_type] || ev.event_type}</td>
                        <td>
                          <span
                            className="badge"
                            style={
                              ev.success
                                ? { color: 'var(--ink-emerald)', background: 'rgba(16,185,129,0.12)' }
                                : { color: 'var(--ink-rose)', background: 'rgba(244,63,94,0.12)' }
                            }
                          >
                            {ev.success ? 'สำเร็จ' : 'ล้มเหลว'}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                          {ev.username ? `@${ev.username}` : (ev.identifier_masked || '-')}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {ev.ip_address || '-'}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ev.detail || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ SUB-VIEW 2: ADMIN AUDIT TRAIL ═══ */}
      {subView === 'audit' && (
        <>
          <div className="glass-panel admin-filter-bar">
            <select className="admin-select" value={auditDays} onChange={(e) => setAuditDays(Number(e.target.value))} aria-label="ช่วงเวลา Audit">
              <option value={30}>30 วันล่าสุด</option>
              <option value={90}>90 วันล่าสุด</option>
              <option value={365}>365 วันล่าสุด</option>
            </select>
            <select className="admin-select" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} aria-label="กรอง Action">
              <option value="all">ทุกการดำเนินการ</option>
              {Object.entries(AUDIT_ACTION_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>{lbl}</option>
              ))}
            </select>
            <div className="admin-toolbar-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={loadAudit} disabled={auditLoading}>
                <RefreshCw size={14} className={auditLoading ? 'spin' : ''} />
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleExportAuditCsv} disabled={exportingAudit}>
                {exportingAudit ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
                Export CSV
              </button>
            </div>
          </div>

          <div className="glass-panel admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
              <h3 className="admin-card-title">ประวัติการทำงานของ Admin (Immutable Audit Log · {auditData?.total_matched ?? 0} รายการ)</h3>
            </div>
            {auditLoading && !auditData ? (
              <div className="admin-empty-state"><Loader2 size={20} className="spin" /> กำลังโหลด Audit Log…</div>
            ) : !(auditData?.items || []).length ? (
              <div className="admin-empty-state">ยังไม่มีบันทึกการดำเนินการของ Admin</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>เวลา</th>
                      <th>ผู้ดูแลระบบ</th>
                      <th>การดำเนินการ</th>
                      <th>เป้าหมาย</th>
                      <th>IP</th>
                      <th>รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(auditData.items || []).map((row) => (
                      <tr key={row.id}>
                        <td className="tabular-nums" style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {formatThaiDateTime(row.created_at)}
                        </td>
                        <td style={{ fontWeight: 600 }}>@{row.admin_username}</td>
                        <td>
                          <span className="badge badge-primary">{AUDIT_ACTION_LABELS[row.action] || row.action}</span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                          {row.target_type}{row.target_id ? `#${row.target_id}` : ''}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {row.ip_address || '-'}
                        </td>
                        <td style={{ maxWidth: '340px' }}>
                          <code className="admin-json-pill">
                            {row.details ? JSON.stringify(row.details) : '-'}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ SUB-VIEW 3: QUESTION EDIT & SYNC QUEUE ═══ */}
      {subView === 'sync' && (
        <>
          <div className="glass-panel admin-filter-bar">
            <select className="admin-select" value={syncFilter} onChange={(e) => setSyncFilter(e.target.value)} aria-label="กรองสถานะซิงก์">
              <option value="all">ทั้งหมด ({syncCounts.total ?? 0})</option>
              <option value="pending_sync">รอซิงก์ ({syncCounts.pending_sync ?? 0})</option>
              <option value="synced">ซิงก์แล้ว ({syncCounts.synced ?? 0})</option>
            </select>
            <div className="admin-toolbar-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={loadSyncQueue} disabled={syncLoading}>
                <RefreshCw size={14} className={syncLoading ? 'spin' : ''} />
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleExportSyncJson}
                disabled={syncBusy || !(syncCounts.pending_sync > 0)}
              >
                <Download size={14} /> ส่งออก Sync Patch JSON ({syncCounts.pending_sync ?? 0})
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => handleMarkSynced({ markAll: true })}
                disabled={syncBusy || !(syncCounts.pending_sync > 0)}
              >
                <CheckCircle2 size={14} /> ยืนยันซิงก์ทั้งหมดแล้ว
              </button>
            </div>
          </div>

          {syncLoading && !syncData ? (
            <div className="glass-panel admin-empty-state"><Loader2 size={20} className="spin" /> กำลังโหลดคิวซิงก์ข้อสอบ…</div>
          ) : !(syncData?.items || []).length ? (
            <div className="glass-panel admin-empty-state">
              ยังไม่มีประวัติการแก้ไขข้อสอบจากหน้า Admin (สามารถกด "แก้ไขเฉลย/ข้อสอบ" ได้ในแท็บ จัดการแจ้งปัญหา)
            </div>
          ) : (
            <div className="admin-item-list">
              {(syncData.items || []).map((ed) => (
                <div key={ed.id} className="glass-panel admin-report-card">
                  <div className="admin-sub-card-head">
                    <div className="admin-chip-row">
                      <span className="badge badge-primary">Edit #{ed.id}</span>
                      <span className="badge">Q{ed.question_id}</span>
                      {ed.report_id && <span className="badge">Report #{ed.report_id}</span>}
                      {ed.category && <span className="badge">{ed.category}</span>}
                      <span
                        className="badge"
                        style={
                          ed.sync_status === 'pending_sync'
                            ? { color: 'var(--ink-amber)', background: 'rgba(245,158,11,0.14)' }
                            : { color: 'var(--ink-emerald)', background: 'rgba(16,185,129,0.14)' }
                        }
                      >
                        {ed.sync_status === 'pending_sync' ? 'รอซิงก์กลับ Obsidian/Repo' : 'ซิงก์แล้ว'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      โดย <strong>@{ed.admin_username}</strong> · {formatThaiDateTime(ed.created_at)}
                    </span>
                  </div>

                  {ed.edit_reason && (
                    <div style={{ fontSize: '0.84rem', marginTop: '0.5rem', color: 'var(--text-sub)' }}>
                      <strong>เหตุผล:</strong> {ed.edit_reason}
                    </div>
                  )}

                  <div className="admin-diff-list">
                    {Object.entries(ed.field_changes || {}).map(([field, diff]) => (
                      <div key={field} className="admin-diff-row">
                        <span className="admin-diff-field">{field}</span>
                        <span className="admin-diff-before">{String(diff?.before ?? '(ว่าง)')}</span>
                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                        <span className="admin-diff-after">{String(diff?.after ?? '(ว่าง)')}</span>
                      </div>
                    ))}
                  </div>

                  {ed.sync_status === 'pending_sync' && (
                    <div className="admin-report-actions" style={{ marginTop: '0.65rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={syncBusy}
                        onClick={() => handleMarkSynced({ editIds: [ed.id] })}
                      >
                        <CheckCircle2 size={13} /> ทำเครื่องหมายว่าซิงก์รายการนี้แล้ว
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
