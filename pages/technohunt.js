// pages/technohunt.js
import Head from "next/head";

export default function TechnoHuntRedirectPage() {
  return (
    <>
      <Head>
        <title>Redirecting… | Dewclaw Archery</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta httpEquiv="refresh" content="0;url=https://book.dewclawarchery.com/" />
        <link rel="canonical" href="https://book.dewclawarchery.com/" />
      </Head>

      <main className="max-w-3xl mx-auto py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold text-dew-gold mb-4">Redirecting…</h1>
        <p className="text-slate-200">
          Taking you to TechnoHUNT booking.
        </p>

        <div className="mt-6">
          <a
            href="https://book.dewclawarchery.com/"
            className="inline-flex items-center justify-center rounded bg-dew-gold px-5 py-3 font-semibold text-black hover:opacity-90"
          >
            Continue to Booking
          </a>
        </div>
      </main>
    </>
  );
}

// SSR redirect for speed + SEO correctness (works even if JS is disabled)
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "https://book.dewclawarchery.com/",
      permanent: false, // keep false until you're 100% sure you won't change this mapping
    },
  };
}
