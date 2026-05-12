import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSummary } from '../controllers/summaryController.js'
import prisma from '../config/db.js'
import { generateSummary } from '../services/summaryService.js'

vi.mock('../config/db.js', () => ({
    default: {
        audit: {
            findUnique: vi.fn(),
            update: vi.fn()
        }
    }
}))

vi.mock('../services/summaryService.js', () => ({
    generateSummary: vi.fn()
}))

const mockRes = () => {
    const res: any = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
}

describe('Summary Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("throws when request body invalid", async () => {
        const req: any = {
            body: {}
        }

        const res = mockRes()

        await expect(getSummary(req, res)).rejects.toThrow(
            "Invalid request data"
        )
    })

    it("throws when audit missing", async () => {
        vi.mocked(prisma.audit.findUnique).mockResolvedValue(null)

        const req: any = {
            body: {
                auditId: "123e4567-e89b-12d3-a456-426614174000",
                totalMonthlySpend: 500,
                totalSavings: 200,
                flaggedTools: ["Claude"],
                useCase: "coding",
                teamSize: 5
            }
        }

        const res = mockRes()

        await expect(getSummary(req, res)).rejects.toThrow(
            "Audit not found"
        )
    })

    it("returns cached summary when available", async () => {
        vi.mocked(prisma.audit.findUnique).mockResolvedValue({
            aiSummary: {
                summary: "Cached",
                topRecommendation: "Downgrade",
                urgencyLevel: "medium"
            }
        } as any)

        const req: any = {
            body: {
                auditId: "123e4567-e89b-12d3-a456-426614174000",
                totalMonthlySpend: 500,
                totalSavings: 200,
                flaggedTools: ["Claude"],
                useCase: "coding",
                teamSize: 5
            }
        }

        const res = mockRes()

        await getSummary(req, res)

        expect(generateSummary).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
    })

    it("generates summary when cache empty", async () => {
        vi.mocked(prisma.audit.findUnique).mockResolvedValue({
            aiSummary: null
        } as any)

        vi.mocked(generateSummary).mockResolvedValue({
            summary: "Generated",
            topRecommendation: "Review Claude",
            urgencyLevel: "high"
        } as any)

        vi.mocked(prisma.audit.update).mockResolvedValue({} as any)

        const req: any = {
            body: {
                auditId: "123e4567-e89b-12d3-a456-426614174000",
                totalMonthlySpend: 500,
                totalSavings: 200,
                flaggedTools: ["Claude"],
                useCase: "coding",
                teamSize: 5
            }
        }

        const res = mockRes()

        await getSummary(req, res)

        expect(generateSummary).toHaveBeenCalled()
        expect(prisma.audit.update).toHaveBeenCalled()
    })
})
