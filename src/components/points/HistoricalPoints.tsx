import { usePointIds } from "@/lib/hooks/usePointIds";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useEffect, useState } from "react";
import { getMaybeNegation } from "../../lib/useCasts";
import { Node } from "../../types/Points";

export function HistoricalPoint({
	id,
	onClick,
}: { id: string; onClick: () => void }) {
	const [cast, setCast] = useState<Node | null>(null);

	useEffect(() => {
		const fetchCast = async () => {
			const res = await axios.get(`/api/cast?type=hash&identifier=${id}`);
			const cast: Cast = res.data;
			const maybeNegation = await getMaybeNegation(cast);
			setCast(maybeNegation);
		};
		fetchCast();
	}, [id]);

	return (
		<div
			className="relative flex cursor-pointer w-auto rounded-md hover:bg-gray-100 px-2 py-4 gap-2"
			onClick={onClick}
		>
			{!cast && <p>Loading ...</p>}
			{cast && (
				<>
					<div className="w-[1px] h-1/2 bg-black absolute left-8 translate-y-full" />
					<p className="text-gray-500 w-12 bg-slate-100 px-auto rounded-md text-center">
						{cast.endPoint
							? cast.endPoint.advocates?.length
							: cast.advocates?.length}
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
		<div className="flex space-y-0 flex-col-reverse w-full">
			{ids.map((id, i) => (
				<HistoricalPoint id={id} onClick={() => onClick(id)} key={id} />
			))}
		</div>
	);
}
