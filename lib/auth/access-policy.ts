const PUBLIC_PAGE_PATHS = new Set(["/", "/login", "/terms", "/privacy"]);

export type AuthDecision = { allowed: true } | { allowed: false; redirectTo: string };

export function normalizeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  if (/%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(value)) return "/";

  try {
    const url = new URL(value, "https://rfsmed.invalid");
    if (url.origin !== "https://rfsmed.invalid" || url.pathname.replace(/\/+$/, "") === "/login") return "/";
    return `${url.pathname}${url.search}`;
  } catch {
    return "/";
  }
}

export function getPageAuthDecision(pathAndSearch: string, authenticated: boolean): AuthDecision {
  const pathname = pathAndSearch.split(/[?#]/, 1)[0] || "/";
  const normalizedPathname = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  if (
    PUBLIC_PAGE_PATHS.has(normalizedPathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    /^\/(?:favicon\.ico|manifest\.webmanifest|robots\.txt|sitemap\.xml|[^/]+\.(?:svg|png|jpe?g|webp|woff2?))$/i.test(pathname)
  ) return { allowed: true };
  if (authenticated) return { allowed: true };

  const next = normalizeReturnTo(pathAndSearch);
  return { allowed: false, redirectTo: `/login?next=${encodeURIComponent(next)}` };
}

export function getApiAuthDecision(pathname: string, authenticated: boolean): { allowed: true } | { allowed: false; status: 401 } {
  if (!pathname.startsWith("/api/") || pathname === "/api/auth" || pathname.startsWith("/api/auth/")) {
    return { allowed: true };
  }
  return authenticated ? { allowed: true } : { allowed: false, status: 401 };
}
