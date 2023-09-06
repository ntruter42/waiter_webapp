CREATE TABLE development.users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL UNIQUE,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	role VARCHAR(6) NOT NULL,
	password VARCHAR(255) NOT NULL,
	salt VARCHAR(16) NOT NULL
);

CREATE TABLE development.days (
	day_id SERIAL PRIMARY KEY,
	day_name VARCHAR(8) NOT NULL
);

CREATE TABLE development.assignments (
	waiter_id INT NOT NULL,
	day_id INT NOT NULL,
	-- date_time NOT NULL DEFAULT(current_timestamp),
	PRIMARY KEY (waiter_id, day_id),
	FOREIGN KEY (waiter_id) REFERENCES development.users(user_id),
	FOREIGN KEY (day_id) REFERENCES development.days(day_id)
);