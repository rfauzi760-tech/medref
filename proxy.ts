import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { createRateLimiter, getRateLimitScope, isBlockedAgent } from "@/lib/security/request-policy";
import { isGoogleInspectionAllowed } from "@/lib/security/google-inspection";
import { getApiAuthDecision, getPageAuthDecision } from "@/lib/auth/access-policy";

const imageLimiter = createRateLimiter({ limit: 1_200, windowMs: 60_000 });

const protectionHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
};

function clientKey(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || null;
}

export async function proxy(request: NextRequest) {
  // Vinext renders static HTML in a local Node process. Do not apply runtime
  // session redirects or crawler policy to those build-only requests.
  if (process.env.VINEXT_PRERENDER === "1") return NextResponse.next();

  const userAgent = request.headers.get("user-agent") ?? "";
  const pathname = request.nextUrl.pathname;
  const inspectionAllowed = isGoogleInspectionAllowed(userAgent, pathname, request.method);
  if (!userAgent || (isBlockedAgent(userAgent) && !inspectionAllowed)) {
    return new NextResponse("Akses otomatis tidak diizinkan.", {
      status: 403,
      headers: protectionHeaders,
    });
  }

  // Keep Better Auth endpoints in the Worker even with a static asset build.
  // Vinext's deployed catch-all route can otherwise return a platform 404 for
  // nested paths such as /api/auth/sign-in/email and OAuth callbacks.
  if ((pathname === "/api/auth" || pathname.startsWith("/api/auth/")) && pathname !== "/api/auth/providers") {
    try {
      const { auth, authRuntimeEnabled } = await import("@/lib/auth");
      if (!authRuntimeEnabled) {
        return Response.json({ message: "Layanan sesi belum dikonfigurasi." }, { status: 503 });
      }
      // Vinext's proxy URL is an internal URL in production. Rebuild the
      // request against Better Auth's canonical base while preserving method,
      // headers, query, and body from the incoming request.
      const authContext = await auth.$context;
      const authUrl = new URL(`${pathname}${request.nextUrl.search}`, authContext.baseURL);
      return auth.handler(new Request(authUrl, request));
    } catch {
      return Response.json({ message: "Layanan sesi sedang tidak tersedia." }, { status: 503 });
    }
  }

  const key = clientKey(request);
  const rate = key && getRateLimitScope(request.nextUrl.pathname) === "ecg-image"
    ? imageLimiter.consume(key)
    : null;
  if (rate && !rate.allowed) {
    return new NextResponse("Terlalu banyak permintaan. Coba lagi nanti.", {
      status: 429,
      headers: {
        ...protectionHeaders,
        "Retry-After": String(Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1_000))),
        "RateLimit-Limit": String(rate.limit),
        "RateLimit-Remaining": "0",
        "RateLimit-Reset": String(Math.ceil(rate.resetAt / 1_000)),
      },
    });
  }

  const isApi = pathname.startsWith("/api/");
  const needsSession = isApi
    ? !getApiAuthDecision(pathname, false).allowed
    : !getPageAuthDecision(pathname, false).allowed;

  if (needsSession) {
    let authenticated = false;
    if (getSessionCookie(request)) {
      try {
        const { auth, authRuntimeEnabled } = await import("@/lib/auth");
        if (!authRuntimeEnabled) throw new Error("Auth runtime is not configured");
        authenticated = Boolean(await auth.api.getSession({ headers: request.headers }));
      } catch {
        return new NextResponse("Layanan sesi sedang tidak tersedia. Coba lagi nanti.", {
          status: 503,
          headers: protectionHeaders,
        });
      }
    }

    if (isApi) {
      const decision = getApiAuthDecision(pathname, authenticated);
      if (!decision.allowed) {
        return NextResponse.json({ error: "Sesi login diperlukan." }, { status: decision.status, headers: protectionHeaders });
      }
    } else {
      const decision = getPageAuthDecision(`${pathname}${request.nextUrl.search}`, authenticated);
      if (!decision.allowed) return NextResponse.redirect(new URL(decision.redirectTo, request.url));
    }
  }

  const response = NextResponse.next();
  for (const [name, value] of Object.entries(protectionHeaders)) response.headers.set(name, value);
  if (rate) {
    response.headers.set("RateLimit-Limit", String(rate.limit));
    response.headers.set("RateLimit-Remaining", String(rate.remaining));
    response.headers.set("RateLimit-Reset", String(Math.ceil(rate.resetAt / 1_000)));
  }
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
