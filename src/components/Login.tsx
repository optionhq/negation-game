// src/components/Login.tsx
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSigner } from 'neynar-next';
import { type User } from 'neynar-next/server'
import useSWR from 'swr';
import axios from 'axios';

// Define the fetcher function
const fetcher = ( url: string ) => axios.get(url).then(res => res.data);

function Login() {
  const { signer, isLoading, signIn } = useSigner();
  const router = useRouter();

  // Use the useSWR hook to fetch the user data
  const { data: user, error } = useSWR<User>(signer?.status === 'approved' ? `/api/users/${signer.fid}` : null, fetcher);

  // Log the user data and error to the console
  console.log('user', user);
  console.log('error', error);

  useEffect(() => {
    if (signer && signer.status === "pending_approval") {
      router.push("/qr-code");
    }
  }, [signer, router]);

  if (!user) return null;

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
      {user && (
        <div className="flex flex-col items-center">
          <Image
            src={user.pfp.url || "/default-avatar.svg"}
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