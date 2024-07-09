import { EdgeSingular, NodeSingular } from "cytoscape";

export const assignDissonance = ({
	negatedPoint,
	negatingPoint,
	counterpoint,
}: {
	counterpoint: NodeSingular;
	negatedPoint: NodeSingular;
	negatingPoint: NodeSingular;
}) => {
	const counterpointLikes = counterpoint
		.neighborhood("edge.objection")
		.reduce(
			(sum, counterpointEdge: EdgeSingular) =>
				sum + counterpointEdge.source().data("likes"),
			0,
		);

	counterpoint.data(
		"dissonance",
		Math.max(
			0,
			Math.min(negatingPoint.data("likes"), negatedPoint.data("likes")) -
				counterpointLikes,
		),
	);
};
