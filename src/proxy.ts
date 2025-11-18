// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// import { ratelimiter } from './app/lib/rate-limiter';
// import { ipAddress } from '@vercel/functions';

// // --- Role-Based Access Control (RBAC) Configuration ---
// const adminPaths: { [key: string]: string[] } = {
//     '/Bismillah786/products': ['Super Admin', 'Content Editor'],
//     '/Bismillah786/categories': ['Super Admin', 'Content Editor'],
//     '/Bismillah786/orders': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/returns': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/users': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/analytics': ['Super Admin'],
//     '/Bismillah786/settings': ['Super Admin'],
//     '/Bismillah786/admins': ['Super Admin'],
// };

// // Helper function to set marketing cookies
// function setCookie(res: NextResponse, name: string, value: string) {
//   res.cookies.set(name, value, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 });
// }

// // NOTE: Renamed from 'middleware' to 'proxy' for Next.js 16 compatibility.
// // We are keeping it async for now to support getToken, which is crucial for security.
// export async function proxy(req: NextRequest) {
//   const res = NextResponse.next();
//   const { pathname } = req.nextUrl;
  
//   // --- Marketing Tracker Logic ---
//   const utm_source = req.nextUrl.searchParams.get('utm_source');
//   const utm_medium = req.nextUrl.searchParams.get('utm_medium');
//   const utm_campaign = req.nextUrl.searchParams.get('utm_campaign');

//   if (utm_source) setCookie(res, 'utm_source', utm_source);
//   if (utm_medium) setCookie(res, 'utm_medium', utm_medium);
//   if (utm_campaign) setCookie(res, 'utm_campaign', utm_campaign);

//    // --- API RATE LIMITING ---
//   const sensitivePostRoutes = ['/api/auth/register', '/api/auth/callback/credentials'];
//   if (req.method === 'POST' && sensitivePostRoutes.some(route => pathname.startsWith(route))) {
//     const ip = ipAddress(req) || '127.0.0.1';
    
//     try {
//         const { success } = await ratelimiter.limit(ip);
//         if (!success) {
//           return NextResponse.json(
//             { error: "Too Many Requests" },
//             { status: 429 }
//           );
//         }
//     } catch (error) {
//         console.error("Rate limiter error:", error);
//     }
//   }

//   // --- AUTHENTICATION & AUTHORIZATION LOGIC ---
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
//   const userRole = token?.role as string || 'customer';

//   // Admin Panel Protection
//   if (pathname.startsWith('/Bismillah786')) {
//     if (!token) {
//       const loginUrl = new URL('/login', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//     if (userRole === 'customer') {
//       return NextResponse.redirect(new URL('/access-denied', req.url));
//     }
//     const basePath = Object.keys(adminPaths).find(path => pathname.startsWith(path));
//     if (basePath) {
//         const allowedRoles = adminPaths[basePath];
//         if (!allowedRoles.includes(userRole)) {
//             return NextResponse.redirect(new URL('/Bismillah786?error=permission-denied', req.url));
//         }
//     }
//     return res;
//   }

//   // Customer-Facing Protected Routes
//   const protectedCustomerRoutes = ['/account', '/wishlist', '/checkout'];
//   if (protectedCustomerRoutes.some(route => pathname.startsWith(route))) {
//     if (!token) {
//       const loginUrl = new URL('/login', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return res;
// }

// // The config object remains the same.
// export const config = {
//   matcher: [
//     '/((?!api/auth/(?:session|providers)|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

// // /src/proxy.ts (THE FINAL, BULLETPROOF JWT VERSION)

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt'; // <-- THE CRITICAL CHANGE: Use getToken for JWT strategy
// import { ratelimiter } from './app/lib/rate-limiter';
// import { ipAddress } from '@vercel/functions';

// // --- Role-Based Access Control (RBAC) Configuration (No changes here) ---
// const adminPaths: { [key: string]: string[] } = {
//     '/Bismillah786/products': ['Super Admin', 'Content Editor'],
//     '/Bismillah786/categories': ['Super Admin', 'Content Editor'],
//     '/Bismillah786/orders': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/returns': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/users': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/analytics': ['Super Admin'],
//     '/Bismillah786/settings': ['Super Admin'],
//     '/Bismillah786/admins': ['Super Admin'],
// };

// // Helper function to set marketing cookies (No changes here)
// function setCookie(res: NextResponse, name: string, value: string) {
//   res.cookies.set(name, value, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 });
// }

// export async function proxy(req: NextRequest) {
//   const res = NextResponse.next();
//   const { pathname } = req.nextUrl;
  
//   // --- Marketing Tracker Logic (No changes here) ---
//   const utm_source = req.nextUrl.searchParams.get('utm_source');
//   const utm_medium = req.nextUrl.searchParams.get('utm_medium');
//   const utm_campaign = req.nextUrl.searchParams.get('utm_campaign');

//   if (utm_source) setCookie(res, 'utm_source', utm_source);
//   if (utm_medium) setCookie(res, 'utm_medium', utm_medium);
//   if (utm_campaign) setCookie(res, 'utm_campaign', utm_campaign);

//    // --- API RATE LIMITING (No changes here) ---
//   const sensitivePostRoutes = ['/api/auth/register', '/api/auth/callback/credentials'];
//   if (req.method === 'POST' && sensitivePostRoutes.some(route => pathname.startsWith(route))) {
//     const ip = ipAddress(req) || '127.0.0.1';
    
//     try {
//         const { success } = await ratelimiter.limit(ip);
//         if (!success) {
//           return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
//         }
//     } catch (error) {
//         console.error("Rate limiter error:", error);
//     }
//   }

//   // --- AUTHENTICATION & AUTHORIZATION LOGIC (UPDATED FOR JWT) ---
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
//   const userRole = token?.role as string || 'customer';

//   // Admin Panel Protection
//   if (pathname.startsWith('/Bismillah786')) {
//     if (!token) { // Check for the token, not the session object
//       const loginUrl = new URL('/login', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//     if (userRole === 'customer') {
//       return NextResponse.redirect(new URL('/access-denied', req.url));
//     }
//     const basePath = Object.keys(adminPaths).find(path => pathname.startsWith(path));
//     if (basePath) {
//         const allowedRoles = adminPaths[basePath];
//         if (!allowedRoles.includes(userRole)) {
//             return NextResponse.redirect(new URL('/Bismillah786?error=permission-denied', req.url));
//         }
//     }
//     return res;
//   }

//   // Customer-Facing Protected Routes
//   const protectedCustomerRoutes = ['/account', '/wishlist', '/checkout'];
//   if (protectedCustomerRoutes.some(route => pathname.startsWith(route))) {
//     if (!token) { // Check for the token
//       const loginUrl = new URL('/login', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return res;
// }

// // The config object remains the same.
// export const config = {
//   matcher: [
//     '/((?!api/auth/(?:session|providers)|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

// --- SUMMARY OF CHANGES ---
// - **Switched back to `getToken`:** Humne `auth()` ko `getToken({ req, secret: process.env.AUTH_SECRET })` se replace kar diya hai. `getToken` JWT strategy ke liye banaya gaya hai aur yeh direct cookie se token ko decrypt karta hai.
// - **Updated Logic:** Ab saari protection `token` object ki maujoodgi (presence) par check ho rahi hai, na ke `session` object par. User ka role ab `token?.role` se nikala ja raha hai.
// - **Architectural Alignment:** Yeh change hamare middleware ko hamari final, robust JWT strategy ke sath 100% align karti hai.


// // /src/proxy.ts (THE FINAL, CORRECTED VERSION FOR DATABASE SESSIONS)

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { auth } from '@/app/auth'; // <-- SAB SE AHEM CHANGE: Ab hum 'auth' function import kar rahe hain
// import { ratelimiter } from './app/lib/rate-limiter';
// import { ipAddress } from '@vercel/functions';

// const adminPaths: { [key: string]: string[] } = {
//     '/Bismillah786/products': ['Super Admin', 'Content Editor'],
//     '/Bismillah786/categories': ['Super Admin', 'Content Editor'],
//     '/Bismillah786/orders': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/returns': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/users': ['Super Admin', 'Store Manager'],
//     '/Bismillah786/analytics': ['Super Admin'],
//     '/Bismillah786/settings': ['Super Admin'],
//     '/Bismillah786/admins': ['Super Admin'],
// };

// function setCookie(res: NextResponse, name: string, value: string) {
//   res.cookies.set(name, value, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 });
// }

// export async function proxy(req: NextRequest) {
//   const res = NextResponse.next();
//   const { pathname } = req.nextUrl;
  
//   // --- Marketing Tracker Logic (No changes here) ---
//   const utm_source = req.nextUrl.searchParams.get('utm_source');
//   const utm_medium = req.nextUrl.searchParams.get('utm_medium');
//   const utm_campaign = req.nextUrl.searchParams.get('utm_campaign');

//   if (utm_source) setCookie(res, 'utm_source', utm_source);
//   if (utm_medium) setCookie(res, 'utm_medium', utm_medium);
//   if (utm_campaign) setCookie(res, 'utm_campaign', utm_campaign);

//    // --- API RATE LIMITING (No changes here) ---
//   const sensitivePostRoutes = ['/api/auth/register', '/api/auth/callback/credentials'];
//   if (req.method === 'POST' && sensitivePostRoutes.some(route => pathname.startsWith(route))) {
//     const ip = ipAddress(req) || '127.0.0.1';
    
//     try {
//         const { success } = await ratelimiter.limit(ip);
//         if (!success) {
//           return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
//         }
//     } catch (error) {
//         console.error("Rate limiter error:", error);
//     }
//   }

//   // --- NAYA AUR A-CHA AUTHENTICATION LOGIC ---
//   const session = await auth(); // Yeh ab database se session laayega
//   const userRole = session?.user?.role || 'customer';

//   // Admin Panel Protection
//   if (pathname.startsWith('/Bismillah786')) {
//     if (!session) { // Ab hum 'session' ko check karte hain, 'token' ko nahi
//       const loginUrl = new URL('/login', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//     if (userRole === 'customer') {
//       return NextResponse.redirect(new URL('/access-denied', req.url));
//     }
//     const basePath = Object.keys(adminPaths).find(path => pathname.startsWith(path));
//     if (basePath) {
//         const allowedRoles = adminPaths[basePath];
//         if (!allowedRoles.includes(userRole)) {
//             return NextResponse.redirect(new URL('/Bismillah786?error=permission-denied', req.url));
//         }
//     }
//     return res;
//   }

//   // Customer-Facing Protected Routes
//   const protectedCustomerRoutes = ['/account', '/wishlist', '/checkout'];
//   if (protectedCustomerRoutes.some(route => pathname.startsWith(route))) {
//     if (!session) { // Yahan bhi 'session' check hoga
//       const loginUrl = new URL('/login', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return res;
// }

// export const config = {
//   matcher: [
//     '/((?!api/auth/(?:session|providers)|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

// // --- SUMMARY OF CHANGES ---
// // - **Replaced `getToken` with `auth()`:** This is the most critical change. `getToken` JWT strategy ke liye tha. `auth()` hamari nayi "Database Session" strategy ke liye hai. Yeh ab database se session haasil karega.
// // - **Updated Session Check:** Tamam logic ab `session` object ki maujoodgi par check kar raha hai, na ke `token` par.
// // - **Architectural Alignment:** Is change ke baad, aapka middleware ab aapke `auth.ts` ki nayi configuration ke sath 100% align ho gaya hai.




// /src/proxy.ts (THE FINAL, DEFINITIVE JWT VERSION)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt'; // <-- This uses the JWT strategy
import { ratelimiter } from './app/lib/rate-limiter';
import { ipAddress } from '@vercel/functions';

// --- Role-Based Access Control (RBAC) Configuration (No changes here) ---
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

// Helper function to set marketing cookies (No changes here)
function setCookie(res: NextResponse, name: string, value: string) {
  res.cookies.set(name, value, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 });
}

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  
  // --- Marketing Tracker Logic (No changes here) ---
  const utm_source = req.nextUrl.searchParams.get('utm_source');
  const utm_medium = req.nextUrl.searchParams.get('utm_medium');
  const utm_campaign = req.nextUrl.searchParams.get('utm_campaign');

  if (utm_source) setCookie(res, 'utm_source', utm_source);
  if (utm_medium) setCookie(res, 'utm_medium', utm_medium);
  if (utm_campaign) setCookie(res, 'utm_campaign', utm_campaign);

   // --- API RATE LIMITING (No changes here) ---
  const sensitivePostRoutes = ['/api/auth/register', '/api/auth/callback/credentials'];
  if (req.method === 'POST' && sensitivePostRoutes.some(route => pathname.startsWith(route))) {
    const ip = ipAddress(req) || '127.0.0.1';
    
    try {
        const { success } = await ratelimiter.limit(ip);
        if (!success) {
          return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
        }
    } catch (error) {
        console.error("Rate limiter error:", error);
    }
  }

  // --- AUTHENTICATION & AUTHORIZATION LOGIC (UPDATED FOR JWT) ---
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const userRole = token?.role as string || 'customer';

  // Admin Panel Protection
  if (pathname.startsWith('/Bismillah786')) {
    if (!token) { // Check for the token, not the session object
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
    if (!token) { // Check for the token
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

// --- SUMMARY OF CHANGES ---
// - **Switched back to `getToken`:** We have replaced `auth()` with `getToken({ req, secret: process.env.AUTH_SECRET })`. The `getToken` function is specifically designed for the JWT strategy and reads the user's session directly from the encrypted cookie.
// - **Updated Logic:** All protection logic now correctly checks for the existence of the `token` object. The user's role is accessed via `token?.role`.
// - **Architectural Alignment:** This change makes our middleware 100% aligned with our final, robust JWT strategy, ensuring route protection works correctly on both localhost and Vercel.