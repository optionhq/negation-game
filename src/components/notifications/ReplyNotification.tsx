import { useEffect, useState } from "react";
import CommentIcon from "../icons/Comment";
import NegateIcon from "../icons/Negate";
import { getMaybeNegation } from "@/lib/useCasts";
import { Notification } from "@/types/Notification";
import { isValidNegation } from "@/lib/isValidNegation";
import { Node } from "@/types/Points";
import axios from "axios";

export default function ReplyNotification({
	notification,
}: { notification: Notification }) {
	const [node, setNode] = useState<Node>();
	const [isLinkingPoint, setIsLinkingPoint] = useState<boolean>(false);
	const [parent, setParent] = useState<Node>();
	async function getCast() {
		try {
			const _node = await getMaybeNegation(notification.cast);
			setIsLinkingPoint(isValidNegation(_node?.title));
			setNode(_node);

			axios
				.get(`/api/cast?type=hash&identifier=0x${_node.parentId}`)
				.then(async (response) => {
					const _parent = await getMaybeNegation(response.data);
					setParent(_parent);
				})
				.catch((error) => console.error("Error fetching conversation:", error));
		} catch (error) {
			console.error("Error fetching cast:", error);
		}
	}

	useEffect(() => {
		getCast();
	}, []);

	return (
		<div className="flex flex-row gap-3">
			{node?.type === "root" ? (
				<CommentIcon />
			) : (
				<NegateIcon
					color={parent?.type === "negation" ? "#6b21a8" : "#1e40af"}
				/>
			)}

			<div className="flex flex-col gap-3">
				<p className="inline-block">
					<a
						className=" font-semibold hover:underline"
						href={`https://warpcast.com/${node?.author?.username}`}
						target="_blank"
						rel="noreferrer"
						onClick={(e) => e.stopPropagation()}
					>
						{node?.author?.username}
					</a>
					{node?.type === "negation"
						? ` negated ${
								parent?.type === "negation" ? "the importance" : "the accuracy"
						  } of your point.`
						: " replied to your point."}
				</p>
				<div className="table table-fixed w-full overflow-hidden">
					<div className="flex flex-col gap-2 ">
						{parent ? (
							<p className="text-sm text-black/50">
								{parent.type === "negation" && parent.endPoint
									? parent.endPoint.title
									: parent.title}
							</p>
						) : (
							<p className="text-black/50 text-sm">Deleted point</p>
						)}
						{node ? (
							<p className="">
								{node.type === "negation" ? node.endPoint?.title : node.title}
							</p>
						) : (
							<p className="">Deleted point</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
