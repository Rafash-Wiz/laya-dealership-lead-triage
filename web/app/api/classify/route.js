import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

// Neutral option keys reduce answer bias; the model decides purchase readiness.
const question = {
  category: {
    type: "choice",
    instructions:
      "Classify a vehicle shopper's purchase readiness from their explicit timeline and concrete buying actions. Choose A for a purchase or test-drive plan within 7 days, B for a qualified purchase plan within 8 to 30 days, or C for early research or a plan more than 30 days away. Use the stated timeline as the strongest signal.",
    criteria: {
      A: "Ready to purchase or book a test drive now or within 7 days.",
      B: "Qualified vehicle shopper planning to purchase in 8 to 30 days.",
      C: "Early research or purchase planned more than 30 days away.",
    },
  },
};

const actions = {
  hot: { title: "Call within 5 minutes", tone: "urgent" },
  active: { title: "Respond today", tone: "today" },
  nurture: { title: "Schedule a follow-up", tone: "later" },
  needs_review: { title: "Review before routing", tone: "review" },
};

const modelBuckets = { A: "hot", B: "active", C: "nurture" };

function applySalesPolicy(lead, modelCategory) {
  const hasContact = Boolean(lead.email?.trim() || lead.phone?.trim());
  if (lead.isSpam || lead.isDuplicate || lead.leadType === "service" || !hasContact) {
    return { category: "needs_review", guardrailApplied: true, policyReason: "Needs a person to verify or route" };
  }

  if (!Number.isFinite(lead.timelineDays) || lead.timelineDays < 0 || !lead.vehicle || lead.vehicle === "Not specified") {
    return { category: "needs_review", guardrailApplied: true, policyReason: "Purchase timing or vehicle is unclear" };
  }

  const category = lead.timelineDays <= 7 ? "hot" : lead.timelineDays <= 30 ? "active" : "nurture";
  return {
    category,
    guardrailApplied: category !== modelCategory,
    policyReason: `Explicit purchase timeline: ${lead.timelineDays} days`,
  };
}

async function classifyLead(lead) {
  const baseUrl = process.env.LAYA_API_URL || "http://127.0.0.1:8000";
  const headers = { "Content-Type": "application/json" };
  if (process.env.LAYA_API_KEY) headers.Authorization = `Bearer ${process.env.LAYA_API_KEY}`;

  const response = await fetch(`${baseUrl}/v1/systemone`, {
    method: "POST",
    headers,
    body: JSON.stringify({ state: lead, questions: question, model: "typed-decisions" }),
    signal: AbortSignal.timeout(90_000),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Laya returned ${response.status}: ${detail.slice(0, 300)}`);
  }

  const result = await response.json();
  const answer = result?.answers?.category;
  const modelCategory = modelBuckets[answer?.choice];
  if (!modelCategory) throw new Error(`Laya returned an unknown category for lead ${lead.id}`);
  const policy = applySalesPolicy(lead, modelCategory);

  return {
    ...lead,
    ...policy,
    modelCategory,
    confidence: answer.answer_confidence ?? answer.confidence ?? null,
    probabilities: answer.probabilities ?? {},
    routing: result.routing?.model ?? "english",
    action: actions[policy.category],
  };
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!Array.isArray(payload?.leads) || payload.leads.length === 0 || payload.leads.length > 50) {
    return NextResponse.json({ error: "Send between 1 and 50 leads." }, { status: 400 });
  }

  const results = new Array(payload.leads.length);
  let cursor = 0;
  let failure = null;
  const worker = async () => {
    while (!failure) {
      const index = cursor++;
      if (index >= payload.leads.length) return;
      try {
        results[index] = await classifyLead(payload.leads[index]);
      } catch (error) {
        failure = error;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(3, payload.leads.length) }, worker));

  if (failure) {
    return NextResponse.json({ error: `Classification stopped: ${failure.message}` }, { status: 502 });
  }
  return NextResponse.json({ leads: results, count: results.length });
}
