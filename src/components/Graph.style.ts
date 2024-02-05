import { EdgeSingular, NodeSingular } from "cytoscape";

export const style: cytoscape.Stylesheet[] = [
	{
		selector: "node.negation.hovered",
		style: {
			visibility: "visible",
		},
	},
	{
		selector: "node.point",
		style: {
			"background-color": "#fff",
			// "background-color": (node: NodeSingular) => {
			// 	const disagreement = node.data("consilience") / node.data("likes");

			// 	return `rgb(${360 - disagreement * 260}, 60%, 80%)`;
			// },
			"border-color": "#06d",
			"border-width": 2,
			shape: "round-rectangle",
			width: "400px",
			height: "160px",
			label: (node: NodeSingular) =>
				`[${node.data("consilience")}/${node.data("likes")}] ${breakLongWords(
					node.data("text"),
				).replace(/\n/g, " ")}`,
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
				node.connectedEdges().length === 0 ? "hidden" : "visible",

			"border-color": "#000",
			"border-width": 2,
			"background-color": "#06d",
			"text-valign": "center",
			color: "#fff",
			width: 32,
			height: 32,
			label: (node: NodeSingular) => `${node.data("dissonance")}` || "",
		},
	},
	// {
	// 	selector: "edge.eh-preview, edge.eh-ghost-edge",
	// 	style: {
	// 		"line-style": "dashed",
	// 		"target-arrow-shape": "triangle",
	// 		"target-arrow-color": "#000",
	// 		"source-arrow-color": "#000",
	// 		"target-arrow-fill": "hollow",

	// 		"arrow-scale": 2,
	// 		width: 2,
	// 	},
	// },

	{
		selector: "edge.negation, edge.eh-ghost-edge , edge.eh-preview",
		style: {
			visibility: "visible",
			width: (edge: EdgeSingular) => Math.max(1, edge.source().data("likes")),
			"target-arrow-shape": "triangle",
			"arrow-scale": 2,
			"curve-style": "unbundled-bezier",
			"line-color": "#000",
			"source-arrow-color": "#000",
			"target-arrow-color": "#000",
			"source-label": (edge: EdgeSingular) => edge.source().data("likes"),
			"target-label": (edge: EdgeSingular) => edge.target().data("likes"),
			"source-text-offset": 24,
			"target-text-offset": 24,
			"text-outline-color": "#eee",
			"text-outline-width": 3,
		},
	},

	{ selector: ".eh-source, .eh-target", style: { "border-color": "red" } },
	{ selector: "node.eh-target.negation", style: { "background-color": "red" } },
	{
		selector: ".eh-ghost-edge.eh-preview-active",
		style: {
			opacity: 0,
		},
	},
	{
		selector: "edge.negation.provisional",
		style: {
			"line-style": "dashed",
		},
	},
	{
		selector: "node.point.provisional",
		style: {
			"border-style": "dashed",
		},
	},
	{
		selector: ".eh-ghost-edge , edge.eh-preview",
		style: {
			"line-color": "red",
			"line-style": "dashed",
			"target-arrow-color": "red",
			"target-arrow-fill": "hollow",
		},
	},

	// {
	// 	selector: "edge.aux",
	// 	style: {
	// 		visibility: "hidden",
	// 	},
	// },
	{
		selector: "node.selected, node.hovered",
		style: {
			visibility: "visible",
			"z-index": 100,
		},
	},

	{
		selector: "node.point.focused",
		style: {
			"background-color": "#ffd",
			"border-color": "#fd0",
		},
	},
	{
		selector: "node.point.hovered",
		style: {
			"background-color": "#feb",
			"border-color": "#fa0",
		},
	},
];

const breakLongWords = (text: string) =>
	text.replace(/[^\s]{46,}/g, (word) =>
		(word.match(/.{1,46}/g) ?? []).join("\n"),
	);
