import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const client = new OpenAI()

interface Song {
  track: string
  artist: string
}

export async function POST(req: NextRequest) {
  const { songs } = await req.json() as { songs: Song[] }

  if (!songs?.length) {
    return NextResponse.json({ dx: 0, dy: 0, comment: 'No songs. Bold choice.' })
  }

  const songList = songs.map(s => `"${s.track}" by ${s.artist}`).join(', ')

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `You are a personality-quiz engine for a silly road trip story where everyone is a cartoon animal.

Two scoring axes (return integers -3 to 3):
- dx: Chaotic/impulsive energy (+) vs. measured/reserved energy (-)
- dy: Social/loud/extroverted (+) vs. introspective/chill/introverted (-)

The user queued these songs for the group aux cord: ${songList}

Score their personality based on the overall vibe. Then write ONE sentence roasting their music taste — be sharp, specific to the actual songs, and a little mean in a funny way. No generic compliments.

Reply ONLY with valid JSON, no markdown, no extra text:
{"dx": <integer>, "dy": <integer>, "comment": "<one sentence roast>"}`,
      }],
    })

    const raw = response.choices[0]?.message?.content?.trim() ?? ''
    const parsed = JSON.parse(raw)

    return NextResponse.json({
      dx: Math.max(-3, Math.min(3, Math.round(Number(parsed.dx) || 0))),
      dy: Math.max(-3, Math.min(3, Math.round(Number(parsed.dy) || 0))),
      comment: typeof parsed.comment === 'string' ? parsed.comment : 'Interesting playlist. Moving on.',
    })
  } catch {
    return NextResponse.json({ error: true }, { status: 500 })
  }
}

