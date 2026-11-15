import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Eye, EyeOff, ZoomIn, ZoomOut, SunMedium, Contrast,
  Columns, Play, BookOpen, X, AlertTriangle, CheckCircle2, Sparkles
} from 'lucide-react';
import { API_BASE } from '../config';
import { useAuth } from '../contexts/AuthContext';

const MODALITY_META = {
  all: { label: 'ทั้งหมดทุกประเภท', color: '#2563eb' },
  radiograph: { label: 'ภาพรังสีวินิจฉัย (Radiograph)', color: '#0284c7' },
  clinical_lesion: { label: 'ภาพคลินิก / รอยโรค (Clinical)', color: '#e11d48' },
  cast_chart: { label: 'แบบจำลอง / กราฟ / แผนภาพ', color: '#059669' },
};

export default function VisualAtlas({
  selectedSpecialty = 'all',
  searchQuery = '',
  specialtyColorMap = {},
  onOpenTopic = null,
  onStartExam = null,
  onOpenAuthModal = null,
  isModal = false,
  onClose = null,
}) {
  const { token, authFetch } = useAuth() || {};
  const [atlasData, setAtlasData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedModality, setSelectedModality] = useState('all');
  // Spot-Diagnosis Quiz Mode hides answer badges until flipped individually
  const [spotQuizMode, setSpotQuizMode] = useState(true);
  const [revealedIds, setRevealedIds] = useState({});

  // Lightbox Zoom + Radiograph Enhancer
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxInvert, setLightboxInvert] = useState(false);
  const [lightboxHighContrast, setLightboxHighContrast] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Side-by-Side Differential Compare (Slot A vs Slot B)
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [startingDrill, setStartingDrill] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token || !authFetch) {
      setAtlasData(null);
      setError('auth_required');
      setLoading(false);
      return () => { cancelled = true; };
    }
    setLoading(true);
    authFetch(`${API_BASE}/api/learning/visual-atlas`)
      .then((res) => {
        if (res.status === 401) throw new Error('AUTH_REQUIRED');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAtlasData(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load Visual Atlas:', err);
          if (err.message === 'AUTH_REQUIRED') {
            setError('auth_required');
          } else {
            setError('ไม่สามารถโหลดคลังภาพวินิจฉัยได้ กรุณาลองใหม่อีกครั้ง');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token, authFetch]);

  const visibleItems = useMemo(() => {
    const raw = atlasData?.items || [];
    const q = searchQuery.trim().toLowerCase();
    return raw.filter((item) => {
      if (selectedSpecialty !== 'all' && item.category !== selectedSpecialty) {
        return false;
      }
      if (selectedModality !== 'all' && item.modality !== selectedModality) {
        return false;
      }
      if (q) {
        const hay = [
          item.stem_preview,
          item.topic_title_th,
          item.category,
          item.correct_choice_text,
          item.key_takeaway,
          item.core_principle,
          item.reference,
          String(item.id),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [atlasData, selectedSpecialty, selectedModality, searchQuery]);

  const toggleReveal = (id) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLaunchDrill = async (questionIds) => {
    if (!onStartExam || !questionIds || questionIds.length === 0 || startingDrill) return;
    setStartingDrill(true);
    try {
      const doFetch = authFetch || fetch;
      const res = await doFetch(`${API_BASE}/api/questions/by-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_ids: questionIds.slice(0, 30) }),
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
      console.error('Failed to start visual drill:', err);
    } finally {
      setStartingDrill(false);
    }
  };

  const openLightbox = (item) => {
    setLightboxItem(item);
    setLightboxZoom(1);
    setLightboxInvert(false);
    setLightboxHighContrast(false);
  };

  const isItemRevealed = (id) => !spotQuizMode || Boolean(revealedIds[id]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-sub)' }}>
        <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🩻</div>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
          กำลังรวบรวมคลังภาพวินิจฉัยและฟิล์มรังสี (Visual Spot-Diagnosis Atlas)...
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          กำลังจัดหมวดภาพรังสี ภาพรอยโรคทางคลินิก และแบบจำลองทันตกรรมจากข้อสอบ NL จริง
        </div>
      </div>
    );
  }

  if (error === 'auth_required') {
    return (
      <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🔐</div>
        <div style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--text)', marginBottom: '0.45rem' }}>
          กรุณาเข้าสู่ระบบเพื่อใช้งาน Visual Spot-Diagnosis & Radiograph Atlas
        </div>
        <div style={{ fontSize: '0.86rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
          คลังภาพฟิล์มรังสีและรอยโรคทางคลินิกพร้อมเฉลยสงวนไว้สำหรับผู้ใช้งานที่เข้าสู่ระบบแล้ว
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
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#fda4af' }}>
        <AlertTriangle size={28} style={{ marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: 700 }}>{error}</div>
      </div>
    );
  }

  const modalityCounts = atlasData?.stats_by_modality || {};
  const totalPool = atlasData?.total_pool || 0;

  return (
    <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
      {/* ── Visual Atlas Sub-Toolbar ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        marginBottom: '1.25rem',
        padding: '1rem 1.15rem',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(2, 132, 199, 0.06))',
        border: '1px solid rgba(37, 99, 235, 0.28)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>คลังภาพวินิจฉัย Spot-Diagnosis & Radiograph Atlas</span>
              <span style={{
                fontSize: '0.74rem',
                padding: '0.15rem 0.55rem',
                borderRadius: '12px',
                background: 'rgba(2, 132, 199, 0.14)',
                color: 'var(--ink-sky)',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}>
                แสดง {visibleItems.length} / {totalPool} ภาพ
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.2rem' }}>
              ฝึกดูฟิล์มรังสี OPG/PA, ภาพรอยโรคช่องปาก และแบบจำลอง RPD/Cephalometric พร้อมโหมดซ่อนคำตอบและเทียบภาพเคียงคู่
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setSpotQuizMode((v) => !v);
                setRevealedIds({});
              }}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: spotQuizMode ? 'var(--primary)' : 'var(--surface-card)',
                color: spotQuizMode ? '#fff' : 'var(--text-sub)',
                border: spotQuizMode ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              {spotQuizMode ? <EyeOff size={15} /> : <Eye size={15} />}
              {spotQuizMode ? 'Spot-Quiz: ซ่อนเฉลยอยู่ (คลิกเปิดรายข้อ)' : 'โหมดอ่าน: แสดงเฉลยทุกใบ'}
            </button>

            {onStartExam && visibleItems.length > 0 && (
              <button
                type="button"
                disabled={startingDrill}
                onClick={() => handleLaunchDrill(visibleItems.map((i) => i.id))}
                className="btn btn-primary btn-sm"
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: startingDrill ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Play size={14} />
                {startingDrill
                  ? 'กำลังเปิดชุดฝึก...'
                  : `ฝึกทำชุดภาพเหล่านี้ (${Math.min(30, visibleItems.length)} ข้อ)`}
              </button>
            )}
          </div>
        </div>

        {/* Modality Filter Pills */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {Object.entries(MODALITY_META).map(([key, meta]) => {
            const active = selectedModality === key;
            const count = key === 'all' ? totalPool : (modalityCounts[key] || 0);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedModality(key)}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: active ? meta.color : 'var(--surface-card)',
                  color: active ? '#fff' : 'var(--text-sub)',
                  border: active ? `1px solid ${meta.color}` : '1px solid var(--border)',
                }}
              >
                <span>{meta.label}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.05rem 0.4rem',
                  borderRadius: '10px',
                  background: active ? 'rgba(255,255,255,0.22)' : 'var(--surface-subtle)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Side-by-Side Differential Compare Drawer (when Slot A or B selected) ── */}
      {(compareA || compareB) && (
        <div style={{
          marginBottom: '1.35rem',
          padding: '1rem 1.15rem',
          borderRadius: '14px',
          background: 'var(--bg-panel)',
          border: '1px solid rgba(245, 158, 11, 0.42)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Columns size={17} />
              <span>โต๊ะเปรียบเทียบภาพแยกวินิจฉัยเคียงคู่ (Differential Compare)</span>
            </div>
            <button
              type="button"
              onClick={() => { setCompareA(null); setCompareB(null); }}
              style={{
                padding: '0.28rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                background: 'var(--surface-subtle)',
                color: 'var(--text-sub)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              ล้างการเปรียบเทียบ
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
            {[
              { slot: 'A (ซ้าย)', item: compareA, clear: () => setCompareA(null), accent: 'var(--ink-sky)' },
              { slot: 'B (ขวา)', item: compareB, clear: () => setCompareB(null), accent: 'var(--ink-rose)' },
            ].map(({ slot, item, clear, accent }) => (
              <div
                key={slot}
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: 'var(--surface-card)',
                  border: `1px dashed ${item ? accent : 'var(--border)'}`,
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: accent }}>ภาพเปรียบเทียบ {slot}</span>
                  {item && (
                    <button
                      type="button"
                      onClick={clear}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ✕ เอาออก
                    </button>
                  )}
                </div>

                {!item ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '1rem' }}>
                    กดปุ่ม &quot;เทียบ {slot.split(' ')[0]}&quot; บนการ์ดภาพด้านล่างเพื่อดึงมาเปรียบเทียบความต่าง
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => openLightbox(item)}
                      style={{ background: '#020617', borderRadius: '8px', overflow: 'hidden', textAlign: 'center', cursor: 'zoom-in', height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img
                        src={`${API_BASE}/images/${item.image_path}`}
                        alt={`Q#${item.id}`}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: accent }}>
                      Q#{item.id} · {item.category} — {item.topic_title_th}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 700 }}>
                      เฉลย [{item.correct_answer}]: {item.correct_choice_text || 'ดูหลักการสำคัญ'}
                    </div>
                    {item.key_takeaway && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-emerald)', lineHeight: 1.5 }}>
                        สรุปสำคัญ: {item.key_takeaway}
                      </div>
                    )}
                    {item.common_pitfall && (
                      <div style={{ fontSize: '0.76rem', color: 'var(--ink-amber)', lineHeight: 1.45 }}>
                        กับดัก: {item.common_pitfall}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Visual Gallery Grid ── */}
      {visibleItems.length === 0 ? (
        <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          ไม่พบภาพวินิจฉัยที่ตรงกับหมวดวิชา ประเภทภาพ หรือคำค้นหาที่เลือก
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))',
          gap: '1.1rem',
        }}>
          {visibleItems.map((item) => {
            const revealed = isItemRevealed(item.id);
            const badgeColor = specialtyColorMap[item.category] || '#2563eb';
            const modMeta = MODALITY_META[item.modality] || MODALITY_META.clinical_lesion;

            return (
              <div
                key={item.id}
                style={{
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-card)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image Thumbnail (Click to Zoom Lightbox) */}
                <div
                  onClick={() => openLightbox(item)}
                  style={{
                    position: 'relative',
                    height: '205px',
                    background: '#020617',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'zoom-in',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={`${API_BASE}/images/${item.image_path}`}
                    alt={`Question ${item.id}`}
                    loading="lazy"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    display: 'flex',
                    gap: '4px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                      background: 'rgba(2, 6, 23, 0.78)',
                      color: modMeta.color,
                      border: `1px solid ${modMeta.color}55`,
                    }}>
                      {modMeta.icon} {item.modality === 'radiograph' ? 'X-ray' : item.modality === 'cast_chart' ? 'Model/Chart' : 'Clinical'}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                      background: 'rgba(2, 6, 23, 0.78)',
                      color: '#cbd5e1',
                    }}>
                      Q#{item.id}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '6px',
                    background: 'rgba(2, 6, 23, 0.78)',
                    color: '#e2e8f0',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <ZoomIn size={12} /> ขยายภาพ
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.5rem',
                      borderRadius: '10px',
                      background: `${badgeColor}22`,
                      color: badgeColor,
                    }}>
                      {item.category}
                    </span>
                    {item.source_exam && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {item.source_exam.replace('.pdf', '')}
                      </span>
                    )}
                  </div>

                  {/* Clinical Stem */}
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--text)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {item.stem_preview}
                  </div>

                  {/* Spot Diagnosis Reveal Area */}
                  {!revealed ? (
                    <button
                      type="button"
                      onClick={() => toggleReveal(item.id)}
                      style={{
                        marginTop: '0.25rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '10px',
                        border: '1px dashed rgba(37, 99, 235, 0.45)',
                        background: 'rgba(37, 99, 235, 0.09)',
                        color: 'var(--primary-light)',
                        fontSize: '0.79rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Sparkles size={14} /> เปิดดู Spot-Diagnosis & Key Takeaway
                    </button>
                  ) : (
                    <div style={{
                      marginTop: '0.25rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--ink-emerald)', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                        <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>เฉลย [{item.correct_answer}]: {item.correct_choice_text || item.topic_title_th}</span>
                      </div>
                      {item.key_takeaway && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)', lineHeight: 1.45 }}>
                          {item.key_takeaway}
                        </div>
                      )}
                      {item.common_pitfall && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--ink-amber)', lineHeight: 1.4 }}>
                          กับดัก: {item.common_pitfall}
                        </div>
                      )}
                      {spotQuizMode && (
                        <button
                          type="button"
                          onClick={() => toggleReveal(item.id)}
                          style={{
                            alignSelf: 'flex-end',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                          }}
                        >
                          ซ่อนคำตอบ
                        </button>
                      )}
                    </div>
                  )}

                  {/* Card Footer Action Buttons */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '0.45rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.35rem',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={() => setCompareA(item)}
                        style={{
                          padding: '0.24rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: compareA?.id === item.id ? '#0284c7' : 'rgba(2, 132, 199, 0.1)',
                          color: compareA?.id === item.id ? '#ffffff' : 'var(--ink-sky)',
                          border: '1px solid rgba(2, 132, 199, 0.3)',
                        }}
                      >
                        เทียบ A
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompareB(item)}
                        style={{
                          padding: '0.24rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: compareB?.id === item.id ? '#e11d48' : 'rgba(225, 29, 72, 0.1)',
                          color: compareB?.id === item.id ? '#ffffff' : 'var(--ink-rose)',
                          border: '1px solid rgba(225, 29, 72, 0.3)',
                        }}
                      >
                        เทียบ B
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {item.must_know_topic && onOpenTopic && (
                        <button
                          type="button"
                          onClick={() => onOpenTopic(item.must_know_topic)}
                          style={{
                            padding: '0.24rem 0.52rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--primary-light)',
                            border: '1px solid rgba(37, 99, 235, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <BookOpen size={11} /> เรียนหัวข้อ
                        </button>
                      )}
                      {onStartExam && (
                        <button
                          type="button"
                          onClick={() => handleLaunchDrill([item.id])}
                          style={{
                            padding: '0.24rem 0.52rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: 'var(--ink-emerald)',
                            border: '1px solid rgba(16, 185, 129, 0.32)',
                          }}
                        >
                          ฝึกทำ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Radiograph & Clinical Lightbox Modal ── */}
      {lightboxItem && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setLightboxItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100100,
            background: 'rgba(2, 6, 23, 0.88)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '1020px',
              maxHeight: '92vh',
              borderRadius: '16px',
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.14)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Lightbox Controls Bar */}
            <div style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                Q#{lightboxItem.id} · {lightboxItem.category} — {lightboxItem.topic_title_th}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => (z >= 2 ? 1 : Number((z + 0.5).toFixed(1))))}
                  style={{
                    padding: '0.32rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.08)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {lightboxZoom > 1 ? <ZoomOut size={14} /> : <ZoomIn size={14} />} {lightboxZoom}x
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxHighContrast((v) => !v)}
                  style={{
                    padding: '0.32rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: lightboxHighContrast ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                    color: lightboxHighContrast ? '#0f172a' : '#e2e8f0',
                    border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Contrast size={14} /> เพิ่ม Contrast
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxInvert((v) => !v)}
                  style={{
                    padding: '0.32rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: lightboxInvert ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                    color: lightboxInvert ? '#0f172a' : '#e2e8f0',
                    border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <SunMedium size={14} /> กลับสี X-ray (Invert)
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  style={{
                    padding: '0.32rem',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Lightbox Split View */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              overflowY: 'auto',
              flex: 1,
            }}>
              <div style={{
                background: '#020617',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                minHeight: '260px',
              }}>
                <img
                  src={`${API_BASE}/images/${lightboxItem.image_path}`}
                  alt={`Q#${lightboxItem.id}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '62vh',
                    objectFit: 'contain',
                    transform: `scale(${lightboxZoom})`,
                    transition: 'transform 0.2s ease, filter 0.2s ease',
                    filter: `${lightboxInvert ? 'invert(1)' : ''} ${lightboxHighContrast ? 'contrast(1.45) brightness(1.08)' : ''}`.trim() || 'none',
                  }}
                />
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.6 }}>
                  <strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem', fontSize: '0.76rem' }}>
                    โจทย์ / บริบททางคลินิก:
                  </strong>
                  {lightboxItem.question_text || lightboxItem.stem_preview}
                </div>

                {!isItemRevealed(lightboxItem.id) ? (
                  <button
                    type="button"
                    onClick={() => toggleReveal(lightboxItem.id)}
                    style={{
                      padding: '0.7rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(37, 99, 235, 0.2)',
                      border: '1px solid rgba(37, 99, 235, 0.5)',
                      color: '#93c5fd',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    คลิกเพื่อดูเฉลย กลไก และจุดระวัง
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#34d399', marginBottom: '0.25rem' }}>
                        ✓ เฉลย [{lightboxItem.correct_answer}]: {lightboxItem.correct_choice_text}
                      </div>
                      {lightboxItem.key_takeaway && (
                        <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                          สรุปสำคัญ: {lightboxItem.key_takeaway}
                        </div>
                      )}
                    </div>

                    {lightboxItem.core_principle && (
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
                        <strong style={{ color: '#93c5fd', display: 'block', marginBottom: '0.2rem' }}>กลไก / หลักการสำคัญ:</strong>
                        {lightboxItem.core_principle}
                      </div>
                    )}

                    {lightboxItem.common_pitfall && (
                      <div style={{ fontSize: '0.8rem', color: '#fde68a', lineHeight: 1.5, background: 'rgba(245, 158, 11, 0.1)', padding: '0.65rem 0.75rem', borderRadius: '10px' }}>
                        กับดักที่ต้องระวัง: {lightboxItem.common_pitfall}
                      </div>
                    )}

                    {lightboxItem.reference && (
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                        แหล่งอ้างอิง: {lightboxItem.reference}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                  {lightboxItem.must_know_topic && onOpenTopic && (
                    <button
                      type="button"
                      onClick={() => {
                        const tid = lightboxItem.must_know_topic;
                        setLightboxItem(null);
                        onOpenTopic(tid);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: 700 }}
                    >
                      เปิดบทเรียนหัวข้อนี้
                    </button>
                  )}
                  {onStartExam && (
                    <button
                      type="button"
                      onClick={() => {
                        const id = lightboxItem.id;
                        setLightboxItem(null);
                        handleLaunchDrill([id]);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ fontWeight: 700 }}
                    >
                      ฝึกทำข้อนี้ใน Practice Mode
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
