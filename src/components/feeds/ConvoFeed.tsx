import { getMaybeNegation } from "@/lib/useCasts";
import { cn } from "@/lib/utils";
import { Node } from "@/types/Points";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import PointWrapper from "../points/PointWrapper";

export default function ConvoFeed({
	conversation,
	space,
	className,
}: {
	conversation: string;
	space: string;
	className?: string;
}) {
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
			b.advocates?.length && a.advocates?.length ?
				b.advocates.length - a.advocates.length
			:	0,
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
		<div className={cn("flex w-full flex-col items-center gap-0 ", className)}>
			<div className="l z-10 flex w-full justify-center gap-2 divide-x bg-slate-50 p-2 shadow-sm">
				<Link href={`/spaces/${space}`} className="flex h-full items-center">
					<BiChevronLeft size={20} />
				</Link>
				<h2 className="text-md z-10 w-full justify-center p-2 text-center align-middle font-bold">
					{topic}
				</h2>
			</div>
			<div className="flex w-auto flex-grow flex-col gap-1 overflow-scroll py-2">
				{points?.map((e: Node, i: number) => (
					<PointWrapper
						key={e.id}
						level={0}
						point={e}
						parent={undefined}
						setParentChildren={() => {}}
						getParentAncestry={undefined}
						refreshParentThread={fetchItems}
					/>
				))}
			</div>
		</div>
	);
}
