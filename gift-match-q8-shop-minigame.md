# Q8 — The Souvenir Shop Minigame
### Detailed Spec Sheet · Chapter 1

This document fully specifies Q8 as a 2D interactive shopping minigame replacing the original 4-choice format. It's the centerpiece of Chapter 1 — the longest single moment in the quiz, the most playful, the most shareable.

---

## 1. Concept Overview

The player enters a roadside souvenir shop with a $50 budget. The shop has 15 items across 3 categories. They click items to add them to their cart. They can stop at any time and check out — or keep buying past $50 and rack up credit card debt. There's no fail state. Everything they buy contributes to their personality score.

The shopkeeper — a small, judgmental animal in the top-right — comments on each purchase. The budget scale on the right tracks their financial decline in real time. The further into debt they go, the more unhinged the UI becomes.

The shop is fun. The shop is short (90 seconds to 3 minutes). The shop reveals more about a person than any multiple-choice question could.

---

## 2. Scene & Setting

**Setup text shown above the shop:**
> *You've pulled off the freeway at a souvenir shop that says "WORLD'S BEST PRICES" in faded paint. The inside smells like incense and old plastic. The shopkeeper is watching you. You have $50 and no plan.*

**The shopkeeper:** A weary opossum named **Dale**. He's seen everything. He has opinions. He runs a tight ship.

*Why an opossum: it's an animal we haven't used yet, possums famously hoard random junk, and the species reads as appropriately unhinged for a roadside shop owner. If you want a different animal, easy swap.*

---

## 3. Layout — Mobile First

```
┌─────────────────────────────────────┐
│  [Dale opossum]    "Welcome." 💬    │ ← shopkeeper + speech bubble
├─────────────────────────────────────┤
│                                  ┃$┃ ← budget scale (vertical, right side)
│   [Shop illustration             ┃ ┃
│    with 15 items as              ┃ ┃
│    clickable hotspots]           ┃ ┃
│                                  ┃ ┃
│   Category tabs:                 ┃ ┃
│   [Snacks] [Trinkets] [Curiosities] ┃ ┃
│                                  ┃ ┃
├─────────────────────────────────────┤
│  🛒 Cart (3 items)  ▼          $42  │ ← cart drawer (tap to expand)
├─────────────────────────────────────┤
│  [ CHECK OUT ]                      │
└─────────────────────────────────────┘
```

### Mobile (primary)
- Shopkeeper in top header strip with speech bubble appearing below
- Budget scale on the right edge, vertical, takes ~10% of width
- Shop illustration takes the main central area
- Category tabs (or filter chips) for the 3 categories
- Items appear as cards or hotspots — tap to add to cart
- Cart drawer slides up from bottom when tapped, shows itemized list
- Sticky "Check Out" button at the bottom

### Desktop
- Same layout but wider, with shopkeeper in top-right corner
- Budget scale to the right of the shop, more vertical room
- Cart drawer becomes a sidebar
- Items can be displayed in a grid view rather than tabbed

---

## 4. The 3 Categories & 15 Items

Each category has 5 items, distributed across the four personality quadrants so any shopping style can produce a meaningful score.

### Category 1 — 🍿 SNACKS
*Cheap, weird, regrettable. Easy to overbuy.*

| # | Item | Price | Weights | Description |
|---|------|-------|---------|-------------|
| 1 | Beef jerky in "Hot Honey Garlic Whisper" flavor | $8 | `[+2, -1]` | "Smells like a campfire ate a candle" |
| 2 | Mystery snack from a country you can't identify | $6 | `[+2, +2]` | "All ingredients written in 4 different alphabets" |
| 3 | Aggressive energy drink, the can has eyes | $5 | `[+2, -1]` | "Contains: ginseng, taurine, regret" |
| 4 | Artisanal jar of pickled something | $14 | `[-1, +2]` | "Local farmer's market vibes. Pickled WHAT?" |
| 5 | Off-brand gummy worms that look anatomically incorrect | $4 | `[+2, +1]` | "Limbs in places limbs shouldn't be" |

### Category 2 — 🪙 TRINKETS
*Small objects of varying usefulness and meaning.*

| # | Item | Price | Weights | Description |
|---|------|-------|---------|-------------|
| 6 | Tactical multi-tool keychain | $12 | `[+1, -2]` | "Useful in 3 specific emergencies, never" |
| 7 | Handmade ceramic mug from a local artist | $24 | `[-1, +2]` | "Has a name. The mug is named Doreen" |
| 8 | Tiny mini chess set | $19 | `[-1, -1]` | "Pieces small enough to lose forever" |
| 9 | Friendship bracelet kit | $9 | `[-2, +1]` | "Comes with instructions you won't read" |
| 10 | Bumper sticker that just says "WET" | $3 | `[+2, +2]` | "No context. None will be provided." |

### Category 3 — 🔮 CURIOSITIES
*Larger purchases. Aesthetic. Borderline cursed.*

| # | Item | Price | Weights | Description |
|---|------|-------|---------|-------------|
| 11 | Hand-poured candle, scent: "Wet Library" | $32 | `[-1, +2]` | "Top notes: dust, secrets, paper" |
| 12 | Crystal that absorbs bad vibes (allegedly) | $28 | `[-2, +2]` | "Charged under a full moon by a woman named Crystal" |
| 13 | Vintage postcard set, hand-tied with twine | $15 | `[-2, +1]` | "From places that may or may not still exist" |
| 14 | "World's Best Cousin" mug (no name specified) | $6 | `[-2, -2]` | "Aggressively beige. Built to last." |
| 15 | A small framed painting of a sad horse | $36 | `[-1, +2]` | "The horse is named Gerald. Gerald is having a tough year." |

### Price Distribution Logic
- Snacks: $4–$14 (5 items totaling $37 — can buy all if you want)
- Trinkets: $3–$24 (5 items totaling $67 — can't buy all on budget)
- Curiosities: $6–$36 (5 items totaling $117 — significant debt territory)

This means **the most chaotic personality** (buy everything) ends $171 over budget. **The most restrained** (buy nothing or one cheap snack) stays well under. Most players land in the middle.

---

## 5. The Budget Scale — Visual Spec

A vertical thermometer-style indicator on the right edge of the screen. Always visible. Updates in real time as items are added/removed from cart.

### Scale design
- **Total scale height:** ~80% of viewport height on mobile
- **Marks:** $50 (top), $25 (middle), $0 (lower third), -$25, -$50, -$75 (bottom)
- **Top portion (positive, $50→$0):** Green to yellow gradient, calm
- **Bottom portion (negative, $0→-$75+):** Red gradient, increasingly aggressive
- **Current position:** A small animated indicator (a dollar bill icon or a small panicked face) that slides down the scale smoothly as money is spent
- **Number display:** Current balance shown next to the indicator at all times — "$32 left" or "-$18 OWED"

### Animation behavior
- When an item is added: indicator slides down smoothly (~600ms ease-out), with a small bounce at the end
- When an item is removed: indicator slides up
- Crossing into debt (passing $0): the scale background shifts from green-gradient to red-gradient with a ripple animation
- Heavy debt zones: subtle pulse animation on the indicator + occasional shake

### Budget tier checkpoints (trigger UI events)

| Threshold crossed | What happens |
|------------------|--------------|
| Halfway ($25 remaining) | Indicator briefly flashes, popup: *"Halfway through. Still got it."* |
| 25% remaining ($12) | Popup: *"Cutting it close."* |
| $0 (exactly) | Popup: *"Right at the edge. Bold."* + indicator pulses |
| Goes negative (first time) | Big popup + scale color shift: *"OH NO. You're in debt now."* |
| -$25 reached | Popup: *"Interest is accruing as we speak."* |
| -$50 reached | Popup: *"You're calling your mom about this tonight."* |
| -$75+ reached | Popup: *"This is a problem for Future You."* |

All popups fade in from the budget scale, hold for ~2 seconds, then fade out. They never block interaction — the player can keep shopping during the popup.

---

## 6. The Shopkeeper — Dale the Opossum

Dale is the personality of the shop. He stands in the top-right corner (mobile: top strip) and reacts to *every single purchase*. His comments are short, dry, judgmental, and occasionally encouraging in a backhanded way.

### Dale's visual states
| Expression | When it shows |
|-----------|---------------|
| Neutral (eyes half-open) | Default, between actions |
| Mildly judgmental (one eyebrow raised) | After most purchases |
| Surprised | After unusual combinations |
| Concerned | When player enters debt |
| Alarmed | Heavy debt (-$50+) |
| Resigned | At checkout |
| Briefly delighted | If player buys his favorite items (Doreen the mug, the sad horse) |

### Speech bubble behavior
- Bubble fades in next to/below Dale after every purchase
- Holds for ~3 seconds
- Fades out, ready for next comment
- If player adds items rapidly, bubble queues comments rather than skipping (only one displayed at a time)

### Dale's comments — per item

**Snacks**
| Item | Dale says |
|------|-----------|
| Hot Honey Garlic Whisper jerky | *"That one talks back."* |
| Mystery international snack | *"Brave."* |
| Aggressive energy drink | *"Don't drink that on the freeway."* |
| Pickled something | *"That's been on the shelf longer than you've been alive."* |
| Anatomically incorrect gummies | *"I don't ask questions."* |

**Trinkets**
| Item | Dale says |
|------|-----------|
| Multi-tool keychain | *"You'll lose it in a week."* |
| Doreen the mug | *"Doreen is a good choice. Take care of her."* |
| Mini chess set | *"You'll play once."* |
| Friendship bracelet kit | *"For who? Be honest."* |
| WET bumper sticker | *"...okay."* |

**Curiosities**
| Item | Dale says |
|------|-----------|
| Wet Library candle | *"It does smell like a library. I'll give it that."* |
| Bad vibes crystal | *"It works if you believe. The crystal told me."* |
| Vintage postcards | *"From a town that may no longer exist."* |
| World's Best Cousin mug | *"Whose cousin?"* |
| Gerald the sad horse painting | *"Gerald deserves a good home."* |

### Dale's contextual comments (combo/state-based)
| Trigger | Comment |
|---------|---------|
| 3+ snacks in cart | *"Big snack energy."* |
| All 5 snacks | *"You skipped lunch, didn't you."* |
| Both mugs (Doreen + Cousin) | *"Two mugs. Bold."* |
| Crystal + bad vibes-adjacent items | *"You're stocking up. Tough week?"* |
| Empty cart after 30 seconds | *"Take your time. Or don't."* |
| First item added | *"There it is."* |
| Remove an item | *"Cold feet?"* |
| Enter debt | *"That's a credit card decision."* |
| Heavy debt | *"I'm not here to judge. (I am.)"* |

---

## 7. Item Interaction — Detailed UX

### When player taps an item
1. Item briefly scales up (~110%) then settles back — confirms tap
2. Small "+$X" animation floats up from the item and fades into the cart icon
3. Cart icon at bottom pulses briefly, count increments
4. Budget scale indicator slides down to new position
5. Dale's expression updates, speech bubble appears with his comment

### When player taps an item already in cart
- Item shows "✓ in cart" state on tap
- Tapping again opens a small confirmation: *"Remove from cart?"* with Yes/No
- If removed: reverse all the above animations
- Dale says something like *"Cold feet?"*

### Visual feedback for items in cart
- Items in the cart have a subtle visual marker on them in the shop view (a small checkmark badge, slightly desaturated, or a "✓" overlay)
- This prevents confusion about what's already been added

### Cart drawer behavior
- Closed state: thin bar at bottom showing item count and total
- Tap to expand: drawer slides up showing itemized list with prices and a remove (×) button per item
- Each line in the cart is its own row with the item name, price, and the option to remove
- Tap outside or swipe down to close

---

## 8. Checkout Flow

When the player taps **CHECK OUT**:

1. Dale's final reaction line appears based on cart state:
   - Empty cart: *"Nothing? Alright. The road awaits."*
   - Under budget: *"Sensible. Boring, but sensible."*
   - Exactly at $50: *"You did the math. Respect."*
   - Mild debt (-$1 to -$25): *"You'll figure it out. Probably."*
   - Heavy debt (-$26 to -$50): *"Good luck with that."*
   - Catastrophic debt (-$50+): *"I'll see you again. I always do."*
2. A brief checkout animation plays — a receipt prints out, the items get bagged
3. Final state shows briefly:
   - Items purchased: [list]
   - Total spent: $XX
   - Debt incurred: $XX (if applicable, in red)
4. Transition to Q9 (the roaring 20s party)

---

## 9. Scoring Logic

### Base calculation
Sum the `[x, y]` weights of every item in the final cart.

```js
function scoreShopCart(cart) {
  let x = 0, y = 0;
  for (const item of cart) {
    x += item.weights[0];
    y += item.weights[1];
  }
  return [x, y];
}
```

### Debt modifier
If the player ends in debt, apply an additional weight reflecting the chaos:

```js
function applyDebtModifier(x, y, finalBalance) {
  if (finalBalance >= 0) return [x, y];
  
  const debtAmount = Math.abs(finalBalance);
  
  if (debtAmount > 0 && debtAmount <= 25) {
    return [x + 1, y + 1]; // mild experiential/aesthetic push
  }
  if (debtAmount > 25 && debtAmount <= 50) {
    return [x + 2, y + 2]; // strong push toward chaos quadrant
  }
  if (debtAmount > 50) {
    return [x + 3, y + 2]; // committed to the bit
  }
}
```

### Empty cart special case
If the player checks out with nothing in their cart, treat it as a meaningful choice — restraint is a personality. Score: `[-2, -1]` (sentimental/functional). Dale's line covers this narratively.

### Maximum theoretical score from this question
With the heaviest possible cart (everything purchased, debt applied), the contribution to the quiz total is roughly `[+10, +14]` — substantial but normalized along with the other 11 questions. With a single small purchase, contribution is `[+1, -2]` or similar. The variance matters more here than in any other question, which is the point.

---

## 10. Animation Inventory

Every animation in the shop, in one place for the developer:

| Element | Animation | Duration | Easing |
|---------|----------|----------|--------|
| Scene entry | Fade + slight upward drift | 400ms | ease-out |
| Item tap (add) | Scale up to 110%, back to 100% | 200ms | spring |
| "+$X" float on add | Float upward + fade, settles into cart icon | 600ms | ease-out |
| Cart icon pulse | Brief scale pulse | 300ms | spring |
| Budget indicator slide | Vertical position transition | 600ms | ease-out with small bounce |
| Budget scale color shift | Background gradient transition | 800ms | ease-in-out |
| Budget threshold popup | Fade in + slight scale, fade out | 2500ms total | ease-out |
| Debt zone — indicator pulse | Continuous pulse | 1000ms loop | ease-in-out |
| Heavy debt — indicator shake | Subtle horizontal shake | 500ms intermittent | ease-in-out |
| Dale expression swap | Crossfade between expressions | 200ms | linear |
| Dale speech bubble | Fade + slight scale in, hold, fade out | 3500ms total | ease-out |
| Item ✓ in-cart marker | Quick scale-in with bounce | 250ms | spring |
| Cart drawer open | Slide up from bottom | 350ms | ease-out |
| Cart drawer close | Slide down | 250ms | ease-in |
| Item removal | Item scales down to 80% with red tint, then back | 350ms | ease-in-out |
| Checkout transition | Receipt unfurl + bag fold | 1200ms | ease-in-out |

`prefers-reduced-motion`: all animations except essential state changes are disabled. Item add/remove still confirms with an instant color change instead of animation.

---

## 11. Edge Cases & Polish Details

### What if the player doesn't interact for a while?
- After 20 seconds of inactivity: Dale's expression becomes faintly impatient
- After 45 seconds: Dale speech bubble: *"Take your time. Or don't."*
- After 90 seconds: Dale: *"Are you... shopping?"*
- No timer pressure, no auto-checkout. The player can take as long as they want.

### What if the player tries to add way too many of one thing?
- Each item is a single-quantity purchase only. You can buy Doreen the mug *once*. Tapping a cart-item again shows the "remove?" prompt.
- This keeps scoring meaningful and prevents grinding.

### What if the player goes to extreme debt?
- The scale visually extends if needed (or shows "OFF THE CHARTS" if you hit -$100)
- Dale becomes genuinely concerned at -$75+
- A small flashing UI element appears at -$100: "💳 CREDIT LIMIT REACHED" — purely cosmetic, doesn't actually prevent further buying. The bit *is* the bit.

### Inventory consistency
- The item list is fixed and identical for every player taking Chapter 1
- This is intentional — discussing the quiz with friends should reveal "wait, you bought Doreen?" "you skipped the sad horse??"
- Items can be re-ordered/changed in future chapters

---

## 12. Data Schema

```ts
interface ShopQuestion {
  id: "q8";
  type: "shop";
  scene: string;
  budget: number;                    // 50
  categories: ShopCategory[];
  shopkeeper: {
    name: string;                     // "Dale"
    animal: string;                   // "opossum"
    expressions: string[];            // asset references
    quips: { trigger: string; text: string }[];
  };
}

interface ShopCategory {
  id: string;                         // "snacks", "trinkets", "curiosities"
  label: string;
  icon: string;
  items: ShopItem[];
}

interface ShopItem {
  id: string;
  name: string;
  description: string;                // short line shown on hover/tap
  price: number;
  weights: [number, number];
  illustration: string;               // SVG asset path
  shopkeeperLine: string;             // Dale's comment for this item
  isInCart?: boolean;                 // client-side state
}

interface CartState {
  items: ShopItem[];
  totalSpent: number;
  finalBalance: number;               // can be negative
}
```

---

## 13. Asset Checklist for Designer/Illustrator

- 1 main shop interior illustration (background, no items)
- 15 individual item illustrations (consistent style, ~150×150px each at standard density)
- 7 Dale expressions (neutral, judgmental, surprised, concerned, alarmed, resigned, delighted)
- 1 dollar bill or panicked face icon for the budget indicator
- 1 receipt graphic for checkout animation
- 1 shopping bag illustration for items
- Speech bubble graphic (reusable, can stretch)
- Cart icon
- Category icons (snacks, trinkets, curiosities)

**Style consistency:** Match the existing chapter illustration style — bold field guide / slightly absurdist proportions. Items should feel hand-drawn, not stocky vector clipart.

---

## 14. What This Replaces in the Main Spec

The original Q8 ("Souvenir Shop" 4-choice) in `gift-match-chapter-1.md` is fully replaced by this minigame. Everything else in Chapter 1 remains unchanged. Logic flow still works:

- Progress bar counts Q8 as 1 question (same as before)
- Scoring is summed via the shop function rather than a single choice's weights
- Companion animal still swaps expression for the "shop" scene (use "browsing/interested")
- Transition to Q9 is unchanged

Estimated time-on-screen for Q8 with the minigame: **60 seconds to 3 minutes**, vs ~15 seconds for the original 4-choice version. This shifts the quiz from ~3 minutes total to ~5 minutes total, which is acceptable for the depth of personality signal gained.

---

## 15. Build Order Recommendation

If building this incrementally, ship in this order:

1. **Static shop with items + cart + budget tracking** — no animations, just functional shopping
2. **Budget scale animation + threshold popups** — the financial drama layer
3. **Dale + speech bubbles** — the personality layer
4. **Polish animations** — item tap effects, transitions, micro-interactions
5. **Edge cases** — inactivity prompts, extreme debt states, reduced-motion fallbacks

Each phase is independently shippable and improves the experience. Phase 1 alone is functional Q8; phase 5 is the version worth screenshotting.
