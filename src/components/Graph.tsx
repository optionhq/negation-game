"use client";

import Cytoscape, {
	EdgeSingular,
	ElementsDefinition,
	LayoutOptions,
	NodeSingular,
	Stylesheet,
} from "cytoscape";

import { GRAPH_INTERACTIVE_MIN_ZOOM } from "@/config";
import { useAssertCytoscapeInitialized } from "@/contexts/CytoscapeContext";
import { useSigner } from "@/contexts/SignerContext";
import { makePoint } from "@/lib/actions/makePoint";
import { addPointNode } from "@/lib/cytoscape/addPointNode";
import { useSignedInUser } from "@/lib/farcaster/useSignedInUser";
import cytoscape from "cytoscape";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { BiSolidPencil } from "react-icons/bi";
import { GraphMenu } from "./Graph.Menu";
import {
	cytoscapeAtom,
	edgeHandlesAtom,
	pointBeingMadeAtom,
	selectedElementAtom,
} from "./Graph.state";
import InputNegation from "./points/InputNegation";
import { hoveredPointIdAtom } from "./points/Point";

interface GraphProps extends HTMLAttributes<HTMLDivElement> {
	elements?: ElementsDefinition;
	graphStyle?: Stylesheet[];
	focusedElementId?: string;
}

export const Graph: FC<GraphProps> = ({
	elements,
	graphStyle,
	focusedElementId,
	...props
}) => {
	const { push } = useRouter();
	const cyContainer = useRef<HTMLDivElement>(null);
	const [cy, setCy] = useAtom(cytoscapeAtom);
	const setEdgeHandles = useSetAtom(edgeHandlesAtom);
	const [selectedElement, setSelectedElement] = useAtom(selectedElementAtom);
	const [pointBeingMade, setPointBeingMade] = useAtom(pointBeingMadeAtom);
	const [hoveredPointId, setHoveredPointId] = useAtom(hoveredPointIdAtom);
	const user = useSignedInUser();
	const signer = useSigner().signer;
	useAssertCytoscapeInitialized();

	useEffect(() => {
		if (!elements) return;

		const cytoscape = Cytoscape({
			elements,
			container: cyContainer.current,
			style: graphStyle,
			autounselectify: true,
			boxSelectionEnabled: false,
			selectionType: "single",
			minZoom: 0.05,
			layout: {
				name: "preset",
				fit: true,
				padding: 30,
				transform: (node, position) => {
					if (!node.hasClass("negation")) return position;

					return getNegationPosition(node);
				},
				stop: (e) => {
					e.cy.$("node.negation").lock();
				},
			},
		});

		setCy(cytoscape);

		const edgeHandles = cytoscape.edgehandles({
			edgeParams: (source, target) => ({
				data: {
					hash: "negation-new",
					fname: "negation-new",
					source: source.id(),
					target: target.id(),
				},
				classes: ["negation", "provisional"],
			}),
			canConnect: (source, target) => {
				if (source === target) return false;
				if (
					target.hasClass("negation") &&
					cytoscape.getElementById(`to-source-${target.id()}`).target() ===
						source
				)
					return false;
				if (source.edgesTo(target).length > 0) return false;
				return true;
			},
			snap: true,
		});

		setEdgeHandles(edgeHandles);

		const handleTap = (event: cytoscape.EventObject) => {
			const target = event.target;

			if (target === cytoscape) {
				setSelectedElement(null);
				return;
			}

			if (target.isEdge() && target.hasClass("negation")) {
				setSelectedElement(
					cytoscape.getElementById(target.id().replace("negation-", "")),
				);
				return;
			}

			setSelectedElement(target);
		};

		cytoscape.on("tap", handleTap);

		// TODO migrate to use XState with Browsing, MakingPoint and Negating states, setting up the event handlers for each state
		cytoscape.on("ehstart", () => {
			cytoscape.off("tap", handleTap);
		});
		cytoscape.on("ehstop", () => cytoscape.on("tap", handleTap));

		cytoscape.on("zoom", () => {
			const currentZoomLevel = cytoscape.zoom();

			currentZoomLevel > GRAPH_INTERACTIVE_MIN_ZOOM
				? cytoscape
						.nodes()
						.grabify()
						// @ts-expect-error
						.unpanify()
				: cytoscape
						.nodes()
						.ungrabify()
						// @ts-expect-error
						.panify();
		});

		cytoscape.on("position", "node.point", (e) => {
			const point = e.target as NodeSingular;

			for (const edge of point.connectedEdges()) {
				const negationNode = cytoscape.getElementById(
					edge.id().replace("negation-", ""),
				) as NodeSingular;
				negationNode.unlock();
				negationNode.position(edge.midpoint());
				negationNode.lock();
			}
		});

		cytoscape.on("position", "node.point, node.negation", (e) => {
			const point = e.target as NodeSingular;

			for (const edge of point.connectedEdges()) {
				const negationNode = cytoscape.getElementById(
					edge.id().replace("negation-", ""),
				) as NodeSingular;
				negationNode.unlock();
				negationNode.position(edge.midpoint());
				negationNode.lock();
			}
		});

		cytoscape.on("add", "node.negation", (e) => {
			const negation = e.target as NodeSingular;
			negation.position(getNegationPosition(negation));
			negation.lock();
		});

		cytoscape.on("mouseover", "edge.negation, node.negation", (e) => {
			const nodeId = e.target.id().replace("negation-", "");
			cytoscape.getElementById(nodeId).addClass("hovered");
		});

		cytoscape.on("mouseover", "node.point", (e) => {
			setHoveredPointId(`0x${e.target.id()}`);
		});

		cytoscape.on("mouseout", "edge.negation, node.negation", (e) => {
			const nodeId = e.target.id().replace("negation-", "");
			cytoscape.getElementById(nodeId).removeClass("hovered");
		});

		cytoscape.on("mouseout", "node.point", (e) => {
			setHoveredPointId(undefined);
		});

		// updateLayout(cytoscape, { fit: true, padding: 100, animate: false });

		return () => {
			edgeHandles.destroy();
			cytoscape.destroy();
		};
	}, [
		elements,
		graphStyle,
		setCy,
		setEdgeHandles,
		setSelectedElement,
		setHoveredPointId,
	]);

	useEffect(() => {
		if (!cy || !focusedElementId) return;

		const selectedPoint =
			cy.getElementById(`negation-${focusedElementId}`)?.source() ??
			cy.getElementById(`${focusedElementId}`);

		if (!selectedPoint) {
			return;
		}

		cy.animate({
			center: {
				eles: selectedPoint,
			},
			zoom: 0.5,
			duration: 500,
			easing: "ease-in-out-cubic",
		});

		selectedPoint.addClass("focused");

		return () => {
			selectedPoint.removeClass("focused");
		};
	}, [cy, focusedElementId]);

	useEffect(() => {
		if (!cy || !hoveredPointId) return;

		const hoveredPoint =
			cy.getElementById(`negation-${hoveredPointId.substring(2)}`)?.source() ??
			cy.getElementById(`${hoveredPointId.substring(2)}`);

		if (!hoveredPoint) {
			return;
		}

		hoveredPoint.addClass("hovered");

		return () => {
			hoveredPoint.removeClass("hovered");
		};
	}, [cy, hoveredPointId]);

	useEffect(() => {
		if (!selectedElement || !cy || selectedElement.hasClass("provisional"))
			return;

		selectedElement.addClass("selected");

		const popper = selectedElement.popper({
			content: () => document.getElementById("graph-menu") as HTMLElement,
			popper: {
				placement: "top",
				strategy: "absolute",
				modifiers: [
					{
						name: "arrow",
						options: { padding: 4 },
					},
					{ name: "offset", options: { offset: [0, 16] } },
					{
						name: "preventOverflow",
						options: {
							padding: 12,
							mainAxis: true,
							altAxis: true,
							boundary: cyContainer.current,
						},
					},
				],
			},
		});

		const updateTip = () => {
			popper.update();
		};

		updateTip();

		cy.on("pan zoom", updateTip);
		selectedElement.on("position", updateTip);

		return () => {
			popper.destroy();
			cy.off("pan zoom", updateTip);
			selectedElement.off("position", "", updateTip);
			selectedElement.removeClass("selected");
		};
	}, [selectedElement, cy]);

	return (
		<div {...props}>
			<div ref={cyContainer} className="w-full h-full" />
			<GraphMenu />
			{pointBeingMade && (
				<InputNegation
					className="absolute bottom-0 w-full p-4"
					placeHolder="Make your point..."
					onClose={() => {
						pointBeingMade.remove();
						setPointBeingMade(null);
					}}
					onPublish={async (text) => {
						if (!signer || !user || !cy) return;

						const { hash } = await makePoint(text, signer);

						addPointNode(
							cy,
							{
								hash: hash.substring(2),
								fname: user.username,
								text,
								likes: 0,
								parentHash: null,
							},
							{ position: pointBeingMade.position() },
						);
					}}
				/>
			)}
			{/* <PointForm pointBeingMade={pointBeingMade} /> */}
			{!pointBeingMade && (
				<button
					className="absolute bottom-2 right-2 button"
					onClick={() => {
						if (!cy) return;

						const center = {
							x: (cy.width() / 2 - cy.pan().x) / cy.zoom(),
							y: (cy.height() / 2 - cy.pan().y) / cy.zoom(),
						};

						const newPointBeingMade = cy.add({
							group: "nodes",
							classes: ["point", "provisional"],
							data: {
								fname: "you",
								text: "Make your point...",
								likes: 0,
							},
							position: center,
						});

						cy.animate({
							center: {
								eles: newPointBeingMade,
							},
							duration: 500,
							easing: "ease-in-out-cubic",
						});

						setPointBeingMade(newPointBeingMade);
					}}
				>
					<BiSolidPencil size={18} />
					Make a point
				</button>
			)}
		</div>
	);
};

const updateLayout = (cy: cytoscape.Core, options?: Partial<LayoutOptions>) => {
	const negationNodes = cy.$("node.negation");
	negationNodes.unlock();
	cy.one("layoutstop", () => negationNodes.lock());
	cy.layout({
		name: "cose",
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

const getNegationPosition = (negation: NodeSingular) => {
	if (!negation.hasClass("negation")) throw new Error("Not a negation node");
	const negationEdge = negation
		.cy()
		.getElementById(`negation-${negation.id()}`);
	if (negationEdge.empty()) throw new Error("Negation edge not found");
	return negationEdge.midpoint();
};
