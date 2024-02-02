import { fetchGraph } from "@/lib/actions/fetchGraph";
import { usePointIds } from "@/lib/hooks/usePointIds";
import { getMaybeNegation } from "@/lib/useCasts";
import { Node } from "@/types/Points";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiChevronLeft, BiLoaderAlt } from "react-icons/bi";
import useSWR from "swr";
import { Graph } from "../Graph";
import { style } from "../Graph.style";
import HistoricalPoints from "../points/HistoricalPoints";
import PointWrapper from "../points/PointWrapper";

export default function PointFeed({
	fromPage,
}: { fromPage: "home" | "space" }) {
	const [historicalPointIds, setHistoricalPointIds] = useState<
		string[] | undefined
	>([]);
	const [ids, setIds] = usePointIds();
	const rootPointId = useMemo(() => {
		const allPoints = ids?.split(",");
		return allPoints ? allPoints[allPoints?.length - 1] : undefined;
	}, [ids]);
	const focusedElementId = useMemo(() => ids?.split(",")[0], [ids]);
	const pointIds = useMemo(() => ids?.split(",") ?? [], [ids]);
	const [point, setPoint] = useState<Node>();

	const { data: pointGraph } = useSWR(["graph", rootPointId], () =>
		rootPointId ? fetchGraph(rootPointId.substring(2)) : null,
	);

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
		<div className="flex flex-row-reverse overflow-clip w-full h-full ">
			<div className="w-full h-full flex flex-grow items-center justify-center bg-gray-100">
				{!pointGraph && (
					<BiLoaderAlt size={128} className="animate-spin text-purple-200" />
				)}
				{pointGraph && (
					<Graph
						className="relative w-full h-full bg-gray-100"
						elements={pointGraph}
						graphStyle={style}
						focusedElementId={focusedElementId?.substring(2)}
					/>
				)}
			</div>
			<div className="relative flex flex-col overflow-scroll shrink-0  gap-2 items-start p-4 justify-start h-full w-[450px] bg-white shadow-lg">
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
		</div>
	);
}
