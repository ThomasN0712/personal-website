import type { Gift, MatchedGift, PriceTier } from './types'

const TIER_ORDER: PriceTier[] = ['Under $30', '$30–$50']

function euclidean(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function getTopMatches(
  gifts: Gift[],
  userX: number,
  userY: number,
  budget: PriceTier | null,
  claimCounts: Record<string, number>,
  limit = 3
): MatchedGift[] {
  let pool = gifts
  if (budget) {
    const maxIdx = TIER_ORDER.indexOf(budget)
    pool = gifts.filter(g => {
      if (!g.price_tier) return true
      return TIER_ORDER.indexOf(g.price_tier) <= maxIdx
    })
  }
  return pool
    .map(g => ({
      ...g,
      distance: euclidean(g.x, g.y, userX, userY),
      claimCount: claimCounts[g.id] ?? 0,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}
