import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { IconType } from "react-icons";

export interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
	name: string;
	Icon: IconType;
	path: string;
	isActive: boolean;
	nbNotifs?: number;
}

export default function NavItem({
	name,
	Icon,
	path,
	isActive,
	nbNotifs,
	...props
}: NavItemProps) {
	return (
		// <Button
		// 	asChild
		// 	variant="ghost"

		// >
		<Link
			href={path}
			className={cn(
				"flex items-center justify-center gap-2 p-4 hover:text-violet-700",
				isActive ? "font-medium text-black" : "text-black/30",
			)}
			{...props}
		>
			<div className="relative">
				<Icon size={16} />
				{nbNotifs !== undefined && nbNotifs > 0 && (
					<div className="absolute -top-2 left-[-2px] flex items-center justify-center rounded-full bg-red-500 px-1 text-2xs text-white ">
						{nbNotifs}
					</div>
				)}
			</div>

			<p className="hidden sm:flex">{name}</p>
		</Link>
		// </Button>
	);
}
