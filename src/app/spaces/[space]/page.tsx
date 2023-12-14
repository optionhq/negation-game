// src/pages/spaces/[space].tsx
import { useRouter } from 'next/router';
import React from "react";
import ConversationPreview from '../../../components/ConversationPreview'

export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}

function SpacePage() {
  const router = useRouter();
  const { space } = router.query;

  // Parse the NEXT_PUBLIC_SPACES environment variable into a JSON object
  const spaces = JSON.parse(process.env.NEXT_PUBLIC_SPACES || '{}');

  // Fetch the conversation identifiers for this space
  const conversationIds = spaces[space as string];

  return (
    <div className='flex flex-col gap-2 h-full items-center justify-center my-12'>
      {conversationIds?.map((id: string) => (
        <ConversationPreview key={id} id={id} />
      ))}
    </div>
  );
}

export default SpacePage;