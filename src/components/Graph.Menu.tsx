import { useAtomValue } from "jotai";
import { FC } from "react";
import { selectedElementAtom } from "./Graph.state";

export interface GraphMenuProps {
	handleNegate: () => void;
}

export const GraphMenu: FC<GraphMenuProps> = ({ handleNegate }) => {
	const selectedElement = useAtomValue(selectedElementAtom);
	return (
		<div
			id="graph-menu"
			className="group absolute left-0 top-0  drop-shadow-lg"
			style={{ visibility: selectedElement !== null ? "visible" : "hidden" }}
		>
			<div
				data-popper-arrow
				className="absolute -bottom-2 left-1/2 -translate-x-1/2 group-data-[popper-placement=bottom]:-top-2 group-data-[popper-placement=bottom]:bottom-auto"
			>
				<div className="h-4 w-4 rotate-45 bg-white" />
			</div>
			<div className="flex w-52 flex-col items-start divide-y divide-gray-100 bg-white px-4 py-2 ">
				{selectedElement && (
					<>
						<a
							className="w-full py-2 text-center hover:text-purple-800"
							href={`https://warpcast.com/${selectedElement.data(
								"fname",
							)}/${selectedElement.data("hash")}`}
							target="_blank"
						>
							Open in Warpcast
						</a>
						{selectedElement.hasClass("point") && (
							<button
								type="button"
								className="w-full py-2 hover:text-purple-800"
								onClick={handleNegate}
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
