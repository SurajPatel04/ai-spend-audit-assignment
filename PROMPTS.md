# LLM Prompts Used

## 1. Audit Summary Generation

**Prompt String Template (`backend/src/services/summaryService.ts`):**

```javascript
You are a financial analyst reviewing AI tool spend for a startup.
Write a personalized audit summary based on:
- Monthly spend: $${data.totalMonthlySpend}
- Potential savings: $${data.totalSavings}/month
- Flagged tools: ${data.flaggedTools.join(", ")}
- Use case: ${data.useCase}
- Team size: ${data.teamSize}

Be specific, direct, and actionable. No fluff. Around 100 words.
```

**Combined with Structured Output Definitions (Zod schema in `backend/src/schemas/summarySchema.ts`):**

```javascript
z.object({
    summary: z.string().describe("~100 word personalized audit summary"),
    topRecommendation: z.string().describe("Single most impactful action to take"),
    urgencyLevel: z.enum(["low", "medium", "high"]).describe("How urgently they should act"),
});
```

### Why we wrote it this way:

1. **Persona Assignment:** Starting with "You are a financial analyst" sets a strict, professional, and authoritative tone, preventing the LLM from adopting an overly conversational or marketing-heavy voice.
2. **Constraint Boundary:** "No fluff. Around 100 words." explicitly curtails Gemini's natural tendency to produce overly verbose or explanatory preambles.
3. **Data Injection over Raw Analysis:** Instead of passing the entire raw form payload and asking the LLM to do the math, we inject pre-calculated fields (`totalMonthlySpend`, `totalSavings`). LLMs are notoriously bad at reliable arithmetic. By handling the deterministic math in the application layer (`savingsCalculator.ts`) and only using the LLM for *summarization and insights*, we guarantee numerical accuracy while leveraging the LLM's language skills.
4. **Structured Output (JSON/Zod):** Using LangChain's `.withStructuredOutput` combined with Zod schemas strictly enforces the return format. We define specific property descriptions like `"Single most impactful action to take"` inline within the schema. This guides the model to map its conceptual answers directly into our predictable frontend state variables (`summary`, `topRecommendation`, `urgencyLevel`) without relying on brittle regex parsing.

### What we tried that didn’t work:

1. **Asking the LLM to calculate the math:** Initially, we tried sending the raw array of tools (e.g. `[{ tool: "Cursor", plan: "pro", seats: 5 }]`) and asked the LLM to identify the savings directly. This failed catastrophically. The LLM would confidently hallucinate pricing tiers or fail basic multiplication (e.g., $20 * 5 = $120). *Takeaway: Never use LLMs for deterministic arithmetic.*
2. **Vague tone constraints:** Without the "No fluff" and "financial analyst" constraints, the LLM would generate responses like "Great news! I have reviewed your AI spend and here are some exciting ways to save money..." which ruined the professional aesthetic of the audit results.
3. **Markdown string parsing:** We originally asked the model to return markdown and tried to parse out the `topRecommendation` from a bullet point. This broke frequently if the model decided to use dashes instead of asterisks, or changed its formatting arbitrarily across runs. Moving to structured output via `zod` completely eliminated downstream JSON parsing errors.