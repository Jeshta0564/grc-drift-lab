import { NextRequest, NextResponse } from "next/server";
import { getScenario, STAGE_NAMES, StageId } from "@/app/lab/scenarios";

// Allow up to 60 seconds for the model to respond
export const maxDuration = 60;

type RequestBody = {
  scenarioId: string;
  stage1: StageId;
  justification1: string;
  stage2: StageId;
  justification2: string;
};

type AiFeedback = {
  score: number;                  // 0-10
  stage1Correct: boolean;
  stage1Comment: string;          // 1-2 sentences
  stage2Correct: boolean;
  stage2Comment: string;
  whatYouGotRight: string[];      // bullet points
  whatYouMissed: string[];        // bullet points
  seniorFraming: string;          // 2-3 sentences
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { scenarioId, stage1, justification1, stage2, justification2 } = body;

  // Validate
  if (!scenarioId || !stage1 || !stage2 || !justification1?.trim() || !justification2?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (stage1 === stage2) {
    return NextResponse.json({ error: "Stages must be different" }, { status: 400 });
  }

  const scenario = getScenario(scenarioId);
  if (!scenario || scenario.status !== "available" || !scenario.modelAnswer) {
    return NextResponse.json({ error: "Scenario not available" }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  // Build the rubric prompt
  const acceptablePairsText = scenario.modelAnswer.acceptablePairs
    .map(
      (pair) =>
        `${pair.map((s) => `Stage ${s} (${STAGE_NAMES[s]})`).join(" + ")}`
    )
    .join(" OR ");

  const systemPrompt = `You are a senior GRC practitioner reviewing a student's analysis of a scenario from the Drift Model framework.

The Drift Model has six stages:
1. Intent - What the framework or organisation says it wants to achieve.
2. Control - The specific rule, procedure, or mechanism written to satisfy intent.
3. Implementation - How the control is configured/deployed on day one.
4. Reality - What is actually happening in the operational environment now.
5. Audit - What auditors/leadership see and conclude when they check.
6. Drift - The cumulative gap between Reality and Intent over time.

Your job is to score the student's answer strictly out of 10:
- 2 points for picking a correct Stage 1
- 3 points for the quality of Stage 1 justification (depth, accuracy, framework grounding)
- 2 points for picking a correct Stage 2
- 3 points for the quality of Stage 2 justification

CRITICAL RULES:
- If the stage is wrong, award 0 for both that stage's correctness AND its justification (you cannot justify a wrong diagnosis).
- Justification quality is judged ONLY when the stage is correct.
- Acceptable correct stage pairs for this scenario: ${acceptablePairsText}
- Note: the student's answer counts as "correct stages" if their two picked stages match ANY of the acceptable pairs (order does not matter).

Tone: peer-review style. You are constructively critical, like a senior auditor reviewing a junior's report. Specific, not generic. No flattery, no padding.

Return ONLY valid JSON matching this exact shape (no markdown, no preamble):
{
  "score": <number 0-10>,
  "stage1Correct": <boolean>,
  "stage1Comment": "<1-2 sentences>",
  "stage2Correct": <boolean>,
  "stage2Comment": "<1-2 sentences>",
  "whatYouGotRight": ["<bullet>", "<bullet>"],
  "whatYouMissed": ["<bullet>", "<bullet>"],
  "seniorFraming": "<2-3 sentences showing how a senior practitioner would have framed the answer>"
}

If the student picked both stages correctly, "whatYouMissed" can still note nuances they could have explored.
If they picked wrong stages, "whatYouMissed" should explain what the right stages were and why.`;

  const userPrompt = `SCENARIO:
${scenario.situation}

TASK: ${scenario.task}

MODEL ANSWER REASONING (for your reference, do not reveal directly):
${scenario.modelAnswer.reasoning}

STUDENT ANSWER:
- Stage 1 picked: Stage ${stage1} (${STAGE_NAMES[stage1 as StageId]})
- Stage 1 justification: "${justification1.trim()}"
- Stage 2 picked: Stage ${stage2} (${STAGE_NAMES[stage2 as StageId]})
- Stage 2 justification: "${justification2.trim()}"

Score this answer per the rules. Return JSON only.`;

  // Call Anthropic API
  let modelResponse: Response;
  try {
    modelResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
  } catch (err) {
    console.error("Anthropic fetch failed:", err);
    return NextResponse.json(
      { error: "Could not reach the model API" },
      { status: 502 }
    );
  }

  if (!modelResponse.ok) {
    const errText = await modelResponse.text().catch(() => "");
    console.error("Anthropic API error:", modelResponse.status, errText);
    return NextResponse.json(
      { error: "Model API returned an error" },
      { status: 502 }
    );
  }

  const data = await modelResponse.json();
  const text: string = data?.content?.[0]?.text ?? "";

  // Strip any potential markdown fences and parse JSON
  const cleaned = text.replace(/```json\s*/i, "").replace(/```\s*$/i, "").trim();
  let feedback: AiFeedback;
  try {
    feedback = JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse model JSON:", cleaned);
    return NextResponse.json(
      { error: "Model returned an unparseable response" },
      { status: 502 }
    );
  }

  // Sanity-clamp the score
  if (typeof feedback.score !== "number" || feedback.score < 0 || feedback.score > 10) {
    feedback.score = Math.max(0, Math.min(10, Math.round(feedback.score ?? 0)));
  }

  return NextResponse.json(feedback);
}