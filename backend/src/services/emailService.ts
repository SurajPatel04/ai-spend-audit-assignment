import { Resend } from 'resend'
import type { SendAuditEmailParams } from '../types/email.js'

const resend = new Resend(process.env["RESEND_API_KEY"])

export const sendAuditEmail = async ({
    email,
    auditId,
    totalMonthlySavings,
    totalAnnualSavings,
    results,
    savingsLevel,
}: SendAuditEmailParams) => {

    const reportUrl = `${process.env["FRONTEND_URL"]}/audit/${auditId}`

    // build per-tool recommendations list
    const recommendationRows = results
        .map(r => {
            if (r.status === 'optimal') {
                return `
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #1e293b;">
                        <span style="color: #94a3b8;">${r.tool}</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #22c55e;">
                        ✅ Already optimized
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8;">
                        $0/mo
                    </td>
                </tr>`
            }
            return `
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #1e293b;">
                    <span style="color: #e2e8f0;">${r.tool}</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #e2e8f0;">
                    Switch from <strong>${r.currentPlan}</strong> → <strong>${r.recommendedPlan}</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #22c55e;">
                    Save $${r.monthlySavings}/mo
                </td>
            </tr>`
        })
        .join('')

    // credex banner — only for high savings
    const credexBanner = savingsLevel === 'high' ? `
        <div style="background: #14532d; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="color: #22c55e; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">
                💡 A Credex consultant will reach out within 24 hours
            </p>
            <p style="color: #86efac; margin: 0;">
                Teams saving this much typically recover costs within the first month 
                using Credex discounted AI credits.
            </p>
        </div>` : ''

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your AI Spend Audit Report</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">
                    Your AI Spend Audit Report
                </h1>
                <p style="color: #94a3b8; margin: 0;">
                    Here's what we found in your AI tool stack
                </p>
            </div>

            <!-- Hero Savings -->
            <div style="background: #0f2a1a; border: 1px solid #22c55e; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px;">
                <p style="color: #86efac; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
                    Total Monthly Savings Found
                </p>
                <h2 style="color: #22c55e; font-size: 48px; font-weight: bold; margin: 0 0 8px 0;">
                    $${totalMonthlySavings}/mo
                </h2>
                <p style="color: #86efac; font-size: 16px; margin: 0;">
                    📅 That's $${totalAnnualSavings.toLocaleString()} saved annually
                </p>
            </div>

            ${credexBanner}

            <!-- Recommendations Table -->
            <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 16px;">
                    Your Recommendations
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; color: #64748b; font-size: 12px; padding-bottom: 8px; text-transform: uppercase;">Tool</th>
                            <th style="text-align: left; color: #64748b; font-size: 12px; padding-bottom: 8px; text-transform: uppercase;">Action</th>
                            <th style="text-align: left; color: #64748b; font-size: 12px; padding-bottom: 8px; text-transform: uppercase;">Savings</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recommendationRows}
                    </tbody>
                </table>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${reportUrl}" 
                   style="background: #22c55e; color: #000000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                    View Your Full Report →
                </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 24px;">
                <p style="color: #475569; font-size: 12px; margin: 0;">
                    Sent by <a href="https://credex.rocks" style="color: #22c55e;">Credex</a> · 
                    Discounted AI infrastructure credits
                </p>
            </div>

        </div>
    </body>
    </html>`

    await resend.emails.send({
        from: 'AI Spend Audit <onboarding@resend.dev>',
        to: email,
        subject: 'Your AI Spend Audit Report',
        html,
    })
}
