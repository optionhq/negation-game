// src/components/Conversation.tsx
import React, { useEffect, useState } from 'react';
import { Cast } from 'neynar-next/server'
import axios from 'axios';
import Link from 'next/link';

function Conversation({ id }: { id: string }) {
  const [conversation, setConversation] = useState<Cast | null>(null);
  const [replies, setReplies] = useState<Cast[]>([]);

  useEffect(() => {
    // Fetch the conversation data when the component mounts
    axios.get(`/api/cast?type=hash&identifier=${id}`)
      .then(response => setConversation(response.data))
      .catch(error => console.error('Error fetching conversation:', error));
  }, [id]);

  useEffect(() => {
    // Fetch the top 3 voted replies
    axios.get(`/api/cast/${id}/thread`)
      .then(response => {
        // Filter the replies to only include those that have a parent_hash identical to the conversation.hash
        const filteredReplies = response.data.result.casts.filter((cast: Cast) => cast.parent_hash === id);
        // Sort the replies by votes and take the top 3
        const topReplies = filteredReplies.sort((a: Cast, b: Cast) => b.reactions.likes.length - a.reactions.likes.length).slice(0, 3);
        setReplies(topReplies);
      })
      .catch(error => console.error('Error fetching replies:', error));
  }, [id]);

  if (!conversation) {
    // The conversation data hasn't been loaded yet, so we render a loading message
    return <div>Loading conversation...</div>;
  }

  return (
    <>
      <Link href={`/spaces/purple/${id}`}>
        <div className="cursor-pointer block bg-white shadow-md rounded-lg p-6 mb-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-2">{conversation.text}</h2>
          <p className="text-md mb-2 pt-3">Top options</p>
          {replies.map(reply => (
            <div key={reply.hash} className="border-t border-gray-200 pt-4">
              <p>{reply.text}</p>
              <p className="text-right text-gray-800 text-xl font-bold mr-2 mb-2">{reply.reactions.likes.length}</p>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-grey-500 cursor-pointer">See more</p>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Conversation;