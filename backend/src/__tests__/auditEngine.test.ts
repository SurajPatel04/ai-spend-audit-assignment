import { describe, it, expect, vi } from 'vitest'
import { runAudit } from '../services/auditEngine.js'
import { planRules } from '../services/rules/planRules.js'
import { checkAlternatives } from '../services/rules/alternativeRules.js'
import {
    calcMonthlySavings,
    calcAnnualSavings,
    calcTotalSpend,
    calcSpendPerDev,
    getSavingsLevel,
    getAuditStatus,
    calcOverpayAmount,
} from '../services/helpers/savingsCalculator.js'
import type { AuditInput } from '../types/audit.js'

// ─────────────────────────────────────────────
// SECTION 1 — savingsCalculator helpers
// ─────────────────────────────────────────────

describe('calcMonthlySavings', () => {
    it('returns positive savings when user overpays', () => {
        expect(calcMonthlySavings(100, 60)).toBe(40)
    })

    it('returns 0 when user pays exactly the recommended price', () => {
        expect(calcMonthlySavings(60, 60)).toBe(0)
    })

    it('returns 0 (not negative) when user pays LESS than recommended', () => {
        // User got a discount — no savings to surface, don't show negative
        expect(calcMonthlySavings(50, 80)).toBe(0)
    })

    it('handles zero spend correctly', () => {
        expect(calcMonthlySavings(0, 0)).toBe(0)
    })
})

describe('calcAnnualSavings', () => {
    it('returns monthly * 12', () => {
        expect(calcAnnualSavings(100)).toBe(1200)
    })

    it('returns 0 for zero monthly savings', () => {
        expect(calcAnnualSavings(0)).toBe(0)
    })
})

describe('calcTotalSpend', () => {
    it('sums only enabled tools', () => {
        const tools = [
            { enabled: true, monthlySpend: 100 },
            { enabled: false, monthlySpend: 200 },
            { enabled: true, monthlySpend: 50 },
        ]
        expect(calcTotalSpend(tools)).toBe(150)
    })

    it('returns 0 when all tools disabled', () => {
        const tools = [
            { enabled: false, monthlySpend: 500 },
        ]
        expect(calcTotalSpend(tools)).toBe(0)
    })

    it('returns 0 for empty array', () => {
        expect(calcTotalSpend([])).toBe(0)
    })
})

describe('calcSpendPerDev', () => {
    it('divides total spend by team size', () => {
        expect(calcSpendPerDev(300, 3)).toBe(100)
    })

    it('returns 0 when team size is 0 (avoid division by zero)', () => {
        expect(calcSpendPerDev(300, 0)).toBe(0)
    })

    it('returns rounded value to 2 decimal places', () => {
        expect(calcSpendPerDev(100, 3)).toBe(33.33)
    })
})

describe('getSavingsLevel', () => {
    it('returns high for savings > $500/mo', () => {
        expect(getSavingsLevel(501)).toBe('high')
    })

    it('returns medium for savings between $100–$500/mo', () => {
        expect(getSavingsLevel(300)).toBe('medium')
    })

    it('returns low for savings between $1–$100/mo', () => {
        expect(getSavingsLevel(50)).toBe('low')
    })

    it('returns optimal when savings is exactly 0', () => {
        expect(getSavingsLevel(0)).toBe('optimal')
    })
})

describe('getAuditStatus', () => {
    it('returns overspending when savings > $50', () => {
        expect(getAuditStatus(100)).toBe('overspending')
    })

    it('returns review when savings is between $1–$50', () => {
        expect(getAuditStatus(30)).toBe('review')
    })

    it('returns optimal when savings is 0', () => {
        expect(getAuditStatus(0)).toBe('optimal')
    })
})

describe('calcOverpayAmount', () => {
    it('returns overpay when user spends above expected', () => {
        // Expected = $20/seat * 3 seats = $60. User pays $90. Overpay = $30.
        expect(calcOverpayAmount(90, 20, 3)).toBe(30)
    })

    it('returns 0 when user pays at or below expected', () => {
        expect(calcOverpayAmount(60, 20, 3)).toBe(0)
        expect(calcOverpayAmount(40, 20, 3)).toBe(0)
    })
})

// ─────────────────────────────────────────────
// SECTION 2 — planRules (per-tool logic)
// ─────────────────────────────────────────────

describe('planRules: cursor', () => {
    it('recommends Pro for single seat', () => {
        const input: AuditInput = { name: 'cursor', plan: 'Teams', monthlySpend: 80, seats: 1, enabled: true }
        const result = planRules.cursor(input)
        expect(result.recommendedPlan).toBe('Pro')
        expect(result.monthlySavings).toBe(60) // $80 - $20
    })

    it('recommends Pro per seat for 2–10 seats', () => {
        const input: AuditInput = { name: 'cursor', plan: 'Teams', monthlySpend: 300, seats: 5, enabled: true }
        const result = planRules.cursor(input)
        expect(result.recommendedPlan).toBe('Pro (per seat)')
        expect(result.recommendedSpend).toBe(100) // $20 * 5
        expect(result.monthlySavings).toBe(200)
    })

    it('recommends Teams for >10 seats', () => {
        const input: AuditInput = { name: 'cursor', plan: 'Pro', monthlySpend: 500, seats: 15, enabled: true }
        const result = planRules.cursor(input)
        expect(result.recommendedPlan).toBe('Teams')
        expect(result.recommendedSpend).toBe(600) // $40 * 15
        // User pays less than recommended, so savings = 0
        expect(result.monthlySavings).toBe(0)
        expect(result.status).toBe('optimal')
    })

    it('returns optimal status when spend matches recommended', () => {
        const input: AuditInput = { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true }
        const result = planRules.cursor(input)
        expect(result.monthlySavings).toBe(0)
        expect(result.status).toBe('optimal')
    })
})

describe('planRules: claude', () => {
    it('recommends Pro for 1 seat', () => {
        const input: AuditInput = { name: 'claude', plan: 'Team', monthlySpend: 80, seats: 1, enabled: true }
        const result = planRules.claude(input)
        expect(result.recommendedPlan).toBe('Pro')
        expect(result.monthlySavings).toBe(60) // $80 - $20
    })

    it('recommends Team plan for multiple seats', () => {
        const input: AuditInput = { name: 'claude', plan: 'Pro', monthlySpend: 200, seats: 4, enabled: true }
        const result = planRules.claude(input)
        expect(result.recommendedPlan).toBe('Team')
        expect(result.recommendedSpend).toBe(100) // $25 * 4
        expect(result.monthlySavings).toBe(100)
        expect(result.status).toBe('overspending')
    })

    it('sets overspending status when savings > $50', () => {
        const input: AuditInput = { name: 'claude', plan: 'Enterprise', monthlySpend: 500, seats: 1, enabled: true }
        const result = planRules.claude(input)
        expect(result.status).toBe('overspending')
    })
})

describe('planRules: githubCopilot', () => {
    it('recommends Pro for single seat', () => {
        const input: AuditInput = { name: 'githubCopilot', plan: 'Business', monthlySpend: 50, seats: 1, enabled: true }
        const result = planRules.githubCopilot(input)
        expect(result.recommendedPlan).toBe('Pro')
        expect(result.recommendedSpend).toBe(10)
        expect(result.monthlySavings).toBe(40)
    })

    it('recommends Business for 2–19 seats', () => {
        const input: AuditInput = { name: 'githubCopilot', plan: 'Enterprise', monthlySpend: 500, seats: 10, enabled: true }
        const result = planRules.githubCopilot(input)
        expect(result.recommendedPlan).toBe('Business')
        expect(result.recommendedSpend).toBe(190) // $19 * 10
    })

    it('recommends Enterprise for 20+ seats', () => {
        const input: AuditInput = { name: 'githubCopilot', plan: 'Business', monthlySpend: 800, seats: 25, enabled: true }
        const result = planRules.githubCopilot(input)
        expect(result.recommendedPlan).toBe('Enterprise')
        expect(result.recommendedSpend).toBe(975) // $39 * 25
        // User pays less → savings = 0
        expect(result.monthlySavings).toBe(0)
    })
})

describe('planRules: chatgpt', () => {
    it('recommends Plus for single user', () => {
        const input: AuditInput = { name: 'chatgpt', plan: 'Team', monthlySpend: 100, seats: 1, enabled: true }
        const result = planRules.chatgpt(input)
        expect(result.recommendedPlan).toBe('Plus')
        expect(result.recommendedSpend).toBe(20)
        expect(result.monthlySavings).toBe(80)
    })

    it('recommends Business for multiple seats', () => {
        const input: AuditInput = { name: 'chatgpt', plan: 'Team', monthlySpend: 200, seats: 5, enabled: true }
        const result = planRules.chatgpt(input)
        expect(result.recommendedPlan).toBe('Business')
        expect(result.recommendedSpend).toBe(150) // $30 * 5
        expect(result.monthlySavings).toBe(50)
        expect(result.status).toBe('review') // exactly $50 — boundary case
    })
})

describe('planRules: windsurf', () => {
    it('recommends Pro for 1 seat', () => {
        const input: AuditInput = { name: 'windsurf', plan: 'Teams', monthlySpend: 80, seats: 1, enabled: true }
        const result = planRules.windsurf(input)
        expect(result.recommendedPlan).toBe('Pro')
        expect(result.monthlySavings).toBe(60)
    })

    it('recommends Teams for multiple seats', () => {
        const input: AuditInput = { name: 'windsurf', plan: 'Pro', monthlySpend: 300, seats: 5, enabled: true }
        const result = planRules.windsurf(input)
        expect(result.recommendedPlan).toBe('Teams')
        expect(result.recommendedSpend).toBe(200) // $40 * 5
        expect(result.monthlySavings).toBe(100)
    })
})

// ─────────────────────────────────────────────
// SECTION 3 — alternativeRules
// ─────────────────────────────────────────────

describe('checkAlternatives', () => {
    it('flags Cursor + GitHub Copilot overlap', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
            { name: 'github copilot', plan: 'Individual', monthlySpend: 10, seats: 1, enabled: true },
        ]
        const result = checkAlternatives(tools, 'coding')
        expect(result.length).toBeGreaterThan(0)
        expect(result[0]).toMatch(/Cursor.*GitHub Copilot|GitHub Copilot.*Cursor/i)
    })

    it('flags Claude + ChatGPT overlap for writing use case', () => {
        const tools: AuditInput[] = [
            { name: 'claude', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
            { name: 'chatgpt', plan: 'Plus', monthlySpend: 20, seats: 1, enabled: true },
        ]
        const result = checkAlternatives(tools, 'writing')
        expect(result.some(s => /claude.*chatgpt|chatgpt.*claude/i.test(s))).toBe(true)
    })

    it('does NOT flag Claude + ChatGPT overlap for non-writing use case', () => {
        const tools: AuditInput[] = [
            { name: 'claude', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
            { name: 'chatgpt', plan: 'Plus', monthlySpend: 20, seats: 1, enabled: true },
        ]
        const result = checkAlternatives(tools, 'coding')
        // Overlap rule is writing-specific — should not fire for coding
        const hasWritingFlag = result.some(s => /claude.*chatgpt|chatgpt.*claude/i.test(s))
        expect(hasWritingFlag).toBe(false)
    })

    it('flags Anthropic API + Claude subscription overlap', () => {
        const tools: AuditInput[] = [
            { name: 'claude', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
            { name: 'anthropic api', plan: 'API', monthlySpend: 150, seats: 1, enabled: true },
        ]
        const result = checkAlternatives(tools, 'coding')
        expect(result.some(s => /api/i.test(s))).toBe(true)
    })

    it('returns empty array when no overlaps exist', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
        ]
        const result = checkAlternatives(tools, 'coding')
        expect(result).toHaveLength(0)
    })

    it('ignores disabled tools when checking alternatives', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
            { name: 'github copilot', plan: 'Individual', monthlySpend: 10, seats: 1, enabled: false },
        ]
        const result = checkAlternatives(tools, 'coding')
        // Copilot is disabled — overlap should not fire
        const hasCopilotFlag = result.some(s => /copilot/i.test(s))
        expect(hasCopilotFlag).toBe(false)
    })
})

// ─────────────────────────────────────────────
// SECTION 4 — runAudit (full engine integration)
// ─────────────────────────────────────────────

describe('runAudit', () => {
    it('skips disabled tools entirely', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: false },
        ]
        const output = runAudit(tools, 'coding', 1)
        expect(output.results).toHaveLength(0)
        expect(output.totalMonthlySavings).toBe(0)
    })

    it('aggregates savings across multiple tools correctly', () => {
        const tools: AuditInput[] = [
            // Overpaying for cursor (1 seat, should be $20, paying $80)
            { name: 'cursor', plan: 'Teams', monthlySpend: 80, seats: 1, enabled: true },
            // Overpaying for chatgpt (1 seat, should be $20, paying $60)
            { name: 'chatgpt', plan: 'Team', monthlySpend: 60, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 2)
        expect(output.totalMonthlySavings).toBe(100) // $60 + $40
        expect(output.totalAnnualSavings).toBe(1200)
    })

    it('returns savingsLevel high when total savings > $500', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Teams', monthlySpend: 800, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 1)
        expect(output.savingsLevel).toBe('high')
    })

    it('returns savingsLevel optimal when no savings found', () => {
        const tools: AuditInput[] = [
            // Paying exactly the right amount
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 1)
        expect(output.savingsLevel).toBe('optimal')
    })

    it('returns "You are on the right plan" reason for optimal cursor spend', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 1)
        const cursorResult = output.results.find(r => r.tool === 'Cursor')
        expect(cursorResult?.reason).toMatch(/right plan/i)
    })

    it('passes through unknown tools without crashing', () => {
        const tools: AuditInput[] = [
            { name: 'some-unknown-tool', plan: 'Pro', monthlySpend: 99, seats: 2, enabled: true },
        ]
        const output = runAudit(tools, 'research', 2)
        expect(output.results).toHaveLength(1)
        expect(output.results[0].monthlySavings).toBe(0)
        expect(output.results[0].status).toBe('optimal')
    })

    it('calculates spendPerDev correctly', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 60, seats: 3, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 3)
        expect(output.spendPerDev).toBe(20) // $60 / 3 devs
    })

    it('spendPerDev is 0 when teamSize is 0', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 60, seats: 3, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 0)
        expect(output.spendPerDev).toBe(0)
    })

    it('surfaces alternatives when Cursor + Copilot both enabled', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
            { name: 'github copilot', plan: 'Individual', monthlySpend: 10, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 1)
        expect(output.alternatives.length).toBeGreaterThan(0)
    })

    it('totalCurrentSpend reflects only enabled tools', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 100, seats: 1, enabled: true },
            { name: 'chatgpt', plan: 'Plus', monthlySpend: 200, seats: 1, enabled: false },
        ]
        const output = runAudit(tools, 'coding', 1)
        expect(output.totalCurrentSpend).toBe(100)
    })
})

// ─────────────────────────────────────────────
// SECTION 5 — edge cases / boundary conditions
// ─────────────────────────────────────────────

describe('Edge cases', () => {
    it('handles empty tools array without crashing', () => {
        const output = runAudit([], 'coding', 5)
        expect(output.results).toHaveLength(0)
        expect(output.totalMonthlySavings).toBe(0)
        expect(output.totalAnnualSavings).toBe(0)
        expect(output.savingsLevel).toBe('optimal')
    })

    it('handles all tools disabled', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 100, seats: 1, enabled: false },
            { name: 'claude', plan: 'Team', monthlySpend: 200, seats: 3, enabled: false },
        ]
        const output = runAudit(tools, 'mixed', 3)
        expect(output.results).toHaveLength(0)
        expect(output.totalCurrentSpend).toBe(0)
    })

    it('audit result has all required fields for each tool', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 1)
        const r = output.results[0]
        expect(r).toHaveProperty('tool')
        expect(r).toHaveProperty('currentPlan')
        expect(r).toHaveProperty('currentSpend')
        expect(r).toHaveProperty('recommendedPlan')
        expect(r).toHaveProperty('recommendedSpend')
        expect(r).toHaveProperty('monthlySavings')
        expect(r).toHaveProperty('annualSavings')
        expect(r).toHaveProperty('reason')
        expect(r).toHaveProperty('status')
    })

    it('annualSavings is always 12x monthlySavings in results', () => {
        const tools: AuditInput[] = [
            { name: 'cursor', plan: 'Teams', monthlySpend: 200, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 1)
        const r = output.results[0]
        expect(r.annualSavings).toBe(r.monthlySavings * 12)
    })

    it('monthlySavings is never negative in any result', () => {
        const tools: AuditInput[] = [
            // Paying less than recommended price
            { name: 'cursor', plan: 'Pro', monthlySpend: 5, seats: 1, enabled: true },
        ]
        const output = runAudit(tools, 'coding', 1)
        output.results.forEach(r => {
            expect(r.monthlySavings).toBeGreaterThanOrEqual(0)
        })
    })
})

// ─────────────────────────────────────────────
// SECTION 6 — summaryService fallback (mocked LangChain)
// ─────────────────────────────────────────────

// Mock the entire LangChain module so the constructor never runs
vi.mock('@langchain/google-genai', () => {
    const mockInvoke = vi.fn().mockRejectedValue(new Error('Simulated Gemini API failure'))
    const mockWithStructuredOutput = vi.fn().mockReturnValue({ invoke: mockInvoke })

    class ChatGoogleGenerativeAI {
        withStructuredOutput = mockWithStructuredOutput
        constructor(_config: unknown) { }
    }

    return { ChatGoogleGenerativeAI }
})
describe('generateSummary fallback', () => {
    it('fallback returns correct shape when Gemini fails', async () => {
        const { generateSummary } = await import('../services/summaryService.js')

        const input = {
            auditId: 'test-id',
            totalMonthlySpend: 300,
            totalSavings: 120,
            flaggedTools: ['Cursor', 'ChatGPT'],
            useCase: 'coding',
            teamSize: 5,
        }

        const result = await generateSummary(input)

        expect(result).toHaveProperty('summary')
        expect(result).toHaveProperty('topRecommendation')
        expect(result).toHaveProperty('urgencyLevel')
        expect(['high', 'medium', 'low']).toContain(result.urgencyLevel)
    })

    it('fallback urgencyLevel is high when savings > 500', async () => {
        const { generateSummary } = await import('../services/summaryService.js')

        const result = await generateSummary({
            auditId: 'test-id-2',
            totalMonthlySpend: 2000,
            totalSavings: 800,
            flaggedTools: ['Claude', 'Cursor', 'ChatGPT'],
            useCase: 'mixed',
            teamSize: 10,
        })

        expect(result.urgencyLevel).toBe('high')
    })

    it('fallback urgencyLevel is low when savings <= 100', async () => {
        const { generateSummary } = await import('../services/summaryService.js')

        const result = await generateSummary({
            auditId: 'test-id-3',
            totalMonthlySpend: 60,
            totalSavings: 40,
            flaggedTools: ['Cursor'],
            useCase: 'coding',
            teamSize: 2,
        })

        expect(result.urgencyLevel).toBe('low')
    })
})