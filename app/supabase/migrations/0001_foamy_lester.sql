CREATE TABLE "communications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"communication_type" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"from_email" text,
	"sent_to_email" text,
	"is_order_communication" boolean DEFAULT false NOT NULL,
	"is_available_order_id" boolean DEFAULT false NOT NULL,
	"related_order_ids" integer[],
	"carrier" text,
	"purchased_from" text,
	"is_shipping_email" boolean DEFAULT false NOT NULL,
	"is_delivery_email" boolean DEFAULT false NOT NULL,
	"tracking_numbers" text[],
	"tracking_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"delivery_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_date" timestamp NOT NULL,
	"shipment_date" timestamp,
	"estimated_delivery_date" timestamp,
	"actual_delivery_date" timestamp,
	"last_communication_at" timestamp,
	"related_communication_ids" text[],
	"tracking_urls" text[],
	"tracking_numbers" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
