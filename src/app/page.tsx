"use client";

import { Graph } from "@/components/Graph";
import HomeFeed from "@/components/feeds/HomeFeed";
import PointThread from "@/components/feeds/PointThread";
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
			className="flex h-full w-full flex-grow flex-col gap-0 overflow-clip"
		>
			<div className="z-10 flex items-center justify-between bg-slate-50 p-2 shadow-sm">
				<div
					onClick={() => {
						setIds("");
					}}
					className="z-10 my-2 flex cursor-pointer items-center justify-start rounded-md font-medium text-gray-500 hover:bg-slate-100"
				>
					<BiChevronLeft size={20} />
					<p className="px-2">Home</p>
				</div>
				{!isAtLeastMd && (
					<TabsList className="grid h-fit grid-cols-2 justify-self-end shadow-inner xs:gap-4   ">
						<TabsTrigger
							value="thread"
							className="h-10 gap-2 text-sm xs:text-lg"
						>
							<PiRowsBold />
							<p className="font-semibold ">Thread</p>
						</TabsTrigger>
						<TabsTrigger
							value="graph"
							className="h-10 gap-2 text-sm xs:text-lg"
						>
							<PiGraphBold />
							<p className="font-semibold">Graph</p>
						</TabsTrigger>
					</TabsList>
				)}
			</div>
			<TabsContent
				value="thread"
				className="m-0 w-full flex-grow overflow-clip transition-none data-[state=active]:flex"
			>
				<PointThread className="h-full w-full shrink-0 overflow-scroll shadow-lg md:w-[450px]" />
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
				className="m-0 w-full flex-grow overflow-clip transition-none data-[state=active]:flex"
			>
				{isAtLeastMd && (
					<PointThread className="h-full w-full shrink-0 overflow-scroll shadow-lg md:w-[450px]" />
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
