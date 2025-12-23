import Head from "next/head";
import Script from "next/script";
import Link from "next/link";

const LEAGUES_PORTAL_URL =
  process.env.NEXT_PUBLIC_LEAGUES_PORTAL_URL || "https://leagues.dewclawarchery.com";

export default function LeagueSignup() {
  return (
    <>
      <Head>
        <title>League Signup | Dewclaw Archery</title>
        <meta
          name="description"
          content="Sign up for the current league through our legacy signup system. Upcoming leagues and info are available in our new leagues portal."
        />
      </Head>

      <div className="page-shell">
        <section className="relative max-w-6xl mx-auto space-y-10 z-[2]">
          {/* Header */}
          <header className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-dew-gold mb-4">
              League Signup
            </h1>

            <p className="text-slate-200 leading-relaxed">
              Signups for the <span className="font-semibold">current league</span>{" "}
              are being handled through our legacy signup page below.
            </p>

            {/* Prize callouts */}
            <div className="mt-5 rounded-lg border border-slate-700/70 bg-slate-900/50 px-5 py-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <p className="text-slate-200 text-sm">
                  <span className="font-semibold text-dew-gold">Top Prize:</span>{" "}
                  2025 Elite Exalt 35
                </p>
                <p className="text-slate-200 text-sm">
                  <span className="font-semibold text-dew-gold">
                    Top Prize (Youth):
                  </span>{" "}
                  2026 Elite Emerse
                </p>
              </div>
              <p className="text-slate-400 text-xs mt-3">
                Prize details subject to change based on availability.
              </p>
            </div>
          </header>

          {/* New Portal Notice */}
          <div className="content-panel max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-dew-gold mb-2">
              Upcoming leagues &amp; info
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              We’re rolling out a new leagues portal for upcoming seasons.
              You can view league info (and future signups) here:
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={LEAGUES_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex justify-center"
              >
                View Leagues Portal
              </a>

              <a
                href="#signup"
                className="inline-flex justify-center rounded border border-slate-700/70 bg-black/40 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-amber-400 transition"
              >
                Jump to Signup
              </a>
            </div>

            <p className="text-slate-400 text-xs mt-4">
              Current league signup stays on this page until the season begins / fills.
            </p>
          </div>

          {/* Legacy Signup Embed */}
          <div id="signup" className="w-full mx-auto">
            <div className="max-w-5xl mx-auto mb-3">
              <h2 className="text-2xl font-semibold text-dew-gold mb-2">
                Current League Signup
              </h2>
              <p className="text-slate-200 text-sm">
                Complete signup below. Payment is handled through the embedded checkout.
              </p>
            </div>

            <div className="max-w-5xl mx-auto p-2">
              <Script
                src="https://embed.acuityscheduling.com/js/embed.js"
                strategy="lazyOnload"
              />

              <iframe
                src="https://app.acuityscheduling.com/schedule.php?owner=17569879&calendarID=3383478&ref=embedded_csp"
                title="League Signup"
                width="100%"
                height="900"
                frameBorder="0"
                allow="payment"
                className="rounded-lg border border-slate-700 shadow-lg shadow-black/40 w-full"
              />
            </div>

            <div className="max-w-5xl mx-auto mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-slate-400 text-xs">
              <p>
                Trouble signing up? Call/text{" "}
                <span className="text-dew-gold font-semibold">541-772-1896</span>{" "}
                and we’ll get you taken care of.
              </p>

              <Link
                href="/contact"
                className="inline-flex justify-center rounded border border-slate-700/70 bg-black/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-amber-400 transition"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
