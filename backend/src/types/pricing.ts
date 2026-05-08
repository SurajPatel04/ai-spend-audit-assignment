export type PricingType =
    | 'individual'
    | 'team'
    | 'enterprise'
    | 'usage-based'
    | 'premium'

export interface PricingPlan {
    monthlyPrice?: number | null
    annualMonthlyPrice?: number | null

    inputPerMillion?: number
    outputPerMillion?: number

    type: PricingType

    source: string

    verifiedAt: string
}