import { z } from "zod";
export const ExtractionSchema = z.object({
  is_shipping_email: z.boolean(),
  carrier: z.enum(["UPS","USPS","FedEx","DHL","Other","Unknown"]),
  tracking_numbers: z.array(z.string()).default([]),
  tracking_urls: z.array(z.string()).default([]),
  merchant: z.string().nullable().optional(),
  merchant_order_no: z.string().nullable().optional(),
  order_id: z.string().nullable().optional(),
  estimated_delivery: z.string().nullable().optional(),
  is_delivery_email: z.boolean().optional(),
  confidence: z.enum(["high","medium","low"]).optional(),
  evidence: z.record(z.string(), z.string()).optional(),
  schema_version: z.string()
});