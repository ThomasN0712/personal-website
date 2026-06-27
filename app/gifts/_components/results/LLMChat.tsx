'use client'

import { useState, useRef, useCallback } from 'react'
import { ANIMALS } from '../../_lib/animals'
import type { AnimalKey, QuizScore } from '../../_lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  animal: AnimalKey
  score: QuizScore
  recipientName: string
}

export function LLMChat({ animal: animalKey, score: _score, recipientName }: Props) {
  const animal = ANIMALS[animalKey]
  const { palette } = animal
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: animal.chatOpener },
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setStreaming(true)

    // Placeholder for streaming assistant reply
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          animalKey,
          recipientName,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Chat request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let reply = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        reply += decoder.decode(value, { stream: true })
        setMessages(m => {
          const updated = [...m]
          updated[updated.length - 1] = { role: 'assistant', content: reply }
          return updated
        })
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } catch {
      setMessages(m => {
        const updated = [...m]
        updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Try again.' }
        return updated
      })
    } finally {
      setStreaming(false)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [input, messages, streaming, animalKey, recipientName])

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{ border: '1px solid #D4C9B8', background: '#F4EDE0' }}
    >
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid #D4C9B8', background: '#EDE3D1' }}
      >
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: 36, height: 36,
            background: palette.bg,
            color: palette.accent,
            fontSize: 18,
            border: `1px solid ${palette.accent}44`,
          }}
        >
          {animal.emoji}
        </div>
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1612' }}>
            Ask about {recipientName}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B7355', marginTop: 2 }}>
            {animal.name} · gift advisor
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 p-6 overflow-y-auto" style={{ maxHeight: 380 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="rounded-[14px] px-4 py-3 max-w-[80%]"
              style={{
                background: msg.role === 'user' ? '#1A1612' : '#EDE3D1',
                color: msg.role === 'user' ? '#F4EDE0' : '#1A1612',
                fontSize: 15,
                lineHeight: 1.55,
                fontFamily: 'var(--font-body)',
              }}
            >
              {msg.content || (streaming && i === messages.length - 1 ? (
                <span style={{ opacity: 0.5 }}>…</span>
              ) : '')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2">
        <div
          className="flex items-end gap-3 rounded-[14px] p-3"
          style={{ background: '#EDE3D1', border: '1px solid #D4C9B8' }}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Share a gift idea or ask for help…"
            rows={2}
            className="flex-1 bg-transparent border-none outline-none resize-none"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: '#1A1612',
              lineHeight: 1.55,
            }}
          />
          <button
            onClick={send}
            disabled={streaming || !input.trim()}
            className="flex-shrink-0 w-9 h-9 rounded-full border-none cursor-pointer flex items-center justify-center"
            style={{
              background: streaming || !input.trim() ? '#C4B9A8' : '#1A1612',
              color: '#F4EDE0',
              transition: 'background 0.2s',
            }}
          >
            →
          </button>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.08em', color: '#8B7355', marginTop: 8, textAlign: 'center' }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}
