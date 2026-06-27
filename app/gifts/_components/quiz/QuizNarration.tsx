'use client'

import { motion } from 'framer-motion'
import { OPENING_NARRATION } from '../../_lib/questions'

interface Props {
  onStart: () => void
}

export function QuizNarration({ onStart }: Props) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.p
        className="max-w-sm text-base italic leading-relaxed text-stone-300"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {OPENING_NARRATION}
      </motion.p>

      <motion.button
        onClick={onStart}
        className="mt-10 px-8 py-3 rounded-full border border-white/20 text-sm text-white/70 hover:bg-white/10 hover:text-white tracking-widest uppercase transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Begin
      </motion.button>
    </motion.div>
  )
}
