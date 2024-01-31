import LikeIcon from "@/components/icons/Like";
import { isValidNegation } from "@/lib/isValidNegation";
import { getMaybeNegation } from "@/lib/useCasts";
import { Notification, Reaction } from "@/types/Notification";
import { Node } from "@/types/Points";
import { useEffect, useState } from "react";

function LikersTooltip({ reactions }: { reactions: Reaction[] }) {
	return (
		<span
			className="absolute flex flex-col top-0 bg-slate-50 border rounded-md p-2 px-4 w-44 left-0 gap-2"
			style={{ transform: "translateY(-100%)" }}
		>
			{reactions.slice(1).map((reaction: Reaction) => (
				<span key={reaction.user.username} onClick={(e) => e.stopPropagation()}>
					<a
						href={`https://warpcast.com/${reaction.user.username}`}
						className="font-semibold hover:underline"
						target="_blank"
						rel="noreferrer"
					>
						{reaction.user.username}
					</a>
				</span>
			))}
		</span>
	);
}

export default function LikeNotification({
	notification,
}: { notification: Notification }) {
	const [node, setNode] = useState<Node>();
	const [isLinkingPoint, setIsLinkingPoint] = useState<boolean>(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const likersLen = notification.reactions.length;

	const thirdPerson = likersLen > 1 ? "" : "s";

	async function getCast() {
		try {
			const _node = await getMaybeNegation(notification.cast);
			setIsLinkingPoint(isValidNegation(_node?.title));
			setNode(_node);
		} catch (error) {
			console.error("Error fetching cast:", error);
		}
	}

	useEffect(() => {
		getCast();
	}, []);

	return (
		<div className="flex flex-row gap-3 ">
			<LikeIcon color={node?.type === "negation" ? "#6b21a8" : "#1e40af"} />
			<div>
				<p className="">
					<span
						className="font-semibold hover:underline"
						onClick={(e) => e.stopPropagation()}
					>
						<a
							href={`https://warpcast.com/${notification.reactions[0].user.username}`}
							target="_blank"
							rel="noreferrer"
						>
							{notification.reactions[0].user.username}
						</a>
					</span>
					{likersLen > 1 && (
						<>
							<span> and </span>
							<span
								className="relative w-fit"
								onPointerEnter={() => setShowTooltip(true)}
								onPointerLeave={() => setShowTooltip(false)}
							>
								<span className="font-semibold hover:underline w-fit">
									{likersLen - 1} other{likersLen > 2 ? "s" : ""}
								</span>
								{showTooltip && (
									<LikersTooltip reactions={notification.reactions} />
								)}
							</span>
						</>
					)}
					<span>
						{" "}
						think{thirdPerson} your point is{" "}
						{isLinkingPoint ? "important" : "accurate"}.
					</span>
				</p>
				<div className="table table-fixed w-full overflow-hidden">
					{node &&
					((isLinkingPoint && node.endPoint?.title) || !isLinkingPoint) ? (
						<p className=" text-black/50 text-sm ">
							{isLinkingPoint ? node.endPoint?.title : node.title}
						</p>
					) : (
						<p className="text-black/50 text-sm">Deleted point.</p>
					)}
				</div>
			</div>
		</div>
	);
}
