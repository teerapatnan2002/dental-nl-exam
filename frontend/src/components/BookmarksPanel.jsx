import React, { useState, useEffect, useCallback } from 'react';
import {
  BookmarkCheck, Loader2, PlayCircle, Trash2, StickyNote,
  Search, Printer, Download, Edit3, Check, X, Flame, BookOpen
} from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

const TAG_COLORS = {
  'สับสนนิยาม': { bg: 'rgba(56,189,248,0.14)', color: 'var(--ink-sky)', border: 'rgba(56,189,248,0.38)' },
  'ลืมตัวเลข': { bg: 'rgba(245,158,11,0.14)', color: 'var(--ink-amber)', border: 'rgba(245,158,11,0.38)' },
  'พลาดแนวทางไทย': { bg: 'rgba(16,185,129,0.14)', color: 'var(--ink-emerald)', border: 'rgba(16,185,129,0.38)' },
  'โดนตัวลวง': { bg: 'rgba(244,63,94,0.14)', color: 'var(--ink-rose)', border: 'rgba(244,63,94,0.38)' },
  'สรุป AI Tutor': { bg: 'rgba(13,148,136,0.14)', color: 'var(--primary-light)', border: 'rgba(13,148,136,0.38)' },
};

const escapeHtml = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const escapeTsvCell = (str) =>
  String(str || '')
    .replace(/\r?\n/g, '<br>')
    .replace(/\t/g, ' ');

/**
 * Personal High-Yield Knowledge Vault: Bookmarks + Tagged Notes + Topic Notes + Anki/PDF Exam-Day Export.
 */
export default function BookmarksPanel({ onStartPractice }) {
  const { authFetch } = useAuth();
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSubTab, setActiveSubTab] = useState('questions'); // 'questions' | 'topics' | 'repeat_wrong'
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // Inline editing state
  const [editingKey, setEditingKey] = useState(null); // `q-${id}` or `t-${topic_id}`
  const [editDraft, setEditDraft] = useState('');
  const [editTag, setEditTag] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [exportFeedback, setExportFeedback] = useState('');

  const loadVault = useCallback(async (tagVal = selectedTag, qVal = appliedQuery) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (tagVal && tagVal !== 'all') params.set('tag', tagVal);
      if (qVal.trim()) params.set('q', qVal.trim());
      const qs = params.toString();
      const res = await authFetch(`${API_BASE}/api/bookmarks/with-notes${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVault(data);
    } catch (err) {
      setError('โหลดคลังโน้ตและบุ๊กมาร์กไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [authFetch, selectedTag, appliedQuery]);

  useEffect(() => {
    loadVault();
  }, [loadVault]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedQuery(searchInput);
  };

  const removeBookmark = async (q) => {
    setVault((prev) => prev ? {
      ...prev,
      items: prev.items.filter((x) => !(x.id === q.id && !x.note_text)),
    } : prev);
    try {
      await authFetch(`${API_BASE}/api/bookmarks/${q.id}`, { method: 'DELETE' });
      loadVault();
    } catch {
      loadVault();
    }
  };

  const startEditQuestionNote = (item) => {
    setEditingKey(`q-${item.id}`);
    setEditDraft(item.note_text || '');
    setEditTag(item.mistake_tag || '');
  };

  const startEditTopicNote = (tn) => {
    setEditingKey(`t-${tn.topic_id}`);
    setEditDraft(tn.note_text || '');
    setEditTag(tn.mistake_tag || '');
  };

  const saveInlineEdit = async (target) => {
    if (savingEdit) return;
    setSavingEdit(true);
    try {
      const body =
        target.kind === 'question'
          ? { question_id: target.id, note_text: editDraft, mistake_tag: editTag }
          : { topic_id: target.topic_id, note_text: editDraft, mistake_tag: editTag };
      const res = await authFetch(`${API_BASE}/api/bookmarks/notes`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEditingKey(null);
      await loadVault();
    } catch (err) {
      console.error('Failed to update note:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteTopicNote = async (topicId) => {
    try {
      await authFetch(`${API_BASE}/api/bookmarks/topic-notes/${encodeURIComponent(topicId)}`, {
        method: 'DELETE',
      });
      loadVault();
    } catch {
      loadVault();
    }
  };

  // Export 1: Anki TSV Deck (.tsv UTF-8 BOM)
  const handleExportAnki = () => {
    if (!vault) return;
    const rows = [];
    (vault.items || []).forEach((it) => {
      const front = `[Q#${it.id} · ${it.category}] ${it.topic_title_th ? `(${it.topic_title_th}) ` : ''}${it.question_text}`;
      const backParts = [
        `<b>✓ เฉลย:</b> ${it.correct_answer || ''} ${it.correct_choice_text || ''}`,
        it.core_principle ? `<b>หลักการ:</b> ${it.core_principle}` : '',
        it.key_takeaway ? `<b>💎 Takeaway:</b> ${it.key_takeaway}` : '',
        it.common_pitfall ? `<b>💣 Pitfall:</b> ${it.common_pitfall}` : '',
        it.note_text ? `<b>📝 โน้ตของฉัน:</b> ${it.note_text}` : '',
      ].filter(Boolean);
      const tags = [it.category, it.mistake_tag, 'NL_Dental']
        .filter(Boolean)
        .map((s) => s.replace(/\s+/g, '_'))
        .join(' ');
      rows.push([escapeTsvCell(front), escapeTsvCell(backParts.join('<br><br>')), escapeTsvCell(tags)].join('\t'));
    });

    (vault.topic_notes || []).forEach((tn) => {
      const front = `[Topic Note · ${tn.topic_id}] ${tn.topic_title_th}`;
      const backParts = [
        tn.note_text ? `<b>📝 สรุปของฉัน:</b> ${tn.note_text}` : '',
        tn.pathway_highlights?.length
          ? `<b>🔀 Pathway (${tn.pathway_title}):</b><br>${tn.pathway_highlights.join('<br>')}`
          : '',
      ].filter(Boolean);
      const tags = [tn.topic_id, tn.mistake_tag, 'NL_Topic_Vault']
        .filter(Boolean)
        .map((s) => s.replace(/\s+/g, '_'))
        .join(' ');
      rows.push([escapeTsvCell(front), escapeTsvCell(backParts.join('<br><br>')), escapeTsvCell(tags)].join('\t'));
    });

    if (rows.length === 0) {
      setExportFeedback('ยังไม่มีข้อมูลโน้ตหรือบุ๊กมาร์กสำหรับส่งออกครับ');
      return;
    }

    const tsvContent = '\uFEFF' + rows.join('\n');
    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NL_Dental_Vault_Anki_${new Date().toISOString().slice(0, 10)}.tsv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportFeedback(`✓ ดาวน์โหลด Anki Deck (${rows.length} การ์ด) แล้ว — Import ใน Anki ได้ทันที!`);
  };

  // Export 2: Printable Exam-Day High-Yield PDF Cheat Sheet
  const handlePrintCheatSheet = () => {
    if (!vault) return;
    const notesItems = (vault.items || []).filter((x) => (x.note_text || '').trim() || x.mistake_tag || x.is_bookmarked);
    const topicNotes = vault.topic_notes || [];
    const repeatWrong = vault.repeat_wrong || [];

    if (notesItems.length === 0 && topicNotes.length === 0 && repeatWrong.length === 0) {
      setExportFeedback('ยังไม่มีโน้ตหรือประวัติข้อผิดสำหรับสร้าง Cheat Sheet ครับ');
      return;
    }

    const win = window.open('', '_blank', 'width=980,height=800');
    if (!win) {
      setExportFeedback('เบราว์เซอร์บล็อกหน้าต่างพิมพ์ (Pop-up) กรุณาอนุญาต Pop-up แล้วกดใหม่อีกครั้งครับ');
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <title>NL Dental Treasury High-Yield Exam-Day Cheat Sheet</title>
  <style>
    body { font-family: 'Sarabun', 'Noto Sans Thai', -apple-system, sans-serif; color: #0f172a; margin: 20px 28px; line-height: 1.5; font-size: 12.5px; }
    h1 { font-size: 19px; margin: 0 0 4px; color: #1e1b4b; }
    .meta { font-size: 11.5px; color: #475569; margin-bottom: 16px; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px; }
    h2 { font-size: 14.5px; margin: 18px 0 8px; padding: 5px 10px; background: #f1f5f9; border-left: 4px solid #4f46e5; color: #1e293b; }
    .card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 9px 12px; margin-bottom: 8px; page-break-inside: avoid; }
    .badges { font-size: 10.5px; font-weight: 700; color: #4338ca; margin-bottom: 4px; }
    .tag { display: inline-block; background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 4px; margin-left: 6px; border: 1px solid #fcd34d; }
    .note { background: #fffbeb; border-left: 3px solid #f59e0b; padding: 5px 8px; margin-top: 5px; white-space: pre-wrap; }
    .pitfall { background: #fef2f2; border-left: 3px solid #ef4444; padding: 4px 8px; margin-top: 5px; font-size: 11.5px; }
    @media print { body { margin: 10px 14px; } button.no-print { display: none; } }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <div>
      <h1>🦷 NL Dental Treasury Exam-Day High-Yield Cheat Sheet</h1>
      <div class="meta">สรุปเฉพาะโน้ตส่วนตัว, จุดผิดซ้ำ และ Pathway สำคัญ • พิมพ์เมื่อ ${new Date().toLocaleDateString('th-TH')}</div>
    </div>
    <button class="no-print" onclick="window.print()" style="padding:7px 14px;background:#4f46e5;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;">🖨️ พิมพ์ / Save PDF</button>
  </div>

  ${topicNotes.length > 0 ? `
    <h2>1. โน้ตสรุปรายหัวข้อ & Clinical Pathways (${topicNotes.length})</h2>
    ${topicNotes.map((tn) => `
      <div class="card">
        <div class="badges">${escapeHtml(tn.topic_title_th)} (${escapeHtml(tn.topic_id)}) ${tn.mistake_tag ? `<span class="tag">${escapeHtml(tn.mistake_tag)}</span>` : ''}</div>
        <div class="note">${escapeHtml(tn.note_text)}</div>
        ${tn.pathway_highlights?.length ? `<div style="margin-top:5px;font-size:11.5px;color:#334155;"><b>Pathway:</b> ${tn.pathway_highlights.map(escapeHtml).join(' → ')}</div>` : ''}
      </div>
    `).join('')}
  ` : ''}

  ${notesItems.length > 0 ? `
    <h2>2. ข้อสอบที่บุ๊กมาร์ก & โน้ตสรุป (${notesItems.length})</h2>
    ${notesItems.map((it) => `
      <div class="card">
        <div class="badges">Q#${it.id} · ${escapeHtml(it.category)} ${it.topic_title_th ? `— ${escapeHtml(it.topic_title_th)}` : ''} ${it.mistake_tag ? `<span class="tag">${escapeHtml(it.mistake_tag)}</span>` : ''}</div>
        <div><b>โจทย์:</b> ${escapeHtml(it.question_text.slice(0, 260))}${it.question_text.length > 260 ? '…' : ''}</div>
        <div style="margin-top:3px;color:#065f46;"><b>✓ เฉลย (${escapeHtml(it.correct_answer)}):</b> ${escapeHtml(it.correct_choice_text || it.core_principle)}</div>
        ${it.note_text ? `<div class="note"><b>📝 โน้ตของคุณ:</b> ${escapeHtml(it.note_text)}</div>` : ''}
        ${it.common_pitfall ? `<div class="pitfall"><b>💣 จุดหลอก:</b> ${escapeHtml(it.common_pitfall)}</div>` : ''}
      </div>
    `).join('')}
  ` : ''}

  ${repeatWrong.length > 0 ? `
    <h2>3. ข้อที่เคยตอบผิดซ้ำ (Repeat-Wrong Exam Triggers · ${repeatWrong.length})</h2>
    ${repeatWrong.map((rw) => `
      <div class="card">
        <div class="badges">Q#${rw.id} (ผิด ${rw.wrong_count} ครั้ง) · ${escapeHtml(rw.category)} ${rw.mistake_tag ? `<span class="tag">${escapeHtml(rw.mistake_tag)}</span>` : ''}</div>
        <div><b>หลักการที่ต้องจำ:</b> ${escapeHtml(rw.key_takeaway || rw.core_principle || rw.correct_choice_text)}</div>
        ${rw.common_pitfall ? `<div class="pitfall"><b>💣 ระวังพลาดซ้ำ:</b> ${escapeHtml(rw.common_pitfall)}</div>` : ''}
      </div>
    `).join('')}
  ` : ''}
</body>
</html>`;

    win.document.open();
    win.document.write(html);
    win.document.close();
    setExportFeedback('✓ เปิดหน้าต่าง High-Yield Cheat Sheet สำหรับพิมพ์/Save as PDF แล้ว');
  };

  if (loading && !vault) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Loader2 size={24} className="spin" />
      </div>
    );
  }

  if (error && !vault) {
    return <div className="glass-panel" style={{ padding: '2rem', color: 'var(--ink-rose)' }}>{error}</div>;
  }

  const items = vault?.items || [];
  const topicNotes = vault?.topic_notes || [];
  const repeatWrong = vault?.repeat_wrong || [];
  const tagOptions = vault?.tag_options || Object.keys(TAG_COLORS);
  const tagCounts = vault?.tag_counts || {};
  const summary = vault?.summary || {};

  return (
    <div className="glass-panel" style={{ padding: '1.65rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* Header & Exports */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.15rem' }}>
            <BookmarkCheck size={20} style={{ color: 'var(--primary-light)' }} /> คลังความรู้ส่วนตัว (High-Yield Knowledge Vault)
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-sub)' }}>
            บุ๊กมาร์ก {summary.total_bookmarks || 0} ข้อ · โน้ตข้อสอบ {summary.total_question_notes || 0} ข้อ · โน้ตหัวข้อ {summary.total_topic_notes || 0} เรื่อง · ผิดซ้ำ {summary.total_repeat_wrong || 0} ข้อ
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handlePrintCheatSheet}
            className="btn btn-sm"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: 'rgba(16,185,129,0.14)', color: 'var(--ink-emerald)', border: '1px solid rgba(16,185,129,0.38)', fontWeight: 700,
            }}
          >
            <Printer size={14} /> พิมพ์ High-Yield PDF
          </button>

          <button
            type="button"
            onClick={handleExportAnki}
            className="btn btn-sm"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: 'rgba(56,189,248,0.14)', color: 'var(--ink-sky)', border: '1px solid rgba(56,189,248,0.38)', fontWeight: 700,
            }}
          >
            <Download size={14} /> Export Anki (.tsv)
          </button>

          {items.length > 0 && onStartPractice && (
            <button className="btn btn-primary btn-sm" onClick={() => onStartPractice(items)}>
              <PlayCircle size={15} /> ฝึกทำชุดนี้ ({items.length} ข้อ)
            </button>
          )}
        </div>
      </div>

      {exportFeedback && (
        <div style={{ padding: '0.6rem 0.9rem', borderRadius: '9px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', fontSize: '0.82rem', color: 'var(--ink-emerald)' }}>
          {exportFeedback}
        </div>
      )}

      {/* Search + Root-Cause Tag Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '0.9rem 1rem', borderRadius: '12px', background: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ค้นหาโน้ตส่วนตัว, คำสำคัญ, รหัสข้อ, หรือหัวข้อ Must-Know..."
              style={{
                width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.1rem', borderRadius: '9px',
                background: 'var(--surface-input)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 'max(16px, 0.88rem)',
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">ค้นหา</button>
          {appliedQuery && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearchInput(''); setAppliedQuery(''); }}
            >
              ล้างคำค้น
            </button>
          )}
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>กรองสาเหตุ:</span>
          {[
            { id: 'all', label: 'ทั้งหมด' },
            ...tagOptions.map((t) => ({ id: t, label: `${t} (${tagCounts[t] || 0})` })),
            { id: '__untagged__', label: `ยังไม่ติด Tag (${vault?.untagged_count || 0})` },
          ].map((tg) => {
            const active = selectedTag === tg.id;
            const palette = TAG_COLORS[tg.id];
            return (
              <button
                key={tg.id}
                type="button"
                onClick={() => setSelectedTag(tg.id)}
                style={{
                  padding: '0.28rem 0.68rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: active ? 800 : 600, cursor: 'pointer',
                  background: active ? (palette?.bg || 'rgba(13,148,136,0.16)') : 'var(--surface-card)',
                  color: active ? (palette?.color || 'var(--primary-light)') : 'var(--text-sub)',
                  border: `1px solid ${active ? (palette?.border || 'var(--primary)') : 'var(--border)'}`,
                }}
              >
                {tg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '0.65rem' }}>
        {[
          { id: 'questions', label: `ข้อสอบ & โน้ต (${items.length})`, icon: <BookmarkCheck size={14} /> },
          { id: 'topics', label: `โน้ตหัวข้อ (${topicNotes.length})`, icon: <BookOpen size={14} /> },
          { id: 'repeat_wrong', label: `ข้อผิดซ้ำ (${repeatWrong.length})`, icon: <Flame size={14} /> },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0.45rem 0.9rem',
                borderRadius: '10px', fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer',
                background: active ? 'var(--primary)' : 'var(--surface-card)',
                color: active ? '#fff' : 'var(--text-sub)',
                border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: QUESTION BOOKMARKS & NOTES */}
      {activeSubTab === 'questions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.9rem' }}>
              ยังไม่พบข้อสอบที่บุ๊กมาร์กหรือติดโน้ตตามตัวกรองนี้ — กดบุ๊กมาร์กหรือจดโน้ตส่วนตัวในข้อสอบเพื่อเก็บเข้าคลังได้เลยครับ
            </div>
          ) : (
            items.map((q) => {
              const isEditing = editingKey === `q-${q.id}`;
              const tagStyle = TAG_COLORS[q.mistake_tag];
              return (
                <div key={q.id} style={{ padding: '1rem 1.15rem', background: 'var(--surface-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.45rem', alignItems: 'center' }}>
                      <span className="badge badge-primary">Q{q.id}</span>
                      <span className="badge">{q.category}</span>
                      {q.topic_title_th && (
                        <span className="badge" style={{ backgroundColor: 'rgba(13,148,136,0.12)', color: 'var(--primary-light)' }}>
                          {q.topic_title_th}
                        </span>
                      )}
                      {q.mistake_tag && tagStyle && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.12rem 0.55rem', borderRadius: '999px', background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}` }}>
                          #{q.mistake_tag}
                        </span>
                      )}
                      {q.wrong_count > 0 && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.12rem 0.5rem', borderRadius: '999px', background: 'rgba(244,63,94,0.14)', color: 'var(--ink-rose)' }}>
                          ผิดแล้ว {q.wrong_count} ครั้ง
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => startEditQuestionNote(q)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', padding: '0.2rem' }}
                        title="แก้ไขโน้ตและ Tag สาเหตุ"
                      >
                        <Edit3 size={15} />
                      </button>
                      {q.is_bookmarked && (
                        <button
                          type="button"
                          onClick={() => removeBookmark(q)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                          title="ลบบุ๊กมาร์ก"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ lineHeight: 1.6, fontSize: '0.93rem', color: 'var(--text)' }}>
                    {q.question_text.length > 260 ? q.question_text.slice(0, 260) + '…' : q.question_text}
                  </div>

                  {(q.key_takeaway || q.correct_choice_text) && (
                    <div style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#6ee7b7' }}>
                      ✓ <strong>เฉลย ({q.correct_answer}):</strong> {q.key_takeaway || q.correct_choice_text}
                    </div>
                  )}

                  {isEditing ? (
                    <div style={{ marginTop: '0.7rem', padding: '0.75rem', borderRadius: '9px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {tagOptions.map((tg) => (
                          <button
                            key={tg}
                            type="button"
                            onClick={() => setEditTag(editTag === tg ? '' : tg)}
                            style={{
                              padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer',
                              background: editTag === tg ? (TAG_COLORS[tg]?.bg || 'rgba(13,148,136,0.16)') : 'var(--surface-card)',
                              color: editTag === tg ? (TAG_COLORS[tg]?.color || 'var(--primary-light)') : 'var(--text-sub)',
                              border: `1px solid ${editTag === tg ? (TAG_COLORS[tg]?.border || 'var(--primary)') : 'var(--border)'}`,
                            }}
                          >
                            #{tg}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        rows={3}
                        placeholder="พิมพ์โน้ตส่วนตัวหรือสรุปจุดต้องระวัง..."
                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', background: 'var(--surface-input)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.86rem', fontFamily: 'inherit' }}
                      />
                      <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingKey(null)}>
                          <X size={13} /> ยกเลิก
                        </button>
                        <button
                          type="button"
                          disabled={savingEdit}
                          className="btn btn-primary btn-sm"
                          onClick={() => saveInlineEdit({ kind: 'question', id: q.id })}
                        >
                          <Check size={13} /> {savingEdit ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    q.note_text && (
                      <div style={{ marginTop: '0.6rem', padding: '0.6rem 0.85rem', background: 'rgba(245,158,11,0.08)', borderLeft: '3px solid rgba(245,158,11,0.55)', borderRadius: '6px', fontSize: '0.86rem', color: 'var(--text-sub)', display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                        <StickyNote size={14} style={{ flexShrink: 0, marginTop: '3px', color: 'var(--ink-amber)' }} />
                        <span style={{ whiteSpace: 'pre-wrap' }}>{q.note_text}</span>
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: TOPIC NOTES */}
      {activeSubTab === 'topics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topicNotes.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.9rem' }}>
              ยังไม่มีโน้ตระดับหัวข้อในคลังส่วนตัวของคุณ
            </div>
          ) : (
            topicNotes.map((tn) => {
              const isEditing = editingKey === `t-${tn.topic_id}`;
              const tagStyle = TAG_COLORS[tn.mistake_tag];
              return (
                <div key={tn.topic_id} style={{ padding: '1rem 1.15rem', background: 'rgba(13,148,136,0.05)', borderRadius: '10px', border: '1px solid rgba(13,148,136,0.24)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="badge badge-primary">{tn.topic_id}</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{tn.topic_title_th}</strong>
                      {tn.mistake_tag && tagStyle && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.12rem 0.55rem', borderRadius: '999px', background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}` }}>
                          #{tn.mistake_tag}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button type="button" onClick={() => startEditTopicNote(tn)} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', padding: '0.2rem' }} title="แก้ไขโน้ตหัวข้อ">
                        <Edit3 size={15} />
                      </button>
                      <button type="button" onClick={() => deleteTopicNote(tn.topic_id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }} title="ลบโน้ตหัวข้อ">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div style={{ padding: '0.75rem', borderRadius: '9px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {tagOptions.map((tg) => (
                          <button
                            key={tg}
                            type="button"
                            onClick={() => setEditTag(editTag === tg ? '' : tg)}
                            style={{
                              padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer',
                              background: editTag === tg ? (TAG_COLORS[tg]?.bg || 'rgba(13,148,136,0.16)') : 'var(--surface-card)',
                              color: editTag === tg ? (TAG_COLORS[tg]?.color || 'var(--primary-light)') : 'var(--text-sub)',
                              border: `1px solid ${editTag === tg ? (TAG_COLORS[tg]?.border || 'var(--primary)') : 'var(--border)'}`,
                            }}
                          >
                            #{tg}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        rows={4}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', background: 'var(--surface-input)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.86rem', fontFamily: 'inherit' }}
                      />
                      <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingKey(null)}>ยกเลิก</button>
                        <button type="button" disabled={savingEdit} className="btn btn-primary btn-sm" onClick={() => saveInlineEdit({ kind: 'topic', topic_id: tn.topic_id })}>
                          {savingEdit ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '0.65rem 0.9rem', background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-sub)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {tn.note_text}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: REPEAT-WRONG TRIGGERS */}
      {activeSubTab === 'repeat_wrong' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {repeatWrong.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.9rem' }}>
              ยังไม่มีประวัติข้อที่ตอบผิด ระบบจะดึงข้อที่เคยพลาดมาสรุปเป็น Checklist ก่อนเข้าห้องสอบให้อัตโนมัติครับ
            </div>
          ) : (
            <>
              {onStartPractice && (
                <div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onStartPractice(repeatWrong)}>
                    <PlayCircle size={15} /> ซ้อมทำเฉพาะข้อผิดซ้ำ ({repeatWrong.length} ข้อ)
                  </button>
                </div>
              )}
              {repeatWrong.map((rw) => (
                <div key={rw.id} style={{ padding: '0.95rem 1.1rem', background: 'rgba(244,63,94,0.05)', borderRadius: '10px', border: '1px solid rgba(244,63,94,0.22)' }}>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span className="badge badge-primary">Q{rw.id}</span>
                    <span className="badge" style={{ background: 'rgba(244,63,94,0.16)', color: 'var(--ink-rose)' }}>ผิด {rw.wrong_count} ครั้ง</span>
                    <span className="badge">{rw.category}</span>
                    {rw.topic_title_th && <span className="badge">{rw.topic_title_th}</span>}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.55 }}>
                    {rw.question_text.length > 220 ? rw.question_text.slice(0, 220) + '…' : rw.question_text}
                  </div>
                  {(rw.key_takeaway || rw.common_pitfall) && (
                    <div style={{ marginTop: '0.45rem', fontSize: '0.81rem', color: 'var(--ink-amber)' }}>
                      จุดระวัง: {rw.common_pitfall || rw.key_takeaway}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
