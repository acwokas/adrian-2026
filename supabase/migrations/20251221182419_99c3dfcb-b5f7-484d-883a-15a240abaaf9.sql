-- Create session_recordings table
CREATE TABLE public.session_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  user_agent TEXT,
  viewport_width INTEGER,
  viewport_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_recordings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert recordings
CREATE POLICY "Anyone can insert recordings"
ON public.session_recordings
FOR INSERT
WITH CHECK (true);

-- Only admins can read recordings
CREATE POLICY "Admins can read recordings"
ON public.session_recordings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for session lookups
CREATE INDEX idx_session_recordings_session_id ON public.session_recordings(session_id);
CREATE INDEX idx_session_recordings_started_at ON public.session_recordings(started_at DESC);