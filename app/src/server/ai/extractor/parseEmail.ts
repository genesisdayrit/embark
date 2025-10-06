import { regexExtract } from "./regex"
import { callAIExtract } from "./index"

export async function parseEmail(emailText: string) {
    const regexResult = regexExtract(emailText)

    if (regexResult) {
        return { ...regexResult, path_used: "regex" }
    }

    const aiResult = await callAIExtract(emailText)

    return { ...aiResult, path_used: "ai" }
}