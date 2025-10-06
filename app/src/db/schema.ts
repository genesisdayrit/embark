import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTestTable = pgTable('users_test_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export type InsertUser = typeof usersTestTable.$inferInsert;
export type SelectUser = typeof usersTestTable.$inferSelect;

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  orderDate: timestamp('order_date').notNull(),
  shipmentDate: timestamp('shipment_date'),
  estimatedDeliveryDate: timestamp('estimated_delivery_date'),
  actualDeliveryDate: timestamp('actual_delivery_date'),
  lastCommunicationAt: timestamp('last_communication_at'),
  relatedCommunicationIds: text('related_communication_ids').array(),
  trackingUrls: text('tracking_urls').array(),
  trackingNumbers: text('tracking_numbers').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrder = typeof orders.$inferSelect;

export const communications = pgTable('communications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  communicationType: text('communication_type').notNull(), // 'email' for now, can think about texts later'
  subject: text('subject'),
  content: text('content').notNull(),
  fromEmail: text('from_email'),
  sentToEmail: text('sent_to_email'),
  isOrderCommunication: boolean('is_order_communication').default(false).notNull(),
  isAvailableOrderId: boolean('is_available_order_id').default(false).notNull(),
  relatedOrderIds: integer('related_order_ids').array(),
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
  id: serial('id').primaryKey(),
  orderId: integer('order_id'),
  userId: text('user_id').notNull(),
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
