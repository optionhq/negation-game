"use client";

import Cytoscape, {
  ElementsDefinition,
  LayoutOptions,
  NodeSingular,
} from "cytoscape";

import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { useRouter } from "next/navigation";
import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { cytoscapeStyle } from "./Graph.style";

Cytoscape.use(dagre);

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
      style: cytoscapeStyle,
      minZoom: 0.05,
    });

    cytoscape.on("tap", "node, edge", (event) => {
      console.log(event.target.id());
    });

    cytoscape.on("tap", "node.point", (event) => {
      push(`/point/${event.target.id()}`);
    });

    cytoscape.on("position", "node.point", (e) => {
      const point = e.target as NodeSingular;
      point.connectedEdges().forEach((edge) => {
        const negationNode = cytoscape.getElementById(
          edge.id().replace("negation-", "")
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
  }, [elements, props]);

  return <div ref={cyContainer} {...props} />;
};

const updateLayout = (cy: cytoscape.Core, options?: Partial<LayoutOptions>) => {
  const negationNodes = cy.$("node.negation");
  negationNodes.unlock();
  cy.one("layoutstop", () => negationNodes.lock());
  cy.layout({
    name: "dagre",
    // @ts-expect-error
    rankSep: 500,
    rankDir: "RL",
    nodeDimensionsIncludeLabels: true,
    fit: false,
    // transform(node, position) {
    //   if (node.hasClass("point")) return position;

    //   const edge = cy.$(`#negation-${node.id()}`) as EdgeSingular;
    //   return edge.midpoint();
    // },
    ...options,
  }).run();
};
