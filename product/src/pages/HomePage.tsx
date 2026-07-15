import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      {/* Brand logo */}
      <div className="animate-fade-in-up flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-200/50 ring-1 ring-brand-100/20">
        <svg viewBox="0 0 100 100" className="h-12 w-12">
          <path
            d="M35 30 L35 70 L50 55 L65 70 L65 30 Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="45" r="6" fill="#4f46e5" />
        </svg>
      </div>

      {/* Tagline */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Campus <span className="text-brand-600">Compass</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
          Audio-guided wayfinding for your school. Navigate with sound landmarks —
          no Wi-Fi needed.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid w-full max-w-xs grid-cols-2 gap-3">
        <Link
          to="/record"
          className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl transition-colors group-hover:bg-brand-100">
            <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Record Landmark</span>
        </Link>

        <Link
          to="/navigate"
          className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl transition-colors group-hover:bg-amber-100">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 2 15 9 22 9" />
              <polyline points="12 22 9 15 2 15" />
              <polyline points="2 9 9 9 12 2" />
              <polyline points="22 15 15 15 12 22" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Find My Way</span>
        </Link>

        <Link
          to="/browse"
          className="group col-span-2 flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-lg transition-colors group-hover:bg-teal-100">
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Browse All Landmarks</span>
        </Link>
      </div>

      {/* How it works */}
      <div className="mt-4 w-full max-w-xs text-left">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-brand-200/50 to-transparent" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            How it works
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-brand-200/50 to-transparent" />
        </div>
        <div className="space-y-3">
          <div className="flex gap-3 rounded-xl bg-white p-3 shadow-xs ring-1 ring-gray-100">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
              1
            </span>
            <p className="text-sm leading-relaxed text-gray-600">
              Record a short audio clip of a location landmark
            </p>
          </div>
          <div className="flex gap-3 rounded-xl bg-white p-3 shadow-xs ring-1 ring-gray-100">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] font-bold text-accent-700">
              2
            </span>
            <p className="text-sm leading-relaxed text-gray-600">
              Tag it with a description and campus area
            </p>
          </div>
          <div className="flex gap-3 rounded-xl bg-white p-3 shadow-xs ring-1 ring-gray-100">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-700">
              3
            </span>
            <p className="text-sm leading-relaxed text-gray-600">
              Follow audio cues to navigate from one landmark to another
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}