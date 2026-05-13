import { z } from "zod";

export const AuditSummarySchema = z.object({
    summary: z.string().describe("~100 word personalized audit summary"),
    topRecommendation: z.string().describe("Single most impactful action to take"),
    urgencyLevel: z.enum(["low", "medium", "high"]).describe("How urgently they should act"),
});

export type AuditSummary = z.infer<typeof AuditSummarySchema>;

// Input validation schema (what the controller receives)
export const SummaryRequestSchema = z.object({
    auditId: z.string().uuid("Invalid audit ID"),
    totalMonthlySpend: z.number().min(0),
    totalSavings: z.number().min(0),
    flaggedTools: z.array(z.string()),
    useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
    teamSize: z.number().int().positive(),
});

export type SummaryRequest = z.infer<typeof SummaryRequestSchema>;