CREATE TABLE IF NOT EXISTS articles (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	source varchar(128),
	title varchar(128),
	link varchar(128),
	published_date timestamp,
	creator varchar(128),
	description varchar(1024),
	local_id varchar(128),
	created timestamp,
	updated timestamp
);