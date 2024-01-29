import { MdNotifications } from "react-icons/md";
import Tooltip from "../Tooltip";
import NotificationsPanel from "./NotificationsPanel";
import { useState, useEffect } from "react";
import { Signer } from "neynar-next/server";

type VerifiedSigner = Signer & { fid?: string };

export default function NotificationButton({
	farcasterSigner,
}: { farcasterSigner: VerifiedSigner | null }) {
	const [panelOpened, setPanelOpened] = useState(false);
	const [nbNotif, setNbNotif] = useState(100);
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (panelOpened && farcasterSigner?.fid) {
			fetch(`/api/users/${(farcasterSigner as any).fid}/notifications`)
				.then((response) => response.json())
				.then((data) => setNotifications(data))
				.catch((error) => console.error("Error:", error));
		}
	}, [panelOpened, farcasterSigner]);

	function onOpenPanel() {
		setPanelOpened(!panelOpened);
		setNbNotif(0);
	}

	return (
		<div className="relative" onClick={onOpenPanel}>
			<Tooltip orientation="top" text="Notifications">
				<button className="relative flex items-center h-full justify-center border rounded-md bg-slate-100 hover:bg-slate-200 px-2">
					<MdNotifications size={24} />
					{nbNotif > 0 && (
						<div className="absolute left-full -translate-x-1/2 -top-1 bg-red-500 rounded-full py-1 px-2 text-xs text-white">
							{nbNotif < 100 ? nbNotif : "99+"}
						</div>
					)}
				</button>
			</Tooltip>
			{panelOpened && <NotificationsPanel notifications={notifications} />}
		</div>
	);
}
