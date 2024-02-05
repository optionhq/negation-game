import { CollectionReturnValue } from "cytoscape";
import { assignConsilience } from "./assignConsilience";
import { assignDissonance } from "./assignDissonance";

export const assignScores = (elements: CollectionReturnValue) => {
	const counterpoints = elements.filter("node.counterpoint");

	for (const counterpoint of counterpoints) {
		const negatedPoint = elements
			.getElementById(`to-target-${counterpoint.id()}`)
			.target();

		const negatingPoint = elements
			.getElementById(`to-source-${counterpoint.id()}`)
			.target();

		assignDissonance({
			counterpoint,
			negatingPoint,
			negatedPoint,
		});
	}

	const points = elements.filter("node.point");

	for (const point of points) {
		assignConsilience(point);
	}

	return elements;
};
