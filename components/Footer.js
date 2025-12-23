import Link from "next/link";

const OPS = {
  bookings:
    process.env.NEXT_PUBLIC_OPS_BOOKINGS_URL ||
    "https://book.dewclawarchery.com/",
  orders:
    process.env.NEXT_PUBLIC_OPS_ORDERS_URL ||
    "https://orders.dewclawarchery.com/",
  leagues:
    process.env.NEXT_PUBLIC_OPS_LEAGUES_URL ||
    "https://leagues.dewclawarchery.com/",
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-between gap-6">
          {/* BRAND */}
          <div>
            <h3 className="text-zinc-300 text-lg font-semibold mb-2">
              Dewclaw Archery
            </h3>
            <p className="text-sm">
              Southern Oregon&apos;s trusted archery resource.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex flex-col text-sm gap-1">
            <Link href="/" className="hover:text-[#F9A51A]">
              Home
            </Link>
            <Link href="/services" className="hover:text-[#F9A51A]">
              Services
            </Link>
            <Link href="/range-info" className="hover:text-[#F9A51A]">
              Range Info
            </Link>

            {/* OPS module links MUST be absolute */}
            <a
              href={OPS.bookings}
              className="hover:text-[#F9A51A]"
              rel="noopener noreferrer"
            >
              TechnoHunt Booking
            </a>
            <a
              href={OPS.orders}
              className="hover:text-[#F9A51A]"
              rel="noopener noreferrer"
            >
              Arrow Orders
            </a>

            <div className="h-2" />

            <a
              href={OPS.leagues}
              className="hover:text-[#F9A51A]"
              rel="noopener noreferrer"
            >
              Leagues
            </a>

            {/* Keep legacy signup on main site */}
            <Link href="/league-signup" className="hover:text-[#F9A51A]">
              Current League Signup
            </Link>

            <div className="h-2" />

            <Link href="/about" className="hover:text-[#F9A51A]">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#F9A51A]">
              Contact
            </Link>
          </div>

          {/* HOURS */}
          <div className="text-sm">
            <h4 className="text-zinc-300 font-semibold mb-2">Hours</h4>
            <p>Wed–Sat: 10am – 6pm</p>
            <p>Sun–Tue: Closed</p>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-600 mt-10">
          © {new Date().getFullYear()} Dewclaw Archery. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
