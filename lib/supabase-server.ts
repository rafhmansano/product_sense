import { createServerClient as createClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll().map(c => ({ name: c.name, value: c.value })),
        setAll: () => {
          // Server components can't set cookies
        },
      },
    }
  );
}
