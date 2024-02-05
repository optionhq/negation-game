import { useSigner } from "@/contexts/SignerContext";
import { negate } from "@/lib/actions/negate";
import { addNegation } from "@/lib/cytoscape/addNegation";
import { assignDissonance } from "@/lib/cytoscape/algo/assignDissonance";
import { useSignedInUser } from "@/lib/farcaster/useSignedInUser";
import { EdgeSingular, EventObject, NodeSingular } from "cytoscape";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import {
	cytoscapeAtom,
	edgeHandlesAtom,
	selectedElementAtom,
} from "./Graph.state";

export interface GraphMenuProps {}

export const GraphMenu: FC<GraphMenuProps> = () => {
	const edgeHandles = useAtomValue(edgeHandlesAtom);
	const cytoscape = useAtomValue(cytoscapeAtom);
	const signer = useSigner().signer;
	const user = useSignedInUser();
	const [selectedElement, setSelectedElement] = useAtom(selectedElementAtom);

	return (
		<div
			id="graph-menu"
			className="group absolute top-0 left-0  drop-shadow-lg"
			style={{ visibility: selectedElement ? "visible" : "hidden" }}
		>
			<div
				data-popper-arrow
				className="absolute -bottom-2 group-data-[popper-placement=bottom]:-top-2 group-data-[popper-placement=bottom]:bottom-auto left-1/2 -translate-x-1/2"
			>
				<div className="w-4 h-4 bg-white rotate-45" />
			</div>
			<div className="flex flex-col w-52 items-start px-4 py-2 divide-y bg-white divide-gray-100 ">
				{selectedElement && (
					<>
						<a
							className="w-full py-2 text-center hover:text-purple-800"
							href={`https://warpcast.com/${selectedElement.data(
								"fname",
							)}/0x${selectedElement.data("hash")}`}
							target="_blank"
						>
							Open in Warpcast
						</a>
						{selectedElement.hasClass("point") && (
							<button
								type="button"
								className="w-full py-2 hover:text-purple-800"
								onClick={() => {
									if (!signer || !user || !cytoscape) return;

									edgeHandles?.start(
										// @ts-expect-error
										selectedElement,
									);

									const handleNewEdge = async (
										_: EventObject,
										negatingPoint: NodeSingular,
										negatedNode: NodeSingular,
										provisionalEdge: EdgeSingular,
									) => {
										const { hash } = await negate(
											`0x${negatingPoint.id()}`,
											`0x${negatedNode.id()}`,
											signer.signer_uuid,
										);

										const negation = addNegation(
											cytoscape,
											{
												fname: user.username,
												hash: hash.substring(2),
												likes: 0,
												parentHash: negatedNode.id(),
											},
											negatingPoint,
											negatedNode,
										);

										assignDissonance({ negatedNode, negatingPoint, negation });

										provisionalEdge.remove();
										setSelectedElement(null);
									};

									cytoscape.one("ehcomplete", handleNewEdge);

									cytoscape.one("ehcancel", () =>
										cytoscape.off("ehcomplete", handleNewEdge),
									);

									setSelectedElement(null);
								}}
							>
								Use to negate
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
};
