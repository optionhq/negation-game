import { GoListUnordered } from "react-icons/go";
import { AiOutlinePushpin } from "react-icons/ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CastButton from "../CastButton";
import { useRouter } from "next/router";
import axios from "axios";
import { getMaybeNegation } from "@/lib/useCasts";
import { Node } from "@/types/Points";
import { Cast } from "neynar-next/server";
import { DEFAULT_CHANNELID } from "@/config";
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

async function fetchFeed({
	limit,
	cursor,
}: { limit: number; existingPoints?: Node[]; cursor?: string }) {
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

export default function HomeFeed() {
	const [selectedFeed, setSelectedFeed] = useState<"pinned" | "all">("pinned");
	const [pinnedPoints, setPinnedPoints] = useState<Node[]>([]);
	const [points, setPoints] = useState<Node[]>([]);
	const isFetching = useRef(false);

	const router = useRouter();
	const loader = useRef(null);
	const [observer, setObserver] = useState<IntersectionObserver>();
	const feedCursor = useRef<string | undefined>();

	const fetchCasts = useCallback(
		async ({
			onlyReload = false,
			number,
		}: { onlyReload?: boolean; number?: number | undefined } = {}) => {
			if (!router.isReady || isFetching.current) return;
			isFetching.current = true;

			let _points: Node[] = [];

			const cursor = !onlyReload ? feedCursor.current : undefined;
			const feedResult = await fetchFeed({
				limit: number || 25,
				cursor: cursor,
			});
			if (feedResult) {
				_points = feedResult.points;
				if (!onlyReload) feedCursor.current = feedResult.cursor;
			}
			setPoints((prev) => (onlyReload ? [..._points] : [...prev, ..._points]));
			isFetching.current = false;
		},
		[router],
	);

	const refreshCasts = useCallback(
		async () => fetchCasts({ onlyReload: true }),
		[fetchCasts],
	);

	const setPinnedCasts = useCallback(async () => {
		setPinnedPoints(await fetchPinnedCasts());
	}, []);

	const handleObserver: IntersectionObserverCallback = useCallback(
		(entities) => {
			const target = entities[0];
			if (target.isIntersecting) fetchCasts();
		},
		[fetchCasts],
	);

	useEffect(() => {
		async function init() {
			setPinnedPoints(await fetchPinnedCasts());
		}
		init();
		fetchCasts();
		const options = { root: null, rootMargin: "20px", threshold: 1.0 };
		const _observer = new IntersectionObserver(handleObserver, options);
		setObserver(_observer);
		if (loader.current) _observer?.observe(loader.current);
	}, [handleObserver, fetchCasts]);

	return (
		<div className="flex flex-col items-center gap-4 py-4">
			<div className="relative flex flex-row rounded-md p-3 bg-slate-50 border w-fit">
				<div
					className={`absolute w-40 bg-black/5 top-1 bottom-1 left-3 ${
						selectedFeed === "pinned" ? "" : "translate-x-full"
					} transition-all rounded-md`}
				/>
				<button
					type="button"
					className="flex flex-row gap-2 items-center justify-center w-40 z-40"
					onClick={() => setSelectedFeed("pinned")}
				>
					<AiOutlinePushpin size={20} />
					<h2 className="font-semibold">Pinned points</h2>
				</button>
				<button
					type="button"
					className="flex flex-row gap-2 items-center w-40 justify-center z-40"
					onClick={() => setSelectedFeed("all")}
				>
					<GoListUnordered size={20} />
					<h2 className="font-semibold">All points</h2>
				</button>
			</div>

			<div className="flex flex-col gap-1 centered-element">
				{selectedFeed === "all"
					? points?.map((e: Node, i: number) => (
							<PointWrapper
								key={e.id}
								level={0}
								point={e}
								parent={undefined}
								setHistoricalItems={() => {}}
								setParentChildren={() => {}}
								getParentAncestry={undefined}
								refreshParentThread={refreshCasts}
							/>
					  ))
					: pinnedPoints?.map((e: Node, i: number) => (
							<PointWrapper
								key={e.id}
								level={0}
								point={e}
								parent={undefined}
								setHistoricalItems={() => {}}
								setParentChildren={() => {}}
								getParentAncestry={undefined}
								refreshParentThread={setPinnedCasts}
							/>
					  ))}
			</div>
			<div className="loading h-10" ref={loader} />

			<CastButton
				conversation={router.query.conversation as string}
				refreshThread={async () => {}}
			/>
		</div>
	);
}
