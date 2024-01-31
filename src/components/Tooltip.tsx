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
		<div className="group/tooltip inline-block relative h-full">
			{children}
			<div
				className={`opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible absolute z-30 bg-gray-600 text-white text-sm leading-tight py-2 px-3 rounded-lg transition-opacity duration-200 ease-in-out transform flex items-center justify-center w-fit h-fit ${
					orientation === "right"
						? "left-full -translate-y-1/2 top-1/2 bottom-1/2"
						: orientation === "left"
						  ? "-translate-y-1/2 top-1/2 bottom-1/2 right-full"
						  : orientation === "top"
							  ? "top-full left-1/2 right-1/2 -translate-x-1/2"
							  : orientation === "bottom"
								  ? "bottom-full left-1/2 right-1/2 -translate-x-1/2"
								  : ""
				}`}
			>
				<p className="w-fit whitespace-nowrap">{text}</p>
				<div
					className={`absolute w-3 h-3 bg-gray-600 transform rotate-45 -mt-1 z-20 ${
						orientation === "right"
							? " -left-1 translate-y-[2.5px]"
							: orientation === "bottom"
							  ? "translate-y-[150%]"
							  : orientation === "top"
								  ? "top-0 -translate-y-[150%]]"
								  : orientation === "left"
									  ? "-right-1 translate-y-[2.5px]"
									  : ""
					}`}
				/>
			</div>
		</div>
	);
}
