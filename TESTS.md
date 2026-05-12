# TESTS

## How to Run All Tests

```bash
cd backend
npm test
```

For watch mode during development:

```bash
npm run test:watch
```

---

## Test Files Overview

| File | Tests | What it covers |
|---|---|---|
| `src/__tests__/auditEngine.test.ts` | 59 | Core audit engine, savings helpers, plan rules, alternatives, summary fallback |
| `src/__tests__/audit.controller.test.ts` | 3 | Audit controller — DB persistence, runAudit wiring |
| `src/__tests__/lead.controller.test.ts` | 6 | Lead controller — validation, email, graceful failure |
| `src/__tests__/summary.controller.test.ts` | 4 | Summary controller — cache hit/miss, validation |
| `src/__tests__/summaryService.test.ts` | 1 | Gemini API success path |
| `src/__tests__/audit.api.test.ts` | 4 | Full HTTP integration — routes, status codes, response shape |

**Total: 77 tests**

---

## File 1: `src/__tests__/auditEngine.test.ts`

### Section 1 — `calcMonthlySavings`

| Test | What it covers |
|---|---|
| returns positive savings when user overpays | Core savings logic — $100 spend vs $60 recommended = $40 saved |
| returns 0 when user pays exactly the recommended price | Zero savings boundary — no false positives |
| returns 0 (not negative) when user pays less than recommended | Clamps to 0 — prevents surfacing negative savings to user |
| handles zero spend correctly | Edge case — no crash on empty/zero input |

### Section 2 — `calcAnnualSavings`

| Test | What it covers |
|---|---|
| returns monthly * 12 | Annual projection multiplier is correct |
| returns 0 for zero monthly savings | Zero propagation — no phantom annual savings |

### Section 3 — `calcTotalSpend`

| Test | What it covers |
|---|---|
| sums only enabled tools | Disabled tools must never contribute to spend totals |
| returns 0 when all tools disabled | All-disabled edge case |
| returns 0 for empty array | Empty input doesn't crash |

### Section 4 — `calcSpendPerDev`

| Test | What it covers |
|---|---|
| divides total spend by team size | Core per-dev calculation |
| returns 0 when team size is 0 | Division-by-zero guard |
| returns rounded value to 2 decimal places | Floating point precision ($100/3 = $33.33) |

### Section 5 — `getSavingsLevel`

| Test | What it covers |
|---|---|
| returns high for savings > $500/mo | High tier threshold |
| returns medium for savings $100–$500/mo | Medium tier threshold |
| returns low for savings $1–$100/mo | Low tier threshold |
| returns optimal when savings is exactly 0 | Zero boundary — "You're spending well" state |

### Section 6 — `getAuditStatus`

| Test | What it covers |
|---|---|
| returns overspending when savings > $50 | Badge logic — red overspending status |
| returns review when savings is $1–$50 | Badge logic — yellow review status |
| returns optimal when savings is 0 | Badge logic — green optimal status |

### Section 7 — `calcOverpayAmount`

| Test | What it covers |
|---|---|
| returns overpay when user spends above expected | Detects overpayment vs seat-adjusted official price |
| returns 0 when user pays at or below expected | No false overpay flags |

### Section 8 — `planRules: cursor`

| Test | What it covers |
|---|---|
| recommends Pro for single seat | 1 seat → Pro at $20/mo |
| recommends Pro per seat for 2–10 seats | Mid-tier → Pro per seat |
| recommends Teams for >10 seats | Large team → Teams at $40/seat, no false savings when user pays less |
| returns optimal status when spend matches recommended | No savings manufactured |

### Section 9 — `planRules: claude`

| Test | What it covers |
|---|---|
| recommends Pro for 1 seat | Single user → Claude Pro at $20/mo |
| recommends Team plan for multiple seats | Multi-seat → Team at $25/seat |
| sets overspending status when savings > $50 | Status badge assignment |

### Section 10 — `planRules: githubCopilot`

| Test | What it covers |
|---|---|
| recommends Pro for single seat | 1 seat → Pro at $10/mo |
| recommends Business for 2–19 seats | Mid-tier → Business at $19/seat |
| recommends Enterprise for 20+ seats | Large team → Enterprise at $39/seat |

### Section 11 — `planRules: chatgpt`

| Test | What it covers |
|---|---|
| recommends Plus for single user | 1 seat → Plus at $20/mo |
| recommends Business for multiple seats | Multi-seat → Business at $30/seat, boundary $50 savings = review status |

### Section 12 — `planRules: windsurf`

| Test | What it covers |
|---|---|
| recommends Pro for 1 seat | Single user → Pro at $20/mo |
| recommends Teams for multiple seats | Multi-seat → Teams at $40/seat |

### Section 13 — `checkAlternatives`

| Test | What it covers |
|---|---|
| flags Cursor + GitHub Copilot overlap | Core overlap detection for coding tools |
| flags Claude + ChatGPT overlap for writing use case | Use-case-specific overlap — writing only |
| does NOT flag Claude + ChatGPT for non-writing use case | Overlap rule is scoped correctly |
| flags Anthropic API + Claude subscription overlap | API vs subscription redundancy |
| returns empty array when no overlaps exist | No false alternative suggestions |
| ignores disabled tools when checking alternatives | Disabled tools must not trigger suggestions |

### Section 14 — `runAudit` (full engine integration)

| Test | What it covers |
|---|---|
| skips disabled tools entirely | Disabled tools produce no results and no savings |
| aggregates savings across multiple tools correctly | Multi-tool savings sum is correct |
| returns savingsLevel high when total savings > $500 | High savings level threshold |
| returns savingsLevel optimal when no savings found | Optimal state — no manufactured savings |
| returns "right plan" reason for optimal cursor spend | Reason text is user-facing and accurate |
| passes through unknown tools without crashing | Unknown tool names get a passthrough result |
| calculates spendPerDev correctly | Per-developer spend calculation |
| spendPerDev is 0 when teamSize is 0 | Division-by-zero guard in integration context |
| surfaces alternatives when Cursor + Copilot both enabled | Alternatives wired through end-to-end |
| totalCurrentSpend reflects only enabled tools | Spend total ignores disabled tools |

### Section 15 — Edge Cases

| Test | What it covers |
|---|---|
| handles empty tools array without crashing | Completely empty input |
| handles all tools disabled | No enabled tools — zero output |
| audit result has all required fields for each tool | Shape contract — frontend depends on all fields |
| annualSavings is always 12x monthlySavings in results | Internal consistency check |
| monthlySavings is never negative in any result | No negative savings surfaced to user |

### Section 16 — `generateSummary` fallback (mocked LangChain)

| Test | What it covers |
|---|---|
| fallback returns correct shape when Gemini fails | Shape contract — `summary`, `topRecommendation`, `urgencyLevel` always present |
| fallback urgencyLevel is high when savings > 500 | High urgency tier in fallback path |
| fallback urgencyLevel is low when savings <= 100 | Low urgency tier in fallback path |

---

## File 2: `src/__tests__/audit.controller.test.ts`

Prisma and `runAudit` are fully mocked — no DB or engine calls during these tests.

| Test | What it covers |
|---|---|
| stores aiSummary as null on create | New audits always initialize `aiSummary: null` in the DB payload |
| passes tools, useCase and teamSize to runAudit | Controller correctly forwards all three fields from `req.body` to the engine |
| returns aiSummary when available | `getAudit` reads `aiSummary` from DB and includes it in the response shape |

---

## File 3: `src/__tests__/lead.controller.test.ts`

Prisma and `sendAuditEmail` are fully mocked.

| Test | What it covers |
|---|---|
| creates lead successfully | Happy path — lead saved, 201 returned |
| throws when auditId missing | Validation — `auditId` is required |
| throws when email missing | Validation — `email` is required |
| throws when audit not found | 404 guard — `findUnique` returns null |
| sends confirmation email | `sendAuditEmail` is called after lead is saved |
| still succeeds when email sending fails | Email failure is caught — lead save still returns 201 |

---

## File 4: `src/__tests__/summary.controller.test.ts`

Prisma and `generateSummary` are fully mocked.

| Test | What it covers |
|---|---|
| throws when request body invalid | Zod schema validation rejects empty body |
| throws when audit missing | 404 guard when `findUnique` returns null |
| returns cached summary when available | Cache hit — `generateSummary` is NOT called |
| generates summary when cache empty | Cache miss — `generateSummary` IS called and result is written to DB |

---

## File 5: `src/__tests__/summaryService.test.ts`

LangChain is mocked via `vi.doMock` to simulate a successful Gemini response.

| Test | What it covers |
|---|---|
| returns Gemini summary when API succeeds | Happy path — structured output returned with correct `summary`, `topRecommendation`, `urgencyLevel` |

---

## File 6: `src/__tests__/audit.api.test.ts`

Full HTTP integration tests using `supertest`. Prisma, email service, and LangChain are mocked so no external calls are made.

| Test | What it covers |
|---|---|
| POST /api/v1/audit returns 201 and valid response structure | Route is wired, response has `success: true` and `auditId` |
| POST /api/v1/audit returns 400 when useCase missing | Validation error surfaces correctly at the HTTP layer |
| POST /api/v1/lead returns 201 | Lead route is reachable and returns success |
| POST /api/summary returns summary response | Summary route is reachable and returns a response |