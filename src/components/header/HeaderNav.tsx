"use client";

import { useSigner } from "@/contexts/SignerContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BiSolidGroup } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { PiGraphBold } from "react-icons/pi";
import NavItem from "./NavItem";
import NotificationElement from "./NotificationElement";
("./NotificationElement");
("./NotificationElement");

export default function HeaderNav({ className }: { className?: string }) {
	const pathName = usePathname();
	const { signer } = useSigner();

	return (
		<ul
			className={cn(
				"flex flex-row justify-center gap-1 text-sm lg:gap-4 lg:text-base",
				className,
			)}
		>
			<NavItem
				Icon={HiHome}
				name="Home"
				path="/"
				currentPath={pathName === "/"}
			/>
			<NavItem
				Icon={BiSolidGroup}
				name="Spaces"
				path="/spaces"
				currentPath={pathName?.split("/")[1] === "spaces"}
			/>
			<NavItem
				Icon={PiGraphBold}
				name="Graph"
				path="/graph"
				currentPath={pathName?.split("/")[1] === "graph"}
			/>
			{signer && <NotificationElement />}
		</ul>
	);
}
