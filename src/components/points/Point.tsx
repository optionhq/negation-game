import { usePointIds } from "@/lib/hooks/usePointIds";
import { cn } from "@/lib/utils";
import { atom, useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { usePointContext } from "../../contexts/PointContext";
import { Node } from "../../types/Points";
import AccordionArrow from "../AccordionArrow";
import TripleDotMenu from "../TripleDotMenu";
import ChildrenThread from "../feeds/ChildrenThread";
import CommentsThread from "../feeds/CommentsThread";
import Score from "../score/Score";
import LoadingNegations from "./LoadingNegations";
import NegationText from "./NegationText";

export const hoveredPointIdAtom = atom<string | undefined>(undefined);

export default function Point({
	level,
	parent,
	setHistoricalItems,
	getParentAncestry,
}: {
	level: number;
	parent: Node | undefined;
	setHistoricalItems: React.Dispatch<
		React.SetStateAction<string[] | undefined>
	>;
	getParentAncestry: undefined | (() => string | undefined);
}) {
	const { point, detailsOpened, unfurlDropdown } = usePointContext();
	const { ids, setIds } = usePointIds();
	const [hoveredPointId, setHoveredPointId] = useAtom(hoveredPointIdAtom);
	const currentPointId = useMemo(() => {
		if (point.type === "root") return point.id;
		if (point.type === "negation") return point?.endPoint?.id;

		return undefined;
	}, [point]);
	const isHovered = useMemo(
		() => hoveredPointId && hoveredPointId === currentPointId,
		[hoveredPointId, currentPointId],
	);

	function getAncestry(): string | undefined {
		// Call the parent's getAncestry function if it exists
		const parentAncestry =
			parent && getParentAncestry ? getParentAncestry() : "";

		// Return the current component's ID followed by the parent's ancestry
		return parentAncestry ? `${point.id},${parentAncestry}` : point.id;
	}

	function newRoute() {
		const current = ids;
		const currentIds = current ? current.split(",") : [];
		const ancestry = getAncestry()?.split(",");
		if (!ancestry) return;

		// Find the first ancestor that is already in the path
		const commonAncestorIndex = ancestry?.findIndex(
			(ancestor) => ancestor === currentIds[0],
		);

		// If the first ancestor is already in the path, do nothing
		if (commonAncestorIndex === 0) {
			return;
		}

		// Prepend the missing ancestors to the path
		const missingAncestors =
			commonAncestorIndex > 0 ?
				ancestry.slice(0, commonAncestorIndex).join(",")
			:	ancestry.join(",");
		const route = current ? `${missingAncestors},${current}` : missingAncestors;

		setIds(route);
	}

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation();
		newRoute();
	}

	useEffect(() => {
		const selectedIds = (ids ?? "").split(",");
		const selectedId = selectedIds[0];
		if (selectedId === point.id) {
			unfurlDropdown();
		}
	}, [ids, point, unfurlDropdown]);

	return (
		<details
			open={detailsOpened}
			className="flex w-full flex-col gap-1"
			onClick={handleClick}
		>
			<summary
				className={cn(
					level % 2 ?
						isHovered ? "bg-indigo-50"
						:	"bg-indigo-25"
					: isHovered ? "bg-gray-100"
					: "bg-slate-50",
					"claim relative cursor-pointer border",
				)}
				onMouseOver={() => {
					setHoveredPointId(currentPointId);
				}}
				onMouseOut={() => setHoveredPointId(undefined)}
			>
				<AccordionArrow />
				<div className="flex w-full flex-col items-start justify-center gap-3">
					<NegationText />
					<Score />
				</div>
				<TripleDotMenu />
			</summary>
			<CommentsThread level={level} />
			<ChildrenThread
				type="relevance"
				level={level}
				setHistoricalItems={setHistoricalItems}
				getParentAncestry={getAncestry}
			/>
			<ChildrenThread
				type="conviction"
				level={level}
				setHistoricalItems={setHistoricalItems}
				getParentAncestry={getAncestry}
			/>
			<LoadingNegations />
		</details>
	);
}
