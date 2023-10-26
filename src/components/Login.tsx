// src/components/Login.tsx
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSigner } from 'neynar-next';
import { User, Signer } from 'neynar-next/server'
import useSWR from 'swr';
import axios from 'axios';

// Define the fetcher function
const fetcher = ( url: string ) => axios.get(url).then(res => res.data);

interface LoginProps {
  setFarcasterSigner: React.Dispatch<React.SetStateAction<Signer | null>>;
}

const Login: React.FC<LoginProps> = ({ setFarcasterSigner }) => {
  const { signer, isLoading, signIn } = useSigner();
  const router = useRouter();
  const { data: user, error } = useSWR<User>(signer?.status === 'approved' ? `/api/users/${signer.fid}` : null, fetcher);
  const playlist = process.env.NEXT_PUBLIC_PLAYLIST?.split(',').map(fid => Number(fid.trim()));
  
  useEffect(() => {
    if (signer && 'fid' in signer) {
      if (playlist?.includes(signer.fid)) {
        console.log("you're in")
        setFarcasterSigner(signer);
      } else {
        console.log("you're not in")
        setFarcasterSigner(null);
      }
    }
  }, [signer]);

  useEffect(() => {
    if (signer && signer.status === "pending_approval") {
      router.push("/qr-code");
    }
  }, [signer, router]);

  return (
    <div>
      {!signer?.status && (
        <button
          className="button"
          style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
          onClick={signIn}
          disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign in with farcaster"}
        </button>
      )}
      {signer && "fid" in signer && !playlist?.includes(signer.fid) && (
        <button
          className="button"
          style={{ cursor: "not-allowed", backgroundColor: "grey", color: "white" }}
          disabled={true}>
          You are not playlisted, ask @nor
        </button>
      )}
      {/* this extra stuff added as a hacky waitlist */}
      {user && signer && 'fid' in signer && playlist?.includes(signer.fid) && (
        <div className="flex flex-col items-center">
          <Image
            src={user.pfp_url || "/default-avatar.svg"}
            alt="User profile picture"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <span className="text-sm text-center">{user.username}</span>
        </div>
      )}
    </div>
  );
}

export default Login;