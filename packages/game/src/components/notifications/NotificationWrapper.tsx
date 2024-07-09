import { getMaybeNegation } from "@/lib/useCasts";
import { Notification } from "@/types/Notification";
import { Node } from "@/types/Points";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LikeNotification from "./LikeNotification";
import MentionNotification from "./MentionNotification";
import ReplyNotification from "./ReplyNotification";

export default function NotificationWrapper({
	notification,
	previousNotif,
}: {
	notification: Notification;
	previousNotif: string;
}) {
	const [isNew, setIsNew] = useState(
		new Date(notification.most_recent_timestamp).getTime() >
			new Date(previousNotif).getTime() || previousNotif === "",
	);
	const [node, setNode] = useState<Node>();
	const router = useRouter();

	async function getCast() {
		try {
			if (notification.cast) {
				const _node = await getMaybeNegation(notification.cast);
				setNode(_node);
			}
		} catch (error) {
			console.error("Error fetching cast:", error);
		}
	}

	useEffect(() => {
		getCast();
	}, []);

	if (notification.type === "recasts") return <></>;
	const replyHistoric =
		notification.type === "reply" ? `,0x${node?.parentId}` : "";
	return (
		<div
			onClick={() => node && router.push(`/?ids=${node.id}${replyHistoric}`)}
			className={`w-full cursor-pointer rounded-md border p-4 hover:bg-slate-50 md:w-[500px] ${
				isNew ? "bg-indigo-600/10" : ""
			}`}
		>
			{notification.type === "mention" && (
				<MentionNotification notification={notification} />
			)}
			{notification.type === "likes" && (
				<LikeNotification notification={notification} />
			)}
			{notification.type === "reply" && (
				<ReplyNotification notification={notification} />
			)}
		</div>
	);
}
