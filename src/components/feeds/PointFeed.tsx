import { usePointIds } from "@/lib/hooks/usePointIds";
import { getMaybeNegation } from "@/lib/useCasts";
import { cn } from "@/lib/utils/cn";
import { Node } from "@/types/Points";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useCallback, useEffect, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import HistoricalPoints from "../points/HistoricalPoints";
import PointWrapper from "../points/PointWrapper";

export default function PointFeed({
	fromPage,
	className,
}: { fromPage: "home" | "space"; className?: string }) {
	const [historicalPointIds, setHistoricalPointIds] = useState<
		string[] | undefined
	>([]);
	const { setIds, pointIds, focusedElementId } = usePointIds();

	const [point, setPoint] = useState<Node>();

	const init = useCallback(async () => {
		// // if it's a history of selected casts, get the first one
		if (pointIds.length > 1) setHistoricalPointIds(pointIds.slice(1));
		else setHistoricalPointIds(undefined);

		const cast = await axios.get(
			`/api/cast?type=hash&identifier=${focusedElementId}`,
		);

		setPoint(await getMaybeNegation(cast.data as Cast));
	}, [pointIds, focusedElementId]);

	useEffect(() => {
		init();
	}, [init]);

	if (!point) return;
	return (
		<div
			className={cn(
				"relative flex flex-col overflow-scroll gap-2 items-start p-4 justify-start h-full w-full bg-white",
				className,
			)}
		>
			<div
				onClick={() => {
					setIds(null);
				}}
				className="flex flex-row py-2 mb-4 font-medium cursor-pointer hover:bg-slate-100 rounded-md text-gray-500 z-10"
			>
				<BiChevronLeft size={20} />
				<p className="px-2">
					{fromPage === "space" ? "Go back to conversation" : "Go to Home"}
				</p>
			</div>
			{historicalPointIds && historicalPointIds?.length !== 0 && (
				<HistoricalPoints ids={historicalPointIds} />
			)}
			<PointWrapper
				key={point.id}
				level={0}
				point={point}
				parent={undefined}
				setHistoricalItems={setHistoricalPointIds}
				setParentChildren={() => {}}
				getParentAncestry={undefined}
				refreshParentThread={init}
			/>
		</div>
	);
}
