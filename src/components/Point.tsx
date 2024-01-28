import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { usePointContext } from "../contexts/PointContext";
import { Node } from "../types/Points";
import AccordionArrow from "./AccordionArrow";
import TripleDotMenu from "./TripleDotMenu";
import ChildrenThread from "./negations/ChildrenThread";
import CommentsThread from "./negations/CommentsThread";
import LoadingNegations from "./negations/LoadingNegations";
import NegationText from "./negations/NegationText";
import Score from "./score/Score";

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
	getParentAncestry: undefined | (() => string);
}) {
	const { point, detailsOpened, unfurlDropdown } = usePointContext();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pointBg = `${
		level % 2
			? " bg-indigo-25 hover:bg-indigo-50"
			: " bg-slate-50 hover:bg-gray-100"
	}`;

	function getAncestry(): string {
		// Call the parent's getAncestry function if it exists
		const parentAncestry =
			parent && getParentAncestry ? getParentAncestry() : "";

		// Return the current component's ID followed by the parent's ancestry
		return parentAncestry ? `${point.id},${parentAncestry}` : point.id!;
	}

	function newRoute() {
		const ancestry = getAncestry().split(",");
		const current = searchParams?.get("id");
		const currentIds = current ? current.split(",") : [];

		// Find the first ancestor that is already in the path
		const commonAncestorIndex = ancestry.findIndex(
			(ancestor) => ancestor === currentIds[0],
		);

		// If the first ancestor is already in the path, do nothing
		if (commonAncestorIndex === 0) {
			return;
		}

		// Prepend the missing ancestors to the path
		const missingAncestors =
			commonAncestorIndex > 0
				? ancestry.slice(0, commonAncestorIndex).join(",")
				: ancestry.join(",");
		const route = current ? `${missingAncestors},${current}` : missingAncestors;

		// Check if space and conversation parameters exist
		if (router.query.space && router.query.conversation) {
			router.push({
				pathname: `/spaces/${router.query.space}/${router.query.conversation}`,
				query: { id: route },
			});
		} else {
			router.push({
				pathname: "/",
				query: { id: route },
			});
		}
	}

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation();
		newRoute();
	}

	useEffect(() => {
		const selectedIds =
			typeof router.query.id === "string"
				? router.query.id.split(",")
				: [router.query.id];
		const selectedId = selectedIds[0];
		if (selectedId === point.id) {
			unfurlDropdown();
		}
	}, [router.query.id, point.id]);

	return (
		<details
			open={detailsOpened}
			className="flex flex-col gap-1"
			onClick={handleClick}
		>
			<summary className={pointBg + ` claim relative border cursor-pointer`}>
				<AccordionArrow />
				<div className="flex flex-col gap-3 items-start justify-center w-full">
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
