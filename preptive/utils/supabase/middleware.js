// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware - Path:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Optional: change matcher or remove temporarily
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};