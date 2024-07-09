import { Notification } from "@/types/Notification";
import Image from "next/image";

export default function MentionNotification({
	notification,
}: {
	notification: Notification;
}) {
	return (
		<div>
			<div className="flex flex-row items-center gap-2">
				<Image
					src={notification.cast?.author.pfp_url}
					alt="cast author"
					width={30}
					height={30}
					className="rounded-full"
				/>
				<p className="font-bold">{notification.cast?.author.display_name}</p>
			</div>
			<div className="table w-full table-fixed overflow-hidden">
				<p>{notification.cast?.text}</p>
			</div>
		</div>
	);
}
