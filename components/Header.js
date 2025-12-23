import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

/**
 * Nav strategy (during legacy league period):
 * - Keep /league-signup as the primary league signup (legacy system)
 * - Add /leagues as the new league portal (OPS module) so future leagues are ready
 * - Arrow Orders and TechnoHunt are redirect pages to OPS subdomains
 */

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/arrow-orders", label: "Arrow Orders" },
  { href: "/technohunt", label: "TechnoHunt Booking" },
  { href: "/leagues", label: "Leagues" }, // NEW portal (OPS)
  { href: "/league-signup", label: "League Signup" }, // legacy (keep for current league)
  { href: "/range-info", label: "Range Info" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isActive = (href) => router.pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/dewclaw-logo-header.png"
              alt="Dewclaw Archery"
              width={220}
              height={72}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-slate-900/80 text-amber-400"
                  : "text-slate-200/90 hover:text-amber-300"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Primary CTA (keep legacy league signup for now) */}
          <Link href="/league-signup" className="ml-2 btn-primary text-xs">
            Join a League
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-black/60 px-3 py-2 text-xs font-semibold text-slate-200 shadow-md shadow-black/40 hover:border-amber-400 md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-slate-800/80 bg-black/90 px-4 pb-4 pt-2 shadow-lg shadow-black/70 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-slate-900/80 text-amber-400"
                    : "text-slate-200/90 hover:text-amber-300"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/league-signup"
              onClick={() => setOpen(false)}
              className="mt-2 btn-primary w-full justify-center text-xs"
            >
              Join a League
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
