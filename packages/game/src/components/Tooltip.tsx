import React, { useEffect, useRef, useState } from "react";

export default function Tooltip({
	text,
	orientation,
	children,
}: {
	text: string;
	children: React.ReactNode;
	orientation: "left" | "right" | "top" | "bottom";
}) {
	return (
		<div className="group/tooltip relative inline-block h-full">
			{children}
			<div
				className={`invisible absolute z-30 flex h-fit w-fit transform items-center justify-center rounded-lg bg-gray-600 px-3 py-2 text-sm leading-tight text-white opacity-0 transition-opacity duration-200 ease-in-out group-hover/tooltip:visible group-hover/tooltip:opacity-100 ${
					orientation === "right" ?
						"bottom-1/2 left-full top-1/2 -translate-y-1/2"
					: orientation === "left" ?
						"bottom-1/2 right-full top-1/2 -translate-y-1/2"
					: orientation === "top" ?
						"left-1/2 right-1/2 top-full -translate-x-1/2"
					: orientation === "bottom" ?
						"bottom-full left-1/2 right-1/2 -translate-x-1/2"
					:	""
				}`}
			>
				<p className="w-fit whitespace-nowrap">{text}</p>
				<div
					className={`absolute z-20 -mt-1 h-3 w-3 rotate-45 transform bg-gray-600 ${
						orientation === "right" ? " -left-1 translate-y-[2.5px]"
						: orientation === "bottom" ? "translate-y-[150%]"
						: orientation === "top" ? "-translate-y-[150%]] top-0"
						: orientation === "left" ? "-right-1 translate-y-[2.5px]"
						: ""
					}`}
				/>
			</div>
		</div>
	);
}
