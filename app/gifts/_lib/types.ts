export type AnimalKey = 'raccoon' | 'pig' | 'wolf' | 'horse' | 'gorilla'
export type PriceTier = 'Under $30' | '$30–$50'
export type ConfidenceTier = 'high' | 'mid' | 'low'
export type QuizPhase = 'narration' | 'quiz' | 'consequence' | 'reveal' | 'results'

// ── DB row shapes (mirrors Supabase tables) ──────────────────────────────────

export interface Profile {
  id: string
  owner_id: string | null
  slug: string
  display_name: string
  bio: string | null
  companion_animal: AnimalKey
  email: string
  accent_color: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Gift {
  id: string
  profile_id: string
  name: string
  description: string | null
  x: number
  y: number
  z: number | null
  price: number | null
  price_tier: PriceTier | null
  store_name: string | null
  store_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface ActionGift {
  id: string
  profile_id: string
  emoji: string | null
  title: string
  body: string
  sort_order: number
}

export interface Claim {
  id: string
  gift_id: string
  claimer_name: string | null
  claimed_at: string
}

// ── Derived / client-only types ───────────────────────────────────────────────

export interface MatchedGift extends Gift {
  distance: number
  claimCount: number
}

export interface QuizAnswer {
  dx: number
  dy: number
}

export interface QuizScore {
  x: number
  y: number
  magnitude: number
}

export interface QuizState {
  phase: QuizPhase
  currentQuestion: number
  answers: QuizAnswer[]
  score: QuizScore | null
  animal: AnimalKey | null
  budgetTier: PriceTier | null
}

export interface ConfidenceLabel {
  tier: ConfidenceTier
  prefix: string
}

// ── Animal static data ────────────────────────────────────────────────────────

export interface AnimalPalette {
  bg: string
  surface: string
  accent: string
  ink: string
}

export interface AnimalData {
  key: AnimalKey
  name: string
  emoji: string
  short: string
  description: string
  palette: AnimalPalette
  chatOpener: string
}

// ── Quiz question data ────────────────────────────────────────────────────────

export type Act = 1 | 2 | 3

export interface Choice {
  id: string
  label: string
  characterRef?: string
  weights: [number, number]  // [Δx, Δy]
}

export interface BranchOption {
  label: string
  nextQuestionId: string
}

export interface StandardQuestion {
  id: string
  type: 'standard'
  act: Act
  scene: string
  setup: string
  prompt: string
  illustration?: string
  choices: Choice[]
  afterChoice?: (choiceId: string) => string
}

export interface BranchingQuestion {
  id: string
  type: 'branching'
  act: Act
  scene: string
  setup: string
  prompt: string
  illustration?: string
  branches: BranchOption[]
}

export interface NarrativeConsequenceQuestion {
  id: string
  type: 'narrative_consequence'
  act: Act
  scene: string
  setup: string
  prompt: string
  illustration?: string
  choices: Choice[]
  consequenceTemplate: (choiceId: string) => string
}

export type QuizQuestion = StandardQuestion | BranchingQuestion | NarrativeConsequenceQuestion | ShopQuestion

// ── Shop minigame (Q8) ────────────────────────────────────────────────────────

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  weights: [number, number]
  shopkeeperLine: string
  category: 'snacks' | 'trinkets' | 'curiosities'
}

export interface ShopCategory {
  id: string
  label: string
  icon: string
  items: ShopItem[]
}

export interface ShopQuestion {
  id: string
  type: 'shop'
  act: Act
  scene: string
  setup: string
  prompt: string
  illustration?: string
  budget: number
  categories: ShopCategory[]
}

// ── Admin view ────────────────────────────────────────────────────────────────

export interface GiftWithClaims extends Gift {
  claims: Claim[]
}
