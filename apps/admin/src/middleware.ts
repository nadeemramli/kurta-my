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
  const isAuthRoute = req.nextUrl.pathname === '/login';
  const isRootRoute = req.nextUrl.pathname === '/';

  // Always redirect root to /admin if authenticated, or /login if not
  if (isRootRoute) {
    if (session) {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If trying to access admin routes without session, redirect to login
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If trying to access login page with session, redirect to admin
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/admin/:path*', '/login'],
}; 