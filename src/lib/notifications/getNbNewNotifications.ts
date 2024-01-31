import { Signer } from "neynar-next/server";
import getNotifications from "./getNotifications";
import { Notification } from "@/types/Notification";

export default async function getNbNewNotifications(signer: Signer | null) {
	if (!signer) return 0;
	try {
		const result: [Notification[], string] | null = await getNotifications(signer);
		if (!result) return 0;
		const [notifications, cursor] = result;
		const previousNotif = localStorage.getItem("most_recent_notification") || "";
		let nbNotifications = 0;

		notifications.map((notification: Notification, i: number) => {
			if (
				new Date(notification.most_recent_timestamp).getTime() >
				new Date(previousNotif).getTime() ||
				previousNotif === ""
			)
				nbNotifications += 1;
		});
		return nbNotifications;
	} catch (error) {
		console.error(error);
		return 0;
	}
}
