import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAudit, getAudit } from '../controllers/audit.controller.js'
import { runAudit } from '../services/auditEngine.js'
import prisma from '../config/db.js'

vi.mock('../services/auditEngine.js', () => ({
    runAudit: vi.fn()
}))

vi.mock('../config/db.js', () => ({
    default: {
        audit: {
            create: vi.fn(),
            findUnique: vi.fn()
        }
    }
}))

const mockRes = () => {
    const res: any = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
}

describe('Audit Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createAudit', () => {
        it("stores aiSummary as null on create", async () => {
            const req: any = {
                body: {
                    tools: [],
                    useCase: "coding",
                    teamSize: 1
                }
            }

            const res = mockRes()

            vi.mocked(runAudit).mockReturnValue({
                results: [],
                alternatives: [],
                totalMonthlySavings: 0,
                totalAnnualSavings: 0,
                savingsLevel: "optimal",
                totalCurrentSpend: 0,
                spendPerDev: 0,
            } as any)

            vi.mocked(prisma.audit.create).mockResolvedValue({} as any)

            await createAudit(req, res)

            expect(prisma.audit.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        auditResult: expect.objectContaining({
                            aiSummary: null
                        })
                    })
                })
            )
        })

        it("passes tools, useCase and teamSize to runAudit", async () => {
            const tools = [
                {
                    name: "cursor",
                    plan: "Pro",
                    monthlySpend: 20,
                    seats: 1,
                    enabled: true
                }
            ]

            const req: any = {
                body: {
                    tools,
                    useCase: "coding",
                    teamSize: 5
                }
            }

            const res = mockRes()

            vi.mocked(runAudit).mockReturnValue({
                results: [],
                alternatives: [],
                totalMonthlySavings: 0,
                totalAnnualSavings: 0,
                savingsLevel: "optimal",
                totalCurrentSpend: 20,
                spendPerDev: 4,
            } as any)

            vi.mocked(prisma.audit.create).mockResolvedValue({} as any)

            await createAudit(req, res)

            expect(runAudit).toHaveBeenCalledWith(
                tools,
                "coding",
                5
            )
        })
    })

    describe('getAudit', () => {
        it("returns aiSummary when available", async () => {
            vi.mocked(prisma.audit.findUnique).mockResolvedValue({
                publicToken: "abc",
                toolsData: [],
                auditResult: {},
                aiSummary: {
                    summary: "Test summary",
                    topRecommendation: "Downgrade Cursor",
                    urgencyLevel: "medium"
                },
                createdAt: new Date()
            } as any)

            const req: any = {
                params: { auditId: "abc" }
            }

            const res = mockRes()

            await getAudit(req, res)

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        aiSummary: expect.objectContaining({
                            summary: "Test summary"
                        })
                    })
                })
            )
        })
    })
})
