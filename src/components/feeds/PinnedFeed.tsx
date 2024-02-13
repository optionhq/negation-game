"use client";

import LoadingPane from "@/app/loading";
import { getMaybeNegation } from "@/lib/useCasts";
import { Node } from "@/types/Points";
import axios from "axios";
import { Cast } from "neynar-next/server";
import useSWR, { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import MakePointButton from "../MakePointButton";
import PointWrapper from "../points/PointWrapper";

const fetchPinnedCasts = async () => {
	const fetchedPinnedCasts: Node[] = [];
	const pinnedHashes = process.env.NEXT_PUBLIC_PINNED?.split(",");

	if (pinnedHashes) {
		for (const hash of pinnedHashes) {
			const cast = await axios.get(
				`/api/cast?type=hash&identifier=${hash.trim()}`,
			);
			fetchedPinnedCasts.push(await getMaybeNegation(cast.data as Cast));
		}
	}
	return fetchedPinnedCasts;
};

export default function PinnedFeed() {
	const { data: pinnedPoints, mutate: refreshPinnedPoints } = useSWR(
		"pinned-points",
		fetchPinnedCasts,
	);

	if (!pinnedPoints) return <LoadingPane />;

	return (
		<div className="relative flex flex-col items-center gap-4 py-4">
			<div className="centered-element flex flex-col gap-1">
				{pinnedPoints?.map((e: Node, i: number) => (
					<PointWrapper
						key={e.id}
						level={0}
						point={e}
						parent={undefined}
						setHistoricalItems={() => {}}
						setParentChildren={() => {}}
						getParentAncestry={undefined}
						refreshParentThread={async () => {
							await refreshPinnedPoints();
						}}
					/>
				))}
			</div>

			<MakePointButton
				classNames={{ button: "sticky bottom-4 z-50 mx-5 self-end shadow-md" }}
				refreshThread={async () =>
					mutate(unstable_serialize(() => ["allPoints", undefined]))
				}
			/>
		</div>
	);
}
