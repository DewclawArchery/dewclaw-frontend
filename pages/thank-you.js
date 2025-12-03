import Head from "next/head";
import Link from "next/link";

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>Thank You | Dewclaw Archery</title>
        <meta
          name="description"
          content="Thank you for your submission to Dewclaw Archery. We'll follow up as soon as possible."
        />
      </Head>

      <section className="max-w-4xl mx-auto py-24 px-4 md:px-6 lg:px-8 text-center space-y-10">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-slate-900/60 border border-slate-700/40 flex items-center justify-center shadow-xl shadow-black/30">
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-dew-gold">Thank You!</h1>

        {/* Message */}
        <p className="text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Your submission has been received. If this was a league signup or a
          custom arrow order, please check your email for a confirmation and any
          next steps. We’ll follow up if anything needs clarification.
        </p>

        {/* Helpful Links */}
        <div className="space-y-6">
          <p className="text-slate-400 text-sm">
            Not seeing a confirmation email? Check your spam folder or feel free
            to reach out.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="/">
              <span className="btn-secondary cursor-pointer">Return Home</span>
            </Link>
            <Link href="/services">
              <span className="btn-secondary cursor-pointer">
                View Pro-Shop Services
              </span>
            </Link>
            <Link href="/range-info">
              <span className="btn-secondary cursor-pointer">
                Range Information
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
