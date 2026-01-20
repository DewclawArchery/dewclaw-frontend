// api/teri/chat.js

import { logTeriEvent, inferIntent, inferPolicyFlags } from "../../lib/teri/logging";

/**
 * Vercel AI Gateway (OpenAI-compatible)
 * Auth: API key (AI_GATEWAY_API_KEY)
 */
const AI_GATEWAY_CHAT_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";

// Tunables
const DEFAULT_MODEL = "grok-4";
const XAI_TIMEOUT_MS = Number(process.env.XAI_TIMEOUT_MS || 8000);
const XAI_FALLBACK_TIMEOUT_MS = Number(process.env.XAI_FALLBACK_TIMEOUT_MS || 5500);
const MAX_HISTORY_MESSAGES = Number(process.env.TERI_MAX_HISTORY || 10);
const MAX_TOKENS = Number(process.env.TERI_MAX_TOKENS || 320);

/* ===================== Utilities ===================== */

function redactPII(text = "") {
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

function normalizeGatewayModel(model) {
  if (!model) return "xai/grok-4";
  if (model.includes("/")) return model;
  return `xai/${model}`;
}

function isTransientStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

/* ===================== Prompts ===================== */

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
- Confident, never pushy.
- Safety and accuracy over confidence.

GUARDRAILS (CRITICAL)
- Do NOT fabricate prices, availability, or guarantees.
- Do NOT collect or request PII.
- No admin actions. No internal notes.

TECHNOHUNT (HARD RULE)
- Never imply rental gear is provided.
- Assume shooters bring their own equipment.

ARROW RULES (CRITICAL)
- Do not give exact spine without all variables.
- Longer arrow = weaker dynamic = stiffer static spine.
- Heavier point/insert = weaker dynamic = stiffer static spine.
- Prefer Easton Arrow Selector guidance.

DEFAULT BREVITY
- 4–8 lines.
- Ask 1–2 clarifying questions if needed.

PAGE CONTEXT
${pageBits.length ? pageBits.join("\n") : "No page context provided."}

NEXT STEPS
- Booking: ${opsLinks.booking}
- Arrow Orders: ${opsLinks.orders}
- Leagues: ${opsLinks.leagues}
`.trim();
}

function buildArrowGroundingSystemMessage() {
  return `
EASTON REFERENCE (PRIMARY)
- Use Easton Arrow Selector as authoritative reference.
- Do not paste charts.
- Ask for missing variables.

SPINE RULES (NON-NEGOTIABLE)
- Longer arrow = stiffer spine needed.
- Heavier point/insert = stiffer spine needed.
- Never claim “weaker is more forgiving.”
`.trim();
}

/* ===================== Ops / Actions ===================== */

function getOpsLinksFromEnv() {
  return {
    booking: process.env.OPS_BOOKINGS_URL || "https://book.dewclawarchery.com",
    orders: process.env.OPS_ORDERS_URL || "https://orders.dewclawarchery.com",
    leagues: process.env.OPS_LEAGUES_URL || "https://leagues.dewclawarchery.com"
  };
}

function buildActions(lastUserText, opsLinks) {
  const t = (lastUserText || "").toLowerCase();
  const actions = [];

  if (/book|booking|calendar|technohunt|session/.test(t)) {
    actions.push({ label: "Booking Calendar", url: opsLinks.booking });
  }
  if (/arrow|arrows|shaft|spine|insert|point|fletch/.test(t)) {
    actions.push({ label: "Arrow Orders", url: opsLinks.orders });
  }
  if (/league|event|tournament/.test(t)) {
    actions.push({ label: "Leagues", url: opsLinks.leagues });
  }

  return actions.slice(0, 3);
}

/* ===================== Gateway Call ===================== */

async function callGateway({ messages, model, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) {
      throw new Error("Missing AI_GATEWAY_API_KEY");
    }

    return await fetch(AI_GATEWAY_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: MAX_TOKENS
      }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

/* ===================== Handler ===================== */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const opsLinks = getOpsLinksFromEnv();
  const body = req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const pageContext = body.pageContext || {};

  const lastUser = [...messages].reverse().find((m) => m?.role === "user");
  const lastUserTextRaw = lastUser?.content || "";
  const lastUserText = redactPII(lastUserTextRaw);

  const intent = inferIntent({ lastUserText, pageContext });
  const actions = buildActions(lastUserText, opsLinks);

  const cleanedHistory = messages
    .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: redactPII(m.content) }));

  const finalMessages = [
    { role: "system", content: buildSystemPrompt({ pageContext, opsLinks }) },
    ...(intent?.startsWith("arrows_")
      ? [{ role: "system", content: buildArrowGroundingSystemMessage() }]
      : []),
    ...cleanedHistory
  ];

  const primaryModel = normalizeGatewayModel(process.env.XAI_MODEL || DEFAULT_MODEL);
  const fallbackModel = normalizeGatewayModel(
    process.env.XAI_FALLBACK_MODEL || "grok-4.1-fast-non-reasoning"
  );

  logTeriEvent({
    type: "request",
    page: pageContext?.path || null,
    intent,
    hasHistory: cleanedHistory.length > 1,
    useModel: primaryModel
  });

  const t0 = Date.now();

  try {
    let r = null;
    let usedModel = primaryModel;
    let firstAttemptBody = "";

    // Attempt 1
    try {
      r = await callGateway({
        messages: finalMessages,
        model: primaryModel,
        timeoutMs: XAI_TIMEOUT_MS
      });
    } catch (_) {
      r = null;
    }

    let shouldRetry = false;

    if (!r) {
      shouldRetry = true;
    } else if (!r.ok) {
      try {
        firstAttemptBody = await r.text();
      } catch (_) {}
      shouldRetry = isTransientStatus(r.status);
    }

    // Attempt 2 (fallback)
    if (shouldRetry) {
      usedModel = fallbackModel;
      r = await callGateway({
        messages: finalMessages,
        model: fallbackModel,
        timeoutMs: XAI_FALLBACK_TIMEOUT_MS
      });
    }

    const latency_ms = Date.now() - t0;

    if (!r || !r.ok) {
      let status = null;
      let statusText = null;
      let debugSnippet = "";

      if (r) {
        status = r.status;
        statusText = r.statusText;
        try {
          const t = firstAttemptBody || (await r.text());
          debugSnippet = (t || "").slice(0, 300);
        } catch (_) {}
      }

      logTeriEvent({
        type: "response",
        page: pageContext?.path || null,
        intent,
        actions: [],
        ok: false,
        error: r ? "xai_non_200" : "xai_fetch_failed",
        latency_ms,
        response_length: 0,
        policy_flags: inferPolicyFlags({ intent, lastUserText, assistantText: "" }),
        useModel: usedModel,
        status,
        statusText,
        debug: debugSnippet
      });

      return res.status(502).json({
        message:
          "T.E.R.I. couldn’t reach the brain right now. Tap Retry below or try again in a moment."
      });
    }

    const data = await r.json();
    const content =
      data?.choices?.[0]?.message?.content ||
      "I’m here—what are you looking to do today?";

    logTeriEvent({
      type: "response",
      page: pageContext?.path || null,
      intent,
      actions: actions.map((a) => a.label),
      ok: true,
      latency_ms,
      response_length: content.length,
      policy_flags: inferPolicyFlags({ intent, lastUserText, assistantText: content }),
      useModel: usedModel
    });

    return res.status(200).json({
      message: content,
      actions: actions.length ? actions : undefined
    });
  } catch (err) {
    const latency_ms = Date.now() - t0;

    logTeriEvent({
      type: "response",
      page: pageContext?.path || null,
      intent,
      actions: [],
      ok: false,
      error: "xai_exception",
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
