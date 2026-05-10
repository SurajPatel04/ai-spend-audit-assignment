// backend/src/controllers/lead.controller.ts
import type { Request, Response } from "express"
import prisma from "../config/db.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { sendSuccess } from "../utils/apiResponse.js"
import { sendAuditEmail } from "../services/emailService.js"

export const createLead = asyncHandler(async (req: Request, res: Response) => {
    const { auditId, email, companyName, role, teamSize, interestedInConsultation } = req.body

    if (!auditId) throw new ApiError(400, "auditId is required")
    if (!email) throw new ApiError(400, "email is required")

    // check audit exists
    const audit = await prisma.audit.findUnique({
        where: { publicToken: auditId }
    })

    if (!audit) throw new ApiError(404, "Audit not found")

    // save lead
    const lead = await prisma.lead.create({
        data: {
            auditId: audit.id,
            email,
            companyName: companyName ?? null,
            role: role ?? null,
            teamSize: teamSize ? Number(teamSize) : null,
            interestedInConsultation: interestedInConsultation ?? false,
        }
    })

    const auditResult = audit.auditResult as any

    try {
        await sendAuditEmail({
            email,
            auditId: audit.publicToken,
            totalMonthlySavings: auditResult.totalMonthlySavings,
            totalAnnualSavings: auditResult.totalAnnualSavings,
            results: auditResult.results,
            savingsLevel: auditResult.savingsLevel,
        })
    } catch (emailError) {
        console.error('Email failed:', emailError)
    }

    return sendSuccess(res, 201, "Lead captured successfully", { lead })
})