import React, { useState, useEffect, useMemo } from 'react';
import {
  GitBranch, ArrowDown, ArrowRight, ChevronRight, RotateCcw,
  AlertTriangle, CheckCircle2, Sparkles, BookOpen, Layers, ShieldAlert, Play
} from 'lucide-react';

const PATHWAY_TYPE_META = {
  pathogenesis: {
    label: 'Pathogenesis & Mechanism Pathway',
    badgeBg: 'var(--primary-surface)',
    badgeColor: 'var(--primary-light)',
    borderColor: 'var(--primary-border)',
    gradient: 'var(--surface-card)',
  },
  protocol: {
    label: 'Clinical Protocol Flowchart',
    badgeBg: 'rgba(16, 185, 129, 0.14)',
    badgeColor: 'var(--ink-emerald)',
    borderColor: 'rgba(16, 185, 129, 0.32)',
    gradient: 'var(--surface-card)',
  },
  decision: {
    label: 'Clinical Decision Pathway',
    badgeBg: 'var(--primary-surface)',
    badgeColor: 'var(--primary-light)',
    borderColor: 'var(--primary-border)',
    gradient: 'var(--surface-card)',
  },
  procedure: {
    label: 'Stepwise Procedure Pathway',
    badgeBg: 'rgba(14, 165, 233, 0.14)',
    badgeColor: 'var(--ink-sky)',
    borderColor: 'rgba(14, 165, 233, 0.32)',
    gradient: 'var(--surface-card)',
  },
  legal: {
    label: 'Thai Dental Legal Pathway',
    badgeBg: 'rgba(239, 68, 68, 0.14)',
    badgeColor: 'var(--ink-rose)',
    borderColor: 'rgba(239, 68, 68, 0.32)',
    gradient: 'var(--surface-card)',
  },
};

const NODE_ROLE_META = {
  trigger: {
    icon: '',
    accent: 'var(--primary-light)',
    bg: 'rgba(37, 99, 235, 0.09)',
    border: 'rgba(37, 99, 235, 0.32)',
  },
  mechanism: {
    icon: '',
    accent: 'var(--ink-sky)',
    bg: 'rgba(2, 132, 199, 0.09)',
    border: 'rgba(2, 132, 199, 0.32)',
  },
  decision: {
    icon: '',
    accent: 'var(--ink-sky)',
    bg: 'rgba(6, 182, 212, 0.10)',
    border: 'rgba(6, 182, 212, 0.36)',
  },
  action: {
    icon: '',
    accent: 'var(--ink-emerald)',
    bg: 'rgba(16, 185, 129, 0.10)',
    border: 'rgba(16, 185, 129, 0.35)',
  },
  warning: {
    icon: '',
    accent: 'var(--ink-amber)',
    bg: 'rgba(245, 158, 11, 0.10)',
    border: 'rgba(245, 158, 11, 0.38)',
  },
  outcome: {
    icon: '',
    accent: 'var(--ink-emerald)',
    bg: 'rgba(34, 197, 94, 0.10)',
    border: 'rgba(34, 197, 94, 0.38)',
  },
};

export default function ClinicalPathwayDiagram({
  pathway,
  compact = false,
  defaultStepByStep = false,
  defaultMode = null,
}) {
  const initialMode = defaultMode || (defaultStepByStep ? 'step' : 'overview');
  const [viewMode, setViewMode] = useState(initialMode);
  const [unlockedCount, setUnlockedCount] = useState(1);

  // Interactive Branching Case Simulator state
  const [scenarioMap, setScenarioMap] = useState({}); // { [stepIdx]: targetBranchIdx }
  const [solvedSteps, setSolvedSteps] = useState({}); // { [stepIdx]: { chosenIdx, firstTry } }
  const [wrongAlerts, setWrongAlerts] = useState({}); // { [stepIdx]: { chosenCondition, chosenOutcome, triedIndices: [] } }

  const steps = pathway?.steps || [];
  const stepByStep = viewMode === 'step' || viewMode === 'interactive';
  const isInteractive = viewMode === 'interactive';

  useEffect(() => {
    setUnlockedCount(1);
    setViewMode(defaultMode || (defaultStepByStep ? 'step' : 'overview'));
    setScenarioMap({});
    setSolvedSteps({});
    setWrongAlerts({});
  }, [pathway?.id, defaultStepByStep, defaultMode]);

  // Precompute deterministic shuffled branch display order per decision step for interactive mode
  const shuffledOptionsByStep = useMemo(() => {
    const out = {};
    steps.forEach((step, sIdx) => {
      if (step.branches && step.branches.length >= 2) {
        const items = step.branches.map((br, bIdx) => ({ ...br, origIdx: bIdx }));
        // Deterministic rotation/interleave based on pathway id & step index so answer isn't always first
        const seed = (pathway?.id || 'p').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + sIdx * 7;
        items.sort((a, b) => {
          const ha = ((a.origIdx + 1) * 31 + seed) % 97;
          const hb = ((b.origIdx + 1) * 31 + seed) % 97;
          return ha - hb;
        });
        out[sIdx] = items;
      }
    });
    return out;
  }, [pathway?.id, steps]);

  if (!pathway || steps.length === 0) return null;

  const pMeta = PATHWAY_TYPE_META[pathway.pathway_type] || PATHWAY_TYPE_META.protocol;
  const visibleSteps = stepByStep ? steps.slice(0, unlockedCount) : steps;
  const hasMoreSteps = stepByStep && unlockedCount < steps.length;

  const lastVisibleIdx = visibleSteps.length - 1;
  const lastVisibleStep = visibleSteps[lastVisibleIdx];
  const lastStepRequiresDecision =
    isInteractive &&
    lastVisibleStep?.branches &&
    lastVisibleStep.branches.length >= 2 &&
    !solvedSteps[lastVisibleIdx];

  const totalDecisionSteps = steps.filter((s) => s.branches && s.branches.length >= 2).length;
  const firstTryCorrectCount = Object.values(solvedSteps).filter((v) => v.firstTry).length;

  const startInteractiveMode = () => {
    const initScenarios = {};
    steps.forEach((s, idx) => {
      if (s.branches && s.branches.length >= 2) {
        initScenarios[idx] = Math.floor(Math.random() * s.branches.length);
      }
    });
    setScenarioMap(initScenarios);
    setSolvedSteps({});
    setWrongAlerts({});
    setUnlockedCount(1);
    setViewMode('interactive');
  };

  const handleSelectScenarioBranch = (stepIdx, targetIdx) => {
    setScenarioMap((prev) => ({ ...prev, [stepIdx]: targetIdx }));
    setSolvedSteps((prev) => {
      const next = { ...prev };
      delete next[stepIdx];
      return next;
    });
    setWrongAlerts((prev) => {
      const next = { ...prev };
      delete next[stepIdx];
      return next;
    });
  };

  const handlePickInteractiveBranch = (stepIdx, origIdx, targetIdx, step) => {
    if (solvedSteps[stepIdx]) return;
    if (origIdx === targetIdx) {
      const hadPriorWrong = Boolean(wrongAlerts[stepIdx]?.triedIndices?.length);
      setSolvedSteps((prev) => ({
        ...prev,
        [stepIdx]: { chosenIdx: origIdx, firstTry: !hadPriorWrong },
      }));
      setWrongAlerts((prev) => {
        const next = { ...prev };
        delete next[stepIdx];
        return next;
      });
    } else {
      const chosenBr = step.branches[origIdx];
      const targetBr = step.branches[targetIdx];
      const prevTried = wrongAlerts[stepIdx]?.triedIndices || [];
      setWrongAlerts((prev) => ({
        ...prev,
        [stepIdx]: {
          chosenCondition: chosenBr.condition,
          chosenOutcome: chosenBr.outcome,
          targetCondition: targetBr.condition,
          triedIndices: prevTried.includes(origIdx) ? prevTried : [...prevTried, origIdx],
        },
      }));
    }
  };

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

        {/* Interactive Mode Switcher: Full Overview vs Step-by-Step vs Interactive Case Simulator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '9px',
            padding: '2px',
            flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              style={{
                padding: '0.26rem 0.62rem',
                borderRadius: '7px',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: viewMode === 'overview' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'overview' ? '#fff' : 'var(--text-sub)',
              }}
            >
              ดูแผนผังทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('step');
                setUnlockedCount(1);
              }}
              style={{
                padding: '0.26rem 0.62rem',
                borderRadius: '7px',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: viewMode === 'step' ? 'var(--success)' : 'transparent',
                color: viewMode === 'step' ? '#fff' : 'var(--text-sub)',
              }}
            >
              ไล่ดูทีละขั้น
            </button>
            <button
              type="button"
              onClick={startInteractiveMode}
              style={{
                padding: '0.26rem 0.65rem',
                borderRadius: '7px',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: viewMode === 'interactive' ? 'var(--warning)' : 'transparent',
                color: viewMode === 'interactive' ? '#fff' : 'var(--ink-amber)',
              }}
            >
              จำลองตัดสินใจ
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
                background: 'var(--surface)',
                border: `1.5px solid ${rMeta.border}`,
                borderLeft: `5px solid ${rMeta.accent}`,
                borderRadius: '12px',
                padding: compact ? '0.8rem 0.95rem' : '1rem 1.15rem',
                boxShadow: 'var(--shadow-card)',
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

                {/* Decision Branches Fork Cards (Static Overview OR Interactive Branching Simulator) */}
                {step.branches && step.branches.length > 0 && (
                  isInteractive && step.branches.length >= 2 ? (() => {
                    const targetIdx = scenarioMap[idx] ?? 0;
                    const targetBr = step.branches[targetIdx] || step.branches[0];
                    const solved = solvedSteps[idx];
                    const alertInfo = wrongAlerts[idx];
                    const options = shuffledOptionsByStep[idx] || step.branches.map((b, i) => ({ ...b, origIdx: i }));
                    const optionLabels = ['A', 'B', 'C', 'D', 'E'];

                    return (
                      <div style={{
                        marginTop: '0.85rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px dashed rgba(245, 158, 11, 0.35)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}>
                        {/* Scenario Prompt Box */}
                        <div style={{
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(225, 29, 72, 0.07))',
                          border: '1px solid rgba(245, 158, 11, 0.38)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.73rem', fontWeight: 800, color: 'var(--ink-amber)' }}>
                              ด่านจำลองการตัดสินใจ (สลับเปลี่ยนสถานการณ์ฝึกได้):
                            </span>
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {step.branches.map((_, sCaseIdx) => (
                                <button
                                  key={sCaseIdx}
                                  type="button"
                                  onClick={() => handleSelectScenarioBranch(idx, sCaseIdx)}
                                    style={{
                                      padding: '0.18rem 0.5rem',
                                      borderRadius: '6px',
                                      fontSize: '0.68rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      background: targetIdx === sCaseIdx ? '#f59e0b' : 'var(--surface-card)',
                                      color: targetIdx === sCaseIdx ? '#0f172a' : 'var(--text-sub)',
                                      border: '1px solid rgba(245, 158, 11, 0.35)',
                                    }}
                                  >
                                    เคส {sCaseIdx + 1}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--ink-amber)', lineHeight: 1.5 }}>
                              ◆ สถานการณ์ที่พบ: “{targetBr.condition}”
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)', marginTop: '0.2rem' }}>
                              เลือกแนวทางจัดการ / การวินิจฉัยที่ถูกต้องที่สุดสำหรับกรณีนี้:
                            </div>
                          </div>

                          {/* Interactive Intervention Choices */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            {options.map((opt, optPos) => {
                              const isCorrectChoice = solved && opt.origIdx === targetIdx;
                              const isTriedWrong = alertInfo?.triedIndices?.includes(opt.origIdx);
                              const optLetter = optionLabels[optPos] || String(optPos + 1);
                              return (
                                <button
                                  key={opt.origIdx}
                                  type="button"
                                  disabled={Boolean(solved)}
                                  onClick={() => handlePickInteractiveBranch(idx, opt.origIdx, targetIdx, step)}
                                  style={{
                                    textAlign: 'left',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '10px',
                                    cursor: solved ? 'default' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.6rem',
                                    background: isCorrectChoice
                                      ? 'rgba(16, 185, 129, 0.16)'
                                      : isTriedWrong
                                      ? 'rgba(239, 68, 68, 0.14)'
                                      : 'var(--surface-card)',
                                    border: isCorrectChoice
                                      ? '1.5px solid #10b981'
                                      : isTriedWrong
                                      ? '1.5px solid #ef4444'
                                      : '1px solid var(--border)',
                                    color: 'var(--text)',
                                  }}
                                >
                                <span style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '6px',
                                  flexShrink: 0,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  background: isCorrectChoice ? '#10b981' : isTriedWrong ? '#ef4444' : 'rgba(255,255,255,0.1)',
                                  color: isCorrectChoice || isTriedWrong ? '#fff' : 'var(--text-sub)',
                                }}>
                                  {isCorrectChoice ? '✓' : isTriedWrong ? '✗' : optLetter}
                                </span>
                                <span style={{ fontSize: '0.82rem', lineHeight: 1.5, fontWeight: isCorrectChoice ? 700 : 500 }}>
                                  {opt.outcome}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Clinical Consequence Alert (on wrong decision) */}
                        {alertInfo && !solved && (
                          <div style={{
                            padding: '0.75rem 0.9rem',
                            borderRadius: '10px',
                            background: 'rgba(239, 68, 68, 0.14)',
                            border: '1.5px solid rgba(239, 68, 68, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.45rem',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fca5a5', fontSize: '0.8rem', fontWeight: 800 }}>
                              <ShieldAlert size={16} />
                              <span>🚨 Clinical Consequence Alert — เลือกผิดแนวทาง!</span>
                            </div>
                            <div style={{ fontSize: '0.79rem', color: '#fecaca', lineHeight: 1.55 }}>
                              แนวทางที่คุณเลือกใช้เฉพาะเมื่อพบกรณี: <strong>“{alertInfo.chosenCondition}”</strong> แต่สถานการณ์จำลองนี้คือ <strong>“{alertInfo.targetCondition}”</strong> — การเลือกผิดทางอาจเสี่ยงต่อการรักษาล้มเหลว วินิจฉัยผิดซี่ หรือเกิดภาวะแทรกซ้อนทางคลินิก! กรุณาเลือกใหม่
                            </div>
                            <button
                              type="button"
                              onClick={() => handlePickInteractiveBranch(idx, targetIdx, targetIdx, step)}
                              style={{
                                alignSelf: 'flex-start',
                                padding: '0.24rem 0.6rem',
                                borderRadius: '7px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                color: '#e2e8f0',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              💡 ยอมรับคำใบ้และดูเฉลยขั้นนี้
                            </button>
                          </div>
                        )}

                        {/* Solved Rationale Badge */}
                        {solved && (
                          <div style={{
                            padding: '0.6rem 0.85rem',
                            borderRadius: '10px',
                            background: 'rgba(16, 185, 129, 0.14)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            fontSize: '0.8rem',
                            color: '#6ee7b7',
                            fontWeight: 700,
                          }}>
                            ✅ ตัดสินใจถูกต้อง! กรณี “{targetBr.condition}” ➔ {targetBr.outcome}
                          </div>
                        )}
                      </div>
                    );
                  })() : (
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
                  )
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
                    background: 'var(--surface-elevated)',
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

      {/* Step-by-step & Interactive Simulator Reveal Controls */}
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
            {isInteractive && totalDecisionSteps > 0 && (
              <span style={{ color: '#fbbf24', marginLeft: '8px', fontWeight: 700 }}>
                • ตัดสินใจถูกครั้งแรก {firstTryCorrectCount}/{totalDecisionSteps} ด่าน
              </span>
            )}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(unlockedCount > 1 || isInteractive) && (
              <button
                type="button"
                onClick={isInteractive ? startInteractiveMode : () => setUnlockedCount(1)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={13} /> {isInteractive ? 'สุ่มเคสใหม่' : 'เริ่มใหม่'}
              </button>
            )}
            {hasMoreSteps ? (
              <button
                type="button"
                disabled={lastStepRequiresDecision}
                onClick={() => setUnlockedCount(c => Math.min(steps.length, c + 1))}
                className="btn btn-primary btn-sm"
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: lastStepRequiresDecision ? 0.5 : 1,
                  cursor: lastStepRequiresDecision ? 'not-allowed' : 'pointer',
                }}
              >
                {lastStepRequiresDecision
                  ? 'เลือกคำตอบด้านบนก่อนไปขั้นถัดไป'
                  : `เปิดขั้นถัดไป (${unlockedCount + 1}/${steps.length})`} <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', color: '#34d399', borderColor: 'rgba(16,185,129,0.4)' }}
              >
                <CheckCircle2 size={13} /> {isInteractive ? 'ผ่านจำลองครบทุกขั้นตอน!' : 'ครบทุกขั้นตอนแล้ว'}
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
