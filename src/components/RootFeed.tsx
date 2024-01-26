import { Node } from "../types/Points";
import PointWrapper from "./PointWrapper";
import { AiOutlinePushpin } from "react-icons/ai";
import { GoListUnordered } from "react-icons/go";
import { useRouter } from "next/router";

export default function RootFeed({
	data,
	pinned = false,
	setData,
	setHistoricalItems,
	refreshThread,
}: {
	data: Node[] | null;
	pinned?: boolean;
	setData: React.Dispatch<React.SetStateAction<Node[]>>;
	setHistoricalItems: React.Dispatch<
		React.SetStateAction<string[] | undefined>
	>;
	refreshThread: () => Promise<void>;
}) {
	const router = useRouter();

	if (pinned && (router.query.id || router.query.conversation || !data))
		return <></>;
	return (
		<div className={pinned ? "mb-12" : ""}>
			{!router.query.id &&
				!router.query.conversation &&
				data &&
				data.length > 0 && (
					<div className="flex flex-row gap-2 pb-3 items-center centered-element">
						{pinned ? (
							<AiOutlinePushpin size={20} />
						) : (
							<GoListUnordered size={20} />
						)}
						<h2 className="font-semibold">
							{`${pinned ? "Starting" : "All"}`} points
						</h2>
					</div>
				)}
			<div className="flex flex-col gap-1 centered-element">
				{data?.map((e: any, i: number) => (
					<PointWrapper
						key={e.id}
						level={0}
						point={e}
						parent={undefined}
						setHistoricalItems={setHistoricalItems}
						setParentChildren={setData}
						getParentAncestry={undefined}
						refreshParentThread={refreshThread}
					/>
				))}
			</div>
		</div>
	);
}
