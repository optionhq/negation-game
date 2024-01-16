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
  // {
  //   selector: "node.point[likes <= 0]",
  //   style: {
  //     "background-color": "#fcc",
  //   },
  // },
  {
    selector: "node.comment",
    style: {
      "background-color": "#ffe",
      shape: "round-rectangle",
      width: "400px",
      height: "160px",
      label: "data(text)",
      "text-wrap": "wrap",
      "text-justification": "left",
      "text-max-width": "360px",
      "text-valign": "center",
    },
  },
  {
    selector: "node.negation",
    style: {
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
  // {
  //   selector: "node.negation[likes <= 0]",
  //   style: {
  //     "background-color": "#faa",
  //   },
  // },
  {
    selector: "edge.has",
    style: {
      "source-label": (edge: EdgeSingular) => edge.source().data("likes"),
      "source-text-offset": 20,
      "target-label": (edge: EdgeSingular) => edge.source().data("likes"),
      "target-text-offset": 20,
      "text-outline-color": "#fff",
      "text-outline-width": 2,
    },
  },
  {
    selector: "edge",
    style: {
      width: (edge: EdgeSingular) => Math.max(1, edge.source().data("likes")),
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
      "curve-style": "unbundled-bezier",
      "line-color": "#000",
      "source-arrow-color": "#000",
      "target-arrow-color": "#000",
      // "control-point-distances": "20 -20", // Example values, adjust as needed
      // "control-point-weights": "0.25 0.75", // Adjust these values for symmetry
    },
  },
  {
    selector: "edge.has",
    style: {
      // "control-point-distances": "20", // Example values, adjust as needed
      // "control-point-weights": "0.25", // Adjust these values for symmetry
      // "line-color": "#ccc",
      "target-arrow-shape": "none",
    },
  },
  {
    selector: "edge.negating",
    style: {
      // "control-point-distances": "-20", // Example values, adjust as needed
      // "control-point-weights": "0.75", // Adjust these values for symmetry
      // "line-color": "red",
      // "line-style": (edge) => {
      //   const conviction = edge.source().data("conviction");
      //   if (conviction < 0) {
      //     return "dashed";
      //   }

      //   return "solid";
      // },
      // "target-arrow-color": "red",
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
    },
  },
];
