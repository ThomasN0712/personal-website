import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Run on all gifts routes so sessions are refreshed for auth-gated pages.
    '/gifts/:path*',
  ],
}
