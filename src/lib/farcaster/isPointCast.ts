import { DEFAULT_CHANNELID, ROOT_CAST_ID } from "@/config";
import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export const isPointCast = (cast: CastWithInteractions) =>
	cast?.parent_url === DEFAULT_CHANNELID || cast?.parent_hash === ROOT_CAST_ID;
