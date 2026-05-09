import {
    calcMonthlySavings,
    calcAnnualSavings,
    getAuditStatus
} from '../helpers/savingsCalculator.js'
import { pricingData } from '../../data/pricing.js'

import type { AuditInput, AuditResult } from '../../types/audit.js'

export const planRules: Record<string, (input: AuditInput) => AuditResult> = {

    cursor: (input) => {
        const { seats, monthlySpend, plan } = input

        // recommended plan based on seat count
        let recommendedPlan = ''
        let recommendedPrice = 0

        if (seats === 1) {
            recommendedPlan = 'Pro'
            recommendedPrice = pricingData.cursor.pro.monthlyPrice ?? 20
        } else if (seats <= 10) {
            recommendedPlan = 'Pro (per seat)'
            recommendedPrice = (pricingData.cursor.pro.monthlyPrice ?? 20) * seats
        } else {
            recommendedPlan = 'Teams'
            recommendedPrice = (pricingData.cursor.teams.monthlyPrice ?? 40) * seats
        }

        // if user paying way more than official price
        const monthlySavings = calcMonthlySavings(monthlySpend, recommendedPrice)
        const annualSavings = calcAnnualSavings(monthlySavings)
        const status = getAuditStatus(monthlySavings)

        return {
            tool: 'Cursor',
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedPlan,
            recommendedSpend: recommendedPrice,
            monthlySavings,
            annualSavings,
            reason: monthlySavings > 0
                ? `With ${seats} seat(s), ${recommendedPlan} at $${recommendedPrice}/mo fits your usage better than ${plan}.`
                : `You are on the right plan for your team size.`,
            status,
            confidence: 'high'
        }
    },

    claude: (input) => {
        const { seats, monthlySpend, plan } = input

        let recommendedPlan = ''
        let recommendedPrice = 0

        if (seats === 1) {
            recommendedPlan = 'Pro'
            recommendedPrice = pricingData.claude.pro.monthlyPrice ?? 20
        } else {
            recommendedPlan = 'Team'
            recommendedPrice = (pricingData.claude.team.monthlyPrice ?? 25) * seats
        }

        const monthlySavings = calcMonthlySavings(monthlySpend, recommendedPrice)
        const annualSavings = calcAnnualSavings(monthlySavings)
        const status = getAuditStatus(monthlySavings)

        return {
            tool: 'Claude',
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedPlan,
            recommendedSpend: recommendedPrice,
            monthlySavings,
            annualSavings,
            reason: seats === 1
                ? `Single user on ${plan}. Pro at $${pricingData.claude.pro.monthlyPrice ?? 20}/mo covers most individual usage.`
                : `${seats} seats on Team plan = $${recommendedPrice}/mo which is the right fit.`,
            status,
            confidence: 'high'
        }
    },

    githubCopilot: (input) => {
        const { seats, monthlySpend, plan } = input

        let recommendedPlan = ''
        let recommendedPrice = 0

        if (seats === 1) {
            recommendedPlan = 'Pro'
            recommendedPrice = pricingData.githubCopilot.pro.monthlyPrice ?? 10
        } else if (seats < 20) {
            recommendedPlan = 'Business'
            recommendedPrice = (pricingData.githubCopilot.business.monthlyPrice ?? 19) * seats
        } else {
            recommendedPlan = 'Enterprise'
            recommendedPrice = (pricingData.githubCopilot.enterprise.monthlyPrice ?? 39) * seats
        }

        const monthlySavings = calcMonthlySavings(monthlySpend, recommendedPrice)
        const annualSavings = calcAnnualSavings(monthlySavings)
        const status = getAuditStatus(monthlySavings)

        return {
            tool: 'GitHub Copilot',
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedPlan,
            recommendedSpend: recommendedPrice,
            monthlySavings,
            annualSavings,
            reason: `${seats} seat(s) fits ${recommendedPlan} at $${recommendedPrice}/mo.`,
            status,
            confidence: 'high'
        }
    },

    chatgpt: (input) => {
        const { seats, monthlySpend, plan } = input

        let recommendedPlan = ''
        let recommendedPrice = 0

        if (seats === 1) {
            recommendedPlan = 'Plus'
            recommendedPrice = pricingData.chatgpt.plus.monthlyPrice ?? 20
        } else {
            recommendedPlan = 'Business'
            recommendedPrice = (pricingData.chatgpt.business.monthlyPrice ?? 30) * seats
        }

        const monthlySavings = calcMonthlySavings(monthlySpend, recommendedPrice)
        const annualSavings = calcAnnualSavings(monthlySavings)
        const status = getAuditStatus(monthlySavings)

        return {
            tool: 'ChatGPT',
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedPlan,
            recommendedSpend: recommendedPrice,
            monthlySavings,
            annualSavings,
            reason: seats === 1
                ? `Single user. Plus at $${pricingData.chatgpt.plus.monthlyPrice ?? 20}/mo is the right tier.`
                : `${seats} seats. Business at $${pricingData.chatgpt.business.monthlyPrice ?? 30}/seat = $${recommendedPrice}/mo.`,
            status,
            confidence: 'high'
        }
    },

    windsurf: (input) => {
        const { seats, monthlySpend, plan } = input

        let recommendedPlan = ''
        let recommendedPrice = 0

        if (seats === 1) {
            recommendedPlan = 'Pro'
            recommendedPrice = pricingData.windsurf.pro.monthlyPrice ?? 20
        } else {
            recommendedPlan = 'Teams'
            recommendedPrice = (pricingData.windsurf.teams.monthlyPrice ?? 40) * seats
        }

        const monthlySavings = calcMonthlySavings(monthlySpend, recommendedPrice)
        const annualSavings = calcAnnualSavings(monthlySavings)
        const status = getAuditStatus(monthlySavings)

        return {
            tool: 'Windsurf',
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedPlan,
            recommendedSpend: recommendedPrice,
            monthlySavings,
            annualSavings,
            reason: `${seats} seat(s) on ${recommendedPlan} = $${recommendedPrice}/mo.`,
            status,
            confidence: 'high'
        }
    },
}