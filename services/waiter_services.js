export default function (db, schema) {
	async function getUser(username, password) {
		const query = `SELECT * FROM ${schema}.users`;
		const clause = ` WHERE username = '${username}'`;

		let extra = '';
		if (password) {
			extra = ` AND password = '${password}'`;
		}

		return await db.oneOrNone(query + clause + extra);
	}

	async function getWaiters() {
		const query = `SELECT * FROM ${schema}.users`;
		const clause = ` WHERE role = 'waiter'`;
		return await db.manyOrNone(query + clause);
	}

	async function getDays() {
		const query = `SELECT * FROM ${schema}.days`;
		return await db.many(query);
	}

	async function getAssignments(day_id) {
		const query = `SELECT * FROM ${schema}.assignments`;

		let clause = '';
		if (day_id) {
			clause = ` WHERE day_id = '${day_id}'`;
		}

		return await db.manyOrNone(query + clause);
	}

	async function getUserAssignments(waiter_id) {
		const query = `SELECT * FROM ${schema}.assignments`;
		const clause = ` WHERE waiter_id = '${waiter_id}'`;
		return await db.manyOrNone(query + clause);
	}

	async function setDay(waiter_id, day_id) {
		const query = `INSERT INTO ${schema}.assignments (waiter_id, day_id) VALUES (${waiter_id}, ${day_id})`;
		await db.none(query);
	}

	async function unsetDay(waiter_id, day_id) {
		const query = `DELETE FROM ${schema}.assignments`;
		const clause = ` WHERE waiter_id = ${waiter_id} AND day_id = ${day_id}`;
		await db.none(query + clause);
	}

	async function addUser(user_data) {
		const query = `INSERT INTO ${schema}.users (username, first_name, last_name, role, password, salt)`;
		const values = ` VALUES ('${user_data.username}', '${user_data.first_name}', '${user_data.last_name}', '${user_data.role}', '${user_data.password}', '${user_data.salt}')`;
		await db.none(query + values);
	}

	return {
		getUser,
		getWaiters,
		getDays,
		getAssignments,
		getUserAssignments,
		setDay,
		unsetDay,
		addUser
	};
};