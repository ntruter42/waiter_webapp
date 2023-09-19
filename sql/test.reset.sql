-- DROP TABLES
DROP TABLE test.assignments;
DROP TABLE test.users;
DROP TABLE test.days;

-- CREATE TABLES
-- Days
CREATE TABLE test.days (
	day_id SERIAL PRIMARY KEY,
	day_name VARCHAR(9) NOT NULL
);
-- Users
CREATE TABLE test.users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL UNIQUE,
	full_name VARCHAR(255) NOT NULL,
	role VARCHAR(6) NOT NULL,
	password VARCHAR(60) NOT NULL
);
-- Assignments
CREATE TABLE test.assignments (
	user_id INT NOT NULL,
	day_id INT NOT NULL,
	-- confirm BOOLEAN DEFAULT false,
	PRIMARY KEY (user_id, day_id),
	FOREIGN KEY (user_id) REFERENCES test.users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (day_id) REFERENCES test.days(day_id) ON DELETE CASCADE
);

-- INSERT DAYS
INSERT INTO test.days (day_name) VALUES ('Monday');
INSERT INTO test.days (day_name) VALUES ('Tuesday');
INSERT INTO test.days (day_name) VALUES ('Wednesday');
INSERT INTO test.days (day_name) VALUES ('Thursday');
INSERT INTO test.days (day_name) VALUES ('Friday');
INSERT INTO test.days (day_name) VALUES ('Saturday');
INSERT INTO test.days (day_name) VALUES ('Sunday');