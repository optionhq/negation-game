import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./neynarDb.d";

export const queryFarcasterDb = async <T>(
	callback: (farcasterDb: Kysely<DB>) => Promise<T>,
): Promise<T> => {
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

	const dialect = new PostgresDialect({
		pool: new Pool({
			database: process.env.NEYNAR_DB_NAME,
			user: process.env.NEYNAR_DB_USER,
			password: process.env.NEYNAR_DB_PASSWORD,
			host: process.env.NEYNAR_DB_HOST,
			port: parseInt(process.env.NEYNAR_DB_PORT),
			max: 5,
			allowExitOnIdle: true,
		}),
	});

	const farcasterDb = new Kysely<DB>({
		dialect,
	});

	const results = await callback(farcasterDb);

	await farcasterDb.destroy();

	return results;
};
