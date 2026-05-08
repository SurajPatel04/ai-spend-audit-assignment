import { PricingPlan } from '../types/pricing.js'

export const pricingData: Record<
    string,
    Record<string, PricingPlan>
> = {
    cursor: {
        hobby: {
            monthlyPrice: 0,
            type: 'individual',
            source: 'https://cursor.com/pricing',
            verifiedAt: '2026-05-08',
        },

        pro: {
            monthlyPrice: 20,
            annualMonthlyPrice: 16,
            type: 'individual',
            source: 'https://cursor.com/pricing',
            verifiedAt: '2026-05-08',
        },

        pro_plus: {
            monthlyPrice: 60,
            type: 'premium',
            source: 'https://cursor.com/pricing',
            verifiedAt: '2026-05-08',
        },

        ultra: {
            monthlyPrice: 200,
            type: 'premium',
            source: 'https://cursor.com/pricing',
            verifiedAt: '2026-05-08',
        },

        teams: {
            monthlyPrice: 40,
            type: 'team',
            source: 'https://cursor.com/pricing',
            verifiedAt: '2026-05-08',
        },

        enterprise: {
            monthlyPrice: null,
            type: 'enterprise',
            source: 'https://cursor.com/pricing',
            verifiedAt: '2026-05-08',
        },
    },

    githubCopilot: {
        free: {
            monthlyPrice: 0,
            type: 'individual',
            source: 'https://github.com/features/copilot/plans',
            verifiedAt: '2026-05-08',
        },

        pro: {
            monthlyPrice: 10,
            annualMonthlyPrice: 8.33,
            type: 'individual',
            source: 'https://github.com/features/copilot/plans',
            verifiedAt: '2026-05-08',
        },

        pro_plus: {
            monthlyPrice: 39,
            type: 'premium',
            source: 'https://github.com/features/copilot/plans',
            verifiedAt: '2026-05-08',
        },

        business: {
            monthlyPrice: 19,
            type: 'team',
            source:
                'https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises',
            verifiedAt: '2026-05-08',
        },

        enterprise: {
            monthlyPrice: 39,
            type: 'enterprise',
            source:
                'https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises',
            verifiedAt: '2026-05-08',
        },
    },

    claude: {
        free: {
            monthlyPrice: 0,
            type: 'individual',
            source: 'https://claude.ai/pricing',
            verifiedAt: '2026-05-08',
        },

        pro: {
            monthlyPrice: 20,
            type: 'individual',
            source: 'https://claude.ai/pricing',
            verifiedAt: '2026-05-08',
        },

        max_5x: {
            monthlyPrice: 100,
            type: 'premium',
            source: 'https://claude.ai/pricing',
            verifiedAt: '2026-05-08',
        },

        max_20x: {
            monthlyPrice: 200,
            type: 'premium',
            source: 'https://claude.ai/pricing',
            verifiedAt: '2026-05-08',
        },

        team: {
            monthlyPrice: 25,
            annualMonthlyPrice: 20,
            type: 'team',
            source: 'https://claude.ai/pricing',
            verifiedAt: '2026-05-08',
        },

        enterprise: {
            monthlyPrice: null,
            type: 'enterprise',
            source: 'https://claude.ai/pricing',
            verifiedAt: '2026-05-08',
        },
    },

    anthropicApi: {
        haiku_45: {
            inputPerMillion: 1,
            outputPerMillion: 5,
            type: 'usage-based',
            source: 'https://www.anthropic.com/pricing',
            verifiedAt: '2026-05-08',
        },

        sonnet_46: {
            inputPerMillion: 3,
            outputPerMillion: 15,
            type: 'usage-based',
            source: 'https://www.anthropic.com/pricing',
            verifiedAt: '2026-05-08',
        },

        opus_46: {
            inputPerMillion: 5,
            outputPerMillion: 25,
            type: 'usage-based',
            source: 'https://www.anthropic.com/pricing',
            verifiedAt: '2026-05-08',
        },
    },

    chatgpt: {
        free: {
            monthlyPrice: 0,
            type: 'individual',
            source: 'https://openai.com/pricing',
            verifiedAt: '2026-05-08',
        },

        go: {
            monthlyPrice: 8,
            type: 'individual',
            source: 'https://openai.com/pricing',
            verifiedAt: '2026-05-08',
        },

        plus: {
            monthlyPrice: 20,
            type: 'individual',
            source: 'https://openai.com/pricing',
            verifiedAt: '2026-05-08',
        },

        pro_100: {
            monthlyPrice: 100,
            type: 'premium',
            source: 'https://openai.com/pricing',
            verifiedAt: '2026-05-08',
        },

        pro_200: {
            monthlyPrice: 200,
            type: 'premium',
            source: 'https://openai.com/pricing',
            verifiedAt: '2026-05-08',
        },

        business: {
            monthlyPrice: 30,
            annualMonthlyPrice: 25,
            type: 'team',
            source:
                'https://help.openai.com/en/articles/8792828-what-is-chatgpt-team',
            verifiedAt: '2026-05-08',
        },

        enterprise: {
            monthlyPrice: null,
            type: 'enterprise',
            source: 'https://openai.com/pricing',
            verifiedAt: '2026-05-08',
        },
    },

    openaiApi: {
        gpt5_mini: {
            inputPerMillion: 0.25,
            outputPerMillion: 2,
            type: 'usage-based',
            source: 'https://platform.openai.com/docs/pricing',
            verifiedAt: '2026-05-08',
        },

        gpt5: {
            inputPerMillion: 1.25,
            outputPerMillion: 10,
            type: 'usage-based',
            source: 'https://platform.openai.com/docs/pricing',
            verifiedAt: '2026-05-08',
        },

        gpt55: {
            inputPerMillion: 5,
            outputPerMillion: 30,
            type: 'usage-based',
            source: 'https://platform.openai.com/docs/pricing',
            verifiedAt: '2026-05-08',
        },
    },

    gemini: {
        free: {
            monthlyPrice: 0,
            type: 'individual',
            source: 'https://one.google.com/about/google-ai-plans',
            verifiedAt: '2026-05-08',
        },

        ai_plus: {
            monthlyPrice: 7.99,
            type: 'individual',
            source: 'https://one.google.com/about/google-ai-plans',
            verifiedAt: '2026-05-08',
        },

        ai_pro: {
            monthlyPrice: 19.99,
            type: 'individual',
            source: 'https://one.google.com/about/google-ai-plans',
            verifiedAt: '2026-05-08',
        },

        ai_ultra: {
            monthlyPrice: 249.99,
            type: 'premium',
            source: 'https://one.google.com/about/google-ai-plans',
            verifiedAt: '2026-05-08',
        },
    },

    geminiApi: {
        flash_lite: {
            inputPerMillion: 0.1,
            outputPerMillion: 0.4,
            type: 'usage-based',
            source: 'https://ai.google.dev/pricing',
            verifiedAt: '2026-05-08',
        },

        gemini_25_pro: {
            inputPerMillion: 1.25,
            outputPerMillion: 10,
            type: 'usage-based',
            source: 'https://ai.google.dev/pricing',
            verifiedAt: '2026-05-08',
        },

        gemini_3_pro: {
            inputPerMillion: 2,
            outputPerMillion: 12,
            type: 'usage-based',
            source: 'https://ai.google.dev/pricing',
            verifiedAt: '2026-05-08',
        },
    },

    windsurf: {
        free: {
            monthlyPrice: 0,
            type: 'individual',
            source: 'https://windsurf.com/pricing',
            verifiedAt: '2026-05-08',
        },

        pro: {
            monthlyPrice: 20,
            type: 'individual',
            source: 'https://windsurf.com/pricing',
            verifiedAt: '2026-05-08',
        },

        max: {
            monthlyPrice: 200,
            type: 'premium',
            source: 'https://windsurf.com/pricing',
            verifiedAt: '2026-05-08',
        },

        teams: {
            monthlyPrice: 40,
            type: 'team',
            source: 'https://windsurf.com/pricing',
            verifiedAt: '2026-05-08',
        },

        enterprise: {
            monthlyPrice: null,
            type: 'enterprise',
            source: 'https://windsurf.com/pricing',
            verifiedAt: '2026-05-08',
        },
    },
}