import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@kurta-my/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if we're on an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isRootRoute = req.nextUrl.pathname === '/';

  // Always redirect root to /admin if authenticated, or /login if not
  if (isRootRoute) {
    if (session) {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (isAdminRoute) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.user_metadata?.isAdmin === true;
    const role = user?.user_metadata?.role;

    if (!isAdmin || !role) {
      // Redirect to login if not admin
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (isAuthRoute && session) {
    // Redirect to admin if already authenticated
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/admin/:path*', '/login'],
}; 