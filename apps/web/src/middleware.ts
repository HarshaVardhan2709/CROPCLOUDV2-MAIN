import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Public pages that don't require authentication
  const publicPages = ['/login', '/signup', '/about', '/contact', '/faq', '/seller-onboarding'];
  const isPublicPage = publicPages.some(page => pathname === page || pathname.startsWith(page + '/'));

  if (isPublicPage) {
    // If on login/signup with token, redirect to home
    if ((pathname === '/login' || pathname === '/signup') && token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // For all other pages, require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.woff|.*\\.woff2).*)',
  ],
};