"use client";

import LoadingPane from "@/app/loading";
import { DEFAULT_CHANNELID } from "@/config";
import { getMaybeNegation } from "@/lib/useCasts";
import { Node } from "@/types/Points";
import axios from "axios";
import useSWRInfinite from "swr/infinite";
import { useIntersectionObserver, useUpdateEffect } from "usehooks-ts";
import MakePointButton from "../MakePointButton";
import PointWrapper from "../points/PointWrapper";

async function fetchFeed({
	limit,
	cursor,
}: {
	limit: number;
	cursor?: string;
}) {
	const points: Node[] = [];

	const url = `/api/feed/${encodeURIComponent(
		DEFAULT_CHANNELID,
	)}?limit=${limit}${cursor !== undefined ? `&cursor=${cursor}` : ""}`;
	const feed = await axios.get(url);

	if (!feed.data.casts) return;
	for (const cast of feed.data.casts) {
		if (cast !== null) {
			points.push(await getMaybeNegation(cast));
		}
	}
	return { points, cursor: feed.data.next?.cursor };
}

export const ALL_POINTS_KEY = "allPoints";

export default function AllPointsFeed() {
	const {
		data: pointPages,
		mutate: refreshCasts,
		setSize,
	} = useSWRInfinite(
		(_, previousPageData) => {
			return ["allPoints", previousPageData?.cursor];
		},
		([, cursor]) => {
			return fetchFeed({ limit: 25, cursor });
		},
	);

	const { ref: loaderRef, isIntersecting } = useIntersectionObserver({
		root: null,
		rootMargin: "20px",
		threshold: 1.0,
	});

	useUpdateEffect(() => {
		if (!isIntersecting) return;

		setSize((size) => size + 1);
	}, [isIntersecting, setSize]);

	if (!pointPages) return <LoadingPane />;

	return (
		<div className="relative flex flex-col items-center gap-4 py-4">
			<div className="centered-element flex flex-col gap-1">
				{pointPages
					?.flatMap((page) => page?.points ?? [])
					.map((e: Node, i: number) => (
						<PointWrapper
							key={e.id}
							level={0}
							point={e}
							parent={undefined}
							setHistoricalItems={() => {}}
							setParentChildren={() => {}}
							getParentAncestry={undefined}
							refreshParentThread={async () => {
								await refreshCasts();
							}}
						/>
					))}
			</div>
			<div className="loading h-10" ref={loaderRef} />

			<MakePointButton
				classNames={{ button: "sticky bottom-4 z-50 mx-5 self-end shadow-md" }}
				refreshThread={async () => {
					await refreshCasts();
				}}
			/>
		</div>
	);
}
