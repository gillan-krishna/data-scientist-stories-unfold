
CREATE TABLE public.spotify_tokens (
  id INT PRIMARY KEY DEFAULT 1,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT spotify_tokens_singleton CHECK (id = 1)
);

-- Add a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_spotify_tokens_updated_at
BEFORE UPDATE ON public.spotify_tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
