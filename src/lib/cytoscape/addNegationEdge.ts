import { Cast } from "@/types/Cast";
import { Core } from "cytoscape";

export const addNegationEdge = (
	cy: Core,
	negationCast: Omit<Cast, "text">,
	negatingCastHash: string,
) => {
	const elements = cy.add([
		{
			group: "nodes",

			data: {
				id: negationCast.hash,
				hash: negationCast.hash,
				fname: negationCast.fname,
				likes: negationCast.likes,
			},
			classes: "negation",
		},
		{
			group: "edges",
			data: {
				id: `negation-${negationCast.hash}`,
				hash: negationCast.hash,
				fname: negationCast.fname,
				source: negatingCastHash,
				target: negationCast.parentHash,
			},
			classes: "negation",
		},
		{
			group: "edges",
			data: {
				id: `to-source-${negationCast.hash}`,
				source: negationCast.hash,
				target: negatingCastHash,
				aux: true,
			},
			classes: "aux",
		},
		{
			group: "edges",
			data: {
				id: `to-target-${negationCast.hash}`,
				source: negationCast.hash,
				target: negationCast.parentHash,
				aux: true,
			},
			classes: "aux",
		},
	]);

	elements
		.getElementById(negationCast.hash)
		.position(
			elements.getElementById(`negation-${negationCast.hash}`).midpoint(),
		);
};
