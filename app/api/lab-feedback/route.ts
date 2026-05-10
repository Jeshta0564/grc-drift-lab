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

  const systemPrompt = `You are a friendly but rigorous GRC tutor reviewing a student's analysis of a scenario from the Drift Model framework. Your audience is cybersecurity Masters students and early-career GRC professionals - calibrate your scoring to that level, not to senior consultant standards..

The Drift Model has six stages:
1. Intent - What the framework or organisation says it wants to achieve.
2. Control - The specific rule, procedure, or mechanism written to satisfy intent.
3. Implementation - How the control is configured/deployed on day one.
4. Reality - What is actually happening in the operational environment now.
5. Audit - What auditors/leadership see and conclude when they check.
6. Drift - The cumulative gap between Reality and Intent over time.

SCORING RUBRIC (out of 10):
- Stage 1 correctness: 2 points if their pick is in an acceptable pair, 0 if not
- Stage 1 justification quality: up to 3 points (see scale below)
- Stage 2 correctness: 2 points if their pick is in an acceptable pair, 0 if not
- Stage 2 justification quality: up to 3 points (see scale below)

JUSTIFICATION QUALITY SCALE (per stage, only if stage is correct):
- 3 points: References specific facts from the scenario AND clearly identifies WHY this counts as drift at this stage. Does not need to use perfect framework jargon - clear thinking matters more than vocabulary.
- 2 points: References scenario facts and shows the right intuition, but reasoning is incomplete or surface-level.
- 1 point: Picked the right stage but justification is vague, generic, or barely engages with the scenario.
- 0 points: No meaningful justification.

CRITICAL RULES:
- If the stage is wrong, award 0 for both correctness AND justification on that stage. You cannot justify a wrong diagnosis.
- Acceptable correct stage pairs for this scenario: ${acceptablePairsText}
- The student's answer counts as "correct" if their two picked stages match ANY acceptable pair (order does not matter).
- Be GENEROUS where the student shows correct thinking with adequate scenario references - the goal is to reward learning, not to gatekeep.
- Reserve sub-2 justification scores for genuinely weak answers (vague, off-topic, or barely engaging with the scenario), not for answers that simply lack senior-level polish.

Tone: warm but honest. Specific, not generic. Praise what worked, name what was missed clearly, and explain how to think about it better. Avoid both flattery and harshness.

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