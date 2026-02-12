import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create admin client for server-side operations (API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type Database = {
  public: {
    Tables: {
      subscribers: {
        Row: {
          id: string;
          email: string;
          status: 'subscribed' | 'unsubscribed';
          token: string;
          created_at: string;
          unsubscribed_at: string | null;
          preference_days: string[];
          last_sent_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          status?: 'subscribed' | 'unsubscribed';
          token: string;
          created_at?: string;
          unsubscribed_at?: string | null;
          preference_days?: string[];
          last_sent_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          status?: 'subscribed' | 'unsubscribed';
          token?: string;
          created_at?: string;
          unsubscribed_at?: string | null;
          preference_days?: string[];
          last_sent_at?: string | null;
        };
      };
    };
  };
};
