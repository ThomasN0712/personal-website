'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ANIMALS } from '../../_lib/animals'
import { confidenceLabel } from '../../_lib/scoring'
import { getTopMatches } from '../../_lib/matching'
import { createClient as getBrowserClient } from '@/utils/supabase/client'
import { QuadrantGraph } from './QuadrantGraph'
import { GiftCard } from './GiftCard'
import { ClaimModal } from './ClaimModal'
import { ActionGifts } from './ActionGifts'
import { LLMChat } from './LLMChat'
import type { Profile, Gift, ActionGift, MatchedGift, QuizScore, AnimalKey, PriceTier } from '../../_lib/types'

const PRICE_TIERS: PriceTier[] = ['Under $30', '$30–$50']

interface Props {
  profile: Profile
  gifts: Gift[]
  actionGifts: ActionGift[]
  score: QuizScore
  animal: AnimalKey
}

function SectionHeader({ eyebrow, title, kicker }: { eyebrow: string; title: React.ReactNode; kicker?: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B85537', marginBottom: 10 }}>
        {eyebrow}
      </div>
      <div className="flex items-baseline justify-between gap-6 flex-wrap">
        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, margin: 0, color: '#1A1612', maxWidth: 720 }}>
          {title}
        </h2>
        {kicker && (
          <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#8B7355', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {kicker}
          </div>
        )}
      </div>
    </div>
  )
}

function Legend({ color, ring, opacity = 1, label }: { color: string; ring?: boolean; opacity?: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5" style={{ fontSize: 13, color: '#4A3D2E' }}>
      <span
        style={{
          display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
          background: ring ? '#F4EDE0' : color,
          border: ring ? `2px solid ${color}` : 'none',
          opacity, flexShrink: 0,
        }}
      />
      <span>{label}</span>
    </div>
  )
}

export function ResultsScreen({ profile, gifts, actionGifts, score, animal: animalKey }: Props) {
  const animal = ANIMALS[animalKey]
  const { palette } = animal
  const { tier } = confidenceLabel(score.magnitude)
  const magnitude = score.magnitude

  const [budget, setBudget] = useState<PriceTier | null>(null)
  const [claimCounts, setClaimCounts] = useState<Record<string, number>>({})
  const [matches, setMatches] = useState<MatchedGift[]>([])
  const [modalGift, setModalGift] = useState<MatchedGift | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const fetchClaimCounts = useCallback(async () => {
    if (gifts.length === 0) return
    const supabase = getBrowserClient()
    const giftIds = gifts.map(g => g.id)
    const { data } = await supabase
      .from('claims')
      .select('gift_id')
      .in('gift_id', giftIds)
    const counts: Record<string, number> = {}
    for (const row of data ?? []) {
      counts[row.gift_id] = (counts[row.gift_id] ?? 0) + 1
    }
    setClaimCounts(counts)
  }, [gifts])

  useEffect(() => { fetchClaimCounts() }, [fetchClaimCounts])

  useEffect(() => {
    setMatches(getTopMatches(gifts, score.x, score.y, budget, claimCounts, 3))
  }, [gifts, score, budget, claimCounts])

  const confirmClaim = useCallback(async (claimerName: string) => {
    if (!modalGift) return
    const giftId = modalGift.id
    const giftName = modalGift.name
    setModalGift(null)
    await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ giftId, claimerName: claimerName || null }),
    })
    await fetchClaimCounts()
    const name = claimerName.trim()
    setToast(`Claimed: ${giftName}${name ? ` · thanks, ${name}` : ''}`)
    setTimeout(() => setToast(null), 3200)
  }, [modalGift, fetchClaimCounts])

  const userDotColor = palette.accent
  const userLabel = `you · ${animal.emoji}`

  return (
    <motion.div
      className="min-h-screen"
      style={{ background: '#F4EDE0', color: '#1A1612' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto px-6 py-8 md:px-12 md:py-12" style={{ maxWidth: 1200 }}>

        {/* === 3A: Personality archetype === */}
        <div
          className="grid items-center gap-10 mb-20 pb-16"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: '1px solid #D4C9B8',
            animation: 'card-up .8s cubic-bezier(.2,.7,.2,1) both',
          }}
        >
          <div className="text-right">
            <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B7355', marginBottom: 14 }}>
              you are
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(48px, 7vw, 112px)', lineHeight: 1, letterSpacing: '-0.015em', margin: 0, color: '#1A1612' }}>
              <em style={{ color: palette.accent }}>{animal.name.toLowerCase()}</em>
            </h1>
            <div style={{ marginTop: 14, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B7355' }}>
              {tier === 'high' && 'high confidence match'}
              {tier === 'mid' && 'moderate confidence'}
              {tier === 'low' && 'near the centre — check the chat'}
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 110, height: 110,
                background: palette.bg,
                color: palette.accent,
                border: `1px solid ${palette.accent}`,
                fontSize: 56,
                animation: 'icon-pop .9s cubic-bezier(.2,1.4,.4,1) .3s both',
                boxShadow: `0 24px 40px -22px ${palette.bg}`,
              }}
            >
              {animal.emoji}
            </div>
          </div>

          <div style={{ maxWidth: 380 }}>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#4A3D2E', margin: 0 }}>
              {animal.description}
            </p>
            <div className="flex gap-2.5 flex-wrap mt-4">
              {[`x · ${score.x.toFixed(1)}`, `y · ${score.y.toFixed(1)}`, `‖ ${magnitude.toFixed(2)}`].map(chip => (
                <span key={chip} className="px-3 py-1 rounded-full text-[12px]"
                  style={{ background: '#EDE3D1', color: '#4A3D2E', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Low-confidence note */}
        {tier === 'low' && (
          <div
            className="flex gap-6 items-center flex-wrap rounded-[22px] p-7 mb-20"
            style={{ background: '#EDE3D1', border: '1px solid #D4C9B8' }}
          >
            <div className="flex-1" style={{ minWidth: 280 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B85537', marginBottom: 6 }}>
                a note from us
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, lineHeight: 1.2, margin: 0 }}>
                <em>You&apos;re</em> harder to pin down than most.
              </h3>
              <p style={{ fontSize: 15, color: '#4A3D2E', marginTop: 8, lineHeight: 1.55 }}>
                Your score landed close to centre — the chat below might find better picks than the list.
              </p>
            </div>
            <a href="#chat-panel" className="px-5 py-3 rounded-full border no-underline"
              style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#1A1612', borderColor: '#C4B9A8' }}>
              Jump to chat ↓
            </a>
          </div>
        )}

        {/* === 3B: Budget filter === */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7355' }}>Budget</span>
          {PRICE_TIERS.map(tier => (
            <button
              key={tier}
              onClick={() => setBudget(b => b === tier ? null : tier)}
              className="px-4 py-1.5 rounded-full border cursor-pointer transition-all duration-200"
              style={{
                fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.06em',
                background: budget === tier ? '#1A1612' : 'transparent',
                color: budget === tier ? '#F4EDE0' : '#4A3D2E',
                borderColor: budget === tier ? '#1A1612' : '#C4B9A8',
              }}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* === 3C: Taste map === */}
        <div
          className="grid gap-16 items-center mb-24"
          style={{ gridTemplateColumns: '1fr 1.3fr' }}
        >
          <div>
            <SectionHeader
              eyebrow="The taste map"
              title={<>Where you land, <em>and what&apos;s nearby.</em></>}
            />
            <p style={{ fontSize: 16, lineHeight: 1.55, color: '#4A3D2E', maxWidth: 460 }}>
              Each dot is a gift from {profile.display_name}&apos;s list, plotted by personality. The
              marker is you. The three closest matches inside your budget are highlighted.
            </p>
            <div className="flex flex-col gap-2.5 mt-7">
              <Legend color="#6B5E4F" opacity={0.4} label="all curated gifts" />
              <Legend color="#B85537" label="your top 3 matches" />
              <Legend color={userDotColor} ring label={`you · ${animal.name.toLowerCase()}`} />
            </div>
          </div>
          <QuadrantGraph
            userScore={score}
            matches={matches}
            allGifts={gifts}
            userDotColor={userDotColor}
            userLabel={userLabel}
          />
        </div>

        {/* === 3D: Top 3 matches === */}
        <div className="mb-20">
          <SectionHeader
            eyebrow="Your top three"
            title={<>Gifts {profile.display_name} would love, <em>matched to you.</em></>}
            kicker="ranked by personality distance"
          />
          {matches.length === 0 ? (
            <p style={{ color: '#8B7355', fontSize: 15 }}>No matches found for this budget — try a higher tier.</p>
          ) : (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {matches.map((g, i) => (
                <GiftCard
                  key={g.id}
                  gift={g}
                  rank={i}
                  delay={0.15 + i * 0.15}
                  onClaim={setModalGift}
                />
              ))}
            </div>
          )}
        </div>

        {/* === 3E: Action gifts === */}
        <div className="mb-20">
          <div style={{ height: 1, background: '#D4C9B8', marginBottom: 36 }} />
          <SectionHeader
            eyebrow="Not shopping?"
            title={<>Try one of <em>these</em> instead.</>}
            kicker="zero dollars · personal"
          />
          <ActionGifts actionGifts={actionGifts} />
        </div>

        {/* === 3F: LLM chat === */}
        <div id="chat-panel" className="mb-16" style={{ scrollMarginTop: 80 }}>
          <SectionHeader
            eyebrow="Have your own idea?"
            title={<>Run it <em>by me.</em></>}
            kicker={`for the ${animal.name.toLowerCase()} who knows ${profile.display_name}`}
          />
          <LLMChat animal={animalKey} score={score} recipientName={profile.display_name} />
        </div>

      </div>

      {/* Claim modal */}
      {modalGift && (
        <ClaimModal
          gift={modalGift}
          recipientName={profile.display_name}
          onClose={() => setModalGift(null)}
          onConfirm={confirmClaim}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 font-medium"
          style={{
            transform: 'translateX(-50%)',
            background: '#1A1612',
            color: '#F4EDE0',
            fontSize: 14,
            boxShadow: '0 20px 40px -20px rgba(0,0,0,0.4)',
            zIndex: 150,
            animation: 'toast-up .3s cubic-bezier(.2,.9,.3,1) both',
          }}
        >
          <span style={{ color: '#B85537' }}>✓</span>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes card-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes icon-pop { 0% { opacity: 0; transform: scale(0.4) rotate(-8deg); } 70% { opacity: 1; transform: scale(1.1) rotate(2deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
        @keyframes toast-up { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @media (max-width: 900px) {
          .results-archetype { grid-template-columns: 1fr !important; text-align: center !important; }
          .results-graph { grid-template-columns: 1fr !important; }
          .results-matches { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}
