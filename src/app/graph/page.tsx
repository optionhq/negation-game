"use client";
import { Graph } from "@/components/Graph";
import { style } from "@/components/Graph.style";
import { fetchGraph } from "@/lib/actions/fetchGraph";
import { BiLoaderAlt } from "react-icons/bi";
import useSWR from "swr";

export default function Page() {
	const { data } = useSWR("graph", () => fetchGraph());

	return (
		<div className="w-full h-full flex items-center justify-center">
			{!data && (
				<BiLoaderAlt size={128} className="animate-spin text-purple-200" />
			)}
			{data && (
				<Graph
					className="relative w-full h-full bg-gray-100"
					elements={data}
					graphStyle={style}
				/>
			)}
		</div>
	);
}
