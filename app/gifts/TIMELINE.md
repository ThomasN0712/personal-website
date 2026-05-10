# Gift Match — Build Timeline

## Phase 1 — Foundation (Days 1–2)
- [ ] Supabase: create tables (`profiles`, `gifts`, `action_gifts`, `claims`), RLS policies
- [ ] `_lib/supabase.ts` — typed client + server helper
- [ ] `_lib/types.ts` — shared TypeScript interfaces
- [ ] Route stubs: `layout.tsx`, `[slug]/page.tsx`, `create/page.tsx`, `admin-[token]/page.tsx`
- [ ] `gifts/layout.tsx` — standalone layout (no portfolio nav, gift-app fonts + colors)
- [ ] Migrate `data.jsx` constants (`QUESTIONS`, `ANIMALS`) to typed TS modules

## Phase 2 — Quiz Engine (Days 3–4)
- [ ] `_hooks/useQuiz.ts` — state machine (narration → questions → reveal)
- [ ] `QuizScreen.tsx` — orchestrator, act-based background color
- [ ] `QuizNarration.tsx` — opening full-screen interstitial
- [ ] `QuizQuestion.tsx` — single question card with slide transitions
- [ ] `CompanionAnimal.tsx` — expression state + crossfade swap
- [ ] `_lib/scoring.ts` — `scoreAnswers`, `assignAnimal`, `confidenceLabel` (from data.jsx)
- [ ] Act palette transitions (Q1–4 amber, Q5–8 warm, Q9–12 dark)

## Phase 3 — Reveal + Results (Days 5–7)
- [ ] `AnimalReveal.tsx` — cinematic 8-step sequence (SVG stroke → fill → name → CTA)
- [ ] `ResultsScreen.tsx` — scroll layout orchestrator
- [ ] `QuadrantGraph.tsx` — custom 2D grid, animated dots, user marker spring bounce
- [ ] `GiftCard.tsx` — staggered entrance, claim badge, "I'll get this" button
- [ ] `ClaimModal.tsx` — bottom sheet mobile / centered desktop
- [ ] `ActionGifts.tsx` — static section, always shown
- [ ] `LLMChat.tsx` — chat UI + `/api/chat` integration, animal-specific opener
- [ ] `_lib/matching.ts` — `getTopMatches` with Supabase claims (from data.jsx)

## Phase 4 — Profile Creation (Days 8–10)
- [ ] `/api/auth/magic-link` route (Supabase magic link email)
- [ ] `create/page.tsx` — multi-step form (email → profile details → gifts → review)
- [ ] `GiftPlacementGrid.tsx` — drag-and-drop 2D grid with labeled axes
- [ ] `AnimalPicker.tsx` — companion animal selector with preview
- [ ] Slug availability check (real-time, debounced Supabase query)
- [ ] Admin token generation + one-time display on completion

## Phase 5 — Admin View (Day 11)
- [ ] `admin-[token]/page.tsx` — server-rendered claims dashboard
- [ ] Claims table: gift name, count, claimer names, timestamps
- [ ] Token validation (compare against `profiles.admin_token`)

## Phase 6 — Polish + QA (Days 12–14)
- [ ] SVG animal assets (all 5 animals × 6 expression states)
- [ ] Scene illustrations for Q2, Q4, Q6, Q8, Q10, Q12
- [ ] `prefers-reduced-motion` degrades across all animations
- [ ] Mobile pass: companion header strip, quadrant simplified view, bottom sheet
- [ ] Real-time claim count updates via Supabase Realtime subscription
- [ ] Error states, loading skeletons, empty states
- [ ] End-to-end test: full quiz → claim → admin view

---

**Progress key**: `[ ]` = not started · `[~]` = in progress · `[x]` = done
