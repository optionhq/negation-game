"use client";

import { useSigner } from "@/contexts/SignerContext";
import { useCallback, useEffect } from "react";

export interface ISuccessMessage {
	fid: string;
	is_authenticated: boolean;
	signer_uuid: string;
}

export enum Theme {
	DARK = "dark",
	LIGHT = "light",
}

export enum Variant {
	NEYNAR = "neynar",
	WARPCAST = "warpcast",
	FARCASTER = "farcaster",
}

enum ButtonText {
	NEYNAR = "Sign in with Neynar",
	WARPCAST = "Connect Warpcast",
	FARCASTER = "Connect Farcaster",
}

export const NeynarSigninButton = () => {
	const { setSigner } = useSigner();

	// Define the onSignInSuccess callback function
	const onSignInSuccess = useCallback(
		async (data: any) => {
			localStorage.setItem("farcaster-signer", JSON.stringify(data));
			data.fid = Number(data.fid);
			setSigner(data);
		},
		[setSigner],
	);

	useEffect(() => {
		// Load Neynar script
		const script = document.createElement("script");
		script.src = "https://neynarxyz.github.io/siwn/raw/1.0.0/index.js";
		script.async = true;
		document.body.appendChild(script);

		// // Define the global callback function
		//@ts-ignore
		window.onSignInSuccess = onSignInSuccess;

		// // Cleanup function
		return () => {
			document.body.removeChild(script);
			//@ts-ignore
			delete window.onSignInSuccess;
		};
	}, [onSignInSuccess]); // Empty dependency array ensures the useEffect runs only once

	return (
		<div
			className="neynar_signin"
			data-client_id={"8417e67f-610e-459e-91fd-339e5d6dda71"}
			data-success-callback="onSignInSuccess"
			data-theme="light"
		>
			{/* Defaults to light, unless specified */}
		</div>
	);
};
