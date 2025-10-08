import { parseEmail } from "./ai/extractor/parseEmail";
import { saveShipment } from "./shipments/saveShipments";
import type { NormalizedMessage, ParsedEmail } from "./Types";

function toParsedEmail(x: any): ParsedEmail {
  return {
    is_shipping_email: x.is_shipping_email ?? true,
    is_delivery_email: x.is_delivery_email ?? false,
    carrier: x.carrier as ParsedEmail["carrier"],
    tracking_numbers: x.tracking_numbers ?? [],
    tracking_urls: x.tracking_urls ?? [],
    merchant: x.merchant ?? null,
    order_id: x.order_id ?? null,
    estimated_delivery: x.estimated_delivery ?? null,
    confidence: x.confidence ?? "medium",
    schema_version: x.schema_version ?? "1.0.0",
  };
}

export async function processEmail(normalized: NormalizedMessage) {
  const raw = await parseEmail(normalized.rawText, {
    subject: normalized.subject,
    fromEmail: normalized.fromEmail
  })
  const parsed = toParsedEmail(raw)
  return await saveShipment({ ...normalized, parsed })
}