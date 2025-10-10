import { orders } from "@/db/schema"
import { communications } from "@/db/schema"
import { db } from "../../db/index"
import type { NormalizedMessage, ParsedEmail, ShipmentDTO } from "../Types"
import { and, eq, sql } from "drizzle-orm"
import crypto from "node:crypto"

type saveCtx = NormalizedMessage & { parsed: ParsedEmail }

export async function saveShipment(shipmentContext: saveCtx): Promise<ShipmentDTO> {
  const { userId, parsed } = shipmentContext;
  const trackingNumbers = [...new Set((parsed.tracking_numbers ?? []).map(t => t.trim()).filter(Boolean))]

  const trackingUrls = [...new Set((parsed.tracking_urls ?? []).map(u => u.trim()).filter(Boolean))]
  const tracking = trackingNumbers[0]
  if (!tracking) throw new Error("no_tracking_number")

  return db.transaction(async (transaction) => {

    const existingOrder = await transaction
      .select()
      .from(orders)
      .where(and(
        eq(orders.userId, userId),
        sql`${orders.trackingNumbers} @> ARRAY[${tracking}]`
      ))
      .limit(1)


    let orderRow;
    if (existingOrder.length) {
      const updates: any = {
        trackingNumbers: trackingNumbers,
        trackingUrls: trackingUrls,
        estimatedDeliveryDate: parsed.estimated_delivery ? new Date(parsed.estimated_delivery) : null,
        updatedAt: new Date(),
        lastCommunicationAt: new Date()
      }
      if (parsed.merchant) updates.merchant = parsed.merchant;
      if (parsed.merchant_order_no) updates.merchantOrderNo = parsed.merchant_order_no
      if (shipmentContext.merchantImageUrl) updates.merchantImageUrl = shipmentContext.merchantImageUrl

      const updated = await transaction.update(orders).set(updates)
      .where(eq(orders.id, existingOrder[0].id))
      .returning();
      orderRow = updated[0];
    } else {
      const inserted = await transaction.insert(orders).values({
        userId,
        orderDate: new Date(),
        trackingNumbers: trackingNumbers,
        trackingUrls: trackingUrls,
        estimatedDeliveryDate: parsed.estimated_delivery ? new Date(parsed.estimated_delivery) : null,
        lastCommunicationAt: new Date(),
        merchant: parsed.merchant ?? null,
        merchantOrderNo: parsed.merchant_order_no ?? null,
        merchantImageUrl: shipmentContext.merchantImageUrl ?? null
      }).returning();
      orderRow = inserted[0];
    }

    const contentHash = crypto.createHash("md5").update(shipmentContext.rawText).digest("hex")

    const existingComm = await transaction
    .select({ id: communications.id })
    .from(communications)
    .where(and(
        eq(communications.userId, shipmentContext.userId),
        sql`md5(${communications.content}) = ${contentHash}`
    ))
    .limit(1)

    let commId = existingComm[0]?.id
    if (!commId) {
        const inserted = await transaction.insert(communications).values({
            userId: shipmentContext.userId,
            communicationType: "email",
            subject: shipmentContext.subject ?? null,
            content: shipmentContext.rawText,
            fromEmail: shipmentContext.fromEmail ?? null,
            isOrderCommunication: !!parsed.is_shipping_email,
            isAvailableOrderId: !!parsed.order_id,
            carrier: parsed.carrier,
            purchasedFrom: parsed.merchant ?? null,
            isShippingEmail: !!parsed.is_shipping_email,
            isDeliveryEmail: !!parsed.is_delivery_email,
            trackingNumbers: trackingNumbers,
            trackingUrls: trackingUrls,
        }).returning({ id: communications.id });
        commId = inserted[0].id
    }

    if (commId) {
    await transaction.update(communications)
    .set({ relatedOrderIds: [orderRow.id] })
    .where(eq(communications.id, commId))        
    }


    const dto: ShipmentDTO = {
      orderId: orderRow.id,
      carrier: parsed.carrier,
      trackingNumbers: trackingNumbers,
      trackingUrls: trackingUrls,
      merchant: orderRow.merchant ?? parsed.merchant ?? null,
      merchantImageUrl: orderRow.merchantImageUrl ?? null,
      estimatedDelivery: parsed.estimated_delivery ?? null,
      lastCommunicationAt: new Date().toISOString()
      
    };

    return dto;
  })
}