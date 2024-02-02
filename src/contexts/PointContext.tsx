import {
	Dispatch,
	SetStateAction,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { Node } from "../types/Points";
import unlike from "../lib/unlike";
import like from "../lib/like";
import { Signer } from "neynar-next/server";
import { getMaybeNegation } from "../lib/useCasts";
import axios from "axios";

type PointContextType = {
	point: Node;
	handleLike: (
		e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>,
		type: "relevance" | "conviction",
	) => void;
	handleNegate: (
		e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>,
		type: "relevance" | "conviction",
	) => void;
	likes:
		| undefined
		| { relevance: number | undefined; conviction: number | undefined };
	liked:
		| undefined
		| { relevance: boolean | undefined; conviction: boolean | undefined };
	setDetailsOpened: Dispatch<SetStateAction<boolean>>;
	detailsOpened: boolean;
	children: { relevance: Node[]; conviction: Node[]; comment: Node[] };
	setChildren: Dispatch<
		SetStateAction<{
			relevance: Node[];
			conviction: Node[];
			comment: Node[];
		}>
	>;
	childrenLoading: boolean;
	setChildrenLoading: Dispatch<SetStateAction<boolean>>;
	refreshChildren: () => Promise<void>;
	unfurlDropdown: () => Promise<void>;
	refreshParentThread: () => Promise<void>;
};

export const PointContext = createContext<PointContextType | undefined>(
	undefined,
);

export function usePointContext() {
	const context = useContext(PointContext);
	if (!context) {
		throw new Error(
			"usePointContext must be used within a PointContextProvider",
		);
	}
	return context;
}

export function PointProvider({
	children: _children,
	point,
	signer,
	refreshParentThread,
}: {
	children: React.ReactNode;
	point: Node;
	signer: Signer | null;
	refreshParentThread: () => Promise<void>;
}) {
	const [children, setChildren] = useState<{
		relevance: Node[];
		conviction: Node[];
		comment: Node[];
	}>({ relevance: [], conviction: [], comment: [] });
	const [likes, setLikes] = useState<
		| undefined
		| { relevance: number | undefined; conviction: number | undefined }
	>();
	const [liked, setLiked] = useState<
		| undefined
		| { relevance: boolean | undefined; conviction: boolean | undefined }
	>();

	const [childrenLoading, setChildrenLoading] = useState(false);
	const [detailsOpened, setDetailsOpened] = useState(false);

	useEffect(() => {
		let _likes:
			| undefined
			| { relevance: number | undefined; conviction: number | undefined };
		let _liked:
			| undefined
			| { relevance: boolean | undefined; conviction: boolean | undefined };
		if (point.type !== "input") {
			const likedveracity =
				signer &&
				"fid" in signer &&
				point.advocates?.some((el: { fid: number }) => el.fid === signer.fid)
					? signer &&
					  "fid" in signer &&
					  point.advocates?.some(
							(el: { fid: number }) => el.fid === signer.fid,
					  )
					: undefined;
			const likedrelevance =
				signer &&
				"fid" in signer &&
				point.advocates?.some((el: { fid: number }) => el.fid === signer.fid)
					? signer &&
					  "fid" in signer &&
					  point.endPoint?.advocates?.some(
							(el: { fid: number }) => el.fid === signer.fid,
					  )
					: undefined;
			if (point.type === "negation") {
				_likes = {
					relevance: point.points,
					conviction: point.endPoint?.points,
				};
				_liked = { relevance: likedrelevance, conviction: likedveracity };
			} else if (point.type === "root") {
				_likes = { relevance: undefined, conviction: point.points };
				_liked = { relevance: undefined, conviction: likedveracity };
			}
			setLikes(_likes);
			setLiked(_liked);
		}
	}, [point, signer]);

	const handleLike = useCallback(
		async (
			e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>,
			type: "relevance" | "conviction",
		) => {
			e.stopPropagation();
			e.preventDefault();
			if (!likes || !liked || !point.id || !signer) return;
			if (liked[type])
				await unlike(point.id, signer)
					.catch((e) => console.error("ERROR - unlike", e))
					.then(() => {
						setLikes(
							(prev) =>
								({
									...prev,
									[type]: prev
										? (prev?.[type] ?? 0) > 0
											? (prev[type] as number) - 1
											: 0
										: 0,
								}) as {
									relevance: number | undefined;
									conviction: number | undefined;
								},
						);
						setLiked(
							(prev) =>
								({ ...prev, [type]: false }) as {
									relevance: boolean | undefined;
									conviction: boolean;
								},
						);
					});
			else
				await like(point.id, signer)
					.catch((e) => console.error("ERROR - like", e))
					.then(() => {
						setLikes(
							(prev) =>
								({
									...prev,
									[type]: prev
										? (prev?.[type] ?? 0) > 0
											? (prev[type] as number) + 1
											: 0
										: 0,
								}) as {
									relevance: number | undefined;
									conviction: number | undefined;
								},
						);
						setLiked(
							(prev) =>
								({ ...prev, [type]: true }) as {
									relevance: boolean | undefined;
									conviction: boolean;
								},
						);
					});
		},
		[liked, likes],
	);

	const handleNegate = useCallback(
		async (
			e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>,
			type: "relevance" | "conviction",
		) => {
			e.stopPropagation();
			e.preventDefault();
			setChildren((prev) => {
				const newChildren = { ...prev };
				// Check if there's already an input element in the array
				const hasInput = newChildren[type]?.some(
					(neg: Node) => neg.type === "input",
				);
				const parentId = point.endPoint
					? type === "conviction"
						? point.endPoint.id
						: point.id
					: point.id;

				// If there's no input element, add one
				if (!hasInput)
					newChildren[type].push({
						type: "input",
						parentId: parentId,
						negationType: type,
						title: "",
					});
				return newChildren;
			});
			if (!detailsOpened) unfurlDropdown();
		},
		[detailsOpened, point.id],
	);

	const getNegationsForType = useCallback(
		async (_point: Node, type: "relevance" | "conviction") => {
			const {
				data: {
					result: { casts },
				},
			} = await axios.get(`/api/cast/${_point.id}/thread`);

			const comments: Node[] = [];
			const negations: Node[] = [];

			for (const cast of casts) {
				const possibleNegation = await getMaybeNegation(cast);
				if (possibleNegation.parentId === _point.id)
					if (possibleNegation.type === "negation")
						negations.push(possibleNegation);
					else {
						possibleNegation.type = "comment";
						comments.push(possibleNegation);
					}
			}
			const inputBox = children?.[type]?.find((neg) => neg?.type === "input");
			const sortedNegations = negations.sort((a, b) => {
				if (b.points && a.points && b.points !== a.points) {
					return b.points - a.points;
				}
				if (
					a.endPoint &&
					b.endPoint &&
					b?.endPoint?.points &&
					a?.endPoint?.points
				) {
					return b.endPoint.points - a.endPoint.points;
				}
				return 0;
			});

			return inputBox
				? [[inputBox, ...sortedNegations], comments]
				: [sortedNegations, comments];
		},
		[children],
	);

	const refreshChildren = useCallback(async () => {
		console.log("refresh children");
		if (point.type === "input") return;
		const newNeg: { relevance: Node[]; conviction: Node[] } = {
			relevance: [],
			conviction: [],
		};
		const newComments: { point: Node[]; endpoint: Node[] } = {
			point: [],
			endpoint: [],
		};
		if (point.type === "negation") {
			[
				[newNeg.relevance, newComments.point],
				[newNeg.conviction, newComments.endpoint],
			] = await Promise.all([
				getNegationsForType(point, "relevance"),
				point.endPoint ? getNegationsForType(point.endPoint, "conviction") : [],
			]);
		} else {
			[[newNeg.conviction, newComments.point]] = await Promise.all([
				getNegationsForType(point, "conviction"),
			]);
		}
		setChildren({
			relevance: newNeg.relevance,
			conviction: newNeg.conviction,
			comment: [...newComments.endpoint, ...newComments.point],
		});
	}, [getNegationsForType, point]);

	const unfurlDropdown = useCallback(async () => {
		setDetailsOpened((prevDetailsOpened) => {
			if (!prevDetailsOpened) {
				setChildrenLoading(true);
				refreshChildren().then(() => setChildrenLoading(false));
			}
			return !prevDetailsOpened;
		});
	}, []);

	return (
		<PointContext.Provider
			value={{
				point,
				handleLike,
				likes,
				liked,
				handleNegate,
				detailsOpened,
				setDetailsOpened,
				children,
				setChildren,
				childrenLoading,
				setChildrenLoading,
				refreshChildren,
				unfurlDropdown,
				refreshParentThread,
			}}
		>
			{_children}
		</PointContext.Provider>
	);
}
