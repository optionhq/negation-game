"use client";

import cytoscape, { LayoutOptions } from "cytoscape";

import React, { HTMLAttributes, useEffect, useRef } from "react";
import { cytoscapeStyle } from "./Graph.style";

interface GraphProps extends HTMLAttributes<HTMLDivElement> {
  elements?: cytoscape.ElementsDefinition;
}

export const Graph: React.FC<GraphProps> = ({ elements, ...props }) => {
  const cyContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elements) return;

    const instance = cytoscape({
      elements,
      container: cyContainer.current,
      style: cytoscapeStyle,
    });

    updateLayout(instance, { fit: true, padding: 100, animate: false });

    return () => {
      instance.destroy();
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
