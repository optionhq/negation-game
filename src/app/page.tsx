"use client";
import { Graph } from "@/components/Graph";
import HomeFeed from "@/components/feeds/HomeFeed";
import PointFeed from "@/components/feeds/PointFeed";
import { usePointIds } from "@/lib/hooks/usePointIds";

interface PointParams {
	id: string;
}

export default function Page() {
	const { ids, rootPointId, focusedElementId } = usePointIds();

	if (!ids) {
		return <HomeFeed />;
	}

	return (
		<div className="flex w-full h-full">
			<PointFeed fromPage="home" className="w-[450px] shadow-lg shrink-0" />
			<Graph
				rootPointId={rootPointId}
				focusedElementId={focusedElementId}
				className="w-full h-full flex-grow"
			/>
		</div>
	);
}
