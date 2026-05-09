import { planRules } from './rules/planRules.js'
import type { AuditInput, AuditResult, AuditOutput } from '../types/audit.js'
import { checkAlternatives } from './rules/alternativeRules.js'
import {
    calcTotalSpend,
    calcAnnualSavings,
    getSavingsLevel,
    calcSpendPerDev
} from './helpers/savingsCalculator.js'

export const runAudit = (
    tools: AuditInput[],
    useCase: string,
    teamSize: number = 0
): AuditOutput => {

    const enabledTools = tools.filter(t => t.enabled)
    const results: AuditResult[] = []

    for (const tool of enabledTools) {
        const toolKey = tool.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace('githubcopilot', 'githubCopilot')
            .replace('chatgpt', 'chatgpt')

        const rule = planRules[toolKey]

        if (rule) {
            results.push(rule(tool))
        } else {
            // no rule = just pass through
            results.push({
                tool: tool.name,
                currentPlan: tool.plan,
                currentSpend: tool.monthlySpend,
                recommendedPlan: tool.plan,
                recommendedSpend: tool.monthlySpend,
                monthlySavings: 0,
                annualSavings: 0,
                reason: 'No optimization found. Spend looks reasonable.',
                status: 'optimal'
            })
        }
    }

    const alternatives = checkAlternatives(tools, useCase)

    const totalMonthlySavings = results.reduce(
        (sum, r) => sum + r.monthlySavings, 0
    )
    const totalAnnualSavings = calcAnnualSavings(totalMonthlySavings)

    const savingsLevel = getSavingsLevel(totalMonthlySavings)

    const totalCurrentSpend = calcTotalSpend(tools)
    const spendPerDev = calcSpendPerDev(totalCurrentSpend, teamSize)

    return {
        results,
        alternatives,
        totalMonthlySavings,
        totalAnnualSavings,
        savingsLevel,
        totalCurrentSpend,
        spendPerDev
    }
}