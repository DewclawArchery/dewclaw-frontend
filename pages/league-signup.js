import Head from "next/head";
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
          content="Register for an archery league at Dewclaw Archery. League signups are now handled through our Dewclaw OPS leagues portal."
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
              League registration is now handled through our{" "}
              <span className="font-semibold">Dewclaw OPS leagues portal</span>.
              Click below to view available leagues and reserve your time slot.
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

          {/* Portal Notice + CTAs */}
          <div className="content-panel max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-dew-gold mb-2">
              View leagues &amp; register
            </h2>

            <p className="text-slate-200 text-sm leading-relaxed">
              Use our leagues portal to view league details, pick your day/time,
              and complete registration. If you need help, email us and we’ll take
              care of you.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={LEAGUES_PORTAL_URL}
                className="btn-primary inline-flex justify-center"
              >
                View Leagues &amp; Register
              </a>

              <a
                href="mailto:Info@dewclawarchery.com?subject=League%20Signup%20Help%20Request&body=Hi%20Dewclaw%20Team%2C%0A%0AI%20need%20help%20with%20league%20signup.%20Here%20are%20my%20details%3A%0A%0AName%3A%20%0APhone%3A%20%0AEmail%3A%20%0ALeague%20name%20(if%20known)%3A%20%0APreferred%20day%2Ftime%3A%20%0A%0AThank%20you!"
                className="inline-flex justify-center rounded border border-slate-700/70 bg-black/40 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-amber-400 transition"
              >
                Email for Help (No Phone Calls)
              </a>
            </div>

            <p className="text-slate-400 text-xs mt-4">
              Bookmark this page if you previously used an older signup link —
              this page now routes you to the new system.
            </p>
          </div>

          {/* Helpful footer */}
          <div className="max-w-5xl mx-auto mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-slate-400 text-xs">
            <p>
              Need help? Email{" "}
              <a
                href="mailto:Info@dewclawarchery.com"
                className="text-dew-gold font-semibold underline underline-offset-2"
              >
                Info@dewclawarchery.com
              </a>
              .
            </p>

            <Link
              href="/contact"
              className="inline-flex justify-center rounded border border-slate-700/70 bg-black/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-amber-400 transition"
            >
              Contact Page
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
