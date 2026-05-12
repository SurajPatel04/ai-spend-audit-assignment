import type { Request, Response } from "express";
import { SummaryRequestSchema } from "../schemas/summarySchema.js";
import { generateSummary } from "../services/summaryService.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


import prisma from "../config/db.js";

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
    const parsed = SummaryRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(
            400,
            "Invalid request data",
            parsed.error.issues.map(i => ({
                field: i.path.join("."),
                message: i.message
            }))
        );
    }

    const { auditId } = parsed.data;

    const existingAudit = await prisma.audit.findUnique({
        where: { publicToken: auditId },
        select: { aiSummary: true },
    });

    if (!existingAudit) {
        throw new ApiError(404, "Audit not found");
    }

    if (existingAudit.aiSummary) {
        return res
            .status(200)
            .json(new ApiResponse(200, existingAudit.aiSummary, "Summary fetched from cache"));
    }

    const summary = await generateSummary(parsed.data);

    await prisma.audit.update({
        where: { publicToken: auditId },
        data: { aiSummary: summary as any },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, summary, "Summary generated successfully"));
});