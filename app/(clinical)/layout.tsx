/**
 * Route group for login-gated clinical modules.
 *
 * These pages must never be prerendered. Cloudflare serves prerendered HTML
 * straight from the static asset CDN, which bypasses the session gate in
 * `proxy.ts` entirely. Forcing this group dynamic means every request for a
 * clinical module reaches the Worker and is authorized, while the public pages
 * outside this group stay static and free of Worker invocations.
 */
export const dynamic = "force-dynamic";

export default function ClinicalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
