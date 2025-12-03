import Head from "next/head";
import Link from "next/link";

export default function ServerError() {
  return (
    <>
      <Head>
        <title>Server Error | Dewclaw Archery</title>
        <meta
          name="description"
          content="An unexpected error occurred while loading this page."
        />
      </Head>

      <section className="max-w-3xl mx-auto py-32 px-4 md:px-6 lg:px-8 text-center space-y-10">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-slate-900/60 border border-slate-700/40 flex items-center justify-center shadow-xl shadow-black/40">
            <svg
              className="w-14 h-14 text-dew-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-dew-gold">
          Something Went Wrong
        </h1>

        <p className="text-slate-200 leading-relaxed max-w-xl mx-auto">
          An unexpected error occurred while loading this page.  
          This is on us — not you.
        </p>

        <p className="text-slate-400 text-sm">
          If this keeps happening, feel free to reach out and let us know.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/">
            <span className="btn-secondary cursor-pointer">Return Home</span>
          </Link>
          <Link href="/contact">
            <span className="btn-secondary cursor-pointer">Contact Us</span>
          </Link>
        </div>
      </section>
    </>
  );
}
