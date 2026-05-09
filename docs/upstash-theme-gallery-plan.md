# Upstash Counter + Theme Picker + Gallery — Implementation Plan 🔧

## TL;DR ✅
Add a small, free-tier-friendly page view counter backed by Upstash Redis (global site count only, cookie-based dedupe). Extend the existing theme handling to include a color palette picker saved in localStorage, and initially reuse the existing `Carousel` for image galleries with the option to replace it with a lightweight `Gallery` component later.

---

## Decisions & Constraints 🎯
- Backend: **Upstash Redis** (free tier, atomic INCR, low complexity). ✅
- Scope: **Global site counter** displayed in the footer (lowest cost and complexity). ✅
- Dedupe: **Cookie-only** (set `viewed_site` with TTL 1 day; simple and effective for a personal site). ✅
- Keep dependency footprint minimal and use the Next.js App Router (`app/api/*` route handlers) and client components for UI.

---

## Goals
- Minimal cost (works on free tier).
- Minimal runtime overhead and dependencies.
- Privacy-considerate and simple dedupe (cookie-based).
- Extendable (per-page counters or stronger dedupe can be added later).

---

## High-Level Architecture
- Server: `app/api/views/route.ts` — server-only route that talks to Upstash. Supports `GET /api/views` to read and `POST /api/views` to increment (cookie-aware).
- Lib: `app/_lib/upstash.ts` — wrapper helper for Redis operations.
- Client: `app/_components/ui/PageViewCounter.tsx` — client component that calls the API and displays count (used in `FooterSection`).
- Theme: `app/_components/ui/ThemePicker.tsx` — client palette picker saving to `localStorage` and updating CSS variables; keep `next-themes` / `ThemeProvider` integration.
- Gallery: reuse `app/_components/ui/Carousel.tsx` initially in project pages; optional `Gallery.tsx` with modal lightbox later.

---

## API Spec (Design) 📡
- Endpoint: `POST /api/views` (body { slug?: string } optional)
  - Behavior: If cookie `viewed_site` exists, do not increment; else atomically INCR `views:site` and set cookie `viewed_site = 1` with TTL 1 day.
  - Response: `{ count: number }` — current value after operation.
- Endpoint: `GET /api/views`
  - Behavior: Return the current `views:site` without changing it.
  - Response: `{ count: number }`.

Redis key naming conventions
- Global: `views:site`
- Optionally per-page: `views:page:<slug>`
- Rate-limit (optional): `rl:ip:<hash>` with short TTL (e.g., 60s) — not used in cookie-only start.

Cookies
- Name: `viewed_site` (TTL: 1 day)
- Purpose: short-lived dedupe to avoid counting repeated refreshes in the same session day.

Security & runtime
- Keep Upstash secrets server-only in environment variables.
- Prefer edge-compatible runtime (`export const runtime = 'edge'`) but server runtime is fine.

---

## Files to Add / Modify
Add (server-side)
- `app/api/views/route.ts` — server route (GET/POST contract above).
- `app/_lib/upstash.ts` — encapsulate Upstash fetch/commands.

Add (client-side components)
- `app/_components/ui/PageViewCounter.tsx` — fetches and displays count (client-only).
- `app/_components/ui/ThemePicker.tsx` — palette picker (saves to `localStorage`, updates CSS variables or adds a theme class).
- Optional later: `app/_components/ui/Gallery.tsx` — grid + lightbox.

Modify
- `app/_components/FooterSection.tsx` — insert `<PageViewCounter />` (global location).
- `app/_components/ui/Navbar.tsx` — add `<ThemePicker />` next to the existing `DarkModeToggle`.
- `tailwind.config.ts` and `app/_styles/globals.css` — add CSS variable hooks for palette colors.
- `app/work/[projectName]/page.tsx` — reuse `Carousel` or swap to `Gallery` for project images.

---

## Env Vars & Secrets 🔐
- Required (Upstash):
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- Add these to `.env.local` for development and set secrets in your hosting provider (Vercel/Netlify/etc.).
- Add `.env.example` with placeholder keys for repo documentation.

---

## Theme Picker Details 🎨
- Use `localStorage` key `theme-palette` to persist palette choice.
- Choose approach: CSS variables (recommended) so Tailwind classes can reference `rgb(var(--accent) / <alpha>)`.
- Update `tailwind.config.ts` to include color references to CSS variables for `accent` to make design tokens consistent.
- `ThemePicker` should be a small, client-only UI with a few color swatches plus dark/light toggle integration.

---

## Gallery Notes 🖼️
- Initial approach: reuse existing `Carousel` (no new dependencies). If you want a lightbox later, build `Gallery.tsx` with a modal, `next/image`, keyboard navigation, and accessible focus trap.
- Keep lazy-loading and optimize image sizes to avoid slowing down the site.

---

## Testing & CI ✅
- Add Vitest + Testing Library for unit & small integration tests.
  - Test the API route with a mocked Upstash client or a test Redis instance.
  - Test `ThemePicker` localStorage persistence and applied DOM variables/classes.
- Add simple GH Actions workflow that runs lint + tests on push.

---

## Implementation Steps (recommended order) ▶️
1. Create `app/_lib/upstash.ts` (helper that reads env vars and provides `getCount` / `incrementCount`).
2. Add `app/api/views/route.ts` implementing the GET/POST contract and cookie set logic.
3. Add `app/_components/ui/PageViewCounter.tsx` (client) and integrate into `FooterSection`.
4. Add `app/_components/ui/ThemePicker.tsx` and integrate into `Navbar`.
5. Update `tailwind.config.ts` + `globals.css` to use CSS variables for accent colors.
6. Add tests (Vitest) and a minimal CI workflow.
7. Optional: add per-page counters later and/or IP throttle if needed.

Estimated time: 3–6 hours for basic end-to-end (API + client + tests) depending on testing depth.

---

## Security & Privacy Notes ⚖️
- Counters are anonymized; cookie-based dedupe does not log personal info.
- Do not expose Upstash tokens to client code; keep them in server environment variables.

---

## Next Steps — Choose one
- I can scaffold the files and tests (no implementation details beyond file creation + TODOs) so you can review structure before code. ✅
- Or I can implement the basic API + `PageViewCounter` and `ThemePicker` end-to-end with tests (requires env vars for Upstash to fully test). 🔧

Which would you like me to do next? (Scaffold files only / Implement end-to-end) 

---

> Notes: This plan keeps the footprint small (no heavy libs), adheres to free-tier constraints, and avoids adding unnecessary runtime dependencies. You can iterate later to add per-page counters, stricter deduping, and an advanced gallery/lightbox if needed.
