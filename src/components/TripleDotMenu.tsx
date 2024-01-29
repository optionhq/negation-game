import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import makeWarpcastUrl from "../lib/makeWarpcastUrl";
import { usePointContext } from "../contexts/PointContext";
import { useSigner } from "@/contexts/SignerContext";

const TripleDotMenu: React.FC = () => {
	const { signer } = useSigner();
	const [isOpen, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const { point, refreshChildren, refreshParentThread } = usePointContext();

	const isAuthor = useMemo(
		() => signer && "fid" in signer && point.author?.fid === signer.fid,
		[signer],
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setOpen((prevState) => !prevState);
				}}
				className=""
			>
				...
			</button>
			{isOpen && (
				<div className="absolute right-0 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
					<button
						className="w-full px-4 py-2 text-left"
						onClick={(event) => {
							event.stopPropagation();
							const warpcastUrl = makeWarpcastUrl(point);
							window.open(warpcastUrl, "_blank");
						}}
					>
						Open in Warpcast
					</button>
					<button
						className={`w-full px-4 py-2 text-left ${
							!isAuthor ? "opacity-50 cursor-not-allowed" : ""
						}`}
						onClick={async (event) => {
							event.stopPropagation();
							if (isAuthor) {
								try {
									await axios.delete(`/api/cast/${point.id}/delete`, {
										data: {
											signerUuid: signer!.signer_uuid,
										},
									});
									refreshParentThread();
									setOpen(false);
								} catch (error) {
									console.error("Failed to delete cast:", error);
								}
							}
						}}
					>
						Delete
					</button>
				</div>
			)}
		</div>
	);
};

export default TripleDotMenu;
