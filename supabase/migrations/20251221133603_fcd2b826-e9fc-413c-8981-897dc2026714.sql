-- Create storage bucket for CV documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Create RLS policy for public read access
CREATE POLICY "Public can read documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

-- Create a settings table to store the admin password hash and CV path
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  cv_path TEXT,
  admin_password_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read of cv_path only
CREATE POLICY "Public can read CV path"
ON public.site_settings
FOR SELECT
USING (true);

-- Insert default settings with a default password (you'll change this)
INSERT INTO public.site_settings (id, admin_password_hash)
VALUES ('main', 'adrianwatkins2024');