"use client";

import { useSigner } from "@/contexts/SignerContext";
import { useAmountNewNotifications } from "@/lib/notifications/useAmountNewNotifications";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BiSolidGroup } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { MdNotifications } from "react-icons/md";
import NavItem from "./NavItem";
("./NotificationElement");
("./NotificationElement");

export default function Navigation({ className }: { className?: string }) {
	const pathName = usePathname();
	const { signer } = useSigner();
	const {
		data: amountNewNotifications,
		mutate: refreshAmountNewNotifications,
	} = useAmountNewNotifications();

	return (
		<ul
			role="navigation"
			className={cn(
				"flex items-center",
				className,
			)}
		>
			<NavItem Icon={HiHome} name="Home" path="/" isActive={pathName === "/"} />
			<NavItem
				Icon={BiSolidGroup}
				name="Spaces"
				path="/spaces"
				isActive={pathName?.split("/")[1] === "spaces"}
			/>
			{signer && (
				<NavItem
					onClick={() => refreshAmountNewNotifications()}
					Icon={MdNotifications}
					name="Notifications"
					path="/notifications"
					isActive={pathName === "/notifications"}
					nbNotifs={amountNewNotifications}
				/>
			)}
		</ul>
	);
}
