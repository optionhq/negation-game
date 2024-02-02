// lib/neynar.ts

import NeynarClient from "neynar-next/server";

let neynarClient: NeynarClient
if (process.env.NEYNAR_API_KEY && process.env.FARCASTER_DEVELOPER_FID && process.env.FARCASTER_DEVELOPER_MNEMONIC) {
	neynarClient = new NeynarClient(
		process.env.NEYNAR_API_KEY,
		BigInt(process.env.FARCASTER_DEVELOPER_FID),
		process.env.FARCASTER_DEVELOPER_MNEMONIC,

	);
}
else {
	throw Error("Please provide a NEYNAR_API_KEY, FARCASTER_DEVELOPER_FID & FARCASTER_DEVELOPER_MNEMONIC in your env.")
}

export default neynarClient;
