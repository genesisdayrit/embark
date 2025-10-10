import { ExtractionSchema } from "./tempSchema";
import { stubExtract } from "./adapters/stub";
import { vercelExtract } from "./adapters/vercel"

export async function callAIExtract(emailText: string) {
  if (!emailText?.trim()) throw new Error("emailText required");
  const model = (process.env.EXTRACTOR_MODEL ?? "stub").toLowerCase();

  const raw =
    model === "vercel"
      ? await vercelExtract(emailText)
      : stubExtract();

  const parsed = ExtractionSchema.safeParse(raw);
  if (!parsed.success) throw new Error("extract/validation_failed");
  return parsed.data;
}