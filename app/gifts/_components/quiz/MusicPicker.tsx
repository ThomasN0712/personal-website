'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Choice } from '../../_lib/types'

interface Track {
  id: string
  track: string
  artist: string
  album: string
  artwork: string | null
}

interface Props {
  onAnswer: (choice: Choice) => void
}

function ArtworkPlaceholder({ scene }: { scene?: string }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
      <span className="text-white/25 text-xs">♪</span>
    </div>
  )
}

export function MusicPicker({ onAnswer }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [selected, setSelected] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/music-search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results ?? [])
      } catch {
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 380)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  function addTrack(track: Track) {
    if (selected.length >= 3 || selected.some(s => s.id === track.id)) return
    setSelected(prev => [...prev, track])
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  function removeTrack(id: string) {
    setSelected(prev => prev.filter(t => t.id !== id))
  }

  async function handleSubmit() {
    if (selected.length === 0 || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/music-weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs: selected.map(t => ({ track: t.track, artist: t.artist })) }),
      })
      if (!res.ok) throw new Error('api_error')
      const { dx, dy, comment: llmComment } = await res.json()
      const label = selected.map(t => `${t.track} – ${t.artist}`).join(' · ')
      setPendingChoice({ id: 'music', label, weights: [dx, dy] })
      setComment(llmComment)
    } catch {
      setSubmitError("Oh no, the system can't handle your music taste right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Comment / result view ─────────────────────────────────────────────────
  if (comment && pendingChoice) {
    return (
      <motion.div
        className="flex flex-col gap-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs uppercase tracking-widest text-white/30">the aux cord has spoken</p>

        {/* Selected tracks recap */}
        <div className="space-y-2">
          {selected.map((t, i) => (
            <motion.div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              {t.artwork
                ? <img src={t.artwork} alt={t.track} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                : <ArtworkPlaceholder />
              }
              <div className="min-w-0">
                <p className="text-white/85 text-sm font-medium truncate">{t.track}</p>
                <p className="text-white/40 text-xs truncate">{t.artist}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Snarky comment */}
        <motion.div
          className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          <p className="text-white/25 text-xs uppercase tracking-widest mb-2">the verdict</p>
          <p
            className="text-white/75 text-sm leading-relaxed italic"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            "{comment}"
          </p>
        </motion.div>

        <motion.button
          onClick={() => onAnswer(pendingChoice)}
          className="self-end px-7 py-3 rounded-full border border-white/25 bg-white/8 text-white/85 text-sm tracking-wide cursor-pointer hover:bg-white/15 hover:border-white/40 hover:text-white transition-all duration-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          whileTap={{ scale: 0.97 }}
        >
          Continue →
        </motion.button>
      </motion.div>
    )
  }

  // ── Picker view ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* Search input */}
      <div className="relative">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/15 bg-white/5 focus-within:border-white/30 transition-colors duration-200">
          <span className="text-white/30 text-sm flex-shrink-0">♪</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={selected.length >= 3 ? 'Queue full (3/3)' : 'Search for a song…'}
            disabled={selected.length >= 3}
            className="flex-1 bg-transparent text-white/80 text-sm placeholder-white/25 outline-none disabled:opacity-40"
          />
          <AnimatePresence>
            {isSearching && (
              <motion.span
                className="text-white/25 text-xs flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                searching…
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Results dropdown */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-white/10 bg-[#1a1208] shadow-xl overflow-hidden z-10"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {results.map((track, i) => {
                const alreadyAdded = selected.some(s => s.id === track.id)
                return (
                  <motion.button
                    key={track.id}
                    onClick={() => addTrack(track)}
                    disabled={alreadyAdded || selected.length >= 3}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-white/5 last:border-0 transition-colors duration-150 ${
                      alreadyAdded
                        ? 'opacity-35 cursor-default'
                        : 'hover:bg-white/6 cursor-pointer'
                    }`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.18 }}
                  >
                    {track.artwork
                      ? <img src={track.artwork} alt={track.track} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                      : <ArtworkPlaceholder />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">{track.track}</p>
                      <p className="text-white/40 text-xs truncate">{track.artist} · {track.album}</p>
                    </div>
                    {!alreadyAdded && selected.length < 3 && (
                      <span className="text-white/30 text-xs flex-shrink-0 pl-2">+ add</span>
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected tracks */}
      <AnimatePresence mode="popLayout">
        {selected.map(track => (
          <motion.div
            key={track.id}
            layout
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/8 border border-white/12"
            initial={{ opacity: 0, scale: 0.94, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: 24, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            {track.artwork
              ? <img src={track.artwork} alt={track.track} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
              : <ArtworkPlaceholder />
            }
            <div className="flex-1 min-w-0">
              <p className="text-white/88 text-sm font-medium truncate">{track.track}</p>
              <p className="text-white/45 text-xs truncate">{track.artist}</p>
            </div>
            <motion.button
              onClick={() => removeTrack(track.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/75 hover:bg-white/10 transition-all duration-150 cursor-pointer flex-shrink-0 text-base leading-none"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Slot indicators */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="h-0.5 flex-1 rounded-full"
            animate={{ backgroundColor: i < selected.length ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.3 }}
          />
        ))}
        <p className="text-xs text-white/25 ml-1 flex-shrink-0 tabular-nums">{selected.length}/3</p>
      </div>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        disabled={selected.length === 0 || isSubmitting}
        className="w-full py-4 rounded-xl border text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        animate={{
          borderColor: selected.length > 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
          backgroundColor: selected.length > 0 ? 'rgba(255,255,255,0.07)' : 'transparent',
          color: selected.length > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
        }}
        whileTap={selected.length > 0 && !isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              Reading the vibes
            </motion.span>
            <span>···</span>
          </span>
        ) : selected.length === 0 ? (
          'Add at least one song'
        ) : (
          `Lock in ${selected.length} song${selected.length !== 1 ? 's' : ''} →`
        )}
      </motion.button>

      <AnimatePresence>
        {submitError && (
          <motion.p
            className="text-center text-xs text-red-400/70 mt-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {submitError}
          </motion.p>
        )}
      </AnimatePresence>

    </div>
  )
}
