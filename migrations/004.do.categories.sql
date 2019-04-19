CREATE TABLE IF NOT EXISTS categories (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name varchar(128),
	created timestamp,
	updated timestamp
);