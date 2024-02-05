import { EdgeSingular, NodeSingular } from "cytoscape";

export const assignDissonance = ({
	negatedPoint,
	negatingPoint,
	negation,
}: {
	negation: NodeSingular;
	negatedPoint: NodeSingular;
	negatingPoint: NodeSingular;
}) => {
	const counterpointLikes = negation
		.neighborhood("edge.negation")
		.reduce(
			(sum, counterpointEdge: EdgeSingular) =>
				sum + counterpointEdge.source().data("likes"),
			0,
		);

	negation.data(
		"dissonance",
		Math.max(
			0,
			Math.min(negatingPoint.data("likes"), negatedPoint.data("likes")) -
				counterpointLikes,
		),
	);
};
