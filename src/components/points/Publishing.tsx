import { usePointContext } from "@/contexts/PointContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Publishing({
	pointBg = "bg-white ",
	className,
}: {
	pointBg?: string;
	className?: string;
}) {
	const { point } = usePointContext();

	return (
		<div
			className={cn(
				pointBg,
				"w-full flex flex-col relative gap-3 font-medium cursor-pointer list-none pl-14 pr-5 py-3 rounded-md order-first border",
				className,
			)}
			onClick={(e) => e.stopPropagation()}
		>
			<p className="w-full">{point.title}</p>
			<div className="w-full flex justify-end">
				<p className="text-xs italic">Publishing</p>
			</div>
		</div>
	);
}
