'use client'

import { useState } from 'react'
import type { MatchedGift } from '../../_lib/types'

interface Props {
  gift: MatchedGift
  recipientName: string
  onClose: () => void
  onConfirm: (name: string) => void
}

export function ClaimModal({ gift, recipientName, onClose, onConfirm }: Props) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (submitting) return
    setSubmitting(true)
    onConfirm(name)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: 'rgba(26,22,18,0.55)', animation: 'modal-fade .25s ease both' }}
      onClick={onClose}
    >
      <form
        className="w-full rounded-[22px] p-8"
        style={{
          maxWidth: 460,
          background: '#F4EDE0',
          boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)',
          animation: 'modal-pop .35s cubic-bezier(.2,.9,.3,1) both',
        }}
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B85537', marginBottom: 12 }}>
          Claim a gift
        </div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: 1.15, margin: 0, color: '#1A1612' }}>
          Let {recipientName} know{' '}
          <em style={{ color: '#B85537' }}>this one&apos;s spoken for.</em>
        </h3>
        <p style={{ marginTop: 14, fontSize: 14.5, color: '#4A3D2E', lineHeight: 1.55 }}>
          You&apos;re claiming <strong>{gift.name}</strong>. Friends can still also claim it — coordinate as needed.
        </p>

        <label className="block mt-6">
          <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B7355' }}>
            Your name (optional)
          </span>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Taylor"
            className="block w-full mt-2 rounded-[10px] outline-none"
            style={{
              padding: '12px 16px',
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              color: '#1A1612',
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid #D4C9B8',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#1A1612' }}
            onBlur={e => { e.target.style.borderColor = '#D4C9B8' }}
          />
        </label>

        <div className="flex justify-end gap-2.5 mt-7">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full cursor-pointer border"
            style={{ fontFamily: 'var(--font-body)', fontSize: 14, background: 'transparent', color: '#1A1612', borderColor: '#D4C9B8' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-none cursor-pointer font-medium"
            style={{ fontFamily: 'var(--font-body)', fontSize: 14, background: '#1A1612', color: '#F4EDE0' }}
          >
            {submitting ? 'Claiming…' : 'Claim it →'}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes modal-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modal-pop { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  )
}
