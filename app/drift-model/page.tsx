"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Source = {
  label: string;
  url: string;
};

type Example = {
  title: string;
  date: string;
  context: string;
  whatHappened: string;
  whyThisStage: string;
  impact: string;
  sources: Source[];
};

type Stage = {
  id: number;
  name: string;
  description: string;
  driftPoint: string;
  frameworks: string;
  angle: number;
  driftMagnitude: number;
  driftTangent: number;
  example: Example;
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
    example: {
      title: "Latitude Financial",
      date: "Australia · March 2023",
      context:
        "Australia's largest non-bank lender, operating across Australia and New Zealand.",
      whatHappened:
        "An attacker compromised a service provider, used stolen employee credentials to pivot, and exfiltrated 14 million customer records. The breach exposed 7.9 million driver's licence numbers and 53,000 passport numbers - including 6.1 million records from customers active before 2013, with some dating back to 2005.",
      whyThisStage:
        "Latitude's stated retention practice was the failure - the intent itself was misaligned with privacy principles. The company held data on 14 million past, prospective and current customers despite having only 3 million active customers. UNSW's Rob Nicholls called it 'a governance red flag.' Australian Privacy Principle 11.2 requires destroying personal information no longer needed - intent that drifted long before any control was tested.",
      impact:
        "14 million records stolen · ~AU$76M in pre-tax costs · OAIC and NZ Privacy Commissioner joint investigation",
      sources: [
        {
          label: "CPO Magazine - Latitude breach analysis",
          url: "https://www.cpomagazine.com/cyber-security/data-breach-of-financial-service-provider-latitude-jumps-from-328000-to-14-million-records-stolen/",
        },
        {
          label: "Accounting Times - Governance red flags",
          url: "https://www.accountingtimes.com.au/technology/latitude-breach-raises-data-governance-red-flags",
        },
      ],
    },
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
    example: {
      title: "Equifax",
      date: "United States · 2017",
      context:
        "One of the three major US consumer credit reporting agencies, holding sensitive financial data on hundreds of millions.",
      whatHappened:
        "Apache disclosed CVE-2017-5638 (Apache Struts) on 7 March 2017. US-CERT notified Equifax the next day. Equifax's documented control required patching critical vulnerabilities within 48 hours. The patch was eventually applied in late July - roughly five months later - by which point attackers had been inside Equifax for 76 days.",
      whyThisStage:
        "Equifax had a written 48-hour patching control. On paper, it was correct. But the control as designed could not work: there was no complete IT asset inventory, no automation, scans relied on a single internal team manually identifying systems, and the disclosure email went to a 430-person distribution list with no enforcement. The control was unenforceable from inception - a Stage 2 failure.",
      impact:
        "147 million records exposed · US$1.4B in costs · CEO and CSO resigned · US Senate investigation",
      sources: [
        {
          label: "US Senate Report - How Equifax Neglected Cybersecurity",
          url: "https://www.hsgac.senate.gov/subcommittees/investigations/library/files/majority-and-minority-staff-report_-how-equifax-neglected-cybersecurity-and-suffered-a-devestating-data-breach/",
        },
        {
          label: "House Oversight Equifax Report (PDF)",
          url: "https://oversight.house.gov/wp-content/uploads/2018/12/Equifax-Report.pdf",
        },
      ],
    },
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
    example: {
      title: "Optus",
      date: "Australia · September 2022",
      context:
        "Australia's second-largest telecommunications provider, with around 10 million customers.",
      whatHappened:
        "An attacker accessed an internet-facing API endpoint that did not require authentication, then enumerated sequential customer IDs to extract data on 9.8 million current and former customers. According to ACMA's Federal Court filing, Optus did have access controls in place for the API - but a coding error introduced in 2018 weakened them, and the dormant endpoint sat exposed for years.",
      whyThisStage:
        "The control - 'API endpoints require authentication' - was correct. The implementation was where it broke. A code change in 2018 inadvertently bypassed authentication on a redundant API domain. The endpoint remained internet-facing despite remediation opportunities in 2020 and 2021. The control was sound on paper; the day-one (and day-1,500) configuration was not.",
      impact:
        "9.8M records exposed · 2.1M customers had ID documents stolen · ACMA and OAIC enforcement action · Estimated AU$140M+ in costs",
      sources: [
        {
          label: "iTnews - ACMA filing details",
          url: "https://www.itnews.com.au/news/optus-breach-allegedly-enabled-by-access-control-coding-error-608985",
        },
        {
          label: "UpGuard - How the Optus breach happened",
          url: "https://www.upguard.com/blog/how-did-the-optus-data-breach-happen",
        },
      ],
    },
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
    example: {
      title: "Medibank",
      date: "Australia · October 2022",
      context:
        "Australia's largest private health insurer, holding sensitive medical and identity data on millions.",
      whatHappened:
        "An attacker stole credentials from an IT service desk contractor's personal device, used them to log into Medibank's VPN (which did not enforce multi-factor authentication), and over six weeks exfiltrated 520 GB of customer data including health-related records. The OAIC investigation found that EDR alerts on 24-25 August were not triaged or escalated.",
      whyThisStage:
        "MFA was a documented requirement and a basic baseline control. Two prior reports - Datacom in mid-2020 and KPMG in August 2021 - had explicitly flagged MFA absence on privileged accounts as a 'critical defect.' Implementation supposedly followed. But reality drifted: MFA was not enforced on the Global Protect VPN; alerts were missed; the gap had been documented and unaddressed for over a year before exploitation.",
      impact:
        "9.7M Australians affected · OAIC commenced civil penalty proceedings · Potential fines exceeding AU$21 trillion",
      sources: [
        {
          label: "OAIC alleged timeline (PDF)",
          url: "https://www.oaic.gov.au/__data/assets/pdf_file/0037/228979/Medibank-data-breach-alleged-timeline-infographic.pdf",
        },
        {
          label: "ACS Information Age - Court docs reveal cause",
          url: "https://ia.acs.org.au/article/2024/court-docs-reveal-shocking-cause-of-medibank-breach.html",
        },
      ],
    },
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
    example: {
      title: "Wells Fargo",
      date: "United States · 2002 - 2016",
      context:
        "One of the largest US banks, with thousands of branches and aggressive cross-selling sales targets.",
      whatHappened:
        "Over more than a decade, Wells Fargo employees opened approximately 1.5 million unauthorised deposit accounts and 565,000 unauthorised credit cards in customers' names to meet sales quotas. Internal audit functions issued repeated reports rating the relevant controls as 'effective' throughout the period. The fraud became public in 2016 with US$185M in initial fines.",
      whyThisStage:
        "This is a textbook Stage 5 failure. Internal auditors issued report after report rating the sales-integrity controls as effective. Audit even reviewed the compensation plans and concluded they 'did not promote unethical behavior.' The OCC later fined the chief auditor US$7M and the executive audit director US$1.5M for failing to design audit work that would detect the misconduct. The paperwork was clean. The reality was not.",
      impact:
        "5,000+ employees terminated · US$3B+ in cumulative fines · Federal Reserve growth restriction · Audit executives personally fined",
      sources: [
        {
          label: "Banking Dive - Audit executives fined",
          url: "https://www.bankingdive.com/news/occ-3-ex-wells-fargo-execs-fine-18-million-russ-anderson-mclinko-julian-fake-accounts/737386/",
        },
        {
          label: "Harvard Law - Cross-selling scandal review",
          url: "https://corpgov.law.harvard.edu/2019/02/06/the-wells-fargo-cross-selling-scandal-2/",
        },
      ],
    },
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
    example: {
      title: "Equifax (the cumulative view)",
      date: "United States · 2015 - 2017",
      context:
        "The same Equifax breach examined as Stage 2, viewed through the lens of cumulative drift across the entire lifecycle.",
      whatHappened:
        "The 2017 breach was not a single failure - it was the surfacing of two years of compounded drift. April 2015: first patch management policy implemented. Late 2015: internal audit found 8,500+ unresolved vulnerabilities. May 2016: a separate breach of W-2 Express exposed 430,000 records. By 2017: most identified deficiencies remained unremediated. The Apache Struts vulnerability was simply the door that finally opened.",
      whyThisStage:
        "Every preceding stage had drifted. Intent was misaligned (security was under-resourced relative to scale). Control was poorly designed (no asset inventory). Implementation was incomplete (manual scans missed systems). Reality drifted (76 days of attacker access went undetected). Audit confirmed paperwork (8,500 known vulnerabilities flagged in 2015 were not closed by 2017). The Senate report described 'a formally acknowledged pattern of behavior' - the textbook definition of Drift as a phenomenon.",
      impact:
        "147M records · US$1.4B+ in costs · CEO retired · Multi-year recovery · The case study taught in every cybersecurity course",
      sources: [
        {
          label: "Seven Pillars Institute - Case study",
          url: "https://sevenpillarsinstitute.org/case-study-equifax-data-breach/",
        },
        {
          label: "US Senate Report",
          url: "https://www.hsgac.senate.gov/subcommittees/investigations/library/files/majority-and-minority-staff-report_-how-equifax-neglected-cybersecurity-and-suffered-a-devestating-data-breach/",
        },
      ],
    },
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

function buildIdealCirclePath(): string {
  const top = polarToXY(0, IDEAL_RADIUS);
  const bottom = polarToXY(180, IDEAL_RADIUS);
  return `M ${top.x} ${top.y} A ${IDEAL_RADIUS} ${IDEAL_RADIUS} 0 1 1 ${bottom.x} ${bottom.y} A ${IDEAL_RADIUS} ${IDEAL_RADIUS} 0 1 1 ${top.x} ${top.y}`;
}

export default function DriftModelPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    if (openId === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showExample) {
          setShowExample(false);
        } else {
          setOpenId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openId, showExample]);

  // Reset example view when modal closes or switches
  useEffect(() => {
    setShowExample(false);
  }, [openId]);

  const activeStage = STAGES.find((s) => s.id === openId);
  const actualCyclePath = buildActualCyclePath();
  const idealCirclePath = buildIdealCirclePath();

  return (
    <article className="px-4 md:px-10 py-12 md:py-16 max-w-7xl mx-auto w-full">
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

          <path
            d={actualCyclePath}
            fill="none"
            stroke={MAROON}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#maroonGlowDM)"
          />

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
                style={{ cursor: "pointer", outline: "none" }}
              >
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

      <p className="text-center text-xs tracking-[0.3em] text-white/35 uppercase mt-6 mb-12">
        Click any stage to explore
      </p>

      {/* HOW TO READ THIS */}
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

      {/* MODAL */}
      {activeStage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
          onClick={() => {
            setOpenId(null);
          }}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />

          <div
            className="relative bg-[#0d0d18] border border-[#7f77dd]/40 rounded-xl shadow-2xl w-full max-w-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.75), 0 0 60px rgba(127, 119, 221, 0.18)",
              animation: "modalIn 0.25s ease-out",
              maxHeight: "calc(100vh - 4rem)",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenId(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/5 transition"
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

            <div className="overflow-y-auto p-7 md:p-8" style={{ maxHeight: "calc(100vh - 4rem)" }}>
              {!showExample ? (
                <>
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
                      onClick={() => setShowExample(true)}
                      className="text-xs tracking-wide text-[#C97070] hover:text-[#D88B8B] transition flex items-center gap-1.5 font-medium"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A04545]"></span>
                      See real-world example →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowExample(false)}
                    className="mb-4 text-xs tracking-wide text-white/50 hover:text-white transition flex items-center gap-1.5"
                  >
                    ← Back to stage
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#A04545]"></span>
                    <span className="text-[10px] tracking-[0.2em] font-mono text-[#C97070] uppercase">
                      Real-world example · Stage {activeStage.id}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-white mb-1 tracking-wide">
                    {activeStage.example.title}
                  </h3>
                  <p className="text-xs tracking-wider text-[#C97070]/80 uppercase mb-5">
                    {activeStage.example.date}
                  </p>

                  <p className="text-[13px] text-white/55 italic leading-relaxed mb-5">
                    {activeStage.example.context}
                  </p>

                  <div className="mb-5">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#afa9ec] mb-2">
                      What happened
                    </p>
                    <p className="text-sm text-white/75 leading-relaxed">
                      {activeStage.example.whatHappened}
                    </p>
                  </div>

                  <div className="border-l-2 border-[#A04545]/60 pl-4 mb-5">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#C97070] mb-2">
                      Why this is a Stage {activeStage.id} failure
                    </p>
                    <p className="text-sm text-white/75 leading-relaxed">
                      {activeStage.example.whyThisStage}
                    </p>
                  </div>

                  <div className="bg-[#A04545]/8 border border-[#A04545]/20 rounded-md p-4 mb-5">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#C97070] mb-2">
                      Impact
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {activeStage.example.impact}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-white/45 mb-3">
                      Sources
                    </p>
                    <ul className="space-y-2">
                      {activeStage.example.sources.map((source, i) => (
                        <li key={i}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#afa9ec] hover:text-white transition inline-flex items-center gap-1.5"
                          >
                            <span>↗</span>
                            <span className="underline-offset-2 hover:underline">
                              {source.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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