import type { AuditResult } from './audit.js'

export interface SendAuditEmailParams {
    email: string
    auditId: string
    totalMonthlySavings: number
    totalAnnualSavings: number
    results: AuditResult[]
    savingsLevel: string
}
