import { Signer } from "neynar-next/server";
import getNotifications from "./getNotifications";

export default async function getNbNewNotifications(signer: Signer | null) {
	if (!signer) return 0;
	try {
		let result: any[] | undefined = await getNotifications(signer);
		if (!result) return 0;
		let [notifications, cursor] = result;
		let previousNotif = localStorage.getItem("most_recent_notification") || "";
		let nbNotifications = 0;

		notifications.map((notification: any, i: number) => {
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
