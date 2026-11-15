import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Zap, Timer, AlertTriangle, CheckCircle2, XCircle, BookOpen,
  Play, RefreshCw, ChevronLeft, ChevronRight, Flame, ShieldAlert,
  Sparkles, Clock
} from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

const ARENA_MODES = [
  { id: 'mixed', label: 'ผสมท้าทาย (Cloze + Pitfall)', color: '#2563eb' },
  { id: 'cloze', label: 'Cloze เติมเลข-กฎหมาย-คีย์เวิร์ด', color: '#0284c7' },
  { id: 'pitfall', label: 'จับผิดกับดักตัวลวง (Pitfall)', color: '#e11d48' },
];

const SM2_BUTTONS = [
  { rating: 1, label: 'ลืมสนิท', sub: 'ทวนซ้ำด่วน', color: 'var(--ink-rose)', borderColor: 'rgba(239,68,68,0.45)', bg: 'rgba(239,68,68,0.12)' },
  { rating: 2, label: 'ยังติดขัด', sub: 'ระยะสั้น', color: 'var(--ink-amber)', borderColor: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.12)' },
  { rating: 3, label: 'จำได้', sub: 'มาตรฐาน', color: 'var(--ink-emerald)', borderColor: 'rgba(16,185,129,0.45)', bg: 'rgba(16,185,129,0.12)' },
  { rating: 4, label: 'แม่นเป๊ะ', sub: 'เว้นช่วงยาว', color: 'var(--ink-sky)', borderColor: 'rgba(56,189,248,0.45)', bg: 'rgba(56,189,248,0.12)' },
];

const TIMED_SECONDS = 25;

export default function ClozePitfallArena({
  selectedSpecialty = 'all',
  searchQuery = '',
  onOpenTopic = null,
  onStartExam = null,
  onOpenAuthModal = null,
  isModal = false,
  onClose = null,
}) {
  const { token, authFetch } = useAuth();

  const [arenaMode, setArenaMode] = useState('mixed');
  const [arenaData, setArenaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  // answersByKey: { [card_key]: { chosen, isCorrect, timedOut } }
  const [answersByKey, setAnswersByKey] = useState({});
  const [sm2Overrides, setSm2Overrides] = useState({});
  const [savingSm2Key, setSavingSm2Key] = useState(null);

  // Timed speed drill
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [streak, setStreak] = useState(0);
  const [startingExamId, setStartingExamId] = useState(null);

  const fetchArenaDeck = useCallback(async () => {
    if (!token || !authFetch) {
      setArenaData(null);
      setError('auth_required');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        mode: arenaMode,
        limit: '30',
      });
      if (selectedSpecialty && selectedSpecialty !== 'all') {
        params.set('category', selectedSpecialty);
      }
      const url = `${API_BASE}/api/learning/cloze-arena?${params.toString()}`;
      const res = await authFetch(url);
      if (res.status === 401) {
        setArenaData(null);
        setError('auth_required');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArenaData(data);
      setCurrentIdx(0);
      setAnswersByKey({});
      setTimeLeft(TIMED_SECONDS);
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลด Cloze & Pitfall Arena ได้');
    } finally {
      setLoading(false);
    }
  }, [arenaMode, selectedSpecialty, token, authFetch]);

  useEffect(() => {
    fetchArenaDeck();
  }, [fetchArenaDeck]);

  const filteredItems = useMemo(() => {
    const raw = arenaData?.items || [];
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return raw;
    return raw.filter((item) => {
      return (
        (item.category || '').toLowerCase().includes(q) ||
        (item.topic_title_th || '').toLowerCase().includes(q) ||
        (item.prompt_masked || '').toLowerCase().includes(q) ||
        (item.stem || '').toLowerCase().includes(q) ||
        (item.common_pitfall || '').toLowerCase().includes(q) ||
        (item.key_takeaway || '').toLowerCase().includes(q) ||
        String(item.question_id).includes(q)
      );
    });
  }, [arenaData, searchQuery]);

  useEffect(() => {
    if (currentIdx >= filteredItems.length && filteredItems.length > 0) {
      setCurrentIdx(0);
    }
  }, [filteredItems.length, currentIdx]);

  const currentItem = filteredItems[currentIdx] || null;
  const currentAnswer = currentItem ? answersByKey[currentItem.card_key] : null;

  // Timed Drill Countdown
  useEffect(() => {
    if (!timedMode || !currentItem || currentAnswer) return undefined;
    setTimeLeft(TIMED_SECONDS);
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setAnswersByKey((old) => ({
            ...old,
            [currentItem.card_key]: { chosen: null, isCorrect: false, timedOut: true },
          }));
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timedMode, currentItem?.card_key, Boolean(currentAnswer)]);

  const sessionScore = useMemo(() => {
    const vals = Object.values(answersByKey);
    const total = vals.length;
    const correct = vals.filter((v) => v.isCorrect).length;
    return { total, correct };
  }, [answersByKey]);

  const handleAnswerCloze = (optionText) => {
    if (!currentItem || currentAnswer) return;
    const isCorrect = optionText === currentItem.missing_answer;
    setAnswersByKey((prev) => ({
      ...prev,
      [currentItem.card_key]: { chosen: optionText, isCorrect, timedOut: false },
    }));
    setStreak((s) => (isCorrect ? s + 1 : 0));
  };

  const handleAnswerPitfall = (choiceLabel) => {
    if (!currentItem || currentAnswer) return;
    const isCorrect =
      String(choiceLabel).trim().toUpperCase() ===
      String(currentItem.correct_answer || '').trim().toUpperCase();
    setAnswersByKey((prev) => ({
      ...prev,
      [currentItem.card_key]: { chosen: choiceLabel, isCorrect, timedOut: false },
    }));
    setStreak((s) => (isCorrect ? s + 1 : 0));
  };

  const handleSm2Rate = async (item, rating) => {
    if (!token || savingSm2Key) return;
    setSavingSm2Key(item.card_key);
    try {
      const res = await authFetch(`${API_BASE}/api/tracking/cards/review`, {
        method: 'POST',
        body: JSON.stringify({
          card_key: item.card_key,
          card_type: 'cloze',
          rating,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSm2Overrides((prev) => ({ ...prev, [item.card_key]: updated }));
        if (currentIdx + 1 < filteredItems.length) {
          setCurrentIdx((idx) => idx + 1);
        }
      }
    } catch (err) {
      console.error('Failed to save cloze SM-2 review:', err);
    } finally {
      setSavingSm2Key(null);
    }
  };

  const handleStartFullQuestion = async (questionId) => {
    if (!onStartExam || !questionId || startingExamId) return;
    setStartingExamId(questionId);
    try {
      const doFetch = authFetch || fetch;
      const res = await doFetch(`${API_BASE}/api/questions/by-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_ids: [questionId] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const questions = await res.json();
      if (Array.isArray(questions) && questions.length > 0) {
        onStartExam({
          mode: 'practice',
          questions,
          count: questions.length,
        });
        if (isModal && onClose) onClose();
      }
    } catch (err) {
      console.error('Failed to launch question drill:', err);
    } finally {
      setStartingExamId(null);
    }
  };

  const renderMaskedPrompt = (item, ansObj) => {
    const marker = '【 ____?____ 】';
    const text = item.prompt_masked || '';
    if (!text.includes(marker)) return <span>{text}</span>;
    const parts = text.split(marker);
    const revealed = Boolean(ansObj);
    return (
      <>
        {parts[0]}
        <span
          style={{
            display: 'inline-block',
            padding: '0.12rem 0.6rem',
            margin: '0 0.25rem',
            borderRadius: '8px',
            fontWeight: 800,
            background: !revealed
              ? 'rgba(56,189,248,0.18)'
              : ansObj.isCorrect
              ? 'rgba(16,185,129,0.22)'
              : 'rgba(239,68,68,0.22)',
            color: !revealed
              ? '#7dd3fc'
              : ansObj.isCorrect
              ? '#34d399'
              : '#fca5a5',
            border: `1.5px dashed ${
              !revealed ? '#38bdf8' : ansObj.isCorrect ? '#10b981' : '#ef4444'
            }`,
          }}
        >
          {revealed ? item.missing_answer : '____?____'}
        </span>
        {parts.slice(1).join(marker)}
      </>
    );
  };

  const currentSm2 = currentItem
    ? sm2Overrides[currentItem.card_key] || currentItem.sm2_state
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          padding: '1.05rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(2,132,199,0.06))',
          border: '1px solid rgba(13,148,136,0.28)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.9rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'rgba(13,148,136,0.16)',
              border: '1px solid rgba(13,148,136,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light)',
              flexShrink: 0,
            }}
          >
            <Zap size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
              Cloze Deletion & Pitfall Elimination Arena
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-sub)' }}>
              ฝึกเติมตัวเลข-กฎหมาย-คีย์เวิร์ด และจับไต๋ตัวลวงระดับตำนานจากเฉลยจริง พร้อมจัดคิวทบทวน SM-2
              {arenaData?.summary?.prioritized_wrong_count > 0 && (
                <span style={{ color: 'var(--ink-rose)', fontWeight: 700, marginLeft: '0.45rem' }}>
                  · ดึงข้อที่เคยผิดขึ้นมาทวนก่อน {arenaData.summary.prioritized_wrong_count} ข้อ
                </span>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border)',
              fontSize: '0.8rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            คะแนนชุดนี้:{' '}
            <strong style={{ color: 'var(--ink-emerald)' }}>
              {sessionScore.correct}/{sessionScore.total}
            </strong>
          </div>

          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              background: streak >= 3 ? 'rgba(245,158,11,0.14)' : 'var(--surface-card)',
              border: `1px solid ${streak >= 3 ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <Flame size={14} style={{ color: 'var(--ink-amber)' }} />
            <strong style={{ color: 'var(--ink-amber)' }}>{streak}</strong>
          </div>

          <button
            type="button"
            onClick={() => setTimedMode((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.38rem',
              padding: '0.44rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: timedMode ? 'rgba(244,63,94,0.16)' : 'var(--surface-card)',
              color: timedMode ? 'var(--ink-rose)' : 'var(--text)',
              border: `1.5px solid ${timedMode ? '#e11d48' : 'var(--border)'}`,
            }}
          >
            <Timer size={14} />
            {timedMode ? `จับเวลาเปิดอยู่ (${TIMED_SECONDS} วิ/ข้อ)` : `เปิดโหมดจับเวลา (${TIMED_SECONDS} วิ)`}
          </button>

          <button
            type="button"
            onClick={fetchArenaDeck}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.44rem 0.8rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: 'var(--surface-card)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            <RefreshCw size={14} /> รีเฟรชชุดใหม่
          </button>
        </div>
      </div>

      {/* Arena Sub-Mode Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {ARENA_MODES.map((m) => {
            const active = arenaMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setArenaMode(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.48rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  background: active ? `${m.color}20` : 'var(--surface-card)',
                  color: active ? m.color : 'var(--text-sub)',
                  border: `1.5px solid ${active ? m.color : 'var(--border)'}`,
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {arenaData?.summary && (
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            คลังพร้อมดึง: <strong style={{ color: 'var(--text)' }}>{arenaData.summary.cloze_available}</strong> Cloze ·{' '}
            <strong style={{ color: 'var(--text)' }}>{arenaData.summary.pitfall_available}</strong> Pitfall
          </div>
        )}
      </div>

      {/* Loading / Error / Empty */}
      {loading && (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-sub)' }}>
          กำลังสร้างชุด Cloze & Pitfall Elimination จากคลังข้อสอบและประวัติ SM-2...
        </div>
      )}

      {!loading && error === 'auth_required' && (
        <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', maxWidth: '520px', margin: '0.5rem auto' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🔐</div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.45rem' }}>
            กรุณาเข้าสู่ระบบเพื่อฝึกใน Cloze & Pitfall Arena
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '1.15rem' }}>
            ระบบจัดคิวทวน SM-2 และดึงเฉลยเฉพาะจุดเสี่ยงให้เหมาะกับประวัติการทำข้อสอบของคุณโดยเฉพาะ
          </div>
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="btn btn-primary"
              style={{ fontWeight: 700, padding: '0.6rem 1.35rem', borderRadius: '10px' }}
            >
              เข้าสู่ระบบ / สมัครสมาชิก
            </button>
          )}
        </div>
      )}

      {!loading && error && error !== 'auth_required' && (
        <div className="card" style={{ padding: '1.5rem', color: 'var(--ink-rose)', border: '1px solid rgba(239,68,68,0.4)' }}>
          {error}
        </div>
      )}

      {!loading && !error && filteredItems.length === 0 && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-sub)' }}>
          ไม่พบการ์ดที่ตรงกับตัวกรองปัจจุบัน ลองล้างคำค้นหาหรือเปลี่ยนสาขาดูครับ
        </div>
      )}

      {/* Active Arena Card */}
      {!loading && !error && currentItem && (
        <div
          className="card"
          style={{
            padding: '1.35rem',
            border: `1.5px solid ${currentItem.item_type === 'cloze' ? 'rgba(56,189,248,0.38)' : 'rgba(244,63,94,0.38)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Progress & Navigation Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px',
                  background: currentItem.item_type === 'cloze' ? 'rgba(56,189,248,0.16)' : 'rgba(244,63,94,0.16)',
                  color: currentItem.item_type === 'cloze' ? '#7dd3fc' : '#fda4af',
                }}
              >
                {currentItem.item_type === 'cloze' ? '🧠 CLOZE DELETION' : '💣 PITFALL ELIMINATION'}
              </span>

              <span style={{ fontSize: '0.76rem', color: 'var(--text-sub)', fontWeight: 700 }}>
                Q#{currentItem.question_id} · {currentItem.category}
              </span>

              {currentItem.prioritized_wrong && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.18rem 0.55rem',
                    borderRadius: '999px',
                    background: 'rgba(244,63,94,0.14)',
                    color: 'var(--ink-rose)',
                    border: '1px solid rgba(244,63,94,0.35)',
                  }}
                >
                  เคยทำผิด — ดึงมาซ่อม
                </span>
              )}

              {currentSm2 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.18rem 0.55rem',
                    borderRadius: '999px',
                    background: currentSm2.is_due ? 'rgba(245,158,11,0.14)' : 'rgba(16,185,129,0.14)',
                    color: currentSm2.is_due ? 'var(--ink-amber)' : 'var(--ink-emerald)',
                  }}
                >
                  {currentSm2.is_due ? 'ถึงรอบทวน SM-2' : `ทวนอีก ${currentSm2.days_until_due} วัน`}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {timedMode && !currentAnswer && (
                <div
                  className="tabular-nums"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    background: timeLeft <= 7 ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.16)',
                    color: timeLeft <= 7 ? 'var(--ink-rose)' : 'var(--ink-amber)',
                    border: `1px solid ${timeLeft <= 7 ? '#ef4444' : '#f59e0b'}`,
                  }}
                >
                  <Clock size={14} /> {timeLeft} วิ
                </div>
              )}

              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border)',
                  color: currentIdx === 0 ? 'var(--text-muted)' : 'var(--text)',
                  cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="tabular-nums" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text)' }}>
                {currentIdx + 1} / {filteredItems.length}
              </span>
              <button
                type="button"
                disabled={currentIdx >= filteredItems.length - 1}
                onClick={() => setCurrentIdx((i) => Math.min(filteredItems.length - 1, i + 1))}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border)',
                  color: currentIdx >= filteredItems.length - 1 ? 'var(--text-muted)' : 'var(--text)',
                  cursor: currentIdx >= filteredItems.length - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Topic Subtitle */}
          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink-indigo)' }}>
            {currentItem.topic_title_th}
          </div>

          {/* Card Content: CLOZE vs PITFALL */}
          {currentItem.item_type === 'cloze' ? (
            <>
              <div
                style={{
                  padding: '1.1rem 1.2rem',
                  borderRadius: '12px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border)',
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  color: 'var(--text)',
                }}
              >
                {renderMaskedPrompt(currentItem, currentAnswer)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '0.65rem' }}>
                {(currentItem.options || []).map((opt, idx) => {
                  const answered = Boolean(currentAnswer);
                  const isTarget = opt === currentItem.missing_answer;
                  const isChosen = currentAnswer?.chosen === opt;

                  let bg = 'var(--surface-card)';
                  let borderColor = 'var(--border)';
                  let textColor = 'var(--text)';
                  if (answered) {
                    if (isTarget) {
                      bg = 'rgba(16,185,129,0.16)';
                      borderColor = '#10b981';
                      textColor = 'var(--ink-emerald)';
                    } else if (isChosen) {
                      bg = 'rgba(239,68,68,0.16)';
                      borderColor = '#ef4444';
                      textColor = 'var(--ink-rose)';
                    }
                  }
                  return (
                    <button
                      key={`${opt}-${idx}`}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswerCloze(opt)}
                      style={{
                        padding: '0.8rem 1rem',
                        borderRadius: '11px',
                        textAlign: 'left',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        cursor: answered ? 'default' : 'pointer',
                        background: bg,
                        border: `1.5px solid ${borderColor}`,
                        color: textColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span>{opt}</span>
                      {answered && isTarget && <CheckCircle2 size={17} style={{ color: '#34d399', flexShrink: 0 }} />}
                      {answered && isChosen && !isTarget && <XCircle size={17} style={{ color: '#f87171', flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  padding: '1.05rem 1.15rem',
                  borderRadius: '12px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border)',
                  fontSize: '0.96rem',
                  lineHeight: 1.7,
                  color: 'var(--text)',
                }}
              >
                {currentItem.stem}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {(currentItem.choices || []).map((ch) => {
                  const answered = Boolean(currentAnswer);
                  const isCorrectChoice =
                    String(ch.label).trim().toUpperCase() ===
                    String(currentItem.correct_answer || '').trim().toUpperCase();
                  const isChosen =
                    answered &&
                    currentAnswer.chosen &&
                    String(currentAnswer.chosen).trim().toUpperCase() === String(ch.label).trim().toUpperCase();

                  let bg = 'var(--surface-card)';
                  let borderColor = 'var(--border)';
                  if (answered) {
                    if (isCorrectChoice) {
                      bg = 'rgba(16,185,129,0.12)';
                      borderColor = 'rgba(16,185,129,0.55)';
                    } else if (isChosen) {
                      bg = 'rgba(239,68,68,0.14)';
                      borderColor = 'rgba(239,68,68,0.55)';
                    }
                  }

                  return (
                    <button
                      key={ch.label}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswerPitfall(ch.label)}
                      style={{
                        padding: '0.78rem 1rem',
                        borderRadius: '11px',
                        textAlign: 'left',
                        cursor: answered ? 'default' : 'pointer',
                        background: bg,
                        border: `1.5px solid ${borderColor}`,
                        color: 'var(--text)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', fontSize: '0.9rem', fontWeight: 700 }}>
                        <span>
                          <strong style={{ color: isCorrectChoice && answered ? 'var(--ink-emerald)' : 'var(--text-muted)', marginRight: '0.45rem' }}>
                            {ch.label}.
                          </strong>
                          {ch.text}
                        </span>
                        {answered && isCorrectChoice && <CheckCircle2 size={17} style={{ color: 'var(--ink-emerald)', flexShrink: 0 }} />}
                        {answered && isChosen && !isCorrectChoice && <XCircle size={17} style={{ color: 'var(--ink-rose)', flexShrink: 0 }} />}
                      </div>

                      {answered && ch.explanation && (
                        <div
                          style={{
                            fontSize: '0.79rem',
                            lineHeight: 1.5,
                            color: isCorrectChoice ? 'var(--ink-emerald)' : isChosen ? 'var(--ink-rose)' : 'var(--text-sub)',
                            paddingTop: '0.25rem',
                            borderTop: '1px dashed var(--border)',
                          }}
                        >
                          {ch.explanation}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Post-Answer Insights, Common Pitfall & SM-2 Rating */}
          {currentAnswer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.2rem' }}>
              {currentAnswer.timedOut && (
                <div
                  style={{
                    padding: '0.6rem 0.9rem',
                    borderRadius: '10px',
                    background: 'rgba(239,68,68,0.14)',
                    border: '1px solid rgba(239,68,68,0.42)',
                    color: 'var(--ink-rose)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                  }}
                >
                  หมดเวลา {TIMED_SECONDS} วินาที — ระบบเฉลยคำตอบให้แล้ว ลองอ่านหลักการและจุดหลอกด้านล่าง
                </div>
              )}

              {currentItem.common_pitfall && (
                <div
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: '11px',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.35)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.55rem',
                    fontSize: '0.84rem',
                    color: 'var(--ink-amber)',
                    lineHeight: 1.55,
                  }}
                >
                  <ShieldAlert size={17} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--ink-amber)' }} />
                  <div>
                    <strong>กับดักข้อสอบที่คนส่วนใหญ่พลาด (Common Pitfall):</strong> {currentItem.common_pitfall}
                  </div>
                </div>
              )}

              {(currentItem.key_takeaway || currentItem.why_correct) && (
                <div
                  style={{
                    padding: '0.78rem 1rem',
                    borderRadius: '11px',
                    background: 'rgba(16,185,129,0.09)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    fontSize: '0.83rem',
                    color: 'var(--text)',
                    lineHeight: 1.55,
                  }}
                >
                  <strong style={{ color: 'var(--ink-emerald)' }}>Key Takeaway:</strong>{' '}
                  {currentItem.key_takeaway || currentItem.why_correct}
                </div>
              )}

              {currentItem.reference && (
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  อ้างอิง: {currentItem.reference}
                </div>
              )}

              {/* SM-2 Spaced Repetition Bar + Drill Actions */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '1 1 300px' }}>
                  <div style={{ fontSize: '0.77rem', fontWeight: 700, color: 'var(--text-sub)' }}>
                    {token
                      ? 'บันทึกความจำเข้าสู่คิวทบทวน SM-2 (Cloze Deck):'
                      : 'เข้าสู่ระบบเพื่อบันทึกรอบทบทวน SM-2 อัตโนมัติ:'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {SM2_BUTTONS.map((b) => (
                      <button
                        key={b.rating}
                        type="button"
                        disabled={!token || savingSm2Key === currentItem.card_key}
                        onClick={() => handleSm2Rate(currentItem, b.rating)}
                        style={{
                          padding: '0.4rem 0.72rem',
                          borderRadius: '9px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: token ? 'pointer' : 'not-allowed',
                          opacity: token ? 1 : 0.5,
                          background: b.bg,
                          color: b.color,
                          border: `1px solid ${b.borderColor}`,
                        }}
                      >
                        {b.label} <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>({b.sub})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {onStartExam && (
                    <button
                      type="button"
                      disabled={startingExamId === currentItem.question_id}
                      onClick={() => handleStartFullQuestion(currentItem.question_id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.48rem 0.85rem',
                        borderRadius: '9px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: 'rgba(16,185,129,0.14)',
                        color: 'var(--ink-emerald)',
                        border: '1px solid rgba(16,185,129,0.38)',
                      }}
                    >
                      <Play size={14} /> ทำข้อสอบเต็ม Q#{currentItem.question_id}
                    </button>
                  )}

                  {onOpenTopic && currentItem.topic_id && (
                    <button
                      type="button"
                      onClick={() => onOpenTopic(currentItem.topic_id, 'synthesized', 'exam_topics')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.48rem 0.85rem',
                        borderRadius: '9px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: 'var(--surface-card)',
                        color: 'var(--primary-light)',
                        border: '1px solid rgba(13,148,136,0.38)',
                      }}
                    >
                      <BookOpen size={14} /> เปิดบทเรียนหัวข้อนี้
                    </button>
                  )}

                  {currentIdx + 1 < filteredItems.length && (
                    <button
                      type="button"
                      onClick={() => setCurrentIdx((idx) => idx + 1)}
                      className="btn btn-primary btn-sm"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.48rem 0.9rem',
                        borderRadius: '9px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      <Sparkles size={14} /> ข้อถัดไป
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
