# Campus Compass 🧭

**Audio-guided wayfinding for schools** — navigate your campus with audio landmarks, no Wi-Fi or hardware needed.

## Repository Structure

```
/
├── src/               # Marketing site (TanStack Start app)
├── product/           # Campus Compass PWA (product app)
│   ├── src/           # React + Vite + TypeScript
│   ├── public/        # PWA manifest, service worker, icons
│   └── ...
├── public/            # Marketing site assets
├── .gitignore
└── README.md
```

## Marketing Site

The marketing site is a [TanStack Start](https://tanstack.com/start) app at the repo root, served on port 3000. See [SITE.md](./SITE.md) for details.

## Product PWA

The Campus Compass product is a Progressive Web App in `/product/`. It allows students to:
- **Record** audio landmarks with descriptions
- **Browse** landmarks by campus zone
- **Navigate** by following audio cues
- **Share** landmarks with classmates
- Works **offline** with IndexedDB storage

See `/product/README.md` for product details.