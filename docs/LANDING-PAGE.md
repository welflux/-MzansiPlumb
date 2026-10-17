# Landing page phase

Historical Phase 1 report. Phase 2 now implements the backend and operations workspace; use PHASE-2.md for current behavior, setup, security and deployment limitations. The landing section layout/CSS remains unchanged.

The user's latest instruction starts frontend construction now and defers Hostinger plan verification and deployment until later. The supplied screenshot and logo remain the only approved visual references. Do not request them again or replace them with newly generated artwork.

## Current implementation

Vite and strict TypeScript serve a static frontend, without selecting the eventual SaaS backend or database. The six reference sections remain in order: hero/navigation, challenge, solution, South African benefits, FAQ and footer. Responsive CSS includes mobile navigation, and native details/dialog elements provide keyboard behavior. Feature controls and account/contact controls give explicit development-status information. No signup, sign-in, message delivery or payment workflow is simulated. FAQ answers are implementation-status disclosures rather than unverified launch promises.

This is an initial implementation, not a completed visual reproduction. Exact imagery, logo rendering, font matching and reference icon matching remain unresolved. The screenshot is visible in the conversation, but this execution environment provides neither a local file nor a downloadable attachment identifier for it or the logo. Existing reference image regions currently have empty backgrounds; brand text is an explicit technical fallback. The line icons are provisional and require comparison with the reference. Do not call this pixel-perfect, visually approved, complete or production-ready.

## Run locally

Use Node.js 22.12+ or 24 LTS and npm. From `/workspace/-MzansiPlumb`:

```sh
npm ci --cache /workspace/.npm-cache
npm run dev
```

Production frontend bundle:

```sh
npm run build
npm run preview
```

No environment variables or secrets are required for this phase. Never put secrets in Vite's client-exposed variables. The frontend does not currently store personal information or connect to external services.

## Verification

```sh
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
npm run check:assets
```

The browser executable override is optional; without it, install Chromium with `npx playwright install chromium`. In this cloud instance the download host is blocked, so tests use the installed system Chromium. The 18 browser checks passed at 1440px, 390px and 320px widths. They validate behavior and section order, not screenshot fidelity. Dependency audit reported zero known vulnerabilities at implementation time; this is not a security review of a SaaS backend.

The asset check deliberately fails while approved assets are unavailable. Expected paths are recorded in `scripts/check-assets.mjs`. Do not supply stock replacements merely to pass this check. Once the supplied originals are accessible, map/crop them without reimagining the design, compare desktop and mobile renderings, verify typography and icon fidelity, and update this status.

Deployment and backend/authentication/persistence are later phases. Billing and live payment processing remain disabled. Follow the implementation-readiness checklist before production deployment.
