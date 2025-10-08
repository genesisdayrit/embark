
export type NormalizedMessage = {
  emailId: string;
  userId: string;
  rawText: string;
  subject?: string | null;
  fromEmail?: string | null
  receivedAt?: string | null; 
  threadId?: string | null;
};


export type ParsedEmail = {
  is_shipping_email: boolean;
  is_delivery_email?: boolean;
  carrier: "UPS"|"USPS"|"FedEx"|"DHL"|"Other"|"Unknown";
  tracking_numbers: string[];
  tracking_urls: string[];
  merchant?: string | null;
  order_id?: string | null;
  estimated_delivery?: string | null; // ISO date (YYYY-MM-DD) or null
  confidence?: "high"|"medium"|"low";
  schema_version: string;
};


export type ShipmentDTO = {
  orderId: string;
  carrier: string;
  trackingNumbers: string[];
  trackingUrls: string[];
  merchant: string | null;
  estimatedDelivery: string | null;
  latestStatus?: { timestamp: string; status: string; location?: string | null } | null; // if/when you add events
  lastCommunicationAt?: string | null;
};