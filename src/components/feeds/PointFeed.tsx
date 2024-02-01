import { usePointIds } from "@/lib/hooks/usePointIds";
import { getMaybeNegation } from "@/lib/useCasts";
import { Node } from "@/types/Points";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Cast } from "neynar-next/server";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import HistoricalPoints from "../points/HistoricalPoints";
import PointWrapper from "../points/PointWrapper";

export default function PointFeed({
	fromPage,
}: { fromPage: "home" | "space" }) {
	const [historicalPointIds, setHistoricalPointIds] = useState<
		string[] | undefined
	>([]);
	const [ids, setIds] = usePointIds();
	const pointIds = useMemo(() => ids?.split(",") ?? [], [ids]);
	const selectedPointId = pointIds?.[0];
	const { back } = useRouter();
	const [point, setPoint] = useState<Node>();

	const init = useCallback(async () => {
		// // if it's a history of selected casts, get the first one
		if (pointIds.length > 1) setHistoricalPointIds(pointIds.slice(1));
		else setHistoricalPointIds(undefined);

		const cast = await axios.get(
			`/api/cast?type=hash&identifier=${selectedPointId}`,
		);

		setPoint(await getMaybeNegation(cast.data as Cast));
	}, [pointIds, selectedPointId]);

	useEffect(() => {
		init();
	}, [init]);

	if (!point) return;
	return (
		<div className=" flex flex-col centered-element gap-2 items-start justify-start py-4 w-auto">
			<div
				onClick={() => {
					setIds(null);
				}}
				className="flex flex-row py-2 mb-4 font-medium cursor-pointer hover:bg-slate-100 rounded-md text-gray-500"
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
