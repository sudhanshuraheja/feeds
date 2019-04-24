CREATE TABLE IF NOT EXISTS dependencies (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id UUID,
  version VARCHAR(32),
  name VARCHAR(128),
  mapped UUID,
  type VARCHAR(8),
  active BOOL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);