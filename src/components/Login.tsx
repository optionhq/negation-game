// src/components/Login.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSigner } from 'neynar-next';
import { type User } from 'neynar-next/server';
import axios from 'axios';

function Login() {
  const { signer, isLoading, signIn } = useSigner();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (signer?.status === 'approved') {
      axios.get<User>(`/api/users/${signer.fid}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [signer]);

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