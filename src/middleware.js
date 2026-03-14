import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If the user hits the root '/', redirect them to '/dashboard'
  // The Dashboard will then check LocalStorage and kick them to '/login' if needed.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};