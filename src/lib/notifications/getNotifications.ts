import axios from "axios";
import { Signer } from "neynar-next/server";
import { DEFAULT_CHANNELID } from "@/constants";

export default async function getNotifications(
	signer: Signer | null,
	amount?: number,
	cursor?: string,
) {
	if (!signer) return;

	try {
		// localStorage.removeItem("old_most_recent_notification")
		// localStorage.removeItem("most_recent_notification")
		//@ts-ignore
		const url = `/api/notifications/${"https%3A%2F%2Fnegationgame.com"}?user=${
			signer?.fid
		}&limit=${amount ?? 25}${cursor ? `&cursor=${cursor}` : ""}`;
		const feed = await axios.get(url);
		let nextCursor = feed.data.next.cursor;
		return [feed.data.notifications, nextCursor];
	} catch (e) {
		console.error(e);
	}
}
