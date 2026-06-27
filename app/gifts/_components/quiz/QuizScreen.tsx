'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useQuiz } from '../../_hooks/useQuiz'
import { QuizNarration } from './QuizNarration'
import { QuizQuestion } from './QuizQuestion'
import { AnimalReveal } from '../reveal/AnimalReveal'
import { ResultsScreen } from '../results/ResultsScreen'
import { TOTAL_SCORED } from '../../_lib/questions'
import type { Profile, Gift, ActionGift } from '../../_lib/types'

const ACT_BG: Record<1 | 2 | 3, string> = {
  1: '#1C1005',  // warm amber — dawn
  2: '#130C03',  // deep warm brown — midday
  3: '#0C1521',  // cool slate — deep forest / night
}

const NARRATION_BG = '#0E0A06'

interface Props {
  profile: Profile
  gifts: Gift[]
  actionGifts: ActionGift[]
}

export function QuizScreen({ profile, gifts, actionGifts }: Props) {
  const {
    phase, currentQuestion, score, animal,
    scoredCount, consequenceText,
    startQuiz, answer, selectBranch, dismissConsequence, goToResults, goBack,
  } = useQuiz()

  const act = currentQuestion?.act ?? 1
  const bg = phase === 'narration' ? NARRATION_BG : ACT_BG[act]

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      animate={{ backgroundColor: bg }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      <div className="flex flex-1">
        <AnimatePresence mode="wait">
          {phase === 'narration' && (
            <QuizNarration key="narration" onStart={startQuiz} />
          )}

          {phase === 'quiz' && currentQuestion && (
            <QuizQuestion
              key={currentQuestion.id}
              question={currentQuestion}
              scoredCount={scoredCount}
              totalScored={TOTAL_SCORED}
              onAnswer={answer}
              onSelectBranch={selectBranch}
              onGoBack={scoredCount > 0 ? goBack : undefined}
            />
          )}

          {/* Consequence beat — shown after narrative_consequence question */}
          {phase === 'consequence' && consequenceText && (
            <motion.div
              key="consequence"
              className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-lg mx-auto gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs uppercase tracking-widest text-white/35">Plot twist</p>
              <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
                {consequenceText}
              </p>
              <button
                onClick={dismissConsequence}
                className="px-6 py-3 rounded-full border border-white/20 bg-white/8 text-white/70 text-sm tracking-wide cursor-pointer hover:bg-white/15 transition-all duration-200"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* AnimalReveal */}
          {phase === 'reveal' && score && animal && (
            <AnimalReveal
              key="reveal"
              animal={animal}
              score={score}
              recipientName={profile.display_name}
              onContinue={goToResults}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Results — full-screen overlay */}
      {phase === 'results' && score && animal && (
        <ResultsScreen
          profile={profile}
          gifts={gifts}
          actionGifts={actionGifts}
          score={score}
          animal={animal}
        />
      )}
    </motion.div>
  )
}
