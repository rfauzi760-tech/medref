# RFSmed Admin Users Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Status (reconciled 2026-09-26):** Implemented and committed in `3699f7e feat: add owner-only admin user dashboard`. This document now reflects the as-built behavior. The checkboxes record what actually shipped; Task 3 Step 1 was never implemented and is called out below.

**Goal:** Add a private, read-only `/admin/users` view accessible only to a verified `rfauzi760@gmail.com` session, and show the existing RFSmed symbol on the login page.

**Architecture:** Keep authorization and D1 queries server-side. Use a fail-closed `RFS_ADMIN_EMAIL` Worker variable, verify Better Auth session and email, query only a fixed allowlist of user/provider fields, and render the results in a dynamic server page. Reuse `public/rfsmed-symbol.svg` in the existing client login form.

**Tech Stack:** Next.js 16.3.4 App Router, React 19, Better Auth 1.7.6, Cloudflare Workers/D1, Tailwind CSS 4, Vitest 5.

## Global Constraints

- Only a verified session whose normalized email exactly matches `RFS_ADMIN_EMAIL` can see user data.
- Missing admin configuration denies access.
- Never return passwords, OAuth tokens, session tokens, verification tokens, or raw session/account records.
- Keep the page read-only; no delete, role editing, export, or other account actions.
- Preserve the login form's existing light/dark appearance and responsive layout.
- Before writing Next.js code, read the relevant installed Next.js App Router guides in `node_modules/next/dist/docs/` as required by `AGENTS.md`.

---

### Task 1: Add and test a fail-closed admin identity policy

**Files:**
- Create: `lib/auth/admin-policy.ts`
- Test: `tests/auth-admin.test.ts`

**Interfaces:**
- Produce `isAuthorizedAdmin(user, configuredEmail): boolean`, accepting a session user with `email` and `emailVerified` fields.
- Normalize email by trimming and lowercasing; require `emailVerified === true`; return false for missing configuration or missing user.

- [x] **Step 1: Write failing tests** for exact verified email allow, case/whitespace normalization, unverified user denial, mismatched email denial, and empty config denial:

```ts
expect(isAuthorizedAdmin({ email: " RfAuZi760@gmail.com ", emailVerified: true }, "rfauzi760@gmail.com")).toBe(true);
expect(isAuthorizedAdmin({ email: "rfauzi760@gmail.com", emailVerified: false }, "rfauzi760@gmail.com")).toBe(false);
expect(isAuthorizedAdmin({ email: "other@example.com", emailVerified: true }, "rfauzi760@gmail.com")).toBe(false);
expect(isAuthorizedAdmin({ email: "rfauzi760@gmail.com", emailVerified: true }, " ")).toBe(false);
expect(isAuthorizedAdmin(null, "rfauzi760@gmail.com")).toBe(false);
```

- [x] **Step 2: Run** `npm test -- --reporter=verbose tests/auth-admin.test.ts`; confirm the policy module is missing.
- [x] **Step 3: Implement** the pure policy function in `lib/auth/admin-policy.ts` (as built, normalizing once through `allowedEmail`):

```ts
export function isAuthorizedAdmin(
  user: { email: string; emailVerified: boolean } | null | undefined,
  configuredEmail: string | undefined,
): boolean {
  const allowedEmail = configuredEmail?.trim().toLowerCase();
  return Boolean(
    user?.emailVerified === true &&
    allowedEmail &&
    user.email.trim().toLowerCase() === allowedEmail,
  );
}
```

- [x] **Step 4: Run** `npm test -- --reporter=verbose tests/auth-admin.test.ts`; expect all five cases to pass.

### Task 2: Add a scoped D1 account-list query

**Files:**
- Create: `lib/auth/admin-users.ts`
- Test: `tests/auth-admin.test.ts`

**Interfaces:**
- Produce `listAdminUsers(db, { query, page, pageSize })`, returning a typed list and total count.
- Select only `name`, `email`, `emailVerified`, `createdAt`, and distinct `account.providerId` values.
- Run a separate `COUNT(*)` over the same filter to derive `total`, then clamp `page` to the real page count so out-of-range pages resolve to the last page.
- Cap the search string at 100 characters and `pageSize` at 100; normalize `page`/`pageSize` to positive integers (`pageSize` defaults to 50).

- [x] **Step 1: Add failing tests** with a mock D1 `prepare/bind/all/first` interface for blank search, search filtering, page bounds, and provider aggregation. Assert the SQL does not contain `password`, `accessToken`, `refreshToken`, `idToken`, or `session`.
- [x] **Step 2: Run** `npm test -- --reporter=verbose tests/auth-admin.test.ts`; confirm list behavior is not implemented.
- [x] **Step 3: Implement** parameterized D1 queries using `instr(lower(...), lower(?))` for literal substring search, cap the search string at 100 characters and `pageSize` at 100, and never select credential/token columns. Two statements run against a shared filter, using these query shapes:

```sql
SELECT COUNT(*) AS total
FROM user AS u
WHERE (? = '' OR instr(lower(u.email), lower(?)) > 0 OR instr(lower(u.name), lower(?)) > 0);
```

```sql
SELECT u.name, u.email, u.emailVerified, u.createdAt,
       GROUP_CONCAT(DISTINCT a.providerId) AS providers
FROM user AS u LEFT JOIN account AS a ON a.userId = u.id
WHERE (? = '' OR instr(lower(u.email), lower(?)) > 0 OR instr(lower(u.name), lower(?)) > 0)
GROUP BY u.id ORDER BY u.createdAt DESC LIMIT ? OFFSET ?;
```

- [x] **Step 4: Run** the targeted test file; expect all query cases to pass.

### Task 3: Add server-guarded `/admin/users`

**Files:**
- Create: `app/admin/users/page.tsx`
- Create: `app/admin/page.tsx`
- Modify: `lib/auth/options.ts`
- Modify: `wrangler.jsonc`
- Test: `tests/auth-admin.test.ts`, `tests/auth-access.test.ts`

**Interfaces:**
- Read `RFS_ADMIN_EMAIL` and `AUTH_DB` from the Cloudflare Worker environment.
- The page uses Better Auth's server session, `isAuthorizedAdmin`, and `listAdminUsers`; it must be dynamic (`export const dynamic = "force-dynamic"`, `export const revalidate = 0`) and never statically prerendered.
- `app/admin/page.tsx` redirects `/admin` to `/admin/users`.
- Regenerate `worker-configuration.d.ts` with `npx wrangler types` after adding `RFS_ADMIN_EMAIL` to `wrangler.jsonc`; do not hand-edit generated types.

- [ ] **Step 1: Add a failing access test** proving a missing session, non-admin email, or unverified owner cannot receive the account list.

  > **Not implemented.** No dedicated `/admin/users` access test exists. The page's runtime guarantees (missing session → redirect, missing config/non-admin → `notFound()`) are currently exercised only indirectly by `tests/auth-access.test.ts`, which covers the `proxy.ts` session gate but not the admin-email branch. Leave this unchecked; adding it is tracked as a follow-up.

- [x] **Step 2: Implement** the dynamic server page: call `auth.api.getSession({ headers: await headers() })`; redirect anonymous users to `/login?next=%2Fadmin%2Fusers`; respond with 404 via `notFound()` for non-admins (never a 403 page, so the route stays undiscoverable); only then query D1 and render a read-only table with name, email, verification, registration date, and provider labels. Add URL-driven search and previous/next pagination.
- [x] **Step 2a: Configure** `RFS_ADMIN_EMAIL` as `"rfauzi760@gmail.com"` in `wrangler.jsonc` vars and add optional `RFS_ADMIN_EMAIL?: string` to `AuthRuntimeEnvironment` in `lib/auth/options.ts`. This is a non-secret server setting; it is read only from `cloudflare:workers` and never passed to client components.
- [x] **Step 2b: Regenerate** Worker bindings with `npx wrangler types`, updating the generated declaration instead of editing it manually.
- [x] **Step 3: Ensure** no route returns the list without checking the verified owner session; avoid a client-side-only visibility gate.
- [x] **Step 4: Run** `npm test -- --reporter=verbose tests/auth-admin.test.ts tests/auth-access.test.ts`; expect all tests to pass.

### Task 4: Add the existing symbol to the login header

**Files:**
- Modify: `components/auth/login-form.tsx`
- Test: `tests/frontend-contract.test.ts`

- [x] **Step 1: Add a failing UI contract** requiring the login form to render `/rfsmed-symbol.svg` with `alt="RFSmed"`.
- [x] **Step 2: Implement** a small accessible image and RFSmed wordmark in the login header, retaining current form actions, theme tokens, and mobile layout:

```tsx
<Image src="/rfsmed-symbol.svg" alt="RFSmed" width={36} height={36} priority className="h-9 w-9" />
```

- [x] **Step 3: Run** `npm test -- --reporter=verbose tests/frontend-contract.test.ts`; expect the login-branding assertion to pass.

### Task 5: Verify before rollout

**Files:**
- No additional files.

- [x] Run `npm test` and `npm run build` (277 tests pass across 36 files; `vinext build` completes).
- [x] Inspect `git diff --check` and the changed files for secret or credential fields.
- [ ] Confirm the Cloudflare deployment has the plain-text server variable `RFS_ADMIN_EMAIL=rfauzi760@gmail.com`; leave access denied if it is absent. (Value is present in `wrangler.jsonc`; deploy-time confirmation still pending.)
- [x] No production account rows inspected and no real user credentials used.
- [x] No deploy or push performed.

## Self-review

- Spec coverage: owner-only authorization, verified email, D1 read-only list, allowlisted fields, search/pagination, denied-by-default config, login symbol, and verification are assigned to Tasks 1–5.
- As-built notes: non-admins receive a 404 (`notFound()`) rather than 403; the login header uses `public/rfsmed-symbol.svg`; `listAdminUsers` adds a `COUNT(*)` and clamps `page`; `app/admin/page.tsx` redirects `/admin` to `/admin/users`.
- Known gap: Task 3 Step 1 (a dedicated `/admin/users` access test) is not implemented and remains open.
- Placeholder scan: no TODO/TBD steps; every test/build command is named.
- Type consistency: `isAuthorizedAdmin` is shared by the page and access tests; `listAdminUsers` accepts a D1 binding and bounded pagination options.
