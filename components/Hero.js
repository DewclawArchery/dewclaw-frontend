import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-shell">
      {/* VIDEO BACKGROUND */}
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/mountain_mist_slow.mp4" type="video/mp4" />
      </video>

      <div className="hero-fallback" />
      <div className="hero-topo-layer" />
      <div className="hero-gradient" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-start justify-center px-6 pb-16 pt-28 lg:px-8">
        <p className="mb-3 inline-flex items-center rounded-full border border-amber-500/40 bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90 shadow-lg shadow-black/60 backdrop-blur">
          Dewclaw Archery • Southern Oregon
        </p>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-50 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
          Honesty. Integrity. Experience.
        </h1>

        <p className="mb-7 max-w-xl text-base text-slate-200/90 sm:text-lg">
          Southern Oregon&apos;s trusted archery resource — pro-shop services
          and a community of shooters.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/league-signup" className="btn-primary">
            Join a League
          </Link>
          <Link href="/arrow-orders" className="btn-secondary">
            Order Custom Arrows
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 text-xs text-slate-300/80 sm:text-sm">
          <div>
            <div className="font-semibold text-amber-300">Shop & Range</div>
            <div>Wed–Sat: 10am–6pm</div>
            <div>Sun–Tue: Closed</div>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <div className="font-semibold text-amber-300">
              Built for every shooter
            </div>
            <div>First-timers, bowhunters, and competitive archers.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
