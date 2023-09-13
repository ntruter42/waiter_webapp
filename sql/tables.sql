CREATE TABLE development.users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL UNIQUE,
	full_name VARCHAR(255) NOT NULL,
	role VARCHAR(6) NOT NULL,
	password VARCHAR(255) NOT NULL,
	salt VARCHAR(16) NOT NULL
);

CREATE TABLE development.days (
	day_id SERIAL PRIMARY KEY,
	day_name VARCHAR(9) NOT NULL
);

CREATE TABLE development.assignments (
	user_id INT NOT NULL,
	day_id INT NOT NULL,
	PRIMARY KEY (user_id, day_id),
	FOREIGN KEY (user_id) REFERENCES development.users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (day_id) REFERENCES development.days(day_id) ON DELETE CASCADE
);