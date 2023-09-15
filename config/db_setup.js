import promise from "pg-promise";
import "dotenv/config";

export default function Database() {
	const pgp = promise();
	const db = pgp({
		connectionString: process.env.DB_URL,
		ssl: { rejectUnauthorized: false }
	});

	return db;
}