import { redirect } from 'next/navigation'

// Default entry point — redirect to the first public profile.
// Replace 'thomas' with a real profile directory lookup in a future iteration.
export default function GiftsPage() {
  redirect('/gifts/thomas')
}
