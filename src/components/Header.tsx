import { useState } from "react";

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#for-schools", label: "For Schools" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#waitlist", label: "Get Started" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-brand-100/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-accent-500 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 2 15 9 22 9" />
              <polyline points="12 22 9 15 2 15" />
              <polyline points="2 9 9 9 12 2" />
              <polyline points="22 15 15 15 12 22" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Campus <span className="text-brand-600">Compass</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isButton = link.href === "/#waitlist";
            return isButton ? (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm"
              >
                Get Early Access
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-brand-50 hover:text-brand-700 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-brand-100/60 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isButton = link.href === "/#waitlist";
              return isButton ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Early Access
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}