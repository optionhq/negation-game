import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { LOCAL_STORAGE_KEYS } from "./constants";
import Link from "next/link";
import { FarcasterUser } from "@/types/FarcasterUser";

function Login() {
  const [loading, setLoading] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.FARCASTER_USER);
    if (storedData) {
      const user: FarcasterUser = JSON.parse(storedData);
      setFarcasterUser(user);
    }
  }, []);

  useEffect(() => {
    if (farcasterUser && farcasterUser.status === "pending_approval") {
      router.push("/qr-code");
    }
  }, [farcasterUser, router]);

  return (
    <div>
      {!farcasterUser?.status && (
        <button
          className="button"
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
          onClick={handleSignIn}
          disabled={loading}>
          {loading ? "Loading..." : "Sign in with farcaster"}
        </button>
      )}
      {farcasterUser?.status === "approved" && (
        <div>
          {/* Display user's profile picture and username here */}
          <Image
            src={farcasterUser.profile_picture || "/default-avatar.svg"}
            alt="Description"
            width={50}
            height={50}
          />
          <span>{farcasterUser.username}</span>
        </div>
      )}
    </div>
  );

  async function handleSignIn() {
    setLoading(true);
    await createAndStoreSigner();
    setLoading(false);
  }

  async function createAndStoreSigner() {
    try {
      const response = await axios.post("/api/signer");
      if (response.status === 200) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.FARCASTER_USER, JSON.stringify(response.data));
        setFarcasterUser(response.data);
      }
    } catch (error) {
      console.error("API Call failed", error);
    }
  }
}

export default Login;
