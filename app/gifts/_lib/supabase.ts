// Re-exports for use within the gifts app.
// Source of truth lives in utils/supabase/ (Supabase SSR pattern).
export { createClient as getBrowserClient } from '@/utils/supabase/client'
export { createClient as getServerClient } from '@/utils/supabase/server'
