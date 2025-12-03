import Hero from '../components/Hero';
import Link from 'next/link';

export async function getStaticProps() {
  return {
    props: {
      title: 'Home',
      description:
        'Dewclaw Archery – Southern Oregon’s trusted archery resource for pro-shop services, custom arrows, leagues, and a community of shooters.',
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Quick highlight strip */}
      <section className="border-y border-neutral-800 bg-black/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8 text-sm text-slate-200/90 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full border border-amber-400/60 bg-black/70" />
            <div>
              <div className="font-semibold text-amber-300">
                Full-service pro shop
              </div>
              <div>Bow setup, tuning, and repair done in-house.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full border border-amber-400/60 bg-black/70" />
            <div>
              <div className="font-semibold text-amber-300">
                Indoor range & leagues
              </div>
              <div>Seasonal leagues and open shooting lanes.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full border border-amber-400/60 bg-black/70" />
            <div>
              <div className="font-semibold text-amber-300">
                Custom arrow builds
              </div>
              <div>Hunting and target setups tailored to you.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA row */}
      <section className="bg-black py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="card px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-amber-300">
                  Not sure where to start?
                </h2>
                <p className="mt-2 text-sm text-slate-200/90">
                  Bring in your bow and arrows and we&apos;ll walk through your
                  setup, goals, and next steps — no pressure, just straight
                  answers.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/services" className="btn-secondary">
                  View Services
                </Link>
                <Link href="/contact" className="btn-primary">
                  Contact the Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
