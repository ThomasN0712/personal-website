# Gift Match — Technical Specification

---

## 1. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Already in repo |
| Styling | Tailwind CSS 3 | Already in repo |
| Animation | Framer Motion 11 | Already in repo |
| Icons | Lucide React | Already in repo |
| DB client | `@supabase/supabase-js` | Already in repo |
| Validation | Zod 4 | Already in repo |
| Class merging | `clsx` + `tailwind-merge` | Already in repo |
| LLM API | `@anthropic-ai/sdk` | **Needs install** |
| DB / Auth | Supabase (Postgres + Magic Link Auth) | Free tier |
| Email (auth) | Supabase Auth built-in (magic link) | No SendGrid needed for auth |
| Deployment | Vercel (existing pipeline) | Automatic via Next.js |

**Install needed:**
```bash
npm install @anthropic-ai/sdk
```

---

## 2. File Structure

```
app/gifts/
  layout.tsx                     ← standalone layout; overrides portfolio nav completely
  page.tsx                       ← redirects to /gifts/thomas (default) or future directory

  [slug]/
    page.tsx                     ← server component: fetches profile + gifts from Supabase
    admin-[token]/
      page.tsx                   ← server component: validates token, renders claims dashboard

  create/
    page.tsx                     ← client: multi-step profile creation flow

  api/
    chat/
      route.ts                   ← POST: Anthropic API proxy (key stays server-side)
    auth/
      magic-link/
        route.ts                 ← POST: triggers Supabase magic link email

  _components/
    quiz/
      QuizScreen.tsx             ← orchestrator, owns quiz phase state
      QuizNarration.tsx          ← opening interstitial, full-screen fade
      QuizQuestion.tsx           ← single question card + answer options
      CompanionAnimal.tsx        ← persistent character, expression crossfade
    reveal/
      AnimalReveal.tsx           ← cinematic 8-step reveal sequence
    results/
      ResultsScreen.tsx          ← scroll layout, sections in order
      QuadrantGraph.tsx          ← custom 2D SVG graph, animated dots
      GiftCard.tsx               ← gift card with claim badge
      ClaimModal.tsx             ← bottom sheet (mobile) / dialog (desktop)
      ActionGifts.tsx            ← static gesture section
      LLMChat.tsx                ← chat interface + message list
    create/
      GiftPlacementGrid.tsx      ← drag-and-drop 2D coordinate grid
      AnimalPicker.tsx           ← animal selector with preview
      ProfileForm.tsx            ← multi-step form wrapper
    admin/
      ClaimsTable.tsx            ← read-only claims dashboard
    ui/
      BottomSheet.tsx            ← shared mobile bottom sheet (Framer Motion)
      Badge.tsx                  ← price tier / claim status badges

  _lib/
    supabase.ts                  ← browser client + server client (separate)
    types.ts                     ← shared TypeScript interfaces
    scoring.ts                   ← scoreAnswers(), assignAnimal(), confidenceLabel()
    matching.ts                  ← getTopMatches() with claim deprioritization
    animals.ts                   ← ANIMALS constant, palettes, chat openers
    questions.ts                 ← QUESTIONS array (migrated from data.jsx)

  _hooks/
    useQuiz.ts                   ← quiz state machine hook
    useClaims.ts                 ← Supabase Realtime subscription for live claim counts
```

---

## 3. Routing

| URL | Component | Data source |
|---|---|---|
| `/gifts` | `page.tsx` | Static redirect |
| `/gifts/[slug]` | `[slug]/page.tsx` | Supabase server fetch |
| `/gifts/[slug]/admin-[token]` | `admin-[token]/page.tsx` | Supabase server fetch + token check |
| `/gifts/create` | `create/page.tsx` | Client-only |
| `/api/chat` | `route.ts` | Anthropic API (server) |
| `/api/auth/magic-link` | `route.ts` | Supabase Auth (server) |

`/gifts/[slug]/page.tsx` is a **server component** that passes profile data as props to the quiz client component. All quiz state is client-side and never persisted.

---

## 4. Database Schema

### `profiles`
```sql
create table profiles (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,           -- URL segment, e.g. "thomas"
  display_name    text not null,
  bio             text,                           -- LLM system context
  companion_animal text not null,                 -- 'raccoon'|'pig'|'wolf'|'horse'|'gorilla'
  email           text not null,
  admin_token     text unique not null,           -- random UUID, shown once at creation
  accent_color    text,                           -- optional hex, fallback to animal palette
  created_at      timestamptz default now()
);
```

### `gifts`
```sql
create table gifts (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles(id) on delete cascade,
  name        text not null,
  description text,
  x           float not null,                    -- sentimental(-) <-> experiential(+)
  y           float not null,                    -- functional(-) <-> aesthetic(+)
  price       numeric,
  price_tier  text,                              -- '$30–$75' | '$75–$150' | '$150+'
  store_name  text,
  store_url   text,
  created_at  timestamptz default now()
);
```

### `action_gifts`
```sql
create table action_gifts (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles(id) on delete cascade,
  emoji       text,
  title       text not null,
  body        text not null,
  sort_order  int default 0
);
```

### `claims`
```sql
create table claims (
  id            uuid primary key default gen_random_uuid(),
  gift_id       uuid references gifts(id) on delete cascade,
  claimer_name  text,                            -- optional, never shown to other visitors
  claimed_at    timestamptz default now()
);
```

### Row-Level Security

```sql
-- Profiles: public read, authenticated insert (magic link session)
alter table profiles enable row level security;
create policy "public read" on profiles for select using (true);
create policy "auth insert" on profiles for insert with check (auth.role() = 'authenticated');

-- Gifts: public read, owner write (match on email via profiles join)
alter table gifts enable row level security;
create policy "public read" on gifts for select using (true);

-- Claims: public read + insert, no update/delete from client
alter table claims enable row level security;
create policy "public read" on claims for select using (true);
create policy "public insert" on claims for insert with check (true);

-- Action gifts: public read
alter table action_gifts enable row level security;
create policy "public read" on action_gifts for select using (true);
```

---

## 5. TypeScript Interfaces (`_lib/types.ts`)

```ts
export type AnimalKey = 'raccoon' | 'pig' | 'wolf' | 'horse' | 'gorilla';

export interface Profile {
  id: string;
  slug: string;
  display_name: string;
  bio: string | null;
  companion_animal: AnimalKey;
  accent_color: string | null;
}

export interface Gift {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  x: number;
  y: number;
  price: number | null;
  price_tier: string | null;
  store_name: string | null;
  store_url: string | null;
}

export interface ActionGift {
  id: string;
  emoji: string | null;
  title: string;
  body: string;
  sort_order: number;
}

export interface Claim {
  id: string;
  gift_id: string;
  claimer_name: string | null;
  claimed_at: string;
}

export interface MatchedGift extends Gift {
  distance: number;
  claimCount: number;
}

export type QuizPhase = 'narration' | 'quiz' | 'reveal' | 'results';

export interface QuizState {
  phase: QuizPhase;
  currentQuestion: number;
  answers: Array<{ dx: number; dy: number }>;
  score: { x: number; y: number } | null;
  animal: AnimalKey | null;
  budgetTier: string | null;
}
```

---

## 6. Key Components

### `QuizScreen.tsx`
- Client component, receives `profile` + `gifts` as props
- Owns `QuizState` via `useQuiz` hook
- Renders: `QuizNarration` → `QuizQuestion` (×12) → `AnimalReveal` → `ResultsScreen`
- Manages act-based background color transitions via Framer Motion `AnimatePresence`

### `useQuiz.ts`
- State machine: `phase`, `currentQuestion`, `answers[]`, computed `score`, `animal`
- `advance(answer)` — appends answer, increments question, triggers phase changes
- `score` computed on final answer via `scoreAnswers()` from `_lib/scoring.ts`
- No persistence — session only

### `CompanionAnimal.tsx`
- Props: `animalKey`, `expression` (`neutral|curious|delighted|thoughtful|excited|peaceful`)
- Swaps SVG asset with 200ms crossfade (`AnimatePresence` + `motion.img`)
- Desktop: fixed right panel. Mobile: header strip (smaller, same expressions)
- Expression is driven by question index and narrative context, not by answer choice

### `AnimalReveal.tsx`
- 8-step sequence using Framer Motion `useAnimate` or sequential `variants`
- Step timing: fade card → shift background → SVG stroke draw → fill → name → description → pause → CTA
- SVG path stroke animation: `pathLength` 0→1, then fill opacity 0→1
- This screen is the most important — animations must be unhurried (~5s total)

### `QuadrantGraph.tsx`
- Custom SVG, no chart library
- Soft grid lines, labeled axes ("Sentimental ↔ Experiential", "Functional ↔ Aesthetic")
- Gift dots: animate in one-by-one with stagger
- User marker: arrives last, spring bounce (`type: "spring", stiffness: 200`), persistent pulse
- Top 3 gifts highlighted with accent color
- Mobile: simplified — only shows user's quadrant position, no gift dots

### `ClaimModal.tsx`
- Mobile: bottom sheet (`y` drag with Framer Motion pan gesture, snap to closed)
- Desktop: centered modal with backdrop
- Optional name field (controlled input)
- On confirm: `INSERT INTO claims` via Supabase browser client, optimistic UI update

### `LLMChat.tsx`
- Calls `POST /api/chat` with message history
- `/api/chat/route.ts` proxies to Anthropic API with profile `bio` as system prompt
- Opening message from `ANIMALS[animal].chatOpener`
- Messages animate in with upward drift + fade
- Input pinned to bottom of section, not the viewport

### `GiftPlacementGrid.tsx` (create flow)
- Interactive SVG grid, −5 to +5 on both axes
- Drag gift item dots to position; x/y stored as floats
- Axis labels show examples: "sentimental (photos, handmade)" / "experiential (concert, class)"
- Mobile fallback: x/y sliders with examples shown alongside

---

## 7. API Routes

### `POST /api/chat`
```ts
// Body: { messages: {role, content}[], profileBio: string, animalKey: string }
// Returns: streaming text response
// Uses: Anthropic SDK, model: claude-haiku-4-5 (fast, cheap for chat)
// Key: ANTHROPIC_API_KEY env var (server-side only)
```

### `POST /api/auth/magic-link`
```ts
// Body: { email: string }
// Calls: supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })
// Returns: { success: true } or error
```

---

## 8. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-only (admin views, profile creation)

# Anthropic
ANTHROPIC_API_KEY=               # server-only (never exposed to browser)
```

---

## 9. Animation Reference

| Moment | Library | Key params |
|---|---|---|
| Question slide transition | Framer Motion | `x: ±60`, `opacity`, 300ms ease-in-out |
| Companion expression swap | Framer Motion AnimatePresence | 200ms crossfade |
| Answer selection feedback | CSS + Framer Motion | scale 1.02, color fill, 150ms |
| Animal reveal sequence | Framer Motion useAnimate | Sequential, ~5s total |
| SVG stroke draw | Framer Motion `pathLength` | 0→1, ~1.5s ease-in-out |
| Gift card stagger | Framer Motion | 150ms delay between cards, y: 20→0 |
| Graph dot stagger | Framer Motion | 60ms between dots |
| User marker arrival | Framer Motion | spring, stiffness: 200, damping: 15 |
| Claim modal (mobile) | Framer Motion pan gesture | snap points: [0, 100%] |
| LLM message entrance | Framer Motion | y: 12→0, opacity, 200ms |
| `prefers-reduced-motion` | CSS media query + Framer Motion | All durations → 0, no transforms |
