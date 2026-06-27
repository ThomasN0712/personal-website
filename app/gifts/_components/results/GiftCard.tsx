'use client'

import type { MatchedGift } from '../../_lib/types'

interface Props {
  gift: MatchedGift
  rank: number
  delay: number
  onClaim: (gift: MatchedGift) => void
}

const PLACEHOLDER_TONES: Record<string, string> = {
  'TL': '#E8C8B8',
  'TR': '#DCCFB5',
  'BL': '#EDE3D1',
  'BR': '#E8DDC8',
}

function placeholderTone(x: number, y: number): string {
  const key = `${y > 0 ? 'T' : 'B'}${x < 0 ? 'L' : 'R'}`
  return PLACEHOLDER_TONES[key] ?? '#EDE3D1'
}

export function GiftCard({ gift, rank, delay, onClaim }: Props) {
  const claimed = gift.claimCount > 0
  const tone = placeholderTone(gift.x, gift.y)

  return (
    <article
      className="flex flex-col gap-4 rounded-[20px] p-6 border relative"
      style={{
        background: '#F4EDE0',
        borderColor: '#D4C9B8',
        opacity: gift.claimCount >= 2 ? 0.78 : 1,
        animation: `card-up .65s cubic-bezier(.2,.7,.2,1) ${delay}s both`,
        transition: 'transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s, border-color .25s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 30px 50px -30px rgba(26,22,18,0.3)'
        el.style.borderColor = '#1A1612'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = '#D4C9B8'
      }}
    >
      <div className="flex justify-between items-start">
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', color: '#8B7355', textTransform: 'uppercase' }}>
          MATCH · {String(rank + 1).padStart(2, '0')}
        </div>
        {gift.price_tier && (
          <div
            className="px-3 py-1 rounded-full text-[12px]"
            style={{ background: tone, color: '#1A1612', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.08em' }}
          >
            {gift.price_tier}
          </div>
        )}
      </div>

      {/* Visual placeholder */}
      <div className="rounded-[14px] overflow-hidden relative" style={{ height: 150, background: tone }}>
        <svg viewBox="0 0 200 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <circle cx={50 + (rank * 30) % 100} cy={66 + (rank * 18) % 30} r="44" fill="#B85537" opacity="0.85" />
          <circle cx={130 - (rank * 14) % 30} cy={86} r="28" fill="#1A1612" opacity="0.85" />
          <circle cx={170} cy={36} r="10" fill="#1A1612" opacity="0.6" />
        </svg>
        <div
          className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-full"
          style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.15em', color: '#6B5E4F', background: 'rgba(244,237,224,0.7)' }}
        >
          PRODUCT IMAGE
        </div>

        {claimed && (
          <div
            className="absolute top-2.5 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{
              background: '#1A1612',
              color: '#F4EDE0',
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              animation: 'claim-in .4s cubic-bezier(.2,1.3,.4,1) both',
            }}
          >
            🎁 {gift.claimCount > 1 ? `Taken · ${gift.claimCount}` : 'Taken'}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, lineHeight: 1.1, margin: 0, color: '#1A1612' }}>
          {gift.name}
        </h3>
        {gift.description && (
          <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.5, color: '#4A3D2E' }}>
            {gift.description}
          </p>
        )}
        {gift.claimCount >= 2 && (
          <div style={{ marginTop: 10, fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B85537' }}>
            popular pick — coordinate with friends
          </div>
        )}
      </div>

      <div
        className="mt-auto flex justify-between items-center gap-2.5 pt-3.5"
        style={{ borderTop: '1px solid #D4C9B8' }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: '#8B7355', textTransform: 'uppercase' }}>
          {gift.store_name ?? ''}
        </div>
        <button
          onClick={() => onClaim(gift)}
          className="inline-flex items-center gap-1.5 rounded-full font-medium cursor-pointer border-none"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            padding: claimed ? '8px 14px' : '10px 16px',
            background: claimed ? 'transparent' : '#B85537',
            color: claimed ? '#B85537' : '#F4EDE0',
            border: claimed ? '1px solid #B85537' : 'none',
            transition: 'all .25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {claimed ? 'Also claim this' : "I'll get this 🎁"}
        </button>
      </div>

      <style>{`
        @keyframes claim-in { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes card-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </article>
  )
}
