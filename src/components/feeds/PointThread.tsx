import { usePointIds } from "@/lib/hooks/usePointIds";
import { getMaybeNegation } from "@/lib/useCasts";
import { cn } from "@/lib/utils";
import { Node } from "@/types/Points";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Loader } from "../Loader";
import HistoricalPoints from "../points/HistoricalPoints";
import PointWrapper from "../points/PointWrapper";

export default function PointThread({ className }: { className?: string }) {
	const { focusedElementId, historicalPointIds } = usePointIds();

	const { data: point, mutate: invalidate } = useSWR(
		["point", focusedElementId],
		async () =>
			await getMaybeNegation(
				await axios
					.get(`/api/cast?type=hash&identifier=${focusedElementId}`)
					.then((res) => res.data as Cast),
			),
	);

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
					setParentChildren={() => {}}
					getParentAncestry={undefined}
					refreshParentThread={async () => {
						invalidate();
					}}
				/>
			:	<div className="flex h-full w-full items-center justify-center">
					<Loader />
				</div>
			}
		</div>
	);
}
