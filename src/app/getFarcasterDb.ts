import { Client } from "pg";

export const getFarcasterDb = async (): Promise<Client> => {
	if (!process.env.NEYNAR_DB_NAME) {
		throw new Error("NEYNAR_DB_NAME not set");
	}
	if (!process.env.NEYNAR_DB_USER) {
		throw new Error("NEYNAR_DB_USER not set");
	}
	if (!process.env.NEYNAR_DB_PASSWORD) {
		throw new Error("NEYNAR_DB_PASSWORD not set");
	}
	if (!process.env.NEYNAR_DB_HOST) {
		throw new Error("NEYNAR_DB_HOST not set");
	}
	if (!process.env.NEYNAR_DB_PORT) {
		throw new Error("NEYNAR_DB_PORT not set");
	}

	const client = new Client({
		database: process.env.NEYNAR_DB_NAME,
		user: process.env.NEYNAR_DB_USER,
		password: process.env.NEYNAR_DB_PASSWORD,
		host: process.env.NEYNAR_DB_HOST,
		port: parseInt(process.env.NEYNAR_DB_PORT),
	});

	await client.connect();

	return client;
};
