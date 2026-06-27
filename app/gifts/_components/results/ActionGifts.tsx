'use client'

import type { ActionGift } from '../../_lib/types'

interface Props {
  actionGifts: ActionGift[]
}

export function ActionGifts({ actionGifts }: Props) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {actionGifts.map((a, i) => (
        <div
          key={a.id}
          className="flex flex-col gap-3 rounded-[18px] p-6"
          style={{
            background: '#EDE3D1',
            animation: `card-up .55s cubic-bezier(.2,.7,.2,1) ${0.1 + i * 0.1}s both`,
            transition: 'transform .3s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
        >
          {a.emoji && <div style={{ fontSize: 28, lineHeight: 1 }}>{a.emoji}</div>}
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.1, color: '#1A1612' }}>
            {a.title}
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#4A3D2E' }}>
            {a.body}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes card-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
