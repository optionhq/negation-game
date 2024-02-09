import { usePointIds } from "@/lib/hooks/usePointIds";
import { getMaybeNegation } from "@/lib/useCasts";
import { cn } from "@/lib/utils";
import { Node } from "@/types/Points";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "../Loader";
import HistoricalPoints from "../points/HistoricalPoints";
import PointWrapper from "../points/PointWrapper";

export default function PointThread({ className }: { className?: string }) {
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

	return (
		<div
			className={cn(
				"relative flex flex-col items-start justify-start gap-2 bg-white p-4",
				className,
			)}
		>
			{historicalPointIds && historicalPointIds?.length !== 0 && (
				<HistoricalPoints ids={historicalPointIds} />
			)}
			{point ?
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
			:	<div className="flex h-full w-full items-center justify-center">
					<Loader />
				</div>
			}
		</div>
	);
}
