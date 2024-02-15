import { Cast as NeynarCast } from "neynar-next/server";

export interface User
	extends Pick<
		NeynarCast["author"],
		"fid" | "username" | "display_name" | "pfp_url"
	> {}

export interface Reactions extends Pick<NeynarCast["reactions"], "likes"> {}

export interface Cast
	extends Pick<
		NeynarCast,
		"text" | "hash" | "parent_hash" | "replies" | "embeds"
	> {
	author: User;
	reactions: Reactions;
}

export type Node = {
	title: string;
	id?: string;
	author?: User;
	parentId?: string;
	parentType?: "root" | "input" | "negation" | "comment";
	points?: number;
	replyCount?: number;
	advocates?: { fid: number }[];
	children?: Node[];
	type: "root" | "input" | "negation" | "comment" | "publishing";
	negationType?: "relevance" | "conviction";
	// TODO: once we've switched to the real network, endPoint should be required
	endPoint?: Node;
	endPointUrl?: string;
};
