CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS sequence (
	seq BIGINT PRIMARY KEY,
	name VARCHAR,
	rev VARCHAR,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packages (
	name VARCHAR PRIMARY KEY,
	rev VARCHAR,
	description TEXT,
	readme TEXT,
	timeModified TIMESTAMP WITH TIME ZONE,
	timeCreated TIMESTAMP WITH TIME ZONE,
	repositoryType VARCHAR,
	repositoryURL VARCHAR,
	repositoryGithubOrg VARCHAR,
	repositoryGithubRepo VARCHAR,
	readmeFileName VARCHAR,
	homepage VARCHAR,
	bugsURL VARCHAR,
	bugsEmail VARCHAR,
	licenceType VARCHAR,
	licenseURL VARCHAR,
	users BIGINT,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS versions (	
	id VARCHAR PRIMARY KEY, -- npm@1.1.25
	name VARCHAR, -- npm
  version VARCHAR, -- 1.1.25
	description TEXT,
	homepage VARCHAR,
	repositoryType VARCHAR,
	repositoryURL VARCHAR,
	repositoryGithubOrg VARCHAR,
	repositoryGithubRepo VARCHAR,
	bugsURL VARCHAR,
	bugsEmail VARCHAR,
	licenceType VARCHAR,
	licenseURL VARCHAR,
	committerName VARCHAR,
	committerEmail VARCHAR,
	npmVersion VARCHAR,
	nodeVersion VARCHAR,
	distShasum VARCHAR,
	distTarball VARCHAR,
	deprecated VARCHAR,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS versions_name_version_idx ON versions(name, version);

CREATE TABLE IF NOT EXISTS tags ( -- distribution-tags
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR,
	tag VARCHAR,
	version VARCHAR,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS tags_name_tag_idx ON tags (name, tag);

CREATE TABLE IF NOT EXISTS people (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR,
	version VARCHAR,
	email VARCHAR,
	fullname VARCHAR,
	url VARCHAR,
  type VARCHAR, -- author / maintainers / contributors
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS people_name_version_fullname_email_url_type_idx ON people(name, version, fullname, email, url, type);

CREATE TABLE IF NOT EXISTS times (
	uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR,
	version VARCHAR,
	time TIMESTAMP WITH TIME ZONE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS times_name_version_idx ON times(name, version);

CREATE TABLE IF NOT EXISTS keywords (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR,
	version VARCHAR,
  keyword VARCHAR,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS keywords_name_version_keyword_idx ON keywords(name, version, keyword);

CREATE TABLE IF NOT EXISTS dependencies (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR,
	version VARCHAR,
  dependency VARCHAR,
	semver VARCHAR,
	url VARCHAR,
  type VARCHAR, -- dep / bundle / dev / optional
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS dependencies_name_version_dependency_type_idx ON dependencies(name, version, dependency, type);