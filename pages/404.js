import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | Dewclaw Archery</title>
        <meta
          name="description"
          content="The page you're looking for could not be found."
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
                d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-dew-gold">
          Page Not Found
        </h1>

        <p className="text-slate-200 leading-relaxed max-w-xl mx-auto">
          The page you're looking for doesn’t exist or may have been moved.
        </p>

        <Link href="/">
          <span className="btn-secondary cursor-pointer">
            Return Home
          </span>
        </Link>
      </section>
    </>
  );
}
