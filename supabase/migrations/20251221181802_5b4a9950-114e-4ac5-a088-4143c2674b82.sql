-- Add new event types for form tracking
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'form_start';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'form_submit';