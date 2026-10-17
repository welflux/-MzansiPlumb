# Security review — development release

This is an implementation review and automated regression coverage, not a penetration-test certification or production approval.

## Controls reviewed

- Database and application company scoping, composite foreign keys, technician assignment checks, ownership-only account/company administration and protected report/file downloads.
- Parameterized SQL; strict request schemas that reject extra tenant/role fields; bounded text, quantities, amounts, uploads and JSON bodies; escaped HTML output for every record field; no HTML rendering of customer notes.
- Scrypt password hashing with per-password salts (N=131072/r=8/p=1, 128 MiB per hashing operation), hashed random session tokens, 12-hour absolute expiry, session revocation on password/access changes, HttpOnly/SameSite cookies, secure cookies in production, no tokens in localStorage.
- Exact allowed Origin checks on all write endpoints, including registration, login and public quote decisions. Authenticated writes additionally require the session's CSRF token. CORS is not enabled.
- Helmet response headers and production content-security policy; no-store API responses and private-link no-referrer policy. Credentials and bodies are not logged by application request handlers. Service reports omit internal dispatcher/technician notes.
- Global request limits, stricter auth/approval limits and per-user upload limits. Error responses omit database errors and stack traces. Image decoding rejects disguised/non-supported uploads and strips metadata. PDFs force attachment download; no inline SVG/HTML uploads are accepted.
- Immutable issued quote content with separately recorded one-time decisions; stale-edit version checks; closed work records protected against further changes; unique sequential references per company.
- AES-256-GCM encrypted backups with separate key, integrity/foreign-key checks on restore, restored session revocation and overwrite refusal.

## Required before public production

1. Confirm Hostinger capabilities and a single-process persistent-disk deployment; HTTPS end-to-end and appropriate disk encryption are required. Keep the database and all backups outside public web roots. Restrict files/directories to the service account. Remove test databases from release snapshots.
2. Configure exact APP_ORIGIN, secure environment secrets, trusted reverse-proxy behavior and memory/concurrency sizing. The application currently does not trust forwarded IPs. Behind a reverse proxy, per-IP limits will be shared at that proxy's IP; explicitly configure and test trusted proxy boundaries before adjusting this. Never blindly trust client-supplied forwarding headers.
3. Configure and live-validate the implemented email verification and account recovery and the required authentication policy (including MFA if required). Current rate limits are process-local and reset on restart; they are not a distributed abuse-prevention service. Scrypt hashing consumes significant memory, so impose ingress concurrency limits before public registration.
4. Agree a POPIA data-processing, retention, export and deletion procedure, backup retention and employee-access review. Company administrators should only add authorized personnel. Activity records are application history, not externally tamper-proof audit storage.
5. Decide whether private-link self-declared quotation acceptance meets the business/legal requirement. Treat links as bearer credentials, share only with intended recipients, redact /approve tokens in proxy logs and analytics, and use no third-party tracking on approval pages. Quotation acceptance is not completion sign-off or a digital signature.
6. PDF uploads now require a successful configured ClamAV scan and otherwise fail closed; verify scanner deployment/signature freshness and review historic PDFs; verify upload limits at the proxy. Validate ZAR/VAT configuration with the business's tax adviser. Submitted quantities/prices are validated, but VAT status is company-controlled.
7. Run dependency review, penetration testing, a target-host recovery drill, access-control regression and load tests. Revisit unpaginated lists, PDF/image memory usage and storage quotas for large businesses. Do not run multiple processes against ephemeral/shared network storage.

No external services or payment flows are claimed configured. All remaining controls are deployment blockers or separately scoped product work; none should be represented as already verified.

## Phase 3 review additions

General API limits now key authenticated traffic by a database-verified active user/session; anonymous or forged-cookie traffic stays in its normalized IP bucket. Auth/approval endpoints retain their stricter IP limit. Rate limits remain process-local. The regression test exhausts a user's bucket, verifies a second legitimate user is unaffected, and verifies rotating forged cookies cannot evade the anonymous limit.

Advanced dispatch, inventory, financial, notification and company-audit routes enforce company scope and manager/owner roles. Technicians can select stock without seeing unit costs and may apply usage only through an assigned job card. Usage and its ledger movements commit atomically with the card. Template checklist IDs must come from the job snapshot. Completion snapshots verify private evidence hashes; they are not externally signed. Revenue is entered/reversed manually and cannot imply a payment or fake invoice.

The optional Resend webhook is intentionally mounted outside cookie/Origin authentication and instead requires a signed raw-body Svix payload with timestamp/replay controls. No other write endpoint is exempted. Provider IDs/events and delivery attempts are persisted; delivery cannot be asserted from an HTTP acceptance alone. Provider credentials live only in the server environment. Email is disabled by default, must be explicitly enabled by an owner and is disabled again on backup restore. Live sender authorization, egress, webhook reachability, privacy agreements and mail-delivery testing remain production prerequisites. See PHASE-3.md for operating limits and setup.

## Phase 4 review additions

Phase 4 supersedes the earlier two-role manager guards with central permissions and effective roles plus branch/job scope. Owner-only billing/deletion/hold actions cannot be delegated to administrators. Read-only management cannot mutate records. Payment webhooks join the explicitly exempted Resend webhook; each uses provider authentication rather than browser cookies. PayFast hosted form destinations are allowlisted in production CSP. No billing is activated. See PHASE-4.md for implementation, test evidence and unresolved provider verification. Review paid-recovery operations and provider-event log retention before release.

## Phase 5 audit

See PHASE-5-AUDIT.md for the current review, fixes and test coverage. Account recovery/email verification, durable account-email delivery, production verification gating, capped hashing, WAL startup retry, cross-branch write restrictions and fail-closed PDF scanning are implemented. They do not establish live external email/scanner/provider readiness. Production origin is validated before database startup; proxy trust remains opt-in and must match the actual network topology. Migration 006 and restore challenge revocation must be included in every release/recovery drill. No independent penetration/load/compliance certification is claimed.
