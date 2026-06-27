import { notFound } from 'next/navigation'
import { getServerClient } from '../_lib/supabase'
import { QuizScreen } from '../_components/quiz/QuizScreen'
import type { Gift, Profile, ActionGift } from '../_lib/types'

interface Props {
  params: { slug: string }
}

async function getProfileData(slug: string) {
  const supabase = await getServerClient()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (profileError || !profile) return null

  const { data: gifts } = await supabase
    .from('gifts')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('sort_order')

  const { data: actionGifts } = await supabase
    .from('action_gifts')
    .select('*')
    .eq('profile_id', profile.id)
    .order('sort_order')

  return {
    profile: profile as Profile,
    gifts: (gifts ?? []) as Gift[],
    actionGifts: (actionGifts ?? []) as ActionGift[],
  }
}

export default async function ProfilePage({ params }: Props) {
  const data = await getProfileData(params.slug)
  if (!data) notFound()

  return (
    <QuizScreen
      profile={data.profile}
      gifts={data.gifts}
      actionGifts={data.actionGifts}
    />
  )
}
