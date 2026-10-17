import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, Search, Sparkles, AlertTriangle, ArrowLeft, 
  CheckCircle2, Compass, Award, ExternalLink, Bookmark, 
  Layers, ChevronRight, Play, BookMarked, Share2, Lightbulb, X
} from 'lucide-react';
import { 
  SPECIALTY_CATEGORIES, 
  CLINICAL_STUDY_GUIDES, 
  getGuidesBySpecialty 
} from '../data/clinicalStudyGuides';

export default function ClinicalStudyHub({ 
  onBack, 
  onStartExam, 
  initialTopicId = null,
  isModal = false,
  onClose = null 
}) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState(() => {
    if (initialTopicId && CLINICAL_STUDY_GUIDES[initialTopicId]) {
      return initialTopicId;
    }
    return Object.keys(CLINICAL_STUDY_GUIDES)[0];
  });
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    if (initialTopicId && CLINICAL_STUDY_GUIDES[initialTopicId]) {
      setSelectedGuideId(initialTopicId);
      const cat = CLINICAL_STUDY_GUIDES[initialTopicId].category;
      if (cat) setSelectedSpecialty(cat);
    }
  }, [initialTopicId]);

  // Filtered list of guides
  const filteredGuides = useMemo(() => {
    const list = getGuidesBySpecialty(selectedSpecialty);
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(g => {
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchOverview = g.overview.toLowerCase().includes(q);
      const matchMechanism = g.core_mechanism.toLowerCase().includes(q);
      const matchTopics = g.must_know_topics && g.must_know_topics.some(t => t.toLowerCase().includes(q));
      const matchPitfall = g.pitfalls && g.pitfalls.some(p => p.toLowerCase().includes(q));
      return matchTitle || matchOverview || matchMechanism || matchTopics || matchPitfall;
    });
  }, [selectedSpecialty, searchQuery]);

  // Ensure selectedGuide is valid
  useEffect(() => {
    if (filteredGuides.length > 0) {
      const exists = filteredGuides.some(g => g.id === selectedGuideId);
      if (!exists) {
        setSelectedGuideId(filteredGuides[0].id);
      }
    }
  }, [filteredGuides, selectedGuideId]);

  const activeGuide = CLINICAL_STUDY_GUIDES[selectedGuideId] || (filteredGuides[0] || null);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const handlePracticeTopic = (category) => {
    if (onStartExam && activeGuide) {
      onStartExam({
        category: activeGuide.category,
        count: 10,
        mode: 'practice'
      });
    }
  };

  const containerStyle = isModal ? {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    background: 'rgba(10, 15, 29, 0.88)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  } : {
    width: '100%',
    paddingBottom: '4rem',
  };

  const innerStyle = isModal ? {
    width: '100%',
    maxWidth: '1200px',
    maxHeight: '92vh',
    background: 'var(--bg-surface, #1e293b)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  } : {};

  return (
    <div style={containerStyle}>
      <div style={innerStyle} className="animate-fade-in">
        
        {/* ── Top Bar ──────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255, 255, 255, 0.02)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onBack && !isModal && (
              <button 
                onClick={onBack}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> กลับหน้าหลัก
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  คลังบทเรียนและเลกเชอร์เจาะลึก 10 สาขา + กฎหมาย
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Clinical Masterclass & Deep Reading Hub • เจาะลึกกลไกและกระบวนการตัดสินใจเหมือนนั่งเรียนในห้อง
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {copiedNotification && (
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                คัดลอกลิงก์สำเร็จ!
              </span>
            )}
            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              title="แชร์บทความ"
            >
              <Share2 size={14} /> แชร์
            </button>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ── Subheader Filters & Search ──────────────────── */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255, 255, 255, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              placeholder="ค้นหาชื่อโรค, กลไกพยาธิสรีรวิทยา, ยา, กับดักข้อสอบ (เช่น AAE, Lidocaine, C-Factor, Ludwig, RPI, OKC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.4rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Specialty Categories Scrollable Pills */}
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            {SPECIALTY_CATEGORIES.map(cat => {
              const isActive = selectedSpecialty === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSpecialty(cat.id)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                    background: isActive ? cat.color : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#ffffff' : 'var(--text-sub)',
                    border: isActive ? `1px solid ${cat.color}` : '1px solid var(--border)',
                    boxShadow: isActive ? `0 4px 12px ${cat.color}40` : 'none'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content Grid: Left List (35%) + Right Article (65%) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          minHeight: isModal ? 'calc(92vh - 140px)' : '750px',
          maxHeight: isModal ? 'calc(92vh - 140px)' : 'none',
          overflow: 'hidden'
        }} className="clinical-study-grid">
          
          {/* Left Column: Topics Sidebar */}
          <div style={{
            borderRight: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.01)',
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
              หัวข้อบทเรียน ({filteredGuides.length} หัวข้อ)
            </div>

            {filteredGuides.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ไม่พบบทเรียนที่ตรงกับคำค้นหา
              </div>
            ) : (
              filteredGuides.map(guide => {
                const isSelected = guide.id === selectedGuideId;
                return (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuideId(guide.id)}
                    style={{
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      background: isSelected ? 'rgba(124, 58, 237, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                      borderLeft: isSelected ? `4px solid ${guide.badgeColor || 'var(--primary)'}` : '4px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '6px',
                        background: `${guide.badgeColor}20`,
                        color: guide.badgeColor,
                        border: `1px solid ${guide.badgeColor}40`
                      }}>
                        {guide.specialty}
                      </span>
                      {isSelected && <ChevronRight size={14} color="var(--primary-light)" />}
                    </div>

                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? 'var(--text)' : 'var(--text-sub)',
                      lineHeight: 1.4,
                      marginBottom: '0.35rem'
                    }}>
                      {guide.title}
                    </div>

                    {guide.must_know_topics && guide.must_know_topics.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {guide.must_know_topics.slice(0, 3).map((t, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.66rem',
                            color: 'var(--text-muted)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            padding: '0.05rem 0.35rem',
                            borderRadius: '4px'
                          }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Active Lecture Reader Canvas */}
          <div style={{
            overflowY: 'auto',
            padding: '2rem 2.5rem',
            background: 'var(--bg-surface, rgba(15, 23, 42, 0.6))',
          }}>
            {activeGuide ? (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                {/* Header Section */}
                <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '12px',
                      background: `${activeGuide.badgeColor}25`,
                      color: activeGuide.badgeColor,
                      border: `1px solid ${activeGuide.badgeColor}50`
                    }}>
                      {activeGuide.specialty}
                    </span>
                    {activeGuide.must_know_topics && activeGuide.must_know_topics.map((t, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-sub)',
                        border: '1px solid var(--border)'
                      }}>
                        📌 {t}
                      </span>
                    ))}
                  </div>

                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    lineHeight: 1.35,
                    color: 'var(--text)',
                    marginBottom: '1rem'
                  }}>
                    {activeGuide.title}
                  </h1>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.04))',
                    borderLeft: '4px solid var(--primary)',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    color: 'var(--text)',
                    fontSize: '0.96rem',
                    lineHeight: 1.7,
                    fontWeight: 500
                  }}>
                    <strong>สรุปภาพรวมทางคลินิก (Clinical Overview):</strong> {activeGuide.overview}
                  </div>
                </div>

                {/* Section 1: Core Pathophysiological Mechanism */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--primary-light)',
                    marginBottom: '1rem'
                  }}>
                    <Lightbulb size={20} />
                    <h3>1. กลไกพยาธิสรีรวิทยาและหลักการคิดเชิงลึก (Core Mechanism & Pathophysiology)</h3>
                  </div>

                  <div style={{
                    color: 'var(--text-sub)',
                    fontSize: '0.96rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    fontFamily: 'inherit'
                  }}>
                    {activeGuide.core_mechanism}
                  </div>
                </div>

                {/* Section 2: Clinical Decision Matrix (Comparative Table) */}
                {activeGuide.matrix_headers && activeGuide.matrix_rows && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      marginBottom: '1rem'
                    }}>
                      <Layers size={20} />
                      <h3>2. ตารางเปรียบเทียบการวินิจฉัยและการรักษา (Clinical Decision Matrix)</h3>
                    </div>

                    <div style={{
                      overflowX: 'auto',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.01)'
                    }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left',
                        fontSize: '0.88rem'
                      }}>
                        <thead>
                          <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border)' }}>
                            {activeGuide.matrix_headers.map((h, i) => (
                              <th key={i} style={{
                                padding: '0.85rem 1rem',
                                color: 'var(--text)',
                                fontWeight: 700,
                                whiteSpace: 'nowrap'
                              }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeGuide.matrix_rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{
                              borderBottom: rIdx < activeGuide.matrix_rows.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                              background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                            }}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{
                                  padding: '0.85rem 1rem',
                                  color: cIdx === 0 ? 'var(--text)' : 'var(--text-sub)',
                                  fontWeight: cIdx === 0 ? 700 : 400,
                                  lineHeight: 1.55,
                                  verticalAlign: 'top'
                                }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Section 3: Common Pitfalls & Traps (หลุมพรางข้อสอบ) */}
                {activeGuide.pitfalls && activeGuide.pitfalls.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--warning)',
                      marginBottom: '1rem'
                    }}>
                      <AlertTriangle size={20} />
                      <h3>3. ข้อควรระวัง & หลุมพรางข้อสอบ (Common Traps & Distractors)</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {activeGuide.pitfalls.map((pitfall, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(245, 158, 11, 0.06)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          borderLeft: '4px solid var(--warning)',
                          borderRadius: '10px',
                          padding: '1rem 1.25rem',
                          color: 'var(--text-sub)',
                          fontSize: '0.94rem',
                          lineHeight: 1.7
                        }}>
                          <div style={{ color: 'var(--warning)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                            ⚠️ กับดักข้อสอบที่ {idx + 1}:
                          </div>
                          {pitfall}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: Clinical Board Pearl (จุดเน้นข้อสอบ / ข้อคิดอาจารย์) */}
                {activeGuide.pearl && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(236, 72, 153, 0.08))',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      borderRadius: '12px',
                      padding: '1.25rem 1.5rem',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--primary-light)',
                        marginBottom: '0.5rem'
                      }}>
                        <Sparkles size={18} />
                        <h4>Clinical Board Pearl / จุดเน้นข้อสอบ</h4>
                      </div>
                      <div style={{
                        color: 'var(--text)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        lineHeight: 1.7
                      }}>
                        {activeGuide.pearl}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Authoritative Reference */}
                {activeGuide.reference && (
                  <div style={{
                    padding: '1rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    marginBottom: '2rem'
                  }}>
                    <BookMarked size={16} color="var(--primary-light)" />
                    <div>
                      <strong style={{ color: 'var(--text-sub)' }}>เอกสารอ้างอิงและเกณฑ์มาตรฐาน (Authoritative Reference): </strong>
                      {activeGuide.reference}
                    </div>
                  </div>
                )}

                {/* Section 6: Action Footer - Practice Exam on This Topic */}
                {onStartExam && (
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05))',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.25rem 0' }}>
                        พร้อมทดสอบความเข้าใจในหัวข้อนี้หรือยัง?
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-sub)' }}>
                        ฝึกทำข้อสอบจริง 10 ข้อในหมวด <strong>{activeGuide.category}</strong> พร้อมเฉลยละเอียด
                      </p>
                    </div>

                    <button
                      onClick={handlePracticeTopic}
                      className="btn btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      <Play size={16} fill="currentColor" /> เริ่มฝึกซ้อมข้อสอบหัวข้อนี้
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                เลือกบทเรียนจากแถบด้านซ้ายเพื่อเริ่มอ่าน
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
