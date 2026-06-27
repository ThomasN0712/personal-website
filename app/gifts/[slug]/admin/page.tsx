import { redirect } from 'next/navigation'
import { getServerClient } from '../../_lib/supabase'
import type { Claim, Gift, Profile } from '../../_lib/types'

interface Props {
  params: { slug: string }
}

interface GiftRow extends Gift {
  claims: Claim[]
}

async function getAdminData(slug: string) {
  const supabase = await getServerClient()

  // Verify the requesting user owns this profile
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .single()

  if (!profile) return null

  const { data: gifts } = await supabase
    .from('gifts')
    .select('*, claims(*)')
    .eq('profile_id', profile.id)
    .order('sort_order')

  return { profile: profile as Profile, gifts: (gifts ?? []) as GiftRow[] }
}

export default async function AdminPage({ params }: Props) {
  const data = await getAdminData(params.slug)

  if (!data) redirect(`/gifts/${params.slug}`)

  const { profile, gifts } = data
  const totalClaims = gifts.reduce((sum, g) => sum + g.claims.length, 0)

  return (
    <main className="min-h-screen bg-[#FAF7F2] p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-1">
          <p className="text-xs text-stone-400 uppercase tracking-widest">Admin</p>
          <h1
            className="text-2xl font-bold text-stone-800"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {profile.display_name}&apos;s Gift Claims
          </h1>
          <p className="text-sm text-stone-500">
            {totalClaims} total claims across {gifts.length} gifts
          </p>
        </header>

        <div className="space-y-3">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-stone-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-stone-800">{gift.name}</p>
                  {gift.price_tier && (
                    <p className="text-xs text-stone-400">{gift.price_tier}</p>
                  )}
                </div>
                <span className="shrink-0 text-sm font-semibold text-stone-600">
                  {gift.claims.length} claim{gift.claims.length !== 1 ? 's' : ''}
                </span>
              </div>

              {gift.claims.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-stone-100 pt-3">
                  {gift.claims.map((claim) => (
                    <li key={claim.id} className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        {claim.claimer_name ?? 'Anonymous'}
                      </span>
                      <span className="text-stone-400">
                        {new Date(claim.claimed_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
