import { orders } from "@/db/schema"
import { communications } from "@/db/schema"
import { db } from "../../db/index"
import type { NormalizedMessage, ParsedEmail, ShipmentDTO } from "../Types"
import { and, eq, sql } from "drizzle-orm"
import crypto from "node:crypto"

type saveCtx = NormalizedMessage & { parsed: ParsedEmail }

export async function saveShipment(ctx: saveCtx): Promise<ShipmentDTO> {
  const { userId, parsed } = ctx;
  const tn = [...new Set((parsed.tracking_numbers ?? []).map(t => t.trim()).filter(Boolean))]
  const tu = [...new Set((parsed.tracking_urls ?? []).map(u => u.trim()).filter(Boolean))]
  const tracking = tn[0]
  if (!tracking) throw new Error("no_tracking_number")

  return db.transaction(async (tx) => {

    const existingOrder = await tx
      .select()
      .from(orders)
      .where(and(
        eq(orders.userId, userId),
        sql`${orders.trackingNumbers} @> ARRAY[${tracking}]`
      ))
      .limit(1)


    let orderRow;
    if (existingOrder.length) {
      const updated = await tx.update(orders).set({
        trackingNumbers: tn,
        trackingUrls: tu,
        estimatedDeliveryDate: parsed.estimated_delivery ? new Date(parsed.estimated_delivery) : null,
        updatedAt: new Date(),
        lastCommunicationAt: new Date()
      })
      .where(eq(orders.id, existingOrder[0].id))
      .returning();
      orderRow = updated[0];
    } else {
      const inserted = await tx.insert(orders).values({
        userId,
        orderDate: new Date(),
        trackingNumbers: tn,
        trackingUrls: tu,
        estimatedDeliveryDate: parsed.estimated_delivery ? new Date(parsed.estimated_delivery) : null,
        lastCommunicationAt: new Date()
      }).returning();
      orderRow = inserted[0];
    }

    const contentHash = crypto.createHash("md5").update(ctx.rawText).digest("hex")

    const existingComm = await tx
    .select({ id: communications.id })
    .from(communications)
    .where(and(
        eq(communications.userId, ctx.userId),
        sql`md5(${communications.content}) = ${contentHash}`
    ))
    .limit(1)

    let commId = existingComm[0]?.id
    if (!commId) {
        const inserted = await tx.insert(communications).values({
            userId: ctx.userId,
            communicationType: "email",
            subject: ctx.subject ?? null,
            content: ctx.rawText,
            fromEmail: ctx.fromEmail ?? null,
            isOrderCommunication: !!parsed.is_shipping_email,
            isAvailableOrderId: !!parsed.order_id,
            carrier: parsed.carrier,
            purchasedFrom: parsed.merchant ?? null,
            isShippingEmail: !!parsed.is_shipping_email,
            isDeliveryEmail: !!parsed.is_delivery_email,
            trackingNumbers: tn,
            trackingUrls: tu,
        }).returning({ id: communications.id });
        commId = inserted[0].id
    }

    if (commId) {
    await tx.update(communications)
    .set({ relatedOrderIds: [orderRow.id] })
    .where(eq(communications.id, commId))        
    }


    const dto: ShipmentDTO = {
      orderId: orderRow.id,
      carrier: parsed.carrier,
      trackingNumbers: tn,
      trackingUrls: tu,
      merchant: parsed.merchant ?? null,
      estimatedDelivery: parsed.estimated_delivery ?? null,
      lastCommunicationAt: new Date().toISOString()
      
    };

    return dto;
  })
}