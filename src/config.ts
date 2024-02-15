export const DEFAULT_CHANNELID = "https://negationgame.com";

//https://warpcast.com/point/0x1dfb6fe0
export const ROOT_CAST_ID = "0x1dfb6fe08956d68fb18a3c72145585027bf89b81";

export const NEGATION_SYMBOL = "nah";

export const GRAPH_INTERACTIVE_MIN_ZOOM = 0.2;

export type ConvoIds = `0x${string}`[];

export const SPACES = JSON.parse(process.env.NEXT_PUBLIC_SPACES || "{}") as {
	[space: string]: ConvoIds;
};
