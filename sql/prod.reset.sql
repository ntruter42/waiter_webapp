-- DROP TABLES
DROP TABLE production.assignments;
DROP TABLE production.users;
DROP TABLE production.days;

-- CREATE TABLES
-- Days
CREATE TABLE production.days (
	day_id SERIAL PRIMARY KEY,
	day_name VARCHAR(9) NOT NULL
);
-- Users
CREATE TABLE production.users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL UNIQUE,
	full_name VARCHAR(255) NOT NULL,
	role VARCHAR(6) NOT NULL,
	password VARCHAR(60) NOT NULL
);
-- Assignments
CREATE TABLE production.assignments (
	user_id INT NOT NULL,
	day_id INT NOT NULL,
	PRIMARY KEY (user_id, day_id),
	FOREIGN KEY (user_id) REFERENCES production.users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (day_id) REFERENCES production.days(day_id) ON DELETE CASCADE
);

-- INSERT DAYS
INSERT INTO production.days (day_name) VALUES ('Monday');
INSERT INTO production.days (day_name) VALUES ('Tuesday');
INSERT INTO production.days (day_name) VALUES ('Wednesday');
INSERT INTO production.days (day_name) VALUES ('Thursday');
INSERT INTO production.days (day_name) VALUES ('Friday');
INSERT INTO production.days (day_name) VALUES ('Saturday');
INSERT INTO production.days (day_name) VALUES ('Sunday');

-- INSERT USERS
INSERT INTO production.users (username, full_name, role, password) VALUES ('ntruter42', 'Nicholas Truter', 'admin', '$2b$10$cxK.emL.AHc7XzMf5fVaTe5gFjNblOowr71YC.qFN4UJvZ902VKzG');
INSERT INTO production.users (username, full_name, role, password) VALUES ('emusk69', 'Elon Musk', 'waiter', '$2b$10$aTEFSH3iQnefKPT9L3cOFuiEYyzcaKqh9JsiQElcjB2d.Uyrdhu96');
INSERT INTO production.users (username, full_name, role, password) VALUES ('jbezos007', 'Jeff Bezos', 'waiter', '$2b$10$/Z2GEyeWLTqUMdkBUy.i..cXvwomz3UTtkXpobkmwL1MPruyJCJYS');
INSERT INTO production.users (username, full_name, role, password) VALUES ('msuck404', 'Mark Zuckerberg', 'waiter', '$2b$10$kb4k9Kb3dTj7SHXnCSfpU.SwEjhoJ5lN31lGGxAMds4W7CVYZrm.2');
INSERT INTO production.users (username, full_name, role, password) VALUES ('bgates1', 'Bill Gates', 'waiter', '$2b$10$oyeL4Lhnb5HxJbwbpYw31ublSzkjDxORih9VTTi0zzA7g8077dM7e');
INSERT INTO production.users (username, full_name, role, password) VALUES ('sjobs1337', 'Steve Jobs', 'waiter', '$2b$10$BZZCt54OSgQzv32A0OsQnuG7LiKXnSA8waujFfHD3tXXd6.8zfete');
INSERT INTO production.users (username, full_name, role, password) VALUES ('tcook100', 'Tim Cook', 'waiter', '$2b$10$wjAzen1IDgCx8lapQ5a3LO9EissBpT9911.yASRaf0Qz59jr7nhNa');
INSERT INTO production.users (username, full_name, role, password) VALUES ('eschmidt777', 'Eric Schmidt', 'waiter', '$2b$10$cCerws7KrucPMmXjA22kC.nHy6SLRwCmPZvMK.QzL3sBdYnC5voMq');
INSERT INTO production.users (username, full_name, role, password) VALUES ('spichai3', 'Sundar Pichai', 'waiter', '$2b$10$dAWkM7/x.vuno5ZSMiRJq.Sqd4r0Q4ZWfTpsh3c1jgH.vs1rph5ZG');
INSERT INTO production.users (username, full_name, role, password) VALUES ('jdorsey22', 'Jack Dorsey', 'waiter', '$2b$10$.QKSrmWM998Tk157kHB0Neju/MAJNkBWt8h9On4.TgE6LfKNiI/UO');
INSERT INTO production.users (username, full_name, role, password) VALUES ('ghotz10110', 'George Hotz', 'waiter', '$2b$10$vK9LWDUgxxUHfxeYuiml4Oawo80xxHjVdaT3cwqvI9NA3DHIjdp2q');
INSERT INTO production.users (username, full_name, role, password) VALUES ('e$n0Md3n', 'Warden Snowed', 'waiter', '$2b$10$WwLrrr/hUq.3qDljdUd1IOkIDXhVbHBeAnXazjyGzjA42MzVPiJkK');
INSERT INTO production.users (username, full_name, role, password) VALUES ('saltman', 'Sam Altman', 'waiter', '$2b$10$c2LphFlLPZU1e94Hglh1w.ah2n4fruwYjWQU.0gqFw6i97oJaja8G');
INSERT INTO production.users (username, full_name, role, password) VALUES ('ltorvalds123', 'Linus Torvalds', 'waiter', '$2b$10$fTg7Cdq2W4NYkvL3TDL1VOJ0uYjM4K3NaKm8Mg0FQlkEe/RbK.P3m');
INSERT INTO production.users (username, full_name, role, password) VALUES ('ksystrom08', 'Kevin Systrom', 'waiter', '$2b$10$./q6i6LYjtSbX1EJA7jzz.kH3cjCjF/UIezkI1EbqfzmWsMBnC0G6');
INSERT INTO production.users (username, full_name, role, password) VALUES ('gramsay247', 'Gordon Ramsay', 'admin', '$2b$10$9kU7b7e7/n9//rAgisrqVexkup.ytqjBB.UzmJ1dvjpbwkZi7I0ea');

-- INSERT ASSIGNMENTS
-- Monday
INSERT INTO production.assignments (user_id, day_id) VALUES (2, 1);
INSERT INTO production.assignments (user_id, day_id) VALUES (3, 1);
INSERT INTO production.assignments (user_id, day_id) VALUES (5, 1);
INSERT INTO production.assignments (user_id, day_id) VALUES (7, 1);
INSERT INTO production.assignments (user_id, day_id) VALUES (9, 1);
INSERT INTO production.assignments (user_id, day_id) VALUES (13, 1);
-- Tuesday
INSERT INTO production.assignments (user_id, day_id) VALUES (2, 2);
INSERT INTO production.assignments (user_id, day_id) VALUES (15, 2);
-- Wednesday
INSERT INTO production.assignments (user_id, day_id) VALUES (2, 3);
INSERT INTO production.assignments (user_id, day_id) VALUES (5, 3);
INSERT INTO production.assignments (user_id, day_id) VALUES (9, 3);
INSERT INTO production.assignments (user_id, day_id) VALUES (13, 3);
INSERT INTO production.assignments (user_id, day_id) VALUES (14, 3);
-- Thursday
INSERT INTO production.assignments (user_id, day_id) VALUES (2, 4);
INSERT INTO production.assignments (user_id, day_id) VALUES (7, 4);
INSERT INTO production.assignments (user_id, day_id) VALUES (10, 4);
INSERT INTO production.assignments (user_id, day_id) VALUES (13, 4);
INSERT INTO production.assignments (user_id, day_id) VALUES (14, 4);
-- Friday
INSERT INTO production.assignments (user_id, day_id) VALUES (2, 5);
INSERT INTO production.assignments (user_id, day_id) VALUES (3, 5);
INSERT INTO production.assignments (user_id, day_id) VALUES (5, 5);
INSERT INTO production.assignments (user_id, day_id) VALUES (7, 5);
INSERT INTO production.assignments (user_id, day_id) VALUES (13, 5);
INSERT INTO production.assignments (user_id, day_id) VALUES (15, 5);
-- Saturday
-- Sunday
INSERT INTO production.assignments (user_id, day_id) VALUES (4, 7);
INSERT INTO production.assignments (user_id, day_id) VALUES (9, 7);
INSERT INTO production.assignments (user_id, day_id) VALUES (14, 7);