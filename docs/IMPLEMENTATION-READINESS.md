# MzansiPlumb implementation readiness

Status: Phase 5 local QA/security work implemented. See PHASE-5-AUDIT.md for current evidence and release gates. Hostinger/provider/asset verification remains incomplete; no production readiness is claimed.

## Confirmed

- The initial checkout contains only README.md, with no existing framework, database, or application.
- The supplied landing-page screenshot is the approved visual reference. Preserve its order: navigation and hero, challenge, solution, South African business benefits, FAQ, footer. Do not add sections or substitute imagery.
- Use the supplied transparent MzansiPlumb logo throughout, including application branding. Original downloadable assets are needed; a chat rendering is not a source asset bundle.
- Billing and live payment processing must remain disabled. Gated provider adapters are implemented; do not configure live checkout/charges or activate billing without explicit activation approval.

## Architecture gate

The user has deferred deployment details and authorized frontend construction now. A Vite/TypeScript frontend and Node 24/SQLite development backend are implemented. Validate this architecture against the intended Hostinger account, plan and website/domain before deployment. Hostinger account tools are not available in the current session. Attempting connector registration failed because the managed Codex configuration filesystem is read-only. No account resources were changed.

Obtain non-secret hosting facts from a connected Hostinger account or hPanel:

- Hosting product and plan: managed web hosting, managed Node.js application hosting, or VPS.
- Supported runtime and versions; build commands, process lifecycle, port binding and reverse proxy behavior.
- Database engine/version, connection method, connection limits, and migration access.
- Private persistent file storage paths, quotas, upload limits, and whether redeployment preserves files.
- SSH/CLI access, scheduled jobs, background worker support, transactional email options, TLS, domain routing, backups and restoration.
- Separate staging and production configuration and release/rollback capabilities.

Do not infer VPS capabilities from a shared-hosting plan or assume Node.js, PostgreSQL, Redis, object storage, or background workers are available. Do not purchase services. Never place secrets in this document or chat; use secure environment settings.

## Required functional acceptance

Implement company workspaces with server-enforced tenant isolation and role permissions. Support solo operators with simple defaults, and branches/team assignments when needed. Persist customers, properties, jobs, technician schedules, quotations with ZAR amounts and configurable tax handling, completion evidence, service reports, follow-ups, materials and operational reporting. Reports must calculate from actual records; integrations must use real configured services or remain explicitly unavailable.

Authentication must include secure password hashing, session rotation/revocation, CSRF protection, login throttling, recovery and invitation expiry. Enforce authorization on every record and evidence download. Validate inputs on the server, use parameterized database operations and transactions, constrain uploads, avoid public evidence storage, and record auditable sensitive operations. Never log secrets or unnecessary personal data.

## Verification and release requirements

- Versioned migrations; fresh-install and upgrade tests.
- Automated authentication, role and cross-tenant access tests, including guessed record identifiers and private attachment downloads.
- End-to-end customer/property/job/assignment/quotation/completion/report/follow-up flows against persistent data.
- Mobile and desktop visual comparisons against the approved design; accessible keyboard navigation and working links/CTAs.
- Dependency and security review, production configuration validation, error handling and health checks.
- Tested encrypted backup and restore procedure covering database and evidence files, with documented retention and recovery objectives.
- Target-specific Hostinger deployment, environment-variable, migration, startup, scheduled-job, backup, rollback and recovery instructions.
- Staging validation on the confirmed Hostinger environment before any production-readiness claim.

## Source assets still required

The user has already supplied the transparent logo and approved design in chat; do not request them again. Resolve their availability to the execution environment for the hero, challenge, phone, property/van, water and tap imagery, icons and font information. The chat shows the visual reference but the checkout and available shared download directories do not contain those assets. Do not replace these with generated or stock alternatives.

Phase 4 update: see PHASE-4.md for seven-role/branch authorization, internal approvals, branding, South African formatting/VAT, privacy/export/deletion, limits and default-off payment adapters. Local checks pass (32 API groups, 33 browser tests, build, dependency audits). The asset release check remains failed. Actual South African merchant eligibility, accessible current provider specs and real sandbox/live checkout/webhooks are unverified because official documentation domains were denied by the environment proxy. Hostinger plan verification, formal security/load/recovery assessment and the previously documented release prerequisites remain open; do not label this application production ready or compliant.
