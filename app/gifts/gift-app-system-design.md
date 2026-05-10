# Gift Match — Product & System Design Spec
### Version 1.0 (Final) · thomasnguyen.tech/gifts

---

## 1. What This Is

Gift Match is a personalized gift discovery experience. A visitor takes a 12-question narrative adventure quiz, gets matched to one of five animal archetypes based on their personality, and receives curated gift recommendations ranked by how closely their taste aligns with each item on the profile owner's list.

The experience is built to feel personal, cinematic, and mobile-first — not a generic quiz template. It lives as a route inside an existing Next.js personal website and functions as a standalone experience with its own visual identity.

The app launches as a multi-profile platform. Any person can create a Gift Match profile and share their link. The quiz, animals, and algorithm are universal — only the gift list, persona, and profile owner's companion animal change per profile.

---

## 2. Who Uses It

**Quiz Taker (Friend or Family Member)**
A visitor who received a profile link. They take the quiz, get their animal reveal and matched gifts, optionally claim a gift, and optionally chat with the LLM. No account required. No persistent identity unless they voluntarily provide a name during claiming.

**Profile Owner**
Anyone who creates a Gift Match profile. They set up their gift list, write a short persona description, choose their companion animal, and share their profile URL. They access an admin view to monitor gift claims.

**Admin View**
A read-only dashboard accessible to the profile owner via their admin URL. Shows full gift list with claim status, claimer names, and timestamps.

---

## 3. Core Features

### 3.1 Profile Creation
Any person can create a Gift Match profile. A profile consists of:
- Display name and custom slug (e.g. `/gifts/thomas`)
- A short bio / taste description (used to power the LLM chat)
- Their selected companion animal (chosen from the same 5 animals)
- Their curated gift list — each item placed on a 2D coordinate grid
- Their personal action gift suggestions (2–3 free/low-cost gesture ideas)
- A budget range preference (optional, used to pre-filter recommendations)

Profile creation uses magic link email authentication — no passwords. Once authenticated, the profile owner gets access to a simple dashboard to manage their data and view claims.

### 3.2 The Quiz
- 12 questions presented as narrative adventure scenes
- Questions vary in structure: some have 2 choices, some 3, some 4 — whatever feels right for that story beat
- Some questions include a scene illustration above the question text — a visual that sets atmosphere for that moment
- One question at a time, full screen attention
- No character selection upfront — the animal is a discovery at the end
- Answers accumulate a score on two axes:
  - **X axis**: Sentimental (−) ↔ Experiential (+)
  - **Y axis**: Functional (−) ↔ Aesthetic (+)

### 3.3 The Companion Animal
The profile owner selects one of the five animals as their companion. This animal character appears on the right side of the quiz screen throughout the entire experience and reacts to the story as it unfolds.

The companion serves as an ambient guide — present but not intrusive. It doesn't speak or direct the quiz taker. It simply exists in the world of the story, making the experience feel inhabited and personal.

**Expression system**: The companion animal has multiple illustrated expressions or poses that swap as the quiz progresses. Expressions map to narrative context, not to the user's specific answers, so there's no "wrong" feeling association. Example states:

| Expression | When it appears |
|-----------|----------------|
| Neutral / walking | Default, between scenes |
| Curious / leaning in | When a question loads |
| Delighted | After an answer is selected |
| Thoughtful | During the deep forest act |
| Excited | Final questions approaching reveal |
| Eyes closed, peaceful | Transition to reveal screen |

Expressions swap with a small crossfade animation — not a jarring cut. The animal's position stays fixed on the right; only the illustration changes.

On mobile, the companion animal moves to the top of the screen as a smaller header illustration, still changing expressions as the quiz progresses.

### 3.4 Animal Reveal
After the final question, a full-screen cinematic reveal sequence:
1. Quiz card fades and slides down
2. Background shifts to a deep atmospheric color (the animal's palette)
3. Animal SVG silhouette draws in via path stroke animation — center screen
4. Silhouette fills with color
5. Name appears: *"You are The Raccoon."*
6. 2–3 sentence personality description fades in
7. A pause — let it breathe
8. CTA appears: *"See your gifts →"*
9. Transition to results

The reveal is the most important screen in the app. It must feel cinematic and unhurried. This is what people screenshot and share.

### 3.5 Gift Matching
- Each gift item has x/y coordinates placing it in the same 2D space as the user's score
- Budget filter applied first, then Euclidean distance ranking
- Top 3 closest gifts are surfaced
- Claimed gifts (2+ claims) are deprioritized in ranking but never hidden
- Magnitude (distance from center) drives confidence language — strong scores get definitive copy, weak scores lean into ambiguity

### 3.6 Gift Claiming
- Any visitor can claim a gift from the results screen
- Name input is optional — stored if provided, never shown to other visitors
- Multiple people can claim the same gift (no conflict prevention — friends coordinate in person)
- Claims are permanent from the UI — deletion only via database by the profile owner
- Gifts with 2+ claims show a visual badge and are deprioritized in recommendations
- Claim state is visible to all visitors; claimer identity is not

### 3.7 Action Gifts
- A fixed set of 2–3 personal gesture suggestions set by the profile owner
- Always shown on results, not algorithm-driven
- Framed as an alternative for visitors who don't want to purchase something

### 3.8 LLM Gift Chat
- Chat interface powered by the Anthropic API
- Pre-loaded with the profile owner's taste description as system context
- Used for open-ended "is this a good gift idea?" conversations
- Gorilla archetype scorers and low-confidence scorers see this section surfaced more prominently
- Opening message varies by the quiz taker's assigned animal
- Session-only — no conversation persistence

### 3.9 Admin View
- Accessible via a unique admin URL per profile (no password in v1 — obscure URL as access control)
- Shows full gift list with per-gift claim counts, claimer names, and timestamps
- Read-only in v1

---

## 4. The Five Animals

### Quiz Taker Assignment
The quiz taker's animal is assigned based on their final score coordinates.

| Animal | X | Y | Personality |
|--------|---|---|-------------|
| 🦝 Raccoon | Experiential (+) | Aesthetic (+) | Opportunistic and delightful — drawn to beautiful, novel things. Finds joy in the unexpected. |
| 🐷 Pig | Sentimental (−) | Functional (−) | Grounded and generous — values comfort, quality, and things that last. Not flashy, deeply reliable. |
| 🐺 Wolf | Experiential (+) | Functional (−) | Driven and purposeful — wants tools, gear, things that perform. Practical with high standards. |
| 🐴 Horse | Sentimental (−) | Aesthetic (+) | Steady and considered — drawn to things with meaning and craft. Keeps things forever. |
| 🦍 Gorilla | Center (low magnitude) | Center (low magnitude) | Complex and hard to pin down. Values intentionality over category. The LLM chat is their best path. |

```js
function assignAnimal(x, y) {
  const magnitude = Math.sqrt(x ** 2 + y ** 2);
  if (magnitude < 1.5) return 'gorilla';
  if (x > 0 && y > 0)  return 'raccoon';
  if (x < 0 && y < 0)  return 'pig';
  if (x > 0 && y < 0)  return 'wolf';
  if (x < 0 && y > 0)  return 'horse';
}
```

### Profile Owner Selection
The profile owner picks their own animal during profile setup — this becomes their companion character on the quiz screen. It's a personal expression, not algorithmically assigned. All 5 animals are available.

---

## 5. The Quiz — Full Story & Questions

### Opening Narration
Shown as a brief interstitial before Q1 — full screen, atmospheric, fades out:

> *"Deep in a forest that exists somewhere between sleep and memory, five paths begin at the same place. Your choices will reveal which creature you truly are."*

### Narrative Acts
The background shifts subtly across three acts — ambient color temperature changes, not jarring scene breaks:
- **Act 1 (Q1–4) — Setting Out**: Warm dawn palette, amber and soft gold
- **Act 2 (Q5–8) — The Village**: Midday richness, slightly warmer
- **Act 3 (Q9–12) — Deep Forest & Celebration**: Cooler, darker, more atmospheric

### Question Format
Questions vary. Not every question needs four choices — some story moments are binary, some have three paths, some four. Some questions include an illustration above the text that sets atmosphere for the scene. Illustrations are not answer-specific; they depict the scene itself.

---

**Q1 — The Fork at Dawn** *(4 choices · no illustration)*
*The trail splits before you've gone a mile. The forest is quiet.*

> **Where do you go first?**
> - A) A sculptor's workshop, half-finished work on the table `[−1, +2]`
> - B) A busy morning market, smells and noise `[+2, +1]`
> - C) A quiet clearing where travelers leave things behind `[−2, −1]`
> - D) A steep trail toward a view you've heard about for years `[+1, −2]`

---

**Q2 — The Traveler's Pack** *(4 choices · illustration: mossy log in dappled forest light)*
*A pack was left on a mossy log. Inside: four things. You can only keep one.*

> **What do you take?**
> - A) A worn illustrated map with handwritten notes `[−2, +1]`
> - B) A perfect multi-tool, barely used `[+1, −2]`
> - C) A jar of something that smells extraordinary `[+2, +2]`
> - D) A ribbon from a faraway festival, faded but beautiful `[−1, +2]`

---

**Q3 — The First Village** *(4 choices · no illustration)*
*You arrive midday. A village is celebrating something. Music is playing.*

> **What pulls your attention first?**
> - A) A banner someone painted by hand, rippling in the wind `[−1, +2]`
> - B) The water wheel someone repaired — it's running perfectly `[+1, −2]`
> - C) The communal table being set with food from everywhere `[+2, −1]`
> - D) An elder telling the story of how the village was founded `[−2, +1]`

---

**Q4 — The Innkeeper's Offer** *(2 choices · illustration: two contrasting room thumbnails side by side)*
*The innkeeper has two rooms left.*

> **Which do you take?**
> - A) Mountain view, wildflowers on the table, cold and bright `[+1, +2]`
> - B) Fireplace room, worn quilts, warm and dark `[−2, −2]`

---

**Q5 — The Village Request** *(4 choices · no illustration)*
*Before you leave, a villager asks for help. You have a few hours.*

> **What do you do?**
> - A) Paint the new festival banner `[−1, +2]`
> - B) Fix the broken gate on the eastern side `[+1, −2]`
> - C) Organize the shared meal for the evening `[+2, −1]`
> - D) Sit with the old craftsman and learn how he makes things `[−2, +1]`

---

**Q6 — The Deep Forest** *(4 choices · illustration: cave entrance glowing faintly)*
*The path darkens. The trees are older here. A cave glows faintly.*

> **What's inside?**
> - A) Ancient carvings tracing the history of every creature that passed through `[−2, +1]`
> - B) A perfectly preserved set of explorer's tools `[+1, −2]`
> - C) Rare ingredients and strange jars — someone was cooking something remarkable `[+2, +1]`
> - D) A collection of small beautiful objects, each placed with intention `[−1, +2]`

---

**Q7 — The River Crossing** *(3 choices · no illustration)*
*A wide river. Three crossings available.*

> **How do you cross?**
> - A) The old stone bridge — slower, but you can look at everything `[−1, +1]`
> - B) The rope crossing — efficient, direct, a little dangerous `[+2, −2]`
> - C) Wade through with the group of travelers doing the same `[+1, +2]`

---

**Q8 — The Night Camp** *(4 choices · illustration: campfire ringed by silhouetted trees)*
*You make camp with other travelers. The fire is going.*

> **What's your role?**
> - A) You arrange the space — find the right rocks, make it feel like somewhere `[−1, +2]`
> - B) You get the fire going and sort the supplies `[+1, −2]`
> - C) You're the one people end up talking to until too late `[+2, +1]`
> - D) You listen, and remember everything that was said `[−2, +1]`

---

**Q9 — The Market Town** *(3 choices · no illustration)*
*A larger town. One hour, a small amount of coin.*

> **What do you buy?**
> - A) Something beautiful you've never seen and will never find again `[−1, +2]`
> - B) Something you've needed and couldn't justify until now `[+2, −2]`
> - C) An experience — a meal, a show, a lesson `[+1, +1]`

---

**Q10 — The Artisan's Shop** *(4 choices · illustration: cluttered warm workshop interior)*
*One shop catches your eye. Everything inside is handmade.*

> **What do you spend the most time with?**
> - A) Objects that are beautiful first, useful second `[−1, +2]`
> - B) Tools and instruments made to last a lifetime `[+1, −2]`
> - C) Things that tell a story about where they came from `[−2, +1]`
> - D) Things that solve a problem you didn't know you had `[+2, −1]`

---

**Q11 — The Last Night** *(4 choices · no illustration)*
*You're close. One more camp before the celebration.*

> **How do you spend the evening?**
> - A) You make the camp feel like somewhere worth remembering `[−1, +2]`
> - B) You prep for the morning — pack organized, route confirmed `[+2, −1]`
> - C) You sit with the strangest traveler in the group and hear their story `[−2, +1]`
> - D) You go off on your own and see what the forest looks like at night `[+1, +2]`

---

**Q12 — The Celebration** *(4 choices · illustration: celebration scene from above, lanterns and motion)*
*You've arrived. It's everything you imagined.*

> **What do you contribute?**
> - A) You create something for the space — a decoration, something visual `[−1, +2]`
> - B) You find the thing that's broken and quietly fix it `[+1, −2]`
> - C) You organize a shared moment that brings everyone together `[+2, +1]`
> - D) You find the oldest person there and ask what they remember `[−2, +1]`

---

### Scoring
Sum all `[Δx, Δy]` values across 12 questions. Normalize to a −5 to +5 range. Assign animal per Section 4.

```js
const normalizedX = (rawX / 24) * 5;
const normalizedY = (rawY / 24) * 5;
const magnitude = Math.sqrt(normalizedX ** 2 + normalizedY ** 2);
const confidence = magnitude / 5; // 0 to 1
```

---

## 6. Results Screen

The results page is a single scrollable screen. Sections in order:

### 6.1 Animal Reveal
Full-screen cinematic moment per Section 3.4. After CTA, page scrolls or transitions into the results layout.

### 6.2 Personality + Confidence
Archetype name, description, and confidence-adjusted copy:
- High confidence (>0.7): *"You are absolutely a Wolf."*
- Moderate (0.4–0.7): *"You lean Wolf."*
- Low (<0.4): *"You're harder to read than most."* → LLM chat surfaced prominently

### 6.3 Quadrant Graph
A designed 2D grid — not a chart library default. Soft grid lines, custom dot styles, thoughtful axis labels. All gift items appear as small positioned dots. The user's score plots as a larger distinct marker with a pulsing animation. Top 3 matched gifts are highlighted in a contrasting color. Dots animate into position one by one; user marker arrives last with spring bounce.

### 6.4 Top 3 Matched Gifts
Staggered card entrance (150ms delay between cards). Each card:
- Gift name + one-sentence description
- Price tier badge
- Claim status badge if claimed (🎁 Taken)
- "I'll get this" button → claim modal

**Claim modal**: Bottom sheet on mobile, centered modal on desktop. Optional name field. Confirm button. Visitor never sees claimer names — only claim count.

### 6.5 Action Gifts
Section divider: *"Not shopping? Try this instead."*
2–3 personal gesture suggestions from the profile owner. Always shown, not algorithm-driven.

### 6.6 LLM Gift Chat
Section label: *"Have your own idea? Run it by me."*
Clean chat interface. Opening message varies by the quiz taker's animal:
- **Raccoon**: *"Something unexpected in mind? I'm into it if it's interesting."*
- **Pig**: *"Have something solid in mind? Run it by me."*
- **Wolf**: *"Got something specific? I'll tell you if it actually performs."*
- **Horse**: *"Something thoughtful? Let's see if it lands."*
- **Gorilla**: *"I'm genuinely hard to shop for. Tell me what you're thinking and I'll be honest."*

---

## 7. Data Overview

### What gets stored

**Profiles** — display name, slug, bio/persona text, companion animal selection, action gifts, magic-link email, admin URL token

**Gifts** — name, description, x/y coordinates, price, price tier, store reference. Owned by a profile.

**Claims** — gift reference, optional claimer name, timestamp. Append-only.

### What does NOT get stored
- Quiz answers or scores (calculated client-side, never persisted)
- LLM conversation history (session-only state)
- Quiz taker identity (no tracking, no sessions)

---

## 8. System Architecture

Client-heavy single-page experience within a Next.js app. No dedicated backend server.

```
Next.js App (thomasnguyen.tech)
  │
  ├── /gifts                    ← profile directory or default profile
  ├── /gifts/[slug]             ← individual profile experience
  ├── /gifts/[slug]/admin       ← admin view (obscure token in URL)
  ├── /gifts/create             ← profile creation flow
  │
Browser (React, client components)
  │
  ├── Quiz engine               ← scoring, all client-side
  ├── Animal assignment         ← client-side
  ├── Distance matching         ← client-side
  │
  ├── Supabase
  │     ├── profiles table
  │     ├── gifts table
  │     └── claims table
  │
  └── Anthropic API
        └── /v1/messages via Next.js API route (proxy — key stays server-side)
```

The Anthropic API is called through a Next.js API route (`/api/chat`) — this keeps the API key server-side and never exposed to the browser. All other data calls go through the Supabase JS client directly from the browser.

---

## 9. Hosting & Deployment

**Domain**: `thomasnguyen.tech` (already owned and serving a Next.js portfolio)

**Approach**: Add `/gifts` as a route group within the existing Next.js repo. Not a separate repository.

```
app/
  page.tsx                  ← existing portfolio
  (portfolio)/              ← existing portfolio routes
  gifts/
    layout.tsx              ← completely separate layout, no portfolio nav
    page.tsx                ← profile directory or redirect
    [slug]/
      page.tsx              ← individual profile quiz + results
      admin-[token]/
        page.tsx
    create/
      page.tsx
    _components/            ← gift app components, fully isolated
    _lib/                   ← scoring, matching, animal logic
    _hooks/                 ← gift app hooks
```

The `layout.tsx` inside `/gifts` fully overrides the portfolio layout — different fonts, different colors, no portfolio navigation. The gift app is visually independent.

**Database**: Supabase (free tier). Postgres, JS client, row-level security for multi-profile data isolation.

**Deployment**: Existing deployment pipeline for the Next.js app covers the gift route automatically.

---

## 10. Design Considerations

### 10.1 Visual Identity
Warm, editorial, slightly atmospheric. Not a generic quiz. Not corporate. The design should feel like it was made for one specific person — even as it scales to many profiles.

- Off-white or warm cream base
- One strong accent color per profile (profile owner sets this, or a default palette)
- Dark, weighted typography for headers — a display font with character
- Generous whitespace, purposeful density where content demands it
- Every screen has a defined visual moment

### 10.2 Mobile-First (Non-Negotiable)
The majority of visitors will open this on their phone. Every screen is designed for mobile first, then scaled up for desktop.

Key mobile decisions:
- Quiz: full-screen single question, large tap targets for answer options, thumb-reachable CTAs
- Companion animal: moves to a header strip at the top of the quiz card on mobile, smaller but still expressive
- Question illustrations: full-width above question text, constrained height so question and answers remain visible without scrolling
- Reveal screen: full-screen, no scrolling needed — everything fits in one cinematic view
- Results gift cards: vertically stacked, full width
- Claim modal: bottom sheet, not centered modal
- Quadrant graph: simplified on mobile — a 2D position indicator showing where the user landed, without all gift dots (too small to read). Full interactive graph on desktop.
- LLM chat: fixed input bar at bottom of the chat section, scrollable history above

### 10.3 The Companion Animal — Design Requirements
The companion animal is a semi-persistent character on the quiz screen. It lives on the right side on desktop, top strip on mobile. It needs:

- **6–8 expression states per animal** (neutral, curious, delighted, thoughtful, excited, peaceful, and 1–2 animal-specific extras)
- Expressions are illustrated poses, not just facial changes — the whole body can shift slightly
- Swap animation: soft crossfade, ~200ms
- The character should feel alive without being distracting — it reacts to the story, not to individual answer choices
- Art style should match the reveal SVG illustrations — same visual language across all animal assets

### 10.4 Question Illustrations
Some questions include an atmospheric scene illustration above the question text. Design rules:
- Illustrations depict the scene, not the answers — they set mood, they don't hint at a "right" choice
- Full width, constrained height (especially on mobile — no more than 35–40% of viewport)
- Same art style as companion and reveal illustrations — cohesive visual world
- Not every question needs one — use them where they add atmosphere, not as a checkbox
- Current questions with illustrations: Q2 (mossy log), Q4 (two rooms), Q6 (cave entrance), Q8 (campfire), Q10 (workshop interior), Q12 (celebration overhead)

### 10.5 Animation (First-Class Feature)

**Quiz transitions**: Current question slides left and fades out; next question enters from right and fades in. ~300ms, ease-in-out. Implies forward motion through a story.

**Companion expression swaps**: Crossfade, ~200ms. Never jarring.

**Answer selection**: Selected answer gets immediate visual feedback (color fill, scale), then auto-advances after ~400ms.

**Animal reveal sequence**: The most important animation in the app — see Section 3.4 for full sequence. Unhurried, cinematic. Do not rush this screen.

**Results stagger**: Gift cards enter with 150ms delay between each, drifting upward into place.

**Quadrant graph**: Dots animate into position one by one, user marker arrives last with a spring bounce and soft pulse.

**Claim modal**: Slides up from bottom on mobile (bottom sheet), fades + scales in on desktop.

**LLM chat messages**: Each message animates in from below — slight upward drift + fade.

**Respect `prefers-reduced-motion`**: All animations degrade gracefully. Reduced motion users get instant state changes without any motion.

### 10.6 Animal Reveal Color Palettes

| Animal | Background | Accent | Tone |
|--------|-----------|--------|------|
| 🦝 Raccoon | Deep slate blue | Silver / teal | Mysterious, clever |
| 🐷 Pig | Warm terracotta | Dusty rose | Earthy, comfortable |
| 🐺 Wolf | Charcoal | Cool grey + white | Sharp, focused |
| 🐴 Horse | Deep forest green | Warm gold | Noble, natural |
| 🦍 Gorilla | Dark plum | Bronze | Weighty, complex |

### 10.7 SVG Illustration Style Guide
All animal illustrations — reveal silhouettes, companion expressions, and scene illustrations — share one visual language:
- **Style**: Bold natural history illustration. Not cartoon, not clipart, not realistic. Think field guide meets woodblock print.
- **Line weight**: Confident, slightly variable — organic not mechanical
- **Detail level**: Medium — identifiable at a glance, interesting up close
- **Format**: SVG throughout — animatable paths for reveal, swappable components for companion expressions

---

## 11. Profile Creation Flow

1. Visitor goes to `/gifts/create`
2. Enters email → receives magic link → authenticates
3. Fills out profile:
   - Display name
   - Custom slug (availability checked in real time)
   - Short bio / taste description (this becomes the LLM system context)
   - Selects companion animal (preview of each animal shown)
   - Adds gift items one by one — each item gets a name, description, price tier, and is placed on an interactive 2D grid
   - Adds 2–3 action gift suggestions
4. Profile goes live at `/gifts/[slug]`
5. Admin URL is generated and shown once — profile owner should save it

The gift placement UI (drag-and-drop on a 2D grid with labeled axes) is the most complex part of the creation flow. The axes should be clearly labeled with examples so profile owners understand what they're doing intuitively.

---

## 12. Future Expansion (Designed For, Not Built Yet)

The architecture supports these without rework:

**Group gifting coordination** — a shared view where a group of friends can see collective claim status and coordinate without spoiling the surprise. Requires a lightweight group concept and slightly more robust identity than the current honor-system claiming.

**Claim notifications** — profile owner gets an email when a gift is claimed. Just needs a Supabase webhook or Edge Function.

**Profile discovery** — a public `/gifts` index showing opt-in public profiles. Organic network effect.

**Shareable results** — encode quiz results in URL params so quiz takers can share their animal with friends.

**Dark mode** — system preference detection + manual toggle.

**Analytics for profile owner** — how many people took the quiz, what animals they got, which gifts were most viewed. Privacy-respecting aggregate data only.

---

## 13. Open Questions Before Build

1. **Profile owner accent color**: Should profile owners be able to set a custom accent color for their profile, or does each animal come with a fixed palette that doubles as the profile's color identity?

2. **Companion animal during reveal**: When the quiz taker's animal is being revealed, what does the profile owner's companion animal do? Options: exits the screen gracefully before reveal begins, stays and reacts with a specific expression, or is replaced by the quiz taker's new animal.

3. **Admin auth upgrade timing**: Obscure URL is acceptable for v1. At what point does it need a real auth gate — when there are N profiles, or from day one for anyone but the first profile?

4. **Profile creation access**: Is profile creation open to anyone, or invite-only / waitlist for now?

5. **Gift coordinate UX**: The 2D placement grid for gift items during profile creation is the hardest UX problem in the app. Does the profile owner drag items onto a visual grid, or fill in x/y sliders with example anchors shown? What's the simplest version that produces correct coordinates?