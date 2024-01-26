"use client";

import { useSigner } from "@/contexts/SignerContext";
import { usePathname } from "next/navigation";
import { BiSolidGroup } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { MdNotifications } from "react-icons/md";
import { PiGraphBold } from "react-icons/pi";
import HeaderElement from "./HeaderElement";

export default function MobileBottomHeader() {
	const { signer } = useSigner();
	const pathName = usePathname();

	return (
		<ul className="flex sm:hidden flex-row gap-1 text-sm items-center w-full justify-center p-1 bg-slate-50 border sticky bottom-0">
			<HeaderElement
				Icon={HiHome}
				name="Home"
				path="/"
				currentPath={pathName === "/"}
			/>
			<HeaderElement
				Icon={BiSolidGroup}
				name="Spaces"
				path="/spaces"
				currentPath={pathName === "/spaces"}
			/>
			<HeaderElement
				Icon={PiGraphBold}
				name="Graph"
				path="/graph"
				currentPath={pathName === "/graph"}
			/>
			{signer && (
				<HeaderElement
					Icon={MdNotifications}
					name="Notifications"
					path="/notifications"
					currentPath={pathName === "/notifications"}
				/>
			)}
		</ul>
	);
}
