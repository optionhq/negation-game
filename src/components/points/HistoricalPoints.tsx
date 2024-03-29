"use client";

import { usePointIds } from "@/lib/hooks/usePointIds";
import axios from "axios";
import { useEffect, useState } from "react";
import { getMaybeNegation } from "../../lib/useCasts";
import { Cast, Node } from "../../types/Points";

export function HistoricalPoint({
	id,
	onClick,
}: {
	id: string;
	onClick: () => void;
}) {
	const [cast, setCast] = useState<Node | null>(null);
	const [deleted, setDeleted] = useState(false);
	useEffect(() => {
		const fetchCast = async () => {
			const res = await axios.get(`/api/cast?type=hash&identifier=${id}`);
			if (res) {
				console.log(res);
				if (res.data === "") {
					setDeleted(true);
					return;
				}
				const cast: Cast = res.data;
				const maybeNegation = await getMaybeNegation(cast);
				setCast(maybeNegation);
			}
		};
		fetchCast();
	}, [id]);

	if (deleted)
		return <div className="italic text-gray-700">Deleted point.</div>;
	return (
		<div
			className="relative flex w-auto cursor-pointer gap-2 rounded-md px-2 py-4 hover:bg-gray-100"
			onClick={onClick}
		>
			{!cast && <p>Loading ...</p>}
			{cast && (
				<>
					<div className="absolute left-8 h-1/2 w-[1px] translate-y-full bg-black" />
					<p className="px-auto w-12 rounded-md bg-slate-100 text-center text-gray-500">
						{cast.endPoint ?
							cast.endPoint.advocates?.length
						:	cast.advocates?.length}
					</p>
					<p className="font-medium text-gray-900">
						{cast.endPoint ? cast.endPoint.title : cast.title}
					</p>
				</>
			)}
		</div>
	);
}

export default function HistoricalPoints({ ids }: { ids: string[] }) {
	const { setIds } = usePointIds();

	function onClick(id: string) {
		const index = ids.indexOf(id);
		const newIds = ids.slice(index);

		setIds(newIds.join(","));
	}

	return (
		<div className="flex w-full flex-col-reverse space-y-0">
			{ids.map((id, i) => (
				<HistoricalPoint id={id} onClick={() => onClick(id)} key={id} />
			))}
		</div>
	);
}
