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

## Day 6 — 2026-05-12

**Hours worked:** 6

**What I did:**

Testing:
- wrote 77 tests across 6 test files covering audit engine, savings calculator helpers, plan rules, alternative rules, all controllers, and API integration
- fixed vi.mock class constructor error — ChatGoogleGenerativeAI mock needed to be a proper class, not an arrow function, because `new` requires a constructor
- added supertest integration tests for all API routes with fully mocked dependencies
- set up vitest.config.ts
- all 77 tests passing

CI/CD:
- created .github/workflows/ci.yml — runs lint + tests on every push to main
- confirmed green checkmark on GitHub Actions

Documentation:
- wrote ARCHITECTURE.md with full Mermaid system diagram, data flow, stack reasoning, and 10k scale answer
- wrote TESTS.md documenting all 77 tests across 6 files with descriptions
- wrote PROMPTS.md with full Gemini prompt, structured output reasoning, and what failed (raw LLM math, vague tone constraints, markdown string parsing)
- wrote GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md

Frontend:
- updated SpendForm, ToolCard, TeamMetaSection components
- updated tools constants and styling
- added tool logo assets (Cursor, Claude, ChatGPT, Gemini, Windsurf, GitHub Copilot, Anthropic)

**What I learned:**
vi.mock factory functions must return a class when the module is instantiated with `new`. Arrow functions don't have a prototype and throw "is not a constructor" at runtime. Switching to a class definition inside the mock factory fixed it immediately.

Also learned that the Resend free tier limitation (only delivers to verified account owner email) needs to be documented clearly — it's a known constraint for the demo, not a bug.

**Blockers / what I'm stuck on:**
Resend email only delivers to the Resend account owner email in development because domain verification is not set up. Documented this in ARCHITECTURE.md. Not blocking for submission — the email flow works correctly, just restricted to verified addresses.

**Plan for tomorrow:**
- Write REFLECTION.md (5 long answers)
- Write README.md with screenshots from live deployed URL
- Write PRICING_DATA.md — pull current prices from all vendor pages
- Write USER_INTERVIEWS.md
- Add Day 7 DEVLOG entry
- Run Lighthouse audit on deployed URL, fix anything below threshold
- Verify git log shows commits on 5+ distinct days
- Final end-to-end test in incognito before submitting