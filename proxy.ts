import { NextResponse, type NextRequest } from "next/server";
import { createRateLimiter, getRateLimitScope, isBlockedAgent } from "@/lib/security/request-policy";

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

export function proxy(request: NextRequest) {
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
