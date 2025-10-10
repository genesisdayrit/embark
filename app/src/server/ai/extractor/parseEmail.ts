import { regexExtract } from "./regex"
import { preClean } from "./clean"
import { vercelExtract } from "./adapters/vercel"
import { detectMerchantHeuristic } from "./merchant"

export async function parseEmail(emailText: string, ctx?: { subject?: string | null; fromEmail?: string | null }) {

    const { cleaned, candidateLinks } = preClean(emailText)

    const regexResult = regexExtract(emailText)

    if (regexResult) {
        let merchant = detectMerchantHeuristic({ subject: ctx?.subject ?? null, fromEmail: ctx?.fromEmail ?? null, body: emailText, links: candidateLinks})
        if (!merchant) {
            const fill = await vercelExtract(emailText)
            merchant = fill.merchant ?? null
        }
        return { ...regexResult, merchant, path_used: merchant ? 'regex+ai' : 'regex' }
    }

    const aiResult = await vercelExtract(emailText)

    return { ...aiResult, path_used: "ai" }
}