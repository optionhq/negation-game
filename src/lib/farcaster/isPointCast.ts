import { DEFAULT_CHANNELID } from "@/config";
import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export const isPointCast = (cast: CastWithInteractions) =>
	cast?.parent_url === DEFAULT_CHANNELID;
