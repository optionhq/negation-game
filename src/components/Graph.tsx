"use client";

import Cytoscape, { ElementsDefinition, LayoutOptions } from "cytoscape";

import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { cytoscapeStyle } from "./Graph.style";

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
    });

    cytoscape.on("tap", "node", (event) => {
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
    name: "cose",
    // @ts-expect-error
    numIter: 100,
    nodeDimensionsIncludeLabels: true,
    fit: false,
    ...options,
  }).run();
};
