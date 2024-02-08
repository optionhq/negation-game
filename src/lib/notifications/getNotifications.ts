import axios from "axios";
import { Signer } from "neynar-next/server";
import { DEFAULT_CHANNELID } from "@/config";
import { Notification } from "@/types/Notification";

export default async function getNotifications(
	signer: Signer | null,
	amount?: number,
	cursor?: string,
): Promise<[Notification[], string] | null> {
	if (!signer) return null;

	try {
		// localStorage.removeItem("old_most_recent_notification")
		// localStorage.removeItem("most_recent_notification")
		const url = `/api/notifications/${encodeURIComponent(DEFAULT_CHANNELID)}?user=${
			//@ts-ignore
			signer?.fid
		}&limit=${amount ?? 25}${cursor ? `&cursor=${cursor}` : ""}`;
		const feed = await axios.get(url);
		const nextCursor: string = feed.data.next.cursor;
		return [feed.data.notifications, nextCursor];
	} catch (e) {
		console.error(e);
		return null;
	}
}
