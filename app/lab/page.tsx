"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  SCENARIOS,
  Scenario,
  Difficulty,
  Domain,
  DIFFICULTY_LABELS,
  DOMAIN_LABELS,
} from "./scenarios";

const PROGRESS_KEY = "grc-drift-lab-progress-v1";
const HARD_UNLOCK_THRESHOLD = 7;
const HARD_UNLOCK_REQUIRED_COUNT = 2;
const SUCCESS_GREEN = "#7FBF7F";

type ProgressMap = Record<string, { score: number; completedAt: string }>;
type DomainFilter = "all" | Domain;
type DifficultyFilter = "all" | Difficulty;
type TypeFilter = "all" | "real" | "synthetic";

function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function countPassedAcross(
  progress: ProgressMap,
  predicate: (s: Scenario) => boolean
): number {
  return Object.entries(progress).filter(([id, data]) => {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (!scenario) return false;
    if (!predicate(scenario)) return false;
    return data.score >= HARD_UNLOCK_THRESHOLD;
  }).length;
}

function isHardUnlocked(progress: ProgressMap): boolean {
  const count = countPassedAcross(
    progress,
    (s) => s.difficulty === "easy" || s.difficulty === "moderate"
  );
  return count >= HARD_UNLOCK_REQUIRED_COUNT;
}

// ============= FILTER CHIP =============
function FilterChip({
  label,
  active,
  count,
  passedCount,
  unlockedDot,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  passedCount?: number;
  unlockedDot?: boolean;
  onClick: () => void;
}) {
  const activeStyle: React.CSSProperties = active
    ? {
        borderColor: "rgba(127, 119, 221, 0.5)",
        backgroundColor: "rgba(127, 119, 221, 0.12)",
        color: "white",
      }
    : {
        borderColor: "rgba(255, 255, 255, 0.1)",
        color: "rgba(255, 255, 255, 0.7)",
      };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[11px] py-1.5 px-3 rounded-full border transition hover:border-white/30 hover:text-white"
      style={activeStyle}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span className="opacity-50">{count}</span>
      )}
      {typeof passedCount === "number" && passedCount > 0 && (
        <span style={{ color: SUCCESS_GREEN }}>{passedCount}✓</span>
      )}
      {unlockedDot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: SUCCESS_GREEN }}
        />
      )}
    </button>
  );
}

// ============= SCENARIO CARD =============
function ScenarioCard({
  scenario,
  isHardLocked,
  progress,
}: {
  scenario: Scenario;
  isHardLocked: boolean;
  progress: ProgressMap;
}) {
  const hasProgress = progress[scenario.id];
  const isPassed = hasProgress && hasProgress.score >= HARD_UNLOCK_THRESHOLD;
  const isLocked = scenario.difficulty === "hard" && isHardLocked;
  const isAvailable = scenario.status === "available" && !isLocked;
  const isComingSoon = scenario.status === "coming-soon";

  let classes = "block rounded-lg border p-5 transition relative h-full";
  let cardStyle: React.CSSProperties = {};

  if (isAvailable && isPassed) {
    classes += " cursor-pointer scenario-card-passed";
    cardStyle = {
      borderColor: `${SUCCESS_GREEN}80`,
      backgroundColor: `${SUCCESS_GREEN}0A`,
      boxShadow: `0 0 24px ${SUCCESS_GREEN}26, inset 0 0 0 1px ${SUCCESS_GREEN}1A`,
    };
  } else if (isAvailable) {
    classes += " border-white/10 hover:border-[#7f77dd]/60 hover:bg-white/[0.02] cursor-pointer";
  } else if (isLocked) {
    classes += " border-white/5 opacity-50 cursor-not-allowed";
  } else {
    classes += " border-white/5 opacity-60 cursor-not-allowed";
  }

  const inner = (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.18em] text-[#7f77dd] uppercase font-medium">
          {DOMAIN_LABELS[scenario.domain]} · {DIFFICULTY_LABELS[scenario.difficulty]}
        </span>
        <div className="flex items-center gap-2">
          {scenario.isRealWorld && isAvailable && (
            <span className="text-[9px] tracking-[0.15em] text-[#C97070] uppercase flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A04545]"></span>
              Real-world
            </span>
          )}
          {hasProgress && isAvailable && (
            <span
              className="text-[9px] tracking-[0.15em] uppercase font-semibold"
              style={{ color: isPassed ? SUCCESS_GREEN : "#afa9ec" }}
            >
              {isPassed && "✓ "}{hasProgress.score}/10
            </span>
          )}
          {isLocked && (
            <span className="text-[9px] tracking-[0.15em] text-white/40 uppercase">
              Locked
            </span>
          )}
          {isComingSoon && (
            <span className="text-[9px] tracking-[0.15em] text-white/40 uppercase">
              Coming soon
            </span>
          )}
        </div>
      </div>

      <h3 className="text-base font-semibold text-white mb-2 leading-snug">
        {scenario.title}
      </h3>

      <p className="text-[13px] text-white/55 leading-relaxed mb-4">
        {scenario.shortPrompt}
      </p>

      <div className="text-[11px] tracking-wide">
        {isAvailable && isPassed && (
          <span style={{ color: SUCCESS_GREEN }} className="font-medium">
            Refine and re-attempt →
          </span>
        )}
        {isAvailable && !isPassed && (
          <span className="text-[#7f77dd] font-medium">
            {hasProgress ? "Try again →" : "Start scenario →"}
          </span>
        )}
        {isLocked && (
          <span className="text-white/30 italic">
            Score 7+ on 2 Easy or Moderate scenarios to unlock
          </span>
        )}
        {isComingSoon && (
          <span className="text-white/30 italic">In development</span>
        )}
      </div>
    </>
  );

  if (isAvailable) {
    return (
      <Link href={`/lab/${scenario.id}`} className={classes} style={cardStyle}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={classes} style={cardStyle}>
      {inner}
    </div>
  );
}

// ============= PROGRESS SUMMARY =============
function ProgressSummary({
  completedCount,
  passedCount,
  hardUnlocked,
}: {
  completedCount: number;
  passedCount: number;
  hardUnlocked: boolean;
}) {
  let line: React.ReactNode;

  if (completedCount === 0) {
    line = (
      <>
        You haven&apos;t attempted any scenarios yet. <span className="text-[#afa9ec]">Pick one to begin</span> — the Easy tier is a good starting point.
      </>
    );
  } else if (hardUnlocked) {
    line = (
      <>
        You&apos;ve scored 7+ on <span style={{ color: SUCCESS_GREEN }} className="font-medium">{passedCount} scenarios</span> across {completedCount} attempts. <span style={{ color: SUCCESS_GREEN }} className="font-medium">The Hard tier is unlocked</span> — though those scenarios are still in development.
      </>
    );
  } else if (passedCount === 0) {
    line = (
      <>
        You&apos;ve attempted <span className="text-[#afa9ec] font-medium">{completedCount} scenario{completedCount === 1 ? "" : "s"}</span> so far. Score <span className="text-white">7 or higher</span> on two Easy or Moderate scenarios to unlock the Hard tier.
      </>
    );
  } else {
    const need = HARD_UNLOCK_REQUIRED_COUNT - passedCount;
    line = (
      <>
        You&apos;ve scored 7+ on <span style={{ color: SUCCESS_GREEN }} className="font-medium">{passedCount} scenario{passedCount === 1 ? "" : "s"}</span> out of {completedCount} attempted. <span className="text-white">{need} more</span> to unlock the Hard tier.
      </>
    );
  }

  return (
    <div className="mb-3 p-5 rounded-lg border border-white/10 bg-white/[0.015]">
      <p className="text-[10px] tracking-[0.2em] text-[#afa9ec] uppercase mb-2 font-semibold">
        Where you are
      </p>
      <p className="text-[15px] text-white/75 leading-relaxed">{line}</p>
    </div>
  );
}

// ============= HARD TIER PROGRESS DOTS =============
function HardTierDots({
  passedCount,
  hardUnlocked,
}: {
  passedCount: number;
  hardUnlocked: boolean;
}) {
  const filled = Math.min(passedCount, HARD_UNLOCK_REQUIRED_COUNT);

  return (
    <div className="flex items-center gap-2.5 mb-6 pl-1">
      <span className="text-[10px] tracking-[0.18em] text-white/40 uppercase">
        Hard tier
      </span>
      <div className="flex gap-1">
        {Array.from({ length: HARD_UNLOCK_REQUIRED_COUNT }).map((_, i) => (
          <span
            key={i}
            className="inline-block w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor:
                i < filled ? SUCCESS_GREEN : "rgba(255, 255, 255, 0.15)",
            }}
          />
        ))}
      </div>
      {hardUnlocked && (
        <span
          className="text-[10px] tracking-[0.18em] uppercase font-semibold"
          style={{ color: SUCCESS_GREEN }}
        >
          · Unlocked
        </span>
      )}
    </div>
  );
}

// ============= UNLOCK BANNER =============
function UnlockBanner({ onJump }: { onJump: () => void }) {
  return (
    <div
      className="mb-6 rounded-lg p-4 unlock-banner flex items-center gap-3"
      style={{
        border: `1px solid ${SUCCESS_GREEN}66`,
        backgroundColor: `${SUCCESS_GREEN}10`,
        boxShadow: `0 0 30px ${SUCCESS_GREEN}33`,
      }}
    >
      <span className="text-2xl flex-shrink-0" style={{ color: SUCCESS_GREEN }}>
        ✓
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-0.5"
          style={{ color: SUCCESS_GREEN }}
        >
          Hard tier unlocked
        </p>
        <p className="text-sm text-white/85 leading-relaxed">
          You&apos;ve earned access — try a Hard scenario when you&apos;re ready.
        </p>
      </div>
      <button
        type="button"
        onClick={onJump}
        className="text-[11px] font-medium px-3 py-1.5 rounded-md border transition hover:bg-white/5 flex-shrink-0"
        style={{
          color: SUCCESS_GREEN,
          borderColor: `${SUCCESS_GREEN}66`,
        }}
      >
        Jump to Hard ↓
      </button>
    </div>
  );
}

// ============= MAIN PAGE =============
export default function LabPage() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [justUnlocked, setJustUnlocked] = useState(false);

  const [domainFilter, setDomainFilter] = useState<DomainFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);

    if (isHardUnlocked(p) && typeof window !== "undefined") {
      const flag = sessionStorage.getItem("hard-just-unlocked");
      if (flag === "true") {
        setJustUnlocked(true);
        sessionStorage.removeItem("hard-just-unlocked");
      }
    }
  }, []);

  const completedCount = Object.keys(progress).length;
  const passedCount = countPassedAcross(
    progress,
    (s) => s.difficulty === "easy" || s.difficulty === "moderate"
  );
  const hardUnlocked = passedCount >= HARD_UNLOCK_REQUIRED_COUNT;

  // Compute pass counts per domain (only easy/moderate count toward unlock)
  const passedByDomain: Record<Domain, number> = useMemo(() => {
    const result: Record<Domain, number> = {
      finance: 0,
      healthcare: 0,
      education: 0,
      industrial: 0,
    };
    (Object.keys(result) as Domain[]).forEach((d) => {
      result[d] = countPassedAcross(
        progress,
        (s) =>
          s.domain === d &&
          (s.difficulty === "easy" || s.difficulty === "moderate")
      );
    });
    return result;
  }, [progress]);

  // Total scenarios per domain (for the small count badges)
  const totalByDomain: Record<Domain, number> = useMemo(() => {
    const result: Record<Domain, number> = {
      finance: 0,
      healthcare: 0,
      education: 0,
      industrial: 0,
    };
    SCENARIOS.forEach((s) => {
      result[s.domain]++;
    });
    return result;
  }, []);

  // Apply filters and sort by difficulty
  const filteredScenarios = useMemo(() => {
    const difficultyOrder: Record<Difficulty, number> = {
      easy: 0,
      moderate: 1,
      hard: 2,
    };

    return SCENARIOS.filter((s) => {
      if (domainFilter !== "all" && s.domain !== domainFilter) return false;
      if (difficultyFilter !== "all" && s.difficulty !== difficultyFilter)
        return false;
      if (typeFilter === "real" && !s.isRealWorld) return false;
      if (typeFilter === "synthetic" && s.isRealWorld) return false;
      return true;
    }).sort((a, b) => {
      // Sort by difficulty first, then keep insertion order
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
  }, [domainFilter, difficultyFilter, typeFilter]);

  function jumpToHard() {
    setDifficultyFilter("hard");
    setTimeout(() => {
      document
        .getElementById("results-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <article className="px-4 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-xs tracking-[0.3em] text-[#7f77dd] mb-3 uppercase font-medium">
          The Lab
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-5">
          Spot drift in the wild
        </h1>
        <p className="text-base md:text-lg text-white/65 leading-relaxed">
          Read a real situation. Identify two stages of the Drift Model where the gap opened up. Get structured feedback on your reasoning. Theory only sticks when you apply it.
        </p>
      </header>

      {/* CHROME: sentence summary (always visible) */}
      <ProgressSummary
        completedCount={completedCount}
        passedCount={passedCount}
        hardUnlocked={hardUnlocked}
      />

      {/* CHROME: Hard tier progress dots (always visible) */}
      <HardTierDots passedCount={passedCount} hardUnlocked={hardUnlocked} />

      {/* CHROME: just-unlocked CTA banner */}
      {hardUnlocked && justUnlocked && <UnlockBanner onJump={jumpToHard} />}

      {/* FILTERS */}
      <div className="mb-3">
        <p className="text-[9px] tracking-[0.18em] text-white/40 uppercase mb-2">
          Domain
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label="All"
            active={domainFilter === "all"}
            count={SCENARIOS.length}
            onClick={() => setDomainFilter("all")}
          />
          {(Object.keys(DOMAIN_LABELS) as Domain[]).map((d) => (
            <FilterChip
              key={d}
              label={DOMAIN_LABELS[d]}
              active={domainFilter === d}
              count={totalByDomain[d]}
              passedCount={passedByDomain[d]}
              onClick={() => setDomainFilter(d)}
            />
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[9px] tracking-[0.18em] text-white/40 uppercase mb-2">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label="All"
            active={difficultyFilter === "all"}
            onClick={() => setDifficultyFilter("all")}
          />
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
            <FilterChip
              key={d}
              label={DIFFICULTY_LABELS[d]}
              active={difficultyFilter === d}
              unlockedDot={d === "hard" && hardUnlocked}
              onClick={() => setDifficultyFilter(d)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[9px] tracking-[0.18em] text-white/40 uppercase mb-2">
          Type
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label="All"
            active={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
          />
          <FilterChip
            label="Real-world"
            active={typeFilter === "real"}
            onClick={() => setTypeFilter("real")}
          />
          <FilterChip
            label="Synthetic"
            active={typeFilter === "synthetic"}
            onClick={() => setTypeFilter("synthetic")}
          />
        </div>
      </div>

      {/* RESULTS HEADER */}
      <div
        id="results-anchor"
        className="flex justify-between items-center pb-3 border-b border-white/10 mb-5"
      >
        <span className="text-[12px] text-white/60">
          {filteredScenarios.length === 0
            ? "No scenarios match these filters"
            : `Showing ${filteredScenarios.length} scenario${filteredScenarios.length === 1 ? "" : "s"}`}
        </span>
        {(domainFilter !== "all" ||
          difficultyFilter !== "all" ||
          typeFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setDomainFilter("all");
              setDifficultyFilter("all");
              setTypeFilter("all");
            }}
            className="text-[11px] text-[#afa9ec] hover:text-white transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* CARDS GRID */}
      {filteredScenarios.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-lg">
          <p className="text-white/50 text-sm mb-4">
            Nothing matches the current filter combination.
          </p>
          <button
            type="button"
            onClick={() => {
              setDomainFilter("all");
              setDifficultyFilter("all");
              setTypeFilter("all");
            }}
            className="text-[12px] text-[#afa9ec] hover:text-white transition underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {filteredScenarios.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              isHardLocked={!hardUnlocked}
              progress={progress}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="border-t border-white/10 pt-8 mt-10 text-center">
        <p className="text-[12px] text-white/40 leading-relaxed max-w-xl mx-auto">
          Need a refresher on the model first?{" "}
          <Link
            href="/drift-model"
            className="text-[#afa9ec] hover:text-white transition underline-offset-2 hover:underline"
          >
            Read the Drift Model
          </Link>
          .
        </p>
      </div>

      <style>{`
        @keyframes unlockGlow {
          0%   { box-shadow: 0 0 30px rgba(127, 191, 127, 0.20); }
          50%  { box-shadow: 0 0 50px rgba(127, 191, 127, 0.40); }
          100% { box-shadow: 0 0 30px rgba(127, 191, 127, 0.20); }
        }
        .unlock-banner {
          animation: unlockGlow 2.4s ease-in-out infinite;
        }
        .scenario-card-passed:hover {
          background-color: rgba(127, 191, 127, 0.06) !important;
        }
      `}</style>
    </article>
  );
}