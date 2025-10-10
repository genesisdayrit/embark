import { boolean, pgTable, text, timestamp, uuid, jsonb} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  orderDate: timestamp('order_date').notNull(),
  shipmentDate: timestamp('shipment_date'),
  estimatedDeliveryDate: timestamp('estimated_delivery_date'),
  actualDeliveryDate: timestamp('actual_delivery_date'),
  merchant: text('merchant'),
  merchantOrderNo: text('merchant_order_no'),
  merchantImageUrl: text('merchant_image_url'),
  orderInfo: jsonb('order_info'),
  lastCommunicationAt: timestamp('last_communication_at'),
  relatedCommunicationIds: uuid('related_communication_ids').array(),
  trackingUrls: text('tracking_urls').array(),
  trackingNumbers: text('tracking_numbers').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrder = typeof orders.$inferSelect;

export const communications = pgTable('communications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  communicationType: text('communication_type').notNull(), // 'email' for now, can think about texts later'
  subject: text('subject'),
  content: text('content').notNull(),
  fromEmail: text('from_email'),
  sentToEmail: text('sent_to_email'),
  isOrderCommunication: boolean('is_order_communication').default(false).notNull(),
  isAvailableOrderId: boolean('is_available_order_id').default(false).notNull(),
  relatedOrderIds: uuid('related_order_ids').array(),
  merchant: text('merchant'),
  merchant_order_no: text('merchant_order_no'),
  carrier: text('carrier'),
  purchasedFrom: text('purchased_from'),
  isShippingEmail: boolean('is_shipping_email').default(false).notNull(),
  isDeliveryEmail: boolean('is_delivery_email').default(false).notNull(),
  trackingNumbers: text('tracking_numbers').array(),
  trackingUrls: text('tracking_urls').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type InsertCommunication = typeof communications.$inferInsert;
export type SelectCommunication = typeof communications.$inferSelect;

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  deliveryType: text('delivery_type').notNull(), // 'email' or 'text'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
});

export type InsertNotification = typeof notifications.$inferInsert;
export type SelectNotification = typeof notifications.$inferSelect;

export const gmailWatchState = pgTable('gmail_watch_state', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  emailAddress: text('email_address').notNull(),
  historyId: text('history_id').notNull(),
  watchExpiration: timestamp('watch_expiration').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type InsertGmailWatchState = typeof gmailWatchState.$inferInsert;
export type SelectGmailWatchState = typeof gmailWatchState.$inferSelect;
