'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ANIMALS } from '../../_lib/animals'
import { confidenceLabel } from '../../_lib/scoring'
import type { AnimalKey, QuizScore } from '../../_lib/types'

interface Props {
  animal: AnimalKey
  score: QuizScore
  recipientName: string
  onContinue: () => void
}

// phase 0=dark · 1=surface · 2=halo ring · 3=glyph+name · 4=description · 5=CTA
const PHASE_TIMELINE: [number, number][] = [
  [120, 1],
  [800, 2],
  [2200, 3],
  [3600, 4],
  [5400, 5],
]

export function AnimalReveal({ animal: animalKey, score, recipientName, onContinue }: Props) {
  const [phase, setPhase] = useState(0)
  const animal = ANIMALS[animalKey]
  const { palette } = animal
  const { tier, prefix } = confidenceLabel(score.magnitude)
  const circumference = 2 * Math.PI * 140

  useEffect(() => {
    const timers = PHASE_TIMELINE.map(([delay, p]) => setTimeout(() => setPhase(p), delay))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: palette.bg, color: palette.ink }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${palette.surface} 0%, ${palette.bg} 70%)`,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Skip */}
      <button
        onClick={onContinue}
        className="absolute top-7 right-8 bg-transparent border-none cursor-pointer"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: palette.ink,
          opacity: 0.4,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.4' }}
      >
        skip ⤳
      </button>

      {/* Confidence eyebrow */}
      <div
        className="relative z-10 mb-6"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: palette.accent,
          opacity: phase >= 3 ? 0.85 : 0,
          transition: 'opacity 0.8s ease 1.6s',
        }}
      >
        {tier === 'high' && '✦ a clear match ✦'}
        {tier === 'mid' && '✦ leaning strongly ✦'}
        {tier === 'low' && '✦ near the centre ✦'}
      </div>

      {/* Glyph ring */}
      <div className="relative z-10" style={{ width: 360, height: 360 }}>
        <svg viewBox="0 0 360 360" className="absolute inset-0 w-full h-full" aria-hidden="true">
          {/* Outer dashed ring */}
          <circle
            cx="180" cy="180" r="172"
            fill="none"
            stroke={palette.accent}
            strokeWidth="0.8"
            strokeDasharray="2 8"
            style={{
              opacity: phase >= 2 ? 0.5 : 0,
              transition: 'opacity 1.4s ease 0.4s',
              transformOrigin: '180px 180px',
              animation: 'ring-spin 80s linear infinite',
            }}
          />

          {/* Atmospheric blob */}
          <circle
            cx="180" cy="180" r="120"
            fill={palette.surface}
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? 'scale(1)' : 'scale(0.7)',
              transition: 'opacity 0.8s ease 0.1s, transform 1.2s cubic-bezier(.2,.7,.2,1) 0.1s',
              transformOrigin: '180px 180px',
            }}
          />

          {/* Stroke-draw ring */}
          <circle
            cx="180" cy="180" r="140"
            fill="none"
            stroke={palette.accent}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={phase >= 2 ? 0 : circumference}
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1) 0.4s',
              transformOrigin: '180px 180px',
              transform: 'rotate(-90deg)',
            }}
          />

          {/* Inner accent disk */}
          <circle
            cx="180" cy="180" r="100"
            fill={palette.bg}
            style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.6s ease 1.4s' }}
          />

          {/* Orbiting dots */}
          <g style={{ transformOrigin: '180px 180px', animation: 'ring-spin 18s linear infinite' }}>
            <circle cx="180" cy="40" r="4" fill={palette.accent}
              style={{ opacity: phase >= 2 ? 0.9 : 0, transition: 'opacity 0.6s ease 1.4s' }} />
          </g>
          <g style={{ transformOrigin: '180px 180px', animation: 'ring-spin 28s linear infinite reverse' }}>
            <circle cx="180" cy="60" r="2.5" fill={palette.accent}
              style={{ opacity: phase >= 2 ? 0.6 : 0, transition: 'opacity 0.6s ease 1.6s' }} />
          </g>
        </svg>

        {/* Emoji centerpiece */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none"
          aria-hidden="true"
          style={{
            fontSize: 132,
            lineHeight: 1,
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 0.8s cubic-bezier(.2,.7,.2,1) 1.5s, transform 1s cubic-bezier(.2,1.4,.4,1) 1.5s',
            filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.4))',
          }}
        >
          {animal.emoji}
        </div>

        <style>{`@keyframes ring-spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Name block */}
      <div
        className="relative z-10 mt-9 text-center"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.9s cubic-bezier(.2,.7,.2,1) 1.8s, transform 0.9s cubic-bezier(.2,.7,.2,1) 1.8s',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: palette.accent,
            marginBottom: 14,
            opacity: 0.8,
          }}
        >
          {prefix}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(56px, 9vw, 112px)',
            lineHeight: 1,
            letterSpacing: '-0.015em',
            margin: 0,
            color: palette.ink,
          }}
        >
          <em style={{ color: palette.accent }}>{animal.name}.</em>
        </h1>
      </div>

      {/* Description */}
      <p
        className="relative z-10 mx-8 mt-8 text-center leading-relaxed"
        style={{
          maxWidth: 580,
          fontSize: 17.5,
          color: palette.ink,
          opacity: phase >= 4 ? 0.85 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        {animal.description}
      </p>

      {/* CTA */}
      <div
        className="relative z-10 mt-14"
        style={{
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-3.5 px-8 py-4 rounded-full font-medium border-none cursor-pointer"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            letterSpacing: '0.01em',
            background: palette.accent,
            color: palette.bg,
            transition: 'transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 14px 30px -16px ${palette.accent}aa`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          See what {recipientName} might love <span>→</span>
        </button>
      </div>
    </motion.div>
  )
}
