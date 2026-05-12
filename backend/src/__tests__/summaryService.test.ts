import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('summaryService', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    it("returns Gemini summary when API succeeds", async () => {
        vi.doMock('@langchain/google-genai', () => {
            const mockInvoke = vi.fn().mockResolvedValue({
                summary: "AI summary",
                topRecommendation: "Use Cursor Pro",
                urgencyLevel: "medium"
            });
            const mockWithStructuredOutput = vi.fn().mockReturnValue({ invoke: mockInvoke });
            class ChatGoogleGenerativeAI {
                withStructuredOutput = mockWithStructuredOutput;
                constructor(_config: unknown) { }
            }
            return { ChatGoogleGenerativeAI };
        });

        const { generateSummary } = await import('../services/summaryService.js')

        const result = await generateSummary({
            auditId: "1",
            totalMonthlySpend: 200,
            totalSavings: 50,
            flaggedTools: ["Cursor"],
            useCase: "coding",
            teamSize: 2
        })

        expect(result.summary).toBe("AI summary")
        expect(result.topRecommendation).toBe("Use Cursor Pro")
        expect(result.urgencyLevel).toBe("medium")
    })
})
