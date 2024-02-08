"use client";

import { useSigner } from "@/contexts/SignerContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BiSolidGroup } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { MdNotifications } from "react-icons/md";
import { PiGraphBold } from "react-icons/pi";
import HeaderNavItem from "./HeaderNavItem";

export default function MobileBottomHeader({
	className,
}: {
	className?: string;
}) {
	const { signer } = useSigner();
	const pathName = usePathname();

	return (
		<ul
			className={cn(
				"sticky bottom-0 flex w-full flex-row items-center justify-center gap-0 border bg-slate-50 p-1 text-sm",
				className,
			)}
		>
			<HeaderNavItem
				Icon={HiHome}
				name="Home"
				path="/"
				currentPath={pathName === "/"}
			/>
			<HeaderNavItem
				Icon={BiSolidGroup}
				name="Spaces"
				path="/spaces"
				currentPath={pathName === "/spaces"}
			/>
			<HeaderNavItem
				Icon={PiGraphBold}
				name="Graph"
				path="/graph"
				currentPath={pathName === "/graph"}
			/>
			{signer && (
				<HeaderNavItem
					Icon={MdNotifications}
					name="Notifications"
					path="/notifications"
					currentPath={pathName === "/notifications"}
				/>
			)}
		</ul>
	);
}
