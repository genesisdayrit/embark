import { regexExtract } from "./regex"
import { callAIExtract } from "./index"
import { detectMerchantHeuristic } from "./merchant"

export async function parseEmail(emailText: string, ctx?: { subject?: string | null; fromEmail?: string | null }) {
    const regexResult = regexExtract(emailText)

    if (regexResult) {
        let merchant = detectMerchantHeuristic({ subject: ctx?.subject ?? null, fromEmail: ctx?.fromEmail ?? null, body: emailText})
        if (!merchant) {
            const fill = await callAIExtract(emailText)
            merchant = fill.merchant ?? null
        }
        return { ...regexResult, merchant, path_used: merchant ? 'regex+ai' : 'regex' }
    }

    const aiResult = await callAIExtract(emailText)

    return { ...aiResult, path_used: "ai" }
}