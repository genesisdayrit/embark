const sampleKnownMerchants = new Map([ ['amazon', 'Amazon'], ['nike', 'Nike'], ['etsy', 'Etsy'] ]);


export function detectMerchantHeuristic({ subject, fromEmail, body }: { subject?: string | null; fromEmail?: string | null; body: string; links: string[] | null}): string | null {
    const text = (str?: string | null) => (str ?? "").toLowerCase()


    // added a tester for domain, subject, and body to ensure the correct merchant is selected (in cases of a merchant within a merchant (like a nike item from amazon))
    const senderDomain = text(fromEmail?.split("@")[1])
    for (const [key, val] of sampleKnownMerchants) {
        if (senderDomain.includes(key)) return val
    }

    for (const [key, val] of sampleKnownMerchants) {
        if (text(subject).includes(key)) return val
    }

    for (const [key, val] of sampleKnownMerchants) {
        if (text(body).includes(`from ${key}`) || text(body).includes(`sold by ${key}`)) return val
    }

    return null
}