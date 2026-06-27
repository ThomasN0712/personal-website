'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ShopQuestion, ShopItem, Choice } from '../../_lib/types'

interface Props {
  question: ShopQuestion
  onAnswer: (choice: Choice) => void
}

interface ThresholdBanner {
  id: number
  message: string
  variant: 'info' | 'warning' | 'debt'
}

const COMBO_TRIGGERS = [
  { check: (c: ShopItem[]) => c.filter(i => i.category === 'snacks').length >= 3, message: "Big snack energy.", key: 'snacks-3' },
  { check: (c: ShopItem[]) => c.filter(i => i.category === 'snacks').length === 5, message: "You skipped lunch, didn't you.", key: 'snacks-5' },
  { check: (c: ShopItem[]) => c.some(i => i.id === 'doreen') && c.some(i => i.id === 'cousin-mug'), message: "Two mugs. Bold.", key: 'two-mugs' },
  { check: (c: ShopItem[]) => c.some(i => i.id === 'crystal') && c.filter(i => ['candle', 'postcards', 'gerald'].includes(i.id)).length >= 1, message: "You're stocking up. Tough week?", key: 'crystal-combo' },
]

const CHECKOUT_LINES: { check: (b: number, l: number) => boolean; line: string }[] = [
  { check: (_, l) => l === 0, line: "Nothing? Alright. The road awaits." },
  { check: b => b === 0, line: "You did the math. Respect." },
  { check: b => b > 0, line: "Sensible. Boring, but sensible." },
  { check: b => b < 0 && b >= -25, line: "You'll figure it out. Probably." },
  { check: b => b < -25 && b >= -50, line: "Good luck with that." },
  { check: b => b < -50, line: "I'll see you again. I always do." },
]

const CATEGORY_GRADIENT: Record<string, string> = {
  snacks: 'from-amber-500/20 to-orange-600/10',
  trinkets: 'from-sky-500/20 to-blue-600/10',
  curiosities: 'from-violet-500/20 to-purple-600/10',
}
const CATEGORY_BORDER: Record<string, string> = {
  snacks: 'border-amber-500/20',
  trinkets: 'border-sky-500/20',
  curiosities: 'border-violet-500/20',
}

function calcBalance(cart: ShopItem[], budget: number) {
  return budget - cart.reduce((s, i) => s + i.price, 0)
}

function scoringWeights(cart: ShopItem[], balance: number): [number, number] {
  if (cart.length === 0) return [-2, -1]
  let dx = cart.reduce((s, i) => s + i.weights[0], 0)
  let dy = cart.reduce((s, i) => s + i.weights[1], 0)
  if (balance < 0) {
    const debt = Math.abs(balance)
    if (debt > 50) { dx += 3; dy += 2 }
    else if (debt > 25) { dx += 2; dy += 2 }
    else { dx += 1; dy += 1 }
  }
  return [dx, dy]
}

export function ShopMinigame({ question, onAnswer }: Props) {
  const budget = question.budget
  const [cart, setCart] = useState<ShopItem[]>([])
  const [activeCategory, setActiveCategory] = useState(question.categories[0].id)
  const [daleMessage, setDaleMessage] = useState("Welcome.")
  const [cartOpen, setCartOpen] = useState(false)
  const [pendingRemove, setPendingRemove] = useState<string | null>(null)
  const [banner, setBanner] = useState<ThresholdBanner | null>(null)
  const [checkedOut, setCheckedOut] = useState(false)
  const [checkoutLine, setCheckoutLine] = useState('')
  const [shownThresholds, setShownThresholds] = useState<Set<string>>(new Set())
  const [shownCombos, setShownCombos] = useState<Set<string>>(new Set())
  const [firstItemAdded, setFirstItemAdded] = useState(false)
  const [shopImageExpanded, setShopImageExpanded] = useState(false)

  const bannerIdRef = useRef(0)
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null)
  const daleQueueRef = useRef<string[]>([])
  const daleShowingRef = useRef(false)
  const lastInteractionRef = useRef(Date.now())

  const showDaleMessage = useCallback((msg: string) => {
    daleQueueRef.current.push(msg)
    if (daleShowingRef.current) return
    const flush = () => {
      const next = daleQueueRef.current.shift()
      if (!next) { daleShowingRef.current = false; return }
      daleShowingRef.current = true
      setDaleMessage(next)
      setTimeout(flush, 3500)
    }
    flush()
  }, [])

  const showBanner = useCallback((msg: string, variant: ThresholdBanner['variant']) => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    const id = ++bannerIdRef.current
    setBanner({ id, message: msg, variant })
    bannerTimerRef.current = setTimeout(() => setBanner(null), 2800)
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => { if (Date.now() - lastInteractionRef.current >= 19000) showDaleMessage("Take your time. Or don't.") }, 20000),
      setTimeout(() => { if (Date.now() - lastInteractionRef.current >= 44000) showDaleMessage("Are you... shopping?") }, 45000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [showDaleMessage])

  const balance = calcBalance(cart, budget)
  const isInDebt = balance < 0
  const totalSpent = budget - balance
  const scalePercent = Math.min(100, Math.max(0, (balance / budget) * 100))

  useEffect(() => {
    const checks = [
      { key: 'half',       threshold: 25,    msg: "Halfway through. Still got it.",              variant: 'info'    as const },
      { key: 'quarter',    threshold: 12,    msg: "Cutting it close.",                           variant: 'warning' as const },
      { key: 'zero',       threshold: 0,     msg: "Right at the edge. Bold.",                    variant: 'warning' as const },
      { key: 'debt-first', threshold: -0.01, msg: "OH NO. You're in debt now.",                  variant: 'debt'    as const },
      { key: 'debt-25',    threshold: -25,   msg: "Interest is accruing as we speak.",           variant: 'debt'    as const },
      { key: 'debt-50',    threshold: -50,   msg: "You're calling your mom about this tonight.", variant: 'debt'    as const },
      { key: 'debt-75',    threshold: -75,   msg: "This is a problem for Future You.",           variant: 'debt'    as const },
    ]
    checks.forEach(({ key, threshold, msg, variant }) => {
      if (!shownThresholds.has(key) && balance <= threshold) {
        setShownThresholds(prev => new Set([...prev, key]))
        showBanner(msg, variant)
        if (key === 'debt-first') showDaleMessage("That's a credit card decision.")
      }
    })
  }, [balance, shownThresholds, showBanner, showDaleMessage])

  function addItem(item: ShopItem) {
    if (cart.find(i => i.id === item.id)) return
    lastInteractionRef.current = Date.now()
    const newCart = [...cart, item]
    setCart(newCart)
    if (!firstItemAdded) { setFirstItemAdded(true); showDaleMessage("There it is.") }
    else showDaleMessage(item.shopkeeperLine)
    COMBO_TRIGGERS.forEach(({ check, message, key }) => {
      if (!shownCombos.has(key) && check(newCart)) {
        setShownCombos(prev => new Set([...prev, key]))
        setTimeout(() => showDaleMessage(message), 3600)
      }
    })
  }

  function removeItem(id: string) {
    lastInteractionRef.current = Date.now()
    setCart(prev => prev.filter(i => i.id !== id))
    setPendingRemove(null)
    showDaleMessage("Cold feet?")
  }

  function handleItemTap(item: ShopItem) {
    cart.find(i => i.id === item.id) ? setPendingRemove(item.id) : addItem(item)
  }

  function handleCheckout() {
    const b = calcBalance(cart, budget)
    setCheckoutLine(CHECKOUT_LINES.find(({ check }) => check(b, cart.length))?.line ?? "Safe travels.")
    setCheckedOut(true)
  }

  function handleCheckoutContinue() {
    const b = calcBalance(cart, budget)
    const [dx, dy] = scoringWeights(cart, b)
    onAnswer({ id: 'shop', label: 'Shop checkout', weights: [dx, dy] })
  }

  const activeItems = question.categories.find(c => c.id === activeCategory)?.items ?? []

  const card = 'rounded-2xl bg-white/5'

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">

      {/* ── Threshold banner ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {banner && (
          <motion.div
            key={banner.id}
            className={`absolute top-0 inset-x-0 z-30 py-3 px-5 text-sm font-semibold text-center shadow-lg ${
              banner.variant === 'debt'    ? 'bg-red-500 text-white' :
              banner.variant === 'warning' ? 'bg-amber-400 text-amber-950' :
                                            'bg-emerald-500 text-white'
            }`}
            initial={{ y: -56 }}
            animate={{ y: 0 }}
            exit={{ y: -56 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {banner.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Remove modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {pendingRemove && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center px-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPendingRemove(null)}
          >
            <motion.div
              className={`${card} p-6 w-full max-w-xs`}
              initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <p className="text-white/80 text-sm mb-4">Remove from cart?</p>
              <div className="flex gap-2">
                <button onClick={() => removeItem(pendingRemove)} className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm cursor-pointer hover:bg-red-500/30 transition-colors">Remove</button>
                <button onClick={() => setPendingRemove(null)} className="flex-1 py-2 rounded-xl bg-white/8 border border-white/15 text-white/60 text-sm cursor-pointer hover:bg-white/12 transition-colors">Keep it</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Checkout receipt overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {checkedOut && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center px-8 py-10 gap-6"
            style={{ background: 'var(--quiz-bg, #0E0A06)' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl">🧾</div>
            <p className="text-white/60 text-sm italic text-center max-w-xs">"{checkoutLine}"</p>
            <div className={`${card} w-full max-w-xs p-5 flex flex-col gap-3`}>
              <p className="text-white/30 text-xs uppercase tracking-widest">Receipt</p>
              {cart.length === 0 ? (
                <p className="text-white/40 text-sm">No items purchased.</p>
              ) : cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/70 truncate mr-2">{item.name}</span>
                  <span className="text-white/40 flex-shrink-0">${item.price}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-medium">
                <span className="text-white/60">Total</span>
                <span className={isInDebt ? 'text-red-400' : 'text-white/80'}>${totalSpent}</span>
              </div>
              {isInDebt && <p className="text-red-400/70 text-xs">Debt incurred: ${Math.abs(balance)}</p>}
            </div>
            <button onClick={handleCheckoutContinue} className="px-8 py-3 rounded-full border border-white/25 bg-white/8 text-white/80 text-sm tracking-wide cursor-pointer hover:bg-white/15 hover:border-white/40 hover:text-white transition-all duration-200">
              Back on the road →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shop image expanded (tap-to-open on mobile) ───────────────────── */}
      <AnimatePresence>
        {shopImageExpanded && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-8 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShopImageExpanded(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl overflow-hidden relative"
              style={{ aspectRatio: '4/3' }}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              {question.illustration
                ? <img src={question.illustration} alt={question.scene} className="w-full h-full object-contain" />
                : <div className="w-full h-full bg-white/8 flex flex-col items-center justify-center gap-2">
                    <p className="text-white/25 text-xs uppercase tracking-widest font-mono">illustration</p>
                    <p className="text-white/35 text-sm">{question.scene}</p>
                  </div>
              }
              <button
                onClick={() => setShopImageExpanded(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white/60 text-base flex items-center justify-center cursor-pointer hover:text-white"
              >×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main body: 80%-wide centered container ────────────────────────── */}
      <div className="flex-1 overflow-hidden flex items-stretch justify-center">
      <div className="w-full md:max-w-[80%] flex flex-row overflow-y-auto md:overflow-hidden p-3 gap-3">

        {/*
          4-card layout:
          Mobile  → flex-col, scrollable, cards stack in DOM order
          Desktop → 2×2 grid, left col (70%) = shop+items, right col (30%) = dale+cart
          DOM order [shop, dale, items, cart] maps naturally to both.
        */}
        <div className="
          flex-1 min-h-0
          flex flex-col gap-3
          md:overflow-hidden md:grid md:grid-cols-[7fr_3fr] md:gap-3
        ">

          {/* ── Card 1: Shop illustration ──────────────────────────────── */}
          {/* Mobile: tap to expand. Desktop: fills card passively. */}
          <button
            className={`${card} overflow-hidden block w-full text-left cursor-pointer md:cursor-default min-h-0`}
            onClick={() => setShopImageExpanded(true)}
          >
            {question.illustration
              ? <img src={question.illustration} alt={question.scene} className="w-full h-full object-cover" />
              : <div className="w-full flex flex-col items-center justify-center gap-1.5 p-4">
                  <p className="text-white/15 text-[10px] uppercase tracking-widest font-mono">shop illustration</p>
                  <p className="text-white/25 text-xs">{question.scene}</p>
                </div>
            }
          </button>

          {/* ── Card 2: Dale + speech bubble ───────────────────────────── */}
          <div className={`${card} p-4 flex gap-3 items-start min-h-0 overflow-hidden`}>
            {/* Dale illustration placeholder */}
            <div className="flex-shrink-0 w-14 md:w-16 rounded-xl bg-white/5 border border-dashed border-white/15 flex flex-col items-center justify-center gap-1 py-3 px-2 self-center">
              <span className="text-2xl md:text-3xl">🦝</span>
              <p className="text-white/20 text-[8px] uppercase tracking-widest">Dale</p>
            </div>

            {/* Speech bubble with left-pointing triangle */}
            <div className="relative flex-1 min-w-0">
              <div
                className="absolute left-0 top-4 -translate-x-full"
                style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '8px solid rgba(255,255,255,0.08)' }}
              />
              <div className="bg-white/6 border border-white/10 rounded-2xl rounded-tl-sm p-3">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={daleMessage}
                    className="text-white/65 text-sm italic leading-relaxed"
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                  >
                    "{daleMessage}"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Card 3: Item grid ───────────────────────────────────────── */}
          <div className={`${card} overflow-hidden flex flex-col min-h-0`}>
            {/* Category tabs */}
            <div className="flex gap-1.5 px-3 pt-3 pb-2 flex-shrink-0">
              {question.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'bg-white/5 text-white/40 border border-white/8 hover:bg-white/10 hover:text-white/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Items — scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 px-3 pb-3 grid grid-cols-2 gap-2 content-start">
              {activeItems.map(item => {
                const inCart = cart.some(i => i.id === item.id)
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemTap(item)}
                    className={`relative text-left rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer ${
                      inCart ? 'bg-white/12 border-white/25' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/18'
                    }`}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Illustration placeholder */}
                    <div
                      className={`w-full bg-gradient-to-br ${CATEGORY_GRADIENT[item.category]} border-b ${CATEGORY_BORDER[item.category]} flex items-center justify-center relative`}
                    >
                      <span className="text-2xl opacity-40 select-none">
                        {question.categories.find(c => c.id === item.category)?.icon}
                      </span>
                      <p className="absolute bottom-0.5 left-0 right-0 text-center text-[7px] text-white/12 uppercase tracking-widest font-mono">illustration</p>
                      <AnimatePresence>
                        {inCart && (
                          <motion.div
                            className="absolute inset-0 bg-emerald-500/25 flex items-center justify-center"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          >
                            <span className="text-emerald-300 text-xl font-bold">✓</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Info */}
                    <div className="p-2">
                      <p className="text-white/80 text-xs font-medium leading-snug">{item.name}</p>
                      <p className="text-white/30 text-[10px] mt-0.5 leading-snug">{item.description}</p>
                      <p className="text-white/55 text-xs mt-1 font-semibold">${item.price}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* ── Card 4: Cart + checkout (budget meter inside on desktop) ─── */}
          <div className={`${card} flex min-h-0 overflow-hidden`}>

            {/* Cart section */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Cart toggle */}
              <button
                onClick={() => setCartOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/4 transition-colors flex-shrink-0 rounded-tl-2xl"
              >
                <span className="text-white/50 text-sm">
                  🛒 {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  {cart.length > 0 && <span className="ml-2 text-white/30 text-xs">${totalSpent} spent</span>}
                </span>
                <span className={`text-white/30 text-xs transition-transform duration-200 ${cartOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              <AnimatePresence>
                {cartOpen && (
                  <motion.div
                    className="overflow-hidden flex-shrink-0"
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <div className="px-4 pb-2 max-h-28 overflow-y-auto">
                      {cart.length === 0 ? (
                        <p className="text-white/25 text-xs py-1">Nothing yet.</p>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-2 py-0.5">
                              <span className="text-white/60 text-xs flex-1 truncate">{item.name}</span>
                              <span className="text-white/35 text-xs flex-shrink-0">${item.price}</span>
                              <button onClick={() => removeItem(item.id)} className="text-white/25 hover:text-red-400 text-xs cursor-pointer transition-colors ml-1">×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Balance + checkout */}
              <div className="mt-auto flex flex-col gap-2 px-4 pb-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">Balance</span>
                  <span className={`text-sm font-medium tabular-nums ${isInDebt ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isInDebt ? `-$${Math.abs(balance)}` : `$${balance}`}
                    <span className="text-xs font-normal text-white/30 ml-1">{isInDebt ? 'owed' : 'left'}</span>
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 rounded-xl border border-white/20 bg-white/8 text-white/80 text-sm tracking-wide cursor-pointer hover:bg-white/14 hover:border-white/30 hover:text-white transition-all duration-200"
                >
                  CHECK OUT
                </button>
              </div>
            </div>

            {/* Budget meter — visible on desktop only, nested inside the cart card */}
            <div className="hidden md:flex w-9 flex-shrink-0 flex-col items-center py-3 px-1 gap-1.5">
              <p className="text-white/20 text-[8px] tabular-nums">$50</p>
              <div className="flex-1 relative w-2.5 rounded-full overflow-hidden bg-white/8 min-h-0">
                <div
                  className="absolute inset-0 rounded-full transition-all duration-700"
                  style={{
                    background: isInDebt
                      ? `rgba(239,68,68,${Math.min(0.85, 0.35 + Math.abs(balance) / 75 * 0.5)})`
                      : `linear-gradient(to bottom, #10b981, #f59e0b)`,
                    opacity: isInDebt ? 1 : 0.5,
                  }}
                />
                <motion.div
                  className="absolute left-0 right-0 h-2.5 rounded-full bg-white shadow-sm"
                  animate={{ top: `${Math.max(0, Math.min(92, isInDebt ? 92 : 100 - scalePercent))}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                />
              </div>
              <p className="text-white/20 text-[8px] tabular-nums">$0</p>
            </div>

          </div>

        </div>
      </div>
      </div>
    </div>
  )
}
