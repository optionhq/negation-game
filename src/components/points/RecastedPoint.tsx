import { useEffect, useState } from "react";
import axios from "axios";
import { Node } from "../../types/Points";

export default function RecastedPoint({ url }: { url: string }) {
	const [data, setData] = useState<Node>();

	useEffect(() => {
		const fetchPointData = async () => {
			const res = await axios.get(`/api/endpoint?endPointUrl=${url}`);
			if (res.status === 200) {
				setData(res.data);
			}
		};
		fetchPointData();
	}, [url]);

	return (
		<div className="m-2 max-h-36 w-full rounded-md border border-slate-300 p-2">
			{data?.title}
		</div>
	);
}
