// pages/api/teri/chat.js

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

RESPONSE STRUCTURE (IMPORTANT)
1) Direct answer first (1–3 sentences).
2) Then 2–5 bullets with technician-style recommendations (fit/safety/tradeoffs).
3) If relevant, include “Next steps” with links (booking / arrow orders / leagues).
4) Keep it concise and confident.

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

  // Last user message (for actions and general intent)
  const lastUser = [...messages].reverse().find((m) => m?.role === "user");
  const lastUserTextRaw = lastUser?.content || "";
  const lastUserText = redactPII(lastUserTextRaw);

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
    ...cleanedHistory
  ];

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
        temperature: 0.4,
        max_tokens: 700
      })
    });

    if (!r.ok) {
      const debugText = await r.text();
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

    const actions = buildActions(lastUserText, opsLinks);

    return res.status(200).json({
      message: content,
      actions: actions.length ? actions : undefined
    });
  } catch {
    return res.status(502).json({
      message:
        "T.E.R.I. couldn’t connect just now. Tap Retry below or try again in a moment."
    });
  }
}
