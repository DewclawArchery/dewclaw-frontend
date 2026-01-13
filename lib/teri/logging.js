// lib/teri/logging.js

function toBool(v) {
  return String(v || "").toLowerCase() === "true";
}

function safeString(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isTeriLoggingEnabled() {
  return toBool(process.env.TERI_LOGGING_ENABLED);
}

function getSinkConfig() {
  return {
    url: process.env.TERI_LOG_SINK_URL,
    secret: process.env.TERI_LOG_SINK_SECRET
  };
}

/**
 * Logs an event WITHOUT raw message content / PII.
 * Outputs to:
 *  - console (Vercel function logs)
 *  - Supabase edge function sink (if configured)
 */
export function logTeriEvent(event) {
  if (!isTeriLoggingEnabled()) return;

  const payload = {
    id: uid(),
    source: "teri",
    ts: new Date().toISOString(),
    env: process.env.TERI_ENV || process.env.VERCEL_ENV || null,
    ...event
  };

  // Always log to console (useful in Vercel logs)
  try {
    console.log(JSON.stringify(payload));
  } catch {
    // ignore
  }

  // Optionally send to Supabase sink (non-blocking)
  const { url, secret } = getSinkConfig();
  if (!url || !secret) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-teri-log-secret": secret
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
  } catch {
    // never throw from logging
  }
}

export function inferIntent({ lastUserText = "", pageContext = {} }) {
  const t = (lastUserText || "").toLowerCase();
  const path = (pageContext?.path || "").toLowerCase();

  const has = (re) => re.test(t);
  const on = (re) => re.test(path);

  // TechnoHunt
  if (has(/technohunt|simulator/) || on(/technohunt/)) {
    if (has(/new|beginner|first time|first-time|never shot|brand new/)) return "technohunt_beginner";
    if (has(/book|booking|calendar|schedule|slot|availability|openings|time|duration/)) return "technohunt_booking";
    if (has(/need|bring|required|requirements|gear|equipment|rental|rentals|no gear/)) return "technohunt_requirements";
    if (has(/error|won't|cant|can't|cannot|failed|not working|problem/)) return "technohunt_troubleshoot";
    return "technohunt_overview";
  }

  // Arrows
  if (has(/arrow|arrows|shaft|shafts|spine|gpi|insert|inserts|outsert|point|points|broadhead|vane|vanes|fletch|wrap|wraps|foc|grain|grains/)) {
    if (has(/spine|250|300|340|350|400|500|600/)) return "arrows_spine";
    if (has(/hunting|broadhead|elk|deer|bear|penetration|fixed|mechanical/)) return "arrows_hunting";
    if (has(/target|3d|indoor|outdoor|tournament|spots/)) return "arrows_target";
    if (has(/order|ordering|checkout|cart|build|custom order/)) return "arrows_ordering";
    if (has(/insert|outsert|point|broadhead|vane|wrap|nock|collar/)) return "arrows_components";
    return "arrows_overview";
  }

  // Leagues & events
  if (has(/league|leagues|event|events|tournament|night shoot|3d league/) || on(/leagues/)) {
    if (has(/sign up|signup|register|join/)) return "leagues_signup";
    if (has(/when|date|schedule|calendar|start|starts/)) return "events_schedule";
    return "leagues_overview";
  }

  // Store info
  if (has(/hours|open|close|closing|holiday/)) return "store_hours";
  if (has(/policy|policies|return|refund|exchange|waiver|rules|safety/)) return "store_policies";
  if (has(/address|location|directions|where are you|phone|call/)) return "store_location";

  return "unknown";
}

/**
 * Infer policy flags WITHOUT logging raw content.
 * Uses redacted text + high-level checks only.
 */
export function inferPolicyFlags({ intent, lastUserText = "", assistantText = "" }) {
  const flags = [];
  const t = (lastUserText || "").toLowerCase();
  const a = (assistantText || "").toLowerCase();

  const technohuntContext = intent && intent.startsWith("technohunt_");

  const userMentionsNoGear =
    /rental|rentals|borrow|provided|provide|do you have gear|no gear|dont have|don't have|need a bow|need arrows/.test(t) ||
    /beginner|first time|never shot|brand new/.test(t);

  if (technohuntContext && userMentionsNoGear) {
    flags.push("technohunt_no_rentals");
  }

  const assistantImpliesRentals =
    technohuntContext && /no equipment needed|we provide|rental gear|rentals available|provided equipment/.test(a);

  if (assistantImpliesRentals) {
    flags.push("policy_drift_technohunt_rentals");
  }

  return flags;
}
