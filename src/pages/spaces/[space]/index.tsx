// src/pages/spaces/[space].tsx
import { useRouter } from 'next/router';
import React, { useState } from "react";
import Header from '@/components/Header';
import { Signer } from "neynar-next/server";
import Conversation from '@/components/Conversation'

function SpacePage() {
  const router = useRouter();
  const { space } = router.query;
  const [farcasterSigner, setFarcasterSigner] = useState<Signer | null>(null);

  // Parse the NEXT_PUBLIC_SPACES environment variable into a JSON object
  const spaces = JSON.parse(process.env.NEXT_PUBLIC_SPACES || '{}');

  // Fetch the conversation identifiers for this space
  const conversationIds = spaces[space as string];

  return (
    <>
      <Header setFarcasterSigner={setFarcasterSigner} />
      <div>
        <h2 className="text-2xl font-bold mb-2 text-center pt-20">Open conversations in {space}</h2>
        {conversationIds?.map((id: string) => (
          <Conversation key={id} id={id} />
        ))}
      </div>
    </>
  );
}

export default SpacePage;