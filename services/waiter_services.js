export default function (db, schema) {
	async function getUser(username, password) {
		const query = `SELECT * FROM ${schema}.users`;
		const clause = ` WHERE username = '${username}' AND password = '${password}'`;
		return await db.oneOrNone(query + clause);
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
		return await db.none(query);
	}

	async function unsetDay(waiter_id, day_id) {
		const query = `DELETE FROM ${schema}.assignments`;
		const clause = ` WHERE waiter_id = ${waiter_id} AND day_id = ${day_id}`;
		return await db.none(query + clause);
	}

	return {
		getUser,
		getWaiters,
		getDays,
		getAssignments,
		getUserAssignments,
		setDay,
		unsetDay
	};
};