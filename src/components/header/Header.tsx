"use client";

import { useSigner } from "@/contexts/SignerContext";
import { usePathname } from "next/navigation";
import { BiSolidGroup } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { PiGraphBold } from "react-icons/pi";
import Login from "../Login";
import HeaderElement from "./HeaderElement";
import NotificationElement from "./NotificationElement";

export default function Header() {
	const pathName = usePathname();
	const { signer } = useSigner();

	return (
		<header className="flex justify-between px-6 py-2 gap-6 bg-slate-50 border w-full sticky flex-col-reverse md:flex-row items-center top-0 z-50">
			<div className="hidden md:flex-1 md:flex" />
			<ul className="hidden sm:flex flex-row gap-1 text-sm md:text-base md:gap-4">
				<HeaderElement
					Icon={HiHome}
					name="Home"
					path="/"
					currentPath={pathName == "/"}
				/>
				<HeaderElement
					Icon={BiSolidGroup}
					name="Spaces"
					path="/spaces"
					currentPath={pathName?.split("/")[1] == "spaces"}
				/>
				<HeaderElement
					Icon={PiGraphBold}
					name="Graph"
					path="/graph"
					currentPath={pathName?.split("/")[1] == "graph"}
				/>
				{signer && <NotificationElement />}
			</ul>
			<div className="flex-1 flex justify-end w-full">
				<Login />
			</div>
		</header>
	);
}
