'use client'

import { useState, useCallback, useRef } from 'react'
import { QUESTIONS, BASE_SEQUENCE, TOTAL_SCORED } from '../_lib/questions'
import { scoreAnswers, assignAnimal } from '../_lib/scoring'
import type { QuizPhase, QuizAnswer, QuizScore, AnimalKey, PriceTier, Choice, QuizQuestion } from '../_lib/types'

export interface UseQuizReturn {
  phase: QuizPhase
  currentQuestion: QuizQuestion | null
  score: QuizScore | null
  animal: AnimalKey | null
  budgetTier: PriceTier | null
  progress: number
  scoredCount: number
  consequenceText: string | null
  startQuiz: () => void
  answer: (choice: Choice) => void
  selectBranch: (nextQuestionId: string) => void
  dismissConsequence: () => void
  goToResults: () => void
  setBudget: (tier: PriceTier) => void
  goBack: () => void
}

export function useQuiz(): UseQuizReturn {
  const [phase, setPhase] = useState<QuizPhase>('narration')
  const [sequence, setSequence] = useState<string[]>([...BASE_SEQUENCE])
  const [sequenceIdx, setSequenceIdx] = useState(0)
  const [scoredCount, setScoredCount] = useState(0)

  const answersRef = useRef<QuizAnswer[]>([])
  const [score, setScore] = useState<QuizScore | null>(null)
  const [animal, setAnimal] = useState<AnimalKey | null>(null)
  const [budgetTier, setBudgetTierState] = useState<PriceTier | null>(null)
  const [consequenceText, setConsequenceText] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const currentQuestion = QUESTIONS[sequence[sequenceIdx]] ?? null

  const startQuiz = useCallback(() => {
    setPhase('quiz')
  }, [])

  const answer = useCallback((choice: Choice) => {
    clearTimer()
    const next: QuizAnswer[] = [...answersRef.current, { dx: choice.weights[0], dy: choice.weights[1] }]
    answersRef.current = next
    const nextScored = next.length
    setScoredCount(nextScored)

    const currentId = sequence[sequenceIdx]
    const q = QUESTIONS[currentId]

    if (q?.type === 'narrative_consequence') {
      const text = q.consequenceTemplate(choice.id)
      setConsequenceText(text)
      timerRef.current = setTimeout(() => {
        setPhase('consequence')
      }, 300)
      return
    }

    if (nextScored === TOTAL_SCORED) {
      const nextScore = scoreAnswers(next)
      const nextAnimal = assignAnimal(nextScore.x, nextScore.y)
      setScore(nextScore)
      setAnimal(nextAnimal)
      timerRef.current = setTimeout(() => {
        setPhase('reveal')
      }, 500)
      return
    }

    const nextIdx = sequenceIdx + 1
    timerRef.current = setTimeout(() => {
      setSequenceIdx(nextIdx)
    }, 200)
  }, [sequenceIdx, sequence])

  const selectBranch = useCallback((nextQuestionId: string) => {
    clearTimer()
    setSequence(prev => prev.map((id, i) => i === sequenceIdx ? nextQuestionId : id))
  }, [sequenceIdx])

  const dismissConsequence = useCallback(() => {
    clearTimer()
    const nextIdx = sequenceIdx + 1
    const nextId = sequence[nextIdx]

    if (scoredCount === TOTAL_SCORED || nextIdx >= sequence.length) {
      const nextScore = scoreAnswers(answersRef.current)
      const nextAnimal = assignAnimal(nextScore.x, nextScore.y)
      setScore(nextScore)
      setAnimal(nextAnimal)
      setConsequenceText(null)
      setPhase('reveal')
      return
    }

    setConsequenceText(null)
    setPhase('quiz')
    setSequenceIdx(nextIdx)
    void nextId
  }, [sequenceIdx, sequence, scoredCount])

  const goToResults = useCallback(() => setPhase('results'), [])
  const setBudget = useCallback((tier: PriceTier) => setBudgetTierState(tier), [])

  const goBack = useCallback(() => {
    if (sequenceIdx === 0) return
    clearTimer()
    const newIdx = sequenceIdx - 1
    answersRef.current = answersRef.current.slice(0, -1)
    setScoredCount(prev => Math.max(0, prev - 1))
    // Restore the target position to BASE_SEQUENCE in case it was branched
    setSequence(prev => prev.map((id, i) => i === newIdx ? BASE_SEQUENCE[i] : id))
    setConsequenceText(null)
    setPhase('quiz')
    setSequenceIdx(newIdx)
  }, [sequenceIdx])

  return {
    phase,
    currentQuestion,
    score,
    animal,
    budgetTier,
    progress: scoredCount / TOTAL_SCORED,
    scoredCount,
    consequenceText,
    startQuiz,
    answer,
    selectBranch,
    dismissConsequence,
    goToResults,
    setBudget,
    goBack,
  }
}

