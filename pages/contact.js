import Head from "next/head";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us | Dewclaw Archery</title>
        <meta
          name="description"
          content="Get in touch with Dewclaw Archery. Call, email, or visit our indoor range and pro shop in Medford, Oregon."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">
            Contact Us
          </h1>
          <p className="text-slate-200 leading-relaxed">
            Have a question about gear, arrows, leagues, or our range?
            We’re here to help.
          </p>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Phone & Email */}
            <div>
              <h2 className="text-2xl font-semibold text-dew-gold mb-3">
                Get in Touch
              </h2>

              <p className="text-slate-200">
                <span className="font-semibold">Phone:</span>{" "}
                <a href="tel:5417721896" className="text-dew-gold hover:underline">
                  541-772-1896
                </a>
              </p>

              <p className="text-slate-200">
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:info@dewclawarchery.com"
                  className="text-dew-gold hover:underline"
                >
                  info@dewclawarchery.com
                </a>
              </p>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-2xl font-semibold text-dew-gold mb-3">
                Location
              </h2>

              <p className="text-slate-200">
                1419 E. Justice Rd.
                <br />
                Medford, OR 97504
              </p>

              <p className="text-slate-400 text-sm mt-2">
                Located in East Medford with easy access and convenient parking.
              </p>
            </div>

            {/* Hours */}
            <div>
              <h2 className="text-2xl font-semibold text-dew-gold mb-3">
                Hours
              </h2>

              <div className="text-slate-200 text-sm space-y-1">
                <p>
                  <span className="font-semibold">Wednesday – Saturday:</span>{" "}
                  10:00am – 6:00pm
                </p>
                <p>
                  <span className="font-semibold">Sunday – Tuesday:</span>{" "}
                  Closed
                </p>
              </div>

              <p className="text-slate-400 text-xs mt-2">
                Hours may vary for leagues, special events, or holidays.
              </p>
            </div>
          </div>

          {/* Static Map Style Block */}
          <div className="w-full h-80 rounded-xl overflow-hidden shadow-xl shadow-black/40 border border-slate-700/40 bg-slate-900/70 flex flex-col justify-between">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dew-gold mb-2">
                Find Us on the Map
              </h2>
              <p className="text-slate-200 text-sm">
                Open this location in Google Maps for directions to:
              </p>
              <p className="text-slate-200 text-sm mt-2">
                1419 E. Justice Rd.
                <br />
                Medford, OR 97504
              </p>
            </div>

            <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center justify-center">
              <span className="text-slate-500 text-xs uppercase tracking-[0.25em]">
                Map Preview
              </span>
            </div>

            <div className="p-4 flex justify-end">
              <a
                href="https://www.google.com/maps/search/?api=1&query=1419+E+Justice+Rd+Medford+OR+97504"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Optional Form (future T.E.R.I. integration) */}
        <div className="content-panel max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-dew-gold mb-4">
            Send Us a Message
          </h2>

          <p className="text-slate-200 mb-6">
            Prefer email? Send us a quick message below.
            We’ll get back to you as soon as we can.
          </p>

          {/* Form layout only — T.E.R.I. integration coming later */}
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100"
                placeholder="How can we help?"
              ></textarea>
            </div>

            <button
              type="button"
              className="btn-primary cursor-not-allowed opacity-60"
              title="Form submission coming soon"
            >
              Send Message
            </button>
          </form>

          <p className="text-slate-400 text-xs mt-3">
            This form will be connected to T.E.R.I. in a future update.
          </p>
        </div>
      </section>
    </>
  );
}
