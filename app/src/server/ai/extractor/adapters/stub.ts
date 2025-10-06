export function stubExtract() {
  return {
    is_shipping_email: true,
    carrier: "UPS",
    tracking_numbers: ["1Z12345E0205271688"],
    tracking_urls: ["https://wwwapps.ups.com/WebTracking?track=yes&trackNums=1Z12345E0205271688"],
    merchant: "Acme Store",
    order_id: "ACME-58931",
    estimated_delivery: "2025-10-09",
    is_delivery_email: false,
    confidence: "high",
    evidence: { carrier: "UPS", tracking: "1Z12345E0205271688", eta: "Oct 9" },
    schema_version: "1.0.0"
  };
}