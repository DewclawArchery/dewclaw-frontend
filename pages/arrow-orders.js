// pages/arrow-orders.js
import Head from "next/head";

export default function ArrowOrdersRedirectPage() {
  return (
    <>
      <Head>
        <title>Redirecting… | Dewclaw Archery</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          httpEquiv="refresh"
          content="0;url=https://orders.dewclawarchery.com/"
        />
        <link
          rel="canonical"
          href="https://orders.dewclawarchery.com/"
        />
      </Head>

      <main className="max-w-3xl mx-auto py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold text-dew-gold mb-4">
          Redirecting…
        </h1>

        <p className="text-slate-200">
          Taking you to custom arrow ordering.
        </p>

        <div className="mt-6">
          <a
            href="https://orders.dewclawarchery.com/"
            className="inline-flex items-center justify-center rounded bg-dew-gold px-5 py-3 font-semibold text-black hover:opacity-90"
          >
            Continue to Arrow Orders
          </a>
        </div>
      </main>
    </>
  );
}

// Server-side redirect (fast, SEO-safe, works without JS)
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "https://orders.dewclawarchery.com/",
      permanent: false, // flip to true later if desired
    },
  };
}
