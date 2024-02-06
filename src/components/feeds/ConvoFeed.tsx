import { getMaybeNegation } from "@/lib/useCasts";
import { Node } from "@/types/Points";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import PointWrapper from "../points/PointWrapper";

export default function ConvoFeed({ conversation }: { conversation: string }) {
	const [topic, setTopic] = useState("");
	const isFetching = useRef(false);
	const [points, setPoints] = useState<Node[]>([]);

	async function fetchThread(pointId: string) {
		const points: Node[] = [];

		const response = await axios.get(`/api/cast/${pointId}/thread`);
		for (const cast of response.data.result.casts) {
			const point = await getMaybeNegation(cast);
			if (point.parentId === pointId) {
				points.push(point);
			}
		}
		points.sort((a, b) =>
			b.advocates?.length && a.advocates?.length
				? b.advocates.length - a.advocates.length
				: 0,
		);
		return points;
	}

	const fetchItems = useCallback(async () => {
		if (isFetching.current) return;
		isFetching.current = true;

		let _points: Node[] = [];
		_points = await fetchThread(conversation);

		setPoints(_points);
		isFetching.current = false;
	}, [conversation]);

	useEffect(() => {
		axios
			.get(`/api/cast?type=hash&identifier=${conversation}`)
			.then((response) => setTopic(response.data.text))
			.catch((error) => console.error(error));

		fetchItems();
	}, [conversation, fetchItems]);

	return (
		<div className="flex flex-col items-center gap-4 centered-element py-4">
			<h2 className="text-lg md:text-xl font-medium text-center p-6 border w-full bg-white sticky top-6 z-30 shadow-sm bg-gradient-to-tr from-purple-50 to-blue-50 ">
				{topic}
			</h2>
			<div className="flex flex-col gap-1 w-auto">
				{points?.map((e: Node, i: number) => (
					<PointWrapper
						key={e.id}
						level={0}
						point={e}
						parent={undefined}
						setHistoricalItems={() => {}}
						setParentChildren={() => {}}
						getParentAncestry={undefined}
						refreshParentThread={fetchItems}
					/>
				))}
			</div>
		</div>
	);
}
