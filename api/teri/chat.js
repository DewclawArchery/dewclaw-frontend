// pages/api/teri/chat.js

import {
  logTeriEvent,
  inferIntent,
  inferPolicyFlags
} from "../../lib/teri/logging";


const XAI_BASE_URL = "https://api.x.ai/v1";
const DEFAULT_MODEL = "grok-4";

function redactPII(text = "") {
  // Redact common email + phone patterns (lightweight safety net)
  const emailRedacted = text.replace(
    /([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})/gi,
    "[email redacted]"
  );
  const phoneRedacted = emailRedacted.replace(
    /(\+?\d{1,2}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g,
    "[phone redacted]"
  );
  return phoneRedacted;
}

function buildSystemPrompt({ pageContext, opsLinks }) {
  const pageBits = [];
  if (pageContext?.path) pageBits.push(`Page path: ${pageContext.path}`);
  if (pageContext?.title) pageBits.push(`Page title: ${pageContext.title}`);
  if (Array.isArray(pageContext?.headings) && pageContext.headings.length) {
    pageBits.push(`Headings: ${pageContext.headings.join(" | ")}`);
  }

  return `
You are T.E.R.I. (Technical Equipment Recommendation Intelligence), Dewclaw Archery’s site-wide “pro shop staff” assistant.

VOICE & TONE
- Friendly, knowledgeable pro-shop staff.
- Confident, never pushy. Recommendation-driven (“Here’s what I’d run…”).
- Prioritize safety, fit, and customer experience over upselling.

PHASE 1 SCOPE
- Help customers decide what to book/order and where to go next.
- You can answer questions about TechnoHunt sessions, custom arrows/components, leagues/events, store policies/hours/general info.
- You do NOT execute payments or create/modify bookings/orders.

GUARDRAILS (CRITICAL)
- Do NOT fabricate prices, availability, inventory, or guarantees.
- If you cannot verify something, say so clearly.
- Offer best-practice guidance + direct them to confirm on booking/order pages or contact staff.
- Do NOT ask for or collect PII (no email/phone/order IDs). If a user provides it, ignore it and continue.
- No admin actions. No internal ops notes. No secrets.

TECHNOHUNT ROOM POLICY (HARD RULE)
- Do NOT suggest rental gear or imply “no equipment needed” for TechnoHunt.
- Do NOT imply Dewclaw provides bows, arrows, or rental equipment in the TechnoHunt room.
- Assume TechnoHunt shooters bring their own equipment unless staff explicitly confirms otherwise.
- If a user is new or does not own equipment, recommend stopping by or calling the pro shop first so staff can help them get set up safely before booking TechnoHunt.
- Never route a brand-new shooter directly into TechnoHunt as a gear-free experience.

ARROW RECOMMENDATION RULES (CRITICAL)
- Do NOT give an exact spine recommendation unless the key variables are known:
  (1) bow type (compound/trad), (2) draw weight, (3) draw length, (4) FINAL arrow cut length (carbon-to-carbon),
  (5) intended point/broadhead weight, and (6) notable insert/outsert weight (if heavy).
- If any key variable is missing: ask 1–2 clarifying questions and give only a cautious starting range, NOT a final answer.
- Avoid absolute claims like “X is always more forgiving.” Say: “Best match tunes easiest; too weak or too stiff can both tune poorly.”
- Default to manufacturer guidance when appropriate: Easton Arrow Selector / Easton shaft selection resources are preferred references.

ARROW SPINE LOGIC (HARD RULES — DO NOT CONTRADICT)
- Longer arrow length => WEAKER dynamic spine => typically requires STIFFER static spine (lower number).
- Heavier point/insert/outsert => WEAKER dynamic spine => typically requires STIFFER static spine (lower number).
- More aggressive/faster cam systems => often require STIFFER spine than mild cams at the same draw weight.
- When in doubt between two valid options, recommend confirming with a spine chart/selector (Easton) or Dewclaw staff.

DEFAULT BREVITY (IMPORTANT)
- Default responses should be brief and fast: ~4–8 lines total.
- Use bullets only when they add clarity.
- Ask 1–2 clarifying questions instead of writing long explanations.
- Go deeper only if the user asks.

RESPONSE STRUCTURE (DEFAULT)
1) Direct answer first (1–2 short sentences).
2) Then 2–4 bullets (only if helpful).
3) Ask 1–2 clarifying questions if required to be accurate.
4) If relevant, include “Next steps” with links (booking / arrow orders / leagues).

PAGE CONTEXT
${pageBits.length ? pageBits.join("\n") : "No page context provided."}

OFFICIAL NEXT-STEP LINKS (use these when routing)
- Booking Calendar: ${opsLinks.booking}
- Arrow Orders: ${opsLinks.orders}
- Leagues: ${opsLinks.leagues}

Always follow guardrails. If asked for exact pricing or exact availability, instruct the user to confirm on the relevant page.
`.trim();
}

function getOpsLinksFromEnv() {
  // Fall back to canonical public URLs if env vars aren't set
  return {
    booking: process.env.OPS_BOOKINGS_URL || "https://book.dewclawarchery.com",
    orders: process.env.OPS_ORDERS_URL || "https://orders.dewclawarchery.com",
    leagues: process.env.OPS_LEAGUES_URL || "https://leagues.dewclawarchery.com"
  };
}

function buildActions(lastUserText, opsLinks) {
  const t = (lastUserText || "").toLowerCase();
  const actions = [];

  if (/book|booking|calendar|technohunt|session|availability|openings/.test(t)) {
    actions.push({ label: "Booking Calendar", url: opsLinks.booking });
  }
  if (/arrow|arrows|shaft|spine|wrap|point|insert|vane|fletch/.test(t)) {
    actions.push({ label: "Arrow Orders", url: opsLinks.orders });
  }
  if (/league|leagues|event|events|tournament/.test(t)) {
    actions.push({ label: "Leagues", url: opsLinks.leagues });
  }

  // Keep it compact
  return actions.slice(0, 3);
}

function buildArrowGroundingSystemMessage() {
  // Keep this short + unambiguous. This is a “non-negotiable” anchor for arrow logic.
  return `
EASTON REFERENCE (PRIMARY SUPPLIER)
- Prefer Easton Arrow Selector / Easton shaft selection guidance when sanity-checking spine.
- If the user wants a reference link, you may share:
  Easton Arrow Selector: https://eastonarchery.com/selector/
- Do NOT paste full charts. Use them as a reference and ask for missing variables.

ARROW SPINE RULES (NON-NEGOTIABLE)
- Longer arrow = weaker dynamic => needs stiffer static spine (lower number).
- Heavier point/insert = weaker dynamic => needs stiffer static spine (lower number).
- Do not claim “weaker is more forgiving.” The best match tunes easiest; too weak or too stiff can both tune poorly.
- If key variables are missing, ask 1–2 questions (bow type, draw weight, cut length, point weight).
`.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      message: "Server is missing XAI_API_KEY. Set it in environment variables."
    });
  }

  const model = process.env.XAI_MODEL || DEFAULT_MODEL;
  const opsLinks = getOpsLinksFromEnv();

  const body = req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const pageContext = body.pageContext || {};

  // Last user message (for actions + intent)
  const lastUser = [...messages].reverse().find((m) => m?.role === "user");
  const lastUserTextRaw = lastUser?.content || "";
  const lastUserText = redactPII(lastUserTextRaw);

  // Infer intent early (used to decide whether to add arrow grounding)
  const intent = inferIntent({ lastUserText, pageContext });
  const actions = buildActions(lastUserText, opsLinks);

  // Clean history: only user/assistant, no PII, keep it short for speed
  const cleanedHistory = messages
    .filter(
      (m) =>
        m &&
        typeof m.content === "string" &&
        (m.role === "user" || m.role === "assistant")
    )
    .slice(-16)
    .map((m) => ({
      role: m.role,
      content: redactPII(m.content)
    }));

  const systemPrompt = buildSystemPrompt({ pageContext, opsLinks });

  const finalMessages = [
    { role: "system", content: systemPrompt },
    ...(intent && intent.startsWith("arrows_")
      ? [{ role: "system", content: buildArrowGroundingSystemMessage() }]
      : []),
    ...cleanedHistory
  ];

  // Request log (no raw content)
  logTeriEvent({
    type: "request",
    page: pageContext?.path || null,
    intent,
    hasHistory: cleanedHistory.length > 1,
    useModel: model
  });

  // Measure end-to-end model call latency
  const t0 = Date.now();

  try {
    const r = await fetch(`${XAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: finalMessages,
        // Slightly lower temp for fewer “creative” technical claims
        temperature: 0.3,
        // Lower max tokens to keep responses snappy by default
        max_tokens: 450
      })
    });

    const latency_ms = Date.now() - t0;

    if (!r.ok) {
      const debugText = await r.text();

      logTeriEvent({
        type: "response",
        page: pageContext?.path || null,
        intent,
        actions: [],
        ok: false,
        error: "xai_non_200",
        latency_ms,
        response_length: 0,
        policy_flags: inferPolicyFlags({ intent, lastUserText, assistantText: "" })
      });

      return res.status(502).json({
        message:
          "T.E.R.I. couldn’t reach the brain right now. Tap Retry below or try again in a moment.",
        debug: process.env.NODE_ENV === "development" ? debugText : undefined
      });
    }

    const data = await r.json();
    const content =
      data?.choices?.[0]?.message?.content ||
      "I’m here—what are you looking to do today: book a TechnoHunt session, build arrows, or check leagues?";

    const response_length = typeof content === "string" ? content.length : 0;
    const policy_flags = inferPolicyFlags({ intent, lastUserText, assistantText: content });

    logTeriEvent({
      type: "response",
      page: pageContext?.path || null,
      intent,
      actions: actions.map((a) => a.label),
      ok: true,
      latency_ms,
      response_length,
      policy_flags
    });

    return res.status(200).json({
      message: content,
      actions: actions.length ? actions : undefined
    });
  } catch {
    const latency_ms = Date.now() - t0;

    logTeriEvent({
      type: "response",
      page: pageContext?.path || null,
      intent,
      actions: [],
      ok: false,
      error: "xai_fetch_failed",
      latency_ms,
      response_length: 0,
      policy_flags: inferPolicyFlags({ intent, lastUserText, assistantText: "" })
    });

    return res.status(502).json({
      message:
        "T.E.R.I. couldn’t connect just now. Tap Retry below or try again in a moment."
    });
  }
}
