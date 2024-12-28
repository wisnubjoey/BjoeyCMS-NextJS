import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  // Debug logs
  console.log('🔒 Middleware Check:', {
    path: request.nextUrl.pathname,
    hasToken: !!token,
    tokenValue: token?.value,
    isAuthPage,
    cookies: request.cookies.getAll()
  });

  if (isAuthPage && token) {
    console.log('📍 Redirecting to dashboard (has token)');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthPage && !token) {
    console.log('📍 Redirecting to login (no token)');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('✅ Allowing request to continue');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
};