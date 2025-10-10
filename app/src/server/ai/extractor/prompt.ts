export function buildPrompt(emailText: string): string {
    return [
    "SYSTEM: You are a strict extractor. JSON only.",
    "RULES: ISO dates, verbatim tracking numbers, normalize carrier enum.",
    "SCHEMA KEYS: is_shipping_email, carrier, tracking_numbers, ...",
    "BEGIN_EMAIL",
    emailText,
    "END_EMAIL"
  ].join("\n");
}