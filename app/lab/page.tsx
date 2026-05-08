"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SCENARIOS,
  Scenario,
  Difficulty,
  DIFFICULTY_LABELS,
  DOMAIN_LABELS,
  getScenariosByDifficulty,
} from "./scenarios";

const PROGRESS_KEY = "grc-drift-lab-progress-v1";
const HARD_UNLOCK_THRESHOLD = 7;
const HARD_UNLOCK_REQUIRED_COUNT = 2;

type ProgressMap = Record<string, { score: number; completedAt: string }>;

function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function isHardUnlocked(progress: ProgressMap): boolean {
  const qualifying = Object.entries(progress).filter(([id, data]) => {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (!scenario) return false;
    if (scenario.difficulty !== "easy" && scenario.difficulty !== "moderate") return false;
    return data.score >= HARD_UNLOCK_THRESHOLD;
  });
  return qualifying.length >= HARD_UNLOCK_REQUIRED_COUNT;
}

function ScenarioCard({
  scenario,
  isLocked,
  progress,
}: {
  scenario: Scenario;
  isLocked: boolean;
  progress: ProgressMap;
}) {
  const hasProgress = progress[scenario.id];
  const isAvailable = scenario.status === "available" && !isLocked;
  const isComingSoon = scenario.status === "coming-soon";

  const baseClasses =
    "block rounded-lg border p-5 transition relative h-full";

  let classes = baseClasses;
  if (isAvailable) {
    classes += " border-white/10 hover:border-[#7f77dd]/60 hover:bg-white/[0.02] cursor-pointer";
  } else if (isLocked) {
    classes += " border-white/5 opacity-50 cursor-not-allowed";
  } else {
    classes += " border-white/5 opacity-60 cursor-not-allowed";
  }

  const inner = (
    <>
      {/* Top row: domain + status indicator */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.18em] text-[#7f77dd] uppercase font-medium">
          {DOMAIN_LABELS[scenario.domain]}
        </span>
        <div className="flex items-center gap-2">
          {scenario.isRealWorld && isAvailable && (
            <span className="text-[9px] tracking-[0.15em] text-[#C97070] uppercase flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A04545]"></span>
              Real-world
            </span>
          )}
          {hasProgress && isAvailable && (
            <span className="text-[9px] tracking-[0.15em] text-[#afa9ec] uppercase">
              {hasProgress.score}/10
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

      {/* Title */}
      <h3 className="text-base font-semibold text-white mb-2 leading-snug">
        {scenario.title}
      </h3>

      {/* Short prompt */}
      <p className="text-[13px] text-white/55 leading-relaxed mb-4">
        {scenario.shortPrompt}
      </p>

      {/* Footer action */}
      <div className="text-[11px] tracking-wide">
        {isAvailable && (
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
      <Link href={`/lab/${scenario.id}`} className={classes}>
        {inner}
      </Link>
    );
  }
  return <div className={classes}>{inner}</div>;
}

function DifficultySection({
  difficulty,
  isLocked,
  progress,
}: {
  difficulty: Difficulty;
  isLocked: boolean;
  progress: ProgressMap;
}) {
  const scenarios = getScenariosByDifficulty(difficulty);

  return (
    <section className="mb-14">
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-white/10">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-white">
            {DIFFICULTY_LABELS[difficulty]}
          </h2>
          {isLocked && (
            <span className="text-[10px] tracking-[0.2em] text-[#C97070] uppercase">
              · Locked
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-[0.2em] text-white/35 uppercase">
          {scenarios.filter((s) => s.status === "available").length} of {scenarios.length} live
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {scenarios.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            isLocked={isLocked}
            progress={progress}
          />
        ))}
      </div>
    </section>
  );
}

export default function LabPage() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [hardUnlocked, setHardUnlocked] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setHardUnlocked(isHardUnlocked(p));
  }, []);

  const completedCount = Object.keys(progress).length;
  const qualifyingCount = Object.entries(progress).filter(([id, data]) => {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (!scenario) return false;
    if (scenario.difficulty !== "easy" && scenario.difficulty !== "moderate") return false;
    return data.score >= HARD_UNLOCK_THRESHOLD;
  }).length;

  return (
    <article className="px-4 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
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

      {/* Progress strip */}
      <div className="mb-12 p-5 rounded-lg border border-white/10 bg-white/[0.015]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#afa9ec] uppercase mb-1">
              Your progress
            </p>
            <p className="text-sm text-white/70">
              {completedCount === 0
                ? "No scenarios completed yet. Start with Easy."
                : `${completedCount} scenario${completedCount === 1 ? "" : "s"} completed`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] text-[#afa9ec] uppercase mb-1">
              Hard tier
            </p>
            <p className={`text-sm ${hardUnlocked ? "text-white" : "text-white/50"}`}>
              {hardUnlocked ? "✓ Unlocked" : `${qualifyingCount}/${HARD_UNLOCK_REQUIRED_COUNT} scenarios scored 7+`}
            </p>
          </div>
        </div>
      </div>

      {/* Difficulty sections */}
      <DifficultySection difficulty="easy" isLocked={false} progress={progress} />
      <DifficultySection difficulty="moderate" isLocked={false} progress={progress} />
      <DifficultySection difficulty="hard" isLocked={!hardUnlocked} progress={progress} />

      {/* Footer note */}
      <div className="border-t border-white/10 pt-8 mt-10 text-center">
        <p className="text-[12px] text-white/40 leading-relaxed max-w-xl mx-auto">
          Need a refresher on the model first?{" "}
          <Link href="/drift-model" className="text-[#afa9ec] hover:text-white transition underline-offset-2 hover:underline">
            Read the Drift Model
          </Link>
          .
        </p>
      </div>
    </article>
  );
}