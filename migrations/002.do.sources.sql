CREATE TABLE IF NOT EXISTS sources (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title varchar(128),
	link varchar(128),
	feed_url varchar(128),
	description varchar(512),
	last_updated timestamp,
	generator varchar(32),
	active boolean,
	previous_uuid varchar(64),
	url varchar(128),
	created timestamp,
	updated timestamp
);