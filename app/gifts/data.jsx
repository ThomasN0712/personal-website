// Static data — v2: narrative quest, 5 animals, claim helpers
// Axes: x = sentimental(-) <-> experiential(+);  y = functional(-) <-> aesthetic(+)

const RECIPIENT_NAME = "Thomas";

// Quiz questions — narrative quest format. Each scene has setup + question.
const QUESTIONS = [
  {
    act: 1,
    scene: "The Fork at Dawn",
    setup: "The trail splits before you've gone a mile. The forest is quiet. You have time to choose carefully.",
    q: "Where do you go first?",
    options: [
      { label: "A sculptor's workshop, half-finished work on the table, tools everywhere", dx: -1, dy:  2 },
      { label: "A busy morning market, smells and noise and things you didn't know you needed", dx:  2, dy:  1 },
      { label: "A quiet clearing where travelers leave objects they no longer need", dx: -2, dy: -1 },
      { label: "A steep trail that leads to a view you've heard about for years", dx:  1, dy: -2 },
    ],
  },
  {
    act: 1,
    scene: "The Traveler's Pack",
    setup: "You find an abandoned pack on a mossy log. Inside: four things. You can only keep one.",
    q: "What do you take?",
    options: [
      { label: "A worn illustrated map covered in handwritten notes", dx: -2, dy:  1 },
      { label: "A perfect multi-tool, barely used", dx:  1, dy: -2 },
      { label: "A jar of something that smells extraordinary", dx:  2, dy:  2 },
      { label: "A ribbon from a faraway festival, faded but beautiful", dx: -1, dy:  2 },
    ],
  },
  {
    act: 1,
    scene: "The First Village",
    setup: "You arrive midday. The village is celebrating something. Music is playing.",
    q: "What pulls your attention first?",
    options: [
      { label: "The banner someone painted by hand, rippling in the wind", dx: -1, dy:  2 },
      { label: "The water wheel someone repaired — it's running perfectly", dx:  1, dy: -2 },
      { label: "The communal table being set with food from everywhere", dx:  2, dy: -1 },
      { label: "The elder telling the story of how the village was founded", dx: -2, dy:  1 },
    ],
  },
  {
    act: 1,
    scene: "The Innkeeper's Offer",
    setup: "The innkeeper has two rooms left. The choice is simple but it isn't.",
    q: "Which room do you take?",
    options: [
      { label: "Mountain view, wildflowers on the table, cold and bright", dx:  1, dy:  2 },
      { label: "Fireplace room, worn quilts, warm and dark", dx: -2, dy: -2 },
    ],
  },
  {
    act: 2,
    scene: "The Village Request",
    setup: "Before you leave, a villager asks for help. You have a few hours.",
    q: "What do you do?",
    options: [
      { label: "Paint the new festival banner", dx: -1, dy:  2 },
      { label: "Fix the broken gate on the eastern side", dx:  1, dy: -2 },
      { label: "Organize the shared meal for the evening", dx:  2, dy: -1 },
      { label: "Sit with the old craftsman and learn how he makes things", dx: -2, dy:  1 },
    ],
  },
  {
    act: 2,
    scene: "The Deep Forest",
    setup: "The path darkens. The trees are older here. You find a cave that glows faintly.",
    q: "What's inside?",
    options: [
      { label: "Ancient carvings tracing the history of every creature that passed through", dx: -2, dy:  1 },
      { label: "A perfectly preserved set of tools left by explorers a century ago", dx:  1, dy: -2 },
      { label: "Rare ingredients and strange jars — someone was cooking something extraordinary", dx:  2, dy:  1 },
      { label: "A collection of small beautiful objects, each one placed with intention", dx: -1, dy:  2 },
    ],
  },
  {
    act: 2,
    scene: "The River Crossing",
    setup: "You reach a wide river. Three crossings are available. Plus one option of your own.",
    q: "How do you cross?",
    options: [
      { label: "The old stone bridge — slower but you can look at everything as you go", dx: -1, dy:  1 },
      { label: "The rope crossing — efficient, a little dangerous, directly across", dx:  2, dy: -2 },
      { label: "Wade through with the group of travelers — social, wet, memorable", dx:  1, dy:  2 },
      { label: "Wait until dusk when the water is lower and the crossing is safer", dx: -2, dy: -1 },
    ],
  },
  {
    act: 2,
    scene: "The Night Camp",
    setup: "You make camp with other travelers. The fire is going.",
    q: "What's your role at camp?",
    options: [
      { label: "You arrange the space — find the right rocks, set things up so it feels like a place", dx: -1, dy:  2 },
      { label: "You get the fire going and sort the supplies efficiently", dx:  1, dy: -2 },
      { label: "You're the one people end up talking to until too late", dx:  2, dy:  1 },
      { label: "You listen, and remember everything that was said", dx: -2, dy:  1 },
    ],
  },
  {
    act: 3,
    scene: "The Market Town",
    setup: "A larger town appears. You have one hour and a small amount of coin.",
    q: "What do you buy?",
    options: [
      { label: "Something beautiful you've never seen before and will never find again", dx: -1, dy:  2 },
      { label: "Something you've needed for a while and couldn't justify until now", dx:  2, dy: -2 },
      { label: "An experience — a meal, a show, a lesson from someone who knows something you don't", dx:  1, dy:  1 },
      { label: "A small gift to bring back for someone at home", dx: -2, dy:  1 },
    ],
  },
  {
    act: 3,
    scene: "The Artisan's Shop",
    setup: "One shop catches your eye. Inside, everything is handmade.",
    q: "What do you spend the most time looking at?",
    options: [
      { label: "Objects that are beautiful first, useful second", dx: -1, dy:  2 },
      { label: "Tools and instruments made to last a lifetime", dx:  1, dy: -2 },
      { label: "Things that tell a story about where they came from", dx: -2, dy:  1 },
      { label: "Things that solve a problem you didn't realize you had", dx:  2, dy: -1 },
    ],
  },
  {
    act: 3,
    scene: "The Last Night",
    setup: "You're close to the celebration. One more camp.",
    q: "How do you spend the final evening?",
    options: [
      { label: "You make the camp feel like somewhere worth remembering", dx: -1, dy:  2 },
      { label: "You prep everything for the morning — pack is organized, route is planned", dx:  2, dy: -1 },
      { label: "You sit with the strangest traveler in the group and hear their whole story", dx: -2, dy:  1 },
      { label: "You go off on your own and see what the forest looks like at night", dx:  1, dy:  2 },
    ],
  },
  {
    act: 3,
    scene: "The Celebration",
    setup: "You've arrived. It's everything you heard it would be.",
    q: "What do you contribute?",
    options: [
      { label: "You create something for the space — a decoration, an arrangement, something visual", dx: -1, dy:  2 },
      { label: "You find the thing that's broken and quietly fix it", dx:  1, dy: -2 },
      { label: "You organize a moment — a shared meal, a game, something that brings people together", dx:  2, dy:  1 },
      { label: "You find the oldest person there and ask them what they remember", dx: -2, dy:  1 },
    ],
  },
];

const OPENING_NARRATION = "Deep in a forest that exists somewhere between sleep and memory, five paths begin at the same place. Your choices will reveal which creature you truly are.";

// === ANIMALS =====================================================
// Each animal has: id, name, emoji, description, palette for reveal.
const ANIMALS = {
  raccoon: {
    key: "raccoon",
    name: "The Raccoon",
    emoji: "🦝",
    short: "Opportunistic and delightful.",
    description: "You find treasure where others see noise. You're drawn to things that are interesting before they're useful — a gift that makes you tilt your head and say \"where did you even find this?\" is better than anything from a list. You have taste, and you know it.",
    palette: { bg: "#1F2A3A", surface: "#2A3852", accent: "#9CCBC9", ink: "#EDE8DC" },
    chatOpener: "Something unexpected in mind? Tell me — I'm into it if it's interesting.",
  },
  pig: {
    key: "pig",
    name: "The Pig",
    emoji: "🐷",
    short: "Grounded and generous.",
    description: "You know what you like and you don't apologize for it. The best things in life are the ones you return to — the good knife, the perfect blanket, the meal that hits exactly right. You'd rather have one excellent thing than five fine ones.",
    palette: { bg: "#5A2A1F", surface: "#6E3326", accent: "#E8B5A7", ink: "#F4EDE0" },
    chatOpener: "Have something solid in mind? Run it by me.",
  },
  wolf: {
    key: "wolf",
    name: "The Wolf",
    emoji: "🐺",
    short: "Driven and purposeful.",
    description: "You're always optimizing. You want gear that performs, tools that solve real problems, things that make you better at what you're already pursuing. You appreciate thought, not sentiment.",
    palette: { bg: "#1E1E20", surface: "#2A2A2D", accent: "#B8BCC1", ink: "#F4EDE0" },
    chatOpener: "Got something specific? I'll tell you if it actually performs.",
  },
  horse: {
    key: "horse",
    name: "The Horse",
    emoji: "🐴",
    short: "Steady and beautiful.",
    description: "You keep things. Not out of sentimentality exactly — out of appreciation for craft. You notice when something was made well, chosen carefully, meant to last. The best gifts you've received are still in your home.",
    palette: { bg: "#1F2E22", surface: "#2A3D2E", accent: "#D4A95C", ink: "#F4EDE0" },
    chatOpener: "Something thoughtful? Let's see if it lands.",
  },
  gorilla: {
    key: "gorilla",
    name: "The Gorilla",
    emoji: "🦍",
    short: "Complex and considered.",
    description: "You resist easy categories. You have opinions — strong ones — but they don't map neatly to a quadrant. The right gift for you requires someone who actually knows you. Lucky for them, there's a chat for that.",
    palette: { bg: "#241B2A", surface: "#332439", accent: "#C49355", ink: "#F4EDE0" },
    chatOpener: "I'm genuinely hard to shop for. Tell me what you're thinking and I'll be honest.",
  },
};

function assignAnimal(x, y) {
  const magnitude = Math.sqrt(x * x + y * y);
  if (magnitude < 1.5) return ANIMALS.gorilla;
  if (x > 0 && y > 0)  return ANIMALS.raccoon;
  if (x < 0 && y < 0)  return ANIMALS.pig;
  if (x > 0 && y < 0)  return ANIMALS.wolf;
  return ANIMALS.horse; // x < 0 && y > 0
}

function confidenceLabel(magnitude) {
  // magnitude max ~5; ratio is magnitude/5
  const ratio = Math.min(1, magnitude / 5);
  if (ratio > 0.7) return { tier: "high",  prefix: "You are absolutely" };
  if (ratio > 0.4) return { tier: "mid",   prefix: "You lean" };
  return                 { tier: "low",   prefix: "You're harder to read — closest match is" };
}

// === GIFTS =======================================================
const GIFTS = [
  { id: "001", name: "Bialetti Moka Pot",                  description: "Classic stovetop espresso maker, built to last.",        x:  0.5, y: -2.5, price:  40, priceTier: "$30–$75",   storeName: "Williams Sonoma" },
  { id: "002", name: "Aged Balsamic from Modena",          description: "The real stuff. Elevates everything it touches.",        x: -0.5, y: -1.5, price:  45, priceTier: "$30–$75",   storeName: "Eataly" },
  { id: "003", name: "Framed Limited-Edition Print",       description: "A beautiful piece for a wall that needs one.",          x: -2.0, y:  3.0, price:  60, priceTier: "$30–$75",   storeName: "20x200" },
  { id: "004", name: "Hand-Poured Soy Candle",             description: "Premium scent they'll mention to guests.",              x: -1.0, y:  2.5, price:  35, priceTier: "$30–$75",   storeName: "Boy Smells" },
  { id: "005", name: "Kindle Paperwhite",                  description: "Best reading device. Waterproof, weeks of battery.",     x:  2.0, y: -1.5, price: 140, priceTier: "$75–$150",  storeName: "Amazon" },
  { id: "006", name: "Hydration Vest",                     description: "For the runner who wants to go further.",                x:  2.5, y: -2.0, price: 100, priceTier: "$75–$150",  storeName: "Salomon" },
  { id: "007", name: "Local Cooking Class",                description: "An evening learning a cuisine, hands-on.",               x:  3.0, y:  1.5, price:  80, priceTier: "$75–$150",  storeName: "Sur La Table" },
  { id: "008", name: "Polaroid I-2 Camera",                description: "Instant film. Makes memories physical again.",           x: -1.5, y:  2.0, price: 110, priceTier: "$75–$150",  storeName: "Polaroid" },
  { id: "009", name: "Noise-Cancelling Earbuds",           description: "For focus, commutes, and quiet flights.",               x:  1.5, y: -0.5, price: 130, priceTier: "$75–$150",  storeName: "Bose" },
  { id: "010", name: "Leather Notebook",                   description: "A beautiful object that makes writing feel important.",  x: -2.5, y:  1.5, price:  45, priceTier: "$30–$75",   storeName: "Midori" },
  { id: "011", name: "Cast Iron Skillet",                  description: "The last pan they'll ever need.",                       x:  0.0, y: -3.0, price:  50, priceTier: "$30–$75",   storeName: "Lodge" },
  { id: "012", name: "Concert Tickets",                    description: "Something to look forward to for a month.",              x:  3.5, y:  2.5, price: 100, priceTier: "$75–$150",  storeName: "AXS" },
  { id: "013", name: "Minimalist Watch",                   description: "Clean, timeless, wears with everything.",                x: -0.5, y:  3.0, price: 150, priceTier: "$75–$150",  storeName: "Nomos" },
  { id: "014", name: "Whoop 4.0 Annual",                   description: "For the data-driven athlete who optimizes everything.",  x:  2.0, y: -1.0, price: 239, priceTier: "$150+",    storeName: "Whoop" },
  { id: "015", name: "A Bottle of Yamazaki",               description: "A bottle they'd never buy themselves.",                  x:  0.5, y:  1.5, price:  60, priceTier: "$30–$75",   storeName: "Total Wine" },
  { id: "016", name: "Wacaco Picopresso",                  description: "Real espresso, anywhere. Built for the obsessive.",      x:  2.0, y:  0.5, price:  80, priceTier: "$75–$150",  storeName: "Wacaco" },
  { id: "017", name: "Architecture Coffee Table Book",     description: "Lives on display, not on a shelf.",                      x: -2.0, y:  2.5, price:  55, priceTier: "$30–$75",   storeName: "Phaidon" },
  { id: "018", name: "Merino Base Layer",                  description: "Didn't know they needed it until they had it.",          x:  1.0, y: -1.5, price:  90, priceTier: "$75–$150",  storeName: "Smartwool" },
  { id: "019", name: "Sous Vide Precision Cooker",         description: "Perfect results, every single time.",                    x:  2.5, y: -1.0, price: 100, priceTier: "$75–$150",  storeName: "Anova" },
  { id: "020", name: "Glass Terrarium Kit",                description: "A small living world for desk or shelf.",                x: -1.5, y:  3.0, price:  45, priceTier: "$30–$75",   storeName: "Modern Sprout" },
  { id: "021", name: "Marathon Training Coach (8wk)",      description: "Personalized plan from a real coach.",                   x:  3.0, y: -0.5, price: 180, priceTier: "$150+",    storeName: "Runna" },
  { id: "022", name: "Premium Coffee Subscription",        description: "Single-origin beans from rotating roasters.",            x:  1.0, y:  0.0, price:  60, priceTier: "$30–$75",   storeName: "Trade Coffee" },
  { id: "023", name: "Astrophysics Lecture Series",        description: "Online course taught by working physicists.",           x:  2.5, y:  0.0, price:  90, priceTier: "$75–$150",  storeName: "Wondrium" },
  { id: "024", name: "Hand-Thrown Ceramic Vase",           description: "One-of-one piece from a small studio.",                  x: -2.5, y:  2.5, price:  65, priceTier: "$30–$75",   storeName: "Etsy" },
];

const PRICE_TIERS = [
  { id: "tier1", label: "Under $30",   match: ["$30–$75"] },
  { id: "tier2", label: "$30 – $75",   match: ["$30–$75"] },
  { id: "tier3", label: "$75 – $150",  match: ["$75–$150"] },
  { id: "tier4", label: "$150+",       match: ["$150+"] },
];

function matchesBudget(priceTier, selectedBudgetId) {
  const tier = PRICE_TIERS.find(t => t.id === selectedBudgetId);
  if (!tier) return true;
  return tier.match.includes(priceTier);
}

// === CLAIMS (localStorage) ======================================
const CLAIMS_KEY = "giftmatch.claims.v1";

function loadClaims() {
  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveClaims(claims) {
  try { localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims)); } catch (e) {}
}

function addClaim(giftId, name) {
  const claims = loadClaims();
  claims.push({
    id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`,
    gift_id: giftId,
    claimer_name: name && name.trim() ? name.trim() : null,
    claimed_at: new Date().toISOString(),
  });
  saveClaims(claims);
  return claims;
}

function claimCountForGift(giftId, claims) {
  return claims.filter(c => c.gift_id === giftId).length;
}

// === MATCHING ====================================================
function getTopMatches(userX, userY, budgetId, claims = [], n = 3) {
  let pool = GIFTS.filter(g => matchesBudget(g.priceTier, budgetId));
  if (pool.length < n) pool = GIFTS;
  const scored = pool.map(g => {
    const distance = Math.sqrt((g.x - userX) ** 2 + (g.y - userY) ** 2);
    const claimCount = claimCountForGift(g.id, claims);
    // Deprioritize 2+ claims by adding penalty to distance
    const penalty = claimCount >= 2 ? 1.5 : 0;
    return { ...g, distance, claimCount, sortKey: distance + penalty };
  });
  scored.sort((a, b) => a.sortKey - b.sortKey);
  return scored.slice(0, n);
}

function scoreAnswers(answers) {
  let x = 0, y = 0;
  answers.forEach(a => { x += a.dx; y += a.dy; });
  const norm = v => Math.max(-5, Math.min(5, (v / 24) * 5));
  return { x: norm(x), y: norm(y) };
}

const ACTION_GIFTS = [
  { emoji: "🎽", title: "Cheer me on",       body: "Come watch me run my first marathon in October — bring a sign." },
  { emoji: "🍝", title: "Cook me dinner",    body: "Pick a cuisine you've never made. I'll bring the wine." },
  { emoji: "✉️", title: "Write me a letter", body: "An actual letter, on paper. About anything you want." },
];

const SYSTEM_PROMPT = `You are a gift advisor for Thomas. Your job is to help his friends decide whether a gift idea is a good fit for him, or suggest refinements.

About Thomas:
- Mid-twenties, lives in the LA area (Downey, CA)
- Intensely fitness-oriented — lifts almost daily, runs regularly, training for his first marathon in October
- Software developer at a government education agency; comfortable with tech
- Interested in personal finance, investing, and markets
- Curious about astrophysics, geopolitics, music, and travel
- Quality over quantity — appreciates well-made, lasting things
- Minimalist but considered aesthetic — notices good design
- Enjoys good coffee (serious about it), cooking, and eating well
- Not sentimental in a sappy way — values practicality and intentionality
- Already has: lots of running gear, standard workout equipment
- Responds well to: things that help him perform, learn, or eat/drink well
- Bad fit: generic novelty gifts, purely decorative items, anything cheap-feeling

When someone shares a gift idea:
- Give an honest assessment (don't just validate)
- If it's a good fit, say why specifically
- If it's not, explain clearly and suggest a better direction
- Keep replies to 2–4 sentences
- Tone: warm and direct, like a knowledgeable friend`;

window.GIFT_DATA = {
  RECIPIENT_NAME, QUESTIONS, OPENING_NARRATION,
  ANIMALS, assignAnimal, confidenceLabel,
  GIFTS, PRICE_TIERS, matchesBudget, getTopMatches, scoreAnswers,
  ACTION_GIFTS, SYSTEM_PROMPT,
  loadClaims, saveClaims, addClaim, claimCountForGift,
};
