import Head from "next/head";

const TECHNOHUNT_BOOKING_URL = "https://book.dewclawarchery.com/";

export default function RangeInfo() {
  return (
    <>
      <Head>
        <title>Indoor Range Info | Dewclaw Archery</title>
        <meta
          name="description"
          content="Indoor archery range information for Dewclaw Archery in Southern Oregon. Learn about lanes, distances, TechnoHUNT, gear requirements, rules, and hours."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">
            Indoor Range Info
          </h1>
          <p className="text-slate-200">
            A clean, comfortable indoor range built for consistent practice
            year-round. Good lighting, clear targets, and a friendly atmosphere
            for every skill level.
          </p>
        </header>

        {/* Lanes + Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Lanes & Distances */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-dew-gold">
              Lanes &amp; Distances
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Our range provides <strong>14 oversized shooting lanes</strong>,
              shootable at up to <strong>20 yards (60 feet)</strong>. Targets
              are easy to see, and the layout gives each shooter plenty of room.
            </p>
            <p className="text-slate-200 leading-relaxed">
              We also offer a movable <strong>5–20 yard field-point target</strong>,
              perfect for beginners, youth shooters, and close-range practice.
            </p>
          </div>

          {/* Gear / Rules / Hours */}
          <div className="space-y-8">
            {/* Gear */}
            <div>
              <h2 className="text-2xl font-semibold text-dew-gold mb-3">
                Gear Requirements
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Field points required unless using the approved broadhead target.
                Please check with staff before shooting broadheads.
              </p>
            </div>

            {/* Rules */}
            <div>
              <h2 className="text-2xl font-semibold text-dew-gold mb-3">
                Range Rules (Short Version)
              </h2>
              <ul className="text-slate-200 text-sm space-y-2">
                <li>• Follow all range officer and shop staff instructions.</li>
                <li>
                  • Arrows may only be nocked at the shooting line once the range
                  is cleared to shoot.
                </li>
                <li>• No dry-firing bows.</li>
                <li>
                  • Do not cross the shooting line until the range is called safe.
                </li>
                <li>• Respect other shooters and keep language family-friendly.</li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h2 className="text-2xl font-semibold text-dew-gold mb-3">
                Range Hours
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
                Hours may adjust for leagues, special events, or holidays. Call
                ahead if you’re making a special trip.
              </p>
            </div>
          </div>
        </div>

        {/* TechnoHUNT */}
        <div className="content-panel max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-dew-gold mb-3">
            TechnoHUNT Simulator
          </h2>

          <p className="text-slate-200 leading-relaxed mb-3">
            The TechnoHUNT TH400 brings a fully interactive archery experience
            to the range. Shoot your own bow at a 20-yard virtual screen with
            hundreds of hunting scenarios and games.
          </p>

          <p className="text-slate-200 leading-relaxed mb-3">
            Compete with friends, shoot darts or tic-tac-toe, practice accuracy
            drills, or run full big-game hunts. Supports up to{" "}
            <strong>6 shooters at once</strong>, making it perfect for groups
            and families.
          </p>

          <p className="text-slate-200 leading-relaxed mb-4">
            Walk-ins are welcome when the lane is available. To guarantee a
            spot, reserve online.
          </p>

          <div className="text-slate-200 text-sm mb-6">
            <p className="font-semibold mb-1">Rates:</p>
            <p>• $30 per hour</p>
            <p>• $15 per half hour</p>
            <p>• Group reservations available</p>
          </div>

          <a
            href={TECHNOHUNT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded bg-dew-gold px-6 py-3 font-semibold text-black hover:opacity-90 transition"
          >
            Reserve a TechnoHUNT Session
          </a>
        </div>
      </section>
    </>
  );
}
