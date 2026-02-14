
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public can read CV path" ON public.site_settings;

-- Create a view that excludes the sensitive admin_password_hash column
CREATE VIEW public.site_settings_public
WITH (security_invoker = on) AS
  SELECT id, cv_path, updated_at
  FROM public.site_settings;

-- Grant access to the view
GRANT SELECT ON public.site_settings_public TO anon, authenticated;

-- Restrict base table: only admins can read (needed for edge functions via service role)
CREATE POLICY "Only admins can read site_settings"
ON public.site_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
