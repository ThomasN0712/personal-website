'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ACT_LABELS } from '../../_lib/questions'
import { QuestionCinematic } from './QuestionCinematic'
import { MusicPicker } from './MusicPicker'
import { ShopMinigame } from './ShopMinigame'
import type { QuizQuestion, Choice } from '../../_lib/types'

interface Props {
  question: QuizQuestion
  scoredCount: number
  totalScored: number
  onAnswer: (choice: Choice) => void
  onSelectBranch: (nextQuestionId: string) => void
  onGoBack?: () => void
}

type Mode = 'cinematic' | 'choices' | 'consequence'

export function QuizQuestion({ question, scoredCount, totalScored, onAnswer, onSelectBranch, onGoBack }: Props) {
  const [mode, setMode] = useState<Mode>('cinematic')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null)

  const isBranching = question.type === 'branching'
  const hasAfterChoice = question.type === 'standard' && !!question.afterChoice

  function handleChoice(choice: Choice) {
    if (selectedId !== null) return
    setSelectedId(choice.id)
    if (hasAfterChoice) {
      setPendingChoice(choice)
      setMode('consequence')
    } else {
      onAnswer(choice)
    }
  }

  function handleContinue() {
    if (pendingChoice) onAnswer(pendingChoice)
  }

  // ── Progress bar (shared across all modes) ───────────────────────────────
  const isDev = process.env.NODE_ENV === 'development'
  const progressBar = (
    <div className="flex items-center gap-2 flex-shrink-0">
      {isDev && onGoBack && (
        <button
          onClick={onGoBack}
          className="text-white/30 hover:text-white/70 transition-colors duration-150 text-xs pr-1 flex-shrink-0"
          title="Go back (dev)"
        >
          ←
        </button>
      )}
      <div className="flex gap-1 flex-1">
        {Array.from({ length: totalScored }).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
              i < scoredCount
                ? 'bg-white/50'
                : i === scoredCount && !isBranching
                  ? 'bg-white'
                  : 'bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  )

  return (
    <motion.div
      className="flex-1 flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
    >
      {/* ── Cinematic intro ─────────────────────────────────────────────── */}
      {mode === 'cinematic' && (
        <QuestionCinematic question={question} onReveal={() => setMode('choices')} />
      )}

      {/* ── Shop minigame (Q8) ───────────────────────────────────────────── */}
      {mode !== 'cinematic' && question.type === 'shop' && (
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <div className="flex gap-1 px-6 pt-5 pb-0">
            {progressBar}
          </div>
          <ShopMinigame question={question} onAnswer={onAnswer} />
        </motion.div>
      )}

      {/* ── Choices view (two-column) ────────────────────────────────────── */}
      {mode === 'choices' && question.type !== 'shop' && (
        <motion.div
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          {/* Progress bar — full width header */}
          <div className="flex-shrink-0 px-8 pt-6 pb-4">
            {progressBar}
          </div>

          {/* Two-column body */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">

            {/* Left: illustration + scene + setup */}
            <div className="md:w-1/2 flex flex-col overflow-y-auto px-8 pb-8 gap-4">
              <p className="text-xs uppercase tracking-widest text-white/30 flex-shrink-0">
                {ACT_LABELS[question.act]} · {question.scene}
              </p>

              {/* Illustration */}
              <div className="rounded-2xl overflow-hidden flex-shrink-0 bg-white/5">
                {question.illustration ? (
                  <img
                    src={question.illustration}
                    alt={question.scene}
                    className="w-full object-contain"
                  />
                ) : (
                  <div className="w-full aspect-video flex flex-col items-center justify-center gap-2">
                    <p className="text-white/15 text-xs tracking-widest uppercase font-mono">illustration</p>
                    <p className="text-white/25 text-xs">{question.scene}</p>
                  </div>
                )}
              </div>

              {/* Setup text */}
              <p className="text-sm text-white/55 leading-relaxed">{question.setup}</p>
            </div>

            {/* Subtle divider */}
            <div className="hidden md:block w-px bg-white/8 my-4 flex-shrink-0" />

            {/* Right: prompt + choices */}
            <div className="md:w-1/2 flex flex-col overflow-y-auto px-8 pb-8 gap-6">
              <h2
                className="text-xl md:text-2xl font-semibold text-white leading-snug flex-shrink-0"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {question.prompt}
              </h2>

              {/* Choices */}
              {question.id === 'q4' ? (
                <MusicPicker onAnswer={onAnswer} />
              ) : isBranching ? (
                <div className="grid grid-cols-2 gap-4">
                  {question.branches.map(branch => (
                    <motion.button
                      key={branch.nextQuestionId}
                      onClick={() => onSelectBranch(branch.nextQuestionId)}
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-8 text-white text-lg font-semibold cursor-pointer hover:bg-white/12 hover:border-white/30 transition-all duration-200"
                      style={{ fontFamily: 'var(--font-display)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-3xl">{branch.label === 'Fight.' ? '⚔️' : '🏃'}</span>
                      <span>{branch.label}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {'choices' in question && question.choices.map(choice => {
                    const isSelected = selectedId === choice.id
                    return (
                      <motion.button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        disabled={selectedId !== null}
                        className={`w-full text-left px-5 py-4 rounded-xl border text-sm leading-relaxed transition-all duration-200 ${
                          isSelected
                            ? 'border-white/50 bg-white/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white/90 hover:border-white/20 disabled:pointer-events-none'
                        }`}
                        animate={isSelected ? { scale: [1, 1.012, 1] } : {}}
                        transition={{ duration: 0.18 }}
                      >
                        {choice.label}
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {!isBranching && (
                <p className="text-center text-xs text-white/20 mt-auto pt-2">
                  {scoredCount + 1} / {totalScored}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Consequence view ─────────────────────────────────────────────── */}
      {mode === 'consequence' && pendingChoice && question.type === 'standard' && question.afterChoice && (
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {/* Progress bar */}
          <div className="flex-shrink-0 px-8 pt-6 pb-4">
            {progressBar}
          </div>

          {/* Consequence content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-xl mx-auto gap-10">
            <motion.p
              className="text-white/80 text-lg md:text-xl leading-relaxed"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {question.afterChoice(pendingChoice.id)}
            </motion.p>

            <motion.button
              onClick={handleContinue}
              className="px-7 py-3 rounded-full border border-white/25 bg-white/8 text-white/80 text-sm tracking-wide cursor-pointer hover:bg-white/15 hover:border-white/40 hover:text-white transition-all duration-200"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.75 }}
            >
              Continue →
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
