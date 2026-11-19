import React, { useState, useCallback } from 'react';
import {
  ShieldCheck, LayoutDashboard, Users, BarChart3, AlertTriangle,
  Database, Radio, Lock,
} from 'lucide-react';
import AdminOverviewTab from './admin/AdminOverviewTab';
import AdminUsersTab from './admin/AdminUsersTab';
import AdminPsychometricsTab from './admin/AdminPsychometricsTab';
import AdminReportsTab from './admin/AdminReportsTab';
import AdminContentHealthTab from './admin/AdminContentHealthTab';
import AdminSecurityAuditTab from './admin/AdminSecurityAuditTab';

const ADMIN_TABS = [
  { id: 'overview', label: 'ภาพรวม', Icon: LayoutDashboard },
  { id: 'users', label: 'ผู้ใช้งาน & สิทธิ์', Icon: Users },
  { id: 'psychometrics', label: 'วิเคราะห์ข้อสอบ', Icon: BarChart3 },
  { id: 'reports', label: 'จัดการแจ้งปัญหา', Icon: AlertTriangle },
  { id: 'content', label: 'สุขภาพคลัง & ฟีเจอร์', Icon: Database },
  { id: 'security_audit', label: 'ความปลอดภัย & Audit', Icon: Lock },
];

/**
 * Multi-tab Admin Backend Analytics & Operations Dashboard (Zero-Cost 6-Tab Mode).
 * Rendered only for users with role === 'admin'.
 */
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dbBackendLabel, setDbBackendLabel] = useState(null);
  const [onlineNow, setOnlineNow] = useState(null);
  const [openReportsCount, setOpenReportsCount] = useState(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const handleOverviewLoaded = useCallback((overview) => {
    if (overview?.db_backend_label) setDbBackendLabel(overview.db_backend_label);
    if (overview?.kpis) {
      if (overview.kpis.online_users_now !== undefined) setOnlineNow(overview.kpis.online_users_now);
      if (overview.kpis.open_reports_count !== undefined) setOpenReportsCount(overview.kpis.open_reports_count);
      if (overview.kpis.pending_sync_edits_count !== undefined) setPendingSyncCount(overview.kpis.pending_sync_edits_count);
    }
  }, []);

  const handleReportSummaryChange = useCallback((summary) => {
    if (summary?.counts?.open !== undefined) {
      setOpenReportsCount(summary.counts.open);
    }
  }, []);

  const handleQuestionEdited = useCallback(() => {
    setPendingSyncCount((prev) => prev + 1);
  }, []);

  const handleJumpToReports = useCallback(() => {
    setActiveTab('reports');
  }, []);

  return (
    <div className="admin-shell animate-fade-in">
      {/* Top Admin Dashboard Header */}
      <div className="glass-panel admin-header">
        <div className="admin-header-title-wrap">
          <div className="admin-header-icon">
            <ShieldCheck size={22} color="var(--primary-light)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Admin Analytics & Operations Dashboard
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              ศูนย์ติดตามสถิติผู้สอบ ประสิทธิภาพข้อสอบ การแจ้งปัญหา ความปลอดภัย Audit Trail และคุณภาพคลังข้อสอบ ศ.ป.ท.
            </p>
          </div>
        </div>

        <div className="admin-header-badges tabular-nums">
          {dbBackendLabel && (
            <span className="badge">
              <Database size={12} /> {dbBackendLabel}
            </span>
          )}
          {onlineNow !== null && (
            <span className="badge" style={{ color: 'var(--ink-emerald)', background: 'rgba(16,185,129,0.12)' }}>
              <Radio size={12} /> ออนไลน์ {onlineNow} คน
            </span>
          )}
        </div>
      </div>

      {/* 6-Tab Navigation Bar */}
      <div className="admin-subtabs" role="tablist" aria-label="หมวดหมู่ Admin Dashboard">
        {ADMIN_TABS.map((tab) => {
          const Icon = tab.Icon;
          const isActive = activeTab === tab.id;
          const showReportBadge = tab.id === 'reports' && openReportsCount !== null && openReportsCount > 0;
          const showSyncBadge = tab.id === 'security_audit' && pendingSyncCount > 0;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`admin-subtab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {showReportBadge && (
                <span className="admin-tab-badge tabular-nums">{openReportsCount}</span>
              )}
              {showSyncBadge && (
                <span
                  className="admin-tab-badge tabular-nums"
                  style={{ background: 'var(--warning)', color: '#111' }}
                  title="มีรายการแก้ไขข้อสอบรอซิงก์"
                >
                  {pendingSyncCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content (lazy-fetched per tab) */}
      <div className="admin-tab-body">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            onOverviewLoaded={handleOverviewLoaded}
            onJumpToReports={handleJumpToReports}
          />
        )}
        {activeTab === 'users' && <AdminUsersTab />}
        {activeTab === 'psychometrics' && <AdminPsychometricsTab />}
        {activeTab === 'reports' && (
          <AdminReportsTab
            onSummaryChange={handleReportSummaryChange}
            onQuestionEdited={handleQuestionEdited}
          />
        )}
        {activeTab === 'content' && <AdminContentHealthTab />}
        {activeTab === 'security_audit' && (
          <AdminSecurityAuditTab onPendingSyncChange={setPendingSyncCount} />
        )}
      </div>
    </div>
  );
}
