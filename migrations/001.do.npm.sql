CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS packages (
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id VARCHAR(128),
	rev VARCHAR(128),
	name VARCHAR(128),
	description TEXT,
	author UUID,
	distributionLatest VARCHAR(32),
	latestName VARCHAR(128),
	latestDescription VARCHAR(128),
	latestVersion VARCHAR(16),
	latestAuthor UUID,
	latestDistShasum VARCHAR(64),
	latestDistTarball VARCHAR(256),
	latestDeprecated VARCHAR(256),
	timeModified TIMESTAMP WITH TIME ZONE,
	timeCreated TIMESTAMP WITH TIME ZONE,
	timeLatest TIMESTAMP WITH TIME ZONE,
	repoType VARCHAR(16),
	repoURL VARCHAR(256),
	repoGithubOrg VARCHAR(64),
	repoGithubRepo VARCHAR(64),
	readme TEXT,
	readmeFileName VARCHAR(256),
	homepage VARCHAR(64),
	bugs VARCHAR(128),
	licence VARCHAR(16),
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS humans (
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email VARCHAR(64),
	name VARCHAR(64),
	url VARCHAR(64),
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS keywords (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id UUID,
  version VARCHAR(32),
  name VARCHAR(128),
  active BOOL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);