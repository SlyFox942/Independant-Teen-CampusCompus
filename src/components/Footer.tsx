export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-brand-500 to-accent-500">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 2 15 9 22 9" />
                  <polyline points="12 22 9 15 2 15" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="text-base font-bold text-gray-900">
                Campus <span className="text-brand-600">Compass</span>
              </span>
            </a>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
              Audio-guided navigation for schools. No beacons, no Wi-Fi dead zones,
              no expensive hardware. Just students helping students find their way.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              {["How It Works", "For Schools", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`/#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-gray-500 transition-colors hover:text-brand-600"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {["About", "Blog", "Contact", "Privacy"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 transition-colors hover:text-brand-600"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Campus Compass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}