import React, { useState, useCallback } from "react";
import axios from "axios";
import ReactButtonWrapper from "./ReactButtonWrapper";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { Signer } from "neynar-next/server";

function NegateLikeButtons({
	id,
	points,
	onNegate,
	type,
	advocates,
	farcasterSigner,
}: {
	id: string;
	points: number;
	onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
	type: "relevance" | "conviction";
	advocates: { fid: number }[];
	farcasterSigner: Signer | null;
}) {
	const [isLiked, setIsLiked] = useState(
		farcasterSigner &&
			"fid" in farcasterSigner &&
			advocates.some((advocate) => advocate.fid === farcasterSigner.fid),
	);
	const [score, setScore] = useState(points);

	const handleLike = useCallback(
		(e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => {
			e.stopPropagation();
			e.nativeEvent.stopImmediatePropagation();
			if (!(farcasterSigner && "fid" in farcasterSigner)) return;

			const toggleLike = async () => {
				if (isLiked) {
					// Call the internal API to unlike
					await axios
						.delete(`/api/cast/${id}/like`, {
							data: { signerUuid: farcasterSigner.signer_uuid },
						})
						.then(() => {
							setScore((prevScore) => prevScore - 1);
							setIsLiked(false);
						});
				} else {
					// Call the internal API to like
					await axios
						.post(`/api/cast/${id}/like`, {
							signerUuid: farcasterSigner.signer_uuid,
						})
						.then(() => {
							setScore((prevScore) => prevScore + 1);
							setIsLiked(true);
						});
				}
			};

			toggleLike();
		},
		[isLiked, farcasterSigner, id],
	);

	return (
		<div>
			<div className="group/points flex w-16 flex-col items-center">
				<p
					className={`h-6 group-hover/points:hidden ${
						isLiked ? "font-bold" : ""
					}`}
				>
					{score}
				</p>
				<div className="hidden h-6 flex-row gap-1 opacity-0 transition-opacity group-hover/points:flex group-hover/points:opacity-100">
					<span
						className={
							isLiked ?
								"text-xl text-green-500"
							:	"text-xl hover:text-green-500"
						}
						onMouseDown={(e) => {
							e.stopPropagation();
							e.preventDefault();
							handleLike(e);
						}}
					>
						<HiOutlineCheckCircle size={24} />
					</span>
					<span
						className="text-xl hover:text-purple-600"
						onMouseDown={(e) => {
							e.stopPropagation();
							e.preventDefault();
							onNegate(e);
						}}
					>
						<HiOutlineXCircle size={24} />
					</span>
				</div>
			</div>
		</div>
	);
}

export default function Score({
	points,
	onNegate,
	type = "conviction",
	advocates,
	farcasterSigner,
	id,
}: {
	points: number;
	onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
	type: "relevance" | "conviction";
	advocates: { fid: number }[];
	farcasterSigner: Signer | null;
	id: string;
}) {
	return (
		<div
			onClick={(e) => {
				// Only stop propagation and prevent default if the target is this div
				if (e.target !== e.currentTarget) {
					e.stopPropagation();
					e.preventDefault();
				}
			}}
		>
			<ReactButtonWrapper>
				<div className="flex w-fit flex-col items-center gap-[2px]">
					<div className="flex flex-row items-center gap-1 text-sm font-thin">
						{type === "relevance" ?
							<p>relevance</p>
						:	<p>conviction</p>}
					</div>
					<hr className="h-[1.5px] w-full bg-slate-300" />
					<NegateLikeButtons
						id={id}
						points={points}
						onNegate={onNegate}
						type={type}
						advocates={advocates}
						farcasterSigner={farcasterSigner}
					/>
				</div>
			</ReactButtonWrapper>
		</div>
	);
}
