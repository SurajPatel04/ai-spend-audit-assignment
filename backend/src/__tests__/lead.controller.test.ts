import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLead } from '../controllers/lead.controller.js'
import prisma from '../config/db.js'
import { sendAuditEmail } from '../services/emailService.js'

vi.mock('../config/db.js', () => ({
    default: {
        audit: { findUnique: vi.fn() },
        lead: { create: vi.fn() }
    }
}))

vi.mock('../services/emailService.js', () => ({
    sendAuditEmail: vi.fn()
}))

const mockRes = () => {
    const res: any = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
}

describe('Lead Controller - createLead', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("creates lead successfully", async () => {
        vi.mocked(prisma.audit.findUnique).mockResolvedValue({
            id: "audit-db-id",
            publicToken: "audit-123",
            auditResult: {
                totalMonthlySavings: 100,
                totalAnnualSavings: 1200,
                results: [],
                savingsLevel: "medium"
            }
        } as any)

        vi.mocked(prisma.lead.create).mockResolvedValue({
            id: "lead-1"
        } as any)

        const req: any = {
            body: {
                auditId: "audit-123",
                email: "test@example.com"
            }
        }

        const res = mockRes()

        await createLead(req, res)

        expect(prisma.lead.create).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
    })

    it("throws when auditId missing", async () => {
        const req: any = {
            body: {
                email: "test@example.com"
            }
        }

        const res = mockRes()

        await expect(createLead(req, res)).rejects.toThrow(
            "auditId is required"
        )
    })

    it("throws when email missing", async () => {
        const req: any = {
            body: {
                auditId: "audit-1"
            }
        }

        const res = mockRes()

        await expect(createLead(req, res)).rejects.toThrow(
            "email is required"
        )
    })

    it("throws when audit not found", async () => {
        vi.mocked(prisma.audit.findUnique).mockResolvedValue(null)

        const req: any = {
            body: {
                auditId: "missing",
                email: "test@example.com"
            }
        }

        const res = mockRes()

        await expect(createLead(req, res)).rejects.toThrow(
            "Audit not found"
        )
    })

    it("sends confirmation email", async () => {
        vi.mocked(prisma.audit.findUnique).mockResolvedValue({
            id: "audit-db-id",
            publicToken: "audit-123",
            auditResult: {
                totalMonthlySavings: 100,
                totalAnnualSavings: 1200,
                results: [],
                savingsLevel: "medium"
            }
        } as any)

        vi.mocked(prisma.lead.create).mockResolvedValue({ id: "lead-1" } as any)
        vi.mocked(sendAuditEmail).mockResolvedValue(undefined)

        const req: any = {
            body: {
                auditId: "audit-123",
                email: "test@example.com"
            }
        }

        const res = mockRes()

        await createLead(req, res)

        expect(sendAuditEmail).toHaveBeenCalled()
    })

    it("still succeeds when email sending fails", async () => {
        vi.mocked(prisma.audit.findUnique).mockResolvedValue({
            id: "audit-db-id",
            publicToken: "audit-123",
            auditResult: {
                totalMonthlySavings: 100,
                totalAnnualSavings: 1200,
                results: [],
                savingsLevel: "medium"
            }
        } as any)

        vi.mocked(prisma.lead.create).mockResolvedValue({ id: "lead-1" } as any)

        vi.mocked(sendAuditEmail).mockRejectedValue(
            new Error("Email service down")
        )

        const req: any = {
            body: {
                auditId: "audit-123",
                email: "test@example.com"
            }
        }

        const res = mockRes()

        await createLead(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
    })
})
