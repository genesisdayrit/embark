// buildPrompt.ts
export type BuildPromptInput = {
  subject?: string;
  fromEmail?: string;
  cleaned: string;
  candidateLinks?: string[];
};

export function buildPrompt({
  subject,
  fromEmail,
  cleaned,
  candidateLinks,
}: BuildPromptInput): string {
  const subj = subject ?? "";
  const from = fromEmail ?? "";
  const links = (candidateLinks ?? []).filter(Boolean);
  const linksBlock =
    links.length > 0 ? `- ${links.join("\n- ")}` : "";

  return [

    // SYSTEM / ROLE

    "SYSTEM:",
    "You are a strict information extractor for shipment-related emails. Read like a careful human, but output like a deterministic machine.",
    "You will receive CONTEXT (subject, from, candidate links) followed by the normalized plain-text email body.",
    "You must return exactly one JSON object matching the schema below. No prose, no Markdown, no extra text.",
    "",


    // GOAL

    "GOAL:",
    "- Decide whether the email is an order-only notice (no tracking yet), a shipment confirmation, or a delivery notification.",
    "- Extract carrier, tracking numbers, tracking URLs, merchant, merchant order number, order_id (if clearly present), and estimated delivery date.",
    "- Prefer direct evidence in the body text and candidate links. Abstain safely when information is missing.",
    "- Detect merchants from explicit text, link domains, headers/footers/branding.",
    "- Handle alphanumeric tracking numbers from diverse carriers (e.g., DHL, UniUni).",
    "",


    // RULES

    "RULES:",
    "- Output exactly one JSON object and nothing else.",
    "- Values must be supported by evidence from the email body or candidate links. Never invent values.",
    "- If a value is not clearly present: set it to null (for nullable fields) or [] (for arrays).",
    "- Map carrier names to one of: UPS, USPS, FedEx, DHL; otherwise use Other if a non-enum carrier is clear, or Unknown if unclear.",
    "- Order-only emails (e.g., Amazon order confirmations with no tracking): set is_shipping_email=false, carrier='Unknown', tracking_numbers=[], tracking_urls=[], include merchant_order_no.",
    "- Tracking numbers: return verbatim from the email; do not reformat.",
    "- Tracking URLs: include only direct carrier/merchant tracking links. Ignore analytics/redirectors unless the unwrapped target is a valid tracking URL.",
    "- Dates: use ISO-8601 (YYYY-MM-DD or full timestamp). If only a relative date is given (e.g., 'Tuesday', 'tomorrow') and the absolute date is not implied by explicit context, set estimated_delivery=null.",
    "- Prefer merchant names from explicit text or recognizable link domains over personal sender names.",
    "- Include short 'evidence' key/value pairs indicating source locations such as 'subject', 'body', 'links', 'footer', or 'domain'.",
    "- Set confidence='high' when multiple explicit signals agree; 'medium' for partial but plausible evidence; 'low' when signals are weak.",
    "- schema_version must be '1.0.0'.",
    "",


    // SCHEMA (reference; your JSON MUST use exactly these keys)

    "SCHEMA:",
    "{",
    '  "is_shipping_email": boolean,',
    '  "carrier": "UPS" | "USPS" | "FedEx" | "DHL" | "Other" | "Unknown",',
    '  "tracking_numbers": string[],',
    '  "tracking_urls": string[],',
    '  "merchant": string | null,',
    '  "merchant_order_no": string | null,',
    '  "order_id": string | null,',
    '  "estimated_delivery": string | null,',
    '  "is_delivery_email": boolean,',
    '  "confidence": "high" | "medium" | "low",',
    '  "evidence": { [key: string]: string },',
    '  "schema_version": "1.0.0"',
    "}",
    "",


    // FEW-SHOT EXAMPLES

    "EXAMPLES:",

    "Example 1 (order-only; no tracking yet):",
    'EMAIL: "Thanks for your purchase! Order #111-3128486-6365010. We’ll email tracking soon."',
    "OUTPUT:",
    "{",
    '  "is_shipping_email": false,',
    '  "carrier": "Unknown",',
    '  "tracking_numbers": [],',
    '  "tracking_urls": [],',
    '  "merchant": "Amazon",',
    '  "merchant_order_no": "111-3128486-6365010",',
    '  "order_id": null,',
    '  "estimated_delivery": null,',
    '  "is_delivery_email": false,',
    '  "confidence": "medium",',
    '  "evidence": { "merchant_order_no": "body", "merchant": "body" },',
    '  "schema_version": "1.0.0"',
    "}",
    "",


    "Example 2 (shipment with tracking; FedEx):",
    'EMAIL: "Your order from Only NY has shipped via FedEx. Tracking number: 9234690384790700185076."',
    "OUTPUT:",
    "{",
    '  "is_shipping_email": true,',
    '  "carrier": "FedEx",',
    '  "tracking_numbers": ["9234690384790700185076"],',
    '  "tracking_urls": [],',
    '  "merchant": "Only NY",',
    '  "merchant_order_no": null,',
    '  "order_id": null,',
    '  "estimated_delivery": null,',
    '  "is_delivery_email": false,',
    '  "confidence": "high",',
    '  "evidence": { "carrier": "body", "tracking_numbers": "body", "merchant": "body" },',
    '  "schema_version": "1.0.0"',
    "}",
    "",


    "Example 3 (merchant tracking page link):",
    'EMAIL: "Track your package here: https://www.zalando.com/track?order=Z123456"',
    "OUTPUT:",
    "{",
    '  "is_shipping_email": true,',
    '  "carrier": "Other",',
    '  "tracking_numbers": [],',
    '  "tracking_urls": ["https://www.zalando.com/track?order=Z123456"],',
    '  "merchant": "Zalando",',
    '  "merchant_order_no": "Z123456",',
    '  "order_id": null,',
    '  "estimated_delivery": null,',
    '  "is_delivery_email": false,',
    '  "confidence": "medium",',
    '  "evidence": { "tracking_urls": "links", "merchant": "links" },',
    '  "schema_version": "1.0.0"',
    "}",
    "",


    // CONTEXT (appears before the email)

    "CONTEXT",
    `Subject: ${subj}`,
    `From: ${from}`,
    "Candidate links:",
    linksBlock,
    "",


    // EMAIL BODY

    "BEGIN_EMAIL",
    cleaned ?? "",
    "END_EMAIL",
  ]
    .filter((line, idx, arr) => {
      // collapse accidental double newlines from empty linksBlock while preserving section spacing
      if (line === "" && arr[idx - 1] === "") return false;
      return true;
    })
    .join("\n");
}