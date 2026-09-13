# VAN DREAM

> **“Your Drama. Your Dream.”**

A modern drama streaming website with a bold **Neo-Brutalism** identity.
All drama data is fetched **dynamically from the NunoMix API** through
server-side route handlers — the frontend never sees the upstream token.

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Mobile-portrait first (2-column grid, bottom navigation)
- HTML5 video player with custom controls (+ hls.js for HLS streams)
- Continue Watching & Favorites (localStorage, no account)
- Skeletons, error states, empty states everywhere
- Debounced search, pagination / infinite scroll, server-side caching
- SEO metadata per route, accessible controls, no horizontal overflow

---

## 1. Install

```bash
npm install
```

## 2. Configure the API token

```bash
cp .env.example .env.local
```

Then open `.env.local` and set your token:

```env
NUNOMIX_BASE_URL=https://nunodrama.my.id/api/nunomix
NUNOMIX_TOKEN=your-token-here
SITE_URL=http://localhost:3000   # optional, for Open Graph metadata
```

> ⚠️ `NUNOMIX_TOKEN` is **server-side only**. The project imports
> `server-only` in the API client, so any accidental client-side import
> fails the build. There is intentionally **no** `NEXT_PUBLIC_*` token.

## 3. Run in development

```bash
npm run dev
```

Open http://localhost:3000 — the mobile bottom nav is visible below the
`md` breakpoint, try both.

## 4. Production build

```bash
npm run build
npm start
```

## 5. Deployment

Any Node 18+ / serverless host works (Vercel, Cloud Run, a VPS with
`next start`, etc.).

**Vercel (recommended):**
1. Push the repo to GitHub/GitLab and import it in Vercel.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables in *Project → Settings → Environment
   Variables* for **Production / Preview / Development**:
   - `NUNOMIX_BASE_URL`
   - `NUNOMIX_TOKEN`
   - `SITE_URL` (your production domain, e.g. `https://vandream.example`)
4. Deploy. Build command `next build`, output `.next` — defaults are fine.

**VPS / Docker:** build the image with `npm ci && npm run build`, run
`npm start`, and export the three env vars at container runtime.

---

## Architecture

```
Browser
  ↓  (relative /api/* URLs only)
Van Dream Frontend (Next.js App Router)
  ↓
Van Dream API routes  (app/api/*)  ← validates every input
  ↓
lib/nunomix/client.ts  (server-only, attaches NUNOMIX_TOKEN)
  ↓
NunoMix API  (https://nunodrama.my.id/api/nunomix)
  ↓  raw JSON
lib/nunomix/adapter.ts  (normalizes into stable domain types)
  ↓
Van Dream Frontend
```

| Route              | Upstream endpoint                     | Cache |
| ------------------ | ------------------------------------- | ----- |
| `GET /api/drama`   | `/all_drama?page={p}&type_id=0`       | 10 min |
| `GET /api/recommend` | `/recommend?page={p}&vod_type=0`    | 15 min |
| `GET /api/drama/[id]` | `/detail?vod_id={id}`              | 1 h   |
| `GET /api/drama/[id]/episodes` | `/allepisode?vod_id={id}` | 1 h   |
| `GET /api/stream?vod_id=&episode=` | `/stream?vod_id=&episode=` | 30 s |
| `GET /api/search?q=&page=` | `/search?keyword=&page=`       | 1 min |

### Key directories

```
app/
  page.tsx                     # Home: hero + continue watching + recommended + all drama
  drama/
    page.tsx                   # /drama — full catalog (infinite scroll)
    [vod_id]/page.tsx          # /drama/{id} — detail + episode list
  watch/[vod_id]/[episode]/page.tsx  # /watch/{id}/{ep} — player + prev/next
  search/page.tsx              # /search?q= — debounced client search
  favorites/page.tsx           # /favorites — localStorage favorites
  api/                         # server-side proxy routes (token stays here)
components/                    # Header, MobileNav, DramaCard, DramaGrid, Hero,
                               # EpisodeList, VideoPlayer, SearchPageClient,
                               # ContinueWatching, FavoriteButton, Skeleton, …
lib/
  nunomix/
    client.ts                  # server-only fetch wrapper (token, errors, cache)
    adapter.ts                 # raw JSON → normalized types (only place that
                               # knows the upstream field names)
    queries.ts                 # getAllDrama / getRecommended / getDramaDetail /
                               # getEpisodes / getStream / searchDrama
    types.ts                   # normalized domain types
  api-helpers.ts               # safe error mapping for route handlers
  api-client.ts                # browser fetch helper (only calls /api/*)
  storage.ts                   # localStorage: continue watching + favorites
  validate.ts                  # input validation (page / vod_id / episode / keyword)
```

### Normalization contract

The UI only consumes `lib/nunomix/types.ts`:

- `Drama` / `DramaDetail` — card & detail fields (poster, title, year, type,
  score, remarks, status, description, cast, director, genres, totalEpisodes)
- `Episode` — `{ number, title?, url? }`
- `StreamResult` — `{ url, type: "mp4" | "m3u8" | "other" }`
- `PageResult<T>` — `{ items, page, hasMore, total }`

**If the NunoMix API changes its JSON shape, fix `lib/nunomix/adapter.ts`
only** — nothing else needs to change.

---

## API inspection notes

Field mappings in `adapter.ts` were built against the **real responses**
of all six endpoints (inspected live with a valid token):

| Endpoint | Envelope | List location | Notable fields |
| -------- | -------- | ------------- | -------------- |
| `all_drama` | `{ code: 10000, message: "Berhasil", error_msg: "", result: [...] }` | `result` (array) | `id`, `vod_name`, `vod_pic`, `vod_blurb`, `theme`, `topic_name`, `vod_serial`, `vod_total`, `vod_douban_score` (0 = none) |
| `recommend` | same | **`result.vod_list`** (nested object) | same item shape as all_drama |
| `detail` | same | `result` (object) | item fields + `background`, and **`vod_collection`** (full episode list with `collection_order`, `title`, `m3u8_url` = direct CDN mp4, `img_url`, `video_duration`) |
| `allepisode` | **bare array** (no envelope) | top-level array | `episode`, `title` (Chinese "第N集" — cleaned), `play_url` (https proxy — used for playback), `video_url`/`direct_url` (plain-HTTP IP — avoided, mixed content), `raw_video_url`, `cover`, `duration`, `resolution`, `is_locked` |
| `stream` | `{ success: true, url, data: { url, playUrl, directUrl, episode, title, duration, format } }` | top-level `url` | `format` = `mp4`; URL is a Cloudflare Worker proxy — verified: `206 Partial Content`, `accept-ranges: bytes`, `access-control-allow-origin: *` (seeking + CORS work) |
| `search` | same as all_drama | `result` (array, `[]` when no match) | same item shape; 20 items/page |

Other observed behaviors:

- **Success code is `10000`** (not 200). Error messages arrive in
  `error_msg`. The client treats any other numeric `code` or non-empty
  `error_msg` as an envelope error.
- **Pagination**: page sizes vary (~12–20 items); the catalog ends with
  `result: null`. `hasMore` is derived from the item count (threshold 10)
  — a null/empty result stops the infinite scroll.
- Episode titles like `第1集` ("Episode 1") are dropped by the adapter
  (the EP number already carries that info, and the UI font has no CJK
  glyphs).
- If `/allepisode` ever fails, the detail page/watch page fall back to
  `drama.embeddedEpisodes` (the `vod_collection` embedded in `/detail`).

## Security

- `NUNOMIX_TOKEN` is read only in `lib/nunomix/client.ts` (guarded by
  the `server-only` package).
- All URL parameters (`vod_id`, `episode`, `page`, `q`) are validated
  before hitting the upstream API.
- Errors returned to the browser are a small set of friendly strings;
  raw upstream payloads are logged server-side only.
- No DRM/auth/paywall bypass: streams are played exactly as the API
  provides them. Content must be licensed/distributed lawfully.

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Every section shows “Something went wrong.” | Token missing/invalid → check `.env.local`, restart the dev server. |
| `NUNOMIX_TOKEN is not set` in server console | Copy `.env.example` → `.env.local` and restart. |
| Upstream `HTTP 401` in server log | Token invalid. Store it **raw** (URL-decoded) in `.env.local` — the client URL-encodes it automatically; a pre-encoded token gets double-encoded and fails. |
| “Video tidak dapat diputar.” | That episode's stream failed; use RETRY. Check the server log for the `/api/stream` error. |
| Posters broken in browser | The poster CDN may block your origin — colorful fallback tiles are shown automatically. |


---

## Performance Optimizations

1. **API Caching**: Server-side responses are cached using Next.js Data Cache:
   - Drama list: 60s
   - Recommendations: 120s
   - Detail pages: 600s (10 min)
   - Stream URLs: 30s (short-lived)

2. **Static Generation**: Homepage and static pages are pre-rendered at build time

3. **Image Optimization**: Uses Next.js Image component with remote patterns configured

4. **Timeout Configuration**: API requests timeout after 10 seconds to prevent hanging

5. **Infinite Scroll**: Pagination with IntersectionObserver for smooth loading

## Vercel Deployment Guide

### Quick Deploy

1. **Push to Git**: 
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your repository
   - Framework: Next.js (auto-detected)

3. **Environment Variables**:
   Add these in Vercel Dashboard → Project Settings → Environment Variables:
   ```
   NUNOMIX_BASE_URL=https://nunodrama.my.id/api/nunomix
   NUNOMIX_TOKEN=your-token-here
   SITE_URL=https://your-domain.vercel.app
   ```
   
   Apply to: Production, Preview, Development

4. **Deploy**: Click "Deploy" and wait for build to complete

### Build Settings
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Node Version**: 18.x or later

### Post-Deployment Checklist
- [ ] Test homepage loading
- [ ] Check drama detail pages
- [ ] Verify video player functionality
- [ ] Test search feature
- [ ] Check mobile responsiveness
- [ ] Verify Continue Watching works
- [ ] Test Favorites feature

### Troubleshooting Vercel

| Issue | Solution |
| ----- | -------- |
| Build fails with "NUNOMIX_TOKEN is not set" | Add environment variable in Vercel dashboard |
| 500 errors on API routes | Check function logs in Vercel dashboard → Functions tab |
| Slow loading | Increase function timeout in vercel.json (if needed) |
| Images not loading | Check `remotePatterns` in next.config.ts |

### Custom Domain
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `SITE_URL` environment variable to your custom domain

---

## Development Notes

### Fixed Issues (Latest)
- ✅ Downgraded from Next.js 16.3.5 + React 19 to Next.js 15.1.6 + React 18.3.1 (stability)
- ✅ Fixed TypeScript errors with PageProps → explicit Promise types
- ✅ Removed invalid `allowedDevOrigins` config
- ✅ Fixed ESLint configuration imports
- ✅ Reduced API timeout from 30s to 10s
- ✅ Optimized cache revalidation times
- ✅ Added vercel.json for deployment configuration

### Known Limitations
- React 19 causes build errors with Next.js 15/16 (useContext null)
- Drama posters may fail to load if CDN blocks origin
- Stream URLs may expire (short-lived tokens from upstream API)
