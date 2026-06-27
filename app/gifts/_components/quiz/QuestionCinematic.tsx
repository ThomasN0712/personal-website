'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { QuizQuestion } from '../../_lib/types'

interface Props {
  question: QuizQuestion
  onReveal: () => void
}

export function QuestionCinematic({ question, onReveal }: Props) {
  const text = question.setup
  const [visibleChars, setVisibleChars] = useState(0)
  const [isTypingDone, setIsTypingDone] = useState(false)

  useEffect(() => {
    setVisibleChars(0)
    setIsTypingDone(false)
    const charDelay = Math.max(15, 5000 / text.length)
    const interval = setInterval(() => {
      setVisibleChars(prev => {
        if (prev >= text.length) {
          clearInterval(interval)
          setIsTypingDone(true)
          return prev
        }
        return prev + 1
      })
    }, charDelay)
    return () => clearInterval(interval)
  }, [text])

  return (
    <div className="flex-1 overflow-y-auto relative">

      {/* Skip button — always visible during typing */}
      <AnimatePresence>
        {!isTypingDone && (
          <motion.button
            onClick={onReveal}
            className="absolute top-4 right-6 text-xs text-white/25 hover:text-white/55 tracking-widest uppercase cursor-pointer transition-colors duration-200 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            skip →
          </motion.button>
        )}
      </AnimatePresence>

      <div className="min-h-full flex flex-col px-8 py-10 max-w-2xl mx-auto w-full">

        {/* Illustration — springs in from top after typing, pushes text down */}
        <motion.div
          className="w-full rounded-2xl flex-shrink-0 overflow-hidden"
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={
            isTypingDone
              ? { height: '45vh', opacity: 1, marginBottom: 32 }
              : { height: 0, opacity: 0, marginBottom: 0 }
          }
          transition={{
            height: { type: 'spring', stiffness: 280, damping: 22 },
            opacity: { duration: 0.3, delay: 0.05 },
            marginBottom: { type: 'spring', stiffness: 280, damping: 22 },
          }}
        >
          {question.illustration ? (
            <img
              src={question.illustration}
              alt={question.scene}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <p className="text-white/15 text-xs tracking-widest uppercase font-mono">illustration</p>
              <p className="text-white/25 text-xs tracking-wider">{question.scene}</p>
            </div>
          )}
        </motion.div>

        {/* Scene label + typewriter text */}
        <motion.div layout="position" transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
          <p className="text-xs uppercase tracking-widest text-white/30 mb-4">{question.scene}</p>
          <p
            className="text-white/80 text-base md:text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {text.slice(0, visibleChars)}
            {!isTypingDone && (
              <span className="inline-block w-0.5 h-5 bg-white/50 ml-0.5 animate-pulse align-middle" />
            )}
          </p>
        </motion.div>

        {/* CTA button */}
        <AnimatePresence>
          {isTypingDone && (
            <motion.div
              className="flex justify-end mt-auto pt-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <button
                onClick={onReveal}
                className="px-6 py-3 rounded-full border border-white/25 bg-white/8 text-white/80 text-sm tracking-wide cursor-pointer hover:bg-white/15 hover:border-white/40 hover:text-white transition-all duration-200"
              >
                {question.prompt} →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
