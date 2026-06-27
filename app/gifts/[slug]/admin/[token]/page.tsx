import { redirect } from 'next/navigation'

// The token-based admin URL is superseded by /gifts/[slug]/admin.
// Redirect any old bookmarked links.
export default function OldAdminRedirect({ params }: { params: { slug: string } }) {
  redirect(`/gifts/${params.slug}/admin`)
}
