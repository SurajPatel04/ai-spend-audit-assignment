import type { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { runAudit } from "../services/auditEngine.js"
import prisma from "../config/db.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

export const createAudit = asyncHandler(async (req: Request, res: Response) => {
    const { tools, teamSize, useCase } = req.body

    if (!tools || !Array.isArray(tools)) {
        throw new ApiError(400, "tools array is required")
    }

    if (!useCase) {
        throw new ApiError(400, "useCase is required")
    }

    const auditOutput = runAudit(tools, useCase, teamSize)

    const auditId = uuidv4()

    await prisma.audit.create({
        data: {
            publicToken: auditId,
            toolsData: tools,
            auditResult: {
                results: auditOutput.results,
                alternatives: auditOutput.alternatives,
                totalMonthlySavings: auditOutput.totalMonthlySavings,
                totalAnnualSavings: auditOutput.totalAnnualSavings,
                savingsLevel: auditOutput.savingsLevel,
                aiSummary: null,
            }
        }
    })

    return res.status(201).json(
        new ApiResponse(201, { auditId, ...auditOutput }, "Audit created successfully")
    )
})

export const getAudit = asyncHandler(async (req: Request, res: Response) => {
    const { auditId } = req.params

    const audit = await prisma.audit.findUnique({
        where: { publicToken: auditId }
    })

    if (!audit) {
        throw new ApiError(404, "Audit not found")
    }

    const auditResult = audit.auditResult as any

    return res.status(200).json(
        new ApiResponse(200, {
            auditId: audit.publicToken,
            tools: audit.toolsData,
            results: auditResult.results,
            alternatives: auditResult.alternatives ?? [],
            totalMonthlySavings: auditResult.totalMonthlySavings,
            totalAnnualSavings: auditResult.totalAnnualSavings,
            savingsLevel: auditResult.savingsLevel,
            aiSummary: audit.aiSummary ?? auditResult.aiSummary ?? null,
            createdAt: audit.createdAt,
        }, "Audit retrieved successfully")
    )
})