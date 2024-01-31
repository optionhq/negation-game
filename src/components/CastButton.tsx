"use client";
import React, { useState, useEffect } from "react";
import { BiSolidPencil } from "react-icons/bi";
import Modal from "./Modal";
import publish from "../lib/publish";
import { getDeviceType } from "../lib/getDeviceType";
import InputNegation from "./points/InputNegation";
import { useSigner } from "@/contexts/SignerContext";

export default function CastButton({
	conversation,
	refreshThread,
}: {
	conversation?: string;
	refreshThread: () => Promise<void>;
}) {
	const [castModal, setCastModal] = useState(false);
	const { signer } = useSigner();
	const [deviceType, setDeviceType] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			setDeviceType(getDeviceType());
		}
	}, []);

	return (
		<>
			{signer && (
				<div>
					<button
						className="fixed bottom-16 z-50 sm:bottom-5 right-5 button"
						onClick={() => setCastModal(true)}
					>
						<BiSolidPencil size={18} />
						{deviceType === "desktop" && <p>Make a point</p>}
					</button>
					{castModal && (
						<Modal setSelected={setCastModal}>
							<InputNegation
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
				</div>
			)}
		</>
	);
}
