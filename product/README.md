# Campus Compass 🧭

Audio-guided wayfinding for schools. Students record short audio landmarks ("water fountain hum", "squeaky door by the gym") that others follow to reach classrooms, the office, or the cafeteria. Works offline — no beacons, no Wi-Fi, no expensive hardware.

## Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **TailwindCSS 4** for styling
- **React Router 7** for client-side routing
- **idb** for IndexedDB (offline-first storage)
- **MediaRecorder API** for audio capture
- **Service Worker** for offline PWA support

## Project Structure

```
src/
  main.tsx              # Entry point, service worker registration
  App.tsx               # Root component with routing
  styles/
    app.css             # Tailwind imports + custom styles
  db/
    db.ts               # IndexedDB schema + data access layer
    index.ts            # Re-exports
  hooks/
    useMediaRecorder.ts # MediaRecorder API hook
    index.ts            # Re-exports
  utils/
    pwa.ts              # Service worker registration + install prompt
  components/
    Layout.tsx          # App shell with bottom nav
    index.ts            # Re-exports
  pages/
    HomePage.tsx         # Landing page with quick actions
    RecordPage.tsx       # Record audio + tag landmarks
    BrowsePage.tsx       # Browse landmarks by zone
    LandmarkDetailPage.tsx  # View/play/share a landmark
    NavigatePage.tsx     # Select destination & follow audio cues
public/
  manifest.json         # PWA manifest
  sw.js                 # Service worker
  icons/icon.svg        # App icon
```

## Getting Started

```bash
# Install dependencies
bun install

# Dev server
bun run dev

# Production build
bun run build
```

## Database Schema (IndexedDB)

The app uses IndexedDB via the `idb` library with four object stores:

- **landmarks** — Audio landmark metadata (title, description, zone, creator, timestamps)
- **zones** — Campus areas/zones for organizing landmarks
- **routes** — Ordered sequences of landmarks for navigation
- **recordings** — Raw audio blob data (stored separately for performance)

## PWA Features

- **Manifest** — Installable on mobile and desktop
- **Service Worker** — Caches app shell for offline access
- **Offline-first** — All data stored in IndexedDB, no server required
- **Dark mode** — Automatic based on system preference