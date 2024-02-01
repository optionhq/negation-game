export const DEFAULT_CHANNELID = "https://negationgame.com";

export const NEGATION_SYMBOL = "nah";

export const GRAPH_INTERACTIVE_MIN_ZOOM = 0.2;

export type ConvoIds = `0x${string}`[];

export const SPACES = JSON.parse(process.env.NEXT_PUBLIC_SPACES || "{}") as {
	[space: string]: ConvoIds;
};
