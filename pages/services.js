import Head from "next/head";
import PricingTable from "../components/PricingTable";

export default function Services() {
  return (
    <>
      <Head>
        <title>Pro-Shop Services | Dewclaw Archery</title>
        <meta
          name="description"
          content="Professional bow tuning, troubleshooting, repairs, arrow services, and range support. Trusted by Southern Oregon archers since 1993."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">
            Pro-Shop Services
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Full-service bow tuning, repair, and support — built on honesty,
            integrity, and decades of hands-on archery experience.
          </p>
        </header>

        {/* NEW — Dynamic Pricing Table */}
        <PricingTable category="services" title="Service Pricing" />

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          {/* Tuning */}
          <div>
            <h2 className="text-xl font-semibold text-dew-gold mb-3">
              Tuning & Troubleshooting
            </h2>
            <p className="text-slate-200 leading-relaxed">
              From string stretch to timing issues, we diagnose anything that
              feels “off.” If your bow suddenly makes a new noise, feels
              different at full draw, or isn’t grouping like it used to, we’ll
              track down the cause and get it shooting the way it should.
            </p>
          </div>

          {/* Bow Setup */}
          <div>
            <h2 className="text-xl font-semibold text-dew-gold mb-3">
              Bow Setup & Repairs
            </h2>
            <p className="text-slate-200 leading-relaxed">
              New bow setup, rest installation, timing, cam lean correction,
              centershot, peep installation, broadhead tuning, and more. Every
              bow on our press gets the same attention to detail we use on our
              personal gear.
            </p>
          </div>

          {/* Range Support */}
          <div>
            <h2 className="text-xl font-semibold text-dew-gold mb-3">
              Range Support
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Friendly help with form basics, sight adjustments, or equipment
              setup. Not formal lessons — just the support you need to feel
              confident on the line.
            </p>
          </div>

          {/* Custom Arrows */}
          <div>
            <h2 className="text-xl font-semibold text-dew-gold mb-3">
              Custom Arrow Services
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Spine testing, cut-to-length, fletching, weight matching, and
              component selection based on your bow, draw cycle, and goals. Our
              T.E.R.I.-powered Arrow Builder takes your details and creates a
              custom build spec.
            </p>
          </div>

          {/* Strings */}
          <div>
            <h2 className="text-xl font-semibold text-dew-gold mb-3">
              Bowstring Services
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Full string replacement, timing, leveling, peep alignment, and
              post-stretch checks. Whether upgrading or replacing worn strings,
              we ensure your bow stays tuned and consistent.
            </p>
          </div>

          {/* Accessories */}
          <div>
            <h2 className="text-xl font-semibold text-dew-gold mb-3">
              Accessory Setup
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Sight installation, rest tuning, quiver setup, stabilizer
              balancing, and more. Whether hunting or target shooting, we’ll
              help optimize your setup for performance and comfort.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
