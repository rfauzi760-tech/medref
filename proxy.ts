import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { createRateLimiter, getRateLimitScope, isBlockedAgent } from "@/lib/security/request-policy";
import { getApiAuthDecision, getPageAuthDecision } from "@/lib/auth/access-policy";
import { auth, authRuntimeEnabled } from "@/lib/auth";

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
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || isBlockedAgent(userAgent)) {
    return new NextResponse("Akses otomatis tidak diizinkan.", {
      status: 403,
      headers: protectionHeaders,
    });
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

  const pathname = request.nextUrl.pathname;
  const isApi = pathname.startsWith("/api/");
  const needsSession = isApi
    ? !getApiAuthDecision(pathname, false).allowed
    : !getPageAuthDecision(pathname, false).allowed;

  if (needsSession) {
    let authenticated = false;
    if (getSessionCookie(request) && authRuntimeEnabled) {
      try {
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
