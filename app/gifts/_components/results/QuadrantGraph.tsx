'use client'

import type { MatchedGift, Gift, QuizScore } from '../../_lib/types'

const SIZE = 600
const PAD = 90
const GRID = SIZE - PAD * 2
const ORIGIN = SIZE / 2

function toSvg(v: number, axis: 'x' | 'y'): number {
  if (axis === 'x') return ORIGIN + (v / 5) * (GRID / 2)
  return ORIGIN - (v / 5) * (GRID / 2) // y inverted: positive up
}

interface Props {
  userScore: QuizScore
  matches: MatchedGift[]
  allGifts: Gift[]
  userDotColor: string
  userLabel: string
}

export function QuadrantGraph({ userScore, matches, allGifts, userDotColor, userLabel }: Props) {
  const matchIds = new Set(matches.map(m => m.id))
  const ux = toSvg(userScore.x, 'x')
  const uy = toSvg(userScore.y, 'y')

  return (
    <div className="w-full max-w-[720px] mx-auto relative" style={{ aspectRatio: '1 / 1' }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: '100%', height: '100%', display: 'block' }}>
        {/* Frame */}
        <rect x={PAD} y={PAD} width={GRID} height={GRID}
          fill="rgba(26,22,18,0.04)" stroke="#D4C9B8" strokeWidth="1" rx="8" />

        {/* Quadrant tints */}
        <g opacity="0.45">
          <rect x={PAD} y={PAD} width={GRID / 2} height={GRID / 2} fill="#EDE3D1" />
          <rect x={ORIGIN} y={PAD} width={GRID / 2} height={GRID / 2} fill="#E8C8B8" />
          <rect x={PAD} y={ORIGIN} width={GRID / 2} height={GRID / 2} fill="#DCCFB5" />
          <rect x={ORIGIN} y={ORIGIN} width={GRID / 2} height={GRID / 2} fill="#EDE3D1" />
        </g>

        {/* Grid lines */}
        <g stroke="#C4B9A8" strokeWidth="0.5" opacity="0.45">
          {[1, 2, 3, 4].map(i => {
            const off = (GRID / 5) * i
            return (
              <g key={i}>
                <line x1={PAD + off} y1={PAD} x2={PAD + off} y2={PAD + GRID} />
                <line x1={PAD} y1={PAD + off} x2={PAD + GRID} y2={PAD + off} />
              </g>
            )
          })}
        </g>

        {/* Center axes */}
        <line x1={PAD} y1={ORIGIN} x2={PAD + GRID} y2={ORIGIN} stroke="#1A1612" strokeWidth="1" opacity="0.4" />
        <line x1={ORIGIN} y1={PAD} x2={ORIGIN} y2={PAD + GRID} stroke="#1A1612" strokeWidth="1" opacity="0.4" />

        {/* Quadrant labels */}
        <g fontFamily="Georgia, serif" fontSize="18" fill="#1A1612" opacity="0.7" textAnchor="middle" fontStyle="italic">
          <text x={PAD + GRID * 0.25} y={PAD + 28}>The Curator</text>
          <text x={PAD + GRID * 0.75} y={PAD + 28}>The Adventurer</text>
          <text x={PAD + GRID * 0.25} y={PAD + GRID - 12}>The Keeper</text>
          <text x={PAD + GRID * 0.75} y={PAD + GRID - 12}>The Builder</text>
        </g>

        {/* Axis labels */}
        <g fontSize="9" fill="#6B5E4F" letterSpacing="2" textAnchor="middle">
          <text x={ORIGIN} y={PAD - 22} fontFamily="monospace">AESTHETIC</text>
          <text x={ORIGIN} y={PAD + GRID + 32} fontFamily="monospace">FUNCTIONAL</text>
        </g>
        <g fontSize="9" fill="#6B5E4F" letterSpacing="2">
          <text x={PAD - 18} y={ORIGIN + 4} textAnchor="end" fontFamily="monospace">SENTIMENTAL</text>
          <text x={PAD + GRID + 18} y={ORIGIN + 4} fontFamily="monospace">EXPERIENTIAL</text>
        </g>

        {/* All gift dots */}
        <g>
          {allGifts.map((g, i) => {
            const cx = toSvg(g.x, 'x')
            const cy = toSvg(g.y, 'y')
            const isMatch = matchIds.has(g.id)
            return (
              <g key={g.id} style={{ animation: `dot-in .5s cubic-bezier(.2,.8,.2,1) ${0.4 + i * 0.04}s both`, transformOrigin: 'center', transformBox: 'fill-box' }}>
                <circle cx={cx} cy={cy} r={isMatch ? 8 : 4}
                  fill={isMatch ? '#B85537' : '#6B5E4F'} opacity={isMatch ? 1 : 0.4} />
                {isMatch && (
                  <circle cx={cx} cy={cy} r={14} fill="none" stroke="#B85537" strokeWidth="1" opacity="0.4">
                    <animate attributeName="r" from="10" to="20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )
          })}
        </g>

        {/* Match labels */}
        <g fontSize="11" fill="#1A1612" fontWeight="500">
          {matches.map((g, i) => {
            const cx = toSvg(g.x, 'x')
            const cy = toSvg(g.y, 'y')
            const right = cx < ORIGIN + 80
            return (
              <g key={g.id} style={{ animation: `dot-in .5s cubic-bezier(.2,.8,.2,1) ${1.4 + i * 0.15}s both`, transformOrigin: 'center', transformBox: 'fill-box' }}>
                <line
                  x1={cx + (right ? 10 : -10)} y1={cy}
                  x2={cx + (right ? 26 : -26)} y2={cy - 12}
                  stroke="#B85537" strokeWidth="0.8"
                />
                <text x={cx + (right ? 28 : -28)} y={cy - 14} textAnchor={right ? 'start' : 'end'}
                  fontFamily="sans-serif">
                  {g.name}
                </text>
              </g>
            )
          })}
        </g>

        {/* User marker */}
        <g style={{ animation: 'user-drop 1s cubic-bezier(.2,1.6,.4,1) 1.8s both', transformOrigin: `${ux}px ${uy}px`, transformBox: 'fill-box' }}>
          <circle cx={ux} cy={uy} r="22" fill={userDotColor} opacity="0.18">
            <animate attributeName="r" from="22" to="36" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.18" to="0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx={ux} cy={uy} r="11" fill="#F4EDE0" stroke={userDotColor} strokeWidth="2.5" />
          <circle cx={ux} cy={uy} r="4" fill={userDotColor} />
          <text x={ux} y={uy + 32} fontFamily="sans-serif" fontWeight="500" fontSize="11" textAnchor="middle" fill="#1A1612">
            {userLabel}
          </text>
        </g>
      </svg>

      <style>{`
        @keyframes dot-in { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes user-drop {
          0%   { opacity: 0; transform: translateY(-30px) scale(0.6); }
          70%  { opacity: 1; transform: translateY(4px) scale(1.1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
