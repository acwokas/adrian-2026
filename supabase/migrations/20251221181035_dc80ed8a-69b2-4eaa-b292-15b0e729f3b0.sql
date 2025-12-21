-- Add session_id column to track visitor sessions
ALTER TABLE public.analytics_events 
ADD COLUMN IF NOT EXISTS session_id text;