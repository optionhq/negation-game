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
				"relative order-first flex w-full cursor-pointer list-none flex-col gap-3 rounded-md border py-3 pl-14 pr-5 font-medium",
				className,
			)}
			onClick={(e) => e.stopPropagation()}
		>
			<p className="w-full">{point.title}</p>
			<div className="flex w-full justify-end">
				<p className="text-xs italic">Publishing</p>
			</div>
		</div>
	);
}
