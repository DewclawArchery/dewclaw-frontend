import Head from "next/head";

export default function ArrowOrders() {
  return (
    <>
      <Head>
        <title>Custom Arrow Orders | Dewclaw Archery</title>
      </Head>

      <section className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h1 className="text-4xl font-bold text-dew-gold mb-6">
          Custom Arrow Orders Temporarily Unavailable
        </h1>

        <p className="text-slate-200 text-lg max-w-2xl mx-auto">
          We’re currently updating our custom arrow ordering system to serve you
          better. Please check back soon, or contact the shop directly if you 
          need assistance with an arrow build.
        </p>

        <p className="text-slate-300 mt-6">
          • Call/Text: <span className="text-dew-gold font-semibold">920-819-8983</span><br />
          • Email: <span className="text-dew-gold font-semibold">matt@dewclawarchery.com</span>
        </p>

        <div className="mt-10">
          <a
            href="/"
            className="inline-block bg-dew-gold text-black font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-400 transition"
          >
            Return to Home
          </a>
        </div>
      </section>
    </>
  );
}
