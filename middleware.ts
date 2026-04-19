import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard'];
const AUTH_ONLY = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value ||
                req.headers.get('authorization')?.replace('Bearer ', '');

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthRoute = AUTH_ONLY.some(p => pathname.startsWith(p));

  // Cross-domain cookie check is not possible in Middleware (Vercel server cannot see Render cookies)
  // We will rely on client-side AuthContext to handle protection.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
