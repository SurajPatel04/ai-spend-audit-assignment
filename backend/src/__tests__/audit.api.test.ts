import request from "supertest"
import { describe, it, expect, vi } from "vitest"
import app from "../app.js"
import prisma from "../config/db.js"

// We mock prisma so we don't hit the real DB during API tests
vi.mock("../config/db.js", () => ({
    default: {
        audit: {
            create: vi.fn().mockResolvedValue({ id: "123e4567-e89b-12d3-a456-426614174000", publicToken: "123e4567-e89b-12d3-a456-426614174000" }),
            findUnique: vi.fn().mockResolvedValue({
                id: "audit-db-id",
                publicToken: "123e4567-e89b-12d3-a456-426614174000",
                auditResult: {
                    totalMonthlySavings: 100,
                    totalAnnualSavings: 1200,
                    results: [],
                    savingsLevel: "medium"
                }
            }),
            update: vi.fn().mockResolvedValue({}),
        },
        lead: {
            create: vi.fn().mockResolvedValue({ id: "lead-1" })
        }
    }
}))

// We mock the email service
vi.mock("../services/emailService.js", () => ({
    sendAuditEmail: vi.fn().mockResolvedValue(undefined)
}))

// We mock the gemini langchain model to prevent real API calls
vi.mock('@langchain/google-genai', () => {
    const mockInvoke = vi.fn().mockResolvedValue({
        summary: "Mock summary",
        topRecommendation: "Mock recommendation",
        urgencyLevel: "medium"
    });
    const mockWithStructuredOutput = vi.fn().mockReturnValue({ invoke: mockInvoke });
    class ChatGoogleGenerativeAI {
        withStructuredOutput = mockWithStructuredOutput;
        constructor(_config: unknown) { }
    }
    return { ChatGoogleGenerativeAI };
})

describe("API Routes Integration Tests", () => {
    describe("POST /api/v1/audit", () => {
        it("returns 201 and valid response structure", async () => {
            const response = await request(app)
                .post("/api/v1/audit")
                .send({
                    tools: [],
                    useCase: "coding",
                    teamSize: 1
                })

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty("success", true)
            expect(response.body.data).toHaveProperty("auditId")
        })

        it("returns 400 when useCase missing", async () => {
            const response = await request(app)
                .post("/api/v1/audit")
                .send({
                    tools: []
                })

            expect(response.status).toBe(400)
        })
    })

    describe("POST /api/v1/lead", () => {
        it("returns 201", async () => {
            const response = await request(app)
                .post("/api/v1/lead")
                .send({
                    auditId: "123e4567-e89b-12d3-a456-426614174000",
                    email: "test@example.com"
                })

            expect([200, 201]).toContain(response.status)
        })
    })

    describe("POST /api/summary", () => {
        it("returns summary response", async () => {
            const response = await request(app)
                .post("/api/summary")
                .send({
                    auditId: "123e4567-e89b-12d3-a456-426614174000",
                    totalMonthlySpend: 500,
                    totalSavings: 200,
                    flaggedTools: ["Claude"],
                    useCase: "coding",
                    teamSize: 5
                })

            expect([200, 201]).toContain(response.status)
        })
    })
})
