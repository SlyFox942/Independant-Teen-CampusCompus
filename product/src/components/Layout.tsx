import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { getInstallPrompt, type BeforeInstallPromptEvent } from "~/utils/pwa";

// SVG icon components
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function RecordIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r={active ? "6" : "3"} />
    </svg>
  );
}

function BrowseIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function NavigateIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 2 15 9 22 9" />
      <polyline points="12 22 9 15 2 15" />
      <polyline points="2 9 9 9 12 2" />
      <polyline points="22 15 15 15 12 22" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export default function Layout() {
  const [installPrompt] = useState<BeforeInstallPromptEvent | null>(getInstallPrompt);
  const [showInstall, setShowInstall] = useState(!!installPrompt);

  const handleInstall = async () => {
    const prompt = installPrompt;
    if (prompt) {
      await prompt.prompt();
      const result = await prompt.userChoice;
      if (result.outcome === "accepted") {
        setShowInstall(false);
      }
    }
  };

  const navItems = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/record", label: "Record", icon: RecordIcon },
    { to: "/browse", label: "Browse", icon: BrowseIcon },
    { to: "/navigate", label: "Navigate", icon: NavigateIcon },
  ];

  return (
    <div className="flex min-h-screen flex-col safe-bottom">
      {/* Install banner */}
      {showInstall && (
        <div className="safe-top flex items-center justify-between bg-linear-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 2 15 9 22 9" />
                <polyline points="12 22 9 15 2 15" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
            <span className="text-sm font-medium">Install Campus Compass for offline use</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-xs transition-all hover:bg-brand-50"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-lg flex-1 px-4 py-5">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="safe-bottom border-t border-brand-100/60 bg-white/95 shadow-[0_-1px_6px_rgba(0,0,0,0.04)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative flex flex-col items-center px-3 py-2 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-brand-600"
                    : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -top-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand-500" />
                  )}
                  <item.icon active={isActive} />
                  <span className="mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}