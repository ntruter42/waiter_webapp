import bcrypt from "bcrypt";

export default function (db, schema) {
	async function getUsers(username, password) {
		const query = `SELECT * FROM ${schema}.users`;

		if (!username && !password) { return await db.manyOrNone(query) }

		let clause1 = '';
		if (username) { clause1 = ` WHERE username = '${username}'` }

		let clause2 = '';
		if (password) { clause2 = ` AND password = '${password}'` }

		return await db.oneOrNone(query + clause1 + clause2);
	}

	async function getWaiters(user_id) {
		const query = `SELECT * FROM ${schema}.users`;
		const clause1 = ` WHERE role = 'waiter'`;

		let clause2 = '';
		if (user_id) { clause2 = ` AND user_id = ${user_id}` }

		return await db.manyOrNone(query + clause1 + clause2);
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
		if (columns && columns.includes('user_id')) { columns = columns.replace('user_id', `${schema}.users.user_id`) }
		if (columns && columns.includes('day_id')) { columns = columns.replace('day_id', `${schema}.days.day_id`) }

		const query = `SELECT ${columns || '*'} FROM ${schema}.assignments`;
		const join1 = ` JOIN ${schema}.days ON ${schema}.days.day_id = ${schema}.assignments.day_id`;
		const join2 = ` JOIN ${schema}.users ON ${schema}.users.user_id = ${schema}.assignments.user_id`;

		let clause = '';
		if (user_id) { clause = ` WHERE ${schema}.users.user_id = ${user_id}` }

		// The order_by parameter only works for strings 'day' or 'user'
		let order = '';
		if (order_by) { order = ` ORDER BY ${schema}.${order_by}s.${order_by}_id` }

		return await db.manyOrNone(query + join1 + join2 + clause + order);
	}

	async function isAssigned(user_id, day_id) {
		// select exists(select 1 from table_name where id = 12)
		// select exists(select true from table_name where id = 12)
		const subquery = `SELECT true FROM ${schema}.assignments`;
		const clause = `WHERE user_id = ${user_id} AND day_id = ${day_id}`;
		const query = `SELECT EXISTS(${subquery} ${clause})`;

		return (await db.one(query)).exists;
	}

	async function setDay(user_id, day_id) {
		const query = `INSERT INTO ${schema}.assignments (user_id, day_id)`;
		const values = ` VALUES (${user_id}, ${day_id})`;
		const conflict = ` ON CONFLICT DO NOTHING`;

		await db.none(query + values + conflict);
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
		const query = `INSERT INTO ${schema}.users (username, full_name, role, password)`;
		const values = ` VALUES ('${user.username}', '${user.full_name}', '${user.role}', '${await hash(user.password)}')`;
		const clause = ` RETURNING user_id`;
		return await db.oneOrNone(query + values + clause);
	}

	async function removeUsers(user_id) {
		const query = `DELETE FROM ${schema}.users`;

		let clause = '';
		let restart = '';
		if (user_id) { clause = ` WHERE user_id = ${user_id}` }
		else { restart = `; ALTER SEQUENCE ${schema}.users_user_id_seq RESTART WITH 1;` }

		await db.none(query + clause + restart);
	}

	async function resetAssignments() {
		const query = `TRUNCATE TABLE ${schema}.assignments`;
		await db.none(query);
	}

	async function hash(password) {
		let password_hash = '';
		while (password_hash.length !== 60) { password_hash = await bcrypt.hash(password, 10) }
		return password_hash;
	}

	async function verify(password, password_hash) {
		return await bcrypt.compare(password, password_hash);
	}

	function week() {
		const date = new Date();
		const start = new Date(date.getFullYear(), 0, 1);
		const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
		return Math.ceil(days / 7);
	}

	return {
		getUsers,
		getUser: getUsers,
		getWaiters,
		getWaiter: getWaiters,
		getDays,
		getDay: getDays,
		getAssignments,
		isAssigned,
		setDay,
		unsetDays,
		unsetDay: unsetDays,
		addUser,
		removeUsers,
		removeUser: removeUsers,
		resetAssignments,
		hash,
		verify,
		week
	};
};