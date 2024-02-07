"use client";

import { Graph } from "@/components/Graph";
import HomeFeed from "@/components/feeds/HomeFeed";
import PointFeed from "@/components/feeds/PointFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsAtLeast } from "@/lib/hooks/useIsAtLeast";
import { usePointIds } from "@/lib/hooks/usePointIds";
import { BiChevronLeft } from "react-icons/bi";
import { PiGraphBold, PiRowsBold } from "react-icons/pi";

interface PointParams {
	id: string;
}

export default function Page() {
	const { ids, setIds, rootPointId, focusedElementId } = usePointIds();
	const isAtLeastMd = useIsAtLeast("md");

	if (!ids) {
		return <HomeFeed />;
	}

	return (
		<Tabs
			defaultValue="thread"
			className="flex flex-col w-full h-full flex-grow gap-0 overflow-clip"
		>
			<div className="grid items-center grid-cols-2 bg-slate-50 z-10 shadow-sm p-2">
				<div
					onClick={() => {
						setIds(null);
					}}
					className="flex items-center justify-start font-medium cursor-pointer my-2 hover:bg-slate-100 rounded-md text-gray-500 z-10"
				>
					<BiChevronLeft size={20} />
					<p className="px-2">Back to Home</p>
				</div>
				{!isAtLeastMd && (
					<TabsList className="bg-slate-100 w-fit h-fit rounded-md shadow-inner justify-self-end px-6 gap-4 py-2  ">
						<TabsTrigger value="thread" className="h-10 gap-2">
							<PiRowsBold size={20} />
							<h2 className="font-semibold">Thread</h2>
						</TabsTrigger>
						<TabsTrigger value="graph" className="h-10 gap-2">
							<PiGraphBold size={20} />
							<h2 className="font-semibold">Graph</h2>
						</TabsTrigger>
					</TabsList>
				)}
			</div>
			<TabsContent
				value="thread"
				className="data-[state=active]:flex flex-grow w-full overflow-clip m-0 transition-none"
			>
				<PointFeed className="h-full w-full overflow-scroll md:w-[450px] shadow-lg shrink-0" />
				{isAtLeastMd && (
					<Graph
						key={"graph"}
						rootPointId={rootPointId}
						focusedElementId={focusedElementId}
						className="h-full overflow-clip"
					/>
				)}
			</TabsContent>
			<TabsContent
				value="graph"
				className="data-[state=active]:flex flex-grow w-full overflow-clip m-0 transition-none"
			>
				{isAtLeastMd && (
					<PointFeed className="h-full w-full overflow-scroll md:w-[450px] shadow-lg shrink-0" />
				)}
				<Graph
					key={"graph"}
					rootPointId={rootPointId}
					focusedElementId={focusedElementId}
					className="h-full overflow-clip"
				/>
			</TabsContent>
		</Tabs>
	);
}
