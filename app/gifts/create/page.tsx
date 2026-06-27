'use client'

// Profile creation flow — implemented in Phase 4.
export default function CreatePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="text-center space-y-2 p-8">
        <p className="text-sm text-stone-400 uppercase tracking-widest">Gift Match</p>
        <h1
          className="text-3xl font-bold text-stone-800"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Create Your Profile
        </h1>
        <p className="text-stone-500 text-sm">Coming in Phase 4.</p>
      </div>
    </main>
  )
}
