-- Drop tables in correct order (child tables first due to foreign keys)
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "communications" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;

-- Recreate orders table with UUID
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"order_date" timestamp NOT NULL,
	"shipment_date" timestamp,
	"estimated_delivery_date" timestamp,
	"actual_delivery_date" timestamp,
	"last_communication_at" timestamp,
	"related_communication_ids" uuid[],
	"tracking_urls" text[],
	"tracking_numbers" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Recreate communications table with UUID
CREATE TABLE IF NOT EXISTS "communications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"communication_type" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"from_email" text,
	"sent_to_email" text,
	"is_order_communication" boolean DEFAULT false NOT NULL,
	"is_available_order_id" boolean DEFAULT false NOT NULL,
	"related_order_ids" uuid[],
	"carrier" text,
	"purchased_from" text,
	"is_shipping_email" boolean DEFAULT false NOT NULL,
	"is_delivery_email" boolean DEFAULT false NOT NULL,
	"tracking_numbers" text[],
	"tracking_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Recreate notifications table with UUID
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"delivery_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" 
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "communications" ADD CONSTRAINT "communications_user_id_user_id_fk" 
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_order_id_orders_id_fk" 
	FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" 
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

