export interface AuditInput {
    name: string
    enabled: boolean
    plan: string
    seats: number
    monthlySpend: number
}

export interface AuditResult {
    tool: string
    currentPlan: string
    currentSpend: number
    recommendedPlan: string
    recommendedSpend: number
    monthlySavings: number
    annualSavings: number
    reason: string
    status: 'overspending' | 'optimal' | 'review'
    confidence?: 'high' | 'medium' | 'low' | number
}

export interface AuditOutput {
    results: AuditResult[]
    alternatives: string[]
    totalMonthlySavings: number
    totalAnnualSavings: number
    savingsLevel: 'high' | 'medium' | 'low' | 'optimal'
    totalCurrentSpend: number
    spendPerDev: number
}
