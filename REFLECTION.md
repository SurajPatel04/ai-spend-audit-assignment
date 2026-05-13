# REFLECTION

---

# 1. The hardest bug I hit this week, and how I debugged it

The hardest bug I hit was while writing tests for the AI summary service using Vitest. I mocked `ChatGoogleGenerativeAI` from LangChain using `vi.mock`, but every test failed with an error similar to:

`TypeError: ChatGoogleGenerativeAI is not a constructor`

At first I assumed the import path was wrong or that Vitest was resolving ESM modules incorrectly. I checked the module exports, switched between default and named imports, and even temporarily replaced the entire AI service with a hardcoded mock implementation to isolate the problem. The rest of the tests passed, which confirmed the issue was specifically related to the mocked class instantiation.

My second hypothesis was that LangChain internally depended on prototype methods that my mock implementation did not provide. I logged the runtime values inside the service and realized the mocked module itself existed correctly — but the mocked export was an arrow function.

The key insight came after reading how `new` behaves in JavaScript. Arrow functions do not have a prototype and therefore cannot be instantiated with `new`. My mock looked syntactically correct, but it fundamentally could not behave like the original class.

I fixed it by replacing the arrow-function mock with a proper class definition inside the mock factory:

```ts
class MockChatGoogleGenerativeAI {
  invoke() {
    return Promise.resolve(...)
  }
}
```

After switching to a class-based mock, the tests passed immediately.

The biggest lesson from this bug was that debugging gets much easier when hypotheses are narrowed systematically instead of randomly changing code. The bug initially looked like a TypeScript or Vitest configuration problem, but the real issue was understanding JavaScript constructor behavior at runtime.

---

# 2. A decision I reversed mid-week, and what made me reverse it

One decision I reversed mid-week was using AI-generated reasoning for the actual audit recommendations themselves.

My initial idea was to let the LLM analyze the user's stack and dynamically recommend cheaper alternatives. I thought this would make the product feel more intelligent and personalized. I experimented with prompts that included the user's tools, plans, team size, and spend data, then asked the model to suggest optimizations and estimate savings.

Very quickly, I realized this was the wrong architecture for the core audit engine.

The problem was consistency and trust. The same input could produce slightly different recommendations across requests, and occasionally the model suggested financially incorrect advice. For example, one test output recommended enterprise plans for very small teams simply because the prompt emphasized collaboration requirements too heavily. In another case, the model mixed up monthly and annual pricing during savings calculations.

That became a major design turning point. The assignment explicitly emphasized that the logic should be financially defensible and traceable to real pricing data. A finance person reviewing the output should agree with the reasoning. Deterministic logic fits that requirement much better than probabilistic generation.

I reversed the architecture and moved all audit calculations to hardcoded rules backed by structured pricing data. The AI became responsible only for generating the short personalized summary paragraph.

This decision simplified testing, improved consistency, reduced API costs, and made the recommendations auditable. It also aligned much more closely with how real financial tooling should behave: calculations deterministic, explanations human-readable.

The reversal taught me that adding AI everywhere is not automatically better engineering. Sometimes removing AI creates a more reliable product.

---

# 3. What I would build in week 2 if I had it

If I had another week, I would focus less on expanding the number of supported tools and more on making the audit feel like a true “AI spend intelligence” platform instead of a one-time calculator.

The first feature I would build is benchmarking mode. Several potential users mentioned that they do not know whether their spending is objectively high or low relative to companies their size. I would aggregate anonymized audit data and show comparisons like:

“Teams with 10–20 developers spend 32% less on coding assistants on average.”

That framing is much more actionable than simply showing raw savings numbers.

The second feature would be historical spend tracking. Right now the tool gives a snapshot audit, but many companies experience AI subscription creep gradually over time. I would allow users to save quarterly audits and visualize trends in seat growth, overlapping subscriptions, and API usage increases.

The third feature would be invoice ingestion. Instead of manually entering spend data, users could upload OpenAI, Anthropic, or Cursor invoices directly. The system could parse usage patterns automatically and generate more accurate recommendations.

I would also improve the shareability aspect of the product. Right now the public audit pages work well, but I would add screenshot export cards optimized for X and LinkedIn posting because founder tools spread heavily through screenshots.

Finally, I would add organization-level recommendations instead of only per-tool optimizations. For example:
- consolidating vendors
- standardizing team tooling
- centralizing API billing
- negotiating enterprise contracts

That would move the product closer to something a real finance or engineering operations team could use continuously.

---

# 4. How I used AI tools during the project

I used AI tools heavily throughout the project, but selectively. My primary tools were Cursor, ChatGPT, and Claude.

Cursor was most useful for implementation speed during repetitive tasks like React component scaffolding, route wiring, TypeScript interfaces, and boilerplate CRUD operations. It significantly reduced the amount of repetitive typing required for standard application structure.

ChatGPT and Claude were more useful for reasoning tasks. I used them to:
- review architecture trade-offs
- debug difficult runtime issues
- improve copywriting
- refine audit recommendation wording
- think through edge cases
- validate API design decisions

However, there were areas where I intentionally did not trust AI-generated output.

The biggest example was the audit math itself. Early in the project, I experimented with letting the LLM recommend plans and calculate savings dynamically. The results sounded convincing, but occasionally contained incorrect assumptions or inconsistent pricing logic. Because this product deals with financial recommendations, I decided the calculations needed to be deterministic and fully traceable to official pricing pages.

One specific example where the AI was wrong involved Prisma setup. During a schema update, the assistant suggested changes that looked correct syntactically, but the real issue was that Prisma Client had not been regenerated after the schema change. The stale generated types caused confusing TypeScript errors that the AI misdiagnosed repeatedly. I eventually fixed it by running both `prisma db push` and `prisma generate`.

That experience reinforced an important pattern for me: AI is extremely useful for acceleration and brainstorming, but correctness still depends on human verification and debugging discipline.

---

# 5. Self-rating on a 1–10 scale

## Discipline — 8/10

I worked consistently across multiple days instead of trying to cram everything at the end. The DEVLOG structure helped maintain momentum and forced me to think intentionally about progress and blockers each day. I still think I could improve time allocation — I spent slightly too long refining backend abstractions early in the week.

## Code Quality — 8/10

I’m satisfied with the overall structure of the codebase. The audit engine logic is modular, pricing data is centralized, TypeScript interfaces are enforced consistently, and the backend uses reusable error handling patterns. I also invested time in tests and CI instead of treating them as optional. The biggest area for improvement would be reducing some frontend component complexity and improving API type sharing between frontend and backend.

## Design Sense — 7/10

The final UI is clean, readable, and functional, especially the results page hierarchy. I focused on clarity over visual experimentation. However, I still think the landing page and animations could be more polished compared to top-tier SaaS products on Product Hunt.

## Problem Solving — 9/10

I think my strongest area during this project was debugging and architectural decision-making. I hit several difficult integration and testing issues, but I approached them methodically instead of patching symptoms randomly. Reversing the AI-driven audit architecture into deterministic rules was probably the best technical decision I made all week.

## Entrepreneurial Thinking — 8/10

I tried to approach the project as a real product rather than a coding assignment. I spent significant time on GTM, economics, landing copy, metrics, and user psychology instead of focusing only on implementation. I also thought carefully about how the product creates value for Credex as a lead-generation asset. The biggest area I would improve is conducting more real user validation earlier before refining the feature set.