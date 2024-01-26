// lib/neynar.ts

import NeynarClient from "neynar-next/server";

const neynarClient = new NeynarClient(
	process.env.NEYNAR_API_KEY!,
	BigInt(process.env.FARCASTER_DEVELOPER_FID!),
	process.env.FARCASTER_DEVELOPER_MNEMONIC!,
);

export default neynarClient;
