# DEVLOG

## Day 1 — 2026-05-07

**Hours worked:** 4

**What I did:**
Started with the frontend first because I wanted the audit flow and UX to feel clear before connecting backend logic.

Built the main audit page and spend form UI using React + TypeScript + Tailwind.

- created reusable ToolCard components
- added team size + use case section
- added dynamic enable/disable flow for tools
- added monthly spend calculations
- added estimated pricing warnings
- implemented localStorage persistence using a custom hook
- structured tool configs separately to avoid hardcoding everything inside components

Also spent some time simplifying the pricing structure because the first version became too overengineered for the assignment.

**What I learned:**
Separating tool config data from component logic early makes the codebase much easier to extend. Hardcoding tool names and plans inside components creates maintenance problems fast.

**Blockers / what I'm stuck on:**
Nothing blocking. Need to decide on backend architecture before Day 2.

**Plan for tomorrow:**
Set up Express + TypeScript backend, connect PostgreSQL with Prisma, and start the audit engine structure.

---

## Day 2 — 2026-05-08

**Hours worked:** 5

**What I did:**
Worked on backend setup and project structure.

- setup Express + TypeScript backend
- connected PostgreSQL with Prisma
- configured Prisma client
- created app.ts and server.ts structure
- added asyncHandler utility
- created centralized ApiError class
- created reusable ApiResponse helpers
- added global error handling middleware
- started building the audit engine service
- created initial pricing data structure for supported AI tools

Also fixed multiple TypeScript + Prisma setup issues during configuration.

**What I learned:**
Prisma requires running both `db push` and `generate` after schema changes. Skipping `generate` causes the client to use a stale type definition which causes confusing TypeScript errors.

**Blockers / what I'm stuck on:**
Had multiple TypeScript configuration issues with Prisma. Resolved by ensuring `moduleResolution` was set to `bundler` in tsconfig and imports used `.js` extensions.

**Plan for tomorrow:**
Build the core audit engine logic, add plan rules for each tool, connect frontend form to backend API, and persist audits in the database.

---

## Day 3 — 2026-05-09

**Hours worked:** 6

**What I did:**
Focused mostly on building the audit engine and getting the audit flow working end-to-end.

- built the main audit engine flow
- added modular audit rules for different AI tools
- added savings calculation helpers
- added alternative recommendation checks
- separated pricing data from business logic
- created audit types and shared interfaces
- created Prisma audit model
- added audit controller logic
- created audit routes
- connected frontend form submission with backend API
- added database persistence for generated audits
- added UUID-based audit IDs for report retrieval

Also spent time restructuring parts of the audit engine because the earlier implementation started duplicating pricing values in multiple places.

**What I learned:**
Keeping pricing data in one place and importing it into rules is much cleaner than duplicating numbers across files. A finance person reading the audit logic should be able to trace every number back to a single source of truth.

**Blockers / what I'm stuck on:**
Audit engine was initially returning inconsistent shapes for different tools. Fixed by defining strict TypeScript interfaces for AuditInput and AuditResult and enforcing them across all rule functions.

**Plan for tomorrow:**
Build results page, add lead capture form, integrate Resend email, wire shareable URL flow, and connect all frontend pages to backend API.

---

## Day 4 — 2026-05-10

**Hours worked:** 6

**What I did:**
Built the results page and wired the full frontend-to-backend flow end-to-end for the first time.

Frontend:
- built complete Results page with hero savings section
- added per-tool breakdown cards with status badges (overspending / review / optimal)
- added alternatives section for overlapping tools
- added lead capture form on results page
- added shareable URL section with copy-to-clipboard
- added /audit/:auditId public route that reads auditId from URL params
- handled all edge cases: missing auditId, fetch errors, empty results
- added "You're spending well" state for optimal audits

Backend:
- completed lead controller with full validation
- added Resend email integration in emailService.ts
- built HTML email template with per-tool recommendations table
- added Credex consultation banner in email for high-savings cases
- wired lead controller to call sendAuditEmail after saving to DB
- added lead route to app.ts

Integration:
- created frontend/src/services/api.ts with runAudit, getAudit, saveLead functions
- connected form submit to POST /api/audit
- auditId saved to localStorage after successful audit
- results page reads from localStorage then fetches fresh from backend
- lead capture form calls POST /api/leads successfully
- shareable URL working at /audit/:auditId

**What I learned:**
Keeping the API response shape consistent between createAudit and getAudit matters more than expected. The frontend breaks in subtle ways when the shape differs even slightly. Also learned that Resend free tier only sends to verified emails during testing.

**Blockers / what I'm stuck on:**
Resend from address requires domain verification for production. Currently using onboarding@resend.dev for development which only delivers to the account owner email. Will note this limitation in ARCHITECTURE.md.

## Day 5 — 2026-05-11

**Hours worked:** 5

**What I did:**

Backend:
- added AI-generated audit summary feature using LangChain + Gemini (gemini-2.5-flash)
- created summarySchema.ts with Zod structured output (summary, topRecommendation, urgencyLevel)
- created summaryService.ts with graceful fallback if Gemini API fails
- created summaryController.ts with DB caching — skips Gemini call if summary already exists
- added aiSummary field to Prisma audit model and ran db push + generate
- created summaryRoutes.ts and registered /api/summary in app.ts
- added rate limiting middleware with three tiers:
  - strict (5 req/15min) on /api/leads and /api/summary
  - moderate (10 req/15min) on POST /api/audit
  - loose (60 req/15min) on GET /api/audit/:auditId

Frontend:
- updated Results.tsx to fetch AI summary on page load with loading state
- added urgencyLevel badge (high/medium/low) on summary card
- updated api.ts with generateAuditSummary function
- added Open Graph and Twitter Card meta tags to index.html
- installed react-helmet-async for dynamic OG tags on /audit/:auditId pages

**What I learned:**
Caching the AI summary in the DB was important — without it, every page visit would trigger a Gemini API call, adding latency and cost. Checking for existing aiSummary before calling the LLM keeps the experience fast on repeat visits and shared URLs.

Also learned that LangChain's withStructuredOutput + Zod is cleaner than parsing raw LLM text — the frontend always gets a guaranteed shape with no defensive coding needed.

**Blockers / what I'm stuck on:**
OG meta tags in a Vite + React SPA are not crawlable by social platforms since crawlers don't execute JavaScript. Documented this limitation — proper fix would require SSR (Next.js). Used react-helmet-async as a best-effort solution for now.

**Plan for tomorrow:**
- Write 5+ audit engine tests with Jest/Vitest
- Set up GitHub Actions CI (lint + test on every push to main)
- Deploy backend to Render
- Deploy frontend to Netlify
- Fix CORS between deployed URLs
- Conduct user interviews (target: 3 real conversations)
- Start PRICING_DATA.md, ARCHITECTURE.md