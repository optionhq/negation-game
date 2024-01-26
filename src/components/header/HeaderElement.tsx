import Link from "next/link";
import { IconType } from "react-icons";

export default function HeaderElement({
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
		<button>
			<Link
				href={path}
				className="flex flex-row items-center  sm:gap-2 px-2 sm:px-4 py-2 w-20 sm:w-28 md:w-40 hover:bg-black/5 justify-center rounded-md"
			>
				<div className="relative p-1 sm:p-3">
					<Icon color={currentPath ? "#000" : "#BBB"} size={16} />
					{name == "Notifications" &&
						nbNotifs !== undefined &&
						nbNotifs > 0 && (
							<div className=" bg-red-500 rounded-full h-5 w-5 absolute top-0 right-0 text-xs flex items-center justify-center text-white">
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
