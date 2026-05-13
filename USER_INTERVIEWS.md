# USER_INTERVIEWS

---

# Interview 1 — “Too Many Overlapping AI Subscriptions”

## Participant
**Initials:** R.K.  
**Role:** Engineering Manager  
**Company stage:** Seed-stage fintech startup (~14 employees)

## Context
Call conducted over Discord. Participant manages a 5-person engineering team and personally approves most SaaS purchases below a fixed monthly threshold.

## Key Quotes

> “Nobody intentionally audits AI spend. It just accumulates one subscription at a time.”

> “We started with ChatGPT Plus, then added Claude because one engineer preferred it, then Cursor because everybody on Twitter used it.”

> “The annoying part isn’t the price — it’s not knowing which tools are actually redundant.”

> “I would absolutely forward a report like this internally if it looked financially credible.”

## Most Surprising Insight
The participant cared less about finding the cheapest tool and more about identifying *overlap*. He repeatedly described the problem as “subscription sprawl,” not “high pricing.”

I originally framed the product around “saving money,” but this conversation shifted the positioning toward “understanding overlap and waste.”

## What Changed In The Product
After this interview:
- Added overlap detection logic between ChatGPT, Claude, and Copilot-style tools
- Changed several recommendation messages from “switch tools” to “consolidate overlapping usage”
- Updated landing page copy from “reduce AI costs” to “see where your AI budget is leaking”

---

# Interview 2 — “Nobody Knows Their API Spend”

## Participant
**Initials:** A.S.  
**Role:** Solo founder  
**Company stage:** Bootstrapped developer-tools SaaS

## Context
Conversation over Telegram. Participant actively uses Cursor, Claude API, OpenAI API, and Gemini API while building a solo SaaS product.

## Key Quotes

> “Subscription costs are predictable. API costs are the scary part.”

> “I honestly couldn’t tell you what percentage of my OpenAI bill comes from production versus me experimenting locally.”

> “Most founders won’t know token pricing well enough to evaluate whether recommendations are correct.”

> “If you’re going to recommend downgrading, you need to explain why in plain English.”

## Most Surprising Insight
The participant distrusted opaque optimization advice more than he distrusted high pricing itself. He specifically asked for reasoning transparency.

I realized the audit output needed to feel explainable to non-experts, not just technically correct.

## What Changed In The Product
After this interview:
- Added one-sentence reasoning under every recommendation
- Added “why this recommendation?” explanatory copy in the results UI
- Reduced technical jargon around token pricing
- Added “You’re spending well” state instead of forcing savings recommendations

---

# Interview 3 — “Founders Want Benchmarking”

## Participant
**Initials:** J.M.  
**Role:** CTO  
**Company stage:** Series A B2B SaaS (~22 employees)

## Context
Google Meet conversation through a mutual founder community. Participant oversees engineering tooling decisions and infrastructure budgeting.

## Key Quotes

> “I don’t know if we’re overspending because I don’t know what ‘normal’ looks like.”

> “If you told me companies our size spend 40% less, I’d immediately investigate.”

> “The report has to be visually shareable. Founders forward screenshots, not spreadsheets.”

> “I’d probably run this once every quarter, not every week.”

## Most Surprising Insight
The participant naturally described the product as a benchmarking tool rather than a savings calculator.

That shifted my thinking from “cost reduction utility” toward “AI spend intelligence.”

## What Changed In The Product
After this interview:
- Added benchmark mode to future roadmap ideas
- Prioritized visual hierarchy on the results page
- Increased emphasis on annual savings totals for screenshot-sharing
- Changed METRICS.md away from DAU-style thinking toward audit completions