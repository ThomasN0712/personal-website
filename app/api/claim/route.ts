import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { giftId, claimerName } = await req.json()
  if (!giftId) return NextResponse.json({ error: 'giftId required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase
    .from('claims')
    .insert({ gift_id: giftId, claimer_name: claimerName ?? null })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
