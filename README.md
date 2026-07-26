# SaveIt — Video Downloader (Standalone)

A premium video-downloader UI (React + Vite + Tailwind) with support for TikTok, Instagram, Facebook, and YouTube.

## Quick start

```bash
npm install
npm run dev       # opens http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

That's it — the app runs in any modern browser.

## What's included

- Full React source (`src/App.jsx`) — the same premium purple→pink UI from the Zaro workspace app
- `src/nexus-shim.js` — a **localStorage-backed** replacement for the Zaro workspace bindings, so downloads and settings persist in the browser without any backend
- Tailwind CSS + Vite build tooling
- Lucide-react icons

## Important — Real Video Downloading

This project ships **UI**only**. To actually download videos from TikTok / Instagram / Facebook / YouTube you must provide a backend extractor. Open `src/App.jsx`` and find the function `resolveVideo(url)` near the top:

```js
oasync function resolveVideo(url){
  // TODO: replace with:
  //   const res = await fetch(`/api/resolve?url=${encodeURIComponent(url)}`);
  //   return res.json();  // { title, creator, duration, thumbnail, sizes:{...}, downloadUrl }
  ...
}
```

Point that `fetch` at your own backend that returns:

```json
{
  "title": "...",
  "creator": "...",
  "duration": "3:41",
  "thumbnail": "https://...",
  "sizes": { "360p": 30, "720p": 55, "1080p": 90, "mp3": 5 },
  "downloadUrl": "https://..."
}
```

Common backend options:
- **yt-dlp** (Python) — the gold-standard extractor. Wrap it in a small Flask/FastAPI/Node server.
- **RapidAPI** — SaveFrom / SnapSave / similar paid endpoints.
- **NewPipeExtractor** — Java library, if you're wrapping this in an Android app.

Once `resolveVideo` returns real data and `startDownload` streams the file, every UI element (progress circle, speed, remaining time, downloads list) will show real values automatically.

## Turning this into an Android APK

1. Add Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/android
   npx cap init "SaveIt" "com.yourname.saveit" --web-dir=dist
   npm run build
   npx cap add android
   npx cap open android      # opens Android Studio → build APK
   ```
2. Your extractor backend needs to be reachable from the phone (HTTPS URL).
3. Sign the APK in Android Studio (Build → Generate Signed Bundle/APK).

## Legal note

Downloading from TikTok / Instagram / Facebook / YouTube may violate their Terms of Service. YouTube in particular restricts downloading. Only download content you have the rights to save.

## License

MIT — do whatever you want with it.
