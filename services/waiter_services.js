export default function (db, schema) {
	async function getUsers(username, password) {
		const query = `SELECT * FROM ${schema}.users`;

		let clause1 = '';
		if (username) { clause1 = ` WHERE username = '${username}'` }

		let clause2 = '';
		if (password) { clause2 = ` AND password = '${password}'` }

		return await db.oneOrNone(query + clause1 + clause2);
	}

	async function getWaiters() {
		const query = `SELECT * FROM ${schema}.users`;
		const clause = ` WHERE role = 'waiter'`;

		return await db.manyOrNone(query + clause);
	}

	async function getDays(day_id) {
		const query = `SELECT * FROM ${schema}.days`;

		let clause = '';
		if (day_id) {
			clause = ` WHERE day_id = ${day_id}`;
			return await db.one(query + clause);
		}

		return await db.many(query + clause);
	}

	async function getAssignments(columns, user_id, order_by) {
		// Uncomment next line if user_id and day_id is needed
		// if (columns) { columns += `${schema}.users.user_id, ${schema}.days.day_id, `; }

		const query = `SELECT ${columns || '*'} FROM ${schema}.assignments`;
		const join1 = ` JOIN ${schema}.days ON ${schema}.days.day_id = ${schema}.assignments.day_id`;
		const join2 = ` JOIN ${schema}.users ON ${schema}.users.user_id = ${schema}.assignments.user_id`;

		let clause = '';
		if (user_id) { clause = ` WHERE ${schema}.users.user_id = ${user_id}` }

		// The order_by parameter only works for 'day' or 'user'
		let order = '';
		if (order_by) { order = ` ORDER BY ${schema}.${order_by}s.${order_by}_id` }

		return await db.manyOrNone(query + join1 + join2 + clause + order);
	}

	async function setDay(user_id, day_id) {
		const query = `INSERT INTO ${schema}.assignments (user_id, day_id)`;
		const values = ` VALUES (${user_id}, ${day_id})`;

		await db.none(query + values);
	}

	// Can be used to reset table if no parameters are provided
	// but TRUNCATE TABLE in resetAssignments() is faster
	// Can be used to reset waiter's week if only waiter_id is provided
	async function unsetDays(user_id, day_id) {
		const query = `DELETE FROM ${schema}.assignments`;

		let clause1 = '';
		if (user_id) { clause1 = ` WHERE user_id = ${user_id}` }

		let clause2 = '';
		if (user_id && day_id) { clause2 = ` AND day_id = ${day_id}` }

		await db.none(query + clause1 + clause2);
	}

	async function addUser(user) {
		const query = `INSERT INTO ${schema}.users (username, first_name, last_name, role, password, salt)`;
		const values = ` VALUES ('${user.username}', '${user.first_name}', '${user.last_name}', '${user.role}', '${user.password}', ${user.salt})`;
		await db.none(query + values);
	}

	async function resetAssignments() {
		const query = `TRUNCATE TABLE ${schema}.assignments`;
		await db.none(query);
	}

	function week() {
		const date = new Date();
		const start = new Date(date.getFullYear(), 0, 1);
		const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
		return Math.ceil(days / 7);
	};

	return {
		getUser: getUsers,
		getWaiters,
		getDay: getDays,
		getAssignments,
		setDay,
		unsetDay: unsetDays,
		addUser,
		resetAssignments,
		week
	};
};