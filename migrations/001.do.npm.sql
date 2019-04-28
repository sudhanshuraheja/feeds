CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS sequence (
	seq BIGINT PRIMARY KEY,
	name VARCHAR(128),
	rev VARCHAR(64),
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packages (
	name VARCHAR(128) PRIMARY KEY,
	rev VARCHAR(128),
	description TEXT,
	readme TEXT,
	timeModified TIMESTAMP WITH TIME ZONE,
	timeCreated TIMESTAMP WITH TIME ZONE,
	repositoryType VARCHAR(16),
	repositoryURL VARCHAR(256),
	repositoryGithubOrg VARCHAR(64),
	repositoryGithubRepo VARCHAR(64),
	readmeFileName VARCHAR(256),
	homepage VARCHAR(256),
	bugsURL VARCHAR(256),
	bugsEmail VARCHAR(128),
	licenceType VARCHAR(64),
	licenseURL VARCHAR(256),
	users BIGINT,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS versions (	
	id VARCHAR(128) PRIMARY KEY, -- npm@1.1.25
	name VARCHAR(128), -- npm
  version VARCHAR(128), -- 1.1.25
	description VARCHAR(256),
	homepage VARCHAR(256),
	repositoryType VARCHAR(16),
	repositoryURL VARCHAR(256),
	repositoryGithubOrg VARCHAR(64),
	repositoryGithubRepo VARCHAR(64),
	bugsURL VARCHAR(256),
	bugsEmail VARCHAR(128),
	licenceType VARCHAR(64),
	licenseURL VARCHAR(256),
	committerName VARCHAR(128),
	committerEmail VARCHAR(128),
	npmVersion VARCHAR(32),
	nodeVersion VARCHAR(32),
	distShasum VARCHAR(64),
	distTarball VARCHAR(256),
	deprecated VARCHAR(256),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS versions_name_version_idx ON versions(name, version);

CREATE TABLE IF NOT EXISTS tags ( -- distribution-tags
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(128),
	tag VARCHAR(64),
	version VARCHAR(64),
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS tags_name_tag_idx ON tags (name, tag);

CREATE TABLE IF NOT EXISTS people (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(128),
	version VARCHAR(128),
	email VARCHAR(64),
	fullname VARCHAR(64),
	url VARCHAR(64),
  type VARCHAR(16), -- author / maintainers / contributors
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS people_name_version_idx ON people(name, version);

CREATE TABLE IF NOT EXISTS times (
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(128),
	version VARCHAR(64),
	time TIMESTAMP WITH TIME ZONE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS times_name_version_idx ON times(name, version);

CREATE TABLE IF NOT EXISTS keywords (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(128),
	version VARCHAR(64),
  keyword VARCHAR(128),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS keywords_name_version_keyword_idx ON keywords(name, version, keyword);

CREATE TABLE IF NOT EXISTS dependencies (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(128),
	version VARCHAR(64),
  dependency VARCHAR(128),
	semver VARCHAR(64),
	url VARCHAR(128),
  type VARCHAR(8), -- dep / bundle / dev / optional
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS dependencies_name_version_dependenct_idx ON dependencies(name, version, dependency);