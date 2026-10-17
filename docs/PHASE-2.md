# Phase 2 implementation report

Foundation report: Phase 3 now extends these capabilities. See PHASE-3.md for the current advanced features, notification integration, worker operation and validation results.

Status: implemented and locally validated development release. Not production-ready or verified on Hostinger.

## Foundation and architecture

The existing project had a Vite/TypeScript landing page, with no approved backend, database, authentication or permissions implementation. This phase extends that checkout rather than replacing it: an Express backend on Node 24, SQLite using Node's built-in SQLite API, private evidence stored as database BLOBs, and a separately loaded responsive operations frontend. Hostinger plan verification remains deferred at the user's instruction. Node 24 and persistent writable storage are mandatory for this implementation; a static-only plan cannot run it. Do not claim that the target Hostinger plan supports these requirements yet.

The landing page's section markup/layout/CSS is retained. Registration, sign-in and implemented feature controls now open the actual workspace. Its pre-existing original-artwork availability and provisional typography/icon limitations remain unresolved; the supplied images have not been substituted or regenerated.

## Functional capabilities

- Owner registration creates a real company and account. Scrypt password hashes (N=131072, r=8, p=1), opaque hashed 12-hour sessions, HttpOnly/SameSite cookies, CSRF tokens and exact-origin validation protect writes. Production cookies require HTTPS. Password changes revoke all existing sessions, including replacing the current one. Owners can disable members and change dispatcher/technician roles; this revokes those members' sessions.
- Owners and dispatchers create, search, view, edit and archive customers and properties. Multiple properties, contact details, notes, property job history and customer job history persist. Archived records remain visible in historical jobs and cannot be selected for new work.
- The job register has sequential references unique within each company, issue descriptions, categories, urgency, deadlines, internal notes, editable details, status/urgency/search filters and cancellation with a recorded reason. Customer/property linkage is immutable after creation to protect evidence/history; correct a bad linkage by cancelling and creating a new job.
- Scheduling supports individual technicians and teams, local start/end times, rescheduling, unassigned indicators and a dated agenda. Overlapping appointments for the same technician are rejected. A team's current members are copied onto assignments; later access changes do not silently rewrite job history.
- Technicians can view only their assigned jobs and associated customer/property records. They cannot manage customers, schedules, teams, company settings or quotations. Owners and dispatchers handle operations; only owners manage company settings and member access. A solo owner can assign jobs to themself.
- Mobile job cards persist actual arrival/completion, findings, work performed, labour minutes, material quantities/units, additional work and internal notes. Save actions are explicit; unsaved card changes trigger navigation warnings. Version checks reject stale edits while leaving entered form values available for review.
- Uploaded JPEG/PNG/WebP images are decoded, orientation-corrected, resized and re-encoded as JPEG without EXIF/location metadata. General PDF attachments download as attachments. Maximum input is 8 MB/file; total private evidence quota is 250 MB/company. Uploads are throttled per user. Files remain inside the private database and require authentication plus job access for every download; they have no public storage URLs.
- Quotations contain editable labour/material/other lines, quantities, integer-cent prices, fixed-amount discounts, expiry and server-computed totals. Quantities allow three decimal places. Each line is rounded to cents; discount is subtracted before VAT. VAT registration, registration number and rate are configurable, defaulting to not registered. Issued financial/customer/property snapshots are preserved per revision. Editing an issued quote requires a new revision and revokes the former approval link.
- Issuing returns a private link for manual sharing. **No email or SMS is sent.** The link shows the actual issued revision and permits one confirmed acceptance or rejection. The action records the stated name, note and timestamp. This is a bearer-link decision with self-declared identity, not a verified identity or a signature. Expired, already-decided, replaced and closed-job links cannot decide again. Issued revision history retains the prior decisions when a quote is revised.
- Completion requires assignment, actual arrival/completion, findings, work performed, labour/material records or explicit not-applicable reasons, and before/after photos or an explicit evidence not-applicable reason. Completed and cancelled jobs become read-only. PDF reports contain real company/customer/property/job details, technicians, work, materials, timestamps and recorded before/after photos. Internal notes are excluded. Reports explicitly say that no customer signature was captured.
- Dashboard counts, pending unexpired quotations, upcoming visits and completed work are database-derived and permission-scoped. Global search covers accessible jobs, addresses in those jobs, and customers. Times are displayed in Africa/Johannesburg and inputs explicitly use SAST. Currency is ZAR.
- Activity history records important operations with actor and timestamps. Company-scoped composite foreign keys reject invalid customer/property/job/member relationships at database level as well as application level. Optimistic versions protect editable customer, property, job, job-card and quotation records.

## Local setup

Use Node 24.x and npm. No third-party credentials are required to run the current workflow. Copy `.env.example` to `.env` only if that file does not already exist, then choose the exact `APP_ORIGIN` used in the browser. Never store secrets in client-side `VITE_*` values.

```sh
cd /workspace/-MzansiPlumb
npm ci --cache /workspace/.npm-cache
npm run dev:all
```

The frontend runs on port 5173 and proxies `/api` to the backend on port 3001. The default allowed development origin is `http://localhost:5173`; if a browser uses another hostname, configure its exact origin and restart the API. `npm run dev` starts just the frontend; `npm run dev:api` starts just the API with file watching. `npm run preview` is frontend-only and is not a complete application deployment.

Open `/app?mode=signup` to create your own workspace; no demonstration users or default passwords are seeded. Add customers/properties, then create a job. An owner can assign themself or add technicians under Team & assignments. Members receive no invitation email: provide initial credentials securely and have them change their password. Store real customer data only after the production controls below are resolved.

The default database is `var/mzansiplumb.sqlite`. Migrations in `server/migrations` run transactionally at API startup and are recorded in `schema_migrations`. Evidence files are included in the database. Never point automated tests at a real company database.

## Validation

```sh
npm run build
npm run test:api
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
npm audit --cache /workspace/.npm-cache
```

The API suite uses a unique temporary on-disk database per test and removes it afterward. It requires `pdftotext` (Poppler) to verify actual PDF contents. Browser tests run the real backend with a dedicated `var/browser-tests.sqlite` and create isolated test workspaces; they do not use mock API responses or seed the application's normal database. System Chromium is available in the current environment; elsewhere use `npx playwright install chromium` and omit the executable override. Browser tests start ports 3001 and 4173; stop an existing development API on 3001 before running them. Tests cover desktop (1440px), mobile (390px), and small mobile (320px), with en-ZA locale and SAST time zone.

API checks exercise customer/property/job/technician/scheduling/card/material/photo/quotation/approval/completion/report workflows; persistence after server restart and logout/login; cross-company IDs and linked-record attacks; assignment restrictions; session revocation and CSRF/origin rejection; conflicts and stale versions; archive/closed-job rules; actual PDF text and image content; quote maths, decisions, expiry and revisions; uploads; encrypted backup/restore and wrong-key/overwrite rejection. Browser checks exercise the complete owner workflow and actual private-link approval, report download, saved records after login, responsive navigation, accessibility scans and safe rendering of hostile text. Automated accessibility checks cover registration and customer records, not every possible page state.

`npm run check:assets` remains a deliberately failing visual-release check because the approved image files are not available to the build. Behavioral test success is not a visual-fidelity approval.

Final local results: TypeScript/Vite build passed; 11 API test groups passed; 24 browser tests passed; dependency audit found zero known vulnerabilities. The artwork release check failed for the six previously documented missing asset paths. No required functional checks were skipped. These results apply to this development environment, not Hostinger.

## Production and external blockers

- The Hostinger plan, Node 24 availability, persistent disk semantics, native Sharp compatibility, process memory, reverse proxy, HTTPS, quotas, backup scheduling and restore access are unverified. Deployment is not attempted.
- This SQLite design supports a single application instance with persistent local storage. Multi-instance deployment, large contractor load and unbounded register performance have not been validated; lists currently have no pagination. Do not deploy on ephemeral/serverless storage or a network-shared SQLite volume. Database migration to a managed server database would be a separate tested architecture change if the target plan or load requires it.
- Password recovery emails, email verification, MFA and external identity services are not implemented. There is no outbound mail/SMS integration or delivery claim. Do not expose public production registration until account verification/recovery and abuse controls are agreed and implemented. An owner can disable existing non-owner members; owner recovery currently requires an operator procedure that has not been built.
- Customer job-completion signatures are not implemented. Quotation link possession is the approval mechanism; customer identity is not independently verified. No signature is displayed or implied.
- Private evidence access is enforced, but malware scanning of PDF attachments and provider-managed disk encryption remain production setup requirements. PDFs should be opened only after local scanning. Application code cannot prevent an authorized user saving a copy of downloaded evidence.
- No formal penetration test, large-scale load test, provider verification, retention/deletion policy, POPIA operating review or disaster-recovery drill on the target provider has been completed. See SECURITY.md and BACKUP-RECOVERY.md.
- Original artwork and exact landing-page fidelity remain unresolved from the preceding phase.
- **Billing and live payments are disabled.** No payment processor, checkout, payment credentials or charging endpoints are present. Activating them requires explicit user approval.

The core workflow is confirmed locally against persistent data. This is a basis for continued development; production release and any Phase 3 dependency on verified delivery/identity/hosting must wait for the listed prerequisites.
