// src/pages/spaces/[space].tsx
import { useRouter } from 'next/router';
import Conversation from '@/components/Conversation'

function SpacePage() {
  const router = useRouter();
  const { space } = router.query;

  // Parse the NEXT_PUBLIC_SPACES environment variable into a JSON object
  const spaces = JSON.parse(process.env.NEXT_PUBLIC_SPACES || '{}');

  // Fetch the conversation identifiers for this space
  const conversationIds = spaces[space as string];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center pt-4">Open conversations in {space}</h2>
      {conversationIds?.map((id: string) => (
        <Conversation key={id} id={id} />
      ))}
    </div>
  );
}

export default SpacePage;