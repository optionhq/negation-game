"use client";
import ConvoFeed from "@/components/feeds/ConvoFeed";
import PointThread from "@/components/feeds/PointThread";
import { usePointIds } from "@/lib/hooks/usePointIds";
import { BiChevronLeft } from "react-icons/bi";

export default function Page({
	params: { conversation, space },
}: {
	params: { conversation: string; space: string };
}) {
	const { ids, setIds } = usePointIds();
	if (!ids)
		return (
			<ConvoFeed
				conversation={conversation}
				space={space}
				className="h-full overflow-scroll"
			/>
		);

	return (
		<div className="flex h-full w-full flex-grow flex-col gap-0 overflow-scroll">
			<div
				onClick={() => {
					setIds("");
				}}
				className="z-10 my-2 flex cursor-pointer items-center justify-start rounded-md font-medium text-gray-500 hover:bg-slate-100"
			>
				<BiChevronLeft size={20} />
				<p className="px-2">Back to convo</p>
			</div>
			<PointThread />
		</div>
	);
}
