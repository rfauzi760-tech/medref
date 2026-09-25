# RFSmed Admin Users Dashboard

## Goal

Provide the owner with a private, read-only view of registered RFSmed accounts. Only the authenticated account whose normalized email exactly matches `rfauzi760@gmail.com` may access it.

## Recommended design

- Add `/admin/users` as a server-rendered, non-public page using the existing Better Auth session and Cloudflare D1 binding.
- Enforce authorization on the server for every page/data request. Compare the session user's normalized email to a server-only admin allowlist; unauthenticated users go to login and other accounts receive a forbidden response.
- Show only account name, email, email-verification status, creation date, and linked sign-in provider names. Include search and pagination, with a clear empty/error state.
- Query only the `user` fields above and `account.providerId`. Never read or return password hashes, OAuth tokens, session tokens, raw session records, or verification tokens.
- Keep the dashboard read-only. No account deletion, role changes, exports, or other admin actions are in scope.
- If the admin allowlist is not configured in a deployment, deny access by default.

## Alternatives considered

1. Use Cloudflare D1 Console and a manual query. Fastest, but inconvenient for routine checks and easy to expose sensitive columns accidentally.
2. Build a server-protected, read-only dashboard (recommended). Convenient while keeping the database and authorization checks server-side.
3. Add a full admin-role system/plugin. More flexible for future staff, but unnecessary for one owner and increases auth complexity.

## Verification

- Confirm unauthenticated requests cannot read the account list.
- Confirm a signed-in account with a different email receives 403.
- Confirm the exact owner email can view the page and pagination/search return only allowlisted fields.
- Run targeted tests and the production build; do not test by listing production users or displaying credential data.

## Rollout note

Configure the exact admin email as a server-side deployment variable for the RFSmed deployment. Missing configuration must fail closed. The dashboard does not require a database migration.
