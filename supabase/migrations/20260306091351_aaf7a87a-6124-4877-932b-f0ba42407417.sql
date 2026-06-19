CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;
ALTER TABLE public.orders ADD COLUMN order_number text DEFAULT 'ORD-' || nextval('order_number_seq')::text;