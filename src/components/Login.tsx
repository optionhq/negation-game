"use client";

import { useSigner } from "@/contexts/SignerContext";
import axios from "axios";
import Image from "next/image";
import { User } from "neynar-next/server";
import React from "react";
import useSWR from "swr";
import { NeynarSigninButton } from "./SignInButton";

// Define the fetcher function
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Login: React.FC = () => {
	const { signer, isLoading } = useSigner();
	//check if the signer is connected via farcaster (previous sign in) or via neynar (current sign in)
	const goodSigner = signer?.status === "approved" || signer?.is_authenticated;
	const { data: user, error } = useSWR<User>(
		goodSigner ? `/api/users/${signer.fid}` : null,
		fetcher,
	);
	const playlist = process.env.NEXT_PUBLIC_PLAYLIST?.split(",").map((fid) =>
		Number(fid.trim()),
	);

	return (
		<div>
			{(!signer || !goodSigner) && <NeynarSigninButton />}
			{signer && "fid" in signer && !playlist?.includes(signer.fid) && (
				<button
					type="button"
					className="button"
					style={{
						cursor: "not-allowed",
						backgroundColor: "grey",
						color: "white",
					}}
					disabled={true}
				>
					You are not playlisted, ask @nor
				</button>
			)}
			{/* this extra stuff added as a hacky waitlist */}
			{user && signer && "fid" in signer && playlist?.includes(signer.fid) && (
				<div className="flex flex-row items-center gap-3">
					<div className="relative h-12 w-12">
						<Image
							src={user.pfp_url || "/default-avatar.svg"}
							alt="User profile picture"
							fill
							className="rounded-full object-cover"
						/>
					</div>
					<div className="flex flex-col items-start">
						<span className="">{user.display_name}</span>
						<span className="text-center text-sm text-black/50">
							{user.username}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Login;
