# Gift Match — Build Timeline

## Phase 1 — Foundation (Days 1–2) ✓
- [x] Supabase: create tables (`profiles`, `gifts`, `action_gifts`, `claims`), RLS policies → `DB_SCHEMA.md`
- [x] `_lib/supabase.ts` — typed client + server helper
- [x] `_lib/types.ts` — shared TypeScript interfaces
- [x] Route stubs: `layout.tsx`, `[slug]/page.tsx`, `create/page.tsx`, `[slug]/admin/[token]/page.tsx`
- [x] `gifts/layout.tsx` — standalone layout (Playfair Display + DM Sans, no portfolio nav)
- [x] Migrate `data.jsx` constants → `_lib/animals.ts`, `_lib/questions.ts`, `_lib/scoring.ts`

## Phase 2 — Quiz Engine (Days 3–4) ✓
- [x] `_hooks/useQuiz.ts` — state machine (narration → questions → reveal), ref-based answers, expression derivation
- [x] `QuizScreen.tsx` — orchestrator, act-based background color with Framer Motion animate
- [x] `QuizNarration.tsx` — full-screen opening interstitial, staggered fade
- [x] `QuizQuestion.tsx` — segmented progress bar, slide in/out transitions, option feedback
- [x] `CompanionAnimal.tsx` — expression crossfade (emoji placeholder; SVG in Phase 6)
- [x] `_lib/scoring.ts` — `scoreAnswers`, `assignAnimal`, `confidenceLabel` (done in Phase 1)
- [x] Act palette transitions — `#1C1005` (act 1) → `#130C03` (act 2) → `#0C1521` (act 3), 1.2s ease

## Phase 3 — Reveal + Results (Days 5–7) ✓
- [x] `AnimalReveal.tsx` — cinematic 8-step sequence (SVG stroke → fill → name → CTA)
- [x] `ResultsScreen.tsx` — scroll layout orchestrator
- [x] `QuadrantGraph.tsx` — custom 2D grid, animated dots, user marker spring bounce
- [x] `GiftCard.tsx` — staggered entrance, claim badge, "I'll get this" button
- [x] `ClaimModal.tsx` — bottom sheet mobile / centered desktop
- [x] `ActionGifts.tsx` — static section, always shown
- [x] `LLMChat.tsx` — chat UI + `/api/chat` integration, animal-specific opener
- [x] `_lib/matching.ts` — `getTopMatches` with Supabase claims (from data.jsx)

## Phase 4 — Profile Creation (Days 8–10)
- [ ] `/api/auth/magic-link` route (Supabase magic link email)
- [ ] `create/page.tsx` — multi-step form (email → profile details → gifts → review)
- [ ] `GiftPlacementGrid.tsx` — drag-and-drop 2D grid with labeled axes
- [ ] `AnimalPicker.tsx` — companion animal selector with preview
- [ ] Slug availability check (real-time, debounced Supabase query)
- [ ] Admin token generation + one-time display on completion

## Phase 5 — Admin View (Day 11)
- [ ] `[slug]/admin/page.tsx` — server-rendered claims dashboard (stub exists, needs auth session wiring)
- [ ] Claims table: gift name, count, claimer names, timestamps
- [ ] Auth gate: redirect to login if no active session / `owner_id` mismatch

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
