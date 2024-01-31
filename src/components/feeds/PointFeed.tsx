import { BiChevronLeft } from "react-icons/bi";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import HistoricalPoints from "../points/HistoricalPoints";
import { getMaybeNegation } from "@/lib/useCasts";
import axios from "axios";
import { Node } from "@/types/Points";
import { Cast } from "neynar-next/server";
import PointWrapper from "../points/PointWrapper";
import { usePointContext } from "@/contexts/PointContext";

export default function PointFeed({
	fromPage,
}: { fromPage: "home" | "space" }) {
	const [historicalPointIds, setHistoricalPointIds] = useState<
		string[] | undefined
	>([]);
	const router = useRouter();
	const [point, setPoint] = useState<Node>();

	const init = useCallback(async () => {
		const ids_string = router.query.id as string;
		if (!ids_string) {
			setHistoricalPointIds(undefined);
			return;
		}
		const ids = ids_string.split(",");

		// // if it's a history of selected casts, get the first one
		if (ids.length > 1) setHistoricalPointIds(ids.slice(1));
		else setHistoricalPointIds(undefined);

		const selectedPoint = ids[0];
		const cast = await axios.get(
			`/api/cast?type=hash&identifier=${selectedPoint}`,
		);

		setPoint(await getMaybeNegation(cast.data as Cast));
	}, [router]);

	useEffect(() => {
		init();
	}, [init]);

	if (!point) return;
	return (
		<div className=" flex flex-col centered-element gap-2 items-start justify-start py-4 w-auto">
			<div
				onClick={() => {
					router.push(
						fromPage === "space"
							? `/spaces/${router.query.space}/${router.query.conversation}`
							: "/",
					);
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
