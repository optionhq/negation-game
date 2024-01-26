import { EdgeSingular, NodeSingular } from "cytoscape";

export const style: cytoscape.Stylesheet[] = [
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
        `[${node.data("likes")}] ${breakLongWords(node.data("text"))}`,
      "text-wrap": "wrap",
      "text-justification": "left",
      "text-max-width": "360px",
      "text-valign": "center",
    },
  },
  {
    selector: "node.negation",

    style: {
      visibility: (node: NodeSingular) =>
        node.connectedEdges("[!aux]").length === 0 ? "hidden" : "visible",

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
      visibility: "visible",
      width: (edge: EdgeSingular) => Math.max(1, edge.source().data("likes")),
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
      "curve-style": "unbundled-bezier",
      "line-color": "#000",
      "source-arrow-color": "#000",
      "target-arrow-color": "#000",
    },
  },
  {
    selector: "edge.aux",
    style: {
      visibility: "hidden",
    },
  },
];

const breakLongWords = (text: string) =>
  text.replace(/[^\s]{46,}/g, (word) =>
    (word.match(/.{1,46}/g) ?? []).join("\n")
  );
