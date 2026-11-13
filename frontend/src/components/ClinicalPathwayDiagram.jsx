import React, { useState, useEffect } from 'react';
import {
  GitBranch, ArrowDown, ArrowRight, ChevronRight, RotateCcw,
  AlertTriangle, CheckCircle2, Sparkles, BookOpen, Layers
} from 'lucide-react';

const PATHWAY_TYPE_META = {
  pathogenesis: {
    label: '🧬 Pathogenesis & Mechanism Pathway',
    badgeBg: 'rgba(168, 85, 247, 0.16)',
    badgeColor: '#c084fc',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.10), rgba(99, 102, 241, 0.05))',
  },
  protocol: {
    label: '📋 Clinical Protocol Flowchart',
    badgeBg: 'rgba(16, 185, 129, 0.16)',
    badgeColor: '#34d399',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.10), rgba(6, 182, 212, 0.05))',
  },
  decision: {
    label: '🔀 Clinical Decision Pathway',
    badgeBg: 'rgba(6, 182, 212, 0.16)',
    badgeColor: '#22d3ee',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(59, 130, 246, 0.05))',
  },
  procedure: {
    label: '🛠️ Stepwise Procedure Pathway',
    badgeBg: 'rgba(99, 102, 241, 0.16)',
    badgeColor: '#818cf8',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.10), rgba(14, 165, 233, 0.05))',
  },
  legal: {
    label: '⚖️ Thai Dental Legal Pathway',
    badgeBg: 'rgba(244, 63, 94, 0.16)',
    badgeColor: '#fb7185',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.10), rgba(245, 158, 11, 0.05))',
  },
};

const NODE_ROLE_META = {
  trigger: {
    icon: '🌱',
    accent: '#818cf8',
    bg: 'rgba(99, 102, 241, 0.10)',
    border: 'rgba(99, 102, 241, 0.35)',
  },
  mechanism: {
    icon: '⚙️',
    accent: '#c084fc',
    bg: 'rgba(168, 85, 247, 0.09)',
    border: 'rgba(168, 85, 247, 0.32)',
  },
  decision: {
    icon: '🔀',
    accent: '#22d3ee',
    bg: 'rgba(6, 182, 212, 0.10)',
    border: 'rgba(6, 182, 212, 0.38)',
  },
  action: {
    icon: '🩺',
    accent: '#34d399',
    bg: 'rgba(16, 185, 129, 0.10)',
    border: 'rgba(16, 185, 129, 0.35)',
  },
  warning: {
    icon: '⚠️',
    accent: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.10)',
    border: 'rgba(245, 158, 11, 0.40)',
  },
  outcome: {
    icon: '🎯',
    accent: '#4ade80',
    bg: 'rgba(34, 197, 94, 0.11)',
    border: 'rgba(34, 197, 94, 0.42)',
  },
};

export default function ClinicalPathwayDiagram({
  pathway,
  compact = false,
  defaultStepByStep = false,
}) {
  const [stepByStep, setStepByStep] = useState(defaultStepByStep);
  const [unlockedCount, setUnlockedCount] = useState(1);

  const steps = pathway?.steps || [];

  useEffect(() => {
    setUnlockedCount(1);
    setStepByStep(defaultStepByStep);
  }, [pathway?.id, defaultStepByStep]);

  if (!pathway || steps.length === 0) return null;

  const pMeta = PATHWAY_TYPE_META[pathway.pathway_type] || PATHWAY_TYPE_META.protocol;
  const visibleSteps = stepByStep ? steps.slice(0, unlockedCount) : steps;
  const hasMoreSteps = stepByStep && unlockedCount < steps.length;

  return (
    <div style={{
      background: pMeta.gradient,
      border: `1px solid ${pMeta.borderColor}`,
      borderRadius: compact ? '12px' : '16px',
      padding: compact ? '1rem' : '1.35rem',
      marginBottom: compact ? '0.5rem' : '1.25rem',
    }}>
      {/* ── Pathway Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem',
        marginBottom: compact ? '0.75rem' : '1rem',
        paddingBottom: compact ? '0.65rem' : '0.85rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '10px',
              background: pMeta.badgeBg,
              color: pMeta.badgeColor,
              border: `1px solid ${pMeta.borderColor}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <GitBranch size={12} /> {pMeta.label}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {steps.length} ขั้นตอนต่อเนื่อง
            </span>
          </div>
          <h4 style={{
            margin: 0,
            fontSize: compact ? '0.96rem' : '1.12rem',
            fontWeight: 800,
            color: 'var(--text)',
            lineHeight: 1.4,
          }}>
            {pathway.title}
          </h4>
          {pathway.subtitle && (
            <div style={{
              fontSize: compact ? '0.78rem' : '0.84rem',
              color: 'var(--text-sub)',
              marginTop: '0.25rem',
              lineHeight: 1.5,
            }}>
              {pathway.subtitle}
            </div>
          )}
        </div>

        {/* Interactive Mode Switcher: Full Overview vs Step-by-Step Reveal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            background: 'rgba(15, 23, 42, 0.55)',
            border: '1px solid var(--border)',
            borderRadius: '9px',
            padding: '2px',
          }}>
            <button
              type="button"
              onClick={() => setStepByStep(false)}
              style={{
                padding: '0.22rem 0.6rem',
                borderRadius: '7px',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: !stepByStep ? 'var(--primary)' : 'transparent',
                color: !stepByStep ? '#fff' : 'var(--text-sub)',
              }}
            >
              🗺️ ดูแผนผังทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => {
                setStepByStep(true);
                setUnlockedCount(1);
              }}
              style={{
                padding: '0.22rem 0.6rem',
                borderRadius: '7px',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: stepByStep ? '#10b981' : 'transparent',
                color: stepByStep ? '#fff' : 'var(--text-sub)',
              }}
            >
              👣 ไล่ดูทีละขั้น
            </button>
          </div>
        </div>
      </div>

      {/* ── Mini Step Progress Strip (Overview Roadmap Pills) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexWrap: 'wrap',
        marginBottom: compact ? '0.85rem' : '1.1rem',
      }}>
        {steps.map((s, idx) => {
          const rMeta = NODE_ROLE_META[s.node_type] || NODE_ROLE_META.mechanism;
          const isUnlocked = !stepByStep || idx < unlockedCount;
          return (
            <React.Fragment key={s.step_num || idx}>
              <button
                type="button"
                onClick={() => {
                  if (stepByStep) setUnlockedCount(idx + 1);
                }}
                title={s.title}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.16rem 0.5rem',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: stepByStep ? 'pointer' : 'default',
                  background: isUnlocked ? rMeta.bg : 'rgba(255,255,255,0.03)',
                  color: isUnlocked ? rMeta.accent : 'var(--text-muted)',
                  border: `1px solid ${isUnlocked ? rMeta.border : 'rgba(255,255,255,0.06)'}`,
                  opacity: isUnlocked ? 1 : 0.45,
                }}
              >
                <span>{rMeta.icon}</span>
                <span>{idx + 1}. {s.stage?.split('(')[0]?.trim()?.slice(0, 18)}</span>
              </button>
              {idx < steps.length - 1 && (
                <ArrowRight size={12} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Vertical Flowchart Node Sequence ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {visibleSteps.map((step, idx) => {
          const rMeta = NODE_ROLE_META[step.node_type] || NODE_ROLE_META.mechanism;
          const isLastVisible = idx === visibleSteps.length - 1;
          const nextStep = visibleSteps[idx + 1];
          const nextMeta = nextStep ? (NODE_ROLE_META[nextStep.node_type] || NODE_ROLE_META.mechanism) : null;

          return (
            <React.Fragment key={step.step_num || idx}>
              <div style={{
                position: 'relative',
                background: 'rgba(15, 23, 42, 0.56)',
                border: `1.5px solid ${rMeta.border}`,
                borderLeft: `5px solid ${rMeta.accent}`,
                borderRadius: '12px',
                padding: compact ? '0.8rem 0.95rem' : '1rem 1.15rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              }}>
                {/* Top Row: Step Number + Semantic Stage Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: rMeta.accent,
                      color: '#0f172a',
                      fontWeight: 900,
                      fontSize: '0.76rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {step.step_num || idx + 1}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.12rem 0.55rem',
                      borderRadius: '8px',
                      background: rMeta.bg,
                      color: rMeta.accent,
                      letterSpacing: '0.01em',
                    }}>
                      {rMeta.icon} {step.stage}
                    </span>
                  </div>
                </div>

                {/* Title & Detail */}
                {step.title && step.title !== step.detail && (
                  <div style={{
                    fontSize: compact ? '0.88rem' : '0.96rem',
                    fontWeight: 800,
                    color: 'var(--text)',
                    marginBottom: '0.3rem',
                    lineHeight: 1.45,
                  }}>
                    {step.title}
                  </div>
                )}
                <div style={{
                  fontSize: compact ? '0.83rem' : '0.88rem',
                  color: step.title && step.title !== step.detail ? 'var(--text-sub)' : 'var(--text)',
                  fontWeight: step.title && step.title !== step.detail ? 400 : 600,
                  lineHeight: 1.65,
                }}>
                  {step.detail}
                </div>

                {/* Decision Branches Fork Cards */}
                {step.branches && step.branches.length > 0 && (
                  <div style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px dashed rgba(255,255,255,0.12)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '0.55rem',
                  }}>
                    {step.branches.map((br, bIdx) => {
                      const bColor = br.color || '#38bdf8';
                      return (
                        <div key={bIdx} style={{
                          background: `${bColor}14`,
                          border: `1px solid ${bColor}45`,
                          borderTop: `3px solid ${bColor}`,
                          borderRadius: '10px',
                          padding: '0.65rem 0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                        }}>
                          <div style={{
                            fontSize: '0.73rem',
                            fontWeight: 800,
                            color: bColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <span>◆ กรณี:</span>
                            <span>{br.condition}</span>
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--text)',
                            lineHeight: 1.5,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '5px',
                          }}>
                            <span style={{ color: bColor, fontWeight: 900, marginTop: '1px' }}>➔</span>
                            <span>{br.outcome}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Directional Arrow Connector between consecutive Nodes */}
              {!isLastVisible && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '3px 0',
                }}>
                  <div style={{
                    width: '2px',
                    height: compact ? '10px' : '14px',
                    background: `linear-gradient(180deg, ${rMeta.accent}, ${nextMeta?.accent || rMeta.accent})`,
                  }} />
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: `1.5px solid ${nextMeta?.accent || rMeta.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: nextMeta?.accent || rMeta.accent,
                  }}>
                    <ArrowDown size={13} />
                  </div>
                  <div style={{
                    width: '2px',
                    height: compact ? '6px' : '8px',
                    background: nextMeta?.accent || rMeta.accent,
                    opacity: 0.7,
                  }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step-by-step Reveal Controls */}
      {stepByStep && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.85rem',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            กำลังดูขั้นที่ {unlockedCount} จาก {steps.length}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {unlockedCount > 1 && (
              <button
                type="button"
                onClick={() => setUnlockedCount(1)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={13} /> เริ่มใหม่
              </button>
            )}
            {hasMoreSteps ? (
              <button
                type="button"
                onClick={() => setUnlockedCount(c => Math.min(steps.length, c + 1))}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.76rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                เปิดขั้นถัดไป ({unlockedCount + 1}/{steps.length}) <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStepByStep(false)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', color: '#34d399', borderColor: 'rgba(16,185,129,0.4)' }}
              >
                <CheckCircle2 size={13} /> ครบทุกขั้นตอนแล้ว
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reference Footer */}
      {pathway.reference && (
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.55rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}>
          <BookOpen size={12} /> <span>อ้างอิง: {pathway.reference}</span>
        </div>
      )}
    </div>
  );
}
