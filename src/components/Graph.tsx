"use client";

import Cytoscape, {
	EdgeSingular,
	ElementsDefinition,
	LayoutOptions,
	NodeSingular,
} from "cytoscape";

import cytoscape from "cytoscape";
// @ts-expect-error
import euler from "cytoscape-euler";
import { useRouter } from "next/navigation";
import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { style } from "./Graph.style";

Cytoscape.use(euler);

interface GraphProps extends HTMLAttributes<HTMLDivElement> {
	elements?: ElementsDefinition;
}

export const Graph: FC<GraphProps> = ({ elements, ...props }) => {
	const { push } = useRouter();
	const cyContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!elements) return;

		const cytoscape = Cytoscape({
			elements,
			container: cyContainer.current,
			style,
			minZoom: 0.05,
		});

		cytoscape.on("tap", "node, edge", (event) => {
			console.log(event.target.id());
		});

		cytoscape.on("tap", "node.point", (event) => {
			push(`/?id=0x${event.target.id()}`);
		});

		cytoscape.on("position", "node.point", (e) => {
			const point = e.target as NodeSingular;
			point.connectedEdges().forEach((edge) => {
				const negationNode = cytoscape.getElementById(
					edge.id().replace("negation-", ""),
				) as NodeSingular;
				negationNode.unlock();
				negationNode.position(edge.midpoint());
				negationNode.lock();
			});
		});

		updateLayout(cytoscape, { fit: true, padding: 100, animate: false });

		return () => {
			cytoscape.destroy();
		};
	}, [elements, props, push]);

	return <div ref={cyContainer} {...props} />;
};

const updateLayout = (cy: cytoscape.Core, options?: Partial<LayoutOptions>) => {
	const negationNodes = cy.$("node.negation");
	negationNodes.unlock();
	cy.one("layoutstop", () => negationNodes.lock());
	cy.layout({
		name: "euler",
		// @ts-expect-error
		springLength: (edge) => 400,
		springCoeff: (edge: EdgeSingular) => 0.0008,
		mass: (node: NodeSingular) => (node.hasClass("point") ? 100 : 10),
		gravity: -3,
		pull: 0.002,
		theta: 0.888,
		dragCoeff: 0.02,
		movementThreshold: 1,
		timeStep: 100,
		refresh: 10,
		maxIterations: 1000,
		maxSimulationTime: 4000,
		...options,
	}).run();
};
