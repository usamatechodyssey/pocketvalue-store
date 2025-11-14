import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ratelimiter } from './app/lib/rate-limiter';
import { ipAddress } from '@vercel/functions';

// --- Role-Based Access Control (RBAC) Configuration ---
const adminPaths: { [key: string]: string[] } = {
    '/Bismillah786/products': ['Super Admin', 'Content Editor'],
    '/Bismillah786/categories': ['Super Admin', 'Content Editor'],
    '/Bismillah786/orders': ['Super Admin', 'Store Manager'],
    '/Bismillah786/returns': ['Super Admin', 'Store Manager'],
    '/Bismillah786/users': ['Super Admin', 'Store Manager'],
    '/Bismillah786/analytics': ['Super Admin'],
    '/Bismillah786/settings': ['Super Admin'],
    '/Bismillah786/admins': ['Super Admin'],
};

// Helper function to set marketing cookies
function setCookie(res: NextResponse, name: string, value: string) {
  res.cookies.set(name, value, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 });
}

// NOTE: Renamed from 'middleware' to 'proxy' for Next.js 16 compatibility.
// We are keeping it async for now to support getToken, which is crucial for security.
export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  
  // --- Marketing Tracker Logic ---
  const utm_source = req.nextUrl.searchParams.get('utm_source');
  const utm_medium = req.nextUrl.searchParams.get('utm_medium');
  const utm_campaign = req.nextUrl.searchParams.get('utm_campaign');

  if (utm_source) setCookie(res, 'utm_source', utm_source);
  if (utm_medium) setCookie(res, 'utm_medium', utm_medium);
  if (utm_campaign) setCookie(res, 'utm_campaign', utm_campaign);

   // --- API RATE LIMITING ---
  const sensitivePostRoutes = ['/api/auth/register', '/api/auth/callback/credentials'];
  if (req.method === 'POST' && sensitivePostRoutes.some(route => pathname.startsWith(route))) {
    const ip = ipAddress(req) || '127.0.0.1';
    
    try {
        const { success } = await ratelimiter.limit(ip);
        if (!success) {
          return NextResponse.json(
            { error: "Too Many Requests" },
            { status: 429 }
          );
        }
    } catch (error) {
        console.error("Rate limiter error:", error);
    }
  }

  // --- AUTHENTICATION & AUTHORIZATION LOGIC ---
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const userRole = token?.role as string || 'customer';

  // Admin Panel Protection
  if (pathname.startsWith('/Bismillah786')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole === 'customer') {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
    const basePath = Object.keys(adminPaths).find(path => pathname.startsWith(path));
    if (basePath) {
        const allowedRoles = adminPaths[basePath];
        if (!allowedRoles.includes(userRole)) {
            return NextResponse.redirect(new URL('/Bismillah786?error=permission-denied', req.url));
        }
    }
    return res;
  }

  // Customer-Facing Protected Routes
  const protectedCustomerRoutes = ['/account', '/wishlist', '/checkout'];
  if (protectedCustomerRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

// The config object remains the same.
export const config = {
  matcher: [
    '/((?!api/auth/(?:session|providers)|_next/static|_next/image|favicon.ico).*)',
  ],
};




