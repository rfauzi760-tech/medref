export const GOOGLE_INSPECTION_EXPIRES_AT = Date.parse("2026-10-02T17:00:00.000Z");

const inspectionAgentPattern = /\bGoogle-InspectionTool(?:\/[\d.]+)?(?=[\s);]|$)/i;
const publicInspectionPaths = new Set([
  "/",
  "/login",
  "/terms",
  "/privacy",
  "/robots.txt",
  "/favicon.ico",
  "/rfsmed-symbol.svg",
  "/icon-192.svg",
  "/icon-512.svg",
]);

export function isGoogleInspectionWindowOpen(now = Date.now()): boolean {
  return now < GOOGLE_INSPECTION_EXPIRES_AT;
}

export function isGoogleInspectionAllowed(
  userAgent: string,
  pathname: string,
  method: string,
  now = Date.now(),
): boolean {
  if (!isGoogleInspectionWindowOpen(now) || !inspectionAgentPattern.test(userAgent)) return false;
  if (method !== "GET" && method !== "HEAD") return false;

  return publicInspectionPaths.has(pathname) || pathname.startsWith("/_next/static/");
}

export function getGoogleInspectionRobotsRules(now = Date.now()) {
  if (!isGoogleInspectionWindowOpen(now)) return [{ userAgent: "*", disallow: "/" }];

  return [
    {
      userAgent: "Google-InspectionTool",
      allow: [
        "/$",
        "/login$",
        "/terms$",
        "/privacy$",
        "/robots.txt$",
        "/favicon.ico$",
        "/rfsmed-symbol.svg$",
        "/icon-192.svg$",
        "/icon-512.svg$",
        "/_next/static/",
      ],
      disallow: "/",
    },
    { userAgent: "*", disallow: "/" },
  ];
}
