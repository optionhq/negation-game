// src/components/Login.tsx
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { LOCAL_STORAGE_KEYS } from "./constants";
import Link from "next/link";
import { useSigner } from 'neynar-next';
import useSWRImmutable from 'swr/immutable';

function Login() {
  const { signer, isLoading, signIn } = useSigner();
  const router = useRouter();

  const { data: user } = useSWRImmutable(signer?.status === 'approved' ? `/api/users/${signer.fid}` : null);

  useEffect(() => {
    if (signer && signer.status === "pending_approval") {
      console.log("signer", signer);
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
      {user && (
        <div>
          {/* Display user's profile picture and username here */}
          <Image
            src={user.profile_picture || "/default-avatar.svg"}
            alt="Description"
            width={50}
            height={50}
          />
          <span>{user.username}</span>
        </div>
      )}
    </div>
  );
}

export default Login;