import { NeynarAPIClient } from "@neynar/nodejs-sdk";

if (!process.env.NEYNAR_API_KEY) throw Error("NEYNAR_API_KEY not set");

export const neynarApi = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
