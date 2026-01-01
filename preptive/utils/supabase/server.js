// utils/supabase/server.js
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Simple static client for data fetching (no auth needed)
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false, // Disable session for static pages
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    }
  );
}

// Alternative: Server-side client with cookies (if needed for auth)
export async function createServerClient() {
  const { createServerClient: createSupabaseServerClient } = await import('@supabase/ssr');
  const { cookies } = await import('next/headers');
  
  const cookieStore = await cookies();
  
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name, value, options) {
          try {
            (await cookieStore).set(name, value, options);
          } catch (error) {
            // Handle error
          }
        },
        async remove(name, options) {
          try {
            (await cookieStore).set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            // Handle error
          }
        },
      },
    }
  );
}