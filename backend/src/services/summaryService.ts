import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    AuditSummarySchema,
    type AuditSummary,
    type SummaryRequest
} from "../schemas/summarySchema.js";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env["GEMINI_API_KEY"]!,
}).withStructuredOutput(AuditSummarySchema);

const buildPrompt = (data: SummaryRequest): string => `
  You are a financial analyst reviewing AI tool spend for a startup.
  Write a personalized audit summary based on:
  - Monthly spend: $${data.totalMonthlySpend}
  - Potential savings: $${data.totalSavings}/month
  - Flagged tools: ${data.flaggedTools.join(", ")}
  - Use case: ${data.useCase}
  - Team size: ${data.teamSize}

  Be specific, direct, and actionable. No fluff. Around 100 words.
`;

const buildFallback = (data: SummaryRequest): AuditSummary => ({
    summary:
        `Your team of ${data.teamSize} is spending $${data.totalMonthlySpend}/month on AI tools. ` +
        `We found $${data.totalSavings}/month in savings across ${data.flaggedTools.length} tools. ` +
        `Optimizing your ${data.useCase} stack could save $${data.totalSavings * 12}/year annually.`,
    topRecommendation: `Review your ${data.flaggedTools[0]} plan immediately`,
    urgencyLevel: data.totalSavings > 500 ? "high" : data.totalSavings > 100 ? "medium" : "low",
});

export const generateSummary = async (data: SummaryRequest): Promise<AuditSummary> => {
    try {
        const result = await model.invoke([
            { role: "user", content: buildPrompt(data) },
        ]);
        return result;
    } catch (error) {
        console.error("[summaryService] Gemini failed, using fallback:", error);
        return buildFallback(data);
    }
};