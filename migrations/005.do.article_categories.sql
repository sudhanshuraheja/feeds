CREATE TABLE IF NOT EXISTS article_categories (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	article varchar(64),
	category varchar(64),
	created timestamp,
	updated timestamp
);