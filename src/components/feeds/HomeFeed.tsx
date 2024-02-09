"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiOutlinePushpin } from "react-icons/ai";
import { GoListUnordered } from "react-icons/go";
import AllPointsFeed from "./AllPointsFeed";
import PinnedFeed from "./PinnedFeed";

export default function HomeFeed() {
	return (
		<Tabs
			defaultValue="pinned-points"
			className="relative flex h-full w-full flex-grow flex-col items-center gap-0 overflow-clip"
		>
			<div className="z-10 flex w-full items-center justify-center bg-slate-50 p-2 shadow-md">
				<TabsList className="grid h-fit grid-cols-2  shadow-inner">
					<TabsTrigger value="pinned-points" className="gap-2">
						<AiOutlinePushpin size={20} />
						<h2 className="font-semibold xs:text-lg">Pinned points</h2>
					</TabsTrigger>
					<TabsTrigger value="all-points" className="gap-2">
						<GoListUnordered size={20} />
						<h2 className="font-semibold xs:text-lg">All points</h2>
					</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent
				value="pinned-points"
				className="m-0 h-full w-full overflow-scroll"
			>
				<PinnedFeed />
			</TabsContent>
			<TabsContent
				value="all-points"
				className="m-0 h-full w-full overflow-scroll"
			>
				<AllPointsFeed />
			</TabsContent>
		</Tabs>
	);
}
