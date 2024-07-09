import { NodeSingular } from "cytoscape";

export const assignConsilience = (point: NodeSingular) => {
	const maxDissonance = point
		.neighborhood("node.negation")
		.map((negation) => negation.data("dissonance"))
		.reduce((max, dissonance) => Math.max(max, dissonance), 0);

	point.data("consilience", Math.max(0, point.data("likes") - maxDissonance));
};
