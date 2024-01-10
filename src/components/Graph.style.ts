export const cytoscapeStyle: cytoscape.Stylesheet[] = [
  {
    selector: "node.point",
    style: {
      "background-color": "#f9f9f9",
      "border-color": "#aaa",
      "border-width": 1,
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
    selector: "node.comment",
    style: {
      "background-color": "#ffe",
      shape: "round-rectangle",
      width: "400px",
      height: "160px",
      label: "data(text)",
      "text-wrap": "wrap",
      "text-justification": "left",
      "text-overflow-wrap": "anywhere",
      "text-max-width": "360px",
      "text-valign": "center",
    },
  },
  {
    selector: "node.relevance",
    style: {
      "border-color": "#ccc",
      "border-width": 2,
      "background-color": "#eee",
      "text-valign": "center",
      width: 32,
      height: 32,
      label: "data(conviction)",
    },
  },
  {
    selector: "node.relevance[conviction < 0]",
    style: {
      "background-color": "#faa",
    },
  },

  {
    selector: "edge",
    style: {
      width: 2,
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
      "curve-style": "straight",
    },
  },
  {
    selector: "edge.has",
    style: {
      "line-color": "#ccc",
      "target-arrow-shape": "none",
    },
  },
  {
    selector: "edge.negating",
    style: {
      "line-color": "red",
      "line-style": (edge) => {
        const conviction = edge.source().data("conviction");
        if (conviction < 0) {
          return "dashed";
        }

        return "solid";
      },
      "target-arrow-color": "red",
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
    },
  },
];
