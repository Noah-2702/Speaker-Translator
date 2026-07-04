-- Update user_role enum to include premium_listener and rename listener to free_listener
ALTER TYPE public.user_role RENAME VALUE 'listener' TO 'free_listener';
ALTER TYPE public.user_role ADD VALUE 'premium_listener';

-- Add transcript and embedding columns to the events table
ALTER TABLE public.events
ADD COLUMN transcript text,
ADD COLUMN embedding vector(1536); -- Assuming OpenAI embeddings with 1536 dimensions

-- Add RLS policies for the new columns if necessary (will be handled in a separate migration or update existing RLS)
