import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { ExtractionSchema } from '../tempSchema';
import { buildPrompt } from '../prompt';


export async function vercelExtract(emailText: string) {
    if (!emailText?.trim()) throw new Error("emailText required")

     const controller = new AbortController();

    const { object } = await generateObject({
        model: openai(process.env.EXTRACTOR_MODEL!),
        schema: ExtractionSchema,
        prompt: buildPrompt({ cleaned: emailText }),
        abortSignal: controller.signal
    });


    object.tracking_numbers = [...new Set(object.tracking_numbers ?? [])]
    object.tracking_urls = [...new Set(object.tracking_urls ?? [])]

    const validCarriers = ["UPS", "USPS", "FedEx", "DHL", "Other", "Unknown"] as const
    if (!validCarriers.includes(object.carrier)) object.carrier = "Unknown"

    const parsed = ExtractionSchema.safeParse(object)

    if (!parsed.success) throw new Error("extract/validation_failed")
        return parsed.data

 } 

