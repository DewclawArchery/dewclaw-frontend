// pages/ops-admin.js
import Head from "next/head";

const OPS_ADMIN_URL = "https://admin.dewclawarchery.com/";

export default function OpsAdminRedirectPage() {
  return (
    <>
      <Head>
        <title>Redirecting… | Dewclaw Archery</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta httpEquiv="refresh" content={`0;url=${OPS_ADMIN_URL}`} />
        <link rel="canonical" href={OPS_ADMIN_URL} />
      </Head>

      <main className="max-w-3xl mx-auto py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold text-dew-gold mb-4">Redirecting…</h1>
        <p className="text-slate-200">Taking you to Dewclaw Ops Admin.</p>

        <div className="mt-6">
          <a
            href={OPS_ADMIN_URL}
            className="inline-flex items-center justify-center rounded bg-dew-gold px-5 py-3 font-semibold text-black hover:opacity-90"
          >
            Continue to Admin
          </a>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: OPS_ADMIN_URL,
      permanent: false,
    },
  };
}
