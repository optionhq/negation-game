import { useState } from "react";
import { GoComment } from "react-icons/go";
import { usePointContext } from "../../contexts/PointContext";
import { Node } from "../../types/Points";
import PointWrapper from "../points/PointWrapper";

function CommentThreadHeader({
	isrelevanceVisible,
	setIsrelevanceVisible,
	nbItems,
}: {
	isrelevanceVisible: boolean;
	setIsrelevanceVisible: React.Dispatch<React.SetStateAction<boolean>>;
	nbItems: number;
}) {
	function handleExpand(e: React.MouseEvent<HTMLButtonElement | MouseEvent>) {
		e.preventDefault();
		e.stopPropagation();
		setIsrelevanceVisible(!isrelevanceVisible);
	}

	return (
		<button
			type="button"
			className="flex flex-col items-start p-2 text-gray-400"
			onClick={(e) => handleExpand(e)}
		>
			<div className="flex flex-row items-center justify-center gap-2 text-rose-800">
				{isrelevanceVisible ?
					<GoComment size={18} color="rgb(168, 33, 105)" />
				:	<div className="w-[18px]">{nbItems}</div>}
				<p className="font-semibold">{`Comment${
					nbItems > 1 || isrelevanceVisible ? "s" : ""
				}`}</p>
				<p className="font-normal text-gray-400">{`tap to ${
					isrelevanceVisible ? "hide" : "show"
				}`}</p>
			</div>
		</button>
	);
}

export default function CommentsThread({ level }: { level: number }) {
	const { point, children, setChildren, detailsOpened, refreshChildren } =
		usePointContext();
	const [threadVisible, setThreadVisible] = useState(false);

	return (
		<>
			{children.comment.length > 0 && children.comment && detailsOpened && (
				<div className="my-2 ml-2 flex  flex-col gap-2 border-l border-black pl-3 sm:ml-6 lg:ml-8">
					<CommentThreadHeader
						isrelevanceVisible={threadVisible}
						setIsrelevanceVisible={setThreadVisible}
						nbItems={children.comment.length}
					/>
					{threadVisible && (
						<div className="flex w-full flex-col gap-1">
							{children.comment.map((el: Node, i: number) => {
								return (
									<PointWrapper
										key={el.id}
										level={level + 1}
										point={el}
										parent={point}
										setParentChildren={setChildren}
										refreshParentThread={refreshChildren}
										getParentAncestry={() => ""}
									/>
								);
							})}
						</div>
					)}
				</div>
			)}
		</>
	);
}
