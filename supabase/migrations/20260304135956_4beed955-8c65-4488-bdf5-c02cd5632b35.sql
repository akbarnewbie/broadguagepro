
-- Add google_drive_url to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS google_drive_url text;

-- Add denormalized fields to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes text;

-- Change default status to 'pending'
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';

-- Allow admins to update orders (for marking fulfilled)
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
