# Phase 5 production-readiness audit

Status: local functional/security regression passed; **NOT production ready**. This is a source/behavior audit with automated tests, not an independent penetration test, compliance certification or verification of a Hostinger account. No deployment, live email, checkout, charge or provider cancellation occurred. Billing activation remains disabled.

## Completed functionality and fixes

The application retains persistent tenant workspaces; seven staff roles and branch/job scope; customers/properties/jobs; team assignment and overlap checks; job cards, normalized image evidence and private reports; revisioned quotations and private customer decisions; internal version-bound approvals; stock/costing/manual revenue; maintenance and durable reminders; document branding/ZAR/VAT; privacy export/deletion; server-enforced quotas and gated payment adapters. Production has no seed/demo accounts, simulated paid upgrades or test-only API routes. Tests inject provider transports only inside tests; production adapters require real credentials and verified provider responses.

Phase 5 fixes/additions:

- Added password recovery and email verification with 256-bit random single-use links, hashed challenge tokens, 30-minute reset/24-hour verification expiry, strict schemas, cooldown/per-user request caps and IP limits. Password reset revokes all sessions and outstanding challenges. Password/member-access changes invalidate outstanding recovery links. Production blocks unverified operational writes by default. Recovery/verification remain accessible independently of paid plan expiry.
- Added an independently encrypted account-email queue with durable claims, bounded exponential retries, idempotency keys, real Resend API integration and signed delivery-event reconciliation. Provider acceptance, confirmed delivery, failures and suppression remain distinct. Raw link payloads are cleared after acceptance/final suppression. Responses never return tokens or enumerate account existence, and never claim a message was sent. Email stays disabled without explicit service configuration. Actual sender/public webhook delivery is unverified.
- Restore now invalidates every outstanding recovery/verification challenge and suppresses queued account mail, in addition to revoking sessions, disabling reminders and suspending provider-backed subscriptions. Encrypted queue payloads are excluded from company exports.
- Closed cross-branch writes: visibility of a customer via an accessible job no longer grants editing of the customer or its home-branch properties. New maintenance contracts require home-branch access. Recurring generation skips inactive branches.
- Closed an unpaid-subscription entitlement defect: initial PayPal payment failure cannot grant a paid grace period without a previous stored provider receipt. Actual paid renewal failures retain the bounded grace behavior. Browser return URLs still cannot grant access. Health no longer hardcodes a disabled payment status when actual activation configuration differs.
- PDF attachment uploads now fail closed unless a real configured ClamAV scan succeeds. Infection rejects the upload; scanner failure stores nothing. Supported images are still decoded/normalized with metadata removed. There is no scanner bypass or always-clean production stub. ClamAV installation/signature freshness and actual host scanning remain manual verification requirements. Existing PDF download rights remain enforced; historic unscanned PDFs require operator review/quarantine before release.
- Bounded concurrent scrypt operations to two per process to constrain memory use; excess authentication returns a retryable error. Reused the dummy unknown-account hash without creating background hash bursts on repeated app initialization.
- Fixed a reproducible concurrent-first-start SQLite WAL negotiation failure with bounded BUSY/LOCKED retries. Migration locking, integrity and foreign-key checks remain intact.
- Added explicit 413 handling for oversized JSON, canonical APP_ORIGIN validation, opt-in exact trusted proxy CIDRs, browser request timeouts, recovery UI/error states, liveness/readiness endpoints, migration/preflight commands, ESLint and deployment templates. Slow responses and temporary failures preserve honest loading/error states and recover against real stored data.

## Verification and scope

Commands: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:api`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test`, `npm audit`, `npm run check:assets`, `npm run preflight`.

API coverage includes normal registration/login/logout, company/job/file isolation, CSRF/Origin/password policy/session revocation, all seven roles over 18 sensitive operations (126 role/operation cases), customer-to-report workflows, quote maths/revisions/decisions/expiry, assignment conflicts, image privacy, archived/closed/stale records, stock reconciliation/shortages, costing/revenue/reversals, internal two-person approvals and content changes, quotas including background generation, maintenance calendar/deduplication, durable notification leases/retries/signed callbacks/failure bounds, encrypted backup/restore/export, deletion cooling/holds/actual erasure, reset expiry/replay/no-enumeration, email verification gates, provider acceptance versus delivery, fail-closed PDF uploads and oversized body errors. Payment tests cover default-off gating, PayFast signature/merchant/amount validation and deduplication, PayPal verified authoritative status, unpaid initial failure, actual paid renewal grace, cancellation and expiry. External providers are controlled fixtures in tests, not real merchant verification.

Browser coverage runs at 1440px desktop, 390px mobile and 320px small mobile with real local APIs/databases. It covers landing section/navigation/FAQ behavior, authentication/accessibility, core customer-to-report workflows, stock/templates/costing/revenue/maintenance/reminders, organization/branding/privacy/subscription persistence, password-recovery forms, invalid links, slowed API responses, loading and transient-error recovery. Browser tests clear email/payment activation settings and keep test data in a separate ignored database. Existing accessibility tests use Axe; no claim of an exhaustive WCAG certification is made. Browser checks cannot establish visual fidelity while the original assets are absent from the build.

The first slow-network test failed because its interception pattern omitted query strings; the test was corrected to intercept the actual endpoint, then all cases passed. The concurrent migration suite exposed the WAL startup race described above; it was fixed and passed on rerun. These were not hidden by skipping tests or reducing assertions.

## Unresolved launch gates

| Gate | Current evidence / required action |
| --- | --- |
| Confirmed Hostinger target | No plan/domain/resource has been supplied. Verify Node 24, native Sharp, persistent local SQLite WAL storage, memory, process lifecycle, proxy/TLS and backups on the selected actual plan. No account deployment/DNS changes occurred. |
| Original visual assets | Asset check still fails for the approved logo and five artwork files under public/. The supplied chat references remain authoritative; no replacement art or redesign was introduced. Exact visual release remains blocked. |
| Real account email/recovery | Configure independent AUTH_LINK_KEY, RESEND_API_KEY, verified NOTIFICATION_FROM and RESEND_WEBHOOK_SECRET; enable AUTH_EMAIL_ENABLED after review; verify an actual staged receive/consume/callback round trip. Never enter credentials in chat. |
| Payment merchant/provider verification | Official documentation domains are denied by the running environment proxy. SA merchant/recurring/card/currency availability and real provider round trips remain unverified. Follow PHASE-4.md, review/publish the saved network draft if needed, complete sandbox/provider verification, and obtain explicit user approval before any billing activation. |
| Deployment persistence/recovery | Perform actual managed restart and redeployment persistence tests, HTTPS staging workflow and off-machine encrypted backup/restore drill. Local tests are not proof of Hostinger storage persistence. |
| PDF scanner | Upload is disabled until configured. If enabling, install/maintain real ClamAV/current definitions, verify scanner permissions/timeout/rejection and review any historic unscanned PDFs. |
| Production security/operations | Review trusted proxies, ingress limits, resource sizing, disk encryption, secret rotation, rate-limit restart behavior, monitoring/alerts, independent penetration/load testing, account/MFA policy and vendor/privacy/retention/deletion procedures. |
| Scale | Single-node SQLite; multi-instance/shared-network filesystem deployment and large-company performance are unverified. Several lists are bounded/unpaginated, backups/PDF/image work use memory, and rate limits are process-local. No offline synchronization or universal network resilience is claimed. |

`preflight` deliberately fails in this development environment for missing production mode/origin/absolute data path, email settings/verification policy, backup key and original assets. It never fabricates passing external checks. A future passing preflight is necessary but insufficient: it cannot verify merchant eligibility, email delivery, volume persistence or legal/security acceptance.

## Launch steps

Use the exact ordered procedure in HOSTINGER-DEPLOYMENT.md (Phase 5): confirm the target, build/test the release, provision private persistent storage, configure secrets/production origin and verification, keep billing disabled, apply migrations after backup, start the supervised app/worker behind verified HTTPS/proxy rules, pass preflight, perform actual staging delivery/persistence/recovery drills, close the gates above, then review and authorize promotion. VPS service/proxy examples in deploy/ are uninstalled templates with explicit resource placeholders. There is no claim that an unknown Hostinger plan supports them.

## Final local evidence — 2026-10-17

- API: **40/40 groups passed**, including the independent 126-case sensitive-role matrix and production-default verification enforcement.
- Browser: **39/39 checks passed** across desktop/mobile/small-mobile projects. Frontend source was unchanged after that completed run; subsequent backend security changes passed the full API suite.
- Clean `npm ci --cache /workspace/.npm-cache`, ESLint (no warnings/errors), explicit TypeScript check, production build, full dependency audit (zero known vulnerabilities) and tracked diff whitespace check passed.
- `check:assets` remains failed for six original build assets; `preflight` remains blocked on seven production prerequisites in this development environment. Neither failure was skipped or described as a pass.
- Restarted development services: liveness/readiness/workspace HTML returned 200; worker current; all six migrations applied; SQLite integrity `ok`; no foreign-key errors; ordinary database has zero seeded users.
- Updated cloud install/start instructions are saved in a reviewable draft. Saving did not publish the environment, apply pending network policy or deploy to Hostinger.
