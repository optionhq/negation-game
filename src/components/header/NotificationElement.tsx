"use client";

import { useSigner } from "@/contexts/SignerContext";
import getNbNewNotifications from "@/lib/notifications/getNbNewNotifications";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import HeaderElement from "./HeaderElement";

export default function NotificationElement() {
	const [nbNotifs, setNbNotifs] = useState(0);
	const pathName = usePathname();
	const { signer } = useSigner();

	const fetchNotifications = useCallback(async () => {
		setNbNotifs(await getNbNewNotifications(signer));
	}, [signer]);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	return (
		<div onClick={() => setNbNotifs(0)}>
			<HeaderElement
				Icon={MdNotifications}
				name="Notifications"
				path="/notifications"
				currentPath={pathName === "/notifications"}
				nbNotifs={nbNotifs}
			/>
		</div>
	);
}
