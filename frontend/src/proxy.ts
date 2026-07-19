import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { jwtVerify } from "jose";

// --- SECURITY: Never fall back to a known/guessable default ---
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-jwt-secret-do-not-use-in-production-32chars!";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://localhost:3001"];

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires these
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://res.cloudinary.com",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

function handleCORS(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    return handleCORS(request, preflight);
  }

  // 1. Rate Limiting for all API routes
  if (pathname.startsWith("/api")) {
    // Use the first IP in X-Forwarded-For chain (actual client IP)
    const rawIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
    const ip = rawIp.replace(/[^0-9a-fA-F.:]/g, "").slice(0, 45); // sanitize IPv4/IPv6

    // Stricter limits on auth endpoints to prevent brute-force
    const isAuthEndpoint = pathname.startsWith("/api/auth");
    const identifier = isAuthEndpoint ? `auth_${ip}` : `api_${ip}`;

    try {
      const { success, limit, remaining, reset } = await checkRateLimit(identifier, isAuthEndpoint);
      if (!success) {
        const rateLimitResponse = new NextResponse(
          JSON.stringify({ error: "Too Many Requests. Please try again later." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
        return addSecurityHeaders(rateLimitResponse);
      }
    } catch (error) {
      // Log but don't block — fail open for rate limiting only
      console.error("[Middleware] Rate limiting error:", (error as Error).message);
    }
  }

  // 2. Authentication & RBAC
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminPageRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminAPIRoute = pathname.startsWith("/api/admin");
  const isProtectedAPIRoute =
    pathname.startsWith("/api/tasks") ||
    pathname.startsWith("/api/documents") ||
    pathname.startsWith("/api/user") ||
    pathname.startsWith("/api/ai");

  const requiresAuth = isDashboardRoute || isAdminPageRoute || isAdminAPIRoute || isProtectedAPIRoute;

  if (requiresAuth) {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      if (isAdminAPIRoute || isProtectedAPIRoute) {
        const unauthResponse = new NextResponse(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
        return addSecurityHeaders(unauthResponse);
      }
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secretKey, {
        audience: "neuroflow-app",
        issuer: "neuroflow-api",
      });

      const role = payload.role as string;
      const status = payload.status as string;

      // Block SUSPENDED users everywhere
      if (status === "SUSPENDED") {
        const response = NextResponse.redirect(new URL("/login?error=suspended", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return addSecurityHeaders(response);
      }

      // RBAC for admin routes
      if ((isAdminPageRoute || isAdminAPIRoute) && role !== "ADMIN" && role !== "SUPER_ADMIN") {
        if (isAdminAPIRoute) {
          const forbiddenResponse = new NextResponse(
            JSON.stringify({ error: "Forbidden: Insufficient permissions" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
          return addSecurityHeaders(forbiddenResponse);
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // PENDING users can only access the pending-verification page
      if (isDashboardRoute && status === "PENDING") {
        return NextResponse.redirect(new URL("/pending-verification", request.url));
      }

    } catch {
      // Token is invalid or expired — clear cookies and redirect
      if (isAdminAPIRoute || isProtectedAPIRoute) {
        const expiredResponse = new NextResponse(
          JSON.stringify({ error: "Token expired or invalid" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
        return addSecurityHeaders(expiredResponse);
      }
      const redirect = NextResponse.redirect(new URL("/login", request.url));
      redirect.cookies.delete("accessToken");
      redirect.cookies.delete("refreshToken");
      return addSecurityHeaders(redirect);
    }
  }

  const next = NextResponse.next();
  addSecurityHeaders(next);
  return handleCORS(request, next);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
