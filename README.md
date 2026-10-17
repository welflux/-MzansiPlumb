# -MzansiPlumb
South African Plumbing Operations Management — a professional platform that helps plumbing businesses of all sizes manage customers, properties, job cards, technician assignments, scheduling, quotations, work completion evidence, service reports, follow-ups, materials, and business performance.

## Development

The current application extends the approved landing page with a persistent plumbing operations workspace at `/app`. It is a development release; Hostinger verification and production security requirements remain outstanding. Billing and live payments are disabled.

Use Node 24.x, then:

```sh
npm ci
npm run dev:all
```

Create your own workspace through `/app?mode=signup`. No demonstration accounts are seeded. Configure the exact frontend origin and private database path using `.env.example`; never overwrite an existing `.env` blindly.

- [Phase 2 implementation, setup and limitations](docs/PHASE-2.md)
- [Security review and release requirements](docs/SECURITY.md)
- [Encrypted backup and recovery](docs/BACKUP-RECOVERY.md)
- [Hostinger deployment gate and procedure](docs/HOSTINGER-DEPLOYMENT.md)

Validation: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:api`, and `npm test`. The API suite requires `pdftotext`; browser tests require Chromium. This cloud machine can use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test`. See the phase report for test database isolation and ports. The original landing artwork remains inaccessible to the build; `npm run check:assets` reports that unresolved visual-release gap.

Phase 3 adds durable follow-ups/reminders, recurring maintenance, stock/material usage, costing, manual recognized revenue, operational reports, configurable service checklists, completion evidence snapshots and a company audit view. See [Phase 3 implementation and notification/worker setup](docs/PHASE-3.md). In-app reminders run with the API; optional Resend email is disabled until securely configured and explicitly enabled. Provider acceptance is never presented as confirmed delivery. `npm run worker` and `npm run worker:once` support supervised/background scheduling when needed.

Phase 4 adds seven roles, branches/service areas, workload, internal approvals, document branding, ZAR price book, privacy/export/deletion and gated subscriptions. See [Phase 4 implementation and payment verification limits](docs/PHASE-4.md). Billing stays disabled; merchant eligibility, provider round trips and target Hostinger compatibility are not yet verified.

Phase 5 adds secure recovery/verification, durable account email, upload/branch/payment/startup fixes and launch tooling. See [the QA/security audit and launch blockers](docs/PHASE-5-AUDIT.md). `npm run migrate` applies release migrations; `npm run preflight` reports unresolved production prerequisites. Real email, payments, original asset availability and the selected Hostinger runtime remain unverified; billing stays off.

Reference artwork is now included in public/: five landing images, sixteen source-cropped decorative icons and the transparent MzansiPlumb logo shared across application views. `npm run check:assets` verifies all 22 assets and logo transparency. See [artwork provenance](design-reference/README.md) for source-export and visual-fidelity limits; earlier missing-asset reports are historical.
