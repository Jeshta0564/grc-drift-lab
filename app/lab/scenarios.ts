// Single source of truth for all Lab scenarios.
// Add scenarios incrementally - the UI auto-renders based on this data.

export type Difficulty = "easy" | "moderate" | "hard";
export type Domain = "finance" | "healthcare" | "education" | "industrial";
export type StageId = 1 | 2 | 3 | 4 | 5 | 6;

export type ScenarioStatus = "available" | "coming-soon";

export type Scenario = {
  id: string;                  // url slug, e.g. "northbridge-access-review"
  title: string;
  domain: Domain;
  difficulty: Difficulty;
  status: ScenarioStatus;
  isRealWorld: boolean;        // shows "Real-world incident" badge
  shortPrompt: string;         // 1-line on the index card
  // Only present if status === "available"
  situation?: string;          // the full prose situation
  task?: string;               // the question
  // Model answer used by AI rubric. Hidden from user.
  // Each correct stage pair represents an acceptable answer.
  modelAnswer?: {
    acceptablePairs: StageId[][]; // e.g. [[4, 5], [4, 3]] = either Reality+Audit or Reality+Implementation OK
    reasoning: string;            // freeform explanation for the AI rubric
  };
};

// Stage names for dropdowns (also exported for AI rubric prompts)
export const STAGE_NAMES: Record<StageId, string> = {
  1: "Intent",
  2: "Control",
  3: "Implementation",
  4: "Reality",
  5: "Audit",
  6: "Drift",
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  finance: "Finance",
  healthcare: "Healthcare",
  education: "Education",
  industrial: "Industrial",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

export const SCENARIOS: Scenario[] = [
  // ============ EASY TIER ============
  {
    id: "northbridge-access-review",
    title: "The Quarterly Access Review",
    domain: "finance",
    difficulty: "easy",
    status: "available",
    isRealWorld: false,
    shortPrompt:
      "An Australian fintech's quarterly privileged-access review looks complete on paper. The reality is different.",
    situation: `Northbridge Capital is a 180-person Australian fintech offering buy-now-pay-later services. Their information security policy states that "all privileged user accounts must be reviewed quarterly by the system owner, with the review documented in the access register." The control was written in 2021 and approved by the Risk Committee.

When the policy was implemented, the IT team set up calendar reminders, created a shared SharePoint review template, and trained the original three system owners. The first three quarterly reviews ran cleanly. However, in 2023, two of the original system owners left and were replaced. The new owners were never trained on the access-review process. Calendar reminders kept firing, but the new owners marked them as "done" without performing the review. The SharePoint register shows a complete and signed-off audit trail for every quarter.

An external auditor sampled three quarters of access reviews in 2024 and confirmed all were "completed and documented." Six months later, an internal incident revealed that a former contractor had retained privileged database access for fourteen months after their contract ended.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[4, 5]],
      reasoning: `The strongest reading is Stage 4 (Reality) and Stage 5 (Audit).

Stage 4 (Reality) - The control was implemented correctly in 2021 with templates, training, and calendar reminders. Reality drifted as personnel changed: new system owners marked reviews as "done" without performing them. Operational reality silently diverged from documented implementation. This is textbook Stage 4 drift driven by personnel change.

Stage 5 (Audit) - The external auditor sampled the access reviews and confirmed they were "completed and documented" based on the SharePoint register. The auditor confirmed the paper trail rather than the operational truth - exactly what Stage 5 drift looks like.

Stage 1 (Intent) is NOT a strong answer here - the intent was reasonable. Stage 2 (Control) is NOT a strong answer - the control was well-designed. Stage 3 (Implementation) is NOT a strong answer - the implementation worked correctly at first.`,
    },
  },
  {
    id: "medibank-mfa",
    title: "Medibank — The MFA That Wasn't",
    domain: "healthcare",
    difficulty: "easy",
    status: "available",
    isRealWorld: true,
    shortPrompt:
      "Australia's largest health insurer had MFA on paper. Two prior audits flagged the gap. Then the breach happened.",
    situation: `Medibank is Australia's largest private health insurer, holding sensitive medical records on millions of Australians. As a regulated entity, multi-factor authentication (MFA) on privileged access was both a documented internal requirement and a baseline industry expectation.

Two prior security reviews had flagged this exact gap. In mid-2020, a Datacom report identified MFA absence as a "critical defect." In August 2021, KPMG repeated the warning in its assessment. In both cases, leadership documented the finding and implementation plans were drafted.

In August 2022, an attacker obtained credentials belonging to an IT service desk contractor whose personal laptop was compromised. They used those credentials to log in to Medibank's Global Protect VPN — which did not enforce MFA. Endpoint detection alerts on 24 and 25 August 2022 flagged anomalous activity but were not triaged or escalated. Over the next six weeks, the attacker exfiltrated approximately 520 GB of customer data including health records.`,
    task: "Identify two stages of the Drift Model where this scenario shows clear drift, and justify each.",
    modelAnswer: {
      acceptablePairs: [[4, 5], [3, 4], [4, 3]],
      reasoning: `Two readings are acceptable for this scenario.

Reading 1 (most common): Stage 4 (Reality) + Stage 5 (Audit).
- Stage 4 - MFA was a documented requirement but not enforced on the VPN. Reality drifted from documented implementation. EDR alerts on 24-25 August were not triaged - reality diverging from operational expectations.
- Stage 5 - Two independent audit reviews flagged the gap (Datacom 2020, KPMG 2021), but findings did not translate to corrective action. The audit cycle confirmed the issue; the operational cycle didn't close it.

Reading 2 (also strong): Stage 3 (Implementation) + Stage 4 (Reality).
- Stage 3 - The implementation of MFA fell short of the control design from inception. The Global Protect VPN was excluded from MFA enforcement; this is a Day-One implementation gap, not later drift.
- Stage 4 - Plus operational reality drift in alert triage.

Either reading is acceptable. Stages 1, 2, and 6 are NOT strong answers - the intent was clear, the control was well-defined, and Drift (Stage 6) is the cumulative phenomenon, not a specific gap point in this scenario.`,
    },
  },

  // ============ COMING SOON STUBS ============
  // Easy tier - remaining
  {
    id: "easy-education-stub",
    title: "Coming soon",
    domain: "education",
    difficulty: "easy",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An education-sector scenario is being prepared.",
  },
  {
    id: "easy-industrial-stub",
    title: "Coming soon",
    domain: "industrial",
    difficulty: "easy",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An industrial-sector scenario is being prepared.",
  },
  // Moderate tier - all stubs
  {
    id: "moderate-finance-stub",
    title: "Coming soon",
    domain: "finance",
    difficulty: "moderate",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "A finance-sector scenario is being prepared.",
  },
  {
    id: "moderate-healthcare-stub",
    title: "Coming soon",
    domain: "healthcare",
    difficulty: "moderate",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "A healthcare-sector scenario is being prepared.",
  },
  {
    id: "moderate-education-stub",
    title: "Coming soon",
    domain: "education",
    difficulty: "moderate",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An education-sector scenario is being prepared.",
  },
  {
    id: "moderate-industrial-stub",
    title: "Coming soon",
    domain: "industrial",
    difficulty: "moderate",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An industrial-sector scenario is being prepared.",
  },
  // Hard tier - all stubs
  {
    id: "hard-finance-stub",
    title: "Coming soon",
    domain: "finance",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "A finance-sector scenario is being prepared.",
  },
  {
    id: "hard-healthcare-stub",
    title: "Coming soon",
    domain: "healthcare",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "A healthcare-sector scenario is being prepared.",
  },
  {
    id: "hard-education-stub",
    title: "Coming soon",
    domain: "education",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An education-sector scenario is being prepared.",
  },
  {
    id: "hard-industrial-stub",
    title: "Coming soon",
    domain: "industrial",
    difficulty: "hard",
    status: "coming-soon",
    isRealWorld: false,
    shortPrompt: "An industrial-sector scenario is being prepared.",
  },
];

// Helper: get scenarios filtered by difficulty
export function getScenariosByDifficulty(difficulty: Difficulty): Scenario[] {
  return SCENARIOS.filter((s) => s.difficulty === difficulty);
}

// Helper: get a single scenario by id
export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}