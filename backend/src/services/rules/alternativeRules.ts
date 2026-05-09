import type { AuditInput } from "../../types/audit.js"

export const checkAlternatives = (tools: AuditInput[], useCase: string) => {
    const suggestions: string[] = []
    const enabledNames = tools
        .filter(t => t.enabled)
        .map(t => t.name.toLowerCase())

    // Cursor + Copilot overlap
    if (enabledNames.includes('cursor') && enabledNames.includes('github copilot')) {
        suggestions.push(
            'You are paying for both Cursor and GitHub Copilot. They overlap significantly for coding. Consider dropping GitHub Copilot — Cursor Pro includes similar functionality.'
        )
    }

    // Claude + ChatGPT overlap for writing
    if (
        enabledNames.includes('claude') &&
        enabledNames.includes('chatgpt') &&
        useCase.toLowerCase() === 'writing'
    ) {
        suggestions.push(
            'For writing use cases, Claude and ChatGPT heavily overlap. Most teams pick one. Claude Pro at $20/mo vs ChatGPT Plus at $20/mo — try Claude and drop ChatGPT.'
        )
    }

    // API direct cheaper than subscription
    if (enabledNames.includes('anthropic api') && enabledNames.includes('claude')) {
        suggestions.push(
            'You are paying for Claude subscription AND Anthropic API. If your team is technical, API-only may be cheaper depending on usage volume.'
        )
    }

    return suggestions
}