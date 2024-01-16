"use client";

import Cytoscape, { ElementsDefinition, LayoutOptions } from "cytoscape";

import dagre from "cytoscape-dagre";
import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { cytoscapeStyle } from "./Graph.style";

Cytoscape.use(dagre);

interface GraphProps extends HTMLAttributes<HTMLDivElement> {
  elements?: ElementsDefinition;
}

export const Graph: FC<GraphProps> = ({ elements, ...props }) => {
  const cyContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elements) return;

    const cytoscape = Cytoscape({
      elements,
      container: cyContainer.current,
      style: cytoscapeStyle,
      minZoom: 0.05,
    });

    cytoscape.on("tap", (event) => {
      console.log(event.target.id());
    });

    updateLayout(cytoscape, { fit: true, padding: 100, animate: false });

    return () => {
      cytoscape.destroy();
    };
  }, [elements]);

  return <div ref={cyContainer} {...props} />;
};

const updateLayout = (cy: cytoscape.Core, options?: Partial<LayoutOptions>) => {
  cy.layout({
    name: "dagre",
    // @ts-expect-error
    rankDir: "RL",
    nodeDimensionsIncludeLabels: true,
    fit: false,
    ...options,
  }).run();
};
