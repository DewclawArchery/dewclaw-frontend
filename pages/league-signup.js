import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { apiGet } from "../lib/api";

const WP_BASE =
  process.env.NEXT_PUBLIC_WP_URL || "https://dewclawarchery.com";

function formatTime(timeString) {
  if (!timeString) return "";
  const [hStr, mStr] = timeString.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;

  const ampm = h >= 12 ? "PM" : "AM";
  const hr12 = ((h + 11) % 12) + 1;

  return `${hr12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatPrice(price) {
  if (price == null) return "";
  const n = Number(price);
  if (Number.isNaN(n)) return "";
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export default function LeagueSignup() {
  const [leagues, setLeagues] = useState([]);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [leagueError, setLeagueError] = useState("");

  const [selectedLeagueId, setSelectedLeagueId] = useState(null);

  const [participant, setParticipant] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Load active leagues
  useEffect(() => {
    let cancelled = false;

    const loadLeagues = async () => {
      setLoadingLeagues(true);
      setLeagueError("");

      try {
        const data = await apiGet(
          `${WP_BASE}/wp-json/teri/v6/leagues`
        );

        if (!Array.isArray(data)) {
          throw new Error("Unexpected leagues payload");
        }

        const active = data.filter((l) => l.active !== false);

        if (!cancelled) {
          setLeagues(active);
          if (active.length > 0 && !selectedLeagueId) {
            setSelectedLeagueId(active[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load leagues", err);
        if (!cancelled) {
          setLeagueError(
            "Unable to load leagues at this time. Please try again shortly."
          );
        }
      } finally {
        if (!cancelled) setLoadingLeagues(false);
      }
    };

    loadLeagues();
    return () => {
      cancelled = true;
    };
  }, [selectedLeagueId]);

  const selectedLeague = leagues.find(
    (l) => l.id === selectedLeagueId
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!selectedLeagueId) {
      setSubmitError("Please select a league before continuing.");
      return;
    }

    if (!participant.trim() || !email.trim()) {
      setSubmitError(
        "Please provide your name and email so we can confirm your signup."
      );
      return;
    }

    const payload = {
      league_id: selectedLeagueId,
      participant: participant.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      notes: notes.trim() || null,
      payment_mode: "online",
    };

    try {
      setSubmitting(true);

      const res = await fetch(
        `${WP_BASE}/wp-json/teri/v6/league-signups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let message = `Signup failed (${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson && errJson.message) {
            message = errJson.message;
          }
        } catch {}

        throw new Error(message);
      }

      const json = await res.json();

      if (json && json.redirect_url) {
        window.location.href = json.redirect_url;
        return;
      }

      setSubmitSuccess(
        "Signup received! Please check your email for confirmation."
      );
    } catch (err) {
      console.error("Signup error", err);
      setSubmitError(
        err?.message ||
          "There was a problem submitting your signup. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>League Signup | Dewclaw Archery</title>
        <meta
          name="description"
          content="Choose your league night and complete your info. Payment is handled through Square and your spot is confirmed automatically."
        />
      </Head>

      <div className="page-shell">
        <section className="relative max-w-6xl mx-auto space-y-12 z-[2]">

          {/* Header */}
          <header className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-dew-gold mb-4">
              League Signup
            </h1>
            <p className="text-slate-200 leading-relaxed">
              Choose your league night and complete your info. Payment
              is handled through Square, and your spot will be
              confirmed automatically.
            </p>
          </header>

          {/* --- Full-Width Acuity Embed Below Header --- */}
          <div className="w-full mx-auto p-2 mt-6">
            <Script
              src="https://embed.acuityscheduling.com/js/embed.js"
              strategy="lazyOnload"
            />

            <iframe
              src="https://app.acuityscheduling.com/schedule.php?owner=17569879&ref=embedded_csp"
              title="Schedule Appointment"
              width="100%"
              height="800"
              frameBorder="0"
              allow="payment"
              className="rounded-lg border border-slate-700 shadow-lg shadow-black/40 w-full"
            ></iframe>
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 items-start">

            {/* Available Leagues */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-dew-gold mb-1">
                Available Leagues
              </h2>

              {loadingLeagues && (
                <p className="text-slate-200 text-sm">Loading leagues…</p>
              )}

              {!loadingLeagues && leagueError && (
                <p className="rounded-md border border-red-500/60 bg-red-900/40 px-4 py-3 text-sm text-red-100">
                  {leagueError}
                </p>
              )}

              {!loadingLeagues && !leagueError && leagues.length === 0 && (
                <p className="text-slate-200 text-sm">
                  No active leagues are available right now.
                </p>
              )}

              <div className="space-y-4">
                {leagues.map((league) => {
                  const isSelected = league.id === selectedLeagueId;
                  const timeLabel = `${league.day_of_week} @ ${
                    league.start_time ? formatTime(league.start_time) : ""
                  }`;

                  return (
                    <button
                      key={league.id}
                      type="button"
                      onClick={() => setSelectedLeagueId(league.id)}
                      className={[
                        "w-full text-left rounded-xl border px-5 py-4 shadow-lg shadow-black/40 transition-all",
                        "bg-slate-900/70 border-slate-700/60 hover:border-dew-gold/70 hover:shadow-dew-gold/30",
                        isSelected
                          ? "ring-2 ring-dew-gold border-dew-gold/80"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <h3 className="text-lg font-semibold text-dew-gold">
                        {league.name}
                      </h3>
                      <p className="text-slate-200 text-sm mt-1">{timeLabel}</p>
                      <p className="text-slate-200 text-sm mt-1">
                        {formatPrice(league.price)} • {league.weeks || "Multiple"} weeks
                      </p>

                      {league.description && (
                        <p className="text-slate-400 text-sm mt-2">
                          {league.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Signup Form */}
            <div className="content-panel">
              <h2 className="text-2xl font-semibold text-dew-gold mb-4">
                Your Information
              </h2>

              {selectedLeague ? (
                <p className="text-sm text-slate-200 mb-4">
                  You&apos;re signing up for{" "}
                  <span className="font-semibold text-dew-gold">
                    {selectedLeague.name}
                  </span>{" "}
                  – {selectedLeague.day_of_week} at{" "}
                  {selectedLeague.start_time ? formatTime(selectedLeague.start_time) : ""}
                  .
                </p>
              ) : (
                <p className="text-sm text-slate-200 mb-4">
                  Select a league on the left to get started.
                </p>
              )}

              {submitError && (
                <div className="mb-4 rounded-md border border-red-500/70 bg-red-900/50 px-4 py-3 text-sm text-red-100">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="mb-4 rounded-md border border-emerald-500/70 bg-emerald-900/40 px-4 py-3 text-sm text-emerald-100">
                  {submitSuccess}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">
                      First &amp; Last Name
                    </label>
                    <input
                      type="text"
                      value={participant}
                      onChange={(e) => setParticipant(e.target.value)}
                      className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100"
                    placeholder="Optional but helpful"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100"
                    placeholder="Anything we should know ahead of time?"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`btn-primary ${
                      submitting ? "opacity-70 cursor-wait" : ""
                    }`}
                  >
                    {submitting ? "Submitting…" : "Complete Signup"}
                  </button>
                </div>
              </form>

              <p className="text-slate-400 text-xs mt-3">
                After submitting, you&apos;ll be redirected to confirm your signup and complete payment through Square.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
