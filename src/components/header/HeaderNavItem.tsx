import Link from "next/link";
import { IconType } from "react-icons";

export default function HeaderNavItem({
	name,
	Icon,
	path,
	currentPath,
	nbNotifs,
}: {
	name: string;
	Icon: IconType;
	path: string;
	currentPath: boolean;
	nbNotifs?: number;
}) {
	return (
		<button type="button">
			<Link
				href={path}
				className="flex w-20 flex-row  items-center justify-center gap-0 rounded-md px-2 py-2 hover:bg-black/5 sm:w-28 sm:px-4 lg:w-40 lg:gap-2"
			>
				<div className="relative p-1 sm:p-3">
					<Icon color={currentPath ? "#000" : "#BBB"} size={16} />
					{name === "Notifications" &&
						nbNotifs !== undefined &&
						nbNotifs > 0 && (
							<div className=" absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
								{nbNotifs}
							</div>
						)}
				</div>
				<p
					className={`${
						currentPath ? " font-medium" : " text-black/70"
					} hidden sm:flex`}
				>
					{name}
				</p>
			</Link>
		</button>
	);
}
