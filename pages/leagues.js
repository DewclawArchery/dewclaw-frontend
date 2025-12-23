// pages/leagues.js
import Head from "next/head";

export default function LeaguesRedirectPage() {
  return (
    <>
      <Head>
        <title>Redirecting… | Dewclaw Archery</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          httpEquiv="refresh"
          content="0;url=https://leagues.dewclawarchery.com/"
        />
        <link rel="canonical" href="https://leagues.dewclawarchery.com/" />
      </Head>

      <main className="max-w-3xl mx-auto py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold text-dew-gold mb-4">Redirecting…</h1>
        <p className="text-slate-200">
          Taking you to league information and upcoming signups.
        </p>

        <div className="mt-6">
          <a
            href="https://leagues.dewclawarchery.com/"
            className="inline-flex items-center justify-center rounded bg-dew-gold px-5 py-3 font-semibold text-black hover:opacity-90"
          >
            Continue to Leagues
          </a>
        </div>

        <p className="text-slate-400 text-xs mt-6">
          Note: Current league signup may still be handled through our legacy
          system.
        </p>
      </main>
    </>
  );
}

// SSR redirect (fast + works without JS)
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "https://leagues.dewclawarchery.com/",
      permanent: false,
    },
  };
}
