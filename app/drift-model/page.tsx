"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Stage = {
  id: number;
  name: string;
  description: string;
  driftPoint: string;
  frameworks: string;
  angle: number;
  driftMagnitude: number; // outward offset from ideal radius
  driftTangent: number;
};

const STAGES: Stage[] = [
  {
    id: 1,
    name: "INTENT",
    description:
      "What the framework or organisation says it wants to achieve. Lives in ISO clauses, ISM controls, internal policies, and regulatory text. The starting point of every control lifecycle - the stated goal that everything downstream is supposed to satisfy.",
    driftPoint:
      "Drift can begin here when intent becomes stale - a 2019 policy still in force despite the org doubling in size, or a vague requirement that gives downstream teams no clear target.",
    frameworks: "ISO 27001 · ISM · NIST CSF",
    angle: 0,
    driftMagnitude: 0,
    driftTangent: 0,
  },
  {
    id: 2,
    name: "CONTROL",
    description:
      "The specific rule, procedure, or mechanism the organisation puts in place to satisfy the intent. The formal documented response - 'we will review admin access quarterly,' 'we will patch within 14 days,' 'we will encrypt at rest.'",
    driftPoint:
      "A control can be poorly designed from the start - vague, untestable, or impossible to enforce. When that happens, the control is broken before anyone has even tried to follow it.",
    frameworks: "ISO 27001 Annex A · ISM controls",
    angle: 60,
    driftMagnitude: 0,
    driftTangent: 0,
  },
  {
    id: 3,
    name: "IMPLEMENTATION",
    description:
      "How the control is actually configured, deployed, or operationalised on day one. Tools are set up, templates created, calendar reminders scheduled, staff trained. The control moves from paper into the live environment.",
    driftPoint:
      "Implementation can fall short of the control's design - the template covers only 80% of systems, training reaches only the original team, automation has gaps no one notices on launch day.",
    frameworks: "Operational evidence · System configs",
    angle: 120,
    driftMagnitude: 0,
    driftTangent: 0,
  },
  {
    id: 4,
    name: "REALITY",
    description:
      "What is currently, actually happening in the operational environment - right now, today. Not what was set up six months ago. Not what's in the runbook. The actual state of the system, behaviour, and people.",
    driftPoint:
      "This is where drift starts compounding. Reality silently diverges from implementation as time, change, and human factors compound - staff leave, systems are added, processes get skipped 'just this once.'",
    frameworks: "Logs · Behaviour · System state",
    angle: 180,
    driftMagnitude: 22,
    driftTangent: 3,
  },
  {
    id: 5,
    name: "AUDIT",
    description:
      "What auditors, leadership, or external assessors see and conclude when they check. The lens through which the organisation believes it is performing - based on documents reviewed, samples taken, and questions asked.",
    driftPoint:
      "Audit often confirms the paper trail rather than the operational truth. A control can pass review for years while being functionally broken - auditors sign off because the artefacts they were shown looked correct.",
    frameworks: "Audit reports · Attestations",
    angle: 240,
    driftMagnitude: 44,
    driftTangent: -4,
  },
  {
    id: 6,
    name: "DRIFT",
    description:
      "The cumulative gap between Reality and Intent that opens up over time, hidden by Audit. Drift isn't an event - it's the silent compounding of small mismatches at every preceding stage. By the time it surfaces, it has been forming for months or years.",
    driftPoint:
      "Drift feeds back into the next cycle: drifted reality becomes the baseline for next year's implementation, which drifts further. It is a loop, not a line - and the loop accelerates unless deliberately interrupted.",
    frameworks: "The phenomenon · Not a control",
    angle: 300,
    driftMagnitude: 64,
    driftTangent: 5,
  },
];

const SIZE = 800;
const CENTER = SIZE / 2;
const IDEAL_RADIUS = 240;
const STAGE_NODE = 50;
const PULSE_PERIOD = 20000;

const VIOLET = "#7f77dd";
const VIOLET_SOFT = "#afa9ec";
const MAROON = "#A04545";
const MAROON_SOFT = "#C97070";

function polarToXY(
  angleDeg: number,
  radius: number,
  cx: number = CENTER,
  cy: number = CENTER
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function getActualPos(stage: Stage) {
  // Drift goes OUTWARD - beyond the ideal radius
  const adjustedAngle = stage.angle + stage.driftTangent;
  return polarToXY(adjustedAngle, IDEAL_RADIUS + stage.driftMagnitude);
}

function buildActualCyclePath(): string {
  const positions = STAGES.map(getActualPos);
  const closed = [...positions, positions[0]];

  let d = `M ${closed[0].x.toFixed(2)} ${closed[0].y.toFixed(2)}`;
  for (let i = 0; i < closed.length - 1; i++) {
    const curr = closed[i];
    const next = closed[i + 1];
    const prev = i > 0 ? closed[i - 1] : closed[closed.length - 2];
    const after = i + 2 < closed.length ? closed[i + 2] : closed[1];

    const cp1x = curr.x + (next.x - prev.x) / 6;
    const cp1y = curr.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (after.x - curr.x) / 6;
    const cp2y = next.y - (after.y - curr.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
  }
  return d;
}

// Build the ideal circle path explicitly so the violet pulse motion path matches the visible circle
function buildIdealCirclePath(): string {
  const top = polarToXY(0, IDEAL_RADIUS);
  const bottom = polarToXY(180, IDEAL_RADIUS);
  return `M ${top.x} ${top.y} A ${IDEAL_RADIUS} ${IDEAL_RADIUS} 0 1 1 ${bottom.x} ${bottom.y} A ${IDEAL_RADIUS} ${IDEAL_RADIUS} 0 1 1 ${top.x} ${top.y}`;
}

export default function DriftModelPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (openId === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openId]);

  const activeStage = STAGES.find((s) => s.id === openId);
  const actualCyclePath = buildActualCyclePath();
  const idealCirclePath = buildIdealCirclePath();

  return (
    <article className="px-4 md:px-10 py-12 md:py-16 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-3 uppercase font-medium">
          The framework
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-5">
          What is the Drift Model?
        </h1>
        <p className="text-base md:text-lg text-white/65 leading-relaxed">
          The Drift Model maps the lifecycle of a security control across six stages - from the moment it&apos;s intended to satisfy a framework, to the moment auditors confirm it&apos;s working. At every stage, small mismatches can creep in. <span className="text-[#C97070]">Drift</span> is the cumulative gap that opens up between what the organisation says it does and what it actually does - silently, and often invisibly until something breaks.
        </p>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-6 text-[11px] tracking-[0.15em] uppercase text-white/55">
        <div className="flex items-center gap-2">
          <span className="inline-block w-7 h-[2px] border-t border-dashed border-[#afa9ec] opacity-70"></span>
          <span>Ideal - the documented promise</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-7 h-[3px] bg-[#A04545] rounded-full"></span>
          <span>Actual - the silent reality</span>
        </div>
      </div>

      {/* Diagram */}
      <div
        className="relative mx-auto"
        style={{ maxWidth: SIZE, aspectRatio: "1" }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="violetGlowDM" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="maroonGlowDM" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="strongStageGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="10" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============ LAYER 1: IDEAL CYCLE (faint, behind) ============ */}

          {/* Ideal circle - dashed violet */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={IDEAL_RADIUS}
            fill="none"
            stroke={VIOLET_SOFT}
            strokeWidth="1.5"
            strokeDasharray="4 8"
            opacity="0.4"
          />

          {/* Ideal stage ghosts - small dim circles at ideal positions for stages 4, 5, 6 */}
          {STAGES.filter((s) => s.driftMagnitude > 0).map((stage) => {
            const idealPos = polarToXY(stage.angle, IDEAL_RADIUS);
            return (
              <circle
                key={`ideal-${stage.id}`}
                cx={idealPos.x}
                cy={idealPos.y}
                r="14"
                fill="none"
                stroke={VIOLET_SOFT}
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.45"
              />
            );
          })}

          {/* ============ LAYER 2: ACTUAL CYCLE (foreground, bold maroon) ============ */}

          <path
            d={actualCyclePath}
            fill="none"
            stroke={MAROON}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#maroonGlowDM)"
          />

          {/* Gap connector lines - from each ideal ghost to each actual stage */}
          {STAGES.filter((s) => s.driftMagnitude > 0).map((stage) => {
            const idealPos = polarToXY(stage.angle, IDEAL_RADIUS);
            const actualPos = getActualPos(stage);
            const isHighlighted = hoveredId === stage.id || openId === stage.id;
            return (
              <line
                key={`gap-${stage.id}`}
                x1={idealPos.x}
                y1={idealPos.y}
                x2={actualPos.x}
                y2={actualPos.y}
                stroke={MAROON_SOFT}
                strokeWidth={isHighlighted ? "1.5" : "1"}
                strokeDasharray="2 3"
                opacity={isHighlighted ? 0.95 : 0.4}
                style={{ transition: "all 0.3s ease" }}
              />
            );
          })}

          {/* ============ MOVING PULSES ============ */}

          {/* Violet pulse on the ideal circle */}
          <g>
            <circle r="5" fill={VIOLET_SOFT} filter="url(#violetGlowDM)">
              <animateMotion
                dur={`${PULSE_PERIOD}ms`}
                repeatCount="indefinite"
                rotate="auto"
                path={idealCirclePath}
              />
            </circle>
          </g>

          {/* Maroon pulse on the actual drifted cycle */}
          <g>
            <circle r="5" fill={MAROON_SOFT} filter="url(#maroonGlowDM)">
              <animateMotion
                dur={`${PULSE_PERIOD}ms`}
                repeatCount="indefinite"
                rotate="auto"
                path={actualCyclePath}
              />
            </circle>
          </g>

          {/* Centre tagline - INTENT (violet) → REALITY (maroon), in caps */}
          <text
            x={CENTER}
            y={CENTER + 5}
            textAnchor="middle"
            fontSize="14"
            letterSpacing="0.3em"
            fontWeight="600"
          >
            <tspan fill={VIOLET_SOFT}>INTENT</tspan>
            <tspan fill="#ffffff" dx="6"> → </tspan>
            <tspan fill={MAROON_SOFT} dx="6">REALITY</tspan>
          </text>

          {/* ============ LAYER 3: ACTUAL STAGE NODES (clickable) ============ */}

          {STAGES.map((stage) => {
            const pos = getActualPos(stage);
            const isHovered = hoveredId === stage.id;
            const isOpen = openId === stage.id;
            const isActive = isHovered || isOpen;
            const hasDrift = stage.driftMagnitude > 0;

            return (
              <g
                key={`stage-${stage.id}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredId(stage.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenId(stage.id);
                }}
                onFocus={() => setHoveredId(stage.id)}
                onBlur={() => setHoveredId(null)}
                tabIndex={0}
                style={{
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {/* Glow halo when active */}
                {isActive && (
                  <>
                    <circle
                      r={STAGE_NODE + 22}
                      fill={
                        hasDrift
                          ? "rgba(160, 69, 69, 0.10)"
                          : "rgba(127, 119, 221, 0.10)"
                      }
                    />
                    <circle
                      r={STAGE_NODE + 12}
                      fill={
                        hasDrift
                          ? "rgba(160, 69, 69, 0.22)"
                          : "rgba(127, 119, 221, 0.22)"
                      }
                      filter="url(#strongStageGlow)"
                    />
                  </>
                )}

                <circle
                  r={STAGE_NODE}
                  fill={
                    hasDrift
                      ? isActive
                        ? "rgba(160, 69, 69, 0.30)"
                        : "rgba(160, 69, 69, 0.13)"
                      : isActive
                      ? "rgba(127, 119, 221, 0.30)"
                      : "rgba(127, 119, 221, 0.10)"
                  }
                  stroke={hasDrift ? MAROON_SOFT : VIOLET_SOFT}
                  strokeWidth={isActive ? "3" : "2"}
                  filter={isActive ? "url(#strongStageGlow)" : undefined}
                  style={{ transition: "all 0.3s ease" }}
                />

                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  y={-13}
                  fontSize="11"
                  fill={hasDrift ? MAROON_SOFT : VIOLET_SOFT}
                  letterSpacing="0.2em"
                  fontWeight="500"
                >
                  {stage.id}
                </text>

                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  y={9}
                  fontSize={stage.name.length > 8 ? "10" : "12"}
                  fontWeight="600"
                  fill="#ffffff"
                  letterSpacing="0.08em"
                >
                  {stage.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hint below diagram */}
      <p className="text-center text-xs tracking-[0.3em] text-white/35 uppercase mt-6 mb-12">
        Click any stage to explore
      </p>

      {/* ============ HOW TO READ THIS ============ */}
      <section className="max-w-3xl mx-auto mb-20 px-2">
        <div className="border-t border-white/10 pt-10">
          <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-3 uppercase font-medium">
            Reading the model
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            How to read this diagram
          </h2>

          <div className="space-y-5 text-white/70 leading-relaxed text-[15px]">
            <p>
              <span className="text-[#afa9ec] font-medium">Two cycles, one truth.</span>{" "}
              The diagram shows the same six-stage lifecycle, drawn twice.
            </p>

            <p>
              The <span className="text-[#afa9ec] font-medium">dashed violet circle</span> is the <em>ideal</em> - the cycle as the framework prescribes it, as the policy documents it, as the audit imagines it. The violet pulse traces this path: the documented promise, still being maintained on paper.
            </p>

            <p>
              The <span className="text-[#C97070] font-medium">solid maroon path</span> is the <em>actual</em> cycle - what really happens in the organisation. Stages 1, 2, and 3 sit perfectly on the ideal: <span className="text-white">Intent</span> is documented, <span className="text-white">Control</span> is written, <span className="text-white">Implementation</span> is deployed. The system is doing what it said.
            </p>

            <p>
              From <span className="text-[#C97070] font-medium">Stage 4 (Reality)</span> onward, the actual cycle <em>peels outward</em> from the ideal - reality begins exceeding what the controls were designed to contain. By <span className="text-[#C97070] font-medium">Stage 5 (Audit)</span>, the gap is significant but invisible: auditors confirm the paperwork while reality drifts further. By <span className="text-[#C97070] font-medium">Stage 6 (Drift)</span>, the gap has compounded into the silent risk that surfaces, eventually, as a breach.
            </p>

            <p>
              The space between the two cycles - the area where <span className="text-[#C97070]">drift</span> lives - widens with each stage, then carries forward into the next loop. The cycle never fully resets. <span className="text-white">Drift compounds</span>.
            </p>
          </div>
        </div>
      </section>

      {/* MODAL — centred on screen, opens on click */}
      {activeStage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setOpenId(null)}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />

          <div
            className="relative bg-[#0d0d18] border border-[#7f77dd]/40 rounded-xl p-7 md:p-8 shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.75), 0 0 60px rgba(127, 119, 221, 0.18)",
              animation: "modalIn 0.25s ease-out",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenId(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/5 transition"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-[10px] tracking-[0.2em] font-mono"
                style={{
                  color: activeStage.driftMagnitude > 0 ? MAROON_SOFT : VIOLET,
                }}
              >
                STAGE {activeStage.id}
              </span>
              {activeStage.driftMagnitude > 0 && (
                <span className="text-[10px] tracking-[0.15em] text-[#C97070] uppercase">
                  · drifted
                </span>
              )}
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">
              {activeStage.name}
            </h3>

            <p className="text-sm text-white/75 leading-relaxed mb-5">
              {activeStage.description}
            </p>

            <div className="border-t border-white/10 pt-4 mb-5">
              <p
                className="text-[11px] uppercase tracking-[0.15em] mb-2"
                style={{
                  color: activeStage.driftMagnitude > 0 ? "#C97070" : "#afa9ec",
                }}
              >
                Where drift happens
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                {activeStage.driftPoint}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] tracking-wider text-white/40">
                {activeStage.frameworks}
              </span>
              <button
                type="button"
                disabled
                className="text-xs tracking-wide text-[#C97070]/60 cursor-not-allowed flex items-center gap-1.5"
                title="Real-world examples coming in next iteration"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A04545]/60"></span>
                See real-world example →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lab CTA */}
      <div className="border-t border-white/10 pt-12 mt-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-3 uppercase font-medium">
            From theory to practice
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            Now spot drift in the wild
          </h2>
          <p className="text-base text-white/60 mb-8 leading-relaxed">
            Theory only sticks when you apply it. Try a scenario in the Lab.
          </p>
          <Link
            href="/lab"
            className="inline-block px-8 py-3 bg-[#7f77dd] text-white text-sm tracking-wide hover:bg-[#afa9ec] transition rounded-md font-medium"
          >
            Enter the Lab →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; }
        }
      `}</style>
    </article>
  );
}