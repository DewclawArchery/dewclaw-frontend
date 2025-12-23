import Head from "next/head";

const OPS_ADMIN_URL =
  process.env.NEXT_PUBLIC_OPS_ADMIN_URL || "https://admin.dewclawarchery.com";

export default function OpsRedirect() {
  return (
    <>
      <Head>
        <title>OPS Admin | Dewclaw Archery</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta httpEquiv="refresh" content={`0;url=${OPS_ADMIN_URL}`} />
        <link rel="canonical" href={OPS_ADMIN_URL} />
      </Head>

      <main className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h1 className="text-3xl font-bold text-dew-gold mb-4">Redirecting…</h1>
        <p className="text-slate-200">Taking you to the OPS Admin Portal.</p>

        <p className="text-slate-400 text-sm mt-6">
          If you aren’t redirected,{" "}
          <a className="text-dew-gold underline" href={OPS_ADMIN_URL}>
            click here
          </a>
          .
        </p>
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
