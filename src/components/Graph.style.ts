import { EdgeSingular, NodeSingular } from "cytoscape";

export const cytoscapeStyle: cytoscape.Stylesheet[] = [
  {
    selector: "node.point",
    style: {
      "background-color": "#fff",
      "border-color": "#06d",
      "border-width": 2,
      shape: "round-rectangle",
      width: "400px",
      height: "160px",
      label: (node: NodeSingular) =>
        `[${node.data("likes")}] ${node.data("text")}`,
      "text-wrap": "wrap",
      "text-justification": "left",
      "text-max-width": "360px",
      "text-valign": "center",
    },
  },
  {
    selector: "node.current-point",
    style: {
      "background-color": "#ffd",
      "border-color": "#d93",
    },
  },
  {
    selector: "node.negation",

    style: {
      display: (node: NodeSingular) =>
        node.degree(false) === 0 ? "none" : "element",

      "border-color": "#000",
      "border-width": 2,
      "background-color": "#06d",
      "text-valign": "center",
      color: "#fff",
      width: 32,
      height: 32,
      label: "data(likes)",
    },
  },
  {
    selector: "edge",
    style: {
      width: (edge: EdgeSingular) => Math.max(1, edge.source().data("likes")),
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
      "curve-style": "unbundled-bezier",
      "source-endpoint": "-200 0",
      // "target-endpoint": "90deg",
      "line-color": "#000",
      "source-arrow-color": "#000",
      "target-arrow-color": "#000",
    },
  },
];
