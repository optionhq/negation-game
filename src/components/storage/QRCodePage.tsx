// src/components/QRCodePage.tsx
import React, { useEffect } from "react";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import { useSigner } from "@/contexts/SignerContext";

function QRCodePage() {
	const { signer } = useSigner();
	const router = useRouter();

	useEffect(() => {
		if (signer && signer.status !== "pending_approval") {
			router.push("/");
		}
	}, [signer, router]);

	return signer && signer.status === "pending_approval" ?
			<div className="flex min-h-screen items-center justify-center bg-white">
				<div className="text-center">
					<QRCode value={signer.signer_approval_url} className="mx-auto" />
					<p className="mb-2 mt-4">OR</p>
					<a
						href={signer.signer_approval_url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline"
					>
						Or click here if you&lsquo;re on your phone
					</a>
				</div>
			</div>
		:	null;
}

export default QRCodePage;
