import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | Dewclaw Archery</title>
        <meta
          name="description"
          content="Learn about Dewclaw Archery — a trusted Southern Oregon pro shop built on honesty, integrity, and experience. Full-service tuning, repairs, custom arrows, and an indoor range."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">
            About Dewclaw Archery
          </h1>
          <p className="text-slate-200 leading-relaxed">
            Southern Oregon’s trusted archery resource — pro-shop services, 
            custom arrows, and a community of shooters.
          </p>
        </header>

        {/* Who We Are */}
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-dew-gold">
            Honesty. Integrity. Experience.
          </h2>
          <p className="text-slate-200 leading-relaxed">
            Dewclaw Archery is built on simple values: treat people fairly, do 
            the job right, and build equipment you’d trust on your own hunt or 
            tournament line. Every bow that hits our press gets the same care 
            and attention to detail — no shortcuts, no gimmicks, just solid 
            craftsmanship.
          </p>
          <p className="text-slate-200 leading-relaxed">
            Whether you’re brand new to archery, coming back after a long break, 
            or shooting every week, our goal is to make sure you feel confident 
            in your gear and comfortable in the shop. We take the time to answer 
            questions, explain what we’re doing, and help you understand your 
            equipment.
          </p>
        </div>

        {/* What We Do */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-dew-gold">
              What We Do
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Dewclaw is a full-service archery pro shop. We tune bows, fix 
              problems, build custom arrows, and help you get the most from 
              your equipment. Our indoor range gives you a controlled, 
              consistent shooting environment year-round, with friendly support 
              whenever you need it.
            </p>
            <ul className="text-slate-200 space-y-2 text-sm">
              <li>• Complete bow setup & tuning</li>
              <li>• Troubleshooting performance issues</li>
              <li>• Custom arrow builds & spine testing</li>
              <li>• Bowstring installation & timing</li>
              <li>• Range support & league nights</li>
              <li>• TechnoHUNT simulator</li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-dew-gold">
              What Makes Us Different
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Archery isn’t just what we do — it’s our hobby, our passion, and 
              our community. We take pride in maintaining a clean, welcoming 
              shop where you can shoot, learn, and improve without pressure.
            </p>
            <p className="text-slate-200 leading-relaxed">
              Our focus is on long-term relationships, not quick sales. We 
              recommend gear based on what actually works, not what’s trending, 
              and we stand behind every arrow and every bow we set up.
            </p>
          </div>
        </div>

        {/* Closing Message */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-semibold text-dew-gold">
            Your Success Is Our Priority
          </h2>
          <p className="text-slate-200 leading-relaxed">
            Whether you're sighting in for a big hunt, tuning for indoor league 
            season, or taking your first shots, we’re here to help you get the 
            most out of every arrow.
          </p>
          <p className="text-slate-200 leading-relaxed">
            Stop by, shoot a few arrows, ask questions, or just hang out — 
            everyone’s welcome here.
          </p>
        </div>
      </section>
    </>
  );
}
