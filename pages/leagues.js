import Head from "next/head";
import Link from "next/link";

const LEAGUES_PORTAL_URL =
  process.env.NEXT_PUBLIC_LEAGUES_PORTAL_URL || "https://leagues.dewclawarchery.com";

export default function LeaguesLanding() {
  return (
    <>
      <Head>
        <title>Leagues | Dewclaw Archery</title>
        <meta
          name="description"
          content="League info and signup options. Current league signup remains on our legacy page; upcoming leagues are available in our new leagues portal."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8 space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">Leagues</h1>
          <p className="text-slate-200 leading-relaxed">
            We’re running leagues year-round. Use the options below depending on what
            you’re signing up for.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current league (legacy) */}
          <div className="content-panel">
            <h2 className="text-2xl font-semibold text-dew-gold mb-2">
              Current League Signup
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Our current league signup is still hosted on our legacy system while
              the season starts / fills.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link href="/league-signup" className="btn-primary inline-flex justify-center">
                Sign Up (Current League)
              </Link>

              <Link
                href="/contact"
                className="inline-flex justify-center rounded border border-slate-700/70 bg-black/40 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-amber-400 transition"
              >
                Questions? Contact Us
              </Link>
            </div>

            <p className="text-slate-400 text-xs mt-4">
              This page stays live until your 1/7/26 league is underway / full.
            </p>
          </div>

          {/* New portal */}
          <div className="content-panel">
            <h2 className="text-2xl font-semibold text-dew-gold mb-2">
              Upcoming Leagues Portal
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              View upcoming seasons, league details, and future signup flows in our
              new leagues portal.
            </p>

            <div className="mt-5">
              <a
                href={LEAGUES_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex justify-center w-full sm:w-auto"
              >
                Open Leagues Portal
              </a>
            </div>

            <p className="text-slate-400 text-xs mt-4">
              Portal runs on the new OPS stack (leagues.dewclawarchery.com).
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
