import { Cast } from "@/types/Cast";
import { Core, ElementDefinition } from "cytoscape";

export const addPointNode = (
	cytoscape: Core,
	cast: Cast,
	params?: Partial<Omit<ElementDefinition, "data" | "group">>,
) => {
	cytoscape.add({
		group: "nodes",
		data: {
			id: cast.hash,
			hash: cast.hash,
			fname: cast.fname,
			text: cast.text,
			likes: cast.likes,
		},
		classes: "point",
		...params,
	});
};
