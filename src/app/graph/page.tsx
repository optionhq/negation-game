"use client";
import { Graph } from "@/components/Graph";
import { fetchGraph } from "@/lib/actions/fetchGraph";
import useSWR from "swr";

export default function Page() {
	const { data } = useSWR("graph", () => fetchGraph());

	return (
		<div className="w-screen h-screen">
			{data && <Graph className="w-full h-full bg-gray-100" elements={data} />}
		</div>
	);
}
