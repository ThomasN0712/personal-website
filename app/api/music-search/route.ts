import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=8`
  const res = await fetch(url, { next: { revalidate: 60 } })
  const data = await res.json()

  const results = (data.results ?? []).map((r: Record<string, unknown>) => ({
    id: String(r.trackId),
    track: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    artwork: typeof r.artworkUrl100 === 'string'
      ? r.artworkUrl100.replace('100x100bb', '300x300bb')
      : null,
  }))

  return NextResponse.json({ results })
}
