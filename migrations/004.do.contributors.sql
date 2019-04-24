CREATE TABLE IF NOT EXISTS contributors (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id UUID,
  version VARCHAR(32),
  human UUID,
  type VARCHAR(16),
  active BOOL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);