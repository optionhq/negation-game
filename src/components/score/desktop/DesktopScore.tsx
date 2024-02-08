"use client";
import React from "react";
import ReactButtonWrapper from "../../ReactButtonWrapper";
import { AiOutlineCheck } from "react-icons/ai";
import NegateLikeButtons from "./NegateLikeButtons";
import { Node } from "../../../types/Points";
import { usePointContext } from "../../../contexts/PointContext";

export default function DesktopScore({
	type,
}: {
	type: "relevance" | "conviction";
}) {
	const { likes, liked } = usePointContext();

	if (likes?.[type] == undefined) return <></>;
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
					<p className="text-sm font-thin">
						{type[0].toUpperCase() + type.slice(1)}
					</p>
					<hr className="h-[1.5px] w-full bg-slate-300" />
					<div className="group/points flex h-6 w-16 items-center justify-center">
						<div
							className={`flex flex-row items-center gap-1 group-hover/points:hidden`}
						>
							<span
								className={liked?.[type] ? " font-bold text-green-500" : ""}
							>
								{likes[type]}
							</span>
							{liked?.[type] && <AiOutlineCheck />}
						</div>
						<NegateLikeButtons type={type} />
					</div>
				</div>
			</ReactButtonWrapper>
		</div>
	);
}
