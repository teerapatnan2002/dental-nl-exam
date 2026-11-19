import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Download, RefreshCw, Loader2, Shield, ShieldCheck,
  AlertTriangle, SlidersHorizontal, X, Check,
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import {
  TIER_META,
  SUB_STATUS_META,
  accuracyTone,
  formatRelativeTime,
  formatThaiDate,
  formatThaiDateTime,
} from './adminFormatters';

export default function AdminUsersTab() {
  const { authFetch, user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Access / Entitlement edit modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('user');
  const [editTier, setEditTier] = useState('early_access');
  const [editStatus, setEditStatus] = useState('active');
  const [editExpiresDate, setEditExpiresDate] = useState('');
  const [clearExpires, setClearExpires] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(id);
  }, [search]);

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (tierFilter !== 'all') params.set('tier', tierFilter);
    if (activityFilter !== 'all') params.set('activity', activityFilter);
    params.set('sort', sortBy);
    params.set('limit', '200');
    return params.toString();
  }, [debouncedSearch, roleFilter, tierFilter, activityFilter, sortBy]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryParams();
      const res = await authFetch(`${API_BASE}/api/admin/users?${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, buildQueryParams]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (tierFilter !== 'all') params.set('tier', tierFilter);
      if (activityFilter !== 'all') params.set('activity', activityFilter);
      const res = await authFetch(`${API_BASE}/api/admin/users/export?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin_users_engagement_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`ดาวน์โหลด CSV ไม่สำเร็จ: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditRole(u.role || 'user');
    setEditTier(u.subscription_tier || 'early_access');
    setEditStatus(u.subscription_status || 'active');
    if (u.subscription_expires_at) {
      const d = new Date(Number(u.subscription_expires_at) * 1000);
      setEditExpiresDate(d.toISOString().slice(0, 10));
      setClearExpires(false);
    } else {
      setEditExpiresDate('');
      setClearExpires(false);
    }
    setEditError(null);
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const payload = {
        role: editRole,
        subscription_tier: editTier,
        subscription_status: editStatus,
        clear_subscription_expires_at: clearExpires,
      };
      if (!clearExpires && editExpiresDate) {
        const ts = Math.floor(new Date(`${editExpiresDate}T23:59:59+07:00`).getTime() / 1000);
        if (!Number.isNaN(ts)) payload.subscription_expires_at = ts;
      }
      const res = await authFetch(`${API_BASE}/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.detail || `HTTP ${res.status}`);
      setEditingUser(null);
      setToastMsg(`อัปเดตสิทธิ์ของ @${editingUser.username} เรียบร้อยแล้ว`);
      setTimeout(() => setToastMsg(null), 4000);
      loadUsers();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const summary = data?.summary || {};
  const items = data?.items || [];
  const isEditingSelf = Boolean(editingUser && currentUser && editingUser.id === currentUser.id);

  return (
    <div className="admin-section-stack">
      {toastMsg && (
        <div className="admin-toast-ok">
          <Check size={15} /> {toastMsg}
        </div>
      )}

      {/* Filter & Export Toolbar */}
      <div className="glass-panel admin-filter-bar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            type="text"
            className="admin-input"
            placeholder="ค้นหา username, email, ชื่อ หรือสถาบัน…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="กรอง Role">
          <option value="all">ทุก Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select className="admin-select" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} aria-label="กรอง Tier">
          <option value="all">ทุก Tier</option>
          <option value="early_access">Early Access</option>
          <option value="free">Free</option>
          <option value="pro_monthly">Pro Monthly</option>
          <option value="pro_annual">Pro Annual</option>
        </select>

        <select className="admin-select" value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)} aria-label="กรองสถานะการใช้งาน">
          <option value="all">ทั้งหมด</option>
          <option value="active">เคยทำข้อสอบ</option>
          <option value="inactive">ยังไม่เคยทำข้อสอบ</option>
        </select>

        <select className="admin-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="เรียงลำดับ">
          <option value="newest">สมัครล่าสุด</option>
          <option value="last_active">ใช้งานล่าสุด</option>
          <option value="sessions">Sessions มากสุด</option>
          <option value="answered">ตอบจริงมากสุด</option>
          <option value="accuracy">True Accuracy สูงสุด</option>
        </select>

        <div className="admin-toolbar-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadUsers} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleExportCsv} disabled={exporting}>
            {exporting ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="admin-chip-row tabular-nums">
        <span className="badge badge-primary">แสดง {summary.total_matched ?? 0} / {summary.total_users ?? 0} คน</span>
        <span className="badge">เคยทำข้อสอบ: {summary.active_count ?? 0} คน</span>
        <span className="badge">เปิด 2FA: {summary.two_factor_count ?? 0} คน</span>
        <span className="badge">Admin: {summary.admin_count ?? 0} คน</span>
      </div>

      {error && (
        <div className="glass-panel admin-error-box">
          <AlertTriangle size={16} /> <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && !data ? (
          <div className="admin-empty-state">
            <Loader2 size={22} className="spin" /> กำลังโหลดรายชื่อผู้ใช้งาน…
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty-state">ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไขการค้นหา</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ผู้ใช้งาน</th>
                  <th>สิทธิ์ & แพ็กเกจ</th>
                  <th>2FA</th>
                  <th style={{ textAlign: 'right' }}>Sessions</th>
                  <th style={{ textAlign: 'right' }}>ตอบจริง / ทั้งหมด</th>
                  <th style={{ textAlign: 'right' }}>True Accuracy</th>
                  <th>ใช้งานล่าสุด</th>
                  <th style={{ textAlign: 'right' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => {
                  const tierMeta = TIER_META[u.subscription_tier] || { label: u.subscription_tier, color: 'var(--text-sub)', bg: 'var(--surface-subtle)' };
                  const statusMeta = SUB_STATUS_META[u.subscription_status] || { label: u.subscription_status, color: 'var(--text-muted)' };
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-name">
                            <span>{u.display_name || u.username}</span>
                            <span className="admin-user-handle">@{u.username}</span>
                          </div>
                          <div className="admin-user-email">{u.email}</div>
                          <div className="admin-user-meta">
                            <span>เป้าหมาย: {u.target_exam_session || '-'}</span>
                            {u.dental_school && <span>· {u.dental_school}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            <span
                              className="badge"
                              style={{
                                background: u.role === 'admin' ? 'rgba(244,63,94,0.14)' : 'var(--surface-subtle)',
                                color: u.role === 'admin' ? 'var(--ink-rose)' : 'var(--text-sub)',
                              }}
                            >
                              {u.role === 'admin' ? 'ADMIN' : 'USER'}
                            </span>
                            <span className="badge" style={{ background: tierMeta.bg, color: tierMeta.color }}>
                              {tierMeta.label}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: statusMeta.color }}>
                            {statusMeta.label}
                            {u.subscription_expires_at ? ` · หมดอายุ ${formatThaiDate(u.subscription_expires_at)}` : ' · ไม่จำกัดวัน'}
                          </span>
                        </div>
                      </td>
                      <td>
                        {u.two_factor_enabled ? (
                          <span className="badge" style={{ color: 'var(--ink-emerald)', background: 'rgba(16,185,129,0.12)' }}>
                            <ShieldCheck size={12} /> เปิด
                          </span>
                        ) : (
                          <span className="badge" style={{ color: 'var(--text-muted)' }}>
                            <Shield size={12} /> ปิด
                          </span>
                        )}
                      </td>
                      <td className="tabular-nums" style={{ textAlign: 'right', fontWeight: 600 }}>
                        {u.sessions_count}
                      </td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>
                          {u.answered_count.toLocaleString()}
                          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> / {u.total_answer_rows.toLocaleString()}</span>
                        </div>
                        {u.answered_rate_pct !== null && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            ตอบจริง {u.answered_rate_pct}%
                          </div>
                        )}
                      </td>
                      <td className="tabular-nums" style={{ textAlign: 'right' }}>
                        {u.true_accuracy_pct !== null ? (
                          <div className="admin-inline-acc">
                            <span style={{ fontWeight: 700, color: accuracyTone(u.true_accuracy_pct) }}>
                              {u.true_accuracy_pct}%
                            </span>
                            <div className="admin-bar-track" style={{ width: '58px' }}>
                              <div
                                className="admin-bar-fill"
                                style={{ width: `${u.true_accuracy_pct}%`, background: accuracyTone(u.true_accuracy_pct) }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }} title={u.last_active_at ? formatThaiDateTime(u.last_active_at) : ''}>
                          {formatRelativeTime(u.last_active_at)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          สมัคร {formatThaiDate(u.created_at)}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(u)}
                        >
                          <SlidersHorizontal size={13} /> จัดการ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inline Edit Modal */}
      {editingUser && (
        <div className="admin-modal-backdrop" onClick={() => !savingEdit && setEditingUser(null)}>
          <div className="glass-panel admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="admin-modal-head">
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>จัดการสิทธิ์ผู้ใช้งาน</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  @{editingUser.username} · {editingUser.email}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditingUser(null)}
                disabled={savingEdit}
                aria-label="ปิดหน้าต่าง"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="admin-modal-body">
              <label className="admin-field">
                <span>Role (บทบาท)</span>
                <select
                  className="admin-select"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  disabled={isEditingSelf}
                >
                  <option value="user">user (ผู้ใช้งานทั่วไป)</option>
                  <option value="admin">admin (ผู้ดูแลระบบ)</option>
                </select>
                {isEditingSelf && (
                  <small style={{ color: 'var(--ink-amber)' }}>
                    ไม่สามารถลดสิทธิ์บัญชีผู้ดูแลระบบของตนเองได้ (Self-Demotion Guard)
                  </small>
                )}
              </label>

              <label className="admin-field">
                <span>Subscription Tier</span>
                <select className="admin-select" value={editTier} onChange={(e) => setEditTier(e.target.value)}>
                  <option value="early_access">early_access</option>
                  <option value="free">free</option>
                  <option value="pro_monthly">pro_monthly</option>
                  <option value="pro_annual">pro_annual</option>
                </select>
              </label>

              <label className="admin-field">
                <span>Subscription Status</span>
                <select className="admin-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="active">active</option>
                  <option value="trialing">trialing</option>
                  <option value="past_due">past_due</option>
                  <option value="canceled">canceled</option>
                  <option value="expired">expired</option>
                </select>
              </label>

              <label className="admin-field">
                <span>วันหมดอายุสิทธิ์ (เว้นว่าง = ไม่เปลี่ยน)</span>
                <input
                  type="date"
                  className="admin-input"
                  value={editExpiresDate}
                  onChange={(e) => {
                    setEditExpiresDate(e.target.value);
                    if (e.target.value) setClearExpires(false);
                  }}
                  disabled={clearExpires}
                />
                <label className="admin-checkbox-row">
                  <input
                    type="checkbox"
                    checked={clearExpires}
                    onChange={(e) => setClearExpires(e.target.checked)}
                  />
                  <span>ล้างวันหมดอายุ (ตั้งเป็นไม่จำกัดวัน)</span>
                </label>
              </label>

              {editError && (
                <div className="admin-error-box">
                  <AlertTriangle size={15} /> <span>{editError}</span>
                </div>
              )}

              <div className="admin-modal-foot">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingUser(null)}
                  disabled={savingEdit}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={savingEdit}>
                  {savingEdit ? <Loader2 size={14} className="spin" /> : <Check size={14} />}
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
