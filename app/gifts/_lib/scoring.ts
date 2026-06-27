import { ANIMALS } from './animals'
import type { AnimalKey, QuizAnswer, QuizScore, ConfidenceLabel } from './types'

// Raw scores range from −24 to +24 (12 questions × max delta of ±2).
// Normalize to −5 / +5 range matching the gift coordinate space.
export function scoreAnswers(answers: QuizAnswer[]): QuizScore {
  let rawX = 0
  let rawY = 0
  for (const a of answers) {
    rawX += a.dx
    rawY += a.dy
  }
  const clamp = (v: number) => Math.max(-5, Math.min(5, (v / 24) * 5))
  const x = clamp(rawX)
  const y = clamp(rawY)
  const magnitude = Math.sqrt(x * x + y * y)
  return { x, y, magnitude }
}

export function assignAnimal(x: number, y: number): AnimalKey {
  const magnitude = Math.sqrt(x * x + y * y)
  if (magnitude < 1.5) return 'gorilla'
  if (x > 0 && y > 0) return 'raccoon'
  if (x < 0 && y < 0) return 'pig'
  if (x > 0 && y < 0) return 'wolf'
  return 'horse'
}

export function confidenceLabel(magnitude: number): ConfidenceLabel {
  const ratio = Math.min(1, magnitude / 5)
  if (ratio > 0.7) return { tier: 'high', prefix: 'You are absolutely' }
  if (ratio > 0.4) return { tier: 'mid', prefix: 'You lean' }
  return { tier: 'low', prefix: "You're harder to read — closest match is" }
}

export function buildConfidenceCopy(animal: AnimalKey, magnitude: number): string {
  const { tier, prefix } = confidenceLabel(magnitude)
  const name = ANIMALS[animal].name
  if (tier === 'low') return `${prefix} ${name}.`
  return `${prefix} ${name.replace('The ', 'a ')}.`
}
