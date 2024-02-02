import { useSigner } from "@/contexts/SignerContext";
import { makePoint } from "@/lib/actions/makePoint";
import { addPointNode } from "@/lib/cytoscape/addPointNode";
import { useSignedInUser } from "@/lib/farcaster/useSignedInUser";
import { NodeSingular } from "cytoscape";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect, useState } from "react";
import { cytoscapeAtom, pointBeingMadeAtom } from "./Graph.state";

export interface PointFormProps {
	pointBeingMade: NodeSingular;
}

export const PointForm: FC<PointFormProps> = ({ pointBeingMade }) => {
	const [text, setText] = useState("");
	const setPointBeingMade = useSetAtom(pointBeingMadeAtom);
	const cytoscape = useAtomValue(cytoscapeAtom);
	const user = useSignedInUser();
	const signer = useSigner().signer;

	useEffect(() => {
		pointBeingMade.data("text", text ? text : "Make your point...");
	}, [text, pointBeingMade]);

	return (
		<div className="absolute bottom-0 w-full p-4">
			<div className="flex flex-col items-center justify-center gap-4 p-4 bg-white w-full h-56 rounded-xl">
				<h1 className="text-4xl">Make your point</h1>
				<textarea
					autoFocus
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="w-full h-32"
					maxLength={320}
				/>
				<p>{text.length}/320</p>
				<div className="flex gap-2">
					<button
						type="submit"
						onClick={async () => {
							if (!signer || !user || !cytoscape) return;

							const { hash } = await makePoint(text, signer);

							addPointNode(
								cytoscape,
								{
									hash: hash.substring(2),
									fname: user.username,
									text,
									likes: 0,
									parentHash: null,
								},
								{ position: pointBeingMade.position() },
							);

							pointBeingMade.remove();

							setText("");
							setPointBeingMade(null);
						}}
					>
						Submit
					</button>
					<button
						type="button"
						onClick={() => {
							pointBeingMade.remove();
							setText("");
							setPointBeingMade(null);
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
