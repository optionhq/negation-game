"use client";

import NotificationWrapper from "@/components/notifications/NotificationWrapper";
import { useSigner } from "@/contexts/SignerContext";
import getNotifications from "@/lib/notifications/getNotifications";
import { Notification } from "@/types/Notification";

import { useCallback, useEffect, useRef, useState } from "react";

const NB_NOTIF = 50;
export default function Notifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const { signer } = useSigner();
	const [previousNotif, setPreviousNotif] = useState<string>("");
	const cursor = useRef<string>();
	const loader = useRef(null);

	async function loadMoreNotifications() {
		if (cursor.current == null) return;
		const result: [Notification[], string] | null = await getNotifications(
			signer,
			NB_NOTIF,
			cursor.current,
		);
		if (!result) return;
		const [_notifications, nextCursor] = result;
		cursor.current = nextCursor;
		setNotifications((prev) => prev.concat(_notifications));
	}

	async function fetchNotifications() {
		const old_most_recent =
			localStorage.getItem("most_recent_notification") || "";
		setPreviousNotif(old_most_recent);
		localStorage.setItem("old_most_recent_notification", old_most_recent);
		const result: [Notification[], string] | null = await getNotifications(
			signer,
			NB_NOTIF,
		);
		if (!result || !result[0].length) return;

		const [_notifications, nextCursor] = result;
		localStorage.setItem(
			"most_recent_notification",
			_notifications[0].most_recent_timestamp,
		);
		cursor.current = nextCursor;
		setNotifications(_notifications);
	}

	const handleObserver: IntersectionObserverCallback = useCallback(
		(entities) => {
			const target = entities[0];
			if (target.isIntersecting) loadMoreNotifications();
		},
		[],
	);

	useEffect(() => {
		setNotifications([]);
		if (signer) fetchNotifications();
		const options = { root: null, rootMargin: "20px", threshold: 1.0 };
		const _observer = new IntersectionObserver(handleObserver, options);
		if (loader.current) _observer.observe(loader.current);
	}, [signer, handleObserver]);

	return (
		<div className="mx-4 flex flex-1 justify-center py-6 sm:py-12 md:mx-12 ">
			<div className="flex flex-col items-center gap-2">
				{notifications.map((notif, i) => (
					<NotificationWrapper
						notification={notif}
						key={notif.cast?.hash}
						previousNotif={previousNotif}
					/>
				))}
				<div className="loader" ref={loader} />
			</div>
		</div>
	);
}
