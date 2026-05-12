export const calcMonthlySavings = (
    currentSpend: number,
    recommendedSpend: number
): number => {
    return Math.max(0, currentSpend - recommendedSpend)
}

export const calcAnnualSavings = (monthlySavings: number): number => {
    return monthlySavings * 12
}

export const calcExpectedSpend = (
    pricePerSeat: number,
    seats: number
): number => {
    return pricePerSeat * seats
}

export const calcOverpayAmount = (
    monthlySpend: number,
    officialPricePerSeat: number,
    seats: number
): number => {
    const expected = calcExpectedSpend(officialPricePerSeat, seats)
    return Math.max(0, monthlySpend - expected)
}

export const calcSpendPerDev = (
    totalSpend: number,
    teamSize: number
): number => {
    if (teamSize === 0) return 0
    return parseFloat((totalSpend / teamSize).toFixed(2))
}

export const calcTotalSpend = (
    tools: { enabled: boolean; monthlySpend: number }[]
): number => {
    return tools
        .filter(t => t.enabled)
        .reduce((sum, t) => sum + t.monthlySpend, 0)
}

export const getSavingsLevel = (
    monthlySavings: number
): 'high' | 'medium' | 'low' | 'optimal' => {
    if (monthlySavings > 500) return 'high'
    if (monthlySavings > 100) return 'medium'
    if (monthlySavings > 0) return 'low'
    return 'optimal'
}

export const getAuditStatus = (
    monthlySavings: number
): 'overspending' | 'review' | 'optimal' => {
    if (monthlySavings > 50) return 'overspending'
    if (monthlySavings > 0) return 'review'
    return 'optimal'
}

export const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`
}