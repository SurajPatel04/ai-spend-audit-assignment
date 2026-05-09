// backend/src/services/helpers/savingsCalculator.ts

// calculate monthly savings
export const calcMonthlySavings = (
    currentSpend: number,
    recommendedSpend: number
): number => {
    return Math.max(0, currentSpend - recommendedSpend)
}

// calculate annual savings from monthly
export const calcAnnualSavings = (monthlySavings: number): number => {
    return monthlySavings * 12
}

// calculate expected spend based on official price per seat
export const calcExpectedSpend = (
    pricePerSeat: number,
    seats: number
): number => {
    return pricePerSeat * seats
}

// calculate if user is overpaying vs official price
export const calcOverpayAmount = (
    monthlySpend: number,
    officialPricePerSeat: number,
    seats: number
): number => {
    const expected = calcExpectedSpend(officialPricePerSeat, seats)
    return Math.max(0, monthlySpend - expected)
}

// calculate spend per developer
export const calcSpendPerDev = (
    totalSpend: number,
    teamSize: number
): number => {
    if (teamSize === 0) return 0
    return parseFloat((totalSpend / teamSize).toFixed(2))
}

// calculate total spend across all enabled tools
export const calcTotalSpend = (
    tools: { enabled: boolean; monthlySpend: number }[]
): number => {
    return tools
        .filter(t => t.enabled)
        .reduce((sum, t) => sum + t.monthlySpend, 0)
}

// determine savings level label
export const getSavingsLevel = (
    monthlySavings: number
): 'high' | 'medium' | 'low' | 'optimal' => {
    if (monthlySavings > 500) return 'high'
    if (monthlySavings > 100) return 'medium'
    if (monthlySavings > 0) return 'low'
    return 'optimal'
}

// determine audit status per tool
export const getAuditStatus = (
    monthlySavings: number
): 'overspending' | 'review' | 'optimal' => {
    if (monthlySavings > 50) return 'overspending'
    if (monthlySavings > 0) return 'review'
    return 'optimal'
}

// format number as currency string
export const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`
}