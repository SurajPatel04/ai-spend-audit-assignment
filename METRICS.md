# METRICS

## North Star Metric

**Audits completed per week.**

Not visitors. Not signups. Not emails captured. The moment a user sees their audit results is the moment value is delivered — everything before that is funnel, everything after that is monetisation. If audits completed per week grows, it means the tool is reaching the right people and the form is converting. If it flatlines, nothing else matters.

DAU is wrong for this tool — people audit their stack once a quarter, not daily. Email captures is wrong — it's a downstream metric that depends on audit quality. Audits completed is the one number that tells you if the product is working.

Target: 50 audits/week by end of week 2, 200/week by end of month 1.

---

## 3 Input Metrics That Drive the North Star

**1. Landing page → form start rate**

What percentage of visitors click into the audit form. Target: 40%+. If this is low, the headline or CTA copy is failing — people don't understand what the tool does or don't trust it enough to start. This is a copywriting and design problem, not a product problem.

**2. Form start → audit complete rate**

What percentage of people who start the form actually submit it. Target: 65%+. Drop-off here means the form is too long, too confusing, or asks for information people don't have handy (e.g. exact monthly spend). If this drops below 50%, shorten the form or add inline help text.

**3. Audit complete → email capture rate**

What percentage of people who see their results submit their email. Target: 25%+. This is the lead quality signal. If savings are real and the results page is compelling, people will give their email. If this is low, either the savings numbers aren't surprising enough or the results page isn't visually convincing. Below 15% consistently is a signal to redesign the results page.

---

## What to Instrument First

In priority order:

1. **Audit completion event** — fire when `POST /api/audit` returns 201. Log `totalMonthlySavings`, `savingsLevel`, `toolCount`, `useCase`. This single event tells you if the tool is being used and what savings it's finding.

2. **Form start event** — fire when the user first interacts with the spend form. Combined with audit completion, this gives form completion rate immediately.

3. **Email capture event** — fire when `POST /api/leads` returns 201. Log `savingsLevel` and `interestedInConsultation`. Lets you see which savings tiers convert to leads best.

4. **Shareable URL copy event** — fire when the user copies their audit link. This is the viral loop trigger. If nobody copies the link, the viral loop is dead.

5. **Public audit URL view** — log when `GET /api/audit/:auditId` is hit from a referrer that isn't the original session. This tells you if shared links are actually driving new visitors.

A simple analytics setup (Posthog free tier or even a single `analytics` table in Postgres) captures all five with minimal instrumentation time.

---

## What Number Triggers a Pivot Decision

**If audit complete → email capture rate stays below 15% for 2 consecutive weeks after launch**, the tool has a results page problem. People are running the audit, seeing the results, and leaving without giving their email — meaning either the savings aren't compelling or they don't trust the numbers.

The pivot in this case is not to rebuild the tool — it's to either:
- Make the results page more visually dramatic (bigger savings hero, better per-tool breakdown)
- Lower the email capture ask (remove optional fields, reduce friction)
- Or re-examine whether the audit engine is surfacing real savings or just noise

**If audits completed stays below 20/week after 3 weeks of active distribution**, the acquisition channel has failed. The pivot is to try a different seeding channel — direct outreach to CTOs on LinkedIn instead of community posting, or a cold email campaign to YC companies.

The tool itself is sound if people who complete audits find value. The risk is purely in distribution and results page conversion.