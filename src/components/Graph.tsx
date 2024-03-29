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
	Position,
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
import { usePointIds } from "@/lib/hooks/usePointIds";
import { cn } from "@/lib/utils";
import cytoscape from "cytoscape";
import { EdgeHandlesInstance } from "cytoscape-edgehandles";
import { useAtom } from "jotai";
import {
	FC,
	HTMLAttributes,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { BiSolidPencil } from "react-icons/bi";
import useSWR, { mutate } from "swr";
import {
	useDebounceCallback,
	useResizeObserver,
	useUpdateEffect,
} from "usehooks-ts";
import { GraphMenu } from "./Graph.Menu";
import { style } from "./Graph.style";
import { Loader } from "./Loader";
import InputPoint from "./points/InputPoint";
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
	const { data: elements } = useSWR(
		["graph", rootPointId],
		() => fetchGraph(rootPointId),
		{
			errorRetryInterval: 1000,
		},
	);

	const cyContainer = useRef<HTMLDivElement>(null);
	const { cytoscape, edgeHandles } = useCytoscape({
		style,
		initialElements: elements,
		enabled: !!elements,
		containerRef: cyContainer,
	});

	useToogleInteractiveOnZoom({ cytoscape, enabled: true });
	const { selectedElement, setSelectedElement } = useTrackSelectedElement({
		cytoscape,
		enabled: true,
	});
	useTrackHoveredElement({ cytoscape, enabled: true });
	useHandleIncomingElements({ cytoscape, elements });
	useNegationNodesAutoReposition({
		cytoscape,
		enabled: !!cytoscape,
	});
	useHandleElementFocus({ cytoscape, focusedElementId });
	const { isNegating, handleNegate } = useHandleNegate({
		selectedElement,
		setSelectedElement,
		cytoscape,
		edgeHandles,
		enabled: true,
	});

	const {
		handleMakePoint,
		isPointBeingMade,
		pointBeingMade,
		handleMakePointMadeOrDismissed,
		handleMakePointSubmitted,
	} = useHandleMakePoint({ cytoscape, enabled: true });

	useDisplayMenuOnSelectedElement({
		selectedElement,
		cytoscape,
		enabled: !isNegating,
	});

	useResizeWithContainer({ cytoscape, containerRef: cyContainer });

	return (
		<div
			className={cn(
				"flex flex-grow items-center justify-center bg-gray-100",
				className,
			)}
			{...props}
		>
			{elements === undefined && <Loader />}
			{elements !== undefined && (
				<div className="relative h-full w-full">
					<div ref={cyContainer} className="h-full w-full" />
					<GraphMenu
						handleNegate={handleNegate}
						selectedElement={selectedElement}
					/>
					{isPointBeingMade && (
						<InputPoint
							className="absolute bottom-0 w-full p-4"
							placeHolder="Make your point..."
							onClose={handleMakePointMadeOrDismissed}
							onPublish={handleMakePointSubmitted}
						/>
					)}
					{!pointBeingMade && cytoscape && (
						<button
							className="button absolute bottom-2 right-2"
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

	try {
		return negation.cy().getElementById(`negation-${negation.id()}`).midpoint();
	} catch (e) {
		return negation.position();
	}
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
	if (cytoscape.destroyed()) return;
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
}: {
	cytoscape: Core | null;
	enabled: boolean;
}) => {
	const [selectedElement, setSelectedElement] = useState<NodeSingular | null>(
		null,
	);

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

	return { selectedElement, setSelectedElement };
};

const useTrackHoveredElement = ({
	cytoscape,
	enabled,
}: {
	cytoscape: Core | null;
	enabled: boolean;
}) => {
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
	selectedElement,
	setSelectedElement,
}: {
	selectedElement: NodeSingular | null;
	setSelectedElement: (node: NodeSingular | null) => void;
	cytoscape: Core | null;
	edgeHandles: EdgeHandlesInstance | null;
	enabled: boolean;
}) => {
	const signerUuid = useSigner().signer?.signer_uuid;
	const user = useSignedInUser();
	const [isNegating, setIsNegating] = useState(false);
	const { focusedElementId } = usePointIds();

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

			mutate(["point", focusedElementId]);
		};

		cytoscape.on("ehcomplete", handleNewEdge);

		return () => {
			cytoscape.off("ehcomplete", handleNewEdge);
		};
	}, [
		cytoscape,
		enabled,
		signerUuid,
		user,
		setSelectedElement,
		edgeHandles,
		focusedElementId,
	]);

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
}: {
	cytoscape: Core | null;
	enabled: boolean;
}) => {
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
}: {
	cytoscape: Core | null;
	elements?: ElementDefinition[];
}) => {
	useUpdateEffect(() => {
		if (!cytoscape) return;
		const oldPositions = cytoscape
			.nodes()
			.reduce(
				(positions, node) => ({ ...positions, [node.id()]: node.position() }),
				{} as Record<string, Position>,
			);
		cytoscape.startBatch();

		cytoscape.elements().remove();
		elements &&
			cytoscape.add(
				elements.map((element) => ({
					...element,
					position: oldPositions[element.data.id!] ?? element.position,
				})),
			);
		// updateLayout(cytoscape);
		cytoscape.endBatch();
	}, [cytoscape, elements]);
};

const useHandleElementFocus = ({
	cytoscape,
	focusedElementId,
}: {
	cytoscape: Core | null;
	focusedElementId?: string;
}) => {
	useEffect(() => {
		if (!cytoscape || !focusedElementId) return;

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
			duration: 1000,
			easing: "ease-in-out-cubic",
			queue: true,
		});

		return () => {
			selectedPoint.removeClass("focused");
		};
	}, [cytoscape, focusedElementId]);
};

const useDisplayMenuOnSelectedElement = ({
	cytoscape,
	enabled,
	selectedElement,
}: {
	selectedElement: NodeSingular | null;
	cytoscape: Core | null;
	enabled: boolean;
}) => {
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
	initialElements,
	style,
	containerRef,
	enabled,
}: {
	enabled: boolean;
	initialElements?: ElementDefinition[];
	style?: Stylesheet[];
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
	useAssertCytoscapeExtensionsLoaded();
	const [cytoscape, setCytoscape] = useState<Core | null>(null);
	const [edgeHandles, setEdgeHandles] = useState<EdgeHandlesInstance | null>(
		null,
	);

	useEffect(() => {
		if (!containerRef.current) return;

		const cytoscape = Cytoscape({
			style,
			elements: initialElements,
			container: containerRef.current,
			autounselectify: true,
			userPanningEnabled: true,
			userZoomingEnabled: true,
			boxSelectionEnabled: false,
			selectionType: "single",
			minZoom: 0.05,
			layout: {
				name: "preset",
				transform: (node, position) => {
					if (!node.hasClass("negation")) return position;
					return getNegationPositionFromNode(node);
				},
				fit: true,
				padding: 30,
				animate: false,
			},
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
	}, [containerRef, enabled]);

	return {
		cytoscape: cytoscape,
		edgeHandles: edgeHandles,
	};
};

const useToogleInteractiveOnZoom = ({
	cytoscape,
	enabled,
}: {
	cytoscape: Core | null;
	enabled: boolean;
}) => {
	useEffect(() => {
		if (!cytoscape || !enabled) return;
		const handleZoom = () => {
			const currentZoomLevel = cytoscape.zoom();

			currentZoomLevel > GRAPH_INTERACTIVE_MIN_ZOOM ?
				cytoscape
					.nodes()
					.grabify()
					// @ts-expect-error
					.unpanify()
			:	cytoscape
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
}: {
	cytoscape: Core | null;
	enabled: boolean;
}) => {
	const [pointBeingMade, setPointBeingMade] = useState<NodeSingular | null>(
		null,
	);
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
		pointBeingMade,
		isPointBeingMade,
		handleMakePointMadeOrDismissed,
		handleMakePointSubmitted,
	};
};

const useResizeWithContainer = ({
	cytoscape,
	containerRef,
}: {
	cytoscape: Core | null;
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
	const onResize = useDebounceCallback(() => cytoscape?.resize(), 200);
	useResizeObserver({
		ref: containerRef,
		onResize,
	});
};
