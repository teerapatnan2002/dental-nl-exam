import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, CircleCheck, XCircle, Eye, Loader2, RefreshCw,
  ChevronDown, ChevronUp, MessageSquare, Clock, Repeat, Pencil, Check,
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { STATUS_STYLES, ISSUE_LABELS, formatThaiDateTime } from './adminFormatters';

const QUICK_REPLIES = [
  'ตรวจสอบและปรับปรุงเฉลยเรียบร้อยแล้ว ขอบคุณที่ช่วยแจ้งครับ',
  'ตรวจสอบตามตำรา/แนวทางล่าสุดแล้ว เฉลยเดิมถูกต้องเนื่องจาก ',
  'แก้ไขคำสะกดและรูปแบบโจทย์เรียบร้อยแล้ว ขอบคุณครับ',
  'รับเรื่องแล้ว อยู่ระหว่างตรวจสอบข้อมูลจากตำราอ้างอิงครับ',
];

export default function AdminReportsTab({ onSummaryChange, onQuestionEdited }) {
  const { authFetch } = useAuth();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Expanded question preview, inline reply drawer & inline question quick-edit drawer
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [editOpenId, setEditOpenId] = useState(null);
  const [editForm, setEditForm] = useState({
    correct_answer: '',
    must_know_topic: '',
    question_text: '',
    edit_reason: '',
    resolve_report: true,
    admin_reply: 'ตรวจสอบและปรับปรุงข้อสอบเรียบร้อยแล้ว ขอบคุณที่ช่วยแจ้งครับ',
  });
  const [savingQuestion, setSavingQuestion] = useState(false);

  const loadData = useCallback(async (filter = statusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const qs = filter ? `?status=${encodeURIComponent(filter)}` : '';
      const [repRes, sumRes] = await Promise.all([
        authFetch(`${API_BASE}/api/reports${qs}`),
        authFetch(`${API_BASE}/api/reports/summary`),
      ]);
      if (!repRes.ok) throw new Error(`HTTP ${repRes.status}`);
      const repJson = await repRes.json();
      setReports(Array.isArray(repJson) ? repJson : []);

      if (sumRes.ok) {
        const sumJson = await sumRes.json();
        setSummary(sumJson);
        if (onSummaryChange) onSummaryChange(sumJson);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, statusFilter, onSummaryChange]);

  useEffect(() => {
    loadData(statusFilter);
  }, [statusFilter, loadData]);

  const handleUpdateStatus = async (reportId, nextStatus, replyText) => {
    setUpdatingId(reportId);
    setError(null);
    try {
      const body = { status: nextStatus };
      if (replyText !== undefined) {
        body.admin_reply = replyText;
      }
      const res = await authFetch(`${API_BASE}/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReplyOpenId(null);
      await loadData(statusFilter);
    } catch (err) {
      setError(`อัปเดตสถานะไม่สำเร็จ: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const openReplyBox = (report) => {
    if (replyOpenId === report.id) {
      setReplyOpenId(null);
      return;
    }
    setEditOpenId(null);
    setReplyDrafts((prev) => ({
      ...prev,
      [report.id]: prev[report.id] !== undefined ? prev[report.id] : (report.admin_reply || ''),
    }));
    setReplyOpenId(report.id);
  };

  const openQuickEditBox = (report) => {
    if (editOpenId === report.id) {
      setEditOpenId(null);
      return;
    }
    setReplyOpenId(null);
    setExpandedQuestionId(report.id);
    setEditForm({
      correct_answer: (report.correct_answer || '').trim().toUpperCase(),
      must_know_topic: report.must_know_topic || '',
      question_text: report.question_text || '',
      edit_reason: `แก้ไขตาม Report #${report.id} (${ISSUE_LABELS[report.issue_type] || report.issue_type})`,
      resolve_report: report.status !== 'resolved',
      admin_reply: report.admin_reply || 'ตรวจสอบและปรับปรุงข้อสอบเรียบร้อยแล้ว ขอบคุณที่ช่วยแจ้งครับ',
    });
    setEditOpenId(report.id);
  };

  const handleSaveQuickEdit = async (e, report) => {
    e.preventDefault();
    setSavingQuestion(true);
    setError(null);
    try {
      const payload = {
        edit_reason: editForm.edit_reason.trim(),
        report_id: report.id,
        resolve_report: Boolean(editForm.resolve_report),
        admin_reply: editForm.resolve_report ? editForm.admin_reply : undefined,
      };
      if (editForm.correct_answer && editForm.correct_answer !== (report.correct_answer || '').trim().toUpperCase()) {
        payload.correct_answer = editForm.correct_answer;
      }
      if (editForm.must_know_topic.trim() !== (report.must_know_topic || '').trim()) {
        payload.must_know_topic = editForm.must_know_topic.trim();
      }
      if (editForm.question_text.trim() !== (report.question_text || '').trim()) {
        payload.question_text = editForm.question_text.trim();
      }
      const res = await authFetch(`${API_BASE}/api/admin/questions/${report.question_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.detail || `HTTP ${res.status}`);
      setEditOpenId(null);
      setToastMsg(`บันทึกการแก้ไข Q${report.question_id} ลง Sync Queue เรียบร้อยแล้ว (${json.updated_fields.join(', ')})`);
      setTimeout(() => setToastMsg(null), 4500);
      if (onQuestionEdited) onQuestionEdited();
      await loadData(statusFilter);
    } catch (err) {
      setError(`บันทึกการแก้ไขข้อสอบไม่สำเร็จ: ${err.message}`);
    } finally {
      setSavingQuestion(false);
    }
  };

  const counts = summary?.counts || {};

  return (
    <div className="admin-section-stack">
      {/* Triage Summary Strip */}
      <div className="admin-triage-strip">
        {[
          { key: 'pending', label: 'รอตรวจสอบ', count: counts.pending ?? 0, tone: 'var(--ink-amber)' },
          { key: 'reviewing', label: 'กำลังตรวจสอบ', count: counts.reviewing ?? 0, tone: 'var(--ink-sky)' },
          { key: 'resolved', label: 'แก้ไขแล้ว', count: counts.resolved ?? 0, tone: 'var(--ink-emerald)' },
          { key: 'rejected', label: 'ไม่รับเรื่อง', count: counts.rejected ?? 0, tone: 'var(--ink-rose)' },
          { key: '', label: 'ทั้งหมด', count: counts.total ?? 0, tone: 'var(--text)' },
        ].map((item) => {
          const isActive = statusFilter === item.key;
          return (
            <button
              key={item.key || 'all'}
              type="button"
              className={`glass-panel admin-triage-pill ${isActive ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(item.key)}
            >
              <span className="admin-triage-pill-label">{item.label}</span>
              <strong className="tabular-nums" style={{ color: item.tone, fontSize: '1.15rem' }}>
                {item.count}
              </strong>
            </button>
          );
        })}
      </div>

      {/* SLA & Repeat Meta Row */}
      <div className="admin-toolbar">
        <div className="admin-chip-row tabular-nums">
          <span className="badge">
            <Clock size={12} /> งานค้างเก่าสุด:{' '}
            {summary?.oldest_open_age_days !== null && summary?.oldest_open_age_days !== undefined
              ? `${summary.oldest_open_age_days} วัน`
              : 'ไม่มีงานค้าง'}
          </span>
          <span className="badge" style={(summary?.repeat_questions_count ?? 0) > 0 ? { color: 'var(--ink-amber)', background: 'rgba(245,158,11,0.12)' } : undefined}>
            <Repeat size={12} /> ข้อที่ถูกแจ้งซ้ำ: {summary?.repeat_questions_count ?? 0} ข้อ
          </span>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => loadData(statusFilter)} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> รีเฟรช
        </button>
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

      {loading && reports.length === 0 ? (
        <div className="glass-panel admin-empty-state">
          <Loader2 size={22} className="spin" /> กำลังโหลดรายการแจ้งปัญหา…
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel admin-empty-state">
          ไม่มีรายการแจ้งปัญหาในสถานะนี้ 🎉
        </div>
      ) : (
        <div className="admin-item-list">
          {reports.map((r) => {
            const st = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
            const isOpenStatus = r.status === 'pending' || r.status === 'reviewing';
            const isSlaAlert = isOpenStatus && (r.age_days ?? 0) >= 3;
            const isExpanded = expandedQuestionId === r.id;
            const isReplyOpen = replyOpenId === r.id;
            const draft = replyDrafts[r.id] ?? '';

            return (
              <div key={r.id} className="glass-panel admin-report-card">
                <div className="admin-sub-card-head">
                  <div className="admin-chip-row">
                    <span className="badge badge-primary">Report #{r.id}</span>
                    <span className="badge">Q{r.question_id}</span>
                    {r.category && <span className="badge">{r.category}</span>}
                    {r.source_exam && <span className="badge">📝 {r.source_exam}</span>}
                    <span
                      className="badge"
                      style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}
                    >
                      {st.label}
                    </span>
                    {isOpenStatus && (
                      <span
                        className="badge tabular-nums"
                        style={
                          isSlaAlert
                            ? { color: 'var(--ink-rose)', background: 'rgba(244,63,94,0.12)' }
                            : { color: 'var(--text-muted)' }
                        }
                      >
                        <Clock size={11} /> ค้าง {r.age_days ?? 0} วัน
                      </span>
                    )}
                    {(r.total_reports_on_question ?? 1) > 1 && (
                      <span className="badge tabular-nums" style={{ color: 'var(--ink-amber)', background: 'rgba(245,158,11,0.14)' }}>
                        <Repeat size={11} /> แจ้งซ้ำ {r.total_reports_on_question} ครั้ง
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    โดย <strong>{r.reporter_username || 'ไม่ทราบ'}</strong> · {formatThaiDateTime(r.created_at)}
                  </span>
                </div>

                {/* Issue Type & User Note */}
                <div style={{ fontSize: '0.88rem', color: 'var(--ink-rose)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.55rem' }}>
                  <AlertTriangle size={14} /> <strong>{ISSUE_LABELS[r.issue_type] || r.issue_type}</strong>
                </div>

                {r.description && (
                  <div className="admin-report-desc">{r.description}</div>
                )}

                {/* Question Preview Toggle */}
                <div className="admin-question-box">
                  <div className="admin-question-box-head">
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>
                      {isExpanded
                        ? r.question_text
                        : (r.question_text.length > 210 ? `${r.question_text.slice(0, 210)}…` : r.question_text)}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flexShrink: 0 }}
                      onClick={() => setExpandedQuestionId(isExpanded ? null : r.id)}
                    >
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {isExpanded ? 'ย่อโจทย์' : 'ดูโจทย์ & ตัวเลือก'}
                    </button>
                  </div>

                  <div className="admin-sub-card-foot" style={{ marginTop: '0.45rem' }}>
                    <span>เฉลยปัจจุบัน: <strong style={{ color: 'var(--ink-emerald)' }}>{r.correct_answer || '-'}</strong></span>
                    {r.must_know_topic && <span>· Topic: {r.must_know_topic}</span>}
                  </div>

                  {isExpanded && (
                    <div className="admin-choices-preview">
                      {Array.isArray(r.choices) && r.choices.length > 0 && (
                        <div className="admin-choices-list">
                          {r.choices.map((ch) => {
                            const isKey = (ch.label || '').toUpperCase() === (r.correct_answer || '').toUpperCase();
                            return (
                              <div
                                key={ch.label}
                                className={`admin-choice-item ${isKey ? 'is-correct' : ''}`}
                              >
                                <strong style={{ minWidth: '22px' }}>{ch.label}.</strong>
                                <span>{ch.text}</span>
                                {isKey && <span className="badge" style={{ marginLeft: 'auto', color: 'var(--ink-emerald)', background: 'rgba(16,185,129,0.12)' }}>เฉลย</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {r.explanation_preview && (
                        <div className="admin-expl-preview">
                          <strong>สรุปคำอธิบายปัจจุบัน:</strong> {r.explanation_preview}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {r.admin_reply && !isReplyOpen && (
                  <div className="admin-reply-shown">
                    <strong>ตอบกลับจาก Admin:</strong> {r.admin_reply}
                  </div>
                )}

                {/* Action Bar */}
                <div className="admin-report-actions">
                  {r.status !== 'reviewing' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={updatingId === r.id}
                      onClick={() => handleUpdateStatus(r.id, 'reviewing')}
                    >
                      <Eye size={13} /> กำลังตรวจสอบ
                    </button>
                  )}
                  <button
                    type="button"
                    className={`btn btn-sm ${isReplyOpen ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={updatingId === r.id}
                    onClick={() => openReplyBox(r)}
                  >
                    <MessageSquare size={13} /> {isReplyOpen ? 'ซ่อนกล่องตอบกลับ' : 'ตอบกลับ & ปิดงาน'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${editOpenId === r.id ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={updatingId === r.id || savingQuestion}
                    onClick={() => openQuickEditBox(r)}
                  >
                    <Pencil size={13} /> {editOpenId === r.id ? 'ปิดหน้าแก้ไขข้อสอบ' : 'แก้ไขเฉลย/ข้อสอบ'}
                  </button>
                  {updatingId === r.id && <Loader2 size={16} className="spin" />}
                </div>

                {/* Safe Inline Question Quick-Edit Drawer (Phase 2) */}
                {editOpenId === r.id && (
                  <form className="admin-reply-drawer admin-edit-drawer" onSubmit={(e) => handleSaveQuickEdit(e, r)}>
                    <div className="admin-mini-heading">
                      แก้ไขข้อสอบ Q{r.question_id} อย่างปลอดภัย (บันทึก Diff ลง Audit Log & Sync Queue อัตโนมัติ)
                    </div>
                    <div className="admin-two-col">
                      <label className="admin-field">
                        <span>เฉลยที่ถูกต้อง (Correct Answer)</span>
                        <select
                          className="admin-select"
                          value={editForm.correct_answer}
                          onChange={(e) => setEditForm((f) => ({ ...f, correct_answer: e.target.value }))}
                        >
                          {(r.choices || []).map((ch) => (
                            <option key={ch.label} value={(ch.label || '').toUpperCase()}>
                              {ch.label} — {(ch.text || '').slice(0, 60)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="admin-field">
                        <span>Must-Know Topic</span>
                        <input
                          type="text"
                          className="admin-input"
                          value={editForm.must_know_topic}
                          onChange={(e) => setEditForm((f) => ({ ...f, must_know_topic: e.target.value }))}
                        />
                      </label>
                    </div>

                    <label className="admin-field">
                      <span>ข้อความโจทย์ (แก้ไขคำสะกดได้)</span>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={editForm.question_text}
                        onChange={(e) => setEditForm((f) => ({ ...f, question_text: e.target.value }))}
                      />
                    </label>

                    <label className="admin-field">
                      <span>เหตุผลการแก้ไข (จำเป็นสำหรับการตรวจย้อนหลัง)</span>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        minLength={2}
                        value={editForm.edit_reason}
                        onChange={(e) => setEditForm((f) => ({ ...f, edit_reason: e.target.value }))}
                      />
                    </label>

                    <label className="admin-checkbox-row">
                      <input
                        type="checkbox"
                        checked={editForm.resolve_report}
                        onChange={(e) => setEditForm((f) => ({ ...f, resolve_report: e.target.checked }))}
                      />
                      <span>เปลี่ยนสถานะ Report #{r.id} เป็น "แก้ไขแล้ว (Resolved)" พร้อมส่งข้อความตอบกลับ</span>
                    </label>

                    {editForm.resolve_report && (
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="ข้อความตอบกลับผู้แจ้ง…"
                        value={editForm.admin_reply}
                        onChange={(e) => setEditForm((f) => ({ ...f, admin_reply: e.target.value }))}
                      />
                    )}

                    <div className="admin-report-actions">
                      <button type="submit" className="btn btn-primary btn-sm" disabled={savingQuestion}>
                        {savingQuestion ? <Loader2 size={13} className="spin" /> : <Check size={13} />}
                        บันทึกการแก้ไข & เข้าคิวซิงก์
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditOpenId(null)}
                        disabled={savingQuestion}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </form>
                )}

                {/* Inline Reply Drawer (replaces window.prompt) */}
                {isReplyOpen && (
                  <div className="admin-reply-drawer">
                    <div className="admin-mini-heading">ข้อความตอบกลับสำเร็จรูป (คลิกเพื่อใส่):</div>
                    <div className="admin-quick-replies">
                      {QUICK_REPLIES.map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="admin-quick-chip"
                          onClick={() => setReplyDrafts((prev) => ({ ...prev, [r.id]: tpl }))}
                        >
                          {tpl}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      placeholder="พิมพ์ข้อความตอบกลับถึงผู้แจ้ง (ไม่บังคับ)…"
                      value={draft}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    />
                    <div className="admin-report-actions">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        disabled={updatingId === r.id}
                        onClick={() => handleUpdateStatus(r.id, 'resolved', draft)}
                      >
                        <CircleCheck size={13} /> บันทึก & แก้ไขแล้ว (Resolved)
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={updatingId === r.id}
                        onClick={() => handleUpdateStatus(r.id, 'rejected', draft)}
                      >
                        <XCircle size={13} /> บันทึก & ไม่รับเรื่อง (Rejected)
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={updatingId === r.id}
                        onClick={() => handleUpdateStatus(r.id, 'reviewing', draft)}
                      >
                        <Eye size={13} /> บันทึก & กำลังตรวจสอบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
