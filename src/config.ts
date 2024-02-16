export const DEFAULT_CHANNELID = "https://negationgame.com";

//https://warpcast.com/negationgame/0xbddf1e693575f35ee913b7f8eb3b1c272a21a573
export const ROOT_CAST_ID = "0xbddf1e693575f35ee913b7f8eb3b1c272a21a573";

export const NEGATION_SYMBOL = "nah";

export const GRAPH_INTERACTIVE_MIN_ZOOM = 0.2;

export type ConvoIds = `0x${string}`[];

export const SPACES = JSON.parse(process.env.NEXT_PUBLIC_SPACES || "{}") as {
	[space: string]: ConvoIds;
};
