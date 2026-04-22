import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

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
        cookies.forEach(({ name, value }) => {
          req.cookies.set(name, value);
        });
        res = NextResponse.next({ request: req });
        cookies.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session — this also updates cookies if the token was refreshed
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // Public routes
  const publicPaths = ['/login', '/cadastro', '/compartilhado', '/onboarding'];
  const isPublic = publicPaths.some(p => pathname.startsWith(p));

  if (isPublic) {
    // If logged in and on login/cadastro, redirect to home
    if (user && (pathname === '/login' || pathname === '/cadastro')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
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
