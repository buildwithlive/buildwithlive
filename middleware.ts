import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. User යන්න හදන path එක ගන්න
  const path = request.nextUrl.pathname;

  // 2. "/reader" වලට යන්න හදනවා නම් විතරක් Check කරන්න
  if (path.startsWith('/reader')) {
    
    // 3. Browser එකේ "auth_token" කියන කුකී එක තියෙනවද බලන්න
    const token = request.cookies.get('auth_token')?.value;

    // 4. ටෝකන් එක නැත්නම්, Login පිටුවට හරවන්න
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // අනිත් පිටු වලට යන්න දෙනවා
  return NextResponse.next();
}

// මේ Middleware එක වැඩ කරන්නේ /reader පිටුවට විතරයි
export const config = {
  matcher: '/reader/:path*',
};