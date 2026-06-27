import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gift Match',
  description: 'Find the perfect gift.',
}

export default function GiftsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${playfair.variable} ${dmSans.variable}`}
      style={{ fontFamily: 'var(--font-body, sans-serif)' }}
    >
      {children}
    </div>
  )
}
