import { useSigner } from "@/contexts/SignerContext";
import axios from "axios";
import { FC, useMemo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { usePointContext } from "../contexts/PointContext";
import makeWarpcastUrl from "../lib/makeWarpcastUrl";
import { Button } from "./ui/button";
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverPortal,
	PopoverTrigger,
} from "./ui/popover";

export interface TripleDotMenuProps {
	portalTarget?: HTMLElement;
}

const TripleDotMenu: FC<TripleDotMenuProps> = ({ portalTarget }) => {
	const { signer } = useSigner();
	const [isOpen, setOpen] = useState(false);
	const { point, refreshParentThread } = usePointContext();
	const warpcastUrl = useMemo(() => makeWarpcastUrl(point), [point]);

	const isAuthor = useMemo(
		() => signer && "fid" in signer && point.author?.fid === signer.fid,
		[signer, point],
	);

	return (
		<Popover open={isOpen} onOpenChange={setOpen}>
			<PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
				<Button variant={"ghost"} className="h-fit p-2">
					<BsThreeDots />
				</Button>
			</PopoverTrigger>
			<PopoverPortal container={portalTarget}>
				<PopoverContent
					align="end"
					className="w-fit p-1"
					onClick={(e) => e.stopPropagation()}
				>
					<PopoverArrow />
					<div className="flex w-fit flex-col divide-y">
						<Button variant="tertiary" asChild className="rounded-none">
							<a href={warpcastUrl} target="_blank">
								Open in Warpcast
							</a>
						</Button>
						{isAuthor && (
							<Button
								className="rounded-none"
								variant="tertiary"
								onClick={async (event) => {
									event.stopPropagation();
									if (signer && isAuthor) {
										try {
											await axios.delete(`/api/cast/${point.id}/delete`, {
												data: { signerUuid: signer.signer_uuid },
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
							</Button>
						)}
					</div>
				</PopoverContent>
			</PopoverPortal>
		</Popover>
	);
};

export default TripleDotMenu;
