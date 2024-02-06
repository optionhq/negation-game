"use client";

import Cytoscape, {
	Core,
	EdgeSingular,
	ElementDefinition,
	EventObject,
	EventObjectEdge,
	EventObjectNode,
	LayoutOptions,
	NodeSingular,
	Stylesheet,
} from "cytoscape";

import { GRAPH_INTERACTIVE_MIN_ZOOM } from "@/config";
import { useAssertCytoscapeExtensionsLoaded } from "@/contexts/CytoscapeContext";
import { useSigner } from "@/contexts/SignerContext";
import { fetchGraph } from "@/lib/actions/fetchGraph";
import { makePoint } from "@/lib/actions/makePoint";
import { negate } from "@/lib/actions/negate";
import { addNegation } from "@/lib/cytoscape/addNegation";
import { addPointNode } from "@/lib/cytoscape/addPointNode";
import { assignDissonance } from "@/lib/cytoscape/algo/assignDissonance";
import { useSignedInUser } from "@/lib/farcaster/useSignedInUser";
import { cn } from "@/lib/utils/cn";
import cytoscape from "cytoscape";
import { EdgeHandlesInstance } from "cytoscape-edgehandles";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
	FC,
	HTMLAttributes,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { BiLoaderAlt, BiSolidPencil } from "react-icons/bi";
import useSWR from "swr";
import { GraphMenu } from "./Graph.Menu";
import { pointBeingMadeAtom, selectedElementAtom } from "./Graph.state";
import { style } from "./Graph.style";
import InputNegation from "./points/InputNegation";
import { hoveredPointIdAtom } from "./points/Point";

interface GraphProps extends HTMLAttributes<HTMLDivElement> {
	focusedElementId?: string;
	rootPointId?: string;
}

export const Graph: FC<GraphProps> = ({
	rootPointId,
	focusedElementId,
	className,
	...props
}) => {
	const { data: elements, isLoading } = useSWR(["graph", rootPointId], () =>
		fetchGraph(rootPointId),
	);
	const cyContainer = useRef<HTMLDivElement>(null);
	const { cytoscape, edgeHandles } = useCytoscape({
		style,
		containerRef: cyContainer,
		enabled: !isLoading,
	});
	const [pointBeingMade] = useAtom(pointBeingMadeAtom);

	useToogleInteractiveOnZoom({ cytoscape, enabled: true });
	useTrackSelectedElement({ cytoscape, enabled: true });
	useTrackHoveredElement({ cytoscape, enabled: true });
	const { hasElements } = useHandleIncomingElements({ cytoscape, elements });
	useNegationNodesAutoReposition({
		cytoscape,
		enabled: hasElements,
	});
	useHandleElementFocus({ cytoscape, focusedElementId, enabled: true });
	const { isNegating, handleNegate } = useHandleNegate({
		cytoscape,
		edgeHandles,
		enabled: true,
	});

	const {
		handleMakePoint,
		isPointBeingMade,
		handleMakePointMadeOrDismissed,
		handleMakePointSubmitted,
	} = useHandleMakePoint({ cytoscape, enabled: true });

	useDisplayMenuOnSelectedElement({
		cytoscape,
		enabled: !isNegating,
	});

	return (
		<div
			className={cn(
				"w-full h-full flex flex-grow items-center justify-center bg-gray-100",
				className,
			)}
			{...props}
		>
			{isLoading && (
				<BiLoaderAlt size={128} className="animate-spin text-purple-200" />
			)}
			{!isLoading && (
				<div className="relative w-full h-full">
					<div ref={cyContainer} className="w-full h-full" />
					<GraphMenu handleNegate={handleNegate} />
					{isPointBeingMade && (
						<InputNegation
							className="absolute bottom-0 w-full p-4"
							placeHolder="Make your point..."
							onClose={handleMakePointMadeOrDismissed}
							onPublish={handleMakePointSubmitted}
						/>
					)}
					{!pointBeingMade && cytoscape && (
						<button
							className="absolute bottom-2 right-2 button"
							onClick={handleMakePoint}
						>
							<BiSolidPencil size={18} />
							Make a point
						</button>
					)}
				</div>
			)}
		</div>
	);
};

const getNegationPositionFromNode = (negation: NodeSingular) => {
	if (!negation.hasClass("negation")) throw new Error("Not a negation node");
	const negationEdge = negation
		.cy()
		.getElementById(`negation-${negation.id()}`);
	if (negationEdge.empty()) return negationEdge.position();
	return negationEdge.midpoint();
};

const positionNegationNodeOverNegationEdgeFromNode = (
	negationNode: NodeSingular,
) => {
	negationNode.unlock();
	negationNode.position(getNegationPositionFromNode(negationNode));
	negationNode.lock();
};

const positionNegationNodeOverNegationEdgeFromEdge = (
	negationEdge: EdgeSingular,
) => {
	const negationNode = negationEdge
		.cy()
		.getElementById(negationEdge.id().replace("negation-", "")) as NodeSingular;
	negationNode.unlock();
	negationNode.position(getNegationPositionFromNode(negationNode));
	negationNode.lock();
};

const updateLayout = (
	cytoscape: cytoscape.Core,
	options?: Partial<LayoutOptions>,
) => {
	cytoscape
		.layout({
			name: "preset",
			transform: (node, position) => {
				if (!node.hasClass("negation")) return position;
				return getNegationPositionFromNode(node);
			},
			// @ts-expect-error
			animate: true,
			animationDuration: 1000,

			...options,
		})
		.run();
};

const useTrackSelectedElement = ({
	cytoscape,
	enabled,
}: { cytoscape: Core | null; enabled: boolean }) => {
	const setSelectedElement = useSetAtom(selectedElementAtom);

	useEffect(() => {
		if (!cytoscape || !enabled) return;
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

		return () => {
			cytoscape.off("tap", handleTap);
		};
	}, [cytoscape, enabled, setSelectedElement]);
};

const useTrackHoveredElement = ({
	cytoscape,
	enabled,
}: { cytoscape: Core | null; enabled: boolean }) => {
	const [hoveredPointId, setHoveredPointId] = useAtom(hoveredPointIdAtom);

	useEffect(() => {
		if (!cytoscape || !enabled) return;

		const handleMouseOver = (e: EventObjectNode | EventObjectEdge) => {
			const element = e.target;
			element.addClass("hovered");
			if (element.isEdge() && element.hasClass("negation"))
				cytoscape
					.getElementById(element.id().replace("negation-", ""))
					.addClass("hovered");

			setHoveredPointId(element.id());
		};

		const handleMouseOut = (e: EventObjectNode | EventObjectEdge) => {
			setHoveredPointId(undefined);
			e.target.removeClass("hovered");
			if (e.target.isEdge() && e.target.hasClass("negation"))
				cytoscape
					.getElementById(e.target.id().replace("negation-", ""))
					.removeClass("hovered");
		};

		cytoscape.on(
			"mouseover",
			"edge.negation, node.negation, node.point",
			handleMouseOver,
		);
		cytoscape.on(
			"mouseout",
			"edge.negation, node.negation, node.point",
			handleMouseOut,
		);

		return () => {
			cytoscape.off(
				"mouseover",
				"edge.negation, node.negation, node.point",
				handleMouseOver,
			);
			cytoscape.off(
				"mouseout",
				"edge.negation, node.negation, node.point",
				handleMouseOut,
			);
		};
	}, [cytoscape, enabled, setHoveredPointId]);

	useEffect(() => {
		if (!cytoscape || !enabled || !hoveredPointId) return;

		const hoveredPoint =
			cytoscape.getElementById(`negation-${hoveredPointId}`)?.source() ??
			cytoscape.getElementById(`${hoveredPointId}`);

		if (!hoveredPoint) {
			return;
		}

		hoveredPoint.addClass("hovered");

		return () => {
			hoveredPoint.removeClass("hovered");
		};
	}, [cytoscape, hoveredPointId, enabled]);
};

const useHandleNegate = ({
	cytoscape,
	edgeHandles,
	enabled,
}: {
	cytoscape: Core | null;
	edgeHandles: EdgeHandlesInstance | null;
	enabled: boolean;
}) => {
	const signerUuid = useSigner().signer?.signer_uuid;
	const user = useSignedInUser();
	const [selectedElement, setSelectedElement] = useAtom(selectedElementAtom);
	const [isNegating, setIsNegating] = useState(false);

	useEffect(() => {
		if (!cytoscape || !edgeHandles || !enabled) return;
		const startNegating = () => {
			setIsNegating(true);
		};

		const stopNegating = () => {
			setIsNegating(false);
		};

		cytoscape.on("ehstart", startNegating);
		cytoscape.on("ehcomplete", stopNegating);
		cytoscape.on("ehcancel", stopNegating);

		return () => {
			cytoscape.off("ehstart", startNegating);
			cytoscape.off("ehcomplete", stopNegating);
			cytoscape.off("ehcancel", stopNegating);
		};
	}, [cytoscape, edgeHandles, enabled]);

	useEffect(() => {
		if (!cytoscape || !edgeHandles || !enabled || !signerUuid || !user) return;

		const handleNewEdge = async (
			_: EventObject,
			negatingPoint: NodeSingular,
			negatedNode: NodeSingular,
			provisionalEdge: EdgeSingular,
		) => {
			const { hash } = await negate(
				negatingPoint.id(),
				negatedNode.id(),
				signerUuid,
			);

			const negation = addNegation(
				cytoscape,
				{
					fname: user.username,
					hash: hash,
					likes: 0,
					parentHash: negatedNode.id(),
				},
				negatingPoint,
				negatedNode,
			);

			if (negation.hasClass("counterpoint")) {
				assignDissonance({
					negatedPoint: negatedNode,
					negatingPoint,
					counterpoint: negation,
				});
			}

			provisionalEdge.remove();
		};

		cytoscape.on("ehcomplete", handleNewEdge);

		return () => {
			cytoscape.off("ehcomplete", handleNewEdge);
		};
	}, [cytoscape, enabled, signerUuid, user, setSelectedElement, edgeHandles]);

	const handleNegate = useCallback(() => {
		if (!selectedElement || !edgeHandles || !enabled) return;

		edgeHandles.start(
			// @ts-expect-error
			selectedElement,
		);

		setSelectedElement(null);
	}, [edgeHandles, selectedElement, setSelectedElement, enabled]);

	return { isNegating, handleNegate };
};

const useNegationNodesAutoReposition = ({
	cytoscape,
	enabled,
}: { cytoscape: Core | null; enabled: boolean }) => {
	useEffect(() => {
		if (!cytoscape || !enabled) return;

		cytoscape
			.nodes("node.negation")
			.forEach(positionNegationNodeOverNegationEdgeFromNode);

		const repositionNegationNodesOnMove = (e: EventObjectNode) =>
			e.target
				.connectedEdges("edge.negation")
				.forEach(positionNegationNodeOverNegationEdgeFromEdge);

		cytoscape.on(
			"position",
			"node.point, node.negation",
			repositionNegationNodesOnMove,
		);

		const repositionNewNegationNode = (e: EventObjectNode) => {
			positionNegationNodeOverNegationEdgeFromNode(e.target);
		};

		cytoscape.on("add", "node.negation", repositionNewNegationNode);

		return () => {
			cytoscape.off(
				"position",
				"node.point, node.negation",
				repositionNegationNodesOnMove,
			);
			cytoscape.off("add", "node.negation", repositionNewNegationNode);
		};
	}, [cytoscape, enabled]);
};

const useHandleIncomingElements = ({
	cytoscape,
	elements,
}: { cytoscape: Core | null; elements?: ElementDefinition[] }) => {
	useEffect(() => {
		if (!cytoscape) return;
		cytoscape.startBatch();
		cytoscape.elements().remove();
		elements && cytoscape.add(elements);
		updateLayout(cytoscape);
		cytoscape.endBatch();
	}, [cytoscape, elements]);

	return {
		hasElements: !!elements && elements.length > 0,
	};
};

const useHandleElementFocus = ({
	cytoscape,
	focusedElementId,
	enabled,
}: { cytoscape: Core | null; focusedElementId?: string; enabled: boolean }) => {
	useEffect(() => {
		if (!cytoscape || !focusedElementId || !enabled) return;

		const selectedPoint =
			cytoscape.getElementById(`negation-${focusedElementId}`)?.source() ??
			cytoscape.getElementById(`${focusedElementId}`);

		if (!selectedPoint) {
			return;
		}

		selectedPoint.addClass("focused");

		cytoscape.animate({
			center: {
				eles: selectedPoint,
			},
			zoom: 0.5,
			duration: 500,
			easing: "ease-in-out-cubic",
		});

		return () => {
			selectedPoint.removeClass("focused");
		};
	}, [cytoscape, focusedElementId, enabled]);
};

const useDisplayMenuOnSelectedElement = ({
	cytoscape,
	enabled,
}: { cytoscape: Core | null; enabled: boolean }) => {
	const selectedElement = useAtomValue(selectedElementAtom);
	const [menuIsOpen, setMenuIsOpen] = useState(selectedElement !== null);

	useEffect(() => {
		if (
			!cytoscape ||
			!enabled ||
			!selectedElement ||
			selectedElement.hasClass("provisional")
		)
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
							boundary: cytoscape.container(),
						},
					},
				],
			},
		});

		setMenuIsOpen(true);

		const updatePopper = () => {
			popper.update();
		};

		cytoscape.on("pan zoom", updatePopper);
		selectedElement.on("position", updatePopper);

		return () => {
			popper.destroy();
			cytoscape.off("pan zoom", updatePopper);
			selectedElement.off("position", "", updatePopper);
			selectedElement.removeClass("selected");
			setMenuIsOpen(false);
		};
	}, [selectedElement, cytoscape, enabled]);

	return { menuIsOpen };
};

const useCytoscape = ({
	style,
	containerRef,
	enabled,
}: {
	style?: Stylesheet[];
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
	enabled: boolean;
}) => {
	useAssertCytoscapeExtensionsLoaded();
	const [cytoscape, setCytoscape] = useState<Core | null>(null);
	const [edgeHandles, setEdgeHandles] = useState<EdgeHandlesInstance | null>(
		null,
	);

	useEffect(() => {
		if (!containerRef.current || !enabled) return;
		const cytoscape = Cytoscape({
			style,
			container: containerRef.current,
			autounselectify: true,
			userPanningEnabled: true,
			userZoomingEnabled: true,
			boxSelectionEnabled: false,
			selectionType: "single",
			minZoom: 0.05,
		});

		setCytoscape(cytoscape);

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
					(cytoscape.getElementById(`negation-${target.id()}`) as EdgeSingular)
						.connectedNodes()
						.contains(source)
				)
					return false;
				if (source.edgesTo(target).length > 0) return false;
				return true;
			},
			snap: true,
		});

		setEdgeHandles(edgeHandles);

		return () => {
			edgeHandles.destroy();
			cytoscape.destroy();
		};
	}, [enabled, containerRef, style]);

	return {
		cytoscape: cytoscape,
		edgeHandles: edgeHandles,
	};
};

const useToogleInteractiveOnZoom = ({
	cytoscape,
	enabled,
}: { cytoscape: Core | null; enabled: boolean }) => {
	useEffect(() => {
		if (!cytoscape || !enabled) return;
		const handleZoom = () => {
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
		};
		cytoscape.on("zoom", handleZoom);
		handleZoom();

		return () => {
			cytoscape.off("zoom", handleZoom);
		};
	}, [cytoscape, enabled]);
};

const useHandleMakePoint = ({
	cytoscape,
	enabled,
}: { cytoscape: Core | null; enabled: boolean }) => {
	const [pointBeingMade, setPointBeingMade] = useAtom(pointBeingMadeAtom);
	const isPointBeingMade = !!pointBeingMade;
	const user = useSignedInUser();
	const signer = useSigner().signer;

	const handleMakePointMadeOrDismissed = useCallback(() => {
		if (!pointBeingMade) return;

		pointBeingMade.remove();
		setPointBeingMade(null);
	}, [pointBeingMade, setPointBeingMade]);

	const handleMakePointSubmitted = useCallback(
		async (text: string) => {
			if (!signer || !user || !pointBeingMade || !cytoscape) return;
			await makePoint(text, signer)
				.then(({ hash }) => {
					addPointNode(
						cytoscape,
						{
							hash,
							fname: user.username,
							text,
							likes: 0,
							parentHash: null,
						},
						{ position: pointBeingMade.position() },
					);
				})
				// TODO handle error and show toast
				.catch();
		},
		[signer, user, pointBeingMade, cytoscape],
	);

	const handleMakePoint = useCallback(() => {
		if (!cytoscape || !enabled) return;
		const center = {
			x: (cytoscape.width() / 2 - cytoscape.pan().x) / cytoscape.zoom(),
			y: (cytoscape.height() / 2 - cytoscape.pan().y) / cytoscape.zoom(),
		};

		const newPointBeingMade = cytoscape.add({
			group: "nodes",
			classes: ["point", "provisional"],
			data: {
				fname: "you",
				text: "Make your point...",
				likes: 0,
			},
			position: center,
		});

		cytoscape.animate({
			center: {
				eles: newPointBeingMade,
			},
			duration: 500,
			easing: "ease-in-out-cubic",
		});

		setPointBeingMade(newPointBeingMade);
	}, [cytoscape, enabled, setPointBeingMade]);

	return {
		handleMakePoint,
		isPointBeingMade,
		handleMakePointMadeOrDismissed,
		handleMakePointSubmitted,
	};
};
