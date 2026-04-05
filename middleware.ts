import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Skip if Supabase is not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => {
        return req.cookies.getAll().map(c => ({ name: c.name, value: c.value }));
      },
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // Public routes
  const publicPaths = ['/login', '/cadastro', '/compartilhado', '/onboarding'];
  const isPublic = publicPaths.some(p => pathname.startsWith(p));

  if (isPublic) {
    return res;
  }

  // Redirect to login if not authenticated
  if (!user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
