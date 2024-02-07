"use client";
import ConvoFeed from "@/components/feeds/ConvoFeed";
import PointFeed from "@/components/feeds/PointFeed";
import { usePointIds } from "@/lib/hooks/usePointIds";
import { BiChevronLeft } from "react-icons/bi";

export default function Page({
	params: { conversation },
}: { params: { conversation: string } }) {
	const { ids, setIds } = usePointIds();
	if (!ids) return <ConvoFeed conversation={conversation} />;

	return (
		<div className="flex flex-col w-full h-full flex-grow gap-0 overflow-clip">
			<div
				onClick={() => {
					setIds(null);
				}}
				className="flex items-center justify-start font-medium cursor-pointer my-2 hover:bg-slate-100 rounded-md text-gray-500 z-10"
			>
				<BiChevronLeft size={20} />
				<p className="px-2">Back to convo</p>
			</div>
			<PointFeed />;
		</div>
	);
}
