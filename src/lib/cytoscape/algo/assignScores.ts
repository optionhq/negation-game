import { CollectionReturnValue } from "cytoscape";
import { assignConsilience } from "./assignConsilience";
import { assignDissonance } from "./assignDissonance";

export const assignScores = (elements: CollectionReturnValue) => {
	const negations = elements.filter("node.negation");

	for (const negation of negations) {
		const negatedNode = elements
			.getElementById(`to-target-${negation.id()}`)
			.target();

		// Objections have no dissonance
		if (!negatedNode.hasClass("point")) continue;

		const negatingPoint = elements
			.getElementById(`to-source-${negation.id()}`)
			.target();

		assignDissonance({ negation, negatingPoint, negatedPoint: negatedNode });
	}

	const points = elements.filter("node.point");

	for (const point of points) {
		assignConsilience(point);
	}

	return elements;
};
