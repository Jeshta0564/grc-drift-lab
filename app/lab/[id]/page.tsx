"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getScenario,
  STAGE_NAMES,
  StageId,
  DOMAIN_LABELS,
  DIFFICULTY_LABELS,
  Scenario,
} from "../scenarios";

const PROGRESS_KEY = "grc-drift-lab-progress-v1";
type ProgressMap = Record<string, { score: number; completedAt: string }>;

type AiFeedback = {
  score: number;
  stage1Correct: boolean;
  stage1Comment: string;
  stage2Correct: boolean;
  stage2Comment: string;
  whatYouGotRight: string[];
  whatYouMissed: string[];
  seniorFraming: string;
};

const STAGE_OPTIONS: StageId[] = [1, 2, 3, 4, 5, 6];

function saveProgress(scenarioId: string, score: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const map: ProgressMap = raw ? JSON.parse(raw) : {};
    const existing = map[scenarioId];
    // Only update if new score is higher (best score wins)
    if (!existing || score > existing.score) {
      map[scenarioId] = { score, completedAt: new Date().toISOString() };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    }
  } catch (err) {
    console.error("Could not save progress:", err);
  }
}

function StagePicker({
  label,
  value,
  onChange,
  excludedStage,
}: {
  label: string;
  value: StageId | null;
  onChange: (s: StageId) => void;
  excludedStage: StageId | null;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase text-[#afa9ec] mb-2 font-medium">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value) as StageId)}
        className="w-full bg-[#0d0d18] border border-white/15 rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#7f77dd]/60 transition cursor-pointer"
      >
        <option value="" disabled>
          Choose a stage…
        </option>
        {STAGE_OPTIONS.filter((s) => s !== excludedStage).map((s) => (
          <option key={s} value={s} className="bg-[#0d0d18]">
            Stage {s} — {STAGE_NAMES[s]}
          </option>
        ))}
      </select>
    </div>
  );
}

function FeedbackPanel({
  feedback,
  scenario,
  onTryAgain,
}: {
  feedback: AiFeedback;
  scenario: Scenario;
  onTryAgain: () => void;
}) {
  const scoreColor =
    feedback.score >= 7 ? "#afa9ec" : feedback.score >= 4 ? "#C97070" : "#A04545";

  return (
    <div className="mt-8 rounded-xl border border-white/10 overflow-hidden">
      {/* Score header */}
      <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-white/45 uppercase mb-1">
            Your score
          </p>
          <p className="text-3xl font-semibold" style={{ color: scoreColor }}>
            {feedback.score}<span className="text-white/40 text-xl"> / 10</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-[0.2em] text-white/45 uppercase mb-1">
            Hard tier
          </p>
          <p className="text-sm text-white/70">
            {feedback.score >= 7 ? "✓ Counts toward unlock" : "Need 7+ to count"}
          </p>
        </div>
      </div>

      <div className="p-6 md:p-7 space-y-6">
        {/* Per-stage breakdown */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] tracking-[0.18em] uppercase font-semibold"
                style={{ color: feedback.stage1Correct ? "#afa9ec" : "#C97070" }}
              >
                Stage 1 · {feedback.stage1Correct ? "Correct" : "Incorrect"}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {feedback.stage1Comment}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] tracking-[0.18em] uppercase font-semibold"
                style={{ color: feedback.stage2Correct ? "#afa9ec" : "#C97070" }}
              >
                Stage 2 · {feedback.stage2Correct ? "Correct" : "Incorrect"}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {feedback.stage2Comment}
            </p>
          </div>
        </div>

        {/* What you got right */}
        {feedback.whatYouGotRight && feedback.whatYouGotRight.length > 0 && (
          <div className="border-t border-white/10 pt-5">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#afa9ec] mb-2.5 font-semibold">
              What you got right
            </p>
            <ul className="space-y-1.5">
              {feedback.whatYouGotRight.map((point, i) => (
                <li key={i} className="text-sm text-white/70 leading-relaxed pl-4 relative">
                  <span className="absolute left-0 top-2 w-1 h-1 rounded-full bg-[#afa9ec]"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What you missed */}
        {feedback.whatYouMissed && feedback.whatYouMissed.length > 0 && (
          <div className="border-t border-white/10 pt-5">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#C97070] mb-2.5 font-semibold">
              What you missed
            </p>
            <ul className="space-y-1.5">
              {feedback.whatYouMissed.map((point, i) => (
                <li key={i} className="text-sm text-white/70 leading-relaxed pl-4 relative">
                  <span className="absolute left-0 top-2 w-1 h-1 rounded-full bg-[#A04545]"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Senior framing */}
        <div className="border-l-2 border-[#7f77dd]/60 pl-4 py-1">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#7f77dd] mb-2 font-semibold">
            How a senior practitioner would frame this
          </p>
          <p className="text-sm text-white/75 leading-relaxed italic">
            {feedback.seniorFraming}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onTryAgain}
            className="px-5 py-2.5 border border-white/20 text-white text-sm hover:bg-white/5 hover:border-white/40 transition rounded-md"
          >
            Try again
          </button>
          <Link
            href="/lab"
            className="px-5 py-2.5 bg-[#7f77dd] text-white text-sm hover:bg-[#afa9ec] transition rounded-md font-medium"
          >
            Back to Lab →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const scenario = getScenario(id);

  const [stage1, setStage1] = useState<StageId | null>(null);
  const [justification1, setJustification1] = useState("");
  const [stage2, setStage2] = useState<StageId | null>(null);
  const [justification2, setJustification2] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If scenario doesn't exist or isn't available, route back
    if (!scenario || scenario.status !== "available") {
      router.replace("/lab");
    }
  }, [scenario, router]);

  if (!scenario || scenario.status !== "available") {
    return (
      <article className="px-4 md:px-10 py-20 text-center max-w-2xl mx-auto">
        <p className="text-white/60">Redirecting…</p>
      </article>
    );
  }

  const canSubmit =
    stage1 !== null &&
    stage2 !== null &&
    stage1 !== stage2 &&
    justification1.trim().length >= 20 &&
    justification2.trim().length >= 20 &&
    !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch("/api/lab-feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario!.id,
          stage1,
          justification1,
          stage2,
          justification2,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setFeedback(data as AiFeedback);
      saveProgress(scenario!.id, data.score);

      // Scroll to feedback after a brief tick so it lands smoothly
      setTimeout(() => {
        document
          .getElementById("feedback-anchor")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleTryAgain() {
    setFeedback(null);
    setError(null);
    // Keep the user's previous answers so they can edit
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <article className="px-4 md:px-10 py-12 md:py-16 max-w-3xl mx-auto w-full">
      {/* Back link */}
      <Link
        href="/lab"
        className="inline-block text-xs tracking-wider text-white/50 hover:text-white transition mb-8"
      >
        ← Back to Lab
      </Link>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-[10px] tracking-[0.2em] text-[#7f77dd] uppercase font-medium">
          {DOMAIN_LABELS[scenario.domain]}
        </span>
        <span className="text-white/25">·</span>
        <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase">
          {DIFFICULTY_LABELS[scenario.difficulty]}
        </span>
        {scenario.isRealWorld && (
          <>
            <span className="text-white/25">·</span>
            <span className="text-[10px] tracking-[0.15em] text-[#C97070] uppercase flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A04545]"></span>
              Real-world incident
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8 leading-tight">
        {scenario.title}
      </h1>

      {/* Situation */}
      <div className="mb-10 space-y-4 text-[15px] text-white/75 leading-relaxed">
        {scenario.situation!.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Task */}
      <div className="mb-8 p-5 rounded-lg border border-[#7f77dd]/30 bg-[#7f77dd]/[0.04]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#afa9ec] mb-2 font-semibold">
          Your task
        </p>
        <p className="text-white/85 leading-relaxed">{scenario.task}</p>
      </div>

      {/* Input form */}
      <div className="space-y-6 mb-6">
        <div className="space-y-3">
          <StagePicker
            label="Stage 1"
            value={stage1}
            onChange={setStage1}
            excludedStage={stage2}
          />
          <textarea
            value={justification1}
            onChange={(e) => setJustification1(e.target.value)}
            placeholder="Why this stage? Reference what you read in the situation. (Min 20 characters)"
            rows={4}
            className="w-full bg-[#0d0d18] border border-white/15 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#7f77dd]/60 transition resize-y"
          />
        </div>
        <div className="space-y-3">
          <StagePicker
            label="Stage 2"
            value={stage2}
            onChange={setStage2}
            excludedStage={stage1}
          />
          <textarea
            value={justification2}
            onChange={(e) => setJustification2(e.target.value)}
            placeholder="Why this stage? Reference what you read in the situation. (Min 20 characters)"
            rows={4}
            className="w-full bg-[#0d0d18] border border-white/15 rounded-md px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#7f77dd]/60 transition resize-y"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-7 py-3 bg-[#7f77dd] text-white text-sm tracking-wide hover:bg-[#afa9ec] transition rounded-md font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Reviewing your answer…" : "Submit for review"}
        </button>
        {!canSubmit && !submitting && (
          <span className="text-[11px] text-white/35">
            Pick two different stages and write at least 20 characters for each.
          </span>
        )}
      </div>

      {error && (
        <div className="mt-5 p-4 rounded-md border border-[#A04545]/40 bg-[#A04545]/[0.06] text-sm text-[#D88B8B]">
          {error}
        </div>
      )}

      {/* Anchor for smooth scroll */}
      <div id="feedback-anchor" />

      {/* Feedback */}
      {feedback && (
        <FeedbackPanel
          feedback={feedback}
          scenario={scenario}
          onTryAgain={handleTryAgain}
        />
      )}
    </article>
  );
}