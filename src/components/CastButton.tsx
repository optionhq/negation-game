"use client";
import { useSigner } from "@/contexts/SignerContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BiSolidPencil } from "react-icons/bi";
import publish from "../lib/publish";
import Modal from "./Modal";
import InputPoint from "./points/InputPoint";

export default function CastButton({
	conversation,
	refreshThread,
	className,
}: {
	className?: string;
	conversation?: string;
	refreshThread: () => Promise<void>;
}) {
	const [castModal, setCastModal] = useState(false);
	const { signer } = useSigner();

	if (!signer) return <></>;

	return (
		<>
			<button
				className={cn("button", className)}
				onClick={() => setCastModal(true)}
			>
				<BiSolidPencil size={18} />
				<p className="hidden sm:flex">Make a point</p>
			</button>
			{castModal && (
				<Modal setSelected={setCastModal}>
					<InputPoint
						placeHolder="Make a cast..."
						onPublish={async (text: string) => {
							const resp = await publish(text, signer, conversation);
							if (resp?.data.cast) {
								refreshThread();
							}
						}}
						onClose={() => {
							setCastModal(false);
						}}
					/>
				</Modal>
			)}
		</>
	);
}
