
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from './app/lib/session';
import { getToken } from 'next-auth/jwt';

// Helper function to set a cookie (No changes)
function setCookie(res: NextResponse, name: string, value: string) {
  res.cookies.set(name, value, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  
  // --- Marketing Tracker Logic (No changes) ---
  const utm_source = req.nextUrl.searchParams.get('utm_source');
  const utm_medium = req.nextUrl.searchParams.get('utm_medium');
  const utm_campaign = req.nextUrl.searchParams.get('utm_campaign');

  if (utm_source) setCookie(res, 'utm_source', utm_source);
  if (utm_medium) setCookie(res, 'utm_medium', utm_medium);
  if (utm_campaign) setCookie(res, 'utm_campaign', utm_campaign);

  // --- Admin Panel Protection (No changes) ---
  if (pathname.startsWith('/Bismillah786')) {
    if (pathname.startsWith('/Bismillah786/login')) {
      return res;
    }
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL('/Bismillah786/login', req.url));
    }
    return res;
  }

  // === NEW: CUSTOMER-FACING PROTECTED ROUTES LOGIC ===
  const protectedCustomerRoutes = [
    '/account', 
    '/wishlist', 
    '/cart', 
    '/checkout'
  ];

  // Check if the current path starts with any of the protected routes
  if (protectedCustomerRoutes.some(route => pathname.startsWith(route))) {
    // Get the NextAuth.js session token
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    // If there's no token (user is not logged in)
    if (!token) {
      // Create a URL to the login page
      const loginUrl = new URL('/login', req.url);
      // Add a `redirect` parameter so we can send the user back after login
      loginUrl.searchParams.set('redirect', pathname);
      
      // Redirect to the login page
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the route is not protected, or the user is logged in, continue as normal
  return res;
}

// Config (No changes needed)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};