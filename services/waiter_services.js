export default function (db, schema) {
	async function getUserData(username, password) {
		const query = `SELECT * FROM ${schema}.users`;
		const clause = ` WHERE username = '${username}' AND password = '${password}'`;
		// password is obviously hashed :|
		return await db.oneOrNone(query + clause);
	}

	return {
		getUserData
	};
};