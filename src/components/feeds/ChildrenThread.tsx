import { useState } from "react";
import { BsFillSlashCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { GoInfo } from "react-icons/go";
import { usePointContext } from "../../contexts/PointContext";
import { Node } from "../../types/Points";
import PointWrapper from "../points/PointWrapper";

function VeracityThreadHeader({
	isVeracityVisible,
	setIsVeracityVisible,
	nbItems,
}: {
	isVeracityVisible: boolean;
	setIsVeracityVisible: React.Dispatch<React.SetStateAction<boolean>>;
	nbItems: number;
}) {
	function handleExpand(e: React.MouseEvent<HTMLButtonElement | MouseEvent>) {
		e.preventDefault();
		e.stopPropagation();
		setIsVeracityVisible(!isVeracityVisible);
	}

	return (
		<button
			type="button"
			className="flex flex-col items-start p-2 text-blue-800"
			onClick={(e) => handleExpand(e)}
		>
			<div className="flex flex-row items-center justify-start gap-2">
				{
					isVeracityVisible ?
						<BsFillXCircleFill size={18} color="rgb(30,64,175)" />
						// <BsChevronExpand size={18}/>
					:	<div className="w-[18px]">{nbItems}</div>
				}
				<p className="font-semibold">Counterpoints</p>
				<p className="font-normal text-gray-400">{`tap to ${
					isVeracityVisible ? "hide" : "show"
				}`}</p>

				<a
					href="https://responses.negationgame.com/"
					target="_blank"
					rel="noreferrer"
					className="flex flex-row items-center gap-1 hover:text-black"
				>
					<GoInfo size={18} color="#AAAAAA" />
				</a>
			</div>
			{isVeracityVisible && (
				<p className="font-light text-gray-400/80">
					these points ↓ are refuting the parent point ↑
				</p>
			)}
		</button>
	);
}

function RelevanceThreadHeader({
	isRelevanceVisible,
	setIsRelevanceVisible,
	nbItems,
}: {
	isRelevanceVisible: boolean;
	setIsRelevanceVisible: React.Dispatch<React.SetStateAction<boolean>>;
	nbItems: number;
}) {
	function handleExpand(e: React.MouseEvent<HTMLButtonElement | MouseEvent>) {
		e.preventDefault();
		e.stopPropagation();
		setIsRelevanceVisible(!isRelevanceVisible);
	}

	return (
		<button
			type="button"
			className="flex flex-col items-start p-2 text-gray-400"
			onClick={(e) => handleExpand(e)}
		>
			<div className="flex flex-row items-center justify-center gap-2 text-purple-800">
				{
					isRelevanceVisible ?
						<BsFillSlashCircleFill size={18} color="rgb(107, 33, 168)" />
						// <BsChevronExpand size={18}/>
					:	<div className="w-[18px]">{nbItems}</div>
				}
				<p className="font-semibold">Objections</p>
				<p className="font-normal text-gray-400">{`tap to ${
					isRelevanceVisible ? "hide" : "show"
				}`}</p>
				<a
					href="https://responses.negationgame.com/"
					target="_blank"
					rel="noreferrer"
					className="flex flex-row items-center gap-1 hover:text-black"
				>
					<GoInfo size={18} color="#AAAAAA" />
				</a>
			</div>
			{isRelevanceVisible && (
				<p className="font-light text-gray-400/80">
					these points ↓ reject the validity of the parent point ↑ in this
					context
				</p>
			)}
		</button>
	);
}

export default function ChildrenThread({
	type,
	level,
	setHistoricalItems,
	getParentAncestry,
}: {
	type: "conviction" | "relevance";
	level: number;
	setHistoricalItems: React.Dispatch<
		React.SetStateAction<string[] | undefined>
	>;
	getParentAncestry: undefined | (() => string | undefined);
}) {
	const { point, children, setChildren, detailsOpened, refreshChildren } =
		usePointContext();
	const [threadVisible, setThreadVisible] = useState(true);

	return (
		<>
			{children[type] && children[type].length > 0 && detailsOpened && (
				<div className="my-2 ml-2 flex  flex-col gap-2 border-l border-black pl-3 sm:ml-6 lg:ml-8">
					{type === "relevance" && (
						<RelevanceThreadHeader
							isRelevanceVisible={threadVisible}
							setIsRelevanceVisible={setThreadVisible}
							nbItems={
								children[type].filter((child: Node) => child.type !== "input")
									.length
							}
						/>
					)}
					{type === "conviction" && (
						<VeracityThreadHeader
							isVeracityVisible={threadVisible}
							setIsVeracityVisible={setThreadVisible}
							nbItems={
								children[type].filter((child: Node) => child.type !== "input")
									.length
							}
						/>
					)}
					{threadVisible && (
						<div className="flex w-full flex-col gap-1">
							{children[type].map((el: Node, i: number) => {
								return (
									<PointWrapper
										key={el.id}
										level={level + 1}
										point={el}
										parent={point}
										setHistoricalItems={setHistoricalItems}
										setParentChildren={setChildren}
										refreshParentThread={refreshChildren}
										getParentAncestry={getParentAncestry}
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
