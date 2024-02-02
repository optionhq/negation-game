import { Node } from "../../types/Points";
import { PointProvider } from "../../contexts/PointContext";
import InputNegation from "./InputNegation";
import Point from "./Point";
import { negate } from "../../lib/negate";
import publish from "../../lib/publish";
import Comment from "./Comment";
import { useSigner } from "@/contexts/SignerContext";
import { Dispatch, SetStateAction } from "react";

export default function PointWrapper({
	level,
	point,
	parent = undefined,
	setParentChildren,
	setHistoricalItems,
	getParentAncestry,
	refreshParentThread,
}: {
	level: number;
	point: Node;
	parent?: Node | undefined;
	setParentChildren?: Dispatch<
		SetStateAction<{
			relevance: Node[];
			conviction: Node[];
			comment: Node[];
		}>
	>;
	setHistoricalItems: Dispatch<SetStateAction<string[] | undefined>>;
	getParentAncestry: undefined | (() => string | undefined);
	refreshParentThread: () => Promise<void>;
}) {
	const { signer } = useSigner();
	const pointBg = `${
		level % 2
			? " bg-indigo-25 hover:bg-indigo-50"
			: " bg-slate-50 hover:bg-gray-100"
	}`;

	return (
		<PointProvider
			point={point}
			signer={signer}
			refreshParentThread={refreshParentThread}
		>
			{point.type === "input" && (
				<InputNegation
					pointBg={pointBg}
					placeHolder={
						point.negationType === "relevance"
							? `This point "${
									parent?.endPoint ? parent?.endPoint.title : parent?.title
							  }" isn't impactful because...`
							: `An alternative to "${
									parent?.endPoint ? parent?.endPoint.title : parent?.title
							  }" is...`
					}
					setParentChildren={setParentChildren}
					onPublish={async (text: string) => {
						const type = point.negationType;
						if (!type) return;

						if (point.parentId && signer)
							await negate(text, point.parentId, signer);
						else if (!point.parentId && signer) await publish(text, signer);
						setParentChildren?.((element) => {
							const filtered = {
								...element,
								[type]: element[type].filter(
									(child: Node) => child.type !== "input",
								),
							};
							return filtered;
						});
						refreshParentThread();
					}}
					onClose={() => {
						const type = point.negationType;
						if (type) {
							setParentChildren?.((element) => {
								const filtered = {
									...element,
									[type]: element[type].filter(
										(child: Node) => child.type !== "input",
									),
								};
								return filtered;
							});
						}
					}}
				/>
			)}
			{point.type === "comment" && <Comment level={level} />}
			{(point.type === "negation" || point.type === "root") && (
				<Point
					level={level}
					parent={parent}
					getParentAncestry={getParentAncestry}
					setHistoricalItems={setHistoricalItems}
				/>
			)}
		</PointProvider>
	);
}
