import { Cast, User } from "neynar-next/server";

export type Reaction = {
	cast: Cast;
	object: "likes";
	user: User;
};

export type Notification = {
	cast: Cast;
	most_recent_timestamp: string;
	reactions: Reaction[];
	type: "reply" | "likes" | "mention" | "recasts";
};
