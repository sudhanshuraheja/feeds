CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS seq (
	seq BIGINT PRIMARY KEY,
	id VARCHAR(128),
	rev VARCHAR(64),
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packages (
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id VARCHAR(128),
	rev VARCHAR(128),
	name VARCHAR(128),
	description TEXT,
	readme TEXT,
	timeModified TIMESTAMP WITH TIME ZONE,
	timeCreated TIMESTAMP WITH TIME ZONE,
	repositoryType VARCHAR(16),
	repositoryURL VARCHAR(256),
	repositoryGithubOrg VARCHAR(64),
	repositoryGithubRepo VARCHAR(64),
	readmeFileName VARCHAR(256),
	homepage VARCHAR(64),
	bugsURL VARCHAR(128),
	bugsEmail VARCHAR(128),
	licenceType VARCHAR(64),
	licenseURL VARCHAR(128),
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS distributionTags (
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	package UUID,
	tag VARCHAR(64),
	version VARCHAR(64),
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS people (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package UUID,
	version UUID,
	versionName VARCHAR(128),
	email VARCHAR(64),
	name VARCHAR(64),
	url VARCHAR(64),
  type VARCHAR(16), -- author / maintainers / contributors
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS versionTime (
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package UUID,
	tag VARCHAR(64),
	time TIMESTAMP WITH TIME ZONE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS npm (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package UUID,
  username VARCHAR(32),
  liked BOOL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS keywords (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package UUID,
	version UUID,
	versionName VARCHAR(128),
  name VARCHAR(128),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS versions (	
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package UUID,
	id VARCHAR(64), -- npm@1.1.25
  version VARCHAR(128),
	name VARCHAR(128),
	description VARCHAR(256),
	homepage VARCHAR(256),
	repositoryType VARCHAR(16),
	repositoryURL VARCHAR(256),
	repositoryGithubOrg VARCHAR(64),
	repositoryGithubRepo VARCHAR(64),
	bugsURL VARCHAR(128),
	bugsEmail VARCHAR(128),
	licenceType VARCHAR(64),
	licenseURL VARCHAR(128),
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

CREATE TABLE IF NOT EXISTS dependencies (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package UUID,
	version UUID,
	versionName VARCHAR(128),
  name VARCHAR(128),
	mappedPackage UUID,
	semver VARCHAR(64),
	url VARCHAR(128),
  type VARCHAR(8), -- dep / bundle / dev / optional
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

