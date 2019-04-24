CREATE TABLE IF NOT EXISTS npm (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id UUID,
  version VARCHAR(32),
  username VARCHAR(32),
  liked BOOL,
  active BOOL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);