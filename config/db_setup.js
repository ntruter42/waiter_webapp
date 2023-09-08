import promise from "pg-promise";

export default function Database() {
	const pgp = promise();
	const db = pgp({
		connectionString: process.env.DB_URL,
		ssl: { rejectUnauthorized: false }
	});

	return db;
}